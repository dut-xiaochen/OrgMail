DA.libraryFolder ={

	launcherClick: function(func,sub,param ){
			if (this.debug) console.log("launcherClick");
			
			DA.param.library.viewNo    = '0';
			DA.param.library.routeOpen = '0';
			
			this.changeGroup();
	},
	
	listReload : function(){
		
		var gid = DA.param.library.gid;
		var bid = DA.param.library.bid;
		var page = DA.param.library.page = 1;
		var viewNo = DA.param.library.viewNo;
		
		this.clearFolderList(viewNo);
		
		this.setViewRoute();
		
		this.jsonConExecute("folder", {
			gid: gid,
			bid: bid,
			page: page,
			view_no: viewNo,
		},false,true,"DA_libraryFolder_"+gid,{
			onSetContents: function(){
				DA.libraryFolder.setViewRoute();
				DA.libraryFolder.setDirectly();
			}
			
		} );
	},
	
	changeGroup : function(){
		
		var gid;
		var bid;
		var page;
		var viewNo;
		viewNo = DA.param.library.viewNo;
		DA.param.library.bid  = bid =  "";
		DA.param.library.page = page  = 1;
		DA.param.library.parent ="";

		DA.param.library.gid = gid = DA.util.get("DA_library_folder"+viewNo+"_group_Id").val();
		
		this.clearFolderList(viewNo);
		
		
		this.jsonConExecute("folder", {
			gid: gid,
			bid: bid,
			page: page,
			view_no: viewNo,
		},false,true,"DA_libraryFolder_" + gid ,{
			onSetContents: function(){
				DA.libraryFolder.setViewRoute();
				DA.libraryFolder.setDirectly();
			}
		});
	},
		

	goChildFolder : function(args){
		DA.param.library.parent = args.bid;
		DA.param.library.gid   = args.gid;
		DA.param.library.bid   = args.bid;
		DA.param.library.page  = args.page = 1;
		args.view_no = this.getNextViewNo();
		DA.param.library.viewNo = args.view_no;
		
		this.setGroupPulldownSelected();
		
		this.jsonConExecute('folder', args, false , true, "DA_libraryFolder_" + args.gid + "_"+ args.bid,
			{
				onSetContents: function(){
					DA.libraryFolder.setViewRoute();
					DA.libraryFolder.setDirectly();
				}
				
			}
		);
	},
	
	goParentFolder : function(args){
		DA.param.library.gid   = args.gid;
		DA.param.library.bid   = args.bid;
		DA.param.library.page  = args.page = 1;
		args.view_no = this.getNextViewNo();
		DA.param.library.viewNo = args.view_no;
		var link = 'DA_library_folder' + args.view_no + '_Id';
		DA.navigationController.simpleBackPage(link);
		
		this.clearFolderList(args.view_no);
		
		this.setGroupPulldownSelected();
		
		this.jsonConExecute('folder', args, false , true, "DA_libraryFolder_" + args.gid + "_"+ args.bid,
			{
				onSetContents: function(){
					DA.libraryFolder.setViewRoute();
					DA.libraryFolder.setDirectly();
				}
			}
		);
	},
	
	setDirectly: function(sub) {
		// for request from url
		if (DA.vars.directlyLibrary === true) {
			DA.navigationController.hiddenFooterBtn();
			if ( DA.vars.backTitleBack === $('#DA_library_back_btn_Id').html() ) {
				$('#DA_library_back_btn_Id').html(DA.vars.backTitleUpper);
			}
			if ( 'TOP' === $('#DA_library_back_btn_Id').html() ) {
				DA.navigationController.hiddenHeaderLeftBtn();
			}
		}
	},
		
	setGroupPulldownSelected : function(){
		var gid    =  DA.param.library.gid ;
		var viewNo =  DA.param.library.viewNo;
		DA.util.get("DA_library_folder" + viewNo + "_group_Id option[value='" + gid + "']").attr('selected','true');
	},

	toggleRouteTag : function(){
		if( DA.param.library.routeOpen === '0'){
			DA.param.library.routeOpen = '1';
		}else{
			DA.param.library.routeOpen = '0';
		}
		
		this.setViewRoute();
	},

	setViewRoute : function(){
		var viewNo    = DA.param.library.viewNo;
		var routeOpen = DA.param.library.routeOpen;
		var eleName   = 'DA_library_folder'+viewNo+'_route_Id';
		var openbtnName  = 'DA_library_folder'+viewNo+'_route_open_btn_Id';
		var closebtnName = 'DA_library_folder'+viewNo+'_route_close_btn_Id';
		
		var num = DA.util.get(eleName).children("div").length;
		
		// 
		if( 5 <= num && routeOpen ==='0'){
			
			DA.util.get( eleName + ' div:eq(1)').show();
			DA.util.get( eleName + ' div:gt(1)').hide();
			DA.util.get( eleName + ' div:eq('+ (num -2) +')').show();
			DA.util.get( eleName + ' div:eq('+ (num -1) +')').show();
			DA.util.get( openbtnName ).show();
			DA.util.get( closebtnName ).hide();
			
		}else{
			if( num < 5 ){
				DA.util.get( openbtnName ).hide();
				DA.util.get( closebtnName ).hide();
			}else{
				DA.util.get( eleName + ' div').show();
				DA.util.get( eleName + ' div:eq(1)').hide();
				DA.util.get( openbtnName ).hide();
				DA.util.get( closebtnName ).show();
			}
		}
	},
	
	clearFolderList : function(viewNo){
		DA.util.get('DA_library_folder0_data_Id').html('');
		DA.util.get('DA_library_folder1_data_Id').html('');
	},
	
	getNextViewNo : function (){
		if( DA.param.library.viewNo ==='0'){
			return "1";
		}
		return "0";
	},
	
	addNextList: function() {
		
		var args = {
			'gid'      : DA.param.library.gid,
			'bid'      : DA.param.library.bid,
			'view_no'  : DA.param.library.viewNo,
			'page'     : DA.util.isNumber(DA.param.library.page) ? DA.param.library.page : 1,
		};
		DA.param.library.page =  args.page = args.page + 1;
		
		var keyId = "DA_libraryFolder_" + DA.param.library.gid;
		if( DA.param.library.bid ){
			keyId += "_" + DA.param.library.bid
		}
		this.jsonConExecute('folder', args, true , true, keyId, {
			onSetContents: function() {
				DA.libraryFolder.setDirectly();
			}
		});
	},
	
	
	jsonConExecute: function(sub, args, append, nocache, key, hash) {
		if (append) {
			appendJsonCon.execute($.extend({ func: 'library', sub: sub }, args), key, nocache, hash);
		} else {
			jsonCon.execute($.extend({ func: 'library', sub: sub }, args), key, nocache, hash);
		}
	},
}

	DA.customEvent.set("navigationController.slideDone", function(params) {
		var event = params.event;
		var func  = params.func;
		var sub   = params.sub;
		
		var fromFunc = params.fromFunc;
		var fromSub  = params.fromSub;

		if( func !== 'library' ) { return; }
			
	});

	DA.customEvent.set("navigationController.backPage", function(params) {
		var event = params.event;
		var func  = params.func;
		var sub   = params.sub;
	
		var fromFunc = params.fromFunc;
		var fromSub  = params.fromSub;
	
		if( func !== 'library' ) { return; }
	
	});

	DA.customEvent.set("navigationController.slidePage", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;

	var fromFunc = params.fromFunc;
	var fromSub  = params.fromSub;
	
	if( func !== 'library' ) { return; }
	});
