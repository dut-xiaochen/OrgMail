#!/usr/local/bin/perl
###################################################
##  INSUITE(R)Enterprise Version 1.2.0.          ##
##  Copyright(C)2001,2002 DreamArts Corporation. ##
##  All rights to INSUITE routines reserved.     ##
###################################################
BEGIN {
	use DA::Init();
	use DA::Admin();
	use DA::Address();
	use DA::Gettext;
}
use strict;
my $r = shift;
&main($r);
Apache::exit();

sub main{
my ($r) = @_;

my $session={};
DA::Session::get_dir($session,$r);
my $query=Apache::Request->new($r,TEMP_DIR=>"$session->{temp_dir}");

DA::IS::admin_check($session,1);

my @except = qw(name kana alpha);
foreach my $l (@{DA::IS::get_lang_list($session)}) {
	push(@except, $l->{code}."_name");
} 
my @params = $query->param;
foreach my $key (@params) {
    push(@except, $key) if $key =~ /sr_/;
}

DA::Valid::check_param_except($session, $query, \@except);

DA::MasterManager::set_sel_msid($session, $query->param('msid'));
my $msid = DA::MasterManager::get_select_msid($session);
unless (DA::MasterManager::view_permit($session)) {
	DA::CGIdef::errorpage($session, DA::MasterManager::VIEW_ERROR_MSG);
}

# 世代情報テーブルの生成
my ($generation_html_header, $generation_html_footer);
$generation_html_header = DA::MasterManager::get_generation_html_header($session, $msid, "group_list.cgi");
$generation_html_footer = DA::MasterManager::get_generation_html_footer($session, $msid);

my $num				= $query->param('num');
my $view			= $query->param('view');
my $sort			= $query->param('sort');
my $sort_key		= $query->param('sort_key');
my $page			= $query->param('page');
my $add				= $query->param('add');
my $edit			= $query->param('edit');
my $proc			= $query->param('proc');
my $usersel			= $query->param('usersel');
my $s_usersel		= $query->param('s_usersel');
my $p_usersel		= $query->param('p_usersel');
my $po_usersel		= $query->param('po_usersel');
my $so_usersel		= $query->param('so_usersel');
my $u_usersel		= $query->param('u_usersel');
my $ua_usersel		= $query->param('ua_usersel');
my $add_submit		= $query->param('add_submit');
my $edit_submit		= $query->param('edit_submit');
my $del_confirm		= $query->param('del_confirm');
my $suspend_confirm	= $query->param('suspend_confirm');
my $del_submit		= $query->param('del_submit');
my $suspend_submit  = $query->param('suspend_submit');
my $restore			= $query->param('restore');
my $restore_confirm = $query->param('restore_confirm');
my $restore_all		= $query->param('restore_all');

my $del				= $query->param('del');
my $del_suspend_confirm		= $query->param('del_suspend_confirm');
my $del_all_suspend_confirm	= $query->param('del_all_suspend_confirm');

my $db_data;
if($add || ($proc eq 'add' && ($query->param('usersel') ||
                               $query->param('s_usersel') ||
                               $query->param('p_usersel') ||
                               $query->param('po_usersel') ||
                               $query->param('so_usersel') ||
                               $query->param('u_usersel') ||
                               $query->param('ua_usersel') ||
                               $query->param('del_target')))){
    &edit_proc($session,$query,'add');
}elsif($edit || ($proc eq 'edit' && ($query->param('usersel') ||
                                     $query->param('s_usersel') ||
                                     $query->param('p_usersel') ||
                                     $query->param('po_usersel') ||
                                     $query->param('so_usersel') ||
                                     $query->param('u_usersel') ||
                                     $query->param('ua_usersel') ||
                                     $query->param('del_target')))){
    &edit_proc($session,$query,'edit');
}elsif($add_submit){
    $db_data = &edit_submit($session,$query,'add');
    DA::System::file_unlink("$session->{temp_dir}/$session->{sid}\.group_list\.$num\.dat");
}elsif($edit_submit){
    $db_data = &edit_submit($session,$query,'edit');
    DA::System::file_unlink("$session->{temp_dir}/$session->{sid}\.group_list\.$num\.dat");
}elsif($del_confirm){
    &del_confirm($session,$query);
}elsif($suspend_confirm){
    &suspend_confirm($session,$query);
}elsif($restore_confirm){
    &restore_confirm($session,$query);
}elsif($del_submit){
    &del_submit($session,$query);
    DA::System::file_unlink("$session->{temp_dir}/$session->{sid}\.group_list\.$num\.dat");
}elsif($suspend_submit){
    &suspend_submit($session,$query);
}elsif($restore) {
	&restore_submit($session,$query);
}elsif($restore_all) {
	&restore_submit($session,$query,{'all'=>1});
}elsif($del) {
	&del_proc($session, $query);
}elsif($del_suspend_confirm || $del_all_suspend_confirm){
    &del_suspend_confirm($session,$query);
}
DA::Session::admin_all_unlock($session);

if(!$view){
    $view = "tree";
    DA::System::file_unlink("$session->{temp_dir}/$session->{sid}\.open_tree");
    DA::System::file_unlink("$session->{temp_dir}/$session->{sid}\.open_folder");
}
my $tab={};
$tab->{image}="$session->{img_rdir}/func_title_grouplist.gif";
$tab->{title}=t_('グループ一覧');
$tab->{tabs}=6;
$tab->{name1}=t_("階層表示");
$tab->{href1}="<a href=\"$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?"
             ."msid=@{[enc_($msid)]}\" class=\"tab\">";
$tab->{name2}=t_("組織一覧");
$tab->{href2}="<a href=\"$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?"
             ."view=group&msid=@{[enc_($msid)]}\" class=\"tab\">";
$tab->{name3}=t_("プロジェクト一覧");
$tab->{href3}="<a href=\"$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?"
             ."view=project&msid=@{[enc_($msid)]}\" class=\"tab\">";
$tab->{name4}=t_("役職グループ一覧");
$tab->{href4}="<a href=\"$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?"
             ."view=executive&msid=@{[enc_($msid)]}\" class=\"tab\">";
$tab->{name5}=t_("廃止グループ一覧");
$tab->{href5}="<a href=\"$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?"
             ."view=suspend&msid=@{[enc_($msid)]}\" class=\"tab\">";
$tab->{name6}=t_("グループ検索");
$tab->{href6}="<a href=\"$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?"
             ."view=search&msid=@{[enc_($msid)]}&init=1\" class=\"tab\">";

my($list,$script,%sel,$type,$suspend_rows);
if($view eq 'group'){
    $type = '1';
    $list = &group_list($session,$query,$type,$db_data);
    $tab->{tab_on}=2;
}elsif($view eq 'project'){
    $type = '2';
    $list = &group_list($session,$query,$type,$db_data);
    $tab->{tab_on}=3;
}elsif($view eq 'executive'){
    $type = '3';
    $list = &group_list($session,$query,$type,$db_data);
    $tab->{tab_on}=4;
}elsif($view eq 'suspend'){
    $type = '4';
    $list = &group_list($session,$query,$type,$db_data);
    $tab->{tab_on}=5;
}elsif($view eq 'search'){
    $type = '5';
    $tab->{tab_on}=6;
    &group_search($session,$query,$view,$tab,$generation_html_header,$generation_html_footer);
}else{
    $tab->{tab_on}=1;
    &group_tree($session,$query,$view,$tab,$generation_html_header,$generation_html_footer);
}
$sel{$view}="selected";

my $page_title=DA::IS::get_title_navi($session,$tab);
my($head,$body,$nocache_foot)=DA::IS::get_head($session,t_("グループ一覧"),'','no',1);
my $prefix = DA::IS::get_uri_prefix();

my $outbuf=<<end_tag;
$head
<link rel="stylesheet" type="text/css" href="$DA::Vars::p->{css_rdir}/adminsite_style.css?$prefix"/>
<STYLE type="text/css"><!--
	BODY, TD { color: black; }
	a.tab { color: black; text-decoration: none}
	.blk {color: black}
	.adrsel { color: black; font-weight: bold }
//--></STYLE>
</head>
$body
end_tag

my ($add_button, $del_button, $return_btn, $disable_msg);
if ($view eq 'suspend') {
	$del_button = "<INPUT TYPE=submit NAME=del VALUE=\"".t_('削　除')."\">";
} elsif ($view ne 'executive' || !DA::IS::is_limited_admin($session)) {
	$add_button = "<INPUT TYPE=submit NAME=add VALUE=\"".t_('追　加')."\">";
}

if($disable_msg){
	$disable_msg ="<br/><font color=\"red\">$disable_msg</font>";
}

if (!DA::MasterManager::is_active($session, $msid, "")) {
	my $return_url="$DA::Vars::p->{ad_cgi_rdir}/generation_detail.cgi?msid=$msid";
	$return_btn="<input type=\"button\" value=\"@{[t_('世代詳細へ')]}\" onClick=\"location.href='$return_url'\">"
}

my $html_buf =<<buf_end;
$outbuf
$generation_html_header
$page_title
$list
$generation_html_footer
<HR>
$return_btn
$add_button
$del_button
$disable_msg
</FORM>
</BODY>
<SCRIPT LANGUAGE="javascript">
var onChanging = 0;
function ChangeSelect() {
    if (onChanging == 0) {
        onChanging = 1;
        document.forms[0].submit();
    }
}
</SCRIPT>
</HTML>
buf_end

DA::MasterManager::unset_sel_msid($session);

DA::IS::print_data($session,$html_buf);
$session->{dbh}->disconnect();

}

sub group_list {
    my($session,$query,$type,$db_data)=@_;
	my $msid = DA::MasterManager::get_select_msid($session);

	my $p=DA::Address::read_data($query);
	if ($p->{target} eq '') {
		$p->{target}=$query->param('add_target');
	}
	if ($p->{target} eq '') {
		$p->{target}=22;
	}

	if (ref($db_data) eq 'HASH') {
		set_location_target($p, $db_data);
	}

	$p->{prop}=0;
	$p->{cgi}="$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi";

	DA::Address::get_default_param($session, $p);
	my $buf=DA::Address::navi_proc($session, $p, $query);

	# 言語選択を非表示
	unless (DA::MultiLang::master_ok()) {
		$buf->{select_navi} = undef;
	}
my $list.=<<buf_end;
<FORM METHOD=POST NAME=Form1 ACTION="$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi" style="margin:0px;padding:0px;">
<INPUT TYPE=hidden NAME=target VALUE="$p->{target}">
<INPUT TYPE=hidden NAME=charNum VALUE="$p->{charNum}">
<INPUT TYPE=hidden NAME=sort VALUE="$p->{sort}">
<INPUT TYPE=hidden NAME=page VALUE="$p->{page}">
<INPUT TYPE=hidden NAME=type VALUE="$type">
<INPUT TYPE=hidden NAME=view VALUE="$p->{view}">
<INPUT TYPE=hidden NAME=msid VALUE="@{[enc_($msid)]}">
<table border="0" cellspacing="0" cellpadding="0" width="100%"><tr>
    <td background="$session->{img_rdir}/waku_br_t_bg.gif" width="2"><img src="$session->{img_rdir}/waku_br_tl.gif" height="3" width="2"></td>
    <td background="$session->{img_rdir}/waku_br_t_bg.gif"><img src="$session->{img_rdir}/null.gif" width="3" height="3"></td>
    <td background="$session->{img_rdir}/waku_br_t_bg.gif"><img src="$session->{img_rdir}/null.gif" width="1" height="3"></td>
    <td background="$session->{img_rdir}/waku_br_t_bg.gif"><img src="$session->{img_rdir}/null.gif" width="3" height="3"></td>
    <td valign="bottom" width="4"><img src="$session->{img_rdir}/waku_br_tr.gif" width="4" height="3"></td>
</tr><tr>
    <td background="$session->{img_rdir}/waku_br_l_bg.gif"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td>
    <td bgcolor="FEFFF0"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td>
    <td bgcolor="FEFFF0">
    <!-- Start select_navi -->
    $buf->{select_navi}
    <!-- Start sub_navi -->
    $buf->{sub_navi}
    <!-- Start char_navi -->
    $buf->{char_navi}
    <!-- Start list_table -->
    $buf->{list_table}
    <!-- Start page_navi -->
    $buf->{page_navi}
    </td>
    <td bgcolor="FEFFF0"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td>
    <td background="$session->{img_rdir}/waku_br_r_bg.gif"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td>
</tr><tr>
    <td background="$session->{img_rdir}/waku_br_b_bg.gif" height="2"><img src="$session->{img_rdir}/waku_br_bl.gif" width="2" height="2"></td>
    <td colspan="3" background="$session->{img_rdir}/waku_br_b_bg.gif"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td>
    <td><img src="$session->{img_rdir}/waku_br_br.gif" width="4" height="2"></td>
</tr></table>
buf_end

	return $list;
}

