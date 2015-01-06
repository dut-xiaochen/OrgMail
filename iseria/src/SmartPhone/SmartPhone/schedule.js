// DA.param.schedule = {
// 	call_cnt : 0,
// 	read_num : 1,      // user settings
// 	list_type : today, // user settings
//	view_mid : '',     // there are getter/setter. you must use them.
// };

DA.schedule = {
	_edit_backup : {},
	_edit_default : {},

	getReadNum : function () {
		return (DA.param.schedule.read_num) ? DA.param.schedule.read_num : 1;
	},

	setTimeStr : function () {
		var type = $('#DA_schedule_param_Type').val();

		var s_date = $('#DAscheduleNewStartDateId').val();
		var s_time = $('#DA_schedule_param_StartHour').val() + ':' + $('#DA_schedule_param_StartMin').val();
		var e_date = $('#DAscheduleNewEndDateId').val();
		var e_time = $('#DA_schedule_param_EndHour').val() + ':' + $('#DA_schedule_param_EndMin').val();

		var time_str = s_date + ' ' + s_time + DA.vars.timeRangeStr;
		time_str += (s_date == e_date) ? '' : e_date + ' ' ;
		time_str += e_time;
		$('#DA_schedule_edit_text_Time').text(time_str);

		var y = eval(s_date.substr(0, 4));
		var m = eval(s_date.substr(5, 2)) - 1;
		var d = eval(s_date.substr(8, 2));
		var s_wday = "("+ DA.schedule.getWdayStr((new Date(y,m,d)).getDay()) + ")";

		y = eval(e_date.substr(0, 4));
		m = eval(e_date.substr(5, 2)) - 1;
		d = eval(e_date.substr(8, 2));
		var e_wday = "("+ DA.schedule.getWdayStr((new Date(y,m,d)).getDay()) + ")";

		if (s_date == e_date) {
			e_date = e_wday = '';
		}
		if (s_time == '--:--') {
			s_time = '';
		}
		if (e_time == '--:--') {
			e_time = "[" + DA.vars.allTimeStr + "]";
		}

		switch (type) {
			case '1':
				$('#DA_schedule_edit_text_StartTime').text(s_date + ' '+ s_wday + ' ' +s_time);
				$('#DA_schedule_edit_text_EndTime').text(e_date + ' '+ e_wday + ' ' +e_time);
				break;
			case '2':
				$('#DA_schedule_edit_text_StartTime').text(s_date + ' '+ s_wday);
				$('#DA_schedule_edit_text_EndTime').text(e_date + ' '+ e_wday);
				break;
			case '3':
				$('#DA_schedule_edit_text_StartTime').text(s_date + ' '+ s_wday);
				$('#DA_schedule_edit_text_EndTime').text('');
				break;
			default:
				$('#DA_schedule_edit_text_StartTime').text(s_date + ' '+ s_wday + ' ' +s_time);
				$('#DA_schedule_edit_text_EndTime').text(e_date + ' '+ e_wday + ' ' +e_time);
				break;
		}
	},

	changeStartTime : function (obj) {
		if ('update' == DA.param.schedule.edit_param.mode ||
			 DA.param.schedule.edit_param.e_time_chg_flg ) {
			return;
		}
		var s_h = $('#DA_schedule_param_StartHour').val();
		var s_m = $('#DA_schedule_param_StartMin').val();
		var e_h = $('#DA_schedule_param_EndHour').val();
		var e_m = $('#DA_schedule_param_EndMin').val();
		var sd = new Date();
		var ed = new Date();
		var delta;
		if ("--" === obj.value) {
			s_h = "--";
			s_m = "--";
		} else {
			if ("--" == s_m) { s_m = "00"; }
			if ("--" == s_h) { s_h = "00"; }
			sd.setHours(eval(s_h));
			sd.setMinutes(eval(s_m));

			delta = DA.param.schedule.edit_param.time_period;
			ed.setHours(eval(s_h));
			ed.setMinutes(eval(s_m) + delta);

			e_h = ed.getHours();
			e_m = ed.getMinutes();
			if (e_h < s_h) {e_h = 24;}
			if (24 == e_h && 0 < e_m) {e_m = 0;}

			e_h = ("0" + e_h).substr(-2);
			e_m = ("0" + e_m).substr(-2);
		}
		$('#DA_schedule_param_StartHour').val(String(s_h));
		$('#DA_schedule_param_StartMin').val(String(s_m));
		$('#DA_schedule_param_EndHour').val(String(e_h));
		$('#DA_schedule_param_EndMin').val(String(e_m));
	},

	changeEndTime : function () {
		DA.param.schedule.edit_param.e_time_chg_flg = 1;
	},
	doChangeType : function(editFlag,val){
		var res;
		if(!editFlag){
			if('none' !== $("#DA_schedule_edit_div_Fa").css('display')){
				res = confirm(DA.vars.scheduleDeleteFaConfirmMsg);
			}else{
				res = true;
			}
			if(!res){
				$('#DA_schedule_param_Type').val('1');
				return;
			}
		}


		if(val === '2'){
			$('#DA_schedule_edit_EndDate').show();
			$('#DA_schedule_edit_StartTime').hide();
			$('#DA_schedule_edit_EndTime').hide();
			$('#DA_schedule_edit_StartDate').css('border-bottom-width','');
			$('#DA_schedule_edit_EndDate').css('border-bottom-width','0px');
		}else if(val === '3'){
			$('#DA_schedule_edit_EndDate').hide();
			$('#DA_schedule_edit_StartTime').hide();
			$('#DA_schedule_edit_EndTime').hide();
			$('#DA_schedule_edit_StartDate').css('border-bottom-width','0px');
			$('#DA_schedule_edit_EndDate').css('border-bottom-width','');
		}
		this.hideEditFaArea();
	},
	changeType : function (val) {
		var editFlag = false;
		if (DA.util.isEmpty(val)) {
			val = $('#DA_schedule_param_Type').val();
			editFlag = true;
		}
		if (val === '1')  {
			$('#DA_schedule_edit_EndDate').show();
			$('#DA_schedule_edit_StartTime').show();
			$('#DA_schedule_edit_EndTime').show();
			$('#DA_schedule_edit_StartDate').css('border-bottom-width','');
			$('#DA_schedule_edit_EndDate').css('border-bottom-width','');
			//$('#DA_schedule_edit_div_Fa').slideDown();
			this.showEditFaArea();
		}else if(val === '2' || val ==='3'){
			setTimeout(function foo(){DA.schedule.doChangeType(editFlag,val);},1);
		}
		DA.schedule.setTimeStr();
	},

	setTime: function () {
		DA.schedule.setTimeStr();

		this._edit_backup.s_date = $('#DAscheduleNewStartDateId').val();
		this._edit_backup.e_date = $('#DAscheduleNewEndDateId').val();

		this._edit_backup.s_hh = $('#DA_schedule_param_StartHour').val();
		this._edit_backup.s_mi = $('#DA_schedule_param_StartMin').val();
		this._edit_backup.e_hh = $('#DA_schedule_param_EndHour').val();
		this._edit_backup.e_mi = $('#DA_schedule_param_EndMin').val();

		DA.schedule.backToEditMainPage();
	},

	cancelTime: function () {
		$('#DAscheduleNewStartDateId').val( this._edit_backup.s_date );
		$('#DAscheduleNewEndDateId').val( this._edit_backup.e_date );

		$('#DA_schedule_param_StartHour').val( this._edit_backup.s_hh );
		$('#DA_schedule_param_StartMin').val( this._edit_backup.s_mi );
		$('#DA_schedule_param_EndHour').val( this._edit_backup.e_hh );
		$('#DA_schedule_param_EndMin').val( this._edit_backup.e_mi );

		DA.schedule.backToEditMainPage();
	},

	setTitle: function () {
		var title = $('#DA_schedule_param_Title').val();
		$('#DA_schedule_edit_text_Title').text(title);
		var tag = $('#DA_schedule_edit_text_Title').text(title).html().replace(/\n/g, '');
		$('#DA_schedule_edit_text_Title').html(tag);

		this._edit_backup.title = title;

		DA.schedule.backToEditMainPage();
	},

	cancelTitle: function () {
		$('#DA_schedule_param_Title').val( this._edit_backup.title );
		DA.schedule.backToEditMainPage();
	},

	setPlace: function () {
		var place = $('#DA_schedule_param_Place').val();
		var tag = $('#DA_schedule_edit_text_Place').text(place).html().replace(/\n/g, '<br>');
		$('#DA_schedule_edit_text_Place').html(tag);

		this._edit_backup.place = place;

		DA.schedule.backToEditMainPage();
	},

	cancelPlace: function () {
		$('#DA_schedule_param_Place').val( this._edit_backup.place );
	},

	setMemo: function () {
		var memo = $('#DA_schedule_param_Memo').val();
		var tag = $('#DA_schedule_edit_text_Memo').text(memo).html().replace(/\n/g, '<br>');
		$('#DA_schedule_edit_text_Memo').html(tag);

		this._edit_backup.memo = memo;

		DA.schedule.backToEditMainPage();
	},

	cancelMemo: function () {
		$('#DA_schedule_param_Memo').val( this._edit_backup.memo );
	},

	setOpt: function (num) {
		var param_id = "#DA_schedule_param_Opt"+num;
		var tag_id = "#DA_schedule_edit_text_Opt"+num;
		var param_val = $(param_id).val();
		var tag = $(tag_id).text(param_val).html().replace(/\n/g, '<br>');
		$(tag_id).html(tag);

		var id = "opt"+num;
		this._edit_backup[id] = param_val;

		DA.schedule.backToEditMainPage();
	},

	cancelOpt: function (num) {
		var param_id = "#DA_schedule_param_Opt"+num;
		var id = "opt"+num;
		$(param_id).val( this._edit_backup[id] );
	},

	setOptions: function () {

		// backup
		this._edit_backup.open_f = $('#DA_schedule_param_Open').val();
		this._edit_backup.r_mail = $('#DA_schedule_param_Rmail').val();

		this._edit_backup.u_mail = ("true" === $('#DA_schedule_edit_Umail').attr('toggled')) ? 'on' : '';
		this._edit_backup.u_mail2 = ("true" === $('#DA_schedule_edit_Umail2').attr('toggled')) ? 'on' : '';
		this._edit_backup.c_mail = ("true" === $('#DA_schedule_edit_Cmail').attr('toggled')) ? 'on' : '';
		
		this._edit_backup.pub_list = DA.Select.getOutPut('user','DA_schedule_edit_Public', {mode:'list',col:'id'});
		this._edit_backup.by_id = DA.Select.getOutPut('user','DA_schedule_edit_Byid', {mode:'list',col:'id'});

		this._edit_backup.public_array = DA.Select.getOutPut('user', 'DA_schedule_edit_Public');
		this._edit_backup.byid_array = DA.Select.getOutPut('user', 'DA_schedule_edit_Byid');


		// set other-settings to main-page
		var def = DA.schedule._edit_default;
		var temp = DA.schedule._edit_backup;
		var label = {
			open_f : $('#DA_schedule_edit_label_Open').html(),
			r_mail : $('#DA_schedule_edit_label_Rmail').html(),
			u_mail : $('#DA_schedule_edit_label_Umail').html(),
			u_mail2  : $('#DA_schedule_edit_label_Umail2').html(),
			c_mail   : $('#DA_schedule_edit_label_Cmail').html(),
			pub_list : $('#DA_schedule_edit_label_Public').html(),
			by_id    : $('#DA_schedule_edit_label_Byid').html(),
		};

		var h = [];
		var v = "";
		var data_num;
		if (temp.open_f != def.open_f) {
			v = $('#DA_schedule_param_Open :selected').html();
			h.push("<div><label>" + label.open_f + "</label><span>" + v + "</span></div>");
		}
		$.each(['u_mail', 'u_mail2', 'c_mail'], function() {
			v = (temp[this]) ? temp[this].toUpperCase() : 'OFF';
			if (temp[this] != def[this]) {
				h.push("<div><label>" + label[this] + "</label><span>" + v + "</span></div>");
			}
		});
		if (Number(temp.open_f)) {
			if (!DA.util.isEmpty(temp.pub_list) | !DA.util.isEmpty(def.pub_list)) {
				if (temp.pub_list != def.pub_list) {
					if (DA.util.isEmpty(temp.pub_list)) {
						data_num = 0;
					} else {
						data_num = temp.pub_list.split(',').length;
					}
					v = DA.vars.detailSeletedNumMsg;
					v = v.replace("%1", data_num);
					h.push("<div><label>" + label.pub_list + "</label><span>" + v + "</span></div>");
				}
			}
		}
		var byid_name;
		if (!DA.util.isEmpty(temp.by_id) | !DA.util.isEmpty(def.by_id)) {
			if (temp.by_id != def.by_id && !DA.util.isEmpty(temp.byid_array[0])) {
				byid_name = DA.util.encode(temp.byid_array[0].name);
				v = "<span class=\"DA_sc_detail_other_reg_user_class\"><span class=\"DA_ico_user DA_front_icon_class\">" + byid_name + "</span></span>";
				h.push("<div><label>" + label.by_id + "</label>" + v + "</div>");
			}
		}

		var html = h.join('');
		if (DA.util.isEmpty(html)) {
			$('#DA_schedule_edit_Settings').html("<div><label>"+DA.vars.otherTitle+"</label></div>");
		} else {
			$('#DA_schedule_edit_Settings').html(html);
		}

		DA.schedule.backToEditMainPage();
	},

	cancelOptions: function () {
		$('#DA_schedule_param_Open').val(this._edit_backup.open_f);
		$('#DA_schedule_param_Rmail').val(this._edit_backup.r_mail);

		var val = (this._edit_backup.u_mail) ? "true" : "false";
		$('#DA_schedule_edit_Umail').attr('toggled', val);

		val = (this._edit_backup.u_mail2) ? "true" : "false";
		$('#DA_schedule_edit_Umail2').attr('toggled', val);

		val = (this._edit_backup.c_mail) ? "true" : "false";
		$('#DA_schedule_edit_Cmail').attr('toggled', val);

		DA.Select.InitSelectItem('user','DA_schedule_edit_Public','DA_schedule_edit_hidden_Public', this._edit_backup.public_array);
		DA.Select.InitSelectItem('user','DA_schedule_edit_Byid','DA_schedule_edit_hidden_Byid', this._edit_backup.byid_array);

		this.changeOpen();
		this.changeCmail();
	},

	changeCmail: function () {
		if ('true' === $('#DA_schedule_edit_Cmail').attr('toggled')) { // ON
			$('#DA_schedule_edit_Rmail').show();
		} else { // OFF
			$('#DA_schedule_edit_Rmail').hide();
		}

	},
	changeOpen: function (val) {
		if (DA.util.isEmpty($("#DA_schedule_edit_label_Public").html())) {
			return;
		}
		if (DA.util.isEmpty(val)) {
			val = $('#DA_schedule_param_Open').val();
		}
		switch (val) {
			case '0':
				$('#DA_schedule_edit_div_Public').hide();
				break;
			case '1':
				$('#DA_schedule_edit_div_Public').show();
				break;
			case '2':
				$('#DA_schedule_edit_div_Public').show();
				break;
			default:
				break;
		}
	},

	backToEditMainPage: function () {
		// slide left
		DA.navigationController.backPage({
			event : null,
			link  : null,
			func  : 'schedule',
			sub   : 'edit',
		}, 'DA_schedule_edit_Id');
	},
	viewOthers : function(){

		var args = {};
		// initialize backup data
		DA.schedule._edit_backup = {};
		this.jsonConExecute('others', args, false, true, false, {

			onSetContents: function(url,params,cache){

				/// deal show/hide

				// target data area
				var ids = [
					"select_target_4sc",
				];
				// hide area
				jQuery.each ( ids, function(){
					var id = "#"+this;
					var ctrl_target = $(id).closest('form[da_schedule_disp_control_area=1]');
					if (DA.util.isEmpty( $(id).html() )) {
						ctrl_target.hide();
						ctrl_target.removeClass('row');
					} else {
						ctrl_target.addClass('row');
						ctrl_target.show();
					}
				});

				// deal border-line and fieldset
				DA.schedule.setEditFieldsetBorder();
				DA.param.schedule.target = $('#select_target_4sc').val();
				DA.param.schedule.keyword = undefined;
				$('#DA_schedule_search_keyword').val('');
				$('#DA_schedule_search_keyword').attr("placeholder",DA.vars.scheduleSearchKeywordHint);
			}
		});
	
	},
	
	changeTarget : function(target){
		$('#DA_schedule_search_keyword').val('');
		this.doSearch(target);
	},
	doSearch : function(target){
		if (this.debug) console.log("doSearch");
		
		if(!target){
				target = $('#select_target_4sc').val();
		}
		var keyword   = $('#DA_schedule_search_keyword').val();
		
		this.jsonConExecute('search',{ 'target': target ,'keyword':keyword }, false, true);
		DA.param.schedule.target  = target;
		DA.param.schedule.keyword = keyword;
		DA.param.schedule.page    = 1;

	},
	addNextList: function() {
		if (this.debug) console.log("addNextList");
		
		var args = {
			'target'   : DA.param.schedule.target,
			'keyword'  : DA.param.schedule.keyword,
			'page'     : DA.util.isNumber(DA.param.schedule.page) ? DA.param.schedule.page : 1,
		};
		DA.param.schedule.page = args.page = args.page + 1;
		this.jsonConExecute('search', args, true , true);
	},
	editStart : function (mode, slide, param) {
		mode = (mode) ? mode : 'new';
		DA.param.schedule.edit_param.num = ('new' === mode) ? 0 : num;

		var num = DA.param.schedule.detail_param.num;
		var date = DA.param.schedule.date;
		var ym = (new String(date)).substr(0, 6);

		
		// set edit_call kind 
		if ('new' != mode) {
			DA.param.schedule.edit_call = 'detail';
		} else if ('launcher' === param.from) {
			DA.param.schedule.edit_call = 'launcher';
		}

		var edit_permit = DA.param.schedule.detail_param.edit_permit;
		if ('update' === mode && !edit_permit) {
			alert(DA.vars.scheduleCantUpdateMsg);
			return;
		}

		if ('on' === slide) {
			DA.navigationController.slidePage({
				event : null,
				link  : null,
				func  : 'schedule',
				sub   : 'edit',
			}, 'DA_schedule_edit_Id');
		}

		// decide new date
		var view = DA.param.schedule.view;
		if ('new' === mode) {
			date = ('launcher' != param.from  && 'month' === view)
				? DA.param.schedule.date
				: '';
		} else {
			date = "";
		}

		var args = {
			mode: mode,
			num : num,
			ym : ym,
			date : date,
		};

		// initialize backup data
		DA.schedule._edit_backup = {};

		this.jsonConExecute('edit', args, false, true, false, {

			onSetContents: function(url,params,cache){

				/// deal show/hide

				// target data area
				var ids = [
					"DA_schedule_edit_label_Type",
					"DA_schedule_edit_label_Plan",
					"DA_schedule_edit_label_Title",
					"DA_schedule_edit_label_Memo",
					"DA_schedule_edit_label_Place",
					"DA_schedule_edit_label_Fa",
					"DA_schedule_edit_label_Open",
					"DA_schedule_edit_label_Public",
					"DA_schedule_edit_label_Opt1",
					"DA_schedule_edit_label_Opt2",
					"DA_schedule_edit_label_Opt3",
					"DA_schedule_edit_label_Opt4",
					"DA_schedule_edit_label_Opt5",
					"DA_schedule_edit_data_Other",
					"DA_schedule_edit_data_Repeat",
					"DA_schedule_edit_label_Umail",
					"DA_schedule_edit_label_Umail2",
					"DA_schedule_edit_label_Cmail",
					"DA_schedule_edit_label_Rmail",
					"DA_schedule_edit_data_Attach",
					// "DA_schedule_edit_data_Report",
				];

				// hide area
				jQuery.each ( ids, function(){
					var id = "#"+this;
					var ctrl_target = $(id).closest('div[da_schedule_disp_control_area=1]');
					if (DA.util.isEmpty( $(id).html() )) {
						ctrl_target.hide();
						ctrl_target.removeClass('row');
					} else {
						ctrl_target.addClass('row');
						ctrl_target.show();
					}
				});

				// deal border-line and fieldset
				DA.schedule.setEditFieldsetBorder();

				// dependency
				DA.schedule.changeType();
				DA.schedule.changeOpen();
				DA.schedule.changeCmail();

				// other initialize
				$('#DA_schedule_edit_Settings').html("<div><label>"+DA.vars.otherTitle+"</label></div>");

				$('#DA_schedule_edit_label_Repeat').removeClass("DA_sc_error_class");
				$('#DA_schedule_edit_label_repeatRange').removeClass("DA_sc_error_class");

				$('#DA_schedule_edit_Error').html('');


				// backup
				DA.schedule.getEditParam(DA.schedule._edit_default);
				DA.schedule._edit_backup = {};
				$.each (DA.schedule._edit_default, function(k,v) {
					DA.schedule._edit_backup[k] = DA.schedule._edit_default[k];
				});

				// header button
				if ('launcher' === DA.param.schedule.edit_call && !DA.schedule.existList()) {
					$('#backButton').attr('onClick', "DA.schedule.initListView();");
				}
			}
		});
		
		// initialize edit_param
		DA.param.schedule.edit_param.num = ('new' === mode) ? 0 : num;
		DA.param.schedule.edit_param.ym = ym;
		DA.param.schedule.edit_param.mode = mode;
		DA.param.schedule.edit_param.start_flg = 1;
		DA.param.schedule.edit_param.e_time_chg_flg = 0;
	},

	hideEditFaArea : function () {
		var ctrl_target = "#DA_schedule_edit_div_Fa";
		$(ctrl_target).hide();
		$(ctrl_target).removeClass('row');

		this.setEditFieldsetBorder();
	},
	showEditFaArea : function () {
		if (DA.util.isEmpty($("#DA_schedule_edit_label_Fa").html())) {
			return;
		}
		var ctrl_target = "#DA_schedule_edit_div_Fa";
		$(ctrl_target).addClass('row');
		$(ctrl_target).show();

		this.setEditFieldsetBorder();
	},

	setEditFieldsetBorder : function () {
		// deal border-line and fieldset
		$("#DA_schedule_edit_Id fieldset").each( function () {
			var field = "#" + $(this).attr('id');
			var selector_row = field + " .row";
			var selector_row_last = selector_row + ":last";
			if ($(selector_row).length) {
				$(selector_row).css('border-bottom-width', '');         // show all once
				$(selector_row_last).css('border-bottom-width', '0px'); // hide last
				$(field).show();
			} else {
				$(field).hide();
			}
		});
	},

	setViewMid : function (mid) {
		if (this.isOther(mid)) {
			DA.param.schedule.view_mid = mid;
		} else {
			DA.param.schedule.view_mid = '';
		}
	},
	getViewMid : function (mid) {
		return DA.param.schedule.view_mid;
	},
	isOtherView : function () {
		var mid = this.getViewMid();
		if (this.isOther(mid)) {
			return true;
		} else {
			return false;
		}
	},
	isOther : function (mid) {
		if (mid && mid != DA.vars.userMid) {
			return true;
		} else {
			return false;
		}
	},

	changeView : function (mode, in_date, chk_after, mid) {
		var sub = (mode) ? mode : 'list';
		var date = (in_date) ? in_date : DA.param.schedule.date;

		var view_now = DA.param.schedule.view;

		if ((mid && mid != this.getViewMid()) || (!mid && this.isOtherView())) {
			 this.clearList();
		}
		this.setViewMid(mid)

		if ('month' == mode) {
			DA.schedule.getMonthData(date, true);
			DA.schedule.controlMonthNavi(date);

			DA.param.schedule.view = 'month';

		} else {

			// delete no-need line
			if (this.existListDate(date)) {
				this.deletePrevListLines(date) 
			} else {
				this.clearList();
			}
			// disp data
			var read_num = this.getReadNum();
			this.addList(date, { 
				multi_num : read_num, 
				chk_after : chk_after, 
				preReadFunc : function() {
					var me = DA.schedule;
					var date_arr = (new Array())
						.concat(me.makeDateArray(me.incDate(date, read_num), read_num))
						.concat(me.makeDateArray(me.incDate(date, -1), read_num, {dest: 'prev'}))
					me.preReadByDate('list', date_arr, {mid:mid});
				},
			});

			DA.param.schedule.view = 'list';

			// header-footer status
			this.setListBtnView();
		}
	},
	setListBtnView : function () {
		if(this.isOtherView()){
			this.setBackBtnView(DA.param.schedule.isOtherSc==true ? 'others' : 'off');
			this.setFooterBtnView('list', DA.param.schedule.isOtherSc==true ? 'others' : 'address');
		}else{
			this.setBackBtnView(DA.param.schedule.isOtherSc==true ? 'others' : 'on');
			this.setFooterBtnView('list', DA.param.schedule.isOtherSc==true ? 'others' : 'schedule');
		}
		
	},
	setBackBtnView : function (status) {
		var selector = "#DA_head_id .DA_head_l_class";
		if ('off' === status) {
			$(selector).hide();
		} else if('on' === status) {
			$(selector).show();
			$('#backButton').attr('href','#DA_portal_list_Id');
			$('#backButton').text('TOP');
		} else {
			$(selector).show();
			$('#backButton').attr('href','#DA_schedule_others_Id');
			$('#backButton').text(DA.vars.backTitleBack);
		}
	},
	setFooterBtnView : function (sub, mode) {
		if ('list' === sub) {
			if ('address' === mode) {
				DA.navigationController.selectFooter('address','detail');
				DA.navigationController.groupClickableButton(DA.dom.getEl('DA_address_list_footer_schedule_btn'), 'address_detail');
			} else if('schedule' === mode) {
				DA.navigationController.selectFooter('schedule','list');
				DA.navigationController.groupClickableButton(DA.dom.getEl('DA_footnavi_schedule_list_Id'), 'schedule_main');
			} else {
				DA.navigationController.selectFooter('schedule','others');
			}
		}
	},

	todayView : function () {
		var view = DA.param.schedule.view;
		var date = DA.param.schedule.date;
		var today = DA.param.schedule.today;
		var date_ym = (date).substr(0.6);
		var today_ym = (today).substr(0.6);

		if (this.isOtherView()) {
			 this.clearList();
		}
		this.setViewMid()  // for login-user only

		if ('month' == view) {
			if (date_ym == today_ym) {
				DA.schedule.selectDate(date, today); 
				DA.schedule.getMonthListData(date, true)
			} else {
				DA.schedule.getMonthData(today, true)
				DA.schedule.controlMonthNavi(today);
			}
		} else {
			this.changeView('list', today);
			DA.action.scrollTop();
		}

		DA.param.schedule.date = today;
	},

	controlMonthNavi : function (date) {
		var y = m = String(date);
		var title = DA.navigationController.pageTitle();
		if (DA.util.isNull(title)) {
			title="";
		}
		if ('ja' === DA.vars.userLang || '' === DA.vars.userLang) {
			title.match(/\d{4}(.)\d{1,2}(.)$/);
			title = y.substr(0,4) + RegExp.$1 + m.substr(4,2) + RegExp.$2;
		} else {
			var m_str = DA.vars.calendarMonthStr;
			m = Number(m.substr(4,2));
			title = m_str[m] + ' ' + y.substr(0,4);
		}
		DA.navigationController.pageTitle(title);
	},

	selectDate : function (date, today) {
		var target_id = '#DA_schedule_month_a_'+date;
		var today_id = '#DA_schedule_month_a_'+today;

		$('a').removeClass('DA_sc_month_select_class')
		$(today_id).removeClass('DA_sc_month_select_today_class')

		if (date == today) {
			$(target_id).addClass('DA_sc_month_select_today_class')
		} else {
			$(target_id).addClass('DA_sc_month_select_class')
			$(today_id).addClass('DA_sc_month_today_class')
		}
		DA.param.schedule.date = date;
	},

	seeNext : function () {
		if (DA.param.schedule.listReloadLock) {
			return;
		} else {
			DA.param.schedule.listReloadLock = 1;
		}
		var read_num = this.getReadNum();
		var date = DA.schedule.searchNextDate( DA.param.schedule.date );

		this.addList(date, {
			multi_num : read_num,
			anime : true,
			preReadFunc : function() {
				var me = DA.schedule;
				var date_arr = me.makeDateArray(me.incDate(date, read_num), read_num);
				me.preReadByDate('list', date_arr, {mid:me.getViewMid()});
			} 
		});

		DA.param.schedule.date = date;
	},

	makeDateArray : function (date, n, opt) {
		// opt.dest : incriment destination('next'(default) /'prev')

		if (!date) { return ;}
		var delta = (opt && 'prev' === opt.dest) ? -1 : 1;

		var date_arr = new Array();
		var i=0;
		for (i=0; Math.abs(i) < Math.abs(Number(n)); i+=delta) {
			date_arr.push(DA.schedule.incDate(date, i));
		}
		return date_arr;
	},

	nextMonth : function (mode) {
		var delta = 1;
		var today = DA.param.schedule.today;
		var date = ('prev' == mode)
			? DA.schedule.incMonth(DA.param.schedule.date, -1 * delta) 
			: DA.schedule.incMonth(DA.param.schedule.date, delta);

		var today_ym = (today).substr(0,6);
		var date_ym = (date).substr(0,6);
		date = (date_ym == today_ym) ? today : date ;

		DA.schedule.controlMonthNavi(date);
		DA.schedule.getMonthData(date, true);

		DA.param.schedule.date = date;
	},

	incDate : function (date, delta) {
		if (!delta) { delta = 0; }
		var str = new String(date);
		var y = eval(str.substr(0, 4));
		var m = eval(str.substr(4, 2)) - 1;
		var d = eval(str.substr(6, 2)) + delta;
		var obj = new Date(y,m,d);
		var new_date = obj.getFullYear() + ('0'+(obj.getMonth()+1)).substr(-2) + ('0'+obj.getDate()).substr(-2);
		return new_date;
	},

	incMonth : function (month, delta) {
		if (!delta) { delta = 0; }
		var str = new String(month);
		var y = eval(str.substr(0, 4));
		var m = eval(str.substr(4, 2)) - 1 + delta;
		var d = eval(str.substr(6, 2));
		var obj = new Date(y,m,1);
		return obj.getFullYear() + ('0'+(obj.getMonth()+1)).substr(-2) + '01';
	},

	getMonthData : function (date, pre_read) {
		var today = DA.param.schedule.today;
		var in_date = date;
		var month_date = date.substr(0,6) + "01";

		var get_date = (in_date === today) ? today : month_date; 

		var key = DA.schedule.getKey('month', get_date);
		var args = {
			sub: 'month', 
			date: get_date,
		};
		this.jsonConExecute('month', args, false, false, key, {
			// preread date
			onSuccess : function(){
				if (pre_read) {
					var range = 3;
					var date_arr = new Array();
					var i=0;
					if (pre_read) {
						for (i=(range*-1); i<=range; i++) {
							if (0==i) { continue; }
							date_arr.push(DA.schedule.incMonth(month_date, i));
						}
					}
					DA.schedule.preReadByDate('month', date_arr);
				}
			},
			onSetContents : function() {
				DA.schedule.selectDate(in_date, DA.param.schedule.today);
				DA.schedule.controlMonthNavi(date);
			},
		});

		// if not first day, and not today
		if (in_date != month_date && in_date != today) {
			key = DA.schedule.getKey('month', in_date);
			args = {
				sub : 'month', 
				mode : 'list_only',
				date : in_date,
			};
			this.jsonConExecute('month', args, false, false, key); 
		}

		// DA.schedule.selectDate(in_date, DA.param.schedule.today); 
	},

	getMonthListData: function (date, preReadDateArr, preReadNumArr) {
		var key = DA.schedule.getKey('month', date);
		var args = {
			sub : 'month', 
			mode : 'list_only',
			date : date,
		};

		this.jsonConExecute('month', args, false, false, key);

		DA.schedule.selectDate(date, DA.param.schedule.today); 
	},

	clearList : function () {
		$('#DA_schedule_list_Contents').html(''); 
	},
	existList : function () {
		if (DA.util.isEmpty($('#DA_schedule_list_Contents').html())) {
			return false;
		} else {
			return true;
		}
	},

	////////////////////
	//
	// NOTICE : this function has made for recursive call.
	//
	addList : function (date, opt) {
		// opt.anime       : show with animation (true/false)
		// opt.multi_num   : display number (amount)
		// opt.dest        : add destination (next(or undef)/prev)
		// opt.preReadFunc : function for pre_read
		// opt.chk_after   : switch today's view (true/false)
		// opt.mid         : other user's mid

		if (!date) { return; }
		var speed = (opt && opt.anime) ? 700 : 0;
		var today = DA.param.schedule.today;

		var mid = this.getViewMid();

		DA.param.schedule.call_cnt++;

		var exist_next = 0;
		if (opt && 1 < opt.multi_num && DA.param.schedule.call_cnt < opt.multi_num) { 
			exist_next = 1;
		} else {
			DA.param.schedule.call_cnt = 0; // make sure
		}

		// recursive call function
		var addNext = function (date) {
			var next_date = DA.schedule.incDate(date, 1);
			DA.schedule.addList(next_date, opt);
		};

		// preread function
		var preReadFunc = (!exist_next && opt && DA.util.isFunction(opt.preReadFunc)) ? function () {
			opt.preReadFunc();
		} : function () {};

		var lastShowFunc = (!exist_next) ? function () {
			var me = DA.schedule;
			if (!me.isTop(today)) {
				me.showRestData(today);
			}
		} : function () {};


		var key_opt = {
			mid : this.isOther(mid) ? mid : '',
		};
		var key = DA.schedule.getKey('list', date, key_opt);

		var args = {
			sub: 'list',
			date : date,
			effect : 1,   // always get invisible-style first
			mid : this.isOther(mid) ? mid : '',
		};

		var hash = {
			mask : true,
			onSetContents : function () {
				DA.schedule.showOneDay(date, speed);
				if (exist_next) { addNext(date); } // call recursively
				if (!exist_next) { 
					lastShowFunc();
					if (!DA.util.isNull(DA.navigationController.footer)) {
						DA.navigationController.hiddenFooter();
						setTimeout("DA.navigationController.showFooter()",500);
					}
					DA.param.schedule.listReloadLock = 0;
				}
			},
			onCache : function () {
				if (!exist_next) { preReadFunc(); }
			},
		};

		if (opt && 'prev' === opt.dest) {
			DA.schedule.prependJsonConExecute('list', args, false, key, hash); 
		} else {
			var nocache = false;
			if ('after' === DA.param.schedule.list_type && date === today) {
				if (DA.param.schedule.call_cnt <= 1 && opt && opt.chk_after) {
					nocache = true;
					args.init = 1;
				}
			}
			DA.schedule.appendJsonConExecute('list', args, nocache, key, hash); 
		}
	},

	// show oneday's data
	showOneDay : function (date, speed) {
		if (!date) {return;}
		if (!speed) {speed = 0;}

		var id = '#DA_schedule_list_subtitle_' + date;
		this.changeOpacity(id, 1, speed);

		id = '#DA_schedule_list_' + date + '_nodata_info';
		this.changeOpacity(id, 1, speed);

		var key = "schedule_list_"+date;
		var reg = new RegExp(key);
		$('li').each( function (idx, o) {
			var id = $(o).attr("id");
			if (id.match(reg)) {
				DA.schedule.changeOpacity(id, 1, speed);
			}
		});
	}, 
	changeOpacity : function (id, opacity, speed) {
		if (!opacity) { opacity = 0;}
		if (id) {
			DA.jQuery.getEl(id).animate({
				opacity: opacity
			}, speed);
		}
	},


	showRestData : function (date) {
		var selecter = "#DA_schedule_list_Id li[id*=" + date + "]"
		$(selecter).each(function () {
			if ('none' === $(this).css("display")) {
				$(this).css("opacity","0")
					.css("display","")
					.animate({opacity:1}, 700);
			}
		});

		selecter = "#DA_schedule_list_Id li[id*=noafter_info]";
		$(selecter).hide();
	},
	existHideLine : function (date) {
		var selecter = "#DA_schedule_list_Id li[id*=" + date + "]"
		var exist = 0;
		$(selecter).each(function () {
			var id = $(this).attr("id");
			if (id.match(/noafter_info/)) {
				return true;
			}

			if ('none' === $(this).css("display")) {
				exist = 1; return false;
			}
		});
		return exist;
	},


	deletePrevListLines : function (date) {
		if (!date) { return false; }
		
		var id;
		var d;
		$('#DA_schedule_list_Id div[id*="DA_schedule_list_subtitle_"]').each(function () {
			id = $(this).attr("id");
			d = id.substr(-8);
			if (Number(d) < Number(date)) {
				DA.schedule.deleteListLine(d);
			}
		});
	},
	deleteListLine : function (date) {
		if (!date) { return false; }

		var selector = "#DA_schedule_list_Id div[id*=" + date + "]";
		$(selector).remove();

		selector = "#DA_schedule_list_Id li[id*=" + date + "]";
		$(selector).remove();
	},

	isTop : function (date) {
		var me = DA.schedule;
		if (me.existListDate(date) && !me.existListDate(me.incDate(date, -1))) {
			return true;
		} else {
			return false;
		}
	},
	existListDate : function (date) {
		if (!date) { return false; }
		var id = this.getListSubtitleId(date);
		if (DA.jQuery.getEl(id).attr("id")) {
			return true;
		} else {
			return false;
		}
	},
	searchNextDate : function (date, dest) {
		// dest : search destination ('next'(default) / 'prev')

		var n = ('prev' === dest) ? -1: 1;

		date = DA.schedule.incDate(date, n);
		var id = this.getListSubtitleId(date);
		while (DA.jQuery.getEl(id).attr("id")) {
			date = this.incDate(date, n)
			id = this.getListSubtitleId(date);
		}
		return date;
	},
	getListSubtitleId : function (date, mark) {
		var id = "DA_schedule_list_subtitle_" + date;
		if (mark) {
			id = '#' + id;
		}
		return id;
	},

	getDetailData : function (date, num, ym, from) {
		if (from) {
			DA.param.schedule.fromPage = from;
		}
		if ('portal' == from) {
			DA.param.schedule.isOtherSc = false;
			this.setViewMid();
			this.clearList();
		}

		DA.param.schedule.date = (date) ? date: DA.param.schedule.date;

		// initialize detail_param
		DA.param.schedule.detail_param.num = num;
		DA.param.schedule.detail_param.ym = (ym) ? date.substr(0,6) : ym;

		// DA.param.schedule.detail_param.fa_chk = '';
		// DA.param.schedule.detail_param.fa_del_confirmed = 0;

		// get detail data
		var args = {
			date : date, 
			num : num, 
			ym : ym,
		};
		var key = DA.schedule.getKey('detail', num);

		this.jsonConExecute('detail', args, false, true, key, {

			onSetContents: function(url,params,cache){

				/// deal show/hide data area

				// target area
				var ids = [
					"DA_schedule_detail_data_User",
					"DA_schedule_detail_data_Open",
					"DA_schedule_detail_data_Type",
					"DA_schedule_detail_data_Repeat",
					"DA_schedule_detail_data_Other",
					"DA_schedule_detail_data_Facilities",
					"DA_schedule_detail_data_Place",
					"DA_schedule_detail_data_Memo",
					"DA_schedule_detail_data_Public",
					"DA_schedule_detail_data_Opt1",
					"DA_schedule_detail_data_Opt2",
					"DA_schedule_detail_data_Opt3",
					"DA_schedule_detail_data_Opt4",
					"DA_schedule_detail_data_Opt5",
					"DA_schedule_detail_data_Attach",
					"DA_schedule_detail_data_Report",
					"DA_schedule_detail_data_Byid2",
					"DA_schedule_detail_label_Umail",
					"DA_schedule_detail_label_Umail2",
				];

				// hide 
				jQuery.each ( ids, function(){
					var id = "#"+this;
					var ctrl_target = $(id).closest('div[da_schedule_disp_control_area=1]');
					if (DA.util.isEmpty( $(id).html() )) {
						ctrl_target.hide();
						ctrl_target.removeClass('row');
					} else {
						ctrl_target.addClass('row');
						ctrl_target.show();
					}
				});

				// deal border-line and fieldset
				$("#DA_schedule_detail_Id fieldset").each( function () {

					$(this).children('.row').css('border-bottom-width', '');         // show all once
					$(this).children('.row:last').css('border-bottom-width', '0px'); // hide last

					if($(this).children().hasClass('row')){
						$(this).show();
					} else {
						$(this).hide();
					}
				});

				// other initialize
				$('#DA_schedule_detail_label_Repeat').removeClass("DA_sc_error_class");
				$('#DA_schedule_detail_label_repeatRange').removeClass("DA_sc_error_class");

				$('#DA_schedule_detail_Error').html('');

				// button control
				if (DA.param.schedule.detail_param.edit_permit) {
					$('#DA_footnavi_schedule_edit_Id').removeClass('DA_footbtnlist_l_disable_class');
					$('#DA_footnavi_schedule_edit_Id').addClass('DA_footbtnlist_l_class');
				} else {
					$('#DA_footnavi_schedule_edit_Id').removeClass('DA_footbtnlist_l_class');
					$('#DA_footnavi_schedule_edit_Id').addClass('DA_footbtnlist_l_disable_class');
				}
				if (DA.param.schedule.detail_param.delete_permit) {
					$('#DA_footnavi_schedule_delete_Id').removeClass('DA_footbtnlist_r_disable_class');
					$('#DA_footnavi_schedule_delete_Id').addClass('DA_footbtnlist_r_class');
				} else {
					$('#DA_footnavi_schedule_delete_Id').removeClass('DA_footbtnlist_r_class');
					$('#DA_footnavi_schedule_delete_Id').addClass('DA_footbtnlist_r_disable_class');
				}

				DA.navigationController.autoScroll();
			},
		}); 
	},

	//--------------------------------------
	// make preread data-set (for month, list)
	// sub     : 'month' or 'list'
	// date_arr: array of target date
	preReadByDate : function (sub, date_arr, param) {
		var mid = (param && param.mid) ? param.mid : '';
		var param_arr = [];
		for (var i=0; i<date_arr.length; i++) {
			var date = date_arr[i];
			var key_opt = {
				mid : this.isOther(mid) ? mid : '',
			};
			var key = DA.schedule.getKey(sub, date, key_opt);
			var url = DA.vars.spCgiRdir + "/sp_ajx_api.cgi?proc=contents_json&func=schedule&sub="+ sub +"&date="+date+"&mid="+mid;
			if ('list' === sub) {url += "&effect=1";}
			param_arr.push({key:key, url:url});
		}
		readCon.execute(param_arr);
	},

	//--------------------------------------
	// make preread data-set {key, url}  (for detail)
	// target_arr : array of {ym, num}
	preReadByNum : function (target_arr) {
//		var parallel_json = [];
//		for (var i=0; i<target_arr.length; i++) {
//			var ym  = target_arr[i].ym;
//			var num = target_arr[i].num;
//			// var key = "schedule_" + "detail" + "_"+ num;
//			var key = DA.schedule.getKey('detail', num);
//			var url = DA.vars.spCgiRdir + "/sp_ajx_api.cgi?proc=contents_json&func=schedule&sub=detail" +"&ym=" + ym + "&num="+num;
//
//			parallel_json.push({key:key, url:url});
//
//		}
//		var read = new DA.widget.parallelContents();
//		read.execute(parallel_json);
	},

	//--------------------------------------
	// make key for schedule (LocalStorage)
	getKey : function (sub, id, opt) {
		// sub: month, list, detail
		// id : sub=month or list : YYYYMMDD
		//      sub=detail : num
		// opt.mid : other user's mid

		var key = "schedule_" + sub + "_"+ ((opt && opt.mid)?opt.mid+"_":"") + id;
		return key;
	},

	// get display data
	// (you must initialize argment(hash) before you call this function)
	getEditParam : function (hash) {

		var item = {
			type   : 'DA_schedule_param_Type',
			s_date : 'DAscheduleNewStartDateId',
			s_hour : 'DA_schedule_param_StartHour',
			s_min  : 'DA_schedule_param_StartMin',
			e_date : 'DAscheduleNewEndDateId',
			e_hour : 'DA_schedule_param_EndHour',
			e_min  : 'DA_schedule_param_EndMin',
			open_f : 'DA_schedule_param_Open',
			r_mail : 'DA_schedule_param_Rmail',
			plan   : 'DA_schedule_param_Plan',
			title : 'DA_schedule_param_Title',
			place : 'DA_schedule_param_Place',
			memo : 'DA_schedule_param_Memo',
			opt1 : 'DA_schedule_param_Opt1',
			opt2 : 'DA_schedule_param_Opt2',
			opt3 : 'DA_schedule_param_Opt3',
			opt4 : 'DA_schedule_param_Opt4',
			opt5 : 'DA_schedule_param_Opt5',
		};
		for (var i in item) {
		        var id = '#'+item[i];
		        hash[i] = $(id).val();
		}

		hash.u_list        = DA.Select.getOutPut('user','DA_schedule_edit_User',   {mode:'list', col:'id'})
		hash.f_list        = DA.Select.getOutPut('fa',  'DA_schedule_edit_Fa',     {mode:'list', col:'id'})
		hash.fg_list       = DA.Select.getOutPut('fa',  'DA_schedule_edit_Fa',     {mode:'list', col:'fgid'})
		hash.pub_list      = DA.Select.getOutPut('user','DA_schedule_edit_Public', {mode:'list', col:'id'})
		hash.by_id         = DA.Select.getOutPut('user','DA_schedule_edit_Byid',   {mode:'list', col:'id'})
		hash.u_type_list   = DA.Select.getOutPut('user','DA_schedule_edit_User',   {mode:'list', col:'type'})
		hash.pub_type_list = DA.Select.getOutPut('user','DA_schedule_edit_Public', {mode:'list', col:'type'})

		// toggle button
		hash.u_mail  = ('true' === $('#DA_schedule_edit_Umail').attr('toggled')) ? 'on' : '';
		hash.u_mail2 = ('true' === $('#DA_schedule_edit_Umail2').attr('toggled')) ? 'on' : '';
		hash.c_mail  = ('true' === $('#DA_schedule_edit_Cmail').attr('toggled')) ? 'on' : '';

		// radio button
		hash.r_type = $('#DA_schedule_edit_Id input:radio[@name=DA_schedule_edit_param_repeatRange_Name]:checked').val();

		//check box
		hash.fa_update = $("#DA_schedule_edit_fa_update_chk").attr('checked') ? 'on':'';
	},

	getWdayStr : function (num) {
		var str = '';
		var d = DA.vars.calendarDayStr;
		switch (num) {
			case 0:
				str = d.sun; break;
			case 1:
				str = d.mon; break;
			case 2:
				str = d.tue; break;
			case 3:
				str = d.wed; break;
			case 4:
				str = d.thu; break;
			case 5:
				str = d.fri; break;
			case 6:
				str = d.sat; break;
			default:
				str = ''; break;
		}
		return str;
	},

	launcherClick: function(func, sub, param) {
		var today = DA.param.schedule.today;
		// clear other user's data when click from launcher
		//this.setViewMid()  // for login-user only
		//this.clearList();
		DA.param.schedule.isOtherSc = false;
		if ('list' === sub) {
			this.initListView();

		} else if ('month' === sub) {
			DA.param.schedule.date = today;
			DA.schedule.changeView(sub);

		} else if ('edit' === sub) {
			if(this.isOtherView()){
				this.initListView();
			}
			DA.schedule.editStart('new', 'no', {from : 'launcher'});
		} else if ('others' == sub){
			DA.param.schedule.isOtherSc = true;
			DA.schedule.viewOthers();
		}
	},
	setPageTitle : function(){
		if(DA.param.schedule.name){
			$('#pageTitle').text(DA.param.schedule.name);
		}
	},
	startOtherListView : function (mid,isOtherSc,name) {
		if( true == isOtherSc){
			DA.param.schedule.isOtherSc = true;
			if(name){DA.param.schedule.name = name}
		}else{
			DA.param.schedule.isOtherSc = false;
		}
		this.initListView(mid);
		DA.action.scrollTop();
	},
	initListView : function (mid, date) {
		this.setViewMid(mid);
		this.clearList();
		var target_date = (date) ? date : DA.param.schedule.today;
		var list_type = DA.param.schedule.list_type;

		DA.param.schedule.date = target_date;
		this.changeView('list', target_date, ('after'===list_type)?true:false, mid );
	},

	reloadMonth : function () {
		this.clearCacheAll();
		this.changeView('month');
		// this.jsonConExecute('month', {sub :'month',date: DA.param.schedule.date}, false, true);
	},
	reloadList : function () {

		if (DA.param.schedule.listReloadLock) {
			return;
		}
		DA.param.schedule.listReloadLock = 1;

		this.clearCacheAll();
		this.initListView(this.getViewMid(), DA.param.schedule.date);
	},

	clearCacheAll : function () {
		DA.cacheController.removeCacheJsonPattern('schedule_');
	},

	scrollList : function (date, num) {
		var id = "DA_schedule_list_"+ date + "_" + num;
		if (!DA.util.isEmpty(DA.jQuery.getEl(id))) {
			DA.action.autoScroll(id, true);
		}
	},

	item_focus : function (obj) {
		obj.focus();
	},

	//--------------------------------------
	registData : function ( dup_confirmed ) {

		var mode = DA.param.schedule.edit_param.mode;
		var dup_confirmed_val = (dup_confirmed) ? 1: 0;


		if ('new' === mode) {

		} else {
			// check Repeat range 
			var r_type = $('#DA_schedule_edit_Id input:radio[@name=DA_schedule_edit_param_repeatRange_Name]:checked').val();
			if ($('#DA_schedule_edit_data_Repeat').html() && ('none' === r_type || DA.util.isEmpty(r_type))) {
				alert(DA.vars.scheduleUpdateRepeatMsg);
				$('#DA_schedule_edit_repeatRange').show('slow');
				$('#DA_schedule_edit_label_Repeat').addClass('DA_sc_error_class');
				$('#DA_schedule_edit_label_repeatRange').addClass('DA_sc_error_class');
				return;
			}

			// last confirm
			if (!dup_confirmed) {
				if (!confirm(DA.vars.scheduleUpdateConfirmMsg)) {
					return;
				}
			}
		}

		var args = {};
		this.getEditParam(args);

		args.dup_confirmed = dup_confirmed_val;
		args.mode = mode;
		args.num = DA.param.schedule.edit_param.num;
		args.ym = DA.param.schedule.edit_param.ym;
		args.start_flg = DA.param.schedule.edit_param.start_flg;

		this.jsonConExecute('regist', args, false, true);

		DA.param.schedule.edit_param.start_flg = 0;
	},

	//--------------------------------------
	deleteData : function () {

		var detail_param = DA.param.schedule.detail_param;

		var r_type = $('#DA_schedule_detail_Id input:radio[@name=DA_schedule_detail_param_repeatRange_Name]:checked').val();
		var fa_exist = (DA.util.isEmpty($('#DA_schedule_detail_data_Facilities').html())) ? false : true;

		var delete_permit = detail_param.delete_permit;
		if (!delete_permit) {
			alert(DA.vars.scheduleCantDeleteMsg);
			return;
		}

		// check facilities delete
		if (fa_exist && !detail_param.fa_del_confirmed) {
			if (confirm(DA.vars.scheduleDeleteFaMsg)) {
				detail_param.fa_chk = 'on';
			} else {
				detail_param.fa_chk = '';
			}
			detail_param.fa_del_confirmed = 1;
		}

		// check repeat range
		if ($('#DA_schedule_detail_data_Repeat').html() && ('none' === r_type || DA.util.isEmpty(r_type))) {
			alert(DA.vars.scheduleDeleteRepeatMsg);
			$("#DA_schedule_detail_repeatRange").addClass("row");
			$('#DA_schedule_detail_repeatRange').show('slow');
			$('#DA_schedule_detail_label_Repeat').addClass('DA_sc_error_class');
			$('#DA_schedule_detail_label_repeatRange').addClass('DA_sc_error_class');
			return;
		}

		// last confirm
		var msg = (1 == delete_permit) ? DA.vars.scheduleDeleteConfirmMsg: DA.vars.scheduleDeleteMyConfirmMsg;
		if (!confirm(msg)) {
			return;
		}

		// toggle button
		var u_mail  = ('true' === $('#DA_schedule_detail_Umail').attr('toggled')) ? 'on' : '';
		var u_mail2 = ('true' === $('#DA_schedule_detail_Umail2').attr('toggled')) ? 'on' : '';

		var date = DA.param.schedule.date;
		var ym = (new String(date)).substr(0, 6);
		var args = {
			num : detail_param.num,
			ym : ym,
			r_type : r_type,
			fa_chk : detail_param.fa_chk,
			self : (1 == delete_permit) ? 0 : 1 ,
			u_mail : u_mail,
			u_mail2 : u_mail2,
		};
		this.jsonConExecute('delete', args, false, true);

	},

	jsonConExecute: function(sub, args, append, nocache, key, hash) {
		if (append) {
			appendJsonCon.execute($.extend({ func: 'schedule', sub: sub }, args), key, nocache, hash);
		} else {
			// if (nocache) {
			//	jsonCon.executeCache($.extend({ func: 'schedule', sub: sub }, args), key, hash);
			// }
			DA.param.schedule.page=1;
			jsonCon.execute($.extend({ func: 'schedule', sub: sub }, args), key, nocache, hash);
		}
	},
	appendJsonConExecute: function(sub, args, nocache, key, hash) {
		appendJsonCon.execute($.extend({ func: 'schedule', sub: sub }, args), key, nocache, hash);
	},
	prependJsonConExecute: function(sub, args, nocache, key, hash) {
		prependJsonCon.execute($.extend({ func: 'schedule', sub: sub }, args), key, nocache, hash);
	},
};


