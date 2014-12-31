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

my $r = shift;

&main($r);
Apache::exit();

sub main {
	my ($r) = @_;

	my $session = {};
	DA::Session::get_dir($session, $r);
	my $query = Apache::Request->new($r, TEMP_DIR => "$session->{temp_dir}");
	DA::Valid::check_param_all($session, $query);

	my ($error);
	my @input = qw (
		html login richtext search
	);
	my $c = DA::Ajax::Mailer::read_query($query, \@input);
	
	## New CBP for SYOKKI ================================================
    DA::Custom::ma_new_init_check($session, 'ajxmailer');
    ## ===================================================================

	my $error;
	my $org_mail_gid = $query->param("org_mail_gid");
	if ($c->{login}) {
		unless (DA::Ajax::Mailer::conv_master($session)) {
			$error = DA::Ajax::Mailer::convert_mailer(t_("設定が移行できません。"));
		} else {
			unless (DA::Ajax::Mailer::switch_master($session, "ajxmailer")) {
				$error = DA::Ajax::Mailer::convert_mailer(t_("メール設定が反映できません。"));
			}
			unless (DA::Ajax::Mailer::switch_master($session, "imap")) {
				$error = DA::Ajax::Mailer::convert_mailer(t_("ＩＭＡＰ設定が反映できません。"));
			}
		}
	}

	my $messages = DA::Ajax::Mailer::get_messages($session, $c);

	if ($c->{html} =~ /^(index|viewer|editor|searcher)$/) {
		
		if ($error) {
			DA::Ajax::Mailer::errorpage($session, $error, "nobutton");
		} else {
			my $imaps = DA::Ajax::Mailer::connect($session, { "nosession" => 1 });
			if ($imaps->{error}) {
				DA::Ajax::Mailer::errorpage($session, $imaps->{message}, 'nobutton');
			} else {
				$c->{org_mail_gid} = $org_mail_gid;
				my $result = DA::Ajax::Mailer::get_config($session, $imaps, $c);
				if ($result->{error}) {
					DA::Ajax::Mailer::errorpage($session, $result->{message}, 'nobutton');
				} else {
					my $base = "$DA::Vars::p->{iseria_dir}/mailer";
					if ($c->{login}) {
						DA::Ajax::Mailer::login($session, $imaps, $c);
					}
					if ($c->{html} =~ /^(index|searcher)$/) {
						my $title = $result->{title};
						my $htmls = {};
						my $title = $result->{title};
						foreach my $name (qw(viewer editor)) {
							$result->{title} = $title;
							if ($name eq "viewer") {
								$result->{title} .= DA::Ajax::Mailer::convert_mailer(t_(" メール詳細"));
							} else {
								$result->{title} .= DA::Ajax::Mailer::convert_mailer(t_(" メール作成"));
							}
							
							my $html = &get_template($session, "$base/$name\.html", $result, $messages, 1, $query->param("org_mail_gid"), false);
							   $html = DA::Charset::convert(\$html, DA::Ajax::Mailer::external_charset(), DA::Ajax::Mailer::mailer_charset());
							$htmls->{$name} = $html;
						}
						$result->{title} = $title;
						$result->{html}->{viewer} = $htmls->{viewer};
						$result->{html}->{editor} = $htmls->{editor};
					}
					my $isMailerBox = ($c->{html} eq "index") ? true : false;
					print "Content-Type: text/html\n\n";
					print &get_template($session, "$base/$c->{html}.html", $result, $messages, 1, $query->param("org_mail_gid"), $isMailerBox);
				}
			}
		}
	} else {
		my $buf;
		if ($error) {
			$buf =<<end_buf;

alert('$error');
window.close();
end_buf

		} else {
			my $imaps = DA::Ajax::Mailer::connect($session, { "nosession" => 1 });
			if ($imaps->{error}) {

            $buf =<<end_buf;
alert('$imaps->{message}');
window.close();
end_buf

			} else {
				my $result = DA::Ajax::Mailer::get_config($session, $imaps, $c);

				if ($result->{error}) {

					$buf =<<end_buf;
alert('$result->{message}');
window.close();
end_buf

				} else {
					if ($c->{login}) {
						DA::Ajax::Mailer::login($session, $imaps, $c);
					}

					my $json  = DA::Ajax::make_json($session, $result, "", DA::Ajax::Mailer::mailer_charset());

					$buf =<<end_buf;
$result->{richText}->{headRTE}
window.userConfig  = $json;
window.messageCore = @{[DA::Ajax::Mailer::convert_external($messages)]};
end_buf

				}
			}
		}

		print DA::Ajax::make_json_head($session);
		print $buf;
	}

	$session->{dbh}->disconnect();
}

