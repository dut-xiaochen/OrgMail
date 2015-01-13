DA.param.mail = {
	fid      : null,
	uid      : null,
	srid     : null,
	maid     : null,
	tid      : 0,
	sid      : 0,
	priority : 3,
	page     : 1,
	unseen   : true,
	toself   : false,
	flagged  : false,
	folder   : 'folder'
};

DA.mail = {
	org_mail_gid : "ajaxMailer",
	init: function() {
		var me = this;
		jQuery.each(["to", "cc", "bcc"], function() {
			var field = this + "";
			var el = $("#" + me._editElId(field + "Text"));
			if (el.attr("id")) {
				var addressHandler = function(e) {
					var mail = me.getElValue(field + "Text");
					var icon ='<span  class="DA_ico_user_other DA_front_icon_class">' + mail + "</span>";
					if ((DA.util.isUndefined(e.which) || e.which == 13) && !DA.util.isEmpty(mail)) {
					
						DA.dlg.ItemObj[me._editElId(field + "Addr")].add("", "", icon, mail);
						me.setElValue(field + "Text", "");
						DA.Select.Done(me._editElId(field + "Addr"),'address');
						me.switchAddressArea(field);
					}
				};

				el.keypress(addressHandler);
				el.blur(addressHandler);
			}
		});
	},
	launcherClick: function(func, sub, param) {
		if (func === "mail") {
			if (param) {
				switch(param) {
					case 'portal':
					case 'inbox':
					case 'draft':
					case 'sent':
					case 'trash':
					case 'spam':
						DA.param.mail.fid = param;
						this.listReload(param, true);
						break;
					case 'edit':
						this.editMail('new');
						break;
					case 'favorite':
						this.switchFolders('favorite', true);
						break;
					default:
						this.switchFolders();
						break;
				}
			} else {
				switch(sub) {
					case 'list':
						this.listReload('portal', true);
					case 'edit':
						this.editMail('new');
						break;
					default:
						this.switchFolders();
						break;
				}
			}
		}
	},
	_editElId: function(type) {
		var id;
		switch(type) {
			case 'toAddr':
				id = "DA_mail_edit_address_to_Id";
				break;
			case 'ccAddr':
				id = "DA_mail_edit_address_cc_Id";
				break;
			case 'bccAddr':
				id = "DA_mail_edit_address_bcc_Id";
				break;
			case 'toArea':
				id = "DA_mail_edit_to_area_Id";
				break;
			case 'ccArea':
				id = "DA_mail_edit_cc_area_Id";
				break;
			case 'bccArea':
				id = "DA_mail_edit_bcc_area_Id";
				break;
			case 'toBlock':
				id = "DA_mail_edit_to_block_Id";
				break;
			case 'ccBlock':
				id = "DA_mail_edit_cc_block_Id";
				break;
			case 'bccBlock':
				id = "DA_mail_edit_bcc_block_Id";
				break;
			case 'toBtn':
				id = "DA_mail_edit_to_addressbtn_Id";
				break;
			case 'ccBtn':
				id = "DA_mail_edit_cc_addressbtn_Id";
				break;
			case 'bccBtn':
				id = "DA_mail_edit_bcc_addressbtn_Id";
				break;
			case 'toLabel':
				id = "DA_mail_edit_to_label_Id";
				break;
			case 'ccLabel':
				id = "DA_mail_edit_cc_label_Id";
				break;
			case 'bccLabel':
				id = "DA_mail_edit_bcc_label_Id";
				break;
			case 'toSel':
				id = "DA_mail_edit_to_Id";
				break;
			case 'ccSel':
				id = "DA_mail_edit_cc_Id";
				break;
			case 'bccSel':
				id = "DA_mail_edit_bcc_Id";
				break;
			case 'toText':
				id = "DA_mail_edit_to_text_Id";
				break;
			case 'ccText':
				id = "DA_mail_edit_cc_text_Id";
				break;
			case 'bccText':
				id = "DA_mail_edit_bcc_text_Id";
				break;
			case 'attachment':
				id = "DA_mail_detail_attachment_Id";
				break;
			case 'subject':
				id = "DA_mail_edit_subject_textarea_Id";
				break;
			case 'subjectText':
				id = "DA_mail_edit_subject_text_Id";
				break;
			case 'body':
				id = "DA_mail_edit_body_textarea_Id";
				break;
			case 'bodyText':
				id = "DA_mail_edit_body_text_Id";
				break;
			case 'template':
				id = "DA_mail_edit_template_Id";
				break;
			case 'sign':
				id = "DA_mail_edit_sign_Id";
				break;
			case 'signLabel':
				id = "DA_mail_edit_sign_label_Id";
				break;
			case 'priority':
				id = "DA_mail_edit_priority_Id";
				break;
			case 'priorityLabel':
				id = "DA_mail_edit_priority_label_Id";
				break;
			case 'groupname':
				id = "DA_mail_edit_groupname_Id";
				break;
			case 'groupnameLabel':
				id = "DA_mail_edit_groupname_label_Id";
				break;
			case 'replyuse':
				id = "DA_mail_edit_replyuse_Id";
				break;
			case 'replyuseLabel':
				id = "DA_mail_edit_replyuse_label_Id";
				break;
			case 'inreplyto':
				id = "DA_mail_edit_inreplyto_Id";
				break;
			case 'references':
				id = "DA_mail_edit_references_Id";
				break;
			case 'charset':
				id = "DA_mail_edit_charset_Id";
				break;
			case 'notification':
				id = "DA_mail_edit_notification_Id";
				break;
			case 'contenttype':
				id = "DA_mail_edit_contenttype_Id";
				break;
			case 'from':
				id = "DA_mail_edit_from_Id";
				break;
			case 'nopreview':
				id = "DA_mail_edit_nopreview_Id";
				break;
			case 'other':
				id = "DA_mail_edit_other_Id";
				break;
			case 'otherLabel':
				id = "DA_mail_edit_other_label_Id";
				break;
			default:
				break;
		}
		return id;
	},
	getElCSS: function(type) {
		var el = $("#" + this._editElId(type));
		return el.css();
	},
	setElCSS: function(type, css) {
		var el = $("#" + this._editElId(type));
		el.css(css);
	},
	getElText: function(type) {
		var el = $("#" + this._editElId(type));
		return el.text();
	},
	setElText: function(type, str) {
		var el = $("#" + this._editElId(type));
		el.text(str);
	},
	getElHTML: function(type) {
		var el = $("#" + this._editElId(type));
		return el.html();
	},
	setElHTML: function(type, str) {
		var el = $("#" + this._editElId(type));
		el.html(str);
	},
	hiddenEl: function(type) {
		var el = $("#" + this._editElId(type));
		el.css("display", "none");
	},
	showEl: function(type) {
		var el = $("#" + this._editElId(type));
		el.css("display", "");
	},
	addClassEl: function(type, cl) {
		var el = $("#" + this._editElId(type));
		el.addClass(cl);
	},
	removeClassEl: function(type, cl) {
		var el = $("#" + this._editElId(type));
		el.removeClass(cl);
	},
	getSelectOptionText: function(type, value) {
		var str = "";
		$("#" + this._editElId(type) + " option").each(function() {
			if (this.value == value) {
				str = this.text;
				return false;
			}
		});
		return str;
	},
	getSelectOptionHTML: function(type, value) {
		var str = "";
		$("#" + this._editElId(type) + " option").each(function() {
			if (this.value == value) {
				str = this.html;
				return false;
			}
		});
		return str;
	},
	getElValue: function(type) {
		var el = $("#" + this._editElId(type));
		return el.val();
	},
	setElValue: function(type, value) {
		var el = $("#" + this._editElId(type));
		el.val(value);
	},
	getToggledValue: function(type) {
		var el = $("#" + this._editElId(type));
		return el.attr("toggled") || "false";
	},
	setToggledValue: function(type, value) {
		var el = $("#" + this._editElId(type));
		el.attr("toggled", value);
	},
	editMailParams: function(type) {
		var attachment = {};
		$("input[name='DA_mail_edit_attachment_Name']").each(function() {
			var id = this.id;
			var checked = this.checked;
			if (id.match(/^DA_mail_edit_attachment_(?:\d+)_(\d+)/)) {
				attachment[RegExp.$1] = (checked) ? 1 : 0;
			}
		});

		var args = {
			fid:          DA.param.mail.fid || '',
			uid:          DA.param.mail.uid || '',
			srid:         DA.param.mail.srid || '',
			maid:         DA.param.mail.maid || '',
			org_mail_gid: DA.mail.org_mail_gid,
			tid:          this.getElValue("template") || 0,
			sid:          this.getElValue("sign") || 0,
			to:           DA.util.object2String(DA.Select.getOutPut("address", this._editElId("toAddr"))),
			cc:           DA.util.object2String(DA.Select.getOutPut("address", this._editElId("ccAddr"))),
			bcc:          DA.util.object2String(DA.Select.getOutPut("address", this._editElId("bccAddr"))),
			to_text:      this.getElValue("toText"),
			cc_text:      this.getElValue("ccText"),
			bcc_text:     this.getElValue("bccText"),
			subject:      this.getElValue("subject"),
			attachment:   DA.util.object2String(attachment),
			body:         this.getElValue("body"),
			priority:     this.getElValue("priority") || 3,
			group_name:   this.getToggledValue("groupname") === "true" ? 1 : 0,
			reply_use:    this.getToggledValue("replyuse") === "true" ? 1 : 0,
			in_reply_to:  this.getElValue("inreplyto"),
			references:   this.getElValue("references"),
			charset:      this.getElValue("charset"),
			notification: this.getElValue("notification"),
			content_type: this.getElValue("contenttype"),
			from:         this.getElValue("from"),
			nopreview:    this.getElValue("nopreview"),
			mail_func:    type
		};

		return args;
	},
	switchTextArea: function(field) {
		if (!field || field === "subject") {
			this.setElValue("subject", DA.util.cutCRLF(this.getElValue("subject")));
			this.setElHTML("subjectText", DA.util.encode(this.getElValue("subject"), 2, 1));
		}
		if (!field || field === "body") {
			this.setElHTML("bodyText", DA.util.encode(this.getElValue("body"), 1, 1));
		}
	},
	switchAddressArea: function(field) {
		var me = this;
		var text = {
			to:  this.getElValue("toText"),
			cc:  this.getElValue("ccText"),
			bcc: this.getElValue("bccText")
		};
		var address = {
			to:  DA.Select.getOutPut("address", this._editElId("toAddr")),
			cc:  DA.Select.getOutPut("address", this._editElId("ccAddr")),
			bcc: DA.Select.getOutPut("address", this._editElId("bccAddr"))
		};

		var openArea = function(field) {
			var el1 = $("#" + me._editElId(field + "Area"));
			if (el1.attr("id")) {
				el1.addClass("DA_mail_addressarea_on_class").removeClass("DA_mail_addressarea_off_class");
			}

			var el2 = $("#" + me._editElId(field + "Btn"));
			if (el2.attr("id")) {
				el2.addClass("DA_mail_addressarea_off_class").removeClass("DA_mail_address_text_class");
			}

			var length = address[field].length;
			if (length > 0) {
				me.showEl(field + "Sel");
			} else {
				me.hiddenEl(field + "Sel");
			}
		};
		var closeArea = function(field) {
			var el1 = $("#" + me._editElId(field + "Area"));
			if (el1.attr("id")) {
				el1.addClass("DA_mail_addressarea_off_class").removeClass("DA_mail_addressarea_on_class");
			}

			var el2 = $("#" + me._editElId(field + "Btn"));
			if (el2.attr("id")) {
				el2.addClass("DA_mail_address_text_class").removeClass("DA_mail_addressarea_off_class");
			}

			var length = address[field].length;
			if (length > 0) {
				if (length > 1) {
					me.setElText(field + "Btn", DA.util.gettext(DA.vars.mailEditToLimitMsg, [address[field][0].name, length-1]));
				} else {
					me.setElText(field + "Btn", address[field][0].name);
				}
			} else {
				me.setElText(field + "Btn", text[field]);
			}
		};
		if (field === "to") {
			closeArea("cc");
			closeArea("bcc");
			openArea("to");
			if ((DA.util.isEmpty(text.cc) && address.cc.length == 0)
			&&  (DA.util.isEmpty(text.bcc) && address.bcc.length == 0)) {
				this.hiddenEl("bccBlock");
				this.addClassEl("ccBlock", "DA_row_class_last-child");
				this.setElText("ccLabel", DA.vars.mailEditCcBccLabel);
			}
		} else if (field === "cc") {
			closeArea("to");
			closeArea("bcc");
			openArea("cc");
			this.setElText("ccLabel", DA.vars.mailEditCcLabel);
			this.showEl("bccBlock");
			this.removeClassEl("ccBlock", "DA_row_class_last-child");
		} else if (field === "bcc") {
			closeArea("to");
			closeArea("cc");
			openArea("bcc");
		} else {
			openArea("to");
			closeArea("cc");
			closeArea("bcc");
			if ((DA.util.isEmpty(text.cc) && address.cc.length == 0)
			&&  (DA.util.isEmpty(text.bcc) && address.bcc.length == 0)) {
				this.hiddenEl("bccBlock");
				this.addClassEl("ccBlock", "DA_row_class_last-child");
				this.setElText("ccLabel", DA.vars.mailEditCcBccLabel);
			}
		}
	},
    switchTemplate: function(){
        setTimeout(DA.mail.doswitchTemplate,1);
    },
    doswitchTemplate: function() {
            if (confirm(DA.vars.templateConfirmMsg)) {
                var args = DA.mail.editMailParams("template");
                var key = DA.mail.getKey('template', args);
                DA.mail.jsonConExecute('edit', args, false, true, key);
                DA.mail.setElValue("template", "")
            }
    },
	sendSubmit: function() {
		var args = this.editMailParams("send");
		var key = this.getKey('edit', args);

		this.jsonConExecute('edit', args, false, true, key);
	},
	draftSubmit: function() {
		var args = this.editMailParams("draft");
		var key = this.getKey('edit', args);

		this.jsonConExecute('edit', args, false, true, key);
	},
	backupEditSubmit: function() {
		this._backup = this.editMailParams();
	},
	cancelSubjectSubmit: function() {
		if (this._backup) {
			this.setElValue("subject", this._backup.subject);
		}
	},
	cancelBodySubmit: function() {
		if (this._backup) {
			this.setElValue("body", this._backup.body);
		}
	},
	cancelOtherSubmit: function() {
		if (this._backup) {
			this.setElValue("sign", this._backup.sid);
			this.setElValue("priority", this._backup.priority);
			this.setToggledValue("groupname", this._backup.group_name === 1 ? "true" : "false");
			this.setToggledValue("replyuse", this._backup.reply_use === 1 ? "true" : "false");
		}
	},
	editSubjectSubmit: function() {
		this.switchTextArea("subject");

		DA.navigationController.backPage({
			func: "mail",
			sub:  "edit"
		}, this.getId("edit"), {
			fromEditSubjectSubmit: true
		});
	},
	editBodySubmit: function() {
		this.switchTextArea("body");

		DA.navigationController.backPage({
			func: "mail",
			sub:  "edit"
		}, this.getId("edit"), {
			fromEditBodySubmit: true
		});
	},
	editOtherSubmit: function() {
		var me = this;
		var html = [];
		var el = $("#" + this._editElId("other"));
		if (el.attr("id")) {
			jQuery.each(["sign", "priority"], function() {
				var key = this + "";
				var value = me.getElValue(key);
				if (value != DA.param.mail[key]) {
					html.push("<div><label>" + me.getElText(key + "Label") + "</label><span>" + me.getSelectOptionText(key, value) + "</span></div>");
				}
			});
			jQuery.each(["groupname", "replyuse"], function() {
				var key = this + "";
				var value = me.getToggledValue(key);
				if (value != DA.param.mail[key]) {
					html.push("<div><label>" + me.getElText(key + "Label") + "</label><span>" + (value ? "ON" : "OFF") + "</span></div>");
				}
			});
			var h = html.join("");
			if (DA.util.isEmpty(h)) {
				el.html("<label>" + DA.vars.mailEditOtherTitle + "</label>");
				el.removeClass("DA_other_item_class");
			} else {
				el.html(h);
				el.addClass("DA_other_item_class");
			}
		}
		DA.navigationController.backPage({
			func: "mail",
			sub:  "edit"
		}, this.getId("edit"), {
			fromEditOtherSubmit: true
		});
	},
	getFlagged: function(id) {
		var img = $('#' + id);
		if (DA.util.getFilename(img.attr("src")) === "mo_ico_email_flag.png") {
			return(true);
		} else {
			return(false);
		}
	},
	toggleHeader: function(id1, id2, id3) {
		var el1 = $("#" + id1);
		var el2 = $("#" + id2);
		var el3 = $("#" + id3);
		if (el1.attr("id")) {
			if (el1.attr("class").match(/DA_mail_header_open_class/)) {
				el1.addClass("DA_mail_header_close_class").removeClass("DA_mail_header_open_class");
				el2.addClass("DA_mail_header_close_class").removeClass("DA_mail_header_open_class");
				el3.text(DA.vars.showWord);
			} else {
				el1.addClass("DA_mail_header_open_class").removeClass("DA_mail_header_close_class");
				el2.addClass("DA_mail_header_open_class").removeClass("DA_mail_header_close_class");
				el3.text(DA.vars.hiddenWord);
			}
		}
	},
	toggleFlagged: function(id) {
		var me = this;
		var el = $("#" + id);
		if (el) {
			var args = {
				fid:  DA.param.mail.fid,
				uid:  DA.param.mail.uid,
				srid: DA.param.mail.srid,
				org_mail_gid: DA.mail.org_mail_gid
			};
			if (args.fid && args.uid) {
				var onSuccess = function(cl) {
					var a = {
						fid: args.fid,
						uid: args.uid,
						srid: args.srid
					};
					var key = me.getKey('detail', a);
					me.jsonConRewrite('detail', a, key, [{
						"id":   "DA_mail_detail_flagged_Id",
						"type": "normal",
						"attr": {
							"class": cl
						}
					}]);
				};
				if (el.attr("class").match(/DA_mail_flag_on_class/)) {
					el.addClass("DA_mail_flag_off_class").removeClass("DA_mail_flag_on_class");
					args.mail_func = "unflagged";

					var key = this.getKey('detail', args);
					this.jsonConExecute('detail', args, false, true, key, {
						mask: false,
						onSuccess: function() {
							onSuccess("DA_mail_flag_off_class");
						}
					});
				} else {
					el.addClass("DA_mail_flag_on_class").removeClass("DA_mail_flag_off_class");
					args.mail_func = "flagged";

					var key = this.getKey('detail', args);
					this.jsonConExecute('detail', args, false, true, key, {
						mask: false,
						onSuccess: function() {
							onSuccess("DA_mail_flag_on_class");
						}
					});
				}
			}
		}
	},
	isFromPortal: function(fid, srid) {
		if (srid == DA.sys.portalSrid) {
			return fid === "portal";
		} else {
			return false;
		}
	},
	clearRecent: function(id) {
		var h  = this.parseId(id);
		var el = DA.jQuery.getEl(id);
		if (el.attr("class").match(/DA_mailf_no_on_class/)) {
			el.addClass("DA_mailf_no_off_class").removeClass("DA_mailf_no_on_class");
		}
	},
	resetFilter: function(fid) {
		DA.param.mail.unseen = (fid !== "sent" && fid !== "draft");
		DA.param.mail.toself = false;
		DA.param.mail.flagged = false;
		this.syncFootnaviButton('list');
	},
	listReload: function(fid, reset, org_mail_gid) {
		var me = this;
		var reload=1;

		if (reset) {
			this.resetFilter(fid);
			reload=0;
		}

		var args = {
			fid: fid || DA.param.mail.fid,
			page: 0,
			unseen: DA.param.mail.unseen,
			toself: DA.param.mail.toself,
			flagged: DA.param.mail.flagged,
			reload:reload,
			org_mail_gid: DA.mail.org_mail_gid
		};
		var key = this.getKey('list', args);
		if (args.fid) {
			DA.param.mail.page = 0;

			var onExecute = function() {
				var firstReq = me.detailMailParallelUrl(me.firstUid(args.fid, DA.param.mail.srid));

				var req = [];
				if (firstReq) {
					req.push(firstReq);
				}
				
				if (req.length > 0) {
					if ( DA.vars.mailLookahead !='off' ) {
						readCon.execute(req);
					}

				}
			};

			this.jsonConExecute('list', args, false, true, key, {
				onSuccess: function() {
					onExecute();
				}
			});
		}
	},
	switchOrgMail: function(org_mail_gid) {
		DA.mail.switchFolders(null,null,org_mail_gid,true);
	},
	toggleFilter: function(type) {
		var args = {
			fid: DA.param.mail.fid,
			page: 0,
			unseen: DA.param.mail.unseen,
			toself: DA.param.mail.toself,
			flagged: DA.param.mail.flagged,
			noupdate: (type === "unseen") ? 0 : 1,
			org_mail_gid: DA.mail.org_mail_gid
		};
		var key;
		if (args.fid) {
			switch(type) {
				case 'unseen':
					if (args.unseen) {
						DA.param.mail.unseen = args.unseen = false;
					} else {
						DA.param.mail.unseen = args.unseen = true;
					}
					break;
				case 'toself':
					if (args.toself) {
						DA.param.mail.toself = args.toself = false;
					} else {
						DA.param.mail.toself = args.toself = true;
					}
					break;
				case 'flagged':
					if (args.flagged) {
						DA.param.mail.flagged = args.flagged = false;
					} else {
						DA.param.mail.flagged = args.flagged = true;
					}
					break;
				default:
					break;
			}
			key = this.getKey('list', args);
			DA.navigationController.autoScroll();
			this.jsonConExecute('list', args, false, true, key);
		}
	},
	syncFootnaviButton: function(sub) {
		var targets = [];
		switch(sub) {
			case 'folder':
				targets = ["favorite", "folder"]; break;
			default:
				targets = ["unseen", "toself", "flagged"]; break;
		}
		jQuery.each(targets, function() {
			var el = $("#DA_footnavi_mail_" + this + "_Id");
			if (sub === "folder") {
				var f = DA.param.mail.folder || "folder";
				if (f == this && el.attr("class").match(/DA_footbtnlist_([lcr])/)) {
					var p = RegExp.$1;
					el.addClass("DA_footbtnlist_" + p + "_on_class").removeClass("DA_footbtnlist_" + p + "_class");
				} else if (el.attr("class").match(/DA_footbtnlist_([lcr])/)) {
					var p = RegExp.$1;
					el.addClass("DA_footbtnlist_" + p + "_class").removeClass("DA_footbtnlist_" + p + "_on_class");
				}
			} else {
				if (DA.param.mail[this] && !DA.util.isUndefined(el.attr("class")) && el.attr("class").match(/DA_footbtnlist_([lcr])/)) {
					var p = RegExp.$1;
					el.addClass("DA_footbtnlist_" + p + "_on_class").removeClass("DA_footbtnlist_" + p + "_class");
				} else if (!DA.util.isUndefined(el.attr("class")) && el.attr("class").match(/DA_footbtnlist_([lcr])/)) {
					var p = RegExp.$1;
					el.addClass("DA_footbtnlist_" + p + "_class").removeClass("DA_footbtnlist_" + p + "_on_class");
				}
			}
		});
	},
	addNextList: function() {
		var args = {
			fid: DA.param.mail.fid,
			page: (DA.util.isNumber(DA.param.mail.page) && DA.param.mail.page > 0) ? DA.param.mail.page : 1,
			unseen: DA.param.mail.unseen,
			toself: DA.param.mail.toself,
			flagged: DA.param.mail.flagged,
			noupdate: 1,
			org_mail_gid: DA.mail.org_mail_gid
		};
		var key = this.getKey('list', args);
		if (args.fid) {
			DA.param.mail.page = args.page = args.page + 1;
			this.jsonConExecute('list', args, true, true, key);
		}
	},
	seenMailList: function(id) {
		var el = $("#" + id);
		if (el.attr("id")) {
			var cl = el.attr("class");
			if (cl.match(/DA_ico_mail_close_re_class/)) {
				el.addClass("DA_ico_mail_open_re_class").removeClass("DA_ico_mail_close_re_class");
			} else if (cl.match(/DA_ico_mail_close_fw_class/)) {
				el.addClass("DA_ico_mail_open_fw_class").removeClass("DA_ico_mail_close_fw_class");
			} else if (cl.match(/DA_ico_mail_close_class/)) {
				el.addClass("DA_ico_mail_open_class").removeClass("DA_ico_mail_close_class");
			}
		}
	},
	seenMail: function(fid, uid, srid, cbh) {
		if (!DA.param.mail.seenList) {
			DA.param.mail.seenList = {};
		}
		if (!DA.param.mail.seenList[fid + "_" + uid]) {
			var me = this;
			var args = {
				fid: fid,
				uid: uid,
				srid: srid,
				mail_func: "seen",
				org_mail_gid: DA.mail.org_mail_gid
			};
			var key = this.getKey('seen', args);
			if (args.fid && args.uid) {
				this.jsonConExecute('detail', args, false, true, key, {
					mask: false,
					onSuccess: function() {
						var a = {
							fid: fid,
							uid: uid,
							srid: srid
						};
						var key = me.getKey('detail', a);
						me.jsonConRewrite('detail', a, key, [{
							"id": "DA_mail_detail_attachment_Id",
							"type": "normal",
							"html": me.getElHTML("attachment")
						}]);
					}
				});
				DA.param.mail.seenList[fid + "_" + uid] = true;
			}
		}
	},
unseenMail: function(fid, uid, srid, cbh) {
	if (!DA.param.mail.seenList) {
		DA.param.mail.seenList = {};
	}

	if ( !fid || !uid || !srid ) {
		fid   = DA.param.mail.fid;
		uid   = DA.param.mail.uid;
		srid  = DA.param.mail.srid;
	}

	if (DA.param.mail.seenList[fid + "_" + uid]) {
		var me = this;
		var args = {
		fid: fid,
		uid: uid,
		srid: srid,
		mail_func: "unseen",
		org_mail_gid: DA.mail.org_mail_gid
		};
		var key = this.getKey('unseen', args);
		if (args.fid && args.uid) {
			this.jsonConExecute('detail', args, false, true, key, {
				mask: false,
				onSuccess: function() {
					$("#DA_mail_detail_unseen_btn_Id").hide();
					DA.param.mail.seenList[fid + "_" + uid] = false;
				}
			});
		}
	}
},

unseenMailList:function(id){
	var el=$("#"+id);
	if(el.attr("id")){
		var cl=el.attr("class");
			if(cl.match(/DA_ico_mail_open_re_class/)){
				el.addClass("DA_ico_mail_close_re_class").removeClass("DA_ico_mail_open_re_class");
			}else{
				if(cl.match(/DA_ico_mail_open_fw_class/)){
					el.addClass("DA_ico_mail_close_fw_class").removeClass("DA_ico_mail_open_fw_class");
				}else{
					if(cl.match(/DA_ico_mail_open_class/)){
						el.addClass("DA_ico_mail_close_class").removeClass("DA_ico_mail_open_class");
					}
				}
			}
	}
},
	detailMail: function(fid, uid, srid, r) {
		var me = this;
		var args = {
			fid: fid,
			uid: uid,
			srid: srid,
			org_mail_gid: DA.mail.org_mail_gid
		};
		var key = this.getKey('detail', args);
		if (args.fid && args.uid) {
			DA.param.mail.fid = fid;
			DA.param.mail.uid = uid;
			DA.param.mail.srid = srid;

			this.syncDetailEditButton(args.fid);

			if (!r) {
				r = this.searchUid(fid, uid, srid);
			}
			DA.param.mail.detailPrevButtonDisabled = r.isFirst;
			DA.param.mail.detailNextButtonDisabled = r.isLast;

			var msg = DA.util.gettext(DA.vars.detailCountMsg, [r.total, r.sno]);

			var onExecute = function() {
				var prevReq;
				if (r.from !== "next") {
					prevReq = me.detailMailParallelUrl(me.searchUid(fid, uid, srid, "prev"));
				}
				var nextReq;
				if (r.from !== "prev") {
					nextReq = me.detailMailParallelUrl(me.searchUid(fid, uid, srid, "next"));
				}

				var req = [];
				if (prevReq) {
					req.push(prevReq);
				}
				if (nextReq) {
					req.push(nextReq);
				}

				if (req.length > 0) {
					if ( DA.vars.mailLookahead !='off' ) {
						readCon.execute(req);
					}
				}
			};

			this.jsonConExecute('detail', args, false, false, key, {
				onSuccess: function() {
					$("#DA_mail_detail_count_Id").text(msg);
					me.syncDetailNextButton(r.isFirst, r.isLast);
					DA.navigationController.autoScroll();
					me.seenMail(args.fid, args.uid, args.srid);
				},
				noExecute: function() {
					$("#DA_mail_detail_count_Id").text(msg);
					me.syncDetailNextButton(r.isFirst, r.isLast);
					DA.navigationController.autoScroll();
					me.seenMail(args.fid, args.uid, args.srid);
				},
				onCache: function() {
					onExecute();
				}
			});
		}
		if(fid !=="draft" && fid !=="sent"){
			$("#DA_mail_detail_unseen_btn_Id").show();
		} else {
			$("#DA_mail_detail_unseen_btn_Id").hide();
		}
	},
	syncDetailEditButton: function(fid) {
		if (fid === "draft" || fid === "sent") {
			DA.navigationController.showButton("DA_footnavi_mail_edit_Id");
	
			// to show "all_reply" and "reply" both
			if ( 0 < $("#DA_footnavi_mail_all_reply_Id").size() && 0 < $("#DA_footnavi_mail_reply_Id").size() ) {
				var target = [ 'all_reply', 'reply', 'edit', 'forward', 'delete' ];

				jQuery.each( target, function() {
				    $("#DA_footnavi_mail_" + this + "_Id").css("font-size",'13px')
				} ) ;
			}
		
		} else {
			DA.navigationController.hideButton("DA_footnavi_mail_edit_Id");
		}
		//===========================================
		//     Custom
		//===========================================
		DA.customEvent.fire("mail.syncDetailEditButton", {fid:fid} );
		//===========================================
	},
	syncDetailNextButton: function(isFirst, isLast) {
		if (isFirst) {
			DA.jQuery.hiddenEl("DA_mail_detail_prev_link_Id");
			DA.jQuery.getEl("DA_head_mail_detail_prev_button_Id").attr("href", "return false;").addClass("DA_footbtnlist_l_disable_class");
		} else {
			var prevLink = DA.jQuery.getEl("DA_mail_detail_prev_link_Id");
			var prevButton = DA.jQuery.getEl("DA_head_mail_detail_prev_button_Id");
			prevLink.show();
			prevButton.removeClass("DA_footbtnlist_l_disable_class");
			if (prevButton.attr("href") === "return false;") {
				prevButton.attr("href", prevLink.attr("href"));
			}
		}
		if (isLast) {
			DA.jQuery.hiddenEl("DA_mail_detail_next_link_Id");
			DA.jQuery.getEl("DA_head_mail_detail_next_button_Id").attr("href", "return false;").addClass("DA_footbtnlist_r_disable_class");
		} else {
			var nextLink = DA.jQuery.getEl("DA_mail_detail_next_link_Id");
			var nextButton = DA.jQuery.getEl("DA_head_mail_detail_next_button_Id");
			nextLink.show();
			nextButton.removeClass("DA_footbtnlist_r_disable_class");
			if (nextButton.attr("href") === "return false;") {
				nextButton.attr("href", nextLink.attr("href"));
			}
		}
	},
	detailMailParallelUrl: function(args) {
		var fid = args.fid;
		var uid = args.uid;
		var srid = args.srid;
		var org_mail_gid = DA.mail.org_mail_gid;
		var req;

		if (fid && uid) {
			req = {
				url: DA.vars.spCgiRdir + "/sp_ajx_api.cgi?proc=contents_json&func=mail&sub=detail&fid=" + fid + "&uid=" + uid + "&srid=" + srid + "&keep=1&org_mail_gid=" + org_mail_gid,
				key: this.getKey('detail', args)
			};
		}

		return req;
	},
	switchOrgMailParallelUrl: function(org_mail_gid) {
		var me = this;
		var org_changed = "true";
		var key = this.getKey('folder', {
			mail_func: "list",
			org_mail_gid: DA.mail.org_mail_gid
		});
		var req = {
			url: DA.vars.spCgiRdir + "/sp_ajx_api.cgi?proc=contents_json&func=mail&sub=folder&mail_func=list&org_mail_gid=" + org_mail_gid + "&org_changed=" + org_changed,
			key: key,
			expire: 30,
			onSuccessUrl: function() {
				jsonCon.executeCache({}, key);
			}
		};

		return req;
	},
	seenMailParallelUrl: function(args) {
		var fid = args.fid;
		var uid = args.uid;
		var srid = args.srid;
		var org_mail_gid = DA.mail.org_mail_gid;
		var req;

		if (fid && uid) {
			req = {
				url: DA.vars.spCgiRdir + "/sp_ajx_api.cgi?proc=contents_json&func=mail&sub=detail&fid=" + fid + "&uid=" + uid + "&srid=" + srid + "&mail_func=seen&org_mail_gid=" + org_mail_gid,
				key: this.getKey('detail', {
					fid: fid,
					uid: uid,
					srid: srid,
					mail_func: "seen"
				})
			};
		}

		return req;
	},
	updateMailParallelUrl: function() {
		var me = this;
		var org_mail_gid = DA.mail.org_mail_gid;
		var key = this.getKey('folder', {
			mail_func: "update"
		});
		var req = {
			url: DA.vars.spCgiRdir + "/sp_ajx_api.cgi?proc=contents_json&func=mail&sub=folder&mail_func=update&org_mail_gid=" + org_mail_gid,
			key: key,
			expire: 30,
			onSuccessUrl: function() {
				jsonCon.executeCache({}, key);
			}
		};

		return req;
	},
	setUidlst: function(fid, lst) {
		if (!DA.param.mail.uidlst) {
			DA.param.mail.uidlst = {};
		}
		DA.param.mail.uidlst[fid] = lst;
	},
	firstUid: function(fid, srid) {
		var uidlst = DA.param.mail.uidlst[srid == DA.sys.portalSrid ? "portal" : fid];
		var res = {};

		if (uidlst && uidlst.length > 0) {
			var ary = uidlst[0].split(/\_/);
			var length = uidlst.length;

			res = {
				fid: ary[0],
				uid: ary[1],
				srid: srid,
				sno: 0,
				total: length
			};
		}

		return res;
	},
	searchUid: function(fid, uid, srid, type) {
		var no = 0;
		var uidlst = DA.param.mail.uidlst[srid == DA.sys.portalSrid ? "portal" : fid];
		var res = {};

		if (uidlst) {
			jQuery.each(uidlst, function() {
				if (this == fid + "_" + uid) {
					return false;
				}
				no ++;
			});

			var length = uidlst.length;

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

			var ary = uidlst[no].split(/\_/);

			res = {
				fid: ary[0],
				uid: ary[1],
				srid: srid,
				sno: no + 1,
				total: length,
				isFirst: (no === 0) ? true : false,
				isLast: (no + 1 === length) ? true : false,
				from: type
			};
		}

		return res;
	},
	nextMail: function(type) {
		var srid = DA.param.mail.srid;
		var fid = DA.param.mail.fid;
		var uid = DA.param.mail.uid;
		var srid = DA.param.mail.srid;
		if (fid && uid) {
			var res = this.searchUid(fid, uid, srid, type);

			this.detailMail(res.fid || fid, res.uid || uid, res.srid || srid, res);
		}
	},
	deleteMail: function(msg) {
		var args = {
			fid:  DA.param.mail.fid,
			uid:  DA.param.mail.uid,
			srid: DA.param.mail.srid,
			page: DA.param.mail.page,
			unseen: DA.param.mail.unseen,
			toself: DA.param.mail.toself,
			flagged: DA.param.mail.flagged,
			mail_func: 'delete',
			org_mail_gid: DA.mail.org_mail_gid
		};
		var key = this.getKey('detail', args);
		if (args.fid && args.uid && confirm(msg)) {
			this.jsonConExecute('detail', args, false, true, key);
		}
	},
	mdnMail: function(msg) {
		var args = {
			fid:  DA.param.mail.fid,
			uid:  DA.param.mail.uid,
			srid: DA.param.mail.srid,
			mail_func: 'mdn',
			org_mail_gid: DA.mail.org_mail_gid
		};
		var key = this.getKey('detail', args);
		if (args.fid && args.uid && confirm(msg)) {
			this.jsonConExecute('detail', args, false, true, key);
		}
	},
	editMail: function(type, slide, h) {
		var args = {
			fid:  DA.param.mail.fid || '',
			uid:  DA.param.mail.uid || '',
			srid: DA.param.mail.srid || '',
			mail_func: type,
			org_mail_gid: DA.mail.org_mail_gid
		};
		var key = this.getKey('edit', args);

		if (h) {
			switch(type) {
				case 'share':
					args.aid   = h.id || "";
					args.name  = DA.util.isEmpty(h.name) ? "" : h.name;
					args.email = DA.util.isEmpty(h.email) ? "" : h.email;
					break;
				case 'user':
					args.mid   = h.id;
					args.name  = DA.util.isEmpty(h.name) ? "" : h.name;
					args.email = DA.util.isEmpty(h.email) ? "" : h.email;
					break;
				case 'group':
					args.gid = id;
					break;
				case 'bulk':
					args.aid   = DA.util.str2hex(h.id) || "";
					break;
				default:
					args.name  = DA.util.isEmpty(h.name) ? "" : h.name;
					args.email = DA.util.isEmpty(h.email) ? "" : h.email;
					break;
			}
		}

		DA.navigationController.autoScroll();
		if (slide) {
			DA.navigationController.slidePage({
				func:  "mail",
				sub:   "edit"
			}, this.getId("edit"), {
				fromEditMail: true
			});
		}

		this.jsonConExecute('edit', args, false, true, key);
	},
	switchFolders: function(type, slide, org_mail_gid, org_changed) {
		var me = this;
		if (org_mail_gid && org_changed) {
			DA.mail.org_mail_gid = org_mail_gid;
		} else if (!org_mail_gid && org_changed) {
			DA.mail.org_mail_gid = "ajaxMailer";
		}
		
		var args = {
			fid: 0,
			mail_func: type
		};
		var key = this.getKey('folder', args);

		if (type == "favorite") {
			args.favorites = DA.favorite.ranking("mailFolder", 20).join("\n");
		}

		if (slide && DA.param.mail.folder != type) {
			DA.param.mail.folder = type;
			DA.navigationController.slidePage({
				func:  "mail",
				sub:   "folder",
				param: type || "folder"
			}, this.getId("folder"), {
				fromSwitchFolders: true
			});
		}

		var onExecute = function() {
			if (org_changed) {
				readCon.execute([me.switchOrgMailParallelUrl(DA.mail.org_mail_gid)]);
			} else {
				readCon.execute([me.updateMailParallelUrl()]);
			}
		};
		if (type === "favorite") {
			this.jsonConExecute('folder', args, false, true, key, {
				onSuccess: function() {
					onExecute();
				},
				noExecute: function() {
					onExecute();
				}
			});
		} else {
			if (DA.param.mail.folderInit && org_changed) {
				onExecute();
			} else {
				this.jsonConExecute('folder', args, false, false, key, {
					onSuccess: function() {
						onExecute();
						DA.param.mail.folderInit = true;
					},
					noExecute: function() {
						onExecute();
						DA.param.mail.folderInit = true;
					}
			 	});
			}
		}
	},
	clearRecent: function(id) {
		var h  = this.parseId(id);
		var el = DA.jQuery.getEl(id);
		if (h && h.fid && el.attr("id")) {
			DA.jQuery.getEl("DA_mail_folder_favorite_list_" + h.fid + "_Id").addClass("DA_mailf_no_off_class").removeClass("DA_mailf_no_on_class");
			DA.jQuery.getEl("DA_mail_folder_list_" + h.fid + "_Id").addClass("DA_mailf_no_off_class").removeClass("DA_mailf_no_on_class");
		}
	},
	setRecent: function(fid, recent) {
		if (parseInt(recent, 10)) {
			DA.jQuery.getEl("DA_mail_folder_favorite_list_" + fid + "_Id").addClass("DA_mailf_no_on_class").removeClass("DA_mailf_no_off_class");
			DA.jQuery.getEl("DA_mail_folder_list_" + fid + "_Id").addClass("DA_mailf_no_on_class").removeClass("DA_mailf_no_off_class");
		} else {
			DA.jQuery.getEl("DA_mail_folder_favorite_list_" + fid + "_Id").addClass("DA_mailf_no_off_class").removeClass("DA_mailf_no_on_class");
			DA.jQuery.getEl("DA_mail_folder_list_" + fid + "_Id").addClass("DA_mailf_no_off_class").removeClass("DA_mailf_no_on_class");
		}
	},
	jsonConExecute: function(sub, args, append, nocache, key, hash) {
		if (append) {
			appendJsonCon.execute($.extend({ func: 'mail', sub: sub }, args), key, nocache, hash);
		} else {
			if (nocache) {
				if (sub !== "edit") {
					jsonCon.executeCache($.extend({ func: 'mail', sub: sub }, args), key, hash);
				}
			}
			jsonCon.execute($.extend({ func: 'mail', sub: sub }, args), key, nocache, hash);
		}
	},
	jsonConGet: function(sub, args, key) {
		return jsonCon.getContentsCache($.extend({ func: 'mail', sub: sub }, args), key);
	},
	jsonConSet: function(sub, args, key, cache) {
		return jsonCon.setContentsCache($.extend({ func: 'mail', sub: sub }, args), key, cache);
	},
	jsonConRemove: function(sub, args, key) {
		return jsonCon.removeContentsCache($.extend({ func: 'mail', sub: sub }, args), key);
	},
	jsonConRewrite: function(sub, args, key, data) {
		jsonCon.rewriteContentsCache($.extend({ func: 'mail', sub: sub }, args), key, data);
	},
	getId: function(type) {
		var id;

		switch(type) {
			case 'top'      : id = "DA_portal_list_Id"; break;
			case 'folder'   : id = (DA.param.mail.folder === "favorite") ? "DA_mail_folder_favorite_Id" : "DA_mail_folder_0_Id"; break;
			case 'detail'   : id = "DA_mail_detail_Id"; break;
			case 'edit'     : id = "DA_mail_edit_Id"; break;
			default         : id = "DA_mail_list_portal_Id"; break;
		}

		return(id);
	},
	parseId: function(id) {
		var ary = id.split(/\_/);
		var func = ary[1];
		var sub = ary[2];
		var fid, uid, srid, param;

		if (sub === "folder") {
			if (id.match(/DA_mail_folder_(?:favorite_)?list_(.+?)_/)) {
				fid = RegExp.$1;
				param = "favorite";
			} else {
				fid = null;
				param = null;
			}
			uid = null;
			srid = null;
		} else {		
			if (ary.length > 4 && !ary[3].match(/^Id$/)) {
				fid = ary[3];
			}
			if (ary.length > 5 && !ary[4].match(/^Id$/)) {
				uid = ary[4];
			}
			if (ary.length > 6 && !ary[5].match(/^Id$/)) {
				srid = ary[5];
			}
			if (fid && fid.match(/^\d+$/)) {
				param = null;
			} else {
				param = fid;
			}
		}
		return({
			func  : func,
			sub   : sub,
			fid   : fid,
			uid   : uid,
			srid  : srid,
			param : param
		});
	},
	getKey: function(sub, args) {
		var id;
		switch (sub) {
			case 'folder':
				if (args.mail_func) {
					id += "_" + DA.mail.org_mail_gid + "_" + args.mail_func;
				}
				break;
			case "seen":
			case "unseen":
			case 'detail':
			case 'edit':
				id = (args.fid || 0) + "_" + (args.uid || 0);
				if (args.mail_func) {
					id += "_" + args.mail_func;
				}
				break;
			case 'template':
				id = args.tid + "_" + DA.mail.org_mail_gid;
				break;
			case 'list':
				id = args.fid + "_" + DA.mail.org_mail_gid + "_" + args.page + "."
				   + (args.unseen || false) + "." + (args.toself || false) + "."
				   + (args.flagged || false);
				break;
			default:
				break;
		}
		return (id) ? "mail_" + sub + "_" + id : "mail_" + sub;
	},
	getCustomParams: function(type, h) {
		var r = {};
		var el;
		switch(type) {
			case 'portal':
				el = $(["#DA_portal_mail", h.fid, h.uid, h.srid, "Id"].join("_"));
				break;
			case 'list':
				el = $(["#DA_mail_list", h.fid, h.uid, h.srid, "Id"].join("_"));
				break;
		}
		if (el.attr("id")) {
			var attr = el.attr("_customparams");
			r = DA.util.string2Object(attr);
		}
		return r;
	},
	historyBack: function() {
		var page = window.iui.getSelectedPage();
		var back = page.getAttribute("historyback");

		if (back) {
			var id = back.substr(1);
			var h = this.parseId(id);

			DA.navigationController.backPage({
				func:  h.func,
				sub:   h.sub,
				param: h.param
			}, id, {
				fromHistoryBack: true
			});
		}
	}
};

