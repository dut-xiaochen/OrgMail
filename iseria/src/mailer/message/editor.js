/* $Id: editor.js 2515 2014-11-12 01:46:31Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/message/editor.js $ */
/*jslint evil: true */
/*for JSLINT undef checks*/
/*extern $ initRTE writeRichText BrowserDetect DA Event Prototype YAHOO FCKeditor FCKeditorAPI FCKEditorIframeController*/
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
 * Message viewer widget. 
 * 
 * Usage: 
 *   var mv = new DA.mailer.MessageEditor();
 * 
 * @class MessageEditor
 * @uses 
 * @constructor
 * @param messageNode HTMLElement DOM node in which to draw the message.
 */
DA.mailer.MessageEditor = function(headerNode, textNode, htmlNode, previewNode, cbhash, threePane, requestUrl, ddApplet) {
    this.headerNode  = headerNode;
    this.headerId    = headerNode.id;
    this.textNode    = textNode;
    this.textId      = textNode.id;
    this.htmlNode    = htmlNode;
    this.htmlId      = htmlNode.id;
    this.previewNode = previewNode; 
    this.previewId   = previewNode.id;
    this.threePane    = threePane;
    this.requestUrl   = requestUrl;
    this.forced_interruption = 0;
    
    if (cbhash) {
        if (DA.util.isFunction(cbhash.onLoad)) {
            this.onLoad = cbhash.onLoad;
        }
        if (DA.util.isFunction(cbhash.onPreview)) {
            this.onPreview = cbhash.onPreview;
        }
        if (DA.util.isFunction(cbhash.onForcedInterruption)) {
            this.onForcedInterruption = cbhash.onForcedInterruption;
        }
        if (DA.util.isFunction(cbhash.onBack)) {
            this.onBack = cbhash.onBack;
        }
        if (DA.util.isFunction(cbhash.doResize)) {
            this.doResize = cbhash.doResize;
        }
        if (DA.util.isFunction(cbhash.onEnable)) {
            this.onEnable = cbhash.onEnable;
        }
    }
    if (ddApplet) {
        if (ddApplet.uploadCompleted) {
            this.ddAppletUploadCompleted = ddApplet.uploadCompleted;
        }
        if (ddApplet.beforeUpload) {
            this.ddAppletBeforeUpload = ddApplet.beforeUpload;
        }
        if (ddApplet.afterUpload) {
            this.ddAppletAfterUpload = ddApplet.afterUpload;
        }
        if (ddApplet.afterMoreThanMax) {
            this.ddAppletAfterMoreThanMax = ddApplet.afterMoreThanMax;
        }
    }
    
    var query = DA.util.parseQuery(this.requestUrl);
    if (query.external && DA.util.cmpNumber(query.external, 1)) {
        this.external = true;
    } else {
        this.external = false;
    }
    
    // Callback point (pre-init)
    if (DA.vars.custom.editor.setMessageEditor) {
        eval(DA.vars.custom.editor.setMessageEditor);
    }
    
    this.init();
    
    // Callback point (post-init)
    if (DA.vars.custom.editor.setMessageEditor2) {
        eval(DA.vars.custom.editor.setMessageEditor2);
    }
};

/**
 * Members
 */
