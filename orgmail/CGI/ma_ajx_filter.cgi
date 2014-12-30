#!/usr/local/bin/perl
###################################################
##  INSUITE(R)Enterprise Version 2.0.0.          ##
##  Copyright(C)2006 DreamArts Corporation.      ##
##  All rights to INSUITE routines reserved.     ##
###################################################
BEGIN {
	use DA::Init();
	use DA::Mail();
	use DA::Ajax();
	use DA::Ajax::Mailer();
	use DA::Gettext;
}
use strict;

my $MAIL_VALUE = $DA::MailCommon::Constants::MAIL_VALUE;
my $MATCH_RULE = $DA::MailCommon::Constants::MATCH_RULE;
my $r = shift;

&main($r);
Apache::exit();

sub main {
	my ($r)	= @_;

	my $session	= {};
	DA::Session::get_dir($session, $r);	
	my $query	= Apache::Request->new($r, TEMP_DIR => "$session->{temp_dir}");
	DA::Valid::check_param_except($session, $query, [qw(t1 t2 move_path)]);

	my $p = _read_param($session, $query);
	my $param = {
		"tabs"		=> 1,
		"tab_on"	=> 1,
		"tab_name1"	=> "&nbsp;&nbsp;" . t_("振り分け") . "&nbsp;&nbsp;",
		"tab_href1"	=> "$DA::Vars::p->{cgi_rdir}/ma_ajx_filter.cgi",
	};
	my $title_invalid = $p->{title_mode};
	my $title_mode_tag;

	if($title_invalid eq '1'){
		$title_mode_tag = "title_mode=1";
		$param->{tab_href1} .= "?".$title_mode_tag;
	}
	my $imaps = (!$p->{reload}) ?
	            DA::Ajax::Mailer::connect($session)
	          : DA::Ajax::Mailer::connect($session, { "nosession" => 1 });
	if ($imaps->{error}) {
		DA::Ajax::Mailer::errorpage($session, $imaps->{message}, "pop");
	}
	if (!$p->{reload}) {
		my $result = DA::Ajax::Mailer::folders($session, $imaps);
		if ($result->{error}) {
			DA::Ajax::Mailer::errorpage($session, $result->{message}, "pop");
		}
		DA::Ajax::Mailer::make_folders_old($session, $imaps, $result->{folders_h}, "FILTER");

		my $tmp = {
			"PARENT" => "FILTER",
			"SOURCE" => "FILTER",
			"TITLE"  => "MailerFilterConfig",
			"cgi"    => "ma_ajx_filter.cgi"
		};
		DA::IS::save_temp($session, $tmp, "$session->{sid}.filterfolder.dat");
	}


	if ($p->{edit} eq t_('追　加') || $p->{edit} eq 'add') {
		&edit_proc($session, $imaps, $p, 'add');
	} elsif($p->{edit} eq t_('登　録') || $p->{edit} eq t_('更　新')) {
    	# 組織メールを使用中の場合は、使用アカウントの整合性を確認
    	DA::OrgMail::check_account_changed($session,$query,t_('フィルタ設定'));

		&add_submit($session, $imaps, $p);
	} elsif($p->{edit} eq t_('削　除')) {
    	# 組織メールを使用中の場合は、使用アカウントの整合性を確認
    	DA::OrgMail::check_account_changed($session,$query,t_('フィルタ設定'));

		&del_submit($session, $imaps, $p);
	} elsif($p->{edit} eq 'edit') {
		&edit_proc($session, $imaps, $p, 'edit');
	} elsif($p->{refresh} eq '1') {
		# フィルタ種類変更時
		&edit_proc($session, $imaps, $p, 'refresh_type');
	} elsif($p->{refresh} eq '2') {
		# 未読も処理にチェック
		&edit_proc($session, $imaps, $p, 'refresh_read');
	} elsif($p->{refresh} eq '3') {
		# 自動受信にチェック
		&edit_proc($session, $imaps, $p, 'refresh_auto');
	}
	if ($p->{mode} eq 'up' || $p->{mode} eq 'down') {
		&re_number($session, $imaps, $p);
	}

	my ($list, $list_tag);
	my %rule = (
		'1'	=> t_('と一致する'),
		'2'	=> t_('と一致しない'),
		'3'	=> t_('で開始する'),
		'4'	=> t_('で終了する'),
		'5'	=> t_('を含む'),
		'6'	=> t_('を含まない')
	);
	my %cond = (
		'and' => " " . t_("かつ") . " \n",
		'or'  => " " . t_("または") . " \n"
	);
	my %head = (
		'Subject:'	=> T_($MAIL_VALUE->{TITLE}->{SUBJECT}),
		'From:'		=> T_($MAIL_VALUE->{TITLE}->{FROM}),
		'To:'		=> T_($MAIL_VALUE->{TITLE}->{TO}),
		'Cc:'		=> T_($MAIL_VALUE->{TITLE}->{CC}),
		'Reply-To:'	=> T_($MAIL_VALUE->{TITLE}->{REPLY})
	);
	my $imap = DA::Ajax::Mailer::convert_internal($imaps->{imap});
	my $spam = DA::Mail::get_specific_folder($session, 'spam', 5, $imap);
	   $spam = DA::CGIdef::encode($spam, 0, 1, 'euc');
	
	my $ix = 0;
	if (my $lines = DA::Ajax::Mailer::get_filter($session)) {
		foreach my $l (@{DA::Ajax::Mailer::convert_internal($lines)}) {
			my ($h1, $c1, $t1, $cond, $h2, $c2,
				$t2, $proc, $path, $seen, $done,
				$deleted, $auto, $manual) = (
				$l->{h1}, $l->{c1}, $l->{t1}, $l->{cond},
				$l->{h2}, $l->{c2}, $l->{t2}, $l->{proc},
				$l->{move_path}, $l->{seen}, $l->{done},
				$l->{deleted}, $l->{auto}, $l->{manual}
			);
				
			my ($txt, $f_proc);
			if ($h1 eq 'Date:') {
				$txt = t_("「") . t_("%1日以上古いメール", $t1) . t_("」");
			} elsif ($h1 =~ /$MATCH_RULE->{FILTER_HEAD}/i) {
				$txt = t_("「") . $head{$h1} . t_("」") . '-' . t_("「") . $t1 . t_("」") . $rule{$c1};
				if ($cond ne '') {
					$txt .=$cond{$cond}
					     . t_("「") . $head{$h2} . t_("」") . '-' . t_("「") . $t2 . t_("」") . $rule{$c2};
				}
			} else {
				$txt = t_("「") . $h1 . t_("」") . '-' . t_("「") . $t1 . t_("」") . $rule{$c1};
			}
			if ($proc eq "move") {
				$path   = &_out_path($session, $path, $imap);
				$f_proc	= t_("「%1」フォルダへ移動する",$path);
			} elsif ($proc eq "spam") {
				$f_proc	= t_("「%1」フォルダへ移動する",$spam);
			} else {
				$f_proc	= t_("削除する");
			}

			$f_proc  = DA::CGIdef::encode($f_proc, 1, 1, 'euc');	
			$txt     = DA::CGIdef::encode($txt, 2, 1, 'euc');
			$seen    = ($seen =~ /^yes$/i) ? 'Yes' : 'No';
			$done    = ($done =~ /^yes$/i) ? 'Yes' : 'No';
			$deleted = ($deleted =~ /^yes$/i) ? 'Yes' : 'No';
			$auto    = ($auto =~ /^yes$/i) ? 'Yes' : 'No';
			$manual  = ($manual =~ /^yes$/i) ? 'Yes' : 'No';

			# リストの生成
			$list .="  <TR BGCOLOR=#FFFFFF>\n"
			      . "    <TD NOWRAP>$txt&nbsp;&nbsp;</TD>\n"
			      . "    <TD NOWRAP>$f_proc&nbsp;&nbsp;</TD>\n"
			      . "    <TD NOWRAP>$deleted&nbsp;&nbsp;</TD>\n"
			      . "    <TD NOWRAP>$seen&nbsp;&nbsp;</TD>\n"
			      . "    <TD NOWRAP>$done&nbsp;&nbsp;</TD>\n"
			      . "    <TD NOWRAP>$auto&nbsp;&nbsp;</TD>\n"
			      . "    <TD NOWRAP>$manual&nbsp;&nbsp;</TD>\n"
			      . "    <TD NOWRAP ALIGN=CENTER>\n";
			if ($ix ne 0) {
				$list .="      <A HREF=$DA::Vars::p->{cgi_rdir}/ma_ajx_filter.cgi"
				      . "?mode=up&line=$ix&$title_mode_tag>"
				      . "<IMG SRC=$session->{img_rdir}/aqbtn_up.gif "
				      . "WIDTH=34 HEIGHT=15 BORDER=0></A>\n";
			} else {
				$list .="      <IMG SRC=$session->{img_rdir}/null.gif "
				      . "WIDTH=34 HEIGHT=15 BORDER=0>\n";
			}
			$list .="      <A HREF=\"$DA::Vars::p->{cgi_rdir}/ma_ajx_filter.cgi"
			      . "?edit=edit&line=$ix&mode=edit&$title_mode_tag\">"
			      . "<IMG SRC=$session->{img_rdir}/aqbtn_edit.gif "
			      . "WIDTH=30 HEIGHT=15 BORDER=0></a>\n"
			      . "    </TD>\n"
			      . "  </TR>\n";
			$ix++;
		}
	} else {
		errorpage($session, t_("フィルタ設定の読み込みに失敗しました。"), "pop");
	}

	if ($list eq '') {
		$list_tag = t_("登録されているフィルタはありません。") . "<BR><BR>";
	} else {
		$list_tag=qq{
    		<TABLE BORDER=0 CELLSPACING=1 CELLPADDING=1 style="background:$DA::Vars::p->{base_color}"><TR>
      		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=CENTER>@{[t_("フィルタ条件")]}</TD>
      		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=CENTER>@{[t_("フィルタ処理")]}</TD>
      		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=CENTER>@{[t_("削除済み")]}</TD>
      		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=CENTER>@{[t_("未読")]}</TD>
      		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=CENTER>@{[t_("既読")]}</TD>
      		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=CENTER>@{[t_("自動")]}</TD>
      		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=CENTER>@{[t_("無効")]}</TD>
      		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=CENTER>@{[t_("操作")]}</TD>
    		</TR>
			$list
    		</TABLE><BR>
		};
	}

# 組織メールを使用中の場合は、使用アカウントを表示
my $orgmail_tag=DA::OrgMail::current_account_tag($session, t_('フィルタ設定'));

$param->{contents}	=<<buf_end;
$orgmail_tag
$list_tag

<HR>
<INPUT TYPE=submit NAME=edit VALUE='@{[t_("追　加")]}'>
<BR>
buf_end

my ($head, $body) = DA::IS::get_head($session, "MailerFilterConfig");
my $html_tag = DA::IS::get_tab_html($session, $param);

my $page_title;
if($p->{title_mode} ne '1'){
	my $v_name          = DA::IS::get_ug_name(
	    $session,
	    0,
	    $session->{user},
	    $session->{type},
	    $session->{name},
    	$session->{primary_gname});
	$page_title      = DA::CGIdef::get_page_title($session,'func_title_filter.gif',
	    t_("ユーザ") ." : $v_name->{page_title}",'','on',t_('フィルタ')
	);
}

my $outbuf=<<buf_end;
$head
<SCRIPT LANGUAGE="JavaScript"><!--
$p->{js}
//--></SCRIPT>
</head>
$body
<FORM METHOD=POST ACTION="$DA::Vars::p->{cgi_rdir}/ma_ajx_filter.cgi" style="margin:0px;padding:0px;">
<INPUT TYPE=hidden NAME=reload VALUE='1'>
<INPUT TYPE=hidden NAME=title_mode VALUE='$title_invalid'>
$page_title
$html_tag
</FORM>
</BODY>
</HTML>
buf_end

	DA::IS::print_data($session, $outbuf);
	Apache::exit();
}

