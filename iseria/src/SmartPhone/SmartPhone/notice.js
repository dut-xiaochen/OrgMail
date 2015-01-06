DA.param.notice = {
	id     : 0,
	sid    : 0,
	idlst  : [],
};

DA.notice = {
	toggleHeader: function() {
		var el1 = $("#DA_notice_detail_show_link_Id");
		var el2 = $("#DA_notice_detail_hide_link_Id");
		var el3 = $("#DA_notice_detail_show_div_Id");
		if (el1.attr("class").match (/DA_header_open_class/)) {
			el1.addClass("DA_header_close_class").removeClass("DA_header_open_class");
			el2.addClass("DA_header_open_class").removeClass("DA_header_close_class");
			el3.addClass("DA_header_open_class").removeClass("DA_header_close_class");
		} else {
			el1.addClass("DA_header_open_class").removeClass("DA_header_close_class");
			el2.addClass("DA_header_close_class").removeClass("DA_header_open_class");
			el3.addClass("DA_header_close_class").removeClass("DA_header_open_class");
		}
	},
	
	detailNotice: function(id, imp, sno) {
		var args = {
			id : id,
		};
		var key = this.getKey('detail', 'Id');
		if (id) {
			DA.param.notice.id = id;
			DA.param.notice.sno= sno;
			this._set_imp_class(imp);
			var msg = DA.util.gettext(DA.vars.detailCountMsg, [DA.param.notice.idlst.length, sno]);
			
			this.jsonConExecute('detail', args, true, key, {
				onSuccess: function(url, params, cache){
					var ids = [
						"DA_notice_detail_edit_Id",
						"DA_notice_detail_from_Id",
						"DA_notice_detail_type_Id",
						"DA_notice_detail_level_Id",
					];
					jQuery.each( ids, function(){
						var id = "#"+this;
						var ctrl_target = $(id).closest('div[da_notice_disp_control_area=1]');
						if (DA.util.isEmpty($(id).html())) {
							ctrl_target.hide();
						} else {
							ctrl_target.show();
						}
					});
					if (DA.util.isEmpty($("#DA_notice_detail_body_Id").html())) {
						$("#DA_notice_detail_Fieldset1").hide();
					} else {
						$("#DA_notice_detail_Fieldset1").show();
					}
					if (DA.notice._get_portal_read(id)) {
						$("#DA_notice_detail_read_btn_Id").show();	
					} else {
						$("#DA_notice_detail_read_btn_Id").hide();
					}
					
					DA.notice._set_btn_lnk_class(sno);
					$("#DA_notice_detail_count_Id").text(msg);
					
					DA.action.scrollTop();
				}
			});
		}
	},
	
	_set_btn_lnk_class: function (sno) {
		var class_l = "DA_footbtnlist_l_disable_class";
		var class_r = "DA_footbtnlist_r_disable_class";
		if (sno <= 1) {
			$("#DA_notice_detail_prev_btn_Id").addClass(class_l);
			$("#DA_notice_detail_prev_lnk_Id").hide();	
		} else {
			$("#DA_notice_detail_prev_btn_Id").removeClass(class_l);
			$("#DA_notice_detail_prev_lnk_Id").show();
		}
		if (sno >= DA.param.notice.idlst.length){
			$("#DA_notice_detail_next_btn_Id").addClass(class_r);
			$("#DA_notice_detail_next_lnk_Id").hide();
		} else {
			$("#DA_notice_detail_next_btn_Id").removeClass(class_r);
			$("#DA_notice_detail_next_lnk_Id").show();
		}
	},
	
	_set_portal_class: function (id) {
		var li_el = $("#DA_notice_portal_" + id);
		if (li_el.hasClass("DA_ico_nsboard_close_class")) {
			li_el.removeClass("DA_ico_nsboard_close_class");
		}
	},
	
	_get_portal_read: function (id) {
		var li_el = $("#DA_notice_portal_" + id);
		if (li_el.hasClass("DA_ico_nsboard_close_class")) {
			return true;
		} else {
			return false;
		}
		
	},
	
	_set_imp_class: function(imp) {
		var el = $("#DA_notice_status_class_Id");
		var clas = [
			"DA_notice_status_high_class",
			"DA_notice_status_middle_class",
			"DA_notice_status_low_class",
		];
		if (el.hasClass(clas[imp-1])) {
			return 1;
		} else {
			jQuery.each(clas, function() {
				if (el.hasClass(this)) {
					el.removeClass(this);
				}
			});
			el.addClass(clas[imp-1]);
		}
	},
	
	setRead: function() {
		var args = {
			id: DA.param.notice.id
		};

		var key = this.getKey('set', 'Id');
		if (DA.param.notice.id) {
			this.jsonConExecute('set', args, true, key, {
				onSuccess: function(url, params, cache){
					$("#DA_notice_detail_read_btn_Id").hide();
					DA.notice._set_portal_class(DA.param.notice.id);	
				}
			});
		}
	},
	
	setIdlst: function(idlst){
		DA.param.notice.idlst = idlst;	
	},
	
	nextNotice: function(type){
		var sno = DA.param.notice.sno;
		var idlst = DA.param.notice.idlst;
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
		if (ary[0] === DA.param.notice.id) {
			return 0;
		} else {
			this.detailNotice(ary[0], ary[1], sno);	
		}
	},
	
	getKey : function (sub, id) {
		return "notice_" + sub + "_"+ id;
	},
	
	jsonConExecute: function(sub, args, nocache, key, hash) {
		if (nocache) {
			jsonCon.executeCache($.extend({ func: 'notice', sub: sub }, args), key, hash);
		}
		jsonCon.execute($.extend({ func: 'notice', sub: sub }, args), key, true, hash);
	}
};

DA.customEvent.set("navigationController.slidePage", function(params) {
});

DA.customEvent.set("navigationController.backPage", function(params) {
});

DA.customEvent.set("navigationController.slideDone", function(params) {
});

DA.customEvent.set("contentsController.onSuccess", function(params) {
});

DA.customEvent.set("contentsController.onFailure", function(params) {
});

DA.customEvent.set("navigationController.frickTop", function(params) {
});

DA.customEvent.set("navigationController.frickTop", function(params) {
});


