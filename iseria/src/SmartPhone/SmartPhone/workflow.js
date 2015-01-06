DA.workflow ={
	
	debug : 0,
	
	toggleComment : function(){
		
		if ( DA.param.workflow.commenShowFlg ){
			$('.DA_workflow_comment_area_class').hide();
			DA.param.workflow.commenShowFlg = 0;
			DA.util.get("DA_workflow_wfRoute_togglecomment_btn_Id").text(DA.vars.wfRouteCommentShowMsg);
		} else {
			$('.DA_workflow_comment_area_class').show();
			DA.param.workflow.commenShowFlg = 1;
			DA.util.get("DA_workflow_wfRoute_togglecomment_btn_Id").text(DA.vars.wfRouteCommentHideMsg);
		}
		
	},
	
	launcherClick: function(func,sub,param ){
			if (this.debug) console.log("launcherClick");
			
			var sub      = ( sub === 'ccList' ) ? 'ccList' : 'wfList' ;
			var mode     = ( sub === 'ccList' ) ? 'cc' : 'wf';
			var page     = 1;
			
			this.jsonConExecute(sub, { mode: mode, page: page, keyword: ''}, false, true, sub);
			
			this.clearKeyword();
			
			DA.param.workflow.mode      = mode;
			DA.param.workflow.wfPage    = page;
			DA.param.workflow.ccPage    = page;
			DA.param.workflow.fid       = '';
			DA.param.workflow.ccfid     = '';
			DA.param.workflow.cFidIndex = -1;
			DA.param.workflow.portal    = '';
			
			
	},

	Reload : function(){
		if (this.debug) console.log("Reload");
		
		this.clearKeyword();
		
		var mode     = DA.param.workflow.mode;
		if ( mode === 'cc' ) {
			DA.param.workflow.ccPage = 1;
		} else {
			 DA.param.workflow.wfPage = 1;
		}
		var sub      = ( mode === 'cc' ) ? 'ccList' : 'wfList' ; 
		
		this.jsonConExecute(sub, { mode: mode, page: 1, keyword: ''}, false, true, sub );
		
	},

	goListWF : function(){
		
		this.clearKeyword();

		DA.param.workflow.wfPage = 1;
		DA.param.workflow.mode   = 'wf';
		DA.param.workflow.portal = '';
		this.jsonConExecute('wfList', { mode: 'wf', page: 1, keyword:'' }, false, true, 'wfList' );
		
	},
	goListCC : function(){
		
		this.clearKeyword();
		
		DA.param.workflow.ccPage = 1;
		DA.param.workflow.mode   = 'cc';
		DA.param.workflow.portal = '';
		this.jsonConExecute('ccList', { mode: 'cc', page: 1, keyword:'' }, false, true, 'ccList' );
		
	},
	
	// 
	doSearch : function(){
		if (this.debug) console.log("doSearch");
		
		var mode     = DA.param.workflow.mode;
		var page     = "1";
		var keyword  = (mode === 'cc') ? $('#DA_workflow_cc_search_keyword').val() : $('#DA_workflow_wf_search_keyword').val();
		var sub      = (mode === 'cc') ? 'ccList' : 'wfList' ; 
		if ( keyword ) {
			this.jsonConExecute(sub, { mode: mode, page: page, keyword: keyword }, false, true, sub +'_'+ keyword );
		}else{
			alert(DA.vars.NoKeywordMsg);
		}
		if ( mode === 'cc' ){
			DA.param.workflow.ccPage     = page;
			DA.param.workflow.ccKeyword  = keyword;
			DA.param.workflow.ccfid      = '';
		} else {
			DA.param.workflow.wfPage     = page;
			DA.param.workflow.wfKeyword  = keyword;
			DA.param.workflow.fid        = '';
		}
		DA.param.workflow.mode     = mode;
	},
	
	getFidList : function(mode, portal){
		var list ;
		if( portal ){
			list = (mode === 'cc') ? DA.param.workflow.ccPortalFidList :  DA.param.workflow.wfPortalFidList;
		}else {
			list = (mode === 'cc') ? DA.param.workflow.ccFidList :  DA.param.workflow.wfFidList;
		}
		
		return list;
	},
	
	searchFid : function(fid){
		
		var mode   = DA.param.workflow.mode ;
		var portal = DA.param.workflow.portal; 
		var idList = this.getFidList(mode, portal);
		
		if( idList.length <= 0 ) {
			return null;
		}
		
		var res = [-1, -1,-1];
		var cNo = -1;
		jQuery.each( idList, function(k,v){
			
			if( v.fid === fid ){
				cNo = k;
				return;
			}
		});
		
		if( cNo === -1 ){
			return null;
		}
		
		if( 1 <= cNo ){
			var tmpNo = cNo-1;
			res[0] = idList[tmpNo];
		}
		if( idList[cNo+1] !== undefined ) {
			var tmpNo = cNo+1;
			res[1] = idList[tmpNo];
		}
		res[2] = cNo;
		return res;
//		
	},
	
	setBackPage : function (){
		
		if ( DA.param.workflow.mode === 'cc' ){
			if( DA.param.workflow.portal ==='1' ) {
				$("#backButton").html('TOP');
				$('#DA_workflow_ccDetail_Id').attr('historyback','#DA_portal_list_Id');
			} else {
				$("#backButton").html(DA.vars.backTitleList);
				$('#DA_workflow_ccDetail_Id').attr('historyback','#DA_workflow_ccList_Id');
			}
		}else{
			if( DA.param.workflow.portal ==='1' ) {
				$("#backButton").html('TOP');
				$('#DA_workflow_wfDetail_Id').attr('historyback','#DA_portal_list_Id');
			} else {
				$("#backButton").html(DA.vars.backTitleList);
				$('#DA_workflow_wfDetail_Id').attr('historyback','#DA_workflow_wfList_Id');
			}
		}

	},
		
	goDetailWF: function(args, key , index){
		if (this.debug) console.log("goDetail");
		
		var fid;
		var portal;
		var mode = DA.param.workflow.mode = 'wf' ;
		DA.param.workflow.fid = fid = args.fid;
		DA.param.workflow.portal = portal = args.portal;
		args.mode = mode;
		var sub = ( mode === 'cc' ) ? 'ccDetail' : 'wfDetail';
		
		var path;
		if( index ){
			
			DA.param.workflow.cFidIndex = index;
		}else{
			path = this.searchFid(fid);
			if( path === null ) { return }
			DA.param.workflow.cFidIndex = path[2];
		}
		
		// Comment Area Show 
		$('.DA_workflow_comment_area_class').show();
		DA.param.workflow.commenShowFlg = 1;
		
		// set Back btn
		this.setBackPage();
		
		// upper , down button 
		//var idList    = DA.workflow.getFidList(mode, portal);

		
		
		this.jsonConExecute(sub, args, false, false, key,
			{ 
				onSetContents: function(url, json){
					//console.log("onSetContents");
					
					if( json === null ) return ;
					
					DA.navigationController.autoScroll();

					var portal    = DA.param.workflow.portal;
					var mode      = DA.param.workflow.mode;
					var idList    = DA.workflow.getFidList(mode, portal);
					
					var cFidIndex = DA.param.workflow.cFidIndex;
					
					// append comment data
					DA.util.get('DA_workflow_wf_detail_comment_Id').val('');
					
					var getCnt=0;
					jQuery.each( json, function(k,v){
						if( v.id ==='DA_workflow_wf_detail_comment_Id' ){
							var comment = DA.util.decode(v.html || '');
							DA.util.get('DA_workflow_wf_detail_comment_Id').val(comment);
							getCnt++;
							if( 2 <= getCnt ) return ;
						}else if ( v.id ==='DA_workflow_wf_detail_meta_info') {
							var s = v.html.split(",");
							DA.param.workflow.orders     = s[0];
							DA.param.workflow.no_ng      = s[1];
							DA.param.workflow.back_order = s[2];
							getCnt++;
							if( 2 <= getCnt ) return ;
						}
					});
					
					// rb_type show or hide
					if( DA.util.get('DA_workflow_wf_action_rb_type_Id').val() === null ){
						DA.util.get('DA_workflow_wf_action_rb_type_div_Id').hide();
					} else {
						DA.util.get('DA_workflow_wf_action_rb_type_div_Id').show();
					}
					
					// current rows
					//DA.util.get('DA_workflow_now_row').html( cFidIndex + 1 );
					// total rows
					//DA.util.get('DA_workflow_list_row').html( idList.length );
					var msg = DA.util.gettext(DA.vars.detailCountMsg, [idList.length, cFidIndex+ 1]);
					DA.util.get('DA_workflow_now_row').text(msg);	
					
					// set Footer
					DA.workflow.setWfFooter();
					
					DA.workflow.setPrevNextBtnWF();
				}
			}
		);
	},
	
	
	goDetailCC: function(args, key , index){
		//if (this.debug) console.log("goDetail");
		
		var ccfid;
		var sub = 'ccDetail';
		var mode;
		var portal;
		DA.param.workflow.mode   = mode   = 'cc';
		DA.param.workflow.ccfid  = ccfid  = args.fid;
		DA.param.workflow.portal = portal = args.portal;
		args.mode = mode;
		
		var path;
		if( index ){
			
			DA.param.workflow.cFidIndex = index;
		}else{
			path = this.searchFid(ccfid);
			if( path === null ) { return }
			DA.param.workflow.cFidIndex = path[2];
		}
		
		// set Back btn
		this.setBackPage();
		
		
		this.jsonConExecute(sub, args, false, false, key,
			{ 
				onSetContents: function(url, json){
					
					DA.navigationController.autoScroll();
					
					var portal    = DA.param.workflow.portal;
					var mode      = DA.param.workflow.mode;
					var idList    = DA.workflow.getFidList(mode, portal);
					var Index     = DA.param.workflow.cFidIndex;
					
					DA.util.get('DA_workflow_cc_detail_comment_Id').val('');
					// append comment
					jQuery.each( json, function(k,v){
						if( v.id ==='DA_workflow_cc_detail_comment_Id' ){
							var comment = DA.util.decode(v.html || '');
							DA.util.get('DA_workflow_cc_detail_comment_Id').val(comment);
							return ;
						}
					});
					
					// current rows
					//DA.util.get('DA_workflow_ccnow_row').html( Index + 1 );
					// total rows 
					//DA.util.get('DA_workflow_cclist_row').html( idList.length );
					var msg = DA.util.gettext(DA.vars.detailCountMsg, [idList.length, Index + 1]);
					DA.util.get('DA_workflow_ccnow_row').text(msg);

					DA.workflow.setPrevNextBtnCC();
				}
			}
		);
	},

	
	
	setOK : function(){
		
		this.setActionBtn('ok');
		
		DA.util.get('DA_workflow_wfAction_return_Id').hide();
		// ok target show or hide
		if ( DA.util.get('DA_workflow_wf_action_target_Id').html().match(/<input/) ) {
			DA.util.get('DA_workflow_wfAction_arrow_Id').hide();
		} else {
			DA.util.get('DA_workflow_wfAction_arrow_Id').show();
		}

	},
	
	setConfirm : function(){
		
		this.setActionBtn('confirm');
		
		DA.util.get('DA_workflow_wfAction_return_Id').hide();
		
		// ok target show or hide
		if ( DA.util.get('DA_workflow_wf_action_target_Id').html().match(/<input/) ) {
			DA.util.get('DA_workflow_wfAction_arrow_Id').hide();
		} else {
			DA.util.get('DA_workflow_wfAction_arrow_Id').show();
		}

	},
	
	setRb : function(){
		
		this.setActionBtn('rb');
		DA.util.get('DA_workflow_wfAction_arrow_Id').hide();
		if( DA.param.workflow.back_order ==='1' ){
			DA.util.get('DA_workflow_wfAction_return_Id').show();
		}else{
			DA.util.get('DA_workflow_wfAction_return_Id').hide();
		}
		
	},
	
	setNG : function(){
		
		this.setActionBtn('ng');
		DA.util.get('DA_workflow_wfAction_arrow_Id').hide();
		DA.util.get('DA_workflow_wfAction_return_Id').hide();
		
	},
	
	setWfFooter : function(){
		var mode      = DA.param.workflow.mode;
		var no_ng     = DA.param.workflow.no_ng;
		
		// no_rb
		if( no_ng === '1' ){
			DA.navigationController.hideButton('DA_workflow_action_ng_btn');
			DA.navigationController.hideButton('DA_workflow_action_rb_btn');
			DA.navigationController.hideButton('DA_workflow_action_ok_btn');
			DA.navigationController.showButton('DA_workflow_action_cn_btn');
		}else{
			DA.navigationController.hideButton('DA_workflow_action_cn_btn');
			DA.navigationController.showButton('DA_workflow_action_ng_btn');
			DA.navigationController.showButton('DA_workflow_action_rb_btn');
			DA.navigationController.showButton('DA_workflow_action_ok_btn');
		}
	},
	
	actionWF : function(actionType){
		var mode      = DA.param.workflow.mode;
		var args = {
			mode    : mode,
			page    : 1,
			keyword : DA.param.workflow.wfKeyword,
			fid     : DA.param.workflow.fid,
			orders  : DA.param.workflow.orders,
			comment : DA.util.get('DA_workflow_wf_detail_comment_Id').val(),
			branch  : DA.util.get('DA_workflow_branch_Id').val() || '',
			action  : actionType,
		};
		
		// check selected branch
/**
		if( actionType === 'ok'){
			if(  DA.util.get('DA_workflow_wf_action_target_Id').html().match(/<select/) ){
				if( args.branch === '' ){
					alert(DA.vars.wfNoSelectBranchMsg);
					return -1;
				}
			}
		}
**/
		
		// for rb 
		if( actionType === 'rb' ){
			args.rb_order = DA.util.get('DA_workflow_wf_action_rb_order_Id').val();
			args.rb_type  = DA.util.get('DA_workflow_wf_action_rb_type_Id').val();
		}
		
		// Clear Detail Cache
		DA.cacheController.removeCacheJson('workflow_wfDetail_' + DA.param.workflow.fid);
		
		var sub  = 'wfList' ;
		this.jsonConExecute( sub, args, false , true, "workflow_wfAction");
		
		//DA.navigationController.backPage({ func: 'workflow', sub: 'wfList' });
	},
	
	actionCC : function(actionType){
		var mode    = DA.param.workflow.mode;
		var args = {
			mode    : mode,
			page    : 1,
			keyword : DA.param.workflow.ccKeyword,
			fid     : DA.param.workflow.ccfid,
			comment : DA.util.get('DA_workflow_cc_detail_comment_Id').val(),
			action  : actionType,
		};
		
		// Clear Detail Cache
		DA.cacheController.removeCacheJson('workflow_ccDetail_' + DA.param.workflow.ccfid);
		
		var sub  = 'ccList' ;
		this.jsonConExecute( sub, args, false , true, "workflow_ccAction");
	},
	
	setActionBtn : function(actionType){
		var btnName;
		if(actionType === 'ok' ){
			DA.util.get('DA_workflow_action_btn_Id').attr("onClick", "DA.workflow.actionWF('ok')" );
			btnName = DA.vars.wfActionAllow;
		}else if(actionType === 'confirm' ){
			DA.util.get('DA_workflow_action_btn_Id').attr("onClick", "DA.workflow.actionWF('confirm')" );
			btnName = DA.vars.wfActionConfirm;
		}else if ( actionType === 'rb') {
			DA.util.get('DA_workflow_action_btn_Id').attr("onClick", "DA.workflow.actionWF('rb')" );
			btnName = DA.vars.wfActionRb;
		}else if ( actionType === 'ng') {
			DA.util.get('DA_workflow_action_btn_Id').attr("onClick", "DA.workflow.actionWF('ng')" );
			btnName = DA.vars.wfActionDeny;
		}
		DA.util.get('DA_workflow_action_btn_Id').html(btnName);
		DA.util.get('DA_workflow_action_btn_Id').attr("href", "#DA_workflow_wfList_Id");
	},
	
	detailUrl: function(args) {
		var fid = args.fid;
		var mode = args.mode;
		
		if (fid) {
			if( mode === 'cc'){
				req = {
					url: DA.vars.spCgiRdir + "/sp_ajx_api.cgi?proc=contents_json&func=workflow&sub=ccDetail&fid=" + fid,
					key: "workflow_ccDetail_" + fid
				};
			} else {
				req = {
					url: DA.vars.spCgiRdir + "/sp_ajx_api.cgi?proc=contents_json&func=workflow&sub=wfDetail&fid=" + fid,
					key: "workflow_wfDetail_" + fid
				};
			}
		}
		return req;
	},
	
	next : function(type){
		
		var mode = DA.param.workflow.mode;
		var portal = DA.param.workflow.portal;
		var path = this.searchFid( ( mode === 'cc' ? DA.param.workflow.ccfid : DA.param.workflow.fid)  );
		if( path === null) { return  } 
		
		var cFidIndex =  DA.param.workflow.cFidIndex;
		var idList = this.getFidList(mode, portal);
		
		var Fid = -1;
		if( type ==='prev' ){
			if( 0<= cFidIndex-1 ){
				cFidIndex--;
				Fid  =  idList[cFidIndex].fid ;
			}
		} else {
			if( cFidIndex + 1 < idList.length ){
				cFidIndex++;
				Fid  =  idList[cFidIndex].fid ;
			}
		}
		DA.param.workflow.cFidIndex = cFidIndex;
		
		if( Fid === -1){
			
		} else {
			
			var reqList = [];
			if( type ==='prev' ){
				if( 0<= cFidIndex-1 ){
					reqList.push( this.detailUrl({fid:idList[cFidIndex-1].fid, mode:mode,}) );
				}
			}else{
				if( cFidIndex + 1 < idList.length ){
					reqList.push( this.detailUrl({fid:idList[cFidIndex+1].fid, mode:mode, }) );
				}
			}
			//console.log(cFidIndex);
			
			//console.log(reqList);
			
			if( 0 < reqList.length) {
				readCon.execute(reqList);
			}
			//var tFidList = this.searchFid();
			//console.log(tFidList[0]);
			//console.log(tFidList[1]);
			if( mode  ==='cc' ){
				this.goDetailCC({fid: Fid, portal:portal}, "workflow_ccDetail_" + Fid, cFidIndex);
			}else{
				this.goDetailWF({fid: Fid, portal:portal}, "workflow_wfDetail_" + Fid, cFidIndex);
			}
		}
	},
	
	addNextList: function() {
		
		var mode     = DA.param.workflow.mode;
		var page     = 0;
		var keyword;
		if( mode === 'cc' ){
			page     = (DA.util.isNumber(DA.param.workflow.ccPage) && DA.param.workflow.ccPage > 0) ? DA.param.workflow.ccPage : 1;
			keyword  = DA.param.workflow.ccKeyword;
		} else {
			page     = (DA.util.isNumber(DA.param.workflow.wfPage) && DA.param.workflow.wfPage > 0) ? DA.param.workflow.wfPage : 1;
			keyword  = DA.param.workflow.wfKeyword;
		}
		var args = {
			mode    : mode,
			page    : page,
			keyword : keyword,
		};
		var sub  = (mode === 'cc' ) ? 'ccList' : 'wfList' ; 
		
		args.page = args.page + 1;
		if( mode === 'cc' ){
			DA.param.workflow.ccPage = args.page;
		} else {
			DA.param.workflow.wfPage = args.page;
		}
		
		this.jsonConExecute( sub, args, true , true);
	},
	
	jsonConExecute: function(sub, args, append, nocache, key, hash) {
		if (append) {
			appendJsonCon.execute($.extend({ func: 'workflow', sub: sub }, args), key, nocache, hash);
		} else {
			jsonCon.execute($.extend({ func: 'workflow', sub: sub }, args), key, nocache, hash);
		}
	},
	
	toggleMessage : function(mode){
		if ( mode === 'cc' ){
			// DA_workflow_cc_detail_message_area_Id
			DA.util.get("DA_workflow_cc_message_open_Id").toggle();
			DA.action.toggleSlideUpDown('DA_workflow_cc_message_area_Id');
		} else {
			DA.util.get("DA_workflow_wf_message_open_Id").toggle();
			DA.action.toggleSlideUpDown('DA_workflow_wf_message_area_Id');
		}
	},
		
	setPrevNextBtnWF: function(){
		var idList    = DA.workflow.getFidList( DA.param.workflow.mode, DA.param.workflow.portal);
		DA.util.get("DA_workflow_wfDetail_u_btn").addClass('DA_headbtnlist_l_class');
		DA.util.get("DA_workflow_wfDetail_d_btn").addClass('DA_headbtnlist_r_class');
		
		if( DA.param.workflow.cFidIndex === 0 ){
			DA.util.get("DA_workflow_wfDetail_u_btn").addClass('DA_footbtnlist_l_disable_class');
			DA.util.get("DA_workflow_wf_prev_Id").hide();
		}else{
			DA.util.get("DA_workflow_wfDetail_u_btn").removeClass('DA_footbtnlist_l_disable_class');
			DA.util.get("DA_workflow_wf_prev_Id").show();
		}
		
		if ( DA.param.workflow.cFidIndex + 1 === idList.length ){
			DA.util.get("DA_workflow_wfDetail_d_btn").addClass('DA_footbtnlist_r_disable_class');
			DA.util.get("DA_workflow_wf_next_Id").hide();
		}else{
			DA.util.get("DA_workflow_wfDetail_d_btn").removeClass('DA_footbtnlist_r_disable_class');
			DA.util.get("DA_workflow_wf_next_Id").show();
		}
	},
		
	setPrevNextBtnCC : function(){
		
		var idList    = DA.workflow.getFidList(DA.param.workflow.mode, DA.param.workflow.portal);
		
		if( DA.param.workflow.cFidIndex === 0 ){
			DA.util.get("DA_workflow_ccDetail_u_btn").addClass('DA_footbtnlist_l_disable_class');
			DA.util.get("DA_workflow_cc_prev_Id").hide();
		}else{
			DA.util.get("DA_workflow_ccDetail_u_btn").removeClass('DA_footbtnlist_l_disable_class');
			DA.util.get("DA_workflow_cc_prev_Id").show();
		}
		if ( DA.param.workflow.cFidIndex + 1 === idList.length ){
			DA.util.get("DA_workflow_ccDetail_d_btn").addClass('DA_footbtnlist_r_disable_class');
			DA.util.get("DA_workflow_cc_next_Id").hide();
		}else{
			DA.util.get("DA_workflow_ccDetail_d_btn").removeClass('DA_footbtnlist_r_disable_class');
			DA.util.get("DA_workflow_cc_next_Id").show();
		}
	
	},

	// TODO
	clearKeyword : function() {
		// clear keyword box
		DA.param.workflow.wfKeyword = '';
		DA.param.workflow.ccKeyword = '';
		
		$('#DA_workflow_cc_search_keyword').val('');
		$('#DA_workflow_wf_search_keyword').val('');
		
	}
};