sub edit_proc {
	my ($session, $imaps, $p, $opt)	= @_;

	# 初期設定
	my $list = DA::IS::get_temp($session,"$session->{sid}\.FILTER\.imap_list");
	my $info = DA::IS::get_temp($session,"$session->{sid}\.FILTER\.imap_info");
	my $imap_conf = DA::Ajax::Mailer::convert_internal($imaps->{imap});
	my $mail = DA::Ajax::Mailer::convert_internal($imaps->{mail});
	my $param = {
		"tabs"      => 1,
		"tab_on"    => 1,
		"tab_name1" => "&nbsp;&nbsp;" . t_("振り分け") . "&nbsp;&nbsp;",
		"tab_href1" => "$DA::Vars::p->{cgi_rdir}/ma_ajx_filter.cgi",
	};
    my $title_invalid = $p->{title_mode};
    my $title_mode_tag;

    if($title_invalid eq '1'){
        $title_mode_tag = "title_mode=1";
        $param->{tab_href1} .= "?".$title_mode_tag;
    }
	if ($opt eq 'refresh_type') {
		# フィルタ種類変更時
		if ($p->{type} eq 'date'){
			$p->{h1} = "Date:";
			$p->{h2} = "";
			$p->{t1} = 30;
			$p->{t2} = "";
		} elsif ($p->{type} eq 'custom') {
			$p->{h1} = "";
			$p->{h2} = "";
			$p->{t1} = "";
			$p->{t2} = "";
		} else {
			$p->{h1} = "Subject:";
			$p->{h2} = "";
			$p->{t1} = "";
			$p->{t2} = "";
		}
	} elsif ($opt eq 'refresh_read' || $opt eq 'refresh_auto') {
		$p->{h1} = DA::CGIdef::encode($p->{h1}, 3, 1);
		$p->{h2} = DA::CGIdef::encode($p->{h2}, 3, 1);
		$p->{t1} = DA::CGIdef::encode($p->{t1}, 3, 1);
		$p->{t2} = DA::CGIdef::encode($p->{t2}, 3, 1);
		if ($opt eq "refresh_auto") {
			$p->{seen}	= "Yes";
		}
	} elsif ($opt eq 'refresh') {
		$p->{h1} = DA::CGIdef::encode($p->{h1}, 3, 1, 'euc');
		$p->{h2} = DA::CGIdef::encode($p->{h2}, 3, 1, 'euc');
		$p->{t1} = DA::CGIdef::encode($p->{t1}, 3, 1, 'euc');
		$p->{t2} = DA::CGIdef::encode($p->{t2}, 3, 1, 'euc');
	} else {
		if ($opt eq 'edit') {
			if (my $lines = DA::Ajax::Mailer::get_filter($session)) {
				foreach my $i (qw(h1 c1 t1 cond h2 c2 t2 proc move_path seen done deleted auto manual)) {
					$p->{$i} = DA::Ajax::Mailer::convert_internal($lines->[$p->{line}]->{$i});
				}
			} else {
				errorpage($session, t_("フィルタ設定の読み込みに失敗しました。"), "pop");
			}
			if ($p->{h1} eq 'Date:') {
				$p->{type} = "date";
			} elsif ($p->{h1} =~ /$MATCH_RULE->{FILTER_HEAD}/i) {
				$p->{type} = "head";
			} else {
				$p->{type} = "custom";
			}
			$p->{h1} = DA::CGIdef::encode($p->{h1}, 3, 1, 'euc');
			$p->{h2} = DA::CGIdef::encode($p->{h2}, 3, 1, 'euc');
			$p->{t1} = DA::CGIdef::encode($p->{t1}, 3, 1, 'euc');
			$p->{t2} = DA::CGIdef::encode($p->{t2}, 3, 1, 'euc');
		} else {
			$p->{proc} = 'move';
			$p->{type} = 'head';
			$p->{t1} = '';
			$p->{t2} = '';
		}
	}

	# POPUP 表示の場合
	my ($script, $hopt1, $hopt2);
	if ($p->{detail}) {
		if (my $org = DA::Ajax::Mailer::mail_original($session, $p->{fid}, $p->{uid})) {
			# 初期値の設定
			if ($opt eq 'add' || ($opt eq 'refresh_type' && $p->{type} eq 'head')) {
				$p->{t1} = DA::CGIdef::encode($org->{Subject}, 3, 1, 'euc');
			}

			#===========================================
			#     Custom
			#===========================================
			DA::Custom::rewrite_mail_original_popup($session, $p, \$org);
			#===========================================
			
			# Encode
			foreach my $f (qw(From To Cc Bcc Reply-To Subject)) {
				if ($f eq "Subject") {
					$org->{$f} = js_esc_($org->{$f});
				} else {
					$org->{$f} = DA::Mailer::unescape_mail_name($org->{$f});
					$org->{$f} = js_esc_($org->{$f});
				}
			}
			
			$org->{To} =~ s/^(recipient\s*list\s*not\s*shown:\s*;|undisclosed-recipients:\s*;|undisclosed\srecipients:\s*;)$//i;

			# Script 生成
			$script	= "function changeField(ITEM){\n"
					. "  var hnum = ITEM\n"
					. "  var FIELD;\n"
					. "  var VALUE;\n"
					. "  if (hnum == 'h1') {\n"
					. "    var index = document.forms[0].h1.selectedIndex;\n"
					. "    FIELD = document.forms[0].h1.options[index].value;\n"
					. "  } else {\n"
					. "    var index = document.forms[0].h2.selectedIndex;\n"
					. "    FIELD = document.forms[0].h2.options[index].value;\n"
					. "  }\n"
					. "  if (FIELD == 'Subject:') { VALUE = '$org->{Subject}'; }\n"
					. "  if (FIELD == 'From:') { VALUE = '$org->{From}'; }\n"
					. "  if (FIELD == 'To:') { VALUE = '$org->{To}'; }\n"
					. "  if (FIELD == 'Cc:') { VALUE = '$org->{Cc}'; }\n"
					. "  if (FIELD == 'Reply-To:') { VALUE = '$org->{'Reply-To'}'; }\n"
					. "  if (hnum == 'h1') {\n"
					. "    document.forms[0].t1.value = VALUE;\n"
					. "  } else {\n"
					. "    document.forms[0].t2.value = VALUE;\n"
					. "  }\n"
					. "}";

			# SELECT オプション
			$hopt1 = " onChange=\"changeField('h1')\"";
			$hopt2 = " onChange=\"changeField('h2')\"";
		} else {
			errorpage($session, t_("ヘッダ情報が取得できません。"), "pop");
		}
	}

	# 削除ボタンの追加
	my ($title_gif, $title_name, $btn_tag);
	if ($p->{mode} eq 'edit') {
		$btn_tag = "<INPUT TYPE=submit NAME=edit VALUE=\"" . t_("更　新") . "\""
		         . " onClick=\"return changeConfirm();\">\n"
		         . "<INPUT TYPE=submit NAME=edit VALUE=\"" . t_("削　除") . "\""
		         . " onClick=\"return deleteConfirm();\">";
		$title_gif  = "func_title_editfilter.gif";
		$title_name = t_('フィルタの編集');
	} else {
		$btn_tag = "<INPUT TYPE=submit NAME=edit VALUE=\"" . t_("登　録") . "\""
		         . " onClick=\"return addConfirm();\">\n";
		$title_gif = "func_title_addfilter.gif";
		$title_name = t_('フィルタの追加');
	}

	# 選択フォルダの書き換え
	my $folders = DA::Ajax::Mailer::storable_retrieve($session, "folders");
	unless ($folders) {
		errorpage($session, t_("フォルダ情報が取得できませんでした。"), "pop");
	}

	my ($move_path, $move_alert, $move_button, $move_script)
		= DA::Ajax::Mailer::make_folders_tag_old($session, $imaps, $folders, $p->{move_path}, "filterfolder", 1);

	# 選択
	my $chk  = {};
	my @item = qw(type proc h1 c1 h2 c2 cond seen done deleted auto manual);
	foreach (@item) {
		if (/^(proc|seen|done|deleted|auto|manual)$/) {
			$chk->{$_}->{$p->{$_}} = " CHECKED";
		} else {
			$chk->{$_}->{$p->{$_}} = " SELECTED";
		}
	}
	if ($imap_conf->{spam} eq "" && $chk->{proc}->{spam}) {
		$chk->{proc}->{spam} = "";
		$chk->{proc}->{move} = " CHECKED";
	}

	# 条件表示タグ
	my $rule_tag;
	if ($p->{type} eq 'date') {

$rule_tag=<<end_tag;
  <TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("フィルタ条件")]}</TD>
    <TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=3>
      <INPUT TYPE=hidden NAME=h1 VALUE="Date:">@{[t_("メールのDate:ヘッダが%1日以上古いメール", "<INPUT TYPE=text NAME=t1 SIZE=4 VALUE=\"$p->{t1}\">")]}
    </TD>
  </TR>
