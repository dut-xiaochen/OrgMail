/* $Id: folder-tree.js 2383 2014-04-15 04:42:52Z jl_zhou $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/folder/folder-tree.js $ */
/*for JSLINT undef checks*/
/*extern $ $H DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
/*jslint evil: true */
if (!DA || !DA.mailer || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util || !YAHOO.widget) {
    throw "ERROR: missing yahoo.js or treeview.js"; // TODO: formalize/cleanup
}


/**
 * Drag and Drop method.
 */
DA.mailer.FolderDragDrop = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
        if (!this.DDFrameCreated) {
            this.DDFrameCreated = true;
            this.initFrame();
        }
    }
};

YAHOO.extend(DA.mailer.FolderDragDrop, YAHOO.util.DDProxy, {

    createFrame: function() {
            var self = this;
            var body = document.body;

            var div = this.getDragEl();
            var s;

            if (!div) {
                div = DA.dom.createDiv(this.dragElId);
                div.style.visibility = "hidden";

                body.insertBefore(div, body.firstChild);

                YAHOO.util.Dom.addClass(div, 'labelDummy');
            }
    },

    onDragEnter: function(e, id) { },

    onDragOut: function(e, id) { },

    onDragDrop: function(e, id) { },

    startDrag: function(x, y) {
        this.startX = x;
        this.startY = y;
        this.deltaX = 0;
        this.deltaY = 0;
    },

    endDrag: function(e) { },

    onMouseDown: function(e) { },

    onMouseUp: function(e) { }

});

/**
 * Builds a IMAP folder-tree and renders it with a YUI TreeView widget.
 *
 * Usage:
 *   var ftc = new DA.mailer.FolderTreeController();
 *
 * @class FolderTreeController
 * @uses
 * @constructor
 * @param treeNode HTMLElement DOM node in which to draw the tree.
 *        quotaStoNode HTMLElement DOM node for storage QUOTA.
 *        quotaMesNode HTMLElement DOM node for message QUOTA.
 *        cbhash Call back method in hash.
 */
DA.mailer.FolderTreeController = function(topNode, treeNode, quotaStoNode, quotaMesNode, selectedNode, cbhash) {

    this.jsonIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_dir.cgi' );
    this.listIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_list.cgi' );
    this.moveIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
    this.filterIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_filter.cgi' );
    this.mainteIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_mainte.cgi' );
    this.fileIO   = new DA.io.FileUploadIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );

    this.jsonIO.extend({
        callback: function (o) {
            if (DA.mailer.util.checkResult(o)) {
                this._drawTree(o);
                this._viewQuota(o);
                this._setDrag(o);
                this._setDrop(o);
                this._setupSubscribers();
                DA.mailer.Events.onFolderTreeReady.fire(this);
            } else {
                DA.util.warn(DA.locale.GetText.t_("FOLDER_TREE_ERROR"));
            }
        }.bind(this),
        errorHandler: function (e) {
            DA.util.warn(DA.locale.GetText.t_("JSON_ERROR"));
        }.bind(this)
    });

    this.topNode      = topNode;
    this.treeNode     = treeNode;
    this.selectedNode = selectedNode;
    this.quota        = new DA.mailer.QuotaController(quotaStoNode, quotaMesNode);
    this.popup        = new DA.mailer.FolderTreePopupMenu(this);
    // FIXME: Use Prototype.js Object.extend to do the following:
    if (DA.util.isFunction(cbhash.onUpdating)) {
        this.onUpdating = cbhash.onUpdating;
    }
    if (DA.util.isFunction(cbhash.onUpdateDone)) {
        this.onUpdateDone = cbhash.onUpdateDone;
    }
    if (DA.util.isFunction(cbhash.onSelect)) {
        this.onSelect = cbhash.onSelect;
    }
    if (DA.util.isFunction(cbhash.onDelete)) {
        this.onDelete = cbhash.onDelete;
    }
    if (DA.util.isFunction(cbhash.onTrash)) {
        this.onTrash = cbhash.onTrash;
    }

    this.init();
};

/**
 * Members
 */
