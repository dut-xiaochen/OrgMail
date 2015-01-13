package DA::OrgMail;
###################################################
##  INSUITE(R)Enterprise Version 1.5.0.          ##
##  Copyright(C)2003 DreamArts Corporation.      ##
##  All rights to INSUITE routines reserved.     ##
###################################################
use strict;
use DA::Gettext;

sub crypt_pass {
	my ($session,$pass,$mode)=@_;
	# $mode = 1 : 暗号化, $mode = 0 : 解読
    my $cipher=new Crypt::CBC($DA::Vars::p->{unique},'Blowfish');
	if ($mode eq 1) {
    	$pass=$cipher->encrypt($pass);
    	$pass=unpack("H*",$pass);
	} else {
    	$pass=pack("H*", $pass);
    	$pass=$cipher->decrypt($pass);
	}
	return($pass);
}
sub current_account_tag {
	my ($session,$type)=@_;
    my $sec=DA::OrgMail::get_cookie($session);
	if (!$sec || $sec eq $session->{user}) { return; }

	my $org_data=&get_org_mail_data($session,$sec);
	my $mail_name=DA::CGIdef::encode($org_data->{mail_name},1,1,'euc');
	my $mail_addr=DA::CGIdef::encode($org_data->{mail_address},1,1,'euc');
	my $tag=qq{
		$type @{[t_('組織メール%(org_mail)')]}: $mail_name ($mail_addr)
		<input type=hidden name=org_mail value='$sec'><p>
	};
	return($tag);
}
sub check_account_changed {
	my ($session,$query,$type)=@_;
	my $org_mail = $query->param('org_mail');
    my $sec=DA::OrgMail::get_cookie($session);
    if (int($sec) < $DA::Vars::p->{top_gid}) {
		if ($org_mail && $org_mail ne $sec) {
			DA::CGIdef::errorpage($session,
				t_('%1するメールアカウントが切り替えられました。',$type));
		}
	} else {
		if ($org_mail ne $sec) {
			DA::CGIdef::errorpage($session,
				t_('%1するメールアカウントが切り替えられました。',$type));
		}
	}
}
sub update_org_mail_data {
    my ($session,$gid,$data,$user)=@_;
	$data->{mail_user} = $data->{user};
    # Password が空白ならば、変更しない
    if ($data->{pass} ne '||||||||') {
		$data->{mail_pass} = $data->{pass};
    }
	# SMTP Auth
	if ($data->{smtp_pass} ne '||||||||') {
		$data->{mail_smtp_pass} = $data->{smtp_pass};
	}
    my $mail_pass=DA::OrgMail::crypt_pass($session,$data->{mail_pass},1);
	my $smtp_pass=DA::OrgMail::crypt_pass($session,$data->{mail_smtp_pass},1);
    DA::Session::trans_init($session);
    eval {
        my $dg_sql="DELETE FROM is_org_mail_group WHERE gid=?";
        my $dg_sth=$session->{dbh}->prepare($dg_sql);
           $dg_sth->bind_param(1, $gid, 3);
           $dg_sth->execute();

        my $dm_sql="DELETE FROM is_org_mail_auth WHERE gid=?";
        my $dm_sth=$session->{dbh}->prepare($dm_sql);
           $dm_sth->bind_param(1, $gid, 3);
           $dm_sth->execute();

        my $ix=0;
        my $ig_sql="INSERT INTO is_org_mail_group (gid,mail_name,mail_user,mail_pass,"
                  ."mail_address,send_address,mail_color,smtp_user,smtp_pass) VALUES (?,?,?,?,?,?,?,?,?)";
        my $ig_sth=$session->{dbh}->prepare($ig_sql);
           $ig_sth->bind_param(++$ix, $gid, 3);
           $ig_sth->bind_param(++$ix, $data->{mail_name}, 1);
           $ig_sth->bind_param(++$ix, $data->{mail_user}, 1);
           $ig_sth->bind_param(++$ix, $mail_pass, 1);
           $ig_sth->bind_param(++$ix, $data->{mail_address}, 1);
           $ig_sth->bind_param(++$ix, $data->{send_address}, 1);
           $ig_sth->bind_param(++$ix, $data->{mail_color}, 1);
           $ig_sth->bind_param(++$ix, $data->{smtp_user}, 1);
           $ig_sth->bind_param(++$ix, $smtp_pass, 1);
           $ig_sth->execute();

        my $im_sql="INSERT INTO is_org_mail_auth (gid,mid) VALUES (?,?)";
        my $im_sth=$session->{dbh}->prepare($im_sql);
        foreach my $mid (sort keys %{$user->{AUTH_USER}}) {
            $im_sth->bind_param(1, $gid, 3);
            $im_sth->bind_param(2, $mid, 3);
            $im_sth->execute();
        }
    };
    if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }

	my $conf={};
    my @base_list = qw (
        name host port nodetect limit
        inbox_view sent_view draft_view trash_view spam_view
        imap_type imap_account secure smtp_account separator
    );
    my @pop_list = qw (
        pop pop_host pop_keep pop_port pop_apop
    );
    foreach my $key (@base_list) { $conf->{$key}=$data->{$key}; }
    foreach my $key (@pop_list)  { $conf->{$key}=$data->{$key}; }
    DA::IS::save_master({ user => $data->{gid} },$conf,'imap');
}
sub get_org_mail_data {
	my ($session,$gid)=@_;
	my $sql="SELECT * FROM is_org_mail_group WHERE gid=?";
	my $sth=$session->{dbh}->prepare($sql);
	   $sth->bind_param(1, int($gid), 3); $sth->execute();
	my $data=$sth->fetchrow_hashref('NAME_lc'); $sth->finish;

	my $a_sql="SELECT mid FROM is_org_mail_auth WHERE gid=?";
	my $a_sth=$session->{dbh}->prepare($a_sql);
	   $a_sth->bind_param(1, int($gid), 3); $a_sth->execute();
	while (my $mid=$a_sth->fetchrow) {
		$data->{auth}.=($data->{auth}) ? ",$mid" : $mid;
	}
	$a_sth->finish;

	if ($data->{mail_name} eq '') {
		$data->{mail_name}=DA::IS::get_ug_name($session,1,$gid)->{simple_name};
	}
	if ($data->{send_address} eq '') {
		$data->{send_address}=$data->{mail_address};
	}
    $data->{mail_pass}=DA::OrgMail::crypt_pass($session,$data->{mail_pass},0);
	# SMTP Auth
    $data->{smtp_pass}=DA::OrgMail::crypt_pass($session,$data->{smtp_pass},0);
	return($data);
}
sub get_org_mail_permit {
	my ($session,$check,$join)=@_;
	# check = 1 --> チェックのみ (1 or 0) を返す
	# check = 0 --> GID のハッシュ変数を返す

    if (DA::Unicode::internal_charset() ne 'UTF-8') { return {}; }
	return {} unless($session->{user});

	if (!$join) { $join=DA::IS::get_join_group($session,$session->{user},1); }
	$join->{$session->{user}}->{attr}=1;
	$join->{$session->{user}}->{type}=1;

	my $permit={};
	my $g_sql="SELECT gid,mail_name FROM is_org_mail_group";
	my $g_sth=$session->{dbh}->prepare($g_sql); $g_sth->execute();
	while (my ($gid,$mail_name)=$g_sth->fetchrow) {
		if ($join->{$gid}->{attr} !~ /[12UW]/) { next; }
		if ($join->{$gid}->{type} !~ /[123]/) { next; }
		if ($check) {
			$permit->{member}=1; 
			last;
		} else {
			$permit->{member}->{$gid}=$mail_name || 1;
		}
	}
	$g_sth->finish;

	my $a_sql="SELECT a.gid,o.mail_name,g.type "
	 . "FROM is_org_mail_auth a,is_org_mail_group o,is_group g "
	 . "WHERE a.mid=? AND a.gid=o.gid AND a.gid=g.gid";
	my $a_sth=$session->{dbh}->prepare($a_sql); 
	foreach my $id (sort keys %{$join}) {
		if ($join->{$id}->{attr} !~ /[12UW]/) { next; }
		if ($join->{$id}->{type} !~ /[123]/) { next; }
		$a_sth->bind_param(1,$id,3); $a_sth->execute();
		while (my ($gid,$mail_name,$type)=$a_sth->fetchrow) {
			if ($type !~ /[123]/) { next; }
			if ($check) {
				$permit->{auth}=1; 
				last;
			} else {
				$permit->{auth}->{$gid}=$mail_name || 1;
			}
		}
	}
	$a_sth->finish;

	return($permit);
}
sub get_owner_permit {
	my ($session,$gid)=@_;
	my $permit=0;
	my $owno = 16;
	my $owner_group=DA::IS::get_owner_group($session,$session->{user},'',$owno);
	if ($owner_group->{USER}->{$gid}) {
    	$permit=1;
	} elsif ($session->{admin}) {
    	if (DA::IS::is_ctrlable_group($session, $gid)) {
        	$permit=1;
    	}
	}
	return($permit);
}
sub save_queue_data {
	my ($session,$result,$num)=@_;
	my $num_l=DA::CGIdef::get_last_n($num,2);
    my $dir="$DA::Vars::p->{data_dir}/org_mail/$num_l/$num";
	if (! -d $dir) { File::Path::mkpath($dir,0,0755); }
    DA::Unicode::storable_store($result, "$dir/result");
	# 添付ファイルの保持
	foreach my $attach (@{$result->{mime}->{attach}}) {
		if (! -f $attach->{Path}) { next; }
		my ($name,$ext)=DA::CGIdef::get_filename($attach->{Path});
		File::Copy::copy($attach->{Path},"$dir/$name");
	}
}
sub get_queue_data {
	my ($session,$num)=@_;
	my $result={};
	my $num_l=DA::CGIdef::get_last_n($num,2);
    my $dir="$DA::Vars::p->{data_dir}/org_mail/$num_l/$num";
	if (-d $dir) { $result=DA::Unicode::storable_retrieve("$dir/result"); }
	return($result);
}
sub get_preview_tag {
	my ($session,$result)=@_;
	my $charset;
	foreach my $line (split(/\;/,$result->{mime}->{head}->{'X-Insuite-Status'})) {
        my ($key,$value)=split(/\=/,$line);
        if ($key =~/charset/) { $charset=$value; }
	}
	my $tag={};
	$tag->{subject}=$result->{preview}->{subject};
	if ($charset ne 'UTF-8') {
        $tag->{subject}=DA::Charset::convert_to(\$tag->{subject},'UTF-8');
	} else {
        $tag->{subject}=$result->{preview}->{subject};
	}
	$tag->{subject}=DA::CGIdef::encode_utf8($tag->{subject},1,1);

	if ($result->{preview}->{body}->{html} eq '') {
        if ($charset ne 'UTF-8') {
            $tag->{body}=DA::Charset::convert_to(
				\$result->{preview}->{body}->{text},'UTF-8');
        } else {
            $tag->{body}=$result->{preview}->{body}->{text};
        }
        $tag->{body}=DA::CGIdef::encode_utf8($tag->{body},2,0);
	} else {
        $tag->{body}=$result->{preview}->{body}->{html};
	}
	return($tag);
}
sub insert_log {
	my ($session,$log)=@_;
    DA::Session::trans_init($session);
    eval {
		my $ix=0;
		my $table_name='is_org_mail_log_'.DA::CGIdef::get_date('Y4MM');
		my $tables = DA::DB::get_db_tables($session,$table_name);
		if (!$tables->{$table_name}) {
			DA::DB::create_table($session,'is_org_mail_log',$table_name);
		}
		# 件名は 4000 文字で切り捨て
		my $subject=DA::DBcheck::sql_quote_wrap2($log->{subject},2048,4000,1,DA::Unicode::internal_charset());
		my $num=DA::IS::get_seq($session,'org_mail_log');
		my $detail=Storable::freeze($log);
		my $sql="INSERT INTO $table_name (num,gid,mid,op,op_date,subject,user_name,detail) "
		 . "VALUES (?,?,?,?,?,?,?,?)";
        my $sth=$session->{dbh}->prepare($sql);
           $sth->bind_param(++$ix,$num,3);
           $sth->bind_param(++$ix,$log->{gid},3);
           $sth->bind_param(++$ix,$session->{user},3);
           $sth->bind_param(++$ix,$log->{op},1);
           $sth->bind_param(++$ix,DA::CGIdef::get_date('Y4/MM/DD HH:MI:SS'),1);
           $sth->bind_param(++$ix,$subject,1);
           $sth->bind_param(++$ix,$session->{name},1);
           $sth->bind_param(++$ix,$detail, { ora_type => 113 });
           $sth->execute();
	};
    if ( !DA::Session::exception($session) ) {
        DA::Error::system_error($session);
    }
}
sub search_log {
	my ($session,$sr_param,$mode)=@_;
	my ($s_yy,$s_mm,$s_dd,$s_hh,$s_mi)=split(/[\/\-\s\:]/,$sr_param->{from});
	my ($e_yy,$e_mm,$e_dd,$e_hh,$e_mi)=split(/[\/\-\s\:]/,$sr_param->{to});
	my $s_date="$s_yy/$s_mm/$s_dd";
	my $e_date="$e_yy/$e_mm/$e_dd";
	my $table_ym= DA::Scheduler::get_table_ym2($s_date,$e_date);

	my $op_s_date="$s_date $s_hh:$s_mi:00";
	my $op_e_date="$e_date $e_hh:$e_mi:00";

	my $op_where;
	foreach my $key (split(/\,/,$sr_param->{type})) {
    	$op_where.=($op_where) ? ",'$key'" : "'$key'";
	}

	my $sql;
	my $table_count=0;
    my $detail=(DA::Unicode::internal_charset() ne 'UTF-8' ||
        ($mode eq 'command' && $sr_param->{detail} eq 'yes')) ? ',detail' : '';
	my $tables = DA::DB::get_db_tables($session);
	foreach my $ym(@$table_ym){
    	my $table_name="is_org_mail_log_$ym";
    	if (!$tables->{$table_name}) { next; }
    	$sql.="UNION ALL SELECT num,gid,mid,op,op_date,subject,user_name $detail "
    	    . "FROM $table_name WHERE gid=? AND op IN ($op_where) "
    	    . "AND op_date >= '$op_s_date' AND op_date <= '$op_e_date'";
    	$table_count++;
	}
	if (!$sql) { return(); }
	$sql =~s/^UNION ALL//;
	$sql.=" ORDER BY op_date";

	my $param={};
	my $ix=1; my $iy=0;
	my ($start,$end);
	if ($mode ne 'command') {
		$param->{line}=$session->{list_row};
		$param->{page}=$sr_param->{page};
		$param->{cgi} =$sr_param->{list_url};

		$start = int($sr_param->{page}-1)*$param->{line}+1;
		$end =int($param->{line} * 10)
          - ($start % int($param->{line} * 10)) + $start;
	}

	my $sth=$session->{dbh}->prepare($sql);
	for (my $ix=1; $ix <= $table_count; $ix++) {
    	$sth->bind_param($ix, $sr_param->{gid}, 3);
	}
	$sth->execute();
	my $list;
	while (my $log=$sth->fetchrow_hashref('NAME_lc')) {
    	if ($sr_param->{user_name} ne '') {
        	if ($log->{user_name} !~ /\Q$sr_param->{user_name}\E/) { next; }
    	}
    	if ($sr_param->{subject} ne '') {
        	if ($log->{subject} !~ /\Q$sr_param->{subject}\E/) { next; }
    	}

		if ($mode ne 'command') {
    		$iy++;
    		if ($iy < $start){ next; }
    		if ($ix > $param->{line}){
        		if ($iy <= $end) { next; }
        		$iy++;last;
    		}
    		$ix++;
		}

    	if ($log->{op} ne 'login') {
       		if ($log->{subject} eq '') { $log->{subject}="no title"; }
			if (DA::Unicode::is_space($log->{subject})) { $log->{subject}='no title'; }
		}

    	my $color="#FFFFFF";
    	if ($log->{op} eq 'login') {
        	$log->{op_name}=t_('切替接続');
        	$color="#D3D3D3";
    	} elsif ($log->{op} eq 'send') {
        	$log->{op_name}=t_('直接送信');
        	$color="#AFEEEE";
    	} elsif ($log->{op} eq 'pend') {
        	$log->{op_name}=t_('承認依頼');
        	$color="#FFF8DC";
    	} elsif ($log->{op} eq 'auth') {
        	$log->{op_name}=t_('承認送信');
        	$color="#D1FFD1";
    	} elsif ($log->{op} eq 'deny') {
        	$log->{op_name}=t_('差戻し');
        	$color="#FFD1D1";
    	}

		if ($mode eq 'command') {
    		push(@{$list},$log);
		} else {
            if (DA::Unicode::internal_charset() ne 'UTF-8') {
                my $result = Storable::thaw($log->{detail});
                $log->{subject}=$result->{preview}->{subject};
            }
            $log->{subject}=DA::CGIdef::encode_utf8($log->{subject},1,1);
    		$log->{user_name}=DA::CGIdef::encode($log->{user_name},1,1,'euc');
			my $subject;
    		if ($log->{op} ne 'login') {
        		my ($yy,$mm,$dd)=split(/[\/\s\:]/,$log->{op_date},3);
        		$subject="<a href=\"javascript:detail_proc('$log->{num}',"
					."'$yy$mm');\"><span class=wordBreak>__subject__</span></a>";
    		}
    		my $tag=qq{
        		<tr bgcolor=#FFFFFF>
        		<td nowrap align=center bgcolor=$color>$log->{op_name}</td>
        		<td nowrap>$log->{op_date}</td>
        		<td nowrap>$log->{user_name}</td>
        		<td style='word-break: break-all;'>$subject</td>
        		</tr>
    		};
            if (DA::Unicode::internal_charset() ne 'UTF-8') {
                $tag=DA::Charset::convert(\$tag,DA::Unicode::internal_charset(),'UTF-8');
            }
			$tag=~s/__subject__/$log->{subject}/;
			push(@{$list},$tag);
		}
	}
	$sth->finish;
	$param->{final}= $iy;
	return($list,$param);
}
sub view_log {
	my ($session,$log,$mode,$module,$allow)=@_;
	my $charset = DA::Ajax::Mailer::mailer_charset();
	my $detail  = Storable::thaw($log->{detail});
	my $preview = $detail->{preview};

	my $result_tag=DA::OrgMail::get_preview_tag($session,$detail);

	my $tags={};
	$tags->{subject} = $result_tag->{subject};
	if (ref($preview->{from_list}) eq 'ARRAY') {
    	$tags->{from} = DA::Ajax::Mailer::_make_address_field($preview->{from_list});
    	$tags->{from} = DA::CGIdef::encode_utf8($tags->{from},1,1);
	}
	if (ref($preview->{to_list}) eq 'ARRAY') {
    	$tags->{to} = DA::Ajax::Mailer::_make_address_field($preview->{to_list});
    	$tags->{to} = DA::CGIdef::encode_utf8($tags->{to},1,1);
	}
	if (ref($preview->{cc_list}) eq 'ARRAY') {
    	$tags->{cc} = DA::Ajax::Mailer::_make_address_field($preview->{cc_list});
    	$tags->{cc} = DA::CGIdef::encode_utf8($tags->{cc},1,1);
	}
	if (ref($preview->{bcc_list}) eq 'ARRAY') {
    	$tags->{bcc} = DA::Ajax::Mailer::_make_address_field($preview->{bcc_list});
    	$tags->{bcc} = DA::CGIdef::encode_utf8($tags->{bcc},1,1);
	}
	if (ref($preview->{attach_list}) eq 'ARRAY') {
    	foreach my $a_data (@{$preview->{attach_list}}) {
        	$tags->{attach} .= "$a_data->{name},";
    	}
    	$tags->{attach} =~ s/\,+$//g;
    	$tags->{attach} = DA::CGIdef::encode_utf8($tags->{attach},3,1);
	}
	if ($preview->{body}->{html} eq "") {
    	$tags->{body} = $preview->{body}->{text};
    	$tags->{body} = DA::Ajax::Mailer::encode_mailer($tags->{body}, 2, 0);
    	$tags->{body} =~s/\t/\&nbsp\;\&nbsp\;\&nbsp\;\&nbsp\;/g;
	} else {
    	$tags->{body} = $preview->{body}->{html};
    	my $custom = DA::Ajax::Mailer::get_custom($session);
    	$tags->{body} = DA::Ajax::Mailer::_extract_htmlmail_part($session, 
			$module, $allow, $tags->{body}, $charset, "detail", $custom);
	}
	if ($detail->{comment}) {
    	$tags->{comment}=DA::CGIdef::encode($detail->{comment},2,1,'euc');
	}
	return($tags);
}
sub send_notice_mail {
    my ($session,$mid,$title,$comment,$mode)=@_;

    # 発信者にメールを送信
    my $conf = DA::IS::get_master( { user => $mid }, "base" );
    $conf->{user_lang} = ( $conf->{user_lang} ) ? $conf->{user_lang} : 'ja';
    my $timezone   = $session->{timezone};
    my $tz_view    = $session->{tz_view};
    my $time_style = $session->{time_style};
    $session->{timezone}   = $conf->{timezone};
    $session->{tz_view}    = $conf->{tz_view};
    $session->{time_style} = $conf->{time_style};
    DA::IS::set_temp_lang( $session, $conf->{user_lang} );

    my $member_table = DA::IS::get_member_table($session);
    my $sql = "SELECT email,name,alpha FROM $member_table WHERE mid=?";
    my $sth = $session->{dbh}->prepare($sql);
       $sth->bind_param(1,$session->{user},3); $sth->execute();
    my $from=$sth->fetchrow_hashref('NAME_lc');
       $sth->bind_param(1,$mid,3); $sth->execute();
    my $to  =$sth->fetchrow_hashref('NAME_lc');
    $sth->finish;

    my $mail={};
    $mail->{to}      = $to->{email};
    $mail->{from}    = $from->{email};
    $mail->{name}    = DA::IS::check_view_name($session,$from->{name},$from->{alpha});
	if ($mode eq 'auth') {
    	$mail->{subject} = t_('承認').":".$title;
    	$mail->{body}    = t_('%1の送信が承認されました。',
						   t_('組織メール%(org_mail)'))."\n\n";
	} else {
    	$mail->{subject} = t_('差戻し').":".$title;
    	$mail->{body}    = t_('%1の送信が差し戻されました。',
						   t_('組織メール%(org_mail)'))."\n\n";
	}
    $mail->{body}   .= $comment;

    $session->{timezone}   = $timezone;
    $session->{tz_view}    = $tz_view;
    $session->{time_style} = $time_style;
    DA::IS::clear_temp_lang($session);

    DA::Mailer::send_mail($mail);
}
sub monthly_proc {
	my ($session)=@_;
	my $config=DA::IS::get_sys_custom($session,'org_mail');
	if (!$config->{log_save}) { $config->{log_save}=12; }
	my $today=DA::CGIdef::get_date('Y4/MM/DD');
    my $check=DA::CGIdef::get_target_date_m($today,"-$config->{log_save}",'Y4MM');

	my @drop_tables;
    my $tables = DA::DB::get_db_tables($session);
    foreach my $table(sort keys %$tables){
		if ($table =~ /^is_org_mail_log_(\d+)$/) {
			if ($1 <= $check) { push(@drop_tables,$table); }
		}
	}
	my $month=DA::CGIdef::get_date('Y4MM');
	my $log_file="$DA::Vars::p->{log_dir}/batch/monthly.$month";
	DA::System::file_open(\*LOG,">> $log_file");
    foreach my $table (@drop_tables){
        print LOG "DROP TABLE:$table\n";
        DA::DB::drop_table($session,$table);
	}
	close(LOG);
}