end_tag

	} elsif ($p->{type} eq 'custom') {

$rule_tag=<<end_tag;
  <TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("フィルタ条件")]}</TD>
    <TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=3>
      @{[t_("%1が次を含む", "<INPUT TYPE=text NAME=h1 SIZE=30 VALUE=\"$p->{h1}\">")]}<br>
      <INPUT TYPE=text NAME=t1 SIZE=30 VALUE="$p->{t1}"><INPUT TYPE=hidden NAME=c1 VALUE='5'>
    </TD>
  </TR>
end_tag

	} else {

$rule_tag=<<end_tag;
  <TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("フィルタ条件")]}</TD>
    <TD BGCOLOR=#FFFFFF NOWRAP>
      <SELECT NAME=h1 SIZE=1$hopt1>
        <OPTION VALUE='Subject:'$chk->{h1}->{'Subject:'}>@{[T_($MAIL_VALUE->{TITLE}->{SUBJECT})]}
        <OPTION VALUE='From:'$chk->{h1}->{'From:'}>@{[T_($MAIL_VALUE->{TITLE}->{FROM})]}
        <OPTION VALUE='To:'$chk->{h1}->{'To:'}>@{[T_($MAIL_VALUE->{TITLE}->{TO})]}
        <OPTION VALUE='Cc:'$chk->{h1}->{'Cc:'}>@{[T_($MAIL_VALUE->{TITLE}->{CC})]}
        <OPTION VALUE='Reply-To:'$chk->{h1}->{'Reply-To:'}>@{[T_($MAIL_VALUE->{TITLE}->{REPLY})]}
      </SELECT><BR>
      <SELECT NAME=c1 SIZE=1>
        <OPTION VALUE='1'$chk->{c1}->{1}>@{[t_("が次と一致する")]}
        <OPTION VALUE='2'$chk->{c1}->{2}>@{[t_("が次と一致しない")]}
        <OPTION VALUE='3'$chk->{c1}->{3}>@{[t_("が次で開始する")]}
        <OPTION VALUE='4'$chk->{c1}->{4}>@{[t_("が次で終了する")]}
        <OPTION VALUE='5'$chk->{c1}->{5}>@{[t_("が次を含む")]}
        <OPTION VALUE='6'$chk->{c1}->{6}>@{[t_("が次を含まない")]}
      </SELECT><BR>
      <INPUT TYPE=text NAME=t1 SIZE=30 VALUE="$p->{t1}">
    </TD>
    <TD BGCOLOR=$DA::Vars::p->{title_color}>
      <SELECT NAME=cond SIZE=1>
        <OPTION VALUE=''>----
        <OPTION VALUE='and'$chk->{cond}->{and}>@{[t_("かつ")]}
        <OPTION VALUE='or'$chk->{cond}->{or}>@{[t_("または")]}
      </SELECT>
    </TD>
    <TD BGCOLOR=#FFFFFF NOWRAP>
      <SELECT NAME=h2 SIZE=1$hopt2>
        <OPTION VALUE=''>--------
        <OPTION VALUE='Subject:'$chk->{h2}->{'Subject:'}>@{[T_($MAIL_VALUE->{TITLE}->{SUBJECT})]}
        <OPTION VALUE='From:'$chk->{h2}->{'From:'}>@{[T_($MAIL_VALUE->{TITLE}->{FROM})]}
        <OPTION VALUE='To:'$chk->{h2}->{'To:'}>@{[T_($MAIL_VALUE->{TITLE}->{TO})]}
        <OPTION VALUE='Cc:'$chk->{h2}->{'Cc:'}>@{[T_($MAIL_VALUE->{TITLE}->{CC})]}
        <OPTION VALUE='Reply-To:'$chk->{h2}->{'Reply-To:'}>@{[T_($MAIL_VALUE->{TITLE}->{REPLY})]}
      </SELECT><BR>
      <SELECT NAME=c2 SIZE=1>
        <OPTION VALUE=''>--------
        <OPTION VALUE='1'$chk->{c2}->{1}>@{[t_("が次と一致する")]}
        <OPTION VALUE='2'$chk->{c2}->{2}>@{[t_("が次と一致しない")]}
        <OPTION VALUE='3'$chk->{c2}->{3}>@{[t_("が次で開始する")]}
        <OPTION VALUE='4'$chk->{c2}->{4}>@{[t_("が次で終了する")]}
        <OPTION VALUE='5'$chk->{c2}->{5}>@{[t_("が次を含む")]}
        <OPTION VALUE='6'$chk->{c2}->{6}>@{[t_("が次を含まない")]}
      </SELECT><BR>
      <INPUT TYPE=text NAME=t2 SIZE=30 VALUE="$p->{t2}">
    </TD>
  </TR>
