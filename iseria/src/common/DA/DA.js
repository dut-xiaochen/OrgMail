/* $Id: DA.js 2303 2012-08-20 08:26:51Z ch_zhang $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/DA/DA.js $ */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
/*jslint evil: true */
/*for JSLINT undef checks*/
/*extern YAHOO */ 
/*extern$H $ Event*/

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
        if (DA.vars.clrRdir.match(/^\//)) {
            DA.vars.clrRdir = DA.vars.clrRdir.replace(/\//, server + '/');
        }
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
                buf = buf.replace(/([^\r\n]+)(\r\n|$)/mg, "<p>$1</p>$2");
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
		var operationFlag = DA.mailer.util.getOperationFlag();
        if ((operationFlag !== "" && operationFlag.indexOf(OrgMailer.vars.org_mail_gid.toString()) < 0) || this.existsLock(name)) {
            return false;
        } else {
			operationFlag += OrgMailer.vars.org_mail_gid.toString() + name;
            DA.mailer.util.setOperationFlag(operationFlag);
            this.lockData[name] = true;
            return true;
        }
    },
    
    unlock: function(name) {
		var operationFlag = DA.mailer.util.getOperationFlag();
		var reg = null;
		if (operationFlag !== "" && operationFlag.indexOf(OrgMailer.vars.org_mail_gid.toString() + name) >= 0){
			reg = new RegExp(OrgMailer.vars.org_mail_gid.toString() + name, 'g');
        	DA.mailer.util.setOperationFlag(operationFlag.replace(reg,''));
        	DA.mailer.util.setOperationWarnedFlag('');
		}
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
        if (!(YAHOO.lang.isObject(o1) && YAHOO.lang.isObject(o2))) { return false; }
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
    _add: function(a, b) { return a + b; },
    
    disableKey: function(key){
        if (key === "backspace"){
    			YAHOO.util.Event.addListener(window.document, "keydown", function() {
            		var elTarget = YAHOO.util.Event.getTarget(event);
            		if (YAHOO.util.Event.getCharCode(event) === Event.KEY_BACKSPACE && (elTarget.type !== 'text') && (elTarget.type !== 'textarea') && (elTarget.type !== 'file')) {
                		return false;
            		}
            		return true;
        		}, window.document, true);
    	}
	},
	
	jsubstr4attach: function(str, length){
		var len, h_len, str_len, res, n, t;
		len = length || DA.vars.config.attachment_length;
		if (len === 'none'){return str;}
		if (len === null){len=15;}
		h_len = parseInt((len-3)/2,10);
		str_len = str.length;
		if (str_len > len){
			if (str.match(/(.*)\.([\w\d]+)/g)) {
				n = RegExp.$1;
				t = RegExp.$2;
				res = n.substring(0,h_len)+ '...' + n.substr(n.length-h_len,h_len)+ '.'+ t;
			} else {
				res = str.substring(0,h_len)+ '...' + str.substr(str_len-h_len,h_len);
			}
			return res;	
		} else {
			return str;
		}
	},
	
    getSessionId: function() {
        var cookie = document.cookie;
        var cookies = cookie.split(/\;\s*/);
        var i, kv, sessionId;
        for (i = 0; i < cookies.length; i++ ) {
            kv = cookies[i].split(/\=/);
            if (kv[0] === DA.vars.sessionKey) {
                sessionId = kv[1];
            }
        }
        return sessionId;
    },
    
    getServer: function() {
        var server;
        if (location.href.match(/^(http[s]*\:\/\/[^\/]+)/)) {
            server = RegExp.$1;
        }
        return server;
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

/* 
 * FCKEditor Common function
 */
var FCKEditorIframeController = {
    createIframe: function(IframeId, parent) {
        var HTMLArea = document.createElement("iframe");
            HTMLArea.setAttribute("id", IframeId);
            HTMLArea.setAttribute("width", "100%");
            HTMLArea.setAttribute("height", "100%");
            HTMLArea.setAttribute("frameborder", 0);
        parent.innerHTML = '';
        parent.appendChild(HTMLArea);
    },
    
    removeIframe: function(IframeId, parent) {
        var HTMLNode = YAHOO.util.Dom.get(IframeId);
        
        if (HTMLNode) {
            this.setIframeBody(IframeId, '');
            parent.removeChild(HTMLNode);
        }
    },

    setIframeBody: function(IframeId, html) {
        var HTMLNode = YAHOO.util.Dom.get(IframeId);
        var doc;
        
        if (HTMLNode) {
            if (BrowserDetect.browser === 'Explorer') {
                doc = HTMLNode.contentWindow.document;
            } else {
                doc = HTMLNode.contentDocument;
            }
            
            doc.open();
            doc.writeln(html);
            doc.close();
        }
    },
    
    isFCKeditorData: function(html) {
        var fckHeaderMatcher = /^<\!-- Created by DA_Richtext .*? end default style -->/;
        return fckHeaderMatcher.test(html);
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
        win.focus();
        
        this.data[this.data.length] = win;
        
        return win;
    },
    
    winOpenNoBar: function(url, name, width, height, flg) {
    	var win;
        var status = 'width=' + this._width(width) + ',height=' + this._height(height) +
                     ',resizable=yes,scrollbars=no,location=no' +
                     ',menubar=no,toolbar=no,statusbar=no';
		if (DA.vars.config.download_type === 'simple' && flg === 1) {
			win = window.open(this._url(url), '_self', status);
		} else {
        	win = window.open(this._url(url), this._name(name), status);
            win.moveTo(this.getX(win.opener) + 10, this.getY(win.opener) + 10);
            win.focus();
        	this.data[this.data.length] = win;
    	}
        return win;
    },
    
    winOpenCustom: function(url, name, status) {
        var win = window.open(this._url(url), this._name(name), status);
        win.moveTo(this.getX(win.opener) + 10, this.getY(win.opener) + 10);
        win.focus();
        
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
    
    allClose: function(parent) {
    	if(!DA.util.isObject(parent)){
    		parent=window;
    	}
        for (var i = 0; i < this.data.length; i ++) {
            if (this.data[i]) {
                try {
                    if(parent === this.data[i]){ 
						continue; 
					} 
					this.data[i].DA.windowController.allClose(this.data[i]); 
                } catch(e) {
                }
                try {
                    this.data[i].close();
                } catch(e) {
                }
            }
        }
    },

    /**
     * Custom Event (YUI) that will be fired whenever the window has been resized.
     * This is recommended (instead of directly using window.onresize) because it
     * provides a cross-browser event that fires only once <b>after</b> the resize
     * has been completed, instead of continuously (as in IE)
     * @static
     * @property onGentleResize
     * @type {Object} Instance of YAHOO.util.CustomEvent
     */
    onGentleResize: new YAHOO.util.CustomEvent("onGentleResize")
    
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
        return this.tag(DA.vars.imgRdir + '/null.gif', '', { width: (DA.util.isEmpty(x)) ? 1 : x, height: (DA.util.isEmpty(y)) ? 1 : y });
    }
    
};

DA.dom = {
    createDiv: function(id) {
        var body = document.body;
        var div  = document.createElement("div"); div.id = id;
        
        body.insertBefore(div, body.firstChild);
        
        var node = YAHOO.util.Dom.get(id);
        
        return node;
    },
    
    id2node: function(obj) {
        if (DA.util.isString(obj)) {
            return YAHOO.util.Dom.get(obj);
        } else {
            return obj;
        }
    },
    
    left: function(obj) {
        var node = this.id2node(obj);
        
        return node.offsetLeft;
    },
    
    top: function(obj) {
        var node = this.id2node(obj);
        
        return node.offsetTop;
    },
    
    width: function(obj) {
        var node = this.id2node(obj);
        
        return node.offsetWidth;
    },
    
    height: function(obj) {
        var node = this.id2node(obj);
        
        return node.offsetHeight;
    },
    
    size: function(obj, width, height) {
        var node = this.id2node(obj);
        
        this.sizeWidth(width);
        this.sizeHeight(height);
    },
    
    sizeWidth: function(obj, width) {
        var node = this.id2node(obj);
        
        node.style.width = width + 'px';
    },
    
    sizeHeight: function(obj, height) {
        var node = this.id2node(obj);
        
        node.style.height = height + 'px';
    },
    
    position: function(obj, x, y) {
        var node = this.id2node(obj);
        
        this.positionX(obj, x);
        this.positionY(obj, y);
    },
    
    positionX: function(obj, x) {
        var node = this.id2node(obj);
        
        node.style.left = x + 'px';
    },
    
    positionY: function(obj, y) {
        var node = this.id2node(obj);
        
        node.style.top  = y + 'px'; 
    },
    
    adjustPosition: function(obj) {
        var node = this.id2node(obj);
        var windowWidth  = YAHOO.util.Dom.getViewportWidth();
        var windowHeight = YAHOO.util.Dom.getViewportHeight();
        var offsetWidth  = this.width(node);
        var offsetHeight = this.height(node);
        var offsetLeft   = this.left(node);
        var offsetTop    = this.top(node);
        var x, y;
        
        if (offsetLeft + offsetWidth > windowWidth) {
            x = offsetLeft + windowWidth - (offsetLeft + offsetWidth) - 10;
            if (x < 0) {
                x = 0;
            }
        } else {
            x = offsetLeft;
        }
        if (offsetTop + offsetHeight > windowHeight) {
            y = offsetTop + windowHeight - (offsetTop + offsetHeight) - 30;
            if (y < 0) {
                y = 0;
            }
        } else {
            y = offsetTop;
        }
        
        this.position(node, x, y);
    },
    
    textAreaValue: function(obj) {
        var node = this.id2node(obj);
        
        return node.value;
    },
    
    textValue: function(obj) {
        var node = this.id2node(obj);
        
        return node.value;
    },
    
    fileValue: function(obj) {
        var node = this.id2node(obj);
        
        return node.value;
    },
    
    hiddenValue: function(obj) {
        var node = this.id2node(obj);
        
        return node.value;
    },
    
    selectValue: function(obj) {
        var node = this.id2node(obj);
        
        return node.value;
    },
    
    radioValue: function(name) {
        var value = null;
        var root  = document.getElementsByName(name);
        
        for (var i = 0; i < root.length; ++i) {
            if (root[i].checked) {
                value = root[i].value;
                break;
            }
        }
        
        return value;
    },
    
    checkedOk: function(obj) {
        var node = this.id2node(obj);
        
        return node.checked;
    },
    
    changeValue: function(obj, value) {
        var node = this.id2node(obj);
        
        node.value = (DA.util.isEmpty(value)) ? '' : value;
    },
    
    changeSelectedIndex: function(obj, target) {
        var node    = this.id2node(obj);
        var tString = (DA.util.isNumber(target)) ? String(target) : target;
        var i;
        
        for (i = 0; i < node.childNodes.length; i ++) {
            if (node.childNodes[i].value && node.childNodes[i].value === tString) {
                node.selectedIndex = node.childNodes[i].index;
                break;
            }
        }
    },
    
    changeChecked: function(obj, value) {
        var node = this.id2node(obj);
        
        node.checked = (DA.util.isEmpty(value)) ? false : value;
    },

    /**
     * Given a node, finds the first parent node (or itself) if one of it's ancestors
     * (or itself) matches the specified criteria 
     * @param node          {HTMLElement} a node to start searching from (upwards).
     * @param criteria      {String}      the tagName of the HTMLElement to find (Example: TR)
     * @param criteria      {function}    a function that acts as an acceptor 
     *                                    (Example: function(el){return el.className == 'nice'})
     * @param levels        {Int}         The maximum number of levels to search. The default is 3.
     * @return {HTMLElement} The matching parent node (if found) or null.
     */
    findParent: function(node, criteria, levels) {
        if (!node || !node.tagName || !criteria) { return null; } 
        if (!levels) { levels = 3; } 
        
        var test = typeof criteria === 'function' ?  criteria : // already a function
                // Make a tagName matcher
                function(n) { // n: node
                    return criteria === n.tagName.toUpperCase();
                };

        var level = 0;
        if (test(node)) {
            return node;
        }
        do {
            level++;
            if (test(node)) {
                return node;
            }
        } while ((node = node.parentNode) && node.tagName && (level < levels));
        return null;
    },

    /**
     * Move all the childNodes from src to dest.
     * @param src  {HTMLElement} The source DOM Element.
     * @param dest {HTMLElement} The destination DOM Element.
     */
    moveAllChildren: function (src, dest) {
        if (!src || !dest) { return; }
        while (src.firstChild) {
            dest.appendChild(src.firstChild);
        }
    },


    /**
     * Cross-Browser utility to create new CSS rules.
     * The rules are specifed by passing in a CSS selector as a first argument,
     * and text for the CSS rule (sans the trailing semicolon) as the second.
     * The created rule will be inserted into the first stylesheet in the
     * document; unless a stylesheet has already been specified before the
     * loading of this script (DA.js)
     *
     * Example:
     * // calling
     * DA.dom.createCSSRule('div.pinkish', 'background-color:pink');
     * // Will turn all existing as well as future DIV elements with
     * // a 'pinkish' class to pink.
     *  
     * @method createCSSRule
     * @public
     * @static
     * @param selector {String}
     * @param ruleText {String}
     */
    createCSSRule: (function () {
        /*
         * We avoid doing at run-time what can be done once at load-time:
         * instead of defining createCSSRule as a function with if/else
         * branches for IE/Gecko, we use a closure for each browser
         * and decide at load-time (or more correctly, at the time of 
         * createCSSRule's definition) which function to use.
         */
        if (document.styleSheets.length === 0) {
           document.write("<style>\n</style>");
        }
        // 
        var styleSheet = document.styleSheets[0];

        // Function for IE
        var IE = function (selector, ruleText) {
            styleSheet.addRule(selector, ruleText);
        };

        // Function for W3C browsers (FF/Gecko/Mozilla conforms and tests OK)
        var W3C = function (selector, ruleText) {
            styleSheet.insertRule(selector + " {" + ruleText + ";}" , 0);
        };

        // A dummy function.
        var Unimplemented = function () {
            // DA_DEBUG_START
            DA.log("Stylesheet manipulation not available", "warn", "DA.dom");
            debugger;
            // DA_DEBUG_END
        };

        return styleSheet.addRule ? IE : 
                styleSheet.insertRule ? W3C : Unimplemented;
    })()


};

DA.tip = {
    tipNode: [],

    open: function(id, title, array, event, clickedId) {
        var i, list = "";
        var len = array.length;
        var node;
        if (this.tipNode[id]) {
            node = this.tipNode[id];
        } else {
            node = DA.dom.createDiv(id);
            node.style.position = "absolute";
            node.style.display = "block";
            this.tipNode[id] = node;
        }
        node.style.visibility = "hidden";
        for (i = 0; i < len; i ++) {
            list += ['<tr><td style="" onmouseout="this.parentNode.style.backgroudColor=\'red\';" onmouseover="this.parentNode.style.backgroudColor=\'black\';" onclick="var clickedDom = document.getElementById(\''+clickedId+'\'); clickedDom.innerHTML=\'' + array[i] + '\';DA.tip.close(\'DASpellCheckList\')" nowrap><font color="#000000">', array[i], '</font></td></tr>'].join("");
        }
        var html = [
            '<table border="0" width="150" cellspacing="0" cellpadding="0">',
            '<tr>',
            '  <td width="100%" bgcolor="#000000">',
            '  <table border="0" width="100%" cellspacing="1" cellpadding="0">',
            '  <tr>',
            '    <td width="100%" bgcolor="#FFFFE0" nowrap>',
            '      <font color="#000000">', title, '</font>',
            '    </td>',
            '  </tr>',
            '  <tr>',
            '    <td width="100%" bgcolor="#FFFFE0">',
            '    <table border="0" cellspacing="1">', list, '</table>',
            '    </td>',
            '  </tr>',
            '  </table>',
            '  </td>',
            '</tr>',
            '</table>'
        ].join("\n");

        node.innerHTML = html;
        DA.shim.open(node);
        node.style.visibility = "";

        var x = YAHOO.util.Event.getPageX(event); x += 5;
        var y = YAHOO.util.Event.getPageY(event); y += 5;
        var w = DA.dom.width(node);
        var h = DA.dom.height(node);

        var vw = YAHOO.util.Dom.getViewportWidth();
        var vh = YAHOO.util.Dom.getViewportHeight();

        if (x + w > vw - 5) {
            x = vw - w - 5;
            if (x < 5) {
                x = 5;
            }
        }
        if (y + h > vh - 5) {
            y = vh - h - 5;
            if (y < 5) {
                y = 5;
            }
        }

        this.move(id, x, y);
    },

    close: function(id) {
        var node = this.tipNode[id];

        node.style.visibility = "hidden";
        DA.shim.close(node);
    },

    move: function(id, x, y) {
        var node = this.tipNode[id];

        YAHOO.util.Dom.setXY(node, [x, y], true);
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

// overwrite YAHOO.widget.Node
if (YAHOO && YAHOO.widget && YAHOO.widget.Node) {
    YAHOO.widget.Node.prototype.getToggleLink = function() {
        return "DA.util.getTreeViewToggle(\'" + this.tree.id + "\'," + this.index + ")";
    };
    
    DA.util.getTreeViewToggle = function(id, index) {
        YAHOO.widget.TreeView.getNode(id, index).toggle();
    };
}


if (BrowserDetect.browser === 'Explorer' &&
    typeof(window.opener) === 'object' && 
    typeof(window.opener.DA) === 'object' &&
    typeof(window.opener.DA.session) === 'object') {
    // Take the global reference to DA.session from the one, single parent window for IE
    DA.session = window.opener.DA.session;
} else if (BrowserDetect.browser !== 'Explorer' &&
           window.opener &&
           window.opener.DA &&
           window.opener.DA.session) {
    // Take the global reference to DA.session from the one, single parent window for FireFox
    DA.session = window.opener.DA.session;
} else {    // This must be the main window.

    (function () { // Create a private scope

        var widgets = $H({}); // private hash
		var values = $H({});
        function _getStateInfo(w) {
            if ('function' !== typeof w.getUIStateInfo) { // duck typing?
                // DA_DEBUG_START
                DA.log("widget "+name+" has no UI state info", "warn", "UIState");
                // DA_DEBUG_END
                return;
            }
            return w.getUIStateInfo();
        }

        DA.session = {
        	Values: {
				registerValue: function(name, value) {
				values[name] = value;
				},
				getValue: function(name) {
				return values[name];
				}
			},

            UIState: {
               
                /**
                 * @method registerWidget
                 * @static
                 * @param name   {String} unique name/id for the widget
                 * @param widget {Object} instance of DA.*widget.*
                 */
                registerWidget: function(name, widget) {
                    widgets[name] = widget;
                },

                /**
                 * Retrieve state information for the given widget.
                 * 
                 * @method getStateInfo
                 * @static
                 * @param name   {String} unique name/id of the widget
                 * @returns      {Hash} object containing name/value pairs
                 *                      of state information 
                 */
                getStateInfo: function(name) {
                    var w = widgets[name];
                    if (!w) {
                        // DA_DEBUG_START
                        DA.log("No widget for "+name, "warn", "UIState");
                        // DA_DEBUG_END
                        return;
                    }
                    return _getStateInfo(w);
                   
                },


                /**
                 * Get all the state info we have registered....
                 * @method getAllStateInfo
                 * @static
                 * @return {Array} Array of Objects, each with
                 *                          name: name of the widget
                 *                          info: hash containing state info
                 */
                getAllStateInfo: function() {
                    return widgets.map(function (ent /*entry*/) {
                        return {
                            name: ent.key,
                            info: _getStateInfo(ent.value)
                        };
                    });
                }

            }
        };

    })();

}

/*
 * Setup a per-window CustomEvent that fires 'gently' (i.e., after, and not continuously during)
 * on a window resize event.
 */
YAHOO.util.Event.on(window, 'load', function () {
  
    // To defeat IE's dehavior of continuouly firing the onresize event for the window object,
    // we use an onResize handler attached to a DIV (IE supports onresize for HTMLElements)
    function getResizingElem() {
        // Create a container div unless it is already present
        var outermost = document.getElementById('da_outermost'); // Try looking for the outermost DIV
        if (!outermost) {
            outermost = document.createElement('div');
            outermost.id = 'da_outermost';
            DA.dom.moveAllChildren(document.body, outermost);
            document.body.insertBefore(outermost, document.body.firstChild);
            Object.extend(outermost.style, {
                height  : "100%",
                width   : "100%",
                margin  : "0px",
                padding : "0px"
            });
        }
        return outermost;
    }

    // Code can subscribe to DA.windowController.onGentleResize instead of directly
    // listening to window.resize
    var customEvent = DA.windowController.onGentleResize;

    if (BrowserDetect.browser === 'Explorer') {
        // Explorer supports onResize for single HTMLElements; and this does not fire
        // continuously as in window.onresize
        YAHOO.util.Event.on(getResizingElem(), 'resize', DA.util.onlyonce(customEvent, customEvent.fire, 50));
    } else {
        // Most other browsers invoke window.onresize only once...
        YAHOO.util.Event.on(window, 'resize', customEvent.fire, customEvent, true);
    }

});

/**
 * TODO: Comments
 */
DA.init = function(disableESC) {
    if (DA.waiting && 'function' === typeof DA.waiting.init) {
        DA.waiting.init();
    }
    if (disableESC && BrowserDetect.browser === 'Explorer') {
		YAHOO.util.Event.addListener(window.document,"keydown",function(e){
			var elementType;
			if (BrowserDetect.browser === 'Explorer') {
				e = window.event;
				elementType = e.srcElement.type;
			} else {
				elementType = e.target.type;
			}
			if (elementType === 'text' || elementType === 'textarea') {
				if (YAHOO.util.Event.getCharCode(event) === Event.KEY_ESC) {
					return false;
				}
			}
			return true;
        }, window.document, true);
    }
    if (BrowserDetect.browser === 'Explorer') {
        YAHOO.util.Event.addListener(window.document.body, "dragover", function() {
            return false;
        }, window.document.body, true);
    }
};


/*
 * IMPORTANT:  YUI (YAHOO UI Library, V2.2.0 ~ V2.2.2)  Overrides!
 *
 * The folling code will be executed on load time, and will override the following
 * Classes/Objects/Methods of the YUI library:
 *
 * Why:     To support concurrent modification of (the list of) subscribers.
 *          This allows a subscriber to be unsubscribed *during* the firing
 *          of the event.
 *          ALSO: IE, sharing (CustomEvent) objects across windows
 *          causes some concurrency issues (JS in each window seems to
 *          run in it's own thread simultaneously!)
 *
 * Class:   YAHOO.util.CustomEvent
 * Method:  fire
 *          Will set a flag to indicate that the event is in a firing state.
 *          After the firing (after notinfyying all subscribers), it will
 *          flush the deleted (subscribers marked for removal) subscribers
 *          from the subscribers list.
 * Method:  _delete
 *          Will check if the event is currently firing, before attempting to
 *          directly remove the subscriber from the subscriber's list. If the
 *          event is in a fireing state, will simply mark the subscriber for
 *          later removal (after fire has completely notified all subscribers).
 */
(function(){

// Comparator for reverse sort 
var reverseComp = function (a,b) { return b-a; };

var CE = YAHOO.util.CustomEvent; // CE: alias for CustomEvent

// Flag to represent state
CE.prototype.isFiring = false; 
// Save the original fire, and _delete functions
CE.prototype._fire_orig = CE.prototype.fire;  
CE.prototype._delete_orig = CE.prototype._delete;

// Override fire, making it a wrapper that calls the original fire
CE.prototype.fire = function () {
    this.isFiring = true; // Disables direct deletion during iteration
    // Call the original method
    var ret = this._fire_orig.apply(this, arguments);
    if (this._pendingRemoval) { // Check if we have any queued deletions
        // For each queued deletion, call the original _delete method
        // id descending order of the indexes (so as to not mess up the
        // subscribers array)
        this._pendingRemoval.keys().sort(reverseComp).each(
            // TODO: For efficiency: Move this closure to a prototype method
            function (n) {
                this._delete_orig(n);
                delete this._pendingRemoval[n];
            }.bind(this)
        );
    }
    this.isFiring = false; // done
    return ret;

};

// Override _delete, making it a wrapper that calls the original _delete 
CE.prototype._delete = function (n) {
    // Check if the subscribers array is currently being iterated
    if (this.isFiring) {
        if (!this._pendingRemoval) { // Make a per-event cache of pending removals
            this._pendingRemoval = $H({}); // (if not already in existence)
        }
        this._pendingRemoval[n] = true; // This subscriber (whose index is n) will
        return;                         // be removed after the event firing is done
    }
    // Event is not currently firing; OK to delete straight away
    this._delete_orig(n);
};

})();

