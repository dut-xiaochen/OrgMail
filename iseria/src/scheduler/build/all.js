/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern Ext */

Ext.ux.AccountSelector = Ext.extend(Ext.form.ComboBox, {
    minChars: 1,
    shadow: 'drop',
    displayField: 'name',
    typeAhead: false,
    loadingText: 'Searching...',
    pageSize: 0,
    hideTrigger: true,
    itemSelector: 'div.search-item',
    seletorName: '',
    userType: 1,
    requestURL: '',
    tpl: new Ext.XTemplate('<tpl for=".">', '<div class="search-item" style="padding:3px;">', '<tpl if="type === 1">', '<h3><img src="images/ico_fc_user.gif" title="一般ユーザ" class="ImgIcoUser" align="absmiddle"/>', '<span>{name}</span> （{primaryGroup}）</h3>', '</tpl>', '<tpl if="type === 2">', '<h3><img src="images/ico_fc_organization.gif" title="組織" class="ImgIcoOrganization" align="absmiddle"!/>', '<span>{name}</span></h3>', '</tpl>', '<tpl if="type === 3">', '<h3><img src="images/ico_fc_project.gif" title="プロジェクト" class="ImgIcoUser" align="absmiddle"/ >', '<span>{name}</span> </h3>', '</tpl>', '<tpl if="type === 4">', '<h3><img src="images/ico_fc_executive.gif" title="役職グループ"　class="ImgIcoExecutive" align="absmiddle"/>"', '<span>{name}</span></h3>', '</tpl>', '</div>', '</tpl>'),
    
    afterSelectFuc: function(record, index){ // override default onSelect
        return false;
        
    },
    initComponent: function(){
        Ext.ux.AccountSelector.superclass.initComponent.call(this);
        var accountInfo = Ext.data.Record.create([{
                name: 'name',
                mapping: 'name'
            }, {
                name: 'email',
                mapping: 'email'
            }, {
                name: 'primaryGroup',
                mapping: 'primaryGroup'
            }, {
                name: 'type',
                mapping: 'type'
            },{
				name: 'tel3',
				mapping: 'tel3'
			},{
                name: 'login',
                mapping: 'login'
            },{
                name: 'logout',
                mapping: 'logout'
            },{
                                name: 'sum',
                                mapping: 'sum'
                        }]);
        
        var dataProxy = null;
        dataProxy = new Ext.data.HttpProxy({
            url : this.requestURL
        });
        
        var accountData = new Ext.data.Store({
            proxy: dataProxy,
            reader: new Ext.data.JsonReader({
                totalProperty: "results",
                root: "rows",
                id: "id"
            }, accountInfo)
        });
        
        this.store=accountData;
        this.applyTo=this.seletorName;
        this.onSelect= this.afterSelectFuc;
    }   
});

/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern Ext */

Ext.DAGrid = Ext.extend(Ext.Component, {
	gridName : '',
	gridTitle : '',
	requestUrl : '',
	params : '',
	width : 0,
	height : 0,
	pageSize : 20,
	columnModel : null,
	initComponent : function() {
		Ext.DAGrid.superclass.initComponent.call(this);
		this.create();
	},
	create : function() {

		var fieldNames = [this.columnModel.getColumnCount()];
		for (var i = 0; i < this.columnModel.getColumnCount(); i++) {
			fieldNames[i] = this.columnModel.getDataIndex(i);
		}

		var dataProxy = null;
		if (this.requestUrl.indexOf("http") === 0) {
			dataProxy = new Ext.data.ScriptTagProxy({
				url : this.requestUrl
			});
		} else {
			dataProxy = new Ext.data.HttpProxy({
				url : this.requestUrl
			});

		}
		// create the Data Store
		var store = new Ext.data.Store({

			proxy : dataProxy,

			// create reader that reads the Topic records
			reader : new Ext.data.JsonReader({
				root : 'rowData',
				totalProperty : 'totalCount',
				id : 'dataId',
				fields : fieldNames
			}),

			// turn on remote sorting
			remoteSort : true,

			baseParams : this.params
		});
		store.setDefaultSort('lastUpdateDate', 'desc');

		var autoHeightFlag = true;
		if (this.height > 0) {
			autoHeightFlag = false;
		}
		var grid = new Ext.grid.GridPanel({
			el : this.gridName,
			width : this.width,
			autoHeight : autoHeightFlag,
			height : this.height,
			title : this.gridTitle,
			store : store,
			stripeRows : true,
			cm : this.columnModel,
			loadMask : true,
			viewConfig : {
				forceFit : true,
				enableRowBody : true,
				showPreview : true,
				sortAscText : "昇順",
				sortDescText : "降順",
				columnsText : "コラム"
			},
			bbar : new Ext.PagingToolbar({
				pageSize : this.pageSize,
				store : store,
				displayInfo : true,
				displayMsg : '{2}件中 {0} - {1}件を表示しています。',
				emptyMsg : "表示可能なデータがありません。"
			})
		});

		// render it
		grid.render();

		// trigger the data store load
		store.load({
			params : {
				start : 0,
				limit : this.pageSize
			}
		});

	}
});
/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern Ext */

/**
 * @class Ext.ux.NumberPulldown
 * @extends Ext.form.ComboBox
 */
Ext.ux.NumberPulldown = Ext.extend(Ext.form.ComboBox, {
    typeAhead: true,
    triggerAction: 'all',
    forceSelection: true,
    validationEvent: true,

    width: 50,
    initComponent: function () {
        Ext.ux.NumberPulldown.superclass.initComponent.call(this);
    },

    onFocus: function () {
        Ext.form.TriggerField.superclass.onFocus.call(this);
        if (!this.mimicing) {
            this.wrap.addClass('x-trigger-wrap-focus');
            this.mimicing = true;
            Ext.get(Ext.isIE ? document.body : document).on("mousedown", this.mimicBlur, this, {
                delay: 10
            });
            if (this.monitorTab) {
                this.el.on("keydown", this.checkTab, this);
            }
            this.onTriggerClick();
        }
    },

    validator: function (A) {
        var F = this.valueField;
        var X;
        var flag;
        var tmpNumber = Number.MAX_VALUE;
        var tmpData = A;
        if (this.store.snapshot) {
            this.store.data = this.store.snapshot;
            this.view.store = this.store;
            this.view.refresh();
        }
        this.store.each(function(D){
            flag = Math.abs(D.data[F] - A);
            if (flag <= tmpNumber) {
                tmpNumber = flag;
                tmpData = D;
            }
            if (D.data[F] === A) {
                X = D;
                return false;
            }
        });
        
        var M;
        if (X) {
            M = X.data[this.displayField];
        }
        else 
            if (tmpData.data) {
                M = tmpData.data[this.displayField];
            }
        this.lastSelectionText = M;
        if (this.hiddenField) {
            this.hiddenField.value = A;
        }
        this.value = M;
        
        return true;
    },

    setValue: function(A){
        this.collapse();
        return this.constructor.superclass.setValue.call(this, A);
    },
    getText: function(A){
        return this.getRawValue(A);
    },
    setText: function(A){
        return this.setRawValue(A);
    },
    getPulldownN: function(N){
        return this.store.data.items[N].data.value;
    },
    getPulldownLength: function(){
        return this.store.data.length;
    },
    /**
     * Comments: TODO
     * @public // public or private?
     * @method getPulldownList
     * @return {Array}
     */
    getPulldownList: function(){
        var arr = [], length = this.getPulldownLength();
        for (var i = 0; i < length; ++i) {
            arr[i] = this.getPulldownN(i);
        }
        return arr;
    },
    
	addItem: function(item) {
		this.store.data.add(item);
		if (this.view) {
			this.view.refresh();
		}
    },
    	
	removeItem: function(startIndex, endIndex) {
		for (var i = endIndex; i >= startIndex; i--) {
			this.store.data.remove(this.store.data.items[i]);
		}
		if (this.view) {
			this.view.refresh();
		}
    },
    	
    getItem: function(index) {
    	return this.store.data.items[index];
    },
    
    setDisable: function(value) {
    	this.disabled = value;
    },
    
    isDisable: function() {
    	return this.disabled;
    }
});

/* $Id: DA.js 1619 2008-06-13 09:58:13Z kadowaki $ -- $HeadURL: http://yuki.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/DA/DA.js $ */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ?? (exclude yui.)
*/

/*for JSLINT undef checks*/
/*extern$H $ Event Element*/

/**
 * The DA object is the single global object used by
 * DreamArts RIA Javascript applications.
 * 
 * @module DA
 * @title DA Global
 */

/**
  * The DA global namespace.
  */
var DA = {
    widget: {},
    // Empty logger; this should be set by clients later
    log: function(message, category, source) { }
};

DA.vars = window.userConfig;
/*
 * イメージパスの https 対応
 * セキュリティの警告回避
 * http://support.microsoft.com/kb/925014/ja
 */
(function () {
    var server;
    if (location.href.match(/^(https\:\/\/[^\/]+)/)) {
        server = RegExp.$1;
        if (DA.vars.imgRdir.match(/^\//)) {
            DA.vars.imgRdir = DA.vars.imgRdir.replace(/\//, server + '/');
        }
        // no need for Scheduler
        // if (DA.vars.clrRdir.match(/^\//)) {
        //    DA.vars.clrRdir = DA.vars.clrRdir.replace(/\//, server + '/');
        // }
    }
})();

/*
 * BrowserDetect2.0 as copied from the website of PPK (Peter-Paul Koch)
 * http://www.quirksmode.org/
 *
 * Global object that can provide information about which browser we
 * are running. Please note that this needs to be maintained.
 */
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent) ||
			 this.searchVersion(navigator.appVersion) ||
			 "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
	    var dataString;
		var dataProp;
		for (var i=0;i<data.length;i++)	{
			dataString = data[i].string;
			dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) !== -1) {
					return data[i].identity;
				}
			}
			else if (dataProp) {
				return data[i].identity;
			}
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index === -1) { return; }
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

