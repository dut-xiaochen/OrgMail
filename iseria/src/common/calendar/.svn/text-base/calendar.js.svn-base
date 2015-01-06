/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/
/*jslint evil: true */
/*for JSLINT undef checks*/
/*extern $ DA Element Prototype */

if (!DA) {
    throw "ERROR: missing DA.js or DA-min.js";
}
if (!DA.cal) {
    DA.cal = {};
}

/*******************************************************************************/
/* カレンダー表示                                                              */
/*******************************************************************************/
/*
 * カレンダーを表示する初期情報を設定します。
 * 画面に描かれたカレンダーの特定の日付を選択した場合でも、オブジェクトがその情報を保持しているためいつでも取り出すことができます。
 *
 * ARG1...自分自身の名前
 * ARG2...呼び出したい関数名
 * ARG3...モード（真偽）
 * ARG4...別窓のHTMLヘッダ
 * ARG5...別窓のHTMLフッタ
 *
 * RET....オブジェクト
 *
 * 補足:オブジェクト初期化直後は、”当日”に設定されています。
 *
 *     「自分自身の名前」は変数に格納された値ではなく、変数の名前そのものです。
 *     または、自身のオブジェクトを使用している document の正確な位置をあらわす名称です。
 *
 *     「モード」は2種類あり、それによりカレンダーの操作環境が少し変化します。
 *     TRUEの場合は前月、翌月に移動するリンクが表示されなくなる等です。値を省略した場合は TRUE が適用されます。
 *
 *         TRUE...自画面にカレンダーを描画することを明示
 *         FALSE..別窓や、別フレームのような自画面以外にカレンダーを描画することを明示
 *
 *     「別窓のHTMLヘッダ、フッタ」は、「モード」が FALSE の場合にのみ有効です。そうでない場合、値は無視されます。
 *
 *     「呼び出したい関数名」は、カレンダー上の日付リンクがクリックされた場合に呼び出したい自前の関数の名前を設定します。
 *     この拡張機能により、カレンダーの高度な組み込みを可能にします。
 *
 *     例>
 *         //自前の関数を呼んだ後に自分を閉じる
 *         var objCal = new Cal(o, "fncSetDate();self.close();", true, head, foot);
 *         function fncSetDate() {
 *         //親ウインドウの入力領域に選択値を表示
 *             ..
 *         }
 */
DA.cal.Calendar = function(_calid, _name, config, cbh) {
    if (config.yearList) {
        this.yearList = [];
        Object.extend(this.yearList, config.yearList);
    }
    if (config.holidayList) {
        this.holidayList = {};
        Object.extend(this.holidayList, config.holidayList);
    }
    if (config.customDayColorList) {
        this.customDayColorList = {};
        Object.extend(this.customDayColorList, config.customDayColorList);
    }
    if (config.minYear) {
        this.minYear = config.minYear;
    }
    if (config.maxYear) {
        this.maxYear = config.maxYear;
    }
    if (config.imgRdir) {
        this.imgRdir = config.imgRdir;
    }
    if (config.firstDay) {
        this.firstDay = config.firstDay;
    }
    if (config.lang) {
        this.lang = config.lang;
    }
    if (this.lang !== 'ja') {
        this.lang = 'en';
    }
    
    var i, j;
    this.weekBGImgs = [];
    this.messageResources = {
        en: {
            PrevMonth: 'Prev',
            NextMonth: 'Next'
        },
        ja: {
            PrevMonth: '先月',
            NextMonth: '翌月'
        }
    };
    for (i = 0; i < 7; i ++) {
        j = this.getDayNumber(i);
        switch(i) {
            case 0:
                this.weekBGImgs[j] = 'cal_day_sun_bg.gif';
                this.messageResources.en['week' + j] = 'Su';
                this.messageResources.ja['week' + j] = '日';
                break;
            case 1:
                this.weekBGImgs[j] = '';
                this.messageResources.en['week' + j] = 'Mo';
                this.messageResources.ja['week' + j] = '月';
                break;
            case 2:
                this.weekBGImgs[j] = '';
                this.messageResources.en['week' + j] = 'Tu';
                this.messageResources.ja['week' + j] = '火';
                break;
            case 3:
                this.weekBGImgs[j] = '';
                this.messageResources.en['week' + j] = 'We';
                this.messageResources.ja['week' + j] = '水';
                break;
            case 4:
                this.weekBGImgs[j] = '';
                this.messageResources.en['week' + j] = 'Th';
                this.messageResources.ja['week' + j] = '木';
                break;
            case 5:
                this.weekBGImgs[j] = '';
                this.messageResources.en['week' + j] = 'Fr';
                this.messageResources.ja['week' + j] = '金';
                break;
            case 6:
                this.weekBGImgs[j] = 'cal_day_sat_bg.gif';
                this.messageResources.en['week' + j] = 'Sa';
                this.messageResources.ja['week' + j] = '土';
                break;
            default:
                this.weekBGImgs[j] = '';
                this.messageResources.en['week' + j] = '';
                this.messageResources.ja['week' + j] = '';
        }
    }
    
    this.calLocalResource = this.messageResources[this.lang];

    this.calid = _calid;	// カレンダーID
    this.name = _name;		// カレンダーオブジェクト名
    this.prefix = config.prefix;

    this.colorHeader = "LIGHTBLUE";//ヘッダの色
    this.colorBackground = "ALICEBLUE";		//背景の色
    this.colorSunday = "LIGHTSTEELBLUE";	//土曜日の色
    this.colorSaturday = "PINK";	//日曜日の色
    this.colorToday = "GOLD";		//本日の色

    this.monthOfDays = 0;			//表示するカレンダーの月末日（全日数）
    this.viewYear = 0;				//表示されている年
    this.viewMonth = 0;				//表示されている月
    this.startDay = 0;

    //初期値は当日
    this.initCal(DA.cal.Calendar.thisYear, DA.cal.Calendar.thisMonth + 1, DA.cal.Calendar.thisDay);
    this.nowYear = DA.cal.Calendar.thisYear;		//設定した年：カレンダー上の日付をクリックした場合の値
    this.nowMonth = DA.cal.Calendar.thisMonth + 1;	//設定した月 - 1：カレンダー上の日付をクリックした場合の値
    this.nowDay = DA.cal.Calendar.thisDay;			//設定した日：カレンダー上の日付をクリックした場合の値

    // ２表示カレンダー
    this.viewYear1 = 0;
    this.viewYear2 = 0;
    this.viewMonth1 = 0;
    this.viewMonth2 = 0;
    this.startDay1 = 0;
    this.startDay2 = 0;
    this.monthOfDays1 = 0;
    this.monthOfDays2 = 0;
    this.initCal2(DA.cal.Calendar.thisYear, DA.cal.Calendar.thisMonth + 1, DA.cal.Calendar.thisDay);
    // 日付リンクの設定
    if( typeof(config.linkFunc) === 'undefined' ){
        this.linkFunc = "DA.cal.Calendar.fncSet(" + this.name + ",\'" + this.calid + "\', \'"+ this.prefix.year +"\',  \'"+ this.prefix.month +"\', \'"+ this.prefix.day +"\')";
    }else{
        this.linkFunc = config.linkFunc;
    }
    if( cbh ) {
        if ( cbh.onSet ){
            this.onSet = cbh.onSet;
        }
        if ( cbh.onEnable ) {
            this.onEnable = cbh.onEnable;
        }
        if ( cbh.onDisable ) {
            this.onDisable = cbh.onDisable;
        }
    }
    
    return this;
};

