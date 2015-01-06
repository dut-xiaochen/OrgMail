
DA.dlg ={
	DlgItemObj     : undefined,
	ItemObj        : undefined,
	crtItemType    : undefined,
	crtDlgName     : undefined,
	ajaxErrorMsg   : '',
	remove_btn_src : DA.vars.imgRdir +"/mo_btn_remove.png",
	output         : [],
};

$(document).ready(function(){
	initObjList();
});

function initObjList(){
	DA.dlg.DlgItemObj = {};
	DA.dlg.ItemObj    = {};
}

function initDlgItemObj(itemType,dlgName,param){

	//if( 'object' == typeof(DA.dlg.DlgItemObj[dlgName])) return 0;
	
	switch(itemType){
		case "user"  : 
			DA.dlg.DlgItemObj[dlgName] = new UserSelectDlg(dlgName,param);
			break;
		case "fa":
			DA.dlg.DlgItemObj[dlgName] = new FaSelectDlg(dlgName,param);
			break;
		case "address":
			DA.dlg.DlgItemObj[dlgName] = new AddrSelectDlg(dlgName,param);
			break;
	}
	return 1;
}

function initItemObj(itemType,dlgName,hidden, funcHash,param){
	
	switch(itemType){
		case "user"  : 
			DA.dlg.ItemObj[dlgName]   = new UserSelect(dlgName,hidden,funcHash,param);
			break;
		case "fa":
			DA.dlg.ItemObj[dlgName]   = new FaSelect(dlgName,hidden,funcHash, param);
			break;
		case "address":
			DA.dlg.ItemObj[dlgName]   = new AddrSelect(dlgName,hidden, funcHash,param);
			break;
	}
	return 1;
}

function getDlgObj(dlgName){
	if( !dlgName ){
		dlgName = DA.dlg.crtDlgName;
	}
	return DA.dlg.DlgItemObj[dlgName];
}

function getItemObj(dlgName){
	if( !dlgName ){
		dlgName = DA.dlg.crtDlgName;
	}
	return DA.dlg.ItemObj[dlgName];
}

function setCurrentItem(itemType, dlgName){
	DA.dlg.crtItemType  = itemType;
	DA.dlg.crtDlgName   = dlgName;
	
}

