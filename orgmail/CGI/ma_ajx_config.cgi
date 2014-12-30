#!/usr/local/bin/perl
###################################################
##  INSUITE(R)Enterprise Version 2.0.0.          ##
##  Copyright(C)2006 DreamArts Corporation.      ##
##  All rights to INSUITE routines reserved.     ##
###################################################
BEGIN {
	use DA::Init();
	use DA::Ajax();
	use DA::Ajax::Mailer();
	use DA::Gettext;
}
use strict;

my $r = shift;

&main($r);
Apache::exit();

sub main {
	my ($r) = @_;

	my $session	= {};
	DA::Session::get_dir($session, $r);
	my $query	= Apache::Request->new($r, TEMP_DIR=>"$session->{temp_dir}");
	DA::Valid::check_param_all($session, $query);

	my $custom = DA::Ajax::Mailer::get_custom($session);
	my $product = "INSUITE";
	my $menuObj = "top.opener";

	# ����������
	my $param = DA::Ajax::Mailer::get_config_param($session, $custom, "menu_action");
	my $init  = $query->param("init");
	my $edit  = $query->param("edit");
	my $path_side = $query->param("path_side");
	my ($submit, $reload);

	if ($init) {
		&init_proc($session); $submit = 1;
		$param->{message} = t_("�Żҥ᡼���ư��������������ޤ�����")."<BR>"
		                  . t_("����ϼ���᡼�顼��ư����ȿ�Ǥ���ޤ���");
	} elsif (DA::Unicode::convert_from_query($edit) eq t_('�ߡ���')){
		&set_proc($session, $query, $param); $submit = 1;
		$param->{message} = t_("�Żҥ᡼���ư��������ѹ����ޤ�����")."<BR>"
		                  . t_("����ϼ���᡼�顼��ư����ȿ�Ǥ���ޤ���");
	}

	if ($submit) {
		my @path_side = split ('/', $path_side);
		my $cgi_side  = $path_side[-1];
		my $time      = time;

		if ($cgi_side =~ /(kp_app_menu.cgi\?app=kp_groupware|ma_menu.cgi|pr_menu.cgi)/) {
			$cgi_side =~ s/\&time\=\d+$//;
			$cgi_side .= ($cgi_side =~ /\?/) ? "&time=$time" : "?time=$time";
			$cgi_side .= "&action=chg_conf";
			if ($session->{menu_style} eq "aqua" && $path_side =~ /\/menu\_left\.cgi/) {
				$reload .= "";
			} else {
				$reload .= "reloadMenu($menuObj, '$cgi_side');\n";
			}
		}
	}

	# �����ͤμ���
	my $conf = DA::IS::get_master($session, "ajxmailer");
	my $base = DA::IS::get_master($session, "base");
	my $ck = {};
	foreach my $key (keys %$conf) {
		$ck->{$key}->{$conf->{$key}} = " CHECKED";
	}
	if ($base->{mailer_style}) {
		$ck->{mailer_style}->{$base->{mailer_style}} = " CHECKED";
	} else {
		$ck->{mailer_style}->{classic} = " CHECKED";
	}
	if ($base->{mailer}) {
		$ck->{mailer}->{$base->{mailer}} = " CHECKED";
	} else {
		$ck->{mailer}->{other} = " CHECKED";
	}
	$ck->{auto_fix_consistency}->{off} = " CHECKED" if ($conf->{auto_fix_consistency} eq '');
	$ck->{delete}->{0} = " CHECKED" if ($conf->{delete} eq '');

	my $imaps = DA::Ajax::Mailer::connect($session, { nosession => 1 });
	my $archive = DA::Ajax::Mailer::check_archive($session, $imaps->{custom});
	$ck->{archive}->{DA::Ajax::Mailer::select_archive_type($archive, $conf, 1)} = " CHECKED";
	$ck->{archive_file}->{DA::Ajax::Mailer::select_archive_type($archive, $conf, 2)} = " CHECKED";
	$ck->{archive_one}->{DA::Ajax::Mailer::select_archive_type($archive, $conf)}	= " CHECKED";

	my ($mailer_style_tag, $button_tag, $message_tag);
	my $ma_custom = DA::IS::get_sys_custom($session,"mail");
	if (DA::Ajax::mailer_license_ok($session)) {
		if(($session->{config_opener} eq 'ajax_mailer') 
			||($ma_custom->{force_mailer_style} =~ /^(ajax|classic)$/)){
			my $msg;
			my $mailer_style;

			if($ma_custom->{force_mailer_style} =~ /^(ajax|classic)$/){
				if($ma_custom->{force_mailer_style} eq 'ajax'){
					$msg = t_("����᡼��(�˥塼��������)�����Ѥ���Ƥ��ޤ���");
				}else{
					$msg = t_("����᡼��(���饷�å���������)�����Ѥ���Ƥ��ޤ���");
				}
				$mailer_style = $ma_custom->{force_mailer_style};
				
				# �����ͤȥ��å�������ι���
				$base->{mailer_style}=$ma_custom->{force_mailer_style};
				$session->{mailer_style}=$base->{mailer_style};
				DA::IS::save_master($session, $base, "base");
				DA::Session::update($session);

			}else{
				if($session->{mailer_style} eq 'ajax'){
					$msg = t_("����᡼��(�˥塼��������)�����Ѥ���Ƥ��ޤ���");
				}else{
					$msg = t_("����᡼��(���饷�å���������)�����Ѥ���Ƥ��ޤ���");
				}
				$mailer_style = $session->{mailer_style};
			}
			$msg.="\n\t <INPUT TYPE=HIDDEN NAME=mailer_style VALUE=$mailer_style>";
	
			# ɽ������������
			$mailer_style_tag=<<end_tag;
  <TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("���ѥ᡼�顼")]}</TD>
    <TD BGCOLOR=#FFFFFF NOWRAP>
	  $msg
    </TD>
  </TR>
end_tag
		}else{
			$mailer_style_tag=<<end_tag;
  <TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("�᡼�饹�����������")]}</TD>
    <TD BGCOLOR=#FFFFFF NOWRAP>
      <INPUT TYPE=radio NAME=mailer_style VALUE="classic"$ck->{mailer_style}->{classic}>@{[t_("����᡼��(���饷�å���������)����Ѥ���")]}<BR>
      <INPUT TYPE=radio NAME=mailer_style VALUE="ajax"$ck->{mailer_style}->{ajax}>@{[t_("����᡼��(�˥塼��������)����Ѥ���")]}<BR>
    </TD>
  </TR>