# -------------------------------------------------------------------------
# オーナー権限メニューに「組織メール設定」を追加
# -------------------------------------------------------------------------
sub get_owner_menu {
    my ($session,$param)=@_;
	if (DA::Unicode::internal_charset() ne 'UTF-8') { return; }
    my $org_mail=DA::IS::get_sys_custom($session,'org_mail');
    if ($org_mail->{owner_menu} ne 'on') { return; }
    $param->{tabs}=2;
    $param->{tab_name2}="&nbsp;&nbsp;@{[t_('組織メール%(org_mail)')]}&nbsp;&nbsp;";
    $param->{tab_href2}="$DA::Vars::p->{cgi_rdir}/org_mail_config.cgi";
}
# -------------------------------------------------------------------------
# メンテナンスメニューに「組織メール管理」を追加
# -------------------------------------------------------------------------
sub get_mainte_menu {
    my ($session)=@_;
	if (DA::Unicode::internal_charset() ne 'UTF-8') { return; }
	my $module = DA::IS::get_module($session,1);
	if ($module->{mail} eq 'off') { return; }
    my $config=DA::IS::get_sys_custom($session,'org_mail');
    if (!$session->{admin}) { return; }

    my $link_c   = "/cgi-bin/org_mail_admin.cgi?proc_mode=list";
    my $link_p   = "/cgi-bin/org_mail_param.cgi";
    my $icon_c= "appbtn_orgmail_admin";
    my $icon_p= "appbtn_environment";
	my $admin_menu;
	if ($config->{admin_menu} ne 'off') {
     	$admin_menu="<a href=\"$link_c\" target='work' onMouseOut=\"org_mail('c','0');\" "
			."onMouseOver=\"org_mail('c','1');\">"
     		."<img id=org_mail_c src=$session->{img_rdir}/$icon_c\.gif width=109 height=20 border=0 "
     		."alt=\"@{[t_('組織メール管理%(org_mail)')]}\"></a><br>";
	}
    my $CUSTOM_MENU="<br>@{[t_('組織メール%(org_mail)')]} :<br>"
     . "<img src=$session->{img_rdir}/ins_btntop.gif width=109 height=1><br>"
	 . $admin_menu
     . "<a href=\"$link_p\" target='work' onMouseOut=\"org_mail('p','0');\" onMouseOver=\"org_mail('p','1');\">"
     . "<img id=org_mail_p src=$session->{img_rdir}/$icon_p\.gif width=109 height=20 border=0 "
     . "alt=\"@{[t_('環境設定')]}\"></a><br>"
     . "<img src=$session->{img_rdir}/ins_btnbottom.gif width=109 height=1><br>";

    my $CUSTOM_SCRIPT=qq{
        function org_mail(item,mode) {
            var target=document.getElementById('org_mail_'+item);
            if (item == 'c' && mode == '1') {
                target.src='$session->{img_rdir}/$icon_c\_on.gif';
            } else if (item == 'c' && mode == '0') {
                target.src='$session->{img_rdir}/$icon_c\.gif';
            } else if (item == 'p' && mode == '1') {
                target.src='$session->{img_rdir}/$icon_p\_on.gif';
            } else if (item == 'p' && mode == '0') {
                target.src='$session->{img_rdir}/$icon_p\.gif';
            }
        }
    };

    return($CUSTOM_MENU,$CUSTOM_SCRIPT);
}