DA.Select  = { 
	
	Done:function (dlgName,itemType,from){
		
		if( from === 'itemPage' ){
			syncDlg2Item(dlgName);
		}
		var ItemObj  = getItemObj(dlgName);
		ItemObj.addAllViewItem();
		
		if( itemType ==='address' ){
			var outputData = [];
			
			jQuery.each(ItemObj.dataList, function(){
				tmpId = this.id;
				switch( this.type ){
					case "AD": tmpId = tmpId.replace(/aid\-/,'');break;
					case "BK": tmpId = tmpId.replace(/aid\-/,'');break;
					case "ML": tmpId = tmpId.replace(/ml\-/,'');break;
				}
				outputData.push(jQuery.extend({}, this, { id: tmpId }));
			});
			
		}
		
		if( from === 'itemPage' ){
			if( ItemObj.funcHash ) {
				if( typeof(ItemObj.funcHash.onSelected) === 'function' ){
					ItemObj.funcHash.onSelected();
				}
			}
		}
	},
	
	InitSelectItem : function (itemType,dlgName,hidden,defaultItem, funcHash, param){
		
		//init Item Object
		initItemObj(itemType, dlgName, hidden, funcHash, param);
		initDlgItemObj(itemType, dlgName,  param);
		
		if( DA.dlg.output[itemType] === undefined ){
			DA.dlg.output[itemType] = []; 
		}
		DA.dlg.output[itemType][dlgName] = [];
		
		setCurrentItem(itemType, dlgName);
		
		if ( typeof(defaultItem) === 'object' ) {
			var tmpDataList      = [];
			
			for(var i=0;i< defaultItem.length;i++){
				tmpDataList[i] = {};
				tmpDataList[i]['id']   = defaultItem[i]['id'];
				tmpDataList[i]['name'] = defaultItem[i]['name'];
				tmpDataList[i]['type'] = defaultItem[i]['type'];
				tmpDataList[i]['icon'] = defaultItem[i]['icon'];
				if(itemType == 'address' ){
					tmpDataList[i]['mail'] = defaultItem[i]['mail'];
				}else if(itemType == 'fa'){
					tmpDataList[i]['fgid'] = defaultItem[i]['fgid'];
				}
			}
			getItemObj(dlgName).update_list(tmpDataList);
		} else {
			getItemObj(dlgName).update_list( []);
		}
		
		
		getItemObj(dlgName).addAllViewItem();
		
		// 
		//syncItem2Dlg();
		
		getItemObj(dlgName).setNewOpenFlg(1);
	},
	
	getOutPut : function(itemType, dlgName, param){
		
		var ItemObj    = getItemObj(dlgName);
		var outputData = [];
		var idList    = [];
		
		if( itemType === 'address' ) {
			jQuery.each(ItemObj.dataList, function(){
					tmpId = this.id;
					switch( this.type ){
						case "AD": tmpId = tmpId.replace(/aid\-/,'');break;
						case "BK": tmpId = tmpId.replace(/aid\-/,'');break;
						case "ML": tmpId = tmpId.replace(/ml\-/,'');break;
					}
					if( param && param.mode ==='list' ){
						idList.push(tmpId);
					}else{
						outputData.push(jQuery.extend({}, this, { id: tmpId }));
					}
			});
		} else {
			jQuery.each( ItemObj.dataList, function(k,v){
				if( param && param.mode ==='list' ){
					idList.push(v[param.col]);
				}else{
					outputData.push(v);
				}
			});
			// outputData  = clone(ItemObj.dataList);
		}
		
		if( param && param.mode === 'list' ){
			return ( idList.join(',') );
		}else{
			return outputData;
		}
	},

	goBackPage : function(){
		var ItemObj  = getItemObj();
		if( ItemObj.funcHash ) {
			if( typeof(ItemObj.funcHash.onBack) =='function' ){
				ItemObj.funcHash.onBack();
			}
		}

	},
	
}



function syncDlg2Item(dlgName){
	var DlgObj   = getDlgObj(dlgName);
	var ItemObj  = getItemObj(dlgName);
	ItemObj.update_list(DlgObj.dataList, DlgObj.param);
	
}

/**
function syncItem2Dlg(){
	var DlgObj   = getDlgObj();
	var ItemObj  = getItemObj();
	DlgObj.update_list(ItemObj.dataList, ItemObj.param);
}**/

function clearDlg(){
	var DlgObj   = getDlgObj();
	DlgObj.dataList = [];
}


function DlgCallBack(name){
	switch(name){
		case "showModalDlg" : if( typeof( CBP_showModalDlg ) == 'function' ){ CBP_showModalDlg(); } break;
		case "hideModalDlg" : if( typeof( CBP_hideModalDlg ) == 'function' ){ CBP_hideModalDlg(); } break;
	}
}



function refreshList(){
	//return ;
	//console.log("refreshList");
	var itemType     = DA.dlg.crtItemType;
	var dlgName      = DA.dlg.crtDlgName;
	var selectedList = getDlgObj().dataList;
	var itemObjList  = [];
	var i;
	var len = $('.item_class').length;
	
	for(i=0;i<len;i++){
		itemObjList.push($('.item_class:eq('+i+')'));
	}
	
	for(i=0;i<len;i++){
		var k = itemObjList[i].attr('id').replace( dlgName+"_","");
		var checked = 0;
		var len2 = selectedList.length;
		
		for(var j=0;j<len2;j++){
			if(selectedList[j].id ==k  ){
				
				setChkOnColor(itemObjList[i].attr('id'));
				
				checked = 1;
				break;
			}
		}
		if(!checked){
			setChkOffColor(itemObjList[i].attr('id'));
		}
	}
}

