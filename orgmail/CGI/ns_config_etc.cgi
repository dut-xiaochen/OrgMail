#!/usr/local/bin/perl
###################################################
##  INSUITE(R)Enterprise Version 1.2.0.          ##
##  Copyright(C)2001,2002 DreamArts Corporation. ##
##  All rights to INSUITE routines reserved.     ##
###################################################
BEGIN {
    use DA::Init();
	use DA::Gettext;
	use DA::Ns;
}
use strict;
my $r = shift;
&main($r);
Apache::exit();

sub main {
my ($r) = @_;

my $session={};
DA::Session::get_dir($session,$r);
my $query=Apache::Request->new($r,TEMP_DIR=>"$session->{temp_dir}");

DA::Valid::check_param_all($session, $query);

my $param=DA::Ns::get_config_tab($session,7);

my $v_name=DA::IS::get_ug_name($session,0,$session->{user},$session->{type},
   $session->{name},$session->{primary_gname});
$param->{page_title}=DA::CGIdef::get_page_title($session,'func_title_env.gif',
	t_("ユーザ")." : $v_name->{page_title}",'','on',t_('環境設定')
);

my $join=DA::IS::get_join_group($session,$session->{user},1);
my $config=DA::IS::get_sys_custom($session,'ns_board');
my $admin_permit=DA::Ns::is_admin_user($session,$join,$config);
if (!$admin_permit) {
    $param->{error}=t_('管理権限が必要な機能です。');
    DA::IS::conf_error_msg($session,$param);
}

my $conf={};
my $num=$query->param('num');
if (!$num) {
	$num=DA::IS::get_seq($session,'custom');
	$conf=DA::IS::get_sys_custom($session,'ns_board');
    $conf->{portlet}=$conf->{portlet};
    $conf->{regist_popup}=$conf->{regist_popup};
	DA::IS::save_temp($session,$conf,"$num.ns_config_etc");
}
if ($query->param('set')) {
	my $ns_conf=DA::IS::get_sys_custom($session,'ns_board');
	my $temp=DA::IS::get_temp($session,"$num.ns_config_etc");
	foreach my $key (keys %$temp) { $conf->{$key}=$temp->{$key}; }
	delete $temp->{view}; #ISE_01001831 bug fix
	$conf->{monthly_num}=$query->param('monthly_num');
	if (!$conf->{monthly_num}) { $conf->{monthly_num}='off'; }
	$conf->{regist_user}=$query->param('regist_user');
	$conf->{check_user} =$query->param('check_user');
	if (!$conf->{regist_user}) { $conf->{regist_user}='off'; }
	if (!$conf->{check_user})  { $conf->{check_user} ='off'; }
	$conf->{portlet} =$query->param('portlet');
	$conf->{regist_popup}   =$query->param('regist_popup');
	$conf->{sp_icon_render} =$query->param('sp_icon_render');

	# DCM_01000032 
	# bgcolor の先頭に'#'が付いてない件の暫定修正
	# (# が無ければ追加)
	$conf->{sp_color}  = '';
	$conf->{sp_color1} = '';
	$conf->{sp_color2} = '';
	$conf->{sp_color3} = '';
	foreach my $key (keys %$conf) {
		if ($key=~/^(bg)*color[123]*$/) {
			$conf->{$key} = $query->param($key);
			if ($conf->{$key} !~ /^#/) {
                $conf->{$key} = "#".$conf->{$key};
			}
		} elsif ($key=~/^sp_color[123]*$/) {
			$conf->{$key} = $query->param($key);
			if ($conf->{$key} !~ /^#/) {
                $conf->{$key} = "#".$conf->{$key};
			}
		}
	}
	DA::IS::save_sys_custom($session,$conf,'ns_board');
	$param->{message}=t_('表示設定を変更しました。');
}

my $picker_table=&get_picker_table($session);

if (!$conf->{color})      { $conf->{color}     ='#000000'; }
if (!$conf->{color1})     { $conf->{color1}    ='#000000'; }
if (!$conf->{color2})     { $conf->{color2}    ='#000000'; }
if (!$conf->{color3})     { $conf->{color3}    ='#000000'; }
if (!$conf->{sp_color})   { $conf->{sp_color}  ='#000000'; }
if (!$conf->{sp_color1})  { $conf->{sp_color1} ='#000000'; }
if (!$conf->{sp_color2})  { $conf->{sp_color2} ='#000000'; }
if (!$conf->{sp_color3})  { $conf->{sp_color3} ='#F20C0C'; }
if (!$conf->{bgcolor})    { $conf->{bgcolor}   ='#FFFFFF'; }
if (!$conf->{bgcolor1})   { $conf->{bgcolor1}  ='#FFFFFF'; }
if (!$conf->{bgcolor2})   { $conf->{bgcolor2}  ='#FFFFFF'; }
if (!$conf->{bgcolor3})   { $conf->{bgcolor3}  ='#FFFFFF'; }
if (!$conf->{sp_icon_render}) { $conf->{sp_icon_render} = "on" };
if (!$conf->{portlet}) { $conf->{portlet}='group'; }

my $monthly_idx 	= { "$conf->{monthly_num}" => 'checked' };
my $regist_user_idx = { "$conf->{regist_user}" => 'checked' };
my $check_user_idx  = { "$conf->{check_user}"  => 'checked' };
my $portlet_idx		= { "$conf->{portlet}"	 => 'checked' };

if ($conf->{regist_popup} ne 'on') { $conf->{regist_popup}='off'; }
my $regist_popup_idx = { "$conf->{regist_popup}" => 'checked' };

if ($conf->{sp_icon_render} ne 'on') { $conf->{sp_icon_render}='off'; }
my $icon_render_idx = { "$conf->{sp_icon_render}" => 'checked' };

my $portlet_tag;
if (!$conf->{portlet_permit}) {
	$portlet_tag=qq{
		<input type=radio name=portlet value=main  $portlet_idx->{main}>@{[t_('メインポータルにのみ表示')]}<br>
		<input type=radio name=portlet value=group $portlet_idx->{group}>@{[t_('プライマリ所属グループポータルにのみ表示')]}<br>
		<input type=radio name=portlet value=all   $portlet_idx->{all}>@{[t_('すべてのポータルに表示')]}<br>
		<input type=radio name=portlet value=none  $portlet_idx->{none}>@{[t_('ポータルに表示しない')]}<br>
	};
} elsif ($conf->{portlet_permit} eq 'main') {
	$portlet_tag=t_('メインポータルにのみ表示');
} elsif ($conf->{portlet_permit} eq 'group') {
	$portlet_tag=t_('プライマリ所属グループポータルにのみ表示');
} elsif ($conf->{portlet_permit} eq 'all') {
	$portlet_tag=t_('すべてのポータルに表示');
}

my $color_tag="onclick=\"showColor(this);\"";

$param->{contents}=<<buf_end;
<table width=500 border=0 cellspacing=1 cellpadding=1 style="background:$DA::Vars::p->{base_color}"><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} colspan=5 align=middle>@{[t_('PC表示設定')]}</td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right width=140>@{[t_('重要度%(DCM)')]}: @{[t_('なし')]}</td>
<td nowrap bgcolor=#FFFFFF align=right width=50%>@{[t_('テキストの色')]}: </td>
<td nowrap bgcolor=$conf->{color} align=center width=24 id="color_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="color">
</td>
<td nowrap bgcolor=#FFFFFF align=right width=50%>@{[t_('背景の色')]}: </td>
<td nowrap bgcolor=$conf->{bgcolor} align=center width=24 id="bgcolor_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="bgcolor"></td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>@{[t_('重要度%(DCM)')]}: @{[t_('低%(DCM)')]}</td>
<td nowrap bgcolor=#FFFFFF align=right>@{[t_('テキストの色')]}: </td>
<td nowrap bgcolor=$conf->{color1} align=center width=24 id="color1_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="color1">
</td>
<td nowrap bgcolor=#FFFFFF align=right>@{[t_('背景の色')]}: </td>
<td nowrap bgcolor=$conf->{bgcolor1} align=center width=24 id="bgcolor1_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="bgcolor1"></td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>@{[t_('重要度%(DCM)')]}: @{[t_('中%(DCM)')]}</td>
<td nowrap bgcolor=#FFFFFF align=right>@{[t_('テキストの色')]}: </td>
<td nowrap bgcolor=$conf->{color2} align=center width=24 id="color2_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="color2">
</td>
<td nowrap bgcolor=#FFFFFF align=right>@{[t_('背景の色')]}: </td>
<td nowrap bgcolor=$conf->{bgcolor2} align=center width=24 id="bgcolor2_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="bgcolor2">
</td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>@{[t_('重要度%(DCM)')]}: @{[t_('高%(DCM)')]}</td>
<td nowrap bgcolor=#FFFFFF align=right>@{[t_('テキストの色')]}: </td>
<td nowrap bgcolor=$conf->{color3} align=center width=24 id="color3_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="color3">
</td>
<td nowrap bgcolor=#FFFFFF align=right>@{[t_('背景の色')]}: </td>
<td nowrap bgcolor=$conf->{bgcolor3} align=center width=24 id="bgcolor3_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="bgcolor3">
</td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>@{[t_('連絡事項の連番')]}</td>
<td nowrap colspan=4 bgcolor=#FFFFFF>
	<input type=checkbox name=monthly_num value=on $monthly_idx->{on}>@{[t_('月毎の連番を付与する')]}
