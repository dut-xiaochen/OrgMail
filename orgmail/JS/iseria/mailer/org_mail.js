
var OrgMail = {
    sid       : '',
	user	  : '',
    popup     : '',
    check_key : '',
    message   : '',
    width     : '',
    height    : '',
    xPos      : '',
    yPos      : '',
    AjaxMailer: function(sec) {
        OrgMail.setCookie('org_mail',sec);
        document.getElementById('org_mail_icon').style.visibility='hidden';
        var Param = 'width='+OrgMail.width+',height='+OrgMail.height+',resizable=1';
        var Url  = '/cgi-bin/ajax_mailer.cgi?html=index&login=1&time='+new Date();
            Url += OrgMail.check_key;
        var AjaxMailerWindow = window.open(Url, OrgMail.user+'_AjaxMailer', Param);
            AjaxMailerWindow.moveTo(OrgMail.xPos, OrgMail.yPos);
            AjaxMailerWindow.focus();
		return;
    },
    getUTC: function() {
        var ct = new Date();
        var time=Date.UTC(ct.getUTCFullYear(),ct.getUTCMonth(),ct.getUTCDate(),
            ct.getUTCHours(),ct.getUTCMinutes(),ct.getUTCSeconds());
        return time;
    },
    getCookie: function(item) {
        var i, index, arr;
        var key = OrgMail.sid+'-'+item;
        arr = top.document.cookie.split(';');
        for(i = 0; i < arr.length; i++) {
            index = arr[i].indexOf("=");
            if (arr[i].substring(0, index) === key ||
                arr[i].substring(0, index) === ' '+key) {
                return arr[i].substring(index + 1);
            }
        }
        return '';
    },
    setCookie: function(item, value) {
        top.document.cookie = OrgMail.sid+'-'+item+'=' + value + ';';
    },
    checkProc: function() {
        var httpoj;
        var icon;
        var url;
        var sec;
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
            try {
                icon = OrgMail.getCookie('org_mail_icon');
                url = '/cgi-bin/org_mail_check.cgi?uptime='+new Date()+OrgMail.check_key;
                httpoj.open('POST', url);
                httpoj.onreadystatechange = function() {
                    if (httpoj.readyState === 4) {
                        if (httpoj.status === 200){
                            if (httpoj.responseText !== 'ok') {
                                sec = httpoj.responseText;
                                document.getElementById('org_mail_icon').style.visibility='visible';
                                document.getElementById('org_mail_icon').onclick=function() { OrgMail.AjaxMailer(sec); };
                                OrgMail.setCookie('org_mail_icon', sec);
                                if (icon !== 'clear' && OrgMail.popup === 'on') {
                                    alert(OrgMail.message);
                                }
                            } else {
                                document.getElementById('org_mail_icon').style.visibility='hidden';
                                // document.getElementById('org_mail_icon').onclick=function() { };
                                OrgMail.setCookie('org_mail_icon', 'off');
                            }
                        }
                    }
                };
                httpoj.send( null );
            } catch (e) { }
        }
    }
};

