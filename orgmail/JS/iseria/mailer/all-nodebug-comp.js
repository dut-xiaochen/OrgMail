var DA={widget:{},log:function(_1,_2,_3){
}};
DA.vars=window.userConfig;
(function(){
var _4;
if(location.href.match(/^(https\:\/\/[^\/]+)/)){
_4=RegExp.$1;
if(DA.vars.imgRdir.match(/^\//)){
DA.vars.imgRdir=DA.vars.imgRdir.replace(/\//,_4+"/");
}
if(DA.vars.clrRdir.match(/^\//)){
DA.vars.clrRdir=DA.vars.clrRdir.replace(/\//,_4+"/");
}
}
})();
var BrowserDetect={init:function(){
this.browser=this.searchString(this.dataBrowser)||"An unknown browser";
this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";
this.OS=this.searchString(this.dataOS)||"an unknown OS";
},searchString:function(_5){
var _6;
var _7;
for(var i=0;i<_5.length;i++){
_6=_5[i].string;
_7=_5[i].prop;
this.versionSearchString=_5[i].versionSearch||_5[i].identity;
if(_6){
if(_6.indexOf(_5[i].subString)!==-1){
return _5[i].identity;
}
}else{
if(_7){
return _5[i].identity;
}
}
}
},searchVersion:function(_9){
var _a=_9.indexOf(this.versionSearchString);
if(_a===-1){
return;
}
return parseFloat(_9.substring(_a+this.versionSearchString.length+1));
},dataBrowser:[{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari"},{prop:window.opera,identity:"Opera"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};
BrowserDetect.init();
DA.util={isNull:function(_b){
if(_b===null){
return true;
}else{
return false;
}
},isUndefined:function(_c){
if(_c===undefined||(typeof (_c)==="string"&&_c==="")){
return true;
}else{
return false;
}
},isEmpty:function(_d){
if(DA.util.isNull(_d)||DA.util.isUndefined(_d)){
return true;
}else{
return false;
}
},isNumber:function(_e){
if(typeof (_e)==="number"&&isFinite(_e)){
return true;
}else{
return false;
}
},isString:function(_f){
return typeof (_f)==="string";
},isArray:function(obj){
if(obj.constructor&&obj.constructor.toString().indexOf("Array")>-1){
return true;
}else{
return false;
}
},isObject:function(obj){
return typeof (obj)==="object";
},isFunction:function(obj){
return typeof (obj)==="function";
},cmp:function(_13,_14){
var s1=(DA.util.isNumber(_13))?_13.toString():_13;
var s2=(DA.util.isNumber(_14))?_14.toString():_14;
return s1===s2;
},cmpNumber:function(_17,_18){
return parseInt(_17,10)===parseInt(_18,10);
},match:function(str,_1a){
var reg=new RegExp(_1a);
return str&&str.match(reg);
},encode:function(str,cr,sq,sp){
var buf=str;
if(DA.util.isString(str)){
buf=buf.replace(/&/g,"&amp;");
buf=buf.replace(/"/g,"&quot;");
buf=buf.replace(/</g,"&lt;");
buf=buf.replace(/>/g,"&gt;");
if(sq===1){
buf=buf.replace(/'/g,"&squo;");
}
if(cr===1){
buf=buf.replace(/(\r\n|[\r\n])/g,"<br>");
}else{
if(cr===2){
buf=buf.replace(/([^\r\n]+)(\r\n|$)/mg,"<p>$1</p>$2");
buf=buf.replace(/(^|\r\n)(\r\n)/mg,"$1<p>&nbsp;</p>$2");
if(BrowserDetect.browser!=="Explorer"){
buf=buf.replace(/(^|\n)(\n)/mg,"$1<p>&nbsp;</p>$2");
}
}
}
if(sp===1){
buf=buf.replace(/ /g,"&nbsp;");
}
}
return buf;
},decode:function(str,cr,sq,sp){
var buf=str;
if(DA.util.isString(str)){
buf=buf.replace(/&lt;/g,"<");
buf=buf.replace(/&gt;/g,">");
buf=buf.replace(/&quot;/g,"\"");
if(sq===1){
buf=buf.replace(/&squo;/g,"'");
}
buf=buf.replace(/&amp;/g,"&");
if(cr===1){
buf=buf.replace(/<br>/g,"\r\n");
}else{
if(cr===2){
buf=buf.replace(/<p>\&nbsp\;<\/p>([\r\n]|$)?/gi,"$1");
buf=buf.replace(/<p>([^<>]*)<\/p>([\r\n]|$)?/gi,"$1$2");
}
}
if(sp===1){
buf=buf.replace(/&nbsp;/g," ");
}
}
return buf;
},escape:function(str){
var buf=str;
if(DA.util.isString(str)){
buf=buf.replace(/\\/,"\\\\");
buf=buf.replace(/"/,"\\\"");
}
return buf;
},unescape:function(str){
var buf=str;
if(DA.util.isString(str)){
buf=buf.replace(/\\\"/,"\"");
buf=buf.replace(/\\\\/,"\\");
}
return buf;
},warn:function(str){
alert(str);
},error:function(str){
alert(str);
},confirm:function(str){
if(confirm(str)){
return true;
}else{
return false;
}
},lockData:{},lock:function(_2d){
if(DA.mailer.util.getOperationFlag()!==""&&DA.mailer.util.getOperationFlag()!==OrgMailer.vars.org_mail_gid.toString()){
if(DA.mailer.util.getOperationWarnedFlag().indexOf(OrgMailer.vars.org_mail_gid.toString())<0){
if(OrgMailer.vars.operation_warned===0){
OrgMailer.vars.operation_warned=1;
DA.mailer.util.setOperationWarnedFlag(OrgMailer.vars.org_mail_gid);
DA.util.warn(DA.locale.GetText.t_("MESSAGE_CHANGE_TAB_ERROR"));
DA.mailer.util.autoCloseWaitingMask();
DA.waiting.show(DA.locale.GetText.t_("MESSAGE_CHANGE_TAB_WAITING_MESSAGE"));
}
}
return false;
}
if(this.existsLock(_2d)){
return false;
}else{
DA.mailer.util.setOperationFlag(OrgMailer.vars.org_mail_gid.toString());
this.lockData[_2d]=true;
return true;
}
},unlock:function(_2e){
if(DA.mailer.util.getOperationFlag()!==""&&DA.mailer.util.getOperationFlag()===OrgMailer.vars.org_mail_gid.toString()){
DA.mailer.util.setOperationFlag("");
DA.mailer.util.setOperationWarnedFlag("");
}
delete this.lockData[_2e];
return true;
},existsLock:function(_2f){
if(this.lockData[_2f]){
return true;
}else{
return false;
}
},pack:function(_30){
var i,p="",s="";
for(i=0;i<_30.length;i++){
p+=_30.charAt(i);
if(p.length===2){
s+=String.fromCharCode(parseInt(p,16));
p="";
}
}
return s;
},unpack:function(_34){
var i,s="";
for(i=0;i<_34.length;i++){
s+=parseInt(_34.charCodeAt(i),10).toString(16);
}
return s;
},setUrl:function(url){
var _38=DA.vars.check_key_url;
if(DA.util.isEmpty(_38)){
return url;
}else{
if(url.match(/\?/)){
return url+_38;
}else{
return url+_38.replace(/^&/,"?");
}
}
},parseJson:function(_39){
try{
return eval("("+_39+")");
}
catch(e){
return undefined;
}
},parseQuery:function(qs){
var url=(DA.util.isEmpty(qs))?location.href:qs;
var tmp=url.split("?");
var _3d=(tmp.length>1)?tmp[1].split("&"):[];
var _3e=[];
var _3f={};
for(var i=0;i<_3d.length;i++){
_3e=_3d[i].split("=");
_3f[_3e[0]]=_3e[1];
}
return _3f;
},makeXml:function(_41,_42){
var k;
var xml="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"+((DA.util.isEmpty(_42))?"":"<"+_42+">\n");
for(k in _41){
xml+=DA.util._object2xml(_41[k],k);
}
xml+=((DA.util.isEmpty(_42))?"":"</"+_42+">\n")+"</xml>\n";
return xml;
},_object2xml:function(_45,key){
var k,xml="";
if(DA.util.isFunction(_45)){
xml="";
}else{
if(DA.util.isString(_45)){
xml="<"+key+">"+((DA.util.isEmpty(_45))?"":DA.util.encode(_45))+"</"+key+">\n";
}else{
if(DA.util.isNumber(_45)){
xml="<"+key+">"+((DA.util.isEmpty(_45.toString()))?"":_45.toString())+"</"+key+">\n";
}else{
if(DA.util.isArray(_45)){
_45.map(function(o){
xml+=DA.util._object2xml(o,key);
});
}else{
xml="<"+key+">";
for(k in _45){
xml+=DA.util._object2xml(_45[k],k);
}
xml+="</"+key+">\n";
}
}
}
}
return xml;
},getTime:function(){
var _4a=new Date();
return _4a.getTime();
},time_diff:function(_4b,end){
return (end?end.getTime():new Date().getTime())-_4b.getTime();
},slowdown:function(f,_4e){
_4e=_4e?_4e:1000;
var _4f=new Date().getTime();
var _50=[];
var _51;
function dolater(){
f.call(_50);
}
return function(){
var now=new Date().getTime();
if((now-_4f)>_4e){
_4f=now;
f.call(arguments);
}else{
clearTimeout(_51);
_50=arguments;
_51=setTimeout(dolater,_4e);
}
};
},onlyonce:function(_53,f,_55){
var _56=[];
var _57=function(){
f.apply(_53,_56);
};
var to;
return function(){
clearTimeout(to);
_56=arguments;
to=setTimeout(_57,_55);
};
},areEquivObjs:function(o1,o2){
if(!(YAHOO.lang.isObject(o1)&&YAHOO.lang.isObject(o2))){
return false;
}
if(o1===o2){
return true;
}
return $H(o1).all(function(p){
return o2[p.key]===p.value;
})&&$H(o2).all(function(p){
return o1[p.key]===p.value;
});
},toPercentages:function(_5d){
if(!_5d){
return [];
}
var _5e=_5d.inject(0,DA.util._add);
return _5d.map(function(n){
return (n/_5e)*100;
});
},_add:function(a,b){
return a+b;
},disableKey:function(key){
if(key==="backspace"){
YAHOO.util.Event.addListener(window.document,"keydown",function(){
var _63=YAHOO.util.Event.getTarget(event);
if(YAHOO.util.Event.getCharCode(event)===Event.KEY_BACKSPACE&&(_63.type!=="text")&&(_63.type!=="textarea")&&(_63.type!=="file")){
return false;
}
return true;
},window.document,true);
}
},jsubstr4attach:function(str,_65){
var len,_67,_68,res,n,t;
len=_65||DA.vars.config.attachment_length;
if(len==="none"){
return str;
}
if(len===null){
len=15;
}
_67=parseInt((len-3)/2,10);
_68=str.length;
if(_68>len){
if(str.match(/(.*)\.([\w\d]+)/g)){
n=RegExp.$1;
t=RegExp.$2;
res=n.substring(0,_67)+"..."+n.substr(n.length-_67,_67)+"."+t;
}else{
res=str.substring(0,_67)+"..."+str.substr(_68-_67,_67);
}
return res;
}else{
return str;
}
},getSessionId:function(){
var _6c=document.cookie;
var _6d=_6c.split(/\;\s*/);
var i,kv,_70;
for(i=0;i<_6d.length;i++){
kv=_6d[i].split(/\=/);
if(kv[0]===DA.vars.sessionKey){
_70=kv[1];
}
}
return _70;
},getServer:function(){
var _71;
if(location.href.match(/^(http[s]*\:\/\/[^\/]+)/)){
_71=RegExp.$1;
}
return _71;
}};
DA.time={GetTime:function(){
var _72=new Date();
var _73=_72.getTime();
delete _72;
return _73;
},DiffTime:function(t1,t2){
var _76=t2-t1;
return _76;
}};
DA.customEvent={set:function(_77,_78){
if(_78){
this.events[_77]=_78;
}
},fire:function(_79,me,_7b){
if(this.events[_79]){
this.events[_79](me,_7b);
}
},events:{}};
var FCKEditorIframeController={createIframe:function(_7c,_7d){
var _7e=document.createElement("iframe");
_7e.setAttribute("id",_7c);
_7e.setAttribute("width","100%");
_7e.setAttribute("height","100%");
_7e.setAttribute("frameborder",0);
_7d.innerHTML="";
_7d.appendChild(_7e);
},removeIframe:function(_7f,_80){
var _81=YAHOO.util.Dom.get(_7f);
if(_81){
this.setIframeBody(_7f,"");
_80.removeChild(_81);
}
},setIframeBody:function(_82,_83){
var _84=YAHOO.util.Dom.get(_82);
var doc;
if(_84){
if(BrowserDetect.browser==="Explorer"){
doc=_84.contentWindow.document;
}else{
doc=_84.contentDocument;
}
doc.open();
doc.writeln(_83);
doc.close();
}
},isFCKeditorData:function(_86){
var _87=/^<\!-- Created by DA_Richtext .*? end default style -->/;
return _87.test(_86);
}};
DA.windowController={data:[],_url:function(url){
if(DA.util.isEmpty(url)){
return "";
}else{
if(url.match(/\?/)){
return url+"&time="+DA.util.getTime()+DA.vars.check_key_url;
}else{
return url+"?time="+DA.util.getTime()+DA.vars.check_key_url;
}
}
},_name:function(_89){
if(DA.util.isEmpty(_89)){
return "";
}else{
return DA.vars.mid+"_"+_89;
}
},_width:function(_8a){
if(DA.util.isEmpty(_8a)){
return 800;
}else{
return _8a;
}
},_height:function(_8b){
if(DA.util.isEmpty(_8b)){
return 600;
}else{
return _8b;
}
},width:function(win){
if(win){
return win.document.body.clientWidth;
}else{
return window.document.body.clientWidth;
}
},height:function(win){
if(win){
return win.document.body.clientWidth;
}else{
return window.document.body.clientHeight;
}
},getX:(BrowserDetect.browser==="Explorer")?function(win){
return win?win.screenLeft:window.screenLeft;
}:function(win){
return win?win.screenX:window.screenX;
},getY:(BrowserDetect.browser==="Explorer")?function(win){
return win?win.screenTop:window.screenTop;
}:function(win){
return win?win.screenY:window.screenY;
},winOpen:function(url,_93,_94,_95){
var _96="width="+this._width(_94)+",height="+this._height(_95)+",resizable=yes,scrollbars=yes,location=yes"+",menubar=yes,toolbar=yes,statusbar=yes";
var win=window.open(this._url(url),this._name(_93),_96);
win.moveTo(this.getX(win.opener)+10,this.getY(win.opener)+10);
win.focus();
this.data[this.data.length]=win;
return win;
},winOpenNoBar:function(url,_99,_9a,_9b,flg){
var win;
var _9e="width="+this._width(_9a)+",height="+this._height(_9b)+",resizable=yes,scrollbars=no,location=no"+",menubar=no,toolbar=no,statusbar=no";
if(DA.vars.config.download_type==="simple"&&flg===1){
win=window.open(this._url(url),"_self",_9e);
}else{
win=window.open(this._url(url),this._name(_99),_9e);
win.moveTo(this.getX(win.opener)+10,this.getY(win.opener)+10);
win.focus();
this.data[this.data.length]=win;
}
return win;
},winOpenCustom:function(url,_a0,_a1){
var win=window.open(this._url(url),this._name(_a0),_a1);
win.moveTo(this.getX(win.opener)+10,this.getY(win.opener)+10);
win.focus();
this.data[this.data.length]=win;
return win;
},isePopup:function(_a3,_a4,_a5,_a6,no,_a8,_a9,_aa){
var _ab="width="+_a5+",height="+_a6+",resizable=yes";
var Url=DA.vars.cgiRdir+"/pop_up.cgi?proc="+_a3+"&title="+_a4;
var _ad,_ae,_af,_b0;
if(!_a8){
_ae=_a4.indexOf(".gif");
_af=_a4.substring(0,_ae);
_b0=_af+no;
_ad=this.winOpenCustom(Url,_b0,_ab);
}else{
_ad=this.winOpenCustom(Url,"",_ab);
}
if(!DA.util.isEmpty(_a9)&&!DA.util.isEmpty(_aa)){
_ad.moveTo(_a9,_aa);
}
_ad.focus();
},allClose:function(_b1){
if(!DA.util.isObject(_b1)){
_b1=window;
}
for(var i=0;i<this.data.length;i++){
if(this.data[i]){
try{
if(_b1===this.data[i]){
continue;
}
this.data[i].DA.windowController.allClose(this.data[i]);
}
catch(e){
}
try{
this.data[i].close();
}
catch(e){
}
}
}
},onGentleResize:new YAHOO.util.CustomEvent("onGentleResize")};
DA.imageLoader={tag:function(_b3,_b4,obj){
var _b6=new Image();
_b6.src=_b3;
var src=(DA.util.isEmpty(_b3))?"":" src=\""+DA.util.escape(_b3)+"\"";
var alt=(DA.util.isEmpty(_b4))?"":" alt=\""+DA.util.escape(_b4)+"\"";
var opt;
if(obj){
opt="";
for(var key in obj){
if(!DA.util.isEmpty(obj[key])&&(DA.util.isString(obj[key])||DA.util.isNumber(obj[key]))){
opt+=" "+key+"="+obj[key];
}
}
}else{
opt=" border=0";
}
var tag="<img"+src+alt+opt+">";
delete _b6;
return tag;
},nullTag:function(x,y){
return this.tag(DA.vars.imgRdir+"/null.gif","",{width:(DA.util.isEmpty(x))?1:x,height:(DA.util.isEmpty(y))?1:y});
}};
DA.dom={createDiv:function(id){
var _bf=document.body;
var div=document.createElement("div");
div.id=id;
_bf.insertBefore(div,_bf.firstChild);
var _c1=YAHOO.util.Dom.get(id);
return _c1;
},id2node:function(obj){
if(DA.util.isString(obj)){
return YAHOO.util.Dom.get(obj);
}else{
return obj;
}
},left:function(obj){
var _c4=this.id2node(obj);
return _c4.offsetLeft;
},top:function(obj){
var _c6=this.id2node(obj);
return _c6.offsetTop;
},width:function(obj){
var _c8=this.id2node(obj);
return _c8.offsetWidth;
},height:function(obj){
var _ca=this.id2node(obj);
return _ca.offsetHeight;
},size:function(obj,_cc,_cd){
var _ce=this.id2node(obj);
this.sizeWidth(_cc);
this.sizeHeight(_cd);
},sizeWidth:function(obj,_d0){
var _d1=this.id2node(obj);
_d1.style.width=_d0+"px";
},sizeHeight:function(obj,_d3){
var _d4=this.id2node(obj);
_d4.style.height=_d3+"px";
},position:function(obj,x,y){
var _d8=this.id2node(obj);
this.positionX(obj,x);
this.positionY(obj,y);
},positionX:function(obj,x){
var _db=this.id2node(obj);
_db.style.left=x+"px";
},positionY:function(obj,y){
var _de=this.id2node(obj);
_de.style.top=y+"px";
},adjustPosition:function(obj){
var _e0=this.id2node(obj);
var _e1=YAHOO.util.Dom.getViewportWidth();
var _e2=YAHOO.util.Dom.getViewportHeight();
var _e3=this.width(_e0);
var _e4=this.height(_e0);
var _e5=this.left(_e0);
var _e6=this.top(_e0);
var x,y;
if(_e5+_e3>_e1){
x=_e5+_e1-(_e5+_e3)-10;
if(x<0){
x=0;
}
}else{
x=_e5;
}
if(_e6+_e4>_e2){
y=_e6+_e2-(_e6+_e4)-30;
if(y<0){
y=0;
}
}else{
y=_e6;
}
this.position(_e0,x,y);
},textAreaValue:function(obj){
var _ea=this.id2node(obj);
return _ea.value;
},textValue:function(obj){
var _ec=this.id2node(obj);
return _ec.value;
},fileValue:function(obj){
var _ee=this.id2node(obj);
return _ee.value;
},hiddenValue:function(obj){
var _f0=this.id2node(obj);
return _f0.value;
},selectValue:function(obj){
var _f2=this.id2node(obj);
return _f2.value;
},radioValue:function(_f3){
var _f4=null;
var _f5=document.getElementsByName(_f3);
for(var i=0;i<_f5.length;++i){
if(_f5[i].checked){
_f4=_f5[i].value;
break;
}
}
return _f4;
},checkedOk:function(obj){
var _f8=this.id2node(obj);
return _f8.checked;
},changeValue:function(obj,_fa){
var _fb=this.id2node(obj);
_fb.value=(DA.util.isEmpty(_fa))?"":_fa;
},changeSelectedIndex:function(obj,_fd){
var _fe=this.id2node(obj);
var _ff=(DA.util.isNumber(_fd))?String(_fd):_fd;
var i;
for(i=0;i<_fe.childNodes.length;i++){
if(_fe.childNodes[i].value&&_fe.childNodes[i].value===_ff){
_fe.selectedIndex=_fe.childNodes[i].index;
break;
}
}
},changeChecked:function(obj,_102){
var node=this.id2node(obj);
node.checked=(DA.util.isEmpty(_102))?false:_102;
},findParent:function(node,_105,_106){
if(!node||!node.tagName||!_105){
return null;
}
if(!_106){
_106=3;
}
var test=typeof _105==="function"?_105:function(n){
return _105===n.tagName.toUpperCase();
};
var _109=0;
if(test(node)){
return node;
}
do{
_109++;
if(test(node)){
return node;
}
}while((node=node.parentNode)&&node.tagName&&(_109<_106));
return null;
},moveAllChildren:function(src,dest){
if(!src||!dest){
return;
}
while(src.firstChild){
dest.appendChild(src.firstChild);
}
},createCSSRule:(function(){
if(document.styleSheets.length===0){
document.write("<style>\n</style>");
}
var _10c=document.styleSheets[0];
var IE=function(_10e,_10f){
_10c.addRule(_10e,_10f);
};
var W3C=function(_111,_112){
_10c.insertRule(_111+" {"+_112+";}",0);
};
var _113=function(){
};
return _10c.addRule?IE:_10c.insertRule?W3C:_113;
})()};
DA.tip={tipNode:[],open:function(id,_115,_116,_117,_118){
var i,list="";
var len=_116.length;
var node;
if(this.tipNode[id]){
node=this.tipNode[id];
}else{
node=DA.dom.createDiv(id);
node.style.position="absolute";
node.style.display="block";
this.tipNode[id]=node;
}
node.style.visibility="hidden";
for(i=0;i<len;i++){
list+=["<tr><td style=\"\" onmouseout=\"this.parentNode.style.backgroudColor='red';\" onmouseover=\"this.parentNode.style.backgroudColor='black';\" onclick=\"var clickedDom = document.getElementById('"+_118+"'); clickedDom.innerHTML='"+_116[i]+"';DA.tip.close('DASpellCheckList')\" nowrap><font color=\"#000000\">",_116[i],"</font></td></tr>"].join("");
}
var html=["<table border=\"0\" width=\"150\" cellspacing=\"0\" cellpadding=\"0\">","<tr>","  <td width=\"100%\" bgcolor=\"#000000\">","  <table border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">","  <tr>","    <td width=\"100%\" bgcolor=\"#FFFFE0\" nowrap>","      <font color=\"#000000\">",_115,"</font>","    </td>","  </tr>","  <tr>","    <td width=\"100%\" bgcolor=\"#FFFFE0\">","    <table border=\"0\" cellspacing=\"1\">",list,"</table>","    </td>","  </tr>","  </table>","  </td>","</tr>","</table>"].join("\n");
node.innerHTML=html;
DA.shim.open(node);
node.style.visibility="";
var x=YAHOO.util.Event.getPageX(_117);
x+=5;
var y=YAHOO.util.Event.getPageY(_117);
y+=5;
var w=DA.dom.width(node);
var h=DA.dom.height(node);
var vw=YAHOO.util.Dom.getViewportWidth();
var vh=YAHOO.util.Dom.getViewportHeight();
if(x+w>vw-5){
x=vw-w-5;
if(x<5){
x=5;
}
}
if(y+h>vh-5){
y=vh-h-5;
if(y<5){
y=5;
}
}
this.move(id,x,y);
},close:function(id){
var node=this.tipNode[id];
node.style.visibility="hidden";
DA.shim.close(node);
},move:function(id,x,y){
var node=this.tipNode[id];
YAHOO.util.Dom.setXY(node,[x,y],true);
}};
DA.shim={open:function(menu){
if(BrowserDetect.browser!=="Explorer"){
return;
}
if(menu===null){
return;
}
var shim=this._getShim(menu);
if(shim===null){
shim=this._createMenuShim(menu);
}
menu.style.zIndex=100;
var _12c=menu.offsetWidth;
var _12d=menu.offsetHeight;
shim.style.width=_12c;
shim.style.height=_12d;
shim.style.top=menu.style.top;
shim.style.left=menu.style.left;
shim.style.zIndex=menu.style.zIndex-1;
shim.style.position="absolute";
shim.style.display="block";
var _12e;
if(shim.style.top===""||shim.style.left===""){
_12e=this._cumulativeOffset(menu);
shim.style.top=_12e[1];
shim.style.left=_12e[0];
}
},close:function(menu){
if(document.all===null){
return;
}
if(menu===null){
return;
}
var shim=this._getShim(menu);
if(shim!==null){
shim.style.display="none";
}
},_createMenuShim:function(menu){
if(menu===null){
return null;
}
var shim=document.createElement("iframe");
shim.scrolling="no";
shim.frameborder="0";
shim.style.position="absolute";
shim.style.top="0px";
shim.style.left="0px";
shim.style.display="none";
shim.name=this._getShimId(menu);
shim.id=this._getShimId(menu);
shim.src="javascript:false;";
shim.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
if(menu.offsetParent===null||menu.offsetParent.id===""){
window.document.body.appendChild(shim);
}else{
menu.offsetParent.appendChild(shim);
}
return shim;
},_getShimId:function(menu){
if(menu.id===null){
return "__shim";
}else{
return "__shim"+menu.id;
}
},_getShim:function(menu){
return document.getElementById(this._getShimId(menu));
},_cumulativeOffset:function(_135){
var _136=0,_137=0;
do{
_136+=_135.offsetTop||0;
_137+=_135.offsetLeft||0;
_135=_135.offsetParent;
}while(_135);
return [_137,_136];
}};
if(YAHOO&&YAHOO.widget&&YAHOO.widget.Node){
YAHOO.widget.Node.prototype.getToggleLink=function(){
return "DA.util.getTreeViewToggle('"+this.tree.id+"',"+this.index+")";
};
DA.util.getTreeViewToggle=function(id,_139){
YAHOO.widget.TreeView.getNode(id,_139).toggle();
};
}
if(BrowserDetect.browser==="Explorer"&&typeof (window.opener)==="object"&&typeof (window.opener.DA)==="object"&&typeof (window.opener.DA.session)==="object"){
DA.session=window.opener.DA.session;
}else{
if(BrowserDetect.browser!=="Explorer"&&window.opener&&window.opener.DA&&window.opener.DA.session){
DA.session=window.opener.DA.session;
}else{
(function(){
var _13a=$H({});
var _13b=$H({});
function _getStateInfo(w){
if("function"!==typeof w.getUIStateInfo){
return;
}
return w.getUIStateInfo();
}
DA.session={Values:{registerValue:function(name,_13e){
_13b[name]=_13e;
},getValue:function(name){
return _13b[name];
}},UIState:{registerWidget:function(name,_141){
_13a[name]=_141;
},getStateInfo:function(name){
var w=_13a[name];
if(!w){
return;
}
return _getStateInfo(w);
},getAllStateInfo:function(){
return _13a.map(function(ent){
return {name:ent.key,info:_getStateInfo(ent.value)};
});
}}};
})();
}
}
YAHOO.util.Event.on(window,"load",function(){
function getResizingElem(){
var _145=document.getElementById("da_outermost");
if(!_145){
_145=document.createElement("div");
_145.id="da_outermost";
DA.dom.moveAllChildren(document.body,_145);
document.body.insertBefore(_145,document.body.firstChild);
Object.extend(_145.style,{height:"100%",width:"100%",margin:"0px",padding:"0px"});
}
return _145;
}
var _146=DA.windowController.onGentleResize;
if(BrowserDetect.browser==="Explorer"){
YAHOO.util.Event.on(getResizingElem(),"resize",DA.util.onlyonce(_146,_146.fire,50));
}else{
YAHOO.util.Event.on(window,"resize",_146.fire,_146,true);
}
});
DA.init=function(_147){
if(DA.waiting&&"function"===typeof DA.waiting.init){
DA.waiting.init();
}
if(_147&&BrowserDetect.browser==="Explorer"){
YAHOO.util.Event.addListener(window.document,"keydown",function(e){
var _149;
if(BrowserDetect.browser==="Explorer"){
e=window.event;
_149=e.srcElement.type;
}else{
_149=e.target.type;
}
if(_149==="text"||_149==="textarea"){
if(YAHOO.util.Event.getCharCode(event)===Event.KEY_ESC){
return false;
}
}
return true;
},window.document,true);
}
if(BrowserDetect.browser==="Explorer"){
YAHOO.util.Event.addListener(window.document.body,"dragover",function(){
return false;
},window.document.body,true);
}
};
(function(){
var _14a=function(a,b){
return b-a;
};
var CE=YAHOO.util.CustomEvent;
CE.prototype.isFiring=false;
CE.prototype._fire_orig=CE.prototype.fire;
CE.prototype._delete_orig=CE.prototype._delete;
CE.prototype.fire=function(){
this.isFiring=true;
var ret=this._fire_orig.apply(this,arguments);
if(this._pendingRemoval){
this._pendingRemoval.keys().sort(_14a).each(function(n){
this._delete_orig(n);
delete this._pendingRemoval[n];
}.bind(this));
}
this.isFiring=false;
return ret;
};
CE.prototype._delete=function(n){
if(this.isFiring){
if(!this._pendingRemoval){
this._pendingRemoval=$H({});
}
this._pendingRemoval[n]=true;
return;
}
this._delete_orig(n);
};
})();
if(!DA||!DA.util){
throw "ERROR: missing DA.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.widget.PanelMenuController=function(_151,_152){
this.menuId=_151.id;
this.menuNode=_151;
this.menuData=_152;
if(DA.util.isEmpty(_152.className)){
this.className="da_panelMenu";
}else{
this.className=_152.className;
}
this.init();
};
DA.widget.PanelMenuController.prototype={menuId:null,menuNode:null,menuLeftNode:null,menuRightNode:null,menuData:null,className:null,init:function(){
var html="<div id=\""+this.menuId+"PMC\" class=\""+this.className+"\">"+"<div id=\""+this.menuId+"PMCL\" class=\""+this.className+"Left\"></div>"+"<div id=\""+this.menuId+"PMCR\" class=\""+this.className+"Right\"></div>"+"<div id=\""+this.menuId+"PMCC\" class=\""+this.className+"Center\">"+"<div id=\""+this.menuId+"PMCCL\" class=\""+this.className+"CenterLeft\"></div>"+"<div id=\""+this.menuId+"PMCCR\" class=\""+this.className+"CenterRight\"></div>"+"</div>"+"</div>";
this.menuNode.innerHTML=html;
this.menuLeftNode=YAHOO.util.Dom.get(this.menuId+"PMCCL");
this.menuRightNode=YAHOO.util.Dom.get(this.menuId+"PMCCR");
var i;
var left="";
var _156="";
var _157=[];
var _158=[];
for(i=0;i<this.menuData.leftOrder.length;i++){
left+=this._menuItem(this.menuData.leftOrder[i]);
if(!this._visibleOk(this.menuData.leftOrder[i])){
_157.push(this.menuData.leftOrder[i]);
}
if(!this._enableOk(this.menuData.leftOrder[i])){
_158.push(this.menuData.leftOrder[i]);
}
}
for(i=0;i<this.menuData.rightOrder.length;i++){
_156+=this._menuItem(this.menuData.rightOrder[i]);
if(!this._visibleOk(this.menuData.rightOrder[i])){
_157.push(this.menuData.rightOrder[i]);
}
if(!this._enableOk(this.menuData.rightOrder[i])){
_158.push(this.menuData.rightOrder[i]);
}
}
this.menuLeftNode.innerHTML=left;
this.menuRightNode.innerHTML=_156;
DA.customEvent.fire("PanelMenuControllerInitAfter",this,{hides:_157,disables:_158});
for(i=0;i<_157.length;i++){
this.hide(_157[i]);
}
for(i=0;i<_158.length;i++){
this.disable(_158[i]);
}
},select:function(e,func){
this.menuData.items[func].onSelect(e,this.menuData.items[func].args);
},enable:function(func){
var elt=YAHOO.util.Dom.get(this._func2id(func,"t"));
var elm=YAHOO.util.Dom.get(this._func2id(func,"m"));
var eli=YAHOO.util.Dom.get(this._func2id(func,"i"));
var elb=YAHOO.util.Dom.get(this._func2id(func,"b"));
var ela=YAHOO.util.Dom.get(this._func2id(func,"a"));
this.menuData.items[func].disable=0;
eli.src=this._smallIcon(func);
YAHOO.util.Dom.removeClass(elt,this.className+"ItemHidden");
YAHOO.util.Dom.removeClass(elt,this.className+"ItemGray");
YAHOO.util.Dom.removeClass(elm,this.className+"ItemNoPointer");
YAHOO.util.Dom.removeClass(eli,this.className+"ItemNoPointer");
YAHOO.util.Dom.removeClass(elb,this.className+"ItemHidden");
YAHOO.util.Dom.removeClass(ela,this.className+"ItemNoPointer");
},disable:function(func){
var elt=YAHOO.util.Dom.get(this._func2id(func,"t"));
var elm=YAHOO.util.Dom.get(this._func2id(func,"m"));
var eli=YAHOO.util.Dom.get(this._func2id(func,"i"));
var elb=YAHOO.util.Dom.get(this._func2id(func,"b"));
var ela=YAHOO.util.Dom.get(this._func2id(func,"a"));
this.menuData.items[func].disable=1;
eli.src=this._disableIcon(func);
YAHOO.util.Dom.removeClass(elt,this.className+"ItemHidden");
YAHOO.util.Dom.addClass(elt,this.className+"ItemGray");
YAHOO.util.Dom.addClass(elm,this.className+"ItemNoPointer");
YAHOO.util.Dom.addClass(eli,this.className+"ItemNoPointer");
YAHOO.util.Dom.addClass(elb,this.className+"ItemHidden");
YAHOO.util.Dom.addClass(ela,this.className+"ItemNoPointer");
},show:function(func){
YAHOO.util.Dom.get(this._func2id(func)).style.display="";
},hide:function(func){
YAHOO.util.Dom.get(this._func2id(func)).style.display="none";
},_id:function(func){
return this.menuId+"MenuItem_"+func;
},_title:function(func){
return this.menuData.items[func].title;
},_alt:function(func){
return this.menuData.items[func].alt;
},_smallIcon:function(func){
return this.menuData.items[func].smallIcon;
},_bigIcon:function(func){
return this.menuData.items[func].bigIcon;
},_disableIcon:function(func){
return this.menuData.items[func].disableIcon;
},_className:function(func){
return this.menuData.items[func].className;
},_hidden:function(func){
return this.menuData.items[func].hidden;
},_disable:function(func){
return this.menuData.items[func].disable;
},_pulldown:function(func){
return this.menuData.items[func].pulldown;
},_visibleOk:function(func){
if(this._hidden(func)===1){
return false;
}else{
return true;
}
},_enableOk:function(func){
if(this._disable(func)===1){
return false;
}else{
return true;
}
},_selectOk:function(func){
if(DA.util.isFunction(this.menuData.items[func].onSelect)){
return true;
}else{
return false;
}
},_pulldownOk:function(func){
if(this._pulldown(func)){
return true;
}else{
return false;
}
},_mouseover:function(e){
var el=YAHOO.util.Event.getTarget(e);
var id=el.id;
var func=this._id2func(id);
if(this._enableOk(func)){
YAHOO.util.Dom.addClass(YAHOO.util.Dom.get(this._func2id(func,"t")),this.className+"ItemHidden");
el.src=this._bigIcon(func);
}
},_mouseout:function(e){
var el=YAHOO.util.Event.getTarget(e);
var id=el.id;
var func=this._id2func(id);
if(this._enableOk(func)){
YAHOO.util.Dom.removeClass(YAHOO.util.Dom.get(this._func2id(func,"t")),this.className+"ItemHidden");
el.src=this._smallIcon(func);
}
},_click:function(e){
var el=YAHOO.util.Event.getTarget(e);
var id=el.id;
var func=this._id2func(id);
if(this._enableOk(func)){
this.select(e,func);
}
},_id2func:function(id){
id.match(/\_([^\_]+)\_[^\_]+$/);
return RegExp.$1;
},_func2id:function(func,ex){
if(DA.util.isEmpty(ex)){
return this._id(func);
}else{
return this._id(func)+"_"+ex;
}
},_menuItem:function(func){
var _187=this._title(func);
var _188=DA.imageLoader.tag(this._smallIcon(func),this._alt(func),{id:this._func2id(func,"i")});
var _189=(this._pulldownOk(func))?DA.imageLoader.tag(DA.vars.imgRdir+"/ico_mail_arrow.gif","",{id:this._func2id(func,"a")}):"";
var _18a=(this._pulldownOk(func))?"":this.className+"ItemNoPointer";
var item="<div id=\""+this._func2id(func)+"\" class=\""+this._className(func)+"\">"+"<div id=\""+this._func2id(func,"t")+"\" class=\""+this._className(func)+"Top\">"+DA.util.encode(_187)+"</div>"+"<div id=\""+this._func2id(func,"m")+"\" class=\""+this._className(func)+"Middle\">"+_188+"</div>"+"<div id=\""+this._func2id(func,"b")+"\" class=\""+this._className(func)+"Bottom\">"+_189+"</div>"+"</div>";
var me=this;
if(this._pulldownOk(func)){
if(this._selectOk(func)){
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseover",this._mouseover,this,true);
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseout",this._mouseout,this,true);
YAHOO.util.Event.addListener(this._func2id(func,"i"),"click",this._click,this,true);
this.menuData.items[func].pulldownMenu=new DA.widget.PulldownMenuController(this._func2id(func,"p"),this._func2id(func,"b"),this._pulldown(func),{onTrigger:function(e){
var _18e=YAHOO.util.Event.getTarget(e);
return _18e&&(DA.util.match(_18e.id,me._func2id(func,"b"))||DA.util.match(_18e.id,me._func2id(func,"a")));
}});
}else{
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseover",this._mouseover,this,true);
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseout",this._mouseout,this,true);
this.menuData.items[func].pulldownMenu=new DA.widget.PulldownMenuController(this._func2id(func,"p"),this._func2id(func),this._pulldown(func),{onTrigger:function(e){
var _190=YAHOO.util.Event.getTarget(e);
return _190&&DA.util.match(_190.id,me._func2id(func));
}});
}
}else{
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseover",this._mouseover,this,true);
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseout",this._mouseout,this,true);
YAHOO.util.Event.addListener(this._func2id(func,"i"),"click",this._click,this,true);
}
return item;
}};
DA.widget.ThreePane=function(_191){
function setFirstClass(div,_193){
if(!div){
return;
}
var _194;
if(div.className){
_194=div.className.split(" ");
_194=_194.without(_193);
div.className=_193+" "+_194.join(" ");
}else{
div.className=_193;
}
}
if(_191){
Object.extend(this,_191);
setFirstClass(this.leftPane,"da_leftPane");
setFirstClass(this.rightPane,"da_rightPane");
setFirstClass(this.rightTopPane,"da_rightTopPane");
setFirstClass(this.rightBottomPane,"da_rightBottomPane");
setFirstClass(this.vDivider,"da_vDivider");
setFirstClass(this.hDivider,"da_hDivider");
this.init();
}
};
DA.widget.ThreePane.prototype={dragElId:"da_threePaneResizerDragProxy",leftPane:null,rightPane:null,rightTopPane:null,rightBottomPane:null,vDivider:null,hDivider:null,vdd:null,hdd:null,init:function(){
var _195=YAHOO.util.Dom.get(this.dragElId);
if(!_195){
_195=document.createElement("div");
_195.id=this.dragElId;
document.body.insertBefore(_195,document.body.firstChild);
}
var _196={maintainOffset:true,dragElId:this.dragElId};
var me=this;
this.vdd=new YAHOO.util.DDProxy(this.vDivider,"vdd",_196);
this.hdd=new YAHOO.util.DDProxy(this.hDivider,"hdd",_196);
var _198=this.leftPane;
var _199=this.rightPane;
var _19a=this.rightTopPane;
var _19b=this.rightBottomPane;
var _19c=100-(((_19a.offsetHeight+this.hDivider.offsetHeight)/this.rightPane.offsetHeight)*100);
_19b.style.height=_19c+"%";
var DOM=YAHOO.util.Dom;
var _19e=_198.offsetWidth;
var _19f=_199.offsetWidth;
var _1a0=0;
this.vdd.onMouseDown=function(e){
_19e=_198.offsetWidth;
_19f=_199.offsetWidth;
_1a0=YAHOO.util.Event.getPageX(e);
this.setInitPosition();
this.setXConstraint(_198.offsetWidth-100,me.rightPane.offsetWidth-100);
this.setYConstraint(0,0);
var del=this.getDragEl();
del.style.cursor="w-resize";
};
this.vdd.endDrag=function(e){
var lel=this.getEl();
var del=this.getDragEl();
DOM.setStyle(del,"visibility","");
var curX=DOM.getX(del);
DOM.setStyle(del,"visibility","hidden");
DOM.setStyle(lel,"visibility","");
var _1a7=curX-_1a0;
var _1a8=Math.max((_19e+_1a7),10);
var _1a9=Math.max((_19f-_1a7),10);
var _1aa=me.vDivider.offsetWidth;
var _1ab=_19e+_19f+_1aa;
var _1ac=Math.max(((_1a8/_1ab)*100),1);
var _1ad=Math.max(((_1a9/_1ab)*100),1);
var _1ae=(_1aa/_1ab)*100;
var _1af=(_1ac+_1ad+_1ae)-100;
_1ad-=_1af;
_198.style.width=_1ac+"%";
me.vDivider.style.width=(100-(_1ac+_1ad))+"%";
_199.style.width=_1ad+"%";
me.vDivider.style.left=_1ac+"%";
me.onXResized(_198,_19a,_19b);
me.hdd.resetConstraints();
};
var _1b0=_19a.offsetHeight;
var _1b1=_19b.offsetHeight;
var _1b2=0;
this.hdd.onMouseDown=function(e){
_1b0=_19a.offsetHeight;
_1b1=_19b.offsetHeight;
_1b2=YAHOO.util.Event.getPageY(e);
this.setInitPosition();
this.setYConstraint(_1b0-50,_1b1-50);
this.setXConstraint(0,0);
var del=this.getDragEl();
del.style.cursor="n-resize";
};
this.hdd.endDrag=function(e){
var lel=this.getEl();
var del=this.getDragEl();
DOM.setStyle(del,"visibility","");
var curY=DOM.getY(del);
DOM.setStyle(del,"visibility","hidden");
DOM.setStyle(lel,"visibility","");
var _1b9=curY-_1b2;
var _1ba=Math.max((_1b0+_1b9),10);
var _1bb=Math.max((_1b1-_1b9),10);
var _1bc=_1b0+_1b1+me.hDivider.offsetHeight;
var _1bd=(_1ba/_1bc)*100;
var _1be=(_1bb/_1bc)*100;
_19a.style.height=_1bd+"%";
_19b.style.height=_1be+"%";
me.onYResized(_198,_19a,_19b);
};
},_toGracefulPercs:function(dim,full){
var _1c1;
if(typeof dim==="string"&&dim.charAt(dim.length-1)==="%"){
_1c1=parseFloat(dim.substr(0,dim.length-1),10);
}else{
_1c1=(parseFloat(dim,10)/full)*100;
}
_1c1=Math.max(_1c1,5);
_1c1=Math.min(_1c1,95);
return _1c1;
},_setLRWidth:function(key,w){
if(!key){
return;
}
var _1c4=key==="left"?"right":(key==="right"?"left":null);
if(!_1c4){
return;
}
var _1c5=this.leftPane.offsetWidth+this.rightPane.offsetWidth+this.vDivider.offsetWidth;
var _1c6=this._toGracefulPercs(w,_1c5);
if(!YAHOO.lang.isNumber(_1c6)){
return;
}
var _1c7=(this.vDivider.offsetWidth/_1c5)*100;
var _1c8=100-(_1c6+_1c7);
this[key+"Pane"].style.width=_1c6+"%";
this[_1c4+"Pane"].style.width=_1c8+"%";
this.vDivider.style.left=_1c6+"%";
this.onXResized(this.leftPane,this.rightTopPane,this.rightBottomPane);
this.hdd.resetConstraints();
},setLeftWidth:function(w){
this._setLRWidth("left",w);
},setRightWidth:function(w){
this._setLRWidth("right",w);
},_setTBHeight:function(key,h){
if(!key){
return;
}
var _1cd=key==="rightTop"?"rightBottom":(key==="rightBottom"?"rightTop":null);
if(!_1cd){
return;
}
var _1ce=this.rightTopPane.offsetHeight+this.rightBottomPane.offsetHeight+this.hDivider.offsetHeight;
var _1cf=this._toGracefulPercs(h,_1ce);
if(!YAHOO.lang.isNumber(_1cf)){
return;
}
var _1d0=(this.hDivider.offsetHeight/_1ce)*100;
var _1d1=100-(_1cf+_1d0);
this[key+"Pane"].style.height=_1cf+"%";
this[_1cd+"Pane"].style.height=_1d1+"%";
this.onYResized(this.leftPane,this.rightTopPane,this.rightBottomPane);
this.vdd.resetConstraints();
},setRightTopHeight:function(h){
this._setTBHeight("rightTop",h);
},setRightBottomHeight:function(h){
this._setTBHeight("rightBottom",h);
},onXResized:Prototype.emptyFunction,onYResized:Prototype.emptyFunction,getUIStateInfo:function(){
return {leftPane:{width:this.leftPane.offsetWidth,height:this.leftPane.offsetHeight},rightTopPane:{width:this.rightTopPane.offsetWidth,height:this.rightTopPane.offsetHeight},rightBottomPane:{width:this.rightBottomPane.offsetWidth,height:this.rightBottomPane.offsetHeight}};
}};
(function(){
var _1d4=DA.vars?(DA.vars.clrRdir):null;
DA.widget.Panel=function(id,_1d6){
$H({".da_panel div.left-edge":"mf_l_c.gif",".da_panel div.right-edge":"mf_r.gif",".da_panel div.top-left":"mf_head_l.gif",".da_panel div.top-right-edge":"mf_head_r.gif",".da_panel div.bottom-edge-left":"mf_l_b.gif",".da_panel div.bottom-edge-right-tip":"mf_r_b.gif",".da_panel div.top-edge-left":"mf_l_t.gif",".da_panel div.top-edge-right-tip":"mf_r_t.gif"}).each(function(_1d7){
var _1d8=_1d7.key;
var _1d9=_1d7.value;
var rule=_1d4?"background-image: url("+_1d4+"/"+_1d9+")":"border : 1px solid #aaa";
DA.dom.createCSSRule(_1d8,rule);
});
this.config=Object.extend({titleBar:true},_1d6||{});
this.init(id);
};
function div(_1db){
var el=document.createElement("div");
if(_1db){
$H(_1db).each(function(attr){
var key=attr.key;
var val=attr.value;
if(key==="class"||key==="className"){
el.className=val;
}else{
el.setAttribute(key,val);
}
});
}
var _1e0=[];
if(arguments.length===2){
if(arguments[1].constructor===Array){
_1e0=arguments[1];
}else{
_1e0.push(arguments[1]);
}
}else{
if(arguments.length>2){
_1e0=$A(arguments);
_1e0.shift();
}
}
if(_1e0&&_1e0.each){
_1e0.each(function(_1e1){
if("string"===typeof _1e1){
el.appendChild(document.createTextNode(_1e1));
}else{
if(_1e1.tagName){
el.appendChild(_1e1);
}
}
});
}
return el;
}
var _1e2={panelBottom:div({className:"bottom-edge-left"},div({className:"bottom-edge-right-tip"}))};
DA.widget.Panel.prototype={titleNode:null,topRightNode:null,init:function(_1e3){
var id=_1e3?_1e3:"da_panel_"+(new Date()).getTime();
this.contentsNode=div({className:"contents"});
var _1e5;
if(this.config.titleBar){
this.titleNode=div({className:"useful"});
this.topRightNode=this.titleNode.cloneNode(true);
_1e5=div({className:"top-left"},div({className:"top-right-edge"}),div({className:"top-right"},this.topRightNode),this.titleNode);
}else{
_1e5=div({className:"top-edge-left"},div({className:"top-edge-right-tip"}));
}
var _1e6=_1e2.panelBottom.cloneNode(true);
var _1e7=div({className:"middle"},div({className:"left-edge"},div({className:"right-edge"},this.contentsNode)));
this.node=div({id:id,className:"da_panel"},_1e5,_1e7,_1e6);
this._topNode=_1e5;
this._middleNode=_1e7;
this._bottomNode=_1e6;
YAHOO.util.Event.on(window,"resize",this.fixHeights,this,true);
},fixHeights:function(){
var _1e8=this.node.parentNode?this.node.parentNode:this.node;
var _1e9=_1e8.offsetHeight;
if(_1e9<=0){
return;
}
var _1ea=this._topNode.offsetHeight+this._bottomNode.offsetHeight;
var _1eb=(_1e9-_1ea)-1;
_1eb=Math.max(_1eb,0);
this._middleNode.style.height=((_1eb/_1e9)*100)+"%";
}};
})();
if(!DA||!DA.util){
alert("ERROR: missing DA.js or DA.util");
}
if(typeof DA.locale==="undefined"){
DA.locale={};
DA.locale.message={};
}
DA.locale.GetText={t_:function(key){
var text=DA.locale.GetText._replace(DA.locale.GetText._get(key),arguments);
return (text);
},_get:function(key){
var text;
if(!DA.util.isEmpty(DA.locale.message.custom[key])){
text=DA.locale.message.custom[key];
}else{
if(!DA.util.isEmpty(DA.locale.message.core[key])){
text=DA.locale.message.core[key];
}else{
text=key;
}
}
return text;
},_replace:function(t,args){
var text=t.replace(/\%\d+/g,function(s){
var n=s.replace(/^\%/,"");
n=parseInt(n,10);
if(n>0&&!DA.util.isEmpty(args[n])){
return args[n];
}else{
return "";
}
});
return text;
}};
DA.file={list2String:function(_1f5,cols,max){
var i,l,f;
var _1fb="";
var _1fc;
if(DA.util.isEmpty(cols)){
cols=3;
}
if(_1f5){
if(_1f5.length>=2&&DA.vars.config.soft_install===1){
_1fc=_1f5[0].link.replace(/(.;)/g,", 'all'$1");
_1fb+="<span style=\"white-space: nowrap;\" id=\"down_all_button\" >"+"<span style=\"float:right;white-space: nowrap;\" onclick=\""+_1fc+""+"\" class=\"da_fileInformationListLink\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_download_all.gif","",{width:80,height:15,border:0})+"</span></span>";
_1fb+="<span style=\"white-space: nowrap;\" id=\"save_all_button\" >"+"<span style=\"float:right;white-space: nowrap;\" onclick = \"window.__messageViewer.showsaveattachestolibdialog(event.clientX, event.clientY);\""+"\" class=\"da_fileInformationListLink\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_library_save.gif","",{width:80,height:15,border:0})+"</span></span>";
}
for(i=0;i<_1f5.length;i++){
l="";
f=_1f5[i];
if(DA.util.isEmpty(f.name)){
continue;
}else{
f.name=DA.util.jsubstr4attach(f.name);
l=this.object2String(f,true,true,true);
}
if(!DA.util.isEmpty(l)){
l="<span style=\"white-space: nowrap;\">"+l+"</span>";
}
if(!DA.util.isEmpty(l)){
if(DA.util.isNumber(max)&&i+1>=max){
_1fb+="<span style=\"white-space: nowrap;\">"+l+"&nbsp;<b>..</b></span>\n";
break;
}else{
_1fb+="<span style=\"white-space: nowrap;\">"+l+"&nbsp;</span>\n";
}
if(cols>0&&(i+1)%cols===0){
_1fb+="<br>";
}
}
}
}
return _1fb;
},object2String:function(f,icon,link,_200){
var _201=DA.util.encode(f.name);
if(!DA.util.isEmpty(f.link)&&link){
_201="<span onclick=\""+f.link+"\" class=\"da_fileInformationListLink\" title=\""+f.title+"\">"+_201+"</span>";
}
if(!DA.util.isEmpty(f.icon)&&icon){
_201=DA.imageLoader.tag(f.icon,f.alt,{align:"absmiddle"})+_201;
}
if(!DA.util.isEmpty(f.document)&&_200){
_201+="<span onclick=\""+f.document+"\" class=\"da_fileInformationListLink\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/ico_fc_docsave.gif","",{align:"absmiddle"})+"</span>";
}
return _201;
},openDownload4New:function(MAID,AID,ALL){
var Proc,url,pwin,flg;
if(DA.vars.config.download_type==="simple"&&typeof (ALL)==="undefined"){
url=DA.vars.cgiRdir+"/ma_ajx_download.cgi?proc=mail&maid="+MAID+"&aid="+AID;
flg=1;
}else{
if(ALL==="all"){
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=Bdownload%26maid="+MAID+"%26aid="+AID;
}else{
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=mail%26maid="+MAID+"%26aid="+AID;
}
url=DA.vars.cgiRdir+"/down_pop4ajax.cgi?proc="+Proc;
}
pwin=DA.windowController.winOpenNoBar(url,"",400,450,flg);
},openDownload4Detail:function(FID,UID,AID,ALL){
var pwin,url,Proc,flg;
if(DA.vars.config.download_type==="simple"&&typeof (ALL)==="undefined"){
url=DA.vars.cgiRdir+"/ma_ajx_download.cgi?proc=detail&fid="+FID+"&uid="+UID+"&aid="+AID;
flg=1;
}else{
if(ALL==="all"){
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=Bdownload%26fid="+FID+"%26uid="+UID+"%26aid="+AID;
}else{
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=detail%26fid="+FID+"%26uid="+UID+"%26aid="+AID;
}
url=DA.vars.cgiRdir+"/down_pop4ajax.cgi?proc="+Proc;
}
pwin=DA.windowController.winOpenNoBar(url,"","400","450",flg);
},openDocument4New:function(MAID,AID,TYPE){
var Cgi=(TYPE===1)?"ow_folder_select.cgi":"lib_foldersel.cgi";
var Proc=Cgi+"%3fproc=mail%20maid="+MAID+"%20aid="+AID;
var Img="pop_title_attachsave.gif";
DA.windowController.isePopup(Proc,Img,400,450,MAID);
},openDocument4Detail:function(FID,UID,AID,TYPE){
var Cgi=(TYPE===1)?"ow_folder_select.cgi":"lib_foldersel.cgi";
var Proc=Cgi+"%3fproc=detail%20fid="+FID+"%20uid="+UID+"%20aid="+AID;
var Img="pop_title_attachsave.gif";
DA.windowController.isePopup(Proc,Img,400,550,FID+"_"+UID);
},openAttach:function(MAID){
var Proc="ma_ajx_attach.cgi%3fmaid="+MAID;
var Img="pop_title_attachfile.gif";
DA.windowController.isePopup(Proc,Img,500,450,MAID);
}};
DA.file.InformationListController=function(node,_222,_223,cfg){
this.fileNode=node;
if(_223){
if(DA.util.isFunction(_223.onRemove)){
this.onRemove=_223.onRemove;
}
if(DA.util.isFunction(_223.onPopup)){
this.onPopup=_223.onPopup;
}
}
if(cfg){
if(cfg.maxView){
this.maxView=cfg.maxView;
}
if(cfg.lineHeight){
this.lineHeight=cfg.lineHeight;
}
if(cfg.documentEnabled){
this.documentEnabled=cfg.documentEnabled;
}
if(cfg.popupEnabled){
this.popupEnabled=cfg.popupEnabled;
}
if(cfg.deleteEnabled){
this.deleteEnabled=cfg.deleteEnabled;
}
}
this.init(_222);
};
DA.file.InformationListController.prototype={fileNode:null,fileData:null,fileNdata:null,onRemove:Prototype.emptyFunction,onPopup:Prototype.emptyFunction,maxView:0,lineHeight:0,totalSize:0,documentEnabled:false,popupEnabled:false,deleteEnabled:true,init:function(_225){
this.fileNode.style.display="none";
this.fileData={};
this.fileNdata={};
this.addList(_225);
},add:function(f,_227,perf){
var l={};
var n={};
var me=this;
if(DA.util.isEmpty(f.aid)){
return;
}
n.lineNode=document.createElement("div");
n.iconNode=document.createElement("span");
n.nameNode=document.createElement("span");
n.documentNode=document.createElement("span");
n.popupNode=document.createElement("span");
n.deleteNode=document.createElement("span");
n.lineNode.className="da_fileInformationListLine da_fileInformationListLineAid_"+f.aid;
n.iconNode.className="da_fileInformationListIcon";
n.nameNode.className="da_fileInformationListName";
n.documentNode.className="da_fileInformationListDocument";
n.popupNode.className="da_fileInformationListPopup";
n.deleteNode.className="da_fileInformationListDelete";
n.lineNode.appendChild(n.iconNode);
n.lineNode.appendChild(n.nameNode);
n.lineNode.appendChild(n.deleteNode);
this.fileData[f.aid]=l;
this.fileNdata[f.aid]=n;
this.aid(f.aid);
this.icon(f.aid,f.icon,f.alt);
this.name(f.aid,f.name);
this.title(f.aid,f.title);
this.size(f.aid,f.size);
this.link(f.aid,f.link,f.warn);
this.document(f.aid,f.document);
this.popup(f.aid);
this["delete"](f.aid);
this.linkStyle(f.aid);
this.fileNode.appendChild(n.lineNode);
if(perf!==true){
this.fileNode.style.display="block";
this.lineHeight=this.height(f.aid);
}
if(!_227){
this.resize();
this.scroll();
}
},addList:function(_22c,perf){
var i;
if(perf===true){
this.ugNode.style.display="none";
}
if(_22c){
for(i=0;i<_22c.length;i++){
this.add(_22c[i],true,perf);
}
this.resize();
this.scroll();
}
},linkStyle:function(aid){
var l=this.fileData[aid];
var n=this.fileNdata[aid];
if(DA.util.isEmpty(l.link)){
YAHOO.util.Dom.removeClass(n.title1Node,"da_fileInformationListLink");
YAHOO.util.Dom.removeClass(n.nameNode,"da_fileInformationListLink");
YAHOO.util.Dom.removeClass(n.emailNode,"da_fileInformationListLink");
YAHOO.util.Dom.removeClass(n.title0Node,"da_fileInformationListLink");
YAHOO.util.Dom.addClass(n.title1Node,"da_fileInformationListNoLink");
YAHOO.util.Dom.addClass(n.nameNode,"da_fileInformationListNoLink");
YAHOO.util.Dom.addClass(n.emailNode,"da_fileInformationListNoLink");
YAHOO.util.Dom.addClass(n.title0Node,"da_fileInformationListNoLink");
}else{
YAHOO.util.Dom.removeClass(n.title1Node,"da_fileInformationListNoLink");
YAHOO.util.Dom.removeClass(n.nameNode,"da_fileInformationListNoLink");
YAHOO.util.Dom.removeClass(n.emailNode,"da_fileInformationListNoLink");
YAHOO.util.Dom.removeClass(n.title0Node,"da_fileInformationListNoLink");
YAHOO.util.Dom.addClass(n.title1Node,"da_fileInformationListLink");
YAHOO.util.Dom.addClass(n.nameNode,"da_fileInformationListLink");
YAHOO.util.Dom.addClass(n.emailNode,"da_fileInformationListLink");
YAHOO.util.Dom.addClass(n.title0Node,"da_fileInformationListLink");
}
},list:function(){
var aid;
var list=[];
for(aid in this.fileData){
if(aid.match(/^\d+$/)&&aid>0){
list.push($H(this.fileData[aid]));
}
}
return list;
},get:function(aid,key){
if(DA.util.isEmpty(key)){
return this.fileData[aid];
}else{
return this.fileData[aid][key];
}
},width:function(aid){
if(this.fileNdata[aid]){
return DA.dom.width(this.fileNdata[aid].lineNode);
}else{
return 0;
}
},height:function(aid){
if(this.fileNdata[aid]){
return DA.dom.height(this.fileNdata[aid].lineNode);
}else{
return 0;
}
},count:function(){
var key,_239=0;
for(key in this.fileData){
if(!DA.util.isFunction(this.fileData[key])){
_239++;
}
}
return _239;
},total:function(){
var _23a=this.count();
if(_23a>0){
if(DA.vars.system.max_send_size_visible==="on"&&DA.vars.system.max_send_size&&DA.vars.system.max_send_size>0){
if(this.totalSize>=DA.vars.system.max_send_size){
return "&nbsp;<font color=red>(&nbsp;"+this.totalSize+"&nbsp;/&nbsp;"+DA.vars.system.max_send_size+"&nbsp;)</font>&nbsp;KB";
}else{
return "&nbsp;(&nbsp;"+this.totalSize+"&nbsp;/&nbsp;"+DA.vars.system.max_send_size+"&nbsp;)&nbsp;KB";
}
}else{
return "&nbsp;(&nbsp;"+this.totalSize+"&nbsp;)&nbsp;KB";
}
}else{
return "";
}
},resize:function(){
var _23b;
var _23c=0;
if(this.maxView>0){
_23b=this.count();
if(_23b>0){
if(this.fileNode.firstChild){
_23c=this.fileNode.firstChild.offsetHeight;
}
if(this.lineHeight>_23c){
_23c=this.lineHeight;
}
if(_23b>this.maxView){
YAHOO.util.Dom.addClass(this.fileNode,"da_fileInformationListOverflowAuto");
DA.dom.sizeHeight(this.fileNode,_23c*this.maxView);
}else{
YAHOO.util.Dom.removeClass(this.fileNode,"da_fileInformationListOverflowAuto");
DA.dom.sizeHeight(this.fileNode,_23c*_23b);
}
this.fileNode.style.display="";
}else{
this.fileNode.style.display="none";
}
}
},dummy:function(aid){
var n=this.fileNdata[aid];
var html=n.iconNode.innerHTML+n.nameNode.innerHTML;
return html;
},aid:function(aid){
this.fileData[aid].aid=(DA.util.isEmpty(aid))?"":aid;
},icon:function(aid,icon,alt){
var l=this.fileData[aid];
var n=this.fileNdata[aid];
if(DA.util.isEmpty(icon)){
l.icon="";
l.alt="";
n.iconNode.innerHTML="";
n.iconNode.style.display="none";
}else{
l.icon=icon;
l.alt=(DA.util.isEmpty(alt))?"":alt;
n.iconNode.innerHTML=DA.imageLoader.tag(icon,alt,{"class":"da_fileInformationListIconImage"});
n.iconNode.style.display="";
}
},name:function(aid,name){
var l=this.fileData[aid];
var n=this.fileNdata[aid];
if(DA.util.isEmpty(name)){
l.name="";
n.nameNode.innerHTML="";
n.nameNode.style.display="none";
}else{
l.name=name;
n.nameNode.innerHTML=DA.util.encode(DA.util.jsubstr4attach(name,25));
n.nameNode.style.display="";
}
},title:function(aid,_24b){
var l=this.fileData[aid];
if(DA.util.isEmpty(_24b)){
l.title="";
}else{
l.title=_24b;
}
},size:function(aid,size){
var l=this.fileData[aid];
var n=this.fileNdata[aid];
if(DA.util.isEmpty(size)){
l.size=0;
}else{
l.size=size;
this.totalSize+=l.size;
}
},link:function(aid,link,warn){
var l=this.fileData[aid];
var n=this.fileNdata[aid];
if(DA.util.isEmpty(link)){
l.link="";
n.nameNode.onclick=Prototype.emptyFunction;
}else{
l.link=link;
if(DA.util.isEmpty(warn)){
l.warn="";
n.nameNode.onclick=function(){
eval(link);
};
}else{
l.warn=warn;
n.nameNode.onclick=function(){
DA.util.warn(warn);
eval(link);
};
}
}
},document:function(aid,_257){
var l=this.fileData[aid];
var n=this.fileNdata[aid];
if(DA.util.isEmpty(_257)||!this.documentEnabled){
l.document="";
n.documentNode.innerHTML="";
n.documentNode.onclick=Prototype.emptyFunction;
n.documentNode.style.display="none";
}else{
l.document=_257;
n.documentNode.innerHTML=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_fc_docsave.gif","",{"class":"da_fileInformationListDocument"});
n.documentNode.onclick=function(){
eval(_257);
};
n.documentNode.style.display="";
}
},popup:function(aid){
var l=this.fileData[aid];
var n=this.fileNdata[aid];
var me=this;
if(String(aid).match(/^\d+$/)&&this.popupEnabled){
n.popupNode.innerHTML=DA.imageLoader.tag(DA.vars.imgRdir+"/scroll_btn_down02.gif","",{"class":"da_fileInformationListPopup"});
n.popupNode.onclick=function(e){
me.onPopup(e,aid);
};
n.popupNode.style.display="";
}else{
n.popupNode.style.display="none";
}
},"delete":function(aid){
var l=this.fileData[aid];
var n=this.fileNdata[aid];
var me=this;
if(String(aid).match(/^\d+$/)&&this.deleteEnabled){
n.deleteNode.innerHTML=DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_close_s.gif","",{"class":"da_fileInformationListDelete"});
n.deleteNode.onclick=function(e){
me.remove(aid);
me.onRemove(e,aid);
};
n.deleteNode.style.display="";
}else{
n.deleteNode.style.display="none";
}
},remove:function(aid){
this.fileNdata[aid].lineNode.innerHTML="";
this.fileNdata[aid].lineNode.parentNode.removeChild(this.fileNdata[aid].lineNode);
this.totalSize-=this.fileData[aid].size;
delete this.fileData[aid];
delete this.fileNdata[aid];
this.resize();
},clear:function(){
this.fileNode.innerHTML="";
this.fileNode.style.display="none";
this.fileData={};
this.fileNdata={};
},scroll:function(){
try{
this.fileNode.scrollTop=this.fileNode.scrollHeight;
}
catch(e){
}
}};
var BrowserDetect=window.BrowserDetect;
DA.widget.Dialog=function(_265,hash,_267,_268){
this.nodeId=_265;
this.buttons=_267;
this.setWidth(hash.width);
this.setHead(hash.head);
this.setBody(hash.body);
this.setCbhash(_268);
this.setDialog();
this.setListener();
};
DA.widget.Dialog.prototype={node:null,nodeId:null,head:null,body:null,width:null,buttons:null,dialog:null,focusId:null,onEnter:function(){
return true;
},onCancel:function(){
return true;
},_headId:function(){
return this.nodeId+"_hd";
},_bodyId:function(){
return this.nodeId+"_bd";
},childId:function(id){
return this.nodeId+"_"+id;
},childClass:function(id){
return this.nodeId+"_"+id;
},setDialog:function(){
var node=DA.dom.createDiv(this.nodeId);
var html="<div id=\""+this._headId()+"\" class=\"hd\">"+this.head+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>"+"<div id=\""+this._bodyId()+"\" class=\"bd\">"+this.body+"</div>";
this.node=node;
this.node.innerHTML=html;
this.dialog=new YAHOO.widget.Dialog(this.nodeId,{width:this.width,visible:false,constraintoviewport:true,buttons:(DA.util.isEmpty(this.buttons))?undefined:this.buttons,zindex:200});
this.dialog.render();
},setHead:function(head){
this.head=head;
},setBody:function(body){
this.body=body;
},setWidth:function(_26f){
this.width=_26f;
},setCbhash:function(_270){
if(DA.util.isFunction(_270.onEnter)){
this.onEnter=_270.onEnter;
}
if(DA.util.isFunction(_270.onCancel)){
this.onCancel=_270.onCancel;
}
},setListener:function(){
},_enter:function(){
if(this.onEnter()){
this.hide();
}
},_cancel:function(){
if(this.onCancel()){
this.hide();
}
},show:function(x,y){
if(DA.util.isNumber(x)&&DA.util.isNumber(y)){
this.position(x,y);
}
this.dialog.show();
if(this.focusId){
YAHOO.util.Dom.get(this.focusId).focus();
}
},hide:function(){
this.dialog.hide();
},position:function(x,y){
this.dialog.moveTo(x,y);
},reset:function(head,body){
this.dialog.setHeader(head);
this.dialog.setBody(body);
this.setListener();
},refresh:function(){
this.dialog.setHeader(this.head);
this.dialog.setBody(this.body);
this.setListener();
},remove:function(){
this.node.innerHTML="";
this.node.parentNode.removeChild(this.node);
}};
DA.widget.MessageDialog=function(_277,_278,_279,_27a){
this.nodeId=_277;
this.setHead(_278);
this.setBody(_279);
this.setCbhash(_27a);
this.setDialog();
this.setListener();
};
Object.extend(DA.widget.MessageDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.MessageDialog.prototype.setHead=function(_27b){
this.head=DA.util.encode(_27b);
};
DA.widget.MessageDialog.prototype.setBody=function(_27c){
_27c=(DA.util.isEmpty(_27c))?"":_27c;
this.body=DA.util.encode(_27c)+"<input type=button id=\""+this.childId("ok")+"\" class=\""+this.childClass("ok")+"\" value=\""+DA.locale.GetText.t_("DIALOG_OK_BUTTON")+"\">";
};
DA.widget.MessageDialog.prototype.setListener=function(){
YAHOO.util.Event.addListener(this.childId("ok"),"click",this._enter,this,true);
};
DA.widget.StringChangerDialog=function(_27d,_27e,_27f,_280){
this.nodeId=_27d;
this.setHead(_27e);
this.setBody(_27f);
this.setCbhash(_280);
this.setDialog();
this.setListener();
};
Object.extend(DA.widget.StringChangerDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.StringChangerDialog.prototype.setHead=function(_281){
this.head=DA.util.encode(_281);
};
DA.widget.StringChangerDialog.prototype.setBody=function(_282){
this.body="<input type=text id=\""+this.childId("text")+"\" class=\""+this.childClass("text")+"\" value=\""+DA.util.encode(_282)+"\">"+"<input type=button id=\""+this.childId("set")+"\" class=\""+this.childClass("set")+"\" value=\""+DA.locale.GetText.t_("DIALOG_SETTING_BUTTON")+"\">";
this.focusId=this.childId("text");
};
DA.widget.StringChangerDialog.prototype.setListener=function(){
YAHOO.util.Event.addListener(this.childId("set"),"click",this._enter,this,true);
};
DA.widget.StringChangerDialog.prototype.setString=function(_283){
var el=YAHOO.util.Dom.get(this.childId("text"));
el.value=_283;
};
DA.widget.FileUploadDialog=function(_285,_286,_287){
this.nodeId=_285;
this.setHead(_286);
this.setBody();
this.setCbhash(_287);
this.setDialog();
this.setListener();
};
Object.extend(DA.widget.FileUploadDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.FileUploadDialog.prototype.setHead=function(_288){
this.head=DA.util.encode(_288);
};
DA.widget.FileUploadDialog.prototype.setBody=function(){
this.body="<form id=\""+this.childId("form")+"\">"+"<input type=file id=\""+this.childId("file")+"\" class=\""+this.childClass("file")+"\" name=\"path\" value=\"\">"+"<input type=button id=\""+this.childId("set")+"\" class=\""+this.childClass("set")+"\" value=\""+DA.locale.GetText.t_("DIALOG_SETTING_BUTTON")+"\">"+"</form>";
this.focusId=this.childId("file");
};
DA.widget.FileUploadDialog.prototype.setListener=function(){
YAHOO.util.Event.addListener(this.childId("set"),"click",this._enter,this,true);
};
DA.widget.MaskDialog=function(_289,_28a,_28b,_28c,from){
this.nodeId=_289;
this.setBody(_28a,_28b,_28c,from);
this.setDialog();
};
Object.extend(DA.widget.MaskDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.MaskDialog.prototype.setDialog=function(){
var node=DA.dom.createDiv(this.nodeId);
var html="<div id=\""+this._bodyId()+"\" class=\"bd\">"+this.body+"</div>";
this.node=node;
this.node.innerHTML=html;
this.dialog=new YAHOO.widget.Dialog(this.nodeId,{fixedcenter:true,close:false,draggable:false,modal:true,visible:false,zindex:999});
this.dialog.render();
};
DA.widget.MaskDialog.prototype.setBody=function(_290,_291,_292,from){
_290=(DA.util.isEmpty(_290))?"":_290;
_291=(DA.util.isEmpty(_291))?DA.vars.imgRdir+"/popy_wait.gif":_291;
var _294;
var ie6=0;
if(_292){
_291="<center><img src=\""+_291+"\"></center>";
}else{
_291="<img src=\""+_291+"\">";
}
if(BrowserDetect.browser==="Explorer"&&BrowserDetect.version===6&&from==="transmit"){
_294=["<div class=\""+this._bodyId()+"\">","<table><tr><td>"+_291+"<br></td></tr>","<tr><td><center><span style=\"font-size:20px;\">"+_290+"</span></center><br></td></tr>"];
ie6=1;
}else{
_294=["<div class=\""+this._bodyId()+"\">",_291+"<br>","<center><span>"+_290+"</span></center><br>"];
}
var i,l;
if(_292){
l=_292.length;
if(ie6===1){
_294.push("<tr><td>");
}
_294.push("<center><span>");
for(i=0;i<l;i++){
_294.push("<button id=\""+this._bodyId()+"Button"+i+"\">"+_292[i].string+"</button>");
}
_294.push("</center></span><br>");
if(ie6===1){
_294.push("</td></tr></table>");
}
}
_294.push("</div>");
this.body=_294.join("")+"";
};
DA.widget.MaskDialog.prototype.refresh=function(_298){
this.dialog.setBody(this.body);
var i,l,el;
if(_298){
l=_298.length;
for(i=0;i<l;i++){
if(_298[i].onclick){
el=YAHOO.util.Dom.get(this._bodyId()+"Button"+i);
el.onclick=_298[i].onclick;
}
}
}
};
DA.waiting={wtDialog:null,init:function(){
this.wtDialog=new DA.widget.MaskDialog("da_waitingDialog","");
},show:function(_29c,_29d,_29e,from){
this.wtDialog.setBody(_29c,_29d,_29e,from);
this.wtDialog.refresh(_29e);
this.wtDialog.show();
},hide:function(){
this.wtDialog.hide();
},remove:function(){
this.wtDialog.remove();
}};
DA.widget.TipDialog=function(_2a0,_2a1,_2a2,_2a3){
this.nodeId=_2a0;
this.setBody(_2a2,_2a3);
this.setDialog(_2a1);
};
Object.extend(DA.widget.TipDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.TipDialog.prototype.setDialog=function(_2a4){
var node=DA.dom.createDiv(this.nodeId);
var html="<div id=\""+this._bodyId()+"\" class=\"bd\">"+this.body+"</div>";
this.node=node;
this.node.innerHTML=html;
this.dialog=new YAHOO.widget.Dialog(this.nodeId,{fixedcenter:true,close:true,draggable:true,modal:false,visible:false,zindex:999,width:"230px"});
this.dialog.setHeader("<b>"+_2a4+"</b>");
this.dialog.render();
};
DA.widget.TipDialog.prototype.refresh=function(){
this.dialog.setBody(this.body);
};
DA.widget.TipDialog.prototype.setBody=function(_2a7,_2a8,_2a9){
_2a8=(DA.util.isEmpty(_2a8))?"":_2a8;
_2a9=(DA.util.isEmpty(_2a9))?DA.vars.imgRdir+"/popy_ok.gif":_2a9;
this.body=document.createElement("div");
this.body.imageP=document.createElement("p");
this.body.imageP.image=document.createElement("img");
this.body.msg1=document.createElement("span");
this.body.msg2=document.createElement("p");
this.body.buttons=document.createElement("div");
this.body.buttons.button1=document.createElement("input");
this.body.buttons.button2=document.createElement("input");
this.body.className=this._bodyId();
this.body.imageP.image.src=_2a9;
this.body.msg1.innerHTML=_2a8;
this.body.msg2.innerHTML=_2a7;
this.body.buttons.button1.type="button";
this.body.buttons.button1.value=DA.locale.GetText.t_("CONFIRM_CANCEL_BUTTON");
this.body.buttons.button2.type="button";
this.body.buttons.button2.value=DA.locale.GetText.t_("CONFIRM_SEND_BUTTON");
this.body.imageP.appendChild(this.body.imageP.image);
this.body.appendChild(this.body.imageP);
this.body.appendChild(this.body.msg1);
this.body.appendChild(this.body.msg2);
this.body.buttons.appendChild(this.body.buttons.button1);
this.body.buttons.appendChild(this.body.buttons.button2);
this.body.appendChild(this.body.buttons);
};
DA.widget.TipDialog.prototype.setBtnsOnclick=function(_2aa){
this.body.buttons.button1.onclick=_2aa[0];
this.body.buttons.button2.onclick=_2aa[1];
};
DA.widget.TipDialog.prototype.setFocus=function(obj){
obj.focus();
};
DA.tipDlg={TipDialog:null,init:function(_2ac,_2ad,_2ae,_2af){
this.TipDialog=new DA.widget.TipDialog("da_TipDialog",_2ac,_2ad,_2ae);
var _2b0;
if(_2af==="preview"){
_2b0=function(){
if(DA.tipDlg.isInit()){
DA.tipDlg.hide();
}
};
}else{
_2b0=function(){
window.__messageEditor.back();
};
}
var _2b1=function(){
window.__messageEditor.transmit();
};
this.TipDialog.setBtnsOnclick([_2b0,_2b1]);
},show:function(){
this.TipDialog.refresh();
this.TipDialog.show();
this.TipDialog.setFocus(this.TipDialog.body.buttons.button1);
},hide:function(){
this.TipDialog.hide();
},isInit:function(){
if(this.TipDialog){
return true;
}else{
return false;
}
}};
DA.widget.SaveAttachesToLibDialog=function(_2b2,_2b3,_2b4,fid,uid,_2b7){
this.nodeId=_2b2;
this.setHead(_2b3);
if(_2b4.order){
this.setBody(_2b4,fid,uid);
}
this.setCbhash(_2b7);
this.setDialog();
this.setListener();
};
Object.extend(DA.widget.SaveAttachesToLibDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.SaveAttachesToLibDialog.prototype.setHead=function(_2b8){
this.head=DA.util.encode(_2b8);
};
DA.widget.SaveAttachesToLibDialog.prototype.setBody=function(_2b9,fid,uid){
var _2bc=_2b9.order[0].length;
var _2bd="";
var aid;
for(var i=0;i<_2bc;i++){
aid=i+1;
_2bd+="<input type=checkbox name="+this.childClass("attaches")+" value=\""+aid+"\"></input>"+"<span title=\""+_2b9.items[i].title+"\">"+DA.util.jsubstr4attach(_2b9.items[i].title,22)+"</span><br>";
}
_2bd+="<input type=button id=\""+this.childClass("save")+"\" value=\""+DA.locale.GetText.t_("DIALOG_SAVE_BUTTON")+"\">";
this.body=_2bd;
};
DA.widget.SaveAttachesToLibDialog.prototype.setListener=function(){
YAHOO.util.Event.addListener(this.childId("save"),"click",this._enter,this,true);
};
DA.widget.SearchMoveFolderDialog=function(_2c0,_2c1,_2c2){
this.nodeId=_2c0;
this.setHead(_2c1);
this.setCbhash(_2c2);
this.setBody();
this.setDialog();
this.setListener();
};
Object.extend(DA.widget.SearchMoveFolderDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.SearchMoveFolderDialog.prototype.setHead=function(_2c3){
this.head=DA.util.encode(_2c3);
};
DA.widget.SearchMoveFolderDialog.prototype.setBody=function(){
var _2c4="<select style = \"width:200px;\" id=\"da_searchMoveToFid\">"+DA.vars.options.folder_tree+"</select>";
_2c4+="<input type=button id=\""+this.childClass("save")+"\" value=\""+DA.locale.GetText.t_("DIALOG_MOVE_BUTTON")+"\">";
this.body=_2c4;
};
DA.widget.SearchMoveFolderDialog.prototype.setListener=function(){
YAHOO.util.Event.addListener(this.childId("save"),"click",this._enter,this,true);
};
if(!DA||!DA.widget){
throw "ERROR: missing DA.js";
}
DA.tableutils={getComputedWidths:function(list){
var _2c6=[];
for(var i=0;i<list.length;i++){
_2c6.push(list[i].offsetWidth);
}
return _2c6;
}};
DA.widget.makeATable=function(rows,_2c9,_2ca,data){
var _2cc=1;
var thr,_2ce;
_2ca=_2ca?_2ca:{};
rows=rows?rows:1;
var _2cf=false;
var _2d0=[];
if(!_2c9){
_2cc=1;
}else{
if("number"===typeof _2c9){
_2cc=_2c9;
}else{
if(_2c9.each){
_2ce=document.createElement("colgroup");
_2cf=false;
_2d0=_2c9.map(function(_col,_2d2){
var col=document.createElement("col");
col.width=_col.width;
col.className="col"+_2d2;
_2ce.appendChild(col);
if(_col.name){
_2cf=true;
}
return _2cf?_col.name:"&nbsp";
});
_2ce.span=_2d0.length;
if(_2cf){
thr=document.createElement("tr");
if(_2ca.tr){
thr.className=_2ca.tr;
}
_2d0.each(function(name){
var th=document.createElement("th");
if(_2ca.th){
th.className=_2ca;
}
th.innerHTML=name;
thr.appendChild(th);
});
}
_2cc=_2d0.length;
}
}
}
data=data?data:[];
var _2d6=document.createElement("table");
var _2d7=document.createElement("tbody");
if(_2ce){
_2d6.appendChild(_2ce);
}
var _2d8;
if(thr){
_2d8=document.createElement("thead");
_2d8.appendChild(thr);
_2d6.appendChild(_2d8);
}
_2d6.appendChild(_2d7);
_2d6.className=_2ca.table;
_2d7.className=_2ca.table;
var tr;
var td;
var _2db;
var _2dc;
for(var j,i=0;i<rows;i++){
tr=document.createElement("tr");
_2dc=(i%2)?"odd":"even";
tr.className=_2ca.tr?(_2ca.tr+" "+_2dc):_2dc;
_2db=data[i]||[];
for(j=0;j<_2cc;j++){
td=document.createElement("td");
if(_2ca.td){
td.className=_2ca.td;
}
td.innerHTML=_2db[j]||"&nbsp;";
tr.appendChild(td);
}
_2d7.appendChild(tr);
}
return _2d6;
};
if(YAHOO&&YAHOO.util&&YAHOO.util.DragDrop){
DA.widget.ColumnResizer=function(_2df,_2e0){
this.table=_2df;
this._cols=this.table.getElementsByTagName("col");
this.config=Object.extend({maintainPercentage:true,minWidth:20},_2e0||{});
};
DA.widget.ColumnResizer.prototype={table:null,_cols:null,getComputedWidths:function(){
return DA.tableutils.getComputedWidths(this._cols);
},moveRight:function(l,_2e2){
this.preResize(l,_2e2);
if(this.tableLayoutHack){
this.table.style.tableLayout="auto";
}
var _2e3=this.getComputedWidths();
var minW=this.config.minWidth;
var _2e5=_2e3[l];
var _2e6=_2e3[l+1];
if((_2e6>minW)&&(_2e6-_2e2<=minW)){
_2e2=_2e6-minW;
}
if((_2e5>minW)&&(_2e5+_2e2<=minW)){
_2e2=minW-_2e5;
}
_2e3[l]=(_2e5+_2e2);
_2e3[l+1]=(_2e6-_2e2);
this._setNewWidths(_2e3);
if(this.tableLayoutHack){
this.table.style.tableLayout="fixed";
}
this.postResize(l,_2e2);
},_setNewWidths:function(_2e7){
if(!_2e7||(_2e7.length!==this._cols.length)){
return;
}
var _2e8=(this.config.maintainPercentage)?this._fairPercentages(DA.util.toPercentages(_2e7)):_2e7;
var func=(this.config.maintainPercentage)?this.setColWidthPerc:this.setColWidth;
_2e8.each(func.bind(this));
_2e8.each(func.bind(this));
},_fairPercentages:function(arr){
var _2eb=[];
var _2ec=true;
var _2ed=arr.map(function(p,i){
var r=Math.round(p);
if(r<1){
_2ec=false;
}
_2eb.push({i:i,profit:r-p});
return r;
});
var _2f1=_2ed.inject(0,function(a,b){
return a+b;
});
if(_2f1===100&&_2ec){
return _2ed;
}
if(_2f1>100){
_2eb.sortBy(function(a,b){
return a.profit>b.profit;
});
(_2f1-100).times(function(i){
var _2f7=_2eb[i].i;
--_2ed[_2f7];
});
}else{
if(_2f1<100){
_2eb.sortBy(function(a,b){
return b.profit>a.profit;
});
(100-_2f1).times(function(i){
var _2fb=_2eb[i].i;
++_2ed[_2fb];
});
}
}
var num;
var sum=0;
var temp=0;
for(var i=0;i<_2ed.length;i++){
if(_2ed[i]<1){
sum=sum+(1-_2ed[i]);
_2ed[i]=1;
}
if(_2ed[i]>temp){
temp=_2ed[i];
num=i;
}
}
if(sum!==0){
_2ed[num]=_2ed[num]-sum;
}
return _2ed;
},setColWidth:function(w,_301){
this._cols[_301].width=(w+"px");
},setColWidthPerc:function(w,_303){
this._cols[_303].width=(w+"%");
},tableLayoutHack:(BrowserDetect.browser==="Mozilla"||BrowserDetect.browser==="Firefox"),preResize:Prototype.emptyFunction,postResize:Prototype.emptyFunction};
DA.widget.TwoColumnResizeHandle=function(_304,elem,_306,_307){
this.index=_307;
this.resizer=_306;
this.table=_304;
this.init(elem);
var msg;
if("number"!==typeof _307){
msg="ERROR: index not supplied for TwoColumnResizeHandle";
throw msg;
}
};
YAHOO.lang.extend(DA.widget.TwoColumnResizeHandle,YAHOO.util.DragDrop,{resizer:null,_lamb:null,_proxyEl:null,onMouseDown:function(e){
this._proxyEl=document.createElement("div");
var _30a=this._proxyEl;
_30a.className="da_columnResizeLineActive";
document.body.appendChild(this._proxyEl);
var _30b=YAHOO.util.Event.getPageX(e);
var _30c=YAHOO.util.Dom.getY(this.table);
Object.extend(_30a.style,{height:this.table.parentNode.offsetHeight+"px",left:_30b+"px",top:_30c+"px"});
var _30d=this.resizer.getComputedWidths();
var _30e=_30d[this.index+1];
var _30f=_30d[this.index];
var minW=this.resizer.config.minWidth;
this.setInitPosition();
this.setXConstraint(_30f-minW,_30e-minW);
this._lamb=document.createElement("div");
this._lamb.innerHTML="&nbsp;";
document.body.appendChild(this._lamb);
var _311=this._lamb.style;
Object.extend(_311,{height:"10px",width:"10px",cursor:"w-resize",position:"absolute",top:(YAHOO.util.Event.getPageY(e)-4)+"px",left:(_30b-4)+"px"});
},onDrag:function(e){
var curX=YAHOO.util.Event.getPageX(e);
if(curX<this.minX||curX>this.maxX){
return;
}
this._proxyEl.style.left=curX+"px";
this._lamb.style.left=(curX-4)+"px";
this._lamb.style.top=(YAHOO.util.Event.getPageY(e)-4)+"px";
},onMouseUp:function(e){
var curX=YAHOO.util.Dom.getX(this._proxyEl);
var _316=curX-this.startPageX;
this.resizer.moveRight(this.index,_316);
this._proxyEl.style.display="none";
document.body.removeChild(this._lamb);
document.body.removeChild(this._proxyEl);
}});
}
if("undefined"===typeof DA){
alert("ERROR: need DA.js");
}else{
if(!DA.io){
DA.io={};
}
}
DA.io.Manager={data:{},_serialize:function(url){
return url+"_"+DA.util.getTime();
},loading:function(url){
var s;
if(DA.util.isEmpty(url)){
return "";
}else{
s=this._serialize(url);
this.data[s]=true;
return s;
}
},done:function(s){
if(!DA.util.isEmpty(s)){
delete this.data[s];
}
},isActive:function(){
var key,_31c=false;
for(key in this.data){
if(!DA.util.isFunction(this.data[key])){
_31c=true;
break;
}
}
return _31c;
}};
if(!DA||!DA.io){
alert("ERROR: missing DA.js or io.js");
}
DA.io.JsonIO=function(url,_31e){
this.defaultParams=_31e;
this.url=DA.util.setUrl(url);
};
(function(){
var _31f,_320;
try{
_31f=YAHOO.lang.isObject;
_320=YAHOO.lang.isFunction;
}
catch(e){
_31f=function(obj){
return DA.util.isObject(obj)||DA.util.isFunction(obj);
};
_320=DA.util.isFunction;
}
DA.io.JsonIO.prototype={defaultParams:undefined,callback:function(obj,args){
},errorHandler:function(e,_325){
var s="";
var v;
for(var p in e){
try{
v=e[p];
if(typeof v==="function"){
continue;
}
s+=(p+":"+v+"\n");
}
catch(er){
}
}
DA.log("JSON-IO ERROR:"+e,"error","JSONIO");
alert("ERROR: JSON-IO: response was: "+s);
},htmlHandler:function(e){
var win=DA.windowController.winOpen();
win.document.open();
win.document.write(e.body);
win.document.close();
window.close();
},method:"post",execute:function(_32b,_32c){
var _32d=undefined;
var _32e=this.callback;
var _32f=this.errorHandler;
var _330=this.htmlHandler;
if(_32c){
if(_320(_32c)){
_32e=_32c;
}else{
if(_31f(_32c)){
if(_320(_32c.callback)){
_32e=_32c.callback;
}
if(_320(_32c.errorHandler)){
_32f=_32c.errorHandler;
}
}
}
}
if(this.defaultParams){
_32d={};
Object.extend(_32d,this.defaultParams);
}
if(_32b){
_32d=_32d?_32d:{};
Object.extend(_32d,_32b);
}
var _url=this.url;
var _332=DA.io.Manager.loading(_url);
var _333=encodeURIComponent(_332);
var req=new Ajax.Request(_url.match(/\?/)?_url+"&serial="+_333:_url+"?serial="+_333,{method:this.method,parameters:$H(_32d).toQueryString(),onSuccess:function(_335){
var _336=_335.getResponseHeader("Content-Type");
if(!_336||!_336.match(/(js|json|javascript)/i)){
DA.io.Manager.done(_332);
_330({type:"INVALID_CONTENTTYPE",contentType:_336,body:_335.responseText});
return;
}
var _337=_335.responseText;
var obj;
try{
obj=eval("("+_337+")");
if("object"===typeof obj){
DA.io.Manager.done(_332);
_32e(obj,_32d);
}else{
DA.io.Manager.done(_332);
_32f({type:"NOT_AN_OBJECT",contentType:_336,body:_335.responseText},_32d);
}
}
catch(e){
DA.io.Manager.done(_332);
_32f(e,_32d);
}
},onFailure:function(err){
DA.io.Manager.done(_332);
_32f(err,_32d);
},onException:function(e){
}});
}};
})();
if(!DA||!DA.io){
alert("ERROR: missing DA.js or DA.io");
}
if(!YAHOO.util||!YAHOO.util.Dom||!YAHOO.util.Connect){
alert("ERROR: missing YAHOO.util or YAHOO.util.Dom or YAHOO.util.Connect");
}
DA.io.FileUploadIO=function(url,_33c,_33d){
this.url=DA.util.setUrl(url);
this.formId=_33c;
this.defaultParams=_33d;
if(location.href.match(/^[hH][tT][tT][pP][sS]\:\/\//)){
this.secureUri=true;
}else{
this.secureUri=false;
}
};
DA.io.FileUploadIO.prototype={url:null,formId:null,defaultParams:undefined,secureUri:null,callback:function(obj,args){
},errorHandler:function(e,_341){
var v,s="";
for(var p in e){
try{
v=e[p];
if(typeof v==="function"){
continue;
}
s+=(p+":"+v+"\n");
}
catch(er){
}
}
DA.log("FileUpload-IO ERROR:"+e,"fileupload-io.js");
alert("ERROR: FileUpload-IO: response was: "+s);
},htmlHandler:function(e){
var win=DA.windowController.winOpen();
win.document.open();
win.document.write(e.body);
win.document.close();
window.close();
},execute:function(_347,_348){
var me=this;
var _34a=undefined;
if(this.defaultParams){
_34a={};
Object.extend(_34a,this.defaultParams);
}
if(_348){
_34a=_34a?_34a:{};
Object.extend(_34a,_348);
}
var _url=this.url;
if(!_347){
_347=this.formId;
}
var _34c=DA.io.Manager.loading(_url);
try{
YAHOO.util.Connect.setForm(YAHOO.util.Dom.get(_347),true,this.secureUri);
YAHOO.util.Connect.asyncRequest("POST",_url,{upload:function(_34d){
var obj;
var _34f;
var _350=_34d.responseText;
_350=_350.replace(/^<pre>/i,"");
_350=_350.replace(/<\/pre>[\s\r\n\t]*$/i,"");
obj=eval("("+_350+")");
if("object"===typeof obj){
DA.io.Manager.done(_34c);
me.callback(obj,_34a);
}else{
DA.io.Manager.done(_34c);
me.htmlHandler({type:"NOT_AN_OBJECT",body:_34d.responseText});
}
},failure:function(_351){
DA.io.Manager.done(_34c);
me.errorHandler({type:"NOT_AN_OBJECT",body:_351.statusText},_34a);
}});
}
catch(e){
DA.io.Manager.done(_34c);
me.errorHandler(e,_34a);
}
}};
if("undefined"===typeof DA){
alert("ERROR: need DA.js");
}else{
if(!DA.mailer){
DA.mailer={};
DA.mailer.util={};
DA.mailer.connection={};
DA.mailer.widget={};
DA.mailer.windowController={};
}
}
DA.mailer.util={treeOpenStatus:{},treeOpenAll:function(id){
if(DA.util.isEmpty(DA.mailer.util.treeOpenStatus[id])){
DA.mailer.util.treeOpenStatus[id]=false;
}
if(DA.mailer.util.treeOpenStatus[id]){
DA.mailer.util.treeOpenStatus[id]=false;
this._treeCloseAllChildren(YAHOO.widget.TreeView.getTree(id).getRoot());
}else{
DA.mailer.util.treeOpenStatus[id]=true;
this._treeOpenAllChildren(YAHOO.widget.TreeView.getTree(id).getRoot());
}
},_treeOpenAllChildren:function(node){
var i,_355;
for(i=0;i<node.children.length;i++){
_355=node.children[i];
if(_355.hasChildren()){
_355.expand();
this._treeOpenAllChildren(_355);
}
}
},_treeCloseAllChildren:function(node){
var i,_358;
for(i=0;i<node.children.length;i++){
_358=node.children[i];
if(_358.hasChildren()){
_358.collapse();
this._treeCloseAllChildren(_358);
}
}
},checkResult:function(o){
if(o.result.error===9){
if(o.result.message==="OLD_OF_FOLDER"){
if(DA.util.confirm(DA.locale.message.core[o.result.message])){
window.location.reload();
}
}else{
DA.util.error(o.result.message);
}
return false;
}else{
if(o.result.error===2){
DA.util.warn(o.result.message);
return true;
}else{
if(o.result.error===1){
DA.util.warn(o.result.message);
return false;
}else{
return true;
}
}
}
},reloadPortal:function(){
var _35a;
try{
_35a=window.opener.document.date_form.date.value;
window.opener.DAportletRefresher.refresh_all("mail",_35a,"");
}
catch(e){
window.opener.location.href=DA.util.setUrl(DA.vars.cgiRdir+"/login_main.cgi?time="+DA.util.getTime()+"&date="+window.opener.document.date_form.date.value);
}
},isRoot:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.root,10);
},isServer:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.server,10);
},isInbox:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.inbox,10);
},isDraft:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.draft,10);
},isSent:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.sent,10);
},isTrash:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.trash,10);
},isSpam:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.spamx,10);
},isDefault:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType["default"],10);
},isMailbox:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.mailbox,10);
},isCabinet:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.cabinet,10);
},isLocalServer:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.localServer,10);
},isLocalFolder:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.localFolder,10);
},isJoin:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.join,10);
},isBackupFolder:function(type){
return parseInt(type,10)===parseInt(DA.vars.folderType.backupFolder,10);
},getOperationFlag:function(){
var key=OrgMailer.vars.cookie_key+"-operation_flag";
var _36a=document.cookie.split(";");
for(var i=0;i<_36a.length;i++){
if(_36a[i].split("=")[0].replace(/(^\s*)|(\s*$)/g,"")===key){
return _36a[i].split("=")[1];
}
}
return "";
},getOperationWarnedFlag:function(){
var key=OrgMailer.vars.cookie_key+"-operation_warned";
var _36d=document.cookie.split(";");
for(var i=0;i<_36d.length;i++){
if(_36d[i].split("=")[0].replace(/(^\s*)|(\s*$)/g,"")===key){
return _36d[i].split("=")[1];
}
}
return "";
},getMailAccount:function(){
var key=OrgMailer.vars.cookie_key+"-org_mail";
var _370=document.cookie.split(";");
for(var i=0;i<_370.length;i++){
if(_370[i].split("=")[0].replace(/(^\s*)|(\s*$)/g,"")===key){
return _370[i].split("=")[1];
}
}
},autoCloseWaitingMask:function(){
var _372=window.setInterval(function(){
if(DA.mailer.util.getOperationFlag()===""){
DA.waiting.hide();
OrgMailer.vars.operation_warned=0;
window.clearInterval(_372);
if(!OrgMailer.vars.is_blured){
document.cookie=OrgMailer.vars.cookie_key+"-org_mail="+OrgMailer.vars.org_mail_gid+";";
}
}
},500);
},setOperationFlag:function(flag){
document.cookie=OrgMailer.vars.cookie_key+"-operation_flag="+flag;
},setOperationWarnedFlag:function(flag){
var _375=DA.mailer.util.getOperationWarnedFlag();
if(flag===""){
_375="";
}else{
if(_375.indexOf(flag)<0){
if(_375!==""){
_375+=",";
}
_375+=flag;
}
}
document.cookie=OrgMailer.vars.cookie_key+"-operation_warned="+_375+";";
}};
DA.mailer.connection={titleNode:null,titleBarNode:null,titleBarNumber:0,clearLogined:function(){
try{
window.opener.AjaxMailerLogined=0;
window.opener.AjaxMailerWindow=null;
}
catch(e){
}
},login:function(){
if(YAHOO.util.Dom.getViewportWidth()<100||YAHOO.util.Dom.getViewportHeight()<100){
DA.util.warn(DA.locale.GetText.t_("WINDOW_SIZE_WARN"));
window.resizeTo(800,600);
}
var body=document.body;
var div=document.createElement("div");
var img=document.createElement("div");
Object.extend(div.style,{position:"absolute",top:"0px",left:"0px",width:"100%",height:"100%",zIndex:"1000",verticalAlign:"middle",backgroundColor:"#e1e1e1",backgroundImage:"url("+DA.vars.imgRdir+"/ajaxmail_bk.gif)",backgroundRepeat:"",backgroundPosition:""});
img.innerHTML="<div style=\"text-align:center; margin:70px 0px 0px 0px;\">"+"<div>"+DA.imageLoader.tag(DA.vars.imgRdir+"/ajaxmail_logo.gif","",{width:120,height:30})+"</div>"+"<div style=\"margin:20px 0px 0px 0px;\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/ajaxmail_read.gif","",{width:44,height:44})+"</div>"+"<div>"+DA.imageLoader.tag(DA.vars.imgRdir+"/ajaxmail_bar00.gif","",{id:"da_title_bar",width:290,height:53})+"</div>"+"<div style=\"margin:2px 0px 6px 0px;\">"+DA.locale.GetText.t_("STARTING")+"</div>"+"<div style=\"font-size:9px;\">"+DA.locale.GetText.t_("STARTING_WARN")+"</div>"+"<div style=\"margin:30px 0px 0px 0px;font-size:9px;\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/ajaxmail_iselogo.gif","")+"<br>"+DA.locale.GetText.t_("COPYRIGHT","2006-2014")+"</div>"+"</div>";
div.appendChild(img);
body.insertBefore(div,body.firstChild);
this.titleNode=div;
this.titleBarNode=YAHOO.util.Dom.get("da_title_bar");
if(BrowserDetect.browser==="Explorer"){
if(BrowserDetect.version===6){
}else{
if(BrowserDetect.version>6){
}else{
DA.util.warn(DA.locale.GetText.t_("BROWSER_ERROR"));
window.close();
}
}
}else{
if(BrowserDetect.browser==="Firefox"){
if(BrowserDetect.version>1){
}else{
DA.util.warn(DA.locale.GetText.t_("BROWSER_WARN"));
}
}else{
if(BrowserDetect.browser==="Mozilla"){
if(BrowserDetect.OS==="Linux"){
}else{
DA.util.warn(DA.locale.GetText.t_("BROWSER_WARN"));
}
}else{
}
}
}
},logout:function(){
var id,me=this;
if(DA.util.lock("logout")){
if(DA.util.confirm(DA.locale.GetText.t_("MAILER_CLOSE_CONFIRM"))){
id=setInterval(function(){
var io;
if(!DA.io.Manager.isActive()){
clearInterval(id);
DA.windowController.allClose();
io=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_logout.cgi");
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me.clearLogined();
if(BrowserDetect.browser==="Mozilla"||BrowserDetect.browser==="Firefox"){
window.open(null,"_self").close();
}else{
window.close();
}
}else{
if(DA.util.confirm(DA.locale.GetText.t_("LOGOUT_ERROR_CONFIRM"))){
me.clearLogined();
if(BrowserDetect.browser==="Mozilla"||BrowserDetect.browser==="Firefox"){
window.open(null,"_self").close();
}else{
window.close();
}
}else{
DA.util.unlock("logout");
}
}
};
io.errorHandler=function(e){
if(DA.util.confirm(DA.locale.GetText.t_("LOGOUT_ERROR_CONFIRM"))){
me.clearLogined();
if(BrowserDetect.browser==="Mozilla"||BrowserDetect.browser==="Firefox"){
window.open(null,"_self").close();
}else{
window.close();
}
}else{
DA.util.unlock("logout");
}
};
io.execute();
}
},1000);
}else{
DA.util.unlock("logout");
}
}
},_saveStateIO:new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_config.cgi"),saveState:function(){
var io,_37f,_380,i;
if(DA.util.lock("saveState")){
io=this._saveStateIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
DA.util.warn(DA.locale.GetText.t_("SAVE_STATE_MESSAGE"));
DA.util.unlock("saveState");
try{
window.opener.AjaxMailerWindowWidth=_37f.window_width;
window.opener.AjaxMailerWindowHeight=_37f.window_height;
window.opener.AjaxMailerWindowPosX=_37f.window_pos_x;
window.opener.AjaxMailerWindowPosY=_37f.window_pos_y;
}
catch(e){
}
}
};
io.errorHandler=function(e){
DA.util.unlock("saveState");
};
_37f={proc:"default",window_pos_x:(BrowserDetect.browser==="Explorer")?window.screenLeft-4:window.screenX,window_pos_y:(BrowserDetect.browser==="Explorer")?window.screenTop-30:window.screenY,window_width:YAHOO.util.Dom.getViewportWidth(),window_height:YAHOO.util.Dom.getViewportHeight()};
if(_37f.window_pos_x<0){
_37f.window_pos_x=0;
}
if(_37f.window_pos_y<0){
_37f.window_pos_y=0;
}
_380=DA.session.UIState.getAllStateInfo();
_380.each(function(_384){
var _385="";
if(_384.name==="threePane"){
_37f.dir_width=_384.info.leftPane.width;
_37f.list_height=_384.info.rightTopPane.height;
}else{
if(_384.name==="mboxgrid"){
_384.info.columns.each(function(col){
_385+=col.width+"|";
});
_37f.list_column_width=_385.replace(/\|+$/,"");
}else{
if(_384.name==="messageViewer"){
_37f.detail_header_open=_384.info.headerExpanded;
_37f.detail_header_to_open=_384.info.headerToExpanded;
_37f.detail_header_cc_open=_384.info.headerCcExpanded;
_37f.detail_header_attachment_open=_384.info.headerAttachmentExpanded;
}
}
}
});
io.execute(_37f);
}
},titleShow:function(){
if(this.titleNode.style.display==="none"){
this.titleNode.style.display="";
}
},titleHide:function(){
if(this.titleNode.style.display===""){
this.titleNode.style.display="none";
}
},titleBar:function(){
if(this.titleNode.style.display===""){
this.titleBarNumber++;
if(this.titleBarNumber<10){
this.titleBarNode.src=DA.vars.imgRdir+"/ajaxmail_bar0"+this.titleBarNumber.toString()+".gif";
}else{
this.titleBarNumber=10;
this.titleBarNode.src=DA.vars.imgRdir+"/ajaxmail_bar"+this.titleBarNumber.toString()+".gif";
}
}
}};
DA.mailer.windowController={viewerWidth:function(w){
if(w){
DA.session.Values.registerValue("viewerWindowWidth",w);
}
return DA.session.Values.getValue("viewerWindowWidth")||DA.vars.config.viewer_width;
},viewerHeight:function(h){
if(h){
DA.session.Values.registerValue("viewerWindowHeight",h);
}
return DA.session.Values.getValue("viewerWindowHeight")||DA.vars.config.viewer_height;
},viewerOpen:function(fid,uid,srid){
var url;
if(DA.util.isEmpty(srid)){
url=DA.vars.cgiRdir+"/ajax_mailer.cgi?html=viewer&fid="+fid+"&uid="+uid;
}else{
url=DA.vars.cgiRdir+"/ajax_mailer.cgi?html=viewer&fid="+fid+"&uid="+uid+"&srid="+srid;
}
url+="&org_mail_gid="+OrgMailer.vars.org_mail_gid;
if(DA.vars.html&&DA.vars.html.viewer){
DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",this.viewerWidth(),this.viewerHeight()),url,DA.vars.html.viewer);
}else{
DA.windowController.winOpenNoBar(url,"",this.viewerWidth(),this.viewerHeight());
}
},editorWidth:function(w){
if(w){
DA.session.Values.registerValue("editorWindowWidth",w);
}
return DA.session.Values.getValue("editorWindowWidth")||DA.vars.config.editor_width;
},editorHeight:function(h){
if(h){
DA.session.Values.registerValue("editorWindowHeight",h);
}
return DA.session.Values.getValue("editorWindowHeight")||DA.vars.config.editor_height;
},editorOpen:function(proc,fid,uid,tid,_393){
var url=DA.vars.cgiRdir+"/ajax_mailer.cgi?html=editor&richtext=1";
if(!DA.util.isEmpty(proc)){
url+="&proc="+proc;
}
if(!DA.util.isEmpty(fid)){
url+="&fid="+fid+"&uid="+uid;
}
if(!DA.util.isEmpty(tid)){
url+="&tid="+tid;
}
if(!DA.util.isEmpty(_393)){
url+="&quote="+_393;
}
url+="&org_mail_gid="+OrgMailer.vars.org_mail_gid;
if(DA.vars.html&&DA.vars.html.editor){
DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",this.editorWidth(),this.editorHeight()),url,DA.vars.html.editor);
}else{
DA.windowController.winOpenNoBar(url,"",this.editorWidth(),this.editorHeight());
}
},editorOpenBackUp:function(proc,fid,uid,_398,_399){
var url=DA.vars.cgiRdir+"/ajax_mailer.cgi?html=editor&richtext=1";
if(!DA.mailer.windowController.backup_reopenable(proc,fid,uid)){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_EDIT_REOPEN_ERROR"));
return;
}
if(!DA.util.isEmpty(proc)){
url+="&proc="+proc;
}
if(!DA.util.isEmpty(fid)){
url+="&fid="+fid+"&uid="+uid;
}
if(!DA.util.isEmpty(_398)){
url+="&backup_maid="+_398;
}
if(!DA.util.isEmpty(_399)){
url+="&backup_org_clrRdir="+_399;
}
url+="&org_mail_gid="+OrgMailer.vars.org_mail_gid;
if(DA.vars.html&&DA.vars.html.editor){
DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",this.editorWidth(),this.editorHeight()),url,DA.vars.html.editor);
}else{
DA.windowController.winOpenNoBar(url,"",this.editorWidth(),this.editorHeight());
}
},backup_reopenable:function(proc,fid,uid){
var _39e,_39f,_3a0;
var i=0;
var flag=true;
if(!DA.util.isEmpty(fid)&&!DA.util.isEmpty(window.__folderTree.backupFolderFid)&&fid===window.__folderTree.backupFolderFid.toString()&&proc==="edit"){
_39e=window.DA.windowController.data;
if(!DA.util.isUndefined(_39e)){
for(i=0;i<_39e.length;i++){
try{
_39f=_39e[i];
}
catch(e){
continue;
}
if(!DA.util.isUndefined(_39f)&&!_39f.closed){
if(DA.util.isUndefined(_39f.__messageEditor)){
continue;
}
_3a0=_39f.__messageEditor.backup_maid;
if(!DA.util.isEmpty(uid)&&!DA.util.isEmpty(_3a0)&&uid.toString()===_3a0.toString()){
flag=false;
break;
}
}
}
}
}
return flag;
},editorOpen4url:function(url,_3a4,_3a5){
url=url.replace(/&external\=\d/,"");
if(DA.vars.html&&DA.vars.html.editor){
DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",DA.mailer.windowController.editorWidth(),DA.mailer.windowController.editorHeight()),url,DA.vars.html.editor);
}else{
DA.windowController.winOpenNoBar(url,"",_3a4,_3a5);
}
},searcherOpen:function(fid){
var _3a7="width=800,height=600"+",resizable=yes,scrollbars=yes,location=no"+",menubar=no,toolbar=no,statusbar=no";
var url=DA.vars.cgiRdir+"/ajax_mailer.cgi?html=searcher&search=1&fid="+fid;
url+="&org_mail_gid="+OrgMailer.vars.org_mail_gid;
if(DA.vars.html&&DA.vars.html.searcher){
DA.mailer.windowController.documentWrite(DA.windowController.winOpenCustom("","",_3a7),url,DA.vars.html.searcher);
}else{
DA.windowController.winOpenCustom(url,"",_3a7);
}
},documentWrite:function(obj,url,html){
html=html.replace(/\<\!\-\- requestUrl \-\-\>/,url);
obj.document.open();
obj.document.write(html);
obj.document.close();
}};
DA.mailer.checkSession=function(){
if(BrowserDetect.browser==="Explorer"&&typeof (window.opener)==="object"&&typeof (window.opener.DA)==="object"&&typeof (window.opener.DA.session)==="object"){
try{
DA.session.Values.getValue();
}
catch(e){
DA.session=window.opener.DA.session;
}
}else{
if(BrowserDetect.browser!=="Explorer"&&window.opener&&window.opener.DA&&window.opener.DA.session){
try{
DA.session.Values.getValue();
}
catch(e){
DA.session=window.opener.DA.session;
}
}else{
try{
DA.session.Values.getValue();
}
catch(e){
(function(){
var _3ac=$H({});
var _3ad=$H({});
function _getStateInfo(w){
if("function"!==typeof w.getUIStateInfo){
return;
}
return w.getUIStateInfo();
}
DA.session={Values:{registerValue:function(name,_3b0){
_3ad[name]=_3b0;
},getValue:function(name){
return _3ad[name];
}},UIState:{registerWidget:function(name,_3b3){
_3ac[name]=_3b3;
},getStateInfo:function(name){
var w=_3ac[name];
if(!w){
return;
}
return _getStateInfo(w);
},getAllStateInfo:function(){
return _3ac.map(function(ent){
return {name:ent.key,info:_getStateInfo(ent.value)};
});
}}};
})();
}
}
}
};
if(!OrgMailer.vars.is_mail_box&&BrowserDetect.browser==="Explorer"&&typeof (window.opener)==="object"&&typeof (window.opener.DA)==="object"&&typeof (window.opener.DA.mailer)==="object"&&typeof (window.opener.DA.mailer.Events)==="object"){
DA.mailer.Events=window.opener.DA.mailer.Events;
}else{
if(!OrgMailer.vars.is_mail_box&&BrowserDetect.browser!=="Explorer"&&window.opener&&window.opener.DA&&window.opener.DA.mailer&&window.opener.DA.mailer.Events){
DA.mailer.Events=window.opener.DA.mailer.Events;
}else{
DA.mailer.Events={onMessagesMoving:new YAHOO.util.CustomEvent("onMessagesMoving"),onMessagesMoved:new YAHOO.util.CustomEvent("onMessagesMoved"),onMessagesMoveFailure:new YAHOO.util.CustomEvent("onMessagesMoveFailure"),onMessageSent:new YAHOO.util.CustomEvent("onMessageSent"),onMessageSaved:new YAHOO.util.CustomEvent("onMessageSaved"),onMessagesFiltering:new YAHOO.util.CustomEvent("onMessagesFiltering"),onMessagesFiltered:new YAHOO.util.CustomEvent("onMessagesFiltered"),onMessagesFilterFailure:new YAHOO.util.CustomEvent("onMessagesFilterFailure"),onMboxGridLoadRows:new YAHOO.util.CustomEvent("onMboxGridLoadRows"),onMessagesDragOut:new YAHOO.util.CustomEvent("onMessagesDragOut"),onMessagesDragEnter:new YAHOO.util.CustomEvent("onMessagesDragEnter"),onFolderTreeReady:new YAHOO.util.CustomEvent("onFolderTreeReady"),onMessageMoveRequest:new YAHOO.util.CustomEvent("onMessageMoveRequest"),onMessageRead:new YAHOO.util.CustomEvent("onMessageRead"),onMessageFlagRequest:new YAHOO.util.CustomEvent("onMessageFlagRequest"),onMessagesFlagging:new YAHOO.util.CustomEvent("onMessagesFlagging"),onMessagesFlagged:new YAHOO.util.CustomEvent("onMessagesFlagged"),onMessagesFlagFailure:new YAHOO.util.CustomEvent("onMessagesFlagFailure")};
}
}
var Pop4Ajax=DA.mailer.windowController.editorOpen4url;
(function(){
var _3b7=new YAHOO.util.CustomEvent("unimplemented");
_3b7.subscribe(function(type,args){
});
DA.mailer.util.AbstMsgProc=function(){
};
DA.mailer.util.AbstMsgProc.prototype={_serialNo:0,_utils:{asFidColonUid:function(m){
return m.fid+":"+m.uid;
},asFidColonUidRange:function(r){
return r.start.fid+":"+r.start.uid+"-"+r.end.fid+":"+r.end.uid;
}},proc:function(_3bc,_3bd,_3be){
if(!_3bc.count){
return;
}
var _3bf=_3bc.singles.map(this._utils.asFidColonUid);
var _3c0=_3bc.ranges.map(this._utils.asFidColonUidRange);
var _3c1=Object.extend(_3bd||{},{uid:_3bf.join(","),area:_3c0.join(",")});
++this._serialNo;
var _3c2=this._serialNo;
var _3c3=this.evtDone;
var _3c4=this.evtDoing;
var _3c5=this.evtFailure;
this.io.execute(_3c1,{callback:function(_3c6){
if(!DA.mailer.util.checkResult(_3c6)){
_3c5.fire(_3c2,_3be,_3c6);
}
_3c3.fire(_3c2,_3be,_3c6);
},errorHandler:function(e){
_3c5.fire(_3c2,_3be,e);
}});
window.setTimeout(function(){
_3c4.fire(_3c2,_3be);
},10);
},mockProc:function(_3c8,_3c9){
++this._serialNo;
var _3ca=this._serialNo;
this.evtDoing.fire(_3ca,_3c8);
this.evtDone.fire(_3ca,_3c8,_3c9);
},evtDoing:_3b7,evtDone:_3b7,evtFailure:_3b7,io:null};
DA.mailer.util.MessageMover=function(){
this.io=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi",{proc:"move"});
};
YAHOO.lang.extend(DA.mailer.util.MessageMover,DA.mailer.util.AbstMsgProc,{trashFid:0,move:function(_3cb){
if(!_3cb){
throw "No params to move";
}
if(!_3cb.messages||!_3cb.target||!(_3cb.target.fid||(_3cb.target.trash===true))){
throw "Invalid/Insufficient params to move:"+$H(_3cb).inspect();
}
var _3cc=_3cb.messages.fid;
if(DA.util.cmpNumber(_3cc,_3cb.target.fid)){
return;
}
var _3cd=_3cb.target.trash===true?this.trashFid:_3cb.target.fid;
var _3ce={fid:_3cc};
if(_3cb.messages.srid){
_3ce.srid=_3cb.messages.srid;
}
_3ce.extend((_3cb.target.trash&&this.reallyDelete(_3cc))?{proc:"delete"}:{proc:"move",target_fid:_3cd});
this.proc(_3cb.messages,_3ce,_3cb);
},reallyDelete:function(_3cf){
if(!_3cf){
return false;
}
if(parseInt(_3cf,10)===parseInt(this.trashFid,10)){
return true;
}
return DA.vars.config["delete"]===1;
},mockMove:function(_3d0,_3d1){
this.mockProc(_3d0,_3d1);
},evtDoing:DA.mailer.Events.onMessagesMoving,evtDone:DA.mailer.Events.onMessagesMoved,evtFailure:DA.mailer.Events.onMessagesMoveFailure});
DA.mailer.util.MessageFlagger=function(){
this.io=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_flag.cgi");
};
YAHOO.lang.extend(DA.mailer.util.MessageFlagger,DA.mailer.util.AbstMsgProc,{flag:function(_3d2){
var _3d3,_3d4;
if(!_3d2||!this._isValidProp(_3d3=_3d2.property)||!(_3d4=_3d2.messages)){
return;
}
var _3d5={proc:(_3d2.state===false)?"un"+_3d3:_3d3,fid:_3d4.fid};
if(_3d4.srid){
_3d5.srid=_3d4.srid;
}
this.proc(_3d4,_3d5,_3d2);
},mockFlag:function(_3d6,_3d7){
this.mockProc(_3d6,_3d7);
},_isValidProp:function(_3d8){
return YAHOO.lang.isString(_3d8)&&(_3d8==="seen"||_3d8==="flagged");
},evtDoing:DA.mailer.Events.onMessagesFlagging,evtDone:DA.mailer.Events.onMessagesFlagged,evtFailure:DA.mailer.Events.onMessagesFlagFailure});
})();
(function(){
var _3d9=false;
var _3da={};
var _3db={move:function(){
}};
var _3dc={flag:function(){
}};
var _3dd=YAHOO.lang.isArray;
function deepCopy(o){
var _3df=arguments[1]||0;
++_3df;
if(_3df>10){
return {};
}
if(o===null||typeof o!=="object"){
return o;
}
var ret,i,len,val;
if(_3dd(o)){
ret=[];
len=o.length;
for(i=0;i<len;++i){
ret[i]=deepCopy(o[i],_3df);
}
}else{
ret={};
$H(o).each(function(item,i){
ret[item.key]=deepCopy(item.value);
});
}
return ret;
}
function mkMsgColl(_3e6){
return {fid:_3e6.fid,count:1,singles:[_3e6],single:_3e6,ranges:[],identity:{}};
}
function mkSubs(f){
return function(type,args){
if(!args||!args[0]){
return;
}
return f(args[0]);
};
}
var E=DA.mailer.Events;
if(!E){
return;
}
function setupPlumbing(app){
E.onFolderTreeReady.subscribe(mkSubs(function(_3ec){
["trash","sent","draft","backupFolder"].each(function(_3ed){
var prop=_3ed+"Fid";
var id=parseInt(_3ec[prop],10);
if(YAHOO.lang.isNumber(id)){
_3da[prop]=id;
_3db[prop]=id;
}else{
}
});
}));
E.onMessageMoveRequest.subscribe(mkSubs(function(o){
var myo=deepCopy(o);
setTimeout(function(){
_3db.move(myo);
},10);
}));
E.onMessageFlagRequest.subscribe(mkSubs(function(o){
var myo=deepCopy(o);
setTimeout(function(){
_3dc.flag(myo);
},10);
}));
function mkSentOrSavedHandler(_3f4){
return function(type,args){
var _3f7=args[0];
var resp=args[1];
if(!_3f7||!resp){
return;
}
_3f7=deepCopy(_3f7);
resp=deepCopy(resp);
if(_3f7.mode!==0){
_3f7.originuid=_3f7.uid;
}
var req={messages:mkMsgColl(_3f7),target:{fid:_3da[_3f4]}};
var _3fa=parseInt(_3f7.fid,10);
if(_3fa!==_3da.draftFid&&_3fa!==_3da.sentFid&&_3fa!==_3da.backupFolderFid&&_3fa!==_3da.localFolderFid){
req.messages.single.uid=0;
}
window.__mboxGrid.refreshGrid();
setTimeout(function(){
_3db.mockMove(req,resp);
},10);
};
}
E.onMessageSent.subscribe(mkSentOrSavedHandler("sentFid"),app,true);
E.onMessageSaved.subscribe(mkSentOrSavedHandler("draftFid"),app,true);
}
DA.mailer.Application={init:function(){
if(_3d9){
return;
}
_3db=new DA.mailer.util.MessageMover();
_3dc=new DA.mailer.util.MessageFlagger();
setupPlumbing(this);
_3d9=true;
return this;
}};
})();
DA.widget.PopupMenuController=function(_3fb,_3fc,_3fd,_3fe){
this.popupId=_3fb;
this.triggerId=_3fc;
this.triggerNode=YAHOO.util.Dom.get(_3fc);
this.menuData=_3fd;
if(DA.util.isFunction(_3fe.onTrigger)){
this.onTrigger=_3fe.onTrigger;
}
this.init();
};
DA.widget.PopupMenuController.prototype={popupId:null,popupNode:null,triggerId:null,triggerNode:null,menuData:null,itemData:null,popupMenu:null,onTrigger:Prototype.emptyFunction,init:function(){
this.popupNode=DA.dom.createDiv(this.popupId);
this.popupNode.style.visibility="hidden";
YAHOO.util.Dom.addClass(this.popupNode,"da_popupMenu"+this._className());
YAHOO.util.Event.addListener(window.document,"click",this._onTrigger,this,true);
YAHOO.util.Event.addListener(window.document,"contextmenu",this.cancel,this,true);
},_onTrigger:function(e){
if(DA.event.onClick(e)){
if(this.onTrigger(e)){
this.position(e.clientX+1,e.clientY+1);
this.show();
}else{
this.cancel();
}
}else{
this.cancel();
}
},_onClick:function(e){
var el=YAHOO.util.Event.getTarget(e);
var func;
if(el&&el.id&&el.id.match(/MenuItem\_([^\_]+)\_[^\_]+$/)){
func=RegExp.$1;
if(!this._disabled(func)){
this._onclick(func)(e,this._args(func));
}
}
},_className:function(){
if(DA.util.isEmpty(this.menuData.className)){
return "";
}else{
return " "+this.menuData.className;
}
},_func:function(i,j){
return this.menuData.order[i][j];
},_id:function(func){
return this.popupId+"MenuItem_"+func;
},_text:function(func){
return this.menuData.items[func].text;
},_title:function(func){
return this.menuData.items[func].title;
},_onclick:function(func){
return this.menuData.items[func].onclick;
},_args:function(func){
return this.menuData.items[func].args;
},_selected:function(func){
if(DA.util.isEmpty(this.menuData.items[func].selected)){
return false;
}else{
return this.menuData.items[func].selected;
}
},_disabled:function(func){
if(DA.util.isEmpty(this.menuData.items[func].disabled)){
return false;
}else{
return this.menuData.items[func].disabled;
}
},_hidden:function(func){
if(DA.util.isEmpty(this.menuData.items[func].hidden)){
return false;
}else{
return this.menuData.items[func].hidden;
}
},text:function(func,text){
this.menuData.items[func].text=text;
},onclick:function(func,_410){
this.menuData.items[func].onclick=_410;
},args:function(func,args){
this.menuData.items[func].args=args;
},enabled:function(func){
this.menuData.items[func].disabled=false;
},disabled:function(func){
this.menuData.items[func].disabled=true;
},visible:function(func){
this.menuData.items[func].hidden=false;
},hidden:function(func){
this.menuData.items[func].hidden=true;
},show:function(){
var i,j,l,s,d,t,ti,_41e;
var me=this;
var html="<div oncontextmenu=\"return false;\">";
var _421,_422,node;
var _424,_425;
var _426="this.style.background='#e0e0e0'";
var _427="this.style.background='#efefef fixed top'";
_421=this.menuData.order.length;
if(DA.vars.custom.menu.setPopupMenu){
eval(DA.vars.custom.menu.setPopupMenu);
}
for(i=0;i<_421;i++){
l="";
_422=this.menuData.order[i].length;
for(j=0;j<_422;j++){
if(!this._hidden(this._func(i,j))){
s=(this._selected(this._func(i,j)))?" selected":"";
d=(this._disabled(this._func(i,j)))?" disabled":"";
t=(this.menuData.encode===false)?this._text(this._func(i,j)):DA.util.encode(this._text(this._func(i,j)));
if(this.menuData.className==="da_messageViewerHeaderAttachmentPulldownMenu"){
ti=(this.menuData.encode===false)?this._title(this._func(i,j)):DA.util.encode(this._title(this._func(i,j)));
_41e="title=\""+ti+"\"";
}
l+="<li id=\""+this._id(this._func(i,j))+"_li\" class=\"da_popupMenuItem"+s+d+this._className()+"\""+_41e+">"+"<a id=\""+this._id(this._func(i,j))+"_a\" class=\""+s+d+"\">"+t+"</a>"+"</li>";
}
}
if((this.menuData.className==="da_messageViewerHeaderAttachmentPulldownMenu")&&DA.vars.config.soft_install===1){
if(_422>=2){
_424=this.menuData.items[0].args.toString();
_425=_424.replace(/(.;)/g,", 'all'$1");
l+="</ul><ul><li id=\"message_headerAttachmentIconPopupMenuItem_downAll_li\" class=\"da_popupMenuItem\" "+"onmouseover=\""+_426+";\""+"onmouseout=\""+_427+";\" onclick=\""+_425+"\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/ico_fc_download.gif","",{align:"absmiddle"})+DA.locale.GetText.t_("B_DOWNLOAD")+"</li>";
}
l+="<li id=\"message_headerAttachmentIconPopupMenuItem_saveAttaches_li\" class=\"da_popupMenuItem\" "+"onmouseover=\""+_426+";\""+"onmouseout=\""+_427+";\" onclick=\"window.__messageViewer.showsaveattachestolibdialog(event.clientX,event.clientY);\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/ico_fc_docsave.gif","",{align:"absmiddle"})+DA.locale.GetText.t_("MESSAGE_SAVEATTACHESTOLIB_MENU")+"</li>";
}
if(!DA.util.isEmpty(l)){
html+="<ul>"+l+"</ul>";
}
}
html+="</div>";
this.popupNode.innerHTML=html;
_421=this.menuData.order.length;
for(i=0;i<_421;i++){
_422=this.menuData.order[i].length;
for(j=0;j<_422;j++){
if(!this._hidden(this._func(i,j))&&!this._disabled(this._func(i,j))){
node=YAHOO.util.Dom.get(this._id(this._func(i,j))+"_li");
node.onmouseover=function(e){
YAHOO.util.Dom.addClass(this,"selected");
};
node.onmouseout=function(e){
YAHOO.util.Dom.removeClass(this,"selected");
};
YAHOO.util.Event.addListener(node,"click",this._onClick,this,true);
}
}
}
this.adjustPosition();
DA.shim.open(this.popupNode);
this.popupNode.style.visibility="";
},cancel:function(){
if(this.visibility()){
this.popupNode.style.visibility="hidden";
DA.shim.close(this.popupNode);
this.onCancel();
}
},onCancel:Prototype.emptyFunction,position:function(x,y){
DA.dom.position(this.popupNode,x,y);
},adjustPosition:function(){
DA.dom.adjustPosition(this.popupNode);
},visibility:function(){
if(this.popupNode.style.visibility==="hidden"){
return false;
}else{
return true;
}
}};
DA.widget.PopupMenuNoTrigger=function(_42c,_42d,_42e){
this.popupId=_42c;
this.menuData=_42d;
if(DA.util.isFunction(_42e.onTrigger)){
this.onTrigger=_42e.onTrigger;
}
this.init();
};
Object.extend(DA.widget.PopupMenuNoTrigger.prototype,DA.widget.PopupMenuController.prototype);
DA.widget.PopupMenuNoTrigger.prototype.init=function(){
this.popupNode=DA.dom.createDiv(this.popupId);
this.popupNode.style.visibility="hidden";
YAHOO.util.Dom.addClass(this.popupNode,"da_popupMenu"+this._className());
YAHOO.util.Event.addListener(window.document,"click",this._onTrigger,this,true);
YAHOO.util.Event.addListener(window.document,"contextmenu",this.cancel,this,true);
DA.widget.PopupMenuManager.registMenu(this.popupId,this);
};
DA.widget.PopupMenuNoTrigger.prototype._onTrigger=function(e){
if(!DA.event.onClick(e)||!this.onTrigger(e)){
this.cancel();
}
};
DA.widget.ContextMenuController=function(_430,_431,_432,_433){
this.popupId=_430;
this.triggerId=_431;
this.triggerNode=YAHOO.util.Dom.get(_431);
this.menuData=_432;
if(DA.util.isFunction(_433.onTrigger)){
this.onTrigger=_433.onTrigger;
}
if(DA.util.isFunction(_433.onCancel)){
this.onCancel=_433.onCancel;
}
this.init();
};
Object.extend(DA.widget.ContextMenuController.prototype,DA.widget.PopupMenuController.prototype);
DA.widget.ContextMenuController.prototype.init=function(){
this.popupNode=DA.dom.createDiv(this.popupId);
this.popupNode.style.visibility="hidden";
YAHOO.util.Dom.addClass(this.popupNode,"da_popupMenu"+this._className());
if(BrowserDetect.browser==="Explorer"){
YAHOO.util.Event.addListener(window.document,"contextmenu",this._onTrigger,this,true);
YAHOO.util.Event.addListener(window.document,"click",this.cancel,this,true);
}else{
YAHOO.util.Event.addListener(window.document,"click",this._onTrigger,this,true);
}
DA.widget.PopupMenuManager.registMenu(this.popupId,this);
};
DA.widget.ContextMenuController.prototype._onTrigger=function(e){
if(DA.event.onContextMenu(e)){
if(this.onTrigger(e)){
this.position(e.clientX+1,e.clientY+1);
this.show();
}else{
this.cancel();
}
}else{
this.cancel();
}
};
DA.widget.PulldownMenuController=function(_435,_436,_437,_438){
this.popupId=_435;
this.triggerId=_436;
this.triggerNode=YAHOO.util.Dom.get(_436);
this.menuData=_437;
if(DA.util.isFunction(_438.onTrigger)){
this.onTrigger=_438.onTrigger;
}
this.init();
};
Object.extend(DA.widget.PulldownMenuController.prototype,DA.widget.PopupMenuController.prototype);
DA.widget.PulldownMenuController.prototype.init=function(){
this.popupNode=DA.dom.createDiv(this.popupId);
this.popupNode.style.visibility="hidden";
YAHOO.util.Dom.addClass(this.popupNode,"da_popupMenu"+this._className());
YAHOO.util.Event.addListener(window.document,"click",this._onTrigger,this,true);
YAHOO.util.Event.addListener(window.document,"contextmenu",this.cancel,this,true);
DA.widget.PopupMenuManager.registMenu(this.popupId,this);
};
DA.widget.PulldownMenuController.prototype._onTrigger=function(e){
if(DA.event.onClick(e)){
if(this.onTrigger(e)){
if(this.visibility()){
this.cancel();
}else{
this.position(e.clientX+1,e.clientY+1);
this.show();
}
}else{
this.cancel();
}
}else{
this.cancel();
}
};
DA.widget.PopupMenuManager={data:{},registMenu:function(id,r){
this.data[id]=r;
},allCancel:function(){
var id;
for(id in this.data){
if(!DA.util.isFunction(this.data[id])){
this.data[id].cancel();
}
}
}};
DA.ug={list2String:function(_43d,cols,max){
var i,l,u,e;
var _444="";
if(DA.util.isEmpty(cols)){
cols=3;
}
if(_43d){
for(i=0;i<_43d.length;i++){
l="";
e="";
u=_43d[i];
if(DA.util.isEmpty(u.name)){
if(DA.util.isEmpty(u.email)){
continue;
}else{
l=DA.util.encode(u.email);
}
}else{
if(DA.util.isEmpty(u.title)){
l=DA.util.encode(u.name);
}else{
if(u.title_pos===1){
l=DA.util.encode(u.title+u.name);
}else{
l=DA.util.encode(u.name+u.title);
}
}
if(!DA.util.isEmpty(u.email)){
l+="&nbsp;"+DA.util.encode("<"+u.email+">");
}
}
if(u.external===1){
e=" da_ugInfromationListExternal";
}
if(!DA.util.isEmpty(u.link)){
l="<span onclick=\""+u.link+"\" class=\"da_ugInformationListLink"+e+"\">"+l+"</span>";
}else{
l="<span class=\"da_ugInformationListNoLink"+e+"\">"+l+"</span>";
}
if(!DA.util.isEmpty(u.icon)){
l=DA.imageLoader.tag(u.icon,u.alt,{align:"absmiddle"})+l;
}
if(!DA.util.isEmpty(u.regist)){
l+="<span onclick=\""+u.regist+"\" class=\"da_ugInformationListLink\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/ico_adradd.gif","",{align:"absmiddle"})+"</span>";
}
if(!DA.util.isEmpty(l)){
if(DA.util.isNumber(max)&&i+1>=max){
_444+="<span style=\"white-space: nowrap;\">"+l+"&nbsp;<b>..</b></span>\n";
break;
}else{
_444+="<span style=\"white-space: nowrap;\">"+l+"&nbsp;</span>\n";
}
if(cols>0&&(i+1)%cols===0){
_444+="<br>";
}
}
}
}
return _444;
},openAddrInfo:function(id,_446){
var Ids=id.split("-");
var _448="aInfo"+Ids[0];
if(!_446){
DA.windowController.winOpenCustom(DA.vars.cgiRdir+"/og_card_addr.cgi?id="+id,_448,"width=450,height=600,resizable=yes,scrollbars=yes");
}else{
DA.windowController.winOpenCustom(DA.vars.cgiRdir+"/og_card_addr.cgi?id="+id,"","width=450,height=600,resizable=yes,scrollbars=yes");
}
},openUserInfo:function(mid,type,_44b){
if(DA.util.isEmpty(type)){
type="addr";
}
var cgi="/info_card.cgi?type="+type+"&id="+mid;
var _44d="Info"+mid;
if(!_44b){
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,_44d,"width=480,height=600,resizable=yes,scrollbars=yes");
}else{
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,"","width=480,height=600,resizable=yes,scrollbars=yes");
}
},openGroupInfo:function(gid,_44f){
var cgi="/info_card.cgi?type=group&id="+gid;
var _451="gInfo"+gid;
if(!_44f){
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,_451,"width=500,height=480,resizable=yes,scrollbars=yes");
}else{
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,"","width=500,height=480,resizable=yes,scrollbars=yes");
}
},openMLInfo:function(mlid,_453){
var Proc="ml_card.cgi%3fl="+mlid;
var Img="pop_title_mlinfo.gif";
DA.windowController.isePopup(Proc,Img,500,500,"",1);
},openBulkInfo:function(id,_457){
var Proc="address_card.cgi%3fid="+id;
var Img="pop_title_mladinfo.gif";
DA.windowController.isePopup(Proc,Img,650,600,"",1);
},openAddrRegist:function(NAME,_45b){
var Proc="ma_ajx_addr_regist.cgi%3fname="+encodeURIComponent(encodeURIComponent(NAME))+"%20email="+encodeURIComponent(encodeURIComponent(_45b));
var Img="pop_title_regaddress.gif";
if(DA.vars.custom.threePane.setAddressInsertProc){
eval(DA.vars.custom.threePane.setAddressInsertProc);
}
DA.windowController.isePopup(Proc,Img,600,400,"",1);
}};
DA.ug.InformationListController=function(node,_45f,_460,cfg){
this.ugNode=node;
if(_460){
if(DA.util.isFunction(_460.onRemove)){
this.onRemove=_460.onRemove;
}
if(DA.util.isFunction(_460.onPopup)){
this.onPopup=_460.onPopup;
}
}
if(cfg){
if(cfg.maxView){
this.maxView=cfg.maxView;
}
if(cfg.lineHeight){
this.lineHeight=cfg.lineHeight;
}
if(cfg.registEnabled){
this.registEnabled=cfg.registEnabled;
}
if(cfg.popupEnabled){
this.popupEnabled=cfg.popupEnabled;
}
if(cfg.deleteEnabled){
this.deleteEnabled=cfg.deleteEnabled;
}
}
this.init(_45f);
};
DA.ug.InformationListController.prototype={ugNode:null,ugData:null,ugNdata:null,sno:1,onRemove:Prototype.emptyFunction,onPopup:Prototype.emptyFunction,maxView:0,lineHeight:0,registEnabled:false,popupEnabled:true,deleteEnabled:true,beforeInsertScrollTop:0,init:function(_462){
this.ugNode.style.display="none";
this.ugData={};
this.ugNdata={};
this.addList(_462);
},add:function(u,_464,perf){
var l={};
var n={};
var me=this;
if(!u){
return;
}
if(DA.util.isEmpty(u.name)&&DA.util.isEmpty(u.email)){
return;
}
var sno=this.sno++;
n.lineNode=document.createElement("div");
n.iconNode=document.createElement("span");
n.nameNode=document.createElement("span");
n.emailNode=document.createElement("span");
n.title0Node=document.createElement("span");
n.title1Node=document.createElement("span");
n.popupNode=document.createElement("span");
n.registNode=document.createElement("span");
n.deleteNode=document.createElement("span");
n.lineNode.id="da_ugInformationList"+me.ugNode.id.split("Item")[1]+"LineId_"+sno;
n.lineNode.className="da_ugInformationListLine da_ugInformationListLineSno_"+sno+" da_ugInformationListDragDrop_"+sno;
n.iconNode.className="da_ugInformationListIcon "+"da_ugInformationListDragDrop_"+sno;
n.nameNode.className="da_ugInformationListName "+"da_ugInformationListDragDrop_"+sno;
n.emailNode.className="da_ugInformationListEmail "+"da_ugInformationListDragDrop_"+sno;
n.title0Node.className="da_ugInformationListTitle";
n.title1Node.className="da_ugInformationListTitle";
n.popupNode.className="da_ugInformationListPopup";
n.registNode.className="da_ugInformationListRegist";
n.deleteNode.className="da_ugInformationListDelete";
n.lineNode.appendChild(n.iconNode);
n.lineNode.appendChild(n.title1Node);
n.lineNode.appendChild(n.nameNode);
n.lineNode.appendChild(n.title0Node);
n.lineNode.appendChild(n.emailNode);
n.lineNode.appendChild(n.popupNode);
n.lineNode.appendChild(n.deleteNode);
this.ugData[sno]=l;
this.ugNdata[sno]=n;
this.id(sno,u.id);
this.type(sno,u.type);
this.lang(sno,u.lang);
this.icon(sno,u.icon,u.alt);
this.name(sno,u.name);
this.title(sno,u.title,u.title_pos);
this.email(sno,u.email||u.keitai_mail||u.pmail1||u.pmail2);
this.link(sno,u.link);
this.regist(sno,u.regist);
this.popup(sno);
this["delete"](sno);
this.linkStyle(sno);
this.ugNode.appendChild(n.lineNode);
eval("DA.mailer.MessageEditor.prototype.dropAddress"+sno+"To = setInterval(function(){return new YAHOO.util.DDTarget(\"da_ugInformationList"+me.ugNode.id.split("Item")[1]+"LineId_"+sno+"\",\"editorAddress\")},1000)");
if(perf!==true){
this.ugNode.style.display="block";
this.lineHeight=this.height(sno);
if(this.lineHeight>DA.dom.height("da_messageEditorItemToText")&&DA.dom.height("da_messageEditorItemToText")>=19){
this.lineHeight=DA.dom.height("da_messageEditorItemToText")-2;
}
}
if(!_464){
this.resize();
this.scroll();
}
},insertToTop:function(u,_46b){
var l={};
var n={};
var me=this;
if(!u){
return;
}
if(DA.util.isEmpty(u.name)&&DA.util.isEmpty(u.email)){
return;
}
var sno=this.sno++;
if(_46b!==0){
delete this.ugData[_46b];
}
var _470=this.ugData;
this.ugNode.innerHTML="";
this.ugNode.style.display="none";
this.ugData={};
this.ugNdata={};
n.lineNode=document.createElement("div");
n.iconNode=document.createElement("span");
n.nameNode=document.createElement("span");
n.emailNode=document.createElement("span");
n.title0Node=document.createElement("span");
n.title1Node=document.createElement("span");
n.popupNode=document.createElement("span");
n.registNode=document.createElement("span");
n.deleteNode=document.createElement("span");
n.lineNode.id="da_ugInformationList"+me.ugNode.id.split("Item")[1]+"LineId_"+sno;
n.lineNode.className="da_ugInformationListLine da_ugInformationListLineSno_"+sno+" da_ugInformationListDragDrop_"+sno;
n.iconNode.className="da_ugInformationListIcon "+"da_ugInformationListDragDrop_"+sno;
n.nameNode.className="da_ugInformationListName "+"da_ugInformationListDragDrop_"+sno;
n.emailNode.className="da_ugInformationListEmail "+"da_ugInformationListDragDrop_"+sno;
n.title0Node.className="da_ugInformationListTitle";
n.title1Node.className="da_ugInformationListTitle";
n.popupNode.className="da_ugInformationListPopup";
n.registNode.className="da_ugInformationListRegist";
n.deleteNode.className="da_ugInformationListDelete";
n.lineNode.appendChild(n.iconNode);
n.lineNode.appendChild(n.title1Node);
n.lineNode.appendChild(n.nameNode);
n.lineNode.appendChild(n.title0Node);
n.lineNode.appendChild(n.emailNode);
n.lineNode.appendChild(n.popupNode);
n.lineNode.appendChild(n.deleteNode);
this.ugData[sno]=l;
this.ugNdata[sno]=n;
this.id(sno,u.id);
this.type(sno,u.type);
this.lang(sno,u.lang);
this.icon(sno,u.icon,u.alt);
this.name(sno,u.name);
this.title(sno,u.title,u.title_pos);
this.email(sno,u.email||u.keitai_mail||u.pmail1||u.pmail2);
this.link(sno,u.link);
this.regist(sno,u.regist);
this.popup(sno);
this["delete"](sno);
this.linkStyle(sno);
this.ugNode.appendChild(n.lineNode);
eval("DA.mailer.MessageEditor.prototype.dropAddress"+sno+"To = setInterval(function(){new YAHOO.util.DDTarget(\"da_ugInformationList"+me.ugNode.id.split("Item")[1]+"LineId_"+sno+"\",\"editorAddress\")},1000)");
var _471=[];
var _472=0;
for(var i in _470){
if(_470[i]){
_471[_472++]=_470[i];
}
}
this.ugNode.style.display="block";
this.lineHeight=this.height(sno);
if(this.lineHeight>DA.dom.height("da_messageEditorItemToText")&&DA.dom.height("da_messageEditorItemToText")>=19){
this.lineHeight=DA.dom.height("da_messageEditorItemToText")-2;
}
if(!_471||!_471.length){
return;
}
var _474=_471.length;
for(i=0;i<_474;++i){
this.add(_471[i]);
}
this.resize();
this.scroll();
},insertAfterNode:function(u,_476,_477,_478){
var l={};
var n={};
var me=this;
if(!u){
return;
}
if(DA.util.isEmpty(u.name)&&DA.util.isEmpty(u.email)){
return;
}
if(_478==="true"){
delete this.ugData[_476];
delete this.ugNdata[_476];
}
var sno=this.sno++;
var _47d=this.ugData;
var _47e=this.ugNdata;
this.ugNode.innerHTML="";
this.ugNode.style.display="none";
this.ugData={};
this.ugNdata={};
var _47f=[];
var _480=0;
var _481=0;
var _482=0;
for(var i in _47d){
if(i.match(/^\d+$/)&&i>0){
if(_47d[i]){
if(_47e[i].lineNode.id!==_477){
_47f[_480++]=_47d[i];
_481++;
}else{
_47f[_480++]=_47d[i];
_47f[_480++]=u;
_482=_481;
}
}
}
}
if(_482>1){
this.beforeInsertScrollTop=(_482-1)*20;
}else{
this.beforeInsertScrollTop=0;
}
this.ugNode.style.display="block";
this.lineHeight=this.height(sno);
if(this.lineHeight>DA.dom.height("da_messageEditorItemToText")&&DA.dom.height("da_messageEditorItemToText")>=19){
this.lineHeight=DA.dom.height("da_messageEditorItemToText")-2;
}
if(!_47f||!_47f.length){
return;
}
var _484=_47f.length;
for(i=0;i<_484;++i){
this.add(_47f[i],true);
}
this.resize();
this.scrollTo(this.beforeInsertScrollTop);
},showAllAddress:function(){
var me=this;
var _486=this.list().length;
me.ugNode.style.height=(_486*18+10)+"px";
},addList:function(_487,perf){
if(!_487||!_487.length){
return;
}
var _489=_487.length;
var i;
if(perf===true){
this.ugNode.style.display="none";
}
for(i=0;i<_489;++i){
this.add(_487[i],true,perf);
}
this.resize();
this.scroll();
},linkStyle:function(sno){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
if(DA.util.isEmpty(l.link)){
YAHOO.util.Dom.removeClass([n.title1Node,n.nameNode,n.emailNode,n.title0Node],"da_ugInformationListLink");
YAHOO.util.Dom.addClass([n.title1Node,n.nameNode,n.emailNode,n.title0Node],"da_ugInformationListNoLink");
}else{
YAHOO.util.Dom.removeClass([n.title1Node,n.nameNode,n.emailNode,n.title0Node],"da_ugInformationListNoLink");
YAHOO.util.Dom.addClass([n.title1Node,n.nameNode,n.emailNode,n.title0Node],"da_ugInformationListLink");
}
},list:function(){
var sno;
var list=[];
for(sno in this.ugData){
if(sno.match(/^\d+$/)&&sno>0){
list.push($H(this.ugData[sno]));
}
}
return list;
},get:function(sno,key){
if(DA.util.isEmpty(key)){
return this.ugData[sno];
}else{
return this.ugData[sno][key];
}
},getNdata:function(sno){
return this.ugNdata[sno];
},width:function(sno){
if(this.ugNdata[sno]){
return DA.dom.width(this.ugNdata[sno].lineNode);
}else{
return 0;
}
},height:function(sno){
if(this.ugNdata[sno]){
return DA.dom.height(this.ugNdata[sno].lineNode);
}else{
return 0;
}
},count:function(){
var key,_496=0;
for(key in this.ugData){
if(!DA.util.isFunction(this.ugData[key])){
_496++;
}
}
return _496;
},resize:function(){
var _497;
var _498=0;
if(this.maxView>0){
_497=this.count();
if(_497>0){
if(this.ugNode.firstChild){
_498=this.ugNode.firstChild.offsetHeight;
}
if(this.lineHeight>_498){
_498=this.lineHeight;
}
if(_497>this.maxView){
YAHOO.util.Dom.addClass(this.ugNode,"da_ugInformationListOverflowAuto");
DA.dom.sizeHeight(this.ugNode,_498*this.maxView);
}else{
YAHOO.util.Dom.removeClass(this.ugNode,"da_ugInformationListOverflowAuto");
DA.dom.sizeHeight(this.ugNode,_498*_497);
}
this.ugNode.style.display="";
}else{
this.ugNode.style.display="none";
}
}
},dummy:function(sno){
var n=this.ugNdata[sno];
var html=n.iconNode.innerHTML+n.title1Node.innerHTML+n.nameNode.innerHTML+n.emailNode.innerHTML+n.title0Node.innerHTML;
return html;
},id:function(sno,id){
this.ugData[sno].id=(DA.util.isEmpty(id))?"":id;
},type:function(sno,type){
this.ugData[sno].type=(DA.util.isEmpty(type))?"":type;
},lang:function(sno,lang){
this.ugData[sno].lang=(DA.util.isEmpty(lang))?"ja":lang;
},icon:function(sno,icon,alt){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
if(DA.util.isEmpty(icon)){
l.icon="";
l.alt="";
n.iconNode.innerHTML="";
n.iconNode.style.display="none";
}else{
l.icon=icon;
l.alt=(DA.util.isEmpty(alt))?"":alt;
n.iconNode.innerHTML=DA.imageLoader.tag(icon,alt,{"class":"da_ugInformationListIconImage"});
n.iconNode.style.display="";
}
},name:function(sno,name,_4a9){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
if(DA.util.isEmpty(name)){
l.name="";
n.nameNode.innerHTML="";
n.nameNode.style.display="none";
}else{
l.name=name;
n.nameNode.innerHTML=DA.util.encode(name);
n.nameNode.style.display="";
}
if(_4a9){
this.email(sno,l.email);
}
},email:function(sno,_4ad){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
if(DA.util.isEmpty(_4ad)){
l.email="";
n.emailNode.innerHTML="";
n.emailNode.style.display="none";
}else{
l.email=_4ad;
if(DA.util.isEmpty(l.name)&&DA.util.isEmpty(l.title)){
n.emailNode.innerHTML=DA.util.encode(_4ad);
n.emailNode.style.display="";
}else{
n.emailNode.innerHTML="&nbsp;"+DA.util.encode("<"+_4ad+">");
n.emailNode.style.display="";
}
}
},title:function(sno,_4b1,_4b2,_4b3){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
if(DA.util.isEmpty(_4b1)){
l.title="";
l.title_pos=0;
n.title0Node.innerHTML="";
n.title1Node.innerHTML="";
n.title0Node.style.display="none";
n.title1Node.style.display="none";
}else{
l.title=_4b1;
l.title_pos=_4b2;
if(_4b2===1){
n.title0Node.innerHTML="";
n.title1Node.innerHTML=DA.util.encode(_4b1);
n.title0Node.style.display="none";
n.title1Node.style.display="";
}else{
n.title0Node.innerHTML=DA.util.encode(_4b1);
n.title1Node.innerHTML="";
n.title0Node.style.display="";
n.title1Node.style.display="none";
}
}
if(_4b3){
this.email(sno,l.email);
}
},link:function(sno,link){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
if(DA.util.isEmpty(link)){
l.link="";
n.nameNode.onclick=Prototype.emptyFunction;
n.emailNode.onclick=Prototype.emptyFunction;
n.title0Node.onclick=Prototype.emptyFunction;
n.title1Node.onclick=Prototype.emptyFunction;
}else{
l.link=link;
n.nameNode.onclick=function(e){
eval(link);
};
n.emailNode.onclick=function(e){
eval(link);
};
n.title0Node.onclick=function(e){
eval(link);
};
n.title1Node.onclick=function(e){
eval(link);
};
}
},regist:function(sno,_4bf){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
if(DA.util.isEmpty(_4bf)||!this.registEnabled){
l.regist="";
n.registNode.innerHTML="";
n.registNode.style.display="none";
}else{
l.regist=_4bf;
n.registNode.innerHTML=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_adradd.gif","",{"class":"da_ugInformationListRegist"});
n.registNode.onclick=function(){
eval(_4bf);
};
n.registNode.style.display="";
}
},popup:function(sno){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
var me=this;
if(String(sno).match(/^\d+$/)&&this.popupEnabled){
n.popupNode.innerHTML=DA.imageLoader.tag(DA.vars.imgRdir+"/scroll_btn_down02.gif","",{"class":"da_ugInformationListPopup"});
n.popupNode.onclick=function(e){
me.onPopup(DA.event.get(e),sno);
};
n.popupNode.style.display="";
}else{
n.popupNode.style.display="none";
}
},"delete":function(sno){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
var me=this;
if(String(sno).match(/^\d+$/)&&this.deleteEnabled){
n.deleteNode.innerHTML=DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_close_s.gif","",{"class":"da_ugInformationListDelete"});
n.deleteNode.onclick=function(e){
me.remove(sno);
me.onRemove(DA.event.get(e),sno);
};
n.deleteNode.style.display="";
}else{
n.deleteNode.style.display="none";
}
},remove:function(sno){
if(!this.ugNdata[sno]){
return;
}
var _4cd=this.ugNdata[sno].lineNode;
if(_4cd){
_4cd.innerHTML="";
_4cd.parentNode.removeChild(_4cd);
}
delete this.ugData[sno];
delete this.ugNdata[sno];
this.resize();
},clear:function(){
this.ugNode.innerHTML="";
this.ugNode.style.display="none";
this.ugData={};
this.ugNdata={};
},isAddr:function(sno){
return (this.get(sno,"type")===DA.vars.ugType.addr)?true:false;
},isUser:function(sno){
return (this.get(sno,"type")===DA.vars.ugType.user)?true:false;
},isGroup:function(sno){
return (this.get(sno,"type")===DA.vars.ugType.group)?true:false;
},isBulk:function(sno){
return (this.get(sno,"type")===DA.vars.ugType.bulk)?true:false;
},isML:function(sno){
return (this.get(sno,"type")===DA.vars.ugType.ml)?true:false;
},groupExists:function(){
var sno;
for(sno in this.ugData){
if(sno.match(/^\d+$/)&&this.isGroup(sno)){
return true;
}
}
return false;
},userExists:function(){
var sno;
for(sno in this.ugData){
if(sno.match(/^\d+$/)&&this.isUser(sno)){
return true;
}
}
return false;
},scroll:function(){
try{
this.ugNode.scrollTop=this.ugNode.scrollHeight;
}
catch(e){
}
},scrollTo:function(_4d5){
try{
this.ugNode.scrollTop=_4d5;
}
catch(e){
}
}};
if("undefined"===typeof DA){
alert("ERROR: need DA.js");
}else{
if(!DA.logging){
DA.logging={};
}
}
DA.logging.Logger=function(elem){
var _4d7=elem?elem:document.body;
var div=document.createElement("div");
div.innerHTML="Log: ";
var _4d9=document.createElement("button");
_4d9.innerHTML="Show Log";
var _4da=document.createElement("button");
_4da.innerHTML="Hide Log";
_4da.disabled=true;
var _4db=document.createElement("button");
_4db.innerHTML="Clear Log";
var pre=document.createElement("pre");
pre.style.display="none";
pre.style.height="100px";
pre.style.overflow="scroll";
pre.style.backgroundColor="#225522";
pre.style.color="#ffffff";
pre.style.fontSize="9pt";
_4d9.onclick=function(){
pre.style.display="block";
this.disabled=true;
_4da.disabled=false;
};
_4da.onclick=function(){
pre.style.display="none";
this.disabled=true;
_4d9.disabled=false;
};
_4db.onclick=function(){
pre.innerHTML="";
};
div.appendChild(_4d9);
div.appendChild(_4da);
div.appendChild(_4db);
div.appendChild(pre);
_4d7.appendChild(div);
this.log=function(str){
pre.appendChild(document.createTextNode(str+"\n\r"));
pre.scrollTop=pre.scrollHeight;
};
};
DA.logging.time_diff=DA.util.time_diff;
if(!DA||!DA.util){
alert("ERROR: missing DA.js");
}
if(typeof DA.event==="undefined"){
DA.event={};
}
DA.event={get:function(e){
if(e){
return e;
}else{
return window.event;
}
},onClick:function(e){
if(e.button===0){
return true;
}else{
return false;
}
},onContextMenu:function(e){
var b=(BrowserDetect.browser==="Explorer")?0:2;
if(e.button===b){
return true;
}else{
return false;
}
}};
if(("undefined"===typeof DA)||("undefined"===typeof DA.widget)){
throw "DEPENDENCY ERROR: DA.widget is not defined.";
}
if(("undefined"===typeof Prototype)){
throw "DEPENDENCY ERROR: Prototype is not included.";
}
if(("undefined"===typeof YAHOO)){
throw "DEPENDENCY ERROR: YAHOO is not included.";
}
DA.widget.NVPairSet=function(div,_4e3,args,_4e5){
this.div=$(div);
this.nvpair=_4e3;
this.args=args;
this.expanded=_4e5;
this.init();
};
DA.widget.NVPairSet.prototype={expanded:false,maxDisplayCollapsed:3,mailToDivider:null,mailCcDivider:null,mailBccDivider:null,toHdd:null,ccHdd:null,bccHdd:null,dragElId:"da_threePaneResizerDragProxy",init:function(){
var me=this;
this.rootTable=document.createElement("table");
this.rootTbody=document.createElement("tbody");
this.rootTr=document.createElement("tr");
this.rootTable.className="da_nvPairSet";
this.plusMinusTd=document.createElement("td");
this.plusMinusTd.className="da_toggleOuter";
this.plusMinusDiv=document.createElement("div");
this.plusMinusDiv.onclick=function(){
if(me.expanded){
me.collapse();
}else{
me.expand();
}
};
this.plusMinusDiv.className="da_toggleCollapse";
this.plusMinusDiv.innerHTML=DA.imageLoader.nullTag();
this.widgetTd=document.createElement("td");
this.plusMinusTd.appendChild(this.plusMinusDiv);
this.rootTr.appendChild(this.plusMinusTd);
this.rootTr.appendChild(this.widgetTd);
this.rootTbody.appendChild(this.rootTr);
this.rootTable.appendChild(this.rootTbody);
this.div.appendChild(this.rootTable);
this.expandTable=document.createElement("table");
this.expandTable.className="da_nvPairSetExpanded";
this.expandTbody=document.createElement("tbody");
this.collapseTable=document.createElement("table");
this.collapseTable.className="da_nvPairSetCollapsed";
this.collapseTbody=document.createElement("tbody");
this.collapseTable.appendChild(this.collapseTbody);
this.expandTable.appendChild(this.expandTbody);
this.widgetTd.appendChild(this.collapseTable);
this.widgetTd.appendChild(this.expandTable);
this._expandPair={};
this._collapsePair={};
this._collapseResizeNodes=[];
this._collapseResizeExceptNodes=[];
var _4e7;
var _4e8;
var _4e9,_4ea,_4eb;
var _4ec;
var _4ed;
var i,key;
_4e7=document.createElement("tr");
_4e8=document.createElement("td");
_4e7.className="da_nvCollapsedPair";
if("undefined"!==typeof this.args){
if(this.args.length>0){
for(i=0;i<this.args.length;i++){
if("undefined"!==typeof this.nvpair[this.args[i]]){
this.putCollapse(this.args[i],_4e8);
}
}
}else{
this.plusMinusDiv.style.display="none";
}
}else{
i=0;
for(key in this.nvpair){
if("function"===typeof this.nvpair[key]){
continue;
}
this.putCollapse(key,_4e8);
if((++i)===2){
break;
}
}
}
_4e7.appendChild(_4e8);
this.collapseTbody.appendChild(_4e7);
this._hideExcessCollapsedPairs();
var _4f0=1;
for(key in this.nvpair){
if("function"===typeof this.nvpair[key]){
continue;
}
if(_4f0!==1&&this.nvpair[key].border!==false){
this.putExpandBorder(key);
this.mailToDivider=document.getElementById("mailCcDivider");
this.mailCcDivider=document.getElementById("mailBccDivider");
this.mailBccDivider=document.getElementById("mailDateDivider");
}
this.putExpand(key,this.expandTbody);
_4f0=0;
}
if(this.expanded){
this.expand();
}else{
this.collapse();
}
var _4f1=YAHOO.util.Dom.get(this.dragElId);
if(!_4f1){
_4f1=document.createElement("div");
_4f1.id=this.dragElId;
document.body.insertBefore(_4f1,document.body.firstChild);
}
var _4f2={maintainOffset:true,dragElId:this.dragElId};
this.toHdd=new YAHOO.util.DDProxy(this.mailToDivider,"toHdd",_4f2);
this.ccHdd=new YAHOO.util.DDProxy(this.mailCcDivider,"ccHdd",_4f2);
this.bccHdd=new YAHOO.util.DDProxy(this.mailBccDivider,"bccHdd",_4f2);
var DOM=YAHOO.util.Dom;
var _4f4=0;
this.toHdd.onMouseDown=function(e){
_4f4=YAHOO.util.Event.getPageY(e);
var del=this.getDragEl();
this.setInitPosition();
var _4f7="mailToArea";
if(!DOM.get(_4f7)||DOM.get(_4f7).style.display==="none"){
this.endDrag();
this.setYConstraint(0,0);
this.setXConstraint(0,0);
return;
}
var _4f8=parseInt((DOM.get(_4f7).style.height).split("px")[0],10);
var _4f9=DOM.getClientHeight()-DOM.getY(DOM.get(_4f7))-_4f8;
this.setYConstraint(_4f8-18,_4f9-40);
this.setXConstraint(0,0);
del.style.cursor="n-resize";
};
this.toHdd.endDrag=function(e){
var lel=this.getEl();
var del=this.getDragEl();
DOM.setStyle(del,"visibility","");
var curY=DOM.getY(del);
DOM.setStyle(del,"visibility","hidden");
DOM.setStyle(lel,"visibility","");
var _4fe=curY-_4f4;
var _4ff="mailToArea";
if(!DOM.get(_4ff)||DOM.get(_4ff).style.display==="none"){
return;
}
var _500=parseInt((DOM.get(_4ff).style.height).split("px")[0],10)+_4fe;
DOM.get(_4ff).style.height=_500+"px";
};
this.ccHdd.onMouseDown=function(e){
_4f4=YAHOO.util.Event.getPageY(e);
var del=this.getDragEl();
this.setInitPosition();
var _503="mailCcArea";
if(!DOM.get(_503)||DOM.get(_503).style.display==="none"){
this.endDrag();
this.setYConstraint(0,0);
this.setXConstraint(0,0);
return;
}
var _504=parseInt((DOM.get(_503).style.height).split("px")[0],10);
var _505=DOM.getClientHeight()-DOM.getY(DOM.get(_503))-_504;
this.setYConstraint(_504-18,_505-40);
this.setXConstraint(0,0);
del.style.cursor="n-resize";
};
this.ccHdd.endDrag=function(e){
var lel=this.getEl();
var del=this.getDragEl();
DOM.setStyle(del,"visibility","");
var curY=DOM.getY(del);
DOM.setStyle(del,"visibility","hidden");
DOM.setStyle(lel,"visibility","");
var _50a=curY-_4f4;
var _50b="mailCcArea";
if(!DOM.get(_50b)||DOM.get(_50b).style.display==="none"){
return;
}
var _50c=parseInt((DOM.get(_50b).style.height).split("px")[0],10)+_50a;
DOM.get(_50b).style.height=_50c+"px";
};
this.bccHdd.onMouseDown=function(e){
_4f4=YAHOO.util.Event.getPageY(e);
var del=this.getDragEl();
this.setInitPosition();
var _50f="mailBccArea";
if(!DOM.get(_50f)||DOM.get(_50f).style.display==="none"){
this.endDrag();
this.setYConstraint(0,0);
this.setXConstraint(0,0);
return;
}
var _510=parseInt((DOM.get(_50f).style.height).split("px")[0],10);
var _511=DOM.getClientHeight()-DOM.getY(DOM.get(_50f))-_510;
this.setYConstraint(_510-18,_511-40);
this.setXConstraint(0,0);
del.style.cursor="n-resize";
};
this.bccHdd.endDrag=function(e){
var lel=this.getEl();
var del=this.getDragEl();
DOM.setStyle(del,"visibility","");
var curY=DOM.getY(del);
DOM.setStyle(del,"visibility","hidden");
DOM.setStyle(lel,"visibility","");
var _516=curY-_4f4;
var _517="mailBccArea";
if(!DOM.get(_517)||DOM.get(_517).style.display==="none"){
return;
}
var _518=parseInt((DOM.get(_517).style.height).split("px")[0],10)+_516;
DOM.get(_517).style.height=_518+"px";
};
this.resize();
},showCursor:function(key){
var DOM=YAHOO.util.Dom;
var _51b=DOM.get("mail"+key+"Divider");
DOM.setStyle(_51b,"cursor","n-resize");
},hideCursor:function(key){
var DOM=YAHOO.util.Dom;
var _51e=DOM.get("mail"+key+"Divider");
DOM.setStyle(_51e,"cursor","default");
},_hideExcessCollapsedPairs:function(){
var max=this.maxDisplayCollapsed;
var _520=this._collapseResizeNodes.pluck("parentNode");
var _521=_520.splice(0,max);
var _522=_520;
var YDom=YAHOO.util.Dom;
_522.each(function(n,i){
if(YDom.hasClass(n,"da_nvPairFloatRight")){
_521.push(_522.splice(i,1).pop());
}
});
Element.show.apply(null,_521);
Element.hide.apply(null,_522);
},putCollapse:function(key,_527){
var i,_529,_52a,_52b,_52c,_52d,_52e;
if(!DA.util.isEmpty(this.nvpair[key].icon)){
_529=document.createElement("div");
_52d=document.createElement("div");
_529.className=(this.nvpair[key].hidden)?"da_nvPairOuter da_nvPairHidden da_nvPairFloatRight":"da_nvPairOuter da_nvPairFloatRight";
_52d.className="da_nvPairIcon";
this._collapsePair[key]={domPairElem:_529,domIconElem:_52d};
_52d.innerHTML=DA.imageLoader.tag(this.nvpair[key].icon,"",{id:(DA.util.isEmpty(this.nvpair[key].id))?"":this.nvpair[key].id+"Icon"});
_529.appendChild(_52d);
_527.appendChild(_529);
this._collapseResizeExceptNodes.push(_529);
}else{
if(!DA.util.isEmpty(this.nvpair[key].html)){
_529=document.createElement("div");
_52e=document.createElement("div");
_529.className=(this.nvpair[key].hidden)?"da_nvPairOuter da_nvPairHidden da_nvPairFloatRight":"da_nvPairOuter da_nvPairFloatRight";
_52e.className="da_nvPairHTML";
this._collapsePair[key]={domPairElem:_529,domHTMLElem:_52e};
if(!DA.util.isEmpty(this.nvpair[key].id)){
_52e.id=this.nvpair[key].id+"HTML";
}
_52e.innerHTML=this.nvpair[key].html;
_529.appendChild(_52e);
_527.appendChild(_529);
this._collapseResizeExceptNodes.push(_529);
}else{
if(!DA.util.isEmpty(this.nvpair[key].name)||!DA.util.isEmpty(this.nvpair[key].value)){
_529=document.createElement("div");
_52a=document.createElement("div");
_52b=document.createElement("div");
_52c=document.createElement("div");
_529.className=(this.nvpair[key].hidden)?"da_nvPairOuter da_nvPairHidden":"da_nvPairOuter";
_52a.className="da_nvPairCollapseName da_nvPairFloatLeft";
_52b.className="da_nvPairValue da_nvPairFloatLeft";
_52b.style.width="25%";
_52c.className="da_nvPairSeparator da_nvPairFloatLeft";
this._collapsePair[key]={domPairElem:_529,domNameElem:_52a,domValueElem:_52b};
if(!DA.util.isEmpty(this.nvpair[key].id)){
_52a.id=this.nvpair[key].id+"Name";
_52b.id=this.nvpair[key].id+"Value";
}
if(this.nvpair[key].weight===false){
_52a.style.fontWeight="normal";
_52b.style.fontWeight="normal";
_52c.style.fontWeight="normal";
}
_52a.innerHTML=this.nvpair[key].name;
_52b.innerHTML=this.nvpair[key].value;
_52c.innerHTML=":";
_529.appendChild(_52a);
_529.appendChild(_52c);
_529.appendChild(_52b);
_527.appendChild(_529);
this._collapseResizeNodes.push(_52b);
this._collapseResizeExceptNodes.push(_52a);
this._collapseResizeExceptNodes.push(_52c);
}
}
}
},putExpand:function(key,_530){
var me=this;
var name,_533,_534,row;
var _536,_537,_538,_539,_53a,_53b,_53c,_53d,_53e,_53f;
if(this.nvpair[key].row){
row=(DA.util.isEmpty(this.nvpair[key].row))?"":this.nvpair[key].row;
_536=document.createElement("tr");
_53e=document.createElement("td");
_53f=document.createElement("div");
_53e.colSpan=4;
_536.className=(this.nvpair[key].hidden)?"da_nvExpandedPair da_nvPairHidden":"da_nvExpandedPair";
_53e.className="da_nvPairRow";
this._expandPair[key]={domPairElem:_536,domRowElem:_53f};
if(!DA.util.isEmpty(this.nvpair[key].id)){
_536.id=this.nvpair[key].id+"Parent";
_53f.id=this.nvpair[key].id+"Row";
}
if(this.nvpair[key].weight===false){
_53f.style.fontWeight="normal";
}
_53f.innerHTML=row;
_53e.appendChild(_53f);
_536.appendChild(_53e);
_530.appendChild(_536);
}else{
if(!DA.util.isEmpty(this.nvpair[key].name)||!DA.util.isEmpty(this.nvpair[key].value)){
name=(DA.util.isEmpty(this.nvpair[key].name))?"":this.nvpair[key].name;
_533=(DA.util.isEmpty(this.nvpair[key].value))?"":this.nvpair[key].value;
_534=(DA.util.isEmpty(this.nvpair[key].expand))?"":this.nvpair[key].expand;
_536=document.createElement("tr");
_537=document.createElement("td");
_538=document.createElement("div");
_539=document.createElement("td");
_53a=document.createElement("td");
_53b=document.createElement("div");
_53c=document.createElement("div");
_53d=document.createElement("td");
_536.className=(this.nvpair[key].hidden)?"da_nvExpandedPair da_nvPairHidden":"da_nvExpandedPair";
_537.className="da_toggleOuter";
_539.className="da_nvPairExpandName";
_53a.className="da_nvPairValue da_nvPairBreak";
_53d.className="da_nvPairSeparator";
this._expandPair[key]={domPairElem:_536,domPMElem:_538,domNameElem:_539,domValueElem:_53b,domExpandElem:_53c};
if(!DA.util.isEmpty(this.nvpair[key].id)){
_536.id=this.nvpair[key].id+"Parent";
_538.id=this.nvpair[key].id+"PlusMinus";
_539.id=this.nvpair[key].id+"Name";
_53b.id=this.nvpair[key].id+"Value";
_53c.id=this.nvpair[key].id+"Separator";
}
if(DA.util.isEmpty(_534)){
this.disableColumnExpand(key);
}else{
this.enableColumnExpand(key);
}
if(this.nvpair[key].weight===false){
_539.style.fontWeight="normal";
_53a.style.fontWeight="normal";
_53d.style.fontWeight="normal";
}
_538.innerHTML=DA.imageLoader.nullTag();
_539.innerHTML=name;
_53b.innerHTML=_533;
_53c.innerHTML=_534;
_53d.innerHTML=":";
_538.onclick=function(){
if(me.columnExpanded(key)){
me.collapseColumn(key);
}else{
me.expandColumn(key);
}
};
_537.appendChild(_538);
_53a.appendChild(_53b);
_53a.appendChild(_53c);
_536.appendChild(_537);
_536.appendChild(_539);
_536.appendChild(_53d);
_536.appendChild(_53a);
_530.appendChild(_536);
}
}
},putExpandBorder:function(key){
var _541=document.createElement("tr");
var _542=document.createElement("td");
var _543=document.createElement("div");
if(key==="Cc"||key==="Bcc"||key==="Date"){
_543.className="da_nvPairDivider";
_543.id="mail"+key+"Divider";
_542.colSpan=5;
_542.className="da_nvPairBorder";
_542.appendChild(_543);
}else{
_542.innerHTML=DA.imageLoader.nullTag();
_542.className="da_nvPairBorder";
_542.colSpan=5;
}
_541.appendChild(_542);
this.expandTbody.appendChild(_541);
},changeName:function(key,name){
this.nvpair[key].name=(DA.util.isEmpty(name))?"":name;
if(this._expandPair[key]&&!this.columnIsRow(key)){
this._expandPair[key].domNameElem.innerHTML=this.nvpair[key].name;
}
if(this._collapsePair[key]&&!this.columnIsIcon(key)&&!this.columnIsHTML(key)){
this._collapsePair[key].domNameElem.innerHTML=this.nvpair[key].name;
}
this.resize();
},changeValue:function(key,_547){
this.nvpair[key].value=(DA.util.isEmpty(_547))?"":_547;
var _548,dom;
if(this._expandPair[key]&&!this.columnIsRow(key)){
if(DA.util.isEmpty(_547)){
_548=this._expandPair[key].domValueElem.parentNode;
dom=document.createElement("div");
dom.id=this._expandPair[key].domValueElem.id;
dom.className=this._expandPair[key].domValueElem.className;
_548.removeChild(this._expandPair[key].domValueElem);
_548.appendChild(dom);
this._expandPair[key].domValueElem=dom;
}else{
this._expandPair[key].domValueElem.innerHTML=this.nvpair[key].value;
}
}
if(this._collapsePair[key]&&!this.columnIsIcon(key)&&!this.columnIsHTML(key)){
this._collapsePair[key].domValueElem.innerHTML=this.nvpair[key].value;
}
this.resize();
},changeExpand:function(key,_54b){
this.nvpair[key].expand=(DA.util.isEmpty(_54b))?"":_54b;
if(this._expandPair[key]&&!this.columnIsRow(key)){
this._expandPair[key].domExpandElem.innerHTML=this.nvpair[key].expand;
if(DA.util.isEmpty(_54b)){
this.disableColumnExpand(key);
}else{
this.enableColumnExpand(key);
}
}
},changeNameValue:function(key,name,_54e){
this.nvpair[key].name=(DA.util.isEmpty(name))?"":name;
this.nvpair[key].value=(DA.util.isEmpty(_54e))?"":_54e;
if(this._expandPair[key]&&!this.columnIsRow(key)){
this._expandPair[key].domNameElem.innerHTML=this.nvpair[key].name;
this._expandPair[key].domValueElem.innerHTML=this.nvpair[key].value;
}
if(this._collapsePair[key]&&!this.columnIsIcon(key)&&!this.collumnIsHTML(key)){
this._collapsePair[key].domNameElem.innerHTML=this.nvpair[key].name;
this._collapsePair[key].domValueElem.innerHTML=this.nvpair[key].value;
}
},enableColumnExpand:function(key){
this.nvpair[key].expandDisabled=false;
if(this.columnExpanded(key)){
this._expandPair[key].domPMElem.className="da_toggleExpand";
this._expandPair[key].domValueElem.style.display="none";
this._expandPair[key].domExpandElem.style.display="";
}else{
this._expandPair[key].domPMElem.className="da_toggleCollapse";
this._expandPair[key].domExpandElem.style.display="none";
this._expandPair[key].domValueElem.style.display="";
}
},disableColumnExpand:function(key){
this.nvpair[key].expandDisabled=true;
this._expandPair[key].domPMElem.className="da_toggleNull";
this._expandPair[key].domExpandElem.style.display="none";
this._expandPair[key].domValueElem.style.display="";
},columnIsRow:function(key){
if(DA.util.isEmpty(this.nvpair[key].row)){
return false;
}else{
return true;
}
},columnIsIcon:function(key){
var o=this.nvpair[key];
return o&&!DA.util.isEmpty(o.icon);
},columnIsHTML:function(key){
var o=this.nvpair[key];
return o&&!DA.util.isEmpty(o.html);
},columnExpanded:function(key){
var o=this.nvpair[key];
return o&&o.expanded;
},showColumn:function(key){
var tr=(this._expandPair[key])?this._expandPair[key].domPairElem:(this._collapsePair[key])?this._collapsePair[key].domPairElem:null;
if(!tr){
return;
}
YAHOO.util.Dom.removeClass(tr,"da_nvPairHidden");
var _55a=tr.previousSibling;
var _55b=tr.nextSibling;
if(!_55a&&!_55b){
return;
}
if(_55b&&_55b.tagName==="TR"&&_55b.firstChild&&YAHOO.util.Dom.hasClass(_55b.firstChild,"da_nvPairBorder")){
_55b.style.display="";
return;
}
if(_55a&&_55a.tagName==="TR"&&_55a.firstChild&&YAHOO.util.Dom.hasClass(_55a.firstChild,"da_nvPairBorder")){
_55a.style.display="";
}
},hideColumn:function(key){
var tr=(this._expandPair[key])?this._expandPair[key].domPairElem:(this._collapsePair[key])?this._collapsePair[key].domPairElem:null;
if(!tr){
return;
}
YAHOO.util.Dom.addClass(tr,"da_nvPairHidden");
var _55e=tr.previousSibling;
var _55f=tr.nextSibling;
if(!_55e&&!_55f){
return;
}
if(_55f&&_55f.tagName==="TR"&&_55f.firstChild&&YAHOO.util.Dom.hasClass(_55f.firstChild,"da_nvPairBorder")){
_55f.style.display="none";
return;
}
if(_55e&&_55e.tagName==="TR"&&_55e.firstChild&&YAHOO.util.Dom.hasClass(_55e.firstChild,"da_nvPairBorder")){
_55e.style.display="none";
}
},collapseColumn:function(key){
if(!this.nvpair[key].expandDisabled){
this.nvpair[key].expanded=false;
this._expandPair[key].domPMElem.className="da_toggleCollapse";
this._expandPair[key].domExpandElem.style.display="none";
this._expandPair[key].domValueElem.style.display="";
this.onCollapse();
}
},expandColumn:function(key){
if(!this.nvpair[key].expandDisabled){
this.nvpair[key].expanded=true;
this._expandPair[key].domPMElem.className="da_toggleExpand";
this._expandPair[key].domValueElem.style.display="none";
this._expandPair[key].domExpandElem.style.display="";
this.onExpand();
}
},scrollSeparator:function(key,_563){
var el=(_563===1)?this._expandPair[key].domExpandElem:this._expandPair[key].domValueElem;
if(el){
el.className="da_nvPairSeparator4scroll";
el.style.height="80px";
el.id="mail"+key+"Area";
}
},unscrollSeparator:function(key,_566){
var el=(_566===1)?this._expandPair[key].domExpandElem:this._expandPair[key].domValueElem;
if(el&&el.className){
el.className="";
el.style.height="";
el.id="";
}
},remove:function(_568){
delete this.nvpair[_568];
var exp=this._expandPair[_568];
var col=this._collapsePair[_568];
if(exp){
exp.domPairElem.parentNode.removeChild(exp.domPairElem);
}
if(col){
if(this.columnIsHTML(_568)){
col.domIconElem.parentNode.removeChild(col.domHTMLElem);
}else{
if(this.columnIsIcon(_568)){
col.domIconElem.parentNode.removeChild(col.domIconElem);
}else{
col.domNameElem.parentNode.removeChild(col.domNameElem);
col.domValueElem.parentNode.removeChild(col.domValueElem);
}
}
}
},enableExpand:function(){
this.expandDisabled=false;
if(this.expanded){
this.plusMinusDiv.className="da_toggleExpand";
this.collapseTable.style.display="none";
this.expandTable.style.display="";
}else{
this.plusMinusDiv.className="da_toggleCollapse";
this.collapseTable.style.display="";
this.expandTable.style.display="none";
}
},disableExpand:function(){
this.expandDisabled=true;
this.plusMinusDiv.className="da_toggleNull";
this.expandTable.style.display="none";
this.collapseTable.style.display="";
},collapse:function(){
if(!this.expandDisabled){
this.expanded=false;
this.plusMinusDiv.className="da_toggleCollapse";
this.collapseTable.style.display="";
this.expandTable.style.display="none";
this.onCollapse();
if(this._pendingResizeCollapsed){
this._resizeCollapsed();
}
}
},expand:function(){
if(!this.expandDisabled){
this.expanded=true;
this.plusMinusDiv.className="da_toggleExpand";
this.collapseTable.style.display="none";
this.expandTable.style.display="";
this.onExpand();
}
},hide:function(){
this.div.style.display="none";
this.onHide();
},show:function(){
this.div.style.display="";
this.onShow();
},resize:function(){
if(this.expanded){
this._pendingResizeCollapsed=true;
}else{
this._resizeCollapsed();
}
},_resizeCollapsed:function(){
var i,e=0,d;
this._pendingResizeCollapsed=false;
for(i=0;i<this._collapseResizeExceptNodes.length;i++){
e+=this._collapseResizeExceptNodes[i].offsetWidth;
}
d=parseInt((this.collapseTable.offsetWidth-e-30)/this.maxDisplayCollapsed,10);
d=(d<0)?0:d;
var _56e=0;
function borrow(n){
var tmp=_56e;
_56e-=n;
if(_56e>=0){
return n;
}else{
_56e=0;
return tmp;
}
}
var _571=this._collapseResizeNodes.map(function(el){
el.style.width="auto";
var _573=el.offsetWidth;
var _574=_573?d-_573:0;
if(_574>0){
_56e+=_574;
}
return {el:el,origW:_573,excess:_574};
});
_571.each(function(node){
var _576=d;
if(node.excess<0&&_56e>0){
_576+=borrow(-node.excess);
}else{
if(node.excess>0){
_576=node.origW;
}
}
node.el.style.width=_576+"px";
});
},_utils:{nodePositionComparator:BrowserDetect.browser==="Explorer"?function(l,r){
var comp=l.parentNode.sourceIndex-r.parentNode.sourceIndex;
return comp>0?1:comp<0?-1:0;
}:function(l,r){
var comp=l.parentNode.compareDocumentPosition(r.parentNode);
return comp===0?0:(comp===4)?-1:1;
}},reorder:function(_57d){
var _57e=_57d||[];
var _57f=this._collapsePair||{};
var ct=this.collapseTable;
var _581=ct&&ct.rows&&ct.rows[0]&&ct.rows[0].cells[0];
if(_581&&_581.insertBefore){
_57e.reverse(false).each(function(key){
var pair=_57f[key];
if(!pair){
return;
}
var _584=pair.domPairElem;
if(!_584){
return;
}
_581.insertBefore(_584,_581.firstChild);
});
}
this._collapseResizeNodes.sort(this._utils.nodePositionComparator);
this._hideExcessCollapsedPairs();
},onCollapse:Prototype.emptyFunction,onExpand:Prototype.emptyFunction,onHide:Prototype.emptyFunction,onShow:Prototype.emptyFunction};
if(!DA||!DA.mailer||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.mailer.MessageEditor=function(_585,_586,_587,_588,_589,_58a,_58b,_58c){
this.headerNode=_585;
this.headerId=_585.id;
this.textNode=_586;
this.textId=_586.id;
this.htmlNode=_587;
this.htmlId=_587.id;
this.previewNode=_588;
this.previewId=_588.id;
this.threePane=_58a;
this.requestUrl=_58b;
this.forced_interruption=0;
if(_589){
if(DA.util.isFunction(_589.onLoad)){
this.onLoad=_589.onLoad;
}
if(DA.util.isFunction(_589.onPreview)){
this.onPreview=_589.onPreview;
}
if(DA.util.isFunction(_589.onForcedInterruption)){
this.onForcedInterruption=_589.onForcedInterruption;
}
if(DA.util.isFunction(_589.onBack)){
this.onBack=_589.onBack;
}
if(DA.util.isFunction(_589.doResize)){
this.doResize=_589.doResize;
}
if(DA.util.isFunction(_589.onEnable)){
this.onEnable=_589.onEnable;
}
}
if(_58c){
if(_58c.uploadCompleted){
this.ddAppletUploadCompleted=_58c.uploadCompleted;
}
if(_58c.beforeUpload){
this.ddAppletBeforeUpload=_58c.beforeUpload;
}
if(_58c.afterUpload){
this.ddAppletAfterUpload=_58c.afterUpload;
}
if(_58c.afterMoreThanMax){
this.ddAppletAfterMoreThanMax=_58c.afterMoreThanMax;
}
}
var _58d=DA.util.parseQuery(this.requestUrl);
if(_58d.external&&DA.util.cmpNumber(_58d.external,1)){
this.external=true;
}else{
this.external=false;
}
if(DA.vars.custom.editor.setMessageEditor){
eval(DA.vars.custom.editor.setMessageEditor);
}
this.init();
if(DA.vars.custom.editor.setMessageEditor2){
eval(DA.vars.custom.editor.setMessageEditor2);
}
};
DA.mailer.MessageEditor.prototype={warnNode:null,headerNode:null,headerId:null,textNode:null,textId:null,htmlNode:null,htmlId:null,previewNode:null,previewId:null,headerContentsNode:null,textContentsNode:null,htmlContentsNode:null,selectedFid:null,selectedUid:null,proc:null,selectedMaid:null,selectedTid:null,selectedFrom:null,selectedSid:null,selectedFld:null,selectedSno:null,selectFolderType:null,currentUploadForm:null,currentSizeNode:null,toController:null,ccController:null,bccController:null,fileController:null,jsonIO:null,tmplIO:null,signIO:null,userIO:null,addrIO:null,groupIO:null,rnDialog:null,ceDialog:null,popup:null,menuData:null,dragAddressTo:null,dragAddressCc:null,dragAddressBcc:null,titleList:null,langList:null,signList:null,previewMode:false,spellcheckMode:DA.vars.config.spellcheck_mode,fck:null,fckAPIs:null,_FCKEditorCompleted:false,threePane:null,requestUrl:null,ddAppletUploadCompleted:null,ddAppletBeforeUpload:null,ddAppletAfterUpload:null,ddAppletAfterMoreThanMax:null,mode:null,autoBackupedXML:null,backup_maid:null,backup_timeout_msg_alerted:null,autoBackupTimeout:DA.vars.system.auto_backup_interval*1000,external:false,uploading:{},onLoad:Prototype.emptyFunction,onPreview:Prototype.emptyFunction,onForcedInterruption:Prototype.emptyFunction,onBack:Prototype.emptyFunction,doResize:Prototype.emptyFunction,onEnable:Prototype.emptyFunction,init:function(){
DA.customEvent.fire("messageEditorInitBefore",this);
var me=this;
var _58f=["<div class=\"da_messageEditorHeader\">","<div id=\"da_messageEditorItemWarn\" class=\"da_messageEditorWarn\"></div>","<table class=\"da_messageEditorHeaderTable\">","<tr>","  <td colspan=\"2\" class=\"da_messageEditorHeaderTableTopLeft\">",DA.imageLoader.nullTag(1,3),"</td>","  <td class=\"da_messageEditorHeaderTableTopRight\">",DA.imageLoader.nullTag(2,3),"</td>","</tr>","<tr>","  <td class=\"da_messageEditorHeaderTableMiddleLeft\">",DA.imageLoader.nullTag(2,1),"</td>","  <td class=\"da_messageEditorHeaderTableMiddleCenter\">","    <table class=\"da_messageEditorHeaderContents\">","    <tr>","      <td><div id=\"",this.headerId,"Contents\"></div><div id=\"",this.headerId,"Preview\"></div></td>","    </tr>","    </table>","  </td>","  <td class=\"da_messageEditorHeaderTableMiddleRight\">",DA.imageLoader.nullTag(2,1),"</td>","</tr>","<tr>","  <td colspan=\"2\" class=\"da_messageEditorHeaderTableBottomLeft\">",DA.imageLoader.nullTag(1,2),"</td>","  <td class=\"da_messageEditorHeaderTableBottomRight\">",DA.imageLoader.nullTag(2,2),"</td>","</tr>","</table>","</div>"].join("");
var text=["<div id=\"",this.textId,"Contents\" class=\"da_messageEditorBody\">","<textarea id=\"da_messageEditorItemText\" class=\"da_messageEditorText\"></textarea>","</div>"].join("");
var _591=["<div id=\"",this.previewId,"Contents\" class=\"da_messageEditorBody da_messageEditorPreview\"></div>"].join("");
this._hideBodyText();
this.headerNode.innerHTML=_58f;
this.textNode.innerHTML=text;
this.previewNode.innerHTML=_591;
if(DA.vars.richText){
switch(DA.vars.richText.type){
case "crossbrowser":
this.create_RTE();
break;
case "fckeditor":
this.create_FCKeditor();
break;
}
}
this._hideBodyHTML();
this.warnNode=YAHOO.util.Dom.get("da_messageEditorItemWarn");
this.headerContentsNode=YAHOO.util.Dom.get(this.headerId+"Contents");
this.textContentsNode=YAHOO.util.Dom.get(this.textId+"Contents");
if(DA.vars.richText){
switch(DA.vars.richText.type){
case "crossbrowser":
this.htmlContentsNode=YAHOO.util.Dom.get(this.htmlId+"Contents");
break;
case "fckeditor":
this.htmlContentsNode=YAHOO.util.Dom.get(this.htmlId+"Contents___Frame");
break;
}
}
this.previewContentsNode=YAHOO.util.Dom.get(this.previewId+"Contents");
if(DA.vars.config.font==="on"){
YAHOO.util.Dom.addClass(this.textContentsNode,"da_nonProportionalFont");
YAHOO.util.Dom.addClass(this.previewContentsNode,"da_nonProportionalFont");
}
YAHOO.util.Dom.addClass(this.htmlContentsNode.parentNode,"da_messageEditorBody da_messageEditorBodyBoarder");
YAHOO.util.Dom.addClass(this.htmlContentsNode,"da_messageEditorHTML");
var _592={To:{id:"da_messageEditorItemToField",name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_TO"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\"><input type=text id=\"da_messageEditorItemToText\" class=\"da_messageEditorItemText\">&nbsp;</span>","<span id=\"da_messageEditorItemAddressCcBcc\" class=\"da_messageEditorItemInner da_messageEditorPointer\">",DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_ccbcc.gif"),"</span>","<span>&nbsp;</span>","<span id=\"da_messageEditorItemToAddress\" class=\"da_messageEditorItemInner da_messageEditorPointer\">",DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_address_off.gif"),"</span>","<div id=\"da_messageEditorItemToTextACContainer\" class=\"da_autoCompleteContainer\"></div>","<div id=\"da_messageEditorItemTo\" class=\"da_messageEditorItemInner\"></div>","</div>"].join("")},Cc:{id:"da_messageEditorItemCcField",name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CC"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\"><input type=text id=\"da_messageEditorItemCcText\" class=\"da_messageEditorItemText\">&nbsp;&nbsp;</span>","<span id=\"da_messageEditorItemCcAddress\" class=\"da_messageEditorItemInner da_messageEditorPointer\">",DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_address_off.gif"),"</span>","<div id=\"da_messageEditorItemCcTextACContainer\" class=\"da_autoCompleteContainer\"></div>","<div id=\"da_messageEditorItemCc\" class=\"da_messageEditorItemInner\"></div>","</div>"].join(""),border:false,hidden:true},Bcc:{id:"da_messageEditorItemBccField",name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_BCC"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\"><input type=text id=\"da_messageEditorItemBccText\" class=\"da_messageEditorItemText\">&nbsp;&nbsp;</span>","<span id=\"da_messageEditorItemBccAddress\" class=\"da_messageEditorItemInner da_messageEditorPointer\">",DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_address_off.gif"),"</span>","<div id=\"da_messageEditorItemBccTextACContainer\" class=\"da_autoCompleteContainer\"></div>","<div id=\"da_messageEditorItemBcc\" class=\"da_messageEditorItemInner\"></div>","</div>"].join(""),border:false,hidden:true},From:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_FROM"),value:["<div class=\"da_messageEditorItemOuter\">","<span id=\"da_messageEditorItemFromName\" class=\"da_messageEditorItemInner\"></span>","<span id=\"da_messageEditorItemFromAddress\" class=\"da_messageEditorItemInner\"></span>","<span id=\"da_messageEditorItemReplyUseOuter\" class=\"da_messageEditorItemInner\">&nbsp;","<input type=checkbox id=\"da_messageEditorItemReplyUse\">&nbsp;",DA.locale.GetText.t_("MESSAGE_CHECKBOXMESSAGE_REPLYUSE"),"&nbsp;","</span>","</div>"].join("")},Subject:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_SUBJECT"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\"><input type=text id=\"da_messageEditorItemSubject\" class=\"da_messageEditorItemText\">&nbsp;</span>","<span class=\"da_messageEditorItemInner\">",DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_PRIORITY"),"&nbsp;:&nbsp;","<select id=\"da_messageEditorItemPriority\" size=1 disabled=\"disabled\">","<option value=\"1\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_HIGH"),"</option>","<option value=\"3\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_NORMAL"),"</option>","<option value=\"5\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_LOW"),"</option>","</select>","</span>","</div>"].join("")},Attachment:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_ATTACHMENTFILE"),value:["<div class=\"da_messageEditorItemOuter\">",(DA.vars.config.upload_file_applet==="inline"||DA.vars.config.upload_file_applet==="hidden")?"<div id=\"da_messageEditorItemAttachmentDDApplet\" class=\"da_messageEditorItemInner\"></div>":"","<span id=\"da_messageEditorItemAttachmentButtonsOuter\" class=\"da_messageEditorItemInner\" style=\"float:right;\">","<input id=\"da_messageEditorItemAttachmentButtonsApplet\" type=button value=\""+DA.locale.GetText.t_("EDITOR_SHOW_APPLET_BUTTON")+"\" ",(DA.vars.config.upload_file_applet==="hidden")?"":" style=\"display:none;\""," disabled>","<input id=\"da_messageEditorItemAttachmentButtonsLibrary\" type=button value=\""+DA.locale.GetText.t_("EDITOR_LIBRARYSEL_BUTTON")+"\" style=\"display:none;\" disabled>","</span>","<span id=\"da_messageEditorItemAttachmentFormOuter\" class=\"da_messageEditorItemInner\"></span>","<div id=\"da_messageEditorItemAttachment\" class=\"da_messageEditorItemInner\"></div>","</div>"].join("")},Options:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_OPTIONS"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\">",DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_SIGN"),"&nbsp;:&nbsp;","<span id=\"da_messageEditorItemSignList\"></span>&nbsp;","</span>","<span class=\"da_messageEditorItemInner\">",DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CHARSET"),"&nbsp;:&nbsp;","<select id=\"da_messageEditorItemCharset\" size=1 disabled=\"disabled\">","<option value=\"ISO-2022-JP\">",DA.locale.GetText.t_("MESSAGE_CHARSET_ISO2022JP"),"</option>","<option value=\"UTF-8\">",DA.locale.GetText.t_("MESSAGE_CHARSET_UTF8"),"</option>","</select>&nbsp;","</span>","<span id=\"da_messageEditorItemContentTypeAll\" class=\"da_messageEditorItemInner\">",DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CONTENTTYPE"),"&nbsp;:&nbsp;","<select id=\"da_messageEditorItemContentType\" size=1 disabled=\"disabled\">","<option value=\"text\">",DA.locale.GetText.t_("MESSAGE_CONTENTTYPE_TEXT"),"</option>","<option value=\"html\">",DA.locale.GetText.t_("MESSAGE_CONTENTTYPE_HTML"),"</option>","</select>&nbsp;","</span>","<span class=\"da_messageEditorItemInner\">","<input type=checkbox id=\"da_messageEditorItemNotification\">&nbsp;",DA.locale.GetText.t_("MESSAGE_CHECKBOXMESSAGE_NOTIFICATION"),"&nbsp;","</span>","<span id=\"da_messageEditorItemOpenStatusOuter\" class=\"da_messageEditorItemInner\">"+"<input type=checkbox id=\"da_messageEditorItemOpenStatus\">&nbsp;",DA.locale.GetText.t_("MESSAGE_CHECKBOXMESSAGE_OPENSTATUS"),"&nbsp;","</span>","<span id=\"da_messageEditorItemGroupNameOuter\" class=\"da_messageEditorItemInner\">"+"<br><input type=checkbox id=\"da_messageEditorItemGroupName\">&nbsp;",DA.locale.GetText.t_("MESSAGE_CHECKBOXMESSAGE_GROUPNAME"),"&nbsp;","</span>","</div>"].join("")},Hidden:{name:"hidden",value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\">","<input type=hidden id=\"da_messageEditorItemInReplyTo\" value=\"\">","<input type=hidden id=\"da_messageEditorItemReferences\" value=\"\">","</span>","</div>"].join(""),border:false,hidden:true},Custom:{id:"da_messageEditorItemCustom",row:DA.vars.custom.editor.headerOpen,html:DA.vars.custom.editor.headerClose,border:false,hidden:(DA.vars.custom.editor.headerOpen||DA.vars.custom.editor.headerClose)?false:true},SubjectCollapse:{name:DA.imageLoader.nullTag(14,14)+DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_SUBJECT"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\"><input type=text id=\"da_messageEditorItemSubjectCollapse\" class=\"da_messageEditorItemText\">&nbsp;</span>","<span class=\"da_messageEditorItemInner\">",DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_PRIORITY"),"&nbsp;:&nbsp;","<select id=\"da_messageEditorItemPriorityCollapse\" size=1 disabled=\"disabled\">","<option value=\"1\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_HIGH"),"</option>","<option value=\"3\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_NORMAL"),"</option>","<option value=\"5\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_LOW"),"</option>","</select>","</span>","</div>"].join("")}};
DA.customEvent.fire("messageEditorRewriteNVPairParams",this,_592);
this.contentsPairs=new DA.widget.NVPairSet($(this.headerId+"Contents"),_592,["SubjectCollapse"],true);
this.contentsPairs.hideColumn("SubjectCollapse");
this.contentsPairs.onExpand=function(){
DA.customEvent.fire("messageEditorNVPairOnExpandBefore",me);
DA.dom.changeValue("da_messageEditorItemSubject",DA.dom.textValue("da_messageEditorItemSubjectCollapse"));
YAHOO.util.Dom.get("da_messageEditorItemSubjectCollapse").value="";
DA.dom.changeValue("da_messageEditorItemPriority",DA.dom.selectValue("da_messageEditorItemPriorityCollapse"));
me.doResize();
DA.customEvent.fire("messageEditorNVPairOnExpandAfter",me);
};
this.contentsPairs.onCollapse=function(){
DA.customEvent.fire("messageEditorNVPairOnCollapseBefore",me);
me.doResize();
this._pendingResizeCollapsed=false;
DA.dom.changeValue("da_messageEditorItemSubjectCollapse",DA.dom.textValue("da_messageEditorItemSubject"));
YAHOO.util.Dom.get("da_messageEditorItemSubject").value="";
DA.dom.changeValue("da_messageEditorItemPriorityCollapse",DA.dom.selectValue("da_messageEditorItemPriority"));
var div=YAHOO.util.Dom.getElementsByClassName("da_nvPairValue da_nvPairFloatLeft")[0];
if(div.style.width){
div.style.width="";
}
DA.customEvent.fire("messageEditorNVPairOnCollapseAfter",me);
};
this.previewPairs=new DA.widget.NVPairSet($(this.headerId+"Preview"),{To:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_TO"),value:""},Cc:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CC"),value:""},Bcc:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_BCC"),value:""},From:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_FROM"),value:""},Subject:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_SUBJECT"),value:""},Attachment:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_ATTACHMENTFILE"),value:""}},[],true);
this._switchPreviewMode(false);
this.jsonIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_new.cgi");
this.tmplIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_template.cgi");
this.signIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_sign.cgi");
this.addrIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_addr.cgi");
this.userIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_user.cgi");
this.groupIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_group.cgi");
this._addUploadForm();
this.menuData={};
this.popup=new DA.widget.PopupMenuNoTrigger("da_messageEditorPopupMenu",this.menuData,{onTrigger:function(e){
var _595=YAHOO.util.Event.getTarget(e);
var _596;
if(_595){
_596=_595.className;
if(_596.match(/(^|\s)da_ugInformationListPopup(\s|$)/)){
return true;
}else{
return false;
}
}else{
return false;
}
}});
this.dropAddressTo=new YAHOO.util.DDTarget("da_messageEditorItemToText","editorAddress");
this.dropAddressCc=new YAHOO.util.DDTarget("da_messageEditorItemCcText","editorAddress");
this.dropAddressBcc=new YAHOO.util.DDTarget("da_messageEditorItemBccText","editorAddress");
this.toController=new DA.ug.InformationListController(YAHOO.util.Dom.get("da_messageEditorItemTo"),null,{onRemove:function(e,sno){
me._hideRnDialog();
me._hideCeDialog();
me._refreshGroupName();
me.doResize();
},onPopup:function(e,sno){
me._hideRnDialog();
me._hideCeDialog();
me.popup.position(YAHOO.util.Event.getPageX(e)+1,YAHOO.util.Event.getPageY(e)+1);
me._showPopupMenu("to",sno);
}},{baseId:"da_ugInformationList_to",maxView:5});
this.dragAddressTo=new DA.mailer.AddressDragDrop("da_messageEditorItemTo","editorAddress",{scroll:false,resizeFrame:false});
this.dragAddressTo.onMouseDown=function(e){
var cur=this.getDragEl();
var node=YAHOO.util.Event.getTarget(e);
var i,sno,_5a0;
var dst=null;
var _5a2=false;
var stop;
window.dragedElClassName="";
stop=setTimeout(function(){
_5a2=true;
if(node){
if(node.className.match(/da_ugInformationListDragDrop_(\d+)/)){
_5a0=node.parentNode;
if(_5a0){
if(_5a0.className.match(/da_ugInformationListDragDrop_(\d+)/)){
window.dragedElClassName=_5a0.className;
sno=RegExp.$1;
me.selectedFld="to";
me.selectedSno=sno;
cur.innerHTML=me.toController.dummy(sno);
dst=me._controller("to");
dst.scrollTo(0);
dst.showAllAddress();
dst=me._controller("cc");
dst.scrollTo(0);
dst.showAllAddress();
dst=me._controller("bcc");
dst.scrollTo(0);
dst.showAllAddress();
}
YAHOO.util.DDM.refreshCache();
}
}else{
window.dragedElClassName="";
}
}
},200);
node.onmouseup=function(e){
if(!_5a2){
clearTimeout(stop);
me.dragAddressTo.endDrag();
}
};
};
this.dragAddressTo.onDragEnter=function(e,id){
var _5a7=null;
var div=null;
var _5a9=null;
var _5aa=null;
if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)){
if(id.indexOf("Text")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5a7=document.createElement("hr");
_5a7.style.height="2px";
_5a7.style.display="block";
_5a7.style.backgroundColor="gray";
_5a7.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5a7.style.marginTop="-9px";
_5a7.style.borderWidth="2px";
}else{
_5a7.style.borderWidth="1px";
}
div.appendChild(_5a7);
if(id.indexOf("To")>0){
_5a9=document.getElementById("da_messageEditorItemTo");
}else{
if(id.indexOf("Cc")>0){
_5a9=document.getElementById("da_messageEditorItemCc");
}else{
if(id.indexOf("Bcc")>0){
_5a9=document.getElementById("da_messageEditorItemBcc");
}
}
}
_5aa=_5a9.childNodes[0];
if(_5aa){
_5a9.insertBefore(div,_5a9.childNodes[0]);
}else{
_5a9.appendChild(div);
_5a9.style.display="block";
}
}else{
if(id.indexOf("da_ugInformationList")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5a7=document.createElement("hr");
_5a7.style.height="2px";
_5a7.style.display="block";
_5a7.style.backgroundColor="gray";
_5a7.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5a7.style.marginTop="-9px";
_5a7.style.borderWidth="2px";
}else{
_5a7.style.borderWidth="1px";
}
div.appendChild(_5a7);
document.getElementById(id).appendChild(div);
}
}
}
};
this.dragAddressTo.onDragDrop=function(e,id){
var _5ad=null;
var mask=null;
var _5af=me._controller("to");
if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)){
if(id){
if(id.match(/da_messageEditorItemToText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemToText");
mask.parentNode.removeChild(mask);
me.moveTop("to",me.selectedSno,"to",1);
}else{
if(id.match(/da_messageEditorItemCcText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemCcText");
mask.parentNode.removeChild(mask);
me.insertBeforeNode("to",me.selectedSno,"cc",0,_5af.get(me.selectedSno));
}else{
if(id.match(/da_messageEditorItemBccText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
mask.parentNode.removeChild(mask);
me.insertBeforeNode("to",me.selectedSno,"bcc",0,_5af.get(me.selectedSno));
}else{
if(id.match(/da_ugInformationListToLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"to",id);
_5ad=document.getElementById("insertAddressAfterMark"+id);
if(_5ad){
_5ad.parentNode.removeChild(_5ad);
}
}else{
if(id.match(/da_ugInformationListCcLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"cc",id);
_5ad=document.getElementById("insertAddressAfterMark"+id);
if(_5ad){
_5ad.parentNode.removeChild(_5ad);
}
}else{
if(id.match(/da_ugInformationListBccLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"bcc",id);
_5ad=document.getElementById("insertAddressAfterMark"+id);
if(_5ad){
_5ad.parentNode.removeChild(_5ad);
}
}
}
}
}
}
}
YAHOO.util.Dom.removeClass(id,"da_messageEditorSilver");
}
}
};
this.dragAddressTo.onMouseUp=function(e){
this.getDragEl().innerHTML="";
me.resizeAll();
};
this.ccController=new DA.ug.InformationListController(YAHOO.util.Dom.get("da_messageEditorItemCc"),null,{onRemove:function(e,sno){
me._hideRnDialog();
me._hideCeDialog();
me._refreshGroupName();
me.doResize();
},onPopup:function(e,sno){
me._hideRnDialog();
me._hideCeDialog();
me.popup.position(YAHOO.util.Event.getPageX(e)+1,YAHOO.util.Event.getPageY(e)+1);
me._showPopupMenu("cc",sno);
}},{baseId:"da_ugInformationList_cc",maxView:5});
this.dragAddressCc=new DA.mailer.AddressDragDrop("da_messageEditorItemCc","editorAddress",{scroll:false,resizeFrame:false});
this.dragAddressCc.onMouseDown=function(e){
var cur=this.getDragEl();
var node=YAHOO.util.Event.getTarget(e);
var i,sno,_5ba;
var dst=null;
var _5bc=false;
var stop;
window.dragedElClassName="";
stop=setTimeout(function(){
_5bc=true;
if(node){
if(node.className.match(/da_ugInformationListDragDrop_(\d+)/)){
_5ba=node.parentNode;
if(_5ba){
if(_5ba.className.match(/da_ugInformationListDragDrop_(\d+)/)){
window.dragedElClassName=_5ba.className;
sno=RegExp.$1;
me.selectedFld="cc";
me.selectedSno=sno;
cur.innerHTML=me.ccController.dummy(sno);
dst=me._controller("to");
dst.scrollTo(0);
dst.showAllAddress();
dst=me._controller("cc");
dst.scrollTo(0);
dst.showAllAddress();
dst=me._controller("bcc");
dst.scrollTo(0);
dst.showAllAddress();
}
YAHOO.util.DDM.refreshCache();
}
}else{
window.dragedElClassName="";
}
}
},200);
node.onmouseup=function(e){
if(!_5bc){
clearTimeout(stop);
me.dragAddressTo.endDrag();
}
};
};
this.dragAddressCc.onDragEnter=function(e,id){
var _5c1=null;
var div=null;
var _5c3=null;
var _5c4=null;
if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)){
if(id.indexOf("Text")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5c1=document.createElement("hr");
_5c1.style.height="2px";
_5c1.style.display="block";
_5c1.style.backgroundColor="gray";
_5c1.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5c1.style.marginTop="-9px";
_5c1.style.borderWidth="2px";
}else{
_5c1.style.borderWidth="1px";
}
div.appendChild(_5c1);
if(id.indexOf("To")>0){
_5c3=document.getElementById("da_messageEditorItemTo");
}else{
if(id.indexOf("Cc")>0){
_5c3=document.getElementById("da_messageEditorItemCc");
}else{
if(id.indexOf("Bcc")>0){
_5c3=document.getElementById("da_messageEditorItemBcc");
}
}
}
_5c4=_5c3.childNodes[0];
if(_5c4){
_5c3.insertBefore(div,_5c3.childNodes[0]);
}else{
_5c3.appendChild(div);
_5c3.style.display="block";
}
}else{
if(id.indexOf("da_ugInformationList")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5c1=document.createElement("hr");
_5c1.style.height="2px";
_5c1.style.display="block";
_5c1.style.backgroundColor="gray";
_5c1.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5c1.style.marginTop="-9px";
_5c1.style.borderWidth="2px";
}else{
_5c1.style.borderWidth="1px";
}
div.appendChild(_5c1);
document.getElementById(id).appendChild(div);
}
}
}
};
this.dragAddressCc.onDragDrop=function(e,id){
var _5c7=null;
var mask=null;
var _5c9=me._controller("cc");
if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)){
if(id){
if(id.match(/da_messageEditorItemToText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemToText");
mask.parentNode.removeChild(mask);
me.insertBeforeNode("cc",me.selectedSno,"to",0,_5c9.get(me.selectedSno));
}else{
if(id.match(/da_messageEditorItemCcText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemCcText");
mask.parentNode.removeChild(mask);
me.moveTop("cc",me.selectedSno,"cc",1);
}else{
if(id.match(/da_messageEditorItemBccText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
mask.parentNode.removeChild(mask);
me.insertBeforeNode("cc",me.selectedSno,"bcc",0,_5c9.get(me.selectedSno));
}else{
if(id.match(/da_ugInformationListToLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"to",id);
_5c7=document.getElementById("insertAddressAfterMark"+id);
if(_5c7){
_5c7.parentNode.removeChild(_5c7);
}
}else{
if(id.match(/da_ugInformationListCcLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"cc",id);
_5c7=document.getElementById("insertAddressAfterMark"+id);
if(_5c7){
_5c7.parentNode.removeChild(_5c7);
}
}else{
if(id.match(/da_ugInformationListBccLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"bcc",id);
_5c7=document.getElementById("insertAddressAfterMark"+id);
if(_5c7){
_5c7.parentNode.removeChild(_5c7);
}
}
}
}
}
}
}
YAHOO.util.Dom.removeClass(id,"da_messageEditorSilver");
}
}
};
this.dragAddressCc.onMouseUp=function(e){
this.getDragEl().innerHTML="";
me.resizeAll();
};
this.bccController=new DA.ug.InformationListController(YAHOO.util.Dom.get("da_messageEditorItemBcc"),null,{onRemove:function(e,sno){
me._hideRnDialog();
me._hideCeDialog();
me._refreshGroupName();
me.doResize();
},onPopup:function(e,sno){
me._hideRnDialog();
me._hideCeDialog();
me.popup.position(YAHOO.util.Event.getPageX(e)+1,YAHOO.util.Event.getPageY(e)+1);
me._showPopupMenu("bcc",sno);
}},{baseId:"da_ugInformationList_bcc",maxView:5});
this.dragAddressBcc=new DA.mailer.AddressDragDrop("da_messageEditorItemBcc","editorAddress",{scroll:false,resizeFrame:false});
this.dragAddressBcc.onMouseDown=function(e){
var cur=this.getDragEl();
var node=YAHOO.util.Event.getTarget(e);
var i,sno,_5d4;
var dst=null;
var _5d6=false;
var stop;
window.dragedElClassName="";
stop=setTimeout(function(){
_5d6=true;
if(node){
if(node.className.match(/da_ugInformationListDragDrop_(\d+)/)){
_5d4=node.parentNode;
if(_5d4){
if(_5d4.className.match(/da_ugInformationListDragDrop_(\d+)/)){
window.dragedElClassName=_5d4.className;
sno=RegExp.$1;
me.selectedFld="bcc";
me.selectedSno=sno;
cur.innerHTML=me.bccController.dummy(sno);
dst=me._controller("to");
dst.scrollTo(0);
dst.showAllAddress();
dst=me._controller("cc");
dst.scrollTo(0);
dst.showAllAddress();
dst=me._controller("bcc");
dst.scrollTo(0);
dst.showAllAddress();
}
YAHOO.util.DDM.refreshCache();
}
}else{
window.dragedElClassName="";
}
}
},200);
node.onmouseup=function(e){
if(!_5d6){
clearTimeout(stop);
me.dragAddressBcc.endDrag();
}
};
};
this.dragAddressBcc.onDragEnter=function(e,id){
var _5db=null;
var div=null;
var _5dd=null;
var _5de=null;
if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)){
if(id.indexOf("Text")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5db=document.createElement("hr");
_5db.style.height="2px";
_5db.style.display="block";
_5db.style.backgroundColor="gray";
_5db.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5db.style.marginTop="-9px";
_5db.style.borderWidth="2px";
}else{
_5db.style.borderWidth="1px";
}
div.appendChild(_5db);
if(id.indexOf("To")>0){
_5dd=document.getElementById("da_messageEditorItemTo");
}else{
if(id.indexOf("Cc")>0){
_5dd=document.getElementById("da_messageEditorItemCc");
}else{
if(id.indexOf("Bcc")>0){
_5dd=document.getElementById("da_messageEditorItemBcc");
}
}
}
_5de=_5dd.childNodes[0];
if(_5de){
_5dd.insertBefore(div,_5dd.childNodes[0]);
}else{
_5dd.appendChild(div);
_5dd.style.display="block";
}
}else{
if(id.indexOf("da_ugInformationList")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5db=document.createElement("hr");
_5db.style.height="2px";
_5db.style.display="block";
_5db.style.backgroundColor="gray";
_5db.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5db.style.marginTop="-9px";
_5db.style.borderWidth="2px";
}else{
_5db.style.borderWidth="1px";
}
div.appendChild(_5db);
document.getElementById(id).appendChild(div);
}
}
}
};
this.dragAddressBcc.onDragDrop=function(e,id){
var _5e1=null;
var mask=null;
var _5e3=me._controller("bcc");
if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)){
if(id){
if(id.match(/da_messageEditorItemToText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemToText");
mask.parentNode.removeChild(mask);
me.insertBeforeNode("bcc",me.selectedSno,"to",0,_5e3.get(me.selectedSno));
}else{
if(id.match(/da_messageEditorItemCcText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemCcText");
mask.parentNode.removeChild(mask);
me.insertBeforeNode("bcc",me.selectedSno,"cc",0,_5e3.get(me.selectedSno));
}else{
if(id.match(/da_messageEditorItemBccText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
mask.parentNode.removeChild(mask);
me.moveTop("bcc",me.selectedSno,"bcc",1);
}else{
if(id.match(/da_ugInformationListToLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"to",id);
_5e1=document.getElementById("insertAddressAfterMark"+id);
if(_5e1){
_5e1.parentNode.removeChild(_5e1);
}
}else{
if(id.match(/da_ugInformationListCcLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"cc",id);
_5e1=document.getElementById("insertAddressAfterMark"+id);
if(_5e1){
_5e1.parentNode.removeChild(_5e1);
}
}else{
if(id.match(/da_ugInformationListBccLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"bcc",id);
_5e1=document.getElementById("insertAddressAfterMark"+id);
if(_5e1){
_5e1.parentNode.removeChild(_5e1);
}
}
}
}
}
}
}
YAHOO.util.Dom.removeClass(id,"da_messageEditorSilver");
}
}
};
this.dragAddressBcc.onMouseUp=function(e){
this.getDragEl().innerHTML="";
me.resizeAll();
};
this.fileController=new DA.file.InformationListController(YAHOO.util.Dom.get("da_messageEditorItemAttachment"),null,{onRemove:function(e,aid){
me.currentSizeNode.innerHTML=me.fileController.total();
me.doResize();
}},{baseId:"da_fileInformationList_attach",maxView:5});
YAHOO.util.Dom.get("da_messageEditorItemToAddress").onclick=function(){
me.openAddress("to");
};
YAHOO.util.Dom.get("da_messageEditorItemCcAddress").onclick=function(){
me.openAddress("cc");
};
YAHOO.util.Dom.get("da_messageEditorItemBccAddress").onclick=function(){
me.openAddress("bcc");
};
YAHOO.util.Dom.get("da_messageEditorItemAddressCcBcc").onclick=function(){
me._showAddressCcBcc();
me.doResize();
};
YAHOO.util.Dom.get("da_messageEditorItemAttachmentButtonsApplet").onclick=function(){
me.createDDApplet({maid:me.selectedMaid});
};
YAHOO.util.Dom.get("da_messageEditorItemAttachmentButtonsLibrary").onclick=function(){
DA.windowController.winOpenNoBar(DA.vars.cgiRdir+"/lib_file_select.cgi?maid="+me.selectedMaid,"library",450,480);
};
YAHOO.util.Dom.get("da_messageEditorItemContentType").onchange=function(){
if(this.value==="html"){
me._text2html();
me._switchContentType(YAHOO.util.Dom.get("da_messageEditorItemContentType").value);
me._hide_spellcheck_menu();
YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value="html";
me._focusHTML();
}else{
if(DA.util.confirm(DA.locale.GetText.t_("MESSAGE_SWITCH_CONTENTTYPE_CONFIRM"))){
me._html2text();
me._switchContentType(YAHOO.util.Dom.get("da_messageEditorItemContentType").value);
me._show_spellcheck_menu();
YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value="text";
me._focusText();
}else{
DA.dom.changeSelectedIndex("da_messageEditorItemContentType","html");
}
}
};
this._addressWidth=this.addressWidth();
this._addressHeight=this.addressHeight();
DA.customEvent.fire("messageEditorInitAfter",this);
},create_RTE:function(){
initRTE(DA.vars.imgRdir+"/richText/","/js/richText/","/css/richText/","","ajxmailer");
writeRichText(this.htmlId+"Contents","","100%",300,true,false,"ja_JP","ajxmailer",this.htmlNode);
},create_FCKeditor:function(){
var _5e7="/dui/richtext/";
var me=this;
window.FCKeditor_OnComplete=function(_5e9){
me._FCKEditorCompleted=true;
};
this.fck=new FCKeditor(this.htmlId+"Contents");
this.fck.BasePath=_5e7;
this.fck.Config.CustomConfigurationsPath=_5e7+DA.vars.richText.fckconfig.custom_file;
if(DA.vars.richText.fckconfig.debug==="1"){
this.fck.ToolbarSet="DEBUG";
}else{
this.fck.ToolbarSet="AJAX";
}
this.fck.Width="100%";
this.fck.Height="100%";
this.fck.Config.AutoDetectLanguage=false;
this.fck.Config.DefaultLanguage=DA.vars.richText.fckconfig.lang;
this.fck.Config.EditorAreaStyles=DA.vars.richText.fckconfig.editor_style;
this.fck.Config.DefaultFontLabel=DA.vars.richText.fckconfig.font;
this.fck.Config.DefaultFontSizeLabel=DA.vars.richText.fckconfig.font_size;
var csrf;
if(DA.vars.check_key_url){
csrf=DA.vars.check_key_url.replace(/^[\&]+/,"").split(/[\=]+/);
this.fck.Config._DA_CSRF_KEY_=csrf[0];
this.fck.Config._DA_CSRF_VALUE_=csrf[1];
}
if(DA.vars.richText.fckconfig.sm_link){
this.fck.Config.InsSelectLink_SM=1;
}else{
this.fck.Config.InsSelectLink_SM=0;
}
if(DA.vars.richText.fckconfig.sh_link){
this.fck.Config.InsSelectLink_OW=1;
}else{
this.fck.Config.InsSelectLink_OW=0;
}
if(DA.vars.richText.fckconfig.lib_link){
this.fck.Config.InsSelectLink_LIB=1;
}else{
this.fck.Config.InsSelectLink_LIB=0;
}
this.htmlNode.innerHTML=this.fck.CreateHtml();
},createDDApplet:function(o){
var _5ec;
var _5ed="<font color=red>"+DA.util.encode(DA.vars.appletDisabledMessage)+"</font>";
var _5ee=YAHOO.util.Dom.get("da_messageEditorItemAttachmentDDApplet");
var _5ef=YAHOO.util.Dom.get("da_messageEditorItemAttachmentButtonsApplet");
if((DA.vars.config.upload_file_applet==="inline"||DA.vars.config.upload_file_applet==="hidden")&&this.ddAppletAfterUpload&&o.maid){
_5ec=["<applet mayscript code=\"at.activ8.a8dropzone.A8Dropzone\" codebase=\""+DA.util.encode(DA.vars.appletRdir)+"\" archive=\""+DA.util.encode(DA.vars.appletFile)+"\" name=\"A8Dropzone\" width=\"100%\" height=\"40px\">","<param name=\"postURL\" value=\""+DA.util.encode(DA.util.getServer()+DA.vars.cgiRdir+"/ajx_ma_upload.cgi?applet=1")+"\">","<param name=\"postParam0\" value=\"key="+DA.util.encode(DA.util.getSessionId())+"\">","<param name=\"postParam1\" value=\"proc=add\">","<param name=\"postParam2\" value=\"maid="+DA.util.encode(o.maid)+"\">","<param name=\"JavaScriptUploadCompleted\" value=\""+DA.util.encode(this.ddAppletUploadCompleted)+"\">","<param name=\"JavaScriptBeforeUpload\" value=\""+DA.util.encode(this.ddAppletBeforeUpload)+"\">","<param name=\"JavaScriptAfterUpload\" value=\""+DA.util.encode(this.ddAppletAfterUpload)+"\">","<param name=\"label\" value=\""+DA.util.encode(DA.vars.appletLabel)+"\">","<param name=\"bgImageName\" value=\""+DA.util.encode(DA.vars.appletImage)+"\">","<param name=\"encoding\" value=\""+DA.util.encode(DA.vars.charset)+"\">","<param name=\"maxFileNum\" value=\""+DA.util.encode(DA.vars.appletMaxFile)+"\">","<param name=\"moreThanMaxMessage\" value=\""+DA.util.encode(DA.vars.appletMoreThanMaxMessage)+"\">","<param name=\"JavaScriptmoreThanMax\" value=\""+DA.util.encode(this.ddAppletAfterMoreThanMax)+"\">","<param name=\"openButton\" value=\""+DA.util.encode(DA.vars.appletFiler)+"\">","<param name=\"directoryUpload\" value=\"false\">",_5ed,"</applet>"].join("");
_5ef.style.display="none";
_5ec="<table width=100%><tr><td width=100%>"+_5ec+"</td><td align=left valign=top><img  src=\""+DA.vars.imgRdir+"/dd_helpico.gif\" title=\""+DA.util.encode(DA.vars.appletTipMessage)+"\" border=0></td></tr></table>";
_5ee.innerHTML=_5ec;
if(_5ee.innerHTML===""){
_5ee.innerHTML=_5ed;
}
this.doResize();
}
},values:function(){
var _5f0={maid:this.selectedMaid,tid:this.selectedTid,sid:this.selectedSid,priority:(this.contentsPairs.expanded)?DA.dom.selectValue("da_messageEditorItemPriority"):DA.dom.selectValue("da_messageEditorItemPriorityCollapse"),charset:DA.dom.selectValue("da_messageEditorItemCharset"),notification:(DA.dom.checkedOk("da_messageEditorItemNotification")?1:0),preview:0,reply_use:(DA.dom.checkedOk("da_messageEditorItemReplyUse")?1:0),group_name:(DA.dom.checkedOk("da_messageEditorItemGroupName")?1:0),open_status:(DA.dom.checkedOk("da_messageEditorItemOpenStatus")?1:0),to_list:this.toController.list(),cc_list:this.ccController.list(),bcc_list:this.bccController.list(),to_text:DA.dom.textValue("da_messageEditorItemToText"),cc_text:DA.dom.textValue("da_messageEditorItemCcText"),bcc_text:DA.dom.textValue("da_messageEditorItemBccText"),from:{select:DA.dom.selectValue("da_messageEditorItemFromAddressSelect")},in_reply_to:DA.dom.hiddenValue("da_messageEditorItemInReplyTo"),references:DA.dom.hiddenValue("da_messageEditorItemReferences"),subject:(this.contentsPairs.expanded)?DA.dom.textValue("da_messageEditorItemSubject"):DA.dom.selectValue("da_messageEditorItemSubjectCollapse"),body:{text:this._getText(),html:this._getHTML()},attach_list:this.fileController.list()};
DA.customEvent.fire("messageEditorValuesAfter",this,_5f0);
return _5f0;
},add:function(o){
if(o.to_list&&o.to_list.length>0){
this.toController.addList(o.to_list);
}
if(o.cc_list&&o.cc_list.length>0){
this._showAddressCcBcc();
this.ccController.addList(o.cc_list);
}
if(o.bcc_list&&o.bcc_list.length>0){
this._showAddressCcBcc();
this.bccController.addList(o.bcc_list);
}
if(o.to_list||o.cc_list||o.bcc_list){
this._refreshGroupName();
}
if(o.attach_list&&o.attach_list.length>0){
this.fileController.addList(o.attach_list);
this.currentSizeNode.innerHTML=this.fileController.total();
}
},set:function(o){
var me=this;
var i,_5f5=["email","keitai_mail","pmail1","pmail2"],html="";
if(o.mode){
this.mode=o.mode;
}
if(DA.util.isNull(o.to_text)){
DA.dom.changeValue("da_messageEditorItemToText","");
}else{
if(o.to_text){
DA.dom.changeValue("da_messageEditorItemToText",o.to_text);
}
}
if(DA.util.isNull(o.cc_text)){
DA.dom.changeValue("da_messageEditorItemCcText","");
}else{
if(o.cc_text){
DA.dom.changeValue("da_messageEditorItemCcText",o.cc_text);
this._showAddressCcBcc();
}
}
if(DA.util.isNull(o.bcc_text)){
DA.dom.changeValue("da_messageEditorItemBccText","");
}else{
if(o.bcc_text){
DA.dom.changeValue("da_messageEditorItemBccText",o.bcc_text);
this._showAddressCcBcc();
}
}
if(o.to_list){
if(this.toController){
this.toController.clear();
this.toController.addList(o.to_list);
}
}
if(o.cc_list){
if(o.cc_list.length>0){
this._showAddressCcBcc();
}
if(this.ccController){
this.ccController.clear();
this.ccController.addList(o.cc_list);
}
}
if(o.bcc_list){
if(o.bcc_list.length>0){
this._showAddressCcBcc();
}
if(this.bccController){
this.bccController.clear();
this.bccController.addList(o.bcc_list);
}
}
if(o.to_list||o.cc_list||o.bcc_list){
this._refreshGroupName();
}
if(o.from){
for(i=0;i<_5f5.length;i++){
if(!DA.util.isEmpty(o.from[_5f5[i]])){
html+="<option value=\""+_5f5[i]+"\">"+DA.util.encode(o.from[_5f5[i]])+"</option>";
}
}
if(!DA.util.isEmpty(html)){
html=DA.util.encode("<")+"<select id=\"da_messageEditorItemFromAddressSelect\" disabled=\"disabled\">"+html+"</select>"+DA.util.encode(">");
YAHOO.util.Dom.get("da_messageEditorItemFromAddress").innerHTML=html;
DA.dom.changeSelectedIndex("da_messageEditorItemFromAddressSelect",o.from.select);
me.selectedFrom=YAHOO.util.Dom.get("da_messageEditorItemFromAddressSelect").value;
YAHOO.util.Dom.get("da_messageEditorItemFromAddressSelect").onchange=function(){
if(YAHOO.util.Dom.get("da_messageEditorItemFromAddressSelect").value==="keitai_mail"){
if(!DA.util.isNull(o.from.nameM)){
YAHOO.util.Dom.get("da_messageEditorItemFromName").innerHTML=DA.util.encode(o.from.nameM)+"&nbsp;";
}
DA.dom.changeSelectedIndex("da_messageEditorItemSign",o.sign_init.sign_init_pM);
me.sign(o.sign_init.sign_init_pM,me.selectedSid,"keitai_mail",me.selectedFrom);
}else{
if(YAHOO.util.Dom.get("da_messageEditorItemFromAddressSelect").value==="email"){
if(!DA.util.isNull(o.from.name)){
YAHOO.util.Dom.get("da_messageEditorItemFromName").innerHTML=DA.util.encode(o.from.name)+"&nbsp;";
}
DA.dom.changeSelectedIndex("da_messageEditorItemSign",o.sign_init.sign_init_p);
me.sign(o.sign_init.sign_init_p,me.selectedSid,"email",me.selectedFrom);
}else{
if(YAHOO.util.Dom.get("da_messageEditorItemFromAddressSelect").value==="pmail1"){
if(!DA.util.isNull(o.from.name1)){
YAHOO.util.Dom.get("da_messageEditorItemFromName").innerHTML=DA.util.encode(o.from.name1)+"&nbsp;";
}
DA.dom.changeSelectedIndex("da_messageEditorItemSign",o.sign_init.sign_init_p1);
me.sign(o.sign_init.sign_init_p1,me.selectedSid,"pmail1",me.selectedFrom);
}else{
if(!DA.util.isNull(o.from.name2)){
YAHOO.util.Dom.get("da_messageEditorItemFromName").innerHTML=DA.util.encode(o.from.name2)+"&nbsp;";
}
DA.dom.changeSelectedIndex("da_messageEditorItemSign",o.sign_init.sign_init_p2);
me.sign(o.sign_init.sign_init_p2,me.selectedSid,"pmail2",me.selectedFrom);
}
}
}
};
}
if(YAHOO.util.Dom.get("da_messageEditorItemFromAddressSelect").value==="keitai_mail"){
if(!DA.util.isNull(o.from.nameM)){
YAHOO.util.Dom.get("da_messageEditorItemFromName").innerHTML=DA.util.encode(o.from.nameM)+"&nbsp;";
}
}else{
if(YAHOO.util.Dom.get("da_messageEditorItemFromAddressSelect").value==="email"){
if(!DA.util.isNull(o.from.name)){
YAHOO.util.Dom.get("da_messageEditorItemFromName").innerHTML=DA.util.encode(o.from.name)+"&nbsp;";
}
}else{
if(YAHOO.util.Dom.get("da_messageEditorItemFromAddressSelect").value==="pmail1"){
if(!DA.util.isNull(o.from.name1)){
YAHOO.util.Dom.get("da_messageEditorItemFromName").innerHTML=DA.util.encode(o.from.name1)+"&nbsp;";
}
}else{
if(!DA.util.isNull(o.from.name2)){
YAHOO.util.Dom.get("da_messageEditorItemFromName").innerHTML=DA.util.encode(o.from.name2)+"&nbsp;";
}
}
}
}
}
if(DA.util.isNull(o.subject)){
DA.dom.changeValue("da_messageEditorItemSubject","");
}else{
if(o.subject){
DA.dom.changeValue("da_messageEditorItemSubject",o.subject);
}
}
if(o.priority){
DA.dom.changeSelectedIndex("da_messageEditorItemPriority",o.priority);
}
if(o.charset){
DA.dom.changeSelectedIndex("da_messageEditorItemCharset",o.charset);
}
if(o.notification){
if(o.notification===1){
DA.dom.changeChecked("da_messageEditorItemNotification",true);
}else{
DA.dom.changeChecked("da_messageEditorItemNotification",false);
}
}
if(o.open_status){
if(o.open_status===1){
DA.dom.changeChecked("da_messageEditorItemOpenStatus",true);
}else{
DA.dom.changeChecked("da_messageEditorItemOpenStatus",false);
}
}
if(o.group_name){
if(o.group_name===1){
DA.dom.changeChecked("da_messageEditorItemGroupName",true);
}else{
DA.dom.changeChecked("da_messageEditorItemGroupName",false);
}
}
if(o.reply_use){
if(o.reply_use===1){
DA.dom.changeChecked("da_messageEditorItemReplyUse",true);
}else{
DA.dom.changeChecked("da_messageEditorItemReplyUse",false);
}
}
if(DA.util.isNull(o.in_reply_to)){
DA.dom.changeValue("da_messageEditorItemInReplyTo","");
}else{
if(o.in_reply_to){
DA.dom.changeValue("da_messageEditorItemInReplyTo",o.in_reply_to);
}
}
if(DA.util.isNull(o.references)){
DA.dom.changeValue("da_messageEditorItemReferences","");
}else{
if(o.references){
DA.dom.changeValue("da_messageEditorItemReferences",o.references);
}
}
if(o.attach_list){
if(this.fileController){
this.fileController.clear();
this.fileController.addList(o.attach_list);
this.currentSizeNode.innerHTML=this.fileController.total();
}
}
if(o.body){
if(o.content_type_all==="text"){
this._switchContentType("text");
this._setText(o.body.text);
this._setHTML("");
YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value="text";
YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").innerHTML=DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CONTENTTYPE")+"&nbsp;:&nbsp;"+DA.locale.GetText.t_("MESSAGE_CONTENTTYPE_TEXT")+"&nbsp;&nbsp;";
}else{
if(o.content_type_all==="html"){
this._hide_spellcheck_menu();
this._switchContentType("html");
this._setHTML(o.body.html);
this._setText("");
YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value="html";
YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").innerHTML=DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CONTENTTYPE")+"&nbsp;:&nbsp;"+DA.locale.GetText.t_("MESSAGE_CONTENTTYPE_HTML")+"&nbsp;&nbsp;";
}else{
if(o.content_type==="html"){
this._hide_spellcheck_menu();
this._switchContentType("html");
this._setHTML(o.body.html);
this._setText("");
DA.dom.changeSelectedIndex("da_messageEditorItemContentType","html");
YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value="html";
}else{
this._switchContentType("text");
this._setText(o.body.text);
this._setHTML("");
DA.dom.changeSelectedIndex("da_messageEditorItemContentType","text");
YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value="text";
}
}
}
}
if(o.title_list){
this.titleList=o.title_list;
}
if(o.lang_list){
this.langList=o.lang_list;
}
if(o.sign_list){
this.signList=o.sign_list;
this.selectedSid=o.sid;
this.selectedFrom=o.from.select;
html="";
for(i=0;i<this.signList.length;i++){
html+="<option value=\""+DA.util.encode(this.signList[i].sid)+"\">"+DA.util.encode(this.signList[i].name)+"</option>";
}
if(!DA.util.isEmpty(html)){
html="<select id=\"da_messageEditorItemSign\" disabled=\"disabled\">"+html+"</select>";
YAHOO.util.Dom.get("da_messageEditorItemSignList").innerHTML=html;
DA.dom.changeSelectedIndex("da_messageEditorItemSign",o.sid);
YAHOO.util.Dom.get("da_messageEditorItemSign").onchange=function(){
me.sign(DA.dom.selectValue(YAHOO.util.Dom.get("da_messageEditorItemSign")),me.selectedSid,DA.dom.selectValue(YAHOO.util.Dom.get("da_messageEditorItemFromAddressSelect")),me.selectedFrom);
};
}
}else{
if(!DA.util.isEmpty(o.sid)){
this.selectedSid=o.sid;
this.selectedFrom=o.before_from;
DA.dom.changeSelectedIndex("da_messageEditorItemSign",o.sid);
}
}
},setPreview:function(o){
var _5f8,_5f9;
var _5fa=/^<\!-- Created by DA_Richtext .*? end default style -->/;
var _5fb=/<style>.*?<\/style>/;
this._setWarn(o.warn);
if(o.to_list){
this.previewPairs.changeValue("To",DA.ug.list2String(o.to_list,3));
if(o.to_list.length>DA.vars.config.mail_to_resize_num){
this.previewPairs.scrollSeparator("To");
this.previewPairs.showCursor("Cc");
}else{
this.previewPairs.unscrollSeparator("To");
this.previewPairs.hideCursor("Cc");
}
}else{
this.previewPairs.changeValue("To","");
this.previewPairs.unscrollSeparator("To");
}
if(o.cc_list){
this.previewPairs.changeValue("Cc",DA.ug.list2String(o.cc_list,3));
if(o.cc_list.length>DA.vars.config.mail_to_resize_num){
this.previewPairs.scrollSeparator("Cc");
this.previewPairs.showCursor("Bcc");
}else{
this.previewPairs.unscrollSeparator("Cc");
this.previewPairs.hideCursor("Bcc");
}
}else{
this.previewPairs.changeValue("Cc","");
this.previewPairs.unscrollSeparator("Cc");
}
if(o.bcc_list){
this.previewPairs.changeValue("Bcc",DA.ug.list2String(o.bcc_list,3));
if(o.bcc_list.length>DA.vars.config.mail_to_resize_num){
this.previewPairs.scrollSeparator("Bcc");
this.previewPairs.showCursor("Date");
}else{
this.previewPairs.unscrollSeparator("Bcc");
this.previewPairs.hideCursor("Date");
}
}else{
this.previewPairs.changeValue("Bcc","");
this.previewPairs.unscrollSeparator("Bcc");
}
if(o.from_list){
this.previewPairs.changeValue("From",DA.ug.list2String(o.from_list,3));
if(o.from_list.length>12){
this.previewPairs.scrollSeparator("From");
}else{
this.previewPairs.unscrollSeparator("From");
}
}else{
this.previewPairs.changeValue("From","");
this.previewPairs.unscrollSeparator("From");
}
if(o.attach_list){
this.previewPairs.changeValue("Attachment",DA.file.list2String(o.attach_list,3));
}else{
this.previewPairs.changeValue("Attachment","");
}
this.previewPairs.changeValue("Subject",DA.util.encode(o.subject));
FCKEditorIframeController.removeIframe(this.previewId+"Contents"+"FckEditorPreViewer",this.previewContentsNode);
if(DA.util.isEmpty(o.body.html)){
if(DA.util.isEmpty(o.body.text)){
this.previewContentsNode.innerHTML="";
}else{
if(DA.vars.config.b_wrap==="on"){
this.previewContentsNode.innerHTML=o.body.text;
}else{
this.previewContentsNode.innerHTML="<pre style=\"height:100%;\">"+o.body.text+"</pre>";
}
}
}else{
if(FCKEditorIframeController.isFCKeditorData(o.body.html)){
_5f8=o.body.html.match(_5fb);
_5f9=o.body.html.replace(_5fb,"");
FCKEditorIframeController.createIframe(this.previewId+"Contents"+"FckEditorPreViewer",this.previewContentsNode);
FCKEditorIframeController.setIframeBody(this.previewId+"Contents"+"FckEditorPreViewer",["<head>",_5f8,"<style>body {margin:0px; padding:0px; border:0;}</style>","<script>function Pop4Ajax(Url,Width,Height,POSX,POSY){ top.Pop4Ajax(Url,Width,Height,POSX,POSY);}</script>","</head>","<body>","<div style=\"word-break:break-all\">",_5f9,"</div>","</body>"].join("\n"));
}else{
this.previewContentsNode.innerHTML=o.body.html;
}
}
},edit:function(_5fc){
var me=this;
var h={proc:_5fc.proc};
var _5ff;
var _600;
var _601;
var i=0;
if(me.lock()){
me.jsonIO.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me.selectedFid=parseInt(_5fc.fid,10);
me.proc=_5fc.proc;
if(me.proc==="new"){
me.selectedUid=null;
}else{
me.selectedUid=parseInt(_5fc.uid,10);
}
me.selectedMaid=o.maid;
me.selectedTid=(DA.util.isEmpty(o.tid))?"":o.tid;
if(DA.vars.config.upload_file_applet==="inline"){
me.createDDApplet(o);
}else{
if(DA.vars.config.upload_file_applet==="hidden"){
YAHOO.util.Dom.get("da_messageEditorItemAttachmentButtonsApplet").disabled=false;
}
}
me.set(o);
me.doResize();
me.onLoad(o);
if(o.hide_save_button==="true"){
window.__topPanel.panelMenu.hide("save");
}
if(DA.vars.system.auto_backup_on===1&&DA.vars.config.backup==="on"){
me.setAutoBackup();
}
DA.customEvent.fire("messageEditorOnLoadDoneAfter",me,o);
}else{
DA.windowController.allClose();
window.close();
}
me.unlock();
me.onEnable();
me._enableButtons();
};
me.jsonIO.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_EDIT_ERROR"));
me.unlock();
};
if(DA.util.isEmpty(_5fc.url)){
if(!DA.util.isEmpty(_5fc.fid)){
h.fid=_5fc.fid;
h.uid=_5fc.uid;
}
if(!DA.util.isEmpty(_5fc.backup_maid)){
h.backup_maid=_5fc.backup_maid;
me.backup_maid=_5fc.backup_maid;
}
if(!DA.util.isEmpty(_5fc.tid)){
h.tid=_5fc.tid;
}
if(!DA.util.isEmpty(_5fc.quote)){
h.quote=_5fc.quote;
}
me.jsonIO.execute(h);
}else{
h=DA.util.parseQuery(DA.util.pack(_5fc.url));
me.jsonIO.execute(h);
}
}
},setAutoBackup:function(){
this._autoBackup();
},_autoBackup:function(){
var me=this;
var val,_607,xml,_609,io;
if(me.lock()){
val=me.values();
me.unlock();
xml=DA.util.makeXml(val,"ajx_ma_new.cgi");
_609=xml;
_609=_609.replace(/!-- start default style.*!-- end default style/ig,"");
if(me.autoBackupedXML===_609){
setTimeout(function(){
me._autoBackup();
},me.autoBackupTimeout);
}else{
io=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_new.cgi");
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
if(!DA.util.isEmpty(o.result.error)&&o.result.error!==0&&DA.util.isEmpty(me.backup_timeout_msg_alerted)){
me.backup_timeout_msg_alerted=1;
DA.util.warn(o.result.message);
}else{
if(DA.util.isEmpty(o.result.error)||o.result.error===0){
me.backup_maid=o.result.backup_maid;
}
}
me.autoBackupedXML=_609;
setTimeout(function(){
me._autoBackup();
},me.autoBackupTimeout);
}else{
setTimeout(function(){
me._autoBackup();
},me.autoBackupTimeout);
}
};
io.errorHandler=function(e){
setTimeout(function(){
me._autoBackup();
},me.autoBackupTimeout);
};
io.execute({proc:"backup",maid:me.selectedMaid,backup_maid:me.backup_maid,Preproc:me.proc,uid:me.selectedUid,xml:xml,content_type:YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value});
}
}else{
setTimeout(function(){
me._autoBackup();
},me.autoBackupTimeout);
}
},template:function(tid){
var me=this;
var io;
var type;
if(null===document.getElementById("da_messageEditorItemContentType")){
type=YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value||"text";
}else{
type=YAHOO.util.Dom.get("da_messageEditorItemContentType").value||"text";
}
if(me.lock()){
if(DA.util.confirm(DA.locale.GetText.t_("MESSAGE_TEMPLATE_CONFIRM"))){
io=this.tmplIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me.selectedTid=(DA.util.isEmpty(o.tid))?"":o.tid;
me.set(o);
me.selectedFrom=DA.dom.selectValue(YAHOO.util.Dom.get("da_messageEditorItemFromAddressSelect"));
me.doResize();
}
me.unlock();
};
io.errorHandler=function(o){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_TEMPLATE_ERROR"));
me.unlock();
};
io.execute({tid:tid,from:DA.dom.selectValue(YAHOO.util.Dom.get("da_messageEditorItemFromAddressSelect")),content_type:type,content_type_all:YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value});
}else{
me.unlock();
}
}
},sign:function(sid,_614,from,_616){
var me=this;
var io,_619,body;
if(me.lock()){
io=this.signIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me.selectedSid=o.sid;
me.selectedFrom=o.before_from;
me.set(o);
me.doResize();
}
me.unlock();
};
io.errorHandler=function(o){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_SIGN_ERROR"));
me.unlock();
};
_619=DA.dom.selectValue("da_messageEditorItemContentTypeAll");
body=(_619==="html")?this._getHTML():this._getText();
io.execute({sid:sid,before_sid:_614,content_type:_619,from:from,before_from:_616,body:body});
}
},transmit:function(){
var me=this;
var _61e=this.spellcheckMode;
var id;
var _620=0;
var msg;
if(me.lock()){
if(this.previewMode||!this.isEmpty(DA.dom.textValue("da_messageEditorItemSubject"))||!this.isEmpty(DA.dom.textValue("da_messageEditorItemSubjectCollapse"))||DA.util.confirm(DA.locale.GetText.t_("EDITOR_TITLEEMPTY_TRANSMIT_CONFIRM"))){
if(DA.tipDlg.isInit()){
DA.tipDlg.hide();
}
me.forced_interruption=0;
msg=DA.locale.GetText.t_("TRANSMIT_OPERATING_PROMPT")+"</span><br><span style=\"font-size:10px;color:red;\">&nbsp;"+DA.locale.GetText.t_("FORCED_INTERRUPTION_COMMENT")+"&nbsp;";
if(DA.vars.config.forced_interruption==="on"){
DA.waiting.show(msg,null,[{string:DA.locale.GetText.t_("FORCED_INTERRUPTION"),onclick:function(){
me.forced_interruption=1;
alert(DA.locale.GetText.t_("FORCED_INTERRUPTION_ALERT"));
me.onForcedInterruption();
me.unlock();
DA.waiting.hide();
}}],"transmit");
}else{
DA.waiting.show(DA.locale.GetText.t_("TRANSMIT_OPERATING_PROMPT"));
}
id=setInterval(function(){
var io,val,xml;
_620+=1;
if(_620>DA.vars.system.upload_retry4ajx){
clearInterval(id);
DA.util.warn(DA.locale.GetText.t_("MESSAGE_ATTACHMENT_UPLOAD_ERROR"));
me.unlock();
DA.waiting.hide();
}
if(!DA.io.Manager.isActive()&&!me.isUploading()){
clearInterval(id);
io=me.jsonIO;
val=me.values();
xml=DA.util.makeXml(val,"ajx_ma_new.cgi");
io.callback=function(o){
if(me.forced_interruption!==1){
DA.waiting.hide();
setTimeout(function(){
var _626="";
var i;
var _628;
if(DA.mailer.util.checkResult(o)){
if(o.warn&&o.warn.length>0){
if(DA.tipDlg&&"function"===typeof DA.tipDlg.init){
for(i=0;i<o.warn.length;i++){
_626+="[ ! ] "+o.warn[i]+"<br>";
if(o.warn[i]===DA.locale.GetText.t_("SPELLCHECK_NG")){
_628="preview";
}
}
DA.tipDlg.init(DA.locale.GetText.t_("MAIL_SEND_CONFIRM"),DA.locale.GetText.t_("READY_OK"),_626,_628);
}
me.setPreview(o);
me._switchPreviewMode(true);
me.doResize();
me.onPreview();
DA.tipDlg.show();
}else{
if(!me.external){
try{
DA.mailer.Events.onMessageSent.fire({uid:me.selectedUid,fid:me.selectedFid,mode:me.mode},o);
}
catch(e){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_TRANSMIT_ERROR2"));
}
}
DA.windowController.allClose();
me.close();
}
}
me.unlock();
},500);
}
};
io.errorHandler=function(o){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_TRANSMIT_ERROR"));
me.unlock();
DA.waiting.hide();
};
io.execute({proc:"send",maid:me.selectedMaid,backup_maid:me.backup_maid,Preproc:me.proc,fid:me.selectedFid,uid:me.selectedUid,mode:me.mode,xml:xml,nopreview:(me.previewMode)?1:0,spellcheck:_61e,content_type:YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value,external:this.external?1:0});
}
},1000);
}else{
me.unlock();
}
}
},save:function(){
var me=this;
var id;
var _62c=0;
var _62d=0;
if(me.lock()){
if(this.previewMode||!DA.util.isEmpty(DA.dom.textValue("da_messageEditorItemSubject"))||!DA.util.isEmpty(DA.dom.textValue("da_messageEditorItemSubjectCollapse"))||DA.util.confirm(DA.locale.GetText.t_("EDITOR_TITLEEMPTY_SAVE_CONFIRM"))){
if(DA.tipDlg.isInit()){
DA.tipDlg.hide();
}
DA.waiting.show(DA.locale.GetText.t_("SAVE_OPERATING_PROMPT"));
id=setInterval(function(){
var io,val,xml;
_62d+=1;
if(_62d>DA.vars.system.upload_retry4ajx){
clearInterval(id);
DA.util.warn(DA.locale.GetText.t_("MESSAGE_ATTACHMENT_UPLOAD_ERROR"));
me.unlock();
DA.waiting.hide();
}
if(!DA.io.Manager.isActive()&&!me.isUploading()){
clearInterval(id);
io=me.jsonIO;
val=me.values();
xml=DA.util.makeXml(val,"ajx_ma_new.cgi");
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
_62c=1;
if(!me.external){
DA.mailer.Events.onMessageSaved.fire({uid:me.selectedUid,fid:me.selectedFid},o);
}
me.unlock();
DA.waiting.hide();
if(o.save_target){
DA.util.warn(DA.locale.GetText.t_("SAVE_MAIL_MESSAGE",o.save_target));
DA.windowController.allClose();
me.close();
}
}else{
me.unlock();
DA.waiting.hide();
}
};
io.errorHandler=function(o){
if(_62c===1){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_SAVE_ERROR2"));
}else{
DA.util.warn(DA.locale.GetText.t_("MESSAGE_SAVE_ERROR"));
}
me.unlock();
DA.waiting.hide();
};
io.execute({proc:"draft",maid:me.selectedMaid,backup_maid:me.backup_maid,Preproc:me.proc,uid:me.selectedUid,fid:me.selectedFid,xml:xml,content_type:YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value,external:this.external?1:0});
}
},1000);
}else{
me.unlock();
}
}
},preview:function(){
var me=this;
var _634=this.spellcheckMode;
var id;
if(me.lock()){
id=setInterval(function(){
var io,val,xml;
if(!DA.io.Manager.isActive()&&!me.isUploading()){
clearInterval(id);
io=me.jsonIO;
val=me.values();
xml=DA.util.makeXml(val,"ajx_ma_new.cgi");
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me.setPreview(o);
me._switchPreviewMode(true);
me.doResize();
me.onPreview();
}
me.unlock();
};
io.errorHandler=function(o){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_PREVIEW_ERROR"));
me.unlock();
};
io.execute({proc:"preview",maid:me.selectedMaid,uid:me.selectedUid,fid:me.selectedFid,xml:xml,spellcheck:_634,content_type:YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value});
}
},1000);
}
},print:function(_63b){
var me=this;
var id;
if(me.lock()){
id=setInterval(function(){
var io,val,xml;
if(!DA.io.Manager.isActive()&&!me.isUploading()){
clearInterval(id);
io=me.jsonIO;
val=me.values();
xml=DA.util.makeXml(val,"ajx_ma_new.cgi");
io.callback=function(o){
DA.windowController.winOpen(DA.vars.cgiRdir+"/ma_ajx_print.cgi?maid="+me.selectedMaid+"&content_type="+YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value+"&printtoconfig="+_63b,"",710,600);
me.unlock();
};
io.errorHandler=function(o){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_PRINT_ERROR"));
me.unlock();
};
io.execute({proc:"print",maid:me.selectedMaid,xml:xml,content_type:YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value});
}
},1000);
}
},spellcheck:function(_643,_644){
this.spellcheckMode=_643;
if(_644==="preview"){
this.preview();
}else{
if(_644==="transmit"){
this.transmit();
}
}
this.spellcheckMode=DA.vars.config.spellcheck_mode;
},back:function(){
if(!this.existsLock()){
if(DA.tipDlg.isInit()){
DA.tipDlg.hide();
}
this._switchPreviewMode(false);
this.onBack();
if(YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value==="html"){
this._hide_spellcheck_menu();
}else{
this._show_spellcheck_menu();
}
}
},addressWidth:function(w){
if(w){
DA.session.Values.registerValue("addressWindowWidth",w);
}
return DA.session.Values.getValue("addressWindowWidth")||DA.vars.config.width_addr;
},addressHeight:function(h){
if(h){
DA.session.Values.registerValue("addressWindowHeight",h);
}
return DA.session.Values.getValue("addressWindowHeight")||DA.vars.config.height_addr;
},setAddressWindowSize:function(self){
var _648=self.document;
var _649=function(){
var mode=_648.compatMode;
var _64b=(mode==="CSS1Compat")?_648.documentElement.clientWidth:_648.body.clientWidth;
return _64b;
};
var _64c=function(){
var mode=_648.compatMode;
var _64e=(mode==="CSS1Compat")?_648.documentElement.clientHeight:_648.body.clientHeight;
return _64e;
};
var _64f=_649();
var _650=_64c();
try{
this.addressWidth(_64f);
this.addressHeight(_650);
}
catch(e){
}
},close:function(){
DA.mailer.checkSession();
var io=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_config.cgi");
var s={editorWidth:YAHOO.util.Dom.getViewportWidth(),editorHeight:YAHOO.util.Dom.getViewportHeight(),addressWidth:this.addressWidth(),addressHeight:this.addressHeight()};
var h={proc:"editor"};
if(s.editorWidth){
h.editor_window_width=s.editorWidth;
}
if(s.editorHeight){
h.editor_window_height=s.editorHeight;
}
if(s.addressWidth){
h.address_window_width=s.addressWidth;
}
if(s.addressHeight){
h.address_window_height=s.addressHeight;
}
if(s.editorWidth!==DA.mailer.windowController.editorWidth()||s.editorHeight!==DA.mailer.windowController.editorHeight()||s.addressWidth!==this._addressWidth||s.addressHeight!==this._addressHeight){
if(s.editorWidth){
DA.mailer.windowController.editorWidth(s.editorWidth);
}
if(s.editorHeight){
DA.mailer.windowController.editorHeight(s.editorHeight);
}
io.callback=function(){
window.close();
};
io.errorHandler=function(){
window.close();
};
io.execute(h);
}else{
window.close();
}
},openAddress:function(fld){
var _655="";
var Proc="ma_address.cgi%3ffld="+fld+":"+this.selectedMaid+"%20search_target="+_655;
var Img="pop_title_adrbook.gif";
if(DA.vars.custom.editor.setAddressProc){
eval(DA.vars.custom.editor.setAddressProc);
}
if(DA.util.isEmpty(this.selectedMaid)){
return;
}else{
DA.mailer.checkSession();
DA.windowController.isePopup(Proc,Img,this.addressWidth(),this.addressHeight(),this.selectedMaid);
}
},setAddress:function(){
var me=this;
var io;
if(!me.existsLock()){
io=this.jsonIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me.add(o);
me.doResize();
}
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("ADDRESS_SET_ERROR"));
};
io.execute({proc:"address",maid:this.selectedMaid});
}
},upload:function(){
var me=this;
var io,i,time,_660,name;
if(!me.existsLock()){
time=DA.util.getTime();
_660=me.currentUploadForm;
for(i=0;i<_660.childNodes.length;i++){
switch(_660.childNodes[i].name){
case "path":
name=_660.childNodes[i].value;
break;
case "maid":
_660.childNodes[i].value=me.selectedMaid;
break;
default:
break;
}
}
if(!name.match(/^\s*$/)){
me._hideUploadForm(_660);
me._addUploadForm();
me.fileController.add({aid:"dummy_"+time,name:name,size:0,icon:"",warn:"",link:"",document:""});
me.uploading[time]=true;
me.doResize();
io=new DA.io.FileUploadIO(DA.vars.cgiRdir+"/ajx_ma_upload.cgi");
io.callback=function(o,args){
me.fileController.remove("dummy_"+args.time);
me._removeUploadForm(_660);
if(DA.mailer.util.checkResult(o)){
me.add(o);
me.doResize();
}
me.uploading[args.time]=false;
};
io.errorHandler=function(e,args){
DA.util.warn(DA.locale.GetText.t_("UPLOAD_ERROR"));
me.fileController.remove("dummy_"+args.time);
me._removeUploadForm(_660);
me.uploading[args.time]=false;
me.doResize();
};
io.execute(_660,{time:time});
}
}
},isUploading:function(){
var time,_667=false;
for(time in this.uploading){
if(!DA.util.isFunction(this.uploading[time])){
if(this.uploading[time]){
_667=true;
}
}
}
return _667;
},_addUploadForm:function(){
var me=this;
var form=document.createElement("form");
var proc=document.createElement("input");
var maid=document.createElement("input");
var path=document.createElement("input");
var size=document.createElement("span");
var icon=document.createElement("img");
form.id="da_messageEditorItemAttachmentForm_"+DA.util.getTime();
proc.type="hidden";
proc.name="proc";
proc.value="add";
maid.type="hidden";
maid.name="maid";
path.type="file";
path.name="path";
path.className="da_messageEditorItemFile";
path.onchange=function(){
me.upload();
};
if(BrowserDetect.browser==="Explorer"){
path.onkeydown=function(){
var _66f=YAHOO.util.Event.getCharCode(event);
if(_66f===Event.KEY_ESC){
return false;
}else{
if(path.value.match(/^\s*$/)&&_66f===Event.KEY_RETURN){
return false;
}
}
return true;
};
}
if(this.fileController){
size.innerHTML=this.fileController.total();
}
icon.src=DA.vars.imgRdir+"/aqbtn_attach.gif";
icon.onclick=function(){
path.click();
};
form.appendChild(proc);
form.appendChild(maid);
form.appendChild(path);
form.appendChild(size);
form.appendChild(icon);
if(BrowserDetect.browser==="Explorer"){
icon.style.display="none";
}else{
icon.style.display="none";
}
YAHOO.util.Dom.get("da_messageEditorItemAttachmentFormOuter").appendChild(form);
this.currentUploadForm=form;
this.currentSizeNode=size;
},disableUploadForm:function(){
if(BrowserDetect.browser==="Explorer"){
this.currentUploadForm.disabled=true;
}else{
this.currentUploadForm.path.disabled=true;
}
},enableUploadForm:function(){
if(BrowserDetect.browser==="Explorer"){
this.currentUploadForm.disabled=false;
}else{
this.currentUploadForm.path.disabled=false;
}
},_hideUploadForm:function(){
this.currentUploadForm.style.display="none";
},_removeUploadForm:function(node){
node.parentNode.removeChild(node);
},_switchPreviewMode:function(mode){
if(mode){
this.contentsPairs.hide();
this.previewPairs.show();
this._hideBodyText();
this._hideBodyHTML();
this._showWarn();
this._showBodyPreview();
this.previewMode=true;
}else{
this.previewPairs.hide();
this.contentsPairs.show();
this._hideWarn();
this._hideBodyPreview();
if(YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value==="html"){
this._showBodyHTML();
this._focusHTML();
}else{
if(YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value==="text"){
this._showBodyText();
this._focusText();
}else{
if(DA.dom.selectValue("da_messageEditorItemContentType")==="html"){
this._showBodyHTML();
this._focusHTML();
}else{
this._showBodyText();
this._focusText();
}
}
}
this.previewMode=false;
this.doResize();
}
},_switchContentType:function(_672){
if(_672==="text"){
this._hideBodyHTML();
this._showBodyText();
}else{
this._hideBodyText();
this._showBodyHTML();
}
},_hideBodyText:function(){
this.textNode.style.display="none";
},_showBodyText:function(){
this.textNode.style.display="";
},_hideBodyHTML:function(){
this.htmlNode.style.display="none";
},_showBodyHTML:function(){
this.htmlNode.style.display="";
},_hideBodyPreview:function(){
this.previewNode.style.display="none";
},_showBodyPreview:function(){
this.previewNode.style.display="";
},_getText:function(){
return DA.dom.textAreaValue("da_messageEditorItemText");
},_getHTML:function(opt){
if(!DA.vars.richText){
return;
}
if(DA.vars.richText.type==="crossbrowser"){
return this._getRTEHTML(opt);
}else{
if(DA.vars.richText.type==="fckeditor"){
return this._getFCKHTML(opt);
}else{
}
}
},_getRTEHTML:function(opt){
try{
if(opt){
if(BrowserDetect.browser==="Explorer"){
return this.htmlContentsNode.contentWindow.document.body.innerText;
}else{
return this.htmlContentsNode.contentDocument.body.textContent.replace(/\xA0/g," ");
}
}else{
return this.htmlContentsNode.contentWindow.document.body.innerHTML;
}
}
catch(e){
}
},_getFCKHTML:function(opt){
try{
this.fckAPIs=FCKeditorAPI.GetInstance(this.fck.InstanceName);
if(opt){
if(BrowserDetect.browser==="Explorer"){
return this.fckAPIs.EditorDocument.body.innerText;
}else{
return this.fckAPIs.EditorDocument.body.textContent.replace(/\xA0/g," ");
}
}else{
return this.fckAPIs.GetXHTML();
}
}
catch(e){
}
},_setText:function(text){
DA.dom.changeValue("da_messageEditorItemText",text);
this._focusText();
},_focusText:function(){
var me=this;
setTimeout(function(){
if(me.textNode.style.display!=="none"){
YAHOO.util.Dom.get("da_messageEditorItemText").focus();
}
},200);
},_setHTML:function(html){
if(!DA.vars.richText){
return;
}
switch(DA.vars.richText.type){
case "crossbrowser":
this._setRTEHTML(html);
break;
case "fckeditor":
this._setFCKHTML(html);
break;
}
},_setRTEHTML:function(html){
this.htmlContentsNode.contentWindow.document.body.innerHTML=(DA.util.isEmpty(html))?"":html;
},_setFCKHTML:function(html){
var me=this;
setTimeout(function(){
if(me._FCKEditorCompleted===true){
if(!me.fckAPIs){
me.fckAPIs=FCKeditorAPI.GetInstance(me.fck.InstanceName);
me.fckAPIs.Events.AttachEvent("OnAfterSetHTML",function(){
if(DA.dom.selectValue("da_messageEditorItemContentTypeAll")==="html"){
me._focusHTML();
}
});
}
me.fckAPIs.SetHTML(DA.util.isEmpty(html)?"":html);
}else{
me._setFCKHTML(html);
}
},100);
},_focusHTML:function(){
if(DA.vars.richText.type==="crossbrowser"){
this._focusRTEHTML();
}else{
clearTimeout(this._focusTimeout);
this._focusFCKHTML();
}
},_focusRTEHTML:function(){
this.htmlContentsNode.focus();
},_focusFCKHTML:function(){
var me=this;
if(window.document.focus){
window.document.focus();
}else{
window.focus();
}
me.fckAPIs.Focus();
setTimeout(function(){
if(!me.fckAPIs.HasFocus){
me._focusFCKHTML();
}
},500);
},_text2html:function(){
this._setHTML(DA.util.encode(this._getText(),2,0,1));
},_html2text:function(){
this._setText(this._getHTML(1));
},_setWarn:function(warn){
var i,str="";
if(warn.length>0){
for(i=0;i<warn.length;i++){
str+="[ ! ] "+warn[i]+"<br>";
}
str+=DA.locale.GetText.t_("READY_OK")+"<br>";
}else{
str="&nbsp;";
}
this.warnNode.innerHTML=str;
},_showWarn:function(){
if(this.warnNode.innerHTML!=="&nbsp;"){
this.warnNode.style.display="";
}
},_hideWarn:function(){
this.warnNode.style.display="none";
},_refreshGroupName:function(){
var to=this._controller("to");
var cc=this._controller("cc");
var bcc=this._controller("bcc");
if(to.groupExists()||cc.groupExists()||bcc.groupExists()){
this._showGroupName();
}else{
this._hideGroupName();
}
if(to.userExists()||cc.userExists()||bcc.userExists()||to.groupExists()||cc.groupExists()||bcc.groupExists()){
this._showOpenStatus();
}else{
this._hideOpenStatus();
}
},_showGroupName:function(){
if(YAHOO.util.Dom.get("da_messageEditorItemGroupNameOuter").style.display==="none"){
YAHOO.util.Dom.get("da_messageEditorItemGroupNameOuter").style.display="";
}
},_hideGroupName:function(){
if(YAHOO.util.Dom.get("da_messageEditorItemGroupNameOuter").style.display===""){
YAHOO.util.Dom.get("da_messageEditorItemGroupNameOuter").style.display="none";
}
},_showOpenStatus:function(){
if(DA.vars.system.open_status){
if(YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display==="none"){
YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display="";
}
}
},_hideOpenStatus:function(){
if(YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display===""){
YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display="none";
}
},_showAddressCcBcc:function(){
if(YAHOO.util.Dom.get("da_messageEditorItemAddressCcBcc").style.display===""){
YAHOO.util.Dom.get("da_messageEditorItemAddressCcBcc").style.display="none";
this.contentsPairs.showColumn("Cc");
this.contentsPairs.showColumn("Bcc");
}
},_showRnDialog:function(_683,x,y){
var me=this;
if(!this.rnDialog){
this.rnDialog=new DA.widget.StringChangerDialog("da_messageEditorRenameDialog",DA.locale.GetText.t_("EDITOR_DIALOG_RENAME"),"",{onEnter:function(){
var name=YAHOO.util.Dom.get(me.rnDialog.childId("text")).value;
var a={name:name};
DA.customEvent.fire("changeNameDialogRenameBefore",me,{a:a});
me.rename(me.selectedFld,me.selectedSno,name);
return true;
}});
}
this.rnDialog.setString(_683);
this.rnDialog.show(x,y);
},_hideRnDialog:function(){
if(this.rnDialog){
this.rnDialog.hide();
}
},_showCeDialog:function(_689,x,y){
var me=this;
if(!this.ceDialog){
this.ceDialog=new DA.widget.StringChangerDialog("da_messageEditorChangeEmailDialog",DA.locale.GetText.t_("EDITOR_DIALOG_CHANGEEMAIL"),"",{onEnter:function(){
var _68d=YAHOO.util.Dom.get(me.ceDialog.childId("text")).value;
me.changeEmail(me.selectedFld,me.selectedSno,_68d);
return true;
}});
}
this.ceDialog.setString(_689);
this.ceDialog.show(x,y);
},_hideCeDialog:function(){
if(this.ceDialog){
this.ceDialog.hide();
}
},_showPopupMenu:function(fld,sno){
var _690=this._controller(fld);
var me=this;
var io;
if(!this.existsLock()){
if(_690.isUser(sno)){
io=this.userIO;
}else{
if(_690.isAddr(sno)){
io=this.addrIO;
}
}
if(io){
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me._makePopupMenu(fld,sno,o);
me.popup.show();
}
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("USERINFO_ERROR"));
};
if(_690.isUser(sno)){
io.execute({proc:"email",mid:_690.get(sno,"id")});
}else{
io.execute({proc:"email",id:_690.get(sno,"id")});
}
}else{
me._makePopupMenu(fld,sno);
me.popup.show();
}
}
},_makePopupMenu:function(fld,sno,o){
var _698=this._controller(fld);
var me=this;
var i,j=0;
me.popup.menuData.order=[];
me.popup.menuData.items={};
me.popup.menuData.className="da_messageEditorItemAddressPopupMenu";
if(_698.isGroup(sno)){
me.popup.menuData.order[j]=["openGroup"];
me.popup.menuData.items.openGroup={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_OPENGROUP"),args:[fld,sno],onclick:function(e,a){
me.openGroup(a[0],a[1]);
}};
j++;
}
if(_698.isAddr(sno)||_698.isUser(sno)){
me.popup.menuData.order[j]=["titleOff"];
me.popup.menuData.items.titleOff={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_TITLEOFF"),args:[fld,sno],onclick:function(e,a){
me.titleOff(a[0],a[1]);
}};
if(DA.vars.user_information_restriction.title!=="off"||!_698.isUser(sno)){
me.popup.menuData.order[j].push("titleOn");
me.popup.menuData.items.titleOn={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_TITLEON"),args:[fld,sno],onclick:function(e,a){
me.titleOn(a[0],a[1],0);
}};
}
if(DA.vars.user_information_restriction.title_name!=="off"||!_698.isUser(sno)){
me.popup.menuData.order[j].push("titleNameOn");
me.popup.menuData.items.titleNameOn={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_TITLENAMEON"),args:[fld,sno],onclick:function(e,a){
me.titleOn(a[0],a[1],1);
}};
}
j++;
}
if(_698.isAddr(sno)||_698.isUser(sno)){
if(me.titleList){
me.popup.menuData.order[j]=[];
for(i=0;i<me.titleList.length;i++){
me.popup.menuData.items["titleList"+i]={text:me.titleList[i].title,args:[fld,sno,me.titleList[i].title,me.titleList[i].title_pos],onclick:function(e,a){
me.titleCustom(a[0],a[1],a[2],a[3]);
}};
me.popup.menuData.order[j].push("titleList"+i);
}
}
j++;
}
if(!_698.isGroup(sno)){
if(_698.isML(sno)){
me.popup.menuData.order[j]=["changeName"];
}else{
me.popup.menuData.order[j]=["changeName","changeEmail"];
}
me.popup.menuData.items.changeName={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_RENAME"),args:[fld,sno,_698.get(sno,"name")],onclick:function(e,a){
DA.customEvent.fire("changeNameDialogShowBefore",me,{e:e,a:a});
me.selectedFld=a[0];
me.selectedSno=a[1];
me._showRnDialog(a[2],e.clientX,e.clientY);
DA.customEvent.fire("changeNameDialogShowAfter",me,{e:e,a:a});
}};
me.popup.menuData.items.changeEmail={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_CHANGEEMAIL"),args:[fld,sno,_698.get(sno,"email")],onclick:function(e,a){
me.selectedFld=a[0];
me.selectedSno=a[1];
me._showCeDialog(a[2],e.clientX,e.clientY);
}};
j++;
}
if(_698.isAddr(sno)){
me.popup.menuData.order[j]=["langList0","langList1"];
me.popup.menuData.items.langList0={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_CHANGELANG_ENGLISH"),args:[fld,sno,"en"],onclick:function(e,a){
me.changeLang(a[0],a[1],a[2]);
}};
me.popup.menuData.items.langList1={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_CHANGELANG_VIEW"),args:[fld,sno,"ja"],onclick:function(e,a){
me.changeLang(a[0],a[1],a[2]);
}};
j++;
}else{
if(_698.isUser(sno)||_698.isGroup(sno)){
if(me.langList){
me.popup.menuData.order[j]=[];
for(i=0;i<me.langList.length;i++){
me.popup.menuData.items["langList"+i]={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_CHANGELANG",me.langList[i].name),args:[fld,sno,me.langList[i].lang],onclick:function(e,a){
me.changeLang(a[0],a[1],a[2]);
}};
me.popup.menuData.order[j].push("langList"+i);
}
}
j++;
}
}
var _6b0=["email","keitai_mail","pmail1","pmail2"];
if(_698.isAddr(sno)||_698.isUser(sno)){
me.popup.menuData.order[j]=[];
for(i=0;i<_6b0.length;i++){
if(!DA.util.isEmpty(o[_6b0[i]])&&(DA.vars.user_information_restriction[_6b0[i]]!=="off"||!_698.isUser(sno))){
me.popup.menuData.items["emailList"+i]={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_CHANGEEMAILCUSTOM",o[_6b0[i]]),args:[fld,sno,o[_6b0[i]]],onclick:function(e,a){
me.changeEmail(a[0],a[1],a[2]);
}};
me.popup.menuData.order[j].push("emailList"+i);
}
}
j++;
}
switch(fld){
case "to":
me.popup.menuData.order[j]=["moveCc","moveBcc","moveToTop","moveToBottom"];
break;
case "cc":
me.popup.menuData.order[j]=["moveTo","moveBcc","moveCcTop","moveCcBottom"];
break;
case "bcc":
me.popup.menuData.order[j]=["moveTo","moveCc","moveBccTop","moveBccBottom"];
break;
default:
me.popup.menuData.order[j]=["moveCc","moveBcc"];
break;
}
me.popup.menuData.items.moveTo={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_MOVETO"),args:[fld,sno],onclick:function(e,a){
me.moveField(a[0],a[1],"to");
}};
me.popup.menuData.items.moveCc={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_MOVECC"),args:[fld,sno],onclick:function(e,a){
me.moveField(a[0],a[1],"cc");
}};
me.popup.menuData.items.moveBcc={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_MOVEBCC"),args:[fld,sno],onclick:function(e,a){
me.moveField(a[0],a[1],"bcc");
}};
me.popup.menuData.items.moveToTop={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_MOVETOP"),args:[fld,sno],onclick:function(e,a){
me.moveTop(a[0],a[1],"to",1);
}};
me.popup.menuData.items.moveCcTop={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_MOVETOP"),args:[fld,sno],onclick:function(e,a){
me.moveTop(a[0],a[1],"cc",1);
}};
me.popup.menuData.items.moveBccTop={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_MOVETOP"),args:[fld,sno],onclick:function(e,a){
me.moveTop(a[0],a[1],"bcc",1);
}};
me.popup.menuData.items.moveToBottom={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_MOVEBOTTOM"),args:[fld,sno],onclick:function(e,a){
me.moveField(a[0],a[1],"to",1);
}};
me.popup.menuData.items.moveCcBottom={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_MOVEBOTTOM"),args:[fld,sno],onclick:function(e,a){
me.moveField(a[0],a[1],"cc",1);
}};
me.popup.menuData.items.moveBccBottom={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_MOVEBOTTOM"),args:[fld,sno],onclick:function(e,a){
me.moveField(a[0],a[1],"bcc",1);
}};
j++;
},_controller:function(fld){
var _6c6;
switch(fld){
case "to":
_6c6=this.toController;
break;
case "cc":
_6c6=this.ccController;
break;
case "bcc":
_6c6=this.bccController;
break;
default:
_6c6=this.toController;
break;
}
return _6c6;
},openGroup:function(fld,sno){
var _6c9=this._controller(fld);
var me=this;
var io;
if(!this.existsLock()){
io=this.groupIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
_6c9.addList(o.user_list,true);
_6c9.remove(sno);
me._refreshGroupName();
me.doResize();
}
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("GROUPINFO_ERROR"));
};
io.execute({proc:"extract",gid:_6c9.get(sno,"id"),lang:_6c9.get(sno,"lang")});
}
},titleOff:function(fld,sno){
var _6d0=this._controller(fld);
if(!this.existsLock()){
_6d0.title(sno,"",0,true);
}
},titleOn:function(fld,sno,type){
var _6d4=this._controller(fld);
var io;
if(!this.existsLock()){
if(_6d4.isUser(sno)){
io=this.userIO;
}else{
io=this.addrIO;
}
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
_6d4.title(sno,o.title,o.title_pos,true);
}
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("USERINFO_ERROR"));
};
if(_6d4.isUser(sno)){
io.execute({proc:"title",mid:_6d4.get(sno,"id"),lang:_6d4.get(sno,"lang"),type:type});
}else{
io.execute({proc:"title",id:_6d4.get(sno,"id"),lang:_6d4.get(sno,"lang"),type:type});
}
}
},titleCustom:function(fld,sno,_6da,_6db){
var _6dc=this._controller(fld);
if(!this.existsLock()){
_6dc.title(sno,_6da,_6db,true);
}
},rename:function(fld,sno,name){
var _6e0=this._controller(fld);
if(!this.existsLock()){
_6e0.name(sno,name,true);
}
},changeEmail:function(fld,sno,_6e3){
var _6e4=this._controller(fld);
if(!this.existsLock()){
_6e4.email(sno,_6e3);
}
},changeLang:function(fld,sno,lang){
var _6e8=this._controller(fld);
var io;
if(!this.existsLock()){
if(_6e8.isGroup(sno)){
io=this.groupIO;
}else{
if(_6e8.isUser(sno)){
io=this.userIO;
}else{
io=this.addrIO;
}
}
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
_6e8.lang(sno,lang);
_6e8.name(sno,o.name,true);
}
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("USERINFO_ERROR"));
};
if(_6e8.isGroup(sno)){
io.execute({proc:"name",gid:_6e8.get(sno,"id"),lang:lang});
}else{
if(_6e8.isUser(sno)){
io.execute({proc:"name",mid:_6e8.get(sno,"id"),lang:lang});
}else{
io.execute({proc:"name",id:_6e8.get(sno,"id"),lang:lang});
}
}
}
},moveField:function(fld,sno,_6ee,_6ef){
var src=this._controller(fld);
var dst=this._controller(_6ee);
if(!this.existsLock()){
if(fld!==dst){
this._hideRnDialog();
this._hideCeDialog();
if(_6ef!==1){
this._showAddressCcBcc();
}
dst.add(src.get(sno));
src.remove(sno);
this.doResize();
}
}
},insertAfterNode:function(fld,sno,_6f4,_6f5){
var src=this._controller(fld);
var dst=this._controller(_6f4);
if(!this.existsLock()){
this._hideRnDialog();
this._hideCeDialog();
if(fld!==_6f4){
this._showAddressCcBcc();
}
if(fld===_6f4&&sno!==_6f5.split("_")[2]){
dst.insertAfterNode(src.get(sno),sno,_6f5,"true");
}else{
if(fld!==_6f4){
dst.insertAfterNode(src.get(sno),sno,_6f5,"false");
src.remove(sno);
}
}
this.doResize();
}
},resizeAll:function(){
var dst=null;
dst=this._controller("to");
dst.resize();
dst=this._controller("cc");
dst.resize();
dst=this._controller("bcc");
dst.resize();
},moveTop:function(fld,sno,_6fb,_6fc){
var src=this._controller(fld);
var dst=this._controller(_6fb);
if(!this.existsLock()){
if(fld!==dst){
this._hideRnDialog();
this._hideCeDialog();
if(_6fc!==1){
this._showAddressCcBcc();
}
dst.insertToTop(src.get(sno),sno);
this.doResize();
}
}
},insertBeforeNode:function(fld,sno,_701,_702,_703){
var src=this._controller(fld);
var dst=this._controller(_701);
if(!this.existsLock()){
if(fld!==dst){
this._hideRnDialog();
this._hideCeDialog();
if(_702!==1){
this._showAddressCcBcc();
}
dst.insertToTop(_703,0);
src.remove(sno);
this.doResize();
}
}
},showRichTextSelectForm:function(){
var me=this;
["formatblock","fontname","fontsize"].each(function(_707){
try{
YAHOO.util.Dom.get(_707+"_"+me.htmlContentsNode.id).style.visibility="";
}
catch(e){
}
});
},hideRichTextSelectForm:function(){
var me=this;
["formatblock","fontname","fontsize"].each(function(_709){
try{
YAHOO.util.Dom.get(_709+"_"+me.htmlContentsNode.id).style.visibility="hidden";
}
catch(e){
}
});
},showTextArea:function(){
var me=this;
try{
me.textNode.style.visibility="";
me.htmlNode.style.visibility="";
}
catch(e){
}
},hideTextArea:function(){
var me=this;
try{
me.textNode.style.visibility="hidden";
me.htmlNode.style.visibility="hidden";
}
catch(e){
}
},lock:function(){
if(DA.util.lock("messageEditor")){
return true;
}else{
return false;
}
},unlock:function(){
return DA.util.unlock("messageEditor");
},existsLock:function(){
return DA.util.existsLock("messageEditor");
},isEmpty:function(str){
if(DA.util.isEmpty(str)){
return true;
}else{
if(str.match(/^(\s|\xe3\x80\x80)+$/)){
return true;
}else{
return false;
}
}
},_hide_spellcheck_menu:function(){
if(YAHOO.util.Dom.get("panel_menuMenuItem_transmit_b")){
YAHOO.util.Dom.get("panel_menuMenuItem_transmit_b").style.display="none";
}
if(YAHOO.util.Dom.get("panel_menuMenuItem_preview_b")){
YAHOO.util.Dom.get("panel_menuMenuItem_preview_b").style.display="none";
}
if(YAHOO.util.Dom.get("panel_menuMenuItem_spellcheck")){
YAHOO.util.Dom.get("panel_menuMenuItem_spellcheck").style.display="none";
}
},_show_spellcheck_menu:function(){
if(YAHOO.util.Dom.get("panel_menuMenuItem_transmit_b")){
YAHOO.util.Dom.get("panel_menuMenuItem_transmit_b").style.display="";
}
if(YAHOO.util.Dom.get("panel_menuMenuItem_preview_b")){
YAHOO.util.Dom.get("panel_menuMenuItem_preview_b").style.display="";
}
if(YAHOO.util.Dom.get("panel_menuMenuItem_spellcheck")&&DA.vars.system.spellcheck_button_visible&&DA.vars.config.spellcheck){
YAHOO.util.Dom.get("panel_menuMenuItem_spellcheck").style.display="";
}
},_disableESC:function(){
if(YAHOO.util.Event.getCharCode(event)===Event.KEY_ESC){
return false;
}
return true;
},_enableButtons:function(){
var _70d=DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_address.gif");
$("da_messageEditorItemToAddress").innerHTML=$("da_messageEditorItemCcAddress").innerHTML=$("da_messageEditorItemBccAddress").innerHTML=_70d;
$("da_messageEditorItemAttachmentButtonsLibrary").disabled=false;
}};
DA.mailer.AddressDragDrop=function(id,_70f,_710){
if(id){
this.init(id,_70f,_710);
if(!this.DDFrameCreated){
this.DDFrameCreated=true;
this.initFrame();
}
}
};
YAHOO.extend(DA.mailer.AddressDragDrop,YAHOO.util.DDProxy,{createFrame:function(){
var self=this;
var body=document.body;
var div=this.getDragEl();
var s;
if(!div){
div=DA.dom.createDiv(this.dragElId);
div.style.visibility="hidden";
div.style.cursor="pointer";
body.insertBefore(div,body.firstChild);
YAHOO.util.Dom.addClass(div,"da_messageEditorAddressDummy");
}
},onDragOut:function(e,id){
var _717=null;
if(id.indexOf("Text")>=0){
_717=document.getElementById("insertAddressAfterMark"+id);
if(_717){
_717.parentNode.removeChild(_717);
}
}else{
if(id.indexOf("da_ugInformationList")>=0){
_717=document.getElementById("insertAddressAfterMark"+id);
if(_717){
_717.parentNode.removeChild(_717);
}
}
}
},startDrag:function(x,y){
this.startX=x;
this.startY=y;
this.deltaX=0;
this.deltaY=0;
},endDrag:function(e){
}});
if(!DA||!DA.mailer||!DA.util||!DA.locale||!DA.widget){
throw "ERROR: missing DA.js or mailer.js or message.js or dialog.js";
}
if(!YAHOO||!YAHOO.util||!YAHOO.widget){
throw "ERROR: missing yahoo.js or container.js";
}
DA.mailer.widget.MailImportDialog=function(_71b,_71c,_71d){
this.nodeId=_71b;
this.setHead(_71c);
this.setBody();
this.setCbhash(_71d);
this.setDialog();
this.setListener();
};
Object.extend(DA.mailer.widget.MailImportDialog.prototype,DA.widget.Dialog.prototype);
DA.mailer.widget.MailImportDialog.prototype.setHead=function(_71e){
this.head=DA.util.encode(_71e);
};
DA.mailer.widget.MailImportDialog.prototype.setBody=function(fid){
this.body="<form id=\""+this.childId("form")+"\">"+"<input type=hidden id=\""+this.childId("proc")+"\" class=\""+this.childClass("proc")+"\" name=\"proc\" value=\"import\">"+"<input type=hidden id=\""+this.childId("fid")+"\" class=\""+this.childClass("fid")+"\" name=\"fid\" value=\"\">"+this.archiveTypeRadio()+"<br>"+"<input type=file id=\""+this.childId("file")+"\" class=\""+this.childClass("file")+"\" name=\"path\" value=\"\">"+"<input type=button id=\""+this.childId("set")+"\" class=\""+this.childClass("set")+"\" value=\""+DA.locale.GetText.t_("DIALOG_SETTING_BUTTON")+"\">"+"<input type=reset id=\""+this.childId("clear")+"\" class=\""+this.childClass("clear")+"\" value=\"clear\" style=\"display:none;\">"+"</form>";
this.focusId=this.childId("file");
};
DA.mailer.widget.MailImportDialog.prototype.setListener=function(){
YAHOO.util.Event.addListener(this.childId("set"),"click",this._enter,this,true);
};
DA.mailer.widget.MailImportDialog.prototype.archiveType={zip:"ZIP",tar:"TGZ",lha:"LZH",eml:"eml",mbox:"mbox"};
DA.mailer.widget.MailImportDialog.prototype.archiveTypeRadio=function(){
var _720=DA.vars.config.archive_list.split("|");
var _721="";
var i,_723;
for(i=0;i<_720.length;i++){
if(_720[i]===DA.vars.config.archive){
_723=" checked";
}else{
_723="";
}
_721+="<input type=radio id=\""+this.childId("archive_type")+"\" class=\""+this.childClass("archive_type")+"\" name=\"archive_type\" value=\""+_720[i]+"\""+_723+">"+this.archiveType[_720[i]]+"&nbsp;";
}
return _721;
};
DA.mailer.widget.MailImportDialog.prototype.clear=function(){
YAHOO.util.Dom.get(this.childId("clear")).click();
};
if(!DA||!DA.mailer||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util||!YAHOO.widget){
throw "ERROR: missing yahoo.js or treeview.js";
}
DA.mailer.FolderDragDrop=function(id,_725,_726){
if(id){
this.init(id,_725,_726);
if(!this.DDFrameCreated){
this.DDFrameCreated=true;
this.initFrame();
}
}
};
YAHOO.extend(DA.mailer.FolderDragDrop,YAHOO.util.DDProxy,{createFrame:function(){
var self=this;
var body=document.body;
var div=this.getDragEl();
var s;
if(!div){
div=DA.dom.createDiv(this.dragElId);
div.style.visibility="hidden";
body.insertBefore(div,body.firstChild);
YAHOO.util.Dom.addClass(div,"labelDummy");
}
},onDragEnter:function(e,id){
},onDragOut:function(e,id){
},onDragDrop:function(e,id){
},startDrag:function(x,y){
this.startX=x;
this.startY=y;
this.deltaX=0;
this.deltaY=0;
},endDrag:function(e){
},onMouseDown:function(e){
},onMouseUp:function(e){
}});
DA.mailer.FolderTreeController=function(_736,_737,_738,_739,_73a,_73b){
this.jsonIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_dir.cgi");
this.listIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_list.cgi");
this.moveIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi");
this.filterIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_filter.cgi");
this.mainteIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_mainte.cgi");
this.fileIO=new DA.io.FileUploadIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi");
this.jsonIO.extend({callback:function(o){
if(DA.mailer.util.checkResult(o)){
this._drawTree(o);
this._viewQuota(o);
this._setDrag(o);
this._setDrop(o);
this._setupSubscribers();
DA.mailer.Events.onFolderTreeReady.fire(this);
}else{
DA.util.warn(DA.locale.GetText.t_("FOLDER_TREE_ERROR"));
}
}.bind(this),errorHandler:function(e){
DA.util.warn(DA.locale.GetText.t_("JSON_ERROR"));
}.bind(this)});
this.topNode=_736;
this.treeNode=_737;
this.selectedNode=_73a;
this.quota=new DA.mailer.QuotaController(_738,_739);
this.popup=new DA.mailer.FolderTreePopupMenu(this);
if(DA.util.isFunction(_73b.onUpdating)){
this.onUpdating=_73b.onUpdating;
}
if(DA.util.isFunction(_73b.onUpdateDone)){
this.onUpdateDone=_73b.onUpdateDone;
}
if(DA.util.isFunction(_73b.onSelect)){
this.onSelect=_73b.onSelect;
}
if(DA.util.isFunction(_73b.onDelete)){
this.onDelete=_73b.onDelete;
}
if(DA.util.isFunction(_73b.onTrash)){
this.onTrash=_73b.onTrash;
}
this.init();
};
DA.mailer.FolderTreeController.prototype={topNode:null,treeNode:null,selectedNode:null,importNode:null,popupNode:null,quota:null,popup:null,drag:null,folderData:null,treeView:null,jsonIO:null,listIO:null,moveIO:null,filterIO:null,mainteIO:null,fileIO:null,init:function(){
this.treeNode.innerHTML=DA.locale.GetText.t_("DEFAULT_FOLDER_TREE");
this.jsonIO.execute();
},_setupSubscribers:function(){
var E=DA.mailer.Events;
if(!E){
return;
}
var me=this;
["sMoved","sFiltered","sFlagged","Read"].each(function(name){
name="onMessage"+name;
var ce=E[name];
var _742=me[name];
if(!ce||!YAHOO.lang.isFunction(_742)){
return;
}
ce.subscribe(function(type,args){
return _742.apply(me,args);
});
});
},treeData:{},ygtvData:{},selectedFid:null,targetedFid:null,sourceFid:null,nextFid:null,rootFid:null,serverFid:null,inboxFid:null,draftFid:null,sentFid:null,trashFid:null,spamFid:null,localServerFid:null,localFolderFid:null,backupFolderFid:null,onUpdating:Prototype.emptyFunction,onUpdateDone:Prototype.emptyFunction,onSelect:Prototype.emptyFunction,onDelete:Prototype.emptyFunction,onTrash:Prototype.emptyFunction,onMessagesMoved:function(_745,_746,_747){
this._viewQuota(_747);
if(!_746||!_746.messages||!_747){
return;
}
var _748=_746.messages.fid;
var _749=_746.target.fid;
this._setCounts(_747,_748);
if(DA.util.cmpNumber(_748,this.selectedFid)||DA.util.cmpNumber(_749,this.selectedFid)){
this.selectedNode.innerHTML=this._labeler(this.selectedFid).selected();
}
},onMessagesFiltered:function(arg1){
this._viewQuota(arg1.response);
this._setCounts(arg1.response,arg1.srcFid);
this._selectUI(arg1.srcFid);
},onMessagesFlagged:function(_74b,_74c,_74d){
if(!_74c||!_74c.messages||!_74d){
return;
}
var fid=_74c.messages.fid;
if(_74c.property==="seen"){
this._setCounts(_74d,fid);
if(DA.util.cmpNumber(fid,this.selectedFid)){
this.selectedNode.innerHTML=this._labeler(fid).selected();
}
}
},onMessageRead:function(_74f){
if(_74f&&_74f.fid){
this._incSeen(_74f.fid);
}
if(DA.util.cmpNumber(_74f.fid,this.selectedFid)){
this.selectedNode.innerHTML=this._labeler(this.selectedFid).selected();
}
},onMessagesDragEnter:function(arg1){
this._open(arg1.fid);
},inboxName:function(){
return this._name(this.inboxFid);
},draftName:function(){
return this._name(this.draftFid);
},sentName:function(){
return this._name(this.sentFid);
},trashName:function(){
return this._name(this.trashFid);
},spamName:function(){
return this._name(this.spamFid);
},_setDrag:function(o){
var me=this;
this.drag=new DA.mailer.FolderDragDrop(this.treeNode,"da_folderTree",{scroll:false,resizeFrame:false});
this.drag.onMouseDown=function(e){
var cur=this.getDragEl();
var node=YAHOO.util.Event.getTarget(e);
var fid;
if(node){
fid=me._targetId2fid(node.id);
if(fid&&!me.existsLock()){
if(me._dragOk(fid)){
me.sourceFid=fid;
cur.innerHTML=me.treeData[fid].labeler.dummy();
}
}
}
};
this.drag.clickValidator=function(e){
if(DA.mailer.util.getOperationFlag()!==""&&DA.mailer.util.getOperationFlag()!==OrgMailer.vars.org_mail_gid.toString()){
return false;
}else{
return true;
}
};
this.drag.onMouseUp=function(e){
var cur=this.getDragEl();
if(me.sourceFid){
me.sourceFid=null;
cur.innerHTML="";
}
};
this.drag.onDragOver=function(e){
};
this.drag.onDragEnter=function(e,id){
var fid;
if(id){
fid=me._targetId2fid(id);
if(fid&&!me.existsLock()&&me.sourceFid){
if(me._dropFOk(fid)&&fid!==me.sourceFid){
me._addClass($(me._fid2divId(fid)).parentNode,"labelTargeted");
}
}
}else{
}
};
this.drag.onDragOut=function(e,id){
var fid;
if(id){
fid=me._targetId2fid(id);
if(fid&&!me.existsLock()&&me.sourceFid){
if(me._dropFOk(fid)&&fid!==me.sourceFid){
me._removeClass($(me._fid2divId(fid)).parentNode,"labelTargeted");
}
}
}else{
}
};
this.drag.onDragDrop=function(e,id){
var fid;
if(id){
fid=me._targetId2fid(id);
if(fid&&!me.existsLock()&&me.sourceFid){
if(me._dropFOk(fid)&&fid!==me.sourceFid){
me._removeClass($(me._fid2divId(fid)).parentNode,"labelTargeted");
me._move(me.sourceFid,fid);
}
}
}
};
},_setDrop:function(o){
var me=this;
$H(this.treeData).each(function(f){
var fid=f.key;
var obj=f.value;
if(me._dropFOk(fid)||me._dropMOk(fid)){
obj.drop=new YAHOO.util.DDTarget(me._fid2divId(fid),"da_folderTree");
}
});
},_viewQuota:function(o){
var me=this;
this.quota.set(o);
this.quota.view();
},_drawTree:function(o){
var _76c;
var _76d=o.folder_list||[];
var me=this;
var fo;
var _770=[];
var _771=_76d.length;
for(var i=0;i<_771;i++){
fo=_76d[i];
me.treeData[fo.fid]={};
for(var key in fo){
me.treeData[fo.fid][key]=fo[key];
}
me.treeData[fo.fid].last_update=0;
me.treeData[fo.fid].children=[];
me.treeData[fo.fid].labeler=new DA.mailer.FolderLabeler(this.topNode,this.treeNode,me._data(fo.fid));
if(fo.parent===0){
_76c=fo.fid;
}else{
me.treeData[fo.parent].children.push(me._data(fo.fid));
if(me._parent(fo.fid)===_76c){
_770.push(fo.fid);
}
}
switch(fo.type){
case DA.vars.folderType.root:
this.rootFid=fo.fid;
break;
case DA.vars.folderType.server:
this.serverFid=fo.fid;
break;
case DA.vars.folderType.inbox:
this.inboxFid=fo.fid;
break;
case DA.vars.folderType.draft:
this.draftFid=fo.fid;
break;
case DA.vars.folderType.sent:
this.sentFid=fo.fid;
break;
case DA.vars.folderType.trash:
this.trashFid=fo.fid;
break;
case DA.vars.folderType.spam:
this.spamFid=fo.fid;
break;
case DA.vars.folderType.localServer:
this.localServerFid=fo.fid;
break;
case DA.vars.folderType.localFolder:
this.localFolderFid=fo.fid;
break;
case DA.vars.folderType.backupFolder:
this.backupFolderFid=fo.fid;
break;
default:
break;
}
}
me.treeView=new YAHOO.widget.TreeView(me.treeNode);
me.nextFid=o.next_fid;
this.topNode.innerHTML=me.treeData[_76c].labeler.root();
var root=me.treeView.getRoot();
var _775=_770.length;
var fid,to;
for(var j=0;j<_775;j++){
fid=_770[j];
me._populate(me.treeData[fid],root);
me.treeView.subscribe("labelClick",function(node){
clearTimeout(to);
to=setTimeout(function(){
DA.widget.PopupMenuManager.allCancel();
me._select(node.data.id);
},100);
return false;
});
}
me.treeView.draw();
me._open(me.serverFid);
me._open(me.inboxFid);
if(DA.vars.system.auto_backup_on===1&&DA.vars.config.backup_exists===1&&DA.vars.config.backup_msg_show===1){
me._open(me.localServerFid);
me._select(me.backupFolderFid);
$("mboxGrid_search_keyword").disabled=true;
$("mboxGrid_search_button").disabled=true;
DA.util.warn(DA.locale.GetText.t_("EXISTS_BACKUP_FILES"));
}else{
me._select(me.inboxFid);
}
},_populate:function(f,_77b){
var me=this;
if(f.hidden===1){
return;
}
var node=new YAHOO.widget.TextNode(f.labeler.label(true),_77b);
var _77e=f.children.length;
me.treeData[f.fid].node=node;
me.ygtvData[node.getElId()]=f.fid;
for(var i=0;i<_77e;i++){
me._populate(f.children[i],node);
}
},_open:function(fid){
var node=this._node(fid);
if(!node.expanded&&!node.childrenRendered){
this._clearYUIDragDropMgrDomRefCache();
}
node.expand();
},_clearYUIDragDropMgrDomRefCache:function(){
var hash=YAHOO.util.DDM.ids.da_folderTree||{};
$H(hash).values().each(function(oDD){
oDD._domRef=null;
});
},_close:function(fid){
var node=this._node(fid);
node.collapse();
},_parentsOpen:function(fid,top){
var _788=this._parent(fid);
if(_788!==0&&_788!==top){
this._parentsOpen(_788,top);
}
this._showChildren(_788);
},_refresh:function(fid){
var node=this._node(fid);
this._clearYUIDragDropMgrDomRefCache();
node.refresh();
},_select:function(fid){
var me=this;
var node,_78e,h,io;
if(me._selectOk(fid)&&me.lock()){
node=this._node(fid);
if(me.selectedFid&&me._exists(me.selectedFid)){
me._labeler(me.selectedFid).removeClass("labelSelected");
me._clearRecent(me.selectedFid);
}
me._labeler(fid).addClass("labelSelected");
me.selectedFid=fid;
if(me._updateOk(fid)){
DA.waiting.show("",DA.vars.imgRdir+"/popy_wait_mail.gif");
me.onUpdating(fid);
io=this.listIO;
io.callback=function(o){
me.onUpdateDone(fid);
if(DA.mailer.util.checkResult(o)){
me.treeData[fid].last_update=DA.time.GetTime();
me._viewQuota(o);
me._setCounts(o,fid);
me._selectUI(fid);
}
if(DA.vars.new_mail){
eval(DA.vars.new_mail);
}
if(DA.vars.custom.threePane.updateFolder){
eval(DA.vars.custom.threePane.updateFolder);
}
me.unlock();
DA.waiting.hide();
if(o.result.error===1001){
DA.util.warn(o.result.message);
me._rebuild(fid);
}else{
if(o.result.error===1002){
if(DA.util.confirm(o.result.message)){
me._rebuild(fid);
}
}
}
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("FOLDER_SELECT_ERROR"));
me.onUpdateDone(fid);
me.unlock();
DA.waiting.hide();
};
io.execute({proc:"update",fid:fid,ignoreQuota:"yes"});
}else{
me._selectUI(fid);
me.unlock();
}
}
},_selectUI:function(fid){
var me=this;
if(me._selectOk(fid)){
me.selectedNode.innerHTML=me._labeler(fid).selected();
me.onSelect(fid,me._type(fid));
}
},_create:function(fid,name,type){
var me=this;
var h,io;
if(me._createOk(fid)&&me.lock()){
io=this.jsonIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me._viewQuota(o);
me._createUI(fid,name,type);
if(DA.util.isEmpty(o.next_fid)){
DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
}else{
me.nextFid=o.next_fid;
}
}
me.unlock();
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("FOLDER_CREATE_ERROR"));
me.unlock();
};
io.execute({proc:"create",fid:fid,name:name,type:type});
}
},_createUI:function(fid,name,type){
var me=this;
var c,node,_7a3,_7a4,_7a5,_7a6,_7a7;
if(me._createOk(fid)){
this.popup.cfDialog.hide();
c={};
node=me._node(fid);
_7a3=me.nextFid;
if(DA.vars.config["delete"]===1){
_7a4=1;
}else{
_7a4=0;
}
if(DA.vars.config.count==="all"||DA.vars.config.count==="half"){
_7a5=1;
}else{
_7a5=0;
}
if(DA.vars.config.count==="all"){
_7a6=1;
}else{
_7a6=0;
}
if(DA.vars.config.recent==="on"){
_7a7=1;
}else{
_7a7=0;
}
if(type===DA.vars.folderType.cabinet){
c={fid:_7a3,parent:fid,uidvalidity:0,type:18,name:name,icon:DA.vars.imgRdir+"/ico_fc_cabinet.gif",alt:"",select:0,update:0,create:1,rename:1,"delete":1,move:1,"import":0,"export":0,filter:0,rebuild:0,move_f:1,move_m:0,open_m:0,trash_m:_7a4,messages:0,unseen:0,recent:0,messages_e:_7a5,unseen_e:_7a6,recent_e:_7a7,last_update:0,children:[],drop:new YAHOO.util.DDTarget(this._fid2divId(_7a3),"da_folderTree")};
}else{
if(type===DA.vars.folderType.mailbox){
c={fid:_7a3,parent:fid,uidvalidity:0,type:17,name:name,icon:DA.vars.imgRdir+"/ico_14_folder_c.gif",alt:"",select:1,update:1,create:0,rename:1,"delete":1,move:1,"import":1,"export":1,filter:1,rebuild:1,move_f:0,move_m:1,open_m:1,trash_m:_7a4,messages:0,unseen:0,recent:0,messages_e:_7a5,unseen_e:_7a6,recent_e:_7a7,last_update:0,children:[],drop:null};
}else{
c={fid:_7a3,parent:fid,uidvalidity:0,type:16,name:name,icon:DA.vars.imgRdir+"/ico_14_folder_c.gif",alt:"",select:1,update:1,create:1,rename:1,"delete":1,move:1,"import":1,"export":1,filter:1,rebuild:1,move_f:1,move_m:1,open_m:1,trash_m:_7a4,messages:0,unseen:0,recent:0,messages_e:_7a5,unseen_e:_7a6,recent_e:_7a7,last_update:0,children:[],drop:new YAHOO.util.DDTarget(this._fid2divId(_7a3),"da_folderTree")};
}
}
me.treeData[_7a3]=c;
me.treeData[_7a3].labeler=new DA.mailer.FolderLabeler(me.topNode,me.treeNode,me._data(_7a3));
me.treeData[fid].children.push(me.treeData[_7a3]);
me._populate(me.treeData[_7a3],node);
me._refresh(me._parent(_7a3));
me._showChildren(fid);
me._hideChildren(me.inboxFid);
}
},_rename:function(fid,name){
var me=this;
var h,io;
if(me._renameOk(fid)&&me.lock()){
io=this.jsonIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me._viewQuota(o);
me._renameUI(fid,name);
if(DA.util.isEmpty(o.next_fid)){
DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
}else{
me.nextFid=o.next_fid;
}
}
me.unlock();
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("FOLDER_RENAME_ERROR"));
me.unlock();
};
io.execute({proc:"rename",fid:fid,name:name});
}
},_renameUI:function(fid,name){
var me=this;
var c,_7b3;
if(me._renameOk(fid)){
this.popup.rfDialog.hide();
c=me._data(fid);
_7b3=me._labeler(fid);
c.name=name;
_7b3.refresh();
}
},_move:function(src,dst){
var me=this;
var h,io;
if(me._dragOk(src)&&me._dropFOk(dst)&&me.lock()){
io=this.jsonIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me._viewQuota(o);
me._moveUI(src,dst);
if(DA.util.isEmpty(o.next_fid)){
DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
}else{
me.nextFid=o.next_fid;
}
}
me.unlock();
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("FOLDER_MOVE_ERROR"));
me.unlock();
};
io.execute({proc:"move",fid:src,target_fid:dst});
}
},_moveUI:function(src,dst){
var me=this;
var cp,cs,cd,i,dp;
if(me._dragOk(src)&&me._dropFOk(dst)){
dp=me._parent(src);
cp=me._data(dp);
cs=me._data(src);
cd=me._data(dst);
cs.parent=dst;
for(i=0;i<cp.children.length;i++){
if(cp.children[i].fid===src){
cd.children.push(cs);
cp.children.splice(i,1);
break;
}
}
me.treeView.removeNode(me._node(src),true);
me._populate(cs,me._node(dst));
me.treeView.draw();
this._clearYUIDragDropMgrDomRefCache();
me._hideChildren(dp);
me._showChildren(dst);
me._hideChildren(me.inboxFid);
if(me.selectedFid){
me._parentsOpen(me.selectedFid,dst);
me._labeler(me.selectedFid).addClass("labelSelected");
}
}
},_delete:function(fid){
var me=this;
var h,io;
if(me._deleteOk(fid)&&me.lock()){
io=this.jsonIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me._viewQuota(o);
me._deleteUI(fid);
if(me.selectedFid===fid){
me.selectedFid=null;
}
if(DA.util.isEmpty(o.next_fid)){
DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
}else{
me.nextFid=o.next_fid;
}
}
me.unlock();
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("FOLDER_DELETE_ERROR"));
me.unlock();
};
io.execute({proc:"delete",fid:fid});
}
},_deleteUI:function(fid){
if(!this._deleteOk(fid)){
return;
}
var node=this._node(fid);
var _7cb=this._parent(fid);
var _7cc=this._node(_7cb);
var _7cd=this._data(_7cb);
var i;
for(i=0;i<_7cd.children.length;i++){
if(_7cd.children[i].fid===fid){
_7cd.children.splice(i,1);
break;
}
}
this.treeView.removeNode(node);
this.treeView.draw();
this._clearYUIDragDropMgrDomRefCache();
this._hideChildren(_7cb);
this._hideChildren(this.inboxFid);
delete this.treeData[fid];
this.onDelete(fid);
},_filter:function(fid){
var me=this;
var h,io;
if(me._filterOk(fid)&&me.lock()){
io=this.filterIO;
DA.waiting.show(DA.locale.GetText.t_("FILTER_OPERATING_PROMPT"));
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me._viewQuota(o);
me._setCounts(o,fid);
me._filterUI(fid);
if(me.selectedFid===fid){
me._selectUI(fid);
}
}
me.unlock();
DA.waiting.hide();
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("FILTER_ERROR"));
me.unlock();
DA.waiting.hide();
};
io.execute({proc:"submit",fid:fid,uid:"all"});
}
},_filterUI:function(fid){
var me=this;
if(me._filterOk(fid)){
}
},_rebuild:function(fid){
var me=this;
var h,io;
if(me._rebuildOk(fid)&&me.lock()){
io=this.mainteIO;
DA.waiting.show(DA.locale.GetText.t_("REBUILD_OPERATING_PROMPT"));
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me._viewQuota(o);
me._setCounts(o,fid);
me._rebuildUI(fid);
if(me.selectedFid===fid){
me._selectUI(fid);
}
}
me.unlock();
DA.waiting.hide();
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("REBUILD_ERROR"));
me.unlock();
DA.waiting.hide();
};
io.execute({proc:"rebuild",fid:fid});
}
},_rebuildUI:function(fid){
var me=this;
if(me._rebuildOk(fid)){
}
},_export:function(fid){
var me=this;
var h,io;
if(me._exportOk(fid)&&me.lock()){
io=this.moveIO;
DA.waiting.show(DA.locale.GetText.t_("EXPORT_OPERATING_PROMPT"));
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
if(!DA.util.isEmpty(o.file)){
me._viewQuota(o);
me._exportUI(fid,o.file,o.file_name);
}else{
DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
}
}
me.unlock();
DA.waiting.hide();
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("EXPORT_ERROR"));
me.unlock();
DA.waiting.hide();
};
io.execute({proc:"export",fid:fid,uid:"all",archive:"1"});
}
},_exportUI:function(fid,file,_7e7){
var me=this;
var url,Proc;
if(me._exportOk(fid)){
if(DA.util.isNull(_7e7)){
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=archive%26file="+file;
}else{
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=archive%26file="+file+"%26file_name="+_7e7;
}
url=DA.vars.cgiRdir+"/down_pop4ajax.cgi?proc="+Proc;
DA.windowController.winOpenNoBar(url,"",400,450);
}
},_import:function(fid){
var me=this;
var io;
if(me._importOk(fid)&&me.lock()){
YAHOO.util.Dom.get(this.importNode).fid.value=fid;
io=this.fileIO;
DA.waiting.show(DA.locale.GetText.t_("IMPORT_OPERATING_PROMPT"));
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me._viewQuota(o);
me._setCounts(o,fid);
me._importUI(fid);
if(me.selectedFid===fid){
me._selectUI(fid);
}
}
me.unlock();
DA.waiting.hide();
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("IMPORT_ERROR"));
me.unlock();
DA.waiting.hide();
};
io.execute(this.importNode);
}else{
return false;
}
},_importUI:function(fid){
var me=this;
if(me._importOk(fid)){
this.popup.ifDialog.hide();
}
},_trash:function(fid){
var me=this;
var h,io;
if(me._trashOk(fid)&&me.lock()){
io=this.moveIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me._viewQuota(o);
me._trashUI(fid);
if(me.selectedFid===fid){
me._selectUI(fid);
}
}
me.unlock();
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("TRASH_ERROR"));
me.unlock();
};
io.execute({proc:"delete",fid:fid,uid:"all"});
}
},_trashUI:function(fid){
var me=this;
if(me._trashOk(fid)){
me._clearCount(fid);
}
},_openOk:function(fid){
var me=this;
if(me.treeData[fid].children.length>0&&!me._opened(fid)){
return true;
}else{
return false;
}
},_closeOk:function(fid){
var me=this;
if(me.treeData[fid].children.length>0&&me._opened(fid)){
return true;
}else{
return false;
}
},_selectOk:function(fid){
var me=this;
if(me.treeData[fid].select===1){
return true;
}else{
return false;
}
},_updateOk:function(fid){
var me=this;
var _802;
if(me.treeData[fid].update===1){
_802=me._labeler(fid);
if(_802.recent()>0||DA.vars.config.update_time===0||DA.time.DiffTime(me.treeData[fid].last_update,DA.time.GetTime())>DA.vars.config.update_time*1000){
return true;
}else{
return false;
}
}else{
return false;
}
},_createOk:function(fid){
var me=this;
if(me.treeData[fid].create===1){
return true;
}else{
return false;
}
},_renameOk:function(fid){
var me=this;
if(me.treeData[fid].rename===1){
return true;
}else{
return false;
}
},_dragOk:function(fid){
var me=this;
if(me.treeData[fid].move===1){
return true;
}else{
return false;
}
},_dropFOk:function(fid){
var me=this;
if(me.treeData[fid].move_f===1){
return true;
}else{
return false;
}
},_dropMOk:function(fid){
var me=this;
if(me.treeData[fid].move_m===1){
return true;
}else{
return false;
}
},_deleteOk:function(fid){
var me=this;
if(me.treeData[fid]["delete"]===1){
return true;
}else{
return false;
}
},_filterOk:function(fid){
var me=this;
if(me.treeData[fid].filter===1){
return true;
}else{
return false;
}
},_rebuildOk:function(fid){
var me=this;
if(me.treeData[fid].rebuild===1){
return true;
}else{
return false;
}
},_exportOk:function(fid){
var me=this;
if(me.treeData[fid]["export"]===1){
return true;
}else{
return false;
}
},_importOk:function(fid){
var me=this;
if(me.treeData[fid]["import"]===1){
return true;
}else{
return false;
}
},_trashOk:function(fid){
var me=this;
if(me.treeData[fid].trash===1){
return true;
}else{
return false;
}
},_opened:function(fid){
var me=this;
var node=me._node(fid);
var _81c=node.getStyle();
if(_81c.match(/(?:^|\s)ygtv[lt]m[h]?(?:\s|$)/)){
return true;
}else{
return false;
}
},_hasChildren:function(fid){
var me=this;
var data=me._data(fid);
if(data.children.length>0){
return true;
}else{
return false;
}
},_showChildren:function(fid){
var node;
if(fid!==0){
node=this._node(fid);
if(node&&node.hasChildren()){
this._open(fid);
}
}
},_hideChildren:function(fid){
var node;
if(fid!==0){
node=this._node(fid);
if(node&&!node.hasChildren()){
this._close(fid);
}
}
},_exists:function(fid){
if(this.treeData[fid]){
return true;
}else{
return false;
}
},_data:function(fid){
return this.treeData[fid];
},_node:function(fid){
return this.treeData[fid].node;
},_labeler:function(fid){
return this.treeData[fid].labeler;
},_parent:function(fid){
return this.treeData[fid].parent;
},_name:function(fid){
return this.treeData[fid].name;
},_type:function(fid){
return this.treeData[fid].type;
},_incSeen:function(fid){
var _82c=this._labeler(fid);
_82c.data.unseen=(_82c.data.unseen-1<0)?0:_82c.data.unseen-1;
_82c.refresh();
},_setCounts:function(o,fid){
var _82f=o.count_list;
var _830=o.total;
var i;
if(_82f){
for(i=0;i<_82f.length;i++){
this._setCount(_82f[i].fid,_82f[i].messages,_82f[i].unseen,_82f[i].recent);
}
}
if(_830){
this._setCount(fid,_830.messages,_830.unseen,_830.recent);
}
},_setCount:function(fid,_833,_834,_835){
var _836=this._labeler(fid);
if(!DA.util.isEmpty(_833)){
_836.messages(_833);
}
if(!DA.util.isEmpty(_834)){
_836.unseen(_834);
}
if(!DA.util.isEmpty(_835)){
_836.recent(_835);
}
_836.refresh();
},_clearCount:function(fid){
this._setCount(fid,0,0,0);
},_clearRecent:function(fid){
this._setCount(fid,null,null,0);
},_fid2divId:function(fid){
var _83a="da_folderTreeDivId_"+fid;
return _83a;
},_divId2fid:function(_83b){
var _83c=_83b.split("_");
return parseInt(_83c[2],10);
},_targetId2fid:function(id){
var fid;
if(id.match(/^da\_folderTreeDivId\_(\d+)$/)){
fid=RegExp.$1;
}else{
if(id.match(/^ygtv\d+$/)){
fid=this.ygtvData[id];
}
}
return parseInt(fid,10);
},lock:function(){
if(DA.util.lock("folderTree")){
return true;
}else{
return false;
}
},unlock:function(){
return DA.util.unlock("folderTree");
},existsLock:function(){
return DA.util.existsLock("folderTree");
},_addClass:function(_83f,_840){
var el=YAHOO.util.Dom.get(_83f);
YAHOO.util.Dom.addClass(el,_840);
},_removeClass:function(_842,_843){
var el=YAHOO.util.Dom.get(_842);
YAHOO.util.Dom.removeClass(el,_843);
}};
DA.mailer.FolderLabeler=function(_845,_846,data){
this.topNode=_845;
this.treeNode=_846;
this.data=data;
};
DA.mailer.FolderLabeler.prototype={topNode:null,treeNode:null,data:null,fid:function(){
return this.data.fid;
},divId:function(){
return "da_folderTreeDivId_"+this.data.fid;
},node:function(){
return this.data.node;
},messagesEnable:function(){
if(this.data.messages_e===1){
return true;
}else{
return false;
}
},unseenEnable:function(){
if(this.data.unseen_e===1){
return true;
}else{
return false;
}
},recentEnable:function(){
if(this.data.recent_e===1){
return true;
}else{
return false;
}
},messages:function(n){
if(!DA.util.isEmpty(n)){
this.data.messages=n;
}
return this.data.messages;
},unseen:function(n){
if(!DA.util.isEmpty(n)){
this.data.unseen=n;
}
return this.data.unseen;
},recent:function(n){
if(!DA.util.isEmpty(n)){
this.data.recent=n;
}
return this.data.recent;
},name:function(){
return this.data.name;
},icon:function(){
return this.data.icon;
},alt:function(){
return this.data.alt;
},type:function(){
return this.data.type;
},select:function(){
return this.data.select;
},_image:function(){
var _84b=DA.imageLoader.tag(this.icon(),this.alt());
return _84b;
},_name:function(){
var n=this.name();
var name=DA.util.encode(n);
return name;
},_count:function(){
var _84e="";
var _84f=this.messages();
var _850=this.unseen();
var _851=this.recent();
if(this.messagesEnable()){
if(this.unseenEnable()){
_84e="["+DA.util.encode(_850)+"/"+DA.util.encode(_84f)+"]";
}else{
_84e="["+DA.util.encode(_84f)+"]";
}
}else{
if(this.unseenEnable()){
_84e="["+DA.util.encode(_850)+"]";
}else{
_84e="";
}
}
if(this.recentEnable()){
if(_851!==0){
_84e+="&nbsp;";
_84e+="("+DA.util.encode(_851)+")";
}
}
return _84e;
},_countOnly:function(){
var _852="";
var _853=this.messages();
var _854=this.unseen();
if(DA.mailer.util.isLocalFolder(this.type())||DA.mailer.util.isBackupFolder(this.type())){
_852="";
}else{
if(DA.mailer.util.isSent(this.type())||DA.mailer.util.isDraft(this.type())){
_852=DA.locale.GetText.t_("MESSAGES_NOUNSEEN_UNIT",DA.util.encode(_853));
}else{
_852=DA.locale.GetText.t_("MESSAGES_UNSEEN_UNIT",DA.util.encode(_853),DA.util.encode(_854));
}
}
return _852;
},_class:function(only){
var _856="ygtvlabel";
if(this._isRecent()){
_856+=" labelRecent";
}
if(this._isSelected()){
_856+=" labelSelected";
}
if(this._isTargeted()){
_856+=" labelTargeted";
}
if(this.select()===0){
_856+=" labelNoPointer";
}
var _857=" class=\""+_856+"\"";
return (only)?_856:_857;
},_isRecent:function(){
if(this.recentEnable()&&this.recent()>0){
return true;
}else{
return false;
}
},_isSelected:function(){
var _858;
if(this.hasClass("labelSelected")){
_858=true;
}else{
_858=false;
}
return _858;
},_isTargeted:function(){
var _859;
if(this.hasClass("labelTargeted")){
_859=true;
}else{
_859=false;
}
return _859;
},root:function(){
var _85a="&nbsp;";
var _85b=" onmouseover=\"YAHOO.util.Dom.addClass(this.parentNode, 'labelHover');\" onmouseout=\"YAHOO.util.Dom.removeClass(this.parentNode, 'labelHover');\"";
var _85c="<div id=\""+this.divId()+"\" class=\"ygtvlabel labelRoot\""+_85b+"\" onclick=\"DA.mailer.util.treeOpenAll('"+this.treeNode.id+"');\">"+this._image()+_85a+this._name()+_85a+this._count()+"</div>";
return _85c;
},label:function(_85d){
var _85e="&nbsp;";
var _85f=(this.data.select===1)?" onmouseover=\"YAHOO.util.Dom.addClass(this.parentNode, 'labelHover');\" onmouseout=\"YAHOO.util.Dom.removeClass(this.parentNode, 'labelHover');\"":"";
var _860;
if(_85d){
_860={id:this.fid(),label:"<div id=\""+this.divId()+"\""+_85f+">"+this._image()+_85e+this._name()+_85e+this._count()+"</div>",style:this._class(true)};
}else{
_860="<div id=\""+this.divId()+"\""+this._class()+_85f+">"+this._image()+_85e+this._name()+_85e+this._count()+"</div>";
}
return _860;
},dummy:function(){
var _861="&nbsp;";
var _862=this._image()+_861+this._name()+_861+this._count();
return _862;
},selected:function(){
var _863="&nbsp;";
var _864=this._image()+_863+this._name()+_863+this._countOnly();
return _864;
},_cachedFuncs:{mouseover:function(){
YAHOO.util.Dom.addClass(this.parentNode,"labelHover");
},mouseout:function(){
YAHOO.util.Dom.removeClass(this.parentNode,"labelHover");
}},refresh:function(){
var node=this.node();
var _866=this.divId();
var div=$(_866);
if(!div||div.tagName!=="DIV"){
if(node){
node.setUpLabel(this.label(true));
}
return;
}
if(node){
node.setUpLabel(this.label(true));
node.getLabelEl().className=this._class(true);
div.innerHTML=[this._image(),this._name(),this._count()].join("&nbsp;");
}
},hasClass:function(name){
if(this.node()){
if(YAHOO.util.Dom.hasClass(this.node().getLabelEl(),name)){
return true;
}else{
return false;
}
}else{
return false;
}
},addClass:function(name){
var node=this.node();
var el=node.getLabelEl();
YAHOO.util.Dom.addClass(el,name);
node.labelStyle=el.className;
},removeClass:function(name){
var node=this.node();
var el=node.getLabelEl();
if(el){
YAHOO.util.Dom.removeClass(el,name);
node.labelStyle=el.className;
}
}};
DA.mailer.QuotaController=function(_86f,_870){
this.storageNode=_86f;
this.messagesNode=_870;
if(DA.vars.custom.threePane.setQuota){
eval(DA.vars.custom.threePane.setQuota);
}
};
DA.mailer.QuotaController.prototype={storageNode:null,messagesNode:null,storageQuota:null,messagesQuota:null,storageUse:null,messagesUse:null,storageOver:null,messagesOver:null,_storage:function(){
var _871=this.storageQuota;
var _872=this.storageUse;
var _873="";
if(!DA.util.isEmpty(_871)&&!DA.util.isEmpty(_872)){
if(DA.vars.config.cap_size_unit==="MB"){
_872=(_872/1024).toFixed(2);
_871=(_871/1024).toFixed(2);
_873="&lt;"+DA.util.encode(_872)+"/"+DA.util.encode(_871)+"&gt;"+DA.locale.GetText.t_("STORAGE_UNIT_MB");
}else{
_873="&lt;"+DA.util.encode(_872)+"/"+DA.util.encode(_871)+"&gt;"+DA.locale.GetText.t_("STORAGE_UNIT");
}
}
return _873;
},_messages:function(){
var _874=this.messagesQuota;
var _875=this.messagesUse;
var _876;
if(!DA.util.isEmpty(_874)&&!DA.util.isEmpty(_875)){
_876="&lt;"+DA.util.encode(_875)+"/"+DA.util.encode(_874)+"&gt;"+DA.locale.GetText.t_("MESSAGE_UNIT");
}
return _876;
},set:function(data){
if(data.quota!==null){
this.storageQuota=data.quota.storage;
this.messagesQuota=data.quota.messages;
this.storageUse=data.use.storage;
this.messagesUse=data.use.messages;
if(data.quota.limit.storage===1||data.quota.over.storage===1){
this.storageOver=true;
}else{
this.storageOver=false;
}
if(data.quota.limit.messages===1||data.quota.over.messages===1){
this.messagesOver=true;
}else{
this.messagesOver=false;
}
}
},view:function(){
var _878=this._storage();
var _879=this._messages();
if(!DA.util.isEmpty(_878)){
this.storageNode.innerHTML=_878;
if(this.storageOver){
YAHOO.util.Dom.removeClass(this.storageNode,"quotaNormal");
YAHOO.util.Dom.addClass(this.storageNode,"quotaWarn");
}else{
YAHOO.util.Dom.removeClass(this.storageNode,"quotaWarn");
YAHOO.util.Dom.addClass(this.storageNode,"quotaNormal");
}
}
if(!DA.util.isEmpty(_879)){
this.messagesNode.innerHTML=_879;
if(this.messagesOver){
YAHOO.util.Dom.removeClass(this.messagesNode,"quotaNormal");
YAHOO.util.Dom.addClass(this.messagesNode,"quotaWarn");
}else{
YAHOO.util.Dom.removeClass(this.messagesNode,"quotaWarn");
YAHOO.util.Dom.addClass(this.messagesNode,"quotaNormal");
}
}
}};
DA.mailer.FolderTreePopupMenu=function(ftc){
this.ftc=ftc;
this.treeData=ftc.treeData;
this.treeNode=ftc.treeNode;
this.popupNode=ftc.popupNode;
this.init();
};
DA.mailer.FolderTreePopupMenu.prototype={ftc:null,treeData:null,treeNode:null,popupNode:null,menuData:null,poupuMenu:null,cfDialog:null,rfDialog:null,ifDialog:null,targetedFid:null,_id2fid:function(id){
if(id.match(/^da\_folderTreeDivId\_(\d+)$/)){
return parseInt(RegExp.$1,10);
}else{
return null;
}
},init:function(){
var me=this;
this.menuData={order:[["open","close"],["trash"],["create","delete","rename"],["import","export"],["filter"],["rebuild"]],items:{open:{text:DA.locale.GetText.t_("FOLDER_OPEN_MENU"),onclick:function(){
me.ftc._open(me.targetedFid);
}},close:{text:DA.locale.GetText.t_("FOLDER_CLOSE_MENU"),onclick:function(){
me.ftc._close(me.targetedFid);
}},trash:{text:DA.locale.GetText.t_("WASTE_TRASH_MENU",DA.locale.GetText.t_("TRASH")),onclick:function(){
if(DA.util.confirm(DA.locale.GetText.t_("WASTE_TRASH_CONFIRM",me.ftc._name(me.targetedFid)))){
me.ftc._trash(me.targetedFid);
}
}},create:{text:DA.locale.GetText.t_("FOLDER_ADD_MENU"),onclick:function(e){
me.cfDialog.setString("");
me.cfDialog.show(e.clientX,e.clientY);
}},"delete":{text:DA.locale.GetText.t_("FOLDER_DELETE_MENU"),onclick:function(){
if(me.ftc._hasChildren(me.targetedFid)){
if(DA.util.confirm(DA.locale.GetText.t_("FOLDER_DELETE_CONFIRM4PARENT",me.ftc._name(me.targetedFid)))){
me.ftc._delete(me.targetedFid);
}
}else{
if(DA.util.confirm(DA.locale.GetText.t_("FOLDER_DELETE_CONFIRM",me.ftc._name(me.targetedFid)))){
me.ftc._delete(me.targetedFid);
}
}
}},rename:{text:DA.locale.GetText.t_("FOLDER_RENAME_MENU"),onclick:function(e){
me.rfDialog.setString(me.ftc._name(me.targetedFid));
me.rfDialog.show(e.clientX,e.clientY);
}},"import":{text:DA.locale.GetText.t_("FOLDER_IMPORT_MENU"),onclick:function(e){
me.ifDialog.clear();
me.ifDialog.show(e.clientX,e.clientY);
}},"export":{text:DA.locale.GetText.t_("FOLDER_EXPORT_MENU"),onclick:function(){
me.ftc._export(me.targetedFid);
}},filter:{text:DA.locale.GetText.t_("FOLDER_FILTER_MENU"),onclick:function(){
me.ftc._filter(me.targetedFid);
}},rebuild:{text:DA.locale.GetText.t_("FOLDER_REBUILD_MENU"),onclick:function(){
if(DA.util.confirm(DA.locale.GetText.t_("FOLDER_REBUILD_CONFIRM"))){
me.ftc._rebuild(me.targetedFid);
}
}}}};
me.popupMenu=new DA.widget.ContextMenuController("da_folderTreePopupMenu",me.treeNode.id,me.menuData,{onTrigger:function(e){
var _881=YAHOO.util.Event.getTarget(e);
var _882=DA.dom.findParent(_881,"DIV",5);
if(!_882||!_882.id){
return false;
}
var _883=_882.id;
if(!_883.match(/^da\_folderTreeDivId\_(\d+)$/)){
return false;
}
if(me.ftc.existsLock()){
return false;
}
me.cfDialog.hide();
me.rfDialog.hide();
me.ifDialog.hide();
var fid=me._id2fid(_883);
if(DA.util.isNull(fid)||me.ftc._type(fid)===DA.vars.folderType.root){
return false;
}
if(me.ftc._openOk(fid)){
me.popupMenu.enabled("open");
}else{
me.popupMenu.disabled("open");
}
if(me.ftc._closeOk(fid)){
me.popupMenu.enabled("close");
}else{
me.popupMenu.disabled("close");
}
if(me.ftc._trashOk(fid)){
me.popupMenu.text("trash",DA.locale.GetText.t_("WASTE_TRASH_MENU",me.ftc._name(fid)));
me.popupMenu.visible("trash");
}else{
me.popupMenu.hidden("trash");
}
if(me.ftc._createOk(fid)){
me.popupMenu.enabled("create");
}else{
me.popupMenu.disabled("create");
}
if(me.ftc._deleteOk(fid)){
me.popupMenu.enabled("delete");
}else{
me.popupMenu.disabled("delete");
}
if(me.ftc._renameOk(fid)){
me.popupMenu.enabled("rename");
}else{
me.popupMenu.disabled("rename");
}
if(me.ftc._importOk(fid)){
me.popupMenu.enabled("import");
}else{
me.popupMenu.disabled("import");
}
if(me.ftc._exportOk(fid)){
me.popupMenu.enabled("export");
}else{
me.popupMenu.disabled("export");
}
if(me.ftc._filterOk(fid)){
me.popupMenu.enabled("filter");
}else{
me.popupMenu.disabled("filter");
}
if(me.ftc._rebuildOk(fid)){
me.popupMenu.enabled("rebuild");
}else{
me.popupMenu.disabled("rebuild");
}
me.targetedFid=fid;
return true;
}});
this.cfDialog=new DA.widget.StringChangerDialog("da_createFolderDialog",DA.locale.GetText.t_("FOLDER_CREATE_DIALOG"),"",{onEnter:function(){
var el=YAHOO.util.Dom.get(me.cfDialog.childId("text"));
me.ftc._create(me.targetedFid,el.value,DA.vars.folderType["default"]);
return false;
}});
this.rfDialog=new DA.widget.StringChangerDialog("da_renameFolderDialog",DA.locale.GetText.t_("FOLDER_RENAME_DIALOG"),"",{onEnter:function(){
var el=YAHOO.util.Dom.get(me.rfDialog.childId("text"));
me.ftc._rename(me.targetedFid,el.value);
return false;
}});
this.ifDialog=new DA.mailer.widget.MailImportDialog("da_importFolderDialog",DA.locale.GetText.t_("FOLDER_IMPORT_DIALOG"),{onEnter:function(){
var file=DA.dom.fileValue(me.ifDialog.childId("file"));
var type=DA.dom.radioValue(me.ifDialog.childId("archive_type"));
if(DA.util.isEmpty(file)){
DA.util.warn(DA.locale.GetText.t_("IMPORT_PATH_EMPTY"));
}else{
if(type==="eml"&&!file.match(/\.eml$/i)&&!DA.util.confirm(DA.locale.GetText.t_("FOLDER_IMPORTEML_CONFIRM"))){
return false;
}
me.ftc.importNode=YAHOO.util.Dom.get(me.ifDialog.childId("form"));
me.ftc._import(me.targetedFid);
}
return false;
}});
}};
DA.widget.VirtualScrollingTable=function(_889){
var _88a={visibleRows:10,maxVisisbleRows:20,totalRows:1000,resizableColumns:true,isUsingFakeTable:false,columns:[{key:"uid",name:"uid",width:"50%"}]};
Object.extend(_88a,_889||{});
this.columns=_88a.columns;
var _88b=_88a.columns.map(function(c){
return {width:c.width};
});
this.isUsingFakeTable=_88a.isUsingFakeTable;
var _88d=_88a.table||DA.widget.makeATable(_88a.maxVisisbleRows+1,_88b);
var _88e=_88a.headerTable||DA.widget.makeATable(1,_88b,null,[_88a.columns.pluck("name")]);
_88d.className="da_virtualScrollingTable";
_88e.className="da_virtualScrollingHeaderTable";
_88d.id=_88d.id||"da_virtualScrollingTable_"+(new Date()).getTime();
_88e.id=_88d.id+"_header";
this.containerElem=_88a.containerElem||document.createElement("div");
if(!this.containerElem.parentNode){
document.body.appendChild(this.containerElem);
}
var _88f=document.createElement("div");
Object.extend(_88f.style,{paddingRight:"18px",marginRight:"3px",backgroundColor:"#ddd"});
_88f.appendChild(_88e);
this.containerElem.appendChild(_88f);
this.containerElem.appendChild(_88d);
if("function"===typeof _88a.onLoading){
this.onLoading=_88a.onLoading;
}
if("function"===typeof _88a.onLoadDone){
this.onLoadDone=_88a.onLoadDone;
}
this.maxVisisbleRows=_88a.maxVisisbleRows;
this.jsonIO=new DA.io.JsonIO(_88a.url,_88a.urlParams);
var me=this;
this.jsonIO.callback=function(_891,_892){
var _893=_891.start_sno;
var _894=me.processingRequest&&me.processingRequest.bufferOffset;
if(!DA.util.isUndefined(_893)&&!DA.util.isNull(_893)&&_893!==(_894+1)){
me.processingRequest.bufferOffset=_893-1;
me.buffer.rows.length=_893-2;
}
me.ajaxUpdate(_891);
me.scroller.updateSize();
me.onLoadDone();
if(me.metaData.getTotalRows()===0){
_88d.className=me.options.emptyClass;
}else{
_88d.className=me.options.tableClass;
}
if(!DA.util.isUndefined(_891.select_sno)&&_891.select_sno!==null){
this.__mboxGrid.liveGrid.scroller.moveScroll(_891.select_sno);
this.__mboxGrid._lastClickedRowMetaData.sno=_891.select_sno+1;
}
};
if(!this.isUsingFakeTable){
this.jsonIO.defaultParams.format="AoA";
}
this._computeRowHeight();
this._setupCSS(_88d.id);
this.initialize(_88d.id,_88a.visibleRows,_88a.totalRows,_88a.url,Object.extend(_88a.liveGridOptions||{},{prefetchBuffer:true,sortAscendImg:DA.vars.imgRdir+"/sort_asec.gif",sortDescendImg:DA.vars.imgRdir+"/sort_desc.gif",loadingClass:"da_virtualScrollingTableLoading",emptyClass:"da_virtualScrollingTableEmpty",sortImageHeight:"11px",sortImageWidth:"7px",columns:_88a.columns.map(function(c){
return [c.key,true];
}),optimizeTinyScroll:true}));
if(this.isUsingFakeTable){
this.applyFakeTableOverrides();
}
var crzr;
if(_88a.resizableColumns){
if(this.isUsingFakeTable){
crzr=new DA.widget.MFTColumnResizer(_88e,_88d,{minWidth:20},this.columns);
}else{
crzr=new DA.widget.MirroredColumnResizer(_88d,_88e,{minWidth:20});
}
YAHOO.util.Dom.getElementsByClassName("da_columnResizer","div",_88e.rows[0]).each(function(el,i){
if(!i){
return;
}
var hndl=new DA.widget.TwoColumnResizeHandle(_88d,el,crzr,i-1);
});
crzr.moveRight(0,1);
}
};
DA.widget.MirroredColumnResizer=function(_89a,_89b,_89c){
DA.widget.MirroredColumnResizer.superclass.constructor.call(this,_89a,_89c);
this.table2=_89b;
this._cols2=_89b.getElementsByTagName("col");
};
YAHOO.lang.extend(DA.widget.MirroredColumnResizer,DA.widget.ColumnResizer);
DA.widget.MirroredColumnResizer.prototype.setColWidthPerc=function(w,n){
this._cols[n].width=this._cols2[n].width=(w+"%");
};
DA.widget.MirroredColumnResizer.prototype.setColWidth=function(w,n){
this._cols[n].width=this._cols2[n].width=(w+"px");
};
DA.widget.MirroredColumnResizer.prototype.moveRight=function(l,_8a2){
if(this.tableLayoutHack){
this.table2.style.tableLayout="auto";
}
DA.widget.MirroredColumnResizer.superclass.moveRight.call(this,l,_8a2);
if(this.tableLayoutHack){
this.table2.style.tableLayout="fixed";
}
};
DA.widget.MFTColumnResizer=function(_8a3,_8a4,_8a5,_8a6){
DA.widget.MFTColumnResizer.superclass.constructor.call(this,_8a3,_8a5);
this.divtable=_8a4;
this.styleSheet=document.styleSheets[0];
var _8a7=this.styleSheet.addRule?this._createCSSRuleIE:this.styleSheet.insertRule?this._createCSSRuleW3C:null;
_8a6.each(_8a7.bind(this));
var _8a8={};
var _8a9=this.styleSheet.cssRules?this.styleSheet.cssRules:this.styleSheet.rules?this.styleSheet.rules:[];
$A(_8a9).each(function(rule){
_8a8[rule.selectorText.toLowerCase()]=rule;
});
this._styles=_8a6.map(function(col){
return _8a8["div."+col.key];
});
};
YAHOO.lang.extend(DA.widget.MFTColumnResizer,DA.widget.ColumnResizer);
DA.widget.MFTColumnResizer.prototype.setColWidthPerc=function(w,n){
this._cols[n].width=(w+"%");
if(n===(this._styles.length-1)){
this._styles[n].style.width=(w-1)+"%";
}else{
this._styles[n].style.width=(w+"%");
}
};
DA.widget.MFTColumnResizer.prototype.setColWidth=function(w,n){
this._cols[n].width=this._styles[n].style.width=(w+"px");
};
DA.widget.MFTColumnResizer.prototype.moveRight=function(l,_8b1){
if(this.tableLayoutHack){
this.divtable.style.tableLayout="auto";
}
DA.widget.MFTColumnResizer.superclass.moveRight.call(this,l,_8b1);
if(this.tableLayoutHack){
this.divtable.style.tableLayout="fixed";
}
};
DA.widget.MFTColumnResizer.prototype._createCSSRuleW3C=function(_8b2){
var _8b3="div."+_8b2.key+" { width: "+_8b2.width+";}";
this.styleSheet.insertRule(_8b3,0);
};
DA.widget.MFTColumnResizer.prototype._createCSSRuleIE=function(_8b4){
var _8b5="div."+_8b4.key;
var rule="width:"+_8b4.width;
this.styleSheet.addRule(_8b5,rule);
};
if("undefined"===typeof Rico||"undefined"===typeof Rico.LiveGrid||"undefined"===typeof Rico.LiveGridBuffer||"undefined"===typeof Rico.TableColumn){
throw "DEPENDENCY ERROR: RICO not found, we cannot continue";
}
DA.widget.VirtualScrollingTable.prototype=Rico.LiveGrid.prototype;
DA.widget.VirtualScrollingTable.prototype.applyFakeTableOverrides=function(){
this.viewPort.populateRow=function(_8b7,row){
var _8b9,_8ba;
if(_8b7){
_8b9=row.meta;
_8b7.innerHTML=row.html;
_8ba=this.liveGrid.isSelected(_8b9);
if(_8b9.className){
_8b7.className="da_rowdiv "+_8b9.className+(_8ba?" da_gridSelectedRow":"");
}else{
_8b7.className="da_rowdiv "+(_8ba?"da_gridSelectedRow":"");
}
_8b7.__daGridRowMetaData=_8b9;
}
};
this.viewPort.rotate=function(_8bb){
var tb=this.table;
var i;
if(_8bb>0){
for(i=0;i<_8bb;++i){
tb.appendChild(tb.firstChild);
}
}else{
for(i=0;i>_8bb;--i){
tb.insertBefore(tb.lastChild,tb.firstChild);
}
}
};
this.buffer.blankRow={meta:{},html:"&nbsp;"};
};
DA.widget.VirtualScrollingTable.prototype.update=function(_8be,_8bf){
if(_8bf===true){
this.jsonIO.defaultParams=_8be;
}else{
Object.extend(this.jsonIO.defaultParams,_8be||{});
}
this.metaData.setTotalRows(undefined);
this.resetContents();
this.requestContentRefresh(0);
};
DA.widget.VirtualScrollingTable.prototype.getParameters=function(){
return {sortCol:this.sortCol,sortDir:this.sortDir}.extend(this.jsonIO.defaultParams||{});
};
DA.widget.VirtualScrollingTable.prototype.isEquivalent=function(grid){
if(!grid){
return false;
}
if(this===grid){
return true;
}
var _8c1=grid.getParameters();
var _8c2=this.getParameters()||{};
if(!_8c1){
return false;
}
return DA.util.areEquivObjs(_8c2,_8c1);
};
DA.widget.VirtualScrollingTable.prototype.getUIStateInfo=function(){
var _8c3=this.sort.headerTable.rows[0].cells;
return {columns:this.options.columns.map(function(col,_8c5){
return {name:col.name,width:_8c3[_8c5].offsetWidth};
})};
};
DA.widget.VirtualScrollingTable.prototype.isUsingFakeTable=false;
DA.widget.VirtualScrollingTable.prototype.isSelected=function(_8c6){
return false;
};
DA.widget.VirtualScrollingTable.prototype.clearSelection=function(){
};
DA.widget.VirtualScrollingTable.prototype.resizeHeight=function(_8c7,_8c8){
var _8c9=this.sort.headerTable.offsetHeight;
var _8ca=Math.max((_8c7-_8c9),50);
var vp=this.viewPort;
var _8cc=Math.ceil(_8ca/vp.rowHeight);
var _8cd=true;
var _8ce=_8cc>(vp.visibleRows-1);
var _8cf=_8c8&&_8ce;
if(_8cc>this.maxVisisbleRows){
_8cd=false;
this._setVisibleRows(this.maxVisisbleRows);
_8ca=this.maxVisisbleRows*vp.rowHeight;
}else{
this._setVisibleRows(_8cc);
}
if(_8ce){
vp.isPartialBlank=true;
}
if(_8cf){
vp.bufferChanged();
}
this._resizeHeight(_8ca);
return _8cd;
};
DA.widget.VirtualScrollingTable.prototype.setVisibleRows=function(n){
var _8d1=this._setVisibleRows(n);
this._resizeHeight(_8d1*this.viewPort.rowHeight);
return (_8d1<this.maxVisisbleRows);
};
DA.widget.VirtualScrollingTable.prototype._resizeHeight=function(_8d2){
this.viewPort.div.style.height=_8d2+"px";
this.scroller.scrollerDiv.style.height=_8d2+"px";
this.scroller.updateSize();
};
DA.widget.VirtualScrollingTable.prototype._setVisibleRows=function(n){
var _8d4=true;
var _8d5=n;
if(n>this.maxVisisbleRows){
_8d4=false;
_8d5=this.maxVisisbleRows;
}
this.viewPort.visibleRows=_8d5+1;
this.metaData.pageSize=_8d5;
this.buffer.maxBufferSize=this.metaData.getLargeBufferSize()*2;
this.buffer.maxFetchSize=this.metaData.getLargeBufferSize();
return _8d5;
};
DA.widget.VirtualScrollingTable.prototype._computeRowHeight=function(){
var div=document.createElement("div");
div.style.fontColor="white";
div.innerHTML="Sample Text";
document.body.appendChild(div);
var _8d7=YAHOO.util.Dom.getRegion(div);
this._computedRowHeightPx=(_8d7.bottom-_8d7.top)+2;
document.body.removeChild(div);
};
DA.widget.VirtualScrollingTable.prototype._computedRowHeightPx=16;
DA.widget.VirtualScrollingTable.prototype._setupCSS=function(_8d8){
DA.dom.createCSSRule((this.isUsingFakeTable?"div#"+_8d8+" div.da_rowdiv":"table#"+_8d8+" td"),("height:"+this._computedRowHeightPx+"px"));
};
DA.widget.VirtualScrollingTable.prototype.onLoadDone=Prototype.emptyFunction;
DA.widget.VirtualScrollingTable.prototype.onLoading=Prototype.emptyFunction;
Rico.LiveGridBuffer.prototype.loadRows=function(obj){
var _8da=obj.total;
this.metaData.setTotalRows(_8da?_8da:0);
var ret=obj.list;
return ret?ret:[];
};
Rico.LiveGridBuffer.prototype.update=function(_8dc,_8dd){
var _8de=this.loadRows(_8dc);
if(this.rows.length===0||_8dd===this.startPos){
this.rows=_8de;
this.size=this.rows.length;
this.startPos=_8dd;
return;
}
var _8df;
if(_8dd>this.startPos){
if(this.startPos+this.rows.length<_8dd){
this.rows=_8de;
this.startPos=_8dd;
}else{
this.rows=this.rows.concat(_8de.slice(0,_8de.length));
if(this.rows.length>this.maxBufferSize){
_8df=this.rows.length;
this.rows=this.rows.slice(this.rows.length-this.maxBufferSize,this.rows.length);
this.startPos=this.startPos+(_8df-this.rows.length);
}
}
}else{
if(_8dd+_8de.length<this.startPos){
this.rows=_8de;
}else{
this.rows=_8de.slice(0,this.startPos).concat(this.rows);
if(this.rows.length>this.maxBufferSize){
this.rows=this.rows.slice(0,this.maxBufferSize);
}
}
this.startPos=_8dd;
}
this.size=this.rows.length;
};
Rico.LiveGrid.prototype.initAjax=Prototype.emptyFunction;
Rico.TableColumn.SORT_ASC="asec";
Rico.TableColumn.SORT_DESC="desc";
Rico.GridViewPort.prototype.isGoingUp=function(_8e0){
return _8e0<this.lastRowPos;
};
Rico.GridViewPort.prototype.isGoingDown=function(_8e1){
return _8e1>this.lastRowPos;
};
Rico.LiveGrid.prototype.fetchBuffer=function(_8e2){
var _8e3=false,_8e4=false,_8e5=false;
var _8e6,_8e7;
if(this.buffer.isInRange(_8e2)){
_8e3=true;
if(this.viewPort.isGoingUp(_8e2)){
if(!this.buffer.isAtTop()&&this.buffer.isNearingTopLimit(_8e2)){
_8e4=true;
}else{
return;
}
}else{
if(this.viewPort.isGoingDown(_8e2)){
if(!this.buffer.isAtBottom()&&this.buffer.isNearingBottomLimit(_8e2)){
_8e5=true;
}else{
return;
}
}else{
return;
}
}
}
if(this.processingRequest){
this.unprocessedRequest=new Rico.LiveGridRequest(_8e2);
return;
}
if(!this.isIORequired()){
return;
}
if(!_8e3){
_8e6=this.buffer.getFetchOffset(_8e2);
_8e7=this.buffer.getFetchSize(_8e2);
}else{
if(_8e5){
_8e6=this.buffer.getFetchOffset(_8e2);
_8e7=this.buffer.getFetchSize(_8e2);
}else{
if(_8e4){
_8e6=this.buffer.startPos-this.buffer.maxFetchSize;
_8e7=this.buffer.maxFetchSize;
}else{
return;
}
}
}
if(_8e6<0){
_8e6=0;
}
if(_8e7===0){
return;
}
this.processingRequest=new Rico.LiveGridRequest(_8e2);
this.processingRequest.bufferOffset=_8e6;
var _8e8={start_sno:(_8e6+1),end_sno:(_8e6+_8e7)};
if(this.sortCol){
_8e8.sort_key=this.sortCol;
_8e8.sort=this.sortDir;
if(!DA.util.isUndefined(this.select_uid)){
_8e8.select_uid=this.select_uid;
delete this.select_uid;
}
}
this.jsonIO.execute(_8e8);
this.timeoutHandler=setTimeout(this.handleTimedOut.bind(this),this.options.bufferTimeout);
this.onLoading();
};
Rico.LiveGrid.prototype.isIORequired=function(){
return true;
};
Rico.LiveGrid.prototype.addLiveGridHtml=function(){
var _8e9;
var i=0;
if(this.table.getElementsByTagName("thead").length>0){
_8e9=this.table.cloneNode(true);
_8e9.setAttribute("id",this.tableId+"_header");
_8e9.setAttribute("class",this.table.className+"_header");
for(i=0;i<_8e9.tBodies.length;i++){
_8e9.removeChild(_8e9.tBodies[i]);
}
this.table.deleteTHead();
this.table.parentNode.insertBefore(_8e9,this.table);
}
var ins=new Insertion.Before(this.table,"<div id='"+this.tableId+"_container'>"+"<div id='"+this.tableId+"_scrollerdiv' style='float:right'></div>");
this.table.previousSibling.appendChild(this.table);
ins=new Insertion.Before(this.table,"<div id='"+this.tableId+"_viewport'></div>");
this.table.previousSibling.appendChild(this.table);
};
Rico.LiveGridScroller.prototype.createScrollBar=function(){
var _8ec=this.liveGrid.viewPort.visibleHeight();
this.scrollerDiv=$(this.liveGrid.tableId+"_scrollerdiv");
var _8ed=this.scrollerDiv.style;
Object.extend(_8ed,{position:"relative","float":"right",left:"-3px",width:"24px",height:_8ec+"px",overflow:"auto"});
this.heightDiv=document.createElement("div");
this.heightDiv.style.width="1px";
this.heightDiv.style.height=parseInt(_8ec*this.metaData.getTotalRows()/this.metaData.getPageSize(),10)+"px";
this.scrollerDiv.appendChild(this.heightDiv);
this.scrollerDiv.onscroll=this.handleScroll.bindAsEventListener(this);
var _8ee=this.liveGrid.table;
var _8ef=this.isIE?"mousewheel":"DOMMouseScroll";
var _8f0=function(evt){
if(evt.wheelDelta>=0||evt.detail<0){
this.scrollerDiv.scrollTop-=(2*this.viewPort.rowHeight);
}else{
this.scrollerDiv.scrollTop+=(2*this.viewPort.rowHeight);
}
this.handleScroll(false);
Event.stop(evt);
}.bindAsEventListener(this);
var _8f2=false;
this.disableMouseScroll=function(){
if(!_8f2){
return;
}
_8f2=false;
Event.stopObserving(_8ee,_8ef,_8f0,false);
};
this.enableMouseScroll=function(){
if(_8f2){
return;
}
_8f2=true;
Event.observe(_8ee,_8ef,_8f0,false);
};
this.enableMouseScroll();
};
Rico.LiveGridSort.prototype.addSortBehaviorToColumn=function(n,cell){
var elem;
if(this.options.columns[n].isSortable()){
cell.innerHTML="<div class=\"da_columnResizer\">|&nbsp;</div>"+"<span>"+cell.innerHTML+"</span>"+"<span id=\""+this.headerTableId+"_img_"+n+"\">&nbsp;&nbsp;&nbsp;</span>";
elem=cell;
if(elem){
elem.style.cursor="pointer";
elem.id=this.headerTableId+"_"+n;
Event.observe(elem,"click",this.headerCellClicked.bindAsEventListener(this),true);
}else{
}
}
};
Rico.LiveGridSort.prototype.setSortImage=function(n){
var _8f7=this.options.columns[n].getSortDirection();
var _8f8=$(this.headerTableId+"_img_"+n);
if(_8f7===Rico.TableColumn.UNSORTED){
_8f8.innerHTML="&nbsp;&nbsp;";
}else{
if(_8f7===Rico.TableColumn.SORT_ASC){
_8f8.innerHTML="<img width=\""+this.options.sortImageWidth+"\" "+"height=\""+this.options.sortImageHeight+"\" "+"src=\""+this.options.sortAscendImg+"\"/>";
}else{
if(_8f7===Rico.TableColumn.SORT_DESC){
_8f8.innerHTML="<img width=\""+this.options.sortImageWidth+"\" "+"height=\""+this.options.sortImageHeight+"\" "+"src=\""+this.options.sortDescendImg+"\"/>";
}
}
}
};
DA.widget.VirtualScrollingTable.prototype.setColumnTitle=function(n,_8fa){
var _8fb=$(this.tableId+"_header");
if(!_8fb){
return false;
}
var row=_8fb.rows?_8fb.rows[0]:undefined;
if(!row){
return false;
}
var cell=row.cells[n];
if(!cell){
return false;
}
if(this.options.columns[n]&&this.options.columns[n].isSortable()){
cell.getElementsByTagName("span")[0].innerHTML=_8fa;
}else{
cell.innerHTML=_8fa;
}
return true;
};
DA.widget.VirtualScrollingTable.prototype.removeColumnSort=function(){
var _8fe=this.sort.getSortedColumnIndex();
if(_8fe!==-1){
this.sortCol="";
this.sortDir="";
this.sort.removeColumnSort(_8fe);
}
};
Rico.LiveGridSort.prototype.headerCellClicked=function(evt){
var _900=evt.target?evt.target:evt.srcElement;
var cell=DA.dom.findParent(_900,"TD",3);
if(!cell){
return;
}
var _902=cell.id;
var _903=parseInt(_902.substring(_902.lastIndexOf("_")+1),10);
var _904=this.getSortedColumnIndex();
if(_904!==-1){
if(_904!==_903){
this.removeColumnSort(_904);
this.setColumnSort(_903,Rico.TableColumn.SORT_DESC);
}else{
this.toggleColumnSort(_904);
}
}else{
this.setColumnSort(_903,Rico.TableColumn.SORT_DESC);
}
if(this.options.sortHandler){
this.options.sortHandler(this.options.columns[_903]);
}
};
Rico.LiveGrid.prototype.sortHandler=function(_905){
if(!_905){
return;
}
this.sortCol=_905.name;
this.sortDir=_905.currentSort;
if(this.metaData.getTotalRows()===0){
return;
}
var _906=this.getSelected();
if(DA.util.isNull(_906.srid)&&_906.count===1){
this.select_uid=_906.singles[0].uid;
}else{
this.clearSelection();
}
this.resetContents();
this.requestContentRefresh(0);
};
Rico.LiveGrid.prototype.clear=function(){
this.jsonIO.defaultParams={};
this.table.className=this.options.emptyClass;
};
Rico.GridViewPort.prototype.populateRow=function(_907,row){
var j=0;
var _90a=row[0];
var _90b=row.length;
var _90c=_907.cells;
var _90d=this.liveGrid.isSelected(_90a);
for(j=1;j<_90b;j++){
_90c[j-1].innerHTML=row[j];
}
if(_90a.className){
_907.className=_90a.className+(_90d?" da_gridSelectedRow":"");
}else{
_907.className=(_90d?"da_gridSelectedRow":"");
}
_907.__daGridRowMetaData=_90a;
};
Rico.GridViewPort.prototype.updateSelectionStatus=function(){
var _90e=this.visibleRows;
var lg=this.liveGrid;
var i;
var rows=this.liveGrid.isUsingFakeTable?this.table.childNodes:this.table.rows;
var _912;
var _913;
var yes=[];
var no=[];
for(i=0;i<_90e;++i){
_912=rows[i];
if(!_912){
continue;
}
_913=_912.__daGridRowMetaData;
if(lg.isSelected(_913)){
yes.push(_912);
}else{
no.push(_912);
}
}
YAHOO.util.Dom.removeClass(no,"da_gridSelectedRow");
YAHOO.util.Dom.addClass(yes,"da_gridSelectedRow");
};
Rico.GridViewPort.prototype.clearRows=function(_916){
if(this.buffer.size===0){
this.liveGrid.table.className=this.liveGrid.options.emptyClass;
}else{
this.liveGrid.table.className=this.liveGrid.options.loadingClass;
}
if(this.isBlank){
return;
}
if(_916){
this.isBlank=true;
return;
}
var _917=this.visibleRows;
var _918=this.buffer.getBlankRow();
var rows=this.table.rows;
var i;
for(i=0;i<_917;++i){
this.populateRow(rows[i],_918);
}
this.isBlank=true;
};
Rico.LiveGridBuffer.prototype.getBlankRow=function(){
var i=0;
if(!this.blankRow){
this.blankRow=[{}];
for(i=0;i<this.metaData.columnCount;i++){
this.blankRow[i+1]="&nbsp;";
}
}
return this.blankRow;
};
Rico.LiveGridBuffer.prototype.removeIf=function(f){
this.rows=this.rows.reject(f);
var _91d=this.rows.length<this.size;
this.size=this.rows.length;
return _91d;
};
Rico.LiveGridBuffer.prototype.findRowMetaData=function(_91e){
return this.rows.pluck("meta").findAll(_91e||Prototype.emptyFunction);
};
Rico.GridViewPort.prototype.rotate=function(_91f){
var tb=this.table.tBodies[0];
var rows=tb.rows;
var _922=rows.length-1;
var i;
if(_91f>0){
for(i=0;i<_91f;++i){
tb.appendChild(rows[0]);
}
}else{
for(i=0;i>_91f;--i){
tb.insertBefore(rows[_922],rows[0]);
}
}
};
Rico.LiveGridScroller.prototype.handleScroll=function(){
if(this.scrollTimeout){
clearTimeout(this.scrollTimeout);
}
var _924=this.scrollerDiv.scrollTop;
var _925=this.lastScrollPos-_924;
var r;
var _927=this.scrollerDiv.scrollHeight-this.scrollerDiv.offsetHeight;
if(_925!==0){
r=_924%this.viewPort.rowHeight;
if(r!==0){
this.unplug();
if(_925<0||_924===_927){
_924+=(this.viewPort.rowHeight-r);
}else{
_924-=r;
}
this.scrollerDiv.scrollTop=_924;
_924=this.scrollerDiv.scrollTop;
this.plugin();
}
}
var _928=parseInt(_924/this.viewPort.rowHeight,10);
this.liveGrid.requestContentRefresh(_928);
this.viewPort.scrollTo(_924);
this.scrollTimeout=setTimeout(this.scrollIdle.bind(this),1200);
this.lastScrollPos=_924;
};
Rico.LiveGridScroller.prototype.moveScroll=function(_929){
var _92a=this.rowToPixel(_929);
var _92b=(_92a!==this.scrollerDiv.scrollTop);
this.scrollerDiv.scrollTop=_92a;
if(!_92b){
this.viewPort.lastPixelOffset=_92a;
}
return _92b;
};
Rico.GridViewPort.prototype.scrollTo=function(_92c){
if(this.lastPixelOffset===_92c){
return;
}
this.refreshContents(parseInt(_92c/this.rowHeight,10));
this.lastPixelOffset=_92c;
};
Rico.LiveGridScroller.prototype.updateSize=function(){
var rows=this.metaData.getTotalRows();
if(rows>=0){
this.heightDiv.style.height=(this.viewPort.rowHeight*rows)+"px";
}
};
Rico.LiveGridScroller.prototype.rowToPixel=function(_92e){
if(!_92e){
return 0;
}
var _92f=this.metaData.getTotalRows();
if(!_92f){
return 0;
}
return (_92e/_92f)*this.heightDiv.offsetHeight;
};
Rico.GridViewPort.prototype.refreshContents=function(_930){
if(_930===this.lastRowPos&&!this.isPartialBlank&&!this.isBlank){
return;
}
if((_930+this.visibleRows<this.buffer.startPos)||(this.buffer.startPos+this.buffer.size<_930)){
this.clearRows(true);
return;
}
if(this.buffer.size===0){
this.clearRows(true);
return;
}
var _931=this.isBlank===true;
this.isBlank=false;
var _932=this.buffer.startPos>_930;
var _933=_932?this.buffer.startPos:_930;
var _934=(this.buffer.startPos+this.buffer.size<_930+this.visibleRows)?this.buffer.startPos+this.buffer.size:_930+this.visibleRows;
var _935=_934-_933;
var rows=this.buffer.getRows(_933,_935);
var _937=this.visibleRows-_935;
var _938=_932?0:_935;
var _939=_932?_937:0;
var i=0;
var _93b=_930-this.lastRowPos;
var _93c=this.liveGrid.isUsingFakeTable?this.table.childNodes:this.table.rows;
var _93d=this.buffer.getBlankRow();
var _93e=rows.length;
if((this.liveGrid.options.optimizeTinyScroll===true)&&(Math.abs(_93b)<(this.visibleRows/2))&&(_939===0)&&!this.isPartialBlank&&!_931){
this.rotate(_93b);
if(_93b>0){
for(i=(_93e-_93b);i<_93e;++i){
this.populateRow(_93c[i],rows[i]);
}
this.populateRow(_93c[i],_93d);
}else{
for(i=0;i<(-_93b);++i){
this.populateRow(_93c[i],rows[i]);
}
}
}else{
for(i=0;i<_93e;++i){
this.populateRow(_93c[i+_939],rows[i]);
}
for(i=0;i<_937;++i){
this.populateRow(_93c[i+_938],_93d);
}
}
this.isPartialBlank=_937>0;
this.lastRowPos=_930;
};
Rico.LiveGridBuffer.prototype.isInRange=function(_93f){
if(_93f<this.startPos){
return false;
}
var _940=this.metaData.getPageSize();
var _941=this.endPos();
if(_93f+_940<=_941){
return true;
}
var _942=this.metaData.getTotalRows();
if(_942<_940){
return _93f+_942<=_941;
}
return false;
};
Rico.GridViewPort.prototype.getRange=function(){
var _943=this.lastRowPos;
var end=parseInt(this.visibleHeight()/this.rowHeight,10)+_943-1;
return {start:_943,end:end};
};
if(!DA||!DA.mailer||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.mailer.MessageSearcher=function(_945,_946,_947,_948){
this.itemNode=_945;
this.itemId=_945.id;
this.gridNode=_946;
this.gridId=_946.id;
this.folderTreeData=_948;
if(DA.util.isFunction(_947.onSearch)){
this.onSearch=_947.onSearch;
}
if(DA.vars.custom.searcher.setMessageSearcher){
eval(DA.vars.custom.searcher.setMessageSearcher);
}
this.init();
if(DA.vars.custom.searcher.setMessageSearcher2){
eval(DA.vars.custom.searcher.setMessageSearcher2);
}
};
DA.mailer.MessageSearcher.prototype={itemNode:null,itemId:null,gridNode:null,gridId:null,guideNode:null,nomatchNode:null,resultNode:null,resultFolderNode:null,resultTotalNode:null,itemContentsNode:null,selectedFid:null,selectedSrid:null,selectFolderType:null,folderName:null,totalMessages:null,jsonIO:null,folderTreeData:null,onSearch:Prototype.emptyFunction,init:function(){
var me=this;
var item=document.createElement("div");
item.id=this.itemId+"Contents";
item.className="da_messageSearcherItem";
var _94b=document.createElement("div");
_94b.innerHTML=DA.locale.GetText.t_("SEARCH_MESSAGE_GUIDE")+"<br>"+"<input type=button id=\"da_messageSearcherSubmit\" value=\""+DA.locale.GetText.t_("SEARCH_BUTTON")+"\">"+"<hr>";
_94b.className="da_messageSearcherGuide";
var _94c=document.createElement("div");
_94c.className="da_messageSearcherNomatch";
_94c.innerHTML=DA.locale.GetText.t_("SEARCH_NOMATCH");
var _94d=document.createElement("div");
_94d.className="da_messageSearcherResult";
this.itemNode.appendChild(item);
this.itemNode.appendChild(_94b);
this.itemNode.appendChild(_94c);
this.itemNode.appendChild(_94d);
this.itemContentsNode=item;
this.guideNode=_94b;
this.nomatchNode=_94c;
this.resultNode=_94d;
var _94e=DA.widget.makeATable(2,[{width:"5%"},{width:"95%"}],{table:"da_messageSearcherResultTable",td:"da_messageSearcherResultTd"},[[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_FID"),"<div id=\"da_messageSearcherResultFolder\">&nbsp;</div>"],[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_TOTAL"),"<div id=\"da_messageSearcherResultTotal\">&nbsp;</div>"]]);
_94d.appendChild(_94e);
this.hideNomatch();
this.hideResult();
this.resultFolderNode=YAHOO.util.Dom.get("da_messageSearcherResultFolder");
this.resultTotalNode=YAHOO.util.Dom.get("da_messageSearcherResultTotal");
var _94f=DA.widget.makeATable(4,[{width:"5%"},{width:"95%"}],{table:"da_messageSearcherItemTable",td:"da_messageSearcherItemTd"},[[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_FID"),"<select id=\"da_messageSearcherItemFid\">"+DA.vars.options.folder_tree+"</select>&nbsp;"+"<input type=checkbox id=\"da_messageSearcherItemClass\">&nbsp;"+DA.locale.GetText.t_("SEARCH_CHECKBOXMESSAGE_CLASS")],[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_KEYWORD"),"<input type=text id=\"da_messageSearcherItemKeyword\" style=\"height:1.5em; margin-right:2px\" size=\"50\" maxlength=\"200\">"+"<select id=\"da_messageSearcherItemCond\" size=1>"+"<option value=\"and\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_COND_AND")+"</option>"+"<option value=\"or\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_COND_OR")+"</option>"+"</select>"],[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_FIELD"),"<select id=\"da_messageSearcherItemField\" size=1>"+"<option value=\"text\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_TEXT")+"</option>"+"<option value=\"body\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_BODY")+"</option>"+"<option value=\"subject\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_SUBJECT")+"</option>"+"<option value=\"from\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_FROM")+"</option>"+"<option value=\"to\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_TO")+"</option>"+"<option value=\"cc\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_CC")+"</option>"+"<option value=\"bcc\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_BCC")+"</option>"+"<option value=\"group\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_GROUP")+"</option>"+"</select>"],[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_NORROWING"),"<div id=\""+this.itemId+"NORROWING\"></div>"]]);
this.itemContentsNode.appendChild(_94f);
this.nvPairs=new DA.widget.NVPairSet(YAHOO.util.Dom.get(this.itemId+"NORROWING"),{Seen:{name:DA.locale.GetText.t_("SEARCH_RADIONAME_SEEN"),value:"<input type=radio id=\"da_messageSearcherItemSeen_0\" name=\"seen\" value=\"0\" checked>&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_SEEN_ALL")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherItemSeen_1\" name=\"seen\" value=\"1\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_SEEN_UNSEEN")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherItemSeen_2\" name=\"seen\" value=\"2\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_SEEN_SEEN"),border:false,weight:false},Flagged:{name:DA.locale.GetText.t_("SEARCH_RADIONAME_FLAGGED"),value:"<input type=radio id=\"da_messageSearcherFlagged_0\" name=\"flagged\" value=\"0\" checked>&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_FLAGGED_ALL")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherFlagged_1\" name=\"flagged\" value=\"1\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_FLAGGED_UNFLAGGED")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherFlagged_2\" name=\"flagged\" value=\"2\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_FLAGGED_FLAGGED"),border:false,weight:false},Attachment:{name:DA.locale.GetText.t_("SEARCH_RADIONAME_ATTACHMENT"),value:"<input type=radio id=\"da_messageSearcherAttachment_0\" name=\"attachment\" value=\"0\" checked>&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_ATTACHMENT_ALL")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherAttachment_1\" name=\"attachment\" value=\"1\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_ATTACHMENT_NOEXISTS")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherAttachment_2\" name=\"attachment\" value=\"2\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_ATTACHMENT_EXISTS"),border:false,weight:false},Priority:{name:DA.locale.GetText.t_("SEARCH_RADIONAME_PRIORITY"),value:"<input type=radio id=\"da_messageSearcherItemPriority_0\" name=\"priority\" value=\"0\" checked>&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_PRIORITY_ALL")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherPriority_5\" name=\"priority\" value=\"5\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_PRIORITY_LOW")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherPriority_3\" name=\"priority\" value=\"3\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_PRIORITY_NORMAL")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherPriority_1\" name=\"priority\" value=\"1\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_PRIORITY_HIGH"),border:false,weight:false},ETC:{name:DA.locale.GetText.t_("SEARCH_RADIONAME_ETC"),value:"<input type=checkbox id=\"da_messageSearcherItemToself\">&nbsp;"+DA.locale.GetText.t_("SEARCH_CHECKBOXMESSAGE_TOSELF")+"<br>"+"<input type=checkbox id=\"da_messageSearcherItemDeleted\">&nbsp;"+DA.locale.GetText.t_("SEARCH_CHECKBOXMESSAGE_DELETED"),border:false,weight:false}},[],true);
this.jsonIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_search.cgi");
YAHOO.util.Event.addListener(YAHOO.util.Dom.get("da_messageSearcherSubmit"),"click",this.search,this,true);
},select:function(fid){
DA.dom.changeSelectedIndex("da_messageSearcherItemFid",fid);
},search:function(){
var me=this;
var fid,cl,_954,cond,_956,seen,_958,_959,_95a,_95b,_95c;
if(me.lock()){
fid=DA.dom.selectValue("da_messageSearcherItemFid");
cl=(DA.dom.checkedOk("da_messageSearcherItemClass"))?"2":"1";
_954=DA.dom.textValue("da_messageSearcherItemKeyword");
cond=DA.dom.selectValue("da_messageSearcherItemCond");
_956=DA.dom.selectValue("da_messageSearcherItemField");
seen=DA.dom.radioValue("seen");
_958=DA.dom.radioValue("flagged");
_959=DA.dom.radioValue("attachment");
_95a=DA.dom.radioValue("priority");
_95b=(DA.dom.checkedOk("da_messageSearcherItemToself"))?"2":"0";
_95c=(DA.dom.checkedOk("da_messageSearcherItemDeleted"))?"0":"1";
if(!_954.match(/^\s*$/)){
DA.waiting.show(DA.locale.GetText.t_("SEARCH_OPERATING_PROMPT"));
me.jsonIO.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me.selectedFid=o.fid;
me.selectedSrid=o.srid;
me.folderName=o.target;
me.totalMessages=o.total.messages;
if(o.over===1){
DA.util.warn(DA.locale.GetText.t_("SEARCH_OVER_WARN",DA.vars.system.max_search_hit));
}
if(o.total.messages>0){
me.hideNomatch();
me.showResult();
me.showGrid();
me.onSearch(o);
}else{
me.hideResult();
me.hideGrid();
me.showNomatch();
}
}else{
me.hideResult();
}
me.unlock();
DA.waiting.hide();
};
me.jsonIO.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("SEARCH_ERROR"));
me.unlock();
DA.waiting.hide();
};
me.jsonIO.execute({proc:"search",fid:fid,"class":cl,keyword:_954,cond:cond,field:_956,seen:seen,flagged:_958,attachment:_959,priority:_95a,toself:_95b,deleted:_95c});
me.unlock();
}else{
DA.util.warn(DA.locale.GetText.t_("SEARCH_KEYWORD_EMPTY"));
me.unlock();
}
}
},showNomatch:function(){
this.nomatchNode.style.display="";
},hideNomatch:function(){
this.nomatchNode.style.display="none";
},showResult:function(){
this.resultFolderNode.innerHTML=DA.util.encode(this.folderName);
this.resultTotalNode.innerHTML=DA.locale.GetText.t_("MESSAGES",DA.util.encode(this.totalMessages));
this.resultNode.style.display="";
},hideResult:function(){
this.resultNode.style.display="none";
},showGrid:function(){
this.gridNode.style.visibility="";
},hideGrid:function(){
this.gridNode.style.visibility="hidden";
},lock:function(){
if(DA.util.lock("messageSearcher")){
return true;
}else{
return false;
}
},unlock:function(){
return DA.util.unlock("messageSearcher");
},existsLock:function(){
return DA.util.existsLock("messageSearcher");
}};
if(!DA||!DA.mailer||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
(function(){
var ME=DA.mailer.Events;
if(!ME){
throw "MsgView: No Custom Events!";
}
DA.mailer.MessageViewer=function(_960,_961,_962,_963,_964,_965){
this.headerNode=_960;
this.headerId=_960.id;
this.bodyNode=_961;
this.bodyId=_961.id;
this.containerNode=_962;
this.threePane=_964;
this.requestUrl=_965;
if(_963){
if(DA.util.isFunction(_963.onLoading)){
this.onLoading=_963.onLoading;
}
if(DA.util.isFunction(_963.onLoadDone)){
this.onLoadDone=_963.onLoadDone;
}
if(DA.util.isFunction(_963.onLoadFailed)){
this.onLoadFailed=_963.onLoadFailed;
}
if(DA.util.isFunction(_963.doResize)){
this.doResize=_963.doResize;
}
}
var _966=DA.util.parseQuery(this.requestUrl);
if(_966.external&&DA.util.cmpNumber(_966.external,1)){
this.external=true;
}else{
this.external=false;
}
if(DA.vars.custom.viewer.setMessageViewer){
eval(DA.vars.custom.viewer.setMessageViewer);
}
this.init();
if(DA.vars.custom.viewer.setMessageViewer2){
eval(DA.vars.custom.viewer.setMessageViewer2);
}
};
DA.mailer.MessageViewer.prototype={headerNode:null,headerId:null,bodyNode:null,bodyId:null,headerContentsNode:null,bodyContentsNode:null,threePane:null,requestUrl:null,external:false,customHeader:false,loadingFid:null,loadingUid:null,selectedFid:null,selectedUid:null,selectedSrid:null,selectFolderType:null,selectMessageEditable:null,selectMessageNotification:null,jsonIO:null,moveIO:null,flagIO:null,attachMenu:null,attachData:{},attachNode:null,attachArea:null,customNode:null,subject:null,dialog:null,saveAttachesToLibDialog:null,recalculateHeights:function(){
var hn=this.headerNode;
var bn=this.bodyNode;
var cn=this.containerNode;
var _96a=5;
var _96b=2;
var _96c=(hn.offsetHeight+1)+(bn.offsetHeight+1)+(cn.offsetHeight+1);
var _96d=cn.offsetHeight-(hn.offsetHeight+(_96a*2)+_96b);
if(_96d>10){
bn.style.height=_96d+"px";
}else{
bn.style.height="auto";
}
},onLoading:Prototype.emptyFunction,onLoadDone:Prototype.emptyFunction,doResize:Prototype.emptyFunction,init:function(){
var me=this;
var _96f=["<div class=\"da_messageViewerHeader\">","<table class=\"da_messageViewerHeaderTable\">","<tr>","  <td colspan=\"2\" class=\"da_messageViewerHeaderTableTopLeft\">",DA.imageLoader.nullTag(1,3),"</td>","  <td class=\"da_messageViewerHeaderTableTopRight\">",DA.imageLoader.nullTag(2,3),"</td>","</tr>","<tr>","  <td class=\"da_messageViewerHeaderTableMiddleLeft\">",DA.imageLoader.nullTag(2,1),"</td>","  <td class=\"da_messageViewerHeaderTableMiddleCenter\">","    <table class=\"da_messageViewerHeaderContents\">","    <tr>","      <td id=\"",this.headerId,"Contents\"></td>","    </tr>","    </table>","  </td>","  <td class=\"da_messageViewerHeaderTableMiddleRight\">",DA.imageLoader.nullTag(2,1),"</td>","</tr>","<tr>","  <td colspan=\"2\" class=\"da_messageViewerHeaderTableBottomLeft\">",DA.imageLoader.nullTag(1,2),"</td>","  <td class=\"da_messageViewerHeaderTableBottomRight\">",DA.imageLoader.nullTag(2,2),"</td>","</tr>","</table>","</div>"].join("");
var body=["<div class=\"da_messageViewerBodyContents\" id=\"",this.bodyId,"Contents\"></div>"].join("");
this.headerNode.innerHTML=_96f;
this.bodyNode.innerHTML=body;
this.headerContentsNode=YAHOO.util.Dom.get(this.headerId+"Contents");
this.bodyContentsNode=YAHOO.util.Dom.get(this.bodyId+"Contents");
if(DA.vars.config.font==="on"){
YAHOO.util.Dom.addClass(this.bodyContentsNode,"da_nonProportionalFont");
}
if(DA.vars.custom.viewer.headerOpen||DA.vars.custom.viewer.headerClose){
this.customHeader=true;
}
this.nvPairs=new DA.widget.NVPairSet($(this.headerId+"Contents"),{Subject:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_SUBJECT"),value:""},From:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_FROM"),value:""},To:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_TO"),value:"",expanded:(DA.vars.config.detail_header_to_open===1)?true:false},Cc:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CC"),value:"",expanded:(DA.vars.config.detail_header_cc_open===1)?true:false},Bcc:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_BCC"),value:"",expanded:(DA.vars.config.detail_header_bcc_open===1)?true:false},Date:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_DATE"),value:""},Attachment:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_ATTACHMENT"),value:"",expanded:(DA.vars.config.detail_header_attachment_open===1)?true:false,id:this.headerId+"Attachment",icon:DA.vars.imgRdir+"/ico_mail_attach.gif"},Custom:{id:this.headerId+"Custom",row:DA.vars.custom.viewer.headerOpen,html:DA.vars.custom.viewer.headerClose,border:false,hidden:(this.customHeader)?false:true}},["Subject","From","Date","Custom","Attachment","To","Cc","Bcc"],(DA.vars.config.detail_header_open===1)?true:false);
this.nvPairs.onExpand=this.nvPairs.onCollapse=function(){
me.doResize();
if(me.threePane){
me.recalculateHeights();
}
};
this.attachMenu=new DA.widget.PulldownMenuController(this.headerId+"AttachmentIconPopup",this.headerId+"AttachmentIcon",this.attachData,{onTrigger:function(e){
var _972=YAHOO.util.Event.getTarget(e);
return _972&&DA.util.match(_972.id,me.headerId+"AttachmentIcon");
}});
this.attachNode=YAHOO.util.Dom.get(this.headerId+"AttachmentIcon");
if(this.customHeader){
this.customNode=YAHOO.util.Dom.get(this.headerId+"CustomHTML");
}
me.attachArea=YAHOO.util.Dom.get(this.headerId+"AttachmentSeparator");
this.jsonIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_detail.cgi");
this.moveIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi");
this.flagIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_flag.cgi");
if(this.selectedFid){
this.saveAttachesToLibDialog=new DA.widget.SaveAttachesToLibDialog("da_saveAttachToLibDialog",DA.locale.GetText.t_("SAVE_TO_LIB_DIALOG_TITLE"),me.attachData,me.selectedFid,me.selectedUid,{onEnter:function(){
var _973=document.getElementsByName("da_saveAttachToLibDialog_attaches");
var _974="";
for(var i=0;i<_973.length;i++){
if(_974!==""){
if(_973[i].checked){
_974+=",";
}
}
if(_973[i].checked){
_974+=_973[i].value;
}
}
if(_974===""){
alert(DA.locale.GetText.t_("MESSAGE_SELECT_ATTACHES_ERROR"));
return false;
}
var url,flg;
url="lib_foldersel.cgi%3fcall=ma_bundle%20uid="+this.selectedUid+"%20fid="+this.selectedFid+"%20aid="+_974;
var Img="pop_title_attachsave.gif";
DA.windowController.isePopup(url,Img,400,550,"");
return false;
}});
}
this.clear();
this._setupSubscribers();
this._setupCleanupHandlers();
},clear:function(){
FCKEditorIframeController.removeIframe(this.bodyId+"Contents"+"FckEditorViewer",this.bodyContentsNode);
this.bodyContentsNode.innerHTML=(this.threePane)?DA.locale.GetText.t_("DEFAULT_MESSAGE_BODY"):"";
this.nvPairs.changeName("Subject",DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_SUBJECT"));
this.nvPairs.changeValue("Subject","");
this.nvPairs.changeValue("From","");
this.nvPairs.changeValue("To","");
this.nvPairs.changeValue("Cc","");
this.nvPairs.changeValue("Bcc","");
this.nvPairs.changeValue("Date","");
this.nvPairs.changeValue("Attachment","");
this.nvPairs.changeExpand("From","");
this.nvPairs.changeExpand("To","");
this.nvPairs.changeExpand("Cc","");
this.nvPairs.changeExpand("Bcc","");
this.nvPairs.changeExpand("Attachment","");
this.nvPairs.disableExpand();
this.attachNode.style.display="none";
this.attachNode.className="da_messageViewerHeaderAttachmentDisabled";
if(this.customHeader&&this.customNode){
this.customNode.style.display="none";
}
this.loadingFid=null;
this.loadingUid=null;
this.selectedUid=null;
},add_reply_icon:function(_979){
var me=this;
var _97b;
if((DA.vars.system.no_replied_flag===0)&&(_979.fid===this.selectedFid)&&(_979.uid===this.selectedUid)){
_97b=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_sc_reply.gif","Replied",{width:16,height:16});
me.nvPairs.changeValue("Subject",_97b+this.subject);
}
},add_forward_icon:function(_97c){
var me=this;
var _97e;
if((DA.vars.system.no_replied_flag===0)&&(_97c.fid===this.selectedFid)&&(_97c.uid===this.selectedUid)){
_97e=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_sc_forward.gif","Forwarded",{width:16,height:16});
me.nvPairs.changeValue("Subject",_97e+this.subject);
}
},_handleMessagesMoving:function(type,args){
var _981=args[0],_982=args[1];
var _983;
if(!_982||!(_983=_982.messages)){
return;
}
if(_983.ranges.length){
}
if(_983.singles.length===1){
if(_983.single.mode===1){
this.add_reply_icon({fid:_983.single.fid,uid:_983.single.originuid});
}else{
if(_983.single.mode===2){
this.add_forward_icon({fid:_983.single.fid,uid:_983.single.originuid});
}else{
}
}
}
if(_983.singles.find(this._isSameMessage.bind(this))){
if(_982.target.trash){
this.onMessageDeleted();
}else{
this.onMessageMoved(_982.target.fid);
}
}
},onMessageDeleted:function(){
this.close();
},onMessageMoved:Prototype.emptyFunction,_setupSubscribers:function(){
ME.onMessagesMoving.subscribe(this._handleMessagesMoving,this,true);
},_setupCleanupHandlers:function(){
YAHOO.util.Event.on(window,"unload",this._unsubscribe,this,true);
},_unsubscribe:function(){
ME.onMessagesMoving.unsubscribe(this._handleMessagesMoving,this);
},_isSameMessage:function(_984){
if(!_984){
return false;
}
var fid=parseInt(this.selectedFid,10);
var uid=parseInt(this.selectedUid,10);
return parseInt(_984.fid,10)===fid&&parseInt(_984.uid,10)===uid;
},view:function(_987,proc,_989){
var fid,uid,srid,_98d,_98e,_98f;
var _990=/^<\!-- Created by DA_Richtext .*? end default style -->/;
var _991=/<style>.*?<\/style>/;
if(!_987||!(uid=_987.uid)){
}
fid=_987.fid;
srid=_987.srid;
_98d=_987.backup_maid;
var me=this;
if(!this.loadingFid||!this.loadingUid||this.loadingFid!==fid||this.loadingUid!==uid){
this.loadingFid=fid;
this.loadingUid=uid;
if(me.lock()){
me.jsonIO.callback=function(o){
var i,_995,_996,_997;
if(DA.mailer.util.checkResult(o)){
me.selectedFid=o.fid;
me.selectedUid=o.uid;
me.selectedSrid=o.srid;
me.selectFolderType=o.type;
me.selectMessageEditable=(o.edit_m===1)?true:false;
if(me.selectFolderType===21){
me.selectMessageEditable="true";
}
me.selectMessageExportable=(o["export"]===1)?true:false;
me.selectMessageNotification=(DA.util.isEmpty(o.notification))?0:o.notification;
if(DA.mailer.util.isDraft(me.selectFolderType)||DA.mailer.util.isSent(me.selectFolderType)||DA.mailer.util.isLocalFolder(me.selectFolderType)||DA.mailer.util.isBackupFolder(me.selectFolderType)){
me.nvPairs.reorder(["Subject","To","Date","Attachment","Cc","From"]);
}else{
me.nvPairs.reorder(["Subject","From","Date","Attachment","To","Cc"]);
}
me.nvPairs.enableExpand();
if(o.priority<3){
_995=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_mail_high.gif","",{width:14,height:14});
}else{
if(o.priority>3){
_995=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_mail_low.gif","",{width:14,height:14});
}else{
_995=DA.imageLoader.nullTag(14,14);
}
}
me.subject=DA.util.encode(o.subject);
if(me.subject===null){
me.subject="";
}
me.nvPairs.changeName("Subject",_995+DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_SUBJECT"));
if(DA.vars.system.no_forwarded_flag===0&&o.replied===1){
_996=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_sc_reply.gif","Replied",{width:16,height:16});
me.nvPairs.changeValue("Subject",_996+me.subject);
}else{
if(DA.vars.system.no_forwarded_flag===0&&o.forwarded===1){
_997=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_sc_forward.gif","Forwarded",{width:16,height:16});
me.nvPairs.changeValue("Subject",_997+me.subject);
}else{
me.nvPairs.changeValue("Subject",me.subject);
}
}
if(o.from_list&&o.from_list.length>3){
me.nvPairs.changeValue("From",DA.ug.list2String(o.from_list,3,3));
me.nvPairs.changeExpand("From",DA.ug.list2String(o.from_list,3));
if(o.from_list.length>DA.vars.config.mail_to_resize_num){
me.nvPairs.scrollSeparator("From",1);
}else{
me.nvPairs.unscrollSeparator("From",1);
}
}else{
me.nvPairs.changeValue("From",DA.ug.list2String(o.from_list));
me.nvPairs.changeExpand("From","");
me.nvPairs.unscrollSeparator("From",1);
}
if(o.to_list&&o.to_list.length>3){
me.nvPairs.changeValue("To",DA.ug.list2String(o.to_list,3,3));
me.nvPairs.changeExpand("To",DA.ug.list2String(o.to_list,3));
if(o.to_list.length>DA.vars.config.mail_to_resize_num){
me.nvPairs.scrollSeparator("To",1);
me.nvPairs.showCursor("Cc");
}else{
me.nvPairs.hideCursor("Cc");
me.nvPairs.unscrollSeparator("To",1);
}
}else{
me.nvPairs.hideCursor("Cc");
me.nvPairs.changeValue("To",DA.ug.list2String(o.to_list));
me.nvPairs.changeExpand("To","");
me.nvPairs.unscrollSeparator("To",1);
}
if(o.cc_list&&o.cc_list.length>3){
me.nvPairs.changeValue("Cc",DA.ug.list2String(o.cc_list,3,3));
me.nvPairs.changeExpand("Cc",DA.ug.list2String(o.cc_list,3));
if(o.cc_list.length>DA.vars.config.mail_to_resize_num){
me.nvPairs.scrollSeparator("Cc",1);
me.nvPairs.showCursor("Bcc");
}else{
me.nvPairs.hideCursor("Bcc");
me.nvPairs.unscrollSeparator("Cc",1);
}
}else{
me.nvPairs.hideCursor("Bcc");
me.nvPairs.changeValue("Cc",DA.ug.list2String(o.cc_list));
me.nvPairs.changeExpand("Cc","");
me.nvPairs.unscrollSeparator("Cc",1);
}
if(DA.mailer.util.isDraft(me.selectFolderType)||DA.mailer.util.isSent(me.selectFolderType)){
me.nvPairs.showColumn("Bcc");
if(o.bcc_list&&o.bcc_list.length>3){
me.nvPairs.changeValue("Bcc",DA.ug.list2String(o.bcc_list,3,3));
me.nvPairs.changeExpand("Bcc",DA.ug.list2String(o.bcc_list,3));
if(o.bcc_list.length>DA.vars.config.mail_to_resize_num){
me.nvPairs.scrollSeparator("Bcc",1);
me.nvPairs.showCursor("Date");
}else{
me.nvPairs.hideCursor("Date");
me.nvPairs.unscrollSeparator("Bcc",1);
}
}else{
me.nvPairs.hideCursor("Date");
me.nvPairs.changeValue("Bcc",DA.ug.list2String(o.bcc_list));
me.nvPairs.changeExpand("Bcc","");
me.nvPairs.unscrollSeparator("Bcc",1);
}
}else{
me.nvPairs.hideColumn("Bcc");
}
me.nvPairs.changeValue("Date",DA.util.encode(o.date));
if(o.attach_list&&o.attach_list.length>3){
me.nvPairs.changeValue("Attachment",DA.file.list2String(o.attach_list,3,3));
me.nvPairs.changeExpand("Attachment",DA.file.list2String(o.attach_list,3));
}else{
me.nvPairs.changeValue("Attachment",DA.file.list2String(o.attach_list));
me.nvPairs.changeExpand("Attachment","");
}
if(o.attach_list&&o.attach_list.length>0){
me.attachNode.style.display="";
me.attachNode.className="da_messageViewerHeaderAttachmentEnabled";
me.attachData.order=[];
me.attachData.order[0]=[];
me.attachData.items={};
me.attachData.className="da_messageViewerHeaderAttachmentPulldownMenu";
me.attachData.encode=false;
for(i=0;i<o.attach_list.length;i++){
me.attachData.order[0].push(i);
me.attachData.items[i]={text:DA.file.object2String(o.attach_list[i],true),onclick:function(e,a){
eval(a[0]);
},args:[o.attach_list[i].link],title:DA.util.encode(o.attach_list[i].title)};
}
me.attachArea.style.height=(o.attach_list.length>12)?"80px":"";
}else{
me.attachNode.style.display="none";
me.attachNode.className="da_messageViewerHeaderAttachmentDisabled";
me.attachArea.style.height="";
}
me.saveAttachesToLibDialog=new DA.widget.SaveAttachesToLibDialog("da_saveAttachToLibDialog",DA.locale.GetText.t_("SAVE_TO_LIB_DIALOG_TITLE"),me.attachData,me.selectedFid,me.selectedUid,{onEnter:function(){
var _99a=document.getElementsByName("da_saveAttachToLibDialog_attaches");
var _99b="";
for(var i=0;i<_99a.length;i++){
if(_99b!==""){
if(_99a[i].checked){
_99b+=",";
}
}
if(_99a[i].checked){
_99b+=_99a[i].value;
}
}
if(_99b===""){
alert(DA.locale.GetText.t_("MESSAGE_SELECT_ATTACHES_ERROR"));
return false;
}
var url,flg;
url="lib_foldersel.cgi%3fcall=ma_bundle%20uid="+me.selectedUid+"%20fid="+me.selectedFid+"%20aid="+_99b;
var Img="pop_title_attachsave.gif";
DA.windowController.isePopup(url,Img,400,550,"");
return true;
}});
if(me.customHeader&&me.customNode){
me.customNode.style.display="";
}
me.nvPairs.resize();
FCKEditorIframeController.removeIframe(me.bodyId+"Contents"+"FckEditorViewer",me.bodyContentsNode);
if(DA.util.isEmpty(o.body.html)){
if(DA.util.isEmpty(o.body.text)){
me.bodyContentsNode.innerHTML="";
}else{
if(DA.vars.config.b_wrap==="on"){
me.bodyContentsNode.innerHTML=o.body.text;
}else{
me.bodyContentsNode.innerHTML="<pre style=\"height:100%;\">"+o.body.text+"</pre>";
}
}
}else{
if(FCKEditorIframeController.isFCKeditorData(o.body.html)){
_98e=o.body.html.match(_991);
_98f=o.body.html.replace(_991,"");
FCKEditorIframeController.createIframe(me.bodyId+"Contents"+"FckEditorViewer",me.bodyContentsNode);
FCKEditorIframeController.setIframeBody(me.bodyId+"Contents"+"FckEditorViewer",["<head>",_98e,"<style>body {margin:0px; padding:0px; border:0;}</style>","<script>function Pop4Ajax(Url,Width,Height,POSX,POSY){ top.Pop4Ajax(Url,Width,Height,POSX,POSY);}</script>","</head>","<body>","<div style=\"word-break:break-all\">",_98f,"</div>","</body>"].join("\n"));
}else{
me.bodyContentsNode.innerHTML=o.body.html;
}
}
me.doResize();
if(me.threePane){
me.recalculateHeights();
}
me.bodyContentsNode.scrollTop=0;
if(me.selectMessageNotification!==0){
me.mdn();
}
me.onLoadDone(o);
DA.customEvent.fire("messageViewerOnLoadDoneAfter",me,o);
if(DA.mailer.util.isJoin(o.type)!==true){
if(!o.seen||parseInt(o.seen,10)===0){
o.seen=1;
_987.seen=1;
DA.mailer.Events.onMessageRead.fire(o);
}
}
}else{
me.loadingFid=null;
me.loadingUid=null;
me.onLoadFailed(_987);
}
me.unlock();
};
me.jsonIO.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_VIEW_ERROR"));
me.loadingFid=null;
me.loadingUid=null;
me.unlock();
me.onLoadFailed(_987,e);
};
me.jsonIO.execute({fid:fid,uid:uid,backup_maid:(DA.util.isEmpty(_98d))?"":_98d,srid:(DA.util.isEmpty(srid))?"":srid,proc:(DA.util.isEmpty(proc))?"":proc,nomdn:(DA.util.isEmpty(_989))?"":_989});
me.onLoading(_987);
}else{
this.loadingFid=null;
this.loadingUid=null;
}
}
},make:function(tid){
this._editor("new",null,null,tid,null);
},edit:function(_9a2,fid,uid){
this._editor("edit",fid,uid,null,_9a2);
},reply:function(_9a5,fid,uid){
this._editor("reply",fid,uid,null,_9a5);
},replyall:function(_9a8,fid,uid){
this._editor("all_reply",fid,uid,null,_9a8);
},forward:function(_9ab,fid,uid){
this._editor("forward",fid,uid,null,_9ab);
},onClose:function(){
return true;
},close:function(){
if(this.onClose()){
this.clear();
}
},"delete":function(){
var me=this;
var _9af=(DA.mailer.util.isTrash(this.selectFolderType)||DA.vars.config["delete"]===1)?DA.locale.GetText.t_("MESSAGE_DELETECOMPLETE_CONFIRM"):DA.locale.GetText.t_("MESSAGE_DELETE_CONFIRM");
var io;
var _9b1={fid:me.selectedFid,uid:me.selectedUid,srid:(DA.util.isEmpty(me.selectedSrid))?me.selectedSrid:""};
if(me.lock()){
if(DA.util.confirm(_9af)){
if(this.external){
io=this.moveIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
if(me.selectedSrid===100000000){
DA.mailer.util.reloadPortal();
}
DA.windowController.allClose();
me.close();
}
me.unlock();
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_DELETE_ERROR"));
me.unlock();
};
io.execute({proc:(DA.mailer.util.isTrash(me.selectFolderType)||DA.vars.config["delete"]===1)?"delete":"trash",fid:me.selectedFid,uid:me.selectedUid,srid:(DA.util.isEmpty(me.selectedSrid))?me.selectedSrid:""});
}else{
try{
setTimeout(function(){
DA.mailer.Events.onMessageMoveRequest.fire({target:{trash:true},messages:{fid:me.selectedFid,srid:me.selectedSrid,single:_9b1,singles:[_9b1],ranges:[],count:1,identity:{}}});
},200);
}
catch(e){
me.unlock();
}
}
}else{
me.unlock();
}
}else{
me.unlock();
}
},print:function(_9b4){
if(!this.existsLock()){
DA.windowController.winOpen(DA.vars.cgiRdir+"/ma_ajx_print.cgi?fid="+this.selectedFid+"&uid="+this.selectedUid+"&printtoconfig="+_9b4,"",710,600);
}
},filter:function(){
var Proc="ma_ajx_filter.cgi%3ffid="+this.selectedFid+"%20uid="+this.selectedUid+"%20edit=add%20detail=1%20title_mode=1";
var Img="pop_title_filter.gif";
if(!this.existsLock()){
DA.windowController.isePopup(Proc,Img,800,600,"",1);
}
},prev:function(){
if(!this.existsLock()){
this.view({fid:this.selectedFid,uid:this.selectedUid,srid:this.selectedSrid},"prev");
}
},next:function(){
if(!this.existsLock()){
this.view({fid:this.selectedFid,uid:this.selectedUid,srid:this.selectedSrid},"next");
}
},header:function(){
var Proc="ma_ajx_header.cgi%3ffid="+this.selectedFid+"%20uid="+this.selectedUid;
var Img="pop_title_emlhead.gif";
if(!this.existsLock()){
DA.windowController.isePopup(Proc,Img,650,600,"",1);
}
},"export":function(){
var me=this;
var h,io;
var url,Proc;
if(me.selectMessageExportable&&me.lock()){
io=this.moveIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
if(!DA.util.isEmpty(o.file)){
if(DA.util.isNull(o.file_name)){
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=archive%26file="+o.file;
}else{
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=archive%26file="+o.file+"%26file_name="+o.file_name;
}
url=DA.vars.cgiRdir+"/down_pop4ajax.cgi?proc="+Proc;
DA.windowController.winOpenNoBar(url,"",400,450);
}else{
DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
}
}
me.unlock();
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("EXPORT_ERROR"));
me.unlock();
};
io.execute({proc:"export",fid:me.selectedFid,uid:me.selectedUid,archive:"0"});
}
},savetolib:function(){
var me=this;
var _9c1=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi");
_9c1.method="get";
var Img="pop_title_attachsave.gif";
_9c1.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("SAVE_TO_LIB_ERROR"));
};
_9c1.callback=function(o){
var url;
if(!DA.util.isEmpty(o.file)){
url="lib_foldersel.cgi%3fcall=ma_detail%20path="+o.file+"%20name="+o.file_name+"%20is_for_save_mail=true";
DA.windowController.isePopup(url,Img,400,550,DA.mailer.util.getMailAccount(),false);
}else{
DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
}
};
_9c1.execute({fid:me.selectedFid,uid:me.selectedFid+":"+me.selectedUid,area:"",archive:"1",proc:"save_to_lib"});
},getattachesnum:function(){
var me=this;
if(me.attachData.order){
return me.attachData.order.length;
}else{
return 0;
}
},showsaveattachestolibdialog:function(_9c7,_9c8){
var me=this;
me.saveAttachesToLibDialog.show(_9c7,_9c8);
},sales:function(){
if(!this.existsLock()){
DA.windowController.winOpen(DA.vars.cgiRdir+"/ma_ajx_sales.cgi?fid="+this.selectedFid+"&uid="+this.selectedUid);
}
},mdn:function(){
var me=this;
var h,io;
if(me.selectMessageNotification===2){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_MDN_SENT"));
}else{
if(me.selectMessageNotification===3){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_MDN_SENT")+"\n"+DA.locale.GetText.t_("MESSAGE_APPEND_MAIL2LOCAL"));
}else{
if(me.selectMessageNotification===1){
if(DA.util.confirm(DA.locale.GetText.t_("MESSAGE_MDN_CONFIRM"))){
io=this.flagIO;
io.callback=function(o){
if(o.result&&o.result.message){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_MDN_SENT")+"\n"+o.result.message);
}
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("MDN_ERROR"));
};
io.execute({proc:"mdn",fid:me.selectedFid,uid:me.selectedUid});
}
}
}
}
},lock:function(){
if(DA.util.lock("messageViewer")){
return true;
}else{
return false;
}
},unlock:function(){
return DA.util.unlock("messageViewer");
},existsLock:function(){
return DA.util.existsLock("messageViewer");
},_editor:function(proc,fid,uid,tid,_9d3){
var _9d4;
var _fid=(fid)?fid:this.selectedFid;
var _uid=(uid)?uid:this.selectedUid;
var _tid=tid;
var _9d8=_9d3;
if(this.threePane){
DA.mailer.windowController.editorOpen(proc,_fid,_uid,_tid,_9d8);
}else{
_9d4="&proc="+proc;
if(!DA.util.isEmpty(_fid)){
_9d4+="&fid="+_fid+"&uid="+_uid;
}
if(!DA.util.isEmpty(_tid)){
_9d4+="&tid="+_tid;
}
if(!DA.util.isEmpty(_9d8)){
_9d4+="&quote="+_9d8;
}
location.href=DA.util.setUrl(DA.vars.cgiRdir+"/ajax_mailer.cgi?html=editor&richtext=1"+_9d4+"&org_mail_gid="+OrgMailer.vars.org_mail_gid);
}
},getUIStateInfo:function(){
return {headerExpanded:(this.nvPairs.expanded)?1:0,headerToExpanded:(this.nvPairs.nvpair.To.expanded)?1:0,headerCcExpanded:(this.nvPairs.nvpair.Cc.expanded)?1:0,headerAttachmentExpanded:(this.nvPairs.nvpair.Attachment.expanded)?1:0};
}};
})();
DA.locale.message.core=window.messageCore;
DA.locale.message.custom={};
if(!DA||!DA.mailer||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.widget.TopTitleController=function(_9d9,_9da,_9db){
this.panelId=_9d9.id;
this.panelNode=_9d9;
this.menuNode=_9da;
this.title=_9db;
this.init();
};
DA.widget.TopTitleController.prototype={panelId:null,panelNode:null,menuNode:null,panelMenu:null,panelImages:{left:DA.vars.clrRdir+"/maildetails_s_bg.gif",center:DA.vars.clrRdir+"/maildetails_s_bg.gif",right:DA.vars.clrRdir+"/maildetails_s_bg.gif"},menuData:{leftOrder:[],rightOrder:["logo"],items:{logo:{title:"",alt:"",smallIcon:DA.vars.clrRdir+"/maildetails_s_logo.gif",bigIcon:DA.vars.clrRdir+"/maildetails_s_logo.gif",disableIcon:DA.vars.clrRdir+"/maildetails_s_logo.gif",className:"da_titleMenuItemLogo",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null}},className:"da_titleMenu"},init:function(){
var html="<div id=\""+this.panelId+"_TPC\" class=\"da_topTitle\">"+"<div id=\""+this.panelId+"_TPCL\" class=\"da_topTitleLeft\" style=\"background-image:url("+this.panelImages.left+")\">"+"<div class=\"da_topTitleLeftDiv\">"+DA.imageLoader.tag(this.title.icon)+this.title.name+"</div>"+"</div>"+"<div id=\""+this.panelId+"_TPCC\" class=\"da_topTitleCenter\" style=\"background-image:url("+this.panelImages.center+")\"></div>"+"<div id=\""+this.panelId+"_TPCR\" class=\"da_topTitleRight\" style=\"background-image:url("+this.panelImages.right+")\"></div>"+"</div>";
this.panelNode.innerHTML=html;
this.panelMenu=new DA.widget.PanelMenuController(this.menuNode,this.menuData);
}};
DA.locale.message.custom={};
if(("undefined"===typeof DA)||("undefined"===typeof DA.widget)){
throw "DEPENDENCY ERROR: DA.widget is not defined.";
}
if(("undefined"===typeof Prototype)){
throw "DEPENDENCY ERROR: Prototype is not included.";
}
if(("undefined"===typeof YAHOO)){
throw "DEPENDENCY ERROR: YAHOO is not included.";
}
DA.widget.SearchBox=function(_9dd,_9de,_9df,_9e0){
this.field=_9dd;
this.textBox=_9de;
this.button=_9df;
this.icon=document.createElement("img");
this.select=document.createElement("span");
this.arrow=document.createElement("img");
this.icon.src=DA.vars.imgRdir+"/ico_mail_search.gif";
this.arrow.src=DA.vars.imgRdir+"/ico_mail_arrow.gif";
this.arrow.id="da_searchBox_arrow";
this.arrow.style.cursor="pointer";
this.field.appendChild(this.icon);
this.field.appendChild(this.select);
this.field.appendChild(this.arrow);
this.button.onclick=this._buttonClicked.bindAsEventListener(this);
this.textBox.onkeyup=this._handleKeyUp.bindAsEventListener(this);
this.textBox.onkeydown=this._handleKeyDown.bindAsEventListener(this);
this.onSearch=new YAHOO.util.CustomEvent("onSearch");
this.menu=new DA.widget.PulldownMenuController("da_searchBox",this.arrow,_9e0,{onTrigger:function(e){
var _9e2=YAHOO.util.Event.getTarget(e);
if(!_9e2||!_9e2.id){
return false;
}
var _9e3=_9e2.id;
if(!_9e3.match(/^da\_searchBox\_arrow$/)){
return false;
}
return true;
}});
};
DA.widget.SearchBox.prototype={_buttonClicked:function(){
var _9e4=this.getConditions();
this.onSearch.fire({text:this.textBox.value,conditions:_9e4});
},_handleKeyUp:function(){
var _9e5=this.textBox.value;
},_handleKeyDown:function(e){
var _9e7=YAHOO.util.Event.getCharCode(e);
if(_9e7===13){
this._buttonClicked();
}
},getConditions:function(){
return {};
},changeField:function(){
},reset:function(){
this.textBox.value="";
}};
if(!DA||!DA.mailer||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.mailer.TopPanelController4Editor=function(_9e8,_9e9,_9ea){
this.panelId=_9e8.id;
this.panelNode=_9e8;
this.menuNode=_9e9;
if(DA.vars.custom.editor.setTopPanel){
eval(DA.vars.custom.editor.setTopPanel);
}
this.init(_9ea);
};
DA.mailer.TopPanelController4Editor.prototype={panelId:null,panelNode:null,menuNode:null,panelMenu:null,panelImages:{left:DA.vars.imgRdir+"/null.gif",center:DA.vars.clrRdir+"/mail_pop_back.gif",right:DA.vars.imgRdir+"/null.gif"},menuData:{leftOrder:["transmit","save","template","preview","spellcheck","back","print"],rightOrder:["popy","close"],items:{transmit:{title:DA.locale.GetText.t_("TOPMENU4EDITOR_TRANSMIT_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4EDITOR_TRANSMIT_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_transmit_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_transmit_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_transmit_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},save:{title:DA.locale.GetText.t_("TOPMENU4EDITOR_SAVE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4EDITOR_SAVE_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_save_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_save_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_save_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},template:{title:DA.locale.GetText.t_("TOPMENU4EDITOR_TEMPLATE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4EDITOR_TEMPLATE_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_template_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_template_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_template_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:null,pulldown:null},preview:{title:DA.locale.GetText.t_("TOPMENU4EDITOR_PREVIEW_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4EDITOR_PREVIEW_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_preview_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_preview_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_preview_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},spellcheck:{title:DA.locale.GetText.t_("SPELL_CHECK_BUTTON"),alt:DA.locale.GetText.t_("SPELL_CHECK_BUTTON"),smallIcon:DA.vars.clrRdir+"/maildetails_preview_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_preview_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_preview_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},back:{title:DA.locale.GetText.t_("TOPMENU4EDITOR_BACK_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4EDITOR_BACK_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_edit_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_edit_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_edit_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:1,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},print:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_print_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_print_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_print_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},close:{title:DA.locale.GetText.t_("TOPMENU_CLOSE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU_CLOSE_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_close_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_close_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_close_dis.gif",className:"da_panelMenu4EditorItemRight",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},popy:{title:"",alt:"",smallIcon:DA.vars.clrRdir+"/maildetails_popy.gif",bigIcon:DA.vars.clrRdir+"/maildetails_popy.gif",disableIcon:DA.vars.clrRdir+"/maildetails_popy.gif",className:"da_panelMenu4EditorItemPopy",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null}},className:"da_panelMenu4Editor"},init:function(_9eb){
var i;
var _9ed=DA.vars.clrRdir;
if(!DA.util.isEmpty(_9eb.backup_org_clrRdir)){
_9ed=_9eb.backup_org_clrRdir;
}
this.panelImages.center=_9ed+"/mail_pop_back.gif";
this.menuData.items.transmit.smallIcon=_9ed+"/maildetails_transmit_s.gif";
this.menuData.items.transmit.bigIcon=_9ed+"/maildetails_transmit_b.gif";
this.menuData.items.transmit.disableIcon=_9ed+"/maildetails_transmit_dis.gif";
this.menuData.items.save.smallIcon=_9ed+"/maildetails_save_s.gif";
this.menuData.items.save.bigIcon=_9ed+"/maildetails_save_b.gif";
this.menuData.items.save.disableIcon=_9ed+"/maildetails_save_dis.gif";
this.menuData.items.template.smallIcon=_9ed+"/maildetails_template_s.gif";
this.menuData.items.template.bigIcon=_9ed+"/maildetails_template_b.gif";
this.menuData.items.template.disableIcon=_9ed+"/maildetails_template_dis.gif";
this.menuData.items.preview.smallIcon=_9ed+"/maildetails_preview_s.gif";
this.menuData.items.preview.bigIcon=_9ed+"/maildetails_preview_b.gif";
this.menuData.items.preview.disableIcon=_9ed+"/maildetails_preview_dis.gif";
this.menuData.items.spellcheck.smallIcon=_9ed+"/maildetails_preview_s.gif";
this.menuData.items.spellcheck.bigIcon=_9ed+"/maildetails_preview_b.gif";
this.menuData.items.spellcheck.disableIcon=_9ed+"/maildetails_preview_dis.gif";
this.menuData.items.back.smallIcon=_9ed+"/maildetails_edit_s.gif";
this.menuData.items.back.bigIcon=_9ed+"/maildetails_edit_b.gif";
this.menuData.items.back.disableIcon=_9ed+"/maildetails_edit_dis.gif";
this.menuData.items.print.smallIcon=_9ed+"/maildetails_print_s.gif";
this.menuData.items.print.bigIcon=_9ed+"/maildetails_print_b.gif";
this.menuData.items.print.disableIcon=_9ed+"/maildetails_print_dis.gif";
this.menuData.items.close.smallIcon=_9ed+"/maildetails_close_s.gif";
this.menuData.items.close.bigIcon=_9ed+"/maildetails_close_b.gif";
this.menuData.items.close.disableIcon=_9ed+"/maildetails_close_dis.gif";
this.menuData.items.popy.smallIcon=_9ed+"/maildetails_popy.gif";
this.menuData.items.popy.bigIcon=_9ed+"/maildetails_popy.gif";
this.menuData.items.popy.disableIcon=_9ed+"/maildetails_popy.gif";
var _9ee=this.menuData.items.template;
var _9ef=this.menuData.items.preview;
var _9f0=this.menuData.items.spellcheck;
var _9f1=this.menuData.items.transmit;
var _9f2=this.menuData.items.print;
if(DA.vars.config.template&&DA.vars.config.template.length>0){
_9ee.pulldown={};
_9ee.pulldown.className="da_topPanel4EditorPulldownMenu";
if(DA.vars.config.template.length>10){
YAHOO.util.Dom.addClass(_9ee.pulldown,"da_topPanel4EditorPulldownMenu2");
}
_9ee.pulldown.order=[];
_9ee.pulldown.order[0]=[];
_9ee.pulldown.items={};
for(i=0;i<DA.vars.config.template.length;i++){
_9ee.pulldown.order[0].push(i);
_9ee.pulldown.items[i]={text:DA.vars.config.template[i].name,onclick:Prototype.emptyFunction,args:[DA.vars.config.template[i].tid]};
}
}else{
_9ee.disable=1;
}
if(DA.vars.config.spellcheck){
_9ef.pulldown={};
_9ef.pulldown.className="da_topPanel4EditorPulldownMenu";
_9ef.pulldown.order=[];
_9ef.pulldown.order[0]=["0","1"];
_9ef.pulldown.items={};
_9ef.pulldown.items[0]={text:DA.locale.GetText.t_("SPELLCHECK"),onclick:Prototype.emptyFunction,args:[1,"preview"]};
_9ef.pulldown.items[1]={text:DA.locale.GetText.t_("SPELLCHECK_NO"),onclick:Prototype.emptyFunction,args:[0,"preview"]};
_9f1.pulldown={};
_9f1.pulldown.className="da_topPanel4EditorPulldownMenu";
_9f1.pulldown.order=[];
_9f1.pulldown.order[0]=["0","1"];
_9f1.pulldown.items={};
_9f1.pulldown.items[0]={text:DA.locale.GetText.t_("SPELLCHECK"),onclick:Prototype.emptyFunction,args:[1,"transmit"]};
_9f1.pulldown.items[1]={text:DA.locale.GetText.t_("SPELLCHECK_NO"),onclick:Prototype.emptyFunction,args:[0,"transmit"]};
}
if(DA.vars.system.spellcheck_button_visible&&DA.vars.config.spellcheck){
_9f0.disable=0;
}else{
_9f0.hidden=1;
}
_9f2.pulldown={};
_9f2.pulldown.className="da_topPanel43PanePulldownMenu";
_9f2.pulldown.order=[];
_9f2.pulldown.order[0]=["0","1"];
_9f2.pulldown.items={};
_9f2.pulldown.items[0]={text:DA.locale.GetText.t_("PRINT_WITH_TO"),onclick:Prototype.emptyFunction,args:["on","printtoconfig"]};
_9f2.pulldown.items[1]={text:DA.locale.GetText.t_("PRINT_WITHOUT_TO"),onclick:Prototype.emptyFunction,args:["off","printtoconfig"]};
var html="<div id=\""+this.panelId+"_TPC\" class=\"da_topPanel4Editor\">"+"<div id=\""+this.panelId+"_TPCL\" class=\"da_topPanel4EditorLeft\" style=\"background-image:url("+this.panelImages.left+")\"></div>"+"<div id=\""+this.panelId+"_TPCR\" class=\"da_topPanel4EditorRight\" style=\"background-image:url("+this.panelImages.right+")\"></div>"+"<div id=\""+this.panelId+"_TPCC\" class=\"da_topPanel4EditorCenter\" style=\"background-image:url("+this.panelImages.center+")\"></div>"+"</div>";
this.panelNode.innerHTML=html;
this.panelMenu=new DA.widget.PanelMenuController(this.menuNode,this.menuData);
},setFunction:function(_9f4){
var me=this;
var key;
DA.customEvent.fire("topPanelController4EditorSetFunctionBefore",this,{editor:_9f4});
this.menuData.items.transmit.onSelect=function(){
_9f4.transmit();
};
this.menuData.items.save.onSelect=function(){
_9f4.save();
};
this.menuData.items.preview.onSelect=function(){
_9f4.preview();
};
this.menuData.items.spellcheck.onSelect=function(){
_9f4.spellcheck(1,"preview");
};
this.menuData.items.back.onSelect=function(){
_9f4.back();
};
this.menuData.items.close.onSelect=function(){
if(DA.util.confirm(DA.locale.GetText.t_("EDITOR_CLOSE_CONFIRM"))){
DA.windowController.allClose();
_9f4.close();
}
};
this.menuData.items.print.onSelect=function(){
_9f4.print(null);
};
if(this.menuData.items.template.pulldown){
for(key in this.menuData.items.template.pulldown.items){
if(key.match(/^\d+$/)){
this.menuData.items.template.pulldown.items[key].onclick=function(e,a){
_9f4.template(a[0]);
};
}
}
}
if(this.menuData.items.preview.pulldown){
for(key in this.menuData.items.preview.pulldown.items){
if(key.match(/^\d+$/)){
this.menuData.items.preview.pulldown.items[key].onclick=function(e,a){
_9f4.spellcheck(a[0],a[1]);
};
}
}
}
if(this.menuData.items.transmit.pulldown){
for(key in this.menuData.items.transmit.pulldown.items){
if(key.match(/^\d+$/)){
this.menuData.items.transmit.pulldown.items[key].onclick=function(e,a){
_9f4.spellcheck(a[0],a[1]);
};
}
}
}
for(key in this.menuData.items.print.pulldown.items){
if(key.match(/^\d+$/)){
this.menuData.items.print.pulldown.items[key].onclick=function(e,a){
_9f4.print(a[0]);
};
}
}
DA.customEvent.fire("topPanelController4EditorSetFunctionAfter",this,{editor:_9f4});
}};
if(!DA||!DA.mailer||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.mailer.TopPanelController4Viewer=function(_9ff,_a00){
this.panelId=_9ff.id;
this.panelNode=_9ff;
this.menuNode=_a00;
if(DA.vars.custom.viewer.setTopPanel){
eval(DA.vars.custom.viewer.setTopPanel);
}
this.init();
};
DA.mailer.TopPanelController4Viewer.prototype={panelId:null,panelNode:null,menuNode:null,panelMenu:null,panelImages:{left:DA.vars.imgRdir+"/null.gif",center:DA.vars.clrRdir+"/mail_pop_back.gif",right:DA.vars.imgRdir+"/null.gif"},menuData:{leftOrder:["edit","reply","replyall","forward","delete","print","filter","prev","next","option"],rightOrder:["popy","close"],items:{edit:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_EDIT_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_EDIT_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_edit_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_edit_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_edit_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:1,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},reply:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_REPLY_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_REPLY_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_reply_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_reply_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_reply_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},replyall:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_REPLYALL_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_REPLYALL_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_replyall_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_replyall_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_replyall_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},forward:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_FORWARD_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_FORWARD_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_forward_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_forward_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_forward_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},"delete":{title:DA.locale.GetText.t_("TOPMENU4VIEWER_DELETE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_DELETE_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_delete_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_delete_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_delete_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},print:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_print_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_print_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_print_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},filter:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_FILTER_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_FILTER_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_filter_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_filter_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_filter_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},prev:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_PREV_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_PREV_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_back_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_back_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_back_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},next:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_NEXT_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_NEXT_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_next_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_next_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_next_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},option:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_OPTION_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_OPTION_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_option_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_option_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_option_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:null,pulldown:{order:[["header","export","savetolib","saveattachestolib","sales"]],items:{header:{text:DA.locale.GetText.t_("MESSAGE_HEADER_MENU"),onclick:Prototype.emptyFunction},"export":{text:DA.locale.GetText.t_("MESSAGE_EXPORT_MENU"),onclick:Prototype.emptyFunction},savetolib:{text:DA.locale.GetText.t_("MESSAGE_SAVETOLIB_MENU"),onclick:Prototype.emptyFunction,hidden:(DA.vars.config.save_to_lib===0)?1:0},saveattachestolib:{text:DA.locale.GetText.t_("MESSAGE_SAVEATTACHESTOLIBOPTION_MENU"),onclick:Prototype.emptyFunction},sales:{text:DA.locale.GetText.t_("MESSAGE_REGIST_MENU",DA.vars.hibiki.sales.name),onclick:Prototype.emptyFunction,hidden:(DA.vars.license.hibiki_sales===1&&DA.vars.system.sales_datalink_enable!=="off")?0:1}},className:"da_topPanel4ViewerPulldownMenu"}},close:{title:DA.locale.GetText.t_("TOPMENU_CLOSE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU_CLOSE_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_close_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_close_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_close_dis.gif",className:"da_panelMenu4ViewerItemRight",hidden:0,disable:0,onSelect:function(){
DA.windowController.allClose();
window.close();
},pulldown:null},popy:{title:"",alt:"",smallIcon:DA.vars.clrRdir+"/maildetails_popy.gif",bigIcon:DA.vars.clrRdir+"/maildetails_popy.gif",disableIcon:DA.vars.clrRdir+"/maildetails_popy.gif",className:"da_panelMenu4ViewerItemPopy",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null}},className:"da_panelMenu4Viewer"},init:function(){
var _a01=this.menuData.items.reply;
var _a02=this.menuData.items.replyall;
var _a03=this.menuData.items.forward;
var _a04=this.menuData.items.print;
_a01.pulldown={};
_a01.pulldown.className="da_topPanel4ViewerPulldownMenu";
_a01.pulldown.order=[];
_a01.pulldown.order[0]=["0","1","2"];
_a01.pulldown.items={};
_a01.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_reply==="01")?true:false};
_a01.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_reply==="11")?true:false};
_a01.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_reply==="99")?true:false};
_a02.pulldown={};
_a02.pulldown.className="da_topPanel4ViewerPulldownMenu";
_a02.pulldown.order=[];
_a02.pulldown.order[0]=["0","1","2"];
_a02.pulldown.items={};
_a02.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_reply==="01")?true:false};
_a02.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_reply==="11")?true:false};
_a02.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_reply==="99")?true:false};
_a03.pulldown={};
_a03.pulldown.className="da_topPanel4ViewerPulldownMenu";
_a03.pulldown.order=[];
_a03.pulldown.order[0]=["0","1","2","3","4","5"];
_a03.pulldown.items={};
_a03.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_00_TITLE"),onclick:Prototype.emptyFunction,args:["00"],selected:(DA.vars.config.quote_forward==="00")?true:false};
_a03.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_forward==="01")?true:false};
_a03.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_02_TITLE"),onclick:Prototype.emptyFunction,args:["02"],selected:(DA.vars.config.quote_forward==="02")?true:false};
_a03.pulldown.items[3]={text:DA.locale.GetText.t_("QUOTE_10_TITLE"),onclick:Prototype.emptyFunction,args:["10"],selected:(DA.vars.config.quote_forward==="10")?true:false};
_a03.pulldown.items[4]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_forward==="11")?true:false};
_a03.pulldown.items[5]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_forward==="99")?true:false};
_a04.pulldown={};
_a04.pulldown.className="da_topPanel43PanePulldownMenu";
_a04.pulldown.order=[];
_a04.pulldown.order[0]=["0","1"];
_a04.pulldown.items={};
_a04.pulldown.items[0]={text:DA.locale.GetText.t_("PRINT_WITH_TO"),onclick:Prototype.emptyFunction,args:["on","printtoconfig"]};
_a04.pulldown.items[1]={text:DA.locale.GetText.t_("PRINT_WITHOUT_TO"),onclick:Prototype.emptyFunction,args:["off","printtoconfig"]};
var html="<div id=\""+this.panelId+"_TPC\" class=\"da_topPanel4Viewer\">"+"<div id=\""+this.panelId+"_TPCL\" class=\"da_topPanel4ViewerLeft\" style=\"background-image:url("+this.panelImages.left+")\"></div>"+"<div id=\""+this.panelId+"_TPCR\" class=\"da_topPanel4ViewerRight\" style=\"background-image:url("+this.panelImages.right+")\"></div>"+"<div id=\""+this.panelId+"_TPCC\" class=\"da_topPanel4ViewerCenter\" style=\"background-image:url("+this.panelImages.center+")\"></div>"+"</div>";
this.panelNode.innerHTML=html;
DA.customEvent.fire("TopPanelController4ViewerInitAfter",this,{reply:_a01,replyall:_a02,forward:_a03});
this.panelMenu=new DA.widget.PanelMenuController(this.menuNode,this.menuData);
},setFunction:function(_a06){
var key;
if(_a06.selectMessageEditable){
this.panelMenu.show("edit");
}else{
this.panelMenu.hide("edit");
}
if(_a06.selectMessageExportable){
this.menuData.items.option.pulldownMenu.enabled("export");
}else{
this.menuData.items.option.pulldownMenu.disabled("export");
}
this.menuData.items.edit.onSelect=function(){
_a06.edit();
};
this.menuData.items.reply.onSelect=function(){
_a06.reply();
};
this.menuData.items.replyall.onSelect=function(){
_a06.replyall();
};
this.menuData.items.forward.onSelect=function(){
_a06.forward();
};
this.menuData.items["delete"].onSelect=function(){
_a06["delete"]();
};
this.menuData.items.print.onSelect=function(){
_a06.print(null);
};
this.menuData.items.filter.onSelect=function(){
_a06.filter();
};
this.menuData.items.prev.onSelect=function(){
_a06.prev();
};
this.menuData.items.next.onSelect=function(){
_a06.next();
};
this.menuData.items.option.pulldown.items.header.onclick=function(){
_a06.header();
};
this.menuData.items.option.pulldown.items["export"].onclick=function(){
_a06["export"]();
};
this.menuData.items.option.pulldown.items.sales.onclick=function(){
_a06.sales();
};
this.menuData.items.option.pulldown.items.savetolib.onclick=function(){
_a06.savetolib();
};
this.menuData.items.option.pulldown.items.saveattachestolib.onclick=function(e){
_a06.showsaveattachestolibdialog(e.clientX,e.clientY);
};
if(_a06.getattachesnum()>0){
this.menuData.items.option.pulldown.items.saveattachestolib.hidden=0;
}else{
this.menuData.items.option.pulldown.items.saveattachestolib.hidden=1;
}
var _a09=this.menuData.items.reply;
var _a0a=this.menuData.items.replyall;
var _a0b=this.menuData.items.forward;
var _a0c=this.menuData.items.print;
for(key in _a09.pulldown.items){
if(key.match(/^\d+$/)){
_a09.pulldown.items[key].onclick=function(e,a){
_a06.reply(a[0]);
};
}
}
for(key in _a0a.pulldown.items){
if(key.match(/^\d+$/)){
_a0a.pulldown.items[key].onclick=function(e,a){
_a06.replyall(a[0]);
};
}
}
for(key in _a0b.pulldown.items){
if(key.match(/^\d+$/)){
_a0b.pulldown.items[key].onclick=function(e,a){
_a06.forward(a[0]);
};
}
}
for(key in _a0c.pulldown.items){
if(key.match(/^\d+$/)){
_a0c.pulldown.items[key].onclick=function(e,a){
_a06.print(a[0]);
};
}
}
DA.customEvent.fire("TopPanelController4ViewerSetFunctionAfter",this,{viewer:_a06,reply:_a09,replyall:_a0a,forward:_a0b});
}};
if(!DA||!DA.mailer||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.mailer.TopPanelController43PANE=function(_a15,_a16){
this.panelId=_a15.id;
this.panelNode=_a15;
this.menuNode=_a16;
if(DA.vars.custom.threePane.setTopPanel){
eval(DA.vars.custom.threePane.setTopPanel);
}
this.init();
};
DA.mailer.TopPanelController43PANE.prototype={panelId:null,panelNode:null,menuNode:null,panelMenu:null,panelImages:{left:DA.vars.clrRdir+"/mailhead_main.gif",center:DA.vars.clrRdir+"/mailhead_popy4.gif",right:DA.vars.clrRdir+"/mailhead_popy2.gif"},menuData:{leftOrder:["make","reply","replyall","forward","delete","print"],rightOrder:["close","guide","setting","state"],items:{make:{title:DA.locale.GetText.t_("TOPMENU43PANE_MAKE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU43PANE_MAKE_TITLE"),smallIcon:DA.vars.clrRdir+"/mailhead_make_s.gif",bigIcon:DA.vars.clrRdir+"/mailhead_make_b.gif",disableIcon:DA.vars.clrRdir+"/mailhead_make_dis.gif",className:"da_panelMenu43PaneItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},reply:{title:DA.locale.GetText.t_("TOPMENU43PANE_REPLY_TITLE"),alt:DA.locale.GetText.t_("TOPMENU43PANE_REPLY_TITLE"),smallIcon:DA.vars.clrRdir+"/mailhead_reply_s.gif",bigIcon:DA.vars.clrRdir+"/mailhead_reply_b.gif",disableIcon:DA.vars.clrRdir+"/mailhead_reply_dis.gif",className:"da_panelMenu43PaneItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},replyall:{title:DA.locale.GetText.t_("TOPMENU43PANE_REPLYALL_TITLE"),alt:DA.locale.GetText.t_("TOPMENU43PANE_REPLYALL_TITLE"),smallIcon:DA.vars.clrRdir+"/mailhead_replyall_s.gif",bigIcon:DA.vars.clrRdir+"/mailhead_replyall_b.gif",disableIcon:DA.vars.clrRdir+"/mailhead_replyall_dis.gif",className:"da_panelMenu43PaneItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},forward:{title:DA.locale.GetText.t_("TOPMENU43PANE_FORWARD_TITLE"),alt:DA.locale.GetText.t_("TOPMENU43PANE_FORWARD_TITLE"),smallIcon:DA.vars.clrRdir+"/mailhead_forward_s.gif",bigIcon:DA.vars.clrRdir+"/mailhead_forward_b.gif",disableIcon:DA.vars.clrRdir+"/mailhead_forward_dis.gif",className:"da_panelMenu43PaneItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},"delete":{title:DA.locale.GetText.t_("TOPMENU43PANE_DELETE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU43PANE_DELETE_TITLE"),smallIcon:DA.vars.clrRdir+"/mailhead_delete_s.gif",bigIcon:DA.vars.clrRdir+"/mailhead_delete_b.gif",disableIcon:DA.vars.clrRdir+"/mailhead_delete_dis.gif",className:"da_panelMenu43PaneItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},print:{title:DA.locale.GetText.t_("TOPMENU43PANE_PRINT_TITLE"),alt:DA.locale.GetText.t_("TOPMENU43PANE_PRINT_TITLE"),smallIcon:DA.vars.clrRdir+"/mailhead_print_s.gif",bigIcon:DA.vars.clrRdir+"/mailhead_print_b.gif",disableIcon:DA.vars.clrRdir+"/mailhead_print_dis.gif",className:"da_panelMenu43PaneItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},state:{title:DA.locale.GetText.t_("TOPMENU43PANE_STATE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU43PANE_STATE_TITLE"),smallIcon:DA.vars.clrRdir+"/mailhead_state_s.gif",bigIcon:DA.vars.clrRdir+"/mailhead_state_b.gif",disableIcon:DA.vars.clrRdir+"/mailhead_state_dis.gif",className:"da_panelMenu43PaneItemRight",hidden:0,disable:1,onSelect:function(){
DA.mailer.connection.saveState();
},pulldown:null},setting:{title:DA.locale.GetText.t_("TOPMENU43PANE_SETTING_TITLE"),alt:DA.locale.GetText.t_("TOPMENU43PANE_SETTING_TITLE"),smallIcon:DA.vars.clrRdir+"/mailhead_setting_s.gif",bigIcon:DA.vars.clrRdir+"/mailhead_setting_b.gif",disableIcon:DA.vars.clrRdir+"/mailhead_setting_dis.gif",className:"da_panelMenu43PaneItemRight",hidden:0,disable:1,onSelect:function(){
DA.windowController.winOpenNoBar(DA.vars.cgiRdir+"/ma_ajx_env_pop_up.cgi?proc=ma_ajx_config.cgi&title=pop_title_ajxmailer_other.gif&config_opener=ajax_mailer","ma_ajx_config",990,600);
},pulldown:null},guide:{title:DA.locale.GetText.t_("TOPMENU43PANE_GUIDE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU43PANE_GUIDE_TITLE"),smallIcon:DA.vars.clrRdir+"/mailhead_guide_s.gif",bigIcon:DA.vars.clrRdir+"/mailhead_guide_b.gif",disableIcon:DA.vars.clrRdir+"/mailhead_guide_dis.gif",className:"da_panelMenu43PaneItemRight",hidden:(DA.vars.system.guide===1)?0:1,disable:1,onSelect:function(){
DA.windowController.winOpenNoBar(DA.vars.cgiRdir+"/guide.cgi?item=ajx_ma_menu","guide",430,579);
},pulldown:null},close:{title:DA.locale.GetText.t_("TOPMENU_CLOSE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU_CLOSE_TITLE"),smallIcon:DA.vars.clrRdir+"/mailhead_close_s.gif",bigIcon:DA.vars.clrRdir+"/mailhead_close_b.gif",disableIcon:DA.vars.clrRdir+"/mailhead_close_dis.gif",className:"da_panelMenu43PaneItemRight",hidden:0,disable:1,onSelect:function(){
DA.mailer.connection.logout();
},pulldown:null},space:{title:"",alt:"",smallIcon:DA.vars.imgRdir+"/null.gif",bigIcon:DA.vars.imgRdir+"/null.gif",disableIcon:DA.vars.imgRdir+"/null.gif",className:"da_panelMenu43PaneItemBlank",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null}},className:"da_panelMenu43Pane"},init:function(){
var i;
var make=this.menuData.items.make;
var _a19=this.menuData.items.reply;
var _a1a=this.menuData.items.replyall;
var _a1b=this.menuData.items.forward;
var _a1c=this.menuData.items.print;
if(DA.vars.config.template&&DA.vars.config.template.length>0){
make.pulldown={};
make.pulldown.className="da_topPanel43PanePulldownMenu";
if(DA.vars.config.template.length>10){
YAHOO.util.Dom.addClass(make.pulldown,"da_topPanel43PanePulldownMenu2");
}
make.pulldown.order=[];
make.pulldown.order[0]=[];
make.pulldown.items={};
make.pulldown.order[0].push(0);
make.pulldown.items[0]={text:DA.locale.GetText.t_("MESSAGE_NEW_MAKING"),onclick:Prototype.emptyFunction,args:[]};
for(i=0;i<DA.vars.config.template.length;i++){
make.pulldown.order[0].push(i+1);
make.pulldown.items[i+1]={text:DA.vars.config.template[i].name,onclick:Prototype.emptyFunction,args:[DA.vars.config.template[i].tid]};
}
}
_a19.pulldown={};
_a19.pulldown.className="da_topPanel43PanePulldownMenu";
_a19.pulldown.order=[];
_a19.pulldown.order[0]=["0","1","2"];
_a19.pulldown.items={};
_a19.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_reply==="01")?true:false};
_a19.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_reply==="11")?true:false};
_a19.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_reply==="99")?true:false};
_a1a.pulldown={};
_a1a.pulldown.className="da_topPanel43PanePulldownMenu";
_a1a.pulldown.order=[];
_a1a.pulldown.order[0]=["0","1","2"];
_a1a.pulldown.items={};
_a1a.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_reply==="01")?true:false};
_a1a.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_reply==="11")?true:false};
_a1a.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_reply==="99")?true:false};
_a1b.pulldown={};
_a1b.pulldown.className="da_topPanel43PanePulldownMenu";
_a1b.pulldown.order=[];
_a1b.pulldown.order[0]=["0","1","2","3","4","5"];
_a1b.pulldown.items={};
_a1b.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_00_TITLE"),onclick:Prototype.emptyFunction,args:["00"],selected:(DA.vars.config.quote_forward==="00")?true:false};
_a1b.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_forward==="01")?true:false};
_a1b.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_02_TITLE"),onclick:Prototype.emptyFunction,args:["02"],selected:(DA.vars.config.quote_forward==="02")?true:false};
_a1b.pulldown.items[3]={text:DA.locale.GetText.t_("QUOTE_10_TITLE"),onclick:Prototype.emptyFunction,args:["10"],selected:(DA.vars.config.quote_forward==="10")?true:false};
_a1b.pulldown.items[4]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_forward==="11")?true:false};
_a1b.pulldown.items[5]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_forward==="99")?true:false};
var html="<div id=\""+this.panelId+"_TPC\" class=\"da_topPanel43Pane\">"+"<div id=\""+this.panelId+"_TPCL\" class=\"da_topPanel43PaneLeft\" style=\"background-image:url("+this.panelImages.left+")\"></div>"+"<div id=\""+this.panelId+"_TPCR\" class=\"da_topPanel43PaneRight\" style=\"background-image:url("+this.panelImages.right+")\"></div>"+"<div id=\""+this.panelId+"_TPCC\" class=\"da_topPanel43PaneCenter\" style=\"background-image:url("+this.panelImages.center+")\"></div>"+"</div>";
this.panelNode.innerHTML=html;
_a1c.pulldown={};
_a1c.pulldown.className="da_topPanel43PanePulldownMenu";
_a1c.pulldown.order=[];
_a1c.pulldown.order[0]=["0","1"];
_a1c.pulldown.items={};
_a1c.pulldown.items[0]={text:DA.locale.GetText.t_("PRINT_WITH_TO"),onclick:Prototype.emptyFunction,args:["on","printtoconfig"]};
_a1c.pulldown.items[1]={text:DA.locale.GetText.t_("PRINT_WITHOUT_TO"),onclick:Prototype.emptyFunction,args:["off","printtoconfig"]};
DA.customEvent.fire("TopPanelController43PANEInitAfter",this,{make:make,reply:_a19,replyall:_a1a,forward:_a1b});
this.panelMenu=new DA.widget.PanelMenuController(this.menuNode,this.menuData);
},messageSelectedMenu:function(fid,uid){
DA.customEvent.fire("topPanelController43PANEmessageSelectedMenuBefore",this,{fid:fid,uid:uid});
if(fid){
this.selectedFid=fid;
}
if(uid){
this.selectedUid=uid;
}
if(!DA.util.isEmpty(window.__folderTree.backupFolderFid)&&fid.toString()===window.__folderTree.backupFolderFid.toString()){
this.panelMenu.enable("make");
this.panelMenu.disable("reply");
this.panelMenu.disable("replyall");
this.panelMenu.disable("forward");
this.panelMenu.enable("delete");
this.panelMenu.enable("print");
this.panelMenu.enable("state");
this.panelMenu.enable("setting");
this.panelMenu.enable("guide");
this.panelMenu.enable("close");
}else{
this.panelMenu.enable("make");
this.panelMenu.enable("reply");
this.panelMenu.enable("replyall");
this.panelMenu.enable("forward");
this.panelMenu.enable("delete");
this.panelMenu.enable("print");
this.panelMenu.enable("state");
this.panelMenu.enable("setting");
this.panelMenu.enable("guide");
this.panelMenu.enable("close");
}
DA.customEvent.fire("topPanelController43PANEmessageSelectedMenuAfter",this,{fid:fid,uid:uid});
},messageUnselectedMenu:function(){
DA.customEvent.fire("topPanelController43PANEmessageUnselectedMenuBefore",this);
this.panelMenu.enable("make");
this.panelMenu.disable("reply");
this.panelMenu.disable("replyall");
this.panelMenu.disable("forward");
this.panelMenu.disable("delete");
this.panelMenu.disable("print");
this.panelMenu.enable("state");
this.panelMenu.enable("setting");
this.panelMenu.enable("guide");
this.panelMenu.enable("close");
DA.customEvent.fire("topPanelController43PANEmessageUnselectedMenuAfter",this);
},setFunction:function(_a20){
var key;
var me=this;
var make=this.menuData.items.make;
var _a24=this.menuData.items.reply;
var _a25=this.menuData.items.replyall;
var _a26=this.menuData.items.forward;
var _a27=this.menuData.items.print;
make.onSelect=function(){
_a20.make();
};
_a24.onSelect=function(){
_a20.reply(null,me.selectedFid,me.selectedUid);
};
_a25.onSelect=function(){
_a20.replyall(null,me.selectedFid,me.selectedUid);
};
_a26.onSelect=function(){
_a20.forward(null,me.selectedFid,me.selectedUid);
};
_a27.onSelect=function(){
_a20.print(null);
};
if(make.pulldown){
for(key in make.pulldown.items){
if(key.match(/^\d+$/)){
make.pulldown.items[key].onclick=function(e,a){
_a20.make(a[0]);
};
}
}
}
for(key in _a24.pulldown.items){
if(key.match(/^\d+$/)){
_a24.pulldown.items[key].onclick=function(e,a){
_a20.reply(a[0],me.selectedFid,me.selectedUid);
};
}
}
for(key in _a25.pulldown.items){
if(key.match(/^\d+$/)){
_a25.pulldown.items[key].onclick=function(e,a){
_a20.replyall(a[0],me.selectedFid,me.selectedUid);
};
}
}
for(key in _a26.pulldown.items){
if(key.match(/^\d+$/)){
_a26.pulldown.items[key].onclick=function(e,a){
_a20.forward(a[0],me.selectedFid,me.selectedUid);
};
}
}
for(key in _a27.pulldown.items){
if(key.match(/^\d+$/)){
_a27.pulldown.items[key].onclick=function(e,a){
_a20.print(a[0]);
};
}
}
DA.customEvent.fire("TopPanelController43PANESetFunctionAfter",this,{viewer:_a20,make:make,reply:_a24,replyall:_a25,forward:_a26});
}};
if(!DA||!DA.mailer||!DA.mailer.widget||!DA.widget||!DA.util){
throw "ERROR: missing DA.js or mailer.js";
}
if(!DA.widget.VirtualScrollingTable){
throw "ERROR: missing VirtualScrollingTable (virtual-scroll.js)";
}
if(!YAHOO||!YAHOO.util||!YAHOO.widget){
throw "ERROR: missing yahoo.js or treeview.js";
}
if("undefined"===typeof Rico||"undefined"===typeof Rico.LiveGrid||"undefined"===typeof Rico.LiveGridBuffer||"undefined"===typeof Rico.TableColumn){
throw "DEPENDENCY ERROR: RICO not found, we cannot continue";
}
DA.mailer.widget.MboxGrid=function(_a32){
var _a33={visibleRows:10,folderId:0,folderType:0,isUsingFakeTable:true};
Object.extend(_a33,_a32||{});
if(_a33.srid||_a33.searchMode){
this.setSearchMode();
}
this.isUsingFakeTable=_a33.isUsingFakeTable;
this.visibleRows=_a33.visibleRows;
if(_a33.folderTreeController){
this.folderTreeController=_a33.folderTreeController;
}
if("function"===typeof _a33.onLoading){
this.onLoading=_a33.onLoading;
}
if("function"===typeof _a33.onLoadDone){
this.onLoadDone=_a33.onLoadDone;
}
if("function"===typeof _a33.onDeletePress){
this.onDeletePress=_a33.onDeletePress;
}
this.init(_a33);
};
DA.mailer.widget.MboxGrid.prototype={searchMode:false,url:DA.vars.cgiRdir+"/ajx_ma_list.cgi",columns:[{key:"subject",name:"subject",width:"45%"},{key:"from",name:"from",width:"20%"},{key:"to",name:"to",width:"20%"},{key:"date",name:"date",width:"15%"}],fromColumnIndex:1,dateColumnIndex:1,sizeColumnIndex:1,folderId:0,folderType:0,folderTreeController:null,liveGrid:null,_mdd:null,_isBeingDragged:false,searchMoveFolderDialog:null,init:function(_a34,_a35){
var me=this;
var conf=DA.vars.config;
me.folderTreeData=_a35;
var _a38={attachment:"mailsort_attach.gif",flagged:"mailsort_flag.gif",priority:"mailsort_important.gif",seen:"mailsort_mail.gif"};
var _a39=DA.vars.imgRdir+"/";
function getTitleHtml(_a3a){
var img=_a38[_a3a];
if(img){
return "<img src='"+_a39+img+"'/>";
}else{
return DA.locale.GetText.t_("MBOXGRID_COLUMNTITLE_"+_a3a.toUpperCase());
}
}
var _a3c=false;
var _a3d=false;
var _a3e=false;
if(conf.list_order&&conf.list_order.split){
this.columns=conf.list_order.split("|").map(function(_a3f,i){
if(_a3f==="from"){
me.fromColumnIndex=i;
_a3c=true;
}else{
if(_a3f==="date"){
me.dateColumnIndex=i;
_a3d=true;
}else{
if(_a3f==="size"){
me.sizeColumnIndex=i;
_a3e=true;
}
}
}
return {width:conf.list_width[_a3f],name:getTitleHtml(_a3f),key:_a3f};
});
this._percentify();
if(!_a3c){
me.fromColumnIndex=null;
}
if(!_a3d){
me.dateColumnIndex=null;
}
if(!_a3e){
me.sizeColumnIndex=null;
}
}
if(!_a34.containerElem){
throw "MISSING ARG: containerElem";
}
this.containerElem=_a34.containerElem;
this._initCustomEvents();
this._setupSubscribers();
this._messageMoverJobs=$H({});
if(this.searchMode){
this.loadSearchResults(_a34.totalMessages,_a34.fid,_a34.srid,_a34.type);
me.searchMoveFolderDialog=new DA.widget.SearchMoveFolderDialog("da_searchMoveFolderDialog",DA.locale.GetText.t_("SEARCH_MOVE_FOLDER_DIALOG_TITLE"),{onEnter:function(){
var _a41=document.getElementById("da_searchMoveToFid").value;
if(window.__messageSearcher.folderTreeData[_a41].move_m===1){
me.moveSelected({fid:_a41});
return true;
}else{
alert(DA.locale.GetText.t_("MESSAGE_MOVE_FOLDER_ERROR"));
return false;
}
}});
}else{
this.changeFolder(_a34.folderId,_a34.folderType);
this._mdd=new DA.mailer.dd.MboxMail(this.liveGrid.tableId);
this._mdd.mboxGrid=this;
}
this.setupCSS();
this._onLoadDoneJobs=[];
},_initCustomEvents:function(){
this.onFolderChanged=new YAHOO.util.CustomEvent("folderChanged");
this.onDoubleClick=new YAHOO.util.CustomEvent("onDoubleClick");
},_add_reply_flag:function(_a42){
var _a43=this.liveGrid.buffer.findRowMetaData(function(r){
if((r.fid===_a42.fid.toString())&&(r.uid===_a42.uid.toString())){
return r;
}
});
if(DA.vars.system.no_replied_flag===0&&_a43.length===1){
_a43[0].replied="1";
_a43[0].forwarded="0";
this.setRowAppearance(_a43[0],["replied","forwarded"]);
}
},_add_forwarded_flag:function(_a45){
var _a46=this.liveGrid.buffer.findRowMetaData(function(r){
if((r.fid===_a45.fid.toString())&&(r.uid===_a45.uid.toString())){
return r;
}
});
if(DA.vars.system.no_replied_flag===0&&_a46.length===1){
_a46[0].replied="0";
_a46[0].forwarded="1";
this.setRowAppearance(_a46[0],["replied","forwarded"]);
}
},_removeMessagesFromGrid:function(_a48){
var _a49=this._messageMoverJobs[_a48];
if(!_a49){
return;
}
var _a4a=_a49.count;
if(_a4a===0){
return;
}
var me=this;
var lg=this.liveGrid;
this._updateExceptionFilter();
var _a4d=lg.metaData.getTotalRows();
_a4d-=_a4a;
lg.metaData.setTotalRows(_a4d);
lg.scroller.updateSize();
lg.viewPort.isPartialBlank=true;
var _a4e={};
_a49.singles.each(function(_a4f){
_a4e[_a4f.fid+"_"+_a4f.uid]=true;
});
var _a50=_a49.ranges;
var _a51=lg.buffer.removeIf(function(_a52){
var _a53=_a52.meta;
if(!_a53){
return false;
}
if(_a4e[_a53.fid+"_"+_a53.uid]){
return true;
}
if(_a50.length<1){
return false;
}
return me._checkShiftRanges(_a53,_a50);
});
var _a54=this._adjustViewPortStartPos(_a49,lg);
var _a55=this._adjustBufferStartPos(_a49,lg);
this._repairBufferSeqNums(lg);
var _a56=lg.scroller.moveScroll(lg.viewPort.lastRowPos);
if(!_a56){
lg.requestContentRefresh(lg.viewPort.lastRowPos);
lg.viewPort.refreshContents(lg.viewPort.lastRowPos);
}
},_utils:{removeShiftRanges:function(_a57){
var _a58={}.extend(_a57);
if(!_a58.ranges.length){
return _a58;
}
_a58.ranges.each(function(oSR){
_a58.count-=oSR.count;
});
_a58.ranges=[];
return _a58;
},listConcat:function(l,a){
if(a&&a.length){
return l.concat(a||[]);
}else{
return l;
}
},asFidColonUid:function(_a5c){
return _a5c.fid+":"+_a5c.uid;
},asFidColonUidRange:function(r){
return r.start.fid+":"+r.start.uid+"-"+r.end.fid+":"+r.end.uid;
},mkMsgAcceptor:function(_a5e,_a5f){
var _a60=_a5e.ranges;
var hash=$H({});
_a5e.singles.each(function(m){
hash[m.fid+"_"+m.uid]=true;
});
return function(_a63){
if(!_a63){
return false;
}
_a63=_a63.meta||_a63;
if(hash[_a63.fid+"_"+_a63.uid]){
return true;
}
if(_a60.length<1){
return false;
}
if(!_a5f){
return false;
}
return _a5f._checkShiftRanges(_a63,_a60);
};
},mkCSSClassNameForRow:function(_a64){
return ["seen","flagged","attachment","priority","toself","deleted","replied","forwarded"].map(function(prop){
var _a66=_a64[prop];
if(!_a66){
return "";
}
var c;
if(prop==="forwarded"){
c="w";
}else{
c=prop.charAt(0);
}
return c+_a66;
}).join(" ");
},yes:function(){
return true;
}},refreshGrid:function(){
var lg=this.liveGrid;
var _a69=lg.viewPort.lastRowPos;
lg.buffer.removeIf(this._utils.yes);
lg.viewPort.isPartialBlank=true;
lg.requestContentRefresh(_a69);
},_setupSubscribers:function(){
var E=DA.mailer.Events;
if(!E){
return;
}
function mkHndlr(f){
return function(type,args){
var _,_a6f;
if(!args||!(_a6f=args[0])||!(_=args[1])||!(_.target&&_.messages)){
return;
}
var _a70=args[2];
var _a71=false;
if(parseInt(_.target.fid,10)===this.folderId){
_a71=true;
}
var ours=DA.util.areEquivObjs(_.messages.identity,this._getIdentity());
var _a73=(!ours)&&_.messages.ranges.length;
f.call(this,_a71,_a73,_a6f,_.messages,_.target,_a70);
};
}
var _a74,_a75,_a76;
E.onMessagesMoving.subscribe(_a74=mkHndlr(function(_a77,_a78,_a79,_a7a,_a7b){
if(_a77){
return;
}
var _a7c=_a78?this._utils.removeShiftRanges(_a7a):_a7a;
if(_a7a.singles.length===1){
if(_a7a.single.mode===1){
this._add_reply_flag({fid:_a7a.single.fid,uid:_a7a.single.originuid});
}else{
if(_a7a.single.mode===2){
this._add_forwarded_flag({fid:_a7a.single.fid,uid:_a7a.single.originuid});
}else{
}
}
}
this._messageMoverJobs[_a79]=_a7c;
this._removeMessagesFromGrid(_a79);
}),this,true);
E.onMessagesMoved.subscribe(_a75=mkHndlr(function(_a7d,_a7e,_a7f,_a80,_a81,_a82){
if(_a7d){
this.refreshGrid();
return;
}
delete this._messageMoverJobs[_a7f];
if(_a7e){
this.refreshGrid();
}
if(this._messageMoverJobs.entries().length===0){
this._updateExceptionFilter();
}
}),this,true);
E.onMessagesMoveFailure.subscribe(_a76=mkHndlr(function(_a83,_a84,_a85){
delete this._messageMoverJobs[_a85];
this._updateExceptionFilter();
}),this,true);
function mkFlagHndlr(f){
return function(type,args){
var _,_a8a;
if(!args||!(_a8a=args[0])||!(_=args[1])||!(_.property&&_.messages)){
return;
}
var _a8b=args[2];
var _a8c=_.state!==false;
var ours=DA.util.areEquivObjs(_.messages.identity,this._getIdentity());
var _a8e=(!ours)&&_.messages.ranges.length;
f.call(this,_a8e,_a8a,_.messages,_.property,_a8c,_a8b);
};
}
var _a8f=$H({});
var _a90,_a91,_a92;
E.onMessagesFlagging.subscribe(_a90=mkFlagHndlr(function(_a93,_a94,_a95,_a96,_a97,_a98){
var _a99=_a93?this._utils.removeShiftRanges(_a95):_a95;
var me=this;
var _a9b=this.liveGrid.buffer.findRowMetaData(this._utils.mkMsgAcceptor(_a95,me));
var _a9c=_a9b.map(function(md){
var _a9e=md[_a96];
var _a9f=md.className;
md[_a96]=_a97?"1":"0";
me.setRowAppearance(md,[_a96]);
return {property:_a9e,className:_a9f,mmdata:md};
});
_a8f[_a94]={undo:function(){
_a9c.each(function(undo){
var _aa1=undo.mmdata;
_aa1[_a96]=undo.property;
_aa1.className=undo.className;
me.setRowAppearance(_aa1);
});
}};
}),this,true);
E.onMessagesFlagged.subscribe(_a91=mkFlagHndlr(function(_aa2,_aa3,_aa4,_aa5,_aa6,_aa7){
if(_aa2){
this.refreshGrid();
}
delete _a8f[_aa3];
}),this,true);
E.onMessagesFlagFailure.subscribe(_a92=mkFlagHndlr(function(_aa8,_aa9,_aaa,_aab,_aac,_aad){
var job=_a8f[_aa9];
if(!job){
return;
}
job.undo();
delete _a8f[_aa9];
}),this,true);
var _aaf;
E.onMessageRead.subscribe(_aaf=function(type,args){
var _ab2=args[0];
if(!_ab2||!_ab2.uid){
return;
}
if(!DA.util.cmpNumber(_ab2.fid,this.folderId)&&!DA.util.cmpNumber(_ab2.srid,this._getIdentity().srid)){
return;
}
var tr=this.findRowByMMData(_ab2);
if(!tr){
return;
}
var md=tr.__daGridRowMetaData;
if(!md){
return;
}
md.seen="1";
this.setRowAppearance(md,["seen"],tr);
},this,true);
YAHOO.util.Event.on(window,"unload",function(){
E.onMessagesMoving.unsubscribe(_a74,this);
E.onMessagesMoved.unsubscribe(_a75,this);
E.onMessagesMoveFailure.unsubscribe(_a76,this);
E.onMessagesFlagging.unsubscribe(_a90,this);
E.onMessagesFlagged.unsubscribe(_a91,this);
E.onMessagesFlagFailure.unsubscribe(_a92,this);
E.onMessageRead.unsubscribe(_aaf,this);
},this,true);
},_getIdentity:function(){
var _ab5=this.liveGrid.getParameters();
delete _ab5.except;
_ab5.isaMboxGrid=true;
return _ab5;
},setupCSS:function(){
var _ab6=this.isUsingFakeTable?"div#"+this.liveGrid.tableId+" div.t1":"table#"+this.liveGrid.tableId+" tr.t1";
var _ab7="color:"+DA.vars.config.toself_color;
DA.dom.createCSSRule(_ab6,_ab7);
},_setupContextMenu:function(){
var t_=DA.locale.GetText.t_;
var t=function(key){
return t_("MBOXGRID_ROWCONTEXTMENU_"+key);
};
var _abb=this._utils.asFidColonUid;
var _abc=this._utils.asFidColonUidRange;
var _abd=DA.mailer.Events;
var me=this;
var _abf=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_flag.cgi");
var _ac0=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi");
_ac0.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("EXPORT_ERROR"));
DA.waiting.hide();
};
_ac0.callback=function(o){
var url,Proc;
if(DA.mailer.util.checkResult(o)){
if(!DA.util.isEmpty(o.file)){
if(DA.util.isNull(o.file_name)){
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=archive%26file="+o.file;
}else{
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=archive%26file="+o.file+"%26file_name="+o.file_name;
}
url=DA.vars.cgiRdir+"/down_pop4ajax.cgi?proc="+Proc;
DA.windowController.winOpenNoBar(url,"",400,450);
}else{
DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
}
}
DA.waiting.hide();
};
var _ac5=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi");
_ac5.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("SAVE_TO_LIB_ERROR"));
DA.waiting.hide();
};
_ac5.callback=function(o){
var url;
var Img="pop_title_attachsave.gif";
if(!DA.util.isEmpty(o.file)){
url="lib_foldersel.cgi%3fcall=ma_detail%20path="+o.file+"%20name="+o.file_name+"%20is_for_save_mail=true";
DA.windowController.isePopup(url,Img,400,550,DA.mailer.util.getMailAccount(),false);
}else{
DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
}
DA.waiting.hide();
};
var _aca=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_filter.cgi");
_aca.errorHandler=function(e,_acc){
DA.util.warn(DA.locale.GetText.t_("FILTER_ERROR"));
_abd.onMessagesFilterFailure.fire({srcFid:_acc.fid});
DA.waiting.hide();
};
_aca.callback=function(o,_ace){
if(DA.mailer.util.checkResult(o)){
_abd.onMessagesFiltered.fire({srcFid:_ace.fid,response:o});
}
DA.waiting.hide();
};
var _acf=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi");
_acf.errorHandler=function(e,_ad1){
DA.util.warn(DA.locale.GetText.t_("JOIN_ERROR"));
DA.waiting.hide();
};
_acf.callback=function(o,_ad3){
if(DA.mailer.util.checkResult(o)){
DA.mailer.windowController.viewerOpen(o.fid,o.uid);
}
DA.waiting.hide();
};
function toggleAllOn(_ad4,prop,_ad6){
_abd.onMessageFlagRequest.fire({messages:_ad4,property:prop,state:_ad6!==true});
}
function toggleAllOff(_ad7,prop){
return toggleAllOn(_ad7,prop,true);
}
function _mkIsSet_str(prop){
return function(_ada){
return _ada&&_ada[prop]&&_ada[prop].charAt(0)==="1";
};
}
function _mkIsSet_int(prop){
return function(_adc){
return _adc&&_adc[prop]&&_adc[prop]===1;
};
}
function _mkIsSet_coerce(prop){
return function(_ade){
var v;
return _ade&&(v=_ade[prop])&&(v===1||(v.charAt&&v.charAt(0)==="1"));
};
}
function printMail(_ae0){
var _ae1=me.getSelected().single;
DA.windowController.winOpen(DA.vars.cgiRdir+"/ma_ajx_print.cgi?fid="+_ae0.fid+"&uid="+_ae1.uid,"",710,600);
}
function showMoveFolderDialog(x,y){
window.__mboxGrid.searchMoveFolderDialog.show(x,y);
}
function checkAll(_ae4,f){
if(!_ae4||!_ae4.count||_ae4.count<1){
return {none:true};
}
if(_ae4.count===1){
if(_ae4.single&&f(_ae4.single)){
return {all:true};
}else{
return {none:true};
}
}
if(_ae4.ranges&&_ae4.ranges.length>0){
return {some:true};
}
if(!_ae4.singles||_ae4.singles.length===0){
return {none:true};
}
var _ae6=0;
var _ae7=0;
var arr=_ae4.singles;
arr.each(function(a){
if(f(a)){
++_ae7;
}else{
++_ae6;
}
});
return arr.length===_ae7?{all:true}:arr.length===_ae6?{none:true}:{some:true};
}
var _aea=_mkIsSet_coerce("flagged");
var _aeb=_mkIsSet_coerce("seen");
var _aec=function(f){
return function(e,args){
var _af0=me.getSelected().single;
if(!_af0){
return;
}
return f(_af0);
};
};
var _af1=function(f){
return function(e,args){
var _af5=me.getSelected();
if(!_af5||!_af5.count){
return;
}
var _af6=_af5.singles?_af5.singles:_af5.single?[_af5.single]:[];
var _af7=_af5.ranges;
_af7=(_af7&&_af7.map)?_af7:[];
var fid=_af5.fid;
var _af9=_af6.map(_abb);
var _afa=_af7.map(_abc);
return f(fid,_af9,_afa);
};
};
var _afb=new DA.widget.ContextMenuController("da_mboxGridContextMenu",this.liveGrid.tableId,{order:[["open"],["reply","replyall","forward"],["delete"],["print"],["markasread","markasunread","flag","unflag"],["export","savetolib","filter","join","movefolder"]],items:{open:{text:t("OPEN"),onclick:_aec(function(_afc){
if(DA.util.cmpNumber(_afc.open_m,2)){
if(DA.mailer.util.isBackupFolder(_afc.type)){
DA.mailer.windowController.editorOpenBackUp("edit",_afc.fid,_afc.uid,_afc.backup_maid,_afc.backup_org_clrRdir);
}else{
DA.mailer.windowController.editorOpen("edit",_afc.fid,_afc.uid);
}
}else{
DA.mailer.windowController.viewerOpen(_afc.fid,_afc.uid,_afc.srid);
}
})},reply:{text:t("REPLY"),onclick:_aec(function(_afd){
DA.mailer.windowController.editorOpen("reply",_afd.fid,_afd.uid);
})},replyall:{text:t("REPLYALL"),onclick:_aec(function(_afe){
DA.mailer.windowController.editorOpen("all_reply",_afe.fid,_afe.uid);
})},forward:{text:t("FORWARD"),onclick:_aec(function(_aff){
DA.mailer.windowController.editorOpen("forward",_aff.fid,_aff.uid);
})},markasread:{text:t("MARKASREAD"),onclick:function(e,args){
toggleAllOn(me.getSelected(),"seen");
}},markasunread:{text:t("MARKASUNREAD"),onclick:function(e,args){
toggleAllOff(me.getSelected(),"seen");
}},flag:{text:t("SETMARK"),onclick:function(e,args){
toggleAllOn(me.getSelected(),"flagged");
}},unflag:{text:t("UNSETMARK"),onclick:function(e,args){
toggleAllOff(me.getSelected(),"flagged");
}},"export":{text:t("EXPORT"),onclick:_af1(function(fid,_b09,_b0a){
DA.waiting.show(DA.locale.GetText.t_("EXPORT_OPERATING_PROMPT"));
_ac0.execute({fid:fid,uid:_b09.join(","),area:_b0a.join(","),archive:"1",proc:"export"});
})},savetolib:{text:t("SAVETOLIB"),onclick:_af1(function(fid,_b0c,_b0d){
DA.waiting.show(DA.locale.GetText.t_("SAVETOLIB_OPERATING_PROMPT"));
_ac5.execute({fid:fid,uid:_b0c.join(","),area:_b0d.join(","),archive:"1",proc:"save_to_lib"});
})},movefolder:{text:t("MOVEFOLDER"),onclick:function(e,args){
showMoveFolderDialog(e.clientX,e.clientY);
}},print:{text:t("PRINT"),onclick:function(e,args){
printMail(me.getSelected());
}},filter:{text:t("RUNFILTER"),onclick:_af1(function(fid,_b13,_b14){
DA.waiting.show(DA.locale.GetText.t_("FILTER_OPERATING_PROMPT"));
_abd.onMessagesFiltering.fire({srcFid:parseInt(fid,10)});
_aca.execute({fid:fid,uid:_b13.join(","),area:_b14.join(","),proc:"submit"});
})},join:{text:t("JOIN"),onclick:_af1(function(fid,_b16,_b17){
DA.waiting.show(DA.locale.GetText.t_("JOIN_OPERATING_PROMPT"));
_acf.execute({fid:fid,uid:_b16.join(","),area:_b17.join(","),proc:"join"});
})},"delete":{text:t("DELETE"),onclick:function(e,args){
me.deleteSelected();
}}}},{onTrigger:function(e){
var row=me._getRowFromEvent(e);
if(!row){
return false;
}
var _b1c=row.__daGridRowMetaData;
if(!_b1c||!_b1c.uid){
return false;
}
if(!me.liveGrid.isSelected(_b1c)){
me.setSelected(row,true,true);
me._lastClickedRowMetaData=_b1c;
me._lastClickedRow4RightButton=row;
}
var _b1d=me.getSelected();
if(!_b1d||!_b1d.count){
return false;
}
var _b1e=[];
var _b1f=[];
var _b20=checkAll(_b1d,_aeb);
var _b21=checkAll(_b1d,_aea);
if(_b1d.count>1){
if(DA.mailer.util.isLocalFolder(_b1c.type)||DA.mailer.util.isBackupFolder(_b1c.type)){
_b1f.push("open");
_b1f.push("reply");
_b1f.push("replyall");
_b1f.push("forward");
_b1f.push("export");
_b1f.push("filter");
_b1f.push("join");
_b1f.push("print");
_b1f.push("savetolib");
if(me.searchMode){
_b1e.push("movefolder");
}else{
_b1f.push("movefolder");
}
_b1e.push("delete");
}else{
_b1f.push("open");
_b1f.push("reply");
_b1f.push("replyall");
_b1f.push("forward");
_b1f.push("print");
_b1f.push("savetolib");
if(me.searchMode){
_b1e.push("movefolder");
}else{
_b1f.push("movefolder");
}
_b1e.push("export");
_b1e.push("filter");
_b1e.push("delete");
_b1e.push("join");
}
}else{
if(DA.mailer.util.isLocalFolder(_b1c.type)||DA.mailer.util.isBackupFolder(_b1c.type)){
_b1f.push("reply");
_b1f.push("replyall");
_b1f.push("forward");
_b1f.push("export");
_b1f.push("filter");
_b1f.push("join");
_b1e.push("open");
_b1e.push("delete");
_b1e.push("print");
if(me.searchMode){
_b1e.push("movefolder");
}else{
_b1f.push("movefolder");
}
if(DA.vars.config.save_to_lib){
_b1e.push("savetolib");
}else{
_b1f.push("savetolib");
}
}else{
_b1e.push("open");
_b1e.push("reply");
_b1e.push("replyall");
_b1e.push("forward");
_b1e.push("export");
if(me.searchMode){
_b1e.push("movefolder");
}else{
_b1f.push("movefolder");
}
if(me.searchMode){
_b1f.push("filter");
}else{
_b1e.push("filter");
}
_b1f.push("join");
_b1e.push("delete");
_b1e.push("print");
if(DA.vars.config.save_to_lib){
_b1e.push("savetolib");
}else{
_b1f.push("savetolib");
}
}
}
if(DA.mailer.util.isLocalFolder(_b1c.type)||DA.mailer.util.isDraft(_b1c.type)||DA.mailer.util.isSent(_b1c.type)||DA.mailer.util.isBackupFolder(_b1c.type)){
_b1f.push("markasunread");
_b1f.push("markasread");
}else{
if(_b20.all){
_b1f.push("markasread");
_b1e.push("markasunread");
}else{
if(_b20.none){
_b1f.push("markasunread");
_b1e.push("markasread");
}else{
_b1e.push("markasunread");
_b1e.push("markasread");
}
}
}
if(DA.mailer.util.isLocalFolder(_b1c.type)||DA.mailer.util.isBackupFolder(_b1c.type)){
_b1f.push("unflag");
_b1f.push("flag");
}else{
if(_b21.all){
_b1f.push("flag");
_b1e.push("unflag");
}else{
if(_b21.none){
_b1f.push("unflag");
_b1e.push("flag");
}else{
_b1e.push("unflag");
_b1e.push("flag");
}
}
}
DA.customEvent.fire("mboxGridSetupContextMenuOnTriggerAfter",this,{meta:_b1c,hiddens:_b1f,visibles:_b1e,selected:_b1d});
_b1f.each(this.hidden.bind(this));
_b1e.each(this.visible.bind(this));
me.liveGrid.scroller.disableMouseScroll();
return true;
},onCancel:function(){
if(me._lastClickedRow4RightButton){
me.setUnSelected(me._lastClickedRow4RightButton);
}
me.liveGrid.scroller.enableMouseScroll();
}});
},_percentify:function(){
var _b22=this.columns.pluck("width");
if(_b22.grep("%").first()){
return;
}
var _b23=DA.util.toPercentages(_b22);
_b23=_b23.map(Math.floor);
this.columns.each(function(col,_b25){
col.width=Math.max(1,_b23[_b25])+"%";
});
},changeFolder:function(id,type){
if(id){
id=parseInt(id,10);
}else{
id=0;
}
var _b28=id===this.folderId;
this.folderId=id;
this.folderType=type;
this.setFolderMode();
if(!_b28&&this.liveGrid){
this.liveGrid.removeColumnSort();
}
this._lazyCreate({fid:id,search_field:"",search_word:""},(!_b28));
if(!_b28){
this.onFolderChanged.fire({fid:id,type:type});
if(this.fromColumnIndex){
if(DA.mailer.util.isDraft(type)||DA.mailer.util.isSent(type)||DA.mailer.util.isLocalFolder(type)||DA.mailer.util.isBackupFolder(type)){
this.liveGrid.setColumnTitle(this.fromColumnIndex,DA.locale.GetText.t_("MBOXGRID_COLUMNTITLE_TO"));
}else{
this.liveGrid.setColumnTitle(this.fromColumnIndex,DA.locale.GetText.t_("MBOXGRID_COLUMNTITLE_FROM"));
}
}
if(this.dateColumnIndex){
if(DA.mailer.util.isBackupFolder(type)){
this.liveGrid.setColumnTitle(this.dateColumnIndex,DA.locale.GetText.t_("MBOXGRID_COLUMNTITLE_BACKUP_DATE"));
}else{
this.liveGrid.setColumnTitle(this.dateColumnIndex,DA.locale.GetText.t_("MBOXGRID_COLUMNTITLE_DATE"));
}
}
if(this.sizeColumnIndex){
if(DA.mailer.util.isBackupFolder(type)||DA.mailer.util.isLocalFolder(type)){
this.liveGrid.setColumnTitle(this.sizeColumnIndex,DA.locale.GetText.t_("MBOXGRID_COLUMNTITLE_BACKUP_SIZE"));
}else{
this.liveGrid.setColumnTitle(this.sizeColumnIndex,DA.locale.GetText.t_("MBOXGRID_COLUMNTITLE_SIZE"));
}
}
}
},clear:function(){
this.folderId=0;
this.liveGrid.clear();
},onFolderChanged:null,onDoubleClick:null,searchInCurrentFolder:function(_b29,_b2a){
if(this.searchMode){
return;
}
if(this.folderId){
if(_b29&&_b2a){
this._lazyCreate({fid:this.folderId,search_field:_b29,search_word:_b2a});
}else{
this._lazyCreate({fid:this.folderId},true);
}
}else{
}
},refresh:function(){
if(!this.liveGrid){
return;
}
this.liveGrid.update({},false);
},getUIStateInfo:function(){
var _b2b=this.liveGrid?this.liveGrid.getUIStateInfo():null;
return _b2b;
},setSearchMode:function(){
if(this.searchMode){
return;
}
this.searchMode=true;
this.url=DA.vars.cgiRdir+"/ajx_ma_search.cgi";
},setFolderMode:function(){
if(this.searchMode){
this.searchMode=false;
delete this.url;
}
},loadSearchResults:function(_b2c,fid,srid,type){
this.folderId=fid;
this.folderType=type;
this.setSearchMode();
this._lazyCreate({fid:fid,srid:srid});
this.liveGrid.metaData.setTotalRows(_b2c);
},_lazyCreate:function(args,_b31){
if(!this.liveGrid){
this.initLiveGrid(args,_b31);
}else{
this.isInMutliSelect=false;
this.setAllUnSelected();
this.liveGrid.update(args,_b31);
if(_b31===false){
$("mboxGrid_search_keyword").value="";
}
}
},_generateFakeTable:function(id,_b33,_b34){
var div=document.createElement("div");
div.onselectstart=div.onselect=function(){
return false;
};
div.rows=[];
var _b36;
var _b37=_b34.map(function(c){
return null;
});
var i=0;
for(i=0;i<_b33;++i){
_b36=document.createElement("div");
_b36.cells=_b37;
_b36.id="rowdiv"+i;
_b36.className="da_rowdiv";
div.appendChild(_b36);
div.rows[i]=_b36;
}
div.id=id;
return div;
},_generateTableHTML:function(id,_b3b,_b3c){
var sb=[];
var i=0;
sb.push("<table id=\""+id+"\" onselectstart=\"return false;\"><colgroup>");
var tds="";
_b3c.each(function(col){
sb.push("<col width=\""+col.width+"\"/>");
tds+=("<td class='"+col.key+"'>&nbsp;</td>");
});
sb.push("</colgroup>");
sb.push("<tbody>");
for(i=0;i<_b3b;++i){
sb.push("<tr> "+tds+"\n");
sb.push("</tr>");
}
sb.push("</tbody>");
sb.push("</table>");
return sb.join("");
},isUsingFakeTable:true,initLiveGrid:function(args){
if(this.liveGrid!==null){
return;
}
var _b42="mbox_grid_"+(new Date()).getTime();
var _b43=DA.vars.system.max_number_per_page4ajx+1||41;
if(this.isUsingFakeTable){
this.containerElem.appendChild(this._generateFakeTable(_b42,_b43,this.columns));
this._rowLocator=function(div){
return div.parentNode&&div.parentNode.id===_b42;
};
}else{
this.containerElem.innerHTML+=this._generateTableHTML(_b42,_b43,this.columns);
}
this.liveGrid=new DA.widget.VirtualScrollingTable({visibleRows:this.visibleRows,maxVisisbleRows:_b43-1,url:this.url,urlParams:args,resizableColumns:true,onLoading:this.onLoading,onLoadDone:function(){
this._onLoadDone();
this.onLoadDone();
}.bind(this),table:$(_b42),isUsingFakeTable:this.isUsingFakeTable,columns:this.columns,containerElem:this.containerElem});
var me=this;
this.liveGrid.getSelected=function(){
return me.getSelected();
};
this.liveGrid.isIORequired=function(){
return this.folderId>0;
}.bind(this);
var _b46=BrowserDetect.browser==="Explorer"?1:0;
YAHOO.util.Event.on(this.liveGrid.tableId,"mousedown",function(e){
if(e.button!==_b46){
return;
}
this._isBeingDragged=false;
var _b48=e.shiftKey||e.ctrlKey;
if(_b48){
if(this.searchMode){
YAHOO.util.Event.stopEvent(e);
}
return;
}
var row=this._getRowFromEvent(e);
var _b4a=row&&this.liveGrid.isSelected(row.__daGridRowMetaData);
if(_b4a){
return;
}
this._handleRowClicked(row,false);
YAHOO.util.Event.stopEvent(e);
},true,this);
YAHOO.util.Event.on(this.liveGrid.tableId,"mouseup",function(e){
if(e.button!==_b46){
return;
}
var _b4c=e.shiftKey||e.ctrlKey;
if(!e.shiftKey){
this._shiftRangeOriginMeta=null;
}
var row=this._getRowFromEvent(e);
var _b4e=row?row.__daGridRowMetaData:null;
var _b4f=row&&this.liveGrid.isSelected(_b4e);
if(!_b4c&&!_b4f){
return;
}
if(!_b4c&&_b4f&&!this._isBeingDragged){
this.isInMutliSelect=false;
this._handleRowClicked(row);
return;
}
if(e.shiftKey){
this.setRangeEnd(_b4e);
}
if(e.ctrlKey){
this.isInMutliSelect=true;
if(_b4f){
if(this._checkShiftRanges(_b4e)){
this._deflateRanges();
}
this.setUnSelected(row);
}else{
this.setSelected(row,false);
}
}
this._lastClickedRowMetaData=_b4e;
},true,this);
YAHOO.util.Event.on(this.liveGrid.tableId,"dblclick",function(e){
var row=this._getRowFromEvent(e);
this._handleRowClicked(row,true);
},true,this);
this._setupContextMenu();
this.initSelectionCache();
YAHOO.util.Event.on(window.document,"keydown",function(evt){
var k=YAHOO.util.Event.getCharCode(evt);
if(!this._lastClickedRowMetaData){
return;
}
var el=Event.element(evt);
if(el.tagName!=="INPUT"){
switch(k){
case Event.KEY_DOWN:
this._handleArrowDown();
break;
case Event.KEY_UP:
this._handleArrowUp();
break;
case Event.KEY_DELETE:
this._handleDelete();
break;
default:
}
}
},true,this);
},onSelectionChanged:null,_handleArrowDown:function(){
this._handleArrowKey(1);
},_handleArrowUp:function(){
this._handleArrowKey(-1);
},_handleDelete:function(){
this.onDeletePress();
},_handleArrowKey:function(n){
var _b56=this._lastClickedRowMetaData,_b57=this._getViewPortRange(),_b58=_b56.sno,_b59=_b57.start+1,_b5a=_b57.end+1,_b5b=_b5a-_b59-1,_b5c=_b58+n,row,only=true;
this.containerElem.focus();
if(_b5c<_b59+1){
this.liveGrid.scroller.moveScroll(_b5c-1-1);
}
if(_b5c>_b5a-1){
this.liveGrid.scroller.moveScroll(_b5c-1-_b5b+1);
}
var _b5f=function(){
var _b60=this._findPositionInBuffer(_b56)+n;
var _b61=this.liveGrid.buffer.rows[_b60];
return _b61?this.findRowByMMData(_b61.meta):null;
}.bind(this);
row=_b5f();
if(row){
this.setSelected(row,only,false,true);
this._lastClickedRowMetaData=row.__daGridRowMetaData;
}else{
this._scheduleJobOnLoadDone(function(){
var row=_b5f();
if(row){
this.setSelected(row,only,false,true);
this._lastClickedRowMetaData=row.__daGridRowMetaData;
}else{
}
});
}
},_lastClickedRowMetaData:null,_lastClickedRow4RightButton:null,initSelectionCache:function(){
var me=this;
var hash={};
var _b65=[];
this._checkShiftRanges=function(_b66,_b67){
_b67=_b67||_b65;
var i,_b69=_b67.length,sr;
var sno=parseInt(_b66.sno,10);
for(i=0;i<_b69;++i){
sr=_b67[i];
if((sr.start.sno<=sno)&&(sr.end.sno>=sno)){
return true;
}
}
return false;
};
function rowsInRange(nA,oSR){
if(!oSR.count){
oSR.count=Math.max(0,(oSR.end.sno-oSR.start.sno)+1);
}
return nA+oSR.count;
}
var lg=this.liveGrid;
lg.isSelected=function(_b6f){
if(!_b6f){
return false;
}
_b6f=_b6f.meta||_b6f;
if(hash[_b6f.fid+"_"+_b6f.uid]){
return true;
}
if(_b65.length<1){
return false;
}
return me._checkShiftRanges(_b6f);
};
this.getSelected=function(){
var h=$H(hash);
var _b71=h.values();
var _b72=_b71.first();
var _b73=me._getIdentity();
var _b74=_b65.inject(_b71.length,rowsInRange);
if(_b74===0){
return {count:0,single:null,singles:[],identity:_b73,ranges:[]};
}
_b72=_b71.first()||_b65.first().start;
if(_b74===1){
return {count:1,single:_b72,singles:[_b72],fid:_b72.fid,srid:_b72.srid,identity:_b73,ranges:[]};
}
return {count:_b74,singles:_b71,ranges:_b65,fid:_b72.fid,srid:_b72.srid,identity:_b73};
};
this.onSelectionChanged=new YAHOO.util.CustomEvent("onSelectionChanged");
function fireAsync(_b75,key){
setTimeout(function(){
me.onSelectionChanged.fire(me.getSelected(),_b75,key);
},40);
}
var _b77=function(_b78){
var _b79=_b78.__daGridRowMetaData||_b78;
var key=_b79.fid+"_"+_b79.uid;
hash[key]=_b79;
};
var _b7b=function(_b7c){
var _b7d=_b7c.__daGridRowMetaData||_b7c;
var key=_b7d.fid+"_"+_b7d.uid;
delete hash[key];
};
this.setSelected=function(rows,only,_b81,key){
if(only&&only===true){
hash={};
_b65.clear();
YAHOO.util.Dom.removeClass(lg.table.rows,"da_gridSelectedRow");
}
YAHOO.util.Dom.addClass(rows,"da_gridSelectedRow");
(rows.length?rows:[rows]).each(_b77);
fireAsync(_b81,key);
};
this.setUnSelected=function(rows){
YAHOO.util.Dom.removeClass(rows,"da_gridSelectedRow");
(rows.length?rows:[rows]).each(_b7b);
fireAsync();
};
this.setAllUnSelected=function(){
YAHOO.util.Dom.removeClass(lg.table.rows,"da_gridSelectedRow");
hash={};
_b65.clear();
me._lastClickedRowMetaData=null;
me._shiftRangeOriginMeta=null;
fireAsync();
};
lg.clearSelection=this.setAllUnSelected.bind(this);
this.setRangeEnd=function(meta){
if(!meta){
return;
}
me._shiftRangeOriginMeta=me._shiftRangeOriginMeta||me._lastClickedRowMetaData;
var _b85=me._shiftRangeOriginMeta;
if(!_b85){
return;
}
hash={};
var sno=parseInt(meta.sno,10);
_b65.clear();
me.isInMutliSelect=false;
_b85.sno=parseInt(_b85.sno,10);
meta.sno=parseInt(meta.sno,10);
var _b87=_b85.sno<meta.sno?_b85:meta;
var end=_b85.sno>meta.sno?_b85:meta;
_b65.push({start:_b87,end:end});
$H(hash).each(function(pair){
var md=pair.value;
if(md&&me._checkShiftRanges(md)){
delete hash[pair.key];
}
});
me.liveGrid.viewPort.updateSelectionStatus();
fireAsync();
me._deflateRanges();
};
function copyRangeNode(rn){
return {sno:rn.sno,uid:rn.uid,fid:rn.fid,srid:rn.srid,type:rn.type};
}
function addToSingles(_b8c,nEnd,_b8e){
var _b8f=_b8e.first().sno;
var iEnd=nEnd-_b8f;
var _b91;
for(var i=(_b8c-_b8f);i<=iEnd;++i){
_b91=_b8e[i];
if(_b91){
_b77(_b91);
}
}
}
function mkRangeNode(nSno,_b94){
var _b95=parseInt(_b94.first().sno,10);
var _b96=_b94[nSno-_b95];
if(!_b96){
return undefined;
}
return copyRangeNode(_b96);
}
function clipRange(_b97,_b98,_b99,nEnd){
var _b9b=[];
var _b9c=Math.max(0,_b99-_b97);
var _b9d=Math.max(0,_b98-nEnd);
if(_b9c===0&&_b9d===0){
}else{
if(_b9c){
_b9b.push([_b97,_b99]);
}
if(_b9d){
_b9b.push([nEnd,_b98]);
}
}
return _b9b;
}
this._deflateRanges=function(){
if(_b65.length<1){
return;
}
var rows=me.liveGrid.buffer.rows.pluck("meta");
if(rows.length<1){
return;
}
var _b9f=rows.first().sno;
var bEnd=rows.last().sno;
_b9f=parseInt(_b9f,10);
bEnd=parseInt(bEnd,10);
var _ba1=[];
_b65.each(function(sr){
var _ba3=sr.start.sno;
var rEnd=sr.end.sno;
_ba3=parseInt(_ba3,10);
rEnd=parseInt(rEnd,10);
if(rEnd<=_b9f||_ba3>=bEnd){
_ba1.push(sr);
return;
}
var _ba5=Math.max(_ba3,_b9f);
var end=Math.min(rEnd,bEnd);
addToSingles(_ba5,end,rows);
var _ba7=clipRange(_ba3,rEnd,_ba5,end);
_ba7.each(function(_ba8){
var _ba9=mkRangeNode(_ba8[0],rows)||sr.start;
var _baa=mkRangeNode(_ba8[1],rows)||sr.end;
_ba1.push({start:_ba9,end:_baa});
_b7b(_ba9);
_b7b(_baa);
});
});
_b65.clear();
var tmp;
while((tmp=_ba1.pop())){
_b65.push(tmp);
}
_b65.reverse();
};
},_shiftRangeOriginMeta:null,setSelected:Prototype.emptyFunction,setUnSelected:Prototype.emptyFunction,_getRowFromEvent:function(e){
var _bad=YAHOO.util.Event.getTarget(e);
return DA.dom.findParent(_bad,this._rowLocator,5);
},_rowLocator:"TR",_handleRowClicked:function(row,_baf){
if(!row){
return;
}
var _bb0=row.__daGridRowMetaData;
if(!_bb0){
return;
}
if(!_bb0.fid||!_bb0.uid){
return;
}
this._lastClickedRowMetaData=_bb0;
this.setSelected(row,true);
var _bb1=this.onDoubleClick;
if(_baf){
setTimeout(function(){
_bb1.fire(_bb0);
},100);
}
},resizeHeight:function(h){
this.liveGrid.resizeHeight(h,true);
},onLoading:Prototype.emptyFunction,onLoadDone:Prototype.emptyFunction,onDeletePress:Prototype.emptyFunction,_onLoadDoneJobs:[],_onLoadDone:function(){
var jobs=this._onLoadDoneJobs,jobF;
while(jobs.length>0&&(jobF=jobs.shift())){
jobF.apply(this);
}
},_scheduleJobOnLoadDone:function(fJob){
this._onLoadDoneJobs.push(fJob);
},findRowByMMData:function(_bb6){
if(!_bb6){
return;
}
var lg=this.liveGrid;
var rows=lg.isUsingFakeTable?lg.table.childNodes:lg.table.rows;
var _bb9=Math.min(rows.length,lg.viewPort.visibleRows,lg.metaData.totalRows);
var _bba;
var row;
for(var i=0;i<_bb9;++i){
row=rows[i];
_bba=row.__daGridRowMetaData;
if(_bba&&DA.util.cmpNumber(_bba.fid,_bb6.fid)&&DA.util.cmpNumber(_bba.uid,_bb6.uid)){
return row;
}
}
},_findPositionInBuffer:function(_bbd){
var i=0,rows=this.liveGrid.buffer.rows,len=rows.length,cmp=DA.util.cmpNumber;
for(;i<len;++i){
if(cmp(rows[i].meta.fid,_bbd.fid)&&cmp(rows[i].meta.uid,_bbd.uid)){
return i;
}
}
},_getViewPortRange:function(){
return this.liveGrid.viewPort.getRange();
},setRowAppearance:function(_bc2,_bc3,tr){
if(!_bc2){
return;
}
if(_bc3&&_bc3.each){
if(!_bc2.className||_bc2.className===""){
_bc2.className=this._utils.mkCSSClassNameForRow(_bc2);
}
_bc3.each(function(prop){
var c=prop.charAt(0);
if(prop==="forwarded"){
c="w";
}
var re=new RegExp("\\b"+c+"[0-9]\\b");
_bc2.className=_bc2.className.replace(re,c+_bc2[prop]);
});
}
tr=tr?tr:this.findRowByMMData(_bc2);
if(!tr){
return;
}
var _bc8=this.liveGrid.isSelected(_bc2);
tr.className=(this.isUsingFakeTable?"da_rowdiv ":"")+_bc2.className+(_bc8?" da_gridSelectedRow":"");
},deleteSelected:function(){
var _bc9=this.getSelected();
var _bca=(DA.mailer.util.isTrash(this.folderType)||DA.vars.config["delete"]===1||(_bc9.count===1&&DA.mailer.util.isTrash(_bc9.single.type)))?DA.locale.GetText.t_("MESSAGE_DELETECOMPLETE_CONFIRM"):DA.locale.GetText.t_("MESSAGE_DELETE_CONFIRM");
if(DA.util.confirm(_bca)){
this.moveSelected({trash:true});
}
},moveSelected:function(_bcb){
var _bcc=this.getSelected();
DA.mailer.Events.onMessageMoveRequest.fire({messages:_bcc,target:_bcb});
setTimeout(function(){
this.isInMutliSelect=false;
this.setAllUnSelected();
}.bind(this),500);
},_adjustBufferStartPos:function(_bcd,_bce){
if(!_bcd){
return false;
}
var lg=_bce||this.liveGrid;
var _bd0=lg.buffer.startPos;
var _bd1=this._countAffectedRows(_bcd,0,lg.buffer.startPos);
var _bd2=_bd0-_bd1;
if(_bd2===_bd0){
return false;
}
lg.buffer.startPos=_bd2;
return true;
},_repairBufferSeqNums:function(_bd3){
var lg=_bd3||this.liveGrid;
var rows=lg.buffer.rows;
var _bd6=rows.length;
var _bd7=lg.buffer.startPos+1;
var i;
for(i=0;i<_bd6;++i){
rows[i].meta.sno=_bd7+i;
}
},_adjustViewPortStartPos:function(_bd9,_bda){
if(!_bd9){
return false;
}
var lg=_bda||this.liveGrid;
var _bdc=lg.viewPort.lastRowPos;
var _bdd;
var _bde=lg.table.firstChild;
if(_bde&&_bde.__daGridRowMetaData){
_bdd=parseInt(_bde.__daGridRowMetaData.sno,10);
}
if(_bdd!==(_bdc+1)){
_bdd=_bdc+1;
}
var _bdf=this._countAffectedRows(_bd9,0,_bdc);
var _be0=_bdc-_bdf;
if(_be0<0){
lg.viewPort.lastRowPos=0;
}else{
lg.viewPort.lastRowPos=_be0;
}
var _be1=lg.metaData.getTotalRows();
var _be2=lg.metaData.getPageSize();
var _be3=_be1-_be0;
if(_be1>=_be2){
if(_be3<_be2){
lg.viewPort.lastRowPos=(_be1-_be2)-1;
}
}else{
lg.viewPort.lastRowPos=0;
}
return lg.viewPort.lastRowPos!==_bdc;
},_countAffectedRows:function(_be4,_be5,_be6){
if(!_be4||!_be6){
return 0;
}
var _be7=(_be4.singles&&_be4.singles.length)?_be4.singles:_be4.single?[_be4.single]:[];
var _be8=(_be4.ranges&&_be4.ranges.length)?_be4.ranges:[];
var _be9=_be7.inject(0,function(nA,oS){
var sno=parseInt(oS.sno,10);
return nA+((sno>=_be5&&sno<=_be6)?1:0);
});
_be9=_be8.inject(_be9,function(nA,oR){
var from=Math.max(oR.start.sno,_be5);
var to=Math.min(oR.end.sno,_be6);
return nA+Math.max(0,(to-from+1));
});
if(_be9<0){
return 0;
}else{
return _be9;
}
},_messageMoverJobs:null,_updateExceptionFilter:function(){
var _bf1=this._messageMoverJobs.values();
if(_bf1.length<1){
delete this.liveGrid.jsonIO.defaultParams.except;
}
var _bf2=_bf1.pluck("singles").inject([],this._utils.listConcat);
var _bf3=_bf1.pluck("ranges").inject([],this._utils.listConcat);
this.liveGrid.jsonIO.defaultParams.except=_bf2.map(this._utils.asFidColonUid).concat(_bf3.map(this._utils.asFidColonUidRange)).join(",");
}};
if("undefined"===typeof DA.mailer.dd){
DA.mailer.dd={};
}
DA.mailer.dd.MboxMail=function(id){
this.init(id,"da_folderTree",this.config);
this.initFrame();
};
YAHOO.extend(DA.mailer.dd.MboxMail,YAHOO.util.DDProxy,{_targetId2fid:DA.mailer.FolderTreeController.prototype._targetId2fid,_fid2divId:DA.mailer.FolderTreeController.prototype._fid2divId,clickValidator:function(e){
if(DA.mailer.util.getOperationFlag()!==""&&DA.mailer.util.getOperationFlag()!==OrgMailer.vars.org_mail_gid.toString()){
return false;
}
var _bf6=this.mboxGrid.getSelected();
if(e.ctrlKey&&(!_bf6||_bf6.count===0)){
return false;
}
var node=YAHOO.util.Event.getTarget(e);
var _bf8;
var _bf9;
if(!node){
return false;
}
if(node.id){
_bf8=node;
}else{
_bf8=node.parentNode;
}
if(_bf8.id.match(/^rowdiv\d+$/)){
_bf9=_bf8.children||_bf8.childNodes||[];
if(_bf9.length===0){
return false;
}
}
return true;
},endDrag:function(){
this.mboxGrid._isBeingDragged=false;
},onDragDrop:function(e,id){
var fid=this._getFid(id);
if(this._okToDrop(fid)){
YAHOO.util.Dom.removeClass($(id).parentNode,"labelTargeted");
this.mboxGrid.moveSelected({fid:fid});
}
},_okToDrop:function(nFid){
if(nFid){
if(this.mboxGrid.folderTreeController&&!this.mboxGrid.folderTreeController._dropMOk(nFid)){
return false;
}
return parseInt(nFid,10)!==this.mboxGrid.folderId;
}else{
return false;
}
},onDragEnter:function(e,id){
var fid=this._getFid(id);
if(this._okToDrop(fid)){
YAHOO.util.Dom.addClass($(id).parentNode,"labelTargeted");
DA.mailer.Events.onMessagesDragEnter.fire({fid:fid});
}
},_getFid:function(id){
if(!id){
return;
}
var fid=this._targetId2fid(id);
return fid?fid:0;
},onDragOut:function(e,id){
var fid=this._getFid(id);
if(fid){
YAHOO.util.Dom.removeClass($(id).parentNode,"labelTargeted");
DA.mailer.Events.onMessagesDragOut.fire({fid:fid});
}
},config:{scroll:false,resizeFrame:false,centerFrame:true,dragElId:"mboxmaildd_dragProxy"},startDrag:function(x,y){
this.mboxGrid._isBeingDragged=true;
}});
YAHOO.util.Event.on(window,"load",function(){
var div=document.createElement("div");
div.id="mboxmaildd_dragProxy";
Object.extend(div.style,{visibility:"hidden",position:"absolute",top:"0px",left:"0px",width:"20px",height:"15px",backgroundImage:"url('/images/ico_fc_mail.gif')",backgroundPosition:"center center",backgroundRepeat:"no-repeat"});
document.body.appendChild(div);
});
Rico.LiveGridBuffer.prototype.loadRows=function(obj){
var _c0a;
if(obj.view){
_c0a=obj.view.messages;
this.metaData.setTotalRows(_c0a?_c0a:0);
}
if(DA.util.isEmpty(obj.srid)){
DA.mailer.Events.onMboxGridLoadRows.fire({fid:obj.fid,count:_c0a?_c0a:0,response:obj});
}
return obj.mail_list||[];
};
if(!DA||!DA.mailer||!DA.mailer.widget||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.mailer.widget.AddressAutoComplete=function(_c0b,_c0c,_c0d,_c0e){
var _c0f;
if(!_c0b||!_c0c||!_c0d){
_c0f="Invalid/Missing args";
throw _c0f;
}
if(_c0e instanceof DA.ug.InformationListController){
this.listController=_c0e;
this._selectItem=this._listController_selectItem;
}
this._initDataSource(_c0d);
DA.mailer.widget.AddressAutoComplete.superclass.constructor.call(this,_c0b,_c0c,this.dataSource);
this.useIFrame=true;
};
YAHOO.extend(DA.mailer.widget.AddressAutoComplete,YAHOO.widget.AutoComplete,{listController:null,delimChar:[","],_hitFields:["email","name","alpha","kana","keitai_mail","pmail1","pmail2"],formatResult:function(_c10,_c11){
var _c12=_c10[0];
var _c13=_c10[1];
if(!_c13){
return "";
}
var _c14=["<div>","<img src='",_c13.icon,"'/>"];
var j=_c14.length;
var _c16=_c11.length;
var _c17=this._hitFields;
var _c18={};
var _c19=_c17.length;
var reg=new RegExp(["^(",DA.util.encode(_c11).replace(/(?:\s|　)/,"(?:\\s|\u3000)"),")"].join(""));
var i,val,_c1d,_c1e;
for(i=0;i<_c19;++i){
_c1e=_c17[i];
val=_c13[_c1e];
if(!val||!val.indexOf){
continue;
}
if(_c13[_c1e+"_hit"]===1){
_c18[_c1e]=DA.util.encode(val).replace(reg,"<span style='font-weight:bold'>$1</span>");
}else{
_c18[_c1e]=DA.util.encode(val);
}
}
_c14[j++]="&nbsp;";
_c14[j++]=_c18.name;
_c14[j++]="&nbsp;";
if(!DA.util.isEmpty(_c18.email)||!DA.util.isEmpty(_c18.keitai_mail)||!DA.util.isEmpty(_c18.pmail1)||!DA.util.isEmpty(_c18.pmail2)){
_c14[j++]="&lt;";
if(!DA.util.isEmpty(_c18.email)){
_c14[j++]=_c18.email;
}else{
if(!DA.util.isEmpty(_c18.keitai_mail)){
_c14[j++]=_c18.keitai_mail;
}else{
if(!DA.util.isEmpty(_c18.pmail1)){
_c14[j++]=_c18.pmail1;
}else{
if(!DA.util.isEmpty(_c18.pmail2)){
_c14[j++]=_c18.pemail2;
}
}
}
}
_c14[j++]="&gt;";
_c14[j++]="&nbsp;";
}
if(!DA.util.isEmpty(_c13.gname)){
_c14[j++]="(";
_c14[j++]=_c13.gname;
_c14[j++]=")";
}
_c14[j++]="</div>";
return (_c14.join(""));
},dataSource:null,_initDataSource:function(_c1f){
this.dataSource=Object.extend(new YAHOO.widget.DS_XHR(DA.vars.cgiRdir+"/ajx_ma_addr_search.cgi",["user_list","email"]),{doQuery:function(_c20,_c21,_c22){
var _c23,sUri;
var _c25,_c26;
var _c27,_c28,_c29;
if(DA.util.lock("incSearch")){
_c23=(this.responseType===YAHOO.widget.DS_XHR.TYPE_XML);
sUri=this.scriptURI+"?"+this.scriptQueryParam+"="+_c21;
if(this.scriptQueryAppend.length>0){
sUri+="&"+this.scriptQueryAppend;
}
sUri=DA.util.setUrl(sUri);
_c25=null;
_c26=this;
_c27=function(_c2a){
if(!_c26._oConn||(_c2a.tId!==_c26._oConn.tId)){
_c26.dataErrorEvent.fire(_c26,_c22,_c21,YAHOO.widget.DataSource.ERROR_DATANULL);
DA.util.unlock("incSearch");
return;
}
if(!_c23){
_c2a=_c2a.responseText;
}else{
_c2a=_c2a.responseXML;
}
if(_c2a===null){
_c26.dataErrorEvent.fire(_c26,_c22,_c21,YAHOO.widget.DataSource.ERROR_DATANULL);
DA.util.unlock("incSearch");
return;
}
var _c2b=_c26.parseResponse(_c21,_c2a,_c22);
var _c2c={};
_c2c.query=decodeURIComponent(_c21);
_c2c.results=_c2b;
if(_c2b===null){
_c26.dataErrorEvent.fire(_c26,_c22,_c21,YAHOO.widget.DataSource.ERROR_DATAPARSE);
_c2b=[];
}else{
_c26.getResultsEvent.fire(_c26,_c22,_c21,_c2b);
_c26._addCacheElem(_c2c);
}
_c20(_c21,_c2b,_c22);
DA.util.unlock("incSearch");
};
_c28=function(_c2d){
_c26.dataErrorEvent.fire(_c26,_c22,_c21,YAHOO.widget.DS_XHR.ERROR_DATAXHR);
DA.util.unlock("incSearch");
return;
};
_c29={success:_c27,failure:_c28};
if(!isNaN(this.connTimeout)&&this.connTimeout>0){
_c29.timeout=this.connTimeout;
}
if(this._oConn){
this.connMgr.abort(this._oConn);
}
_c26._oConn=this.connMgr.asyncRequest("GET",sUri,_c29,null);
}
}});
this.dataSource.scriptQueryAppend="field="+_c1f;
this.dataSource.scriptQueryParam="keyword";
},_isIgnoreKey:function(_c2e){
if((_c2e===9)||(_c2e===16)||(_c2e===17)||(_c2e>=18&&_c2e<=20)||(_c2e===27)||(_c2e>=33&&_c2e<=35)||(_c2e>=36&&_c2e<=38)||(_c2e===40)||(_c2e>=44&&_c2e<=45)){
return true;
}
return false;
},_onTextboxKeyUp:function(v,_c30){
_c30._initProps();
var _c31=v.keyCode;
_c30._nKeyCode=_c31;
var _c32=this.value;
if(_c30._isIgnoreKey(_c31)||(_c32.toLowerCase()===_c30._sCurQuery)){
return;
}else{
if(_c32.length>100){
return;
}else{
_c30.textboxKeyEvent.fire(_c30,_c31);
}
}
var _c33;
if(_c31===Event.KEY_RETURN){
if(_c30._nDelayID!==-1){
clearTimeout(_c30._nDelayID);
}
_c30._sendQuery(_c32);
}else{
if(_c30.queryDelay>0){
_c30._toggleContainer(false);
_c33=setTimeout(function(){
_c30._sendQuery(_c32);
},(_c30.queryDelay*1000));
if(_c30._nDelayID!==-1){
clearTimeout(_c30._nDelayID);
}
_c30._nDelayID=_c33;
}else{
_c30._sendQuery(_c32);
}
}
},_onTextboxKeyPress:function(v,_c35){
var _c36=v.keyCode;
_c35._cancelIntervalDetection(_c35);
var _c37=(navigator.userAgent.toLowerCase().indexOf("mac")!==-1);
if(_c37){
switch(_c36){
case 9:
if(_c35.delimChar&&(_c35._nKeyCode!==_c36)){
if(_c35._bContainerOpen){
YAHOO.util.Event.stopEvent(v);
}
}
break;
case 13:
if(_c35._nKeyCode!==_c36){
if(_c35._bContainerOpen){
YAHOO.util.Event.stopEvent(v);
}
}
break;
case 38:
case 40:
YAHOO.util.Event.stopEvent(v);
break;
default:
break;
}
}else{
if(_c36===229){
if(_c35.queryDelay>0){
_c35._onIMEDetected(_c35);
_c35._queryInterval=setInterval(function(){
_c35._onIMEDetected(_c35);
},(_c35.queryDelay*1000));
}else{
_c35._onIMEDetected(_c35);
_c35._queryInterval=setInterval(function(){
_c35._onIMEDetected(_c35);
},(500));
}
}
}
},_listController_selectItem:function(_c38){
this._bItemSelected=true;
var _c39=_c38._oResultData;
if(_c39&&_c39[1]){
if(DA.vars.ugType.bulk===_c39[1].type){
this._openBulk(_c39[1]);
}else{
this.listController.addList([_c39[1]]);
}
}
this._oTextbox.value=this._sSavedQuery?this._sSavedQuery:"";
this._cancelIntervalDetection(this);
this.itemSelectEvent.fire(this,_c38,_c39);
this._toggleContainer(false);
var _c3a=YAHOO.util.Dom.get("da_messageEditorItemGroupNameOuter");
if(this.listController.groupExists()){
this._showGroupName(_c3a);
}else{
this._hideGroupName(_c3a);
}
},_showGroupName:function(_c3b){
if(_c3b&&_c3b.style.display==="none"){
_c3b.style.display="";
}
},_hideGroupName:function(_c3c){
if(_c3c&&_c3c.style.display===""){
_c3c.style.display="none";
}
},doBeforeExpandContainer:function(_c3d,_c3e,_c3f,_c40){
var _c41=_c40?_c40.length:0;
_c3e._oConte