sub get_cookie {
	my ($session)=@_;
    my $sec;
    foreach my $http_cookie (split(/\;/,$ENV{'HTTP_COOKIE'})) {
    	my ($key,$value) = split(/\=/,$http_cookie,2);
       	$key=~s/^\s+//; $key=~s/\s+$//;
       	$value=~s/^\s+//; $value=~s/\s+$//;
       	if ($key eq "$session->{sid}\-org_mail") {
			$sec=$value;
		}
    }
	# 選択された組織メールの権限チェック
	if ($sec && $sec ne $session->{user}) { 
		my $permit=DA::OrgMail::get_org_mail_permit($session,0);
		if (!$permit->{auth}->{$sec}) { return; }
	}

	return($sec);
}

# -------------------------------------------------------------------------
# メール上部メニューで使用する文言の定義
# -------------------------------------------------------------------------
sub rewrite_ajxmailer_messages {
    my ($session, $c, $charset, $messages)=@_;
    my $o_add =",TOPMENU4VIEWER_ORGMAIL_TITLE : '@{[t_('メール作成%(org_mail)')]}' }";
    $$messages=~s/}$/$o_add/;
    my $m_add =",TOPMENU4VIEWER_CHANGEMAIL_TITLE : '@{[t_('メール切替%(org_mail)')]}' }";
    $$messages=~s/}$/$m_add/;
    my $h_add =",TOPMENU4VIEWER_HELP_TITLE : '@{[t_('ヘルプ%(org_mail)')]}' }";
    $$messages=~s/}$/$h_add/;
}
# -------------------------------------------------------------------------
# メール作成画面の入力値読み込み
# -------------------------------------------------------------------------
sub custom_mail_read_query4ajx {
    my ($query, $input)=@_;
    if ($query->param('html') =~ /editor/) {
        push(@{$input},'org_maid');
        push(@{$input},'org_mode');
        push(@{$input},'org_gid');
    }
}
# -------------------------------------------------------------------------
# メールの設定パラメータに項目を追加
# -------------------------------------------------------------------------
sub ajx_get_config {
    my ($session, $imaps, $c, $result)=@_;
    $result->{org_maid}=$c->{org_maid};
    $result->{org_mode}=$c->{org_mode};
    $result->{org_gid} =$c->{org_gid};
}
# -------------------------------------------------------------------------
# メール上部メニューにメール作成ボタンとメール切替ボタンを追加
# -------------------------------------------------------------------------
sub ajxmailer_set_threepane_toppanel_js {
    my ($session, $imaps) = @_;
    my $js;

	my $permit=DA::OrgMail::get_org_mail_permit($session,0);
	my $config=DA::IS::get_sys_custom($session,'org_mail');
	my $mailer_config=DA::IS::get_sys_custom($session,'mail');
	my $check_key = DA::IS::get_check_key_param('&');

    my $g_sql="SELECT mail_name FROM is_org_mail_group WHERE gid=?";
    my $g_sth=$session->{dbh}->prepare($g_sql); 

	# メール作成ボタン
	if (($permit->{member} && %{$permit->{member}}) && $config->{create_button} eq 'on') {
		my $top;
		my $pulldown;

		my $make_count=1;
		foreach my $gid (sort { $permit->{member}->{$a} cmp $permit->{member}->{$b} } 
									keys %{$permit->{member}}) {
			my $name=($gid eq $session->{user}) 
						? $session->{name} : $permit->{auth}->{$gid};
			if ($name eq 1) {
				$g_sth->bind_param(1,$gid,3); $g_sth->execute();
    			$name=$g_sth->fetchrow;
			}
			if ($name eq '') {
				$name=DA::IS::get_ug_name($session,1,$gid)->{simple_name};
			}
			$name=js_esc_($name);
			if (!$top) { $top=$gid; }
			$pulldown.=qq{
				this.menuData.items.OrgMail.pulldown.order[0].push('$gid');
				this.menuData.items.OrgMail.pulldown.items['$gid']={
					text:'$name',
					onclick:function() { OrgMailProc('$gid'); },
					args:[]
				};
			};
			$make_count++;
		}
		my $make_class=($make_count > 20) ? "da_topPanel43PanePulldownMenu2" 
										  : "da_topPanel43PanePulldownMenu";
    	$js.=qq{
        	this.menuData.items.OrgMail = {
                title       : DA.locale.GetText.t_("TOPMENU4VIEWER_ORGMAIL_TITLE"),
                alt         : DA.locale.GetText.t_("TOPMENU4VIEWER_ORGMAIL_TITLE"),
                smallIcon   : DA.vars.clrRdir + "/mailhead_orgmail_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_orgmail_b.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : function() { OrgMailProc($top); },
				pulldown    : {
					className : "$make_class",
					order	  : [],
					items	  : {}
				}
        	};
			this.menuData.items.OrgMail.pulldown.order[0]=[];
			$pulldown

        	this.menuData.leftOrder.push("OrgMail");
			function OrgMailProc(gid) {
				var w = DA.mailer.windowController.editorWidth();
				var h = DA.mailer.windowController.editorHeight();
				//var Param='width=' + w + ',height=' + h + ',resizable=1';
				var Url='/cgi-bin/org_mail_new.cgi?mode=new&gid='+gid+'$check_key';
				//var pwin=window.open(Url,'',Param);
				var pwin=DA.windowController.winOpenNoBar(Url,"",w,h);
			}
    	};
	}

	# メール切替ボタン
	if (($permit->{auth} && %{$permit->{auth}}) && $config->{toggle_button} eq 'on') {
    	my $sec=DA::OrgMail::get_cookie($session);
		if (!$sec) { $sec=$session->{user}; }
		my $top={};
		my $pulldown;
		$permit->{auth}->{$session->{user}}=1;

		my $toggle_count=1;
		my $window_name;
		foreach my $gid (sort { $permit->{auth}->{$a} cmp $permit->{auth}->{$b} } 
									keys %{$permit->{auth}}) {
			my $name=($gid eq $session->{user}) 
						? $session->{name} : $permit->{auth}->{$gid};
			if ($name eq 1) {
				$g_sth->bind_param(1,$gid,3); $g_sth->execute();
    			$name=$g_sth->fetchrow;
			}
			if ($name eq '') {
				$name=DA::IS::get_ug_name($session,1,$gid)->{simple_name};
			}
			$window_name = js_esc_($name);
			if ($gid eq $session->{user}) {
				$window_name = "AjaxMailer";
			}
            my $msg =t_("メールアカウントを%1に切り替えてもよろしいですか？",$name);
			if ($mailer_config->{change_org_mail_style} eq "on") {
				$msg =t_("メールアカウント%1を新しいページで開いてよろしいですか？",$name);
			}
			# if (!$top->{gid} && $sec ne $gid) { 
			if ($gid eq $session->{user}) { 
				$top->{gid}=$gid; $top->{msg}=$msg;
			}

			my $selected=($gid eq $sec) ? 'true' : 'false';
			$pulldown.=qq{
				this.menuData.items.ChangeMail.pulldown.order[0].push('$gid');
				this.menuData.items.ChangeMail.pulldown.items['$gid']={
					text:'$name',
					// selected: $selected,
					disabled: $selected,
					onclick:function() { ChangeMailProc('$gid','$msg','AjaxMailer_$gid',false); },
					args:[]
				};
			};
			$toggle_count++;
		}
		my $toggle_class=($toggle_count > 20) ? "da_topPanel43PanePulldownMenu2" 
											  : "da_topPanel43PanePulldownMenu";

		$toggle_class="da_topPanel4uPanePulldownMenu";
    	$js.=qq{
        	this.menuData.items.ChangeMail = {
                title       : DA.locale.GetText.t_("TOPMENU4VIEWER_CHANGEMAIL_TITLE"),
                alt         : DA.locale.GetText.t_("TOPMENU4VIEWER_CHANGEMAIL_TITLE"),
                smallIcon   : DA.vars.clrRdir + "/mailhead_change_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_change_b.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : function() {
					if (DA.util.confirm('@{[t_("このページで個人メールアカウントに切替よろしいですか？")]}')){
	            		if ($top->{gid} == '@{[js_esc_($sec)]}') {
	            			alert('@{[t_("既に切り替わっています。")]}');
	            		} else {
							ChangeMailProc('$top->{gid}','$top->{msg}', 'AjaxMailer_$top->{gid}',true);
						}
					}
        		},
				pulldown    : {
					className : "$toggle_class",
					order	  : [],
					items	  : {}
				}
        	};
			this.menuData.items.ChangeMail.pulldown.order[0]=[];
			$pulldown

        	this.menuData.leftOrder.unshift("ChangeMail");
        	function ChangeMailProc(gid,msg,name,isOnePage) {
            	if (isOnePage || confirm(msg)==true) {
					var width = 0;
					var height = 0;
					if (DA.vars.system.change_org_mail_style === 0 || isOnePage) {
						width = DA.windowController.width();
						height = DA.windowController.height();
						window.close();
	                	document.cookie = '$session->{sid}\-org_mail='+gid+';';
	            		var Url = '/cgi-bin/ajax_mailer.cgi?html=index&login=1&change_user=1'
						 		+ '$check_key'+'&time=' + new Date() + '&org_mail_box=' + gid + '&org_mail_gid=' + gid;
					} else {
						var AjaxMailerWindowWidth  = DA.vars.config.window_width;
						var AjaxMailerWindowHeight = DA.vars.config.window_height;
						var AjaxMailerWindowPosX   = DA.vars.config.window_pos_x;
						var AjaxMailerWindowPosY   = DA.vars.config.window_pos_y;
						width = parseInt(AjaxMailerWindowWidth, 10);
						height = parseInt(AjaxMailerWindowHeight, 10);
						var posX   = parseInt(AjaxMailerWindowPosX, 10);
						var posY   = parseInt(AjaxMailerWindowPosY, 10);
						if (width + posX > screen.width) {
							posX = 0; posY = 0;
							if (width + posX > screen.width) {
								width = screen.width;
							}
						}
						if (height + posY > screen.height) {
							posX = 0; posY = 0;
							if (height + posY > screen.height) {
								height = screen.height;
							}
						}
	                	document.cookie = '$session->{sid}\-org_mail='+gid+';';
						var Url = '/cgi-bin/ajax_mailer.cgi?html=index&login=1&change_user=1'
						 		+ '$check_key'+'&time=' + new Date() + '&org_mail_box=' + gid + '&org_mail_gid=' + gid;
					}
					DA.windowController.winOpenNoBar(Url, name, width, height);
           		}
			}
   	};

	}
    $g_sth->finish;

	# ヘルプボタン
	if ($config->{help_url} ne '') {
		my $help_url = DA::IS::add_check_key_url($config->{help_url});
    	$js.=qq{
        	this.menuData.items.HelpMail = {
                title       : DA.locale.GetText.t_("TOPMENU4VIEWER_HELP_TITLE"),
                alt         : DA.locale.GetText.t_("TOPMENU4VIEWER_HELP_TITLE"),
                smallIcon   : DA.vars.clrRdir + "/mailhead_help_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_help_b.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : function() {
					window.open('$help_url'+'$check_key','org_mail_help',
						'width=600,height=600,resizable=1,scrollbars=1');
        		}
			}
        	this.menuData.leftOrder.push("HelpMail");
        };
	}

    return($js);
}
# -------------------------------------------------------------------------
# メールの詳細画面の上部に「差戻し」と「コメント」ボタンを追加
# -------------------------------------------------------------------------
sub ajxmailer_set_editor_toppanel_js {
    my ($session, $imaps) = @_;
	my $check_key = DA::IS::get_check_key_param('&');
    my $js=qq{
		this.menuData.items.OrgMode = '';
		this.menuData.items.OrgMaid = '';
        this.menuData.leftOrder.push("deny");
        this.menuData.items.deny = {
            title       : '@{[t_("差戻し")]}',
            alt         : '@{[t_("差戻し")]}',
            smallIcon   : DA.vars.clrRdir + "/maildetails_forward_s.gif",
            bigIcon     : DA.vars.clrRdir + "/maildetails_forward_b.gif",
            disableIcon : DA.vars.clrRdir + "/maildetails_forward_dis.gif",
            className   : 'da_panelMenu4ViewerItemLeft',
            hidden      : 1,
            disable     : 0,
            onSelect    : function() {
				var Param='width=600,height=400,resizable=1';
				window.open('/cgi-bin/org_mail_auth.cgi?mode=deny&maid='
						+window.__topPanel.menuData.items.OrgMaid+'$check_key','',Param);
						// +window.__messageEditor.selectedMaid+'$check_key','',Param);
            },
            pulldown    : null
        };

        this.menuData.leftOrder.push("comment");
        this.menuData.items.comment = {
            title       : '@{[t_("コメント")]}',
            alt         : '@{[t_("コメント")]}',
            smallIcon   : DA.vars.clrRdir + "/maildetails_comment_s.gif",
            bigIcon     : DA.vars.clrRdir + "/maildetails_comment_b.gif",
            disableIcon : DA.vars.clrRdir + "/maildetails_comment_dis.gif",
            className   : 'da_panelMenu4ViewerItemLeft',
            hidden      : 1,
            disable     : 0,
			mode		: 0,
            onSelect    : function() {
				var Param='width=600,height=400,resizable=1';
				var pwin=window.open('/cgi-bin/org_mail_auth.cgi?maid='
						+window.__topPanel.menuData.items.OrgMaid+'$check_key','',Param);
						// +window.__messageEditor.selectedMaid+'$check_key','',Param);
            },
            pulldown    : null
        };
        this.menuData.leftOrder.push("comview");
        this.menuData.items.comview = {
            title       : '@{[t_("コメント")]}',
            alt         : '@{[t_("コメント")]}',
            smallIcon   : DA.vars.clrRdir + "/maildetails_comment_s.gif",
            bigIcon     : DA.vars.clrRdir + "/maildetails_comment_b.gif",
            disableIcon : DA.vars.clrRdir + "/maildetails_comment_dis.gif",
            className   : 'da_panelMenu4ViewerItemLeft',
            hidden      : 1,
            disable     : 0,
            onSelect    : function() {
				var Param='width=600,height=400,resizable=1';
				var pwin=window.open('/cgi-bin/org_mail_auth.cgi?mode=view&maid='
						+window.__topPanel.menuData.items.OrgMaid+'$check_key','',Param);
						// +window.__messageEditor.selectedMaid+'$check_key','',Param);
            }
        };
    };
    return($js);
}
# -------------------------------------------------------------------------
# メールの詳細画面の上部に表示した「差戻し」と「コメント」ボタンの制御
# -------------------------------------------------------------------------
sub ajxmailer_set_message_editor_js {
    my ($session, $imaps) = @_;
    my $js=qq{
       	this.OrgMailPreview = this.onPreview;
       	this.OrgMailForcedInterruption = this.onForcedInterruption;
       	this.OrgMailBack    = this.onBack;
       	this.onPreview = function() {
			this.OrgMailPreview();
           	window.__topPanel.panelMenu.show('back');
			if (window.__topPanel.menuData.items.OrgMode == 'auth') {
				window.__topPanel.panelMenu.hide('deny');
				window.__topPanel.panelMenu.hide('comment');
			} else if (window.__topPanel.menuData.items.OrgMode == 'edit') {
               	window.__topPanel.panelMenu.hide('template');
               	window.__topPanel.panelMenu.hide('preview');
			}
		}
		this.onForcedInterruption = function() {
			this.OrgMailForcedInterruption();
			if (window.__topPanel.menuData.items.OrgMode == 'auth') {
				window.__topPanel.panelMenu.disable('deny');
				window.__topPanel.panelMenu.disable('comment');
			} else if (window.__topPanel.menuData.items.OrgMode == 'edit') {
				window.__topPanel.panelMenu.disable('template');
				window.__topPanel.panelMenu.disable('preview');
				window.__topPanel.panelMenu.disable('comview');
			}
		}
       	this.onBack = function() {
			this.OrgMailBack();
           	window.__topPanel.panelMenu.hide('back');
			if (window.__topPanel.menuData.items.OrgMode == 'auth') {
           		window.__topPanel.panelMenu.hide('template');
				window.__topPanel.panelMenu.show('deny');
				window.__topPanel.panelMenu.show('comment');
			} else if (window.__topPanel.menuData.items.OrgMode == 'edit') {
               	window.__topPanel.panelMenu.hide('template');
               	window.__topPanel.panelMenu.show('preview');
			}
		}
    };
	return($js);
}
# -------------------------------------------------------------------------
# メールの詳細画面の上部に表示するボタンを定義
# -------------------------------------------------------------------------
sub ajxmailer_set_onload_js {
    my ($session,$file,$data,$messages,$opt)=@_;
	my $js;

    if ($file =~ /index.html/) {
    	my $sec=DA::OrgMail::get_cookie($session);
		if (!$sec) { $sec=$session->{user}; }

		if ($sec eq $session->{user}) { return; }

		# 切替時のログを取得
		DA::OrgMail::insert_log($session,{ op => 'login', gid => $sec });

    	my $g_sql="SELECT mail_name FROM is_org_mail_group WHERE gid=?";
    	my $g_sth=$session->{dbh}->prepare($g_sql); 
		   $g_sth->bind_param(1,$sec,3); $g_sth->execute();
    	my $name=$g_sth->fetchrow; $g_sth->finish;
		if ($name eq '') { $name=DA::IS::get_ug_name($session,1,$sec)->{simple_name}; }
        if (DA::Unicode::internal_charset() ne 'UTF-8') {
            $name=DA::Charset::convert(\$name,DA::Unicode::internal_charset(),'UTF-8');
        }
		$name=DA::CGIdef::encode_utf8($name,1,1);
		$name=js_esc_($name);
		$js.=qq{
			var target=document.getElementById('top_panel_TPCL');
			var head_url   =target.style.backgroundImage;
			var orgmail_url=head_url.replace('mailhead_main','mailhead_orgmail');
			    target.style.backgroundImage=orgmail_url;
				target.innerHTML='<div style="margin-left:70px;margin-top:30px;font-size:14px;font-weight:bold;text-align:left;">$name</div>';
		};
		return($js);
	}

    if ($data->{org_mode} eq '') { return; }
    if ($file !~ /editor.html/) { return; }

	if ($data->{org_mode} eq 'new') {
    	$js=qq{
       		window.__topPanel.panelMenu.hide('save');
       		window.__topPanel.menuData.items.OrgMode ='new';
    	};
	} elsif ($data->{org_mode} eq 'edit') {
    	$js=qq{
       		// window.__topPanel.panelMenu.hide('preview');
       		window.__topPanel.panelMenu.hide('template');
       		window.__topPanel.panelMenu.hide('save');
       		window.__topPanel.panelMenu.show('comview');
       		window.__topPanel.menuData.items.OrgMode ='edit';
       		window.__topPanel.menuData.items.OrgMaid ='$data->{org_maid}';
			// window.__messageEditor.selectedMaid='$data->{org_maid}';
    	};
	} elsif ($data->{org_mode} eq 'auth') {
    	$js=qq{
       		// window.__topPanel.panelMenu.hide('preview');
       		window.__topPanel.panelMenu.hide('template');
       		window.__topPanel.panelMenu.hide('save');
       		window.__topPanel.panelMenu.show('deny');
       		window.__topPanel.panelMenu.show('comment');
       		window.__topPanel.menuData.items.OrgMode ='auth';
       		window.__topPanel.menuData.items.OrgMaid ='$data->{org_maid}';
			// window.__messageEditor.selectedMaid='$data->{org_maid}';
    	};
	}
    return($js);
}
# -------------------------------------------------------------------------
# メールの詳細画面を開いた親ウインドウのリフレッシュ
# -------------------------------------------------------------------------
sub ajxmailer_set_onbeforeunload_js {
	my ($session,$file,$data,$messages,$opt)=@_;
    if ($data->{org_mode} !~ /(edit|auth|new)/) { return; }
    if ($file !~ /editor.html/) { return; }
	my $js=qq{
        try {
			if (opener.document.title == 'org_mail_list') {
            	opener.reloadProc();
			}
        } catch(e) { }
        try {
			if (opener.document.title == 'org_mail_history') {
            	opener.reloadProc();
			}
        } catch(e) { }
	};
	return($js);
}
# -------------------------------------------------------------------------
# 組織メール作成時に一時ファイルを作成
# -------------------------------------------------------------------------
sub ajxmailer_mail {
    # 組織メール情報を保持する一時ファイルを作成
    my ($session, $imaps, $folders, $c, $opt, $result)=@_;

    my $org_temp = "$session->{temp_dir}/$session->{sid}.org_mail";
    if (-f $org_temp) {
        my $org_mail={};
    	DA::System::file_open(\*IN,"$org_temp");
		while (my $line=<IN>) {
			chomp($line);
			my ($key,$val)=split(/\=/,$line,2);
			$org_mail->{$key}=$val;
		}
        close(IN);

		# 差出人を書き換える
        if ($org_mail->{mode}) {
			my $master=DA::OrgMail::get_org_mail_data($session,$org_mail->{gid});
            undef $result->{mail}->{from};
            $master->{mail_name}=DA::Charset::convert(\$master->{mail_name},
                DA::Unicode::internal_charset(),DA::Ajax::Mailer::mailer_charset());
            $result->{mail}->{from}->{name} =$master->{mail_name};
            $result->{mail}->{from}->{email}=$master->{send_address};
		}
		# my $org_ma_temp;
		# if ($org_mail->{mode} =~ /(auth|edit)/) {
        # 	$org_ma_temp="$session->{temp_dir}/"
        # 		       . "$session->{sid}.$org_mail->{maid}.org_mail";
		# } else {
        # 	$org_ma_temp="$session->{temp_dir}/"
        #  		       . "$session->{sid}.$result->{mail}->{maid}.org_mail";
		# }
		# 組織メールパラメータファイルを AjaxMailer で採番されたファイルに移動
        my $org_ma_temp="$session->{temp_dir}/"
               . "$session->{sid}.$result->{mail}->{maid}.org_mail";
		rename($org_temp,$org_ma_temp);
    } else {
    	my $sec=DA::OrgMail::get_cookie($session);
        if ($sec && $sec ne $session->{user}) {
			my $master=DA::OrgMail::get_org_mail_data($session,$sec);
            undef $result->{mail}->{from};
            $master->{mail_name}=DA::Charset::convert(\$master->{mail_name},
                DA::Unicode::internal_charset(),DA::Ajax::Mailer::mailer_charset());
            $result->{mail}->{from}->{name} =$master->{mail_name};
            $result->{mail}->{from}->{email}=$master->{send_address};
            return;
        }
    }
}
# -------------------------------------------------------------------------
# 電子メールプレビュー時および送信時に差出人を書き換える
# -------------------------------------------------------------------------
sub create_temp_mail_detail {
    my($session,$query,$detail)=@_;
    my $fid=$session->{user};
    my $uid=$query->param('maid');

    my $org_mail={};
    my $sec=DA::OrgMail::get_cookie($session);
    my $org_ma_temp="$session->{temp_dir}/$session->{sid}.$uid.org_mail";
    if (-f $org_ma_temp) {
    	DA::System::file_open(\*IN,"$org_ma_temp");
		while (my $line=<IN>) {
			chomp($line);
			my ($key,$val)=split(/\=/,$line,2);
			$org_mail->{$key}=$val;
		}
    	close(IN);
	} elsif ($sec && $sec ne $session->{user}) {
		$org_mail->{gid}  = $sec;
	} else {
		return;
	}

    if (!$detail->{to_list}) { $detail->{to_list} = []; }
    if (!$detail->{cc_list}) { $detail->{cc_list} = []; }
    if (!$detail->{bcc_list}) { $detail->{bcc_list} = []; }
    if (!$detail->{attach_list}) { $detail->{attach_list} = []; }

    my $master=DA::OrgMail::get_org_mail_data($session, $org_mail->{gid});
    delete $detail->{from_list}->[0]->{regist};
    delete $detail->{from_list}->[0]->{link};
    delete $detail->{from_list}->[0]->{type};
    my $name=DA::CGIdef::encode($master->{mail_name},1,1,'euc');
       $name=DA::Charset::convert(\$name,
            DA::Unicode::internal_charset(),DA::Ajax::Mailer::mailer_charset());
    my $addr=DA::CGIdef::encode($master->{send_address},1,1,'euc');
    $detail->{from_list}->[0]->{name} =$name;
    $detail->{from_list}->[0]->{alt}  =$name;
    $detail->{from_list}->[0]->{email}=$addr;
}
# -------------------------------------------------------------------------
# 送信時に差出人を書き換える
# 承認が必要な場合は承認待ちのステータスで保持する
# -------------------------------------------------------------------------
sub rewrite_make_mail_result4ajx {
	# $success: メール送信成功のマックです
    my ($session, $imaps, $opt, $mail, $data, $result, $c, $success)=@_;

    if ($opt ne 'sent') { return; }

    my $org_mail={};
    my $sec=DA::OrgMail::get_cookie($session);
    my $org_ma_temp="$session->{temp_dir}/$session->{sid}.$data->{maid}.org_mail";
    if (-f $org_ma_temp) {
    	DA::System::file_open(\*IN,"$org_ma_temp");
		while (my $line=<IN>) {
			chomp($line);
			my ($key,$val)=split(/\=/,$line,2);
			$org_mail->{$key}=$val;
			$c->{gid}=$val;
		}
    	close(IN);
    } elsif ($sec && $sec ne $session->{user}) {
		$org_mail->{gid}  = $sec;
		$org_mail->{mode} = 'new';
	} else {
		return;
	}

	# 外部メールの警告 (承認送信時にのみ表示する)
    if ($result->{external} && !$c->{nopreview}) { 
		if ($org_mail->{mode} eq 'auth') { return; }
	}

    my $master=DA::OrgMail::get_org_mail_data($session, $org_mail->{gid});

    if ($org_mail->{mode} =~ /(new|edit)/) {
    	# メールもう送信成功の場合、returnします
    	if($success){return;}
		# 管理者である場合は組織メールに切り替えて直接送信
		my $permit=DA::OrgMail::get_org_mail_permit($session,0);
		if ($permit->{auth}->{$org_mail->{gid}}) {
    		my $org_temp = "$session->{temp_dir}/$session->{sid}.org_mail";
			File::Copy::copy($org_ma_temp,$org_temp);

        	my $name = $master->{mail_name};
        	if (DA::CGIdef::iskanji($name, DA::Ajax::Mailer::mailer_charset())) {
        		if ($imaps->{custom}->{base64_no_escape} ne 'on') {
        			$name = DA::Mailer::escape_mail_name($name);
        		}
            	$name=DA::Mailer::fold_mime_txt($name, 0, 
						DA::Ajax::Mailer::mailer_charset(), 
						($data->{charset} eq 'UTF-8') ? "UTF-8" : "ISO-2022-JP");
        	} else {
        		$name = DA::Mailer::escape_mail_name($name);
        	}
        	$result->{mime}->{head}->{'From'}="\"$name\" <$master->{send_address}>";
			if ($data->{reply_use}) {
        		$result->{mime}->{head}->{'Reply-To'}="\"$name\" <$master->{mail_address}>";
			}
			if($imaps->{custom}->{org_hide_sender} ne 'on'){
				$result->{mime}->{head}->{'X-ORG-REAL-FROM'}=$session->{user_id};
			}
            $result->{mime}->{head}->{'X-Insuite-User-From'}='';

			$imaps=DA::Ajax::Mailer::connect($session, 
				{ "nocheck" => 1, "noupdate" => 1, "nosessionerror" => 1 },$imaps,'org_mail');
    		DA::System::file_unlink($org_temp);

			my $log = {};
			   %$log=%$result;
			   $log->{op} ='send';
			   $log->{gid}=$org_mail->{gid};
			   $log->{subject}=$result->{preview}->{subject};
			DA::OrgMail::insert_log($session,$log);
			return; 
		}

        if (DA::Ajax::Mailer::lock($session, "storable.mail.$mail->{maid}")) {
			my $num  =DA::IS::get_seq($session,'org_mail');
			DA::OrgMail::save_queue_data($session,$result,$num);

            DA::Session::trans_init($session);
            eval {
				my $date=DA::CGIdef::get_date('Y4/MM/DD HH:MI:SS');
				my $to_list;
    			foreach my $to (@{$result->{preview}->{to_list}}) {
					my $email=($to->{name}) ? $to->{name} : $to->{email};
					$to_list.=($to_list) ? ",$email" : $email;
    			}
				# 件名は 4000 文字で切り捨て
				my $subject=DA::DBcheck::sql_quote_wrap2($result->{preview}->{subject},
								2048,4000,1,DA::Unicode::internal_charset());
                my $ix=0;
                my $iq_sql="INSERT INTO is_org_mail_queue (maid,send_mid,auth_gid," 
                 . "send_date,title,to_list) VALUES (?,?,?,?,?,?)";
                my $iq_sth=$session->{dbh}->prepare($iq_sql);
                   $iq_sth->bind_param(++$ix, $num, 3);
                   $iq_sth->bind_param(++$ix, $session->{user}, 3);
                   $iq_sth->bind_param(++$ix, $org_mail->{gid}, 3);
                   $iq_sth->bind_param(++$ix, $date, 1);
                   $iq_sth->bind_param(++$ix, $subject, 1);
                   $iq_sth->bind_param(++$ix, $to_list, 1);
                   $iq_sth->execute();

				my $iy=0;
				my $last_n=DA::CGIdef::get_last_n($session->{user},2);
				my $table_name='is_org_mail_'.$last_n;
                my $im_sql="INSERT INTO $table_name (maid,send_mid,auth_gid,status," 
                 . "send_date,title) VALUES (?,?,?,?,?,?)";
                my $im_sth=$session->{dbh}->prepare($im_sql);
                   $im_sth->bind_param(++$iy, $num, 3);
                   $im_sth->bind_param(++$iy, $session->{user}, 3);
                   $im_sth->bind_param(++$iy, $org_mail->{gid}, 3);
                   $im_sth->bind_param(++$iy, 0, 3);
                   $im_sth->bind_param(++$iy, $date, 1);
                   $im_sth->bind_param(++$iy, $subject, 1);
                   $im_sth->execute();

				my $log = {};
				   %$log=%$result;
				   $log->{op} ='pend';
				   $log->{gid}=$org_mail->{gid};
				   $log->{subject}=$result->{preview}->{subject};
				DA::OrgMail::insert_log($session,$log);
            };
            if (!DA::Session::exception($session)) {
                DA::Error::system_error($session);
            }

            DA::Ajax::Mailer::unlock($session, "storable.mail.$mail->{maid}");
        } else {
            &_warn($session, "lock");
        }

        # 送信処理をスキップさせるため
        push(@{$result->{error}},1);
    } elsif ($org_mail->{mode} eq 'auth') {
        # 承認処理
		my $s_sql="SELECT send_mid,title,auth_gid,comment_text FROM is_org_mail_queue WHERE maid=?";
        my $s_sth=$session->{dbh}->prepare($s_sql);
           $s_sth->bind_param(1, $org_mail->{maid}, 3); $s_sth->execute();
        my ($send_mid,$title,$auth_gid,$comment_text)=$s_sth->fetchrow; $s_sth->finish;

        # 承認権限のチェック
        my $join=DA::IS::get_join_group($session,$session->{user},1);
        my $permit=DA::OrgMail::get_org_mail_permit($session,0,$join);
        if (!$permit->{auth}->{$auth_gid}) {
            DA::CGIdef::errorpage($session,t_('更新する権限がありません。'),'popup');
        }
        #　送信成功の場合、DB操作を実行
        if($success){
        	DA::Session::trans_init($session);
        	eval {
        		my $last_n=DA::CGIdef::get_last_n($send_mid, 2);
        		my $table_name='is_org_mail_'.$last_n;

        		my $u_sql="UPDATE $table_name SET status=?,auth_mid=?,auth_date=? "
			 		. "WHERE maid=?";
        		my $u_sth=$session->{dbh}->prepare($u_sql);
        	   	$u_sth->bind_param(1, 1, 3);
        	   	$u_sth->bind_param(2, $session->{user}, 3);
        	   	$u_sth->bind_param(3, DA::CGIdef::get_date('Y4/MM/DD HH:MI:SS'), 1);
        	   	$u_sth->bind_param(4, $org_mail->{maid}, 3);
        	   	$u_sth->execute();

        		my $d_sql="DELETE FROM is_org_mail_queue WHERE maid=?";
        		my $d_sth=$session->{dbh}->prepare($d_sql);
        	   	$d_sth->bind_param(1, $org_mail->{maid}, 3);
        	   	$d_sth->execute();

				DA::OrgMail::save_queue_data($session,$result,$org_mail->{maid});

        		DA::OrgMail::send_notice_mail($session,$send_mid,$title,$comment_text,'auth');

				my $log = {};
				%$log=%$result;
			   	$log->{op} ='auth';
			   	$log->{gid}=$org_mail->{gid};
			   	$log->{subject}=$result->{preview}->{subject};
			   	$log->{comment}=$comment_text;
				DA::OrgMail::insert_log($session,$log);
        	};
        	if (!DA::Session::exception($session)) {
            	DA::Error::system_error($session);
        	}
        } else { #　送信前の操作
        	my $name = $master->{mail_name};
        	if (DA::CGIdef::iskanji($name, DA::Ajax::Mailer::mailer_charset())) {
        		if ($imaps->{custom}->{base64_no_escape} ne 'on') {
        			$name = DA::Mailer::escape_mail_name($name);
        		}
           		$name=DA::Mailer::fold_mime_txt($name, 0, 
					DA::Ajax::Mailer::mailer_charset(), 
					($data->{charset} eq 'UTF-8') ? "UTF-8" : "ISO-2022-JP");
        	} else {
        		$name = DA::Mailer::escape_mail_name($name);
        	}
        	$result->{mime}->{head}->{'From'}="\"$name\" <$master->{send_address}>";
			if ($data->{reply_use}) {
        		$result->{mime}->{head}->{'Reply-To'}="\"$name\" <$master->{mail_address}>";
			}

			my $u_sql="SELECT user_id FROM is_member WHERE mid=?";
        	my $u_sth=$session->{dbh}->prepare($u_sql);
           	$u_sth->bind_param(1, int($send_mid), 3); $u_sth->execute();
        	my $send_user=$u_sth->fetchrow; $u_sth->finish;
        	if($imaps->{custom}->{org_hide_sender} ne 'on'){
				$result->{mime}->{head}->{'X-ORG-REAL-FROM'}=$send_user;
        	}

			# 組織メールに切り替えて送信
			$imaps=DA::Ajax::Mailer::connect($session, 
				{ "org_mail" => $org_mail->{gid}, "nocheck" => 1, "noupdate" => 1, "nosessionerror" => 1 },$imaps,'org_mail');
        }
        return;
    }
}
# -------------------------------------------------------------------------
# メール送信時のヘッダ設定
# -------------------------------------------------------------------------
sub put_custom_mail_header {
    my ($param, $parts, $mode, $CRLF, $header)=@_;
    if ($param->{head}->{'X-ORG-REAL-FROM'}) {
        $$header.="X-ORG-REAL-FROM: $param->{head}->{'X-ORG-REAL-FROM'}" . $CRLF;
    }
    return;
}
# -------------------------------------------------------------------------
# メールの切替処理 (IMAPサーバへの再接続)
# -------------------------------------------------------------------------
sub rewrite_imap_connection_imaps {
    my ($session, $c, $imaps, $mode)=@_;
	# 環境設定では常にログインユーザの設定を変更するため書き換えない
    if ($ENV{SCRIPT_NAME} =~ /\Qma_ajx_config\E/) { return; }
    if ($ENV{SCRIPT_NAME} =~ /\Qorg_mail_config\E/) { return; }
    if ($ENV{SCRIPT_NAME} =~ /\Qorg_mail_admin\E/) { return; }

	# $c->{org_mail} に組織メールGIDを指定
    my $config=DA::IS::get_sys_custom($session,'org_mail');
    my $org_temp = "$session->{temp_dir}/$session->{sid}.org_mail";
	if (-f $org_temp) {
    	my $org_mail={};
    	DA::System::file_open(\*IN,"$org_temp");
		while (my $line=<IN>) {
			chomp($line);
			my ($key,$val)=split(/\=/,$line,2);
			$org_mail->{$key}=$val;
		}
    	close(IN);

		my $orgmail = DA::OrgMail::get_org_mail_data($session,$org_mail->{gid});
		# 組織メール作成画面の色調を変更
       	$imaps->{mail}->{main_color} = $orgmail->{mail_color};
		if ($mode eq 'org_mail') {
			# DA::OrgMail::rewrite_make_mail_result4ajx からの connect 
			# 承認処理の際に組織メールに切り替えて送信する (Sent に保存するため)
       		$imaps->{imap}->{user} = $orgmail->{mail_user};
       		$imaps->{imap}->{pass} = $orgmail->{mail_pass};
       		 
       		my @list = qw ( 
       			name host port nodetect limit
		        inbox_view sent_view draft_view trash_view spam_view
		        imap_type imap_account secure smtp_account
		        pop pop_host pop_keep pop_port pop_apop
		    );
		    my $master = DA::IS::get_master({ user => $org_mail->{gid} }, 'imap');
       		foreach my $key (@list) {
       			$imaps->{imap}->{$key} = $master->{$key};
       		}
			
			# SMTP Auth
			#my $master = DA::IS::get_master({ user => $org_mail->{gid} }, 'imap');
			$imaps->{imap}->{smtp_account} = $master->{smtp_account};
			if ($imaps->{imap}->{smtp_account} eq "account") {
				$imaps->{imap}->{smtp_user} = $orgmail->{smtp_user};
				$imaps->{imap}->{smtp_pass} = $orgmail->{smtp_pass};
			} else {
				$imaps->{imap}->{smtp_user} = "";
				$imaps->{imap}->{smtp_pass} = "";
			}
			$imaps->{imap}->{mail_address} = $orgmail->{mail_address} if ($config->{unknow_mail} eq 'on');
		}
		$c->{noupdate}=1;
	} else {
		my $sec=($c->{org_mail}) ? $c->{org_mail} : DA::OrgMail::get_cookie($session);
    	if ($sec && $sec ne $session->{user}) {
    		my @base_list = qw (
        		name host port nodetect limit
        		inbox_view sent_view draft_view trash_view spam_view
        		imap_type imap_account secure smtp_account
    		);
    		my @pop_list = qw (
        		pop pop_host pop_keep pop_port pop_apop
    		);
			my $master = DA::IS::get_master({ user => $sec }, 'imap');
			foreach my $key (@base_list) { $imaps->{imap}->{$key} = $master->{$key}; }
			foreach my $key (@pop_list)  { $imaps->{imap}->{$key} = $master->{$key}; }

			my $orgmail = DA::OrgMail::get_org_mail_data($session,$sec);
        	$imaps->{imap}->{user} = $orgmail->{mail_user};
        	$imaps->{imap}->{pass} = $orgmail->{mail_pass};
        	$imaps->{mail}->{main_color} = $orgmail->{mail_color};

			# SMTP Auth
			if ($imaps->{imap}->{smtp_account} eq "account") {
				$imaps->{imap}->{smtp_user} = $orgmail->{smtp_user};
				$imaps->{imap}->{smtp_pass} = $orgmail->{smtp_pass};
			} else {
				$imaps->{imap}->{smtp_user} = "";
				$imaps->{imap}->{smtp_pass} = "";
			}
			$imaps->{imap}->{mail_address} = $orgmail->{mail_address} if ($config->{unknow_mail} eq 'on');
			# 組織メール用のフォルダ内容が更新される間隔
			$imaps->{custom}->{folder_update_interval} = ($config->{folder_update_interval} eq '0')?
														'0':$config->{folder_update_interval} || '60';

			# imap_type, quota, charset, separator が変更された場合は
			# DA::Ajax::Mailer::connect で imap.dat の書き換えられるため
			# $c->{noupdate} に 1 を設定する

			$c->{noupdate}=1;
    	}
	}
}
# -------------------------------------------------------------------------
# 組織メールのアカウントを使用する場合は、メールデータ保存ディレクトリを書き換える
# -------------------------------------------------------------------------
sub rewrite_mailer_dir {
    my ($session,$mid,$subdir,$file,$dir)=@_;
    my $sec=DA::OrgMail::get_cookie($session);
    if (!$sec || $sec eq $session->{user}) { return; }

    if ($subdir) {
        if ($file) {
            $$dir="$DA::Vars::p->{mailer_dir}/$sec/$subdir/$file";
        } else {
            $$dir="$DA::Vars::p->{mailer_dir}/$sec/$subdir";
        }
		if (! -d "$DA::Vars::p->{mailer_dir}/$sec/$subdir") {
        	File::Path::mkpath("$DA::Vars::p->{mailer_dir}/$sec/$subdir",0,0755);
		}
    } else {
        if ($file) {
            $$dir="$DA::Vars::p->{mailer_dir}/$sec/$file";
        } else {
            $$dir="$DA::Vars::p->{mailer_dir}/$sec";
        }
		if (! -d "$DA::Vars::p->{mailer_dir}/$sec") {
        	File::Path::mkpath("$DA::Vars::p->{mailer_dir}/$sec",0,0755);
		}
    }
}