function UserSelect(htmlId, hiddenName, funcHash, param){
	
	ItemSelect.call(this, htmlId, hiddenName, funcHash, param);
	

}

function FaSelect(htmlId, hiddenName, funcHash, param){
	
	ItemSelect.call(this, htmlId, hiddenName, funcHash, param);
	

}

function AddrSelect(htmlId,hiddenName, funcHash, param){
	
	ItemSelect.call(this, htmlId, hiddenName, funcHash, param);
	
	this.addAllViewItem = function(){
	
		var targetHtml = $("#"+this.targetHtmlId);
		if( targetHtml.size() < 1) { return ;}
	
		$("#"+this.targetHtmlId).empty();
		
		var addData="";
		for(var i=0; i<this.dataList.length; i++  ){
			addData +=this.addViewItem( this.dataList[i].id  ,this.dataList[i].name, this.dataList[i].icon, this.dataList[i].mail);
		}
		targetHtml.append(addData);
		
	}

	
	this.addViewItem = function(key,name,icon,mail){
		
		var entry ="";
		if(icon){
			entry += icon;
		}
		var delIco;
		delIco ="<a onClick=\"return getItemObj('"+this.targetHtmlId+"').removeViewItem('"+key+"')\" class=\"DA_item_remove_class\">";
		delIco +="remove</a>";
		entry = entry.replace("<span ", "<span id=\""+ this.itemHtmlId + key +"\"" );
		entry = entry.replace("</span>", delIco + "</span>" );
		return entry;
		
		
		
	}
}

function ItemSelect(htmlId,hiddenName, funcHash, param){
	
	this.dataList         = [];
	this.param            = param;
	this.targetHtmlId     = htmlId ;
	this.hiddenName       = hiddenName;
	this.itemHtmlId       = "SELECT_ITEM_"+this.targetHtmlId+"_";
	this.itemHiddenHtmlId = this.itemHtmlId + "hidden";
	this.dataListEditFlg  = 0;
	this.newOpen          = 0;
	this.funcHash         = funcHash;

	this.getNewOpenFlg =function(){
		return this.newOpen;
	}
	
	this.setNewOpenFlg = function(Flg){
		this.newOpen = Flg;
	}
	
	this.update_list = function(data,param){
		
		if( typeof(data) =='object'){
			
			if( 0 < data.length ){
				if( this.param && this.param.mode ==='single' ){
					this.dataList = data;
				}else{
					itemListMerge( data, this.dataList);
				}
			}
		}
	}
	
	this.setEditFlg =function(Flg){
		this.dataListEditFlg=Flg;
	}
	
	this.getEditFlg =function(){
		return this.dataListEditFlg;
	}

	this.remove = function(key){
		var pos  = this.exists(key);
		if( 0 <= pos){
			this.dataList.splice(pos,1);
		}
		return 1;
	}
	
	this.removeViewItem = function(key){
		
		if ( confirm(DA.vars.deleteMsg) ) {
		
			$('#'+this.itemHtmlId+key).remove();
			this.remove(key);
			
			if( this.funcHash && typeof( this.funcHash) === 'object' &&  typeof( this.funcHash.onDeleted)  === 'function' ){
				this.funcHash.onDeleted();
			}
			this.dataListChanged();
		} else { return false; } ;
	}

	this.dataListChanged = function(){
		switch(this.targetHtmlId){
			case "DA_schedule_edit_Fa"  : 
				if(this.dataList.length>0){
					$("#DA_schedule_edit_fa_Update").show();
				}else{
					$("#DA_schedule_edit_fa_Update").hide();
				}
				break;
		}
	}
	
	this.add = function(key,name,icon,mail){
		if( DA.util.isEmpty(key) ) key  = "_free_addr_" + this.dataList.length;;
		if( DA.util.isEmpty(name) ) name  = mail;
		this.dataList.push({ 'id': key, 'name' : name, 'icon' : icon , 'mail' :mail, 'type': 'ETC' });
		
		
	}
	
	this.exists = function(key){
		for(var i=0; i<this.dataList.length; i++  ){
			if (this.dataList[i].id == key){ return i}
		}
		return -1;
	}
	
	this.addAllViewItem = function(){
	
		var targetHtml = $("#"+this.targetHtmlId);
		if( targetHtml.size() < 1) { return ;}
	
		$("#"+this.targetHtmlId).empty();
		
		var addData="";
		for(var i=0; i<this.dataList.length; i++  ){
			addData +=this.addViewItem( this.dataList[i].id  ,this.dataList[i].name, this.dataList[i].icon );
		}
		targetHtml.append(addData);
		
		//this.updateHidden();

		if( typeof( this.endFunc ) === 'function') {
			this.endFunc();
		}
		this.dataListChanged();
	}
	
	this.addViewItem = function(key,name,icon){
		
		var entry ="";
		if(icon){
			entry += DA.util.decode(icon);
		}
		var delIco;
		delIco ="<a onClick=\"return getItemObj('"+this.targetHtmlId+"').removeViewItem('"+key+"')\" class=\"DA_item_remove_class\">";
		delIco +="remove</a>";
		//this.itemHtmlId       = "SELECT_ITEM_"+this.targetHtmlId+"_";

		entry = entry.replace("<span ", "<span id=\"SELECT_ITEM_"+this.targetHtmlId+"_"+key+"\"" );
		entry = entry.replace("</span>", delIco + "</span>" );
		return entry;
	}

	this.deleteHidden = function(){
		
		var delList = [];
		delList.push(this.itemHiddenHtmlId+"_id");
		delList.push(this.itemHiddenHtmlId+"_name");
		delList.push(this.itemHiddenHtmlId+"_type");
		
	}
	
}

