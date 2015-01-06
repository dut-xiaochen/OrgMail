DA.libraryFile = {
	viewReply: function(args) {
		var me = this;
		var type = 'reply';
		if (args.bid && args.docno) {
			this.hideErrorArea();
			var key = this.getKey(type, args);
			DA.param.library.bid = args.bid;
			DA.param.library.docno = args.docno;
			if (args.page) {
				DA.param.library.comReplyPage = args.page;
			}else {
				DA.param.library.comReplyPage = 1;
			}
			this.jsonConExecute(type, args, true, key, {
				onSetContents: function(url, params, cache){
					DA.libraryFile.setDirectly('reply');
				}
			});
		}
	},

	addComReplyNextList: function(){
		 var page = DA.param.library.comReplyPage + 1;
		 var args = {
		 	 bid: DA.param.library.bid,
		 	 docno: DA.param.library.docno,
		 	 page:page
		 };
		 this.viewReply(args);
	},

	detailFile: function(bid, docno, type, detail) {
		var me = this;
		var args = {
			bid: bid,
			docno: docno,
			detail: detail
		};
		var key = this.getKey(type, args);
		if (args.bid && args.docno) {
			this.hideErrorArea();
			DA.param.library.bid = bid;
			DA.param.library.docno = docno;
			this.jsonConExecute(type, args, true, key, {
				onSuccess: function() {
					DA.navigationController.autoScroll();
					DA.libraryFile.setDirectly();
				}
			});
		}
	},

	setDirectly: function(sub) {
		// for request from url
		if (DA.vars.directlyLibrary === true) {
			DA.navigationController.hiddenFooterBtn();
		} else if (DA.vars.directlyLibFile === true) {
			if (sub === 'reply') {
				DA.navigationController.hiddenFooterBtn();
			} else {
				DA.navigationController.hiddenHeaderLeftBtn();
				DA.navigationController.hiddenFooterBtn();
			}
		}
	},

	goBack: function() {
		DA.navigationController.simpleBackPage('DA_library_list_Id');
		var args = {
			bid: DA.param.library.bid,
		};
		var title = DA.param.library.folderTitle;
		DA.libraryList.getFileList(args, title);
	},

	goBackToCom: function() {
		DA.navigationController.simpleBackPage('DA_library_file_com_Id');
		var bid = DA.param.library.bid;
		var docno = DA.param.library.docno;
		var show = DA.param.library.view;
		DA.libraryFile.detailFile(bid, docno, 'com_file', show);
	},

	hideErrorArea: function() {
		var page_id;
		if ($("#DA_library_file_error_page_Id")) {
			page_id = $("#DA_library_file_error_page_Id").val();
			$("#" + page_id).children().show();
			$("#" + page_id + "_error_area").hide();
		}
	},
	
	fileReload: function(type){
		var args = {
			bid : DA.param.library.bid,
			docno : DA.param.library.docno
		};
		this.hideErrorArea();
		var key = this.getKey('reload', args);
		this.jsonConExecute(type, args, true, key, {
				onSetContents: function(url, params, cache){
					DA.libraryFile.setDirectly(type);
				}
		});
	},

	toggleHeader: function(type) {
		var els = new Array();
		var el_text;
		if (type === 'text') {
			els.push(
				$("#DA_lib_text_file_category_Id"),
				$("#DA_lib_text_file_update_date_Id"),
				$("#DA_lib_text_file_importance_Id")
			);
			el_text = $("#DA_library_text_file_hidden_link_Id");
		} else if (type === 'com') {
			els.push(
				//$("#DA_lib_com_file_reply_count_Id"),
				$("#DA_lib_com_file_create_date_Id"),
				$("#DA_lib_com_file_importance_Id"),
				$("#DA_lib_com_file_point_Id")
			);
			el_text = $("#DA_library_com_file_hidden_link_Id");
		}
		if (els[0].attr("class").match(/DA_header_open_class/)) {
			DA.param.library.view = 'close';
			els.forEach(function(item, index, array){
				item.addClass("DA_header_close_class").removeClass("DA_header_open_class");
			});
			el_text.text(DA.vars.libShowWord);
		} else {
			DA.param.library.view = 'open';
			els.forEach(function(item, index, array){
				item.addClass("DA_header_open_class").removeClass("DA_header_close_class");
			});
			el_text.text(DA.vars.libHiddenWord);
		}
	},

	toggleFlagged: function(args, id) {
		var me = this;
		var el = $("#" + id);
		if (el) {
			if (args.bid && args.docno && args.type) {
				if (el.attr("class").match(/DA_library_flag_on_class/)) {
					args.library_func = "unset";
					var key = this.getKey('mark', args);
					this.jsonConExecute('mark', args, true, key);
				} else {
					args.library_func = "set";
					var key = this.getKey('mark', args);
					this.jsonConExecute('mark', args, true, key);
				}
			}
		}
	},

	jsonConExecute: function(sub, args, nocache, key, hash) {
		//if (nocache) {
		//	jsonCon.executeCache($.extend({ func: 'library', sub: sub }, args), key, hash);
		//}
		jsonCon.execute($.extend({ func: 'library', sub: sub }, args), key, nocache, hash);
	},

	getKey: function(sub, args) {
		var id = 'library_' + sub + '_' + args.docno;
		return id;
	},

};