end_tag

	}

	my $trash = DA::Mail::get_specific_folder($session, 'trash', 5, $imap_conf);
	   $trash = DA::CGIdef::encode($trash, 0, 1, 'euc');
	my $trash_tag = t_("（%1フォルダに移動）", $trash) if (!$mail->{delete});
	my $spam = DA::Mail::get_specific_folder($session, 'spam', 5, $imap_conf);
	   $spam = DA::CGIdef::encode($spam, 0, 1, 'euc');
	my $spam_msg = t_("%1フォルダに移動", $spam);
	my $spam_tag = "  <TR>\n"
	             . "    <TD BGCOLOR=#FFFFFF COLSPAN=3>\n"
	             . "      <INPUT TYPE=radio NAME=proc VALUE='spam'"
	             . "$chk->{proc}->{spam}>$spam_msg\n"
	             . "    </TD>\n"
	             . "  </TR>" if ($imap_conf->{spam} ne "");
	my $back_tag = ($p->{detail}) ?
	               "<INPUT TYPE=button VALUE=\"" . t_("閉じる")
                 . "\" onClick=\"top.window.close();\">"
	             : "<INPUT TYPE=submit NAME=edit VALUE=\"" . t_("戻　る") . "\">";
	my $seen_tag = "      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
	             . "<input type=checkbox name=done value=\"Yes\"$chk->{done}->{Yes}>"
	             . t_("対象となるメールを既読にする") . "<BR>" if ($p->{seen} =~ /^yes$/i);
	my $rowspan  = ($spam_tag) ? 3 : 2;

	# 組織メールを使用中の場合は、使用アカウントを表示
	my $orgmail_tag=DA::OrgMail::current_account_tag($session, t_('フィルタ設定'));

	$param->{contents}=<<tag_end;