sub get_template($$$$;$;$;$) {
	my ($session, $file, $data, $messages, $opt, $org_mail_gid, $isMailBox) = @_;
	my $json = DA::Ajax::make_json($session, $data, "", DA::Ajax::Mailer::mailer_charset());
	if ($opt) {
		$json =~ s/<([\/]?script[^<>]*)>/\\<$1\\>/ig;
	} else {
		$json =~ s/<\/(script)>/<\\\/$1>/ig;
	}
	if (!$isMailBox) {
		$isMailBox = false;
	}
	# $json is external charset.
	my $head_before =<<end_buf;
<script>
<!--
window.userConfig  = $json;
window.messageCore = @{[DA::Ajax::Mailer::convert_external($messages)]};
//-->
var OrgMailer = {};
OrgMailer.vars = {};
OrgMailer.vars.operation_warned = 0;
OrgMailer.vars.is_mail_box = $isMailBox;
OrgMailer.vars.is_blured = false;
OrgMailer.vars.org_mail_gid = $org_mail_gid;
OrgMailer.vars.cookie_key = '$session->{sid}';

window.onload = function(){
	DA.mailer.util.setOperationFlag("");
	DA.mailer.util.setOperationWarnedFlag("");
	document.cookie = '$session->{sid}\-org_mail=$org_mail_gid;';
}

window.onclick = function(e){
	OrgMailer.vars.is_blured = false;
	if (DA.mailer.util.getOperationFlag() === '' || DA.mailer.util.getOperationFlag() === OrgMailer.vars.org_mail_gid.toString()){
		document.cookie = '$session->{sid}\-org_mail=$org_mail_gid;';
	}
}

window.onfocus = function(){
	OrgMailer.vars.is_blured = false;
	if (DA.mailer.util.getOperationFlag() !== ''){
		if ((!OrgMailer.vars.is_mail_box) || 
			(OrgMailer.vars.is_mail_box && (DA.mailer.util.getOperationWarnedFlag().indexOf(OrgMailer.vars.org_mail_gid.toString() + window.name) < 0) && 
			DA.mailer.util.getOperationFlag() !== OrgMailer.vars.org_mail_gid.toString())){
			if (OrgMailer.vars.operation_warned === 0){
				OrgMailer.vars.operation_warned = 1;
				DA.mailer.util.setOperationWarnedFlag(OrgMailer.vars.org_mail_gid.toString() + window.name);
				DA.util.warn(DA.locale.GetText.t_("MESSAGE_CHANGE_TAB_ERROR"));
				OrgMailer.vars.is_blured = false;
				DA.mailer.util.autoCloseWaitingMask();
				DA.waiting.show(DA.locale.GetText.t_("MESSAGE_CHANGE_TAB_WAITING_MESSAGE"));
			}
		}
		return;
	}
	document.cookie = '$session->{sid}\-org_mail=$org_mail_gid;';
}

window.onblur = function(e) {
    e = e || window.event;
    if (window.ActiveXObject && /MSIE/.test(navigator.userAgent)) {
        var x = e.clientX;
        var y = e.clientY;
        var w = document.body.clientWidth;
        var h = document.body.clientHeight;
        if (x >= 0 && x <= w && y >= 0 && y <= h) {
            window.focus();
        } else {
			OrgMailer.vars.is_blured = true;
		}
    } else{
		OrgMailer.vars.is_blured = true;
	}
}
</script>
end_buf

	$head_before = qq{
		<script type="text/javascript" src="/dui/firebug-lite/DA_firebug.js"></script>
		$head_before
	} if $DA::Vars::p->{FIREBUG}; 

	my $head_after;
	# -- Enter連打対策
	my $except_flg = 0;

	if ($session->{ua_browser} eq 'InternetExplorer' && $DA::Vars::p->{rest_enter} ne "" && $file=~/index\.html|searcher\.html/) {
        foreach my $l (split(/[\r\n]+/, $DA::Vars::p->{rest_enter})) {
            if ($ENV{SCRIPT_NAME} =~ /$l/) {
                if (DA::Ajax::user_search_ok($session) && $ENV{SCRIPT_NAME} =~ /sc_regist\.cgi|fa_regist\.cgi/) {
                    $except_flg = 1;
                }

                $head_after =<<end_buf;
<link rel="stylesheet" type="text/css" href="$DA::Vars::p->{css_rdir}/UTF-8/$session->{char_style}\.css">
<style>
input,textarea { ime-mode: @{[($session->{ime_init}) ? $session->{ime_init} : 'auto']} }
</style>
<script language="JavaScript"><!--
var DAsafeLink = function() {
  var exceptFlg = '@{[js_esc_($except_flg)]}';
  var initialized = false;
  var focusItem = {};
  var setFocus = function(){
    if(focusItem.nodeType) {
      try {focusItem.focus();} catch(e){}
      focusItem = {};
      return true;
    } else {
      return false;
    }
  };
  var keyPressCheck = function(event){
    var el = Event.element(event);
    if(event.keyCode == Event.KEY_RETURN){
      if (el.tagName == 'A' || el.type == 'text' || el.type == 'submit' || el.type == 'button') {
        if (!(exceptFlg == '1' && (el.id == 'USERSEL_idText' || el.id == 'PUBSEL_idText' || el.id == 'BYID_SEL_idText'))) {
          var link = el;
          if(link == focusItem || DAsafeLink.throttle()){
            link.blur();
            return false;
          }
          setTimeout(function(){
            focusItem = link;
            try{link.blur();}catch(e){}
          }, 20);
        }
      }
    } else if(event.keyCode == Event.KEY_TAB){
      if(setFocus()){
        return false;
      }
    }
  };
  var lastClickTime;
  return {
    initialize : function(){
    if (!initialized) {
      initialized = true;
      Event.observe(window.document, "keydown", keyPressCheck, true);
    }
  },
  disable : function(){
    if(initialized){
      initialized = false;
      Event.stopObserving(window.document, "keydown", keyPressCheck, true);
    }
  },
  throttle : function(){
    var now = new Date().getTime();
      if (now - lastClickTime < 1000){
        lastClickTime = now;
        if (arguments.length > 0)
          return;
        return true;
      }
      lastClickTime = now;
      if (arguments.length == 0)
        return false;
      var args = Array.prototype.slice.call(arguments);
      var f = args.shift();
      f.apply(null, args);
    }
  };
}();
DAsafeLink.initialize();
//--></script>
end_buf
				last;
            }else{
$head_after =<<end_buf;
<link rel="stylesheet" type="text/css" href="$DA::Vars::p->{css_rdir}/UTF-8/$session->{char_style}\.css">
<style>
input,textarea { ime-mode: @{[($session->{ime_init}) ? $session->{ime_init} : 'auto']} }
</style>
end_buf
			}
		}
	}else{
$head_after =<<end_buf;
<link rel="stylesheet" type="text/css" href="$DA::Vars::p->{css_rdir}/UTF-8/$session->{char_style}\.css">
<style>
input,textarea { ime-mode: @{[($session->{ime_init}) ? $session->{ime_init} : 'auto']} }
</style>
end_buf
	}
	my $body_before =<<end_buf;
end_buf

	my $body_after =<<end_buf;
end_buf

my $fck_script = (not $DA::Vars::p->{FIREBUG}) ?  'fckeditor' : 'DA_fckeditor_profile';
	my $richtext_head =<<end_buf;
<link rel="stylesheet" type="text/css" href="$DA::Vars::p->{js_rdir}/richText/rte.css">
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/richtext.js"></script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/prototype.lite.js"></script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/moo.fx.js"></script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/moo.fx.pack.js"></script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/common.js"></script>
<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/richText/base.js"></script>
<script type="text/javascript" src="/dui/richtext/editor/$fck_script.js"></script>

<script>
$data->{richText}->{headRTE}
</script>
end_buf

	my $richtext_init =<<end_buf;
$data->{richText}->{initRTE}
end_buf

	my $richtext_write =<<end_buf;
<script>
$data->{richText}->{writeRTE}
</script>
end_buf

	my $tmpl = HTML::Template->new(
		filename => $file,
		die_on_bad_params => 0,
		cache => 1
	);

	$tmpl->param("HTML_TITLE",
		DA::Ajax::Mailer::convert_external($data->{title}));
	$tmpl->param("HEAD_BEFORE", $head_before);
	$tmpl->param("HEAD_AFTER",
		DA::Ajax::Mailer::convert_external($head_after));
	$tmpl->param("BODY_BEFORE",
		DA::Ajax::Mailer::convert_external($body_before));
	$tmpl->param("BODY_AFTER",
		DA::Ajax::Mailer::convert_external($body_after));
	$tmpl->param("RICHTEXT_HEAD",
		DA::Ajax::Mailer::convert_external($richtext_head));
	$tmpl->param("RICHTEXT_INIT",
		DA::Ajax::Mailer::convert_external($richtext_init));
	$tmpl->param("RICHTEXT_WRITE",
		DA::Ajax::Mailer::convert_external($richtext_write));
	$tmpl->param("APP_RDIR", $data->{appRdir});
	$tmpl->param("SEARCH_BUTTON", t_('検索'));
	if ($session->{ua_browser} eq 'InternetExplorer' && $session->{char_style} eq 'custom_style') {
		$tmpl->param("CUSTOM_STYLE", 1);
	}
	$tmpl->param("URI_PREFIX", DA::IS::get_uri_prefix());
	# 組織メール
	my $on_load_js=DA::Ajax::Mailer::convert_external(
        DA::OrgMail::ajxmailer_set_onload_js($session,$file,$data,$messages,$opt)
    ) if (DA::OrgMail::check_org_mail_permit($session));
    my $on_beforeunload_js=DA::Ajax::Mailer::convert_external(
        DA::OrgMail::ajxmailer_set_onbeforeunload_js($session,$file,$data,$messages,$opt)
    ) if (DA::OrgMail::check_org_mail_permit($session));

	$on_load_js.=DA::Ajax::Mailer::convert_external(
        DA::Custom::ajxmailer_set_onload_js($session,$file,$data,$messages,$opt)
    );
    $on_beforeunload_js.=DA::Ajax::Mailer::convert_external(
        DA::Custom::ajxmailer_set_onbeforeunload_js($session,$file,$data,$messages,$opt)
    );

	$tmpl->param("ON_LOAD_JS", $on_load_js);
    $tmpl->param("ON_BEFOREUNLOAD_JS", $on_beforeunload_js);
	
	my $agent = DA::CGIdef::get_user_agent($ENV{'HTTP_USER_AGENT'});
	$tmpl->param("IE8_COMPATIBLE", 
		($agent->{browser} eq "InternetExplorer" && int($agent->{browser_v}) >= 7 && $agent->{engine} eq "Trident" && int($agent->{engine_v}) >= 4));
	
	return($tmpl->output);
}

1;
