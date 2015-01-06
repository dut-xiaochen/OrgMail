DA.address ={
	debug : 0,
	launcherClick: function(func,sub,param ){
			if (this.debug) console.log("launcherClick");
			
			this.goList();
	},
	
	BackFromSelect: function(){
		DA.param.address.back="";
	},
	
	setListLabel: function(target){
		if(target ==='ug_regist'){
			$("#DA_address_list_label_ug").show();
			$("#DA_address_list_label_default").hide();
			
		}else{
			$("#DA_address_list_label_ug").hide();
			$("#DA_address_list_label_default").show();
			
		}
	},
	
	setKeywordArea : function(cnd){
		if ( cnd === 'on' ){
			$('#DA_address_search_keyword').show();
			$('#DA_address_search_btn').show();
		}else{
			$('#DA_address_search_keyword').hide();
			$('#DA_address_search_btn').hide();
		}
		
	},
	
	chgTarget : function(){
		var target = $('#select_target').val();
		this.jsonConExecute('list',{ 'target': target });
	},
	
	// 
	setTargetPullDown : function(itemType){
		if (this.debug)  console.log("setTargetPullDown");
		
		if( itemType  === 'address' ){
			$('#select_target_4mail').css('display','inline');
			$('#select_target_4ug').hide();
			$('#select_target_4fa').hide();
		}else if( itemType  =='fa' ){
			$('#select_target_4mail').hide()
			$('#select_target_4ug').hide();
			$('#select_target_4fa').css('display','inline');
		}else{
			$('#select_target_4mail').hide();
			$('#select_target_4ug').css('display','inline');
			$('#select_target_4fa').hide();
		}
	},
	
	// 
	setBackPage : function (backId,dlgName,itemType){
		
		$("#DA_address_list_ok_btn").attr('href', "javascript:DA.Select.Done('"+dlgName+"','"+itemType+"','itemPage'); DA.navigationController.simpleBackPage('" + backId + "');"  );
		$("#backButton").addClass("DA_headbtn_cancel_class");
		$("#backButton").html(DA.vars.backTitleCancel);
		$("#backButton").attr('href', "#" + backId  );
		$("#backButton").attr('onclick', "javascript:DA.Select.goBackPage();");
		
	},
	
	// 
	goSelectList:function(itemType,dlgName,hiddeName,backId){
		if (this.debug) console.log("goSelectList") ;
		
		DA.param.address.select    = 1;
		DA.param.address.dlgName   = dlgName;
		DA.param.address.itemType  = itemType;
		DA.param.address.backId    = backId;
		
		this.showOkBtn();
		this.setBackPage(backId, dlgName, itemType);
		this.setTargetPullDown(itemType);
		this.setKeywordArea('on');
		
		//////  /////
		setCurrentItem(itemType, dlgName);
	
		this.clearKeyword();

		// 
		// if(  getItemObj(dlgName).getNewOpenFlg() ){
		this.jsonConExecute('list',{ 'itemtype': itemType, 'target': 'ug_regist', 'select':DA.param.address.select,'dlg_name': dlgName }, false, true);
		this.setListLabel('ug_regist');
		//}
		getItemObj(dlgName).setNewOpenFlg(0);
		//////////////////////////////////////////
	},

	
	// 
	goSelectFaList:function(itemType,dlgName,hiddeName,backId){
		if (this.debug) console.log("goSelectFaList") ;
		
		DA.param.address.select    = 1;
		DA.param.address.dlgName   = dlgName;
		DA.param.address.itemType  = itemType;
		DA.param.address.backId    = backId;
		DA.param.address.target    = 'search_fa';
		
		this.showOkBtn();
		this.setBackPage(backId, dlgName, itemType);
		this.setTargetPullDown('fa');
		this.setKeywordArea('off');
		
		//
		DA.util.get("pageTitle").html(DA.vars.faListTitle);
		// 
		$("#DA_footnavi_address").remove();		
		// 
		
		
		//////  /////
		setCurrentItem(itemType, dlgName);
		
		var fgid = $('#select_target_4fa').val();
		//if( fgid ){
			DA.param.address.fgid      = fgid || '';
			this.jsonConExecute('list',{ 'itemtype': itemType,  'target': 'search_fa', 'select': 1, 'dlg_name': dlgName, 'fgid': fgid }, false, true);
		//}
		this.setListLabel('fa');
		
		//}
		getItemObj(dlgName).setNewOpenFlg(0);
		//////////////////////////////////////////
	},
	
	goList:function(){
		if (this.debug)  console.log("goList");
		var target;
		var itemType;
		
		DA.param.address.select   = 0;
		DA.param.address.dlgName  = '';
		DA.param.address.keyword  = '';
		DA.param.address.itemType = itemType = 'address';
		DA.param.address.target   = target = 'ug_regist';
		
		this.hideOkBtn();
		this.setTargetPullDown(DA.param.address.itemType);
		
		this.clearKeyword();
		
		this.setKeywordArea('on');
		this.setListLabel(target);
		this.jsonConExecute('list',{ 'target': target, itemtype: itemType  });
	},
	
	doSearch : function(target){
		if (this.debug) console.log("doSearch");
		
		if(!target){
			if( DA.param.address.itemType === 'address' ){
				target = $('#select_target_4mail').val();
			} else {
				target = $('#select_target_4ug').val();
			}
		}
		//alert(target);
		var itemType  = DA.param.address.itemType;
		var dlgName   = DA.param.address.dlgName ;
		var keyword   = $('#DA_address_search_keyword').val();
		var select    = DA.param.address.select ? 1 : 0;
		
		this.setListLabel(target);
		if( keyword || target ==='ug_regist' ){
			this.jsonConExecute('list',{ 'itemtype': itemType,  'target': target ,'keyword':keyword ,'select':select,'dlg_name': dlgName}, false, true, "address_list_" + target);
		}else{
			alert(DA.vars.NoKeywordMsg);
		}
		DA.param.address.target  = target;
		DA.param.address.keyword = keyword;
		DA.param.address.page    = 1;
	},
	
	doSearchFa : function(){
		if (this.debug) console.log("doSearchFa");
		
		var fgid = $('#select_target_4fa').val();
		
		var itemType  = DA.param.address.itemType;
		var target    = 'search_fa';
		var dlgName = DA.param.address.dlgName ;
		var select = 1;
		DA.param.address.select = select;
		
		//this.setListLabel('search_fa');
		this.jsonConExecute('list',{ 'itemtype' : itemType, 'target': 'search_fa' ,'fgid':fgid ,'select':select,'dlg_name': dlgName}, false, true, "address_list_" + target);
		
		DA.param.address.target  = target;
		DA.param.address.fgid    = fgid;
		DA.param.address.page    = 1;
	},
	
	hideScheduleFooter: function(show){
		DA.util.get('DA_address_list_footer_detail_btn').attr("class","hide_element");
		DA.util.get('DA_address_list_footer_schedule_btn').attr("class","hide_element");
		DA.util.get('DA_address_list_footer_detail_btn').html('');
		DA.util.get('DA_address_list_footer_schedule_btn').html('');
	},
		
	hideScheduleBtn: function(){
		DA.util.get("DA_address_list_footer_schedule_btn").hide();
		DA.util.get("DA_address_list_footer_detail_btn").removeClass('DA_footbtnlist_l_on_class');
		DA.util.get("DA_address_list_footer_detail_btn").addClass('DA_footbtn_class');
	},
		
	goDetail: function(args, key, pageId){
		if(args.mid){
			DA.param.address.mid=args.mid;
			if( args.mid === DA.vars.userMid ){
				this.hideScheduleFooter();
			}
		}else{
			this.hideScheduleFooter();
			DA.param.address.mid='';
		}

		var target = DA.param.address.target;

		if( args.mid ) {
			DA.param.address.id =  args.mid;
		}else if( args.gid ){
			DA.param.address.id =  args.gid;
		}else if( args.aid ){
			DA.param.address.id =  args.aid;
		}else if( args.list_id ){
			DA.param.address.id =  args.list_id;
		}

		this.jsonConExecute('detail', args, false, false, key,
			{ 
				//onCache: function(url,params,cache){
				onSetContents: function(url, json){
					//var json = DA.util.string2Object(cache.json);
					if( json === null ) return ;
					
					$("#" + pageId +" .DA_row_class").attr("da_address_disp_flg", '0');
					
					jQuery.each ( json, function(k, v){
						
						if( v.html === null || v.html ==='' ){
							var targetRow = $("#" + v.id ).closest(".DA_row_class");
							if( targetRow.attr('DA_address_disp_flg') != '1' ){
								targetRow.hide();
							}
						} else {
							$("#" + v.id ).closest(".DA_row_class").show();
							$("#" + v.id ).closest(".DA_row_class").attr("DA_address_disp_flg", '1');
						}
					});
					$("#" + pageId +" fieldset").each( function (){ 
						if( 0 === $(this).children('div[da_address_disp_flg=1]').length ){
							$(this).hide();
						} else {
							$(this).show();
						}

						// remove border-bottom
						$(this).children("div[da_address_disp_flg='1']:last").css("border-bottom", 'none' );
					});
				},
			}
		);
	},
	
	addNextList: function() {
		if (this.debug) console.log("addNextList");
		
		var args = {
			'itemtype' : DA.param.address.itemType,
			'target'   : DA.param.address.target,
			'keyword'  : DA.param.address.keyword,
			'page'     : DA.util.isNumber(DA.param.address.page) ? DA.param.address.page : 1,
			'select'   : DA.param.address.select ? 1 : 0,
			'dlg_name' : DA.param.address.dlgName,
			'fgid'     : DA.param.address.fgid,
		};
		DA.param.address.page = args.page = args.page + 1;
		this.jsonConExecute('list', args, true , true);
	},
	
	jsonConExecute: function(sub, args, append, nocache, key, hash) {
		if (append) {
			appendJsonCon.execute($.extend({ func: 'address', sub: sub }, args), key, nocache, hash);
		} else {
			jsonCon.execute($.extend({ func: 'address', sub: sub }, args), key, nocache, hash);
		}
	},
	showOkBtn : function() {
		DA.util.get('DA_address_list_ok_btn').show();
	},

	hideOkBtn : function() {
		DA.util.get('DA_address_list_ok_btn').hide();
	},

	clearKeyword : function() {
		$('#DA_address_search_keyword').val('');
	}

};



