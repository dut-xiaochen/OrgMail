package Patch;
BEGIN {
	use DA::Init();
}
use strict;
use Getopt::Long;
use IO::File;


my $func_patch_stderr = "";


# パッチ用共通関数
# 2010/03/24 
#  
# 
################################################################################
# 汎用サブルーチン
################################################################################
sub create_session{
	my ($session) = @_;
	my $con_vars=DA::Vars::get_sys_custom({},'connection',1);
	$DA::Vars::p->{MYSQL}   = 1 if($con_vars->{'database'} eq 'mysql');
	$session->{command}     = 1;
	DA::Session::db_open($session);
	$session->{active_msid} = Patch::get_active_msid_fromdb($session);
}

sub exe_func_patch{
	
	my ($session, $dir) = @_;
	my ($command);
	my @files = &dir_files( $dir );
	@files = sort{ $a cmp $b} @files;
	
	my($st, $stdout, $stderr);
	foreach my$func_patch ( @files ){
		Patch::log("--- $func_patch start ---", 1);
		$command ="perl $func_patch";
		$command .=" -d " if( $Patch::dryrun );
		$command .=" -log=$Patch::log_level" if( 0 < $Patch::log_level );
		$command .=" -patch_dir=$Patch::patch_dir";
		
		($st, $stdout, $stderr) = &exe( "cd $dir ; $command", $Patch::log_level, 1 );
		
		Patch::log("$stdout") if($stdout);
		Patch::log("ERROR:$stderr") if($stderr);
		Patch::log("--- $func_patch end ---", 1);
		
		if($stderr){
			$func_patch_stderr .= " $stderr";
			warn "Faild at $func_patch $stderr" 
		}
	}
}

# 機能別パッチで一度でもエラーが発生したか
# 0: エラーなし
# 1: エラーあり
sub is_func_patch_err {
	return ( $func_patch_stderr ? 1 : 0 );	
}