</td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>@{[t_('ユーザ名の表示')]}</td>
<td nowrap colspan=4 bgcolor=#FFFFFF>
	<input type=checkbox name=regist_user value=on $regist_user_idx->{on}>@{[t_('詳細画面に発信ユーザ名を表示する')]}<br>
	<input type=checkbox name=check_user  value=on $check_user_idx->{on}>@{[t_('詳細画面に確認ユーザ名を表示する')]}<br>
</td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>@{[t_('ポートレットの表示')]}</td>
<td nowrap colspan=4 bgcolor=#FFFFFF>$portlet_tag</td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>@{[t_('登録・編集の画面')]}</td>
<td nowrap colspan=4 bgcolor=#FFFFFF>
	<input type=radio name=regist_popup value=off $regist_popup_idx->{'off'}>@{[t_('同一ウィンドウに表示')]}
	<input type=radio name=regist_popup value=on $regist_popup_idx->{'on'}>@{[t_('ポップアップ画面に表示')]}
</td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} colspan=5 align=middle>@{[t_('スマートフォン表示設定')]}</td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right width=140>@{[t_('重要度%(DCM)')]}: @{[t_('なし')]}</td>
<td nowrap bgcolor=#FFFFFF align=right>@{[t_('テキストの色')]}: </td>
<td nowrap bgcolor=$conf->{sp_color} align=center width=24 id="sp_color_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="sp_color">
</td><td nowrap bgcolor=#FFFFFF colspan=2></td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>@{[t_('重要度%(DCM)')]}: @{[t_('低%(DCM)')]}</td>
<td nowrap bgcolor=#FFFFFF align=right>@{[t_('テキストの色')]}: </td>
<td nowrap bgcolor=$conf->{sp_color1} align=center width=24 id="sp_color1_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="sp_color1">
</td><td nowrap bgcolor=#FFFFFF colspan=2></td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>@{[t_('重要度%(DCM)')]}: @{[t_('中%(DCM)')]}</td>
<td nowrap bgcolor=#FFFFFF align=right>@{[t_('テキストの色')]}: </td>
<td nowrap bgcolor=$conf->{sp_color2} align=center width=24 id="sp_color2_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="sp_color2">
</td><td nowrap bgcolor=#FFFFFF colspan=2></td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>@{[t_('重要度%(DCM)')]}: @{[t_('高%(DCM)')]}</td>
<td nowrap bgcolor=#FFFFFF align=right>@{[t_('テキストの色')]}: </td>
<td nowrap bgcolor=$conf->{sp_color3} align=center width=24 id="sp_color3_area">
	<img src=$session->{img_rdir}/null.gif border=0 width=24 height=24 style="cursor:pointer;" $color_tag id="sp_color3">