# -------------------------------------------------------------------------
# 組織メールのアカウントを使用する場合は、メールサーバ設定を設定不可にする
# -------------------------------------------------------------------------
# sub rewrite_mail_config_tab_param {
# 	my ($session,$param,$custom)=@_;
#     my $sec=DA::OrgMail::get_cookie($session);
#     if (!$sec || $sec eq $session->{user}) { return; }
# 
# 	$custom->{menu_sv}='off';
# }
# -------------------------------------------------------------------------
# 組織メールのアカウントを使用する場合は、一時保存ファイルを書き換える
# -------------------------------------------------------------------------
sub rewrite_storablefile {
	my ($session,$func,$file)=@_;
	if ($func eq "uidvalidity") { return; }
	#if ($$file !~ /$session->{temp_dir}/) { return; }
    my $sec=DA::OrgMail::get_cookie($session);
    if (!$sec || $sec eq $session->{user}) { return; }

	$$file = "$session->{temp_dir}/$session->{sid}.$sec.AjaxMailer.storable.$func";
}

sub rewrite_incfile {
       my ($session,$func,$file)=@_;
       if ($func ne "fid") { return; }
       my $sec=DA::OrgMail::get_cookie($session);
       if (!$sec || $sec eq $session->{user}) { return; }

       $$file = "$DA::Vars::p->{mailer_dir}/$session->{user}/recv/$sec.AjaxMailer.num.$func";
}