# variable_list.datの書き換え。
# パラメータの追加があれば設定ファイルを書き換える。
# paramsの追加のみ可能
#
# paramsの既存のtypeなどの変更は不可
# CGIの追加は不可
# ruleなどのparams以外の追加、変更は不可
# 
# $rules    : cgiに追加するパラメータ名とtypeの値のハッシュ
# $rules->{/cgi-bin/block_cell.cgi} = {
#        window => 'text'
# };
# $nobackup : 
#     0: バックアップする
#     1: バックアップしない
sub rewrite_variable_list_dat {
	my ($rules, $nobackup) = @_;

	my $file = "$DA::Vars::p->{custom_dir}/variable_list.dat";
	Patch::log("# rewrite_variable_dat target : $file", 2);

	my $rewrite = 0;

	my $data = YAML::Syck::LoadFile($file);
	foreach my $key (keys %$rules) {
		if (exists $data->{$key}) {
			my $params = $data->{$key}->[0]->{params};
			my $rule = $rules->{$key};
			foreach my $param (keys %$rule) {
				my $type  = $rule->{$param};
				if (!exists $params->{$param}) {
					$params->{$param}->{'type'} = $type;
					$rewrite = 1;
				}
			}
		}
	}

	if ($rewrite) {
		unless($nobackup){
			my $date=DA::CGIdef::get_date("Y4MMDD-HHMISS");
			if(-f "$file"){
				&exe("cp -p $file $file\.$date");
			}
		}
		YAML::Syck::DumpFile($file, $data);
	}
}
# 設定ファイルの書き換え。
# パラメータの追加、更新があれば設定ファイルを書き換える。
# podの変更だけの場合は書き換えない。
# 
# $func     : ファイル名
# $mode     : 設定ファイル種類
#     0 : data/custom ディレクトリ内の設定ファイルを読み込む
#     1 : data/system ディレクトリ内の設定ファイルを読み込む
#     2 : data/custom/default ディレクトリ内の設定ファイルを読み込む
# $rules    : 書き換える、追加するパラメータ名と値のハッシュ
# $pod      : $pod->{head} : ヘッダー情報, $pod->{foot} : フッター情報
# $nobackup : 
#     0: バックアップする
#     1: バックアップしない
sub rewrite_sys_custom {
	my ($func, $mode, $rules, $pod, $nobackup) = @_;
	my ($file, @lines);
	
	if ($mode eq 1) {
		$file = "$DA::Vars::p->{system_dir}/$func\.dat";
	} elsif ($mode eq 2) {
		$file = "$DA::Vars::p->{cu_def_dir}/$func\.dat";
	} else {
		$file = "$DA::Vars::p->{custom_dir}/$func\.dat";
	}
	
	Patch::log("# rewrite_sys_custom target : $file",2);
	return "" if( $Patch::dryrun );
	
	my $fhr = new IO::File($file, "r");
	if (defined $fhr) {
		@lines = <$fhr>;
		close($fhr);
	} else {
		&patch_abort("Can't read file. [$file: $!]");
	}
	
	my $rewrite = 0;
	my $head = 1;
	my ($sep, @new_lines, %exists);
	foreach my $l (@lines) {
		$l =~ s/\r\n/\n/g; $l =~ s/(^\s+|\s+$)//;
		chomp($l);

		if ($l eq "") {
			next;
		}

		if ($pod && $pod->{head}) {
			if ($head && $l =~ /^\#/) {
				next;
			}
			$head = 0;
		}
		if ($l =~ /^#/) {
			push(@new_lines, $l . "\n");
		} else {
			my ($key, $val) = split(/[\t=]/, $l, 2);
			$key =~ s/(^\s+|\s+$)//; $val =~ s/(^\s+|\s+$)//;

			unless ($sep) {
				$sep = &_get_separator4sys_custom($l);
			}
			
			# 既存パラメータ key がルール指定されている場合
			if ( defined( $rules->{$key} ) ) {
				
				# 既存パラメータを削除するルールの場合
				if ($rules->{$key} eq "__delete") {
					$rewrite = 1;
					next;
				} else {
				
					$exists{$key} = 1;
					
					# 既存パラメータを上書きする場合
					# ( 既存パラメータの値が''である ) 
					if( $val eq  '' ){
						$rewrite = 1;
						$l = $key . &_get_separator4sys_custom($l) . $rules->{$key};
					}

					push(@new_lines, $l . "\n");
				}
			} else {
			# 既存パラメータ key がルール指定されていない場合
				$exists{$key} = 1;

				push(@new_lines, $l . "\n");
			}
		}
	}

	unless ($sep) {
		$sep = "=";
	}

	foreach my $key (sort keys %{$rules}) {
		if ($rules->{$key} eq "__delete") {
			next;
		}
		unless ($exists{$key}) {
			$rewrite = 1;
			push(@new_lines, "$key$sep$rules->{$key}\n");
		}
	}

	if ($pod || $rewrite) {
		
		unless($nobackup){
			my $date=DA::CGIdef::get_date("Y4MMDD-HHMISS");
			if(-f "$file"){
				&exe("cp -p $file $file\.$date");
			}
		}
		
		my $fhw = new IO::File($file, "w");
		if (defined $fhw) {
			$pod->{head} =~ s/\n+$//; $pod->{foot} =~ s/\n+$//;

			if ($pod->{head}) {
				print $fhw $pod->{head} . "\n";
			}
			print $fhw @new_lines;
			if ($pod->{foot}) {
				print $fhw $pod->{foot} . "\n";
			}

			unless (close($fhw)) {
				&patch_abort("Can't write file. [$file: $!]");
			}
		} else {
			&patch_abort("Can't write file. [$file: $!]");
		}
	}
}

## パラメータ行$lのセパレータを返す
sub _get_separator4sys_custom {
	my ($l) = @_;

	$l =~ /([\=\t]+)/;

	if ($1 =~ /\=/) {
		return("=");
	} else {
		return("\t");
	}
}


sub patch_abort{
	my($msg)=@_;
	print "Patch abort! : $msg\n";
	exit;
}

## DDL,DMLの実行時に使用。SELECTでは使用できない
sub execute_sql {
	my($session, $sql, $level) = @_;
	$level ||= 2;
	Patch::log("SQL: $sql",$level);
	$session->{dbh}->do($sql) unless( $Patch::dryrun );
	
}

sub exe {
	my ($cmd, $level, $force) = @_;
	$level ||= 2;
	Patch::log($cmd, $level);
	
	# dryrun時は成功ステータスを返して、終了
	# ただし $force=1の場合はdryrunでも実行
	return 0 if( $Patch::dryrun && !$force );
	
	if (wantarray) {
		my $tmp_dir = "/var/tmp";
		my $stdout_tmp = "$tmp_dir/stdout.$$." . time;
		my $stderr_tmp = "$tmp_dir/stderr.$$." . time;
		system("touch $stdout_tmp  $stderr_tmp");
		my $status = 0xffff & system("$cmd 1>$stdout_tmp 2>$stderr_tmp");
		my $stdout = &cat($stdout_tmp);
		my $stderr = &cat($stderr_tmp);
		system("rm $stdout_tmp");
		system("rm $stderr_tmp");
		return ($status, $stdout, $stderr);
	} else {
		my $status = 0xffff & system("$cmd");
		return $status;
	}
}