</td><td nowrap bgcolor=#FFFFFF colspan=2></td>
</tr><tr>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>@{[t_('重要度アイコン')]}</td>
<td nowrap colspan=4 bgcolor=#FFFFFF>
	<input type=radio name=sp_icon_render $icon_render_idx->{on}  value=on>@{[t_('表示')]}
	<input type=radio name=sp_icon_render $icon_render_idx->{off} value=off>@{[t_('非表示')]}
</td>
</tr></table>
<hr>
<input type=submit name=set value="@{[t_('設　定')]}" onClick="changeConfirm();return f;">
<br>
buf_end

my $html_tag = DA::IS::get_tab_html($session,$param);

my ($head,$body)=DA::IS::get_head($session,"ns_config");
my $outbuf=<<buf_end;
$head
<STYLE type="text/css"><!--
BODY, TD { color: black; font-size: 12px }
a.tab { color: black; text-decoration: none}
div#colorTable {
   	position: absolute;
   	border: 1px solid #000000;
   	background-color: #FFFFFF;
   	padding: 5px;
}
//--></STYLE>
<SCRIPT LANGUAGE="JavaScript"><!--
function changeConfirm(){
    f= confirm("@{[t_('表示設定を変更してもよろしいですか？')]}");
    return f;
}
var targetColorId = '';
function reflect(color){
    document.forms[0][targetColorId].value=color;
    document.getElementById(targetColorId+'_area').style.backgroundColor=color;
	closeColor();
}
function closeColor(){
	document.getElementById('colorTable').style.display='none';
}
function showColor(img) {
	targetColorId = img.id;
	var px = 0;
	var py = 0;
    while(img){
        px += img.offsetLeft;
        py += img.offsetTop;
        img = img.offsetParent;
    }
	document.getElementById('colorTable').style.left = px;
	document.getElementById('colorTable').style.top  = py;
    document.getElementById('colorTable').style.display = "";
}
//--></SCRIPT>
</head>
$body
<form action=$DA::Vars::p->{cgi_rdir}/ns_config_etc.cgi method=post>
<input type=hidden name=num  value="$num">
<input type=hidden name=color  value="$conf->{color}">
<input type=hidden name=color1 value="$conf->{color1}">
<input type=hidden name=color2 value="$conf->{color2}">
<input type=hidden name=color3 value="$conf->{color3}">
<input type=hidden name=sp_color  value="$conf->{sp_color}">
<input type=hidden name=sp_color1 value="$conf->{sp_color1}">
<input type=hidden name=sp_color2 value="$conf->{sp_color2}">
<input type=hidden name=sp_color3 value="$conf->{sp_color3}">
<input type=hidden name=bgcolor  value="$conf->{bgcolor}">
<input type=hidden name=bgcolor1 value="$conf->{bgcolor1}">
<input type=hidden name=bgcolor2 value="$conf->{bgcolor2}">
<input type=hidden name=bgcolor3 value="$conf->{bgcolor3}">
$param->{page_title}
$html_tag
$picker_table
</form>
</body></html>
buf_end