DA.customEvent.set("navigationController.slidePage", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;

	var fromFunc = params.fromFunc;
	var fromSub  = params.fromSub;
	
	if( func === 'workflow' ){
		if( sub ==="wfDetail" ){
			
		}
	}
});

DA.customEvent.set("navigationController.backPage", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;
	if( func === 'workflow' ){
		if( sub ==='ccDetail' ){
			DA.workflow.setPrevNextBtnCC();
		}else if( sub ==='wfDetail' ){
			DA.workflow.setWfFooter();
			DA.workflow.setPrevNextBtnWF();
		}
	}
	
	
});

DA.customEvent.set("navigationController.slideDone", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;
	
	if( func !== 'workflow' ) return ;

	if( params.toPage.id ==='DA_workflow_wfList_Id' && params.fromPage.id === "DA_workflow_wfDetail_Id" ) {
			DA.action.autoScroll("DA_workflow_wf_" + DA.param.workflow.fid, true);

	}else if( params.toPage.id ==='DA_workflow_ccList_Id' && params.fromPage.id === "DA_workflow_ccDetail_Id" ) {
			DA.action.autoScroll("DA_workflow_cc_" + DA.param.workflow.ccfid, true);
	
	}
	
	// for direct link
	if( DA.vars.default_page_id ) {
		
		if(  params.toPage.id ==='DA_workflow_wfAction_Id'  || params.toPage.id ==='DA_workflow_ccAction_Id' ){
			
			$("#DA_workflow_action_btn_Id").attr("href","#");
		
		} else if (  params.toPage.id === "DA_workflow_wfDetail_Id" || params.toPage.id === "DA_workflow_ccDetail_Id") {
			
			DA.navigationController.hiddenHeaderBtn();
	
		}
		DA.navigationController.hiddenFooterBtn();
	}
	

});

DA.customEvent.set("contentsController.onSuccess", function(in_params) {
	
	if( in_params.params.func === 'workflow' && in_params.params.sub === 'detail' ){
		var data = in_params.output.data;
	}
});
