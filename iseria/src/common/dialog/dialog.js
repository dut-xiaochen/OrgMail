/* $Id: dialog.js 2482 2014-09-29 01:49:42Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/dialog/dialog.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
var BrowserDetect = window.BrowserDetect;
/**
 * Builds a Dialog with a YUI container widget.
 * @constructor
 * @param {HTMLElement}	node The element representing the Dialog
 * TODO: write
 * @class Dialog
 * @namespace DA.widget
 */

DA.widget.Dialog = function(nodeId, hash, buttons, cbhash) {
    this.nodeId   = nodeId;
    this.buttons  = buttons;
    
    this.setWidth(hash.width);
    this.setHead(hash.head);
    this.setBody(hash.body);
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

DA.widget.Dialog.prototype = {

    node: null,

    nodeId: null,
    
    head: null,
    
    body: null,
    
    width: null,
    
    buttons: null,
    
    dialog: null,
    
    focusId: null,
    
    /**
     * Enter Function.
     */
    onEnter: function() {
        return true;
    },
    
    /**
     * Cancel Function.
     */
    onCancel: function() {
        return true;
    },
    
    _headId: function() {
        return this.nodeId + '_hd';
    },
    
    _bodyId: function() {
        return this.nodeId + '_bd';
    },
    
    childId: function(id) {
        return this.nodeId + '_' + id;
    },
    
    childClass: function(id) {
        return this.nodeId + '_' + id;
    },
        
    /**
     * set dialog
     * @method setDialog
     * @public
     */
    setDialog: function() {
        var node = DA.dom.createDiv(this.nodeId);
        var html = '<div id="' + this._headId() + '" class="hd">' + this.head + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>' +
                   '<div id="' + this._bodyId() + '" class="bd">' + this.body + '</div>';        
        
        this.node = node;
        this.node.innerHTML = html;
        
        this.dialog = new YAHOO.widget.Dialog(this.nodeId, {
            width: this.width,
            visible: false,
            constraintoviewport: true,
            buttons: (DA.util.isEmpty(this.buttons)) ? undefined : this.buttons,
            zindex: 200
        });
        
        this.dialog.render();
    
    },
    
    setHead: function(head) {
        this.head = head;
    },
    
    setBody: function(body) {
        this.body = body;
    },
    
    setWidth: function(width) {
        this.width = width;
    },
    
    setCbhash: function(cbhash) {
        if (DA.util.isFunction(cbhash.onEnter)) {
            this.onEnter = cbhash.onEnter;
        }
        if (DA.util.isFunction(cbhash.onCancel)) {
            this.onCancel = cbhash.onCancel;
        }
    },
    
    setListener: function() {
    },
    
    _enter: function() {
        if (this.onEnter()) {
            this.hide();
        }
    },
    
    _cancel: function() {
        if (this.onCancel()) {
            this.hide();
        }
    },
    
    /**
     * Show dialog on position (x, y).
     * @method show
     * @param {String} x Dialog's left.
     * @param {String} y Dialog's top.
     * @public
     */
    show: function(x, y) {
        if (DA.util.isNumber(x) && DA.util.isNumber(y)) {
            this.position(x, y);
        }
        this.dialog.show();
        if (this.focusId) {
            YAHOO.util.Dom.get(this.focusId).focus();
        }
    },
    
    /**
     * Hide the dialog
     * @method hide
     * @public
     */
    hide: function() {
        this.dialog.hide();
    },
    
    /**
     * reset the dialog
     * @mehotd reset
     * @public
     */
     
    position: function(x, y) {
        this.dialog.moveTo(x, y);
    },
    
    reset: function(head, body) {
        this.dialog.setHeader(head);
        this.dialog.setBody(body);
        this.setListener();
    },
    
    refresh: function() {
        this.dialog.setHeader(this.head);
        this.dialog.setBody(this.body);
        this.setListener();
    },
    
    remove: function() {
        this.node.innerHTML = "";
        this.node.parentNode.removeChild(this.node);
    }
};

/**
 * Builds a Message Dialog with a YUI container widget.
 * @constructor
 * @param {HTMLElement}	node the element representing the Dialog
 * @class MessageDialog
 * @namespace DA.widget
 */

DA.widget.MessageDialog = function(nodeId, title, message, cbhash) {
    this.nodeId = nodeId;

    this.setHead(title);
    this.setBody(message);
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

Object.extend(DA.widget.MessageDialog.prototype, DA.widget.Dialog.prototype);
DA.widget.MessageDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.widget.MessageDialog.prototype.setBody = function(message) {
    message = (DA.util.isEmpty(message)) ? '' : message;
    
    this.body = DA.util.encode(message) +
                '<input type=button id="' + this.childId('ok') + '" class="' + this.childClass('ok') + '" value="' + DA.locale.GetText.t_("DIALOG_OK_BUTTON") + '">';
};
DA.widget.MessageDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('ok'), "click", this._enter, this, true);
};