sub lockfile {
	my ($session,$file,$lock)=@_;
    #my $sec=DA::OrgMail::get_cookie($session);
    my $sec;
    foreach my $http_cookie (split(/\;/,$ENV{'HTTP_COOKIE'})) {
        my ($key,$value) = split(/\=/,$http_cookie,2);
        $key=~s/^\s+//; $key=~s/\s+$//;
        $value=~s/^\s+//; $value=~s/\s+$//;
        if ($key eq "$session->{sid}\-org_mail") { $sec=$value; }
    }
    if (!$sec || $sec eq $session->{user}) { return; }

    my $no = sprintf("%02d", int($sec%100));
    $$lock = "$DA::Vars::p->{lock100_dir}/$no/$session->{user}.$sec.AjaxMailer.$file";
}
sub get_master {
    my ($session, $func, $mode, $opt) = @_;
	# 環境設定では常にログインユーザの設定を変更するため書き換えない
    if ($ENV{SCRIPT_NAME} =~ /\Qma_ajx_config\E/) { return; }
    if ($ENV{SCRIPT_NAME} =~ /\Qorg_mail_config\E/) { return; }

	if ($func ne 'imap') { return; }
    my $sec=DA::OrgMail::get_cookie($session);
    if (!$sec || $sec eq $session->{user}) { return; }
     
    my $org_cache_func= "${func}_org";
    if (DA::Ajax::Mailer::exists_master_cache($session, $org_cache_func) && !$mode) {
        my $param = {};
        %{$param} = %{$session->{ajxmailer}->{$org_cache_func}};
        return($param);
    }
    if (DA::Ajax::Mailer::lock($session, "master.$func")) {
		my $param={};

        my @base_list = qw (
            name host port nodetect limit
            sent draft trash
            inbox_view sent_view draft_view trash_view spam_view
            imap_type imap_account secure smtp_account separator
        );
        my @pop_list = qw (
            pop pop_host pop_keep pop_port pop_apop
        );
        my $master = DA::IS::get_master({ user => $sec }, 'imap');
        foreach my $key (@base_list) { $param->{$key} = $master->{$key}; }
        foreach my $key (@pop_list)  { $param->{$key} = $master->{$key}; }

        my $orgmail = DA::OrgMail::get_org_mail_data($session,$sec);
        $param->{user} = $orgmail->{mail_user};
        $param->{pass} = $orgmail->{mail_pass};

		# SMTP Auth
		if ($param->{smtp_account} eq "account") {
			$param->{smtp_user} = $orgmail->{smtp_user};
			$param->{smtp_pass} = $orgmail->{smtp_pass};
		} else {
			$param->{smtp_user} = "";
			$param->{smtp_pass} = "";
		}

        if (DA::Ajax::Mailer::target_master_cache($session, $org_cache_func) && !$mode) {
            %{$session->{ajxmailer}->{$org_cache_func}} = %{$param};
            DA::Session::update($session);
        }
        DA::Ajax::Mailer::unlock($session, "master.$func");
        return($param);
    } else {
        DA::Ajax::Mailer::_warn($session, "lock");
        return(undef);
    }
}
sub get_master_enabled {
    my ($session, $func, $mode, $opt) = @_;
	# 環境設定では常にログインユーザの設定を変更するため書き換えない
    if ($ENV{SCRIPT_NAME} =~ /\Qma_ajx_config\E/) { return; }
    if ($ENV{SCRIPT_NAME} =~ /\Qorg_mail_config\E/) { return; }

	if ($func ne 'imap') { return; }
    my $sec=DA::OrgMail::get_cookie($session);
    if (!$sec || $sec eq $session->{user}) { return; }

    my $org_cache_func= "${func}_org";
    if (DA::Ajax::Mailer::exists_master_cache($session, "$org_cache_func\_enabled") && !$mode) {
        my $param = {};
        %{$param} = %{$session->{ajxmailer}->{"$org_cache_func\_enabled"}};
        return($param);
    }
    if (DA::Ajax::Mailer::lock($session, "master.enabled.$func")) {
        my $param = DA::IS::get_master({ user => $sec }, "$func\_enabled", $mode, $opt);
        if (DA::Ajax::Mailer::target_master_cache($session, "$org_cache_func\_enabled") && !$mode) {
            %{$session->{ajxmailer}->{"$org_cache_func\_enabled"}} = %{$param};
            DA::Session::update($session);
        }
        DA::Ajax::Mailer::unlock($session, "master.enabled.$func");
        return($param);
    } else {
        DA::Ajax::Mailer::_warn($session, "lock");
        return(undef);
    }
}
sub save_master {
    my ($session, $param, $func, $mode) = @_;
	# 環境設定では常にログインユーザの設定を変更するため書き換えない
    if ($ENV{SCRIPT_NAME} =~ /\Qma_ajx_config\E/) { return; }
    if ($ENV{SCRIPT_NAME} =~ /\Qorg_mail_config\E/) { return; }

	if ($func ne 'imap') { return; }
    my $sec=DA::OrgMail::get_cookie($session);
    if (!$sec || $sec eq $session->{user}) { return; }

    if (DA::Ajax::Mailer::lock($session, "master.$func")) {
        delete $param->{user};
        delete $param->{pass};
        delete $param->{mail_color};
        DA::IS::save_master({ user => $sec }, DA::Ajax::Mailer::convert_internal($param), $func, $mode);
        DA::Ajax::Mailer::unlock($session, "master.$func");
        return(1);
    } else {
        DA::Ajax::Mailer::_warn($session, "lock");
        return(undef);
    }
}
sub save_master_enabled {
    my ($session, $param, $func, $mode) = @_;
	# 環境設定では常にログインユーザの設定を変更するため書き換えない
    if ($ENV{SCRIPT_NAME} =~ /\Qma_ajx_config\E/) { return; }
    if ($ENV{SCRIPT_NAME} =~ /\Qorg_mail_config\E/) { return; }

	if ($func ne 'imap') { return; }
    my $sec=DA::OrgMail::get_cookie($session);
    if (!$sec || $sec eq $session->{user}) { return; }

    my $file="$func\_enabled";
    if (DA::Ajax::Mailer::lock($session, "master.enabled.$func")) {
        DA::IS::save_master({ user => $sec }, DA::Ajax::Mailer::convert_internal($param), $file, $mode);
        DA::Ajax::Mailer::unlock($session, "master.enabled.$func");
        return(1);
    } else {
        DA::Ajax::Mailer::_warn($session, "lock");
        return(undef);
    }
}
sub switch_master {
    my ($session, $func) = @_;
	# 環境設定では常にログインユーザの設定を変更するため書き換えない
    if ($ENV{SCRIPT_NAME} =~ /\Qma_ajx_config\E/) { return; }
    if ($ENV{SCRIPT_NAME} =~ /\Qorg_mail_config\E/) { return; }

	if ($func ne 'imap') { return; }
    my $sec=DA::OrgMail::get_cookie($session);
    if (!$sec || $sec eq $session->{user}) { return; }

    my $result = 1;
    if (DA::Ajax::Mailer::lock($session, "master.enabled.$func")) {
        if (DA::Ajax::Mailer::lock($session, "master.$func")) {
            my $src = "$DA::Vars::p->{data_dir}/master/$sec/.$func\.dat";
               $src = DA::Unicode::get_filename($src);
            my $dst = "$DA::Vars::p->{data_dir}/master/$sec/.$func\_enabled\.dat";
               $dst = DA::Unicode::get_filename($dst);
            DA::System::file_unlink($dst);
            if ((stat($src))[9] ne (stat($dst))[9]) {
                if (DA::System::file_copy($src, $dst)) {
                    # セッション情報の更新
		    my $org_cache_func= "${func}_org";
                    if (DA::Ajax::Mailer::exists_master_cache($session, "$org_cache_func\_enabled")) {
                        delete $session->{ajxmailer}->{"$org_cache_func\_enabled"};
                        DA::Session::update($session);
                    }
                } else {
                    DA::Ajax::Mailer::_warn($session, "Can't copy file [$src]");
                    $result = undef;
                }
            }

            DA::Ajax::Mailer::unlock($session, "master.$func");
        } else {
            DA::Ajax::Mailer::_warn($session, "lock");
            $result = undef;
        }

        DA::Ajax::Mailer::unlock($session, "master.enabled.$func");
    } else {
        DA::Ajax::Mailer::_warn($session, "lock");
        $result = undef;
    }
    return($result);
}

