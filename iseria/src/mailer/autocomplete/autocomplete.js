/* $Id: autocomplete.js 2144 2010-09-21 06:30:44Z yp_shao $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/autocomplete/autocomplete.js $ */
/*for JSLINT undef checks*/
/*extern DA Event YAHOO */
/*extern $H BrowserDetect */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.mailer || !DA.mailer.widget || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Address auto-completion, using YUI 
 * 
 * @class AutoComplete
 * @constructor
 * @param input          {HTMLElementInputElement}
 * @param input          {String} ID of an INPUT element.
 * @param container      {HTMLDivElement}
 * @param container      ID of a DIV element.
 * @param field          {String} Either 'to', 'cc', or 'bcc'
 * @param listController {Object} Instance of DA.ug.InformationListController
 */
DA.mailer.widget.AddressAutoComplete = function(input, container, field, listController) {
    var errMsg;
    if (!input || !container || !field) {
        errMsg = "Invalid/Missing args";
        // DA_DEBUG_START
        DA.log(errMsg, "error", "AddrAutoComp");
        // DA_DEBUG_END
        throw errMsg;
    }
    // Use InformationListController if available
    if (listController instanceof DA.ug.InformationListController) {
        this.listController = listController;
        this._selectItem = this._listController_selectItem;
    }
    this._initDataSource(field); 
    DA.mailer.widget.AddressAutoComplete.superclass.constructor.call(this, input, container, this.dataSource);
    this.useIFrame = true;

};