end_tag
		}
	}

	my $auto_fix_tag;
	if ($ma_custom->{auto_fix_consistency} eq "on") {
		$auto_fix_tag=<<end_tag;
		<TR>
			<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("�ե�����μ�ư����")]}</TD>
			<TD BGCOLOR=#FFFFFF NOWRAP>
			<INPUT TYPE="hidden" NAME=auto_fix_consistency VALUE="on">@{[t_("��ư�ǽ�������")]}
		    </TD>
		</TR>
end_tag
	} elsif ($ma_custom->{auto_fix_consistency} eq "off") {
		$auto_fix_tag=<<end_tag;
		<TR>
			<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("�ե�����μ�ư����")]}</TD>
			<TD BGCOLOR=#FFFFFF NOWRAP>
			<INPUT TYPE="hidden" NAME=auto_fix_consistency VALUE="off">@{[t_("��ư�ǽ������ʤ�")]}
			</TD>
		</TR>
end_tag
	} else {
		$auto_fix_tag=<<end_tag;
		<TR>
			<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("�ե�����μ�ư����")]}</TD>
			<TD BGCOLOR=#FFFFFF NOWRAP>
			<input type=radio name=auto_fix_consistency value="on"$ck->{auto_fix_consistency}->{on}>@{[t_("��ư�ǽ�������")]}<BR>
			<input type=radio name=auto_fix_consistency value="off"$ck->{auto_fix_consistency}->{off}>@{[t_("��ư�ǽ������ʤ�")]}<BR>
			<font color="red">&nbsp;&nbsp;@{[t_("�������������꤬ȯ�����줿��硢��ư�ǽ������ޤ�����")]}</font>
			</TD>
		</TR>
