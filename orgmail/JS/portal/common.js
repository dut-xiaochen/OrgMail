
function setUrl(url){
    var is_chk_key = url.indexOf(chk_key.replace('&',''));
    if (is_chk_key >= 0 ) { return url; }
    if ( url.match(/\?/) ){
        return url + chk_key ;
    }else{
        return url + chk_key.replace(/^&/, '?');
    }
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
function Pop(Proc,Title,Width,Height,No,Win,POSX,POSY){
    var Param='width='+Width+',height='+Height+',resizable=1';
    var Url;
	if (Proc.match(/_DA_CHK_KEY_/)) {
    	Url='/cgi-bin/pop_up.cgi?proc='+Proc+'&title='+Title;
	} else {
    	Url=setUrl('/cgi-bin/pop_up.cgi?proc='+Proc+'&title='+Title);
	}
    var pwin;
    if (!Win || !check_poptype()) {
        if (!No || No < 10){
            var last=Title.indexOf('.gif');
            var name=Title.substring(0,last);
            var winname = name + No;
            pwin=window.open(Url,winname,Param);
        } else {
            pwin=window.open(Url,No,Param);
        }
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
function Pop4Ajax(Url,Width,Height,POSX,POSY){
    var Param='width='+Width+',height='+Height+',resizable=1';
    var pwin=window.open(Url,'',Param);
    if (POSX != null && POSX != '' && POSY != null && POSY != '') {
        pwin.moveTo(POSX, POSY);
    }
}
function Pop4AjaxWithMailAccount(Url,Width,Height,POSX,POSY){
    var Param='width='+Width+',height='+Height+',resizable=1';
    var key="";
    var mailAccount="";
    if(document.getElementById("portal_mail_cookie_key")){
        key = document.getElementById("portal_mail_cookie_key").value + "-org_mail";
    }
    if(document.getElementById("protal_mail_data_account")){
        mailAccount = document.getElementById("protal_mail_data_account").value;
    }
    var cookies = document.cookie.split(";");
    var cookieAccount = "";
    for (var i = 0; i < cookies.length ; i++) {
        if (cookies[i].split("=")[0].replace(/(^\s*)|(\s*$)/g, "") === key) {
            cookieAccount = cookies[i].split("=")[1];
        }
    }
    if (mailAccount === ""){
        mailAccount = cookieAccount;
    }
    if (mailAccount !== cookieAccount){
        var result = confirm("Are you sure?");
        if (!result){
            return;
        }
    }
    document.cookie = key + "=" + mailAccount;
    Url += "&org_mail_box=" + mailAccount;
    Url += "&org_mail_gid=" + mailAccount;
    var pwin=window.open(setUrl(Url),'',Param);
    if (POSX != null && POSX != '' && POSY != null && POSY != '') {
        pwin.moveTo(POSX, POSY);
    }
}
function Info(mid,type,noname){
    if(!type){ type='addr'; }
    cgi='info_card.cgi?type='+type+'&id='+mid;
    if (!noname || !check_poptype()) {
        var winname = 'Info' + mid;
        var info=window.open(setUrl('/cgi-bin/'+cgi),
        winname,'width=480,height=600,resizable=1,scrollbars=1');
    } else {
        var info=window.open(setUrl('/cgi-bin/'+cgi),
        '','width=480,height=600,resizable=1,scrollbars=1');
    }
}
function gInfo(gid,noname){
    cgi='info_card.cgi?type=group&id='+gid;
    if (!noname || !check_poptype()) {
        var winname = 'gInfo' + gid;
        var ginfo=window.open(setUrl('/cgi-bin/'+cgi),
        winname,'width=500,height=480,resizable=1,scrollbars=1');
    } else {
        var ginfo=window.open(setUrl('/cgi-bin/'+cgi),
        '','width=500,height=480,resizable=1,scrollbars=1');
    }
}
function fInfo(fid,noname){
    cgi='info_card.cgi?type=fa&id='+fid;
    if (!noname || !check_poptype()) {
        var winname = 'fInfo' + fid;
        var finfo=window.open(setUrl('/cgi-bin/'+cgi),
        winname,'width=550,height=450,resizable=1,scrollbars=1');
    } else {
        var finfo=window.open(setUrl('/cgi-bin/'+cgi),
        '','width=550,height=450,resizable=1,scrollbars=1');
    }
}
function authInfo(auth,noname){
    cgi='info_auth.cgi?auth='+auth;
    if (!noname || !check_poptype()) {
        var info=window.open(setUrl('/cgi-bin/'+cgi),
        'authInfo','width=400,height=350,resizable=1,scrollbars=1');
    } else {
        var info=window.open(setUrl('/cgi-bin/'+cgi),
        '','width=400,height=350,resizable=1,scrollbars=1');
    }
}
function Notice(num){
    cgi='info_card.cgi?type=notice&num='+num;
    if (!check_poptype()) {
        var notice=window.open(setUrl('/cgi-bin/'+cgi),
        'Notice','width=380,height=450,resizable=1');
    } else {
        var notice=window.open(setUrl('/cgi-bin/'+cgi),
        '','width=380,height=450,resizable=1');
    }
}
function cInfo(num,place){
    cgi='info_card.cgi?type=call&from=login_main&num='+num+'&place='+place;
    if (!check_poptype()) {
        var ginfo=window.open(setUrl('/cgi-bin/'+cgi),
        'cInfo','width=470,height=450,resizable=1,scrollbars=1');
    } else {
        var ginfo=window.open(setUrl('/cgi-bin/'+cgi),
        '','width=470,height=450,resizable=1,scrollbars=1');
    }
}
var mailDetailFlag = 0;
function mailDetail(Proc,Title,Width,Height,no,Seen,POSX,POSY) {
    if (mailDetailFlag) {
        return;
    } else {
        mailDetailFlag = 1;
    }

    var date  = new Date();
    var time  = date.getTime();
    var Url   = Proc + '%20time=' + time;
    Pop(Url,Title,Width,Height,no,1,POSX,POSY);

    if (Proc.match(/^ma_new.cgi/)) {
        resetID = setInterval('resetmDFlag();', 1500);
    } else {
        mailDetailFlag = 0;
    }
}
function resetmDFlag() {
    clearInterval(resetID);
    mailDetailFlag = 0;
}
var onReportUserChange = 0;
var onFaUserChange = 0;

var onChanging = 0;
function GroupChange(gid,insuite_tab,f) {
    if (onChanging == 0) { 
		onChanging = 1;
        if (insuite_tab && parent.frames.insuite_tab) {
            if (parent.frames.insuite_main) {
				try {
                	f.date.value = parent.frames.insuite_main.document.forms['date_form'].date.value;
				} catch(e) {
				}
            }
            document.location.href='/cgi-bin/login_main.cgi?frame=tab&date='
            + f.date.value + '&space=' + gid;
        }
        f.submit();
    }
}
function getBrowser(){
    // _bro = 1    NN6
    // _bro = 2    NN4
    // _bro = 3    IE
    // _bro = 0    Other
    var _bro=(document.all?3:(document.getElementById?1:(document.layers?2:0)));
    return _bro;
}
function callView(NUM,WIDTH,HEIGHT,MB,TB,LB,SB,WIN_NAME){
    var Url='/cgi-bin/pop_call.cgi?num=' + NUM;
    var Name='callView_' + NUM;
    var Param='scrollbars=1,resizable=1';
    if (MB) {
        Param = Param + ",menubar=yes";
    }
    if (TB) {
        Param = Param + ",toolbar=yes";
    }
    if (LB) {
        Param = Param + ",location=yes";
    }
    if (SB) {
        Param = Param + ",status=yes";
    }
    if (WIDTH) {
        Param = Param + ",width=" + WIDTH;
    }
    if (HEIGHT) {
        Param = Param + ",height=" + HEIGHT;
    }
    if (WIN_NAME) {
        var pwin=window.open(setUrl(Url),WIN_NAME,Param);
    } else {
        var pwin=window.open(setUrl(Url),'',Param);
    }
}

function tab_click(id) {
    if (parent.frames.insuite_main) {
		var cr_date='';
        try {
            if (parent.frames['insuite_main'].document.forms['date_form']) {
                cr_date = parent.frames['insuite_main'].document.forms['date_form'].date.value;
            }
        } catch(e) { }
		var main_url='/cgi-bin/login_main.cgi?date='+cr_date;
			main_url+='&space='+id;
        parent.frames.insuite_main.location.href=main_url;
	}
    if (parent.frames.insuite_tab) {
		var tab_url='/cgi-bin/login_main.cgi?frame=tab';
			tab_url+='&space='+id;
        parent.frames.insuite_tab.location.href=tab_url;
    }
}

function drag_drop_mode(mode,id) {
	var httpoj;
    if(window.ActiveXObject){
        try {
            httpoj = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                httpoj = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e2) { }
        }
    } else if(window.XMLHttpRequest){
        httpoj = new XMLHttpRequest();
    }
	if (httpoj) {
		var url='/cgi-bin/portlet_iframe.cgi';
		var param='drag_drop_mode='+mode+'&uptime='+new Date();
    	httpoj.open('POST', setUrl(url));
    	httpoj.setRequestHeader("content-type","application/x-www-form-urlencoded;");
    	httpoj.setRequestHeader("Content-length", param.length);
    	httpoj.setRequestHeader("Connection", "close");
    	httpoj.onreadystatechange = function() {
        	if (httpoj.readyState==4) { tab_click(id); }
    	};
    	httpoj.send( param );
	}
}