/**
 * Builds a String Changer Dialog with a YUI container widget.
 * @constructor
 * @param {HTMLElement}	node the element representing the Dialog
 * @class StringChangerDialog
 * @namespace DA.widget
 */
 
DA.widget.StringChangerDialog = function(nodeId, title, string, cbhash) {
    this.nodeId = nodeId;

    this.setHead(title);
    this.setBody(string);
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

Object.extend(DA.widget.StringChangerDialog.prototype, DA.widget.Dialog.prototype);
DA.widget.StringChangerDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.widget.StringChangerDialog.prototype.setBody = function(string) {
    this.body = '<input type=text id="' + this.childId('text') + '" class="' + this.childClass('text') + '" value="' + DA.util.encode(string) + '">' +
                '<input type=button id="' + this.childId('set') + '" class="' + this.childClass('set') + '" value="' + DA.locale.GetText.t_("DIALOG_SETTING_BUTTON") + '">';
    this.focusId = this.childId('text');
};
DA.widget.StringChangerDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('set'), "click", this._enter, this, true);
};
DA.widget.StringChangerDialog.prototype.setString = function(string) {
    var el = YAHOO.util.Dom.get(this.childId('text'));
    el.value = string;
};

/**
 * Builds a File Upload Dialog with a YUI container widget.
 * @constructor
 * @param {HTMLElement}	node the element representing the Dialog
 * @class FileUploadDialog
 * @namespace DA.widget
 */

DA.widget.FileUploadDialog = function(nodeId, title, cbhash) {
    this.nodeId = nodeId;

    this.setHead(title);
    this.setBody();
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

Object.extend(DA.widget.FileUploadDialog.prototype, DA.widget.Dialog.prototype);
DA.widget.FileUploadDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.widget.FileUploadDialog.prototype.setBody = function() {
    this.body = '<form id="' + this.childId('form') + '">' +
                '<input type=file id="' + this.childId('file') + '" class="' + this.childClass('file') + '" name="path" value="">' +
                '<input type=button id="' + this.childId('set') + '" class="' + this.childClass('set') + '" value="' + DA.locale.GetText.t_("DIALOG_SETTING_BUTTON") + '">' +
                '</form>';
    this.focusId = this.childId('file');
};
DA.widget.FileUploadDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('set'), "click", this._enter, this, true);
};

/**
 * Builds a wait-mask with Yahoo Dialog widget.
 * @constructor
 * @param {String} nodeId Waiting image,get from DA.vars.waitImage.
 * @class MaskDialog
 * @extends DA.widget.Dialog
 * @namespace DA.widget
 */
DA.widget.MaskDialog = function(nodeId, message, image, buttons, from) {
    this.nodeId = nodeId;
    this.setBody(message, image, buttons, from);
    this.setDialog();
};

Object.extend(DA.widget.MaskDialog.prototype, DA.widget.Dialog.prototype);

