/* $Id: popup.js 2508 2014-11-04 11:49:32Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/menu/popup.js $ */
/*for JSLINT undef checks*/
/*extern BrowserDetect DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/**
 * Builds a popup Menu.
 * @constructor
 * @class PopupMenuController
 * @namespace DA.widget
 */

DA.widget.PopupMenuController = function(popupId, triggerId, menuData, cbhash){
    this.popupId     = popupId;
    this.triggerId   = triggerId;
    this.triggerNode = YAHOO.util.Dom.get(triggerId);
    this.menuData    = menuData;
    
    if (DA.util.isFunction(cbhash.onTrigger)) {
        this.onTrigger = cbhash.onTrigger;
    }
    
    this.init();
};

DA.widget.PopupMenuController.prototype = {
    
    popupId: null,
    
    popupNode: null,
    
    triggerId: null,
    
    triggerNode: null,
    
    menuData: null,
    
    itemData: null,
    
    popupMenu: null,
    
    onTrigger: Prototype.emptyFunction,
    
    /**
     * @method init
     * @description init a popup menu.
     */
    init: function() {
        this.popupNode = DA.dom.createDiv(this.popupId);
        this.popupNode.style.visibility = 'hidden';
        
        YAHOO.util.Dom.addClass(this.popupNode, 'da_popupMenu' + this._className());
        YAHOO.util.Event.addListener(window.document, "click", this._onTrigger, this, true);
        YAHOO.util.Event.addListener(window.document, "contextmenu", this.cancel, this, true);
    },
    
    _onTrigger: function(e) {
        if (DA.event.onClick(e)) {
            if (this.onTrigger(e)) {
                this.position(e.clientX + 1, e.clientY + 1);
                this.show();
            } else {
                this.cancel();
            }
        } else {
            this.cancel();
        }
    },
    
    _onClick: function(e) {
        var el = YAHOO.util.Event.getTarget(e);
        var func;
         
        if (el && el.id && el.id.match(/MenuItem\_([^\_]+)\_[^\_]+$/)) {
            func  = RegExp.$1;
            if (!this._disabled(func)) {
                // TODO: test if func yeilds and actual function (NPE check)
                this._onclick(func)(e, this._args(func));
            }
        }
    },
    
    _className: function() {
        if (DA.util.isEmpty(this.menuData.className)) {
            return '';
        } else {
            return ' ' + this.menuData.className;
        }
    },
    
    _func: function(i, j) {
        return this.menuData.order[i][j];
    },
    
    _id: function(func) {
        return this.popupId + 'MenuItem_' + func;
    },
    
    _text: function(func) {
        return this.menuData.items[func].text;
    },
    _title: function(func) {
        return this.menuData.items[func].title;
    },  
    _onclick: function(func) {
        return this.menuData.items[func].onclick;
    },
    
    _args: function(func) {
        return this.menuData.items[func].args;
    },
    
    _selected: function(func) {
        if (DA.util.isEmpty(this.menuData.items[func].selected)) {
            return false;
        } else {
            return this.menuData.items[func].selected;
        }
    },
    
    _disabled: function(func) {
        if (DA.util.isEmpty(this.menuData.items[func].disabled)) {
            return false;
        } else {
            return this.menuData.items[func].disabled;
        }
    },
    
    _hidden: function(func) {
        if (DA.util.isEmpty(this.menuData.items[func].hidden)) {
            return false;
        } else {
            return this.menuData.items[func].hidden;
        }
    },
    
    text: function(func, text) {
        this.menuData.items[func].text = text;
    },
    
    onclick: function(func, onclick) {
        this.menuData.items[func].onclick = onclick;
    },
    
    args: function(func, args) {
        this.menuData.items[func].args = args;
    },
    
    enabled: function(func) {
        this.menuData.items[func].disabled = false;
    },
    
    disabled: function(func) {
        this.menuData.items[func].disabled = true;
    },
    
    visible: function(func) {
        this.menuData.items[func].hidden = false;
    },
    
    hidden: function(func) {
        this.menuData.items[func].hidden = true;
    },
    
    /**
     * @method show
     * @description Show or hidden the popup menu.
     * @param {Object} itemData Data of popup menu.
     * @public
     */
    show: function() {
        var i, j, l, s, d, t,ti,title;
        var me   = this;
        var html = '<div oncontextmenu="return false;">';
        var iLength, jLength, node;
        var BLink, T_link;
		var overColor = "this.style.background='#e0e0e0'";
        var outColor = "this.style.background='#efefef fixed top'"; 
        iLength = this.menuData.order.length;

        if (DA.vars.custom.menu.setPopupMenu) {
             eval(DA.vars.custom.menu.setPopupMenu);
        }

        for (i = 0; i < iLength; i ++) {
            l = '';
            jLength = this.menuData.order[i].length;
            for (j = 0; j < jLength; j ++) {
                if (!this._hidden(this._func(i, j))) {
                    s  = (this._selected(this._func(i, j))) ? ' selected' : '';
                    d  = (this._disabled(this._func(i, j))) ? ' disabled' : '';
                    t  = (this.menuData.encode === false) ? this._text(this._func(i, j)) : DA.util.encode(this._text(this._func(i, j)));
                    if (this.menuData.className === 'da_messageViewerHeaderAttachmentPulldownMenu') {
                    	ti  = (this.menuData.encode === false) ? this._title(this._func(i, j)) : DA.util.encode(this._title(this._func(i, j)));
                    	title = 'title="'+ti+'"';
                    }
                    l += '<li id="' + this._id(this._func(i, j)) + '_li" class="da_popupMenuItem' + s + d + this._className()+'"'+ title+ '>' +
                         '<a id="' + this._id(this._func(i, j)) + '_a" class="' + s + d + '">' + t + '</a>' +
                         '</li>';
                }
            }
            if ((this.menuData.className === 'da_messageViewerHeaderAttachmentPulldownMenu') && DA.vars.config.soft_install === 1){
            	if(jLength >= 2){
                    BLink = this.menuData.items[0].args.toString();
                    T_link = BLink.replace(/(.;)/g,", 'all'$1");
                    l += '</ul><ul><li id="message_headerAttachmentIconPopupMenuItem_downAll_li" class="da_popupMenuItem" '+
                        'onmouseover="'+overColor+';"'+
                        'onmouseout="'+outColor+';" onclick="'+T_link+'">'+ DA.imageLoader.tag(DA.vars.imgRdir + '/ico_fc_download.gif', '', { align: 'absmiddle' }) + DA.locale.GetText.t_('B_DOWNLOAD') + '</li>'; 
                }
                l += '<li id="message_headerAttachmentIconPopupMenuItem_saveAttaches_li" class="da_popupMenuItem" '+
                    'onmouseover="'+overColor+';"'+
                    'onmouseout="'+outColor+';" onclick="window.__messageViewer.showsaveattachestolibdialog(event.clientX,event.clientY);">'+ DA.imageLoader.tag(DA.vars.imgRdir + '/ico_fc_docsave.gif', '', { align: 'absmiddle' }) + DA.locale.GetText.t_('MESSAGE_SAVEATTACHESTOLIB_MENU') + '</li>';
            }
            if (!DA.util.isEmpty(l)) {
                html += '<ul>' + l + '</ul>';
            }
        }
        
        html += '</div>';
        
        this.popupNode.innerHTML = html;
        
        iLength = this.menuData.order.length;
        for (i = 0; i < iLength; i ++) {
            jLength = this.menuData.order[i].length;
            for (j = 0; j < jLength; j ++) {
                if (!this._hidden(this._func(i, j)) && !this._disabled(this._func(i, j))) {
                    node = YAHOO.util.Dom.get(this._id(this._func(i, j)) + '_li');
                    node.onmouseover = function(e) {
                        YAHOO.util.Dom.addClass(this, 'selected');
                    };
                    node.onmouseout = function(e) {
                        YAHOO.util.Dom.removeClass(this, 'selected');
                    };
                    YAHOO.util.Event.addListener(node, "click", this._onClick, this, true);
                }
            }
        }
        
        this.adjustPosition();
        DA.shim.open(this.popupNode);
        
        this.popupNode.style.visibility = '';
    },
    
    /**
     * @method cancel
     * @description cancel the dialog.
     * @public
     */
    cancel: function() {
        if (this.visibility()) {
            this.popupNode.style.visibility = 'hidden';
            DA.shim.close(this.popupNode);

            this.onCancel();
        }
    },

    /**
     * @prototype onCancel 
     * @type {function} callback executed when the menu/popup is hidden/cancelled.
     */
    onCancel: Prototype.emptyFunction,
    
    position: function(x, y) {
        DA.dom.position(this.popupNode, x, y);
    },
    
    adjustPosition: function() {
        DA.dom.adjustPosition(this.popupNode);
    },
    
    visibility: function() {
        if (this.popupNode.style.visibility === 'hidden') {
            return false;
        } else {
            return true;
        }
    }

};

