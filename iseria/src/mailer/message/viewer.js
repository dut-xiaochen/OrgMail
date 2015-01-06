/* $Id: viewer.js 2506 2014-11-04 08:20:53Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/message/viewer.js $ */
/*for JSLINT undef checks*/
/*extern $ DA Prototype YAHOO BrowserDetect FCKEditorIframeController */
/*jslint evil: true */
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

(function () { // Private scope

// DA.mailer.Events can be used in several places; this just finishes up
// with the NPE checks on load time.
var ME = DA.mailer.Events; // Mailer Events
if (!ME) {
     // DA_DEBUG_START
     DA.log('No Custom Events!', 'error', 'MsgView');
     debugger;
     // DA_DEBUG_END
     throw 'MsgView: No Custom Events!';
}

/**
 * Message viewer widget. 
 * 
 * Usage: 
 *   var mv = new DA.mailer.MessageViewer();
 * 
 * @class MessageViewer
 * @uses 
 * @constructor
 * @param headerNode {HTMLElement} DOM node in which to render the mail header.
 * @param bodyNode   {HTMLElement} DOM node in which to render the message body.
 * @param bodyNode   {HTMLElement} DOM node that contains the header/body.
 * @param cbhash     {Object}      A hash of callback functions.
 */
DA.mailer.MessageViewer = function(headerNode, bodyNode, containerNode, cbhash, threePane, requestUrl) {
    this.headerNode    = headerNode;
    this.headerId      = headerNode.id;
    this.bodyNode      = bodyNode;
    this.bodyId        = bodyNode.id;
    this.containerNode = containerNode;
    this.threePane     = threePane;
    this.requestUrl    = requestUrl;
    
    // FIXME: This is best done using Object.extend
    if (cbhash) {
        if (DA.util.isFunction(cbhash.onLoading)) {
            this.onLoading = cbhash.onLoading;
        }
        if (DA.util.isFunction(cbhash.onLoadDone)) {
            this.onLoadDone = cbhash.onLoadDone;
        }
        if (DA.util.isFunction(cbhash.onLoadFailed)) {
            this.onLoadFailed = cbhash.onLoadFailed;
        }
        if (DA.util.isFunction(cbhash.doResize)) {
            this.doResize = cbhash.doResize;
        }
    }
    
    var query = DA.util.parseQuery(this.requestUrl);
    if (query.external && DA.util.cmpNumber(query.external, 1)) {
        this.external = true;
    } else {
        this.external = false;
    }
    
    // Callback point (pre-init)
    if (DA.vars.custom.viewer.setMessageViewer) {
        eval(DA.vars.custom.viewer.setMessageViewer);
    }
    
    this.init();

    // Callback point (post-init)
    if (DA.vars.custom.viewer.setMessageViewer2) {
        eval(DA.vars.custom.viewer.setMessageViewer2);
    }
    
};

/**
 * Members
 */
DA.mailer.MessageViewer.prototype = {
    
    headerNode: null,
    
    headerId : null,
    
    bodyNode: null,
    
    bodyId: null,
    
    headerContentsNode: null,
    
    bodyContentsNode: null,
    
    threePane: null,
    
    requestUrl: null,
    
    external: false,
    
    customHeader: false,
    
    loadingFid: null,
    
    loadingUid: null,
    
    selectedFid: null,
    
    selectedUid: null,
    
    selectedSrid: null,
    
    selectFolderType: null,
    
    selectMessageEditable: null,
    
    selectMessageNotification: null,
    
    jsonIO: null,
    
    moveIO: null,
    
    flagIO: null,
    
    attachMenu: null,
    
    attachData: {},
    
    attachNode: null,
    
    attachArea: null,
    
    customNode: null,
    
    subject: null,

    dialog: null,
    
    saveAttachesToLibDialog: null,
    /**
     * Recalculate and set a new height for the bodyNode, so that 
     * the sum of heights of the header and body nodes never exceed the
     * container: this has an effect of limiting the appearance of
     * scrollbars only to the body node.
     * @method recalculateHeights
     */
    recalculateHeights: function () {
        var hn = this.headerNode;
        var bn = this.bodyNode;
        var cn = this.containerNode;
        var marginH = 5; // FIXME: hardcoding
        var hBuffer = 2;
        // To defeat IE lazy readouts
        var useless = (hn.offsetHeight + 1) + (bn.offsetHeight + 1) + (cn.offsetHeight + 1);
        var maxBH = cn.offsetHeight - (hn.offsetHeight + (marginH * 2) + hBuffer);  
        if (maxBH > 10) { // FIXME: hardcoding
            bn.style.height = maxBH + 'px';
        } else {
            // let everything scroll
            bn.style.height = 'auto';
        }
    },

    /**
     * Callback function which is invoked once when a message starts loading.
     * @property onLoading
     * @type {function}
     * @param // TODO 
     */
    onLoading: Prototype.emptyFunction,
    
    /**
     * Callback function which is invoked once after a message has loaded.
     * @property onLoadDone
     * @type {function}
     * @param // TODO 
     */
    onLoadDone: Prototype.emptyFunction,
    
    /**
     * Resize Functin.
     */
    doResize: Prototype.emptyFunction,
    
    init: function() {
        var me = this;
        // FIXME: Are tables really needed here?
        var header = ['<div class="da_messageViewerHeader">',
                      '<table class="da_messageViewerHeaderTable">',
                      '<tr>',
                      '  <td colspan="2" class="da_messageViewerHeaderTableTopLeft">', DA.imageLoader.nullTag(1, 3), '</td>',
                      '  <td class="da_messageViewerHeaderTableTopRight">', DA.imageLoader.nullTag(2, 3), '</td>',
                      '</tr>',
                      '<tr>',
                      '  <td class="da_messageViewerHeaderTableMiddleLeft">', DA.imageLoader.nullTag(2, 1), '</td>',
                      '  <td class="da_messageViewerHeaderTableMiddleCenter">', 
                      '    <table class="da_messageViewerHeaderContents">',
                      '    <tr>',
                      '      <td id="', this.headerId, 'Contents"></td>',
                      '    </tr>',
                      '    </table>',
                      '  </td>',
                      '  <td class="da_messageViewerHeaderTableMiddleRight">', DA.imageLoader.nullTag(2, 1), '</td>',
                      '</tr>',
                      '<tr>',
                      '  <td colspan="2" class="da_messageViewerHeaderTableBottomLeft">', DA.imageLoader.nullTag(1, 2), '</td>',
                      '  <td class="da_messageViewerHeaderTableBottomRight">', DA.imageLoader.nullTag(2, 2), '</td>',
                      '</tr>',
                      '</table>',
                      '</div>'].join('');

        var body   = ['<div class="da_messageViewerBodyContents" id="', this.bodyId, 'Contents"></div>'].join(''); 
        
        this.headerNode.innerHTML = header;
        this.bodyNode.innerHTML   = body;
        
        this.headerContentsNode = YAHOO.util.Dom.get(this.headerId + 'Contents');
        this.bodyContentsNode   = YAHOO.util.Dom.get(this.bodyId + 'Contents');
        if (DA.vars.config.font === 'on') {
            YAHOO.util.Dom.addClass(this.bodyContentsNode, 'da_nonProportionalFont');
        }
        if (DA.vars.custom.viewer.headerOpen || DA.vars.custom.viewer.headerClose) {
            this.customHeader = true;
        }
        
        this.nvPairs = new DA.widget.NVPairSet(
            $(this.headerId + 'Contents'), {
                Subject: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'),
                    value: ''
                },
                From: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_FROM'),
                    value: ''
                },
                To: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_TO'),
                    value: '',
                    expanded: (DA.vars.config.detail_header_to_open === 1) ? true : false
                },
                Cc: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_CC'),
                    value: '',
                    expanded: (DA.vars.config.detail_header_cc_open === 1) ? true : false
                },
                Bcc: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_BCC'),
                    value: '',
                    expanded: (DA.vars.config.detail_header_bcc_open === 1) ? true : false
                },
                Date: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_DATE'),
                    value: ''
                },
                Attachment: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_ATTACHMENT'),
                    value: '',
                    expanded: (DA.vars.config.detail_header_attachment_open === 1) ? true : false,
                    id: this.headerId + 'Attachment',
                    icon: DA.vars.imgRdir + '/ico_mail_attach.gif'
                },
                Custom: {
                    id: this.headerId + 'Custom',
                    row: DA.vars.custom.viewer.headerOpen,
                    html: DA.vars.custom.viewer.headerClose,
                    border: false,
                    hidden: (this.customHeader) ? false : true
                }
            }, 
            ['Subject', 'From', 'Date', 'Custom', 'Attachment', 'To', 'Cc','Bcc'], 
            (DA.vars.config.detail_header_open === 1) ? true : false
        );
        
        // Whenever the header nvpairs changes size (expands/collapses), recalculate the
        // viewer's header-div and body-div heights, so that scrollbars appear only for
        // the body and the header stay where it is.
        this.nvPairs.onExpand = this.nvPairs.onCollapse = function () {
            me.doResize();
            if (me.threePane) {
                me.recalculateHeights();
            }
        };

        this.attachMenu = new DA.widget.PulldownMenuController(this.headerId + 'AttachmentIconPopup', this.headerId + 'AttachmentIcon', this.attachData, {
            onTrigger: function(e) {
                var srcElem = YAHOO.util.Event.getTarget(e);
                return srcElem && DA.util.match(srcElem.id, me.headerId + 'AttachmentIcon');
            }
        });

        // FIXME: OO violation: attachNode is a reference to a member object of NVPairs
        this.attachNode = YAHOO.util.Dom.get(this.headerId + 'AttachmentIcon');
        if (this.customHeader) {
            // FIXME: OO violation: customNode is a reference to a member object of NVPairs
            this.customNode = YAHOO.util.Dom.get(this.headerId + 'CustomHTML');
        }
        me.attachArea = YAHOO.util.Dom.get(this.headerId + 'AttachmentSeparator');
        
        this.jsonIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_detail.cgi' );
        this.moveIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
        this.flagIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_flag.cgi' );
        if( this.selectedFid ){
            this.saveAttachesToLibDialog = new DA.widget.SaveAttachesToLibDialog("da_saveAttachToLibDialog", DA.locale.GetText.t_("SAVE_TO_LIB_DIALOG_TITLE"), me.attachData, me.selectedFid, me.selectedUid, {
            onEnter: function() {
              var attaches = document.getElementsByName("da_saveAttachToLibDialog_attaches");
              var checkedAttachesAid = "";
              for( var i = 0; i < attaches.length; i++ ){
                if ( checkedAttachesAid !== "" ) {
                  if ( attaches[i].checked ){
                    checkedAttachesAid += ',';
                  }
                }
                if ( attaches[i].checked ){
                  checkedAttachesAid += attaches[i].value;
                }
              }
              if ( checkedAttachesAid === "" ) {
                alert(DA.locale.GetText.t_("MESSAGE_SELECT_ATTACHES_ERROR"));
                return false;
              }
              var url, flg;
              url = "lib_foldersel.cgi%3fcall=ma_bundle%20uid=" + this.selectedUid + "%20fid=" + this.selectedFid + "%20aid=" + checkedAttachesAid;
              var Img  = 'pop_title_attachsave.gif';
              DA.windowController.isePopup(url, Img, 400, 550, "");
              return false;
            }
          });
        }
        this.clear();

        this._setupSubscribers();
        this._setupCleanupHandlers();

    },
    
    clear: function() {
        FCKEditorIframeController.removeIframe(this.bodyId + 'Contents' + "FckEditorViewer", this.bodyContentsNode);
        this.bodyContentsNode.innerHTML = (this.threePane) ? DA.locale.GetText.t_('DEFAULT_MESSAGE_BODY') : '';
        this.nvPairs.changeName('Subject', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'));
        this.nvPairs.changeValue('Subject', '');
        this.nvPairs.changeValue('From', '');
        this.nvPairs.changeValue('To', '');
        this.nvPairs.changeValue('Cc', '');
        this.nvPairs.changeValue('Bcc', '');
        this.nvPairs.changeValue('Date', '');
        this.nvPairs.changeValue('Attachment', '');
        this.nvPairs.changeExpand('From', '');
        this.nvPairs.changeExpand('To', '');
        this.nvPairs.changeExpand('Cc', '');
        this.nvPairs.changeExpand('Bcc', '');
        this.nvPairs.changeExpand('Attachment', '');
        this.nvPairs.disableExpand();
        
        this.attachNode.style.display = 'none';
        this.attachNode.className = 'da_messageViewerHeaderAttachmentDisabled';
        if (this.customHeader && this.customNode) {
            this.customNode.style.display = 'none';
        }
        
        this.loadingFid = null;
        this.loadingUid = null;
        this.selectedUid = null;
    },

	add_reply_icon: function(mmdata)
	{
		var me = this;
		var reply;
		if((DA.vars.system.no_replied_flag===0)&&(mmdata.fid === this.selectedFid)&&(mmdata.uid === this.selectedUid))
		{
			reply = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_sc_reply.gif', 'Replied', { width: 16, height: 16 });			
			me.nvPairs.changeValue('Subject', reply+this.subject);
		}
	},
	
	add_forward_icon: function(mmdata)
	{
	    var me = this;
		var forward;
		if((DA.vars.system.no_replied_flag===0)&&(mmdata.fid === this.selectedFid)&&(mmdata.uid === this.selectedUid))
		{
			
			forward = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_sc_forward.gif', 'Forwarded', { width: 16, height: 16 });
            me.nvPairs.changeValue('Subject', forward+this.subject);
		}
	},

    /**
     * @property _handleMessagesMoving
     * @type {Function} to be used as a subscriber to DA.mailer.Events.onMessagesMoving
     * @private
     */
    _handleMessagesMoving: function (type, args) {
        var jobId = args[0], params = args[1];
        var messages;
        if (!params || !(messages = params.messages)) {
            // DA_DEBUG_START
            DA.log("Missing/Invalid params (event: onMessagesMoving)", 'error', 'MsgView');
            // DA_DEBUG_END
            return;
        }
        if (messages.ranges.length) {
            // DA_DEBUG_START
            DA.log("SHIFT implementation pending", 'warn', 'MsgView');
            // DA_DEBUG_END
        }
        if(messages.singles.length ===1)
        {	
        	if(messages.single.mode === 1)
        	{
        		this.add_reply_icon({fid:messages.single.fid,uid:messages.single.originuid});
        	}
        	else if(messages.single.mode ===2)
        	{
        		this.add_forward_icon({fid:messages.single.fid,uid:messages.single.originuid});
        	}
        	else {}
        }
        if (messages.singles.find(this._isSameMessage.bind(this))) {
            if (params.target.trash) {
                this.onMessageDeleted();
            } else {
                this.onMessageMoved(params.target.fid);
            }
        }
    },

    /**
     * Callback invoked when the message that we were viewing has been deleted.
     * By default, this closes the viewer
     * @property onMessageDeleted
     * @protected
     * @type {Function} Callback
     */
    onMessageDeleted: function () {
        this.close();
    },

    /**
     * Callback invoked when the message that we were moving has been moved
     * to another folder.
     * @property onMessageMoved
     * @type {Function} Callback
     * @param fid {Number} ID of the destination IMAP folder
     */
    onMessageMoved:   Prototype.emptyFunction,

    /**
     * init-time method that sets up subscribers to DA.mailer.Events.*
     * @method _setupSubscribers
     * @private
     */
    _setupSubscribers: function () {
        ME.onMessagesMoving.subscribe(this._handleMessagesMoving, this, true);
    },

    /**
     * init-time method.
     * CustomEvent subscribers <b>MUST</b> be removed if the window has been
     * closed.
     * @method _setupCleanupHandlers
     * @private
     */
    _setupCleanupHandlers: function () {
        YAHOO.util.Event.on(window, 'unload', this._unsubscribe, this, true);
    },
   
    /**
     * @method _unsubscribe
     * @private
     */
    _unsubscribe: function () {
        ME.onMessagesMoving.unsubscribe(this._handleMessagesMoving, this);
    },

    /**
     * @method _isSameMessage
     * @private
     * @returns {Boolean}
     */
    _isSameMessage: function (oMmdata) {
        if (!oMmdata) { return false; }
        var fid = parseInt(this.selectedFid, 10);
        var uid = parseInt(this.selectedUid, 10);
        return parseInt(oMmdata.fid, 10) === fid &&
               parseInt(oMmdata.uid, 10) === uid ;
    
    },
   
    /**
     * Loads and views the given message (by it's meta-data) in the viewer.
     * @method view
     * @param oMMData {Object} mail meta-data (uid, fid etc)
     * @param proc    {String} can be 'next', 'prev'
     * @param nomdn   ? // FIXME: Comments needed.
     */
    view: function(oMMData, proc, nomdn) {
        var fid, uid, srid, backup_maid, fckHeadStyle, fckBody;
        var fckHeaderMatcher = /^<\!-- Created by DA_Richtext .*? end default style -->/;
        var fckStyleMatcher = /<style>.*?<\/style>/;
        if (!oMMData || !(uid = oMMData.uid)) {
            // DA_DEBUG_START
            DA.log('bad args to view:', 'error', 'MsgView');
            debugger;
            // DA_DEBUG_END
        }
        fid  = oMMData.fid;
        srid = oMMData.srid;
        backup_maid = oMMData.backup_maid;

        var me = this;
        
        if (!this.loadingFid || !this.loadingUid ||
            this.loadingFid !== fid || this.loadingUid !== uid) {
            
            this.loadingFid = fid;
            this.loadingUid = uid;
            
            if (me.lock()) {
                me.jsonIO.callback = function(o) {
                    var i, priority,reply,forward;
                
                    if (DA.mailer.util.checkResult(o)) {
                        me.selectedFid      = o.fid;
                        me.selectedUid      = o.uid;
                        me.selectedSrid     = o.srid;
                        me.selectFolderType = o.type;
                        me.selectMessageEditable     = (o.edit_m === 1) ? true : false;
                        if(me.selectFolderType === 21){
                           me.selectMessageEditable = "true";
                        }
                        me.selectMessageExportable   = (o['export'] === 1) ? true : false;
                        me.selectMessageNotification = (DA.util.isEmpty(o.notification)) ? 0 : o.notification;
                        if(DA.mailer.util.isDraft(me.selectFolderType) || DA.mailer.util.isSent(me.selectFolderType) || DA.mailer.util.isLocalFolder(me.selectFolderType) || DA.mailer.util.isBackupFolder(me.selectFolderType)){
                        	me.nvPairs.reorder(['Subject','To','Date','Attachment','Cc', 'From']);
                        } else {
                        	me.nvPairs.reorder(['Subject','From','Date', 'Attachment','To', 'Cc']);
                        }
                        
                        me.nvPairs.enableExpand();
                        
                        if (o.priority < 3) {
                            priority = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_mail_high.gif', '', { width: 14, height: 14 });
                        } else if (o.priority > 3) {
                            priority = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_mail_low.gif', '', { width: 14, height: 14 });
                        } else {
                            priority = DA.imageLoader.nullTag(14, 14);
                        }
                        
                        me.subject = DA.util.encode(o.subject);
                        if(me.subject === null){ me.subject='';} 
                        me.nvPairs.changeName('Subject', priority + DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'));
                        if (DA.vars.system.no_forwarded_flag===0 && o.replied === 1) {
                            reply = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_sc_reply.gif', 'Replied', { width: 16, height: 16 });                   
                            me.nvPairs.changeValue('Subject', reply+me.subject);
                        } else if(DA.vars.system.no_forwarded_flag===0 && o.forwarded === 1) {
                            forward = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_sc_forward.gif', 'Forwarded', { width: 16, height: 16 });
                            me.nvPairs.changeValue('Subject', forward+me.subject);
                        } else {
                            me.nvPairs.changeValue('Subject', me.subject);
                        }
                        
                        if (o.from_list && o.from_list.length > 3) {
                            me.nvPairs.changeValue('From', DA.ug.list2String(o.from_list, 3, 3));
                            me.nvPairs.changeExpand('From', DA.ug.list2String(o.from_list, 3));
                            if (o.from_list.length > DA.vars.config.mail_to_resize_num) { 
                            	me.nvPairs.scrollSeparator('From', 1);
                            } else { 
                            	me.nvPairs.unscrollSeparator('From', 1);
                            }
                        } else {
                            me.nvPairs.changeValue('From', DA.ug.list2String(o.from_list));
                            me.nvPairs.changeExpand('From', '');
                            me.nvPairs.unscrollSeparator('From', 1);
                        }
                        
                        if (o.to_list && o.to_list.length > 3) {
                            me.nvPairs.changeValue('To', DA.ug.list2String(o.to_list, 3, 3));
                            me.nvPairs.changeExpand('To', DA.ug.list2String(o.to_list, 3));
                            if (o.to_list.length > DA.vars.config.mail_to_resize_num) { 
                            	me.nvPairs.scrollSeparator('To', 1);
                              me.nvPairs.showCursor("Cc");
                            } else { 
                              me.nvPairs.hideCursor("Cc");
                            	me.nvPairs.unscrollSeparator('To', 1);
                            }
                        } else {
                            me.nvPairs.hideCursor("Cc");
                            me.nvPairs.changeValue('To', DA.ug.list2String(o.to_list));
                            me.nvPairs.changeExpand('To', '');
                            me.nvPairs.unscrollSeparator('To', 1);
                        }
                        
                        if (o.cc_list && o.cc_list.length > 3) {
                            me.nvPairs.changeValue('Cc', DA.ug.list2String(o.cc_list, 3, 3));
                            me.nvPairs.changeExpand('Cc', DA.ug.list2String(o.cc_list, 3));
                            if (o.cc_list.length > DA.vars.config.mail_to_resize_num) { 
                            	me.nvPairs.scrollSeparator('Cc', 1);
                              me.nvPairs.showCursor("Bcc");
                            } else { 
                              me.nvPairs.hideCursor("Bcc");
                            	me.nvPairs.unscrollSeparator('Cc', 1);
                            }
                        } else {
                            me.nvPairs.hideCursor("Bcc");
                            me.nvPairs.changeValue('Cc', DA.ug.list2String(o.cc_list));
                            me.nvPairs.changeExpand('Cc', '');
                            me.nvPairs.unscrollSeparator('Cc', 1);
                        }
                        if (DA.mailer.util.isDraft(me.selectFolderType) || DA.mailer.util.isSent(me.selectFolderType)) {
                            me.nvPairs.showColumn('Bcc');
                            if (o.bcc_list && o.bcc_list.length > 3) {
                                me.nvPairs.changeValue('Bcc', DA.ug.list2String(o.bcc_list, 3, 3));
                                me.nvPairs.changeExpand('Bcc', DA.ug.list2String(o.bcc_list, 3));
                                if (o.bcc_list.length > DA.vars.config.mail_to_resize_num) { 
	                            	me.nvPairs.scrollSeparator('Bcc', 1);
                                me.nvPairs.showCursor("Date");
	                            } else { 
                                me.nvPairs.hideCursor("Date");
	                            	me.nvPairs.unscrollSeparator('Bcc', 1);
	                            }
                            } else {
                                me.nvPairs.hideCursor("Date");
                                me.nvPairs.changeValue('Bcc', DA.ug.list2String(o.bcc_list));
                                me.nvPairs.changeExpand('Bcc', '');
                                me.nvPairs.unscrollSeparator('Bcc', 1);
                            }
                        } else {
                            me.nvPairs.hideColumn('Bcc');
                        }

                        me.nvPairs.changeValue('Date', DA.util.encode(o.date));
                        if (o.attach_list && o.attach_list.length > 3) {
                            me.nvPairs.changeValue('Attachment', DA.file.list2String(o.attach_list, 3, 3));
                            me.nvPairs.changeExpand('Attachment', DA.file.list2String(o.attach_list, 3));
                        } else {
                            me.nvPairs.changeValue('Attachment', DA.file.list2String(o.attach_list));
                            me.nvPairs.changeExpand('Attachment', '');
                        }
                        if (o.attach_list && o.attach_list.length > 0) {
                            me.attachNode.style.display = '';
                            me.attachNode.className = 'da_messageViewerHeaderAttachmentEnabled';
                            
                            me.attachData.order = [];
                            me.attachData.order[0] = [];
                            me.attachData.items = {};
                            me.attachData.className = 'da_messageViewerHeaderAttachmentPulldownMenu';
                            me.attachData.encode = false;
                            for (i = 0; i < o.attach_list.length; i ++) {
                                me.attachData.order[0].push(i);
                                me.attachData.items[i] = {
                                    text: DA.file.object2String(o.attach_list[i], true),
                                    onclick: function(e, a) {
                                        eval(a[0]);
                                    },
                                    args: [o.attach_list[i].link],
                                    title: DA.util.encode(o.attach_list[i].title)
                                };
                            }
                            
                            me.attachArea.style.height = (o.attach_list.length>12) ? "80px":"";
                        } else {
                            // FIXME: OO Vioalation: Directly manipulating a member object of NVPairs
                            me.attachNode.style.display = 'none';
                            me.attachNode.className = 'da_messageViewerHeaderAttachmentDisabled';
                            me.attachArea.style.height = "";
                        }
                        me.saveAttachesToLibDialog = new DA.widget.SaveAttachesToLibDialog("da_saveAttachToLibDialog", DA.locale.GetText.t_("SAVE_TO_LIB_DIALOG_TITLE"), me.attachData, me.selectedFid, me.selectedUid, {
                          onEnter: function() {
                            var attaches = document.getElementsByName("da_saveAttachToLibDialog_attaches");
                            var checkedAttachesAid = "";
                            for( var i = 0; i < attaches.length; i++ ){
                              if ( checkedAttachesAid !== "" ) {
                                if ( attaches[i].checked ){
                                  checkedAttachesAid += ',';
                                }
                              }
                              if ( attaches[i].checked ){
                                checkedAttachesAid += attaches[i].value;
                              }
                            }
                            if ( checkedAttachesAid === "" ) {
                              alert(DA.locale.GetText.t_("MESSAGE_SELECT_ATTACHES_ERROR"));
                              return false;
                            }
                            var url, flg;
                            url = "lib_foldersel.cgi%3fcall=ma_bundle%20uid=" + me.selectedUid + "%20fid=" + me.selectedFid + "%20aid=" + checkedAttachesAid;
                            var Img  = 'pop_title_attachsave.gif';
                            DA.windowController.isePopup(url, Img, 400, 550, "");
                            return true;
                          }
                        });
                        
                        if (me.customHeader && me.customNode) {
                            // FIXME: OO Vioalation: Directly manipulating a member object of NVPairs
                            me.customNode.style.display = '';
                        }
                        
                        // Have to call resize explicitly because we directly manipulate NVPairs's properties
                        // (we mess with the style.display property of attachNode, customNode)
                        me.nvPairs.resize();
                        
                        FCKEditorIframeController.removeIframe(me.bodyId + 'Contents' + "FckEditorViewer", me.bodyContentsNode);
                        
                        if (DA.util.isEmpty(o.body.html)) {
                            if (DA.util.isEmpty(o.body.text)) {
                                me.bodyContentsNode.innerHTML = '';
                            }else if(DA.vars.config.b_wrap === 'on'){
								me.bodyContentsNode.innerHTML = o.body.text;
                            } else {
                                me.bodyContentsNode.innerHTML = '<pre style="height:100%;">' + o.body.text + '</pre>';
                            }
                        } else {
                            if (FCKEditorIframeController.isFCKeditorData(o.body.html)) {
                                fckHeadStyle = o.body.html.match(fckStyleMatcher);
                                fckBody = o.body.html.replace(fckStyleMatcher, "");
                                FCKEditorIframeController.createIframe(me.bodyId + 'Contents' + "FckEditorViewer", me.bodyContentsNode);
                                FCKEditorIframeController.setIframeBody(me.bodyId + 'Contents' + "FckEditorViewer", ['<head>', fckHeadStyle,'<style>body {margin:0px; padding:0px; border:0;}</style>','<script>function Pop4Ajax(Url,Width,Height,POSX,POSY){ top.Pop4Ajax(Url,Width,Height,POSX,POSY);}</script>','</head>', '<body>', '<div style="word-break:break-all">', fckBody, '</div>', '</body>'].join("\n"));
                            } else{
                                me.bodyContentsNode.innerHTML = o.body.html;
                            }
                        }
                        
                        me.doResize();
                        if (me.threePane) {
                            me.recalculateHeights();
                        }
                        
                        me.bodyContentsNode.scrollTop = 0; // Scroll up! It's a new message.
                        
                        if (me.selectMessageNotification !== 0) {
                            me.mdn();
                        }
                        
                        me.onLoadDone(o);
                        // Now tell the world that this message has been read ;-)

			DA.customEvent.fire("messageViewerOnLoadDoneAfter", me, o);

                        if (DA.mailer.util.isJoin(o.type) !== true) {
                            if (!o.seen || parseInt(o.seen, 10) === 0) {
                                // Indeed, this is a new message!
                                o.seen = 1; 
                                oMMData.seen = 1;
                                DA.mailer.Events.onMessageRead.fire(o); // o should do nicely as mail-meta-data..
                            }
                        }      
                        
                    } else {
                        me.loadingFid = null;
                        me.loadingUid = null;
			me.onLoadFailed(oMMData);
                    }
                    
                    me.unlock();
                };
                
                me.jsonIO.errorHandler = function(e) {
                    DA.util.warn(DA.locale.GetText.t_("MESSAGE_VIEW_ERROR"));
                    
                    me.loadingFid = null;
                    me.loadingUid = null;
                    
                    me.unlock();
		    me.onLoadFailed(oMMData, e);
                };
                
                me.jsonIO.execute({ 
                    fid: fid,  uid : uid,
                    backup_maid: (DA.util.isEmpty(backup_maid)) ? '' : backup_maid,
                    srid: (DA.util.isEmpty(srid)) ? '' : srid, 
                    proc: (DA.util.isEmpty(proc)) ? '' : proc,
                    nomdn: (DA.util.isEmpty(nomdn)) ? '' : nomdn
                });

                me.onLoading(oMMData); // TODO: do we need to pass any arguments? 
            } else {
                this.loadingFid = null;
                this.loadingUid = null;
            }
        }
    },
    
    make: function(tid) {
        this._editor('new', null, null, tid, null);
    },
    
    edit: function(quote, fid, uid) {
        this._editor('edit', fid, uid, null, quote);
    },
    
    reply: function(quote, fid, uid) {
        this._editor('reply', fid, uid, null, quote);
    },
    
    replyall: function(quote, fid, uid) {
        this._editor('all_reply', fid, uid, null, quote);
    },
    
    forward: function(quote, fid, uid) {
        this._editor('forward', fid, uid, null, quote);
    },

    /**
     * Callback function invoked when close is called.
     * @property onClose
     * @type {Function}
     * @returns {Boolean}
     */
    onClose: function () { return true; },

    /**
     * Can be called to finish up. This will invoke the onClose callback,
     * and then proceed to call clear.
     * @method close
     */
    close: function () {
        if (this.onClose()) {
            this.clear();
        }
    },

    'delete': function() {
        var me = this;
        var message = (DA.mailer.util.isTrash(this.selectFolderType) || DA.vars.config["delete"] === 1) ? DA.locale.GetText.t_("MESSAGE_DELETECOMPLETE_CONFIRM") : DA.locale.GetText.t_("MESSAGE_DELETE_CONFIRM");
        var io;

        var mmdata = {
            fid: me.selectedFid,
            uid: me.selectedUid,
            srid: (DA.util.isEmpty(me.selectedSrid)) ? me.selectedSrid : ''
        };
        
        if (me.lock()) {
            if (DA.util.confirm(message)) {
                if (this.external) {
                    io = this.moveIO;
                    
                    io.callback = function(o) {
                        if (DA.mailer.util.checkResult(o)) {
                            if (me.selectedSrid === 100000000) {
                                DA.mailer.util.reloadPortal();
                            }
                            DA.windowController.allClose();
                            me.close();
                        }
                        
                        me.unlock();
                    };
                    
                    io.errorHandler = function(e) {
                        DA.util.warn(DA.locale.GetText.t_("MESSAGE_DELETE_ERROR"));
                        
                        me.unlock();
                    };
                    
                    io.execute({
                        proc: (DA.mailer.util.isTrash(me.selectFolderType) || DA.vars.config["delete"] === 1) ? 'delete' : 'trash',
                        fid: me.selectedFid,
                        uid: me.selectedUid,
                        srid: (DA.util.isEmpty(me.selectedSrid)) ? me.selectedSrid : ''
                    });
                } else {
                    try {
                        setTimeout(function () { // Asynchronous
                            DA.mailer.Events.onMessageMoveRequest.fire({
                                target:   { trash: true },
                                messages: {
                                    fid:     me.selectedFid,
                                    srid:    me.selectedSrid,
                                    single:  mmdata,
                                    singles:  [ mmdata ],
                                    ranges:   [],
                                    count:    1,
                                    identity: {}
                                }
                            });
                        }, 200);
                    } catch(e) {
                        me.unlock();
                    }
                }
            } else {
                me.unlock();
            }
        } else {
            me.unlock();
        }
    },
    
    print: function(printToConfig) {
        if (!this.existsLock()) {
            DA.windowController.winOpen(DA.vars.cgiRdir + '/ma_ajx_print.cgi?fid=' + this.selectedFid + '&uid=' + this.selectedUid + '&printtoconfig=' + printToConfig , '', 710, 600);
        }
    },
    
    filter: function() {
        var Proc = 'ma_ajx_filter.cgi%3ffid=' + this.selectedFid + '%20uid=' + this.selectedUid + '%20edit=add%20detail=1%20title_mode=1';
        var Img  = 'pop_title_filter.gif';
        
        if (!this.existsLock()) {
            DA.windowController.isePopup(Proc, Img, 800, 600, '', 1);
        }
    },
    
    prev: function() {
        if (!this.existsLock()) {
            this.view({
                fid:  this.selectedFid, 
                uid:  this.selectedUid, 
                srid: this.selectedSrid
            }, 'prev');
        }
    },
    
    next: function() {
        if (!this.existsLock()) {
            this.view({
                fid:  this.selectedFid, 
                uid:  this.selectedUid, 
                srid: this.selectedSrid
            }, 'next');
        }
    },
    
    header: function() {
        var Proc = 'ma_ajx_header.cgi%3ffid=' + this.selectedFid + '%20uid=' + this.selectedUid;
        var Img  = 'pop_title_emlhead.gif';
        
        if (!this.existsLock()) {
            DA.windowController.isePopup(Proc, Img, 650, 600, '', 1);
        }
    },
    
    'export': function() {
        var me = this;
        var h, io;
		var url,Proc;
        
        if (me.selectMessageExportable && me.lock()) {
            io = this.moveIO;
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    if (!DA.util.isEmpty(o.file)) {
                        if(DA.util.isNull(o.file_name)){
                  		Proc = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=archive%26file=' + o.file;
                        }else{
                            Proc = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=archive%26file=' + o.file + '%26file_name=' + o.file_name;
                        }
                    	url = DA.vars.cgiRdir + '/down_pop4ajax.cgi?proc='+Proc;
                        DA.windowController.winOpenNoBar(url, '', 400, 450);
                    } else {
                        DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
                    }
                }
                
                me.unlock();
            };
            
            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("EXPORT_ERROR"));
                
                me.unlock();
            };
            
            io.execute({ proc: 'export', fid: me.selectedFid, uid: me.selectedUid, archive: '0' });
            
        }
        
    },

    savetolib: function(){
        var me = this;
        var saveToLibIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
        saveToLibIO.method = 'get';
        var Img  = 'pop_title_attachsave.gif';
        saveToLibIO.errorHandler = function(e) {
            DA.util.warn(DA.locale.GetText.t_("SAVE_TO_LIB_ERROR"));
        };
        saveToLibIO.callback = function(o) {
            var url;
            if (!DA.util.isEmpty(o.file)) {
                url = "lib_foldersel.cgi%3fcall=ma_detail%20path=" + o.file + "%20name=" + o.file_name + "%20is_for_save_mail=true";
                DA.windowController.isePopup(url, Img, 400, 550, DA.mailer.util.getMailAccount(), false);
            } else {
                DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
            }
        };
        saveToLibIO.execute({
              fid:  me.selectedFid,
              uid:  me.selectedFid + ":" + me.selectedUid,
              area: "",
              archive: "1",
              proc: "save_to_lib"
        });
    },

    getattachesnum: function() {
      var me = this;
      if(me.attachData.order){
        return me.attachData.order.length;
      }else{
        return 0;
      }
    },

    showsaveattachestolibdialog: function(height,width) {
        var me = this;
        me.saveAttachesToLibDialog.show(height,width);
    },
    
    sales: function() {
        if (!this.existsLock()) {
            DA.windowController.winOpen(DA.vars.cgiRdir + '/ma_ajx_sales.cgi?fid=' + this.selectedFid + '&uid=' + this.selectedUid);
        }
    },
   
    // FIXME: Comments! 
    mdn: function() {
        var me = this;
        var h, io;
        
        if (me.selectMessageNotification === 2) {
            DA.util.warn(DA.locale.GetText.t_("MESSAGE_MDN_SENT"));
        } else if (me.selectMessageNotification === 3) {
            DA.util.warn(DA.locale.GetText.t_("MESSAGE_MDN_SENT")+'\n'+DA.locale.GetText.t_("MESSAGE_APPEND_MAIL2LOCAL"));
        } else if (me.selectMessageNotification === 1) {
            if (DA.util.confirm(DA.locale.GetText.t_("MESSAGE_MDN_CONFIRM"))) {
                io = this.flagIO;
                
                io.callback = function(o) {
                	if (o.result && o.result.message) {
                		DA.util.warn(DA.locale.GetText.t_("MESSAGE_MDN_SENT")+'\n'+o.result.message);
                	}
                };
                
                io.errorHandler = function(e) {
                    DA.util.warn(DA.locale.GetText.t_("MDN_ERROR"));
                };
                
                io.execute({ proc: 'mdn', fid: me.selectedFid, uid: me.selectedUid });
            }
        }
    },
    
    lock: function() {
         if (DA.util.lock('messageViewer')) {
            return true;
        } else {
            return false;
        }
        //return true;
    },
    
    unlock: function() {
        return DA.util.unlock('messageViewer');
        //return true;
    },
    
    existsLock: function() {
        return DA.util.existsLock('messageViewer');
        //return false;
    },
    
    _editor: function(proc, fid, uid, tid, quote) {
        var query;
        var _fid = (fid) ? fid : this.selectedFid;
        var _uid = (uid) ? uid : this.selectedUid;
        var _tid = tid;
        var _quote = quote;
        
        if (this.threePane) {
            DA.mailer.windowController.editorOpen(proc, _fid, _uid, _tid, _quote);
        } else {
            query = '&proc=' + proc;
            if (!DA.util.isEmpty(_fid)) {
                query += '&fid=' + _fid + '&uid=' + _uid;
            }
            if (!DA.util.isEmpty(_tid)) {
                query += '&tid=' + _tid;
            }
            if (!DA.util.isEmpty(_quote)) {
                query += '&quote=' + _quote;
            }
            location.href = DA.util.setUrl(DA.vars.cgiRdir + '/ajax_mailer.cgi?html=editor&richtext=1' + query + "&org_mail_gid=" + OrgMailer.vars.org_mail_gid);
        }
    },
    
    /**
     * Support for DA.session.UIState
     * @method getUIStateInfo
     * @returns {Hash}
     */
    getUIStateInfo: function () {
        return {
            headerExpanded: (this.nvPairs.expanded) ? 1 : 0,
            headerToExpanded: (this.nvPairs.nvpair.To.expanded) ? 1 : 0,
            headerCcExpanded: (this.nvPairs.nvpair.Cc.expanded) ? 1 : 0,
            headerAttachmentExpanded: (this.nvPairs.nvpair.Attachment.expanded) ? 1 : 0 
        };
    }
    
};

})(); // End private scope

