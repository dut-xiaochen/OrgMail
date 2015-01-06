DA.nsboard = {

	launcherClick: function(func,sub,param){
		this.listReload();
	},

	toggleHeader: function() {
		var el1 = $("#DA_nsboard_detail_show_link_Id");
		var el2 = $("#DA_nsboard_detail_hide_link_Id");
		var el3 = $("#DA_nsboard_detail_show_div_Id");
		var el4 = $("#DA_nsboard_attach_div_Id");
		if (DA.param.nsboard.open_f) {
			el1.hide();
			el4.hide();
			el2.show();
			el3.show();
		} else {
			el1.show();
			el4.show();
			el2.hide();
			el3.hide();		
		}
		DA.param.nsboard.open_f=(DA.param.nsboard.open_f === 1)?0:1;
	},

	addNextList: function() {
		var cid = $("#DA_nsboard_list_category_select_Id").val();
		var args = {
			view : cid,
			text : DA.param.nsboard.list.text,
			importance : DA.param.nsboard.list.importance,
			start_date_begin : DA.param.nsboard.list.sDateBegin,
			start_date_finish : DA.param.nsboard.list.sDateFinish,
			unread : DA.param.nsboard.list.unread,
			mark : DA.param.nsboard.list.mark,
			page : DA.util.isNumber(DA.param.nsboard.list.page) ? DA.param.nsboard.list.page : 1
		};
		DA.param.nsboard.list.categoryId = args.view;
		DA.param.nsboard.list.page = args.page = args.page + 1;

		var key = this.getKey('appendList', 'Id');
		this.appendJsonConExecute('listOnly', args, true, key, {
			onSuccess: function(o, params, hash) {
				DA.nsboard.setAllIdlst();
			}
		});
	},

	checkDate: function(dBegin, dFinish, max_month) {
		if (!max_month) { return true; }
		var sDate = dBegin.split('\/', 3);
		var eDate = dFinish.split('\/', 3);
		var e_date = eDate[0] + eDate[1] + eDate[2];
		var n_date = this.computeMonth(sDate[0], sDate[1], sDate[2], max_month);
		if ( e_date > n_date) {
			var errMsg = DA.vars.nsboardStartDateErrMsg;
			errMsg = DA.util.gettext(DA.vars.nsboardStartDateErrMsg, [max_month]);
			alert(errMsg);
			return false;
		} else {
			return true;
		}
	},

	zeroSuppress: function( val ) {
		return val.replace( /^0+([0-9]+)/, "\$1" );
	},

	computeMonth: function(year, month, day, addMonths) {
		year   = parseInt(this.zeroSuppress(year));
		month  = parseInt(this.zeroSuppress(month));
		day    = parseInt(this.zeroSuppress(day));
		month += parseInt(addMonths);
		var endDay = this.getMonthEndDay(year, month);
		if(day > endDay) day = endDay;
		var dt = new Date(year, month - 1, day);
		var yy = dt.getFullYear();
		var mm = dt.getMonth() + 1;
		var dd = dt.getDate();
		if ( mm < 10 ) {  mm = '0' + mm; }
		if ( dd < 10 ) {  dd = '0' + dd; }
		var str = yy.toString() + mm.toString() + dd.toString();
		return str;
	},

	getMonthEndDay: function(year, month) {
		var dt = new Date(year, month, 0);
		return dt.getDate();
	},

	toggleFilter: function(type) {
		var pattern, str;
		switch(type) {
			case 'unread':
				pattern = /DA_footbtnlist_l_on_class/i;
				str = DA.util.get("DA_footnavi_nsboard_unread_Id").attr("class");
				if (pattern.test(str)) {
					DA.param.nsboard.list.unread = 'on';
				} else {
					DA.param.nsboard.list.unread = 'off';
				}
				break;
			case 'mark':
				pattern = /DA_footbtnlist_r_on_class/i;
				str = DA.util.get("DA_footnavi_nsboard_mark_Id").attr("class");
				if (pattern.test(str)) {
					DA.param.nsboard.list.mark = 'on';
				} else {
					DA.param.nsboard.list.mark = 'off';
				}
				break;
			default:
				break;
		}
		DA.navigationController.autoScroll();
		this.doSearch();
	},
	
	listCategoryChange: function() {
		var args = this.getSearchArgs();
		this.gotoList(args);
	},

	listTextSubmit: function() {
		var args = this.getSearchArgs();
		this.gotoList(args,'listOnly');
	},

	toggleDetailSearch: function() {
		var detailTag = $("#DA_nsboard_detail_search_link_Id");
		var detailLink = $("#DA_nsboard_search_hidden_link_Id");
		if (detailTag.attr("class").match(/DA_header_open_class/)) {
			DA.param.nsboard.list.isDetail = 'off';
			detailTag.addClass("DA_header_close_class").removeClass("DA_header_open_class");
			detailLink.text(DA.vars.nsDetailShowWord);
		} else {
			DA.param.nsboard.list.isDetail = 'on';
			detailTag.addClass("DA_header_open_class").removeClass("DA_header_close_class");
			detailLink.text(DA.vars.nsDetailHiddenWork);
		}
	},
	viewCatFromList: function(target,from){
		var sDateBegin = $("#DAnsboardStartDate_begin_Id").val();
		var sDateFinish = $('#DAnsboardStartDate_finish_Id').val();
		var r = DA.nsboard.checkDate(sDateBegin, sDateFinish, DA.param.nsboard.list.maxMonth);
		if(!r){return ;}
		this.setSearchArgs();
		DA.nsboard.viewCat(target,from);
		DA.nsboard.slideToCatPage();
		
	},

	viewCat: function(target,from) {
		var args = {
			target : target,
		};
		if('list' === from){
			DA.param.nsboard.fromPage = 'list';
		}else if('portal' === from){
			DA.param.nsboard.fromPage = 'portal';
		}
		var key = this.getKey('cat' + target, 'Id');
		if(target > 0) {
			var id = 'DA_nsboard_cat_list_' + target;
			var subid = 'DA_nsboard_cat_subCatOf_' + target;
			if($('#' + subid).length <= 0){
				this.appendJsonConExecute('cat',args,true,key,{
					onSuccess:function(){
						$('#'+subid).hide();
						$('#'+id).children("a").attr("href","javascript:DA.nsboard.deleteSubCat("+target+")");
						DA.action.toggleSlideUpDown(subid);
					}
				});
			}else{
				$('#'+id).children("a").attr("href","javascript:DA.nsboard.deleteSubCat("+target+")");
				DA.action.toggleSlideUpDown(subid);
			}
			$('#'+id).removeClass("DA_list_down_arrow_class");
			$('#'+id).addClass("DA_list_up_arrow_class");
		}else {
			this.clearCatList();
			this.jsonConExecute('cat', args, true, key, {});
		}
	},

	deleteSubCat: function(target) {
		var id = 'DA_nsboard_cat_list_' + target;
		var subid = 'DA_nsboard_cat_subCatOf_' + target;
		DA.action.toggleSlideUpDown(subid);
		$('#'+id).children("a").attr("href","javascript:DA.nsboard.viewCat("+target+")");
		$('#'+id).removeClass("DA_list_up_arrow_class");
		$('#'+id).addClass("DA_list_down_arrow_class");
		DA.navigationController.autoScroll();
	},

	toggleFlagged: function(id) {
		var args = {id: id};
		var key = this.getKey('mark',args);
		this.jsonConExecute('mark',args,true,key);
	},

	doSearch: function() {
		var args = this.getSearchArgs();
		this.gotoList(args,'listOnly');
	},

	setSearchArgs: function(p_args) {
		var args;
		if (p_args === undefined) {
			args = this.getSearchArgs();
		} else {
			args = p_args;
		}

		if (args.view === undefined) {
			args.view = DA.param.nsboard.list.categoryId;
		}
		if (args.text === undefined) {
			args.text = DA.param.nsboard.list.text;
		}
		if (args.importance === undefined) {
			args.importance = DA.param.nsboard.list.importance;
		}
		if (args.start_date_begin === undefined) {
			args.start_date_begin = DA.param.nsboard.list.sDateBegin;
		}
		if (args.start_date_finish === undefined) {
			args.start_date_finish = DA.param.nsboard.list.sDateFinish;
		}
		if (args.page === undefined) {
			args.page = 1;
		}
		if (args.unread === undefined) {
			args.unread = DA.param.nsboard.list.unread;
		}
		if (args.mark === undefined) {
			args.mark = DA.param.nsboard.list.mark;
		}
		if (args.isDetail === undefined) {
			args.isDetail = DA.param.nsboard.list.isDetail;
		}
		DA.param.nsboard.list.text = args.text;
		DA.param.nsboard.list.importance = args.importance;
		DA.param.nsboard.list.sDateBegin = args.start_date_begin;
		DA.param.nsboard.list.sDateFinish = args.start_date_finish;
		DA.param.nsboard.list.page = args.page;
		DA.param.nsboard.list.unread = args.unread;
		DA.param.nsboard.list.mark = args.mark;
		DA.param.nsboard.list.isDetail = args.isDetail;
	},

	getSearchArgs: function() {
		var cid = $("#DA_nsboard_list_category_select_Id").val();
		var text = $("#DA_nsboard_list_search_text_input_Id").val();
		var importance = $("#DA_nsboard_list_importance_select_Id").val();
		var sDateBegin = $("#DAnsboardStartDate_begin_Id").val();
		var sDateFinish = $('#DAnsboardStartDate_finish_Id').val();
		var args = {
			view : cid,
			text : text,
			importance : importance,
			start_date_begin : sDateBegin,
			start_date_finish : sDateFinish,
			mark : DA.param.nsboard.list.mark,
			unread : DA.param.nsboard.list.unread,
			isDetail : DA.param.nsboard.list.isDetail,
			page : 1
		};
		return args;
	},

	updateList: function(target,idArrary){
		if(target == 0){
			DA.nsboard.viewCat(0);
		}
	},

	clearCatList: function(){
		$('#DA_nsboard_cat_contents_Id').html('');
	},

	appendAfter: function(target,idArrary) {
		var length = idArrary.length;
		var t_obj = $('#' + target);
		for (i = length-1;i>=0;i--){
			$('#'+idArrary[i]).insertAfter(t_obj);
		}
	},
	gotoListFromCat: function(args,type) {
		DA.nsboard.backToListPage();
		DA.nsboard.gotoList(args,type);
	},
	gotoList: function(args,type) {
		this.setSearchArgs(args);
		
		if (DA.util.isEmpty(type)) {
			type = 'list';
		}
		var r = DA.nsboard.checkDate(DA.param.nsboard.list.sDateBegin, DA.param.nsboard.list.sDateFinish, DA.param.nsboard.list.maxMonth);
		if(!r){return;}
		this.clearList();
		DA.navigationController.autoScroll();
		var key = this.getKey(type, 'Id');
		this.jsonConExecute(type, args, true, key, {
			onSuccess: function(url, params, cache){
				//DA.nsboard.setFooterBtns();
			}
		});
	},

	setFooterBtns: function() {
		var unreadBtn = DA.util.get("DA_footnavi_nsboard_unread_Id");
		var markBtn = DA.util.get("DA_footnavi_nsboard_mark_Id");
		if (DA.param.nsboard.list.unread === 'on') {
			unreadBtn.addClass("DA_footbtnlist_l_on_class").removeClass("DA_footbtnlist_l_class");
		}else{
			unreadBtn.addClass("DA_footbtnlist_l_class").removeClass("DA_footbtnlist_l_on_class");
		}
		if (DA.param.nsboard.list.mark === 'on') {
			markBtn.addClass("DA_footbtnlist_r_on_class").removeClass("DA_footbtnlist_r_class");
		}else{
			markBtn.addClass("DA_footbtnlist_r_class").removeClass("DA_footbtnlist_r_on_class");
		}
	},

	clearList: function() {
		DA.util.get('DA_nsboard_content_list_Id').html('');
		DA.param.nsboard.all_idlst = [];
		DA.param.nsboard.useAllIdlst = false;
	},

	listReload: function() {
		this.resetList();
		this.setFooterBtns();
		this.gotoList({});
	},

	resetList: function() {
		DA.param.nsboard.list.categoryId = DA.param.nsboard.list_def.categoryId;
		DA.param.nsboard.list.text = DA.param.nsboard.list_def.text;
		DA.param.nsboard.list.importance = DA.param.nsboard.list_def.importance;
		DA.param.nsboard.list.sDateBegin = DA.param.nsboard.list_def.sDateBegin;
		DA.param.nsboard.list.sDateFinish = DA.param.nsboard.list_def.sDateFinish;
		DA.param.nsboard.list.page = DA.param.nsboard.list_def.page;
		DA.param.nsboard.list.unread = DA.param.nsboard.list_def.unread;
		DA.param.nsboard.list.mark = DA.param.nsboard.list_def.mark;
		DA.param.nsboard.list.isDetail = DA.param.nsboard.list_def.isDetail;

		this.hiddenDetailSearch();
	},

	hiddenDetailSearch: function() {
		var detailTag = $("#DA_nsboard_detail_search_link_Id");
		var detailLink = $("#DA_nsboard_search_hidden_link_Id");
		if (detailTag.attr("class").match(/DA_header_open_class/)) {
			detailTag.addClass("DA_header_close_class").removeClass("DA_header_open_class");
			detailLink.text(DA.vars.nsDetailShowWord);
		}
	},

	detailNsboard: function(id, imp, ach, sno, from) {
		var args = {
			id : id,
		};
		var list;
		if('list' === from){
			DA.param.nsboard.fromPage = 'list';
			if (DA.param.nsboard.useAllIdlst) {
				list = DA.param.nsboard.all_idlst;
			} else {
				list = DA.param.nsboard.result_idlst;
			}
		}else{
			DA.param.nsboard.fromPage = 'portal';
			list = DA.param.nsboard.idlst;
		}
		var key = this.getKey('detail', 'Id');
		if (id) {
	
			if ( ! list.length ) {
				list = new Array;
				list[0] = 1;
				sno=0;
			}
			
			DA.param.nsboard.id = id;
			DA.param.nsboard.sno= sno;
			this._set_imp_class(imp);
			this._set_ach_class(ach);
			var msg = DA.util.gettext(DA.vars.detailCountMsg, [list.length, sno]);
			
			this.jsonConExecute('detail', args, true, key, {
				onSuccess: function(url, params, cache){
					var ids = [
						"DA_nsboard_detail_type_Id",
						"DA_nsboard_detail_cate_Id",
						"DA_nsboard_detail_import_Id",
						"DA_nsboard_detail_read_Id",
						"DA_nsboard_detail_attach_Id",
						"DA_nsboard_detail_link_Id",
					];
					jQuery.each ( ids, function(){
						var id = "#"+this;
						var ctrl_target = $(id).closest('div[da_nsboard_disp_control_area=1]');
						if (DA.util.isEmpty($(id).html())) {
							ctrl_target.hide();
						} else {
							ctrl_target.show();
						}
					});
					if (DA.util.isEmpty($("#DA_nsboard_detail_body_Id").html())) {
						$("#DA_nsboard_detail_Fieldset1").hide();
					} else {
						$("#DA_nsboard_detail_Fieldset1").show();
					}
					$("#DA_nsboard_detail_unread_btn_Id").show();
					if('list' === from){
						DA.nsboard._set_list_class(id,'open');
					}else{
						DA.nsboard._set_portal_class(id, 'open');
					}
					DA.nsboard._set_btn_lnk_class(sno);
					$("#DA_nsboard_detail_count_Id").text(msg);
					
					DA.action.scrollTop();
				}
			});
		}
	},
	
	_set_btn_lnk_class: function (sno) {
		var class_l = "DA_footbtnlist_l_disable_class";
		var class_r = "DA_footbtnlist_r_disable_class";
		var idlst;
		if (DA.param.nsboard.fromPage === 'list') {
			if (DA.param.nsboard.useAllIdlst) {
				idlst = DA.param.nsboard.all_idlst;
			} else {
				idlst = DA.param.nsboard.result_idlst;
			}
		} else {
			idlst = DA.param.nsboard.idlst;
		}
		if (sno <= 1) {
			$("#DA_nsboard_detail_prev_btn_Id").addClass(class_l);
			$("#DA_nsboard_detail_prev_lnk_Id").hide();	
		} else {
			$("#DA_nsboard_detail_prev_btn_Id").removeClass(class_l);
			$("#DA_nsboard_detail_prev_lnk_Id").show();
		}
		if (sno >= idlst.length){
			$("#DA_nsboard_detail_next_btn_Id").addClass(class_r);
			$("#DA_nsboard_detail_next_lnk_Id").hide();
		} else {
			$("#DA_nsboard_detail_next_btn_Id").removeClass(class_r);
			$("#DA_nsboard_detail_next_lnk_Id").show();
		}
	},
	
	_set_portal_class: function (id, type) {
		var li_el = $("#DA_nsboard_portal_" + id);
		var cls   = "DA_ico_nsboard_close_class";
		if (type === 'close') {
			li_el.addClass(cls);
		} else if (type === 'open') { 
			if (li_el.hasClass (cls)) {
				li_el.removeClass(cls);
			}
		}
	},

	_set_list_class: function (id, type) {
		var li_el = $("#DA_nsboard_list_" + id);
		var cls   = "DA_ico_nsboard_close_class";
		if (type === 'close') {
			li_el.addClass(cls);
		} else if (type === 'open') { 
			if (li_el.hasClass (cls)) {
				li_el.removeClass(cls);
			}
		}
	},
	
	_set_imp_class: function(imp) {
		var el = $("#DA_nsboard_status_class_Id");
		var clas = [
			"DA_notice_status_none_class",
			"DA_notice_status_low_class",
			"DA_notice_status_middle_class",
			"DA_notice_status_high_class"
		];
		if (el.hasClass(clas[imp])) {
			return 1;
		} else {
			jQuery.each(clas, function() {
				if (el.hasClass(this)) {
					el.removeClass(this);
				}
			});
			el.addClass(clas[imp]);
		}
	},
	
	_set_ach_class: function(ach) {
		var ach_el = $("#DA_nsboard_attach_class_Id");
		var el_c  = "DA_detail_attach_on_class";
		if (ach === '1') {
			if (ach_el.hasClass(el_c)) {
				return 1;
			}
			ach_el.addClass(el_c);	
		} else if (ach_el.hasClass(el_c)) {
			ach_el.removeClass(el_c);	
		}
	},
	
	setUnread: function() {
		var args = {
			id: DA.param.nsboard.id
		};

		var key = this.getKey('reset', 'Id');
		if (DA.param.nsboard.id) {
			this.jsonConExecute('reset', args, true, key, {
				onSuccess: function(url, params, cache){
					$("#DA_nsboard_detail_unread_btn_Id").hide();

					if (DA.param.nsboard.fromPage === 'list') {
						DA.nsboard._set_list_class(DA.param.nsboard.id, 'close');
					}else{
						DA.nsboard._set_portal_class(DA.param.nsboard.id, 'close');
					}
				}
			});
		}
	},
	
	setIdlst: function(idlst){
		DA.param.nsboard.idlst = idlst;
	},
	
	setResultIdlst: function(idlst){
		DA.param.nsboard.result_idlst = idlst;
		if ( ! DA.param.nsboard.useAllIdlst ) {
			DA.param.nsboard.all_idlst = idlst;
			DA.param.nsboard.useAllIdlst = true;
		}
	},

	setAllIdlst: function(){
		var all_idlst = DA.param.nsboard.all_idlst;
		DA.param.nsboard.all_idlst = all_idlst.concat(DA.param.nsboard.result_idlst);
	},
	
	setBackBtnView: function(sub){
		if('portal' === sub){
			$('#backButton').attr('href','#DA_portal_list_Id');
			$('#backButton').text('TOP');
		}else{
			$('#backButton').attr('href','#DA_nsboard_list_Id');
			$('#backButton').text(DA.vars.backTitleBack);
		}
	},
	backToListPage: function() {
		//slide left
		DA.navigationController.backPage({
			event : null,
			link : null,
			func : 'nsboard',
			sub : 'list',
			}, 'DA_nsboard_list_Id');
	},
	slideToCatPage: function() {
		//slide left
		DA.navigationController.slidePage({
			event : null,
			link : null,
			func : 'nsboard',
			sub : 'cat',
			}, 'DA_nsboard_cat_Id');
	},
	nextNsboard: function(type){
		var sno = DA.param.nsboard.sno;
		var idlst;
		if('list' === DA.param.nsboard.fromPage){
			if (DA.param.nsboard.useAllIdlst) {
				idlst = DA.param.nsboard.all_idlst;
			} else {
				idlst = DA.param.nsboard.result_idlst;
			}
		}else{
			idlst = DA.param.nsboard.idlst;
		}
		var length = idlst.length;
		var res = {};
		if (type === "prev") {
			sno --;
		} else {
			sno ++;
		}
		if (sno < 1) {
			sno = 1;
		}
		if (sno > length) {
			sno = length;
		}
		var ary = idlst[sno-1].split(/\_/);
		if (ary[0] === DA.param.nsboard.id) {
			return 0;
		} else {
			this.detailNsboard(ary[0], ary[1], ary[2], sno, DA.param.nsboard.fromPage);
		}
	},
	
	getKey : function (sub, id) {
		return "nsboard_" + sub + "_"+ id;
	},
	
	jsonConExecute: function(sub, args, nocache, key, hash) {
		if (nocache && sub !== 'cat' && sub !== 'list' && sub !== 'listOnly') {
			jsonCon.executeCache($.extend({ func: 'nsboard', sub: sub }, args), key, hash);
		}
		jsonCon.execute($.extend({ func: 'nsboard', sub: sub }, args), key, true, hash);
	},
	appendJsonConExecute: function(sub, args, nocache, key, hash) {
		appendJsonCon.execute($.extend({ func: 'nsboard', sub: sub }, args), key, nocache, hash);
	},
};

