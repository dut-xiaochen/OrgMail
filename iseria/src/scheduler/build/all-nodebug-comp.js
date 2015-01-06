Ext.ux.AccountSelector=Ext.extend(Ext.form.ComboBox,{minChars:1,shadow:"drop",displayField:"name",typeAhead:false,loadingText:"Searching...",pageSize:0,hideTrigger:true,itemSelector:"div.search-item",seletorName:"",userType:1,requestURL:"",tpl:new Ext.XTemplate("<tpl for=\".\">","<div class=\"search-item\" style=\"padding:3px;\">","<tpl if=\"type === 1\">","<h3><img src=\"images/ico_fc_user.gif\" title=\"\u4e00\u822c\u30e6\u30fc\u30b6\" class=\"ImgIcoUser\" align=\"absmiddle\"/>","<span>{name}</span> \uff08{primaryGroup}\uff09</h3>","</tpl>","<tpl if=\"type === 2\">","<h3><img src=\"images/ico_fc_organization.gif\" title=\"\u7d44\u7e54\" class=\"ImgIcoOrganization\" align=\"absmiddle\"!/>","<span>{name}</span></h3>","</tpl>","<tpl if=\"type === 3\">","<h3><img src=\"images/ico_fc_project.gif\" title=\"\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\" class=\"ImgIcoUser\" align=\"absmiddle\"/ >","<span>{name}</span> </h3>","</tpl>","<tpl if=\"type === 4\">","<h3><img src=\"images/ico_fc_executive.gif\" title=\"\u5f79\u8077\u30b0\u30eb\u30fc\u30d7\"\u3000class=\"ImgIcoExecutive\" align=\"absmiddle\"/>\"","<span>{name}</span></h3>","</tpl>","</div>","</tpl>"),afterSelectFuc:function(_1,_2){
return false;
},initComponent:function(){
Ext.ux.AccountSelector.superclass.initComponent.call(this);
var _3=Ext.data.Record.create([{name:"name",mapping:"name"},{name:"email",mapping:"email"},{name:"primaryGroup",mapping:"primaryGroup"},{name:"type",mapping:"type"},{name:"tel3",mapping:"tel3"},{name:"login",mapping:"login"},{name:"logout",mapping:"logout"},{name:"sum",mapping:"sum"}]);
var _4=null;
_4=new Ext.data.HttpProxy({url:this.requestURL});
var _5=new Ext.data.Store({proxy:_4,reader:new Ext.data.JsonReader({totalProperty:"results",root:"rows",id:"id"},_3)});
this.store=_5;
this.applyTo=this.seletorName;
this.onSelect=this.afterSelectFuc;
}});
Ext.DAGrid=Ext.extend(Ext.Component,{gridName:"",gridTitle:"",requestUrl:"",params:"",width:0,height:0,pageSize:20,columnModel:null,initComponent:function(){
Ext.DAGrid.superclass.initComponent.call(this);
this.create();
},create:function(){
var _6=[this.columnModel.getColumnCount()];
for(var i=0;i<this.columnModel.getColumnCount();i++){
_6[i]=this.columnModel.getDataIndex(i);
}
var _8=null;
if(this.requestUrl.indexOf("http")===0){
_8=new Ext.data.ScriptTagProxy({url:this.requestUrl});
}else{
_8=new Ext.data.HttpProxy({url:this.requestUrl});
}
var _9=new Ext.data.Store({proxy:_8,reader:new Ext.data.JsonReader({root:"rowData",totalProperty:"totalCount",id:"dataId",fields:_6}),remoteSort:true,baseParams:this.params});
_9.setDefaultSort("lastUpdateDate","desc");
var _a=true;
if(this.height>0){
_a=false;
}
var _b=new Ext.grid.GridPanel({el:this.gridName,width:this.width,autoHeight:_a,height:this.height,title:this.gridTitle,store:_9,stripeRows:true,cm:this.columnModel,loadMask:true,viewConfig:{forceFit:true,enableRowBody:true,showPreview:true,sortAscText:"\u6607\u9806",sortDescText:"\u964d\u9806",columnsText:"\u30b3\u30e9\u30e0"},bbar:new Ext.PagingToolbar({pageSize:this.pageSize,store:_9,displayInfo:true,displayMsg:"{2}\u4ef6\u4e2d {0} - {1}\u4ef6\u3092\u8868\u793a\u3057\u3066\u3044\u307e\u3059\u3002",emptyMsg:"\u8868\u793a\u53ef\u80fd\u306a\u30c7\u30fc\u30bf\u304c\u3042\u308a\u307e\u305b\u3093\u3002"})});
_b.render();
_9.load({params:{start:0,limit:this.pageSize}});
}});
Ext.ux.NumberPulldown=Ext.extend(Ext.form.ComboBox,{typeAhead:true,triggerAction:"all",forceSelection:true,validationEvent:true,width:50,initComponent:function(){
Ext.ux.NumberPulldown.superclass.initComponent.call(this);
},onFocus:function(){
Ext.form.TriggerField.superclass.onFocus.call(this);
if(!this.mimicing){
this.wrap.addClass("x-trigger-wrap-focus");
this.mimicing=true;
Ext.get(Ext.isIE?document.body:document).on("mousedown",this.mimicBlur,this,{delay:10});
if(this.monitorTab){
this.el.on("keydown",this.checkTab,this);
}
this.onTriggerClick();
}
},validator:function(A){
var F=this.valueField;
var X;
var _f;
var _10=Number.MAX_VALUE;
var _11=A;
if(this.store.snapshot){
this.store.data=this.store.snapshot;
this.view.store=this.store;
this.view.refresh();
}
this.store.each(function(D){
_f=Math.abs(D.data[F]-A);
if(_f<=_10){
_10=_f;
_11=D;
}
if(D.data[F]===A){
X=D;
return false;
}
});
var M;
if(X){
M=X.data[this.displayField];
}else{
if(_11.data){
M=_11.data[this.displayField];
}
}
this.lastSelectionText=M;
if(this.hiddenField){
this.hiddenField.value=A;
}
this.value=M;
return true;
},setValue:function(A){
this.collapse();
return this.constructor.superclass.setValue.call(this,A);
},getText:function(A){
return this.getRawValue(A);
},setText:function(A){
return this.setRawValue(A);
},getPulldownN:function(N){
return this.store.data.items[N].data.value;
},getPulldownLength:function(){
return this.store.data.length;
},getPulldownList:function(){
var arr=[],_19=this.getPulldownLength();
for(var i=0;i<_19;++i){
arr[i]=this.getPulldownN(i);
}
return arr;
},addItem:function(_1b){
this.store.data.add(_1b);
if(this.view){
this.view.refresh();
}
},removeItem:function(_1c,_1d){
for(var i=_1d;i>=_1c;i--){
this.store.data.remove(this.store.data.items[i]);
}
if(this.view){
this.view.refresh();
}
},getItem:function(_1f){
return this.store.data.items[_1f];
},setDisable:function(_20){
this.disabled=_20;
},isDisable:function(){
return this.disabled;
}});
var DA={widget:{},log:function(_21,_22,_23){
}};
DA.vars=window.userConfig;
(function(){
var _24;
if(location.href.match(/^(https\:\/\/[^\/]+)/)){
_24=RegExp.$1;
if(DA.vars.imgRdir.match(/^\//)){
DA.vars.imgRdir=DA.vars.imgRdir.replace(/\//,_24+"/");
}
}
})();
var BrowserDetect={init:function(){
this.browser=this.searchString(this.dataBrowser)||"An unknown browser";
this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";
this.OS=this.searchString(this.dataOS)||"an unknown OS";
},searchString:function(_25){
var _26;
var _27;
for(var i=0;i<_25.length;i++){
_26=_25[i].string;
_27=_25[i].prop;
this.versionSearchString=_25[i].versionSearch||_25[i].identity;
if(_26){
if(_26.indexOf(_25[i].subString)!==-1){
return _25[i].identity;
}
}else{
if(_27){
return _25[i].identity;
}
}
}
},searchVersion:function(_29){
var _2a=_29.indexOf(this.versionSearchString);
if(_2a===-1){
return;
}
return parseFloat(_29.substring(_2a+this.versionSearchString.length+1));
},dataBrowser:[{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari"},{prop:window.opera,identity:"Opera"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};
BrowserDetect.init();
DA.util={isNull:function(obj){
if(obj===null){
return true;
}else{
return false;
}
},isUndefined:function(obj){
if(obj===undefined||(typeof (obj)==="string"&&obj==="")){
return true;
}else{
return false;
}
},isEmpty:function(obj){
if(DA.util.isNull(obj)||DA.util.isUndefined(obj)){
return true;
}else{
return false;
}
},isNumber:function(obj){
if(typeof (obj)==="number"&&isFinite(obj)){
return true;
}else{
return false;
}
},isString:function(obj){
return typeof (obj)==="string";
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
},cmp:function(_33,_34){
var s1=(DA.util.isNumber(_33))?_33.toString():_33;
var s2=(DA.util.isNumber(_34))?_34.toString():_34;
return s1===s2;
},cmpNumber:function(_37,_38){
return parseInt(_37,10)===parseInt(_38,10);
},match:function(str,_3a){
var reg=new RegExp(_3a);
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
buf=buf.replace(/([^\r\n]+)(\r\n|$)/g,"<p>$1</p>$2");
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
},lockData:{},lock:function(_4d){
if(this.existsLock(_4d)){
return false;
}else{
this.lockData[_4d]=true;
return true;
}
},unlock:function(_4e){
delete this.lockData[_4e];
return true;
},existsLock:function(_4f){
if(this.lockData[_4f]){
return true;
}else{
return false;
}
},pack:function(_50){
var i,p="",s="";
for(i=0;i<_50.length;i++){
p+=_50.charAt(i);
if(p.length===2){
s+=String.fromCharCode(parseInt(p,16));
p="";
}
}
return s;
},unpack:function(_54){
var i,s="";
for(i=0;i<_54.length;i++){
s+=parseInt(_54.charCodeAt(i),10).toString(16);
}
return s;
},setUrl:function(url){
var _58=DA.vars.check_key_url;
if(DA.util.isEmpty(_58)){
return url;
}else{
if(url.match(/\?/)){
return url+_58;
}else{
return url+_58.replace(/^&/,"?");
}
}
},parseJson:function(_59){
try{
return eval("("+_59+")");
}
catch(e){
return undefined;
}
},parseQuery:function(qs){
var url=(DA.util.isEmpty(qs))?location.href:qs;
var tmp=url.split("?");
var _5d=(tmp.length>1)?tmp[1].split("&"):[];
var _5e=[];
var _5f={};
for(var i=0;i<_5d.length;i++){
_5e=_5d[i].split("=");
_5f[_5e[0]]=_5e[1];
}
return _5f;
},makeXml:function(_61,_62){
var k;
var xml="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"+((DA.util.isEmpty(_62))?"":"<"+_62+">\n");
for(k in _61){
xml+=DA.util._object2xml(_61[k],k);
}
xml+=((DA.util.isEmpty(_62))?"":"</"+_62+">\n")+"</xml>\n";
return xml;
},_object2xml:function(_65,key){
var k,xml="";
if(DA.util.isFunction(_65)){
xml="";
}else{
if(DA.util.isString(_65)){
xml="<"+key+">"+((DA.util.isEmpty(_65))?"":DA.util.encode(_65))+"</"+key+">\n";
}else{
if(DA.util.isNumber(_65)){
xml="<"+key+">"+((DA.util.isEmpty(_65.toString()))?"":_65.toString())+"</"+key+">\n";
}else{
if(DA.util.isArray(_65)){
_65.map(function(o){
xml+=DA.util._object2xml(o,key);
});
}else{
xml="<"+key+">";
for(k in _65){
xml+=DA.util._object2xml(_65[k],k);
}
xml+="</"+key+">\n";
}
}
}
}
return xml;
},getTime:function(){
var _6a=new Date();
return _6a.getTime();
},time_diff:function(_6b,end){
return (end?end.getTime():new Date().getTime())-_6b.getTime();
},slowdown:function(f,_6e){
_6e=_6e?_6e:1000;
var _6f=new Date().getTime();
var _70=[];
var _71;
function dolater(){
f.call(_70);
}
return function(){
var now=new Date().getTime();
if((now-_6f)>_6e){
_6f=now;
f.call(arguments);
}else{
clearTimeout(_71);
_70=arguments;
_71=setTimeout(dolater,_6e);
}
};
},onlyonce:function(_73,f,_75){
var _76=[];
var _77=function(){
f.apply(_73,_76);
};
var to;
return function(){
clearTimeout(to);
_76=arguments;
to=setTimeout(_77,_75);
};
},areEquivObjs:function(o1,o2){
if(!(DA.util.isObject(o1)&&DA.util.isObject(o2))){
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
},toPercentages:function(_7d){
if(!_7d){
return [];
}
var _7e=_7d.inject(0,DA.util._add);
return _7d.map(function(n){
return (n/_7e)*100;
});
},_add:function(a,b){
return a+b;
}};
DA.customEvent={set:function(_82,_83){
if(_83){
this.events[_82]=_83;
}
},fire:function(_84,me,_86){
if(this.events[_84]){
this.events[_84](me,_86);
}
},events:{}};
DA.str={uc:function(s){
s=this.toString(s);
return (s.toUpperCase());
},lc:function(s){
s=this.toString(s);
return (s.toLowerCase());
},ucFirst:function(s){
s=this.toString(s);
return (s.substring(0,1).toUpperCase()+s.substring(1));
},lcFirst:function(s){
s=this.toString(s);
return (s.substring(0,1).toLowerCase()+s.substring(1));
},toString:function(s){
return (s+"");
}};
DA.time={GetTime:function(){
var _8c=new Date();
var _8d=_8c.getTime();
delete _8c;
return _8d;
},DiffTime:function(t1,t2){
var _90=t2-t1;
return _90;
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
},_name:function(_92){
if(DA.util.isEmpty(_92)){
return "";
}else{
return DA.vars.mid+"_"+_92;
}
},_width:function(_93){
if(DA.util.isEmpty(_93)){
return 800;
}else{
return _93;
}
},_height:function(_94){
if(DA.util.isEmpty(_94)){
return 600;
}else{
return _94;
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
},winOpen:function(url,_9c,_9d,_9e){
var _9f="width="+this._width(_9d)+",height="+this._height(_9e)+",resizable=yes,scrollbars=yes,location=yes"+",menubar=yes,toolbar=yes,statusbar=yes";
var win=window.open(this._url(url),this._name(_9c),_9f);
win.moveTo(this.getX(win.opener)+10,this.getY(win.opener)+10);
this.data[this.data.length]=win;
return win;
},winOpenNoBar:function(url,_a2,_a3,_a4){
var _a5="width="+this._width(_a3)+",height="+this._height(_a4)+",resizable=yes,scrollbars=no,location=no"+",menubar=no,toolbar=no,statusbar=no";
var win=window.open(this._url(url),this._name(_a2),_a5);
win.moveTo(this.getX(win.opener)+10,this.getY(win.opener)+10);
this.data[this.data.length]=win;
return win;
},winOpenCustom:function(url,_a8,_a9){
var win=window.open(this._url(url),this._name(_a8),_a9);
win.moveTo(this.getX(win.opener)+10,this.getY(win.opener)+10);
this.data[this.data.length]=win;
return win;
},isePopup:function(_ab,_ac,_ad,_ae,no,_b0,_b1,_b2){
var _b3="width="+_ad+",height="+_ae+",resizable=yes";
var Url=DA.vars.cgiRdir+"/pop_up.cgi?proc="+_ab+"&title="+_ac;
var _b5,_b6,_b7,_b8;
if(!_b0){
_b6=_ac.indexOf(".gif");
_b7=_ac.substring(0,_b6);
_b8=_b7+no;
_b5=this.winOpenCustom(Url,_b8,_b3);
}else{
_b5=this.winOpenCustom(Url,"",_b3);
}
if(!DA.util.isEmpty(_b1)&&!DA.util.isEmpty(_b2)){
_b5.moveTo(_b1,_b2);
}
_b5.focus();
},allClose:function(){
for(var i=0;i<this.data.length;i++){
if(this.data[i]){
try{
this.data[i].windowController.allClose();
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
}};
DA.imageLoader={tag:function(_ba,_bb,obj){
var _bd=new Image();
_bd.src=_ba;
var src=(DA.util.isEmpty(_ba))?"":" src=\""+DA.util.escape(_ba)+"\"";
var alt=(DA.util.isEmpty(_bb))?"":" alt=\""+DA.util.escape(_bb)+"\"";
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
delete _bd;
return tag;
},nullTag:function(x,y){
return this.tag(DA.vars.imgRdir+"/null.gif","",{width:(DA.util.isEmpty(x))?1:y,height:(DA.util.isEmpty(x))?1:y});
}};
DA.waiting={init:function(){
var _c5=new Element("div",{align:"center",className:"FreezePaneOff"});
var _c6=new Element("div",{className:"InnerFreezePane"});
var img=new Element("img",{src:DA.vars.imgRdir+"/search.gif",width:133,height:88});
var msg=new Element("div",{});
_c6.insert(img);
_c6.insert(msg);
_c5.insert(_c6);
$(document.body).insert(_c5);
this.outerEl=_c5;
this.msgEl=msg;
},open:function(msg,_ca){
if(this.outerEl){
this.msgEl.innerHTML="<br>"+msg;
this.outerEl.removeClassName("FreezePaneOff");
this.outerEl.addClassName("FreezePaneOn");
this.syncSize(_ca);
DA.shim.open(this.outerEl);
}
},close:function(){
if(this.outerEl){
this.outerEl.removeClassName("FreezePaneOn");
this.outerEl.addClassName("FreezePaneOff");
DA.shim.close(this.outerEl);
}
},syncSize:function(o){
if(o){
if(o.x){
this.outerEl.style.width=$(o.x).getWidth();
}
if(o.y){
this.outerEl.style.height=$(o.y).getHeight();
}
}
}};
DA.shim={open:function(_cc){
if(BrowserDetect.browser!=="Explorer"){
return;
}
if(_cc===null){
return;
}
var _cd=this._getShim(_cc);
if(_cd===null){
_cd=this._createMenuShim(_cc);
}
_cc.style.zIndex=100;
var _ce=_cc.offsetWidth;
var _cf=_cc.offsetHeight;
_cd.style.width=_ce;
_cd.style.height=_cf;
_cd.style.top=_cc.style.top;
_cd.style.left=_cc.style.left;
_cd.style.zIndex=_cc.style.zIndex-1;
_cd.style.position="absolute";
_cd.style.display="block";
var _d0;
if(_cd.style.top===""||_cd.style.left===""){
_d0=this._cumulativeOffset(_cc);
_cd.style.top=_d0[1];
_cd.style.left=_d0[0];
}
},close:function(_d1){
if(document.all===null){
return;
}
if(_d1===null){
return;
}
var _d2=this._getShim(_d1);
if(_d2!==null){
_d2.style.display="none";
}
},_createMenuShim:function(_d3){
if(_d3===null){
return null;
}
var _d4=document.createElement("iframe");
_d4.scrolling="no";
_d4.frameborder="0";
_d4.style.position="absolute";
_d4.style.top="0px";
_d4.style.left="0px";
_d4.style.display="none";
_d4.name=this._getShimId(_d3);
_d4.id=this._getShimId(_d3);
_d4.src="javascript:false;";
_d4.style.filter="progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
if(_d3.offsetParent===null||_d3.offsetParent.id===""){
window.document.body.appendChild(_d4);
}else{
_d3.offsetParent.appendChild(_d4);
}
return _d4;
},_getShimId:function(_d5){
if(_d5.id===null){
return "__shim";
}else{
return "__shim"+_d5.id;
}
},_getShim:function(_d6){
return document.getElementById(this._getShimId(_d6));
},_cumulativeOffset:function(_d7){
var _d8=0,_d9=0;
do{
_d8+=_d7.offsetTop||0;
_d9+=_d7.offsetLeft||0;
_d7=_d7.offsetParent;
}while(_d7);
return [_d9,_d8];
}};
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
var key,_df=false;
for(key in this.data){
if(!DA.util.isFunction(this.data[key])){
_df=true;
break;
}
}
return _df;
}};
if(!DA||!DA.io){
alert("ERROR: missing DA.js or io.js");
}
DA.io.JsonIO=function(url,_e1){
this.defaultParams=_e1;
this.url=DA.util.setUrl(url);
};
(function(){
var _e2,_e3;
try{
_e2=YAHOO.lang.isObject;
_e3=YAHOO.lang.isFunction;
}
catch(e){
_e2=function(obj){
return DA.util.isObject(obj)||DA.util.isFunction(obj);
};
_e3=DA.util.isFunction;
}
DA.io.JsonIO.prototype={defaultParams:undefined,callback:function(obj,_e6){
},errorHandler:function(e,_e8){
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
},method:"post",execute:function(_ee,_ef){
var _f0=undefined;
var _f1=this.callback;
var _f2=this.errorHandler;
var _f3=this.htmlHandler;
if(_ef){
if(_e3(_ef)){
_f1=_ef;
}else{
if(_e2(_ef)){
if(_e3(_ef.callback)){
_f1=_ef.callback;
}
if(_e3(_ef.errorHandler)){
_f2=_ef.errorHandler;
}
}
}
}
if(this.defaultParams){
_f0={};
Object.extend(_f0,this.defaultParams);
}
if(_ee){
_f0=_f0?_f0:{};
Object.extend(_f0,_ee);
}
var _f4=this.url;
var _f5=DA.io.Manager.loading(_f4);
var _f6=encodeURIComponent(_f5);
var req=new Ajax.Request(_f4.match(/\?/)?_f4+"&serial="+_f6:_f4+"?serial="+_f6,{method:this.method,parameters:$H(_f0).toQueryString(),onSuccess:function(_f8){
var _f9=_f8.getResponseHeader("Content-Type");
if(!_f9||!_f9.match(/(js|json|javascript)/i)){
DA.io.Manager.done(_f5);
_f3({type:"INVALID_CONTENTTYPE",contentType:_f9,body:_f8.responseText});
return;
}
var _fa=_f8.responseText;
var obj;
try{
obj=eval("("+_fa+")");
if("object"===typeof obj){
DA.io.Manager.done(_f5);
_f1(obj,_f0);
}else{
DA.io.Manager.done(_f5);
_f2({type:"NOT_AN_OBJECT",contentType:_f9,body:_f8.responseText},_f0);
}
}
catch(e){
DA.io.Manager.done(_f5);
_f2(e,_f0);
}
},onFailure:function(err){
DA.io.Manager.done(_f5);
_f2(err,_f0);
},onException:function(e){
}});
}};
})();
DA.widget.SimpleViewPort=Ext.extend(Ext.Container,{orientation:"horizontal",initComponent:function(){
this.constructor.superclass.initComponent.call(this);
this._setupEventPlumbing();
},_setupEventPlumbing:function(){
this.on("add",this.onAdd,this);
},onAdd:function(){
this.syncSize();
},scrollRepeatInterval:300,btnWidth:16,disabledBtnCls:"btn-disabled",scrollDistance:100,onRender:function(ct,pos){
if(!ct){
throw "No container! Please specify one using renderTo.";
}
var _100=this.btnWidth+"px";
if(this.orientation==="horizontal"){
this.el=ct.createChild({id:this.id,tag:"div",cls:"simple-viewport",style:{position:"relative",width:"100%",overflow:"hidden"}});
this.leftBtn=this.el.insertFirst({cls:"scroll-btn scroll-left-btn",style:{position:"absolute",width:_100,height:"100%",left:"0px",top:"0px"}});
this.rightBtn=this.el.insertFirst({cls:"scroll-btn scroll-right-btn",style:{position:"absolute",width:_100,height:"100%",right:"0px",top:"0px"}});
this.body=this.el.insertFirst({cls:"content",style:{position:"relative",overflow:"hidden","margin-left":_100,"margin-right":_100}});
this.rightRepeater=new Ext.util.ClickRepeater(this.rightBtn,{interval:this.scrollRepeatInterval,handler:this.doScrollLeft,scope:this});
this.leftRepeater=new Ext.util.ClickRepeater(this.leftBtn,{interval:this.scrollRepeatInterval,handler:this.doScrollRight,scope:this});
}else{
throw "Vertical Orientation is not yet implemented.";
}
this.syncSize.defer(10,this);
this._fixScrollPosition.defer(100,this);
this.updateScrollButtons.defer(600,this);
},fitToParentWidth:function(){
var _101=this.el.parent().getWidth(true);
this.setWidth(_101);
},setWidth:function(w){
var _103=this.maxWidth?Math.min(this.maxWidth+(this.btnWidth*2)-1,w):w;
this.constructor.superclass.setWidth.call(this,_103);
this._fixScrollPosition();
this.updateScrollButtons();
},_fixScrollPosition:function(){
if(!Ext.isIE){
this.body.scroll("l",1,false);
this.body.scroll("r",1,false);
}
},doScrollLeft:function(e,el,num,_107){
this._doScroll(e,el,num,"l",_107);
},doScrollRight:function(e,el,num,_10b){
this._doScroll(e,el,num,"r",_10b);
},_doScroll:function(e,el,num,_10f,_110){
if(!num){
num=1;
}
if(this.disabled){
return;
}
this.body.scroll(_10f,num*this.getScrollDistance(),!_110);
this.updateScrollButtons.defer(600,this);
},getLayoutTarget:function(){
return this.body;
},updateScrollButtons:function(){
var _111=this.body.getScroll();
var box=this.body.getBox();
if(this.orientation==="horizontal"){
if(_111.left<=1){
this.leftBtn.addClass(this.disabledBtnCls);
}else{
this.leftBtn.removeClass(this.disabledBtnCls);
}
if((_111.left+box.width+1)>=this.body.dom.scrollWidth){
this.rightBtn.addClass(this.disabledBtnCls);
}else{
this.rightBtn.removeClass(this.disabledBtnCls);
}
}else{
}
},onResize:function(boxW,boxH,rawW,rawH){
var w=(rawW?rawW:this.el.getComputedWidth()),h=(rawH?rawH:this.el.getComputedHeight());
w=this.orientation==="vertical"?w:w-(this.btnWidth*2);
h=this.orientation==="vertical"?h-(this.btnWidth*2):h;
this.body.setSize(w,h);
this.updateScrollButtons();
},getScrollDistance:function(){
return this.scrollDistance;
},onEnable:function(){
this.constructor.superclass.onEnable.call(this);
},onDisable:function(){
this.constructor.superclass.onDisable.call(this);
}});
if(!DA){
throw "ERROR: missing DA.js or DA-min.js";
}
if(!DA.cal){
DA.cal={};
}
DA.cal.Calendar=function(_119,_11a,_11b,cbh){
if(_11b.yearList){
this.yearList=[];
Object.extend(this.yearList,_11b.yearList);
}
if(_11b.holidayList){
this.holidayList={};
Object.extend(this.holidayList,_11b.holidayList);
}
if(_11b.customDayColorList){
this.customDayColorList={};
Object.extend(this.customDayColorList,_11b.customDayColorList);
}
if(_11b.minYear){
this.minYear=_11b.minYear;
}
if(_11b.maxYear){
this.maxYear=_11b.maxYear;
}
if(_11b.imgRdir){
this.imgRdir=_11b.imgRdir;
}
if(_11b.firstDay){
this.firstDay=_11b.firstDay;
}
if(_11b.lang){
this.lang=_11b.lang;
}
if(this.lang!=="ja"){
this.lang="en";
}
var i,j;
this.weekBGImgs=[];
this.messageResources={en:{PrevMonth:"Prev",NextMonth:"Next"},ja:{PrevMonth:"\u5148\u6708",NextMonth:"\u7fcc\u6708"}};
for(i=0;i<7;i++){
j=this.getDayNumber(i);
switch(i){
case 0:
this.weekBGImgs[j]="cal_day_sun_bg.gif";
this.messageResources.en["week"+j]="Su";
this.messageResources.ja["week"+j]="\u65e5";
break;
case 1:
this.weekBGImgs[j]="";
this.messageResources.en["week"+j]="Mo";
this.messageResources.ja["week"+j]="\u6708";
break;
case 2:
this.weekBGImgs[j]="";
this.messageResources.en["week"+j]="Tu";
this.messageResources.ja["week"+j]="\u706b";
break;
case 3:
this.weekBGImgs[j]="";
this.messageResources.en["week"+j]="We";
this.messageResources.ja["week"+j]="\u6c34";
break;
case 4:
this.weekBGImgs[j]="";
this.messageResources.en["week"+j]="Th";
this.messageResources.ja["week"+j]="\u6728";
break;
case 5:
this.weekBGImgs[j]="";
this.messageResources.en["week"+j]="Fr";
this.messageResources.ja["week"+j]="\u91d1";
break;
case 6:
this.weekBGImgs[j]="cal_day_sat_bg.gif";
this.messageResources.en["week"+j]="Sa";
this.messageResources.ja["week"+j]="\u571f";
break;
default:
this.weekBGImgs[j]="";
this.messageResources.en["week"+j]="";
this.messageResources.ja["week"+j]="";
}
}
this.calLocalResource=this.messageResources[this.lang];
this.calid=_119;
this.name=_11a;
this.prefix=_11b.prefix;
this.colorHeader="LIGHTBLUE";
this.colorBackground="ALICEBLUE";
this.colorSunday="LIGHTSTEELBLUE";
this.colorSaturday="PINK";
this.colorToday="GOLD";
this.monthOfDays=0;
this.viewYear=0;
this.viewMonth=0;
this.startDay=0;
this.initCal(DA.cal.Calendar.thisYear,DA.cal.Calendar.thisMonth+1,DA.cal.Calendar.thisDay);
this.nowYear=DA.cal.Calendar.thisYear;
this.nowMonth=DA.cal.Calendar.thisMonth+1;
this.nowDay=DA.cal.Calendar.thisDay;
this.viewYear1=0;
this.viewYear2=0;
this.viewMonth1=0;
this.viewMonth2=0;
this.startDay1=0;
this.startDay2=0;
this.monthOfDays1=0;
this.monthOfDays2=0;
this.initCal2(DA.cal.Calendar.thisYear,DA.cal.Calendar.thisMonth+1,DA.cal.Calendar.thisDay);
if(typeof (_11b.linkFunc)==="undefined"){
this.linkFunc="DA.cal.Calendar.fncSet("+this.name+",'"+this.calid+"', '"+this.prefix.year+"',  '"+this.prefix.month+"', '"+this.prefix.day+"')";
}else{
this.linkFunc=_11b.linkFunc;
}
if(cbh){
if(cbh.onSet){
this.onSet=cbh.onSet;
}
if(cbh.onEnable){
this.onEnable=cbh.onEnable;
}
if(cbh.onDisable){
this.onDisable=cbh.onDisable;
}
}
return this;
};
DA.cal.Calendar.prototype={fontfacename:"Arial",yearList:null,holidayList:null,customDayColorList:null,imgRdir:DA.vars.imgRdir,firstDay:0,lang:"ja",monthDay:[31,28,31,30,31,30,31,31,30,31,30,31],monthImgs:["cal_mt_1.gif","cal_mt_2.gif","cal_mt_3.gif","cal_mt_4.gif","cal_mt_5.gif","cal_mt_6.gif","cal_mt_7.gif","cal_mt_8.gif","cal_mt_9.gif","cal_mt_10.gif","cal_mt_11.gif","cal_mt_12.gif"],monthTexts:["January","February","March","April","May","June","July","August","September","October","November","December"],messageResources:null,weekBGImgs:null,calLocalResource:null,disabled:false,onSet:Prototype.emptyFunction,onEnable:Prototype.emptyFunction,onDisable:Prototype.emptyFunction,isToday:function(yyyy,mm,dd){
return (DA.cal.Calendar.thisYear===yyyy&&DA.cal.Calendar.thisMonth===mm&&DA.cal.Calendar.thisDay===dd)?true:false;
},getDayColor:function(_122){
var _123="color=\"#000000\"";
if((_122%7)===this.getDayNumber(0)){
_123="color=\"#993300\"";
}else{
if((_122%7)===this.getDayNumber(6)){
_123="color=\"#665599\"";
}
}
return _123;
},getDayBackGround:function(yyyy,mm,dd,_127){
if(this.isToday(yyyy,mm,dd)===true){
return "background=\""+this.imgRdir+"/cal_mark_today_bg.gif\" bgcolor=\"#FFFFFF\"";
}
return "bgcolor=\"#FFFFFF\"";
},getWeekFontStyle:function(){
var _128="color=\"#FFFFFF\"";
if(this.lang==="ja"){
_128+=" class=\"normal\"";
}else{
_128+=" class=\"tiny\" face=\""+this.fontfacename+"\"";
}
return _128;
},getDayNumber:function(day){
if(day-this.firstDay<0){
day=day+(7-this.firstDay);
}else{
day=day-this.firstDay;
}
return day;
},getSelectableYearMin:function(){
var _12a=$(this.prefix.year);
var _12b,i,y;
if(this.minYear){
return this.minYear;
}else{
if(_12a===null||typeof (_12a)==="undefined"){
return 0;
}else{
_12b=9999;
if(this.yearList===null){
for(i=0;i<_12a.length;i++){
y=parseInt(_12a.options[i].value,10);
if(y>0&&_12b>y){
_12b=y;
}
}
}else{
for(i=0;i<this.yearList.length;i++){
y=parseInt(this.yearList[i],10);
if(y>0&&_12b>y){
_12b=y;
}
}
}
return _12b;
}
}
},getSelectableYearMax:function(){
var _12e=$(this.prefix.year);
var _12f,i,y;
if(this.maxYear){
return this.maxYear;
}else{
if(_12e===null||typeof (_12e)==="undefined"){
return 0;
}else{
_12f=0;
if(this.yearList===null){
for(i=0;i<_12e.length;i++){
y=parseInt(_12e.options[i].value,10);
if(y>0&&_12f<y){
_12f=y;
}
}
}else{
for(i=0;i<this.yearList.length;i++){
y=parseInt(this.yearList[i],10);
if(y>0&&_12f<y){
_12f=y;
}
}
}
return _12f;
}
}
},prevCal:function(){
this.setPrevCal();
this.writeCal();
},prevCal2:function(){
this.setPrevCal2();
this.writeCal2();
},nextCal:function(){
this.setNextCal();
this.writeCal();
},nextCal2:function(){
this.setNextCal2();
this.writeCal2();
},getYear:function(_132){
var num;
if((typeof (_132)==="undefined")||(_132<1901)||(_132>2099)){
return DA.cal.Calendar.thisYear;
}else{
if(isNaN(_132)){
return DA.cal.Calendar.thisYear;
}
return _132;
}
},getMonth:function(_134){
var num;
if((typeof (_134)==="undefined")||(_134<1)||(_134>12)){
return DA.cal.Calendar.thisMonth;
}else{
if(isNaN(_134)){
return DA.cal.Calendar.thisMonth;
}
return _134-1;
}
},getMonthOfDays:function(yyyy,mm){
if((mm===1)&&(yyyy%4===0)){
return 29;
}else{
return this.monthDay[mm];
}
},getNextMonthYear:function(yyyy,mm){
var _13a=yyyy;
if(mm>=11){
_13a++;
}
return _13a;
},getNextMonth:function(mm){
var mm2=mm+1;
if(mm2>11){
mm2=0;
}
return mm2;
},setPrevCal:function(){
var yyyy=this.viewYear;
var mm=this.viewMonth;
if(mm<1){
yyyy--;
mm=11;
}
this.initCal(yyyy,mm);
},setPrevCal2:function(){
var yyyy=this.viewYear1;
var mm=this.viewMonth1;
if(mm<1){
yyyy--;
mm=11;
}
this.initCal2(yyyy,mm);
},setNextCal:function(){
var yyyy=this.viewYear;
var mm=this.viewMonth+2;
if(mm>12){
yyyy++;
mm=1;
}
this.initCal(yyyy,mm);
},setNextCal2:function(){
var yyyy=this.viewYear1;
var mm=this.viewMonth1+2;
if(mm>12){
yyyy++;
mm=1;
}
this.initCal2(yyyy,mm);
},choiceCal:function(yy,mm,dd){
this.nowYear=yy;
this.nowMonth=mm;
this.nowDay=dd;
},initCal:function(_148,_149){
this.viewYear=this.getYear(_148);
var _14a=this.getSelectableYearMin();
if(_14a>0){
if(this.viewYear<_14a){
this.viewYear=_14a;
}
}
var _14b=this.getSelectableYearMax();
if(_14b>0){
if(this.viewYear>_14b){
this.viewYear=_14b;
}
}
this.viewMonth=this.getMonth(_149);
this.monthOfDays=this.getMonthOfDays(this.viewYear,this.viewMonth);
var d1=new Date(this.viewYear+"/"+(this.viewMonth+1)+"/01");
this.startDay=this.getDayNumber(d1.getDay());
},initCal2:function(yyyy,mm){
this.viewYear1=this.getYear(yyyy);
this.viewMonth1=this.getMonth(mm);
this.monthOfDays1=this.getMonthOfDays(this.viewYear1,this.viewMonth1);
var d1=new Date(this.viewYear1+"/"+(this.viewMonth1+1)+"/01");
this.startDay1=this.getDayNumber(d1.getDay());
var _150=this.getSelectableYearMin();
if(_150>0){
if(this.viewYear1<_150){
this.viewYear1=_150;
}
}
var _151=this.getSelectableYearMax();
if(_151>0){
if(this.viewYear1>_151){
this.viewYear1=_151;
}
}
this.viewYear2=this.getNextMonthYear(this.viewYear1,this.viewMonth1);
this.viewMonth2=this.getNextMonth(this.viewMonth1);
this.monthOfDays2=this.getMonthOfDays(this.viewYear2,this.viewMonth2);
var d2=new Date(this.viewYear2+"/"+(this.viewMonth2+1)+"/01");
this.startDay2=this.getDayNumber(d2.getDay());
},writeCal:function(stl,spn,spi){
var i,j;
var sb=[];
sb=["<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" background=\"",this.imgRdir,"/null.gif\" bgcolor=\"#FFFFFF\">","<tr class=\"Calendar\">","<td><img src=\"",this.imgRdir,"/null.gif\" width=\"3\" height=\"1\"></td>"];
for(i=0;i<7;i++){
sb.push("<td><img src=\"",this.imgRdir,"/null.gif\" width=\"15\" height=\"1\"></td>");
}
sb.push("<td><img src=\"",this.imgRdir,"/null.gif\" width=\"3\" height=\"1\"></td>");
sb.push("</tr>");
var _159="";
var yyyy=this.viewYear;
if(this.viewMonth<1){
yyyy--;
}
if(yyyy>=this.getSelectableYearMin()){
_159=this.name+".prevCal()";
}
var _15b="";
yyyy=this.viewYear;
if(this.viewMonth>=11){
yyyy++;
}
if(yyyy<=this.getSelectableYearMax()){
_15b=this.name+".nextCal()";
}
sb.push("<tr class=\"Calendar\"><td><img src=\"",this.imgRdir,"/cal_waku_tl.gif\" width=\"3\" height=\"25\"></td>");
sb.push("<td background=\"",this.imgRdir,"/cal_waku_t_bg.gif\" valign=\"bottom\">");
if(_159!==""){
sb.push("<a href=\"#\" onClick=\"",_159,"\">");
sb.push("<img src=\"",this.imgRdir,"/cal_back.gif\" width=\"15\" height=\"12\" border=\"0\" alt=\"",this.calLocalResource.PrevMonth,"\" title=\"",this.calLocalResource.PrevMonth,"\">");
sb.push("</a>");
}
sb.push("<br><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"4\"></td>");
sb.push("<td colspan=\"5\" align=\"center\" valign=\"bottom\" background=\"",this.imgRdir,"/cal_waku_t_bg.gif\"><img src=\"",this.imgRdir,"/");
sb.push(this.monthImgs[this.viewMonth]);
sb.push("\" width=\"20\" height=\"20\"></td>");
sb.push("<td background=\"",this.imgRdir,"/cal_waku_t_bg.gif\" valign=\"bottom\">");
if(_15b!==""){
sb.push("<a href=\"#\" onClick=\"",_15b,"\">");
sb.push("<img src=\"",this.imgRdir,"/cal_next.gif\" width=\"15\" height=\"12\" border=\"0\" alt=\"",this.calLocalResource.NextMonth,"\" title=\"",this.calLocalResource.NextMonth,"\">");
sb.push("</a>");
}
sb.push("<br><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"4\"></td>");
sb.push("<td><img src=\"",this.imgRdir,"/cal_waku_tr.gif\" width=\"3\" height=\"25\"></td>");
sb.push("</tr>");
sb.push("<tr class=\"Calendar\"><td background=\"",this.imgRdir,"/cal_waku_l_bg.gif\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("<td colspan=\"7\" align=\"center\"><font color=\"#000000\" face=\"",this.fontfacename,"\" class=\"small\">");
sb.push(this.viewYear," ",this.monthTexts[this.viewMonth]);
sb.push("</font></td>");
sb.push("<td rowspan=\"10\" valign=\"bottom\" background=\"",this.imgRdir,"/cal_waku_r_bg.gif\"><img src=\"",this.imgRdir,"/cal_pagecarl_r.gif\" width=\"3\" height=\"10\"></td>");
sb.push("</tr>");
sb.push("<tr class=\"Calendar\"> ");
sb.push("<td colspan=\"8\" bgcolor=\"#666666\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("</tr>");
sb.push("<tr class=\"Calendar\">");
sb.push("<td><img src=\"",this.imgRdir,"/cal_waku_obi_l.gif\" width=\"3\" height=\"19\"></td>");
for(j=0;j<7;j++){
if(this.weekBGImgs[j]!==""){
sb.push("<td align=\"center\" background=\"",this.imgRdir,"/");
sb.push(this.weekBGImgs[j]);
sb.push("\">");
}else{
sb.push("<td align=\"center\" bgcolor=\"#999999\">");
}
sb.push("<font ",this.getWeekFontStyle(),">",this.calLocalResource["week"+j],"</font></td>");
}
sb.push("</tr>");
sb.push("<tr class=\"Calendar\"><td colspan=\"8\" bgcolor=\"#666666\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("</tr>");
var day=1;
var _15d;
for(i=0;i<6;i++){
if(i===0){
sb.push("<tr class=\"Calendar\"><td rowspan=\"6\" background=\"",this.imgRdir,"/cal_waku_l_bg.gif\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
}else{
sb.push("<tr class=\"Calendar\">");
}
for(j=0;j<7;j++){
if(i===5&&j===6){
sb.push("<td align=\"right\" valign=\"bottom\"><img src=\"",this.imgRdir,"/cal_pagecarl.gif\" width=\"12\" height=\"10\"></td>");
}else{
if((i===0&&j<this.startDay)||day>this.monthOfDays){
sb.push("<td align=\"center\"  bgcolor=\"#FFFFFF\">&nbsp;</td>");
}else{
if(this.holidayList&&this.holidayList[this.viewYear]&&this.holidayList[this.viewYear][this.viewMonth+1]&&this.holidayList[this.viewYear][this.viewMonth+1][day]===1){
_15d=["<a href=\"#\" onClick=\"",this.name,".choiceCal(",this.viewYear,",",this.viewMonth,",",day,");",this.linkFunc,"\">","<font ",this.getDayColor(0)," face=\"",this.fontfacename,"\" class=\"small\">",day,"</font></a>"].join("");
}else{
if(this.customDayColorList&&this.customDayColorList[this.viewYear]&&this.customDayColorList[this.viewYear][this.viewMonth+1]&&this.customDayColorList[this.viewYear][this.viewMonth+1][day]){
_15d=["<a href=\"#\" onClick=\"",this.name,".choiceCal(",this.viewYear,",",this.viewMonth,",",day,");",this.linkFunc,"\">","<font color=\"",this.customDayColorList[this.viewYear][this.viewMonth+1][day],"\" face=\"",this.fontfacename,"\" class=\"small\">",day,"</font></a>"].join("");
}else{
_15d=["<a href=\"#\" onClick=\"",this.name,".choiceCal(",this.viewYear,",",this.viewMonth,",",day,");",this.linkFunc,"\">","<font ",this.getDayColor(j)," face=\"",this.fontfacename,"\" class=\"small\">",day,"</font></a>"].join("");
}
}
sb.push("<td align=\"center\" ",this.getDayBackGround(this.viewYear,this.viewMonth,day,j),">",_15d,"</td>");
day++;
}
}
}
sb.push("</tr>");
}
sb.push("<tr class=\"Calendar\"><td><img src=\"",this.imgRdir,"/cal_waku_bl.gif\" width=\"3\" height=\"6\"></td>");
sb.push("    <td colspan=\"7\" align=\"right\" background=\"",this.imgRdir,"/cal_waku_b_bg.gif\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"><img src=\"",this.imgRdir,"/cal_pagecarl_b.gif\" width=\"12\" height=\"6\"></td>");
sb.push("    <td><img src=\"",this.imgRdir,"/cal_waku_br.gif\" width=\"3\" height=\"6\"></td>");
sb.push("</tr>");
sb.push("</table>");
var cal=document.getElementById(this.calid);
var str=sb.join("");
if(cal){
cal.innerHTML=str;
}
return str;
},writeCal2:function(stl,spn,spi){
var i,j;
var sb=[];
sb=["<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" background=\"",this.imgRdir,"/null.gif\" bgcolor=\"#FFFFFF\">","<tr class=\"Calendar\">","<td><img src=\"",this.imgRdir,"/null.gif\" width=\"3\" height=\"1\"></td>"];
for(i=0;i<7;i++){
sb.push("<td><img src=\"",this.imgRdir,"/null.gif\" width=\"15\" height=\"1\"></td>");
}
sb.push("<td><img src=\"",this.imgRdir,"/null.gif\" width=\"3\" height=\"1\"></td>");
for(i=0;i<7;i++){
sb.push("<td><img src=\"",this.imgRdir,"/null.gif\" width=\"15\" height=\"1\"></td>");
}
sb.push("<td><img src=\"",this.imgRdir,"/null.gif\" width=\"3\" height=\"1\"></td>");
sb.push("</tr>");
var _166="";
var yyyy=this.viewYear1;
if(this.viewMonth1<1){
yyyy--;
}
if(yyyy>=this.getSelectableYearMin()){
_166=this.name+".prevCal2()";
}
var _168="";
yyyy=this.viewYear2;
if(this.viewMonth2>=11){
yyyy++;
}
if(yyyy<=this.getSelectableYearMax()){
_168=this.name+".nextCal2()";
}
sb.push("<tr class=\"Calendar\"><td><img src=\"",this.imgRdir,"/cal_waku_tl.gif\" width=\"3\" height=\"25\"></td>");
sb.push("<td background=\"",this.imgRdir,"/cal_waku_t_bg.gif\" valign=\"bottom\">");
if(_166!==""){
sb.push("<a href=\"#\" onClick=\"",_166,"\">");
sb.push("<img src=\"",this.imgRdir,"/cal_back.gif\" width=\"15\" height=\"12\" border=\"0\" alt=\"",this.calLocalResource.PrevMonth,"\" title=\"",this.calLocalResource.PrevMonth,"\">");
sb.push("</a>");
}
sb.push("<br><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"4\"></td>");
sb.push("<td colspan=\"5\" align=\"center\" valign=\"bottom\" background=\"",this.imgRdir,"/cal_waku_t_bg.gif\"><img src=\"",this.imgRdir,"/");
sb.push(this.monthImgs[this.viewMonth1]);
sb.push("\" width=\"20\" height=\"20\"></td>");
sb.push("<td background=\"",this.imgRdir,"/cal_waku_t_bg.gif\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("<td><img src=\"",this.imgRdir,"/cal_waku_tl.gif\" width=\"3\" height=\"25\"></td>");
sb.push("<td background=\"",this.imgRdir,"/cal_waku_t_bg.gif\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("<td colspan=\"5\" align=\"center\" valign=\"bottom\" background=\"",this.imgRdir,"/cal_waku_t_bg.gif\"><img src=\"",this.imgRdir,"/");
sb.push(this.monthImgs[this.viewMonth2]);
sb.push("\" width=\"20\" height=\"20\"></td>");
sb.push("<td background=\"",this.imgRdir,"/cal_waku_t_bg.gif\" valign=\"bottom\">");
if(_168!==""){
sb.push("<a href=\"#\" onClick=\"",_168,"\">");
sb.push("<img src=\"",this.imgRdir,"/cal_next.gif\" width=\"15\" height=\"12\" border=\"0\" alt=\"",this.calLocalResource.NextMonth,"\" title=\"",this.calLocalResource.NextMonth,"\">");
sb.push("</a>");
}
sb.push("<br><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"4\"></td>");
sb.push("<td><img src=\"",this.imgRdir,"/cal_waku_tr.gif\" width=\"3\" height=\"25\"></td>");
sb.push("</tr>");
sb.push("<tr class=\"Calendar\"><td background=\"",this.imgRdir,"/cal_waku_l_bg.gif\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("<td colspan=\"7\" align=\"center\"><font color=\"#000000\" face=\"",this.fontfacename,"\" class=\"small\">");
sb.push(this.viewYear1," ",this.monthTexts[this.viewMonth1]);
sb.push("</font></td>");
sb.push("<td background=\"",this.imgRdir,"/cal_waku_l_bg.gif\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("<td colspan=\"7\" align=\"center\"><font color=\"#000000\" face=\"",this.fontfacename,"\" class=\"small\">");
sb.push(this.viewYear2," ",this.monthTexts[this.viewMonth2]);
sb.push("</font></td>");
sb.push("<td rowspan=\"10\" valign=\"bottom\" background=\"",this.imgRdir,"/cal_waku_r_bg.gif\"><img src=\"",this.imgRdir,"/cal_pagecarl_r.gif\" width=\"3\" height=\"10\"></td>");
sb.push("</tr>");
sb.push("<tr class=\"Calendar\"> ");
sb.push("<td colspan=\"8\" bgcolor=\"#666666\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("<td colspan=\"8\" bgcolor=\"#666666\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("</tr>");
sb.push("<tr class=\"Calendar\">");
for(i=0;i<2;i++){
sb.push("    <td><img src=\"",this.imgRdir,"/cal_waku_obi_l.gif\" width=\"3\" height=\"19\"></td>");
for(j=0;j<7;j++){
if(this.weekBGImgs[j]!==""){
sb.push("<td align=\"center\" background=\"",this.imgRdir,"/");
sb.push(this.weekBGImgs[j]);
sb.push("\">");
}else{
sb.push("<td align=\"center\" bgcolor=\"#999999\">");
}
sb.push("<font ",this.getWeekFontStyle(),">",this.calLocalResource["week"+j],"</font></td>");
}
}
sb.push("</tr>");
sb.push("<tr class=\"Calendar\"><td colspan=\"8\" bgcolor=\"#666666\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("    <td colspan=\"8\" bgcolor=\"#666666\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("</tr>");
var day1=1;
var day2=1;
var _16b;
for(i=0;i<6;i++){
if(i===0){
sb.push("<tr class=\"Calendar\"><td rowspan=\"6\" background=\"",this.imgRdir,"/cal_waku_l_bg.gif\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
}else{
sb.push("<tr class=\"Calendar\">");
}
for(j=0;j<7;j++){
if((i===0&&j<this.startDay1)||day1>this.monthOfDays1){
sb.push("<td align=\"center\"  bgcolor=\"#FFFFFF\">&nbsp;</td>");
}else{
if(this.holidayList&&this.holidayList[this.viewYear1]&&this.holidayList[this.viewYear1][this.viewMonth1+1]&&this.holidayList[this.viewYear1][this.viewMonth1+1][day1]===1){
_16b=["<a href=\"#\" onClick=\"",this.name,".choiceCal(",this.viewYear1,",",this.viewMonth1,",",day1,");",this.linkFunc,"\">","<font ",this.getDayColor(this.getDayNumber(0))," face=\"",this.fontfacename,"\" class=\"small\">",day1,"</font></a>"].join("");
}else{
if(this.customDayColorList&&this.customDayColorList[this.viewYear1]&&this.customDayColorList[this.viewYear1][this.viewMonth1+1]&&this.customDayColorList[this.viewYear1][this.viewMonth1+1][day1]){
_16b=["<a href=\"#\" onClick=\"",this.name,".choiceCal(",this.viewYear1,",",this.viewMonth1,",",day1,");",this.linkFunc,"\">","<font color=\"",this.customDayColorList[this.viewYear1][this.viewMonth1+1][day1],"\" face=\"",this.fontfacename,"\" class=\"small\">",day1,"</font></a>"].join("");
}else{
_16b=["<a href=\"#\" onClick=\"",this.name,".choiceCal(",this.viewYear1,",",this.viewMonth1,",",day1,");",this.linkFunc,"\">","<font ",this.getDayColor(j)," face=\"",this.fontfacename,"\" class=\"small\">",day1,"</font></a>"].join("");
}
}
sb.push("<td align=\"center\" ",this.getDayBackGround(this.viewYear1,this.viewMonth1,day1,j),">",_16b,"</td>");
day1++;
}
}
if(i===0){
sb.push("<td rowspan=\"6\" background=\"",this.imgRdir,"/cal_waku_l_bg.gif\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
}
for(j=0;j<7;j++){
if(i===5&&j===6){
sb.push("<td align=\"right\" valign=\"bottom\"><img src=\"",this.imgRdir,"/cal_pagecarl.gif\" width=\"12\" height=\"10\"></td>");
}else{
if((i===0&&j<this.startDay2)||day2>this.monthOfDays2){
sb.push("<td align=\"center\"  bgcolor=\"#FFFFFF\">&nbsp;</td>");
}else{
if(this.holidayList&&this.holidayList[this.viewYear2]&&this.holidayList[this.viewYear2][this.viewMonth2+1]&&this.holidayList[this.viewYear2][this.viewMonth2+1][day2]===1){
_16b=["<a href=\"#\" onClick=\"",this.name,".choiceCal(",this.viewYear2,",",this.viewMonth2,",",day2,");",this.linkFunc,"\">","<font ",this.getDayColor(this.getDayNumber(0))," face=\"",this.fontfacename,"\" class=\"small\">",day2,"</font></a>"].join("");
}else{
if(this.customDayColorList&&this.customDayColorList[this.viewYear2]&&this.customDayColorList[this.viewYear2][this.viewMonth2+1]&&this.customDayColorList[this.viewYear2][this.viewMonth2+1][day2]){
_16b=["<a href=\"#\" onClick=\"",this.name,".choiceCal(",this.viewYear2,",",this.viewMonth2,",",day2,");",this.linkFunc,"\">","<font color=\"",this.customDayColorList[this.viewYear2][this.viewMonth2+1][day2],"\" face=\"",this.fontfacename,"\" class=\"small\">",day2,"</font></a>"].join("");
}else{
_16b=["<a href=\"#\" onClick=\"",this.name,".choiceCal(",this.viewYear2,",",this.viewMonth2,",",day2,");",this.linkFunc,"\">","<font ",this.getDayColor(j)," face=\"",this.fontfacename,"\" class=\"small\">",day2,"</font></a>"].join("");
}
}
sb.push("<td align=\"center\" ",this.getDayBackGround(this.viewYear2,this.viewMonth2,day2,j),">",_16b,"</td>");
day2++;
}
}
}
sb.push("</tr>");
}
sb.push("<tr class=\"Calendar\"><td><img src=\"",this.imgRdir,"/cal_waku_bl.gif\" width=\"3\" height=\"6\"></td>");
sb.push("<td colspan=\"7\" background=\"",this.imgRdir,"/cal_waku_b_bg.gif\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"></td>");
sb.push("<td background=\"",this.imgRdir,"/cal_waku_b_bg.gif\"><img src=\"",this.imgRdir,"/cal_waku_bl.gif\" width=\"3\" height=\"6\"></td>");
sb.push("<td colspan=\"7\" align=\"right\" background=\"",this.imgRdir,"/cal_waku_b_bg.gif\"><img src=\"",this.imgRdir,"/null.gif\" width=\"1\" height=\"1\"><img src=\"",this.imgRdir,"/cal_pagecarl_b.gif\" width=\"12\" height=\"6\"></td>");
sb.push("<td><img src=\"",this.imgRdir,"/cal_waku_br.gif\" width=\"3\" height=\"6\"></td>");
sb.push("</tr>");
sb.push("</table>");
var cal=document.getElementById(this.calid);
var str=sb.join("");
if(cal){
cal.innerHTML=str;
}
return str;
},enable:function(){
if(this.disabled===true){
this.disabled=false;
this.onEnable();
}
},disable:function(){
if(this.disabled===false){
this.disabled=true;
this.onDisable();
}
}};
DA.cal.Calendar.thisToday=new Date();
DA.cal.Calendar.thisYear=DA.cal.Calendar.thisToday.getYear();
DA.cal.Calendar.thisMonth=DA.cal.Calendar.thisToday.getMonth();
DA.cal.Calendar.thisDay=DA.cal.Calendar.thisToday.getDate();
if(DA.cal.Calendar.thisYear<1900){
DA.cal.Calendar.thisYear=DA.cal.Calendar.thisYear+1900;
}
DA.cal.Calendar.selectedCalendarId=null;
DA.cal.Calendar.fncClose=function(_16e){
var cal=document.getElementById(_16e);
DA.cal.CalendarTool.shim.close(cal);
cal.style.display="none";
DA.cal.Calendar.selectedCalendarId=null;
};
DA.cal.Calendar.fncPopup=function(_ev,_171,_172,_173,_174,_175,_day){
var _177=document.getElementById(_173);
var _178=DA.cal.CalendarTool.dom.getOffsetLeft(_177);
var _179=DA.cal.CalendarTool.dom.getOffsetTop(_177)+_177.offsetHeight;
var cal=document.getElementById(_172);
if(cal.style.display==="block"){
DA.cal.Calendar.fncClose(_172);
return;
}
if(DA.cal.Calendar.selectedCalendarId){
DA.cal.Calendar.fncClose(DA.cal.Calendar.selectedCalendarId);
}
DA.cal.Calendar.selectedCalendarId=_172;
if(_171){
if(typeof (_174)==="undefined"){
_174=DA.cal.Calendar.thisYear;
}else{
_174=parseInt(_174,10);
}
if(typeof (_175)==="undefined"){
_175=DA.cal.Calendar.thisMonth+1;
}else{
_175=parseInt(_175,10);
}
if(typeof (_day)==="undefined"){
_day=DA.cal.Calendar.thisDay;
}else{
_day=parseInt(_day,10);
}
_171.initCal(_174,_175,_day);
_171.writeCal();
}
cal.style.display="block";
cal.style.position="absolute";
cal.style.left=_178+"px";
cal.style.top=_179+"px";
DA.cal.CalendarTool.shim.open(cal);
if(typeof (window.adJustParentIFrame)==="function"){
setTimeout("adJustParentIFrame()",100);
}
if(_171){
setTimeout(function(){
_171.writeCal();
},20);
}
return false;
};
DA.cal.Calendar.fncPopup2=function(_ev,_17c,_17d,_17e,_17f,_180,_day){
var _182=document.getElementById(_17e);
var _183=DA.cal.CalendarTool.dom.getOffsetLeft(_182);
var _184=DA.cal.CalendarTool.dom.getOffsetTop(_182)+_182.offsetHeight;
var cal=document.getElementById(_17d);
if(cal.style.display==="block"){
DA.cal.Calendar.fncClose(_17d);
return;
}
if(DA.cal.Calendar.selectedCalendarId){
DA.cal.Calendar.fncClose(DA.cal.Calendar.selectedCalendarId);
}
DA.cal.Calendar.selectedCalendarId=_17d;
if(_17c){
if(typeof (_17f)==="undefined"){
_17f=DA.cal.Calendar.thisYear;
}else{
_17f=parseInt(_17f,10);
}
if(typeof (_180)==="undefined"){
_180=DA.cal.Calendar.thisMonth+1;
}else{
_180=parseInt(DA.cal.CalendarTool.dateSelector.mon2num(_180),10);
}
if(typeof (_day)==="undefined"){
_day=DA.cal.Calendar.thisDay;
}else{
_day=parseInt(_day,10);
}
_17c.initCal2(_17f,_180,_day);
_17c.writeCal2();
}
cal.style.display="block";
cal.style.position="absolute";
cal.style.left=_183+"px";
cal.style.top=_184+"px";
DA.cal.CalendarTool.shim.open(cal);
if(_17c){
setTimeout(function(){
_17c.writeCal2();
},20);
}
if(typeof (window.adJustParentIFrame)==="function"){
setTimeout("adJustParentIFrame()",100);
}
return false;
};
DA.cal.Calendar.fncSet=function(_186,_187,_188,_189,_18a){
DA.cal.Calendar.fncClose(_187);
var ret;
var year=document.getElementById(_188);
ret=DA.cal.CalendarTool.dom.setSelectedIndex(year,_186.nowYear);
if(!ret){
return;
}
var _18d=document.getElementById(_189);
ret=DA.cal.CalendarTool.dom.setSelectedIndex(_18d,_186.nowMonth+1);
if(!ret){
return;
}
var day=document.getElementById(_18a);
ret=DA.cal.CalendarTool.dom.setSelectedIndex(day,_186.nowDay);
if(!ret){
return;
}
if(_186.onSet){
_186.onSet(_186.nowYear,_186.nowMonth+1,_186.nowDay);
}
};
DA.cal.CalendarTool={};
DA.cal.CalendarTool.dateSelector={clear:function(_18f){
var year=$(_18f.year);
if(year){
year.value=-1;
}
var _191=$(_18f.month);
if(_191){
_191.value=-1;
}
var day=$(_18f.day);
if(day){
day.value=-1;
}
var hour=$(_18f.hour);
if(hour){
hour.value=-1;
}
var min=$(_18f.min);
if(min){
min.value=-1;
}
},toggleActivity:function(_195,_196){
var year=$(_195.year);
if(year){
year.disabled=_196;
}
var _198=$(_195.month);
if(_198){
_198.disabled=_196;
}
var day=$(_195.day);
if(day){
day.disabled=_196;
}
var hour=$(_195.hour);
if(hour){
hour.disabled=_196;
}
var min=$(_195.min);
if(min){
min.disabled=_196;
}
var _19c=$(_195.picker);
if(_19c){
if(_196){
Element.hide(_19c);
Element.hide($(_195.calid));
}else{
Element.show(_19c);
}
}
},mon2num:function(mon){
var mm;
switch(mon+""){
case "1":
case "01":
case "Jan":
mm="01";
break;
case "2":
case "02":
case "Feb":
mm="02";
break;
case "3":
case "03":
case "Mar":
mm="03";
break;
case "4":
case "04":
case "Apr":
mm="04";
break;
case "5":
case "05":
case "May":
mm="05";
break;
case "6":
case "06":
case "Jun":
mm="06";
break;
case "7":
case "07":
case "Jul":
mm="07";
break;
case "8":
case "08":
case "Aug":
mm="08";
break;
case "9":
case "09":
case "Sep":
mm="09";
break;
case "10":
case "Oct":
mm="10";
break;
case "11":
case "Nov":
mm="11";
break;
case "12":
case "Dec":
mm="12";
break;
default:
mm="";
}
return (mm);
},disable:function(_19f){
this.toggleActivity(_19f,true);
},enable:function(_1a0){
this.toggleActivity(_1a0,false);
}};
DA.cal.CalendarTool.dom={getOffsetLeft:function(elm){
var _1a2=elm.offsetLeft;
var _1a3=elm;
while((_1a3=_1a3.offsetParent)){
_1a2+=_1a3.offsetLeft;
if(_1a3.tagName.toLowerCase()==="body"){
break;
}
}
return _1a2;
},getOffsetTop:function(elm){
var _1a5=elm.offsetTop;
var _1a6=elm;
while((_1a6=_1a6.offsetParent)){
_1a5+=_1a6.offsetTop;
if(_1a6.tagName.toLowerCase()==="body"){
break;
}
}
return _1a5;
},setSelectedIndex:function(_1a7,_1a8){
var _1a9=_1a7.value;
_1a7.value=_1a8;
if(_1a7.selectedIndex===-1){
_1a7.value=_1a9;
return false;
}
return true;
}};
DA.cal.CalendarTool.shim={open:function(menu){
if(document.all===null){
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
var _1ac=menu.offsetWidth;
var _1ad=menu.offsetHeight;
shim.style.width=_1ac;
shim.style.height=_1ad;
shim.style.top=menu.style.top;
shim.style.left=menu.style.left;
shim.style.zIndex=menu.style.zIndex-1;
shim.style.position="absolute";
shim.style.display="block";
var _1ae;
if(shim.style.top===""||shim.style.left===""){
_1ae=this._cumulativeOffset(menu);
shim.style.top=_1ae[1];
shim.style.left=_1ae[0];
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
},_cumulativeOffset:function(_1b5){
var _1b6=0,_1b7=0;
do{
_1b6+=_1b5.offsetTop||0;
_1b7+=_1b5.offsetLeft||0;
_1b5=_1b5.offsetParent;
}while(_1b5);
return [_1b7,_1b6];
}};
if(!DA){
throw "ERROR: missing DA.js or DA-min.js";
}
if(!DA.cal){
DA.cal={};
}
DA.cal.DateSelector=Ext.extend(Ext.BoxComponent,{lang:"ja",timeStyle:"24h",yearList:[],firstDay:0,holidayList:[],customDayColorList:[],yyNode:null,mmNode:null,ddNode:null,hhNode:null,miNode:null,ssNode:null,calNode:null,yyId:null,mmId:null,ddId:null,hhId:null,miId:null,ssId:null,yyName:null,mmName:null,ddName:null,hhName:null,miName:null,ssName:null,_calNumber:0,_calAId:null,_calDivId:null,_calObjectName:null,yySelector:null,mmSelector:null,ddSelector:null,hhSelector:null,miSelector:null,ssSelector:null,calSelector:null,lite:false,_dayList:{"1":31,"2":29,"3":31,"4":30,"5":31,"6":30,"7":31,"8":31,"9":30,"10":31,"11":30,"12":31},_itemSaver:{"28":null,"29":null,"30":null},initComponent:function(){
var _1b8=this.lite?function(para){
var ret=new DA.cal.DateSelector.PulldownLite(para);
return ret;
}:function(para){
var ret=new Ext.ux.NumberPulldown(para);
return ret;
};
this.constructor.superclass.initComponent.call(this);
this.value={};
this.addEvents("change");
var me=this;
if(me.yyNode){
me.yyId=me.yyNode.id;
me.yyName=me.yyNode.name;
me.yySelector=_1b8({transform:me.yyNode,forceSelection:true,width:55});
}
if(me.mmNode){
me.mmId=me.mmNode.id;
me.mmName=me.mmNode.name;
me.mmSelector=_1b8({transform:me.mmNode,forceSelection:(me.lang==="ja")?true:false,width:(me.lang==="en")?48:42});
}
if(me.ddNode){
me.ddId=me.ddNode.id;
me.ddName=me.ddNode.name;
me.ddSelector=_1b8({transform:me.ddNode,forceSelection:true,width:42});
}
if(me.hhNode){
me.hhId=me.hhNode.id;
me.hhName=me.hhNode.name;
me.hhSelector=_1b8({transform:me.hhNode,forceSelection:(me.timeStyle==="24h")?true:false,width:(me.timeStyle==="24h")?42:62});
}
if(me.miNode){
me.miId=me.miNode.id;
me.miName=me.miNode.name;
me.miSelector=_1b8({transform:me.miNode,forceSelection:true,width:42});
}
if(me.ssNode){
me.ssId=me.ssNode.id;
me.ssName=me.ssNode.name;
me.ssSelector=_1b8({transform:me.ssNode,forceSelection:true,width:42});
}
if(me.calNode&&!this.lite){
me._calNumber=DA.cal.DateSelector._calNumber++;
me._calAId=me._calIdHeader();
me._calDivId=me._calIdHeader()+"_Id";
me._calObjectName="DA.cal.DateSelector._calObject["+me._calNumber+"]";
me.calNode.innerHTML=["<a id=\""+me._calAId+"\" href=\"#\" onclick=\"DA.cal.Calendar.fncPopup2(event, "+me._calObjectName+", '"+me._calDivId+"', '"+me._calAId+"', $('"+me.yyId+"').value, $('"+me.mmId+"').value, $('"+me.ddId+"').value);\">","<img src=\""+DA.vars.imgRdir+"/ico_hibiki_calendar.gif\" align=\"absmiddle\">","</a>","&nbsp;&nbsp;<div id=\""+me._calDivId+"\" style=\"display:none\"></div>"].join("");
me.calSelector=new DA.cal.Calendar(me._calDivId,me._calObjectName,{prefix:{year:me.yyName,month:me.mmName,day:me.ddName},lang:me.lang,firstDay:me.firstDay,yearList:me.yearList,holidayList:me.holidayList,customDayColorList:me.customDayColorList},{onSet:function(year,_1bf,day){
me.yySelector.setValue(year);
me.yySelector.fireEvent("select",me.yySelector);
me.mmSelector.setValue(_1bf);
me.mmSelector.fireEvent("select",me.mmSelector);
me.ddSelector.setValue(day);
me.ddSelector.fireEvent("select",me.ddSelector);
},onEnable:function(){
$(me._calAId).style.display="";
},onDisable:function(){
$(me._calAId).style.display="none";
}});
me.calSelector.writeCal2();
DA.cal.DateSelector._calObject[me._calNumber]=me.calSelector;
me._saveLast3Item();
}
this._setupEventPlumbing();
},_setupEventPlumbing:function(){
Ext.each(this._fields,function(_1c1){
var _1c2=this[_1c1+"Selector"];
if(!_1c2||!_1c2.getValue){
return;
}
var v=_1c2.getValue();
if(v==="--"){
delete this.value[_1c1];
}else{
this.value[_1c1]=v;
}
var _1c4=function(sel){
var val=sel.getValue();
if(val==="--"){
delete this.value[_1c1];
}else{
this.value[_1c1]=val;
}
this.fireEventsIfValid();
};
var _1c7=this.lang==="ja"?function(sel){
var val=sel.getValue();
if(val==="--"){
delete this.value[_1c1];
}else{
this.value[_1c1]=val;
}
this.fireEventsIfValid();
}:function(sel){
var val=sel.getValue();
val=DA.util.isEmpty(val)?sel.getText():val;
if(val==="--"){
delete this.value[_1c1];
}else{
this.value[_1c1]=this._getMonthNumber(val);
if(this.value[_1c1]===""){
sel.setValue("");
}
}
this.fireEventsIfValid();
};
var _1cc=this.timeStyle==="24h"?function(sel){
var val=sel.getValue();
if(val==="--"){
delete this.value[_1c1];
}else{
this.value[_1c1]=val;
}
this.fireEventsIfValid();
}:function(sel){
var val=sel.getValue();
val=DA.util.isEmpty(val)?sel.getText():val;
if(val==="--"){
delete this.value[_1c1];
}else{
this.value[_1c1]=this._getHourNumber(val);
if(this.value[_1c1]===""){
sel.setValue("");
}
}
this.fireEventsIfValid();
};
_1c2.on({select:(_1c1==="mm")?_1c7:((_1c1==="hh")?_1cc:_1c4),enable:(_1c1==="mm")?_1c7:((_1c1==="hh")?_1cc:_1c4),disable:(_1c1==="mm")?_1c7:((_1c1==="hh")?_1cc:_1c4),blur:(_1c1==="mm")?_1c7:((_1c1==="hh")?_1cc:_1c4),scope:this});
},this);
this.fireEventsIfValid.defer(10,this,[]);
},value:null,fireEventsIfValid:function(){
if(this.value.yy&&this.value.mm&&this.value.dd){
if("undefined"!==typeof this.value.hh&&"undefined"===typeof this.value.mi){
this.value.mi=0;
}
this.fireEvent("change",this);
}
},_fields:["yy","mm","dd","hh","mi","ss"],getValue:function(){
return Ext.apply({},this.value);
},setValue:function(obj){
var _1d2;
var _1d3;
for(var _1d4 in obj){
_1d3=this[_1d4+"Selector"];
if(!_1d3||!_1d3.setValue){
continue;
}
_1d3.setValue(obj[_1d4]);
this.value[_1d4]=obj[_1d4];
}
},enableYY:function(){
if(this.yySelector){
this.yySelector.enable();
}
},enableMM:function(){
if(this.mmSelector){
this.mmSelector.enable();
}
},enableDD:function(){
if(this.ddSelector){
this.ddSelector.enable();
}
},enableHH:function(){
if(this.hhSelector){
this.hhSelector.enable();
}
},enableMI:function(){
if(this.miSelector){
this.miSelector.enable();
}
},enableSS:function(){
if(this.ssSelector){
this.ssSelector.enable();
}
},enableDate:function(){
this.enableYY();
this.enableMM();
this.enableDD();
if(this.calSelector){
this.calSelector.enable();
}
},enableTime:function(){
this.enableHH();
this.enableMI();
this.enableSS();
},enableAll:function(){
this.enableDate();
this.enableTime();
if(this.calSelector){
this.calSelector.enable();
}
},disableYY:function(){
if(this.yySelector){
this.yySelector.disable();
}
},disableMM:function(){
if(this.mmSelector){
this.mmSelector.disable();
}
},disableDD:function(){
if(this.ddSelector){
this.ddSelector.disable();
}
},disableHH:function(){
if(this.hhSelector){
this.hhSelector.disable();
}
},disableMI:function(){
if(this.miSelector){
this.miSelector.disable();
}
},disableSS:function(){
if(this.ssSelector){
this.ssSelector.disable();
}
},disableDate:function(){
this.disableYY();
this.disableMM();
this.disableDD();
if(this.calSelector){
this.calSelector.disable();
}
},disableTime:function(){
this.disableHH();
this.disableMI();
this.disableSS();
},disableAll:function(){
this.disableDate();
this.disableTime();
if(this.calSelector){
this.calSelector.disable();
}
},resetYY:function(){
if(this.yySelector){
this.yySelector.setValue("--");
}
},resetMM:function(){
if(this.mmSelector){
this.mmSelector.setValue("--");
}
},resetDD:function(){
if(this.ddSelector){
this.ddSelector.setValue("--");
}
},resetHH:function(){
if(this.hhSelector){
this.hhSelector.setValue("--");
}
},resetMI:function(){
if(this.miSelector){
this.miSelector.setValue("--");
}
},resetSS:function(){
if(this.ssSelector){
this.ssSelector.setValue("--");
}
},resetDate:function(){
this.resetYY();
this.resetMM();
this.resetDD();
},resetTime:function(){
this.resetHH();
this.resetMI();
this.resetSS();
},resetAll:function(){
this.resetDate();
this.resetTime();
},syncYY:function(){
if(this.yySelector){
if(this.yySelector.getText()!==this.yySelector.getValue()){
this.yySelector.setValue(this.yySelector.getText());
}
}
},syncMM:function(){
if(this.mmSelector){
if(this.mmSelector.getText()!==this.mmSelector.getValue()){
this.mmSelector.setValue(this.mmSelector.getText());
}
}
},syncDD:function(){
if(this.ddSelector){
if(this.ddSelector.getText()!==this.ddSelector.getValue()){
this.ddSelector.setValue(this.ddSelector.getText());
}
}
},syncHH:function(){
if(this.hhSelector){
if(this.hhSelector.getText()!==this.hhSelector.getValue()){
this.hhSelector.setValue(this.hhSelector.getText());
}
}
},syncMI:function(){
if(this.miSelector){
if(this.miSelector.getText()!==this.miSelector.getValue()){
this.miSelector.setValue(this.miSelector.getText());
}
}
},syncSS:function(){
if(this.ssSelector){
if(this.ssSelector.getText()!==this.ssSelector.getValue()){
this.ssSelector.setValue(this.ssSelector.getText());
}
}
},syncDate:function(){
this.syncYY();
this.syncMM();
this.syncDD();
},syncTime:function(){
this.syncHH();
this.syncMI();
this.syncSS();
},syncAll:function(){
this.syncDate();
this.syncTime();
},updateDayList:function(date){
var i;
var year=Number(date.yy);
var _1d8=Number(date.mm);
if(_1d8===0){
return;
}
var day=this._dayList[String(_1d8)];
if(_1d8===2&&year){
day=new Date(year,_1d8,0).getDate();
}
var _1da=this.ddSelector.getPulldownLength();
if(day<_1da){
if(date.dd>day){
this.ddSelector.setValue(day);
}
this.ddSelector.removeItem(day,_1da-1);
}else{
if(day>_1da){
for(i=_1da;i<day;i++){
this.ddSelector.addItem(this._itemSaver[i]);
}
}
}
if(date.dd>day){
date.dd=day;
}
return date.dd;
},_saveLast3Item:function(){
for(var i=30;i>=28;i--){
this._itemSaver[String(i)]=this.ddSelector.getItem(i);
}
},_calIdHeader:function(){
return "DACalendar_"+this._calNumber;
},_getMonthNumber:function(mon){
var mm;
switch(mon+""){
case "1":
case "01":
case "Jan":
mm="01";
break;
case "2":
case "02":
case "Feb":
mm="02";
break;
case "3":
case "03":
case "Mar":
mm="03";
break;
case "4":
case "04":
case "Apr":
mm="04";
break;
case "5":
case "05":
case "May":
mm="05";
break;
case "6":
case "06":
case "Jun":
mm="06";
break;
case "7":
case "07":
case "Jul":
mm="07";
break;
case "8":
case "08":
case "Aug":
mm="08";
break;
case "9":
case "09":
case "Sep":
mm="09";
break;
case "10":
case "Oct":
mm="10";
break;
case "11":
case "Nov":
mm="11";
break;
case "12":
case "Dec":
mm="12";
break;
default:
mm="";
}
return (mm);
},_getHourNumber:function(hour){
var hh;
switch(hour+""){
case "00":
case "12 AM":
hh="00";
break;
case "01":
case "01 AM":
hh="01";
break;
case "02":
case "02 AM":
hh="02";
break;
case "03":
case "03 AM":
hh="03";
break;
case "04":
case "04 AM":
hh="04";
break;
case "05":
case "05 AM":
hh="05";
break;
case "06":
case "06 AM":
hh="06";
break;
case "07":
case "07 AM":
hh="07";
break;
case "08":
case "08 AM":
hh="08";
break;
case "09":
case "09 AM":
hh="09";
break;
case "10":
case "10 AM":
hh="10";
break;
case "11":
case "11 AM":
hh="11";
break;
case "12":
case "12 PM":
hh="12";
break;
case "13":
case "01 PM":
hh="13";
break;
case "14":
case "02 PM":
hh="14";
break;
case "15":
case "03 PM":
hh="15";
break;
case "16":
case "04 PM":
hh="16";
break;
case "17":
case "05 PM":
hh="17";
break;
case "18":
case "06 PM":
hh="18";
break;
case "19":
case "07 PM":
hh="19";
break;
case "20":
case "08 PM":
hh="20";
break;
case "21":
case "09 PM":
hh="21";
break;
case "22":
case "10 PM":
hh="22";
break;
case "23":
case "11 PM":
hh="23";
break;
default:
hh="--";
}
return (hh);
}});
DA.cal.DateSelector.PulldownLite=function(pa){
Ext.apply(this,pa);
if(!this.transform){
throw "ERROR: Bad args: PulldownLite needs { transform: HTMLSELECTElement }";
}
this.el=$(this.transform);
this.addEvents({select:true,enable:true,disable:true,blur:true});
this._setupEventPlumbing();
};
Ext.extend(DA.cal.DateSelector.PulldownLite,Ext.util.Observable,{setValue:function(val){
var nVal=parseInt(val,10);
var _1e3;
if(isFinite(nVal)){
_1e3=(nVal<10)?("0"+nVal):(""+nVal);
}else{
_1e3="--";
}
this.el.value=_1e3;
if(!this.el.value){
this.el.value="--";
}
},getValue:function(){
return this.el.value;
},getText:function(){
return this.el.value;
},enable:function(){
this.el.disabled=false;
},disable:function(){
this.el.disabled=true;
},isDisable:function(){
return this.el.disabled;
},_setupEventPlumbing:function(){
var el=Ext.get(this.el);
el.on("change",function(eve){
this.fireEvent("select",this);
},this);
el.on("blur",function(eve){
this.fireEvent("blur",this);
},this);
}});
DA.cal.DateSelector._calNumber=0;
DA.cal.DateSelector._calObject=[];
if(!DA){
throw "ERROR: missing DA.js or DA-min.js";
}
if(!DA.cal||!DA.cal.DateSelector){
throw "ERROR: missing common/calender/selector.js";
}
DA.cal.DateRangeSelector=Ext.extend(Ext.Component,{startConfig:{},endConfig:{},commonConfig:{},initComponent:function(){
this.constructor.superclass.initComponent.call(this);
this.addEvents("change","enabled","disabled");
var _1e7=Ext.apply({},this.startConfig,this.commonConfig);
var _1e8=Ext.apply({},this.endConfig,this.commonConfig);
this.startDateSelector=new DA.cal.DateSelector(_1e7);
this.endDateSelector=new DA.cal.DateSelector(_1e8);
this._setupEventPlumbing();
},_setupEventPlumbing:function(){
this.startDateSelector.on("change",this._handleOnStartDateChange,this);
this.endDateSelector.on("change",this._handleOnEndDateChange,this);
},_handleOnStartDateChange:function(){
DA.customEvent.fire("dateRangeSelectorOnStartDateChangeBefore",this);
this._handleCommonOnChange();
},_handleOnEndDateChange:function(){
DA.customEvent.fire("dateRangeSelectorOnEndDateChangeBefore",this);
this._handleCommonOnChange();
},_handleCommonOnChange:function(){
var _1e9;
var day;
var date=this.getValue();
if(!this.startConfig.lite&&!this.endConfig.lite){
_1e9=this._updateSelList(date.start,date.end);
date.start.dd=_1e9.startDay;
date.end.dd=_1e9.endDay;
}else{
day=new Date(date.start.yy,date.start.mm,0).getDate();
if(date.start.dd>day){
date.start.dd=day;
}
day=new Date(date.end.yy,date.end.mm,0).getDate();
if(date.end.dd>day){
date.end.dd=day;
}
}
date.end.mi=this._checkEndHH(date.end);
this.fireEvent("change",date.start,date.end);
},changeWithoutFireEvent:function(){
var date=this.getValue();
this._checkEndHH(date.end);
},_checkEndHH:function(_1ed){
var _1ee=String(_1ed.hh);
var _1ef=String(_1ed.mi);
if(!this.startConfig.lite&&!this.endConfig.lite){
if(_1ee==="24"){
this.endDateSelector.miSelector.setValue("00");
this.endDateSelector.miSelector.setDisable(true);
this.endDateSelector.miSelector.setEditable(false);
_1ef=0;
}else{
if(_1ee==="undefined"||_1ee==="--"){
this.endDateSelector.miSelector.setValue("--");
this.endDateSelector.miSelector.setDisable(true);
this.endDateSelector.miSelector.setEditable(false);
_1ef=0;
}else{
if(!this.endDateSelector.hhSelector.isDisable()){
this.endDateSelector.miSelector.setDisable(false);
this.endDateSelector.miSelector.setEditable(true);
}
}
}
}else{
if(_1ee==="24"){
this.endDateSelector.miSelector.setValue("00");
this.endDateSelector.miSelector.disable();
_1ef=0;
}else{
if(_1ee==="undefined"||_1ee==="--"){
this.endDateSelector.miSelector.setValue("--");
this.endDateSelector.miSelector.disable();
_1ef=0;
}else{
if(!this.endDateSelector.hhSelector.isDisable()){
this.endDateSelector.miSelector.enable();
}
}
}
}
return _1ef;
},setValue:function(_1f0,end,_1f2){
this.startDateSelector.setValue(_1f0||{});
this.endDateSelector.setValue(end||{});
if(_1f2===true){
this._handleCommonOnChange();
}
},getValue:function(){
var _1f3=this.startDateSelector.getValue();
var _1f4=this.endDateSelector.getValue();
return ({start:_1f3,end:_1f4});
},_updateSelList:function(_1f5,end){
_1f5.dd=this.startDateSelector.updateDayList(_1f5);
end.dd=this.endDateSelector.updateDayList(end);
return ({startDay:_1f5.dd,endDay:end.dd});
}});
(function(){
var _1f7=["enable","disable"];
var _1f8=["Start","End"];
var _1f9=["Date","Time"];
var _1fa=DA.cal.DateRangeSelector.prototype;
_1f7.each(function(verb){
_1f8.each(function(_1fc){
_1f9.each(function(noun){
var _1fe=verb+_1fc+noun;
var _1ff=_1fc.charAt(0).toLowerCase()+_1fc.substr(1)+"DateSelector";
_1fa[_1fe]=function(){
var _200=this[_1ff];
if(!_200){
return;
}
var f=_200[verb+noun];
if(f){
f.call(_200);
this.fireEvent(verb+"d",_1fc,noun);
}
};
_1fa[verb+noun]=function(){
var f=this[verb+"Start"+noun];
if(f){
f.call(this);
}
f=this[verb+"End"+noun];
if(f){
f.call(this);
}
};
});
});
});
})();
DA.widget.TimeRangeSlider=Ext.extend(Ext.BoxComponent,{resolution:5,scale:1,initialMin:0,initialMax:0,minValue:0,maxValue:24,warpSnap:0.5,orientation:"horizontal",initComponent:function(){
this.constructor.superclass.initComponent.call(this);
this.addEvents("change");
this.scale=parseInt(this.scale,10);
this.resolution=parseInt(this.resolution,10);
},_bgClasses:{"bg-08hto20h":function(s){
return s.minValue===8&&s.maxValue===20&&(s.resolution/s.scale===5/2);
},"bg-08hto20h-scale2":function(s){
return s.minValue===8&&s.maxValue===20&&(s.resolution/s.scale===5/4);
},"bg-24h":function(s){
return s.minValue===0&&s.maxValue===24&&(s.resolution/s.scale===5);
},"bg-24h-scale2":function(s){
return s.minValue===0&&s.maxValue===24&&(s.resolution/s.scale===5/2);
},"bg-24h-scale3":function(s){
return (s.maxValue-s.minValue===24)&&(s.resolution/s.scale===5/3);
}},halfHandleWidth:0,onRender:function(ct,pos){
var _20a=this.maxValue-this.minValue;
var _20b=(_20a*(60/this.resolution)*this.scale);
this.el=ct.createChild({id:this.id,cls:"timerangeslider"},pos);
this.slideZone=new Ext.ux.SlideZone(this.el.dom,{type:this.orientation,size:_20b,sliderHeight:24,maxValue:this.maxValue,minValue:this.minValue,sliderSnap:[Math.max(1,this.scale),Math.max(1,this.scale)]});
this._doHalfHandleStuff();
this.slideZone.el.setStyle("overflow","hidden");
for(var cn in this._bgClasses){
if(this._bgClasses[cn](this)){
this.el.addClass(cn+(this.orientation==="vertical"?"-v":""));
}
}
this.rangeSlider=new Ext.ux.RangeSlider({value:[this.initialMin,this.initialMax],name:"24H"});
this.slideZone.add(this.rangeSlider);
this.rangeSlider.resizable.minWidth=(30*this.scale)/this.resolution;
this._slideZoneFixes();
this._setupDragSelection();
this._setupEventPlumbing();
},_doHalfHandleStuff:function(){
if(this.orientation==="vertical"){
this.el.setHeight(this.slideZone.el.getHeight()+(2*this.halfHandleWidth));
this.slideZone.el.setStyle({top:this.halfHandleWidth+"px"});
}else{
this.el.setWidth(this.slideZone.el.getWidth()+(2*this.halfHandleWidth));
this.slideZone.el.setStyle({left:this.halfHandleWidth+"px"});
}
},_slideZoneFixes:function(){
var zone=this.slideZone;
var rs=this.rangeSlider;
rs.resizable.onMouseMove=function(e){
var box=this.constrainTo.getRegion(),tgt=e.getXY();
if(!zone.allowSliderCrossing){
if(zone.type==="vertical"){
box={left:box.left,right:box.right,top:this.startBox.y-this.leftTravel[0],bottom:this.startBox.y+this.startBox.height+this.rightTravel[0]};
}
if(zone.type==="horizontal"){
box={left:this.startBox.x-this.leftTravel[0],right:this.startBox.x+this.startBox.width+this.rightTravel[0],top:box.top,bottom:box.bottom};
}
}
e.xy=[tgt[0]-box.left<0?box.left-this.startBox.x+this.startPoint[0]:tgt[0]-box.right>0?box.right-this.startBox.right+this.startPoint[0]:tgt[0],tgt[1]-box.top<0?box.top-this.startBox.y+this.startPoint[1]:tgt[1]-box.bottom>0?box.bottom-this.startBox.bottom+this.startPoint[1]:tgt[1]];
Ext.Resizable.prototype.onMouseMove.call(this,e);
zone.updateValues();
rs.fireEvent("drag",rs,e);
};
var _212=this.minValue;
var _213=this.maxValue;
zone.updateValues=function(){
Ext.ux.SlideZone.prototype.updateValues.call(this);
rs.value[0]=Math.max(_212,rs.value[0]);
rs.value[1]=Math.min(_213,rs.value[1]);
};
rs.ddEl.onDrag=function(e){
zone.updateValues();
rs.fireEvent("drag",rs,e);
};
rs.pointer="move";
},_setupDragSelection:function(){
var me=this;
var rs=this.rangeSlider;
var zone=this.slideZone;
var _218=new Ext.dd.DragDrop(this.slideZone.el);
var _219,_21a,_21b,_21c,_21d,_21e,XorY;
var snap=zone.sliderSnap[0];
var _221=(60*this.warpSnap*snap)/this.resolution;
var _222=function(x){
return x-(x%_221)+_221;
};
if(this.orientation==="vertical"){
_21e=rs.resizable.el.getWidth();
_21c="getPageY";
_21d=function(h){
h=_222(h);
rs.resizable.resizeTo(_21e,h);
};
XorY=1;
_21b=function(){
return zone.el.getBottom();
};
}else{
_21e=rs.resizable.el.getHeight();
_21c="getPageX";
_21d=function(w){
w=_222(w);
rs.resizable.resizeTo(w,_21e);
};
_21b=function(){
return zone.el.getRight();
};
XorY=0;
}
var _226;
_218.onMouseDown=function(e){
_219=e.xy[XorY];
_21a=_21b();
rs.setPosition([_219]);
zone.updateValues();
var _228=me.getValues();
var _229=_228[0]%me.warpSnap;
var from=_228[0]-_229;
var to=_228[1]-_229;
if(from===to){
to+=me.warpSnap;
}
var diff=to-from;
if(to>=me.maxValue){
from=me.maxValue-diff;
to=me.maxValue;
}
me._setValues(from,to,e);
_219=rs.getPosition()[XorY];
rs.fireEvent("dragstart",rs,e);
zone.el.addClass("spreadsheet-mode");
_226=rs.pointer;
rs.pointer="w-resize";
};
_218.onDrag=function(e){
var pos=e.xy[XorY];
var hOrW=pos-_219;
if(hOrW<0){
return;
}
if(pos>=_21a){
return;
}
_21d(hOrW);
zone.updateValues();
rs.fireEvent("dragstart",rs);
rs.fireEvent("drag",rs,e);
};
_218.onMouseUp=function(e){
zone.updateConstraints();
zone.updateValues();
rs.fireEvent("dragend",rs);
zone.el.removeClass("spreadsheet-mode");
rs.pointer=_226;
};
this.ddZone=_218;
},_setupEventPlumbing:function(){
this.rangeSlider.on("drag",function(_231,e){
var _233=_231.value;
this.fireEvent("change",this.toHHMM(_233[0]),this.toHHMM(_233[1]),e);
},this);
this.el.on("mouseover",this._fixLimits,this);
},_fixLimits:function(){
var el=this.slideZone.el;
switch(this.orientation){
case "horizontal":
el.lowLimit=[el.getX()];
el.highLimit=[el.getRight()];
break;
case "vertical":
el.lowLimit=[el.getY()];
el.highLimit=[el.getBottom()];
break;
case "area":
el.lowLimit=el.getXY();
el.highLimit=[el.getRight(),el.getBottom()];
break;
}
this.updateConstraints();
},updateConstraints:function(){
this.slideZone.updateConstraints();
var _235=this.rangeSlider.ddEl;
this.ddZone.resetConstraints();
if(this.orientation==="vertical"){
this.ddZone.setYConstraint(_235.topConstraint,_235.bottomConstraint,_235.yTickSize);
}else{
this.ddZone.setXConstraint(_235.leftConstraint,_235.rightConstraint,_235.xTickSize);
}
},setValues:function(min,max){
this._setValues(min,max,null);
},_roundTo4Dec:function(n){
if(!n){
return 0;
}
var str=Number(n).toFixed(4);
return parseFloat(str,10);
},_setValues:function(min,max,e){
if(this.disabled){
return;
}
var rs=this.rangeSlider;
var zone=this.slideZone;
min=(typeof min==="number")?min:this.fromHHMM(min);
max=(typeof max==="number")?max:this.fromHHMM(max);
if(isFinite(min)||isFinite(max)){
max=isFinite(max)?max:this.maxValue;
min=isFinite(min)?min:this.minValue;
}else{
min=max=0;
}
min=this._roundTo4Dec(min);
max=this._roundTo4Dec(max);
rs.value=[min,max];
var w,h,dim;
if(this.orientation==="vertical"){
h=this._valueToPx(max-min);
w=rs.resizable.el.getWidth();
dim="y";
}else{
w=this._valueToPx(max-min);
h=rs.resizable.el.getHeight();
dim="x";
}
var _242=zone.getBox()[dim]+this._valueToPx(min-this.minValue);
_242=Math.round(_242);
rs.setPosition([_242]);
rs.resizable.resizeTo(w,h);
zone.updateConstraints();
zone.updateValues();
if(e){
rs.fireEvent("drag",rs,e);
}
},getValues:function(){
return this.rangeSlider.value;
},_valueToPx:function(n){
var zone=this.slideZone;
var w=n/(zone.maxValue-zone.minValue)*zone.size;
return w;
},_HHMMStringToObj:function(_246){
if(!_246){
return null;
}
var _247=_246.match(/^(\d{1,2}):(\d{1,2})$/);
if(_247&&_247.length===3){
return {HH:parseInt(_247[1],10),MM:parseInt(_247[2],10)};
}else{
return null;
}
},fromHHMM:function(_248){
var o=typeof _248==="object"?_248:this._HHMMStringToObj(_248);
if(!o){
return null;
}
var hh=parseInt(o.HH,10);
var mm=parseInt(o.MM,10);
mm=isFinite(mm)?mm:0;
return hh+(mm/60);
},toHHMM:function(_24c){
var hh=Math.floor(_24c);
var mm=Number((_24c%1)*60);
mm=Math.round(mm/5)*5;
if(mm>=60){
hh+=Math.floor(mm/60);
mm=mm%60;
}
return {HH:hh,MM:mm};
},toHHMMString:function(_24f){
var o=typeof _24f==="object"?_24f:this.toHHMM(_24f);
var HH=o.HH,MM=o.MM;
return (HH<0?("-0"+Math.abs(HH)):HH<10?"0"+HH:HH)+":"+(MM<10?"0"+MM:MM);
},disable:function(){
this.ddZone.lock();
this.rangeSlider.resizable.enabled=false;
this.rangeSlider.ddEl.lock();
this.constructor.superclass.disable.call(this);
},enable:function(){
this.ddZone.unlock();
this.rangeSlider.resizable.enabled=true;
this.rangeSlider.ddEl.unlock();
this.constructor.superclass.enable.call(this);
}});
DA.widget.TimeRangeSliderTip=Ext.extend(Ext.Tip,{minWidth:50,offsets:[0,-10],init:function(_253){
_253.on("render",function(trs){
var zone=trs.slideZone;
var rs=trs.rangeSlider;
rs.on("dragstart",this.show,this);
rs.on("dragend",this.hide,this);
rs.el.on("mouseover",this._setLocation,this);
},this);
_253.on("destroy",this.destroy,this);
_253.on("change",this.onChange,this);
this.slider=_253;
if(_253.orientation==="vertical"){
this.offsets=[20,0];
}else{
this.offsets=[-10,10];
}
},onChange:function(from,to,e){
if(!this.body){
return;
}
this._updateValues([from,to]);
this._setLocation(e);
},_setLocation:function(e){
if(e){
if(this.el){
this.el.setLocation(e.getPageX()+this.offsets[0],e.getPageY()+this.offsets[1]);
}else{
this.pageX=e.getPageX()+this.offsets[0];
this.pageY=e.getPageY()+this.offsets[1];
}
}
},onDestroy:function(){
this.slider.un("change",this.onChange,this);
this.slider.rangeSlider.el.un("mouseover",this._setLocation,this);
this.slider=null;
},show:function(_25b,e){
if(!this.hidden){
return;
}
this._setLocation(e);
this.constructor.superclass.show.call(this);
if(!this.body.getValue()){
this._updateValues(this.slider.getValues());
}
},_updateValues:function(_25d){
this.body.update(this.slider.toHHMMString(_25d[0])+" - "+this.slider.toHHMMString(_25d[1]));
this.doAutoWidth();
}});
if(!DA){
throw "ERROR: missing DA.js or DA-min.js";
}
if(!DA.textCal){
DA.textCal={};
}
DA.textCal.DateSelector=function(_25e,name,cfg){
this.init(_25e,name,cfg);
};
DA.textCal.DateSelector.prototype={lang:"ja",yearList:[],firstDay:0,holidayList:[],customDayColorList:[],textEl:null,linkClass:"",linkTitle:"",init:function(_261,name,cfg){
if(cfg){
for(var i in cfg){
this[i]=cfg[i];
}
}
this.textEl=$(_261);
this.textEl.style.imeMode="disabled";
this.name=name;
this.divId=name+"DivId";
this.imgId=name+"ImgId";
var _265=["DA.textCal.DateSelector._calObject['",name,"'].object"].join("");
var html=["<a id=\"",this.imgId,"\" href=\"#\" onclick=\"DA.textCal.DateSelector._calObject['",name,"'].fncPopup(event, ",_265,", '",this.divId,"', '",this.imgId,"');\" class=\"",DA.util.encode(this.linkClass),"\", title=\"",DA.util.encode(this.linkTitle),"\">","<img src=\"",DA.vars.imgRdir,"/search_fc_calendar.png\" align=\"absmiddle\" border=0>","</a>","&nbsp;&nbsp;<div id=\"",this.divId,"\" style=\"display:none\"></div>"].join("");
Insertion.After(this.textEl,html);
var me=this;
this.calSelector=new DA.cal.Calendar(this.divId,_265,{prefix:{year:"yy",month:"mm",day:"dd"},lang:me.lang,firstDay:me.firstDay,yearList:me.yearList,holidayList:me.holidayList,customDayColorList:me.customDayColorList,minYear:me.minYear,maxYear:me.maxYear,linkFunc:"DA.textCal.DateSelector._calObject['"+me.name+"'].fncSet("+_265+",'"+me.divId+"')"},{onSet:function(year,_269,day){
me.textEl.value=[year,"/",me._twobytes(_269),"/",me._twobytes(day)].join("");
},onEnable:function(){
$(me.imgId).style.display="";
},onDisable:function(){
$(me.imgId).style.display="none";
}});
this.calSelector.writeCal2();
DA.textCal.DateSelector._calObject[this.name]={object:this.calSelector,fncPopup:function(_ev,_26c,_26d,_26e){
var a=me.textEl.value.split(/\//);
var year=a[0]?a[0]:0;
var _271=a[1]?a[1]:0;
var day=a[2]?a[2]:0;
DA.cal.Calendar.fncPopup2(_ev,_26c,_26d,_26e,year,_271,day);
},fncSet:function(_273,_274){
DA.cal.Calendar.fncClose(_274);
if(_273.onSet){
_273.onSet(_273.nowYear,_273.nowMonth+1,_273.nowDay);
}
}};
Event.observe(this.textEl,"change",function(){
var val=me._validate(me.textEl.value);
me.textEl.value=val;
},false);
},_validate:function(date){
var ary=date.split(/\//);
var year=parseInt(ary[0],10);
var _279=parseInt(ary[1],10);
var day=parseInt(ary[2],10);
var i,_27c=false;
var l=this.yearList.length;
if(l>0){
this.yearList.each(function(y){
if(DA.util.cmpNumber(y,year)){
_27c=true;
throw $break;
}
});
}else{
_27c=true;
}
if(_27c&&_279>=1&&_279<=12&&day>=1&&day<=31){
return (year+"/"+this._twobytes(_279)+"/"+this._twobytes(day));
}else{
return ("");
}
},_twobytes:function(n){
return n<10?"0"+n:""+n;
}};
DA.textCal.DateSelector._calObject={};
if(!DA){
throw "ERROR: missing DA.js or DA-min.js";
}
if(!DA.ug){
DA.ug={};
}
DA.ug.AccountSelector=Ext.extend(Ext.Component,{appType:"common",onlyOne:false,userType:1,groupType:2,addrType:0,pageSize:0,readRow:100,textSize:60,denyAdd:false,denyRemove:false,selectorNode:null,selectorId:null,searchNode:null,searchId:null,searchTitle:"\u691c\u7d22:",contentsNode:null,contentsId:null,listNode:null,listId:null,textNode:null,textId:null,displayNode:null,displayId:null,hiddenNode:null,hiddenId:null,queryDelay:null,imageData:{1:{src:DA.vars.imgRdir+"/ico_fc_user.gif",width:"14",height:"14",border:"0",alt:"\u4e00\u822c\u30e6\u30fc\u30b6",align:"absmiddle"},3:{src:DA.vars.imgRdir+"/ico_fc_userfsh.gif",width:"14",height:"14",border:"0",alt:"\u30d5\u30a1\u30a4\u30eb\u5171\u6709\u9650\u5b9a\u30e6\u30fc\u30b6",align:"absmiddle"},4:{src:DA.vars.imgRdir+"/ico_fc_userx.gif",width:"14",height:"14",border:"0",alt:"\u30ed\u30b0\u30a4\u30f3\u4e0d\u80fd\u30e6\u30fc\u30b6",align:"absmiddle"},5:{src:DA.vars.imgRdir+"/ico_fc_useradm.gif",width:"14",height:"14",border:"0",alt:"\u30b7\u30b9\u30c6\u30e0\u7ba1\u7406\u8005",align:"absmiddle"},A:{src:DA.vars.imgRdir+"/ico_fc_userx.gif",width:"14",height:"14",border:"0",alt:"\u305d\u306e\u4ed6\u53c2\u52a0\u8005",align:"absmiddle"},G:{src:DA.vars.imgRdir+"/ico_fc_organization.gif",width:"14",height:"14",border:"0",alt:"\u7d44\u7e54",align:"absmiddle"},P:{src:DA.vars.imgRdir+"/ico_fc_project.gif",width:"14",height:"14",border:"0",alt:"\u30d7\u30ed\u30b8\u30a7\u30af\u30c8",align:"absmiddle"},T:{src:DA.vars.imgRdir+"/ico_fc_executive.gif",width:"14",height:"14",border:"0",alt:"\u5f79\u8077\u30b0\u30eb\u30fc\u30d7",align:"absmiddle"},S1:{src:DA.vars.imgRdir+"/ico_fc_organization_rpl.gif",width:"14",height:"14",border:"0",alt:"\u5ec3\u6b62\u7d44\u7e54",align:"absmiddle"},S2:{src:DA.vars.imgRdir+"/ico_fc_work_rpl.gif",width:"14",height:"14",border:"0",alt:"\u5ec3\u6b62\u30d7\u30ed\u30b8\u30a7\u30af\u30c8",align:"absmiddle"},S3:{src:DA.vars.imgRdir+"/ico_fc_executive_rpl.gif",width:"14",height:"14",border:"0",alt:"\u5ec3\u6b62\u5f79\u8077\u30b0\u30eb\u30fc\u30d7",align:"absmiddle"},ext:{src:DA.vars.imgRdir+"/aqbtn_arrowd.gif",width:"16",height:"16",border:"0",alt:"\u5c55\u958b",align:"top"},del:{src:DA.vars.imgRdir+"/aqbtn_close_s.gif",width:"14",height:"14",border:"0",alt:"\u524a\u9664",align:"top"},log:{src:DA.vars.imgRdir+"/aqbtn_compellogout.gif",width:"55",height:"15",border:"0",alt:"\u30ed\u30b0\u30a2\u30a6\u30c8",align:"top"}},selector:Prototype.emptyFunction,initRecord:null,selectedRecord:null,initContents:null,initSearch:false,initComponent:function(){
this.constructor.superclass.initComponent.call(this);
this.selectorNode=$(this.selectorNode);
this.selectorId=this.selectorNode.id;
this.searchId=this.selectorId+"Search";
this.contentsId=this.selectorId+"Contents";
this.listId=this.selectorId+"List";
this.textId=this.selectorId+"Text";
this.displayId=this.selectorId+"Display";
this.hiddenId=this.selectorId+"Hidden";
var me=this;
var _281=["<table border=0 width=100% cellspacing=0 cellpadding=0>","<tr id=\""+me.searchId+"\">","  <td style=\"padding-left:2px;background-color:#9F9F9F;\" nowrap>"+me.searchTitle+"</td>","  <td style=\"padding:2px;background-color:#9F9F9F;width:100%;\">","    <input type=\"text\" size=\""+me.textSize+"\" id=\""+me.textId+"\">","  </td>","  <td style=\"background-color:#9F9F9F;\" align=\"right\">","    <span id=\""+me.hiddenId+"\" style=\"margin-right:5px;cursor:pointer;\"><img src=\""+DA.vars.imgRdir+"/aqbtn_close2.gif\" align=absmiddle></span>","  </td>","</tr>","<tr>","  <td style=\"width:100%;\" colspan=2>","   <span id=\""+me.contentsId+"\"></span>","    <ul id=\""+me.listId+"\" class=\"da_accountSelectorList\"></ul>","  </td>","  <td align=\"right\">","    <span id=\""+me.displayId+"\" style=\"margin-right:5px;cursor:pointer;\"><img src=\""+DA.vars.imgRdir+"/aqbtn_search_s.gif\" align=absmiddle></span>","  </td>","</tr>","</table>"].join("");
me.selectorNode.innerHTML=_281;
me.searchNode=$(me.searchId);
me.contentsNode=$(me.contentsId);
me.listNode=$(me.listId);
me.textNode=$(me.textId);
me.displayNode=$(me.displayId);
me.hiddenNode=$(me.hiddenId);
me.selectedRecord=[];
var i;
for(i=0;i<me.initRecord.length;i++){
me.addItem({id:me.initRecord[i].id,data:{type:me.initRecord[i].type,name:me.initRecord[i].name,tel3:me.initRecord[i].tel3,login:me.initRecord[i].login,logout:me.initRecord[i].logout,sum:me.initRecord[i].sum}});
}
if(me.initContents){
me.contentsNode.innerHTML=me.initContents;
if(me.selectedRecord.length===0){
me._showContents();
me._hideList();
}
}
var tmpl=["<tpl for=\".\">","<div class=\"search-item\" style=\"padding:3px;\">","<tpl if=\"type === '1'\">","<img src=\""+me.imageData["1"].src+"\" title=\""+me.imageData["1"].alt+"\" class=\"ImgIcoUser\" align=\"absmiddle\"/>","<span>{name:htmlEncode}</span>","</tpl>","<tpl if=\"type === '3'\">","<img src=\""+me.imageData["3"].src+"\" title=\""+me.imageData["3"].alt+"\" class=\"ImgIcoUser\" align=\"absmiddle\"/>","<span>{name:htmlEncode}</span>","</tpl>","<tpl if=\"type === '4'\">","<img src=\""+me.imageData["4"].src+"\" title=\""+me.imageData["4"].alt+"\" class=\"ImgIcoUser\" align=\"absmiddle\"/>","<span>{name:htmlEncode}</span>","</tpl>","<tpl if=\"type === '5'\">","<img src=\""+me.imageData["5"].src+"\" title=\""+me.imageData["5"].alt+"\" class=\"ImgIcoUser\" align=\"absmiddle\"/>","<span>{name:htmlEncode}</span>","</tpl>","<tpl if=\"type === 'A'\">","<img src=\""+me.imageData.A.src+"\" title=\""+me.imageData.A.alt+"\" class=\"ImgIcoUser\" align=\"absmiddle\"/>","<span>{name:htmlEncode}</span>","</tpl>","<tpl if=\"type === 'G'\">","<img src=\""+me.imageData.G.src+"\" title=\""+me.imageData.G.alt+"\" class=\"ImgIcoOrganization\" align=\"absmiddle\"/>","<span>{name:htmlEncode}</span>","</tpl>","<tpl if=\"type === 'P'\">","<img src=\""+me.imageData.P.src+"\" title=\""+me.imageData.P.alt+"\" class=\"ImgIcoUser\" align=\"absmiddle\"/>","<span>{name:htmlEncode}</span>","</tpl>","<tpl if=\"type === 'T'\">","<img src=\""+me.imageData.T.src+"\" title=\""+me.imageData.T.alt+"\" class=\"ImgIcoExecutive\" align=\"absmiddle\"/>","<span>{name:htmlEncode}</span>","</tpl>","<tpl if=\"type === 'S1'\">","<img src=\""+me.imageData.S1.src+"\" title=\""+me.imageData.S1.alt+"\" class=\"ImgIcoOrganization\" align=\"absmiddle\"/>","<span>{name:htmlEncode}</span>","</tpl>","<tpl if=\"type === 'S2'\">","<img src=\""+me.imageData.S2.src+"\" title=\""+me.imageData.S2.alt+"\" class=\"ImgIcoUser\" align=\"absmiddle\"/>","<span>{name:htmlEncode}</span>","</tpl>","<tpl if=\"type === 'S3'\">","<img src=\""+me.imageData.S3.src+"\" title=\""+me.imageData.S3.alt+"\" class=\"ImgIcoExecutive\" align=\"absmiddle\"/>","<span>{name:htmlEncode}</span>","</tpl>","</div>","</tpl>"].join("");
Ext.onReady(function(){
me.selector=new Ext.ux.AccountSelector({requestURL:DA.vars.cgiRdir+"/ajx_api.cgi?func=inc_search&app_type="+me.appType+"&user_type="+me.userType+"&group_type="+me.groupType+"&addr_type="+me.addrType+"&read_row="+me.readRow,seletorName:me.textId,userType:me.userType,groupType:me.groupType,addrType:me.addrType,pageSize:me.pageSize,queryDelay:me.queryDelay,listeners:{specialkey:function(t,e){
this.dqTask.cancel();
this.onTriggerClick();
},expand:function(){
this.syncSize();
}},tpl:new Ext.XTemplate(tmpl),afterSelectFuc:function(_286,_287){
if(me.onlyOne){
me.clearItem(1);
}else{
if(me._existsRecord(_286.id)){
me.removeItem(_286.id,1);
}
}
me.addItem(_286);
this.setValue("");
this.collapse();
}});
me.displayNode.onclick=function(){
me.toggleSearch(true);
};
me.hiddenNode.onclick=function(){
me.toggleSearch(false);
};
me.selectorNode.onkeypress=function(_288){
var _289=(BrowserDetect.browser==="Explorer")?window.event.keyCode:_288.which;
if(_289===Event.KEY_RETURN){
return false;
}
};
if(me.initSearch){
me.toggleSearch(true);
}
if(me.denyAdd){
me.searchNode.style.display="none";
me.displayNode.style.display="none";
}
});
},toggleSearch:function(_28a){
if(this.searchNode!==null&&this.displayNode!==null&&this.denyAdd===false){
if(DA.util.isEmpty(_28a)){
if(this.searchNode.style.display==="none"){
this.searchNode.style.display="";
this.displayNode.style.display="none";
}else{
this.textNode.value="";
this.searchNode.style.display="none";
this.displayNode.style.display="";
}
}else{
if(_28a===true){
this.searchNode.style.display="";
this.displayNode.style.display="none";
}else{
this.textNode.value="";
this.searchNode.style.display="none";
this.displayNode.style.display="";
}
}
}
},selectorStatus:function(){
if(this.searchNode!==null&&this.displayNode!==null){
if(this.searchNode.style.display==="none"){
return 0;
}else{
return 1;
}
}else{
return 0;
}
},addItemCustom:null,removeItemCustom:null,extractItemCustom:null,logoutItemCustom:null,clearItemCustom:null,addItem:function(_28b){
var me=this;
var _28d=me.listNode;
var key;
var _28f,_290,_291,_292,_293,_294,_295,_296,_297;
if(_28d!==null){
_28f=document.createElement("li");
_28f.setAttribute("id",me._getId(_28b.id));
_290=document.createElement("img");
for(key in me.imageData[_28b.data.type]){
_290.setAttribute(key,me.imageData[_28b.data.type][key]);
}
_28f.appendChild(_290);
_291=document.createElement("a");
_291.setAttribute("href","#");
if(String(_28b.data.type).match(/^[1-5]/)){
_291.onclick=function(){
me.openUserInfo(_28b.id,"",_28b.data.type);
};
}else{
if(_28b.data.type==="A"){
_291.onclick=function(){
me.openAddrInfo(_28b.id,"");
};
}else{
_291.onclick=function(){
me.openGroupInfo(_28b.id,"");
};
}
}
_291.appendChild(document.createTextNode(_28b.data.name));
_28f.appendChild(_291);
if(_28b.data.tel3){
_28f.appendChild(document.createTextNode(_28b.data.tel3));
}
if(_28b.data.login){
_28f.appendChild(document.createTextNode(_28b.data.login));
if(_28b.data.logout){
_296=document.createElement("a");
_296.setAttribute("href","#");
_296.onclick=function(){
me.logoutItem(_28b.id);
};
_297=document.createElement("img");
for(key in me.imageData.log){
_297.setAttribute(key,me.imageData.log[key]);
}
_296.appendChild(_297);
_28f.appendChild(_296);
}
}
if(me.extractItemCustom&&String(_28b.data.type).match(/^[GPTS]/)){
_292=document.createElement("a");
_292.setAttribute("href","#");
_292.onclick=function(){
me.extractItem(_28b.id);
};
_293=document.createElement("img");
for(key in me.imageData.ext){
_293.setAttribute(key,me.imageData.ext[key]);
}
_292.appendChild(_293);
_28f.appendChild(_292);
}
if(me.denyRemove===false){
_294=document.createElement("a");
_294.setAttribute("href","#");
_294.onclick=function(){
me.removeItem(_28b.id);
};
_295=document.createElement("img");
for(key in me.imageData.del){
_295.setAttribute(key,me.imageData.del[key]);
}
_294.appendChild(_295);
_28f.appendChild(_294);
}
me._hideContents();
me._showList();
_28d.appendChild(_28f);
me._addRecord(_28b.id,_28b.data);
if(me.addItemCustom){
me.addItemCustom(_28b);
}
return true;
}else{
return false;
}
},removeItem:function(id,opt){
var node=$(this._getId(id));
if(node!==null){
this._removeRecord(id);
node.innerHTML="";
node.parentNode.removeChild(node);
if(this.selectedRecord.length===0){
this._showContents();
this._hideList();
}
if(this.removeItemCustom){
this.removeItemCustom(id,opt);
}
}
},extractItem:function(id){
if(this.extractItemCustom){
this.extractItemCustom(id);
}
},logoutItem:function(id){
if(this.logoutItemCustom){
this.logoutItemCustom(id);
}
},clearItem:function(opt){
this.selectedRecord=[];
this.listNode.innerHTML="";
this._showContents();
this._hideList();
if(this.clearItemCustom){
this.clearItemCustom(opt);
}
},recordList:function(s,_29f){
var i,r,a,data="";
if(DA.util.isEmpty(s)){
s="\n";
}
if(!_29f){
_29f=["id","type","sum","name"];
}
for(i=0;i<this.selectedRecord.length;i++){
r=this.selectedRecord[i];
a=[];
_29f.each(function(k){
a.push(r[k]);
});
data+=a.join(":")+s;
}
return data;
},openUserInfo:function(mid,type,_2a7){
if(DA.util.isEmpty(type)){
type="addr";
}
var cgi="/info_card.cgi?type="+type+"&id="+mid;
var _2a9="Info"+mid;
if(!_2a7||this._isOldBrowser()){
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,_2a9,"width=480,height=600,resizable=yes,scrollbars=yes");
}else{
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,"","width=480,height=600,resizable=yes,scrollbars=yes");
}
},openGroupInfo:function(gid,_2ab){
var cgi="/info_card.cgi?type=group&id="+gid;
var _2ad="gInfo"+gid;
if(!_2ab||this._isOldBrowser()){
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,_2ad,"width=500,height=480,resizable=yes,scrollbars=yes");
}else{
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,"","width=500,height=480,resizable=yes,scrollbars=yes");
}
},openAddrInfo:function(aid,_2af){
var cgi="/og_card_addr.cgi?id="+aid;
var Ids=aid.split("-");
var _2b2="aInfo"+Ids[0];
if(!_2af||this._isOldBrowser()){
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,_2b2,"width=450,height=600,resizable=1,scrollbars=1");
}else{
DA.windowController.winOpenCustom(DA.vars.cgiRdir+cgi,"","width=450,height=600,resizable=1,scrollbars=1");
}
},_getId:function(id){
return this.selectorId+"_Id_"+id;
},_isOldBrowser:function(){
var ua=navigator.userAgent;
if(ua.indexOf("MSIE")!==-1){
return true;
}else{
if(ua.indexOf("Mozilla/4")!==-1){
return false;
}else{
return true;
}
}
},_existsRecord:function(id){
var i;
for(i=0;i<this.selectedRecord.length;i++){
if(this.selectedRecord[i].id===id){
return true;
}
}
return false;
},_addRecord:function(id,data){
var hash={};
Object.extend(hash,data);
hash.id=id;
this.selectedRecord.push(hash);
},_removeRecord:function(id){
var _2bb=[];
var i;
for(i=0;i<this.selectedRecord.length;i++){
if(this.selectedRecord[i].id!==id){
_2bb.push(this.selectedRecord[i]);
}
}
this.selectedRecord=_2bb;
},_showContents:function(){
if(this.contentsNode.style.display==="none"){
this.contentsNode.style.display="";
}
},_hideContents:function(){
if(this.contentsNode.style.display!=="none"){
this.contentsNode.style.display="none";
}
},_hideList:function(){
if(this.listNode.style.display!=="none"){
this.listNode.style.display="none";
}
},_showList:function(){
if(this.listNode.style.display==="none"){
this.listNode.style.display="";
}
}});
if(!DA){
throw "ERROR: missing DA.js or DA-min.js";
}
if(!DA.ug){
DA.ug={};
}
DA.ug.AccountController=function(_2bd,cfg,cbh){
this.init(_2bd,cfg,cbh);
};
DA.ug.AccountController.prototype={cfg:null,cbh:null,init:function(_2c0,cfg,cbh){
this.incSearch=_2c0;
this.cfg=cfg?Object.extend({},cfg):{};
this.cbh=cbh?Object.extend({},cbh):{};
},openUsersel:function(){
var _2c3=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_api.cgi");
var me=this;
_2c3.callback=function(o){
if(o.error){
DA.util.error(me.cfg.errCode[o.error]);
}else{
if(DA.util.isFunction(me.cbh.onOpened)){
me.cbh.onOpened(o);
}
}
};
_2c3.errorHandler=function(o){
DA.util.warn(me.cfg.errCode.ERR_SYS_000000);
};
_2c3.execute({proc:"usersel_open",proc_no:me.cfg.proc_no,usersel:this.incSearch.recordList("|",["id","sum"])});
},closeUsersel:function(_2c7){
var _2c8=new DA.io.JsonIO(DA.vars.cgiRdir+"/ajx_api.cgi");
var me=this;
_2c8.callback=function(o){
var i;
if(o.error){
DA.util.error(me.cfg.errCode[o.error]);
}else{
me.incSearch.clearItem();
if(DA.util.isArray(o.selectedItems)){
for(i=0;i<o.selectedItems.length;i++){
me.incSearch.addItem({id:o.selectedItems[i].id,data:{type:o.selectedItems[i].type,name:o.selectedItems[i].name,tel3:o.selectedItems[i].tel3,sum:o.selectedItems[i].sum}});
}
}
if(DA.util.isFunction(me.cbh.onClosed)){
me.cbh.onClosed(o);
}
}
};
_2c8.errorHandler=function(o){
DA.util.warn(me.cfg.errCode.ERR_SYS_000000);
};
_2c8.execute({proc:"usersel_close",proc_no:me.cfg.proc_no,extension:_2c7||false});
}};
if("undefined"===typeof DA){
alert("ERROR: need DA.js (or DA-min.js)");
}else{
if(!DA.scheduler){
DA.scheduler={};
}
}
if(!DA||!DA.scheduler){
throw "Error: Missing dependencies: (need: DA.js, scheduler.js";
}
if(!DA.widget.TimeRangeSlider||!DA.cal.DateRangeSelector){
throw "Error: Missing dependencies: (need: calendar/rangeselector.js, calender/timerangeslider.js";
}
(function(){
var isN=function(n){
return typeof parseInt(n,10)==="number";
};
var cmpN=DA.util.cmpNumber;
DA.scheduler.EditPage={init:function(_2d0){
if(!_2d0||!_2d0.rangeSelector){
throw "Error: Bad Params: need rangeSelector";
}
this.dateRangeSelector=new DA.cal.DateRangeSelector(_2d0.rangeSelector);
if(_2d0.timeRangeSlider){
this.timeRangeSlider=new DA.widget.TimeRangeSlider(Ext.apply({},_2d0.timeRangeSlider,{scale:3,resolution:5,minValue:0,maxValue:24,orientation:"horizontal",plugins:new DA.widget.TimeRangeSliderTip()}));
this.timeRangeSlider.on("change",this.onSliderChange,this);
}
this.dateRangeSelector.on("change",this.onDateRangeChange,this);
this.dateRangeSelector.on("enabled",this.onSomethingEnabled,this);
this.dateRangeSelector.on("disabled",this.onSomethingDisabled,this);
this._setupViewPort();
},_determineWidthOffset:function(){
var vpw=this.simpleViewPort.getBox().width;
var _2d2=Ext.lib.Dom.getViewWidth();
this._widthOffset=_2d2-vpw;
},_setupViewPort:function(){
if(!this.timeRangeSlider){
return;
}
this.simpleViewPort=new DA.widget.SimpleViewPort({renderTo:this.timeRangeSlider.container,scrollDistance:144,style:{border:"1px solid #888",height:"36px",width:"400px"},maxWidth:864,items:[this.timeRangeSlider]});
(function(){
this._resizeViewPort();
this.simpleViewPort.fitToParentWidth();
this.timeRangeSlider._fixLimits();
this._determineWidthOffset();
}).defer(10,this);
this.simpleViewPort.on("enable",function(){
this.timeRangeSlider.enable();
},this);
this.simpleViewPort.on("disable",function(){
this.timeRangeSlider.setValues(0,0);
this.timeRangeSlider.disable();
},this);
Ext.EventManager.onWindowResize(this.handleWindowResize,this);
},_resizeViewPort:function(){
var s_h=this.dateRangeSelector.startDateSelector.hhSelector.getValue();
var s_m=this.dateRangeSelector.startDateSelector.miSelector.getValue();
var e_h=this.dateRangeSelector.endDateSelector.hhSelector.getValue();
var e_m=this.dateRangeSelector.endDateSelector.miSelector.getValue();
if(e_h==="--"){
e_h="24";
e_m=0;
}
var _2d7=parseInt(s_h,10)*60+parseInt(s_m,10);
var end=parseInt(e_h,10)*60+parseInt(e_m,10);
if(end>_2d7&&(s_h<8||(e_h==="23"&&e_m>0)||e_h==="24")){
this.simpleViewPort.doScrollLeft(null,null,parseInt((_2d7+end)/2/60,10)/4-2,true);
}else{
this.simpleViewPort.doScrollLeft(null,null,2,true);
}
},handleWindowResize:function(w,h){
var svp=this.simpleViewPort;
var svpW=w-this._widthOffset;
svp.setWidth(svpW);
svp.fitToParentWidth();
this._resizeViewPort();
},onSomethingEnabled:function(adj,noun){
if(noun==="Time"&&this.simpleViewPort){
this.simpleViewPort.enable();
}
},onSomethingDisabled:function(adj,noun){
if(noun==="Time"&&this.simpleViewPort){
this.simpleViewPort.disable();
}
},onDateRangeChange:function(_2e1,end){
this.isSameDay=cmpN(_2e1.yy,end.yy)&&cmpN(_2e1.mm,end.mm)&&cmpN(_2e1.dd,end.dd);
var trs=this.timeRangeSlider;
if(!trs){
return;
}
if(!this.isSameDay&&this.simpleViewPort){
this.simpleViewPort.disable();
return;
}
var sVal={HH:_2e1.hh,MM:_2e1.mi};
var eVal={HH:end.hh,MM:end.mi};
this.simpleViewPort.enable();
trs.setValues(this._roundTo5Mins(sVal),this._roundTo5Mins(eVal));
},_roundTo5Mins:function(_2e6){
var mm=_2e6.MM;
var hh=_2e6.HH;
mm=Math.round(mm/5)*5;
if(mm>=60){
hh++;
mm=0;
}
return {HH:hh,MM:mm};
},clearTime:function(){
this.dateRangeSelector.startDateSelector.resetTime();
this.dateRangeSelector.endDateSelector.resetTime();
this.dateRangeSelector.setValue({hh:"--",mi:"--"},{hh:"--",mi:"--"},true);
if(this.timeRangeSlider){
this.timeRangeSlider.setValues(0,0);
}
},disableAll:function(){
this.dateRangeSelector.startDateSelector.disableAll();
this.dateRangeSelector.endDateSelector.disableAll();
if(this.timeRangeSlider){
this.timeRangeSlider.disable();
}
},onSliderChange:function(_2e9,end){
this.dateRangeSelector.setValue({hh:_2e9.HH,mi:_2e9.MM},{hh:end.HH,mi:end.MM});
this.dateRangeSelector.changeWithoutFireEvent();
}};
})();