DA.customEvent.set("navigationController.slidePage", function(params) {
    var event = params.event;
    var func  = params.func;
    var sub   = params.sub;

    if (func === 'schedule') {
        switch(sub) {
            case 'list':
                break;
            case 'month':
                break;
            case 'detail':

                break;
            case 'edit':
                break;
//            case 'editTitle':
//$('#DA_schedule_param_Title').focus();
//$('#DA_schedule_param_Title').select();
//alert(document.activeElement.id);
//                break;
            default:
                break;
        }
    }
});

DA.customEvent.set("navigationController.backPage", function(params) {
    var event = params.event;
    var func  = params.func;
    var sub   = params.sub;

    if (func === 'schedule') {
        switch(sub) {
            case 'list':
                break;
            case 'month':
                break;
            case 'detail':
                break;
            case 'edit':
                DA.navigationController.hiddenFooter();
                break;
            default:
                break;
        }
    }
});

DA.customEvent.set("navigationController.slideDone", function(params) {
	var func  = params.func;
	var sub   = params.sub;

	var from;
	var page;

	if (func === 'schedule') {
		switch(sub) {
			case 'list':
				// var target_id = "DA_schedule_list_subtitle_" + DA.param.schedule.date;
				// var selecter = '#' + target_id;
				// if ($(selecter).attr("id")) {

					//DA.customEvent.fire("contentsController.autoScroll.before", params); 
					//DA.action.autoScroll(target_id);
					//DA.customEvent.fire("contentsController.autoScroll.after", params); 

					//DA.customEvent.fire("contentsController.autoScroll.before", {}); 
					//DA.action.autoScroll(target_id, true, function() {
					//	DA.customEvent.fire("contentsController.autoScroll.after", {}); 
					//});
				// }

				// header-footer status
				DA.schedule.setListBtnView();

				// scroll
				if ('DA_schedule_detail_Id' === params.fromPage.id) {
				 	DA.schedule.scrollList(DA.param.schedule.date, DA.param.schedule.detail_param.num);
					// $('html, body').scrollTop(DA.param.schedule.list_top);
				}
				if('DA_portal_list_Id' === params.fromPage.id){
					DA.param.schedule.isOtherSc = false;
				}
				if(DA.param.schedule.isOtherSc ==true){
					DA.schedule.setPageTitle();
					DA.schedule.setBackBtnView('others');
					DA.schedule.setFooterBtnView('list','others');

				}

				break;
			case 'month':
				DA.schedule.controlMonthNavi(DA.param.schedule.date);

				DA.navigationController.groupClickableButton(DA.dom.getEl('DA_footnavi_schedule_month_Id'), 'schedule_main');

				break;
			case 'detail':
				switch (params.fromPage.id) {
					case 'DA_portal_list_Id':
						page = '#DA_portal_list_Id';
						$('#backButton').text('TOP');
						break;
					case 'DA_schedule_month_Id':
						page = '#DA_schedule_month_Id';
						$('#backButton').text(DA.vars.backTitleBack);
						break;
					case 'DA_schedule_edit_Id' :
						switch (DA.param.schedule.fromPage) {
							case 'portal' : 
								page = '#DA_portal_list_Id';
								$('#backButton').text('TOP');
								break;
							case 'month' :
								page = '#DA_schedule_month_Id';
								$('#backButton').text(DA.vars.backTitleBack);
								break;
							default:
								page = '#DA_schedule_list_Id';
								$('#backButton').text(DA.vars.backTitleBack);
								break;
						}
						break;
					default:
						page = '#DA_schedule_list_Id';
						$('#backButton').text(DA.vars.backTitleBack);
						break;
				}
				$('#backButton').attr('href', page);
				break;

			case 'edit':
				page = '#DA_schedule_list_Id';
				if ('detail' === DA.param.schedule.edit_call) {
					if (DA.param.schedule.edit_param.num) {
						page = '#DA_schedule_detail_Id';
					}
				} else if (DA.param.schedule.view === 'month') {
					page = '#DA_schedule_month_Id';
				}
				$('#backButton').attr('href', page);

				if (params.backwards) {
					var jump_id;
					switch (params.fromPage.id) {
						case 'DA_schedule_editPlace_Id':
							jump_id = "#DA_schedule_edit_label_Place";
							break;
						case 'DA_schedule_editMemo_Id':
							jump_id = "#DA_schedule_edit_label_Memo";
							break;
						case 'DA_schedule_editOpt1_Id':
							jump_id = "#DA_schedule_edit_label_Opt1";
							break;
						case 'DA_schedule_editOpt2_Id':
							jump_id = "#DA_schedule_edit_label_Opt2";
							break;
						case 'DA_schedule_editOpt3_Id':
							jump_id = "#DA_schedule_edit_label_Opt3";
							break;
						case 'DA_schedule_editOpt4_Id':
							jump_id = "#DA_schedule_edit_label_Opt4";
							break;
						case 'DA_schedule_editOpt5_Id':
							jump_id = "#DA_schedule_edit_label_Opt5";
							break;
						case 'DA_schedule_editOptions_Id':
							jump_id = "#DA_schedule_edit_Settings";
							break;
						// case 'DA_address_list_Id':
						// 	jump_id = "#DA_schedule_edit_label_User";
						// 	break;
						default:
							break;
					}
					if (jump_id && $(jump_id).attr('id')) {
						$('html,body').scrollTop(Math.abs(window.innerHeight - DA.sys.headerHeight - DA.sys.footerHeight - $(jump_id).offset().top)); // do not use autoScroll
					}
					DA.navigationController.showFooter();
				}

				break;

			case 'editTitle':
//setTimeout("$('#DA_schedule_param_Title').focus();$('#DA_schedule_param_Title').select();", 1000);

// alert(document.activeElement.id);
$('#DA_smartphone_id').blur();
$('#DA_schedule_editTitle_Id').blur();
$('#DA_schedule_param_Title').focus();
$('#DA_schedule_param_Title').select();
//alert(document.activeElement.id);


				// var obj = document.getElementById('#DA_schedule_param_Title');
				// obj.focus();
				// obj.select();

				// $('#DA_schedule_param_Title').select(function(){this.hide();this.show();this.focus();});

//				document.body.blur();
//				var obj = document.getElementById('DA_schedule_param_Title');
//				obj.focus();
//				obj.select();
				break;

			case 'editTime':
				break;
			case 'editMemo':
				$('#DA_schedule_param_Memo').focus();
				break;
			case 'editPlace':
				$('#DA_schedule_param_Place').focus();
				break;
			case 'editOpt1':
				$('#DA_schedule_param_Opt1').focus();
				break;
			case 'editOpt2':
				$('#DA_schedule_param_Opt2').focus();
				break;
			case 'editOpt3':
				$('#DA_schedule_param_Opt3').focus();
				break;
			case 'editOpt4':
				$('#DA_schedule_param_Opt4').focus();
				break;
			case 'editOpt5':
				$('#DA_schedule_param_Opt5').focus();
				break;
			default:
				break;
		}
	}
});

