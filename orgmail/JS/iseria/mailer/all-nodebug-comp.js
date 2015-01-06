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
var _2e=DA.mailer.util.getOperationFlag();
if((_2e!==""&&_2e.indexOf(OrgMailer.vars.org_mail_gid.toString())<0)||this.existsLock(_2d)){
return false;
}else{
_2e+=OrgMailer.vars.org_mail_gid.toString()+_2d;
DA.mailer.util.setOperationFlag(_2e);
this.lockData[_2d]=true;
return true;
}
},unlock:function(_2f){
var _30=DA.mailer.util.getOperationFlag();
var reg=null;
if(_30!==""&&_30.indexOf(OrgMailer.vars.org_mail_gid.toString()+_2f)>=0){
reg=new RegExp(OrgMailer.vars.org_mail_gid.toString()+_2f,"g");
DA.mailer.util.setOperationFlag(_30.replace(reg,""));
DA.mailer.util.setOperationWarnedFlag("");
}
delete this.lockData[_2f];
return true;
},existsLock:function(_32){
if(this.lockData[_32]){
return true;
}else{
return false;
}
},pack:function(_33){
var i,p="",s="";
for(i=0;i<_33.length;i++){
p+=_33.charAt(i);
if(p.length===2){
s+=String.fromCharCode(parseInt(p,16));
p="";
}
}
return s;
},unpack:function(_37){
var i,s="";
for(i=0;i<_37.length;i++){
s+=parseInt(_37.charCodeAt(i),10).toString(16);
}
return s;
},setUrl:function(url){
var _3b=DA.vars.check_key_url;
if(DA.util.isEmpty(_3b)){
return url;
}else{
if(url.match(/\?/)){
return url+_3b;
}else{
return url+_3b.replace(/^&/,"?");
}
}
},parseJson:function(_3c){
try{
return eval("("+_3c+")");
}
catch(e){
return undefined;
}
},parseQuery:function(qs){
var url=(DA.util.isEmpty(qs))?location.href:qs;
var tmp=url.split("?");
var _40=(tmp.length>1)?tmp[1].split("&"):[];
var _41=[];
var _42={};
for(var i=0;i<_40.length;i++){
_41=_40[i].split("=");
_42[_41[0]]=_41[1];
}
return _42;
},makeXml:function(_44,_45){
var k;
var xml="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"+((DA.util.isEmpty(_45))?"":"<"+_45+">\n");
for(k in _44){
xml+=DA.util._object2xml(_44[k],k);
}
xml+=((DA.util.isEmpty(_45))?"":"</"+_45+">\n")+"</xml>\n";
return xml;
},_object2xml:function(_48,key){
var k,xml="";
if(DA.util.isFunction(_48)){
xml="";
}else{
if(DA.util.isString(_48)){
xml="<"+key+">"+((DA.util.isEmpty(_48))?"":DA.util.encode(_48))+"</"+key+">\n";
}else{
if(DA.util.isNumber(_48)){
xml="<"+key+">"+((DA.util.isEmpty(_48.toString()))?"":_48.toString())+"</"+key+">\n";
}else{
if(DA.util.isArray(_48)){
_48.map(function(o){
xml+=DA.util._object2xml(o,key);
});
}else{
xml="<"+key+">";
for(k in _48){
xml+=DA.util._object2xml(_48[k],k);
}
xml+="</"+key+">\n";
}
}
}
}
return xml;
},getTime:function(){
var _4d=new Date();
return _4d.getTime();
},time_diff:function(_4e,end){
return (end?end.getTime():new Date().getTime())-_4e.getTime();
},slowdown:function(f,_51){
_51=_51?_51:1000;
var _52=new Date().getTime();
var _53=[];
var _54;
function dolater(){
f.call(_53);
}
return function(){
var now=new Date().getTime();
if((now-_52)>_51){
_52=now;
f.call(arguments);
}else{
clearTimeout(_54);
_53=arguments;
_54=setTimeout(dolater,_51);
}
};
},onlyonce:function(_56,f,_58){
var _59=[];
var _5a=function(){
f.apply(_56,_59);
};
var to;
return function(){
clearTimeout(to);
_59=arguments;
to=setTimeout(_5a,_58);
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
},toPercentages:function(_60){
if(!_60){
return [];
}
var _61=_60.inject(0,DA.util._add);
return _60.map(function(n){
return (n/_61)*100;
});
},_add:function(a,b){
return a+b;
},disableKey:function(key){
if(key==="backspace"){
YAHOO.util.Event.addListener(window.document,"keydown",function(){
var _66=YAHOO.util.Event.getTarget(event);
if(YAHOO.util.Event.getCharCode(event)===Event.KEY_BACKSPACE&&(_66.type!=="text")&&(_66.type!=="textarea")&&(_66.type!=="file")){
return false;
}
return true;
},window.document,true);
}
},jsubstr4attach:function(str,_68){
var len,_6a,_6b,res,n,t;
len=_68||DA.vars.config.attachment_length;
if(len==="none"){
return str;
}
if(len===null){
len=15;
}
_6a=parseInt((len-3)/2,10);
_6b=str.length;
if(_6b>len){
if(str.match(/(.*)\.([\w\d]+)/g)){
n=RegExp.$1;
t=RegExp.$2;
res=n.substring(0,_6a)+"..."+n.substr(n.length-_6a,_6a)+"."+t;
}else{
res=str.substring(0,_6a)+"..."+str.substr(_6b-_6a,_6a);
}
return res;
}else{
return str;
}
},getSessionId:function(){
var _6f=document.cookie;
var _70=_6f.split(/\;\s*/);
var i,kv,_73;
for(i=0;i<_70.length;i++){
kv=_70[i].split(/\=/);
if(kv[0]===DA.vars.sessionKey){
_73=kv[1];
}
}
return _73;
},getServer:function(){
var _74;
if(location.href.match(/^(http[s]*\:\/\/[^\/]+)/)){
_74=RegExp.$1;
}
return _74;
}};
DA.time={GetTime:function(){
var _75=new Date();
var _76=_75.getTime();
delete _75;
return _76;
},DiffTime:function(t1,t2){
var _79=t2-t1;
return _79;
}};
DA.customEvent={set:function(_7a,_7b){
if(_7b){
this.events[_7a]=_7b;
}
},fire:function(_7c,me,_7e){
if(this.events[_7c]){
this.events[_7c](me,_7e);
}
},events:{}};
var FCKEditorIframeController={createIframe:function(_7f,_80){
var _81=document.createElement("iframe");
_81.setAttribute("id",_7f);
_81.setAttribute("width","100%");
_81.setAttribute("height","100%");
_81.setAttribute("frameborder",0);
_80.innerHTML="";
_80.appendChild(_81);
},removeIframe:function(_82,_83){
var _84=YAHOO.util.Dom.get(_82);
if(_84){
this.setIframeBody(_82,"");
_83.removeChild(_84);
}
},setIframeBody:function(_85,_86){
var _87=YAHOO.util.Dom.get(_85);
var doc;
if(_87){
if(BrowserDetect.browser==="Explorer"){
doc=_87.contentWindow.document;
}else{
doc=_87.contentDocument;
}
doc.open();
doc.writeln(_86);
doc.close();
}
},isFCKeditorData:function(_89){
var _8a=/^<\!-- Created by DA_Richtext .*? end default style -->/;
return _8a.test(_89);
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
},_name:function(_8c){
if(DA.util.isEmpty(_8c)){
return "";
}else{
return DA.vars.mid+"_"+_8c;
}
},_width:function(_8d){
if(DA.util.isEmpty(_8d)){
return 800;
}else{
return _8d;
}
},_height:function(_8e){
if(DA.util.isEmpty(_8e)){
return 600;
}else{
return _8e;
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
},winOpen:function(url,_96,_97,_98){
var _99="width="+this._width(_97)+",height="+this._height(_98)+",resizable=yes,scrollbars=yes,location=yes"+",menubar=yes,toolbar=yes,statusbar=yes";
var win=window.open(this._url(url),this._name(_96),_99);
win.moveTo(this.getX(win.opener)+10,this.getY(win.opener)+10);
win.focus();
this.data[this.data.length]=win;
return win;
},winOpenNoBar:function(url,_9c,_9d,_9e,flg){
var win;
var _a1="width="+this._width(_9d)+",height="+this._height(_9e)+",resizable=yes,scrollbars=no,location=no"+",menubar=no,toolbar=no,statusbar=no";
if(DA.vars.config.download_type==="simple"&&flg===1){
win=window.open(this._url(url),"_self",_a1);
}else{
win=window.open(this._url(url),this._name(_9c),_a1);
win.moveTo(this.getX(win.opener)+10,this.getY(win.opener)+10);
win.focus();
this.data[this.data.length]=win;
}
return win;
},winOpenCustom:function(url,_a3,_a4){
var win=window.open(this._url(url),this._name(_a3),_a4);
win.moveTo(this.getX(win.opener)+10,this.getY(win.opener)+10);
win.focus();
this.data[this.data.length]=win;
return win;
},isePopup:function(_a6,_a7,_a8,_a9,no,_ab,_ac,_ad){
var _ae="width="+_a8+",height="+_a9+",resizable=yes";
var Url=DA.vars.cgiRdir+"/pop_up.cgi?proc="+_a6+"&title="+_a7;
var _b0,_b1,_b2,_b3;
if(!_ab){
_b1=_a7.indexOf(".gif");
_b2=_a7.substring(0,_b1);
_b3=_b2+no;
_b0=this.winOpenCustom(Url,_b3,_ae);
}else{
_b0=this.winOpenCustom(Url,"",_ae);
}
if(!DA.util.isEmpty(_ac)&&!DA.util.isEmpty(_ad)){
_b0.moveTo(_ac,_ad);
}
_b0.focus();
},allClose:function(_b4){
if(!DA.util.isObject(_b4)){
_b4=window;
}
for(var i=0;i<this.data.length;i++){
if(this.data[i]){
try{
if(_b4===this.data[i]){
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
DA.imageLoader={tag:function(_b6,_b7,obj){
var _b9=new Image();
_b9.src=_b6;
var src=(DA.util.isEmpty(_b6))?"":" src=\""+DA.util.escape(_b6)+"\"";
var alt=(DA.util.isEmpty(_b7))?"":" alt=\""+DA.util.escape(_b7)+"\"";
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
delete _b9;
return tag;
},nullTag:function(x,y){
return this.tag(DA.vars.imgRdir+"/null.gif","",{width:(DA.util.isEmpty(x))?1:x,height:(DA.util.isEmpty(y))?1:y});
}};
DA.dom={createDiv:function(id){
var _c2=document.body;
var div=document.createElement("div");
div.id=id;
_c2.insertBefore(div,_c2.firstChild);
var _c4=YAHOO.util.Dom.get(id);
return _c4;
},id2node:function(obj){
if(DA.util.isString(obj)){
return YAHOO.util.Dom.get(obj);
}else{
return obj;
}
},left:function(obj){
var _c7=this.id2node(obj);
return _c7.offsetLeft;
},top:function(obj){
var _c9=this.id2node(obj);
return _c9.offsetTop;
},width:function(obj){
var _cb=this.id2node(obj);
return _cb.offsetWidth;
},height:function(obj){
var _cd=this.id2node(obj);
return _cd.offsetHeight;
},size:function(obj,_cf,_d0){
var _d1=this.id2node(obj);
this.sizeWidth(_cf);
this.sizeHeight(_d0);
},sizeWidth:function(obj,_d3){
var _d4=this.id2node(obj);
_d4.style.width=_d3+"px";
},sizeHeight:function(obj,_d6){
var _d7=this.id2node(obj);
_d7.style.height=_d6+"px";
},position:function(obj,x,y){
var _db=this.id2node(obj);
this.positionX(obj,x);
this.positionY(obj,y);
},positionX:function(obj,x){
var _de=this.id2node(obj);
_de.style.left=x+"px";
},positionY:function(obj,y){
var _e1=this.id2node(obj);
_e1.style.top=y+"px";
},adjustPosition:function(obj){
var _e3=this.id2node(obj);
var _e4=YAHOO.util.Dom.getViewportWidth();
var _e5=YAHOO.util.Dom.getViewportHeight();
var _e6=this.width(_e3);
var _e7=this.height(_e3);
var _e8=this.left(_e3);
var _e9=this.top(_e3);
var x,y;
if(_e8+_e6>_e4){
x=_e8+_e4-(_e8+_e6)-10;
if(x<0){
x=0;
}
}else{
x=_e8;
}
if(_e9+_e7>_e5){
y=_e9+_e5-(_e9+_e7)-30;
if(y<0){
y=0;
}
}else{
y=_e9;
}
this.position(_e3,x,y);
},textAreaValue:function(obj){
var _ed=this.id2node(obj);
return _ed.value;
},textValue:function(obj){
var _ef=this.id2node(obj);
return _ef.value;
},fileValue:function(obj){
var _f1=this.id2node(obj);
return _f1.value;
},hiddenValue:function(obj){
var _f3=this.id2node(obj);
return _f3.value;
},selectValue:function(obj){
var _f5=this.id2node(obj);
return _f5.value;
},radioValue:function(_f6){
var _f7=null;
var _f8=document.getElementsByName(_f6);
for(var i=0;i<_f8.length;++i){
if(_f8[i].checked){
_f7=_f8[i].value;
break;
}
}
return _f7;
},checkedOk:function(obj){
var _fb=this.id2node(obj);
return _fb.checked;
},changeValue:function(obj,_fd){
var _fe=this.id2node(obj);
_fe.value=(DA.util.isEmpty(_fd))?"":_fd;
},changeSelectedIndex:function(obj,_100){
var node=this.id2node(obj);
var _102=(DA.util.isNumber(_100))?String(_100):_100;
var i;
for(i=0;i<node.childNodes.length;i++){
if(node.childNodes[i].value&&node.childNodes[i].value===_102){
node.selectedIndex=node.childNodes[i].index;
break;
}
}
},changeChecked:function(obj,_105){
var node=this.id2node(obj);
node.checked=(DA.util.isEmpty(_105))?false:_105;
},findParent:function(node,_108,_109){
if(!node||!node.tagName||!_108){
return null;
}
if(!_109){
_109=3;
}
var test=typeof _108==="function"?_108:function(n){
return _108===n.tagName.toUpperCase();
};
var _10c=0;
if(test(node)){
return node;
}
do{
_10c++;
if(test(node)){
return node;
}
}while((node=node.parentNode)&&node.tagName&&(_10c<_109));
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
var _10f=document.styleSheets[0];
var IE=function(_111,_112){
_10f.addRule(_111,_112);
};
var W3C=function(_114,_115){
_10f.insertRule(_114+" {"+_115+";}",0);
};
var _116=function(){
};
return _10f.addRule?IE:_10f.insertRule?W3C:_116;
})()};
DA.tip={tipNode:[],open:function(id,_118,_119,_11a,_11b){
var i,list="";
var len=_119.length;
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
list+=["<tr><td style=\"\" onmouseout=\"this.parentNode.style.backgroudColor='red';\" onmouseover=\"this.parentNode.style.backgroudColor='black';\" onclick=\"var clickedDom = document.getElementById('"+_11b+"'); clickedDom.innerHTML='"+_119[i]+"';DA.tip.close('DASpellCheckList')\" nowrap><font color=\"#000000\">",_119[i],"</font></td></tr>"].join("");
}
var html=["<table border=\"0\" width=\"150\" cellspacing=\"0\" cellpadding=\"0\">","<tr>","  <td width=\"100%\" bgcolor=\"#000000\">","  <table border=\"0\" width=\"100%\" cellspacing=\"1\" cellpadding=\"0\">","  <tr>","    <td width=\"100%\" bgcolor=\"#FFFFE0\" nowrap>","      <font color=\"#000000\">",_118,"</font>","    </td>","  </tr>","  <tr>","    <td width=\"100%\" bgcolor=\"#FFFFE0\">","    <table border=\"0\" cellspacing=\"1\">",list,"</table>","    </td>","  </tr>","  </table>","  </td>","</tr>","</table>"].join("\n");
node.innerHTML=html;
DA.shim.open(node);
node.style.visibility="";
var x=YAHOO.util.Event.getPageX(_11a);
x+=5;
var y=YAHOO.util.Event.getPageY(_11a);
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
var _12f=menu.offsetWidth;
var _130=menu.offsetHeight;
shim.style.width=_12f;
shim.style.height=_130;
shim.style.top=menu.style.top;
shim.style.left=menu.style.left;
shim.style.zIndex=menu.style.zIndex-1;
shim.style.position="absolute";
shim.style.display="block";
var _131;
if(shim.style.top===""||shim.style.left===""){
_131=this._cumulativeOffset(menu);
shim.style.top=_131[1];
shim.style.left=_131[0];
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
},_cumulativeOffset:function(_138){
var _139=0,_13a=0;
do{
_139+=_138.offsetTop||0;
_13a+=_138.offsetLeft||0;
_138=_138.offsetParent;
}while(_138);
return [_13a,_139];
}};
if(YAHOO&&YAHOO.widget&&YAHOO.widget.Node){
YAHOO.widget.Node.prototype.getToggleLink=function(){
return "DA.util.getTreeViewToggle('"+this.tree.id+"',"+this.index+")";
};
DA.util.getTreeViewToggle=function(id,_13c){
YAHOO.widget.TreeView.getNode(id,_13c).toggle();
};
}
if(BrowserDetect.browser==="Explorer"&&typeof (window.opener)==="object"&&typeof (window.opener.DA)==="object"&&typeof (window.opener.DA.session)==="object"){
DA.session=window.opener.DA.session;
}else{
if(BrowserDetect.browser!=="Explorer"&&window.opener&&window.opener.DA&&window.opener.DA.session){
DA.session=window.opener.DA.session;
}else{
(function(){
var _13d=$H({});
var _13e=$H({});
function _getStateInfo(w){
if("function"!==typeof w.getUIStateInfo){
return;
}
return w.getUIStateInfo();
}
DA.session={Values:{registerValue:function(name,_141){
_13e[name]=_141;
},getValue:function(name){
return _13e[name];
}},UIState:{registerWidget:function(name,_144){
_13d[name]=_144;
},getStateInfo:function(name){
var w=_13d[name];
if(!w){
return;
}
return _getStateInfo(w);
},getAllStateInfo:function(){
return _13d.map(function(ent){
return {name:ent.key,info:_getStateInfo(ent.value)};
});
}}};
})();
}
}
YAHOO.util.Event.on(window,"load",function(){
function getResizingElem(){
var _148=document.getElementById("da_outermost");
if(!_148){
_148=document.createElement("div");
_148.id="da_outermost";
DA.dom.moveAllChildren(document.body,_148);
document.body.insertBefore(_148,document.body.firstChild);
Object.extend(_148.style,{height:"100%",width:"100%",margin:"0px",padding:"0px"});
}
return _148;
}
var _149=DA.windowController.onGentleResize;
if(BrowserDetect.browser==="Explorer"){
YAHOO.util.Event.on(getResizingElem(),"resize",DA.util.onlyonce(_149,_149.fire,50));
}else{
YAHOO.util.Event.on(window,"resize",_149.fire,_149,true);
}
});
DA.init=function(_14a){
if(DA.waiting&&"function"===typeof DA.waiting.init){
DA.waiting.init();
}
if(_14a&&BrowserDetect.browser==="Explorer"){
YAHOO.util.Event.addListener(window.document,"keydown",function(e){
var _14c;
if(BrowserDetect.browser==="Explorer"){
e=window.event;
_14c=e.srcElement.type;
}else{
_14c=e.target.type;
}
if(_14c==="text"||_14c==="textarea"){
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
var _14d=function(a,b){
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
this._pendingRemoval.keys().sort(_14d).each(function(n){
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
DA.widget.PanelMenuController=function(_154,_155){
this.menuId=_154.id;
this.menuNode=_154;
this.menuData=_155;
if(DA.util.isEmpty(_155.className)){
this.className="da_panelMenu";
}else{
this.className=_155.className;
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
var _159="";
var _15a=[];
var _15b=[];
for(i=0;i<this.menuData.leftOrder.length;i++){
left+=this._menuItem(this.menuData.leftOrder[i]);
if(!this._visibleOk(this.menuData.leftOrder[i])){
_15a.push(this.menuData.leftOrder[i]);
}
if(!this._enableOk(this.menuData.leftOrder[i])){
_15b.push(this.menuData.leftOrder[i]);
}
}
for(i=0;i<this.menuData.rightOrder.length;i++){
_159+=this._menuItem(this.menuData.rightOrder[i]);
if(!this._visibleOk(this.menuData.rightOrder[i])){
_15a.push(this.menuData.rightOrder[i]);
}
if(!this._enableOk(this.menuData.rightOrder[i])){
_15b.push(this.menuData.rightOrder[i]);
}
}
this.menuLeftNode.innerHTML=left;
this.menuRightNode.innerHTML=_159;
DA.customEvent.fire("PanelMenuControllerInitAfter",this,{hides:_15a,disables:_15b});
for(i=0;i<_15a.length;i++){
this.hide(_15a[i]);
}
for(i=0;i<_15b.length;i++){
this.disable(_15b[i]);
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
var _18a=this._title(func);
var _18b=DA.imageLoader.tag(this._smallIcon(func),this._alt(func),{id:this._func2id(func,"i")});
var _18c=(this._pulldownOk(func))?DA.imageLoader.tag(DA.vars.imgRdir+"/ico_mail_arrow.gif","",{id:this._func2id(func,"a")}):"";
var _18d=(this._pulldownOk(func))?"":this.className+"ItemNoPointer";
var item="<div id=\""+this._func2id(func)+"\" class=\""+this._className(func)+"\">"+"<div id=\""+this._func2id(func,"t")+"\" class=\""+this._className(func)+"Top\">"+DA.util.encode(_18a)+"</div>"+"<div id=\""+this._func2id(func,"m")+"\" class=\""+this._className(func)+"Middle\">"+_18b+"</div>"+"<div id=\""+this._func2id(func,"b")+"\" class=\""+this._className(func)+"Bottom\">"+_18c+"</div>"+"</div>";
var me=this;
if(this._pulldownOk(func)){
if(this._selectOk(func)){
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseover",this._mouseover,this,true);
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseout",this._mouseout,this,true);
YAHOO.util.Event.addListener(this._func2id(func,"i"),"click",this._click,this,true);
this.menuData.items[func].pulldownMenu=new DA.widget.PulldownMenuController(this._func2id(func,"p"),this._func2id(func,"b"),this._pulldown(func),{onTrigger:function(e){
var _191=YAHOO.util.Event.getTarget(e);
return _191&&(DA.util.match(_191.id,me._func2id(func,"b"))||DA.util.match(_191.id,me._func2id(func,"a")));
}});
}else{
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseover",this._mouseover,this,true);
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseout",this._mouseout,this,true);
this.menuData.items[func].pulldownMenu=new DA.widget.PulldownMenuController(this._func2id(func,"p"),this._func2id(func),this._pulldown(func),{onTrigger:function(e){
var _193=YAHOO.util.Event.getTarget(e);
return _193&&DA.util.match(_193.id,me._func2id(func));
}});
}
}else{
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseover",this._mouseover,this,true);
YAHOO.util.Event.addListener(this._func2id(func,"i"),"mouseout",this._mouseout,this,true);
YAHOO.util.Event.addListener(this._func2id(func,"i"),"click",this._click,this,true);
}
return item;
}};
DA.widget.ThreePane=function(_194){
function setFirstClass(div,_196){
if(!div){
return;
}
var _197;
if(div.className){
_197=div.className.split(" ");
_197=_197.without(_196);
div.className=_196+" "+_197.join(" ");
}else{
div.className=_196;
}
}
if(_194){
Object.extend(this,_194);
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
var _198=YAHOO.util.Dom.get(this.dragElId);
if(!_198){
_198=document.createElement("div");
_198.id=this.dragElId;
document.body.insertBefore(_198,document.body.firstChild);
}
var _199={maintainOffset:true,dragElId:this.dragElId};
var me=this;
this.vdd=new YAHOO.util.DDProxy(this.vDivider,"vdd",_199);
this.hdd=new YAHOO.util.DDProxy(this.hDivider,"hdd",_199);
var _19b=this.leftPane;
var _19c=this.rightPane;
var _19d=this.rightTopPane;
var _19e=this.rightBottomPane;
var _19f=100-(((_19d.offsetHeight+this.hDivider.offsetHeight)/this.rightPane.offsetHeight)*100);
_19e.style.height=_19f+"%";
var DOM=YAHOO.util.Dom;
var _1a1=_19b.offsetWidth;
var _1a2=_19c.offsetWidth;
var _1a3=0;
this.vdd.onMouseDown=function(e){
_1a1=_19b.offsetWidth;
_1a2=_19c.offsetWidth;
_1a3=YAHOO.util.Event.getPageX(e);
this.setInitPosition();
this.setXConstraint(_19b.offsetWidth-100,me.rightPane.offsetWidth-100);
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
var _1aa=curX-_1a3;
var _1ab=Math.max((_1a1+_1aa),10);
var _1ac=Math.max((_1a2-_1aa),10);
var _1ad=me.vDivider.offsetWidth;
var _1ae=_1a1+_1a2+_1ad;
var _1af=Math.max(((_1ab/_1ae)*100),1);
var _1b0=Math.max(((_1ac/_1ae)*100),1);
var _1b1=(_1ad/_1ae)*100;
var _1b2=(_1af+_1b0+_1b1)-100;
_1b0-=_1b2;
_19b.style.width=_1af+"%";
me.vDivider.style.width=(100-(_1af+_1b0))+"%";
_19c.style.width=_1b0+"%";
me.vDivider.style.left=_1af+"%";
me.onXResized(_19b,_19d,_19e);
me.hdd.resetConstraints();
};
var _1b3=_19d.offsetHeight;
var _1b4=_19e.offsetHeight;
var _1b5=0;
this.hdd.onMouseDown=function(e){
_1b3=_19d.offsetHeight;
_1b4=_19e.offsetHeight;
_1b5=YAHOO.util.Event.getPageY(e);
this.setInitPosition();
this.setYConstraint(_1b3-50,_1b4-50);
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
var _1bc=curY-_1b5;
var _1bd=Math.max((_1b3+_1bc),10);
var _1be=Math.max((_1b4-_1bc),10);
var _1bf=_1b3+_1b4+me.hDivider.offsetHeight;
var _1c0=(_1bd/_1bf)*100;
var _1c1=(_1be/_1bf)*100;
_19d.style.height=_1c0+"%";
_19e.style.height=_1c1+"%";
me.onYResized(_19b,_19d,_19e);
};
},_toGracefulPercs:function(dim,full){
var _1c4;
if(typeof dim==="string"&&dim.charAt(dim.length-1)==="%"){
_1c4=parseFloat(dim.substr(0,dim.length-1),10);
}else{
_1c4=(parseFloat(dim,10)/full)*100;
}
_1c4=Math.max(_1c4,5);
_1c4=Math.min(_1c4,95);
return _1c4;
},_setLRWidth:function(key,w){
if(!key){
return;
}
var _1c7=key==="left"?"right":(key==="right"?"left":null);
if(!_1c7){
return;
}
var _1c8=this.leftPane.offsetWidth+this.rightPane.offsetWidth+this.vDivider.offsetWidth;
var _1c9=this._toGracefulPercs(w,_1c8);
if(!YAHOO.lang.isNumber(_1c9)){
return;
}
var _1ca=(this.vDivider.offsetWidth/_1c8)*100;
var _1cb=100-(_1c9+_1ca);
this[key+"Pane"].style.width=_1c9+"%";
this[_1c7+"Pane"].style.width=_1cb+"%";
this.vDivider.style.left=_1c9+"%";
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
var _1d0=key==="rightTop"?"rightBottom":(key==="rightBottom"?"rightTop":null);
if(!_1d0){
return;
}
var _1d1=this.rightTopPane.offsetHeight+this.rightBottomPane.offsetHeight+this.hDivider.offsetHeight;
var _1d2=this._toGracefulPercs(h,_1d1);
if(!YAHOO.lang.isNumber(_1d2)){
return;
}
var _1d3=(this.hDivider.offsetHeight/_1d1)*100;
var _1d4=100-(_1d2+_1d3);
this[key+"Pane"].style.height=_1d2+"%";
this[_1d0+"Pane"].style.height=_1d4+"%";
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
var _1d7=DA.vars?(DA.vars.clrRdir):null;
DA.widget.Panel=function(id,_1d9){
$H({".da_panel div.left-edge":"mf_l_c.gif",".da_panel div.right-edge":"mf_r.gif",".da_panel div.top-left":"mf_head_l.gif",".da_panel div.top-right-edge":"mf_head_r.gif",".da_panel div.bottom-edge-left":"mf_l_b.gif",".da_panel div.bottom-edge-right-tip":"mf_r_b.gif",".da_panel div.top-edge-left":"mf_l_t.gif",".da_panel div.top-edge-right-tip":"mf_r_t.gif"}).each(function(_1da){
var _1db=_1da.key;
var _1dc=_1da.value;
var rule=_1d7?"background-image: url("+_1d7+"/"+_1dc+")":"border : 1px solid #aaa";
DA.dom.createCSSRule(_1db,rule);
});
this.config=Object.extend({titleBar:true},_1d9||{});
this.init(id);
};
function div(_1de){
var el=document.createElement("div");
if(_1de){
$H(_1de).each(function(attr){
var key=attr.key;
var val=attr.value;
if(key==="class"||key==="className"){
el.className=val;
}else{
el.setAttribute(key,val);
}
});
}
var _1e3=[];
if(arguments.length===2){
if(arguments[1].constructor===Array){
_1e3=arguments[1];
}else{
_1e3.push(arguments[1]);
}
}else{
if(arguments.length>2){
_1e3=$A(arguments);
_1e3.shift();
}
}
if(_1e3&&_1e3.each){
_1e3.each(function(_1e4){
if("string"===typeof _1e4){
el.appendChild(document.createTextNode(_1e4));
}else{
if(_1e4.tagName){
el.appendChild(_1e4);
}
}
});
}
return el;
}
var _1e5={panelBottom:div({className:"bottom-edge-left"},div({className:"bottom-edge-right-tip"}))};
DA.widget.Panel.prototype={titleNode:null,topRightNode:null,init:function(_1e6){
var id=_1e6?_1e6:"da_panel_"+(new Date()).getTime();
this.contentsNode=div({className:"contents"});
var _1e8;
if(this.config.titleBar){
this.titleNode=div({className:"useful"});
this.topRightNode=this.titleNode.cloneNode(true);
_1e8=div({className:"top-left"},div({className:"top-right-edge"}),div({className:"top-right"},this.topRightNode),this.titleNode);
}else{
_1e8=div({className:"top-edge-left"},div({className:"top-edge-right-tip"}));
}
var _1e9=_1e5.panelBottom.cloneNode(true);
var _1ea=div({className:"middle"},div({className:"left-edge"},div({className:"right-edge"},this.contentsNode)));
this.node=div({id:id,className:"da_panel"},_1e8,_1ea,_1e9);
this._topNode=_1e8;
this._middleNode=_1ea;
this._bottomNode=_1e9;
YAHOO.util.Event.on(window,"resize",this.fixHeights,this,true);
},fixHeights:function(){
var _1eb=this.node.parentNode?this.node.parentNode:this.node;
var _1ec=_1eb.offsetHeight;
if(_1ec<=0){
return;
}
var _1ed=this._topNode.offsetHeight+this._bottomNode.offsetHeight;
var _1ee=(_1ec-_1ed)-1;
_1ee=Math.max(_1ee,0);
this._middleNode.style.height=((_1ee/_1ec)*100)+"%";
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
DA.file={list2String:function(_1f8,cols,max){
var i,l,f;
var _1fe="";
var _1ff;
if(DA.util.isEmpty(cols)){
cols=3;
}
if(_1f8){
if(_1f8.length>=2&&DA.vars.config.soft_install===1){
_1ff=_1f8[0].link.replace(/(.;)/g,", 'all'$1");
_1fe+="<span style=\"white-space: nowrap;\" id=\"down_all_button\" >"+"<span style=\"float:right;white-space: nowrap;\" onclick=\""+_1ff+""+"\" class=\"da_fileInformationListLink\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_download_all.gif","",{width:80,height:15,border:0})+"</span></span>";
_1fe+="<span style=\"white-space: nowrap;\" id=\"save_all_button\" >"+"<span style=\"float:right;white-space: nowrap;\" onclick = \"window.__messageViewer.showsaveattachestolibdialog(event.clientX, event.clientY);\""+"\" class=\"da_fileInformationListLink\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_library_save.gif","",{width:80,height:15,border:0})+"</span></span>";
}
for(i=0;i<_1f8.length;i++){
l="";
f=_1f8[i];
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
_1fe+="<span style=\"white-space: nowrap;\">"+l+"&nbsp;<b>..</b></span>\n";
break;
}else{
_1fe+="<span style=\"white-space: nowrap;\">"+l+"&nbsp;</span>\n";
}
if(cols>0&&(i+1)%cols===0){
_1fe+="<br>";
}
}
}
}
return _1fe;
},object2String:function(f,icon,link,_203){
var _204=DA.util.encode(f.name);
if(!DA.util.isEmpty(f.link)&&link){
_204="<span onclick=\""+f.link+"\" class=\"da_fileInformationListLink\" title=\""+f.title+"\">"+_204+"</span>";
}
if(!DA.util.isEmpty(f.icon)&&icon){
_204=DA.imageLoader.tag(f.icon,f.alt,{align:"absmiddle"})+_204;
}
if(!DA.util.isEmpty(f.document)&&_203){
_204+="<span onclick=\""+f.document+"\" class=\"da_fileInformationListLink\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/ico_fc_docsave.gif","",{align:"absmiddle"})+"</span>";
}
return _204;
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
DA.file.InformationListController=function(node,_225,_226,cfg){
this.fileNode=node;
if(_226){
if(DA.util.isFunction(_226.onRemove)){
this.onRemove=_226.onRemove;
}
if(DA.util.isFunction(_226.onPopup)){
this.onPopup=_226.onPopup;
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
this.init(_225);
};
DA.file.InformationListController.prototype={fileNode:null,fileData:null,fileNdata:null,onRemove:Prototype.emptyFunction,onPopup:Prototype.emptyFunction,maxView:0,lineHeight:0,totalSize:0,documentEnabled:false,popupEnabled:false,deleteEnabled:true,init:function(_228){
this.fileNode.style.display="none";
this.fileData={};
this.fileNdata={};
this.addList(_228);
},add:function(f,_22a,perf){
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
if(!_22a){
this.resize();
this.scroll();
}
},addList:function(_22f,perf){
var i;
if(perf===true){
this.ugNode.style.display="none";
}
if(_22f){
for(i=0;i<_22f.length;i++){
this.add(_22f[i],true,perf);
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
var key,_23c=0;
for(key in this.fileData){
if(!DA.util.isFunction(this.fileData[key])){
_23c++;
}
}
return _23c;
},total:function(){
var _23d=this.count();
if(_23d>0){
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
var _23e;
var _23f=0;
if(this.maxView>0){
_23e=this.count();
if(_23e>0){
if(this.fileNode.firstChild){
_23f=this.fileNode.firstChild.offsetHeight;
}
if(this.lineHeight>_23f){
_23f=this.lineHeight;
}
if(_23e>this.maxView){
YAHOO.util.Dom.addClass(this.fileNode,"da_fileInformationListOverflowAuto");
DA.dom.sizeHeight(this.fileNode,_23f*this.maxView);
}else{
YAHOO.util.Dom.removeClass(this.fileNode,"da_fileInformationListOverflowAuto");
DA.dom.sizeHeight(this.fileNode,_23f*_23e);
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
},title:function(aid,_24e){
var l=this.fileData[aid];
if(DA.util.isEmpty(_24e)){
l.title="";
}else{
l.title=_24e;
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
},document:function(aid,_25a){
var l=this.fileData[aid];
var n=this.fileNdata[aid];
if(DA.util.isEmpty(_25a)||!this.documentEnabled){
l.document="";
n.documentNode.innerHTML="";
n.documentNode.onclick=Prototype.emptyFunction;
n.documentNode.style.display="none";
}else{
l.document=_25a;
n.documentNode.innerHTML=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_fc_docsave.gif","",{"class":"da_fileInformationListDocument"});
n.documentNode.onclick=function(){
eval(_25a);
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
DA.widget.Dialog=function(_268,hash,_26a,_26b){
this.nodeId=_268;
this.buttons=_26a;
this.setWidth(hash.width);
this.setHead(hash.head);
this.setBody(hash.body);
this.setCbhash(_26b);
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
},setWidth:function(_272){
this.width=_272;
},setCbhash:function(_273){
if(DA.util.isFunction(_273.onEnter)){
this.onEnter=_273.onEnter;
}
if(DA.util.isFunction(_273.onCancel)){
this.onCancel=_273.onCancel;
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
DA.widget.MessageDialog=function(_27a,_27b,_27c,_27d){
this.nodeId=_27a;
this.setHead(_27b);
this.setBody(_27c);
this.setCbhash(_27d);
this.setDialog();
this.setListener();
};
Object.extend(DA.widget.MessageDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.MessageDialog.prototype.setHead=function(_27e){
this.head=DA.util.encode(_27e);
};
DA.widget.MessageDialog.prototype.setBody=function(_27f){
_27f=(DA.util.isEmpty(_27f))?"":_27f;
this.body=DA.util.encode(_27f)+"<input type=button id=\""+this.childId("ok")+"\" class=\""+this.childClass("ok")+"\" value=\""+DA.locale.GetText.t_("DIALOG_OK_BUTTON")+"\">";
};
DA.widget.MessageDialog.prototype.setListener=function(){
YAHOO.util.Event.addListener(this.childId("ok"),"click",this._enter,this,true);
};
DA.widget.StringChangerDialog=function(_280,_281,_282,_283){
this.nodeId=_280;
this.setHead(_281);
this.setBody(_282);
this.setCbhash(_283);
this.setDialog();
this.setListener();
};
Object.extend(DA.widget.StringChangerDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.StringChangerDialog.prototype.setHead=function(_284){
this.head=DA.util.encode(_284);
};
DA.widget.StringChangerDialog.prototype.setBody=function(_285){
this.body="<input type=text id=\""+this.childId("text")+"\" class=\""+this.childClass("text")+"\" value=\""+DA.util.encode(_285)+"\">"+"<input type=button id=\""+this.childId("set")+"\" class=\""+this.childClass("set")+"\" value=\""+DA.locale.GetText.t_("DIALOG_SETTING_BUTTON")+"\">";
this.focusId=this.childId("text");
};
DA.widget.StringChangerDialog.prototype.setListener=function(){
YAHOO.util.Event.addListener(this.childId("set"),"click",this._enter,this,true);
};
DA.widget.StringChangerDialog.prototype.setString=function(_286){
var el=YAHOO.util.Dom.get(this.childId("text"));
el.value=_286;
};
DA.widget.FileUploadDialog=function(_288,_289,_28a){
this.nodeId=_288;
this.setHead(_289);
this.setBody();
this.setCbhash(_28a);
this.setDialog();
this.setListener();
};
Object.extend(DA.widget.FileUploadDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.FileUploadDialog.prototype.setHead=function(_28b){
this.head=DA.util.encode(_28b);
};
DA.widget.FileUploadDialog.prototype.setBody=function(){
this.body="<form id=\""+this.childId("form")+"\">"+"<input type=file id=\""+this.childId("file")+"\" class=\""+this.childClass("file")+"\" name=\"path\" value=\"\">"+"<input type=button id=\""+this.childId("set")+"\" class=\""+this.childClass("set")+"\" value=\""+DA.locale.GetText.t_("DIALOG_SETTING_BUTTON")+"\">"+"</form>";
this.focusId=this.childId("file");
};
DA.widget.FileUploadDialog.prototype.setListener=function(){
YAHOO.util.Event.addListener(this.childId("set"),"click",this._enter,this,true);
};
DA.widget.MaskDialog=function(_28c,_28d,_28e,_28f,from){
this.nodeId=_28c;
this.setBody(_28d,_28e,_28f,from);
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
DA.widget.MaskDialog.prototype.setBody=function(_293,_294,_295,from){
_293=(DA.util.isEmpty(_293))?"":_293;
_294=(DA.util.isEmpty(_294))?DA.vars.imgRdir+"/popy_wait.gif":_294;
var _297;
var ie6=0;
if(_295){
_294="<center><img src=\""+_294+"\"></center>";
}else{
_294="<img src=\""+_294+"\">";
}
if(BrowserDetect.browser==="Explorer"&&BrowserDetect.version===6&&from==="transmit"){
_297=["<div class=\""+this._bodyId()+"\">","<table><tr><td>"+_294+"<br></td></tr>","<tr><td><center><span style=\"font-size:20px;\">"+_293+"</span></center><br></td></tr>"];
ie6=1;
}else{
_297=["<div class=\""+this._bodyId()+"\">",_294+"<br>","<center><span>"+_293+"</span></center><br>"];
}
var i,l;
if(_295){
l=_295.length;
if(ie6===1){
_297.push("<tr><td>");
}
_297.push("<center><span>");
for(i=0;i<l;i++){
_297.push("<button id=\""+this._bodyId()+"Button"+i+"\">"+_295[i].string+"</button>");
}
_297.push("</center></span><br>");
if(ie6===1){
_297.push("</td></tr></table>");
}
}
_297.push("</div>");
this.body=_297.join("")+"";
};
DA.widget.MaskDialog.prototype.refresh=function(_29b){
this.dialog.setBody(this.body);
var i,l,el;
if(_29b){
l=_29b.length;
for(i=0;i<l;i++){
if(_29b[i].onclick){
el=YAHOO.util.Dom.get(this._bodyId()+"Button"+i);
el.onclick=_29b[i].onclick;
}
}
}
};
DA.waiting={wtDialog:null,init:function(){
this.wtDialog=new DA.widget.MaskDialog("da_waitingDialog","");
},show:function(_29f,_2a0,_2a1,from){
this.wtDialog.setBody(_29f,_2a0,_2a1,from);
this.wtDialog.refresh(_2a1);
this.wtDialog.show();
},hide:function(){
this.wtDialog.hide();
},remove:function(){
this.wtDialog.remove();
}};
DA.widget.TipDialog=function(_2a3,_2a4,_2a5,_2a6){
this.nodeId=_2a3;
this.setBody(_2a5,_2a6);
this.setDialog(_2a4);
};
Object.extend(DA.widget.TipDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.TipDialog.prototype.setDialog=function(_2a7){
var node=DA.dom.createDiv(this.nodeId);
var html="<div id=\""+this._bodyId()+"\" class=\"bd\">"+this.body+"</div>";
this.node=node;
this.node.innerHTML=html;
this.dialog=new YAHOO.widget.Dialog(this.nodeId,{fixedcenter:true,close:true,draggable:true,modal:false,visible:false,zindex:999,width:"230px"});
this.dialog.setHeader("<b>"+_2a7+"</b>");
this.dialog.render();
};
DA.widget.TipDialog.prototype.refresh=function(){
this.dialog.setBody(this.body);
};
DA.widget.TipDialog.prototype.setBody=function(_2aa,_2ab,_2ac){
_2ab=(DA.util.isEmpty(_2ab))?"":_2ab;
_2ac=(DA.util.isEmpty(_2ac))?DA.vars.imgRdir+"/popy_ok.gif":_2ac;
this.body=document.createElement("div");
this.body.imageP=document.createElement("p");
this.body.imageP.image=document.createElement("img");
this.body.msg1=document.createElement("span");
this.body.msg2=document.createElement("p");
this.body.buttons=document.createElement("div");
this.body.buttons.button1=document.createElement("input");
this.body.buttons.button2=document.createElement("input");
this.body.className=this._bodyId();
this.body.imageP.image.src=_2ac;
this.body.msg1.innerHTML=_2ab;
this.body.msg2.innerHTML=_2aa;
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
DA.widget.TipDialog.prototype.setBtnsOnclick=function(_2ad){
this.body.buttons.button1.onclick=_2ad[0];
this.body.buttons.button2.onclick=_2ad[1];
};
DA.widget.TipDialog.prototype.setFocus=function(obj){
obj.focus();
};
DA.tipDlg={TipDialog:null,init:function(_2af,_2b0,_2b1,_2b2){
this.TipDialog=new DA.widget.TipDialog("da_TipDialog",_2af,_2b0,_2b1);
var _2b3;
if(_2b2==="preview"){
_2b3=function(){
if(DA.tipDlg.isInit()){
DA.tipDlg.hide();
}
};
}else{
_2b3=function(){
window.__messageEditor.back();
};
}
var _2b4=function(){
window.__messageEditor.transmit();
};
this.TipDialog.setBtnsOnclick([_2b3,_2b4]);
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
DA.widget.SaveAttachesToLibDialog=function(_2b5,_2b6,_2b7,fid,uid,_2ba){
this.nodeId=_2b5;
this.setHead(_2b6);
if(_2b7.order){
this.setBody(_2b7,fid,uid);
}
this.setCbhash(_2ba);
this.setDialog();
this.setListener();
};
Object.extend(DA.widget.SaveAttachesToLibDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.SaveAttachesToLibDialog.prototype.setHead=function(_2bb){
this.head=DA.util.encode(_2bb);
};
DA.widget.SaveAttachesToLibDialog.prototype.setBody=function(_2bc,fid,uid){
var _2bf=_2bc.order[0].length;
var _2c0="";
var aid;
for(var i=0;i<_2bf;i++){
aid=i+1;
_2c0+="<input type=checkbox name="+this.childClass("attaches")+" value=\""+aid+"\"></input>"+"<span title=\""+_2bc.items[i].title+"\">"+DA.util.jsubstr4attach(_2bc.items[i].title,22)+"</span><br>";
}
_2c0+="<input type=button id=\""+this.childClass("save")+"\" value=\""+DA.locale.GetText.t_("DIALOG_SAVE_BUTTON")+"\">";
this.body=_2c0;
};
DA.widget.SaveAttachesToLibDialog.prototype.setListener=function(){
YAHOO.util.Event.addListener(this.childId("save"),"click",this._enter,this,true);
};
DA.widget.SearchMoveFolderDialog=function(_2c3,_2c4,_2c5){
this.nodeId=_2c3;
this.setHead(_2c4);
this.setCbhash(_2c5);
this.setBody();
this.setDialog();
this.setListener();
};
Object.extend(DA.widget.SearchMoveFolderDialog.prototype,DA.widget.Dialog.prototype);
DA.widget.SearchMoveFolderDialog.prototype.setHead=function(_2c6){
this.head=DA.util.encode(_2c6);
};
DA.widget.SearchMoveFolderDialog.prototype.setBody=function(){
var _2c7="<select style = \"width:200px;\" id=\"da_searchMoveToFid\">"+DA.vars.options.folder_tree+"</select>";
_2c7+="<input type=button id=\""+this.childClass("save")+"\" value=\""+DA.locale.GetText.t_("DIALOG_MOVE_BUTTON")+"\">";
this.body=_2c7;
};
DA.widget.SearchMoveFolderDialog.prototype.setListener=function(){
YAHOO.util.Event.addListener(this.childId("save"),"click",this._enter,this,true);
};
if(!DA||!DA.widget){
throw "ERROR: missing DA.js";
}
DA.tableutils={getComputedWidths:function(list){
var _2c9=[];
for(var i=0;i<list.length;i++){
_2c9.push(list[i].offsetWidth);
}
return _2c9;
}};
DA.widget.makeATable=function(rows,_2cc,_2cd,data){
var _2cf=1;
var thr,_2d1;
_2cd=_2cd?_2cd:{};
rows=rows?rows:1;
var _2d2=false;
var _2d3=[];
if(!_2cc){
_2cf=1;
}else{
if("number"===typeof _2cc){
_2cf=_2cc;
}else{
if(_2cc.each){
_2d1=document.createElement("colgroup");
_2d2=false;
_2d3=_2cc.map(function(_col,_2d5){
var col=document.createElement("col");
col.width=_col.width;
col.className="col"+_2d5;
_2d1.appendChild(col);
if(_col.name){
_2d2=true;
}
return _2d2?_col.name:"&nbsp";
});
_2d1.span=_2d3.length;
if(_2d2){
thr=document.createElement("tr");
if(_2cd.tr){
thr.className=_2cd.tr;
}
_2d3.each(function(name){
var th=document.createElement("th");
if(_2cd.th){
th.className=_2cd;
}
th.innerHTML=name;
thr.appendChild(th);
});
}
_2cf=_2d3.length;
}
}
}
data=data?data:[];
var _2d9=document.createElement("table");
var _2da=document.createElement("tbody");
if(_2d1){
_2d9.appendChild(_2d1);
}
var _2db;
if(thr){
_2db=document.createElement("thead");
_2db.appendChild(thr);
_2d9.appendChild(_2db);
}
_2d9.appendChild(_2da);
_2d9.className=_2cd.table;
_2da.className=_2cd.table;
var tr;
var td;
var _2de;
var _2df;
for(var j,i=0;i<rows;i++){
tr=document.createElement("tr");
_2df=(i%2)?"odd":"even";
tr.className=_2cd.tr?(_2cd.tr+" "+_2df):_2df;
_2de=data[i]||[];
for(j=0;j<_2cf;j++){
td=document.createElement("td");
if(_2cd.td){
td.className=_2cd.td;
}
td.innerHTML=_2de[j]||"&nbsp;";
tr.appendChild(td);
}
_2da.appendChild(tr);
}
return _2d9;
};
if(YAHOO&&YAHOO.util&&YAHOO.util.DragDrop){
DA.widget.ColumnResizer=function(_2e2,_2e3){
this.table=_2e2;
this._cols=this.table.getElementsByTagName("col");
this.config=Object.extend({maintainPercentage:true,minWidth:20},_2e3||{});
};
DA.widget.ColumnResizer.prototype={table:null,_cols:null,getComputedWidths:function(){
return DA.tableutils.getComputedWidths(this._cols);
},moveRight:function(l,_2e5){
this.preResize(l,_2e5);
if(this.tableLayoutHack){
this.table.style.tableLayout="auto";
}
var _2e6=this.getComputedWidths();
var minW=this.config.minWidth;
var _2e8=_2e6[l];
var _2e9=_2e6[l+1];
if((_2e9>minW)&&(_2e9-_2e5<=minW)){
_2e5=_2e9-minW;
}
if((_2e8>minW)&&(_2e8+_2e5<=minW)){
_2e5=minW-_2e8;
}
_2e6[l]=(_2e8+_2e5);
_2e6[l+1]=(_2e9-_2e5);
this._setNewWidths(_2e6);
if(this.tableLayoutHack){
this.table.style.tableLayout="fixed";
}
this.postResize(l,_2e5);
},_setNewWidths:function(_2ea){
if(!_2ea||(_2ea.length!==this._cols.length)){
return;
}
var _2eb=(this.config.maintainPercentage)?this._fairPercentages(DA.util.toPercentages(_2ea)):_2ea;
var func=(this.config.maintainPercentage)?this.setColWidthPerc:this.setColWidth;
_2eb.each(func.bind(this));
_2eb.each(func.bind(this));
},_fairPercentages:function(arr){
var _2ee=[];
var _2ef=true;
var _2f0=arr.map(function(p,i){
var r=Math.round(p);
if(r<1){
_2ef=false;
}
_2ee.push({i:i,profit:r-p});
return r;
});
var _2f4=_2f0.inject(0,function(a,b){
return a+b;
});
if(_2f4===100&&_2ef){
return _2f0;
}
if(_2f4>100){
_2ee.sortBy(function(a,b){
return a.profit>b.profit;
});
(_2f4-100).times(function(i){
var _2fa=_2ee[i].i;
--_2f0[_2fa];
});
}else{
if(_2f4<100){
_2ee.sortBy(function(a,b){
return b.profit>a.profit;
});
(100-_2f4).times(function(i){
var _2fe=_2ee[i].i;
++_2f0[_2fe];
});
}
}
var num;
var sum=0;
var temp=0;
for(var i=0;i<_2f0.length;i++){
if(_2f0[i]<1){
sum=sum+(1-_2f0[i]);
_2f0[i]=1;
}
if(_2f0[i]>temp){
temp=_2f0[i];
num=i;
}
}
if(sum!==0){
_2f0[num]=_2f0[num]-sum;
}
return _2f0;
},setColWidth:function(w,_304){
this._cols[_304].width=(w+"px");
},setColWidthPerc:function(w,_306){
this._cols[_306].width=(w+"%");
},tableLayoutHack:(BrowserDetect.browser==="Mozilla"||BrowserDetect.browser==="Firefox"),preResize:Prototype.emptyFunction,postResize:Prototype.emptyFunction};
DA.widget.TwoColumnResizeHandle=function(_307,elem,_309,_30a){
this.index=_30a;
this.resizer=_309;
this.table=_307;
this.init(elem);
var msg;
if("number"!==typeof _30a){
msg="ERROR: index not supplied for TwoColumnResizeHandle";
throw msg;
}
};
YAHOO.lang.extend(DA.widget.TwoColumnResizeHandle,YAHOO.util.DragDrop,{resizer:null,_lamb:null,_proxyEl:null,onMouseDown:function(e){
this._proxyEl=document.createElement("div");
var _30d=this._proxyEl;
_30d.className="da_columnResizeLineActive";
document.body.appendChild(this._proxyEl);
var _30e=YAHOO.util.Event.getPageX(e);
var _30f=YAHOO.util.Dom.getY(this.table);
Object.extend(_30d.style,{height:this.table.parentNode.offsetHeight+"px",left:_30e+"px",top:_30f+"px"});
var _310=this.resizer.getComputedWidths();
var _311=_310[this.index+1];
var _312=_310[this.index];
var minW=this.resizer.config.minWidth;
this.setInitPosition();
this.setXConstraint(_312-minW,_311-minW);
this._lamb=document.createElement("div");
this._lamb.innerHTML="&nbsp;";
document.body.appendChild(this._lamb);
var _314=this._lamb.style;
Object.extend(_314,{height:"10px",width:"10px",cursor:"w-resize",position:"absolute",top:(YAHOO.util.Event.getPageY(e)-4)+"px",left:(_30e-4)+"px"});
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
var _319=curX-this.startPageX;
this.resizer.moveRight(this.index,_319);
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
var key,_31f=false;
for(key in this.data){
if(!DA.util.isFunction(this.data[key])){
_31f=true;
break;
}
}
return _31f;
}};
if(!DA||!DA.io){
alert("ERROR: missing DA.js or io.js");
}
DA.io.JsonIO=function(url,_321){
this.defaultParams=_321;
this.url=DA.util.setUrl(url);
};
(function(){
var _322,_323;
try{
_322=YAHOO.lang.isObject;
_323=YAHOO.lang.isFunction;
}
catch(e){
_322=function(obj){
return DA.util.isObject(obj)||DA.util.isFunction(obj);
};
_323=DA.util.isFunction;
}
DA.io.JsonIO.prototype={defaultParams:undefined,callback:function(obj,args){
},errorHandler:function(e,_328){
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
},method:"post",execute:function(_32e,_32f){
var _330=undefined;
var _331=this.callback;
var _332=this.errorHandler;
var _333=this.htmlHandler;
if(_32f){
if(_323(_32f)){
_331=_32f;
}else{
if(_322(_32f)){
if(_323(_32f.callback)){
_331=_32f.callback;
}
if(_323(_32f.errorHandler)){
_332=_32f.errorHandler;
}
}
}
}
if(this.defaultParams){
_330={};
Object.extend(_330,this.defaultParams);
}
if(_32e){
_330=_330?_330:{};
Object.extend(_330,_32e);
}
var _url=this.url;
var _335=DA.io.Manager.loading(_url);
var _336=encodeURIComponent(_335);
var req=new Ajax.Request(_url.match(/\?/)?_url+"&serial="+_336:_url+"?serial="+_336,{method:this.method,parameters:$H(_330).toQueryString(),onSuccess:function(_338){
var _339=_338.getResponseHeader("Content-Type");
if(!_339||!_339.match(/(js|json|javascript)/i)){
DA.io.Manager.done(_335);
_333({type:"INVALID_CONTENTTYPE",contentType:_339,body:_338.responseText});
return;
}
var _33a=_338.responseText;
var obj;
try{
obj=eval("("+_33a+")");
if("object"===typeof obj){
DA.io.Manager.done(_335);
_331(obj,_330);
}else{
DA.io.Manager.done(_335);
_332({type:"NOT_AN_OBJECT",contentType:_339,body:_338.responseText},_330);
}
}
catch(e){
DA.io.Manager.done(_335);
_332(e,_330);
}
},onFailure:function(err){
DA.io.Manager.done(_335);
_332(err,_330);
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
DA.io.FileUploadIO=function(url,_33f,_340){
this.url=DA.util.setUrl(url);
this.formId=_33f;
this.defaultParams=_340;
if(location.href.match(/^[hH][tT][tT][pP][sS]\:\/\//)){
this.secureUri=true;
}else{
this.secureUri=false;
}
};
DA.io.FileUploadIO.prototype={url:null,formId:null,defaultParams:undefined,secureUri:null,callback:function(obj,args){
},errorHandler:function(e,_344){
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
},execute:function(_34a,_34b){
var me=this;
var _34d=undefined;
if(this.defaultParams){
_34d={};
Object.extend(_34d,this.defaultParams);
}
if(_34b){
_34d=_34d?_34d:{};
Object.extend(_34d,_34b);
}
var _url=this.url;
if(!_34a){
_34a=this.formId;
}
var _34f=DA.io.Manager.loading(_url);
try{
YAHOO.util.Connect.setForm(YAHOO.util.Dom.get(_34a),true,this.secureUri);
YAHOO.util.Connect.asyncRequest("POST",_url,{upload:function(_350){
var obj;
var _352;
var _353=_350.responseText;
_353=_353.replace(/^<pre>/i,"");
_353=_353.replace(/<\/pre>[\s\r\n\t]*$/i,"");
obj=eval("("+_353+")");
if("object"===typeof obj){
DA.io.Manager.done(_34f);
me.callback(obj,_34d);
}else{
DA.io.Manager.done(_34f);
me.htmlHandler({type:"NOT_AN_OBJECT",body:_350.responseText});
}
},failure:function(_354){
DA.io.Manager.done(_34f);
me.errorHandler({type:"NOT_AN_OBJECT",body:_354.statusText},_34d);
}});
}
catch(e){
DA.io.Manager.done(_34f);
me.errorHandler(e,_34d);
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
var i,_358;
for(i=0;i<node.children.length;i++){
_358=node.children[i];
if(_358.hasChildren()){
_358.expand();
this._treeOpenAllChildren(_358);
}
}
},_treeCloseAllChildren:function(node){
var i,_35b;
for(i=0;i<node.children.length;i++){
_35b=node.children[i];
if(_35b.hasChildren()){
_35b.collapse();
this._treeCloseAllChildren(_35b);
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
var _35d;
try{
_35d=window.opener.document.date_form.date.value;
window.opener.DAportletRefresher.refresh_all("mail",_35d,"");
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
var _36d=document.cookie.split(";");
for(var i=0;i<_36d.length;i++){
if(_36d[i].split("=")[0].replace(/(^\s*)|(\s*$)/g,"")===key){
if(typeof _36d[i].split("=")[1]==="undefined"){
return "";
}
return _36d[i].split("=")[1];
}
}
return "";
},getOperationWarnedFlag:function(){
var key=OrgMailer.vars.cookie_key+"-operation_warned";
var _370=document.cookie.split(";");
for(var i=0;i<_370.length;i++){
if(_370[i].split("=")[0].replace(/(^\s*)|(\s*$)/g,"")===key){
if(typeof _370[i].split("=")[1]==="undefined"){
return "";
}
return _370[i].split("=")[1];
}
}
return "";
},getMailAccount:function(){
var key=OrgMailer.vars.cookie_key+"-org_mail";
var _373=document.cookie.split(";");
for(var i=0;i<_373.length;i++){
if(_373[i].split("=")[0].replace(/(^\s*)|(\s*$)/g,"")===key){
return _373[i].split("=")[1];
}
}
},autoCloseWaitingMask:function(){
var _375=window.setInterval(function(){
if(DA.mailer.util.getOperationFlag()===""){
DA.waiting.hide();
OrgMailer.vars.operation_warned=0;
window.clearInterval(_375);
if(!OrgMailer.vars.is_blured){
document.cookie=OrgMailer.vars.cookie_key+"-org_mail="+OrgMailer.vars.org_mail_gid+";";
}
}
},500);
},setOperationFlag:function(flag){
document.cookie=OrgMailer.vars.cookie_key+"-operation_flag="+flag;
},setOperationWarnedFlag:function(flag){
var _378=DA.mailer.util.getOperationWarnedFlag();
if(flag===""){
_378="";
}else{
if(_378.indexOf(flag)<0){
if(_378!==""){
_378+=",";
}
_378+=flag;
}
}
document.cookie=OrgMailer.vars.cookie_key+"-operation_warned="+_378+";";
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
var io,_382,_383,i;
if(DA.util.lock("saveState")){
io=this._saveStateIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
DA.util.warn(DA.locale.GetText.t_("SAVE_STATE_MESSAGE"));
DA.util.unlock("saveState");
try{
window.opener.AjaxMailerWindowWidth=_382.window_width;
window.opener.AjaxMailerWindowHeight=_382.window_height;
window.opener.AjaxMailerWindowPosX=_382.window_pos_x;
window.opener.AjaxMailerWindowPosY=_382.window_pos_y;
}
catch(e){
}
}
};
io.errorHandler=function(e){
DA.util.unlock("saveState");
};
_382={proc:"default",window_pos_x:(BrowserDetect.browser==="Explorer")?window.screenLeft-4:window.screenX,window_pos_y:(BrowserDetect.browser==="Explorer")?window.screenTop-30:window.screenY,window_width:YAHOO.util.Dom.getViewportWidth(),window_height:YAHOO.util.Dom.getViewportHeight()};
if(_382.window_pos_x<0){
_382.window_pos_x=0;
}
if(_382.window_pos_y<0){
_382.window_pos_y=0;
}
_383=DA.session.UIState.getAllStateInfo();
_383.each(function(_387){
var _388="";
if(_387.name==="threePane"){
_382.dir_width=_387.info.leftPane.width;
_382.list_height=_387.info.rightTopPane.height;
}else{
if(_387.name==="mboxgrid"){
_387.info.columns.each(function(col){
_388+=col.width+"|";
});
_382.list_column_width=_388.replace(/\|+$/,"");
}else{
if(_387.name==="messageViewer"){
_382.detail_header_open=_387.info.headerExpanded;
_382.detail_header_to_open=_387.info.headerToExpanded;
_382.detail_header_cc_open=_387.info.headerCcExpanded;
_382.detail_header_attachment_open=_387.info.headerAttachmentExpanded;
}
}
}
});
io.execute(_382);
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
},editorOpen:function(proc,fid,uid,tid,_396){
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
if(!DA.util.isEmpty(_396)){
url+="&quote="+_396;
}
url+="&org_mail_gid="+OrgMailer.vars.org_mail_gid;
if(DA.vars.html&&DA.vars.html.editor){
DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",this.editorWidth(),this.editorHeight()),url,DA.vars.html.editor);
}else{
DA.windowController.winOpenNoBar(url,"",this.editorWidth(),this.editorHeight());
}
},editorOpenBackUp:function(proc,fid,uid,_39b,_39c){
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
if(!DA.util.isEmpty(_39b)){
url+="&backup_maid="+_39b;
}
if(!DA.util.isEmpty(_39c)){
url+="&backup_org_clrRdir="+_39c;
}
url+="&org_mail_gid="+OrgMailer.vars.org_mail_gid;
if(DA.vars.html&&DA.vars.html.editor){
DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",this.editorWidth(),this.editorHeight()),url,DA.vars.html.editor);
}else{
DA.windowController.winOpenNoBar(url,"",this.editorWidth(),this.editorHeight());
}
},backup_reopenable:function(proc,fid,uid){
var _3a1,_3a2,_3a3;
var i=0;
var flag=true;
if(!DA.util.isEmpty(fid)&&!DA.util.isEmpty(window.__folderTree.backupFolderFid)&&fid===window.__folderTree.backupFolderFid.toString()&&proc==="edit"){
_3a1=window.DA.windowController.data;
if(!DA.util.isUndefined(_3a1)){
for(i=0;i<_3a1.length;i++){
try{
_3a2=_3a1[i];
}
catch(e){
continue;
}
if(!DA.util.isUndefined(_3a2)&&!_3a2.closed){
if(DA.util.isUndefined(_3a2.__messageEditor)){
continue;
}
_3a3=_3a2.__messageEditor.backup_maid;
if(!DA.util.isEmpty(uid)&&!DA.util.isEmpty(_3a3)&&uid.toString()===_3a3.toString()){
flag=false;
break;
}
}
}
}
}
return flag;
},editorOpen4url:function(url,_3a7,_3a8){
url=url.replace(/&external\=\d/,"");
if(DA.vars.html&&DA.vars.html.editor){
DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",DA.mailer.windowController.editorWidth(),DA.mailer.windowController.editorHeight()),url,DA.vars.html.editor);
}else{
DA.windowController.winOpenNoBar(url,"",_3a7,_3a8);
}
},searcherOpen:function(fid){
var _3aa="width=800,height=600"+",resizable=yes,scrollbars=yes,location=no"+",menubar=no,toolbar=no,statusbar=no";
var url=DA.vars.cgiRdir+"/ajax_mailer.cgi?html=searcher&search=1&fid="+fid;
url+="&org_mail_gid="+OrgMailer.vars.org_mail_gid;
if(DA.vars.html&&DA.vars.html.searcher){
DA.mailer.windowController.documentWrite(DA.windowController.winOpenCustom("","",_3aa),url,DA.vars.html.searcher);
}else{
DA.windowController.winOpenCustom(url,"",_3aa);
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
var _3af=$H({});
var _3b0=$H({});
function _getStateInfo(w){
if("function"!==typeof w.getUIStateInfo){
return;
}
return w.getUIStateInfo();
}
DA.session={Values:{registerValue:function(name,_3b3){
_3b0[name]=_3b3;
},getValue:function(name){
return _3b0[name];
}},UIState:{registerWidget:function(name,_3b6){
_3af[name]=_3b6;
},getStateInfo:function(name){
var w=_3af[name];
if(!w){
return;
}
return _getStateInfo(w);
},getAllStateInfo:function(){
return _3af.map(function(ent){
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
var _3ba=new YAHOO.util.CustomEvent("unimplemented");
_3ba.subscribe(function(type,args){
});
DA.mailer.util.AbstMsgProc=function(){
};
DA.mailer.util.AbstMsgProc.prototype={_serialNo:0,_utils:{asFidColonUid:function(m){
return m.fid+":"+m.uid;
},asFidColonUidRange:function(r){
return r.start.fid+":"+r.start.uid+"-"+r.end.fid+":"+r.end.uid;
}},proc:function(_3bf,_3c0,_3c1){
if(!_3bf.count){
return;
}
var _3c2=_3bf.singles.map(this._utils.asFidColonUid);
var _3c3=_3bf.ranges.map(this._utils.asFidColonUidRange);
var _3c4=Object.extend(_3c0||{},{uid:_3c2.join(","),area:_3c3.join(",")});
++this._serialNo;
var _3c5=this._serialNo;
var _3c6=this.evtDone;
var _3c7=this.evtDoing;
var _3c8=this.evtFailure;
this.io.execute(_3c4,{callback:function(_3c9){
if(!DA.mailer.util.checkResult(_3c9)){
_3c8.fire(_3c5,_3c1,_3c9);
}
_3c6.fire(_3c5,_3c1,_3c9);
},errorHandler:function(e){
_3c8.fire(_3c5,_3c1,e);
}});
window.setTimeout(function(){
_3c7.fire(_3c5,_3c1);
},10);
},mockProc:function(_3cb,_3cc){
++this._serialNo;
var _3cd=this._serialNo;
this.evtDoing.fire(_3cd,_3cb);
this.evtDone.fire(_3cd,_3cb,_3cc);
},evtDoing:_3ba,evtDone:_3ba,evtFailure:_3ba,io:null};
DA.mailer.util.MessageMover=function(){
this.io=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi",{proc:"move"});
};
YAHOO.lang.extend(DA.mailer.util.MessageMover,DA.mailer.util.AbstMsgProc,{trashFid:0,move:function(_3ce){
if(!_3ce){
throw "No params to move";
}
if(!_3ce.messages||!_3ce.target||!(_3ce.target.fid||(_3ce.target.trash===true))){
throw "Invalid/Insufficient params to move:"+$H(_3ce).inspect();
}
var _3cf=_3ce.messages.fid;
if(DA.util.cmpNumber(_3cf,_3ce.target.fid)){
return;
}
var _3d0=_3ce.target.trash===true?this.trashFid:_3ce.target.fid;
var _3d1={fid:_3cf};
if(_3ce.messages.srid){
_3d1.srid=_3ce.messages.srid;
}
_3d1.extend((_3ce.target.trash&&this.reallyDelete(_3cf))?{proc:"delete"}:{proc:"move",target_fid:_3d0});
this.proc(_3ce.messages,_3d1,_3ce);
},reallyDelete:function(_3d2){
if(!_3d2){
return false;
}
if(parseInt(_3d2,10)===parseInt(this.trashFid,10)){
return true;
}
return DA.vars.config["delete"]===1;
},mockMove:function(_3d3,_3d4){
this.mockProc(_3d3,_3d4);
},evtDoing:DA.mailer.Events.onMessagesMoving,evtDone:DA.mailer.Events.onMessagesMoved,evtFailure:DA.mailer.Events.onMessagesMoveFailure});
DA.mailer.util.MessageFlagger=function(){
this.io=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_flag.cgi");
};
YAHOO.lang.extend(DA.mailer.util.MessageFlagger,DA.mailer.util.AbstMsgProc,{flag:function(_3d5){
var _3d6,_3d7;
if(!_3d5||!this._isValidProp(_3d6=_3d5.property)||!(_3d7=_3d5.messages)){
return;
}
var _3d8={proc:(_3d5.state===false)?"un"+_3d6:_3d6,fid:_3d7.fid};
if(_3d7.srid){
_3d8.srid=_3d7.srid;
}
this.proc(_3d7,_3d8,_3d5);
},mockFlag:function(_3d9,_3da){
this.mockProc(_3d9,_3da);
},_isValidProp:function(_3db){
return YAHOO.lang.isString(_3db)&&(_3db==="seen"||_3db==="flagged");
},evtDoing:DA.mailer.Events.onMessagesFlagging,evtDone:DA.mailer.Events.onMessagesFlagged,evtFailure:DA.mailer.Events.onMessagesFlagFailure});
})();
(function(){
var _3dc=false;
var _3dd={};
var _3de={move:function(){
}};
var _3df={flag:function(){
}};
var _3e0=YAHOO.lang.isArray;
function deepCopy(o){
var _3e2=arguments[1]||0;
++_3e2;
if(_3e2>10){
return {};
}
if(o===null||typeof o!=="object"){
return o;
}
var ret,i,len,val;
if(_3e0(o)){
ret=[];
len=o.length;
for(i=0;i<len;++i){
ret[i]=deepCopy(o[i],_3e2);
}
}else{
ret={};
$H(o).each(function(item,i){
ret[item.key]=deepCopy(item.value);
});
}
return ret;
}
function mkMsgColl(_3e9){
return {fid:_3e9.fid,count:1,singles:[_3e9],single:_3e9,ranges:[],identity:{}};
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
E.onFolderTreeReady.subscribe(mkSubs(function(_3ef){
["trash","sent","draft","backupFolder"].each(function(_3f0){
var prop=_3f0+"Fid";
var id=parseInt(_3ef[prop],10);
if(YAHOO.lang.isNumber(id)){
_3dd[prop]=id;
_3de[prop]=id;
}else{
}
});
}));
E.onMessageMoveRequest.subscribe(mkSubs(function(o){
var myo=deepCopy(o);
setTimeout(function(){
_3de.move(myo);
},10);
}));
E.onMessageFlagRequest.subscribe(mkSubs(function(o){
var myo=deepCopy(o);
setTimeout(function(){
_3df.flag(myo);
},10);
}));
function mkSentOrSavedHandler(_3f7){
return function(type,args){
var _3fa=args[0];
var resp=args[1];
if(!_3fa||!resp){
return;
}
_3fa=deepCopy(_3fa);
resp=deepCopy(resp);
if(_3fa.mode!==0){
_3fa.originuid=_3fa.uid;
}
var req={messages:mkMsgColl(_3fa),target:{fid:_3dd[_3f7]}};
var _3fd=parseInt(_3fa.fid,10);
if(_3fd!==_3dd.draftFid&&_3fd!==_3dd.sentFid&&_3fd!==_3dd.backupFolderFid&&_3fd!==_3dd.localFolderFid){
req.messages.single.uid=0;
}
window.__mboxGrid.refreshGrid();
setTimeout(function(){
_3de.mockMove(req,resp);
},10);
};
}
E.onMessageSent.subscribe(mkSentOrSavedHandler("sentFid"),app,true);
E.onMessageSaved.subscribe(mkSentOrSavedHandler("draftFid"),app,true);
}
DA.mailer.Application={init:function(){
if(_3dc){
return;
}
_3de=new DA.mailer.util.MessageMover();
_3df=new DA.mailer.util.MessageFlagger();
setupPlumbing(this);
_3dc=true;
return this;
}};
})();
DA.widget.PopupMenuController=function(_3fe,_3ff,_400,_401){
this.popupId=_3fe;
this.triggerId=_3ff;
this.triggerNode=YAHOO.util.Dom.get(_3ff);
this.menuData=_400;
if(DA.util.isFunction(_401.onTrigger)){
this.onTrigger=_401.onTrigger;
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
},onclick:function(func,_413){
this.menuData.items[func].onclick=_413;
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
var i,j,l,s,d,t,ti,_421;
var me=this;
var html="<div oncontextmenu=\"return false;\">";
var _424,_425,node;
var _427,_428;
var _429="this.style.background='#e0e0e0'";
var _42a="this.style.background='#efefef fixed top'";
_424=this.menuData.order.length;
if(DA.vars.custom.menu.setPopupMenu){
eval(DA.vars.custom.menu.setPopupMenu);
}
for(i=0;i<_424;i++){
l="";
_425=this.menuData.order[i].length;
for(j=0;j<_425;j++){
if(!this._hidden(this._func(i,j))){
s=(this._selected(this._func(i,j)))?" selected":"";
d=(this._disabled(this._func(i,j)))?" disabled":"";
t=(this.menuData.encode===false)?this._text(this._func(i,j)):DA.util.encode(this._text(this._func(i,j)));
if(this.menuData.className==="da_messageViewerHeaderAttachmentPulldownMenu"){
ti=(this.menuData.encode===false)?this._title(this._func(i,j)):DA.util.encode(this._title(this._func(i,j)));
_421="title=\""+ti+"\"";
}
l+="<li id=\""+this._id(this._func(i,j))+"_li\" class=\"da_popupMenuItem"+s+d+this._className()+"\""+_421+">"+"<a id=\""+this._id(this._func(i,j))+"_a\" class=\""+s+d+"\">"+t+"</a>"+"</li>";
}
}
if((this.menuData.className==="da_messageViewerHeaderAttachmentPulldownMenu")&&DA.vars.config.soft_install===1){
if(_425>=2){
_427=this.menuData.items[0].args.toString();
_428=_427.replace(/(.;)/g,", 'all'$1");
l+="</ul><ul><li id=\"message_headerAttachmentIconPopupMenuItem_downAll_li\" class=\"da_popupMenuItem\" "+"onmouseover=\""+_429+";\""+"onmouseout=\""+_42a+";\" onclick=\""+_428+"\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/ico_fc_download.gif","",{align:"absmiddle"})+DA.locale.GetText.t_("B_DOWNLOAD")+"</li>";
}
l+="<li id=\"message_headerAttachmentIconPopupMenuItem_saveAttaches_li\" class=\"da_popupMenuItem\" "+"onmouseover=\""+_429+";\""+"onmouseout=\""+_42a+";\" onclick=\"window.__messageViewer.showsaveattachestolibdialog(event.clientX,event.clientY);\">"+DA.imageLoader.tag(DA.vars.imgRdir+"/ico_fc_docsave.gif","",{align:"absmiddle"})+DA.locale.GetText.t_("MESSAGE_SAVEATTACHESTOLIB_MENU")+"</li>";
}
if(!DA.util.isEmpty(l)){
html+="<ul>"+l+"</ul>";
}
}
html+="</div>";
this.popupNode.innerHTML=html;
_424=this.menuData.order.length;
for(i=0;i<_424;i++){
_425=this.menuData.order[i].length;
for(j=0;j<_425;j++){
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
DA.widget.PopupMenuNoTrigger=function(_42f,_430,_431){
this.popupId=_42f;
this.menuData=_430;
if(DA.util.isFunction(_431.onTrigger)){
this.onTrigger=_431.onTrigger;
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
DA.widget.ContextMenuController=function(_433,_434,_435,_436){
this.popupId=_433;
this.triggerId=_434;
this.triggerNode=YAHOO.util.Dom.get(_434);
this.menuData=_435;
if(DA.util.isFunction(_436.onTrigger)){
this.onTrigger=_436.onTrigger;
}
if(DA.util.isFunction(_436.onCancel)){
this.onCancel=_436.onCancel;
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
DA.widget.PulldownMenuController=function(_438,_439,_43a,_43b){
this.popupId=_438;
this.triggerId=_439;
this.triggerNode=YAHOO.util.Dom.get(_439);
this.menuData=_43a;
if(DA.util.isFunction(_43b.onTrigger)){
this.onTrigger=_43b.onTrigger;
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
DA.ug={list2String:function(_440,cols,max){
var i,l,u,e;
var _447="";
if(DA.util.isEmpty(cols)){
cols=3;
}
if(_440){
for(i=0;i<_440.length;i++){
l="";
e="";
u=_440[i];
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
_447+="<span style=\"white-space: nowrap;\">"+l+"&nbsp;<b>..</b></span>\n";
break;
}else{
_447+="<span style=\"white-space: nowrap;\">"+l+"&nbsp;</span>\n";
}
if(cols>0&&(i+1)%cols===0){
_447+="<br>";
}
}
}
}
return _447;
},openAddrInfo:function(id,_449){
var Ids=id.split("-");
var _44b="aInfo"+Ids[0];
if(!_449){
DA.windowController.winOpenCustom(DA.vars.cgiRdir+"/og_card_addr.cgi?id="+id,_44b,"width=450,height=600,resizable=yes,scrollbars=yes");
}else{
DA.windowController.winOpenCustom(DA.vars.cgiRdir+"/og_card_addr.cgi?id="+id,"","width=450,height=600,resizable=yes,scrollbars=yes");
}
},openUserInfo:function(mid,type,_44e){
if(DA.util.isEmpty(type)){
type="addr";
}
var cgi="/info_card.cgi?type="+type+"&id="+mid;
var _450="Info"+mid;
if(!_44e){
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,_450,"width=480,height=600,resizable=yes,scrollbars=yes");
}else{
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,"","width=480,height=600,resizable=yes,scrollbars=yes");
}
},openGroupInfo:function(gid,_452){
var cgi="/info_card.cgi?type=group&id="+gid;
var _454="gInfo"+gid;
if(!_452){
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,_454,"width=500,height=480,resizable=yes,scrollbars=yes");
}else{
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,"","width=500,height=480,resizable=yes,scrollbars=yes");
}
},openMLInfo:function(mlid,_456){
var Proc="ml_card.cgi%3fl="+mlid;
var Img="pop_title_mlinfo.gif";
DA.windowController.isePopup(Proc,Img,500,500,"",1);
},openBulkInfo:function(id,_45a){
var Proc="address_card.cgi%3fid="+id;
var Img="pop_title_mladinfo.gif";
DA.windowController.isePopup(Proc,Img,650,600,"",1);
},openAddrRegist:function(NAME,_45e){
var Proc="ma_ajx_addr_regist.cgi%3fname="+encodeURIComponent(encodeURIComponent(NAME))+"%20email="+encodeURIComponent(encodeURIComponent(_45e));
var Img="pop_title_regaddress.gif";
if(DA.vars.custom.threePane.setAddressInsertProc){
eval(DA.vars.custom.threePane.setAddressInsertProc);
}
DA.windowController.isePopup(Proc,Img,600,400,"",1);
}};
DA.ug.InformationListController=function(node,_462,_463,cfg){
this.ugNode=node;
if(_463){
if(DA.util.isFunction(_463.onRemove)){
this.onRemove=_463.onRemove;
}
if(DA.util.isFunction(_463.onPopup)){
this.onPopup=_463.onPopup;
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
this.init(_462);
};
DA.ug.InformationListController.prototype={ugNode:null,ugData:null,ugNdata:null,sno:1,onRemove:Prototype.emptyFunction,onPopup:Prototype.emptyFunction,maxView:0,lineHeight:0,registEnabled:false,popupEnabled:true,deleteEnabled:true,beforeInsertScrollTop:0,init:function(_465){
this.ugNode.style.display="none";
this.ugData={};
this.ugNdata={};
this.addList(_465);
},add:function(u,_467,perf){
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
if(!_467){
this.resize();
this.scroll();
}
},insertToTop:function(u,_46e){
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
if(_46e!==0){
delete this.ugData[_46e];
}
var _473=this.ugData;
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
var _474=[];
var _475=0;
for(var i in _473){
if(_473[i]){
_474[_475++]=_473[i];
}
}
this.ugNode.style.display="block";
this.lineHeight=this.height(sno);
if(this.lineHeight>DA.dom.height("da_messageEditorItemToText")&&DA.dom.height("da_messageEditorItemToText")>=19){
this.lineHeight=DA.dom.height("da_messageEditorItemToText")-2;
}
if(!_474||!_474.length){
return;
}
var _477=_474.length;
for(i=0;i<_477;++i){
this.add(_474[i]);
}
this.resize();
this.scroll();
},insertAfterNode:function(u,_479,_47a,_47b){
var l={};
var n={};
var me=this;
if(!u){
return;
}
if(DA.util.isEmpty(u.name)&&DA.util.isEmpty(u.email)){
return;
}
if(_47b==="true"){
delete this.ugData[_479];
delete this.ugNdata[_479];
}
var sno=this.sno++;
var _480=this.ugData;
var _481=this.ugNdata;
this.ugNode.innerHTML="";
this.ugNode.style.display="none";
this.ugData={};
this.ugNdata={};
var _482=[];
var _483=0;
var _484=0;
var _485=0;
for(var i in _480){
if(i.match(/^\d+$/)&&i>0){
if(_480[i]){
if(_481[i].lineNode.id!==_47a){
_482[_483++]=_480[i];
_484++;
}else{
_482[_483++]=_480[i];
_482[_483++]=u;
_485=_484;
}
}
}
}
if(_485>1){
this.beforeInsertScrollTop=(_485-1)*20;
}else{
this.beforeInsertScrollTop=0;
}
this.ugNode.style.display="block";
this.lineHeight=this.height(sno);
if(this.lineHeight>DA.dom.height("da_messageEditorItemToText")&&DA.dom.height("da_messageEditorItemToText")>=19){
this.lineHeight=DA.dom.height("da_messageEditorItemToText")-2;
}
if(!_482||!_482.length){
return;
}
var _487=_482.length;
for(i=0;i<_487;++i){
this.add(_482[i],true);
}
this.resize();
this.scrollTo(this.beforeInsertScrollTop);
},showAllAddress:function(){
var me=this;
var _489=this.list().length;
me.ugNode.style.height=(_489*18+10)+"px";
},addList:function(_48a,perf){
if(!_48a||!_48a.length){
return;
}
var _48c=_48a.length;
var i;
if(perf===true){
this.ugNode.style.display="none";
}
for(i=0;i<_48c;++i){
this.add(_48a[i],true,perf);
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
var key,_499=0;
for(key in this.ugData){
if(!DA.util.isFunction(this.ugData[key])){
_499++;
}
}
return _499;
},resize:function(){
var _49a;
var _49b=0;
if(this.maxView>0){
_49a=this.count();
if(_49a>0){
if(this.ugNode.firstChild){
_49b=this.ugNode.firstChild.offsetHeight;
}
if(this.lineHeight>_49b){
_49b=this.lineHeight;
}
if(_49a>this.maxView){
YAHOO.util.Dom.addClass(this.ugNode,"da_ugInformationListOverflowAuto");
DA.dom.sizeHeight(this.ugNode,_49b*this.maxView);
}else{
YAHOO.util.Dom.removeClass(this.ugNode,"da_ugInformationListOverflowAuto");
DA.dom.sizeHeight(this.ugNode,_49b*_49a);
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
},name:function(sno,name,_4ac){
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
if(_4ac){
this.email(sno,l.email);
}
},email:function(sno,_4b0){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
if(DA.util.isEmpty(_4b0)){
l.email="";
n.emailNode.innerHTML="";
n.emailNode.style.display="none";
}else{
l.email=_4b0;
if(DA.util.isEmpty(l.name)&&DA.util.isEmpty(l.title)){
n.emailNode.innerHTML=DA.util.encode(_4b0);
n.emailNode.style.display="";
}else{
n.emailNode.innerHTML="&nbsp;"+DA.util.encode("<"+_4b0+">");
n.emailNode.style.display="";
}
}
},title:function(sno,_4b4,_4b5,_4b6){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
if(DA.util.isEmpty(_4b4)){
l.title="";
l.title_pos=0;
n.title0Node.innerHTML="";
n.title1Node.innerHTML="";
n.title0Node.style.display="none";
n.title1Node.style.display="none";
}else{
l.title=_4b4;
l.title_pos=_4b5;
if(_4b5===1){
n.title0Node.innerHTML="";
n.title1Node.innerHTML=DA.util.encode(_4b4);
n.title0Node.style.display="none";
n.title1Node.style.display="";
}else{
n.title0Node.innerHTML=DA.util.encode(_4b4);
n.title1Node.innerHTML="";
n.title0Node.style.display="";
n.title1Node.style.display="none";
}
}
if(_4b6){
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
},regist:function(sno,_4c2){
var l=this.ugData[sno];
var n=this.ugNdata[sno];
if(DA.util.isEmpty(_4c2)||!this.registEnabled){
l.regist="";
n.registNode.innerHTML="";
n.registNode.style.display="none";
}else{
l.regist=_4c2;
n.registNode.innerHTML=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_adradd.gif","",{"class":"da_ugInformationListRegist"});
n.registNode.onclick=function(){
eval(_4c2);
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
var _4d0=this.ugNdata[sno].lineNode;
if(_4d0){
_4d0.innerHTML="";
_4d0.parentNode.removeChild(_4d0);
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
},scrollTo:function(_4d8){
try{
this.ugNode.scrollTop=_4d8;
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
var _4da=elem?elem:document.body;
var div=document.createElement("div");
div.innerHTML="Log: ";
var _4dc=document.createElement("button");
_4dc.innerHTML="Show Log";
var _4dd=document.createElement("button");
_4dd.innerHTML="Hide Log";
_4dd.disabled=true;
var _4de=document.createElement("button");
_4de.innerHTML="Clear Log";
var pre=document.createElement("pre");
pre.style.display="none";
pre.style.height="100px";
pre.style.overflow="scroll";
pre.style.backgroundColor="#225522";
pre.style.color="#ffffff";
pre.style.fontSize="9pt";
_4dc.onclick=function(){
pre.style.display="block";
this.disabled=true;
_4dd.disabled=false;
};
_4dd.onclick=function(){
pre.style.display="none";
this.disabled=true;
_4dc.disabled=false;
};
_4de.onclick=function(){
pre.innerHTML="";
};
div.appendChild(_4dc);
div.appendChild(_4dd);
div.appendChild(_4de);
div.appendChild(pre);
_4da.appendChild(div);
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
DA.widget.NVPairSet=function(div,_4e6,args,_4e8){
this.div=$(div);
this.nvpair=_4e6;
this.args=args;
this.expanded=_4e8;
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
var _4ea;
var _4eb;
var _4ec,_4ed,_4ee;
var _4ef;
var _4f0;
var i,key;
_4ea=document.createElement("tr");
_4eb=document.createElement("td");
_4ea.className="da_nvCollapsedPair";
if("undefined"!==typeof this.args){
if(this.args.length>0){
for(i=0;i<this.args.length;i++){
if("undefined"!==typeof this.nvpair[this.args[i]]){
this.putCollapse(this.args[i],_4eb);
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
this.putCollapse(key,_4eb);
if((++i)===2){
break;
}
}
}
_4ea.appendChild(_4eb);
this.collapseTbody.appendChild(_4ea);
this._hideExcessCollapsedPairs();
var _4f3=1;
for(key in this.nvpair){
if("function"===typeof this.nvpair[key]){
continue;
}
if(_4f3!==1&&this.nvpair[key].border!==false){
this.putExpandBorder(key);
this.mailToDivider=document.getElementById("mailCcDivider");
this.mailCcDivider=document.getElementById("mailBccDivider");
this.mailBccDivider=document.getElementById("mailDateDivider");
}
this.putExpand(key,this.expandTbody);
_4f3=0;
}
if(this.expanded){
this.expand();
}else{
this.collapse();
}
var _4f4=YAHOO.util.Dom.get(this.dragElId);
if(!_4f4){
_4f4=document.createElement("div");
_4f4.id=this.dragElId;
document.body.insertBefore(_4f4,document.body.firstChild);
}
var _4f5={maintainOffset:true,dragElId:this.dragElId};
this.toHdd=new YAHOO.util.DDProxy(this.mailToDivider,"toHdd",_4f5);
this.ccHdd=new YAHOO.util.DDProxy(this.mailCcDivider,"ccHdd",_4f5);
this.bccHdd=new YAHOO.util.DDProxy(this.mailBccDivider,"bccHdd",_4f5);
var DOM=YAHOO.util.Dom;
var _4f7=0;
this.toHdd.onMouseDown=function(e){
_4f7=YAHOO.util.Event.getPageY(e);
var del=this.getDragEl();
this.setInitPosition();
var _4fa="mailToArea";
if(!DOM.get(_4fa)||DOM.get(_4fa).style.display==="none"){
this.endDrag();
this.setYConstraint(0,0);
this.setXConstraint(0,0);
return;
}
var _4fb=parseInt((DOM.get(_4fa).style.height).split("px")[0],10);
var _4fc=DOM.getClientHeight()-DOM.getY(DOM.get(_4fa))-_4fb;
this.setYConstraint(_4fb-18,_4fc-40);
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
var _501=curY-_4f7;
var _502="mailToArea";
if(!DOM.get(_502)||DOM.get(_502).style.display==="none"){
return;
}
var _503=parseInt((DOM.get(_502).style.height).split("px")[0],10)+_501;
DOM.get(_502).style.height=_503+"px";
};
this.ccHdd.onMouseDown=function(e){
_4f7=YAHOO.util.Event.getPageY(e);
var del=this.getDragEl();
this.setInitPosition();
var _506="mailCcArea";
if(!DOM.get(_506)||DOM.get(_506).style.display==="none"){
this.endDrag();
this.setYConstraint(0,0);
this.setXConstraint(0,0);
return;
}
var _507=parseInt((DOM.get(_506).style.height).split("px")[0],10);
var _508=DOM.getClientHeight()-DOM.getY(DOM.get(_506))-_507;
this.setYConstraint(_507-18,_508-40);
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
var _50d=curY-_4f7;
var _50e="mailCcArea";
if(!DOM.get(_50e)||DOM.get(_50e).style.display==="none"){
return;
}
var _50f=parseInt((DOM.get(_50e).style.height).split("px")[0],10)+_50d;
DOM.get(_50e).style.height=_50f+"px";
};
this.bccHdd.onMouseDown=function(e){
_4f7=YAHOO.util.Event.getPageY(e);
var del=this.getDragEl();
this.setInitPosition();
var _512="mailBccArea";
if(!DOM.get(_512)||DOM.get(_512).style.display==="none"){
this.endDrag();
this.setYConstraint(0,0);
this.setXConstraint(0,0);
return;
}
var _513=parseInt((DOM.get(_512).style.height).split("px")[0],10);
var _514=DOM.getClientHeight()-DOM.getY(DOM.get(_512))-_513;
this.setYConstraint(_513-18,_514-40);
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
var _519=curY-_4f7;
var _51a="mailBccArea";
if(!DOM.get(_51a)||DOM.get(_51a).style.display==="none"){
return;
}
var _51b=parseInt((DOM.get(_51a).style.height).split("px")[0],10)+_519;
DOM.get(_51a).style.height=_51b+"px";
};
this.resize();
},showCursor:function(key){
var DOM=YAHOO.util.Dom;
var _51e=DOM.get("mail"+key+"Divider");
DOM.setStyle(_51e,"cursor","n-resize");
},hideCursor:function(key){
var DOM=YAHOO.util.Dom;
var _521=DOM.get("mail"+key+"Divider");
DOM.setStyle(_521,"cursor","default");
},_hideExcessCollapsedPairs:function(){
var max=this.maxDisplayCollapsed;
var _523=this._collapseResizeNodes.pluck("parentNode");
var _524=_523.splice(0,max);
var _525=_523;
var YDom=YAHOO.util.Dom;
_525.each(function(n,i){
if(YDom.hasClass(n,"da_nvPairFloatRight")){
_524.push(_525.splice(i,1).pop());
}
});
Element.show.apply(null,_524);
Element.hide.apply(null,_525);
},putCollapse:function(key,_52a){
var i,_52c,_52d,_52e,_52f,_530,_531;
if(!DA.util.isEmpty(this.nvpair[key].icon)){
_52c=document.createElement("div");
_530=document.createElement("div");
_52c.className=(this.nvpair[key].hidden)?"da_nvPairOuter da_nvPairHidden da_nvPairFloatRight":"da_nvPairOuter da_nvPairFloatRight";
_530.className="da_nvPairIcon";
this._collapsePair[key]={domPairElem:_52c,domIconElem:_530};
_530.innerHTML=DA.imageLoader.tag(this.nvpair[key].icon,"",{id:(DA.util.isEmpty(this.nvpair[key].id))?"":this.nvpair[key].id+"Icon"});
_52c.appendChild(_530);
_52a.appendChild(_52c);
this._collapseResizeExceptNodes.push(_52c);
}else{
if(!DA.util.isEmpty(this.nvpair[key].html)){
_52c=document.createElement("div");
_531=document.createElement("div");
_52c.className=(this.nvpair[key].hidden)?"da_nvPairOuter da_nvPairHidden da_nvPairFloatRight":"da_nvPairOuter da_nvPairFloatRight";
_531.className="da_nvPairHTML";
this._collapsePair[key]={domPairElem:_52c,domHTMLElem:_531};
if(!DA.util.isEmpty(this.nvpair[key].id)){
_531.id=this.nvpair[key].id+"HTML";
}
_531.innerHTML=this.nvpair[key].html;
_52c.appendChild(_531);
_52a.appendChild(_52c);
this._collapseResizeExceptNodes.push(_52c);
}else{
if(!DA.util.isEmpty(this.nvpair[key].name)||!DA.util.isEmpty(this.nvpair[key].value)){
_52c=document.createElement("div");
_52d=document.createElement("div");
_52e=document.createElement("div");
_52f=document.createElement("div");
_52c.className=(this.nvpair[key].hidden)?"da_nvPairOuter da_nvPairHidden":"da_nvPairOuter";
_52d.className="da_nvPairCollapseName da_nvPairFloatLeft";
_52e.className="da_nvPairValue da_nvPairFloatLeft";
_52e.style.width="25%";
_52f.className="da_nvPairSeparator da_nvPairFloatLeft";
this._collapsePair[key]={domPairElem:_52c,domNameElem:_52d,domValueElem:_52e};
if(!DA.util.isEmpty(this.nvpair[key].id)){
_52d.id=this.nvpair[key].id+"Name";
_52e.id=this.nvpair[key].id+"Value";
}
if(this.nvpair[key].weight===false){
_52d.style.fontWeight="normal";
_52e.style.fontWeight="normal";
_52f.style.fontWeight="normal";
}
_52d.innerHTML=this.nvpair[key].name;
_52e.innerHTML=this.nvpair[key].value;
_52f.innerHTML=":";
_52c.appendChild(_52d);
_52c.appendChild(_52f);
_52c.appendChild(_52e);
_52a.appendChild(_52c);
this._collapseResizeNodes.push(_52e);
this._collapseResizeExceptNodes.push(_52d);
this._collapseResizeExceptNodes.push(_52f);
}
}
}
},putExpand:function(key,_533){
var me=this;
var name,_536,_537,row;
var _539,_53a,_53b,_53c,_53d,_53e,_53f,_540,_541,_542;
if(this.nvpair[key].row){
row=(DA.util.isEmpty(this.nvpair[key].row))?"":this.nvpair[key].row;
_539=document.createElement("tr");
_541=document.createElement("td");
_542=document.createElement("div");
_541.colSpan=4;
_539.className=(this.nvpair[key].hidden)?"da_nvExpandedPair da_nvPairHidden":"da_nvExpandedPair";
_541.className="da_nvPairRow";
this._expandPair[key]={domPairElem:_539,domRowElem:_542};
if(!DA.util.isEmpty(this.nvpair[key].id)){
_539.id=this.nvpair[key].id+"Parent";
_542.id=this.nvpair[key].id+"Row";
}
if(this.nvpair[key].weight===false){
_542.style.fontWeight="normal";
}
_542.innerHTML=row;
_541.appendChild(_542);
_539.appendChild(_541);
_533.appendChild(_539);
}else{
if(!DA.util.isEmpty(this.nvpair[key].name)||!DA.util.isEmpty(this.nvpair[key].value)){
name=(DA.util.isEmpty(this.nvpair[key].name))?"":this.nvpair[key].name;
_536=(DA.util.isEmpty(this.nvpair[key].value))?"":this.nvpair[key].value;
_537=(DA.util.isEmpty(this.nvpair[key].expand))?"":this.nvpair[key].expand;
_539=document.createElement("tr");
_53a=document.createElement("td");
_53b=document.createElement("div");
_53c=document.createElement("td");
_53d=document.createElement("td");
_53e=document.createElement("div");
_53f=document.createElement("div");
_540=document.createElement("td");
_539.className=(this.nvpair[key].hidden)?"da_nvExpandedPair da_nvPairHidden":"da_nvExpandedPair";
_53a.className="da_toggleOuter";
_53c.className="da_nvPairExpandName";
_53d.className="da_nvPairValue da_nvPairBreak";
_540.className="da_nvPairSeparator";
this._expandPair[key]={domPairElem:_539,domPMElem:_53b,domNameElem:_53c,domValueElem:_53e,domExpandElem:_53f};
if(!DA.util.isEmpty(this.nvpair[key].id)){
_539.id=this.nvpair[key].id+"Parent";
_53b.id=this.nvpair[key].id+"PlusMinus";
_53c.id=this.nvpair[key].id+"Name";
_53e.id=this.nvpair[key].id+"Value";
_53f.id=this.nvpair[key].id+"Separator";
}
if(DA.util.isEmpty(_537)){
this.disableColumnExpand(key);
}else{
this.enableColumnExpand(key);
}
if(this.nvpair[key].weight===false){
_53c.style.fontWeight="normal";
_53d.style.fontWeight="normal";
_540.style.fontWeight="normal";
}
_53b.innerHTML=DA.imageLoader.nullTag();
_53c.innerHTML=name;
_53e.innerHTML=_536;
_53f.innerHTML=_537;
_540.innerHTML=":";
_53b.onclick=function(){
if(me.columnExpanded(key)){
me.collapseColumn(key);
}else{
me.expandColumn(key);
}
};
_53a.appendChild(_53b);
_53d.appendChild(_53e);
_53d.appendChild(_53f);
_539.appendChild(_53a);
_539.appendChild(_53c);
_539.appendChild(_540);
_539.appendChild(_53d);
_533.appendChild(_539);
}
}
},putExpandBorder:function(key){
var _544=document.createElement("tr");
var _545=document.createElement("td");
var _546=document.createElement("div");
if(key==="Cc"||key==="Bcc"||key==="Date"){
_546.className="da_nvPairDivider";
_546.id="mail"+key+"Divider";
_545.colSpan=5;
_545.className="da_nvPairBorder";
_545.appendChild(_546);
}else{
_545.innerHTML=DA.imageLoader.nullTag();
_545.className="da_nvPairBorder";
_545.colSpan=5;
}
_544.appendChild(_545);
this.expandTbody.appendChild(_544);
},changeName:function(key,name){
this.nvpair[key].name=(DA.util.isEmpty(name))?"":name;
if(this._expandPair[key]&&!this.columnIsRow(key)){
this._expandPair[key].domNameElem.innerHTML=this.nvpair[key].name;
}
if(this._collapsePair[key]&&!this.columnIsIcon(key)&&!this.columnIsHTML(key)){
this._collapsePair[key].domNameElem.innerHTML=this.nvpair[key].name;
}
this.resize();
},changeValue:function(key,_54a){
this.nvpair[key].value=(DA.util.isEmpty(_54a))?"":_54a;
var _54b,dom;
if(this._expandPair[key]&&!this.columnIsRow(key)){
if(DA.util.isEmpty(_54a)){
_54b=this._expandPair[key].domValueElem.parentNode;
dom=document.createElement("div");
dom.id=this._expandPair[key].domValueElem.id;
dom.className=this._expandPair[key].domValueElem.className;
_54b.removeChild(this._expandPair[key].domValueElem);
_54b.appendChild(dom);
this._expandPair[key].domValueElem=dom;
}else{
this._expandPair[key].domValueElem.innerHTML=this.nvpair[key].value;
}
}
if(this._collapsePair[key]&&!this.columnIsIcon(key)&&!this.columnIsHTML(key)){
this._collapsePair[key].domValueElem.innerHTML=this.nvpair[key].value;
}
this.resize();
},changeExpand:function(key,_54e){
this.nvpair[key].expand=(DA.util.isEmpty(_54e))?"":_54e;
if(this._expandPair[key]&&!this.columnIsRow(key)){
this._expandPair[key].domExpandElem.innerHTML=this.nvpair[key].expand;
if(DA.util.isEmpty(_54e)){
this.disableColumnExpand(key);
}else{
this.enableColumnExpand(key);
}
}
},changeNameValue:function(key,name,_551){
this.nvpair[key].name=(DA.util.isEmpty(name))?"":name;
this.nvpair[key].value=(DA.util.isEmpty(_551))?"":_551;
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
var _55d=tr.previousSibling;
var _55e=tr.nextSibling;
if(!_55d&&!_55e){
return;
}
if(_55e&&_55e.tagName==="TR"&&_55e.firstChild&&YAHOO.util.Dom.hasClass(_55e.firstChild,"da_nvPairBorder")){
_55e.style.display="";
return;
}
if(_55d&&_55d.tagName==="TR"&&_55d.firstChild&&YAHOO.util.Dom.hasClass(_55d.firstChild,"da_nvPairBorder")){
_55d.style.display="";
}
},hideColumn:function(key){
var tr=(this._expandPair[key])?this._expandPair[key].domPairElem:(this._collapsePair[key])?this._collapsePair[key].domPairElem:null;
if(!tr){
return;
}
YAHOO.util.Dom.addClass(tr,"da_nvPairHidden");
var _561=tr.previousSibling;
var _562=tr.nextSibling;
if(!_561&&!_562){
return;
}
if(_562&&_562.tagName==="TR"&&_562.firstChild&&YAHOO.util.Dom.hasClass(_562.firstChild,"da_nvPairBorder")){
_562.style.display="none";
return;
}
if(_561&&_561.tagName==="TR"&&_561.firstChild&&YAHOO.util.Dom.hasClass(_561.firstChild,"da_nvPairBorder")){
_561.style.display="none";
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
},scrollSeparator:function(key,_566){
var el=(_566===1)?this._expandPair[key].domExpandElem:this._expandPair[key].domValueElem;
if(el){
el.className="da_nvPairSeparator4scroll";
el.style.height="80px";
el.id="mail"+key+"Area";
}
},unscrollSeparator:function(key,_569){
var el=(_569===1)?this._expandPair[key].domExpandElem:this._expandPair[key].domValueElem;
if(el&&el.className){
el.className="";
el.style.height="";
el.id="";
}
},remove:function(_56b){
delete this.nvpair[_56b];
var exp=this._expandPair[_56b];
var col=this._collapsePair[_56b];
if(exp){
exp.domPairElem.parentNode.removeChild(exp.domPairElem);
}
if(col){
if(this.columnIsHTML(_56b)){
col.domIconElem.parentNode.removeChild(col.domHTMLElem);
}else{
if(this.columnIsIcon(_56b)){
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
var _571=0;
function borrow(n){
var tmp=_571;
_571-=n;
if(_571>=0){
return n;
}else{
_571=0;
return tmp;
}
}
var _574=this._collapseResizeNodes.map(function(el){
el.style.width="auto";
var _576=el.offsetWidth;
var _577=_576?d-_576:0;
if(_577>0){
_571+=_577;
}
return {el:el,origW:_576,excess:_577};
});
_574.each(function(node){
var _579=d;
if(node.excess<0&&_571>0){
_579+=borrow(-node.excess);
}else{
if(node.excess>0){
_579=node.origW;
}
}
node.el.style.width=_579+"px";
});
},_utils:{nodePositionComparator:BrowserDetect.browser==="Explorer"?function(l,r){
var comp=l.parentNode.sourceIndex-r.parentNode.sourceIndex;
return comp>0?1:comp<0?-1:0;
}:function(l,r){
var comp=l.parentNode.compareDocumentPosition(r.parentNode);
return comp===0?0:(comp===4)?-1:1;
}},reorder:function(_580){
var _581=_580||[];
var _582=this._collapsePair||{};
var ct=this.collapseTable;
var _584=ct&&ct.rows&&ct.rows[0]&&ct.rows[0].cells[0];
if(_584&&_584.insertBefore){
_581.reverse(false).each(function(key){
var pair=_582[key];
if(!pair){
return;
}
var _587=pair.domPairElem;
if(!_587){
return;
}
_584.insertBefore(_587,_584.firstChild);
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
DA.mailer.MessageEditor=function(_588,_589,_58a,_58b,_58c,_58d,_58e,_58f){
this.headerNode=_588;
this.headerId=_588.id;
this.textNode=_589;
this.textId=_589.id;
this.htmlNode=_58a;
this.htmlId=_58a.id;
this.previewNode=_58b;
this.previewId=_58b.id;
this.threePane=_58d;
this.requestUrl=_58e;
this.forced_interruption=0;
if(_58c){
if(DA.util.isFunction(_58c.onLoad)){
this.onLoad=_58c.onLoad;
}
if(DA.util.isFunction(_58c.onPreview)){
this.onPreview=_58c.onPreview;
}
if(DA.util.isFunction(_58c.onForcedInterruption)){
this.onForcedInterruption=_58c.onForcedInterruption;
}
if(DA.util.isFunction(_58c.onBack)){
this.onBack=_58c.onBack;
}
if(DA.util.isFunction(_58c.doResize)){
this.doResize=_58c.doResize;
}
if(DA.util.isFunction(_58c.onEnable)){
this.onEnable=_58c.onEnable;
}
}
if(_58f){
if(_58f.uploadCompleted){
this.ddAppletUploadCompleted=_58f.uploadCompleted;
}
if(_58f.beforeUpload){
this.ddAppletBeforeUpload=_58f.beforeUpload;
}
if(_58f.afterUpload){
this.ddAppletAfterUpload=_58f.afterUpload;
}
if(_58f.afterMoreThanMax){
this.ddAppletAfterMoreThanMax=_58f.afterMoreThanMax;
}
}
var _590=DA.util.parseQuery(this.requestUrl);
if(_590.external&&DA.util.cmpNumber(_590.external,1)){
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
var _592=["<div class=\"da_messageEditorHeader\">","<div id=\"da_messageEditorItemWarn\" class=\"da_messageEditorWarn\"></div>","<table class=\"da_messageEditorHeaderTable\">","<tr>","  <td colspan=\"2\" class=\"da_messageEditorHeaderTableTopLeft\">",DA.imageLoader.nullTag(1,3),"</td>","  <td class=\"da_messageEditorHeaderTableTopRight\">",DA.imageLoader.nullTag(2,3),"</td>","</tr>","<tr>","  <td class=\"da_messageEditorHeaderTableMiddleLeft\">",DA.imageLoader.nullTag(2,1),"</td>","  <td class=\"da_messageEditorHeaderTableMiddleCenter\">","    <table class=\"da_messageEditorHeaderContents\">","    <tr>","      <td><div id=\"",this.headerId,"Contents\"></div><div id=\"",this.headerId,"Preview\"></div></td>","    </tr>","    </table>","  </td>","  <td class=\"da_messageEditorHeaderTableMiddleRight\">",DA.imageLoader.nullTag(2,1),"</td>","</tr>","<tr>","  <td colspan=\"2\" class=\"da_messageEditorHeaderTableBottomLeft\">",DA.imageLoader.nullTag(1,2),"</td>","  <td class=\"da_messageEditorHeaderTableBottomRight\">",DA.imageLoader.nullTag(2,2),"</td>","</tr>","</table>","</div>"].join("");
var text=["<div id=\"",this.textId,"Contents\" class=\"da_messageEditorBody\">","<textarea id=\"da_messageEditorItemText\" class=\"da_messageEditorText\"></textarea>","</div>"].join("");
var _594=["<div id=\"",this.previewId,"Contents\" class=\"da_messageEditorBody da_messageEditorPreview\"></div>"].join("");
this._hideBodyText();
this.headerNode.innerHTML=_592;
this.textNode.innerHTML=text;
this.previewNode.innerHTML=_594;
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
var _595={To:{id:"da_messageEditorItemToField",name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_TO"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\"><input type=text id=\"da_messageEditorItemToText\" class=\"da_messageEditorItemText\">&nbsp;</span>","<span id=\"da_messageEditorItemAddressCcBcc\" class=\"da_messageEditorItemInner da_messageEditorPointer\">",DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_ccbcc.gif"),"</span>","<span>&nbsp;</span>","<span id=\"da_messageEditorItemToAddress\" class=\"da_messageEditorItemInner da_messageEditorPointer\">",DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_address_off.gif"),"</span>","<div id=\"da_messageEditorItemToTextACContainer\" class=\"da_autoCompleteContainer\"></div>","<div id=\"da_messageEditorItemTo\" class=\"da_messageEditorItemInner\"></div>","</div>"].join("")},Cc:{id:"da_messageEditorItemCcField",name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CC"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\"><input type=text id=\"da_messageEditorItemCcText\" class=\"da_messageEditorItemText\">&nbsp;&nbsp;</span>","<span id=\"da_messageEditorItemCcAddress\" class=\"da_messageEditorItemInner da_messageEditorPointer\">",DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_address_off.gif"),"</span>","<div id=\"da_messageEditorItemCcTextACContainer\" class=\"da_autoCompleteContainer\"></div>","<div id=\"da_messageEditorItemCc\" class=\"da_messageEditorItemInner\"></div>","</div>"].join(""),border:false,hidden:true},Bcc:{id:"da_messageEditorItemBccField",name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_BCC"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\"><input type=text id=\"da_messageEditorItemBccText\" class=\"da_messageEditorItemText\">&nbsp;&nbsp;</span>","<span id=\"da_messageEditorItemBccAddress\" class=\"da_messageEditorItemInner da_messageEditorPointer\">",DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_address_off.gif"),"</span>","<div id=\"da_messageEditorItemBccTextACContainer\" class=\"da_autoCompleteContainer\"></div>","<div id=\"da_messageEditorItemBcc\" class=\"da_messageEditorItemInner\"></div>","</div>"].join(""),border:false,hidden:true},From:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_FROM"),value:["<div class=\"da_messageEditorItemOuter\">","<span id=\"da_messageEditorItemFromName\" class=\"da_messageEditorItemInner\"></span>","<span id=\"da_messageEditorItemFromAddress\" class=\"da_messageEditorItemInner\"></span>","<span id=\"da_messageEditorItemReplyUseOuter\" class=\"da_messageEditorItemInner\">&nbsp;","<input type=checkbox id=\"da_messageEditorItemReplyUse\">&nbsp;",DA.locale.GetText.t_("MESSAGE_CHECKBOXMESSAGE_REPLYUSE"),"&nbsp;","</span>","</div>"].join("")},Subject:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_SUBJECT"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\"><input type=text id=\"da_messageEditorItemSubject\" class=\"da_messageEditorItemText\">&nbsp;</span>","<span class=\"da_messageEditorItemInner\">",DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_PRIORITY"),"&nbsp;:&nbsp;","<select id=\"da_messageEditorItemPriority\" size=1 disabled=\"disabled\">","<option value=\"1\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_HIGH"),"</option>","<option value=\"3\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_NORMAL"),"</option>","<option value=\"5\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_LOW"),"</option>","</select>","</span>","</div>"].join("")},Attachment:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_ATTACHMENTFILE"),value:["<div class=\"da_messageEditorItemOuter\">",(DA.vars.config.upload_file_applet==="inline"||DA.vars.config.upload_file_applet==="hidden")?"<div id=\"da_messageEditorItemAttachmentDDApplet\" class=\"da_messageEditorItemInner\"></div>":"","<span id=\"da_messageEditorItemAttachmentButtonsOuter\" class=\"da_messageEditorItemInner\" style=\"float:right;\">","<input id=\"da_messageEditorItemAttachmentButtonsApplet\" type=button value=\""+DA.locale.GetText.t_("EDITOR_SHOW_APPLET_BUTTON")+"\" ",(DA.vars.config.upload_file_applet==="hidden")?"":" style=\"display:none;\""," disabled>","<input id=\"da_messageEditorItemAttachmentButtonsLibrary\" type=button value=\""+DA.locale.GetText.t_("EDITOR_LIBRARYSEL_BUTTON")+"\" style=\"display:none;\" disabled>","</span>","<span id=\"da_messageEditorItemAttachmentFormOuter\" class=\"da_messageEditorItemInner\"></span>","<div id=\"da_messageEditorItemAttachment\" class=\"da_messageEditorItemInner\"></div>","</div>"].join("")},Options:{name:DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_OPTIONS"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\">",DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_SIGN"),"&nbsp;:&nbsp;","<span id=\"da_messageEditorItemSignList\"></span>&nbsp;","</span>","<span class=\"da_messageEditorItemInner\">",DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CHARSET"),"&nbsp;:&nbsp;","<select id=\"da_messageEditorItemCharset\" size=1 disabled=\"disabled\">","<option value=\"ISO-2022-JP\">",DA.locale.GetText.t_("MESSAGE_CHARSET_ISO2022JP"),"</option>","<option value=\"UTF-8\">",DA.locale.GetText.t_("MESSAGE_CHARSET_UTF8"),"</option>","</select>&nbsp;","</span>","<span id=\"da_messageEditorItemContentTypeAll\" class=\"da_messageEditorItemInner\">",DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CONTENTTYPE"),"&nbsp;:&nbsp;","<select id=\"da_messageEditorItemContentType\" size=1 disabled=\"disabled\">","<option value=\"text\">",DA.locale.GetText.t_("MESSAGE_CONTENTTYPE_TEXT"),"</option>","<option value=\"html\">",DA.locale.GetText.t_("MESSAGE_CONTENTTYPE_HTML"),"</option>","</select>&nbsp;","</span>","<span class=\"da_messageEditorItemInner\">","<input type=checkbox id=\"da_messageEditorItemNotification\">&nbsp;",DA.locale.GetText.t_("MESSAGE_CHECKBOXMESSAGE_NOTIFICATION"),"&nbsp;","</span>","<span id=\"da_messageEditorItemOpenStatusOuter\" class=\"da_messageEditorItemInner\">"+"<input type=checkbox id=\"da_messageEditorItemOpenStatus\">&nbsp;",DA.locale.GetText.t_("MESSAGE_CHECKBOXMESSAGE_OPENSTATUS"),"&nbsp;","</span>","<span id=\"da_messageEditorItemGroupNameOuter\" class=\"da_messageEditorItemInner\">"+"<br><input type=checkbox id=\"da_messageEditorItemGroupName\">&nbsp;",DA.locale.GetText.t_("MESSAGE_CHECKBOXMESSAGE_GROUPNAME"),"&nbsp;","</span>","</div>"].join("")},Hidden:{name:"hidden",value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\">","<input type=hidden id=\"da_messageEditorItemInReplyTo\" value=\"\">","<input type=hidden id=\"da_messageEditorItemReferences\" value=\"\">","</span>","</div>"].join(""),border:false,hidden:true},Custom:{id:"da_messageEditorItemCustom",row:DA.vars.custom.editor.headerOpen,html:DA.vars.custom.editor.headerClose,border:false,hidden:(DA.vars.custom.editor.headerOpen||DA.vars.custom.editor.headerClose)?false:true},SubjectCollapse:{name:DA.imageLoader.nullTag(14,14)+DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_SUBJECT"),value:["<div class=\"da_messageEditorItemOuter\">","<span class=\"da_messageEditorItemInner\"><input type=text id=\"da_messageEditorItemSubjectCollapse\" class=\"da_messageEditorItemText\">&nbsp;</span>","<span class=\"da_messageEditorItemInner\">",DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_PRIORITY"),"&nbsp;:&nbsp;","<select id=\"da_messageEditorItemPriorityCollapse\" size=1 disabled=\"disabled\">","<option value=\"1\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_HIGH"),"</option>","<option value=\"3\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_NORMAL"),"</option>","<option value=\"5\">",DA.locale.GetText.t_("MESSAGE_PRIORITY_LOW"),"</option>","</select>","</span>","</div>"].join("")}};
DA.customEvent.fire("messageEditorRewriteNVPairParams",this,_595);
this.contentsPairs=new DA.widget.NVPairSet($(this.headerId+"Contents"),_595,["SubjectCollapse"],true);
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
var _598=YAHOO.util.Event.getTarget(e);
var _599;
if(_598){
_599=_598.className;
if(_599.match(/(^|\s)da_ugInformationListPopup(\s|$)/)){
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
var i,sno,_5a3;
var dst=null;
var _5a5=false;
var stop;
window.dragedElClassName="";
stop=setTimeout(function(){
_5a5=true;
if(node){
if(node.className.match(/da_ugInformationListDragDrop_(\d+)/)){
_5a3=node.parentNode;
if(_5a3){
if(_5a3.className.match(/da_ugInformationListDragDrop_(\d+)/)){
window.dragedElClassName=_5a3.className;
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
if(!_5a5){
clearTimeout(stop);
me.dragAddressTo.endDrag();
}
};
};
this.dragAddressTo.onDragEnter=function(e,id){
var _5aa=null;
var div=null;
var _5ac=null;
var _5ad=null;
if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)){
if(id.indexOf("Text")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5aa=document.createElement("hr");
_5aa.style.height="2px";
_5aa.style.display="block";
_5aa.style.backgroundColor="gray";
_5aa.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5aa.style.marginTop="-9px";
_5aa.style.borderWidth="2px";
}else{
_5aa.style.borderWidth="1px";
}
div.appendChild(_5aa);
if(id.indexOf("To")>0){
_5ac=document.getElementById("da_messageEditorItemTo");
}else{
if(id.indexOf("Cc")>0){
_5ac=document.getElementById("da_messageEditorItemCc");
}else{
if(id.indexOf("Bcc")>0){
_5ac=document.getElementById("da_messageEditorItemBcc");
}
}
}
_5ad=_5ac.childNodes[0];
if(_5ad){
_5ac.insertBefore(div,_5ac.childNodes[0]);
}else{
_5ac.appendChild(div);
_5ac.style.display="block";
}
}else{
if(id.indexOf("da_ugInformationList")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5aa=document.createElement("hr");
_5aa.style.height="2px";
_5aa.style.display="block";
_5aa.style.backgroundColor="gray";
_5aa.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5aa.style.marginTop="-9px";
_5aa.style.borderWidth="2px";
}else{
_5aa.style.borderWidth="1px";
}
div.appendChild(_5aa);
document.getElementById(id).appendChild(div);
}
}
}
};
this.dragAddressTo.onDragDrop=function(e,id){
var _5b0=null;
var mask=null;
var _5b2=me._controller("to");
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
me.insertBeforeNode("to",me.selectedSno,"cc",0,_5b2.get(me.selectedSno));
}else{
if(id.match(/da_messageEditorItemBccText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
mask.parentNode.removeChild(mask);
me.insertBeforeNode("to",me.selectedSno,"bcc",0,_5b2.get(me.selectedSno));
}else{
if(id.match(/da_ugInformationListToLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"to",id);
_5b0=document.getElementById("insertAddressAfterMark"+id);
if(_5b0){
_5b0.parentNode.removeChild(_5b0);
}
}else{
if(id.match(/da_ugInformationListCcLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"cc",id);
_5b0=document.getElementById("insertAddressAfterMark"+id);
if(_5b0){
_5b0.parentNode.removeChild(_5b0);
}
}else{
if(id.match(/da_ugInformationListBccLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"bcc",id);
_5b0=document.getElementById("insertAddressAfterMark"+id);
if(_5b0){
_5b0.parentNode.removeChild(_5b0);
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
var i,sno,_5bd;
var dst=null;
var _5bf=false;
var stop;
window.dragedElClassName="";
stop=setTimeout(function(){
_5bf=true;
if(node){
if(node.className.match(/da_ugInformationListDragDrop_(\d+)/)){
_5bd=node.parentNode;
if(_5bd){
if(_5bd.className.match(/da_ugInformationListDragDrop_(\d+)/)){
window.dragedElClassName=_5bd.className;
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
if(!_5bf){
clearTimeout(stop);
me.dragAddressTo.endDrag();
}
};
};
this.dragAddressCc.onDragEnter=function(e,id){
var _5c4=null;
var div=null;
var _5c6=null;
var _5c7=null;
if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)){
if(id.indexOf("Text")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5c4=document.createElement("hr");
_5c4.style.height="2px";
_5c4.style.display="block";
_5c4.style.backgroundColor="gray";
_5c4.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5c4.style.marginTop="-9px";
_5c4.style.borderWidth="2px";
}else{
_5c4.style.borderWidth="1px";
}
div.appendChild(_5c4);
if(id.indexOf("To")>0){
_5c6=document.getElementById("da_messageEditorItemTo");
}else{
if(id.indexOf("Cc")>0){
_5c6=document.getElementById("da_messageEditorItemCc");
}else{
if(id.indexOf("Bcc")>0){
_5c6=document.getElementById("da_messageEditorItemBcc");
}
}
}
_5c7=_5c6.childNodes[0];
if(_5c7){
_5c6.insertBefore(div,_5c6.childNodes[0]);
}else{
_5c6.appendChild(div);
_5c6.style.display="block";
}
}else{
if(id.indexOf("da_ugInformationList")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5c4=document.createElement("hr");
_5c4.style.height="2px";
_5c4.style.display="block";
_5c4.style.backgroundColor="gray";
_5c4.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5c4.style.marginTop="-9px";
_5c4.style.borderWidth="2px";
}else{
_5c4.style.borderWidth="1px";
}
div.appendChild(_5c4);
document.getElementById(id).appendChild(div);
}
}
}
};
this.dragAddressCc.onDragDrop=function(e,id){
var _5ca=null;
var mask=null;
var _5cc=me._controller("cc");
if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)){
if(id){
if(id.match(/da_messageEditorItemToText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemToText");
mask.parentNode.removeChild(mask);
me.insertBeforeNode("cc",me.selectedSno,"to",0,_5cc.get(me.selectedSno));
}else{
if(id.match(/da_messageEditorItemCcText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemCcText");
mask.parentNode.removeChild(mask);
me.moveTop("cc",me.selectedSno,"cc",1);
}else{
if(id.match(/da_messageEditorItemBccText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
mask.parentNode.removeChild(mask);
me.insertBeforeNode("cc",me.selectedSno,"bcc",0,_5cc.get(me.selectedSno));
}else{
if(id.match(/da_ugInformationListToLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"to",id);
_5ca=document.getElementById("insertAddressAfterMark"+id);
if(_5ca){
_5ca.parentNode.removeChild(_5ca);
}
}else{
if(id.match(/da_ugInformationListCcLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"cc",id);
_5ca=document.getElementById("insertAddressAfterMark"+id);
if(_5ca){
_5ca.parentNode.removeChild(_5ca);
}
}else{
if(id.match(/da_ugInformationListBccLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"bcc",id);
_5ca=document.getElementById("insertAddressAfterMark"+id);
if(_5ca){
_5ca.parentNode.removeChild(_5ca);
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
var i,sno,_5d7;
var dst=null;
var _5d9=false;
var stop;
window.dragedElClassName="";
stop=setTimeout(function(){
_5d9=true;
if(node){
if(node.className.match(/da_ugInformationListDragDrop_(\d+)/)){
_5d7=node.parentNode;
if(_5d7){
if(_5d7.className.match(/da_ugInformationListDragDrop_(\d+)/)){
window.dragedElClassName=_5d7.className;
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
if(!_5d9){
clearTimeout(stop);
me.dragAddressBcc.endDrag();
}
};
};
this.dragAddressBcc.onDragEnter=function(e,id){
var _5de=null;
var div=null;
var _5e0=null;
var _5e1=null;
if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)){
if(id.indexOf("Text")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5de=document.createElement("hr");
_5de.style.height="2px";
_5de.style.display="block";
_5de.style.backgroundColor="gray";
_5de.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5de.style.marginTop="-9px";
_5de.style.borderWidth="2px";
}else{
_5de.style.borderWidth="1px";
}
div.appendChild(_5de);
if(id.indexOf("To")>0){
_5e0=document.getElementById("da_messageEditorItemTo");
}else{
if(id.indexOf("Cc")>0){
_5e0=document.getElementById("da_messageEditorItemCc");
}else{
if(id.indexOf("Bcc")>0){
_5e0=document.getElementById("da_messageEditorItemBcc");
}
}
}
_5e1=_5e0.childNodes[0];
if(_5e1){
_5e0.insertBefore(div,_5e0.childNodes[0]);
}else{
_5e0.appendChild(div);
_5e0.style.display="block";
}
}else{
if(id.indexOf("da_ugInformationList")>=0){
div=document.createElement("div");
div.className="insertAddressAfterMark";
div.id="insertAddressAfterMark"+id;
_5de=document.createElement("hr");
_5de.style.height="2px";
_5de.style.display="block";
_5de.style.backgroundColor="gray";
_5de.style.borderColor="gray";
if(BrowserDetect.browser==="Explorer"){
_5de.style.marginTop="-9px";
_5de.style.borderWidth="2px";
}else{
_5de.style.borderWidth="1px";
}
div.appendChild(_5de);
document.getElementById(id).appendChild(div);
}
}
}
};
this.dragAddressBcc.onDragDrop=function(e,id){
var _5e4=null;
var mask=null;
var _5e6=me._controller("bcc");
if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)){
if(id){
if(id.match(/da_messageEditorItemToText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemToText");
mask.parentNode.removeChild(mask);
me.insertBeforeNode("bcc",me.selectedSno,"to",0,_5e6.get(me.selectedSno));
}else{
if(id.match(/da_messageEditorItemCcText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemCcText");
mask.parentNode.removeChild(mask);
me.insertBeforeNode("bcc",me.selectedSno,"cc",0,_5e6.get(me.selectedSno));
}else{
if(id.match(/da_messageEditorItemBccText/)){
mask=document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
mask.parentNode.removeChild(mask);
me.moveTop("bcc",me.selectedSno,"bcc",1);
}else{
if(id.match(/da_ugInformationListToLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"to",id);
_5e4=document.getElementById("insertAddressAfterMark"+id);
if(_5e4){
_5e4.parentNode.removeChild(_5e4);
}
}else{
if(id.match(/da_ugInformationListCcLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"cc",id);
_5e4=document.getElementById("insertAddressAfterMark"+id);
if(_5e4){
_5e4.parentNode.removeChild(_5e4);
}
}else{
if(id.match(/da_ugInformationListBccLineId_(\d+)/)){
me.insertAfterNode(me.selectedFld,me.selectedSno,"bcc",id);
_5e4=document.getElementById("insertAddressAfterMark"+id);
if(_5e4){
_5e4.parentNode.removeChild(_5e4);
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
var _5ea="/dui/richtext/";
var me=this;
window.FCKeditor_OnComplete=function(_5ec){
me._FCKEditorCompleted=true;
};
this.fck=new FCKeditor(this.htmlId+"Contents");
this.fck.BasePath=_5ea;
this.fck.Config.CustomConfigurationsPath=_5ea+DA.vars.richText.fckconfig.custom_file;
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
var _5ef;
var _5f0="<font color=red>"+DA.util.encode(DA.vars.appletDisabledMessage)+"</font>";
var _5f1=YAHOO.util.Dom.get("da_messageEditorItemAttachmentDDApplet");
var _5f2=YAHOO.util.Dom.get("da_messageEditorItemAttachmentButtonsApplet");
if((DA.vars.config.upload_file_applet==="inline"||DA.vars.config.upload_file_applet==="hidden")&&this.ddAppletAfterUpload&&o.maid){
_5ef=["<applet mayscript code=\"at.activ8.a8dropzone.A8Dropzone\" codebase=\""+DA.util.encode(DA.vars.appletRdir)+"\" archive=\""+DA.util.encode(DA.vars.appletFile)+"\" name=\"A8Dropzone\" width=\"100%\" height=\"40px\">","<param name=\"postURL\" value=\""+DA.util.encode(DA.util.getServer()+DA.vars.cgiRdir+"/ajx_ma_upload.cgi?applet=1")+"\">","<param name=\"postParam0\" value=\"key="+DA.util.encode(DA.util.getSessionId())+"\">","<param name=\"postParam1\" value=\"proc=add\">","<param name=\"postParam2\" value=\"maid="+DA.util.encode(o.maid)+"\">","<param name=\"JavaScriptUploadCompleted\" value=\""+DA.util.encode(this.ddAppletUploadCompleted)+"\">","<param name=\"JavaScriptBeforeUpload\" value=\""+DA.util.encode(this.ddAppletBeforeUpload)+"\">","<param name=\"JavaScriptAfterUpload\" value=\""+DA.util.encode(this.ddAppletAfterUpload)+"\">","<param name=\"label\" value=\""+DA.util.encode(DA.vars.appletLabel)+"\">","<param name=\"bgImageName\" value=\""+DA.util.encode(DA.vars.appletImage)+"\">","<param name=\"encoding\" value=\""+DA.util.encode(DA.vars.charset)+"\">","<param name=\"maxFileNum\" value=\""+DA.util.encode(DA.vars.appletMaxFile)+"\">","<param name=\"moreThanMaxMessage\" value=\""+DA.util.encode(DA.vars.appletMoreThanMaxMessage)+"\">","<param name=\"JavaScriptmoreThanMax\" value=\""+DA.util.encode(this.ddAppletAfterMoreThanMax)+"\">","<param name=\"openButton\" value=\""+DA.util.encode(DA.vars.appletFiler)+"\">","<param name=\"directoryUpload\" value=\"false\">",_5f0,"</applet>"].join("");
_5f2.style.display="none";
_5ef="<table width=100%><tr><td width=100%>"+_5ef+"</td><td align=left valign=top><img  src=\""+DA.vars.imgRdir+"/dd_helpico.gif\" title=\""+DA.util.encode(DA.vars.appletTipMessage)+"\" border=0></td></tr></table>";
_5f1.innerHTML=_5ef;
if(_5f1.innerHTML===""){
_5f1.innerHTML=_5f0;
}
this.doResize();
}
},values:function(){
var _5f3={maid:this.selectedMaid,tid:this.selectedTid,sid:this.selectedSid,priority:(this.contentsPairs.expanded)?DA.dom.selectValue("da_messageEditorItemPriority"):DA.dom.selectValue("da_messageEditorItemPriorityCollapse"),charset:DA.dom.selectValue("da_messageEditorItemCharset"),notification:(DA.dom.checkedOk("da_messageEditorItemNotification")?1:0),preview:0,reply_use:(DA.dom.checkedOk("da_messageEditorItemReplyUse")?1:0),group_name:(DA.dom.checkedOk("da_messageEditorItemGroupName")?1:0),open_status:(DA.dom.checkedOk("da_messageEditorItemOpenStatus")?1:0),to_list:this.toController.list(),cc_list:this.ccController.list(),bcc_list:this.bccController.list(),to_text:DA.dom.textValue("da_messageEditorItemToText"),cc_text:DA.dom.textValue("da_messageEditorItemCcText"),bcc_text:DA.dom.textValue("da_messageEditorItemBccText"),from:{select:DA.dom.selectValue("da_messageEditorItemFromAddressSelect")},in_reply_to:DA.dom.hiddenValue("da_messageEditorItemInReplyTo"),references:DA.dom.hiddenValue("da_messageEditorItemReferences"),subject:(this.contentsPairs.expanded)?DA.dom.textValue("da_messageEditorItemSubject"):DA.dom.selectValue("da_messageEditorItemSubjectCollapse"),body:{text:this._getText(),html:this._getHTML()},attach_list:this.fileController.list()};
DA.customEvent.fire("messageEditorValuesAfter",this,_5f3);
return _5f3;
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
var i,_5f8=["email","keitai_mail","pmail1","pmail2"],html="";
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
for(i=0;i<_5f8.length;i++){
if(!DA.util.isEmpty(o.from[_5f8[i]])){
html+="<option value=\""+_5f8[i]+"\">"+DA.util.encode(o.from[_5f8[i]])+"</option>";
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
var _5fb,_5fc;
var _5fd=/^<\!-- Created by DA_Richtext .*? end default style -->/;
var _5fe=/<style>.*?<\/style>/;
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
_5fb=o.body.html.match(_5fe);
_5fc=o.body.html.replace(_5fe,"");
FCKEditorIframeController.createIframe(this.previewId+"Contents"+"FckEditorPreViewer",this.previewContentsNode);
FCKEditorIframeController.setIframeBody(this.previewId+"Contents"+"FckEditorPreViewer",["<head>",_5fb,"<style>body {margin:0px; padding:0px; border:0;}</style>","<script>function Pop4Ajax(Url,Width,Height,POSX,POSY){ top.Pop4Ajax(Url,Width,Height,POSX,POSY);}</script>","</head>","<body>","<div style=\"word-break:break-all\">",_5fc,"</div>","</body>"].join("\n"));
}else{
this.previewContentsNode.innerHTML=o.body.html;
}
}
},edit:function(_5ff){
var me=this;
var h={proc:_5ff.proc};
var _602;
var _603;
var _604;
var i=0;
if(me.lock()){
me.jsonIO.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me.selectedFid=parseInt(_5ff.fid,10);
me.proc=_5ff.proc;
if(me.proc==="new"){
me.selectedUid=null;
}else{
me.selectedUid=parseInt(_5ff.uid,10);
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
if(DA.util.isEmpty(_5ff.url)){
if(!DA.util.isEmpty(_5ff.fid)){
h.fid=_5ff.fid;
h.uid=_5ff.uid;
}
if(!DA.util.isEmpty(_5ff.backup_maid)){
h.backup_maid=_5ff.backup_maid;
me.backup_maid=_5ff.backup_maid;
}
if(!DA.util.isEmpty(_5ff.tid)){
h.tid=_5ff.tid;
}
if(!DA.util.isEmpty(_5ff.quote)){
h.quote=_5ff.quote;
}
me.jsonIO.execute(h);
}else{
h=DA.util.parseQuery(DA.util.pack(_5ff.url));
me.jsonIO.execute(h);
}
}
},setAutoBackup:function(){
this._autoBackup();
},_autoBackup:function(){
var me=this;
var val,_60a,xml,_60c,io;
if(me.lock()){
val=me.values();
me.unlock();
xml=DA.util.makeXml(val,"ajx_ma_new.cgi");
_60c=xml;
_60c=_60c.replace(/!-- start default style.*!-- end default style/ig,"");
if(me.autoBackupedXML===_60c){
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
me.autoBackupedXML=_60c;
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
},sign:function(sid,_617,from,_619){
var me=this;
var io,_61c,body;
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
_61c=DA.dom.selectValue("da_messageEditorItemContentTypeAll");
body=(_61c==="html")?this._getHTML():this._getText();
io.execute({sid:sid,before_sid:_617,content_type:_61c,from:from,before_from:_619,body:body});
}
},transmit:function(){
var me=this;
var _621=this.spellcheckMode;
var id;
var _623=0;
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
_623+=1;
if(_623>DA.vars.system.upload_retry4ajx){
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
var _629="";
var i;
var _62b;
if(DA.mailer.util.checkResult(o)){
if(o.warn&&o.warn.length>0){
if(DA.tipDlg&&"function"===typeof DA.tipDlg.init){
for(i=0;i<o.warn.length;i++){
_629+="[ ! ] "+o.warn[i]+"<br>";
if(o.warn[i]===DA.locale.GetText.t_("SPELLCHECK_NG")){
_62b="preview";
}
}
DA.tipDlg.init(DA.locale.GetText.t_("MAIL_SEND_CONFIRM"),DA.locale.GetText.t_("READY_OK"),_629,_62b);
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
io.execute({proc:"send",maid:me.selectedMaid,backup_maid:me.backup_maid,Preproc:me.proc,fid:me.selectedFid,uid:me.selectedUid,mode:me.mode,xml:xml,nopreview:(me.previewMode)?1:0,spellcheck:_621,content_type:YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value,external:this.external?1:0});
}
},1000);
}else{
me.unlock();
}
}
},save:function(){
var me=this;
var id;
var _62f=0;
var _630=0;
if(me.lock()){
if(this.previewMode||!DA.util.isEmpty(DA.dom.textValue("da_messageEditorItemSubject"))||!DA.util.isEmpty(DA.dom.textValue("da_messageEditorItemSubjectCollapse"))||DA.util.confirm(DA.locale.GetText.t_("EDITOR_TITLEEMPTY_SAVE_CONFIRM"))){
if(DA.tipDlg.isInit()){
DA.tipDlg.hide();
}
DA.waiting.show(DA.locale.GetText.t_("SAVE_OPERATING_PROMPT"));
id=setInterval(function(){
var io,val,xml;
_630+=1;
if(_630>DA.vars.system.upload_retry4ajx){
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
_62f=1;
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
if(_62f===1){
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
var _637=this.spellcheckMode;
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
io.execute({proc:"preview",maid:me.selectedMaid,uid:me.selectedUid,fid:me.selectedFid,xml:xml,spellcheck:_637,content_type:YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value});
}
},1000);
}
},print:function(_63e){
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
DA.windowController.winOpen(DA.vars.cgiRdir+"/ma_ajx_print.cgi?maid="+me.selectedMaid+"&content_type="+YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value+"&printtoconfig="+_63e,"",710,600);
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
},spellcheck:function(_646,_647){
this.spellcheckMode=_646;
if(_647==="preview"){
this.preview();
}else{
if(_647==="transmit"){
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
var _64b=self.document;
var _64c=function(){
var mode=_64b.compatMode;
var _64e=(mode==="CSS1Compat")?_64b.documentElement.clientWidth:_64b.body.clientWidth;
return _64e;
};
var _64f=function(){
var mode=_64b.compatMode;
var _651=(mode==="CSS1Compat")?_64b.documentElement.clientHeight:_64b.body.clientHeight;
return _651;
};
var _652=_64c();
var _653=_64f();
try{
this.addressWidth(_652);
this.addressHeight(_653);
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
var _658="";
var Proc="ma_address.cgi%3ffld="+fld+":"+this.selectedMaid+"%20search_target="+_658;
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
var io,i,time,_663,name;
if(!me.existsLock()){
time=DA.util.getTime();
_663=me.currentUploadForm;
for(i=0;i<_663.childNodes.length;i++){
switch(_663.childNodes[i].name){
case "path":
name=_663.childNodes[i].value;
break;
case "maid":
_663.childNodes[i].value=me.selectedMaid;
break;
default:
break;
}
}
if(!name.match(/^\s*$/)){
me._hideUploadForm(_663);
me._addUploadForm();
me.fileController.add({aid:"dummy_"+time,name:name,size:0,icon:"",warn:"",link:"",document:""});
me.uploading[time]=true;
me.doResize();
io=new DA.io.FileUploadIO(DA.vars.cgiRdir+"/ajx_ma_upload.cgi");
io.callback=function(o,args){
me.fileController.remove("dummy_"+args.time);
me._removeUploadForm(_663);
if(DA.mailer.util.checkResult(o)){
me.add(o);
me.doResize();
}
me.uploading[args.time]=false;
};
io.errorHandler=function(e,args){
DA.util.warn(DA.locale.GetText.t_("UPLOAD_ERROR"));
me.fileController.remove("dummy_"+args.time);
me._removeUploadForm(_663);
me.uploading[args.time]=false;
me.doResize();
};
io.execute(_663,{time:time});
}
}
},isUploading:function(){
var time,_66a=false;
for(time in this.uploading){
if(!DA.util.isFunction(this.uploading[time])){
if(this.uploading[time]){
_66a=true;
}
}
}
return _66a;
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
var _672=YAHOO.util.Event.getCharCode(event);
if(_672===Event.KEY_ESC){
return false;
}else{
if(path.value.match(/^\s*$/)&&_672===Event.KEY_RETURN){
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
},_switchContentType:function(_675){
if(_675==="text"){
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
},_showRnDialog:function(_686,x,y){
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
this.rnDialog.setString(_686);
this.rnDialog.show(x,y);
},_hideRnDialog:function(){
if(this.rnDialog){
this.rnDialog.hide();
}
},_showCeDialog:function(_68c,x,y){
var me=this;
if(!this.ceDialog){
this.ceDialog=new DA.widget.StringChangerDialog("da_messageEditorChangeEmailDialog",DA.locale.GetText.t_("EDITOR_DIALOG_CHANGEEMAIL"),"",{onEnter:function(){
var _690=YAHOO.util.Dom.get(me.ceDialog.childId("text")).value;
me.changeEmail(me.selectedFld,me.selectedSno,_690);
return true;
}});
}
this.ceDialog.setString(_68c);
this.ceDialog.show(x,y);
},_hideCeDialog:function(){
if(this.ceDialog){
this.ceDialog.hide();
}
},_showPopupMenu:function(fld,sno){
var _693=this._controller(fld);
var me=this;
var io;
if(!this.existsLock()){
if(_693.isUser(sno)){
io=this.userIO;
}else{
if(_693.isAddr(sno)){
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
if(_693.isUser(sno)){
io.execute({proc:"email",mid:_693.get(sno,"id")});
}else{
io.execute({proc:"email",id:_693.get(sno,"id")});
}
}else{
me._makePopupMenu(fld,sno);
me.popup.show();
}
}
},_makePopupMenu:function(fld,sno,o){
var _69b=this._controller(fld);
var me=this;
var i,j=0;
me.popup.menuData.order=[];
me.popup.menuData.items={};
me.popup.menuData.className="da_messageEditorItemAddressPopupMenu";
if(_69b.isGroup(sno)){
me.popup.menuData.order[j]=["openGroup"];
me.popup.menuData.items.openGroup={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_OPENGROUP"),args:[fld,sno],onclick:function(e,a){
me.openGroup(a[0],a[1]);
}};
j++;
}
if(_69b.isAddr(sno)||_69b.isUser(sno)){
me.popup.menuData.order[j]=["titleOff"];
me.popup.menuData.items.titleOff={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_TITLEOFF"),args:[fld,sno],onclick:function(e,a){
me.titleOff(a[0],a[1]);
}};
if(DA.vars.user_information_restriction.title!=="off"||!_69b.isUser(sno)){
me.popup.menuData.order[j].push("titleOn");
me.popup.menuData.items.titleOn={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_TITLEON"),args:[fld,sno],onclick:function(e,a){
me.titleOn(a[0],a[1],0);
}};
}
if(DA.vars.user_information_restriction.title_name!=="off"||!_69b.isUser(sno)){
me.popup.menuData.order[j].push("titleNameOn");
me.popup.menuData.items.titleNameOn={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_TITLENAMEON"),args:[fld,sno],onclick:function(e,a){
me.titleOn(a[0],a[1],1);
}};
}
j++;
}
if(_69b.isAddr(sno)||_69b.isUser(sno)){
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
if(!_69b.isGroup(sno)){
if(_69b.isML(sno)){
me.popup.menuData.order[j]=["changeName"];
}else{
me.popup.menuData.order[j]=["changeName","changeEmail"];
}
me.popup.menuData.items.changeName={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_RENAME"),args:[fld,sno,_69b.get(sno,"name")],onclick:function(e,a){
DA.customEvent.fire("changeNameDialogShowBefore",me,{e:e,a:a});
me.selectedFld=a[0];
me.selectedSno=a[1];
me._showRnDialog(a[2],e.clientX,e.clientY);
DA.customEvent.fire("changeNameDialogShowAfter",me,{e:e,a:a});
}};
me.popup.menuData.items.changeEmail={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_CHANGEEMAIL"),args:[fld,sno,_69b.get(sno,"email")],onclick:function(e,a){
me.selectedFld=a[0];
me.selectedSno=a[1];
me._showCeDialog(a[2],e.clientX,e.clientY);
}};
j++;
}
if(_69b.isAddr(sno)){
me.popup.menuData.order[j]=["langList0","langList1"];
me.popup.menuData.items.langList0={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_CHANGELANG_ENGLISH"),args:[fld,sno,"en"],onclick:function(e,a){
me.changeLang(a[0],a[1],a[2]);
}};
me.popup.menuData.items.langList1={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_CHANGELANG_VIEW"),args:[fld,sno,"ja"],onclick:function(e,a){
me.changeLang(a[0],a[1],a[2]);
}};
j++;
}else{
if(_69b.isUser(sno)||_69b.isGroup(sno)){
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
var _6b3=["email","keitai_mail","pmail1","pmail2"];
if(_69b.isAddr(sno)||_69b.isUser(sno)){
me.popup.menuData.order[j]=[];
for(i=0;i<_6b3.length;i++){
if(!DA.util.isEmpty(o[_6b3[i]])&&(DA.vars.user_information_restriction[_6b3[i]]!=="off"||!_69b.isUser(sno))){
me.popup.menuData.items["emailList"+i]={text:DA.locale.GetText.t_("EDITOR_POPUPMENU_CHANGEEMAILCUSTOM",o[_6b3[i]]),args:[fld,sno,o[_6b3[i]]],onclick:function(e,a){
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
var _6c9;
switch(fld){
case "to":
_6c9=this.toController;
break;
case "cc":
_6c9=this.ccController;
break;
case "bcc":
_6c9=this.bccController;
break;
default:
_6c9=this.toController;
break;
}
return _6c9;
},openGroup:function(fld,sno){
var _6cc=this._controller(fld);
var me=this;
var io;
if(!this.existsLock()){
io=this.groupIO;
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
_6cc.addList(o.user_list,true);
_6cc.remove(sno);
me._refreshGroupName();
me.doResize();
}
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("GROUPINFO_ERROR"));
};
io.execute({proc:"extract",gid:_6cc.get(sno,"id"),lang:_6cc.get(sno,"lang")});
}
},titleOff:function(fld,sno){
var _6d3=this._controller(fld);
if(!this.existsLock()){
_6d3.title(sno,"",0,true);
}
},titleOn:function(fld,sno,type){
var _6d7=this._controller(fld);
var io;
if(!this.existsLock()){
if(_6d7.isUser(sno)){
io=this.userIO;
}else{
io=this.addrIO;
}
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
_6d7.title(sno,o.title,o.title_pos,true);
}
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("USERINFO_ERROR"));
};
if(_6d7.isUser(sno)){
io.execute({proc:"title",mid:_6d7.get(sno,"id"),lang:_6d7.get(sno,"lang"),type:type});
}else{
io.execute({proc:"title",id:_6d7.get(sno,"id"),lang:_6d7.get(sno,"lang"),type:type});
}
}
},titleCustom:function(fld,sno,_6dd,_6de){
var _6df=this._controller(fld);
if(!this.existsLock()){
_6df.title(sno,_6dd,_6de,true);
}
},rename:function(fld,sno,name){
var _6e3=this._controller(fld);
if(!this.existsLock()){
_6e3.name(sno,name,true);
}
},changeEmail:function(fld,sno,_6e6){
var _6e7=this._controller(fld);
if(!this.existsLock()){
_6e7.email(sno,_6e6);
}
},changeLang:function(fld,sno,lang){
var _6eb=this._controller(fld);
var io;
if(!this.existsLock()){
if(_6eb.isGroup(sno)){
io=this.groupIO;
}else{
if(_6eb.isUser(sno)){
io=this.userIO;
}else{
io=this.addrIO;
}
}
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
_6eb.lang(sno,lang);
_6eb.name(sno,o.name,true);
}
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("USERINFO_ERROR"));
};
if(_6eb.isGroup(sno)){
io.execute({proc:"name",gid:_6eb.get(sno,"id"),lang:lang});
}else{
if(_6eb.isUser(sno)){
io.execute({proc:"name",mid:_6eb.get(sno,"id"),lang:lang});
}else{
io.execute({proc:"name",id:_6eb.get(sno,"id"),lang:lang});
}
}
}
},moveField:function(fld,sno,_6f1,_6f2){
var src=this._controller(fld);
var dst=this._controller(_6f1);
if(!this.existsLock()){
if(fld!==dst){
this._hideRnDialog();
this._hideCeDialog();
if(_6f2!==1){
this._showAddressCcBcc();
}
dst.add(src.get(sno));
src.remove(sno);
this.doResize();
}
}
},insertAfterNode:function(fld,sno,_6f7,_6f8){
var src=this._controller(fld);
var dst=this._controller(_6f7);
if(!this.existsLock()){
this._hideRnDialog();
this._hideCeDialog();
if(fld!==_6f7){
this._showAddressCcBcc();
}
if(fld===_6f7&&sno!==_6f8.split("_")[2]){
dst.insertAfterNode(src.get(sno),sno,_6f8,"true");
}else{
if(fld!==_6f7){
dst.insertAfterNode(src.get(sno),sno,_6f8,"false");
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
},moveTop:function(fld,sno,_6fe,_6ff){
var src=this._controller(fld);
var dst=this._controller(_6fe);
if(!this.existsLock()){
if(fld!==dst){
this._hideRnDialog();
this._hideCeDialog();
if(_6ff!==1){
this._showAddressCcBcc();
}
dst.insertToTop(src.get(sno),sno);
this.doResize();
}
}
},insertBeforeNode:function(fld,sno,_704,_705,_706){
var src=this._controller(fld);
var dst=this._controller(_704);
if(!this.existsLock()){
if(fld!==dst){
this._hideRnDialog();
this._hideCeDialog();
if(_705!==1){
this._showAddressCcBcc();
}
dst.insertToTop(_706,0);
src.remove(sno);
this.doResize();
}
}
},showRichTextSelectForm:function(){
var me=this;
["formatblock","fontname","fontsize"].each(function(_70a){
try{
YAHOO.util.Dom.get(_70a+"_"+me.htmlContentsNode.id).style.visibility="";
}
catch(e){
}
});
},hideRichTextSelectForm:function(){
var me=this;
["formatblock","fontname","fontsize"].each(function(_70c){
try{
YAHOO.util.Dom.get(_70c+"_"+me.htmlContentsNode.id).style.visibility="hidden";
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
var _710=DA.imageLoader.tag(DA.vars.imgRdir+"/aqbtn_address.gif");
$("da_messageEditorItemToAddress").innerHTML=$("da_messageEditorItemCcAddress").innerHTML=$("da_messageEditorItemBccAddress").innerHTML=_710;
$("da_messageEditorItemAttachmentButtonsLibrary").disabled=false;
}};
DA.mailer.AddressDragDrop=function(id,_712,_713){
if(id){
this.init(id,_712,_713);
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
var _71a=null;
if(id.indexOf("Text")>=0){
_71a=document.getElementById("insertAddressAfterMark"+id);
if(_71a){
_71a.parentNode.removeChild(_71a);
}
}else{
if(id.indexOf("da_ugInformationList")>=0){
_71a=document.getElementById("insertAddressAfterMark"+id);
if(_71a){
_71a.parentNode.removeChild(_71a);
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
DA.mailer.widget.MailImportDialog=function(_71e,_71f,_720){
this.nodeId=_71e;
this.setHead(_71f);
this.setBody();
this.setCbhash(_720);
this.setDialog();
this.setListener();
};
Object.extend(DA.mailer.widget.MailImportDialog.prototype,DA.widget.Dialog.prototype);
DA.mailer.widget.MailImportDialog.prototype.setHead=function(_721){
this.head=DA.util.encode(_721);
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
var _723=DA.vars.config.archive_list.split("|");
var _724="";
var i,_726;
for(i=0;i<_723.length;i++){
if(_723[i]===DA.vars.config.archive){
_726=" checked";
}else{
_726="";
}
_724+="<input type=radio id=\""+this.childId("archive_type")+"\" class=\""+this.childClass("archive_type")+"\" name=\"archive_type\" value=\""+_723[i]+"\""+_726+">"+this.archiveType[_723[i]]+"&nbsp;";
}
return _724;
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
DA.mailer.FolderDragDrop=function(id,_728,_729){
if(id){
this.init(id,_728,_729);
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
DA.mailer.FolderTreeController=function(_739,_73a,_73b,_73c,_73d,_73e){
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
this.topNode=_739;
this.treeNode=_73a;
this.selectedNode=_73d;
this.quota=new DA.mailer.QuotaController(_73b,_73c);
this.popup=new DA.mailer.FolderTreePopupMenu(this);
if(DA.util.isFunction(_73e.onUpdating)){
this.onUpdating=_73e.onUpdating;
}
if(DA.util.isFunction(_73e.onUpdateDone)){
this.onUpdateDone=_73e.onUpdateDone;
}
if(DA.util.isFunction(_73e.onSelect)){
this.onSelect=_73e.onSelect;
}
if(DA.util.isFunction(_73e.onDelete)){
this.onDelete=_73e.onDelete;
}
if(DA.util.isFunction(_73e.onTrash)){
this.onTrash=_73e.onTrash;
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
var _745=me[name];
if(!ce||!YAHOO.lang.isFunction(_745)){
return;
}
ce.subscribe(function(type,args){
return _745.apply(me,args);
});
});
},treeData:{},ygtvData:{},selectedFid:null,targetedFid:null,sourceFid:null,nextFid:null,rootFid:null,serverFid:null,inboxFid:null,draftFid:null,sentFid:null,trashFid:null,spamFid:null,localServerFid:null,localFolderFid:null,backupFolderFid:null,onUpdating:Prototype.emptyFunction,onUpdateDone:Prototype.emptyFunction,onSelect:Prototype.emptyFunction,onDelete:Prototype.emptyFunction,onTrash:Prototype.emptyFunction,onMessagesMoved:function(_748,_749,_74a){
this._viewQuota(_74a);
if(!_749||!_749.messages||!_74a){
return;
}
var _74b=_749.messages.fid;
var _74c=_749.target.fid;
this._setCounts(_74a,_74b);
if(DA.util.cmpNumber(_74b,this.selectedFid)||DA.util.cmpNumber(_74c,this.selectedFid)){
this.selectedNode.innerHTML=this._labeler(this.selectedFid).selected();
}
},onMessagesFiltered:function(arg1){
this._viewQuota(arg1.response);
this._setCounts(arg1.response,arg1.srcFid);
this._selectUI(arg1.srcFid);
},onMessagesFlagged:function(_74e,_74f,_750){
if(!_74f||!_74f.messages||!_750){
return;
}
var fid=_74f.messages.fid;
if(_74f.property==="seen"){
this._setCounts(_750,fid);
if(DA.util.cmpNumber(fid,this.selectedFid)){
this.selectedNode.innerHTML=this._labeler(fid).selected();
}
}
},onMessageRead:function(_752){
if(_752&&_752.fid){
this._incSeen(_752.fid);
}
if(DA.util.cmpNumber(_752.fid,this.selectedFid)){
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
if(DA.mailer.util.getOperationFlag()!==""&&DA.mailer.util.getOperationFlag().indexOf(OrgMailer.vars.org_mail_gid.toString())<0){
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
var _76f;
var _770=o.folder_list||[];
var me=this;
var fo;
var _773=[];
var _774=_770.length;
for(var i=0;i<_774;i++){
fo=_770[i];
me.treeData[fo.fid]={};
for(var key in fo){
me.treeData[fo.fid][key]=fo[key];
}
me.treeData[fo.fid].last_update=0;
me.treeData[fo.fid].children=[];
me.treeData[fo.fid].labeler=new DA.mailer.FolderLabeler(this.topNode,this.treeNode,me._data(fo.fid));
if(fo.parent===0){
_76f=fo.fid;
}else{
me.treeData[fo.parent].children.push(me._data(fo.fid));
if(me._parent(fo.fid)===_76f){
_773.push(fo.fid);
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
this.topNode.innerHTML=me.treeData[_76f].labeler.root();
var root=me.treeView.getRoot();
var _778=_773.length;
var fid,to;
for(var j=0;j<_778;j++){
fid=_773[j];
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
},_populate:function(f,_77e){
var me=this;
if(f.hidden===1){
return;
}
var node=new YAHOO.widget.TextNode(f.labeler.label(true),_77e);
var _781=f.children.length;
me.treeData[f.fid].node=node;
me.ygtvData[node.getElId()]=f.fid;
for(var i=0;i<_781;i++){
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
var _78b=this._parent(fid);
if(_78b!==0&&_78b!==top){
this._parentsOpen(_78b,top);
}
this._showChildren(_78b);
},_refresh:function(fid){
var node=this._node(fid);
this._clearYUIDragDropMgrDomRefCache();
node.refresh();
},_select:function(fid){
var me=this;
var node,_791,h,io;
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
var c,node,_7a6,_7a7,_7a8,_7a9,_7aa;
if(me._createOk(fid)){
this.popup.cfDialog.hide();
c={};
node=me._node(fid);
_7a6=me.nextFid;
if(DA.vars.config["delete"]===1){
_7a7=1;
}else{
_7a7=0;
}
if(DA.vars.config.count==="all"||DA.vars.config.count==="half"){
_7a8=1;
}else{
_7a8=0;
}
if(DA.vars.config.count==="all"){
_7a9=1;
}else{
_7a9=0;
}
if(DA.vars.config.recent==="on"){
_7aa=1;
}else{
_7aa=0;
}
if(type===DA.vars.folderType.cabinet){
c={fid:_7a6,parent:fid,uidvalidity:0,type:18,name:name,icon:DA.vars.imgRdir+"/ico_fc_cabinet.gif",alt:"",select:0,update:0,create:1,rename:1,"delete":1,move:1,"import":0,"export":0,filter:0,rebuild:0,move_f:1,move_m:0,open_m:0,trash_m:_7a7,messages:0,unseen:0,recent:0,messages_e:_7a8,unseen_e:_7a9,recent_e:_7aa,last_update:0,children:[],drop:new YAHOO.util.DDTarget(this._fid2divId(_7a6),"da_folderTree")};
}else{
if(type===DA.vars.folderType.mailbox){
c={fid:_7a6,parent:fid,uidvalidity:0,type:17,name:name,icon:DA.vars.imgRdir+"/ico_14_folder_c.gif",alt:"",select:1,update:1,create:0,rename:1,"delete":1,move:1,"import":1,"export":1,filter:1,rebuild:1,move_f:0,move_m:1,open_m:1,trash_m:_7a7,messages:0,unseen:0,recent:0,messages_e:_7a8,unseen_e:_7a9,recent_e:_7aa,last_update:0,children:[],drop:null};
}else{
c={fid:_7a6,parent:fid,uidvalidity:0,type:16,name:name,icon:DA.vars.imgRdir+"/ico_14_folder_c.gif",alt:"",select:1,update:1,create:1,rename:1,"delete":1,move:1,"import":1,"export":1,filter:1,rebuild:1,move_f:1,move_m:1,open_m:1,trash_m:_7a7,messages:0,unseen:0,recent:0,messages_e:_7a8,unseen_e:_7a9,recent_e:_7aa,last_update:0,children:[],drop:new YAHOO.util.DDTarget(this._fid2divId(_7a6),"da_folderTree")};
}
}
me.treeData[_7a6]=c;
me.treeData[_7a6].labeler=new DA.mailer.FolderLabeler(me.topNode,me.treeNode,me._data(_7a6));
me.treeData[fid].children.push(me.treeData[_7a6]);
me._populate(me.treeData[_7a6],node);
me._refresh(me._parent(_7a6));
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
var c,_7b6;
if(me._renameOk(fid)){
this.popup.rfDialog.hide();
c=me._data(fid);
_7b6=me._labeler(fid);
c.name=name;
_7b6.refresh();
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
var _7ce=this._parent(fid);
var _7cf=this._node(_7ce);
var _7d0=this._data(_7ce);
var i;
for(i=0;i<_7d0.children.length;i++){
if(_7d0.children[i].fid===fid){
_7d0.children.splice(i,1);
break;
}
}
this.treeView.removeNode(node);
this.treeView.draw();
this._clearYUIDragDropMgrDomRefCache();
this._hideChildren(_7ce);
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
},_exportUI:function(fid,file,_7ea){
var me=this;
var url,Proc;
if(me._exportOk(fid)){
if(DA.util.isNull(_7ea)){
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=archive%26file="+file;
}else{
Proc=DA.vars.cgiRdir+"/ma_ajx_download.cgi%3fproc=archive%26file="+file+"%26file_name="+_7ea;
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
var _805;
if(me.treeData[fid].update===1){
_805=me._labeler(fid);
if(_805.recent()>0||DA.vars.config.update_time===0||DA.time.DiffTime(me.treeData[fid].last_update,DA.time.GetTime())>DA.vars.config.update_time*1000){
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
var _81f=node.getStyle();
if(_81f.match(/(?:^|\s)ygtv[lt]m[h]?(?:\s|$)/)){
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
var _82f=this._labeler(fid);
_82f.data.unseen=(_82f.data.unseen-1<0)?0:_82f.data.unseen-1;
_82f.refresh();
},_setCounts:function(o,fid){
var _832=o.count_list;
var _833=o.total;
var i;
if(_832){
for(i=0;i<_832.length;i++){
this._setCount(_832[i].fid,_832[i].messages,_832[i].unseen,_832[i].recent);
}
}
if(_833){
this._setCount(fid,_833.messages,_833.unseen,_833.recent);
}
},_setCount:function(fid,_836,_837,_838){
var _839=this._labeler(fid);
if(!DA.util.isEmpty(_836)){
_839.messages(_836);
}
if(!DA.util.isEmpty(_837)){
_839.unseen(_837);
}
if(!DA.util.isEmpty(_838)){
_839.recent(_838);
}
_839.refresh();
},_clearCount:function(fid){
this._setCount(fid,0,0,0);
},_clearRecent:function(fid){
this._setCount(fid,null,null,0);
},_fid2divId:function(fid){
var _83d="da_folderTreeDivId_"+fid;
return _83d;
},_divId2fid:function(_83e){
var _83f=_83e.split("_");
return parseInt(_83f[2],10);
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
},_addClass:function(_842,_843){
var el=YAHOO.util.Dom.get(_842);
YAHOO.util.Dom.addClass(el,_843);
},_removeClass:function(_845,_846){
var el=YAHOO.util.Dom.get(_845);
YAHOO.util.Dom.removeClass(el,_846);
}};
DA.mailer.FolderLabeler=function(_848,_849,data){
this.topNode=_848;
this.treeNode=_849;
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
var _84e=DA.imageLoader.tag(this.icon(),this.alt());
return _84e;
},_name:function(){
var n=this.name();
var name=DA.util.encode(n);
return name;
},_count:function(){
var _851="";
var _852=this.messages();
var _853=this.unseen();
var _854=this.recent();
if(this.messagesEnable()){
if(this.unseenEnable()){
_851="["+DA.util.encode(_853)+"/"+DA.util.encode(_852)+"]";
}else{
_851="["+DA.util.encode(_852)+"]";
}
}else{
if(this.unseenEnable()){
_851="["+DA.util.encode(_853)+"]";
}else{
_851="";
}
}
if(this.recentEnable()){
if(_854!==0){
_851+="&nbsp;";
_851+="("+DA.util.encode(_854)+")";
}
}
return _851;
},_countOnly:function(){
var _855="";
var _856=this.messages();
var _857=this.unseen();
if(DA.mailer.util.isLocalFolder(this.type())||DA.mailer.util.isBackupFolder(this.type())){
_855="";
}else{
if(DA.mailer.util.isSent(this.type())||DA.mailer.util.isDraft(this.type())){
_855=DA.locale.GetText.t_("MESSAGES_NOUNSEEN_UNIT",DA.util.encode(_856));
}else{
_855=DA.locale.GetText.t_("MESSAGES_UNSEEN_UNIT",DA.util.encode(_856),DA.util.encode(_857));
}
}
return _855;
},_class:function(only){
var _859="ygtvlabel";
if(this._isRecent()){
_859+=" labelRecent";
}
if(this._isSelected()){
_859+=" labelSelected";
}
if(this._isTargeted()){
_859+=" labelTargeted";
}
if(this.select()===0){
_859+=" labelNoPointer";
}
var _85a=" class=\""+_859+"\"";
return (only)?_859:_85a;
},_isRecent:function(){
if(this.recentEnable()&&this.recent()>0){
return true;
}else{
return false;
}
},_isSelected:function(){
var _85b;
if(this.hasClass("labelSelected")){
_85b=true;
}else{
_85b=false;
}
return _85b;
},_isTargeted:function(){
var _85c;
if(this.hasClass("labelTargeted")){
_85c=true;
}else{
_85c=false;
}
return _85c;
},root:function(){
var _85d="&nbsp;";
var _85e=" onmouseover=\"YAHOO.util.Dom.addClass(this.parentNode, 'labelHover');\" onmouseout=\"YAHOO.util.Dom.removeClass(this.parentNode, 'labelHover');\"";
var _85f="<div id=\""+this.divId()+"\" class=\"ygtvlabel labelRoot\""+_85e+"\" onclick=\"DA.mailer.util.treeOpenAll('"+this.treeNode.id+"');\">"+this._image()+_85d+this._name()+_85d+this._count()+"</div>";
return _85f;
},label:function(_860){
var _861="&nbsp;";
var _862=(this.data.select===1)?" onmouseover=\"YAHOO.util.Dom.addClass(this.parentNode, 'labelHover');\" onmouseout=\"YAHOO.util.Dom.removeClass(this.parentNode, 'labelHover');\"":"";
var _863;
if(_860){
_863={id:this.fid(),label:"<div id=\""+this.divId()+"\""+_862+">"+this._image()+_861+this._name()+_861+this._count()+"</div>",style:this._class(true)};
}else{
_863="<div id=\""+this.divId()+"\""+this._class()+_862+">"+this._image()+_861+this._name()+_861+this._count()+"</div>";
}
return _863;
},dummy:function(){
var _864="&nbsp;";
var _865=this._image()+_864+this._name()+_864+this._count();
return _865;
},selected:function(){
var _866="&nbsp;";
var _867=this._image()+_866+this._name()+_866+this._countOnly();
return _867;
},_cachedFuncs:{mouseover:function(){
YAHOO.util.Dom.addClass(this.parentNode,"labelHover");
},mouseout:function(){
YAHOO.util.Dom.removeClass(this.parentNode,"labelHover");
}},refresh:function(){
var node=this.node();
var _869=this.divId();
var div=$(_869);
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
DA.mailer.QuotaController=function(_872,_873){
this.storageNode=_872;
this.messagesNode=_873;
if(DA.vars.custom.threePane.setQuota){
eval(DA.vars.custom.threePane.setQuota);
}
};
DA.mailer.QuotaController.prototype={storageNode:null,messagesNode:null,storageQuota:null,messagesQuota:null,storageUse:null,messagesUse:null,storageOver:null,messagesOver:null,_storage:function(){
var _874=this.storageQuota;
var _875=this.storageUse;
var _876="";
if(!DA.util.isEmpty(_874)&&!DA.util.isEmpty(_875)){
if(DA.vars.config.cap_size_unit==="MB"){
_875=(_875/1024).toFixed(2);
_874=(_874/1024).toFixed(2);
_876="&lt;"+DA.util.encode(_875)+"/"+DA.util.encode(_874)+"&gt;"+DA.locale.GetText.t_("STORAGE_UNIT_MB");
}else{
_876="&lt;"+DA.util.encode(_875)+"/"+DA.util.encode(_874)+"&gt;"+DA.locale.GetText.t_("STORAGE_UNIT");
}
}
return _876;
},_messages:function(){
var _877=this.messagesQuota;
var _878=this.messagesUse;
var _879;
if(!DA.util.isEmpty(_877)&&!DA.util.isEmpty(_878)){
_879="&lt;"+DA.util.encode(_878)+"/"+DA.util.encode(_877)+"&gt;"+DA.locale.GetText.t_("MESSAGE_UNIT");
}
return _879;
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
var _87b=this._storage();
var _87c=this._messages();
if(!DA.util.isEmpty(_87b)){
this.storageNode.innerHTML=_87b;
if(this.storageOver){
YAHOO.util.Dom.removeClass(this.storageNode,"quotaNormal");
YAHOO.util.Dom.addClass(this.storageNode,"quotaWarn");
}else{
YAHOO.util.Dom.removeClass(this.storageNode,"quotaWarn");
YAHOO.util.Dom.addClass(this.storageNode,"quotaNormal");
}
}
if(!DA.util.isEmpty(_87c)){
this.messagesNode.innerHTML=_87c;
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
var _884=YAHOO.util.Event.getTarget(e);
var _885=DA.dom.findParent(_884,"DIV",5);
if(!_885||!_885.id){
return false;
}
var _886=_885.id;
if(!_886.match(/^da\_folderTreeDivId\_(\d+)$/)){
return false;
}
if(me.ftc.existsLock()){
return false;
}
me.cfDialog.hide();
me.rfDialog.hide();
me.ifDialog.hide();
var fid=me._id2fid(_886);
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
DA.widget.VirtualScrollingTable=function(_88c){
var _88d={visibleRows:10,maxVisisbleRows:20,totalRows:1000,resizableColumns:true,isUsingFakeTable:false,columns:[{key:"uid",name:"uid",width:"50%"}]};
Object.extend(_88d,_88c||{});
this.columns=_88d.columns;
var _88e=_88d.columns.map(function(c){
return {width:c.width};
});
this.isUsingFakeTable=_88d.isUsingFakeTable;
var _890=_88d.table||DA.widget.makeATable(_88d.maxVisisbleRows+1,_88e);
var _891=_88d.headerTable||DA.widget.makeATable(1,_88e,null,[_88d.columns.pluck("name")]);
_890.className="da_virtualScrollingTable";
_891.className="da_virtualScrollingHeaderTable";
_890.id=_890.id||"da_virtualScrollingTable_"+(new Date()).getTime();
_891.id=_890.id+"_header";
this.containerElem=_88d.containerElem||document.createElement("div");
if(!this.containerElem.parentNode){
document.body.appendChild(this.containerElem);
}
var _892=document.createElement("div");
Object.extend(_892.style,{paddingRight:"18px",marginRight:"3px",backgroundColor:"#ddd"});
_892.appendChild(_891);
this.containerElem.appendChild(_892);
this.containerElem.appendChild(_890);
if("function"===typeof _88d.onLoading){
this.onLoading=_88d.onLoading;
}
if("function"===typeof _88d.onLoadDone){
this.onLoadDone=_88d.onLoadDone;
}
this.maxVisisbleRows=_88d.maxVisisbleRows;
this.jsonIO=new DA.io.JsonIO(_88d.url,_88d.urlParams);
var me=this;
this.jsonIO.callback=function(_894,_895){
var _896=_894.start_sno;
var _897=me.processingRequest&&me.processingRequest.bufferOffset;
if(!DA.util.isUndefined(_896)&&!DA.util.isNull(_896)&&_896!==(_897+1)){
me.processingRequest.bufferOffset=_896-1;
me.buffer.rows.length=_896-2;
}
me.ajaxUpdate(_894);
me.scroller.updateSize();
me.onLoadDone();
if(me.metaData.getTotalRows()===0){
_890.className=me.options.emptyClass;
}else{
_890.className=me.options.tableClass;
}
if(!DA.util.isUndefined(_894.select_sno)&&_894.select_sno!==null){
this.__mboxGrid.liveGrid.scroller.moveScroll(_894.select_sno);
this.__mboxGrid._lastClickedRowMetaData.sno=_894.select_sno+1;
}
};
if(!this.isUsingFakeTable){
this.jsonIO.defaultParams.format="AoA";
}
this._computeRowHeight();
this._setupCSS(_890.id);
this.initialize(_890.id,_88d.visibleRows,_88d.totalRows,_88d.url,Object.extend(_88d.liveGridOptions||{},{prefetchBuffer:true,sortAscendImg:DA.vars.imgRdir+"/sort_asec.gif",sortDescendImg:DA.vars.imgRdir+"/sort_desc.gif",loadingClass:"da_virtualScrollingTableLoading",emptyClass:"da_virtualScrollingTableEmpty",sortImageHeight:"11px",sortImageWidth:"7px",columns:_88d.columns.map(function(c){
return [c.key,true];
}),optimizeTinyScroll:true}));
if(this.isUsingFakeTable){
this.applyFakeTableOverrides();
}
var crzr;
if(_88d.resizableColumns){
if(this.isUsingFakeTable){
crzr=new DA.widget.MFTColumnResizer(_891,_890,{minWidth:20},this.columns);
}else{
crzr=new DA.widget.MirroredColumnResizer(_890,_891,{minWidth:20});
}
YAHOO.util.Dom.getElementsByClassName("da_columnResizer","div",_891.rows[0]).each(function(el,i){
if(!i){
return;
}
var hndl=new DA.widget.TwoColumnResizeHandle(_890,el,crzr,i-1);
});
crzr.moveRight(0,1);
}
};
DA.widget.MirroredColumnResizer=function(_89d,_89e,_89f){
DA.widget.MirroredColumnResizer.superclass.constructor.call(this,_89d,_89f);
this.table2=_89e;
this._cols2=_89e.getElementsByTagName("col");
};
YAHOO.lang.extend(DA.widget.MirroredColumnResizer,DA.widget.ColumnResizer);
DA.widget.MirroredColumnResizer.prototype.setColWidthPerc=function(w,n){
this._cols[n].width=this._cols2[n].width=(w+"%");
};
DA.widget.MirroredColumnResizer.prototype.setColWidth=function(w,n){
this._cols[n].width=this._cols2[n].width=(w+"px");
};
DA.widget.MirroredColumnResizer.prototype.moveRight=function(l,_8a5){
if(this.tableLayoutHack){
this.table2.style.tableLayout="auto";
}
DA.widget.MirroredColumnResizer.superclass.moveRight.call(this,l,_8a5);
if(this.tableLayoutHack){
this.table2.style.tableLayout="fixed";
}
};
DA.widget.MFTColumnResizer=function(_8a6,_8a7,_8a8,_8a9){
DA.widget.MFTColumnResizer.superclass.constructor.call(this,_8a6,_8a8);
this.divtable=_8a7;
this.styleSheet=document.styleSheets[0];
var _8aa=this.styleSheet.addRule?this._createCSSRuleIE:this.styleSheet.insertRule?this._createCSSRuleW3C:null;
_8a9.each(_8aa.bind(this));
var _8ab={};
var _8ac=this.styleSheet.cssRules?this.styleSheet.cssRules:this.styleSheet.rules?this.styleSheet.rules:[];
$A(_8ac).each(function(rule){
_8ab[rule.selectorText.toLowerCase()]=rule;
});
this._styles=_8a9.map(function(col){
return _8ab["div."+col.key];
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
DA.widget.MFTColumnResizer.prototype.moveRight=function(l,_8b4){
if(this.tableLayoutHack){
this.divtable.style.tableLayout="auto";
}
DA.widget.MFTColumnResizer.superclass.moveRight.call(this,l,_8b4);
if(this.tableLayoutHack){
this.divtable.style.tableLayout="fixed";
}
};
DA.widget.MFTColumnResizer.prototype._createCSSRuleW3C=function(_8b5){
var _8b6="div."+_8b5.key+" { width: "+_8b5.width+";}";
this.styleSheet.insertRule(_8b6,0);
};
DA.widget.MFTColumnResizer.prototype._createCSSRuleIE=function(_8b7){
var _8b8="div."+_8b7.key;
var rule="width:"+_8b7.width;
this.styleSheet.addRule(_8b8,rule);
};
if("undefined"===typeof Rico||"undefined"===typeof Rico.LiveGrid||"undefined"===typeof Rico.LiveGridBuffer||"undefined"===typeof Rico.TableColumn){
throw "DEPENDENCY ERROR: RICO not found, we cannot continue";
}
DA.widget.VirtualScrollingTable.prototype=Rico.LiveGrid.prototype;
DA.widget.VirtualScrollingTable.prototype.applyFakeTableOverrides=function(){
this.viewPort.populateRow=function(_8ba,row){
var _8bc,_8bd;
if(_8ba){
_8bc=row.meta;
_8ba.innerHTML=row.html;
_8bd=this.liveGrid.isSelected(_8bc);
if(_8bc.className){
_8ba.className="da_rowdiv "+_8bc.className+(_8bd?" da_gridSelectedRow":"");
}else{
_8ba.className="da_rowdiv "+(_8bd?"da_gridSelectedRow":"");
}
_8ba.__daGridRowMetaData=_8bc;
}
};
this.viewPort.rotate=function(_8be){
var tb=this.table;
var i;
if(_8be>0){
for(i=0;i<_8be;++i){
tb.appendChild(tb.firstChild);
}
}else{
for(i=0;i>_8be;--i){
tb.insertBefore(tb.lastChild,tb.firstChild);
}
}
};
this.buffer.blankRow={meta:{},html:"&nbsp;"};
};
DA.widget.VirtualScrollingTable.prototype.update=function(_8c1,_8c2){
if(_8c2===true){
this.jsonIO.defaultParams=_8c1;
}else{
Object.extend(this.jsonIO.defaultParams,_8c1||{});
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
var _8c4=grid.getParameters();
var _8c5=this.getParameters()||{};
if(!_8c4){
return false;
}
return DA.util.areEquivObjs(_8c5,_8c4);
};
DA.widget.VirtualScrollingTable.prototype.getUIStateInfo=function(){
var _8c6=this.sort.headerTable.rows[0].cells;
return {columns:this.options.columns.map(function(col,_8c8){
return {name:col.name,width:_8c6[_8c8].offsetWidth};
})};
};
DA.widget.VirtualScrollingTable.prototype.isUsingFakeTable=false;
DA.widget.VirtualScrollingTable.prototype.isSelected=function(_8c9){
return false;
};
DA.widget.VirtualScrollingTable.prototype.clearSelection=function(){
};
DA.widget.VirtualScrollingTable.prototype.resizeHeight=function(_8ca,_8cb){
var _8cc=this.sort.headerTable.offsetHeight;
var _8cd=Math.max((_8ca-_8cc),50);
var vp=this.viewPort;
var _8cf=Math.ceil(_8cd/vp.rowHeight);
var _8d0=true;
var _8d1=_8cf>(vp.visibleRows-1);
var _8d2=_8cb&&_8d1;
if(_8cf>this.maxVisisbleRows){
_8d0=false;
this._setVisibleRows(this.maxVisisbleRows);
_8cd=this.maxVisisbleRows*vp.rowHeight;
}else{
this._setVisibleRows(_8cf);
}
if(_8d1){
vp.isPartialBlank=true;
}
if(_8d2){
vp.bufferChanged();
}
this._resizeHeight(_8cd);
return _8d0;
};
DA.widget.VirtualScrollingTable.prototype.setVisibleRows=function(n){
var _8d4=this._setVisibleRows(n);
this._resizeHeight(_8d4*this.viewPort.rowHeight);
return (_8d4<this.maxVisisbleRows);
};
DA.widget.VirtualScrollingTable.prototype._resizeHeight=function(_8d5){
this.viewPort.div.style.height=_8d5+"px";
this.scroller.scrollerDiv.style.height=_8d5+"px";
this.scroller.updateSize();
};
DA.widget.VirtualScrollingTable.prototype._setVisibleRows=function(n){
var _8d7=true;
var _8d8=n;
if(n>this.maxVisisbleRows){
_8d7=false;
_8d8=this.maxVisisbleRows;
}
this.viewPort.visibleRows=_8d8+1;
this.metaData.pageSize=_8d8;
this.buffer.maxBufferSize=this.metaData.getLargeBufferSize()*2;
this.buffer.maxFetchSize=this.metaData.getLargeBufferSize();
return _8d8;
};
DA.widget.VirtualScrollingTable.prototype._computeRowHeight=function(){
var div=document.createElement("div");
div.style.fontColor="white";
div.innerHTML="Sample Text";
document.body.appendChild(div);
var _8da=YAHOO.util.Dom.getRegion(div);
this._computedRowHeightPx=(_8da.bottom-_8da.top)+2;
document.body.removeChild(div);
};
DA.widget.VirtualScrollingTable.prototype._computedRowHeightPx=16;
DA.widget.VirtualScrollingTable.prototype._setupCSS=function(_8db){
DA.dom.createCSSRule((this.isUsingFakeTable?"div#"+_8db+" div.da_rowdiv":"table#"+_8db+" td"),("height:"+this._computedRowHeightPx+"px"));
};
DA.widget.VirtualScrollingTable.prototype.onLoadDone=Prototype.emptyFunction;
DA.widget.VirtualScrollingTable.prototype.onLoading=Prototype.emptyFunction;
Rico.LiveGridBuffer.prototype.loadRows=function(obj){
var _8dd=obj.total;
this.metaData.setTotalRows(_8dd?_8dd:0);
var ret=obj.list;
return ret?ret:[];
};
Rico.LiveGridBuffer.prototype.update=function(_8df,_8e0){
var _8e1=this.loadRows(_8df);
if(this.rows.length===0||_8e0===this.startPos){
this.rows=_8e1;
this.size=this.rows.length;
this.startPos=_8e0;
return;
}
var _8e2;
if(_8e0>this.startPos){
if(this.startPos+this.rows.length<_8e0){
this.rows=_8e1;
this.startPos=_8e0;
}else{
this.rows=this.rows.concat(_8e1.slice(0,_8e1.length));
if(this.rows.length>this.maxBufferSize){
_8e2=this.rows.length;
this.rows=this.rows.slice(this.rows.length-this.maxBufferSize,this.rows.length);
this.startPos=this.startPos+(_8e2-this.rows.length);
}
}
}else{
if(_8e0+_8e1.length<this.startPos){
this.rows=_8e1;
}else{
this.rows=_8e1.slice(0,this.startPos).concat(this.rows);
if(this.rows.length>this.maxBufferSize){
this.rows=this.rows.slice(0,this.maxBufferSize);
}
}
this.startPos=_8e0;
}
this.size=this.rows.length;
};
Rico.LiveGrid.prototype.initAjax=Prototype.emptyFunction;
Rico.TableColumn.SORT_ASC="asec";
Rico.TableColumn.SORT_DESC="desc";
Rico.GridViewPort.prototype.isGoingUp=function(_8e3){
return _8e3<this.lastRowPos;
};
Rico.GridViewPort.prototype.isGoingDown=function(_8e4){
return _8e4>this.lastRowPos;
};
Rico.LiveGrid.prototype.fetchBuffer=function(_8e5){
var _8e6=false,_8e7=false,_8e8=false;
var _8e9,_8ea;
if(this.buffer.isInRange(_8e5)){
_8e6=true;
if(this.viewPort.isGoingUp(_8e5)){
if(!this.buffer.isAtTop()&&this.buffer.isNearingTopLimit(_8e5)){
_8e7=true;
}else{
return;
}
}else{
if(this.viewPort.isGoingDown(_8e5)){
if(!this.buffer.isAtBottom()&&this.buffer.isNearingBottomLimit(_8e5)){
_8e8=true;
}else{
return;
}
}else{
return;
}
}
}
if(this.processingRequest){
this.unprocessedRequest=new Rico.LiveGridRequest(_8e5);
return;
}
if(!this.isIORequired()){
return;
}
if(!_8e6){
_8e9=this.buffer.getFetchOffset(_8e5);
_8ea=this.buffer.getFetchSize(_8e5);
}else{
if(_8e8){
_8e9=this.buffer.getFetchOffset(_8e5);
_8ea=this.buffer.getFetchSize(_8e5);
}else{
if(_8e7){
_8e9=this.buffer.startPos-this.buffer.maxFetchSize;
_8ea=this.buffer.maxFetchSize;
}else{
return;
}
}
}
if(_8e9<0){
_8e9=0;
}
if(_8ea===0){
return;
}
this.processingRequest=new Rico.LiveGridRequest(_8e5);
this.processingRequest.bufferOffset=_8e9;
var _8eb={start_sno:(_8e9+1),end_sno:(_8e9+_8ea)};
if(this.sortCol){
_8eb.sort_key=this.sortCol;
_8eb.sort=this.sortDir;
if(!DA.util.isUndefined(this.select_uid)){
_8eb.select_uid=this.select_uid;
delete this.select_uid;
}
}
this.jsonIO.execute(_8eb);
this.timeoutHandler=setTimeout(this.handleTimedOut.bind(this),this.options.bufferTimeout);
this.onLoading();
};
Rico.LiveGrid.prototype.isIORequired=function(){
return true;
};
Rico.LiveGrid.prototype.addLiveGridHtml=function(){
var _8ec;
var i=0;
if(this.table.getElementsByTagName("thead").length>0){
_8ec=this.table.cloneNode(true);
_8ec.setAttribute("id",this.tableId+"_header");
_8ec.setAttribute("class",this.table.className+"_header");
for(i=0;i<_8ec.tBodies.length;i++){
_8ec.removeChild(_8ec.tBodies[i]);
}
this.table.deleteTHead();
this.table.parentNode.insertBefore(_8ec,this.table);
}
var ins=new Insertion.Before(this.table,"<div id='"+this.tableId+"_container'>"+"<div id='"+this.tableId+"_scrollerdiv' style='float:right'></div>");
this.table.previousSibling.appendChild(this.table);
ins=new Insertion.Before(this.table,"<div id='"+this.tableId+"_viewport'></div>");
this.table.previousSibling.appendChild(this.table);
};
Rico.LiveGridScroller.prototype.createScrollBar=function(){
var _8ef=this.liveGrid.viewPort.visibleHeight();
this.scrollerDiv=$(this.liveGrid.tableId+"_scrollerdiv");
var _8f0=this.scrollerDiv.style;
Object.extend(_8f0,{position:"relative","float":"right",left:"-3px",width:"24px",height:_8ef+"px",overflow:"auto"});
this.heightDiv=document.createElement("div");
this.heightDiv.style.width="1px";
this.heightDiv.style.height=parseInt(_8ef*this.metaData.getTotalRows()/this.metaData.getPageSize(),10)+"px";
this.scrollerDiv.appendChild(this.heightDiv);
this.scrollerDiv.onscroll=this.handleScroll.bindAsEventListener(this);
var _8f1=this.liveGrid.table;
var _8f2=this.isIE?"mousewheel":"DOMMouseScroll";
var _8f3=function(evt){
if(evt.wheelDelta>=0||evt.detail<0){
this.scrollerDiv.scrollTop-=(2*this.viewPort.rowHeight);
}else{
this.scrollerDiv.scrollTop+=(2*this.viewPort.rowHeight);
}
this.handleScroll(false);
Event.stop(evt);
}.bindAsEventListener(this);
var _8f5=false;
this.disableMouseScroll=function(){
if(!_8f5){
return;
}
_8f5=false;
Event.stopObserving(_8f1,_8f2,_8f3,false);
};
this.enableMouseScroll=function(){
if(_8f5){
return;
}
_8f5=true;
Event.observe(_8f1,_8f2,_8f3,false);
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
var _8fa=this.options.columns[n].getSortDirection();
var _8fb=$(this.headerTableId+"_img_"+n);
if(_8fa===Rico.TableColumn.UNSORTED){
_8fb.innerHTML="&nbsp;&nbsp;";
}else{
if(_8fa===Rico.TableColumn.SORT_ASC){
_8fb.innerHTML="<img width=\""+this.options.sortImageWidth+"\" "+"height=\""+this.options.sortImageHeight+"\" "+"src=\""+this.options.sortAscendImg+"\"/>";
}else{
if(_8fa===Rico.TableColumn.SORT_DESC){
_8fb.innerHTML="<img width=\""+this.options.sortImageWidth+"\" "+"height=\""+this.options.sortImageHeight+"\" "+"src=\""+this.options.sortDescendImg+"\"/>";
}
}
}
};
DA.widget.VirtualScrollingTable.prototype.setColumnTitle=function(n,_8fd){
var _8fe=$(this.tableId+"_header");
if(!_8fe){
return false;
}
var row=_8fe.rows?_8fe.rows[0]:undefined;
if(!row){
return false;
}
var cell=row.cells[n];
if(!cell){
return false;
}
if(this.options.columns[n]&&this.options.columns[n].isSortable()){
cell.getElementsByTagName("span")[0].innerHTML=_8fd;
}else{
cell.innerHTML=_8fd;
}
return true;
};
DA.widget.VirtualScrollingTable.prototype.removeColumnSort=function(){
var _901=this.sort.getSortedColumnIndex();
if(_901!==-1){
this.sortCol="";
this.sortDir="";
this.sort.removeColumnSort(_901);
}
};
Rico.LiveGridSort.prototype.headerCellClicked=function(evt){
var _903=evt.target?evt.target:evt.srcElement;
var cell=DA.dom.findParent(_903,"TD",3);
if(!cell){
return;
}
var _905=cell.id;
var _906=parseInt(_905.substring(_905.lastIndexOf("_")+1),10);
var _907=this.getSortedColumnIndex();
if(_907!==-1){
if(_907!==_906){
this.removeColumnSort(_907);
this.setColumnSort(_906,Rico.TableColumn.SORT_DESC);
}else{
this.toggleColumnSort(_907);
}
}else{
this.setColumnSort(_906,Rico.TableColumn.SORT_DESC);
}
if(this.options.sortHandler){
this.options.sortHandler(this.options.columns[_906]);
}
};
Rico.LiveGrid.prototype.sortHandler=function(_908){
if(!_908){
return;
}
this.sortCol=_908.name;
this.sortDir=_908.currentSort;
if(this.metaData.getTotalRows()===0){
return;
}
var _909=this.getSelected();
if(DA.util.isNull(_909.srid)&&_909.count===1){
this.select_uid=_909.singles[0].uid;
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
Rico.GridViewPort.prototype.populateRow=function(_90a,row){
var j=0;
var _90d=row[0];
var _90e=row.length;
var _90f=_90a.cells;
var _910=this.liveGrid.isSelected(_90d);
for(j=1;j<_90e;j++){
_90f[j-1].innerHTML=row[j];
}
if(_90d.className){
_90a.className=_90d.className+(_910?" da_gridSelectedRow":"");
}else{
_90a.className=(_910?"da_gridSelectedRow":"");
}
_90a.__daGridRowMetaData=_90d;
};
Rico.GridViewPort.prototype.updateSelectionStatus=function(){
var _911=this.visibleRows;
var lg=this.liveGrid;
var i;
var rows=this.liveGrid.isUsingFakeTable?this.table.childNodes:this.table.rows;
var _915;
var _916;
var yes=[];
var no=[];
for(i=0;i<_911;++i){
_915=rows[i];
if(!_915){
continue;
}
_916=_915.__daGridRowMetaData;
if(lg.isSelected(_916)){
yes.push(_915);
}else{
no.push(_915);
}
}
YAHOO.util.Dom.removeClass(no,"da_gridSelectedRow");
YAHOO.util.Dom.addClass(yes,"da_gridSelectedRow");
};
Rico.GridViewPort.prototype.clearRows=function(_919){
if(this.buffer.size===0){
this.liveGrid.table.className=this.liveGrid.options.emptyClass;
}else{
this.liveGrid.table.className=this.liveGrid.options.loadingClass;
}
if(this.isBlank){
return;
}
if(_919){
this.isBlank=true;
return;
}
var _91a=this.visibleRows;
var _91b=this.buffer.getBlankRow();
var rows=this.table.rows;
var i;
for(i=0;i<_91a;++i){
this.populateRow(rows[i],_91b);
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
var _920=this.rows.length<this.size;
this.size=this.rows.length;
return _920;
};
Rico.LiveGridBuffer.prototype.findRowMetaData=function(_921){
return this.rows.pluck("meta").findAll(_921||Prototype.emptyFunction);
};
Rico.GridViewPort.prototype.rotate=function(_922){
var tb=this.table.tBodies[0];
var rows=tb.rows;
var _925=rows.length-1;
var i;
if(_922>0){
for(i=0;i<_922;++i){
tb.appendChild(rows[0]);
}
}else{
for(i=0;i>_922;--i){
tb.insertBefore(rows[_925],rows[0]);
}
}
};
Rico.LiveGridScroller.prototype.handleScroll=function(){
if(this.scrollTimeout){
clearTimeout(this.scrollTimeout);
}
var _927=this.scrollerDiv.scrollTop;
var _928=this.lastScrollPos-_927;
var r;
var _92a=this.scrollerDiv.scrollHeight-this.scrollerDiv.offsetHeight;
if(_928!==0){
r=_927%this.viewPort.rowHeight;
if(r!==0){
this.unplug();
if(_928<0||_927===_92a){
_927+=(this.viewPort.rowHeight-r);
}else{
_927-=r;
}
this.scrollerDiv.scrollTop=_927;
_927=this.scrollerDiv.scrollTop;
this.plugin();
}
}
var _92b=parseInt(_927/this.viewPort.rowHeight,10);
this.liveGrid.requestContentRefresh(_92b);
this.viewPort.scrollTo(_927);
this.scrollTimeout=setTimeout(this.scrollIdle.bind(this),1200);
this.lastScrollPos=_927;
};
Rico.LiveGridScroller.prototype.moveScroll=function(_92c){
var _92d=this.rowToPixel(_92c);
var _92e=(_92d!==this.scrollerDiv.scrollTop);
this.scrollerDiv.scrollTop=_92d;
if(!_92e){
this.viewPort.lastPixelOffset=_92d;
}
return _92e;
};
Rico.GridViewPort.prototype.scrollTo=function(_92f){
if(this.lastPixelOffset===_92f){
return;
}
this.refreshContents(parseInt(_92f/this.rowHeight,10));
this.lastPixelOffset=_92f;
};
Rico.LiveGridScroller.prototype.updateSize=function(){
var rows=this.metaData.getTotalRows();
if(rows>=0){
this.heightDiv.style.height=(this.viewPort.rowHeight*rows)+"px";
}
};
Rico.LiveGridScroller.prototype.rowToPixel=function(_931){
if(!_931){
return 0;
}
var _932=this.metaData.getTotalRows();
if(!_932){
return 0;
}
return (_931/_932)*this.heightDiv.offsetHeight;
};
Rico.GridViewPort.prototype.refreshContents=function(_933){
if(_933===this.lastRowPos&&!this.isPartialBlank&&!this.isBlank){
return;
}
if((_933+this.visibleRows<this.buffer.startPos)||(this.buffer.startPos+this.buffer.size<_933)){
this.clearRows(true);
return;
}
if(this.buffer.size===0){
this.clearRows(true);
return;
}
var _934=this.isBlank===true;
this.isBlank=false;
var _935=this.buffer.startPos>_933;
var _936=_935?this.buffer.startPos:_933;
var _937=(this.buffer.startPos+this.buffer.size<_933+this.visibleRows)?this.buffer.startPos+this.buffer.size:_933+this.visibleRows;
var _938=_937-_936;
var rows=this.buffer.getRows(_936,_938);
var _93a=this.visibleRows-_938;
var _93b=_935?0:_938;
var _93c=_935?_93a:0;
var i=0;
var _93e=_933-this.lastRowPos;
var _93f=this.liveGrid.isUsingFakeTable?this.table.childNodes:this.table.rows;
var _940=this.buffer.getBlankRow();
var _941=rows.length;
if((this.liveGrid.options.optimizeTinyScroll===true)&&(Math.abs(_93e)<(this.visibleRows/2))&&(_93c===0)&&!this.isPartialBlank&&!_934){
this.rotate(_93e);
if(_93e>0){
for(i=(_941-_93e);i<_941;++i){
this.populateRow(_93f[i],rows[i]);
}
this.populateRow(_93f[i],_940);
}else{
for(i=0;i<(-_93e);++i){
this.populateRow(_93f[i],rows[i]);
}
}
}else{
for(i=0;i<_941;++i){
this.populateRow(_93f[i+_93c],rows[i]);
}
for(i=0;i<_93a;++i){
this.populateRow(_93f[i+_93b],_940);
}
}
this.isPartialBlank=_93a>0;
this.lastRowPos=_933;
};
Rico.LiveGridBuffer.prototype.isInRange=function(_942){
if(_942<this.startPos){
return false;
}
var _943=this.metaData.getPageSize();
var _944=this.endPos();
if(_942+_943<=_944){
return true;
}
var _945=this.metaData.getTotalRows();
if(_945<_943){
return _942+_945<=_944;
}
return false;
};
Rico.GridViewPort.prototype.getRange=function(){
var _946=this.lastRowPos;
var end=parseInt(this.visibleHeight()/this.rowHeight,10)+_946-1;
return {start:_946,end:end};
};
if(!DA||!DA.mailer||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.mailer.MessageSearcher=function(_948,_949,_94a,_94b){
this.itemNode=_948;
this.itemId=_948.id;
this.gridNode=_949;
this.gridId=_949.id;
this.folderTreeData=_94b;
if(DA.util.isFunction(_94a.onSearch)){
this.onSearch=_94a.onSearch;
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
var _94e=document.createElement("div");
_94e.innerHTML=DA.locale.GetText.t_("SEARCH_MESSAGE_GUIDE")+"<br>"+"<input type=button id=\"da_messageSearcherSubmit\" value=\""+DA.locale.GetText.t_("SEARCH_BUTTON")+"\">"+"<hr>";
_94e.className="da_messageSearcherGuide";
var _94f=document.createElement("div");
_94f.className="da_messageSearcherNomatch";
_94f.innerHTML=DA.locale.GetText.t_("SEARCH_NOMATCH");
var _950=document.createElement("div");
_950.className="da_messageSearcherResult";
this.itemNode.appendChild(item);
this.itemNode.appendChild(_94e);
this.itemNode.appendChild(_94f);
this.itemNode.appendChild(_950);
this.itemContentsNode=item;
this.guideNode=_94e;
this.nomatchNode=_94f;
this.resultNode=_950;
var _951=DA.widget.makeATable(2,[{width:"5%"},{width:"95%"}],{table:"da_messageSearcherResultTable",td:"da_messageSearcherResultTd"},[[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_FID"),"<div id=\"da_messageSearcherResultFolder\">&nbsp;</div>"],[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_TOTAL"),"<div id=\"da_messageSearcherResultTotal\">&nbsp;</div>"]]);
_950.appendChild(_951);
this.hideNomatch();
this.hideResult();
this.resultFolderNode=YAHOO.util.Dom.get("da_messageSearcherResultFolder");
this.resultTotalNode=YAHOO.util.Dom.get("da_messageSearcherResultTotal");
var _952=DA.widget.makeATable(4,[{width:"5%"},{width:"95%"}],{table:"da_messageSearcherItemTable",td:"da_messageSearcherItemTd"},[[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_FID"),"<select id=\"da_messageSearcherItemFid\">"+DA.vars.options.folder_tree+"</select>&nbsp;"+"<input type=checkbox id=\"da_messageSearcherItemClass\">&nbsp;"+DA.locale.GetText.t_("SEARCH_CHECKBOXMESSAGE_CLASS")],[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_KEYWORD"),"<input type=text id=\"da_messageSearcherItemKeyword\" style=\"height:1.5em; margin-right:2px\" size=\"50\" maxlength=\"200\">"+"<select id=\"da_messageSearcherItemCond\" size=1>"+"<option value=\"and\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_COND_AND")+"</option>"+"<option value=\"or\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_COND_OR")+"</option>"+"</select>"],[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_FIELD"),"<select id=\"da_messageSearcherItemField\" size=1>"+"<option value=\"text\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_TEXT")+"</option>"+"<option value=\"body\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_BODY")+"</option>"+"<option value=\"subject\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_SUBJECT")+"</option>"+"<option value=\"from\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_FROM")+"</option>"+"<option value=\"to\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_TO")+"</option>"+"<option value=\"cc\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_CC")+"</option>"+"<option value=\"bcc\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_BCC")+"</option>"+"<option value=\"group\">"+DA.locale.GetText.t_("SEARCH_OPTIONNAME_FIELD_GROUP")+"</option>"+"</select>"],[DA.locale.GetText.t_("SEARCH_COLUMNTITLE_NORROWING"),"<div id=\""+this.itemId+"NORROWING\"></div>"]]);
this.itemContentsNode.appendChild(_952);
this.nvPairs=new DA.widget.NVPairSet(YAHOO.util.Dom.get(this.itemId+"NORROWING"),{Seen:{name:DA.locale.GetText.t_("SEARCH_RADIONAME_SEEN"),value:"<input type=radio id=\"da_messageSearcherItemSeen_0\" name=\"seen\" value=\"0\" checked>&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_SEEN_ALL")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherItemSeen_1\" name=\"seen\" value=\"1\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_SEEN_UNSEEN")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherItemSeen_2\" name=\"seen\" value=\"2\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_SEEN_SEEN"),border:false,weight:false},Flagged:{name:DA.locale.GetText.t_("SEARCH_RADIONAME_FLAGGED"),value:"<input type=radio id=\"da_messageSearcherFlagged_0\" name=\"flagged\" value=\"0\" checked>&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_FLAGGED_ALL")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherFlagged_1\" name=\"flagged\" value=\"1\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_FLAGGED_UNFLAGGED")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherFlagged_2\" name=\"flagged\" value=\"2\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_FLAGGED_FLAGGED"),border:false,weight:false},Attachment:{name:DA.locale.GetText.t_("SEARCH_RADIONAME_ATTACHMENT"),value:"<input type=radio id=\"da_messageSearcherAttachment_0\" name=\"attachment\" value=\"0\" checked>&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_ATTACHMENT_ALL")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherAttachment_1\" name=\"attachment\" value=\"1\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_ATTACHMENT_NOEXISTS")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherAttachment_2\" name=\"attachment\" value=\"2\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_ATTACHMENT_EXISTS"),border:false,weight:false},Priority:{name:DA.locale.GetText.t_("SEARCH_RADIONAME_PRIORITY"),value:"<input type=radio id=\"da_messageSearcherItemPriority_0\" name=\"priority\" value=\"0\" checked>&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_PRIORITY_ALL")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherPriority_5\" name=\"priority\" value=\"5\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_PRIORITY_LOW")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherPriority_3\" name=\"priority\" value=\"3\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_PRIORITY_NORMAL")+"&nbsp;"+"<input type=radio id=\"da_messageSearcherPriority_1\" name=\"priority\" value=\"1\">&nbsp;"+DA.locale.GetText.t_("SEARCH_RADIONAME_PRIORITY_HIGH"),border:false,weight:false},ETC:{name:DA.locale.GetText.t_("SEARCH_RADIONAME_ETC"),value:"<input type=checkbox id=\"da_messageSearcherItemToself\">&nbsp;"+DA.locale.GetText.t_("SEARCH_CHECKBOXMESSAGE_TOSELF")+"<br>"+"<input type=checkbox id=\"da_messageSearcherItemDeleted\">&nbsp;"+DA.locale.GetText.t_("SEARCH_CHECKBOXMESSAGE_DELETED"),border:false,weight:false}},[],true);
this.jsonIO=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_search.cgi");
YAHOO.util.Event.addListener(YAHOO.util.Dom.get("da_messageSearcherSubmit"),"click",this.search,this,true);
},select:function(fid){
DA.dom.changeSelectedIndex("da_messageSearcherItemFid",fid);
},search:function(){
var me=this;
var fid,cl,_957,cond,_959,seen,_95b,_95c,_95d,_95e,_95f;
if(me.lock()){
fid=DA.dom.selectValue("da_messageSearcherItemFid");
cl=(DA.dom.checkedOk("da_messageSearcherItemClass"))?"2":"1";
_957=DA.dom.textValue("da_messageSearcherItemKeyword");
cond=DA.dom.selectValue("da_messageSearcherItemCond");
_959=DA.dom.selectValue("da_messageSearcherItemField");
seen=DA.dom.radioValue("seen");
_95b=DA.dom.radioValue("flagged");
_95c=DA.dom.radioValue("attachment");
_95d=DA.dom.radioValue("priority");
_95e=(DA.dom.checkedOk("da_messageSearcherItemToself"))?"2":"0";
_95f=(DA.dom.checkedOk("da_messageSearcherItemDeleted"))?"0":"1";
if(!_957.match(/^\s*$/)){
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
me.jsonIO.execute({proc:"search",fid:fid,"class":cl,keyword:_957,cond:cond,field:_959,seen:seen,flagged:_95b,attachment:_95c,priority:_95d,toself:_95e,deleted:_95f});
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
DA.mailer.MessageViewer=function(_963,_964,_965,_966,_967,_968){
this.headerNode=_963;
this.headerId=_963.id;
this.bodyNode=_964;
this.bodyId=_964.id;
this.containerNode=_965;
this.threePane=_967;
this.requestUrl=_968;
if(_966){
if(DA.util.isFunction(_966.onLoading)){
this.onLoading=_966.onLoading;
}
if(DA.util.isFunction(_966.onLoadDone)){
this.onLoadDone=_966.onLoadDone;
}
if(DA.util.isFunction(_966.onLoadFailed)){
this.onLoadFailed=_966.onLoadFailed;
}
if(DA.util.isFunction(_966.doResize)){
this.doResize=_966.doResize;
}
}
var _969=DA.util.parseQuery(this.requestUrl);
if(_969.external&&DA.util.cmpNumber(_969.external,1)){
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
var _96d=5;
var _96e=2;
var _96f=(hn.offsetHeight+1)+(bn.offsetHeight+1)+(cn.offsetHeight+1);
var _970=cn.offsetHeight-(hn.offsetHeight+(_96d*2)+_96e);
if(_970>10){
bn.style.height=_970+"px";
}else{
bn.style.height="auto";
}
},onLoading:Prototype.emptyFunction,onLoadDone:Prototype.emptyFunction,doResize:Prototype.emptyFunction,init:function(){
var me=this;
var _972=["<div class=\"da_messageViewerHeader\">","<table class=\"da_messageViewerHeaderTable\">","<tr>","  <td colspan=\"2\" class=\"da_messageViewerHeaderTableTopLeft\">",DA.imageLoader.nullTag(1,3),"</td>","  <td class=\"da_messageViewerHeaderTableTopRight\">",DA.imageLoader.nullTag(2,3),"</td>","</tr>","<tr>","  <td class=\"da_messageViewerHeaderTableMiddleLeft\">",DA.imageLoader.nullTag(2,1),"</td>","  <td class=\"da_messageViewerHeaderTableMiddleCenter\">","    <table class=\"da_messageViewerHeaderContents\">","    <tr>","      <td id=\"",this.headerId,"Contents\"></td>","    </tr>","    </table>","  </td>","  <td class=\"da_messageViewerHeaderTableMiddleRight\">",DA.imageLoader.nullTag(2,1),"</td>","</tr>","<tr>","  <td colspan=\"2\" class=\"da_messageViewerHeaderTableBottomLeft\">",DA.imageLoader.nullTag(1,2),"</td>","  <td class=\"da_messageViewerHeaderTableBottomRight\">",DA.imageLoader.nullTag(2,2),"</td>","</tr>","</table>","</div>"].join("");
var body=["<div class=\"da_messageViewerBodyContents\" id=\"",this.bodyId,"Contents\"></div>"].join("");
this.headerNode.innerHTML=_972;
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
var _975=YAHOO.util.Event.getTarget(e);
return _975&&DA.util.match(_975.id,me.headerId+"AttachmentIcon");
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
var _976=document.getElementsByName("da_saveAttachToLibDialog_attaches");
var _977="";
for(var i=0;i<_976.length;i++){
if(_977!==""){
if(_976[i].checked){
_977+=",";
}
}
if(_976[i].checked){
_977+=_976[i].value;
}
}
if(_977===""){
alert(DA.locale.GetText.t_("MESSAGE_SELECT_ATTACHES_ERROR"));
return false;
}
var url,flg;
url="lib_foldersel.cgi%3fcall=ma_bundle%20uid="+this.selectedUid+"%20fid="+this.selectedFid+"%20aid="+_977;
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
},add_reply_icon:function(_97c){
var me=this;
var _97e;
if((DA.vars.system.no_replied_flag===0)&&(_97c.fid===this.selectedFid)&&(_97c.uid===this.selectedUid)){
_97e=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_sc_reply.gif","Replied",{width:16,height:16});
me.nvPairs.changeValue("Subject",_97e+this.subject);
}
},add_forward_icon:function(_97f){
var me=this;
var _981;
if((DA.vars.system.no_replied_flag===0)&&(_97f.fid===this.selectedFid)&&(_97f.uid===this.selectedUid)){
_981=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_sc_forward.gif","Forwarded",{width:16,height:16});
me.nvPairs.changeValue("Subject",_981+this.subject);
}
},_handleMessagesMoving:function(type,args){
var _984=args[0],_985=args[1];
var _986;
if(!_985||!(_986=_985.messages)){
return;
}
if(_986.ranges.length){
}
if(_986.singles.length===1){
if(_986.single.mode===1){
this.add_reply_icon({fid:_986.single.fid,uid:_986.single.originuid});
}else{
if(_986.single.mode===2){
this.add_forward_icon({fid:_986.single.fid,uid:_986.single.originuid});
}else{
}
}
}
if(_986.singles.find(this._isSameMessage.bind(this))){
if(_985.target.trash){
this.onMessageDeleted();
}else{
this.onMessageMoved(_985.target.fid);
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
},_isSameMessage:function(_987){
if(!_987){
return false;
}
var fid=parseInt(this.selectedFid,10);
var uid=parseInt(this.selectedUid,10);
return parseInt(_987.fid,10)===fid&&parseInt(_987.uid,10)===uid;
},view:function(_98a,proc,_98c){
var fid,uid,srid,_990,_991,_992;
var _993=/^<\!-- Created by DA_Richtext .*? end default style -->/;
var _994=/<style>.*?<\/style>/;
if(!_98a||!(uid=_98a.uid)){
}
fid=_98a.fid;
srid=_98a.srid;
_990=_98a.backup_maid;
var me=this;
if(!this.loadingFid||!this.loadingUid||this.loadingFid!==fid||this.loadingUid!==uid){
this.loadingFid=fid;
this.loadingUid=uid;
if(me.lock()){
me.jsonIO.callback=function(o){
var i,_998,_999,_99a;
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
_998=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_mail_high.gif","",{width:14,height:14});
}else{
if(o.priority>3){
_998=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_mail_low.gif","",{width:14,height:14});
}else{
_998=DA.imageLoader.nullTag(14,14);
}
}
me.subject=DA.util.encode(o.subject);
if(me.subject===null){
me.subject="";
}
me.nvPairs.changeName("Subject",_998+DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_SUBJECT"));
if(DA.vars.system.no_forwarded_flag===0&&o.replied===1){
_999=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_sc_reply.gif","Replied",{width:16,height:16});
me.nvPairs.changeValue("Subject",_999+me.subject);
}else{
if(DA.vars.system.no_forwarded_flag===0&&o.forwarded===1){
_99a=DA.imageLoader.tag(DA.vars.imgRdir+"/ico_sc_forward.gif","Forwarded",{width:16,height:16});
me.nvPairs.changeValue("Subject",_99a+me.subject);
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
var _99d=document.getElementsByName("da_saveAttachToLibDialog_attaches");
var _99e="";
for(var i=0;i<_99d.length;i++){
if(_99e!==""){
if(_99d[i].checked){
_99e+=",";
}
}
if(_99d[i].checked){
_99e+=_99d[i].value;
}
}
if(_99e===""){
alert(DA.locale.GetText.t_("MESSAGE_SELECT_ATTACHES_ERROR"));
return false;
}
var url,flg;
url="lib_foldersel.cgi%3fcall=ma_bundle%20uid="+me.selectedUid+"%20fid="+me.selectedFid+"%20aid="+_99e;
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
_991=o.body.html.match(_994);
_992=o.body.html.replace(_994,"");
FCKEditorIframeController.createIframe(me.bodyId+"Contents"+"FckEditorViewer",me.bodyContentsNode);
FCKEditorIframeController.setIframeBody(me.bodyId+"Contents"+"FckEditorViewer",["<head>",_991,"<style>body {margin:0px; padding:0px; border:0;}</style>","<script>function Pop4Ajax(Url,Width,Height,POSX,POSY){ top.Pop4Ajax(Url,Width,Height,POSX,POSY);}</script>","</head>","<body>","<div style=\"word-break:break-all\">",_992,"</div>","</body>"].join("\n"));
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
_98a.seen=1;
DA.mailer.Events.onMessageRead.fire(o);
}
}
}else{
me.loadingFid=null;
me.loadingUid=null;
me.onLoadFailed(_98a);
}
me.unlock();
};
me.jsonIO.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("MESSAGE_VIEW_ERROR"));
me.loadingFid=null;
me.loadingUid=null;
me.unlock();
me.onLoadFailed(_98a,e);
};
me.jsonIO.execute({fid:fid,uid:uid,backup_maid:(DA.util.isEmpty(_990))?"":_990,srid:(DA.util.isEmpty(srid))?"":srid,proc:(DA.util.isEmpty(proc))?"":proc,nomdn:(DA.util.isEmpty(_98c))?"":_98c});
me.onLoading(_98a);
}else{
this.loadingFid=null;
this.loadingUid=null;
}
}
},make:function(tid){
this._editor("new",null,null,tid,null);
},edit:function(_9a5,fid,uid){
this._editor("edit",fid,uid,null,_9a5);
},reply:function(_9a8,fid,uid){
this._editor("reply",fid,uid,null,_9a8);
},replyall:function(_9ab,fid,uid){
this._editor("all_reply",fid,uid,null,_9ab);
},forward:function(_9ae,fid,uid){
this._editor("forward",fid,uid,null,_9ae);
},onClose:function(){
return true;
},close:function(){
if(this.onClose()){
this.clear();
}
},"delete":function(){
var me=this;
var _9b2=(DA.mailer.util.isTrash(this.selectFolderType)||DA.vars.config["delete"]===1)?DA.locale.GetText.t_("MESSAGE_DELETECOMPLETE_CONFIRM"):DA.locale.GetText.t_("MESSAGE_DELETE_CONFIRM");
var io;
var _9b4={fid:me.selectedFid,uid:me.selectedUid,srid:(DA.util.isEmpty(me.selectedSrid))?me.selectedSrid:""};
if(me.lock()){
if(DA.util.confirm(_9b2)){
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
DA.mailer.Events.onMessageMoveRequest.fire({target:{trash:true},messages:{fid:me.selectedFid,srid:me.selectedSrid,single:_9b4,singles:[_9b4],ranges:[],count:1,identity:{}}});
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
},print:function(_9b7){
if(!this.existsLock()){
DA.windowController.winOpen(DA.vars.cgiRdir+"/ma_ajx_print.cgi?fid="+this.selectedFid+"&uid="+this.selectedUid+"&printtoconfig="+_9b7,"",710,600);
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
var _9c4=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi");
_9c4.method="get";
var Img="pop_title_attachsave.gif";
_9c4.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("SAVE_TO_LIB_ERROR"));
};
_9c4.callback=function(o){
var url;
if(!DA.util.isEmpty(o.file)){
url="lib_foldersel.cgi%3fcall=ma_detail%20path="+o.file+"%20name="+o.file_name+"%20is_for_save_mail=true";
DA.windowController.isePopup(url,Img,400,550,DA.mailer.util.getMailAccount(),false);
}else{
DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
}
};
_9c4.execute({fid:me.selectedFid,uid:me.selectedFid+":"+me.selectedUid,area:"",archive:"1",proc:"save_to_lib"});
},getattachesnum:function(){
var me=this;
if(me.attachData.order){
return me.attachData.order.length;
}else{
return 0;
}
},showsaveattachestolibdialog:function(_9ca,_9cb){
var me=this;
me.saveAttachesToLibDialog.show(_9ca,_9cb);
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
},_editor:function(proc,fid,uid,tid,_9d6){
var _9d7;
var _fid=(fid)?fid:this.selectedFid;
var _uid=(uid)?uid:this.selectedUid;
var _tid=tid;
var _9db=_9d6;
if(this.threePane){
DA.mailer.windowController.editorOpen(proc,_fid,_uid,_tid,_9db);
}else{
_9d7="&proc="+proc;
if(!DA.util.isEmpty(_fid)){
_9d7+="&fid="+_fid+"&uid="+_uid;
}
if(!DA.util.isEmpty(_tid)){
_9d7+="&tid="+_tid;
}
if(!DA.util.isEmpty(_9db)){
_9d7+="&quote="+_9db;
}
location.href=DA.util.setUrl(DA.vars.cgiRdir+"/ajax_mailer.cgi?html=editor&richtext=1"+_9d7+"&org_mail_gid="+OrgMailer.vars.org_mail_gid);
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
DA.widget.TopTitleController=function(_9dc,_9dd,_9de){
this.panelId=_9dc.id;
this.panelNode=_9dc;
this.menuNode=_9dd;
this.title=_9de;
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
DA.widget.SearchBox=function(_9e0,_9e1,_9e2,_9e3){
this.field=_9e0;
this.textBox=_9e1;
this.button=_9e2;
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
this.menu=new DA.widget.PulldownMenuController("da_searchBox",this.arrow,_9e3,{onTrigger:function(e){
var _9e5=YAHOO.util.Event.getTarget(e);
if(!_9e5||!_9e5.id){
return false;
}
var _9e6=_9e5.id;
if(!_9e6.match(/^da\_searchBox\_arrow$/)){
return false;
}
return true;
}});
};
DA.widget.SearchBox.prototype={_buttonClicked:function(){
var _9e7=this.getConditions();
this.onSearch.fire({text:this.textBox.value,conditions:_9e7});
},_handleKeyUp:function(){
var _9e8=this.textBox.value;
},_handleKeyDown:function(e){
var _9ea=YAHOO.util.Event.getCharCode(e);
if(_9ea===13){
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
DA.mailer.TopPanelController4Editor=function(_9eb,_9ec,_9ed){
this.panelId=_9eb.id;
this.panelNode=_9eb;
this.menuNode=_9ec;
if(DA.vars.custom.editor.setTopPanel){
eval(DA.vars.custom.editor.setTopPanel);
}
this.init(_9ed);
};
DA.mailer.TopPanelController4Editor.prototype={panelId:null,panelNode:null,menuNode:null,panelMenu:null,panelImages:{left:DA.vars.imgRdir+"/null.gif",center:DA.vars.clrRdir+"/mail_pop_back.gif",right:DA.vars.imgRdir+"/null.gif"},menuData:{leftOrder:["transmit","save","template","preview","spellcheck","back","print"],rightOrder:["popy","close"],items:{transmit:{title:DA.locale.GetText.t_("TOPMENU4EDITOR_TRANSMIT_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4EDITOR_TRANSMIT_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_transmit_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_transmit_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_transmit_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},save:{title:DA.locale.GetText.t_("TOPMENU4EDITOR_SAVE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4EDITOR_SAVE_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_save_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_save_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_save_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},template:{title:DA.locale.GetText.t_("TOPMENU4EDITOR_TEMPLATE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4EDITOR_TEMPLATE_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_template_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_template_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_template_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:null,pulldown:null},preview:{title:DA.locale.GetText.t_("TOPMENU4EDITOR_PREVIEW_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4EDITOR_PREVIEW_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_preview_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_preview_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_preview_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},spellcheck:{title:DA.locale.GetText.t_("SPELL_CHECK_BUTTON"),alt:DA.locale.GetText.t_("SPELL_CHECK_BUTTON"),smallIcon:DA.vars.clrRdir+"/maildetails_preview_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_preview_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_preview_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},back:{title:DA.locale.GetText.t_("TOPMENU4EDITOR_BACK_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4EDITOR_BACK_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_edit_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_edit_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_edit_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:1,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},print:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_print_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_print_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_print_dis.gif",className:"da_panelMenu4EditorItemLeft",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null},close:{title:DA.locale.GetText.t_("TOPMENU_CLOSE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU_CLOSE_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_close_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_close_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_close_dis.gif",className:"da_panelMenu4EditorItemRight",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},popy:{title:"",alt:"",smallIcon:DA.vars.clrRdir+"/maildetails_popy.gif",bigIcon:DA.vars.clrRdir+"/maildetails_popy.gif",disableIcon:DA.vars.clrRdir+"/maildetails_popy.gif",className:"da_panelMenu4EditorItemPopy",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null}},className:"da_panelMenu4Editor"},init:function(_9ee){
var i;
var _9f0=DA.vars.clrRdir;
if(!DA.util.isEmpty(_9ee.backup_org_clrRdir)){
_9f0=_9ee.backup_org_clrRdir;
}
this.panelImages.center=_9f0+"/mail_pop_back.gif";
this.menuData.items.transmit.smallIcon=_9f0+"/maildetails_transmit_s.gif";
this.menuData.items.transmit.bigIcon=_9f0+"/maildetails_transmit_b.gif";
this.menuData.items.transmit.disableIcon=_9f0+"/maildetails_transmit_dis.gif";
this.menuData.items.save.smallIcon=_9f0+"/maildetails_save_s.gif";
this.menuData.items.save.bigIcon=_9f0+"/maildetails_save_b.gif";
this.menuData.items.save.disableIcon=_9f0+"/maildetails_save_dis.gif";
this.menuData.items.template.smallIcon=_9f0+"/maildetails_template_s.gif";
this.menuData.items.template.bigIcon=_9f0+"/maildetails_template_b.gif";
this.menuData.items.template.disableIcon=_9f0+"/maildetails_template_dis.gif";
this.menuData.items.preview.smallIcon=_9f0+"/maildetails_preview_s.gif";
this.menuData.items.preview.bigIcon=_9f0+"/maildetails_preview_b.gif";
this.menuData.items.preview.disableIcon=_9f0+"/maildetails_preview_dis.gif";
this.menuData.items.spellcheck.smallIcon=_9f0+"/maildetails_preview_s.gif";
this.menuData.items.spellcheck.bigIcon=_9f0+"/maildetails_preview_b.gif";
this.menuData.items.spellcheck.disableIcon=_9f0+"/maildetails_preview_dis.gif";
this.menuData.items.back.smallIcon=_9f0+"/maildetails_edit_s.gif";
this.menuData.items.back.bigIcon=_9f0+"/maildetails_edit_b.gif";
this.menuData.items.back.disableIcon=_9f0+"/maildetails_edit_dis.gif";
this.menuData.items.print.smallIcon=_9f0+"/maildetails_print_s.gif";
this.menuData.items.print.bigIcon=_9f0+"/maildetails_print_b.gif";
this.menuData.items.print.disableIcon=_9f0+"/maildetails_print_dis.gif";
this.menuData.items.close.smallIcon=_9f0+"/maildetails_close_s.gif";
this.menuData.items.close.bigIcon=_9f0+"/maildetails_close_b.gif";
this.menuData.items.close.disableIcon=_9f0+"/maildetails_close_dis.gif";
this.menuData.items.popy.smallIcon=_9f0+"/maildetails_popy.gif";
this.menuData.items.popy.bigIcon=_9f0+"/maildetails_popy.gif";
this.menuData.items.popy.disableIcon=_9f0+"/maildetails_popy.gif";
var _9f1=this.menuData.items.template;
var _9f2=this.menuData.items.preview;
var _9f3=this.menuData.items.spellcheck;
var _9f4=this.menuData.items.transmit;
var _9f5=this.menuData.items.print;
if(DA.vars.config.template&&DA.vars.config.template.length>0){
_9f1.pulldown={};
_9f1.pulldown.className="da_topPanel4EditorPulldownMenu";
if(DA.vars.config.template.length>10){
YAHOO.util.Dom.addClass(_9f1.pulldown,"da_topPanel4EditorPulldownMenu2");
}
_9f1.pulldown.order=[];
_9f1.pulldown.order[0]=[];
_9f1.pulldown.items={};
for(i=0;i<DA.vars.config.template.length;i++){
_9f1.pulldown.order[0].push(i);
_9f1.pulldown.items[i]={text:DA.vars.config.template[i].name,onclick:Prototype.emptyFunction,args:[DA.vars.config.template[i].tid]};
}
}else{
_9f1.disable=1;
}
if(DA.vars.config.spellcheck){
_9f2.pulldown={};
_9f2.pulldown.className="da_topPanel4EditorPulldownMenu";
_9f2.pulldown.order=[];
_9f2.pulldown.order[0]=["0","1"];
_9f2.pulldown.items={};
_9f2.pulldown.items[0]={text:DA.locale.GetText.t_("SPELLCHECK"),onclick:Prototype.emptyFunction,args:[1,"preview"]};
_9f2.pulldown.items[1]={text:DA.locale.GetText.t_("SPELLCHECK_NO"),onclick:Prototype.emptyFunction,args:[0,"preview"]};
_9f4.pulldown={};
_9f4.pulldown.className="da_topPanel4EditorPulldownMenu";
_9f4.pulldown.order=[];
_9f4.pulldown.order[0]=["0","1"];
_9f4.pulldown.items={};
_9f4.pulldown.items[0]={text:DA.locale.GetText.t_("SPELLCHECK"),onclick:Prototype.emptyFunction,args:[1,"transmit"]};
_9f4.pulldown.items[1]={text:DA.locale.GetText.t_("SPELLCHECK_NO"),onclick:Prototype.emptyFunction,args:[0,"transmit"]};
}
if(DA.vars.system.spellcheck_button_visible&&DA.vars.config.spellcheck){
_9f3.disable=0;
}else{
_9f3.hidden=1;
}
_9f5.pulldown={};
_9f5.pulldown.className="da_topPanel43PanePulldownMenu";
_9f5.pulldown.order=[];
_9f5.pulldown.order[0]=["0","1"];
_9f5.pulldown.items={};
_9f5.pulldown.items[0]={text:DA.locale.GetText.t_("PRINT_WITH_TO"),onclick:Prototype.emptyFunction,args:["on","printtoconfig"]};
_9f5.pulldown.items[1]={text:DA.locale.GetText.t_("PRINT_WITHOUT_TO"),onclick:Prototype.emptyFunction,args:["off","printtoconfig"]};
var html="<div id=\""+this.panelId+"_TPC\" class=\"da_topPanel4Editor\">"+"<div id=\""+this.panelId+"_TPCL\" class=\"da_topPanel4EditorLeft\" style=\"background-image:url("+this.panelImages.left+")\"></div>"+"<div id=\""+this.panelId+"_TPCR\" class=\"da_topPanel4EditorRight\" style=\"background-image:url("+this.panelImages.right+")\"></div>"+"<div id=\""+this.panelId+"_TPCC\" class=\"da_topPanel4EditorCenter\" style=\"background-image:url("+this.panelImages.center+")\"></div>"+"</div>";
this.panelNode.innerHTML=html;
this.panelMenu=new DA.widget.PanelMenuController(this.menuNode,this.menuData);
},setFunction:function(_9f7){
var me=this;
var key;
DA.customEvent.fire("topPanelController4EditorSetFunctionBefore",this,{editor:_9f7});
this.menuData.items.transmit.onSelect=function(){
_9f7.transmit();
};
this.menuData.items.save.onSelect=function(){
_9f7.save();
};
this.menuData.items.preview.onSelect=function(){
_9f7.preview();
};
this.menuData.items.spellcheck.onSelect=function(){
_9f7.spellcheck(1,"preview");
};
this.menuData.items.back.onSelect=function(){
_9f7.back();
};
this.menuData.items.close.onSelect=function(){
if(DA.util.confirm(DA.locale.GetText.t_("EDITOR_CLOSE_CONFIRM"))){
DA.windowController.allClose();
_9f7.close();
}
};
this.menuData.items.print.onSelect=function(){
_9f7.print(null);
};
if(this.menuData.items.template.pulldown){
for(key in this.menuData.items.template.pulldown.items){
if(key.match(/^\d+$/)){
this.menuData.items.template.pulldown.items[key].onclick=function(e,a){
_9f7.template(a[0]);
};
}
}
}
if(this.menuData.items.preview.pulldown){
for(key in this.menuData.items.preview.pulldown.items){
if(key.match(/^\d+$/)){
this.menuData.items.preview.pulldown.items[key].onclick=function(e,a){
_9f7.spellcheck(a[0],a[1]);
};
}
}
}
if(this.menuData.items.transmit.pulldown){
for(key in this.menuData.items.transmit.pulldown.items){
if(key.match(/^\d+$/)){
this.menuData.items.transmit.pulldown.items[key].onclick=function(e,a){
_9f7.spellcheck(a[0],a[1]);
};
}
}
}
for(key in this.menuData.items.print.pulldown.items){
if(key.match(/^\d+$/)){
this.menuData.items.print.pulldown.items[key].onclick=function(e,a){
_9f7.print(a[0]);
};
}
}
DA.customEvent.fire("topPanelController4EditorSetFunctionAfter",this,{editor:_9f7});
}};
if(!DA||!DA.mailer||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.mailer.TopPanelController4Viewer=function(_a02,_a03){
this.panelId=_a02.id;
this.panelNode=_a02;
this.menuNode=_a03;
if(DA.vars.custom.viewer.setTopPanel){
eval(DA.vars.custom.viewer.setTopPanel);
}
this.init();
};
DA.mailer.TopPanelController4Viewer.prototype={panelId:null,panelNode:null,menuNode:null,panelMenu:null,panelImages:{left:DA.vars.imgRdir+"/null.gif",center:DA.vars.clrRdir+"/mail_pop_back.gif",right:DA.vars.imgRdir+"/null.gif"},menuData:{leftOrder:["edit","reply","replyall","forward","delete","print","filter","prev","next","option"],rightOrder:["popy","close"],items:{edit:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_EDIT_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_EDIT_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_edit_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_edit_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_edit_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:1,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},reply:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_REPLY_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_REPLY_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_reply_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_reply_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_reply_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},replyall:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_REPLYALL_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_REPLYALL_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_replyall_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_replyall_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_replyall_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},forward:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_FORWARD_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_FORWARD_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_forward_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_forward_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_forward_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},"delete":{title:DA.locale.GetText.t_("TOPMENU4VIEWER_DELETE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_DELETE_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_delete_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_delete_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_delete_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},print:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_print_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_print_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_print_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},filter:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_FILTER_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_FILTER_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_filter_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_filter_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_filter_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},prev:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_PREV_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_PREV_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_back_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_back_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_back_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},next:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_NEXT_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_NEXT_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_next_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_next_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_next_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:Prototype.emptyFunction,pulldown:null},option:{title:DA.locale.GetText.t_("TOPMENU4VIEWER_OPTION_TITLE"),alt:DA.locale.GetText.t_("TOPMENU4VIEWER_OPTION_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_option_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_option_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_option_dis.gif",className:"da_panelMenu4ViewerItemLeft",hidden:0,disable:0,onSelect:null,pulldown:{order:[["header","export","savetolib","saveattachestolib","sales"]],items:{header:{text:DA.locale.GetText.t_("MESSAGE_HEADER_MENU"),onclick:Prototype.emptyFunction},"export":{text:DA.locale.GetText.t_("MESSAGE_EXPORT_MENU"),onclick:Prototype.emptyFunction},savetolib:{text:DA.locale.GetText.t_("MESSAGE_SAVETOLIB_MENU"),onclick:Prototype.emptyFunction,hidden:(DA.vars.config.save_to_lib===0)?1:0},saveattachestolib:{text:DA.locale.GetText.t_("MESSAGE_SAVEATTACHESTOLIBOPTION_MENU"),onclick:Prototype.emptyFunction},sales:{text:DA.locale.GetText.t_("MESSAGE_REGIST_MENU",DA.vars.hibiki.sales.name),onclick:Prototype.emptyFunction,hidden:(DA.vars.license.hibiki_sales===1&&DA.vars.system.sales_datalink_enable!=="off")?0:1}},className:"da_topPanel4ViewerPulldownMenu"}},close:{title:DA.locale.GetText.t_("TOPMENU_CLOSE_TITLE"),alt:DA.locale.GetText.t_("TOPMENU_CLOSE_TITLE"),smallIcon:DA.vars.clrRdir+"/maildetails_close_s.gif",bigIcon:DA.vars.clrRdir+"/maildetails_close_b.gif",disableIcon:DA.vars.clrRdir+"/maildetails_close_dis.gif",className:"da_panelMenu4ViewerItemRight",hidden:0,disable:0,onSelect:function(){
DA.windowController.allClose();
window.close();
},pulldown:null},popy:{title:"",alt:"",smallIcon:DA.vars.clrRdir+"/maildetails_popy.gif",bigIcon:DA.vars.clrRdir+"/maildetails_popy.gif",disableIcon:DA.vars.clrRdir+"/maildetails_popy.gif",className:"da_panelMenu4ViewerItemPopy",hidden:0,disable:1,onSelect:Prototype.emptyFunction,pulldown:null}},className:"da_panelMenu4Viewer"},init:function(){
var _a04=this.menuData.items.reply;
var _a05=this.menuData.items.replyall;
var _a06=this.menuData.items.forward;
var _a07=this.menuData.items.print;
_a04.pulldown={};
_a04.pulldown.className="da_topPanel4ViewerPulldownMenu";
_a04.pulldown.order=[];
_a04.pulldown.order[0]=["0","1","2"];
_a04.pulldown.items={};
_a04.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_reply==="01")?true:false};
_a04.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_reply==="11")?true:false};
_a04.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_reply==="99")?true:false};
_a05.pulldown={};
_a05.pulldown.className="da_topPanel4ViewerPulldownMenu";
_a05.pulldown.order=[];
_a05.pulldown.order[0]=["0","1","2"];
_a05.pulldown.items={};
_a05.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_reply==="01")?true:false};
_a05.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_reply==="11")?true:false};
_a05.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_reply==="99")?true:false};
_a06.pulldown={};
_a06.pulldown.className="da_topPanel4ViewerPulldownMenu";
_a06.pulldown.order=[];
_a06.pulldown.order[0]=["0","1","2","3","4","5"];
_a06.pulldown.items={};
_a06.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_00_TITLE"),onclick:Prototype.emptyFunction,args:["00"],selected:(DA.vars.config.quote_forward==="00")?true:false};
_a06.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_forward==="01")?true:false};
_a06.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_02_TITLE"),onclick:Prototype.emptyFunction,args:["02"],selected:(DA.vars.config.quote_forward==="02")?true:false};
_a06.pulldown.items[3]={text:DA.locale.GetText.t_("QUOTE_10_TITLE"),onclick:Prototype.emptyFunction,args:["10"],selected:(DA.vars.config.quote_forward==="10")?true:false};
_a06.pulldown.items[4]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_forward==="11")?true:false};
_a06.pulldown.items[5]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_forward==="99")?true:false};
_a07.pulldown={};
_a07.pulldown.className="da_topPanel43PanePulldownMenu";
_a07.pulldown.order=[];
_a07.pulldown.order[0]=["0","1"];
_a07.pulldown.items={};
_a07.pulldown.items[0]={text:DA.locale.GetText.t_("PRINT_WITH_TO"),onclick:Prototype.emptyFunction,args:["on","printtoconfig"]};
_a07.pulldown.items[1]={text:DA.locale.GetText.t_("PRINT_WITHOUT_TO"),onclick:Prototype.emptyFunction,args:["off","printtoconfig"]};
var html="<div id=\""+this.panelId+"_TPC\" class=\"da_topPanel4Viewer\">"+"<div id=\""+this.panelId+"_TPCL\" class=\"da_topPanel4ViewerLeft\" style=\"background-image:url("+this.panelImages.left+")\"></div>"+"<div id=\""+this.panelId+"_TPCR\" class=\"da_topPanel4ViewerRight\" style=\"background-image:url("+this.panelImages.right+")\"></div>"+"<div id=\""+this.panelId+"_TPCC\" class=\"da_topPanel4ViewerCenter\" style=\"background-image:url("+this.panelImages.center+")\"></div>"+"</div>";
this.panelNode.innerHTML=html;
DA.customEvent.fire("TopPanelController4ViewerInitAfter",this,{reply:_a04,replyall:_a05,forward:_a06});
this.panelMenu=new DA.widget.PanelMenuController(this.menuNode,this.menuData);
},setFunction:function(_a09){
var key;
if(_a09.selectMessageEditable){
this.panelMenu.show("edit");
}else{
this.panelMenu.hide("edit");
}
if(_a09.selectMessageExportable){
this.menuData.items.option.pulldownMenu.enabled("export");
}else{
this.menuData.items.option.pulldownMenu.disabled("export");
}
this.menuData.items.edit.onSelect=function(){
_a09.edit();
};
this.menuData.items.reply.onSelect=function(){
_a09.reply();
};
this.menuData.items.replyall.onSelect=function(){
_a09.replyall();
};
this.menuData.items.forward.onSelect=function(){
_a09.forward();
};
this.menuData.items["delete"].onSelect=function(){
_a09["delete"]();
};
this.menuData.items.print.onSelect=function(){
_a09.print(null);
};
this.menuData.items.filter.onSelect=function(){
_a09.filter();
};
this.menuData.items.prev.onSelect=function(){
_a09.prev();
};
this.menuData.items.next.onSelect=function(){
_a09.next();
};
this.menuData.items.option.pulldown.items.header.onclick=function(){
_a09.header();
};
this.menuData.items.option.pulldown.items["export"].onclick=function(){
_a09["export"]();
};
this.menuData.items.option.pulldown.items.sales.onclick=function(){
_a09.sales();
};
this.menuData.items.option.pulldown.items.savetolib.onclick=function(){
_a09.savetolib();
};
this.menuData.items.option.pulldown.items.saveattachestolib.onclick=function(e){
_a09.showsaveattachestolibdialog(e.clientX,e.clientY);
};
if(_a09.getattachesnum()>0){
this.menuData.items.option.pulldown.items.saveattachestolib.hidden=0;
}else{
this.menuData.items.option.pulldown.items.saveattachestolib.hidden=1;
}
var _a0c=this.menuData.items.reply;
var _a0d=this.menuData.items.replyall;
var _a0e=this.menuData.items.forward;
var _a0f=this.menuData.items.print;
for(key in _a0c.pulldown.items){
if(key.match(/^\d+$/)){
_a0c.pulldown.items[key].onclick=function(e,a){
_a09.reply(a[0]);
};
}
}
for(key in _a0d.pulldown.items){
if(key.match(/^\d+$/)){
_a0d.pulldown.items[key].onclick=function(e,a){
_a09.replyall(a[0]);
};
}
}
for(key in _a0e.pulldown.items){
if(key.match(/^\d+$/)){
_a0e.pulldown.items[key].onclick=function(e,a){
_a09.forward(a[0]);
};
}
}
for(key in _a0f.pulldown.items){
if(key.match(/^\d+$/)){
_a0f.pulldown.items[key].onclick=function(e,a){
_a09.print(a[0]);
};
}
}
DA.customEvent.fire("TopPanelController4ViewerSetFunctionAfter",this,{viewer:_a09,reply:_a0c,replyall:_a0d,forward:_a0e});
}};
if(!DA||!DA.mailer||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.mailer.TopPanelController43PANE=function(_a18,_a19){
this.panelId=_a18.id;
this.panelNode=_a18;
this.menuNode=_a19;
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
var _a1c=this.menuData.items.reply;
var _a1d=this.menuData.items.replyall;
var _a1e=this.menuData.items.forward;
var _a1f=this.menuData.items.print;
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
_a1c.pulldown={};
_a1c.pulldown.className="da_topPanel43PanePulldownMenu";
_a1c.pulldown.order=[];
_a1c.pulldown.order[0]=["0","1","2"];
_a1c.pulldown.items={};
_a1c.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_reply==="01")?true:false};
_a1c.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_reply==="11")?true:false};
_a1c.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_reply==="99")?true:false};
_a1d.pulldown={};
_a1d.pulldown.className="da_topPanel43PanePulldownMenu";
_a1d.pulldown.order=[];
_a1d.pulldown.order[0]=["0","1","2"];
_a1d.pulldown.items={};
_a1d.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_reply==="01")?true:false};
_a1d.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_reply==="11")?true:false};
_a1d.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_reply==="99")?true:false};
_a1e.pulldown={};
_a1e.pulldown.className="da_topPanel43PanePulldownMenu";
_a1e.pulldown.order=[];
_a1e.pulldown.order[0]=["0","1","2","3","4","5"];
_a1e.pulldown.items={};
_a1e.pulldown.items[0]={text:DA.locale.GetText.t_("QUOTE_00_TITLE"),onclick:Prototype.emptyFunction,args:["00"],selected:(DA.vars.config.quote_forward==="00")?true:false};
_a1e.pulldown.items[1]={text:DA.locale.GetText.t_("QUOTE_01_TITLE"),onclick:Prototype.emptyFunction,args:["01"],selected:(DA.vars.config.quote_forward==="01")?true:false};
_a1e.pulldown.items[2]={text:DA.locale.GetText.t_("QUOTE_02_TITLE"),onclick:Prototype.emptyFunction,args:["02"],selected:(DA.vars.config.quote_forward==="02")?true:false};
_a1e.pulldown.items[3]={text:DA.locale.GetText.t_("QUOTE_10_TITLE"),onclick:Prototype.emptyFunction,args:["10"],selected:(DA.vars.config.quote_forward==="10")?true:false};
_a1e.pulldown.items[4]={text:DA.locale.GetText.t_("QUOTE_11_TITLE"),onclick:Prototype.emptyFunction,args:["11"],selected:(DA.vars.config.quote_forward==="11")?true:false};
_a1e.pulldown.items[5]={text:DA.locale.GetText.t_("QUOTE_99_TITLE"),onclick:Prototype.emptyFunction,args:["99"],selected:(DA.vars.config.quote_forward==="99")?true:false};
var html="<div id=\""+this.panelId+"_TPC\" class=\"da_topPanel43Pane\">"+"<div id=\""+this.panelId+"_TPCL\" class=\"da_topPanel43PaneLeft\" style=\"background-image:url("+this.panelImages.left+")\"></div>"+"<div id=\""+this.panelId+"_TPCR\" class=\"da_topPanel43PaneRight\" style=\"background-image:url("+this.panelImages.right+")\"></div>"+"<div id=\""+this.panelId+"_TPCC\" class=\"da_topPanel43PaneCenter\" style=\"background-image:url("+this.panelImages.center+")\"></div>"+"</div>";
this.panelNode.innerHTML=html;
_a1f.pulldown={};
_a1f.pulldown.className="da_topPanel43PanePulldownMenu";
_a1f.pulldown.order=[];
_a1f.pulldown.order[0]=["0","1"];
_a1f.pulldown.items={};
_a1f.pulldown.items[0]={text:DA.locale.GetText.t_("PRINT_WITH_TO"),onclick:Prototype.emptyFunction,args:["on","printtoconfig"]};
_a1f.pulldown.items[1]={text:DA.locale.GetText.t_("PRINT_WITHOUT_TO"),onclick:Prototype.emptyFunction,args:["off","printtoconfig"]};
DA.customEvent.fire("TopPanelController43PANEInitAfter",this,{make:make,reply:_a1c,replyall:_a1d,forward:_a1e});
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
},setFunction:function(_a23){
var key;
var me=this;
var make=this.menuData.items.make;
var _a27=this.menuData.items.reply;
var _a28=this.menuData.items.replyall;
var _a29=this.menuData.items.forward;
var _a2a=this.menuData.items.print;
make.onSelect=function(){
_a23.make();
};
_a27.onSelect=function(){
_a23.reply(null,me.selectedFid,me.selectedUid);
};
_a28.onSelect=function(){
_a23.replyall(null,me.selectedFid,me.selectedUid);
};
_a29.onSelect=function(){
_a23.forward(null,me.selectedFid,me.selectedUid);
};
_a2a.onSelect=function(){
_a23.print(null);
};
if(make.pulldown){
for(key in make.pulldown.items){
if(key.match(/^\d+$/)){
make.pulldown.items[key].onclick=function(e,a){
_a23.make(a[0]);
};
}
}
}
for(key in _a27.pulldown.items){
if(key.match(/^\d+$/)){
_a27.pulldown.items[key].onclick=function(e,a){
_a23.reply(a[0],me.selectedFid,me.selectedUid);
};
}
}
for(key in _a28.pulldown.items){
if(key.match(/^\d+$/)){
_a28.pulldown.items[key].onclick=function(e,a){
_a23.replyall(a[0],me.selectedFid,me.selectedUid);
};
}
}
for(key in _a29.pulldown.items){
if(key.match(/^\d+$/)){
_a29.pulldown.items[key].onclick=function(e,a){
_a23.forward(a[0],me.selectedFid,me.selectedUid);
};
}
}
for(key in _a2a.pulldown.items){
if(key.match(/^\d+$/)){
_a2a.pulldown.items[key].onclick=function(e,a){
_a23.print(a[0]);
};
}
}
DA.customEvent.fire("TopPanelController43PANESetFunctionAfter",this,{viewer:_a23,make:make,reply:_a27,replyall:_a28,forward:_a29});
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
DA.mailer.widget.MboxGrid=function(_a35){
var _a36={visibleRows:10,folderId:0,folderType:0,isUsingFakeTable:true};
Object.extend(_a36,_a35||{});
if(_a36.srid||_a36.searchMode){
this.setSearchMode();
}
this.isUsingFakeTable=_a36.isUsingFakeTable;
this.visibleRows=_a36.visibleRows;
if(_a36.folderTreeController){
this.folderTreeController=_a36.folderTreeController;
}
if("function"===typeof _a36.onLoading){
this.onLoading=_a36.onLoading;
}
if("function"===typeof _a36.onLoadDone){
this.onLoadDone=_a36.onLoadDone;
}
if("function"===typeof _a36.onDeletePress){
this.onDeletePress=_a36.onDeletePress;
}
this.init(_a36);
};
DA.mailer.widget.MboxGrid.prototype={searchMode:false,url:DA.vars.cgiRdir+"/ajx_ma_list.cgi",columns:[{key:"subject",name:"subject",width:"45%"},{key:"from",name:"from",width:"20%"},{key:"to",name:"to",width:"20%"},{key:"date",name:"date",width:"15%"}],fromColumnIndex:1,dateColumnIndex:1,sizeColumnIndex:1,folderId:0,folderType:0,folderTreeController:null,liveGrid:null,_mdd:null,_isBeingDragged:false,searchMoveFolderDialog:null,init:function(_a37,_a38){
var me=this;
var conf=DA.vars.config;
me.folderTreeData=_a38;
var _a3b={attachment:"mailsort_attach.gif",flagged:"mailsort_flag.gif",priority:"mailsort_important.gif",seen:"mailsort_mail.gif"};
var _a3c=DA.vars.imgRdir+"/";
function getTitleHtml(_a3d){
var img=_a3b[_a3d];
if(img){
return "<img src='"+_a3c+img+"'/>";
}else{
return DA.locale.GetText.t_("MBOXGRID_COLUMNTITLE_"+_a3d.toUpperCase());
}
}
var _a3f=false;
var _a40=false;
var _a41=false;
if(conf.list_order&&conf.list_order.split){
this.columns=conf.list_order.split("|").map(function(_a42,i){
if(_a42==="from"){
me.fromColumnIndex=i;
_a3f=true;
}else{
if(_a42==="date"){
me.dateColumnIndex=i;
_a40=true;
}else{
if(_a42==="size"){
me.sizeColumnIndex=i;
_a41=true;
}
}
}
return {width:conf.list_width[_a42],name:getTitleHtml(_a42),key:_a42};
});
this._percentify();
if(!_a3f){
me.fromColumnIndex=null;
}
if(!_a40){
me.dateColumnIndex=null;
}
if(!_a41){
me.sizeColumnIndex=null;
}
}
if(!_a37.containerElem){
throw "MISSING ARG: containerElem";
}
this.containerElem=_a37.containerElem;
this._initCustomEvents();
this._setupSubscribers();
this._messageMoverJobs=$H({});
if(this.searchMode){
this.loadSearchResults(_a37.totalMessages,_a37.fid,_a37.srid,_a37.type);
me.searchMoveFolderDialog=new DA.widget.SearchMoveFolderDialog("da_searchMoveFolderDialog",DA.locale.GetText.t_("SEARCH_MOVE_FOLDER_DIALOG_TITLE"),{onEnter:function(){
var _a44=document.getElementById("da_searchMoveToFid").value;
if(window.__messageSearcher.folderTreeData[_a44].move_m===1){
me.moveSelected({fid:_a44});
return true;
}else{
alert(DA.locale.GetText.t_("MESSAGE_MOVE_FOLDER_ERROR"));
return false;
}
}});
}else{
this.changeFolder(_a37.folderId,_a37.folderType);
this._mdd=new DA.mailer.dd.MboxMail(this.liveGrid.tableId);
this._mdd.mboxGrid=this;
}
this.setupCSS();
this._onLoadDoneJobs=[];
},_initCustomEvents:function(){
this.onFolderChanged=new YAHOO.util.CustomEvent("folderChanged");
this.onDoubleClick=new YAHOO.util.CustomEvent("onDoubleClick");
},_add_reply_flag:function(_a45){
var _a46=this.liveGrid.buffer.findRowMetaData(function(r){
if((r.fid===_a45.fid.toString())&&(r.uid===_a45.uid.toString())){
return r;
}
});
if(DA.vars.system.no_replied_flag===0&&_a46.length===1){
_a46[0].replied="1";
_a46[0].forwarded="0";
this.setRowAppearance(_a46[0],["replied","forwarded"]);
}
},_add_forwarded_flag:function(_a48){
var _a49=this.liveGrid.buffer.findRowMetaData(function(r){
if((r.fid===_a48.fid.toString())&&(r.uid===_a48.uid.toString())){
return r;
}
});
if(DA.vars.system.no_replied_flag===0&&_a49.length===1){
_a49[0].replied="0";
_a49[0].forwarded="1";
this.setRowAppearance(_a49[0],["replied","forwarded"]);
}
},_removeMessagesFromGrid:function(_a4b){
var _a4c=this._messageMoverJobs[_a4b];
if(!_a4c){
return;
}
var _a4d=_a4c.count;
if(_a4d===0){
return;
}
var me=this;
var lg=this.liveGrid;
this._updateExceptionFilter();
var _a50=lg.metaData.getTotalRows();
_a50-=_a4d;
lg.metaData.setTotalRows(_a50);
lg.scroller.updateSize();
lg.viewPort.isPartialBlank=true;
var _a51={};
_a4c.singles.each(function(_a52){
_a51[_a52.fid+"_"+_a52.uid]=true;
});
var _a53=_a4c.ranges;
var _a54=lg.buffer.removeIf(function(_a55){
var _a56=_a55.meta;
if(!_a56){
return false;
}
if(_a51[_a56.fid+"_"+_a56.uid]){
return true;
}
if(_a53.length<1){
return false;
}
return me._checkShiftRanges(_a56,_a53);
});
var _a57=this._adjustViewPortStartPos(_a4c,lg);
var _a58=this._adjustBufferStartPos(_a4c,lg);
this._repairBufferSeqNums(lg);
var _a59=lg.scroller.moveScroll(lg.viewPort.lastRowPos);
if(!_a59){
lg.requestContentRefresh(lg.viewPort.lastRowPos);
lg.viewPort.refreshContents(lg.viewPort.lastRowPos);
}
},_utils:{removeShiftRanges:function(_a5a){
var _a5b={}.extend(_a5a);
if(!_a5b.ranges.length){
return _a5b;
}
_a5b.ranges.each(function(oSR){
_a5b.count-=oSR.count;
});
_a5b.ranges=[];
return _a5b;
},listConcat:function(l,a){
if(a&&a.length){
return l.concat(a||[]);
}else{
return l;
}
},asFidColonUid:function(_a5f){
return _a5f.fid+":"+_a5f.uid;
},asFidColonUidRange:function(r){
return r.start.fid+":"+r.start.uid+"-"+r.end.fid+":"+r.end.uid;
},mkMsgAcceptor:function(_a61,_a62){
var _a63=_a61.ranges;
var hash=$H({});
_a61.singles.each(function(m){
hash[m.fid+"_"+m.uid]=true;
});
return function(_a66){
if(!_a66){
return false;
}
_a66=_a66.meta||_a66;
if(hash[_a66.fid+"_"+_a66.uid]){
return true;
}
if(_a63.length<1){
return false;
}
if(!_a62){
return false;
}
return _a62._checkShiftRanges(_a66,_a63);
};
},mkCSSClassNameForRow:function(_a67){
return ["seen","flagged","attachment","priority","toself","deleted","replied","forwarded"].map(function(prop){
var _a69=_a67[prop];
if(!_a69){
return "";
}
var c;
if(prop==="forwarded"){
c="w";
}else{
c=prop.charAt(0);
}
return c+_a69;
}).join(" ");
},yes:function(){
return true;
}},refreshGrid:function(){
var lg=this.liveGrid;
var _a6c=lg.viewPort.lastRowPos;
lg.buffer.removeIf(this._utils.yes);
lg.viewPort.isPartialBlank=true;
lg.requestContentRefresh(_a6c);
},_setupSubscribers:function(){
var E=DA.mailer.Events;
if(!E){
return;
}
function mkHndlr(f){
return function(type,args){
var _,_a72;
if(!args||!(_a72=args[0])||!(_=args[1])||!(_.target&&_.messages)){
return;
}
var _a73=args[2];
var _a74=false;
if(parseInt(_.target.fid,10)===this.folderId){
_a74=true;
}
var ours=DA.util.areEquivObjs(_.messages.identity,this._getIdentity());
var _a76=(!ours)&&_.messages.ranges.length;
f.call(this,_a74,_a76,_a72,_.messages,_.target,_a73);
};
}
var _a77,_a78,_a79;
E.onMessagesMoving.subscribe(_a77=mkHndlr(function(_a7a,_a7b,_a7c,_a7d,_a7e){
if(_a7a){
return;
}
var _a7f=_a7b?this._utils.removeShiftRanges(_a7d):_a7d;
if(_a7d.singles.length===1){
if(_a7d.single.mode===1){
this._add_reply_flag({fid:_a7d.single.fid,uid:_a7d.single.originuid});
}else{
if(_a7d.single.mode===2){
this._add_forwarded_flag({fid:_a7d.single.fid,uid:_a7d.single.originuid});
}else{
}
}
}
this._messageMoverJobs[_a7c]=_a7f;
this._removeMessagesFromGrid(_a7c);
}),this,true);
E.onMessagesMoved.subscribe(_a78=mkHndlr(function(_a80,_a81,_a82,_a83,_a84,_a85){
if(_a80){
this.refreshGrid();
return;
}
delete this._messageMoverJobs[_a82];
if(_a81){
this.refreshGrid();
}
if(this._messageMoverJobs.entries().length===0){
this._updateExceptionFilter();
}
}),this,true);
E.onMessagesMoveFailure.subscribe(_a79=mkHndlr(function(_a86,_a87,_a88){
delete this._messageMoverJobs[_a88];
this._updateExceptionFilter();
}),this,true);
function mkFlagHndlr(f){
return function(type,args){
var _,_a8d;
if(!args||!(_a8d=args[0])||!(_=args[1])||!(_.property&&_.messages)){
return;
}
var _a8e=args[2];
var _a8f=_.state!==false;
var ours=DA.util.areEquivObjs(_.messages.identity,this._getIdentity());
var _a91=(!ours)&&_.messages.ranges.length;
f.call(this,_a91,_a8d,_.messages,_.property,_a8f,_a8e);
};
}
var _a92=$H({});
var _a93,_a94,_a95;
E.onMessagesFlagging.subscribe(_a93=mkFlagHndlr(function(_a96,_a97,_a98,_a99,_a9a,_a9b){
var _a9c=_a96?this._utils.removeShiftRanges(_a98):_a98;
var me=this;
var _a9e=this.liveGrid.buffer.findRowMetaData(this._utils.mkMsgAcceptor(_a98,me));
var _a9f=_a9e.map(function(md){
var _aa1=md[_a99];
var _aa2=md.className;
md[_a99]=_a9a?"1":"0";
me.setRowAppearance(md,[_a99]);
return {property:_aa1,className:_aa2,mmdata:md};
});
_a92[_a97]={undo:function(){
_a9f.each(function(undo){
var _aa4=undo.mmdata;
_aa4[_a99]=undo.property;
_aa4.className=undo.className;
me.setRowAppearance(_aa4);
});
}};
}),this,true);
E.onMessagesFlagged.subscribe(_a94=mkFlagHndlr(function(_aa5,_aa6,_aa7,_aa8,_aa9,_aaa){
if(_aa5){
this.refreshGrid();
}
delete _a92[_aa6];
}),this,true);
E.onMessagesFlagFailure.subscribe(_a95=mkFlagHndlr(function(_aab,_aac,_aad,_aae,_aaf,_ab0){
var job=_a92[_aac];
if(!job){
return;
}
job.undo();
delete _a92[_aac];
}),this,true);
var _ab2;
E.onMessageRead.subscribe(_ab2=function(type,args){
var _ab5=args[0];
if(!_ab5||!_ab5.uid){
return;
}
if(!DA.util.cmpNumber(_ab5.fid,this.folderId)&&!DA.util.cmpNumber(_ab5.srid,this._getIdentity().srid)){
return;
}
var tr=this.findRowByMMData(_ab5);
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
E.onMessagesMoving.unsubscribe(_a77,this);
E.onMessagesMoved.unsubscribe(_a78,this);
E.onMessagesMoveFailure.unsubscribe(_a79,this);
E.onMessagesFlagging.unsubscribe(_a93,this);
E.onMessagesFlagged.unsubscribe(_a94,this);
E.onMessagesFlagFailure.unsubscribe(_a95,this);
E.onMessageRead.unsubscribe(_ab2,this);
},this,true);
},_getIdentity:function(){
var _ab8=this.liveGrid.getParameters();
delete _ab8.except;
_ab8.isaMboxGrid=true;
return _ab8;
},setupCSS:function(){
var _ab9=this.isUsingFakeTable?"div#"+this.liveGrid.tableId+" div.t1":"table#"+this.liveGrid.tableId+" tr.t1";
var _aba="color:"+DA.vars.config.toself_color;
DA.dom.createCSSRule(_ab9,_aba);
},_setupContextMenu:function(){
var t_=DA.locale.GetText.t_;
var t=function(key){
return t_("MBOXGRID_ROWCONTEXTMENU_"+key);
};
var _abe=this._utils.asFidColonUid;
var _abf=this._utils.asFidColonUidRange;
var _ac0=DA.mailer.Events;
var me=this;
var _ac2=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_flag.cgi");
var _ac3=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi");
_ac3.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("EXPORT_ERROR"));
DA.waiting.hide();
};
_ac3.callback=function(o){
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
var _ac8=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi");
_ac8.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("SAVE_TO_LIB_ERROR"));
DA.waiting.hide();
};
_ac8.callback=function(o){
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
var _acd=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_filter.cgi");
_acd.errorHandler=function(e,_acf){
DA.util.warn(DA.locale.GetText.t_("FILTER_ERROR"));
_ac0.onMessagesFilterFailure.fire({srcFid:_acf.fid});
DA.waiting.hide();
};
_acd.callback=function(o,_ad1){
if(DA.mailer.util.checkResult(o)){
_ac0.onMessagesFiltered.fire({srcFid:_ad1.fid,response:o});
}
DA.waiting.hide();
};
var _ad2=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_ma_move.cgi");
_ad2.errorHandler=function(e,_ad4){
DA.util.warn(DA.locale.GetText.t_("JOIN_ERROR"));
DA.waiting.hide();
};
_ad2.callback=function(o,_ad6){
if(DA.mailer.util.checkResult(o)){
DA.mailer.windowController.viewerOpen(o.fid,o.uid);
}
DA.waiting.hide();
};
function toggleAllOn(_ad7,prop,_ad9){
_ac0.onMessageFlagRequest.fire({messages:_ad7,property:prop,state:_ad9!==true});
}
function toggleAllOff(_ada,prop){
return toggleAllOn(_ada,prop,true);
}
function _mkIsSet_str(prop){
return function(_add){
return _add&&_add[prop]&&_add[prop].charAt(0)==="1";
};
}
function _mkIsSet_int(prop){
return function(_adf){
return _adf&&_adf[prop]&&_adf[prop]===1;
};
}
function _mkIsSet_coerce(prop){
return function(_ae1){
var v;
return _ae1&&(v=_ae1[prop])&&(v===1||(v.charAt&&v.charAt(0)==="1"));
};
}
function printMail(_ae3){
var _ae4=me.getSelected().single;
DA.windowController.winOpen(DA.vars.cgiRdir+"/ma_ajx_print.cgi?fid="+_ae3.fid+"&uid="+_ae4.uid,"",710,600);
}
function showMoveFolderDialog(x,y){
window.__mboxGrid.searchMoveFolderDialog.show(x,y);
}
function checkAll(_ae7,f){
if(!_ae7||!_ae7.count||_ae7.count<1){
return {none:true};
}
if(_ae7.count===1){
if(_ae7.single&&f(_ae7.single)){
return {all:true};
}else{
return {none:true};
}
}
if(_ae7.ranges&&_ae7.ranges.length>0){
return {some:true};
}
if(!_ae7.singles||_ae7.singles.length===0){
return {none:true};
}
var _ae9=0;
var _aea=0;
var arr=_ae7.singles;
arr.each(function(a){
if(f(a)){
++_aea;
}else{
++_ae9;
}
});
return arr.length===_aea?{all:true}:arr.length===_ae9?{none:true}:{some:true};
}
var _aed=_mkIsSet_coerce("flagged");
var _aee=_mkIsSet_coerce("seen");
var _aef=function(f){
return function(e,args){
var _af3=me.getSelected().single;
if(!_af3){
return;
}
return f(_af3);
};
};
var _af4=function(f){
return function(e,args){
var _af8=me.getSelected();
if(!_af8||!_af8.count){
return;
}
var _af9=_af8.singles?_af8.singles:_af8.single?[_af8.single]:[];
var _afa=_af8.ranges;
_afa=(_afa&&_afa.map)?_afa:[];
var fid=_af8.fid;
var _afc=_af9.map(_abe);
var _afd=_afa.map(_abf);
return f(fid,_afc,_afd);
};
};
var _afe=new DA.widget.ContextMenuController("da_mboxGridContextMenu",this.liveGrid.tableId,{order:[["open"],["reply","replyall","forward"],["delete"],["print"],["markasread","markasunread","flag","unflag"],["export","savetolib","filter","join","movefolder"]],items:{open:{text:t("OPEN"),onclick:_aef(function(_aff){
if(DA.util.cmpNumber(_aff.open_m,2)){
if(DA.mailer.util.isBackupFolder(_aff.type)){
DA.mailer.windowController.editorOpenBackUp("edit",_aff.fid,_aff.uid,_aff.backup_maid,_aff.backup_org_clrRdir);
}else{
DA.mailer.windowController.editorOpen("edit",_aff.fid,_aff.uid);
}
}else{
DA.mailer.windowController.viewerOpen(_aff.fid,_aff.uid,_aff.srid);
}
})},reply:{text:t("REPLY"),onclick:_aef(function(_b00){
DA.mailer.windowController.editorOpen("reply",_b00.fid,_b00.uid);
})},replyall:{text:t("REPLYALL"),onclick:_aef(function(_b01){
DA.mailer.windowController.editorOpen("all_reply",_b01.fid,_b01.uid);
})},forward:{text:t("FORWARD"),onclick:_aef(function(_b02){
DA.mailer.windowController.editorOpen("forward",_b02.fid,_b02.uid);
})},markasread:{text:t("MARKASREAD"),onclick:function(e,args){
toggleAllOn(me.getSelected(),"seen");
}},markasunread:{text:t("MARKASUNREAD"),onclick:function(e,args){
toggleAllOff(me.getSelected(),"seen");
}},flag:{text:t("SETMARK"),onclick:function(e,args){
toggleAllOn(me.getSelected(),"flagged");
}},unflag:{text:t("UNSETMARK"),onclick:function(e,args){
toggleAllOff(me.getSelected(),"flagged");
}},"export":{text:t("EXPORT"),onclick:_af4(function(fid,_b0c,_b0d){
DA.waiting.show(DA.locale.GetText.t_("EXPORT_OPERATING_PROMPT"));
_ac3.execute({fid:fid,uid:_b0c.join(","),area:_b0d.join(","),archive:"1",proc:"export"});
})},savetolib:{text:t("SAVETOLIB"),onclick:_af4(function(fid,_b0f,_b10){
DA.waiting.show(DA.locale.GetText.t_("SAVETOLIB_OPERATING_PROMPT"));
_ac8.execute({fid:fid,uid:_b0f.join(","),area:_b10.join(","),archive:"1",proc:"save_to_lib"});
})},movefolder:{text:t("MOVEFOLDER"),onclick:function(e,args){
showMoveFolderDialog(e.clientX,e.clientY);
}},print:{text:t("PRINT"),onclick:function(e,args){
printMail(me.getSelected());
}},filter:{text:t("RUNFILTER"),onclick:_af4(function(fid,_b16,_b17){
DA.waiting.show(DA.locale.GetText.t_("FILTER_OPERATING_PROMPT"));
_ac0.onMessagesFiltering.fire({srcFid:parseInt(fid,10)});
_acd.execute({fid:fid,uid:_b16.join(","),area:_b17.join(","),proc:"submit"});
})},join:{text:t("JOIN"),onclick:_af4(function(fid,_b19,_b1a){
DA.waiting.show(DA.locale.GetText.t_("JOIN_OPERATING_PROMPT"));
_ad2.execute({fid:fid,uid:_b19.join(","),area:_b1a.join(","),proc:"join"});
})},"delete":{text:t("DELETE"),onclick:function(e,args){
me.deleteSelected();
}}}},{onTrigger:function(e){
var row=me._getRowFromEvent(e);
if(!row){
return false;
}
var _b1f=row.__daGridRowMetaData;
if(!_b1f||!_b1f.uid){
return false;
}
if(!me.liveGrid.isSelected(_b1f)){
me.setSelected(row,true,true);
me._lastClickedRowMetaData=_b1f;
me._lastClickedRow4RightButton=row;
}
var _b20=me.getSelected();
if(!_b20||!_b20.count){
return false;
}
var _b21=[];
var _b22=[];
var _b23=checkAll(_b20,_aee);
var _b24=checkAll(_b20,_aed);
if(_b20.count>1){
if(DA.mailer.util.isLocalFolder(_b1f.type)||DA.mailer.util.isBackupFolder(_b1f.type)){
_b22.push("open");
_b22.push("reply");
_b22.push("replyall");
_b22.push("forward");
_b22.push("export");
_b22.push("filter");
_b22.push("join");
_b22.push("print");
_b22.push("savetolib");
if(me.searchMode){
_b21.push("movefolder");
}else{
_b22.push("movefolder");
}
_b21.push("delete");
}else{
_b22.push("open");
_b22.push("reply");
_b22.push("replyall");
_b22.push("forward");
_b22.push("print");
_b22.push("savetolib");
if(me.searchMode){
_b21.push("movefolder");
}else{
_b22.push("movefolder");
}
_b21.push("export");
_b21.push("filter");
_b21.push("delete");
_b21.push("join");
}
}else{
if(DA.mailer.util.isLocalFolder(_b1f.type)||DA.mailer.util.isBackupFolder(_b1f.type)){
_b22.push("reply");
_b22.push("replyall");
_b22.push("forward");
_b22.push("export");
_b22.push("filter");
_b22.push("join");
_b21.push("open");
_b21.push("delete");
_b21.push("print");
if(me.searchMode){
_b21.push("movefolder");
}else{
_b22.push("movefolder");
}
if(DA.vars.config.save_to_lib){
_b21.push("savetolib");
}else{
_b22.push("savetolib");
}
}else{
_b21.push("open");
_b21.push("reply");
_b21.push("replyall");
_b21.push("forward");
_b21.push("export");
if(me.searchMode){
_b21.push("movefolder");
}else{
_b22.push("movefolder");
}
if(me.searchMode){
_b22.push("filter");
}else{
_b21.push("filter");
}
_b22.push("join");
_b21.push("delete");
_b21.push("print");
if(DA.vars.config.save_to_lib){
_b21.push("savetolib");
}else{
_b22.push("savetolib");
}
}
}
if(DA.mailer.util.isLocalFolder(_b1f.type)||DA.mailer.util.isDraft(_b1f.type)||DA.mailer.util.isSent(_b1f.type)||DA.mailer.util.isBackupFolder(_b1f.type)){
_b22.push("markasunread");
_b22.push("markasread");
}else{
if(_b23.all){
_b22.push("markasread");
_b21.push("markasunread");
}else{
if(_b23.none){
_b22.push("markasunread");
_b21.push("markasread");
}else{
_b21.push("markasunread");
_b21.push("markasread");
}
}
}
if(DA.mailer.util.isLocalFolder(_b1f.type)||DA.mailer.util.isBackupFolder(_b1f.type)){
_b22.push("unflag");
_b22.push("flag");
}else{
if(_b24.all){
_b22.push("flag");
_b21.push("unflag");
}else{
if(_b24.none){
_b22.push("unflag");
_b21.push("flag");
}else{
_b21.push("unflag");
_b21.push("flag");
}
}
}
DA.customEvent.fire("mboxGridSetupContextMenuOnTriggerAfter",this,{meta:_b1f,hiddens:_b22,visibles:_b21,selected:_b20});
_b22.each(this.hidden.bind(this));
_b21.each(this.visible.bind(this));
me.liveGrid.scroller.disableMouseScroll();
return true;
},onCancel:function(){
if(me._lastClickedRow4RightButton){
me.setUnSelected(me._lastClickedRow4RightButton);
}
me.liveGrid.scroller.enableMouseScroll();
}});
},_percentify:function(){
var _b25=this.columns.pluck("width");
if(_b25.grep("%").first()){
return;
}
var _b26=DA.util.toPercentages(_b25);
_b26=_b26.map(Math.floor);
this.columns.each(function(col,_b28){
col.width=Math.max(1,_b26[_b28])+"%";
});
},changeFolder:function(id,type){
if(id){
id=parseInt(id,10);
}else{
id=0;
}
var _b2b=id===this.folderId;
this.folderId=id;
this.folderType=type;
this.setFolderMode();
if(!_b2b&&this.liveGrid){
this.liveGrid.removeColumnSort();
}
this._lazyCreate({fid:id,search_field:"",search_word:""},(!_b2b));
if(!_b2b){
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
},onFolderChanged:null,onDoubleClick:null,searchInCurrentFolder:function(_b2c,_b2d){
if(this.searchMode){
return;
}
if(this.folderId){
if(_b2c&&_b2d){
this._lazyCreate({fid:this.folderId,search_field:_b2c,search_word:_b2d});
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
var _b2e=this.liveGrid?this.liveGrid.getUIStateInfo():null;
return _b2e;
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
},loadSearchResults:function(_b2f,fid,srid,type){
this.folderId=fid;
this.folderType=type;
this.setSearchMode();
this._lazyCreate({fid:fid,srid:srid});
this.liveGrid.metaData.setTotalRows(_b2f);
},_lazyCreate:function(args,_b34){
if(!this.liveGrid){
this.initLiveGrid(args,_b34);
}else{
this.isInMutliSelect=false;
this.setAllUnSelected();
this.liveGrid.update(args,_b34);
if(_b34===false){
$("mboxGrid_search_keyword").value="";
}
}
},_generateFakeTable:function(id,_b36,_b37){
var div=document.createElement("div");
div.onselectstart=div.onselect=function(){
return false;
};
div.rows=[];
var _b39;
var _b3a=_b37.map(function(c){
return null;
});
var i=0;
for(i=0;i<_b36;++i){
_b39=document.createElement("div");
_b39.cells=_b3a;
_b39.id="rowdiv"+i;
_b39.className="da_rowdiv";
div.appendChild(_b39);
div.rows[i]=_b39;
}
div.id=id;
return div;
},_generateTableHTML:function(id,_b3e,_b3f){
var sb=[];
var i=0;
sb.push("<table id=\""+id+"\" onselectstart=\"return false;\"><colgroup>");
var tds="";
_b3f.each(function(col){
sb.push("<col width=\""+col.width+"\"/>");
tds+=("<td class='"+col.key+"'>&nbsp;</td>");
});
sb.push("</colgroup>");
sb.push("<tbody>");
for(i=0;i<_b3e;++i){
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
var _b45="mbox_grid_"+(new Date()).getTime();
var _b46=DA.vars.system.max_number_per_page4ajx+1||41;
if(this.isUsingFakeTable){
this.containerElem.appendChild(this._generateFakeTable(_b45,_b46,this.columns));
this._rowLocator=function(div){
return div.parentNode&&div.parentNode.id===_b45;
};
}else{
this.containerElem.innerHTML+=this._generateTableHTML(_b45,_b46,this.columns);
}
this.liveGrid=new DA.widget.VirtualScrollingTable({visibleRows:this.visibleRows,maxVisisbleRows:_b46-1,url:this.url,urlParams:args,resizableColumns:true,onLoading:this.onLoading,onLoadDone:function(){
this._onLoadDone();
this.onLoadDone();
}.bind(this),table:$(_b45),isUsingFakeTable:this.isUsingFakeTable,columns:this.columns,containerElem:this.containerElem});
var me=this;
this.liveGrid.getSelected=function(){
return me.getSelected();
};
this.liveGrid.isIORequired=function(){
return this.folderId>0;
}.bind(this);
var _b49=BrowserDetect.browser==="Explorer"?1:0;
YAHOO.util.Event.on(this.liveGrid.tableId,"mousedown",function(e){
if(e.button!==_b49){
return;
}
this._isBeingDragged=false;
var _b4b=e.shiftKey||e.ctrlKey;
if(_b4b){
if(this.searchMode){
YAHOO.util.Event.stopEvent(e);
}
return;
}
var row=this._getRowFromEvent(e);
var _b4d=row&&this.liveGrid.isSelected(row.__daGridRowMetaData);
if(_b4d){
return;
}
this._handleRowClicked(row,false);
YAHOO.util.Event.stopEvent(e);
},true,this);
YAHOO.util.Event.on(this.liveGrid.tableId,"mouseup",function(e){
if(e.button!==_b49){
return;
}
var _b4f=e.shiftKey||e.ctrlKey;
if(!e.shiftKey){
this._shiftRangeOriginMeta=null;
}
var row=this._getRowFromEvent(e);
var _b51=row?row.__daGridRowMetaData:null;
var _b52=row&&this.liveGrid.isSelected(_b51);
if(!_b4f&&!_b52){
return;
}
if(!_b4f&&_b52&&!this._isBeingDragged){
this.isInMutliSelect=false;
this._handleRowClicked(row);
return;
}
if(e.shiftKey){
this.setRangeEnd(_b51);
}
if(e.ctrlKey){
this.isInMutliSelect=true;
if(_b52){
if(this._checkShiftRanges(_b51)){
this._deflateRanges();
}
this.setUnSelected(row);
}else{
this.setSelected(row,false);
}
}
this._lastClickedRowMetaData=_b51;
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
var _b59=this._lastClickedRowMetaData,_b5a=this._getViewPortRange(),_b5b=_b59.sno,_b5c=_b5a.start+1,_b5d=_b5a.end+1,_b5e=_b5d-_b5c-1,_b5f=_b5b+n,row,only=true;
this.containerElem.focus();
if(_b5f<_b5c+1){
this.liveGrid.scroller.moveScroll(_b5f-1-1);
}
if(_b5f>_b5d-1){
this.liveGrid.scroller.moveScroll(_b5f-1-_b5e+1);
}
var _b62=function(){
var _b63=this._findPositionInBuffer(_b59)+n;
var _b64=this.liveGrid.buffer.rows[_b63];
return _b64?this.findRowByMMData(_b64.meta):null;
}.bind(this);
row=_b62();
if(row){
this.setSelected(row,only,false,true);
this._lastClickedRowMetaData=row.__daGridRowMetaData;
}else{
this._scheduleJobOnLoadDone(function(){
var row=_b62();
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
var _b68=[];
this._checkShiftRanges=function(_b69,_b6a){
_b6a=_b6a||_b68;
var i,_b6c=_b6a.length,sr;
var sno=parseInt(_b69.sno,10);
for(i=0;i<_b6c;++i){
sr=_b6a[i];
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
lg.isSelected=function(_b72){
if(!_b72){
return false;
}
_b72=_b72.meta||_b72;
if(hash[_b72.fid+"_"+_b72.uid]){
return true;
}
if(_b68.length<1){
return false;
}
return me._checkShiftRanges(_b72);
};
this.getSelected=function(){
var h=$H(hash);
var _b74=h.values();
var _b75=_b74.first();
var _b76=me._getIdentity();
var _b77=_b68.inject(_b74.length,rowsInRange);
if(_b77===0){
return {count:0,single:null,singles:[],identity:_b76,ranges:[]};
}
_b75=_b74.first()||_b68.first().start;
if(_b77===1){
return {count:1,single:_b75,singles:[_b75],fid:_b75.fid,srid:_b75.srid,identity:_b76,ranges:[]};
}
return {count:_b77,singles:_b74,ranges:_b68,fid:_b75.fid,srid:_b75.srid,identity:_b76};
};
this.onSelectionChanged=new YAHOO.util.CustomEvent("onSelectionChanged");
function fireAsync(_b78,key){
setTimeout(function(){
me.onSelectionChanged.fire(me.getSelected(),_b78,key);
},40);
}
var _b7a=function(_b7b){
var _b7c=_b7b.__daGridRowMetaData||_b7b;
var key=_b7c.fid+"_"+_b7c.uid;
hash[key]=_b7c;
};
var _b7e=function(_b7f){
var _b80=_b7f.__daGridRowMetaData||_b7f;
var key=_b80.fid+"_"+_b80.uid;
delete hash[key];
};
this.setSelected=function(rows,only,_b84,key){
if(only&&only===true){
hash={};
_b68.clear();
YAHOO.util.Dom.removeClass(lg.table.rows,"da_gridSelectedRow");
}
YAHOO.util.Dom.addClass(rows,"da_gridSelectedRow");
(rows.length?rows:[rows]).each(_b7a);
fireAsync(_b84,key);
};
this.setUnSelected=function(rows){
YAHOO.util.Dom.removeClass(rows,"da_gridSelectedRow");
(rows.length?rows:[rows]).each(_b7e);
fireAsync();
};
this.setAllUnSelected=function(){
YAHOO.util.Dom.removeClass(lg.table.rows,"da_gridSelectedRow");
hash={};
_b68.clear();
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
var _b88=me._shiftRangeOriginMeta;
if(!_b88){
return;
}
hash={};
var sno=parseInt(meta.sno,10);
_b68.clear();
me.isInMutliSelect=false;
_b88.sno=parseInt(_b88.sno,10);
meta.sno=parseInt(meta.sno,10);
var _b8a=_b88.sno<meta.sno?_b88:meta;
var end=_b88.sno>meta.sno?_b88:meta;
_b68.push({start:_b8a,end:end});
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
function addToSingles(_b8f,nEnd,_b91){
var _b92=_b91.first().sno;
var iEnd=nEnd-_b92;
var _b94;
for(var i=(_b8f-_b92);i<=iEnd;++i){
_b94=_b91[i];
if(_b94){
_b7a(_b94);
}
}
}
function mkRangeNode(nSno,_b97){
var _b98=parseInt(_b97.first().sno,10);
var _b99=_b97[nSno-_b98];
if(!_b99){
return undefined;
}
return copyRangeNode(_b99);
}
function clipRange(_b9a,_b9b,_b9c,nEnd){
var _b9e=[];
var _b9f=Math.max(0,_b9c-_b9a);
var _ba0=Math.max(0,_b9b-nEnd);
if(_b9f===0&&_ba0===0){
}else{
if(_b9f){
_b9e.push([_b9a,_b9c]);
}
if(_ba0){
_b9e.push([nEnd,_b9b]);
}
}
return _b9e;
}
this._deflateRanges=function(){
if(_b68.length<1){
return;
}
var rows=me.liveGrid.buffer.rows.pluck("meta");
if(rows.length<1){
return;
}
var _ba2=rows.first().sno;
var bEnd=rows.last().sno;
_ba2=parseInt(_ba2,10);
bEnd=parseInt(bEnd,10);
var _ba4=[];
_b68.each(function(sr){
var _ba6=sr.start.sno;
var rEnd=sr.end.sno;
_ba6=parseInt(_ba6,10);
rEnd=parseInt(rEnd,10);
if(rEnd<=_ba2||_ba6>=bEnd){
_ba4.push(sr);
return;
}
var _ba8=Math.max(_ba6,_ba2);
var end=Math.min(rEnd,bEnd);
addToSingles(_ba8,end,rows);
var _baa=clipRange(_ba6,rEnd,_ba8,end);
_baa.each(function(_bab){
var _bac=mkRangeNode(_bab[0],rows)||sr.start;
var _bad=mkRangeNode(_bab[1],rows)||sr.end;
_ba4.push({start:_bac,end:_bad});
_b7e(_bac);
_b7e(_bad);
});
});
_b68.clear();
var tmp;
while((tmp=_ba4.pop())){
_b68.push(tmp);
}
_b68.reverse();
};
},_shiftRangeOriginMeta:null,setSelected:Prototype.emptyFunction,setUnSelected:Prototype.emptyFunction,_getRowFromEvent:function(e){
var _bb0=YAHOO.util.Event.getTarget(e);
return DA.dom.findParent(_bb0,this._rowLocator,5);
},_rowLocator:"TR",_handleRowClicked:function(row,_bb2){
if(!row){
return;
}
var _bb3=row.__daGridRowMetaData;
if(!_bb3){
return;
}
if(!_bb3.fid||!_bb3.uid){
return;
}
this._lastClickedRowMetaData=_bb3;
this.setSelected(row,true);
var _bb4=this.onDoubleClick;
if(_bb2){
setTimeout(function(){
_bb4.fire(_bb3);
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
},findRowByMMData:function(_bb9){
if(!_bb9){
return;
}
var lg=this.liveGrid;
var rows=lg.isUsingFakeTable?lg.table.childNodes:lg.table.rows;
var _bbc=Math.min(rows.length,lg.viewPort.visibleRows,lg.metaData.totalRows);
var _bbd;
var row;
for(var i=0;i<_bbc;++i){
row=rows[i];
_bbd=row.__daGridRowMetaData;
if(_bbd&&DA.util.cmpNumber(_bbd.fid,_bb9.fid)&&DA.util.cmpNumber(_bbd.uid,_bb9.uid)){
return row;
}
}
},_findPositionInBuffer:function(_bc0){
var i=0,rows=this.liveGrid.buffer.rows,len=rows.length,cmp=DA.util.cmpNumber;
for(;i<len;++i){
if(cmp(rows[i].meta.fid,_bc0.fid)&&cmp(rows[i].meta.uid,_bc0.uid)){
return i;
}
}
},_getViewPortRange:function(){
return this.liveGrid.viewPort.getRange();
},setRowAppearance:function(_bc5,_bc6,tr){
if(!_bc5){
return;
}
if(_bc6&&_bc6.each){
if(!_bc5.className||_bc5.className===""){
_bc5.className=this._utils.mkCSSClassNameForRow(_bc5);
}
_bc6.each(function(prop){
var c=prop.charAt(0);
if(prop==="forwarded"){
c="w";
}
var re=new RegExp("\\b"+c+"[0-9]\\b");
_bc5.className=_bc5.className.replace(re,c+_bc5[prop]);
});
}
tr=tr?tr:this.findRowByMMData(_bc5);
if(!tr){
return;
}
var _bcb=this.liveGrid.isSelected(_bc5);
tr.className=(this.isUsingFakeTable?"da_rowdiv ":"")+_bc5.className+(_bcb?" da_gridSelectedRow":"");
},deleteSelected:function(){
var _bcc=this.getSelected();
var _bcd=(DA.mailer.util.isTrash(this.folderType)||DA.vars.config["delete"]===1||(_bcc.count===1&&DA.mailer.util.isTrash(_bcc.single.type)))?DA.locale.GetText.t_("MESSAGE_DELETECOMPLETE_CONFIRM"):DA.locale.GetText.t_("MESSAGE_DELETE_CONFIRM");
if(DA.util.confirm(_bcd)){
this.moveSelected({trash:true});
}
},moveSelected:function(_bce){
var _bcf=this.getSelected();
DA.mailer.Events.onMessageMoveRequest.fire({messages:_bcf,target:_bce});
setTimeout(function(){
this.isInMutliSelect=false;
this.setAllUnSelected();
}.bind(this),500);
},_adjustBufferStartPos:function(_bd0,_bd1){
if(!_bd0){
return false;
}
var lg=_bd1||this.liveGrid;
var _bd3=lg.buffer.startPos;
var _bd4=this._countAffectedRows(_bd0,0,lg.buffer.startPos);
var _bd5=_bd3-_bd4;
if(_bd5===_bd3){
return false;
}
lg.buffer.startPos=_bd5;
return true;
},_repairBufferSeqNums:function(_bd6){
var lg=_bd6||this.liveGrid;
var rows=lg.buffer.rows;
var _bd9=rows.length;
var _bda=lg.buffer.startPos+1;
var i;
for(i=0;i<_bd9;++i){
rows[i].meta.sno=_bda+i;
}
},_adjustViewPortStartPos:function(_bdc,_bdd){
if(!_bdc){
return false;
}
var lg=_bdd||this.liveGrid;
var _bdf=lg.viewPort.lastRowPos;
var _be0;
var _be1=lg.table.firstChild;
if(_be1&&_be1.__daGridRowMetaData){
_be0=parseInt(_be1.__daGridRowMetaData.sno,10);
}
if(_be0!==(_bdf+1)){
_be0=_bdf+1;
}
var _be2=this._countAffectedRows(_bdc,0,_bdf);
var _be3=_bdf-_be2;
if(_be3<0){
lg.viewPort.lastRowPos=0;
}else{
lg.viewPort.lastRowPos=_be3;
}
var _be4=lg.metaData.getTotalRows();
var _be5=lg.metaData.getPageSize();
var _be6=_be4-_be3;
if(_be4>=_be5){
if(_be6<_be5){
lg.viewPort.lastRowPos=(_be4-_be5)-1;
}
}else{
lg.viewPort.lastRowPos=0;
}
return lg.viewPort.lastRowPos!==_bdf;
},_countAffectedRows:function(_be7,_be8,_be9){
if(!_be7||!_be9){
return 0;
}
var _bea=(_be7.singles&&_be7.singles.length)?_be7.singles:_be7.single?[_be7.single]:[];
var _beb=(_be7.ranges&&_be7.ranges.length)?_be7.ranges:[];
var _bec=_bea.inject(0,function(nA,oS){
var sno=parseInt(oS.sno,10);
return nA+((sno>=_be8&&sno<=_be9)?1:0);
});
_bec=_beb.inject(_bec,function(nA,oR){
var from=Math.max(oR.start.sno,_be8);
var to=Math.min(oR.end.sno,_be9);
return nA+Math.max(0,(to-from+1));
});
if(_bec<0){
return 0;
}else{
return _bec;
}
},_messageMoverJobs:null,_updateExceptionFilter:function(){
var _bf4=this._messageMoverJobs.values();
if(_bf4.length<1){
delete this.liveGrid.jsonIO.defaultParams.except;
}
var _bf5=_bf4.pluck("singles").inject([],this._utils.listConcat);
var _bf6=_bf4.pluck("ranges").inject([],this._utils.listConcat);
this.liveGrid.jsonIO.defaultParams.except=_bf5.map(this._utils.asFidColonUid).concat(_bf6.map(this._utils.asFidColonUidRange)).join(",");
}};
if("undefined"===typeof DA.mailer.dd){
DA.mailer.dd={};
}
DA.mailer.dd.MboxMail=function(id){
this.init(id,"da_folderTree",this.config);
this.initFrame();
};
YAHOO.extend(DA.mailer.dd.MboxMail,YAHOO.util.DDProxy,{_targetId2fid:DA.mailer.FolderTreeController.prototype._targetId2fid,_fid2divId:DA.mailer.FolderTreeController.prototype._fid2divId,clickValidator:function(e){
if(DA.mailer.util.getOperationFlag()!==""&&DA.mailer.util.getOperationFlag().indexOf(OrgMailer.vars.org_mail_gid.toString())<0){
return false;
}
var _bf9=this.mboxGrid.getSelected();
if(e.ctrlKey&&(!_bf9||_bf9.count===0)){
return false;
}
var node=YAHOO.util.Event.getTarget(e);
var _bfb;
var _bfc;
if(!node){
return false;
}
if(node.id){
_bfb=node;
}else{
_bfb=node.parentNode;
}
if(_bfb.id.match(/^rowdiv\d+$/)){
_bfc=_bfb.children||_bfb.childNodes||[];
if(_bfc.length===0){
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
var _c0d;
if(obj.view){
_c0d=obj.view.messages;
this.metaData.setTotalRows(_c0d?_c0d:0);
}
if(DA.util.isEmpty(obj.srid)){
DA.mailer.Events.onMboxGridLoadRows.fire({fid:obj.fid,count:_c0d?_c0d:0,response:obj});
}
return obj.mail_list||[];
};
if(!DA||!DA.mailer||!DA.mailer.widget||!DA.util||!DA.locale){
throw "ERROR: missing DA.js or mailer.js or message.js";
}
if(!YAHOO||!YAHOO.util){
throw "ERROR: missing yahoo.js";
}
DA.mailer.widget.AddressAutoComplete=function(_c0e,_c0f,_c10,_c11){
var _c12;
if(!_c0e||!_c0f||!_c10){
_c12="Invalid/Missing args";
throw _c12;
}
if(_c11 instanceof DA.ug.InformationListController){
this.listController=_c11;
this._selectItem=this._listController_selectItem;
}
this._initDataSource(_c10);
DA.mailer.widget.AddressAutoComplete.superclass.constructor.call(this,_c0e,_c0f,this.dataSource);
this.useIFrame=true;
};
YAHOO.extend(DA.mailer.widget.AddressAutoComplete,YAHOO.widget.AutoComplete,{listController:null,delimChar:[","],_hitFields:["email","name","alpha","kana","keitai_mail","pmail1","pmail2"],formatResult:function(_c13,_c14){
var _c15=_c13[0];
var _c16=_c13[1];
if(!_c16){
return "";
}
var _c17=["<div>","<img src='",_c16.icon,"'/>"];
var j=_c17.length;
var _c19=_c14.length;
var _c1a=this._hitFields;
var _c1b={};
var _c1c=_c1a.length;
var reg=new RegExp(["^(",DA.util.encode(_c14).replace(/(?:\s|　)/,"(?:\\s|\u3000)"),")"].join(""));
var i,val,_c20,_c21;
for(i=0;i<_c1c;++i){
_c21=_c1a[i];
val=_c16[_c21];
if(!val||!val.indexOf){
continue;
}
if(_c16[_c21+"_hit"]===1){
_c1b[_c21]=DA.util.encode(val).replace(reg,"<span style='font-weight:bold'>$1</span>");
}else{
_c1b[_c21]=DA.util.encode(val);
}
}
_c17[j++]="&nbsp;";
_c17[j++]=_c1b.name;
_c17[j++]="&nbsp;";
if(!DA.util.isEmpty(_c1b.email)||!DA.util.isEmpty(_c1b.keitai_mail)||!DA.util.isEmpty(_c1b.pmail1)||!DA.util.isEmpty(_c1b.pmail2)){
_c17[j++]="&lt;";
if(!DA.util.isEmpty(_c1b.email)){
_c17[j++]=_c1b.email;
}else{
if(!DA.util.isEmpty(_c1b.keitai_mail)){
_c17[j++]=_c1b.keitai_mail;
}else{
if(!DA.util.isEmpty(_c1b.pmail1)){
_c17[j++]=_c1b.pmail1;
}else{
if(!DA.util.isEmpty(_c1b.pmail2)){
_c17[j++]=_c1b.pemail2;
}
}
}
}
_c17[j++]="&gt;";
_c17[j++]="&nbsp;";
}
if(!DA.util.isEmpty(_c16.gname)){
_c17[j++]="(";
_c17[j++]=_c16.gname;
_c17[j++]=")";
}
_c17[j++]="</div>";
return (_c17.join(""));
},dataSource:null,_initDataSource:function(_c22){
this.dataSource=Object.extend(new YAHOO.widget.DS_XHR(DA.vars.cgiRdir+"/ajx_ma_addr_search.cgi",["user_list","email"]),{doQuery:function(_c23,_c24,_c25){
var _c26,sUri;
var _c28,_c29;
var _c2a,_c2b,_c2c;
if(DA.util.lock("incSearch")){
_c26=(this.responseType===YAHOO.widget.DS_XHR.TYPE_XML);
sUri=this.scriptURI+"?"+this.scriptQueryParam+"="+_c24;
if(this.scriptQueryAppend.length>0){
sUri+="&"+this.scriptQueryAppend;
}
sUri=DA.util.setUrl(sUri);
_c28=null;
_c29=this;
_c2a=function(_c2d){
if(!_c29._oConn||(_c2d.tId!==_c29._oConn.tId)){
_c29.dataErrorEvent.fire(_c29,_c25,_c24,YAHOO.widget.DataSource.ERROR_DATANULL);
DA.util.unlock("incSearch");
return;
}
if(!_c26){
_c2d=_c2d.responseText;
}else{
_c2d=_c2d.responseXML;
}
if(_c2d===null){
_c29.dataErrorEvent.fire(_c29,_c25,_c24,YAHOO.widget.DataSource.ERROR_DATANULL);
DA.util.unlock("incSearch");
return;
}
var _c2e=_c29.parseResponse(_c24,_c2d,_c25);
var _c2f={};
_c2f.query=decodeURIComponent(_c24);
_c2f.results=_c2e;
if(_c2e===null){
_c29.dataErrorEvent.fire(_c29,_c25,_c24,YAHOO.widget.DataSource.ERROR_DATAPARSE);
_c2e=[];
}else{
_c29.getResultsEvent.fire(_c29,_c25,_c24,_c2e);
_c29._addCacheElem(_c2f);
}
_c23(_c24,_c2e,_c25);
DA.util.unlock("incSearch");
};
_c2b=function(_c30){
_c29.dataErrorEvent.fire(_c29,_c25,_c24,YAHOO.widget.DS_XHR.ERROR_DATAXHR);
DA.util.unlock("incSearch");
return;
};
_c2c={success:_c2a,failure:_c2b};
if(!isNaN(this.connTimeout)&&this.connTimeout>0){
_c2c.timeout=this.connTimeout;
}
if(this._oConn){
this.connMgr.abort(this._oConn);
}
_c29._oConn=this.connMgr.asyncRequest("GET",sUri,_c2c,null);
}
}});
this.dataSource.scriptQueryAppend="field="+_c22;
this.dataSource.scriptQueryParam="keyword";
},_isIgnoreKey:function(_c31){
if((_c31===9)||(_c31===16)||(_c31===17)||(_c31>=18&&_c31<=20)||(_c31===27)||(_c31>=33&&_c31<=35)||(_c31>=36&&_c31<=38)||(_c31===40)||(_c31>=44&&_c31<=45)){
return true;
}
return false;
},_onTextboxKeyUp:function(v,_c33){
_c33._initProps();
var _c34=v.keyCode;
_c33._nKeyCode=_c34;
var _c35=this.value;
if(_c33._isIgnoreKey(_c34)||(_c35.toLowerCase()===_c33._sCurQuery)){
return;
}else{
if(_c35.length>100){
return;
}else{
_c33.textboxKeyEvent.fire(_c33,_c34);
}
}
var _c36;
if(_c34===Event.KEY_RETURN){
if(_c33._nDelayID!==-1){
clearTimeout(_c33._nDelayID);
}
_c33._sendQuery(_c35);
}else{
if(_c33.queryDelay>0){
_c33._toggleContainer(false);
_c36=setTimeout(function(){
_c33._sendQuery(_c35);
},(_c33.queryDelay*1000));
if(_c33._nDelayID!==-1){
clearTimeout(_c33._nDelayID);
}
_c33._nDelayID=_c36;
}else{
_c33._sendQuery(_c35);
}
}
},_onTextboxKeyPress:function(v,_c38){
var _c39=v.keyCode;
_c38._cancelIntervalDetection(_c38);
var _c3a=(navigator.userAgent.toLowerCase().indexOf("mac")!==-1);
if(_c3a){
switch(_c39){
case 9:
if(_c38.delimChar&&(_c38._nKeyCode!==_c39)){
if(_c38._bContainerOpen){
YAHOO.util.Event.stopEvent(v);
}
}
break;
case 13:
if(_c38._nKeyCode!==_c39){
if(_c38._bContainerOpen){
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
if(_c39===229){
if(_c38.queryDelay>0){
_c38._onIMEDetected(_c38);
_c38._queryInterval=setInterval(function(){
_c38._onIMEDetected(_c38);
},(_c38.queryDelay*1000));
}else{
_c38._onIMEDetected(_c38);
_c38._queryInterval=setInterval(function(){
_c38._onIMEDetected(_c38);
},(500));
}
}
}
},_listController_selectItem:function(_c3b){
this._bItemSelected=true;
var _c3c=_c3b._oResultData;
if(_c3c&&_c3c[1]){
if(DA.vars.ugType.bulk===_c3c[1].type){
this._openBulk(_c3c[1]);
}else{
this.listController.addList([_c3c[1]]);
}
}
this._oTextbox.value=this._sSavedQuery?this._sSavedQuery:"";
this._cancelIntervalDetection(this);
this.itemSelectEvent.fire(this,_c3b,_c3c);
this._toggleContainer(false);
var _c3d=YAHOO.util.Dom.get("da_messageEditorItemGroupNameOuter");
if(this.listController.groupExists()){
this._showGroupName(_c3d);
}else{
this._hideGroupName(_c3d);
}
},_showGroupName:function(_c3e){
if(_c3e&&_c3e.style.display==="none"){
_c3e.style.display="";
}
},_hideGroupName:function(_c3f){
if(_c3f&&_c3f.style.display===""){
_c3f.style.display="none";
}
},doBeforeExpandContainer:function(_c40,_c41,_c42,_c43){
var _c44=_c43?_c43.length:0;
_c41._oContent.style.height=(Math.min(_c44,this.maxResultsBeforeScroll)*this.resultRowHeight)+4+"px";
if(BrowserDetect.browser==="Explorer"){
_c41._oContent.style.width="100%";
}else{
_c41._oContent.style.width="80%";
}
return _c44>0;
},maxResultsBeforeScroll:20,maxResultsDisplayed:DA.vars.system.max_incsearch_hits?parseInt(DA.vars.system.max_incsearch_hits,10):100,resultRowHeight:18,queryDelay:DA.vars.system.inc_search_interval?parseFloat(DA.vars.system.inc_search_interval,10):0.25,minQueryLength:DA.vars.system.inc_search_min_chars?parseInt(DA.vars.system.inc_search_min_chars,10):1,_openBulk:function(_c45){
var me=this;
var io=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_addr.cgi");
io.callback=function(o){
if(DA.mailer.util.checkResult(o)){
me.listController.addList(o.user_list);
}
};
io.errorHandler=function(e){
DA.util.warn(DA.locale.GetText.t_("BULKINFO_ERROR"));
};
io.execute({proc:"extract",aid:_c45.id,lang:_c45.lang});
}});

                                                                                                                                                                                                                                                                                                                         