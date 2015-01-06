DA.param.report = {
	page: 1
};

DA.report = {
	init: function() {
		DA.jQuery.restEnter("DA_report_list_keyword_Id", "DA_report_list_search_Id");
	},
	launcherClick: function(func, sub, param) {
		if (func === "report") {
			if (sub === "list") {
				this.listReload();
			}
		}
	},
	listReload: function(keyword) {
		var me = this;
		var args = {
			page: 1,
			keyword: DA.util.isEmpty(keyword) ? "" : keyword
		};
		var key = this.getKey('list', args);
		var onExecute = function() {
			var firstReq = me.detailReportParallelUrl(me.firstDocno());
			var req = [];
			if (firstReq) {
				req.push(firstReq);
			}

			if (req.length > 0) {
				readCon.execute(req);
			}
		};

		if (DA.util.isEmpty(keyword)) {
			DA.jQuery.setElValue("DA_report_list_keyword_Id", "");
		}

		DA.param.report.page = 1;
		this.jsonConExecute("list", args, false, true, key, {
			onSuccess: function() {
				onExecute();
			}
		});
	},
	searchSubmit: function() {
		var keyword = DA.jQuery.getElValue("DA_report_list_keyword_Id");
		if (keyword) {
			this.listReload(keyword);
		} else {
			alert(DA.vars.NoKeywordMsg);
		}
	},
	addNextList: function() {
		var args = {
			page: (DA.util.isNumber(DA.param.report.page) && DA.param.report.page > 0) ? DA.param.report.page : 1
		};
		var key = this.getKey('list', args);

		DA.param.report.page = args.page = args.page + 1;
		this.jsonConExecute('list', args, true, true, key);
	},
	setDocnolst: function(lst) {
		DA.param.report.docnolst = lst;
	},
	firstDocno: function() {
		var docnolst = DA.param.report.docnolst;

		var res = {};

		if (docnolst && docnolst.length > 0) {
			var ary = docnolst[0].split(/\_/);
			var length = docnolst.length;

			res = {
				ym: ary[0],
				docno: ary[1],
				sno: 0,
				total: length
			};
		}

		return res;
	},
	searchDocno: function(ym, docno, type) {
		var no = 0;
		var docnolst = DA.param.report.docnolst;

		var res = {};

		if (docnolst) {
			jQuery.each(docnolst, function() {
				if (this == ym + "_" + docno) {
					return false;
				}
				no ++;
			});

			var length = docnolst.length;

			if (type === "prev") {
				no --;
			} else if (type === "next") {
				no ++;
			}
			if (no < 0) {
				no = 0;
			}
			if (no >= length) {
				no = length - 1;
			}

			var ary = docnolst[no].split(/\_/);

			res = {
				ym: ary[0],
				docno: ary[1],
				sno: no + 1,
				total: length,
				isFirst: (no === 0) ? true : false,
				isLast: (no + 1 === length) ? true : false,
				from: type
			};
		}

		return res;
	},
	nextReport: function(ym, docno, type) {
		if (ym && docno) {
			var res = this.searchDocno(ym, docno, type);

			this.detailReport(res.ym || ym, res.docno || docno, res);
		}
	},
	detailReport: function(ym, docno, r, opt) {
		var me   = this;
		var args = {
			ym: ym,
			docno: docno,
			setRead: 1
		};
		if (args.ym && args.docno) {
			var key = this.getKey('detail', args);

			if (!r) {
				r = this.searchDocno(ym, docno);
			}

			var msg = DA.util.gettext(DA.vars.detailCountMsg, [r.total, r.sno]);
			var onExecute = function() {
				var prevReq;
				if (r.from !== "next") {
					prevReq = me.detailReportParallelUrl(me.searchDocno(ym, docno, "prev"));
				}
				var nextReq;
				if (r.from !== "prev") {
					nextReq = me.detailReportParallelUrl(me.searchDocno(ym, docno, "next"));
				}

				var req = [];
				if (prevReq) {
					req.push(prevReq);
				}
				if (nextReq) {
					req.push(nextReq);
				}

				if (req.length > 0) {
					readCon.execute(req);
					args.setRead=2;
					me.jsonConExecute('detail', args, false, true, key);
				}
			};
			var nextButton = function() {
				if (opt) {
					DA.jQuery.hiddenEl(me._detailElId("headPrevLink"));
					DA.jQuery.hiddenEl(me._detailElId("headNextLink"));
					DA.jQuery.hiddenEl(me._detailElId("prevLink"));
					DA.jQuery.hiddenEl(me._detailElId("nextLink"));
					DA.jQuery.hiddenEl(me._detailElId("count"));
				} else {
					if (r.isFirst) {
						DA.jQuery.hiddenEl(me._detailElId("prevLink"));
						DA.jQuery.getEl(me._detailElId("headPrevLink")).attr("href", "return false;").addClass("DA_footbtnlist_l_disable_class");
					} else {
						DA.jQuery.showEl(me._detailElId("prevLink"));
						DA.jQuery.getEl(me._detailElId("headPrevLink")).removeClass("DA_footbtnlist_l_disable_class");
					}
					if (r.isLast) {
						DA.jQuery.hiddenEl(me._detailElId("nextLink"));
						DA.jQuery.getEl(me._detailElId("headNextLink")).attr("href", "return false;").addClass("DA_footbtnlist_r_disable_class");
					} else {
						DA.jQuery.showEl(me._detailElId("nextLink"));
						DA.jQuery.getEl(me._detailElId("headNextLink")).removeClass("DA_footbtnlist_r_disable_class");
					}
					DA.jQuery.showEl(me._detailElId("count"));
				}
			};

			this.jsonConExecute('detail', args, false, false, key, {
				onSuccess: function() {
					$("#DA_report_detail_count_Id").text(msg);
					nextButton();
					DA.navigationController.autoScroll();
				},
				noExecute: function() {
					$("#DA_report_detail_count_Id").text(msg);
					nextButton();
					DA.navigationController.autoScroll();
				},
				onCache: function() {
					onExecute();
				}
			});
		}
	},
	detailReportParallelUrl: function(args) {
		var ym    = args.ym;
		var docno = args.docno;
		var req;

		if (ym && docno) {
			req = {
				url: DA.vars.spCgiRdir + "/sp_ajx_api.cgi?proc=contents_json&func=report&sub=detail&ym=" + ym + "&docno=" + docno,
				key: this.getKey('detail', args)
			};
		}

		return req;
	},
	showOtherReport: function() {
		DA.jQuery.hiddenEl(this._detailElId("other"));
		DA.jQuery.showEl(this._detailElId("otherReport"));
		DA.jQuery.addClassEl(this._detailElId("other"), "DA_report_import_off_class");
	},
	hiddenOtherReport: function() {
		DA.jQuery.hiddenEl(this._detailElId("otherReport"));
		DA.jQuery.showEl(this._detailElId("other"));
	},
	showReportInfo: function() {
		DA.jQuery.hiddenEl(this._detailElId("fieldset1"));
		DA.jQuery.showEl(this._detailElId("fieldset2"));
	},
	hiddenReportInfo: function() {
		DA.jQuery.hiddenEl(this._detailElId("fieldset2"));
		DA.jQuery.showEl(this._detailElId("fieldset1"));
	},
	showScheduleInfo: function() {
		DA.jQuery.hiddenEl(this._detailElId("fieldset3"));
		DA.jQuery.showEl(this._detailElId("fieldset4"));
	},
	hiddenScheduleInfo: function() {
		DA.jQuery.hiddenEl(this._detailElId("fieldset4"));
		DA.jQuery.showEl(this._detailElId("fieldset3"));
	},
	toggleAccessUser: function() {
		if (DA.jQuery.getEl(this._detailElId("accessUserArea2")).attr("class").match(/DA_report_import_on_class/)) {
			this.hiddenAccessUser();
		} else {
			this.showAccessUser();
		}
	},
	showAccessUser: function() {
		DA.jQuery.setElText(this._detailElId("accessUserLink2"), DA.vars.hiddenWord);
		DA.jQuery.getEl(this._detailElId("accessUserArea2L")).addClass("DA_report_import_off_class").removeClass("DA_report_import_on_class");
		DA.jQuery.getEl(this._detailElId("accessUserArea2")).addClass("DA_report_import_on_class").removeClass("DA_report_import_off_class");
	},
	hiddenAccessUser: function() {
		DA.jQuery.setElText(this._detailElId("accessUserLink2"), DA.vars.allMemberWord);
		DA.jQuery.getEl(this._detailElId("accessUserArea2")).addClass("DA_report_import_off_class").removeClass("DA_report_import_on_class");
		DA.jQuery.getEl(this._detailElId("accessUserArea2L")).addClass("DA_report_import_on_class").removeClass("DA_report_import_off_class");
	},
	toggleMember: function() {
		if (DA.jQuery.getEl(this._detailElId("memberArea3")).attr("class").match(/DA_report_import_on_class/)) {
			this.hiddenMember();
		} else {
			this.showMember();
		}
	},
	showMember: function() {
		DA.jQuery.setElText(this._detailElId("memberLink3"), DA.vars.hiddenWord);
		DA.jQuery.getEl(this._detailElId("memberArea3L")).addClass("DA_report_import_off_class").removeClass("DA_report_import_on_class");
		DA.jQuery.getEl(this._detailElId("memberArea3")).addClass("DA_report_import_on_class").removeClass("DA_report_import_off_class");
		DA.jQuery.setElText(this._detailElId("memberLink4"), DA.vars.hiddenWord);
		DA.jQuery.getEl(this._detailElId("memberArea4L")).addClass("DA_report_import_off_class").removeClass("DA_report_import_on_class");
		DA.jQuery.getEl(this._detailElId("memberArea4")).addClass("DA_report_import_on_class").removeClass("DA_report_import_off_class");
	},
	hiddenMember: function() {
		DA.jQuery.setElText(this._detailElId("memberLink3"), DA.vars.allMemberWord);
		DA.jQuery.getEl(this._detailElId("memberArea3")).addClass("DA_report_import_off_class").removeClass("DA_report_import_on_class");
		DA.jQuery.getEl(this._detailElId("memberArea3L")).addClass("DA_report_import_on_class").removeClass("DA_report_import_off_class");
		DA.jQuery.setElText(this._detailElId("memberLink4"), DA.vars.allMemberWord);
		DA.jQuery.getEl(this._detailElId("memberArea4")).addClass("DA_report_import_off_class").removeClass("DA_report_import_on_class");
		DA.jQuery.getEl(this._detailElId("memberArea4L")).addClass("DA_report_import_on_class").removeClass("DA_report_import_off_class");
	},
	_detailElId: function(type) {
		var id;
		switch(type) {
			case 'fieldset1':
				id = "DA_report_detail_fieldset1_Id";
				break;
			case 'fieldset2':
				id = "DA_report_detail_fieldset2_Id";
				break;
			case 'fieldset3':
				id = "DA_report_detail_fieldset3_Id";
				break;
			case 'fieldset4':
				id = "DA_report_detail_fieldset4_Id";
				break;
			case 'other':
				id = "DA_report_detail_other_Id";
				break;
			case 'otherReport':
				id = "DA_reoprt_detail_fieldset4_otherreport_area_Id";
				break;
			case 'accessUserLink2':
				id = "DA_report_detail_fieldset2_accessuser_link_Id";
				break;
			case 'accessUserArea2':
				id = "DA_report_detail_fieldset2_accessuser_area_Id";
				break;
			case 'accessUserArea2L':
				id = "DA_report_detail_fieldset2_accessuserlimited_area_Id";
				break;
			case 'memberLink3':
				id = "DA_report_detail_fieldset3_member_link_Id";
				break;
			case 'memberArea3':
				id = "DA_report_detail_fieldset3_member_area_Id";
				break;
			case 'memberArea3L':
				id = "DA_report_detail_fieldset3_memberlimited_area_Id";
				break;
			case 'memberLink4':
				id = "DA_report_detail_fieldset4_member_link_Id";
				break;
			case 'memberArea4':
				id = "DA_report_detail_fieldset4_member_area_Id";
				break;
			case 'memberArea4L':
				id = "DA_report_detail_fieldset4_memberlimited_area_Id";
				break;
			case 'headPrevLink':
				id = "DA_head_report_detail_prev_button_Id";
				break;
			case 'headNextLink':
				id = "DA_head_report_detail_next_button_Id";
				break;
			case 'prevLink':
				id = "DA_report_detail_prev_link_Id";
				break;
			case 'nextLink':
				id = "DA_report_detail_next_link_Id";
				break;
			case 'count':
				id = "DA_report_detail_count_Id";
				break;
			default:
				break;
		}
		return id;
	},
	getId: function(type) {
		var id;

		switch (type) {
		}

		return id;
	},
	getKey: function(sub, args) {
		var id;
		switch (sub) {
			case 'list':
				id = "report_" + sub;
				if (args.keyword) {
					id += "_keyword:" + args.keyword;
				}
				break;
			case 'detail':
				id = "report_" + sub + "_" + args.docno;
				break;
			default:
				break;
		}
		return id;
	},
	jsonConExecute: function(sub, args, append, nocache, key, hash) {
		if (append) {
			appendJsonCon.execute($.extend({ func: 'report', sub: sub }, args), key, nocache, hash);
		} else {
			if (nocache) {
				jsonCon.executeCache($.extend({ func: 'report', sub: sub }, args), key, hash);
			}
			jsonCon.execute($.extend({ func: 'report', sub: sub }, args), key, nocache, hash);
		}
	}
};

DA.customEvent.set("navigationController.slidePage", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;

	var fromFunc = params.fromFunc;
	var fromSub  = params.fromSub;

	if (func === "report") {
	}
});

DA.customEvent.set("navigationController.backPage", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;

	var fromFunc = params.fromFunc;
	var fromSub  = params.fromSub;

	if (func === "report") {
	}
});

DA.customEvent.set("navigationController.slideDone", function(params) {
	var func  = params.func;
	var sub   = params.sub;

	var fromPage  = params.fromPage;
	var toPage    = params.toPage;
	var backwards = params.backwards;

	if (func === "report") {
	}
});

DA.customEvent.set("contentsController.onSuccess", function(params) {
});

DA.customEvent.set("contentsController.onFailure", function(params) {
});

DA.customEvent.set("navigationController.frickTop", function(params) {
	var func  = params.func;
	var sub   = params.sub;

	if (func === "report") {
	}
});

DA.customEvent.set("navigationController.frickBottom", function(params) {
	var func  = params.func;
	var sub   = params.sub;

	if (func === "report") {
	}
});

