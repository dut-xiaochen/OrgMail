
DA.widget.touchMenu = {

	TMKeepCount 	: 0,	
	TMKeepCountMax	: 50,	
	TMKeepSec		: 10,	
	TMtouchOutCount : 0,
	TMtouchKeepFlg	: 0,	
	TMLastMenuId	: -1,	
	TMShowFlg		: 0,	
	TMLeft			: 0,	
	TMTop			: 0,	
	TMTargetList	: {},	
	TMObjId			: '',	
	TMSize			: 200,	
	TMTargetId		: '',	
	TMEndFunc		: '',	
	TMShowSec       : 200, 
	TMMenuList      : [],
	TMmenuObj       : '',
	targetObj       : '',
	targetDefaultHref    : '',
	targetDefaultonClick : '',
	

	Init : function(MenuId, TargetList, menuList, EndFunc){
		
		this.TMObjId   = MenuId;
		
		this.TMEndFunc = EndFunc;
		
		this.TMTargetList.MenuId = [];
		this.TMTargetList.MenuId = TargetList;
		
		this.TMmenuObj = $("#" + this.TMObjId);
		
		this.TMMenuList = menuList;
		
		this._setMenu();
		
		document.addEventListener("touchstart", DA.widget.touchMenu.HandlerTouchMenu, false);
		document.addEventListener("touchmove",  DA.widget.touchMenu.HandlerTouchMenu, false);
		document.addEventListener("touchend",   DA.widget.touchMenu.HandlerTouchMenu, false);
		
		return this;
	},
	

	
	addTarget : function( TargetList ){
		var MenuId = this.TMObjId;
		var targetList = this.TMTargetList.MenuId;
		
		jQuery.each( TargetList, function(key,value){
			targetList.push(value);
		});
	},

	chkObjTMTriger : function(Id){
		var res = 0;
		var MenuId = this.TMObjId;
		var targetList = this.TMTargetList.MenuId;
		jQuery.each( targetList, function(key,value){
			//console.log("check target :"  + value);
			if ( Id == value  && res == 0) { 
				res =  1 ;
			}
		});
		return res; 
	},

	HandlerTouchMenu : function(e) {
		
		if( DA.widget.touchMenu.TMShowFlg ){
			event.preventDefault();
		}
		
		
		var targetId;
		if(! (targetId = $(e.target).attr('touch_menu_id')) ){
			targetId = $(e.target).closest("li").attr('touch_menu_id');
		}
		var touch = e.touches[0];
		switch( e.type ){
			case "touchstart":
				if( DA.widget.touchMenu.TMShowFlg ){
					DA.widget.touchMenu.closeTM();
				}
				if( ! targetId ) { break; }
				if( DA.widget.touchMenu.chkObjTMTriger( targetId ) ){
					//console.log("target found : " + targetId );
					DA.widget.touchMenu.TMTargetId   = targetId;
					DA.widget.touchMenu.TMLeft       = touch.pageX;
					DA.widget.touchMenu.TMTop        = touch.pageY;
					DA.widget.touchMenu.TMtouchKeepFlg   = 1;
					DA.widget.touchMenu.targetObj = $(e.target).closest("li");
					//console.log(DA.widget.touchMenu.targetObj);
					setTimeout(" DA.widget.touchMenu._touchKeep()", DA.widget.touchMenu.TMKeepSec);
				}else{
					//console.log("no target : " + targetId );
				}
				break;
			case "touchmove":
				if( DA.widget.touchMenu.TMShowFlg ){
					var currentMenuNum  = DA.widget.touchMenu._touchPosMenu(touch.pageX, touch.pageY, DA.widget.touchMenu.TMLeft, DA.widget.touchMenu.TMTop);
					
					if ( 0 <= currentMenuNum ){
						
						var tmpItem = DA.widget.touchMenu._getMenuAttr(currentMenuNum);
						var menuId = tmpItem.id;
						//console.log(menuId);
						if( DA.widget.touchMenu.TMLastMenuId != menuId ){
						
							//console.log("change item");
							DA.widget.touchMenu._setColorTM( menuId );
							//$("#dest").attr('value',menuId);
							
						}
						DA.widget.touchMenu.TMLastMenuId = menuId;
					} else {
						DA.widget.touchMenu.closeTM();
						
					}
					//$("#pagex").attr('value',touch.pageX);
					//$("#pagey").attr('value',touch.pageY);
				}
				break;
			case "touchend":
				if( DA.widget.touchMenu.closeTM() ){
						var targetObj =  DA.widget.touchMenu.targetObj ;
						//var TM = DA.widget.touchMenu;
						if( 0< targetObj.length){
							if ( 0 < targetObj.children("a").length ) {
								
								targetObj.children("a").one('click',function(){ return false; });
							}
						}
					
					if( DA.widget.touchMenu.TMLastMenuId !=='cancel' ) { 
						DA.widget.touchMenu.TMEndFunc(DA.widget.touchMenu.TMTargetId, DA.widget.touchMenu.TMLastMenuId);
					}
				}
				DA.widget.touchMenu.TMtouchKeepFlg  = 0;
				DA.widget.touchMenu.TMKeepCount     = 0;
				return false;
			break;
		}
		
		return false;
	},

	_touchPosMenu : function (x, y, left, top){
		x -=0;
		y -=0;
		//console.log("call touchPosMenu");
		var dest=-1;
		var TMmenuObj = $("#" + this.TMObjId );
		//console.log(this.TMObjId);
		
		//var menuW = DA.util.getNumber( TMmenuObj.css('width'));
		//var menuH = DA.util.getNumber( TMmenuObj.css('height'));
		
		var width   = 150;
		var height  = this.TMMenuList.length * 50;
		
		left = DA.util.getNumber( TMmenuObj.css('left')) - 0;
		top = DA.util.getNumber( TMmenuObj.css('top')) - 0;
		
		
		//if( size <= 0 ) { return dest ; } 
		if( x < left || left + width < x   ) { return dest; }
		if( y < top  || top  + height < y   ) { return dest; }
		//console.log(x + ":" + left + ":" + width);
		//console.log(y + ":" + top + ":" + height);
		
		x = x - left;
		y = y - top;
		
		dest =  Math.floor(y / 50);
		
		//console.log(dest);
		
		return dest;
		
	},

	closeTM : function(){
		if ( this.TMShowFlg ){
			var TMmenuObj = $("#" + this.TMObjId );
			TMmenuObj.hide();
			this.TMShowFlg   = 0;
			return 1;
		}
		return 0;
	},

	openTM : function(){
		if ( !this.TMShowFlg ){
			//console.log("call openTM");
			var TM = DA.widget.touchMenu;
			if(TM.targetObj){
				if ( 0 < TM.targetObj.children("a").length ) {
					
					TM.targetObj.children("a").one('click',function(){ return false; });
					
				}
			}
			
			var ps = DA.util.getPageSize();
			//console.log(ps[0] +":" + ps[1]);
			var height  = this.TMMenuList.length * 50;
			var width   = 150;
			
			var menuLeft = TM.TMLeft - height / 2;
			var menuTop  = TM.TMTop  - width / 2;
			
			
			if( menuLeft < 0 ) menuLeft = 10;
			if( menuTop < 0 ) menuTop   = 10;
			
			if ( ps[0] < menuLeft + width ) {
				menuLeft = ps[0] - width - 50;
			}

			if ( ps[1] < menuTop + height ) {
				menuTop = ps[1] - height - 50;
				
			}
			
			//console.log(menuTop);
			
			TM.TMLeft  = menuLeft;
			TM.TMTop   = menuTop;
			
			var TMmenuObj = $("#" + TM.TMObjId );
			TMmenuObj.css('top',  menuTop + "px" );
			TMmenuObj.css('left', menuLeft + "px");
			
			TM._setColorTM(0);
			//console.log(  );
			//$("#" + TM.TMObjId ).length
			TMmenuObj.show(TM.TMShowSec);
			//console.log(TMmenuObj.css('top'));
			//console.log(TMmenuObj.css('left'));
			TM.TMKeepCount = 0;
			TM.TMShowFlg = 1;
		}
	},

	_touchKeep : function(){
		//console.log('_touchKeep :' + TMKeepCount);
		
		if(!this.TMtouchKeepFlg) { return false; }
		if(this.TMShowFlg)       { return false; }
		
		if( this.TMKeepCount < this.TMKeepCountMax ){ 
			this.TMKeepCount++;
			setTimeout("DA.widget.touchMenu._touchKeep()", this.TMKeepSec );
		}else{
			this.openTM();
		}
	},

	_touchOut : function(){
		//console.log('_touchKeep :' + TMKeepCount);
		
		if( !this.TMShowFlg ) { return false; }
		
		if( this.TMtouchOutCount < this.TMKeepCountMax ){ 
			this.TMtouchOutCount++;
			setTimeout("_touchOut()", this.TMKeepSec );
		}else{
			this.closeTM();
		}
	},

	_setColorTM : function(exId){
		
		//console.log(exId);
		
		$("#" + this.TMObjId +" div").removeClass('DA_touchmenu_select_class');
		
		var fTarget  = $("#DA_touchMenu_item_" + exId);
		
		fTarget.addClass('DA_touchmenu_select_class');
	},

	_setMenu: function(menuId , menuList){
		
		if ( $("#" + this.TMObjId).length  <= 0) {
			
			var menu ='';
			jQuery.each( this.TMMenuList, function(k,v){
				menu +='<div class="DA_touchmenu_class" id="DA_touchMenu_item_' + v.id +'">' + v.title +'</div>\n';
				
			});
			
			$("body").append('<div id="' + this.TMObjId + '" class="CP" style="display: none; position:absolute;z-index: 5;">' + menu +'</div>');
		}
		
	},
	
	_getMenuAttr : function(menuNum){
		//console.log(menuNum);
		return  this.TMMenuList[menuNum];
	}
	
};