sub group_search{
    my($session,$query,$view,$tab,$generation_html_header,$generation_html_footer) = @_;

    my $p = {};
    my $msid = DA::MasterManager::get_select_msid($session);
    my $target=[
        { 'key'=>'name',     'title'=>t_("名前"),          'size'=>20,     'data_type'=>1 },
        { 'key'=>'owner',    'title'=>t_("オーナー"),      'size'=>20,     'data_type'=>1 }
    ];
    my $file= 'is_group.dat';
    my $cf = DA::Config::Control::Form->new(
        file        =>  $file,
        base_dir    =>  $DA::Vars::p->{ctl_dir},
        user_id     =>  $session->{user});
    my $order = 2;
    foreach my $section (@{$cf->all_section}) {
        my %data;
        next if $cf->get_param($section, 'disable');
        next if $cf->get_param($section, 'invisible');
        next if ($cf->get_param($section, 'form_type') eq 'submit');
        next if ($section !~ /text|opt|check|textarea/);

        $data{'key'}    = $section;
        $data{'title'}  = $cf->get_param($section, 'title');
        $data{'size'}   = 20;
        $data{'order'}  = $order;

        if ($section =~ /check/) {
            $data{'data_type'}  = 1; # style="ime-mode: active"
        } else {                
            $data{'data_type'}  = $cf->get_param($section, 'data_type');
        }

        if ($section =~ /^opt/) {
            $data{'data_list'} = $cf->get_param($section, 'data_list');
        }
        push(@{$target}, \%data);
        $order++;

        # ▼ 拡張検索カラム
        # -------------------------------------------------------------
        push(@{$p->{extra_search}}, $section);
    }
    $p->{msid}      = $msid;
    $p->{columns}   = $target;
    $p->{view_lang} = $query->param("view_lang");
    $p->{view_lang} = DA::IS::get_user_lang($session) unless $p->{view_lang};
    $p->{sr_type}   = $query->param("sr_type") || "OR";
    $p->{sort}      = $query->param("sort");
    $p->{cgi}       = "$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi";
    $p->{view}      = "search";
    $p->{gid_type}  = 0;
    $p->{prop}      = 0;

    # ソート順
    $p->{sort} = "0:0" unless $p->{sort};
    ($p->{m_sort}, $p->{s_sort}) = split(/:/, $p->{sort}); 

    # ページの行数
    my $base = DA::IS::get_master($session, 'base');
    $p->{max}       = ($base->{list_row}) ? $base->{list_row} : 20;

    # ページ
    $p->{page}      = $query->param("page");
    if ($p->{page} eq '') { $p->{page} = "1:1"; }
    ($p->{m_page}, $p->{s_page}) = split(/:/, $p->{page});

    DA::Address::_get_search_param($session,$p,$target,$query);

    my $search_db = 1;
    if ($query->param('init')){
        &clean_search_condition($session,$p);
        $search_db = 0;
    } elsif ($query->param("sr")) {
        $p->{page} = "1:1";
        ($p->{m_page}, $p->{s_page}) = split(/:/, $p->{page});
        &save_search_condition($session,$p);
    } else{
        &restore_search_condition($session,$p);
    }

    my $input_html;
    my $t;
    my $af = DA::Action::Form->new(
                formctl     => $cf,
                dbh         => $session->{dbh});
    foreach my $val (@{$target}) {
        my $sr_key="sr_".$val->{key};
        my $title = DA::CGIdef::encode($val->{title}, 0, 1, 'euc');
        my $value = $p->{$sr_key};
        $t->{$val->{key}} 
            = "<td align=right nowrap valign=center>$title&nbsp;</td><td nowrap>";
        if ($val->{key} =~ /^(?:address_ext1.|opt.|member_opt)/) {
            my $tag = DA::HTML::Tag->new;
            $t->{$val->{key}} .= $tag->select(
                        name    => $sr_key,
                        value   => $value,
                        list    => $val->{data_list},
                        require => 0);
        } elsif ($val->{key} =~ /^(?:check.)/) {
            my $tag = DA::HTML::Tag->new(af => $af);
            my $check_tag   = $tag->make($val->{key}, $value);
            $check_tag =~ s/($val->{key})/sr_$1/g;
            $t->{$val->{key}} .= $check_tag;
        } else {
            my $tag = DA::HTML::Tag->new;
            $t->{$val->{key}} .= $tag->text(
                                        $sr_key,
                                        $value,
                                        40,
                                        $val->{data_type});
        }
        $t->{$val->{key}} .= "</td>";
    }
    $t->{null}="<td>&nbsp;</td><td>&nbsp;</td>";
    $t->{btn}.="<td align=right><a href=\"javascript:Search();\">".
        "<img id=searchBtn src=\"$session->{img_rdir}/aqbtn_search_addr.gif\" ".
        "width=\"45\" height=\"17\" border=0 title=\"".t_("検索")."\"></a></td>";
    $t->{line} ="<td colspan=2 background=\"$session->{img_rdir}/line_brdotted.gif\" width=100%>";
    $t->{line}.="<img src=\"$session->{img_rdir}/null.gif\" width=\"1\" height=\"1\"></td>";

    my %chk;
    $chk{$p->{sr_type}} = "checked";

    my $input_tag1  = "<input type=radio name=sr_type value=OR $chk{OR}>";
    my $string1     = "上記のいずれかのキーワードに一致する。";
    my $id1         = "or";
    my $output_tag1 = DA::IS::label_click_add_id($input_tag1,$id1);
    my $label1      = DA::IS::label_click_enclose(t_("$string1"),$id1);
    my $input_tag2  = "<input type=radio name=sr_type value=AND $chk{AND}>";
    my $string2     = "上記の全てのキーワードに一致する。";
    my $id2         = "and";
    my $output_tag2 = DA::IS::label_click_add_id($input_tag2,$id2);
    my $label2      = DA::IS::label_click_enclose(t_("$string2"),$id2);
    $t->{check}.=     
    "<table border=0 cellspacing=0 cellpadding=0>".
            "<tr><td nowrap>".
            "$output_tag1".
    "</td>".
    "<td>".
    "$label1".
            "</td>".
            "<td width=20>&nbsp;</td>".
            "<td nowrap>".
    "$output_tag2".
            "</td>".
            "<td>".
    "$label2".
            "</td>".
            "<td width=20>&nbsp;</td>$t->{btn}</tr><tr>".
            "<td>&nbsp;</td><td colspan=5>".
            "<br>".t_("キーワードはスペースで区切って入力してください。").
            "</td></table>";

    $input_html.="<table border=0 cellspacing=0 cellpadding=0 width=100%>";
    $input_html.=
        "<tr><td colspan=2>".
        "<table border=0>".
        "<tr>$t->{name}$t->{owner}</tr>";
    my $cnt = 1;
    my $extra_key;
    my @extra = qw(text opt check textarea);
    foreach my $name (@extra) {
        foreach my $i (0..9) {
            my $key = $name.sprintf("%02d", $i);
            if ($t->{$key}) {
                $extra_key.=$t->{$key};
                $cnt++;
                $extra_key.="</tr>\n<tr>" if ($cnt%2);
            }
        }
    }
    $input_html.="<tr>$extra_key</tr>" if $cnt > 1;
    $input_html.="</table></td></tr>".
        "<tr>$t->{line}</tr>".
        "</table>".
        "$t->{check}";

	$input_html.=qq{
		<table border="0" cellspacing="0" cellpadding="0" width="100%">
		<tr><td bgcolor="#A5A69C"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td></tr>
		<tr><td><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td></tr>
		<tr><td bgcolor="#A5A69C"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td></tr>
		</table>
	};

    my $table_html ;
    my $row_num = -1;
    if($search_db) {
        my %c;
        my $sql_param = [];
        my $sql_where;
        my $mode = "$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?view=search&msid=@{[enc_($msid)]}&init=1";
        if(!&has_param($p)){
            DA::CGIdef::errorpage($session, t_("いずれかの検索条件を入力してください。"), $mode);
        }
        $sql_where = " (";
        # name
        if ($p->{sr_name} ne '')  {
            my @sr_column;
            if (DA::MultiLang::master_ok()) {
                @sr_column = qw(g.kana g.alpha g.c_name g.l_name);
            } else {
                @sr_column = qw(g.kana g.name g.alpha);
            }
            $sql_where .= DA::Address::set_search_param(
                            $sql_param,
                            $p->{sr_name},
                            $p->{sr_type},
                            \@sr_column);
        }

        # owner
        if ($p->{sr_owner} ne '')  {
            my @sr_column;
            if (DA::MultiLang::master_ok()) {
                @sr_column = qw(
                    m.kana m.alpha
                    m.last_kana m.middle_kana m.first_kana
                    m.last_alpha m.middle_alpha m.first_alpha
                    m.c_last_name m.c_middle_name m.c_first_name m.c_name
                    m.l_last_name m.l_middle_name m.l_first_name m.l_name
                );
            } else {
                @sr_column = qw(m.kana m.name m.alpha);
            }
            $sql_where .= DA::Address::set_search_param(
                            $sql_param,
                            $p->{sr_owner},
                            $p->{sr_type},
                            \@sr_column);
        }
        # other
        if (ref($p->{extra_search}) eq 'ARRAY') {
            foreach my $c (@{$p->{extra_search}}) {
                my $key = "sr\_$c";
                # multi key words
                if (ref($p->{$key}) eq 'ARRAY') {
                    if (scalar(@{$p->{$key}})>1) {
                        $sql_where .= DA::Address::set_search_param($sql_param,$p->{$key},$p->{sr_type},["$c"],'e');
                    }
                } else {
                    if ($p->{$key} ne '') {
                        $sql_where .= DA::Address::set_search_param(
                                            $sql_param,
                                            $p->{$key},
                                            $p->{sr_type},
                                            ["$c"],
                                            'e');
                    }
                }
            }
        }
        $sql_where =~ s/($p->{sr_type})+$//;
        $sql_where .= ") AND";
        
        # 管理者権限グループ : g.type = 9
        # プライマリーオーナー : gm.attr = 3
        $sql_where .= " g.type<>9 AND gm.attr = 3 ";

        my $sql_order;
        my ($col_member_kana, $col_group_kana);
        $col_member_kana    = ($DA::Vars::p->{ORDER}) ? "upper(m.kana)" : "m.kana";
        $col_group_kana     = ($DA::Vars::p->{ORDER}) ? "upper(g.kana)" : "g.kana";
        
        if ($p->{m_sort} eq '0') {
            $sql_order = "ORDER BY $col_group_kana";
        } elsif ($p->{m_sort} eq '1') {
            $sql_order = "ORDER BY $col_group_kana DESC";
        } elsif ($p->{m_sort} eq '2') {
            $sql_order = "ORDER BY $col_member_kana";
        } elsif ($p->{m_sort} eq '3') {
            $sql_order = "ORDER BY $col_member_kana DESC";
        } elsif ($p->{m_sort} eq '4') {
            $sql_order = "ORDER BY g.type,g.sort_level,upper(g.kana) ";
        }

        my $lang = $p->{view_lang};
        my $member_table=DA::IS::get_member_table($session, $lang);
        my $group_table =DA::IS::get_group_table($session, $lang);
        my $iv_group_ext = DA::IS::get_lang_view($session, $lang, "group_ext");
        my $gm_table = DA::IS::get_master_table($session, "is_group_member");

        my %c;
        $c{gname} = "g.name as gname, g.alpha as galpha";
        $c{parent_name} = "g.parent_name, g.parent_alpha";
        $c{owner} = "m.name as owner,m.alpha as owner_alpha";

        my ($sql, $sth);
        if ( $DA::Vars::p->{POSTGRES} ) {
            $sql .= "SELECT ".
                " g.kana, m.kana, g.gid, $c{gname}, g.type, g.org_type, ".
                " g.parent, $c{parent_name}, $c{owner}, m.email as omail, ".
                " m.mid, m.type as otype ". 
                " FROM (( $group_table g left join $iv_group_ext e on g.gid=e.gid) ".
                " inner join $gm_table gm on g.gid=gm.gid) ".
                " inner join $member_table m on gm.mid=m.mid ".
                " WHERE $sql_where ".
                " $sql_order";
        } else {
            $sql .= "SELECT ".
                " g.kana, m.kana, g.gid, $c{gname}, g.type, g.org_type, ".
                " g.parent, $c{parent_name}, $c{owner}, m.email as omail, ".
                " m.mid, m.type as otype ". 
                " FROM $gm_table gm, $member_table m, $group_table g, $iv_group_ext e  ".
                " WHERE $sql_where AND g.gid=e.gid(+) AND g.gid=gm.gid AND gm.mid=m.mid  ".
                " $sql_order";
        }

        # #####################################
        #           Custom
        # ######################################
        DA::Custom::rewrite_group_list_search_sql( $session, $p, $sql_where, $sql_order, \$sql );

        eval {
            $row_num = 0;
            DA::DeBug::sql_log($sql, $0) if $DA::Vars::p->{SQL_LOG};
            $sth = $session->{dbh}->prepare($sql);
            DA::Address::bind_params($sth, $sql_param);
            $sth->execute;
        };
        if ($@) {
            Carp::carp $@;
            DA::CGIdef::errorpage($session,
                t_("データの抽出に失敗しました。%1ユーザ検索の検索条件が多い場合は検索条件を減らしてから実行してみてください。%1検索条件が少ない場合もしくは検索以外でエラーが発生する場合はシステム管理者にお問合せください。", "<br>"), $mode);
        }

        my %row;
        my (@list);
        $sth->bind_columns( \( @row{ @{$sth->{NAME_lc} } } ));

        my $begin = (int($p->{m_page})-1) * int($p->{max});
        my $end = $begin + int($p->{max});
        my $final = $end + ($p->{max}*10);
        my $count=0;

        while ($sth->fetch) {
			if (!DA::IS::is_ctrlable_group($session,$row{gid})) { next; }
            if ($count <= $final) {
                $count++;
            }
            $row_num++;
            if ($count <= $begin){next;}
            if ($count > $final) {next;}

            if (($count >= $begin) && ($count <= $end)) {
                # 多言語マスタ対応
                $row{gname}         = DA::IS::check_view_name($session, $row{gname}, $row{galpha});
                $row{parent_name}   = DA::IS::check_view_name($session, $row{parent_name}, $row{parent_alpha});
                $row{owner}         = DA::IS::check_view_name($session, $row{owner}, $row{owner_alpha});

                my %col;
                $col{gid} = $row{gid};
                $col{mid} = $row{mid};
                $col{type} = $row{type};
                $col{org_type} = $row{org_type};
                $col{gname} = $row{gname}; $col{gname} =~ s/\s+$//;
                $col{owner} = $row{owner}; $col{owner} =~ s/\s+$//;
                $col{parent} = $row{parent};
                $col{parent} = 0 if $col{type} == 3;
                $col{parent_name} = $row{parent_name}; 
                $col{parent_name} =~ s/\s+$//;
                $col{omail} = $row{omail}; $col{omail} =~ s/\s+$//;
                $col{otype} = $row{otype};

                foreach my $name (@{$p->{visible}}) {
                    if (exists ($row{$name})) {
                        $col{$name} = $row{$name};
                        $col{$name} =~ s/\s+$//;                    
                    }
                }
                push(@list, \%col);
            }
        }

        $sth->finish;

        $p->{final_page} = int($count/$p->{max});
        $p->{final_page}++ if ($count%$p->{max});

        if($row_num == 0){
            $table_html = "<tr><td><b>".t_("検索条件に該当するデータはありません。")."</b></td></tr>";
        }else{
            $p->{target} = "22" ;
            $table_html = DA::Address::get_group_table($session, \@list, $p);
        }
    }

    my $paginator = DA::Address::get_page_navi($session,$p,$row_num,"");

    my ($head,$body,$nocache_foot) = DA::IS::get_head($session,t_("グループ検索"),'','no',1);
    my $prefix = DA::IS::get_uri_prefix();
    my $freeze=DA::IS::get_freeze_class($session);
    my $page_title = DA::IS::get_title_navi($session,$tab);

my $html_buf =<<buf_end;
$head
<STYLE type="text/css"><!--
    BODY, TD { color: black; }
    a.tab { color: black; text-decoration: none}
//--></STYLE>
<link rel="stylesheet" type="text/css" href="$DA::Vars::p->{css_rdir}/adminsite_style.css?$prefix"/>
$freeze->{style}
$freeze->{script}
<SCRIPT LANGUAGE="javascript"><!--
function Search() {
    try {
        var outerPane = document.getElementById('FreezePane');
        if (outerPane) FreezeScreen('@{[t_('世代詳細へ')]}');
        document.forms[0].sr.value="1";
        document.forms[0].submit();
    } catch(e) { }
}
//--></SCRIPT>
</head>
$body
$freeze->{div}
$generation_html_header
$page_title

<FORM METHOD=POST ACTION="$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi" style="margin:0px;padding:0px;">
<INPUT TYPE=hidden NAME=msid VALUE="@{[enc_($msid)]}">
<INPUT TYPE=hidden NAME=sr VALUE="">
<INPUT TYPE=hidden NAME=view VALUE="search">
<INPUT TYPE=hidden NAME=sort VALUE='$p->{sort}'>
<INPUT TYPE=hidden NAME=page VALUE='$p->{page}'>
<table border="0" cellspacing="0" cellpadding="0" width="100%"><tr> 
    <td background="$session->{img_rdir}/waku_br_t_bg.gif" width="2"><img src="$session->{img_rdir}/waku_br_tl.gif" height="3" width="2"></td>
    <td background="$session->{img_rdir}/waku_br_t_bg.gif"><img src="$session->{img_rdir}/null.gif" width="3" height="3"></td>
    <td background="$session->{img_rdir}/waku_br_t_bg.gif"><img src="$session->{img_rdir}/null.gif" width="1" height="3"></td>
    <td background="$session->{img_rdir}/waku_br_t_bg.gif"><img src="$session->{img_rdir}/null.gif" width="3" height="3"></td>
    <td valign="bottom" width="4"><img src="$session->{img_rdir}/waku_br_tr.gif" width="4" height="3"></td>
</tr><tr> 
    <td background="$session->{img_rdir}/waku_br_l_bg.gif"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td>
    <td bgcolor="FEFFF0"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td>
    <td bgcolor="FEFFF0">
    $input_html
    <!-- Start list_table -->
    <table border=0 cellspacing=0 cellpadding=0 width=100%>
    $table_html
    </table>
    <!-- Start page_navi -->
    $paginator
    </td>
    <td bgcolor="FEFFF0"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td>
    <td background="$session->{img_rdir}/waku_br_r_bg.gif"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td>
</tr><tr> 
    <td background="$session->{img_rdir}/waku_br_b_bg.gif" height="2"><img src="$session->{img_rdir}/waku_br_bl.gif" width="2" height="2"></td>
    <td colspan="3" background="$session->{img_rdir}/waku_br_b_bg.gif"><img src="$session->{img_rdir}/null.gif" width="1" height="1"></td>
    <td><img src="$session->{img_rdir}/waku_br_br.gif" width="4" height="2"></td>
</tr></table>
</FORM>
</body>
$nocache_foot
</html>
buf_end

    DA::MasterManager::unset_sel_msid($session);

    DA::IS::print_data($session,$html_buf);
    $session->{dbh}->disconnect();
    Apache::exit();
}

sub group_tree {
    my($session,$query,$view,$tab,$generation_html_header,$generation_html_footer) = @_;

    my $target = $query->param('target');
    my $point  = $query->param('point');
	my $view_lang	= $query->param('view_lang');
	my $msid = DA::MasterManager::get_select_msid($session);
	unless ($view_lang) {
		$view_lang = DA::IS::get_user_lang($session);
	}

    if(!$point || $point !~ /^\d+$/){ $point = 0; }
    my $scroll = "window.scrollTo(0,$point);";
       $scroll .= "\nwindow.scrollTo(0,$point);";

    my ($dummy, $struct)=DA::IS::get_group_struct($session,$DA::Vars::p->{top_gid},undef,{'lang' => $view_lang});

	# ▽ 開いているフォルダの保存先	
    my $open_file ="$session->{temp_dir}/$session->{sid}\.open_folder";

    # ▽ ファイルからの読込み
    $struct->retrieve_open($open_file);

    # ▽ ファルダの開閉
    my $target = $query->param('target');
    $struct->switch($target);

    # ▽ 開いているフォルダの保存
    $struct->store_open($open_file);

    my $hidden_gid={};
    my $disp_gid={};
    my $disp_flag;
    #=====================================================
    #           ----custom----
    #=====================================================
    DA::Custom::admin_hidden_group($session,$hidden_gid,$disp_gid,\$disp_flag);

    # ▼ htmlの作成
    # -------------------------------------------------------------------------
    # ▽ コンフィグレーション
	my $join_gid = DA::IS::get_join_group($session, $session->{user});
    my $conf = {
        html_maker	=>	\&html_maker,			# html作成用1
        img_dir		=>	$session->{img_rdir}, 	# imagesのディレクトリ
		user_lang  	=>	$view_lang,
		msid        =>  $msid,
		top			=>	$DA::Vars::p->{top_gid},
        session     =>  $session,
		use_custom	=>  DA::Group::Ext->use_custom(), 
        hidden_gid  => $hidden_gid,
        disp_gid    => $disp_gid,
        disp_flag   => $disp_flag,
        limited_admin => DA::IS::is_limited_admin($session),
        ctrlable_gid  => DA::IS::get_ctrlable_group_all($session,$join_gid,$session->{user},1)
    };

    # ▽ htmlツリーの作成
	DA::IS::set_temp_lang($session, $view_lang);
    my $tree_tag = $struct->make_html($conf);
	DA::IS::clear_temp_lang($session);	

	my $page_title = DA::IS::get_title_navi($session,$tab);
	my ($head,$body,$nocache_foot) = DA::IS::get_head($session,t_("グループ一覧"),'','no',1);
	my $prefix = DA::IS::get_uri_prefix();

my $outbuf=<<end_tag;
$head
<link rel="stylesheet" type="text/css" href="$DA::Vars::p->{css_rdir}/adminsite_style.css?$prefix"/>
<STYLE type="text/css"><!--
    BODY, TD { color: black; }
    a.tab { color: black; text-decoration: none}
//--></STYLE>
<SCRIPT LANGUAGE="JavaScript"><!--
function treeSubmit(target){
    var _bro=(document.all?3:(document.getElementById?1:(document.layers?2:0)));
    if(_bro == 1 || _bro == 2){
        document.forms[0].point.value = window.pageYOffset;
    }else{
        document.forms[0].point.value = document.body.scrollTop;
    }
    document.forms[0].target.value = target;
    document.forms[0].submit();
}
var onChanging = 0;
function ChangeSelect() {
	if (onChanging == 0) {
		onChanging = 1;
		document.forms[0].submit();
	}
}
//--></SCRIPT>
</head>
$body
end_tag

my $targetv = DA::MasterManager::is_active($session, $msid,"");
my $return_button = <<buf_end if (!$targetv);
<input type="button" value="@{[t_('世代詳細へ')]}" onClick="location.href='$DA::Vars::p->{ad_cgi_rdir}/generation_detail.cgi?msid=$msid'">
buf_end

my $html_buf =<<buf_end;
$outbuf
$generation_html_header
$page_title

<FORM METHOD=POST ACTION="$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi" style="margin:0px;padding:0px;">
<INPUT TYPE=hidden NAME=view VALUE=tree>
<input type=hidden name=target value=''>
<input type=hidden name=point value=''>
@{[DA::Address::_get_lang_type_tag($session, {'view_lang' => $view_lang})]}
<INPUT TYPE=hidden NAME=msid VALUE="@{[enc_($msid)]}">
</FORM>

$tree_tag

<HR>
$generation_html_footer

<FORM METHOD=POST ACTION="$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi" style="margin:0px;padding:0px;">
<TABLE BORDER=0><TR><TD>
<INPUT TYPE=hidden NAME=view VALUE=tree>
<INPUT TYPE=hidden NAME=proc VALUE=add>
<INPUT TYPE=hidden NAME=add VALUE=add>
<INPUT TYPE=hidden NAME=view_lang VALUE=$view_lang>
$return_button
<INPUT TYPE=submit NAME=add_g VALUE="@{[t_('組織追加')]}">
<INPUT TYPE=submit NAME=add_p VALUE="@{[t_('プロジェクト追加')]}">
<INPUT TYPE=hidden NAME=msid VALUE="@{[enc_($msid)]}">
</TD></TR></TABLE>
</FORM>
</body>
<script language="JavaScript"><!--
$scroll
//--></script>
$nocache_foot
</html>
buf_end

	DA::MasterManager::unset_sel_msid($session);

	DA::IS::print_data($session,$html_buf);
	$session->{dbh}->disconnect();
	Apache::exit();
}