end_tag
	}

	if (DA::Ajax::mailer_style_ok($session)) {
		$button_tag=<<end_tag;
<INPUT TYPE=submit NAME=init VALUE='@{[t_("�����")]}' onClick="return initConfirm();">
<INPUT TYPE=submit NAME=edit VALUE='@{[t_("�ߡ���")]}' onClick="return changeConfirm();">
end_tag
	} else {
		$button_tag=<<end_tag;
<INPUT TYPE=button NAME=edit VALUE='@{[t_("�Ĥ���")]}' onClick="top.window.close();">
end_tag

		$message_tag=<<end_tag;
<TABLE BORDER=0>
<TR>
  <TD>
    <font color=red>@{[t_("����᡼��(���饷�å���������)�����򤵤줿���ᡢ���̤��Ĥ��Ƥ���������")]}</font><br>
  </TD>
</TR>
</TABLE>
end_tag
	}
	#�᡼���票�����ݡ��Ȼ��η�����������
	my $mail_archive_tag;
	if($archive->{lha} || $archive->{zip} || $archive->{tar} || $archive->{mbox}) {
		my $arc_radio_tag;
		$arc_radio_tag  ="<input type=radio name=archive value=\"lha\"$ck->{archive}->{lha}>" . t_("LHA����") if ($archive->{lha});
		$arc_radio_tag .="<input type=radio name=archive value=\"zip\"$ck->{archive}->{zip}>" . t_("ZIP����") if ($archive->{zip});
		$arc_radio_tag .="<input type=radio name=archive value=\"tar\"$ck->{archive}->{tar}>" . t_("TGZ����") if ($archive->{tar});
		$arc_radio_tag .="<input type=radio name=archive value=\"mbox\"$ck->{archive}->{mbox}>" . t_("mbox����") if ($archive->{mbox});
		
		$mail_archive_tag =<<end_tag;
  <TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("�᡼���票�����ݡ��Ȼ��η���")]}</TD>
    <TD BGCOLOR=#FFFFFF NOWRAP>
$arc_radio_tag
    </TD>
  </TR>
end_tag
	}

   # Mailto:��󥯤����꥿������
   my $mail_link_tag;
   $mail_link_tag =<<end_tag;
  <TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("Mailto:��󥯤�����")]}</TD>
    <TD BGCOLOR=#FFFFFF NOWRAP>
      <INPUT TYPE=radio NAME=mailer VALUE="insuite"$ck->{mailer}->{insuite}>@{[t_("%1 �Żҥ᡼�����Ѥ���", $product)]}<BR>
      <font color=red>&nbsp;&nbsp;@{[t_("��mailto:��󥯤ǡ�%1 �Żҥ᡼�����Ѥ��ޤ���", $product)]}</font><BR>
      <INPUT TYPE=radio NAME=mailer VALUE="other"$ck->{mailer}->{other}>@{[t_("����¾�Υ᡼�顼����Ѥ���")]}<BR>
      <font color=red>&nbsp;&nbsp;@{[t_("�ʤ����ѤΥޥ���ޤ��ϥ֥饦�������ꤷ���᡼�顼����Ѥ��ޤ���")]}</font>
    </TD>
  </TR>
end_tag

   # �᡼��������ư�������
   my $mail_delete_tag;
   $mail_delete_tag =<<end_tag;
  <TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("�᡼��������ư��")]}</TD>
    <TD BGCOLOR=#FFFFFF NOWRAP>
      <input type=radio name=delete value="0"$ck->{delete}->{0}>@{[t_("����Ȣ�Υե�����ذ�ư����")]}<BR>
      <input type=radio name=delete value="1"$ck->{delete}->{1}>@{[t_("�����˺������")]}<BR>
      <font color="red">&nbsp;&nbsp;@{[t_("�ʥե��륿�¹Ի��ˤ⡢Ŭ�Ѥ���ޤ���")]}</font>
    </TD>
  </TR>