DA.customEvent.set("navigationController.frickTop", function(params) {
	var func  = params.func;
	var sub   = params.sub;


	if (func === 'schedule') {
		if (DA.navigationController.isLauncherShow() || DA.param.schedule.listReloadLock) {
			return;
		} else {
			DA.param.schedule.listReloadLock = 1;
		}
		var me = DA.schedule;
		var date = DA.param.schedule.date;
		var today = DA.param.schedule.today;
		var id;
		var read_num = DA.schedule.getReadNum();

		switch(sub) {
			case 'list':

				if (me.existListDate(today) && !me.existListDate(me.incDate(today, -1)) && me.existHideLine(today)) {
					me.showRestData(today);

				} else {
					date = DA.schedule.searchNextDate( date, 'prev' );
					DA.schedule.addList(date, {
						anime : true, 
						dest  : 'prev',
						preReadFunc : function() {
							var me = DA.schedule;
							var date_arr = me.makeDateArray(DA.schedule.incDate(date, -1), read_num, {dest:'prev'});
							me.preReadByDate('list', date_arr, {mid:me.getViewMid()});
						} 
					});

					DA.param.schedule.date = date;
				}

				// DA.action.scrollTop();
				break;
			case 'month':
				break;
			case 'detail':
				break;
			case 'edit':
				break;
			default:
				break;
		}
	}
});