sub edit_proc{
    my($session,$query,$proc)=@_;
	my $num       = $query->param('num');
    my $edit      = $query->param('edit');
    my $view      = $query->param('view');
	my $view_lang = $query->param('view_lang');
	my $msid      = DA::MasterManager::get_select_msid($session);
    my $type      = $query->param('type');
    my $org_type  = $query->param('org_type');
    my $sort      = $query->param('sort');
    my $page      = $query->param('page');
    my $charNum   = $query->param('charNum');
    my $target;
    if($query->param('add_target')){
        $target = $query->param('add_target');
    }else{
        $target = $query->param('target');
    }
    if($query->param('add_g')){$type = '1';}
    elsif($query->param('add_p')){$type = '2';}
    elsif($query->param('add_t')){$type = '3';}
    my $gid = &check_gid($query->param('gid'));
    my $t_name = $query->param('name');
       $t_name = DA::CGIdef::encode($t_name,1,1);
    my $t_kana = $query->param('kana');
       $t_kana = DA::CGIdef::encode($t_kana,1,1);
    my $t_alpha = $query->param('alpha');
       $t_alpha = DA::CGIdef::encode($t_alpha,1,1);
    my $group_join = $query->param('group_join');
    my $permit = $query->param('permit');

	if ($gid && !DA::IS::is_ctrlable_group($session,$gid)) {
        DA::CGIdef::errorpage($session, t_('管理権限がありません。'));
    }
    my $pgid = $query->param('parent');
	if ($pgid && !DA::IS::is_ctrlable_group($session,$pgid)) {
        DA::CGIdef::errorpage($session, t_('管理権限がありません。'));
    }
	if ($edit eq 'back') {
		DA::Session::admin_all_unlock($session);
	}
	
	my $lang_list	= DA::Group::query2lang_data($session, $query, $gid);
	my $multi_data	= DA::Group::lang_data2multi_data($session, $lang_list); 

	my($popup_tag,$hid_tag);
	my $block={};
	if(!$query->param('usersel') && !$query->param('s_usersel') &&
   		!$query->param('p_usersel') && !$query->param('so_usersel') &&
   		!$query->param('po_usersel') && !$query->param('del_target') &&
   		!$query->param('u_usersel') && !$query->param('ua_usersel') &&
    	$edit ne 'back'){
    	if (!$num) {
        	$num = DA::IS::get_count($session, "group_list", 1);
    	}
    	$block->{PARAM}->{target}= 'USERSEL';
    	$block->{PARAM}->{gid}   =$gid;
    	$block->{PARAM}->{type}  =$type;
    	$block->{PARAM}->{org_type}  =$org_type;
    	$block->{PARAM}->{cgi}   ="$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi";
    	$block->{PARAM}->{cgi}  .="?num=$num&proc=$proc&view=$view&gid=$gid&sort=$sort";
    	$block->{PARAM}->{cgi}  .="&page=$page&charNum=$charNum&add_target=$target&msid=$msid";
    	$block->{PARAM}->{check} ="group_list.$num";
    	$block->{PARAM}->{future} = 1;
    	if($proc eq 'edit'){
        	my $data = DA::IS::get_group_member_data($session,$gid,'123456');
        	my $superior_data = DA::IS::get_group_superior_data($session, $gid);
        	%{$block->{USERSEL}}=ref($data->{USERSEL}) eq 'HASH' ? %{$data->{USERSEL}} : ();
        	%{$block->{S_USERSEL}}=ref($data->{S_USERSEL}) eq 'HASH' ? %{$data->{S_USERSEL}} : ();
        	%{$block->{PO_USERSEL}}=ref($data->{PO_USERSEL}) eq 'HASH' ? %{$data->{PO_USERSEL}} : ();
        	%{$block->{SO_USERSEL}}=ref($data->{SO_USERSEL}) eq 'HASH' ? %{$data->{SO_USERSEL}} : ();
        	%{$block->{U_USERSEL}}=ref($superior_data->{U_USERSEL}) eq 'HASH' ? %{$superior_data->{U_USERSEL}} : ();
        	%{$block->{UA_USERSEL}}=ref($superior_data->{UA_USERSEL}) eq 'HASH' ? %{$superior_data->{UA_USERSEL}} : ();
        	%{$block->{SOWNER_AUTH}}=ref($data->{SOWNER_AUTH}) eq 'HASH' ? %{$data->{SOWNER_AUTH}} : ();
        	%{$block->{SOWNER_TYPE}}=ref($data->{SOWNER_AUTH}) eq 'HASH' ? %{$data->{SOWNER_TYPE}} : ();
        	my($sql,$sth);
        	if($gid == $DA::Vars::p->{top_gid}){
            	$sql="SELECT name,kana,alpha FROM @{[DA::IS::get_group_table($session)]} WHERE gid=?";
            	$sth=$session->{dbh}->prepare($sql);
				$sth->bind_param(1,$gid,3); $sth->execute();
            	my($gname,$gkana,$galpha)=$sth->fetchrow;
            	$sth->finish;
            	$gname=~s/\s+$//g; $gkana=~s/\s+$//g;
            	$block->{PARAM}->{name}= DA::CGIdef::encode($gname,1,1,'euc');
            	$block->{PARAM}->{kana}= DA::CGIdef::encode($gkana,1,1,'euc');
            	$block->{PARAM}->{alpha}= DA::CGIdef::encode($galpha,1,1,'euc');
            	$block->{PARAM}->{sort_level}= 0;
        	}elsif($gid == $DA::Vars::p->{temp_gid}){
            	$block->{PARAM}->{name}= $DA::Vars::p->{title}->{suspend};
        	}else{
            	$sql ="SELECT name,kana,alpha,parent,type,group_join,permit,"
                 	."parent_name,parent_alpha,sort_level,org_type "
                 	."FROM @{[DA::IS::get_group_table($session, 'TBL')]} WHERE gid=?";
            	$sth=$session->{dbh}->prepare($sql);
				$sth->bind_param(1,$gid,3); $sth->execute();
            	my($gname,$gkana,$galpha,$parent,$type,$join,$per,$pname,$palpha,$sort_level,$org_type)=$sth->fetchrow;
            	$sth->finish;
            	$gname=~s/\s+$//g; $gkana=~s/\s+$//g; $pname=~s/\s+$//g;
            	$join=~s/\s+$//g;
            	$block->{PARAM}->{name}= DA::CGIdef::encode($gname,1,1,'euc');
            	$block->{PARAM}->{kana}= DA::CGIdef::encode($gkana,1,1,'euc');
            	$block->{PARAM}->{alpha}= DA::CGIdef::encode($galpha,1,1,'euc');
            	$block->{PARAM}->{group_join}= $join;
            	$block->{PARAM}->{permit}= $per;
				my $p_name = DA::IS::get_ug_name($session, 1, $parent);
           		$block->{PARENT}->{$parent}= "000001:$parent:".$p_name->{usel};
				$block->{PARAM}->{cur_parent} = "$parent:".$p_name->{usel}; 
            	$block->{PARAM}->{sort_level} = $sort_level;
            	$block->{PARAM}->{org_type} = $org_type;

				# 下位組織の有無
				my $groups = DA::Admin::get_group_lowers($session, $gid);
				if (ref($groups) eq 'ARRAY' && scalar(@{$groups})>1) {
					$block->{PARAM}->{has_child} = 1;
				}
        	}

        	my $lang_list = DA::IS::get_lang_list($session);
        	foreach my $l (@{$lang_list}) {
				my $group_tbl = DA::IS::get_master_table($session, "is_group_".$l->{code});
            	my $sql="SELECT name, parent_name FROM $group_tbl WHERE gid=?";
            	my $sth=$session->{dbh}->prepare($sql); $sth->execute($gid);
            	my $data=$sth->fetchrow_hashref('NAME_lc'); $sth->finish;

            	foreach my $key (keys %{$data}) {
                	$data->{$key}=~s/\s+$//g;
                	$block->{PARAM}->{$l->{code}."_".$key} = DA::CGIdef::encode($data->{$key},2,1,'euc');
            	}
        	}
    	}else{
        	my $sql="SELECT name,alpha FROM @{[DA::IS::get_member_table($session)]} WHERE mid=?";
        	my $sth=$session->{dbh}->prepare($sql);
			   $sth->bind_param(1,$DA::Vars::p->{insuite_mid},3); $sth->execute();
        	my($name,$alpha)=$sth->fetchrow; $sth->finish;
			$name =~s/\s+$//; 
        	$name=DA::IS::check_view_name($session,$name,$alpha);
        	$block->{PO_USERSEL}->{$DA::Vars::p->{insuite_mid}}="1:$DA::Vars::p->{insuite_mid}:5:$name";
        	if($block->{PARAM}->{type} eq '1' || $block->{PARAM}->{type} eq '2') { 
            	my $pgid = $DA::Vars::p->{top_gid};
            	if($query->param('parent')){
                	$pgid = $query->param('parent');
            	} else {
                	if (DA::IS::is_limited_admin($session)) {
                    	my @c = DA::IS::get_ctrlable_group($session);
                    	$pgid = $c[0];
                	}
            	}

            	$sql="SELECT name,alpha FROM @{[DA::IS::get_group_table($session)]} WHERE gid=?";
            	$sth=$session->{dbh}->prepare($sql);
		    	$sth->bind_param(1,$pgid,3); $sth->execute();
            	my($gname,$galpha)=$sth->fetchrow; $sth->finish;
				$gname=~s/\s+$//g;
            	$gname=DA::IS::check_view_name($session,$gname,$galpha);

            	$block->{PARENT}->{$pgid} = "1:$pgid:G:$gname";
            	$block->{PARAM}->{group_join}= '2';
            	$block->{PARAM}->{permit}= '1';
        	}
        	$block->{PARAM}->{sort_level} = 10;
    	}
    	DA::System::file_unlink("$session->{temp_dir}/$session->{sid}\.group_list\.$num\.tmp");
    	DA::IS::set_data_parse($session,$block,"group_list.$num");
	}elsif($query->param('usersel') eq 'end'){
    	$block = DA::IS::get_data_parse($session,"group_list.$num");
    	my $sel_temp = "$session->{sid}\.group_list\.$num\.tmp";
    	my $sel_list = DA::IS::get_sort_temp($session,$sel_temp);

		# セカンダリオーナー設定画面をオープンした状態で他のユーザ選択画面をオープンした場合
		# $s_target が上書きされるため、ポップアップから返されるキーを優先させるように修正
		my $s_target;
		if ($query->param('target') eq 'SO_USERSEL') {
			$s_target = 'SO_USERSEL';
		} else {
    		$s_target = $block->{PARAM}->{target};
		}
    	if(DA::Unicode::file_exist("$session->{temp_dir}/$session->{sid}\.group_list\.$num\.tmp")){
        	$block->{$s_target} = $sel_list;
    	}
    	if($s_target eq 'PO_USERSEL' || $s_target eq 'SO_USERSEL'){
        	my $primary;
        	foreach my $key (keys %{$block->{PO_USERSEL}}){$primary=$key};
        	if($primary){ delete $block->{SO_USERSEL}->{$primary}; }
    	}else{
        	foreach my $key (keys %{$block->{USERSEL}}){
            	if(!$key){ next; }
               	delete $block->{S_USERSEL}->{$key};
               	delete $block->{A_USERSEL}->{$key};
        	}
        	foreach my $key (keys %{$block->{A_USERSEL}}){
            	if(!$key){ next; }
               	delete $block->{S_USERSEL}->{$key};
        	}
    	}
    	if($s_target eq 'PO_USERSEL' && (ref($block->{PO_USERSEL}) ne 'HASH' || !%{$block->{PO_USERSEL}})){
        	my $sql="SELECT name,alpha FROM @{[DA::IS::get_member_table($session)]} WHERE mid=?";
        	my $sth=$session->{dbh}->prepare($sql);
			   $sth->bind_param(1,$DA::Vars::p->{insuite_mid},3); $sth->execute();
        	my ($name,$alpha)=$sth->fetchrow; $sth->finish;
			$name =~s/\s+$//;
        	$name=DA::IS::check_view_name($session,$name,$alpha);
        	$block->{PO_USERSEL}->{$DA::Vars::p->{insuite_mid}}="1:$DA::Vars::p->{insuite_mid}:5:$name";
    	}
    	DA::IS::set_data_parse($session,$block,"group_list.$num");
    	DA::System::file_unlink("$session->{temp_dir}/$session->{sid}\.group_list\.$num\.tmp");
	}elsif($query->param('usersel') eq 'cancel' || $edit eq 'back'){
    	$block = DA::IS::get_data_parse($session,"group_list.$num");
	}elsif($query->param('del_target')){
    	$block = DA::IS::get_data_parse($session,"group_list.$num");
    	$block->{PARAM}->{name}   = $t_name;
    	$block->{PARAM}->{kana}   = $t_kana;
    	$block->{PARAM}->{alpha}  = $t_alpha;
    	$block->{PARAM}->{group_join}= $group_join;
    	$block->{PARAM}->{permit} = $permit;
    	$block->{PARAM}->{sort_level} = $query->param('sort_level');
    	$block->{PARAM}->{future} = $query->param('future') ? 1 : 0;
		if (DA::MultiLang::master_ok()) {
			foreach my $key (keys %{$multi_data}) {
				$block->{PARAM}->{$key} = $multi_data->{$key};
			}
		}
    	&del_target($session,$query,$block);
    	DA::IS::set_data_parse($session,$block,"group_list.$num");
	}elsif($query->param('so_usersel')){
    	$block = DA::IS::get_data_parse($session,"group_list.$num");
    	$block->{PARAM}->{name}   = $t_name;
    	$block->{PARAM}->{kana}   = $t_kana;
    	$block->{PARAM}->{alpha}  = $t_alpha;
    	$block->{PARAM}->{group_join}= $group_join;
    	$block->{PARAM}->{permit} = $permit;
    	$block->{PARAM}->{sort_level} = $query->param('sort_level');
    	$block->{PARAM}->{target} = 'SO_USERSEL';
    	$block->{PARAM}->{mode} = 1;
    	$block->{PARAM}->{multi} = 1;
    	$block->{PARAM}->{sort} = 1;
    	$block->{PARAM}->{top_name} = 1;
	
		if (DA::MultiLang::master_ok()) {	
			foreach my $key (keys %{$multi_data}) {
				$block->{PARAM}->{$key} = $multi_data->{$key};
			}
		}
    	$block->{PARAM}->{u_type} = 0;
    	$block->{PARAM}->{sort_level} = $query->param('sort_level');
    	$block->{PARAM}->{limited_admin} = DA::IS::is_limited_admin($session);
		$block->{PARAM}->{msid} = $msid;
		$block->{PARAM}->{future} = $query->param('future') ? 1 : 0;
    	DA::IS::set_data_parse($session,$block,"group_list.$num");
    	# $popup_tag="Pop('owner_sub.cgi','pop_title_s_owner.gif',650,500);\n";
		my $pop_url="$DA::Vars::p->{cgi_rdir}/pop_up.cgi?proc=owner_sub.cgi&title=pop_title_s_owner.gif";
    	$popup_tag ="selwin=window.open(setUrl('$pop_url'),'GroupPopup','width=650,height=500,resizable=1');\n";
    	$popup_tag.="selwin.focus()";

    	my $base_block = {}; %$base_block = %$block;
    	if($type eq '1'){
        	$base_block->{AUTH_PARAM}->{auth_type}=$DA::Vars::p->{auth_type1};
    	}elsif($type eq '2'){
        	$base_block->{AUTH_PARAM}->{auth_type}=$DA::Vars::p->{auth_type2};
    	}else{
        	$base_block->{AUTH_PARAM}->{auth_type}=$DA::Vars::p->{auth_type2};
    	}
    	$base_block->{AUTH_PARAM}->{cgi}="$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?num=$num";
    	$base_block->{AUTH_PARAM}->{base}="group_list.$num";
    	$base_block->{AUTH_PARAM}->{msid}=$msid;
    	DA::IS::set_data_parse($session,$base_block,"owner_sub");
	}else{
    	$block = DA::IS::get_data_parse($session,"group_list.$num");
    	$block->{PARAM}->{name}   = $t_name;
    	$block->{PARAM}->{kana}   = $t_kana;
    	$block->{PARAM}->{alpha}  = $t_alpha;
    	$block->{PARAM}->{group_join}= $group_join;
    	$block->{PARAM}->{permit} = $permit;
    	$block->{PARAM}->{future} = $query->param('future') ? 1 : 0;
	
		if (DA::MultiLang::master_ok()) {
			foreach my $key (keys %{$multi_data}) {
				$block->{PARAM}->{$key} = $multi_data->{$key};
			}
		}
	
    	my($s_target,$mode,$multi,$rest,$u_type,$suspend,$self_sel);
    	if($query->param('usersel')){
       		if($block->{PARAM}->{type} eq '1'){
           		$s_target = 'A_USERSEL';
           		$mode='4';
       		}else{
           		$s_target = 'USERSEL';
           		$mode='4';
           		if($block->{PARAM}->{type} eq '2'){
               		$mode='9';
           		}
       		}
       		$multi = '1'; $u_type = "1:1";
    	}elsif($query->param('s_usersel')){
       		$s_target = 'S_USERSEL'; $mode = '4'; $multi = '1';
       		$u_type = "1:1";
    	}elsif($query->param('p_usersel')){
			if ($block->{PARAM}->{type} ne '4') {
				$suspend = 1;
			}
       		$s_target = 'PARENT'; $mode = '2'; $multi = ''; $rest='9';
    	}elsif($query->param('po_usersel')){
       		$s_target = 'PO_USERSEL'; $mode = '4'; $multi = '';
    	}elsif($query->param('so_usersel')){
       		$s_target = 'SO_USERSEL'; $mode = '4'; $multi = '1';
		# 上長
    	}elsif ($query->param('U_USERSEL')) {
			# ユーザのみ、複数選択可能、ファイル共有限定とログイン不能を選択可能
			$s_target = 'U_USERSEL'; $mode = '1'; $multi = '1';
			$u_type = "1:1"; $self_sel = '1';
		# 上長代行
    	}elsif ($query->param('UA_USERSEL')) {
			# ユーザのみ、複数選択可能、ファイル共有限定とログイン不能を選択可能
			$s_target = 'UA_USERSEL'; $mode = '1'; $multi = '1';
			$u_type = "1:1"; $self_sel = '1';
		}
    	$block->{PARAM}->{target} = $s_target;
    	$block->{PARAM}->{mode} = $mode;
    	$block->{PARAM}->{multi} = $multi;
    	$block->{PARAM}->{rest} = $rest;
    	$block->{PARAM}->{sort} = 1;
    	$block->{PARAM}->{top_name} = 1;
    	$block->{PARAM}->{u_type} = $u_type;
    	$block->{PARAM}->{suspend} = $suspend;
    	$block->{PARAM}->{self_sel} = $self_sel;
    	$block->{PARAM}->{sort_level} = $query->param('sort_level');
	
    	$block->{PARAM}->{limited_admin} = DA::IS::is_limited_admin($session);
		$block->{PARAM}->{msid} = $msid;
	
    	DA::IS::set_data_parse($session,$block,"group_list.$num");
    	$popup_tag =DA::IS::get_popup("$DA::Vars::p->{cgi_rdir}/usersel.cgi?file=group_list.$num",'','GroupPopup',0,1);
	}

    my($p_user,$s_user,$p_owner,$s_owner,$btn_tag,$has_newline,$edit_locked);
    my($project_tag,%join_sel,%permit_sel,$proc_tag,$proc_gif, $gen_chk_tag);

	my $group_type;
	if ($block->{PARAM}->{type} eq '4') {
		$group_type = $block->{PARAM}->{org_type};
	} else {
		$group_type = $block->{PARAM}->{type};
	}
    if($group_type eq '1'){
        $proc_tag = t_("組織"); $proc_gif="a.gif";
    }elsif($group_type eq '2'){
        $proc_tag = t_("プロジェクト"); $proc_gif="b.gif";
    }else{
        $proc_tag = t_("役職グループ"); $proc_gif="b.gif";
    }
    my $page_title;
    $btn_tag="<INPUT TYPE=button VALUE=\"@{[t_('戻　る')]}\" onClick="
            ."\"location.href='$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi"
            ."?view=$view&target=$target&sort=$sort&page=$page"
            ."&charNum=$charNum&view_lang=$view_lang&msid=$msid';\">\n";
    my $btn_mes;
	my $gen_chk_tag = "";
	my $disable_msg ="";
    if($proc eq 'add'){
        if($block->{PARAM}->{type} eq '1'){
            $page_title=DA::CGIdef::get_page_title($session,'func_title_addorg.gif',undef,'','off',t_('組織追加'));
        }elsif($block->{PARAM}->{type} eq '2'){
            $page_title=DA::CGIdef::get_page_title($session,'func_title_addproject.gif',undef,'','off',t_('プロジェクト追加'));
        }else{
            $page_title=DA::CGIdef::get_page_title($session,'func_title_addgroupex.gif',undef,'','off',t_('役職グループ追加'));
        }
        if($btn_mes=DA::Session::check_maintenance_admin($session)){
            $btn_mes="<br /><br /><font color=red>$btn_mes</font>";
            $has_newline=1;
			$edit_locked=1;
        }elsif($btn_mes=DA::Session::check_lock_admin($session)){
            $btn_mes="<br /><br /><font color=red>$btn_mes</font>";
            $has_newline=1;
			$edit_locked=1;
        }else{
           	$btn_mes="<INPUT TYPE=submit NAME=add_submit "
			."VALUE=\"@{[t_('設　定')]}\" onClick=\"addConfirm();return f;\">\n";
			$gen_chk_tag  = DA::MasterManager::get_future_chk_html($session, $gid, $block->{PARAM}->{future});
		}
    }else{
        DA::Admin::group_lock($session,$block->{PARAM}->{gid});
        if($block->{PARAM}->{type} eq '1'){
            $page_title=DA::CGIdef::get_page_title($session,'func_title_editorg.gif',undef,'','off',t_('組織編集'));
		}elsif($block->{PARAM}->{type} eq '4'){
			if($block->{PARAM}->{org_type} eq '3'){
				$page_title=DA::CGIdef::get_page_title($session,'func_title_editgroupex.gif',undef,'','off',t_('役職グループ編集'));
			}elsif($block->{PARAM}->{org_type} eq '2'){
            	$page_title=DA::CGIdef::get_page_title($session,'func_title_editproject.gif',undef,'','off',t_('プロジェクト編集'));
			}else{
				$page_title=DA::CGIdef::get_page_title($session,'func_title_editorg.gif',undef,'','off',t_('組織編集'));
			}
        }elsif($block->{PARAM}->{type} eq '2'){
            $page_title=DA::CGIdef::get_page_title($session,'func_title_editproject.gif',undef,'','off',t_('プロジェクト編集'));
        }else{
            $page_title=DA::CGIdef::get_page_title($session,'func_title_editgroupex.gif',undef,'','off',t_('役職グループ編集'));
        }
        if($btn_mes=DA::Session::check_maintenance_admin($session)){
            $btn_mes="<br /><br /><font color=red>$btn_mes</font>";
            $has_newline=1;
			$edit_locked=1;
        }elsif($btn_mes=DA::Session::check_lock_admin($session)){
            $btn_mes="<br /><br /><font color=red>$btn_mes</font>";
            $has_newline=1;
			$edit_locked=1;
        }else{
			$gen_chk_tag = DA::MasterManager::get_future_chk_html($session, $gid, $block->{PARAM}->{future}, undef, { type_check =>1 } );
			$btn_mes="<INPUT TYPE=submit NAME=edit_submit VALUE=\"@{[t_('更　新')]}\" onClick=\"changeConfirm();return f;\">\n";

			if($gid ne $DA::Vars::p->{top_gid} ){
                my $escape_name=$block->{PARAM}->{name};
                my $user_lang=DA::IS::get_user_lang($session);
                if ($block->{PARAM}->{"$user_lang\_name"}){
                    $escape_name=$block->{PARAM}->{"$user_lang\_name"};
                }
			    $escape_name=~s/\\/\\\\/g; $escape_name=~s/'/\\'/g;

				my $undel = DA::MasterManager::check_delete_id($session, $gid, $msid);
				unless ($undel) {
					&get_group_member_list($session, $gid, $block->{PARAM}->{org_type}, \$undel);
				}
				if ($undel) {
					$disable_msg .= "<BR>$undel";
				} else {
					$btn_mes.="<INPUT TYPE=submit NAME=del_confirm "
					."VALUE=\"@{[t_('削　除')]}\" onClick=\"deleteConfirm('$escape_name');return f;\">\n";
				}
				if ($block->{PARAM}->{type} eq '4') {
					my ($gid,$type,$name) = split(/\:/, $block->{PARAM}->{cur_parent}); 
					if ($type !~ /^S/) {
						$btn_mes.="<INPUT TYPE=submit NAME=restore "
						."VALUE=\"@{[t_('復　帰')]}\" onClick=\"restoreConfirm('$escape_name');return f;\">\n";
						if (($block->{PARAM}->{org_type} eq '1') && 
							($block->{PARAM}->{has_child})) {
							$btn_mes.="<INPUT TYPE=submit NAME=restore_confirm "
							."VALUE=\"@{[t_('下位も復帰')]}\" onClick=\"restoreAllConfirm('$escape_name');return f;\">\n";
						}
					}
				} else {
					$btn_mes.="<INPUT TYPE=submit NAME=suspend_confirm "
					."VALUE=\"@{[t_('廃　止')]}\" onClick=\"suspendConfirm('$escape_name');return f;\">\n";
				}

			}
        }
    }
	
	if( $disable_msg ){
		$btn_mes .="<br /><font color=red>$disable_msg</font>";
		$has_newline = 1;
   	}

    $btn_tag.=$btn_mes;
    my $custom_check=DA::IS::get_sys_custom($session,'custom_check',1);
    my($group_tag);
    foreach my $s_target(keys %$block){
        if($s_target eq 'PARAM'){next;}
        if($s_target eq 'SO_USERSEL'){
            my $del_target;
            if ($block->{PARAM}->{type} ne '4' || $custom_check->{temp_group_user_del}) {$del_target='so_user';}
            $group_tag->{SO_USERSEL}=DA::IS::get_view_user_sort_so($session,$block->{SO_USERSEL},$block->{SOWNER_AUTH},$block->{SOWNER_TYPE},$del_target);
        }elsif($s_target eq 'S_USERSEL'){
            my $del_target;
            if ($block->{PARAM}->{type} ne '4' || $custom_check->{temp_group_user_del}) {$del_target='s_user';}
            $group_tag->{$s_target}=DA::IS::get_view_user_sort($session,$block->{$s_target},1,0,$del_target);
        }elsif($s_target eq 'A_USERSEL'){
            my $del_target;
            if ($block->{PARAM}->{type} ne '4') {$del_target='a_user';}
            $group_tag->{$s_target}=DA::IS::get_view_user_sort($session,$block->{$s_target},1,0,$del_target);
        }elsif($s_target eq 'USERSEL'){
            my $del_target;
            if (($block->{PARAM}->{type} ne '4' || $custom_check->{temp_group_user_del}) &&
                $block->{PARAM}->{type} ne '1' && $block->{PARAM}->{org_type} ne '1') {$del_target='user';}
            $group_tag->{$s_target}=DA::IS::get_view_user_sort($session,$block->{$s_target},1,0,$del_target);
        }elsif($s_target eq 'U_USERSEL') {
            my $del_target;
            if ($block->{PARAM}->{type} ne '4' || $custom_check->{temp_group_user_del}) {$del_target='u_user';}
            $group_tag->{$s_target}=DA::IS::get_view_user_sort($session,$block->{$s_target},1,0,$del_target);
        }elsif($s_target eq 'UA_USERSEL') {
            my $del_target;
            if ($block->{PARAM}->{type} ne '4' || $custom_check->{temp_group_user_del}) {$del_target='ua_user';}
            $group_tag->{$s_target}=DA::IS::get_view_user_sort($session,$block->{$s_target},1,0,$del_target);
        }elsif($s_target =~/(USERSEL|S_USERSEL|PO_USERSEL|A_USERSEL|PARENT)/){
            $group_tag->{$s_target}=DA::IS::get_view_user_sort($session,$block->{$s_target},1);
        }
    }

    if(!$group_tag->{PARENT}){$group_tag->{PARENT}="<TR><TD>&nbsp;</TD></TR>";}
    if(!$group_tag->{S_USERSEL}){$group_tag->{S_USERSEL}="<TR><TD>&nbsp;</TD></TR>";}
    if(!$group_tag->{PO_USERSEL}){$group_tag->{PO_USERSEL}="<TR><TD>&nbsp;</TD></TR>";}
    if(!$group_tag->{SO_USERSEL}){$group_tag->{SO_USERSEL}="<TR><TD>&nbsp;</TD></TR>";}
    if(!$group_tag->{A_USERSEL} && !$group_tag->{USERSEL}){ $group_tag->{USERSEL}="<TR><TD>&nbsp;</TD></TR>"; }
    if(!$group_tag->{U_USERSEL}){$group_tag->{U_USERSEL}="<TR><TD>&nbsp;</TD></TR>";}
    if(!$group_tag->{UA_USERSEL}){$group_tag->{UA_USERSEL}="<TR><TD>&nbsp;</TD></TR>";}

    my($detail_tag,$parent_tag,$sec_owner_tag,$member_tag,$msg);
	if ($block->{PARAM}->{type} eq '4'){
		$detail_tag=get_detail_suspend($session,$proc_tag,$block,$group_tag);
	} else {
    	if($gid == $DA::Vars::p->{top_gid}){
			$hid_tag=qq{
				<INPUT TYPE=hidden NAME=name VALUE="$block->{PARAM}->{name}">
				<INPUT TYPE=hidden NAME=kana VALUE="$block->{PARAM}->{kana}">
				<INPUT TYPE=hidden NAME=alpha VALUE="$block->{PARAM}->{alpha}">
			};
        	$detail_tag=get_detail_top($session,$proc_tag,$block,$group_tag);
    	}elsif($block->{PARAM}->{type} eq '2'){
        	$detail_tag=get_detail_project($session,$proc_tag,$block,$group_tag);
    	}elsif($block->{PARAM}->{type} eq '3'){
        	$detail_tag=get_detail_title($session,$proc_tag,$block,$group_tag);
    	}else{
        	$detail_tag=get_detail_group($session,$proc_tag,$block,$group_tag);
    	}
	}

	if ($block->{PARAM}->{type} eq '4'){
    	my $name;
        if($block->{PARAM}->{org_type} eq '3'){
			$name = DA::Address::get_default_title('title');
		} elsif ($block->{PARAM}->{org_type} eq '2'){
			$name = DA::Address::get_default_title('project');
		} else {
			$name = DA::Address::get_default_title('org');
		}
        $msg="<font color=red>".
            t_("この%1は【%2】%1です。<br>削除を実行するとこの%1に登録されているデータも全て削除されます。", $name, t_("廃止"))."<br>".
			t_("親組織が%1組織の場合は復帰を行うことはできません。", t_("廃止")).
            "</font>";
	} else {
    	if ($block->{PARAM}->{type} eq '1'){
        	$msg.=t_("プライマリオーナーが未設定の場合、自動的にシステム管理者をオーナーに設定します。")."<br>";
        	if($proc eq 'edit'){
            	$msg.=t_("プライマリ所属ユーザの設定は、ユーザの追加のみ行なえます。")."<br>("
				.t_("設定Popupウィンドウには、追加するユーザのみ表示されます。").")<br>"
				.t_("既に設定されているプライマリ所属ユーザを変更する場合は、変更先の組織、またはユーザ設定から行なってください。");
        	}
    	} elsif ($block->{PARAM}->{type} eq '2'){
        	$msg=t_("プライマリオーナーが未設定の場合、自動的にシステム管理者をオーナーに設定します。")."<br>"
			.t_("所属ユーザ・グループには、ユーザ・組織・役職グループを指定できます。")."<br>"
			.t_("所属ユーザ・グループに組織を指定した場合、指定した組織とその下位の全組織に所属するユーザが対象となります。");
    	}else{
        	$msg=t_("プライマリオーナーが未設定の場合、自動的にシステム管理者をオーナーに設定します。");
    	}
	}

	if ($block->{PARAM}->{type} ne '4') {
		$msg.="<br>".t_('セカンダリオーナーにグループを指定した場合は、そのグループに所属する全ユーザ（組織の場合は下位組織のユーザも含む）に権限が付与されます。');
	}

	# 未来世代の場合の警告メッセージ
	if ( !$edit_locked && DA::MasterManager::is_new_or_ready($session ,$msid ) ){
		$btn_tag .= "<br /><font color=\"red\">" . DA::MasterManager::FUTURE_WARN() . "</font>";
	}

my($head,$body,$nocache_foot)=DA::IS::get_head($session,"group_list.$num",'','',1);
my $outbuf=<<end_tag;
$head
<link rel="stylesheet" type="text/css" href="$DA::Vars::p->{css_rdir}/adminsite_style.css?@{[DA::IS::get_uri_prefix()]}"/>
<SCRIPT LANGUAGE="JavaScript"><!--
var submitFlag = false;
var confirmFlag = true;
var gen_msgs = new Array(
    "@{[t_('【未来世代】の')]}",
    "@{[t_('【未来、現在世代】の')]}"
);
var is_active = @{[DA::MasterManager::is_active($session, $msid)]};
function msgPrefix(){
	if (is_active) {
		if ( document.forms[0].future && document.forms[0].future[0].checked ) {
			return  gen_msgs[1];
		} else {
        	return "";
		}
	}
	return gen_msgs[0];
}
function setSubmitFlag() {
	if (submitFlag == true) {
		return false;
	} else {
		submitFlag = true;
		return true;
	}
}
function addConfirm(){
	if (setSubmitFlag()||!confirmFlag) {
		f = confirm( msgPrefix() + "@{[t_('%1を追加してもよろしいですか？',$proc_tag)]}");
		confirmFlag = f;
	} else {
		f = false;
	}
	return f;
}
function changeConfirm(){
	if (setSubmitFlag()||!confirmFlag) {
		f = confirm( msgPrefix() + "@{[t_('%1の設定を変更してもよろしいですか？',$proc_tag)]}");
		confirmFlag = f;
	} else {
		f = false;
	}
	return f;
}
function deleteConfirm(name){
	var mes = "@{[t_('%1（" + name + "）を削除してもよろしいですか？',$proc_tag)]}";
	if (is_active) {
		if (@{[DA::MasterManager::check_future_id($session, $block->{PARAM}->{gid})]}) {
			mes = gen_msgs[1]+mes;
		}
	} else {
		mes = gen_msgs[0]+mes;
	}
	if (setSubmitFlag()||!confirmFlag) {
		f = confirm(mes);
		confirmFlag = f;
	} else {
		f = false;
	}
	return f;
}
function suspendConfirm(name){
	var mes = msgPrefix() + "@{[t_('%1（" + name + "）を廃止してもよろしいですか？',$proc_tag)]}";
	if (setSubmitFlag()||!confirmFlag) {
		f = confirm(mes);
		confirmFlag = f;
	} else {
		f = false;
	}
	return f;
}
function restoreConfirm(name){
	var mes = msgPrefix() + "@{[t_('%1（" + name + "）を復帰してもよろしいですか？',$proc_tag)]}";
	if (setSubmitFlag()||!confirmFlag) {
		f = confirm(mes);
		confirmFlag = f;
	} else {
		f = false;
	}
	return f;
}
function restoreAllConfirm(name){
	var mes = msgPrefix() + "@{[t_('%1（" + name + "）を復帰（下位組織も含む)してもよろしいですか？',$proc_tag)]}";
	if (setSubmitFlag()||!confirmFlag) {
		f = confirm(mes);
		confirmFlag = f;
	} else {
		f = false;
	}
	return f;
}
$popup_tag
//--></SCRIPT>
</head>
$body
end_tag

my $tab_html = DA::MasterManager::get_generation_html_tab($session, $msid);
my $html_buf =<<buf_end;
$outbuf
$tab_html
$page_title
<FORM METHOD=POST ACTION="$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi" style="margin:0px;padding:0px;">
<INPUT TYPE=hidden NAME=num VALUE="@{[DA::CGIdef::encode($num, 1, 1)]}">
<INPUT TYPE=hidden NAME=proc VALUE="$proc">
<INPUT TYPE=hidden NAME=gid VALUE="$block->{PARAM}->{gid}">
<INPUT TYPE=hidden NAME=view VALUE="$view">
<INPUT TYPE=hidden NAME=type VALUE="$block->{PARAM}->{type}">
<INPUT TYPE=hidden NAME=org_type VALUE="$block->{PARAM}->{org_type}">
<INPUT TYPE=hidden NAME=charNum VALUE="$charNum">
<INPUT TYPE=hidden NAME=add_target VALUE="$target">
<INPUT TYPE=hidden NAME=view_lang VALUE="$view_lang">
<INPUT TYPE=hidden NAME=msid VALUE="@{[enc_($msid)]}">
<INPUT TYPE=hidden NAME=sort VALUE="$sort">
<INPUT TYPE=hidden NAME=page VALUE="$page">
<INPUT TYPE=hidden NAME=del_target VALUE="">
<INPUT TYPE=hidden NAME=del_target_id VALUE="">
$hid_tag

<font class=normal>@{[t_('%1のある項目は入力/設定必須項目です。',$DA::Vars::p->{req_flg})]}</font>

<TABLE BORDER=0 CELLPADDING=1 CELLSPACING=1 style="background:$DA::Vars::p->{base_color}">
$detail_tag
</TABLE><BR>

$msg<br>
$gen_chk_tag

<HR>
$btn_tag
<BR>
</FORM>
</BODY>
$nocache_foot
</HTML>
buf_end

DA::MasterManager::unset_sel_msid($session);

DA::IS::print_data($session,$html_buf);
$session->{dbh}->disconnect();
Apache::exit();

}

