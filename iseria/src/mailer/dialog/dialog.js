/* $Id: dialog.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/dialog/dialog.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

if (!DA || !DA.mailer || !DA.util || !DA.locale || !DA.widget) {
    throw "ERROR: missing DA.js or mailer.js or message.js or dialog.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util || !YAHOO.widget) {
    throw "ERROR: missing yahoo.js or container.js"; // TODO: formalize/cleanup
}

/**
 * Builds a Mail Import Dialog with a YUI container widget.
 * @constructor
 * @param {HTMLElement}	node the element representing the Dialog
 * @class MailImportDialog
 * @namespace DA.mailer.widget
 */

DA.mailer.widget.MailImportDialog = function(nodeId, title, cbhash) {
    this.nodeId = nodeId;

    this.setHead(title);
    this.setBody();
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

Object.extend(DA.mailer.widget.MailImportDialog.prototype, DA.widget.Dialog.prototype);
DA.mailer.widget.MailImportDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.mailer.widget.MailImportDialog.prototype.setBody = function(fid) {
    this.body = '<form id="' + this.childId('form') + '">' +
                '<input type=hidden id="' + this.childId('proc') + '" class="' + this.childClass('proc') + '" name="proc" value="import">' +
                '<input type=hidden id="' + this.childId('fid') + '" class="' + this.childClass('fid') + '" name="fid" value="">' +
                this.archiveTypeRadio() + '<br>' +
                '<input type=file id="' + this.childId('file') + '" class="' + this.childClass('file') + '" name="path" value="">' +
                '<input type=button id="' + this.childId('set') + '" class="' + this.childClass('set') + '" value="' + DA.locale.GetText.t_("DIALOG_SETTING_BUTTON") + '">' +
                '<input type=reset id="' + this.childId('clear') + '" class="' + this.childClass('clear') + '" value="clear" style="display:none;">' +
                '</form>';
    this.focusId = this.childId('file');
};
DA.mailer.widget.MailImportDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('set'), "click", this._enter, this, true);
};
DA.mailer.widget.MailImportDialog.prototype.archiveType = {
    zip  : 'ZIP',
    tar  : 'TGZ',
    lha  : 'LZH',
    eml  : 'eml',
    mbox : 'mbox'
};
DA.mailer.widget.MailImportDialog.prototype.archiveTypeRadio = function() {
    var types = DA.vars.config.archive_list.split('|');
    var radio = '';
    var i, checked;
    
    for (i = 0; i < types.length; i ++) {
        if (types[i] === DA.vars.config.archive) {
            checked = ' checked';
        } else {
            checked = '';
        }
        radio += '<input type=radio id="' + this.childId('archive_type') + '" class="' + this.childClass('archive_type') + '" name="archive_type" value="' + types[i] +  '"' + checked + '>' + this.archiveType[types[i]] + '&nbsp;';
    }

    return radio;
};
DA.mailer.widget.MailImportDialog.prototype.clear = function() {
    YAHOO.util.Dom.get(this.childId('clear')).click();
};