DA.customEvent.set("navigationController.frickBottom", function(params) {
	var func  = params.func;
	var sub   = params.sub;

	var date;
	var id;
	var read_num = DA.schedule.getReadNum();

	if (func === 'schedule') {
		if (DA.navigationController.isLauncherShow() || DA.param.schedule.listReloadLock) {
			return;
		} else {
			DA.param.schedule.listReloadLock = 1;
		}
		switch(sub) {
			case 'list':
				date = DA.schedule.searchNextDate( DA.param.schedule.date );
				DA.schedule.addList(date, {
					anime : true,
					preReadFunc : function() {
						var me = DA.schedule;
						var date_arr = me.makeDateArray(DA.schedule.incDate(date, 1), read_num);
						me.preReadByDate('list', date_arr, {mid:me.getViewMid()});
					} 
				});

				DA.param.schedule.date = date;
		
				// window.scrollTo(0, $('body').height());
				break;
			case 'month':
				break;
			case 'detail':
				break;
			case 'edit':
				break;
			default:
				break;
		}
	}
});

DA.customEvent.set("contentsController.onSuccess", function(in_params) {
	var obj = in_params.object;
	var url = in_params.url;
	var params = in_params.params;
	var output = in_params.output;

	var date;
	var id;
	var reg;

	if ('schedule' === params.func) {
		if ('list' === params.sub && '1' === params.effect) {
			date = params.date;
			if (date) {
				id = '#DA_schedule_list_subtitle_' + date;
				if ($(id).attr("id")) {
					$(id).animate({
						opacity: 1
					}, 1000);
					// $(id).slideDown('slow');
				}

				id = '#DA_schedule_list_' + date + '_nodata_info';
				if ($(id).attr("id")) {
					$(id).animate({
						opacity: 1
					}, 1000);
					// $(id).slideDown('slow');
				}

				var key = "schedule_list_"+date;
				var reg = new RegExp(key);

				$('li').each( function (idx, o) {
					var id = $(o).attr("id");
					if (id.match(reg)) {
						$(o).animate({
							opacity: 1
						}, 1000);
						// $(o).slideDown('slow');
						// $(o).show("drop",{direction: "up", queue:true}, 1000);
						// $(o).animate({height:'44px'}, 'slow', 'linear');
						// return false;
					}
				});
			}
		}
	}
});


