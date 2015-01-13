package DA::IS;
###################################################
##  INSUITE(R)Enterprise Version 1.5.0.          ##
##  Copyright(C)2001-2008 DreamArts Corporation. ##
##  All rights to INSUITE routines reserved.     ##
###################################################
BEGIN {
	use Crypt::CBC();
	use Compress::Zlib;
	use Carp;
    use DA::MultiLang();
	use DA::System();
	use DA::Gettext;
	use DA::Cache();
	use DA::Ajax();
	use DA::Ajax::API();
	use DA::System();
	use Time::HiRes qw(usleep);
	use Digest::MD5;
	use File::Compare();
	use MIME::Base64;
}
use DA::Menu();
use DA::Unicode();
use strict;

# get_count用
our $WAIT	= 10000;
our $RETRY	= 30000;

# get_download_url, get_download_target用外部変数
my $PREV_PARAM = {};

sub get_keep_default {
	my ($session, $target) = @_;
	# $target: "fileshare" or "library"
	my $conf = DA::IS::get_sys_custom($session, $target);
	if (exists $conf->{keep_default}) {
		return int($conf->{keep_default});
	} else {
		return 10;
	}
}

sub get_icon_data {
	my ($mode)=@_;
	my $icons={};
    DA::System::file_open(\*IN,"$DA::Vars::p->{data_dir}/custom/object.dat");
    while (my $line=<IN>) {
        chomp($line);
        my ($big,$small,$value)=split(/:/,$line);
        $big=~s/^\s+//; $big=~s/\s+$//;
        $small=~s/^\s+//; $small=~s/\s+$//;
        $value=~s/^\s+//; $value=~s/\s+$//;
		$icons->{$value}->{big}=$big;
		$icons->{$value}->{small}=$small;
    }
    close(IN);
	return ($icons);
}

sub get_object_icon {
	my ($ext,$mode,$icons,$size)=@_;

	my $icon;
	if (!$icons) { $icons=DA::IS::get_icon_data(); }
	foreach my $key (%$icons) {
		if ($ext=~/^$key$/i) {
			$icon=($mode eq 'small') ? $icons->{$key}->{small} 
									 : $icons->{$key}->{big};
			last;
		}
	}
	if (!$icon) { 
		$icon=($mode eq 'small') ? "object_non_s.gif" : "object_non.gif";
	}
	if ($size eq 14) {
		$icon=~s/_s\.gif$/_xs\.gif/;
	}
	return ($icon);
}

sub view_thumbnail_ok {
	my ($file, $th_file) = @_;
	my $th_ok = 0; # サムネイル表示が可能かどうか判定する
	my $th_size = -s $th_file;
	if ($th_size) {
		if ($file =~ /\.(jpg|jpeg|pjpg|gif|bmp|png)$/io) {
			$th_ok = 1;
		} elsif ((-s $file) != ($th_size)) {
			$th_ok = 1;
		} elsif (File::Compare::compare($file, $th_file)) {
			$th_ok = 1;
		}
	}
	return $th_ok;
}

sub rssreader_ok {
	my ($session) = @_;

	if ($DA::Vars::p->{perllib_dir} =~ /5\.6\.0$/) {
		return(0);
	} else {
		return(1);
	}
}

# -----------------------------------------------------------------------------
# ロジックの中身はget_mailer_tag2に移行(Sugaya)
# get_mailer_tag2は複数回呼ばれる場合にmoduleやユーザタイプ等データを
# 都度実行しなくてすむように引数として渡すことができます。
# -----------------------------------------------------------------------------
sub get_mailer_tag {
    my ($session,$to,$option,$code,$mode)=@_;
	# $mode = 0 : $to はメールアドレス
	#       = 1 : $to は一括送信用 aid

    my $module=DA::IS::get_module($session);
	my $conf = DA::IS::get_popup_size($session);

	return DA::IS::get_mailer_tag2($session,
						to 			=> $to,
						option		=> $option,
						code		=> $code,
						mode		=> $mode,
						module		=> $module,
						conf		=> $conf);
}

sub get_mailer_tag2 {
	my $session	= shift;
	my %args	= @_;
	# $args{to};
	# $args{option};
	# $args{code};
	# $args{mode};
	# $args{module};	# DA::IS::get_module
	# $args{conf}; 		# DA::IS::get_popup_size 

	# $mode = 0 : $to はメールアドレス
	#       = 1 : $to は一括送信用 aid
    my $mailer_tag;

	# 先頭の空白文字
	$args{to} =~ s/^((?:\s)|(?:\xA1\xA1))//;
	# 末尾の空白文字
	my $eucpre = qr{(?<!\x8F)};
	$args{to} =~ s/$eucpre((?:\s)|(?:\xA1\xA1))+$//;

	if ($args{to} ne '') {
		$mailer_tag="<img src=\"$session->{icon_rdir}/ico_fc_mail.$session->{icon_ext}\" "
		."width=14 height=14 border=0 align=top alt=\"@{[t_('メール')]}\">";
		if ($args{code} eq 'UTF-8') {
			$mailer_tag=DA::Charset::convert(\$mailer_tag, 'EUC-JP', 'UTF-8');
		}
    } else {
		return undef;
	}
	my $mailer=($session->{mailer} eq 'insuite') ? 'on' : 'off';

    if (($mailer ne 'on' || $args{module}->{mail} ne 'on' || $session->{type} eq 3 || $session->{type} eq 4) &&
		($args{mode} ne 1)) { 
		if ($args{mode}) {
			my ($sql, $sth);
			$sql="SELECT email FROM is_mail_addr WHERE aid=?";
			$sth=$session->{dbh}->prepare($sql);
			$sth->bind_param(1,$args{to},3); $sth->execute();
			$args{to} = '';
			while(my($email)=$sth->fetchrow){
				$email =~s/\s+$//;
				$args{to}.="$email,";
			}
			$sth->finish;
			$args{to}=~s/\,$//o;
		}
		$args{to} = &uri_escape($args{to}, "@");
		if (DA::IS::check_new_mail_link($session)) {
			$mailer_tag.=($args{option}) ? "<A HREF=\"mailto:$args{to}\" $args{option}>" 
							   : "<A HREF=\"mailto:$args{to}\">";
		}
    }else{
		$args{to} = unpack("H*", $args{to});
		my $param	= {
			"proc"		=> "set",
			"mode"		=> "pop",
			"to"		=> $args{to},
			"pack"		=> 1,
			"status"	=> ($args{mode}) ? "aid" : ""
		};
		$mailer_tag .=DA::IS::get_pop_tag($session, 0, $param, "", "", "", "", $args{option}, $args{conf});
    }
    #=============================
    #     Custom
    #=============================
    DA::Custom::rewrite_get_mailer_tag($session, \%args, \$mailer_tag);
    #=============================
    
    return $mailer_tag;
}

sub __get_mailer_tag {
    my ($session,$to,$option,$code,$mode)=@_;
    # $mode = 0 : $to はメールアドレス
    #       = 1 : $to は一括送信用 aid
    my $mailer_tag;

    # 先頭の空白文字
    $to =~ s/^((?:\s)|(?:\xA1\xA1))//;
    # 末尾の空白文字
    my $eucpre = qr{(?<!\x8F)};
    $to =~ s/$eucpre((?:\s)|(?:\xA1\xA1))+$//;

    if ($to ne '') {
        $mailer_tag="<img src=\"$session->{icon_rdir}/ico_fc_mail.$session->{icon_ext}\" "
        ."width=14 height=14 border=0 align=top alt=\"@{[t_('メール')]}\">";
        if ($code eq 'UTF-8') {
            $mailer_tag=DA::Charset::convert(\$mailer_tag, 'EUC-JP', 'UTF-8');
        }
    } else {
        return undef;
    }
    my $mailer=($session->{mailer} eq 'insuite') ? 'on' : 'off';
    my $module=DA::IS::get_module($session);

    my $sql="SELECT type FROM is_member WHERE mid=?";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,$session->{user},3); $sth->execute();
    my $type=$sth->fetchrow; $type =~ s/\s*$//; $sth->finish;

    if ($mailer ne 'on' || $module->{mail} ne 'on' || $type eq 3 || $type eq 4) {
        if ($mode) {
            $sql="SELECT email FROM is_mail_addr WHERE aid=?";
            $sth=$session->{dbh}->prepare($sql);
            $sth->bind_param(1,$to,3); $sth->execute();
            $to = '';
            while(my($email)=$sth->fetchrow){
                $email =~s/\s+$//;
                $to.="$email,";
            }
            $sth->finish;
            $to=~s/\,$//o;
        }
        $to = &uri_escape($to, "@");
        $mailer_tag.=($option) ? "<A HREF=\"mailto:$to\" $option>"
                               : "<A HREF=\"mailto:$to\">";
    }else{
        $to = unpack("H*", $to);
        my $param   = {
            "proc"      => "set",
            "mode"      => "pop",
            "to"        => $to,
            "pack"      => 1,
            "status"    => ($mode) ? "aid" : ""
        };
        $mailer_tag .=DA::IS::get_pop_tag($session, 0, $param, "", "", "", "", $option);
    }
    return $mailer_tag;
}

sub get_pop_tag {
    my ($session, $mode, $param, $cgi, $img, $no, $noname, $option, $conf) = @_;
    my $popup   = ($conf) ? $conf : DA::IS::get_popup_size($session);
    my $WIDTH   = $popup->{width_ma};
    my $HEIGHT  = $popup->{height_ma};
    my $POS_X   = $popup->{pos_x_ma};
    my $POS_Y   = $popup->{pos_y_ma};
    my ($tag);

    if ($cgi eq "") {
        $cgi    = "ma_new.cgi";
    }
    if ($img eq "") {
        $img    = "pop_title_mkeml.gif";
    }
    if ($option ne "") {
        $option = " $option";
    }
    if (ref($param) eq "HASH") {
        my (@param);
        foreach my $key (sort keys %{$param}) {
            push (@param, "$key=$param->{$key}");
        }
        if (scalar(@param)) {
            $cgi .= "\%3f" . join ("\%20", @param);
        }
    } elsif ($param ne "") {
        $cgi .= "\%3f" . $param;
    }

    # $cgiで処理を分ける場合
    if ($cgi =~ /(ma_new\.cgi)/) {
        if ($mode == 3) {
            $tag    = DA::Ajax::new_mail_url($session, "Pop('$cgi,'$img',$WIDTH,$HEIGHT,'$no','$noname','$POS_X','$POS_Y');");
        } elsif ($mode == 2) {
            $tag    = "<a href=\"javascript:"
                    . DA::Ajax::new_mail_url($session, "Pop('$cgi,'$img',$WIDTH,$HEIGHT,'$no','$noname','$POS_X','$POS_Y');")
                    . "\"$option>";
        } elsif ($mode == 1) {
            $tag    = DA::Ajax::new_mail_url($session, "Pop('$cgi','$img',$WIDTH,$HEIGHT,'$no','$noname','$POS_X','$POS_Y');");
        } else {
            $tag    = "<a href=\"javascript:"
                    . DA::Ajax::new_mail_url($session, "Pop('$cgi','$img',$WIDTH,$HEIGHT,'$no','$noname','$POS_X','$POS_Y');")
                    . "\"$option>";
        }
    } else {
        if ($mode == 3) {
            $tag    = DA::Ajax::object_mail_url($session, "Pop('$cgi,'$img',$WIDTH,$HEIGHT,'$no','$noname','$POS_X','$POS_Y');");
        } elsif ($mode == 2) {
            $tag    = "<a href=\"javascript:"
			        . DA::Ajax::object_mail_url($session, "Pop('$cgi,'$img',$WIDTH,$HEIGHT,'$no','$noname','$POS_X','$POS_Y');")
			        . "\"$option>";
        } elsif ($mode == 1) {
            $tag    = DA::Ajax::object_mail_url($session, "Pop('$cgi','$img',$WIDTH,$HEIGHT,'$no','$noname','$POS_X','$POS_Y');");
        } else {
            $tag    = "<a href=\"javascript:"
			        . DA::Ajax::object_mail_url($session, "Pop('$cgi','$img',$WIDTH,$HEIGHT,'$no','$noname','$POS_X','$POS_Y');")
			        . "\"$option>";
        }
    }

	unless (DA::IS::check_new_mail_link($session)) {
		if ($mode == 3 || $mode == 1) {
			$tag	= "";
		} else {
			$tag	= "<a>";
		}
	}

    return ($tag);
}

sub get_gmail_tag {
    my($session,$gid)=@_;
    my $param   = {
        "proc"  => "gsend",
        "mode"  => "pop",
        "gid"   => $gid
    };
    my $atag    = DA::IS::get_pop_tag($session, 0, $param);
    my $tag     = "$atag<img src=$session->{img_rdir}/aqbtn_emlsend.gif width=59 "
                . "height=15 border=0 alt=\"@{[t_('メンバーにメール送信')]}\"></a>";

#===========================================
#     Custom
#===========================================
	DA::Custom::rewrite_address_mailicon($session,$gid,\$tag);
#===========================================
	if (!DA::IS::check_new_mail_link($session) || !DA::MasterManager::is_active_from_session($session)) {
		$tag = "";
	}

    return $tag;
}

sub get_mobile_prev {
	my ($win,$mode)=@_;
	my $open=($mode eq 'open') ? "+'&open=1'" : "";
    my $file=($win eq 'imode') ? "imode_prev.tmpl" : "palm_prev.tmpl";
	my $tmpl = HTML::Template->new(
		filename => "$DA::Vars::p->{tmpl_dir}/$file",
		cache  => 1
	);
	$tmpl->param( 
		CGI_RDIR => $DA::Vars::p->{cgi_rdir},
		OPEN_FLG => $open
	);
	return ($tmpl->output);
}

sub Guest_Frame {
	my ($session)=@_;
	$session->{group}=$session->{user};
	DA::Session::update($session);

	my $tmpl = HTML::Template->new(
		filename => "$DA::Vars::p->{tmpl_dir}/guest_frame.tmpl",
		cache  => 1
	);
	$tmpl->param( 
		TITLE => "INSUITE " . t_("ファイル共有"), 
		CGI_RDIR => $DA::Vars::p->{cgi_rdir},
	);

    DA::IS::print_data($session,$tmpl->output);
	$session->{dbh}->disconnect;
	Apache::exit();
}

sub set_env {
	
	if (exists $DA::Vars::p->{"db_env_readed"} && $DA::Vars::p->{"db_env_readed"} eq "1") {
		foreach my $db_env (qw(LANG ORACLE_SID ORACLE_HOME NLS_LANG)) {
		  	$ENV{$db_env} = $DA::Vars::p->{$db_env};
		}
		return;
	}
	DA::System::file_open(\*IN,"$DA::Vars::p->{base_dir}/system/etc/db_env");
	while (my $line=<IN>) {
		chomp($line);
		if ($line=~/^export\s+(LANG|ORACLE_SID|ORACLE_HOME|NLS_LANG)\=(.*)/i) {
			$ENV{$1}=$2;
			$DA::Vars::p->{$1}=$2;
		}
	}
	close(IN);
	if (DA::Unicode::internal_charset() eq "UTF-8") {
		if ($ENV{NLS_LANG} !~ /UTF8$/o) {
			$ENV{NLS_LANG} = "Japanese_Japan.AL32UTF8";
			$DA::Vars::p->{NLS_LANG} = "Japanese_Japan.AL32UTF8";
		}
	}
	$DA::Vars::p->{"db_env_readed"}="1";

	return;
}

sub conv_href{
    my($session,$data,$imode,$code,$last,$report) = @_;
#	$last　:　末尾の改行が保留
#   $report: 1レポートの場合

	$data .= "\n" if ($last);
    my $result = '';  my $skip = 0;
    my($regex,$regex_ex);
    if($imode){
        if(DA::SmartPhone::isSmartPhoneUsed()){
            $regex_ex = qq{($DA::Vars::p->{http_URL_regex}|$DA::Vars::p->{map_URL_regex}|$DA::Vars::p->{map_STR_regex}|$DA::Vars::p->{tel_URL_regex}|$DA::Vars::p->{tel_STR_regex}|($DA::Vars::p->{mail_regex_ex}|$DA::Vars::p->{mail_STR_regex}))};
            $regex    = qq{($DA::Vars::p->{http_URL_regex}|$DA::Vars::p->{map_URL_regex}|$DA::Vars::p->{map_STR_regex}|$DA::Vars::p->{tel_URL_regex}|$DA::Vars::p->{tel_STR_regex}|($DA::Vars::p->{mail_regex}|$DA::Vars::p->{mail_STR_regex}))};
        }else{
            $regex_ex = qq{($DA::Vars::p->{http_URL_regex}|$DA::Vars::p->{tel_URL_regex}|($DA::Vars::p->{mail_regex_ex}))};
            $regex    = qq{($DA::Vars::p->{http_URL_regex}|$DA::Vars::p->{tel_URL_regex}|($DA::Vars::p->{mail_regex}))};
		}
    }else{
        $regex_ex = qq{($DA::Vars::p->{http_URL_regex}|$DA::Vars::p->{ftp_URL_regex}|($DA::Vars::p->{mail_regex_ex}))};
        $regex    = qq{($DA::Vars::p->{http_URL_regex}|$DA::Vars::p->{ftp_URL_regex}|($DA::Vars::p->{mail_regex}))};
    }
    ######### Custom #########
    DA::Custom::rewrite_conv_href_regex($session,\$regex,\$regex_ex);

    foreach my $text_tmp(split(/<br>/,$data)){
    	unless ($report && $text_tmp =~ /\<A HREF\=\"(.*)\"\>/i) {
	        $text_tmp =~ s{$regex_ex}
	            {my($org, $mail) = ($1, $2);
	             if($mail){$org=$mail;}
                     my $add_text;
                     if ($mail !~ /^$DA::Vars::p->{mail_STR_regex}$/) {
	                 my $d_org = DA::CGIdef::decode($org,0,1);
	                 if($d_org =~ /$regex/){
	                     my($org2, $mail2) = ($1, $2);
	                     if($mail2){$org2=$mail2;}
	                     $org2 = DA::CGIdef::encode($org2,0,1,'euc');
	                     if($org ne $org2){
	                         $add_text = $org;
	                         $org = $org2;
	                         $org2=quotemeta($org2);
	                         $add_text =~ s/$org2//;
	                     }else{
	                         $add_text='';
	                     }
	                 }else{
	                     $add_text='';
    	                 }
                     }
	             (my $tmp = $org) =~ s/"/&quot;/g;
	             if($mail ne ''){
	                 $org =~ s/^(mailto:|\&lt\;|\&quot\;)//; $org =~ s/(\&gt\;|\&quot\;)$//;
	                 $tmp =~ s/^(mailto:|\&lt\;|\&quot\;)//; $tmp =~ s/(\&gt\;|\&quot\;)$//;
	                 if($imode){
                             if (DA::SmartPhone::isSmartPhoneUsed()) {
                                 $tmp = DA::SmartPhone::mail_tag($session, "email", "", $tmp, "", 1);
                             } else {
                                 $tmp = DA::Imode::get_im_mailer_tag($session,$tmp,$imode);
                             }
	                 }else{
	                     $tmp = DA::IS::get_mailer_tag($session,$tmp,'',$code,0);
	                 }
                         if ($mail =~ /^mailto:/) {
                             if (DA::SmartPhone::isSmartPhoneUsed()) {
                                 $add_text = DA::SmartPhone::native_mail_tag($session, $org) . $add_text;
                             }
	                     $tmp = 'mailto:' . $tmp;
                         } else {
                             if (DA::SmartPhone::isSmartPhoneUsed()) {
                                 if ($mail =~ /^(\&lt\;|\&quot\;)/) {
                                     $tmp = $1 . $tmp;
                                 }
                                 if ($mail =~ /(\&gt\;|\&quot\;)$/) {
                                     $add_text = $1;
                                 }
                                 $add_text = DA::SmartPhone::native_mail_tag($session, $org) . $add_text;
                             }
                         }
	             }else{
	                 $tmp = DA::IS::conv_access_url($tmp);
	             }
	             my($change, $nochange);
	             if($imode){
	                 if($tmp =~ /^tel:/i){
	                    $org =~ s/^tel://i;
	                    $tmp = "tel:<A HREF=\"$tmp\">";
	                    $change = 1;
                         }elsif($tmp =~ /^(map:)/i){
                            my $head = $1;
                            $org =~ s/^map://i;
                            $tmp =~ s/^map://i;
                            $tmp =  "$head" . &get_maps_link($tmp);
                            $change = 1;
                         }elsif($tmp =~ /^$DA::Vars::p->{map_STR_regex}$/) {
                            $tmp =~ s/^(?:[\xa2][\xa9]|[\xe3][\x80][\x92])(?:[\s]*)//;
                            $tmp =  &get_maps_link($tmp);
                            $change = 1;
	                 }elsif($tmp =~ /^$DA::Vars::p->{tel_STR_regex}$/) {
                            if ($tmp =~ /^\-/ || $tmp =~ /\-$/) {
                               $nochange = 1;
                            } else {
                               my @d = $tmp =~ /\d/g; my @h = $tmp =~ /\-/g;
                               if (10 <= scalar(@d) && scalar(@d) <= 18
                               &&  scalar(@h) <= 3) {
                                  if ($tmp =~ /^(?:\+\d+\-?)?(?:\(\d+\)\-?\d+\-?\d+|\d+\-?\(\d+\)\-?\d+|[\d\-]+)$/) {
                                     $tmp = "<A HREF=\"tel:$tmp\">";
                                     $change = 1;
                                  } elsif ($tmp =~ /^(.*?)(\d{10,18})(.*)$/) {
                                     $tmp = "$1<A HREF=\"tel:$2\">";
                                     $org = $2;
                                     $add_text = $3;
                                     $change = 1;
                                  } else {
                                     $nochange = 1;
                                  }
                               } else {
                                  $nochange = 1;
                               }
                            }
                         }
	             }
	             if($imode){
			if ($nochange) {
			  $tmp;
			} else {
	                  (($mail ne '' || $change) ? "$tmp" : "<A HREF=\"$tmp\" target=_blank>" ) . "$org</A>$add_text";
			}
	             }else{
	                  ($mail ne '' ? "$tmp" : "<A HREF=\"$tmp\" target=_blank>" ) . "$org</A>$add_text";
	             }}eg;
    		 }
             $result .= $text_tmp. '<br>';
        }

		$result =~ s/\n\<br\>$// if ($last);
	
    DA::Custom::rewrite_conv_href_result($session,$data,$imode,$code,\$result);

    return $result;
}

sub get_maps_link($$) {
	my ($str, $opt) = @_;
	my $link;

	if ($str ne "") {
		my $q = $str; $q =~ s/\d+(?:[F]|[\xef][\xbc][\xa6]|[\xff][\x26])\s*$//g;
		   $q = DA::Unicode::convert_to_query($q);

		$link = "<A HREF=\"http://maps.google.com/maps?q=" . DA::CGIdef::uri_escape($q) . "\" target=_blank>";

		if ($opt) {
			$link .= enc_($str) . "</A>";
		}
	}

	return($link);
}

sub get_module {
	my ($session,$admin, $mode)=@_;
	# $admin = 0 : プライマリグループの設定を反映する
	# $admin = 1 : プライマリグループの設定を反映しない(オーナー権限、管理画面用)
	#              また、クライアントライセンスの場合は dat が off でなければ常に on となる（従来動作：説明追加）
	# $admin = 2 : modules.datをそのまま返す（管理画面の表示メニュー用）

    # $mode 特殊ケースの指定
    # $mode = 1 : $admin = 1 であっても、プライマリグループの設定を取得/反映する（グループオーナー操作向け）

    my $module={};

	# data/system/login.dat の設定反映
	if (!$admin && $DA::Vars::p->{login}->{module}) {
		if (ref($session->{module}) eq 'HASH') {
			$module=$session->{module};
			return ($module);
		}
	}

	my $begin_t=DA::DeBug::time_init();
    DA::System::file_open(\*IN,"$DA::Vars::p->{data_dir}/custom/modules.dat");
    while (my $line=<IN>) {
		chomp($line);
        my ($key,$value)=split(/[\t=]/,$line,2);
        $module->{$key}=$value;
    }
	close(IN);

    if ($admin eq '2') { # $admin=2 の場合が消えているので復活
        return $module;
    }

    my $org_module = {};
    %$org_module = %$module;

	# ライセンスの確認 ----------
    # V2.3.3〜 新ライセンス体系の判定
    if ($DA::IsLicense::op->{tool_ver}) {

        if ($DA::IsLicense::op->{core}) {
            if (!$module->{board})      { $module->{board}='on'; }
            if (!$module->{address})    { $module->{address}='on'; }
            if (!$module->{group_info}) { $module->{group_info}='on'; }
            if (!$module->{search})     { $module->{search}='on'; }
        } else {
           $module->{board}='off';
           $module->{address}='off';
           $module->{group_info}='off';
           $module->{search}='off';
        }

        if ($DA::IsLicense::op->{groupware}) {
            if (!$module->{newest}) { $module->{newest}='on'; }
            if (!$module->{share})  { $module->{share}='on'; }
        } else {
            $module->{newest}='off';
            $module->{share}='off';
        }

        if ($DA::IsLicense::op->{scheduler}) {
            if (!$module->{schedule}) { $module->{schedule}='on'; }
            if (!$module->{task})     { $module->{task}='on'; }
            if (!$module->{report})   { $module->{report}='on'; }
        } else {
            $module->{schedule}='off';
            $module->{task}='off';
            $module->{report}='off';
        }
        $module->{reminder} = ($module->{schedule} eq 'on') ? 'on' : 'off';

        if ($DA::IsLicense::op->{library}) {
            if (!$module->{library}) { $module->{library}='on'; }
        } else {
            $module->{library}='off';
        }

        # if ($DA::IsLicense::op->{mail}) {         # mod for client license
        if ($DA::IsLicense::op->{mail} eq '1') {
   	        if (!$module->{mailist}) { $module->{mailist}='on'; }
        } else {
            $module->{mailist}='off';
        }

        if ($DA::IsLicense::op->{eip}) {
            if (!$module->{userinfo})  { $module->{userinfo}='on'; }
            if (!$module->{link})      { $module->{link}='on'; }
            if (!$module->{smartpage}) { $module->{smartpage}='on'; }
            if (!$module->{notice})    { $module->{notice}='on'; }
    	    if (!$module->{dcm})       { $module->{dcm}='off';} # DCM はデフォルト OFF
            if (!$module->{sidelink})  { $module->{sidelink}='on'; }
            if (!$module->{rssreader}) { $module->{rssreader}='on'; }
            if (!DA::IS::rssreader_ok($session)) {
                $module->{rssreader}='off';
            }
        } else {
            $module->{userinfo}='off';
            $module->{link}='off';
            $module->{smartpage}='off';
            $module->{notice}='off';
            $module->{dcm}='off';
            $module->{sidelink}='off';
            $module->{rssreader}='off';
        }


    # V2.3.3 より前（旧体系）のライセンスの判定
    } else {
        if (!$module->{schedule}) { $module->{schedule}='on'; }
        if (!$module->{board}) { $module->{board}='on'; }
        if (!$module->{address}) { $module->{address}='on'; }
        if (!$module->{newest}) { $module->{newest}='on'; }
        if (!$module->{sidelink}) { $module->{sidelink}='on'; }  # V2.3.3 追加(表示メニューの on/off は現在存在しない)
        if (!$module->{group_info}) { $module->{group_info}='on'; }
        if (!$module->{rssreader}) { $module->{rssreader}='on'; }
        if (!DA::IS::rssreader_ok($session)) {
            $module->{rssreader}='off';
        }
        if (!$module->{smartpage}) { $module->{smartpage}='on'; }
        if ($DA::IsLicense::op->{library}) {
            if (!$module->{library}) { $module->{library}='on'; }
        } else {
            $module->{library}='off';
        }
        if (!$module->{share}) { $module->{share}='on'; }
        if (!$module->{search}) { $module->{search}='on'; }
        if (!$module->{userinfo}) { $module->{userinfo}='on'; }
        if (!$module->{link}) { $module->{link}='on'; }
        if (!$module->{task}) { $module->{task}='on'; }
        if ($DA::IsLicense::op->{eip}) {
            if (!$module->{notice}) { $module->{notice}='on'; }
    	    if (!$module->{dcm}) { $module->{dcm}='off';} # DCM はデフォルト OFF
        } else {
            $module->{notice}='off';
            $module->{dcm}='off';
        }
   	    if (!$module->{mailist}) { $module->{mailist}='on'; }
        if (!$module->{report}) {
            if ($module->{schedule} eq 'on') {
                 $module->{report}='on';
            } else {
                 $module->{report}='off';
            }
        }
        $module->{reminder} = ($module->{schedule} eq 'on') ? 'on' : 'off';
    }
    #----------

	if ($DA::IsLicense::op->{wflow}) {
        if (!$module->{workflow}) { $module->{workflow}='on'; }
        if (!$module->{wf}) { $module->{wf}='on'; }
        if (!$module->{cc}) { $module->{cc}='on'; }
    }else{
        $module->{workflow}='off';
        $module->{wf}='off';
        $module->{cc}='off';
    }

	if ($DA::IsLicense::op->{mail}) {
    	if (!$module->{mail}) { $module->{mail}='on';}
    } else {
        $module->{mail}='off';
    }

	foreach my $type (keys %{$DA::Vars::p->{hibiki}}) {
		if ($type eq "smartdb") {
			if ($DA::IsLicense::op->{"hibiki_" . $type}) {
				if ($admin || $session->{"lic_h_" . $type}) {
					$module->{"hibiki_" . $type} = 'on';
					$module->{hibiki_smartcabinet} = 'on';
				} else {
					$module->{"hibiki_" . $type} = 'off';
					$module->{hibiki_smartcabinet} = 'off';
				}
			} else {
				$module->{"hibiki_" . $type} = 'off';
				$module->{hibiki_smartcabinet} = 'off';
			}
		} else {
			if ($DA::IsLicense::op->{"hibiki_" . $type}) {
				if ($admin || $session->{"lic_h_" . $type}) {
					$module->{"hibiki_" . $type} = 'on';
				} else {
					$module->{"hibiki_" . $type} = 'off';
				}
			} else {
				$module->{"hibiki_" . $type} = 'off';
			}
		}
	}

    # for new client license
    # 下位クライアントライセンス名(option_app.dat での名称）と $module 要素名との関係
    my $lic_module_map = {
        # c_license  => 対応する $module 要素名('|' 区切り)
        portal    => "link|sidelink|notice",
        dcm       => "dcm",
        rssreader => "rssreader",
        smartpage => "smartpage",
        groupware => "newest",
        share     => "share",
        scheduler => "schedule|task|report|reminder",
        library   => "library",
        wflow     => "workflow|wf|cc"
    };

    # V2.3.3 新ライセンス体系 (V2.4.0 時に実装)
    if ($DA::IsLicense::op->{tool_ver}) {
    foreach my $type (keys %{$DA::Vars::p->{option_app}}) {
            if ($type eq 'ajxmailer') { next; } # 電子メールはループ外で判定される

            # 親 SL が存在
            if ($DA::IsLicense::op->{$DA::Vars::p->{parent_serv_license}->{$type}}) { next; }

            my $ok = 0;

            # 全体でクライアントライセンスが指定されている場合
            if ($DA::IsLicense::op->{$type."_client"}) {
            if ($admin || $session->{"lic_" . $type}) {
                    $ok = 1;
                }
            }
            if ($ok) {
                foreach my $m (split(/\|/, $lic_module_map->{$type})) {
                    if ($org_module->{$m} ne 'off') {
                        $module->{$m} = 'on';
                    } else {
                        $module->{$m} = 'off';
                    }
                }
            } else {
                foreach my $m (split(/\|/, $lic_module_map->{$type})) {
                    $module->{$m} = 'off';
                }
            }
        }

    # V2.3.3 よりも前の旧ライセンス体系
    } else {
        foreach my $type (keys %{$DA::Vars::p->{option_app}}) {
            # 新体系で追加されたものはスルーしなければ OFF になってしまう
            if ($type =~ /$DA::Vars::p->{new_client_lic_regex}/) {
                next;
            }
            if ($DA::IsLicense::op->{$type."_client"}) {
                if ($admin || $session->{"lic_" . $type}) {
                $module->{$type} = 'on';
            } else {
                $module->{$type} = 'off';
            }
        } else {
            $module->{$type} = 'off';
        }
    }
    }

    #---------------------------------------------
    # Webメールオプション OFF で メールクライアントオプション有りの場合

    # V2.3.3 以降の新ライセンス体系の場合 (V2.4.0 実装時に修正)
    if ($DA::IsLicense::op->{tool_ver}) {
    if ($DA::IsLicense::op->{mail} eq '2') {
        if ($admin || $session->{"lic_ajxmailer"}) {
                if ($org_module->{mail} ne 'off') {
            $module->{mail}   ='on';
                }
                if ($org_module->{mailist} ne 'off') {
                    $module->{mailist}='on';
                }
            } else {
                $module->{mail}   ='off';
                $module->{mailist}='off';
            }
        }

    # V2.1.1〜 V2.3.3 より前の旧ライセンス体系の場合
    } else {
        if ($DA::IsLicense::op->{mail} eq '2') {
            if ($admin || $session->{"lic_ajxmailer"}) {
                $module->{mail}   ='on';
        } else {
            $module->{mail}   ='off';
        }
    }
    }
    #---------------------------------------------

	if ($admin && $mode ne '1') { return($module); }

	# プライマリグループ設定
	if ($session->{primary}) {
    	my $dir="$DA::Vars::p->{data_dir}/master/$session->{primary}";
    	if (! -d "$dir") {
        	DA::System::file_mkdir($dir, 0755);
        	my $res=DA::System::file_chown(
                	$DA::Vars::p->{www_user},
                	$DA::Vars::p->{www_group},
                	( $dir )
        	);
    	}
		if (-f "$dir/.modules\.dat") {
    		my $p_module={};
    		DA::System::file_open(\*IN,"$dir/.modules\.dat");
    		while (my $line=<IN>) {
				chomp($line);
        		my ($key,$value)=split(/[\t=]/,$line,2);
				if ($key=~/hibiki/) { next; }
				if ($key=~/^ajx/) { next; }
				if ($value eq 'off') { $module->{$key}='off'; }
    		}
			close(IN);
		}
	}

	if ($module->{schedule} eq 'on') { $module->{reminder}='on'; }

    #=====================================================
    #           ----custom----
    #=====================================================
    DA::Custom::rewrite_module($session,$module);

	DA::DeBug::time_log("get_module ", 
		"DA:IS:get_module:$session->{user}", $begin_t);
    return ($module);
}

sub save_temp{
    my ($session,$param,$file,$cr)=@_;
	# $cr!=1
	# 改行を含むデータを保存する場合に利用
	# 改行コードをタブに変換
    if(!$file){return 0;}
	my $begin_t=DA::DeBug::time_init();
	my $OUT = DA::Unicode::file_open("$session->{temp_dir}/$file", "w");
	if (!defined $OUT){return 0;}
	foreach my $key (keys %$param) {
		my $val = $param->{$key};
		if ($cr) {
        	$val=~s/\x0D\x0A/\t/g;
        	$val=~s/\x0D/\t/g;
        	$val=~s/\x0A/\t/g;
		}
		print $OUT "$key=$val\n";
	}
	close($OUT);
	DA::DeBug::time_log("save_temp [$file]", 
		"DA:IS:save_temp:$session->{user}", $begin_t);
    return 1;
}

sub save_temp_db {
	my ($session, $param, $key, $table, $AutoCommit) = @_;

	unless (defined $AutoCommit) {
		$AutoCommit = 1;
	}

	return unless (defined $param);

	unless (defined $table) {
		my $mid = $session->{user};
		$mid =~ /([1-9]?\d)$/;
		$table = "is_temp_".$1;
	}

	my $db = DA::Serializer::DB->new(
							dbh     => $session->{dbh},
							table   => $table,
							id      => $key,
							data    => $param,
							autocommit  => $AutoCommit);
	my $result;
	eval {
		$result = $db->store();
	};

	return $result if ($result eq 1);

	if ($AutoCommit) {
		if ($@) {
			Carp::confess "$@";
		} elsif ($result ne '') {
			DA::CGIdef::errorpage($session, $result, 'out');
		}
	} else { 
		if ($@) {
			Carp::confess "$@";
		} elsif ($result ne '') {
			Carp::confess $result;
		}
	}
}

sub clone_temp_db {
	my ($session, $key, $source_key, $table, $AutoCommit) = @_;

	unless (defined $AutoCommit) {
		$AutoCommit = 1;
	}

	unless (defined $table) {
		my $mid = $session->{user};
		$mid =~ /([1-9]?\d)$/;
		$table = "is_temp_".$1;
	}

	my $db = DA::Serializer::DB->new(
						dbh         => $session->{dbh},
						table       => $table,
						id          => $key,
						source_id   => $source_key,
						autocommit  => $AutoCommit);

	my $result;
	eval {
		$result = $db->clone();
	};

	return $result if ($result eq 1);

	if ($AutoCommit) {
		if ($@) {
			Carp::confess "$@";
		} elsif ($result ne '') {
			DA::CGIdef::errorpage($session, $result, 'out');
		}
	} else {
		if ($@) {
			Carp::confess "$@";
		} elsif ($result ne '') {
			Carp::confess $result;
		}
	}
}

sub get_temp{
    my ($session,$file,$cr,$opt)=@_;
	# $cr!=1
	# 改行コードを含んだデータを読み出す場合
	# タブを改行に変換
    # $opt=1
    # key に'='を含むデータの読み出し(value には'='を含まない)
	my $begin_t=DA::DeBug::time_init();
    my $param={};
	my $IN = DA::Unicode::file_open("$session->{temp_dir}/$file", "r");
	if (defined $IN) {
	if (!$opt) {
	    while(defined(my $line = <$IN>)){
        	chomp($line);
       		my($key,$val)=split(/=/,$line,2);
			if ($cr) { $val=~s/\t/\n/g; }
        	$param->{$key}=$val;
    	}
    } else {
        while(defined(my $line = <$IN>)) {
            chomp ($line);
            my ($key, $val) = ($1, $2) if ($line =~ /^(.+)=([^=]+)$/);
            if ($cr) { $val=~s/\t/\n/g; }
            $param->{$key}=$val;
        }
    }
	close($IN);
	}
	DA::DeBug::time_log("get_temp [$file]", 
		"DA:IS:get_temp:$session->{user}", $begin_t);
    return ($param);
}

sub get_temp_db {
	my ($session, $key, $table) = @_;
	my $begin_t=DA::DeBug::time_init();

	unless (defined $table) {
		my $mid = $session->{user};
		$mid =~ /([1-9]?\d)$/;
		$table = "is_temp_".$1;
	}

	my $db = DA::Serializer::DB->new(
							dbh     => $session->{dbh},
							table   => $table,
							id      => $key);

	my $clone;
	eval {
		$clone = $db->retrieve();
	};

	DA::DeBug::time_log("get_temp_db [$key, $table]", 
		"DA:IS:get_temp_db:$session->{user}", $begin_t);
	if ($@) {
		confess "$@";
	} else {
		return ($clone eq 0) ? undef : $clone;
	}
}

sub save_sort_temp{
    my ($session,$param,$file,$cr)=@_;
    if(!$file){return 0;}
    my $OUT = DA::Unicode::file_open("$session->{temp_dir}/$file", "w");
    if (!defined $OUT){return 0;}
    foreach my $value(sort values %$param){
        my($no,$key,$val)=split(/:/,$value,3);
        if ($cr) {
            $val=~s/\x0D\x0A/\t/g;
            $val=~s/\x0D/\t/g;
            $val=~s/\x0A/\t/g;
        }
        print $OUT "$key=$val\n";
    }
    close ($OUT);
    return 1;
}

sub get_sort_temp{
    my ($session,$file,$cr)=@_;
    my %param;
    my $no = 0;
    my $IN = DA::Unicode::file_open("$session->{temp_dir}/$file", "r");
    if (defined $IN) {
    	while(defined(my $line = <$IN>)){
        	chomp($line);
        	my($key,$val)=split(/=/,$line,2);
        	if ($cr) { $val=~s/\t/\n/g; }
        	$param{$key} = sprintf("%06d:$key:$val",++$no);
    	}
		close($IN);
	}
    return (\%param);
}

sub rm_temp {
    my ($session,$file)=@_;
    if(!$file){return 0;}
    DA::Unicode::file_unlink("$session->{temp_dir}/$file");
}

sub rm_temp_db {
	my ($session, $key, $table, $AutoCommit) = @_;

	unless (defined $AutoCommit) {
		$AutoCommit = 1;
	}

	unless (defined $table) {
		my $mid = $session->{user};
		$mid =~ /([1-9]?\d)$/;
		$table = "is_temp_".$1;
	}

	my $db = DA::Serializer::DB->new(
						dbh     => $session->{dbh},
						table   => $table,
						id      => $key);

	my $result;
	eval {
		$result = $db->clear();
	};

	if ($@) {
		confess "$@";
	} else {
		return $result;
	}
}

# -- マルチバイト文字列が含まれるマスタ設定ファイル
my $include_multibyte_master_file = {
	portal => 1, 
	mail => 1,
	imap => 1,
	imap_enabled => 1,
	address => 1, 
	smart_ftp => 1, 
	ajxmailer => 1,
	ajxmailer_enabled => 1,
};

my $enabled_master_file = {
	imap_enabled => "imap",
	ajxmailer_enabled => "ajxmailer",
};

my $cache_master_file = {
	base => 1,
	portal => 1,
	address => 1,
	imap => 1,
	imap_enabled => 1,
	ajxmailer => 1,
	ajxmailer_enabled => 1,
};

sub save_master{
    my ($session,$param,$func,$mode)=@_;
	# $mode =1 : システムのデフォルト値を設定
    if (!$func){return 0;}
	unless ($mode) { $mode = 0; }

	# mail -> ajxmailer for mobile
	if ($func eq "mail") {
		if ($ENV{SCRIPT_NAME} =~ /\/i\/cgi\-bin\/im\_(?:[a-zA-Z]+)\_[^\/\.]+\.cgi/) {
			if (DA::Ajax::mailer_ok($session)) {
				$func = "ajxmailer";
			}
		}
	}

	my $dir;
	my $OUT;
	my $begin_t = DA::DeBug::time_init();
	if ($mode eq 1) {
		$dir="$DA::Vars::p->{data_dir}/master/default";
		if (exists $enabled_master_file->{$func}) {
			$func = $enabled_master_file->{$func};
		}
		if (exists $include_multibyte_master_file->{$func}) {
			$OUT = DA::Unicode::file_open("$dir/$func\.dat", "w");
		} else {
			$OUT = DA::System::iofile_new("$dir/$func\.dat", "w");
		}
		if (defined $OUT) {
			foreach my $key (sort keys %$param) {
				print $OUT "$key=$param->{$key}\n";
			}
			close ($OUT);
			my $filename = "$dir/$func\.dat";
			if (exists $include_multibyte_master_file->{$func}) {
				$filename = DA::Unicode::get_filename($filename);
			}
			# ファイルのオーナーを設定
        	DA::System::file_chown($DA::Vars::p->{www_user},$DA::Vars::p->{www_group},($filename,"$filename\.utf"));
		}
	} else {
		$dir="$DA::Vars::p->{data_dir}/master/$session->{user}";
		if (! -d "$dir") {
    		DA::System::file_mkdir($dir, 0755);
        	DA::System::file_chown($DA::Vars::p->{www_user},$DA::Vars::p->{www_group},($dir));
		}
		if (exists $include_multibyte_master_file->{$func}) {
			$OUT = DA::Unicode::file_open("$dir/.$func\.dat", "w");
		} else {
			$OUT = DA::System::iofile_new("$dir/.$func\.dat", "w");
		}
		if (defined $OUT) {
			foreach my $key (sort keys %$param) {
				print $OUT "$key=$param->{$key}\n";
			}
			close ($OUT);
			my $filename = "$dir/.$func\.dat";
			if (exists $include_multibyte_master_file->{$func}) {
				$filename = DA::Unicode::get_filename($filename);
			}
			# ファイルのオーナーを設定
        	DA::System::file_chown($DA::Vars::p->{www_user},$DA::Vars::p->{www_group},($filename, "$filename\.utf"));

			# セッション情報の更新
			if ($DA::Vars::p->{ma_cache_master4ajx} eq "on") {
				if (exists $cache_master_file->{$func}) {
					if (exists $session->{ajxmailer} && exists $session->{ajxmailer}->{$func}) {
						delete $session->{ajxmailer}->{$func};
						DA::Session::update($session);
					}
				}
			}
		}
	}

	# --- memcached
	if ( DA::FS::is_memcached_module() && DA::FS::enabled() ) {
		if ($mode) {
			DA::FS::delete_cache($session, "master:$session->{user}\:$func\.0");
			DA::FS::delete_cache($session, "master:$session->{user}\:$func\.1");
			DA::FS::delete_cache($session, "master:$session->{user}\:$func\.0\.1");
			DA::FS::delete_cache($session, "master:$session->{user}\:$func\.1\.1");
		} else {
			DA::FS::delete_cache($session, "master:$session->{user}\:$func\.0");
			DA::FS::delete_cache($session, "master:$session->{user}\:$func\.2");
			DA::FS::delete_cache($session, "master:$session->{user}\:$func\.0\.1");
			DA::FS::delete_cache($session, "master:$session->{user}\:$func\.2\.1");
		}
	}

	DA::DeBug::time_log("save_master [$func]", "IS:save_master:$session->{user}", $begin_t);

    return 1;
}

sub get_master{
    my ($session,$func,$mode,$opt)=@_;
	# $mode:0 get default value if do not find user's master file
	# $mode:1 get default value (only)
	# $mode:2 get user's master value (only)
	# $opt: 1 do not remove space 

	my $param={};
	unless ($mode) {
		$mode = 0;
	}

	# mail -> ajxmailer for mobile
	if ($func eq "mail") {
		if ($ENV{SCRIPT_NAME} =~ /\/i\/cgi\-bin\/im\_(?:[a-zA-Z]+)\_[^\/\.]+\.cgi/) {
			if (DA::Ajax::mailer_ok($session)) {
				$func = "ajxmailer";
			}
		}
	}

	# --- memcached
	my $memcached_key;
	if ( DA::FS::is_memcached_module() && DA::FS::enabled()) {
		$memcached_key = "master:$session->{user}\:$func\.$mode";
		if ($opt) {
			$memcached_key.='.1';
		}
		if (my $cache = DA::FS::get_cache_lazy($session, $memcached_key)) {
			return($cache);
		}
	}

	# data/system/login.dat の設定反映
	if (!$mode && $DA::Vars::p->{login}->{$func}) {
		if (ref($session->{master}->{$func}) eq 'HASH') {
			%$param=%{$session->{master}->{$func}};
			return ($param);
		}
	}
	my $begin_t=DA::DeBug::time_init();
	if ($mode ne 2) {
		my $DEF;
		my $default;
		if (exists $enabled_master_file->{$func}) {
			$default = $enabled_master_file->{$func};
		} else {
			$default = $func;
		}
		if (exists $include_multibyte_master_file->{$func}) {
			$DEF = DA::Unicode::file_open("$DA::Vars::p->{data_dir}/master/default/$default\.dat", "r");
		} else {
			$DEF = DA::System::iofile_new("$DA::Vars::p->{data_dir}/master/default/$default\.dat", "r");
		}
		if(defined $DEF){
        	while(my $line = <$DEF>){
            	chomp($line);
				if ($line=~/^\#/) { next; }
            	my($key,$val)=split(/[\t=]/,$line,2);
				if (!$opt) {
            		$key=~s/^\s+//; 
					$key=~s/\s+$//;
            		$val=~s/^\s+//; 
					$val=~s/\s+$//;
					if ($func !~ /^(mail|imap|imap_enabled|ajxmailer|ajxmailer_enabled)$/) {
            			if ($val eq '') { next; }
					}
				}
            	$param->{$key}=$val;
        	}
    		close($DEF);
    	}
	}
	if ($mode ne 1) {
		my $USER;
		if (exists $include_multibyte_master_file->{$func}) {
			$USER = DA::Unicode::file_open("$DA::Vars::p->{data_dir}/master/$session->{user}/.$func\.dat", "r");
		} else {
			$USER = DA::System::iofile_new("$DA::Vars::p->{data_dir}/master/$session->{user}/.$func\.dat", "r");
		}
		if (defined $USER) {
    		while(my $line = <$USER>){
        		chomp($line);
				if ($line=~/^\#/) { next; }
        		my($key,$val)=split(/[\t=]/,$line,2);
				if (!$opt) {
					$key=~s/^\s+//; 
					$key=~s/\s+$//;
					$val=~s/^\s+//; 
					$val=~s/\s+$//;
					if ($func !~ /^(mail|imap|imap_enabled|ajxmailer|ajxmailer_enabled)$/) {
						if ($val eq '') { next; }
					}
				}
				if ($func =~ /^(mail|imap|imap_enabled|ajxmailer|ajxmailer_enabled)$/) {
					if ($DA::Vars::p->{'master_' . $func} =~ /^(default)$/i) {
						$param->{$key}=(exists $param->{$key})? $param->{$key} : $val;
					} else {
						$param->{$key}=$val;
					}
				} else {
      		  		$param->{$key}=$val;
				}
    		}
			close($USER);
		}
	}
	if($func eq 'base'){
		my $ma_custom = DA::IS::get_sys_custom($session,'mail');
		if($ma_custom->{force_mailer_style} =~ /^(ajax|classic)$/){
			$param->{mailer_style} = $ma_custom->{force_mailer_style};
		}
	}
	if ($func eq 'smart' || $func eq 'library' || $func eq 'fileshare'){
		my $private_f=DA::IS::get_sys_custom($session,'private_folder');
		if ($private_f->{$func} eq 'off' && $param->{group} eq 'private'){
			$param->{group}='primary';
		}
	}
	if ($func eq 'ajxmailer' || $func eq 'ajxmailer_enabled') {
		foreach my $key (keys %{$param}) {
			if ($param->{$key} eq "addr" && $key =~ /^inc\_target\_type\_(\d+)/) {
				my $num = $1;
				if ($param->{"inc_target_gid_$num"} < $DA::Vars::p->{top_gid}) {
					$param->{"inc_target_gid_$num"} = $session->{user};
				}
			}
		}
	}
	if ($func eq 'imap' || $func eq "imap_enabled") {
		if ($param->{imap_account} eq lc($DA::Vars::p->{package_name})
		||  $DA::Vars::p->{imap_account} eq lc($DA::Vars::p->{package_name})) {
			if (ref($session) =~ /^DA::HttpSession/) {
				$param->{user}	= $session->{user_id};
				$param->{pass}	= $session->get_passwd();
			} else {
				$param->{user}	= "";
				$param->{pass}	= "";
			}
		}
		if ($param->{pop_keep} eq "2" && $DA::Vars::p->{mailgw_keep_sync} !~ /^on$/i) {
			$param->{pop_keep} = 0;
		}
	}
	#=====================================================
	#			----custom----
	#=====================================================
	DA::Custom::rewrite_master($session,$func,$param,{});

	# --- memcache
	if ( DA::FS::is_memcached_module() && DA::FS::enabled() ) {
		DA::FS::set_cache($session, $memcached_key, $param || {});
	}

	DA::DeBug::time_log("get_master [$func] $mode", 
		"IS:get_master:$session->{user}", $begin_t);
    return ($param);
}

sub init_master{
    my ($session,$func)=@_;
	DA::Unicode::file_unlink("$DA::Vars::p->{data_dir}/master/$session->{user}/.$func\.dat");
}

sub save_sys_custom{
    my ($session,$param,$func,$mode)=@_;
	# $mode=0 : data/custom ディレクトリ内の設定ファイルを読み込む
	# $mode=1 : data/system ディレクトリ内の設定ファイルを読み込む
	# $mode=2 : data/custom/default ディレクトリ内の設定ファイルを読み込む

    if(!$func){return 0;}
	unless ($mode) { $mode = 0; }

	my $file_path;
	if ($mode eq 1) {
		$file_path="$DA::Vars::p->{system_dir}/$func\.dat";
	} elsif ($mode eq 2) {
		$file_path="$DA::Vars::p->{cu_def_dir}/$func\.dat";
	} else {
		$file_path="$DA::Vars::p->{custom_dir}/$func\.dat";
	}

	my $header;
	DA::System::file_open(\*IN,"$file_path");
	while (my $line=<IN>) {
		if ($line =~ /^\#/) { $header.=$line; }
	}
	close(IN);

	DA::System::file_open(\*OUT,">$file_path");
	print OUT $header;
	foreach my $key (sort keys %$param) {
		print OUT "$key=$param->{$key}\n";
	}
	close (OUT);

	# コマンド実行の場合はパーミションを設定
	my $gen_suffix = DA::MasterManager::_gen_tbl_suffix();
	if ($session->{command} || $func =~ /^(join_group_cache|member_cache)(\_${gen_suffix}\d+)?$/) {
		DA::System::file_chown($DA::Vars::p->{www_user}, $DA::Vars::p->{www_group}, $file_path);
		DA::System::file_chmod(0644, $file_path);
	}
	if ( DA::FS::enabled() ) {
		DA::FS::delete_cache($session, "sys_custom:$file_path");
	}

    return 1;
}

sub save_sys_custom_db{
    my ($session,$param,$func,$mode,$trans)=@_;

	# mode = 0 data/custom
	#        1 data/system
	# trans =1 no commit;

    if (!$func){return 0;}
    if ($mode ne 'system' && $mode ne 'custom'){
        if (!$mode){
            $mode = 'custom';
        } else {
            $mode = 'system';
        }
    }

    DA::Session::trans_init($session);
    eval {
        my $sql="DELETE FROM is_data WHERE d_mode=? AND d_func=?";
        my $sth=$session->{dbh}->prepare($sql);
           $sth->bind_param(1,$mode,1);
           $sth->bind_param(2,$func,1);
           $sth->execute();

        $sql="INSERT INTO is_data (d_mode,d_func,d_key,d_value) VALUES (?,?,?,?)";
        $sth=$session->{dbh}->prepare($sql);
        if (ref($param) eq 'HASH'){
            foreach my $key(keys %$param){
                if ($key eq ''){next;}
                my $value = $param->{$key};
                if ($value eq ''){$value = undef;}
                $sth->bind_param(1,$mode,1);
                $sth->bind_param(2,$func,1);
                $sth->bind_param(3,$key,1);
                $sth->bind_param(4,$value,1);
                $sth->execute();
            }
        }
    };

    if (!$trans) {
        if(!DA::Session::exception($session)){
            DA::Error::system_error($session);
        }
    }
}

sub get_sys_custom {
    my ($session,$func,$mode,$param)=@_;
	# $mode=0 : data/custom ディレクトリ内の設定ファイルを読み込む
	# $mode=1 : data/system ディレクトリ内の設定ファイルを読み込む
	# $mode=2 : data/custom/default ディレクトリ内の設定ファイルを読み込む

	# ログインに関連するカスタマイズ設定の反映タイミングを設定
	# auth,login,password,menu_style,lang,portal,hidden,multi_admin,
	# session_expire,guide,image,domain,restrict

	my $begin_t=DA::DeBug::time_init();
	my $title = (ref($session) eq "HASH") ? "IS:get_sys_custom:$session->{user}" : "IS:get_sys_custom";

	unless ($mode) { $mode = 0; }

	if ($DA::Vars::p->{reflection}->{$func}=~/^[01]$/) {
		if (ref($DA::Vars::p->{sys_custom}->{$func}) eq 'HASH') {
			%$param=%{$DA::Vars::p->{sys_custom}->{$func}};
			return($param);
		}
	}

	my $file_path;
	if ($mode eq 1) {
		$file_path="$DA::Vars::p->{system_dir}/$func\.dat";
	} elsif ($mode eq 2) {
		$file_path="$DA::Vars::p->{cu_def_dir}/$func\.dat";
	} else {
		$file_path="$DA::Vars::p->{custom_dir}/$func\.dat";
	}
	
	# --- memcache
	if ( DA::FS::enabled() ) {
		unless ($param) {
 			my $cache;
			if ( $func =~ /join_group_cache|member_cache/ ) {
				$cache = DA::FS::get_cache($session, "sys_custom:$file_path");
			} else {
				$cache = DA::FS::get_cache_lazy($session, "sys_custom:$file_path");
			}

			if ($cache ) {
				#=====================================================
				#			----custom----
				#=====================================================
				DA::Custom::rewrite_sys_custom($session,$func,$cache,{});
				
				DA::DeBug::time_log("get_sys_custom [$func] $mode", $title, $begin_t);
				
				return($cache);
			}
		}
	}

	if(-e "$file_path"){
		DA::System::file_open(\*IN, "$file_path");
		while(my $line = <IN>){
	        chomp($line);
			if ($line eq '') { next; }
			$line =~ s/^\s+//; $line =~ s/\s+$//;
			if ($line=~/^\#/) { next; }
	        my($key,$val)=split(/[\t=]/,$line,2);
			if ($val eq '') { next; }
			$key =~ s/^\s+//; $key =~ s/\s+$//;
			$val =~ s/^\s+//; $val =~ s/\s+$//;
	        $param->{$key}=$val;
	    }
		close(IN);
	}
	#=====================================================
	#			----custom----
	#=====================================================
	DA::Custom::rewrite_sys_custom($session,$func,$param,{});

	# --- memcache
	if ( $param && DA::FS::enabled() ) {
		# アドオン用設定ファイルのメモリキャッシュへの記録を抑止
		unless ( DA::Custom::fs_set_cache_deny($session, $file_path) ) {
			DA::FS::set_cache($session, "sys_custom:$file_path", $param || {});
		}
	}

	DA::DeBug::time_log("get_sys_custom [$func] $mode", $title, $begin_t);

	return ($param);
}

sub get_sys_custom_db{
    my ($session,$func,$mode,$param)=@_;

	# mode = 0 data/custom
	#        1 data/system

    if(!$mode){
        $mode = 'custom';
    }elsif($mode eq '1'){
        $mode = 'system';
    }
    my $sql="SELECT d_key,d_value FROM is_data WHERE d_mode=? AND d_func=?";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,$mode,1);
       $sth->bind_param(2,$func,1);
       $sth->execute();
    while(my($key,$value)=$sth->fetchrow){
	    $param->{$key}=$value;
    }
    $sth->finish;

    return ($param);
}

sub get_sys_custom_vars {
	my ($session, $func, $mode, $param)=@_;
	# $mode=0 : data/custom ディレクトリ内の設定ファイルを読み込む
	# $mode=1 : data/system ディレクトリ内の設定ファイルを読み込む
	# $mode=2 : data/custom/default ディレクトリ内の設定ファイルを読み込む

	my $file_path;
	if ($mode eq 1) {
		$file_path = "$DA::Vars::p->{system_dir}/$func\.dat";
	} elsif ($mode eq 2) {
		$file_path = "$DA::Vars::p->{cu_def_dir}/$func\.dat";
	} else {
		$file_path = "$DA::Vars::p->{custom_dir}/$func\.dat";
	}

	my $last_modify = (stat($file_path))[9];
	my $update = 0;
	if (DA::System::nfs_time() - $DA::Vars::p->{cache}->{$file_path}->{last_modify} > 24 * 60 * 60) {
		delete $DA::Vars::p->{cache}->{$file_path};
	}
	if (exists $DA::Vars::p->{cache}->{$file_path}) {
		if ($last_modify > $DA::Vars::p->{cache}->{$file_path}->{last_modify}) {
			$update = 1;
		}
	} else {
		$update = 1;
	}
	if ($update) {
		$DA::Vars::p->{cache}->{$file_path}->{last_modify} = $last_modify;
		$DA::Vars::p->{cache}->{$file_path}->{data} = DA::IS::get_sys_custom($session, $func, $mode, $param);
	}

	return ($DA::Vars::p->{cache}->{$file_path}->{data});
}

sub get_data_file {
    my ($session,$filepath)=@_;
    my $begin_t=DA::DeBug::time_init();
	if(!DA::CGIdef::get_f_info($filepath)){return;}
    my $param={};
	DA::System::file_open(\*IN, "$filepath");
	while(my $line = <IN>){
        chomp($line);
		if ($line eq '') { next; }
		$line =~ s/^\s+//; $line =~ s/\s+$//;
		if ($line=~/^\#/) { next; }
        my($key,$val)=split(/[\t=]/,$line,2);
		if ($val eq '') { next; }
		$key =~ s/^\s+//; $key =~ s/\s+$//;
		$val =~ s/^\s+//; $val =~ s/\s+$//;
        $param->{$key}=$val;
    }
	close(IN);
    DA::DeBug::time_log("get_data_file ", 
		"DA:IS:get_data_file:[$filepath]", $begin_t);
    return ($param);
}

# スタイルデータの取得
sub get_style_data {
    my ($session) = @_;
    my $file    = "$DA::Vars::p->{custom_dir}/style.dat";
    my $fh      = DA::System::iofile_new($file, "r");
    my $o       = {};
    my $key;

    if (defined $fh) {
        while (my $line = <$fh>) {
            chomp ($line);
            $line =~ s/^\s+//;
            $line =~ s/\s+$//;

            if ($line eq "") {
                next;
            } elsif ($line =~ /^#/) {
                next;
            } else {
                if ($line =~ /^\[(.*)\]/) {
                    $key        = $1;
                    $o->{$key}  = {};
                } else {
                    if ($key ne "") {
                        my ($k, $v) = split (/\=/, $line, 2);
                        $o->{$key}->{$k} = $v;
                    }
                }
            }
        }
        close $fh;
    }

    return $o;
}

#usersel用
sub save_join_gid{
    my ($session,$join_gid)=@_;
    my $file = "$session->{sid}\.join";
	DA::System::file_open(\*OUT,">$session->{temp_dir}/$file");
	foreach my $key (keys %$join_gid) {
		print OUT "$key=$join_gid->{$key}->{type}";
        print OUT "=$join_gid->{$key}->{attr}";
        print OUT "=$join_gid->{$key}->{join}";
        print OUT "=$join_gid->{$key}->{owner}\n";
	}
	close (OUT);
    return 1;
}

#usersel用
sub get_gid_list{
    my ($session,$join_group,$target,$target_o,$owner,$lite,$owner_group)=@_;
    my $pattern = DA::IS::get_group_pattern($session);

    my ($c_mid, $c_join_group);
    if ($lite) {
        $c_mid = $session->{user};
        $c_join_group = DA::IS::get_join_group($session,$c_mid,1);
    }

    foreach my $gid(keys %$join_group){
        if($target){
            if($join_group->{$gid}->{attr}=~/[$target]/){
                $join_group->{$gid}->{rest}=1;
                next;
            }
        }
        if($target_o){
            if($join_group->{$gid}->{owner}=~/[$target_o]/){
                $join_group->{$gid}->{rest}=1;
                next;
            }
        }
        if($owner){
            my $w_owner;
			if($owner && $owner ne '1'){
				$w_owner=$owner;
			}
            if(DA::IS::check_owner($session,$owner_group,$gid,$w_owner,$c_mid,$c_join_group,$lite)){
                $join_group->{$gid}->{rest}=1;
                next;
            }
        }
    }
}

sub get_seq {
	my ($session, $func) = @_;

	my ($sql, $sth);
	my $data;
	if ($DA::Vars::p->{ORACLE}) {
		$sql="SELECT seq\_$func\.nextval FROM dual";
	}elsif($DA::Vars::p->{MYSQL}){ 
		$sql="UPDATE seq_$func set last_number=LAST_INSERT_ID(last_number+1)"; 
		$sth=$session->{dbh}->prepare($sql); $sth->execute;
		$sql="SELECT LAST_INSERT_ID()";
		$sth=$session->{dbh}->prepare($sql);
		$sth->execute; 
		$data = $sth->fetch;
		if($data->[0] < 1) {
			$sql =  "UPDATE seq_$func set last_number=LAST_INSERT_ID(1)"; 
			$sth=$session->{dbh}->prepare($sql); $sth->execute;
			$sth->finish;
			return (1); 
		}else {
			$sth->finish;
			return ($data->[0]);
		}
	} else {
		$sql = "SELECT nextval('seq\_$func')";
	}

	$sth = $session->{dbh}->prepare($sql);
	$sth->execute;
	$data = $sth->fetch;
	$sth->finish;
	
	return ($data->[0]);
}

sub get_count{
    my ($session,$func,$mode,$inc,$trans,$retry)=@_;

    my $num;
	$retry = 1 unless ($retry);
    $inc = 1 if (!$inc);
    DA::Session::trans_init($session);
    eval {
        my $sql ="SELECT num FROM is_count WHERE type=? for update ";
        if ($DA::Vars::p->{ORACLE}) { $sql.="nowait"; }
        my $sth=$session->{dbh}->prepare($sql);
           $sth->bind_param(1,$func,1); $sth->execute();
        $num=$sth->fetchrow; $sth->finish;
        if($num eq ''){
           $num = $inc;
           $sql ="INSERT INTO is_count (type,num) VALUES (?,?)";
           $sth=$session->{dbh}->prepare($sql);
           $sth->bind_param(1,$func,1);
           $sth->bind_param(2,$num, 3);
           $sth->execute();
        }else{
           $num=$num+$inc;
           if($mode && $num > 99999999){$num = 1;}
           $sql="UPDATE is_count SET num=? WHERE type=? ";
           $sth=$session->{dbh}->prepare($sql);
           $sth->bind_param(1,$num, 3);
           $sth->bind_param(2,$func,1);
           $sth->execute();
        }
    };

	if (DA::DB::check_nowait_error()) {	
		if ($retry>$RETRY) {
			unless ($trans) {
				$session->{dbh}->rollback();
			}
			die t_($@);
			return;
		}			
		unless ($trans) {
			$session->{dbh}->rollback();
		}
		usleep($WAIT);
		warn "リソースビジーのため再試行します。";
		$retry++;
		return DA::IS::get_count($session, $func, $mode, $inc, $trans, $retry);
	} else {
		if (!$trans) {
			if(!DA::Session::exception($session)){
				DA::Error::system_error($session);
			}
		}
   }
   return ($num);
}

### Parse系データファイルの取得／設定 #########################################
sub get_data_parse{
    my($session,$file,$f_option)=@_;
	# $f_option は $file付加して利用する。

    if($f_option){$file.=$f_option;}

    my $block = {};
    my $data ={};
    my $IN = DA::Unicode::file_open("$session->{temp_dir}/$session->{sid}\.$file\.dat", "r");
    if(!defined $IN){return undef;}
    my @data_file =<$IN>;
    close($IN);
    my $sepa_tag;
    foreach my $line(@data_file){
        $line =~ s/\n//og;
        $line =~ s/^\s*//og;
        $line =~ s/\s*$//og;
        if(!$line){next;}
        if(!$sepa_tag){
            if($line =~ /^<(.+)>$/){
                $sepa_tag = $1;
            }
            next;
        }else{
            if($line =~ /^<\/$sepa_tag>$/){
                $block->{$sepa_tag} = \%$data;
                $sepa_tag = undef;
                $data = {};
                next;
            }else{
                my($key,$value)=split(/=/,$line,2);
                $value=~s/\t/\n/g;
                $data->{$key} = $value;
            }
        }
    }
    return ($block);
}

sub set_data_parse{
    my($session,$block,$file,$f_option)=@_;
	# $f_option は $file付加して利用する。

    if($f_option){$file.=$f_option;}

    my $OUT = DA::Unicode::file_open("$session->{temp_dir}/$session->{sid}\.$file\.dat", "w");
    if(!defined $OUT){ die "$session->{temp_dir}/$session->{sid}\.$file\.dat: $!"; }
    foreach my $sepa_tag(keys %$block){
        print $OUT "<$sepa_tag>\n";
        my $data = {};
		if (ref($block->{$sepa_tag}) eq "HASH") {
			%$data = %{$block->{$sepa_tag}};
        	foreach my $key(keys %$data){
            	my $val=$data->{$key};
        		$val=~s/\x0D\x0A/\t/g;
        		$val=~s/\x0D/\t/g;
        		$val=~s/\x0A/\t/g;
            	print $OUT "$key=$val\n";
        	}
		}
        print $OUT "</$sepa_tag>\n";
    }
    close($OUT);
}

sub get_popup{
    my($cgi,$win,$title,$noname,$focus)=@_;
    my $popup_tag;
	if ($win eq '') { $win='selwin'; }
	if ($title eq '') { $title='UserselPopup'; }
	# ブラウザ判定
	if (!$noname || ($ENV{HTTP_USER_AGENT}=~/Mozilla\/4/ && $ENV{HTTP_USER_AGENT} !~ /MSIE/)) {
    	$popup_tag ="$win=window.open(setUrl('$cgi'),'$title',";
	} else {
    	$popup_tag ="$win=window.open(setUrl('$cgi'),'',";
	}
	
	my $width  = '680';
	my $height = '550';
	
	## ユーザ・グループ選択拡張ポップアップ定義
	my @usersel_ext_target = (
		"$DA::Vars::p->{cgi_rdir}/usersel.cgi",
		"$DA::Vars::p->{cgi_rdir}/ow_folder_public.cgi",
	);
	my$usersel_ext_match=0;
	foreach my$l(@usersel_ext_target){
		if( $cgi =~ /^\Q$l\E/ ){
			$usersel_ext_match = 1;
			last;
		}
	}
	my $status_bar;
	if( $usersel_ext_match ) {
		($width,$height) = DA::IS::get_usersel_ext_popup_size($width,$height);
		$status_bar =",status=yes";
	}

    $popup_tag.="'width=$width,height=$height,resizable=1,scrollbars=1$status_bar');\n";
	if ($focus) { $popup_tag.="$win.focus()"; }
    return $popup_tag;
}

# ユーザ・グループ選択用(拡張選択)のウィンドウサイズ取得
sub get_usersel_ext_popup_size{
	my($width,$height)=@_;
	
	my $conf_width  = $DA::Vars::p->{usersel_ext_popup_width};
	my $conf_height = $DA::Vars::p->{usersel_ext_popup_height};
	if(680 <=$conf_width && $conf_width <= 1000){
		$width=$conf_width;
	}
		
	if(550 <=$conf_height && $conf_height <= 700){
		$height=$conf_height;
	}
	return ($width,$height);
}

# login_main をリフレッシュしてポップアップ画面をクローズするための HTML を返す
sub get_popup_close {
	my ($session,$cgi,$script,$type,$param,$script_only)=@_;
	if (!$script) {
		my $reload="top.opener.location.href='$DA::Vars::p->{cgi_rdir}/$cgi'";
    	$script=DA::IS::get_opener_check_script($session,'login_main',$reload);
        $script=qq{
            try {
				var target=(top.opener.document.title == 'login_main') ? top.opener : top.opener.parent;
        		var cr_date=target.document.date_form.date.value;
                target.DAportletRefresher.refresh_all('$type',cr_date,'$param');
            	top.window.close();
            } catch(e) { 
            	$script
			}
        };
	}
	if ($script_only) { return($script); }
    my $html_buf="<html><head>
       <SCRIPT LANGUAGE=\"JavaScript\"><!--
           $script
       //--></SCRIPT>
       </head></html>";
	return ($html_buf);
}

sub get_items_value {
    my $items={};
    my $IN=DA::Unicode::file_open("$DA::Vars::p->{custom_dir}/items.dat", "r");
    if (defined $IN) {
    	while (my $line=<$IN>) {
			chomp($line);
        	if ($line=~/^(info|prof)(\d+)=(.*)/i) {
				if ($3 eq '') { next; }
				if ($2 < 1 || $2 > 10) { next; }
				$items->{"$1$2"}=DA::Unicode::rtrim($3);
        	}
    	}
    	close($IN);
    }

	$items->{attr01}=t_("名前");
	$items->{attr02}=t_("%1(ふりがな)",t_("名前"));
	$items->{attr03}=t_("アルファベット");
	$items->{attr04}=t_("所属組織");
	$items->{attr05}=t_("役職");
    return ($items);
}

sub check_items_value {
	my ($items, $type)	= @_;
	my $result	= 0;

	foreach my $key (keys %{$items}) {
		if ($key =~ /^$type\d+$/) {
			if ($items->{$key} eq "") {
				next;
			} else {
				$result	= 1;
				last;
			}
		} else {
			next;
		}
	}

	return ($result);
}

sub get_join_groups {
	my $session	= shift;
	my $mids	= shift;

	if (ref($mids) ne 'ARRAY') {
		Carp::confess "Param \$mid is not ARRAY.";
	}

	my $group_timestamp = DA::IS::get_group_timestamp($session);
	my $driver = "DA::Serializer::DB::".$session->{dbh}->{Driver}->{Name};

	my $stn = $DA::Vars::p->{join_data_tables};
	my $param = {};
	my $cri = {};
	foreach my $mid (@{$mids}) {
		my $num = $mid % $stn;
		$cri->{$num} .= "?,";
		push(@{$param->{$num}}, $mid);
	}
	foreach my $num (keys %{$cri}) {
		$cri->{$num} =~ s/\,+$//;
	}

	my $join_groups = {};
	my @nums = sort {$a <=> $b} keys %{$cri};
	while (my @num = splice(@nums, 0, 10)) {
		my $sql;
		foreach my $num (@num) {
			my $join_table = "is_join_data_$num";
			$sql .= "SELECT mid,modify_time,object_data FROM $join_table "
			     .  "WHERE mid IN ($cri->{$num}) UNION ALL ";
		}
		$sql =~ s/\s+UNION\s+ALL\s+$//;

		my $sth = $session->{dbh}->prepare($sql);
		my $cnt = 1;
		foreach my $num (@num) {
			foreach my $mid (@{$param->{$num}}) {
				$sth->bind_param($cnt, $mid);
				$cnt++;
			}
		}
		$sth->execute;
		while (my $data = $sth->fetchrow_hashref('NAME_lc')) {
			if ($group_timestamp eq $data->{'modify_time'}) {
				$join_groups->{$data->{mid}}=$driver->_deserialize($data->{object_data});
			} else {
				$join_groups->{$data->{mid}}=DA::IS::get_join_group($session, $data->{mid}, 1, 1, 1);
			}
		}
		$sth->finish;
	}

	return $join_groups;
}

sub get_group_cache {
	my ($session, $msid) = @_;
	my $group_cache = undef;
	if (DA::MultiLang::master_ok()) {
		my $cache_file = DA::MasterManager::filename($session, "$DA::Vars::p->{custom_dir}/group_data.dat", $msid);
		if (!DA::Unicode::file_exist($cache_file)) {
			DA::Admin::update_group_cache($session, undef, $msid);
		}
		$group_cache = DA::Unicode::storable_retrieve($cache_file);
	}
	return $group_cache;
}

sub get_join_group{
    my ($session,$mid,$mode,$force,$AutoCommit,$msid)=@_;      
	### $mode = 1   上位、下位の組織も含む
    ### (V1.7から廃止になったために$mode=1を強制)
    $mode = 1;
	### attr = 1  プライマリ
	###      = 2  セカンダリ
	###      = U  上位組織
	###      = D  下位組織
	###      = W  上位、下位重複組織
	### owner= 3  プライマリオーナー
	###      = 4  セカンダリオーナー
    ### $force = 0; キャッシュをチェックしてからデータを取得する
    ### $force = 1; データベースから強制的に取得を行いキャッシュデータを更新する
    ### $force = 2; データベースから強制的に取得を行うがキャッシュデータは更新しない
    ### $AutoCommit = 0; join_groupのキャシュデータを自動的にコミットしない
    ### $AutoCommit = 1; 自動的にコミットする
	### $msid = N; 世代番号

    unless (defined $mid) {
        return {};
    }
	unless ($force) {
		if (($session->{user} eq $mid) && (exists $session->{join_group})) {
			return $session->{join_group};
		}
	}

	# 世代番号を明示的に指定できるのは、 $force=2 の場合のみ
	# これ以外の場合だと未来、過去世代の情報を元に join_group のデータを更新してしまうため
	if ( DA::MasterManager::is_msid($msid ) ) {
		$msid = undef if ( $force ne '2' ) ;
	}

    my $join_gid ={};
    my $owner_gid ={};

	unless (defined $AutoCommit) { $AutoCommit = 1; }

	my $group_timestamp = DA::IS::get_group_timestamp($session);

	my $dbo;
	unless ($force) {
		$dbo = DA::DBO::Group::Join->new(
							mid     => $mid,
							lob     => [qw(object_data)],
							dbh     => $session->{dbh} );
		if ($group_timestamp eq $dbo->value('modify_time')) {
			return $dbo->value('object_data');
		}
	}
    my @gid_list;
    my($gid_where,$attr_list);

	my $gp_table = DA::IS::get_master_table($session, "is_group_path",   $msid, { no_session_use => 1 } ) ;
	my $gm_table = DA::IS::get_master_table($session, "is_group_member", $msid, { no_session_use => 1 } ) ;

    my $sql="SELECT gid FROM $gm_table WHERE mid=? AND attr IN ('1','2') "
           ."UNION SELECT gid FROM $gp_table WHERE attr='U' AND "
           ."real_gid IN (SELECT gid FROM $gm_table WHERE mid=? AND  "
           ."attr IN ('1','2'))";
    my $sth=$session->{dbh}->prepare($sql);
    $sth->bind_param(1,$mid,3);
    $sth->bind_param(2,$mid,3); $sth->execute();
    while(my($gid)=$sth->fetchrow) {
        push(@gid_list,$gid);
    }
    $sth->finish;

    if(@gid_list){
        if($#gid_list > 800){
             $sql="SELECT gid,attr FROM $gm_table WHERE "
                 ."mid IN ($sql) AND attr IN ('5') ";
             $sth=$session->{dbh}->prepare($sql);
             $sth->bind_param(1,$mid,3);
             $sth->bind_param(2,$mid,3);
        }else{
            $gid_where=join(',',@gid_list);
			DA::DB::bind_clear();
            $sql="SELECT gid,attr FROM $gm_table WHERE "
                ."mid IN (@{[DA::DB::bind_pushin($gid_where,3)]}) AND attr IN ('5') ";
			$sth=DA::DB::bind_set($session, $sql);
			DA::DB::bind_clear();
        }
        $sth->execute();
        while(my($gid,$attr)=$sth->fetchrow) {
            if($attr eq '5'){ push(@gid_list,$gid); }
        }
        $sth->finish;
    }

    push(@gid_list,$mid);
    my %count; @gid_list  = grep(!$count{$_}++, @gid_list);
	
	my $group_cache = DA::IS::get_group_cache($session, $msid, 1);
    while(1){
        if(!@gid_list){last;}
        my @list = splice(@gid_list,0,800);
		DA::IS::get_join_group_detail($session,$join_gid,\@list,$mode,$group_cache,$msid);
    }

	if ($force eq 2) {
		# ※ force=2の場合はキャッシュデータを更新せずにデータのみを返す
		return ($join_gid);
	} else {
		$session->{dbh}->{PrintError} = 0;
		DA::Session::trans_init($session);
		eval {
			my $join_table = DA::IS::get_join_data_table({ 'user' => $mid });
			my $sql="SELECT mid FROM $join_table WHERE mid=? FOR UPDATE";
			if ($DA::Vars::p->{ORACLE}) { $sql .= " NOWAIT"; }
			my $sth=$session->{dbh}->prepare($sql);
			   $sth->bind_param(1, $mid, 3);
			   $sth->execute;
			   $sth->finish;

			my $dbo = DA::DBO::Group::Join->new(
								mid     			=> $mid,
								lob     			=> [qw(object_data)],
								dbh     			=> $session->{dbh} );

			$dbo->value('modify_time' => $group_timestamp);
			$dbo->value('object_data' => $join_gid);

			if ($dbo->rows eq 0) {
				$dbo->value('mid' => $mid);
				if (scalar(keys %{$join_gid})) {
					$dbo->insert();
				}
			} else {
				$dbo->update($mid);
			}
			$session->{dbh}->commit() if $AutoCommit;
		};
		$session->{dbh}->{PrintError} = 1;

		if ($@) {
			if (!DA::DB::check_nowait_error() && !DA::DB::check_unique_error()) {
				warn "$@";
			}
			if ($AutoCommit) {
				$session->{dbh}->rollback();
			}
		}

		return ($join_gid);
	}
}

sub get_join_group_detail{
    my($session,$join_gid,$gid_list,$mode,$group_cache,$msid)=@_;
    if (!$group_cache) {
        $group_cache = DA::IS::get_group_cache($session,$msid,1);
    }

	my $gp_table    = DA::IS::get_master_table($session, "is_group_path",   $msid, { no_session_use => 1 } ) ;
	my $gm_table    = DA::IS::get_master_table($session, "is_group_member", $msid, { no_session_use => 1 } ) ;
	my $group_table = DA::IS::get_group_table($session,  "TBL",             $msid, { no_session_use => 1 } ) ;

	DA::DB::bind_clear();
    my($g_info,@w_list);
    my $gid_where=join(',',@$gid_list);
    my $sql="SELECT /*+ ORDERED */ gm.gid,gm.mid,gm.attr,gm.type,gm.auth_type,"
       ."g.name,g.kana,g.alpha,g.group_join,g.permit,g.sort_level,g.grade,g.org_type,"
       ."gm.owner01,gm.owner02,gm.owner03,gm.owner04,gm.owner05,"
       ."gm.owner06,gm.owner07,gm.owner08,gm.owner09,gm.owner10,"
       ."gm.owner11,gm.owner12,gm.owner13,gm.owner14,gm.owner15,"
       ."gm.owner16,gm.owner17,gm.owner18,gm.owner19,gm.owner20 "
       ."FROM $gm_table gm, $group_table g "
       ."WHERE gm.mid IN (@{[DA::DB::bind_pushin($gid_where,3)]}) and gm.gid=g.gid "
       ."ORDER BY gm.type,gm.gid,gm.attr,gm.auth_type,g.grade,g.sort_level";
	my $sth=DA::DB::bind_set($session, $sql);
	   $sth->execute();
    while(my($gid,$mid,$attr,$type,$auth_type,$gname,$gkana,$galpha,$group_join,$permit,$sort,$grade,$org_type,$ow01,$ow02,$ow03,$ow04,$ow05,$ow06,$ow07,$ow08,$ow09,$ow10,$ow11,$ow12,$ow13,$ow14,$ow15,$ow16,$ow17,$ow18,$ow19,$ow20)=$sth->fetchrow) {
        my $owner = 0;
        my $g_attr;
        if($attr eq '3'){
            $owner = $attr;
            if(!$join_gid->{$gid}){ $attr = 0; }
        }elsif($attr eq '4'){
            if($join_gid->{$gid}->{owner}){next;}
            $owner = $attr;
            if(!$join_gid->{$gid}){ $attr = 0; }
            my @owners=($ow01,$ow02,$ow03,$ow04,$ow05,
                        $ow06,$ow07,$ow08,$ow09,$ow10,
                        $ow11,$ow12,$ow13,$ow14,$ow15,
                        $ow16,$ow17,$ow18,$ow19,$ow20);
            $join_gid->{AUTH}->{$gid} = join(',',@owners);
        }elsif($attr eq '6'){
            if($join_gid->{$gid}->{owner} =~ /[34]/){next;}
            $owner = $attr;
            if(!$join_gid->{$gid}){ $attr = 0; }
            my @owners=($ow01,$ow02,$ow03,$ow04,$ow05,
                        $ow06,$ow07,$ow08,$ow09,$ow10,
                        $ow11,$ow12,$ow13,$ow14,$ow15,
                        $ow16,$ow17,$ow18,$ow19,$ow20);
            if($join_gid->{AUTH}->{$gid}){
                my(@w_owners)=split(/\,/,$join_gid->{AUTH}->{$gid});
                for(my $i=0;$i<20;$i++){
                    if(!$w_owners[$i]){$w_owners[$i]=$owners[$i];}
                }
                $join_gid->{AUTH}->{$gid} = join(',',@w_owners);
            }else{
                $join_gid->{AUTH}->{$gid} = join(',',@owners);
            }
        }elsif(DA::IS::group_type($type,$org_type) eq '1' && $attr =~/[12]/){
            push(@w_list,$gid);
        }elsif(DA::IS::group_type($type,$org_type) eq '2'){
			if($attr =~/[1]/){
                $g_attr=0;
			}elsif($attr =~/[5]/){
                $g_attr=$attr;
                if($join_gid->{$gid}->{g_attr} eq '0' ||
                   $join_gid->{$gid}->{g_attr} eq '1'){
                    $g_attr=1;
                }
                if($join_gid->{$gid}->{owner}){
                    $owner = $join_gid->{$gid}->{owner};
                }
                $attr="1";
                if($join_gid->{$gid}->{auth_type}){
                    $auth_type=$join_gid->{$gid}->{auth_type};
                }
			}
        }elsif($type eq '9'){
            $attr = 9;
        }
        if(DA::IS::group_type($type,$org_type) eq '3'){$sort=$grade;}
        my($d,$f)=split(/\./,$sort);
        $sort=sprintf("%010d.%010d",$d,$f);

        my $name;
        if (DA::MultiLang::master_ok()) {
            if ( $group_cache->{$gid} && ref($group_cache->{$gid}) eq 'HASH' &&
            	 ref($group_cache->{$gid}->{name}) eq 'HASH' && %{$group_cache->{$gid}->{name}} ) {
				my %names	= %{$group_cache->{$gid}->{name}};
				$name = \%names;
			} else {
				warn "Faild get group cache gid=$gid";
				$name = $gname;
			}
        } else {
            $name = $gname;
        }

        if($attr =~/[129]/ || !$join_gid->{$gid}->{type}){
            $join_gid->{$gid} = {'gid'  => $gid,
                                 'type' => $type,
								 'org_type' => $org_type,
                                 'attr' => $attr,
                                 'owner'=> $owner,
                                 'join' => $group_join,
                                 'name' => $name,
                                 'kana' => $gkana,
                                 'alpha' => $galpha,
                                 'permit'=> $permit,
                                 'sort' => $sort,
                                 'auth_type'=>$auth_type,
                                 'g_attr'=>$g_attr};
        }elsif($attr =~/[346]/){
            $join_gid->{$gid}->{gid} = $gid;
            $join_gid->{$gid}->{owner} = $owner;
            $join_gid->{$gid}->{auth_type} = $auth_type;
        }
    }
    $sth->finish;
	DA::DB::bind_clear();

    if($mode && @w_list){
        my %count; @w_list = grep(!$count{$_}++, @w_list);
        while(1){
            if(!@w_list){last;}
            my @list = splice(@w_list,0,800);
            my $where=join(',',@list);
			DA::DB::bind_clear();
            $sql="SELECT gp.gid,gp.attr,g.name,g.kana,g.alpha,g.group_join,"
                ."g.sort_level,g.type,g.org_type"
                ." FROM $gp_table gp,$group_table g ";
            if($where=~/\,/){
                $sql.="WHERE gp.real_gid IN (@{[DA::DB::bind_pushin($where,3)]}) "
					. "AND gp.gid=g.gid ";
				$sth=DA::DB::bind_set($session, $sql);
            }else{
                $sql.="WHERE gp.real_gid=? AND gp.gid=g.gid ";
                $sth=$session->{dbh}->prepare($sql);
	            $sth->bind_param(1,$where,3);
            }
			$sth->execute();
            while(my($gid,$attr,$gname,$gkana,$galpha,$group_join,$sort,$type,$org_type)=$sth->fetchrow) {
                if($join_gid->{$gid}->{attr}=~/[129W]/){next;}
                if($join_gid->{$gid}->{attr}=~/[UD]/ &&
                   $join_gid->{$gid}->{attr} ne $attr){$attr='W';}
                if($join_gid->{$gid}->{type}){
                    $join_gid->{$gid}->{attr} = $attr;
                }else{
                    my $name;
                    if (DA::MultiLang::master_ok()) {
                        if ( $group_cache->{$gid} && ref($group_cache->{$gid}) eq 'HASH' &&
                             ref($group_cache->{$gid}->{name}) eq 'HASH' && %{$group_cache->{$gid}->{name}} ) {
                            my %names	= %{$group_cache->{$gid}->{name}};
                            $name = \%names;
                        } else {
                            warn "Faild get group cache gid=$gid";
                            $name = $gname;
                        }
                    } else {
                        $name = $gname;
                    }
                    
                    $join_gid->{$gid} = {'gid' => $gid,
                                         'type' => $type,
										 'org_type' => $org_type,
                                         'attr' => $attr,
                                         'owner'=> '0',
                                         'join' => $group_join,
                                         'name' => $name,
                                         'kana' => $gkana,
                                         'alpha' => $galpha,
                                         'sort' => $sort};
                }
            }
            $sth->finish;
			DA::DB::bind_clear();
        }
    }

}

sub get_group_path{
    my ($session,$gid,$msid)=@_;
    my $gp_table = DA::IS::get_master_table($session, "is_group_path", $msid);
    my($up_list,$dw_list);
    my $sql ="SELECT gid,attr FROM $gp_table ";
       $sql.="WHERE real_gid=? AND attr IN ('U','D')";
    my $sth=$session->{dbh}->prepare($sql);
	   $sth->bind_param(1,$gid,3); $sth->execute();
    while(my($id,$attr)=$sth->fetchrow){
        if($attr eq 'U'){
            push(@$up_list,$id);
        }elsif($attr eq 'D'){
            push(@$dw_list,$id);
        }
    }
    $sth->finish;
    return($up_list,$dw_list);
}

sub get_top_gid_name{
    my($session,$mode,$name,$view,$msid)=@_;

    my $add_word;
    if($view){
        my $IN=DA::Unicode::file_open("$DA::Vars::p->{custom_dir}/top_gid_name.dat", "r");
        if (defined $IN){
            chomp($add_word = <$IN>);
            close($IN);
        }
		$add_word=($add_word) ? B_($add_word) : b_("組織TOP");
    }

    my $alpha;
    if($mode){
		my $group_table=DA::IS::get_group_table($session, undef, $msid);
        my $sql="SELECT name,alpha FROM $group_table WHERE gid=?";
        my $sth=$session->{dbh}->prepare($sql);
		   $sth->bind_param(1,$DA::Vars::p->{top_gid},3); $sth->execute();
        ($name,$alpha)=$sth->fetchrow; $sth->finish;
        $name=DA::IS::check_view_name($session,$name,$alpha);
    }

    $name.=$add_word;
       
    return ($name);
}

sub get_favorite_group{
    my($session,$systemdefault,$admin)=@_;
    my $f_group=[];
    my $param;
    if($systemdefault == 1){
        $param = DA::IS::get_master($session,'favorite_group',1);
    } elsif ($systemdefault == 2) {
    	$param = DA::IS::get_master($session,'faivorite_group',2);
    } else {
    	$param = DA::IS::get_master($session,'faivorite_group',2);
        my $p = DA::IS::get_master($session,'favorite_group',1);
		my $dup = {};
        foreach my $key (sort keys %$param) {
        	$dup->{$param->{$key}} = $key;
		}
        foreach my $key (sort keys %$p) {
        	if (!exists $dup->{$p->{$key}}) {
	        	$param->{"9$key"} = $p->{$key};
	        }
        }
    }
	my $group_table=DA::IS::get_group_table($session);
    my $sql="SELECT gid,type,name,alpha,org_type FROM $group_table WHERE gid=?";
    my $sth=$session->{dbh}->prepare($sql);
    my($top,$primary);
   	foreach my $key(sort keys %$param){
        $sth->bind_param(1,$param->{$key},3);
        $sth->execute();
        my($gid,$type,$gname,$galpha,$org_type)=$sth->fetchrow;

        $gname=DA::IS::check_view_name($session,$gname,$galpha);
        if($gid eq ''){next;}
        my $vname=$gname;
        if($gid eq $DA::Vars::p->{top_gid}) {
            $vname=DA::IS::get_top_gid_name($session,0,$gname,1);
        }elsif($gid eq $session->{primary}) { 
			if($type eq '4') {
				$gname=DA::IS::pre_suspend($session)." $gname";
        		$vname=$gname;
			}
			$vname.=b_("プライマリ"); 
        }elsif($gid eq $DA::Vars::p->{temp_gid}) {
            $vname=DA::Address::get_default_title('suspend');
            $gname=$vname;
		}else {
			if($type eq '4') {
				$vname=DA::IS::pre_suspend($session)." $gname";
				$gname=$vname;
			}
		}
        my $info = { 
			'gid'  		=> $gid,
			'type' 		=> $type,
			'org_type'	=> $org_type,
			'name' 		=> $gname,
			'vname'		=> $vname 
		};
       	push(@$f_group,$info);
        if($gid eq $DA::Vars::p->{top_gid}){$top=1;}
        if($gid eq $session->{primary}){$primary=1;}
   	}
    if($systemdefault == 0){
      if(!$top){
        $sth->bind_param(1,$DA::Vars::p->{top_gid},3); $sth->execute();
        my($gid,$type,$gname,$galpha,$org_type)=$sth->fetchrow;
        $gname=DA::IS::check_view_name($session,$gname,$galpha);
        my $vname=DA::IS::get_top_gid_name($session,0,$gname,1);
        my $info = { 'gid'  => $gid,
                     'type' => $type,
					 'org_type'	=> $org_type,
                     'name' => $gname ,
                     'vname'=> $vname };
        push(@$f_group,$info);
      }
      if(!$primary){
		if ($admin && $session->{primary} eq $DA::Vars::p->{admin_gid}) {
			$session->{primary_gname}=t_("管理権限ユーザ・グループ");
		}
        my $primary_gname=DA::IS::check_view_name($session,
                                  $session->{primary_gname},
                                  $session->{primary_galpha});
        my $info = { 'gid'  => $session->{primary},
                     'type' => '1',
                     'name' => $primary_gname,
                     'vname'=> "$session->{primary_gname}@{[b_('プライマリ')]}" };
        push(@$f_group,$info);
      }
    }
    $sth->finish;

	# Custom
	DA::Custom::get_favorite_group($session, $systemdefault, $admin, $f_group, $param);

    return ($f_group);
}

sub get_favorite_option2{
    my($session,$gid,$sel,$rest,$join,$owner,$compel_self,$suspend,$systemdefault,$limited_admin,$force_first,$multi_param,$tmp_gid,$no_admin_g,$len)=@_;

#### $gid    選択済みグループ
#### $sel    1 = 全組織の表示可（よく使うグループ）
####         2 = [12DW]  下位組織の表示可（よく使うグループ）
####         3 = [12UDW] 上位／下位組織の表示可（よく使うグループ）
#### $rest   1=制限無し
####         2=所属組織下位、参加プロジェクト
####         3=所属組織上位／下位、参加プロジェクト
####         4=所属組織上位、参加プロジェクト
#### $join   DA::IS::get_join_grouのデータ（$rest=1のときは必要なし）
#### $owner  1 = オーナー権限グループ選択可（よく使うグループ）
####             (1以外の権限制限を指定可能）
#### $suspend 1 = 廃止組織選択不可
#### $compel_self あるgidを強制的に表示する場合、そのgid
#### $limited_admin  1:制限つき管理権限の場合を評価する
#### $force_first  1: $gid の指定がない場合、明示的に一番上を selected にする
#### $multi_param マルチカンパニー向け変数群（ハッシュ先頭） # V2.2 では未使用
#### $tmp_gid	登録しないグループのある$gidを一時的に表示する場合、そのgid    # add by V2.4
#### $no_admin_g 1:管理権限グループを対象外  # add by V2.4.0

#### return($f_g_tag,$f_g_list,$gtype,$match)
#### $f_g_tag:	オプションタグ
#### $f_g_list:	よくつかうグループのリスト
#### $gtype:	選択されたグループのタイプ	
#### $result:	引数として渡されたgidとよくつかうグループのgidが一致した結果 or
#### 			$gidがユーザID or $force_first が指定されている場合
#### 0: 一致しない 
#### 1: 一致する
    my($pat_sel,$pat_rest,$pat_ow,$f_g_tag,$f_g_list,$gtype,$result);
    my $pattern=DA::IS::get_group_pattern($session);
	my $hidden=DA::IS::get_sys_custom($session,"hidden");
	if($gid eq 'primary'){ $gid = $session->{primary}; }
    if(!$rest){$rest = $sel;}
    if($sel eq '2')    { $pat_sel  = $pattern->{down}; }
    elsif($sel eq '3') { $pat_sel  = $pattern->{updown}; }
    elsif($sel eq '5') { $pat_sel  = $pattern->{owner}; }

    if($rest eq '2')   { $pat_rest = $pattern->{down}; }
    elsif($rest eq '3'){ $pat_rest = $pattern->{updown}; }
    elsif($rest eq '4'){ $pat_rest = $pattern->{up}; }
    elsif($rest eq '5'){ $pat_rest = $pattern->{owner}; }

    if($owner)         { $pat_ow   = $pattern->{owner}; }
    if($owner == 1)    { $owner = 0; }

    # for_multi ---
    my $multi_view_rest_type = DA::IS::get_multi_view_rest_type($session);
    my $multi_view_rest_chk = 0;
    my $caller_cgi = $0;
    if ($multi_view_rest_type) {
        if ($caller_cgi =~ /\/admin-cgi-bin\//) {
            $multi_view_rest_chk = 0;
        } else {
            $multi_view_rest_chk = 1;
        }
    }

    if ($multi_view_rest_chk && $multi_view_rest_type eq '1') {
        if ($rest eq '1') {
            $pat_rest=$pattern->{down};
        } else {
            $pat_rest=~s/[U]//g;
        }
        $pat_sel =~s/[U]//g;

        # ドキュメント系 CGI は強制的にowner を与える
        if ($caller_cgi =~ /\/cgi-bin\/(lib_|ow_|sm_|object_link|disk_check)/) {
            $owner = 'document';
            $pat_ow = $pattern->{owner};
        }
    }
    #---

    my $g_list = DA::IS::get_favorite_group($session,$systemdefault,1);

    my $count=0;
    my $gid_cnt=0;
    my $self_flag = 0;
    my $other_flag = 0;
    my $owner_group=DA::IS::get_owner_group($session,$session->{user},0,$owner,$join);

    foreach my $group(@$g_list){
        if($group->{gid} eq ''){next;}
        if ($limited_admin) {
			if (!DA::IS::is_ctrlable_group($session,$group->{gid}) || $group->{type} ne '1') {
                next;
            }
        }

        # for_multi ----
        if ($multi_view_rest_chk) {
            if ($owner) {
                if (!DA::IS::is_permit_group($session, 'com_fav', $group->{gid}, $join, {owner_func=>$owner},$owner_group)) {
                    next;
                }
            }
        }
        #----
		if ($no_admin_g && $group->{gid} eq $DA::Vars::p->{admin_gid}) {next;} #管理権限グループを対象外
		
        if($group->{gid} eq $compel_self){$self_flag = 1;}
        if($group->{gid} eq $tmp_gid){$other_flag = 1;}

        my($w_rest,$flg,$view,$sel);

        if(!$pat_rest){
            $w_rest = 1;
        } else {
            if (!$join) { # $join は偽値が渡ってき得る
                $join = DA::IS::get_join_group($session,$session->{user},1);
            }

            if($join->{$group->{gid}}->{attr} =~/^[$pat_rest]$/){
                $w_rest = 1;
            }else{
                if($pat_ow && DA::IS::check_owner($session,$owner_group,$group->{gid},$owner)){
                    $w_rest = 2;
                }else{

                    # for_multi ----
                    if ($multi_view_rest_chk) {
                        if (!DA::IS::is_permit_group($session, 'com_fav', $group->{gid}, undef, {})) {
                            # 引数join は渡さないこと(todo_list.cgi で誤動作)
                            next;
                        }
                    }
                    #----

                    $w_rest = 0;
                    if($pat_sel && $join->{$group->{gid}}->{attr} !~/^[$pat_sel]$/){
                        $flg="*";
                    }
                }
            }
        }
        if($group->{type} eq '1'){ 
			$view="[G]"; 
		}elsif($group->{type} eq '2'){ 
			$view="[P]"; 
		}elsif($group->{type} eq '3'){ 
			$view="[T]"; 
		}elsif($group->{type} eq '4'){
			if($group->{org_type} eq '1'){
				$view="[G]";
			}elsif ($group->{org_type} eq 2) {
				$view="[P]";
			}else{
				$view="[T]";
			}
			if ($suspend){$flg="*";}
        }
        if($group->{gid} eq $gid || (!$gid && $force_first && !$result)){
			$sel="selected";
			$gtype=$group->{type};
			$result=1;
            $gid_cnt = $count;
		}
        my $info = { 'gid'		=> $group->{gid},
                     'type'		=> $group->{type},
                     'name'		=> $group->{name},
                     'org_type'	=> $group->{org_type},
                     'rest'		=> $w_rest,
                     'flg'		=> $flg,
                     'view'     => $view 
		};
        $group->{vname} = DA::CGIdef::encode($group->{vname},3,1,'euc');
        my $show_name = "$flg$view $group->{vname}";
        $show_name = DA::IS::format_jsubstr($session,$show_name,0,$len,0) if (0 < $len);
        $f_g_tag.="<option value=\"$group->{gid}\" $sel>"
                . "$show_name</option>\n";
        push(@$f_g_list,$info);
        $count++;
    }
	if ($gid eq $session->{user}) { $result=1;}

	my $group_table = DA::IS::get_group_table($session);
    if ($compel_self && !$self_flag) {
        my($w_rest,$flg,$view,$sel);
        if(!$pat_rest){
            $w_rest = 1;
        }elsif($join->{$compel_self}->{attr} =~/^[$pat_rest]$/){
            $w_rest = 1;
        }else{
            if($pat_ow && $join->{$compel_self}->{owner} =~/^[$pat_ow]$/){
                $w_rest = 2;
            }else{
                $w_rest = 0;
                if($pat_sel && $join->{$compel_self}->{attr} !~/^[$pat_sel]$/){
                    $flg="*";
                }
            }
        }

        my $sql="SELECT type,name,alpha,org_type FROM $group_table WHERE gid=?";
        my $sth=$session->{dbh}->prepare($sql);
           $sth->bind_param(1,$compel_self,3); $sth->execute();
        my ($type,$gname,$galpha,$org_type)=$sth->fetchrow; $sth->finish;
		if ($type) {
        	$gname=DA::IS::check_view_name($session,$gname,$galpha);
        	if($type eq '1'){ 
				$view="[G]"; 
			}elsif($type eq '2'){ 
				$view="[P]"; 
			}elsif($type eq '3'){ 
				$view="[T]"; 
			}elsif($type eq '4'){
            	if($org_type eq '1'){
                	$view="[G]";
				}elsif ($org_type eq '2') {
               		$view="[P]";
            	}else{
                	$view="[T]";
            	}
        		if ($suspend){$flg="*";}   ##########
        	}
        	if (!$result && ($tmp_gid ne $gid || $gid eq $compel_self)) { 
				$sel="selected"; 
				$result=1;
			}
        	$gtype=$type;
        	my $info = { 'gid'  	=> $compel_self,
                     	'type' 	=> $type,
                     	'name' 	=> $gname,
					 	'org_type'	=> $org_type,
                     	'rest' 	=> $w_rest,
                     	'flg'  	=> $flg };

        	my $vname = $gname;
        	if($compel_self eq $DA::Vars::p->{top_gid}) {
            	$vname=DA::IS::get_top_gid_name($session,0,$gname,1);
        	}elsif($compel_self eq $session->{primary}) {
				$vname.=b_(DA::Address::get_default_title('primary'));
        	}elsif($compel_self eq $DA::Vars::p->{temp_gid}) {
				$vname=DA::Address::get_default_title('suspend');
        	}else{
            	if($type eq '4') {
                	$vname=DA::IS::pre_suspend($session).$gname;
            	}
        	}
            $vname = DA::CGIdef::encode($vname,3,1,'euc');
            my $show_name = "$flg$view $vname";
            $show_name = DA::IS::format_jsubstr($session,$show_name,0,$len,0) if(0<$len);
            $f_g_tag = "<option value=\"$compel_self\" $sel>$show_name</option>\n" . $f_g_tag;
        	unshift(@$f_g_list,$info);
		}
    }

	if ($tmp_gid && !$other_flag && $tmp_gid ne $compel_self) {
        my($w_rest,$flg,$view,$sel);
        if(!$pat_rest){
            $w_rest = 1;
        }elsif($join->{$tmp_gid}->{attr} =~/^[$pat_rest]$/){
            $w_rest = 1;
        }else{
            if($pat_ow && $join->{$tmp_gid}->{owner} =~/^[$pat_ow]$/){
                $w_rest = 2;
            }else{
                $w_rest = 0;
                if($pat_sel && $join->{$tmp_gid}->{attr} !~/^[$pat_sel]$/){
                    $flg="*";
                }
            }
        }

        my $sql="SELECT type,name,alpha,org_type FROM $group_table WHERE gid=?";
        my $sth=$session->{dbh}->prepare($sql); $sth->execute($tmp_gid);
        my ($type,$gname,$galpha,$org_type)=$sth->fetchrow; $sth->finish;
		if ($type) {
        	$gname=DA::IS::check_view_name($session,$gname,$galpha);
        	if($type eq '1'){ 
				$view="[G]"; 
			}elsif($type eq '2'){ 
				$view="[P]"; 
			}elsif($type eq '3'){ 
				$view="[T]"; 
			}elsif($type eq '4'){
            	if($org_type eq '1'){
                	$view="[G]";
				}elsif ($org_type eq '2') {
               		$view="[P]";
            	}else{
                	$view="[T]";
            	}
        		if ($suspend){$flg="*";}   ##########
        	}
        	if (!$result) { 
				$sel="selected"; 
				$result=1;
			}
        	$gtype=$type;
        	my $info = { 'gid'  	=> $tmp_gid,
                     	'type' 	=> $type,
                     	'name' 	=> $gname,
					 	'org_type'	=> $org_type,
                     	'rest' 	=> $w_rest,
                     	'flg'  	=> $flg,
                        'view'  => $view };

        	my $vname = $gname;
        	if($tmp_gid eq $DA::Vars::p->{top_gid}) {
            	$vname=DA::IS::get_top_gid_name($session,0,$gname,1);
        	}elsif($tmp_gid eq $session->{primary}) {
				$vname.=b_(DA::Address::get_default_title('primary'));
        	}elsif($tmp_gid eq $DA::Vars::p->{temp_gid}) {
				$vname=DA::Address::get_default_title('suspend');
        	}else{
            	if($type eq '4') {
                	$vname=DA::IS::pre_suspend($session).$gname;
            	}
        	}
        	$vname .= b_("未登録");
        	$vname = DA::CGIdef::encode($vname,3,1,'euc');
        	my $sep_line = "<option value=\"sep_line\">--------------</option>\n";
        	$f_g_tag .= $sep_line;
        	$f_g_tag .= "<option value=\"$tmp_gid\" $sel>$flg$view "
			."$vname</option>\n";
        	push(@$f_g_list,$info);
		}
    }
    return ($f_g_tag,$f_g_list,$gtype,$result,$gid_cnt);
}
 
sub get_sel_under_option2{
my($session,$p,$sel_list,$join)=@_;

#### $sel_list  選択済みユーザ・グループ
#### $join      DA::IS::get_join_groupのデータ
#### $p->{gid}   選択済みグループ
#### $p->{gtype} 選択済みグループのタイプ
#### $p->{rest}  1 = 全組織の選択可（よく使うグループ）
####             2 = [12DW]  下位組織の選択可（よく使うグループ）
####             3 = [12UDW] 上位／下位組織の選択可（よく使うグループ）
####             4 = [12UW]  上位組織の選択可（よく使うグループ）
#### $p->{mode}  選択グループ直下に表示する種類
####             1 = G,P,T,U
####             2 = G
####             3 = P
####             4 = U
####             5 = T
####             7 = G,P,T
####             8 = G,P
####             9 = G,T,U
#### $p->{u_rest} 0 = 全ユーザ
####              1 = 下位組織所属ユーザ
#### $p->{u_type} 1:1 = ファイル共有限定、ログイン不能ユーザの表示
####               ファイル共有限定(1 or 0)：ログイン不能(1 or 0)
#### $p->{g_attr} 0=設定無し
####              1=自由参加可能プロジェクト
#### $p->{owner} 0=オーナー権限グループ選択可（よく使うグループ）
#### $p->{func}  呼出し元機能   # 2003.10.23 add by chaya
#### $p->{suspend} 1=廃止組織選択不可
#### $p->{self_sel}  1=自分自身選択可
#### $p->{ng_id}     選択不可とするユーザID (カンマ区切り)

    my $hidden_gid={};

	my $hidden=DA::IS::get_sys_custom($session,"hidden");

    #=====================================================
    #           ----custom----
    #=====================================================
    DA::Custom::usersel_hidden_group($session,$hidden_gid);

	my $member_table=DA::IS::get_member_table($session);
	my $group_table =DA::IS::get_group_table($session);

    my($pat_rest,$pat_ow,$under_tag,$under_list);
    my $pattern=DA::IS::get_group_pattern($session);
    if($p->{rest} eq '2')   { $pat_rest = $pattern->{down}; }
    elsif($p->{rest} eq '3'){ $pat_rest = $pattern->{updown}; }
    if($p->{owner})         { $pat_ow   = $pattern->{owner}; }
    if($p->{owner} == 1)    { $p->{owner} = 0; }

    my $bosses = {};
    if ($p->{u_rest} eq '1' && $p->{func} eq 'sc') {
        $bosses = &DA::IS::get_bosses($session);
    }

    my($sql,$sth,$max,$cu_group,$user_tag);
    my ($gtype, $project_permit, $v_name);
	if($p->{gtype} eq '4') {
		$v_name = DA::IS::get_ug_name($session,1,$p->{gid});
		$gtype = substr($v_name->{type}, 1, 1);
	} else {
		$gtype = $p->{gtype};
	}
    if($gtype eq '2'){
		# 廃止グループの場合はすでに取得済みにはず
		if (ref($v_name) ne 'HASH') {
        	$v_name=DA::IS::get_ug_name($session,1,$p->{gid});
		}	
        if($v_name->{permit} eq '2'){
            if($join->{$p->{gid}}->{attr} !~/^[$pattern->{member}]$/ &&
               !DA::IS::check_owner($session,{},$p->{gid},'all')){
                $project_permit=1;
            }
        }
    }

    if($p->{mode} =~ /[12345789]/){
        my $owner_group=DA::IS::get_owner_group($session,$session->{user},0,$p->{owner});
        push(@$under_list,{});
        if($p->{gtype} eq '3'){
            $sql="SELECT gid,name,kana,alpha,type,grade,group_join,permit,org_type "
                ."FROM $group_table WHERE gid=? AND type=3 "
                ."ORDER BY grade";
            $sth=$session->{dbh}->prepare($sql);
	        $sth->bind_param(1,$p->{gid},3);
		}elsif($p->{gtype} eq '4'){
			$sql="SELECT gid,name,kana,alpha,type,grade,group_join,permit,org_type "
				."FROM $group_table WHERE (parent=? OR gid=?) AND "
				."type IN (2,4) ORDER BY type,sort_level,upper(kana)";
				$sth=$session->{dbh}->prepare($sql);
				$sth->bind_param(1,$p->{gid},3);
				$sth->bind_param(2,$p->{gid},3);
        }else{
            my $gm_mid_sub="";
            if ($p->{gtype} eq '2') {
                my @gm_mids=DA::IS::get_attr5_ids($session, $p->{gid});
                $gm_mid_sub=DA::IS::make_large_in_phrase($session, \@gm_mids, 'gid', 500);
            }
            if ($gm_mid_sub) {
                $sql="SELECT gid,name,kana,alpha,type,grade,group_join,permit,org_type "
                    ."FROM $group_table WHERE (parent=? OR gid=? OR ($gm_mid_sub)) "
                    ."AND type IN (1,2,3) ORDER BY type,sort_level,upper(kana)";
            } else {
                $sql="SELECT gid,name,kana,alpha,type,grade,group_join,permit,org_type "
                    ."FROM $group_table WHERE (parent=? OR gid=?) "
                    ."AND type IN (1,2,3) ORDER BY type,sort_level,upper(kana)";
            }
            $sth=$session->{dbh}->prepare($sql);
	        $sth->bind_param(1,$p->{gid},3);
	        $sth->bind_param(2,$p->{gid},3);
        }
        # #######################################
        # 			Custom
        # #######################################
        DA::Custom::rewrite_fav_usersel_group_sql( $session, $p, $group_table, \$sth, \$sql );

        $sth->execute();
        while(my($id,$name,$kana,$alpha,$wtype,$grade,$group_join,$permit,$org_type)=$sth->fetchrow) {
			if ($id == $DA::Vars::p->{admin_gid} ||
				$id == $DA::Vars::p->{title_gid}){
				next;
			}
			if ($hidden_gid->{$id}) {
				next;
			}
            $name=DA::IS::check_view_name($session,$name,$alpha);
            if($wtype eq '1' || ($wtype eq '4' && $org_type eq '1')){
                if($p->{mode}!~/[12789]/){next;}
            }elsif($wtype eq '2' || ($wtype eq '4' && $org_type eq '2')){
                if($p->{mode}!~/[1378]/){next;}
            }else{
                if($p->{mode}!~/[1579]/){next;}
            }
            if($project_permit && $id ne $p->{gid}){next;}
            my($w_rest,$flg,$selected,$line);
            if(!$pat_rest){
                if($p->{g_attr}){
                    if(($wtype eq '2' || ($wtype eq '4' && $org_type eq '2')) &&
                        $p->{g_attr} eq '1' && $group_join eq '1'){
                        $w_rest = 1;
                    }else{
                        $flg="*";
                        $w_rest = 0;
                    }
                }else{
                    $w_rest = 1;
                }
            }elsif($join->{$id}->{attr} =~/^[$pat_rest]$/){
                $w_rest = 1;
            }else{
                if($pat_ow && DA::IS::check_owner($session,$owner_group,$id,$p->{owner})){
                    $w_rest = 2;
                }else{
                    if(($wtype eq '2' || ($wtype eq '4' && $org_type eq '2')) &&
                        $p->{g_attr} eq '1' && $group_join eq '1'){
                        $w_rest = 1;
                    }else{
                        $flg="*";
                        $w_rest = 0;
                    }
                }
            }
            if($p->{suspend} && $wtype eq '4'){
                $flg="*";
            }
            my $v_name = DA::IS::get_ug_name($session,0,$id,$wtype,$name,'',$grade,undef,$org_type);
			my $v_type;
			if ($v_name->{type} =~ /^S/) {
            	my $g_type = substr($v_name->{type},1,1);
				if ($g_type == 3) {
					$v_type = "T";	
				} elsif ($g_type == 2) {
					$v_type = "P";	
				} else {
					$v_type = "G";	
				}
			} else {
            	$v_type = substr($v_name->{type},0,1);
			}
			if($flg eq '*'){
				$v_name->{type} = '';
				if($hidden->{hide_cant_be_selected} eq "on" && $p->{gid} ne $id){
					next;
				}
			}

            if($p->{mode} ne '9' || $p->{gtype} ne '2'){
                if($p->{mode}!~/[345]/){ $line = t_('├'); }
            }
            if(ref($sel_list) eq 'HASH' && $sel_list->{$id}){
               $selected="selected";
            }
            if($p->{gid} eq $id){
                $cu_group="<option value=\"$id:$v_name->{type}:$v_name->{name}\" "
                ."$selected>$flg$v_name->{flg}$v_name->{name}</option>\n";
            }else{
                $user_tag.="<option value=\"$id:$v_name->{type}:$v_name->{name}\""
                ." $selected>$line$flg$v_name->{flg}$v_name->{name}</option>\n";
            }
            if(length($v_name->{name}) > $max){$max=length($v_name->{name});}
            my $info = { 'mid'  => $id,
                         'type' => $v_name->{type},
                         'name' => $v_name->{name},
                         'rest' => $w_rest,
                         'v_type'=> $v_type,
                         'flg'  => $flg };
			if($id eq $p->{gid}){
                $under_list->[0]=$info;
			}else{
                push(@$under_list,$info);
			}
        }
        $sth->finish;
    }
    if($p->{mode} =~ /[149]/ && !$project_permit){
        my $r_user_where = "1,2";
        if($p->{u_type}){
            my($r,$x)=split(/:/,$p->{u_type});
            if($r){ $r_user_where.=",3"; }
            if($x){ $r_user_where.=",4"; }
        }
        my(@u_list,$u_info,$mid_where,$join_gid);

        my ($m_sort_sql,$o_sort_sql,$custom_m_sort_sql,$custom_o_sort_sql);

		#====================================
		#   ---- custom ----
		#====================================
        DA::Custom::custom_order_user_selector_list($session,\$custom_m_sort_sql,\$custom_o_sort_sql);

        $m_sort_sql = $custom_m_sort_sql || " ORDER BY m.type,m.sort_level,upper(m.kana) ";
        $o_sort_sql = $custom_o_sort_sql || " ORDER BY o.type,o.sort_level,upper(o.kana) ";


        $sql ="SELECT m.mid,m.name,m.kana,m.alpha,m.type,"
             ."m.primary_gname,m.primary_galpha,m.primary_gtype "
             ."FROM is_group_member gm, $member_table m "
             ."WHERE gm.gid=? AND gm.mid=m.mid "
             ."AND gm.attr IN ('1','2') "
             ."AND m.type IN ($r_user_where) "
             ." $m_sort_sql ";
        # ##########################################
        # 			Custom
        # ##########################################
        DA::Custom::rewrite_fav_usersel_user_sql( $session, $p, $member_table, \$sql );

        $sth=$session->{dbh}->prepare($sql);
        $sth->bind_param(1,$p->{gid},3);
        $sth->execute();
        while(my($mid,$name,$kana,$alpha,$wtype,$gname,$galpha,$gtype)=$sth->fetchrow) {
            if($u_info->{$mid}){next;}
            $name=DA::IS::check_view_name($session,$name,$alpha);
            $gname=DA::IS::check_view_name($session,$gname,$galpha);
            push(@u_list,$mid);
            $u_info->{$mid} = { 'type'  => "$wtype" ,
                                'gtype' => "$gtype" ,
                                'name'  => "$name" ,
                                'gname' => "$gname" };
            $mid_where.=",$mid";
        }
        $sth->finish;
        if($p->{all_user}){
            my $max;
            my @gm_mids=DA::IS::get_attr5_ids($session, $p->{gid});
            my $gm_mid_sub1=DA::IS::make_large_in_phrase($session, \@gm_mids, 'real_gid', 500);
            my $gm_mid_sub2=DA::IS::make_large_in_phrase($session, \@gm_mids, 'gm.gid', 500);

            if ($DA::Vars::p->{ORACLE}) {
                if ($gm_mid_sub1) {
                    $sql ="SELECT m.mid,m.name,m.kana,m.alpha,m.type,"
                         ."m.primary_gname,m.primary_galpha,m.primary_gtype "
                         ."FROM is_group_member gm, $member_table m WHERE "
                         ."(gm.gid IN (select gid from is_group_path where (($gm_mid_sub1) or real_gid=?) and attr='D') "
                         ."OR ($gm_mid_sub2) "
                         ."OR gm.gid=?) "
                         ."AND gm.attr IN ('1','2') "
                         ."AND m.mid=gm.mid "
                         ."AND m.type IN ($r_user_where) "
                         ." $m_sort_sql ";
                } else {
                    $sql ="SELECT o.mid,o.name,o.kana,o.alpha,o.type,"
                         ."o.primary_gname,o.primary_galpha,o.primary_gtype "
                         ."FROM $member_table o WHERE o.mid IN "
                         ."("
                         ."SELECT mid FROM is_member m "
                         ."WHERE EXISTS (SELECT 1 FROM is_group_member gm, is_group_path p WHERE m.mid=gm.mid AND p.gid=gm.gid AND p.real_gid=? AND p.attr='D' AND gm.attr IN ('1','2') AND m.type IN ($r_user_where)) "
                         ."UNION "
                         ."SELECT mid FROM is_member m2 "
                         ."WHERE EXISTS (SELECT 1 FROM is_group_member gm2 WHERE gm2.gid=? AND m2.mid=gm2.mid AND gm2.attr IN ('1','2') AND m2.type IN ($r_user_where)) "
                         .") "
                         ." $o_sort_sql ";
                }
                $sql = "SELECT * FROM (" . $sql . ") WHERE ROWNUM <= 500";

            } else {  # MySQL
                $sql ="SELECT m.mid,m.name,m.kana,m.alpha,m.type,"
                     ."m.primary_gname,m.primary_galpha,m.primary_gtype "
                     ."FROM is_group_member gm, $member_table m WHERE ";
                if ($gm_mid_sub1) {
                    $sql.="(gm.gid IN (select gid from is_group_path where (($gm_mid_sub1) or real_gid=?) and attr='D') "
                         ."OR ($gm_mid_sub2) "
                         ."OR gm.gid=?) "
                         ."AND gm.attr IN ('1','2') "
                         ."AND m.mid=gm.mid "
                         ."AND m.type IN ($r_user_where) "
                         ." $m_sort_sql ";
                } else {
                    $sql.="(gm.gid IN (select gid from is_group_path where real_gid=? and attr='D') "
                         ."OR gm.gid=?) "
                         ."AND gm.attr IN ('1','2') "
                         ."AND m.mid=gm.mid "
                         ."AND m.type IN ($r_user_where) "
                         ." $m_sort_sql ";
                }
            }

            # #############################################
            # 			Custom
            # #############################################
            DA::Custom::rewrite_fav_usersel_alluser_sql( $session, $p, \@gm_mids, \$sql );
            
            $sth = $session->{dbh}->prepare($sql);
            $sth->bind_param(1,$p->{gid},3);
            $sth->bind_param(2,$p->{gid},3);
            $sth->execute();
            while(my($mid,$name,$kana,$alpha,$wtype,$gname,$galpha,$gtype)=$sth->fetchrow) {
                if($u_info->{$mid}){next;}
                $name=DA::IS::check_view_name($session,$name,$alpha);
                $gname=DA::IS::check_view_name($session,$gname,$galpha);
                push(@u_list,$mid);
                $u_info->{$mid} = { 'type'  => "$wtype" ,
                                    'gtype' => "$gtype" ,
                                    'name'  => "$name" ,
                                    'gname' => "$gname" };
                $mid_where.=",$mid";
                $max++;
                if($max > 500){last;}
            }
            $sth->finish;
        }
        if($mid_where && $p->{u_rest} eq '1'){
            $mid_where =~ s/^\,//;
            $sql ="SELECT gm.mid,gm.gid,gm.attr,gm.type,g.permit "
                 ."FROM is_group_member gm, $group_table g "
                 ."WHERE gm.mid IN (";
            if($#u_list > 800){
                $sql.="SELECT m.mid FROM is_group_member gm, is_member m "
                    . "WHERE gm.gid=$p->{gid} AND gm.mid=m.mid "
                    . "AND gm.attr IN ('1','2') "
                    . "AND m.type IN ($r_user_where)";
            }else{
                $sql.="$mid_where";
            }
            $sql.=") AND gm.attr IN ('1','2') "
                 ."AND (g.type=1 OR (g.type=4 AND g.org_type=1)) "
                 ."AND gm.gid=g.gid ";
            $sth=$session->{dbh}->prepare($sql); $sth->execute();
            while(my($wmid,$wgid,$wattr,$wtype,$permit)=$sth->fetchrow) {
                $join_gid->{$wmid}->{$wgid} = $permit;
            }
            $sth->finish;
        }

        my $ng_id = {};
        if ($p->{ng_id}) {
            my @ng_id_arr = split(/,/, $p->{ng_id});
            foreach my $ng (@ng_id_arr) {
                $ng_id->{$ng} = 1;
            }
        }

        my($line);
        if($p->{mode} eq '1' ||
          ($p->{mode} eq '9' && $p->{gtype} ne '2')){$line = t_('├');}
        if(@u_list){
            foreach my $id(@u_list){
                my($flg,$sel);
                my $v_name=DA::IS::get_ug_name($session,0,$id,
                                           $u_info->{$id}->{type},
                                           $u_info->{$id}->{name},
                                           $u_info->{$id}->{gname},'','',
                                           $u_info->{$id}->{gtype});
                my $rest = 0;
                if($p->{u_rest} eq '1' && ref($join_gid) eq 'HASH' &&
                   ref($join_gid->{$id}) eq 'HASH'){
                    foreach my $wgid(keys %{$join_gid->{$id}}){
                        if($join->{$wgid}->{attr} =~/^[$pattern->{down}]$/){
                            $rest = 1; last;
                        }
                    }
                }else{
                    $rest = 1;
                }

                # ボスの場合 --------------------------------
                if (!$rest && $p->{u_rest} eq '1' && $p->{func} eq 'sc') {
                    if ($bosses->{$id}) {
                       $rest = 1;
                    }
                }
                # 選択不可かどうか --------------------------------
                if ($ng_id->{$id}) {
                   $rest = 0;
                }

                my $v_type = substr($v_name->{type},0,1);
                if(!$rest){
                    $flg="*"; $v_name->{type} = '';
					if($hidden->{hide_cant_be_selected} eq "on"){
						next;
					}
                }
                if(ref($sel_list) eq 'HASH' && $sel_list->{$id}){
                    $sel = "selected";
                }
                $user_tag.="<option value=\"$id:$v_name->{type}:$v_name->{name}\""
                         . " $sel>$line$flg$v_name->{flg}$v_name->{name}"
                         . "</option>\n";
                if(length($v_name->{s_name})>$max){$max=length($v_name->{s_name});}
                my $info = { 'mid'  => $id,
                             'type' => $v_name->{type},
                             'name' => $v_name->{name},
                             'rest' => $rest,
                             'v_type' => $v_type,
                             'flg'  => $flg };
                push(@$under_list,$info);
            }
        }
    }
    $under_tag = $cu_group . $user_tag;
    return ($under_tag,$under_list,$max);
}

sub get_sel_under_auth{
my($session,$p,$sel_list,$join)=@_;

#### ドキュメントの所有者移行のユーザ選択のみで使用
####
#### あるグループに登録可能なユーザを選択するための関数
#### $sel_list  選択済みユーザ・グループ
#### $join      DA::IS::get_join_groupのデータ
#### $p->{gid}   選択済みグループ
#### $p->{gtype} 選択済みグループのタイプ
#### $p->{rest}  1 = 全組織の選択可（よく使うグループ）
####             2 = [12DW]  下位組織の選択可（よく使うグループ）
####             3 = [12UDW] 上位／下位組織の選択可（よく使うグループ）
#### $p->{mode}  選択グループ直下に表示する種類
####             4 = U
#### $p->{owner} 0=オーナー権限グループ選択可（よく使うグループ）
#### $p->{regist_gid} 登録可能なgid

	my $member_table=DA::IS::get_member_table($session);
	my $hidden=DA::IS::get_sys_custom($session,"hidden");

    my($pat_rest,$pat_ow,$under_tag,$under_list);
    my($sql,$sth,$max,$cu_group,$user_tag);
    my $pattern=DA::IS::get_group_pattern($session);
    if($p->{owner})         { $pat_ow   = $pattern->{owner}; }
    if($p->{owner} == 1)    { $p->{owner} = 0; }

    my(@u_list,$u_info,$mid_where,$join_gid);
    my $project_permit;
    if($p->{gtype} eq '2'){
        my $v_name=DA::IS::get_ug_name($session,1,$p->{gid});
        if($v_name->{permit} eq '2'){
            if($join->{$p->{gid}}->{attr} !~/^[$pattern->{member}]$/ &&
               !DA::IS::check_owner($session,{},$p->{gid},'all')){
                $project_permit=1;
            }
        }
    }
    if($p->{mode} =~ /[4]/ && !$project_permit){
        my $r_user_where = "1,2";
        $sql ="SELECT m.mid,m.name,m.kana,m.alpha,m.type,"
             ."m.primary_gname,m.primary_galpha,m.primary_gtype "
             ."FROM is_group_member gm, $member_table m "
             ."WHERE gm.gid=? AND gm.mid=m.mid "
             ."AND gm.attr IN ('1','2') "
             ."AND m.type IN (1,2) "
             ."ORDER BY m.type,m.sort_level,upper(m.kana)";
        $sth=$session->{dbh}->prepare($sql);
        $sth->bind_param(1,$p->{gid},3); $sth->execute();
        while(my($mid,$name,$kana,$alpha,$wtype,$gname,$galpha,$gtype)=$sth->fetchrow){
            push(@u_list,$mid);
            $name=DA::IS::check_view_name($session,$name,$alpha);
            $gname=DA::IS::check_view_name($session,$gname,$galpha);
            $u_info->{$mid} = { 'type'  => "$wtype" ,
                                'gtype' => "$gtype" ,
                                'name'  => "$name" ,
                                'gname' => "$gname" };
            $mid_where.=",$mid";
        }
        $sth->finish;

        if($p->{all_user}){
            my $max;
            my @gm_mids=DA::IS::get_attr5_ids($session, $p->{gid});
            my $gm_mid_sub1=DA::IS::make_large_in_phrase($session, \@gm_mids, 'real_gid', 500);
            my $gm_mid_sub2=DA::IS::make_large_in_phrase($session, \@gm_mids, 'gm.gid', 500);

            $sql ="SELECT m.mid,m.name,m.kana,m.alpha,m.type,"
                 ."m.primary_gname,m.primary_galpha,m.primary_gtype "
                 ."FROM is_group_member gm, $member_table m WHERE ";
            if ($gm_mid_sub1) {
                $sql.="(gm.gid IN (select gid from is_group_path where (($gm_mid_sub1) or real_gid=?) and attr='D') "
                     ."OR ($gm_mid_sub2) "
                     ."OR gm.gid=?) "
                     ."AND gm.attr IN ('1','2') "
                     ."AND m.mid=gm.mid "
                     ."AND m.type IN (1,2) "
                     ."ORDER BY m.type,m.sort_level,upper(m.kana)";
            } else {
                $sql.="(gm.gid IN (select gid from is_group_path where real_gid=? and attr='D') "
                     ."OR gm.gid=?) "
                     ."AND gm.attr IN ('1','2') "
                     ."AND m.mid=gm.mid "
                     ."AND m.type IN (1,2) "
                     ."ORDER BY m.type,m.sort_level,upper(m.kana)";
            }
            $sth = $session->{dbh}->prepare($sql);
            $sth->bind_param(1,$p->{gid},3);
            $sth->bind_param(2,$p->{gid},3);
            $sth->execute();
            while(my($mid,$name,$kana,$alpha,$wtype,$gname,$galpha,$gtype)=$sth->fetchrow){
                if($u_info->{$mid}){next;}
                push(@u_list,$mid);
                $name=DA::IS::check_view_name($session,$name,$alpha);
                $gname=DA::IS::check_view_name($session,$gname,$galpha);
                $u_info->{$mid} = { 'type'  => "$wtype" ,
                                    'gtype' => "$gtype" ,
                                    'name'  => "$name" ,
                                    'gname' => "$gname" };
                $mid_where.=",$mid";
                $max++;
                if($max > 500){last;}
            }
            $sth->finish;
        }
    }

    if($mid_where){
        foreach my $id(@u_list){
			my $j_list=DA::IS::get_join_group($session,$id,1);
			if($p->{rest} eq '3'){
				if($j_list->{$p->{regist_gid}}->{attr}=~/[$pattern->{updown}]/){
					$join_gid->{$id} = 1;next;
				}
			}else{
				if($j_list->{$p->{regist_gid}}->{attr}=~/[$pattern->{down}]/){
					$join_gid->{$id} = 1;next;
				}
			}
            my $owner_group=DA::IS::get_owner_group($session,$id,0,$p->{owner});
            if($pat_ow &&
               DA::IS::check_owner($session,$owner_group,$p->{regist_gid},$p->{owner})){
				$join_gid->{$id} = 1;next;
			}
		}
        my($line);
        if(@u_list){
            foreach my $id(@u_list){
                my($flg,$sel);
                my $v_name=DA::IS::get_ug_name($session,0,$id,
                                           $u_info->{$id}->{type},
                                           $u_info->{$id}->{name},
                                           $u_info->{$id}->{gname},'','',
                                           $u_info->{$id}->{gtype});
                my $rest = 0;

                if(ref($join_gid) eq 'HASH' && $join_gid->{$id}){
                    $rest = 1;
                }
                my $v_type = $v_name->{type};
                if(!$rest){
                    $flg="*"; $v_name->{type} = '';
					if($hidden->{hide_cant_be_selected} eq "on"){
						next;
					}
                }
                if(ref($sel_list) eq 'HASH' && $sel_list->{$id}){
                    $sel = "selected";
                }
                $user_tag.="<option value=\"$id:$v_name->{type}:$v_name->{name}\""
                         . " $sel>$line$flg$v_name->{flg}$v_name->{name}"
                         . "</option>\n";
                if(length($v_name->{s_name})>$max){$max=length($v_name->{s_name});}
                my $info = { 'mid'  => $id,
                             'type' => $v_name->{type},
                             'name' => $v_name->{name},
                             'rest' => $rest,
                             'v_type' => $v_type,
                             'flg'  => $flg };
                push(@$under_list,$info);
            }
        }
    }
    $under_tag = $cu_group . $user_tag;
    return ($under_tag,$under_list,$max);
}

sub get_select_option{
    my($session,$sel_list,$max,$sort)=@_;
    my($sel_tag);
    if(ref($sel_list) eq 'HASH'){
        if($sort){
            foreach my $value(sort values %$sel_list){
                my($no,$id,$type,$name)=split(/:/,$value,4);
                if(length($name) > $max){$max=length($name);}
                $name = DA::CGIdef::encode($name,3,1,'euc');
                my($flg);
				if($type eq '')    { next; }
                elsif($type eq 'G'){ $flg = '[G]'; }
                elsif($type eq 'P'){ $flg = '[P]'; }
                elsif(substr($type,0,1) eq 'T'){ $flg = '[T]'; }
                elsif(substr($type,0,1) eq 'S'){ 
					if(substr($type,1,1) eq '1') { $flg = '[G]'; }
					elsif(substr($type,1,1) eq '2') { $flg = '[P]'; }
					elsif(substr($type,1,1) eq '3') { $flg = '[T]'; }
				}
                elsif($type eq '3'){ $flg = '[R]'; }
                elsif($type eq '4'){ $flg = '[X]'; }
                else               { $flg = '[U]'; }
                $sel_tag.="<option value=\"$id\">$flg$name</option>\n";
            }
        }else{
            foreach my $id(sort keys %$sel_list){
                my($type,$name)=split(/:/,$sel_list->{$id},2);
                if(length($name) > $max){$max=length($name);}
                $name = DA::CGIdef::encode($name,3,1,'euc');
                my($flg);
				if($type eq '')    { next; }
                elsif($type eq 'G'){ $flg = '[G]'; }
                elsif($type eq 'P'){ $flg = '[P]'; }
                elsif(substr($type,0,1) eq 'T'){ $flg = '[T]'; }
                elsif(substr($type,0,1) eq 'S'){
                    if(substr($type,1,1) eq '1') { $flg = '[G]'; }
                    elsif(substr($type,1,1) eq '2') { $flg = '[P]'; }
                    elsif(substr($type,1,1) eq '3') { $flg = '[T]'; }
                }
                elsif($type eq '3'){ $flg = '[R]'; }
                elsif($type eq '4'){ $flg = '[X]'; }
                else               { $flg = '[U]'; }
                $sel_tag.="<option value=\"$id\">$flg$name</option>\n";
            }
        }
    }
    return ($sel_tag,$max);
}

sub get_group_pattern{
	my($session)=@_;
    my $pattern={};
    $pattern->{up}     = '12UW';
    $pattern->{down}   = '12DW';
    $pattern->{updown} = '12UDW';
    $pattern->{member} = '12';
    $pattern->{admin}  = '9';
    $pattern->{owner}  = '346';
    return $pattern;
}

sub check_group_pattern{
	my($session,$rest,$info,$rest_config,$func,$auth,$owner_group)=@_;

#### $rest = 0 登録時
####       = 1 全組織
####       = 2 下位組織
####       = 3 上位／下位組織
####       = 4 上位組織
####
#### return($permit)
#### $permit = 0 権限なし
#### $permit = 1 権限あり
#### $permit = 2 オーナー権限あり

    my $pattern = DA::IS::get_group_pattern($session);
    my $check_pattern;
    my $check;
    my $permit=1;
        if($func eq 'board'){
            if($rest_config->{bd_owner}){$check=$pattern->{owner};}
        }elsif($func eq 'schedule'){
            if($rest_config->{sc_owner}){$check=$pattern->{owner};}
        }elsif($func eq 'facilities'){
            if($rest_config->{fa_owner}){$check=$pattern->{owner};}
        }elsif($func eq 'task'){
            if($rest_config->{tk_owner}){$check=$pattern->{owner};}
        }elsif($func eq 'wflow'){
            if($rest_config->{wf_owner}){$check=$pattern->{owner};}
        }elsif($func eq 'address'){
            if($rest_config->{ad_owner}){$check=$pattern->{owner};}
        }elsif($func eq 'smart'){
            if($rest_config->{sm_owner}){$check=$pattern->{owner};}
        }elsif($func eq 'library'){
            if($rest_config->{lib_owner}){$check=$pattern->{owner};}
        }elsif($func eq 'share'){
            if($rest_config->{ow_owner}){$check=$pattern->{owner};}
        }
    if($rest){
        if($rest eq '2'){
            $check_pattern = $pattern->{down};
        }elsif($rest eq '3'){
            $check_pattern = $pattern->{updown};
        }elsif($rest eq '4'){
            $check_pattern = $pattern->{up};
        }
    }else{
        if($rest_config->{$func} eq '2'){
            $check_pattern = $pattern->{down};
        }else{
            $check_pattern = $pattern->{updown};
        }
    }

    if($check_pattern && $info->{attr} !~/^[$check_pattern]$/){
        if (ref($owner_group->{USER}) ne 'HASH' || !%{$owner_group->{USER}}){
            $owner_group=DA::IS::get_owner_group($session,$session->{user},0,$auth);
        }
        if($check && 
           DA::IS::check_owner($session,$owner_group,$info->{gid},$auth)){
            $permit=2;
        }else{
            $permit=0;
        }
    }
    
    return $permit;
}

# 多言語マスタ対応
sub check_view_name{
	my($session,$name,$alpha,$lang)=@_;

	if (ref($name) eq 'HASH') {
		# $nameが言語別に保存されているケース
		unless (defined $lang) {
			$lang = DA::IS::get_user_lang($session);
		}
		if (exists $name->{$lang}) {
			return $name->{$lang};
		} else {
			return $name->{'common'};
		}
	} else {
		if (DA::MultiLang::master_ok()) {
			return $name;
		} else {
			return DA::IS::check_view_name2($session, $name, $alpha);
		}
	}
}

# V1.11.0までと同等にnameとalphaのみで管理している場合
sub check_view_name2{
    my($session,$name,$alpha,$lang)=@_;

    if ($DA::IsLicense::op->{multi_lang}) {
		unless (defined $lang) {
			$lang = DA::IS::get_user_lang($session);
		}
        if ($lang ne 'ja' && !DA::IScheck::check_value($alpha)){
        	return($alpha);
		} else {
        	return($name);
		}
	} else {
        return($name);
	}
}

sub hashref_loop {
	my ($buf, $subref) = @_;
	if (ref($$buf) eq "HASH") {
		while (my ($key, $val) = each %$$buf) {
			$$buf->{$key} = &{$subref}($val);
		}
	} else {
		$$buf = &{$subref}($$buf);
	}
}

sub get_ug_name{
	my($session,$mode,$id,$type,$name,$pname,$grade,$encode,$gtype,$opt,$msid)=@_;
	# $mode = 1 の場合、ユーザ情報をＤＢから検索
	# $mode = 0 の場合、ユーザ情報を引数から取得
	# $mode = 2 の場合、ユーザ情報をＤＢから取得。名前は強制的にnameを使用。
	# $encode	タグのエンコードを行わない場合は１
	# $gtype 	組織の場合、org_type
    #           ユーザの場合、プライマリ組織のtype

	# $opt->{lang}	# 表示言語
    # $opt->{disp_tel3}  # 内線番号を表示するか否か
    # $opt->{tel3}       # 内線番号($mode=0のとき必要に応じ指定する)

	unless ($msid) {
		$msid = DA::MasterManager::get_select_msid($session);
	}

	my $member_table = DA::IS::get_member_table($session, $opt->{lang}, $msid);
	my $group_table  = DA::IS::get_group_table($session, $opt->{lang}, $msid);
	my $group_table_mm = DA::IS::get_group_table($session, "TBL", $msid);

    my $tel3="";
    if (exists($opt->{tel3})) {$tel3=$opt->{tel3}};

	my $v_name={};
    if($id == 0){ return $v_name; }
	my ($permit); #$mode=1 and プロジェクトの時のみセット
    if($mode eq '1' || $mode eq '2'){
        my($sql,$sth,$alpha,$palpha,$pgid);
        if(int($id) >= $DA::Vars::p->{top_gid}){
			# グループの場合
            $sql ="SELECT name,alpha,type,kana,alpha,grade,permit,org_type "
                 ."FROM $group_table WHERE gid=?";
            $sth=$session->{dbh}->prepare("$sql"); 
    		$sth->bind_param(1,$id,3);
    		$sth->execute();
            ($name,$alpha,$type,$pname,$palpha,$grade,$permit,$gtype)=$sth->fetchrow;
            $sth->finish;
		    # 廃止組織の扱い
    		if(int($id) >= $DA::Vars::p->{top_gid} && $type eq 4) {
    			if (int($id) == $DA::Vars::p->{temp_gid}) {
    				$name = DA::Address::get_default_title('suspend');
    			} else {
    				$name 	= DA::IS::pre_suspend($session)."$name";
    				if ($alpha ne '') {
    					$alpha 	= DA::IS::pre_suspend($session)."$alpha";
    				}
    			}
    		}
        }else{
			# ユーザの場合
            $sql="SELECT m.name,m.alpha,m.type,m.tel3,g.name,g.alpha,g.gid,g.type "
                ."FROM $member_table m, $group_table g "
                ."WHERE m.mid=? AND m.primary_gid=g.gid";
            $sth=$session->{dbh}->prepare("$sql"); 
    		$sth->bind_param(1,$id,3);
    		$sth->execute();
            ($name,$alpha,$type,$tel3,$pname,$palpha,$pgid,$gtype)=$sth->fetchrow;
            $sth->finish;
			if ($gtype eq '4') {
				$pname=DA::IS::pre_suspend($session)."$pname";
				if ($palpha ne '') {
	   				$palpha=DA::IS::pre_suspend($session)."$palpha";
	   			}
			}
            $v_name->{mid} = $id;
            if ($pgid) {
                $v_name->{primary_gid} = $pgid;
            }
        }

		# ▼ V1.11.0
		$name	= DA::CGIdef::get_display_name($session, $name, $opt->{lang});
		$alpha	= DA::CGIdef::get_display_name($session, $alpha, $opt->{lang});

	    $v_name->{tel3} = $tel3;
	    $v_name->{simple_name_ja}    = $name;
	    $v_name->{simple_name_alpha} = ($alpha) ? $alpha : $name;
        $v_name->{simple_pname_ja}    = $pname;
        $v_name->{simple_pname_alpha} = ($palpha) ? $palpha : $pname;
        if($mode eq '1'){
            $name=DA::IS::check_view_name($session,$name,$alpha);
            $pname=DA::IS::check_view_name($session,$pname,$palpha);
        }
    }else{
        if (int($id) == $DA::Vars::p->{top_gid}){
            hashref_loop(\$name, sub {DA::IS::get_top_gid_name($session,0,$_[0],undef,$msid)});
            $type='1';
		} elsif(int($id) > $DA::Vars::p->{top_gid} && ($type eq '4' || substr($type,0,1) eq 'S')) {
			if (int($id) == $DA::Vars::p->{temp_gid}) {
				$name = DA::Address::get_default_title('suspend');
			} elsif ($gtype) {
				my $pre_suspend = DA::IS::pre_suspend($session);
				hashref_loop(\$name, sub {
					my $suspend_name = $_[0]; $suspend_name =~ s/^\Q$pre_suspend\E//;
					return "$pre_suspend $suspend_name";
				});
            } else {
				my $sql ="SELECT org_type "
						."FROM $group_table_mm WHERE gid=?";
				my $sth=$session->{dbh}->prepare("$sql");
				$sth->bind_param(1,$id,3);
				$sth->execute();
				($gtype)=$sth->fetchrow;
				$sth->finish;
			}
			$type='4';
        } else {
			if ($gtype eq '4') {
				$pname=DA::IS::pre_suspend($session)."$pname";
            }
        }
		# ▼ V1.11.0
		$name	= DA::CGIdef::get_display_name($session, $name, $opt->{lang});
    }

    if($name eq ''){ 
		# 削除されたユーザの場合、空の HASH 変数を返す
		# $v_name->{table} には、削除ユーザのタグを返すように変更
		if (int($id)>=$DA::Vars::p->{top_gid}) {
			$v_name->{simple_name}=t_('削除された%1', t_('グループ'));
        	$v_name->{table}="<img src=$session->{icon_rdir}/ico_fc_group_rpl.$session->{icon_ext} "
        	."width=14 height=14 border=0 alt=\"@{[t_('削除グループ')]}\" align=top>"
			."@{[t_('削除された%1', t_('グループ'))]}";
		} else {	
			$v_name->{simple_name}=t_('削除された%1', t_('ユーザ'));
        	$v_name->{table}="<img src=$session->{icon_rdir}/ico_fc_userx.$session->{icon_ext} "
        	."width=14 height=14 border=0 alt=\"@{[t_('削除ユーザ')]}\" align=top>"
			."@{[t_('削除された%1', t_('ユーザ'))]}";
		}	
		return $v_name; 
	}

    if(int($id) != $DA::Vars::p->{insuite_mid} &&
      int($id) < $DA::Vars::p->{top_gid} && $pname){
		$pname = DA::IS::dis_attach_user_info($session,$id,$pname,undef,$msid);
    }else{
        $pname = "";
    }
	if(int($id) > $DA::Vars::p->{top_gid} && $type eq '4'){
		$pname = "";
	}

    #===========================================
    #     Custom
    #===========================================
    DA::Custom::overwrite_ug_name($session, $id, $type, \$name, \$pname);

	if (!$encode) {	
		$v_name->{name} = DA::CGIdef::encode("$name$pname",3,1,'euc');
		$v_name->{s_name} = DA::CGIdef::encode($name,3,1,'euc');
	} else {
		$v_name->{name} = "$name$pname";
		$v_name->{s_name} = $name;
	}
	$v_name->{simple_name} = $name;
    if($id >= $DA::Vars::p->{top_gid}){
        if($type eq '4') {
            $v_name->{usel} = "S$gtype:$name$pname";
            $v_name->{type} = "S$gtype";
            if($gtype eq '3'){
                $v_name->{flg}  = "[T]";
                $v_name->{icon} = "<img src=\"$session->{icon_rdir}/ico_fc_executive_rpl.$session->{icon_ext}\" width=14 height=14 border=0 align=absmiddle alt=\"@{[t_('廃止役職グループ')]}\">";
			} elsif ($gtype eq 2) {
                $v_name->{flg}  = "[P]";
    			$v_name->{permit} = $permit;
                $v_name->{icon} = "<img src=\"$session->{icon_rdir}/ico_fc_work_rpl.$session->{icon_ext}\" width=14 height=14 border=0 align=absmiddle alt=\"@{[t_('廃止プロジェクト')]}\">";
            }else{
                $v_name->{flg}  = "[G]";
                $v_name->{icon} = "<img src=\"$session->{icon_rdir}/ico_fc_organization_rpl.$session->{icon_ext}\" width=14 height=14 border=0 align=absmiddle alt=\"@{[t_('廃止組織')]}\">";
            }
		} else {
	    	if($type eq '2' || $type eq 'P'){
    			$v_name->{usel} = "P:$name$pname";
    			$v_name->{flg}  = "[P]";
    			$v_name->{type} = "P";
    			$v_name->{permit} = $permit;
    			$v_name->{icon} = "<img src=\"$session->{icon_rdir}/ico_fc_project.$session->{icon_ext}\" width=14 height=14 border=0 alt=\"@{[t_('プロジェクト')]}\" align=absmiddle>";
	    	}elsif($type eq '3' || substr($type,0,1) eq 'T'){
    			$v_name->{usel} = "T$grade:$name$pname";
    			$v_name->{flg}  = "[T]";
    			$v_name->{type} = "T$grade";
    			$v_name->{icon} = "<img src=\"$session->{icon_rdir}/ico_fc_executive.$session->{icon_ext}\" width=14 height=14 border=0 alt=\"@{[t_('役職グループ')]}\" align=absmiddle>";
        	}else{
    			$v_name->{usel} = "G:$name$pname";
    			$v_name->{flg}  = "[G]";
    			$v_name->{type} = "G";
    			$v_name->{icon} = "<img src=\"$session->{icon_rdir}/ico_fc_organization.$session->{icon_ext}\" width=14 height=14 border=0 alt=\"@{[t_('組織')]}\" align=absmiddle>";
        	}
		}
        $v_name->{href} = "<a href=\"javascript:gInfo('$id','$session->{pop_noname}','$msid')\">";
    }else{
   		$v_name->{usel} = "$type:$name$pname";
  		$v_name->{type} = $type;
        if($type eq '3'){
            $v_name->{flg}  = "[R]";
            $v_name->{icon} = "<img src=\"$session->{icon_rdir}/ico_fc_userfsh.$session->{icon_ext}\" width=14 height=14 border=0 alt=\"@{[t_('ファイル共有限定ユーザ')]}\" align=absmiddle>";
        }elsif($type eq '4'){
            $v_name->{flg}  = "[X]";
            $v_name->{icon} = "<img src=\"$session->{icon_rdir}/ico_fc_userx.$session->{icon_ext}\" width=14 height=14 border=0 alt=\"@{[t_('ログイン不能ユーザ')]}\" align=absmiddle>";
        }elsif($type eq '5'){
            $v_name->{flg}  = "[]";
            $v_name->{icon} = "<img src=\"$session->{icon_rdir}/ico_fc_useradm.$session->{icon_ext}\" width=14 height=14 border=0 alt=\"@{[t_('システム管理者')]}\" align=absmiddle>";
        }else{
            $v_name->{flg}  = "[U]";
            $v_name->{icon} = "<img src=\"$session->{icon_rdir}/ico_fc_user.$session->{icon_ext}\" width=14 height=14 border=0 alt=\"@{[t_('一般ユーザ')]}\" align=absmiddle>";
        }
        $v_name->{href} = "<a href=\"javascript:Info('$id','','$session->{pop_noname}','$msid');\">";
        $v_name->{href_prof} = "<a href=\"javascript:Info('$id','prof','$session->{pop_noname}','$msid')\">";
        $v_name->{href_info} = "<a href=\"javascript:Info('$id','info','$session->{pop_noname}','$msid')\">";
    }
	if ($id == $DA::Vars::p->{insuite_mid}){
		$v_name->{icon} = "<img src=\"$session->{icon_rdir}/ico_fc_useradm.$session->{icon_ext}\" width=14 height=14 border=0 alt=\"@{[t_('システム管理者')]}\" align=absmiddle>"
	}

    if ($opt->{disp_tel3}) {
        if ($tel3 ne '') {
            $tel3 = "(&nbsp;".t_("内線")."&nbsp;" .DA::CGIdef::encode("$tel3",3,1,'euc'). "&nbsp;)";
        }
    } else {
        $tel3 = "";
    }

	# □コールバック
	# ユーザ/グループのAタグの後ろに任意のタグを挿入する
	my $post_tag = DA::Custom::post_ug_tag($session, $id);
    $v_name->{page_title}="$v_name->{icon}$v_name->{href}$v_name->{name}</a>";
    $v_name->{table}="$v_name->{icon}$v_name->{href}$v_name->{name}</a>$post_tag$tel3";
    $v_name->{table_prof}="$v_name->{icon}$v_name->{href_prof}$v_name->{name}</a>";
    $v_name->{table_info}="$v_name->{icon}$v_name->{href_info}$v_name->{name}</a>";
    $v_name->{table_noinfo}="$v_name->{icon}$v_name->{name}";

	#===========================================
	#     Custom
	#===========================================
	DA::Custom::custom_link_vname($session,$v_name,$post_tag,$tel3);
	#===========================================

	return ($v_name);
}

sub get_view_user_sort {
	my($session,$list,$mode,$except,$del_btn,$extract_btn,$tel_ext,$single,$login)=@_;
	# mode=1    : 空白の場合もテーブルセルを生成する
	# tel_ext=1 : 名前横に内線番号を表示する
    my $table_buf;
    my $ix=1;

	my $member_table=DA::IS::get_member_table($session);
    my $join_gid=DA::IS::get_join_group($session,$session->{user},1);

    my $tel3_dat={};
    if ($tel_ext) {
        my @ids=keys(%$list);
        my $where="";
        if (1==scalar(@ids)) {
            my $mid=$ids[0];
            my $sql="SELECT tel3 FROM $member_table WHERE mid=?";
	        my $sth=$session->{dbh}->prepare($sql); 
        	   $sth->bind_param(1,$mid,3); $sth->execute();
            my ($tel3)=$sth->fetchrow;
            $sth->finish();
            if ($tel3 ne '') { $tel3_dat->{$mid}=$tel3; }
        } elsif (1<scalar(@ids)) {
            while (1) {
                if(!@ids){last;}
                my @list = splice(@ids,0,800);
                my $mid_in=join(',',@list);
                $mid_in =~ s/\,$//;
                if ($mid_in eq ''){last;}
				DA::DB::bind_clear();
                my $sql="SELECT mid, tel3 FROM $member_table "
				 . "WHERE mid IN (@{[DA::DB::bind_pushin($mid_in,3)]})";
				my $sth=DA::DB::bind_set($session, $sql);
    	           $sth->execute();
                while (my ($mid, $tel3)=$sth->fetchrow) {
                    if ($tel3 ne '') { $tel3_dat->{$mid}=$tel3; }
                }
                $sth->finish();
				DA::DB::bind_clear();
            }
        }
    }

    foreach my $value(sort values %$list){
        if (!$value) { next; }
		if ($except && $value =~ /^($except)$/) { next; }
        my($no,$id,$type,$name)=split(/:/,$value,4);
		if ($except && $id =~ /^($except)$/) { next; }

        my $v_name;
        if ($tel_ext && $id < $DA::Vars::p->{top_gid}) {
            $v_name = DA::IS::get_ug_name($session,0,$id,$type,$name,undef,undef,undef,undef,
                                          {disp_tel3=>1, tel3=>$tel3_dat->{$id}});
        } else {
            $v_name = DA::IS::get_ug_name($session,0,$id,$type,$name);
        }

        my $extract_btn_tag;
        my $del_btn_tag;
	my $log_btn_tag;
        if($extract_btn && $id >= $DA::Vars::p->{top_gid}){
            $extract_btn_tag="<a href=\"javascript:extractGroup('$extract_btn','$id');\"><img src=\"$session->{img_rdir}/aqbtn_arrowd.gif\" width=16 height=16 border=0 align=top alt=\"@{[t_('展開')]}\"></a>";
        }
        if($del_btn){
            $del_btn_tag="<a href=\"javascript:deleteItem('$del_btn','$id');\"><img src=\"$session->{img_rdir}/aqbtn_close_s.gif\" width=14 height=14 border=0 align=top alt=\"@{[t_('削除')]}\"></a>";
        }
	if ($login->{$id}->{text}) {
		$log_btn_tag = $login->{$id}->{text};
		if ($login->{$id}->{btn}) {
			$log_btn_tag .= "<a href=\"javascript:userLogout('$id');\"><img src=\"$session->{img_rdir}/aqbtn_compellogout.gif\" width=55 height=15 border=0 align=top alt=\"@{[t_('ログアウト')]}\"></a>"		
		}
	}
        my $name_part="$v_name->{table}$log_btn_tag$extract_btn_tag$del_btn_tag";

        if($single){
            $table_buf.="<tr><td nowrap width=50%>$name_part&nbsp;</td></tr>\n";
        }else{
            if($ix == 1){
                $table_buf.="<tr><td nowrap width=50%>$name_part&nbsp;</td>";
                $ix = 2;
            }else{
                $table_buf.="<td nowrap width=50%>$name_part&nbsp;</td></tr>\n";
                $ix = 1;
            }
        }
    }
    unless($single){
        if($ix == 2){
            $table_buf.="<td width=50%>&nbsp;</td></tr>\n";
        }
    }
    if($mode){
        if(!$table_buf){$table_buf="";}
    }else{
        if(!$table_buf){$table_buf="<tr><td>&nbsp;</td></tr>";}
    }
    return $table_buf;
}

sub get_view_user_sort_so {
#セカンダリオーナー表示用
	my($session,$list,$auth,$auth_type,$del_btn,$view_lang,$name_subster)=@_;
    my $table_buf;

    my $auth_img = DA::IS::get_auth_img($session);
    foreach my $value(sort values %$list){
        if (!$value) { next; }
        my($no,$id,$type,$name)=split(/:/,$value,4);

		if($name_subster){
			## 表示名に文字数制限がある場合は文字列をカット
			$name = DA::Unicode::format_jsubstr($session, $name, 0, $name_subster);
		}

        my $v_name = {};
        if ($view_lang && ($view_lang ne DA::IS::get_user_lang($session))) {
            my $opt = (DA::MultiLang::master_ok()) ? {lang => $view_lang} : undef;
            $v_name = DA::IS::get_ug_name($session,1,$id,$type,$name,undef,undef,undef,undef,$opt);
        } else {
            $v_name = DA::IS::get_ug_name($session,0,$id,$type,$name);
        }
        if($del_btn){
            $v_name->{table}.="<a href=\"javascript:deleteItem('$del_btn','$id');\">"
                             ."<img src=\"$session->{img_rdir}/aqbtn_close_s.gif\" width=14 height=14 border=0 align=top></a>";
        }
        $table_buf.="<tr><td nowrap>$v_name->{table}";
        if($auth_type->{$id} eq '1'){
            my(@owner)=split(/\,/,$auth->{$id});
            my $wauth=$auth->{$id};
            $wauth=~s/\,/\-/g;
            $table_buf.="&nbsp;&nbsp;<a href=\"javascript:authInfo('$wauth','$session->{pop_noname}')\">"
                      . b_("権限制限")."</a>";
        }
        $table_buf.="</td></tr>";
    }
    return $table_buf;
}

sub get_view_fa_sort {
	my($session,$list,$del_btn)=@_;
    my $table_buf;
    my $ix=1;
    my $icon="<img src=$session->{icon_rdir}/ico_fc_reservation.$session->{icon_ext} width=14 "
            ."height=14 alt=\"@{[t_('施設設備')]}\" align=top>";
    my $del_icon="<img src=\"$session->{img_rdir}/aqbtn_close_s.gif\" width=14 height=14 border=0 align=top alt=\"@{[t_('削除')]}\">";
    foreach my $value(sort values %$list){
        if(!$value){next;}
        my($no,$fid,$fgid,$name)=split(/:/,$value,4);
        $name = DA::CGIdef::encode($name,1,1,'euc');
        my $del_tag;
        if($del_btn){
            $del_tag="<a href=\"javascript:deleteItem('$del_btn','$fid');\">$del_icon</a>";
        }
        if($ix == 1){
            $table_buf.="<tr><td nowrap width=50%>$icon"
                      . "<a href=\"javascript:fInfo('$fid','$session->{pop_noname}');\">$name</a>$del_tag</td>";
            $ix = 2;
        }else{
            $table_buf.="<td nowrap width=50%>$icon"
                      . "<a href=\"javascript:fInfo('$fid','$session->{pop_noname}');\">$name</a>$del_tag"
                      . "</td></tr>\n";
            $ix = 1;
        }
    }
    if($ix == 2){
        $table_buf.="<td width=50%>&nbsp;</td></tr>\n";
    }
    if(!$table_buf){$table_buf="<tr><td>&nbsp;</td></tr>";}
    return $table_buf;
}

sub get_view_fa_sort_tip {
	my($session,$list)=@_;
    my @table;

    foreach my $value(sort values %$list){
        if(!$value){next;}
        my($no,$fid,$fgid,$name)=split(/:/,$value,4);
        push @table, DA::CGIdef::encode($name,1,1,'euc');
    }

    return @table;
}

sub get_view_addr_sort {
	my($session,$list,$del_btn,$single)=@_;
    my $table_buf;
    my $ix=1;
    my $icon="<img src=$session->{icon_rdir}/ico_fc_userx.$session->{icon_ext} width=14 "
            ."height=14 alt=\"@{[t_('その他参加者')]}\" align=top>";
	my $del_icon="<img src=\"$session->{img_rdir}/aqbtn_close_s.gif\" width=14 height=14 border=0 align=top alt=\"@{[t_('削除')]}\">";
    foreach my $value(sort values %$list){
        if(!$value){next;}
        my($no,$aid,$name)=split(/:/,$value,3);
        $name = DA::CGIdef::encode($name,1,1,'euc');
        my $del_tag;
        if($del_btn){
            $del_tag="<a href=\"javascript:deleteItem('$del_btn','$aid');\">$del_icon</a>";
        }
		if ($single) {
			$table_buf.="<tr><td nowrap>$icon"
				. "<a href=\"javascript:aInfo('$aid','$session->{pop_noname}');\">$name</a>$del_tag</td></tr>\n";
		} else {
			if($ix == 1){
            	$table_buf.="<tr><td nowrap width=50%>$icon"
                      . "<a href=\"javascript:aInfo('$aid','$session->{pop_noname}');\">$name</a>$del_tag</td>";
            	$ix = 2;
        	}else{
            	$table_buf.="<td nowrap width=50%>$icon"
                      . "<a href=\"javascript:aInfo('$aid','$session->{pop_noname}');\">$name</a>$del_tag"
                      . "</td></tr>\n";
            	$ix = 1;
        	}
		}
    }
    if($ix == 2){
        $table_buf.="<td width=50%>&nbsp;</td></tr>\n";
    }
    if(!$table_buf){$table_buf="<tr><td>&nbsp;</td></tr>";}
    return $table_buf;
}

sub get_view_user_sort4ajx {
	my ($session, $list, $except, $tel3_text, $app_type, $login) = @_;
	my $data = [];

	my $member_table=DA::IS::get_member_table($session);
	foreach my $value (sort values %{$list}) {
		if (!$value) { next; }
		if ($except && $value =~ /^($except)$/) { next; }
		my ($no, $id, $type, $name) = split(/:/, $value, 4);
		if ($except && $id =~ /^($except)$/) { next; }
		if ($type =~ /^T\d+/) { $type = "T"; }
		my $tel3;
        
		if ($tel3_text && $id < $DA::Vars::p->{top_gid}){
			my $sql="SELECT tel3 FROM $member_table WHERE mid=?";
			my $sth=$session->{dbh}->prepare($sql);
			$sth->bind_param(1,$id,3); $sth->execute();
			$tel3=$sth->fetchrow; $sth->finish();
			if ($tel3 ne '') {
				$tel3='('.t_('内線')." ".$tel3.')';
			}
		} 

		my $hash = {
			id   => $id,
			type => $type,
			name => $name,
			tel3 => $tel3,
			login=> $login->{$id}->{text},
			logout=>$login->{$id}->{btn}
		};
		$hash->{sum} = DA::Ajax::API::gen_checksum4inc_search($session, $app_type, $hash);
		push(@{$data}, $hash);
	}

	return DA::Ajax::make_json($session, $data, undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset(), 1) || "[]";
}

sub get_view_name {
	my ($session,$type,$name)=@_;

	$name =~ s/\s+$//g;
	$name = DA::CGIdef::encode($name,3,1,'euc');
	my $v_name={};
	$v_name->{type1} = $name;
	if($type eq '3'){
		$v_name->{type2} = "[R]$name";
		$v_name->{icon} = "ico_fc_userfsh.$session->{icon_ext}";
	}elsif($type eq '4'){
		$v_name->{type2} = "[X]$name";
		$v_name->{icon} = "ico_fc_userx.$session->{icon_ext}";
	}else{
        if($type eq 'G'){
		    $v_name->{icon} = "ico_fc_organization.$session->{icon_ext}";
        }elsif($type eq 'P'){
		    $v_name->{icon} = "ico_fc_project.$session->{icon_ext}";
        }elsif(substr($type,0,1) eq 'T'){
		    $v_name->{icon} = "ico_fc_executive.$session->{icon_ext}";
	    }else{
		    $v_name->{icon} = "ico_fc_user.$session->{icon_ext}";
        }
	}

	return ($v_name);
}

sub get_tab_html{
	my($session,$param,$pad)=@_;

    my $pad_head = "";
    my $pad_tail = "";
    if ($pad) {
        my $sp = "&nbsp;" x $pad;
        $pad_head=<<end_tag;
<table border=0 cellspacing=0 cellpadding=0>
<tr>
<td>$sp</td>
<td nowrap align="center">
end_tag
        $pad_tail=<<end_tag;
</td>
<td>$sp</td>
</tr>
</table>
end_tag
    }

    my $cols  = $param->{tabs} + 1;
    my $cols2 = $cols + 2;

	my $tab;
    for(my $ix=1;$ix<=$param->{tabs};$ix++){
    	if($param->{"tab_href$ix"}=~/^\'(.+)\'$/ || $param->{"tab_href$ix"}=~/^\"(.+)\"$/ ){
    		$param->{"tab_href$ix"}=$1;
    	}
        if($ix == $param->{tab_on}){

$tab.=<<end_tag;
<td valign=bottom><table border=0 cellspacing=0 cellpadding=0>
<tr><td><img src=$session->{img_rdir}/waku_st_tl.gif height=2 width=2></td>
<td background=$session->{img_rdir}/waku_st_t_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td>
<td><img src=$session->{img_rdir}/waku_st_tr.gif width=4 height=2></td></tr>
<tr><td background=$session->{img_rdir}/waku_st_l_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=14></td>
<td nowrap background=$session->{img_rdir}/waku_st_bg.gif align=center>$pad_head<b><a href="$param->{"tab_href$ix"}" class=tab>$param->{"tab_name$ix"}</a></b>$pad_tail</td>
<td background=$session->{img_rdir}/waku_st_r_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td></tr>
<tr><td height=2><img src=$session->{img_rdir}/null.gif width=1 height=2></td>
<td background=$session->{img_rdir}/waku_st_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td>
<td><img src=$session->{img_rdir}/waku_st_tbase_r.gif width=4 height=2></td></tr>
</table></td>
end_tag

        }else{

$tab.=<<end_tag;
<td valign=bottom><table border=0 cellspacing=0 cellpadding=0>
<tr><td><img src=$session->{img_rdir}/waku_dk_tl.gif height=2 width=2></td>
<td background=$session->{img_rdir}/waku_dk_t_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td>
<td><img src=$session->{img_rdir}/waku_dk_tr.gif width=4 height=2></td></tr>
<tr><td background=$session->{img_rdir}/waku_dk_l_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=14></td>
<td nowrap bgcolor=#ECECEC align=center>$pad_head<a href="$param->{"tab_href$ix"}" class=tab>$param->{"tab_name$ix"}</a>$pad_tail</td>
<td background=$session->{img_rdir}/waku_dk_r_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td></tr>
<tr><td height=2 background=$session->{img_rdir}/waku_st_t_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=2></td>
<td background=$session->{img_rdir}/waku_st_t_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td>
<td background=$session->{img_rdir}/waku_st_t_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td></tr>
</table></td>
end_tag

        }
    }

	# テンプレートのカスタマイズ対応
	my $tmpl = DA::Unicode::html_template(
		filename => "tab.tmpl",
		cache  => 1
	);
	$tmpl->param(
		IMG_RDIR => $session->{img_rdir},
		MESSAGE  => $param->{message},
		CONTENTS => $param->{contents},
		MARK     => ($param->{mark} ne 'no') ? "[ ! ]" : "",
		TAB      => $tab
	);

    return $tmpl->output;
}

# 環境設定画面下部などの説明部分(table)を生成
sub get_exp_html {
    my ($session, $item_ref, $exp_ref, $width) = @_;

    if (!$width) { $width = '100%'; }
    my @item = @$item_ref;
    my @exp  = @$exp_ref;

    my $outbuf="<table border=0 width=\"$width\">";
    foreach my $i (0..$#item) {
$outbuf.=<<end_buf
<tr>
<td align="right" valign="top" nowrap>$item[$i]</td>
<td valign="top" nowrap>----</td>
<td width=100%>$exp[$i]<td>
</tr>
end_buf
    }
    $outbuf.="</table>";
    return $outbuf;
}

# WA::CGI用にエラーの枠内のメッセージのみを戻す
sub conf_error_msg_detail {
    my ($session,$param,$mode,$cr)=@_;

	# MSID をクリアする
	DA::MasterManager::unset_sel_msid($session);

	# Use of uninitialized value エラーを無視する
	$^W = 0;
if ($cr eq 1) {
	# 改行 -> <BR>, タグ -> encode
    $param->{error}="<table><tr><td>".DA::CGIdef::encode($param->{error},2,1,'euc')."</td></tr></table>";
} elsif ($cr eq 2) {
	# 改行 -> 削除, タグ -> encode なし
    $param->{error}=DA::CGIdef::encode($param->{error},1,0,'euc');
} else {
	# 改行 -> 削除, タグ -> encode
    $param->{error}=DA::CGIdef::encode($param->{error},1,1,'euc');
}
my $button;
if (!$mode) {
    $button="<input type=button value=\"@{[t_('戻　る')]}\" onClick=\"history.back();\">";
} elsif ($mode ne 1) {
    $button="<input type=button value=\"@{[t_('戻　る')]}\" onClick=\"location.href='$mode';\">";
}

$param->{contents}=<<end_tag;
<center><br>
<img src=$session->{img_rdir}/popy_try.gif border=0 width=130 height=88><p>
$param->{error}<p><br>
<table border=0><tr><td>
<form>
$param->{hidden}
$button
</form>
</td></tr></table>
</center>
<br><br>
end_tag

return $param->{contents};
}

sub conf_error_msg{
    my ($session,$param,$mode,$cr,$pad)=@_;

	$param->{contents} = DA::IS::conf_error_msg_detail($session, $param, $mode, $cr);
my $html_tag = DA::IS::get_tab_html($session,$param,$pad);

my ($head,$body)=DA::IS::get_head($session,"Config Error",'','',1);
my $outbuf=<<end_tag;
$head
<STYLE type="text/css"><!--
	BODY, TD { color: black; }
	a.tab { color: black; text-decoration: none}
	a:visited {color: #1d39bb}
	a.tab { color: black ! important; text-decoration: none}
	.blk {color: black ! important }
	.sel {color: #CE6C40 ! important; font-weight: bold}
	.title {color: white}
//-->
</STYLE>
<SCRIPT LANGUAGE="JavaScript"><!--
	$param->{javascript}
//--></SCRIPT>
</head>
$body
$param->{page_title}
$html_tag
</body></html>
end_tag

	DA::IS::print_data($session,$outbuf);
   	$session->{dbh}->disconnect;
   	Apache::exit();
}

sub get_tab_info_html{
	my($session,$param)=@_;

    my $cols  = $param->{tabs} + 1;
    my $cols2 = $cols + 2;

	my $tab;
    for(my $ix=1;$ix<=$param->{tabs};$ix++){
    	if($param->{"tab_href$ix"}=~/^\'(.+)\'$/ || $param->{"tab_href$ix"}=~/^\"(.+)\"$/ ){
        	$param->{"tab_href$ix"}=$1;
		}    	
        if($ix == $param->{tab_on}){

$tab.=<<end_tag;
<td valign=bottom><table border=0 cellspacing=0 cellpadding=0>
<tr><td><img src=$session->{img_rdir}/waku_st_tl.gif height=2 width=2></td>
<td background=$session->{img_rdir}/waku_st_t_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td>
<td><img src=$session->{img_rdir}/waku_st_tr.gif width=4 height=2></td></tr>
<tr><td background=$session->{img_rdir}/waku_st_l_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=14></td>
<td nowrap background=$session->{img_rdir}/waku_st_bg.gif align=center><b><a href="$param->{"tab_href$ix"}" class=tab>$param->{"tab_name$ix"}</a></b></td>
<td background=$session->{img_rdir}/waku_st_r_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td></tr>
<tr><td height=2><img src=$session->{img_rdir}/null.gif width=1 height=2></td>
<td background=$session->{img_rdir}/waku_st_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td>
<td><img src=$session->{img_rdir}/waku_st_tbase_r.gif width=4 height=2></td></tr>
</table></td>
end_tag

        }else{

$tab.=<<end_tag;
<td valign=bottom><table border=0 cellspacing=0 cellpadding=0>
<tr><td><img src=$session->{img_rdir}/waku_dk_tl.gif height=2 width=2></td>
<td background=$session->{img_rdir}/waku_dk_t_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td>
<td><img src=$session->{img_rdir}/waku_dk_tr.gif width=4 height=2></td></tr>
<tr><td background=$session->{img_rdir}/waku_dk_l_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=14></td>
<td nowrap bgcolor=#ECECEC align=center><a href="$param->{"tab_href$ix"}" class=tab>$param->{"tab_name$ix"}</a></td>
<td background=$session->{img_rdir}/waku_dk_r_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td></tr>
<tr><td height=2 background=$session->{img_rdir}/waku_st_t_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=2></td>
<td background=$session->{img_rdir}/waku_st_t_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td>
<td background=$session->{img_rdir}/waku_st_t_bg.gif><img src=$session->{img_rdir}/null.gif width=1 height=1></td></tr>
</table></td>
end_tag

        }
    }
	my $tmpl = HTML::Template->new(
		filename => "$DA::Vars::p->{tmpl_dir}/tab_info.tmpl",
		cache  => 1
	);
	$tmpl->param(
		IMG_RDIR => $session->{img_rdir},
		CONTENTS => $param->{contents},
		TAB      => $tab,
		t_close	 => t_("閉じる")
	);
    return $tmpl->output;
}

sub info_error_msg{
    my ($session,$param)=@_;

	# MSID をクリアする
	DA::MasterManager::unset_sel_msid($session);

	# Use of uninitialized value エラーを無視する
	$^W = 0;

$param->{contents}=<<end_tag;
<center><br>
<img src=$session->{img_rdir}/popy_try.gif border=0 width=130 height=88><p>
$param->{error}<p><br>
<table border=0 background="$session->{img_rdir}/null.gif">
<tr><td><form>
$param->{hidden}
</td></form></tr></table><br><br>
end_tag

my $html_tag = DA::IS::get_tab_info_html($session,$param);

my ($head,$body)=DA::IS::get_head($session,"Info Error",'','',1);
my $outbuf=<<end_tag;
$head
<STYLE type="text/css"><!--
	BODY, TD { color: black; }
	a.tab { color: black; text-decoration: none}
	a:visited {color: #1d39bb}
	a.tab { color: black ! important; text-decoration: none}
	.blk {color: black ! important }
	.sel {color: #CE6C40 ! important; font-weight: bold}
	.title {color: white}
//-->
</STYLE>
<SCRIPT LANGUAGE="JavaScript"><!--
	$param->{javascript}
//--></SCRIPT>
</head>
<body bgcolor="#FFFFFF" text="#000000" leftmargin="7" topmargin="7" marginwidth="7" marginheight="7" rightmargin="0">
$param->{page_title}
$html_tag
</body></html>
end_tag

	DA::IS::print_data($session,$outbuf);
    $session->{dbh}->disconnect;
    Apache::exit();
}

sub read_check_conf {
    my $check={};
    DA::System::file_open(\*IN,"$DA::Vars::p->{custom_dir}/check.dat");
    while(my $data=<IN>) {
		chomp($data);
        my ($key,$val)=split(/=/,$data);
        if ($key eq '') { next; }
        $check->{$key}=$val;
    }
    close(IN);
    if (!$check->{rfc}) { $check->{rfc}="on"; }
    if ($check->{check_max} eq '') { $check->{check_max}="30"; }

    return ($check);
}

sub set_auth_conf {
my ($dir,$user,$and,$plus,$except)=@_;
# $and,$plus,$except はユーザ・グループ配列 (オプション)

$dir=~s/\/$//;
if ($dir eq '') { return; }

# Change by T.K 2003/08/25 --->
my ($users_line,$groups_line,$necessary_line,$plus_line,$except_line);
my (@users,@groups,@necessary,@plus,@except);
foreach my $key (@{$user}) {
	if ($key eq '') { next; }
	if ($key >= $DA::Vars::p->{top_gid}) {
		push (@groups, $key);
	} else {
		push (@users, $key);
	}
}

# AND グループ条件が指定されていない場合は、necessary 行は書き換えない
# 既存の設定を解除する場合は空の配列ポインタを $and に渡す
if (!$and) {
	DA::System::file_open(\*IN,"$dir/.htaccess");
	while (my $line=<IN>) {
		chomp($line);
		$line=~s/^\s+//;
		if ($line =~ /^require\s+necessary\s+(.*)/i) {
			@necessary=split(/\s+/,$1);
		}
	}
	close(IN);
} else {
	foreach my $key (@{$and}) {
		if ($key eq '') { next; }
		push (@necessary, $key);
	}
}

# 追加ユーザ条件が指定されていない場合は、plus 行は書き換えない
# 既存の設定を解除する場合は空の配列ポインタを $plus に渡す
if (!$plus) {
	DA::System::file_open(\*IN,"$dir/.htaccess");
	while (my $line=<IN>) {
		chomp($line);
		$line=~s/^\s+//;
		if ($line =~ /^require\s+plus\s+(.*)/i) {
			@plus=split(/\s+/,$1);
		}
	}
	close(IN);
} else {
	foreach my $key (@{$plus}) {
		if ($key eq '') { next; }
		push (@plus, $key);
	}
}

# 除外ユーザ条件が指定されていない場合は、except 行は書き換えない
# 既存の設定を解除する場合は空の配列ポインタを $except に渡す
if (!$except) {
	DA::System::file_open(\*IN,"$dir/.htaccess");
	while (my $line=<IN>) {
		chomp($line);
		$line=~s/^\s+//;
		if ($line =~ /^require\s+except\s+(.*)/i) {
			@except=split(/\s+/,$1);
		}
	}
	close(IN);
} else {
	foreach my $key (@{$except}) {
		if ($key eq '') { next; }
		push (@except, $key);
	}
}

while (my @line = splice (@groups, 0, 100)) {
	if (@line + 0) {
		$groups_line .= "require group " . join (" ", @line) . "\n";
	}
}
while (my @line = splice (@users, 0, 100)) {
	if (@line + 0) {
		$users_line	.= "require user " . join (" ", @line) . "\n";
	}
}
while (my @line = splice (@necessary, 0, 100)) {
	if (@line + 0) {
		$necessary_line	.= "require necessary " . join (" ", @line) . "\n";
	}
}
while (my @line = splice (@plus, 0, 100)) {
	if (@line + 0) {
		$plus_line	.= "require plus " . join (" ", @line) . "\n";
	}
}
while (my @line = splice (@except, 0, 100)) {
	if (@line + 0) {
		$except_line	.= "require except " . join (" ", @line) . "\n";
	}
}
$groups_line =~ s/\n+$//;
$users_line  =~ s/\n+$//;
$necessary_line  =~ s/\n+$//;
$plus_line  =~ s/\n+$//;
$except_line  =~ s/\n+$//;
# <--- Change by T.K 2003/08/25

my $auth=<<buf_end;
AuthName INSUITE
AuthType Basic

PerlAuthenHandler DA::Auth::authen
PerlAuthzHandler  DA::Auth::authz

$users_line
$groups_line
$necessary_line
$plus_line
$except_line
buf_end

my $lock=$dir; $lock=~s/\//\-/g;
DA::Session::lock("$lock");
	if ($users_line ne '' || $groups_line ne '' 
		|| $necessary_line ne '' || $plus_line ne '' || $except_line ne '') {
		DA::System::file_open(\*OUT,"> $dir/.htaccess");
		print OUT $auth;
		close(OUT);
	} elsif (-f "$dir/.htaccess") {
		DA::System::file_unlink("$dir/.htaccess");
	}
DA::Session::unlock("$lock");

}

sub get_auth_conf {
my ($dir)=@_;

$dir=~s/\/$//;
if ($dir eq '') { return; }

my (@user);
DA::System::file_open(\*IN,"$dir/.htaccess");
while (my $line=<IN>) {
	chomp($line);
	$line=~s/^\s+//;
	if ($line=~/^require\s+(user|group|necessary|except)\s+(.*)/i) {
		my (@list)=split(/\s+/,$2);
		foreach my $id (@list) {
			push (@user, $id);
		}
	}
}
close(IN);
return (\@user);

}

sub is_up_member {
	# $mid が $group の下位組織に所属しているかどうかを判別
	# ($mid から見た上位組織群に $group が含まれるかどうか)
	# 0=所属していない, 1=所属している
	my ($session,$mid,$group,$join)=@_;
	$group=~s/\,/\|/g;
	if ($mid=~/^($group)$/) { return (1); }
	if (!$join) { $join=DA::IS::get_join_group($session,$mid,1); }
	foreach my $gid (keys %{$join}) {
		if ($join->{$gid}->{attr} !~ /^[12UW]$/) { next; }
		if ($gid=~/^($group)$/) { return (1); }
	}
	return (0);
}

sub get_name_link {
	my ($session,$id,$name,$type)=@_;
	if (!$type || !$name) {
		my($sql,$alpha);
		if ($id >= $DA::Vars::p->{top_gid}){
			$sql="SELECT type,name,alpha FROM @{[DA::IS::get_group_table($session)]} WHERE gid=?";
		} else {
			$sql="SELECT type,name,alpha FROM @{[DA::IS::get_member_table($session)]} WHERE mid=?";
		}
		my $sth=$session->{dbh}->prepare($sql);
		   $sth->bind_param(1,$id,3);
		   $sth->execute();
    	($type,$name,$alpha)=$sth->fetchrow; $sth->finish(); $name=~s/\s+$//;
        $name=DA::IS::check_view_name($session,$name,$alpha);
	}
    my $v_name=DA::IS::get_view_name($session,$type,$name);
	my $table= "<table border=0 cellspacing=0 cellpadding=0><tr>";
	   $table.="<th width=14><img src=$session->{icon_rdir}/$v_name->{icon} ";
	   $table.="width=14 height=14 hspace=2></th><td nowrap>";
    if ($id >= $DA::Vars::p->{top_gid}){
        $table.="<a href=\"javascript:gInfo('$id','$session->{pop_noname}');\">$v_name->{type1}</a>";
    }else{
        $table.="<a href=\"javascript:Info('$id','','$session->{pop_noname}');\">$v_name->{type1}</a>";
    }
    $table.="</td></tr></table>\n";
	return($table);
}

sub get_base_url {
	my ($mode)=@_;
    my $base_url = $DA::Vars::p->{app_session_url};
    return ($base_url);
}

# 修正する場合は get_download_cgi についても見直す事
sub get_download_link {
	my ($session,$path,$name,$temp,$admin,$save,$app,$type)=@_;
	### admin=1 メンテナンスモード回避
	### save =1 ファイル共有への保存

	$path = DA::Valid::check_path($path);

	my $cipher=new Crypt::CBC($session->{sid},'Blowfish');
	my $c_path=$cipher->encrypt($path);
	   $c_path=unpack("H*",$c_path);
	   $c_path=URI::Escape::uri_escape($c_path);
	my $c_name=$cipher->encrypt($name);
	   $c_name=unpack("H*",$c_name);
	   $c_name=URI::Escape::uri_escape($c_name);
	my ($buf);

	if ($session->{download} eq "simple") {
		my $is_html = DA::IS::is_html_target($session, $path, $name);
		if ($app eq 'mailist') {
			# メーリングリスト用処理
			my $p	= $path;
			my $n	= $name;
			if ($DA::Vars::p->{epsml}) {
				$p	=~s/^[\~\.\/]+//g;
				$p	= "$DA::Vars::p->{doc_ml_dir}\/$p";
			} else {
				$p	= "$DA::Vars::p->{doc_ml_dir}\/$p";
			}
			($buf)	= DA::IS::get_download_link2($session, 1, $p, $n, "", 1, $is_html);
		} else {
			($buf)	= DA::IS::get_download_link2($session, 0, $c_path, $c_name, "", 1, $is_html);
		}
	} else {
		$buf	= "<a href=\"javascript:Pop('$DA::Vars::p->{cgi_rdir}/pop_down.cgi?"
				. "path=$c_path%20name=$c_name%20temp=$temp%20admin=$admin%20app=$app"
				. "%20type=$type','pop_title_seldl.gif',400,450)\">"
				. "<img src=$session->{img_rdir}/aqbtn_download.gif "
				. "border=0 width=52 height=15 alt=\"@{[t_('ダウンロード')]}\"></a>";
	}

#=====================================================
#           ----custom----
#=====================================================
DA::Custom::overwrite_download($session,\$buf);

	if ($save) {
		my $module=DA::IS::get_module($session);
		if ($module->{share} eq 'on') {
			$buf.="<a href=\"javascript:Pop('$DA::Vars::p->{cgi_rdir}/"
			."ow_folder_select.cgi?path=$c_path%20name=$c_name%20app=$app"
			."%20type=$type','pop_title_attachsave.gif',650,550)\">"
        	."<img src=$session->{img_rdir}/aqbtn_document.gif "
	    	."border=0 width=87 height=15 alt=\"@{[t_('ドキュメントに保存')]}\"></a>";
		} elsif ($module->{library} eq 'on') {
			$buf.="<a href=\"javascript:Pop('$DA::Vars::p->{cgi_rdir}/"
			."lib_foldersel.cgi?path=$c_path%20name=$c_name%20app=$app"
			."%20type=$type','pop_title_attachsave.gif',650,550)\">"
        	."<img src=$session->{img_rdir}/aqbtn_document.gif "
	    	."border=0 width=87 height=15 alt=\"@{[t_('ドキュメントに保存')]}\"></a>";
		}
	}

	return ($buf);
}

# 修正する場合は get_download_link についても見直す事
# ライブラリ、ファイル共有、ワークフローなど用
sub get_download_cgi {
	my ($session, $cgi, $param, $app, $mode, $object, $icon)=@_;
	my $gif	= ($icon) ? "aqbtn_downloadi.gif width=17 height=15"
						: "aqbtn_download.gif width=52 height=15";
	my ($buf);

	if ($session->{download} eq "simple") {
		if ($mode eq "file") {
			if ($app eq "admin") {
				my $date	= $param->{date};
				my ($num, $yy, $hh) = split(/\./, $date);
				my $pathname= "$DA::Vars::p->{log_dir}/datalink/task_log\.$num\.$yy";
				my $filename= t_("CSV-IMPORT-LOG") . "-$yy-$hh\.txt";
				my $is_html = DA::IS::is_html_target($session, $pathname, $filename);
				($buf)		= DA::IS::get_download_link2($session, 1, $pathname, $filename, $icon, 1, $is_html);
			} if ($app eq "library") {
				my $folder	= $object->{folder};
				my $file	= $object->{file};
				my $docno	= $param->{docno};
				my $bid		= $param->{bid};
				my $hid		= ($param->{hid}) ? $param->{hid} : $file->{hid};
				my $gid		= $folder->{gid};
				my $route	= {};
				   $route	= DA::Lib::get_path($session, $bid, $route);

				my $info	= DA::Lib::get_file_info($session, $docno, $bid, $hid);
				my $ext		= $info->{ext};
				my $filename= DA::CGIdef::decode($file->{title},0,1);
				if($filename !~ /\Q.$ext\E$/ ){
					$filename .=".".$ext;
				}
				$filename  =~s/\t/ /og;
				my $pathname= "$DA::Vars::p->{lib_dir}/$gid/$route->{url}/"
							. "$docno/$hid\.$ext";
				my $is_html = DA::IS::is_html_target($session, $pathname, $filename);
				($buf)		= DA::IS::get_download_link2($session, 1, $pathname, $filename, $icon, 1, $is_html);
			} elsif ($app eq "share") {
				my $folder	= $object->{folder};
				my $file	= $object->{file};
				my $bid		= $param->{bid};
				my $fid		= $param->{fid};
				my $hid		= $file->{hid};

				my $info	= DA::Share::get_file_info($session, $bid, $fid, $hid);
				my $filename= $info->{filename};
				my $pathname= $info->{pathname};
				my $is_html = DA::IS::is_html_target($session, $pathname, $filename);
				($buf)		= DA::IS::get_download_link2($session, 1, $pathname, $filename, $icon, 1, $is_html);
			} elsif ($app eq "workflow") {
				my $tid		= $param->{tid};
				my $info	= DA::IS::get_workflow_temp_info($session,$tid);
				my $filename= $info->{filename};
				my $pathname= $info->{pathname};
				my $is_html = DA::IS::is_html_target($session, $pathname, $filename);
				($buf)		= DA::IS::get_download_link2($session, 1, $pathname, $filename, $icon, 1, $is_html);
			}
		} elsif ($mode eq "folder") {
			my (@param);
			my $url		= $cgi;
			my $target	= ($session->{download_target} eq "") ?
							" target=_blank" : " target=$session->{download_target}";
			foreach my $key (sort keys %{$param}) {
				push (@param, "$key=$param->{$key}");
			}
			if (scalar(@param)) {
				$url .= "\%3f" . join ("\%20", @param);
			}

			$buf	= "<a href=\"$DA::Vars::p->{cgi_rdir}/$url\"$target>"
					. "<img src=$session->{img_rdir}/$gif border=0 "
					. "alt=\"@{[t_('ダウンロード')]}\"></a>";
		}
	} else {
		my (@param);
		my $url	= $cgi;
		foreach my $key (sort keys %{$param}) {
			push (@param, "$key=$param->{$key}");
		}
		if (scalar(@param)) {
			$url .= "\%3f" . join ("\%20", @param);
		}

		$buf	= "<a href=\"javascript:Pop('$DA::Vars::p->{cgi_rdir}/$url',"
				. "'pop_title_seldl.gif',400,450)\">"
				. "<img src=$session->{img_rdir}/$gif border=0 "
				. "alt=\"@{[t_('ダウンロード')]}\"></a>";
	}

    return ($buf);
}

sub get_download_link2 {
	my ($session,$crypt,$path,$name,$icon,$simple,$is_html)=@_;
	my ($c_path,$c_name,$size,$target);
	my $gif 	= ($icon) ? "aqbtn_downloadi.gif width=17 height=15"
						: "aqbtn_download.gif width=52 height=15";

	if ($simple) {
		if ($is_html) {
			$target = " target=_blank";
		} else {
			$target	= ($session->{download_target} eq "") ?
					  " target=_self" : " target=$session->{download_target}";
		}
	} else {
		$target	= " target=_top";
	}
	if ($crypt) {
		my $cipher=new Crypt::CBC($session->{sid},'Blowfish');
		$path = DA::Valid::check_path($path);
		$c_path=$cipher->encrypt($path);
	   	$c_path=unpack("H*",$c_path);
	    $c_path=URI::Escape::uri_escape($c_path);
		$c_name=$cipher->encrypt($name);
	    $c_name=unpack("H*",$c_name);
	    $c_name=URI::Escape::uri_escape($c_name);
		$size= -s $path;
		if (!$simple) {
			unless (-f $path) {	
				DA::CGIdef::errorpage($session,
				t_("該当するファイルが存在しないか指定されたページは公開期間外です。"),
				'popup',t_("ファイルが見つかりません"));
			}
		}
	} else {
		$c_path=$path;
		$c_name=$name;
		my $cipher=new Crypt::CBC($session->{sid},'Blowfish');
		my $pathname=pack("H*",$path);
		   $pathname=DA::Valid::check_path($cipher->decrypt($pathname));
		$size= -s $pathname;
		if (!$simple) {
			unless (-f $pathname) {
				DA::CGIdef::errorpage($session,
				t_("該当するファイルが存在しないか指定されたページは公開期間外です。"),
				'popup',t_("ファイルが見つかりません"));
			}
		}
	}

	my $buf="<a href=\"$DA::Vars::p->{cgi_rdir}/download.cgi?"
	   . "path=$c_path&name=$c_name\"$target>"
	   . "<img src=$session->{img_rdir}/$gif border=0 "
	   . "alt=\"@{[t_('ダウンロード')]}\"></a>";

	return ($buf,$size,$c_path,$c_name);
}

sub get_download_head {
	my ($filename)=@_;
    my $org_filename=$filename;
	my $head;
	if (!$ENV{'HTTP_USER_AGENT'} || $filename eq '') {
    	# ブラウザ依存 : IE では、ほとんどの場合こちらが安全？
    	$head="Content-type: insuite/download;\n\n";
	} else {
        my $sjis = DA::Unicode::convert_to($filename, "Shift_JIS");
        my $conv = DA::Unicode::convert_from($sjis, "Shift_JIS");
		my $cutfunc = sub {
			my ($filename, $charset, $len, $escape) = @_;
			my ($file, $ext) = DA::CGIdef::get_filename($filename, 2);

			my $len_max = $len - length($ext) - 1;
			if ($len_max <= 4) {
				$filename = "download\.$ext";
			} else {
				my ($name) = split (/\./, $file, 2);
				if ($len_max < length($name)) {
					$file = DA::Charset::sub_str($name, $charset, 0, $len_max);
					$filename = $file.'.'.$ext;
				}
				if ($escape) {
					$filename = URI::Escape::uri_escape($filename);
				}
			}

			return($filename);
		};

		my $ff_jp;
		if ($org_filename eq $conv) {
			# ファイル名が日本語のみの場合は、Shift_JIS で出力
			$filename = $sjis;

			my $user_agent = DA::CGIdef::get_user_agent($ENV{'HTTP_USER_AGENT'});
			if ($user_agent->{browser} =~ /Mozilla/i || $user_agent->{browser} =~ /Chrome/i) {
				# Windows XP & Firefox 3.6.13 ( Max 360 )
				$filename = $cutfunc->($filename, "Shift_JIS", 255);
				$ff_jp = 1;
			}
		} else {
			# ファイル名に日本語以外を含む場合

        if ($ENV{'HTTP_USER_AGENT'} =~ /MSIE 7\./) {
			# IE7 の場合は UTF-8 でファイル名を出力
            $filename=DA::Charset::convert(\$filename,
                DA::Unicode::internal_charset(),'UTF-8');
            #####IE7ファイル名の切捨ての挙動不正を避ける#####
            my ($max_len, $name, $ext, $escaped_name);
            if ($filename =~ /(.*)(\..*$)/) {
                $name = $1;  
                $ext = $2;
            } else {
				$name = $filename;
			}

            my $escaped_ext = URI::Escape::uri_escape($ext);
            while (length($escaped_ext) > 30) {
            	$ext = DA::Charset::sub_chars($ext, 'UTF-8', DA::Charset::num_of_chars($ext, 'UTF-8') - 1);
            	$escaped_ext = URI::Escape::uri_escape($ext);
            }
            $max_len = 103 - length($ext);
            $escaped_name = URI::Escape::uri_escape($name);
            while (length($escaped_name) > $max_len) {
            	$name = DA::Charset::sub_chars($name, 'UTF-8', DA::Charset::num_of_chars($name, 'UTF-8') - 1);
            	$escaped_name = URI::Escape::uri_escape($name);
            }
            $filename = $name . $ext;
            $filename = URI::Escape::uri_escape($filename);
            #####IE7ファイル名の切捨ての挙動不正を避ける#####
        } elsif (DA::Unicode::external_charset() eq "UTF-8") {
            DA::Unicode::convert_to(\$filename,DA::Unicode::external_charset());
			if (index($ENV{'HTTP_USER_AGENT'}, "Gecko") >= 0) {
				# UTF-8のまま出力 (URIエスケープする)
			} elsif (index($ENV{'HTTP_USER_AGENT'}, "MSIE") >= 0) {
				# 日本語のみに変更
				$filename = DA::Unicode::local_charset($filename, "UTF-8");
				# http://support.microsoft.com/kb/816868
				# http://support.microsoft.com/default.aspx?scid=kb;ja;436616
				# UTF-8 でURIエスケープ
				$filename = $cutfunc->($filename, "UTF-8", 35, 1);
			}
		} else {
            DA::Unicode::convert_to(\$filename,DA::Unicode::external_charset());
		}

		}

    	$head ="Content-type: application/octet-stream;\n";
		if ( $ff_jp ) {
			$filename=encode_base64($filename);
			$filename=~s/\n//g;
			$head.="Content-Disposition: attachment; filename=\"=?Shift_JIS?B?$filename?=\"\n";
		} else {
			$head.="Content-Disposition: attachment; filename=\"$filename\"\n";
		}
    	$head.="Content-Transfer-Encoding: binary\n";
	   	$head.="\n";
	}
    #=================================
    #        Custom
    #=================================
    DA::Custom::download_head($org_filename, \$head, {});

	return ($head);
}

sub get_encode_link {
	my ($session, $path, $rpath, $attachment, $app, $type)	= @_;
	my ($ml, $seq, $app2);

	$path = DA::Valid::check_path($path);

	my $tpath	= $path;
	if ($app eq 'mailist') {
		$tpath	=~s/\Q$DA::Vars::p->{doc_ml_dir}\/\E//;
		$ml		= $1 if ($tpath =~ /^([^\/]+)\//);
		$seq	= $1 if ($tpath =~ /(\d+)\_\d+[^\/]+$/);
		$app2	= 'ml';
	} elsif ($app eq 'mailist2') {
		$tpath	=~s/\Q$DA::Vars::p->{doc_ml_dir}\/\E//;
		$app2	= 'ml';
	} else {
		$tpath	=~s/\Q$DA::Vars::p->{user_dir}\/$session->{user}\/temp\/\E//;
		$app2	= $app;
	}

	my $encode	= $attachment->{$app2 . '_encode'};
	my $redirect= $attachment->{$app2 . '_redirect'};
	my $download= $attachment->{$app2 . '_download'};
	my $salt	= (!$session) ? 'INSUITE' : $session->{sid};
	my $target  = "_blank";
	my ($link, $mode);
	if ($download =~ /^on$/i) {
		$mode	= 2;
	} elsif ($redirect =~ /^on$/i && $DA::Vars::p->{download_url}) {
		my ($new_path, $new_rpath);
		my ($file, $ext)= DA::CGIdef::get_filename($path, 2);
		my $c_file	= DA::System::compatible_crypt($file, '$apr1$' . $salt);
		   $c_file	= unpack("H*", $c_file) . "\.$ext";

		if ($app eq 'mailist') {
			my $dl_path	= "$DA::Vars::p->{download_dir}/ml/$ml";
			my $dl_rpath= "$DA::Vars::p->{download_url}/ml/$ml";

			if (!-d $dl_path){
				DA::System::file_mkdir ($dl_path, 0750);
        		my $res=DA::System::file_chown(
            		$DA::Vars::p->{www_user},
            		$DA::Vars::p->{www_group},
            		( $dl_path )
        		);
			}
			$new_path	= $dl_path . '/' . $seq . '-' . $c_file;
			$new_rpath	= $dl_rpath . '/' . $seq . '-' . $c_file;
		} else {
			$new_path	= "$DA::Vars::p->{download_dir}/user/"
						. "$session->{user}\-" . $c_file;
			$new_rpath	= "$DA::Vars::p->{download_url}/user/"
						. "$session->{user}\-" . $c_file;
		}
		DA::System::cmd("cp %1 %2", $path, $new_path);

		$path	= $new_path;
		$rpath	= $new_rpath;
		$mode	= 0;
	} elsif ($encode !~ /^off$/i) {
		my $wpath	= $path;
		   $wpath	=~s/\.([^\.\/]+)$/\.\Q$1\E/;
		my $filecmd	= DA::System::bq_cmd("file %1", $wpath);
		   $filecmd	=~s/^\Q$path\E\:\s*//;
		my $html	= ($filecmd =~ /html/i || $type =~ /html/i) ? 1 : 0;

		if ($html) {
			my $cipher	= new Crypt::CBC($salt, 'Blowfish');
			my $c_path	= $cipher->encrypt($tpath);
			   $c_path	= unpack("H*", $c_path);
			   $c_path	= URI::Escape::uri_escape($c_path);
			my $alert;

			if (DA::Ajax::mailer_ok($session) && $app =~ /^(mailist|mailist2|ml)$/) {
				$alert = "";
			} else {
				$alert = &get_alert_tag($attachment, $app, 1);
			}

			$link	= "<a href=\"$DA::Vars::p->{cgi_rdir}/html_encode.cgi?"
					. "path=$c_path&app=$app&ml=$ml&seq=$seq\""
					. " target=_blank$alert>";
		} else {
			$mode	= 0;
			$rpath	= &get_download_url($session, $rpath);
			$target = &get_download_target($session, $rpath, undef, $target);
		}
	} else {
		$mode	= 0;
		$rpath	= &get_download_url($session, $rpath);
		$target = &get_download_target($session, $rpath, undef, $target);
	}
	if (!$link) {
		if ($rpath =~ /^javascript/i) {
			$target = "";
		}
		if ($target) {
			$target = " target=\"$target\"";
		}
		my $alert	= &get_alert_tag($attachment, $app, $mode);
		   $link	= "<a href=\"$rpath\"$target$alert>";
	}
	
	return ($link);
}

sub get_object_link {
	my ($session,$path,$name,$mode,$attachment,$app,$type)=@_;
	# $mode=1 の場合は、一時ファイルを暗号化した上で apimages 内に作成する。
	# $mode=0 の場合は、一時ファイルをユーザ認証ディレクトリ内に作成する。
	# $name = DA::Charset::convert_to(\$name,'EUC-JP');

	$path = DA::Valid::check_path($path);

    my ($file,$ext)=DA::CGIdef::get_filename($path,2);
	my ($c_path,$r_path,$c_file,$buf);
	if ($mode eq 1) {
    	$c_file = DA::CGIdef::get_encrypt_name($session) . "\.$ext";
    	$c_path="$DA::Vars::p->{apimg_dir}/$c_file";
    	$r_path="$DA::Vars::p->{apimg_rdir}/$c_file";
	} else {
		$c_file=$file;
    	$c_path="$DA::Vars::p->{user_dir}/$session->{user}/temp/$file";
    	$r_path="$DA::Vars::p->{user_rdir}/$session->{user}/temp/$file";
	}
	if ($path ne $c_path && $DA::Vars::p->{direct_link} ne 'off') {
		DA::System::file_copy("$path","$c_path");
		DA::OperationLog::copy($session, $path, $r_path);
	}
	if ($app =~ /^(mail|mailist|mailist2)$/) {
		$buf=&get_encode_link($session,$c_path,$r_path,$attachment,$app,$type);
	} else {
		my $encode_ext=DA::CGIdef::uri_escape($ext);
		$buf="<a href=\"@{[&get_download_url($session, $r_path, $name)]}\" target=\"@{[&get_download_target($session, $r_path, $name, '_blank')]}\">";
	}
	$name = DA::CGIdef::encode($name,1,1,'euc');
	$buf .= $name . "</a>";

	return ($buf,$c_file);
}

sub get_download_url {
	my ($session, $rpath, $fname, $noauth) = @_;
	
	# iPhoneからのファイルダウンロードに対応
	if ($DA::Vars::p->{direct_link} eq "off" && !$session->{mobile}) {
		$PREV_PARAM = {
			"path" => $rpath,
			"filename" => $fname
		};

		my $path = $rpath;
		   $path =~s/^\/+//g;
		   $path = DA::Valid::check_path("$DA::Vars::p->{base_dir}/insuite/$path");

		if ($fname eq "") {
			$fname = (split(/\//, $rpath))[-1];
		} else {
			$fname = DA::CGIdef::decode($fname,0,1);
            $fname  =~s/\t/ /og;
		}

		my $temp = "$DA::Vars::p->{base_dir}/insuite/user/$session->{user}/temp";
		my $url;
		if ($path =~ /^\Q$temp\E\/([^\/]+)$/) {
			my $file = unpack("H*", DA::Valid::check_path($1));
			   $file = URI::Escape::uri_escape($file);
			my $name = unpack("H*", $fname);
			   $name = URI::Escape::uri_escape($name);
			$url = "$DA::Vars::p->{cgi_rdir}/download.cgi?"
			     . "path=$file&name=$name&mode=temp";
		} elsif($noauth){
               $path = unpack("H*", $path);
               $path = URI::Escape::uri_escape($path);
            my $name = unpack("H*", $fname);
               $name = URI::Escape::uri_escape($name);
            $url = "$DA::Vars::p->{cgi_rdir}/download.cgi?"
                 . "path=$path&name=$name&noauth=1";

        } else {
			my $cipher = new Crypt::CBC($session->{sid}, 'Blowfish');
			my $c_path = $cipher->encrypt(DA::Valid::check_path($path));
			   $c_path = unpack("H*", $c_path);
			   $c_path = URI::Escape::uri_escape($c_path);
			my $c_name = $cipher->encrypt($fname);
			   $c_name = unpack("H*", $c_name);
			   $c_name = URI::Escape::uri_escape($c_name);
			$url = "$DA::Vars::p->{cgi_rdir}/download.cgi?"
			     . "path=$c_path&name=$c_name";
		}

		return($url);
	} else {
		$PREV_PARAM = {};

		return($rpath);
	}
}

sub get_download_target {
	my ($session, $rpath, $fname, $target) = @_;
	my $prev_path = $PREV_PARAM->{path};
	my $prev_filename = $PREV_PARAM->{filename};
	$PREV_PARAM = {};

	if ($session) {
		my $url = &get_download_url($session, $rpath, $fname);

		if (DA::IS::is_html_target($session, $rpath, $fname)) {
			return($target);
		} elsif ($url eq $rpath) {
			return($target);
		} else {
			return("");
		}
	} else {
		if (DA::IS::is_html_target($session, $prev_path, $prev_filename)) {
			return($target);
		} elsif ($prev_path) {
			return("");
		} else {
			return($target);
		}
	}
}

sub get_download_target_p {
	my ($target) = @_;

	return(&get_download_target(undef, undef, undef, $target));
}

sub get_download_atag {
	my ($session, $rpath, $fname, $target, $linktag) = @_;

	my $tag =<<end_tag;
<a href="@{[DA::IS::get_download_url($session, $rpath, $fname)]}" target="@{[DA::IS::get_download_target($session, $rpath, $fname, $target)]}">@{[($linktag) ? $linktag : enc_($fname)]}</a>
end_tag

	return($tag);
}

sub html_script {
	my ($session, $path, $filename) = @_;
	my $file = DA::System::bq_cmd("/usr/bin/file -b %1", $path);

	unless ($filename) {
		$filename = $path;
	}

	if ($DA::Vars::p->{html_script} eq "off" && $file =~ /\s+text/) {
		return(1);
	} else {
		return(0);
	}
}

sub upload_script {
    my ($session, $path, $filename, $ext) = @_;

    unless ($filename) {
        $filename = $path;
    }   

	if ( $DA::Vars::p->{upload_script} eq "off" ){
        
		my $file = DA::System::bq_cmd("/usr/bin/file -b %1", $path);
		$file =~ s/(^\s+|\s+$)//;
		return (1) if( $file =~ /(?:\s+text|^data$)/ );

    }else{
   	
	    if( $DA::Vars::p->{upload_script_except} ){
	    
            my @ext = map{ my $t=$_; $t =~ s/^\s*|\s*$//g; $t } split( /,/, $DA::Vars::p->{upload_script_except} );
			$ext =~s/^\s*|\s*$//g;
			if( 0 < scalar(@ext) && (grep(/^\Q$ext\E$/,@ext))){
	            return(1);
			}
		}
	}
    
	return(0);
    
}

sub is_html_target {
	my ($session, $path, $filename) = @_;

	unless ($filename) {
		$filename = $path;
	}

	if ($filename =~ /\.(?:html|htm|shtml|shtm)$/i) {
		return(1);
	} else {
		return(0);
	}
}

sub get_download_menu {
	my ($session,$down_button,$link_button,$size,$admin,$not_popup)=@_;
	my $attachment = DA::IS::get_sys_custom($session, "attachment", 1);

	###admin=1 #メンテナンスモード回避
	if ($size) { 
		$size=t_("ファイルサイズ").": ". DA::CGIdef::int_format($size)
             .t_("バイト"); 
	}

	my ($head,$body)=DA::IS::get_head($session,"Download",'popup','',$admin);
	my $script=DA::IS::get_alertAttachment_script($session, 1);
	my $outbuf="$head\n$script\n</head>";

	# テンプレートのカスタマイズ対応
	my $tmpl = DA::Unicode::html_template(
		filename => "download_menu.tmpl",
        die_on_bad_params => 0,
		cache  => 1
	);
	$tmpl->param(
		$session->{user_lang} => 1,
		NOT_POPUP	=> $not_popup,
		SIZE		=> $size,
		BASE_COLOR	=> $DA::Vars::p->{base_color},
		TITLE_COLOR	=> $DA::Vars::p->{title_color},
		DOWN_BUTTON	=> $down_button,
		LINK_BUTTON	=> $link_button,
        TITLE1      => t_('通常のダウンロード'),
        TITLE2      => ($DA::Vars::p->{direct_link} eq "off") ? "" : t_('右クリックによるダウンロード'),
        BTN1        => t_('閉じる'),
        MSG1        => t_('ファイルのダウンロード方法を選択します。'),
        MSG2        => t_('通常のダウンロードにはダウンロードボタンを使用します。'),
        MSG3        => ($DA::Vars::p->{direct_link} eq "off") ? t_('ダウンロードボタンをクリックすると「ファイルのダウンロード」ウィンドウが開き、ダウンロードが実行されます。') : t_('ダウンロードボタンをクリックすると「ファイルのダウンロード」ウィンドウが開き、ダウンロードが実行されます。ブラウザのバージョンによっては、正常にダウンロードできない場合があります。その場合は「右クリックによるダウンロード」を実行してください。'),
        MSG4        => t_('マウスの右ボタンをクリックして「対象をファイルに保存(A)」を選択すると、ファイルのダウンロードが実行されます。ダウンロードしたファイルのファイル名には、英数字と拡張子の組み合わせが適用されます。'),
        MSG5        => "<font color=red>".t_('ファイル拡張子がない場合、ご使用のブラウザによってはダウンロード時に拡張子が自動的に付与されることがあります。')."</font>"
	);
	$outbuf.=$tmpl->output;

	return ($outbuf);
}

# $params: 拡張パラメータ
#   ->{jslib} = prototype
#   ->{css}   = css
#   ->{body_attr}  // body タグに付加する属性
sub get_head {
    my ($session,$title,$mode,$cache,$no_mainte,$file,$code,$meta,$params)=@_;
	# ---------------------------------------------------------------------
	# ▽ $fileを指定した場合はHTML::Templateのオブジェクトを返す
	#    $file: テンプレートファイル名
	# --------------------------------------------------------------------- 
	# ▽ 中・韓対応のため、$code オプション追加
	#    $code = UTF-8 -> Charset を UTF-8 にする。
	# ---------------------------------------------------------------------
    my ($head,$body,$mainte_script);
	# Use of uninitialized value エラーを無視する
	$^W = 0;

    if($no_mainte ne '9' &&
       DA::Session::check_maintenance($session,'head',$no_mainte)){
$mainte_script=<<end_tag;
    if (top.document.title == 'INSUITE POPUP') {
        if(!win_closed(top.opener.m_win)){ top.opener.m_win.close();}
    }
    var m_win=window.open('$DA::Vars::p->{cgi_rdir}/pop_up.cgi?proc=mainte_message.cgi&title=pop_title_alertforcelogout.gif','meinte_message','width=350,height=400,resizable=1,scrollbars=1');//m_win.focus();
end_tag
    }

	# INSUITE のバージョンチェック
    my $err=DA::Session::version_check($session);
    if ($err) { DA::CGIdef::errorpage($session,$err); }

    if (!$mode) { $mode='normal'; }
    if (!$cache) { $cache='normal'; }
	if ($meta) {
		$meta	=~ s/\n+$//g;
		$meta	.= "\n";
	}
    my ($nocache_head,$nocache_foot)=DA::IS::get_meta_tag($cache,$code);

	# head_utf.tmpl 廃止
	my $dtmpl = 'head.tmpl';
	my $tmpl = HTML::Template->new(
		filename => ($file) ? $file : "$DA::Vars::p->{tmpl_dir}/$dtmpl",
		die_on_bad_params => 0,
		cache  => 1
	);
	my ($char_style_rdir);
	if (DA::IS::is_iframe() && $code eq 'UTF-8') {
		if (DA::Unicode::external_charset() eq "UTF-8") {
			$char_style_rdir = $session->{char_style_rdir};
		} else {
			$char_style_rdir = $session->{char_style_rdir} . '/UTF-8';
		}
	} else {
		$char_style_rdir = $session->{char_style_rdir};
	}
	my $js_library;
	foreach my $js (split(/\|/, $params->{jslib})) {
		my $src;
		if ($js eq "prototype" ) {
			$src = DA::IS::get_jslib_rpath($js);
		}elsif ( $js=~/\./ ) {
			my($arg1,$arg2 ) = split(/\./,$js);
			$src = DA::IS::get_jslib_rpath($arg1,$arg2);
			#warn "$arg1,$arg2,$src";
		}
		$js_library .= "<script src=\"" . enc_($src) . "\"></script>\n";
	}
	foreach my $css (split(/\|/, $params->{css})) {
		my $src;
		if ($css eq "style" || $css eq "admin") {
			$src = DA::IS::get_css_rpath($css);
		}elsif ($css =~ /\./) {
			my($arg1, $arg2) = split(/\./, $css);
			$src = DA::IS::get_css_rpath($arg1, $arg2);
		}
		$js_library .= "<link rel=\"stylesheet\" type=\"text/css\" href=\"" . enc_($src) . "\">\n";
	}

	if ($params && $params->{jslib}) {
		my $chk_key = DA::IS::get_check_key_param('&');
		my $jslib =<<EOF;
<script>
window.userConfig = {
	imgRdir:  '$session->{img_rdir}',
	iconRdir: '$session->{icon_rdir}',
	iconExt:  '$session->{icon_ext}',
	cgiRdir:  '$DA::Vars::p->{cgi_rdir}',
	check_key_url: '$chk_key'
};
</script>
EOF
		$js_library = $jslib.$js_library;
	}

	# style.css add
	my $css_flg = 0;
	if ($title =~ /(?:sc_regist|fa_regist|lib_folder_list|lib_file_detail|lib_com_detail|lib_text_detail|lib_folder_detail|lib_file_list|lib_normal_list|conf_owner_call_preview_link|ow_folder_list|ow_file_list|ns_check_list|ns_folder_list|ns_form_list|ns_form_anslist|ns_form_answer|ns_view_label|wf_route_conf|cc_route_conf|wf_route_group|wf_route_branch|wf_route_phase|wf_form_select|org_mail_admin|sm_file_list|wf_list|cc_list|cc_form_select|wf_history_list|cc_history_list|wf_form_list|wf_title|cc_title|wf_temp|todo_list)/g ) {
		$css_flg = 1;
	}	

	my $custom_head = DA::Custom::get_head_custom_head($session,$title,$mode,$cache,$no_mainte,$file,$code,$meta,$params);
	$tmpl->param(
		NOCACHE_HEAD => $nocache_head . $meta,
		TITLE => $title,
		STYLE => $css_flg,
		STYLE_RDIR => $DA::Vars::p->{css_rdir},
		CGI_RDIR => $DA::Vars::p->{cgi_rdir},
		JS_RDIR  => $DA::Vars::p->{js_rdir},
		MAINTE_SCRIPT => $mainte_script,
		IME_INIT => ($session->{ime_init})?$session->{ime_init}:'auto',
		IMG_RDIR => $session->{img_rdir},
		IMG_JAVA => $session->{img_java},
		CHAR_STYLE_RDIR => $char_style_rdir,
		CHAR_STYLE => $session->{char_style},
		FIREBUG	=> $DA::Vars::p->{FIREBUG},
		URI_PREFIX => DA::IS::get_uri_prefix("txtstyle"),
		CHK_KEY    => DA::IS::get_check_key_param('&'),
		JS_LIBRARY => $js_library,
		CUSTOM_HEAD=> $custom_head
	);

	unless ($file) {

		# DA::IS::print_data()を使用するため、Content-type: text/html は
		# 返さないようにする。

		$head=$tmpl->output;
    	$body="<body bgcolor=#FFFFFF ";
	    if ($mode eq 'top') {
    	    $body.="topmargin=10 marginheight=10 leftmargin=30 marginwidth=30 $params->{body_attr}>";
 	   	} elsif ($mode eq 'popup' || $mode eq 'pop') {
    	    $body.="topmargin=5 marginheight=5 leftmargin=10 marginwidth=10 $params->{body_attr}>";
	    } else {
	    	if ($session->{ua_browser} =~ /Chrome/i) {
	    		$body.="style=\"margin-left:15px;margin-right:15px;\" topmargin=5 marginheight=5 $params->{body_attr}>";
	    	} else {
	    		$body.="topmargin=5 marginheight=5 leftmargin=15 marginwidth=15 $params->{body_attr}>";
	    	}
    	}
    	return ($head,$body,$nocache_foot);
	} else {
		return ($tmpl,$nocache_foot);
	}
}

sub get_meta_tag{
    my($cache,$code)=@_;
    my($nocache_head,$nocache_foot);
    my $charset = $code || 'x-sjis';
    # 中・韓対応のため、$code オプション追加
    # $code = UTF-8 → charset を UTF-8 にする

my $nocache=<<end_tag;
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<meta http-equiv="Cache-Control" content="no-cache">
end_tag

my $meta=<<end_tag;
<meta http-equiv="Content-Type" content="text/html; charset=$charset">
<meta http-equiv="Content-Script-Type" content="text/javascript">
<meta http-equiv="Content-Style-Type" content="text/css">
end_tag

    if($ENV{'HTTP_USER_AGENT'} =~ /MSIE/){
        $nocache_head = $meta;
        if ($cache eq 'no'){
            $nocache_head .= $nocache;
            if($ENV{'HTTP_USER_AGENT'} =~ /MSIE.+5\.01.+Windows.+NT/){
                $nocache_foot="<HEAD><META HTTP-EQUIV=\"PRAGMA\" "
				 . "CONTENT=\"NO-CACHE\"></HEAD>";
            }
        }
    }else{
        $nocache_head = $meta;
        if ($cache eq 'no') { $nocache_head.= $nocache; }
    }

    return($nocache_head,$nocache_foot);
}

sub get_head4ajx {
	my ($session,$call) = @_;
	if($call ne 'ns_board' ){
		if (!DA::Ajax::user_search_ok($session) && !DA::Ajax::date_selector_ok($session) && !DA::Ajax::time_slider_ok($session)) {
			return undef;
		}
	}
	my $agent = DA::CGIdef::get_user_agent($ENV{'HTTP_USER_AGENT'});
	my $prefx = DA::IS::get_uri_prefix();
	my $chk_key = DA::IS::get_check_key_param('&');
	my $css = ($agent->{browser} eq "InternetExplorer" && int($agent->{browser_v}) >= 7 && $agent->{engine} eq "Trident" && int($agent->{engine_v}) >= 4) ? "all_IE8.css" : "all.css";
	my $head_tag=<<end_tag;
<link rel="stylesheet" type="text/css" href="$DA::Vars::p->{js_rdir}/common/$css?$prefx">
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/common/thirdparty-all.js?$prefx"></script>
<script>
window.userConfig = {
    imgRdir:  '$session->{img_rdir}',
    iconRdir: '$session->{icon_rdir}',
    iconExt:  '$session->{icon_ext}',
    cgiRdir:  '$DA::Vars::p->{cgi_rdir}',
    check_key_url: '$chk_key'
};
</script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/common/all-nodebug-comp.js?$prefx"></script>
end_tag

	return $head_tag;
}

# 透明なマスク相関スクリプトを取る
sub get_wait_script {
	my ($session, $display, $opt) = @_;
	if ($opt eq 'sc' && !DA::Ajax::date_selector_ok($session) 
		&& !DA::Ajax::time_slider_ok($session)) {
		return;
	}
	
	$display = 'none' if ($display);
	my $html =<<end_tag;
<div id="freezeWait"></div>
<STYLE type="text/css"><!--
#freezeWait {
	width: 100%;
	height: 100%;
	position: absolute;
	z-index: 999;
	display: $display;
	background-color: #FFFFFF;
	filter:alpha(opacity=85);
	opacity: 0.85;
	padding-top: 20%;
}
//--></STYLE>
<SCRIPT LANGUAGE="JavaScript"><!--
DA.shim.open(\$('freezeWait'));
//--></SCRIPT>
end_tag
	
	my $dis = $display ? "''" : "'none'";
	my $js =<<end_tag;
\$('freezeWait').style.display=$dis;
DA.shim.close(\$('freezeWait'));
end_tag
	return ($html, $js);
}

sub get_title_navi {
	my ($session,$param,$mode,$bracket) = @_;
	if ($param->{name} && $bracket ne 'off') {
		$param->{name}="[$param->{name}]";
	}

	my $tag;
    for(my $ix=1;$ix<=$param->{tabs};$ix++){
        if($ix == $param->{tab_on}){
            $tag.="<td bgcolor=\"#999999\" nowrap>"
                . $param->{"href$ix"} ."<font color=\"#FFFFFF\">"
                ."&nbsp;&nbsp;" . $param->{"name$ix"} ."&nbsp;&nbsp;"
                ."</font></a></td>";
        }else{
            $tag.="<td nowrap>"
                . $param->{"href$ix"} ."&nbsp;&nbsp;"
                . $param->{"name$ix"} ."&nbsp;&nbsp;</a></td>";
        }
        if($ix == $param->{tab_on} || ($ix+1) == $param->{tab_on}){
            $tag.="<td bgcolor=\"#999999\" nowrap>"
                ."<img src=\"$session->{img_rdir}/func_obi_devider.gif\" width=1 height=19></td>";
        }else{
            $tag.="<td nowrap>"
                ."<img src=\"$session->{img_rdir}/func_obi_devider.gif\" width=1 height=19></td>";
        }
    }
	my ($top_name,$normal_name);
	if ($mode) {
		$top_name=qq{
    		<td nowrap valign="middle"><img src="$session->{img_rdir}/null.gif" width=30 height=1>$param->{name}</td>
		};
	} else {
		my $title;
		if ($param->{title}) {
			$title="<span class=page_title>$param->{title}</span>";
		} else {
			$title="<img src=\"$param->{image}\" border=0 width=246 height=18>";
		}
		$normal_name=qq{
			<tr><td height=24>$title</td><td nowrap align="right">$param->{name}</td></tr>
		};
	}

	my $header=qq{
		<table width="100%" border=0 cellspacing=0 cellpadding=0>
		$normal_name
		<tr bgcolor="#999999">
    	<td colspan=2><img src="$session->{img_rdir}/null.gif" width=1 height=1></td>
		</tr><tr>
		<td colspan=2>
			<table width="100%" border=0 cellspacing=0 cellpadding=0><tr>
			$tag
			$top_name
			<td nowrap><img src="$session->{img_rdir}/null.gif" width=10 height=1>$param->{other}</td>
			<td bgcolor="#E9E9E9" width="100%"><img src="$session->{img_rdir}/func_obi_grad.gif" width=170 height=19></td>
			</tr></table>
		</td>
		</tr><tr>
		<td bgcolor="#999999" colspan=2><img src="$session->{img_rdir}/null.gif" width=1 height=1></td>
		</tr></table>
		<br style="font-size:6px">
	};
	return($header);
}

sub get_opener_check_script{
	my ($session,$title,$reload,$frame,$frame_url)=@_;
	# $title     : opener のウィンドウタイトルを指定
	# $reload    : リロードを実行するスクリプトを指定
	# 	(例) top.opener.location.href='$DA::Vars::p->{cgi_rdir}/login_main.cgi';
	# $frame     : opener 内のframeをリロードする場合はframeの名前を指定
	#	$frame を指定する場合は $reload は指定しない。
	#	指定したフレームが存在しない場合は login_main がリロードされる。
	# $frame_url : opener 内のframeをリロードする場合のURLを指定

	# opener が login_main の場合は、強制的に reload=0 としてリロードさせる。
	# ログイン直後とその他の場合で、reload フラグが異なるため。
	my $close="top.window.close();";
	if ($ENV{'HTTP_USER_AGENT'} =~ /MSIE\s+5.0/) {
		$close="top.document.close();";
	}

	my $check;
	if (ref($title) eq 'ARRAY' && @$title) {
    	$check="if(";
    	foreach my $func(@$title){
        	$check.="top.opener.document.title != '$func' && ";
    	}
    	$check=~s/\&\&\s$//;
    	$check.="){ $close }else{ $reload }\n";
	} elsif ($title) {
    	$check.="if(top.opener.document.title != \"$title\"){ $close }"
          	. "else{ $reload }\n";
	} else {
		$check = $reload
	}

    if ($reload =~ /login_main\.cgi/){
		my $login_main_reload=qq{
			cr_date=top.opener.document.date_form.date.value;
			top.opener.location.href='$DA::Vars::p->{cgi_rdir}/login_main.cgi?date='+cr_date;
		};

		my $frame_reload;
   		if ($frame && $frame_url) {
			$frame_reload=qq{
				if (typeof(top.opener.frames['$frame'])=='object' && top.opener.frames['$frame'].location) {
           			top.opener.frames['$frame'].location.href='$frame_url';
					$close
				}
			};
		}

		$reload=qq{
   			if (top.opener.document.title == 'login_main') {
				$frame_reload
				$login_main_reload
   			}
			$close
		};
	} else {
		$reload=$check;
	}

my $script=<<end_tag;
var opener_closed=function(winVar) {
    var ua = navigator.userAgent;
    var ie = ua.match(/MSIE\\s+[\\d\\.]+/);
    if ( !!winVar ) {
        if ( ( ua.indexOf('Gecko')!=-1 || ua.indexOf(ie)!=-1 )
           && ua.indexOf('Win')!=-1 ) {
            if (ie) {
                try {
                    if (!('' + winVar.location)) {
                        return true;
                    } else {
                        return winVar.closed;
                    }
                } catch(e) {
                    return true;
                }
            } else {
                for (var i in winVar) {
                    if (i.match(/location/)) {
                        if (!('' + winVar[i])) {
                            return true;
                        } else {
                            return winVar.closed;
                        }
                    }
                }
            }
        } else {
            return typeof winVar.document  != 'object';
        }
    } else {
        return true;
    }
}
if (typeof(top.opener) == 'object') {
	if (opener_closed(top.opener)) {
    	$close
	} else {
		$reload
	}
} else {
	$close
}
end_tag

    return $script;
}

sub get_access {
	my ($session,$access_user,$msid)=@_;
	$access_user=~s/^\,//; $access_user=~s/\,$//;
    if ($access_user eq '') { return; }

	# $access_user から無効なIDを除去
	my $check_user;
	foreach my $mid (split(/\,/,$access_user)) {
		if (!$mid || $mid !~ /^\d+$/) { next; }
		$check_user.=($check_user) ? ",$mid" : $mid;
	}
	$access_user=$check_user;
    if ($access_user eq '') { return; }

	my ($group_table,$member_table);
	if ($msid) {
		$group_table  = DA::IS::get_group_table($session,'TBL',$msid);
		$member_table = DA::IS::get_member_table($session,'TBL',$msid);
	} else {
		$group_table  = DA::IS::get_group_table($session);
		$member_table = DA::IS::get_member_table($session);
	}

    my $no = 0;
	my $access={};
	DA::DB::bind_clear();
    my $sql="SELECT gid,name,kana,alpha,type,grade,org_type "
       ."FROM $group_table WHERE gid IN (@{[DA::DB::bind_pushin($access_user,3)]}) "
       ."ORDER BY type,sort_level,grade,upper(kana)";
	my $sth=DA::DB::bind_set($session, $sql);
	   $sth->execute();
	while (my($id,$name,$kana,$alpha,$type,$grade,$org_type)=$sth->fetchrow) {
        $name=DA::IS::check_view_name($session,$name,$alpha);
        my $v_name=DA::IS::get_ug_name($session,0,$id,
				$type,$name,'',$grade,'',$org_type);
        $access->{$id}=sprintf("%06d:$id:$v_name->{usel}",++$no);
	}
	$sth->finish;

	DA::DB::bind_clear();
    $sql="SELECT mid,name,kana,alpha,type,primary_gname,primary_galpha,primary_gtype "
		."FROM $member_table WHERE mid IN (@{[DA::DB::bind_pushin($access_user,3)]}) "
    	."ORDER BY type,sort_level,upper(kana)";
	$sth=DA::DB::bind_set($session, $sql);
	$sth->execute();
	while (my($id,$name,$kana,$alpha,$type,$pname,$palpha,$pgtype)=$sth->fetchrow) {
        $name=DA::IS::check_view_name($session,$name,$alpha);
        $pname=DA::IS::check_view_name($session,$pname,$palpha);
		my $v_name=DA::IS::get_ug_name($session,0,$id,
				$type,$name,$pname,'','',$pgtype);
		$access->{$id}=sprintf("%06d:$id:$v_name->{usel}",++$no);
	}
	$sth->finish;
	DA::DB::bind_clear();

    return ($access);
}

sub get_user_table {
	my ($session,$access,$except)=@_;
	my $access_user;
	my $ix=1;
	foreach my $id (keys %$access) {
		if ($id =~ /^($except)$/) { next; }
    	my ($user,$icon);
    	my ($type,$name)=split(/:/,$access->{$id},2);
    	my $v_name=DA::IS::get_ug_name($session,1,$id,$type,$name);
		if ($v_name->{name} eq '') { next; }
    	$user ="$v_name->{href}$v_name->{name}</a>";
    	$icon ="<th width=16>$v_name->{icon}</th>";
    	if($ix == 1){
        	$access_user.="<tr>$icon<td nowrap width=45%>$user</td>\n";
        	$ix = 2;
    	}else{
        	$access_user.="$icon<td nowrap width=45%>$user</td></tr>\n";
        	$ix = 1;
    	}
	}
	if($ix == 2){
    	$access_user.="<th width=16>&nbsp;</th>"
			."<td nowrap width=45%>&nbsp;</td></tr>\n";
	}

	return ($access_user);
}

sub get_popup_size {
	my ($session)=@_;

	my $conf=DA::IS::get_master($session, 'base');	
    # 共有アドレス
    if ($conf->{popup_addr} eq 20) {
        $conf->{height_addr}=780;
    } elsif ($conf->{popup_addr} eq 15) {
        $conf->{height_addr}=700;
    } else {
        $conf->{height_addr}=575;
    }

	if ($conf->{popup_ma} eq "") {
		$conf->{popup_ma} = 15;
	}
	# メール送信画面
	my $dummy = $DA::MailCommon::Constants::MAIL_VALUE->{POP_NEW_WIDTH_S};
	if (!$conf->{height_ma}) {
		$conf->{height_ma}= ($conf->{popup_ma} eq 25) ?
			$DA::MailCommon::Constants::MAIL_VALUE->{POP_NEW_HEIGHT_B}
		  : $DA::MailCommon::Constants::MAIL_VALUE->{POP_NEW_HEIGHT_S};
	}
	if (!$conf->{width_ma}) {
		$conf->{width_ma} =
			$DA::MailCommon::Constants::MAIL_VALUE->{POP_NEW_WIDTH_S};
	}

	return ($conf);
}

sub init_fav_usersel{
	my ($session,$f_param)=@_;
    my $proc_no = DA::IS::get_seq($session,'fav_usersel');
    my $f_sel = {};
    %{$f_sel->{PARAM}}          = %$f_param;
    $f_sel->{PARAM}->{proc_no}  = $proc_no;
    my $file=$f_param->{proc};
    if($f_param->{f_option}){$file.=$f_param->{f_option};}
    if($f_param->{target}){
        my $parse = DA::IS::get_data_parse($session,$file);
        if (ref($parse->{$f_param->{target}}) eq "HASH") {
            %{$f_sel->{FAV_USER}} = %{$parse->{$f_param->{target}}};
        }
    }else{
		if($f_param->{fnum}){
			my $file = "$session->{sid}\.$f_param->{proc}\.$f_param->{fnum}\.tmp";
			$f_sel->{FAV_USER} = DA::IS::get_sort_temp($session,$file);
		}else{
        my $file = "$session->{sid}\.$f_param->{proc}\.tmp";
        $f_sel->{FAV_USER} = DA::IS::get_sort_temp($session,$file);
    }
	}
    $f_sel->{PARAM}->{all_user}  = $session->{usersel_alluser};
	$f_sel->{PARAM}->{extension} = ($session->{ug_sel_popup} eq "extension") ? 1 : 0;
    DA::IS::set_data_parse($session,$f_sel,$proc_no);
    return $proc_no;
}

sub init_attach_object{
    my ($session,$param)=@_;
    my $proc_no = DA::IS::get_count($session,'attach_object',1);
    my $data = {};
    %{$data->{PARAM}}          = %$param;
    $data->{PARAM}->{proc_no}  = $proc_no;
    DA::IS::set_data_parse($session,$data,$proc_no);
    return $proc_no;
}

sub get_member_info {
	my ($session,$mid,%opt)=@_;
    my $values;

	# $opt{'force_all'}	ログイン不能ユーザのデータも強制表示
	# $opt{'force_master'} = 1; マスタから強制的にデータの取得（is_member_info)
	# $opt{'no_encode'}	= 1;	HTMLエンコード処理を行わない
	# $opt{'msid'}

	my $msid = $opt{'msid'};

    my ($member_table, $info_table);
    if ($opt{'force_master'} eq 1) {
        $member_table	= DA::IS::get_member_table($session, "TBL", $msid);
		$info_table		= DA::IS::get_master_table($session, "is_member_info", $msid);
    } else {
        $member_table	= DA::IS::get_member_table($session, undef, $msid);
		$info_table		= DA::IS::get_lang_view($session, DA::IS::get_user_lang($session), "member_info", $msid);
    }

	my $sql="SELECT * FROM $info_table WHERE mid=?";
	my $sth=$session->{dbh}->prepare($sql); 
	   $sth->bind_param(1,$mid,3); $sth->execute();
    while (my(@list)=$sth->fetchrow) {
        for (my $i=0;$i<@list;$i++) {
            my $name=$sth->{NAME}[$i];
            $name=~tr/[A-Z]/[a-z]/;
            $list[$i]=~s/\s+$//g;
			if ($opt{'no_encode'}) {
            	$values->{$name}=$list[$i];
			} else {
            	$values->{$name}=DA::CGIdef::encode($list[$i],1,1,'euc');
			} 
        }
    }
    $sth->finish;

	$sql="SELECT name,kana,alpha,type,title,primary_gid "
		."FROM $member_table WHERE mid=?";
	$sth=$session->{dbh}->prepare($sql);
	$sth->bind_param(1,$mid,3); $sth->execute();
	my ($name,$kana,$alpha,$type,$title,$gid)=$sth->fetchrow;
	$sth->finish;

	my $v_name=DA::IS::get_ug_name($session,1,$gid,undef,undef,undef,undef,undef,undef,undef,$msid);

	if ($opt{'no_encode'}) {
    	$values->{attr01}=$name;
    	$values->{attr02}=$kana;
    	$values->{attr03}=$alpha;
    	$values->{attr04}=$v_name->{name};
    	$values->{attr05}=$title;
	} else { 
    	$values->{attr01}=DA::CGIdef::encode($name,1,1,'euc');
    	$values->{attr02}=DA::CGIdef::encode($kana,1,1,'euc');
    	$values->{attr03}=DA::CGIdef::encode($alpha,1,1,'euc');
    	# $values->{attr04}=DA::CGIdef::encode($v_name->{name},1,1,'euc');
    	$values->{attr04}=$v_name->{name};
    	$values->{attr05}=DA::CGIdef::encode($title,1,1,'euc');
	}

	# ログイン不能ユーザの情報が非表示の場合
	my $hidden;
	if ($type eq 4) {
		my $conf=DA::IS::get_sys_custom($session,"restrict");
		if ($conf->{rest_user} eq 'hidden') { $hidden=1; }
	}

	foreach my $key (keys %{$values}) { 
		next if ($key eq 'mid');
		if (($hidden) && (!$opt{force_all})) {
			$values->{$key}=t_("非表示");
		} else {
			$values->{$key}=~s/\s+$//; 
		}
	}

	return($values);
}

sub admin_check{
	my ($session,$type)=@_;
# $type = 0 システム管理者のみ
# $type = 2 システム管理者か,管理権限ユーザで対象組織がトップ組織のユーザ
# $type = 1 管理権限ユーザ以上
	# DA::IS::set_temp_lang($session, 'ja');

	if ($type){
		
		if( $type == 2 ){
			unless ( DA::IS::is_system_admin($session) || DA::IS::is_limited_admin_top($session)  ){
				my $error=t_("管理権限が必要な機能です。");
				DA::CGIdef::errorpage($session,$error,'nobutton');
			}
		} else {
			unless ( DA::IS::is_system_admin($session) || DA::IS::is_limited_admin_top($session) || DA::IS::is_limited_admin($session)  ){
			#if (!$session->{admin} &&
			#	$session->{user} != $DA::Vars::p->{insuite_mid}){
				my $error=t_("管理権限が必要な機能です。");
				DA::CGIdef::errorpage($session,$error,'nobutton');
			}
		}
	} else {
		unless ( DA::IS::is_system_admin($session) ){
			my $error=t_("システム管理者のみ使用できる機能です。");
			DA::CGIdef::errorpage($session,$error,'nobutton');
		}
	}
}

sub get_owner_group {
    my($session,$mid,$attr,$auth,$join_group,$gid)=@_;
    # $attr プライマリ、セカンダリの指定。未指定の場合、全オーナーグループ。
    #   3 = プライマリのみ
    #   346 = プライマリ、セカンダリ
    #   0 = 全オーナー
    # $auth 制限つきも含む場合、指定する。
    #   $auth = 1  所属ユーザ設定権限
    #         = 2  施設設備管理権限
    #         = 3  通達登録権限
    #         = 4  ポートレット設定権限
    #         = 5  ホームページ編集権限
    #         = 6  表示メニュー設定権限
    #         = 7  個人ポータル設定権限
    #         = 8  グループポータル設定権限
    #         = 9  ドキュメント管理権限
    #         = 10 リンク集設定権限
    #         = 11 ワークフロー設定権限
    #         = 12 アドレス帳管理権限
    #         = 13 連絡掲示板管理権限
    #         = 14 統合クリッピング管理権限
    #         = 15 グループ詳細情報管理権限
    #         = 16 電子メール管理権限
    #         = 17 サイドリンク集設定権限
    #         = 18 スケジュール設定権限
	#		  = 19 RSSリーダー設定権限
	#         = 20 連絡・通知設定権限

	if ($auth && $auth !~ /^\d+$/ && $auth ne 'all') {
		$auth = DA::IS::owner_number($auth);
	}
    my $owner_group ={};
    $owner_group->{USER}={};

    if(!$join_group){
        $join_group = DA::IS::get_join_group($session,$mid,1,undef,undef);
    }

    my @sort_list;
    if ($gid) {
        @sort_list=($gid);
    } else {
        @sort_list=sort{$join_group->{$a}->{type} <=> $join_group->{$b}->{type}
                     or $join_group->{$a}->{org_type} <=> $join_group->{$b}->{org_type}
                     or $join_group->{$a}->{owner} <=> $join_group->{$b}->{owner}
                     or $join_group->{$a}->{sort} <=> $join_group->{$b}->{sort}
                     or $join_group->{$a}->{kana} cmp $join_group->{$b}->{kana}}
                     keys %$join_group;
    }

    my $pattern = DA::IS::get_group_pattern($session);
    my $max=0;
    foreach my $id(@sort_list){
        if($id!~/\d/){next;}
        if(!exists $join_group->{$id}){next;}
        if($join_group->{$id}->{owner}!~/^[$pattern->{owner}]$/){next;}
        if($attr && $join_group->{$id}->{owner} !~ /^[$attr]$/){next;}
        if(!$auth && $join_group->{$id}->{auth_type}){next;}
        my(@owner)=split(/\,/,$join_group->{AUTH}->{$id});
        if($owner_group->{USER}->{$id}){next;}
        if($auth && $auth ne 'all' && $join_group->{$id}->{auth_type}){
            my $no=int($auth)-1;
            if(!$owner[$no]){next;}
        }
		my $name=DA::IS::check_view_name($session,$join_group->{$id}->{name},
                                                  $join_group->{$id}->{alpha});
        $owner_group->{USER}->{$id} = sprintf("%06d:$id:$join_group->{$id}->{type}:$name",++$max);
        $owner_group->{AUTH}->{$id} = join(',',@owner);
        $owner_group->{AUTH_TYPE}->{$id} = $join_group->{$id}->{auth_type};
		if ($join_group->{$id}->{type} eq 4) {
			# 廃止組織の元グループタイプ
			$owner_group->{SUSPEND}->{$id} = $join_group->{$id}->{org_type};
		}
    }

    # Custom
    DA::Custom::get_owner_group($session, $mid, $attr, $auth, $join_group, $owner_group);

    return $owner_group;
}

sub get_owner_group_tag {
    my ($session,$owner_group,$gid,$type,$size,$auth)=@_;
    # オーナーグループの選択タグと選択された GID を返す
    #   $gid で指定したグループが選択状態となる
    #   $type で指定したタイプ以外は除外される (0 の場合は全件)
    #   $size > 0 の場合は、最後にダミー行を挿入する
	#	$suspend=1 で廃止グループに[*]を付加する

    my $tag;
    if(ref($owner_group->{USER}) ne 'HASH' || !%{$owner_group->{USER}}){
        $owner_group=DA::IS::get_owner_group($session,$session->{user},0,$auth);
    }
    foreach my $value (sort values %{$owner_group->{USER}}){
        my $index;
        my ($v_no,$v_gid,$v_type,$v_name)=split(/:/,$value,4);
        if ($type && $type !~ /$v_type/) { 
			if ($v_type eq '4') {
				next if ($type !~ $owner_group->{SUSPEND}->{$v_gid});
			} else {
				next; 
			}	
		}
        $v_name=DA::CGIdef::encode($v_name,0,1,'euc');
        if (!$gid) { $gid=$v_gid; }
		my $flg;
        if ($gid eq $v_gid) { $index='selected'; }
        if ($v_type eq '1') {
            $v_type="[G]";
        } elsif ($v_type eq '2') {
            $v_type="[P]";
        } elsif ($v_type eq '3') {
            $v_type="[T]";
        } elsif ($v_type eq '4') {
			$v_name = DA::IS::pre_suspend($session)." $v_name";
			if ($owner_group->{SUSPEND}->{$v_gid} eq 3) {
            	$v_type="[T]";
			} elsif ($owner_group->{SUSPEND}->{$v_gid} eq 2) {
            	$v_type="[P]";
			} else { 
            	$v_type="[G]";
			}
        }
        $tag.="<option value=$v_gid $index>$v_type $v_name</option>\n";
    }
    if ($tag && $size > 1) {
        $tag.="<option value=''>";
        for (0..($size*2)) { $tag.="&nbsp;"; }
        $tag.="</option>";
    }
    return ($tag,$gid);
}

sub check_owner{
    my($session,$owner_group,$gid,$auth,$mid,$join_gid,$lite)=@_;
    #   セカンダリオーナーの場合、権限を判断する。（省略可）
    #   $auth = all  全制限つき含む
    #   $auth = 1  所属ユーザ設定権限
    #         = 2  施設設備管理権限
    #         = 3  通達登録権限
    #         = 4  ポートレット設定権限
    #         = 5  ホームページ編集権限
    #         = 6  表示メニュー設定権限
    #         = 7  個人ポータル設定権限
    #         = 8  グループポータル設定権限
    #         = 9  ドキュメント管理権限
    #         = 10 リンク集設定権限
    #         = 11 ワークフロー設定権限
    #         = 12 アドレス帳設定権限
    #         = 13 連絡掲示板管理権限
    #         = 14 統合クリッピング管理権限
    #         = 15 グループ詳細情報管理権限
    #         = 16 電子メール管理権限
    #         = 17 サイドリンク集設定権限
    #         = 18 スケジュール設定権限
	#         = 19 RSSリーダー設定権限
	#         = 20 連絡・通知設定権限

	if ($auth && $auth !~ /^\d+$/ && $auth ne 'all') {
		$auth = DA::IS::owner_number($auth);
	}
    if (ref($owner_group) ne 'HASH' || !%$owner_group){
        if (!$mid){$mid=$session->{user};}
        if ($lite) {
            $owner_group=DA::IS::get_owner_group($session,$mid,0,$auth,$join_gid,$gid);
        } else {
            $owner_group=DA::IS::get_owner_group($session,$mid,0,$auth,$join_gid,undef);
        }
    }
    if ($owner_group->{USER}->{$gid}){
        return 1;
    }else{
        return 0;
    }
}

sub get_page_navi2{
    my($session,$param)=@_;
	$param->{name}='page' if (!$param->{name});
    my $start=int(($param->{page} - 1)/10)*10+1;
    my $end=$start+10;
    my($view,$navi,$prev,$next,$page,$prev10,$next10);
    if ($param->{page} > 1) {
        my $ppage=$param->{page} - 1;
        my $enc_param=DA::CGIdef::encode("$param->{cgi}\&$param->{name}=$ppage",1,1,'euc');
        $prev="<a href=\"$enc_param\">"
             . "<img src=\"$session->{img_rdir}/aqbtn_pageback.gif\" "
             . "width=82 height=17 border=0 alt=\"@{[t_('前のページ')]}\" align=top></a>";
        $view=1;
    }else{
        $prev="<img src=\"$session->{img_rdir}/null.gif\" "
             . "width=82 height=17 align=top>";
    }
    if ($param->{final} > int($param->{page}*$param->{line})) {
        my $npage=$param->{page} + 1;
        my $enc_param=DA::CGIdef::encode("$param->{cgi}\&$param->{name}=$npage",1,1,'euc');
        $next="<a href=\"$enc_param\">"
            . "<img src=\"$session->{img_rdir}/aqbtn_pagenext.gif\" "
            . "width=82 height=17 border=0 alt=\"@{[t_('次のページ')]}\" align=top></a>";
        $view=1;
    }else{
        $next="<img src=\"$session->{img_rdir}/null.gif\" "
            . "width=82 height=17 align=top>";
    }

    if ($start ne 1) {
        my $prev_page=$start - 10;
        my $enc_param=DA::CGIdef::encode("$param->{cgi}\&$param->{name}=$prev_page",1,1,'euc');
        $prev10="<a href=\"$enc_param\">"
               ."<img src=\"$session->{img_rdir}/cal_back.gif\" width=15 "
               ."height=12 align=top border=0 alt=\"@{[t_('前の10ページ')]}\"></a>"
               ."&nbsp;&nbsp;";
    } else {
        $prev10="<img src=\"$session->{img_rdir}/null.gif\" width=15 "
               ."height=12 align=top border=0>&nbsp;&nbsp;";
    }
    my $cnt;
    for($cnt=$start;$cnt<$end;$cnt++) {
        my $class=($cnt ne $param->{page}) ? 'blk' : 'sel';
        my $enc_param=DA::CGIdef::encode("$param->{cgi}\&$param->{name}=$cnt",1,1,'euc');
        $page.="<a href=\"$enc_param\" class=\"$class\">$cnt</a>"
             . "&nbsp;&nbsp;";
        if(int($cnt * $param->{line}) >= int($param->{final})){$cnt++;last; }
    }
    $cnt--;
    if(int($cnt * $param->{line}) < int($param->{final})){
        my $next_page=$start + 10;
        my $enc_param=DA::CGIdef::encode("$param->{cgi}\&$param->{name}=$next_page",1,1,'euc');
        $next10="<a href=\"$enc_param\">"
               ."<img src=\"$session->{img_rdir}/cal_next.gif\" width=15 "
               ."height=12 align=top border=0 alt=\"@{[t_('次の10ページ')]}\"></a>";
    }else{
        $next10.="<img src=\"$session->{img_rdir}/null.gif\" width=15 "
               . "height=12 align=top border=0>";
    }

    if($view){
        $navi="<table border=0 width=100%><tr><td nowrap>$prev</td>"
             ."<td nowrap width=90% align=center>$prev10$page$next10</td>"
             ."<td nowrap>$next</td></tr></table>";
    }
    return ($navi);
}

sub make_alias{
    my($session,$group_list,$user_list)=@_;

	my ($aliases, $email, $notes);
	my @list;
	foreach my $id(@$group_list){
        if($id=~/\@/o){
		    push(@list,$id);
        }else{
            my $email_list = DA::IS::get_all_user_list($session,$id,1);
            push(@list,@$email_list);
        }
	}
	foreach my $id(@$user_list){
        if($id=~/\@/o){
		    push(@list,$id);
        }else{
            my $dbo = DA::DBO::Member->new(
                                dbh     => $session->{dbh},
                                column  => [qw(email)],
                                # mid     => $id);
                                mid     => int($id));

            my $email = $dbo->value('email');
            push(@list,$email);
        }
	}
	my %count; @list = grep(!$count{$_}++, @list);

	#===========================================
	#     Custom
	#===========================================
	DA::Custom::rewrite_alias_target_addresses($session, \@list);
	#===========================================

	# Change by T.K 2004/02/26 --->
    # ノーツメール対応
    if ($DA::Vars::p->{notes_mail}->{connect} eq 'on') {
        my @notes_domain = DA::Mailer::get_sys_custom_line({}, 'notes_domain', 1);
        foreach my $a (@list){
            if (DA::Mailer::check_notes_address($a, \@notes_domain)) {
                $notes .= "$a\n";
            } else {
                $email .= "\&$a\n";
            }
        }
    } else {
        foreach my $a (@list){
            $email .= "\&$a\n";
        }
    }

    # エイリアスファイルの作成
    if ($email) {
        my $cnt     = DA::IS::get_count($session, 'gmail_send', 1);
        my $alias   = "isg$cnt";
        DA::System::file_open(\*OUT, "> $DA::Vars::p->{alias_dir}/.qmail-$alias");
        print OUT "\|condredirect root $DA::Vars::p->{bin_dir}/alias_check.pl $alias\n";
        print OUT $email;
        close(OUT);

        $alias      .="\@$DA::Vars::p->{admin_domain}";
        $aliases    = $alias;
    }
    if ($notes) {
        my $cnt     = DA::IS::get_count($session, 'gmail_send', 1);
        my $alias   = "isg$cnt";
        DA::System::file_open(\*OUT,"> $DA::Vars::p->{alias_dir}/.qmail-$alias");
        print OUT "\|condredirect root $DA::Vars::p->{bin_dir}/alias_check.pl $alias\n";
        print OUT "\|$DA::Vars::p->{bin_dir}/sendNotesMail.pl -alias $alias\n";
        close (OUT);
        DA::System::file_open(\*OUT,"> $DA::Vars::p->{alias_dir}/.qmail-$alias\.address");
        print OUT $notes;
        close (OUT);

        $alias      .="\@$DA::Vars::p->{admin_domain}";
        $aliases    .=($aliases) ? "," . $alias : $alias;
    }

    return ($aliases);
}

sub delete_alias{
    my($session,$alias_list)=@_;
    if(ref($alias_list) ne 'ARRAY'){return;}
    foreach my $alias(@$alias_list){
        if(!$alias){next;}
        DA::System::file_unlink("$DA::Vars::p->{alias_dir}/.qmail-$alias");
    }
}

sub get_sort_level_option{
    my($session,$level)=@_;
    my $option_tag;
    for(my $no=1;$no<100;$no++){
        my $sel;
        if($no == $level){$sel="selected";}
        $option_tag.="<option value=\"$no\" $sel>"
			.t_("レベル%1",$no)."</option>";
    }
    return $option_tag;
}

sub jump_admin{
    my($session)=@_;

    if ($session->{user} eq $DA::Vars::p->{insuite_mid} ||
        ($session->{admin} && $session->{mainte_mode})) {
        my $location = "$DA::Vars::p->{ad_rdir}/index.html";
        my $outbuf="Content-type: text/html\n\n";
$outbuf.=<<buf_end;
<html><head><title>INSUITE</title>
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
<meta http-equiv="Cache-Control" content="no-cache">
<META HTTP-EQUIV="Refresh" CONTENT="0;URL=$location">
</head></html>
buf_end
        DA::IS::print_data($session,$outbuf);
        Apache::exit();
    }

}

sub remake_faivorite{
    my($session,$mid,$g_list)=@_;
    my $param={};
    my $no;
    DA::System::file_open(\*IN,"$DA::Vars::p->{master_dir}/$mid/.faivorite_group.dat");
    while(my $line=<IN>){
        chomp($line);
        if ($line eq '') { next; }
        my($key,$val)=split(/\=/,$line,2);
        $val=~s/^\s+//; $val=~s/\s+$//;
        if ($val eq '') { next; }
        $param->{$val} = "$key=$val";
        $no=int($key);
        $no=sprintf("%06d",++$no);
    }
    close(IN);
    foreach my $line(sort values %$g_list){
        chomp($line);
        my($key,$val)=split(/\=/,$line,2);
        if ($val eq '') { next; }
        if ($param->{$val}) { next; }
        $param->{$val} = sprintf("%06d",++$no) ."=$val";
    }
    DA::System::file_open(\*OUT,">$DA::Vars::p->{master_dir}/$mid/.faivorite_group.dat");
    foreach my $line(sort values %$param){
        my($key,$val)=split(/\=/,$line,2);
        print OUT "$key=$val\n";
    }
    close(OUT);
}

## アクティブ世代の全ユーザに対して
## is_member, is_group_member から master/MID/.faivorite_group.dat を更新する

sub remake_all_faivorite {
	my($session) = @_;
	
	my $group_sql = "SELECT gm.gid,gm.type, gm.attr ";
	 $group_sql  .= "FROM @{[DA::IS::get_master_table($session,'is_group_member')]} gm ";
	 $group_sql  .= "WHERE gm.mid = ?  ";

	my $group_sth = $session->{dbh}->prepare($group_sql);

	my $member_sql = "SELECT m.mid FROM @{[DA::IS::get_member_table($session,'TBL')]} m ";
	$member_sql   .= "WHERE m.type IN (1, 3, 4)";
	my $member_sth = $session->{dbh}->prepare($member_sql);
	$member_sth->execute;

	while( my($mid) = $member_sth->fetchrow() ){
	 
		my $block = {
		    'USERSEL'   => {},      # プライマリ組織
		    'S_USERSEL' => {},      # セカンダリ組織
		    'P_USERSEL' => {},      # ワークグループ
		    'T_USERSEL' => {}       # 役職グループ
		};

		$group_sth->bind_param(1, $mid);
		$group_sth->execute;
		while (my $gm_data = $group_sth->fetchrow_hashref('NAME_lc')) {

		    my $gid = $gm_data->{'gid'};
		    if ($gm_data->{'type'} eq 1) {
		        # ※ 組織
		        if ($gm_data->{'attr'} eq 1) {
		            # ※ プライマリ
		            $block->{USERSEL}->{$gid} = $gid;
		        } elsif ($gm_data->{'attr'} eq 2) {
		            # ※ セカンダリ
		            $block->{S_USERSEL}->{$gid} = $gid;
		        }
		    } elsif ($gm_data->{'type'} eq 2) {
		        # ※ ワークグループ
		        if ($gm_data->{'attr'} eq 1) {
		            $block->{P_USERSEL}->{$gid} = $gid;
		        }
		    } elsif ($gm_data->{'type'} eq 3) {
		        # ※ 役職
		        if ($gm_data->{'attr'} eq 1) {
		            $block->{T_USERSEL}->{$gid} = $gid;
		        }
		    }
		}

		my $faivorite = {};
		# .faivorite_group.datが存在する場合(既存ユーザの場合)は
		# 既存の値を取得
		if (-e "$DA::Vars::p->{data_dir}/master/$mid/.faivorite_group.dat") {
		    # ※ 更新
			$faivorite = DA::IS::get_master({user => $mid}, "faivorite_group");
		}

	    my $no = scalar(keys %{$faivorite});

	    # □ Key,Valueの入れ替えを行いKeyによる検索を行う
	    my %reverse = reverse %{$faivorite};
	    # □ プライマリ組織
	    foreach my $gid(keys %{$block->{USERSEL}}){
	        unless (exists $reverse{$gid}) {
	            my $num = sprintf("%06d", ++$no);
	            $faivorite->{$num} = $gid;
	        }
	    }
	    # □ セカンダリ組織
	    foreach my $gid(keys %{$block->{S_USERSEL}}){
	        unless (exists $reverse{$gid}) {
	            my $num = sprintf("%06d", ++$no);
	            $faivorite->{$num} = $gid;
	        }
	    }
	    # □ ワークグループ
	    foreach my $gid(keys %{$block->{P_USERSEL}}){
	        unless (exists $reverse{$gid}) {
	            my $num = sprintf("%06d", ++$no);
	            $faivorite->{$num} = $gid;
	        }
	    }
	    # □ 役職グループ
	    foreach my $gid(keys %{$block->{T_USERSEL}}){
	        unless (exists $reverse{$gid}) {
	            my $num = sprintf("%06d", ++$no);
	            $faivorite->{$num} = $gid;
	        }
	    }
		
		# .faivorite_group.dat を保存
	    DA::IS::save_master({user=>$mid}, $faivorite, "faivorite_group");
	}
}

sub get_admin_location{
    my($session,$server_type)=@_;
    my $encrypt = DA::CGIdef::get_encrypt_pass($session->{sid});
    $encrypt=~s/\///g; $encrypt=~s/^\.+//g;
    $encrypt=~s/\$//g; $encrypt=~s/\@//g; $encrypt=~s/\%//g;
    DA::System::file_open(\*OUT,">$DA::Vars::p->{data_dir}/temp/session/$encrypt\.dat");
    print OUT $session->{sid};
    close(OUT);
    $encrypt=URI::Escape::uri_escape($encrypt);
    my $url = $DA::Vars::p->{admin_session_url};
    my $lang = DA::IS::get_user_lang($session);
    my $location ="$url/cgi-bin/admin_check.cgi"
                 ."?mid=$session->{user}&key=$encrypt&lang=$lang";
    return $location;
}

sub get_proxy {
	my ($session,$url)=@_;

	# SSL Proxy 対応
	my ($proxy_server,$ssl_proxy_server);
    if ($DA::Vars::p->{proxy_server}) {
       	$proxy_server=DA::CGIdef::set_http($DA::Vars::p->{proxy_server});
		if ($DA::Vars::p->{proxy_port}) {
       		$proxy_server.=":" . $DA::Vars::p->{proxy_port};
		}
    }
    if ($DA::Vars::p->{ssl_proxy_server}) {
       	$ssl_proxy_server=
			DA::CGIdef::set_http($DA::Vars::p->{ssl_proxy_server});
		if ($DA::Vars::p->{ssl_proxy_port}) {
       		$ssl_proxy_server.=":" . $DA::Vars::p->{ssl_proxy_port};
		}
    }

	my ($url_p,$url_u)=DA::CGIdef::split_url($url);

	# Proxy サーバのＵＲＬは http/https の区別を行う
	if (-f "$DA::Vars::p->{system_dir}/proxy\.dat") {
		DA::System::file_open(\*IN,"$DA::Vars::p->{system_dir}/proxy\.dat");
		while (my $line=<IN>) {
			chomp($line);
			my ($key,$value)=split(/[\t=]/,$line,2);
			if (!$key) { next; }
			my ($key_p,$key_u)=DA::CGIdef::split_url($key);
			if ($key_p eq $url_p && $url_u =~ /^$key_u$/) {
                if (!$value) {
                    # PROXY サーバの欄に何も指定しない場合は除外
                    $proxy_server='';
                    $ssl_proxy_server='';
				} elsif ($url_p eq 'https') {
					$ssl_proxy_server=$value;
				} elsif ($url_p eq 'http') {
					$proxy_server=$value;
				}
				last;
			}
		}
		close(IN);
	}

	#===========================================
	#     Custom
	#===========================================
	DA::Custom::get_custom_proxy($session, $url, \$proxy_server, \$ssl_proxy_server);

	if ($url_p eq 'https') { 
		return($ssl_proxy_server);
	} else {
		return($proxy_server);
	}
}

sub get_group_struct{
	my ($session,$top,$target,$opt,$msid)=@_;

	# $opt{'lang'}	# 言語

	#==========================================================
    #                -----custom------
    #==========================================================
	my ($skip, $struct, $suspend_struct, $no_proj_suspend_struct, $suspend_no_proj_struct)
		= DA::Custom::custom_group_struct($session, $top, $target, $opt, $msid);

	unless($skip){
		my $group_cache = DA::IS::get_group_cache($session, $msid);
	
		my $table;
		unless ($target) {
			$table = DA::IS::get_group_table($session, "TBL", $msid);
		} else {
			$table = "tmp_group";
		}
	
	    my $sql ="SELECT gid,name,kana,alpha,parent,type,grade,org_type FROM $table ";
	
	    my $icon;
		if($top eq $DA::Vars::p->{title_gid}){
	       	$sql.="WHERE type=3 OR (type=4 AND org_type=3) "
	           	. "ORDER BY grade";
			$top  = $DA::Vars::p->{title_gid};
	   	}else{
	       	$sql.="WHERE type IN (1,2) OR (type=4 AND org_type IN (1,2)) "
	           	. "ORDER BY type,sort_level,upper(kana)";
	       	if($top == $DA::Vars::p->{top_gid}){
	           	$icon = 'ico_fc_company.gif';
	       	}else{
	           	$icon = 'ico_fc_organization.gif';
	       	}
		}
	
	    my $sth=$session->{dbh}->prepare($sql); $sth->execute();
	
	    my $groups  ={};
	    my $parents ={};
		my $suspend_groups	= {};
		my $suspend_parents	= {};
		my $suspend_no_proj_groups = {}; 
		my $suspend_no_proj_parents = {}; 
		my $no_proj_suspend_groups = {}; 
		my $no_proj_suspend_parents = {};
	    while(my($gid,$name,$kana,$alpha,$parent,$type,$grade,$org_type)=$sth->fetchrow) {
	        $name=~s/\s+$//g; $parent=~s/\s+$//g;
	        if($gid eq $DA::Vars::p->{title_gid} ||
	           $gid eq $DA::Vars::p->{admin_gid}){
	            $alpha=F_('en',"$name");
	        }
	
	        my $c_name;
	        if (DA::MultiLang::master_ok() && $table ne 'tmp_group' &&
	        	ref($group_cache->{$gid}) eq 'HASH' &&
            	ref($group_cache->{$gid}->{name}) eq 'HASH' && %{$group_cache->{$gid}->{name}}) {
	            my %l_name   = %{$group_cache->{$gid}->{name}};
	            $c_name = \%l_name;
	        } else {
	            $c_name = $name;
	        }
	
	       	$suspend_groups->{$gid}={
						'name'   => $c_name,
						'alpha'  => $alpha,
						'type'   => $type,
						'org_type' => $org_type,
						'parent' => $parent};
			push(@{$suspend_parents->{$parent}},$gid);
			
			if ($type ne 4 && $type ne 2) {
					$no_proj_suspend_groups->{$gid}={
						    'name'   => $c_name,
	                        'alpha'  => $alpha,
	                        'type'   => $type,
							'org_type' => $org_type,
	                        'parent' => $parent};
					push(@{$no_proj_suspend_parents->{$parent}},$gid);
				}
			if ($type ne 4){
				    $groups->{$gid}={
							'name'   => $c_name,
	                        'alpha'  => $alpha,
	                        'type'   => $type,
							'org_type' => $org_type,
	                        'parent' => $parent};
	        	    push(@{$parents->{$parent}},$gid);
				}	
		   if ($type ne 2){
		   	   $suspend_no_proj_groups->{$gid}={
							'name'   => $c_name,
	                        'alpha'  => $alpha,
	                        'type'   => $type,
							'org_type' => $org_type,
	                        'parent' => $parent};
	           push(@{$suspend_no_proj_parents->{$parent}},$gid);
		   }
	    }
	    $sth->finish;
	
	    # ▼ Structオブジェクトの作成
	    # -------------------------------------------------------------------------
	    $struct = DA::HTML::Struct->new(
	                    parent      =>  $parents,               # 親子関係のデータ
	                    info        =>  $groups,                # データの付随情報
	                    root        =>  $top,                   # ツリートップ
	                    root_image  =>  $icon                   #
	                                );
	    $suspend_struct = DA::HTML::Struct->new(
	                    parent      =>  $suspend_parents,		# 親子関係のデータ
	                    info        =>  $suspend_groups,		# データの付随情報
	                    root        =>  $top,                   # ツリートップ
	                    root_image  =>  $icon                   #
	                                );
	     $no_proj_suspend_struct = DA::HTML::Struct->new(
	                    parent      =>  $no_proj_suspend_parents,		# 親子関係のデータ
	                    info        =>  $no_proj_suspend_groups,		# データの付随情報
	                    root        =>  $top,                       # ツリートップ
	                    root_image  =>  $icon                       #
	                                );
	     $suspend_no_proj_struct = DA::HTML::Struct->new(
	                    parent      =>  $suspend_no_proj_parents,		# 親子関係のデータ
	                    info        =>  $suspend_no_proj_groups,		# データの付随情報
	                    root        =>  $top,                   # ツリートップ
	                    root_image  =>  $icon                   #
	                                );                                                       
	}
    return wantarray ? ($struct, $suspend_struct, $no_proj_suspend_struct, $suspend_no_proj_struct) : $struct;
}

sub get_group_up_path{
    my($session,$top,$gid,$sort,$mode,$msid)=@_;
	# $mode 1: プロジェクトの場合、何も返さない

	my $group_table_mm = DA::IS::get_group_table($session, "TBL", $msid);
	my $gp_table = DA::IS::get_master_table($session, "is_group_path", $msid);

    my $sql="SELECT parent,type FROM $group_table_mm WHERE gid=?";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,$gid,3); $sth->execute();
    my($parent,$type)=$sth->fetchrow; $sth->finish;

    my $id;
    if ($type ne 1 && $mode eq '1'){return ();}
    if ($type ne 1){$id=$parent;}
    else{$id=$gid;}

    $sql ="SELECT gid FROM $gp_table ";
    $sql.="WHERE real_gid=? and attr='U'";
    $sth=$session->{dbh}->prepare($sql);
    $sth->bind_param(1,$id,3); $sth->execute();
    my $path = [];
    while(my($gid)=$sth->fetchrow) {
        push(@$path,$gid);
    }
    $sth->finish;
    if ($type ne 1){push(@$path,$parent);}
    push(@$path,$gid);

    return $path;
}

sub conv_access_url {
	my ($str)=@_;
    my $conv = DA::IS::get_convert_data();
    foreach my $key(keys %{$conv->{http_url}}){
        my $q_key=quotemeta($key);
        if($str=~/^$q_key/i){
            $str=~s/^$q_key/$conv->{http_url}->{$key}/i;
            last;
        }
    }
    if($str eq ''){
        $str="/";
    }
    return $str;
}

sub get_convert_data {
	my $conv={};

	if (-f "$DA::Vars::p->{system_dir}/convert.dat") {
		DA::System::file_open(\*IN,"$DA::Vars::p->{system_dir}/convert.dat");
		while (my $line=<IN>) {
			chomp($line);
            if($line eq ''){next;}
            if($line =~/^\#/){next;}
			my ($key,$val1,$val2)=split(/\t/,$line);
            if($key){
                $conv->{$key}->{$val1} = $val2;
            }
		}
		close(IN);
	}

	return ($conv);
}

sub format_jsubstr{
	my($session,$str,$off,$length,$tag,$z2h)=@_;
	if ($off == 0 && ($tag == 0 || $tag == 1)) {
		return DA::Unicode::format_jsubstr($session,$str,$off,$length,$tag);
	} else {
		return format_jsubstr_obsolete($session,$str,$off,$length,$tag,$z2h);
	}
}

sub format_jsubstr_obsolete{
	my($session,$str,$off,$length,$tag,$z2h)=@_;

# $str : 文字列
# $off : 先頭位置
# $length : 長さ
# $tag=0 : テキストをそのままカット。
# $tag=1 : デコードしてからカット。
#          （&lt; &amp; &quot; &gt; を１バイトとしてカウント）
# $tag=2 : HTMLタグを考慮してカット。
#          （カットする位置がHTMLタグ内であると想定される場合、
#            「<」 までさかのぼってカットする。）
# $tag=3 : HTMLタグを考慮してカット。（encodeデータ含む）
# $z2h=1 : 全角カナを半角カナに変換

	if($length == 0){
		return undef;
	}
    my($buf,$eat)=DA::CGIdef::jsubstr($str,$off,$length,$tag,$z2h);
    if(length($str) > $eat){
		if($session->{mobile}){$length-=2;}
        ($buf,$eat)=DA::CGIdef::jsubstr($str,$off,$length,$tag,$z2h);
        $buf.="..";
    }
    return($buf);
}

# CSRF対策
# cookie->{sid}と$DA::Vars::p->{add_key_val}をキーとして
# トークンを生成。 cookieにsidが無い場合は、 引数$keyを使う
sub generate_check_key_val{
	my($key) = @_;
	my $cookie  = DA::Session::cookie();
	my $token_key = $cookie->{sid};
	$token_key    = $key  if ( $key );
	if( $token_key && $DA::Vars::p->{csrf} eq 'on' ){
	        return Digest::MD5::md5_hex($token_key.$DA::Vars::p->{add_key_val});
	}
	return '';
}

# CSRF対策
# トークンを保持するHTTPパラメータ名
sub chk_key_param_name {
	return $DA::Vars::p->{chk_key_param_name};
}

# CSRF対策
# HTTPパラメータから受け取ったトークンが正しいか比較
sub comp_check_key_val {
	my ( $token_key, $sid ) = @_;
	
	if( $DA::Vars::p->{csrf} eq 'on' ){ 
		return  ( $token_key  eq Digest::MD5::md5_hex($sid.$DA::Vars::p->{add_key_val}) );
	}
	
	return 1; 
}

# CSRF対策
# urlのGET文字列用にトークンパラメータを返す関数
sub get_check_key_param{
   my($separator, $key) = @_;
   
   return ''  if( $DA::Vars::p->{csrf} ne 'on' );
   
   return  sprintf("%s%s=%s",
               $separator,
               $DA::Vars::p->{chk_key_param_name},
               DA::IS::generate_check_key_val($key)
   );
 }

# CSRF対策
# FORM用にhidden形式でトークンパラメータ返す関数
sub get_check_key_input{
   my($key) = @_;
   
   return ''  if( $DA::Vars::p->{csrf} ne 'on' );
   
   return  sprintf("<input type=\"hidden\" name=\"%s\" value=\"%s\">\n",
                    $DA::Vars::p->{chk_key_param_name},
                    DA::IS::generate_check_key_val($key) );
}

# CSRF対策
# URL文字列にトークンパラメータを付加して返す関数
# 
# $url        トークンを付加するURL
# $separator  トークンを付加する際のセパレータ($pos=0の場合だけ有効)
# $pos        トークンを付加する位置 (0:GET文字列の最後,1:GET文字列の先頭)
sub add_check_key_url{
    my($url, $separator, $pos, $key) = @_;

    return $url if( $DA::Vars::p->{csrf} ne 'on' );
   
    $pos = 0 if(!$pos);
    $url =~ s/^\s+|\s+$//;
	return $url unless($url && DA::IS::url_target_chk($url));
    
	my $check_key = DA::IS::generate_check_key_val($key);

    my $anchor="";
	if($url =~s/(#[\w\-\_:\/.]*)$//){
	    $anchor = $1;
    }

    ## URLにGET文字列を含む場合
    if( $url =~/\?/ ){
	    ## 先頭に追加
        if( $pos ){
	        $url =~s/\?(.+$)?//;
		    my $get_param = $1;
			if($get_param){
			    if($anchor){
                    return sprintf("%s?%s=%s&%s", $url, $DA::Vars::p->{chk_key_param_name}, "$check_key","$get_param$anchor");
				}else{
                    return sprintf("%s?%s=%s&%s", $url, $DA::Vars::p->{chk_key_param_name}, "$check_key","$get_param");
				}
			}else{
			    if($anchor){
                    return sprintf("%s?%s=%s", $url, $DA::Vars::p->{chk_key_param_name}, "$check_key$anchor");
				}else{
                    return sprintf("%s?%s=%s&", $url, $DA::Vars::p->{chk_key_param_name}, $check_key);
				
				}
			}
	    }else{
	    ## 末尾に追加
            if($separator){
                return sprintf("%s%s%s=%s", $url, $separator, $DA::Vars::p->{chk_key_param_name}, "$check_key$anchor");
	        }elsif( $url =~ /\?$/){
                return sprintf("%s%s=%s", $url, $DA::Vars::p->{chk_key_param_name}, "$check_key$anchor");
		    }else{
              return sprintf("%s&%s=%s", $url, $DA::Vars::p->{chk_key_param_name}, "$check_key$anchor");
		    }
	    }
    }else{
        if($separator){
            return sprintf("%s%s%s=%s", $url, $separator, $DA::Vars::p->{chk_key_param_name}, "$check_key$anchor");
	    }else{
            return sprintf("%s?%s=%s", $url, $DA::Vars::p->{chk_key_param_name}, "$check_key$anchor");
	    }
	}
}

# CSRF対策
# URLに既にトークンパラメータが付加されているかチェックする関数
sub url_target_chk{
    my($url)=@_;
	return 0 if( $url =~/[\?&]$DA::Vars::p->{chk_key_param_name}\=/ );
	return 1 if( $url =~/^[^\?]+\.cgi(:?#[\w\-\_:\/.]*)?$/ || $url =~ /\.cgi(\?|%3f)/ || $url =~/rssreader\/config/ );
	return 0;
}

# CSRF対策
# HTMLのタグに変換対象の属性がある場合は
# トークンパラメータを付加して返す関数
# $tag : タグ名
# $other_attr : 変換対象以外の属性
# $attr       : 変換対象の属性名
# $uri        : 変換対象の属性値
# $key        : トークンキー指定値
sub replace_attr_val{
    my($session, $tag, $other_attr, $attr, $uri, $key)=@_;
    my $orig_uri=$uri;
    my $orig_data ="<$tag $other_attr $attr=$uri";
	$uri=~ s/(^\s+|\s+$)//g;
	my $quote_str = "";
	if ($uri =~ s/(^[\\]+")|([\\]+"$)//g) {
		$quote_str = $1;
	} elsif ($uri =~ s/(^"|"$)//g) {
	 	$quote_str = '"';
	} elsif ($uri =~ s/(^'|'$)//g) {
		$quote_str = "'";
	}
    my$replace_target=1;
	  
	my $_DEBUG_=0;
	warn "input:  $orig_data  $other_attr" if($_DEBUG_);
    my $chk_key = DA::IS::generate_check_key_val($key);

	if( $tag =~/a/i &&$attr eq 'href' && $uri !~ /^["']*\// ){

        if($uri =~/^javascript:/i){
            if($uri=~/javascript\:(Pop|PageMove|TopPageMove|Pop4Ajax|DA\.document\.locationHref)\('([^']*)'/){
              my $func_name = $1;
              my $func_arg  = $2;
              my $sep = ($func_arg =~/\?|%3f/i ) ? '&':'?';
              if( DA::IS::url_target_chk($func_arg) ){
                $uri =~ s/javascript\:(Pop|PageMove|TopPageMove|Pop4Ajax|DA\.document\.locationHref)\('([^']*)'/javascript:$func_name('$func_arg$sep$DA::Vars::p->{chk_key_param_name}=$chk_key'/ ;

              }else{
                $replace_target=0;
              }
			}elsif( $uri=~/javascript\:DA\.ajax\.deleteItem\('([^']*)','([^']*)'/){
		      my $func_arg1 = $1;
	          my $func_arg2 = $2;
			  my $sep = ($func_arg2 =~/\?|%3f/i ) ? '&':'?';
	          if( DA::IS::url_target_chk($func_arg2) ){
                $uri =~ s/javascript\:DA\.ajax\.deleteItem\('([^']*)','([^'])*'/javascript:DA.ajax.deleteItem('$func_arg1','$func_arg2$sep$DA::Vars::p->{chk_key_param_name}=$chk_key'/ ;
			  }else{
			    $replace_target=0;
			  }
			}
        }else{
            $uri = DA::IS::add_check_key_url($uri, '', 0, $key);
              
        }
    }elsif($tag =~ /meta/i ){
      if( $other_attr =~/HTTP-EQUIV="refresh"/i){
          $uri = DA::IS::add_check_key_url($uri, '', 0, $key);
      }else{
	      $replace_target=0;
      }
    }elsif($tag =~/input/i ){
      if($attr=~/onclick/i && $uri =~/^Pop\('([^']*)'/){
		  my $func_arg = $1;
		  my $sep = ($func_arg =~/\?|%3f/i ) ? '&':'?';
	      if( DA::IS::url_target_chk($func_arg) ){
            $uri  =~s/^Pop\('([^']*)'/Pop('$func_arg$sep$DA::Vars::p->{chk_key_param_name}=$chk_key'/;
          }else{
		    $replace_target=0;
		  }
	  }elsif($attr=~/onclick/i && $uri =~/location\.href\s*=\s*'([^']*)'/){
		  my $func_arg = $1;
		  my $sep = ($func_arg =~/\?|%3f/i ) ? '&':'?';
	      if( DA::IS::url_target_chk($func_arg) ){
            $uri  =~s/location\.href\s*=\s*'([^']*)'/location.href='$func_arg$sep$DA::Vars::p->{chk_key_param_name}=$chk_key'/;
          }else{
		    $replace_target=0;
		  }
	  }elsif($attr=~/onclick/i && $uri =~/DA\.document\.locationHref\('([^']*)'/){
          my $func_arg = $1;
		  my $sep = ($func_arg =~/\?|%3f/i ) ? '&':'?';
          if( DA::IS::url_target_chk($func_arg) ){
            $uri  =~s/DA\.document\.locationHref\('([^']*)'/DA.document.locationHref\('$func_arg$sep$DA::Vars::p->{chk_key_param_name}=$chk_key'/;
          }else{
            $replace_target=0;
          }
      }
	} elsif($tag =~/img/i ){
      if($attr=~/onclick/i && $uri =~/window\.open\('([^']*)'/){
          my $func_arg = $1;
		  my $sep = ($func_arg =~/\?|%3f/i ) ? '&':'?';
          if( DA::IS::url_target_chk($func_arg) ){
            $uri  =~s/window\.open\('([^']*)'/window.open\('$func_arg$sep$DA::Vars::p->{chk_key_param_name}=$chk_key'/;
          }else{
            $replace_target=0;
          }
      }elsif($attr=~/onclick/i && $uri =~/location\.href\s*=\s*'([^']*)'/){
          my $func_arg = $1;
	      my $sep = ($func_arg =~/\?|%3f/i ) ? '&':'?';
          if( DA::IS::url_target_chk($func_arg) ){
            $uri  =~s/location\.href\s*=\s*'([^']*)'/location.href='$func_arg$sep$DA::Vars::p->{chk_key_param_name}=$chk_key'/;
          }else{
            $replace_target=0;
          }
      } 
	} elsif($tag =~/span|div/i ){
      if($attr=~/onclick/i && $uri =~/DA\.document\.locationHref\('([^']*)'/){
          my $func_arg = $1;
		  my $sep = ($func_arg =~/\?|%3f/i ) ? '&':'?';
          if( DA::IS::url_target_chk($func_arg) ){
            $uri  =~s/DA\.document\.locationHref\('([^']*)'/DA.document.locationHref\('$func_arg$sep$DA::Vars::p->{chk_key_param_name}=$chk_key'/;
          }else{
            $replace_target=0;
          }
      }
    } elsif($tag =~/body/i ){
      if ($attr=~/onload/i && $uri =~/location\.href\s*=\s*'([^']*)'/){
          my $func_arg = $1;
	      my $sep = ($func_arg =~/\?|%3f/i ) ? '&':'?';
          if( DA::IS::url_target_chk($func_arg) ){
            $uri  =~s/location\.href\s*=\s*'([^']*)'/location.href='$func_arg$sep$DA::Vars::p->{chk_key_param_name}=$chk_key'/;
          }else{
            $replace_target=0;
          }
      }
    }else{
      $uri = DA::IS::add_check_key_url($uri, '', 0, $key);
    }
	  
	# 置き換え対象で無い場合は元のhtmlデータを返す
	if(! $replace_target){
	  warn"output: $orig_data" if($_DEBUG_);
	  return $orig_data;
	}

	warn"output: <$tag $attr=$quote_str$uri$quote_str  $other_attr" if($_DEBUG_);
    return "<$tag $other_attr $attr=$quote_str$uri$quote_str";
}

# CSRF対策
# Pop〜のURLで変換対象のJavaScript関数を処理する関数
# $pop_attr : Pop()のURL属性
sub replace_url_location {
    my($pop_attr, $key)=@_;
    my $chk_key = DA::IS::get_check_key_param("&");
    if ($pop_attr =~ /pop_up\.cgi/){
        return "$pop_attr + '$chk_key';";
    } else {
        return "$pop_attr;";
    }
}

# CSRF対策
# <script>〜</script> 内でのURL変換を行い返す関数
# $left   : JavaScript関数の関数名
# $target : JavaScript関数の引数(''で囲まれた値)
# $right  : 未使用
# $key    :
sub replace_script_url{
    my($left, $target, $right,$key) =@_;

    $target = DA::IS::add_check_key_url($target, '', 1, $key);
    return sprintf("%s'%s'%s", $left, $target, $right);
}

# CSRF対策
# <script>〜</script> 内で変換対象のJavaScript関数を処理する関数
# $script_attr : <script>タグの属性一式
# $script      : <script>タグのコンテキスト
# 
sub replace_script_location{
    my($script_attr, $script, $key)=@_;
    my $chk_key = DA::IS::generate_check_key_val($key);
    my $sep = ($1 =~/\?/ ) ? '&':'?';

    $script =~ s/(window\.open\()'([^']*[^\/])'/&replace_script_url($1 ,$2, '', $key)/eig;

    $script =~ s/(location\.href\s*=\s*)'([^']*[^\/])'/&replace_script_url($1, $2, '', $key)/eig;

    $script =~ s/(Pop4Ajax\()'([^']*[^\/])'/&replace_script_url($1, $2, '', $key)/eg;

    # Pop タグ対策(pup_up.cgi)
    $script =~ s/(Url\=\'[^\;]*[^\&])\;/&replace_url_location($1, $key)/eigs;

    return "<script$script_attr>$script</script>";
}

# CSRF対策
# 任意のHTMLにトークンパラメータを付加して返す関数
# $session : セッションハッシュ
# $outbuf  : 対象HTML
sub add_check_key_html{
    my($session, $outbuf, $key) = @_;
    if( ($session->{sid} || $key) && $DA::Vars::p->{csrf} eq 'on'){
        my $target_element={
              'form'    => 'action',
              'frame'   => 'src',
	      	  'iframe'  => 'src',
              'a'       => 'href',
              'meta'    => 'content',
              'input'   => 'onclick',
              'img'     => 'onclick',
              'span'    => 'onclick',
              'div'    => 'onclick',
              'body'    => 'onload'
        };
        
        ## replace html tag attribute
        foreach my $tag ( keys %$target_element ){
            my @attr = split /,/, $target_element->{$tag};
            foreach my $target_attr(@attr) {
               $$outbuf =~ s/<$tag\s+([^\>]*)$target_attr\s*=(\s*"[^"]*"|\s*'[^']*'|[^\s>]+)/&replace_attr_val($session,$tag,$1,$target_attr,$2,$key)/eig;
            }
        }

        ## replace script tag context
        $$outbuf=~s/<script([^>]*)>(.*?)<\/script>/&replace_script_location($1, $2, $key)/eigs;
    }
}


# CSRF対策
# DA::IS::add_check_key_html のデバッグ用関数
# 運用時は使用しない
sub print_data_debug{
    my($session, $outbuf)=@_;
    my ($debug_file,$debug_data,$veiw_num);

    my($package, $filename, $line) = caller(1);
    my $view_num=3;
    if( $$outbuf =~ /((:?\n.*){$view_num}$DA::Vars::p->{chk_key_param_name}(:?.*\n){$view_num})/ ){
            $debug_data =<<"EOF";
-------------------------------------
filename:$filename line:$line
$1

EOF
    }

    if($debug_data){
        $debug_file="/home/DreamArts/logs/csrf_debug.log";
        open(OUT,">> $debug_file");
        print OUT $debug_data;
        close(OUT);
    }
}

sub print_data {
    my ($session,$outbuf,$noconv,$csrf_key,$encrypt_targets)=@_;
    # 高速化オプションがＯＮの場合にHTMLを圧縮して出力する。
	# IEの詳細設定で「HTTP1.1 を使用する」と「プロキシ接続でHTTP1.1を使用する」
	# をＯＮにして IE を再起動する必要がある。

	# -- spacer フィルタ (for PalmOS)
	if ($ENV{'HTTP_USER_AGENT'}=~/NetFront\/(\d\.\d)/i) {
		$outbuf =~ s|<img src=/images/null.gif width=(\d+) height=(\d+)>|<spacer type="block" width="$1" height="$2">|gsi;
		$outbuf =~ s|<img src="/images/null.gif" width=(\d+) height=(\d+)>|<spacer type="block" width="$1" height="$2">|gsi;
		$outbuf =~ s|<img src="/images/null.gif" width="(\d+)" height="(\d+)">|<spacer type="block" width="$1" height="$2">|gsi;
	}
	
	# CSRF対策トークン追加
	DA::IS::add_check_key_html($session, \$outbuf, $csrf_key);

	if ($encrypt_targets) {
		my $salt = $session->{salt};
		my $cipher = new Crypt::CBC($salt, 'Blowfish');
		my $match = join("|", @{$encrypt_targets});
		my $crypt = sub {
			my ($tag) = @_;
			my ($name, $value);
			if ($tag =~ /\s+name=(?:(['"])([^<>]+?)\1|(\S+))/) {
				$name = $2 || $3;
			}
			if ($match =~ /(^|\|)\Q$name\E(\||$)/) {
				if ($tag =~ /\s+value=(?:(['"])([^<>]*?)\1|(\S+))/) {
					my $value = ($2 eq "") ? $3 : $2;
					my $v = unpack("H*", $cipher->encrypt(dec_($value)));
					$tag =~ s/(\s+value=)(?:(['"])(?:[^<>]*?)\2|(?:\S+))/$1\"$v\"/ig;
				}
			}

			return($tag);
		};
		$outbuf =~ s/(<input[^<>]+?>)/$crypt->($1)/eig;
	}

	# -- Enter連打対策
	my $foot;
	unless ($session->{ua_browser}) {
		my $user_agent = DA::CGIdef::get_user_agent($ENV{'HTTP_USER_AGENT'});
		$session->{ua_browser}    = $user_agent->{browser};
	}
	if ($session->{ua_browser}=~/(?:InternetExplorer|Chrome|Mozilla)/i && $DA::Vars::p->{rest_enter} ne "") {
		my $except_flg = 0;
		foreach my $l (split(/[\r\n]+/, $DA::Vars::p->{rest_enter})) {
			if ($ENV{SCRIPT_NAME} =~ /$l/) {
				if (DA::Ajax::user_search_ok($session) && $ENV{SCRIPT_NAME} =~ /sc_regist\.cgi|fa_regist\.cgi|user_logout\.cgi|sr_luxor\.cgi/) {
					$except_flg = 1;
				}
				my $prototype;
				if ($outbuf !~ /<script[^<>]+\/(?:prototype|prototype\-comp|thirdparty\-all|all)\.js/i) {
					$prototype = "<script type=\"text/javascript\" src=\"$DA::Vars::p->{js_rdir}/prototype/v1.6.0.3/prototype.js\"></script>";
				}
        		my $prefx = DA::IS::get_uri_prefix();
				my $safelink = "<script type=\"text/javascript\" src=\"$DA::Vars::p->{js_rdir}/common/safelink.js?$prefx\"></script>";

				$foot =$prototype."\n";
				$foot.=$safelink ."\n";
				$foot.=qq{
					<script language="JavaScript"><!--
						DAsafeLink.exceptFlg = '@{[js_esc_($except_flg)]}';
						DAsafeLink.initialize();
					//--></script>
				};
                last;
            }
        }
    }
	if ($foot) { $outbuf =~ s/(<\/\s*html>)[^\)]*$/$foot$1/i; }

	# -- 文字コード変換
	if (!$noconv) {
		$outbuf = DA::Unicode::convert_to_html($outbuf);
	}

	# Netscape 4.x での不具合を回避
	my $version;
	if ($ENV{'HTTP_USER_AGENT'}=~/MSIE\s(\d)\.(\d)/i) {
		$version = $1;
	} elsif ($ENV{'HTTP_USER_AGENT'}=~/Mozilla\/(\d)\.(\d)/i) {
		$version = $1;
	}
	if (!$session->{request} || $DA::Vars::p->{compress_mode} eq 'off'
		|| $session->{img_rdir} !~ /^file/ || $version <= 4) {

		my $ex_charset=DA::Unicode::external_charset();

		print "Content-length: " . length($outbuf) . "\n";

		# print "Content-type: text/html\n\n"; # EUC 環境 + Ajax での不具合を回避
		if ($ex_charset ne "UTF-8" && $ENV{SCRIPT_NAME} =~ /\/portlet_iframe\.cgi/) {
			print "Content-type: text/html; charset=$ex_charset\n\n";
		} else {
			print "Content-type: text/html\n\n";
		}

		print $outbuf;

	} elsif ($ENV{'HTTP_ACCEPT_ENCODING'}=~/gzip/) {
		$outbuf = Compress::Zlib::memGzip($outbuf);
		$session->{request}->print("Content-Encoding: gzip\n");
		$session->{request}->print("Content-length: " . length($outbuf) . "\n");
		$session->{request}->print("Content-type: text/html\n\n");
		$session->{request}->print($outbuf);
	} else {
		$session->{request}->print("Content-length: " . length($outbuf) . "\n");
		$session->{request}->print("Content-type: text/html\n\n");
		$session->{request}->print($outbuf);
	}
}

sub print_mobile {
	my ($session, $outbuf, $csrf_key) = @_;
	if ($ENV{HTTP_USER_AGENT} =~ /IEMobile|Opera|Windows Phone/) {
		my $meta = "<meta name=\"viewport\" content=\"width=480;\">";
		if ($outbuf =~ /\<\/head/i) {
			$outbuf =~ s/(\<\/head)/$meta$1/i;
		} else {
			if ($outbuf =~ /\<body/i) {
				$outbuf =~ s/(\<body)/$meta$1/i;
			}
		}
	}
	
	# CSRF対策トークン追加
	DA::IS::add_check_key_html($session, \$outbuf, $csrf_key);
	
	$outbuf = DA::Unicode::filter($outbuf, 'z2h');
	$outbuf = DA::Unicode::convert_to_html($outbuf);
	print $outbuf;
}

sub print_smartphone {
	my ($session, $outbuf, $csrf_key) = @_;

	# CSRF対策トークン追加
	#DA::IS::add_check_key_html($session, \$outbuf, $csrf_key);

	$outbuf = DA::Unicode::convert_to_html($outbuf);

	# Netscape 4.x での不具合を回避
	my $version;
	if ($ENV{'HTTP_USER_AGENT'}=~/MSIE\s(\d)\.(\d)/i) {
		$version = $1;
	} elsif ($ENV{'HTTP_USER_AGENT'}=~/Mozilla\/(\d)\.(\d)/i) {
		$version = $1;
	}
	if (!$session->{request} || $DA::Vars::p->{compress_mode} eq 'off' || $version <= 4) {
		print DA::SmartPhone::get_content_header();
		print $outbuf;
	} elsif ($ENV{'HTTP_ACCEPT_ENCODING'} =~ /gzip/) {
		my $ex_charset=DA::Unicode::external_charset();
		$outbuf = Compress::Zlib::memGzip($outbuf);
		$session->{request}->print("Content-Encoding: gzip\n");
		$session->{request}->print("Content-length: " . length($outbuf) . "\n");
		$session->{request}->print("charset: $ex_charset\n");
		$session->{request}->print("Content-type: text/html\n\n");
		$session->{request}->print($outbuf);
	} else {
		my $ex_charset=DA::Unicode::external_charset();
		$session->{request}->print("Content-length: " . length($outbuf) . "\n");
		$session->{request}->print("charset: $ex_charset\n");
		$session->{request}->print("Content-type: text/html\n\n");
		$session->{request}->print($outbuf);
	}

	DA::SmartPhone::exit_process($session);
}

sub is_iframe {
	if ($ENV{'HTTP_USER_AGENT'} !~ /MSIE/i) {
		if ($ENV{'HTTP_USER_AGENT'}=~/Mozilla\/(\d)\.(\d)/i) {
			if ($1 < 5) { return(0); }
		}
	}
	return(1);
}

sub get_private_folder{
	my ($session,$param,$mode,$select)=@_;
# mode = 0   <option>タグ
# mode = 1   メッセージテキスト
# mode = 2   使用不可メッセージ

	my $result;
	if ( $mode eq '1'){
		if ($param eq 'off'){ return $result; }
		$result = b_("プライベート")."\n<dd>"
			.t_("個人用の登録先です。他ユーザはアクセスできません。")."</dd>";
	} elsif ( $mode eq '2'){
		if ($param ne 'off'){ return $result; }
		$result = "<font color=red>".t_("プライベートは使用できません。")
			."</font>";
	} else {
		if ($param eq 'off'){ return $result; }
		$result ="<option $select value=\"$session->{user}\">"
			.t_("プライベート")."</option>";
	}
	return $result;
}

sub get_files_size {
	my ($session, $list)	= @_;
	my ($sum, @list);

	if (ref($list) eq "ARRAY") {
		push (@list, @{$list});
	} else {
		push (@list, $list);
	}
	foreach my $l (@list) {
		next unless ($l);
		my @du = DA::System::bq_cmd("/usr/bin/du -s -k %1" , $l);
		foreach my $d (@du) {
			my ($size, $file) = split(/\s+/, $d, 2);

			if ($size =~ /^\d+$/) {
				$sum += $size;
			}
		}
	}

	return (int($sum));
}

sub get_user_quota_diff {
	my ($session, $mid, $func, $list, $start)	= @_;
	$mid ||= $session->{user};

	my $rest	= DA::IS::get_sys_custom($session, "restrict");
	my $quota	= DA::IS::get_master({ "user" => $mid }, "quota");

	my %r_key	= (
		"smart"		=> "sm_user_quota",
		"library"	=> "lib_user_quota",
		"fileshare"	=> "ow_user_quota"
	);

	if ($rest->{$r_key{$func}} ne "on") {
		return (0);
	}
	if (!$quota->{$func . "_user_size"} || $$quota->{$func . "_user_size"} eq "max") {
		return (0);
	}
	if ($mid >= $DA::Vars::p->{top_gid}) {
		return (0);
	}

	my $value;
	if (defined $start) {
		$value = &get_files_size($session, $list) - $start;
	} else {
		$value = &get_files_size($session, $list);
	}

	return ($value);
}

sub get_user_quota_size {
	my ($session, $mid)	= @_;

	$mid ||= $session->{user};

	my $rest	= DA::IS::get_sys_custom($session, "restrict");
	my $quota	= DA::IS::get_master({ "user" => $mid }, "quota");
	my $sql		= "SELECT smart,library,fileshare FROM is_user_quota WHERE mid=?";
	my $sth		= $session->{dbh}->prepare($sql);
	   $sth->bind_param(1, $mid, 3); $sth->execute();
	my ($smart, $library, $fileshare) = $sth->fetchrow(); $sth->finish();

	if ($rest->{sm_user_quota} eq "on") {
		if ($quota->{smart_user_size} && $quota->{smart_user_size} ne "max") {
			$quota->{smart_user_size} *= 1000;
			if ($smart eq "") {
				$quota->{smart_user_use} = DA::IS::remake_user_quota_size($session, $mid, "smart");
			} else {
				$quota->{smart_user_use} = $smart;
			}
		} else {
			$quota->{smart_user_size} = "max";
			$quota->{smart_user_use}  = 0;
		}
	} else {
		$quota->{smart_user_size}	= "max";
		$quota->{smart_user_use}	= 0;
	}
	if ($rest->{lib_user_quota} eq "on") {	
		if ($quota->{library_user_size} && $quota->{library_user_size} ne "max") {
			$quota->{library_user_size} *= 1000;
			if ($library eq "") {
				$quota->{library_user_use} = DA::IS::remake_user_quota_size($session, $mid, "library");
			} else {
				$quota->{library_user_use} = $library;
			}
		} else {
			$quota->{library_user_size} = "max";
			$quota->{library_user_use}  = 0;
		}
	} else {
		$quota->{library_user_size}	= "max";
		$quota->{library_user_use}	= 0;
	}
	if ($rest->{ow_user_quota} eq "on") {
		if ($quota->{fileshare_user_size} && $quota->{fileshare_user_size} ne "max") {
			$quota->{fileshare_user_size} *= 1000;
			if ($fileshare eq "") {
				$quota->{fileshare_user_use} = DA::IS::remake_user_quota_size($session, $mid, "fileshare");
			} else {
				$quota->{fileshare_user_use} = $fileshare;
			}
		} else {
			$quota->{fileshare_user_size} = "max";
			$quota->{fileshare_user_use}  = 0;
		}
	} else {
		$quota->{fileshare_user_size}	= "max";
		$quota->{fileshare_user_use}	= 0;
	}

	return ($quota);
}

sub set_users_quota_null {
	my ($session, $mid, $func)	= @_;
	my $rest	= DA::IS::get_sys_custom($session, "restrict");

	my %r_key	= (
		"smart"		=> "sm_user_quota",
		"library"	=> "lib_user_quota",
		"fileshare"	=> "ow_user_quota"
	);

	if ($rest->{$r_key{$func}} ne "on") {
		return (0);
	}

	my @mid;
	if (ref($mid) eq "ARRAY") {
		push (@mid, @{$mid});
	} else {
		if ($mid) {
			push (@mid, split(/\,/, $mid));
		} else {
			push (@mid, $session->{user});
		}
	}

	DA::Session::trans_init($session);
	eval {
		my $u_sql	= "UPDATE is_user_quota set $func=null WHERE mid=?";
		my $u_sth	= $session->{dbh}->prepare($u_sql);
		foreach my $m (@mid) {
			my $quota	= DA::IS::get_master({ "user" => $m }, "quota");
			if (!$quota->{$func . "_user_size"} || $quota->{$func . "_user_size"} eq "max") {
				next;
			}
			if ($m >= $DA::Vars::p->{top_gid}) {
				next;
			}
			if ($m eq $DA::Vars::p->{insuite_user}) {
				next;
			}
			if (!$m) {
				next;
			}
			$u_sth->bind_param(1, $m, 3);
			$u_sth->execute();
		}
		$u_sth->finish();
	};
	if (!DA::Session::exception($session)) {
		DA::Error::system_error($session);
	}

	return (0);
}

sub update_user_quota_size {
	my ($session, $mid, $func, $mode, $list, $inc)	= @_;
	$mid ||= $session->{user};

	my $rest	= DA::IS::get_sys_custom($session, "restrict");
	my $quota	= DA::IS::get_master({ "user" => $mid }, "quota");

	my %r_key	= (
		"smart"		=> "sm_user_quota",
		"library"	=> "lib_user_quota",
		"fileshare"	=> "ow_user_quota"
	);

	if ($rest->{$r_key{$func}} ne "on") {
		return (0);
	}
	if (!$quota->{$func . "_user_size"} || $quota->{$func . "_user_size"} eq "max") {
		return (0);
	}
	if ($mid >= $DA::Vars::p->{top_gid}) {
		return (0);
	}

	if ($mode eq "clear" || $mode eq "null") {
		DA::Session::trans_init($session);
		eval {
			my $s_sql	= "SELECT mid FROM is_user_quota WHERE mid=?";
			my $s_sth	= $session->{dbh}->prepare($s_sql);
			   $s_sth->bind_param(1, $mid, 3);
			   $s_sth->execute();
			my ($exist) = $s_sth->fetchrow(); $s_sth->finish();

			if ($exist) {
				if ($mode eq "clear") {
					my $u_sql	= "UPDATE is_user_quota SET $func=? WHERE mid=?";
					my $u_sth	= $session->{dbh}->prepare($u_sql);
					   $u_sth->bind_param(1, '0', 3);
					   $u_sth->bind_param(2, $mid, 3);
					   $u_sth->execute();
					   $u_sth->finish();
				} else {
					my $u_sql	= "UPDATE is_user_quota set $func=null WHERE mid=?";
					my $u_sth	= $session->{dbh}->prepare($u_sql);
					   $u_sth->bind_param(1, $mid, 3);
					   $u_sth->execute();
					   $u_sth->finish();
				}
			}
		};
		if (!DA::Session::exception($session)) {
			DA::Error::system_error($session);
		}
	} elsif ($mode eq "remake") {
		DA::IS::remake_user_quota_size($session, $mid, $func);
	} else {
		my $sum;
		if ($mode eq "inc") {
			$sum = $inc;
		} else {
			$sum = DA::IS::get_files_size($session, $list);
			$sum = ($mode eq "del") ? $sum * (-1) : $sum;
		}

		my $remake;
		DA::Session::trans_init($session);
		eval {
			my $s_sql	= "SELECT mid,$func FROM is_user_quota WHERE mid=?";
			my $s_sth	= $session->{dbh}->prepare($s_sql);
			   $s_sth->bind_param(1, $mid, 3);
			   $s_sth->execute();
			my ($exist, $total) = $s_sth->fetchrow(); $s_sth->finish();

			if ($total eq "") {
				$remake = 1;
			} else {
				$total = ($total + $sum < 0) ? 0 : ($total + $sum);

				my $u_sql	= ($exist) ?
								"UPDATE is_user_quota SET $func=? WHERE mid=?"
							:	"INSERT INTO is_user_quota ($func,mid) VALUES (?,?)";
				my $u_sth	= $session->{dbh}->prepare($u_sql);
				   $u_sth->bind_param(1, $total, 3);
				   $u_sth->bind_param(2, $mid, 3);
				   $u_sth->execute();
				   $u_sth->finish();
			}
		};
		if (!DA::Session::exception($session)) {
			DA::Error::system_error($session);
		}
		if ($remake) {
			DA::IS::remake_user_quota_size($session, $mid, $func);
		}
	}

	return (0);
}

sub remake_user_quota_size {
	my ($session, $mid, $target)	= @_;

	my $insert_sql	= sub {
		my ($func)	= @_;
		return ("INSERT INTO is_user_quota ($func,mid) VALUES (?,?)");
	};
	my $update_sql	= sub {
		my ($func)	= @_;
		return ("UPDATE is_user_quota SET $func=? WHERE mid=?");
	};

	my @mid;
	if (ref($mid) eq "ARRAY") {
		push (@mid, @{$mid});
	} else {
		if (lc($mid) eq "all") {
            my $sql = "SELECT mid FROM is_member";
            my $sth = $session->{dbh}->prepare($sql);
            $sth->execute();

            while (my ($mid) = $sth->fetchrow) {
                $mid =~ s/^\s+//g; $mid =~ s/\s+$//g;
                push (@mid, $mid);
            }
            $sth->finish();
		} else {
			push (@mid, split(/\,/, $mid));
		}
	}

    my %check;
    {
        my $sql = "SELECT mid FROM is_user_quota";
        my $sth = $session->{dbh}->prepare($sql);
           $sth->execute();
        while (my ($mid) = $sth->fetchrow) {
            $mid =~ s/^\s+//g; $mid =~ s/\s+$//g;
            $check{$mid} = 1;
        }
        $sth->finish();
    }

    if ($target =~ /^(all|smart|smartpage)$/) {
        DA::Session::trans_init($session);
        eval {

        my $i_sql   = $insert_sql->("smart");
        my $i_sth   = $session->{dbh}->prepare($i_sql);
        my $u_sql   = $update_sql->("smart");
        my $u_sth   = $session->{dbh}->prepare($u_sql);

        foreach my $m (@mid) {
            next if (!$m);
            next if ($m eq $DA::Vars::p->{insuite_user});

            my $total = 0;

            for (my $i = 0; $i < 10; $i ++) {
                my $table   = "is_sm_file_$i";
                my $sql     = "SELECT sum(quota_size) FROM $table WHERE mid=?";
                my $sth     = $session->{dbh}->prepare($sql);
                   $sth->bind_param(1, $m, 3);
                   $sth->execute();
                my ($size)  = $sth->fetchrow(); $sth->finish();

                $total += $size;
            }

            if ($check{$m}) {
                $u_sth->bind_param(1, $total, 3);
                $u_sth->bind_param(2, $m, 3);
                $u_sth->execute();
            } else {
                $i_sth->bind_param(1, $total, 3);
                $i_sth->bind_param(2, $m, 3);
                $i_sth->execute();

                $check{$m} = 1;
            }
        }

        $i_sth->finish();
        $u_sth->finish();

        };
        if (!DA::Session::exception($session)){
			DA::Error::system_error($session);
        }
    }

    if ($target =~ /^(all|library)$/) {
        DA::Session::trans_init($session);
        eval {

        my $i_sql   = $insert_sql->("library");
        my $i_sth   = $session->{dbh}->prepare($i_sql);
        my $u_sql   = $update_sql->("library");
        my $u_sth   = $session->{dbh}->prepare($u_sql);

        foreach my $m (@mid) {
            next if (!$m);
            next if ($m eq $DA::Vars::p->{insuite_user});

            my $total = 0;

            # style = 1: ウェブページ形式
            # style = 2: テキスト形式
            # style = 4: ファイル保存形式
			# style = 6: コミュニティフォルダ形式

			# 改定履歴のサイズはオリジナルの QUOTA に含まれる
            for (my $i = 0; $i < 10; $i ++) {
                my $table_d = "is_lib_folder";
                my $table_f = "is_lib_file_$i";
                my $sql     = "SELECT sum(f.quota_size) FROM $table_d d,$table_f f"
                            . " WHERE d.bid=f.bid AND d.style IN (1,2,4,6) AND f.mid=?";
                my $sth     = $session->{dbh}->prepare($sql);
                   $sth->bind_param(1, $m, 3);
                   $sth->execute();
                my ($size)  = $sth->fetchrow(); $sth->finish();

                $total += $size;
            }
 
            if ($check{$m}) {
                $u_sth->bind_param(1, $total, 3);
                $u_sth->bind_param(2, $m, 3);
                $u_sth->execute();
            } else {
                $i_sth->bind_param(1, $total, 3);
                $i_sth->bind_param(2, $m, 3);
                $i_sth->execute();

                $check{$m} = 1;
            }
        }

        $i_sth->finish();
        $u_sth->finish();

        };
        if (!DA::Session::exception($session)){
			DA::Error::system_error($session);
        }
    }

    if ($target =~ /^(all|fileshare)$/) {
        DA::Session::trans_init($session);
        eval {

        my $i_sql   = $insert_sql->("fileshare");
        my $i_sth   = $session->{dbh}->prepare($i_sql);
        my $u_sql   = $update_sql->("fileshare");
        my $u_sth   = $session->{dbh}->prepare($u_sql);

        foreach my $m (@mid) {
            next if (!$m);
            next if ($m eq $DA::Vars::p->{insuite_user});

            my $total = 0;

            for (my $i = 0; $i < 10; $i ++) {
                my $table_d = "is_ow_folder";
                my $table_f = "is_ow_file_$i";
                my $sql     = "SELECT sum(f.quota_size) FROM $table_d d,$table_f f"
                            . " WHERE d.bid=f.bid AND f.mid=?";
                my $sth     = $session->{dbh}->prepare($sql);
                   $sth->bind_param(1, $m, 3);
                   $sth->execute();
                my ($size)  = $sth->fetchrow(); $sth->finish();

                $total += $size;
            }

            if ($check{$m}) {
                $u_sth->bind_param(1, $total, 3);
                $u_sth->bind_param(2, $m, 3);
                $u_sth->execute();
            } else {
                $i_sth->bind_param(1, $total, 3);
                $i_sth->bind_param(2, $m, 3);
                $i_sth->execute();

                $check{$m} = 1;
            }
        }

        $i_sth->finish();
        $u_sth->finish();

        };
        if (!DA::Session::exception($session)){
			DA::Error::system_error($session);
        }
    }

	return (0)
}

sub check_user_quota {
	my ($session, $func, $plus, $minus)	= @_;
	my $quota	= DA::IS::get_user_quota_size($session);
	my $result	= 0;

	if ($quota->{$func . "_user_size"} && $quota->{$func . "_user_size"} ne "max") {
		my $diff = 0;

		if ($plus) {
			$diff += DA::IS::get_files_size($session, $plus);
		}
		if ($minus) {
			$diff -= DA::IS::get_files_size($session, $minus);
		}

		if ($quota->{$func . "_user_size"} < $quota->{$func . "_user_use"} + $diff) {
			$result	= 0;
		} else {
			$result = 1;
		}
	} else {
		$result = 1;
	}

	return ($result);
}

sub get_quota_size {
	my ($session,$quota,$gid,$key)=@_;
	my $max_size;
	if ($gid eq $session->{user}) {
    	$max_size=$quota->{"$key\_private_size"};
	} else {
    	$max_size=$quota->{"$key\_group_size"};
	}
	my $g_max_size;
	for (my $i=1; $i<6; $i++) {
		my $s_index="$key\_ex$i\_size";
		my $g_index="$key\_ex$i\_group";
		next if (!$quota->{$g_index});
		$quota->{$g_index}=~s/\,/\|/g;
		$quota->{$s_index}='max' if (!$quota->{$s_index});
		if ($gid =~ /^($quota->{$g_index})$/) {
			if ($quota->{$s_index} eq 'max') { $g_max_size='max'; }
			if ($g_max_size ne 'max' && $quota->{$s_index} > $g_max_size) {
				$g_max_size=$quota->{$s_index};
			}
		}
	}
	if ($g_max_size) { $max_size=$g_max_size; }
	if (!$max_size) { $max_size='max'; }
	return ($max_size);
}

sub quota_check {
	my ($session,$gid,$key,$plus,$minus,$nouser)=@_;
	# $plus/$minus : 追加するディレクトリ／ファイルのパス名／サイズ
	# $plus/$minus に数値を指定した場合は du を実行しない

	my $quota=DA::IS::get_sys_custom($session,'quota');
	my $max_size=DA::IS::get_quota_size($session,$quota,$gid,$key);
	my $result;

	if ($max_size eq 'max') {
		$result = 1;
	} else {
		my $size;
		if ($key eq 'fileshare') {
			my $sql="SELECT sum(quota_size) FROM is_ow_folder WHERE gid=?";
			my $sth=$session->{dbh}->prepare($sql); 
			   $sth->bind_param(1,$gid,3); $sth->execute();
			$size=$sth->fetchrow; $sth->finish;
		} elsif ($key eq 'library') {
			my $sql="SELECT sum(quota_size) FROM is_lib_folder WHERE gid=?";
			my $sth=$session->{dbh}->prepare($sql); 
			   $sth->bind_param(1,$gid,3); $sth->execute();
			$size=$sth->fetchrow; $sth->finish;
		} elsif ($key eq 'smart') {
			my $table=DA::Smart::get_table_names($gid);
			my $sql="SELECT sum(quota_size) FROM $table->{file} WHERE gid=?";
			my $sth=$session->{dbh}->prepare($sql); 
			   $sth->bind_param(1,$gid,3); $sth->execute();
			$size=$sth->fetchrow; $sth->finish;
		}

		# 追加されるファイルまたはディレクトリの絶対パス名
		if (ref($plus) eq 'ARRAY' && @$plus) {
			foreach my $key (@$plus) {
                if (-e $key) {
                    my $du=DA::System::bq_cmd("/usr/bin/du -s -k %1", $key);
                    my ($plus_size)=split(/\s+/,$du,2);
                    $size=$size+int($plus_size);
                }
			}
		} elsif ($plus =~ /^\d+$/) {
            $size=$size+int($plus);
		} elsif ($plus) {
          	if (-e $plus) {
                my $du=DA::System::bq_cmd("/usr/bin/du -s -k %1", $plus);
                my ($plus_size)=split(/\s+/,$du,2);
                $size=$size+int($plus_size);
            }
		}
		# 削除されるファイルまたはディレクトリの絶対パス名
		if (ref($minus) eq 'ARRAY' && @$minus) {
			foreach my $key (@$minus) {
		   	 	if (-e $key) {
            		my $du=DA::System::bq_cmd("/usr/bin/du -s -k %1", $key);
            		my ($minus_size)=split(/\s+/,$du,2);
            		$size=$size-int($minus_size);
        		}
			}
		} elsif ($minus =~ /^\d+$/) {
            $size=$size-int($minus);
		} elsif ($minus) {
        	if (-e $minus) {
            	my $du=DA::System::bq_cmd("/usr/bin/du -s -k %1", $minus);
            	my ($minus_size)=split(/\s+/,$du,2);
            	$size=$size-int($minus_size);
        	}
		}
		if ($size > $max_size*1000) { 
			$result = 0;
		} else {
			$result = 1;
		}
	}

	if ($nouser) {
		return ($result); 
	} else {
		if ($result) {
			if (DA::IS::check_user_quota($session,$key,$plus,$minus)) {
				return (1);
			} else {
				return (0);
			}
		} else {
			return (0);
		}
	}
}

sub get_sp_view_permit {
	my ($session,$mode,$gid,$owner,$rest,$join,$owner_group,$manager)=@_;
	# 特権ユーザの閲覧権限チェック
	# $mode = sm,ow,lib,fa,wf
	# プライベートフォルダは特権ユーザ権限の対象外
	if ($gid < $DA::Vars::p->{top_gid}) { return(0); }
    # ユーザタイプが 3,4 の場合は権限なしとする
    if ($session->{type}=~/[34]/) { return(0); }

	if (!$rest) { $rest=DA::IS::get_sys_custom($session,"restrict"); }

	if ($mode eq 'fa'){
		if(DA::IS::check_owner($session,{},$gid,2)) { return(1); }
	} elsif ($mode eq 'bd'){
		if(DA::IS::check_owner($session,{},$gid,13)) { return(1); }
	} else {
		if ($rest->{"$mode\_admin_view"} eq 'on') {
            if ($session->{admin}) {
                if ($session->{limited_admin}) {
                    if (DA::IS::is_ctrlable_group($session, $gid)) {
                        return(1);
                    }
                } else {
                    return(1);
                }
            }
		}
    	if ($rest->{"$mode\_f_owner_view"} eq 'on') {
        	if ($owner eq $session->{user}) { return(1); }
        	if ($mode eq 'lib' && $manager){
        		if (!$join) { $join=DA::IS::get_join_group($session,$session->{user},1); }
				if (DA::IS::is_up_member($session,$session->{user},
					$manager,$join)) {
					return(1);
       			}
			}
    	}
		if ($rest->{"$mode\_g_owner_view"} eq 'on') {
			if ($mode eq 'wf') {
				if(DA::IS::check_owner($session,$owner_group,$gid,'11')) {
					return(1); 
				}
			} else {
				if(DA::IS::check_owner($session,$owner_group,$gid,'document')) {
					return(1); 
				}
			}
		}
		# 上位グループに所属するユーザに閲覧権限を与えるオプション
		if ($rest->{"$mode\_upper_view"} eq 'on') {
         	if ($join->{$gid}->{attr} =~ /^[D]$/) { return (1); }
		}
	}
	return (0);
}

sub get_sp_delete_permit {
	my ($session,$mode,$gid,$owner,$rest,$join,$owner_group,$manager)=@_;
	# 特権ユーザの削除権限チェック
	# $mode = sm,ow,lib,wf
	# プライベートフォルダは特権ユーザ権限の対象外
	if ($gid < $DA::Vars::p->{top_gid}) { return(0); }
    # ユーザタイプが 3,4 の場合は権限なしとする
    if ($session->{type}=~/[34]/) { return(0); }

	if (!$rest) { $rest=DA::IS::get_sys_custom($session,"restrict"); }
    if ($rest->{"$mode\_admin_delete"} eq 'on') {
		if (DA::IS::is_real_admin($session,$gid)) {
            return(1);
        }
    }
    if ($rest->{"$mode\_f_owner_delete"} eq 'on') {
        if ($owner eq $session->{user}) { return(1); }
        if ($mode eq 'lib' && $manager){
        	if (!$join) {
				$join=DA::IS::get_join_group($session,$session->{user},1);
			}
			if (DA::IS::is_up_member($session,$session->{user},$manager,$join)) {
				return(1);
       		}
		}
    }
    if ($rest->{"$mode\_g_owner_delete"} eq 'on') {
		if ($mode eq 'wf') {
        	if (DA::IS::check_owner($session,$owner_group,$gid,'11')) { 
				return(1); 
			}
		} else {
        	if (DA::IS::check_owner($session,$owner_group,$gid,'document')) { 
				return(1); 
			}
		}
    }
    return (0);
}

sub get_sp_update_permit {
	my ($session,$mode,$gid,$owner,$rest,$join,$owner_group,$manager)=@_;
	# 特権ユーザの更新権限チェック
	# $mode = wf
	# プライベートフォルダは特権ユーザ権限の対象外
	if ($gid < $DA::Vars::p->{top_gid}) { return(0); }
    # ユーザタイプが 3,4 の場合は権限なしとする
    if ($session->{type}=~/[34]/) { return(0); }

	if (!$rest) { $rest=DA::IS::get_sys_custom($session,"restrict"); }
	if (!$join) { $join=DA::IS::get_join_group($session,$session->{user},1); }

	# 管理権限ユーザ
    if ($rest->{"$mode\_admin_update"} eq 'on') {
		if (DA::IS::is_real_admin($session,$gid)) {
            return(1); 
        }
    }
	# フォルダオーナ
    if ($rest->{"$mode\_f_owner_update"} eq 'on') {
        if ($owner eq $session->{user}) { return(1); }
        if ($mode eq 'lib' && $manager){
        	if (!$join) {
				$join=DA::IS::get_join_group($session,$session->{user},1);
			}
			if (DA::IS::is_up_member($session,$session->{user},
				$manager,$join)) {
				return(1);
       		}
		}
    }
	# グループオーナー
    if ($rest->{"$mode\_g_owner_update"} eq 'on') {
		if ($mode eq 'wf') {
			# データ登録権限のオーナー権限ありを優先させる
    		if ($rest->{wf_owner}) {
        		if (DA::IS::check_owner($session,$owner_group,$gid,'11')) { 
					return(1); 
				}
			}
		} else {
        	if (DA::IS::check_owner($session,$owner_group,$gid,'document')) { 
				return(1); 
			}
		}
    }
    return (0);
}

sub get_holiday_list{
    my($session,$start,$end,$mode)=@_;
# start = YYYY
# end   = YYYY or undef
    if ($start!~/^\d{4}$/o || ($end && $end !~/^\d{4}$/o)){return;}
    my $s_year = substr($start,0,4);
    my $e_year = ($end) ? substr($end,0,4) : $s_year;
    if ($s_year > $e_year){return;}
    my $h_list={};
    my $wday_list={};
    my @years;
    for (my $ix=$s_year;$ix<=$e_year;$ix++){
        push(@years,$ix);
    }
    my $cal=DA::IS::get_sys_custom_db($session,'calendar');
	if(!$session->{calendar_code}){
	    $session->{calendar_code}=$cal->{def};
	}elsif(!$cal->{$session->{calendar_code}}){
	    $session->{calendar_code}=$cal->{def};
    }
    my $sub_list={}; 

    my $sql ="SELECT type,rule,holiday,substitute,substitute2,exp,dstart,dend,"
            ."wday,bymonth,bymonthday,byday,bysetpos,memo,color,u_code "
            ."FROM is_calendar WHERE u_code=?";
    if(!$mode){
        $sql.=" OR u_code=?";
    }
    $sql.=" ORDER BY u_code,type,num";
    my $sth=$session->{dbh}->prepare("$sql");
    $sth->bind_param(1,$session->{calendar_code},3);
    $sth->bind_param(2,$session->{user},3) if (!$mode);
    $sth->execute();
    while(my($type,$rule,$holiday,$sub,$sub2,$exp,$dstart,$dend,$wday,$bymonth,
             $bymonthday,$byday,$bysetpos,$memo,$color,$u_code)=$sth->fetchrow){
        my $ds_year = substr($dstart,0,4);
        my $de_year = substr($dend,0,4);
        if ($s_year > $de_year || $e_year < $ds_year){ next; }
        my $s_ym = sprintf("%04d%02d",substr($dstart,0,4),
                                     substr($dstart,5,2));
        my $e_ym = sprintf("%04d%02d",substr($dend,0,4),
                                     substr($dend,5,2));
        my(@wday_data)=split(/\,/,$wday);
        foreach my $year(@years){
            if ($ds_year <= $year && $year <= $de_year){
                if ($type == 1){
                    for (my $m=1;$m<=12;$m++){
                        my $yymm = sprintf("%04d%02d",$year,$m);
                        if ($yymm < $s_ym){next;}
                        if ($e_ym < $yymm){last;}
                        my $mm = sprintf("%02d",$m);
                        @{$wday_list->{$year}->{$mm}} =@wday_data;
                    }
                    next;
                }
                $memo = T_("$memo");
                my $holiday_name = DA::CGIdef::encode($memo,1,1,'euc');
                my $md = sprintf("%02d",$bymonth);
                my $day;
                if ($rule == 2){
                    $day = $bymonthday;
                } elsif ($rule == 3){
                    if ($byday > 6 || $bysetpos < 1){next;}
                    if ($byday == 0){$byday = 7;}
                    if ($bysetpos == 9){
                        my $last=Date::Calc::Days_in_Month($year,$bymonth);
                        for(my $x=0;$x<7;$x++){
                            my $w=Date::Calc::Day_of_Week($year,$bymonth,$last);
                            if($w == $byday){last;}
                            $last--;
                        }
                        $day = $last;
                    } else {
                        my($y,$m,$d)=Date::Calc::Nth_Weekday_of_Month_Year(
                                            $year,$bymonth,$byday,$bysetpos);
                        $day = $d;
                    }
                } else {
                    next;
                }
                $md .= sprintf("%02d",$day);
                if (!Date::Calc::check_date($year,$bymonth,$day)){next;}
                my($dow)=Date::Calc::Day_of_Week($year,$bymonth,$day);
                if ($holiday && $exp){
                    if ($dow eq '7'){
                        next;
                    } elsif ($dow eq '1'){
                        if ($h_list->{$year}->{$md}->{holiday}){next;}
                    }
                }
                if($h_list->{$year}->{$md}->{name}){
                    $h_list->{$year}->{$md}->{name}.="<br>$holiday_name";
                }else{
                    $h_list->{$year}->{$md} ={  'u_code'   => $u_code,
                                                'holiday'  => $holiday,
                                                'name'     => $holiday_name,
                                                'color'    => $color,
                                                'type'     => $type,
                                                'dow'      => $dow };
                }

###
                # 振替えの情報
                if ($holiday && ($sub || $sub2)) {
                    $sub_list->{$year}->{$md} = { 
                        'sub'      => $sub,
                        'sub2'     => $sub2,
                        'u_code'   => $u_code,
                        'name'     => $holiday_name,
                        'color'    => $color,
                        'dow'      => $dow,
                        'bymonth'  => $bymonth,
                        'day'      => $day,
                        'type'     => $type,
                    };
                }
            }
        }
    }
    $sth->finish();

    foreach my $year (@years) {
        foreach my $md (keys %{$sub_list->{$year}}) {
            my $name    = $sub_list->{$year}->{$md}->{name};
            my $dow     = $sub_list->{$year}->{$md}->{dow};
            my $bymonth = $sub_list->{$year}->{$md}->{bymonth};
            my $day     = $sub_list->{$year}->{$md}->{day};
            my $color   = $sub_list->{$year}->{$md}->{color};
            my $u_code  = $sub_list->{$year}->{$md}->{u_code};
            my $type    = $sub_list->{$year}->{$md}->{type};
            my $sub     = $sub_list->{$year}->{$md}->{sub};
            my $sub2    = $sub_list->{$year}->{$md}->{sub2};

            # 新法律では 祝日と祝日の間は休日となる(2009年以降。V2.3)
            if (2009<=$year && $type eq '2') {
                # 1 日後
                my($y,$m,$d) = Date::Calc::Add_Delta_Days($year,$bymonth,$day,1);
                my $md = sprintf("%02d%02d",$m,$d);

                # 2 日後
                my($y_2,$m_2,$d_2) = Date::Calc::Add_Delta_Days($year,$bymonth,$day,2);
                my $md_2 = sprintf("%02d%02d",$m_2,$d_2);

                if((!exists $h_list->{$y}->{$md} || !$h_list->{$y}->{$md}->{holiday}) &&
                   (!exists $h_list->{$y}->{$md} || $h_list->{$y}->{$md}->{type} ne '2') &&
                   (exists $h_list->{$y_2}->{$md_2} && $h_list->{$y_2}->{$md_2}->{type} eq '2')){

                    my $new_dow = ($dow==7) ? 1 : $dow+1;
                    if($h_list->{$y}->{$md}->{name}){
                        $h_list->{$y}->{$md}={ 'holiday' => 1,
                                               'name'    => $h_list->{$y}->{$md}->{name}."<br>"
                                                           .t_('休日'),
                                               'color'   => $color,
                                               'dow'     => $new_dow };
                    }else{
                        $h_list->{$y}->{$md}={ 'u_code'  => $u_code,
                                               'holiday' => 1,
                                               'name'    => t_('休日'),
                                               'color'   => $color,
                                               'dow'     => $new_dow };
                    }
                }
            }

            # 日曜の振替え
            if ($sub && $dow eq '7') {

                my($y,$m,$d)=Date::Calc::Add_Delta_Days($year,$bymonth,$day,1);
                $md = sprintf("%02d%02d",$m,$d);
                my $new_dow = 1;

                # 2007 年以降の祝祭日は、その日後の祝祭日でない日が振替え休日(V2.1)
                if (2007<=$year && $type eq '2') {
                    while ($h_list->{$y}->{$md}->{type} eq '2') {
                        ($y,$m,$d)=Date::Calc::Add_Delta_Days( $y,$m,$d,1);
                        $md = sprintf("%02d%02d",$m,$d);
                        $new_dow = ($new_dow==7) ? 1 : $new_dow+1; 
                    }
                }
                if(!$h_list->{$y}->{$md}->{holiday}){
                    if($h_list->{$y}->{$md}->{name}){
                        $h_list->{$y}->{$md}={ 'holiday' => 1,
                                               'name'    => $h_list->{$y}->{$md}->{name}."<br>"
                                                           .t_('振替休日'),
                                               'color'   => $color,
                                               'dow'     => $new_dow };
                    }else{
                        $h_list->{$y}->{$md}={ 'u_code'  => $u_code,
                                               'holiday' => 1,
                                               'name'    => t_('振替休日'),
                                               'color'   => $color,
                                               'dow'     => $new_dow };
                    }
                }
            }

            # 土曜の振替え
            if ($sub2 && $dow eq '6'){
                my($y,$m,$d)=Date::Calc::Add_Delta_Days($year,$bymonth,$day,-1);
                $md = sprintf("%02d%02d",$m,$d);
                if(!$h_list->{$y}->{$md}->{holiday}){
                    if($h_list->{$y}->{$md}->{name}){
                        $h_list->{$y}->{$md}={ 'holiday' => 1,
                                               'name'    => $h_list->{$y}->{$md}->{name}."<br>"
                                                           .t_('振替休日'),
                                               'color'   => $color,
                                               'dow'     => 5 };
                    }else{
                        $h_list->{$y}->{$md}={ 'u_code'  => $u_code,
                                               'holiday' => 1,
                                               'name'    => t_('振替休日'),
                                               'color'   => $color,
                                               'dow'     => 5 };
                    }
                }
            }
        }
    }

    return ($h_list,$wday_list);
}

sub get_group_member_data{
	my($session,$gid,$attr,$msid)=@_;
    # $attr : 1 = プライマリ所属ユーザ
    #         2 = セカンダリ所属ユーザ
    #         3 = プライマリ・オーナー
    #         4,6 = セカンダリ・オーナー
    #         5 = ????

    # $gid に配列参照を指定することもできるように変更
    my $gid_where;
    if (ref($gid) eq 'ARRAY') {
        foreach my $id (@{$gid}) {
            $gid_where.=($gid_where) ? ",$id" : $id;
        }
        if ($gid_where) { $gid_where="gm.gid IN ($gid_where) AND "; }
    } elsif ($gid) {
        $gid_where="gm.gid=$gid AND ";
    }
    if (!$gid_where) { return {}; }

    my @attrs = split(//,$attr);
    my($where,$group);
    foreach my $a(@attrs){
        if($a == 5){
            $group.=",\'$a\'";
        }elsif($a == 6 || $a == 4){
            $group.=",\'$a\'";
            $where.=",\'$a\'";
        }elsif($a){
            $where.=",\'$a\'";
        }
    }
    $group=~s/^\,//;
    $where=~s/^\,//;
	my $list_data={};
	my $data={};
	my %no;
	if($group){
        my $sql ="SELECT g.gid,g.name,g.alpha,gm.attr,g.type,g.org_type,"
          ."g.grade,gm.auth_type,"
          ."gm.owner01,gm.owner02,gm.owner03,gm.owner04,gm.owner05,"
          ."gm.owner06,gm.owner07,gm.owner08,gm.owner09,gm.owner10,"
          ."gm.owner11,gm.owner12,gm.owner13,gm.owner14,gm.owner15,"
          ."gm.owner16,gm.owner17,gm.owner18,gm.owner19,gm.owner20 "
          ."FROM @{[DA::IS::get_master_table($session, 'is_group_member', $msid)]} gm, @{[DA::IS::get_group_table($session, undef, $msid)]} g "
          ."WHERE $gid_where gm.mid=g.gid AND gm.attr IN ($group) "
          ."ORDER BY g.type,g.grade,g.sort_level,upper(g.kana)";
		my $sth=$session->{dbh}->prepare($sql);
		$sth->execute();
        while(my($id,$name,$alpha,$attr,$type,$org_type,$grade,$auth_type,$ow01,$ow02,$ow03,$ow04,$ow05,$ow06,$ow07,$ow08,$ow09,$ow10,$ow11,$ow12,$ow13,$ow14,$ow15,$ow16,$ow17,$ow18,$ow19,$ow20)=$sth->fetchrow) {
            $name=DA::IS::check_view_name($session,$name,$alpha);
            my $v_name =DA::IS::get_ug_name($session,0,$id,$type,$name,'',$grade,'',$org_type,undef,$msid);
            if($attr eq '5'){
                my $user = sprintf("%06d:$id:$v_name->{usel}",++$no{1});
                $data->{USERSEL}->{$id}=$user;
            }elsif($attr eq '4' || $attr eq '6'){
                my $user = sprintf("%06d:$id:$v_name->{usel}",++$no{4});
                $data->{SO_USERSEL}->{$id}=$user;
                $data->{SOWNER_ATTR}->{$id}=$attr;
                $data->{SOWNER_TYPE}->{$id}=$auth_type;
                $data->{SOWNER_AUTH}->{$id}="$ow01,$ow02,$ow03,$ow04,$ow05,"
                                           ."$ow06,$ow07,$ow08,$ow09,$ow10,"
                                           ."$ow11,$ow12,$ow13,$ow14,$ow15,"
                                           ."$ow16,$ow17,$ow18,$ow19,$ow20";
            }
			$list_data->{$id}=$data;
		}
		$sth->finish;
	}
	if($where){
        my $sql ="SELECT m.mid,m.name,m.alpha,gm.attr,m.type,gm.auth_type,"
          ."m.primary_gname,m.primary_galpha,m.primary_gtype,gm.gid,"
          ."gm.owner01,gm.owner02,gm.owner03,gm.owner04,gm.owner05,"
          ."gm.owner06,gm.owner07,gm.owner08,gm.owner09,gm.owner10,"
          ."gm.owner11,gm.owner12,gm.owner13,gm.owner14,gm.owner15,"
          ."gm.owner16,gm.owner17,gm.owner18,gm.owner19,gm.owner20 "
          ."FROM @{[DA::IS::get_master_table($session, 'is_group_member', $msid)]} gm, @{[DA::IS::get_member_table($session, undef, $msid)]} m "
          ."WHERE $gid_where gm.mid=m.mid AND gm.attr IN ($where) "
          ."ORDER BY m.type,m.sort_level,upper(m.kana)";
		my $sth=$session->{dbh}->prepare($sql);
		$sth->execute();
        while(my($mid,$name,$alpha,$attr,$type,$auth_type,$gname,$galpha,$gtype,$id,$ow01,$ow02,$ow03,$ow04,$ow05,$ow06,$ow07,$ow08,$ow09,$ow10,$ow11,$ow12,$ow13,$ow14,$ow15,$ow16,$ow17,$ow18,$ow19,$ow20)=$sth->fetchrow) {
            $name=DA::IS::check_view_name($session,$name,$alpha);
            $gname=DA::IS::check_view_name($session,$gname,$galpha);
            my $v_name =DA::IS::get_ug_name($session,0,$mid,$type,$name,$gname,'','',$gtype,undef,$msid);
            my $user = sprintf("%06d:$mid:$v_name->{usel}",++$no{$attr});
            if($attr eq '1'){
                $data->{USERSEL}->{$mid}=$user;
				$list_data->{$id}->{USERSEL}->{$mid}=$user;
            }elsif($attr eq '2'){
                $data->{S_USERSEL}->{$mid}=$user;
				$list_data->{$id}->{S_USERSEL}->{$mid}=$user;
            }elsif($attr eq '3'){
                $data->{PO_USERSEL}->{$mid}=$user;
				$list_data->{$id}->{PO_USERSEL}->{$mid}=$user;
            }elsif($attr eq '4' || $attr eq '6'){
                $data->{SO_USERSEL}->{$mid}=$user;
				$list_data->{$id}->{SO_USERSEL}->{$mid}=$user;
                $data->{SOWNER_ATTR}->{$mid}=$attr;
				$list_data->{$id}->{SOWNER_ATTR}->{$mid}=$attr;
                $data->{SOWNER_TYPE}->{$mid}=$auth_type;
				$list_data->{$id}->{SOWNER_TYPE}->{$mid}=$auth_type;
                $data->{SOWNER_AUTH}->{$mid}="$ow01,$ow02,$ow03,$ow04,$ow05,"
                                           ."$ow06,$ow07,$ow08,$ow09,$ow10,"
                                           ."$ow11,$ow12,$ow13,$ow14,$ow15,"
                                           ."$ow16,$ow17,$ow18,$ow19,$ow20";
                $list_data->{$id}->{SOWNER_AUTH}->{$mid}=
										    "$ow01,$ow02,$ow03,$ow04,$ow05,"
                                           ."$ow06,$ow07,$ow08,$ow09,$ow10,"
                                           ."$ow11,$ow12,$ow13,$ow14,$ow15,"
                                           ."$ow16,$ow17,$ow18,$ow19,$ow20";
            }
		}
		$sth->finish;
	}

    if (ref($gid) eq 'ARRAY') {
        return $list_data;
    } else {
        return $data;
    }
}

sub get_all_user_list{
	my($session,$gid,$mode,$type,$msid,$conf)=@_;
#指定したグループのユーザ一覧を取得する。
#$mode = 0 midの一覧をLISTで返す。
#       1 emailの一覧をLISTで返す。
#$type = 対象となるユーザタイプ ex('1,2')
#$conf->{sort} = 1 type,sort_level,upper(kana) でソートする
#$conf->{keyword} = 絞込みキーワード
#$conf->{view} = 1 検索対象をビューにする
	my ($sort, $keyword, $view);
	if ($conf) {
		$sort = $conf->{sort};
		$keyword = $conf->{keyword};
		$keyword = DA::Unicode::trim($keyword);
		$view = $conf->{view};
	}

	my $member_table_mm = DA::IS::get_member_table($session, $view ? undef : "TBL", $msid);
	my $gp_table = DA::IS::get_master_table($session, "is_group_path", $msid);
	my $gm_table = DA::IS::get_master_table($session, "is_group_member", $msid);

	my($sql,$sth);
	my $user_list=[];
	if (!$type){ $type ="1"; }
	if ($mode){
		$sql ="SELECT m.email ";
	} else {
		$sql ="SELECT m.mid ";
	}

	my $order;
	if ($sort) {
		$order = " ORDER BY m.type,m.sort_level,upper(m.kana)";
	}
	my ($k_where, $k_like);
	if ($keyword ne "") {
		my ($word, $esc, $space, $like) = DA::IS::escape_sql_keyword_with_filter($keyword, "zs2hs|uc");
		$k_where = " AND ((replace(upper(name),'$space',' ') LIKE ? escape '$esc')"
		         . " OR (replace(upper(kana),'$space',' ') LIKE ? escape '$esc')"
		         . " OR (replace(upper(alpha),'$space',' ') LIKE ? escape '$esc'))";
		$k_like = $like;
	}
	if ($gid == $DA::Vars::p->{top_gid}){
		$sql.="FROM $member_table_mm m WHERE m.type IN ($type) $k_where $order";
		$sth = $session->{dbh}->prepare($sql);
		if ($k_where ne "") {
			$sth->bind_param(1, $k_like, 1);
			$sth->bind_param(2, $k_like, 1);
			$sth->bind_param(3, $k_like, 1);
		}
    } else {
		my @gm_mids = DA::IS::get_attr5_ids($session,$gid,$msid);
		my $re_mid = DA::IS::make_large_in_phrase($session, \@gm_mids, 'real_gid', 500);
		my $gm_mid = DA::IS::make_large_in_phrase($session, \@gm_mids, 'gm.gid', 500);
		if ($re_mid) {
			$re_mid = "($re_mid) OR real_gid=?";
		} else {
			$re_mid = "real_gid=?";
		}
		if ($gm_mid) {
			$gm_mid = "OR ($gm_mid) ";
		} else {
			$gm_mid = "";
		}

		$sql.="FROM $gm_table gm, $member_table_mm m WHERE "
			."(gm.gid IN (select gid from $gp_table "
						."where ($re_mid) and attr='D') "
			.$gm_mid."OR gm.gid=?) "
			."AND m.type IN ($type) AND gm.attr IN ('1','2') AND m.mid=gm.mid $k_where $order";
		$sth = $session->{dbh}->prepare($sql);
		$sth->bind_param(1,$gid,3);
		$sth->bind_param(2,$gid,3);
		if ($k_where ne "") {
			$sth->bind_param(3, $k_like, 1);
			$sth->bind_param(4, $k_like, 1);
			$sth->bind_param(5, $k_like, 1);
		}
	}
	$sth->execute();
	while(my($value)=$sth->fetchrow){
		push(@$user_list,$value);
	}

	my %count; @$user_list=grep(!$count{$_}++, @$user_list); # 重複除外

	return($user_list);
}

sub get_all_user_list_with_specific_group {
	my ($session, $join_gid, $gid, $type, $msid, $conf) = @_;

    my ($sort, $keyword, $view);
	if ($conf) {
		$sort = $conf->{sort};
		$keyword = $conf->{keyword};
		$keyword = DA::Unicode::trim($keyword);
		$view = $conf->{view};
	}

	if (!$type){ $type ="1"; }

	my @id_list; my $sorted = 0;
	if ($gid =~ /custom(.*?)$/) {
		my $customs = DA::Scheduler::get_customs($session);
		my ($customs_tag, $current_arr_num) = DA::Scheduler::get_customs_tag($session, $gid, $customs);
		if (ref($customs) eq 'ARRAY' &&
			ref($customs->[$current_arr_num]) eq 'HASH' &&
			$customs->[$current_arr_num]->{users}) {
			my @dum = @$customs;
			@id_list = @{$customs->[$current_arr_num]->{users}};
		}
	} elsif ($gid eq 'boss') {
		my $bosses = DA::IS::get_bosses($session);
		@id_list = keys (%{$bosses});
	} elsif ($gid >= $DA::Vars::p->{top_gid}) {
		my $sql = "SELECT type,permit FROM is_group WHERE gid=?";
		my $sth = $session->{dbh}->prepare($sql); $sth->execute($gid);
		my ($type, $permit) = $sth->fetchrow; $sth->finish;
		my $view_permit = 0;;
		if ($type eq 2 && $permit eq 2) {
			if ($join_gid->{$gid}->{attr} =~ /[12]/ ||
				DA::IS::check_owner($session, {}, $gid, 'all')) {
				$view_permit = 1;
			}
		} else {
			$view_permit = 1;
		}
		if ($view_permit) {
			@id_list = @{ DA::IS::get_all_user_list($session, $gid, 0, $type, $msid, {
				sort    => $sort,
				keyword => $keyword,
				view    => $view
			}) };
		}
		$sorted = 1;
	}
	unless ($sorted) {
		my $in_mid = DA::IS::make_large_in_phrase($session, \@id_list, 'mid', 500);
		my $order;
		if ($sort) {
			$order = " ORDER BY type,sort_level,upper(kana)";
		}

		@id_list = ();
		if ($in_mid) {
			my ($k_where, $k_like);
			if ($keyword ne "") {
				my ($word, $esc, $space, $like) = DA::IS::escape_sql_keyword_with_filter($keyword, "zs2hs|uc");
				$k_where = " AND ((replace(upper(name),'$space',' ') LIKE ? escape '$esc')"
				         . " OR (replace(upper(kana),'$space',' ') LIKE ? escape '$esc')"
				         . " OR (replace(upper(alpha),'$space',' ') LIKE ? escape '$esc'))";
				$k_like = $like;
			}

			my $member_table_mm = DA::IS::get_member_table($session, $view ? undef : "TBL", $msid);
			my $sql = "SELECT mid FROM $member_table_mm WHERE type IN ($type) "
			        . "AND ($in_mid) $k_where $order";

			my $sth = $session->{dbh}->prepare($sql);

			if ($k_where ne "") {
				$sth->bind_param(1, $k_like, 1);
				$sth->bind_param(2, $k_like, 1);
				$sth->bind_param(3, $k_like, 1);
			}

			$sth->execute();
			while (my ($mid) = $sth->fetchrow) {
				$mid = int($mid);
				if ($mid) {
					push(@id_list, $mid);
				}
			}
		}
	}

	return(\@id_list);
}

# Add by T.K 2004/02/26 --->
sub get_all_user_info {
	my ($session, $gid, $items, $type, $opt)	= @_;
	# 指定したグループのユーザ情報一覧を取得する。
	# $items	取得情報のリスト
	# $type     対象となるユーザタイプ ex('1,2');
	# $opt : 0  HASH で返す
	#      : 1  ARRAY で返す
	my ($info, $item, $sql, $sth, %exists);

	if (ref($items) eq 'ARRAY') {
		foreach my $i (@{$items}) {
			$item	.= 'm.' . $i . ',';
		}
		$item	=~s/\,+$//g;
	} else {
		$item	= "m.name,m.email";
	}
	if (!$type) {
		$type = "1";
	}

	my $member_table=DA::IS::get_member_table($session);
	if ($gid =~ /^\d+$/) {
		$sql	= "SELECT m.mid,$item FROM is_group_member gm, $member_table m "
				. "WHERE (gm.gid IN (select gid from is_group_path "
				. "where (real_gid IN (select mid from is_group_member "
				. "where gid=? and attr IN ('5')) "
				. "or real_gid=?) and attr='D') "
				. "OR gm.gid IN (select mid from is_group_member "
				. "where gid=? and attr IN ('5')) "
				. "OR gm.gid=?) "
				. "AND m.type IN ($type) AND gm.attr IN ('1','2') AND m.mid=gm.mid "
				. "ORDER BY m.type,m.sort_level,upper(m.kana)";
		$sth	= $session->{dbh}->prepare($sql);
		$sth->bind_param(1, $gid, 3);
		$sth->bind_param(2, $gid, 3);
		$sth->bind_param(3, $gid, 3);
		$sth->bind_param(4, $gid, 3);
	} else {
		my ($id, $g_ud, $tid, $t_ud)	= split(/\-/, $gid);
		$sql="SELECT m.mid,$item FROM is_group_member gm, $member_table m "
		."WHERE (gm.t_gid=0 OR gm.t_gid is null OR gm.t_gid IN ";
		if ($g_ud eq 'D') {
			$sql.="(select gid from is_group_path where real_gid=$id "
				. "and attr='D') OR gm.t_gid=$id) ";
		} else {
			$sql.="($id)) ";
		}
		$sql.="AND (gm.gid IN ";
		if ($t_ud eq 'U') {
			$sql.="(select gid from is_group where type=3 and sort_level "
				. "<= (select sort_level from is_group where gid=$tid))) ";
		} elsif ($t_ud eq 'D') {
			$sql.="(select gid from is_group where type=3 and sort_level "
				. ">= (select sort_level from is_group where gid=$tid))) ";
		} else {
			$sql.="($tid)) ";
		}
		$sql.="AND m.type IN (1) AND gm.attr IN ('1','2') AND m.mid=gm.mid "
			. "ORDER BY m.type,m.sort_level,upper(m.kana)";
		$sth = $session->{dbh}->prepare($sql);
	}
	$sth->execute();
	if ($opt) {
		$info	= [];
		while (my (@list) = $sth->fetchrow) {
			my $tmp	= {};
			for (my $i = 0; $i < @list; $i ++) {
				$list[$i] =~ s/\s+$//g;
				$tmp->{lc($sth->{NAME}[$i])} = $list[$i];
			}
			if (!exists $exists{$tmp->{mid}}) {
				push (@{$info}, $tmp);
				$exists{$tmp->{mid}} = 1;
			}
		}
	} else {
		$info	= {};
		while (my ($mid, @list) = $sth->fetchrow) {
			for (my $i = 0; $i < @list; $i ++) {
				$list[$i] =~ s/\s+$//g;
				$info->{$mid}->{lc($sth->{NAME}[$i+1])} = $list[$i];
			}
		}
	}

	return ($info);
}

sub get_user_info {
	my ($session, $mid, $items, $msid)	= @_;
	my $info	= {};
	my $item;

	if (ref($items) eq 'ARRAY') {
		$item = join (',', @{$items});
	} else {
		$item = "name,email";
	}
	my $sql = "SELECT $item FROM @{[DA::IS::get_member_table($session, undef, $msid)]} WHERE mid=?";
	my $sth = $session->{dbh}->prepare($sql); 
	   $sth->bind_param(1,$mid,3); $sth->execute();
	my (@list) = $sth->fetchrow;

	for (my $i = 0; $i < @list; $i ++) {
		$list[$i] =~ s/\s+$//g;
		$info->{lc($sth->{NAME}[$i])} = $list[$i];
	}
	$sth->finish;

	return ($info);
}

sub get_users_info {
	my ($session, $mids, $items, $msid)	= @_;
	my $info	= {};
	my $item;

	if (ref($items) eq 'ARRAY') {
		
		my @tmp;
		foreach my $k ( @{$items} ) {
			next if ( $k eq 'mid' );
			push(@tmp, $k );
		}
		$item	= join (',', @tmp);
	} else {
		$item	= "name,email";
	}
	$item = "mid,$item";
	
	my $mid_list = DA::IS::array_div($mids, $DA::Vars::p->{max_in_size});
	foreach my $mids ( @{$mid_list} ) {
		my $bind_str = "?," x scalar(@{$mids});
		$bind_str =~ s/\,$//;
		my $sql	= "SELECT $item FROM @{[DA::IS::get_member_table($session, undef, $msid)]} WHERE mid IN";
		$sql   .= " ($bind_str)";
		my $sth	= $session->{dbh}->prepare($sql);
		
		my $i=1;
		foreach my $id ( @{$mids} ) {
			$sth->bind_param($i, $id ,3);
			$i++;
		}
		$sth->execute();

		while ( my $data = $sth->fetchrow_hashref('NAME_lc') ) {
			my $mid = $data->{mid};
			foreach my $k ( keys %{$data} ) {
				$data->{$k} =~ s/\s+$//g;
				$info->{$mid}->{$k} = $data->{$k};
			}
		}
		$sth->finish;
	}

	return ($info);
}

# <--- Add by T.K 2004/02/26

# 各種権限に指定されているIDとユーザの権限チェック
sub check_permit {
    my ($session,$join,$id,$pattern,$check_owner,$owner_group,$auth,$mid)=@_;
# $pattern = ($id =~ /^\d+$/)のときのみ使用
#            '12UDW' 上位下位
#            '12UW'  上位
#            '12DW'  下位
#            '12'    プライマリ、セカンダリメンバー
# $check_owner = 1  DA::IS::check_owner をCALL
#                   $owner_group,$auth,$mid

    my $permit = 0;
    if (!$join) { $join=DA::IS::get_join_group($session,$session->{user},1); }
    my(@id_array)=split(/[\:\,]/,$id);
    foreach my $id(@id_array){
        if(!$id){next;}
        if($permit){last;}
        if ($id =~ /^\d+$/o) {
            if ($id >= $DA::Vars::p->{top_gid}) {
                if ($join->{$id}->{attr} =~/^[$pattern]$/) {
                    $permit = 1;
                }
            } else {
                if ($id eq $session->{user}) {
                    $permit = 1;
                }
            }
            if ($check_owner) {
                if (ref($owner_group) ne 'HASH' || !%$owner_group){
                    if (!$mid){$mid=$session->{user};}
                    $owner_group=DA::IS::get_owner_group($session,$mid,0,$auth);
                }
                if (DA::IS::check_owner($session,$owner_group,$id,$auth)) {
                    $permit = 2;
                }
            }
        } else {
            $pattern = DA::IS::get_group_pattern($session);
            my($gid,$g_ud,$tid,$t_ud)=split(/\-/,$id);
            if($gid && $tid){
                my $sql="SELECT mid FROM is_group_member WHERE "
                      . "(t_gid=0 OR t_gid is null OR t_gid IN ";
                if($g_ud eq 'D'){
                    $sql.="(select gid from is_group_path where real_gid=$gid "
                                  ."and attr='D') OR t_gid=$gid) ";
                }else{
                    $sql.="($gid)) ";
                }
                $sql.="AND (gid IN ";
                if($t_ud eq 'U'){
                    $sql.="(select gid from is_group where type=3 and "
                        . "grade <= "
                        . "(select grade from is_group where gid=$tid))) ";
                }elsif($t_ud eq 'D'){
                    $sql.="(select gid from is_group where type=3 and "
                        . "grade >= "
                        . "(select grade from is_group where gid=$tid))) ";
                }else{
                    $sql.="($tid)) ";
                }
                $sql.="AND mid=$session->{user} AND attr IN ('1','2')";
                my $sth = $session->{dbh}->prepare($sql); $sth->execute();
                my($mid)=$sth->fetchrow;
                $sth->finish();
                if($mid){
                    $permit = 1;
                }
            }elsif($tid){
                my $sql="SELECT mid FROM is_group_member WHERE "
                      . "(gid IN ";
                if($t_ud eq 'U'){
                    $sql.="(select gid from is_group where type=3 and "
                        . "grade <= "
                        . "(select grade from is_group where gid=$tid))) ";
                    $sql.="($tid)) ";
                }elsif($t_ud eq 'D'){
                    $sql.="(select gid from is_group where type=3 and "
                        . "grade >= "
                        . "(select grade from is_group where gid=$tid))) ";
                }else{
                    $sql.="($tid)) ";
                }
                $sql.="AND mid=$session->{user} AND attr IN ('1','2')";
                my $sth = $session->{dbh}->prepare($sql); $sth->execute();
                my($mid)=$sth->fetchrow;
                $sth->finish();
                if($mid){
                    $permit = 1;
                }
            }elsif($gid){
                if($g_ud eq 'D'){
                    if ($join->{$gid}->{attr} =~/^[$pattern->{up}]$/) {
                        $permit = 1;
                    }
                }else{
                    if ($join->{$gid}->{attr} =~/^[$pattern->{member}]$/) {
                        $permit = 1;
                    }
                }
                if ($check_owner && !$permit) {
                    if (ref($owner_group) ne 'HASH' || !%$owner_group){
                        if (!$mid){$mid=$session->{user};}
                        $owner_group=DA::IS::get_owner_group($session,$mid,0,$auth);
                    }
                    if (DA::IS::check_owner($session,$owner_group,$id,$auth)) {
                        $permit = 2;
                    }
                }
            }
        }
    }
    return $permit;
}

sub delete_ud_group_cache {
	my ($session, $gid, $mode, $msid) = @_;
	
	if (!$mode || $mode eq 1) {
		if ($gid) {
			my $downer = DA::IS::get_all_down_group($session, $gid, 1, $msid);
			my %count;
			foreach my $g (@{$downer}, $gid) {
				unless ($g) {
					next;
				}
				unless ($count{$g}) {
					my $cache_file = DA::Cache::get_cache_file($session, "upper_group", $g, $msid);
					DA::Cache::delete_cache($session, $cache_file, $msid);
				}
				$count{$g} ++;
			}
		}
	}
	if (!$mode || $mode eq 2) {
		if ($gid == 0 || $gid == $DA::Vars::p->{top_gid}) {
			DA::Cache::delete_all_cache($session, "downer_group", $msid);
		} else {
	
			# 対象グループがプロジェクトの場合は親組織を強制的に追加
			my($sql,$sth);
			my $add_del_target;
			my $group_table = DA::IS::get_group_table($session, "TBL", $msid);
			$sql="SELECT type,parent FROM $group_table where gid=?";
			$sth = $session->{dbh}->prepare($sql);
			$sth->bind_param(1, $gid, 3);
			$sth->execute();
			my ($g_type,$g_parent) =$sth->fetchrow();
			if ( $g_type eq $DA::Vars::p->{g_type}->{work} ) {
				$add_del_target = $g_parent ;
			}
 
			my $upper = DA::IS::get_all_up_group($session, $gid, 1, $msid);
			my %count;
			foreach my $g (@{$upper}, $gid, $add_del_target) {
				unless ($g) {
					next;
				}
				
				unless ($count{$g}) {
					my $cache_file = DA::Cache::get_cache_file($session, "downer_group", $g, $msid);
					DA::Cache::delete_cache($session, $cache_file, $msid);
				}
				$count{$g} ++;
			}
		}
	}

	return (0);
}

sub delete_ud_group_all_cache {
	my ($session, $msid) = @_;

	DA::Cache::delete_all_cache($session, "upper_group", $msid);
	DA::Cache::delete_all_cache($session, "downer_group", $msid);

	return (0);
}

sub get_all_up_group{
	my($session,$gid,$force,$msid)=@_;
	# 指定したグループより上位に属するグループを取得
	my $gid_list;
	my $cache_file = DA::Cache::get_cache_file($session, "upper_group", $gid, $msid);

	if (!$force && DA::Cache::cache_exist($cache_file)) {
		$gid_list = DA::Cache::get_cache($session, $cache_file, $msid, 1);
	}

	unless ($gid_list) {
		$gid_list = [];

		my $gp_table = DA::IS::get_master_table($session, "is_group_path", $msid);
		my $gm_table = DA::IS::get_master_table($session, "is_group_member", $msid);

		my $sql	="SELECT gid FROM $gp_table WHERE "
				."(real_gid=? OR real_gid IN "
				."(select mid from $gm_table "
				."where gid=? and attr IN ('5'))) "
				."and attr='U' "
				."UNION ALL select gid from $gm_table "
				."where mid=? and attr IN ('5') ";
		my $sth	= $session->{dbh}->prepare($sql);
		$sth->bind_param(1,$gid,3);
		$sth->bind_param(2,$gid,3);
		$sth->bind_param(3,$gid,3);
		$sth->execute();
		while(my($value)=$sth->fetchrow){
			push(@$gid_list,$value);
		}
		my %count; @$gid_list = grep(!$count{$_}++, @$gid_list);

		DA::Cache::update_cache($session, $cache_file, $gid_list, $msid);
	}

	return($gid_list);
}

sub get_all_down_group {
	my ($session,$gid,$force,$msid)	= @_;
#指定したグループより下位に属するグループを取得
	my $gid_list;
	my $cache_file = DA::Cache::get_cache_file($session, "downer_group", $gid, $msid);

	if (!$force && DA::Cache::cache_exist($cache_file)) {
		$gid_list = DA::Cache::get_cache($session, $cache_file, $msid, 1);
	}

	unless ($gid_list) {
		$gid_list = [];

		my $group_table_mm = DA::IS::get_group_table($session, "TBL", $msid);
		my $gp_table = DA::IS::get_master_table($session, "is_group_path", $msid);

		my $sql	= "select gid from $gp_table where real_gid=? and attr='D' "
				. "union all select gid from $group_table_mm where (parent=? OR parent IN "
				. "(select gid from $gp_table where real_gid=? and attr='D'))";
		my $sth	= $session->{dbh}->prepare($sql);
		$sth->bind_param(1, $gid, 3);
		$sth->bind_param(2, $gid, 3);
		$sth->bind_param(3, $gid, 3);
		$sth->execute();
		while(my ($value) = $sth->fetchrow){
			push (@{$gid_list}, $value);
		}
		$sth->finish;
		my %count; @{$gid_list} = grep(!$count{$_}++, @{$gid_list});

		DA::Cache::update_cache($session, $cache_file, $gid_list, $msid);
	}

	return ($gid_list);
}

sub get_auth_img{
    my($session)=@_;
# セカンダリオーナー権限アイコン

    my $auth_img={};
    $auth_img->{1}->{flg}  =N_("所属ユーザ");
    $auth_img->{1}->{img}  ="$session->{img_rdir}/ico_owner_user.gif";
    $auth_img->{1}->{title}="$session->{img_rdir}/ownersub_title_aff.gif";
    $auth_img->{1}->{alt}  =N_("オーナー権限メニューの所属ユーザ設定権限");
    $auth_img->{2}->{flg}  =N_("施設設備");
    $auth_img->{2}->{img}  ="$session->{img_rdir}/ico_owner_institution.gif";
    $auth_img->{2}->{title}="$session->{img_rdir}/ownersub_title_fac.gif";
    $auth_img->{2}->{alt}  =N_("オーナー権限メニューの施設・設備管理権限");
    $auth_img->{3}->{flg}  =N_("通達事項");
    $auth_img->{3}->{img}  ="$session->{img_rdir}/ico_owner_notice.gif";
    $auth_img->{3}->{title}="$session->{img_rdir}/ownersub_title_ann.gif";
    $auth_img->{3}->{alt}  =N_("オーナー権限メニューの通達事項登録権限");
    $auth_img->{4}->{flg}  =N_("ポートレット");
    $auth_img->{4}->{img}  ="$session->{img_rdir}/ico_owner_portlet.gif";
    $auth_img->{4}->{title}="$session->{img_rdir}/ownersub_title_portlet.gif";
    $auth_img->{4}->{alt}  =N_("オーナー権限メニューのポートレット設定権限");
    $auth_img->{5}->{flg}  =N_("ホームページ");
    $auth_img->{5}->{img}  ="$session->{img_rdir}/ico_owner_homepage.gif";
    $auth_img->{5}->{title}="$session->{img_rdir}/ownersub_title_page.gif";
    $auth_img->{5}->{alt}  =N_("オーナー権限メニューのホームページ編集権限");
    $auth_img->{6}->{flg}  =N_("表示メニュー");
    $auth_img->{6}->{img}  ="$session->{img_rdir}/ico_owner_indication.gif";
    $auth_img->{6}->{title}="$session->{img_rdir}/ownersub_title_dis.gif";
    $auth_img->{6}->{alt}  =N_("オーナー権限メニューの表示メニュー設定権限");
    $auth_img->{7}->{flg}  =N_("個人ポータル");
    $auth_img->{7}->{img}  ="$session->{img_rdir}/ico_owner_individual.gif";
    $auth_img->{7}->{title}="$session->{img_rdir}/ownersub_title_per.gif";
    $auth_img->{7}->{alt}  =N_("オーナー権限メニューの個人ポータル設定権限");
    $auth_img->{8}->{flg}  =N_("グループポータル");
    $auth_img->{8}->{img}  ="$session->{img_rdir}/ico_owner_group.gif";
    $auth_img->{8}->{title}="$session->{img_rdir}/ownersub_title_gro.gif";
    $auth_img->{8}->{alt}  =N_("オーナー権限メニューのグループポータル設定権限");
    $auth_img->{9}->{flg}  =N_("ドキュメント");
    $auth_img->{9}->{img}  ="$session->{img_rdir}/ico_owner_document.gif";
    $auth_img->{9}->{title}="$session->{img_rdir}/ownersub_title_doc.gif";
    $auth_img->{9}->{alt}  =N_("オーナー権限メニューのドキュメント管理権限");
    $auth_img->{10}->{flg} =N_("リンク集");
    $auth_img->{10}->{img} ="$session->{img_rdir}/ico_owner_link.gif";
    $auth_img->{10}->{title}="$session->{img_rdir}/ownersub_title_link.gif";
    $auth_img->{10}->{alt} =N_("オーナー権限メニューのリンク集設定権限");
    $auth_img->{11}->{flg} =N_("ワークフロー");
    $auth_img->{11}->{img} ="$session->{img_rdir}/ico_owner_wflow.gif";
    $auth_img->{11}->{title}="$session->{img_rdir}/ownersub_title_webform.gif";
    $auth_img->{11}->{alt} =N_("オーナー権限のワークフロー設定権限");
    $auth_img->{12}->{flg} =N_("アドレス帳");
    $auth_img->{12}->{img} ="$session->{img_rdir}/ico_owner_address.gif";
    $auth_img->{12}->{title}="$session->{img_rdir}/ownersub_title_add.gif";
    $auth_img->{12}->{alt} =N_("オーナー権限のアドレス帳管理権限");
    $auth_img->{13}->{flg} =N_("連絡掲示板");
    $auth_img->{13}->{img} ="$session->{img_rdir}/ico_owner_board.gif";
    $auth_img->{13}->{title}="$session->{img_rdir}/ownersub_title_mes.gif";
    $auth_img->{13}->{alt} =N_("オーナー権限の連絡掲示板管理権限");
    $auth_img->{14}->{flg} =N_("統合クリッピング");
    $auth_img->{14}->{img} ="$session->{img_rdir}/ico_owner_newest.gif";
    $auth_img->{14}->{title}="$session->{img_rdir}/ownersub_title_new.gif";
    $auth_img->{14}->{alt} =N_("オーナー権限の統合クリッピング管理権限");
    $auth_img->{15}->{flg} =N_("グループ詳細情報");
    $auth_img->{15}->{img} ="$session->{img_rdir}/ico_owner_group_info.gif";
    $auth_img->{15}->{title}="$session->{img_rdir}/ownersub_title_group_ext.gif";
    $auth_img->{15}->{alt} =N_("オーナー権限のグループ詳細情報管理権限");
    $auth_img->{16}->{flg} =N_("電子メール");
    $auth_img->{16}->{img} ="$session->{img_rdir}/ico_owner_mail.gif";
    $auth_img->{16}->{title}="$session->{img_rdir}/ownersub_title_mail.gif";
    $auth_img->{16}->{alt} =N_("オーナー権限の電子メール管理権限");
    $auth_img->{17}->{flg} =N_("サイドリンク集");
    $auth_img->{17}->{img} ="$session->{img_rdir}/ico_owner_sidelink.gif";
    $auth_img->{17}->{title}="$session->{img_rdir}/ownersub_title_sidelink.gif";
    $auth_img->{17}->{alt} =N_("オーナー権限のサイドリンク集設定権限");
    $auth_img->{18}->{flg} =N_("スケジュール");
    $auth_img->{18}->{img} ="$session->{img_rdir}/ico_owner_schedule.gif";
    $auth_img->{18}->{title}="$session->{img_rdir}/ownersub_title_schedule.gif";
    $auth_img->{18}->{alt} =N_("オーナー権限のスケジュール設定権限");
	$auth_img->{19}->{flg} =N_("RSSリーダー");
    $auth_img->{19}->{img} ="$session->{img_rdir}/ico_owner_rss.gif";
    $auth_img->{19}->{title}="$session->{img_rdir}/ownersub_title_rss.gif";
    $auth_img->{19}->{alt} =N_("オーナー権限のRSSリーダー設定権限");
	$auth_img->{20}->{flg} =N_("連絡・通知");
    $auth_img->{20}->{img} ="$session->{img_rdir}/ico_owner_dcm.gif";
    $auth_img->{20}->{title}="$session->{img_rdir}/ownersub_title_dcm.gif";
    $auth_img->{20}->{alt} =N_("オーナー権限の連絡・通知設定権限");
    return $auth_img;
}

sub make_attach_tag{
    my($session,$attach_list,$mode,$del_btn)=@_;
# $mode=1 ダウンロードボタン有り

    my $list;
    foreach my $no(sort keys %$attach_list){
        my($type,$fname,$path,$img)=split(/\n/,$attach_list->{"$no"});
        $list.="<tr><td nowrap>"
             ."<img src=$session->{img_rdir}/$img width=16 height=16></td>";
        my $del_tag;
        if($del_btn){
            $del_tag="<a href=\"javascript:deleteItem('$del_btn','$no');\"><img src=\"$session->{img_rdir}/aqbtn_close_s.gif\" width=14 height=14 border=0 align=top alt=\"@{[t_('削除')]}\"></a>";
        }
        if($type eq 'url'){
            $list.="<td>&nbsp;<a href=\"$path";
            if($path=~/^\/cgi\-bin\//){
                $list.="&from=attach";
            }
            $list.="\" target=_blank>$fname</a>@{[b_('リンクＵＲＬ')]}$del_tag";
        }else{
            $list.="<td>&nbsp;"
                 . DA::IS::get_download_atag($session, $path, $fname, '_blank')
                 . "$del_tag";
			$fname = DA::CGIdef::encode($fname,3,1,'euc');   # 2003.10.24 replaced by chaya
        if($mode){
            if($type eq 'url'){
                $path=~s/\/$//g;
                my(@item)=split(/\//,$path);
                my $o_no=pop(@item);
                $list.="&nbsp;"
                     ."<a href=\"javascript:Pop('$DA::Vars::p->{cgi_rdir}"
                     ."/object_download.cgi?object=$o_no','pop_title_seldl.gif'"
                     .",400,450)\"><img src=$session->{img_rdir}/"
                     ."aqbtn_download.gif border=0 "
                     ."width=52 height=15 alt=\"@{[t_('ダウンロード')]}\"></a>";
            }else{
                my $full_path = "$DA::Vars::p->{base_dir}/insuite/$path";
                my $down_button=
                    DA::IS::get_download_link($session,$full_path,$fname);
                $list.="&nbsp;$down_button";
            }
        }
#=====================================================
#           ----custom----
#=====================================================
DA::Custom::add_download_btn($session,\$list,$path,$fname);
        }
        $list.="</td></tr>";
    }
    my $attach_tag;
    if($list){
        $attach_tag="<table border=0 cellspacing=0 cellpadding=0>$list</table>";
    }
    return $attach_tag;
}

###########################################################################
# セッション維持の時間の取得
# mode = 0: メッセージ表示用
# mode = 1: セッション情報保持用
###########################################################################
sub get_expire_time{
	my($mode)=@_;

	my $param = {};
	$param->{expire} = $DA::Vars::p->{expire};

	if (!defined($param->{expire})){ $param->{expire}='24h'; }
	my($expire,$expire_p);
	$param->{expire}=~/^(\d+)(h|m)$/;
	if ($2 eq 'm'){
		$expire = $1 .t_("分");
		$expire_p = $1;
	} else {
		$expire = $1 .t_("時間");
		$expire_p = int($1 * 60);
	}

	if ($mode){
		return ($expire_p);
	} else {
		return ($expire);
	}
}

###########################################################################
# パスワード使用禁止の場合のタグ生成
###########################################################################
sub passwd_input_tag {
	my %args = @_;

	unless (defined $args{conf}) {
		$args{conf} = DA::IS::get_sys_custom({}, 'auth', 1);
	}

	if ($args{conf}->{passwd_no_update} eq 1) {
		return "<font color=red>".t_("本システムでパスワードの変更を行うことはできません。")
		."</font>";
	} else {
		return qq|<input type=password name=$args{name} size=20 value="$args{value}" style="ime-mode: disabled">$args{msg}|;
	}
}

sub passwd_check_tag {
	my %args = @_;

	unless (defined $args{conf}) {
		$args{conf} = DA::IS::get_sys_custom({}, 'auth', 1);
	}

	if ($args{conf}->{passwd_no_update} eq 1) {
		return qq||;
	} else {
		my $checked = " checked" if ($args{value} eq 1);
		return qq|<input type=checkbox name=$args{name} value=1 $checked>$args{msg}|;
	}
}

sub forward_authorize_error {
	my $session	= shift;
	my $auth	= shift;

	my $status = {
					'0'		=> 'SUCCESS',
					'1' 	=> 'DENY',
					'2' 	=> 'INVALID',
					'3' 	=> 'INVALID_MOBILE',
					'4' 	=> 'EXCEED_FAILURE',
					'5' 	=> 'FAILED_ID',
					'6' 	=> 'FAILED_PASSWORD',
					'7' 	=> 'FAILED_MOBILE_PASSWORD',
					'9' 	=> 'FAILED',
					'10' 	=> 'EXPIRE'};

	my $conf = DA::IS::get_sys_custom({}, 'auth', 1);

	if (defined $conf->{$status->{$auth->status}}) {
		DA::CGIdef::refresh(
						$session,
						$conf->{$status->{$auth->status}});
	} else {
		DA::CGIdef::errorpage(
						$session,
						$auth->err_message($auth->status),
						'login');
	}
}

# --------------------------------------------------------------------------
# TXT出力用のタイトルを作成する
#   http://support.microsoft.com/default.aspx?scid=kb;ja;828625
# --------------------------------------------------------------------------
sub get_txttitle {
	my ($title) = @_;
	my $length = 256 - length($title);
	my $spacer = " " x $length if ($length > 0);
	return($title . $spacer);
}

# --------------------------------------------------------------------------
# CSV出力用の一行を作成する
# --------------------------------------------------------------------------
sub array_to_csvline {
    my $data        = shift;
    my $separate    = shift;
    my $need_quote  = shift;

    foreach my $i (0..int(@{$data})-1) {
        $data->[$i] =~ s/\x0D\x0A/\x0A/gs;  # データ内部の改行コードの変換
    }

    if ($need_quote) {
        return join $separate,
                map {(s/"/""/g or /[\r\n,]/) ? qq("$_") : qq("$_")} @{$data};
    } else {
        return join $separate,
                map {(s/"/""/g or /[\r\n,]/ or /(?:$separate)/) ? qq("$_") : $_} @{$data};
    }
}

sub get_alertAttachment_script {
	my ($session, $opt, $mode)	= @_;
	my $lang	= DA::IS::get_user_lang($session);
	my $msgpath	= "$DA::Vars::p->{custom_dir}/messages/$lang/";
	my ($script, %message);
	my @files	= (
		'msg_attachment_alert0.dat',
		'msg_attachment_alert1.dat',
		'msg_attachment_alert2.dat'
	);

	foreach my $file (@files) {
		my $MSG = DA::Unicode::file_open($msgpath . $file, "r");
		if (defined $MSG) {
			while (<$MSG>) { $message{$file} .= $_; }
			close ($MSG);
		}

		$message{$file} =~ s/\n/\\n/g;
	}

	$script	= "<SCRIPT LANGUAGE=\"JavaScript\"><!--\n" if ($opt);
	$script	.="function alertAttachment(TYPE) {\n"
			. "  var message;\n"
			. "  var result;\n"
			. "  switch (TYPE) {\n"
			. "    case 1  : message = '" . $message{'msg_attachment_alert1.dat'}
			. "'; break;\n"
			. "    case 2  : message = '" . $message{'msg_attachment_alert2.dat'}
			. "'; break;\n"
			. "    default : message = '" . $message{'msg_attachment_alert0.dat'}
			. "'; break;\n"
			. "  }\n"
			. "  result = confirm (message);\n"
			. "  return (result);\n"
			. "}\n";
	$script	.="//--></SCRIPT>\n" if ($opt);
	if ($mode eq '1') {
		$script	=~s/\\n/\\\\n/g;
	} elsif ($mode eq '2') {
		$script	= DA::Unicode::convert_to(\$script, "Shift_JIS");
	}

	return ($script);
}

sub get_alert_tag {
	my ($attachment, $app, $type)	= @_;
	my ($key, $tag);

	if ($app eq 'mail') {
		$key	= 'mail';
	} elsif ($app =~ /^(mailist|mailist2|ml)$/) {
		$key	= 'ml';
	}
	if ($key) {
		$type	= 0 if (!$type);
		$tag	= " onClick=\"return alertAttachment($type);\""
			if ($attachment->{$key . '_alert'} !~ /^off$/i);
	}

	return ($tag);
}

sub uri_escape {
	my ($tag, $add_char)	= @_;
	my $unsafe = "^A-Za-z0-9\-_.!~*()";
	   $unsafe .=$add_char;
	return (URI::Escape::uri_escape($tag, $unsafe));
}

sub get_sub_menu_html {
	my %param = @_;
	# session   : セッション
	# cgi_rdir  : CGIのディレクトリPATH(デフォルト/cgi-bin)
	# title     : サブメニューの表示名
	# href      : サブメニュー用のリンク
	# tab_on    : ONになっているtab番号

	my $cgi_rdir;
	unless (defined $param{cgi_rdir}) {
		$cgi_rdir = "$DA::Vars::p->{cgi_rdir}/";
	} else {
		$cgi_rdir = $param{cgi_rdir};
	}

	my $menu = [];
	foreach my $i (0..scalar(@{$param{'title'}})-1) {
		my %data;
		$data{'title'}  = $param{'title'}->[$i];
		$data{'name'}   = $param{'name'}->[$i];
		$data{'href'}   = "$cgi_rdir$param{'href'}->[$i]";
		$data{'target'}   = "$param{'target'}->[$i]";
		if ($param{'tab_on'} eq $i) {
			$data{'tab_on'} = 1;
			# ▽ タテ帯を消すための処理
			if ($i>0) {
				$menu->[$i-1]->{'tab_on_prev'} = 1;
			}	
		} else {
			$data{'tab_on'} = 0;
		}
		push(@{$menu}, \%data);
	}

	my $tmpl_file = "$DA::Vars::p->{tmpl_dir}\/sub_menu.tmpl";
	my $tmpl = HTML::Template->new(
		filename => $tmpl_file,
		cache  => 1,
		die_on_bad_params => 0,
		global_vars => 1
	);
	$tmpl->param(
		IMG_RDIR    => $param{session}->{img_rdir},
		MENU        => $menu,
		OPTION      => $param{'option'}
	);

	return $tmpl->output;
}

sub get_group_timestamp {
	my $session	= shift;
	my $msid = shift;

	my $file = DA::MasterManager::filename($session, "join_group_cache", $msid);
	unless (-e "$DA::Vars::p->{custom_dir}/$file\.dat") {
		DA::IS::set_group_timestamp($session, $msid);
	}

	my $timestamp = DA::IS::get_sys_custom({}, $file);
	return $timestamp->{last_modify}
}

sub set_group_timestamp {
	my $session = shift;
	my $msid = shift;

	my $file = DA::MasterManager::filename($session, "join_group_cache", $msid);

	my $timestamp = {};
	$timestamp->{last_modify}
			= DA::CGIdef::get_date("Y4/MM/DD-HH:MI:SS", DA::System::nfs_time());

	DA::IS::save_sys_custom({}, $timestamp, $file);

	return $timestamp->{last_modify}
}

sub get_member_timestamp {
	my $session = shift;
	my $msid = shift;

	my $file = DA::MasterManager::filename($session, "member_cache", $msid);

	unless (-e "$DA::Vars::p->{custom_dir}/$file\.dat") {
		DA::IS::set_member_timestamp($session, $msid);
	}

	my $timestamp = DA::IS::get_sys_custom({}, $file);
	return $timestamp->{last_modify}
}

sub set_member_timestamp {
	my $session = shift;
	my $msid = shift;

	my $file = DA::MasterManager::filename($session, "member_cache", $msid);

	my $timestamp = {};
	$timestamp->{last_modify}
		= DA::CGIdef::get_date("Y4/MM/DD-HH:MI:SS", DA::System::nfs_time());

	DA::IS::save_sys_custom({}, $timestamp, $file);

	return $timestamp->{last_modify}
}

sub get_clone_timestamp {
	my $session = shift;
	my $msid = shift;
	
	my $file = DA::MasterManager::filename($session, "clone_cache", $msid);
	unless (-e "$DA::Vars::p->{custom_dir}/$file\.dat") {
		DA::IS::set_clone_timestamp($session, $msid);
	}

	my $timestamp = DA::IS::get_sys_custom({}, $file);
	return $timestamp;
}

sub set_clone_timestamp {
	my $session = shift;
	my $msid = shift;

	my $timestamp = {};

	my $file = DA::MasterManager::filename($session, "clone_cache", $msid);

	$timestamp->{group_timestamp}   = DA::IS::get_group_timestamp($session, $msid);
	$timestamp->{member_timestamp}  = DA::IS::get_member_timestamp($session, $msid);

	DA::IS::save_sys_custom({}, $timestamp, $file);

	return $timestamp;
}

#-------------------------------------------------------------------------------------
# ボス一覧を取得する
#
# 引数：$session     : セッション
#
sub get_bosses {
    my ($session,$join_gid,$mid) = @_;
    if (!$mid) {$mid = $session->{user};}

    # my $where     = "s.secre_id=$mid";
    my @secre_gid=();
    push(@secre_gid, $mid);

    if(!$join_gid){
        $join_gid  = DA::IS::get_join_group($session, $mid, 1, undef, undef);
    }
    my $bosses = {};
    my @bosses_arr = ();

    foreach my $j_key (keys %{$join_gid}) {
        if ($j_key ne "AUTH" && $join_gid->{$j_key}->{attr} =~ /[12UW]/) {
            push(@secre_gid, $j_key);
        }
    }
    my $sec_where;
    while (1) {
        if(!@secre_gid){last;}
        my @list = splice(@secre_gid,0,800);
        my $whe=join(',',@list); $whe =~ s/\,+$//;
        if ($whe eq '') {last;}
        $sec_where .= "s.secre_id IN ($whe) OR ";
    }
    $sec_where=~s/\sOR\s$//;

    my $sql = "SELECT s.mid from is_secretary s, is_member m "
            . "WHERE ($sec_where) AND s.mid=m.mid AND m.type IN (1,5) "
            . "ORDER BY m.sort_level, upper(m.kana), m.mid";
    my $sth = $session->{dbh}->prepare("$sql");
    $sth->execute();
    while (my($boss_id) = $sth->fetchrow) {
        $bosses->{$boss_id} = 1;
        push(@bosses_arr, $boss_id);
    }
    $sth->finish;
    return wantarray ? (@bosses_arr) : $bosses;
}

#-------------------------------------------------------------------------------------
# あるユーザに秘書がいるかどうか
# 引数：$session     : セッション
#       $mid         : ボスの mid
#
sub exist_secres {
    my ($session, $mid, $type) = @_;
    if (!$mid) {return 0;}

    my $where_type = "";
    if (defined($type)) {
        $where_type = "AND type=$type";
    }
    
    my $sql = "SELECT count(*) FROM is_secretary WHERE mid=? $where_type";
    my $sth = $session->{dbh}->prepare("$sql");
       $sth->bind_param(1, $mid, 3);
       $sth->execute();
    my($cnt) = $sth->fetchrow;
    $sth->finish;
    return $cnt ? $cnt : 0;
}


# --------------------------------------------------------------------------
# ▽ オーナー権限管理番号
# --------------------------------------------------------------------------
sub owner_number {
	my $type = shift;

	# ▽オーナー権限管理番号
	my $owner = {
    	'user'          => 1,
    	'facilities'    => 2,
    	'notice'        => 3,
    	'portlet'       => 4,
    	'homepage'      => 5,
    	'indication'    => 6,
    	'individual'    => 7,
    	'group'         => 8,
    	'document'      => 9,
    	'link'          => 10,
    	'wflow'         => 11,
    	'address'       => 12,
    	'board'         => 13,
    	'newest'        => 14,
    	'group_info'    => 15,
    	'mail'          => 16,
		'sidelink'		=> 17,
		'schedule'		=> 18,
		'rssreader'		=> 19,
		'dcm'			=> 20,
	};

    if ($type =~/^\d+$/){
        my $owner_type = {};
		%$owner_type = reverse %$owner;
        return $owner_type->{$type};
    } else {
        return $owner->{$type};
    }
}

# --------------------------------------------------------------------------
# ▽ 日付選択用タグの生成
# --------------------------------------------------------------------------
sub get_date_select_tag {
    my ($session,$mode,$yy,$mm,$dd,$y_name,$m_name,$d_name,
		$y_start,$m_start,$y_end,$m_end,$js_option) = @_;

# $js_option=off 　　　　　　         　日の選択肢が選択した月に自動的に連動するのjsを付与しない
# $js_option=その他の値/未定義　日の選択肢が選択した月に自動的に連動するのjsを付与
# ・デフォルトはjsを付与

# mode=1 年='----' 月='--' 日='--' の表示あり。
# mode=2 年='なし 月='なし 日='なし の表示あり。
# mode=3 年='----' 月='--' 日='--' の表示あり。且つvalueにALL-0を設定

    my $yy_tag = DA::CGIdef::get_yy_option($yy,$y_start,$y_end);
    my $mm_tag = DA::CGIdef::get_mm_option2($session,$mm,$m_start,$m_end);
    my $dd_tag = DA::CGIdef::get_dd_option($dd);
    my($date_tag,$y_option,$m_option,$d_option);
    if (!$y_name){$y_name='yy';}
    if (!$m_name){$m_name='mm';}
    if (!$d_name){$d_name='dd';}
    if ($mode eq '1'){
        $y_option = '<option>----';
        $m_option = '<option>--';
        $d_option = '<option>--';
    }elsif ($mode eq '2'){
        $y_option = "<option value='0000'>".t_('なし');
        $m_option = "<option value='00'>".t_('なし');
        $d_option = "<option value='00'>".t_('なし');
    }elsif ($mode eq '3'){
		$y_option = "<option value='0000'>----";
		$m_option = "<option value='00'>--";
		$d_option = "<option value='00'>--";
	}
    if (DA::IS::get_user_lang($session) eq 'ja'){
        $date_tag="<select name=$y_name>$y_option$yy_tag</select>"
                 .t_('年')
                 ."<select name=$m_name>$m_option$mm_tag</select>"
                 .t_('月')
                 ."<select name=$d_name>$d_option$dd_tag</select>"
                 .t_('日');
    } else {
        $date_tag="<select name=$m_name>$m_option$mm_tag</select> "
                 ."<select name=$d_name>$d_option$dd_tag</select>, "
                 ."<select name=$y_name>$y_option$yy_tag</select>";
    }
    
    if ($js_option ne "off") {
	    my $objkey = $y_name."_date";
	    $date_tag.=<<buf_end;
<script type="text/javascript" src="$DA::Vars::p->{html_rdir}/smart-dater.js"></script>
<script language="JavaScript">
var eleList = {
	'$objkey':
		{
			yyName: '$y_name',
			mmName: '$m_name',
			ddName: '$d_name'
		}
};
new Smartdater(eleList);
</script>
buf_end
    }

    return $date_tag;
}
sub get_month_select_tag {
    my ($session,$mode,$mm,$m_name) = @_;

	# mode=1 月='--' の表示あり。
    my($date_tag,$m_option);
    if (!$m_name){$m_name='mm';}
    if ($mode eq '1'){
        $m_option = '<option>--';
    }
    if (DA::IS::get_user_lang($session) eq 'ja'){
        my $mm_tag = DA::CGIdef::get_mm_option($mm);
        $date_tag="<select name=$m_name>$m_option$mm_tag</select>"
                 .t_('月');
    } else {
        my $mm_tag = DA::CGIdef::get_mm_option2($session,$mm);
        $date_tag="<select name=$m_name>$m_option$mm_tag</select>";
    }
    return $date_tag;
}
sub get_time_select_tag {
    my ($session,$mode,$hh,$mi,$h_name,$m_name,$none,$mi_int,$js_option,$bar_flag) = @_;

# $js_option=off 　　　　　　         　時の選択肢が24時を選択する場合、分が「00」として表示されて、選択できなくなるのjsを付与しない
# $js_option=その他の値/未定義　時の選択肢が24時を選択する場合、分が「00」として表示されて、選択できなくなるのjsを付与
# ・デフォルトはjsを付与

# mode=1 「24時」表示あり。
	#$js_option = "off" if (!$mode);
	
	my($hh_tag,$mi_tag);
	if ($m_name) {
    	$hh_tag = DA::CGIdef::get_hh_option2($session,$hh,$mode);
    	$mi_tag = DA::CGIdef::get_mi_option($mi,$mi_int);
	} else {
    	$hh_tag = DA::CGIdef::get_hh_option2($session,$hh,$mode,1);
    	$js_option = "off";
	}
    my($time_tag,$h_option,$m_option);
    if (!$h_name){$h_name='hh';}
    # if (!$m_name){$m_name='mi';}
    if(!$none){
        $h_option = '<option>--';
        $m_option = '<option>--';
    }elsif($none eq '2'){
        $h_option = "<option value='00'>".t_('なし');
        $m_option = "<option value='00'>".t_('なし');
    }elsif($none eq '3'){
        $h_option = "<option value=''>".t_('なし');
        $m_option = "<option value=''>".t_('なし');
    }elsif($none eq '4'){
		$h_option = "<option value='hh'>--";
		$m_option = "<option value='mm'>--";	
	}elsif($none eq '5'){
		$h_option = "<option value='--'>"."--";
		$m_option = "<option value='--'>"."--";	
    }
    if (DA::IS::get_user_lang($session) eq 'ja'){
        $time_tag="<select name=$h_name>$h_option$hh_tag</select>";
		if ($m_name) {
            $time_tag.=N_('時');
        	$time_tag.="<select name=$m_name>$m_option$mi_tag</select>" . N_("分");
		}
    } else {
        $time_tag="<select name=$h_name>$h_option$hh_tag</select>";
		if ($m_name) {
			$time_tag.=":<select name=$m_name>$m_option$mi_tag</select>";
		}
    }
    
    if ($js_option ne "off") {
	    my $objkey = $h_name."_time";
	    my $barEq24;
	    if ($bar_flag) {
	    	$barEq24 = 'barEq24: "1",';
	    }
	    $time_tag.=<<buf_end;
<script type="text/javascript" src="$DA::Vars::p->{html_rdir}/smart-dater.js"></script>
<script language="JavaScript">
var eleList = {
	'$objkey':
		{
			$barEq24
			hhName: '$h_name',
			miName: '$m_name'
		}
};
new Smartdater(eleList);
</script>
buf_end
    }
    
    return $time_tag;
}

# --------------------------------------------------------------------------
# ▽ 日付選択用タグの生成(Ajax版)
# --------------------------------------------------------------------------
sub get_date_select_tag4ajx {
    my ($session,$mode,$yy,$mm,$dd,$y_name,$m_name,$d_name,
                $y_start,$m_start,$y_end,$m_end,$js_option) = @_;

# $js_option=off 　　　　　　         　日の選択肢が選択した月に自動的に連動するのjsを付与しない
# $js_option=その他の値/未定義　日の選択肢が選択した月に自動的に連動するのjsを付与
# ・デフォルトはjsを付与

# mode=1 年='----' 月='--' 日='--' の表示あり。
# mode=2 年='なし 月='なし 日='なし の表示あり。
# mode=3 年='----' 月='--' 日='--' の表示あり。且つvalueにALL-0を設定

    my $yy_tag = DA::CGIdef::get_yy_option($yy,$y_start,$y_end);
    my $mm_tag = DA::CGIdef::get_mm_option2($session,$mm,$m_start,$m_end);
    my $dd_tag = DA::CGIdef::get_dd_option($dd);
    my($date_tag,$y_option,$m_option,$d_option);
    if (!$y_name){$y_name='yy';}
    if (!$m_name){$m_name='mm';}
    if (!$d_name){$d_name='dd';}
    if ($mode eq '1'){
        $y_option = "<option value='----'>----</option>";
        $m_option = "<option value='--'>--</option>";
        $d_option = "<option value='--'>--</option>";
    }elsif ($mode eq '2'){
        $y_option = "<option value='0000'>".t_('なし')."</option>";
        $m_option = "<option value='00'>".t_('なし')."</option>";
        $d_option = "<option value='00'>".t_('なし')."</option>";
    }elsif ($mode eq '3'){
        $y_option = "<option value='0000'>----</option>";
        $m_option = "<option value='00'>--</option>";
        $d_option = "<option value='00'>--</option>";
    }

    if (DA::Ajax::date_selector_ok($session)) {
        if (DA::IS::get_user_lang($session) eq 'ja'){
            $date_tag="<table border=0>"
                     ."<tr>"
                     ."<td><select name=$y_name id=$y_name>$y_option$yy_tag</select></td>"
                     ."<td>".t_('年')."</td>"
                     ."<td><select name=$m_name id=$m_name>$m_option$mm_tag</select></td>"
                     ."<td>".t_('月')."</td>"
                     ."<td><select name=$d_name id=$d_name>$d_option$dd_tag</select></td>"
                     ."<td>".t_('日')."</td>"
                     ."</tr>"
                     ."</table>";
        } else {
            $date_tag="<table border=0>"
                     ."<tr>"
                     ."<td><select name=$m_name id=$m_name>$m_option$mm_tag</select></td>"
                     ."<td> </td>"
                     ."<td><select name=$d_name id=$d_name>$d_option$dd_tag</select></td>"
                     ."<td>, </td>"
                     ."<td><select name=$y_name id=$y_name>$y_option$yy_tag</select></td>"
                     ."</tr>"
                     ."</table>";
        }
    } else {
        if (DA::IS::get_user_lang($session) eq 'ja'){
            $date_tag="<select name=$y_name id=$y_name>$y_option$yy_tag</select>"
                     .t_('年')
                     ."<select name=$m_name id=$m_name>$m_option$mm_tag</select>"
                     .t_('月')
                     ."<select name=$d_name id=$d_name>$d_option$dd_tag</select>"
                     .t_('日');
        } else {
            $date_tag="<select name=$m_name id=$m_name>$m_option$mm_tag</select> "
                     ."<select name=$d_name id=$d_name>$d_option$dd_tag</select>, "
                     ."<select name=$y_name id=$y_name>$y_option$yy_tag</select>";
        }
    }
    
    if ($js_option ne "off") {
	    my $objkey = $y_name."_date";
	    $date_tag.=<<buf_end;
<script type="text/javascript" src="$DA::Vars::p->{html_rdir}/smart-dater.js"></script>
<script language="JavaScript">
var eleList = {
	'$objkey':
		{
			yyName: '$y_name',
			mmName: '$m_name',
			ddName: '$d_name'
		}
};
new Smartdater(eleList);
</script>
buf_end
    }

    return $date_tag;
}
sub get_month_select_tag4ajx {
    my ($session,$mode,$mm,$m_name) = @_;

# mode=1 月='--' の表示あり。

    my($date_tag,$m_option);
    if (!$m_name){$m_name='mm';}
    if ($mode eq '1'){
        $m_option = '<option>--';
    }

    if (DA::Ajax::date_selector_ok($session)) {
        if (DA::IS::get_user_lang($session) eq 'ja'){
            my $mm_tag = DA::CGIdef::get_mm_option($mm);
            $date_tag="<table border=0>"
                     ."<tr>"
                     ."<td><select name=$m_name id=$m_name>$m_option$mm_tag</select></td>"
                     ."<td>".t_('月')."</td>"
                     ."</tr>"
                     ."</table>";
        } else {
            my $mm_tag = DA::CGIdef::get_mm_option2($session,$mm);
            $date_tag="<table border=0>"
                     ."<tr>"
                     ."<td><select name=$m_name id=$m_name>$m_option$mm_tag</select></td>"
                     ."</tr>"
                     ."</table>";
        }
    } else {
        if (DA::IS::get_user_lang($session) eq 'ja'){
            my $mm_tag = DA::CGIdef::get_mm_option($mm);
            $date_tag="<select name=$m_name id=$m_name>$m_option$mm_tag</select>"
                     .t_('月');
        } else {
            my $mm_tag = DA::CGIdef::get_mm_option2($session,$mm);
            $date_tag="<select name=$m_name id=$m_name>$m_option$mm_tag</select>";
        }
    }

    return $date_tag;
}
sub get_time_select_tag4ajx {
    my ($session,$mode,$hh,$mi,$h_name,$m_name,$none,$mi_int) = @_;

# mode=1 「24時」表示あり。

    my($hh_tag,$mi_tag);
    if ($m_name) {
        $hh_tag = DA::CGIdef::get_hh_option2($session,$hh,$mode);
        $mi_tag = DA::CGIdef::get_mi_option($mi,$mi_int);
    } else {
        $hh_tag = DA::CGIdef::get_hh_option2($session,$hh,$mode,1);
    }
    my($time_tag,$h_option,$m_option);
    if (!$h_name){$h_name='hh';}
    if(!$none){
        $h_option = "<option value='--'>--</option>";
        $m_option = "<option value='--'>--</option>";
    }elsif($none eq '2'){
        $h_option = "<option value='00'>".t_('なし')."</option>";
        $m_option = "<option value='00'>".t_('なし')."</option>";
    }elsif($none eq '3'){
        $h_option = "<option value=''>".t_('なし')."</option>";
        $m_option = "<option value=''>".t_('なし')."</option>";
    }elsif($none eq '4'){
        $h_option = "<option value='hh'>--</option>";
        $m_option = "<option value='mm'>--</option>";
    }elsif($none eq '5'){
		$h_option = "<option value='--'>"."--";
		$m_option = "<option value='--'>"."--";	
    }

    if (DA::Ajax::date_selector_ok($session)) {
        if (DA::IS::get_user_lang($session) eq 'ja'){
            $time_tag="<table border=0>"
                     ."<tr>"
                     ."<td><select name=$h_name id=$h_name>$h_option$hh_tag</select></td>";
            if ($m_name) {
                $time_tag.="<td>".N_('時')."</td>";
                $time_tag.="<td><select name=$m_name id=$m_name>$m_option$mi_tag</select></td>"
                         . "<td>".N_("分")."</td>";
            }
            $time_tag.="</tr>"
                     . "</table>";
        } else {
            $time_tag="<table border=0>"
                     ."<tr>"
                     ."<td><select name=$h_name id=$h_name>$h_option$hh_tag</select></td>";
            if ($m_name) {
                $time_tag.="<td>:</td>"
                         . "<td><select name=$m_name id=$m_name>$m_option$mi_tag</select></td>";
            }
            $time_tag.="</tr>"
                     . "</table>";
        }
    } else {
        if (DA::IS::get_user_lang($session) eq 'ja'){
            $time_tag="<select name=$h_name id=$h_name>$h_option$hh_tag</select>";
            if ($m_name) {
                $time_tag.=N_('時');
                $time_tag.="<select name=$m_name id=$m_name>$m_option$mi_tag</select>" . N_("分");
            }
        } else {
            $time_tag="<select name=$h_name id=$h_name>$h_option$hh_tag</select>";
            if ($m_name) {
                $time_tag.=":<select name=$m_name id=$m_name>$m_option$mi_tag</select>";
            }
        }
    }

    return $time_tag;
}

sub get_calendar_tag4ajx {
	my ($session, $id) = @_;

	if (!DA::Ajax::date_selector_ok($session)) {
		return undef;
	}

	my $cal_tag=<<end_tag;
<table border=0><tr><td id=$id>&nbsp;</td></tr></table>
end_tag

	return $cal_tag;
}

sub get_datetime_select_js4ajx {
	my ($session, $name, $yy, $mm, $dd, $hh, $mi, $ss, $cal, $cfg) = @_;
	my $lang = (DA::IS::get_user_lang($session) eq "ja") ? "ja" : "en";
	my $first = 0;
	my ($yy_ib, $yy_is, $yy_ie);

	if (!DA::Ajax::date_selector_ok($session)) {
		return(undef, undef);
	}

	if ($cfg) {
		$yy_ib = $cfg->{yy} || $yy_ib;
		$yy_is = $cfg->{start_yy} || $yy_is;
		$yy_ie = $cfg->{end_yy} || $yy_ie;
		$first = ($cfg->{first_day} eq "") ? $first : $cfg->{first_day};
	}
	if (!$yy_ib || int($yy_ib) eq 0) {
		$yy_ib = DA::CGIdef::get_date('Y4');
	}
	if (!defined $yy_is) {
		$yy_is = $yy_ib - 3;
	}
	if (!defined $yy_ie) {
		$yy_ie = $yy_ib + 3;
	}

	my ($years, $holidays, $day_colors) = DA::IS::get_holiday_params($session, $yy_is, $yy_ie);

	my $year_list    = DA::Ajax::make_json($session, $years, undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset());
	my $holiday_list = DA::Ajax::make_json($session, $holidays, undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset());
	my $daycolor_list = DA::Ajax::make_json($session, $day_colors, undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset());

	if ($yy) {
		$yy = "\$('$yy')";
	} else {
		$yy = "null";
	}
	if ($mm) {
		$mm = "\$('$mm')";
	} else {
		$mm = "null";
	}
	if ($dd) {
		$dd = "\$('$dd')";
	} else {
		$dd = "null";
	}
	if ($hh) {
		$hh = "\$('$hh')";
	} else {
		$hh = "null";
	}
	if ($mi) {
		$mi = "\$('$mi')";
	} else {
		$mi = "null";
	}
	if ($ss) {
		$ss = "\$('$ss')";
	} else {
		$ss = "null";
	}
	if ($cal) {
		$cal = "\$('$cal')";
	} else {
		$cal = "null";
	}

	my $init_js=<<end_js;
$name = new DA.cal.DateSelector ({
    yyNode: $yy,
    mmNode: $mm,
    ddNode: $dd,
    hhNode: $hh,
    miNode: $mi,
    ssNode: $ss,
    calNode: $cal,
    lang: '$lang',
    firstDay: $first,
    yearList: $year_list,
	holidayList: $holiday_list,
	customDayColorList: $daycolor_list
});
end_js

	my $set_js=<<end_js;
$name\.syncAll();
@{[($yy eq "null") ? "" : "$yy.value = ($name.holidayList[$name.yySelector.getValue()]) ? $name.yySelector.getValue() : $yy_ib"]}
@{[($mm eq "null") ? "" : "$mm.value = $name._getMonthNumber($name.mmSelector.getValue());"]}
@{[($hh eq "null") ? "" : "$hh.value = $name._getHourNumber($name.hhSelector.getValue());"]}
end_js

	return($init_js, $set_js);
}

sub get_datetime_select_js_with_slieder4ajx {
	my ($session, $start, $end, $slider, $cfg) = @_;
	my $lang  = (DA::IS::get_user_lang($session) eq "ja") ? "ja" : "en";
	my $time_style = ($session->{time_style} eq "12h") ? "12h" : "24h";
	my $first = 0;
	my $resolution = 15;	# default 15 mins
	my $scale = 9;		 	# 24 * 4 = 96 pixels
							# scale=9 -> 864 pixels (96 * 9)
							# 3pixels for 5 minutes.
	my $show_slider = 1;
	my ($yy_ib, $yy_is, $yy_ie);

	if (!DA::Ajax::date_selector_ok($session) && !DA::Ajax::time_slider_ok($session)) {
		return(undef, undef, undef);
	}

	if ($cfg) {
		$yy_ib = $cfg->{yy} || $yy_ib;
		$yy_is = $cfg->{start_yy} || $yy_is;
		$yy_ie = $cfg->{end_yy} || $yy_ie;
		$first = ($cfg->{first_day} eq "") ? $first : $cfg->{first_day};
		$resolution = ($cfg->{interval} eq "") ? $resolution : $cfg->{interval};
		# TimeRangeSlider cannot support a resolution lesser than 5 minutes!
		$resolution = $resolution < 5 ? 5 : $resolution;
		$scale = $resolution * (3/5);	# maintain 3 pixels for 5 minutes.
		$show_slider = $cfg->{no_slider} ? 0 : 1;
	}
	if (!$yy_ib || int($yy_ib) eq 0) {
		$yy_ib = DA::CGIdef::get_date('Y4');
	}
	if (!defined $yy_is) {
		$yy_is = $yy_ib - 3;
	}
	if (!defined $yy_ie) {
		$yy_ie = $yy_ib + 3;
	}

	my ($years, $holidays, $day_colors) = DA::IS::get_holiday_params($session, $yy_is, $yy_ie);

	my $year_list    = DA::Ajax::make_json($session, $years, undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset());
	my $holiday_list = DA::Ajax::make_json($session, $holidays, undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset());
	my $daycolor_list = DA::Ajax::make_json($session, $day_colors, undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset());

	my $p = {};
	%{$p->{s}} = %{$start};
	%{$p->{e}} = %{$end};
	foreach my $k1 (qw(s e)) {
		foreach my $k2 (qw(yy mm dd hh mi ss cal)) {
			if ($p->{$k1}->{$k2}) {
				$p->{$k1}->{$k2} = "\$('$p->{$k1}->{$k2}')";
			} else {
				$p->{$k1}->{$k2} = "null";
			}
		}
	}

	my $time_range_slider = ($show_slider && DA::Ajax::time_slider_ok($session)) ? DA::Ajax::make_json($session, {
        	renderTo	=> $slider,
			resolution	=> $resolution,
			scale		=> $scale,
    	}, 
		undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset()
	) : 'false';

	my $lite = (DA::Ajax::date_selector_ok($session)) ? "false" : "true";

    my $init_js=<<end_js;
DA.scheduler.EditPage.init({
    rangeSelector: {
        startConfig: {
            yyNode: $p->{s}->{yy},
            mmNode: $p->{s}->{mm},
            ddNode: $p->{s}->{dd},
            hhNode: $p->{s}->{hh},
            miNode: $p->{s}->{mi},
            ssNode: $p->{s}->{ss},
            calNode: $p->{s}->{cal},
            lite: $lite
        },
        endConfig: {
            yyNode: $p->{e}->{yy},
            mmNode: $p->{e}->{mm},
            ddNode: $p->{e}->{dd},
            hhNode: $p->{e}->{hh},
            miNode: $p->{e}->{mi},
            ssNode: $p->{e}->{ss},
            calNode: $p->{e}->{cal},
            lite: $lite
        },
        commonConfig: {
            lang: '$lang',
            timeStyle: '$time_style',
            firstDay: $first,
            yearList: $year_list,
            holidayList: $holiday_list,
            customDayColorList: $daycolor_list
        }
    },
    timeRangeSlider: $time_range_slider 
});
end_js

    my $set_js=<<end_js;
var start = DA.scheduler.EditPage.dateRangeSelector.startDateSelector;
var end   = DA.scheduler.EditPage.dateRangeSelector.endDateSelector;

start.syncAll();
end.syncAll();

end_js

	$set_js.=<<end_js if ($p->{s}->{yy} ne "null");
$p->{s}->{yy}.value = (start.holidayList[start.yySelector.getValue()]) ? start.yySelector.getValue() : $yy_ib;
end_js

	$set_js.=<<end_js if ($p->{e}->{yy} ne "null");
$p->{e}->{yy}.value = (end.holidayList[end.yySelector.getValue()]) ? end.yySelector.getValue() : $yy_ib;
end_js

	$set_js.=<<end_js if ($p->{s}->{mm} ne "null");
$p->{s}->{mm}.value = start._getMonthNumber(start.mmSelector.getValue());
end_js

	$set_js.=<<end_js if ($p->{e}->{mm} ne "null");
$p->{e}->{mm}.value = end._getMonthNumber(end.mmSelector.getValue());
end_js

    $set_js.=<<end_js if ($p->{s}->{hh} ne "null");
$p->{s}->{hh}.value = start._getHourNumber(start.hhSelector.getValue());
end_js

    $set_js.=<<end_js if ($p->{e}->{hh} ne "null");
$p->{e}->{hh}.value = end._getHourNumber(end.hhSelector.getValue());
end_js

	$set_js.=<<end_js if ($p->{s}->{mi} ne "null");
if ($p->{s}->{mi}.value !== "--") {
    if (parseInt($p->{s}->{mi}.value, 10) \% $resolution !== 0) {
        $p->{s}->{mi}.value = parseInt(parseInt($p->{s}->{mi}.value, 10) / $resolution, 10) * $resolution;
        $p->{s}->{mi}.value = $p->{s}->{mi}.value + "";
    }
}
end_js

	$set_js.=<<end_js if ($p->{e}->{mi} ne "null"); 
if ($p->{e}->{mi}.value !== "--") {
    if (parseInt($p->{e}->{mi}.value, 10) \% $resolution !== 0) {
        $p->{e}->{mi}.value = parseInt(parseInt($p->{e}->{mi}.value, 10) / $resolution, 10) * $resolution;
        $p->{e}->{mi}.value = $p->{e}->{mi}.value + "";
    }
}
end_js

    return($slider, $init_js, $set_js);
}

sub get_holiday_params {
	my ($session, $start, $end) = @_;
	my ($h_list, $wday_list) = DA::IS::get_holiday_list($session, $start, $end);
	my $holidays = {};
	my $day_colors = {};

	foreach my $y (keys %{$h_list}) {
		foreach my $md (keys %{$h_list->{$y}}) {
			if (exists $h_list->{$y}->{$md} && $h_list->{$y}->{$md}->{holiday}) {
				my $year  = int($y);
				my $month = int(substr($md, 0, 2));
				my $day   = int(substr($md, 2, 2));
				$holidays->{$year}->{$month}->{$day} = 1;
			}
			if (exists $h_list->{$y}->{$md} && $h_list->{$y}->{$md}->{type} eq 3
			&& $h_list->{$y}->{$md}->{color}){
				my $year  = int($y);
				my $month = int(substr($md, 0, 2));
				my $day   = int(substr($md, 2, 2));
				my $color = DA::CGIdef::conv_font_color($h_list->{$y}->{$md}->{color});
				if($color && $color ne '#'){
					$day_colors->{$year}->{$month}->{$day} = $color;
				}
			}
		}
	}
	foreach my $y ($start .. $end) {
		my $year = int($y);
		if (!exists $holidays->{$year}) {
			$holidays->{$year} = {};
		}
	}

	my $year_list = [($start .. $end)];

	return($year_list, $holidays, $day_colors);
}

sub get_date_select_popup {
	my ($session, $from, $sub, $mode, $detail, $clear_label, $clear_mode, $bar_need) = @_;
	unless ($sub) {
		$sub = 0;
	}
	if (!$bar_need) {
		$bar_need = 0;
	}
	my $obj	= {};
	my ($cal_x, $cal_y) = (650, 480);
	my ($pop_x, $pop_y) = (180, 450);
	my ($calProc_add, $timeProc_add, $timeProc_add2);

	if ($from eq 'sc_regist' || $from eq 'fa_regist' || $from eq 'sc_op_fa') {
		if (DA::Ajax::date_selector_ok($session) || DA::Ajax::time_slider_ok($session)) {
			my $return = 'return;' if DA::Ajax::date_selector_ok($session);
			$calProc_add=<<end_js;
    var drs;
    if (DA && DA.scheduler && DA.scheduler.EditPage && 
        (drs = DA.scheduler.EditPage.dateRangeSelector) &&
        ('function' === typeof drs.setValue)) {
        drs.setValue(
            { yy:s_yy, mm:s_mm, dd:s_dd, hh:s_hh, mi:s_mi }, // START
            { yy:e_yy, mm:e_mm, dd:e_dd, hh:e_hh, mi:e_mi }, // END
            ('fireEvents' == 'fireEvents')      // fire events is true
        );
        $return
    }
end_js

			$timeProc_add=<<end_js;
    var drs;
    if (DA && DA.scheduler && DA.scheduler.EditPage && 
        (drs = DA.scheduler.EditPage.dateRangeSelector) &&
        ('function' === typeof drs.setValue)) {
        drs.setValue(
            (target == 's_time') ? { hh:hh, mi:mi } : {},   // Start time
            (target == 'e_time') ? { hh:hh, mi:mi } : {},   // End time
            ('fireEvents' == 'fireEvents')      // fire events is true
        );
        return;
    }
end_js

			$timeProc_add2=<<end_js;
    var drs;
    if (DA && DA.scheduler && DA.scheduler.EditPage && 
        (drs = DA.scheduler.EditPage.dateRangeSelector) &&
        ('function' === typeof drs.setValue)) {
        drs.setValue(
            { hh:s_hh, mi:s_mi }, // START
            { hh:e_hh, mi:e_mi }, // END
            ('fireEvents' == 'fireEvents')      // fire events is true
        );
        $return
    }
end_js
		}
	}
	
	if ($from eq 'sc_regist' || $from eq 'fa_regist') {
		$obj	= {
			"form"	=> "document.forms[0]",
			"s_yy"	=> "s_yy",
			"s_mm"	=> "s_mm",
			"s_dd"	=> "s_dd",
			"s_hh"	=> "s_hh",
			"s_mi"	=> "s_mi",
			"e_yy"	=> "e_yy",
			"e_mm"	=> "e_mm",
			"e_dd"	=> "e_dd",
			"e_hh"	=> "e_hh",
			"e_mi"	=> "e_mi"
		};
        if ($from eq 'sc_regist') {
            if ($detail eq '2')    { $cal_x=350; $cal_y=320;}
            elsif ($detail eq '3') { $cal_x=190; $cal_y=320;}
            if ($detail eq '2') {
                $obj = {
                    "form"  => "document.forms[0]",
                    "s_yy"  => "s_yy",
                    "s_mm"  => "s_mm",
                    "s_dd"  => "s_dd",
                    "e_yy"  => "e_yy",
                    "e_mm"  => "e_mm",
                    "e_dd"  => "e_dd"
                };
            } elsif ($detail eq '3') {
                $obj = {
                    "form"  => "document.forms[0]",
                    "s_yy"  => "s_yy",
                    "s_mm"  => "s_mm",
                    "s_dd"  => "s_dd"
                };
            }
        }
	} elsif (($from eq 'sc_reminder')||($from eq 'user_calendar_custom')) {
		$obj	= {
			"form"	=> "document.forms[0]",
			"s_yy"	=> "yy",
			"s_mm"	=> "mm",
			"s_dd"	=> "dd"
		};
		$cal_x = 190;
	} elsif ($from eq 'system_check'){
		if($sub){
			$obj	= {
				"form"  => "document.forms[0]",
				"s_yy"  => "s_yy",
				"s_mm"  => "s_mm",
				"s_dd"  => "s_dd"
			};
			$cal_x = 190;
		}else{
			$obj	= {
				"form"  => "document.forms[0]",
				"s_yy"  => "s_yy",
				"s_mm"  => "s_mm",
				"s_dd"  => "s_dd",
				"e_yy"  => "e_yy",
				"e_mm"  => "e_mm",
				"e_dd"  => "e_dd"
			};
			$cal_x = 350;
		}
	} elsif ($from eq 'todo_detail') {
		$obj	= {
			"form"	=> "document.forms[0]",
			"s_yy"	=> "start_yy",
			"s_mm"	=> "start_mm",
			"s_dd"	=> "start_dd",
			"s_hh"	=> "start_hh",
			"e_yy"	=> "end_yy",
			"e_mm"	=> "end_mm",
			"e_dd"	=> "end_dd",
			"e_hh"	=> "end_hh"
		};
	} elsif ($from eq 'mf_facilities') {
		if ($sub) {
			$obj	= {
				"form"	=> "document.forms[0]",
				"s_hh"	=> "s_ts_hh",
				"s_mi"	=> "s_ts_mi",
				"e_hh"	=> "e_ts_hh",
				"e_mi"	=> "e_ts_mi"
			};
		} else {
			$obj	= {
				"form"	=> "document.forms[0]",
				"s_yy"	=> "s_yy",
				"s_mm"	=> "s_mm",
				"s_dd"	=> "s_dd",
				"s_hh"	=> "s_hh",
				"e_yy"	=> "e_yy",
				"e_mm"	=> "e_mm",
				"e_dd"	=> "e_dd",
				"e_hh"	=> "e_hh"
			};
		}
	} elsif ($from =~ /^(docset_f|docset_i|library_f)$/) {
		if ($sub) {
			if($mode eq '2'){
				$obj    = {
					"form"  => "document.forms[0]",
					"e_yy"  => "d_yy",
					"e_mm"  => "d_mm",
					"e_dd"  => "d_dd",
					"e_hh"  => "d_hh"
				};
			}else{
				$obj    = {
					"form"  => "document.forms[0]",
					"s_yy"  => "d_yy",
					"s_mm"  => "d_mm",
					"s_dd"  => "d_dd",
					"s_hh"  => "d_hh"
				};
			}
			$cal_x = 280;
		} else {
			if($mode eq '2'){
				$obj    = {
					"form"  => "document.forms[0]",
					"e_yy"  => "r_yy",
					"e_mm"  => "r_mm",
					"e_dd"  => "r_dd",
					"e_hh"  => "r_hh"
				};
			}else{
				$obj    = {
					"form"  => "document.forms[0]",
					"s_yy"  => "r_yy",
					"s_mm"  => "r_mm",
					"s_dd"  => "r_dd",
					"s_hh"  => "r_hh"
				};
			}
			$cal_x = 280;
		}
	}elsif ($from eq 'wf_detail') {
        $obj    = {
        	    "form"  => "document.forms[0]",
	            "s_yy"  => "yy",
	            "s_mm"  => "mm",
	            "s_dd"  => "dd",
	            "s_hh"  => "hh"
	        };
		$cal_x = 280;
	}elsif ($from eq 'wf_represent'){
		$obj	= {
			"form"  => "document.forms[0]",
			"s_yy"  => "start_yy",
			"s_mm"  => "start_mm",
			"s_dd"  => "start_dd",
			"s_hh"  => "start_time",
			"e_yy"  => "end_yy",
			"e_mm"  => "end_mm",
			"e_dd"  => "end_dd",
			"e_hh"  => "end_time"
		};
    } elsif ($from eq 'sc_op_fa') {
        $obj = {
            "form"  => "document.forms[0]",
            "s_yy"  => "chk_s_yy",
            "s_mm"  => "chk_s_mm",
            "s_dd"  => "chk_s_dd",
            "s_hh"  => "chk_s_hh",
            "s_mi"  => "chk_s_mi",
            "e_yy"  => "chk_e_yy",
            "e_mm"  => "chk_e_mm",
            "e_dd"  => "chk_e_dd",
            "e_hh"  => "chk_e_hh",
            "e_mi"  => "chk_e_mi"
        };
	} elsif($from eq 'bd_regist'){
		if($sub){
			$obj={
				"form"  => "document.forms[0]",
				"s_yy"  => "s_yy",
				"s_mm"  => "s_mm",
				"s_dd"  => "s_dd",
				"s_hh"  => "s_hh",
			};
			$cal_x = 280;
		}else{
			$obj={
				"form"  => "document.forms[0]",
				"s_yy"  => "s_yy",
				"s_mm"  => "s_mm",
				"s_dd"  => "s_dd",
				"s_hh"  => "s_hh",
				"e_yy"  => "e_yy",
				"e_mm"  => "e_mm",
				"e_dd"  => "e_dd",
				"e_hh"  => "e_hh"
			};
		}
	} elsif($from eq 'lib_folder_expire' || $from eq 'lib_file_expire'){
			$obj={
				"form"  => "document.forms[0]",
				"s_yy"  => "s_yy",
				"s_mm"  => "s_mm",
				"s_dd"  => "s_dd",
				"s_hh"  => "s_hh",
				"e_yy"  => "d_yy",
				"e_mm"  => "d_mm",
				"e_dd"  => "d_dd",
				"e_hh"  => "d_hh"
			};
	} elsif ($from eq 'view_operation_log' || $from eq 'get_operation_log') {
		$obj = {
			"form"  => "document.forms[0]",
			"s_yy"  => "start_yy",
			"s_mm"  => "start_mm",
			"s_dd"  => "start_dd",
			"e_yy"  => "end_yy",
			"e_mm"  => "end_mm",
			"e_dd"  => "end_dd"
		};
		$cal_x = 350;
	} else {
		$obj	= {
			"form"	=> "document.forms[0]",
			"s_yy"	=> "s_yy",
			"s_mm"	=> "s_mm",
			"s_dd"	=> "s_dd",
			"s_hh"	=> "s_hh",
			"e_yy"	=> "e_yy",
			"e_mm"	=> "e_mm",
			"e_dd"	=> "e_dd",
			"e_hh"	=> "e_hh"
		};
	}

	## add by TOMITA ( 2006.08.08 )
	my $clear_js;
	my $clear_btn;

	if ( $obj->{e_yy} && $clear_mode eq "1"){
		# 終了期日をクリアする
		if ( $obj->{e_yy} ){ $clear_js = sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{e_yy} ); }
		if ( $obj->{e_mm} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{e_mm} ); }
		if ( $obj->{e_dd} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{e_dd} ); }
		if ( $obj->{e_hh} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{e_hh} ); }
	}elsif($clear_mode eq "0"){
		# 開始期日をクリアする
		if ( $obj->{s_yy} ){ $clear_js = sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{s_yy} ); }
		if ( $obj->{s_mm} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{s_mm} ); }
		if ( $obj->{s_dd} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{s_dd} ); }
		if ( $obj->{s_hh} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{s_hh} ); }
	}elsif($clear_mode eq "2"){
		# 開始期日と終了期日の両方をクリアする
		if ( $obj->{s_yy} ){ $clear_js = sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{s_yy} ); }
		if ( $obj->{s_mm} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{s_mm} ); }
		if ( $obj->{s_dd} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{s_dd} ); }
		if ( $obj->{s_hh} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{s_hh} ); }
		if ( $obj->{e_yy} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{e_yy} ); }
		if ( $obj->{e_mm} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{e_mm} ); }
		if ( $obj->{e_dd} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{e_dd} ); }
		if ( $obj->{e_hh} ){ $clear_js .= sprintf("%s.%s.selectedIndex=0;", $obj->{form}, $obj->{e_hh} ); }
	}

	$clear_btn = sprintf("<input type=button name=date_clear value=\"%s\" onClick=\"javascript:%s\" >", $clear_label, $clear_js );
	############################################################################

	my $cal_s_yy	=<<end_tag if ($obj->{s_yy});
    $obj->{form}.$obj->{s_yy}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{s_yy}.options.length; i ++) {
        if ($obj->{form}.$obj->{s_yy}.options[i].value == s_yy) {
            $obj->{form}.$obj->{s_yy}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $cal_s_mm	=<<end_tag if ($obj->{s_mm});
    $obj->{form}.$obj->{s_mm}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{s_mm}.options.length; i ++) {
        if ($obj->{form}.$obj->{s_mm}.options[i].value == s_mm) {
            $obj->{form}.$obj->{s_mm}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $cal_s_dd	=<<end_tag if ($obj->{s_dd});
    $obj->{form}.$obj->{s_dd}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{s_dd}.options.length; i ++) {
        if ($obj->{form}.$obj->{s_dd}.options[i].value == s_dd) {
            $obj->{form}.$obj->{s_dd}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $cal_s_hh	=<<end_tag if ($obj->{s_hh});
    $obj->{form}.$obj->{s_hh}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{s_hh}.options.length; i ++) {
        if ($obj->{form}.$obj->{s_hh}.options[i].value == s_hh) {
            $obj->{form}.$obj->{s_hh}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $cal_s_mi	=<<end_tag if ($obj->{s_mi});
    $obj->{form}.$obj->{s_mi}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{s_mi}.options.length; i ++) {
        if ($obj->{form}.$obj->{s_mi}.options[i].value == s_mi) {
            $obj->{form}.$obj->{s_mi}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $cal_e_yy	=<<end_tag if ($obj->{e_yy});
    $obj->{form}.$obj->{e_yy}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{e_yy}.options.length; i ++) {
        if ($obj->{form}.$obj->{e_yy}.options[i].value == e_yy) {
            $obj->{form}.$obj->{e_yy}.options.selectedIndex = i;
            break;
        }
    }
end_tag
	my $cal_e_mm	=<<end_tag if ($obj->{e_mm});
    $obj->{form}.$obj->{e_mm}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{e_mm}.options.length; i ++) {
        if ($obj->{form}.$obj->{e_mm}.options[i].value == e_mm) {
            $obj->{form}.$obj->{e_mm}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $cal_e_dd	=<<end_tag if ($obj->{e_dd});
    $obj->{form}.$obj->{e_dd}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{e_dd}.options.length; i ++) {
        if ($obj->{form}.$obj->{e_dd}.options[i].value == e_dd) {
            $obj->{form}.$obj->{e_dd}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $cal_e_hh	=<<end_tag if ($obj->{e_hh});
    $obj->{form}.$obj->{e_hh}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{e_hh}.options.length; i ++) {
        if ($obj->{form}.$obj->{e_hh}.options[i].value == e_hh) {
            $obj->{form}.$obj->{e_hh}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $cal_e_mi	=<<end_tag if ($obj->{e_mi});
    $obj->{form}.$obj->{e_mi}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{e_mi}.options.length; i ++) {
        if ($obj->{form}.$obj->{e_mi}.options[i].value == e_mi) {
            $obj->{form}.$obj->{e_mi}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $time_s_hh	=<<end_tag if ($obj->{s_hh});
    $obj->{form}.$obj->{s_hh}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{s_hh}.options.length; i ++) {
        if ($obj->{form}.$obj->{s_hh}.options[i].value == hh) {
            $obj->{form}.$obj->{s_hh}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $time_s_mi	=<<end_tag if ($obj->{s_mi});
    $obj->{form}.$obj->{s_mi}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{s_mi}.options.length; i ++) {
        if ($obj->{form}.$obj->{s_mi}.options[i].value == mi) {
            $obj->{form}.$obj->{s_mi}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $time_e_hh	=<<end_tag if ($obj->{e_hh});
    $obj->{form}.$obj->{e_hh}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{e_hh}.options.length; i ++) {
        if ($obj->{form}.$obj->{e_hh}.options[i].value == hh) {
            $obj->{form}.$obj->{e_hh}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $time_e_mi	=<<end_tag if ($obj->{e_mi});
    $obj->{form}.$obj->{e_mi}.options.selectedIndex = 0;
    for (var i = 0; i < $obj->{form}.$obj->{e_mi}.options.length; i ++) {
        if ($obj->{form}.$obj->{e_mi}.options[i].value == mi) {
            $obj->{form}.$obj->{e_mi}.options.selectedIndex = i;
            break;
        }
    }
end_tag

	my $cal_s_mm_onchange	=<<end_tag if ($obj->{s_mm});
	if ($obj->{form}.$obj->{s_mm}.onchange) {
	        $obj->{form}.$obj->{s_mm}.onchange();
	}
end_tag

	my $cal_e_mm_onchange	=<<end_tag if ($obj->{e_mm});
	if ($obj->{form}.$obj->{e_mm}.onchange) {
	        $obj->{form}.$obj->{e_mm}.onchange();
	}
end_tag

	my $cal_s_hh_onchange	=<<end_tag if ($obj->{s_hh});
	if ($obj->{form}.$obj->{s_hh}.onchange) {
	        $obj->{form}.$obj->{s_hh}.onchange();
	}
end_tag

	my $cal_e_hh_onchange	=<<end_tag if ($obj->{e_hh});
	if ($obj->{form}.$obj->{e_hh}.onchange) {
	        $obj->{form}.$obj->{e_hh}.onchange();
	}
end_tag

	my $cal_pop		=<<end_tag;
<a href="javascript:void(0);" onClick="calPop$sub();"><img src=$session->{img_rdir}/ico_fc_schedule.gif border=0 width=14 height=14 alt=@{[t_('簡易入力')]} valign=top></a>
end_tag

	my $s_time_pop	=<<end_tag;
<a href="javascript:void(0);" onClick="timePop$sub('s_time');"><img src=$session->{img_rdir}/im_date.gif border=0 width=14 height=14 alt=@{[t_('簡易入力')]} valign=top></a>
end_tag

	my $e_time_pop	=<<end_tag;
<a href="javascript:void(0);" onClick="timePop$sub('e_time');"><img src=$session->{img_rdir}/im_date.gif border=0 width=14 height=14 alt=@{[t_('簡易入力')]} valign=top></a>
end_tag

	my $js	=<<end_tag if (!$sub);
var _bro = getBrowser();
var mouse_x, mouse_y;
if(_bro == 1){
    document.captureEvents(Event.MOUSEDOWN);
    document.onmousedown = clickCapture ;
}else{
    if(_bro == 2){
       document.captureEvents(Event.MOUSEDOWN);
       document.onmousedown = clickCaptureNN4 ;
    }
}
function clickCapture(e){
    mouse_x = e.screenX;
    mouse_y = e.screenY;
    // $obj->{form}.mouse_x.value = e.screenX;
    // $obj->{form}.mouse_y.value = e.screenY;
}
function clickCaptureNN4(e){
    mouse_x = e.screenX;
    mouse_y = e.screenY;
    // $obj->{form}.mouse_x.value = e.screenX;
    // $obj->{form}.mouse_y.value = e.screenY;
}
end_tag

	$js	.=<<end_tag;
function calPop$sub(){
    var s_yy = @{[($obj->{s_yy}) ? "$obj->{form}.$obj->{s_yy}.options[$obj->{form}.$obj->{s_yy}.selectedIndex].value" : "'0000'"]};
    var s_mm = @{[($obj->{s_mm}) ? "$obj->{form}.$obj->{s_mm}.options[$obj->{form}.$obj->{s_mm}.selectedIndex].value" : "'00'"]};
    var s_dd = @{[($obj->{s_dd}) ? "$obj->{form}.$obj->{s_dd}.options[$obj->{form}.$obj->{s_dd}.selectedIndex].value" : "'00'"]};
    var s_hh = @{[($obj->{s_hh}) ? "$obj->{form}.$obj->{s_hh}.options[$obj->{form}.$obj->{s_hh}.selectedIndex].value" : "'00'"]};
    var s_mi = @{[($obj->{s_mi}) ? "$obj->{form}.$obj->{s_mi}.options[$obj->{form}.$obj->{s_mi}.selectedIndex].value" : "'00'"]};
    var e_yy = @{[($obj->{e_yy}) ? "$obj->{form}.$obj->{e_yy}.options[$obj->{form}.$obj->{e_yy}.selectedIndex].value" : "'0000'"]};
    var e_mm = @{[($obj->{e_mm}) ? "$obj->{form}.$obj->{e_mm}.options[$obj->{form}.$obj->{e_mm}.selectedIndex].value" : "'00'"]};
    var e_dd = @{[($obj->{e_dd}) ? "$obj->{form}.$obj->{e_dd}.options[$obj->{form}.$obj->{e_dd}.selectedIndex].value" : "'00'"]};
    var e_hh = @{[($obj->{e_hh}) ? "$obj->{form}.$obj->{e_hh}.options[$obj->{form}.$obj->{e_hh}.selectedIndex].value" : "'00'"]};
    var e_mi = @{[($obj->{e_mi}) ? "$obj->{form}.$obj->{e_mi}.options[$obj->{form}.$obj->{e_mi}.selectedIndex].value" : "'00'"]};
    var yy = @{[($obj->{s_yy}) ? "$obj->{form}.$obj->{s_yy}.options[0].value" : "'0000'"]};
    var cgi_param = 'sc_time_popup2.cgi%3ffrom=$from%20sub=$sub%20mode=$mode%20detail=$detail%20yy=' + yy +
                    '%20s_yy=' + s_yy + '%20s_mm=' + s_mm +
                    '%20s_dd=' + s_dd + '%20s_hh=' + s_hh + '%20s_mi=' + s_mi +
                    '%20e_yy=' + e_yy + '%20e_mm=' + e_mm +
                    '%20e_dd=' + e_dd + '%20e_hh=' + e_hh + '%20e_mi=' + e_mi +
                    '%20bar_need=' + $bar_need;
    Pop(cgi_param,'pop_title_calendar.gif',$cal_x,$cal_y,'',1);
}
function timePop$sub(target){
    var x;
    var y;
    if(_bro == 1 || _bro == 2){
        x = mouse_x;
        y = mouse_y;
        // x = $obj->{form}.elements["mouse_x"].value;
        // y = $obj->{form}.elements["mouse_y"].value;
    }else{
        x = event.screenX;
        y = event.screenY;
    }
    var Param='left='+x+',top='+y+',width=$pop_x,height=$pop_y,resizable=1';
    var hh;var mi;
    if(target == 's_time'){
        hh=@{[($obj->{s_hh}) ? "$obj->{form}.$obj->{s_hh}.options[$obj->{form}.$obj->{s_hh}.selectedIndex].value" : "'00'"]};
        mi=@{[($obj->{s_mi}) ? "$obj->{form}.$obj->{s_mi}.options[$obj->{form}.$obj->{s_mi}.selectedIndex].value" : "'00'"]};
    }else{
        hh=@{[($obj->{e_hh}) ? "$obj->{form}.$obj->{e_hh}.options[$obj->{form}.$obj->{e_hh}.selectedIndex].value" : "'00'"]};
        mi=@{[($obj->{e_mi}) ? "$obj->{form}.$obj->{e_mi}.options[$obj->{form}.$obj->{e_mi}.selectedIndex].value" : "'00'"]};
    }
    var Url='$DA::Vars::p->{cgi_rdir}/sc_time_popup3.cgi?target='+target+
            '&from=$from&sub=$sub&mode=$mode&detail=$detail&hh=' + hh + '&mi=' + mi +
            '&bar_need=' + $bar_need;
    var pwin=window.open(setUrl(Url),'',Param);
}
function calProc$sub(s_yy, s_mm, s_dd, s_hh, s_mi, e_yy, e_mm, e_dd, e_hh, e_mi) {
$calProc_add
$cal_s_yy
$cal_s_mm
$cal_s_mm_onchange
$cal_s_dd
$cal_s_hh
$cal_s_mi
$cal_e_yy
$cal_e_mm
$cal_e_mm_onchange
$cal_e_dd
$cal_e_hh
$cal_e_mi
$timeProc_add2
$cal_s_hh_onchange
$cal_e_hh_onchange
}
function timeProc$sub(target, hh, mi) {
$timeProc_add
    if(target == 's_time'){
$time_s_hh
$time_s_mi
$cal_s_hh_onchange
    }else{
$time_e_hh
$time_e_mi
$cal_e_hh_onchange
    }
}
end_tag

	return ($cal_pop, $s_time_pop, $e_time_pop, $js, $clear_btn);
}

sub get_inc_search_tag4ajx {
	my ($session, $query, $param, $func, $obj_name, $cfg, $opt, $js) = @_;
	my $app_type = $cfg->{app_type} || 'common';
	my $only_one = ($cfg->{only_one}) ? "true" : "false";
	my $user_type = ($cfg->{user_type} eq "") ? 1 : $cfg->{user_type};
	my $group_type = ($cfg->{group_type} eq "") ? 2 : $cfg->{group_type};
	my $addr_type = ($cfg->{addr_type} eq "") ? 0 : $cfg->{addr_type};
	my $page_size = $cfg->{page_size} || 0;
	my $read_row = $cfg->{read_row} || 100;
	my $text_size = $cfg->{text_size} || 40;
	my $deny_add = ($cfg->{deny_add}) ? "true" : "false";
	my $deny_remove = ($cfg->{deny_remove}) ? "true" : "false";
	my $init_record = $cfg->{init_record} || '[]';
	my $init_contents = "'$cfg->{init_contents}'" || "null"; 
	my $open = ($opt) ? $param->{"$func\_open"} : $query->param("$func\_open");
	my $id = $func . "_id";
	my $queryDelay = ($cfg->{queryDelay} =~/^\d+$/) ? $cfg->{queryDelay}*1000 : 1000;
	if (!DA::Ajax::user_search_ok($session)) {
		return(undef, undef, undef, undef);
	}

	my $toggle_js=<<end_js;
$obj_name.toggleSearch(@{[($open) ? "true" : "false"]});
end_js

	my $custom_js;
	if ($cfg->{sync_secure}) {

		$custom_js=<<end_js;
    addItemCustom: function(record) {
        if (this.selectedRecord.length > 0) {
            $cfg->{sync_secure}.checked = true;
        }
    },
    removeItemCustom: function(id, opt) {
    },
end_js

	} elsif ($cfg->{need_myself}) {
		my $name = $session->{name};
		my $gname = $session->{primary_gname};
		if ($session->{user_view}) {
			$gname = DA::IS::dis_attach_user_info($session,$session->{user},$gname);
		} else {
			$gname = "";
		}

		my $myself = ($gname eq "") ? $name : "$name$gname";

		$custom_js=<<end_js;
    addItemCustom: function(record) {
        if (parseInt(record.id, 10) === $session->{user}) {
            \$('$cfg->{need_myself}').style.display = "none";
        } else {
            \$('$cfg->{need_myself}').style.display = "";
        }
    },
    removeItemCustom: function(id, opt) {
        if (this.selectedRecord.length === 0 && opt !== 1) {
			var record = $cfg->{init_record};
            this.addItem({
                id: $session->{user},
                data: {
                    type: 1,
                    name: '@{[js_esc_($myself)]}',
					tel3: record[0].tel3,
					sum : record[0].sum
                }
            });
        }
    },
end_js

	}

	if ($cfg->{extract_target}) {

		$custom_js.=<<end_js;
    extractItemCustom: function(id) {
        extractGroup('$cfg->{extract_target}', id);
    },
end_js

	}

	if ($cfg->{logout_target}) {
                $custom_js.=<<end_js;
    logoutItemCustom: function(id) {
        userLogout(id);
    },
end_js
        }

    # 引数で JavaScript を設定できるようにする
    if ($js) { $custom_js.=$js; }

	my $loadFunction  = $obj_name . "Load";
	my $clearFunction = $obj_name . "Clear";
	my $focusFunction = $obj_name . "Focus";
	my $openFunction  = $obj_name . "Open";
	my $closeFunction = $obj_name . "Close";

	my $tag=<<end_tag;
<table border=0 width=100% cellspacing=0 cellpadding=0>
<tr id="@{[$id . 'customSearch']}" style="@{[($open) ? '' : 'display:none;']}">
  <td style="padding-left:2px;background-color:#9F9F9F;" nowrap>@{[t_("検索")]}:</td>
  <td style="padding:2px;background-color:#9F9F9F;width:100%;">
    <input type="text" size="$text_size" onFocus="$focusFunction(this);">
  </td>
  <td style="background-color:#9F9F9F;" align="right">
    <span style="margin-right:5px;cursor:pointer;" onClick="$closeFunction();"><img src="$session->{img_rdir}/aqbtn_close2.gif" align=absmiddle></span>
  </td>
</tr>
<tr>
  <td style="width:100%;" colspan=2>
    <table width=100%>$cfg->{default_tag}</table>
  </td>
  <td align="right">
    <span id="@{[$id . 'customDisplay']}" style="margin-right:5px;cursor:pointer;@{[($open) ? 'display:none;' : '']}"><img src="$session->{img_rdir}/aqbtn_search_s.gif" align=absmiddle onClick="$openFunction();"></span>
  </td>
</tr>
</table>
end_tag

	my $hide_tag=<<end_tag;
<input type=hidden name=$func\_query id=$func\_query value="">
<input type=hidden name=$func\_open id=$func\_open value="0">
<input type=hidden name=$func\_data id=$func\_data value="0">
end_tag

	my $image_data = DA::Ajax::API::get_image_data4inc_search($session);

	my $init_js=<<end_js;
$loadFunction = function() {
$obj_name = new DA.ug.AccountSelector({
    selectorNode: \$('$id'),
    appType: '$app_type',
    onlyOne: $only_one,
    userType: $user_type,
    groupType: $group_type,
    addrType: $addr_type,
    pageSize: $page_size,
    readRow: $read_row,
    textSize: $text_size,
    denyAdd: $deny_add,
    denyRemove: $deny_remove,
	queryDelay: $queryDelay,
    searchTitle: '@{[t_("検索")]}:',
    imageData: @{[DA::Ajax::make_json($session, $image_data, undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset())]},
$custom_js
    initRecord: $init_record,
    initContents: $init_contents
});
$toggle_js
}
$clearFunction = function() {
    $loadFunction = null;
}
$openFunction = function() {
    $loadFunction();
    $clearFunction();
    $obj_name\.toggleSearch(true);
}
$focusFunction = function(obj) {
    obj.disabled = true;
    $loadFunction();
    $clearFunction();
    $obj_name\.textNode.focus();
    obj.disabled = false;
}
$closeFunction = function() {
    \$("@{[$id . 'customSearch']}").style.display = "none";
    \$("@{[$id . 'customDisplay']}").style.display = "";
}
window.deleteItem = function(target, id) {
    set_func();
    document.forms[0].elements['del_target'].value = target;
    document.forms[0].elements['del_target_id'].value = id;
    document.forms[0].submit();
}
end_js

	my $set_js;

	if ($cfg->{deny_add}) {

		$set_js=<<end_js;
\$('$func\_open').value = 0;
\$('$func\_data').value = 1;
end_js

	} else {

		$set_js=<<end_js;
if (typeof($loadFunction) === "function") {
    if (\$("@{[$id . 'customSearch']}").style.display === "none") {
        \$('$func\_open').value = 0;
    } else {
        \$('$func\_open').value = 1;
    }
    \$('$func\_data').value = 1;
} else {
    \$('$func\_query').value = $obj_name.recordList();
    \$('$func\_open').value = $obj_name.selectorStatus();
}
end_js

	}

	if ($DA::Vars::p->{FIREBUG}) {
		$init_js = qq{
			console.time("DA.ug.AccountSelector");
			$init_js
			console.timeEnd("DA.ug.AccountSelector");
		};
	}

	return($id, $tag, $hide_tag, $init_js, $set_js);
}

sub get_inc_search_data4ajx {
	my ($session, $query, $target, $func, $num, $cfg) = @_;
	my $flag = 0;

	if (!DA::Ajax::user_search_ok($session)) {
		return(0);
	}

	foreach my $t (@{$target}) {
		if ($query->param("$t\_open") ne "") {
			$flag = 1; last;
		}
	}
	if ($flag) {
		my $data = DA::IS::get_data_parse($session, $func, $num);
		foreach my $t (@{$target}) {
			my $q = $query->param("$t\_query");
               $q = DA::CGIdef::encode($q);
			my $o = $query->param("$t\_open");
			   $o = DA::CGIdef::encode($o);
			my $d = $query->param("$t\_data");
			   $d = DA::CGIdef::encode($d);
			my $app_type = $cfg->{app_type}->{$t};
			my $no = 1;
			unless ($d) {
				$data->{$t} = {};
				foreach my $l (split(/\n/, $q)) {
					my ($id, $type, $sum, $name) = split(/\:/, $l, 4);
					my $checksum = DA::Ajax::API::gen_checksum4inc_search($session, $app_type, {
						id   => $id,
						type => $type,
						name => $name
					});
					if (DA::CGIdef::check_md5_checksum($session, $sum, $checksum)) {
						if ($cfg->{list_mode} eq 'notype') {
							$data->{$t}->{$id} = sprintf("%06d:%s:%s", $no, $id, $name);
						} else {
							$data->{$t}->{$id} = sprintf("%06d:%s:%s:%s", $no, $id, $type, $name);
						}
						$no ++;
					}
				}
			}
			$data->{PARAM}->{"$t\_query"} = $q;
			$data->{PARAM}->{"$t\_open"} = $o;
			$data->{PARAM}->{"$t\_data"} = 0;
		}
		if ($func =~ /^(sc_regist|fa_regist)$/) {
			$data->{PARAM}->{user_cnt} = DA::Scheduler::set_member_list($session, $data, "$session->{sid}\.ulist\.dat.$num");
		}
		DA::IS::set_data_parse($session, $data, $func, $num);
	}

	return(0);
}

sub get_search_date{
    my($session,$date,$tz,$title,$option)=@_;

	# $tz = 1 $DA::Var::p->{timezone}に変換
	# $tz = 2 $session->{timezone}に変換
    $date=~s/\'//g;

    my($s_yy,$s_mm,$s_dd,$s_hh,$s_mi,$s_ss)=split(/[\-,\/,\s+,\:]/,$date);
    my $f_date;
    if($s_yy !~ /^\d+$/){
        $f_date=$date;
        if ($DA::IsLicense::op->{multi_lang}) {
            $f_date.=B_("$date");
        }
        return ($f_date);
    }
    if($tz eq '1'){
        $date = DA::CGIdef::convert_date($session,$date,1,$DA::Vars::p->{timezone});
    }elsif($tz eq '2'){
        $date = DA::CGIdef::convert_date($session,$date);
    }
    my($yy,$mm,$dd,$hh,$mi,$ss)=split(/[\-,\/,\s+,\:]/,$date);
    $f_date = ($title) ? "$title:" : '';
    $f_date .= sprintf("%04d",$yy).N_('年').
               sprintf("%02d",$mm).N_('月').
               sprintf("%02d",$dd).N_('日');
    if($s_hh =~/^\d+$/){ $f_date .= sprintf("%02d",$hh).N_("時"); }
    if($s_mi =~/^\d+$/){ $f_date .= sprintf("%02d",$mi).N_("分"); }
    if($s_ss =~/^\d+$/){ $f_date .= sprintf("%02d",$ss).N_("秒"); }
    if ($hh =~/^\d+$/ &&
        $session->{timezone} &&
        $session->{timezone} ne $DA::Vars::p->{timezone}){
        $f_date.="($session->{timezone})";
    }
    if($option){ $f_date .= "($option)"; }
    if ($DA::IsLicense::op->{multi_lang}) {
        $f_date.= " (" . (($title)? F_('en',"$title") .":" : '');
        my $string=Date::Calc::Date_to_Text($yy,$mm,$dd);
        my(@words)=split(/[\s\-]/,$string);
        $f_date.=sprintf("%s, %s %02d, %d ",$words[0],$words[2],$words[1],$words[3]);
        if($s_hh =~/^\d+$/){ $f_date .= sprintf("%02d",$hh); }
        if($s_mi =~/^\d+$/){ $f_date .= sprintf(":%02d",$mi); }
        if($s_ss =~/^\d+$/){ $f_date .= sprintf(":%02d",$ss); }
        if ($hh =~/^\d+$/ &&
            $session->{timezone} &&
            $session->{timezone} ne $DA::Vars::p->{timezone}){
            $f_date.="($session->{timezone})";
        }
        if($option){ $f_date .= B_(F_('en',"$option")); }
        $f_date.= ")";
    }

    return ($f_date);
}

sub top_reload_script{
    my($session,$reload,$cgi)=@_;
    if(!$reload){ return; }
    my $script;
    $script ="parent.location.href='$DA::Vars::p->{cgi_rdir}/$cgi';";
    return $script;
}
sub left_reload_script{
    my($session,$reload,$cgi)=@_;
    if(!$reload){ return; }
    my $script;
    $script ="parent.left_menu.location.href='$DA::Vars::p->{cgi_rdir}/$cgi';";
    return $script;
}

# 自分の設定言語を取得
# (設定ファイルではなく、現在有効になっている値を取得)
sub get_user_lang {
    my ($session, $mode) = @_;

    # $mode=0 : 設定ファイルではなく、現在有効になっている値を取得
    #       1 : 設定ファイルから取得 

    my $u_lang = "";

    if (!$mode) {
        # 通常モード
        if (!$DA::Gettext::trans_mode) {
            if (exists $session->{status} && $session->{status} == 3) { # TEMP
                $u_lang = $session->{login_lang};
            } else {
                # クッキーを確認
                my $cookie = DA::CGIdef::get_cookie($DA::Vars::p->{session_key}."_user_lang");
                if ($cookie->{value} && $cookie->{value}=~/[a-zA-Z_]/) {
                    $u_lang = $cookie->{value};
                }
            }

        # 内部処理モード
        } elsif (1 == $DA::Gettext::trans_mode) {
            $u_lang = $DA::Gettext::user_lang;
        }
    }

    # なければユーザの設定を確認
    if ($mode == 1 || !$u_lang) {
        my $user_lang;
        if ($session->{user} =~ /(?:\d{7})/) {
            my $dbo = DA::DBO::Member->new(
                                dbh     => $session->{dbh},
                                mid     => $session->{user},
                                column  => [qw(user_lang)]);
            $user_lang = $dbo->value('user_lang');
        }
        if (defined $user_lang) {
            $u_lang = $user_lang;
		} else {
        	my $option = DA::IS::get_master($session,'base');
        	if ($option->{user_lang}) {
            	$u_lang = $option->{user_lang};
        	}
		}
    }

    # なければシステムの設定を確認
    if (!$u_lang) {
        my $option = DA::IS::get_sys_custom({},'lang');
        if ($option->{default}) {
            $u_lang = $option->{default};
        }

    }
    return $u_lang;
}

# 他ユーザの設定言語を取得
# (DB,設定ファイルから取得)
sub get_user_lang2 {
    my ($session, $mid) = @_;
    my $u_lang = "";

    # ユーザの設定を確認
    my $dbo = DA::DBO::Member->new(
                        dbh     => $session->{dbh},
                        mid     => $mid,
                        column  => [qw(user_lang)]);
    if (defined $dbo->value('user_lang')) {
        $u_lang = $dbo->value('user_lang');
    }

    if (!$u_lang) {
        if (-f "$DA::Vars::p->{data_dir}/master/$mid/.base\.dat") {
            DA::System::file_open(\*USER,"$DA::Vars::p->{data_dir}/master/$mid/.base\.dat");
            while(my $line = <USER>){
                chomp($line);
                my($key,$val)=split(/=/,$line,2);
                $key=~s/^\s+//;
                $key=~s/\s+$//;
                $val=~s/^\s+//;
                $val=~s/\s+$//;
                if ($val eq '') { next; }
                if ($key eq 'user_lang') { $u_lang = $val; }
            }
            close(USER);
        }
    }

    # なければシステムの設定を確認
    if (!$u_lang) {
        my $option = DA::IS::get_sys_custom({},'lang');
        if ($option->{default}) {
            $u_lang = $option->{default};
        }

    }
    return $u_lang;
}

# ユーザの設定言語を更新
sub set_user_lang {
    my ($session, $lang, $mode) = @_;

    # $mode=0 : マスタを含む全書き換え
    #       1 : マスタ以外を書き換え
    #       2 : クッキーとGettext 外部変数のみ書き換え
    #       3 : Gettext 外部変数のみ書き換え

    if (!$lang) {return $session->{user_lang};}

    # ユーザの設定を書き換え
    if (!$mode) {
        my $option = DA::IS::get_master($session,'base');
        $option->{user_lang} = $lang;
        DA::IS::save_master($session,$option,'base');

        my $dbo = DA::DBO::Member->new(
                            dbh     => $session->{dbh},
                            mid     => $session->{user},
                            column  => ['user_lang']);
        $dbo->value('user_lang' => $lang);
        $dbo->update($session->{user});
    }

	if ($DA::IsLicense::op->{multi_lang} eq '1') {
    	# セッション情報を書き換え
    	if (!$mode || $mode == 1) {
        	$session->{user_lang} = $lang;

        	my ($sql, $sth);
        	$sql = "SELECT mlocal as local FROM is_member WHERE mid=?";
        	my $param = $session->{user};
        	$sth = $session->dbh->prepare($sql);
        	$sth->bind_param(1, $param, 1);
        	$sth->execute();
        	my $data = $sth->fetchrow_hashref('NAME_lc');
        	$sth->finish;

        	$data->{local} =~ s/\s+$//;
        	$data->{local}  =~ s/:/\|/g;

        	if ($data->{local} ne '' && $session->{'local'}) {
            	# 高速化オプション使用時のディレクトリは温存
        	} else {
            	my $p = {};
            	$p = DA::IS::get_sys_custom({}, 'domain', 1, $p);
            	# イメージサーバが指定されていない場合
            	if ($p->{image_url} eq '') {
                	$session->{img_rdir} = $DA::Vars::p->{image_url} ."/". $lang;
                	$session->{img_java} = $DA::Vars::p->{image_url} ."/". $lang;
            	# イメージサーバが指定されている場合
            	} else {
                	$session->{img_rdir} = $p->{image_url} ."/". $lang;
                	$session->{img_java} = $p->{image_url} ."/". $lang;
            	}
        	}
        	# HTML,テンプレート -----------------
        	$session->{html_dir} = $DA::Vars::p->{html_dir}. "/" . $lang;
        	$session->{tmpl_dir} = $DA::Vars::p->{tmpl_dir}. "/" . $lang;
        	DA::Session::update($session);
    	}

    	# クッキーを書き換え
    	if (!$mode || $mode == 1 || $mode == 2) {
        	$session->set_cookie;
    	}

    	# 外部変数書き換え
    	$DA::Gettext::user_lang = $lang;
	}
    return $session->{user_lang};
}

sub set_temp_lang {
    my ($session, $lang) = @_;
    if ($lang) {
        $DA::Gettext::backup_lang  = $DA::Gettext::user_lang;
        $DA::Gettext::user_lang    = $lang;
        $DA::Gettext::trans_mode   = 1;
    }
    return;
}
sub clear_temp_lang {
    my ($session) = @_;
    if ($DA::Gettext::backup_lang) {
        $DA::Gettext::user_lang  = $DA::Gettext::backup_lang;
    }
    $DA::Gettext::trans_mode = 0;
    return;
}

sub format_mail{
    my($session,$body)=@_;
    my $format_body;
    foreach my $line(split(/\n/,$body)){
        chomp($line);
        if($line=~/^([^:]+)\:/){
            my $title=$1.":";
            my $tab = 3 - int(length($title) / 8);
            if($tab > 0){
                $tab="\t" x $tab;
                $line=~s/\:/\:$tab/;
            }
        }else{
            $line=~s/^\:/\t\t\t/;
        }
        $format_body.="$line\n";
    }
    return $format_body;
}

sub dispatch_waiting {
	my $session     = shift;
	my $query       = shift;
	
	my @wait_cgi;
	# screen.datパラメータを取得
	my $screen = DA::IS::get_sys_custom($session,"screen");
	my @cgi = split(/\,/,$screen->{wait_screen_target});
	my $open_flg = $query->param('open');
	if ($open_flg eq '1'){
		foreach my $cgi (@cgi) {
			if ($cgi ne 'sc_list.cgi') {
				push(@wait_cgi, $cgi);
			}
		}
	} else {
		@wait_cgi = @cgi;
	}
	$wait_cgi[$_] = '/cgi-bin/'.$wait_cgi[$_] foreach (0..$#wait_cgi);
	my $flg;
	if (grep (/\Q$ENV{SCRIPT_NAME}\E/, @wait_cgi)){
		$flg = 1;
	}
	# ブラウザはIE6である時、ポピーウェイト画面が表示させるかどうかを判断。
	if ($flg) {
	unless ($ENV{'HTTP_USER_AGENT'}=~/MSIE 6/ 
		&& $screen->{wait_screen} eq 'on') { return; }
	}
	
	if (ref($query) =~ /WA::CGI/) {
		return undef unless ($query->exists_param('waiting'));
	} else {
		return undef unless ($query->param('waiting'));
	}

	my ($script_name, $query_string) = split(/\?/, $ENV{REQUEST_URI}, 2);
	my $cgi = $ENV{SCRIPT_NAME}."?";
	my @param = $query->param;
	foreach my $name (@param) {
		next if ($name =~ /waiting/);
		$cgi .= "$name=".URI::Escape::uri_escape($query->param($name))."\&";
	}
	$cgi =~ s/\&+$//g;
	
	my $tmpl = HTML::Template->new(
						filename => "$DA::Vars::p->{tmpl_dir}/waiting.tmpl",
						cache  => 1
	);

	# JavaScriptのlocationでリフレッシュを行うと問題があるブラウザに関しては
	# meteでリフレッシュを行うようにする
	# 2005/3/18日現在は下記のブラウザ
	# Firefox 1.0 or 1.0 Preview Release
	my $user_agent = DA::CGIdef::get_user_agent($ENV{'HTTP_USER_AGENT'});
	my $meta_refresh = 0;
	if ($user_agent->{class} =~ /(?:Firefox)/i) { 
		$meta_refresh = 1;
	}

	my $img_rdir;
	if (exists $session->{img_rdir}) {
		$img_rdir = $session->{img_rdir};
	} else {
		$img_rdir = $DA::Vars::p->{image_url};
	}

	$tmpl->param(
			CHARSET     => DA::Unicode::external_charset(),
			CHAR_STYLE_RDIR => $session->{char_style_rdir},
			CHAR_STYLE  => $session->{char_style},
			IMG_RDIR    => $img_rdir,
			SCRIPT      => $cgi,
			DEFAULT     => 1,
			MSG1		=> t_("データ処理中・・・・・"),
			MSG2		=> t_("ただいまデータを処理しています。"),
			MSG3		=> t_("処理に時間が掛かる場合があります。"),
			MSG4		=> t_("処理が終了するまで、そのままお待ちください。"),
			META_REFRESH	=> $meta_refresh,
			URI_PREFIX      => DA::IS::get_uri_prefix("txtstyle")
	);

    return $tmpl->output;
}

sub get_year_holiday{
    my($session,$view_year)=@_;
    my $holiday_tag;
    my($h_list,$wday_list)=DA::IS::get_holiday_list($session,$view_year,0,1);
    my $wday_check;
    my @wday_save;
    my $save_month;
    my $last;

    for(my $m=1;$m<=12;$m++){
        my $mm = sprintf("%02d",$m);
        if(!$wday_list->{$view_year}->{$mm}){
            if ($save_month) {
                $save_month.=$m-1;
                push(@wday_save,$save_month),
                $save_month="";
                $wday_check="";
            }
        } else {
            my @wday=@{$wday_list->{$view_year}->{$mm}};
            if($save_month){
                my $new_wday_check=join(',',@wday);
                if ($wday_check ne $new_wday_check){
                    $save_month.=$m-1;
                    push(@wday_save,$save_month),
                    $save_month="$m-";
                    $wday_check=join(',',@wday);
                }
            } else {
                $save_month="$m-";
                $wday_check=join(',',@wday);
            }
            if ($m==12) {
                $save_month.="12";
                push(@wday_save,$save_month),
            }
        }
    }

    my(@wday_char)=(b_("月%(mon)"),
                    b_("火%(tue)"),
                    b_("水%(wed)"),
                    b_("木%(thu)"),
                    b_("金%(fri)"),
                    b_("土%(sat)"),
                    b_("日%(sun)"));
    if ($#wday_save == 0 && $wday_list->{$view_year}->{'01'} && $wday_list->{$view_year}->{'12'}){
        my @wday=@{$wday_list->{$view_year}->{'01'}};
        my $sun = shift(@wday);
        push(@wday,$sun);
        my $wday_list2;
        for(my $ix=0;$ix<7;$ix++){
            if($wday[$ix]){$wday_list2.=$wday_char[$ix];}
        }
        if ($wday_list2){
            $holiday_tag=t_("毎週（%1）曜日休日",$wday_list2)."<br>";
        }
    } else {
        foreach my $month(@wday_save){
            my($from,$to)=split(/-/,$month);
            my $mm = sprintf("%02d",$from);
            if($wday_list->{$view_year}->{$mm}){
                my @wday=@{$wday_list->{$view_year}->{$mm}};
                my $sun = shift(@wday);
                push(@wday,$sun);
                my $wday_list2;
                for(my $ix=0;$ix<7;$ix++){
                    if($wday[$ix]){$wday_list2.=$wday_char[$ix];}
                }
                if ($wday_list2){
                    $holiday_tag.=DA::CGIdef::date_format2($session,"$view_year/$from/01",N_("MM月"),4)
                                . t_('〜')
                                . DA::CGIdef::date_format2($session,"$view_year/$to/01",N_("MM月"),4);
                    $holiday_tag.="-".t_("毎週（%1）曜日休日",$wday_list2)."<br>";
                }
            }
        }
    }
    $holiday_tag.="<table border=0 cellspacing=0 cellpadding=2>";
    foreach my $mmdd(sort keys %{$h_list->{$view_year}}){
        my $mm=substr($mmdd,0,2);
        my $dd=substr($mmdd,2,2);
        $holiday_tag.="<tr><td valign=top>"
                   .DA::CGIdef::get_display_date2($session,
                                                  "$view_year/$mm/$dd",7,'no')
                   ."</td><td>$h_list->{$view_year}->{$mmdd}->{name}</td></tr>";
    }
    $holiday_tag.="</table>";
    return $holiday_tag;
}

# ------------------------------------------------------------------------
# 自分自身のCGI名を返す(.cgiを省く)
# ------------------------------------------------------------------------
sub get_current_cgi {
	my $cgi = $ENV{SCRIPT_NAME};
	$cgi =~ s/^.*\///; $cgi =~ s/\.cgi$//;
	return $cgi;
}

#############################################################################
# 購読一覧の閲覧権限確認
#############################################################################
# 引数:
# $args{session} 	<= セッション情報
# $args{join_gid}	<= DA::IS::get_join_group($session, $session->{user}, 1); 
# $args{restrict}	<= DA::IS::get_sys_custom($session, 'restrict') 
# $args{lib_conf}	<= DA::IS::get_sys_custom($session, 'library')
# $args{owner}		<= DA::IS::get_owner_group($session, $session->{user}, 0, OWNER_FUNCTION);
# $args{custom}		<= カスタムハッシュ
# 
# オーナーファンクション
# 					-- document'      => スメートページ、共有ファイル、ライブラリ 
# $args{data}		<= is_newestのfetchrow_hashrefの結果(内容は下記参照)
#	id:				登録データID
#	mid:			登録者
#	gid:			登録グループID
#	oid:			保存フォルダID
#	subject			タイトル
#	fc				ファンクションコード
#                   -- address,         => 共有アドレス
#                   -- board            => 掲示板
#                   -- fa_schedule      => 施設予約
#                   -- group            => グループ
#                   -- library          => ライブラリ
#                   -- link             => リンク
#                   -- report           => レポート
#                   -- reminder         => メモ
#                   -- schedule         => スケジュール
#                   -- share            => 共有ファイル
#                   -- smartpage        => スマートページ
#                   -- task             => タスクリスト
#                   -- workflow         => ワークフロー
#                   -- mailist          => メーリングリスト
#	sc				サブコード
#					一つのファンクションコード内に複数種類が存在する場合に指定
#
#					-- db	=> ライブラリデータベースフォルダ
#					-- obj	=> ライブラリファイル保存フォルダ
#					-- txt	=> ライブラリテキスト形式の文書フォルダ
#					-- smp	=> ライブラリウェブページ形式の文書フォルダ
#					-- com	=> ライブラリコミュニティ形式の文書フォルダ
#					-- ファイルの場合は拡張子を指定
#	link			リンク
#	auth			許可されたユーザ・グループのカンマ区切りデータ
#					(例: 2000000,1000016)
#	auth_and	
#	auth_plus
#	auth_except
#
# 戻り値:
# 1: 閲覧許可
# 0: 閲覧不可
#
sub authz_read {
	my %args = @_;
	my $view_permit=1;
	if ($args{data}->{fc} eq 'library') {
		# 同じフォルダのデータをデータベースから取得しないように
		# $args{custom}->{lib_folder}->{$args{data}->{oid}} にフォルダ情報保持
		my $lib_conf = $args{lib_conf};
	 	$view_permit=DA::Lib::folder_view_permit($args{session},
			{ mid => $args{data}->{mid},
			  gid => $args{data}->{gid},
			  access_user   => $args{data}->{auth},
			  n_access_user => $args{data}->{auth_and},
			  p_access_user => $args{data}->{auth_plus},
			  e_access_user => $args{data}->{auth_except},
			}, $args{join_gid}, $lib_conf);
		my $sp_view_permit;
		my $sp_view_permit_get;
		if (!$view_permit) {
			if (!$args{custom}->{lib_folder}->{$args{data}->{oid}}) {
				$args{custom}->{lib_folder}->{$args{data}->{oid}}=
					DA::Lib::get_folder_data($args{session},$args{data}->{oid});
			}
			$sp_view_permit=DA::Lib::sp_view_permit($args{session},
				$args{custom}->{lib_folder}->{$args{data}->{oid}},
				$args{restrict},$args{join_gid},$args{owner}->{document},undef,$lib_conf);
			$view_permit=$sp_view_permit;
			$sp_view_permit_get=1;
		}
		if ($args{data}->{sc} =~ /(obj|smp)/) {
			# ファイル有効期間のチェック
			if ($view_permit && $args{data}->{gid} >= $DA::Vars::p->{top_gid}) {
				my $manager;
				if($lib_conf->{manager} eq 'on'){
					$manager = $args{custom}->{lib_folder}->{$args{data}->{oid}}->{manager};
				}
				my $sp_delete_permit=DA::IS::get_sp_delete_permit(
					$args{session},'lib',$args{data}->{gid},$args{data}->{mid},
					$args{restrict},$args{join_gid},$args{owner}->{document},$manager);
				if (!$sp_delete_permit) {
					my $file=DA::Lib::get_file_data($args{session},
						$args{data}->{oid},$args{data}->{id});
					my $expire=
						DA::LibFile::check_file_expire($args{session},$file);
        			if ($expire) { $view_permit=0; }
				}
			}
		}
		if ($args{data}->{sc} eq 'com') {
			# コミュニティの参加状況をチェック (特権処理はなし)
			if (!$args{custom}->{lib_folder}->{$args{data}->{oid}}) {
				$args{custom}->{lib_folder}->{$args{data}->{oid}}=
					DA::Lib::get_folder_data($args{session},$args{data}->{oid});
			}
			if (!$sp_view_permit_get) {
				$sp_view_permit=DA::Lib::sp_view_permit($args{session},
					$args{custom}->{lib_folder}->{$args{data}->{oid}},
					$args{restrict},$args{join_gid},$args{owner}->{document},undef,$lib_conf);
			}
			if (!$sp_view_permit) {
				if (DA::Lib::check_com_join($args{session},
					$args{custom}->{lib_folder}->{$args{data}->{oid}},{},1)) {
						$view_permit=0;
				}
			}
		}
	} elsif ($args{data}->{fc} eq 'share') {
		$view_permit=DA::Share::folder_view_permit($args{session},
        		$args{data}->{auth},
				$args{data}->{mid},
				$args{data}->{gid},
				$args{join_gid});
		if (!$view_permit) {
    		$view_permit=DA::IS::get_sp_view_permit($args{session},
        	 	'ow',$args{data}->{gid},'',$args{restrict},
				$args{join_gid},$args{owner}->{document});
		}
	} elsif ($args{data}->{fc} eq 'smartpage') {
		my ($type,$dev)=split(/\:/,$args{data}->{sc});
		my $dirs=DA::Smart::get_dir($args{session},
				{ type  => $type,
				  gid   => $args{data}->{gid},
				  docno => $args{data}->{id},
				});
		if (! -f "$dirs->{dir}/index.html") { return (0); }
    	$view_permit=DA::Smart::file_view_permit($args{session},
            $args{data}->{auth},
			$args{data}->{mid},
			$args{data}->{gid},
			$type,
			$args{join_gid});
		if (!$view_permit) {
			$view_permit=DA::IS::get_sp_view_permit($args{session},
        		'sm',$args{data}->{gid},'',$args{restrict},
				$args{join_gid},$args{owner}->{document});
		}
	}

	#===========================================
	#     Custom
	#===========================================
	DA::Custom::newest_authz_read($args{session},\%args,\$view_permit);

	return ($view_permit);
}

sub get_msg_parse {
    my($session,$file,$mode,$lang)=@_;
	# mode = 1 : メール送信時

	if (!$lang) { $lang = DA::IS::get_user_lang($session); }
    my $file_path;
	if (DA::Unicode::file_exist("$DA::Vars::p->{custom_dir}/messages/$lang/$file")) {
    	$file_path="$DA::Vars::p->{custom_dir}/messages/$lang/$file";
	} else {
		return undef;
	}

    my $block = {};
    my $fh = DA::Unicode::file_open("$file_path","r");
    my @data_file;
    if (defined $fh){
        @data_file =<$fh>;
        undef $fh;
    }
    my $sepa_tag;
    my $data;
    foreach my $line(@data_file){
        chomp($line);
        if(!$sepa_tag){
            if($line =~ /^<(.+)>$/){
                $sepa_tag = $1;
            }
            next;
        }else{
            if($line =~ /^<\/$sepa_tag>$/){
                $block->{$sepa_tag} = "$data";
                $sepa_tag = undef;
                $data = '';
                next;
            }else{
                $data .= DA::CGIdef::decode($line,1,1)."\n";
            }
        }
    }
    if ($mode){
        if ($block->{HEADER} eq "\n"){ $block->{HEADER}=''; }
        if ($block->{FOOTER} eq "\n"){ $block->{FOOTER}=''; }
        if ($block->{HEADER}){ $block->{HEADER}.="\n"; }
        if ($block->{FOOTER}){ $block->{FOOTER}="\n$block->{FOOTER}"; }
        if ($block->{PRIORITY}) { $block->{PRIORITY} =~ s/\n+//g; }
    }
    return ($block);
}

# □ グループタイプの判別を行う
sub group_type {
	my ($type, $org_type) = @_;

	if ($type eq $DA::Vars::p->{g_type}->{org}) {
		return $DA::Vars::p->{g_type}->{org};
	} elsif ($type eq $DA::Vars::p->{g_type}->{work}) {
		return $DA::Vars::p->{g_type}->{work};
	} elsif ($type eq $DA::Vars::p->{g_type}->{title}) {
		return $DA::Vars::p->{g_type}->{title};
	} elsif ($type eq $DA::Vars::p->{g_type}->{temp}) {
		if ($org_type eq $DA::Vars::p->{g_type}->{title}) {
			return $DA::Vars::p->{g_type}->{title};
		} elsif ($org_type eq $DA::Vars::p->{g_type}->{work}) {
			return $DA::Vars::p->{g_type}->{work};
		} else {
			return $DA::Vars::p->{g_type}->{org};
		}
	} else {
		return $type;
	}
}

sub pre_suspend {
	my $session = shift;
	my $option = shift;
	if (!defined($option->{mobile})) {
		$option->{mobile}=$session->{mobile};
	}

	if ($option->{lang}){
		if ($option->{mobile}) {
			return f_($option->{lang},"[廃]");
		} else {
			return f_($option->{lang},"【廃止】");
		}
	} else {
		if ($option->{mobile}) {
			return t_("[廃]");
		} else {
			return t_("【廃止】");
		}
	}
}

# ------------------------------------------------------------------------------
# □ 設定の実装をするまでuser_langにより国を識別する(仮コード)
# ------------------------------------------------------------------------------
sub get_user_country {
	my $session		= shift;
	my $user_lang	= shift;

	unless ($user_lang) { 
		$user_lang = DA::IS::get_user_lang($session);
	}

	my $country;
	if ($user_lang eq DA::IS::get_number2lang($session, '053') ||
		$user_lang eq '053') {
		# ja_JP
		$country = DA::IS::get_number2country($session, '108');
	} elsif ($user_lang eq DA::IS::get_number2lang($session, '025') ||
		$user_lang eq '025') {
		# en_US
		$country = DA::IS::get_number2country($session, '222');
	} elsif ($user_lang eq DA::IS::get_number2lang($session, '060') ||
		$user_lang eq '060') {
		# ko_KR
		$country = DA::IS::get_number2country($session, '116');
	} elsif ($user_lang eq DA::IS::get_number2lang($session, '135') ||
		$user_lang eq '135') {
		# zh_CN
		$country = DA::IS::get_number2country($session, '046');
	}

	return $country;
}

# *****************************************************************************
# 最終的には廃止
# *****************************************************************************
# ------------------------------------------------------------------------------
# □ 引数$user_langに適用されるデフォルトの国コード
# ※ $user_langによって表示形式を変更するときに利用（管理画面のユーザ編集）
# ------------------------------------------------------------------------------
sub get_default_country {
	my $session		= shift;
	my $user_lang	= shift;

	unless ($user_lang) { 
		$user_lang = DA::IS::get_user_lang($session);
	}

	my $country;
	if ($user_lang eq DA::IS::get_number2lang($session, '053') ||
		$user_lang eq '053') {
		# ja_JP
		$country = DA::IS::get_number2country($session, '108');
	} elsif ($user_lang eq DA::IS::get_number2lang($session, '025') ||
		$user_lang eq '025') {
		# en_US
		$country = DA::IS::get_number2country($session, '222');
	} elsif ($user_lang eq DA::IS::get_number2lang($session, '060') ||
		$user_lang eq '060') {
		# ko_KR
		$country = DA::IS::get_number2country($session, '116');
	} elsif ($user_lang eq DA::IS::get_number2lang($session, '135') ||
		$user_lang eq '135') {
		# zh_CN
		$country = DA::IS::get_number2country($session, '046');
	}

	return $country;
}

# 更新用各種言語テーブル名の取得
sub get_lang_table {
    my $session = shift;
    my $lang    = shift;
    my $target  = shift;
    my $msid    = shift;

    unless ($target) {
        $target = "member";
    }
	my $table;
	if (DA::MultiLang::master_ok()) {
    	unless ($lang) {
        	$lang = DA::IS::get_user_lang($session);
    	}
        if (DA::IScheck::check_master_lang($lang)) {
            $lang = $DA::Vars::p->{multi_lang_master}->{default_lang};
    		$table =  "is_".$target."_".$lang;
		} else {
			$table =  "is_".$target."_".$lang;
		}
	} else {
		$table =  "is_".$target;
	}

	if ( DA::MasterManager::check_generation_target_table($target) ) {
		if ( DA::MasterManager::is_msid($msid) ) {
	
			# 明示的にmsidが指定されている場合
		    $table = DA::MasterManager::gen_tbl_name($table, $msid);
	
		} elsif ( DA::MasterManager::is_msid($session->{sel_msid}) ) {
		
			# 明示指定がないが、session中にmsidを持っている場合
		    $table = DA::MasterManager::gen_tbl_name($table, $session->{sel_msid} );
		}
	}
	return DA::Valid::check_tablename($table);
}

# 更新用各種言語テーブル名の取得
# $msid : 世代ID
sub get_lang_view {
	my $session = shift;
	my $lang    = shift;
	my $target  = shift;
	my $msid    = shift;

	unless ($target) {
		$target = "member";
	}
	my $view;
	if (DA::MultiLang::master_ok()) {
    		unless ($lang) {
        		$lang = DA::IS::get_user_lang($session);
    		}
        	if (DA::IScheck::check_master_lang($lang)) {
            		$lang = $DA::Vars::p->{multi_lang_master}->{default_lang};
    			$view =  "iv_".$target."_".$lang;
		} else {
    			$view =  "iv_".$target."_".$lang;
		}
	} else {
		$view =  "is_".$target;
	}

	if ( DA::MasterManager::check_generation_target_view($target) ) {	
		if ( DA::MasterManager::is_msid($msid) ) {
	
			# 明示的にmsidが指定されている場合
		    $view = DA::MasterManager::gen_tbl_name($view, $msid);
	
		} elsif ( DA::MasterManager::is_msid($session->{sel_msid}) ) {
		
			# 明示指定がないが、session中にmsidを持っている場合
		    $view = DA::MasterManager::gen_tbl_name($view, $session->{sel_msid} );
		}
	}
	return DA::Valid::check_tablename($view);
}

# ユーザ表示用各種言語テーブル名の取得
# $lang : "TBL"=is_memberを戻す (VIEW)
#         それ以外の場合は is_member_[lang] (VIEW) を返す
# $msid : is_member_gNを戻す  (TABLE)
# $option->{no_session_use} : sel_msid を無視し、明示的に$msidが指定された場合だけ世代別のテーブル名を返す
sub get_member_table {
	my $session	= shift;
	my $lang	= shift;
	my $msid	= shift;
	my $option  = shift;

	my $target = "member";

	if ( $lang eq "TBL" ) {
		if( DA::MasterManager::is_msid($msid) ) {
		
			return  DA::Valid::check_tablename(DA::MasterManager::gen_tbl_name( 'is_'.$target , $msid));
		
		} elsif ( DA::MasterManager::is_msid($session->{sel_msid}) && !$option->{no_session_use} ) {
		
			# 明示指定がないが、session中にmsidを持っている場合
	    	return DA::Valid::check_tablename(DA::MasterManager::gen_tbl_name('is_'.$target, $session->{sel_msid} ));
		}
		return 'is_' . $target;
	}

	unless ($lang) {
		$lang = DA::IS::get_user_lang($session);
	}

	return DA::IS::get_lang_view($session, $lang, $target, $msid);
}

# グループ表示用各種言語テーブル名の取得
# $lang : "TBL"=is_memberを戻す (VIEW)
#         それ以外の場合は is_member_[lang] (VIEW) を返す
# $msid : is_member_gNを戻す  (TABLE)
# $option->{no_session_use} : sel_msid を無視し、明示的に$msidが指定された場合だけ世代別のテーブル名を返す
sub get_group_table {
	my $session	= shift;
	my $lang	= shift;
    my $msid    = shift;
	my $option  = shift;
	
	my $target = "group";

	if ( $lang eq "TBL" ) {
		if( DA::MasterManager::is_msid($msid) ) {
		
			return  DA::Valid::check_tablename(DA::MasterManager::gen_tbl_name( 'is_'.$target , $msid));
		
		} elsif ( DA::MasterManager::is_msid($session->{sel_msid}) && !$option->{no_session_use} ) {
		
			# 明示指定がないが、session中にmsidを持っている場合
	   		return DA::Valid::check_tablename(DA::MasterManager::gen_tbl_name('is_'.$target, $session->{sel_msid} ));
		}
		return 'is_' . $target;
	}

	unless ($lang) {
		$lang = DA::IS::get_user_lang($session);
	}

	return DA::IS::get_lang_view($session, $lang, $target, $msid);
}

# 世代管理 TABLE/VIEW名を取得
# $msid : is_member_gNを戻す  (TABLE)
# $option->{no_session_use} : sel_msid を無視し、明示的に$msidが指定された場合だけ世代別のテーブル名を返す
sub get_master_table {
	my ($session, $table, $msid, $option) = @_;
	
	unless ($table) {
		$table = "is_member";
	}
	if ( DA::MasterManager::is_msid($msid) ) {
	
		# 明示的にmsidが指定されている場合
	    $table = DA::MasterManager::gen_tbl_name($table, $msid);
	
	} elsif ( DA::MasterManager::is_msid($session->{sel_msid}) && !$option->{no_session_use} ) {
		
		# 明示指定がないが、session中にmsidを持っている場合
	    $table = DA::MasterManager::gen_tbl_name($table, $session->{sel_msid} );
	}
	return DA::Valid::check_tablename($table);
}

# モバイル環境設定情報を格納用テーブル名の取得
# $msid : is_mobile_gNを戻す  (TABLE)
sub get_mobile_table {
	my ($session, $msid) = @_;

	$msid = $session->{sel_msid} unless ( DA::MasterManager::is_msid($msid) );
	return DA::Valid::check_tablename(DA::MasterManager::gen_tbl_name('is_mobile' , $msid));
}


# JOIN キャッシュテーブル
sub get_join_data_table {
	my $session = shift;
	my $msid    = shift;

	return DA::Valid::check_tablename('is_join_data_' . ($session->{user} % $DA::Vars::p->{join_data_tables}));
}

# セッションテーブル
sub get_session_table {
	my $session = shift;

	return DA::Valid::check_tablename($DA::HttpSession::Base::TABLE . '_' . ($session->{user} % $DA::Vars::p->{session_tables}));
}

sub get_session_table_max {
	my $max = int($DA::Vars::p->{session_tables}) - 1;
	   $max = ($max > 0) ? $max : 10;

	return($max);
}




# *****************************************************************************
# 最終的には廃止
# *****************************************************************************
# -----------------------------------------------------------------------------
# □ country_numberからcountryの取得
# -----------------------------------------------------------------------------
sub get_number2country {
    my $session		= shift;
    my $number		= shift;

	unless (scalar(keys %{$DA::Vars::p->{country_code}})) {
		DA::IS::init_country_code($session);
	}

	my $country;
	if (exists $DA::Vars::p->{country_code}->{$number}) {
		return $DA::Vars::p->{country_code}->{$number};
	} else {
		return undef;
	}
}

# *****************************************************************************
# 最終的には廃止
# *****************************************************************************
# -----------------------------------------------------------------------------
# □ countryからcountry_numberの取得
# -----------------------------------------------------------------------------
sub get_country2number {
    my $session = shift;
    my $country	= shift;

	unless (scalar(keys %{$DA::Vars::p->{country_code}})) {
		DA::IS::init_country_code($session);
	}

	my $country_number = {};
	%{$country_number} = reverse(%{$DA::Vars::p->{country_code}});

	if (exists $country_number->{uc($country)}) {
		return $country_number->{uc($country)};
	} else {
		return '000';
	}
}

# *****************************************************************************
# 最終的には廃止
# *****************************************************************************
# -----------------------------------------------------------------------------
# □ lang_numberからlangの取得
# -----------------------------------------------------------------------------
sub get_number2lang {
    my $session		= shift;
    my $number    	= shift;

	unless (scalar(keys %{$DA::Vars::p->{lang_code}})) {
		DA::IS::init_lang_code($session);
	}

	if (exists $DA::Vars::p->{lang_code}->{$number}) {
		return $DA::Vars::p->{lang_code}->{$number};
	} else {
		return undef;
	}
}

# *****************************************************************************
# 最終的には廃止
# *****************************************************************************
# -----------------------------------------------------------------------------
# □ langからlang_numberの取得
# -----------------------------------------------------------------------------
sub get_lang2number {
    my $session = shift;
	my $number	= shift;

	unless (scalar(keys %{$DA::Vars::p->{lang_code}})) {
		DA::IS::init_lang_code($session);
	}

	my $lang_number = {};
	%{$lang_number} = reverse(%{$DA::Vars::p->{lang_code}});

	if (exists $lang_number->{$number}) {
		return $lang_number->{$number};
	} else {
		return '000';
	}
}

sub get_lang_list {
	my $session		= shift;
	my $user_lang	= shift;
	my %opt			= @_;

	# $opt{'force'}	master_okの設定に関わらずに言語リストを戻す

	if (DA::MultiLang::master_ok() || $opt{'force'}) {
		unless ($user_lang) {
			$user_lang = DA::IS::get_user_lang($session);
		}

		my $lang_list = [];
		foreach my $lang (@DA::MultiLang::master_languages) {
			my %lang_data;
			$lang_data{'code'}		= $lang;
			$lang_data{'language'}	= DA::MultiLang::get_lang2name($lang, $user_lang);
			push(@{$lang_list}, \%lang_data);
		}

		return $lang_list;
	} else {
		return [];
	}
}

sub get_country_list {
	my $session	= shift;

	my $country_list = [];
	foreach my $number (@{$DA::Vars::p->{country_number_list}}) {
		my %country_data;
		$country_data{'number'}	= $number;
		$country_data{'code'}		= DA::IS::get_number2country($session, $number);
		$country_data{'country'}	= T_($DA::Vars::p->{country}->{$number});
		push(@{$country_list}, \%country_data);
	}

	return $country_list;
}

sub display_style {
	my $session	= shift;
	my $country	= shift;	# 言語(地域) 

	# -------------------------------------------------------------------------
	# $style
	# -------------------------------------------------------------------------
	# 名前の表示形式
	#
	# key:name
	#	
	# LMF: 姓　ミドルネーム　名
	# FML: 名　ミドルネーム　姓
	# -------------------------------------------------------------------------
	# key:time		※未定義
	# -------------------------------------------------------------------------
	# key:address	※未定義
	# -------------------------------------------------------------------------
	# key:currency	※未定義

	my $style = {};
	if ($country =~ /(?:ja|zh|kr)/) {
		$style->{name} = "LMF";
	} else {
		$style->{name} = "FML";
	}
	return $style;
}

# デフォルトの表示スタイル
sub default_display_lang {
	my $session	= shift;

	return $DA::Vars::p->{default_display_lang};
}

# デフォルトの表示スタイル
sub default_display_style {
	my $session	= shift;

	return DA::MultiLang::get_display_style($DA::Vars::p->{default_display_lang});
}

sub title_color4multi_lang {
	my $session	= shift;
	my $default	= shift;

	unless ($default) {
		$default = $DA::Vars::p->{title_color}
	}	

	if (DA::MultiLang::master_ok()) {
		return $DA::Vars::p->{title_color3};
	} else {
		return $default;
	}
}

sub code_select {
	my $charset	= shift;
	my %charset_index=($charset=>'selected');

	my $html;
	foreach my $code (@{DA::IS::code_list()}) {
		$html .= "<option value=\"$code\" $charset_index{$code}>@{[T_($code)]}</option>";
	}
	return $html;
}

sub code_list {
	my $code_list = [qw(
		Shift_JIS
		UTF-8
	)];
	return $code_list;
}

sub md5sum {
	my $file	= shift;
	my $hex;

	if (-e $file) {
		my $fh = IO::File->new();
		DA::System::iofile_open($fh, $file);
		my $ctx = Digest::MD5->new;
		$ctx->addfile($fh);
		$hex = $ctx->hexdigest();
		$fh->close();
	}

	return $hex;
}

sub get_default_name {
	my($session,$id,$msid)=@_;
	my($sql,$sth);
	if ($id >= $DA::Vars::p->{top_gid}){
		$sql="SELECT name FROM " . DA::IS::get_group_table($session, "TBL", $msid) . " WHERE gid=?";
	} else {
		$sql="SELECT name FROM " . DA::IS::get_member_table($session, "TBL", $msid) . " WHERE mid=?";
	}
	$sth=$session->{dbh}->prepare("$sql");
	$sth->bind_param(1,$id,3); $sth->execute();
	my($name)=$sth->fetchrow;
	$sth->finish;
	return $name;
}

sub get_app_link_option{
    my($session,$modules,$link_type)=@_;

    my $app_link={};
    if(!$link_type){$link_type=1;}

    my $sql ="SELECT app_id,link_type,name,icon,module,link_path,def_param,"
            ."target,sort_lv,active "
            ."FROM is_app_link "
            ."WHERE active IN (1,9) and link_type=? "
            ."ORDER BY sort_lv";
    my $sth=$session->{dbh}->prepare("$sql");
    $sth->bind_param(1,$link_type,3);
    $sth->execute();
    my $no=1;
    while(my($app_id,$link_type,$name,$icon,$module,$link_path,$def_param,$target,$sort_lv,$active)=$sth->fetchrow){
        my $module_ok;
        my $module_ng;
        if (ref($modules) eq 'HASH' && %$modules && $module){
            my (@mods)=split(/\||\&/,$module);
            foreach my $mod(@mods){
                if ($modules->{$mod} eq 'on'){
                    $module_ok=1;
                } else {
                    $module_ng=1;
                }
            }
            if ($module=~/\|/){
                if (!$module_ok){ next; }
            }elsif ($module=~/\&/){
                if ($module_ng){ next; }
            }else{
                if (!$module_ok){ next; }
            }
        }
        my $f_no=sprintf("%04d",$no);
        $app_link->{$f_no} = {'app_id'    => $app_id,
                              'link_type' => $link_type,
                              'name'      => $name,
                              'icon'      => $icon,
                              'module'    => $module,
                              'link_path' => $link_path,
                              'def_param' => $def_param,
                              'target'    => $target,
                              'active'    => $active};
        $no++;
    }

    return $app_link;
}

sub get_menu_buffer{
    my($session)=@_;
    my $buffer={};
    my $sql ="SELECT /*+ ORDERED */ s.mid,s.link_type,s.custom_name,"
            ."s.custom_link,s.custom_param,s.custom_target,s.position,"
            ."a.app_id,a.name,a.icon,a.module,a.link_path,"
            ."a.def_param,a.target,a.active,a.link_type ";
	if ($DA::Vars::p->{POSTGRES}) {
        $sql.="FROM is_shortcut s LEFT OUTER JOIN is_app_link a "
            . "ON (s.app_id=a.app_id) "
            . "WHERE (s.mid=0 OR s.mid=?) "
            . "ORDER BY s.mid DESC";
	} else {
        $sql.="FROM is_shortcut s,is_app_link a "
            . "WHERE (s.mid=0 OR s.mid=?) AND s.app_id=a.app_id (+) "
            . "ORDER BY s.mid DESC";
	}
    my $sth=$session->{dbh}->prepare("$sql");
    $sth->bind_param(1,$session->{user},3);
    $sth->execute();
    my $custom;
	my $check_position={};
    my $module=DA::IS::get_module($session);
	my $module_force=DA::IS::get_force_menu($session);
	foreach my $key (grep $module_force->{$_}->{type} == 1,keys %{$module_force}){
		$module->{$key}='on';
	}
	my $error=DA::IS::check_force_menu($session,$module,$module_force,1);
	if($error ne ""){ 
		# [TBD]
		# typeが2のもの(どれかがonでいいもの)について、オーナー権限での設定がどれもoffだった
		# 場合(オーナー権限でoffにした後に管理画面で強制扱いにした)については対応していない
		#   なんらかの方法でオーナーに通知すべき。
	}
    while(my($mid,$c_link_type,$c_name,$c_link,$c_param,$c_target,$position,
          $app_id,$name,$icon,$a_module,$link_path,$def_param,$target,$active,
          $link_type)
    =$sth->fetchrow){
        if(!$custom && $mid==$session->{user}){$custom=1;}
		if ($check_position->{$position} && $active ne 9){next;}
		if($custom && $active ne '9' && $mid == 0){next;}
        if ($c_link_type eq '8'){
			$check_position->{$position}=1;
            my($position_x,$position_y)=split(/-/,$position);
            $buffer->{$position_x}->{$position_y} = {'app_id'   => 'url',
                                                     'link_type'=> $c_link_type,
                                                     'mid'      => $mid,
                                                     'name'     => $c_name,
                                                     'icon'     => 'ctm_navi_ico_url.gif',
                                                     'link'     => $c_link,
                                                     'target'   => $c_target,
                                                     'active'   => '1'};
        } else {
            my $module_ok;
            my $module_ng;
            if ($active ne '1' && $active ne '9'){next;}
            if ($custom && $active ne '9' && $mid == 0){next;}
            if ($a_module){
                my (@mods)=split(/\||\&/,$a_module);
                foreach my $mod(@mods){
                    if ($module->{$mod} eq 'on'){
                        $module_ok=1;
                    } else {
                        $module_ng=1;
                    }
                }
                if ($a_module=~/\|/){
                    if (!$module_ok){ next; }
                }elsif ($a_module=~/\&/){
                    if ($module_ng){ next; }
                }else{
                    if (!$module_ok){ next; }
                }
            }
			$check_position->{$position}=$active;
        	if($mid==$session->{user}){$active=1;}
            my($position_x,$position_y)=split(/-/,$position);
            $buffer->{$position_x}->{$position_y} = {'app_id'    => $app_id,
                                                     'link_type' => $link_type,
                                                     'link'      => $link_path,
                                                     'param'     => $def_param,
                                                     'target'    => $target,
                                                     'mid'       => $mid,
                                                     'name'      => T_("$name"),
                                                     'icon'      => $icon,
                                                     'active'    => $active};
        }
    }
    $sth->finish();

	# Custom
	DA::Custom::get_menu_buffer($session, $module, $buffer);

	return ($buffer);
}

sub get_menu_row{
	return DA::Menu::get_menu_row(@_);
}

sub get_top_page_tmpl {
	my($session,$port)=@_;
	my $tmpl_file = "top_page.tmpl";
	if ($session->{text_mode} eq "on") {
		$tmpl_file = "top_page_text.tmpl";
	} elsif ($session->{portlet_style} eq "aqua") {
		$tmpl_file = "top_page_aqua.tmpl";
	} elsif ($session->{portlet_style} eq "preset") {
		$tmpl_file = "top_page_preset.tmpl";
	}
	my $tmpl = HTML::Template->new(
		filename => "$DA::Vars::p->{html_dir}/template/$tmpl_file",
		cache  => 1
	);
	return $tmpl;
}

#ユーザ情報表示用
#get_top_page_tmplからテンプレートを以下4点変更
#(1)table style="table-layout:fixed;"
#(2)<col width="N">を追加
#(3)<tr>にHEADER_ATTRを追加 
#(4)最後の<br>を削除
sub get_top_page_tmpl_info_card {
	my($session,$port)=@_;
	my $tmpl_file = "top_page_info_card.tmpl";
	if ($session->{text_mode} eq "on") {
		$tmpl_file = "top_page_text_info_card.tmpl";
	} elsif ($session->{menu_style} eq "aqua") {
		$tmpl_file = "top_page_aqua_info_card.tmpl";
	}
	my $tmpl = HTML::Template->new(
		filename => "$DA::Vars::p->{html_dir}/template/$tmpl_file",
		cache  => 1
	);
	return $tmpl;
}

# コマンド系でのデフォルトの文字コードを取得
sub command_code_default {
    my ($io) = @_;
    my $command = DA::IS::get_sys_custom({}, "command", 1, {});
    if ($command->{"default_$io"}) {
        return $command->{"default_$io"};
    }
    if (DA::Unicode::internal_charset() eq "UTF-8") {
        return "Shift_JIS";
    } else {
        return "EUC-JP";
    }
}

# コマンド系で利用できる文字コードの一覧
sub command_code_list {
    return [qw(Shift_JIS EUC-JP UTF-8)];
}

sub get_hibiki_product_keys {
	my @hibiki  = sort {
		$DA::Vars::p->{hibiki}->{$a}->{app_id} <=> $DA::Vars::p->{hibiki}->{$b}->{app_id}
	} keys %{$DA::Vars::p->{hibiki}};

	return (@hibiki);
}

sub get_hibiki_name {
	my ($session, $app, $mode)	= @_;
	my $db = 0;

	if ($mode) {
		if ($DA::Vars::p->{hibiki}->{$app}->{full_name} eq "") {
			$db = 1;
		} else {
			$db = 0;
		}
	} else {
		if ($DA::Vars::p->{hibiki}->{$app}->{short_name} eq "") {
			$db = 1;
		} else {
			$db = 0;
		}
	}

	my $name;
	if ($db) {
		my $sql = "SELECT name FROM is_app_link WHERE app_id=?";
		my $sth = $session->{dbh}->prepare($sql);
		$sth->bind_param(1, $DA::Vars::p->{hibiki}->{$app}->{app_id}, 3);
		$sth->execute();

		$name = $sth->fetchrow; $sth->finish();

		if ($mode) {
			$name = $name;
		} else {
			my $regex = DA::Unicode::convert_from_sourcecode("ひびき(R)");
			$name =~ s/^\Q$regex\E//;
		}
	} else {
		if ($mode) {
			$name = DA::Unicode::convert_from_sourcecode($DA::Vars::p->{hibiki}->{$app}->{full_name});
		} else {
			$name = DA::Unicode::convert_from_sourcecode($DA::Vars::p->{hibiki}->{$app}->{short_name});
		}
	}

	return (T_($name));
}

sub get_hibiki_path {
	my ($session)	= @_;
	my $hibiki_path	= DA::IS::get_sys_custom($session, 'hibiki_path', 1);

	# 名称変更に伴う修正
	if ($hibiki_path->{hibiki_smartdb} eq "") {
		$hibiki_path->{hibiki_smartdb} = $hibiki_path->{hibiki_smartcabinet};
	} else {
		$hibiki_path->{hibiki_smartcabinet} = $hibiki_path->{hibiki_smartdb};
	}

	return ($hibiki_path);
}

sub get_option_app_keys {
    my @option_app = sort {
        $DA::Vars::p->{option_app}->{$a}->{app_id} <=> $DA::Vars::p->{option_app}->{$b}->{app_id}
    } keys %{$DA::Vars::p->{option_app}};

    return (@option_app);
}

sub get_option_app_name {
    my ($session, $app, $mode) = @_;
	# mode : 2     : admin 用文字列
	#        その他: ユーザ用文字列
    my $name = "";
    if ($mode eq '2') {
        $name = DA::Unicode::convert_from_sourcecode($DA::Vars::p->{option_app}->{$app}->{admin_name});
    } else {
        $name = DA::Unicode::convert_from_sourcecode($DA::Vars::p->{option_app}->{$app}->{user_name});
    }
    return T_($name);
}

sub check_option_app_server {
	my ($session, $app, $ip) = @_;

	unless ($ip) {
		$ip = `hostname -i`;
		if ($ip =~ /^([^\s\r\n]+)/) {
			$ip = $1;
		}
	}

	if ($DA::IsLicense::op->{$app . "_server"} =~ /(^|\|)\Q$ip\E(\||$)/) {
		return(1);
	} else {
		return(0);
	}
}

sub check_new_mail_link {
	my($session) = @_;
	my $result;
	if ($DA::Vars::p->{new_mail_link} eq "off") {
		$result = 0;
	} else {
		$result = 1;
	}
	DA::Custom::rewrite_new_mail_link($session,\$result);
	return $result;
}

# 管理可能組織一覧を is_admin テーブルから取得する
# 引数：$session     : セッション
#
sub get_ctrlable_group {
    my ($session,$join_gid,$mid) = @_;
    if (!$mid) {$mid = $session->{user};}

    my $where     = "a.admin_id=$mid ";
    if(!$join_gid || (ref($join_gid) eq 'HASH'  && 0==keys(%$join_gid))){
        $join_gid  = DA::IS::get_join_group($session, $mid, 1, undef, undef);
    }
    my $groups = {};
    my @groups_arr = ();

    my $g_where = "";
    foreach my $j_key (keys %{$join_gid}) {
        if ($j_key ne "AUTH" && $join_gid->{$j_key}->{attr} =~ /[12UW]/) {
            $g_where .= ",$j_key";
        }
    }
    $g_where =~ s/^,//;
    if ($g_where) {
        $where .= "OR a.admin_id IN ($g_where) ";
    }

	my $group_table_mm = "is_group";
	my $admin_table    = "is_admin";
	my $gm_table       = "is_group_member";

    my $sql = "SELECT a.gid FROM $group_table_mm g, $admin_table a "
            . "WHERE ($where) AND a.gid=g.gid AND (g.type=1 OR g.org_type=1)  "
            . "ORDER BY g.sort_level, upper(g.kana), g.gid";
    my $sth = $session->{dbh}->prepare("$sql");
    $sth->execute();
    while (my($gid) = $sth->fetchrow) {
        $groups->{$gid} = 1;
        push(@groups_arr, $gid);
    }
    $sth->finish;

    # is_group_member との整合
    if (!@groups_arr) {
        $sql="SELECT mid FROM $gm_table WHERE gid=?";
        $sth=$session->{dbh}->prepare($sql);
        $sth->bind_param(1,$DA::Vars::p->{admin_gid},3);
        $sth->execute();
        while(my($id)=$sth->fetchrow) {
            if ($id eq $mid || $join_gid->{$id}->{attr} =~ /[12UW]/) {
                $groups->{$DA::Vars::p->{top_gid}} = 1;
                push(@groups_arr, $DA::Vars::p->{top_gid});
            }
        }
        $sth->finish;
    }
    return wantarray ? (@groups_arr) : $groups;
}

# 管理可能組織一覧をすべて取得する
# 引数：$session     : セッション
sub get_ctrlable_group_all {
    my ($session,$join_gid,$mid,$force) = @_;
	# $force  1: 管理組織をDBから再取得
	if (!$force && (!$mid || $mid eq $session->{user})) {
		return($session->{ctrlable_gid_all});
	} else {
    	my $groups = DA::IS::get_ctrlable_group($session,$join_gid,$mid);
    	foreach my $gid (keys(%$groups)) {
  			my $down = DA::IS::get_all_down_group($session, $gid);
    		@$groups{@{$down}} = (1..scalar(@$down));
		}
    	return $groups;
    }
}

# 指定した組織の全管理権限ユーザの管理可能組織一覧を更新
sub remake_ctrlable_gid_all {
	my ($session,$gid)=@_;
	my $target_gid={};
	if ($gid) {
		$target_gid->{$gid}=1;
		my $upper = DA::IS::get_all_up_group($session, $gid, 1);
		foreach my $upper_gid (@{$upper}) {
			$target_gid->{$upper_gid}=1;
		}
	}
	my $sql="SELECT gid,admin_id FROM is_admin";
    my $sth=$session->{dbh}->prepare($sql); $sth->execute();
   	while (my ($admin_gid,$admin_mid) = $sth->fetchrow) {
		if ($gid) {
			if (!$target_gid->{$admin_gid}) { next; }
		}
		if ($admin_mid gt $DA::Vars::p->{top_gid}) {
		}
   		my $user_session = DA::HttpSession->new(
                                dbh         => $session->{dbh},
                                user        => $admin_mid,
                                no_update   => 1);
		if ($user_session->status ne 2) { next; }
		DA::IS::update_ctrlable_gid_all($user_session,1);
	}
	$sth->finish;
}

# セッション内の管理可能組織一覧を更新
sub update_ctrlable_gid_all {
	my ($session,$update)=@_;
	my $mid = $session->{user};
    my $join_gid = DA::IS::get_join_group($session, $mid, 1, 1);
    if($session->{user_id} eq $DA::Vars::p->{admin_id}){
        $session->{admin} = 1;
    }else{
        if ($session->{type} eq 1) {
            if($join_gid->{$DA::Vars::p->{admin_gid}}->{attr} eq '9'){
                $session->{admin} = 2;
            }
        }
    }
    $session->{limited_admin}   =0;
	$session->{ctrlable_gid_all}={};
    if ($session->{admin} == 2) {
        if ($DA::Vars::p->{multi_admin}->{multi} eq 'on') {
            $session->{ctrlable_gid} = DA::IS::get_ctrlable_group($session, $join_gid);
            if (!$session->{ctrlable_gid}->{$DA::Vars::p->{top_gid}}) {
                $session->{limited_admin} = 1;
                foreach my $gid (keys %{$session->{ctrlable_gid}}) {
                    $session->{ctrlable_gid_all}->{$gid}=1;
                    my $down = DA::IS::get_all_down_group($session, $gid);
                    foreach my $down_gid (@{$down}) {
                        $session->{ctrlable_gid_all}->{$down_gid}=1;
                    }
                }
            }
        }
    }
	# warn Data::Dumper->Dump([$session->{ctrlable_gid_all}]);
	if ($update) { DA::Session::update($session); }
}

# ある人がグループを管理可能かどうか(あるグループの管理権限があるかどうか)判定する
sub is_ctrlable_group {
    my ($session,$target_gid, $mid, $mode) = @_;
	# $mid は操作する人
	# $mode   1: プロジェクトの場合は不可とする

    if (!$session->{admin})     {return 0;}
    if (1 == $session->{admin}) {return 1;}
	
    $target_gid = int($target_gid);
    unless( $target_gid ) { return 0; }
	
    my $flag=0;
    if (!$mid) { $mid = $session->{user}; }
    if ($mid eq $session->{user}) {
        if ($session->{admin} && !$session->{limited_admin}) { $flag=1; }
    	if ($session->{ctrlable_gid_all}->{$target_gid}) { $flag=1; }
	} else {
    	# 設定されている頂点組織を取得
        my $ctrlable_gid = DA::IS::get_ctrlable_group($session, {}, $mid);
    	# target_gid が 管理可能グループと一致すれば管理可能
    	if ($ctrlable_gid->{$target_gid}) { 
			$flag=1; 
		} else {
    		# target_gid が所属する組織たちを取得
    		my $upper_gid = DA::IS::get_group_up_path($session, $DA::Vars::p->{top_gid}, $target_gid,'',$mode);
    		# target_gid の upper_gid のどれかが 管理可能グループと一致すれば管理可能
    		foreach my $t_gid (@$upper_gid) {
        		if ($ctrlable_gid->{$t_gid}) {
            		$flag=1; last;
        		}
    		}
		}
	}
    return $flag;
}

# ある人を管理可能か
sub is_ctrlable_member {
    my ($session,$target_mid, $mid) = @_;
	# $mid は操作する人

    if (!$session->{admin})     {return 0;}
    if (1 == $session->{admin}) {return 1;}

    $target_mid = int($target_mid);
    unless( $target_mid ) { return 0; }

    if (!$mid) {$mid = $session->{user};}

    my $flag = 0;
    my $join_gid = DA::IS::get_join_group($session, $target_mid);
    foreach my $gid (keys(%$join_gid)) {
       if ($join_gid->{$gid}->{attr} =~ /[12UW]/) {
           if (DA::IS::is_ctrlable_group($session, $gid, $mid, 1)) {
               $flag = 1; last;
           }
       }
    }
    return $flag;
}
# ある組織の管理権限ユーザか
sub is_real_admin {
    my ($session, $gid) = @_;
    my $real_admin = $session->{admin};
    if ($session->{limited_admin}) {
    	if (!$session->{ctrlable_gid_all}->{$gid}) {
           $real_admin = 0;
       	}
    }
    return $real_admin;
}

#=================================================================
sub get_multi_view_rest_type {
    my ($session) = @_;
    return $DA::Vars::p->{multi}->{view_rest_type};
}

#----------------------
# 閲覧可能組織として指定されている一覧を取得する
# (指定ノード（組織)のみの一覧を取得。V2.2 ではプライマリとセカンダリ所属組織のみ。)
# 引数：$session     : セッション
#
sub get_permit_group_top {
    my ($session,$join_gid) = @_;
    if (!$join_gid) {
        $join_gid = DA::IS::get_join_group($session, $session->{user});
    }

    # V2.2 ではプライマリとセカンダリ所属組織固定
    my $groups = {};
    foreach my $gid (keys %$join_gid) {
        if ($join_gid->{$gid}->{attr} =~ /^[12]$/) {
            $groups->{$gid}=1;
        }
    }
    my @groups_arr = keys(%$groups);
    return wantarray ? (@groups_arr) : $groups;
}

#----------------------
# 閲覧可能組織一覧をすべて取得する
# 引数：$session     : セッション
#
sub get_permit_group_all {
    my ($session,$join_gid) = @_;
    if (!$join_gid) {
        $join_gid = DA::IS::get_join_group($session, $session->{user});
    }

    # 閲覧可能と指定されているノード(組織)を取得
    my $tops = DA::IS::get_permit_group_top($session, $join_gid);

    # 各ノード組織の下位組織を取得
    my $groups = {};
    %$groups = %$tops;
    foreach my $gid (keys %$tops) {
        my $down = DA::IS::get_all_down_group($session, $gid);
        foreach my $d (@$down) {
            $groups->{$d}=1;
        }
    }
    my @groups_arr = keys(%$groups);
    return wantarray ? (@groups_arr) : $groups;
}

#----------------------
# 閲覧可能組織か否か
sub is_permit_group {
    my ($session, $func, $gid, $join_gid, $param, $owner_group) = @_;
	# $func : 呼出し元機能判別用パラメータ(V2.2 では使用していない)
	# $gid  : グループID
	# $join_gid : 操作ユーザの join_group
	# $param->{call_mode} : 呼出し元機能詳細判別用(V2.2 では使用していない)
	#         {owner_func}: 判定すべきオーナー権限の種類 (owner_number)
	#                       'all' は何らかのオーナー権限があれば良い場合に指定。
	#                             (「全て」の意味でないことに注意。any の意味) 
	#                       'complete' は制限なしオーナーのみを対象に判定する場合に指定。
    $gid = int($gid);
    unless( $gid ) {
        return 0;
    }
    # multi.dat パラメータが無い場合は評価しない (全部権限ありで動く)  # 念のため
    if (!$DA::Vars::p->{multi}->{view_rest_type}) {
        return 1;
    }
    if (!$gid || $gid eq '0') {
        return 1;
    }

    if ((!defined($join_gid) || !$join_gid)) {
        $join_gid = DA::IS::get_join_group($session,$session->{user});
    }

    my $flag = 0;
    if (!$session->{limited_permit}) {          # 閲覧制限されていない
        $flag = 1;
    } elsif ($session->{permit_gid}->{$gid}) {  # オーナー権限に関係ない閲覧可能組織
        $flag = 1;
    } else {
        if ($param->{owner_func}) {
            my $owner_func = $param->{owner_func};
            if ($param->{owner_func} eq 'complete') {
                $owner_func = 0; # 制限なしオーナーを対象にする
            }
            if (!defined($owner_group) || !$owner_group) {
                $owner_group = DA::IS::get_owner_group($session, $session->{user}, 0, $owner_func);
            }

            if (defined($owner_group)) {
                if (DA::IS::check_owner($session,
                                        $owner_group,
                                        $gid,
                                        $owner_func)) {
                    $flag = 1;
                }
            }
        }
    }
    return $flag;
}

#----------------------
# 閲覧可能ユーザか否か
sub is_permit_member {
    my ($session, $func, $target_mid, $join_gid, $param, $owner_group) = @_;

    $target_mid = int($target_mid);
    unless( $target_mid ) {
        return 0;
    }

    # multi.dat パラメータが無い場合は評価しない (全部権限ありで動く)  # 念のため
    if (!$DA::Vars::p->{multi}->{view_rest_type}) {
        return 1;
    }
    if (!$target_mid || $target_mid eq $session->{user}) {
        return 1;
    }
    my $param_no_owner={};
    %$param_no_owner = %$param;
    delete($param_no_owner->{owner_func});

    my $target_join_gid = DA::IS::get_join_group($session, $target_mid);
    my $flag = 0;
    foreach my $gid (keys(%$target_join_gid)) {
       # ターゲットユーザの Pri/Sec 所属組織の場合は、操作ユーザのオーナー権限範囲を含めて判定
       if ($target_join_gid->{$gid}->{attr}=~/[12]/) {
           if (DA::IS::is_permit_group($session, $func, $gid, $join_gid, $param, $owner_group)) {
               $flag = 1; last;
           }
       # そうでない場合（上位組織の場合）は、操作ユーザのオーナー権限範囲を含めず判定
       } elsif ($target_join_gid->{$gid}->{attr}=~/[UW]/) {
           if (DA::IS::is_permit_group($session, $func, $gid, $join_gid, $param_no_owner)) {
               $flag = 1; last;
           }
       }
    }
    return $flag;
}


#=================================================================
# クリッピングメール権限のチェック
sub check_newest_mail_permit {
	my ($session, $newest, $allow, $join_gid)	= @_;
	my $permit	= 0;

	if ($newest->{mail} eq "off") {
		$permit	= 0;
	} elsif ($newest->{mail} eq "allow") {
		foreach my $g (keys %{$join_gid}) {
			if ($join_gid->{$g}->{attr} =~ /[12]/) {
				if ($allow->{$g}) {
					$permit = 1;
					last;
				}
			}
		}
	} else {
		$permit	= 1;
	}

	return ($permit);
}

# クリッピング設定権限のチェック
sub check_newest_owner_permit {
	my ($session, $module, $gid, $type)	= @_;
	my $permit;

	# Custom
	DA::Custom::rewrite_newest_owner_permit($session, $gid, $type, \$permit);

	if ($permit eq "") {
		if ($module->{newest} eq "on") {
			my $upper = DA::IS::get_all_up_group($session, $gid);

			$permit = 1;
			foreach my $g (@{$upper}) {
				my $owner = DA::IS::get_master({ "user" => $g }, "owner_newest");
				if ($owner->{"user_" . $type} eq 0) {
					$permit	= 0;
					last;
				}
			}
		} else {
			$permit = 0;
		}
	}

	return ($permit);
}

sub check_newest_user_permit {
	my ($session, $module, $join_gid, $type)	= @_;
	my $permit;

	# Custom
	DA::Custom::rewrite_newest_user_permit($session, $join_gid, $type, \$permit);

	if ($permit eq "") {
		if ($module->{newest} eq "on") {
			my $gid   = $session->{primary};
			my $upper = DA::IS::get_all_up_group($session, $gid);

			$permit = 1;
			foreach my $g (@{$upper}, $gid) {
				my $owner = DA::IS::get_master({ "user" => $g }, "owner_newest");
				if ($owner->{"user_" . $type} eq 0) {
					$permit = 0;
					last;
				}
			}
		} else {
			$permit = 0;
		}
	}

	return ($permit);
}

sub get_newest_mail_allow {
	my ($session, $newest)	= @_;
	my $list	= {};

	foreach my $gid (split(/,/, $newest->{allow_list})) {
		if ($gid eq "") {
			next;
		} else {
			my $downer = DA::IS::get_all_down_group($session, $gid);
			foreach my $g (@{$downer}, $gid) {
				$list->{$g} = 1;
			}
		}
	}

	return ($list);
}

# 一般画面のオーナー権限、 管理画面のオンラインガイドのラベル付きリンクを生成
sub make_guide_link {
    my ($session, $item, $mode, $opt)  = @_;
	# user 側 でジェネラル既存の $item
	# of_menu, ma_menu, dr_menu, wf_menu, sm_menu, ow_menu, sr_menu, 
	# lib_menu, pr_menu, owner_menu
	# 
	# admin 側 でジェネラル既存の $item
	# system_menu, mainte_menu, owner_menu, custom_restrict_menu, 
	# custom_init_menu, custom_master_menu, custom_other_menu
	# 
	# type なし：サブメニューにあるリンク
	#      pop : ポップアップにあるリンク

    my $type = $opt->{type};
    my $cgi="$DA::Vars::p->{cgi_rdir}/guide.cgi?mode=$mode&item=$item&type=$type";
	   $cgi=DA::IS::add_check_key_url("$cgi");

    my $help_link="&nbsp;&gt;&gt;&nbsp;"
                 ."<a href=\"\" onClick=\"window.open('$cgi','', 'width=430,height=579,resizable=1');return false;\">"
                 .t_("オンラインガイド%(menu)")."</a>";
    if (!$type && $mode ne 'admin' && $session->{menu_style} eq "aqua") {
            $help_link=
               "<div style=\"margin-left:3px;\">"
               ."<table border=0 cellspacing=0 cellpadding=0 class=CtmNaviLeftFunction><tr>"
               ."<td class=CtmNaviLeftFunctionImg>"
               ."<img src=\"$session->{img_rdir}/object_non_s.gif\" border=0 width=16></td>"
               ."<td class=CtmNaviLeftFunctionText>"
               ."<a class=CtmNaviLeft href=\"\" onClick=\"window.open('$cgi','', 'width=430,height=579,resizable=1');return false;\">"
               .t_("オンラインガイド%(menu)")."</a></td>"
               ."</tr></table></div>";
    }

    # Custom =======
    my $custom_help_link = DA::Custom::make_guide_link($session, $item, $mode, $opt);
    if ($custom_help_link) {
        $help_link = $custom_help_link;
    }
    #===============

    return $help_link;
}

sub get_workflow_temp_info {
    my ($session, $tid) = @_;

    my $sql="SELECT mid,gid,pathname,filename FROM is_wf_template WHERE tid=?";
    my $sth = $session->{dbh}->prepare($sql);
       $sth->bind_param(1, $tid, 3); $sth->execute();
    my $info= $sth->fetchrow_hashref('NAME_lc'); $sth->finish;

    foreach my $key (keys %{$info}) {
        $info->{$key} =~ s/\s+$//;
    }

    return ($info);
}

sub get_fav_group_button {
	my ($session,$gid,$href,$call)=@_;

    my $tag="<a href=\"$href\">"
    ."<img src=$session->{img_rdir}/aqbtn_setfavgroup.gif border=0 width=132 "
    ."height=17 alt=\"@{[t_('よく使うグループの設定')]}\"></a>";

    #=====================================================
    #           ----custom----
    #=====================================================
	DA::Custom::get_fav_group_button($session,\$tag,
		{ gid => $gid, href => $href, call => $call });

	return ($tag);
}

sub check_hibiki_license {
	my ($session, $app, $admin) = @_;

	my @apps;
	if ($app) {
		push (@apps, $app);
	} else {
		foreach my $type (keys %{$DA::Vars::p->{hibiki}}) {
			push (@apps, $type);
		}
	}

	my $license = 0;
	foreach my $a (@apps) {
		if (($admin || $session->{"lic_h_" . $a}) && $DA::IsLicense::op->{"hibiki_" . $a}) {
			$license = 1;
		}
	}

	return ($license);
}

sub get_hibiki_license {
	my ($session, $mid, $admin)	= @_;
	my (@lics, $lic);

	if ($mid eq "") {
		$mid = $session->{user};
	}
	foreach my $type (keys %{$DA::Vars::p->{hibiki}}) {
		if ($type eq "smartdb") {
			push (@lics, "lic_h_smartcabinet");
		} else {
			push (@lics, "lic_h_" . $type);
		}
	}

	if (scalar(@lics)) {
		if ($admin) {
			$lic = {};
			foreach my $l (@lics) {
				$lic->{$l} = 1;
			}

			# 名称変更
			$lic->{lic_h_smartdb} = $lic->{lic_h_smartcabinet};
		} else {
			my $sql	= "SELECT " . join (",", @lics)
					. " FROM " . DA::IS::get_member_table($session, "TBL") . " WHERE mid=?";
			my $sth	= $session->{dbh}->prepare($sql);
			   $sth->bind_param(1, $mid, 3); $sth->execute();
			   $lic	= $sth->fetchrow_hashref('NAME_lc'); $sth->finish();

			# 名称変更
			$lic->{lic_h_smartdb} = $lic->{lic_h_smartcabinet};
		}
	} else {
		$lic = {};
	}

	return ($lic);
}

sub get_is_member_count {
	my ($session) = @_;

	my $app_ids = {};
	foreach my $h (sort keys %{$DA::Vars::p->{hibiki}}) {
		$app_ids->{$DA::Vars::p->{hibiki}->{$h}->{app_id}} = $h;
	}
	foreach my $aj (sort keys %{$DA::Vars::p->{option_app}}) {
		$app_ids->{$DA::Vars::p->{option_app}->{$aj}->{app_id}} = $aj;
	}

	# for new client license
	foreach my $lic_group (sort keys %{$DA::Vars::p->{reserved_app_id}}) {
		$app_ids->{$DA::Vars::p->{reserved_app_id}->{$lic_group}} = "lic_group_".$lic_group;
	}

	my $sql	= "SELECT type,count,app_id FROM is_member_count";
	my $sth	= $session->{dbh}->prepare($sql); $sth->execute();
	my $count = {};
	while (my $data = $sth->fetchrow_hashref('NAME_lc')) {
		if ($data->{type}) {
			$count->{$data->{type}} = $data->{count};
		} else {
			$count->{$app_ids->{$data->{app_id}}} = $data->{count};
		}
	}
	$sth->finish();

	return ($count);
}

sub remake_is_member_count {
	my ($session, $trans) = @_;

	# カウント情報のクリア
	{
		my $sql_d = "DELETE FROM is_member_count";
		my $sth_d = $session->{dbh}->prepare($sql_d);
		   $sth_d->execute(); 
		   $sth_d->finish();
	}

	# INSUITE ユーザのカウント
	{
		my $sql	= "SELECT type,count(mid) FROM is_member "
				. "WHERE mid!=? GROUP BY type";
		my $sth	=$session->{dbh}->prepare($sql);
		   $sth->bind_param(1, $DA::Vars::p->{insuite_mid}, 3);
		   $sth->execute();
		my $count = {};
		while (my ($type, $cnt) = $sth->fetchrow()) {
			$count->{$type} = int($cnt);
		}
		$sth->finish();

		my $sql_i = "INSERT INTO is_member_count (type,count) VALUES (?,?)";
		my $sth_i = $session->{dbh}->prepare($sql_i);
		foreach my $n (sort {$a <=> $b} keys %{$count}) {
			$sth_i->bind_param(1, $n, 3);
			$sth_i->bind_param(2, $count->{$n}, 3);
			$sth_i->execute();
		}
		$sth_i->finish();
	}

	# ひびきユーザのカウント
	{
		my $count = {};
		foreach my $h (sort keys %{$DA::Vars::p->{hibiki}}) {
			if (DA::IS::check_hibiki_license($session, $h, 1)) {
				my $where = ($h eq "smartdb") ?
								"lic_h_smartcabinet=1" : "lic_h_$h=1";
				my $sql	= "SELECT count(mid) FROM is_member "
						. "WHERE mid!=? AND $where";
				my $sth	=$session->{dbh}->prepare($sql);
				   $sth->bind_param(1, $DA::Vars::p->{insuite_mid}, 3);
				   $sth->execute();
				my ($cnt) = $sth->fetchrow();
				$count->{$DA::Vars::p->{hibiki}->{$h}->{app_id}} = int($cnt);
				$sth->finish();
			}
		}

		my $sql_i = "INSERT INTO is_member_count (type,app_id,count) VALUES (?,?,?)";
		my $sth_i = $session->{dbh}->prepare($sql_i);

		foreach my $n (sort {$a <=> $b} keys %{$count}) {
			$sth_i->bind_param(1, '0', 3);
			$sth_i->bind_param(2, $n, 3);
			$sth_i->bind_param(3, $count->{$n}, 3);
			$sth_i->execute();
		}
		$sth_i->finish();
	}
    # Ajax 他ユーザのカウント
    {
        my $count = {};
        foreach my $aj (sort keys %{$DA::Vars::p->{option_app}}) {
            if (DA::IS::check_option_app_license($session, $aj, 1)) {
                my $where = "lic_$aj=1";
                my $sql = "SELECT count(mid) FROM is_member "
                        . "WHERE mid!=? AND $where";
                my $sth =$session->{dbh}->prepare($sql);
                   $sth->bind_param(1, $DA::Vars::p->{insuite_mid}, 3);
                   $sth->execute();
                my ($cnt) = $sth->fetchrow();
                $count->{$DA::Vars::p->{option_app}->{$aj}->{app_id}} = int($cnt);
                $sth->finish();
            }
        }
        my $sql_i = "INSERT INTO is_member_count (type,app_id,count) VALUES (?,?,?)";
        my $sth_i = $session->{dbh}->prepare($sql_i);

        foreach my $n (sort {$a <=> $b} keys %{$count}) {
            $sth_i->bind_param(1, '0', 3);
            $sth_i->bind_param(2, $n, 3);
            $sth_i->bind_param(3, $count->{$n}, 3);
            $sth_i->execute();
        }
        $sth_i->finish();
    }

    # for new client license
    # 上位クライアントライセンス(中間的なライセンス区分) の利用ユーザのカウント
    {
        my $count = {};
        foreach my $parent_lic (keys %{$DA::Vars::p->{client_license_rel}}) {

            # ライセンス区分に対応する app_id が定義されていなかったら、とばす
            if (!exists($DA::Vars::p->{reserved_app_id}->{$parent_lic})) {next;}

            my $where = "";
            foreach my $lic (@{$DA::Vars::p->{client_license_rel}->{$parent_lic}->{child}}) {
                if (DA::IS::check_option_app_license($session, $lic, 1)) {
                    $where .= "lic_$lic=1 OR ";
                }
            }
            $where =~ s/ OR $//;

            if ($where) {
                my $sql = "SELECT count(mid) FROM is_member "
                        . "WHERE mid!=? AND ($where)";
                my $sth =$session->{dbh}->prepare($sql);
                   $sth->bind_param(1, $DA::Vars::p->{insuite_mid}, 3);
                   $sth->execute();
                my ($cnt) = $sth->fetchrow();

                $count->{$DA::Vars::p->{reserved_app_id}->{$parent_lic}} = int($cnt);

                $sth->finish();
            }
        }
        my $sql_i = "INSERT INTO is_member_count (type,app_id,count) VALUES (?,?,?)";
        my $sth_i = $session->{dbh}->prepare($sql_i);

        foreach my $n (sort {$a <=> $b} keys %{$count}) {
            $sth_i->bind_param(1, '0', 3);
            $sth_i->bind_param(2, $n, 3);
            $sth_i->bind_param(3, $count->{$n}, 3);
            $sth_i->execute();
        }
        $sth_i->finish();
    }

	# commit
	if ($trans) {
		if (!DA::Session::exception($session)) {
			DA::Error::system_error($session);
		}
	}
	return (0);
}

sub check_is_invalid_license {
	my ($session) = @_;

	if ($DA::IsLicense::op->{invalid}) {
		return(1);
	} else {
		return(0);
	}
}

sub check_is_expire_license {
	my ($session) = @_;

	my $license = 0;
	if ($DA::IsLicense::op->{date}) {
		if ($DA::IsLicense::op->{date} lt DA::CGIdef::get_date('Y4/MM/DD')) {
			$license = 1;
		} else {
			$license = 0;
		}
	} else {
		$license = 0;
	}

	return ($license);
}

sub check_is_client_license {
	my ($session) = @_;

	my $license = 0;
	if (int($DA::IsLicense::op->{client}) > 0) {
		my $count = DA::IS::get_is_member_count($session);
		if (int($DA::IsLicense::op->{client}) < int($count->{1})) {
			$license = 1;
		} else {
			$license = 0;
		}
	} else {
		$license = 1;
	}

	return ($license);
}

sub check_is_hibiki_license {
	my ($session) = @_;

	if (!DA::IS::check_option_app_license($session,"core",1)) {
		return(1);
	} else {
		return(0);
	}
}

sub check_hibiki_client_license {
	my ($session, $app) = @_;

	my @apps;
	if ($app) {
		push (@apps, $app);
	} else {
		foreach my $type (keys %{$DA::Vars::p->{hibiki}}) {
			push (@apps, $type);
		}
	}

	my $license = 0;
	if (scalar(@apps)) {
		my $count = DA::IS::get_is_member_count($session);
		foreach my $a (@apps) {
			my $ck = "hibiki_" . $a . "_client";
			if ($DA::IsLicense::op->{$ck} eq "unlimited") {
				next;
			} elsif (int($DA::IsLicense::op->{$ck}) >= int($count->{$a})) {
				next;
			} else {
				$license = 1;
				last;
			}
		}
	}

	return ($license);
}
sub check_option_app_license {
    my ($session, $app, $admin) = @_;
    my @apps;
    if ($app) {
        push (@apps, $app);
    } else {
        foreach my $type (keys %{$DA::Vars::p->{option_app}}) {
            push (@apps, $type);
        }
    }
    my $license = 0;
    foreach my $a (@apps) {
        my $cl_exist_key = $a;
        if ($a =~ /$DA::Vars::p->{new_client_lic_regex}/) {
            $cl_exist_key = "cl_$a";
        }
        if (($admin || $session->{"lic_" . $a}) && $DA::IsLicense::op->{$cl_exist_key}) {
            $license = 1;
        }
    }
    return ($license);
}
sub check_option_app_client_license {
    my ($session, $app) = @_;
    my @apps;
    if ($app) {
        push (@apps, $app);
    } else {
        foreach my $type (keys %{$DA::Vars::p->{option_app}}) {
            push (@apps, $type);
        }
    }
    my $license = 0;
    my $count;
    if (scalar(@apps)) {
        $count = DA::IS::get_is_member_count($session);
        foreach my $a (@apps) {
            if ($DA::IsLicense::op->{tool_ver}) {
                my $serv_lic = $DA::Vars::p->{parent_serv_license}->{$a};

                # ajxmailer の場合は、クライアントライセンスが存在する場合は
                # サーバライセンスが 2 となるので必ず 1 で評価する
                if ($DA::IsLicense::op->{$serv_lic} eq '1') {
                    next;
                }
            }
            my $ck = $a . "_client";
            if ($DA::IsLicense::op->{$ck} eq "unlimited") {  # 要修正 サーバライセンス？
                next;
            } elsif (int($DA::IsLicense::op->{$ck}) >= int($count->{$a})) {
                next;
            } else {
                $license = 1;
                last;
            }
        }
    }
    # for new client license
    if (!$app && $DA::IsLicense::op->{tool_ver}) {
        if (!defined($count) && scalar(keys %{$DA::Vars::p->{reserved_app_id}})) {
            $count = DA::IS::get_is_member_count($session);
        }
        foreach my $parent_lic (keys %{$DA::Vars::p->{reserved_app_id}}) {
            my $lic_ref = $DA::Vars::p->{client_license_rel}->{$parent_lic};

            # 関係するサーバライセンスが一つでも存在していたら、評価の必要が無い
            my $serv_exist=0;
            foreach my $serv_lic (@{$lic_ref->{server_lic_set}}) {
                if ($DA::IsLicense::op->{$serv_lic}) {
                    $serv_exist=1;
                }
            }
            if ($serv_exist) { next; }

            my $all_equal = 1; # 設定されている子 CL の数は全て同じか
            my $chk_client = $DA::IsLicense::op->{$lic_ref->{child}->[0]} . "_client";
            foreach my $i (0 .. $#{$lic_ref->{child}}) {
                if ($chk_client ne $DA::IsLicense::op->{$lic_ref->{child}->[$i]} . "_client") {
                    $all_equal = 0;
                }
            }
            if (!$all_equal) { next; }

            # 一つめの子 CL の数（全て同じであるはず）
            my $first_lic_name = $lic_ref->{child}->[0];
            my $lic_num = $DA::IsLicense::op->{$first_lic_name."_client"};
            if ($lic_num eq "unlimited") {
                next;
            } elsif (int($lic_num) >= int($count->{"lic_group_".$parent_lic})) {
                next;
            } else {
                $license = 1;
                last;
            }
        }
    }
    return ($license);
}
sub get_option_app_license {
    my ($session, $mid, $admin)     = @_;
    my (@lics, $lic);

    if ($mid eq "") {
        $mid = $session->{user};
    }
    foreach my $type (keys %{$DA::Vars::p->{option_app}}) {
        push (@lics, "lic_" . $type);
    }

    if (scalar(@lics)) {
        if ($admin) {
            $lic = {};
            foreach my $l (@lics) {
                    $lic->{$l} = 1;
            }
        } else {
            my $sql = "SELECT " . join (",", @lics)
                    . " FROM " . DA::IS::get_member_table($session, "TBL") . " WHERE mid=?";
            my $sth = $session->{dbh}->prepare($sql);
               $sth->bind_param(1, $mid, 3); $sth->execute();
               $lic = $sth->fetchrow_hashref('NAME_lc'); $sth->finish();
        }
    } else {
        $lic = {};
    }
    return ($lic);
}

sub get_fav_popup {
	my ($session, $proc_no, $v_gid) = @_;

	my $tag;
	if ($session->{ug_sel_popup} eq "extension") {
		my $f_sel    = DA::IS::get_data_parse($session, $proc_no);
		unless ($f_sel->{PARAM}->{extension}) {
			$f_sel->{PARAM}->{extension}= 1;
			DA::IS::set_data_parse($session, $f_sel, $proc_no);
		}

		# 拡張ユーザ・グループ
		DA::IS::convert_usersel_fav2extension($session, $f_sel, $v_gid);

		$tag = DA::IS::get_popup("$DA::Vars::p->{cgi_rdir}/"
				. "usersel.cgi?file=$f_sel->{PARAM}->{proc_no}\_ex");
		$tag =~s/\n//g;
	} else {
		my $cgi   = "fav_usersel2.cgi%3fproc_no=$proc_no%20v_gid=$v_gid";
		my $img   = "pop_title_selusergroup.gif";
		my $width = 450;
		my $height= 570;

		$tag = "Pop('$cgi','$img',$width,$height);";
	}

	return $tag;
}

sub convert_usersel_fav2extension {
	my ($session, $f_sel, $v_gid) = @_;
	my $f_param  = {}; %$f_param = ref($f_sel->{PARAM}) eq 'HASH' ? %{$f_sel->{PARAM}} : ();
	my $sel_list = {}; %$sel_list = ref($f_sel->{FAV_USER}) eq 'HASH' ? %{$f_sel->{FAV_USER}} : ();

	my $block    = {};
	$block->{PARAM}->{target}   = 'USERSEL';
	$block->{PARAM}->{cgi}      = "$DA::Vars::p->{cgi_rdir}/fav_usersel2.cgi"
	                            . "?proc_no=$f_param->{proc_no}&v_gid=$v_gid";
	$block->{PARAM}->{gid}      = $f_param->{gid};
	$block->{PARAM}->{mode}     = $f_param->{mode};
	$block->{PARAM}->{multi}    = $f_param->{multi};
	$block->{PARAM}->{owner}    = $f_param->{owner};
	$block->{PARAM}->{u_rest}   = $f_param->{u_rest};
	$block->{PARAM}->{u_type}   = $f_param->{u_type};
	$block->{PARAM}->{g_attr}   = $f_param->{g_attr};
	$block->{PARAM}->{sort}     = $f_param->{sort};
	$block->{PARAM}->{rest}     = $f_param->{rest};
	$block->{PARAM}->{self_sel} = $f_param->{self_sel};
	$block->{PARAM}->{regist_gid}=$f_param->{regist_gid};
	$block->{PARAM}->{suspend}  = $f_param->{suspend};
	$block->{PARAM}->{func}     = $f_param->{func};
	$block->{PARAM}->{func_mode}= $f_param->{func_mode};
	$block->{PARAM}->{ng_id}    = $f_param->{ng_id};
	$block->{PARAM}->{limited_admin}=$f_param->{limited_admin};
	$block->{PARAM}->{all_user} = $f_param->{all_user};
	$block->{PARAM}->{extension}= $f_param->{extension};
	$block->{PARAM}->{submit_js}= $f_param->{submit_js};
	$block->{PARAM}->{submit_ex_js} = $f_param->{submit_ex_js};
	$block->{USERSEL}           = $sel_list;
	$block->{PARAM}->{check}    = $f_param->{check} || $f_param->{proc};
	if (!$block->{PARAM}->{check} && $f_param->{cgi} && $f_param->{reload_proc}) {
		$block->{PARAM}->{check}    = $f_param->{reload_proc};
	}
	DA::IS::set_data_parse($session, $block, "$f_param->{proc_no}\_ex");

	return(1);
}

sub get_fav_popup_doc {
	my ($session, $cgi) = @_;

	my ($tag, $title, $width, $height);
	my $img = 'pop_title_selusergroup.gif';
	if ($session->{ug_sel_popup} eq "extension") {
		$width     = 680;
		$height    = 570;
		$cgi =~s/\%3f/?/ig;
		$cgi =~s/\%20/&/ig;
		$tag =  DA::IS::get_popup("$DA::Vars::p->{cgi_rdir}/$cgi&extension=1");
		$tag =~s/\n//g;
	} else {
		$title     = 'newpopup';
		$width     = 450;
		$height    = 570;
		$tag = "Pop('$cgi','$img',$width,$height);";
	}
	return $tag;
}

sub get_attr5_ids {
    my ($session, $gid, $msid)=@_;
	my $gm_table = DA::IS::get_master_table($session, "is_group_member", $msid);
    my @gm_mids=();
    my $sql="SELECT mid FROM $gm_table WHERE gid=? AND attr='5'";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,$gid,3); $sth->execute();
    while(my($mid)=$sth->fetchrow){
        if ($mid) {push(@gm_mids, $mid)}
    }
    $sth->finish();
    my %count; @gm_mids=grep(!$count{$_}++, @gm_mids); # 重複除外
    return @gm_mids;
}
sub make_large_in_phrase {
    my ($session, $arr_ref, $col, $num)=@_;
    if ($col eq "") {$col="gid";}
    if (!$num)      {$num=800;}
    my @gm_mids= map {int($_)} @$arr_ref;
    my $gm_mid_sub="";
    while (1) {
        if(!@gm_mids){last;}
        my @list = splice(@gm_mids,0,$num);
        my $gm_where=join(',',@list); $gm_where =~ s/\,+$//;
        if ($gm_where eq '') {last;}
        $gm_mid_sub.= "$col IN ($gm_where) OR ";
    }
    $gm_mid_sub=~s/\sOR\s$//;
    return $gm_mid_sub;
}

sub get_rte_mode {
	my ($session) = @_;

	# IE 6.0 以下のブラウザはリッチテキストをサポートしない
	my $rte_mode = 1;
	if ($ENV{HTTP_USER_AGENT} =~ /MSIE\s+(\d+)/i) {
		if ($1 < 6) { $rte_mode = 0; }
	}

	return ($rte_mode);
}

sub get_rte_script {
	my ($session, $encode, $jsonly) = @_;
	my $custom = DA::IS::get_sys_custom($session, "richtext");

	# IE 6.0 以下のブラウザはリッチテキストをサポートしない
	my $rte_mode = DA::IS::get_rte_mode($session);
	if (!$rte_mode) { return; }

	my $lang = DA::IS::get_user_lang($session);
	# BEGIN: changed for JAXA
	my $uri_prefix = DA::IS::get_uri_prefix("txtstyle");
	my $rte_style = "$session->{char_style_rdir}/normal_style.css?$uri_prefix";

	my ($style_list, $font_list, $size_list);

		$style_list =<<buf_end;
var style_list='<option value="">[@{[t_('スタイル%(richtext)')]}]</option>'
    +'<option value="<p>">@{[t_('Paragraph%(richtext)')]} &lt;p&gt;</option>'
    +'<option value="<h1>">@{[t_('Heading 1%(richtext)')]} &lt;h1&gt;</option>'
    +'<option value="<h2>">@{[t_('Heading 2%(richtext)')]} &lt;h2&gt;</option>'
    +'<option value="<h3>">@{[t_('Heading 3%(richtext)')]} &lt;h3&gt;</option>'
    +'<option value="<h4>">@{[t_('Heading 4%(richtext)')]} &lt;h4&gt;</option>'
    +'<option value="<h5>">@{[t_('Heading 5%(richtext)')]} &lt;h5&gt;</option>'
    +'<option value="<h6>">@{[t_('Heading 6%(richtext)')]} &lt;h6&gt;</option>'
    +'<option value="<address>">@{[t_('Address%(richtext)')]} &lt;ADDR&gt;</option>'
    +'<option value="<pre>">@{[t_('Formatted%(richtext)')]} &lt;pre&gt;</option>'
buf_end

	if ($lang eq 'ja') {

		$font_list =<<buf_end;
var font_list='<option value="MS PGothic,Microsoft Sans-Serif,MS UI Gothic,Osaka,Arial,sans-serif" selected>[@{[t_('フォント%(richtext)')]}]</option>'
    +'<option value="MS PGothic,Microsoft Sans-Serif,MS UI Gothic,Osaka,Arial,sans-serif">@{[t_('プロポーショナル ゴシック%(richtext)')]}</option>'
    +'<option value="MS PMincho,Times New Roman,@{[t_('細明朝')]},@{[t_('リュウミンL')]},Times, serif">@{[t_('プロポーショナル 明朝%(richtext)')]}</option>'
    +'<option value="MS Gothic,@{[t_('Osaka-等幅')]},Arial,Helvetica,sans-serif">@{[t_('等幅 ゴシック%(richtext)')]}</option>'
    +'<option value="MS Mincho,@{[t_('等幅明朝')]}, Courier New, Times, serif">@{[t_('等幅 明朝%(richtext)')]}</option>'
    +'<option value="Arial, Helvetica, sans-serif">@{[t_('Arial%(richtext)')]}</option>'
    +'<option value="Courier New, Courier, mono">@{[t_('Courier New%(richtext)')]}</option>'
    +'<option value="Times New Roman, Times, serif">@{[t_('Times New Roman%(richtext)')]}</option>'
    +'<option value="Verdana, Arial, Helvetica, sans-serif">@{[t_('Verdana%(richtext)')]}</option>';
buf_end

	} else {

		$font_list =<<buf_end;
var font_list='<option value="Arial, Helvetica, sans-serif" selected>'
    +'[@{[t_('フォント%(richtext)')]}]</option>'
    +'<option value="Arial, Helvetica, sans-serif">@{[t_('Arial%(richtext)')]}</option>'
    +'<option value="Courier New, Courier, mono">@{[t_('Courier New%(richtext)')]}</option>'
    +'<option value="Times New Roman, Times, serif">@{[t_('Times New Roman%(richtext)')]}</option>'
    +'<option value="Verdana, Arial, Helvetica, sans-serif">@{[t_('Verdana%(richtext)')]}</option>';
buf_end

	}

	if ($custom->{fontsize_custom} eq "on") {
		my ($list, $map, %text, %value);
		foreach my $i (1..7) {
			$map .= "    fontSizeMap[$i]='" . $custom->{"fontsize_mapping_$i"} . "'\;\n";
		}
		foreach my $key (sort keys %{$custom}) {
			if ($key =~ /^fontsize\_text\_(\d+)$/) {
				$text{sprintf("%04d", $1)} = $custom->{$key};
			} elsif ($key =~ /^fontsize\_value\_(\d+)$/) {
				$value{sprintf("%04d", $1)} = $custom->{$key};
			}
		}
		foreach my $key (sort {$a <=> $b} keys %text) {
			$list .= "    +'<option value=\"$value{$key}\">" . T_(DA::Unicode::convert_from($text{$key}, "EUC-JP")) . "</option>'\n";
		}
		if ($list) {
			$list =~ s/\n+$/\;/;
		}

		$size_list =<<buf_end;
var size_list='<option value="Size">[@{[t_('サイズ')]}]</option>'
$list
var fontSizeMap=[];
$map
buf_end

	} else {
		$size_list =<<buf_end;
var size_list='<option value="Size">[@{[t_('サイズ')]}]</option>'
    +'<option value="1">@{[t_('最小%(richtext)')]}</option>'
    +'<option value="2">@{[t_('小 (標準)%(richtext)')]}</option>'
    +'<option value="3">@{[t_('中%(richtext)')]}</option>'
    +'<option value="5">@{[t_('大%(richtext)')]}</option>'
    +'<option value="7">@{[t_('最大%(richtext)')]}</option>';
buf_end

	}

	my $head =<<buf_end if (!$jsonly);
<link rel="stylesheet" type="text/css" href="$DA::Vars::p->{js_rdir}/richText/rte.css">
<script language=JavaScript><!--
buf_end

	my $foot =<<buf_end if (!$jsonly);
//--></script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/richtext.js"></script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/prototype.lite.js"></script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/moo.fx.js"></script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/moo.fx.pack.js"></script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/common.js"></script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/base.js"></script>
buf_end

	my $script =<<buf_end;
$head
function changeScrollStyle(id, max, n, resize) {
    var node = document.getElementById(id);
    if (n > max) {
        node.style.height = (max * 20) + "px";
        node.style.overflowY = "scroll";
    } else {
        node.style.height = "";
        node.style.overflowY = "hidden";
    }
    if (resize) {
    }
}
var lang = "$lang";
var encoding  = "$encode";
var rte_style = "$rte_style";
var style_flag = "$custom->{style}";
var resource = {
    area:  '@{[t_("編集エリアサイズ%(richtext)")]}',
    area_small:  '@{[t_("編集エリア：小%(richtext)")]}',
    area_midium: '@{[t_("編集エリア：標準%(richtext)")]}',
    area_large:  '@{[t_("編集エリア：大%(richtext)")]}',
    bold:  '@{[t_("太字%(richtext)")]}',
    italic:'@{[t_("斜体%(richtext)")]}',
    underline:    '@{[t_("下線%(richtext)")]}',
    align_left:   '@{[t_("左揃え%(richtext)")]}',
    align_center: '@{[t_("中央揃え%(richtext)")]}',
    align_right:  '@{[t_("右揃え%(richtext)")]}',
    align_just:   '@{[t_("両端揃え%(richtext)")]}',
    hline:        '@{[t_("分離線%(richtext)")]}',
    olist:        '@{[t_("段落番号%(richtext)")]}',
    ulist:        '@{[t_("箇条書き%(richtext)")]}',
    outdent:      '@{[t_("インデント解除%(richtext)")]}',
    indent:       '@{[t_("インデント%(richtext)")]}',
    text_color:   '@{[t_("文字色%(richtext)")]}',
    bg_color:     '@{[t_("背景色%(richtext)")]}',
    insert_link:  '@{[t_("リンク設定%(richtext)")]}',
    insert_image: '@{[t_("イメージ挿入%(richtext)")]}',
    insert_table: '@{[t_("テーブル挿入%(richtext)")]}'
};
$font_list
$style_list
$size_list
$foot
buf_end

	return($script);
}

sub get_fckeditor_script{
    my $session = shift;
    my $resize_fnc_arg = shift;

    my $fckeditor_path = $DA::Vars::p->{fckeditor_path};
    my $script_name = (not $DA::Vars::p->{FIREBUG}) ?  'fckeditor' : 'DA_fckeditor_profile';
        
    my $prefx = DA::IS::get_uri_prefix();
    my $fckscript=qq#<script type="text/javascript" src="$fckeditor_path/editor/$script_name.js"></script>\n#;
    $fckscript.=qq#<script src="$DA::Vars::p->{js_rdir}/iseria/mailer/thirdparty-all.js?$prefx"></script>#;

    if($resize_fnc_arg){

        $fckscript .= qq#
<script language="JavaScript"><!--
function changeScrollStyle(id, max, n, resize) {
    var node = document.getElementById(id);
    if (n > max) {
        node.style.height = (max * 20) + "px";
        node.style.overflowY = "scroll";
    } else {
        node.style.height = "";
        node.style.overflowY = "hidden";
    }
    if (resize) {
        window.__DAhandleResize();
    }
}
function setupWindowResizeHandler(target, ids, adj) {
    var length = ids.length;
    var doms = new Array();
    for (var i = 0; i < length; i ++) {
        doms[i] = document.getElementById(ids[i]);
    }
    var tadom = document.getElementById(target);

    window.__DAhandleResize = function() {
        // resize the body element
        var minus_y = adj;
        var junk = 0;
            junk = (document.body.offsetHeight + 1);
        for (var i = 0; i < length; i ++) {
            junk = (doms[i].offsetHeight + 1);
            minus_y += doms[i].offsetHeight;
        }

        var win_y = getWindowHeight();
        var y     = win_y - minus_y;

        if (y > 100) {
            tadom.style.height = (y) + 'px';
        } else {
            tadom.style.height = '100px';
        }
    }
    window.__DAhandleResize();
    var count = 0;
    var currentHeight;
    if (getBrowser() == 3) {
        window.onresize = function() {
            if (count > 2 && currentHeight != document.documentElement.clientHeight) {
                window.__DAhandleResize();
                count = 0; currentHeight = document.documentElement.clientHeight;
            } else {
                count ++;
            }
        };
    } else {
       window.onresize = function() {
            window.__DAhandleResize();
       };
    }
    return "";
}
function getWindowHeight() {
    var height = self.innerHeight;
    var mode   = document.compatMode;
    if (mode || getBrowser() == 3) {
        if (mode == 'CSS1Compat') {
            height = document.documentElement.clientHeight;
        } else {
            height = document.body.clientHeight;
        }
    }
    return height;
}
//--></script>
        #;

	}

	my $keyDownfunc=qq#
       var isMSIE    = /*\@cc_on!\@*/false;
       YAHOO.util.Event.addListener(window.document, "keydown", function(e) {
            var event;
            if(isMSIE){
                event = window.event;
            }else{
                event = e;
            }
            var type = YAHOO.util.Event.getTarget(event).type;

            if (YAHOO.util.Event.getCharCode(event) === Event.KEY_BACKSPACE) {
                if (type === "textarea" || type === "text" || type === "file" || type === "password") {
                    return true;
                } else {
                    YAHOO.util.Event.preventDefault(e);
                    return false;
                }
            }
            return true;
        }, window.document, true);
	#;

    $fckscript = (not $DA::Vars::p->{FIREBUG}) ? $fckscript :
        qq#
            <script>console.time("loadFckScript");</script>
            $fckscript
            <script>console.timeEnd("loadFckScript");</script>
        #;

    if($resize_fnc_arg){
        my $resize_fnc="setupWindowResizeHandler('$resize_fnc_arg->{target}',$resize_fnc_arg->{other} , $resize_fnc_arg->{size});";
        return($fckscript, $keyDownfunc,$resize_fnc);
    }else{
        return($fckscript, $keyDownfunc);
    }
}
sub create_fckeditor{
    my ($session, $FCK_Param) = @_;
    my $instance_name = $FCK_Param->{FCK_InstanceName};
    my $width         = $FCK_Param->{width};
    my $height        = $FCK_Param->{height};
    my $custom = DA::IS::get_sys_custom($session, "richtext");

    my $fckscript = qq|
        $FCK_Param->{FCK_Instance} = new FCKeditor('$instance_name','$width','$height');
        $FCK_Param->{FCK_Instance}.BasePath = "$FCK_Param->{FCK_BasePath}/";\n|;

    if($FCK_Param->{FCK_Value}){
        $FCK_Param->{FCK_Value} =~ s/(['\\])/\\$1/g;
        $fckscript .=qq|$FCK_Param->{FCK_Instance}.Value='$FCK_Param->{FCK_Value}';\n|;
    }
    if($FCK_Param->{FCK_ConfigFile}){
        $fckscript .= qq |$FCK_Param->{FCK_Instance}.Config['CustomConfigurationsPath'] = "$FCK_Param->{FCK_BasePath}/$FCK_Param->{FCK_ConfigFile}";\n |;
    }
    foreach my $key  (keys %{$FCK_Param->{Custom}}){
        $fckscript .= qq | $FCK_Param->{FCK_Instance}.$key = "$FCK_Param->{Custom}->{$key}";\n|;
    }

    if ($custom->{fontsize_custom} eq "on") {
        my $fontmap;
        foreach my $i (1..7) {
            my $map_l =$custom->{"fontsize_mapping_$i"};
            $fontmap .= "$i:\"$map_l\",";
        }
        $fontmap =~ s/,$//;
        $fckscript .="$FCK_Param->{FCK_Instance}.Config['DA_FontSizeMapping']={$fontmap};\n";

        my ($list, $map, %text, %value);
        my $fast_key;                           # DefaultFontSizeLabelの為
        foreach my $key (sort keys %{$custom}) {
            if ($key =~ /^fontsize\_text\_(\d+)$/) {
                $text{sprintf("%04d", $1)} = $custom->{$key};
                $fast_key = sprintf("%04d", $1) if(!$fast_key);
            } elsif ($key =~ /^fontsize\_value\_(\d+)$/) {
                $value{sprintf("%04d", $1)} = $custom->{$key};
            }
        }
        my $font_sizes ="";
        foreach my $key (sort {$a <=> $b} keys %text) {
            $font_sizes .="$value{$key}/".T_(DA::Unicode::convert_from($text{$key}, "EUC-JP")).";";
        }
        $font_sizes =~ s/;$//;
        $fckscript .="$FCK_Param->{FCK_Instance}.Config['FontSizes'] = '$font_sizes';\n";
        $fckscript .="$FCK_Param->{FCK_Instance}.Config['DefaultFontSizeLabel'] = '".T_(DA::Unicode::convert_from($text{$fast_key},"EUC-JP")) ."';\n";
    }
               
    if($DA::Vars::p->{FIREBUG} &&  $FCK_Param->{FCK_Value} =~/DEBUG/){
        $fckscript .="$FCK_Param->{FCK_Instance}.ToolbarSet = 'DEBUG';\n";
    } 
    $fckscript .="$FCK_Param->{FCK_Instance}.Config['AutoDetectLanguage']=false;\n";
    $fckscript .="$FCK_Param->{FCK_Instance}.Config['DefaultLanguage']='".DA::IS::get_user_lang($session)."';\n";
	$fckscript .="$FCK_Param->{FCK_Instance}.Config['_DA_CSRF_KEY_']='".$DA::Vars::p->{chk_key_param_name}."';\n";
    $fckscript .="$FCK_Param->{FCK_Instance}.Config['_DA_CSRF_VALUE_']='".DA::IS::generate_check_key_val()."';\n";
    $fckscript .="$FCK_Param->{FCK_Instance}.Create();\n";

    ## エディタ内データが変更されたか検地するjavascript関数
    my $resetScript;
    if( ! DA::IS::isFCK(\$FCK_Param->{FCK_Value}) ){
        $resetScript="
            editorInstance.FixBody();
            editorInstance.ResetIsDirty();
        ";
    }
    $fckscript.="\n\n\n";
    $fckscript.="
        function FCK_setDirtyFlag(editorInstance){
            var h = editorInstance.LinkedField;
            var name = h.name + '_dirty';
            var dirty = h.form[name];
            if (dirty.value == 'true') return;
            dirty.value  =  editorInstance.IsDirty();
        }
        function FCKeditor_OnComplete( editorInstance ) {
            editorInstance.Events.AttachEvent( 'OnAfterLinkedFieldUpdate',  FCK_setDirtyFlag ) ;
            $resetScript
 		}
	";

    return $fckscript;
}

# 新エディタ作成データ識別
# $htmlの先頭に新エディタ識別コメントがあれば1,なければ0を返す
sub isFCK{
    ## 新エディタ識別コメント:<!-- Created by DA_Richtext v2.0 -->
    my($html)=@_;
    if( $$html =~ /^\s*\Q<!-- Created by DA_Richtext v2.0 -->\E/i){
        return 1;
    }
    return 0;
}

sub set_is_ug_table{
	my ($session,$sel_list)=@_;
    my $list_num = scalar values %$sel_list;
	if ($list_num>$DA::Vars::p->{ug_info}->{ug_regist_max}){
		return;
	}	

	my $date=DA::CGIdef::get_date("Y4/MM/DD-HH:MI:SS");

	$session->{user}=~/(\d\d)$/;
	my $mid=$1;
	if($mid=~ /^0/){
		substr($mid,0,1)="";
	}
	my $table_name="is_ug_regist_$mid";
	DA::Session::trans_init($session);
	eval{
    	my $sql="SELECT num FROM $table_name WHERE mid=? AND target=?";
    	my $sth=$session->{dbh}->prepare("$sql");
       	my $sql_1   = "UPDATE $table_name SET r_date=?,"
				.	"num=? WHERE mid=? AND target=?";
    	my $sth_1   = $session->{dbh}->prepare($sql_1);
	   	my $sql_2   = "INSERT INTO $table_name (mid,target,r_date,num)".
					" VALUES(? , ? , ? , ?)";
    	my $sth_2   = $session->{dbh}->prepare($sql_2);
		foreach my $data(keys %$sel_list){
		    $sth->bind_param(1,$session->{user},3);
            $sth->bind_param(2,$data,3);
        	$sth->execute();
			my($db_seq)=$sth->fetchrow;

			if($db_seq){
				$db_seq=$db_seq+1;
				$sth_1->bind_param(1, $date, 1);
				$sth_1->bind_param(2, $db_seq, 3);
        		$sth_1->bind_param(3, $session->{user}, 3);
        		$sth_1->bind_param(4, $data, 3);
				$sth_1->execute();
			}else{	
		   	    $sth_2->bind_param(1, $session->{user}, 3);
        		$sth_2->bind_param(2, $data, 3);
        		$sth_2->bind_param(3, $date, 1);
        		$sth_2->bind_param(4, 1, 3);
				$sth_2->execute();
			}
		}
		$sth->finish;
	};
	if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }
}

#--------------------------------------------------
# スケジュールのチャート用のスタイル
# (Scheduler.pm から移行)
sub get_sc_chart_line_class {
    my ($print) =@_;

    my $b_t_width="0px";
    my $b_t_color="#FFF";
    if ($print) {
       $b_t_width="1px";
       $b_t_color="#999";
    }

    my $class=<<buf_end;
table.chart_line {
  width              :100%;
  border-collapse    :collapse;
  border-style       :solid;
  border-color       :#FFF;
  border-left-color  :#999;
  border-right-color :#999;
  border-bottom-color:#999;
  border-top-color   :$b_t_color;
  border-width       :2px;
  border-top-width   :$b_t_width;
  border-bottom-width:1px;
}
table.chart_line_left {
  width              :100%;
  border-collapse    :collapse;
  border-style       :solid;
  border-color       :#FFF;
  border-left-color  :#999;
  border-right-color :#999;
  border-bottom-color:#999;
  border-top-color   :$b_t_color;
  border-width       :2px;
  border-top-width   :$b_t_width;
  border-bottom-width:1px;
  border-right-width :0px;
}
table.chart_line_right {
  width              :100%;
  border-collapse    :collapse;
  border-style       :solid;
  border-color       :#FFF;
  border-left-color  :#999;
  border-right-color :#999;
  border-bottom-color:#999;
  border-top-color   :$b_t_color;
  border-width       :2px;
  border-top-width   :$b_t_width;
  border-bottom-width:1px;
  border-left-width  :0px;
}
table.chart_line_no_edge {
  width              :100%;
  border-collapse    :collapse;
  border-style       :solid;
  border-color       :#FFF;
  border-left-color  :#999;
  border-right-color :#999;
  border-bottom-color:#999;
  border-top-color   :$b_t_color;
  border-width       :0px;
  border-top-width   :$b_t_width;
  border-bottom-width:1px;
}
table.chart_line td,
table.chart_line_left td,
table.chart_line_right td,
table.chart_line_no_edge td {
  width           :100%;
  padding         :0px;
  background-color:#CCC;
}
buf_end
    return $class;
}

sub get_normal_table_class {
    my $class=<<buf_end;
table.normal {
  width           :98%;
  border-collapse :collapse;
  border-width    :1px;
  border-style    :solid;
  border-color    :$DA::Vars::p->{base_color};
}
table.normal td,
table.normal th {
  border-color :$DA::Vars::p->{base_color};
  border-width :1px;
  padding      :1px;
}
buf_end
    return $class;
}

sub get_force_menu{
	my($session,$module) = @_;
	# 引数として渡される$moduleは常にadmin=1の状態でのget_moduleでなければならない
	if(!$module){ 
		$module = DA::IS::get_module($session,1);
	}
	# 今のget_app_linkの実装は明らかに間違っているが、間違った仕様の副作用を利用している実装が潜んで
	# いるかもしれないので、修正せずにそのまま利用。admin=1のget_moduleの結果を利用すれば問題ない。
	my $app_link = DA::IS::get_app_link_option($session,$module);
	my $module_force = {};
	foreach my $no (grep $app_link->{$_}->{active} eq 9, keys %{$app_link}) {
		my (@mods)=split(/\||\&/,$app_link->{$no}->{module});
		foreach my $mod(@mods){
			if($app_link->{$no}->{module} =~ /\|/){
				unless($module_force->{$mod}->{type} == 1){
					$module_force->{$mod}->{type} = 2;
					$module_force->{$mod}->{name} = $app_link->{$no}->{name};
					$module_force->{$mod}->{alternative} = $app_link->{$no}->{module};
				}
			}else{
				$module_force->{$mod}->{type} = 1;
				$module_force->{$mod}->{name} = $app_link->{$no}->{name};
			}
		}
	}
	return $module_force;
}

# チェックボックスの全選択部品
sub get_allCheckboxChecker_tag {
	my ($session, $func, $checkboxes, $method) = @_;

	unless ($method) {
		$method = {};
	}

	my $tag =<<end_tag;
<img src="$session->{img_rdir}/icon_chk01.gif" width=13 height=13 alt="@{[t_('全選択')]}" title="@{[t_('全選択')]}" onClick="$func(this, [@{[join(',', @{$checkboxes})]}]);$method->{onClick}" style="cursor: pointer;">
end_tag

	return($tag);
}

sub get_allCheckboxChecker_js {
	my ($session, $func) = @_;

	my $js =<<end_js;
$func = function(dom, LIST) {
    var get = function(name) {
        return document.getElementsByName(name)[0];
    };
    var on = function() {
        var length = LIST.length;
        var i = 0, d;
        for (i = 0; i < length; i ++) {
            d = get(LIST[i]);
            if (d && d.checked === false) {
                d.checked = true;
            }
        }
    };
    var off = function() {
        var length = LIST.length;
        var i = 0, d;
        for (i = 0; i < length; i ++) {
            d = get(LIST[i]);
            if (d && d.checked === true) {
                d.checked = false;
            }
        }
    };
    if (dom) {
        if (dom.src.match(/\\/icon\\_chk01\\.gif\$/)) {
            on();
            dom.src = "$session->{img_rdir}/icon_chk02.gif";
            dom.alt = dom.title = "@{[t_('全解除')]}";
        } else {
            off();
            dom.src = "$session->{img_rdir}/icon_chk01.gif";
            dom.alt = dom.title = "@{[t_('全選択')]}";
        }
    }
};
end_js

	return($js);
}

# 画面ロックに使用するスタイル、JavaScript, DIV 定義を返す
sub get_freeze_class {
	my ($session,$msg) = @_;

	$msg=t_('検索中・・・') if(!$msg);

	my $freeze={};
	my $prefx = DA::IS::get_uri_prefix();
	$freeze->{style}="<link rel=\"stylesheet\" type=\"text/css\" "
				."href=\"$DA::Vars::p->{js_rdir}/common/freeze.css?$prefx\">";
	$freeze->{script}="<script type=\"text/javascript\" "
				."src=\"$DA::Vars::p->{js_rdir}/common/freeze.js?$prefx\"></script>";

	$freeze->{div}=qq{
		<div align="center" id="FreezePane" class="FreezePaneOff">
   			<div id="InnerFreezeImage"> </div>
   			<div id="InnerFreezePane" class="InnerFreezePane"> 
   				<IMG SRC="$session->{img_rdir}/search.gif" WIDTH=133 HEIGHT=88><br><br>$msg
   			</div>
		</div>
	};

	return ($freeze);
}

sub check_force_menu{
	my($session,$module,$module_force,$noerror) = @_;
	my $error = "";
	foreach my $key (grep $module_force->{$_}->{type} == 2,keys %{$module_force}){
		my (@mods)=split(/\|/,$module_force->{$key}->{alternative});
		my $check = 0;
		foreach my $mod (@mods){
			if($module->{$mod} eq 'on'){
				$check++;
			}
		}
		if($check == 0){ # error 文言はイマイチなので変更してください。
			$error.=t_("%1の強制表示と矛盾する設定にはできません。",T_($module_force->{$key}->{name}));
			last;
		}
	}
	if($error ne "" && !$noerror){
		$error.=t_("設定処理を中断しました。");
		DA::IS::conf_error_msg($session,{error => $error});
	}	
	return $error;
}

#------ユーザと一緒に表示情報を取得関数
sub dis_attach_user_info {
	my ($session,$id,$pname,$mode,$msid) = @_;
	my $tmp = {};
    my @dis_col;
    my $att_user_info;   
    if($session->{user_view}){
		if ($session->{select_info} eq '1'){
			if ($pname){
				if($session->{user_view_len} > 0 && (!$mode ||$mode ne 'user_view_all')){
					$att_user_info= DA::IS::format_jsubstr($session,$pname,0,$session->{user_view_len});
				}else{
					$att_user_info=$pname;
				}
			}else{
				push(@dis_col,'primary_gname');
				$tmp=DA::IS::get_user_info($session, $id, \@dis_col, $msid);
				if($session->{user_view_len} > 0 && (!$mode ||$mode ne 'user_view_all')){
					$att_user_info= DA::IS::format_jsubstr($session,$tmp->{pop(@dis_col)},0,$session->{user_view_len});
				}else{
					$att_user_info=$tmp->{pop(@dis_col)};
				}
			}
            $att_user_info = " ($att_user_info)";
		}elsif($session->{select_info} eq '2'){
			push(@dis_col,'email');
			$tmp=DA::IS::get_user_info($session, $id, \@dis_col, $msid);
			if($session->{user_view_len} > 0 && (!$mode ||$mode ne 'user_view_all')){
				$att_user_info= DA::IS::format_jsubstr($session,$tmp->{pop(@dis_col)},0,$session->{user_view_len});
			}else{
				$att_user_info=$tmp->{pop(@dis_col)};
			}
			$att_user_info = " ($att_user_info)";
		}elsif($session->{select_info} eq '3' && $DA::Vars::p->{hidden_userinfo_emp_id} ne 'off'){
			my $conf = DA::IS::get_sys_custom($session,"address");
			if ($conf->{emp_id} eq 'on') {
				push(@dis_col,'emp_id');
				$tmp=DA::IS::get_user_info($session, $id, \@dis_col, $msid);
			}
			if($tmp->{emp_id}){
				if($session->{user_view_len} > 0 && (!$mode ||$mode ne 'user_view_all')){
					$att_user_info= DA::IS::format_jsubstr($session,$tmp->{pop(@dis_col)},0,$session->{user_view_len});
					$att_user_info = " ($att_user_info)";
				}else{
					$att_user_info = " ($tmp->{pop(@dis_col)})";
				}
			}else{
				$att_user_info = "";
			} 		
		}elsif($session->{select_info} eq '5' && $DA::Vars::p->{hidden_userinfo_user_id} ne 'off'){
			push(@dis_col,'user_id');
			$tmp=DA::IS::get_user_info($session, $id, \@dis_col, $msid);
			if($session->{user_view_len} > 0){
				$att_user_info= DA::IS::format_jsubstr($session,$tmp->{pop(@dis_col)},0,$session->{user_view_len});
				$att_user_info = " ($att_user_info)";
			}else{
				$att_user_info = " ($tmp->{pop(@dis_col)})";
			}
		}else{
			$att_user_info = "";
		}   
	}else{
		$att_user_info = "";
	}
	return $att_user_info;
}
sub label_click_add_id {
    my ($input_tag, $id) = @_;
    my $output_tag = $input_tag;
    if ($output_tag =~ /\sid/) {
    } else {
        $output_tag =~s/\>/\ id\=$id\>/;
    }
	return ($output_tag);
}

sub label_click_enclose {
    my ($string,$id) = @_;
    my $label =<<end_tag;
<label for=$id>$string</label>
end_tag
}

# js,cssファイルのキャッシュをクリアするためのprefix文字列を生成して返す
# 戻り値: 
#     $modeは「txtstyle」の場合、$DA::IsVersion::PatchBuildDate+$DA::Vars::p->{style_sheet}を元に生成した6文字のダイジェスト文字列
#     $modeはその他の値の場合、$DA::IsVersion::PatchBuildDateを元に生成した6文字のダイジェスト文字列
sub get_uri_prefix{
	my ($mode) = @_;
	my $prexf_str;
	if ($mode eq "txtstyle") {
		$prexf_str = substr(Digest::MD5::md5_hex($DA::IsVersion::PatchBuildDate.$DA::Vars::p->{style_sheet}), 0, 6);
	} else {
		$prexf_str = substr(Digest::MD5::md5_hex($DA::IsVersion::PatchBuildDate), 0, 6);
	}
	return $prexf_str;
}

sub richtext2text {
	my ($session, $text) = @_;

	DA::RichtextValid::strip_da_tag(\$text);

	my $ol = sub {
		my ($s) = @_;
		my $i   = 1;
		$s =~ s/[\r\n]//g;
		$s =~ s/<li[\x00-\xff]*?>(.+?)<\/li>/$i++ . "\. $1\n"/eig;
		return($s);
	};
	my $ul = sub {
		my ($s) = @_;
		$s =~ s/[\r\n]//g;
		$s =~ s/<li[\x00-\xff]*?>(.+?)<\/li>/"\* $1\n"/eig;
		return($s);
	};

	$text =~ s/<style>[^<>]*<\/style>//ig;
	$text =~ s/[\r\n]//g;
	$text =~ s/<\/div>/\n/ig;
	$text =~ s/<ol>([\x00-\xff]+?)<\/ol>/$ol->($1)/eig;
	$text =~ s/<ul>([\x00-\xff]+?)<\/ul>/$ul->($1)/eig;
	$text =~ s/<p(?:\s+[^<>]+)?>([\x00-\xff]+?)<\/p>/$1\n/ig;
	$text =~ s/<br>/\n/ig;
	$text =~ s/<[^<>]+?>//g;
	$text =~ s/&nbsp;/ /g;
	$text =~ s/&shy;//g;
	$text = DA::Ajax::simple_decode($text);

	return($text);
}

sub nums2str {
	return join(',', map { int($_) } @_);
}

sub get_jslib_rpath {
	my ($argv1, $argv2) = @_;
	my $prefx = DA::IS::get_uri_prefix();
	my $table = {
		SmartPhone => {
			base     => "$DA::Vars::p->{js_rdir}/SmartPhone/base.js",
			iPhone   => "$DA::Vars::p->{js_rdir}/SmartPhone/iPhone.js",
			portal   => "$DA::Vars::p->{js_rdir}/SmartPhone/portal.js",
			mail     => "$DA::Vars::p->{js_rdir}/SmartPhone/mail.js",
			schedule => "$DA::Vars::p->{js_rdir}/SmartPhone/schedule.js",
			address  => "$DA::Vars::p->{js_rdir}/SmartPhone/address.js",
			dialog   => "$DA::Vars::p->{js_rdir}/SmartPhone/selectDialog.js",
			bottomUp => "$DA::Vars::p->{js_rdir}/SmartPhone/bottomUp.js",
			touchMenu => "$DA::Vars::p->{js_rdir}/SmartPhone/touchMenu.js",
			nsboard  => "$DA::Vars::p->{js_rdir}/SmartPhone/nsboard.js",
			notice   => "$DA::Vars::p->{js_rdir}/SmartPhone/notice.js",
			report   => "$DA::Vars::p->{js_rdir}/SmartPhone/report.js",
			config   => "$DA::Vars::p->{js_rdir}/SmartPhone/config.js",
			storage  => "$DA::Vars::p->{js_rdir}/SmartPhone/storage.js",
			workflow => "$DA::Vars::p->{js_rdir}/SmartPhone/workflow.js",
			libraryFolder  => "$DA::Vars::p->{js_rdir}/SmartPhone/libraryFolder.js",
			libraryList    => "$DA::Vars::p->{js_rdir}/SmartPhone/libraryList.js",
			libraryFile    => "$DA::Vars::p->{js_rdir}/SmartPhone/libraryFile.js",
			allcomp  => "$DA::Vars::p->{js_rdir}/SmartPhone/all-comp.js",
			ios6timers => "$DA::Vars::p->{js_rdir}/SmartPhone/ios6-timers.js",
		},
		jquery    => {
			min    => "$DA::Vars::p->{js_rdir}/jquery/jquery-1.3.2.min.js",
			jgrowl => "$DA::Vars::p->{js_rdir}/jquery/jquery.jgrowl_minimized.js",
			json   => "$DA::Vars::p->{js_rdir}/jquery/jquery.json-2.2.min.js",
			clockpick  => "$DA::Vars::p->{js_rdir}/jquery/jquery.clockpick.1.2.7.js",
			datepicker => "$DA::Vars::p->{js_rdir}/jquery/ui/minified/ui.datepicker.min.js",
			ui => "$DA::Vars::p->{js_rdir}/jquery/ui/jquery-ui.js"
		},
		iui       => "$DA::Vars::p->{js_rdir}/iui/iui.js",
		prototype => "$DA::Vars::p->{js_rdir}/prototype/v1.6.0.3/prototype.js",
		spry      => {
			tabbedpanels => "$DA::Vars::p->{js_rdir}/spry/widgets/tabbedpanels/SpryTabbedPanels.js"
		},
		common    => {
			popup => "$DA::Vars::p->{js_rdir}/common/popup.js",
			crir  => "$DA::Vars::p->{js_rdir}/common/crir.js",
			allnodebug => "$DA::Vars::p->{js_rdir}/common/all-nodebug-comp.js",
			thirdparty => "$DA::Vars::p->{js_rdir}/common/thirdparty-all.js",
			freeze => "$DA::Vars::p->{js_rdir}/common/freeze.js"
		},
		search    => {
			luxor => "$DA::Vars::p->{js_rdir}/search/luxor.js"
		},
		DA        => {
			allnodebug => "$DA::Vars::p->{js_rdir}/DA/all-nodebug-comp.js",
			thirdparty => "$DA::Vars::p->{js_rdir}/DA/thirdparty-all.js"
		},
	};
	if (defined $argv2) {
		return(DA::Valid::check_path($table->{$argv1}->{$argv2}) . '?' . $prefx);
	} else {
		return(DA::Valid::check_path($table->{$argv1}) . '?' . $prefx);
	}
}

sub get_css_rpath {
	my ($argv1, $argv2) = @_;
	my $prefx = DA::IS::get_uri_prefix();
	my $agent = DA::CGIdef::get_user_agent($ENV{'HTTP_USER_AGENT'});
	my $allcss = ($agent->{browser} eq "InternetExplorer" && int($agent->{browser_v}) >= 7 && $agent->{engine} eq "Trident" && int($agent->{engine_v}) >= 4) ? "all_IE8.css" : "all.css";
	my $table = {
		SmartPhone => {
			base    => "$DA::Vars::p->{css_rdir}/SmartPhone/iphone_style.css",
			iphone5  => "$DA::Vars::p->{css_rdir}/SmartPhone/iphone5.css",
			iphone  => "$DA::Vars::p->{css_rdir}/SmartPhone/iphone.css",
			ipad    => "$DA::Vars::p->{css_rdir}/SmartPhone/ipad.css",
			android => "$DA::Vars::p->{css_rdir}/SmartPhone/android.css",
			dialog  => "$DA::Vars::p->{css_rdir}/SmartPhone/dialog.css"
		},
		jquery => {
			jgrowl => "$DA::Vars::p->{js_rdir}/jquery/jquery.jgrowl.css",
			theme  => "$DA::Vars::p->{js_rdir}/jquery/themes/insuite/ui.theme.css",
			clockpick => "$DA::Vars::p->{js_rdir}/jquery/jquery.clockpick.1.2.7.css",
			datepicker => "$DA::Vars::p->{js_rdir}/jquery/themes/insuite/ui.datepicker.css"
		},
		iui  => "$DA::Vars::p->{js_rdir}/iui/iui.css",
		iui5  => "$DA::Vars::p->{js_rdir}/iui/iui5.css",
		spry => {
			tabbedpanels => "$DA::Vars::p->{js_rdir}/spry/widgets/tabbedpanels/SpryTabbedPanels.css"
		},
		style => "$DA::Vars::p->{css_rdir}/style.css",
		admin => "$DA::Vars::p->{css_rdir}/adminsite_style.css",
		common => {
			btn => "$DA::Vars::p->{css_rdir}/btn_style.css",
			all => "$DA::Vars::p->{js_rdir}/common/$allcss",
			freeze => "$DA::Vars::p->{js_rdir}/common/freeze.css"
		},
		search => {
			base => "$DA::Vars::p->{css_rdir}/search/search_style.css",
			guide => "$DA::Vars::p->{css_rdir}/search/search_guide.css"
		}
	};
	if (defined $argv2) {
		if( DA::Valid::check_path($table->{$argv1}->{$argv2})  ){
			return(DA::Valid::check_path($table->{$argv1}->{$argv2}) . '?' . $prefx);
		}else{
			return "";
		}
	} else {
		return(DA::Valid::check_path($table->{$argv1}) . '?' . $prefx);
	}
}

# カンマ区切りの文字列を配列にし、空要素を削除してから返す。$sepで区切り文字を変える
# $str: 対象となる文字列
# $sep: 区切り文字の指定。デフォルトは","
sub str_to_array($;$){
	my($str,$sep)=@_;
	$sep |= ",";
	my @tmp_list = split($sep,$str);
	return grep(/[^\s]/,@tmp_list);
}

# sql where句のLIKEに指定するキーワードエスケープ処理
# $word: キーワード文字列
# $charset : 文字コード指定
sub escape_sql_keyword($;$) {
    my ($word, $charset) = @_;

	unless ($charset) {
		$charset = DA::Unicode::internal_charset();
	}
		
    my $ESC_CHAR    = '$';
    my $ESC_TARGET  = '\$|\_|\%';
    my $ESC_JTARGET = '\＿|\％';
       $ESC_JTARGET = DA::Charset::convert(\$ESC_JTARGET, DA::Unicode::sourcecode_charset, $charset);
	my $SPACE_CHAR  = "　";
	   $SPACE_CHAR  = DA::Charset::convert(\$SPACE_CHAR, DA::Unicode::sourcecode_charset, $charset);
	
	if ($charset eq "UTF-8") {
        $word =~s/\G((?:$DA::Vars::p->{utf8_regex})*?)($ESC_TARGET)/$1$ESC_CHAR$2/g;
        $word =~s/\G((?:$DA::Vars::p->{utf8_regex})*?)($ESC_JTARGET)/$1$ESC_CHAR$2/g;
    } else {
        $word =~s/\G((?:$DA::Vars::p->{euc_regex})*?)($ESC_TARGET)/$1$ESC_CHAR$2/g;
        $word =~s/\G((?:$DA::Vars::p->{euc_regex})*?)($ESC_JTARGET)/$1$ESC_CHAR$2/g;
    }

	my $like_word = "%$word%";

    return ($word, $ESC_CHAR, $SPACE_CHAR, $like_word);
}

sub escape_sql_keyword_with_filter($;$;$) {
	my ($word, $filter, $charset) = @_;

	foreach my $f (split(/\|/, $filter)) {
		if ($f eq "zs2hs") {
			$word = DA::Unicode::jreplace($word, '　', ' ');
		} elsif ($f eq "hs2zs") {
			$word = DA::Unicode::jreplace($word, ' ', '　');
		} elsif ($f eq "uc") {
			$word = DA::Unicode::upper($word);
		} elsif ($f eq "lc") {
			$word = DA::Unicode::lower($word);
		}
	}

	return(DA::IS::escape_sql_keyword($word, $charset));
}

sub get_server_port {
	return(($ENV{SERVER_PROTOCOL} eq 'INCLUDED') ? (split(/\:/, $ENV{HTTP_HOST}))[1] || 80 : $ENV{SERVER_PORT});
}

# システム管理者か判定
sub is_system_admin {
	my($session)=@_;
	return 1 if( $session->{user} ==  $DA::Vars::p->{insuite_mid});
	return 0;
}

sub get_spry_notabbedpannels_tag {
	my ($session, $org_src, $id, $sel, $query) = @_;
	my $sprynum = $query->param($id . "spryNum") || $query->param("sprynum");

	my $parse_query = sub {
		my ($string) = @_;
		my $data = {};

		my ($cgi, $query) = split(/\?/, $string, 2);
		foreach my $item (split(/\&/, $query)) {
			my ($key, $value) = split(/\=/, $item);
			if ($key eq "title") {
				$data->{$key} = URI::Escape::uri_unescape($value);
			} else {
				$data->{$key} = $value;
			}
		}

		return($cgi, $data);
	};

	my $create = 0;
	unless ($sprynum) {
		$sprynum = DA::IS::get_count($session, "spry_tab_number", 1);
		$create = 1;
	}

	my $update = 0;
	if ($query->param("add") || $query->param("del") || $query->param($id . "Changed")) {
		$update = 1;
	}

	my ($cgi, $data) = $parse_query->($org_src);
	my $src = $cgi . "?num=" . $sprynum . "&index=0&init=1&time=" . time;
	if ($data->{clear}) {
		$src .= "&clear=1";
		delete $data->{clear};
	}

	my $iframe = "<iframe id=\"" . enc_($id . "Iframe0Id") . "\" src=\"" . $src . "\" width=\"100%\" height=\"100%\" marginwidth=0 marginheight=0 frameborder=1 scrolling=auto></iframe>";

	if ($create || $update) {
		if (DA::Session::lock("$session->{sid}-spry_tabbedpanels_params")) {
			my $file = "$session->{temp_dir}/$session->{sid}.spry_tabbedpanels_params-$sprynum.dat";
			if ($create) {
				DA::Unicode::storable_store({ 0 => $data }, $file);
			} else {
				my $c = DA::Unicode::storable_retrieve($file);
				foreach my $key (keys %{$data}) {
					$c->{0}->{$key} = $data->{$key};
				}
				DA::Unicode::storable_store($c, $file);
			}
			DA::Session::unlock("$session->{sid}-spry_tabbedpanels_params");
		}
	}


	my $tag =<<end_tag;
$iframe
<input type=hidden name="@{[enc_($id . 'spryNum')]}" value="@{[enc_($sprynum)]}">
<input type=hidden name="@{[enc_($id . 'Changed')]}" value="0">
@{[($sel) ? "<input type=hidden name=\"" . enc_($sel) . "\" value=\"\">" : ""]}
<script language="JavaScript" type="text/javascript">
function cInfo() {
	var value = DAselectedPortletNumber;
	if (value) {
	if (value.indexOf("ex_") != -1) {
		value=value.substr(3,value.length);
	}
	if (isNaN(value)) {
		alert("@{[t_('選択されたポートレットは標準ポートレットです。')]}");
	} else {
		cgi='info_card.cgi?type=call&num='+value;
		var ginfo=window.open(setUrl('$DA::Vars::p->{cgi_rdir}/'+cgi),
			'','width=470,height=450,resizable=1,scrollbars=1');
		}
	} else {
		alert("@{[t_('ポートレットが選択されていません。')]}");
	}
}
function setPortletNumber() {
	@{[($sel) ? "document.forms[0].$sel\.value = DAselectedPortletNumber;" : ""]}
}
function GroupChange() {
	if (onChanging == 0) {
		onChanging = 1;
		document.forms[0].@{[$id]}Changed.value = 1;
		document.forms[0].submit();
	}
}
</script>
end_tag

	return($tag);
}

sub get_spry_tabbedpanels_tag {
	my ($session, $params, $id, $sel, $query) = @_;
	my $jsname  = $id . "JS";
	my $chkname = $id . "JSchecker";
	my $hidden  = $id . "defaultTab";
	my $default = $query->param($hidden) || 0;
	my $sprynum = $query->param($id . "spryNum") || $query->param("sprynum");

	my $parse_query = sub {
		my ($string) = @_;
		my $data = {};

		my ($cgi, $query) = split(/\?/, $string, 2);
		foreach my $item (split(/\&/, $query)) {
			my ($key, $value) = split(/\=/, $item);
			if ($key eq "title") {
				$data->{$key} = URI::Escape::uri_unescape($value);
			} else {
				$data->{$key} = $value;
			}
		}

		return($cgi, $data);
	};

	my $create = 0;
	unless ($sprynum) {
		$sprynum = DA::IS::get_count($session, "spry_tab_number", 1);
		$create = 1;
	}

	my $update = 0;
	if ($query->param("add") || $query->param("del") || $query->param($id . "Changed") || $query->param("init") || ($query->param("usersel") eq 'end')) {
		$update = 1;
	}

	my ($li, $contents, @iframe);
	my $i = 0;
	my $cache = {};
	foreach my $p (@{$params}) {
		$li .=<<end_tag;
<li class="TabbedPanelsTab" tabindex="0" onclick="@{[enc_($chkname)]}('@{[enc_($id . "Div" . $i . "Id")]}', '@{[enc_($i)]}');">@{[enc_($p->{title})]}</li>
end_tag

		my ($cgi, $data) = $parse_query->($p->{src});
		my $src = $cgi . "?num=" . $sprynum . "&index=" . $i . "&init=1&time=" . time;
		if ($data->{clear}) {
			$src .= "&clear=1";
			delete $data->{clear};
		}

		if ($data->{extract} eq 'on'){ #各種設定のポートレットのオプション
			$src .= "&list=$data->{list}&extract=$data->{extract}";
		}

		my $iframe = "<iframe id=\"" . enc_($id . "Iframe" . $i . "Id") . "\" src=\"" . $src . "\" width=\"100%\" height=\"100%\" marginwidth=0 marginheight=0 frameborder=0 scrolling=auto></iframe>";

		if ($i eq $default) {

			$contents .=<<end_tag;
<div id="@{[enc_($id . "Div" . $i . "Id")]}" class="TabbedPanelsContent">
    $iframe
</div>
end_tag

		} else {

			$contents .=<<end_tag;
<div id="@{[enc_($id . "Div" . $i . "Id")]}" class="TabbedPanelsContent">
</div>
end_tag

		}

		push(@iframe, $iframe);
		$cache->{$i} = $data;

		$i ++;
	}

	if ($create || $update) {
		if (DA::Session::lock("$session->{sid}-spry_tabbedpanels_params")) {
			my $file = "$session->{temp_dir}/$session->{sid}.spry_tabbedpanels_params-$sprynum.dat";
			if ($create) {
				DA::Unicode::storable_store($cache, $file);
			} else {
				my $c = DA::Unicode::storable_retrieve($file);
				for (my $j = 0; $j < $i; $j ++) {
					foreach my $key (keys %{$cache->{$j}}) {
						$c->{$j}->{$key} = $cache->{$j}->{$key};
					}
				}
				DA::Unicode::storable_store($c, $file);
			}
			DA::Session::unlock("$session->{sid}-spry_tabbedpanels_params");
		}
	}

	my $tag =<<end_tag;
<div class="TabbedPanels" id="@{[enc_($id)]}" style="width:100%;">
    <ul class="TabbedPanelsTabGroup">
$li
    </ul>
    <div class="TabbedPanelsContentGroup">
$contents
    </div>
</div>
<input type=hidden name="@{[enc_($id . 'spryNum')]}" value="@{[enc_($sprynum)]}">
<input type=hidden name="@{[enc_($id . 'Changed')]}" value="0">
<input type=hidden name="@{[enc_($hidden)]}" value="@{[enc_($default)]}">
@{[($sel) ? "<input type=hidden name=\"" . enc_($sel) . "\" value=\"\">" : ""]}

<script language="JavaScript" type="text/javascript">
var $jsname = new Spry.Widget.TabbedPanels('@{[js_esc_($id)]}', { defaultTab: @{[int($default) || 0]} });
var $chkname = function(id, num) {
	var data = @{[JSON::objToJson(\@iframe, {autoconv => 0})]};
	if (!\$(id).innerHTML.match(/iframe/i)) {
		\$(id).innerHTML = data[num];
	}
	try {
		document.forms[0].$hidden\.value = num;
	} catch(e) {
	}
};
function cInfo() {
	var value = DAselectedPortletNumber;
	if (value) {
		if (value.indexOf("ex_") != -1) {
			value=value.substr(3,value.length);
		}
		if (isNaN(value)) {
			alert("@{[t_('選択されたポートレットは標準ポートレットです。')]}");
		} else {
			cgi='info_card.cgi?type=call&num='+value;
			var ginfo=window.open(setUrl('$DA::Vars::p->{cgi_rdir}/'+cgi),
			'','width=470,height=450,resizable=1,scrollbars=1');
		}
	} else {
		alert("@{[t_('ポートレットが選択されていません。')]}");
	}
}
function setPortletNumber() {
	@{[($sel) ? "document.forms[0].$sel\.value = DAselectedPortletNumber;" : ""]}
}
function GroupChange() {
	if (onChanging == 0) {
		onChanging = 1;
		document.forms[0].@{[$id]}Changed.value = 1;	
		document.forms[0].submit();
	}
}
</script>
end_tag

	my $js =<<end_js;
<script type="text/javascript" src="@{[DA::IS::get_jslib_rpath("spry", "tabbedpanels")]}"></script>
<link href="@{[DA::IS::get_css_rpath("spry", "tabbedpanels")]}" rel="stylesheet" type="text/css" />
end_js

	return($tag, $js, $sprynum);
}

sub get_spry_tabbedpanels_params {
	my ($session, $id, $query) = @_;
	my $sprynum = $query->param($id . "spryNum") || $query->param("sprynum");
	my $index = $query->param($id ."defaultTab") || 0;
	my $cache = {};

	if ($sprynum) {
		if (DA::Session::lock("$session->{sid}-spry_tabbedpanels_params")) {
			$cache = DA::Unicode::storable_retrieve("$session->{temp_dir}/$session->{sid}.spry_tabbedpanels_params-$sprynum.dat");
			DA::Session::unlock("$session->{sid}-spry_tabbedpanels_params");
		}
	}

	return($sprynum, $index, $cache);
}

sub string_match {
	my ($str, $pattern) = @_;

	if (DA::Unicode::internal_charset() eq "UTF-8") {
		my $ascii = '[\x00-\x7f]';
		my $two   = '[\xc0-\xdf][\x80-\xbf]';
		my $three = '[\xe0-\xef][\x80-\xbf]{2}';
		my $four  = '[\xf0-\xf7][\x80-\xbf]{3}';
		if ($str =~ /\G((?:$ascii|$two|$three|$four)*?)(\Q$pattern\E)/) {
			return(1);
		} else {
			return(0);
		}
	} else {
		my $ascii = '[\x00-\x7f]';
		my $two   = '[\x8e\xa1-\xfe][\xa1-\xfe]';
		my $three = '\x8f[\xa1-\xfe][\xa1-\xfe]';
		if ($str =~ /\G((?:$ascii|$two|$three)*?)(\Q$pattern\E)/) {
			return(1);
		} else {
			return(0);
		}
	}
}

# 管理権限ユーザかつグループ制限のあるユーザか判定
sub is_limited_admin {
	my($session)=@_;
	if ( $session->{admin} == 2 && $session->{limited_admin} == 1) {
		return 1;
	}
	return 0;
}

# 管理権限ユーザかつグループ制限のないユーザか判定
sub is_limited_admin_top {
	my($session)=@_;
	if ( $session->{admin} == 2 && $session->{limited_admin} == 0) {
		return 1;
	}
	return 0;
}

# 例外がある場合に、それがDBエラーであれば1
# それ以外は0を返す
# エラーコードを引数として指定することもできる
sub is_db_err{
	my($err)= @_;

	if($err == undef){
		$err = $@;
	}
	return 0 unless( $err );

	if( $DA::Vars::p->{ORACLE} ){ 
		return 1 if( $err =~ /DBD::Oracle/i && $err =~/ORA\-\d{5}/i ) ;
	}else{
		return 1 if( $err =~ /DBD::mysql/i && $err =~ /execute failed/i) ;
	}
	return 0;
}

# 下記のCBPを実行するかどうかを判断する。
# 	・DA::Custom::begin_user_modify
# 	・DA::Custom::check_user_modify
# 	・DA::Custom::begin_user_delete
# 	・DA::Custom::check_user_delete
# 	・DA::Custom::begin_admin_user_modify
# 	・DA::Custom::check_admin_user_modify
# 	・DA::Custom::begin_ml_modify
# 	・DA::Custom::check_ml_modify
# 	・DA::Custom::begin_ml_delete
# 	・DA::Custom::check_ml_delete
# 	・DA::Custom::begin_batch_user_modify
# 	・DA::Custom::check_batch_user_modify
# 	・DA::Custom::commit
# 	・DA::Custom::rollback
sub cbp_execute_ok {
	my ($session, $msid) = @_;

	# -------------------------------
	# Custom
	# -------------------------------
	my $res2;
	# 判断条件をカスタマイズするCBP
	$res2 = DA::Custom::cbp_execute_ok_custom($session, $msid);
	if ($res2 =~/0|1/) {
		return $res2;
	}

	my $res = 0;
	# どういう世代の場合に、 CBPを実行するかのパラメータチェック
	if ($DA::Vars::p->{cbp_execute_term} == 1) {
	# $msidの値に関係なく常に 1を返す
		$res = 1;
	} else {
	# 通常は $msidがアクティブ世代の場合だけ 1を返す
		if (DA::MasterManager::is_active_from_session($session, $msid)) {
			$res = 1;
		}
	}
	return $res;
}

sub get_user_login {
	my ($session, $mid) = @_;
	#return if ($mid !~ /^\d$/);
	my ($login, $logout);
	my $table = DA::IS::get_session_table({ user => $mid });
	my $sql = "SELECT last_login FROM $table WHERE mid=? AND status=1";
	my $sth = $session->{dbh}->prepare($sql);
	$sth->bind_param(1, $mid, 3);
	$sth->execute();
	my $last_login = $sth->fetchrow;
	if ($last_login) {
		$login = sprintf("( %s:%s )",t_('最終ログイン'),DA::CGIdef::get_display_date2($session,$last_login,1));
		$logout = 1;
	} else {
		$login = sprintf("( %s )",t_('ログアウト'));
	}
	return ($login, $logout);
}

## $target_array で指定された配列を $max_rowに分割し、2次元配列に再格納する
sub  array_div {
	my ($target_array, $max_row) = @_;
	
	return [] if ( scalar(@$target_array) <= 0 || $max_row <= 0 ) ;

	my $target_num  = scalar(@{$target_array});

	my $in_num  = int($target_num / $max_row);
	my $in_rest = $target_num % $max_row;

	$in_num ++ if (0 < $in_rest);

	my $res;
	for( my $i=0; $i<$in_num; $i++ ){

		my $ts = $i * $max_row;
		my $te  = ( ($in_num <= $i + 1)  && 0 < ( $in_rest ) ) ? $ts + $in_rest -1  : $ts + $max_row - 1;
		my @tmp = @$target_array[$ts..$te];

		@$res[$i] = \@tmp ;
	}

	return ($res);
}

## 管理画面のcgiからの呼び出しか
sub is_admin_cgi {
	return 1 if ( $ENV{SCRIPT_NAME} =~ /$DA::Vars::p->{ad_cgi_rdir}/ );
	return 0;
}

## 一般画面のcgiからの呼び出し ( モバイル版、SP版を含む )
sub is_user_cgi {
	if ( $ENV{SCRIPT_NAME} =~ /$DA::Vars::p->{cgi_rdir}/
		|| $ENV{SCRIPT_NAME} =~ /$DA::Vars::p->{imode_cgi_rdir}/
		|| $ENV{SCRIPT_NAME} =~ /$DA::Vars::p->{sp_cgi_rdir}/
	) {
		return 1;
	}
	return 0;
}

## アカウントAPIからの呼び出し
sub is_cert_api {
	return 1 if ( $ENV{SCRIPT_NAME} =~ /$DA::Vars::p->{restapi_rdir}/ );
	return 0;
}

# YYYY/MM/DD-HH:MI:SS 形式の日付をUNIX時間に変換して返す
sub timelocal {
	my($datetime) = @_;
	my($yy,$mm,$dd,$hh,$mi,$ss) = split(/[\/\-\:\s+]/, $datetime);
	$yy -= 1900;
	$mm -= 1;

	return Time::Local::timelocal($ss,$mi,$hh,$dd,$mm,$yy);
}

# オンラインガイド ( 一般、管理者)の rdirを返す
#
# $session
# $mode    : "admin"の場合は管理者ガイド
sub guide_rdir($;$$) {
	my($session, $mode, $opt) = @_;

	my $rdir = ( $mode eq "admin_guide" ) ? 
			$DA::Vars::p->{ad_guide_rdir} 
			: $DA::Vars::p->{guide_rdir};
	
	
	my $def_lang = $DA::Vars::p->{default_guide_lang};
	
	my $lang = $opt->{lang} || $session->{user_lang} || $def_lang;
	
	if ( $lang ne $def_lang) {  

		$rdir =~ s/guide$/guide\_$lang/;
	}
	# $rdir .= "/";
	return $rdir;
}

# オンラインガイド ( 一般、管理者)の urlを返す(index.html付)
sub guide_url($;$$) {
	my($session, $mode, $opt) = @_;
	return guide_rdir($session, $mode, $opt) . "index.html";
}

# オンラインガイドのdir ( ガイドhtmlを保存しているディレクトリ)
sub guide_dir($;$$) {
	my($session, $mode, $lang) = @_;

	my $dir = ( $mode eq "admin_guide" ) ?
		$DA::Vars::p->{ad_guide_dir}
		: $DA::Vars::p->{guide_dir};
	
	if( $lang && ( $lang ne $DA::Vars::p->{default_guide_lang} ) ) {
		$dir =~ s/guide$/guide\_$lang/;
	}
	return $dir;
}

# 言語に対応したガイドディレクトリ( guide_[lang]/guide_contents が存在するか
# (  guide_{en,zh}/guide_contents ディレクトリが存在すれば V320オンラインガイドモジュール適用済
sub exists_guide_lang($;$) {
	my($session,$lang) = @_;

	$lang ||=$DA::Vars::p->{default_guide_lang};

	my $test_dir = DA::IS::guide_dir($session,undef,$lang);
	$test_dir    .= "/guide_contents";
	
	if ( -d $test_dir ) {
		return 1;
	}
	return 0;
}

# インストーラーのバージョンが3.1.0以降であるかどうかを判定する
sub is_installer_over_310 {
	my $check_version = "03010000";
	my $is_package = $DA::Vars::p->{'is_package'};
	$is_package =~ /\Q(\E([\d+\.]+)\Q)\E/;
	my ($v1,$v2,$v3,$v4) = split(/\./,$1);
	if($v4!~/^\d+$/){$v4 = 0;}
	my $version = sprintf("%02d%02d%02d%02d",$v1,$v2,$v3,$v4);
	if ($version ge $check_version){
		return  1;
	} 
	return  0;
}

# Sm@rtDB単体利用かどうかを取得する
sub is_sdb_stand_alone {
	my $flg = get_smartdb_vars("stand_alone");
	if ( $flg eq "on" ) { return 1;}
	return 0;
}

# Sm@rtDBオンデマンドかどうかを取得する
sub is_sdb_on_demand {
	my $flg = get_smartdb_vars("on_demand");
	if ( $flg eq "on" ) { return 1;}
	return 0;
}

# hibiki.datからsmartdbセクションの値を取得する
sub get_smartdb_vars($) {
	my ($key) = @_;
	return $DA::Vars::p->{hibiki}->{smartdb}->{$key};
}

# インクリメンタルサーチの共有アドレス対応
# $sel_list 共有アドレスの情報リスト
# $mode
#           add 共有アドレス情報にtypeを追加
#           del 共有アドレス情報にtypeを削除
sub toggle_inc_search_addr4ajax {
	my($session, $sel_list, $mode) = @_;

	if (!DA::Ajax::user_search_ok($session)) {
		return(0);
	}
	my $toggle_list;
	foreach my $key (keys %{$sel_list}) {
		my $value = $sel_list->{$key};
		if (!$value) { next; }
		my ($no, $id, $type, $name) = split(/:/, $value, 4);
		if($mode eq 'add'){
			unless (defined($name)){
				$name = $type;
				$type = "A";
				$toggle_list->{$key} = "$no:$id:$type:$name";
		}
		} else {
			if($name){
				$toggle_list->{$key} = "$no:$id:$name";
			}
		}
	}
	return ($toggle_list ? $toggle_list : $sel_list );
}

sub get_button_tag {
    my ($session, $href, $text) = @_;
    my $btn_tag =qq{
		<table><tbody>
		<tr><td class="hl"><a class="small" href="$href">$text</a></td>
		<td class="hr"></td></tr>
		<tr><td class="bl"></td><td class="br"></td></tr>
		</tbody></table>
	};
    return $btn_tag;
}

# Sm@rtDBのプロセスにおいて、上長・上長代行機能の設定があるかどうかを判断
# param: $session
# return: 1 設定がある
#         0 設定がない
sub has_sdb_process_superior {
	my ($session) = @_;

	my $area = DA::IS::get_sdb_process_superiors_ext_name();
	# textareaに定義されない || 空
	unless ($area =~ /textarea/) {
		return 0;
	}

	my $conf = DA::IS::get_sys_custom($session, "custom_check", 1);
	if (exists $conf->{sdb_superiors_display} && $conf->{sdb_superiors_display} eq 'on') {
		return 1;
	} else {
		return 0;
	}
}

# Sm@rtDBのプロセスにおいて、上長・上長代行がDBに保存先の列名を取得
# param: null
# return: 列名
sub get_sdb_process_superiors_ext_name {
	
	my $ext_name = "";
		# モジュールが存在するかどうかのチェック
	my $rc = eval {
		use DA::API::Hibiki::SDB::PeToolCustom;
		$ext_name = $DA::API::Hibiki::SDB::PeToolCustom::EXT_NAME_SUPERIORS;
		1;
	};
	unless ($rc) {
		return $ext_name;
	}
	return $ext_name;
}

# グループの上長と上長代行データを取得
# param: $session
#        $gid
# return: 
#	$data = {
#		U_USERSEL => {},
#		UA_USERSEL => {}
#	};
sub get_group_superior_data {
	my ($session, $gid) = @_;
	
	# 上長・上長代行の保存先の列名
	my $title = DA::IS::get_sdb_process_superiors_ext_name();

	my $msid = DA::MasterManager::get_select_msid($session);

	my $ext_table = DA::IS::get_sdb_process_superior_table($session, $msid);
	my $sql = "SELECT ex.$title FROM $ext_table ex "
			. "WHERE ex.gid = ?";
	my $sth = $session->{dbh}->prepare($sql);
	$sth->bind_param(1, $gid, 3);
	$sth->execute();
	my ($str, $name, $type, $grade, $org_type) = $sth->fetchrow;
	$sth->finish;

	my $data = {};
	my @usersels = qw(U_USERSEL UA_USERSEL);
	my @supers;
	if ($str =~ /;/) {
		@supers = split(/;/, $str);
	} else {
		@supers = ($str);
	}
		
	my %no;
	my $count = 0;

	foreach my $super (@supers) {
		foreach my $mid ( split(/,/, $super) ) {
			$mid =~ s/\n*(.+)\n*/$1/;
			my $v_name = DA::IS::get_ug_name($session,1,$mid);
			my $user = sprintf("%06d:$mid:$v_name->{usel}",++$no{$count});
			$data->{$usersels[$count]}->{$mid} = $user;
		}
		$count++;
	}
	return $data;
}

# 上長・上長代行のデータを保存
# param: $session, $gid, $data, $msid
# return: 0 正常
#         1 エーラ
sub save_sdb_process_superior {
	my ($session, $gid, $data, $msid) = @_;

	if (! exists $data->{U_USERSEL} && ! exists $data->{UA_USERSEL}) {
		return 0;
	}
	# 文字列に変換
	my $superiors = '';
	if (exists $data->{U_USERSEL} && scalar keys %{$data->{U_USERSEL}}) {
		$superiors .= join ',', (keys %{$data->{U_USERSEL}});
	}
	if (exists $data->{UA_USERSEL} && scalar keys %{$data->{UA_USERSEL}}) {
		$superiors .= ';';
		$superiors .= join ',', (keys %{$data->{UA_USERSEL}});
	}

	my $ext_table = DA::IS::get_sdb_process_superior_table($session, $msid);
	my $title = DA::IS::get_sdb_process_superiors_ext_name();

	# 存在チェック
	my $proc = 'add';
	my $sql = "SELECT gid FROM $ext_table WHERE gid = ?";
	my $sth = $session->{dbh}->prepare($sql);
	$sth->bind_param(1, $gid, 3);
	$sth->execute();
	if ( my $re = $sth->fetchrow ) {
		$proc = 'update';
	}

	DA::Session::trans_init($session);
	eval{
		if ($proc eq 'add') {
			my $sql = "INSERT INTO $ext_table (gid, $title) VALUES (?, ?)";
			my $sth = $session->{dbh}->prepare($sql);
			$sth->bind_param(1, $gid, 3);
			$sth->bind_param(2, $superiors, 1);
			$sth->execute();
		} else {
			my $sql = "UPDATE $ext_table SET $title = ? WHERE gid = ?";
			my $sth = $session->{dbh}->prepare($sql);
			$sth->bind_param(1, $superiors, 1);
			$sth->bind_param(2, $gid, 3);
			$sth->execute();
		}
	};
	if(!DA::Session::exception($session)){
		DA::Error::system_error($session);
	}
	return 1;
}

# 上長・上長代行のデータの保存先テーブルを取得
# param: $session, $msid
# return: 保存先テーブル
sub get_sdb_process_superior_table {
	my ($session, $msid) = @_;

	my $table_name = 'is_group_ext';
	if ( DA::MultiLang::master_ok() ) {
		my $master_config = DA::MultiLang::get_master_config($session);
		my $default_lang = $master_config->{default_lang};
		$table_name .= "_$default_lang";
	}
	my $ext_table = DA::IS::get_master_table($session, $table_name, $msid);
	return $ext_table;
}

1;