DA.customEvent.set("navigationController.slidePage", function(params) {
});

DA.customEvent.set("navigationController.backPage", function(params) {
	var func = params.func;
	var sub = params.sub;
	if(func === 'nsboard') {
		switch(sub) {
			case 'list':
				document.getElementById('backButton').onclick = DA.nsboard.setFooterBtns();
				break;
			case 'detail':
				break;
			case 'cat':
				break;
		}
	}
});

DA.customEvent.set("navigationController.slideDone", function(params) {
	var func = params.func;
	var sub = params.sub;
	var from;
	var page;
	if(func === 'nsboard') {
		switch(sub){
			case 'list':
				break;
			case 'cat':
				if('list' === DA.param.nsboard.fromPage) {
					DA.nsboard.setBackBtnView('list');
				}else if('portal' === DA.param.nsboard.fromPage){
					DA.nsboard.setBackBtnView('portal');
				}
				break;
			case 'detail':
				if('list' === DA.param.nsboard.fromPage) {
					DA.nsboard.setBackBtnView('list');
				}else if('portal' === DA.param.nsboard.fromPage){
					DA.nsboard.setBackBtnView('portal');
				}
				break;
		}
	}
});

DA.customEvent.set("contentsController.onSuccess", function(params) {
});

DA.customEvent.set("contentsController.onFailure", function(params) {
});