DA.customEvent.set("navigationController.slidePage", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;

	var fromFunc = params.fromFunc;
	var fromSub  = params.fromSub;
	
	if( func !== 'address' ) { return; }
});

DA.customEvent.set("navigationController.backPage", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;
	
	var fromFunc = params.fromFunc;
	var fromSub  = params.fromSub;
	
	if( func !== 'address' ) { return; }
	
	if( sub === 'list') {
			DA.address.hideOkBtn();
		if(DA.param.address.select === 1){
			DA.address.goList();
		}
	}else if ( sub ==='detail'){
	//	DA.util.get('DA_address_list_footer_detail_btn').hide();
	//	DA.util.get('DA_address_list_footer_schedule_btn').hide();

		if(!DA.param.address.mid || DA.param.address.mid === DA.vars.userMid){
			DA.address.hideScheduleFooter();
		}
	}
	
});

DA.customEvent.set("navigationController.slideDone", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;
	
	var fromFunc = params.fromFunc;
	var fromSub  = params.fromSub;

	if( func !== 'address' ) { return; }

	if( params.toPage.id ==='DA_address_list_Id' && params.fromPage.id.match(/DA_address_detail/)) {
		DA.action.autoScroll("DA_address_" + DA.param.address.target + "_" + DA.param.address.id, true);
	}
});

DA.customEvent.set("contentsController.onSuccess", function(in_params) {
	
});