DA.mailer.MessageEditor.prototype = {
    
    warnNode: null,
    
    headerNode: null,
    
    headerId : null,
    
    textNode: null,
    
    textId: null,
    
    htmlNode: null,
    
    htmlId: null,
    
    previewNode: null,
    
    previewId: null,
    
    headerContentsNode: null,
    
    textContentsNode: null,
    
    htmlContentsNode: null,
    
    selectedFid: null,
    
    selectedUid: null,

    proc       :  null,
    
    selectedMaid: null,
    
    selectedTid: null,
    
    selectedFrom:null,
    
    selectedSid: null,
    
    selectedFld: null,
    
    selectedSno: null,
    
    selectFolderType: null,
    
    currentUploadForm: null,
    
    currentSizeNode: null,
    
    toController: null,
    
    ccController: null,
    
    bccController: null,
    
    fileController: null,
    
    jsonIO: null,
    
    tmplIO: null,
    
    signIO: null,
    
    userIO: null,
    
    addrIO: null,
    
    groupIO: null,
    
    rnDialog: null,
    
    ceDialog: null,
    
    popup: null,
    
    menuData: null,
    
    dragAddressTo: null,
    
    dragAddressCc: null,
    
    dragAddressBcc: null,
    
    titleList: null,
    
    langList: null,
    
    signList: null,
    
    previewMode: false,
    
    spellcheckMode:  DA.vars.config.spellcheck_mode,
    
    fck: null,
    fckAPIs:null, 
    
    _FCKEditorCompleted: false,
    // no use
    threePane: null,
    
    requestUrl: null,
    
    ddAppletUploadCompleted: null,
    
    ddAppletBeforeUpload: null,
    
    ddAppletAfterUpload: null,
    
    ddAppletAfterMoreThanMax: null,
    
    mode: null,

    autoBackupedXML: null,

    backup_maid:null,

    backup_timeout_msg_alerted:null,
    
    autoBackupTimeout: DA.vars.system.auto_backup_interval * 1000,
    
    /**
     * FIXME: Need comments/JSDOC! Cannot understand what external means.
     * @property external
     * @type {Boolean}
     */
    external: false,
    
    uploading: {},
    
    /**
     * Load Function.
     */
    onLoad: Prototype.emptyFunction,
    
    /**
     * Preview Function.
     */
    onPreview: Prototype.emptyFunction,
    
    /**
     * Forced Interruption Function.
     */
    onForcedInterruption:Prototype.emptyFunction,
        
    /**
     * Back Function.
     */
    onBack: Prototype.emptyFunction,
    
    /**
     * Resize Functin.
     */
    doResize: Prototype.emptyFunction,
    
    /**
     * onEnable Functin.
     */
    onEnable: Prototype.emptyFunction,
    
    init: function() {
        DA.customEvent.fire('messageEditorInitBefore', this);

        var me = this;
        var header = ['<div class="da_messageEditorHeader">',
                      '<div id="da_messageEditorItemWarn" class="da_messageEditorWarn"></div>',
                      '<table class="da_messageEditorHeaderTable">',
                      '<tr>',
                      '  <td colspan="2" class="da_messageEditorHeaderTableTopLeft">', DA.imageLoader.nullTag(1, 3), '</td>',
                      '  <td class="da_messageEditorHeaderTableTopRight">', DA.imageLoader.nullTag(2, 3), '</td>',
                      '</tr>',
                      '<tr>',
                      '  <td class="da_messageEditorHeaderTableMiddleLeft">', DA.imageLoader.nullTag(2, 1), '</td>',
                      '  <td class="da_messageEditorHeaderTableMiddleCenter">', 
                      '    <table class="da_messageEditorHeaderContents">',
                      '    <tr>',
                      '      <td><div id="', this.headerId, 'Contents"></div><div id="', this.headerId, 'Preview"></div></td>',
                      '    </tr>',
                      '    </table>',
                      '  </td>',
                      '  <td class="da_messageEditorHeaderTableMiddleRight">', DA.imageLoader.nullTag(2, 1), '</td>',
                      '</tr>',
                      '<tr>',
                      '  <td colspan="2" class="da_messageEditorHeaderTableBottomLeft">', DA.imageLoader.nullTag(1, 2), '</td>',
                      '  <td class="da_messageEditorHeaderTableBottomRight">', DA.imageLoader.nullTag(2, 2), '</td>',
                      '</tr>',
                      '</table>',
                      '</div>'].join('');
        
        var text   = ['<div id="', this.textId, 'Contents" class="da_messageEditorBody">',
                      '<textarea id="da_messageEditorItemText" class="da_messageEditorText"></textarea>',
                      '</div>'].join('');
        
        var preview= ['<div id="', this.previewId, 'Contents" class="da_messageEditorBody da_messageEditorPreview"></div>'].join('');
        
        this._hideBodyText();
        this.headerNode.innerHTML  = header;
        this.textNode.innerHTML    = text;
        this.previewNode.innerHTML = preview;
        if (DA.vars.richText) {
              switch(DA.vars.richText.type){
                case 'crossbrowser':this.create_RTE(); break;
                case 'fckeditor': this.create_FCKeditor(); break;
          }
        }
        this._hideBodyHTML();
        this.warnNode            = YAHOO.util.Dom.get('da_messageEditorItemWarn');
        this.headerContentsNode  = YAHOO.util.Dom.get(this.headerId + 'Contents');
        this.textContentsNode    = YAHOO.util.Dom.get(this.textId + 'Contents');
        if (DA.vars.richText) {
            switch(DA.vars.richText.type){
                case 'crossbrowser':
                    this.htmlContentsNode    = YAHOO.util.Dom.get(this.htmlId + 'Contents');                                    
                    break;    
                case 'fckeditor':
                    this.htmlContentsNode    = YAHOO.util.Dom.get(this.htmlId + 'Contents___Frame');
                    break;
            }
        }
        this.previewContentsNode = YAHOO.util.Dom.get(this.previewId + 'Contents'); 
        if (DA.vars.config.font === 'on') {
            YAHOO.util.Dom.addClass(this.textContentsNode, 'da_nonProportionalFont');
            YAHOO.util.Dom.addClass(this.previewContentsNode, 'da_nonProportionalFont');
        }
    
        YAHOO.util.Dom.addClass(this.htmlContentsNode.parentNode, 'da_messageEditorBody da_messageEditorBodyBoarder');
        YAHOO.util.Dom.addClass(this.htmlContentsNode, 'da_messageEditorHTML');
        
    var nvPairParams = {
                // FIXME: To, Cc and Bcc have very similar 'value' strings. This ought to be modularized
                To: {
                    id:    'da_messageEditorItemToField',
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_TO'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner"><input type=text id="da_messageEditorItemToText" class="da_messageEditorItemText">&nbsp;</span>',
                            '<span id="da_messageEditorItemAddressCcBcc" class="da_messageEditorItemInner da_messageEditorPointer">', DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_ccbcc.gif'), '</span>',
                            '<span>&nbsp;</span>',
                            '<span id="da_messageEditorItemToAddress" class="da_messageEditorItemInner da_messageEditorPointer">', DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_address_off.gif'), '</span>',
                            '<div id="da_messageEditorItemToTextACContainer" class="da_autoCompleteContainer"></div>',
                            '<div id="da_messageEditorItemTo" class="da_messageEditorItemInner"></div>',
                            '</div>'].join('')
                },
                Cc: {
                    id:    'da_messageEditorItemCcField',
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_CC'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner"><input type=text id="da_messageEditorItemCcText" class="da_messageEditorItemText">&nbsp;&nbsp;</span>',
                            '<span id="da_messageEditorItemCcAddress" class="da_messageEditorItemInner da_messageEditorPointer">', DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_address_off.gif'), '</span>',
                            '<div id="da_messageEditorItemCcTextACContainer" class="da_autoCompleteContainer"></div>',
                            '<div id="da_messageEditorItemCc" class="da_messageEditorItemInner"></div>',
                            '</div>'].join(''),
                    border: false,
                    hidden: true
                },
                Bcc: {
                    id:    'da_messageEditorItemBccField',
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_BCC'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner"><input type=text id="da_messageEditorItemBccText" class="da_messageEditorItemText">&nbsp;&nbsp;</span>',
                            '<span id="da_messageEditorItemBccAddress" class="da_messageEditorItemInner da_messageEditorPointer">', DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_address_off.gif'), '</span>',
                            '<div id="da_messageEditorItemBccTextACContainer" class="da_autoCompleteContainer"></div>',
                            '<div id="da_messageEditorItemBcc" class="da_messageEditorItemInner"></div>',
                            '</div>'].join(''),
                    border: false,
                    hidden: true
                },
                From: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_FROM'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span id="da_messageEditorItemFromName" class="da_messageEditorItemInner"></span>',
                            '<span id="da_messageEditorItemFromAddress" class="da_messageEditorItemInner"></span>',
                            '<span id="da_messageEditorItemReplyUseOuter" class="da_messageEditorItemInner">&nbsp;',
                            '<input type=checkbox id="da_messageEditorItemReplyUse">&nbsp;', DA.locale.GetText.t_('MESSAGE_CHECKBOXMESSAGE_REPLYUSE'), '&nbsp;',
                            '</span>',
                            '</div>'].join('')
                },
                Subject: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner"><input type=text id="da_messageEditorItemSubject" class="da_messageEditorItemText">&nbsp;</span>',
                            '<span class="da_messageEditorItemInner">', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_PRIORITY'), '&nbsp;:&nbsp;',
                            '<select id="da_messageEditorItemPriority" size=1 disabled="disabled">',
                            '<option value="1">', DA.locale.GetText.t_('MESSAGE_PRIORITY_HIGH'), '</option>',
                            '<option value="3">', DA.locale.GetText.t_('MESSAGE_PRIORITY_NORMAL'), '</option>',
                            '<option value="5">', DA.locale.GetText.t_('MESSAGE_PRIORITY_LOW'), '</option>',
                            '</select>',
                            '</span>',
                            '</div>'].join('')
                },
                Attachment: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_ATTACHMENTFILE'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            (DA.vars.config.upload_file_applet === "inline" || DA.vars.config.upload_file_applet === "hidden") ? '<div id="da_messageEditorItemAttachmentDDApplet" class="da_messageEditorItemInner"></div>' : '',
                            '<span id="da_messageEditorItemAttachmentButtonsOuter" class="da_messageEditorItemInner" style="float:right;">',
                            '<input id="da_messageEditorItemAttachmentButtonsApplet" type=button value="' + DA.locale.GetText.t_('EDITOR_SHOW_APPLET_BUTTON') + '" ',(DA.vars.config.upload_file_applet === "hidden") ? '' : ' style="display:none;"',' disabled>',
                            '<input id="da_messageEditorItemAttachmentButtonsLibrary" type=button value="' + DA.locale.GetText.t_('EDITOR_LIBRARYSEL_BUTTON') + '" style="display:none;" disabled>',
                            '</span>',
                            '<span id="da_messageEditorItemAttachmentFormOuter" class="da_messageEditorItemInner"></span>',
                            '<div id="da_messageEditorItemAttachment" class="da_messageEditorItemInner"></div>',
                            '</div>'].join('')
                },
                Options: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_OPTIONS'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner">', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SIGN'), '&nbsp;:&nbsp;',
                            '<span id="da_messageEditorItemSignList"></span>&nbsp;',
                            '</span>',
                            '<span class="da_messageEditorItemInner">', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_CHARSET'), '&nbsp;:&nbsp;',
                            '<select id="da_messageEditorItemCharset" size=1 disabled="disabled">',
                            '<option value="ISO-2022-JP">', DA.locale.GetText.t_('MESSAGE_CHARSET_ISO2022JP'), '</option>',
                            '<option value="UTF-8">', DA.locale.GetText.t_('MESSAGE_CHARSET_UTF8'), '</option>',
                            '</select>&nbsp;',
                            '</span>',
                            '<span id="da_messageEditorItemContentTypeAll" class="da_messageEditorItemInner">', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_CONTENTTYPE'), '&nbsp;:&nbsp;',
                            '<select id="da_messageEditorItemContentType" size=1 disabled="disabled">',
                            '<option value="text">', DA.locale.GetText.t_('MESSAGE_CONTENTTYPE_TEXT'), '</option>',
                            '<option value="html">', DA.locale.GetText.t_('MESSAGE_CONTENTTYPE_HTML'), '</option>',
                            '</select>&nbsp;',
                            '</span>',
                            '<span class="da_messageEditorItemInner">',
                            '<input type=checkbox id="da_messageEditorItemNotification">&nbsp;', DA.locale.GetText.t_('MESSAGE_CHECKBOXMESSAGE_NOTIFICATION'), '&nbsp;',
                            '</span>',
                            '<span id="da_messageEditorItemOpenStatusOuter" class="da_messageEditorItemInner">' +
                            '<input type=checkbox id="da_messageEditorItemOpenStatus">&nbsp;',DA.locale.GetText.t_("MESSAGE_CHECKBOXMESSAGE_OPENSTATUS"), '&nbsp;',
                            '</span>',
                            '<span id="da_messageEditorItemGroupNameOuter" class="da_messageEditorItemInner">' +
                            '<br><input type=checkbox id="da_messageEditorItemGroupName">&nbsp;', DA.locale.GetText.t_('MESSAGE_CHECKBOXMESSAGE_GROUPNAME'), '&nbsp;',
                            '</span>',
                            '</div>'].join('')
                },
                Hidden: {
                    name:   'hidden',
                    value:  ['<div class="da_messageEditorItemOuter">',
                             '<span class="da_messageEditorItemInner">',
                             '<input type=hidden id="da_messageEditorItemInReplyTo" value="">',
                             '<input type=hidden id="da_messageEditorItemReferences" value="">',
                             '</span>',
                             '</div>'].join(''),
                    border: false,
                    hidden: true
                },
                Custom: {
                    id: 'da_messageEditorItemCustom',
                    row: DA.vars.custom.editor.headerOpen,
                    html: DA.vars.custom.editor.headerClose,
                    border: false,
                    hidden: (DA.vars.custom.editor.headerOpen || DA.vars.custom.editor.headerClose) ? false : true
                },
                SubjectCollapse: {
                    name: DA.imageLoader.nullTag(14, 14) + DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner"><input type=text id="da_messageEditorItemSubjectCollapse" class="da_messageEditorItemText">&nbsp;</span>',
                            '<span class="da_messageEditorItemInner">', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_PRIORITY'), '&nbsp;:&nbsp;',
                            '<select id="da_messageEditorItemPriorityCollapse" size=1 disabled="disabled">',
                            '<option value="1">', DA.locale.GetText.t_('MESSAGE_PRIORITY_HIGH'), '</option>',
                            '<option value="3">', DA.locale.GetText.t_('MESSAGE_PRIORITY_NORMAL'), '</option>',
                            '<option value="5">', DA.locale.GetText.t_('MESSAGE_PRIORITY_LOW'), '</option>',
                            '</select>',
                            '</span>',
                            '</div>'].join('')
                }
            };

    DA.customEvent.fire("messageEditorRewriteNVPairParams", this, nvPairParams);

    this.contentsPairs=new DA.widget.NVPairSet($(this.headerId+"Contents"), nvPairParams, ['SubjectCollapse'], true);
        this.contentsPairs.hideColumn('SubjectCollapse');
        this.contentsPairs.onExpand = function () {
            DA.customEvent.fire("messageEditorNVPairOnExpandBefore", me);
            DA.dom.changeValue('da_messageEditorItemSubject', DA.dom.textValue('da_messageEditorItemSubjectCollapse'));
            YAHOO.util.Dom.get("da_messageEditorItemSubjectCollapse").value="";
            DA.dom.changeValue('da_messageEditorItemPriority', DA.dom.selectValue('da_messageEditorItemPriorityCollapse'));
            me.doResize();
        DA.customEvent.fire("messageEditorNVPairOnExpandAfter", me);
        };
        this.contentsPairs.onCollapse = function () {
        DA.customEvent.fire("messageEditorNVPairOnCollapseBefore", me);
            me.doResize();
            this._pendingResizeCollapsed=false;
            DA.dom.changeValue('da_messageEditorItemSubjectCollapse', DA.dom.textValue('da_messageEditorItemSubject'));
            YAHOO.util.Dom.get("da_messageEditorItemSubject").value="";
            DA.dom.changeValue('da_messageEditorItemPriorityCollapse', DA.dom.selectValue('da_messageEditorItemPriority'));
            var div = YAHOO.util.Dom.getElementsByClassName('da_nvPairValue da_nvPairFloatLeft')[0];
            if(div.style.width){
                div.style.width = "";
            }
        DA.customEvent.fire("messageEditorNVPairOnCollapseAfter", me);
        };
        this.previewPairs = new DA.widget.NVPairSet(
            $(this.headerId + 'Preview'), {
                To: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_TO'),
                    value: ''
                },
                Cc: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_CC'),
                    value: ''
                },
                Bcc: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_BCC'),
                    value: ''
                },
                From: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_FROM'),
                    value: ''
                },
                Subject: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'),
                    value: ''
                },
                Attachment: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_ATTACHMENTFILE'),
                    value: ''
                }
            }, [], true
        );
        this._switchPreviewMode(false);
        
        // JSON IO
        this.jsonIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_new.cgi' );
        this.tmplIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_template.cgi' );
        this.signIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_sign.cgi' );
        this.addrIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_addr.cgi' );
        this.userIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_user.cgi' );
        this.groupIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_group.cgi' );
        this._addUploadForm();
        
        // ポップアップメニュー
        this.menuData = {};
        this.popup = new DA.widget.PopupMenuNoTrigger("da_messageEditorPopupMenu", this.menuData, {
            onTrigger: function(e) {
                var srcElem = YAHOO.util.Event.getTarget(e);
                var srcClass;
                
                if (srcElem) {
                    srcClass = srcElem.className;
                    if (srcClass.match(/(^|\s)da_ugInformationListPopup(\s|$)/)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        });
        
        // 宛先共通
        this.dropAddressTo      = new YAHOO.util.DDTarget('da_messageEditorItemToText', 'editorAddress');
        this.dropAddressCc      = new YAHOO.util.DDTarget('da_messageEditorItemCcText', 'editorAddress');
        this.dropAddressBcc     = new YAHOO.util.DDTarget('da_messageEditorItemBccText', 'editorAddress');
        
        // 宛先アドレス
        this.toController = new DA.ug.InformationListController(YAHOO.util.Dom.get('da_messageEditorItemTo'), null, {
            onRemove: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me._refreshGroupName();
                me.doResize();
            },
            onPopup: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me.popup.position(YAHOO.util.Event.getPageX(e) + 1, YAHOO.util.Event.getPageY(e) + 1);
                me._showPopupMenu('to', sno);
            }
        }, {
            baseId: 'da_ugInformationList_to',
            maxView: 5
        });
        this.dragAddressTo = new DA.mailer.AddressDragDrop('da_messageEditorItemTo', 'editorAddress', {
            scroll:      false,
            resizeFrame: false
        });
        this.dragAddressTo.onMouseDown = function(e) {
            var cur  = this.getDragEl();
            var node = YAHOO.util.Event.getTarget(e);
            var i, sno, target;
            var dst = null;
            var dragFlag = false;
            var stop;
            window.dragedElClassName = "";
            stop = setTimeout(function(){
                dragFlag = true;
                if (node) {
                    if (node.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                        target = node.parentNode; 
                        if (target) {
                            if (target.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                                window.dragedElClassName = target.className;
                                sno = RegExp.$1;
                                me.selectedFld = 'to';
                                me.selectedSno = sno;
                                cur.innerHTML = me.toController.dummy(sno);
                                dst = me._controller("to");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("cc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("bcc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                            }
                            YAHOO.util.DDM.refreshCache();
                        }
                    } else {
                        window.dragedElClassName = "";
                    }
                }
            },200);
            node.onmouseup = function(e){
                if(!dragFlag){
                    clearTimeout(stop);
                    me.dragAddressTo.endDrag();
                }
            };
        };

        this.dragAddressTo.onDragEnter = function(e, id) {
            var underline = null;
            var div = null;
            var toArea = null;
            var beforeNode = null;
            if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)) {
                if ( id.indexOf("Text") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id; 
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    if ( id.indexOf("To") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemTo");
                    } else if (id.indexOf("Cc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemCc");
                    } else if ( id.indexOf("Bcc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemBcc");
                    }
                    beforeNode = toArea.childNodes[0];
                    if ( beforeNode ) {
                        toArea.insertBefore(div, toArea.childNodes[0]);
                    } else {
                        toArea.appendChild(div);
                        toArea.style.display = "block";
                    }
                } else if ( id.indexOf("da_ugInformationList") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id; 
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    document.getElementById(id).appendChild(div);
                }
            }
        };

        this.dragAddressTo.onDragDrop = function(e, id) {
            var underline = null;
            var mask = null;
            var topController = me._controller("to");
            if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)) {
                if (id) {
                    if ( id.match(/da_messageEditorItemToText/) ) {
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemToText");
                        mask.parentNode.removeChild(mask);
                        me.moveTop("to", me.selectedSno, "to", 1);
                    } else if ( id.match(/da_messageEditorItemCcText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemCcText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("to", me.selectedSno, "cc", 0, topController.get(me.selectedSno));
                    } else if ( id.match(/da_messageEditorItemBccText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("to", me.selectedSno, "bcc", 0, topController.get(me.selectedSno));
                    } else if (id.match(/da_ugInformationListToLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'to', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListCcLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'cc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListBccLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'bcc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    }
                    YAHOO.util.Dom.removeClass(id, 'da_messageEditorSilver');
                }
            }
        };

        this.dragAddressTo.onMouseUp = function(e) {
            this.getDragEl().innerHTML = '';
            me.resizeAll();
            
        };
        
        // Ｃｃアドレス
        this.ccController = new DA.ug.InformationListController(YAHOO.util.Dom.get('da_messageEditorItemCc'), null, {
            onRemove: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me._refreshGroupName();
                me.doResize();
            },
            onPopup: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me.popup.position(YAHOO.util.Event.getPageX(e) + 1, YAHOO.util.Event.getPageY(e) + 1);
                me._showPopupMenu('cc', sno);
            }
        }, {
            baseId: 'da_ugInformationList_cc',
            maxView: 5
        });
        this.dragAddressCc = new DA.mailer.AddressDragDrop('da_messageEditorItemCc', 'editorAddress', {
            scroll:      false,
            resizeFrame: false
        });
        this.dragAddressCc.onMouseDown = function(e) {
            var cur  = this.getDragEl();
            var node = YAHOO.util.Event.getTarget(e);
            var i, sno, target;
            var dst = null;
            var dragFlag = false;
            var stop;
            window.dragedElClassName = "";
            stop = setTimeout(function(){
                dragFlag = true;
                if (node) {
                    if (node.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                        target = node.parentNode; 
                        if (target) {
                            if (target.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                                window.dragedElClassName = target.className;
                                sno = RegExp.$1;
                                me.selectedFld = 'cc';
                                me.selectedSno = sno;
                                cur.innerHTML = me.ccController.dummy(sno);
                                dst = me._controller("to");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("cc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("bcc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                            }
                            YAHOO.util.DDM.refreshCache();
                        }
                    } else {
                        window.dragedElClassName = "";
                    }
                }
            },200);
            node.onmouseup = function(e){
                if(!dragFlag){
                    clearTimeout(stop);
                    me.dragAddressTo.endDrag();
                }
            };
        };

        this.dragAddressCc.onDragEnter = function(e, id) {
            var underline = null;
            var div = null;
            var toArea = null;
            var beforeNode = null;
            if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)) {
                if ( id.indexOf("Text") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id; 
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    if ( id.indexOf("To") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemTo");
                    } else if (id.indexOf("Cc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemCc");
                    } else if ( id.indexOf("Bcc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemBcc");
                    }
                    beforeNode = toArea.childNodes[0];
                    if ( beforeNode ) {
                        toArea.insertBefore(div, toArea.childNodes[0]);
                    } else {
                        toArea.appendChild(div);
                        toArea.style.display = "block";
                    }
                } else if ( id.indexOf("da_ugInformationList") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id;  
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    document.getElementById(id).appendChild(div);
                }
            }
        };

        this.dragAddressCc.onDragDrop = function(e, id) {
            var underline = null;
            var mask = null;
            var topController = me._controller("cc");
            if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)) {
                if (id) {
                   if ( id.match(/da_messageEditorItemToText/) ) {
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemToText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("cc", me.selectedSno, "to", 0, topController.get(me.selectedSno));
                    } else if ( id.match(/da_messageEditorItemCcText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemCcText");
                        mask.parentNode.removeChild(mask);
                        me.moveTop("cc", me.selectedSno, "cc", 1);
                    } else if ( id.match(/da_messageEditorItemBccText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("cc", me.selectedSno, "bcc", 0, topController.get(me.selectedSno));
                    } else if (id.match(/da_ugInformationListToLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'to', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListCcLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'cc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListBccLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'bcc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    }
                    YAHOO.util.Dom.removeClass(id, 'da_messageEditorSilver');
                }
            }
        };

        this.dragAddressCc.onMouseUp = function(e) {
            this.getDragEl().innerHTML = '';
            me.resizeAll();
        };
        
        // Ｂｃｃアドレス
        this.bccController = new DA.ug.InformationListController(YAHOO.util.Dom.get('da_messageEditorItemBcc'), null, {
            onRemove: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me._refreshGroupName();
                me.doResize();
            },
            onPopup: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me.popup.position(YAHOO.util.Event.getPageX(e) + 1, YAHOO.util.Event.getPageY(e) + 1);
                me._showPopupMenu('bcc', sno);
            }
        }, {
            baseId: 'da_ugInformationList_bcc',
            maxView: 5
        });
        this.dragAddressBcc = new DA.mailer.AddressDragDrop('da_messageEditorItemBcc', 'editorAddress', {
            scroll:      false,
            resizeFrame: false
        });
        this.dragAddressBcc.onMouseDown = function(e) {
            var cur  = this.getDragEl();
            var node = YAHOO.util.Event.getTarget(e);
            var i, sno, target;
            var dst = null;
            var dragFlag = false;
            var stop;
            window.dragedElClassName = "";
            stop = setTimeout(function(){
                dragFlag = true;
                if (node) {
                    if (node.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                        target = node.parentNode; 
                        if (target) {
                            if (target.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                                window.dragedElClassName = target.className;
                                sno = RegExp.$1;
                                me.selectedFld = 'bcc';
                                me.selectedSno = sno;
                                cur.innerHTML = me.bccController.dummy(sno);
                                dst = me._controller("to");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("cc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("bcc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                            }
                            YAHOO.util.DDM.refreshCache();
                        }
                    } else {
                        window.dragedElClassName = "";
                    }
                }
            },200);
            node.onmouseup = function(e){
                if(!dragFlag){
                    clearTimeout(stop);
                    me.dragAddressBcc.endDrag();
                }
            };
        };

        this.dragAddressBcc.onDragEnter = function(e, id) {
            var underline = null;
            var div = null;
            var toArea = null;
            var beforeNode = null;
            if ( window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/) ) {
                if ( id.indexOf("Text") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id; 
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    if ( id.indexOf("To") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemTo");
                    } else if (id.indexOf("Cc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemCc");
                    } else if ( id.indexOf("Bcc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemBcc");
                    }
                    beforeNode = toArea.childNodes[0];
                    if ( beforeNode ) {
                        toArea.insertBefore(div, toArea.childNodes[0]);
                    } else {
                        toArea.appendChild(div);
                        toArea.style.display = "block";
                    }
                } else if ( id.indexOf("da_ugInformationList") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id; 
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    document.getElementById(id).appendChild(div);
                }
            }
        };

        this.dragAddressBcc.onDragDrop = function(e, id) {
            var underline = null;
            var mask = null;
            var topController = me._controller("bcc");
            if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)) {
                if (id) {
                  if ( id.match(/da_messageEditorItemToText/) ) {
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemToText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("bcc", me.selectedSno, "to", 0, topController.get(me.selectedSno));
                    } else if ( id.match(/da_messageEditorItemCcText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemCcText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("bcc", me.selectedSno, "cc", 0, topController.get(me.selectedSno));
                    } else if ( id.match(/da_messageEditorItemBccText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
                        mask.parentNode.removeChild(mask);
                        me.moveTop("bcc", me.selectedSno, "bcc", 1);
                    } else if (id.match(/da_ugInformationListToLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'to', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListCcLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'cc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListBccLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'bcc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    }
                    YAHOO.util.Dom.removeClass(id, 'da_messageEditorSilver');
                }
            }
        };

        this.dragAddressBcc.onMouseUp = function(e) {
            this.getDragEl().innerHTML = '';
            me.resizeAll();
        };
        
        // 添付ファイル
        this.fileController = new DA.file.InformationListController(YAHOO.util.Dom.get('da_messageEditorItemAttachment'), null, {
            onRemove: function(e, aid) {
                me.currentSizeNode.innerHTML = me.fileController.total();
                me.doResize();
            }
        }, {
            baseId: 'da_fileInformationList_attach',
            maxView: 5
        });
        
        YAHOO.util.Dom.get('da_messageEditorItemToAddress').onclick = function() {
            me.openAddress('to');
        };
        YAHOO.util.Dom.get('da_messageEditorItemCcAddress').onclick = function() {
            me.openAddress('cc');
        };
        YAHOO.util.Dom.get('da_messageEditorItemBccAddress').onclick = function() {
            me.openAddress('bcc');
        };
        YAHOO.util.Dom.get('da_messageEditorItemAddressCcBcc').onclick = function() {
            me._showAddressCcBcc();
            me.doResize();
        };
        YAHOO.util.Dom.get('da_messageEditorItemAttachmentButtonsApplet').onclick = function() {
            me.createDDApplet({ maid: me.selectedMaid });
        };
        YAHOO.util.Dom.get('da_messageEditorItemAttachmentButtonsLibrary').onclick = function() {
            DA.windowController.winOpenNoBar(DA.vars.cgiRdir + '/lib_file_select.cgi?maid=' + me.selectedMaid, 'library', 450, 480);
        };
        YAHOO.util.Dom.get('da_messageEditorItemContentType').onchange = function() {
            if (this.value === 'html') {
                me._text2html();
                me._switchContentType(YAHOO.util.Dom.get('da_messageEditorItemContentType').value);
                me._hide_spellcheck_menu();
                YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'html';
                me._focusHTML();              
            } else {
                if (DA.util.confirm(DA.locale.GetText.t_('MESSAGE_SWITCH_CONTENTTYPE_CONFIRM'))) {
                    me._html2text();
                    me._switchContentType(YAHOO.util.Dom.get('da_messageEditorItemContentType').value);
                    me._show_spellcheck_menu();
                    YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'text';
            me._focusText();
                } else {
                    DA.dom.changeSelectedIndex('da_messageEditorItemContentType', 'html');
                }
            }
        };
        /*if (BrowserDetect.browser === 'Explorer') {
            YAHOO.util.Dom.get('da_messageEditorItemToText').onkeydown  = this._disableESC;
            YAHOO.util.Dom.get('da_messageEditorItemCcText').onkeydown  = this._disableESC;
            YAHOO.util.Dom.get('da_messageEditorItemBccText').onkeydown = this._disableESC;
            YAHOO.util.Dom.get('da_messageEditorItemSubject').onkeydown = this._disableESC;
            YAHOO.util.Dom.get('da_messageEditorItemText').onkeydown    = this._disableESC;
        }*/
    
        this._addressWidth = this.addressWidth();
        this._addressHeight = this.addressHeight();

        DA.customEvent.fire('messageEditorInitAfter', this);
    },
    
    create_RTE: function(){
        initRTE(DA.vars.imgRdir + '/richText/','/js/richText/','/css/richText/', '', 'ajxmailer');
        writeRichText(this.htmlId + 'Contents', '', '100%', 300, true, false, "ja_JP", "ajxmailer", this.htmlNode);
    },

    create_FCKeditor: function(){
        var sBasePath = "/dui/richtext/";
        var me = this;
        
        window.FCKeditor_OnComplete = function(editorInstance) {
            me._FCKEditorCompleted = true;
        };
        
        this.fck = new FCKeditor(this.htmlId + 'Contents');
        this.fck.BasePath = sBasePath;
        this.fck.Config.CustomConfigurationsPath = sBasePath + DA.vars.richText.fckconfig.custom_file;
        if(DA.vars.richText.fckconfig.debug === '1'){
            this.fck.ToolbarSet = "DEBUG";
        }else{
            this.fck.ToolbarSet = "AJAX";
        }
        this.fck.Width = '100%';
        this.fck.Height = '100%';
        this.fck.Config.AutoDetectLanguage = false ;
        this.fck.Config.DefaultLanguage = DA.vars.richText.fckconfig.lang ;
    this.fck.Config.EditorAreaStyles=DA.vars.richText.fckconfig.editor_style;
    this.fck.Config.DefaultFontLabel=DA.vars.richText.fckconfig.font;
    this.fck.Config.DefaultFontSizeLabel=DA.vars.richText.fckconfig.font_size;

        var csrf;
        if (DA.vars.check_key_url) {
            csrf = DA.vars.check_key_url.replace(/^[\&]+/, "").split(/[\=]+/);
            this.fck.Config._DA_CSRF_KEY_ = csrf[0];
            this.fck.Config._DA_CSRF_VALUE_ = csrf[1];
        }

        if(DA.vars.richText.fckconfig.sm_link){
            this.fck.Config.InsSelectLink_SM = 1;
        }else{
            this.fck.Config.InsSelectLink_SM = 0;
        }
        if(DA.vars.richText.fckconfig.sh_link){
            this.fck.Config.InsSelectLink_OW = 1;
        }else{
            this.fck.Config.InsSelectLink_OW = 0;
        }
        if(DA.vars.richText.fckconfig.lib_link){
            this.fck.Config.InsSelectLink_LIB = 1;
        }else{
            this.fck.Config.InsSelectLink_LIB = 0;
        }
        this.htmlNode.innerHTML = this.fck.CreateHtml();    
    },
    
    createDDApplet: function(o) {
        var dd_applet;
        var warning = "<font color=red>" + DA.util.encode(DA.vars.appletDisabledMessage) + "</font>";
        var appletDom = YAHOO.util.Dom.get('da_messageEditorItemAttachmentDDApplet');
        var buttonDom = YAHOO.util.Dom.get('da_messageEditorItemAttachmentButtonsApplet');

        if ((DA.vars.config.upload_file_applet === 'inline' || DA.vars.config.upload_file_applet === 'hidden') && this.ddAppletAfterUpload && o.maid) {
             dd_applet = ['<applet mayscript code="at.activ8.a8dropzone.A8Dropzone" codebase="' + DA.util.encode(DA.vars.appletRdir) + '" archive="' + DA.util.encode(DA.vars.appletFile) + '" name="A8Dropzone" width="100%" height="40px">',
                          '<param name="postURL" value="' + DA.util.encode(DA.util.getServer() + DA.vars.cgiRdir + '/ajx_ma_upload.cgi?applet=1') + '">',
                          '<param name="postParam0" value="key=' + DA.util.encode(DA.util.getSessionId()) + '">',
                          '<param name="postParam1" value="proc=add">',
                          '<param name="postParam2" value="maid=' + DA.util.encode(o.maid) + '">',
                          '<param name="JavaScriptUploadCompleted" value="' + DA.util.encode(this.ddAppletUploadCompleted) + '">',
                          '<param name="JavaScriptBeforeUpload" value="' + DA.util.encode(this.ddAppletBeforeUpload) + '">',
                          '<param name="JavaScriptAfterUpload" value="' + DA.util.encode(this.ddAppletAfterUpload) + '">',
                          '<param name="label" value="' + DA.util.encode(DA.vars.appletLabel) + '">',
                          '<param name="bgImageName" value="' + DA.util.encode(DA.vars.appletImage) + '">',
                          '<param name="encoding" value="' + DA.util.encode(DA.vars.charset) + '">',
                          '<param name="maxFileNum" value="' + DA.util.encode(DA.vars.appletMaxFile) + '">',
                          '<param name="moreThanMaxMessage" value="' + DA.util.encode(DA.vars.appletMoreThanMaxMessage) + '">',
                          '<param name="JavaScriptmoreThanMax" value="' + DA.util.encode(this.ddAppletAfterMoreThanMax) + '">',
                          '<param name="openButton" value="' + DA.util.encode(DA.vars.appletFiler) + '">',
                          '<param name="directoryUpload" value="false">',warning,
                          '</applet>'].join('');
            buttonDom.style.display = "none";
        dd_applet = "<table width=100%><tr><td width=100%>" + dd_applet + "</td><td align=left valign=top><img  src=\""+DA.vars.imgRdir+"/dd_helpico.gif\" title=\""+DA.util.encode(DA.vars.appletTipMessage)+"\" border=0></td></tr></table>"; 
            appletDom.innerHTML = dd_applet;
            /* appletDom.style.borderStyle = "solid";
            appletDom.style.borderWidth = "2px";
            appletDom.style.paddingWidth = "0px";
            appletDom.style.marginWidth = "0px";
            appletDom.style.borderColor = "#84d195";
            appletDom.style.height = "40px"; */

            if (appletDom.innerHTML === "") {
                appletDom.innerHTML = warning;
            }

            this.doResize();
        }
    },
    
    values: function() {
        var values = {
            maid: this.selectedMaid,
            tid: this.selectedTid,
            sid: this.selectedSid,
            priority: (this.contentsPairs.expanded) ? DA.dom.selectValue('da_messageEditorItemPriority') : DA.dom.selectValue('da_messageEditorItemPriorityCollapse'),
            charset: DA.dom.selectValue('da_messageEditorItemCharset'),
            notification: (DA.dom.checkedOk('da_messageEditorItemNotification') ? 1 : 0),
            preview: 0,
            reply_use: (DA.dom.checkedOk('da_messageEditorItemReplyUse') ? 1 : 0),
            group_name: (DA.dom.checkedOk('da_messageEditorItemGroupName') ? 1 : 0),
            open_status: (DA.dom.checkedOk("da_messageEditorItemOpenStatus") ? 1 : 0),
            to_list: this.toController.list(),
            cc_list: this.ccController.list(),
            bcc_list: this.bccController.list(),
            to_text: DA.dom.textValue('da_messageEditorItemToText'),
            cc_text: DA.dom.textValue('da_messageEditorItemCcText'),
            bcc_text: DA.dom.textValue('da_messageEditorItemBccText'),
            from: {
                select: DA.dom.selectValue('da_messageEditorItemFromAddressSelect')
            },
            in_reply_to: DA.dom.hiddenValue('da_messageEditorItemInReplyTo'),
            references: DA.dom.hiddenValue('da_messageEditorItemReferences'),
            subject: (this.contentsPairs.expanded) ? DA.dom.textValue('da_messageEditorItemSubject'): DA.dom.selectValue('da_messageEditorItemSubjectCollapse'),
            body: {
                text: this._getText(),
                html: this._getHTML()
            },
            attach_list: this.fileController.list()
        };
        DA.customEvent.fire("messageEditorValuesAfter", this, values); 
        return values;
    },
    
    add: function(o) {
        if (o.to_list && o.to_list.length > 0) {
            this.toController.addList(o.to_list);
        }
        if (o.cc_list && o.cc_list.length > 0) {
            this._showAddressCcBcc();
            this.ccController.addList(o.cc_list);
        }
        if (o.bcc_list && o.bcc_list.length > 0) {
            this._showAddressCcBcc();
            this.bccController.addList(o.bcc_list);
        }
        if (o.to_list || o.cc_list || o.bcc_list) {
            this._refreshGroupName();
        }
        if (o.attach_list && o.attach_list.length > 0) {
            this.fileController.addList(o.attach_list);
            this.currentSizeNode.innerHTML = this.fileController.total();
        }
    },
    
    set: function(o) {
        var me = this;
        var i, fromKeys = ['email', 'keitai_mail', 'pmail1', 'pmail2'], html = '';
        
        if(o.mode)
        {
            this.mode = o.mode;
        }
        
        if (DA.util.isNull(o.to_text)) {
            DA.dom.changeValue('da_messageEditorItemToText', '');
        } else if (o.to_text) {
            DA.dom.changeValue('da_messageEditorItemToText', o.to_text);
        }
        if (DA.util.isNull(o.cc_text)) {
            DA.dom.changeValue('da_messageEditorItemCcText', '');
        } else if (o.cc_text) {
            DA.dom.changeValue('da_messageEditorItemCcText', o.cc_text);
            this._showAddressCcBcc();
        }
        if (DA.util.isNull(o.bcc_text)) {
            DA.dom.changeValue('da_messageEditorItemBccText', '');
        } else if (o.bcc_text) {
            DA.dom.changeValue('da_messageEditorItemBccText', o.bcc_text);
            this._showAddressCcBcc();
        }
        if (o.to_list) {
            if (this.toController) {
                this.toController.clear();
                this.toController.addList(o.to_list);
            }
        }
        if (o.cc_list) {
            if (o.cc_list.length > 0) {
                this._showAddressCcBcc();
            }
            if (this.ccController) {
                this.ccController.clear();
                this.ccController.addList(o.cc_list);
            }
        }
        if (o.bcc_list) {
            if (o.bcc_list.length > 0) {
                this._showAddressCcBcc();
            }
            if (this.bccController) {
                this.bccController.clear();
                this.bccController.addList(o.bcc_list);
            }
        }
        if (o.to_list || o.cc_list || o.bcc_list) {
            this._refreshGroupName();
        }
        if (o.from) {
            for (i = 0; i < fromKeys.length; i ++) {
                if (!DA.util.isEmpty(o.from[fromKeys[i]])) {
                    html += '<option value="' + fromKeys[i] + '">' + DA.util.encode(o.from[fromKeys[i]]) + '</option>';
                }
            }
            if (!DA.util.isEmpty(html)) {
                html = DA.util.encode('<') + '<select id="da_messageEditorItemFromAddressSelect" disabled="disabled">' + html + '</select>' + DA.util.encode('>');
                YAHOO.util.Dom.get('da_messageEditorItemFromAddress').innerHTML = html;
                DA.dom.changeSelectedIndex('da_messageEditorItemFromAddressSelect', o.from.select);
                me.selectedFrom=YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value;
                YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').onchange = function() {
                    if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'keitai_mail') {
                        if (!DA.util.isNull(o.from.nameM)) {
                            YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.nameM)+'&nbsp;';
            }
                        DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sign_init.sign_init_pM);
                        me.sign(o.sign_init.sign_init_pM, me.selectedSid, 'keitai_mail', me.selectedFrom);
                    } else if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'email') {
                        if(!DA.util.isNull(o.from.name)){
                            YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name)+'&nbsp;';
        }
                        DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sign_init.sign_init_p);
                        me.sign(o.sign_init.sign_init_p, me.selectedSid, 'email', me.selectedFrom);
                    } else if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'pmail1') {
                        if (!DA.util.isNull(o.from.name1)) {
                            YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name1)+'&nbsp;';
                        }
                        DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sign_init.sign_init_p1);
                        me.sign(o.sign_init.sign_init_p1, me.selectedSid, 'pmail1', me.selectedFrom);
                    } else {
                        if (!DA.util.isNull(o.from.name2)) {
                            YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name2)+'&nbsp;';
                        }
                        DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sign_init.sign_init_p2);
                        me.sign(o.sign_init.sign_init_p2, me.selectedSid, 'pmail2', me.selectedFrom);
                    }
                };
            }
            if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'keitai_mail') {
                if (!DA.util.isNull(o.from.nameM)) {
                    YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.nameM)+'&nbsp;';
                }
            } else if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'email') {
                if (!DA.util.isNull(o.from.name)) {
                    YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name)+'&nbsp;';
                }
            } else if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'pmail1') {
                if (!DA.util.isNull(o.from.name1)) {
                    YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name1)+'&nbsp;';
                }
            } else {
                if (!DA.util.isNull(o.from.name2)) {
                    YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name2)+'&nbsp;';
                }
            }
        }
        if (DA.util.isNull(o.subject)) {
            DA.dom.changeValue('da_messageEditorItemSubject', '');
        } else if (o.subject) {
            DA.dom.changeValue('da_messageEditorItemSubject', o.subject);
        }
        if (o.priority) {
            DA.dom.changeSelectedIndex('da_messageEditorItemPriority', o.priority);
        }
        if (o.charset) {
            DA.dom.changeSelectedIndex('da_messageEditorItemCharset', o.charset);
        }
        if (o.notification) {
            if (o.notification === 1) {
                DA.dom.changeChecked('da_messageEditorItemNotification', true);
            } else {
                DA.dom.changeChecked('da_messageEditorItemNotification', false);
            }
        }
        if(o.open_status){
            if(o.open_status===1){
                DA.dom.changeChecked("da_messageEditorItemOpenStatus",true);
            }else{
                DA.dom.changeChecked("da_messageEditorItemOpenStatus",false);
            }
        }
        if (o.group_name) {
            if (o.group_name === 1) {
                DA.dom.changeChecked('da_messageEditorItemGroupName', true);
            } else {
                DA.dom.changeChecked('da_messageEditorItemGroupName', false);
            }
        }
        if (o.reply_use) {
            if (o.reply_use === 1) {
                DA.dom.changeChecked('da_messageEditorItemReplyUse', true);
            } else {
                DA.dom.changeChecked('da_messageEditorItemReplyUse', false);
            }
        }
        if (DA.util.isNull(o.in_reply_to)) {
            DA.dom.changeValue('da_messageEditorItemInReplyTo', '');
        } else if (o.in_reply_to) {
            DA.dom.changeValue('da_messageEditorItemInReplyTo', o.in_reply_to);
        }
        if (DA.util.isNull(o.references)) {
            DA.dom.changeValue('da_messageEditorItemReferences', '');
        } else if (o.references) {
            DA.dom.changeValue('da_messageEditorItemReferences', o.references);
        }
        if (o.attach_list) {
            if (this.fileController) {
                this.fileController.clear();
                this.fileController.addList(o.attach_list);
                this.currentSizeNode.innerHTML = this.fileController.total();
            }
        }
        if (o.body) {
            if(o.content_type_all === 'text'){
                this._switchContentType('text');
                this._setText(o.body.text);
                this._setHTML('');
                YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'text';
                YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').innerHTML=DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CONTENTTYPE") + "&nbsp;:&nbsp;" + DA.locale.GetText.t_("MESSAGE_CONTENTTYPE_TEXT") + "&nbsp;&nbsp;";
            }else 
                if(o.content_type_all === 'html'){
                this._hide_spellcheck_menu();
                this._switchContentType('html');
                this._setHTML(o.body.html);
                this._setText('');
                YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'html';
                YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').innerHTML=DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CONTENTTYPE") + "&nbsp;:&nbsp;" + DA.locale.GetText.t_("MESSAGE_CONTENTTYPE_HTML") + "&nbsp;&nbsp;";
            }else{
                if (o.content_type === 'html') {
                    this._hide_spellcheck_menu();
                    this._switchContentType('html');
                    this._setHTML(o.body.html);
                    this._setText('');
                    DA.dom.changeSelectedIndex('da_messageEditorItemContentType', 'html');
                    YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'html';
                } else {
                    this._switchContentType('text');
                    this._setText(o.body.text);
                    this._setHTML('');
                    DA.dom.changeSelectedIndex('da_messageEditorItemContentType', 'text');
                    YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'text';
                }
            }
        }
        if (o.title_list) {
            this.titleList = o.title_list;
        }
        if (o.lang_list) {
            this.langList = o.lang_list;
        }
        if (o.sign_list) {
            this.signList = o.sign_list;
            this.selectedSid = o.sid;
            this.selectedFrom = o.from.select;
            
            html = '';
            for (i = 0; i < this.signList.length; i ++) {
                html += '<option value="' + DA.util.encode(this.signList[i].sid) + '">' + DA.util.encode(this.signList[i].name) + '</option>';
            }
            if (!DA.util.isEmpty(html)) {
                html = '<select id="da_messageEditorItemSign" disabled="disabled">' + html + '</select>';
                YAHOO.util.Dom.get('da_messageEditorItemSignList').innerHTML = html;
                DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sid);
                YAHOO.util.Dom.get('da_messageEditorItemSign').onchange = function() {
                    me.sign(DA.dom.selectValue(YAHOO.util.Dom.get('da_messageEditorItemSign')), me.selectedSid, DA.dom.selectValue(YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect')), me.selectedFrom);
                };
            }
        } else if (!DA.util.isEmpty(o.sid)) {
            this.selectedSid = o.sid;
            this.selectedFrom = o.before_from;
            
            DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sid);
        }
    },
    
    setPreview: function(o) {
    
        var fckHeadStyle, fckBody;
        var fckHeaderMatcher = /^<\!-- Created by DA_Richtext .*? end default style -->/;
        var fckStyleMatcher = /<style>.*?<\/style>/;
        
        this._setWarn(o.warn);
        
        if (o.to_list) {
            this.previewPairs.changeValue('To', DA.ug.list2String(o.to_list, 3));
        if (o.to_list.length > DA.vars.config.mail_to_resize_num) {
                this.previewPairs.scrollSeparator('To');
                this.previewPairs.showCursor("Cc");
            } else {
                this.previewPairs.unscrollSeparator('To');
                this.previewPairs.hideCursor("Cc");
            }
        } else {
            this.previewPairs.changeValue('To', '');
        this.previewPairs.unscrollSeparator('To');
        }
        if (o.cc_list) {
            this.previewPairs.changeValue('Cc', DA.ug.list2String(o.cc_list, 3));
        if (o.cc_list.length > DA.vars.config.mail_to_resize_num) {
                this.previewPairs.scrollSeparator('Cc');
                this.previewPairs.showCursor("Bcc");
            } else {
                this.previewPairs.unscrollSeparator('Cc');
                this.previewPairs.hideCursor("Bcc");
            }
        } else {
            this.previewPairs.changeValue('Cc', '');
            this.previewPairs.unscrollSeparator('Cc');
        }
        if (o.bcc_list) {
            this.previewPairs.changeValue('Bcc', DA.ug.list2String(o.bcc_list, 3));
        if (o.bcc_list.length > DA.vars.config.mail_to_resize_num) {
                this.previewPairs.scrollSeparator('Bcc');
                this.previewPairs.showCursor("Date");
            } else {
                this.previewPairs.unscrollSeparator('Bcc');
                this.previewPairs.hideCursor("Date");
            }
        } else {
            this.previewPairs.changeValue('Bcc', '');
        this.previewPairs.unscrollSeparator('Bcc');
        }
        if (o.from_list) {
            this.previewPairs.changeValue('From', DA.ug.list2String(o.from_list, 3));
        if (o.from_list.length > 12) {
                this.previewPairs.scrollSeparator('From');
            } else {
                this.previewPairs.unscrollSeparator('From');
            }
        } else {
            this.previewPairs.changeValue('From', '');
        this.previewPairs.unscrollSeparator('From');
        }
        if (o.attach_list) {
            this.previewPairs.changeValue('Attachment', DA.file.list2String(o.attach_list, 3));
        } else {
            this.previewPairs.changeValue('Attachment', '');
        }
        
        this.previewPairs.changeValue('Subject', DA.util.encode(o.subject));
        FCKEditorIframeController.removeIframe(this.previewId + 'Contents' + "FckEditorPreViewer", this.previewContentsNode);
        if (DA.util.isEmpty(o.body.html)) {
            if (DA.util.isEmpty(o.body.text)) {
                this.previewContentsNode.innerHTML = '';
            }else if(DA.vars.config.b_wrap === 'on'){
                this.previewContentsNode.innerHTML = o.body.text;
            } else {
                this.previewContentsNode.innerHTML = '<pre style="height:100%;">' + o.body.text + '</pre>';
            }
        } else {
            if (FCKEditorIframeController.isFCKeditorData(o.body.html)) {
                fckHeadStyle = o.body.html.match(fckStyleMatcher);
                fckBody = o.body.html.replace(fckStyleMatcher, "");
                FCKEditorIframeController.createIframe(this.previewId + 'Contents' + "FckEditorPreViewer", this.previewContentsNode);
                FCKEditorIframeController.setIframeBody(this.previewId + 'Contents' + "FckEditorPreViewer", ['<head>', fckHeadStyle, '<style>body {margin:0px; padding:0px; border:0;}</style>','<script>function Pop4Ajax(Url,Width,Height,POSX,POSY){ top.Pop4Ajax(Url,Width,Height,POSX,POSY);}</script>', '</head>', '<body>','<div style="word-break:break-all">', fckBody, '</div>', '</body>'].join("\n"));
            } else{            
                this.previewContentsNode.innerHTML = o.body.html;
            }
        }
    },
    
    edit: function(query) {
        var me = this;
        var h = { proc: query.proc };
        var c_set;
        var c_win;
        var maid_input;
        var i = 0;
        
        if (me.lock()) {
            me.jsonIO.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me.selectedFid  = parseInt(query.fid, 10);
                    me.proc         = query.proc; 
                    if(me.proc === 'new') {
                         me.selectedUid  = null;
                    }else {
                         me.selectedUid  = parseInt(query.uid, 10);
                    }
                    me.selectedMaid = o.maid;
                    me.selectedTid  = (DA.util.isEmpty(o.tid)) ? '' :o.tid;
                    
                    if (DA.vars.config.upload_file_applet === 'inline') {
                        me.createDDApplet(o);
                    } else if (DA.vars.config.upload_file_applet === 'hidden') {
                        YAHOO.util.Dom.get('da_messageEditorItemAttachmentButtonsApplet').disabled = false;
                    }
                    me.set(o);
                    me.doResize();
                    me.onLoad(o); 
                    if(o.hide_save_button === 'true') {
                        window.__topPanel.panelMenu.hide('save');
                    }
                    if (DA.vars.system.auto_backup_on === 1 && DA.vars.config.backup === 'on') {
                        me.setAutoBackup();
                    }
            DA.customEvent.fire("messageEditorOnLoadDoneAfter", me, o);
                } else {
                    DA.windowController.allClose();
                    window.close();                
                }
                
                me.unlock();
                me.onEnable();
                me._enableButtons();
            };
            
            me.jsonIO.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("MESSAGE_EDIT_ERROR"));
                
                me.unlock();
            };
            
            if (DA.util.isEmpty(query.url)) {
                if (!DA.util.isEmpty(query.fid)) {
                    h.fid = query.fid;
                    h.uid = query.uid;
                }
                if(!DA.util.isEmpty(query.backup_maid)) {
                    h.backup_maid = query.backup_maid;
                    me.backup_maid = query.backup_maid;
                }
                if (!DA.util.isEmpty(query.tid)) {
                    h.tid = query.tid;
                }
                if (!DA.util.isEmpty(query.quote)) {
                    h.quote = query.quote;
                }
                me.jsonIO.execute(h);
            } else {
                h = DA.util.parseQuery(DA.util.pack(query.url));
                me.jsonIO.execute(h);
            }
        }
    },

    setAutoBackup: function() {
        this._autoBackup();
    },
   
   _autoBackup: function() {
        var me = this;
        var val, val_d, xml, xml_d, io;
        
        if (me.lock()) {
            val   = me.values();
            me.unlock();
            xml = DA.util.makeXml(val, 'ajx_ma_new.cgi');
            xml_d = xml;
            xml_d = xml_d.replace(/!-- start default style.*!-- end default style/ig, "");
            if (me.autoBackupedXML === xml_d) {
                setTimeout(function() {
                    me._autoBackup();
                }, me.autoBackupTimeout);
            } else {
                io = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_new.cgi' );
                io.callback = function(o) {
                    if (DA.mailer.util.checkResult(o)) {
                        if (!DA.util.isEmpty(o.result.error) && o.result.error !== 0 && DA.util.isEmpty(me.backup_timeout_msg_alerted)) {
                            me.backup_timeout_msg_alerted = 1;
                            DA.util.warn(o.result.message);
                        }else if(DA.util.isEmpty(o.result.error) || o.result.error === 0) {
                            me.backup_maid = o.result.backup_maid;
                        }
                        me.autoBackupedXML = xml_d;
                   
                        setTimeout(function() {
                            me._autoBackup();
                        }, me.autoBackupTimeout);
                    }else {
                         setTimeout(function() {
                            me._autoBackup();
                         }, me.autoBackupTimeout);
                    }
                };
                
                io.errorHandler = function(e) {
                    setTimeout(function() {
                        me._autoBackup();
                    }, me.autoBackupTimeout);
                };

                io.execute({ proc: 'backup', maid: me.selectedMaid, backup_maid: me.backup_maid, Preproc:me.proc, uid:me.selectedUid, xml: xml, content_type:YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value });
            }
        } else {
            setTimeout(function() {
                me._autoBackup();
            }, me.autoBackupTimeout);
        }
    },
   
    template: function(tid) {
        var me = this;
        var io;
        var type;
        
        if(null===document.getElementById('da_messageEditorItemContentType')){
            type = YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value || "text";
        }else{
            type = YAHOO.util.Dom.get('da_messageEditorItemContentType').value || "text";
        }
        
        if (me.lock()) {
            if (DA.util.confirm(DA.locale.GetText.t_('MESSAGE_TEMPLATE_CONFIRM'))) {
                io = this.tmplIO;
                
                io.callback = function(o) {
                    if (DA.mailer.util.checkResult(o)) {
                        me.selectedTid = (DA.util.isEmpty(o.tid)) ? '' :o.tid;
                        me.set(o);
                        me.selectedFrom = DA.dom.selectValue(YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect'));
                        me.doResize();
                    }
                    
                    me.unlock();
                };
                
                io.errorHandler = function(o) {
                    DA.util.warn(DA.locale.GetText.t_("MESSAGE_TEMPLATE_ERROR"));
                    
                    me.unlock();
                };
                
                io.execute({ tid: tid, from: DA.dom.selectValue(YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect')), content_type:type, content_type_all:YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value });
            } else {
                me.unlock();
            }
        }
    },
    
    sign: function(sid, before_sid, from, beFrom) {
        var me = this;
        var io, contentType, body;
        
        if (me.lock()) {
            io = this.signIO;
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me.selectedSid = o.sid;
                    me.selectedFrom = o.before_from;
                    me.set(o);
                    me.doResize();
                }
                
                me.unlock();
            };
            
            io.errorHandler = function(o) {
                DA.util.warn(DA.locale.GetText.t_("MESSAGE_SIGN_ERROR"));
                
                me.unlock();
            };
            
            contentType = DA.dom.selectValue("da_messageEditorItemContentTypeAll");
            body = (contentType === 'html') ? this._getHTML() : this._getText();
            
            io.execute({
                sid: sid,
                before_sid: before_sid,
                content_type: contentType,
                from: from,
                before_from: beFrom,
                body: body
            });
        }
    },
    
    transmit: function() {
        var me = this;
        var splchk = this.spellcheckMode;
        var id;
        var timeOut = 0;
        var msg;

        if (me.lock()) {
            if (this.previewMode ||
               !this.isEmpty(DA.dom.textValue('da_messageEditorItemSubject')) ||
               !this.isEmpty(DA.dom.textValue('da_messageEditorItemSubjectCollapse')) ||
                DA.util.confirm(DA.locale.GetText.t_('EDITOR_TITLEEMPTY_TRANSMIT_CONFIRM'))) {
                
                if (DA.tipDlg.isInit()) {
                    DA.tipDlg.hide();
                }
                me.forced_interruption=0;
                msg = DA.locale.GetText.t_("TRANSMIT_OPERATING_PROMPT")+'</span><br><span style="font-size:10px;color:red;">&nbsp;'+DA.locale.GetText.t_("FORCED_INTERRUPTION_COMMENT")+'&nbsp;';
                if(DA.vars.config.forced_interruption==='on'){
                    DA.waiting.show(msg, null, [{
                        string: DA.locale.GetText.t_("FORCED_INTERRUPTION"),
                            onclick: function() {
                            me.forced_interruption=1;
                            alert(DA.locale.GetText.t_("FORCED_INTERRUPTION_ALERT"));
                            me.onForcedInterruption();
                            me.unlock();
                            DA.waiting.hide();
                            }
                    }], "transmit");
                }else{
                    DA.waiting.show(DA.locale.GetText.t_("TRANSMIT_OPERATING_PROMPT"));
                    
                }
                
                
                id = setInterval(function() {
                    var io, val, xml;
                    timeOut+=1;
                    if (timeOut > DA.vars.system.upload_retry4ajx) {
                        clearInterval(id);
                        DA.util.warn(DA.locale.GetText.t_("MESSAGE_ATTACHMENT_UPLOAD_ERROR"));
                        me.unlock();
                        DA.waiting.hide();
                    }
                    
                    if (!DA.io.Manager.isActive() && !me.isUploading()) {
                        clearInterval(id);
                        io  = me.jsonIO;
                        val = me.values();
                        xml = DA.util.makeXml(val, 'ajx_ma_new.cgi');
                        
                        io.callback = function(o) {
                            // TODO: 根本対応
                            // IE で SELECTが表示されなくなる対応
                            if(me.forced_interruption!==1){
                            
                                DA.waiting.hide();
                            
                                setTimeout(function() {
                                    var msgstr = '';
                                    var i;
                                    var btnBack;
                                    if (DA.mailer.util.checkResult(o)) {
                                        if (o.warn && o.warn.length > 0) {
                                            if (DA.tipDlg && 'function' === typeof DA.tipDlg.init) {
                                                for (i = 0; i < o.warn.length; i ++) {
                                                    msgstr += '[ ! ] ' + o.warn[i] + '<br>';
                                                    if (o.warn[i] === DA.locale.GetText.t_('SPELLCHECK_NG')) {
                                                        btnBack = 'preview';
                                                    }
                                                }
                                                DA.tipDlg.init(DA.locale.GetText.t_('MAIL_SEND_CONFIRM'),
                                                           DA.locale.GetText.t_("READY_OK"),
                                                           msgstr, btnBack);
                                            }
                                            me.setPreview(o);
                                            me._switchPreviewMode(true);
                                            me.doResize();
                                            me.onPreview();
                                            DA.tipDlg.show();
                                        } else {
                                            if (!me.external) {
                                                try {
                                                    DA.mailer.Events.onMessageSent.fire({
                                                        uid: me.selectedUid,
                                                        fid: me.selectedFid,
                                                        mode:me.mode
                                                    }, o);
                                                } catch (e) {
                                                    DA.util.warn(DA.locale.GetText.t_("MESSAGE_TRANSMIT_ERROR2"));
                                                }
                                            }
                                            DA.windowController.allClose();
                                            me.close();
                                        }
                                    }
                                    me.unlock();
                                }, 500);
                            }
                        };
                        
                        io.errorHandler = function(o) {
                            DA.util.warn(DA.locale.GetText.t_("MESSAGE_TRANSMIT_ERROR"));
                            me.unlock();
                            DA.waiting.hide();
                        };
                        
                        io.execute({ proc: 'send', maid: me.selectedMaid, backup_maid: me.backup_maid, Preproc:me.proc, fid:me.selectedFid, uid:me.selectedUid,  mode:me.mode, xml: xml, nopreview: (me.previewMode) ? 1 : 0, spellcheck: splchk, content_type:YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value, external:this.external ? 1 : 0 });
                    }
                }, 1000);
            } else {
                me.unlock();
            }
        }
    },
    
    save: function() {
        var me = this;
        var id;
        var mailSaveFlag = 0;        
        var timeOut = 0;
 
        if (me.lock()) {
            if (this.previewMode ||
               !DA.util.isEmpty(DA.dom.textValue('da_messageEditorItemSubject')) ||
               !DA.util.isEmpty(DA.dom.textValue('da_messageEditorItemSubjectCollapse')) ||
                DA.util.confirm(DA.locale.GetText.t_('EDITOR_TITLEEMPTY_SAVE_CONFIRM'))) {
                
                if (DA.tipDlg.isInit()) {
                    DA.tipDlg.hide();
                }
                DA.waiting.show(DA.locale.GetText.t_("SAVE_OPERATING_PROMPT"));
                
                id = setInterval(function() {
                    var io, val, xml;
                    
                    timeOut+=1;
                    if (timeOut > DA.vars.system.upload_retry4ajx) {
                        clearInterval(id);
                        DA.util.warn(DA.locale.GetText.t_("MESSAGE_ATTACHMENT_UPLOAD_ERROR"));
                        me.unlock();
                        DA.waiting.hide();
                    }
                    if (!DA.io.Manager.isActive() && !me.isUploading()) {
                        clearInterval(id);
                        io  = me.jsonIO;
                        val = me.values();
                        xml = DA.util.makeXml(val, 'ajx_ma_new.cgi');
                        
                        io.callback = function(o) {
                            if (DA.mailer.util.checkResult(o)) {
                                mailSaveFlag = 1;
                                if (!me.external) {
                                    DA.mailer.Events.onMessageSaved.fire({
                                        uid: me.selectedUid,
                                        fid: me.selectedFid
                                    }, o);
                                }
                                me.unlock();
                                DA.waiting.hide();
                                if (o.save_target) {
                                    DA.util.warn(DA.locale.GetText.t_('SAVE_MAIL_MESSAGE', o.save_target));
                                    DA.windowController.allClose();
                                    me.close();
                                }
                            }
                            else{
                            me.unlock();
                            DA.waiting.hide();
                            }
                        };
                        
                        io.errorHandler = function(o) {
                            if (mailSaveFlag === 1) {
                                DA.util.warn(DA.locale.GetText.t_("MESSAGE_SAVE_ERROR2"));
                            } else {
                                DA.util.warn(DA.locale.GetText.t_("MESSAGE_SAVE_ERROR"));
                            }
                            me.unlock();
                            DA.waiting.hide();
                        };
                        
                        io.execute({ proc: 'draft', maid: me.selectedMaid, backup_maid: me.backup_maid, Preproc:me.proc, uid:me.selectedUid, fid:me.selectedFid,  xml: xml, content_type:YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value, external:this.external ? 1 : 0 });
                    }
                }, 1000);
            } else {
                me.unlock();
            }
        }
    },
    
    preview: function() {
        var me = this;
        var splchk = this.spellcheckMode;
        var id;
        
        if (me.lock()) {
            id = setInterval(function() {
                var io, val, xml;

                if (!DA.io.Manager.isActive() && !me.isUploading()) {
                    clearInterval(id);
                    io  = me.jsonIO;
                    val = me.values();
                    xml = DA.util.makeXml(val, 'ajx_ma_new.cgi');
                    
                    io.callback = function(o) {
                        if (DA.mailer.util.checkResult(o)) {
                            me.setPreview(o);
                            me._switchPreviewMode(true);
                            me.doResize();
                            me.onPreview();
                        }
                        
                        me.unlock();
                    };
                    
                    io.errorHandler = function(o) {
                        DA.util.warn(DA.locale.GetText.t_("MESSAGE_PREVIEW_ERROR"));
                        
                        me.unlock();
                    };
                    
                    io.execute({ proc: 'preview', maid: me.selectedMaid,uid:me.selectedUid, fid:me.selectedFid,  xml: xml, spellcheck: splchk, content_type:YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value });
                }
            }, 1000);
        }
    },
    print: function(printToConfig) {
        var me=this;
        var id;
        if(me.lock()){
            id=setInterval(function(){
                var io,val,xml;
                if(!DA.io.Manager.isActive()&&!me.isUploading()){
                    clearInterval(id);
                    io=me.jsonIO;
                    val=me.values();
                    xml=DA.util.makeXml(val,"ajx_ma_new.cgi");
                    io.callback=function(o){
                        DA.windowController.winOpen(DA.vars.cgiRdir+"/ma_ajx_print.cgi?maid="+me.selectedMaid+"&content_type="+YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value+ '&printtoconfig=' + printToConfig,"",710,600);
                        me.unlock();
                    };
                    io.errorHandler=function(o){
                        DA.util.warn(DA.locale.GetText.t_("MESSAGE_PRINT_ERROR"));
                        me.unlock();
                    };
                    io.execute({proc:"print",maid:me.selectedMaid,xml:xml,content_type:YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value});
                }
            },1000);
        }
    },
    spellcheck: function(splckMode, splckType) {
        this.spellcheckMode = splckMode;        
        if (splckType === 'preview') {
            this.preview();
        } else if (splckType === 'transmit') {
            this.transmit();
        }
        
        this.spellcheckMode =  DA.vars.config.spellcheck_mode;
    },
    
    back: function() {
        if (!this.existsLock()) {
            if (DA.tipDlg.isInit()) {
                DA.tipDlg.hide();
            }
            this._switchPreviewMode(false);
            this.onBack();
            if (YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value === 'html'){
                this._hide_spellcheck_menu();
            } else {
                this._show_spellcheck_menu();
        }
        }
    },
        
    addressWidth: function(w) {
        if (w) {
            DA.session.Values.registerValue("addressWindowWidth", w);
        }
        return DA.session.Values.getValue("addressWindowWidth") || DA.vars.config.width_addr;
    },
    addressHeight: function(h) {
        if (h) {
         DA.session.Values.registerValue("addressWindowHeight", h);
        }
        return DA.session.Values.getValue("addressWindowHeight") || DA.vars.config.height_addr;
    },
    setAddressWindowSize: function(self) {
        var document = self.document;

        var getViewportWidth = function() {
            var mode = document.compatMode;
            var width = (mode ==='CSS1Compat') ?
            document.documentElement.clientWidth : // Standards
            document.body.clientWidth; // Quirks

            return width;
    };
        var getViewportHeight = function() {
            var mode = document.compatMode;
            var height = (mode ==='CSS1Compat') ?
            document.documentElement.clientHeight : // Standards
            document.body.clientHeight; // Quirks

         return height;
     };

        var width = getViewportWidth();
        var height = getViewportHeight();
        try {
            this.addressWidth(width);
            this.addressHeight(height);
        } catch(e) {
        }
    },
    close: function() {

        DA.mailer.checkSession();

        var io = new DA.io.JsonIO(DA.vars.cgiRdir + "/ajx_ma_config.cgi");
        var s = {
            editorWidth: YAHOO.util.Dom.getViewportWidth(),
            editorHeight: YAHOO.util.Dom.getViewportHeight(),
            addressWidth: this.addressWidth(),
            addressHeight: this.addressHeight()
        };

        var h = {
            proc: "editor"
        };

        if (s.editorWidth) {
            h.editor_window_width = s.editorWidth;
        }
        if (s.editorHeight) {
            h.editor_window_height = s.editorHeight;
        }
        if (s.addressWidth) {
            h.address_window_width = s.addressWidth;
        }
        if (s.addressHeight) {
            h.address_window_height = s.addressHeight;
        }

        if (s.editorWidth !== DA.mailer.windowController.editorWidth() || s.editorHeight !== DA.mailer.windowController.editorHeight() || s.addressWidth !== this._addressWidth || s.addressHeight !== this._addressHeight) {

            if (s.editorWidth) {
                DA.mailer.windowController.editorWidth(s.editorWidth);
            }
            if (s.editorHeight) {
                DA.mailer.windowController.editorHeight(s.editorHeight);
            }

            io.callback = function() {
                window.close();
            };

            io.errorHandler = function() {
                window.close();
            };
    
            io.execute(h);
        } else {
            window.close();
        }
    },
    openAddress:function(fld){
        var Target = '';
        var Proc = 'ma_address.cgi%3ffld=' + fld + ':' + this.selectedMaid +
                   '%20search_target=' + Target;
        var Img  = 'pop_title_adrbook.gif';
        
        if (DA.vars.custom.editor.setAddressProc) {
            eval(DA.vars.custom.editor.setAddressProc);
        }
        
        if (DA.util.isEmpty(this.selectedMaid)) {
            return;
        } else {
        DA.mailer.checkSession();
            DA.windowController.isePopup(Proc,Img,this.addressWidth(),this.addressHeight(),this.selectedMaid);
        }
    },
    
    setAddress: function() {
        var me = this;
        var io;
        
        if (!me.existsLock()) {
            io = this.jsonIO;
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me.add(o);
                    me.doResize();
                }
            };
            
            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("ADDRESS_SET_ERROR"));
            };
            
            io.execute({ proc: 'address', maid: this.selectedMaid });
        }
    },
    
    upload: function() {
        var me = this;
        var io, i, time, current, name;
        
        if (!me.existsLock()) {
            time = DA.util.getTime();
            current = me.currentUploadForm;
            
            for (i = 0; i < current.childNodes.length; i ++) {
                switch (current.childNodes[i].name) {
                    case 'path' :
                        name = current.childNodes[i].value;
                        break;
                    case 'maid' :
                        current.childNodes[i].value = me.selectedMaid;
                        break;
                    default:
                        break;
                }
            }
            
            if (!name.match(/^\s*$/)) {
                me._hideUploadForm(current);
                me._addUploadForm();
                me.fileController.add({
                    aid: 'dummy_' + time,
                    name: name,
                    size: 0,
                    icon: '',
                    warn: '',
                    link: '',
                    document: ''
                });
                me.uploading[time] = true;
                me.doResize();
                
                io = new DA.io.FileUploadIO( DA.vars.cgiRdir + '/ajx_ma_upload.cgi' );
                
                io.callback = function(o, args) {
                    me.fileController.remove('dummy_' + args.time);
                    me._removeUploadForm(current);
                    
                    if (DA.mailer.util.checkResult(o)) {
                        me.add(o);
                        me.doResize();
                    }
                    
                    me.uploading[args.time] = false;
                };
                
                io.errorHandler = function(e, args) {
                    DA.util.warn(DA.locale.GetText.t_("UPLOAD_ERROR"));
                    
                    me.fileController.remove('dummy_' + args.time);
                    me._removeUploadForm(current);
                    
                    me.uploading[args.time] = false;
                    
                    me.doResize();
                };
                
                io.execute(current, { time: time });
            }
        }
    },
    
    isUploading: function() {
        var time, uploading = false;
        
        for (time in this.uploading) {
            if (!DA.util.isFunction(this.uploading[time])) {
                if (this.uploading[time]) {
                    uploading = true;
                }
            }
        }
        
        return uploading;
    },
    
    _addUploadForm: function() {
        var me = this;

        var form = document.createElement('form');
        var proc = document.createElement('input');
        var maid = document.createElement('input');
        var path = document.createElement('input');
        var size = document.createElement('span');
        var icon = document.createElement('img');
        
        form.id = 'da_messageEditorItemAttachmentForm_' + DA.util.getTime();
        
        proc.type  = 'hidden';
        proc.name  = 'proc';
        proc.value = 'add';
        
        maid.type = 'hidden';
        maid.name = 'maid';
        
        path.type = 'file';
        path.name = 'path';
        path.className = 'da_messageEditorItemFile';
        path.onchange = function() {
            me.upload();
        };
        if (BrowserDetect.browser === 'Explorer') {
            path.onkeydown = function() {
                var keyCode = YAHOO.util.Event.getCharCode(event);
                if (keyCode === Event.KEY_ESC) {
                    return false;
                } else if (path.value.match(/^\s*$/) && keyCode === Event.KEY_RETURN) {
                    return false;
                }
                return true;
            };
        }
        
        if (this.fileController) {
            size.innerHTML = this.fileController.total();
        }
        
        icon.src = DA.vars.imgRdir + '/aqbtn_attach.gif';
        icon.onclick = function() {
            path.click();
        };
        
        form.appendChild(proc);
        form.appendChild(maid);
        form.appendChild(path);
        form.appendChild(size);
        form.appendChild(icon);
        
        if (BrowserDetect.browser === 'Explorer') {
            //form.style.display = 'none';
            icon.style.display = 'none';
        } else {
            icon.style.display = 'none';
        }
        
        YAHOO.util.Dom.get('da_messageEditorItemAttachmentFormOuter').appendChild(form);
        
        this.currentUploadForm = form;
        this.currentSizeNode = size;
    },
    
    disableUploadForm: function() {
        if (BrowserDetect.browser === 'Explorer') {
            this.currentUploadForm.disabled = true;
        } else {
            this.currentUploadForm.path.disabled = true;
        }
    },
    
    enableUploadForm: function() {
        if (BrowserDetect.browser === 'Explorer') {
            this.currentUploadForm.disabled = false;
        } else {
            this.currentUploadForm.path.disabled = false;
        }
    },
    
    _hideUploadForm: function() {
        this.currentUploadForm.style.display = 'none';
    },
    
    _removeUploadForm: function(node) {
        node.parentNode.removeChild(node);
    },
    
    _switchPreviewMode: function(mode) {
        if (mode) {
            this.contentsPairs.hide();
            this.previewPairs.show();
            this._hideBodyText();
            this._hideBodyHTML();
            this._showWarn();
            this._showBodyPreview();
            this.previewMode = true;
        } else {
            this.previewPairs.hide();
            this.contentsPairs.show();
            this._hideWarn();
            this._hideBodyPreview();
            if(YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value === 'html'){
                this._showBodyHTML();
                this._focusHTML();
            }else 
            if(YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value === 'text'){
                this._showBodyText();
                this._focusText();
            }else 
            if (DA.dom.selectValue('da_messageEditorItemContentType') === 'html') {
                this._showBodyHTML();
                this._focusHTML();
            } else {
                this._showBodyText();
        this._focusText();
            }
            this.previewMode = false;
            this.doResize();
        }
    },
    
    _switchContentType: function(contentType) {
        if (contentType === 'text') {
            this._hideBodyHTML();
            this._showBodyText();
        } else {
            this._hideBodyText();
            this._showBodyHTML();
        }
    },
    
    _hideBodyText: function() {
        this.textNode.style.display = 'none';
    },
    
    _showBodyText: function() {
        this.textNode.style.display = '';
    },
    
    _hideBodyHTML: function() {
        this.htmlNode.style.display = 'none';
    },
    
    _showBodyHTML: function() {
        this.htmlNode.style.display = '';
    },
    
    _hideBodyPreview: function() {
        this.previewNode.style.display = 'none';
    },
    
    _showBodyPreview: function() {
        this.previewNode.style.display = '';
    },
    
    _getText: function() {
        return DA.dom.textAreaValue('da_messageEditorItemText');
    },
    
    _getHTML: function(opt) {
        if (!DA.vars.richText) { return; }
        if (DA.vars.richText.type === 'crossbrowser'){
                return this._getRTEHTML(opt);
        }
        else if (DA.vars.richText.type === 'fckeditor'){
                return this._getFCKHTML(opt);
        }
        else { }
    },

    _getRTEHTML: function(opt){
     try {
            if (opt) {
                if (BrowserDetect.browser === 'Explorer') {

                    return this.htmlContentsNode.contentWindow.document.body.innerText;
                } else {
            return this.htmlContentsNode.contentDocument.body.textContent.replace(/\xA0/g, ' ');
                }
            } else {
                return this.htmlContentsNode.contentWindow.document.body.innerHTML;
            }
        } catch (e) {
            // DA_DEBUG_START
            debugger;
            DA.log(e, "error", "MsgEditor");
            // DA_DEBUG_END
        }  
    },
    
    _getFCKHTML: function(opt){
        try {
            this.fckAPIs = FCKeditorAPI.GetInstance(this.fck.InstanceName);
            if (opt) {
                if (BrowserDetect.browser === 'Explorer') {
                    return this.fckAPIs.EditorDocument.body.innerText;
                } else {
            return this.fckAPIs.EditorDocument.body.textContent.replace(/\xA0/g, ' ');
                }
            } else {
                    return this.fckAPIs.GetXHTML();
            }
        } catch (e) {
            // DA_DEBUG_START
            debugger;
            DA.log(e, "error", "MsgEditor");
            // DA_DEBUG_END
        }
    },
    
    _setText: function(text) {
        DA.dom.changeValue('da_messageEditorItemText', text);
    this._focusText();
    },
   
    _focusText: function() {
    var me = this;
    setTimeout(function() {
        if (me.textNode.style.display !== "none") {
        YAHOO.util.Dom.get("da_messageEditorItemText").focus();
        }
    }, 200);
    },

    _setHTML: function(html) {
    if (!DA.vars.richText) { return; }
                switch(DA.vars.richText.type) {
                        case 'crossbrowser':   this._setRTEHTML(html); break;
                        case 'fckeditor':       this._setFCKHTML(html); break;
                }
    },
    
    _setRTEHTML: function(html){
         this.htmlContentsNode.contentWindow.document.body.innerHTML = (DA.util.isEmpty(html)) ? '' : html;
    },

    _setFCKHTML: function(html){
         var me = this;
         setTimeout(function() {
             if (me._FCKEditorCompleted === true) {
                 if (!me.fckAPIs) {
                     me.fckAPIs = FCKeditorAPI.GetInstance(me.fck.InstanceName);
                     me.fckAPIs.Events.AttachEvent('OnAfterSetHTML', function() {
                if (DA.dom.selectValue("da_messageEditorItemContentTypeAll") === "html") {
                            me._focusHTML();
                }
                     });
                 }
                 me.fckAPIs.SetHTML(DA.util.isEmpty(html) ? '' : html);
             } else {
                 me._setFCKHTML(html);
             }
         }, 100);
    },
    _focusHTML: function() {
        if (DA.vars.richText.type === 'crossbrowser') {
            this._focusRTEHTML();
        } else {
        clearTimeout(this._focusTimeout);
            this._focusFCKHTML();
        }
    },
    _focusRTEHTML: function() {
        this.htmlContentsNode.focus();
    },
    _focusFCKHTML: function() {
    var me = this;
    if (window.document.focus) {
        window.document.focus();
    } else {
        window.focus();
    }
    me.fckAPIs.Focus();
    setTimeout(function(){
    if (!me.fckAPIs.HasFocus) {
            me._focusFCKHTML();
        }
    }, 500);
    },
    _text2html: function() {
        this._setHTML(DA.util.encode(this._getText(), 2, 0, 1));
    },
    
    _html2text: function() {
        this._setText(this._getHTML(1));
    },
    
    _setWarn: function(warn) {
        var i, str = '';
        
        if (warn.length > 0) {
            for (i = 0; i < warn.length; i ++) {
                str += '[ ! ] ' + warn[i] + '<br>';
            }
            str += DA.locale.GetText.t_('READY_OK') + '<br>';
        } else {
            str = '&nbsp;';
        }
        
        this.warnNode.innerHTML = str;
    },
    
    _showWarn: function() {
        if (this.warnNode.innerHTML !== '&nbsp;') {
            this.warnNode.style.display = '';
        }
    },
    
    _hideWarn: function() {
        this.warnNode.style.display = 'none';
    },
    
    _refreshGroupName: function() {
        var to  = this._controller('to');
        var cc  = this._controller('cc');
        var bcc = this._controller('bcc');
        
        if (to.groupExists() || cc.groupExists() || bcc.groupExists()) {
            this._showGroupName();
        } else {
            this._hideGroupName();
        }

        if(to.userExists()||cc.userExists()||bcc.userExists()||to.groupExists()||cc.groupExists()||bcc.groupExists()){
            this._showOpenStatus();
        }else{
            this._hideOpenStatus();
        }
    },

    _showGroupName: function() {
        if (YAHOO.util.Dom.get('da_messageEditorItemGroupNameOuter').style.display === 'none') {
            YAHOO.util.Dom.get('da_messageEditorItemGroupNameOuter').style.display = '';
        }
    },
    
    _hideGroupName: function() {
        if (YAHOO.util.Dom.get('da_messageEditorItemGroupNameOuter').style.display === '') {
            YAHOO.util.Dom.get('da_messageEditorItemGroupNameOuter').style.display = 'none';
        }
    },

    _showOpenStatus:function(){
        if (DA.vars.system.open_status) {
            if(YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display==="none"){
                YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display="";
            }
        }
    },

    _hideOpenStatus:function(){
        if(YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display===""){
            YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display="none";
        }
    },
    
    _showAddressCcBcc: function() {
        if (YAHOO.util.Dom.get('da_messageEditorItemAddressCcBcc').style.display === '') {
            YAHOO.util.Dom.get('da_messageEditorItemAddressCcBcc').style.display = 'none';
            this.contentsPairs.showColumn('Cc');
            this.contentsPairs.showColumn('Bcc');
        }
    },
    
    _showRnDialog: function(string, x, y) {
        var me = this;
        
        if (!this.rnDialog) {
            this.rnDialog = new DA.widget.StringChangerDialog("da_messageEditorRenameDialog", DA.locale.GetText.t_("EDITOR_DIALOG_RENAME"), "", {
                onEnter: function() {
                    var name = YAHOO.util.Dom.get(me.rnDialog.childId('text')).value;

                    var a = {name:name}; 
                    
                    DA.customEvent.fire('changeNameDialogRenameBefore',me,{a:a}); 

                    me.rename(me.selectedFld, me.selectedSno, name);
                    
                    return true;
                }
            });
        }
        
        this.rnDialog.setString(string);
        this.rnDialog.show(x, y);
    },
    
    _hideRnDialog: function() {
        if (this.rnDialog) {
            this.rnDialog.hide();
        }
    },
    
    _showCeDialog: function(string, x, y) {
        var me = this;
        
        if (!this.ceDialog) {
            this.ceDialog = new DA.widget.StringChangerDialog("da_messageEditorChangeEmailDialog", DA.locale.GetText.t_("EDITOR_DIALOG_CHANGEEMAIL"), "", {
                onEnter: function() {
                    var email = YAHOO.util.Dom.get(me.ceDialog.childId('text')).value;
                    
                    me.changeEmail(me.selectedFld, me.selectedSno, email);
                    
                    return true;
                }
            });
        }
        
        this.ceDialog.setString(string);
        this.ceDialog.show(x, y);
    },
    
    _hideCeDialog: function() {
        if (this.ceDialog) {
            this.ceDialog.hide();
        }
    },
    
    _showPopupMenu: function(fld, sno) {
        var controller = this._controller(fld);
        var me = this;
        var io;
        
        if (!this.existsLock()) {
            if (controller.isUser(sno)) {
                io = this.userIO;
            } else if (controller.isAddr(sno)) {
                io = this.addrIO;
            }
            
            if (io) {
                io.callback = function(o) {
                    if (DA.mailer.util.checkResult(o)) {
                        me._makePopupMenu(fld, sno, o);
                        me.popup.show();
                    }
                };
                
                io.errorHandler = function(e) {
                    DA.util.warn(DA.locale.GetText.t_("USERINFO_ERROR"));
                };
                
                if (controller.isUser(sno)) {
                    io.execute({
                        proc: 'email',
                        mid: controller.get(sno, 'id')
                    });
                } else {
                    io.execute({
                        proc: 'email',
                        id: controller.get(sno, 'id')
                    });
                }
            } else {
                me._makePopupMenu(fld, sno);
                me.popup.show();
            }
        }
    },
    
    _makePopupMenu: function(fld, sno, o) {
        var controller = this._controller(fld);
        var me = this;
        var i, j = 0;
        
        me.popup.menuData.order = [];
        me.popup.menuData.items = {};
        me.popup.menuData.className = 'da_messageEditorItemAddressPopupMenu';
        
        // 所属ユーザに展開
        if (controller.isGroup(sno)) {
            me.popup.menuData.order[j] = ['openGroup'];
            me.popup.menuData.items.openGroup = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_OPENGROUP'),
                args: [fld, sno],
                onclick: function(e, a) {
                    me.openGroup(a[0], a[1]);
                }
            };
        
            j ++;
        }
        
        // 役職、敬称
        if (controller.isAddr(sno) || controller.isUser(sno)) {
            me.popup.menuData.order[j] = ['titleOff'];
            me.popup.menuData.items.titleOff = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_TITLEOFF'),
                args: [fld, sno],
                onclick: function(e, a) {
                    me.titleOff(a[0], a[1]);
                }
            };
            if (DA.vars.user_information_restriction.title!=='off'||!controller.isUser(sno)) {//INSUITE ユーザの情報表示制限
                me.popup.menuData.order[j].push("titleOn");
                me.popup.menuData.items.titleOn = {
                    text: DA.locale.GetText.t_('EDITOR_POPUPMENU_TITLEON'),
                    args: [fld, sno],
                    onclick: function(e, a) {
                        me.titleOn(a[0], a[1], 0);
                    }
                };
            }
            if (DA.vars.user_information_restriction.title_name!=='off'||!controller.isUser(sno)) {//INSUITE ユーザの情報表示制限
                me.popup.menuData.order[j].push("titleNameOn");
                me.popup.menuData.items.titleNameOn = {
                    text: DA.locale.GetText.t_('EDITOR_POPUPMENU_TITLENAMEON'),
                    args: [fld, sno],
                    onclick: function(e, a) {
                        me.titleOn(a[0], a[1], 1);
                    }
                };
            }
            j ++;
        }

        // 敬称リスト
        if (controller.isAddr(sno) || controller.isUser(sno)) {
            if (me.titleList) {
                me.popup.menuData.order[j] = [];
                for (i = 0; i < me.titleList.length; i ++) {
                    me.popup.menuData.items['titleList' + i] = {
                        text: me.titleList[i].title,
                        args: [fld, sno, me.titleList[i].title, me.titleList[i].title_pos],
                        onclick: function(e, a) {
                            me.titleCustom(a[0], a[1], a[2], a[3]);
                        }
                    };
                    me.popup.menuData.order[j].push('titleList' + i);
                }
            }
            
            j ++;
        }
        
        // 名称、メールアドレス変更
        if (!controller.isGroup(sno)) {
            if (controller.isML(sno)) {
                me.popup.menuData.order[j] = ['changeName'];
            } else {
                me.popup.menuData.order[j] = ['changeName', 'changeEmail'];
            }
            me.popup.menuData.items.changeName = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_RENAME'),
                args: [fld, sno, controller.get(sno, 'name')],
                onclick: function(e, a) {
                    DA.customEvent.fire('changeNameDialogShowBefore',me,{e:e,a:a}); 
                    me.selectedFld = a[0];
                    me.selectedSno = a[1];
                    me._showRnDialog(a[2], e.clientX, e.clientY);
                    DA.customEvent.fire('changeNameDialogShowAfter',me,{e:e,a:a}); 
                }
            };
            me.popup.menuData.items.changeEmail = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_CHANGEEMAIL'),
                args: [fld, sno, controller.get(sno, 'email')],
                onclick: function(e, a) {
                    me.selectedFld = a[0];
                    me.selectedSno = a[1];
                    me._showCeDialog(a[2], e.clientX, e.clientY);
                }
            };
            
            j ++;
        }
        
        // 言語リスト
        if (controller.isAddr(sno)) {
            me.popup.menuData.order[j] = ['langList0', 'langList1'];
            me.popup.menuData.items.langList0 = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_CHANGELANG_ENGLISH'),
                args: [fld, sno, 'en'],
                onclick: function(e, a) {
                    me.changeLang(a[0], a[1], a[2]);
                }
            };
            me.popup.menuData.items.langList1 = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_CHANGELANG_VIEW'),
                args: [fld, sno, 'ja'],
                onclick: function(e, a) {
                    me.changeLang(a[0], a[1], a[2]);
                }
            };            
            
            j ++;
        } else if (controller.isUser(sno) || controller.isGroup(sno)) {
            if (me.langList) {
                me.popup.menuData.order[j] = [];
                for (i = 0; i < me.langList.length; i ++) {
                    me.popup.menuData.items['langList' + i] = {
                        text: DA.locale.GetText.t_('EDITOR_POPUPMENU_CHANGELANG', me.langList[i].name),
                        args: [fld, sno, me.langList[i].lang],
                        onclick: function(e, a) {
                            me.changeLang(a[0], a[1], a[2]);
                        }
                    };
                    me.popup.menuData.order[j].push('langList' + i);
                }
            }
            
            j ++;
        }
        
        // メールアドレスリスト
        var emailKeys = ['email', 'keitai_mail', 'pmail1', 'pmail2'];
        if (controller.isAddr(sno) || controller.isUser(sno)) {
            me.popup.menuData.order[j] = [];
            for (i = 0; i < emailKeys.length; i ++) {
                if (!DA.util.isEmpty(o[emailKeys[i]])&&(DA.vars.user_information_restriction[emailKeys[i]]!=='off'||!controller.isUser(sno))) {
                    me.popup.menuData.items['emailList' + i] = {
                        text: DA.locale.GetText.t_('EDITOR_POPUPMENU_CHANGEEMAILCUSTOM', o[emailKeys[i]]),
                        args: [fld, sno, o[emailKeys[i]]],
                        onclick: function(e, a) {
                            me.changeEmail(a[0], a[1], a[2]);
                        }
                    };
                    me.popup.menuData.order[j].push('emailList' + i);
                }
            }
            
            j ++;
        }
        
        // 移動
        switch(fld) {
            case 'to':
                me.popup.menuData.order[j] = ['moveCc', 'moveBcc', 'moveToTop', 'moveToBottom'];
                break;
            case 'cc':
                me.popup.menuData.order[j] = ['moveTo', 'moveBcc', 'moveCcTop', 'moveCcBottom'];
                break;
            case 'bcc':
                me.popup.menuData.order[j] = ['moveTo', 'moveCc', 'moveBccTop', 'moveBccBottom'];
                break;
            default:
                me.popup.menuData.order[j] = ['moveCc', 'moveBcc'];
                break;
        }
        me.popup.menuData.items.moveTo = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVETO'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'to');
            }
        };
        me.popup.menuData.items.moveCc = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVECC'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'cc');
            }
        };
        me.popup.menuData.items.moveBcc = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVEBCC'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'bcc');
            }
        };
        me.popup.menuData.items.moveToTop = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVETOP'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveTop(a[0], a[1], 'to', 1);
            }
        };
        me.popup.menuData.items.moveCcTop = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVETOP'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveTop(a[0], a[1], 'cc', 1);
            }
        };
        me.popup.menuData.items.moveBccTop = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVETOP'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveTop(a[0], a[1], 'bcc', 1);
            }
        };
        me.popup.menuData.items.moveToBottom = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVEBOTTOM'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'to', 1);
            }
        };
        me.popup.menuData.items.moveCcBottom = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVEBOTTOM'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'cc', 1);
            }
        };
        me.popup.menuData.items.moveBccBottom = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVEBOTTOM'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'bcc', 1);
            }
        };
        
        j ++;      
    },
    
    _controller: function(fld) {
        var controller;
        
        switch(fld) {
            case 'to':
                controller = this.toController;
                break;
            case 'cc':
                controller = this.ccController;
                break;
            case 'bcc':
                controller = this.bccController;
                break;
            default:
                controller = this.toController;
                break;
        }
        
        return controller;
    },
    
    openGroup:function(fld, sno) {
        var controller = this._controller(fld);
        var me = this;
        var io;
        
        if (!this.existsLock()) {
            io = this.groupIO;
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    controller.addList(o.user_list, true);
                    controller.remove(sno);
                    
                    me._refreshGroupName();
                    me.doResize();
                }
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("GROUPINFO_ERROR"));
            };
            
            io.execute({
                proc: 'extract',
                gid: controller.get(sno, 'id'),
                lang: controller.get(sno, 'lang')
            });
        }
    },
    
    titleOff: function(fld, sno) {
        var controller = this._controller(fld);
        
        if (!this.existsLock()) {
            controller.title(sno, '', 0, true);
        }
    },
    
    titleOn: function(fld, sno, type) {
        var controller = this._controller(fld);
        var io;
        
        if (!this.existsLock()) {
            if (controller.isUser(sno)) {
                io = this.userIO;
            } else {
                io = this.addrIO;
            }
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    controller.title(sno, o.title, o.title_pos, true);
                }
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("USERINFO_ERROR"));
            };
            
            if (controller.isUser(sno)) {
                io.execute({
                    proc: 'title',
                    mid: controller.get(sno, 'id'),
                    lang: controller.get(sno, 'lang'),
                    type: type
                });
            } else {
                io.execute({
                    proc: 'title',
                    id: controller.get(sno, 'id'),
                    lang: controller.get(sno, 'lang'),
                    type: type
                });
            }
        }
    },
    
    titleCustom: function(fld, sno, title, title_pos) {
        var controller = this._controller(fld);
        
        if (!this.existsLock()) {
            controller.title(sno, title, title_pos, true);
        }
    },
    
    rename: function(fld, sno, name) {
        var controller = this._controller(fld);
        
        if (!this.existsLock()) {
            controller.name(sno, name, true);
        }
    },
    
    changeEmail: function(fld, sno, email) {
        var controller = this._controller(fld);
        
        if (!this.existsLock()) {
            controller.email(sno, email);
        }
    },
    
    changeLang: function(fld, sno, lang) {
        var controller = this._controller(fld);
        var io;
        
        if (!this.existsLock()) {
            if (controller.isGroup(sno)) {
                io = this.groupIO;
            } else if (controller.isUser(sno)) {
                io = this.userIO;
            } else {
                io = this.addrIO;
            }
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    controller.lang(sno, lang);
                    controller.name(sno, o.name, true);
                }
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("USERINFO_ERROR"));
            };
            
            if (controller.isGroup(sno)) {
                io.execute({
                    proc: 'name',
                    gid: controller.get(sno, 'id'),
                    lang: lang
                });
            } else if (controller.isUser(sno)) {
                io.execute({
                    proc: 'name',
                    mid: controller.get(sno, 'id'),
                    lang: lang
                });
            } else {
                io.execute({
                    proc: 'name',
                    id: controller.get(sno, 'id'),
                    lang: lang
                });
            }
        }
    },
    
    moveField: function(fld, sno, targetFld, isForMoveInside) {
        var src = this._controller(fld);
        var dst = this._controller(targetFld);
        
        if (!this.existsLock()) {
            if (fld !== dst) {
                this._hideRnDialog();
                this._hideCeDialog();
                if (isForMoveInside !== 1) {
                    this._showAddressCcBcc();
                }
                
                dst.add(src.get(sno));
                src.remove(sno);                

                this.doResize();
            }
        }
    },

    insertAfterNode: function(fld, sno, targetFld, insertAfterNodeId) {
        var src = this._controller(fld);
        var dst = this._controller(targetFld);
        if (!this.existsLock()) {
            this._hideRnDialog();
            this._hideCeDialog();
            if (fld !== targetFld) {
                this._showAddressCcBcc();
            }
            if ( fld === targetFld && sno !== insertAfterNodeId.split("_")[2] ) {
                dst.insertAfterNode(src.get(sno), sno, insertAfterNodeId, "true");
            } else if( fld !== targetFld ){
                dst.insertAfterNode(src.get(sno), sno, insertAfterNodeId, "false");
                src.remove(sno);
            }
            this.doResize();
        }
    },

    resizeAll: function() {
        var dst = null;
        dst = this._controller("to");
        dst.resize();
        dst = this._controller("cc");
        dst.resize();
        dst = this._controller("bcc");
        dst.resize();
    },

    moveTop: function(fld, sno, targetFld, isForMoveInside) {
        var src = this._controller(fld);
        var dst = this._controller(targetFld);
        
        if (!this.existsLock()) {
            if (fld !== dst) {
                this._hideRnDialog();
                this._hideCeDialog();
                if (isForMoveInside !== 1) {
                    this._showAddressCcBcc();
                }
                
                dst.insertToTop(src.get(sno),sno);            

                this.doResize();
            }
        }
    },

    insertBeforeNode: function(fld, sno, targetFld, isForMoveInside, srcNode) {
        var src = this._controller(fld);
        var dst = this._controller(targetFld);
        
        if (!this.existsLock()) {
            if (fld !== dst) {
                this._hideRnDialog();
                this._hideCeDialog();
                if (isForMoveInside !== 1) {
                    this._showAddressCcBcc();
                }
                
                dst.insertToTop(srcNode,0);            
                src.remove(sno);
                this.doResize();
            }
        }
    },
    
    showRichTextSelectForm: function() {
        var me = this;
        
        ["formatblock", "fontname", "fontsize"].each(function(target) {
            try {
                YAHOO.util.Dom.get(target + '_' + me.htmlContentsNode.id).style.visibility = '';
            } catch(e) {
            }
        });
    },
    
    hideRichTextSelectForm: function() {
        var me = this;
        
        ["formatblock", "fontname", "fontsize"].each(function(target) {
            try {
                YAHOO.util.Dom.get(target + '_' + me.htmlContentsNode.id).style.visibility = 'hidden';
            } catch(e) {
            }
        });
    },
    
    showTextArea: function() {
        var me = this;
        
        try {
            me.textNode.style.visibility = '';
            me.htmlNode.style.visibility = '';
        } catch(e) {
        }
    },
    
    hideTextArea: function() {
        var me = this;
        
        try {
            me.textNode.style.visibility = 'hidden';
            me.htmlNode.style.visibility = 'hidden';
        } catch(e) {
        }
    },
    
    lock: function() {
        if (DA.util.lock('messageEditor')) {
            return true;
        } else {
            return false;
        }
    },
    
    unlock: function() {
        return DA.util.unlock('messageEditor');
    },
    
    existsLock: function() {
        return DA.util.existsLock('messageEditor');
    },
    
    isEmpty: function(str) {
        if (DA.util.isEmpty(str)) {
            return true;
        } else {
            if (str.match(/^(\s|\xe3\x80\x80)+$/)) {
                return true;
            } else {
                return false;
            }
        }
    },
    
    _hide_spellcheck_menu: function () {
        if(YAHOO.util.Dom.get('panel_menuMenuItem_transmit_b')){
            YAHOO.util.Dom.get('panel_menuMenuItem_transmit_b').style.display = 'none';
        }
        if(YAHOO.util.Dom.get('panel_menuMenuItem_preview_b')){
            YAHOO.util.Dom.get('panel_menuMenuItem_preview_b').style.display = 'none';
        }
        if(YAHOO.util.Dom.get('panel_menuMenuItem_spellcheck')){
            YAHOO.util.Dom.get('panel_menuMenuItem_spellcheck').style.display = 'none';
        }
    },
    
    _show_spellcheck_menu: function () {
        if(YAHOO.util.Dom.get('panel_menuMenuItem_transmit_b')){
            YAHOO.util.Dom.get('panel_menuMenuItem_transmit_b').style.display = '';
        }
        if(YAHOO.util.Dom.get('panel_menuMenuItem_preview_b')){
            YAHOO.util.Dom.get('panel_menuMenuItem_preview_b').style.display = '';
        }
        if(YAHOO.util.Dom.get('panel_menuMenuItem_spellcheck') && DA.vars.system.spellcheck_button_visible && DA.vars.config.spellcheck){
            YAHOO.util.Dom.get('panel_menuMenuItem_spellcheck').style.display = '';
        }
    },
   
    _disableESC: function() {
        if (YAHOO.util.Event.getCharCode(event) === Event.KEY_ESC) {
            return false;
        }
        return true;
    },
    
    _enableButtons: function() {
        var addr_html = DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_address.gif');

        $('da_messageEditorItemToAddress').innerHTML = $('da_messageEditorItemCcAddress').innerHTML =
        $('da_messageEditorItemBccAddress').innerHTML = addr_html;
        $('da_messageEditorItemAttachmentButtonsLibrary').disabled = false;
    }
};