$orgmail_tag
<TABLE BORDER=0 CELLSPACING=1 CELLPADDING=1 style="background:$DA::Vars::p->{base_color}"><TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("フィルタ種類")]}</TD>
    <TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=3>
      <SELECT NAME=type SIZE=1 onChange="javascript:refreshThis(1);">
        <OPTION VALUE=head$chk->{type}->{head}>@{[t_("ヘッダ文字列によるフィルタ")]}
        <OPTION VALUE=date$chk->{type}->{date}>@{[t_("日付比較によるフィルタ")]}
        <OPTION VALUE=custom$chk->{type}->{custom}>@{[t_("カスタムヘッダによるフィルタ")]}
      </SELECT>
    </TD>
</TR>
$rule_tag
<TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right ROWSPAN=$rowspan>@{[t_("フィルタ処理")]}</TD>
    <TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=3>
      <INPUT TYPE=radio NAME=proc VALUE='move'$chk->{proc}->{move}>@{[t_("下記フォルダへ移動する")]}
      <table border=0 width=100%><tr>
        <td>$move_path$move_alert</td>
        <td width=30>$move_button</td>
      </tr></table>
    </TD>
</TR><TR>
    <TD BGCOLOR=#FFFFFF COLSPAN=3>
      <INPUT TYPE=radio NAME=proc VALUE='del'$chk->{proc}->{del}>@{[t_("削除する")]}$trash_tag
    </TD>