DA.widget.MaskDialog.prototype.setDialog = function() {
    var node = DA.dom.createDiv(this.nodeId);
    var html = '<div id="' + this._bodyId() + '" class="bd">' + this.body + '</div>';        
    
    this.node = node;
    this.node.innerHTML = html;
    
    this.dialog = new YAHOO.widget.Dialog(this.nodeId, {
        fixedcenter: true,
        close: false,
        draggable: false,
        modal: true,
        visible: false,
        zindex: 999
    });
    
    this.dialog.render();
};
DA.widget.MaskDialog.prototype.setBody = function(message, image, buttons, from) {
    message = (DA.util.isEmpty(message)) ? '' : message;
    image   = (DA.util.isEmpty(image)) ? DA.vars.imgRdir + '/popy_wait.gif' : image;
    var array;
    var ie6 = 0;
	if (buttons){
		image   = '<center><img src="' + image + '"></center>';
	} else {
		image   = '<img src="' + image + '">';
	}
    if(BrowserDetect.browser === "Explorer" && BrowserDetect.version === 6 && from === "transmit"){
    	array = [
			'<div class="' + this._bodyId() + '">',
			'<table><tr><td>' + image + '<br></td></tr>',
			'<tr><td><center><span style="font-size:20px;">' + message + '</span></center><br></td></tr>'
		];
		ie6 = 1;
	} else {
		array = [
			'<div class="' + this._bodyId() + '">',
			image + '<br>',
			'<center><span>' + message + '</span></center><br>'
		];
	}

	var i, l;
	if (buttons) {
		l = buttons.length;
		if(ie6 === 1){
			array.push('<tr><td>');
		}
		array.push('<center><span>');
		for (i = 0; i < l; i ++) {
			array.push('<button id="' + this._bodyId() + 'Button' + i + '">' + buttons[i].string + '</button>');
		}
		array.push('</center></span><br>');
		if(ie6 === 1){
			array.push('</td></tr></table>');
		}
	}
	array.push('</div>');
	
	this.body = array.join("") + "";               
};
DA.widget.MaskDialog.prototype.refresh = function(buttons) {
    this.dialog.setBody(this.body);
	var i, l, el;
	if (buttons) {
		l = buttons.length;
		for (i = 0; i < l; i ++) {
			if (buttons[i].onclick) {
				el = YAHOO.util.Dom.get(this._bodyId() + 'Button' + i);
				el.onclick = buttons[i].onclick;
			}
		}
	}
};
DA.waiting = {
    wtDialog: null,
    init: function () {
        this.wtDialog = new DA.widget.MaskDialog("da_waitingDialog", '');
    },
    show: function (message, image, buttons, from) {
        this.wtDialog.setBody(message, image, buttons, from);
        this.wtDialog.refresh(buttons);
        this.wtDialog.show();
    },
    hide: function () {
        this.wtDialog.hide();
    },
    remove: function () {
        this.wtDialog.remove();
    }
};

DA.widget.TipDialog = function(nodeId, DlgTitle, msgTitle, message) {
    this.nodeId = nodeId;
    this.setBody(msgTitle ,message);
    this.setDialog(DlgTitle);
};

Object.extend(DA.widget.TipDialog.prototype, DA.widget.Dialog.prototype);

DA.widget.TipDialog.prototype.setDialog = function(DlgTitle) {
    var node = DA.dom.createDiv(this.nodeId);
    var html = '<div id="' + this._bodyId() + '" class="bd">' + this.body + '</div>';        
    
    this.node = node;
    this.node.innerHTML = html;
    
    this.dialog = new YAHOO.widget.Dialog(this.nodeId, {
        fixedcenter: true,
        close: true,
        draggable: true,
        modal: false,
        visible: false,
        zindex: 999,
        width: '230px'
    });
    this.dialog.setHeader('<b>' + DlgTitle + '</b>');
    
    this.dialog.render();
};
DA.widget.TipDialog.prototype.refresh = function() {
    this.dialog.setBody(this.body);
};

DA.widget.TipDialog.prototype.setBody = function(msgTitle, message, picture) {
    message = (DA.util.isEmpty(message)) ? '' : message;
    picture   = (DA.util.isEmpty(picture)) ? DA.vars.imgRdir + '/popy_ok.gif' : picture;

	this.body = document.createElement('div');
	this.body.imageP = document.createElement('p');
	this.body.imageP.image = document.createElement('img');
	this.body.msg1 = document.createElement('span');
	this.body.msg2 = document.createElement('p');
	this.body.buttons = document.createElement('div');
	this.body.buttons.button1 = document.createElement('input');
	this.body.buttons.button2 = document.createElement('input');
	
	this.body.className = this._bodyId();
	this.body.imageP.image.src = picture;
	this.body.msg1.innerHTML = message;
	this.body.msg2.innerHTML = msgTitle;
	this.body.buttons.button1.type = 'button';
	this.body.buttons.button1.value = DA.locale.GetText.t_("CONFIRM_CANCEL_BUTTON");
	this.body.buttons.button2.type = 'button';
	this.body.buttons.button2.value = DA.locale.GetText.t_("CONFIRM_SEND_BUTTON");
	
	this.body.imageP.appendChild(this.body.imageP.image);
	this.body.appendChild(this.body.imageP);
	this.body.appendChild(this.body.msg1);
	this.body.appendChild(this.body.msg2);
	this.body.buttons.appendChild(this.body.buttons.button1);
	this.body.buttons.appendChild(this.body.buttons.button2);
	this.body.appendChild(this.body.buttons);
};