# 新着チェック
sub new_mail_login_top {
    my ($session,$port,$mail_conf,$imap)=@_;
	my $tag=DA::OrgMail::get_new_mail_tag($session,$mail_conf,$imap);
    return ($tag);
}
sub new_mail_top_menu {
    my ($session,$port,$menu,$mail_conf,$imap)=@_;
	my $tag=DA::OrgMail::get_new_mail_tag($session,$mail_conf,$imap);
    return ($tag);
}
sub new_mail_shortcut_menu {
    my ($session,$mail_conf,$imap,$menu)=@_;
	my $tag=DA::OrgMail::get_new_mail_tag($session,$mail_conf,$imap);
    return ($tag);
}
sub new_mail_script4ajx {
	my ($session,$script)=@_;
    my $sec=DA::OrgMail::get_cookie($session);
    if (!$sec || $sec eq $session->{user}) { return; }
	$$script="top.document.cookie='$session->{sid}-org_mail_icon=clear;';";
}
sub get_new_mail_tag {
    my ($session,$mail_conf,$imap)=@_;
	if ($session->{type} ne 1) { return; }
	if (!DA::Ajax::mailer_ok($session)) { return; }
    if ($imap->{user} eq '') { $mail_conf->{mail_check}='off'; }
    if ($mail_conf->{mail_check} ne 'on' || !DA::IS::is_iframe()) { return; }

    my $permit=DA::Mail::get_new_mail_check_permit($session);
    if (!$permit) { return; }

    my $join=DA::IS::get_join_group($session,$session->{user},1);
    my $org_permit=DA::OrgMail::get_org_mail_permit($session,0,$join);
    if (!scalar(keys %{$org_permit->{auth}})) { return; }

	my $config = DA::IS::get_sys_custom($session,"new_mail_check");
	my $master = DA::IS::get_master($session, 'new_mail_check', 2);
	if ($master->{popup}) 	 { $config->{popup}=$master->{popup}; 		}
	if ($master->{interval}) { $config->{interval}=$master->{interval}; }
    my $mail = DA::IS::get_master($session, "ajxmailer");
    my $x = $mail->{window_pos_x}  || 0;
    my $y = $mail->{window_pos_y}  || 0;
    my $w = $mail->{window_width}  || 1024;
    my $h = $mail->{window_height} || 620;

	my $check_key = DA::IS::get_check_key_param('&');

	my $org_mail_icon;
    foreach my $http_cookie (split(/\;/,$ENV{'HTTP_COOKIE'})) {
        my ($key,$value) = split(/\=/,$http_cookie,2);
        $key=~s/^\s+//; $key=~s/\s+$//;
        $value=~s/^\s+//; $value=~s/\s+$//;
        if ($key eq "$session->{sid}\-org_mail_icon") { $org_mail_icon=$value; }
    }
	my ($visibility,$function);
	if ($org_mail_icon =~ /^\d+$/) {
		$visibility='visible';
		$function  ="onclick=\"OrgMail.AjaxMailer('$org_mail_icon');\"";
	} else {
		$visibility='hidden';
	}
    my $icon="<img hspace=2 id=org_mail_icon src=$session->{img_rdir}/ctm03_ico_neworgmail.png "
            ."border=0 width=16 height=16 style='cursor:pointer;visibility:$visibility;' $function>";
	if ($session->{menu_style} eq 'old') {
		$icon="<td rowspan=2>$icon</td>";
	} elsif ($session->{menu_style} !~ /(preset|shortcut)/) {
		$icon="<td>$icon</td>";
	}

	my $prefix = DA::IS::get_uri_prefix();

	my $interval   = $config->{interval} * 60;
	my $js_interval= 3 * 1000;
    my $tag=qq{
        $icon
		<script type="text/javascript" src="/js/iseria/mailer/org_mail.js?$prefix"></script>
        <SCRIPT LANGUAGE="JavaScript">
			OrgMail.sid		 ='$session->{sid}';
			OrgMail.user	 ='$session->{user}';
			OrgMail.check_key='$check_key';
			OrgMail.popup    ='$config->{popup}';
			OrgMail.message  ='@{[t_('組織メールの新着があります')]}';
			OrgMail.width    ='$w';
			OrgMail.height   ='$h';
			OrgMail.xPos     ='$x';
			OrgMail.yPos     ='$y';
			function currentTime() {
				var time=OrgMail.getUTC();
    			var icon=OrgMail.getCookie('org_mail_icon');
    			var prev=OrgMail.getCookie('org_mail_check');
				if (icon == 'clear') {
            		OrgMail.setCookie('org_mail_check', time);
					OrgMail.checkProc();
				} else {
    				if (prev == '') {
        				OrgMail.setCookie('org_mail_check',time);
    				} else{
						if (document.getElementById('org_mail_icon').style.visibility =='hidden') {
        					if (time - prev >= $interval * 1000) {
            					OrgMail.setCookie('org_mail_check', time);
								OrgMail.checkProc();
							}
						}
					}
				}
				clearTimeout();
				setTimeout('currentTime()', $js_interval);
			}
			currentTime();
			// setTimeout('currentTime()', $js_interval);
        </SCRIPT>
    };
    return($tag);
}