DA.customEvent.set("navigationController.slidePage", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;

	var fromFunc = params.fromFunc;
	var fromSub  = params.fromSub;

	if (func === "mail") {
		switch(sub) {
			case 'folder':
				DA.mail.syncFootnaviButton('folder');
				DA.param.mail.fid  = null;
				DA.param.mail.uid  = null;
				DA.param.mail.srid = null;
				DA.param.mail.maid = null;
				DA.param.mail.page = 0;
				break;
			case 'detail':
				if (fromSub === "list") {
					if (event) { // click
						var li = DA.util.findParent(event.target, "li");
						var h = DA.mail.parseId(li.id);
						DA.param.mail.fid  = h.fid;
						DA.param.mail.uid  = h.uid;
						DA.param.mail.srid = h.srid;
					}
				}
				DA.param.mail.maid = null;
				break;
			case 'edit':
				break;
			case 'editSubject':
			case 'editBody':
			case 'editOther':
				break;
			case 'list':
				DA.mail.syncFootnaviButton('list');
				if (fromSub === "folder") {
					if (event) { // click
						var li = DA.util.findParent(event.target, "li");
						var h = DA.mail.parseId(li.id);
						DA.param.mail.fid = h.fid;
						if (DA.param.mail.fid === "portal") {
							DA.param.mail.srid = DA.sys.portalSrid;
						}
						DA.mail.clearRecent(li.id);
					}
				}
				DA.param.mail.maid = null;
				break;
			default:
				DA.param.mail.fid  = null;
				DA.param.mail.uid  = null;
				DA.param.mail.srid = null;
				DA.param.mail.maid = null;
				DA.param.mail.page = 0;
				break;
		}
	}
});