function UserSelectDlg(htmlId, param){
	ItemSelectDlg.call(this, htmlId, param);
	
	//this.currentTab="ug_regist";
	//this.infoTab = [];
	
}

function FaSelectDlg(htmlId, param){
	ItemSelectDlg.call(this, htmlId, param);
	
	this.add = function(key,name,icon,fgid,type){
		this.dataList.push({
			id: key,
			name: name || '',
			icon: icon || '',
			fgid: fgid || '',
			type: type
		});
	}
	
	this.ChangeItem = function(html_id,key,name,type,icon,fgid){
		var item = $("#" + html_id);
		var chk   = item.data('checked');
		if ( !chk ){
			if( this.exists(key) < 0 ){
				this.add(key,name,icon,fgid,type);
			}
			item.data('checked',true);
			setChkOnColor(html_id);
		}else{
			this.remove(key);
			item.data('checked',false);
			setChkOffColor(html_id);
		}
	}
}

function AddrSelectDlg(htmlId, param){
	ItemSelectDlg.call(this, htmlId, param);
	
	//this.currentTab="ug_regist";
	//this.infoTab = [];
	this.add = function(key,name,icon,mail,type){
		this.dataList.push({
			id: key,
			name: name || '',
			icon: icon || '',
			mail: mail || '',
			type: type
		});
	}
	
	this.ChangeItem = function(html_id,key,name,type,icon,mail){
		var item = $("#" + html_id);
		//var itemP = item.parent();
		var chk   = item.data('checked');
		if ( !chk ){
			if( this.exists(key) < 0) {
				this.add(key,name,icon,mail,type);
			}
			item.data('checked',true);
			setChkOnColor(html_id);
		}else{
			this.remove(key);
			item.data('checked',false);
			setChkOffColor(html_id);
		}
	}
}