DA.widget.TipDialog.prototype.setBtnsOnclick = function(funcs) {
	this.body.buttons.button1.onclick = funcs[0];
	this.body.buttons.button2.onclick = funcs[1];
};

DA.widget.TipDialog.prototype.setFocus = function(obj) {
	obj.focus();
};

DA.tipDlg = {
    TipDialog: null,
    init: function (DlgTitle, msgTitle, message, btnBack) {
        this.TipDialog = new DA.widget.TipDialog("da_TipDialog", DlgTitle, msgTitle, message);
        var onclickfunc1;
        if (btnBack === 'preview') {
        	onclickfunc1 = function() {
        		if (DA.tipDlg.isInit()) {
					DA.tipDlg.hide();
				}
			};
        } else {
        	onclickfunc1 = function() {
        		window.__messageEditor.back();
        	};
        }
        var onclickfunc2 = function() {
			window.__messageEditor.transmit();
		};
		this.TipDialog.setBtnsOnclick([onclickfunc1, onclickfunc2]);
    },
    show: function () {
        this.TipDialog.refresh();
        this.TipDialog.show();
        this.TipDialog.setFocus(this.TipDialog.body.buttons.button1);
    },
    hide: function () {
        this.TipDialog.hide();
    },
    isInit: function () {
    	if (this.TipDialog) {
    		return true;
    	} else {
    		return false;
    	}
    }
};

DA.widget.SaveAttachesToLibDialog = function(nodeId, title, attaches, fid, uid, cbhash) {
    this.nodeId = nodeId;
    this.setHead(title);
    if(attaches.order){
        this.setBody(attaches,fid,uid);
    }
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

Object.extend(DA.widget.SaveAttachesToLibDialog.prototype, DA.widget.Dialog.prototype);
DA.widget.SaveAttachesToLibDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.widget.SaveAttachesToLibDialog.prototype.setBody = function(attaches,fid,uid) {
    var attacheslength = attaches.order[0].length;
    var tempbody = '';
    var aid;
    for( var i = 0 ; i < attacheslength ; i++ ) {
        aid = i + 1 ;
        tempbody += '<input type=checkbox name=' + this.childClass('attaches') + ' value="' + aid + '"></input>' + '<span title="' + attaches.items[i].title +'">' + DA.util.jsubstr4attach(attaches.items[i].title, 22) + '</span><br>';
    }
    tempbody += '<input type=button id="' + this.childClass('save') + '" value="' + DA.locale.GetText.t_("DIALOG_SAVE_BUTTON") + '">';
    this.body = tempbody;
};
DA.widget.SaveAttachesToLibDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('save'), 'click', this._enter, this, true);
};

DA.widget.SearchMoveFolderDialog = function(nodeId, title, cbhash) {
    this.nodeId = nodeId;
    this.setHead(title);
    this.setCbhash(cbhash);
    this.setBody();
    this.setDialog();
    this.setListener();
};

Object.extend(DA.widget.SearchMoveFolderDialog.prototype, DA.widget.Dialog.prototype);
DA.widget.SearchMoveFolderDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.widget.SearchMoveFolderDialog.prototype.setBody = function() {
    var tempbody =  '<select style = "width:200px;" id="da_searchMoveToFid">' + DA.vars.options.folder_tree + '</select>' ;
    tempbody += '<input type=button id="' + this.childClass('save') + '" value="' + DA.locale.GetText.t_("DIALOG_MOVE_BUTTON") + '">';
    this.body = tempbody;
};
DA.widget.SearchMoveFolderDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('save'), 'click', this._enter, this, true);
};