/**
 * Builds a popup Menu.
 * FIXME: JSDOC for the params
 * @constructor
 * @class PopupMenuNoTrigger
 * @namespace DA.widget
 */

DA.widget.PopupMenuNoTrigger = function(popupId, menuData, cbhash){
    this.popupId  = popupId;
    this.menuData = menuData;
    
    if (DA.util.isFunction(cbhash.onTrigger)) {
        this.onTrigger = cbhash.onTrigger;
    }
    
    this.init();
};

Object.extend(DA.widget.PopupMenuNoTrigger.prototype, DA.widget.PopupMenuController.prototype);
DA.widget.PopupMenuNoTrigger.prototype.init = function() {
    this.popupNode = DA.dom.createDiv(this.popupId);
    this.popupNode.style.visibility = 'hidden';
    
    YAHOO.util.Dom.addClass(this.popupNode, 'da_popupMenu' + this._className());
    YAHOO.util.Event.addListener(window.document, "click", this._onTrigger, this, true);
    YAHOO.util.Event.addListener(window.document, "contextmenu", this.cancel, this, true);
    
    DA.widget.PopupMenuManager.registMenu(this.popupId, this);
};
DA.widget.PopupMenuNoTrigger.prototype._onTrigger = function(e) {
    if (!DA.event.onClick(e) || !this.onTrigger(e)) {
        this.cancel();
    }
};