function ItemSelectDlg(htmlId, param){

	this.dataList     = [];
	this.param        = param;
	this.targetHtmlId = htmlId ;
	this.itemHtmlId   = "SELECT_ITEM_"+this.targetHtmlId+"_";
	
	this.update_list = function(data,param){
		//var tmp = data;
		if( typeof(data) =='object'){
            var len=data.length;
		    this.dataList = [];
		    for(var i=0;i<len;i++){
			    this.dataList.push(data[i]);
			}
			//this.dataList = data.concat();
		}
		this.param = clone(param);
	}
	
	this.add = function(key,name,type,icon){
		this.dataList.push({
			id: key,
			name: name,
			icon: icon,
			type: type
		});
	}
	
	this.remove = function(key){
		var pos  = this.exists(key);
		if( 0 <= pos){
			this.dataList.splice(pos,1);
		}
		return 1;
	}
	
	this.removeAll = function(){
		this.dataList = [];
	}
	
	this.exists = function(key){
		for(var i=0; i<this.dataList.length; i++  ){
			if (this.dataList[i].id == key){ return i}
		}
		return -1;
	}
	
	this.ChangeItem = function(html_id,key,name,type,icon){
		var item = $("#"+html_id);
		var chk   = item.data('checked');
		if ( !chk ){
			
			if( this.param && this.param.mode === 'single' ){
				var thtmlId = this.targetHtmlId;
				jQuery.each( this.dataList , function(k,v){
					setChkOffColor( thtmlId + "_" + v.id );
					$("#" + thtmlId + "_" + v.id).data('checked', false);
					
				});
				this.removeAll();
			}
			if( this.exists(key) < 0 ){
				this.add(key,name,type,icon);
			}
			item.data('checked', true);
			setChkOnColor(html_id);
			
		}else{
			this.remove(key);
			item.data('checked', false);
			setChkOffColor(html_id);
		}
	}
}


function setChkOnColor(id){
	var itemP = $("#" + id );
	//itemP.css('background','#1a4c8b');
	itemP.css('background','url(' + DA.vars.imgRdir +'/DA_ico_check.png) no-repeat');
	itemP.css('background-position','right');
}

function setChkOffColor(id){
	var itemP = $("#" + id);
	//itemP.css('background','#000000');
	itemP.css('background','none');
}

function setCheckedColor(item){
	
	return 1;

	if(typeof(item) !="object"){
		item=$("#"+item);
	}

	var chk = item.attr('checked');
	if( chk ){
		setChkOnColor(item);
	}else{
		setChkOffColor(item);
	}
}


// 
function itemListComp(a,b){
	a = a.sort(id_com);
	b = b.sort(id_com);
	var len = a.length; 
	if(len != b.length) return 1; 
	for(var i=0;i<len;i++){ 
		if(a[i].id != b[i].id){return 2} 
	}
	return 0; 
}

function itemListMerge(a, b){
	a = a.sort(id_com);
	b = b.sort(id_com);
	//var alen = a.length; 
	//if(len != b.length) return 1; 
	jQuery.each( a,function(ak,av){
	//for(var i=0;i<len;i++){ 
		//if(a[i].id != b[i].id){return 2} 
		var exists=0;
		jQuery.each( b,function( bk, bv){
			if( av.id === bv.id ){
				exists =1;
				return;
			}
		});
		
		if( exists === 0){
			b.push( av );
		}
	});
	return 0; 
}


function id_com(a, b) {
	return b.id - a.id;
}

/**
function encode(str){
	if(!str)return '';

	str = str.replace(/&/g,"&amp;");
	str = str.replace(/</g,"&lt;");
	str = str.replace(/>/g,"&gt;");
	str = str.replace(/"/g,"&quot;");
	str = str.replace(/'/g,"&#039;");
	return str;
}

function decode(str){
	if(!str)return '';

	str = str.replace(/&amp;/g,  "&");
	str = str.replace(/&lt;/g,   "<");
	str = str.replace(/&gt;/g,   ">");
	str = str.replace(/&quot;/g, '"');
	str = str.replace(/&#039;/g, "'");
	return str;
}
**/

function clone(obj) {
	var f = function(){};
	f.prototype = obj;
	return new f;
}

function toggleSelect(my,val,target){
	
	var flg = false;
	if( val == $("#"+my).val() ){
		flg=true;
	}
	
	if(flg){
		$("#"+target).show();
	}else{
		$("#"+target).hide();
	}
	
}