DA.mailer.FolderTreeController.prototype = {

    topNode: null,

    /**
     * The HTML DOM element in which the TreeView will be drawn.
     * @property treeNode
     * @type: HTMLElement
     */
    treeNode: null,

    /**
     * Selected folder name.
     */
    selectedNode: null,

    /**
     * Import Form.
     */
    importNode: null,

    /**
     * Popup menu Element.
     */
    popupNode: null,

    /**
     * QuotaController object.
     */
    quota: null,

    /**
     * Popup Menu.
     */
    popup: null,

    drag: null,

    /**
     * The object containing the folder tree structure and meta-data.
     * @property folderData
     * @type Object
     *
     */
    folderData: null, /* JSON */

    /**
     * YUI TreeView objecy
     * @property treeView
     * @type Object YAHOO.widget.TreeView
     */
    treeView: null, /* YUI TreeView object */

    /**
     * JSON IO utility
     * @property jsonIO
     * @type Object DA.io.JsonIO
     */
    jsonIO: null,

    listIO: null,

    moveIO: null,

    filterIO: null,

    mainteIO: null,

    fileIO: null,

    /**
     * Init.
     * @method init
     */
    init: function() {
        this.treeNode.innerHTML = DA.locale.GetText.t_('DEFAULT_FOLDER_TREE');
        this.jsonIO.execute();
    },


    /**
     * Sets up subscribing handler-functions to all (possibly) relevant
     * CustomEvents (usually under DA.mailer.Events.*)
     * @method _setupSubscribers
     * @private
     */
    _setupSubscribers: function () {
        var E = DA.mailer.Events;
        if (!E) {
            // DA_DEBUG_START
            DA.log('No Custom Events!', 'error', 'folder-tree.js');
            debugger;
            // DA_DEBUG_END
            return;
        }
        var me = this;
        // The 's' prefix leads to 'onMessages' (plural)
        [ 'sMoved', 'sFiltered', 'sFlagged', 'Read' ].each(function(name) {
            name = 'onMessage' + name;
            var ce = E[name]; // ce => CustomEvent
            var hndlr = me[name]; // hndlr => handler function
            if (!ce || !YAHOO.lang.isFunction(hndlr)) {
                // DA_DEBUG_START
                DA.log('No match for CustomEvent/Handler: '+name, 'error', 'folder-tree.js');
                debugger;
                // DA_DEBUG_END
                return;
            }
            ce.subscribe(function(type, args){
                return hndlr.apply(me, args);
            });
        });

    },


    /**
     * Tree Data.
     */
    treeData: {},
    ygtvData: {},

    /**
     * Selected Fid.
     */
    selectedFid: null,

    /**
     * Drag and Drop targeted Fid.
     */
    targetedFid: null,

    /**
     * Drag and Drop source Fid.
     */
    sourceFid: null,

    /**
     * Next Fid.
     */
    nextFid: null,

    /**
     * Root Fid.
     */
    rootFid: null,

    /**
     * IMAP Server Fid.
     */
    serverFid: null,

    /**
     * INBOX Fid.
     */
    inboxFid: null,

    /**
     * Draft Fid.
     */
    draftFid: null,

    /**
     * Sent Fid.
     */
    sentFid: null,

    /**
     * Trash Fid.
     */
    trashFid: null,

    /**
     * SPAM Fid.
     */
    spamFid: null,

    /**
     * Local Server Fid.
     */
    localServerFid: null,

    /**
     * Local Folder Fid.
     */
    localFolderFid: null,

    /**
     * Backup Folder Fid.
     */
    backupFolderFid: null,

    /**
     * Update Function.
     * @property onUpdating
     * @type {function}
     */
    onUpdating: Prototype.emptyFunction,

    /**
     * Update done Function.
     */
    onUpdateDone: Prototype.emptyFunction,

    /**
     * Select Function.
     */
    onSelect: Prototype.emptyFunction,

    /**
     * Delete Function.
     */
    onDelete: Prototype.emptyFunction,

    /**
     * Trash Function.
     */
    onTrash: Prototype.emptyFunction,

    /**
     * @property onMessagesMoved
     * @type {Function} handler for (YUI) CustomEvent DA.mailer.Events.onMessagesMoved
     * @param sJobId {String}
     * @param oRequest {Object} with keys: messages, target
     * @param oResponse {Object} server response (post-move/delete of the server) from ajx_ma_move
     */
    onMessagesMoved: function(sJobId, oRequest, oResponse) {
        this._viewQuota(oResponse);
        if (!oRequest || !oRequest.messages || !oResponse) {
            // DA_DEBUG_START
            DA.log('Bad args to onMessagesMoved, no action taken','error', 'folder-tree.js');
            // DA_DEBUG_END
            return;
        }
        // FIXME: Assumption/reliance on messages.fid; implying same-source
        var srcFid = oRequest.messages.fid;
        var destFid = oRequest.target.fid;
        this._setCounts(oResponse, srcFid);
        if (DA.util.cmpNumber(srcFid, this.selectedFid) ||
            DA.util.cmpNumber(destFid, this.selectedFid)) {
            this.selectedNode.innerHTML = this._labeler(this.selectedFid).selected();
        }
    },

    onMessagesFiltered: function(arg1) {
        this._viewQuota(arg1.response);
        this._setCounts(arg1.response, arg1.srcFid);
        this._selectUI(arg1.srcFid);
    },

    /**
     * @property onMessagesFlagged
     * @type {Function} handler for (YUI) CustomEvent DA.mailer.Events.onMessagesFlagged
     * @param sJobId {String}
     * @param oRequest {Object} with keys: messages, property, state
     * @param oResponse {Object} server response (post-move/delete of the server) from ajx_ma_flag
     */
    onMessagesFlagged: function (sJobId, oRequest, oResponse) {
        // Right now, only bother about seen/unseen
        if (!oRequest || !oRequest.messages || !oResponse) { // trouble
            // DA_DEBUG_START
            DA.log('bad args to onMessagesFlagged', 'error', 'folder-tree.js');
            debugger;
            // DA_DEBUG_END
            return;
        }
        var fid = oRequest.messages.fid;
        if (oRequest.property === 'seen') {
            this._setCounts(oResponse, fid);
            if (DA.util.cmpNumber(fid, this.selectedFid)) {
                this.selectedNode.innerHTML = this._labeler(fid).selected();
            }
        }
    },

    /**
     * CustomEvent handler for DA.mailer.Events.onMessageRead
     * @property onMessageRead
     * @type {Function} YUI CustomEvent subscriber
     * @param oMMData {Object} mail meta-data (uid, fid etc)
     */
    onMessageRead: function (oMMData) {
        if (oMMData && oMMData.fid) {
            this._incSeen(oMMData.fid);
        }
        if (DA.util.cmpNumber(oMMData.fid, this.selectedFid)) {
            this.selectedNode.innerHTML = this._labeler(this.selectedFid).selected();
        }

    },

    onMessagesDragEnter: function(arg1) {
        this._open(arg1.fid);
    },

    inboxName: function() {
        return this._name(this.inboxFid);
    },

    draftName: function() {
        return this._name(this.draftFid);
    },

    sentName: function() {
        return this._name(this.sentFid);
    },

    trashName: function() {
        return this._name(this.trashFid);
    },

    spamName: function() {
        return this._name(this.spamFid);
    },

    /*
     * Set Drag Object.
     */
    _setDrag: function(o) {
        var me = this;

        // Drag
        this.drag = new DA.mailer.FolderDragDrop(this.treeNode, "da_folderTree", {
            scroll:      false,
            resizeFrame: false
        });
        this.drag.onMouseDown = function(e) {
            var cur  = this.getDragEl();
            var node = YAHOO.util.Event.getTarget(e);
            var fid;

            if (node) {
                fid = me._targetId2fid(node.id);

                if (fid && !me.existsLock()) {
                    // DA_DEBUG_START
                    DA.log("mousedown, " + fid, "warn");
                    // DA_DEBUG_END

                    if (me._dragOk(fid)) {
                        me.sourceFid = fid;

                        cur.innerHTML = me.treeData[fid].labeler.dummy();
                    }
                }
            }
        };
	    /**
	     * See YUI sources, dragdrop.js
	     * @method clickValidator
	     * @param e {Object} DOM event (mousedown event, probably)
	     * @returns {Boolean} if TRUE, continue the drag; if FALSE, the drag will be aborted.
	     */
	    this.drag.clickValidator= function(e) {
			if (DA.mailer.util.getOperationFlag() !== '' && DA.mailer.util.getOperationFlag().indexOf(OrgMailer.vars.org_mail_gid.toString()) < 0){
				return false;
			} else{
				return true;
			}
	    };
        this.drag.onMouseUp = function(e) {
            var cur  = this.getDragEl();

            if (me.sourceFid) {
                me.sourceFid =null;

                cur.innerHTML = "";
            }
        };
        this.drag.onDragOver = function(e) {
        };
        this.drag.onDragEnter = function(e, id) {
            var fid;

            if (id) {
                // DA_DEBUG_START
                DA.log("onDragEnter, " + id, "warn");
                // DA_DEBUG_END

                fid = me._targetId2fid(id);

                if (fid && !me.existsLock() && me.sourceFid) {
                    if (me._dropFOk(fid) && fid !== me.sourceFid) {
                        me._addClass($(me._fid2divId(fid)).parentNode, "labelTargeted");
                    }
                }
            } else {
                // DA_DEBUG_START
                DA.log("onDragEnter, no id", "warn");
                // DA_DEBUG_END
            }
        };
        this.drag.onDragOut = function(e, id) {
            var fid;

            if (id) {
                // DA_DEBUG_START
                DA.log("onDragOut, " + id, "warn");
                // DA_DEBUG_END

                fid = me._targetId2fid(id);

                if (fid && !me.existsLock() && me.sourceFid) {
                    if (me._dropFOk(fid) && fid !== me.sourceFid) {
                        me._removeClass($(me._fid2divId(fid)).parentNode, "labelTargeted");
                    }
                }
            } else {
                // DA_DEBUG_START
                DA.log("onDragOut, no id", "warn");
                // DA_DEBUG_END
            }
        };
        this.drag.onDragDrop = function(e, id) {
            var fid;

            if (id) {
                // DA_DEBUG_START
                DA.log("onDragDrop, " + id, "warn");
                // DA_DEBUG_END

                fid = me._targetId2fid(id);

                if (fid && !me.existsLock() && me.sourceFid) {
                    if (me._dropFOk(fid) && fid !== me.sourceFid) {
                        me._removeClass($(me._fid2divId(fid)).parentNode, "labelTargeted");
                        me._move(me.sourceFid, fid);
                    }
                }
            }
        };
    },

    /*
     * Set Drop Object.
     */
    _setDrop: function(o) {
        var me = this;
        // Simpler way to iterate all the treeDatas and create their DropTarget references
        $H(this.treeData).each( function(f) {
            var fid = f.key;
            var obj = f.value;
            if (me._dropFOk(fid) || me._dropMOk(fid)) {
                // save a reference as drop - this was intended earlier, but seemed wrong
                obj.drop = new YAHOO.util.DDTarget(me._fid2divId(fid), "da_folderTree");
            }
        });
    },

    /*
     * View Quota.
     */
    _viewQuota: function(o) {
        var me = this;

        this.quota.set(o);
        this.quota.view();

    },

    /**
     * Draw the tree from the (json) object.
     * @method init
     * @private
     * @param Object corresponding to ajx_ma_dir.cgi
     */
    _drawTree: function(o) {
        var topFid;
        var folders = o.folder_list || [];
        var me = this; var fo;
        var firstFolders  = [];
        var foldersLength = folders.length;

        for (var i = 0; i < foldersLength; i ++) {
            fo = folders[i]; me.treeData[fo.fid] = {};
            for (var key in fo) {
                me.treeData[fo.fid][key] = fo[key];
            }
            me.treeData[fo.fid].last_update = 0;
            me.treeData[fo.fid].children = [];
            me.treeData[fo.fid].labeler = new DA.mailer.FolderLabeler(this.topNode, this.treeNode, me._data(fo.fid));

            if (fo.parent === 0) {
                topFid = fo.fid;
            } else {
                me.treeData[fo.parent].children.push(me._data(fo.fid));
                if (me._parent(fo.fid) === topFid) {
                    firstFolders.push(fo.fid);
                }
            }

            // 特殊フォルダの判定
            switch(fo.type) {
                case DA.vars.folderType.root:
                    this.rootFid = fo.fid;
                    break;
                case DA.vars.folderType.server:
                    this.serverFid = fo.fid;
                    break;
                case DA.vars.folderType.inbox:
                    this.inboxFid = fo.fid;
                    break;
                case DA.vars.folderType.draft:
                    this.draftFid = fo.fid;
                    break;
                case DA.vars.folderType.sent:
                    this.sentFid = fo.fid;
                    break;
                case DA.vars.folderType.trash:
                    this.trashFid = fo.fid;
                    break;
                case DA.vars.folderType.spam:
                    this.spamFid = fo.fid;
                    break;
                case DA.vars.folderType.localServer:
                    this.localServerFid = fo.fid;
                    break;
                case DA.vars.folderType.localFolder:
                    this.localFolderFid = fo.fid;
                    break;
                case DA.vars.folderType.backupFolder:
                    this.backupFolderFid = fo.fid;
                    break;    
                default:
                    break;
            }
        }

        me.treeView = new YAHOO.widget.TreeView( me.treeNode );
        me.nextFid  = o.next_fid;

        this.topNode.innerHTML = me.treeData[topFid].labeler.root();

        var root = me.treeView.getRoot();
        var firstFoldersLength = firstFolders.length;
        var fid, to;
        for (var j = 0; j < firstFoldersLength; j ++) {
            fid = firstFolders[j];
            me._populate(me.treeData[fid], root);
            me.treeView.subscribe("labelClick", function(node) {
                clearTimeout(to);
                to = setTimeout(function() {
                    DA.widget.PopupMenuManager.allCancel();
                    me._select(node.data.id);
                }, 100);
                return false;
            });
        }

        me.treeView.draw();
        me._open(me.serverFid);
        me._open(me.inboxFid);  
        if (DA.vars.system.auto_backup_on === 1 && DA.vars.config.backup_exists === 1 && DA.vars.config.backup_msg_show ===1) {
            me._open(me.localServerFid);
            me._select(me.backupFolderFid);
            $("mboxGrid_search_keyword").disabled = true;
            $("mboxGrid_search_button").disabled  = true;
            DA.util.warn(DA.locale.GetText.t_("EXISTS_BACKUP_FILES"));
        } else {
            me._select(me.inboxFid);
        }

    },

    /**
     * Draw a singe node, and recursively draw it's children (if any)
     * TODO: cleanup the doc-comments
     * @method _populate
     * @private
     * @param _f node info (Object)
     * @param parentNode YAHOO.widget.*Node
     */
    _populate: function (f, parentNode) {
        var me     = this;
        if (f.hidden === 1) { return; }
        
        var node   = new YAHOO.widget.TextNode(f.labeler.label(true), parentNode);
        var length = f.children.length;

        me.treeData[f.fid].node = node;
        me.ygtvData[node.getElId()] = f.fid;

        for (var i = 0; i < length; i ++) {
            me._populate(f.children[i], node);
        }
    },

    /**
     * FIXME: comments
     * @method _open
     * @private
     */
    _open: function(fid) {
        var node = this._node(fid);
        if (!node.expanded && !node.childrenRendered) {
            // We need to clear the YUI DragDrop DOM reference cache
            // if the node is collapsed AND or it's children are due
            // for a rendering
            this._clearYUIDragDropMgrDomRefCache(); // Faiz: Sorry for the long names...
        }
        node.expand();
    },

    /**
     * Clear all cached DOM references that may be held in the 'da_folderTree'
     * DD group.
     * Faiz: Sorry for the long names...
     * @method _clearYUIDragDropMgrDomRefCache
     * @private
     */
    _clearYUIDragDropMgrDomRefCache: function() {
        // Get a hash of all DD objects associated with folderTree
        var hash = YAHOO.util.DDM.ids.da_folderTree || {};
        $H(hash).values().each(function(oDD){  // For each DD object, delete the reference
            oDD._domRef = null;                // to the cached (lazy-loaded) DOM reference
        });
        // TODO: location cache?
    },

    _close: function(fid) {
        var node = this._node(fid);

        node.collapse();
    },

    _parentsOpen: function(fid, top) {
        var parent = this._parent(fid);

        if (parent !== 0 && parent !== top) {
            this._parentsOpen(parent, top);
        }

        this._showChildren(parent);
    },

    _refresh: function(fid) {
        var node = this._node(fid);
        this._clearYUIDragDropMgrDomRefCache(); // unconditionally clear the YUI DDM cache
        node.refresh();
    },

    _select: function(fid) {
        var me = this;
        var node, labeler, h, io;

        if (me._selectOk(fid) && me.lock()) {
            node = this._node(fid);

            if (me.selectedFid && me._exists(me.selectedFid)) {
                me._labeler(me.selectedFid).removeClass("labelSelected");
                me._clearRecent(me.selectedFid);
            }
            me._labeler(fid).addClass("labelSelected");

            me.selectedFid = fid;

            if (me._updateOk(fid)) {
                DA.waiting.show('', DA.vars.imgRdir + '/popy_wait_mail.gif');
                me.onUpdating(fid);

                io = this.listIO;

                io.callback = function(o) {
                    me.onUpdateDone(fid);

                    if (DA.mailer.util.checkResult(o)) {
                        me.treeData[fid].last_update = DA.time.GetTime();

                        me._viewQuota(o);
                        me._setCounts(o, fid);
                        me._selectUI(fid);
                    }
                    if(DA.vars.new_mail){
                    	eval(DA.vars.new_mail);
                    }
                    if (DA.vars.custom.threePane.updateFolder) {
                        eval(DA.vars.custom.threePane.updateFolder);
                    }

                    me.unlock();
                    DA.waiting.hide();
					if (o.result.error === 1001) {
						DA.util.warn(o.result.message);
						me._rebuild(fid);
					} else if (o.result.error === 1002) {
						if (DA.util.confirm(o.result.message)) {
							me._rebuild(fid);
						}
					}
                };

                io.errorHandler = function(e) {
          		    DA.util.warn(DA.locale.GetText.t_("FOLDER_SELECT_ERROR"));

                    me.onUpdateDone(fid);
                    me.unlock();
                    DA.waiting.hide();
                };

                io.execute({ proc : "update", fid : fid, ignoreQuota:"yes" });

            } else {
                me._selectUI(fid);

                me.unlock();
            }
        }

    },

    _selectUI: function(fid) {
        var me = this;

        if (me._selectOk(fid)) {
            // DA_DEBUG_START
            try {
            // DA_DEBUG_END
                me.selectedNode.innerHTML = me._labeler(fid).selected();
                me.onSelect(fid, me._type(fid));
            // DA_DEBUG_START
            } catch (e) {
                DA.log("ERROR in onSelect: " + e, "error", "folder-tree.js");
                throw e;
            }
            // DA_DEBUG_END
        }

    },

    _create: function(fid, name, type) {
        var me = this;
        var h, io;

        if (me._createOk(fid) && me.lock()) {
            io = this.jsonIO;

            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._createUI(fid, name, type);

                    if (DA.util.isEmpty(o.next_fid)) {
                        DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
                    } else {
                        me.nextFid = o.next_fid;
                    }
                }

                me.unlock();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("FOLDER_CREATE_ERROR"));

                me.unlock();
            };

            io.execute({ proc : "create", fid : fid, name : name, type : type });

        }

    },

    _createUI: function(fid, name, type) {
        var me = this;
        var c, node, next_fid, trash_m, messages_e, unseen_e, recent_e;

        if (me._createOk(fid)) {
            this.popup.cfDialog.hide();

            c        = {};
            node     = me._node(fid);
            next_fid = me.nextFid;

            if (DA.vars.config['delete'] === 1) {
                trash_m = 1;
            } else {
                trash_m = 0;
            }

            if (DA.vars.config.count === "all" || DA.vars.config.count === "half") {
                messages_e = 1;
            } else {
                messages_e = 0;
            }

            if (DA.vars.config.count === "all") {
                unseen_e = 1;
            } else {
                unseen_e = 0;
            }

            if (DA.vars.config.recent === "on") {
                recent_e = 1;
            } else {
                recent_e = 0;
            }

            if (type === DA.vars.folderType.cabinet) {
                c = {
                    fid         : next_fid,
                    parent      : fid,
                    uidvalidity : 0,
                    type        : 18,
                    name        : name,
                    icon        : DA.vars.imgRdir + '/ico_fc_cabinet.gif',
                    alt         : '',
                    select      : 0,
                    update      : 0,
                    create      : 1,
                    rename      : 1,
                    'delete'    : 1,
                    move        : 1,
                    'import'    : 0,
                    'export'    : 0,
                    filter      : 0,
                    rebuild     : 0,
                    move_f      : 1,
                    move_m      : 0,
                    open_m      : 0,
                    trash_m     : trash_m,
                    messages    : 0,
                    unseen      : 0,
                    recent      : 0,
                    messages_e  : messages_e,
                    unseen_e    : unseen_e,
                    recent_e    : recent_e,
                    last_update : 0,
                    children    : [],
                    drop        : new YAHOO.util.DDTarget(this._fid2divId(next_fid), "da_folderTree")
                };
            } else if (type === DA.vars.folderType.mailbox) {
                c = {
                    fid         : next_fid,
                    parent      : fid,
                    uidvalidity : 0,
                    type        : 17,
                    name        : name,
                    icon        : DA.vars.imgRdir + '/ico_14_folder_c.gif',
                    alt         : '',
                    select      : 1,
                    update      : 1,
                    create      : 0,
                    rename      : 1,
                    'delete'    : 1,
                    move        : 1,
                    'import'    : 1,
                    'export'    : 1,
                    filter      : 1,
                    rebuild     : 1,
                    move_f      : 0,
                    move_m      : 1,
                    open_m      : 1,
                    trash_m     : trash_m,
                    messages    : 0,
                    unseen      : 0,
                    recent      : 0,
                    messages_e  : messages_e,
                    unseen_e    : unseen_e,
                    recent_e    : recent_e,
                    last_update : 0,
                    children    : [],
                    drop        : null
                };
            } else {
                c = {
                    fid         : next_fid,
                    parent      : fid,
                    uidvalidity : 0,
                    type        : 16,
                    name        : name,
                    icon        : DA.vars.imgRdir + '/ico_14_folder_c.gif',
                    alt         : '',
                    select      : 1,
                    update      : 1,
                    create      : 1,
                    rename      : 1,
                    'delete'    : 1,
                    move        : 1,
                    'import'    : 1,
                    'export'    : 1,
                    filter      : 1,
                    rebuild     : 1,
                    move_f      : 1,
                    move_m      : 1,
                    open_m      : 1,
                    trash_m     : trash_m,
                    messages    : 0,
                    unseen      : 0,
                    recent      : 0,
                    messages_e  : messages_e,
                    unseen_e    : unseen_e,
                    recent_e    : recent_e,
                    last_update : 0,
                    children    : [],
                    drop        : new YAHOO.util.DDTarget(this._fid2divId(next_fid), "da_folderTree")
                };
            }

            me.treeData[next_fid] = c;
            me.treeData[next_fid].labeler = new DA.mailer.FolderLabeler(me.topNode, me.treeNode, me._data(next_fid));
            me.treeData[fid].children.push(me.treeData[next_fid]);

            me._populate(me.treeData[next_fid], node);
            me._refresh(me._parent(next_fid));

            me._showChildren(fid);
            me._hideChildren(me.inboxFid);
        }

    },

    _rename: function(fid, name) {
        var me = this;
        var h, io;

        if (me._renameOk(fid) && me.lock()) {
            io = this.jsonIO;

            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._renameUI(fid, name);

                    if (DA.util.isEmpty(o.next_fid)) {
                        DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
                    } else {
                        me.nextFid = o.next_fid;
                    }
                }

                me.unlock();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("FOLDER_RENAME_ERROR"));

                me.unlock();
            };

            io.execute({ proc : "rename", fid : fid, name : name });

        }

    },

    _renameUI: function(fid, name) {
        var me = this;
        var c, labeler;

        if (me._renameOk(fid)) {
             this.popup.rfDialog.hide();

             c = me._data(fid);
             labeler = me._labeler(fid);

             c.name = name;

             labeler.refresh();
        }

    },

    _move: function(src, dst) {
        var me = this;
        var h, io;

        if (me._dragOk(src) && me._dropFOk(dst) && me.lock()) {
            io = this.jsonIO;

            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._moveUI(src, dst);

                    if (DA.util.isEmpty(o.next_fid)) {
                        DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
                    } else {
                        me.nextFid = o.next_fid;
                    }
                }

                me.unlock();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("FOLDER_MOVE_ERROR"));

                me.unlock();
            };

            io.execute({ proc : "move", fid : src, target_fid : dst });

        }

    },

    _moveUI: function(src, dst) {
        var me = this;
        var cp, cs, cd, i, dp;

        if (me._dragOk(src) && me._dropFOk(dst)) {
            dp = me._parent(src);
            cp = me._data(dp);
            cs = me._data(src);
            cd = me._data(dst);

            cs.parent = dst;
            for (i = 0; i < cp.children.length; i ++) {
                if (cp.children[i].fid === src) {
                    cd.children.push(cs);
                    cp.children.splice(i, 1);
                    break;
                }
            }

            me.treeView.removeNode(me._node(src), true);
            me._populate(cs, me._node(dst));

            me.treeView.draw();
            // calling draw will affect DragDrop references because TreeView uses
            // innerHTML. We need to clear the cached DOM references that any DragDrop
            // DDTarget (drop target instances) might be holding.
            this._clearYUIDragDropMgrDomRefCache();

            me._hideChildren(dp);
            me._showChildren(dst);
            me._hideChildren(me.inboxFid);

            if (me.selectedFid) {
                me._parentsOpen(me.selectedFid, dst);
                me._labeler(me.selectedFid).addClass("labelSelected");
            }
        }

    },

    _delete: function(fid) {
        var me = this;
        var h, io;

        if (me._deleteOk(fid) && me.lock()) {
            io = this.jsonIO;

            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._deleteUI(fid);
                    if (me.selectedFid === fid) {
                         me.selectedFid = null;
                    }
                    if (DA.util.isEmpty(o.next_fid)) {
                        DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
                    } else {
                        me.nextFid = o.next_fid;
                    }
                }

                me.unlock();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("FOLDER_DELETE_ERROR"));

                me.unlock();
            };

            io.execute({ proc : "delete", fid : fid });

        }

    },

    _deleteUI: function(fid) {

        if (!this._deleteOk(fid)) {
            // DA_DEBUG_START
            DA.log("delete not OK for fid:" + fid, "error", "folder-tree.js");
            // DA_DEBUG_END
            return;
        }

        var node = this._node(fid);
        var parent = this._parent(fid);
        var parentNode = this._node(parent);
        var parentData = this._data(parent);

        var i;
        for (i = 0; i < parentData.children.length; i++) {
            if (parentData.children[i].fid === fid) {
                // FIXME: comments
                // This is hard to understand.
                parentData.children.splice(i, 1);
                break;
            }
        }

        this.treeView.removeNode(node);

        this.treeView.draw();
        // calling draw will affect DragDrop references because TreeView uses
        // innerHTML. We need to clear the cached DOM references that any DragDrop
        // DDTarget (drop target instances) might be holding.
        this._clearYUIDragDropMgrDomRefCache();

        this._hideChildren(parent);
        this._hideChildren(this.inboxFid);

        delete this.treeData[fid];

        this.onDelete(fid);

    },

    _filter: function(fid) {
        var me = this;
        var h, io;
        if (me._filterOk(fid) && me.lock()) {
            io = this.filterIO;

            DA.waiting.show(DA.locale.GetText.t_("FILTER_OPERATING_PROMPT"));
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._setCounts(o, fid);
                    me._filterUI(fid);
                    if (me.selectedFid === fid) {
                        me._selectUI(fid);
                    }
                }

                me.unlock();
                DA.waiting.hide();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("FILTER_ERROR"));

                me.unlock();
                DA.waiting.hide();
            };

            io.execute({ proc : "submit", fid : fid, uid : "all" });

        }
    },

    _filterUI: function(fid) {
        var me = this;

        if (me._filterOk(fid)) {
        }

    },

    _rebuild: function(fid) {
        var me = this;
        var h, io;
        if (me._rebuildOk(fid) && me.lock()) {
            io = this.mainteIO;

            DA.waiting.show(DA.locale.GetText.t_("REBUILD_OPERATING_PROMPT"));
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._setCounts(o, fid);
                    me._rebuildUI(fid);
                    if (me.selectedFid === fid) {
                        me._selectUI(fid);
                    }
                }

                me.unlock();
                DA.waiting.hide();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("REBUILD_ERROR"));

                me.unlock();
                DA.waiting.hide();
            };

            io.execute({ proc : "rebuild", fid : fid });

        }
    },

    _rebuildUI: function(fid) {
        var me = this;

        if (me._rebuildOk(fid)) {
        }

    },

    _export: function(fid) {
        var me = this;
        var h, io;

        if (me._exportOk(fid) && me.lock()) {
            io = this.moveIO;

            DA.waiting.show(DA.locale.GetText.t_("EXPORT_OPERATING_PROMPT"));
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    if (!DA.util.isEmpty(o.file)) {
                        me._viewQuota(o);
                        me._exportUI(fid, o.file, o.file_name);
                    } else {
                        DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
                    }
                }

                me.unlock();
                DA.waiting.hide();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("EXPORT_ERROR"));

                me.unlock();
                DA.waiting.hide();
            };

            io.execute({ proc : "export", fid : fid, uid : "all", archive : "1" });

        }

    },

    _exportUI: function(fid, file, file_name) {
        var me = this;
        var url,Proc;

        if (me._exportOk(fid)) {
            if(DA.util.isNull(file_name)){
                Proc = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=archive%26file=' + file;
            }else{
                Proc = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=archive%26file=' + file + '%26file_name=' + file_name;
            }
            url = DA.vars.cgiRdir + '/down_pop4ajax.cgi?proc='+Proc;
            DA.windowController.winOpenNoBar(url, '', 400, 450);
        }

    },

    _import: function(fid) {
        var me = this;
        var io;

        if (me._importOk(fid) && me.lock()) {
            YAHOO.util.Dom.get(this.importNode).fid.value = fid;

            io = this.fileIO;

            DA.waiting.show(DA.locale.GetText.t_("IMPORT_OPERATING_PROMPT"));
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._setCounts(o, fid);
                    me._importUI(fid);
                    if (me.selectedFid === fid) {
                        me._selectUI(fid);
                    }
                }

                me.unlock();
                DA.waiting.hide();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("IMPORT_ERROR"));

                me.unlock();
                DA.waiting.hide();
            };

            io.execute(this.importNode);

        } else {
            return false;
        }

    },

    _importUI: function(fid) {
        var me = this;

        if (me._importOk(fid)) {
            this.popup.ifDialog.hide();
        }

    },

    _trash: function(fid) {
        var me = this;
        var h, io;

        if (me._trashOk(fid) && me.lock()) {
            io = this.moveIO;

            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._trashUI(fid);
                    if (me.selectedFid === fid) {
                        me._selectUI(fid);
                    }

                    // this.onTrash(fid);
                }

                me.unlock();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("TRASH_ERROR"));

                me.unlock();
            };

            io.execute({ proc : "delete", fid : fid, uid : "all" });

        }

    },

    _trashUI: function(fid) {
        var me = this;

        if (me._trashOk(fid)) {
            me._clearCount(fid);
        }

    },

    _openOk: function(fid) {
        var me = this;

        if (me.treeData[fid].children.length > 0 && !me._opened(fid)) {
            return true;
        } else {
            return false;
        }
    },

    _closeOk: function(fid) {
        var me = this;

        if (me.treeData[fid].children.length > 0 && me._opened(fid)) {
            return true;
        } else {
            return false;
        }
    },

    _selectOk: function(fid) {
        var me = this;

        if (me.treeData[fid].select === 1) {
            return true;
        } else {
            return false;
        }

    },

    _updateOk: function(fid) {
        var me = this;
        var labeler;

        if (me.treeData[fid].update === 1) {
            labeler = me._labeler(fid);
            if (labeler.recent() > 0 ||
                DA.vars.config.update_time === 0 ||
                DA.time.DiffTime(me.treeData[fid].last_update, DA.time.GetTime()) > DA.vars.config.update_time * 1000) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    },

    _createOk: function(fid) {
        var me = this;

        if (me.treeData[fid].create === 1) {
            return true;
        } else {
            return false;
        }

    },

    _renameOk: function(fid) {
        var me = this;

        if (me.treeData[fid].rename === 1) {
            return true;
        } else {
            return false;
        }

    },

    _dragOk: function(fid) {
        var me = this;

        if (me.treeData[fid].move === 1) {
            return true;
        } else {
            return false;
        }

    },

    _dropFOk: function(fid) {
        var me = this;

        if (me.treeData[fid].move_f === 1) {
            return true;
        } else {
            return false;
        }

    },

    _dropMOk: function(fid) {
        var me = this;

        if (me.treeData[fid].move_m === 1) {
            return true;
        } else {
            return false;
        }

    },

    _deleteOk: function(fid) {
        var me = this;

        if (me.treeData[fid]['delete'] === 1) {
            return true;
        } else {
            return false;
        }

    },

    _filterOk: function(fid) {
        var me = this;

        if (me.treeData[fid].filter === 1) {
            return true;
        } else {
            return false;
        }

    },

    _rebuildOk: function(fid) {
        var me = this;

        if (me.treeData[fid].rebuild === 1) {
            return true;
        } else {
            return false;
        }

    },

    _exportOk: function(fid) {
        var me = this;

        if (me.treeData[fid]['export'] === 1) {
            return true;
        } else {
            return false;
        }

    },

    _importOk: function(fid) {
        var me = this;

        if (me.treeData[fid]['import'] === 1) {
            return true;
        } else {
            return false;
        }

    },

    _trashOk: function(fid) {
        var me = this;

        if (me.treeData[fid].trash === 1) {
            return true;
        } else {
            return false;
        }

    },

    _opened: function(fid) {
        var me    = this;
        var node  = me._node(fid);
        var style = node.getStyle();

        if (style.match(/(?:^|\s)ygtv[lt]m[h]?(?:\s|$)/)) {
            return true;
        } else {
            return false;
        }
    },

    _hasChildren: function(fid) {
        var me   = this;
        var data = me._data(fid);

        if (data.children.length > 0) {
            return true;
        } else {
            return false;
        }
    },

    _showChildren: function(fid) {
        var node;
        if (fid !== 0) {
            node = this._node(fid);
            if (node && node.hasChildren()) {
                this._open(fid);
            }
        }
    },

    _hideChildren: function(fid) {
        var node;
        if (fid !== 0) {
            node = this._node(fid);
            if (node && !node.hasChildren()) {
                this._close(fid);
            }
        }
    },

    _exists: function(fid) {
        if (this.treeData[fid]) {
            return true;
        } else {
            return false;
        }
    },

    _data: function(fid) {
        return this.treeData[fid];
    },

    _node: function(fid) {
        return this.treeData[fid].node;
    },

    _labeler: function(fid) {
        return this.treeData[fid].labeler;
    },

    _parent: function(fid) {
        return this.treeData[fid].parent;
    },

    _name: function(fid) {
        return this.treeData[fid].name;
    },

    _type: function(fid) {
        return this.treeData[fid].type;
    },

    _incSeen: function(fid) {
        var labeler = this._labeler(fid);

        labeler.data.unseen = (labeler.data.unseen - 1 < 0) ? 0 : labeler.data.unseen - 1;

        labeler.refresh();
    },

    _setCounts: function(o, fid) {
        var counts = o.count_list;
        var total  = o.total;
        var i;

        if (counts) {
            for (i = 0; i < counts.length; i ++) {
                this._setCount(counts[i].fid, counts[i].messages, counts[i].unseen, counts[i].recent);
            }
        }
        if (total) {
            this._setCount(fid, total.messages, total.unseen, total.recent);
        }
    },

    _setCount: function(fid, messages, unseen, recent) {
        var labeler = this._labeler(fid);

        if (!DA.util.isEmpty(messages)) {
            labeler.messages(messages);
        }

        if (!DA.util.isEmpty(unseen)) {
            labeler.unseen(unseen);
        }

        if (!DA.util.isEmpty(recent)) {
            labeler.recent(recent);
        }

        labeler.refresh();
    },

    _clearCount: function(fid) {

        this._setCount(fid, 0, 0, 0);

    },

    _clearRecent: function(fid) {

        this._setCount(fid, null, null, 0);

    },

    _fid2divId: function(fid) {
        var divId =  'da_folderTreeDivId_' + fid;

        return divId;
    },

    _divId2fid: function(divId) {
        var array = divId.split("_");

        return parseInt(array[2], 10);
    },

    _targetId2fid: function(id) {
        var fid;

        if (id.match(/^da\_folderTreeDivId\_(\d+)$/)) {
            fid = RegExp.$1;
        } else if (id.match(/^ygtv\d+$/)) {
            fid = this.ygtvData[id];
        }

        return parseInt(fid, 10);
    },

    lock: function() {
        if (DA.util.lock('folderTree')) {
            return true;
        } else {
            return false;
        }
    },

    unlock: function() {
        return DA.util.unlock('folderTree');
    },

    existsLock: function() {
        return DA.util.existsLock('folderTree');
    },

    _addClass: function(divId, cname) {
        var el = YAHOO.util.Dom.get(divId);
        YAHOO.util.Dom.addClass(el, cname);
    },

    _removeClass: function(divId, cname) {
        var el = YAHOO.util.Dom.get(divId);
        YAHOO.util.Dom.removeClass(el, cname);
    }

};