sub check_org_mail_permit {
	my ($session) = @_;
	return (1) unless($session->{user}); # バッチ処理のため
	return (0) if (DA::Unicode::internal_charset() ne 'UTF-8'); # EUC-JP環境は組織メールの使うが不可、EUC-JPを対応するの場合、この行を削除するが必要
	return (0) if ($session->{mailer_style} eq 'classic'); # クラシックメーラの場合は組織メール機能がありません

	my $permit = $session->{org_mail_permit};
	unless ($permit) {
		$permit = DA::OrgMail::get_org_mail_permit($session,1);
		$session->{org_mail_permit} = $permit;
		DA::Session::update($session);
	}
	if ($permit->{member} || $permit->{auth}) {
		return (1);
	} else {
		return (0);
	}
}

sub get_mid4folder {
	my ($session, $c) = @_;
	my $mid = $c->{gid} || DA::OrgMail::get_cookie($session) || $c->{mid} || $session->{user};
	return $mid; 
}

# ▼ 個人の一時ファイルは組織の一時ファイルと同期
#--------------------------------------------------------------------------
sub copy_folders_update_info{
	my ($session) = @_;
	my $sec=DA::OrgMail::get_cookie($session);
	#　組織メールを使用の場合
    if ($sec && $sec ne $session->{user}) {
    	my $orgfile = &folders_update_info_file($session, 'folders.update.info', $sec, 1); # 組織一時ファイルのパス
    	my $managerfile = &folders_update_info_file($session, 'folders.update.info', $sec); # 個人一時ファイルのパス
    	my $text;
		if (-f $orgfile) { # 組織一時ファイルがあるの場合、ファイルの内容を読む込み
			if (DA::System::file_open(\*LOCK, "< $orgfile")) {
				$text = <LOCK>; chomp($text);
				close(LOCK);
			} else {
				DA::Ajax::Mailer::_warn($session, "Can't open file [$orgfile]");
			}
		} else { # 組織一時ファイルがないの場合、ファイルを新規
			$text = &creat_org_folders_update_info($session,$orgfile);
		}
		# 個人一時ファイルを更新
		if (DA::System::file_open(\*LOCK, "> $managerfile")) {
			print LOCK $text;
			close(LOCK);
		}else {
			DA::Ajax::Mailer::_warn($session, "Can't open file [$managerfile]");
		}
    }
}