DA.customEvent.set("navigationController.backPage", function(params) {
	var event = params.event;
	var func  = params.func;
	var sub   = params.sub;

	var fromFunc = params.fromFunc;
	var fromSub  = params.fromSub;

	if (func === "mail") {
		var customParams = params.customParams || {};

		switch(sub) {
			case 'folder':
				DA.mail.syncFootnaviButton('folder');
				DA.param.mail.page = 0;
				break;
			case 'detail':
				DA.mail.syncDetailEditButton(DA.param.mail.fid);
				DA.mail.syncDetailNextButton(DA.param.mail.detailPrevButtonDisabled, DA.param.mail.detailNextButtonDisabled);
				break;
			case 'edit':
				break;
			case 'editSubject':
			case 'editBody':
			case 'editOther':
				break;
			case 'list':
				DA.mail.syncFootnaviButton('list');
				break;
			default:
				break;
		}
	}
});

DA.customEvent.set("navigationController.slideDone", function(params) {
	var func  = params.func;
	var sub   = params.sub;
	var fid   = DA.param.mail.fid;
	var uid   = DA.param.mail.uid;
	var srid  = DA.param.mail.srid;

	var fromPage  = params.fromPage;
	var toPage    = params.toPage;
	var backwards = params.backwards;

	if (func === "mail") {
		var from = {};
		if (fromPage) {
			from = DA.mail.parseId(fromPage.id);
		}

		var fromFunc = from.func;
		var fromSub  = from.sub;

		var customParams = params.customParams || {};

		var back, title;
		if (backwards) {
			if (sub === "list") {
				if (fromFunc === "mail" && fromSub === "detail" && DA.util.isEmpty(toPage.getAttribute("historyback"))) {
					back = DA.mail.getId("folder");
				}
			}
		} else {
			if (toPage.getAttribute("fromlauncher") === "true") {
				if (sub === "folder") {
					back = DA.mail.getId("top");

					DA.param.mail.folder = 'folder';
					DA.mail.syncFootnaviButton('folder');
				} else if (sub === "list") {
					back = DA.mail.getId("folder");
				} else if (sub === "detail") {
					back = DA.mail.getId("list");
					title = DA.vars.backTitleList;
				} else if (sub === "edit") {
					back = fromPage.id;
					title = DA.vars.backTitleCancel;
				} else if (sub === "editSubject") {
					back = DA.mail.getId("edit");
				} else if (sub === "editBody") {
					back = DA.mail.getId("edit");
				} else if (sub === "editOther") {
					back = DA.mail.getId("edit");
				} else {
					back = DA.mail.getId("top");
				}
			} else {
				if (fromFunc === "mail") {
					back = fromPage.id;
					if (sub === "detail") {
						title = DA.vars.backTitleList;
					} else if (sub === "folder") {
						if (customParams.fromSwitchFolders) {
							back = DA.mail.getId("top");
						}
					} else if (sub === "edit") {
						title = DA.vars.backTitleCancel;
					}
				} else if (fromFunc === "portal") {
					back = fromPage.id;
					if (sub === "folder") {
						if (toPage.id === "DA_mail_folder_favorite_Id") {
							DA.param.mail.folder = 'favorite';
						} else {
							DA.param.mail.folder = 'folder';
						}
						DA.mail.syncFootnaviButton('folder');
					} else if (sub === "detail") {
						title = DA.vars.backTitleTop;
					} else if (sub === "edit") {
						title = DA.vars.backTitleCancel;
					}
				} else {
					if (sub === "folder") {
						back = DA.mail.getId("top");

						if (toPage.id === "DA_mail_folder_favorite_Id") {
							DA.param.mail.folder = 'favorite';
						} else {
							DA.param.mail.folder = 'folder';
						}
						DA.mail.syncFootnaviButton('folder');
					} else if (sub === "list") {
						back = DA.mail.getId("folder");
					} else if (sub === "detail") {
						back = DA.mail.getId("list");
						title = DA.vars.backTitleList;
					} else if (sub === "edit") {
						back = fromPage.id;
						title = DA.vars.backTitleCancel;
					} else if (sub === "editSubject") {
						back = DA.mail.getId("edit");
					} else if (sub === "editBody") {
						back = DA.mail.getId("edit");
					} else if (sub === "editOther") {
						back = DA.mail.getId("edit");
					} else {
						back = DA.mail.getId("folder");
					}
				}
			}
		}
		if (back) {
			toPage.setAttribute("historyback", "#" + back);
		}
		if (title) {
			toPage.setAttribute("backtitle", title);
		}
		switch(sub) {
			case 'folder':
				if (fromFunc !== "mail"
				|| (fromFunc === "mail" && fromSub !== "folder")) {
					// DA.mail.switchFolders(DA.param.mail.folder);
				}
				break;
			case 'detail':
				break;
			case 'edit':
				break;
			case 'editSubject':
			case 'editBody':
			case 'editOther':
				DA.mail.backupEditSubmit();
				break;
			case 'list':
				if (fromFunc === "mail"
				&&  fromSub === "detail" && backwards) {
					if (srid == DA.sys.portalSrid) {
						DA.param.mail.fid = "portal";
					}
					// no need
					DA.action.autoScroll("DA_mail_list_" + fid + "_" + uid + "_" + srid + "_Id", true);
				}
				break;
			default:
				break;
		}
	}
});

DA.customEvent.set("contentsController.onSuccess", function(params) {
});

DA.customEvent.set("contentsController.onFailure", function(params) {
});

DA.customEvent.set("navigationController.frickTop", function(params) {
	var func  = params.func;
	var sub   = params.sub;

	if (func === "mail") {
	}
});

DA.customEvent.set("navigationController.frickBottom", function(params) {
	var func  = params.func;
	var sub   = params.sub;

	if (func === "mail") {
	}
});