sub del_proc {
	my ($session, $query) = @_;

	my $num			= $query->param('num');
	my $view 		= $query->param('view');
	my $target 		= $query->param('target');
	my $sort 		= $query->param('sort');
	my $page 		= $query->param('page');
	my $charNum		= $query->param('charNum');
	my $view_lang	= $query->param('view_lang');
	my $msid		= DA::MasterManager::get_select_msid($session);

	my $store = DA::IS::get_seq($session, 'apimage');

	my $btn_mes = DA::Session::check_lock_admin($session);
	if ($btn_mes){
		$btn_mes = "<br /><br /><font color=red>$btn_mes</font>";
	}

    my $btn_tag="<INPUT TYPE=button VALUE=\"@{[t_('戻　る')]}\" onClick="
            ."\"location.href='$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi"
            ."?num=$num&view=$view&target=$target&sort=$sort&page=$page&store=$store"
            ."&charNum=$charNum&view_lang=$view_lang&msid=$msid';\">$btn_mes\n";

	my (@suspend_sort, $suspend_list, $suspend_list_tag, $msid_del_msg);
	my ($sql, $sth);
	$sql = "SELECT gid,type,name,alpha,org_type FROM @{[DA::IS::get_group_table($session)]} WHERE type=4 ORDER by upper(kana)";
	$sth = $session->{dbh}->prepare($sql);
	$sth->execute;
	while (my $data = $sth->fetchrow_hashref('NAME_lc')) {
		next if ($data->{gid} eq $DA::Vars::p->{temp_gid});
		if (!DA::IS::is_ctrlable_group($session,$data->{gid})) { next; }
		my $undel = DA::MasterManager::check_delete_id($session, $data->{gid}, $msid);
		unless ($undel) {
			&get_group_member_list($session, $data->{gid}, $data->{org_type}, \$undel);
		}
		
		my $g_name	= DA::IS::check_view_name($session, $data->{'name'}, $data->{'alpha'});
		my $v_name	= DA::IS::get_ug_name($session, 0, $data->{gid}, $data->{type}, $g_name, undef, undef, undef, $data->{org_type});
		if ($undel) {
			$suspend_list_tag .= "<option value=\"\">*$v_name->{flg}$v_name->{name}</option>\n";
			unless ($msid_del_msg) {
				$msid_del_msg = "<font color=red>@{[t_('*未来世代に差異があるため、削除することはできません。')]}</font>";
			}
		} else {
			$suspend_list_tag .= "<option value=\"$data->{gid}:$data->{type}:$data->{org_type}\">$v_name->{flg}$v_name->{name}</option>\n";
			foreach my $key (qw(flg name)) {
				$suspend_list->{$data->{gid}}->{$key} = $v_name->{$key};
			}
			push(@suspend_sort, "$data->{gid}:$data->{type}:$data->{org_type}");
		}
	}

	if (!$btn_mes) {
		if (int(@suspend_sort)>0) {
			$btn_tag.="<INPUT TYPE=submit NAME=del_suspend_confirm VALUE=\"@{[t_('削　除')]}\">\n";
			$btn_tag.="<INPUT TYPE=submit NAME=del_all_suspend_confirm VALUE=\"@{[t_('全て削除')]}\" onClick=\"javascript:del_all_confirm();\">\n";
		}
	}

	my $store_file  = "$session->{sid}\-suspend_list\-$store\.$num";
	my $suspend		= {
			'suspend_sort' => \@suspend_sort,
			'suspend_list' => $suspend_list
	};
	DA::IS::save_temp_db($session, $suspend, $store_file);

my $page_title=DA::CGIdef::get_page_title($session,'func_title_groupsusdelete.gif',undef,'','off',t_('廃止グループ削除'));
my($head,$body,$nocache_foot)=DA::IS::get_head($session,"group_list.$num",'','',1);
my $outbuf=<<end_tag;
$head
<link rel="stylesheet" type="text/css" href="$DA::Vars::p->{css_rdir}/adminsite_style.css?@{[DA::IS::get_uri_prefix()]}"/>
<SCRIPT LANGUAGE="JavaScript"><!--
function del_all_confirm(){
	document.forms[0].all.value = 1
}
//--></SCRIPT>
</head>
$body
end_tag

my $tab_html = DA::MasterManager::get_generation_html_tab($session, $msid);
my $html_buf =<<buf_end;
$outbuf
$tab_html
$page_title
<FORM METHOD=POST ACTION="$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi" style="margin:0px;padding:0px;">
<INPUT TYPE=hidden NAME=num VALUE="@{[DA::CGIdef::encode($num, 1, 1)]}">
<INPUT TYPE=hidden NAME=view VALUE="$view">
<INPUT TYPE=hidden NAME=charNum VALUE="$charNum">
<INPUT TYPE=hidden NAME=add_target VALUE="$target">
<INPUT TYPE=hidden NAME=view_lang VALUE="$view_lang">
<INPUT TYPE=hidden NAME=msid VALUE="@{[enc_($msid)]}">
<INPUT TYPE=hidden NAME=sort VALUE="$sort">
<INPUT TYPE=hidden NAME=page VALUE="$page">
<INPUT TYPE=hidden NAME=store VALUE="$store">
<INPUT TYPE=hidden NAME=all VALUE="">
buf_end

if (!$suspend_list_tag) {
	$html_buf.="@{[t_('削除対象の廃止グループが存在しません。')]}<br>";
} else {
	$html_buf .=qq{
		<TABLE BORDER=0 CELLPADDING=1 CELLSPACING=1 style="background:$DA::Vars::p->{base_color}">
		<TR><TH BGCOLOR=$DA::Vars::p->{title_color} >@{[t_("廃止グループ一覧")]}</TH></TR>
		<TR><TD BGCOLOR=#FFFFFF>
		<SELECT NAME=SUSPEND_GID MULTIPLE=1 SIZE=20 style="width:400px">
		$suspend_list_tag
		<option value=""></option>
		</SELECT>
		</TD>
		</TR></TABLE>
	};
}
$html_buf .=<<buf_end;
$msid_del_msg

<hr>
$btn_tag
<BR>
</FORM>
</BODY>
$nocache_foot
</HTML>
buf_end

	DA::MasterManager::unset_sel_msid($session);

	DA::IS::print_data($session,$html_buf);
	$session->{dbh}->disconnect();
	Apache::exit();
}

