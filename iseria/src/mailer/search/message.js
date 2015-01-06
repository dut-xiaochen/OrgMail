/* $Id: message.js 2482 2014-09-29 01:49:42Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/search/message.js $ */
/*jslint evil: true */
/*for JSLINT undef checks*/
/*extern DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.mailer || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Message searcher widget. 
 * 
 * Usage: 
 *   var mv = new DA.mailer.MessageSearcher();
 * 
 * @class MessageSearcher
 * @uses 
 * @constructor
 * TODO: message
 */
DA.mailer.MessageSearcher = function(itemNode, gridNode, cbhash, folderTreeData) {
    this.itemNode = itemNode;
    this.itemId   = itemNode.id;
    this.gridNode = gridNode;
    this.gridId   = gridNode.id;
    this.folderTreeData = folderTreeData;
    
    if (DA.util.isFunction(cbhash.onSearch)) {
        this.onSearch = cbhash.onSearch;
    }
    
    if (DA.vars.custom.searcher.setMessageSearcher) {
    	eval(DA.vars.custom.searcher.setMessageSearcher);
    }
    this.init();
	if (DA.vars.custom.searcher.setMessageSearcher2) {
		eval(DA.vars.custom.searcher.setMessageSearcher2);
	}
};

/**
 * Members
 */
