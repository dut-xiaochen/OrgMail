DA.param.config = {
};

DA.config = {
	launcherClick: function(func, sub, param) {
		if (func === "config") {
			if (sub === "edit") {
				this.jsonConExecute(sub, {}, this.getKey("config"));
			}
		}
	},
	configParams: function(type) {
		var args = {
			listline: DA.jQuery.getElValue(this.getId("listline")),
			portal_listline: DA.jQuery.getElValue(this.getId("portalListline")),
			touch_menu: DA.jQuery.getToggledElValue(this.getId("touchMenu")) === "true" ? "on" : "off",
			list_day: DA.jQuery.getElValue(this.getId("listDay")),
			list_type: DA.jQuery.getElValue(this.getId("listType")),
			sc_list_gid: DA.jQuery.getElValue(this.getId("listGid")),
			read_num: DA.jQuery.getElValue(this.getId("readNum")),
			quote_r: DA.jQuery.getElValue(this.getId("quoteR")),
			quote_f: DA.jQuery.getElValue(this.getId("quoteF")),
			quote_f_attach: DA.jQuery.getElValue(this.getId("quoteFAttach")),
			encode: DA.jQuery.getElValue(this.getId("encode")),
			sign_init_s: DA.jQuery.getElValue(this.getId("signInitS")),
			all_reply: DA.jQuery.getElValue(this.getId("allReply")),
			config_func: type
		};
		return args;
	},
	configSubmit: function() {
		var args = this.configParams("set");
		var key = this.getKey("edit", args);

		// immediately reflect
		DA.param.schedule.list_type = args.list_type;
		DA.param.schedule.read_num = args.read_num;
		var label = ('after' === DA.param.schedule.list_type) 
			? DA.vars.scheduleListTitleAfter 
			: DA.vars.scheduleListTitleToday;
		$('#DA_portal_schedule_title_Id').html(label);
		$('#DA_launcher_schedule_list .DA_list_title_class').html(label);

		this.jsonConExecute("edit", args, key);
	},
	getId: function(type) {
		var id;

		switch (type) {
			case 'listline':
				id = "DA_config_edit_listline_Id";
				break;
			case 'portalListline':
				id = "DA_config_edit_portal_listline_Id";
				break;
			case 'touchMenu':
				id = "DA_config_edit_touchmenu_Id";
				break;
			case 'listDay':
				id = "DA_config_edit_schedule_listday_Id";
				break;
			case 'listType':
				id = "DA_config_edit_schedule_listtype_Id";
				break;
			case 'listGid':
				id = "DA_config_edit_schedule_listgid_Id";
				break;
			case 'readNum':
				id = "DA_config_edit_schedule_readnum_Id";
				break;
			case 'quoteR':
				id = "DA_config_edit_mail_quoter_Id";
				break;
			case 'quoteF':
				id = "DA_config_edit_mail_quotef_Id";
				break;
			case 'quoteFAttach':
				id = "DA_config_edit_mail_quotefattach_Id";
				break;
			case 'encode':
				id = "DA_config_edit_mail_encode_Id";
				break;
			case 'signInitS':
				id = "DA_config_edit_mail_signinits_Id";
				break;
			case 'allReply':
				id = "DA_config_edit_mail_allreply_Id";
                                break;
			default:
				break;
		}

		return id;
	},
	getKey: function(sub, args) {
		var id;
		switch (sub) {
			case 'edit':
				id = "config_" + sub;
				break;
			default:
				break;
		}
		return id;
	},
	jsonConExecute: function(sub, args, key, hash) {
		jsonCon.executeCache($.extend({ func: 'config', sub: sub }, args), key, hash);
		jsonCon.execute($.extend({ func: 'config', sub: sub }, args), key, true, hash);
	}
};

DA.customEvent.set("navigationController.slidePage", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;

	var fromFunc = params.fromFunc;
	var fromSub  = params.fromSub;

	if (func === "config") {
	}
});

DA.customEvent.set("navigationController.backPage", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;

	var fromFunc = params.fromFunc;
	var fromSub  = params.fromSub;

	if (func === "config") {
	}
});

DA.customEvent.set("navigationController.slideDone", function(params) {
	var func  = params.func;
	var sub   = params.sub;

	var fromPage  = params.fromPage;
	var toPage    = params.toPage;
	var backwards = params.backwards;

	if (func === "config") {
	}
});

DA.customEvent.set("contentsController.onSuccess", function(params) {
});

DA.customEvent.set("contentsController.onFailure", function(params) {
});

DA.customEvent.set("navigationController.frickTop", function(params) {
	var func  = params.func;
	var sub   = params.sub;

	if (func === "config") {
	}
});

DA.customEvent.set("navigationController.frickBottom", function(params) {
	var func  = params.func;
	var sub   = params.sub;

	if (func === "config") {
	}
});