DA.cal.Calendar.prototype = {

    /*
     * リソース
     */
    
    // フォント指定
    fontfacename: "Arial",
    
    yearList: null,
    
    holidayList: null,
    
    customDayColorList: null,
    
    imgRdir: DA.vars.imgRdir,
    
    firstDay: 0,
    
    lang: 'ja',
    
    // 月データ
    monthDay: [31,28,31,30,31,30,31,31,30,31,30,31],
    
    // 月イメージ
    monthImgs: [
        'cal_mt_1.gif',
        'cal_mt_2.gif',
        'cal_mt_3.gif',
        'cal_mt_4.gif',
        'cal_mt_5.gif',
        'cal_mt_6.gif',
        'cal_mt_7.gif',
        'cal_mt_8.gif',
        'cal_mt_9.gif',
        'cal_mt_10.gif',
        'cal_mt_11.gif',
        'cal_mt_12.gif'
    ],
    
    // 月文字列
    monthTexts: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ],
    
    // メッセージ格納用オブジェクト
    messageResources: null,
    
    // 曜日背景イメージ
    weekBGImgs: null,
    
    calLocalResource: null,
    
    disabled: false,
    
    onSet: Prototype.emptyFunction,
    
    onEnable: Prototype.emptyFunction,
    
    onDisable: Prototype.emptyFunction,

    /*
     * 日付が今日かどうかを返す
     * yyyy	年
     * mm	月（0-11）
     * dd	日
     * 戻り値　true：今日　false：今日じゃない
    */
    isToday: function(yyyy, mm, dd) {
        return ( DA.cal.Calendar.thisYear === yyyy && DA.cal.Calendar.thisMonth === mm && DA.cal.Calendar.thisDay === dd ) ? true : false;
    },

    /*
     * 日付の文字色を返す
     * index	曜日インデックス
     * 戻り値　文字列'#xxxxxx'
     */
    getDayColor: function(index) {
        var color = 'color="#000000"';
        if( (index % 7) === this.getDayNumber(0) ){
            color = 'color="#993300"';
        }else if( (index % 7) === this.getDayNumber(6) ){
            color = 'color="#665599"';
        }
        return color;
    },

    /*
     * 日付の背景を返す
     * yyyy	年
     * mm	月（0-11）
     * dd	日
     * index	曜日インデックス
     * 戻り値　文字列'background="' + this.imgRdir + '/xxxx.gif"'
     */
    getDayBackGround: function(yyyy, mm, dd, index) {
        if( this.isToday(yyyy, mm, dd) === true ){
            return 'background="' + this.imgRdir + '/cal_mark_today_bg.gif" bgcolor="#FFFFFF"';
        }
        return 'bgcolor="#FFFFFF"';
    },

    /*
     * 曜日のフォントスタイルを返す
     */
    getWeekFontStyle: function() {
        var style='color="#FFFFFF"';
        if(this.lang === 'ja'){
            style += ' class="normal"';
        }else{
            style += ' class="tiny" face="' + this.fontfacename + '"';
        }
        return style;
    },
    
    getDayNumber: function(day) {
        if (day - this.firstDay < 0) {
            day = day + (7 - this.firstDay);
        } else {
            day = day - this.firstDay;
        }
        return day;
    },

    getSelectableYearMin: function () {
        var yearSelector = $(this.prefix.year);
        var minYear, i, y;
        
        if (this.minYear) {
            return this.minYear;
        } else if (yearSelector === null || typeof(yearSelector) === 'undefined') {
            return 0;
        } else {
            minYear = 9999;
            if ( this.yearList === null ) {
                for (i = 0; i < yearSelector.length; i++) {
                    y = parseInt(yearSelector.options[i].value, 10);
                    if (y > 0 && minYear > y) {
                        minYear = y;
                    }
                }
            } else {
                for (i = 0; i < this.yearList.length; i++) {
                    y = parseInt(this.yearList[i], 10);
                    if (y > 0 && minYear > y) {
                        minYear = y;
                    }
                }
            }
            return minYear;
        }
    },

    getSelectableYearMax: function () {
        var yearSelector = $(this.prefix.year);
        var maxYear, i, y;
        if (this.maxYear) {
            return this.maxYear;
        } else if (yearSelector === null || typeof(yearSelector) === 'undefined') {
            return 0;
        } else {
            maxYear = 0;
            if ( this.yearList === null ) {
                for (i = 0; i < yearSelector.length; i++) {
                    y = parseInt(yearSelector.options[i].value, 10);
                    if (y > 0 && maxYear < y) {
                        maxYear = y;
                    }
                }
            } else {
                for (i = 0; i < this.yearList.length; i++) {
                    y = parseInt(this.yearList[i], 10);
                    if (y > 0 && maxYear < y) {
                        maxYear = y;
                    }
                }
            }
            return maxYear;
        }
    },

    prevCal: function () {
        this.setPrevCal();
        this.writeCal();
    },

    prevCal2: function () {
        this.setPrevCal2();
        this.writeCal2();
    },

    nextCal: function () {
        this.setNextCal();
        this.writeCal();
    },

    nextCal2: function () {
        this.setNextCal2();
        this.writeCal2();
    },

    getYear: function(_year) {
        //年変換（1901-2099）
        var num;
        if ((typeof(_year) === 'undefined') || (_year < 1901) || (_year > 2099)) {
            return DA.cal.Calendar.thisYear;
        } else {
            // num = new Number(_year);
            // if( isNaN(num) ) {
            if( isNaN(_year) ) {
                return DA.cal.Calendar.thisYear;
            }
            return _year;
        }
    },

    getMonth: function(_month) {
        //月変換（0-11）
        var num;
        if ((typeof(_month) === 'undefined') || (_month < 1) || (_month > 12)) {
            return DA.cal.Calendar.thisMonth;
        } else {
            // num =  Number(_month);
            // if( isNaN(num) ) {
            if( isNaN(_month) ) {
                return DA.cal.Calendar.thisMonth;
            }
            return _month - 1;
        }
    },

    /*
     * 月の日数を返す
     * yyyy	年
     * mm	月（0-11）
     */
    getMonthOfDays: function(yyyy, mm) {
        //うるう年変換（1901年から2099年まで対応）
        if ((mm === 1) && (yyyy % 4 === 0)) {
            return 29;
        } else {
            return this.monthDay[mm];
        }
    },

    /*
     * yyyy	年
     * mm	月（0-11）
     */
    getNextMonthYear: function(yyyy, mm) {
        var yyyy2 = yyyy;
        if (mm >= 11) {
            yyyy2++;
        }
        return yyyy2;
    },

    /*
     * mm	月（0-11）
     */
    getNextMonth: function(mm) {
        var mm2 = mm + 1;
        if( mm2 > 11 ){
            mm2 = 0;
        }
        return mm2;
    },
    
    /*
     * 前月のカレンダーを描画するための設定を行います。
     * カレンダーを描画するには writeCalメソッド を呼び出してください。
     */
    setPrevCal: function () {
        var yyyy = this.viewYear;
        var mm = this.viewMonth;

        if (mm < 1) {
            yyyy--;
            mm = 11;
        }
        this.initCal(yyyy, mm);
    },
    
    setPrevCal2: function () {
        var yyyy = this.viewYear1;
        var mm = this.viewMonth1;

        if (mm < 1) {
            yyyy--;
            mm = 11;
        }
        this.initCal2(yyyy, mm);
    },

    /*
     * 翌月のカレンダーを描画するための設定を行います。
     * カレンダーを描画するには writeCalメソッド を呼び出してください。
     */
    setNextCal: function () {
        var yyyy = this.viewYear;
        var mm = this.viewMonth + 2;

        if (mm > 12) {
            yyyy++;
            mm = 1;
        }
        this.initCal(yyyy, mm);
    },
    
    setNextCal2: function () {
        var yyyy = this.viewYear1;
        var mm = this.viewMonth1 + 2;

        if (mm > 12) {
            yyyy++;
            mm = 1;
        }
        this.initCal2(yyyy, mm);
    },

    /*
     * カレンダーの特定の日付を選択します。
     * カレンダーを描画するには writeCalメソッド を呼び出してください。
     * yyyy	設定年
     * mm	設定月（0-11）
     * dd	設定日
     */
    choiceCal: function (yy, mm, dd) {
        this.nowYear = yy;
        this.nowMonth = mm;
        this.nowDay = dd;
    },

    /*
     * カレンダーを初期表示するための情報を設定します。
     * カレンダーを表示する年月であって、選択したい年月ではありません。
     *
     * ARG1...西暦
     * ARG2...月（1-12）
     *
     * RET....なし
     *
     * 補足:カレンダーを描画するには writeCalメソッド を呼び出してください。
     */
    initCal: function (_year, _month) {
        //年変換
        this.viewYear = this.getYear(_year);

        var yearMin = this.getSelectableYearMin();
        if (yearMin > 0) {
            if (this.viewYear < yearMin) {
                this.viewYear = yearMin;
            }
        }
        var yearMax = this.getSelectableYearMax();
        if (yearMax > 0) {
            if (this.viewYear > yearMax) {
                this.viewYear = yearMax;
            }
        }

        //月変換
        this.viewMonth = this.getMonth(_month);

        //うるう年変換
        this.monthOfDays = this.getMonthOfDays(this.viewYear, this.viewMonth);

        //開始曜日の設定
        var d1 = new Date(this.viewYear + '/' + (this.viewMonth + 1) + '/01');
        this.startDay = this.getDayNumber(d1.getDay());
    },
    
    initCal2: function (yyyy, mm) {

        // 一つ目のカレンダー
        this.viewYear1 = this.getYear(yyyy);
        this.viewMonth1 = this.getMonth(mm);
        this.monthOfDays1 = this.getMonthOfDays(this.viewYear1, this.viewMonth1);

        //開始曜日の設定
        var d1 = new Date(this.viewYear1 + '/' + (this.viewMonth1 + 1) + '/01');
        this.startDay1 = this.getDayNumber(d1.getDay());
        
        var yearMin = this.getSelectableYearMin();
        if (yearMin > 0) {
            if (this.viewYear1 < yearMin) {
                this.viewYear1 = yearMin;
            }
        }
        var yearMax = this.getSelectableYearMax();
        if (yearMax > 0) {
            if (this.viewYear1 > yearMax) {
                this.viewYear1 = yearMax;
            }
        }

        // 二つ目のカレンダー
        this.viewYear2 = this.getNextMonthYear(this.viewYear1, this.viewMonth1);
        this.viewMonth2 = this.getNextMonth(this.viewMonth1);
        this.monthOfDays2 = this.getMonthOfDays(this.viewYear2, this.viewMonth2);

        //開始曜日の設定
        var d2 = new Date(this.viewYear2 + '/' + (this.viewMonth2 + 1) + '/01');
        this.startDay2 = this.getDayNumber(d2.getDay());

    },

    /*
     * カレンダーを描画します。
     * 戻り値	HTML
     */
    writeCal: function (stl, spn, spi) {
        var i, j;
        var sb = [];

        // カレンダー描画（INSUITE風）

        // ヘッダー枠
        sb = ['<table border="0" cellspacing="0" cellpadding="0" background="', this.imgRdir, '/null.gif" bgcolor="#FFFFFF">', '<tr class="Calendar">', '<td><img src="', this.imgRdir, '/null.gif" width="3" height="1"></td>'];
        for( i=0; i<7; i++ ){
            sb.push('<td><img src="', this.imgRdir, '/null.gif" width="15" height="1"></td>');
        }
        sb.push('<td><img src="', this.imgRdir, '/null.gif" width="3" height="1"></td>');
        sb.push('</tr>');

        // ヘッダー（操作ボタン＆月イメージ）
        var prevlnk = '';
        var yyyy = this.viewYear;
        if (this.viewMonth < 1) {
            yyyy--;
        }
        if (yyyy >= this.getSelectableYearMin()) {
            // prevlnk = '"javascript:' + this.name + '.prevCal()"';
            prevlnk = this.name + '.prevCal()';
        }
        
        var nextlnk = '';
        yyyy = this.viewYear;
        if (this.viewMonth >= 11) {
            yyyy++;
        }
        if (yyyy <= this.getSelectableYearMax()) {
            // nextlnk = '"javascript:' + this.name + '.nextCal()"';
            nextlnk = this.name + '.nextCal()';
        }

        sb.push('<tr class="Calendar"><td><img src="', this.imgRdir, '/cal_waku_tl.gif" width="3" height="25"></td>');
        sb.push('<td background="', this.imgRdir, '/cal_waku_t_bg.gif" valign="bottom">');
        if (prevlnk !== '') {
            // sb.push('<a href=' + prevlnk + '>';
            sb.push('<a href="#" onClick="', prevlnk, '">');
            sb.push('<img src="', this.imgRdir, '/cal_back.gif" width="15" height="12" border="0" alt="', this.calLocalResource.PrevMonth, '" title="', this.calLocalResource.PrevMonth, '">');
            sb.push('</a>');
        }
        sb.push('<br><img src="', this.imgRdir, '/null.gif" width="1" height="4"></td>');
        sb.push('<td colspan="5" align="center" valign="bottom" background="', this.imgRdir, '/cal_waku_t_bg.gif"><img src="', this.imgRdir, '/');
        sb.push(this.monthImgs[this.viewMonth]);
        sb.push('" width="20" height="20"></td>');
        sb.push('<td background="', this.imgRdir, '/cal_waku_t_bg.gif" valign="bottom">');
        if (nextlnk !== '') {
            // sb.push('<a href=' + nextlnk + '>';
            sb.push('<a href="#" onClick="', nextlnk, '">');
            sb.push('<img src="', this.imgRdir, '/cal_next.gif" width="15" height="12" border="0" alt="', this.calLocalResource.NextMonth, '" title="', this.calLocalResource.NextMonth, '">');
            sb.push('</a>');
        }
        sb.push('<br><img src="', this.imgRdir, '/null.gif" width="1" height="4"></td>');
        sb.push('<td><img src="', this.imgRdir, '/cal_waku_tr.gif" width="3" height="25"></td>');
        sb.push('</tr>');

        // ヘッダー（年月文字表示）
        sb.push('<tr class="Calendar"><td background="', this.imgRdir, '/cal_waku_l_bg.gif"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('<td colspan="7" align="center"><font color="#000000" face="', this.fontfacename, '" class="small">');
        sb.push(this.viewYear, ' ', this.monthTexts[this.viewMonth]);
        sb.push('</font></td>');
        sb.push('<td rowspan="10" valign="bottom" background="', this.imgRdir, '/cal_waku_r_bg.gif"><img src="', this.imgRdir, '/cal_pagecarl_r.gif" width="3" height="10"></td>');
        sb.push('</tr>');
        sb.push('<tr class="Calendar"> ');
        sb.push('<td colspan="8" bgcolor="#666666"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('</tr>');

        // 曜日
        sb.push('<tr class="Calendar">');
        sb.push('<td><img src="', this.imgRdir, '/cal_waku_obi_l.gif" width="3" height="19"></td>');
        for( j=0; j<7; j++ ){
            if( this.weekBGImgs[j] !== '' ){
                sb.push('<td align="center" background="', this.imgRdir, '/');
                sb.push(this.weekBGImgs[j]);
                sb.push('">');
            }else{
                sb.push('<td align="center" bgcolor="#999999">');
            }
            sb.push('<font ', this.getWeekFontStyle(), '>', this.calLocalResource['week'+j], '</font></td>');
        }
        sb.push('</tr>');

        sb.push('<tr class="Calendar"><td colspan="8" bgcolor="#666666"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('</tr>');

        // 日付表示
        var day = 1;
        var daylnk;
        for( i=0; i<6; i++ ){
            if( i===0 ){
                sb.push('<tr class="Calendar"><td rowspan="6" background="', this.imgRdir, '/cal_waku_l_bg.gif"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
            }else{
                sb.push('<tr class="Calendar">');
            }
            for( j=0; j<7; j++ ){
                if( i===5 && j===6 ){
                    sb.push('<td align="right" valign="bottom"><img src="', this.imgRdir, '/cal_pagecarl.gif" width="12" height="10"></td>');
                }else if( (i===0 && j<this.startDay) || day > this.monthOfDays ){
                    sb.push('<td align="center"  bgcolor="#FFFFFF">&nbsp;</td>');
                }else{
                    // daylnk = '<a href="javascript:' + this.name + '.choiceCal(' + this.viewYear + ',' + this.viewMonth + ',' + day + ');' + this.linkFunc + '">' + '<font ' + this.getDayColor(j) + ' face="' + this.fontfacename + '" class="small">' + day + '</font></a>';
                    if( this.holidayList && this.holidayList[this.viewYear] && this.holidayList[this.viewYear][this.viewMonth+1] && this.holidayList[this.viewYear][this.viewMonth+1][day] === 1) {
                        daylnk = ['<a href="#" onClick="', this.name, '.choiceCal(', this.viewYear, ',', this.viewMonth, ',', day, ');', this.linkFunc, '">', '<font ', this.getDayColor(0), ' face="', this.fontfacename, '" class="small">', day, '</font></a>'].join('');
                    } else if(this.customDayColorList && this.customDayColorList[this.viewYear] && this.customDayColorList[this.viewYear][this.viewMonth+1] && this.customDayColorList[this.viewYear][this.viewMonth+1][day]){
                    	daylnk = ['<a href="#" onClick="', this.name, '.choiceCal(', this.viewYear, ',', this.viewMonth, ',', day, ');', this.linkFunc, '">', '<font color="', this.customDayColorList[this.viewYear][this.viewMonth+1][day], '" face="', this.fontfacename, '" class="small">', day, '</font></a>'].join('');
                    } else {
                        daylnk = ['<a href="#" onClick="', this.name, '.choiceCal(', this.viewYear, ',', this.viewMonth, ',', day, ');', this.linkFunc, '">', '<font ', this.getDayColor(j), ' face="', this.fontfacename, '" class="small">', day, '</font></a>'].join('');
                    }
                    sb.push('<td align="center" ', this.getDayBackGround(this.viewYear, this.viewMonth, day, j), '>', daylnk, '</td>');
                    day++;
                }

            }
            sb.push('</tr>');
        }
        sb.push('<tr class="Calendar"><td><img src="', this.imgRdir, '/cal_waku_bl.gif" width="3" height="6"></td>');
        sb.push('    <td colspan="7" align="right" background="', this.imgRdir, '/cal_waku_b_bg.gif"><img src="', this.imgRdir, '/null.gif" width="1" height="1"><img src="', this.imgRdir, '/cal_pagecarl_b.gif" width="12" height="6"></td>');
        sb.push('    <td><img src="', this.imgRdir, '/cal_waku_br.gif" width="3" height="6"></td>');
        sb.push('</tr>');

        sb.push('</table>');

        // 表示
        var cal = document.getElementById(this.calid);
        var str = sb.join('');
		if(cal){
//alert(str);
            cal.innerHTML=str;
        }

        return str;
    },

    writeCal2: function (stl, spn, spi) {
        var i, j;
        var sb = [];

        // カレンダー描画

        // ヘッダー枠
        sb = ['<table border="0" cellspacing="0" cellpadding="0" background="', this.imgRdir, '/null.gif" bgcolor="#FFFFFF">', '<tr class="Calendar">', '<td><img src="', this.imgRdir, '/null.gif" width="3" height="1"></td>'];
        for( i=0; i<7; i++ ){
            sb.push('<td><img src="', this.imgRdir, '/null.gif" width="15" height="1"></td>');
        }
        sb.push('<td><img src="', this.imgRdir, '/null.gif" width="3" height="1"></td>');
        for( i=0; i<7; i++ ){
            sb.push('<td><img src="', this.imgRdir, '/null.gif" width="15" height="1"></td>');
        }
        sb.push('<td><img src="', this.imgRdir, '/null.gif" width="3" height="1"></td>');
        sb.push('</tr>');

        // ヘッダー（操作ボタン＆月イメージ）
        var prevlnk = '';
        var yyyy = this.viewYear1;
        if (this.viewMonth1 < 1) {
            yyyy--;
        }
        if (yyyy >= this.getSelectableYearMin()) {
            // prevlnk = '"javascript:' + this.name + '.prevCal2()"';
            prevlnk = this.name + '.prevCal2()';
        }
        
        var nextlnk = '';
        yyyy = this.viewYear2;
        if (this.viewMonth2 >= 11) {
            yyyy++;
        }
        if (yyyy <= this.getSelectableYearMax()) {
            // nextlnk = '"javascript:' + this.name + '.nextCal2()"';
            nextlnk = this.name + '.nextCal2()';
        }

        sb.push('<tr class="Calendar"><td><img src="', this.imgRdir, '/cal_waku_tl.gif" width="3" height="25"></td>');
        sb.push('<td background="', this.imgRdir, '/cal_waku_t_bg.gif" valign="bottom">');
        if (prevlnk !== '') {
            // sb.push('<a href=' + prevlnk + '>';
            sb.push('<a href="#" onClick="', prevlnk, '">');
            sb.push('<img src="', this.imgRdir, '/cal_back.gif" width="15" height="12" border="0" alt="', this.calLocalResource.PrevMonth, '" title="', this.calLocalResource.PrevMonth, '">');
            sb.push('</a>');
        }
        sb.push('<br><img src="', this.imgRdir, '/null.gif" width="1" height="4"></td>');
        sb.push('<td colspan="5" align="center" valign="bottom" background="', this.imgRdir, '/cal_waku_t_bg.gif"><img src="', this.imgRdir, '/');
        sb.push(this.monthImgs[this.viewMonth1]);
        sb.push('" width="20" height="20"></td>');
        sb.push('<td background="', this.imgRdir, '/cal_waku_t_bg.gif"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('<td><img src="', this.imgRdir, '/cal_waku_tl.gif" width="3" height="25"></td>');
        sb.push('<td background="', this.imgRdir, '/cal_waku_t_bg.gif"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('<td colspan="5" align="center" valign="bottom" background="', this.imgRdir, '/cal_waku_t_bg.gif"><img src="', this.imgRdir, '/');
        sb.push(this.monthImgs[this.viewMonth2]);
        sb.push('" width="20" height="20"></td>');
        sb.push('<td background="', this.imgRdir, '/cal_waku_t_bg.gif" valign="bottom">');
        if (nextlnk !== '') {
            // sb.push('<a href=' + nextlnk + '>';
            sb.push('<a href="#" onClick="', nextlnk, '">');
            sb.push('<img src="', this.imgRdir, '/cal_next.gif" width="15" height="12" border="0" alt="', this.calLocalResource.NextMonth, '" title="', this.calLocalResource.NextMonth, '">');
            sb.push('</a>');
        }
        sb.push('<br><img src="', this.imgRdir, '/null.gif" width="1" height="4"></td>');
        sb.push('<td><img src="', this.imgRdir, '/cal_waku_tr.gif" width="3" height="25"></td>');
        sb.push('</tr>');

        // ヘッダー（年月文字表示）
        sb.push('<tr class="Calendar"><td background="', this.imgRdir, '/cal_waku_l_bg.gif"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('<td colspan="7" align="center"><font color="#000000" face="', this.fontfacename, '" class="small">');
        sb.push(this.viewYear1, ' ', this.monthTexts[this.viewMonth1]);
        sb.push('</font></td>');
        sb.push('<td background="', this.imgRdir, '/cal_waku_l_bg.gif"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('<td colspan="7" align="center"><font color="#000000" face="', this.fontfacename, '" class="small">');
        sb.push(this.viewYear2, ' ', this.monthTexts[this.viewMonth2]);
        sb.push('</font></td>');
        sb.push('<td rowspan="10" valign="bottom" background="', this.imgRdir, '/cal_waku_r_bg.gif"><img src="', this.imgRdir, '/cal_pagecarl_r.gif" width="3" height="10"></td>');
        sb.push('</tr>');
        sb.push('<tr class="Calendar"> ');
        sb.push('<td colspan="8" bgcolor="#666666"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('<td colspan="8" bgcolor="#666666"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('</tr>');

        // 曜日
        sb.push('<tr class="Calendar">');
        for( i=0; i<2; i++ ){
            sb.push('    <td><img src="', this.imgRdir, '/cal_waku_obi_l.gif" width="3" height="19"></td>');
            for( j=0; j<7; j++ ){
                if( this.weekBGImgs[j] !== '' ){
                    sb.push('<td align="center" background="', this.imgRdir, '/');
                    sb.push(this.weekBGImgs[j]);
                    sb.push('">');
                }else{
                    sb.push('<td align="center" bgcolor="#999999">');
                }
                sb.push('<font ', this.getWeekFontStyle(), '>', this.calLocalResource['week'+j], '</font></td>');
            }
        }
        sb.push('</tr>');

        sb.push('<tr class="Calendar"><td colspan="8" bgcolor="#666666"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('    <td colspan="8" bgcolor="#666666"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('</tr>');

        // 日付表示
        var day1 = 1;
        var day2 = 1;
        var daylnk;

        for( i=0; i<6; i++ ){
            if( i===0 ){
                sb.push('<tr class="Calendar"><td rowspan="6" background="', this.imgRdir, '/cal_waku_l_bg.gif"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
            }else{
                sb.push('<tr class="Calendar">');
            }
            for( j=0; j<7; j++ ){
                if( (i===0 && j<this.startDay1) || day1 > this.monthOfDays1 ){
                    sb.push('<td align="center"  bgcolor="#FFFFFF">&nbsp;</td>');
                }else{
                    // daylnk = '<a href="javascript:' + this.name + '.choiceCal(' + this.viewYear1 + ',' + this.viewMonth1 + ',' + day1 + ');' + this.linkFunc + '">' + '<font ' + this.getDayColor(j) + ' face="' + this.fontfacename + '" class="small">' + day1 + '</font></a>';
                    if( this.holidayList && this.holidayList[this.viewYear1] && this.holidayList[this.viewYear1][this.viewMonth1+1] && this.holidayList[this.viewYear1][this.viewMonth1+1][day1] === 1) {
                        daylnk = ['<a href="#" onClick="', this.name, '.choiceCal(', this.viewYear1, ',', this.viewMonth1, ',', day1, ');', this.linkFunc, '">', '<font ', this.getDayColor(this.getDayNumber(0)), ' face="', this.fontfacename, '" class="small">', day1, '</font></a>'].join('');
                    }else if(this.customDayColorList && this.customDayColorList[this.viewYear1] && this.customDayColorList[this.viewYear1][this.viewMonth1+1] && this.customDayColorList[this.viewYear1][this.viewMonth1+1][day1]){
                    	daylnk = ['<a href="#" onClick="', this.name, '.choiceCal(', this.viewYear1, ',', this.viewMonth1, ',', day1, ');', this.linkFunc, '">', '<font color="', this.customDayColorList[this.viewYear1][this.viewMonth1+1][day1], '" face="', this.fontfacename, '" class="small">', day1, '</font></a>'].join('');
                    }else{
                        daylnk = ['<a href="#" onClick="', this.name, '.choiceCal(', this.viewYear1, ',', this.viewMonth1, ',', day1, ');', this.linkFunc, '">', '<font ', this.getDayColor(j), ' face="', this.fontfacename, '" class="small">', day1, '</font></a>'].join('');
                    }
                    sb.push('<td align="center" ', this.getDayBackGround(this.viewYear1, this.viewMonth1, day1, j), '>', daylnk, '</td>');
                    day1++;
                }
            }
            if( i===0 ){
                sb.push('<td rowspan="6" background="', this.imgRdir, '/cal_waku_l_bg.gif"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
            }
            for( j=0; j<7; j++ ){
                if( i===5 && j===6 ){
                    sb.push('<td align="right" valign="bottom"><img src="', this.imgRdir, '/cal_pagecarl.gif" width="12" height="10"></td>');
                }else if( (i===0 && j<this.startDay2) || day2 > this.monthOfDays2 ){
                    sb.push('<td align="center"  bgcolor="#FFFFFF">&nbsp;</td>');
                }else{
                    // daylnk = '<a href="javascript:' + this.name + '.choiceCal(' + this.viewYear2 + ',' + this.viewMonth2 + ',' + day2 + ');' + this.linkFunc + '">' + '<font ' + this.getDayColor(j) + ' face="' + this.fontfacename + '" class="small">' + day2 + '</font></a>';
                    if( this.holidayList && this.holidayList[this.viewYear2] && this.holidayList[this.viewYear2][this.viewMonth2+1] && this.holidayList[this.viewYear2][this.viewMonth2+1][day2] === 1) {
                        daylnk = ['<a href="#" onClick="', this.name, '.choiceCal(', this.viewYear2, ',', this.viewMonth2, ',', day2, ');', this.linkFunc, '">', '<font ', this.getDayColor(this.getDayNumber(0)), ' face="', this.fontfacename, '" class="small">', day2, '</font></a>'].join('');
                    } else if(this.customDayColorList && this.customDayColorList[this.viewYear2] && this.customDayColorList[this.viewYear2][this.viewMonth2+1] && this.customDayColorList[this.viewYear2][this.viewMonth2+1][day2] ){
                    	daylnk = ['<a href="#" onClick="', this.name, '.choiceCal(', this.viewYear2, ',', this.viewMonth2, ',', day2, ');', this.linkFunc, '">', '<font color="', this.customDayColorList[this.viewYear2][this.viewMonth2+1][day2], '" face="', this.fontfacename, '" class="small">', day2, '</font></a>'].join('');
                    } else {
                        daylnk = ['<a href="#" onClick="', this.name, '.choiceCal(', this.viewYear2, ',', this.viewMonth2, ',', day2, ');', this.linkFunc, '">', '<font ', this.getDayColor(j), ' face="', this.fontfacename, '" class="small">', day2, '</font></a>'].join('');
                    }
                    sb.push('<td align="center" ', this.getDayBackGround(this.viewYear2, this.viewMonth2, day2, j), '>', daylnk, '</td>');
                    day2++;
                }
            }
            sb.push('</tr>');
        }

        sb.push('<tr class="Calendar"><td><img src="', this.imgRdir, '/cal_waku_bl.gif" width="3" height="6"></td>');
        sb.push('<td colspan="7" background="', this.imgRdir, '/cal_waku_b_bg.gif"><img src="', this.imgRdir, '/null.gif" width="1" height="1"></td>');
        sb.push('<td background="', this.imgRdir, '/cal_waku_b_bg.gif"><img src="', this.imgRdir, '/cal_waku_bl.gif" width="3" height="6"></td>');
        sb.push('<td colspan="7" align="right" background="', this.imgRdir, '/cal_waku_b_bg.gif"><img src="', this.imgRdir, '/null.gif" width="1" height="1"><img src="', this.imgRdir, '/cal_pagecarl_b.gif" width="12" height="6"></td>');
        sb.push('<td><img src="', this.imgRdir, '/cal_waku_br.gif" width="3" height="6"></td>');
        sb.push('</tr>');

        sb.push('</table>');

        // 表示
        var cal = document.getElementById(this.calid);
        var str = sb.join('');
		if(cal){
            cal.innerHTML=str;
        }

        return str;
    },
    
    enable: function() {
        if (this.disabled === true) {
            this.disabled = false;
            this.onEnable();
        }
    },
    
    disable: function() {
        if (this.disabled === false) {
            this.disabled = true;
            this.onDisable();
        }
    }
};

//===============================================================================
// 変数の設定
//===============================================================================
DA.cal.Calendar.thisToday = new Date();
DA.cal.Calendar.thisYear  = DA.cal.Calendar.thisToday.getYear();
DA.cal.Calendar.thisMonth = DA.cal.Calendar.thisToday.getMonth();
DA.cal.Calendar.thisDay   = DA.cal.Calendar.thisToday.getDate();
if (DA.cal.Calendar.thisYear < 1900) {
    DA.cal.Calendar.thisYear = DA.cal.Calendar.thisYear + 1900;
}

// 表示するカレンダーは一つだけにする。
// カレンダー表示中にカレンダー表示要求が来た場合、表示しているカレンダーを強制的に閉じる
DA.cal.Calendar.selectedCalendarId = null;

/*
 * カレンダー消去処理
 */
DA.cal.Calendar.fncClose = function(_calid) {
    var cal = document.getElementById(_calid);
    DA.cal.CalendarTool.shim.close(cal);
    cal.style.display='none';	//カレンダー消去
    DA.cal.Calendar.selectedCalendarId = null;
}
;
/*
 * カレンダー表示処理
 */
DA.cal.Calendar.fncPopup = function(_ev,_calobj, _calid, _pickerid, _year, _month, _day) {
//alert(_calobj + ":" + _year + "/" + _month + "/" + _day);

    var picker = document.getElementById(_pickerid);
    var offsetLeft = DA.cal.CalendarTool.dom.getOffsetLeft(picker);
    var offsetTop = DA.cal.CalendarTool.dom.getOffsetTop(picker) + picker.offsetHeight;

    var cal = document.getElementById(_calid);
    // すでに開いている場合は閉じる
    if(cal.style.display === 'block'){
        DA.cal.Calendar.fncClose(_calid);
        return;
    }
    // 他に開いているカレンダーがあれば強制的に閉じる
    if( DA.cal.Calendar.selectedCalendarId ){
        DA.cal.Calendar.fncClose(DA.cal.Calendar.selectedCalendarId);
    }
    DA.cal.Calendar.selectedCalendarId = _calid;

    // 指定された日付をデフォルト値にする
    // 初期値は渡された日付
    if( _calobj ){
        if (typeof(_year) === 'undefined') {
            _year = DA.cal.Calendar.thisYear;
        } else {
            _year = parseInt(_year, 10);
        }
        if (typeof(_month) === 'undefined') {
            _month = DA.cal.Calendar.thisMonth + 1;
        } else {
            _month = parseInt(_month, 10);
        }
        if (typeof(_day) === 'undefined') {
            _day = DA.cal.Calendar.thisDay;
        } else {
            _day = parseInt(_day, 10);
        }
        _calobj.initCal(_year, _month, _day);
        _calobj.writeCal();
    }
    //NN6- OP7- IE4-対応
    cal.style.display='block';
    cal.style.position='absolute';
    cal.style.left=offsetLeft+"px";
    cal.style.top=offsetTop+"px";
    DA.cal.CalendarTool.shim.open(cal);
       
    if (typeof(window.adJustParentIFrame) === 'function') {
        setTimeout('adJustParentIFrame()', 100);
    }
    
    // サーバーが遅い＆一時ファイルキャッシュを使用しない場合イメージが表示されないことがある暫定対策
    if( _calobj ){
        setTimeout(function() { _calobj.writeCal(); }, 20 ) ;
    }
       
    return false;
};

DA.cal.Calendar.fncPopup2 = function(_ev,_calobj, _calid, _pickerid, _year, _month, _day) {
//alert(_calobj + ":" + _year + "/" + _month + "/" + _day);
    var picker = document.getElementById(_pickerid);
    var offsetLeft = DA.cal.CalendarTool.dom.getOffsetLeft(picker);
    var offsetTop = DA.cal.CalendarTool.dom.getOffsetTop(picker) + picker.offsetHeight;

    var cal = document.getElementById(_calid);
    // すでに開いている場合は閉じる
    if(cal.style.display === 'block'){
        DA.cal.Calendar.fncClose(_calid);
        return;
    }
    // 他に開いているカレンダーがあれば強制的に閉じる
    if( DA.cal.Calendar.selectedCalendarId ){
        DA.cal.Calendar.fncClose(DA.cal.Calendar.selectedCalendarId);
    }
    DA.cal.Calendar.selectedCalendarId = _calid;

    // 指定された日付をデフォルト値にする
    // 初期値は渡された日付
    if( _calobj ){
        if (typeof(_year) === 'undefined') {
            _year = DA.cal.Calendar.thisYear;
        } else {
            _year = parseInt(_year, 10);
        }
        if (typeof(_month) === 'undefined') {
            _month = DA.cal.Calendar.thisMonth + 1;
        } else {
            _month = parseInt(DA.cal.CalendarTool.dateSelector.mon2num(_month), 10);
        }
        if (typeof(_day) === 'undefined') {
            _day = DA.cal.Calendar.thisDay;
        } else {
            _day = parseInt(_day, 10);
        }
        _calobj.initCal2(_year, _month, _day);
        _calobj.writeCal2();
    }
    //NN6- OP7- IE4-対応
    cal.style.display='block';
    cal.style.position='absolute';
    cal.style.left=offsetLeft+"px";
    cal.style.top=offsetTop+"px";
    DA.cal.CalendarTool.shim.open(cal);
    // サーバーが遅い＆一時ファイルキャッシュを使用しない場合イメージが表示されないことがある暫定対策
    if( _calobj ){
        setTimeout(function() { _calobj.writeCal2(); }, 20 ) ;
    }
       
    if (typeof(window.adJustParentIFrame) === 'function') {
        setTimeout('adJustParentIFrame()', 100);
    }
    
    return false;
};

/*
 * カレンダー日付選択後の処理
 */
DA.cal.Calendar.fncSet = function(_calobj, _calid, _prefix_year, _prefix_month, _prefix_day) {
    DA.cal.Calendar.fncClose(_calid);

    // カレンダー選択日付を選択リストから選択する
    var ret;

    var year = document.getElementById(_prefix_year);
    ret = DA.cal.CalendarTool.dom.setSelectedIndex(year, _calobj.nowYear);
    if (!ret) { return; }

    var month = document.getElementById(_prefix_month);
    ret = DA.cal.CalendarTool.dom.setSelectedIndex(month, _calobj.nowMonth + 1);
    if (!ret) { return; }

    var day = document.getElementById(_prefix_day);
    ret = DA.cal.CalendarTool.dom.setSelectedIndex(day, _calobj.nowDay);
    if (!ret) { return; }
    
    if (_calobj.onSet) {
        _calobj.onSet(_calobj.nowYear, _calobj.nowMonth + 1, _calobj.nowDay);
    }
};

/*
日付選択欄の選択をクリアします。
since 1.2.0
*/
DA.cal.CalendarTool = {};

DA.cal.CalendarTool.dateSelector = {
    clear: function(selectorName) {
        var year = $(selectorName.year);
        if (year) {
            year.value = -1;
        }
        var month = $(selectorName.month);
        if (month) {
            month.value = -1;
        }
        var day = $(selectorName.day);
        if (day) {
            day.value = -1;
        }
        var hour = $(selectorName.hour);
        if (hour) {
            hour.value = -1;
        }
        var min = $(selectorName.min);
        if (min) {
            min.value = -1;
        }
    },
    toggleActivity: function(selectorName, disabled) {
        var year = $(selectorName.year);
        if (year) {
            year.disabled = disabled;
        }
        var month = $(selectorName.month);
        if (month) {
            month.disabled = disabled;
        }
        var day = $(selectorName.day);
        if (day) {
            day.disabled = disabled;
        }
        var hour = $(selectorName.hour);
        if (hour) {
            hour.disabled = disabled;
        }
        var min = $(selectorName.min);
        if (min) {
            min.disabled = disabled;
        }    
        var picker = $(selectorName.picker);
        if (picker) {
            if (disabled) {
                Element.hide(picker);
                Element.hide($(selectorName.calid));
            } else {
                Element.show(picker);
            }
        }
    },
    mon2num: function(mon) {
        var mm;
        
        switch(mon + '') {
            case   '1':
            case  '01':
            case 'Jan': mm = '01'; break;
            case   '2':
            case  '02':
            case 'Feb': mm = '02'; break;
            case   '3':
            case  '03':
            case 'Mar': mm = '03'; break;
            case   '4':
            case  '04':
            case 'Apr': mm = '04'; break;
            case   '5':
            case  '05':
            case 'May': mm = '05'; break;
            case   '6':
            case  '06':
            case 'Jun': mm = '06'; break;
            case   '7':
            case  '07':
            case 'Jul': mm = '07'; break;
            case   '8':
            case  '08':
            case 'Aug': mm = '08'; break;
            case   '9':
            case  '09':
            case 'Sep': mm = '09'; break;
            case  '10':
            case 'Oct': mm = '10'; break;
            case  '11':
            case 'Nov': mm = '11'; break;
            case  '12':
            case 'Dec': mm = '12'; break;
            default: mm = '';
        }
        
        return(mm);
    },
    disable: function(selectorName) {
        this.toggleActivity(selectorName, true);
    },
    enable: function(selectorName) {
        this.toggleActivity(selectorName, false);
    }
};

DA.cal.CalendarTool.dom = {
    getOffsetLeft: function(elm) {
        var offset = elm.offsetLeft;
        var parent = elm;
        while((parent = parent.offsetParent) ){
            offset += parent.offsetLeft;
            if( parent.tagName.toLowerCase() === 'body' ){
                break;
            }
        }
        return offset;
    },
    getOffsetTop: function(elm) {
        var offset = elm.offsetTop ;
        var parent = elm;
        while((parent = parent.offsetParent) ){
            offset += parent.offsetTop;
            if( parent.tagName.toLowerCase() === 'body' ){
                break;
            }
        }
        return offset;
    },
    setSelectedIndex: function(element, value) {
        var _value = element.value;
        element.value = value;
        if (element.selectedIndex === -1) {
            element.value = _value;
            return false;
        }
        return true;
    }
};

DA.cal.CalendarTool.shim = {
    //Opens a shim, if no shim exists for the menu, one is created
    open: function(menu) {
        if (document.all === null) {
            return; // IE Only
        }
        if (menu === null) {
            return;
        }
        var shim = this._getShim(menu);
        if (shim === null) {
            shim = this._createMenuShim(menu);
        }
                
        //Change menu zIndex so shim can work with it
        menu.style.zIndex = 100;
        
        var width = menu.offsetWidth;
        var height = menu.offsetHeight;
        
        shim.style.width = width;
        shim.style.height = height;
        shim.style.top = menu.style.top;
        shim.style.left = menu.style.left;
        shim.style.zIndex = menu.style.zIndex - 1;
        shim.style.position = "absolute";
        shim.style.display = "block";
        
        var offset;
        if (shim.style.top === "" || shim.style.left === "") {
            offset = this._cumulativeOffset(menu);
            shim.style.top  = offset[1];
            shim.style.left = offset[0];
        }
    },
    
    close: function(menu) {
        if (document.all === null) {
            return; // IE Only
        }
        if (menu === null) {
            return;
        }
        var shim = this._getShim(menu);
        if (shim !== null) {
            shim.style.display = "none";
        }
    },
    
    //Creates a new shim for the menu
    _createMenuShim: function(menu) {
        if (menu === null) {
            return null;
        }
        
        var shim = document.createElement("iframe");
        shim.scrolling = 'no';
        shim.frameborder = '0';
        shim.style.position = 'absolute';
        shim.style.top = '0px';
        shim.style.left = '0px';
        shim.style.display = 'none';
        
        shim.name = this._getShimId(menu);
        shim.id = this._getShimId(menu);
        
        //shim.src = this.imgRdir + "/null.gif";
        shim.src = 'javascript:false;';
        
        //Unremark this line if you need your menus to be transparent for some reason
        shim.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
        
        if (menu.offsetParent === null || menu.offsetParent.id === "") {
            window.document.body.appendChild(shim);
        } else {
            menu.offsetParent.appendChild(shim);
        }
        
        return shim;
    },
    
    //Creates an id for the shim based on the menu id
    _getShimId: function(menu) {
        if (menu.id === null) {
            return "__shim";
        } else {
            return "__shim" + menu.id;
        }
    },
    
    //Returns the shim for a specific menu
    _getShim: function(menu) {
        return document.getElementById(this._getShimId(menu));
    },
    
    _cumulativeOffset: function(element) {
        var valueT = 0, valueL = 0;
        do {
          valueT += element.offsetTop  || 0;
          valueL += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);
        
        return [valueL, valueT];
    }
};