</TR>
$spam_tag
<TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("処理対象")]}</TD>
    <TD BGCOLOR=#FFFFFF COLSPAN=3>
      <input type=checkbox name=deleted value="Yes"$chk->{deleted}->{Yes}>@{[t_("削除済みメールも処理をする")]}<BR>
      <input type=checkbox name=seen value="Yes"$chk->{seen}->{Yes} onClick="javascript:refreshThis(2);">@{[t_("未読メールも処理をする")]}<BR>
	  $seen_tag
    </TD>
</TR><TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("その他")]}</TD>
    <TD BGCOLOR=#FFFFFF COLSPAN=3>
      <input type=checkbox name=auto value="Yes"$chk->{auto}->{Yes} onClick="javascript:refreshAuto();">@{[t_("受信時に自動実行する")]}<BR>
      <input type=checkbox name=manual value="Yes"$chk->{manual}->{Yes}>@{[t_("手動実行時に無効にする")]}
    </TD>
</TR></TABLE><BR>

<HR>
$back_tag
$btn_tag
<BR>
tag_end

	my ($head, $body) = DA::IS::get_head($session, "MailerFilterConfig");
	my $html_tag = DA::IS::get_tab_html($session, $param);

	my $page_title;

	if($p->{title_mode} ne '1'){
	    my $v_name          = DA::IS::get_ug_name(
	        $session,
	        0,
	        $session->{user},
	        $session->{type},
	        $session->{name},
	        $session->{primary_gname}
	    );
	    $page_title = DA::CGIdef::get_page_title($session,$title_gif,
			t_("ユーザ") . " : $v_name->{page_title}",'','on',$title_name
		);
	}

	my $outbuf=<<buf_end;