DA.customEvent.set("navigationController.frickTop", function(params) {
});

DA.customEvent.set("navigationController.frickTop", function(params) {
});


DA.customEvent.set("window.onload", function() {

	var d_str = (DA.vars.calendarDayStr) ? DA.vars.calendarDayStr : {};
	var m_str = (DA.vars.calendarMonthStr) ? DA.vars.calendarMonthStr : {};
	var m_short_str = (DA.vars.calendarMonthShortStr) ? DA.vars.calendarMonthShortStr : {};
	var lang = DA.vars.userLang;
	var picker_data = {
		showButtonPanel: true,
		firstDay: DA.vars.calendarFirstDay,
		nextText: "",
		prevText: "",
		closeText: "",
		showOtherMonths: true,
		selectOtherMonths: true,
		changeMonth:true,
		changeYear:true,
		dateFormat: 'yy/mm/dd',
		monthNames: [
			m_str[1], m_str[2], m_str[3], m_str[4], m_str[5], m_str[6], 
			m_str[7], m_str[8], m_str[9], m_str[10], m_str[11], m_str[12]
		],
		monthNamesShort: [
			m_short_str[1], m_short_str[2], m_short_str[3], m_short_str[4], m_short_str[5], m_short_str[6], 
			m_short_str[7], m_short_str[8], m_short_str[9], m_short_str[10], m_short_str[11], m_short_str[12]
		],
		showMonthAfterYear: ('ja'===lang || ''===lang) ? true : false,
		dayNamesMin: [d_str.sun, d_str.mon, d_str.tue, d_str.wed, d_str.thu, d_str.fri, d_str.sat],
		showOn: 'focus',
		// buttonImage: DA.vars.imgRdir + "/mo_ico_subwin_arrow.png",
		showAnim: 'slideDown',
		beforeShow: function () {
			DA.navigationController.hiddenFooter();
			jQuery("#DAnsboardStartDate_begin_Id").css({
				visibility   : 'hidden'
			});
			jQuery("#DAnsboardStartDate_finish_Id").css({
				visibility   : 'hidden'
			});
		},
		onClose: function () {
			DA.navigationController.showFooter();
			jQuery("#DAnsboardStartDate_begin_Id").css({
				visibility   : 'visible'
			});
			jQuery("#DAnsboardStartDate_finish_Id").css({
				visibility   : 'visible'
			});
		},
		onSelect: function (dateText, inst) {
			var origin_date;
			var r;
			if (inst.id === "DAnsboardStartDate_begin_Id") {
				DA.param.nsboard.list.sDateBegin = dateText;
			} else if (inst.id === "DAnsboardStartDate_finish_Id") {
				DA.param.nsboard.list.sDateFinish = dateText;
			}
		},
	};
	var focus_action = function(ev) {
		// sunday color
		var png_url = "url(" + DA.vars.imgRdir + "/DA_sc_month_title_sunbg.png" + ")";
		jQuery('th:has(span[title="Sunday"])').css('background-image', png_url);

		var sel = "td.ui-datepicker-week-end:even a";
		if (DA.vars.calendarFirstDay) {
			sel = "td.ui-datepicker-week-end:odd a";
		}
		jQuery(sel).css('color','#C1311E');

		if (ev.target && ev.target.id) {
			var el = $("#" + ev.target.id);
			// var top = el.offset().top + el.height();
			var top = el.offset().top;
			jQuery("#ui-datepicker-div").css({
				top       : top + "px",
				left      : "0px",
				minHeight : "0px"
			});
		}
	};
	jQuery('#DAnsboardStartDate_begin_Id').datepicker(picker_data);
	jQuery('#DAnsboardStartDate_finish_Id').datepicker(picker_data);
	jQuery(function($){
		jQuery('#DAnsboardStartDate_begin_Id').focus( function(ev) {
			focus_action(ev);
		});
		jQuery('#DAnsboardStartDate_finish_Id').focus( function(ev) {
			focus_action(ev);
		});
	});
});


