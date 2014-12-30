#!/usr/local/bin/perl
###################################################
##  INSUITE(R)Enterprise Version 1.2.0.          ##
##  Copyright(C)2001,2002 DreamArts Corporation. ##
##  All rights to INSUITE routines reserved.     ##
###################################################
BEGIN {
    use DA::Init();
    use DA::Ajax();
    use DA::Gettext;
}
use strict;
my $r=shift;
&main($r);
Apache::exit();

sub main {
my ($r)=@_;

my $session={};
DA::Session::get_dir($session,$r,1);

my $query=Apache::Request->new($r,TEMP_DIR=>"$session->{temp_dir}");
DA::Valid::check_param_all($session, $query);

my $mail	= (DA::Ajax::mailer_ok($session)) ?  DA::IS::get_master($session, "ajxmailer") : DA::IS::get_master($session, 'mail');
my $size	= DA::IS::get_popup_size($session);
my $newpop	= "Pop(Path,'pop_title_mkeml.gif',$size->{width_ma},$size->{height_ma},0,1,'$size->{pos_x_ma}','$size->{pos_y_ma}');";
my $newframe= "top.frames['work'].location.href='$DA::Vars::p->{cgi_rdir}/' + Path + opt;";
my $draft	= t_("作成中のメールを保存しますか？") if ($mail->{draft} =~ /^(on)$/i);
my $ma_new	= ($mail->{popup} !~ /^off$/i) ? "'ma_new.cgi?proc=new%20target=sent%20mode=pop', 3, 1" : "'ma_new.cgi?proc=new&target=sent'";

my $ajxmailer_window_width  = $mail->{window_width}  || 1024;
my $ajxmailer_window_height = $mail->{window_height} || 620;
my $ajxmailer_window_pos_x  = $mail->{window_pos_x}  || 0;
my $ajxmailer_window_pos_y  = $mail->{window_pos_y}  || 0;
# 組織メール
my $orgmail_config=DA::IS::get_sys_custom($session,'org_mail');
my $cookie_script;
#if ($orgmail_config->{keep_alive} eq 'off') {
    # AjaxMailer の起動時にアカウントをリセットする
#    my $cookie      = "$session->{sid}\-org_mail=$session->{user}";
#	$cookie_script  = "document.cookie='$cookie';";
#}
my $mail_account;
if ($mail->{default_mail_account}) {
	if ($mail->{default_mail_account} eq "AjxaMailer") {
		$mail_account = $session->{user};
	} else {
		$mail_account = $mail->{default_mail_account};
	}
} else {
	$mail_account = $session->{user};
}
my $cookie = "$session->{sid}\-org_mail=$mail_account";
$cookie_script = "document.cookie='$cookie';";


my $check_key = DA::IS::get_check_key_param('&');
my $pagemove=<<buf_end;
var PageMoveFlag = 0;
function PageMove(Path, Cache, Mode) {
	if (PageMoveFlag) {
		return;
	} else {
		PageMoveFlag = 1;
	}

	var msg;
	var draft;
	var opt;
	var date = new Date();
	var time = date.getTime();
	switch (Cache) {
		case 1: opt = '&time=' + time; break;
		case 2:
           if( Path.match(/\\\?/) ){
               opt = '&time=' + time;
           }else{
               opt = '?time=' + time;
           }
           break;
		case 3: opt = '%20time=' + time; break;
		default: opt= '';
	}
	switch (top.frames[0].update_flag) {
		case 1:
			msg		= '@{[t_("作業中のページを破棄してもよろしいですか？")]}';
			draft	= '';
			break;
		case 2:
			if (top.frames['work'].document.title == 'Mailer New Mail') {
				msg		= '@{[t_("メールの作成を中断してもよろしいですか？")]}';
				draft	= '$draft';
			} else {
				msg		= '';
				draft	= '';
				top.frames[0].update_flag = 0;
			}
			break;
		default:
			msg		= '';
			draft	= '';
			top.frames[0].update_flag = 0;
	}
	if (top.frames[0].update_flag) {
		if (confirm(msg)==true) {
			top.frames[0].update_flag = 0;
			if (Mode) {
				$newpop
			} else {
				if (draft && confirm(draft)==true) {
					top.frames['work'].document.forms[0].proc.value   = 'wait';
					top.frames['work'].document.forms[0].status.value = 'work';
					top.frames['work'].document.forms[0].url.value    = Path + opt;
					top.frames['work'].document.forms[0].submit();
				} else {
					$newframe
				}
			}
		}
	} else {
		if (Mode) {
		    $newpop
		} else {
			$newframe
		}
	}

	resetID = setInterval('resetPMFlag();', 1500);
}
function resetPMFlag() {
	clearInterval(resetID);
	PageMoveFlag = 0;
}
function check_poptype() {
    var ua  = navigator.userAgent;
    if ( ua.indexOf('MSIE') != -1) {
        return true;
    } else {
        if (ua.indexOf('Mozilla/4') != -1 ) {
            return false;
        } else {
            return true;
        }
    }
}
function Pop(Proc,Title,Width,Height,no,noname,POSX,POSY){
	var Param='width='+Width+',height='+Height+',resizable=1';
	var Url='$DA::Vars::p->{cgi_rdir}/pop_up.cgi?proc='+Proc+'&title='+Title;
	var pwin;
	if (!noname || !check_poptype()) {
		var last=Title.indexOf('.gif');
		var name=Title.substring(0,last);
		var winname = name + no;
		pwin=window.open(Url,winname,Param);
	} else {
		pwin=window.open(Url,'',Param);
	}
    if (pwin && pwin.focus) {
        pwin.focus();
    }
	if (POSX != null && POSX != '' && POSY != null && POSY != '') {
		pwin.moveTo(POSX, POSY);
	}
}
function Pop4config(Proc,Title,Width,Height,POSX,POSY){
	var Param='width='+Width+',height='+Height+',resizable=1';
	var Url='$DA::Vars::p->{cgi_rdir}/ma_ajx_env_pop_up.cgi?proc='+Proc+'&title='+Title;
    Url += '$check_key';
	var pwin;
	pwin=window.open(Url,'$session->{user}\_ajx_ma_config',Param);
	
	if (POSX != null && POSX != '' && POSY != null && POSY != '') {
		pwin.moveTo(POSX, POSY);
	}
}
function Pop4Ajax(Url,Width,Height,POSX,POSY){
    var Param='width='+Width+',height='+Height+',resizable=1';
    var pwin=window.open(Url,'',Param);
    if (POSX != null && POSX != '' && POSY != null && POSY != '') {
        pwin.moveTo(POSX, POSY);
    }
}
var AjaxMailerLogined = @{[$session->{ajxmailer_logined} || 0]};
var AjaxMailerWindow  = null;
var AjaxMailerWindowWidth  = '$ajxmailer_window_width';
var AjaxMailerWindowHeight = '$ajxmailer_window_height';
var AjaxMailerWindowPosX   = '$ajxmailer_window_pos_x';
var AjaxMailerWindowPosY   = '$ajxmailer_window_pos_y';

function AjaxMailer(CHK,ADD_URL) {
	$cookie_script
	var width  = parseInt(AjaxMailerWindowWidth, 10);
	var height = parseInt(AjaxMailerWindowHeight, 10);
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

	var Param = 'width=' + width
	          + ',height=' + height
	          + ',resizable=1';
	var Url   = '$DA::Vars::p->{cgi_rdir}/ajax_mailer.cgi?html=index&login=1&time=@{[time]}&org_mail_box=$mail_account&org_mail_gid=$mail_account';
	Url += '$check_key';
    if (AjaxMailerWindow || CHK) {
		if (confirm('@{[t_("既に起動している可能性があります。再起動しますか？")]}') == true) {
			AjaxMailerWindow = window.open(Url, "$session->{user}\_AjaxMailer\_$mail_account", Param);
			AjaxMailerWindow.moveTo(posX, posY);
			AjaxMailerWindow.focus();
		}
	} else {
		AjaxMailerWindow = window.open(Url, "$session->{user}\_AjaxMailer\_$mail_account", Param);
		AjaxMailerWindow.moveTo(posX, posY);
		AjaxMailerWindow.focus();
	}
}
buf_end

my $module	= DA::IS::get_module($session);

my $action  = ($ENV{QUERY_STRING} =~ /&action=(?:open|close|ml_menu_close|chg_conf)$/) ? 1 : 0;
# 未設定の場合にはAjaxメーラを起動しない
my $imap = DA::IS::get_master($session,'imap');
foreach my $key (qw(host user pass port)) {
	if ($imap->{$key} eq "") {
		$action = 1;
	}
}
my $onload  = ( $module->{mail} eq 'on' && DA::Ajax::mailer_ok($session) && !$action ) ? "AjaxMailer(AjaxMailerLogined);" : "";

#===========================================
#     Custom
#===========================================
my ($CUSTOM_MAIL_MENU,$CUSTOM_SCRIPT)=
	DA::Custom::get_custom_mail_menu($session);
#===========================================

# 組織メール
my ($m_permit,$a_permit);
if ($orgmail_config->{list_menu} eq 'on' || $orgmail_config->{auth_menu} eq 'on') {
	my $permit=DA::OrgMail::get_org_mail_permit($session,0);
	foreach my $id (keys %{$permit->{member}}) {
    	if ($permit->{auth}->{$id}) {
        	delete $permit->{member}->{$id};
    	}
	}
	if ($orgmail_config->{list_menu} eq 'on') {
		$m_permit=(scalar(keys %{$permit->{member}})) ? 1 : 0;
	}
	if ($orgmail_config->{auth_menu} eq 'on') {
		$a_permit=(scalar(keys %{$permit->{auth}})) ? 1 : 0;
	}
}

my $SEARCH_CGI = DA::Search::search_cgi_ml();

if ($session->{menu_style} eq "aqua") {
	my ($data_list, $onload);
	if (($module->{mail} eq 'on') && DA::Ajax::mailer_ok($session)) {

	$data_list = [
        { title => t_("電子メール"), img => "ctm_navi_ico_mail.gif", a => DA::Menu::get_init_rdir($session)."/email.html", },
        t_("メール"),
        [
            ($module->{mail} eq 'on') ? ({ title => t_("メーラ起動"), img => "ctm_navi02_ico_ajxmailer.gif", a => "javascript:AjaxMailer(AjaxMailerLogined);", }):(),
            "$CUSTOM_MAIL_MENU",
        ],
        ($module->{mailist} eq 'on')
        ? (
            t_("メーリングリスト"),
            [
                { title => t_("ﾒｰﾘﾝｸﾞﾘｽﾄ一覧"), img => "ctm_navi02_ico_mllist.gif", a => "javascript:PageMove('ml_list.cgi')", },
            ],
        ) : (
            { title => t_("電子メール"), img => "ctm_navi_ico_mail.gif", a => "/html/init/email.html", }
        ),
        ($module->{mailist} eq 'on')
        ? (
            t_("検索"),
            [
                ($module->{mailist} eq 'on') ? { title => t_("ﾒｰﾘﾝｸﾞﾘｽﾄ検索"), img => "ctm_navi02_ico_scml.gif", a => "javascript:PageMove('@{[js_esc_($SEARCH_CGI)]}')", } :
(),
            ],
        ) : (),
        t_("設定"),
        [
            { title => t_("環境設定"), img => "ctm_navi02_l_ico_other.gif", a => "javascript:Pop4config('ma_ajx_config.cgi','pop_title_ajxmailer_other.gif',990,600)", },
            { title => t_("フィルタ"), img => "ctm_navi02_ico_emlfilter.gif", a => "javascript:Pop4config('ma_ajx_filter.cgi','pop_title_ajxmailer_other.gif',990,600)", },
            ($module->{address} eq 'on') ? { title => t_("共有アドレス設定"), img => "ctm_navi02_ico_adrset.gif", a => "javascript:Pop4config('conf_address.cgi%3fpopup=1','pop_title_ajxmailer_other.gif',990,600)", } : (),
            { title => t_("使用容量の確認"), img => "ctm_navi02_ico_data_capacit.gif", a => "javascript:Pop4config('ma_ajx_disk_check.cgi','pop_title_ajxmailer_other.gif',990,600)", },

			($DA::Vars::p->{ma_open_status} eq "on") ? { title => t_("開封状況の確認"), img => "ctm_navi02_ico_mlopen.gif", a => "javascript:Pop4config('ma_open_info.cgi', 'pop_title_ajxmailer_other.gif',990,600)", } : (), 

            { title => t_("メンテナンス"), img => "ctm_navi02_ico_maintenance.gif", a => "javascript:Pop4config('ma_ajx_repair.cgi','pop_title_ajxmailer_other.gif',990,600)", },

        ],
		($m_permit || $a_permit) ? (
			t_('組織メール%(org_mail)'), [
				($m_permit) ? (
					{ title => t_('組織メール確認%(org_mail)'), img => "ctm_navi02_ico_adtsentlist.gif", a => "javascript:PageMove('org_mail_history.cgi')" }, 
				) : (),
				($a_permit) ? (
					{ title => t_('組織メール承認%(org_mail)'), img => "ctm_navi02_ico_adtgetlist.gif", a => "javascript:PageMove('org_mail_list.cgi')" }, 
				) : (),
			]
		) : (),
    ];
	$onload = ($action) ? "" : "AjaxMailer(AjaxMailerLogined);";

	} else {

	$data_list = [
		($module->{mail} eq 'on') 
		? (
			{ title => t_("電子メール"), img => "ctm_navi_ico_mail.gif", a => DA::Menu::get_init_rdir($session)."/email.html", }, 
			t_("メール"), 
			[
				{ title => t_("メール作成"), img => "ctm_navi02_ico_emlwrite.gif", a => "javascript:PageMove($ma_new)", }, 
				"$CUSTOM_MAIL_MENU", 
			], 
			t_("フォルダ一覧"), 
			[
				{ title => t_("フォルダ一覧"), img => "ctm_navi02_ico_follist.gif", a => "javascript:PageMove('ma_inbox_main.cgi?proc=1', 1)", }, 
				{ title => t_("フォルダ作成"), img => "ctm_navi02_ico_folmake.gif", a => "javascript:PageMove('ma_dir.cgi?proc=new2', 1)", }, 
			], 
		) : (
			{ title => t_("電子メール"), img => "ctm_navi_ico_mail.gif", a => "/html/init/email.html", }
		), 
		($module->{mailist} eq 'on')
		? (
			t_("メーリングリスト"), 
			[
				{ title => t_("ﾒｰﾘﾝｸﾞﾘｽﾄ一覧"), img => "ctm_navi02_ico_mllist.gif", a => "javascript:PageMove('ml_list.cgi')", }, 
			], 
		) : (), 
		($module->{mail} eq 'on' || $module->{mailist} eq 'on')
		? (
			t_("検索"), 
			[
				($module->{mail} eq 'on') ? { title => t_("メール検索"), img => "ctm_navi02_ico_sceml.gif", a => "javascript:PageMove('ma_inbox_main.cgi?proc=2')", } : (), 
				($module->{mailist} eq 'on') ? { title => t_("ﾒｰﾘﾝｸﾞﾘｽﾄ検索"), img => "ctm_navi02_ico_scml.gif", a => "javascript:PageMove('@{[js_esc_($SEARCH_CGI)]}')", } : (), 
			], 
		) : (), 
		t_("設定"), 
		[
			{ title => t_("環境設定"), img => "ctm_navi02_l_ico_other.gif", a => (DA::Ajax::mailer_ok($session)) ? ("javascript:PageMove('ma_ajx_config.cgi', 2)") : ("javascript:PageMove('ma_config.cgi', 2)"), }, 
			($module->{mail} eq 'on') ? { title => t_("フィルタ"), img => "ctm_navi02_ico_emlfilter.gif", a => "javascript:PageMove('ma_filter.cgi?init=1')", } : (), 
			($module->{address} eq 'on') ? { title => t_("共有アドレス設定"), img => "ctm_navi02_ico_adrset.gif", a => "javascript:PageMove('conf_address.cgi')", } : (), 
			($module->{mail} eq 'on')
			? (
				{ title => t_("使用容量の確認"), img => "ctm_navi02_ico_data_capacit.gif", a => "javascript:PageMove('ma_disk_check.cgi', 2)", }, 
				($DA::Vars::p->{ma_open_status} eq "on") ? { title => t_("開封状況の確認"), img => "ctm_navi02_ico_mlopen.gif", a => "javascript:PageMove('ma_open_info.cgi', 2)", } : (), 
				{ title => t_("メンテナンス"), img => "ctm_navi02_ico_maintenance.gif", a => "javascript:PageMove('ma_repair.cgi', 2)", }, 
			) : (), 
		], 
	];

	}
	DA::IS::print_data($session,DA::Menu::make_left_menu($session, $data_list, "", "$pagemove\n$CUSTOM_SCRIPT","emb",undef,undef,$onload));
	$session->{dbh}->disconnect;
	Apache::exit();
} else {
	my $close_mode;
	my $conf = DA::IS::get_master($session,'clear_style');
	my $not_save_close_status = $conf->{not_save_close_status};
	if ($ENV{QUERY_STRING} =~ /action=close/) {
    	$close_mode = 1;
    	$conf->{close_left_menu} = 1;
    	if (!$not_save_close_status) {
        	DA::IS::save_master($session, $conf, 'clear_style'); 
    	}
	} elsif ($ENV{QUERY_STRING} =~ /action=open/) {
    	$close_mode = 0;
    	$conf->{close_left_menu} = 0;
    	if (!$not_save_close_status) {
        	DA::IS::save_master($session, $conf, 'clear_style');
    	}
	} else {
    	if (!$not_save_close_status) {
        	$close_mode = int($conf->{close_left_menu});
    	}
	}
	my $style_css = "$session->{char_style_rdir}/$session->{char_style}.css";
	my $help_link = DA::Menu::get_guid_link($session);
	my $path = $DA::Vars::p->{html_dir};
	my $file = (DA::Ajax::mailer_ok($session)) ? "ajx_ma_menu".$session->{top_style}.".tmpl" : "ma_menu".$session->{top_style}.".tmpl";
	if($session->{menu_style} eq "preset"){
        $file = (DA::Ajax::mailer_ok($session)) ? "ajx_ma_menu_preset.tmpl" : "ma_menu_preset.tmpl";
	}
	my $tmpl	= HTML::Template->new(
    	filename => "$path/template/$file",
		die_on_bad_params => 0,
    	cache  => 1
	);
	$tmpl->param(
		CSS_RDIR => $DA::Vars::p->{css_rdir},
    	IMG_RDIR => $session->{img_rdir},
    	IMG_JAVA => $session->{img_java},
    	MAINTITLE => t_("電子メール"),
		GUID_LINK => (!$close_mode && $help_link) ? $help_link : "",
    	MAINTITLE_URL => DA::Menu::get_init_rdir($session)."/email.html",
    	OPEN_URL => DA::Menu::get_sidemenu_url($session,0),
    	CLOSE_URL => DA::Menu::get_sidemenu_url($session,1),
    	ACTION => !$close_mode,
    	STYLE_CSS => $style_css,
    	TITLE1   => t_("メール"),
    	TITLE2   => t_("フォルダ一覧"),
    	TITLE3   => t_("メーリングリスト"),
    	TITLE4   => t_("検索"),
    	TITLE5   => t_("設定"),
    	TITLE6   => t_("メール"),
    	ALT01    => t_("メール作成"),
    	ALT11    => t_("フォルダ一覧"),
    	ALT12    => t_("フォルダ作成"),
    	ALT21    => t_("ﾒｰﾘﾝｸﾞﾘｽﾄ一覧"),
    	ALT31    => t_("メール検索"),
    	ALT32    => t_("ﾒｰﾘﾝｸﾞﾘｽﾄ検索"),
    	ALT41    => t_("環境設定"),
    	ALT42    => t_("フィルタ"),
    	ALT43    => t_("共有アドレス設定"),
    	ALT44    => t_("使用容量の確認"),
    	ALT45    => t_("メンテナンス"),
		ALT46    => t_("開封状況の確認"),
    	ALT61    => t_("メーラ起動"),
    	TITLE7   => ($m_permit || $a_permit) ? t_('組織メール%(org_mail)') : '',
		ALT71	 => ($m_permit) ? t_('組織メール確認%(org_mail)') : '',
		ALT72	 => ($a_permit) ? t_('組織メール承認%(org_mail)') : '',
    	SQUARE   => t_("□"),
		MAIL	 => ($module->{mail} eq 'on' || DA::Ajax::mailer_ok($session)) ? 1 : 0,
		MAILIST	 => ($module->{mailist} eq 'on') ? 1 : 0,
		ADDRESS  => ($module->{address} eq 'on') ? 1 : 0,
		AJXMAILER=> 'AjaxMailerLogined',
		PAGEMOVE => $pagemove,
		MA_NEW   => $ma_new,
		ONLOAD   => $onload,
		OPEN_STATUS   => ($DA::Vars::p->{ma_open_status} eq "on") ? 1 : 0,
		CUSTOM_SCRIPT => $CUSTOM_SCRIPT,
		CUSTOM_MAIL_MENU => $CUSTOM_MAIL_MENU,
		SEARCH_CGI => $SEARCH_CGI
	);
	DA::IS::print_data($session,$tmpl->output);
	$session->{dbh}->disconnect();
	Apache::exit();
}

}

1;
