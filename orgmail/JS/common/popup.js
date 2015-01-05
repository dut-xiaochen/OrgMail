function setUrl(url){
        // add check key
        var chk_key = DApopupParams.chkKey;
        var is_chk_key = url.indexOf(chk_key.replace('&',''));
        if (is_chk_key >= 0 ) {
                return url;
        }
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
function Pop(Proc,Title,Width,Height,No,noname,POSX,POSY){
    var Param='width='+Width+',height='+Height+',resizable=1,scrollbars=1';
    var Url=DApopupParams.cgiRdir + '/pop_up.cgi?proc='+Proc+'&title='+Title;
    var pwin;
    if (!noname || !check_poptype()) {
        if (!No || No < 10){
            var last=Title.indexOf('.gif');
            var name=Title.substring(0,last);
            var winname = name + No;
            pwin=window.open(setUrl(Url),winname,Param);
        } else {
            pwin=window.open(setUrl(Url),No,Param);
        }
    } else {
        pwin=window.open(setUrl(Url),'',Param);
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
    var pwin=window.open(setUrl(Url),'',Param);
    if (POSX != null && POSX != '' && POSY != null && POSY != '') {
        pwin.moveTo(POSX, POSY);
    }
}
function Info(mid,type,noname,msid){
    if(!type){ type='addr'; }
    cgi='info_card.cgi?type='+type+'&id='+mid+'&msid='+msid;
    if (!noname || !check_poptype()) {
        var winname = 'Info' + mid;
        var info=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        winname,'width=480,height=600,resizable=1,scrollbars=1');
    } else {
        var info=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        '','width=480,height=600,resizable=1,scrollbars=1');
    }
}
function aInfo(id,noname){
    if (!noname || !check_poptype()) {
        var Ids = id.split('-');
        var winname = 'aInfo' + Ids[0];
        var info=window.open(setUrl(DApopupParams.cgiRdir+'/og_card_addr.cgi?id='+id),
        winname,'width=450,height=600,resizable=1,scrollbars=1');
    } else {
        var info=window.open(setUrl(DApopupParams.cgiRdir+'/og_card_addr.cgi?id='+id),
        '','width=450,height=600,resizable=1,scrollbars=1');
        //info.focus();
    }
}
function gInfo(gid,noname,msid){
    cgi='info_card.cgi?type=group&id='+gid+'&msid='+msid;
    if (!noname || !check_poptype()) {
        var winname = 'gInfo' + gid;
        var ginfo=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        winname,'width=500,height=480,resizable=1,scrollbars=1');
    } else {
        var ginfo=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        '','width=500,height=480,resizable=1,scrollbars=1');
    }
}
function treeInfo(gid,parent,noname,msid){
    cgi='info_card.cgi?type=tree&id='+gid+'&parent='+parent+'&msid='+msid;
        if (!noname || !check_poptype()) {
        var treeinfo=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        'treeInfo','width=450,height=600,resizable=1,scrollbars=1');
        } else {
        var treeinfo=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        '','width=450,height=600,resizable=1,scrollbars=1');
        }
}
function memberInfo(gid,noname,msid){
    cgi='info_card.cgi?type=member&id='+gid+'&msid='+msid;
        if (!noname || !check_poptype()) {
        var winname = 'memberInfo' + gid;
        var treeinfo=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        winname,'width=720,height=450,resizable=1,scrollbars=1');
        } else {
        var treeinfo=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        '','width=720,height=450,resizable=1,scrollbars=1');
        }
}
function authInfo(auth,noname){
    cgi='info_auth.cgi?auth='+auth;
    if (!noname || !check_poptype()) {
        var info=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        'authInfo','width=400,height=350,resizable=1,scrollbars=1');
    } else {
        var info=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        '','width=400,height=350,resizable=1,scrollbars=1');
    }
}
function fInfo(fid,noname){
    cgi='info_card.cgi?type=fa&id='+fid;
    if (!noname || !check_poptype()) {
        var winname = 'fInfo' + fid;
        var finfo=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        winname,'width=550,height=450,resizable=1,scrollbars=1');
    } else {
        var finfo=window.open(setUrl(DApopupParams.cgiRdir+'/'+cgi),
        '','width=550,height=450,resizable=1,scrollbars=1');
    }
}