YAHOO.extend(DA.mailer.widget.AddressAutoComplete, YAHOO.widget.AutoComplete, {

    /**
     * @property listController
     * @type     {Object} instance of DA.ug.InformationListController
     */
    listController: null,
    
    /**
     * AutoComplete override.
     * This is not really used; since we use the InformationListController
     */
    delimChar:  [","],

    /**
     * The list of fields that have a "xxx_hit" property 
     * (which will be === 1 if the property's value was a
     * hit)
     * @property _hitFields
     * @type    {String[]}
     */
    _hitFields: [
        "email",
        "name",
        "alpha",
        "kana",
        "keitai_mail",
        "pmail1",
        "pmail2"
    ],


    /**
     * Override to implement our own result formatting
     * @param aResultItem {Array} An array, whose 
     *                            0. first  ([0]) element is a String (email) 
     *                            1. second ([1]) element is a hash (Object),
     *                               which contains user information.
     * @param sQuery      {String} the actual query string entered
     */
    formatResult: function(aResultItem, sQuery) {

        var email = aResultItem[0];

        var userInfo = aResultItem[1];

        if (!userInfo) {
            return "";
        }

        var aMarkup = ["<div>",
                       "<img src='", userInfo.icon, "'/>"];

        var j = aMarkup.length; // for our StringBuffer (aMarkup)
        var sQueryLength = sQuery.length;

        // Generate HTML for each hit; look for hits
        // (checking xxx_hit===1) for each field
        
        var hitFields       = this._hitFields;
        var sHtml           = {};
        var hitFieldsLength = hitFields.length;
        var reg             = new RegExp(["^(", DA.util.encode(sQuery).replace(/(?:\s|　)/, "(?:\\s|　)"), ")"].join(""));
        var i, val, offset, field;
        
        for (i = 0; i < hitFieldsLength; ++i) {
            field = hitFields[i];
            val = userInfo[field];
            if (!val || !val.indexOf) { continue; }
            if (userInfo[field+'_hit'] === 1) { 
                // Highlight this hit
                sHtml[field] = DA.util.encode(val).replace(reg, "<span style='font-weight:bold'>$1</span>");
            } else {
                sHtml[field] = DA.util.encode(val);
            }
        }

        aMarkup[j++] = "&nbsp;";
        aMarkup[j++] = sHtml.name;  // TODO: other preference?
        aMarkup[j++] = "&nbsp;";
        
        if (!DA.util.isEmpty(sHtml.email) || !DA.util.isEmpty(sHtml.keitai_mail) || !DA.util.isEmpty(sHtml.pmail1) || !DA.util.isEmpty(sHtml.pmail2)) {
            aMarkup[j++] = "&lt;";
            if (!DA.util.isEmpty(sHtml.email)) {
                aMarkup[j++] = sHtml.email; // TODO: other preference?
            } else if (!DA.util.isEmpty(sHtml.keitai_mail)) {
                aMarkup[j++] = sHtml.keitai_mail; // TODO: other preference?
            } else if (!DA.util.isEmpty(sHtml.pmail1)) {
                aMarkup[j++] = sHtml.pmail1; // TODO: other preference?
            } else if (!DA.util.isEmpty(sHtml.pmail2)) {
                aMarkup[j++] = sHtml.pemail2; // TODO: other preference?
            }
            aMarkup[j++] = "&gt;";
            aMarkup[j++] = "&nbsp;";
        }
        
        if (!DA.util.isEmpty(userInfo.gname)) {
            aMarkup[j++] = "(";
            aMarkup[j++] = userInfo.gname;
            aMarkup[j++] = ")";
        }

        aMarkup[j++] = "</div>";
        
        //   Can't view long name.
        //// Cc Bcc hidden case fix.
        //// this._oContainer.style.width = this._oTextbox.offsetWidth + "px";

        return (aMarkup.join(""));
    },

    /**
     * @property dataSource
     * @type {Object} instance of YAHOO.widget.DS_XHR
     */
    dataSource: null,

    /**
     * @method _initDataSource
     * @private
     * @param sField {String} either 'to', 'cc' or 'bcc'
     */
    _initDataSource: function(sField) {
        this.dataSource = Object.extend(new YAHOO.widget.DS_XHR(
            DA.vars.cgiRdir + "/ajx_ma_addr_search.cgi", /*script URI*/
            ["user_list", "email"]), {
                doQuery: function(oCallbackFn, sQuery, oParent) {
                    var isXML, sUri;
                    var oResponse, oSelf;
                    var responseSuccess, responseFailure, oCallback;
                    
                    if (DA.util.lock('incSearch')) {
                        isXML = (this.responseType === YAHOO.widget.DS_XHR.TYPE_XML);
                        sUri  = this.scriptURI + "?" + this.scriptQueryParam + "=" + sQuery;
                        if (this.scriptQueryAppend.length > 0) {
                            sUri += "&" + this.scriptQueryAppend;
                        }
                        sUri = DA.util.setUrl(sUri);
                        oResponse = null;
                        
                        oSelf = this;
                        /*
                         * Sets up ajax request callback
                         *
                         * @param {object} oReq          HTTPXMLRequest object
                         * @private
                         */
                        responseSuccess = function(oResp) {
                            // Response ID does not match last made request ID.
                            if (!oSelf._oConn || (oResp.tId !== oSelf._oConn.tId)) {
                                oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DataSource.ERROR_DATANULL);
                                DA.util.unlock('incSearch');
                                return;
                            }
                            if (!isXML) {
                                oResp = oResp.responseText;
                            } else { 
                                oResp = oResp.responseXML;
                            }
                            if (oResp === null) {
                                oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DataSource.ERROR_DATANULL);
                                DA.util.unlock('incSearch');
                                return;
                            }
                            
                            var aResults  = oSelf.parseResponse(sQuery, oResp, oParent);
                            var resultObj = {};
                            resultObj.query = decodeURIComponent(sQuery);
                            resultObj.results = aResults;
                            if (aResults === null) {
                                oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DataSource.ERROR_DATAPARSE);
                                aResults = [];
                            } else {
                                oSelf.getResultsEvent.fire(oSelf, oParent, sQuery, aResults);
                                oSelf._addCacheElem(resultObj);
                            }
                            oCallbackFn(sQuery, aResults, oParent);
                            DA.util.unlock('incSearch');
                        };
                        
                        responseFailure = function(oResp) {
                            oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DS_XHR.ERROR_DATAXHR);
                            DA.util.unlock('incSearch');
                            return;
                        };
                        
                        oCallback = {
                            success:responseSuccess,
                            failure:responseFailure
                        };
                        
                        if (!isNaN(this.connTimeout) && this.connTimeout > 0) {
                            oCallback.timeout = this.connTimeout;
                        }
                        
                        if (this._oConn) {
                            this.connMgr.abort(this._oConn);
                        }
                        
                        oSelf._oConn = this.connMgr.asyncRequest("GET", sUri, oCallback, null);
                    }
                }
            });
        this.dataSource.scriptQueryAppend = "field=" + sField; // TODO: null/empty check?
        this.dataSource.scriptQueryParam = "keyword";
    },
    
    // Enter fix.
    /**
     * @method _isIgnoreKey
     * @private
     * @param nKeyCode {int}
     */
    _isIgnoreKey: function(nKeyCode) {
        if ((nKeyCode === 9)  || // tab
            (nKeyCode === 16) || (nKeyCode === 17) || // shift, ctl
            (nKeyCode >= 18 && nKeyCode <= 20) || // alt,pause/break,caps lock
            (nKeyCode === 27) || // esc
            (nKeyCode >= 33 && nKeyCode <= 35) || // page up,page down,end
            (nKeyCode >= 36 && nKeyCode <= 38) || // home,left,up
            (nKeyCode === 40) || // down
            (nKeyCode >= 44 && nKeyCode <= 45)) { // print screen,insert
            return true;
        }
        return false;
    },
    
    /**
     * @method _onTextboxKeyup
     * @private
     * @param :TODO
     */
    _onTextboxKeyUp: function(v,oSelf) {
        // Check to see if any of the public properties have been updated
        oSelf._initProps();
        
        var nKeyCode = v.keyCode;
        oSelf._nKeyCode = nKeyCode;
        var sText = this.value; //string in textbox
        
        // Filter out chars that don't trigger queries
        if (oSelf._isIgnoreKey(nKeyCode) || (sText.toLowerCase() === oSelf._sCurQuery)) {
            return;
        } else if (sText.length > 100) {
            return;
        } else {
            oSelf.textboxKeyEvent.fire(oSelf, nKeyCode);
        }
        
        // Set timeout on the request
        var nDelayID;
        if (nKeyCode === Event.KEY_RETURN) {
            if (oSelf._nDelayID !== -1) {
                clearTimeout(oSelf._nDelayID);
            }
            oSelf._sendQuery(sText);
        } else if (oSelf.queryDelay > 0) {
            oSelf._toggleContainer(false);
            nDelayID =
                setTimeout(function(){oSelf._sendQuery(sText);},(oSelf.queryDelay * 1000));
            
            if (oSelf._nDelayID !== -1) {
                clearTimeout(oSelf._nDelayID);
            }
            
            oSelf._nDelayID = nDelayID;
        } else {
            // No delay so send request immediately
            oSelf._sendQuery(sText);
        }
    },
	
    /**
     * @method _onTextboxKeyPress
     * @private
     * @param :TODO
     */	
	_onTextboxKeyPress: function(v,oSelf) {
    var nKeyCode = v.keyCode;
	oSelf._cancelIntervalDetection(oSelf);
	
        //Expose only to Mac browsers, where stopEvent is ineffective on keydown events (bug 790337)
        var isMac = (navigator.userAgent.toLowerCase().indexOf("mac") !== -1);
        if(isMac) {
            switch (nKeyCode) {
            case 9: // tab
                if(oSelf.delimChar && (oSelf._nKeyCode !== nKeyCode)) {
                    if(oSelf._bContainerOpen) {
                        YAHOO.util.Event.stopEvent(v);
                    }
                }
                break;
            case 13: // enter
                    if(oSelf._nKeyCode !== nKeyCode) {
                        if(oSelf._bContainerOpen) {
                            YAHOO.util.Event.stopEvent(v);
                        }
                    }
                break;
            case 38: // up
            case 40: // down
                YAHOO.util.Event.stopEvent(v);
                break;
            default:
                break;
            }
        }

        // IME Mode detected For firefox
        else if(nKeyCode === 229) {
			if(oSelf.queryDelay > 0) {
				oSelf._onIMEDetected(oSelf);
	        	oSelf._queryInterval = setInterval(
					function() {
						oSelf._onIMEDetected(oSelf); 
					},
					(oSelf.queryDelay * 1000)
				);				
			} else {
				oSelf._onIMEDetected(oSelf);
	        	oSelf._queryInterval = setInterval(
					function() {
						oSelf._onIMEDetected(oSelf); 
					},
					(500)
				);
			}
		}
	},
    
    /**
     * This will override the _selectItem method (YAHOO.widget.AutoComplete._selectItem)
     * if an InformationListController (DA.ug.InformationListController) is specified
     * as a constructor argument
     * TODO: more comments
     * @method _listController_selectItem
     * @private 
     */
    _listController_selectItem: function (oItem) {
        this._bItemSelected = true;
        var oResultData = oItem._oResultData;
        if (oResultData && oResultData[1]) { 
        	//add the bulk address
        	if(DA.vars.ugType.bulk === oResultData[1].type){
        		this._openBulk(oResultData[1]);
        	}else{
            this.listController.addList( [ oResultData[1] ] );
        }
        }
        // reset the text-box to only the saved query
        // (i.e., only the text that wa entered fully by the user 
        // without any autocompletion)
        //// this._oTextbox.value = this._sSavedQuery ? this._sSavedQuery.replace(/\,+$/, "") : "";
        this._oTextbox.value = this._sSavedQuery ? this._sSavedQuery : "";
        this._cancelIntervalDetection(this);
        this.itemSelectEvent.fire(this, oItem, oResultData);
        this._toggleContainer(false);
        var itemObj = YAHOO.util.Dom.get('da_messageEditorItemGroupNameOuter');
        if(this.listController.groupExists()) {
        	this._showGroupName(itemObj);
        } else {
        	this._hideGroupName(itemObj);
		}
    },

	_showGroupName: function(itemObj) {
		if (itemObj && itemObj.style.display === 'none') {
   			itemObj.style.display = '';
  		}
	},
	_hideGroupName: function(itemObj) {
		if (itemObj && itemObj.style.display === '') {
			itemObj.style.display = 'none';
		}
	},

    /**
     * Overriding doBeforeExpandContainer to set the container size; this enables
     * scrolling if the number of results to display exceeds maxResultsBeforeScroll
     */
    doBeforeExpandContainer: function(oTextbox, oContainer, sQuery, aResults) {
        var nResults = aResults? aResults.length : 0;
        oContainer._oContent.style.height = 
                ( Math.min(nResults, this.maxResultsBeforeScroll) * this.resultRowHeight ) + 
                4 + /*FIXME: hard-coded approximation for header+footer height*/
                "px";
        if (BrowserDetect.browser === 'Explorer') {
        	oContainer._oContent.style.width = "100%"; /* TODO Realtime resize */
        } else {
        	oContainer._oContent.style.width = "80%";
        }
        return nResults > 0;
    },

    // FIXME: The spec wants this to be 20, but I'm using 10 because 10 seems easier for testing
    maxResultsBeforeScroll: 20,

    maxResultsDisplayed: DA.vars.system.max_incsearch_hits?parseInt(DA.vars.system.max_incsearch_hits, 10): 100,

    // FIXME: make this dynamically updateable
    resultRowHeight: 18,

    /**
     * The number of seconds to wait before firing requests for each key down event
     * @property queryDelay
     * @protected
     * @type {Float} Seconds
     */
    queryDelay: DA.vars.system.inc_search_interval ? 
            parseFloat(DA.vars.system.inc_search_interval, 10) : // From the config settings
            0.25, // Default, if no config

    /**
     * The minimum characters a user needs to key in before autocompletion kicks in.
     * @property minQueryLength
     * @type {Number}
     */
    minQueryLength: DA.vars.system.inc_search_min_chars ?
            parseInt(DA.vars.system.inc_search_min_chars, 10) :  // From the config settings
            1, // Default to 1 (YUI recommendation)

	_openBulk: function(oResultData){
		var me = this;
        var io = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_addr.cgi' );
        io.callback = function(o) {
            if (DA.mailer.util.checkResult(o)) {
            	me.listController.addList(o.user_list);
            }
        };

        io.errorHandler = function(e) {
            DA.util.warn(DA.locale.GetText.t_("BULKINFO_ERROR"));
        };
        
        io.execute({
            proc: 'extract',
            aid: oResultData.id,
            lang: oResultData.lang
        });
    }
});