DA.customEvent.set("window.onload", function() {

	var d_str = (DA.vars.calendarDayStr) ? DA.vars.calendarDayStr : {};
	var m_str = (DA.vars.calendarMonthStr) ? DA.vars.calendarMonthStr : {};
	var lang = DA.vars.userLang;

	jQuery('#DAscheduleNewStartDateId').datepicker({
		showButtonPanel: true,
		firstDay: DA.vars.calendarFirstDay,
		nextText: "",
		prevText: "",
		closeText: "",
		showOtherMonths: true,
		selectOtherMonths: true,
		dateFormat: 'yy/mm/dd',
		monthNames: [
			m_str[1], m_str[2], m_str[3], m_str[4], m_str[5], m_str[6], 
			m_str[7], m_str[8], m_str[9], m_str[10], m_str[11], m_str[12]
		],
		showMonthAfterYear: ('ja'===lang || ''===lang) ? true : false,
		dayNamesMin: [d_str.sun, d_str.mon, d_str.tue, d_str.wed, d_str.thu, d_str.fri, d_str.sat],
		showOn: 'focus',
		// buttonImage: DA.vars.imgRdir + "/mo_ico_subwin_arrow.png",
		showAnim: 'slideDown',
		beforeShow: function () {
			jQuery("#DAscheduleNewStartDateId").css({
				visibility   : 'hidden'
			});
		},
		onClose: function () {
			jQuery("#DAscheduleNewStartDateId").css({
					top       : top + "px",
					left      : "0px",
					minHeight : "0px"
			});
			jQuery("#DAscheduleNewStartDateId").css({
				visibility   : 'visible'
			});
		},
	});
	jQuery(function($){
		jQuery('#DAscheduleNewStartDateId').focus( function(ev) {

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
		});
		// $('#DAscheduleNewStartDateId').css('width','85%');
	});

	jQuery('#DAscheduleNewEndDateId').datepicker({
		showButtonPanel: true,
		firstDay: DA.vars.calendarFirstDay,
		nextText: "",
		prevText: "",
		closeText: "",
		showOtherMonths: true,
		selectOtherMonths: true,
		dateFormat: 'yy/mm/dd',
		monthNames: [
			m_str[1], m_str[2], m_str[3], m_str[4], m_str[5], m_str[6], 
			m_str[7], m_str[8], m_str[9], m_str[10], m_str[11], m_str[12]
		],
		showMonthAfterYear: ('ja'===lang || ''===lang) ? true : false,
		dayNamesMin: [d_str.sun, d_str.mon, d_str.tue, d_str.wed, d_str.thu, d_str.fri, d_str.sat],
		showOn: 'focus',
		// buttonImage: DA.vars.imgRdir + "/mo_ico_subwin_arrow.png",
		showAnim: 'slideDown',
		beforeShow: function () {
			jQuery("#DAscheduleNewEndDateId").css({
				visibility   : 'hidden'
			});
			DA.navigationController.hiddenFooter();
		},
		onClose: function () {
			jQuery("#DAscheduleNewEndDateId").css({
				visibility   : 'visible'
			});
			DA.navigationController.showFooter();
		},
	});
	jQuery(function($){
		jQuery('#DAscheduleNewEndDateId').focus( function(ev) {

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
		});
		// $('#DAscheduleNewEndDateId').css('width','85%');
	});
});