/**
 * Folder Labeler.
 *
 * Usage:
 *   var fl = new DA.mailer.FolderLabeler();
 *
 * @class FolderLabeler
 * @uses
 * @constructor
 * @param data folder object.
 */
DA.mailer.FolderLabeler = function(topNode, treeNode, data) {
    this.topNode  = topNode;
    this.treeNode = treeNode;
    this.data = data;
};

/**
 * Members
 */
DA.mailer.FolderLabeler.prototype = {

    topNode: null,

    treeNode: null,

    data: null,

    fid: function() {
        return this.data.fid;
    },

    divId: function() {
        return 'da_folderTreeDivId_' + this.data.fid;
    },

    node: function() {
        return this.data.node;
    },

    messagesEnable: function() {
        if (this.data.messages_e === 1) {
            return true;
        } else {
            return false;
        }
    },

    unseenEnable: function() {
        if (this.data.unseen_e === 1) {
            return true;
        } else {
            return false;
        }
    },

    recentEnable: function() {
        if (this.data.recent_e === 1) {
            return true;
        } else {
            return false;
        }
    },

    messages: function(n) {
        if (!DA.util.isEmpty(n)) {
            this.data.messages = n;
        }

        return this.data.messages;
    },

    unseen: function(n) {
        if (!DA.util.isEmpty(n)) {
            this.data.unseen = n;
        }

        return this.data.unseen;
    },

    recent: function(n) {
        if (!DA.util.isEmpty(n)) {
            this.data.recent = n;
        }

        return this.data.recent;
    },

    name: function() {
        return this.data.name;
    },

    icon: function() {
        return this.data.icon;
    },

    alt: function() {
        return this.data.alt;
    },

    type: function() {
        return this.data.type;
    },

    select: function() {
        return this.data.select;
    },

    _image: function() {
        var image = DA.imageLoader.tag(this.icon(), this.alt());

        return image;
    },

    _name: function() {
        var n = this.name();
        var name = DA.util.encode(n);

        return name;
    },

    _count: function() {
        var count = '';
        var messages = this.messages();
        var unseen   = this.unseen();
        var recent   = this.recent();

        if (this.messagesEnable()) {
            if (this.unseenEnable()) {
                count = '[' + DA.util.encode(unseen) + '/' + DA.util.encode(messages) + ']';
            } else {
                count = '[' + DA.util.encode(messages) + ']';
            }
        } else {
            if (this.unseenEnable()) {
                count = '[' + DA.util.encode(unseen) + ']';
            } else {
                count = '';
            }
        }
        if (this.recentEnable()) {
            if (recent !== 0) {
                count += '&nbsp;';
                count += '(' + DA.util.encode(recent) + ')';
            }
        }

        return count;
    },

    _countOnly: function() {
        var count = '';
        var messages = this.messages();
        var unseen   = this.unseen();

        if (DA.mailer.util.isLocalFolder(this.type()) || DA.mailer.util.isBackupFolder(this.type())) {
            count = '';
        } else if (DA.mailer.util.isSent(this.type()) || DA.mailer.util.isDraft(this.type())) {
            count = DA.locale.GetText.t_('MESSAGES_NOUNSEEN_UNIT', DA.util.encode(messages));
        } else {
            count = DA.locale.GetText.t_('MESSAGES_UNSEEN_UNIT', DA.util.encode(messages), DA.util.encode(unseen));
        }

        return count;
    },

    _class: function(only) {
        var cname = 'ygtvlabel';

        if (this._isRecent()) {
            cname += " labelRecent";
        }
        if (this._isSelected()) {
            cname += " labelSelected";
        }
        if (this._isTargeted()) {
            cname += " labelTargeted";
        }
        if (this.select() === 0) {
            cname += " labelNoPointer";
        }

        var classes = ' class="' + cname + '"';

        return (only) ? cname : classes;
    },

    _isRecent: function() {
        if (this.recentEnable() && this.recent() > 0) {
            return true;
        } else {
            return false;
        }
    },

    _isSelected: function() {
        // var el = YAHOO.util.Dom.get(this.divId());
        var selected;

        // if (YAHOO.util.Dom.hasClass(el, "labelSelected")) {
        if (this.hasClass('labelSelected')) {
            selected = true;
        } else {
            selected = false;
        }

        return selected;
    },

    _isTargeted: function() {
        // var el = YAHOO.util.Dom.get(this.divId());
        var targeted;

        // if (YAHOO.util.Dom.hasClass(el, "labelTargeted")) {
        if (this.hasClass('labelTargeted')) {
            targeted = true;
        } else {
            targeted = false;
        }

        return targeted;
    },

    root: function() {
        var space = '&nbsp;';
        var mouse = ' onmouseover="YAHOO.util.Dom.addClass(this.parentNode, \'labelHover\');" onmouseout="YAHOO.util.Dom.removeClass(this.parentNode, \'labelHover\');"';
        var label = '<div id="' + this.divId() + '" class="ygtvlabel labelRoot"' + mouse + '" onclick="DA.mailer.util.treeOpenAll(\'' + this.treeNode.id + '\');">' +
                    this._image() + space +
                    this._name() + space +
                    this._count() + '</div>';

        return label;
    },

    label: function(object) {
        var space = '&nbsp;';
        var mouse = (this.data.select === 1) ? ' onmouseover="YAHOO.util.Dom.addClass(this.parentNode, \'labelHover\');" onmouseout="YAHOO.util.Dom.removeClass(this.parentNode, \'labelHover\');"' : '';
        var label;
        if (object) {
            label = {
                id: this.fid(),
                label: '<div id="' + this.divId() + '"' + mouse + '>' +
                       this._image() + space +
                       this._name() + space +
                       this._count() +
                       '</div>',
                style: this._class(true)
            };
        } else {
            label = '<div id="' + this.divId() + '"' + this._class() + mouse + '>' +
                    this._image() + space +
                    this._name() + space +
                    this._count() +
                    '</div>';
        }

        return label;
    },

    dummy: function() {
        var space = '&nbsp;';
        var dummy = this._image() + space +
                    this._name() + space +
                    this._count();

        return dummy;
    },

    selected: function() {
        var space = '&nbsp;';
        var label = this._image() + space +
                    this._name() + space +
                    this._countOnly();

        return label;
    },

    _cachedFuncs : {
        mouseover: function() { YAHOO.util.Dom.addClass(this.parentNode,    'labelHover'); },
        mouseout:  function() { YAHOO.util.Dom.removeClass(this.parentNode, 'labelHover'); }
    },

    refresh: function() {
        var node  = this.node();
        var divId = this.divId();
        var div = $(divId);
        if (!div || div.tagName !== 'DIV') {
        	if (node) {
        		node.setUpLabel(this.label(true));
        	}
            // DA_DEBUG_START
            DA.log("DIV not found:"+divId, "error", "folder-tree-js");
            // DA_DEBUG_END
            return;
        }

        if (node) {
            node.setUpLabel(this.label(true));
            node.getLabelEl().className = this._class(true);

            div.innerHTML = [this._image(),  this._name(), this._count()].join("&nbsp;");
        }
        // TODO: Warn if no node?
    },

    hasClass: function(name) {
        if (this.node()) {
            if (YAHOO.util.Dom.hasClass(this.node().getLabelEl(), name)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    addClass: function(name) {
        var node = this.node();
        var el   = node.getLabelEl();

        YAHOO.util.Dom.addClass(el, name);
        node.labelStyle = el.className;
    },

    removeClass: function(name) {
        var node = this.node();
        var el   = node.getLabelEl();

        if (el) {
            YAHOO.util.Dom.removeClass(el, name);
            node.labelStyle = el.className;
        }
    }

};

/**
 * Quota Controller.
 *
 * Usage:
 *   var qc = new DA.mailer.QuotaController();
 *
 * @class QuotaController
 * @uses
 * @constructor
 * @param data json object.
 */
DA.mailer.QuotaController = function(storageNode, messagesNode) {
    this.storageNode  = storageNode;
    this.messagesNode = messagesNode;

    if (DA.vars.custom.threePane.setQuota) {
        eval(DA.vars.custom.threePane.setQuota);
    }
};

/**
 * Members
 */
DA.mailer.QuotaController.prototype = {
    storageNode: null,

    messagesNode: null,

    storageQuota: null,

    messagesQuota: null,

    storageUse: null,

    messagesUse: null,

    storageOver: null,

    messagesOver: null,

    _storage: function() {
        var storageQuota = this.storageQuota;
        var storageUse   = this.storageUse;
        var storage = '';

        if (!DA.util.isEmpty(storageQuota) && !DA.util.isEmpty(storageUse)) {
        	
        	if (DA.vars.config.cap_size_unit === 'MB') {
        		storageUse = (storageUse/1024).toFixed(2);
        		storageQuota = (storageQuota/1024).toFixed(2);
        		storage = '&lt;' + DA.util.encode(storageUse) + '/' + DA.util.encode(storageQuota) + '&gt;' + DA.locale.GetText.t_('STORAGE_UNIT_MB');
        	} else {
            	storage = '&lt;' + DA.util.encode(storageUse) + '/' + DA.util.encode(storageQuota) + '&gt;' + DA.locale.GetText.t_('STORAGE_UNIT');
        	}
        }

        return storage;
    },

    _messages: function() {
        var messagesQuota = this.messagesQuota;
        var messagesUse   = this.messagesUse;
        var messages;

        if (!DA.util.isEmpty(messagesQuota) && !DA.util.isEmpty(messagesUse)) {
            messages = '&lt;' + DA.util.encode(messagesUse) + '/' + DA.util.encode(messagesQuota) + '&gt;' + DA.locale.GetText.t_('MESSAGE_UNIT');
        }

        return messages;
    },

    set: function(data) {
		if(data.quota !== null){
			this.storageQuota  = data.quota.storage;
			this.messagesQuota = data.quota.messages;
			this.storageUse    = data.use.storage;
			this.messagesUse   = data.use.messages;

			if (data.quota.limit.storage === 1 || data.quota.over.storage === 1) {
				this.storageOver = true;
			} else {
				this.storageOver = false;
			}

        	if (data.quota.limit.messages === 1 || data.quota.over.messages === 1) {
            	this.messagesOver = true;
        	} else {
            	this.messagesOver = false;
        	}
		}

    },

    view: function() {
        var storage  = this._storage();
        var messages = this._messages();

        if (!DA.util.isEmpty(storage)) {
            this.storageNode.innerHTML = storage;
            if (this.storageOver) {
                YAHOO.util.Dom.removeClass(this.storageNode, "quotaNormal");
                YAHOO.util.Dom.addClass(this.storageNode, "quotaWarn");
            } else {
                YAHOO.util.Dom.removeClass(this.storageNode, "quotaWarn");
                YAHOO.util.Dom.addClass(this.storageNode, "quotaNormal");
            }
        }
        if (!DA.util.isEmpty(messages)) {
            this.messagesNode.innerHTML = messages;
            if (this.messagesOver) {
                YAHOO.util.Dom.removeClass(this.messagesNode, "quotaNormal");
                YAHOO.util.Dom.addClass(this.messagesNode, "quotaWarn");
            } else {
                YAHOO.util.Dom.removeClass(this.messagesNode, "quotaWarn");
                YAHOO.util.Dom.addClass(this.messagesNode, "quotaNormal");
            }
        }

    }

};

/**
 * Builds a folder-tree's popup Menu.
 * @constructor
 * @param ftc  Instance of "DA.mailer.FolderTreeController"
 * @class FolderTreePopupMenu
 * @namespace DA.mailer
 */
DA.mailer.FolderTreePopupMenu = function(ftc){
    this.ftc       = ftc;
    this.treeData  = ftc.treeData;
    this.treeNode  = ftc.treeNode;
    this.popupNode = ftc.popupNode;
    this.init();
};

/**
 * Members
 */
DA.mailer.FolderTreePopupMenu.prototype = {

    ftc: null,

    /**
     * @property treeData
     * @description Tree Data.
     * @default null
     */
    treeData: null,

    treeNode: null,

    popupNode: null,

    /**
     * @property menuData
     * @description The object containing popup Menu-data.
     * @default null
     */
    menuData: null,

    /**
     * @property popupMenu
     * @description The object of popup menu.
     * @default null
     */
    poupuMenu: null,

    cfDialog: null,

    rfDialog: null,

    ifDialog: null,

    targetedFid: null,

    _id2fid: function(id) {
        if (id.match(/^da\_folderTreeDivId\_(\d+)$/)) {
            return parseInt(RegExp.$1, 10);
        } else {
            return null;
        }
    },

    /**
     * @method init
     * @description init popup menu.
     * @private
     */
    init: function(){
        var me = this;

        this.menuData = {
            order: [
                ['open', 'close'],
                ['trash'],
                ['create', 'delete', 'rename'],
                ['import', 'export'],
                ['filter'],
                ['rebuild']
            ],
            items: {
                open : {
                    text: DA.locale.GetText.t_("FOLDER_OPEN_MENU"),
                    onclick: function() {
                        me.ftc._open(me.targetedFid);
                    }
                },
                close: {
                    text: DA.locale.GetText.t_("FOLDER_CLOSE_MENU"),
                    onclick: function() {
                        me.ftc._close(me.targetedFid);
                    }
                },
                trash: {
                    text: DA.locale.GetText.t_("WASTE_TRASH_MENU", DA.locale.GetText.t_("TRASH")),
                    onclick: function() {
                        if (DA.util.confirm(DA.locale.GetText.t_('WASTE_TRASH_CONFIRM', me.ftc._name(me.targetedFid)))) {
                            me.ftc._trash(me.targetedFid);
                        }
                    }
                },
                create: {
                    text: DA.locale.GetText.t_("FOLDER_ADD_MENU"),
                    onclick: function(e) {
                        me.cfDialog.setString("");
                        me.cfDialog.show(e.clientX, e.clientY);
                    }
                },
                'delete': {
                    text: DA.locale.GetText.t_("FOLDER_DELETE_MENU"),
                    onclick: function() {
                        if (me.ftc._hasChildren(me.targetedFid)) {
                            if (DA.util.confirm(DA.locale.GetText.t_('FOLDER_DELETE_CONFIRM4PARENT',me.ftc._name(me.targetedFid)))) {
                                me.ftc._delete(me.targetedFid);
                            }
                        } else {
                            if (DA.util.confirm(DA.locale.GetText.t_('FOLDER_DELETE_CONFIRM',me.ftc._name(me.targetedFid)))) {
                                me.ftc._delete(me.targetedFid);
                            }
                        }
                    }
                },
                rename: {
                    text: DA.locale.GetText.t_("FOLDER_RENAME_MENU"),
                    onclick: function(e) {
                        me.rfDialog.setString(me.ftc._name(me.targetedFid));
                        me.rfDialog.show(e.clientX, e.clientY);
                    }
                },
                'import': {
                    text: DA.locale.GetText.t_("FOLDER_IMPORT_MENU"),
                    onclick: function(e) {
                        me.ifDialog.clear();
                        me.ifDialog.show(e.clientX, e.clientY);
                    }
                },
                'export': {
                    text: DA.locale.GetText.t_("FOLDER_EXPORT_MENU"),
                    onclick: function() {
                        me.ftc._export(me.targetedFid);
                    }
                },
                filter: {
                    text: DA.locale.GetText.t_("FOLDER_FILTER_MENU"),
                    onclick: function() {
                        me.ftc._filter(me.targetedFid);
                    }
                },
                rebuild: {
                    text: DA.locale.GetText.t_("FOLDER_REBUILD_MENU"),
                    onclick: function() {
                        if (DA.util.confirm(DA.locale.GetText.t_('FOLDER_REBUILD_CONFIRM'))) {
                            me.ftc._rebuild(me.targetedFid);
                        }
                    }
                }
            }
        };

        me.popupMenu = new DA.widget.ContextMenuController(
            "da_folderTreePopupMenu", me.treeNode.id, me.menuData, {
                onTrigger: function(e) {
                    //For finding the right click event in the div of INBOX
                    var target = YAHOO.util.Event.getTarget(e);
                    var srcElem = DA.dom.findParent(target, "DIV", 5);

                    if (!srcElem || !srcElem.id) {
                        return false;
                    }

                    var srcId = srcElem.id;

                    if (!srcId.match(/^da\_folderTreeDivId\_(\d+)$/)) {
                        return false;
                    }

                    if (me.ftc.existsLock()) {
                        return false;
                    }

                    me.cfDialog.hide();
                    me.rfDialog.hide();
                    me.ifDialog.hide();

                    var fid = me._id2fid(srcId);

                    if (DA.util.isNull(fid) || me.ftc._type(fid) === DA.vars.folderType.root) {
                        return false;
                    }

                    // TODO: Consider using some dispatcher pattern for blocks like this one.
                    if (me.ftc._openOk(fid)) {
                        me.popupMenu.enabled('open');
                    } else {
                        me.popupMenu.disabled('open');
                    }
                    if (me.ftc._closeOk(fid)) {
                        me.popupMenu.enabled('close');
                    } else {
                        me.popupMenu.disabled('close');
                    }
                    if (me.ftc._trashOk(fid)) {
                        me.popupMenu.text('trash', DA.locale.GetText.t_("WASTE_TRASH_MENU", me.ftc._name(fid)));
                        me.popupMenu.visible('trash');
                    } else {
                        me.popupMenu.hidden('trash');
                    }
                    if (me.ftc._createOk(fid)) {
                        me.popupMenu.enabled('create');
                    } else {
                        me.popupMenu.disabled('create');
                    }
                    if (me.ftc._deleteOk(fid)) {
                        me.popupMenu.enabled('delete');
                    } else {
                        me.popupMenu.disabled('delete');
                    }
                    if (me.ftc._renameOk(fid)) {
                        me.popupMenu.enabled('rename');
                    } else {
                        me.popupMenu.disabled('rename');
                    }
                    if (me.ftc._importOk(fid)) {
                        me.popupMenu.enabled('import');
                    } else {
                        me.popupMenu.disabled('import');
                    }
                    if (me.ftc._exportOk(fid)) {
                        me.popupMenu.enabled('export');
                    } else {
                        me.popupMenu.disabled('export');
                    }
                    if (me.ftc._filterOk(fid)) {
                        me.popupMenu.enabled('filter');
                    } else {
                        me.popupMenu.disabled('filter');
                    }
                    if (me.ftc._rebuildOk(fid)) {
                        me.popupMenu.enabled('rebuild');
                    } else {
                        me.popupMenu.disabled('rebuild');
                    }

                    me.targetedFid = fid;

                    return true;
                }
            }
        );

        //create a new folder dialog(hidden).
        this.cfDialog = new DA.widget.StringChangerDialog("da_createFolderDialog", DA.locale.GetText.t_("FOLDER_CREATE_DIALOG"), "", {
            onEnter: function() {
                var el = YAHOO.util.Dom.get(me.cfDialog.childId('text'));
                me.ftc._create(me.targetedFid, el.value, DA.vars.folderType['default']);
                return false;
            }
        });

        //rename folder dialog(hidden).
        this.rfDialog = new DA.widget.StringChangerDialog("da_renameFolderDialog", DA.locale.GetText.t_("FOLDER_RENAME_DIALOG"), "", {
            onEnter: function() {
                var el = YAHOO.util.Dom.get(me.rfDialog.childId('text'));
                me.ftc._rename(me.targetedFid, el.value);
                return false;
            }
        });

        //import folder dialog(hidden).
        this.ifDialog = new DA.mailer.widget.MailImportDialog("da_importFolderDialog", DA.locale.GetText.t_("FOLDER_IMPORT_DIALOG"), {
            onEnter: function() {
                var file = DA.dom.fileValue(me.ifDialog.childId('file'));
                var type = DA.dom.radioValue(me.ifDialog.childId('archive_type'));
                if (DA.util.isEmpty(file)) {
                    DA.util.warn(DA.locale.GetText.t_('IMPORT_PATH_EMPTY'));
                } else {
                    if (type === 'eml' && !file.match(/\.eml$/i) && !DA.util.confirm(DA.locale.GetText.t_('FOLDER_IMPORTEML_CONFIRM'))) {
                        return false;
                    }
                    me.ftc.importNode = YAHOO.util.Dom.get(me.ifDialog.childId('form'));
                    me.ftc._import(me.targetedFid);
                }
                return false;
            }
        });

    }

};