DA::IS::print_data($session,$outbuf);
$session->{dbh}->disconnect;
Apache::exit();

} # END OF MAIN

sub get_picker_table {
my ($session)=@_;

my $safeColorElements;
$safeColorElements->[0] = [("CCFEFF","BEF0FF","A6D8FF","89BAEE",
        "6A9BCF","4A7BAF","2C5E92","134679","003265","FCDCDF","FFBFBE",
        "FEA7A7","E1898A","C26A6B","A24A4B","842D2E","6B1515","580101")];
$safeColorElements->[1] = [("CECEFC","C1C1FC","AAAAFA","8F8EF9",
        "7170F7","5352F6","3636F4","1E1FF3","0C0CF2","FCCECE","FCC1C0",
        "FAAAAA","F98E8F","F77071","F65253","F43637","F31F1F","F20C0C")];
$safeColorElements->[2] = [("FCCEFC","FCC1FC","FAAAFA","F98EF9",
        "F770F6","F652F5","F436F3","F31FF2","F20CF1","FFFFCC","FFFFBD",
        "FFFFA6","FFFF89","FFE06A","FFC04A","FFA32D","FF8B14","FF7700")];
$safeColorElements->[3] = [("FFCCFF","FFBEFF","FFA6FF","EF88EF",
        "D069D0","B049B0","922C93","79147A","660066","FFFFCC","FFFFBD",
        "FFFFA6","FFFF89","EBE46A","CBC44A","ADA72D","948F14","817B00")];
$safeColorElements->[4] = [("FFCCFF","FFBEF0","FFA6D9","EF88BC",
        "D0699D","B0497D","922C60","791447","660033","FCFCCE","FCFCC0",
        "FAFAAA","F9F98F","F6F771","F5F653","F3F437","F2F31F","F1F20C")];
$safeColorElements->[5] = [("CEFCFC","C1FCFC","AAFAFA","8FF9F9",
        "71F6F7","53F5F6","36F3F4","1EF2F3","0CF1F2","CEFCCE","C1FCC0",
        "AAFAAA","8FF98F","71F771","53F653","36F437","1EF31F","0CF20C")];
$safeColorElements->[6] = [("FFFFFF","EEEEEE","CCCCCC","AAAAAA",
        "888888","666666","444444","222222","000000","CCFACC","BEECBD",
        "A6D4A6","89B689","6A976A","4A774A","2C5A2D","134214","002E00")];

my $table_html;
for(my $i=0;$i<@{$safeColorElements};$i++){
    $table_html .= "<tr>";
    for(my $j=0;$j<@{$safeColorElements->[$i]};$j++){
        my $cell_col = $safeColorElements->[$i]->[$j];
        $table_html.="<td width=12 height=10 bgcolor=$cell_col onClick=\"reflect('$cell_col')\"><br></td>";
    }
    $table_html .= "</tr>";
}
my $close_icon = "<img src=\"$session->{img_rdir}/picker_close.gif\" width=17 height=17 border=0>";
$table_html=qq{
	<table border=0 cellpadding=0 cellspacing=0><tr height=20>
	<td>@{[t_('色を選択して下さい')]}</td>
	<td align=right><a href="javascript:closeColor();">$close_icon</a></td>
	</tr><tr>
	<td colspan=2 style="border:1px #999999 solid;"><table border=0 cellpadding=0 cellspacing=0>$table_html</table></td>
	</tr></table>
};

my $picker_table=<<buf_end;
<div id="colorTable" style="display:none">$table_html</div>
buf_end

return ($picker_table);

}

1;
