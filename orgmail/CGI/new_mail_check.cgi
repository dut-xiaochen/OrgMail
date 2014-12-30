#!/usr/local/bin/perl
###################################################
##  INSUITE(R)Enterprise Version 2.3.3.          ##
##  Copyright(C)2008,2009 DreamArts Corporation. ##
##  All rights to INSUITE routines reserved.     ##
###################################################
BEGIN {
    use DA::Init();
    use DA::HttpSession::Base qw(:status);
    use DA::Ajax();
    use DA::Gettext;
    use Time::Local;
}
use strict;
my $r = shift;
&main($r);
Apache::exit();

sub main{
my ($r) = @_;

my $query=Apache::Request->new($r);

DA::Valid::check_param_all({}, $query);

my $jump = $query->param('jump');
my $menu = $query->param('menu');
my $new  = $query->param('new');
my $reload = $query->param('reload');
my $clear  = $query->param('clear');

# expire させないように独自で$sessionを確立
my $cookie  = DA::Session::cookie($DA::Vars::p->{session_key});
my $session = DA::HttpSession->new(
                    key         => $cookie->{value},
                    no_update   => 1);
if ($session->status ne ACTIVE) {
    print "Content-type: text/html\n\n";
    my $outbuf=<<end_tag;
<html>
<head>
  <title>new_mail_check</title>
  <meta http-equiv="Content-Type" content="text/html; charset=@{[enc_(DA::Unicode::external_charset())]}">
</head>
<body bgcolor=#0086F0 topmargin=0 marginheight=0 leftmargin=0 marginwidth=0></body>
</html>
end_tag

    print $outbuf;
    exit;
}

# 強制的に新着をクリア
if ($clear) {
    if (-f "$session->{temp_dir}/$session->{sid}.new_mail_check") {
        DA::System::file_unlink("$session->{temp_dir}/$session->{sid}.new_mail_check");
    }
}

if (!$session->{timezone}) { $session->{timezone}=$DA::Vars::p->{timezone}; }
$DA::Gettext::user_lang = $session->{user_lang};

# 個人の動作設定
my $master  = DA::IS::get_master($session, 'new_mail_check', 2);
# メールメニューの表示中のみ新規メールがあればメールを取得して
# メール一覧(INBOX)画面をリフレッシュするオプション
# debug=1 の場合はテスト用に短い更新時間を設定する
my $debug=0;
my $conf=DA::IS::get_sys_custom({},"new_mail_check");
   $conf->{interval}=10 if (!$conf->{interval});

my $time=time();
# チェック間隔 (秒単位 = 10 分)
my $interval;
if(!$master->{interval}){
	 $interval   = $conf->{interval} * 60;
}else{
	$interval   = $master->{interval} * 60;
}
# 1/1000 秒単位(最小間隔より小さい値 = 1 分)
my $js_interval= 60*1000;

if ($debug) {
    $interval   =30;
    $js_interval=3*1000;
}
# Ajax の場合はクッキーチェックを短い間隔で行う
if (DA::Ajax::mailer_ok($session)) { $js_interval= 3*1000; }

if ($master->{popup}) { $conf->{popup}=$master->{popup}; }
if ($master->{balloon}) { $conf->{balloon}=$master->{balloon}; }
if ($master->{auto_refresh}) { $conf->{auto_refresh}=$master->{auto_refresh}; }
if ($ENV{HTTP_USER_AGENT} !~ /Windows NT/) { $conf->{balloon}='off'; }

my $icon_image = ($session->{menu_style} eq 'preset') ? "/images/ctm03_ico_newmail.png" : "/images/parts/parts_hd16_036.gif";
if (!$jump) {
    my $icon;
    my $unload_script;
    if ($new) {
        if ($menu && ($session->{menu_style} eq 'shortcut'
                || $session->{menu_style} eq 'aqua2')) {
            $icon="<a href=\"javascript:pMove();\">"
            ."<img src=$icon_image"
            ." border=0 width=16 height=16 name=icon></a>";
        } else {
            $icon="<a href=$DA::Vars::p->{cgi_rdir}/new_mail_check.cgi?"
            ."jump=1 target=_top><img src=$icon_image "
            ."border=0 width=16 height=16 name=icon></a>";

        }
    }

    my($style,$body_color);
    $body_color='bgcolor=#0086F0';
    if ($session->{menu_style} eq 'shortcut'
            || $session->{menu_style} eq 'aqua' || $session->{menu_style} eq 'preset'){
        $style="<STYLE type=\"text/css\"><!--\n"
                ." body {background-color:transparent}\n"
                ."//--></STYLE>";
        $body_color='';
    }

# メールをチェックする前に青ページを表示
print "Content-type: text/html\n\n";
my $outbuf=<<buf_end;
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=@{[enc_(DA::Unicode::external_charset())]}">
<title>new_mail_check</title>
<script language="JavaScript"><!--
function Jump() {
    var ct = new Date();
    var time=Date.UTC(ct.getUTCFullYear(),ct.getUTCMonth(),ct.getUTCDate(),
            ct.getUTCHours(),ct.getUTCMinutes(),ct.getUTCSeconds());
    location.href='@{[js_esc_("$DA::Vars::p->{cgi_rdir}/new_mail_check.cgi?")]}'
        +'@{[js_esc_("menu=$menu&new=$new&reload=$reload&jump=4&time=")]}'+time;
}
function pMove() {
    if (typeof(parent.PageMove) == 'function') {
        parent.PageMove('@{[js_esc_("$DA::Vars::p->{cgi_rdir}/new_mail_check.cgi?jump=1")]}');
    }
}
//--></SCRIPT>
$style
</head>
<body $body_color topmargin=0 marginheight=0 leftmargin=0 marginwidth=0 onLoad="Jump()">
$icon</body></HTML>
buf_end

    print $outbuf;
    exit;
}

# 新着メールを取得して電子メールにジャンプ
if ($jump eq 1) {
    if (-f "$session->{temp_dir}/$session->{sid}.new_mail_check") {
        DA::System::file_unlink("$session->{temp_dir}/$session->{sid}.new_mail_check");
        $new=0;
    }
    my $width=($session->{top_style} eq 2) ? 110 : 142;
    my $row=DA::IS::get_menu_row($session);
    my $outbuf="<title>INSUITE @{[t_('電子メール')]}</title>"
    ."<frameset frameborder=0 framespacing=0 border=0 rows=\"$row,*\" "
    ."NAME=\"menu_fs\">"
    ."<frame src=$DA::Vars::p->{cgi_rdir}/top_menu.cgi?menu=em "
    ."name=left scrolling=no noresize marginwidth=0>"
    ."<frameset frameborder=0 framespacing=0 border=0 cols=\"$width,*\" name=menu_left>"
    ."<frame src=$DA::Vars::p->{cgi_rdir}/ma_menu.cgi name=left "
    ."scrolling=no noresize marginwidth=0>"
    ."<frame src=$DA::Vars::p->{cgi_rdir}/new_mail_check.cgi?jump=2 "
    ."name=work scrolling=auto marginheight=0 noresize>"
    ."</frameset></frameset>";

    DA::IS::print_data($session,$outbuf);
    $session->{dbh}->disconnect();
    exit;

} elsif ($jump eq 2) {

my ($head,$body,$nocache_foot)=
        DA::IS::get_head($session,"Mailer Check",'','no');
my $outbuf=<<buf_end;
<html><head>
<META HTTP-EQUIV="Refresh" CONTENT="0;URL=$DA::Vars::p->{cgi_rdir}/new_mail_check.cgi?jump=3">
$head
</head>
$body
<center>
<BR><BR><BR><H3>@{[t_("メール取得中・・・・・")]}</H3>
<BR><IMG SRC=$session->{img_rdir}/wait.gif WIDTH=133 HEIGHT=88>
<BR><BR>
<TABLE BORDER=0><TR><TD>
<FONT COLOR=red>
@{[t_("フォルダに保存されているメール数が多い場合などは、受信に時間が掛かる場合があります。")]}<BR>
@{[t_("処理が終了するまで、そのままお待ちください。")]}
</FONT>
</TD></TR></TABLE>
</center>
</BODY>
$nocache_foot
</HTML>
buf_end

    DA::IS::print_data($session,$outbuf);
    $session->{dbh}->disconnect();
    exit;

} elsif ($jump eq 3) {
    my $imaps   = {};
    DA::Mail::get_imap_session ($session, $imaps,
        {'sorce'=>'check', 'pop'=>1});
    DA::Mail::get_mail_portal($session, $imaps, { 'select' => 2 });
    DA::Mail::get_header_db($session, $imaps,
        { 'folder' => 'INBOX', 'select' => 1 });
    DA::Mail::_disconnect($imaps->{session},
        'ma_check:reload_proc:' . $session->{user});

my $outbuf=<<buf_end;
<HTML><title>JUMP3</title><HEAD>
<SCRIPT LANGUAGE="JavaScript"><!--
if (typeof(top.frames[0])=='object') {
    if (typeof(top.frames[0].frames['new_mail_check'])=='object') {
        top.frames[0].frames['new_mail_check'].document.location.href=
            '$DA::Vars::p->{cgi_rdir}/new_mail_check.cgi?menu=em';
    }
}
function getUTC() {
    var ct = new Date();
    var time=Date.UTC(ct.getUTCFullYear(),ct.getUTCMonth(),ct.getUTCDate(),
            ct.getUTCHours(),ct.getUTCMinutes(),ct.getUTCSeconds());
    return time;
}
function setCookie(item, value) {
    document.cookie = item + "=" + value + ";";
}
setCookie('$session->{sid}\-new_mail_check',getUTC());

location.href='$DA::Vars::p->{cgi_rdir}/ma_inbox_main.cgi?proc=1';
//--></SCRIPT>
</HEAD>
<BODY BGCOLOR=#FFFFFF>
</BODY></HTML>
buf_end

DA::IS::print_data($session,$outbuf);
$session->{dbh}->disconnect();
Apache::exit();

}

# JavaScript からのリロード以外の場合は Cookie の値から間隔をチェック
my $init_reload;
my $popup_script;
if (!$reload) {
    my $prev;
    foreach my $http_cookie (split(/\;/,$ENV{'HTTP_COOKIE'})) {
        my ($key,$value) = split(/\=/,$http_cookie,2);
        $key=~s/^\s+//; $key=~s/\s+$//;
        $value=~s/^\s+//; $value=~s/\s+$//;
        if ($key eq '$session->{sid}\-new_mail_check') { $prev=$value; }
    }
    my $time = $query->param('time');
    if ($prev && ($time - $prev >= $interval*1000)) { $init_reload=1; }
    if ($debug) { print STDERR "$time, $prev, $init_reload\n"; }
}

if (!$new && ($reload || $init_reload)) {
    my ($recent,$quota,$mes)=
        DA::Mail::get_mail_recent2($session, ['INBOX']);
    if ($recent->{'INBOX'}) {
        $new=1;
        if ($conf->{popup} eq 'on') { $popup_script="alert('@{[t_('新着メールがあります')]}');"; }
    }
}

if ($session->{mailer_style} eq 'classic' && $conf->{auto_refresh} eq 'on') {
    if ($new) {
        my $imaps   = {};
        DA::Mail::get_imap_session ($session, $imaps,
            {'sorce'=>'check', 'pop'=>1});
        DA::Mail::get_mail_portal($session, $imaps,
            { 'select' => 2 });
        DA::Mail::get_header_db($session, $imaps,
            { 'folder' => 'INBOX', 'select' => 1 });
        DA::Mail::_disconnect($imaps->{session},
            'ma_check:reload_proc:' . $session->{user});
    }
}

my $icon;
my $refresh_script;
my $check_key = DA::IS::get_check_key_param('&');
if ($new) {
    if (! -f "$session->{temp_dir}/$session->{sid}.new_mail_check") {
        DA::System::file_open(\*OUT,"> $session->{temp_dir}/$session->{sid}.new_mail_check");
        print OUT "new=1\n";
        close(OUT);
    }
    if (DA::Ajax::mailer_ok($session)) {
        my $mail = DA::IS::get_master($session, "ajxmailer");
        my $x = $mail->{window_pos_x}  || 0;
        my $y = $mail->{window_pos_y}  || 0;
        my $w = $mail->{window_width}  || 1024;
        my $h = $mail->{window_height} || 620;
        $icon="<a href=\"javascript:AjaxMailer($x, $y, $w, $h);\">"
            ."<img src=$icon_image "
            ."border=0 width=16 height=16 name=icon></a>";
		
		#=====================================================
		#           ----custom----
		#=====================================================
		DA::Custom::rewrite_ajax_new_mailer_icon($session,$menu,\$icon);
		#=====================================================
    } elsif ($conf->{auto_refresh} eq 'on' && $menu eq 'em' && $reload) {
        $icon="<img src=$session->{img_rdir}/null.gif border=0 width=16 "
            ."height=16 name=icon>";

# メール画面がフォルダ一覧の場合のみリフレッシュ
$refresh_script=<<buf_end;
if (typeof(parent.top.document.frames[2].document)=='object') {
    var frame_url=parent.top.document.frames[2].document.URL;
    if (frame_url.indexOf('ma_inbox_main.cgi') != -1) {
        setCookie('$session->{sid}\-new_mail_check',getUTC());
        if (typeof(parent.top.document.frames[1].PageMove) == 'function') {
           parent.top.document.frames[1].PageMove('ma_inbox_main.cgi?proc=1$check_key',1);
        }
    }
}
buf_end

    } else {
        if ($menu && ($session->{menu_style} eq 'shortcut'
                || $session->{menu_style} eq 'aqua2')){
            $icon="<a href=\"javascript:pMove();\">"
            ."<img src=$icon_image"
            ." border=0 width=16 height=16 "
            ."TITLE=\"@{[t_('新着メールがあります')]}\" name=icon></a>";
        } else {
            $icon="<a href=$DA::Vars::p->{cgi_rdir}/new_mail_check.cgi?"
            ."jump=1 target=_top><img src=$icon_image border=0 width=16 height=16 "
            ."TITLE=\"@{[t_('新着メールがあります')]}\" name=icon></a>";
        }
    }
} else {
    $icon="<img src=$session->{img_rdir}/null.gif border=0 width=16 "
    ."height=16 name=icon>";
}

my $unload_sub;
my $unload_script;
if ($conf->{ActiveX} eq 'on' && $conf->{balloon} eq 'on' && $icon !~ /null/) {
    $icon.="<OBJECT ID=SysTrayBalloon WIDTH=0 HEIGHT=0 "
    ."CLASSID=CLSID:1FC1F921-2C82-40E0-BD1F-A774475BB094 "
    ."CODEBASE=/cab/DASysTrayBalloon.CAB#version=1,0,0,1>"
    ."<PARAM NAME=_ExtentX VALUE=0><PARAM NAME=_ExtentY VALUE=0>"
    ."<PARAM NAME=Timeout VALUE=600000></OBJECT>"
    ."<script language=VBScript>SysTrayBalloon.ShowBalloon</script>";

    $unload_sub="<script language=VBScript>"
    ."Sub RemoveBalloon()\n"
    ."SysTrayBalloon.Remove\n"
    ."End Sub\n"
    ."</script>\n";
    $unload_script=" onUnLoad=\"RemoveBalloon()\"";
}

my $clear_script;
if ($icon !~ /null/) {
    $clear_script="document.location.href='$DA::Vars::p->{cgi_rdir}/'"
            ."+'new_mail_check.cgi?menu=$menu&clear=1';";
}

my $debug_script="window.status = 'DEBUG:'+prev+'-'+time;" if ($debug);
my($style,$body_color);
$body_color='bgcolor=#0086F0';
if ($session->{menu_style} eq 'shortcut' || $session->{menu_style} eq 'aqua' || $session->{menu_style} eq 'preset'){
    $style="<STYLE type=\"text/css\"><!--\n"
            ." body {background-color:transparent}\n"
            ."//--></STYLE>";
    $body_color='';
}

my $outbuf=<<buf_end;
<html><head>
<title>new_mail_check</title>
<script language="JavaScript"><!--
function getCookie(item) {
    var i, index, arr;
    arr = top.document.cookie.split(';');
    for(i = 0; i < arr.length; i++) {
        index = arr[i].indexOf("=");
        if (arr[i].substring(0, index) == item ||
                arr[i].substring(0, index) == ' '+item) {
            return arr[i].substring(index + 1);
        }
    }
    return '';
}
function setCookie(item, value) {
    top.document.cookie = item + '=' + value + ';';
}
function getUTC() {
    var ct = new Date();
    var time=Date.UTC(ct.getUTCFullYear(),ct.getUTCMonth(),ct.getUTCDate(),
            ct.getUTCHours(),ct.getUTCMinutes(),ct.getUTCSeconds());
    return time;
}
function currentTime() {
    var clear=getCookie('$session->{sid}\-new_mail_clear');
    if (clear == 'on') {
        setCookie('$session->{sid}\-new_mail_clear','off');
        $clear_script
    }

    var time=getUTC();
    var prev=getCookie('$session->{sid}\-new_mail_check');
    $debug_script
    if (prev == '') {
        setCookie('$session->{sid}\-new_mail_check',time);
    } else {
        if (time - prev >= $interval * 1000) {
            setCookie('$session->{sid}\-new_mail_check', time);
            document.location.href='$DA::Vars::p->{cgi_rdir}/new_mail_check.cgi?menu=$menu&new=$new&reload=1';
        }
    }
    setTimeout('currentTime()', $js_interval);
}

function pMove() {
    if (typeof(parent.PageMove) == 'function') {
        parent.PageMove('$DA::Vars::p->{cgi_rdir}/new_mail_check.cgi?jump=1');
    }
}

var AjaxMailerWindow;
function AjaxMailer(x, y, w, h) {
	var key = '$session->{sid}\-operation_flag';
	var cookies = document.cookie.split(";");
	var operation_flag = "";
	for (var i = 0; i < cookies.length ; i++) {
		if (cookies[i].split("=")[0].replace(/(^\s\*)|(\s\*\$)/g, "") === key) {
			operation_flag = cookies[i].split("=")[1];
		}
	}
	if (operation_flag !== "" && operation_flag !== $session->{user}){
		alert("他のメールアカウントは操作しています、ちょっと待てください。");
	} else{
		document.cookie = '$session->{sid}\-org_mail=$session->{user};';
	    var Param = 'width=' + w + ',height=' + h + ',resizable=1';
	    var Url   = '/cgi-bin/ajax_mailer.cgi?html=index&login=1&time=@{[time]}';
	    Url += '$check_key';
		Url += '&org_mail_gid=$session->{user}&org_mail_box=$session->{user}';
	    AjaxMailerWindow = window.open(Url, "$session->{user}\_AjaxMailer\_$session->{user}", Param);
	    AjaxMailerWindow.moveTo(x, y);
	    AjaxMailerWindow.focus();
	    location.href="$DA::Vars::p->{cgi_rdir}/new_mail_check.cgi?menu=$menu&clear=1";
	}
}

$refresh_script

//--></SCRIPT>
$style
$unload_sub
</head>
<body $body_color topmargin=0 marginheight=0 leftmargin=0 marginwidth=0 onLoad="currentTime()" $unload_script>
<center>
$icon
</center>
<script language="JavaScript"><!--
$popup_script
//--></SCRIPT>
<form><input type=hidden name=menu value=$menu></form>
</body></html>
buf_end

DA::IS::print_data($session,$outbuf);
$session->{dbh}->disconnect();

}

1;