end_tag

   #ź�եե��������������ɻ��η�����������
   my $file_archive_tag;
   if($archive->{lha} || $archive->{zip} || $archive->{tar}) {
   		my $arc_file_radio_tag;
		$arc_file_radio_tag  ="<input type=radio name=archive_file value=\"lha\"$ck->{archive_file}->{lha}>" . t_("LHA����") if ($archive->{lha});
		$arc_file_radio_tag .="<input type=radio name=archive_file value=\"zip\"$ck->{archive_file}->{zip}>" . t_("ZIP����") if ($archive->{zip});
		$arc_file_radio_tag .="<input type=radio name=archive_file value=\"tar\"$ck->{archive_file}->{tar}>" . t_("TGZ����") if ($archive->{tar});
		if ($arc_file_radio_tag){
			$file_archive_tag =<<end_tag;
			<TR>
				<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("ź�եե��������������ɻ��η���")]}</TD>
				<TD BGCOLOR=#FFFFFF NOWRAP>
				$arc_file_radio_tag
				</TD>
			</TR>
end_tag
		}
   }
	
	# ���̥�������ɻ��η�����������
	my $archive_one_tag;
	if ($archive->{eml} || $archive->{mbox}) {
		my $arc_one_radio_tag;
		$arc_one_radio_tag  ="<input type=radio name=archive_one value=\"eml\"$ck->{archive_one}->{eml}>" . t_("eml����") if ($archive->{eml});
		$arc_one_radio_tag .="<input type=radio name=archive_one value=\"mbox\"$ck->{archive_one}->{mbox}>" . t_("mbox����") if ($archive->{mbox});
			
			$archive_one_tag =<<end_tag;
  <TR>
    <TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("�᡼����̥������ݡ��Ȼ��η���")]}</TD>
    <TD BGCOLOR=#FFFFFF NOWRAP>
$arc_one_radio_tag
    </TD>
  </TR>
end_tag
	}

	# �᡼�륨�����ݡ��Ȼ��Υե�����̾��������
	unless( exists($ck->{archive_name}->{on}) || exists($ck->{archive_name}->{off}) ){
		$ck->{archive_name}->{off} = " CHECKED";
	}

	my $archive_name_tag;
	my $arc_name_tag=<<end_tag; 
		<input type=radio name=archive_name value="on"$ck->{archive_name}->{on}>@{[t_("��̾����Ѥ���")]}<BR>
		<input type=radio name=archive_name value="off"$ck->{archive_name}->{off}>@{[t_("��̾����Ѥ��ʤ�")]}
end_tag

	$archive_name_tag =<<end_tag;
	<TR>
		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("�᡼�륨�����ݡ��Ȼ��Υե�����̾")]}</TD>
		<TD BGCOLOR=#FFFFFF NOWRAP>
$arc_name_tag
		</TD>
	</TR>
end_tag

	# ����������������ɽ������
	unless( exists($ck->{print_to}->{on}) || exists($ck->{print_to}->{off}) ){
		$ck->{print_to}->{on} = " CHECKED";
	}

	my $print_config_tag;
	my $pri_config_tag=<<end_tag; 
		<input type=radio name=print_to value="on"$ck->{print_to}->{on}>@{[t_("�������ɽ������")]}<BR>
		<input type=radio name=print_to value="off"$ck->{print_to}->{off}>@{[t_("�������ɽ�����ʤ�")]}
end_tag

	$print_config_tag =<<end_tag;
	<TR>
		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("�᡼�������������η���")]}</TD>
		<TD BGCOLOR=#FFFFFF NOWRAP>
$pri_config_tag
		</TD>
	</TR>
end_tag
	# ����������������ɽ������
	unless( exists($ck->{save_to_lib}->{on}) || exists($ck->{save_to_lib}->{off}) ){
		$ck->{save_to_lib}->{on} = " CHECKED";
	}

	my $save_to_lib_tag;
	my $save_to_lib_tag_detail=<<end_tag; 
		<input type=radio name=save_to_lib value="on"$ck->{save_to_lib}->{on}>@{[t_("���Ѥ���")]}<BR>
		<input type=radio name=save_to_lib value="off"$ck->{save_to_lib}->{off}>@{[t_("���Ѥ��ʤ�")]}