$head
<SCRIPT LANGUAGE="JavaScript"><!--
    var onChanging = 0;
$p->{js}
$script
    function addConfirm(){
        f=confirm('@{[t_("フィルタを登録してもよろしいですか？")]}');
		changeAccountCookie();
        return f;
    }
    function changeConfirm(){
        f=confirm('@{[t_("フィルタを更新してもよろしいですか？")]}');
		changeAccountCookie();
        return f;
    }
    function deleteConfirm(name){
        f=confirm('@{[t_("フィルタを削除してもよろしいですか？")]}');
		changeAccountCookie();
        return f;
    }
    function refreshThis(NUM){
		changeAccountCookie();
        if (onChanging == 0) {
            onChanging = 1;
            document.forms[0].refresh.value = NUM;
            document.forms[0].submit();
        }
    }
    function refreshAuto(){
		changeAccountCookie();
        if (onChanging == 0) {
            if (document.forms[0].auto.checked) {
                refreshThis(3);
			}
        }
    }
    function changeAccountCookie(){
        var mail_account = document.getElementsByName('org_mail');
		if (mail_account.length > 0){
			document.cookie = '$session->{sid}\-org_mail='+mail_account[0].value+';';
		} else {
			document.cookie = '$session->{sid}\-org_mail=$session->{user};';
		}
    }
$move_script
//--></SCRIPT>
</head>
$body
<FORM METHOD=POST ACTION="$DA::Vars::p->{cgi_rdir}/ma_ajx_filter.cgi">
<INPUT TYPE=hidden NAME=fid value="$p->{fid}">
<INPUT TYPE=hidden NAME=uid value="$p->{uid}">
<INPUT TYPE=hidden NAME=detail VALUE="$p->{detail}">
<INPUT TYPE=hidden NAME=mode VALUE="$p->{mode}">
<INPUT TYPE=hidden NAME=line VALUE="$p->{line}">
<INPUT TYPE=hidden NAME=refresh VALUE="0">
<INPUT TYPE=hidden NAME=reload VALUE="1">
<INPUT TYPE=hidden NAME=title_mode VALUE="$title_invalid">
$page_title
$html_tag
</FORM>
</BODY>
</HTML>
buf_end

	DA::IS::print_data($session, $outbuf);
	Apache::exit();

}

sub add_submit {
	my ($session, $imaps, $p) = @_;

	$p->{h1} = DA::CGIdef::encode($p->{h1}, 3, 2);
	$p->{h2} = DA::CGIdef::encode($p->{h2}, 3, 2);
	$p->{t1} = ($p->{type} eq 'date') ?
	           DA::CGIdef::convert($p->{t1})
	         : DA::CGIdef::encode($p->{t1}, 3, 2);
	$p->{t2} = DA::CGIdef::encode($p->{t2}, 3, 2);

	# : の処理
	$p->{h1} =~ s/\:+$//g; $p->{h1} .= ":";
	$p->{h2} =~ s/\:+$//g; $p->{h2} .= ":";

	# エラーチェック
	if ($p->{h1} eq "") {
		errorpage($session, t_("ヘッダを指定してください。"));
	}
	if ($p->{h1} !~ /^[\x21-\x7e]+$/) {
		errorpage($session, t_("%1に使用できない文字が含まれています。", t_("ヘッダ")));
	}
	if ($p->{t1} !~ /\S/) {
		errorpage($session, t_("フィルタ条件を設定してください。"));
	}
	if ($p->{type} eq 'date') {
		if ($p->{t1} !~ /^\d+$/) {
			errorpage($session, t_("日付比較のフィルタ条件を日数で設定してください。"));
		}
		if ($p->{t1} > 9999) {
			errorpage($session, t_("%1には[%2-%3]の数字を指定してください。", t_("日数"), 0, 9999));
		}
	}
	if ($p->{type} eq 'custom' && $p->{h1} =~ /$MATCH_RULE->{FILTER_HEAD}/i) {
		if ($p->{h1} =~ /^date/i) {
			errorpage($session, t_("指定のヘッダは、「日付比較によるフィルタ」をご使用ください。"));
		} else {
			errorpage($session, t_("指定のヘッダは、「ヘッダ文字列によるフィルタ」をご使用ください。"));
		}
	}
	if ($p->{cond} ne '') {
		if($p->{h2} eq '' || $p->{c2} eq '' || $p->{t2} !~ /\S/){
			errorpage($session, t_("２番目のフィルタ条件を設定してください。"));
		}
		if ($p->{h2} !~ /^[\x21-\x7e]+$/) {
			errorpage($session, t_("%1に使用できない文字が含まれています。", t_("ヘッダ")));
		}
	}
	$p->{h1} = DA::CGIdef::decode($p->{h1}, 2, 1);
	$p->{h2} = DA::CGIdef::decode($p->{h2}, 2, 1);
	$p->{t1} = DA::CGIdef::decode($p->{t1}, 2, 1);
	$p->{t2} = DA::CGIdef::decode($p->{t2}, 2, 1);

	# フィルタ定義データの生成
	my $filter = {};
	foreach my $i (qw(h1 c1 t1 cond h2 c2 t2 seen done deleted auto manual)) {
		$filter->{$i} = $p->{$i};
	}
	if ($p->{proc} eq 'move') {
		#フィルタ処理条件 => 移動
		my $path = $p->{move_path};
		if ($path eq '' || $path eq 'd') {
			errorpage($session, t_("移動するフォルダを設定してください。"));
		} elsif ($path eq "#root") {
			errorpage($session, t_("ルートフォルダには移動できません。"));
		} elsif ($path eq "#cabinet") {
			errorpage($session, t_("キャビネットには移動できません。"));
		} elsif ($path =~ /^\#(inbox|draft|sent|trash|spam)$/) {
			errorpage($session, t_("指定のフォルダには移動できません。"));
		}
		$filter->{proc} = "move";
		$filter->{move_path} = $path;
	} elsif ($p->{proc} eq 'spam') {
		# フィルタ処理条件 => スパム
		$filter->{proc} = "spam";
		$filter->{move_path} = "";
	} else {
		# フィルタ処理条件 => 削除
		$filter->{proc} = "del";
		$filter->{move_path} = "d";
	}

	if ($p->{mode} eq 'edit') {
		# 更新
		if (DA::Ajax::Mailer::clear_filter_uid_number($session, $imaps)) {
			if (my $lines = DA::Ajax::Mailer::get_filter($session)) {
				$lines->[$p->{line}] = DA::Ajax::Mailer::convert_mailer($filter);
				unless (DA::Ajax::Mailer::save_filter($session, $lines)) {
					errorpage($session, t_("フィルタ設定の書き込みに失敗しました。"));
				}
			} else {
				errorpage($session, t_("フィルタ設定の読み込みに失敗しました。"));
			}
		} else {
			errorpage($session, t_("フィルタ設定の読み込みに失敗しました。"));
		}
	} else {
		# 追加
		if (DA::Ajax::Mailer::clear_filter_uid_number($session, $imaps)) {
			if (my $lines = DA::Ajax::Mailer::get_filter($session)) {
				push(@{$lines}, DA::Ajax::Mailer::convert_mailer($filter));
				unless (DA::Ajax::Mailer::save_filter($session, $lines)) {
					errorpage($session, t_("フィルタ設定の書き込みに失敗しました。"));
				}
			} else {
				errorpage($session, t_("フィルタ設定の読み込みに失敗しました。"));
			}
		} else {
			errorpage($session, t_("フィルタ設定の書き込みに失敗しました。"));
		}
	}

	if ($p->{detail}) {
		close_window($session);
	}

	return;
}

