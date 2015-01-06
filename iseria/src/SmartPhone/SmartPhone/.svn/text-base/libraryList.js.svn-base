DA.libraryList ={
	toggleHeader: function() {
		
		//this._toggleClass($("#DA_library_file_route_open_Id"));
		//this._toggleClass($("#DA_library_file_route_close_Id"));
		//this._toggleClass($("#DA_library_file_route_part_Id"));
		//this._toggleClass($("#DA_library_file_route_all_Id"));
		DA.util.get("DA_library_file_route_open_Id").toggle();
		DA.util.get("DA_library_file_route_close_Id").toggle();
		
		var routeOpen = DA.param.library.routeOpen;
		routeOpen = (routeOpen==='0')?  "1" : "0";
		DA.param.library.routeOpen = routeOpen;	
		this.setViewRoute();
		
	},
	
	_toggleClass: function(el) {
		if (el.hasClass("DA_header_open_class")) {
			el.addClass("DA_header_close_class").removeClass("DA_header_open_class");
		} else {
			el.addClass("DA_header_open_class").removeClass("DA_header_close_class");
		}
	},
	
	listReload: function(){
		DA.param.library.page = 1;
		var args = {
			bid : DA.param.library.bid,
			page: DA.param.library.page
		};
		var key = this.getKey('list', args);
		this.jsonConExecute("list", args, false, "DA_library_file", {
				onSetContents: function(url, params, cache){
					DA.libraryFolder.setDirectly();
				}
		});
	},

	getFileList: function(args,title){
		DA.param.library.bid = args.bid;
		if (args.parent === undefined) {
			args.parent = DA.param.library.parent;
		} else {
			DA.param.library.parent = args.parent;
		}
		//var title = args.title;
		if (args.page){
			DA.param.library.page = args.page;
		}
		DA.param.library.folderTitle = title;
		$("#DA_library_file_route_tag_Id").html(" ");
		$("#DA_library_file_list_data_Id").html(" ");
		DA.libraryList.setViewRoute();
		var key = this.getKey('list', args);
		this.jsonConExecute('list', args, false, key, {
				onSetContents: function(url, params, cache){
					//if (DA.util.isEmpty($("#DA_library_file_route_all_Id").html())){
					//	$("#DA_library_file_route_Id").hide();
					//} else {
					//	$("#DA_library_file_route_Id").show();
					//}
					DA.libraryFolder.setDirectly();
				}
		});

	},
	
	goBack: function(){
		var viewNo = DA.libraryFolder.getNextViewNo();
		var link = 'DA_library_folder' + viewNo + '_Id';
		DA.navigationController.simpleBackPage(link);
		var args = {
			bid: DA.param.library.parent,
			gid: DA.param.library.gid
		};
		//DA.param.library.parent = "";
		DA.libraryFolder.goParentFolder(args);
	},
	
	setViewRoute : function(routeAppend){
		var routeOpen = DA.param.library.routeOpen;
		var eleName      = 'DA_library_file_route_tag_Id';
		var openbtnName  = 'DA_library_file_route_open_Id';
		var closebtnName = 'DA_library_file_route_close_Id';
		var title        = DA.param.library.folderTitle;
		DA.param.library.folderTitle = '';
		if(routeAppend && title){
			DA.util.get(eleName).append("<div> &gt; "+title+" </div>");
			//var f_link   = '#DA_library_folder'+DA.param.library.viewNo+'_Id';
			//DA.util.get('DA_library_list_Id').attr('historyback',f_link);
		}
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
		
	addNextList: function(){
		var page = DA.param.library.page+1;
		var args = {
			bid: DA.param.library.bid,
			page:page,
		};
		this.getFileList(args);
	},
	
	getKey: function(sub, args) {
		var id = "library_" + sub + args.bid;
		return id;
	},
	
	jsonConExecute: function(sub, args, nocache, key, hash) {
		//if (nocache) {
		//	jsonCon.executeCache($.extend({ func: 'library', sub: sub }, args), key, hash);
		//}
		jsonCon.execute($.extend({ func: 'library', sub: sub }, args), key, true, hash);
	},
	
};

DA.customEvent.set("navigationController.slidePage", function(params) {
});

DA.customEvent.set("navigationController.backPage", function(params) {
});

DA.customEvent.set("navigationController.slideDone", function(params) {
});

DA.customEvent.set("contentsController.onSuccess", function(in_params) {
});