/**
 * Builds a context Menu.
 * FIXME: JSDOC for the params
 * @constructor
 * @class ContextMenuController
 * @namespace DA.widget
 */

DA.widget.ContextMenuController = function(popupId, triggerId, menuData, cbhash){
    this.popupId     = popupId;
    this.triggerId   = triggerId;
    this.triggerNode = YAHOO.util.Dom.get(triggerId);
    this.menuData    = menuData;
    
    if (DA.util.isFunction(cbhash.onTrigger)) {
        this.onTrigger = cbhash.onTrigger;
    }
    /**
     * FIXME: this looks like repetitive code...
     */
    if (DA.util.isFunction(cbhash.onCancel)) {
        this.onCancel = cbhash.onCancel;
    }
    
    this.init();
};

Object.extend(DA.widget.ContextMenuController.prototype, DA.widget.PopupMenuController.prototype);
DA.widget.ContextMenuController.prototype.init = function() {
    this.popupNode = DA.dom.createDiv(this.popupId);
    this.popupNode.style.visibility = 'hidden';

    YAHOO.util.Dom.addClass(this.popupNode, 'da_popupMenu' + this._className());
    if (BrowserDetect.browser === 'Explorer') {
        YAHOO.util.Event.addListener(window.document, "contextmenu", this._onTrigger, this, true);
        YAHOO.util.Event.addListener(window.document, "click", this.cancel, this, true);
    } else {
        YAHOO.util.Event.addListener(window.document, "click", this._onTrigger, this, true);
    }
    
    DA.widget.PopupMenuManager.registMenu(this.popupId, this);
};
DA.widget.ContextMenuController.prototype._onTrigger = function(e) {
    if (DA.event.onContextMenu(e)) {
        if (this.onTrigger(e)) {
            this.position(e.clientX + 1, e.clientY + 1);
            this.show();
        } else {
            this.cancel();
        }
    } else {
        this.cancel();
    }
};

/**
 * Builds a pulldown Menu.
 * @constructor
 * @class PulldownMenuController
 * @namespace DA.widget
 */

DA.widget.PulldownMenuController = function(popupId, triggerId, menuData, cbhash){
    this.popupId     = popupId;
    this.triggerId   = triggerId;
    this.triggerNode = YAHOO.util.Dom.get(triggerId);
    this.menuData    = menuData;
    
    if (DA.util.isFunction(cbhash.onTrigger)) {
        this.onTrigger = cbhash.onTrigger;
    }
    
    this.init();
};

Object.extend(DA.widget.PulldownMenuController.prototype, DA.widget.PopupMenuController.prototype);
DA.widget.PulldownMenuController.prototype.init = function() {
    this.popupNode = DA.dom.createDiv(this.popupId);
    this.popupNode.style.visibility = 'hidden';

    YAHOO.util.Dom.addClass(this.popupNode, 'da_popupMenu' + this._className());
    YAHOO.util.Event.addListener(window.document, "click", this._onTrigger, this, true);
    YAHOO.util.Event.addListener(window.document, "contextmenu", this.cancel, this, true);
    
    DA.widget.PopupMenuManager.registMenu(this.popupId, this);
};
DA.widget.PulldownMenuController.prototype._onTrigger = function(e) {
    if (DA.event.onClick(e)) {
        if (this.onTrigger(e)) {
            if (this.visibility()) {
                this.cancel();
            } else {
                this.position(e.clientX + 1, e.clientY + 1);
                this.show();
            }
        } else {
            this.cancel();
        }
    } else {
        this.cancel();
    }
};

DA.widget.PopupMenuManager = {
    data: {},
    
    registMenu: function(id, r) {
        this.data[id] = r;
    },
    
    allCancel: function() {
        var id;
        for (id in this.data) {
            if (!DA.util.isFunction(this.data[id])) {
                this.data[id].cancel();
            }
        }
    }
};