end_tag

	$save_to_lib_tag =<<end_tag;
	<TR>
		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("�᡼���饤�֥�����¸")]}</TD>
		<TD BGCOLOR=#FFFFFF NOWRAP>
$save_to_lib_tag_detail
		</TD>
	</TR>
end_tag
	my $selected_gid = $ck->{default_mail_account};
	my @selected_gids = keys %$selected_gid;
	# �᡼��򳫤������Υ᡼�륢������Ȥ�����
	my $option_list = &get_org_mail_list_tag($session, $selected_gids[0]);

	my $default_mail_account_tag;
	my $default_mail_account_tag_option=<<end_tag; 
	$option_list
end_tag

	$default_mail_account_tag =<<end_tag;
	<TR>
		<TD BGCOLOR=$DA::Vars::p->{title_color} NOWRAP ALIGN=right>@{[t_("�᡼���ư�����<BR>�ǥե���ȥ᡼�륢�������")]}</TD>
		<TD BGCOLOR=#FFFFFF NOWRAP>
$default_mail_account_tag_option
		</TD>
	</TR>
end_tag

#=========================================================
#     Custom
#=========================================================
DA::Custom::rewrite_ma_ajx_config_tag($session, 
                                      \$mailer_style_tag, 
                                      \$mail_link_tag, 
                                      \$mail_delete_tag, 
                                      \$mail_archive_tag, 
                                      \$archive_one_tag, 
                                      \$file_archive_tag);

	$param->{contents}=<<end_tag;
<TABLE BORDER=0 CELLSPACING=1 CELLPADDING=1 WIDTH=100% style="background:$DA::Vars::p->{base_color}">
$mailer_style_tag
$mail_link_tag
$mail_delete_tag
$auto_fix_tag
$mail_archive_tag
$archive_one_tag
$file_archive_tag
$archive_name_tag
$print_config_tag
$save_to_lib_tag
$default_mail_account_tag
</TABLE><BR>

$message_tag

<HR>
<INPUT TYPE=hidden NAME=path_side VALUE="">
$button_tag
<BR>
end_tag

	my $html_tag = DA::IS::get_tab_html($session, $param);

	my ($head, $body) = DA::IS::get_head($session, "Mailer Config");
	my $html_buf =<<buf_end;
$head
<STYLE type="text/css"><!--
    a.tab { color: black; text-decoration: none}
//--></STYLE>
<SCRIPT LANGUAGE="JavaScript"><!--
function initConfirm() {
    try {
        document.forms[0].path_side.value = $menuObj.document.URL;
    } catch(e) { }
    f = confirm('@{[t_("�Żҥ᡼���ư��������������Ƥ������Ǥ�����")]}');
    return f;
}
function changeConfirm() {
    try {
        document.forms[0].path_side.value = $menuObj.document.URL;
    } catch(e) { }
    f = confirm('@{[t_("�Żҥ᡼���ư��������ѹ����Ƥ������Ǥ�����")]}');
    return f;
}
function reloadMenu(OBJ,URL) {
    OBJ.location.href='$DA::Vars::p->{cgi_rdir}/' + URL;
}
$reload
//--></SCRIPT>
</head>
$body
<FORM METHOD=POST ACTION="$DA::Vars::p->{cgi_rdir}/ma_ajx_config.cgi">
$param->{page_title}
$html_tag
</FORM>
</BODY></HTML>
buf_end

	DA::IS::print_data($session, $html_buf);
	$session->{dbh}->disconnect();
}