sub del_submit {
	my ($session, $imaps, $p) = @_;

	# 削除
	if (my $lines = DA::Ajax::Mailer::get_filter($session)) {
		splice(@{$lines}, $p->{line}, 1);
		unless (DA::Ajax::Mailer::save_filter($session, $lines)) {
			errorpage($session, t_("フィルタ設定の書き込みに失敗しました。"));
		}
	} else {
		errorpage($session, t_("フィルタ設定の読み込みに失敗しました。"));
	}
}

sub re_number {
	my ($session, $imaps, $p) = @_;
	my $mode = $p->{mode};
	my $line = $p->{line};

	# フィルタデータの読み込み
	if (my $lines = DA::Ajax::Mailer::get_filter($session)) {
		my $cnt = scalar(@{$lines});
		my $new  = ($mode eq 'up') ? $line - 1 : $line + 1;

		if ($new >= 0 && $new < $cnt) {
			($lines->[$line], $lines->[$new])
				= ($lines->[$new], $lines->[$line]);

			unless (DA::Ajax::Mailer::save_filter($session, $lines)) {
				errorpage($session, t_("フィルタ設定の書き込みに失敗しました。"));
			}
		}
	} else {
		errorpage($session, t_("フィルタ設定の読み込みに失敗しました。"));
	}

	return;
}

sub _read_param {
	my ($session, $query) = @_;
	my @param = qw (
		win fid uid mode line
		edit refresh type h1 c1 t1
		cond h2 c2 t2 proc seen
		done deleted auto manual
		sel move_path reload detail title_mode
	);

	my $p = {};
	foreach (@param) {
		$p->{$_} = $query->param("$_");
	}
	$p->{edit} = DA::Unicode::convert_from_query($p->{edit});
	
	return($p);
}

sub _out_path {
	my ($session, $path, $imap) = @_;

	# フォルダ名の取得
	$path = DA::Mail::get_folder_name($path, $imap, 1, 1);

	return($path);
}

sub close_window {
	my ($session) = @_;
	my ($head, $body) = DA::IS::get_head($session, "MailerFilterConfig");

	# POP UP 用
	my $outbuf=<<end_tag;
$head
<SCRIPT LANGUAGE="JavaScript"><!--
top.window.close()
//--></SCRIPT>
</head>
end_tag

	DA::IS::print_data($session, $outbuf);
	Apache::exit();
}

sub errorpage {
	my ($session, $msg, $mode) = @_;

	DA::CGIdef::errorpage($session, $msg, $mode);
}