DA.mailer.MessageSearcher.prototype = {
    
    itemNode: null,
    
    itemId : null,
    
    gridNode: null,
    
    gridId: null,
    
    guideNode: null,
    
    nomatchNode: null,
    
    resultNode: null,
    
    resultFolderNode: null,
    
    resultTotalNode: null,
    
    itemContentsNode: null,
    
    selectedFid: null,
    
    selectedSrid: null,
    
    selectFolderType: null,
    
    folderName: null,
    
    totalMessages: null,
    
    jsonIO: null,

    folderTreeData: null,
    
    /**
     * Search Function.
     */
    onSearch: Prototype.emptyFunction,
    
    init: function() {
        var me = this;
        
        var item = document.createElement('div');
        item.id = this.itemId + 'Contents';
        item.className = 'da_messageSearcherItem';
        var guide = document.createElement('div');
        guide.innerHTML = DA.locale.GetText.t_('SEARCH_MESSAGE_GUIDE') + '<br>' +
                          '<input type=button id="da_messageSearcherSubmit" value="' + DA.locale.GetText.t_('SEARCH_BUTTON') + '">' +
                          '<hr>';
        guide.className = 'da_messageSearcherGuide';
        var nomatch = document.createElement('div');
        nomatch.className = 'da_messageSearcherNomatch';
        nomatch.innerHTML = DA.locale.GetText.t_('SEARCH_NOMATCH');
        var result = document.createElement('div');
        result.className = 'da_messageSearcherResult';
        
        this.itemNode.appendChild(item);
        this.itemNode.appendChild(guide);
        this.itemNode.appendChild(nomatch);
        this.itemNode.appendChild(result);
        this.itemContentsNode = item;
        this.guideNode   = guide;
        this.nomatchNode = nomatch;
        this.resultNode  = result;
        
        var resultChild = DA.widget.makeATable(
            2,
            [
                { width: "5%"  },
                { width: "95%" }
            ],
            {
                table: "da_messageSearcherResultTable",
                td:    "da_messageSearcherResultTd"
            }, 
            [
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_FID'),
                    '<div id="da_messageSearcherResultFolder">&nbsp;</div>'
                ],
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_TOTAL'),
                    '<div id="da_messageSearcherResultTotal">&nbsp;</div>'
                ]
            ]
        );
        result.appendChild(resultChild);
        this.hideNomatch();
        this.hideResult();
        this.resultFolderNode = YAHOO.util.Dom.get('da_messageSearcherResultFolder');
        this.resultTotalNode  = YAHOO.util.Dom.get('da_messageSearcherResultTotal');
        
        var itemChild = DA.widget.makeATable(
            4,
            [
                { width: "5%"  },
                { width: "95%" }
            ],
            {
                table: "da_messageSearcherItemTable",
                td:    "da_messageSearcherItemTd"
            }, 
            [
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_FID'),
                    '<select id="da_messageSearcherItemFid">' + DA.vars.options.folder_tree + '</select>&nbsp;' +
                    '<input type=checkbox id="da_messageSearcherItemClass">&nbsp;' + DA.locale.GetText.t_('SEARCH_CHECKBOXMESSAGE_CLASS')
                ],
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_KEYWORD'),
                    '<input type=text id="da_messageSearcherItemKeyword" style="height:1.5em; margin-right:2px" size="50" maxlength="200">' +
                    '<select id="da_messageSearcherItemCond" size=1>' +
                    '<option value="and">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_COND_AND') + '</option>' +
                    '<option value="or">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_COND_OR') + '</option>' +
                    '</select>'
                ],
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_FIELD'),
                    '<select id="da_messageSearcherItemField" size=1>' +
                    '<option value="text">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_TEXT') + '</option>' +
                    '<option value="body">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_BODY') + '</option>' +
                    '<option value="subject">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_SUBJECT') + '</option>' +
                    '<option value="from">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_FROM') + '</option>' +
                    '<option value="to">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_TO') + '</option>' +
                    '<option value="cc">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_CC') + '</option>' +
                    '<option value="bcc">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_BCC') + '</option>' +
                    '<option value="group">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_GROUP') + '</option>' +
                    '</select>'
                ],
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_NORROWING'),
                    '<div id="' + this.itemId + 'NORROWING"></div>'
                ]
            ]
        );
        this.itemContentsNode.appendChild(itemChild);
        
        this.nvPairs = new DA.widget.NVPairSet(
            YAHOO.util.Dom.get(this.itemId + 'NORROWING'), {
                Seen: {
                    name:  DA.locale.GetText.t_('SEARCH_RADIONAME_SEEN'),
                    value: '<input type=radio id="da_messageSearcherItemSeen_0" name="seen" value="0" checked>&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_SEEN_ALL') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherItemSeen_1" name="seen" value="1">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_SEEN_UNSEEN') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherItemSeen_2" name="seen" value="2">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_SEEN_SEEN'),
                    border: false,
                    weight: false
                },
                Flagged: {
                    name:  DA.locale.GetText.t_('SEARCH_RADIONAME_FLAGGED'),
                    value: '<input type=radio id="da_messageSearcherFlagged_0" name="flagged" value="0" checked>&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_FLAGGED_ALL') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherFlagged_1" name="flagged" value="1">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_FLAGGED_UNFLAGGED') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherFlagged_2" name="flagged" value="2">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_FLAGGED_FLAGGED'),
                    border: false,
                    weight: false
                },
                Attachment: {
                    name:  DA.locale.GetText.t_('SEARCH_RADIONAME_ATTACHMENT'),
                    value: '<input type=radio id="da_messageSearcherAttachment_0" name="attachment" value="0" checked>&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_ATTACHMENT_ALL') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherAttachment_1" name="attachment" value="1">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_ATTACHMENT_NOEXISTS') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherAttachment_2" name="attachment" value="2">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_ATTACHMENT_EXISTS'),
                    border: false,
                    weight: false
                },
                Priority: {
                    name:  DA.locale.GetText.t_('SEARCH_RADIONAME_PRIORITY'),
                    value: '<input type=radio id="da_messageSearcherItemPriority_0" name="priority" value="0" checked>&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_PRIORITY_ALL') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherPriority_5" name="priority" value="5">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_PRIORITY_LOW') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherPriority_3" name="priority" value="3">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_PRIORITY_NORMAL') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherPriority_1" name="priority" value="1">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_PRIORITY_HIGH'),
                    border: false,
                    weight: false
                },
                ETC: {
                    name:  DA.locale.GetText.t_('SEARCH_RADIONAME_ETC'),
                    value: '<input type=checkbox id="da_messageSearcherItemToself">&nbsp;' + DA.locale.GetText.t_('SEARCH_CHECKBOXMESSAGE_TOSELF') + '<br>' +
                           '<input type=checkbox id="da_messageSearcherItemDeleted">&nbsp;' + DA.locale.GetText.t_('SEARCH_CHECKBOXMESSAGE_DELETED'),
                    border: false,
                    weight: false
                }
            }, [], true
        );
                
        this.jsonIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_search.cgi' );
        
        YAHOO.util.Event.addListener(YAHOO.util.Dom.get('da_messageSearcherSubmit'), "click", this.search, this, true);
    },
    
    select: function(fid) {
        DA.dom.changeSelectedIndex('da_messageSearcherItemFid', fid);
    },
    
    search: function() {
        var me = this;
        var fid, cl, keyword, cond, field, seen, flagged, attachment, priority, toself, deleted;
        
        if (me.lock()) {
            fid        = DA.dom.selectValue('da_messageSearcherItemFid');
            cl         = (DA.dom.checkedOk('da_messageSearcherItemClass')) ? '2' : '1';
            keyword    = DA.dom.textValue('da_messageSearcherItemKeyword');
            cond       = DA.dom.selectValue('da_messageSearcherItemCond');
            field      = DA.dom.selectValue('da_messageSearcherItemField');
            seen       = DA.dom.radioValue('seen');
            flagged    = DA.dom.radioValue('flagged');
            attachment = DA.dom.radioValue('attachment');
            priority   = DA.dom.radioValue('priority');
            toself     = (DA.dom.checkedOk('da_messageSearcherItemToself')) ? '2' : '0';
            deleted    = (DA.dom.checkedOk('da_messageSearcherItemDeleted')) ? '0' : '1';
            
            if (!keyword.match(/^\s*$/)) {
                DA.waiting.show(DA.locale.GetText.t_("SEARCH_OPERATING_PROMPT"));
                
                me.jsonIO.callback = function(o) {
                
                    if (DA.mailer.util.checkResult(o)) {
                        me.selectedFid   = o.fid;
                        me.selectedSrid  = o.srid;
                        me.folderName    = o.target;
                        me.totalMessages = o.total.messages;
                        
                        if (o.over === 1) {
                            DA.util.warn(DA.locale.GetText.t_('SEARCH_OVER_WARN', DA.vars.system.max_search_hit));
                        }
                        
                        if (o.total.messages > 0) {
                            me.hideNomatch();
                            me.showResult();
                            me.showGrid();
                            me.onSearch(o);
                        } else {
                            me.hideResult();
                            me.hideGrid();
                            me.showNomatch();
                        }
                    } else {
                        me.hideResult();
                    }
                    
                    me.unlock();
                    DA.waiting.hide();
                };
                
                me.jsonIO.errorHandler = function(e) {
                    DA.util.warn(DA.locale.GetText.t_("SEARCH_ERROR"));
                    
                    me.unlock();
                    DA.waiting.hide();
                };
                
                me.jsonIO.execute({
                    proc       : 'search',
                    fid        : fid,
                    'class'    : cl,
                    keyword    : keyword,
                    cond       : cond,
                    field      : field,
                    seen       : seen,
                    flagged    : flagged,
                    attachment : attachment,
                    priority   : priority,
                    toself     : toself,
                    deleted    : deleted
                });
                
                me.unlock();
            } else {
                DA.util.warn(DA.locale.GetText.t_('SEARCH_KEYWORD_EMPTY'));
                
                me.unlock();
            }
        }
    },
    
    showNomatch: function() {
        this.nomatchNode.style.display = '';
    },
    
    hideNomatch: function() {
        this.nomatchNode.style.display = 'none';
    },
    
    showResult: function() {
        this.resultFolderNode.innerHTML = DA.util.encode(this.folderName);
        this.resultTotalNode.innerHTML  = DA.locale.GetText.t_('MESSAGES', DA.util.encode(this.totalMessages));
        this.resultNode.style.display   = "";
    },
    
    hideResult: function() {
        this.resultNode.style.display = "none";
    },
    
    showGrid: function() {
        this.gridNode.style.visibility = '';
    },
    
    hideGrid: function() {
        this.gridNode.style.visibility = 'hidden';
    },
    
    lock: function() {
        if (DA.util.lock('messageSearcher')) {
            return true;
        } else {
            return false;
        }
    },
    
    unlock: function() {
        return DA.util.unlock('messageSearcher');
    },
    
    existsLock: function() {
        return DA.util.existsLock('messageSearcher');
    }
    
};