# ▼ 組織一時ファイルを新規
#--------------------------------------------------------------------------
sub creat_org_folders_update_info{
	my ($session,$orgfile)=@_;
	my $text;
	if (DA::System::file_open(\*LOCK, "> $orgfile")) {
		$text=DA::System::nfs_time();
		$text.="--$session->{user}";
		print LOCK $text;
		close(LOCK);
	} else {
		DA::Ajax::Mailer::_warn($session, "Can't open file [$orgfile]");
	}
	return $text;
}

# ▼ 個人一時ファイルの内容と組織の一時ファイルの内容は同じですかのチェック
#--------------------------------------------------------------------------
sub check_folders_update_info{
	my ($session) = @_;
	my $sec=DA::OrgMail::get_cookie($session);
	#　組織メールを使用の場合
	if ($sec && $sec ne $session->{user}) {
    	my $orgfile = &folders_update_info_file($session, 'folders.update.info', $sec, 1); # 組織一時ファイルのパス
    	my $managerfile = &folders_update_info_file($session, 'folders.update.info', $sec); # 個人一時ファイルのパス
    	my ($text_org,$text_manager);
    	if (-f $orgfile) { # 組織一時ファイルの内容を読む込み
			if (DA::System::file_open(\*LOCK, "< $orgfile")) {
				$text_org = <LOCK>; chomp($text_org);
				close(LOCK);
			} else {
				DA::Ajax::Mailer::_warn($session, "Can't open file [$orgfile]");
			}
		}else{
			$text_org = &creat_org_folders_update_info($session,$orgfile);
		}
		if (-f $managerfile) { # 個人一時ファイルの内容を読む込み
			if (DA::System::file_open(\*LOCK, "< $managerfile")) {
				$text_manager = <LOCK>; chomp($text_manager);
				close(LOCK);
			} else {
				DA::Ajax::Mailer::_warn($session, "Can't open file [$managerfile]");
			}
		}
		if($text_org ne $text_manager){ # 内容を違いの場合、ロックを削除して、0を戻す
			return 0;
		}
	}
	return 1;
}

# ▼ 一時ファイルのパスを取得
#--------------------------------------------------------------------------
sub folders_update_info_file{
	my ($session, $func, $sec, $isorg) = @_;
	my $file;
	if($isorg){
		$file = DA::Mailer::get_mailer_dir($session,$sec,undef,"$sec.AjaxMailer.$func");
	}else {
		$file = "$DA::Vars::p->{mailer_dir}/$session->{user}/$sec.AjaxMailer.$func";
	}
	return $file;
}

# ▼ 組織一時ファイルと個人一時ファイルを更新
#--------------------------------------------------------------------------
sub change_folders_update_info{
	my ($session) = @_;
	my $sec=DA::OrgMail::get_cookie($session);
	#　組織メールを使用の場合
	if ($sec && $sec ne $session->{user}) {
		my $orgfile = &folders_update_info_file($session, 'folders.update.info', $sec, 1); # 組織一時ファイルのパス
		my $managerfile = &folders_update_info_file($session, 'folders.update.info', $sec); # 個人一時ファイルのパス
		my $text=DA::System::nfs_time();
		$text.="--$session->{user}";
		# 組織一時ファイルを更新
		if (DA::System::file_open(\*LOCK, "> $orgfile")) {
			print LOCK $text;
			close(LOCK);
		} else {
			DA::Ajax::Mailer::_warn($session, "Can't open file [$orgfile]");
		}
		# 個人一時ファイルを更新
		if (DA::System::file_open(\*LOCK, "> $managerfile")) {
			print LOCK $text;
			close(LOCK);
		}else {
			DA::Ajax::Mailer::_warn($session, "Can't open file [$managerfile]");
		}
	}
}

# ▼ 一時ファイルをロック
#--------------------------------------------------------------------------
sub folder_lock{
	my ($session) = @_;
	my $sec=DA::OrgMail::get_cookie($session);
	#　組織メールを使用の場合
	if ($sec && $sec ne $session->{user}) {
		if(DA::Ajax::Mailer::lock($session, "lock.folders", 3, undef, 0.5)){
			return 1;
		}else{
			return 0;
		}	
	}
	return 1;
}

# ▼ 一時ファイルロックを削除
#--------------------------------------------------------------------------
sub folder_unlock{
	my ($session) = @_;
	my $sec=DA::OrgMail::get_cookie($session);
	#　組織メールを使用の場合
	if ($sec && $sec ne $session->{user}) {
		DA::Ajax::Mailer::unlock($session, "lock.folders");
	}
}

sub get_gid {
	my ($session) = @_;
	my $sec=DA::OrgMail::get_cookie($session);
	if (!$sec || $sec eq $session->{user}) {
		return $session->{user};
	}
	return $sec;
}

# ▼ 組織メールを利用しているかチェック
#--------------------------------------------------------------------------
sub use_org_mail {
	my ($session) = @_;
	return 1 if (&get_gid($session) ne $session->{user});
	return 0;
}

# ▼ 組織メールの名前、アドレスを取得
#--------------------------------------------------------------------------
sub change_sender {
	my ($session, $imaps, $email, $name, $reply) = @_;
	my $sec=DA::OrgMail::get_cookie($session);
	if ($sec && $session->{user} ne $sec) {
		my $orgmail = DA::OrgMail::get_org_mail_data($session,$sec);
		$email = $orgmail->{send_address};
		$name = $orgmail->{mail_name};
		$reply = $orgmail->{send_address};
	}
	return ($email, $name, $reply);
}

# 個人ユーザ組織メールバックアップ場合に関連の操作
#　ファイルの作成、差出人の取り替える
#--------------------------------------------------------------------------　 
sub backup_org_operation($$$$$$$) {
	my($session, $imaps, $c, $maid, $data, $result, $errors) = @_;

	if($c->{proc} eq 'backup') {
		my $back_dir = DA::Ajax::Mailer::infobase($session,'backup');
        	my $back_org_dir = "$back_dir/org_info";
        	unless (-d $back_dir) {
                	DA::System::mkdir($back_dir, 0750, $DA::Vars::p->{www_user}, $DA::Vars::p->{www_group});
       		}	
        	unless (-d $back_org_dir) {
                	DA::System::mkdir($back_org_dir, 0750, $DA::Vars::p->{www_user}, $DA::Vars::p->{www_group});
        	}
		my $back_group_file =  "$back_org_dir/$c->{backup_maid}.org_mail";
		my $org_ma_temp="$session->{temp_dir}/"
               ."$session->{sid}.$maid.org_mail";
            my $org_ma_temp_backup = "$session->{temp_dir}/"
               ."$session->{sid}.$c->{backup_maid}.org_mail";
			if (-e $back_group_file) {
				unless (-e $org_ma_temp_backup ) {
					DA::System::file_copy($back_group_file, $org_ma_temp_backup);	
				}
			}else {
				 if (-e $org_ma_temp ) { 
				 	#review_change2 duoyu pan duan xiaochu 
			 		DA::System::file_copy($org_ma_temp, $back_group_file);
            	 }
			}

			#back up sosiki mail の処理	
		    my $org_mail={};
		    if (-f $back_group_file) {
		    	DA::System::file_open(\*IN,"$back_group_file");
				while (my $line=<IN>) {
					chomp($line);
					my ($key,$val)=split(/\=/,$line,2);
					$org_mail->{$key}=$val;
					$c->{gid}=$val;
				}
		    	close(IN);
		    } 

		    my $master=DA::OrgMail::get_org_mail_data($session, $org_mail->{gid});

		    if ($org_mail->{mode} =~ /(new|edit)/) {
		    
		        	my $name = $master->{mail_name};
		        	if (DA::CGIdef::iskanji($name, DA::Ajax::Mailer::mailer_charset())) {
		        		if ($imaps->{custom}->{base64_no_escape} ne 'on') {
        					$name = DA::Mailer::escape_mail_name($name);
        				}
		            	$name=DA::Mailer::fold_mime_txt($name, 0, 
								DA::Ajax::Mailer::mailer_charset(), 
								($data->{charset} eq 'UTF-8') ? "UTF-8" : "ISO-2022-JP");
		        	} else {
		        		$name = DA::Mailer::escape_mail_name($name);
		        	}
		        	$result->{mime}->{head}->{'From'}="\"$name\" <$master->{send_address}>";
					if($imaps->{custom}->{org_hide_sender} ne 'on'){
						$result->{mime}->{head}->{'X-ORG-REAL-FROM'}=$session->{user_id};
					}
		            $result->{mime}->{head}->{'X-Insuite-User-From'}='';
		        }

		}
}

#get sosiki mail backuped page color 
sub get_backup_org_clrRdir {
	my ($session,$backup_maid) = @_;
	my $backup_org_clrRdir;
	my $mid    = $session->{user};
	my $base   = DA::Ajax::Mailer::infobase($session,'backup');	
	my $back_org = "$base/org_info/$backup_maid\.org_mail";
	if( -f $back_org) {
        my $org_mail={};
    	DA::System::file_open(\*IN,"$back_org");
		while (my $line=<IN>) {
			chomp($line);
			my ($key,$val)=split(/\=/,$line,2);
			$org_mail->{$key}=$val;
		}
        close(IN);
        my $orgmail = DA::OrgMail::get_org_mail_data($session,$org_mail->{gid});
		# 組織メール作成画面の色調
       	$backup_org_clrRdir = $session->{img_rdir} . "/jslib/iseria/mailer/top_panel/$orgmail->{mail_color}";
	}
	return $backup_org_clrRdir ;
}


1;