sub cat(@) {
	my $text = '';
	foreach my $file (@_) {
		if (DA::System::file_open(\*FILE, "<$file")) {
		$text .= $_ while sysread(FILE, $_, 2 ** 16);
		close(FILE);
		}
	}
	return $text;
}

sub log{
	my ($msg, $level) = @_;
	$level ||= 2;
	if( $level <= $Patch::log_level ){
		print("$msg\n");
	}
}

sub dir_files {
	
	my $dir = shift;
	
	CORE::opendir(DIR, $dir);
	my @files;
	while( defined( my$file =  readdir(DIR) ) ){
		next if( $file =~ /^\.|\.\.$/ );
		next unless( -f "$dir/$file");
		push(@files, $file );
	}
	return @files;
}

################################################################################
# ファイル追加・更新系
################################################################################

sub etc_copy{
    my($file,$target,$owner,$group,$permit,$backup)=@_;

#   $file     $target           実行コマンド
#   FILE      /DIR/FILE    =>   cp -p  $Patch::patch_dir/ETC/FILE /DIR/FILE
#   FILE      /DIR         =>   cp -p  $Patch::patch_dir/ETC/FILE /DIR
#   DIR/*     /DIR         =>   cp -p  $Patch::patch_dir/ETC/DIR/* /DIR
#   DIR       /DIR         =>   cp -rp $Patch::patch_dir/ETC/DIR /DIR
#
#   $backup   バックアップの作成

    Patch::log("# etc_copy", 1);

    my $command;
    if($backup){
        my $date=DA::CGIdef::get_date("Y4MMDD-HHMISS");
        if(-d "$target"){
            my @lists=glob("$Patch::patch_dir/ETC/$file");
            foreach my $path(@lists){
                my @parts=split(/\//,$path);
                my $fname = pop(@parts);
                if(-d "$target/$fname"){
                    &exe("cp -rp $target/$fname $target/$fname\.$date");
                    
                }elsif(-f "$target/$fname"){
                    &exe("cp -p $target/$fname $target/$fname\.$date");
                }
            }
        }elsif(-f "$target"){
            &exe("cp -p $target $target\.$date");
        }
    }
    if(!$owner){$owner = $DA::Vars::p->{iseadmin_user};}
    if(!$group){$group = $DA::Vars::p->{iseadmin_group};}
    if(-d "$Patch::patch_dir/ETC/$file"){
        &exe("cp -rp $Patch::patch_dir/ETC/$file $target");
    }else{
        &exe("cp -p $Patch::patch_dir/ETC/$file $target");
    }

    if(-d "$target"){
        my @path=split(/\//,$file);
        $target .= "/".pop(@path);
        if(-d "$target"){
            $target .= '/*';
        }
        $target =~s/\/+/\//g;
    }
    &exe("chown $owner:$group $target");

    if(!$permit){return;}
    &exe("chmod $permit $target");
}

sub control_copy {
    use DirHandle();
    
    Patch::log("# control_copy", 1);
    
    foreach my $type (qw(db form)) {
        foreach my $dir (qw(config default sql)) {
            my $dh = new DirHandle;
            my $base_dir;
            if ($dir eq 'sql' && $DA::Vars::p->{MYSQL}) {
                $base_dir = "$type/$dir/mysql";
            } else {
                $base_dir = "$type/$dir";
            }
            $dh->open("$Patch::patch_dir/ETC/$base_dir");
            while (my $line = $dh->read) {
                $line =~ s/\n+$//g;
                next if ($line =~ /^\./);
                my $file    = "$base_dir/$line";
                next if (-d "$Patch::patch_dir/ETC/$file");
                next if ($file =~ /(?:utf)/);
                my $target;
                if ($dir eq 'sql' && $DA::Vars::p->{MYSQL}) {
                    $target = "$DA::Vars::p->{ctl_dir}/$type/$dir/mysql/$line";
                }else{
                    $target = "$DA::Vars::p->{ctl_dir}/$type/$dir/$line";
                }
                &etc_copy($file, $target, $DA::Vars::p->{iseadmin_user},
                                        $DA::Vars::p->{iseadmin_group}, '644');
            }
            $dh->close;
        }

        #configureスクリプト関する処理
        my $configure_file = "$type/configure";
        if (-e "$Patch::patch_dir/ETC/$configure_file") {
            my $target = "$DA::Vars::p->{ctl_dir}/$type/configure";
            &etc_copy($configure_file, $target, $DA::Vars::p->{iseadmin_user},
                                    $DA::Vars::p->{iseadmin_group}, '750');
        }
    }

}
sub guide_update {
    
    Patch::log("# guide_update", 1);
    
    if(-e "$Patch::patch_dir/ETC/user_guide.tgz"){
        &exe("rm -rf   $DA::Vars::p->{base_dir}/insuite/guide/*", 3);
        &exe("tar zxf  $Patch::patch_dir/ETC/user_guide.tgz -C $DA::Vars::p->{guide_dir}", 3);
        &exe("chown -R $DA::Vars::p->{iseadmin_user}.$DA::Vars::p->{iseadmin_group} $DA::Vars::p->{guide_dir}", 3);
        &exe("rm       $DA::Vars::p->{index_dir}/user_guide/*", 3);
        &exe("tar zxf  $Patch::patch_dir/ETC/u_guide_index.tgz -C $DA::Vars::p->{index_dir}/user_guide", 3);
        &exe("chown    $DA::Vars::p->{www_user}.$DA::Vars::p->{www_group} $DA::Vars::p->{index_dir}/user_guide/*", 3);
    }
    if(-e "$Patch::patch_dirETC/admin_guide.tgz"){
        &exe("rm -rf   $DA::Vars::p->{base_dir}/insuite/admin/guide/*", 3);
        &exe("tar zxf  $Patch::patch_dir/ETC/admin_guide.tgz -C $DA::Vars::p->{ad_guide_dir}", 3);
        &exe("chown -R $DA::Vars::p->{iseadmin_user}.$DA::Vars::p->{iseadmin_group} $DA::Vars::p->{ad_guide_dir}", 3);
        &exe("rm       $DA::Vars::p->{index_dir}/admin_guide/*", 3);
        &exe("tar zxf  $Patch::patch_dir/ETC/a_guide_index.tgz -C $DA::Vars::p->{index_dir}/admin_guide", 3);
        &exe("chown    $DA::Vars::p->{www_user}.$DA::Vars::p->{www_group} $DA::Vars::p->{index_dir}/admin_guide/*", 3);
    }
}


sub sql_copy {
    use DirHandle();
    my ($sql_file) = @_;
    
    Patch::log("# sql_copy", 1);

    my $sql_dir = "SQL";

    if ($DA::Vars::p->{MYSQL}) {
        foreach my $file ( @{$sql_file} ) {
            if (-e "$Patch::patch_dir/ETC/$sql_dir/mysql/$file") {
                &etc_copy("$sql_dir/mysql/$file", "$DA::Vars::p->{data_dir}/sql/mysql/",
                    $DA::Vars::p->{iseadmin_user}, $DA::Vars::p->{iseadmin_group}, '644');
            }else{
				warn "Not Found. ${Patch::patch_dir}/ETC/$sql_dir/mysql/$file";
			}
        }
    } else {
        foreach my $file ( @{$sql_file} ) {
            if (-e "$Patch::patch_dir/ETC/$sql_dir/$file") {
                &etc_copy("$sql_dir/$file", "$DA::Vars::p->{data_dir}/sql/",
                    $DA::Vars::p->{iseadmin_user}, $DA::Vars::p->{iseadmin_group}, '644');
            } else {
				warn "Not Found. ${Patch::patch_dir}/ETC/$sql_dir/$file";
			}
        }
        if (-d "$DA::Vars::p->{data_dir}/sql/UTF-8") {
            foreach my $file ( @{$sql_file} ) {
                if (-e "$Patch::patch_dir/ETC/$sql_dir/UTF-8/$file") {
                    &etc_copy("$sql_dir/UTF-8/$file", "$DA::Vars::p->{data_dir}/sql/UTF-8/",
                        $DA::Vars::p->{iseadmin_user}, $DA::Vars::p->{iseadmin_group}, '644');
                } else {
					warn "Not Found. ${Patch::patch_dir}/ETC/$sql_dir/UTF-8/$file";
            	}
			}
        }
    }
}

sub trans_utf_catalogue {
    my ($session, @target_lang) = @_;
    
    Patch::log("# trans_utf_catalogue", 1);
    
    my $mes_dir = "$DA::Vars::p->{msg_dir}/UTF-8";
    foreach my $lang (@target_lang) {
        my $dir = "$mes_dir/$lang";
        if (-e "$dir/01lang.po") {
            &exe("msgfmt -o $dir/01lang.mo $dir/01lang.po");
        }
        if (-e "$dir/30core.po") {
            &exe("msgfmt -o $dir/30core.mo $dir/30core.po");
        }
    }
    return;
}

################################################################################
## DBオブジェクトのチェック
################################################################################

sub check_exist {
    my ($session,$table,$column)=@_;
    my ($sql,$sth);
    if ($DA::Vars::p->{MYSQL}) {
        my $db_name    = $DA::Vars::p->{res}->{sid};
        $sql="SELECT column_name FROM information_schema.columns WHERE table_schema='$db_name' AND table_name='$table' AND column_name='$column'";

    } else {
        $table =~tr/[a-z]/[A-Z]/; $column=~tr/[a-z]/[A-Z]/;
        $sql="SELECT COLUMN_NAME FROM ALL_COL_COMMENTS ".
        "WHERE TABLE_NAME='$table' AND COLUMN_NAME='$column'";
    }
    $sth=$session->{dbh}->prepare($sql); $sth->execute();
    my $exist=$sth->fetchrow; $exist=~s/\s+$//; $sth->finish;
    return ($exist);
}

sub check_exist_table {
    my ($session,$table,$column)=@_;
    my ($sql,$sth);

    $table =~ s/\#$/_0/;

    if ($DA::Vars::p->{MYSQL}) {
        my $db_name = $DA::Vars::p->{res}->{sid};
        $sql="SELECT table_name FROM information_schema.columns "
        ."WHERE table_schema='$db_name' AND table_name='$table' AND column_name='$column'";
    }elsif ($DA::Vars::p->{POSTGRES}) {
        $sql="SELECT a.attname FROM pg_class c, pg_attribute a "
        ."WHERE c.relname='$table' AND a.attnum > 0 "
        ."AND a.attrelid=c.oid AND a.attname='$column'";
    } else {
        $table =~tr/[a-z]/[A-Z]/; $column=~tr/[a-z]/[A-Z]/;
        $sql="SELECT COLUMN_NAME FROM ALL_COL_COMMENTS ".
        "WHERE TABLE_NAME='$table' AND COLUMN_NAME='$column'";
    }
    $sth=$session->{dbh}->prepare($sql); $sth->execute();
    my $exist=$sth->fetchrow; $exist=~s/\s+$//; $sth->finish;
    return ($exist);
}

sub check_exist_index {
    my ($session, $table, $index)   = @_;
    my ($sql);

    if ($DA::Vars::p->{MYSQL}) {
        my $db_name = $DA::Vars::p->{res}->{sid};
        $sql     ="SELECT index_name FROM information_schema.statistics ";
        $sql    .="WHERE table_name='$table' AND table_schema='$db_name' AND index_name='$index'";

    } elsif ($DA::Vars::p->{POSTGRES}) {
        $sql    = "select relname from pg_class where oid in "
                . "(select indexrelid from pg_index where indrelid "
                . "= (select oid from pg_class where relname = '$table')) "
                . "and relname='$index'";
    } else {
        $sql    = "select index_name from all_indexes where table_name='$table' "
                . "and index_name='$index'";
        $sql    = uc ($sql);
    }
    my $sth     = $session->{dbh}->prepare($sql); $sth->execute();
    my $exist   = $sth->fetchrow; $exist =~ s/\s+$//; $sth->finish;

    return ($exist);
}

sub get_all_views {
	my ($session) = @_;
	my $views = {};

	my $sql;
	if ( $DA::Vars::p->{MYSQL} ) {
        my $db_name = $DA::Vars::p->{res}->{sid};
		$sql = "select table_name from INFORMATION_SCHEMA.TABLES where table_schema='$db_name' and TABLE_TYPE='VIEW' ";
	} else {
		$sql = "select view_name from all_views where view_name like 'IV_%'";
	}
	my $sth = $session->{dbh}->prepare($sql); $sth->execute();
	while (my ($view) = $sth->fetchrow) {
		$views->{$view} = 1;
	}
   	$sth->finish;

    return ($views);
}

################################################################################
## DBオブジェクトの更新・作成
################################################################################

sub create_table{
	my ($session,$sql_file,$table ) = @_;
	my (@sql_list, $sql, $index);
	
	my $file;
	if( $DA::Vars::p->{MYSQL}){
		$file = "$DA::Vars::p->{data_dir}/sql/mysql/$sql_file\.sql";
	}elsif ($DA::Vars::p->{POSTGRES}) {
		$file = "$DA::Vars::p->{data_dir}/sql/postgres/$sql_file\.sql";
	} else {
		if ( DA::Unicode::internal_charset() eq 'UTF-8' ) {
			$file = "$DA::Vars::p->{data_dir}/sql/UTF-8/$sql_file\.sql";
		} else {
			$file = "$DA::Vars::p->{data_dir}/sql/$sql_file\.sql";
		}
	}
	
	unless ( -e $file ){
		warn "Not Found. $file";
		return;
	}
	DA::System::file_open(\*IN, $file);
	
	if ($table =~ /^is_(wf_route_group_\d{6})$/i) { 
		$index = "IX_" . $1; 
	}
	while(my $line=<IN>){
		chomp($line);
		
		$line =~ s/\-TABLE_NAME\-/$table/g;
		$line =~ s/\-INDEX_NAME\-/$index/g if ($index); 
		$line =~ s/\-DB_USER\-/$DA::Vars::p->{res}->{'id'}/;
		$line =~ s/\-DB_ADMIN\-/$DA::Vars::p->{res}->{'adminid'}/;
		# テーブルスペースの定義 (Oracleのみ)
		
		my ($tb_users, $tb_idx);
		if ($DA::Vars::p->{oracle_attr}->{'tb_users'} ne '') {
			$tb_users	= "TABLESPACE $DA::Vars::p->{oracle_attr}->{'tb_users'}";
		}
		if ($DA::Vars::p->{oracle_attr}->{'tb_idx'} ne '') {
			$tb_idx		= "TABLESPACE $DA::Vars::p->{oracle_attr}->{'tb_idx'}";
		}
		$line =~ s/\-TB_USERS\-/$tb_users/;
		$line =~ s/\-TB_IDX\-/$tb_idx/;
		
		$line =~ s/\&\&TABLE_NAME\.?/$table/gi;
        $line =~ s/\&\&TB_SPACE\.?/$tb_users/gi;
        $line =~ s/\&\&IDX_SPACE\.?/$tb_idx/gi;

		if ( $line =~ s/;// ) {
			$sql.=$line;
			push (@sql_list, $sql);
			$sql = undef;
		} else {
			$sql.=$line;
		}
	}
	close(IN);

	$session->{dbh}->{RaiseError}=1;
	$! = undef;
	eval {
		foreach my $sql (@sql_list) {
			Patch::execute_sql($session, $sql);
		}
	};

	if ( $@ || $! ) {
		$session->{dbh}->rollback();
		DA::Error::Log($session,$@);
	} else {
		eval {
			$session->{dbh}->commit();
		};
		if ( $@ || $! ) {
			DA::Error::system_error($session);
		}
	}
	
	DA::DB::remake_all_db_tables($session,$table);
}

sub drop_table{
	my ($session,$table)=@_;

	my $sql1;
	if($DA::Vars::p->{POWERGRES_PLUS}){
		$sql1="DELETE FROM $table";
	}else{
		$sql1="DROP TABLE $table";
		if ($DA::Vars::p->{ORACLE10G}) {
			$sql1 .= " PURGE";
		}
	}

	$session->{dbh}->{RaiseError}=1;
	$! = undef;
	eval {
		#my $sth=$db->{dbh}->do($sql1);
		execute_sql($session, $sql1);
	};

	if ( $@ || $! ) {
		$session->{dbh}->rollback();
		DA::Error::Log($session,$@);
	} else {
		eval {
			$session->{dbh}->commit();
		};
		if ( $@ || $! ) {
			DA::Error::system_error($session);
		}
	}
	
	if(!$DA::Vars::p->{POWERGRES_PLUS}){
		DA::DB::remake_all_db_tables($session,$table,'drop');
	}
}

sub create_index {
    my ($session, $table, $index, $column) = @_;
    local $session->{dbh}->{PrintError} = 0;
    local $session->{dbh}->{RaiseError} = 1;
    unless (&check_exist_index($session, $table, $index)) {
        if ($DA::Vars::p->{POSTGRES}) {
            DA::Session::trans_init($session);
            eval {
                my $sql = "create index $index on $table($column)";
                &execute_sql($session, $sql);
            };
            if ($@ && $@ !~ /(?:$index)/) {
                &patch_abort("Failed create index $index!\nreason[$@]");
            } else {
                $session->{dbh}->commit();
            }
        } else {
            my $tbspace;
            if ($DA::Vars::p->{oracle_attr}->{'tb_idx'} ne ''){
                $tbspace="tablespace $DA::Vars::p->{oracle_attr}->{'tb_idx'}";
            }
            DA::Session::trans_init($session);
            eval {
                my $sql = "create index $index on $table($column) $tbspace";
                &execute_sql($session, $sql);
            };
            if ($@ && $@ !~ /(?:ORA-00955)/) {
                &patch_abort("Failed create index $index!\nreason[$@]");
            } else {
                $session->{dbh}->commit();
            }
        }
    }
}

sub submit_sql{
    my($session,$file)=@_;
    my $sql_dir = "$Patch::patch_dir/SQL";
    $file =~ s/\#$//;
    $file.= ".sql";
    if (-d $sql_dir){
		unless (-e "$sql_dir/$file"){
        	warn "Not Found. $sql_dir/$file";
			return; 
        }
		my ($sql, $sth);
        open(IN,"$sql_dir/$file");
        while (my $line = <IN>){
            chomp($line);
            if(!$line){next;}
            if($line=~/^(\-|set)/){next;}
            $line=~s/\s+$//;
            if($line=~/\;$/){
                $line=~s/\;$//;
                $sql.=" $line";
                $sql=N_($sql);
                DA::Session::trans_init($session);
                eval {
                    &execute_sql($session, $sql);
                };
                if (!DA::Session::exception($session)) {
                    &patch_abort("Failed submit sql $file!!\n( $@ )\n");
                }
                $sql='';
            }else{
                $sql.=" $line";
            }
        }
        close(IN);
    }
}

sub submit_sql_file{
    my($session, $file)=@_;
    $file =~ s/\#$//;
    $file.= ".sql";
    my $sql_dir = "$Patch::patch_dir/ETC/SQL";
    if ($DA::Vars::p->{MYSQL}) {
        $sql_dir .= "/mysql";
    }
    if (-d $sql_dir){
		unless (-e "$sql_dir/$file") {
			warn "Not Found. $sql_dir/$file";
			return;
        }
		my ($sql, $sth);
        open(IN,"$sql_dir/$file");
        while (my $line = <IN>){
            chomp($line);
            if(!$line){next;}
            if($line=~/^(\-|set)/){next;}
            $line=~s/\s+$//;
            if($line=~/\;$/){
                $line=~s/\;$//;
                $sql.=" $line";
                DA::Session::trans_init($session);
                eval {
                    &execute_sql($session, $sql);
                };
                if (!DA::Session::exception($session)) {
                    &patch_abort("Failed submit sql $file!!\n( $@ )\n");
                }
                $sql='';
            }else{
                $sql.=" $line";
            }
        }
        close(IN);
    }
}

sub submit_sql_view_tmp_lang{
    my($session, $file, $lang_list, $separate, $target)=@_;
    $file =~ s/\#$//;
    $file.= ".sql";
    my $sql_dir = "$Patch::patch_dir/ETC/SQL";
    if ($DA::Vars::p->{MYSQL}) {
        $sql_dir .= "/mysql";
    }
    if (-d $sql_dir){
		
		unless (-e "$sql_dir/$file") {
			warn "Not Found. $sql_dir/$file";
        	return;
		}
        my ($sql, $sth);
        open(IN,"$sql_dir/$file");
        while (my $line = <IN>){
            chomp($line);
            if(!$line){next;}
            if($line=~/^(\-|set)/){next;}
            $line=~s/\s+$//;
            if($line=~/\;$/){
                $line=~s/\;$//;
                $sql.=" $line";
                DA::Session::trans_init($session);
                eval {
                    foreach my $lang (@{$lang_list}) {
                        my $l = $lang->{code};
                        my $do_sql  = $sql;
                        my $view    = "iv_".$target."_$l";
                        my $table   = "is_".$target."_$l";
                        my $master  = "is_".$target;
                        if ($table =~ /(?:tmp)/) {
                            $table =~ s/(?:tmp_)//;
                        }
                        $do_sql =~ s/\&\&VIEW_NAME/$view/gi;
                        $do_sql =~ s/\&\&TABLE_NAME/$table/gi;
                        $do_sql =~ s/\&\&MASTER_NAME/$master/gi;
                        $do_sql =~ s/\&\&SEPARATE/$separate/gi;
                        &execute_sql($session, $do_sql);
                    }
                };
                if (!DA::Session::exception($session)) {
                    &patch_abort("Failed submit sql $file!!\n( $@ )\n");
                }
                $sql='';
            }else{
                $sql.=" $line";
            }
        }
        close(IN);
    }
}


sub remake_all_db_tables{
	my ($session,$table,$mode)=@_;
#   $table  =  テーブル指定
#   $mode   =  'drop'  テーブル削除

	if ($mode eq 'drop' && !$table){ return; }

	my $db_admin = $DA::Vars::p->{res}->{adminid};
	$db_admin =~ tr/a-z/A-Z/ if (!$DA::Vars::p->{POSTGRES});
	my @all_tables;
	my($sql,$sth);
	if (!$table) {
		if ( $DA::Vars::p->{MYSQL} ){
			my $db_name = $DA::Vars::p->{res}->{sid};
			$sql ="SELECT table_name  FROM information_schema.tables "
				 ."WHERE table_schema='$db_name' AND  table_name NOT LIKE 'seq_%' "
				 ."AND table_type='BASE TABLE' ";

		}elsif ($DA::Vars::p->{POSTGRES}) {
			$sql="SELECT c.relname,c.relowner FROM pg_class c, pg_user u "
				."WHERE c.relkind = 'r' AND c.relname !~ '^pg_' "
				."AND u.usesysid = c.relowner AND u.usename=?";
		} else {
			$sql="SELECT table_name FROM all_tables WHERE owner=?";
			if ($DA::Vars::p->{ORACLE10G}) {
				$sql .= " AND dropped=?";
			}
		}
		$sth=$session->{dbh}->prepare($sql);
		if ( ! $DA::Vars::p->{MYSQL} ){
		$sth->bind_param(1, $db_admin, 1);
		if ($DA::Vars::p->{ORACLE10G}) {
			$sth->bind_param(2, 'NO', 1);
			}
		}
		$sth->execute();
		while(my($name)=$sth->fetchrow){
			$name =~ tr/[A-Z]/[a-z]/;
			next if ($name =~ /\W/); # ignore bin$8dbaqxr0a6pgmkjaewozna==$0
			push(@all_tables,$name);
		}
		$sth->finish;
	}
	DA::Session::trans_init($session);
	eval {
		my($sql,$sth);
		if ($table) {
			$sql="DELETE FROM is_all_tables WHERE table_name=?";
			$sth=$session->{dbh}->prepare($sql);
			$sth->bind_param(1, $table, 1);
			$sth->execute();

			if ($mode eq 'drop') {
			} else {
				$sql="INSERT INTO is_all_tables (table_name) values (?)";
				$sth=$session->{dbh}->prepare($sql);
				$sth->bind_param(1, $table, 1);
				$sth->execute();
			}
		} else {
			$sql="DELETE FROM is_all_tables";
			$sth=$session->{dbh}->prepare($sql);
			$sth->execute();

			$sql="INSERT INTO is_all_tables (table_name) values (?)";
			$sth=$session->{dbh}->prepare($sql);
			foreach my $table(@all_tables){
				$sth->bind_param(1, $table, 1);
				$sth->execute();
			}
		}
	};
	if( $@ ){
		
		$session->{dbh}->rollback();
		DA::Error::Log($session,$@);

		DA::Error::system_error($session);
	}else{
		
		$session->{dbh}->commit();
			
		my $cache_file = DA::Cache::get_cache_file($session, "tables", "is_all_tables");
		DA::Cache::delete_cache($session, $cache_file);
	}
}


sub copy_httpd_conf {
        my ($session) = @_;

        Patch::log("# copy_httpd_conf ", 2);
        return "" if( $Patch::dryrun );

        #my $linux;
        #my $inifile = "/usr/local/etc/is_enterprise.ini";
        #open (IN, "$inifile");
        #while (<IN>) {
        #        $_=~s/\r//g; $_=~s/\n//g;
        #        if ($_=~/^Linux=(.*)/i) { $linux="$1"; }
        #}
        #close(IN);
		
        ## V3.1 時点ではRH5,CentOS だけがサポート対象
		## RH3/httpd.conf の内容を ETC/httpd.confに置き換えている
        #Patch::etc_copy("httpd.conf/ETC/httpd.conf", "$DA::Vars::p->{base_dir}/setup/base/", 'root','root','0644');

        # Apache2対応
        if (-e "$Patch::patch_dir/ETC/httpd.conf/ETC/httpd.conf.v1_3") {
                Patch::etc_copy("httpd.conf/ETC/httpd.conf.v1_3", "$DA::Vars::p->{base_dir}/setup/base/", 'root','root','0644');
        }
        if (-e "$Patch::patch_dir/ETC/httpd.conf/ETC/httpd.conf.v2_2") {
                Patch::etc_copy("httpd.conf/ETC/httpd.conf.v2_2", "$DA::Vars::p->{base_dir}/setup/base/", 'root','root','0644');
        }

		#if ($linux =~ /Red\s*Hat\s*Enterprise\s*Linux\s*[AE]S\s*release\s*3\s*/
        #||  $linux =~ /Red\s*Hat\s*Enterprise\s*Linux\s*Server\s*release\s*5\s*.*/) {
        #         Patch::etc_copy("httpd.conf/RH3/httpd.conf", "$DA::Vars::p->{base_dir}/setup/base/", 'root','root','0644');
        #} else {
        #         Patch::etc_copy("httpd.conf/ETC/httpd.conf", "$DA::Vars::p->{base_dir}/setup/base/", 'root','root','0644');
        #}
}


sub get_active_msid_fromdb($) {
        my ($session) = @_;

        my $sql = "SELECT msid FROM is_master WHERE status=?";
        my $sth = $session->{dbh}->prepare($sql);
           $sth->bind_param(1, 1, 3);
           $sth->execute();

        my ($msid) = $sth->fetchrow(); $sth->finish();

        return( $msid ? $msid : undef ) ;
}

1;