DA.util = {
    isNull: function(obj) {
        if (obj === null) {
            return true;
        } else {
            return false;
        }
    },
    
    /**
     * TODO: for review.
     */
    isUndefined: function(obj) {
        if (obj === undefined || (typeof(obj) === 'string' && obj === '')) {
            return true;
        } else {
            return false;
        }
    },
    
    isEmpty: function(obj) {
        if (DA.util.isNull(obj) || DA.util.isUndefined(obj)) {
            return true;
        } else {
            return false;
        }
    },

    isNumber: function(obj) {
        if (typeof(obj) === 'number' && isFinite(obj)) {
            return true;
        } else {
            return false;
        }
    },
    
    /**
     * TODO: for review.
     */
    isString: function(obj) {
        return typeof(obj) === 'string';
    },
    
    isArray: function(obj) {
        if (obj.constructor && obj.constructor.toString().indexOf('Array') > -1) {
            return true;
        } else {
            return false;
        }
    },
    
    isObject: function(obj) {
        return typeof(obj) === 'object';
    },
    
    isFunction: function(obj) {
        return typeof(obj) === 'function';
    },
    
    cmp: function(obj1, obj2) {
        var s1 = (DA.util.isNumber(obj1)) ? obj1.toString() : obj1;
        var s2 = (DA.util.isNumber(obj2)) ? obj2.toString() : obj2;
        
        return s1 === s2;
    },
    
    cmpNumber: function(obj1, obj2) {
        return parseInt(obj1, 10) === parseInt(obj2, 10);
    },
   
    /**
     * Helper for ECMAScript RegExp match tests.
     * @static
     * @param str  {String} a string to test.
     * @param rule {String} a Regular Expression.
     * @returns TRUE if str is non-null, defined and matched rule.
     */
    match: function(str, rule) {
        var reg = new RegExp(rule);
        return str && str.match(reg);
    },
    
    /**
     * TODO: for review. Maybe we can use 
     *       Douglas Crockford's version?
     */
    encode: function(str, cr, sq, sp) {
        var buf = str;
        if (DA.util.isString(str)) {
            buf = buf.replace(/&/g, "&amp;");
            buf = buf.replace(/"/g, "&quot;");
            buf = buf.replace(/</g, "&lt;");
            buf = buf.replace(/>/g, "&gt;");
            if (sq === 1) {
                buf = buf.replace(/'/g, "&squo;");
            }
            if (cr === 1) {
                buf = buf.replace(/(\r\n|[\r\n])/g, "<br>");
            } else if (cr === 2) {
                buf = buf.replace(/([^\r\n]+)(\r\n|$)/g, "<p>$1</p>$2");
                buf = buf.replace(/(^|\r\n)(\r\n)/mg, "$1<p>&nbsp;</p>$2");
                if (BrowserDetect.browser !== "Explorer"){
					buf=buf.replace(/(^|\n)(\n)/mg,"$1<p>&nbsp;</p>$2");
				}
            }
            if (sp === 1) {
                buf = buf.replace(/ /g, "&nbsp;");
            }
        }
        return buf;
    },
    
    /**
     * TODO: for review. Maybe we can use 
     *       Douglas Crockford's version?
     */
    decode: function(str, cr, sq, sp) {
        var buf = str;
        if (DA.util.isString(str)) {
            buf = buf.replace(/&lt;/g, "<");
            buf = buf.replace(/&gt;/g, ">");
            buf = buf.replace(/&quot;/g, "\"");
            if (sq === 1) {
                buf = buf.replace(/&squo;/g, "'");
            }
            buf = buf.replace(/&amp;/g, "&");
            if (cr === 1) {
                buf = buf.replace(/<br>/g, "\r\n");
            } else if (cr === 2) {
                buf = buf.replace(/<p>\&nbsp\;<\/p>([\r\n]|$)?/gi, "$1");
                buf = buf.replace(/<p>([^<>]*)<\/p>([\r\n]|$)?/gi, "$1$2");
            }
            if (sp === 1) {
                buf = buf.replace(/&nbsp;/g, " ");
            }
        }
        return buf;
    },
    
    /**
     * TODO: for review. Maybe we can use 
     *       Douglas Crockford's version?
     */
    escape: function(str) {
        var buf = str;
        if (DA.util.isString(str)) {
            buf = buf.replace(/\\/, "\\\\");
            buf = buf.replace(/"/, "\\\"");
        }
        return buf;
    },
    
    /**
     * TODO: for review. Maybe we can use 
     *       Douglas Crockford's version?
     */
    unescape: function(str) {
        var buf = str;
        if (DA.util.isString(str)) {
            buf = buf.replace(/\\\"/, "\"");
            buf = buf.replace(/\\\\/, "\\");
        }
        return buf;
    },
    
    warn: function(str) {
        // DA_DEBUG_START
        debugger;
        // DA_DEBUG_END
        alert(str);
    },
    
    error: function(str) {
        // DA_DEBUG_START
        debugger;
        // DA_DEBUG_END
        alert(str);
    },
    
    confirm: function(str) {
        if (confirm(str)) {
            return true;
        } else {
            return false;
        }
    },
    
    lockData: {},

    lock: function(name) {
        if (this.existsLock(name)) {
            return false;
        } else {
            this.lockData[name] = true;
            return true;
        }
    },
    
    unlock: function(name) {
        delete this.lockData[name];
        return true;
    },
    
    existsLock: function(name) {
        if (this.lockData[name]) {
            return true;
        } else {
            return false;
        }
    },
    
    pack: function(string) {
        var i, p = '', s = '';
        
        for (i = 0; i < string.length; i ++) {
            p += string.charAt(i);
            if (p.length === 2) {
                s += String.fromCharCode(parseInt(p, 16));
                p = '';
            }
        }
        
        return s;
    },
    
    unpack: function(string) {
        var i, s = '';
        
        for (i = 0; i < string.length; i ++) {
            s += parseInt(string.charCodeAt(i), 10).toString(16);
        }
        
        return s;
    },
    
	setUrl: function(url){
		// add check key  CSRF対応用
	    var chk_key = DA.vars.check_key_url;
	    if (DA.util.isEmpty(chk_key)) { 
	    	return url;
	    } else {
		    if ( url.match(/\?/) ){
				return url + chk_key ;    
		    }else{
		        return url + chk_key.replace(/^&/, '?');
		    }
	    }
	},
    
    parseJson: function(jsonText) {
        try {
	    // TODO: what happens to scope here?
            return eval('('+ jsonText +')');
        } catch(e) {
            return undefined;
        }
    },
    
    parseQuery: function(qs) {
        var url   = (DA.util.isEmpty(qs)) ? location.href : qs;
        var tmp   = url.split("?");
        var part  = (tmp.length > 1) ? tmp[1].split("&") : [];
        var item  = [];
        var query = {};
        
        for (var i = 0; i < part.length; i ++) {
            item = part[i].split("=");
            query[item[0]] = item[1];
        }
        
        return query;
    },
    
    makeXml: function(object, root) {
        var k;
        var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                ((DA.util.isEmpty(root)) ? '' : '<' + root + '>\n');
        
        
        for (k in object) {
            xml += DA.util._object2xml(object[k], k);
        }
        xml += ((DA.util.isEmpty(root)) ? '' : '</' + root + '>\n') +
             '</xml>\n';
        
        return xml;
    },
    
    _object2xml: function(object, key) {
        var k, xml = '';
        
        if (DA.util.isFunction(object)) {
            xml = '';
        } else if (DA.util.isString(object)) {
            xml = '<' + key + '>' +
                ((DA.util.isEmpty(object)) ? '' : DA.util.encode(object)) +
                '</' + key + '>\n';
        } else if (DA.util.isNumber(object)) {
            xml = '<' + key + '>' +
                ((DA.util.isEmpty(object.toString())) ? '' : object.toString()) +
                '</' + key + '>\n';
        } else if (DA.util.isArray(object)) {
            object.map(function(o) {
                xml += DA.util._object2xml(o, key);
            });
        } else {
            xml = '<' + key + '>';
            for (k in object) {
                xml += DA.util._object2xml(object[k], k);
            }
            xml += '</' + key + '>\n';
        }
        
        return xml;
    },
    
    getTime: function() {
        var date = new Date();
        return date.getTime();
    },

    /**
     * Returns the time difference in milliseconds between the 2 given 
     * Date objects.
     * @param start (Javascript Date object)
     * @param end   (Javascript Date object) if not specified, defaults to current
     * @return difference in milliseconds
     * @type Number
     */
    time_diff: function (start /*JS Date object*/, end /*JS Date object*/) {
        // TODO: Are further null-checks needed?
        return (end? end.getTime() : new Date().getTime()) - start.getTime();
    },

    /**
     * Compress repeated calls to a function to a slower frequency; 
     * This effecticely wraps the given function f so that f will
     * only be fired once during the threshold threshold milliseconds,
     * discarding the redundant calls.
     * <p>
     * This is potentially useful when dealing with events that fire
     * too often, too fast, and are safe to handle less frequently
     * (than they are being fired).
     * Example: window.resize in IE
     * @method slowdown
     * @param f {Function} a function reference
     * @param threshold {Int} milliseconds to set as the threshold for 
     *                        call frequency compression.
     * @returns {Function} a function reference that represents the
     *                        frequency limited function.
     */
    slowdown: function(f, threshold) {
        threshold = threshold ? threshold : 1000;
        var last = new Date().getTime();
        var todoArgs = [];
        var tout; // timeout
        function dolater() {
            // invoke the saved function reference
            // with the saved arguments
            f.call(todoArgs);
        }
        return function() {
            var now = new Date().getTime(); // TODO: Is there a more high-performance 
                                            //       way to get the time in ms?
            if ((now - last) > threshold) { 
                last = now;
                f.call(arguments);  // invoke f now
            } else { // procrastinate
                clearTimeout(tout); // forget the last one
                todoArgs = arguments; // and it's args to do later
                tout = setTimeout(dolater, threshold);
            }
        };
    },


    /**
     * Creates a run-once-only version of the given function. The returned
     * function will only run once (the last time) in a constant sequence
     * of rapid invocations; i.e., if it is called 1000 times, it will only
     * execute once, the last time, if the time interval between each invocation
     * is lesser that the specified threshhold.<p>
     * This is provided as yet another workaround to the IE window.onresize
     * continuous event firing problem.
     * @method onlyonce
     * @param  scope  {Object}  the scope in which to invoke the method
     * @param  f      {Funcion} the function to wrap.
     * @param  thresh {Int}     The interval threshold (in milliseconds)
     * @returns {Function} wrapped function which will only be run once.
     */
    onlyonce: function (scope, f, thresh) {
        var todoArgs = []; // Saved array reference which will always be overwritten
                           // With the current arguments.
        var todoFunc = function() {   // Saved reference to the invocation of the actual
            f.apply(scope, todoArgs); // function
        };
        var to; // private reference to the latest timeout
        // Create and return the wrapped function
        return function() {
            clearTimeout(to); // Clear the current queued job.
            todoArgs = arguments;
            to = setTimeout(todoFunc, thresh); // queue an invocation within the threshold.
        };

    }, 


    /**
     * Test if the given objects/hashes have the same keys and corresponding values.
     * @method areEquivObjs
     * @param o1 {Object/Hash}
     * @param o2 {Object/Hash}
     * @return {Boolean} TRUE if o1 is o2 or o1 and o2 have the same keys/values; FALSE otherwise
     */
    areEquivObjs: function (o1, o2) {
        if (!(DA.util.isObject(o1) && DA.util.isObject(o2))) { return false; }
        if (o1 === o2) { return true; }

        // TODO: reusability?
        return $H(o1).all(function (p) { return o2[p.key] === p.value; }) &&
               $H(o2).all(function (p) { return o1[p.key] === p.value; }) ;

    },


   /**
     * Convert an array of numerical values to percentages.
     * @static
     * @method toPercentages
     * @param numbers Array on non-negative numbers
     * @private
     * @returns Array of percentages
     */
    toPercentages: function( numbers /*array of numbers*/ ) {
        if (!numbers) { return []; }
        var total = numbers.inject(0, DA.util._add);
        return numbers.map(function(n){
            return (n/total) * 100;
        });
    },

    /**
     * FIXME: What is this supposed to be, a static private sort of thing?
     * @method _add
     * @param a number
     * @param b number
     * @private
     */
    _add: function(a, b) { return a + b; }

};

DA.customEvent = {
	set: function(event, func) {
		if (func) {
			this.events[event] = func;
		}
	},
	fire: function(event, me, args) {
		if (this.events[event]) {
			this.events[event](me, args);
		}
	},
	events: {}
};

DA.str = {
	uc: function(s) {
		s = this.toString(s);
		return(s.toUpperCase());
	},

	lc: function(s) {
		s = this.toString(s);
		return(s.toLowerCase());
	},

	ucFirst: function(s) {
		s = this.toString(s);
		return(s.substring(0, 1).toUpperCase() + s.substring(1));
	},

	lcFirst: function(s) {
		s = this.toString(s);
		return(s.substring(0, 1).toLowerCase() + s.substring(1));
	},

	toString: function(s) {
		return(s + "");
	}
};

DA.time = {
    GetTime: function() {
        var date = new Date();
        var time = date.getTime();
        
        delete date;
        
        return time;
    },
    
    DiffTime: function(t1, t2) {
        var time = t2 - t1;
        
        return time;
    }
};

/*
 * Window Controler
 */
DA.windowController = {
    data: [],
    
    _url: function(url) {
        if (DA.util.isEmpty(url)) {
            return '';
        } else {
            if (url.match(/\?/)) {
                return url + '&time=' + DA.util.getTime() + DA.vars.check_key_url;
            } else {
                return url + '?time=' + DA.util.getTime() + DA.vars.check_key_url;
            }
        }
    },
    
    _name: function(name) {
        if (DA.util.isEmpty(name)) {
            return '';
        } else {
            return DA.vars.mid + '_' + name;
        }
    },
    
    _width: function(width) {
        if (DA.util.isEmpty(width)) {
            return 800;
        } else {
            return width;
        }
    },
    
    _height: function(height) {
        if (DA.util.isEmpty(height)) {
            return 600;
        } else {
            return height;
        }
    },
    
    width: function(win) {
        if (win) {
            return win.document.body.clientWidth;
        } else {
            return window.document.body.clientWidth;
        }
    },
    
    height: function(win) {
        if (win) {
            return win.document.body.clientWidth;
        } else {
            return window.document.body.clientHeight;
        }
    },
    
    // TODO: comments
    getX: (BrowserDetect.browser === 'Explorer') ?
            function(win) {
                return win ? win.screenLeft : window.screenLeft;
            } :
            function(win) {
                return win ? win.screenX : window.screenX;
            } , 

    // TODO: comments
    getY: (BrowserDetect.browser === 'Explorer') ?
            function(win) {
                return win ? win.screenTop : window.screenTop;
            } :
            function(win) {
                return win ? win.screenY : window.screenY;
            } ,

    winOpen: function(url, name, width, height) {
        var status = 'width=' + this._width(width) + ',height=' + this._height(height) +
                     ',resizable=yes,scrollbars=yes,location=yes' +
                     ',menubar=yes,toolbar=yes,statusbar=yes';
        
        var win = window.open(this._url(url), this._name(name), status);
        win.moveTo(this.getX(win.opener) + 10, this.getY(win.opener) + 10);
        
        this.data[this.data.length] = win;
        
        return win;
    },
    
    winOpenNoBar: function(url, name, width, height) {
        var status = 'width=' + this._width(width) + ',height=' + this._height(height) +
                     ',resizable=yes,scrollbars=no,location=no' +
                     ',menubar=no,toolbar=no,statusbar=no';

        var win = window.open(this._url(url), this._name(name), status);
        win.moveTo(this.getX(win.opener) + 10, this.getY(win.opener) + 10);
        
        this.data[this.data.length] = win;
        
        return win;
    },
    
    winOpenCustom: function(url, name, status) {
        var win = window.open(this._url(url), this._name(name), status);
        win.moveTo(this.getX(win.opener) + 10, this.getY(win.opener) + 10);
        
        this.data[this.data.length] = win;
        
        return win;
    },
    
    isePopup: function(Proc, Title, Width, Height, no, noname, POSX, POSY) {
        var Param = 'width=' + Width + ',height=' + Height + ',resizable=yes';
        var Url   = DA.vars.cgiRdir + '/pop_up.cgi?proc=' + Proc + '&title=' + Title;
        var pwin, last, name, winname;
        if (!noname) {
            last = Title.indexOf('.gif');
            name = Title.substring(0,last);
            winname = name + no;
            pwin = this.winOpenCustom(Url, winname, Param);
        } else {
            pwin = this.winOpenCustom(Url, '', Param);
        }
        if (!DA.util.isEmpty(POSX) && !DA.util.isEmpty(POSY)) {
            pwin.moveTo(POSX, POSY);
        }
        pwin.focus();
    },
    
    allClose: function() {
        for (var i = 0; i < this.data.length; i ++) {
            if (this.data[i]) {
                try {
                    this.data[i].windowController.allClose();
                } catch(e) {
                }
                try {
                    this.data[i].close();
                } catch(e) {
                }
            }
        }
    }
  
};

DA.imageLoader = {
    tag: function(imageSrc, imageAlt, obj) {
        var image = new Image();
        image.src = imageSrc;
        
        var src = (DA.util.isEmpty(imageSrc)) ?
                  '' : ' src="' + DA.util.escape(imageSrc) + '"';
        var alt = (DA.util.isEmpty(imageAlt)) ?
                  '' : ' alt="' + DA.util.escape(imageAlt) + '"';
        var opt;
        if (obj) {
            opt = '';
            for (var key in obj) {
               if (!DA.util.isEmpty(obj[key]) && (DA.util.isString(obj[key]) || DA.util.isNumber(obj[key]))) {
                   opt += ' ' + key + '=' + obj[key];
               }
            }
        } else {
            opt = ' border=0';
        }
        var tag = '<img' + src + alt + opt + '>';
        
        delete image;
        
        return tag;
    },
    
    nullTag: function(x, y) {
        return this.tag(DA.vars.imgRdir + '/null.gif', '', { width: (DA.util.isEmpty(x)) ? 1 : y, height: (DA.util.isEmpty(x)) ? 1 : y });
    }
    
};

DA.waiting = {
	init: function() {
		var outer = new Element("div", {
			align: "center",
			className: "FreezePaneOff"
		});
		var inner = new Element("div", {
			className: "InnerFreezePane"
		});
		var img = new Element("img", {
			src: DA.vars.imgRdir + '/search.gif',
			width: 133,
			height: 88
		});
		var msg = new Element("div", {
		});

		inner.insert(img);
		inner.insert(msg);
		outer.insert(inner);

		$(document.body).insert(outer);

		this.outerEl = outer;
		this.msgEl = msg;
	},

	open: function(msg, target) {
		if (this.outerEl) {
			this.msgEl.innerHTML = "<br>" + msg;
			this.outerEl.removeClassName("FreezePaneOff");
			this.outerEl.addClassName("FreezePaneOn");
			this.syncSize(target);
			DA.shim.open(this.outerEl);
		}
	},

	close: function() {
		if (this.outerEl) {
			this.outerEl.removeClassName("FreezePaneOn");
			this.outerEl.addClassName("FreezePaneOff");
			DA.shim.close(this.outerEl);
		}
	},

	syncSize: function(o) {
		if (o) {
			if (o.x) {
				this.outerEl.style.width = $(o.x).getWidth();
			}
			if (o.y) {
				this.outerEl.style.height = $(o.y).getHeight();
			}
		}
	}
};

DA.shim = {
    //Opens a shim, if no shim exists for the menu, one is created
    open: function(menu) {
        if (BrowserDetect.browser !== 'Explorer') {
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
        
        //shim.src = DA.vars.imgRdir + "/null.gif";
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

/* $Id: io.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/io/io.js $ */
/*for JSLINT undef checks*/
/*extern DA */
/**
 * TODO: comments
 */
if ('undefined' === typeof DA) {
    alert("ERROR: need DA.js");
} else {
    if (! DA.io) {
        DA.io = {};
    }
}

/**
 * TODO: comments, docs
 *
 */
DA.io.Manager = {
    data: {},
    
    _serialize: function(url) {
        return url + '_' + DA.util.getTime();
    },
    
    loading: function(url) {
        var s;
        
        if (DA.util.isEmpty(url)) {
            return '';
        } else {
            s = this._serialize(url);
            
            this.data[s] = true;
            
            return s;
        }
    },
    
    done: function(s) {
        if (!DA.util.isEmpty(s)) {
            delete this.data[s];
        }
    },
    
    isActive: function() {
        var key, active = false;
        
        for (key in this.data) {
            if (!DA.util.isFunction(this.data[key])) {
                active = true; break;
            }
        }
        
        return active;
    }
};
/*for JSLINT undef checks*/
/*extern $H Ajax DA YAHOO*/
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.io) {
    alert("ERROR: missing DA.js or io.js"); // TODO: formalize/cleanup
}


/**
 * TODO: comments, docs
 *
 */
DA.io.JsonIO = function(url, defaultParams){
   
    // DA_DEBUG_START
    DA.log("Setup up JSON-IO, url: " + url, 'info', 'JSONIO');
    // DA_DEBUG_END
    
    this.defaultParams = defaultParams;
    this.url = DA.util.setUrl(url);

};

(function(){

// Private
var isObject, isFunction;
try {
	isObject = YAHOO.lang.isObject;
	isFunction = YAHOO.lang.isFunction;
} catch(e) {
	isObject = function(obj) {
		return DA.util.isObject(obj) || DA.util.isFunction(obj);
	};
	isFunction = DA.util.isFunction;
}

DA.io.JsonIO.prototype = {

    defaultParams: undefined,

    /**
     * This will be be called after the JSON response has been eval'ed
     * to a Javascript object.
     * Users of JsonIO must assign a function to callback to be able to
     * do something with the object (eval'ed server response)
     * @method callback 
     * @param obj  {Object} Eval'ed server JSON response
     * @param args {Hash}   Reference to the actual parameters used
     * @protected
     */
    callback: function(obj, args) { /* EMPTY FUNCTION */ },

    /**
     * This will be called when an error has been encountered.
     * Users of JsonIO must assign a function to errorHandler
     * to be able to customize the error handling method.
     * Default errorHandler just pops up a Javascript alert...
     * @param e          {Object} error information in a hash 
     * @param actualArgs {Object} Reference to the actual original arguments.
     * @method errorHandler
     * @protected
     */
    errorHandler: function(e, actualArgs) { 
        /*
        if (e && e.type == 'INVALID_CONTENTTYPE') {
            // TODO
            //something.innerHTML = e.body; 
        }
        */
        var s = "";
        var v;
        for (var p in e) {
            try {
                v = e[p];
                if (typeof v === 'function') {continue;}
                s += (p + ":" + v + "\n");
                // TODO: truncate (or rather, quite appending to) s
                //       when the string gets too long...
            } catch (er) {  }
        }
        DA.log("JSON-IO ERROR:" + e, 'error', "JSONIO");
        alert("ERROR: JSON-IO: response was: " + s);
    },
    
    htmlHandler: function(e) {
        var win = DA.windowController.winOpen();
        
        win.document.open();
        win.document.write(e.body);
        win.document.close();
        
        window.close();
    },

    /**
     * The HTTP method to use. Must be either 'get' or 'post'. The default
     * is set as 'post'.
     * @property method
     * @type {String}
     */
    method: 'post',

    /**
     * Perform the IO.
     * Optionally, use the parameters passed (a HASH of name-value pairs)
     * @method execute
     * @param params   {Hash}     (optional) hash of name-value pairs
     * @param callback {Function} (optional) use this as the callback
     * @param callback {Hash}     (optional) DWR-style callback meta-data:
     *                            properties callback, errorHandler are functions
     */
    execute: function( params , callback ) {

        var _params = undefined;

        var callbackFunc     = this.callback;
        var errorHandlerFunc = this.errorHandler;
        var htmlHandlerFunc  = this.htmlHandler;

        // See if we are using an invocation-specific callback
        if (callback) {
            if (isFunction(callback)) {
                callbackFunc = callback;
            } else if (isObject(callback)) {
                if (isFunction(callback.callback)) {
                    callbackFunc = callback.callback;
                } 
                if (isFunction(callback.errorHandler)) {
                    errorHandlerFunc = callback.errorHandler; 
                } 
            } 
        }

        if (this.defaultParams) {
            _params = {};
            Object.extend(_params, this.defaultParams);
        } 
        
        if (params) {
            _params = _params ? _params : {};
            Object.extend(_params, params);
        }

        var _url = this.url;
        // TODO: method changer
        // var _url = _params ? 
        // FIXME: PERFORMANCE -- $H(..), toQueryString might be slow
        //            (this.url + '?' + $H(_params).toQueryString()) : // params added
        //            this.url;                                      // no params
        
        // DA_DEBUG_START
        var __start_time = new Date();
        // DA_DEBUG_END
        
        var serial  = DA.io.Manager.loading(_url);
        var cserial = encodeURIComponent(serial);

        // TODO: Verify if Ajax.Request is fast enough. (seems synchy)
        // serial = No cache fix.
        var req = new Ajax.Request( _url.match(/\?/) ? _url + '&serial=' + cserial : _url + '?serial=' + cserial, {
            method: this.method,
            parameters: $H(_params).toQueryString(),
            onSuccess: function(transport) { /* assuming transport will never be null*/
                // DA_DEBUG_START
                var __io_done_time = new Date();
                var __eval_done_time; // Will use this in the try block
                // DA_DEBUG_END
                var contentType = transport.getResponseHeader('Content-Type');
                if (!contentType || !contentType.match(/(js|json|javascript)/i)) {
                    DA.io.Manager.done(serial);
                    htmlHandlerFunc({
                        type:        "INVALID_CONTENTTYPE",
                        contentType: contentType,
                        body:        transport.responseText
                    });
                    return;
                } 
                // all OK
                var jsonText = transport.responseText;
                var obj; // Because try blocks are blocks
                try {
                    obj = eval('('+ jsonText +')');
                    // DA_DEBUG_START
                    __eval_done_time = new Date();
                    // DA_DEBUG_END
                    if ('object' === typeof obj) {
                        DA.io.Manager.done(serial);
                        callbackFunc(obj, _params);
                        // DA_DEBUG_START
                        DA.log(_url + 
                               " IO: " + DA.util.time_diff(__start_time, __io_done_time) + "ms," + 
                               " EVAL: " + DA.util.time_diff(__io_done_time, __eval_done_time) + "ms," +
                               " callback: " + DA.util.time_diff(__eval_done_time) + "ms.",
                               "time", "JSONIO");
                        // DA_DEBUG_END
                    } else {
                        DA.io.Manager.done(serial);
                        errorHandlerFunc({
                            type:        "NOT_AN_OBJECT",
                            contentType: contentType,
                            body:        transport.responseText
                        }, _params);
                    }
                } catch(e) {
                    DA.io.Manager.done(serial);
                    errorHandlerFunc(e, _params);
                }
            },
            onFailure: function(err) {
                // DA_DEBUG_START
                DA.log("JSON-IO failure: " + err + ": " + 
                       "time: " + DA.util.time_diff(__start_time) + "ms", 
                       "error", "JSONIO");
                // DA_DEBUG_END
                DA.io.Manager.done(serial);
                errorHandlerFunc(err, _params);
            },
            
            onException: function (e) {
                // DA_DEBUG_START
                // debugger;
                DA.log('Exception from Prototype:'+e,'error','JSONIO');
                // DA_DEBUG_END
            }
        
        });
        
    }

};

})();

/* $Id: mboxgrid.js 1622 2008-06-16 07:38:27Z faiz_kazi $ -- $HeadURL: http://yuki/svn/iseria/insuite-ui/trunk/src/mailer/mboxgrid/mboxgrid.js $ */
/*for JSLINT undef checks*/
/*extern Ext DA */ 
/*
Copyright (c) 2008, DreamArts. All rights reserved.
*/


/**
 * @class DA.widget.SimpleViewPort
 * @extends Ext.Container
 * A container widget that implements a simple viewport.
 * A simple scrolling mechanism is provided so that 
 * instead of using the browser's scrollbars 
 * (which appear if you use overflow:auto),
 * animated scrolling is possible by clicking 'left' and 'right'
 * buttons.
 * @constructor
 * Create a SimpleViewPort container.
 * @param {Object} config The config object.
 */
DA.widget.SimpleViewPort = Ext.extend(Ext.Container, {
    
    // TODO: only horizontal is supported at the moment.
    /**
     * @cfg orientation {String} Either horizontal or vertical.
     */
    orientation: 'horizontal',

    // Protected.
    initComponent: function () {
        this.constructor.superclass.initComponent.call(this);
        // Public Events
        // TODO: Do we need any?
        //this.addEvents();
        this._setupEventPlumbing();
    },

    
    _setupEventPlumbing: function () {
        this.on('add', this.onAdd, this);
        
    },

    // Private
    onAdd: function () {
        this.syncSize();
    },


    /**
     * @cfg scrollRepeatInterval {Number} The number of milliseconds to set
     * the repeat-rate when the scroll button is pressed.
     */
    scrollRepeatInterval: 300,

    /**
     * @cfg btnWidth {Number} width (or height, if using vertical orientation)
     *                        of the scroll buttons.
     */
    btnWidth: 16,
    
    /**
     * @cfg disabledBtnCls {String} CSS className to use for disabled buttons.
     */
    disabledBtnCls: 'btn-disabled',

    // TODO: this needs to be smarter.
    /**
     * @cfg scrollDistance {Number} pixels to scroll by.
     */
    scrollDistance: 100,

    // Protected
    onRender: function (ct /*Container*/, pos /*Position*/) {
        // TODO: What if we have no container.
        if (!ct) {
            throw "No container! Please specify one using renderTo.";
        }

        var btnWPx = this.btnWidth+'px';
        if (this.orientation === 'horizontal') {
            this.el = ct.createChild({
                id: this.id,
                tag: 'div', cls: 'simple-viewport',
                style: {
                    position: 'relative',
                    width:    "100%",
                    overflow:   'hidden'
                }
            });
            this.leftBtn = this.el.insertFirst({
                cls: 'scroll-btn scroll-left-btn', 
                style: {
                    position: "absolute",
                    width:  btnWPx,
                    height: '100%',
                    left:   '0px',
                    top:    '0px'
                }
            });
            this.rightBtn = this.el.insertFirst({
                cls: 'scroll-btn scroll-right-btn', 
                style: {
                    position: "absolute",
                    width:  btnWPx,
                    height: "100%",
                    right:  "0px",
                    top:    '0px'
                }
            });
            this.body = this.el.insertFirst({
                cls: 'content', 
                style: {
                    position: 'relative',
                    overflow: 'hidden',
                    'margin-left':   btnWPx,
                    'margin-right':  btnWPx
                }
            });
        
            this.rightRepeater = new Ext.util.ClickRepeater(this.rightBtn, {
                interval : this.scrollRepeatInterval,
                handler: this.doScrollLeft,
                scope: this
            });
            this.leftRepeater = new Ext.util.ClickRepeater(this.leftBtn, {
                interval : this.scrollRepeatInterval,
                handler: this.doScrollRight,
                scope: this
            });

        } else {
            throw "Vertical Orientation is not yet implemented.";
        }

        // Calling this will ensure that sizes (w, h) are calculated and set
        // We defer it a little because then we know the correct height
        // since browsers take a while to set the values.
        //this.fitToParentWidth.defer(10, this);
        this.syncSize.defer(10, this);
        // This is needed for FF/Gecko browsers, if the viewport's size
        // is going to change
        this._fixScrollPosition.defer(100, this);

        this.updateScrollButtons.defer(600, this);

    },


    /**
     * Utility to resize this widget's width so that it fits snugly within it's parent.
     * The w, h params from the original event (the ViewPort's w/h) are ignored;
     * We just repair our own width so that it is basically an exact fit of our
     * parent's width (minus the parent's borders, etc).
     * @private
     * @method fitToParentWidth
     */
    fitToParentWidth: function () {
        var containerWidth = this.el.parent().getWidth(true /*Without borders, padding*/);
        // Calling setWidth will fire onResize, which will cause the body's
        // widths to also get properly set.
        
        this.setWidth(containerWidth);
    },


    /**
     * Overrides the original setWidth so that it can fix
     * viewport-specific stuff that needs to be fixed during
     * a resize.
     * @protected
     * @method setWidth
     * @param w {Number} width in pixels
     */
    setWidth: function (w) {
        var wToSet = this.maxWidth ?
                // Why the -1 ? Because FF/Gecko needs it. Setting the full
                // width causes _fixScrollPosition to not work.
                Math.min(this.maxWidth+(this.btnWidth*2)-1, w) : w;
        this.constructor.superclass.setWidth.call(this, wToSet);
        this._fixScrollPosition();
        this.updateScrollButtons();
    },

    
    /*
     * In FF/Gecko at least, this workaround is necessary to prevent
     * the ugly situatio where the viewport grows but it's contents
     * remain scrolled leaving an empty area exposed.
     * @private
     */
    _fixScrollPosition: function () {
        if (!Ext.isIE) {
            this.body.scroll('l', 1, false);
            this.body.scroll('r', 1, false);
        }
    },

    /**
     * @cfg maxWidth {Number} (in pixels) The maximum width to allow when auto-expanding.
     * If unset, then there is no limit.
     */

    /**
     * @private
     * @method doScrollLeft
     * @param e {BrowserEvent}
     * @param el {HTMLElement} The scroll button
     * @param num {Number} The number of units to scroll
     * @param noAnimation {Boolean} true to disable animation (default: false, animate)
     */
    doScrollLeft: function (e, el, num, noAnimation) {
        this._doScroll(e, el, num, 'l', noAnimation);
    },


    /**
     * @private
     * @method doScrollRight
     * @param e {BrowserEvent}
     * @param el {HTMLElement} The scroll button
     * @param num {Number} The number of units to scroll
     * @param noAnimation {Boolean} true to disable animation (default: false, animate)
     */
    doScrollRight: function (e, el, num, noAnimation) {
        this._doScroll(e, el, num, 'r', noAnimation);
    },


    // Private
    _doScroll: function (e, el, num, direction, noAnimation) {
        if (!num) { num = 1; }
        if (this.disabled) { return; }
        this.body.scroll(direction, num * this.getScrollDistance(), !noAnimation);
        this.updateScrollButtons.defer(600, this);
    
    },

    // Protected
    getLayoutTarget: function () {
        return this.body;
    },

    /**
     * Calling this will update the state of the buttons:
     * it will disable a scroll button if it can determine
     * that scrolling in that direction is no longer possible.
     * This only disables the buttons visually (the events
     * will probably fire if the user continues to click on
     * a button even if it is disabled); but this should not
     * be a problem since Ext.Element#scroll does bounds checking.
     * @private
     * @method updateScrollButtons
     */
    updateScrollButtons: function () {
        var scroll = this.body.getScroll();
        var box = this.body.getBox();
        if (this.orientation === 'horizontal') {
            if(scroll.left <= 1) { // Trial-error shows that 1 is better than 0
                this.leftBtn.addClass(this.disabledBtnCls);
            } else {
                this.leftBtn.removeClass(this.disabledBtnCls);
            }
            // Trial-error shows that 1 is better than 0
            if ((scroll.left + box.width +1) >= this.body.dom.scrollWidth) {
                this.rightBtn.addClass(this.disabledBtnCls);
            } else {
                this.rightBtn.removeClass(this.disabledBtnCls);
            }
        } else {
            // TODO
        }
    },

    /**
     * Called by the Ext.Contain#setSize
     * We adjust our body size to the correct amount here.  It needs
     * to have slightly lesser width than the container's width, to
     * account for the bottons.
     * @protected
     * @method onResize
     */
    onResize: function (boxW, boxH, rawW, rawH) {
        var w = (rawW ? rawW : this.el.getComputedWidth()),
            h = (rawH ? rawH : this.el.getComputedHeight());
        w = this.orientation === 'vertical' ? w : w - (this.btnWidth * 2);
        h = this.orientation === 'vertical' ? h - (this.btnWidth * 2) : h;
        this.body.setSize(w, h);
        this.updateScrollButtons();
    },

    getScrollDistance: function () {
        return this.scrollDistance; // TODO: calculate this?
    },

    onEnable: function () {
        this.constructor.superclass.onEnable.call(this);
    },

    onDisable: function () {
        this.constructor.superclass.onDisable.call(this);
    }

});


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


/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern $ DA Element Prototype Ext*/

if (!DA) {
    throw "ERROR: missing DA.js or DA-min.js";
}
if (!DA.cal) {
    DA.cal = {};
}

/**
 * TODO: comments, JSDOC
 * @class DateSelector
 * @extends Ext.BoxComponent
 * @param cfg {Object} Configuration options
 */
DA.cal.DateSelector = Ext.extend(Ext.BoxComponent, {
    lang: 'ja',

	timeStyle: '24h',
    
    yearList: [],

    firstDay: 0,
    
    holidayList: [],

    customDayColorList: [],
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the year field.
     */
    yyNode: null,
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the month field.
     */
    mmNode: null,
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the day field.
     */
    ddNode: null,
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the hour field.
     */
    hhNode: null,
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the minutes field.
     */
    miNode: null,
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the seconds field.
     */
    ssNode: null,
    
    /**
     * @cfg {HTMLElement} Element where the calender object will be rendered.
     */
    calNode: null,
    
    yyId: null,
    
    mmId: null,
    
    ddId: null,
    
    hhId: null,
    
    miId: null,
    
    ssId: null,
    
    yyName: null,
    
    mmName: null,
    
    ddName: null,
    
    hhName: null,
    
    miName: null,
    
    ssName: null,
    
    _calNumber: 0,
    
    _calAId: null,
    
    _calDivId: null,
    
    _calObjectName: null,
    
    yySelector: null,
    
    mmSelector: null,
    
    ddSelector: null,
    
    hhSelector: null,
    
    miSelector: null,
    
    ssSelector: null,
    
    calSelector: null,
    
	lite: false,

	_dayList : {
		'1' : 31,
		'2' : 29,
		'3' : 31,
		'4' : 30,
		'5' : 31,
		'6' : 30,
		'7' : 31,
		'8' : 31,
		'9' : 30,
		'10': 31,
		'11': 30,
		'12': 31
	},
			
	_itemSaver: {
		'28': null,
		'29': null,
		'30': null
	},

    // Protected
    initComponent: function() {
		var caller = this.lite ? 
					function(para) {
						var ret = new DA.cal.DateSelector.PulldownLite(para);
						return ret;
					}
				   :
					function(para) {
						var ret = new Ext.ux.NumberPulldown(para);
						return ret;
					};
		this.constructor.superclass.initComponent.call(this);
        // Hash that contains this instance's value:
        // keys are yy, mm, dd, hh, mi, ss
        this.value = {}; 
        this.addEvents('change');

        var me = this;

        if (me.yyNode) {
            me.yyId = me.yyNode.id;
            me.yyName = me.yyNode.name;
            me.yySelector = caller({
				transform: me.yyNode,
				forceSelection: true,
				width: 55
			});
        }
        if (me.mmNode) {
            me.mmId = me.mmNode.id;
            me.mmName = me.mmNode.name;
            me.mmSelector = caller({
				transform: me.mmNode,
				forceSelection: (me.lang === 'ja') ? true : false,
				width: (me.lang === 'en') ? 48 : 42
            });
        }
        if (me.ddNode) {
            me.ddId = me.ddNode.id;
            me.ddName = me.ddNode.name;
            me.ddSelector = caller({
				transform: me.ddNode,
				forceSelection: true,
				width: 42
            });
        }
        if (me.hhNode) {
            me.hhId = me.hhNode.id;
            me.hhName = me.hhNode.name;
            me.hhSelector = caller({
				transform: me.hhNode,
				forceSelection: (me.timeStyle==="24h") ? true : false,
				width: (me.timeStyle==="24h") ? 42 : 62
            });
        }
        if (me.miNode) {
            me.miId = me.miNode.id;
            me.miName = me.miNode.name;
            me.miSelector = caller({
            	transform: me.miNode,
				forceSelection: true,
				width: 42
			});
        }
        if (me.ssNode) {
            me.ssId = me.ssNode.id;
            me.ssName = me.ssNode.name;
            me.ssSelector = caller({
            	transform: me.ssNode,
				forceSelection: true,
				width: 42
			});
        }
        if (me.calNode && !this.lite) {
            me._calNumber = DA.cal.DateSelector._calNumber ++;
            me._calAId = me._calIdHeader();
            me._calDivId = me._calIdHeader() + '_Id';
            me._calObjectName = 'DA.cal.DateSelector._calObject[' + me._calNumber + ']';
            
            me.calNode.innerHTML = ['<a id="' + me._calAId + '" href="#" onclick="DA.cal.Calendar.fncPopup2(event, ' + me._calObjectName + ', \'' + me._calDivId + '\', \'' + me._calAId + '\', $(\'' + me.yyId + '\').value, $(\'' + me.mmId + '\').value, $(\'' + me.ddId + '\').value);">',
                                    '<img src="' + DA.vars.imgRdir + '/ico_hibiki_calendar.gif" align="absmiddle">',
                                    '</a>',
                                    '&nbsp;&nbsp;<div id="' + me._calDivId + '" style="display:none"></div>'].join("");
            
            me.calSelector = new DA.cal.Calendar(me._calDivId, me._calObjectName, {
                prefix: {
                    year: me.yyName,
                    month: me.mmName,
                    day: me.ddName
                },
                lang: me.lang,
                firstDay: me.firstDay,
                yearList: me.yearList,
                holidayList: me.holidayList,
                customDayColorList: me.customDayColorList
            }, {
                onSet: function(year, month, day) {
                    me.yySelector.setValue(year);
                    // Calling setValue will not fire any events; so we 
                    // must force Ext-JS (The ComboBox) to fire at least
                    // the select event.
                    me.yySelector.fireEvent('select', me.yySelector);
                    
                    me.mmSelector.setValue(month);
                    me.mmSelector.fireEvent('select', me.mmSelector);

                    me.ddSelector.setValue(day);
                    me.ddSelector.fireEvent('select', me.ddSelector);
                },
                onEnable: function() {
                    $(me._calAId).style.display = "";
                },
                onDisable: function() {
                    $(me._calAId).style.display = "none";
                }
            });
            me.calSelector.writeCal2();
            DA.cal.DateSelector._calObject[me._calNumber] = me.calSelector;
            
            me._saveLast3Item();
        }
        
        // Plumbing: (n) 配管工業
        this._setupEventPlumbing();
    },


    /**
     * @private
     * @method _setupEventPlumbing
     */
    _setupEventPlumbing: function () {
        Ext.each(this._fields, function (fldName) {
            var selector = this[fldName+'Selector'];
            if (!selector || !selector.getValue) {
                return;
            }
            // Initialize our value field.
            // FIXME: redundant code
            var v = selector.getValue();
            if (v === '--') {
                delete this.value[fldName];
            } else {
                this.value[fldName] = v;
            }
            
            var handler = function (sel) {
                var val = sel.getValue();
                if (val === '--') {
                    delete this.value[fldName];
                } else {
                    this.value[fldName] = val;
                }
                this.fireEventsIfValid();
            };
            
            var mmHandler = this.lang === 'ja' ? 
                function (sel) {
                    var val = sel.getValue();
                    if (val === '--') {
                        delete this.value[fldName];
                    } else {
                        this.value[fldName] = val;
                    }
                    this.fireEventsIfValid();
                } :
                function (sel) {
                    var val = sel.getValue();
                    val = DA.util.isEmpty(val) ? sel.getText() : val;
                    if (val === '--') {
                        delete this.value[fldName];
                    } else {
                        this.value[fldName] = this._getMonthNumber(val);
                        if (this.value[fldName] === '') {
                            sel.setValue('');
                        }
                    }
                    this.fireEventsIfValid();
                };
            
			var hhHandler = this.timeStyle === '24h' ? 
				function(sel) {
					var val = sel.getValue();
					if (val === '--') {
						delete this.value[fldName];
					} else {
						this.value[fldName] = val;
					}
					this.fireEventsIfValid();
				} : 
				function(sel) {
					var val=sel.getValue();
					val = DA.util.isEmpty(val) ? sel.getText() : val;
					if (val === '--') {
						delete this.value[fldName];
					} else {
						this.value[fldName] = this._getHourNumber(val);
						if (this.value[fldName] === '') {
							sel.setValue('');
						}
					}
					this.fireEventsIfValid();
				};

            selector.on({
                select: (fldName === 'mm') ? mmHandler : 
							((fldName === 'hh') ? hhHandler : handler),
                enable: (fldName === 'mm') ? mmHandler : 
							((fldName === 'hh') ? hhHandler : handler),
                disable: (fldName === 'mm') ? mmHandler : 
							((fldName === 'hh') ? hhHandler : handler),
                blur: (fldName === 'mm') ? mmHandler : 
							((fldName === 'hh') ? hhHandler : handler),
                scope: this
            });

        }, this);
        // Will fire a 'change' event so that listeners may know
        // what the initial state is. 
        // We use defer() to fire this a bit later.
        this.fireEventsIfValid.defer(10, this, []);
    },

    /**
     * Will be initialized durinf initComponent
     * @private
     * @property value {Hash}
     */
    value: null,

    fireEventsIfValid: function () {
        if (this.value.yy && this.value.mm && this.value.dd) {
            if ('undefined' !== typeof this.value.hh && 
                'undefined' === typeof this.value.mi) {
                this.value.mi = 0;
            }
            this.fireEvent('change', this);
        }
    },


    /**
     * @private
     * @property {Array} _fields
     */
    _fields: ['yy', 'mm', 'dd', 'hh', 'mi', 'ss' /*Seconds needed?? */],


    /**
     * Returns the value set in all the fields (yy/mm/dd hh/mi/ss)
     * as an object literal
     * @public
     * @method getValue
     * @return {Object/Hash}
     */
    getValue: function () {
        // Return a copy of our value hash.
        return Ext.apply({}, this.value);
    },

    /**
     * Set the date/time of the selector in one go by passing in an
     * object literal with values for all fields.
     * @public
     * @method setValue
     * @param obj {Object/Hash} object literal vith values for fields yy, mm, dd, hh, mi, ss
     */
    setValue: function (obj) {
        var method;
        var selector;
        for (var fldName in obj) {
            selector = this[fldName+'Selector'];
            if (!selector || !selector.setValue) { continue; }
            selector.setValue(obj[fldName]);
            // We also need to update our value field
            this.value[fldName] = obj[fldName];
        }
    },

    
    enableYY: function() {
        if (this.yySelector) {
            this.yySelector.enable();
        }
    },
    
    enableMM: function() {
        if (this.mmSelector) {
            this.mmSelector.enable();
        }
    },
    
    enableDD: function() {
        if (this.ddSelector) {
            this.ddSelector.enable();
        }
    },
    
    enableHH: function() {
        if (this.hhSelector) {
            this.hhSelector.enable();
        }
    },
    
    enableMI: function() {
        if (this.miSelector) {
            this.miSelector.enable();
        }
    },
    
    enableSS: function() {
        if (this.ssSelector) {
            this.ssSelector.enable();
        }
    },
    
    enableDate: function() {
        this.enableYY();
        this.enableMM();
        this.enableDD();
        if (this.calSelector) {
            this.calSelector.enable();
        }
    },
    
    enableTime: function() {
        this.enableHH();
        this.enableMI();
        this.enableSS();
    },
    
    enableAll: function() {
        this.enableDate();
        this.enableTime();
        if (this.calSelector) {
            this.calSelector.enable();
        }
    },

    disableYY: function() {
        if (this.yySelector) {
            this.yySelector.disable();
        }
    },
    
    disableMM: function() {
        if (this.mmSelector) {
            this.mmSelector.disable();
        }
    },
    
    disableDD: function() {
        if (this.ddSelector) {
            this.ddSelector.disable();
        }
    },
    
    disableHH: function() {
        if (this.hhSelector) {
            this.hhSelector.disable();
//          this.hhSelector.setValue('--');
        }
    },
    
    disableMI: function() {
        if (this.miSelector) {
            this.miSelector.disable();
//          this.miSelector.setValue('--');
        }
    },
    
    disableSS: function() {
        if (this.ssSelector) {
            this.ssSelector.disable();
//          this.ssSelector.setValue('--');
        }
    },
    
    disableDate: function() {
        this.disableYY();
        this.disableMM();
        this.disableDD();
        if (this.calSelector) {
            this.calSelector.disable();
        }
    },
    
    disableTime: function() {
        this.disableHH();
        this.disableMI();
        this.disableSS();
    },
    
    disableAll: function() {
        this.disableDate();
        this.disableTime();
        if (this.calSelector) {
            this.calSelector.disable();
        }
    },
    
    resetYY: function() {
        if (this.yySelector) {
            this.yySelector.setValue('--');
        }
    },
    
    resetMM: function() {
        if (this.mmSelector) {
            this.mmSelector.setValue('--');
        }
    },
    
    resetDD: function() {
        if (this.ddSelector) {
            this.ddSelector.setValue('--');
        }
    },
    
    resetHH: function() {
        if (this.hhSelector) {
            this.hhSelector.setValue('--');
        }
    },
    
    resetMI: function() {
        if (this.miSelector) {
            this.miSelector.setValue('--');
        }
    },
    
    resetSS: function() {
        if (this.ssSelector) {
            this.ssSelector.setValue('--');
        }
    },
    
    resetDate: function() {
        this.resetYY();
        this.resetMM();
        this.resetDD();
    },
    
    resetTime: function() {
        this.resetHH();
        this.resetMI();
        this.resetSS();
    },
    
    resetAll: function() {
        this.resetDate();
        this.resetTime();
    },
    
    syncYY: function() {
        if (this.yySelector) {
            if (this.yySelector.getText() !== this.yySelector.getValue()) {
                this.yySelector.setValue(this.yySelector.getText());
            }
        }
    },
    
    syncMM: function() {
        if (this.mmSelector) {
            if (this.mmSelector.getText() !== this.mmSelector.getValue()) {
                this.mmSelector.setValue(this.mmSelector.getText());
            }
        }
    },
    
    syncDD: function() {
        if (this.ddSelector) {
            if (this.ddSelector.getText() !== this.ddSelector.getValue()) {
                this.ddSelector.setValue(this.ddSelector.getText());
            }
        }
    },
    
    syncHH: function() {
        if (this.hhSelector) {
            if (this.hhSelector.getText() !== this.hhSelector.getValue()) {
                this.hhSelector.setValue(this.hhSelector.getText());
            }
        }
    },
    
    syncMI: function() {
        if (this.miSelector) {
            if (this.miSelector.getText() !== this.miSelector.getValue()) {
                this.miSelector.setValue(this.miSelector.getText());
            }
        }
    },
    
    syncSS: function() {
        if (this.ssSelector) {
            if (this.ssSelector.getText() !== this.ssSelector.getValue()) {
                this.ssSelector.setValue(this.ssSelector.getText());
            }
        }
    },
    
    syncDate: function() {
        this.syncYY();
        this.syncMM();
        this.syncDD();
    },
    
    syncTime: function() {
        this.syncHH();
        this.syncMI();
        this.syncSS();
    },
    
    syncAll: function() {
        this.syncDate();
        this.syncTime();
    },
    
    updateDayList: function(date) {
		var i;
		var year = Number(date.yy);
		var month = Number(date.mm);
		if (month === 0) {
			return;
		}
		
		var day = this._dayList[String(month)];
		if (month === 2  && year) {
			day = new Date(year, month, 0).getDate();
		}
		var length = this.ddSelector.getPulldownLength();
		if (day < length) {
			if (date.dd > day) {
				this.ddSelector.setValue(day);
			}
			this.ddSelector.removeItem(day, length - 1);
		} else if (day > length) {
			for (i = length; i < day; i++) {
				this.ddSelector.addItem(this._itemSaver[i]);
			}
		}
		if (date.dd > day) {
			date.dd = day;
		}

		return date.dd;
    },
    
    _saveLast3Item: function() {
    	for (var i = 30; i >= 28; i--) {
    		this._itemSaver[String(i)] = this.ddSelector.getItem(i);
    	}
    },    
    
    _calIdHeader: function() {
        return 'DACalendar_' + this._calNumber;
    },
    
    _getMonthNumber: function(mon) {
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

	_getHourNumber: function(hour) {
		var hh;
		switch(hour + '') {
			case '00':
			case '12 AM': hh = '00'; break;
			case '01':
			case '01 AM': hh = '01'; break;
			case '02':
			case '02 AM': hh = '02'; break;
			case '03':
			case '03 AM': hh = '03'; break;
			case '04':
			case '04 AM': hh = '04'; break;
			case '05':
			case '05 AM': hh = '05'; break;
			case '06':
			case '06 AM': hh = '06'; break;
			case '07':
			case '07 AM': hh = '07'; break;
			case '08':
			case '08 AM': hh = '08'; break;
			case '09':
			case '09 AM': hh = '09'; break;
			case '10':
			case '10 AM': hh = '10'; break;
			case '11':
			case '11 AM': hh = '11'; break;
			case '12':
			case '12 PM': hh = '12'; break;
			case '13':
			case '01 PM': hh = '13'; break;
			case '14':
			case '02 PM': hh = '14'; break;
			case '15':
			case '03 PM': hh = '15'; break;
			case '16':
			case '04 PM': hh = '16'; break;
			case '17':
			case '05 PM': hh = '17'; break;
			case '18':
			case '06 PM': hh = '18'; break;
			case '19':
			case '07 PM': hh = '19'; break;
			case '20':
			case '08 PM': hh = '20'; break;
			case '21':
			case '09 PM': hh = '21'; break;
			case '22':
			case '10 PM': hh = '22'; break;
			case '23':
			case '11 PM': hh = '23'; break;
			default: hh = '--';
		}
		return (hh);
	}
});

DA.cal.DateSelector.PulldownLite = function(pa) {
	Ext.apply(this, pa);
	if(!this.transform) {
		throw "ERROR: Bad args: PulldownLite needs { transform: HTMLSELECTElement }";
	}
	this.el = $(this.transform);
	this.addEvents({
					select: true,
					enable: true,
					disable: true,
					blur: true
	});
	this._setupEventPlumbing();
};

Ext.extend(DA.cal.DateSelector.PulldownLite,
		   Ext.util.Observable,
		   {
			setValue: function(val) {
				var nVal = parseInt(val, 10);
				var result;
				if(isFinite(nVal)) {
					result = (nVal < 10) ? ('0' + nVal) : ('' + nVal);
				} else {
					result = '--';
				}
				this.el.value = result;
				if(!this.el.value) {
					this.el.value = '--';
				}
			},
			getValue: function() {
				return this.el.value;
			},
			getText: function() {
				return this.el.value;
			},
			enable: function() {
				this.el.disabled = false;
//				this.fireEvent('enable', this);
			},
			disable: function() {
				this.el.disabled = true;
//				this.fireEvent('disable', this);
			},
			isDisable:function(){
				return this.el.disabled;
			},
			_setupEventPlumbing: function() {
				var el = Ext.get(this.el);
				el.on('change', 
					  function(eve) {
					      this.fireEvent('select', this);
					  },
					  this);
				el.on('blur',
					  function(eve) {
						  this.fireEvent('blur', this);
					  },
					  this);
			}
		}
);

DA.cal.DateSelector._calNumber = 0;

DA.cal.DateSelector._calObject = [];

/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern $ DA Element Prototype Ext*/

if (!DA) {
    throw "ERROR: missing DA.js or DA-min.js";
}
if (!DA.cal || !DA.cal.DateSelector) {
    throw "ERROR: missing common/calender/selector.js";
}

/**
 * A Composite widget that combines 2 DateSelector objects
 * to provide a date/time range selector.
 * @class DateRangeSelector
 * @extends Ext.Component
 * @param cfg {Object} Configuration options
 */
DA.cal.DateRangeSelector = Ext.extend(Ext.Component, {

    startConfig: {},

    endConfig: {},

    commonConfig: {},

    // Protected
    initComponent: function () {
        this.constructor.superclass.initComponent.call(this);
        this.addEvents(
            'change',
            'enabled',
            'disabled');

        // Create our 2 sub-widgets
        var startOptions = Ext.apply({}, this.startConfig, this.commonConfig);
        var endOptions = Ext.apply({}, this.endConfig, this.commonConfig);

        this.startDateSelector = new DA.cal.DateSelector(startOptions);
        this.endDateSelector = new DA.cal.DateSelector(endOptions);
        
        // Plumbing: (n) 配管工業
        this._setupEventPlumbing();
    },

    _setupEventPlumbing: function () {
        this.startDateSelector.on('change', this._handleOnStartDateChange, this);
        this.endDateSelector.on('change', this._handleOnEndDateChange, this);
    },

    _handleOnStartDateChange: function () {
        DA.customEvent.fire('dateRangeSelectorOnStartDateChangeBefore', this);
        this._handleCommonOnChange();
    },

    _handleOnEndDateChange: function () {
        DA.customEvent.fire('dateRangeSelectorOnEndDateChangeBefore', this);
        this._handleCommonOnChange();
    },

    _handleCommonOnChange: function () {
		var newDay;
        var day;
        var date = this.getValue();
        if (!this.startConfig.lite && !this.endConfig.lite) {
        	newDay = this._updateSelList(date.start, date.end);
        	date.start.dd = newDay.startDay;
        	date.end.dd = newDay.endDay;
		} else {
			day = new Date(date.start.yy, date.start.mm, 0).getDate();
			if (date.start.dd > day) {
				date.start.dd = day;
			}
			day = new Date(date.end.yy, date.end.mm, 0).getDate();
			if (date.end.dd > day) {
				date.end.dd = day;
			}
		}
		date.end.mi = this._checkEndHH(date.end);
        
        // TODO: Cache previous results, and fire the event
        //       only if the current values differ
        this.fireEvent('change', date.start, date.end);
    },
    
    changeWithoutFireEvent: function () {
        var date = this.getValue();
		this._checkEndHH(date.end);
    },
    
    _checkEndHH: function (endTime) {
    	var endHH = String(endTime.hh);
    	var endMI = String(endTime.mi);
    	if (!this.startConfig.lite && !this.endConfig.lite) {
			if (endHH === "24") {
				this.endDateSelector.miSelector.setValue("00");
				this.endDateSelector.miSelector.setDisable(true);
				this.endDateSelector.miSelector.setEditable(false);
				endMI = 0;
			} else if (endHH === "undefined" || endHH === "--") {
				this.endDateSelector.miSelector.setValue("--");
				this.endDateSelector.miSelector.setDisable(true);
				this.endDateSelector.miSelector.setEditable(false);
				endMI = 0;
			} else {
				if (!this.endDateSelector.hhSelector.isDisable()) {
					this.endDateSelector.miSelector.setDisable(false);
					this.endDateSelector.miSelector.setEditable(true);
				}
			}
    	} else {
    		if (endHH === "24") {
				this.endDateSelector.miSelector.setValue("00");
				this.endDateSelector.miSelector.disable();
				endMI = 0;
			} else if (endHH === "undefined" || endHH === "--") {
				this.endDateSelector.miSelector.setValue("--");
				this.endDateSelector.miSelector.disable();
				endMI = 0;
			} else {
				if (!this.endDateSelector.hhSelector.isDisable()) {
					this.endDateSelector.miSelector.enable();
				}
			}
    	}
    	return endMI;
    },

    setValue: function (start, end, fireEvents) {
        this.startDateSelector.setValue(start || {});
        this.endDateSelector.setValue(end || {});
        if (fireEvents === true) {
            this._handleCommonOnChange();
        }
    },
    
	getValue: function () {
		var startVal = this.startDateSelector.getValue();
        var endVal = this.endDateSelector.getValue();
        return ({
        	start: startVal,
        	end: endVal
        });
	},
	
    _updateSelList: function (start, end) {
    	start.dd = this.startDateSelector.updateDayList(start);
    	end.dd = this.endDateSelector.updateDayList(end);
    	return ({
        	startDay: start.dd,
        	endDay: end.dd
        });
    }

    // The following methods are autogenerated:

    /**
     * @public
     * @method enableStartDate
     */
    /**
     * @public
     * @method enableStartTime
     */
    /**
     * @public
     * @method enableEndDate
     */
    /**
     * @public
     * @method enableEndTime
     */
    /**
     * @public
     * @method disableStartDate
     */
    /**
     * @public
     * @method disableStartTime
     */
    /**
     * @public
     * @method disableEndDate
     */
    /**
     * @public
     * @method disableEndTime
     */

    /**
     * @public
     * @method enableDate
     */
    /**
     * @public
     * @method enableTime
     */
    /**
     * @public
     * @method disableDate
     */
    /**
     * @public
     * @method disableTime
     */


});

// Dynamically generate methods:
// DA.cal.DateRangeSelector.prototype.
//   {enable|disable}{Start|End}{Date|Time}
(function () {
    
var verbs = ['enable', 'disable'];
var adjectives = ['Start', 'End'];
var nouns = ['Date', 'Time'];

var proto = DA.cal.DateRangeSelector.prototype;

verbs.each(function (verb) {
    adjectives.each(function (adjective) {
        nouns.each(function (noun) {
            var method = verb + adjective + noun;
            var selectorName = adjective.charAt(0).toLowerCase() + 
                    adjective.substr(1) + 'DateSelector';
            // Generate methods:
            /* DA.cal.DateRangeSelector.prototype.{enable|disable}{Start|End}{Date|Time}
             *   = function () {
             *      var selector = this.{start|end}DateSelector;
             *      var f = selector.{enable|disable}{Time|Date};
             *      // ...
             *   };
             */
            proto[method] = function () {
                var selector = this[selectorName];
                if (!selector) { return; }
                var f = selector[verb+noun];
                // f is a reference to {enable|disable}{Date|Time}
                if (f) { 
                    f.call(selector);
                    // fire an event: "enable"+"d",  or "disable"+"d"
                    this.fireEvent(verb+'d', adjective, noun);
                }
            };
            // Generate wrapper methods:
            /* DA.cal.DateRangeSelector.prototype.{enable|disable}{Date|Time}
             */ 
            proto[verb+noun] = function () {
                var f = this[verb+'Start'+noun];
                if (f) { f.call(this); }
                f = this[verb+'End'+noun];
                if (f) { f.call(this); }
            };
        });
    });
});


})();

/* $Id: mboxgrid.js 1622 2008-06-16 07:38:27Z faiz_kazi $ -- $HeadURL: http://yuki/svn/iseria/insuite-ui/trunk/src/mailer/mboxgrid/mboxgrid.js $ */
/*for JSLINT undef checks*/
/*extern Ext DA */ 
/*
Copyright (c) 2008, DreamArts. All rights reserved.
*/

/*
 * TODO: in dragSelection mode, onMouseDown needs to be discarded if within
 *       the slider?
 */

/**
 * @class DA.widget.TimeRangeSlider
 * @extends Ext.BoxComponent
 * A range-slider implementation that allows the user to select a time range.
 * Uses a third-party extension: Ext.ux.SlideZone: http://www.jaredgisin.com/software/Ext.ux.SlideZone/
 * @constructor
 * Create a time-range slider object.
 * @param {Object} config The config object
 */
DA.widget.TimeRangeSlider = Ext.extend(Ext.BoxComponent, {

    /**
     * Maximum precision for selectable times, expressed
     * in minutes.  The default is 5 minutes.
     * @cfg {Number} resolution
     */
    resolution: 5, // 5 mins

    /**
     * By default, 1 pixel represents one minumum unit of resolution
     * (1px => 5 minutes). Setting this to a number will allocate that many
     * pixels for each unit of resolution, while making the entire slidezone
     * larger by the same amount.
     * @cfg {Number} scale
     */
    scale: 1,

    // FIXME: hardcoding
    /**
     * @cfg {Number} initialMin
     */
    initialMin: 0,

    /**
     * @cfg {Number} initialMax
     */
    initialMax: 0,

    /**
     * @cfg {Number} minValue
     */
    minValue: 0,

    /**
     * @cfg {Number} maxValue
     */
    maxValue: 24,

    /**
     * The precision, expressed in hours, of the approximation
     * to use for dragSelection. Setting it to 0.5
     * (the default value) will cause the range to always start
     * from a half-hour increment.
     * Only meaningful when dragSelection is TRUE.
     * NOTE: Sou Jr.'s idea
     * @cfg {Number} warpSnap
     */
    warpSnap: 0.5,

    /**
     * @cfg {String} orientation
     */
    orientation: 'horizontal',

    // protected
    initComponent: function () {
        this.constructor.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event change
             * Fires when the range values change
             * @param {Object} from - Object literal, with HH, MM fields.
             * @param {Object} tos- Object literal, with HH, MM fields.
             */
            'change');
        this.scale = parseInt(this.scale, 10);
        this.resolution = parseInt(this.resolution, 10);
    },

    /**
     * A crude mapping mechanism that helps in setting the 
     * CSS background classname
     * @private
     * @type {Object|Hash} values are functions.
     */
    _bgClasses: {
        'bg-08hto20h': function (s) {
            return s.minValue === 8 &&
                s.maxValue === 20 &&
                    (s.resolution / s.scale === 5/2);
        },
        'bg-08hto20h-scale2': function (s) {
            return s.minValue === 8 &&
                s.maxValue === 20 &&
                    (s.resolution / s.scale === 5/4);
        },
        'bg-24h': function (s) {
            return s.minValue === 0 &&
                s.maxValue === 24 &&
                    (s.resolution / s.scale === 5);
        },
        'bg-24h-scale2': function (s) {
            return s.minValue === 0 &&
                s.maxValue === 24 &&
                    (s.resolution / s.scale === 5/2);
        },
        'bg-24h-scale3': function (s) {
            // FIXME
            return (s.maxValue - s.minValue === 24) &&
                    (s.resolution / s.scale === 5/3);
        }

    },
    
    /**
     * HALF the width (or height, when in vertical orientation) of the
     * resize handle (日本語: 矢印の幅)
     * FIXME: This should not be hard-coded
     * NOTE: 'width' is a misnomer. In vertical orientation, this
     *       means the height of the resize handle.
     * @property halfHandleWidth
     * @type {Number}
     */
    halfHandleWidth: 0,


    /**
     * @protected
     * @param ct TODO
     */
    onRender: function (ct, pos) {
        // TODO: Need to check ct?
        var range = this.maxValue - this.minValue;
        var sizeInPixels = (range * (60/this.resolution) * this.scale);

        this.el = ct.createChild({
            id: this.id,
            cls: 'timerangeslider'
        }, pos);

        this.slideZone = new Ext.ux.SlideZone(this.el.dom, { 
            type: this.orientation, 
            size: sizeInPixels, 
            sliderHeight: 24, 
            maxValue: this.maxValue, 
            minValue: this.minValue, 
            sliderSnap: [Math.max(1,this.scale), Math.max(1, this.scale)]
        });

        this._doHalfHandleStuff();

        // We want to allow setting out-of-range values as well.
        // In this case, the slider must appear hidden.
        this.slideZone.el.setStyle('overflow', 'hidden');

        for (var cn in this._bgClasses) {
            if (this._bgClasses[cn](this)) {
                this.el.addClass(cn + 
                    (this.orientation === 'vertical' ? '-v' : ''));
            }
        }
        this.rangeSlider = new Ext.ux.RangeSlider({
            value: [this.initialMin, this.initialMax],
            name: '24H'
        });

        this.slideZone.add(this.rangeSlider);

        // Set the minimum width to correspod to 30 minutes 
        // (For example, if we use scale=3, res=5, 30 mins => 18px)
        // This is necessary because SlideZone hard-codes the minWidth 
        // to 20px
        this.rangeSlider.resizable.minWidth = (30 * this.scale) / this.resolution;

        // Apply overrides to the SlideZone objects so it
        // works better for us
        this._slideZoneFixes();

        // We use a spreadsheet-like drag-select mode
        this._setupDragSelection();

        this._setupEventPlumbing();
        //this.setValues.defer(10, this, [this.initialMin, this.initialMax]);
    },


    _doHalfHandleStuff: function () {
        if (this.orientation === 'vertical') {
            this.el.setHeight(this.slideZone.el.getHeight() + (2*this.halfHandleWidth));
            this.slideZone.el.setStyle({top: this.halfHandleWidth+"px"});
        } else {
            this.el.setWidth(this.slideZone.el.getWidth() + (2*this.halfHandleWidth));
            this.slideZone.el.setStyle({left: this.halfHandleWidth+"px"});
        } 
    },

    
    /**
     * PRIVATE init-time method that overrides the behavior of
     * some parts of the SlideZone object. This currenty applies
     * 3 fixes:
     *   (1) During resizing (the rangeSlider), the Event object
     *       is passed to the drag event.
     *   (2) When the rangeSlider is dragged, the Event object
     *       is passed on to the drag event.
     *   (3) The method updateValues does not do any bounds
     *       checking, We override it and check against
     *       minValue and maxValue
     * @private
     * @method _slideZoneFixes
     */
    _slideZoneFixes: function () {
        var zone = this.slideZone;
        var rs = this.rangeSlider;
        
        // (1)
        rs.resizable.onMouseMove = function (e) {
            var box = this.constrainTo.getRegion(), tgt = e.getXY();
            //redefine the constraining box if slider crossing resrictions
            if(!zone.allowSliderCrossing) {
                if( zone.type === 'vertical') {
                        box = {left:   box.left,  right:  box.right,
                               top:    this.startBox.y - this.leftTravel[0],
                               bottom: this.startBox.y + this.startBox.height + this.rightTravel[0] };
                }
                if( zone.type === 'horizontal') {
                        box = {left:   this.startBox.x - this.leftTravel[0],
                               right:  this.startBox.x + this.startBox.width + this.rightTravel[0],
                               top:    box.top, bottom: box.bottom };
                }
            }

            e.xy = [
                tgt[0] - box.left < 0 ? box.left - this.startBox.x + this.startPoint[0] : 
                    tgt[0] - box.right > 0 ? box.right - this.startBox.right + this.startPoint[0] : 
                        tgt[0],
                tgt[1] - box.top < 0 ? box.top - this.startBox.y + this.startPoint[1] : 
                    tgt[1] - box.bottom > 0 ? box.bottom - this.startBox.bottom + this.startPoint[1] : 
                        tgt[1]
            ];
            
            Ext.Resizable.prototype.onMouseMove.call(this, e);
            zone.updateValues();
            rs.fireEvent('drag', rs, e);
        };

        // (2)
        // The original updateValues does not do bounds checking. We
        // override it, and calling the original updateValues we 
        // do bounds checks and correct values if needed.
        var minValue = this.minValue;
        var maxValue = this.maxValue;
        zone.updateValues = function () {
            Ext.ux.SlideZone.prototype.updateValues.call(this);
            rs.value[0] = Math.max(minValue, rs.value[0]);
            rs.value[1] = Math.min(maxValue, rs.value[1]);
        };

        // (3)
        rs.ddEl.onDrag = function (e) {
			zone.updateValues();
			rs.fireEvent('drag', rs, e);
        };
        rs.pointer = 'move';

    },



    /**
     * エクセル見たいな動作を指定する
     * Setup a spreadsheet-like mode for selection a time span:
     *   - mousedown will move the range to the point where the
     *     mousedown occured
     *   - draging will elongate/shrink the selection range
     * @private
     * @method _setupDragSelection
     */
    _setupDragSelection: function () {
        var me = this;
        var rs = this.rangeSlider;
        var zone = this.slideZone;
        var ddZone = new Ext.dd.DragDrop(this.slideZone.el);
        var startPos, maxPos, /* Pixel positions, start (onmousedown) and max allowed*/
            getMaxPos, /*function*/
            getPageFn, resizeTo /*function*/, fixed, XorY;

        // Snap approximation must be done manually, because calling
        // Ext.Resizable's resizeTo(w, h) method does not respect
        // snapping.
        var snap = zone.sliderSnap[0]; // [0] === [1] any value will do

        /* Calculate the snap required for spreadsheet-like drag-selection
         * エクセル見たいドラッグ＆セレクトモードの「snap」ピクセルの計算
         *
         * If this.resolution is in minutes, then snap is the number of
         * pixels required.  Therefore, if this.warpSnap is the number
         * of HOURS to allow snapping during spreadsheet-like selection,
         * we can calculate a snap for it as well.
         *
         * this.resolution      -->     snap
         *
         * 30 mins = (60 * this.warpSnap) // Sou Jr. Suggestion;
         * 
         * (60 * this.warpSnap) -->     spreadsheetSpan
         *
         * spreadsheetSpan  =  (60 * this.warpSnap)      snap
         *                     --------------------  X 
         *                     this.resolution
         */
        var spreadsheetSpan = (60 * this.warpSnap * snap) / this.resolution;

        // The following function will be called to snap the arguments to resizeTo.
        var snapped = function (x) {
            return x - (x % spreadsheetSpan) + spreadsheetSpan;
        };


        if (this.orientation === 'vertical') {
            fixed = rs.resizable.el.getWidth();
            getPageFn = 'getPageY';
            resizeTo = function (h) {
                h = snapped(h);
                rs.resizable.resizeTo(fixed, h);
            };
            XorY = 1;
            getMaxPos = function () {
                return zone.el.getBottom();
            };
        } else {
            fixed = rs.resizable.el.getHeight();
            getPageFn = 'getPageX';
            resizeTo = function (w) {
                w = snapped(w);
                rs.resizable.resizeTo(w, fixed);
            };
            getMaxPos = function () {
                return zone.el.getRight();
            };
            XorY = 0;
        }

        var sliderInstancePointer;  // Will save the value of rs.pointer

        // On mousedown, do 2 things:
        //   1. Warp the range's position to start where the click occured.
        //   2. Re-adjust the position so that it falls at an apporximate
        //      value instead of an exact value (such as 10:30, instead of 10:47)
        ddZone.onMouseDown = function (e) {
            startPos = e.xy[XorY];
            maxPos = getMaxPos();
            rs.setPosition([startPos]);
            zone.updateValues();
            var value = me.getValues();
            // Default value of me.warpSnap is 0.5 (30 mins)
            var extraPrecision = value[0] % me.warpSnap;
            var from = value[0] - extraPrecision;
            var to = value[1] - extraPrecision;
            if (from === to) {
                to += me.warpSnap;
            }
            var diff = to - from;
            if (to >= me.maxValue) {
                from = me.maxValue - diff;
                to = me.maxValue;
            }
            me._setValues(from, to, e);
            // Suggestion from Sou Jr.: choose the
            // nearest 30min interval as the start
            startPos = rs.getPosition()[XorY];
            rs.fireEvent('dragstart', rs, e);
            // The following lines make the cursor appear uniform
            // (i.e., not flickering between 'move' and 'w-resize')
            zone.el.addClass('spreadsheet-mode');
            sliderInstancePointer = rs.pointer; // Save the original value
            rs.pointer = 'w-resize';
        };
        // On dragging, simply adjust the range (change it's height/width,
        // depending on it's orientation)
        ddZone.onDrag = function (e) {
            var pos = e.xy[XorY];
            var hOrW = pos - startPos;
            if (hOrW < 0) { // going back? no
                return;
            }
            if (pos >= maxPos) {
                return;
            }
            resizeTo(hOrW); // SlideZone will fire a 'dragend'! See below.
            zone.updateValues();
            /* TODO: We need to fire dragstart during onDrag. That
             *       seems silly, but iit is necessary because of 
             *       the way things are implemented in SlideZone:
             *       - SlideZone fires the 'dragend' event whenever
             *         the resizable element fires a resize event. 
             *       - We simply re-fire a 'dragstart' event.
             *       - This is helpful in at least one place:
             *         TimeRangeSliderTip depends on dragstart/dragend
             *         to figure out when to show/hide itself, and
             *         if we do not re-fire dragstart, then the tooltip
             *         disappears prematurely.
             */
            rs.fireEvent('dragstart', rs);
            rs.fireEvent('drag', rs, e);
        };
        // Not sure why we really need a mouseup handler: all it does
        // (that ondrag does not) is call zone.updateConstraints()
        ddZone.onMouseUp = function (e) {
            zone.updateConstraints();
            zone.updateValues();
            rs.fireEvent('dragend', rs);
            zone.el.removeClass('spreadsheet-mode');
            rs.pointer = sliderInstancePointer; // Reset to original
        };

        this.ddZone = ddZone;
    },


    // private
    _setupEventPlumbing: function () {
        this.rangeSlider.on('drag', function(slider, e) {
            var value = slider.value;
            this.fireEvent(
                'change', 
                this.toHHMM(value[0]), 
                this.toHHMM(value[1]),
                e);
        }, this);
        // The only possible timing in which to invoke _fixLimits
        this.el.on('mouseover', this._fixLimits, this);
    },

    
    /**
     * PRIVATE METHOD that is needed as a workaround to a limitation
     * in the original SlideZone (Version: 93 2007-12-12) implementation:
     * Needed because:
     *   1. Many calculations that take place in SlideZone depend on
     *      precomputed X/Y base offsets that are stored in el.lowLimit,
     *      el.highLimit.
     *   2. These values are ONLY set during init time. Which means that
     *      when the zone changes position, these must be updated, but
     *      they aren't
     * Calling this._fixLimits will recalculate and set correct values
     * for highLimit, lowLimit.
     * @method _fixLimits
     * @private
     */
    _fixLimits: function () {
        var el = this.slideZone.el;
		switch(this.orientation) {
    		case 'horizontal':
				el.lowLimit = [el.getX()];
				el.highLimit = [el.getRight()];
				break;
			case 'vertical':
				el.lowLimit = [el.getY()];
				el.highLimit = [el.getBottom()];
				break;
			case 'area':
				el.lowLimit = el.getXY();
				el.highLimit = [el.getRight(), el.getBottom()];
				break;
		}
        this.updateConstraints();
    },

    /**
     * Our own updateConstraints method, that simply calls out
     * to this.slideZone.updateConstraints() and also resets
     * and applies correct constraints to ddZone, the drag-drop
     * element that allows dragSelection.
     * @private 
     * @method updateConstraints
     */
    updateConstraints: function () {
        this.slideZone.updateConstraints();
        var rsDdEl = this.rangeSlider.ddEl;
        this.ddZone.resetConstraints();
        if (this.orientation === 'vertical') {
            this.ddZone.setYConstraint(
                rsDdEl.topConstraint,
                rsDdEl.bottomConstraint,
                rsDdEl.yTickSize);
        } else {
            this.ddZone.setXConstraint(
                rsDdEl.leftConstraint,
                rsDdEl.rightConstraint,
                rsDdEl.xTickSize);
        }
    },



    /**
     * @public
     * @method setValues
     * @param min {Number} hours, in decimal format (Ex: 10.25 => 10:15)
     * @param min {Object} hours and minutes, in an object literal ( {HH:10, MM:15} )
     * @param max {Number} The maximum value.
     * @param max {Object} expressed as an object.
     */
    setValues: function (min, max) {
        this._setValues(min, max, null /*no event*/);
    },


    /**
     * @private
     * @method _roundTo4Dec
     * @param n {Number}
     * @return {Number}
     */
    _roundTo4Dec: function (n) {
        if (!n) { return 0; }
        var str = Number(n).toFixed(4);
        return parseFloat(str, 10);
    },


    // Private
    _setValues: function (min, max, e) {
        if (this.disabled) {
            return;
        }
        var rs = this.rangeSlider;
        var zone = this.slideZone;
        min = (typeof min === 'number') ? min : this.fromHHMM(min);
        max = (typeof max === 'number') ? max : this.fromHHMM(max);
        /* min          max     result      comments
         * ===          ===     ======      ========
         * --           --      0,0         do not show anything
         * 06           --      6,24        end defaults to 24 (maxValue)
         * --           20      0,20        start defaults to 0
         * 07           19      7,19        normal 
         * ----------------------------
         * for any of the above values, isFinite() can tell us if
         * a valid number is available or not.
         */
        if (isFinite(min) || isFinite(max)) {
            // Atleast 1 of max/min is available.
            max = isFinite(max) ? max : this.maxValue;
            min = isFinite(min) ? min : this.minValue;
        } else {
            // do not show anything.
            min = max = 0;
        }
        
        // It's a good idea to round of to about 4 decimal places:
        // 15.4999999 -> 15:29  // WRONG!
        // This ensures that values are rounded off sanely.
        min = this._roundTo4Dec(min);
        max = this._roundTo4Dec(max);

        rs.value = [ min, max ];

        var w, h, dim;
        if (this.orientation === 'vertical') {
            h = this._valueToPx(max - min);
            w = rs.resizable.el.getWidth();
            dim = 'y';
        } else {
            w = this._valueToPx(max - min);
            h = rs.resizable.el.getHeight();
            dim = 'x';
        }
        var posPx = zone.getBox()[dim] + this._valueToPx(min - this.minValue);
        // Math.round needed because 10.9 pixels must be considered 11 pixels
        posPx = Math.round(posPx);
        rs.setPosition([posPx]);
        rs.resizable.resizeTo(w, h);
        zone.updateConstraints();
        zone.updateValues();
        // If Event information is not available, then that means 
        // the drag has been triggered by code calling the 
        // public setValues method, and not by user interaction.
        if (e) {
            rs.fireEvent('drag', rs, e);
        }
    },

    /**
     * Returns the currently set values as an array of 2 numbers.
     * @public
     * @method getValues
     * @return {Array}
     */
    getValues: function () {
        return this.rangeSlider.value;
    },


    /**
     * Converts a value to it's equivalent size in pixels
     * TODO: Do we need to factor in this.scale as well?
     * @private
     * @method _valueToPx
     * @param n {Number}
     * @return {Number} pixels
     */
    _valueToPx: function (n) {
        var zone = this.slideZone;
        var w = n / (zone.maxValue - zone.minValue) * zone.size;
        return w;
    },


    /**
     * @private
     * @method _HHMMStringToObj
     * @param sHHMM {String}
     */
    _HHMMStringToObj: function (sHHMM) {
         if (!sHHMM) { return null; }
         var matched = sHHMM.match( /^(\d{1,2}):(\d{1,2})$/ );
         if (matched && matched.length === 3) {
            return {
                HH: parseInt(matched[1], 10),
                MM: parseInt(matched[2], 10)
            };
         } else {
            return null;
         }
    },

    /**
     * @public
     * @method fromHHMM
     * @param hours {String}
     * @param hours {Object}
     * @return {Number}
     */
    fromHHMM: function (hours) {
        var o = typeof hours === 'object' ? hours :
            this._HHMMStringToObj(hours);
        if (!o) { return null; }
        var hh = parseInt(o.HH, 10);
        var mm = parseInt(o.MM, 10);
        // Only if the minutes are not specified, treat them
        // as 0.
        mm = isFinite(mm) ? mm : 0;
        // If hours (HH,hh) are not specified, the results
        // are undefined. It is the job of the caller to
        // handle the situation.
        return hh + (mm / 60);
    },

    /**
     * @method toHHMM
     * @public
     * @param nHoursFloat {Number}
     * @return {Object}
     */
    toHHMM: function (nHoursFloat) {
        var hh = Math.floor(nHoursFloat);
        var mm = Number((nHoursFloat % 1)*60);
        //mm = Math.round(mm);
        mm = Math.round(mm/5)*5; 
        if (mm >= 60) {
            hh += Math.floor(mm/60);
            mm = mm % 60;
        }
        return { HH: hh, MM: mm };
    },

    /**
     * @method toHHMMString
     * @public
     * @param hours {Number}
     * @param hours {Object}
     * @return {String}
     */
    toHHMMString: function (hours) {
        var o = typeof hours === 'object' ? hours :
                this.toHHMM(hours);
        var HH = o.HH, MM = o.MM;
        return  (HH < 0 ? ('-0'+Math.abs(HH)) : HH < 10 ? '0'+HH : HH) + ':' +
                (MM < 10 ? '0'+MM : MM);
        
    },

    // protected
    disable: function () {
        // disable drag-selection
        this.ddZone.lock();
        // disable resizing the range
        this.rangeSlider.resizable.enabled = false;
        // disable draging the range (moving it)
        this.rangeSlider.ddEl.lock();
        this.constructor.superclass.disable.call(this);
    },

    // protected
    enable: function () {
        // enable drag-selection
        this.ddZone.unlock();
        // enable resizing the range
        this.rangeSlider.resizable.enabled = true;
        // enable draging the range (moving it)
        this.rangeSlider.ddEl.unlock();
        this.constructor.superclass.enable.call(this);
    }


});

/**
 * @class DA.widget.TimeRangeSliderTip
 * @extends DA.widget.TimeRangeSliderTip
 * Inspiration from http://extjs.com/deploy/dev/examples/slider/slider.js
 * A plugin for a TimeRangeSlider that implements a tooltip 
 * that follows the mouse on drag-selection, resizing and moving.
 */
DA.widget.TimeRangeSliderTip = Ext.extend(Ext.Tip, {
    minWidth: 50,
    offsets: [0, -10],
    // protected: called at plugin init-time
    init: function (timeRangeSlider) {
        // We need to set the rest of the event handlers
        // AFTER the TimeRangeSlider widget has rendered:
        // This is when the slideZone and rangeSlider objects
        // will be visible.
        timeRangeSlider.on('render', function (trs) {
            var zone = trs.slideZone;
            var rs = trs.rangeSlider;
            rs.on('dragstart', this.show, this);
            rs.on('dragend', this.hide, this);
            rs.el.on('mouseover', this._setLocation, this);
        }, this);
        timeRangeSlider.on('destroy', this.destroy, this);
        timeRangeSlider.on('change', this.onChange, this);
        this.slider = timeRangeSlider;
        if (timeRangeSlider.orientation === 'vertical') {
            this.offsets = [20, 0];
        } else {
            this.offsets = [-10, 10];
        }

    },
    // Called whenever the timerangeslider's values change.
    // Does nothing if the tip is not visible.
    onChange: function (from, to, e) {
        if (!this.body) {
            return;
        }
        this._updateValues([from, to]);
        this._setLocation(e);
    },
    _setLocation: function (e) {
        if (e) {
            if (this.el) {
                this.el.setLocation(
                    e.getPageX() + this.offsets[0],
                    e.getPageY() + this.offsets[1]);
            } else {
                this.pageX = e.getPageX() + this.offsets[0];
                this.pageY = e.getPageY() + this.offsets[1];
            }
        }
    },
    onDestroy: function () {
        this.slider.un('change', this.onChange, this);
        this.slider.rangeSlider.el.un('mouseover', this._setLocation, this);
        this.slider = null;
    },
    show: function (slider, e) {
        if (!this.hidden) {
            return;
        }
        this._setLocation(e);
        this.constructor.superclass.show.call(this);
        // The following lines are needed to ensure that the tip
        // has a meaningful, non-enpty value hwne it is first displayed.
        if (!this.body.getValue()) {
            this._updateValues(this.slider.getValues());
        }
    },
    _updateValues: function (values) {
        this.body.update(
            this.slider.toHHMMString(values[0]) + ' - ' +
            this.slider.toHHMMString(values[1])
        );
        this.doAutoWidth();
    }
});
/*
Copyright (c) 2011, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern $ DA Element Prototype Insertion Event $break*/

if (!DA) {
    throw "ERROR: missing DA.js or DA-min.js";
}
if (!DA.textCal) {
    DA.textCal = {};
}

/**
 * TODO: comments, JSDOC
 * @class DateSelector
 * @param cfg {Object} Configuration options
 */
DA.textCal.DateSelector = function(textEl, name, cfg) {
    this.init(textEl, name, cfg);
};

DA.textCal.DateSelector.prototype = {

    lang: 'ja',

    yearList: [],

    firstDay: 0,

    holidayList: [],

    customDayColorList: [],

    textEl: null,

	linkClass: "",

	linkTitle: "",

    init: function(textEl, name, cfg) {
        if (cfg) {
            for (var i in cfg) {
                this[i] = cfg[i];
            }
        }

        this.textEl = $(textEl);
        this.textEl.style.imeMode = "disabled";

        this.name = name;
        this.divId = name + "DivId";
        this.imgId = name + "ImgId";

        var objName = ["DA.textCal.DateSelector._calObject['", name, "'].object"].join("");
        var html = ['<a id="', this.imgId, '" href="#" onclick="DA.textCal.DateSelector._calObject[\'', name, '\'].fncPopup(event, ', objName, ', \'', this.divId, '\', \'', this.imgId, '\');" class="', DA.util.encode(this.linkClass), '", title="', DA.util.encode(this.linkTitle), '">',
                    '<img src="', DA.vars.imgRdir, '/search_fc_calendar.png" align="absmiddle" border=0>',
                    '</a>',
                    '&nbsp;&nbsp;<div id="', this.divId, '" style="display:none"></div>'].join("");
        Insertion.After(this.textEl, html);

        var me = this;
        this.calSelector = new DA.cal.Calendar(this.divId, objName, {
            prefix: {
                year: 'yy',
                month: 'mm',
                day: 'dd'
            },
            lang: me.lang,
            firstDay: me.firstDay,
            yearList: me.yearList,
            holidayList: me.holidayList,
            customDayColorList: me.customDayColorList,
            minYear: me.minYear,
            maxYear: me.maxYear,
            linkFunc: "DA.textCal.DateSelector._calObject['" + me.name + "'].fncSet(" + objName + ",\'" + me.divId + "\')"
        }, {
            onSet: function(year, month, day) {
                me.textEl.value = [year, "/", me._twobytes(month), "/", me._twobytes(day)].join("");
            },
            onEnable: function() {
                $(me.imgId).style.display = "";
            },
            onDisable: function() {
                $(me.imgId).style.display = "none";
            }
        });
        this.calSelector.writeCal2();

        DA.textCal.DateSelector._calObject[this.name] = {
            object: this.calSelector,
            fncPopup: function(_ev, _calobj, _calid, _pickerid) {
                var a = me.textEl.value.split(/\//);
                var year = a[0] ? a[0] : 0;
                var month = a[1] ? a[1] : 0;
                var day = a[2] ? a[2] : 0;
                DA.cal.Calendar.fncPopup2(_ev, _calobj, _calid, _pickerid, year, month, day);
            },
            fncSet: function(_calobj, _calid) {
                DA.cal.Calendar.fncClose(_calid);

                if (_calobj.onSet) {
                    _calobj.onSet(_calobj.nowYear, _calobj.nowMonth + 1, _calobj.nowDay);
                }
            }
        };

        Event.observe(this.textEl, "change", function() {
            var val = me._validate(me.textEl.value);
            me.textEl.value = val;
        }, false);
    },

	_validate: function(date) {
        var ary = date.split(/\//);
        var year = parseInt(ary[0], 10);
        var month = parseInt(ary[1], 10);
        var day = parseInt(ary[2], 10);

        var i, exists = false;
        var l = this.yearList.length;
        if (l > 0) {
            this.yearList.each(function(y) {
                if (DA.util.cmpNumber(y, year)) {
                    exists = true; throw $break;
                }
            });
        } else {
            exists = true;
        }

        if (exists && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            return(year + "/" + this._twobytes(month) + "/" + this._twobytes(day));
        } else {
            return("");
        }
	},

    _twobytes: function(n) {
        return n < 10 ? "0" + n : "" + n;
    }

};

DA.textCal.DateSelector._calObject = {};

/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern $ DA Element Prototype Ext Event BrowserDetect*/

if (!DA) {
    throw "ERROR: missing DA.js or DA-min.js";
}
if (!DA.ug) {
    DA.ug = {};
}

/**
 * TODO: comments, JSDOC
 * @constructor
 * @class AccountSelector
 * @param cfg {Object} Configuration options
 */
DA.ug.AccountSelector = Ext.extend(Ext.Component, {
    
    appType: 'common',
    
    onlyOne: false,
    
    userType: 1,
    
    groupType: 2,
    
    addrType: 0,
    
    pageSize: 0,
    
    readRow: 100,
    
    textSize: 60,
    
    denyAdd: false,
    
    denyRemove: false,
    
    selectorNode: null,
    
    selectorId: null,
    
    searchNode: null,
    
    searchId: null,
    
    searchTitle: '検索:',
    
    contentsNode: null,
    
    contentsId: null,
    
    listNode: null,
    
    listId: null,
    
    textNode: null,
    
    textId: null,
    
    displayNode: null,
    
    displayId: null,
    
    hiddenNode: null,
    
    hiddenId: null,

	queryDelay: null,
    
    imageData: {
        1: {
            src: DA.vars.imgRdir + "/ico_fc_user.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "一般ユーザ",
            align: "absmiddle"
        },
        3: {
            src: DA.vars.imgRdir + "/ico_fc_userfsh.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "ファイル共有限定ユーザ",
            align: "absmiddle"
        },
        4: {
            src: DA.vars.imgRdir + "/ico_fc_userx.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "ログイン不能ユーザ",
            align: "absmiddle"
        },
        5: {
            src: DA.vars.imgRdir + "/ico_fc_useradm.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "システム管理者",
            align: "absmiddle"
        },
        A: { 
			src: DA.vars.imgRdir + "/ico_fc_userx.gif", 
			width: "14", 
			height: "14", 
			border: "0", 
			alt: "その他参加者", 
			align: "absmiddle" 
		}, 
        G: {
            src: DA.vars.imgRdir + "/ico_fc_organization.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "組織",
            align: "absmiddle"
        },
        P: {
            src: DA.vars.imgRdir + "/ico_fc_project.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "プロジェクト",
            align: "absmiddle"
        },
        T: {
            src: DA.vars.imgRdir + "/ico_fc_executive.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "役職グループ",
            align: "absmiddle"
        },
        S1: {
            src: DA.vars.imgRdir + "/ico_fc_organization_rpl.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "廃止組織",
            align: "absmiddle"
        },
        S2: {
            src: DA.vars.imgRdir + "/ico_fc_work_rpl.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "廃止プロジェクト",
            align: "absmiddle"
        },
        S3: {
            src: DA.vars.imgRdir + "/ico_fc_executive_rpl.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "廃止役職グループ",
            align: "absmiddle"
        },
        ext: {
            src: DA.vars.imgRdir + "/aqbtn_arrowd.gif",
            width: "16",
            height: "16",
            border: "0",
            alt: "展開",
            align: "top"
        },
        del: {
            src: DA.vars.imgRdir + "/aqbtn_close_s.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "削除",
            align: "top"
        },
        log: {
            src: DA.vars.imgRdir + "/aqbtn_compellogout.gif",
            width: "55",
            height: "15",
            border: "0",
            alt: "ログアウト",
            align: "top"
        }
    },
    
    selector: Prototype.emptyFunction,
    
    initRecord: null,
    
    selectedRecord: null,
    
    initContents: null,
    
    initSearch: false,
    
    // Protected
    initComponent: function() {
        this.constructor.superclass.initComponent.call(this);

        this.selectorNode = $(this.selectorNode); 
        this.selectorId = this.selectorNode.id;
        
        this.searchId = this.selectorId + 'Search';
        this.contentsId = this.selectorId + 'Contents';
        this.listId = this.selectorId + 'List';
        this.textId = this.selectorId + 'Text';
        this.displayId = this.selectorId + 'Display';
        this.hiddenId = this.selectorId + 'Hidden';
        
        var me = this;
        var selectorBox = ['<table border=0 width=100% cellspacing=0 cellpadding=0>',
                           '<tr id="' + me.searchId + '">',
                           '  <td style="padding-left:2px;background-color:#9F9F9F;" nowrap>' + me.searchTitle + '</td>',
                           '  <td style="padding:2px;background-color:#9F9F9F;width:100%;">',
                           '    <input type="text" size="' + me.textSize + '" id="' + me.textId + '">',
                           '  </td>',
                           '  <td style="background-color:#9F9F9F;" align="right">',
                           '    <span id="' + me.hiddenId + '" style="margin-right:5px;cursor:pointer;"><img src="' + DA.vars.imgRdir + '/aqbtn_close2.gif" align=absmiddle></span>',
                           '  </td>',
                           '</tr>',
                           '<tr>',
                           '  <td style="width:100%;" colspan=2>',
                           '   <span id="' + me.contentsId + '"></span>',
                           '    <ul id="' + me.listId + '" class="da_accountSelectorList"></ul>',
                           '  </td>',
                           '  <td align="right">',
                           '    <span id="' + me.displayId + '" style="margin-right:5px;cursor:pointer;"><img src="' + DA.vars.imgRdir + '/aqbtn_search_s.gif" align=absmiddle></span>',
                           '  </td>',
                           '</tr>',
                           '</table>'].join('');
        me.selectorNode.innerHTML = selectorBox;
        
        me.searchNode = $(me.searchId);
        me.contentsNode = $(me.contentsId);
        me.listNode = $(me.listId);
        me.textNode = $(me.textId);
        me.displayNode = $(me.displayId);
        me.hiddenNode = $(me.hiddenId);
        
        me.selectedRecord = [];
        var i;
        for (i = 0; i < me.initRecord.length; i ++) {
            me.addItem({
                id: me.initRecord[i].id,
                data: {
                    type: me.initRecord[i].type,
                    name: me.initRecord[i].name,
					tel3: me.initRecord[i].tel3,
					login:me.initRecord[i].login,
					logout: me.initRecord[i].logout,
		     sum: me.initRecord[i].sum
                }
            });
        }
        
        if (me.initContents) {
            me.contentsNode.innerHTML = me.initContents;
            if (me.selectedRecord.length === 0) {
                me._showContents();
                me._hideList();
            }
        }
        
        var tmpl = ['<tpl for=".">',
                    '<div class="search-item" style="padding:3px;">',
                    '<tpl if="type === \'1\'">',
                    '<img src="' + me.imageData['1'].src + '" title="' + me.imageData['1'].alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'3\'">',
                    '<img src="' + me.imageData['3'].src + '" title="' + me.imageData['3'].alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'4\'">',
                    '<img src="' + me.imageData['4'].src + '" title="' + me.imageData['4'].alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'5\'">',
                    '<img src="' + me.imageData['5'].src + '" title="' + me.imageData['5'].alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
					'<tpl if="type === \'A\'">', 
                    '<img src="' + me.imageData.A.src + '" title="' + me.imageData.A.alt + '" class="ImgIcoUser" align="absmiddle"/>', 
                    '<span>{name:htmlEncode}</span>', 
                    '</tpl>',
                    '<tpl if="type === \'G\'">',
                    '<img src="' + me.imageData.G.src + '" title="' + me.imageData.G.alt + '" class="ImgIcoOrganization" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'P\'">',
                    '<img src="' + me.imageData.P.src + '" title="' + me.imageData.P.alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'T\'">',
                    '<img src="' + me.imageData.T.src + '" title="' + me.imageData.T.alt + '" class="ImgIcoExecutive" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'S1\'">',
                    '<img src="' + me.imageData.S1.src + '" title="' + me.imageData.S1.alt + '" class="ImgIcoOrganization" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'S2\'">',
                    '<img src="' + me.imageData.S2.src + '" title="' + me.imageData.S2.alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'S3\'">',
                    '<img src="' + me.imageData.S3.src + '" title="' + me.imageData.S3.alt + '" class="ImgIcoExecutive" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '</div>',
                    '</tpl>'].join('');
        
        Ext.onReady(function(){
            me.selector = new Ext.ux.AccountSelector({
                requestURL: DA.vars.cgiRdir + '/ajx_api.cgi?func=inc_search&app_type=' + me.appType + '&user_type=' + me.userType + '&group_type=' + me.groupType + '&addr_type=' + me.addrType + '&read_row=' + me.readRow,
                seletorName: me.textId,
                userType: me.userType,
                groupType: me.groupType,
				addrType: me.addrType,
                pageSize: me.pageSize,
                queryDelay: me.queryDelay,
                listeners: {
                    specialkey: function(t,e) {
                        this.dqTask.cancel();
                        this.onTriggerClick();
                        // this.doQuery(this.getRawValue(), true);
                    },
                    expand: function() {
                        this.syncSize();
                    }
                },                
                tpl: new Ext.XTemplate(tmpl),
                afterSelectFuc: function(record, index) {
                    if (me.onlyOne) {
                        me.clearItem(1);
                    } else if (me._existsRecord(record.id)) {
                        me.removeItem(record.id, 1);
                    }
                    
                    me.addItem(record);
                    
                    this.setValue('');
                    this.collapse();
                }
            });
            
            me.displayNode.onclick = function() {
                me.toggleSearch(true);
            };
            me.hiddenNode.onclick = function() {
                me.toggleSearch(false);
            };
            
            me.selectorNode.onkeypress = function(event) {
                var keyCode = (BrowserDetect.browser === 'Explorer') ? window.event.keyCode : event.which;
                if (keyCode === Event.KEY_RETURN) {
                    return false;
                }
            };
            
            if (me.initSearch) {
                me.toggleSearch(true);
            }
            
            if (me.denyAdd) {
                me.searchNode.style.display = 'none';
                me.displayNode.style.display = 'none';                
            }            
        });
    },
    
    toggleSearch: function(searchForce) {
        if (this.searchNode !== null && this.displayNode !== null && this.denyAdd === false) {
            if (DA.util.isEmpty(searchForce)) {
                if (this.searchNode.style.display === 'none') {
                    this.searchNode.style.display = '';
                    this.displayNode.style.display = 'none';
                } else {
                    this.textNode.value = '';
                    this.searchNode.style.display = 'none';
                    this.displayNode.style.display = '';
                }
            } else {
                if (searchForce === true) {
                    this.searchNode.style.display = '';
                    this.displayNode.style.display = 'none';
                } else {
                    this.textNode.value = '';
                    this.searchNode.style.display = 'none';
                    this.displayNode.style.display = '';                    
                }
            }
        }
    },
    
    selectorStatus: function() {
        if (this.searchNode !== null && this.displayNode !== null) {
            if (this.searchNode.style.display === 'none') {
                return 0;
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    },
    
    addItemCustom: null,
    
    removeItemCustom: null,
    
    extractItemCustom: null,
    
    logoutItemCustom: null,
    
    clearItemCustom: null,
    
    addItem: function(record) {
        var me = this;
        var targetAccountList = me.listNode;
        var key;
        var accountLi, iconImg, nameLink, extLink, extIconImg, delLink, delIconImg, logLink, logIconImg;
		
        if (targetAccountList !== null) {
            accountLi = document.createElement('li');
            accountLi.setAttribute("id", me._getId(record.id));
            
            iconImg = document.createElement('img');
            for (key in me.imageData[record.data.type]) {
                iconImg.setAttribute(key, me.imageData[record.data.type][key]);
            }
            
            accountLi.appendChild(iconImg);
                        
            nameLink = document.createElement('a');
            nameLink.setAttribute("href", "#");
	
            if (String(record.data.type).match(/^[1-5]/)) {
                nameLink.onclick = function() {
                    me.openUserInfo(record.id, '', record.data.type);
                };
            }else if (record.data.type === 'A') { 
				nameLink.onclick = function() { 
					me.openAddrInfo(record.id, ''); 
				}; 
            } else {
                nameLink.onclick = function() {
                    me.openGroupInfo(record.id, '');
                };
            }
            
            nameLink.appendChild(document.createTextNode(record.data.name));
            
            accountLi.appendChild(nameLink);

			if (record.data.tel3){
				accountLi.appendChild(document.createTextNode(record.data.tel3));
			}
			if (record.data.login){
				accountLi.appendChild(document.createTextNode(record.data.login));
				if (record.data.logout) {
					logLink = document.createElement('a');
					 logLink.setAttribute("href", "#");
					logLink.onclick = function() {
						me.logoutItem(record.id);
					};
					
					logIconImg = document.createElement('img');
					for (key in me.imageData.log) {
						logIconImg.setAttribute(key, me.imageData.log[key]);
					}
					
					logLink.appendChild(logIconImg);
					accountLi.appendChild(logLink);
				}
			}
            if (me.extractItemCustom && String(record.data.type).match(/^[GPTS]/)) {
                extLink = document.createElement('a');
                extLink.setAttribute("href", "#");
                extLink.onclick = function() {
                    me.extractItem(record.id);
                };                
                
                extIconImg = document.createElement('img');
                for (key in me.imageData.ext) {
                    extIconImg.setAttribute(key, me.imageData.ext[key]);
                }
                
                extLink.appendChild(extIconImg);
                accountLi.appendChild(extLink);
            }
            if (me.denyRemove === false) {
                delLink = document.createElement('a');
                delLink.setAttribute("href", "#");
                delLink.onclick = function() {
                    me.removeItem(record.id);
                };
                
                delIconImg = document.createElement('img');
                for (key in me.imageData.del) {
                    delIconImg.setAttribute(key, me.imageData.del[key]);
                }
                
                delLink.appendChild(delIconImg);
                accountLi.appendChild(delLink);
            }
            
            me._hideContents();
            me._showList();
            targetAccountList.appendChild(accountLi);
            
            me._addRecord(record.id, record.data);
            
            if (me.addItemCustom) {
                me.addItemCustom(record);
            }
            
            return true;
        } else {
            return false;
        }
    },
    
    removeItem: function(id, opt) {
        var node = $(this._getId(id));
        if (node !== null) {
            this._removeRecord(id);
            node.innerHTML = "";
            node.parentNode.removeChild(node);
            if (this.selectedRecord.length === 0) {
                this._showContents();
                this._hideList();
            }
            
            if (this.removeItemCustom) {
                this.removeItemCustom(id, opt);
            }
        }
    },
    
    extractItem: function(id) {
        if (this.extractItemCustom) {
            this.extractItemCustom(id);
        }
    },
    
    logoutItem: function(id) {
        if (this.logoutItemCustom) {
            this.logoutItemCustom(id);
        }
    },
    
    clearItem: function(opt) {
        this.selectedRecord = [];
        this.listNode.innerHTML = "";
        this._showContents();
        this._hideList();

        if (this.clearItemCustom) {
            this.clearItemCustom(opt);
        }
    },
    
    recordList: function(s, items) {
        var i, r, a, data = '';
        if (DA.util.isEmpty(s)) {
            s = "\n";
        }
        if (!items) {
            items = ['id', 'type', 'sum', 'name'];
        }
        for (i = 0; i < this.selectedRecord.length; i ++) {
            r = this.selectedRecord[i];
            a = [];
            items.each(function(k) {
                a.push(r[k]);
            });
            data += a.join(':') + s;
        }
        return data;
    },
    
   /**
    * TODO: comments, DA.ug.openUserInfo
    * @static
    * @method openUserInfo
    */
    openUserInfo: function(mid, type, noname) {
        if (DA.util.isEmpty(type)) {
            type = 'addr';
        }
        
        var cgi = '/info_card.cgi?type=' + type + '&id=' + mid;
        var winname = 'Info' + mid;
        if (!noname || this._isOldBrowser()) {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, winname, 'width=480,height=600,resizable=yes,scrollbars=yes');
        } else {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, '', 'width=480,height=600,resizable=yes,scrollbars=yes');
        }
    },
    
   /**
    * TODO: comments, DA.ug.openGroupInfo
    * @static
    * @method openGroupInfo
    */
    openGroupInfo: function(gid, noname) {
        var cgi = '/info_card.cgi?type=group&id=' + gid;
        var winname = 'gInfo' + gid;
        
        if (!noname || this._isOldBrowser()) {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, winname,'width=500,height=480,resizable=yes,scrollbars=yes');
        } else {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, '', 'width=500,height=480,resizable=yes,scrollbars=yes');
        }
    },    
    
	openAddrInfo: function(aid, noname) { 
		var cgi = '/og_card_addr.cgi?id=' + aid; 
		var Ids = aid.split('-'); 
		var winname = 'aInfo' + Ids[0];  
		if (!noname || this._isOldBrowser()) { 
			DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, winname,'width=450,height=600,resizable=1,scrollbars=1'); 
		} else { 
			DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, '', 'width=450,height=600,resizable=1,scrollbars=1'); 
		} 
	},
    
    _getId: function(id) {
        return this.selectorId + "_Id_" + id;
    },
    
    _isOldBrowser: function() {
        var ua  = navigator.userAgent;
        if (ua.indexOf('MSIE') !== -1) {
            return true;
        } else {
            if (ua.indexOf('Mozilla/4') !== -1 ) {
                return false;
            } else {
                return true;
            }
        }
    },
    
    _existsRecord: function(id) {
        var i;
        for (i = 0; i < this.selectedRecord.length; i ++) {
            if (this.selectedRecord[i].id === id) {
                return true;
            }
        }
        return false;
    },
    
    _addRecord: function(id, data) {
        var hash = {};
        
        Object.extend(hash, data);
        hash.id = id;
        
        this.selectedRecord.push(hash);
    },
    
    _removeRecord: function(id) {
        var array = [];
        var i;
        for (i = 0; i < this.selectedRecord.length; i ++) {
            if (this.selectedRecord[i].id !== id) {
                array.push(this.selectedRecord[i]);
            }
        }
        this.selectedRecord = array;
    },
    
    _showContents: function() {
        if (this.contentsNode.style.display === "none") {
            this.contentsNode.style.display = "";
        }
    },
    
    _hideContents: function() {
        if (this.contentsNode.style.display !== "none") {
            this.contentsNode.style.display = "none";
        }
    },
    _hideList: function() {
        if (this.listNode.style.display !== "none") {
            this.listNode.style.display = "none";
        }
    },
    _showList: function() {
        if (this.listNode.style.display === "none") {
            this.listNode.style.display = "";
        }
    }
});

/*
Copyright (c) 2011, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern $ DA Element Prototype Ext Event BrowserDetect*/

if (!DA) {
    throw "ERROR: missing DA.js or DA-min.js";
}
if (!DA.ug) {
    DA.ug = {};
}

/**
 * TODO: comments, JSDOC
 * @constructor
 * @class AccountController
 */
DA.ug.AccountController = function(incSearch, cfg, cbh) {
    this.init(incSearch, cfg, cbh);
};

DA.ug.AccountController.prototype = {
    cfg: null,

    cbh: null,

    init: function(incSearch, cfg, cbh) {
        this.incSearch = incSearch;
        this.cfg = cfg ? Object.extend({}, cfg) : {};
        this.cbh = cbh ? Object.extend({}, cbh) : {};
    },

    openUsersel: function() {
        var userselIO = new DA.io.JsonIO( DA.vars.cgiRdir + "/ajx_api.cgi" );

        var me = this;
        userselIO.callback = function(o) {
            if (o.error) {
                DA.util.error(me.cfg.errCode[o.error]);
            } else {
                if (DA.util.isFunction(me.cbh.onOpened)) {
                    me.cbh.onOpened(o);
                }
            }
        };

        userselIO.errorHandler = function(o) {
            DA.util.warn(me.cfg.errCode.ERR_SYS_000000);
        };

        userselIO.execute({
            proc: "usersel_open",
            proc_no: me.cfg.proc_no,
            usersel: this.incSearch.recordList("|", ['id', 'sum'])
        });
    },

    closeUsersel: function(extension) {
        var userselIO = new DA.io.JsonIO( DA.vars.cgiRdir + "/ajx_api.cgi" );

        var me = this;
        userselIO.callback = function(o) {
            var i;
            if (o.error) {
                DA.util.error(me.cfg.errCode[o.error]);
            } else {
                me.incSearch.clearItem();
                if (DA.util.isArray(o.selectedItems)) {
                    for (i = 0; i < o.selectedItems.length; i ++) {
                        me.incSearch.addItem({
                            id: o.selectedItems[i].id,
                            data: {
                                type: o.selectedItems[i].type,
                                name: o.selectedItems[i].name,
                                tel3: o.selectedItems[i].tel3,
                                sum: o.selectedItems[i].sum
                            }
                        });
                    }
                }
                if (DA.util.isFunction(me.cbh.onClosed)) {
                    me.cbh.onClosed(o);
                }
            }
        };

        userselIO.errorHandler = function(o) {
            DA.util.warn(me.cfg.errCode.ERR_SYS_000000);
        };

        userselIO.execute({
            proc: "usersel_close",
            proc_no: me.cfg.proc_no,
            extension: extension || false
        });
    }
};

/* $Id: mailer.js 1594 2008-02-15 02:46:08Z ml_chen $ -- $HeadURL: http://yuki/svn/iseria/insuite-ui/trunk/src/mailer/mailer.js $ */
/*for JSLINT undef checks*/
/**
 * TODO: comments
 */
/*extern DA YAHOO*/
if ('undefined' === typeof DA) {
    alert("ERROR: need DA.js (or DA-min.js)");
} else {
    if (! DA.scheduler) {
        DA.scheduler = {};
    }
}


/* $Id: mailer.js 1417 2007-06-28 01:58:25Z faiz_kazi $ -- $HeadURL: http://yuki/svn/iseria/insuite-ui/trunk/src/mailer/mailer.js $ */
/*for JSLINT undef checks*/
/*extern DA Ext */
/**
 * TODO: comments
 */

if (!DA || !DA.scheduler) {
    throw "Error: Missing dependencies: (need: DA.js, scheduler.js";
}

if (!DA.widget.TimeRangeSlider || !DA.cal.DateRangeSelector) {
    throw "Error: Missing dependencies: (need: calendar/rangeselector.js, calender/timerangeslider.js";
}

(function () { // private scope

// util
var isN = function (n) {
    return typeof parseInt(n, 10) === 'number';
};

var cmpN = DA.util.cmpNumber;

DA.scheduler.EditPage = {

    /**
     * @public
     * @method init
     * @param config {Object} Hash literal with keys for:
     *                        dateRangeSelector, timeRangeSlider 
     */
    init: function (config) {

        if (!config || !config.rangeSelector) {
            throw "Error: Bad Params: need rangeSelector";
        }
        
        this.dateRangeSelector = new DA.cal.DateRangeSelector (config.rangeSelector);

        if (config.timeRangeSlider) {
        	this.timeRangeSlider = new DA.widget.TimeRangeSlider(Ext.apply({}, config.timeRangeSlider, {
            	scale:      3,
            	resolution: 5,
            	minValue:   0,
            	maxValue:   24,
            	orientation: 'horizontal',
            	plugins:    new DA.widget.TimeRangeSliderTip()
        	}));
        	this.timeRangeSlider.on('change', this.onSliderChange, this);
        }

        // If we are here, all that we need to do is create
        // the slider, and setup event plumbing

        this.dateRangeSelector.on('change', this.onDateRangeChange, this);

        this.dateRangeSelector.on('enabled', this.onSomethingEnabled, this);
        this.dateRangeSelector.on('disabled', this.onSomethingDisabled, this);

        this._setupViewPort();


    },

    /*
     * Emergency 'hack' (requested by Yamamoto-san!)
     * - What?
     *   This saves the difference between the slider-viewport's
     *   width and the window width. This difference can then
     *   be used during window.onresize to set the slider's width
     * - Why?
     *   This allows the slider's to resize to *smaller* widths
     *   Previously, resizing worked only when increasing the width
     * - Limitations
     *   This will probably fail if other percentage-width elements
     *   are present in the layout as horizontal neighbors to the 
     *   slider.
     */
    _determineWidthOffset: function () {
        // First figure out the viewport width
        var vpw = this.simpleViewPort.getBox().width;
        // And then, the entire page's width:
        var pageW = Ext.lib.Dom.getViewWidth();
        this._widthOffset = pageW - vpw;
    },

    _setupViewPort: function () {
    	if(!this.timeRangeSlider){ return;}
        this.simpleViewPort = new DA.widget.SimpleViewPort({
            renderTo: this.timeRangeSlider.container,
            scrollDistance: 144, // 4 hours (1H => 36 pixels)
            style: {
                border: '1px solid #888',
                height: '36px',
                width:  '400px' // A conservative guess
            },
            maxWidth: 864, // 864 pixels => 24H
            items: [ this.timeRangeSlider ]
        });
        (function () {
        	this._resizeViewPort();
            this.simpleViewPort.fitToParentWidth();
            // FIXME: Calling a private method
            this.timeRangeSlider._fixLimits();
            // HACK: See _determineWidthOffset
            this._determineWidthOffset();
        }).defer(10, this);

        this.simpleViewPort.on('enable', function () {
            this.timeRangeSlider.enable();
        }, this);

        this.simpleViewPort.on('disable', function () {
            this.timeRangeSlider.setValues(0, 0);
            this.timeRangeSlider.disable();
        }, this);


        Ext.EventManager.onWindowResize(this.handleWindowResize, this);

    },
	
	_resizeViewPort: function () {
	    var s_h = this.dateRangeSelector.startDateSelector.hhSelector.getValue();
		var s_m = this.dateRangeSelector.startDateSelector.miSelector.getValue();
		var e_h = this.dateRangeSelector.endDateSelector.hhSelector.getValue();
		var e_m = this.dateRangeSelector.endDateSelector.miSelector.getValue();
		if (e_h === '--') {
			e_h = '24';
			e_m = 0;
		}
	    
	    var start = parseInt(s_h, 10) * 60 + parseInt(s_m, 10);
	    var end   = parseInt(e_h, 10) * 60 + parseInt(e_m, 10);
		if (end > start && (s_h < 8 || (e_h === '23' && e_m > 0) || e_h === '24')) {
			this.simpleViewPort.doScrollLeft(null,null,parseInt((start + end)/2/60, 10)/4-2,true); 
		} else {
			this.simpleViewPort.doScrollLeft(null, null,2,true);
		}
	},
	
    handleWindowResize: function (w, h) {
        var svp = this.simpleViewPort;
        var svpW = w - this._widthOffset;
        svp.setWidth(svpW);
        svp.fitToParentWidth();
        this._resizeViewPort();
    },

    onSomethingEnabled: function (adj, noun) {
        if (noun === 'Time' && this.simpleViewPort) {
            this.simpleViewPort.enable();
        }
    },

    onSomethingDisabled: function (adj, noun) {
        if (noun === 'Time' && this.simpleViewPort) {
            this.simpleViewPort.disable();
        }
    },


    /**
     * Called when the date-range has changed.
     * @public
     * @type {Function} event handler
     */
    onDateRangeChange: function (start, end) {
        this.isSameDay = cmpN(start.yy,end.yy) && 
                cmpN(start.mm, end.mm) && cmpN(start.dd,end.dd);
        var trs = this.timeRangeSlider;
        if (!trs) { return; }
        if (!this.isSameDay && this.simpleViewPort) {
            this.simpleViewPort.disable();
            return;
        }
        var sVal = { HH: start.hh, MM: start.mi};
        var eVal = { HH: end.hh,   MM: end.mi};

        this.simpleViewPort.enable();
        trs.setValues(
            this._roundTo5Mins(sVal), 
            this._roundTo5Mins(eVal));

    }, 

    _roundTo5Mins: function (oHHMM) {
        var mm = oHHMM.MM;
        var hh = oHHMM.HH;
        mm = Math.round(mm/5) * 5;
        if (mm >= 60) {
            hh++;
            mm = 0;
        }
        return {
            HH: hh,
            MM: mm
        };
    },

    clearTime: function () {
        this.dateRangeSelector.startDateSelector.resetTime();
        this.dateRangeSelector.endDateSelector.resetTime();
        this.dateRangeSelector.setValue(
            { hh: '--', mi: '--' },
            { hh: '--', mi: '--' },
            true
        );
        if (this.timeRangeSlider) {
            this.timeRangeSlider.setValues(0, 0);
        }
    },
    
	disableAll: function () {
		this.dateRangeSelector.startDateSelector.disableAll();
		this.dateRangeSelector.endDateSelector.disableAll();
		if (this.timeRangeSlider) {
			this.timeRangeSlider.disable();
		}
	},

    /**
     * Called when the date-range has changed.
     * @public
     * @type {Function} event handler
     */
    onSliderChange: function (start, end) {
        this.dateRangeSelector.setValue(
            { hh: start.HH, mi: start.MM },
            { hh: end.HH,   mi: end.MM }
        );
        this.dateRangeSelector.changeWithoutFireEvent();
    }

    
};


})();