/**
 * Drag and Drop method.
 */    
DA.mailer.AddressDragDrop = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
        if (!this.DDFrameCreated) {
            this.DDFrameCreated = true;
            this.initFrame();
        }
    }
};

YAHOO.extend(DA.mailer.AddressDragDrop, YAHOO.util.DDProxy, {
    createFrame: function() {
        var self = this;
        var body = document.body;
        
        var div = this.getDragEl();
        var s;
        
        if (!div) {
            div = DA.dom.createDiv(this.dragElId);
            div.style.visibility = "hidden";
            div.style.cursor = "pointer";
            body.insertBefore(div, body.firstChild);
            
            YAHOO.util.Dom.addClass(div, 'da_messageEditorAddressDummy');
        }
    },
    
    onDragOut: function(e, id) {
        var underline = null;
        if ( id.indexOf("Text") >= 0) {
            underline = document.getElementById("insertAddressAfterMark" + id);
            if (underline) {
                underline.parentNode.removeChild(underline);
            }
        } else if ( id.indexOf("da_ugInformationList") >= 0) {
            underline = document.getElementById("insertAddressAfterMark" + id);
            if (underline) {
                underline.parentNode.removeChild(underline);
            }
        }
    },
    
    startDrag: function(x, y) {
        this.startX = x;
        this.startY = y;
        this.deltaX = 0;
        this.deltaY = 0;
    },
        
    endDrag: function(e) { }
    
});