sub get_detail_top{
    my($session,$proc_tag,$block,$group_tag)=@_;

	my $disable = {};
	$disable->{name} = 1;
my $detail_tag=<<end_tag;
@{[DA::HTML::Member::check_master("<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150 HEIGHT=18>$DA::Vars::p->{req_flg} @{[t_('会社名')]}@{[DA::HTML::Member::title_common($session, 'case' => 1)]}</TD><TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2>$block->{PARAM}->{name}</TD></TR>")]}
@{[DA::HTML::Group::get_display_l_name_input($session, $block->{PARAM}, 'title' => t_('会社名'), 'colspan' => 2, 'disable' => $disable)]}
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150 HEIGHT=18> @{[t_('%1(ふりがな)',t_('会社名'))]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2>$block->{PARAM}->{kana}</TD></TR>
@{[DA::HTML::Member::check_master("<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150 HEIGHT=18>@{[t_('会社名')]}(alphabet)</TD><TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2>$block->{PARAM}->{alpha}</TD></TR>")]}

<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>$DA::Vars::p->{req_flg} @{[t_('プライマリオーナー')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{PO_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=po_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>@{[t_('セカンダリオーナー')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{SO_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=so_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>@{[t_('プライマリ所属ユーザ')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{USERSEL}$group_tag->{A_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150> @{[t_('セカンダリ所属ユーザ')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{S_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=s_usersel VALUE="@{[t_('設定')]}"></TH></TR>
end_tag
	if ( DA::IS::has_sdb_process_superior($session) ) {
		$detail_tag.=<<end_tag;
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150> @{[t_('上長')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{U_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=u_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150> @{[t_('上長代行')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{UA_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=ua_usersel VALUE="@{[t_('設定')]}"></TH></TR>
end_tag
	}

    return $detail_tag;
}

sub get_detail_group{
    my($session,$proc_tag,$block,$group_tag)=@_;

    my $sort_level_option;
	my $sort_level = DA::CGIdef::encode($block->{PARAM}->{sort_level}, 0, 1);	
	$sort_level_option = "&nbsp;&nbsp;@{[t_('ソートレベル')]} : <input type=text size=10 name=\"sort_level\" value=\"$sort_level\" style='ime-mode: disabled'>";

my $detail_tag=<<end_tag;
@{[DA::HTML::Member::check_master("<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>$DA::Vars::p->{req_flg} @{[t_('組織名')]}@{[DA::HTML::Member::title_common($session, 'case' => 1)]}</TD><TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=name SIZE=60 MAXLENGTH=100 VALUE=\"$block->{PARAM}->{name}\"></TD></TR>")]}
@{[DA::HTML::Group::get_display_l_name_input($session, $block->{PARAM}, 'title' => t_('組織名'), 'colspan' => 2)]}
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>$DA::Vars::p->{req_flg} @{[t_("%1(ふりがな)", t_("組織名"))]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=kana SIZE=40 MAXLENGTH=100 VALUE="$block->{PARAM}->{kana}">$sort_level_option</TD></TR>
@{[DA::HTML::Member::check_master("<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>@{[t_('組織名(alphabet)')]}</TD><TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=alpha SIZE=40 MAXLENGTH=100 VALUE=\"$block->{PARAM}->{alpha}\" style='ime-mode: disabled'></TD></TR>")]}

<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>$DA::Vars::p->{req_flg} @{[t_('親組織')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{PARENT}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=p_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>$DA::Vars::p->{req_flg} @{[t_('プライマリオーナー')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{PO_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=po_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>@{[t_('セカンダリオーナー')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{SO_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=so_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>@{[t_('プライマリ所属ユーザ')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{USERSEL}$group_tag->{A_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>@{[t_('セカンダリ所属ユーザ')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{S_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=s_usersel VALUE="@{[t_('設定')]}"></TH></TR>
end_tag
	if ( DA::IS::has_sdb_process_superior($session) ) {
		$detail_tag .=<<end_tag
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>@{[t_('上長')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{U_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=u_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>@{[t_('上長代行')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{UA_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=ua_usersel VALUE="@{[t_('設定')]}"></TH></TR>
end_tag
	}

    return $detail_tag;
}

sub get_detail_project{
    my($session,$proc_tag,$block,$group_tag)=@_;

    my $sort_level_option;
    my $sort_level = DA::CGIdef::encode($block->{PARAM}->{sort_level}, 0, 1);
    $sort_level_option = "&nbsp;&nbsp;@{[t_('ソートレベル')]} : <input type=text size=10 name=\"sort_level\" value=\"$sort_level\" style='ime-mode: disabled'>";

    my(%join_sel,%permit_sel);
    $join_sel{$block->{PARAM}->{group_join}} ="checked";
    $permit_sel{$block->{PARAM}->{permit}} ="checked";

my $detail_tag=<<end_tag;
@{[DA::HTML::Member::check_master("<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=170>$DA::Vars::p->{req_flg} @{[t_('プロジェクト名')]}@{[DA::HTML::Member::title_common($session, 'case' => 1)]}</TD><TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=name SIZE=60 MAXLENGTH=100 VALUE=\"$block->{PARAM}->{name}\"></TD></TR>")]}
@{[DA::HTML::Group::get_display_l_name_input($session, $block->{PARAM}, 'title' => t_('プロジェクト名'), 'colspan' => 2)]}
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=170>$DA::Vars::p->{req_flg} @{[t_("%1(ふりがな)", t_("プロジェクト名"))]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=kana SIZE=40 MAXLENGTH=100 VALUE="$block->{PARAM}->{kana}">$sort_level_option</TD></TR>
@{[DA::HTML::Member::check_master("<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=170>@{[t_('%1(alphabet)',t_('プロジェクト名'))]}</TD><TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=alpha SIZE=40 MAXLENGTH=100 VALUE=\"$block->{PARAM}->{alpha}\" style='ime-mode: disabled'></TD></TR>")]}

<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=170>$DA::Vars::p->{req_flg} @{[t_('親組織')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{PARENT}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=p_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=170>$DA::Vars::p->{req_flg} @{[t_('参加許可')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400 COLSPAN=2><INPUT TYPE=radio NAME=group_join VALUE=2 $join_sel{2}>@{[t_('オーナーが登録')]}&nbsp;
<INPUT TYPE=radio NAME=group_join VALUE=1 $join_sel{1}>@{[t_('自由に参加可能')]}</TD></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=170>$DA::Vars::p->{req_flg} @{[t_('所属ユーザ・グループの公開')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400 COLSPAN=2><INPUT TYPE=radio NAME=permit VALUE=1 $permit_sel{1}>@{[t_('公開する')]}&nbsp;
<INPUT TYPE=radio NAME=permit VALUE=2 $permit_sel{2}>@{[t_('所属ユーザ・グループ以外には公開しない')]}</TD></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=170>$DA::Vars::p->{req_flg} @{[t_('プライマリオーナー')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{PO_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=po_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=170>@{[t_('セカンダリオーナー')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{SO_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=so_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=170>@{[t_('所属ユーザ・グループ')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=usersel VALUE="@{[t_('設定')]}"></TH></TR>
end_tag
	if ( DA::IS::has_sdb_process_superior($session) ) {
		$detail_tag .=<<end_tag
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=170>@{[t_('上長')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{U_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=u_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=170>@{[t_('上長代行')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{UA_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=ua_usersel VALUE="@{[t_('設定')]}"></TH></TR>
end_tag
	}

    return $detail_tag;
}

sub get_detail_title{
    my($session,$proc_tag,$block,$group_tag)=@_;

my $detail_tag=<<end_tag;
@{[DA::HTML::Member::check_master("<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>$DA::Vars::p->{req_flg} @{[t_('役職グループ名')]}@{[DA::HTML::Member::title_common($session, 'case' => 1)]}</TD><TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=name SIZE=40 MAXLENGTH=100 VALUE=\"$block->{PARAM}->{name}\"></TD></TR>")]}
@{[DA::HTML::Group::get_display_l_name_input($session, $block->{PARAM}, 'title' => t_('役職グループ名'), 'colspan' => 2)]}
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>$DA::Vars::p->{req_flg} @{[t_("%1(ふりがな)",t_("役職グループ名"))]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=kana SIZE=40 MAXLENGTH=100 VALUE="$block->{PARAM}->{kana}"></TD></TR>
@{[DA::HTML::Member::check_master("<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>@{[t_('%1(alphabet)',t_('役職グループ名'))]}</TD><TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=alpha SIZE=40 MAXLENGTH=100 VALUE=\"$block->{PARAM}->{alpha}\" style='ime-mode: disabled'></TD></TR>")]}

<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>$DA::Vars::p->{req_flg} @{[t_('プライマリオーナー')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{PO_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=po_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>@{[t_('セカンダリオーナー')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{SO_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=so_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>@{[t_('所属ユーザ')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=usersel VALUE="@{[t_('設定')]}"></TH></TR>
end_tag
	if ( DA::IS::has_sdb_process_superior($session) ) {
		$detail_tag .=<<end_tag
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>@{[t_('上長')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{U_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=u_usersel VALUE="@{[t_('設定')]}"></TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>@{[t_('上長代行')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{UA_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=30><INPUT TYPE=submit NAME=ua_usersel VALUE="@{[t_('設定')]}"></TH></TR>
end_tag
	}

    return $detail_tag;
}

sub get_detail_suspend{
    my($session,$proc_tag,$block,$group_tag)=@_;

	my(%join_sel, %permit_sel);
	$join_sel{$block->{PARAM}->{group_join}}="checked";
	$permit_sel{$block->{PARAM}->{permit}}	="checked";

	my ($title_name, $title_kana, $title_alpha);
	if ($block->{PARAM}->{org_type} eq 3) {
		$title_name		= t_("役職グループ名");
		$title_kana		= t_("%1(ふりがな)", t_("役職グループ"));
		$title_alpha	= t_("%1(alphabet)",t_("役職グループ名"));
	} elsif ($block->{PARAM}->{org_type} eq 2) {
		$title_name		= t_("プロジェクト名");
		$title_kana		= t_("%1(ふりがな)", t_("プロジェクト名"));
		$title_alpha	= t_("%1(alphabet)",t_("プロジェクト名"));
	} else {
		$title_name		= t_("組織名");
		$title_kana		= t_("%1(ふりがな)", t_("組織名"));
		$title_alpha	= t_("%1(alphabet)",t_("組織名"));
	}

	my ($sort_level, $p_user_tag, $s_user_tag, $parent_tag, $join_tag, $permit_tag);
	if($block->{PARAM}->{org_type} eq '3'){
		$p_user_tag=qq{
			<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP HEIGHT=22>@{[t_("所属ユーザ")]}</TD>
			<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{USERSEL}$group_tag->{A_USERSEL}</TABLE></TD>
			<TH BGCOLOR=#FFFFFF>&nbsp;</TH></TR>
		};
	}elsif ($block->{PARAM}->{org_type} eq '2'){
		if($join_sel{2}){
			$join_tag=t_("オーナーが登録");
		}else{
			$join_tag=t_("自由に参加可能");
		}
		if($permit_sel{1}){
			$permit_tag=t_("公開する");
		}else{
			$permit_tag=t_("所属ユーザ以外には公開しない");
		}
		$join_tag=qq{
			<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>@{[t_('参加許可')]}</TD>
			<TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2>$join_tag</TD></TR>
		};
		$permit_tag=qq{
			<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>@{[t_('所属ユーザ・グループの公開')]}</TD>
			<TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2>$permit_tag</TD></TR>
		};
		$sort_level="&nbsp;&nbsp;@{[t_('ソートレベル')]}&nbsp;:&nbsp;$block->{PARAM}->{sort_level}"
				   ."<input type=\"hidden\" name=\"sort_level\" value=\"$block->{PARAM}->{sort_level}\">";
		$parent_tag=qq{
			<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>$DA::Vars::p->{req_flg} @{[t_('親組織')]}</TD>
			<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{PARENT}</TABLE></TD>
			<TH BGCOLOR=#FFFFFF><INPUT TYPE=submit NAME=p_usersel VALUE="@{[t_('設定')]}"></TH></TR>
		};
		$p_user_tag=qq{
			<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP HEIGHT=22>@{[t_("所属ユーザ・グループ")]}</TD>
			<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{USERSEL}$group_tag->{A_USERSEL}</TABLE></TD>
			<TH BGCOLOR=#FFFFFF>&nbsp;</TH></TR>
		};
	}else{
		$sort_level="&nbsp;&nbsp;@{[t_('ソートレベル')]}&nbsp;:&nbsp;$block->{PARAM}->{sort_level}"
				   ."<input type=\"hidden\" name=\"sort_level\" value=\"$block->{PARAM}->{sort_level}\">";
		$parent_tag=qq{
			<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP WIDTH=150>$DA::Vars::p->{req_flg} @{[t_('親組織')]}</TD>
			<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{PARENT}</TABLE></TD>
			<TH BGCOLOR=#FFFFFF><INPUT TYPE=submit NAME=p_usersel VALUE="@{[t_('設定')]}"></TH></TR>
		};
		$p_user_tag=qq{
			<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP HEIGHT=22>@{[t_("プライマリ所属ユーザ")]}</TD>
			<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{USERSEL}$group_tag->{A_USERSEL}</TABLE></TD>
			<TH BGCOLOR=#FFFFFF>&nbsp;</TH></TR>
		};
		$s_user_tag=qq{
			<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP HEIGHT=22>@{[t_("セカンダリ所属ユーザ")]}</TD>
			<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{S_USERSEL}</TABLE></TD>
			<TH BGCOLOR=#FFFFFF>&nbsp;</TH></TR>
		};
	}

	my $superios_user_tag;
	if ( DA::IS::has_sdb_process_superior($session) ) {
		$superios_user_tag =<<end_tag;
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP HEIGHT=22>@{[t_('上長')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{U_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=44>&nbsp;</TH></TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP HEIGHT=22>@{[t_('上長代行')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{UA_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF WIDTH=44>&nbsp;</TH></TR>
end_tag
	}

my $detail_tag.=<<end_tag;
@{[DA::HTML::Member::check_master("<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>$DA::Vars::p->{req_flg}&nbsp;@{[DA::IS::pre_suspend($session)]}$title_name@{[DA::HTML::Member::title_common($session, 'case' => 1)]}</TD><TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=name SIZE=40 MAXLENGTH=100 VALUE=\"$block->{PARAM}->{name}\"></TD></TR>")]}
@{[DA::HTML::Group::get_display_l_name_input($session, $block->{PARAM}, 'title' => DA::IS::pre_suspend($session).$title_name, 'colspan' => 2)]}
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>$DA::Vars::p->{req_flg}&nbsp;@{[DA::IS::pre_suspend($session)]}$title_kana</TD>
<TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=kana SIZE=40 MAXLENGTH=100 VALUE="$block->{PARAM}->{kana}">$sort_level</TD></TR>
@{[DA::HTML::Member::check_master("<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP>@{[DA::IS::pre_suspend($session)]}$title_alpha</TD><TD BGCOLOR=#FFFFFF NOWRAP COLSPAN=2><INPUT TYPE=text NAME=alpha SIZE=40 MAXLENGTH=100 VALUE=\"$block->{PARAM}->{alpha}\" style='ime-mode:disabled'></TD></TR>")]}
$parent_tag
$join_tag
$permit_tag
<TR>
<TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP HEIGHT=22>@{[t_("プライマリオーナー")]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{PO_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF>&nbsp;</TH></TD>
</TR>
<TR><TD BGCOLOR=$DA::Vars::p->{title_color} ALIGN=right NOWRAP HEIGHT=22>@{[t_('セカンダリオーナー')]}</TD>
<TD BGCOLOR=#FFFFFF NOWRAP WIDTH=400><TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>$group_tag->{SO_USERSEL}</TABLE></TD>
<TH BGCOLOR=#FFFFFF>&nbsp;</TH></TR>
$p_user_tag
$s_user_tag
$superios_user_tag
end_tag

	return $detail_tag;
}

sub del_suspend_confirm{
    my($session,$query)=@_;
    my $num			= $query->param('num');
    my $proc   		= $query->param('proc');
    my @suspend_gid = $query->param('suspend_gid');
    my $view   		= $query->param('view');
    my $view_lang	= $query->param('view_lang');
	my $msid        = DA::MasterManager::get_select_msid($session);
    my $sort   		= $query->param('sort');
    my $all			= $query->param('all');
    my $page   		= $query->param('page');
    my $charNum		= $query->param('charNum');
	my $store		= $query->param('store');
	
	my ($gid, $type);

	my $store_file  		= "$session->{sid}\-suspend_list\-$store\.$num";
	my $store_select_file	= "$session->{sid}\-suspend_list_selected\-$store\.$num";
	my $suspend	= DA::IS::get_temp_db($session, $store_file);

	my ($selected_list, $del_tag, $chk_tag, $chk_flag);
	my $fu_msid = DA::MasterManager::exists_before_active($session);
	if ($all) {
		if (int(@{$suspend->{suspend_sort}}) == 0) {
			DA::CGIdef::errorpage($session,
				t_("削除可能対象の廃止グループが存在しません。"),
				'noname');
		} else {
			foreach my $select (@{$suspend->{suspend_sort}}) {
				my ($gid, $type, $org_type) = split(/\:/, $select);
				my $v_name = $suspend->{suspend_list}->{$gid};
				$selected_list .= "$v_name->{flg}$v_name->{name}\n";
				DA::Admin::group_lock($session,$gid);
				
				unless ($del_tag) {
					$del_tag = DA::MasterManager::check_delete_id($session, $gid, $msid);
				}
				unless ($chk_flag) {
					$chk_flag = DA::MasterManager::check_future_id($session, $gid, $fu_msid);
				}
				$selected_list .= &get_group_member_list($session, $gid, $org_type, \$del_tag, 1);
			}
		}
		DA::IS::save_temp_db($session, $suspend->{suspend_sort}, $store_select_file);
	} else {
		if (int(@suspend_gid) == 0 || (!$suspend_gid[0])) {
			DA::CGIdef::errorpage($session,
				t_("削除可能廃止グループを選択してください。"),
				'noname');
		}

		foreach my $select (@suspend_gid) {
			next unless ($select);
			my ($gid, $type, $org_type) = split(/\:/, $select);
			my $v_name = $suspend->{suspend_list}->{$gid};
			$selected_list .= "$v_name->{flg}$v_name->{name}\n";
			DA::Admin::group_lock($session,$gid);
			
			unless ($del_tag) {
				$del_tag = DA::MasterManager::check_delete_id($session, $gid, $msid);
			}
			unless ($chk_flag) {
				$chk_flag = DA::MasterManager::check_future_id($session, $gid, $fu_msid);
			}
			$selected_list .= &get_group_member_list($session, $gid, $org_type, \$del_tag, 1);
		}
		DA::IS::save_temp_db($session, \@suspend_gid, $store_select_file);
	}

	if ( $del_tag ) {
		$del_tag = "<br><br><font color=\"red\">$del_tag</font>";
	} else {
		$del_tag = "<input type=submit name=del_submit value=\"@{[t_('削　除')]}\">";
		
		if ( DA::MasterManager::is_active_from_session($session, $msid) && $chk_flag ) {
			$chk_tag = "<br><font color=\"red\">".t_("※未来、現在世代すべてのユーザ、グループが削除されます。")."</font>";
		}
	}

	my $target;
    if($query->param('add_target')){
        $target = $query->param('add_target');
    }else{
        $target = $query->param('target');
    }
    my $name=t_("組織");
    my $page_title=DA::CGIdef::get_page_title($session,'func_title_groupsusdelete.gif',undef,'','off',t_('廃止グループ削除'));

my($head,$body,$nocache_foot)=DA::IS::get_head($session,"group_list.$num",'','',1);
my $outbuf=<<end_tag;
$head
</head>
$body
end_tag

my $html_buf =<<buf_end;
$outbuf
$page_title
<FORM METHOD=POST ACTION="$DA::Vars::p->{ad_cgi_rdir}/group_del_wait.cgi">
<INPUT TYPE=hidden NAME=num VALUE="@{[DA::CGIdef::encode($num, 1, 1)]}">
<INPUT TYPE=hidden NAME=proc VALUE="$proc">
<INPUT TYPE=hidden NAME=gid VALUE="$gid">
<INPUT TYPE=hidden NAME=type VALUE="$type">
<INPUT TYPE=hidden NAME=view VALUE="$view">
<INPUT TYPE=hidden NAME=view_lang VALUE="$view_lang">
<INPUT TYPE=hidden NAME=msid VALUE="@{[enc_($msid)]}">
<INPUT TYPE=hidden NAME=charNum VALUE="$charNum">
<INPUT TYPE=hidden NAME=add_target VALUE="$target">
<INPUT TYPE=hidden NAME=sort VALUE="$sort">
<INPUT TYPE=hidden NAME=page VALUE="$page">
<INPUT TYPE=hidden NAME=store VALUE="$store">
<INPUT TYPE=hidden NAME=img_rdir VALUE="$session->{img_rdir}">
<center><br>
<TABLE BORDER=0>
	<TR><TD>@{[t_('下記廃止グループを削除します。')]}</TD></TR>
	<TR><TD><textarea rows=12 cols=40 wrap=off readonly onFocus="this.blur();">$selected_list</textarea></TD></TR>
<TR><TD>
@{[t_('%1に指定した<br><font color=red>・登録データ<br>・組織のプライマリ所属ユーザ<br>・組織のプライマリ所属ユーザのデータ<br></font>も全て削除されます。', t_("選択したグループ"))]}<br>
@{[t_('本当に削除してもよろしいですか？')]}
$chk_tag
</TD></TR>
</TABLE>

<hr width=500><table border=0><tr><td>
<input type=button value="@{[t_('戻　る')]}" onClick="location.href='$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?num=$num&del=1&view=$view&sort=$sort&page=$page&charNum=$charNum&add_target=$target&view_lang=$view_lang&msid=$msid';">
$del_tag
</td></tr></table>
</FORM>
</BODY>
$nocache_foot
</HTML>
buf_end

DA::MasterManager::unset_sel_msid($session);

DA::IS::print_data($session,$html_buf);
$session->{dbh}->disconnect();
Apache::exit();

}

sub del_confirm{
    my($session,$query)=@_;
    my $num			= $query->param('num');
    my $proc   		= $query->param('proc');
    my $gid    		= &check_gid($query->param('gid'));
    my $type   		= $query->param('type');
    my $org_type   	= $query->param('org_type');
    my $view   		= $query->param('view');
    my $sort   		= $query->param('sort');
    my $page   		= $query->param('page');
    my $charNum		= $query->param('charNum');
	my $msid		= DA::MasterManager::get_select_msid($session);
	
	if (!DA::IS::is_ctrlable_group($session,$gid)) {
        DA::CGIdef::errorpage($session, t_('管理権限がありません。'));
    }

    my $err = t_("プライマリ所属ユーザが存在する組織は削除できません。");
    
    DA::Admin::group_lock($session,$gid);
    if($type eq '1'){
        my $block = DA::IS::get_data_parse($session,"group_list.$num");
        foreach my $id(keys %{$block->{USERSEL}}){
            if(int($id) > 0){
            	if (!DA::MasterManager::is_active_from_session($session, $msid)) {
            		$err = DA::MasterManager::FUTURE_DATA_ERR_MSG($err);
                }
                DA::CGIdef::errorpage($session,$err,'noname');
            }
        }
    }
    # 未来世代にチェック
    my $fu_msid = DA::MasterManager::exists_before_active($session);
	if (DA::MasterManager::is_active_from_session($session, $msid) && $fu_msid) {
		my $f_gtype = &get_group_type($session, $gid, $fu_msid);
		if ($f_gtype eq '1') {
			my $data = DA::IS::get_group_member_data($session,$gid,'1',$fu_msid);
			foreach my $id(keys %{$data->{USERSEL}}){
				if(int($id) > 0){
					DA::CGIdef::errorpage($session,DA::MasterManager::FUTURE_DATA_ERR_MSG($err),'noname');
				}
			}
		}
	}

	my $del_tag = DA::MasterManager::check_delete_id($session, $gid, $msid);
	my $v_name = DA::IS::get_ug_name($session,1,$gid);
	my $selected_list = "$v_name->{flg}$v_name->{name}\n";
	$selected_list .= &get_group_member_list($session, $gid, $org_type, \$del_tag, 1);

	my $chk_tag;
	if ( $del_tag ) {
		$del_tag = "<br><br><font color=\"red\">$del_tag</font>";
	} else {
		$del_tag = "<input type=submit name=del_submit value=\"@{[t_('削　除')]}\">";
		if ( DA::MasterManager::is_active_from_session($session, $msid) && DA::MasterManager::check_future_id($session,$gid) ) {
			$chk_tag = "<br><font color=\"red\">".t_("※未来、現在世代すべてのユーザ、グループが削除されます。")."</font>";
		}
	}
    
    my $target;
    if($query->param('add_target')){
        $target = $query->param('add_target');
    }else{
        $target = $query->param('target');
    }
    my($name,$page_title);
    if($type eq '1' || ($type eq '4' && $org_type eq '1')){
        $name=t_("組織");
        $page_title=DA::CGIdef::get_page_title($session,'func_title_confdelorg.gif',undef,'','off',t_('組織削除の確認'));
    }elsif($type eq '2'|| ($type eq '4' && $org_type eq '2')){
        $name=t_("プロジェクト");
        $page_title=DA::CGIdef::get_page_title($session,'func_title_confdelprj.gif',undef,'','off',t_('プロジェクト削除の確認'));
    }else{
        $name=t_("役職グループ");
        $page_title=DA::CGIdef::get_page_title($session,'func_title_confdelgrpex.gif',undef,'','off',t_('役職グループ削除の確認'));
    }

	my $alert;
	if ($type eq '4' && $org_type eq '1') {
		$alert = t_('%1に指定した<br><font color=red>・登録データ<br>・組織のプライマリ所属ユーザ<br>・組織のプライマリ所属ユーザのデータ<br></font>も全て削除されます。',t_("削除対象の%1", $name))."<br>";
	} else {
		$alert = t_('%1を登録グループに指定したデータなども全て削除されます。',$name); 
	}

my($head,$body,$nocache_foot)=DA::IS::get_head($session,"group_list.$num",'','',1);
my $outbuf=<<end_tag;
$head
</head>
$body
end_tag

my $html_buf =<<buf_end;
$outbuf
$page_title
<FORM METHOD=POST ACTION="$DA::Vars::p->{ad_cgi_rdir}/group_del_wait.cgi">
<INPUT TYPE=hidden NAME=num VALUE="@{[DA::CGIdef::encode($num, 1, 1)]}">
<INPUT TYPE=hidden NAME=proc VALUE="$proc">
<INPUT TYPE=hidden NAME=gid VALUE="$gid">
<INPUT TYPE=hidden NAME=type VALUE="$type">
<INPUT TYPE=hidden NAME=org_type VALUE="$org_type">
<INPUT TYPE=hidden NAME=view VALUE="$view">
<INPUT TYPE=hidden NAME=msid VALUE="@{[enc_($msid)]}">
<INPUT TYPE=hidden NAME=charNum VALUE="$charNum">
<INPUT TYPE=hidden NAME=add_target VALUE="$target">
<INPUT TYPE=hidden NAME=sort VALUE="$sort">
<INPUT TYPE=hidden NAME=page VALUE="$page">
<INPUT TYPE=hidden NAME=img_rdir VALUE="$session->{img_rdir}">
<center><br>
<TABLE BORDER=0>
<TR><TD>@{[t_('下記グループを削除します。')]}</TD></TR>
<TR><TD><textarea rows=12 cols=40 wrap=off readonly onFocus="this.blur();">$selected_list</textarea></TD></TR>
<TR><TD>$alert</TD></TR>
<TR><TD>@{[t_('本当に削除してもよろしいですか？')]}$chk_tag</TD></TR>
</TABLE>
<hr width=500><table border=0><tr><td>
<input type=button value="@{[t_('戻　る')]}" onClick="location.href='$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?num=$num&edit=back&proc=$proc&view=$view&gid=$gid&sort=$sort&page=$page&charNum=$charNum&add_target=$target&msid=$msid';">
$del_tag
</td></tr></table>
</FORM>
</BODY>
$nocache_foot
</HTML>
buf_end

DA::MasterManager::unset_sel_msid($session);

DA::IS::print_data($session,$html_buf);
$session->{dbh}->disconnect();
Apache::exit();

}

sub restore_confirm{
    my($session,$query)=@_;
    my $num    = $query->param('num');
    my $proc   = $query->param('proc');
    my $gid    = &check_gid($query->param('gid'));
    my $type   = $query->param('type');
    my $org_type   = $query->param('org_type');
    my $view   = $query->param('view');
    my $sort   = $query->param('sort');
    my $page   = $query->param('page');
    my $charNum= $query->param('charNum');
	my $msid   = DA::MasterManager::get_select_msid($session);
    my $future = $query->param('future');

	my $groups = DA::Admin::get_group_lowers($session, $gid);
	if (ref($groups) eq 'ARRAY') {
		foreach my $target (@{$groups}) {
			DA::Admin::group_lock($session,$target);
		}
	} else {
		DA::Admin::group_lock($session,$gid);
	}

    my $target;
    if($query->param('add_target')){
        $target = $query->param('add_target');
    }else{
        $target = $query->param('target');
    }
    my($name,$page_title);
    if($org_type eq '1'){
        $name=t_("組織");
        $page_title=DA::CGIdef::get_page_title($session,'func_title_confresorg.gif',undef,'','off',t_('組織復帰の確認'));
    }elsif($org_type eq '2'){
        $name=t_("プロジェクト");
        $page_title=DA::CGIdef::get_page_title($session,'func_title_confresprj.gif',undef,'','off',t_('プロジェクト復帰の確認'));
    }else{
        $name=t_("役職グループ");
        $page_title=DA::CGIdef::get_page_title($session,'func_title_confresgrpex.gif',undef,'','off',t_('役職グループ復帰の確認'));
    }
my($head,$body,$nocache_foot)=DA::IS::get_head($session,"group_list.$num",'','',1);
my $outbuf=<<end_tag;
$head
</head>
$body
end_tag

my $future_warn;
if ( DA::MasterManager::is_active_from_session($session, $msid) ) {
	if ( $future && DA::MasterManager::check_future_id($session,$gid) ) {
		$future_warn = "<br><font color=\"red\">".t_("※未来、現在世代の該当グループが通常のグループになります。")."</font>";
	}
}

my $html_buf =<<buf_end;
$outbuf
$page_title
<FORM METHOD=POST ACTION="$DA::Vars::p->{ad_cgi_rdir}/group_restore_wait.cgi">
<INPUT TYPE=hidden NAME=proc VALUE="$proc">
<INPUT TYPE=hidden NAME=gid VALUE="$gid">
<INPUT TYPE=hidden NAME=type VALUE="$type">
<INPUT TYPE=hidden NAME=org_type VALUE="$org_type">
<INPUT TYPE=hidden NAME=view VALUE="$view">
<INPUT TYPE=hidden NAME=msid VALUE="@{[enc_($msid)]}">
<INPUT TYPE=hidden NAME=future VALUE="@{[enc_($future)]}">
<INPUT TYPE=hidden NAME=charNum VALUE="$charNum">
<INPUT TYPE=hidden NAME=add_target VALUE="$target">
<INPUT TYPE=hidden NAME=sort VALUE="$sort">
<INPUT TYPE=hidden NAME=page VALUE="$page">
<INPUT TYPE=hidden NAME=img_rdir VALUE="$session->{img_rdir}">
<center><br>
<img src=$session->{img_rdir}/popy_ok.gif border=0 width=130 height=88><p>
@{[t_('%1以下の組織・プロジェクトも全て通常のグループになります。',$name)]}<br>
@{[t_('本当に復帰してもよろしいですか？')]}
$future_warn<p>
<hr width=500><table border=0><tr><td>
<input type=button value="@{[t_('戻　る')]}" onClick="location.href='$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?num=$num&edit=back&proc=$proc&view=$view&gid=$gid&sort=$sort&page=$page&charNum=$charNum&add_target=$target&msid=$msid';">
<input type=submit name=restore_submit value="@{[t_('復　帰')]}">
</td></tr></table>
</FORM>
</BODY>
$nocache_foot
</HTML>
buf_end

DA::MasterManager::unset_sel_msid($session);

DA::IS::print_data($session,$html_buf);
$session->{dbh}->disconnect();
Apache::exit();

}

sub suspend_confirm{
    my($session,$query)=@_;
    my $num    = $query->param('num');
    my $proc   = $query->param('proc');
    my $gid    = &check_gid($query->param('gid'));
    my $type   = $query->param('type');
    my $view   = $query->param('view');
    my $view_lang	= $query->param('view_lang');
	my $msid   = DA::MasterManager::get_select_msid($session);
    my $future = $query->param('future');
    my $sort   = $query->param('sort');
    my $page   = $query->param('page');
    my $charNum= $query->param('charNum');

	my $groups = DA::Admin::get_group_lowers($session, $gid);
	if (ref($groups) eq 'ARRAY') {
		foreach my $target (@{$groups}) {
    		DA::Admin::group_lock($session,$target);
		}
	} else {
    	DA::Admin::group_lock($session,$gid);
	}

    my $target;
    if($query->param('add_target')){
        $target = $query->param('add_target');
    }else{
        $target = $query->param('target');
    }
    my($alert,$name,$page_title);
    if ($type eq '1') {
        $name = t_("組織");
        $page_title = DA::CGIdef::get_page_title($session,'func_title_confsusorg.gif',undef,'','off',t_('組織廃止の確認'));
		$alert = t_('%1以下の組織・プロジェクトも全て廃止グループになります。',$name)."<br>";
    } elsif($type eq '2') {
        $name = t_("プロジェクト");
        $page_title = DA::CGIdef::get_page_title($session,'func_title_confsusprj.gif',undef,'','off',t_('プロジェクト廃止の確認'));
    } else {
        $name = t_("役職グループ");
        $page_title = DA::CGIdef::get_page_title($session,'func_title_confsusgrpex.gif',undef,'','off',t_('役職グループ廃止の確認'));
    }

my($head,$body,$nocache_foot)=DA::IS::get_head($session,"group_list.$num",'','',1);
my $outbuf=<<end_tag;
$head
</head>
$body
end_tag

my $future_warn;
if ( DA::MasterManager::is_active_from_session($session, $msid) ) {
	if ( $future && DA::MasterManager::check_future_id($session,$gid) ) {
		$future_warn = "<br><font color=\"red\">".t_("※未来、現在世代の該当グループが廃止グループになります。")."</font>";
	}
}
my $html_buf =<<buf_end;
$outbuf
$page_title
<FORM METHOD=POST ACTION="$DA::Vars::p->{ad_cgi_rdir}/group_suspend_wait.cgi">
<INPUT TYPE=hidden NAME=proc VALUE="$proc">
<INPUT TYPE=hidden NAME=gid VALUE="$gid">
<INPUT TYPE=hidden NAME=type VALUE="$type">
<INPUT TYPE=hidden NAME=view VALUE="$view">
<INPUT TYPE=hidden NAME=view_lang VALUE="$view_lang">
<INPUT TYPE=hidden NAME=msid VALUE="@{[enc_($msid)]}">
<INPUT TYPE=hidden NAME=future VALUE="@{[enc_($future)]}">
<INPUT TYPE=hidden NAME=charNum VALUE="$charNum">
<INPUT TYPE=hidden NAME=add_target VALUE="$target">
<INPUT TYPE=hidden NAME=sort VALUE="$sort">
<INPUT TYPE=hidden NAME=page VALUE="$page">
<INPUT TYPE=hidden NAME=img_rdir VALUE="$session->{img_rdir}">
<center><br>
<img src=$session->{img_rdir}/popy_ok.gif border=0 width=130 height=88><p>
$alert
@{[t_('本当に廃止してもよろしいですか？')]}
$future_warn<p>

<hr width=500><table border=0><tr><td>
<input type=button value="@{[t_('戻　る')]}" onClick="location.href='$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?num=$num&edit=back&proc=$proc&view=$view&gid=$gid&sort=$sort&page=$page&charNum=$charNum&add_target=$target&view_lang=$view_lang&msid=$msid';">
<input type=submit name=suspend_submit value="@{[t_('廃　止')]}">
</td></tr></table>
</FORM>
</BODY>
$nocache_foot
</HTML>
buf_end

DA::MasterManager::unset_sel_msid($session);

DA::IS::print_data($session,$html_buf);
$session->{dbh}->disconnect();
Apache::exit();

}

sub edit_submit{
    my($session,$query,$proc)=@_;
    #==========================================================
    #              -----custom----
    #==========================================================
    my $msid = DA::MasterManager::get_enable_msid($session);
    my $tid  = DA::Custom::begin_group_modify($msid) if (DA::IS::cbp_execute_ok($session, $msid));

    DA::Session::check_maintenance_admin($session,1);
    DA::Session::check_lock_admin($session,1);
    my $num  = $query->param('num');
    my $name = $query->param('name');
       $name = DA::CGIdef::encode($name);
    my $kana = $query->param('kana');
       $kana = DA::CGIdef::encode($kana);
	   $kana = DA::Unicode::filter($kana,'k2h');
    my $alpha = $query->param('alpha');
       $alpha = DA::CGIdef::encode($alpha);
    my $gid  = &check_gid($query->param('gid'));
    my $sort_level = $query->param('sort_level');
    my $group_join = $query->param('group_join');
    my $permit  = $query->param('permit');
    my $msid    = DA::MasterManager::get_select_msid($session);
    my $proc_tag;
	
	if ($gid && !DA::IS::is_ctrlable_group($session,$gid)) {
        DA::CGIdef::errorpage($session, t_('管理権限がありません。'));
    }
	
    DA::Admin::group_lock($session,$gid);
    my $block = DA::IS::get_data_parse($session,"group_list.$num");
    if(!$block){return;}
    &user_check($session,$gid,$block);
    my $type		= $block->{PARAM}->{type};
	my $org_type	= $block->{PARAM}->{org_type};
	if(DA::IS::group_type($type, $org_type) eq '1'){
        $proc_tag = t_("組織名");
    }elsif(DA::IS::group_type($type, $org_type) eq '2'){
        $proc_tag = t_("プロジェクト名");
    }elsif(DA::IS::group_type($type, $org_type) eq '3'){
        $proc_tag = t_("役職グループ名");
    }

	$name  = DA::Unicode::ltrim($name);
	$kana  = DA::Unicode::ltrim($kana);
	$alpha = DA::Unicode::ltrim($alpha);

	my $master_config	= DA::MultiLang::get_master_config($session);
	my ($table, $multi_table) = DA::Address::get_table_define($session, 'is_group');

	my $lang_data	= DA::Group::query2lang_data($session, $query, $gid);

	# デフォルト言語でname,alphaの補完を行う
	my $common_data			= {};
	$common_data->{'name'}	= $name;
	$common_data->{'alpha'}	= $alpha;
	if (DA::MultiLang::master_ok()) {
		DA::Address::lang2common($session, $master_config->{default_lang}, $lang_data, $common_data);
	} else {
		DA::Address::alpha_complement($session, $common_data);
	}
	$name	= $common_data->{'name'};
	$alpha	= $common_data->{'alpha'};

	my @target_msid = DA::MasterManager::get_update_target_msid($session, $msid, ( $query->param('future')  ? 1: 0 ), $gid);
	my $multi_msid = DA::MasterManager::is_multi_msid(\@target_msid);

	# 現在世代にしか存在しないユーザ・グループを取得
	my $active_only_gm = {};
	my $before_active_msid;
	if ( $multi_msid ) {
		$before_active_msid = DA::MasterManager::exists_before_active($session);
		
		my $active_only_g = DA::MasterManager::get_group_diff4gen($session, $msid, $before_active_msid);
		my $active_only_m = DA::MasterManager::get_user_diff4gen($session, $msid, $before_active_msid);
		
		$active_only_gm = $active_only_g;
		foreach my $k ( keys %{$active_only_m} ) {
			$active_only_gm->{$k} = 1;
		}
	}

    my($parent,$parent_name,$parent_kana,$primary);
    if($gid ne $DA::Vars::p->{top_gid}){
		if (my $error = DA::IScheck::group_check_name($session, $lang_data, 
				'title_name' => $proc_tag, 'multi_table' => $multi_table)) {
	           DA::CGIdef::errorpage($session, $error);
		}
        if (DA::IScheck::check_value($name)){
            DA::CGIdef::errorpage($session,t_("%1を入力してください。",$proc_tag),'noname');
        }
        if (DA::IScheck::check_value($kana)){
            DA::CGIdef::errorpage($session,t_("%1（かな）を入力してください。",$proc_tag),'noname');
        }

		# ※name,kana,alphaサイズが同一のため$elementの数値は同じものを利用する
		# エラー時のカラム名の部分は変更をする必要がある

		my $element = DA::Address::get_check_element($table, 'name');
		$element->{name} = $proc_tag;
		if (my $err = DA::DBcheck::input_length($name, undef, undef, $element)) {
            DA::CGIdef::errorpage($session, $err, 'noname');
        }
		$element->{name} = t_("%1(ふりがな)", $proc_tag);
		if (my $err = DA::DBcheck::input_length($kana, undef, undef, $element)) {
            DA::CGIdef::errorpage($session, $err, 'noname');
        }
		$element->{name} = t_("%1（alphabet）", $proc_tag);
		if ($alpha && (my $err = DA::DBcheck::input_length($kana, undef, undef, $element))) {
            DA::CGIdef::errorpage($session, $err, 'noname');
        }
		if (my $msg = DA::IScheck::check_alphabet($alpha, t_("%1", $proc_tag)."(alphabet)")) {
            DA::CGIdef::errorpage($session, $msg, 'noname');
		}
		if($type ne 4 && DA::IS::group_type($type, $org_type) ne '3'){
        	if (DA::IScheck::check_value($sort_level)){
            	DA::CGIdef::errorpage($session,t_("%1を入力してください。", t_("ソートレベル")),'noname');
        	}
			my $master_file = "$DA::Vars::p->{ctl_dir}/db/default/is_group\.dat";
			my $master_conf = DA::Config::File->new(file => "$master_file");
			if (my $msg = DA::IScheck::check_sort_level($sort_level, t_("ソートレベル"),$master_conf->{_param}->{sort_level}->{length})) {
            	DA::CGIdef::errorpage($session, $msg, 'noname');
			}
		}

        if ($type =~ /^[12]$/ || ($type eq '4' && ($org_type =~ /^[12]$/))){
            $parent  = each %{$block->{PARENT}};
            $primary = each %{$block->{PO_USERSEL}};
			if (!$parent) {
                DA::CGIdef::errorpage($session,t_("親組織を設定してください。"),'noname');
			}
    		DA::Admin::group_lock($session,$parent);
        }else{
            $parent=$DA::Vars::p->{title_gid};
            $primary = each %{$block->{PO_USERSEL}};
        }
		# 新規作成の場合は親組織の管理権限をチェック
		if($proc eq 'add'){
			if ($parent && !DA::IS::is_ctrlable_group($session,$parent)) {
        		DA::CGIdef::errorpage($session, t_('管理権限がありません。'));
    		}
		}
    }else{
        $primary = each %{$block->{PO_USERSEL}};
    }
    if (!$primary) { $primary=$DA::Vars::p->{insuite_mid}; }
    if ($sort_level !~/^\d+$/) { $sort_level=10; }
    if (!$group_join){ $group_join=2; }
    if (!$permit){ $permit=0; }

	my $check=DA::IS::get_sys_custom($session,'custom_check',1);
	
	my $msid_data={};
	my $add_gid;

	### 2世代対応
	foreach my $t_msid ( @target_msid ) {
		my $db_data = {};
		my($old_name,$old_kana,$old_parent,$old_grade,$old_sort,$old_alpha);
		my($pgname,$pgkana,$pgalpha,$pgtype);

		my $member_table = DA::IS::get_member_table($session, "TBL", $t_msid);
		my $group_table  = DA::IS::get_group_table($session,  "TBL", $t_msid);
		my $gm_table     = DA::IS::get_master_table($session, "is_group_member", $t_msid);
	
		# TODO
		# 未来世代に存在しないグループを親組織に指定した場合は TOP組織で代用
		if(DA::IS::group_type($type, $org_type) =~ /1|2/) {
			if ( DA::MasterManager::is_new_or_ready($session, $t_msid ) && $active_only_gm->{$parent} ) {
				$parent = $DA::Vars::p->{top_gid};
			} else {
				# 通常組織以外が指定された場合はTOP組織を代用
				if (  DA::MasterManager::get_id_type($session, $parent, $t_msid) ne $DA::Vars::p->{g_type}->{org} ) {
					 $parent = $DA::Vars::p->{top_gid};
				}
			}
		}

		if ( DA::MasterManager::is_new_or_ready($session, $t_msid ) ) {
			# 未来世代に存在しないユーザをプライマリーオーナに指定した場合は システム管理者で代用
			$primary = $DA::Vars::p->{insuite_mid} if ( $active_only_gm->{$primary} ) ;
			
			# 該当ユーザが未来世代では一般ユーザではない場合 システム管理者で代用
			if  ( DA::MasterManager::get_id_type($session, $primary, $t_msid) ne $DA::Vars::p->{u_type}->{gen} ) {
				$primary = $DA::Vars::p->{insuite_mid};	
			}	
		}
		
		if($gid == $DA::Vars::p->{top_gid}){
			my $sql="SELECT name,kana,alpha FROM $group_table WHERE gid=?";
			my $sth=$session->{dbh}->prepare($sql);
			   $sth->bind_param(1,$DA::Vars::p->{top_gid},3); $sth->execute();
			($pgname,$pgkana,$pgalpha)=$sth->fetchrow; $sth->finish;

			$db_data->{gid}   = $DA::Vars::p->{top_gid};
			$db_data->{parent}= 0;
			$db_data->{parent_name} = DA::CGIdef::sql_quote('');
			$db_data->{parent_kana} = DA::CGIdef::sql_quote('');
			$db_data->{type}	= 1;
			$db_data->{gtype}	= 1;
			$db_data->{name}  = DA::CGIdef::sql_quote($pgname);
			$db_data->{kana}  = DA::CGIdef::sql_quote($pgkana);
			$db_data->{alpha} = DA::CGIdef::sql_quote($pgalpha);
	   		$db_data->{kana_p} = DA::CGIdef::jsubstr($pgkana,0,2);
			$db_data->{kana_p} = DA::Address::get_char_num($db_data->{kana_p});
			$db_data->{grade} = 0;
			$db_data->{group_join}=DA::CGIdef::sql_quote($group_join,1);
			$db_data->{permit}=DA::CGIdef::sql_quote($permit,1);
			$db_data->{sort_level}=0;
			$db_data->{parent_alpha} = 'NULL';

			# 言語別データは更新しないため
			$lang_data	= undef;
		}else{
			if($type =~ /^[12]$/ || ($type eq '4' && ($org_type =~ /^[12]$/))){
				my $group_table = DA::IS::get_group_table($session, $DA::Vars::p->{multi_lang_master}->{default_lang}, $t_msid);
				my $sql="SELECT name,kana,alpha,type FROM $group_table WHERE gid=?";
				my $sth=$session->{dbh}->prepare($sql);
				   $sth->bind_param(1,$parent,3); $sth->execute();
				($pgname,$pgkana,$pgalpha,$pgtype)=$sth->fetchrow; $sth->finish;

				$db_data->{grade} = 0;
				if ($type =~  /[1|2]/) {
					$db_data->{group_join}=DA::CGIdef::sql_quote($group_join,1);
					$db_data->{permit}=DA::CGIdef::sql_quote($permit,1);
				}
				$db_data->{parent_name}  = DA::CGIdef::sql_quote($pgname);
				$db_data->{parent_kana}  = DA::CGIdef::sql_quote($pgkana);
				$db_data->{parent_alpha} = DA::CGIdef::sql_quote($pgalpha);

				if (DA::MultiLang::master_ok()) {
					foreach my $l (@{DA::IS::get_lang_list($session)}) {
						my $table = DA::IS::get_group_table($session, $l->{code}, $t_msid); 
						my $sql="SELECT name FROM $table WHERE gid=?";
						my $sth=$session->{dbh}->prepare($sql);
						   $sth->bind_param(1, $parent, 1); $sth->execute;
						my $data = $sth->fetchrow_hashref('NAME_lc'); $sth->finish;	 
						$lang_data->{$l->{code}}->{parent_name} = $data->{name};
					}
				}
			}else{
				$db_data->{parent_name}  = DA::CGIdef::sql_quote('');
				$db_data->{parent_kana}  = DA::CGIdef::sql_quote('');
				$db_data->{parent_alpha} = DA::CGIdef::sql_quote('');
				$db_data->{group_join}   = DA::CGIdef::sql_quote('2',1);
				$db_data->{permit}  	 = DA::CGIdef::sql_quote(0,1);

				# 言語別データ
				$lang_data->{parent_name} = '';
			}
			$db_data->{gid}   	   = $gid;
			$db_data->{parent}	   = $parent;
			$db_data->{type}  	   = $type;
			$db_data->{gtype}  	   = $type;
			$db_data->{name}  	   = DA::CGIdef::sql_quote($name);
			$db_data->{kana}  	   = DA::CGIdef::sql_quote($kana);
			$db_data->{alpha} 	   = DA::CGIdef::sql_quote($alpha);
			$db_data->{kana_p} 	   = DA::CGIdef::jsubstr($kana,0,2);
			$db_data->{kana_p} 	   = DA::Address::get_char_num($db_data->{kana_p});
			$db_data->{sort_level} = $sort_level;

			if ($check->{group_dup}){
				my $sql="SELECT name,alpha FROM $group_table WHERE name=? ";
				if($proc eq 'edit'){ $sql.="AND gid!=? "; }
				my $sth=$session->{dbh}->prepare($sql);
				   $sth->bind_param(1,$name,1);
				   $sth->bind_param(2,$gid,3) if($proc eq 'edit');
				   $sth->execute();
				my($other,$other_alpha)=$sth->fetchrow; $sth->finish;
				if($other){
					my $dup_err=t_("指定した%1は、既に使用されているため使用できません。",$proc_tag);
					if ( DA::MasterManager::is_new_or_ready($session, $t_msid ) ) {
						$dup_err = DA::MasterManager::FUTURE_DATA_ERR_MSG($dup_err);
					}
					DA::CGIdef::errorpage($session,"$dup_err",'noname');
				}
			}
		}

		my $new_user={}; # 組織、グループ、役職グループの場合の所属ユーザのリスト
		my @mid_list;    # 組織の場合のprimary 所属ユーザのリスト
		if($proc eq 'add'){
			if ( DA::MasterManager::is_array_first( \@target_msid, $t_msid) ) {
				$add_gid = $db_data->{gid} = DA::IS::get_count($session,'gid',undef,undef,1);
			} else {
				$db_data->{gid} = $add_gid;
			}
			if (DA::MultiLang::master_ok()) {
				foreach my $l (@{DA::IS::get_lang_list($session)}) {
					$lang_data->{$l->{code}}->{gid} = $db_data->{gid};
				}
			}
		}
		if($type eq '1'){
			foreach my $id(keys %{$block->{A_USERSEL}}){
				$new_user->{$id}=$db_data->{gid};
				if(int($id) > 0){push(@mid_list,$id);}
			}
			foreach my $id(keys %{$block->{S_USERSEL}}){
				$new_user->{$id}=$db_data->{gid};
			}

			# 組織の場合
			my %pri_list;
			foreach my $id(keys %{$block->{USERSEL}}){
				if(int($id) > 0){$pri_list{$id}=1;}
			}
			my $sql="SELECT mid,primary_gid FROM $member_table";
			my $sth=$session->{dbh}->prepare($sql); $sth->execute();
			while(my $data = $sth->fetchrow_hashref('NAME_lc')) {
				if ($pri_list{$data->{mid}} && $data->{primary_gid} ne $db_data->{gid}) {
					push(@mid_list,$data->{mid});
				}
			}
			$sth->finish();
		}else{
			foreach my $id(keys %{$block->{USERSEL}}){
				$new_user->{$id}=$db_data->{gid};
			}
		}
		if($proc eq 'add'){
			if($type eq '3'){
				$db_data->{grade} = $db_data->{gid};
			}
			$old_name=$name;
		}else{
			my $sql="SELECT name,kana,alpha,parent,grade,sort_level FROM $group_table WHERE gid=?";
			my $sth=$session->{dbh}->prepare($sql);
			   $sth->bind_param(1,$db_data->{gid},3); $sth->execute();
			($old_name,$old_kana,$old_alpha,$old_parent,$old_grade,$old_sort)=$sth->fetchrow; $sth->finish;
			if($type eq '3'){ $db_data->{grade} = $old_grade; }

			my $g_sql="SELECT mid FROM $gm_table WHERE gid=? AND attr IN ('1','2')";
			my $g_sth=$session->{dbh}->prepare($g_sql);
			   $g_sth->bind_param(1,$db_data->{gid},3); $g_sth->execute();
			while(my($mid)=$g_sth->fetchrow){
				if($new_user->{$mid}){
					delete $new_user->{$mid};
				}
			}
			$g_sth->finish;
		}
		my $update_session={};
		if (DA::MultiLang::master_ok()) {
			my %names;
			$names{'common'} = $lang_data->{$DA::Vars::p->{multi_lang_master}->{default_lang}}->{name};
			foreach my $l (@{DA::IS::get_lang_list($session)}) {
				if ($lang_data->{$l->{code}}->{name} ne '') {
					$names{$l->{code}} = $lang_data->{$l->{code}}->{name};
				}
			}
			$update_session->{primary_gname} = \%names;
		} else {
			$update_session->{primary_gname} = $name;
		}

		$update_session->{primary_gname_ja} = $name;
		$update_session->{primary_gkana}	= $kana;
		$update_session->{primary_galpha}	= $alpha;
		$update_session->{primary_gtype}	= $type;
		
		#======================================================
		#			  ----custom----
		#======================================================
		DA::Custom::check_group_modify($session, $db_data->{gid}, $t_msid, $tid) if (DA::IS::cbp_execute_ok($session, $t_msid));

		# 未来世代が対象の場合は現在世代にしか存在しないユーザ・グループは削除
		if ( DA::MasterManager::is_new_or_ready($session, $t_msid ) ) {
			my @tmp_mid_list;
			foreach my $id ( @mid_list ) {
				push(@tmp_mid_list , $id ) unless ( $active_only_gm->{$id} );
			}
			@mid_list = @tmp_mid_list;
		}

		$msid_data->{$t_msid}->{old_name}   = $old_name;
		$msid_data->{$t_msid}->{old_kana}   = $old_kana;
		$msid_data->{$t_msid}->{old_parent} = $old_parent;
		$msid_data->{$t_msid}->{old_grade}  = $old_grade;
		$msid_data->{$t_msid}->{old_sort}   = $old_sort;
		$msid_data->{$t_msid}->{old_alpha}  = $old_alpha;
		$msid_data->{$t_msid}->{primary}    = $primary;
		
		$msid_data->{$t_msid}->{db_data}     = $db_data;
		$msid_data->{$t_msid}->{update_session} = $update_session;
		$msid_data->{$t_msid}->{new_user}    = $new_user;
		$msid_data->{$t_msid}->{lang_data}   = $lang_data;
		$msid_data->{$t_msid}->{mid_list}    = \@mid_list;
	
	} # END OF generation

	DA::Session::trans_init($session);
	eval {
		### 2世代対応
		foreach my $t_msid ( @target_msid ) {
			my $member_table = DA::IS::get_member_table($session, "TBL", $t_msid);
			my $group_table  = DA::IS::get_group_table($session,  "TBL", $t_msid);
			my $gm_table     = DA::IS::get_master_table($session, "is_group_member", $t_msid);
		
			my $c_msid_data 	= $msid_data->{$t_msid};
			
			# restore msid_data 
			my $old_name   = $c_msid_data->{old_name};   
			my $old_kana   = $c_msid_data->{old_kana};   
			my $old_parent = $c_msid_data->{old_parent};
			my $old_grade  = $c_msid_data->{old_grade};
			my $old_sort   = $c_msid_data->{old_sort};  
			my $old_alpha  = $c_msid_data->{old_alpha};
			my $primary    = $c_msid_data->{primary};

			my $db_data        = $c_msid_data->{db_data};
			my $update_session = $c_msid_data->{update_session};
			my $new_user       = $c_msid_data->{new_user};
			my $lang_data      = $c_msid_data->{lang_data};
			my $tmp_mid_list   = $c_msid_data->{mid_list};
			my @mid_list       = @{$tmp_mid_list};
			my $parent         = $db_data->{parent};

			my($remake, $tree_remake);
			my $primary_members={};
			my $group_table_mm = DA::IS::get_group_table($session, "TBL", $t_msid);
			my $need_group_all_update = 0;
			if($proc eq 'add'){
				DA::IS::delete_ud_group_cache($session, $db_data->{parent}, 2, $t_msid);

				# 2世代が対象の場合に一度しか実行しない処理
				my $option= {};
				if ( DA::MasterManager::is_array_first( \@target_msid, $t_msid) ) {
					DA::Admin::group_mkdir($session,$db_data->{gid});
				}
				DA::DB::group_add($session,$db_data, $option, $t_msid);
				DA::DB::group_add_multi($session,$lang_data, $t_msid);
				if($type eq '1'){ $remake=1; }
				$tree_remake = 1;

				DA::IS::save_sdb_process_superior($session, $db_data->{gid}, $block, $t_msid);
			}else{
				# 親組織の変更時以外は統合クリッピング用階層情報の更新を行わない
				my $option = {};
				if ($db_data->{gid} eq $DA::Vars::p->{top_gid}) {
					$option->{'no_make_path'} = 1;
				} elsif ($parent eq $old_parent) {
					$option->{'no_make_path'} = 1;
				} else {
					$option->{'no_make_path'} = 0;
				}
				# キャッシュのクリア
				if ($db_data->{gid} ne $DA::Vars::p->{top_gid}) {
					if ($parent ne $old_parent) {
						DA::IS::delete_ud_group_cache($session, $db_data->{gid}, undef, $t_msid);
						DA::IS::delete_ud_group_cache($session, $parent,         undef, $t_msid);
					}
				}
				DA::DB::group_update($session,$db_data,$option,$t_msid);
				my $changed_multi_data = DA::DB::group_update_multi($session,$lang_data, $t_msid);

				if ($changed_multi_data) {
					$tree_remake = 1;
					$need_group_all_update = 1
				}

				if(DA::IS::group_type($type, $org_type) =~ /[12]/) {
					if($gid ne $DA::Vars::p->{top_gid}){
						if($parent ne $old_parent){
							$remake=1;
							$tree_remake = 1;
						}
					}
					if($name ne $old_name || $kana ne $old_kana || $alpha ne $old_alpha){
						$need_group_all_update = 1;
						$tree_remake = 1;
					}
					if($sort_level ne $old_sort){
						$tree_remake = 1;
					}
				}else{
					if($name ne $old_name || $kana ne $old_kana || $alpha ne $old_alpha){
						$tree_remake = 1;
					}
				}
				if($multi_msid && $t_msid eq $before_active_msid && DA::IS::group_type($type, $org_type) eq '1'){
					my $sql="SELECT mid FROM $gm_table WHERE gid=? AND attr='1' ";
					my $sth=$session->{dbh}->prepare($sql);
					   $sth->bind_param(1,$db_data->{gid},3); $sth->execute();
					while(my $mid = $sth->fetchrow) {
						$primary_members->{$mid}=1;
					}
					$sth->finsih;
				}
				
				my $d_sql="DELETE FROM $gm_table WHERE gid=? AND attr IN ('1','2','3','4','5','6') ";
				my $d_sth=$session->{dbh}->prepare($d_sql);
				   $d_sth->bind_param(1,$db_data->{gid},3);
				   $d_sth->execute();

				DA::IS::save_sdb_process_superior($session, $db_data->{gid}, $block, $t_msid);
			}

			## プライマリ所属を指定した場合
			## 以前のプライマリ所属情報を削除
			if($type eq '1'){
				if(@mid_list){
					my @w_list=@mid_list;
					while(1){
						if(!@w_list){last;}
						my @list=splice(@w_list,0,800);
						my $mid_where=join(',',@list);
						my $d_sql ="DELETE FROM $gm_table "
							 ."WHERE mid IN ($mid_where) AND attr='1' AND "
							 ."(type=1 OR gid IN (SELECT gid FROM $group_table_mm WHERE type=4 AND org_type=1))";
						my $d_sth=$session->{dbh}->prepare("$d_sql");
						   $d_sth->execute();
					}
				}
			}

			my $i_sql="INSERT INTO $gm_table"
				."(gid,mid,type,attr,auth_type,real_gid,exp,"
				."owner01,owner02,owner03,owner04,owner05,owner06,owner07,owner08,"
				."owner09,owner10,owner11,owner12,owner13,owner14,owner15,owner16,"
				."owner17,owner18,owner19,owner20) "
				."VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
			my $i_sth = $session->{dbh}->prepare($i_sql);

			my $null = undef;
			$i_sth->execute($db_data->{gid},$primary,$type,'3',$null,0,$null,
								   $null,$null,$null,$null,$null,
								   $null,$null,$null,$null,$null,
								   $null,$null,$null,$null,$null,
								   $null,$null,$null,$null,$null);

			foreach my $id(keys %{$block->{SO_USERSEL}}){
				if (!$id) { next; }
				my $m_attr='4';
				if(int($id) >= $DA::Vars::p->{top_gid}){$m_attr='6';}
				
				if ( DA::MasterManager::is_new_or_ready($session, $t_msid ) ){
					next if ( $active_only_gm->{$id} );
					#  未来で一般ユーザ以外の場合はskip 
					next if ( $DA::Vars::p->{top_gid} >= $id && DA::MasterManager::get_id_type($session, $id, $t_msid) ne $DA::Vars::p->{u_type}->{gen} );
				}
					
				my $auth_type;
				if($block->{SOWNER_TYPE}->{$id}){$auth_type='1';}
				my(@owner)=split(/\,/,$block->{SOWNER_AUTH}->{$id});
				for(my $i=0;$i<20;$i++){if(!$owner[$i]){$owner[$i]=$null;}}
				$i_sth->execute($db_data->{gid},$id,$type,$m_attr,$auth_type,0,$null,
						$owner[0],$owner[1],$owner[2],$owner[3],$owner[4],
						$owner[5],$owner[6],$owner[7],$owner[8],$owner[9],
						$owner[10],$owner[11],$owner[12],$owner[13],$owner[14],
						$owner[15],$owner[16],$owner[17],$owner[18],$owner[19]);
			}
			foreach my $id(keys %{$block->{USERSEL}}, keys %{$block->{A_USERSEL}}){
				if (!$id) { next; }
				next if ( DA::MasterManager::is_new_or_ready($session, $t_msid)  && $active_only_gm->{$id} );

				if(DA::IS::group_type($type, $org_type) eq '2' && int($id) >= $DA::Vars::p->{top_gid}){
					$i_sth->execute($db_data->{gid},$id,$type,'5',$null,0,$null,
								  $null,$null,$null,$null,$null,
								  $null,$null,$null,$null,$null,
								  $null,$null,$null,$null,$null,
								  $null,$null,$null,$null,$null);
				}else{
					$i_sth->execute($db_data->{gid},$id,$type,'1',$null,0,$null,
								  $null,$null,$null,$null,$null,
								  $null,$null,$null,$null,$null,
								  $null,$null,$null,$null,$null,
								  $null,$null,$null,$null,$null);
					delete $primary_members->{$id} if $primary_members->{$id};
				}
			}
			my @primarys;
			foreach my $id(keys %{$primary_members}){
				if (!$id) { next; }
				$i_sth->execute($DA::Vars::p->{top_gid},$id,$type,'1',$null,0,$null,
						$null,$null,$null,$null,$null,
						$null,$null,$null,$null,$null,
						$null,$null,$null,$null,$null,
						$null,$null,$null,$null,$null);
				push(@primarys, $id);
			}
			
			foreach my $id(keys %{$block->{S_USERSEL}}){
				if (!$id) { next; }
				next if ( DA::MasterManager::is_new_or_ready($session, $t_msid )  && $active_only_gm->{$id} );
				$i_sth->execute($db_data->{gid},$id,$type,'2',$null,0,$null,
							  $null,$null,$null,$null,$null,
							  $null,$null,$null,$null,$null,
							  $null,$null,$null,$null,$null,
							  $null,$null,$null,$null,$null);
			}

			if(@mid_list){
				my @w_list=@mid_list;
				while(1){
					if(!@w_list){last;}
					my @list=splice(@w_list,0,800);
					my $mid_where=join(',',@list);
					my $u_sql="UPDATE $member_table SET primary_gid=?,"
						."primary_gname=?,primary_gkana=?,primary_galpha=?,primary_gtype=? "
						."WHERE mid IN ($mid_where) ";
					my $u_sth=$session->{dbh}->prepare($u_sql);
					   $u_sth->bind_param(1,$db_data->{gid},3);
					   $u_sth->bind_param(2,$name,1);
					   $u_sth->bind_param(3,$kana,1);
					   $u_sth->bind_param(4,$alpha,1);
					   $u_sth->bind_param(5,$type,3);
					   $u_sth->execute();
					$need_group_all_update = 1;
				}
			}
			if(@primarys){
				my $sql="SELECT name,kana,alpha,type FROM $group_table WHERE gid=? ";
				my $sth=$session->{dbh}->prepare($sql);
        		   $sth->execute($DA::Vars::p->{top_gid});
        		my $data=$sth->fetchrow_hashref('NAME_lc'); $sth->finish;
				my @w_list=@primarys;
				while(1){
					if(!@w_list){last;}
					my @list=splice(@w_list,0,800);
					my $mid_where=join(',',@list);
					my $d_sql="DELETE FROM $gm_table WHERE mid IN ($mid_where) AND gid = ? AND attr = ? ";
					my $d_sth=$session->{dbh}->prepare($d_sql);
					   $d_sth->bind_param(1,$DA::Vars::p->{top_gid},3);
					   $d_sth->bind_param(2,2,1);
					   $d_sth->execute();

					my $u_sql="UPDATE $member_table SET primary_gid=?,"
						."primary_gname=?,primary_gkana=?,primary_galpha=?,primary_gtype=? "
						."WHERE mid IN ($mid_where) ";
					my $u_sth=$session->{dbh}->prepare($u_sql);
					   $u_sth->bind_param(1,$DA::Vars::p->{top_gid},3);
					   $u_sth->bind_param(2,$data->{name}, 1);
					   $u_sth->bind_param(3,$data->{kana}, 1);
					   $u_sth->bind_param(4,$data->{alpha},1);
					   $u_sth->bind_param(5,$data->{type}, 3);
					   $u_sth->execute();

					DA::Admin::update_user_group4multiLang($session,$t_msid,$mid_where,$DA::Vars::p->{top_gid});
				}
			}

			# 所属ユーザのis_member、session情報の更新を行う
			if ($need_group_all_update) {
				if ($type eq '4') {
					my ($u_data, $u_session) = DA::DB::get_group_all_update($session, $db_data->{gid}, 'suspend', $t_msid);
					DA::DB::group_all_update($session,$u_data,$u_session,$lang_data,$t_msid);
				} else {
					DA::DB::group_all_update($session,$db_data,$update_session,$lang_data,$t_msid);
				}
			}

			if($remake && DA::IS::group_type($type, $org_type) eq '1'){
				DA::DB::remake_target_group_path($session,$db_data->{gid},$proc,$t_msid);
			}

			# セッションの管理可能組織一覧を更新
			if ($proc eq 'add') {
				DA::IS::remake_ctrlable_gid_all($session,$parent);
			} else {
				DA::IS::remake_ctrlable_gid_all($session,$db_data->{gid});
				my ($cur_parent_gid,$cur_parent_type,$cur_parent_name) = split(/\:/, $block->{PARAM}->{cur_parent}); 
				if ($cur_parent_gid && $cur_parent_gid ne $parent) {
					DA::IS::remake_ctrlable_gid_all($session,$cur_parent_gid);
				}
			}

			my $admin_log={};
			my $today = DA::CGIdef::get_date("Y4/MM/DD-HH:MI:SS");
			$admin_log->{s_date} = substr($today,0,10);
			$admin_log->{s_time} = substr($today,11,8);
			$admin_log->{msid}	 = $t_msid;
			if($proc eq 'add'){
				$admin_log->{func} = "group_add";
				$admin_log->{log}  = N_("グループ：%1を追加しました。","$old_name($db_data->{gid})");
			}else{
				$admin_log->{func} = "group_update";
				$admin_log->{log}  = N_("グループ：%1を変更しました。","$old_name($db_data->{gid})");
			}
			DA::DB::admin_log($session,$admin_log);
			
			$msid_data->{$t_msid}->{tree_remake} = $tree_remake;
		}
	};
	if(!DA::Session::exception($session, undef, $tid)){
		DA::Session::admin_all_unlock($session);
		DA::Error::system_error($session, 1);
	}
	DA::Session::admin_all_unlock($session);

	## 2世代対応
	foreach my $t_msid ( @target_msid ) {
		my $c_msid_data  = $msid_data->{$t_msid};

		my $db_data			= $c_msid_data->{db_data};
		my $new_user		= $c_msid_data->{new_user};
		my $tree_remake		= $c_msid_data->{tree_remake};
		my $tmp_mid_list	= $c_msid_data->{mid_list};
		
		if (DA::MasterManager::is_active($session, $t_msid)) {
			my @mid_list = @{$tmp_mid_list};
			if(@mid_list) {
				foreach my $id(@mid_list){
					if (!$id) { next; }
					if (-f "$DA::Vars::p->{data_dir}/master/$id/.base.dat") {
						my $user_session={};
						$user_session->{user}=$id;
						my $base_p = DA::IS::get_master($user_session,'base',2);
						$base_p->{cust_top} =$db_data->{gid};
						$base_p->{cust_open}=$db_data->{gid};
						DA::IS::save_master($user_session,$base_p,'base');
					}
				}
			}
		}
		if($tree_remake){
			DA::Admin::update_group_cache($session, $gid, $t_msid);
			DA::Admin::restore_struct($session, DA::IS::group_type($type, $org_type), undef, undef, $t_msid);
		}

		if (DA::MasterManager::is_active($session, $t_msid)) {
			foreach my $id(keys %$new_user){
				if (!$id) { next; }
				my %g_list;
				$g_list{$db_data->{gid}}="1=$db_data->{gid}";
				DA::IS::remake_faivorite($session,$id,\%g_list);
			}
		}
		DA::IS::set_group_timestamp($session, $t_msid);
	}

	return $msid_data->{$msid}->{db_data};
}

sub restore_submit{
    my($session,$query,$option)=@_;
	my $msid = DA::MasterManager::get_select_msid($session);
    DA::Session::check_maintenance_admin($session,1);
    DA::Session::check_lock_admin($session,1);
    my $gid	= &check_gid($query->param('gid'));
    my $org_type = $query->param('org_type');
	
	if ($gid && !DA::IS::is_ctrlable_group($session,$gid)) {
        DA::CGIdef::errorpage($session, t_('管理権限がありません。'), "$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?msid=$msid");
    }
    
	DA::Admin::group_lock($session,$gid);
	my @target_msid = DA::MasterManager::get_update_target_msid($session, $msid, ( $query->param('future')  ? 1: 0 ), $gid);
	my $target_msid_hash ={};

    DA::Session::trans_init($session); 
	eval {
		### 2世代対応
		foreach my $t_msid ( @target_msid ) {
			# $gidのtypeが4の場合だけ復帰処理を実施
			my $gp_table = DA::IS::get_group_table($session,'TBL',$t_msid);
			my $sql="SELECT type,org_type FROM $gp_table WHERE gid=? ";
			my $sth=$session->{dbh}->prepare($sql);
			   $sth->bind_param(1, $gid, 3); $sth->execute();
			my ($type, $org_type) = $sth->fetchrow(); $sth->finish;
	
			next if ( $type ne $DA::Vars::p->{g_type}->{temp} );
	
			$target_msid_hash->{$t_msid}->{org_type} = $org_type;

			my $g_name=DA::IS::get_default_name($session,$gid, $t_msid);
			my $admin_log	= {};
       		my $today		= DA::CGIdef::get_date("Y4/MM/DD-HH:MI:SS");
       		$admin_log->{s_date}= substr($today,0,10);
       		$admin_log->{s_time}= substr($today,11,8);
       		$admin_log->{func} 	= "group_suspend";
			$admin_log->{msid}  = $t_msid;
       		$admin_log->{log}  	= N_("グループ：%1を復帰しました。","$g_name($gid)");
       		DA::DB::admin_log($session,$admin_log);

			DA::Admin::group_restore($session, $gid, $option, $t_msid);

        	if ($org_type eq 1) {
            	my $lowers = DA::Admin::get_group_lowers($session, $gid, $t_msid);
            	push(@{$lowers}, $gid);
            	foreach my $gid (@{$lowers}) {
                	my ($db_data, $update_session)=DA::DB::get_group_all_update($session, $gid, 'restore', $t_msid);
                	DA::DB::group_all_update($session, $db_data, $update_session, undef, $t_msid);
            	}
        	}
		} # END of generation 

        # セッションの管理可能組織一覧を更新
        if ($gid) { DA::IS::remake_ctrlable_gid_all($session,$gid); }
	};
	if(!DA::Session::exception($session)){ 
		DA::Error::system_error($session); 
	}
	DA::Session::admin_all_unlock($session);
	
	### 2世代対応
	foreach my $t_msid ( keys %{$target_msid_hash} ) {
		my $org_type = $target_msid_hash->{$t_msid}->{org_type};
		DA::Admin::restore_struct($session, $org_type, undef, undef, $t_msid);
		DA::IS::set_group_timestamp($session, $t_msid);
	}
}

sub suspend_submit{
    my($session,$query)=@_;
	my $msid = DA::MasterManager::get_select_msid($session);
    DA::Session::check_maintenance_admin($session,1);
    DA::Session::check_lock_admin($session,1);
    my $gid	= &check_gid($query->param('gid'));
	if ($gid && !DA::IS::is_ctrlable_group($session,$gid)) {
        DA::CGIdef::errorpage($session, t_('管理権限がありません。'), "$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?msid=$msid");
    }
	
	my @target_msid = DA::MasterManager::get_update_target_msid($session, $msid, ( $query->param('future')  ? 1: 0 ), $gid);
	my $target_msid_hash={};
    DA::Admin::group_lock($session,$gid);

    DA::Session::trans_init($session); 
	eval {
		### 2世代対応
		foreach my $t_msid ( @target_msid ) {
			# $gidのtypeが1,2,3の場合だけ廃止処理を実施
			my $gp_table = DA::IS::get_group_table($session,'TBL',$t_msid);
			my $sql="SELECT type FROM $gp_table WHERE gid=? ";
			my $sth=$session->{dbh}->prepare($sql);
			   $sth->bind_param(1, $gid, 3); $sth->execute();
			my $type=$sth->fetchrow(); $sth->finish;
			my $not_suspend_type_p = "$DA::Vars::p->{g_type}->{org}$DA::Vars::p->{g_type}->{work}$DA::Vars::p->{g_type}->{title}";
			if ($type =~ /^[$not_suspend_type_p]$/) {
				$target_msid_hash->{$t_msid}->{type} = $type;

				my $g_name=DA::IS::get_default_name($session,$gid, $t_msid);
				my $admin_log	= {};
   	    		my $today		= DA::CGIdef::get_date("Y4/MM/DD-HH:MI:SS");
    	   		$admin_log->{s_date}= substr($today,0,10);
    	   		$admin_log->{s_time}= substr($today,11,8);
    	   		$admin_log->{func} 	= "group_suspend";
				$admin_log->{msid}  = $t_msid;
       			$admin_log->{log}  	= N_("グループ：%1を廃止しました。","$g_name($gid)");
       			DA::DB::admin_log($session,$admin_log);
	
				DA::Admin::group_suspend($session, $gid, $t_msid);
				if ($type eq 1) {
					my $lowers = DA::Admin::get_group_lowers($session, $gid, $t_msid);
					push(@{$lowers}, $gid);
					foreach my $gid (@{$lowers}) {
						my ($db_data, $update_session) = DA::DB::get_group_all_update($session, $gid, 'suspend', $t_msid);
						DA::DB::group_all_update($session, $db_data, $update_session, undef, $t_msid);
					}
				}
			}
		}

        # セッションの管理可能組織一覧を更新
        if ($gid) { DA::IS::remake_ctrlable_gid_all($session,$gid); }
	};
	if(!DA::Session::exception($session)){ 
		DA::Error::system_error($session); 
	}
	DA::Session::admin_all_unlock($session);

	### 2世代対応
	foreach my $t_msid ( keys %{$target_msid_hash} ) {
		my $type = $target_msid_hash->{$t_msid}->{type};
		DA::Admin::restore_struct($session, $type, undef, undef, $t_msid);
		DA::IS::set_group_timestamp($session, $t_msid);
	}
}

sub del_submit{
    my($session,$query)=@_;
	my $msid = DA::MasterManager::get_select_msid($session);
	my $is_active = DA::MasterManager::is_active_from_session($session, $msid);
    DA::Session::check_maintenance_admin($session,1);
    DA::Session::check_lock_admin($session,1);
    my $num			= $query->param('num');
    my $p_gid		= &check_gid($query->param('gid'));
    my $p_type		= $query->param('type');
    my $p_org_type	= $query->param('org_type');
	my $store		= $query->param('store');

	my $group_list = [];
	if ($store) {
		my $store_select_file	= "$session->{sid}\-suspend_list_selected\-$store\.$num";
		$group_list = DA::IS::get_temp_db($session, $store_select_file);
	} else {
		if ($p_gid && !DA::IS::is_ctrlable_group($session,$p_gid)) {
        	DA::CGIdef::errorpage($session, t_('管理権限がありません。'), "$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?msid=$msid");
    	}
		push(@{$group_list}, "$p_gid:$p_type:$p_org_type");
	}
	
	my $fu_msid;
	my $msid = DA::MasterManager::get_select_msid($session);
	if ( DA::MasterManager::is_active_from_session($session) ) {
		$fu_msid = DA::MasterManager::exists_before_active($session);
	}

	my $target_msid;
	foreach my $group (@{$group_list}) {
		my ($gid, $type, $org_type) = split(/\:/, $group);
		push( @{$target_msid->{$gid}}, $msid);
		if ( DA::MasterManager::is_active_from_session($session) ) {
			if ( $fu_msid) {
				if( DA::MasterManager::check_future_id($session, $gid, $fu_msid) ) {
					push( @{$target_msid->{$gid}}, $fu_msid) ;
				}
			}
		}
		&user_check($session,$gid,undef,$target_msid->{$gid},1);
	}
	my ($delete_user, $undel);
	my $restore_type = {};
	foreach my $group (@{$group_list}) {
		my ($gid, $type, $org_type) = split(/\:/, $group);
		my $undel = DA::MasterManager::check_delete_id($session, $gid, $msid);
		if ($undel) {
			DA::CGIdef::errorpage($session,$undel,'noname');
		}
		
		# 世代別データチェック
		my @target_msid = @{$target_msid->{$gid}};
		foreach my $t_msid (@target_msid) {
			if ($t_msid ne $msid) {
				($type, $org_type) = &get_group_type($session, $gid, $t_msid, 1);
			}

			if (DA::IS::group_type($type, $org_type) =~ /1|2/) {
				$restore_type->{$t_msid}->{'1'} = 1; 
			} else {
				$restore_type->{$t_msid}->{'3'} = 1; 
			}
			if ($type ne 4) {
				my $block;
				if ($t_msid eq $msid) {
					$block = DA::IS::get_data_parse($session,"group_list.$num");
					if(!$block){return;}
				} else {
					$block = DA::IS::get_group_member_data($session,$gid,'1',$t_msid);
				}
				if($type  eq '1'){
					foreach my $id(keys %{$block->{USERSEL}}){
						if(int($id) > 0){
							my $err = t_("プライマリ所属ユーザが存在する組織は削除できません。");
							if (!DA::MasterManager::is_active_from_session($session, $t_msid)){ 
								$err = DA::MasterManager::FUTURE_DATA_ERR_MSG($err);
							}
							DA::CGIdef::errorpage($session,$err,'noname');
						}
					}
				}
			} else {
				$type = $org_type;
			}
		}
		if ($org_type eq 1) {
			my $user_list = &get_group_member_list($session, $gid, $org_type, \$undel, 2);
			if ($undel) {
				DA::CGIdef::errorpage($session,$undel,'noname');
			}
			push (@{$delete_user}, keys %{$user_list});
		}
		
		DA::Admin::group_delete_all($session, $gid, $type, $msid, \@target_msid);
	}
	
   	DA::Session::admin_all_unlock($session);

	foreach my $mid (@{$delete_user}) {
		my @target_m = DA::MasterManager::get_update_target_msid($session, $msid, 1, $mid);
		DA::Admin::delete_user_all($session, $mid, $msid, \@target_m);
	}

    # セッションの管理可能組織一覧を更新
    if ($p_gid) { DA::IS::remake_ctrlable_gid_all($session,$p_gid); }

	if ($is_active) {
		DA::IS::remake_is_member_count($session, 1);
	}
	my @targets = ($msid);
	if ($is_active) {
		my $fu_msid = DA::MasterManager::exists_before_active($session);
		push (@targets, $fu_msid) if ($fu_msid);
	}
	foreach my $t_msid (@targets) {
		foreach my $type (keys %{$restore_type->{$t_msid}}) {
			DA::Admin::restore_struct($session, $type, undef, undef, $t_msid);
		}
		DA::IS::set_group_timestamp($session, $t_msid);
		DA::IS::set_member_timestamp($session, $t_msid) if (@{$delete_user});
	}
}

sub user_check{
    my($session,$gid,$block,$target_msid)=@_;
    my @id_list;
    if($block){
        foreach my $id(keys %{$block->{PO_USERSEL}}){
            push(@id_list,$id);
        }
        foreach my $id(keys %{$block->{SO_USERSEL}}){
            push(@id_list,$id);
        }
        foreach my $id(keys %{$block->{S_USERSEL}}){
            push(@id_list,$id);
        }
        foreach my $id(keys %{$block->{A_USERSEL}}){
            push(@id_list,$id);
        }
    }
	foreach my $t_msid (@$target_msid) {
		my $gm_table = DA::IS::get_master_table($session, "is_group_member", $t_msid);
		my $sql="SELECT mid FROM $gm_table WHERE gid=?";
		my $sth=$session->{dbh}->prepare($sql);
		$sth->bind_param(1,$gid,3); $sth->execute();
		while(my($mid)=$sth->fetchrow){
		    push(@id_list,$mid);
		}
		$sth->finish;
	}

    DA::Admin::user_lock_check($session,$gid,\@id_list,undef,1);
}

sub html_maker {
	my ($obj, $c) = @_;

    $obj->{name}=DA::IS::check_view_name($c,$obj->{name},$obj->{alpha});
    $obj->{name}=DA::CGIdef::encode($obj->{name},0,1,'euc');
	my($icon, $icon_add);
	if ($obj->{type} eq 4) {
        my $v_name=DA::IS::get_ug_name($c->{session},0,$obj->{id},$obj->{type},$obj->{name},'','',1,$obj->{org_type});
		$obj->{name} = $v_name->{name};
		if ($obj->{org_type} eq '3') {
			$icon = 
				"<img src='$c->{img_dir}/ico_fc_executive_rpl.gif' ".
				"align=absmiddle border=0 width=14 height=14>";
		} elsif ($obj->{org_type} eq '2') {
			$icon = 
				"<img src='$c->{img_dir}/ico_fc_work_rpl.gif' ".
				"align=absmiddle border=0 width=14 height=14>";
		} elsif ($obj->{org_type} eq '1') {
     		$icon = 
				"<img src='$c->{img_dir}/ico_fc_organization_rpl.gif' ".
				"align=absmiddle border=0 width=14 height=14>"
		}
	} else {
		if ($obj->{type} eq '1') {
     		$icon = 
				"<img src='$c->{img_dir}/ico_fc_organization.gif' ".
				"align=absmiddle border=0 width=14 height=14>"
					if ($obj->{id} ne $c->{top});
			$icon_add =
				"<a href='$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi".
				"?view=tree&proc=add&add=add&add_g=1&parent=$obj->{id}&view_lang=$c->{user_lang}&msid=$c->{msid}'>".
				"<img src='$c->{img_dir}/ico_fc_addorg.gif' align=absmiddle ".
				"border=0 width=14 height=14 title='@{[t_('組織追加')]}'></a>".
				"<a href='$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?".
				"view=tree&proc=add&add=add&add_p=1&parent=$obj->{id}&view_lang=$c->{user_lang}&msid=$c->{msid}'>".
				"<img src='$c->{img_dir}/ico_fc_addproj.gif' align=absmiddle ".
				"border=0 width=14 height=14 title='@{[t_('プロジェクト追加')]}'></a>";
		} elsif($obj->{type} eq '2') {
			$icon = 
				"<img src='$c->{img_dir}/ico_fc_project.gif' ".
				"align=absmiddle border=0 width=14 height=14>";
		} else {
			$icon = 
				"<img src='$c->{img_dir}/ico_fc_executive.gif' ".
				"align=absmiddle border=0 width=14 height=14>";
		}
	}

	if ($c->{use_custom}) {
		$icon_add.="<a href=\"$DA::Vars::p->{ad_cgi_rdir}/group_ext.cgi?init=1&";
		$icon_add.="view=tree&gid=$obj->{id}&view_lang=$c->{user_lang}&msid=$c->{msid}\">";
		$icon_add.="<img src=\"$c->{img_dir}/aqbtn_detail.gif\" ";
		$icon_add.="border=0 width=50 height=14 title=\"".t_("詳細情報")."\" align=absmiddle></a>";
	}
	
	#============================
	#   ---- custom ----
	#============================
	DA::Custom::add_group_tree_func($obj, $c, \$icon_add);
	#============================

    my $html = "";
    if ($c->{limited_admin} && !$c->{ctrlable_gid}->{$obj->{id}}) {
        $html =
            "<td nowrap>".
            "$icon</td><td nowrap>&nbsp;".
            "$obj->{name}</td><td>&nbsp;".
            "</td>";
    } else {
        $html =
            "<td nowrap>".
            "<a href=\"$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?".
            "gid=$obj->{id}&type=$obj->{type}&view=tree&edit=edit&view_lang=$c->{user_lang}&msid=$c->{msid}\">".
            "$icon</a></td><td nowrap>&nbsp;".
            "<a href=\"$DA::Vars::p->{ad_cgi_rdir}/group_list.cgi?".
            "gid=$obj->{id}&type=$obj->{type}&view=tree&edit=edit&view_lang=$c->{user_lang}&msid=$c->{msid}\">".
            "$obj->{name}</a></td><td>&nbsp;$icon_add".
            "</td>";
    }

	return $html;
}
sub del_target{
    my($session,$query,$block)=@_;
    my $del_id = $query->param('del_target_id');
    if($query->param('del_target') eq 'user'){
        delete $block->{USERSEL}->{$del_id};
    }elsif($query->param('del_target') eq 'a_user'){
        delete $block->{A_USERSEL}->{$del_id};
    }elsif($query->param('del_target') eq 's_user'){
        delete $block->{S_USERSEL}->{$del_id};
    }elsif($query->param('del_target') eq 'so_user'){
        delete $block->{SO_USERSEL}->{$del_id};
    }elsif($query->param('del_target') eq 'u_user'){
        delete $block->{U_USERSEL}->{$del_id};
    }elsif($query->param('del_target') eq 'ua_user'){
        delete $block->{UA_USERSEL}->{$del_id};
    }
}
sub set_location_default {
    my $p       = shift;
    my $kana    = shift;

    $kana           = DA::CGIdef::jsubstr($kana, 0, 2);
    my $charNum     = DA::Address::get_char_num($kana);
    $p->{'charNum'} = DA::Address::alphaNum2charNum($charNum);
    $p->{'target'}  = DA::Address::get_return_default_target($p->{'target'});
}

# -----------------------------------------------------------------------------
# □ 登録したデータの適切なcharNumとtargetの設定を行う
# $db_dataはsql_quoteされたデータのため''(シングルクオート)されたデータである
# -----------------------------------------------------------------------------
sub set_location_target {
    my $p       = shift;
    my $db_data = shift;

    my $kana;
    if ($db_data->{kana}    =~ /^\'(.+)\'+$/) {
        $kana = $1;
    }

    if ($p->{'target'} =~ /^(?:25)/) {
        # alphabet順
        my $alpha;
        if ($db_data->{alpha} =~ /^\'(.+)\'+$/) {
            $alpha = $1;
        } else {
            $alpha = "";
        }
        if ($alpha ne '') {
            my $old_charNum = $p->{'charNum'};
            my $alpha       = DA::CGIdef::jsubstr($alpha, 0, 2);
            $p->{'charNum'} = DA::Address::get_char_num($alpha);
            if ($p->{'charNum'} ne $old_charNum) {
                $p->{m_page} = "1";
            }
        } else {
            set_location_default($p, $kana);
            $p->{m_page} = "1";
        }
    } else {
		my $target_column = "kana";
        # ふりがな順
        my $data = {};
        if ($db_data->{$target_column} =~ /^\'(.+)\'+$/) {
            $data->{$target_column}   = $1;
        } else {
            $data->{$target_column}   = $1;
        }
        if ($data->{$target_column} ne '') {
            my $old_charNum = $p->{'charNum'};
            my $kana    = DA::CGIdef::jsubstr($data->{$target_column}, 0, 2);
            my $charNum = DA::Address::get_char_num($kana);
            $p->{'charNum'} = DA::Address::alphaNum2charNum($charNum);
            if ($p->{'charNum'} ne $old_charNum) {
                $p->{m_page} = "1";
            }
        } else {
            set_location_default($p, $kana);
        }
    }
}

sub check_gid {
	my ($gid) = @_;
	if ($gid ne "") {
		$gid = int($gid) || $DA::Vars::p->{top_gid};
	}
	return($gid);
}

sub get_group_type {
	my ($session, $gid, $msid, $option) = @_;
	my $sql = "SELECT type,org_type FROM ".DA::IS::get_group_table($session, "TBL", $msid)." WHERE gid=?";
	my $sth=$session->{dbh}->prepare($sql);
	$sth->bind_param(1,$gid,3); $sth->execute();
	my ($type,$org_type)=$sth->fetchrow;
	$sth->finish;
	
	if ($option) {
		return ($type, $org_type);
	} else {
		return ($type);
	}
}

sub get_group_member_list {
	my ($session, $gid, $org_type, $del_tag, $mode) = @_;
	# $del_tag 削除可否引数 変更可
	#          0   : 削除可 
	#          msg : 削除不可エラー
	# $mode 0 : 削除可否を判断のみ、戻り値ない
	#       1 : 削除可否判断して、ユーザリストタグを戻る
	#       2 : 削除可否判断して、ユーザリストを戻る
	my $tag = "";
	if ($org_type eq 1) {
		my @target_msid;
		my $fu_msid  = DA::MasterManager::exists_before_active($session);
		my $ac_msid  = DA::MasterManager::get_active_msid($session);
		push (@target_msid, $ac_msid) if ($ac_msid);
		push (@target_msid, $fu_msid) if ($fu_msid);

		my %msid_flg = ( "$ac_msid" => t_('現在のみ存在するユーザ') , "$fu_msid" => t_('未来のみ存在するユーザ') );
		my @type_flg = ('','[U]','','[R]','[X]');
		
		my ($user_list, $sql, $sth);
		foreach my $t_msid ( @target_msid ) {
			my $chk_msid = ($t_msid eq $ac_msid) ? $fu_msid : $ac_msid;
			my $gm_table = DA::IS::get_master_table($session, "is_group_member", $t_msid);
			my $m_table  = DA::IS::get_member_table($session, "TBL", $t_msid);
			
			$sql="SELECT m.mid,m.name,m.type FROM $m_table m, $gm_table gm WHERE gm.gid=? AND gm.attr='1' AND m.mid=gm.mid";
			$sth=$session->{dbh}->prepare($sql);
			$sth->bind_param(1, $gid); $sth->execute;
			while(my $data = $sth->fetchrow_hashref('NAME_lc')) {
				next if ($user_list->{$data->{mid}});
				$user_list->{$data->{mid}} = 1;

				my $flg;
				if ($chk_msid) { 
					if (DA::MasterManager::check_future_id($session,$data->{mid},$chk_msid)) {
						if (!$$del_tag) {
							if ($chk_msid eq $ac_msid) {
								$$del_tag = t_("現在、未来世代に所属ユーザが異なるため、削除することはできません。");
							} else {
								$$del_tag = DA::MasterManager::check_delete_id($session,$data->{mid},$t_msid);
							}
						}
						if (!$mode && $$del_tag) { return; }
					} else {
						$flg = "($msid_flg{$t_msid})";
					}
				}
				if ($mode eq 1) {
					$tag .= sprintf("&nbsp;&nbsp;%s%s%s\n", $type_flg[$data->{type}], $data->{name}, $flg);
				}
			}
		}
		$sth->finish();
		return ($user_list) if ($mode eq 2);
	}
	return ($tag) if ($mode eq 1);
}

sub save_search_condition{
    my ($session,$p) = @_;
    my $srf = "$session->{sid}.ad_gsr";
    my $sr = {};
    foreach my $x (keys %$p) {
        if($x =~ /^sr_/){
            $sr->{$x} = $p -> {$x};
        }
    }
    DA::IS::save_temp_db($session, $sr, $srf);
}

sub restore_search_condition {
    my ($session,$p) = @_;
    my $srf = "$session->{sid}.ad_gsr";
    my $sr = DA::IS::get_temp_db($session, $srf);
    foreach my $x (keys %$sr) {
        $p->{$x} = $sr->{$x};
    }
}

sub clean_search_condition {
    my ($session,$p) = @_;
    my $srf = "$session->{sid}.ad_gsr";
    DA::IS::rm_temp_db($session, $srf);
}

sub has_param{
    my $p = shift;
    my $has_param = 0;
    foreach my $x (keys %$p) {
        if ($x =~ /^sr_/ && $x ne "sr_type"){
            if (ref($p->{$x}) eq 'ARRAY' && scalar(@{$p->{$x}})){
                $has_param = 1;
            }elsif(ref($p->{$x}) ne 'ARRAY'){
                $p->{$x} = DA::Unicode::trim($p->{$x});
                if( !DA::Unicode::is_empty($p->{$x})){
                    $has_param = 1;
                }
            }
        }
    }
    return $has_param ;
}

