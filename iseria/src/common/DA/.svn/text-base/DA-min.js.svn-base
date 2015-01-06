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