sub init_proc {
	my ($session) = @_;
	my $mail = DA::IS::get_master($session, "ajxmailer");
	my $base = DA::IS::get_master($session, "base");
	my $init_mail = DA::IS::get_master($session, "ajxmailer", 1);
	my $init_base = DA::IS::get_master($session, "base", 1);
	my @mail_item = qw ( delete auto_fix_consistency archive archive_one archive_file archive_name print_to save_to_lib default_mail_account);
	my @base_item = qw ( mailer_style mailer );

	my $mailer_style = $base->{mailer_style};

	foreach my $item (@mail_item) {
		if (exists $init_mail->{$item}) {
			$mail->{$item} = $init_mail->{$item};
		} else {
			delete $mail->{$item};
		}
	}
	foreach my $item (@base_item) {
		if (exists $init_base->{$item}) {
			$base->{$item} = $init_base->{$item};
		} else {
			delete $base->{$item};
		}
	}
	if($session->{config_opener} eq 'ajax_mailer'){
		$base->{mailer_style} = $mailer_style;
	}else{
		$session->{mailer_style} = $base->{mailer_style};
		$session->{mailer} = $base->{mailer};
		DA::Session::update($session);
	}
	DA::IS::save_master($session, $mail, "ajxmailer");
	DA::IS::save_master($session, $base, "base");
}

sub set_proc {
	my($session, $query, $param) = @_;

	my $conf = DA::IS::get_master($session, "ajxmailer");
	my $base = DA::IS::get_master($session, "base");

	$conf->{delete} = $query->param('delete');
	$conf->{auto_fix_consistency} = $query->param('auto_fix_consistency');
	$conf->{archive} = $query->param('archive');
	$conf->{archive_file} = $query->param('archive_file');
	$conf->{archive_one} = $query->param('archive_one');
	$conf->{archive_name} = $query->param('archive_name');
	$conf->{print_to} = $query->param("print_to");
	$conf->{save_to_lib} = $query->param('save_to_lib');
	$conf->{default_mail_account} = $query->param('default_mail_account');
	$base->{mailer_style} = $query->param('mailer_style');
	$base->{mailer} = $query->param('mailer');

	$session->{mailer_style} = $base->{mailer_style};
	$session->{mailer} = $base->{mailer}; 
	DA::Session::update($session);

	DA::IS::save_master($session, $conf, "ajxmailer");
	DA::IS::save_master($session, $base, "base");
}

sub get_org_mail_list_tag {
	my($session, $selected_gid) = @_;
	my $g_tag;
	my $group_table=DA::IS::get_group_table($session);
	my $g_sql="SELECT g.name,m.mail_name FROM $group_table g,is_org_mail_group m "
	 . "WHERE g.gid=m.gid AND g.gid=?";
	my $g_sth=$session->{dbh}->prepare($g_sql); 
	my $permit=DA::OrgMail::get_org_mail_permit($session,0);
	my $name;
	$name = $session->{name}.t_(" - �᡼��");
	if(!$selected_gid || $selected_gid eq $session->{user}){
		$g_tag.="<option value='AjaxMailer' selected=true>$name</option>";
	} else {
		$g_tag.="<option value=$session->{user}>$name</option>";
	}
	foreach my $id (sort { $permit->{auth}->{$a} cmp $permit->{auth}->{$b} }
								keys %{$permit->{auth}}) {

		$name=$permit->{auth}->{$id};
		if ($name eq 1) {
			$g_sth->bind_param(1, int($id), 3); $g_sth->execute();
			my ($group_name,$mail_name)=$g_sth->fetchrow;
			if ($mail_name eq '') { $mail_name=$group_name; }
			$name=$mail_name;
		}

		$name=DA::CGIdef::encode($name,1,1,'euc');
		my $sel='selected=true' if ($id eq $selected_gid);
		$name.= t_(" - �ȿ��᡼��");
		$g_tag.="<option value=$id $sel>$name</option>";
	}
	$g_sth->finish;

	#if (!$g_tag || !$permit->{auth}->{$gid}) {
	#    DA::CGIdef::errorpage($session,
	#        t_('%1�δ����桼���ǤϤ���ޤ���',t_('�ȿ��᡼��%(org_mail)')));
	#}
	return "<select name=default_mail_account>".$g_tag."</select>";
}
1;
