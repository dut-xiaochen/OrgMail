/* $Id: mboxgrid.js 2484 2014-09-30 02:28:28Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/mboxgrid/mboxgrid.js $ */
/*for JSLINT undef checks*/
/*extern $ $H BrowserDetect DA Prototype Rico YAHOO Event */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.mailer || !DA.mailer.widget || !DA.widget || !DA.util) {
    throw "ERROR: missing DA.js or mailer.js"; // TODO: formalize/cleanup
}
if (!DA.widget.VirtualScrollingTable) {
    throw "ERROR: missing VirtualScrollingTable (virtual-scroll.js)";
}

if (!YAHOO || !YAHOO.util || !YAHOO.widget) {
    throw "ERROR: missing yahoo.js or treeview.js"; // TODO: formalize/cleanup
}

// TODO: formalize dependency checking scheme
if ( 'undefined' === typeof Rico || 
     'undefined' === typeof Rico.LiveGrid ||  
     'undefined' === typeof Rico.LiveGridBuffer ||
     'undefined' === typeof Rico.TableColumn) {
    // RICO not found, we cannot continue.
    throw "DEPENDENCY ERROR: RICO not found, we cannot continue";
}



/**
 * Wraps a LiveGrid (VirtualScrollingTable) widget with added functionality for 
 * viewing a listing of emails, in 2 modes:
 * <ol>
 *   <li> Folder Mode (when searchMode == true) </li>
 *   <li> Search Mode </li>
 * </ol>
 * @class MboxGrid
 * @module mailer.widget
 * @constructor
 * @params {Object} hash containing the following values:
 *                  containerElem - {HTMLElement} DOM element to place the grid in.
 *                  visibleRows   - {Int}         nummber of rows to display
 *                  folderId      - {Int}         folder ID
 *                  folderType    - {Int}         folder Type
 *                  searchMode    - {boolean}     if true, the grid displays search results
 *                  srid          - {Int}         ID of canned search results.
 *                  onLoading     - {function}    callback executed while network IO happens
 *                  onLoadDone    - {function}    callback executed after network IO is done
 *                  isUsingFakeTable - {boolean}  If true, enable the the Fake-table optimization:
 *                                                This will setup a structure of DIV elements formatted
 *                                                like a table, which greatly speeds up LiveGrid redrawing
 *                                                on IE. Default: True
 */
DA.mailer.widget.MboxGrid = function(params) {
    var _params = {
        visibleRows: 10,
        folderId: 0,
        folderType: 0,
        isUsingFakeTable: true
    };
    Object.extend(_params, params || {});
    if (_params.srid || _params.searchMode) {
        // searchmode
        this.setSearchMode();
    }
    this.isUsingFakeTable = _params.isUsingFakeTable;
    this.visibleRows = _params.visibleRows;
	if (_params.folderTreeController) {
        this.folderTreeController = _params.folderTreeController;
    }
    if ('function' === typeof _params.onLoading)  { this.onLoading  = _params.onLoading ; }
    if ('function' === typeof _params.onLoadDone) { this.onLoadDone = _params.onLoadDone; }
    if ('function' === typeof _params.onDeletePress) { this.onDeletePress = _params.onDeletePress; }

    // DA_DEBUG_START
    DA.log('INIT: START', 'time', 'MboxGrid');
    // DA_DEBUG_END

    this.init(_params);

    // DA_DEBUG_START
    DA.log('INIT: END', 'time', 'MboxGrid');
    // DA_DEBUG_END

};


DA.mailer.widget.MboxGrid.prototype = {

    /**
     * The grid can also be used to display search results; by default
     * this is not the case unless specified.
     * @property searchMode
     * @type {boolean}
     */
    searchMode: false,

    
    url: DA.vars.cgiRdir + "/ajx_ma_list.cgi",

    /**
     * Columns to display (default names are in English)
     * @property columns
     * @type {Array}
     */
    columns: [ 
        { key: 'subject', name: 'subject', width: "45%" },
        { key: 'from',    name: 'from',    width: "20%" },
        { key: 'to',      name: 'to',      width: "20%" },
        { key: 'date',    name: 'date',    width: "15%" }
    ],
    
    /**
     * From column index
     * @property fromColumnIndex
     * @type {Int}
     */
    fromColumnIndex: 1,

    /**
     * Date column index
     * @property dateColumnIndex
     * @type {Int}
     */
    dateColumnIndex: 1,

    /**
     * Size column index
     * @property sizeColumnIndex
     * @type {Int}
     */
    sizeColumnIndex: 1,
    
    /**
     * Folder ID
     * @property folderId
     * @type {Int}
     */
    folderId: 0,
    
    /**
     * Folder Type
     * @property folderType
     * @type {Int}
     */
    folderType: 0,
    
    /**
     * Folder tree controller
     */
    folderTreeController: null,
    
    /**
     * @property liveGrid
     * @type {Object} Instance of DA.widget.VirtualScrollingTable
     */
    liveGrid: null,
  
   
    /**
     * Message drag-and-drop proxy draggable.
     * @property _mdd
     * @private
     * @type {Object} Instance of DA.mailer.dd.MboxMail
     */
    _mdd: null,

    /**
     * Flag to indicate whether a message-drag operation is currently 
     * taking place. This is needed because deselection (on mouse-up) must be
     * disabled if we mouse-up after a drag.
     *
     * @property _isBeingDragged
     * @private 
     * @type {Boolean}
     */
    _isBeingDragged: false,

    /**
     * Search result page .
     * Move selected mail to other folder dialog
     *
     * @property SearchMoveFolderDialog
     * @private 
     * @type {Object} Instance of DA.widget.SearchMoveFolderDialog
     */
    searchMoveFolderDialog: null,

    /**
     * Stuff that one would rather not fill up the constructor with.
     */
    init: function(params, folderTreeData) {
        var me = this;
        var conf = DA.vars.config;
        me.folderTreeData = folderTreeData;
       
        // FIXME: data not instance-specific, yet declared per-instance
        var imageTitles = {
            attachment: "mailsort_attach.gif",
            flagged:    "mailsort_flag.gif",
            priority:   "mailsort_important.gif",
            seen:       "mailsort_mail.gif"
        };

        var imgDir = DA.vars.imgRdir + '/';

        // FIXME: code not instance-specific, yet declared per-instance
        function getTitleHtml(colName) {
            var img = imageTitles[colName];
            if (img) {
                return "<img src='" + imgDir + img + "'/>";
            } else {
                return DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_' + colName.toUpperCase());
            }
        }

        // Set the columns from the config, if the information is available
        var existsFrom = false;
        var existsDate = false;
        var existsSize = false;
        if (conf.list_order && conf.list_order.split) {
            this.columns = conf.list_order.split('|').map(function(colName, i){
                if (colName === 'from') {
                    me.fromColumnIndex = i;
                    existsFrom = true;
                }else if(colName === 'date') {
                     me.dateColumnIndex = i;
                     existsDate = true;
                }else if(colName === 'size') {
                    me.sizeColumnIndex = i;
                    existsSize = true;
                }
                
                return { 
                    // TODO: what if this returns undefined?
                    width: conf.list_width[colName],
                    name:  getTitleHtml(colName),
                    key:   colName
                }; 
            });
            this._percentify();
            
            if (!existsFrom) {
                me.fromColumnIndex = null;
            }
            if(!existsDate) {
                me.dateColumnIndex = null;
            }
            if(!existsSize) {
                me.sizeColumnIndex = null;
            }
        }

        if (!params.containerElem) { throw "MISSING ARG: containerElem" ; }
        this.containerElem = params.containerElem;

        this._initCustomEvents();
        this._setupSubscribers();
        this._messageMoverJobs = $H({}); // Initialize as empty (Prototype.js) hash

        
        if (this.searchMode) {
            this.loadSearchResults(params.totalMessages, params.fid, params.srid, params.type);
            me.searchMoveFolderDialog = new DA.widget.SearchMoveFolderDialog("da_searchMoveFolderDialog", 
                DA.locale.GetText.t_("SEARCH_MOVE_FOLDER_DIALOG_TITLE"), {
                onEnter: function() {
                    var moveToFid = document.getElementById("da_searchMoveToFid").value;
                    if (window.__messageSearcher.folderTreeData[moveToFid].move_m === 1) {
                        me.moveSelected( {fid:moveToFid} );
                        return true;
                    } else {
                        alert(DA.locale.GetText.t_("MESSAGE_MOVE_FOLDER_ERROR"));
                        return false;
                    }
                }
            });
        } else {
            this.changeFolder(params.folderId, params.folderType);
            // Drag-and-drop only for non-search mode
            this._mdd = new DA.mailer.dd.MboxMail(this.liveGrid.tableId);
            this._mdd.mboxGrid = this;

        }

        this.setupCSS();

        this._onLoadDoneJobs = [];

    },

    /**
     *
     * @method _initCustomEvents
     * @private
     */
    _initCustomEvents: function () {
        this.onFolderChanged = new YAHOO.util.CustomEvent("folderChanged");
        this.onDoubleClick   = new YAHOO.util.CustomEvent("onDoubleClick");
    },


    /**
    *  @add a reply icon the the mail which has been replied
    *  by hou for INSUITE2.3.0 
    *
    */
    _add_reply_flag: function(mmdata){
    
    	var temp_mmdata = this.liveGrid.buffer.findRowMetaData(function(r){ if((r.fid === mmdata.fid.toString())&&(r.uid === mmdata.uid.toString())){ return r;}});
    	if(DA.vars.system.no_replied_flag===0 && temp_mmdata.length === 1)
    	{
    		temp_mmdata[0].replied = "1";
    		temp_mmdata[0].forwarded = "0";
			this.setRowAppearance(temp_mmdata[0],["replied","forwarded"]);
    	}
    },

    /**
    *  @add a forward icon the the mail which has been replied
    *  by hou for INSUITE2.3.0 
    *
    */
	_add_forwarded_flag: function(mmdata){
	
		var temp_mmdata = this.liveGrid.buffer.findRowMetaData(function(r){if((r.fid === mmdata.fid.toString())&&(r.uid === mmdata.uid.toString())){ return r;} });
    	if(DA.vars.system.no_replied_flag===0 && temp_mmdata.length === 1)
    	{
    		temp_mmdata[0].replied = "0";
    		temp_mmdata[0].forwarded = "1";
			this.setRowAppearance(temp_mmdata[0],["replied","forwarded"]);
    	}
	},

    /**
     * @method _removeMessagesFromGrid
     * @param sJobId {String} id of the message-move job
     */
    _removeMessagesFromGrid: function (sJobId) {

        var oMsgColl = this._messageMoverJobs[sJobId];

        if (!oMsgColl) {
            // DA_DEBUG_START
            DA.log('Msg Mover Job: '+sJobId+' not found.', 'error', 'MboxGrid');
            // DA_DEBUG_END
            return;
        }

        var count = oMsgColl.count;

        // FIXME: What about this?
        // if (DA.util.cmpNumber(fid, target.fid)) { return; } ?

        if (count === 0) {
            // DA_DEBUG_START
            DA.log("moveSelected called, but nothing to move", "warn", "MboxGrid");
            // DA_DEBUG_END
            return;
        }

        var me = this;


        // START: update the ViewPort
        var lg = this.liveGrid;
        this._updateExceptionFilter();
        // Update the totalRows; we need to do this ourselves.
        var totalRows = lg.metaData.getTotalRows();
        totalRows -= count;
        lg.metaData.setTotalRows(totalRows);
        // And update the scroller's size.
        lg.scroller.updateSize();
      
        lg.viewPort.isPartialBlank = true; 
        // Remove the oMsgColl/specified messages from the buffer
        // using a filtering function
        var uidHash = {}; // FIXME: What a waste!
        oMsgColl.singles.each(function (mmdata) {
            uidHash[mmdata.fid+'_'+mmdata.uid] = true;
        });
        var shiftRanges = oMsgColl.ranges;
        var bufferChanged = lg.buffer.removeIf( function (bufferRow) {
            var mdata = bufferRow.meta;
            if (!mdata) { return false; }
            if (uidHash[mdata.fid+'_'+mdata.uid]) {
                return true;
            }
            if (shiftRanges.length < 1) {
                return false;
            }
            return me._checkShiftRanges(mdata, shiftRanges);
            
        });

        // If messages have been moved/deleted above the viewPort, try
        // to adjust the startPos to reflect that change
        var vpAdjusted = this._adjustViewPortStartPos(oMsgColl, lg);
        var bfAdjusted = this._adjustBufferStartPos(oMsgColl, lg);

        // This is needed to ensure that meta.sno's are all consistent
        this._repairBufferSeqNums(lg); 
  
        var scrolled = lg.scroller.moveScroll(lg.viewPort.lastRowPos);

        if (!scrolled) { // No change in scroll offset, so just redraw the current offset
            lg.requestContentRefresh(lg.viewPort.lastRowPos);
            lg.viewPort.refreshContents(lg.viewPort.lastRowPos);
        }
        // DONE: updated the ViewPort
    },


    /**
     * @property _utils
     * @type {Object}  a collection of utility methods.
     * @private
     */
    _utils: {
        /**
         * For the given message collection object, returns a new one which
         * does not contain SHIFT-key selection ranges.
         * @method removeShiftRanges
         * @param oMsgColl {Object} MessageCollection (hash with singles, ranges, count, etc)
         * @private
         */
        removeShiftRanges: function (oMsgColl) {
            // Make a copy of the given Message Collection
            var newMsgColl = {}.extend(oMsgColl);
            if (!newMsgColl.ranges.length) {
                // No ranges anyway; just return
                // DA_DEBUG_START
                DA.log('removeShiftRanges called needlessly.','warn', 'MboxGrid');
                debugger;
                // DA_DEBUG_END
                return newMsgColl;
            }
            newMsgColl.ranges.each(function (oSR) {
                newMsgColl.count -= oSR.count;
            });
            newMsgColl.ranges = [];
            return newMsgColl; 
        },

        /**
         * Returns a new array which is the result of concatenating a to l.
         * @method listConcat
         * @param l {Array}
         * @param a {Array}
         * @returns {Array}
         * @private
         */
        listConcat: function (l, a) {
            if (a && a.length) {
                return l.concat(a || []);
            } else {
                return l;
            }
        },

        /**
         * Utility function to pass the uid= parameter (ajx_ma_*)
         * @method asFidColonUid
         * @param mmdata {Object} mail meta-data (uid, fid, etc)
         * @returns {String} 'fid:uid'
         */
        asFidColonUid: function (mmdata) {
            return mmdata.fid + ':' + mmdata.uid;
        },

        /**
         * Utility function to pass the areas= parameter 
         * NOTE: This does not bother with any null-checks...
         * @method asFidColonUidRange
         * @param r {Object} shift-range (start, end, etc)
         * @returns {String} 'fid1:uid1-fid2:uid2'
         */
        asFidColonUidRange: function (r) {
            return r.start.fid + ":" + r.start.uid + "-" + r.end.fid + ":" + r.end.uid;
        },

        /**
         * FIXME: the mboxgrid parameter shows an underlying design ugliness...
         * @method mkMsgAcceptor
         * @param oMsgColl  {Object} singles, ranges, etc
         * @param oMboxGrid {Object} instance of an mboxgrid
         * @returns {Function} a function whose argument is a LiveGrid buffer row/row-meta-data
         *                       which returns a boolean.
         */
        mkMsgAcceptor: function (oMsgColl, oMboxGrid) {
          
            var shiftRanges = oMsgColl.ranges;
            var hash = $H({}); // FIXME: Need memoizing?
            oMsgColl.singles.each(function (m) {
                hash[m.fid + '_' + m.uid] = true;
            });

            // FIXME: Severe copy-paste!
            return function (mdata) {
                if (!mdata) { return false; }
                mdata = mdata.meta || mdata; // FIXME: This works only for Fake-table
                if (hash[mdata.fid + '_' + mdata.uid]) {  
                    return true;
                }
                if (shiftRanges.length < 1) {
                    return false;
                }
                if (!oMboxGrid) { return false; }
                // FIXME: Ugly use of _checkShiftRanges
                return oMboxGrid._checkShiftRanges(mdata, shiftRanges);
             
            };
        },

        /**
         * For the given mail-meta-data, returns a string that can be used as the
         * CSS className of the LiveGrid row for the mail. It is usually of the form
         * 'a1 s0 t1 p3 do f1' (meaning it has an attachment (a1), it is unseen (s0),
         * has normal priority (p3), and so on).
         * @method  mkCSSClassNameForRow
         * @param   oMMData {Object}
         * @returns {String}
         */ 
        mkCSSClassNameForRow: function (oMMData) {
            return ['seen', 'flagged', 'attachment', 
                    'priority', 'toself', 'deleted','replied','forwarded'].map(
                function (prop) {
                    var value = oMMData[prop];
                    if (!value) { return ''; /*Better '' than undefined*/ }
                    var c; 
                    if(prop === "forwarded")
                    { c='w';}
                    else
                    {c = prop.charAt(0);}
                    return c + value;
                }
            ).join(' ');
        },

        /**
         * FIXME: This should be in a more common location?
         * @property yes
         * @type {Function}
         * @returns {Boolean} always returns TRUE
         */
        yes: function () {
            return true;
        }
    
    },

    /**
     * Refreshes the contents of the grid (from the network) without
     * disturbing the current scroll offset or blanking the viewport.
     * Use this when a smooth redraw is needed, and loss of scroll
     * position and selection information is undesirable,
     * @method refreshGrid
     * FIXME: This ought to be in VirtualScrollingTable?
     * FIXME: refreshGrid is not the best name?
     */
    refreshGrid: function () {
        var lg = this.liveGrid;
        var currentPos = lg.viewPort.lastRowPos;
        lg.buffer.removeIf( this._utils.yes );
        lg.viewPort.isPartialBlank = true;
        lg.requestContentRefresh(currentPos);
    },


    /**
     * init-time method that setups up subscribers for all the (YUI) CustomEvents
     * (usually under DA.mailer.Events.*) that we are interested in.
     * @method _setupSubscribers
     * @private
     */
    _setupSubscribers: function () {
        var E = DA.mailer.Events;
        if (!E) {
             // DA_DEBUG_START
             DA.log('No Custom Events!', 'error', 'mailer/app');
             debugger;
             // DA_DEBUG_END
             return;
        }

   
        function mkHndlr (f) {
            return function (type, args) {
                var _, jobId;
                if (!args || !(jobId = args[0]) || !(_ = args[1]) ||
                    !(_.target && _.messages)) {  
                    // DA_DEBUG_START
                    DA.log('Bad args to Event: '+type, 'error', 'mailer/app');
                    debugger;
                    // DA_DEBUG_END
                    return;
                }

                // FIXME: We need a "don't bother" check; if the fids are totally off, for one
                
                var response = args[2];

                var incoming = false;

                if (parseInt(_.target.fid, 10) === this.folderId) {
                    // moving stuff *INTO* us!
                    incoming = true;
                }
                
                // Was this from us?
                var ours = DA.util.areEquivObjs(_.messages.identity, this._getIdentity());

                var unresolvedRanges = (!ours) && _.messages.ranges.length;

                f.call(this, incoming, unresolvedRanges, jobId, _.messages, _.target, response);

            };  
        }

        // function references for all the event handlers we are interested in
        var hndlMoving, hndlMoved, hndlMoveFailure;

        E.onMessagesMoving.subscribe( hndlMoving = mkHndlr ( 
            function (bIncoming, hasUnresolvedRanges, sJobId, oMsgColl, oTarget) {
                if (bIncoming) { return; /*We don't do incoming mode*/ }
                // Use a range-less copy of the Message Collection, if it contains
                // unresolvable ranges
                var msgColl = hasUnresolvedRanges ? 
                        this._utils.removeShiftRanges(oMsgColl) : 
                        oMsgColl;
                // Enqueue a move-message job:
            	if(oMsgColl.singles.length ===1)
            	{      
                	if(oMsgColl.single.mode === 1)
                	{

                    	this._add_reply_flag({fid:oMsgColl.single.fid,uid:oMsgColl.single.originuid});		
                	}
                	else if(oMsgColl.single.mode === 2)
                	{
                		this._add_forwarded_flag({fid:oMsgColl.single.fid,uid:oMsgColl.single.originuid});
                	}
					else {}                
				}
                this._messageMoverJobs[sJobId] = msgColl;
                this._removeMessagesFromGrid(sJobId);
            }), 
        this, true);

        E.onMessagesMoved.subscribe( hndlMoved = mkHndlr (
            function (bIncoming, hasUnresolvedRanges, sJobId, oMessages, oTarget, oResponse) {
                if (bIncoming) {
                    this.refreshGrid();
                    // Nothing else we can do about incoming mode... 
                    return;
                }
                delete this._messageMoverJobs[sJobId];
                if (hasUnresolvedRanges) {
                    // No choice but to refresh...
                    this.refreshGrid();
                }
                if (this._messageMoverJobs.entries().length === 0) {
                    this._updateExceptionFilter();
                } 
            }), 
        this, true);

        E.onMessagesMoveFailure.subscribe( hndlMoveFailure = mkHndlr (
            function (bIncoming, hasUnresolvedRanges, sJobId) {
                delete this._messageMoverJobs[sJobId];
                this._updateExceptionFilter();
            }), 
        this, true);

        

        /* **********************************************************************************
         * Now for the toggle-related events (flagged, seen, etc)
         */
        function mkFlagHndlr (f) {
            return function (type, args) {
                var _, jobId;
                if (!args || !(jobId = args[0]) || !(_ = args[1]) ||
                    !(_.property && _.messages)) {  
                    // DA_DEBUG_START
                    DA.log('Bad args to Event: '+type, 'error', 'mailer/app');
                    debugger;
                    // DA_DEBUG_END
                    return;
                }
                // FIXME: We need a "don't bother" check; if the fids are totally off, for one

                var response = args[2];
                var state = _.state !== false; // Be optimistic

                // Was this from us?
                var ours = DA.util.areEquivObjs(_.messages.identity, this._getIdentity());
                var unresolvedRanges = (!ours) && _.messages.ranges.length;

                f.call(this, unresolvedRanges, jobId, _.messages, _.property, state, response);
            };  
        }
       
        // A mapping of ID -> command object
        var togglerJobs = $H({});
        // References to our subscribers (handlers)
        var hndlFlagging, hndlFlagged, hndlFlagFailure;

        E.onMessagesFlagging.subscribe( hndlFlagging = mkFlagHndlr (
            function ( hasUnresolvedRanges, sJobId, oMsgColl, sProp, bState, oResp) {
                // Use a range-less copy of the Message Collection, if it contains
                // unresolvable ranges
                var msgColl = hasUnresolvedRanges ? 
                        this._utils.removeShiftRanges(oMsgColl) : 
                        oMsgColl;
                var me = this;
                // List of affected Grid-row meta-data
                var affectedRowMetaData = this.liveGrid.buffer.
                        findRowMetaData(this._utils.mkMsgAcceptor(oMsgColl, me));
                // Undo information
                var undos = affectedRowMetaData.map( function (md) {
                    var preToggle = md[sProp];
                    var preToggleCn = md.className;
                    // Set the value here...
                    md[sProp] = bState ? '1' : '0';
                    me.setRowAppearance(md, [sProp]); // FIXME: slow: calling setRowAppearance too many times.
                    return { property:  preToggle,
                             className: preToggleCn,
                             mmdata:    md };
                });
                // Enqueue a toggling job:
                togglerJobs[sJobId] = {
                    // Function to rollback the UI and any state saved in the buffer's row meta-data
                    undo: function () {
                        undos.each( function (undo) { // FIXME: Looks slow
                            var mmdata = undo.mmdata;
                            mmdata[sProp] = undo.property;
                            mmdata.className = undo.className;
                            // No second parameter; we have a copy of the original className
                            // so we need not pass in the list of properties to change
                            me.setRowAppearance(mmdata);
                        });
                        // TODO: warn the user that something failed here.
                    }
                };
            }),        
        this, true );

        E.onMessagesFlagged.subscribe( hndlFlagged = mkFlagHndlr(
            function ( hasUnresolvedRanges, sJobId, oMsgColl, sProp, bState, oResp) {
                if (hasUnresolvedRanges) {
                    // Nothing else that we can do?
                    this.refreshGrid();
                }
                delete togglerJobs[sJobId];
            }),
        this, true);
        
        E.onMessagesFlagFailure.subscribe( hndlFlagFailure = mkFlagHndlr(
            function ( hasUnresolvedRanges, sJobId, oMsgColl, sProp, bState, oResp) {
                var job = togglerJobs[sJobId];
                if (!job) { 
                    // DA_DEBUG_START
                    debugger; /*weird?*/
                    // DA_DEBUG_END
                    return;
                }
                job.undo();
                delete togglerJobs[sJobId];
            }),        
        this, true );

        var hndlRead;
        E.onMessageRead.subscribe( hndlRead = function (type, args) {
            var mmdata = args[0];
            if (!mmdata || !mmdata.uid) {
                // DA_DEBUG_START
                DA.log("Bad args to onMessageRead", 'error', 'MboxGrid');
                debugger;
                // DA_DEBUG_END
                return;
            }
            if (!DA.util.cmpNumber(mmdata.fid, this.folderId) &&
                !DA.util.cmpNumber(mmdata.srid, this._getIdentity().srid)) {
                return; // Not our problem
            }
            var tr = this.findRowByMMData(mmdata);
            if (!tr) { return; /*Not our problem*/ }
            var md = tr.__daGridRowMetaData;
            if (!md) { // very, very strange!
                // DA_DEBUG_START
                debugger;
                // DA_DEBUG_END
                return;
            }
            md.seen = '1';
            this.setRowAppearance(md, ['seen'], tr);
        }, this, true);

       
        // Making sure we remove all installed subscribers
        YAHOO.util.Event.on(window, 'unload', function() {
            // move, delete
            E.onMessagesMoving.unsubscribe(hndlMoving, this);
            E.onMessagesMoved.unsubscribe(hndlMoved, this);
            E.onMessagesMoveFailure.unsubscribe(hndlMoveFailure, this);
            // flag
            E.onMessagesFlagging.unsubscribe(hndlFlagging, this);
            E.onMessagesFlagged.unsubscribe(hndlFlagged, this);
            E.onMessagesFlagFailure.unsubscribe(hndlFlagFailure, this);
            // message read
            E.onMessageRead.unsubscribe(hndlRead, this);
        }, this, true);

    },


    /**
     * @method _getIdentity
     * @returns {Hash} an object which represents the data set that this
     *                 MboxGrid instance is currently viewing
     */
    _getIdentity: function () {
        var identity = this.liveGrid.getParameters();
        delete identity.except;
        identity.isaMboxGrid = true;
        return identity;
    },


    /**
     * Performs all CSS settings that can be done only at load time.
     * For now, this only adds the CSS required to correctly display
     * mails addressed directly to the recipient (to_self). This
     * needs to read the color value off of DA.vars.config.toself_color
     * @method setupCSS
     */
    setupCSS: function() {
        // CSS selector and Rule for styling to_self rows
        var selector = this.isUsingFakeTable ? 
                "div#" + this.liveGrid.tableId + " div.t1" :
                "table#" + this.liveGrid.tableId + " tr.t1" ;
        var ruleText = "color:" + DA.vars.config.toself_color;
        DA.dom.createCSSRule(selector, ruleText);
    },


    /**
     * Initialize a single instance of a Context-menu.
     * @method _setupContextMenu
     * @private
     */
    _setupContextMenu: function() {
        // TODO: need to review whether at all an id needs to be 
        //       a parameter for ContextMenuController 
        
        // Alias to DA.locale.GetText.t_
        var t_ =  DA.locale.GetText.t_;
        var t = function(key){
            return t_("MBOXGRID_ROWCONTEXTMENU_" + key);
        };

        // Utility function to pass the uid= parameter (ajx_ma_*)
        var asFidColonUid      = this._utils.asFidColonUid;
        // and the area= parameter 
        var asFidColonUidRange = this._utils.asFidColonUidRange;

        var MEvts = DA.mailer.Events; // MEvts -> Mailer Events
        var me = this;

        var togglerIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_flag.cgi' );
        // DA_DEBUG_START
        togglerIO.method = 'get';
        // DA_DEBUG_END

        // Setup th JSON-IO object for Export, and also it's callback and errorHandler
        var exportIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
        // DA_DEBUG_START
        exportIO.method = 'get';
        // DA_DEBUG_END
        exportIO.errorHandler = function(e) {
            DA.util.warn(DA.locale.GetText.t_("EXPORT_ERROR"));
            DA.waiting.hide();
        };
        exportIO.callback = function(o) {
            var url,Proc;
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
            DA.waiting.hide();
        };
        
        // Setup th JSON-IO object for Export, and also it's callback and errorHandler
        var saveToLibIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
        // DA_DEBUG_START
        saveToLibIO.method = 'get';
        // DA_DEBUG_END
        saveToLibIO.errorHandler = function(e) {
            DA.util.warn(DA.locale.GetText.t_("SAVE_TO_LIB_ERROR"));
            DA.waiting.hide();
        };
        saveToLibIO.callback = function(o) {
            var url;
            var Img  = 'pop_title_attachsave.gif';
            if (!DA.util.isEmpty(o.file)) {
                url = "lib_foldersel.cgi%3fcall=ma_detail%20path=" + o.file + "%20name=" + o.file_name + "%20is_for_save_mail=true";
                DA.windowController.isePopup(url, Img, 400, 550, DA.mailer.util.getMailAccount(), false);
            } else {
                DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
            }
            DA.waiting.hide();
        };

        // Setup th JSON-IO object for Filter, and also it's callback and errorHandler
        var filterIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_filter.cgi' );
        // DA_DEBUG_START
        filterIO.method = 'get';
        // DA_DEBUG_END
        filterIO.errorHandler = function(e, actualArgs /*Reference to the original args to execute*/) {
            DA.util.warn(DA.locale.GetText.t_("FILTER_ERROR"));
            // Fire our Custom Event
            MEvts.onMessagesFilterFailure.fire({
                srcFid: actualArgs.fid
            });
            DA.waiting.hide();
        };
        filterIO.callback = function(o, actualArgs/*Reference to the original args to execute*/) {
            if (DA.mailer.util.checkResult(o)) {
                // Fire our Custom Event
                MEvts.onMessagesFiltered.fire({
                    srcFid:   actualArgs.fid,
                    response: o
                });
            }
            DA.waiting.hide();
        };

        // Setup th JSON-IO object for multipart/partial, and also it's callback and errorHandler
        var joinIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
        // DA_DEBUG_START
        joinIO.method = 'get';
        // DA_DEBUG_END
        joinIO.errorHandler = function(e, actualArgs /*Reference to the original args to execute*/) {
            DA.util.warn(DA.locale.GetText.t_("JOIN_ERROR"));
            DA.waiting.hide();
        };
        joinIO.callback = function(o, actualArgs/*Reference to the original args to execute*/) {
            if (DA.mailer.util.checkResult(o)) {
                DA.mailer.windowController.viewerOpen(o.fid, o.uid);
            }
            DA.waiting.hide();
        };

        function toggleAllOn(selection, prop, isOff) {
            MEvts.onMessageFlagRequest.fire({
                messages: selection,
                property: prop,
                state:    isOff !== true
            });
        }

        function toggleAllOff(selection, prop) {
            return toggleAllOn(selection, prop, true);
        }

        function _mkIsSet_str(prop) {
            return function(mmdata) {
                return mmdata && mmdata[prop] && mmdata[prop].charAt(0) === '1';
            };
        }

        function _mkIsSet_int(prop) {
            return function(mmdata) {
                return mmdata && mmdata[prop] && mmdata[prop] === 1;
            };
        }
        
        function _mkIsSet_coerce(prop) {
            return function(mmdata) {
                var v;
                return mmdata && (v = mmdata[prop]) &&
                       (v === 1 || 
                        (v.charAt && v.charAt(0) === '1'));
            };
        }

        function printMail(selection) {
            var mmdata = me.getSelected().single;
            DA.windowController.winOpen(DA.vars.cgiRdir + '/ma_ajx_print.cgi?fid=' + selection.fid + '&uid=' + mmdata.uid , '', 710, 600);
        }

        function showMoveFolderDialog(x, y) {
            window.__mboxGrid.searchMoveFolderDialog.show(x, y);
        }

        /**
         * @function checkAll
         * @param selection {Object}  Object containing count, single,singles and/or ranges properties
         *                            (similar to the return value of getSelected)
         * @param f {Function} code to wrap. 
         */
        function checkAll(selection, f) {
            
            if (!selection || !selection.count || selection.count < 1) { return { none: true } ; }

            if (selection.count === 1) {
                if (selection.single && f(selection.single)) {
                    return { all: true };
                } else {
                    return { none: true };
                }
            }

            if (selection.ranges && selection.ranges.length > 0) {
                // Shift! stop trying to be very clever;
                return { some: true };
            }

            if (!selection.singles || selection.singles.length === 0 ) { return { none: true } ; }

            var falses = 0;
            var trues  = 0;

            var arr = selection.singles;

            arr.each(function (a) {
                if (f(a)) { ++trues; } else { ++falses; }
            });

            return arr.length === trues ? { all: true } :
                    arr.length === falses ? { none: true } : { some: true };
                    
        }

        var isFlagged = _mkIsSet_coerce("flagged");
        var isRead    = _mkIsSet_coerce("seen");

        // Wrapper to enable code reuse
        var mkSingleSelectHndlr = function (f) {
            return function (e, args) {
                var mmdata = me.getSelected().single; // REF: want single
                if (!mmdata) {
                    // DA_DEBUG_START
                    DA.log("No single message selected:", "error", 'MboxGrid');
                    // DA_DEBUG_END
                    return;
                }
                return f(mmdata);
            };
        };

        // Wrapper to enable code reuse
        var mkMultiSelectHndlr = function (f) {
            return function(e, args) {
                var selection = me.getSelected();
                if (!selection || !selection.count) { return; }
                var singles = selection.singles ? selection.singles : 
                        selection.single ? [ selection.single ] : []; 
                
                var ranges = selection.ranges;
                ranges = (ranges && ranges.map) ? ranges : [];

                var fid  = selection.fid;
                var uidJobs = singles.map(asFidColonUid);
                var rangeJobs = ranges.map(asFidColonUidRange);

                return f(fid, uidJobs, rangeJobs);
            };
        };

        /*
         * Finally, creare rge ContextMenuController object. It will use a lot
         * of closures for it's onclicks, or functions generated by the functions
         * defined above (mkSingleSelectHndlr, mkMultiSelectHndlr, etc)
         */
        var contextMenu = new DA.widget.ContextMenuController(
            "da_mboxGridContextMenu", 
            this.liveGrid.tableId,
            {
                order: [
                   [ 'open' ],
                   [ 'reply', 'replyall', 'forward' ],
                   [ 'delete' ],
                   [ 'print' ],
                   [ 'markasread', 'markasunread', 'flag', 'unflag' ],
                   [ 'export', 'savetolib' , 'filter', 'join' , 'movefolder']
                ],
                items: {
                    open: {
                        text:    t('OPEN'),
                        onclick: mkSingleSelectHndlr(function(mmdata){
                            if (DA.util.cmpNumber(mmdata.open_m, 2)) {
                                if (DA.mailer.util.isBackupFolder(mmdata.type)) {   
                                    DA.mailer.windowController.editorOpenBackUp('edit', mmdata.fid, mmdata.uid, mmdata.backup_maid, mmdata.backup_org_clrRdir);
                                }else {
                                    DA.mailer.windowController.editorOpen('edit', mmdata.fid, mmdata.uid);
                                }
                            } else {
                                DA.mailer.windowController.viewerOpen(mmdata.fid, mmdata.uid, mmdata.srid);
                            }
                        })
                    },
                    reply: {
                        text:    t("REPLY"),
                        onclick: mkSingleSelectHndlr(function(mmdata){
                            DA.mailer.windowController.editorOpen('reply', mmdata.fid, mmdata.uid);
                        })
                    },
                    replyall: {
                        text:    t("REPLYALL"),
                        onclick: mkSingleSelectHndlr(function(mmdata){
                            DA.mailer.windowController.editorOpen('all_reply', mmdata.fid, mmdata.uid);
                        })
                    },
                    forward: {
                        text:    t("FORWARD"),
                        onclick: mkSingleSelectHndlr(function(mmdata){
                            DA.mailer.windowController.editorOpen('forward', mmdata.fid, mmdata.uid);
                        })
                    },
                    markasread: {
                        text:    t("MARKASREAD"), // toggles with MARKASUNREAD
                        onclick: function (e, args) {
                            toggleAllOn(me.getSelected(), 'seen');
                        }
                    },
                    markasunread: {
                        text:    t("MARKASUNREAD"), // toggles with MARKASUNREAD
                        onclick: function (e, args) {
                            toggleAllOff(me.getSelected(), 'seen');
                        }
                    },
                    flag: { // 'flag', the verb
                        text:    t("SETMARK"), // toggles with UNSETMARK
                        onclick: function (e, args) {
                            toggleAllOn(me.getSelected(), 'flagged');
                        }
                    },
                    unflag: { // 'un-flag', the verb
                        text:    t("UNSETMARK"), // toggles with UNSETMARK
                        onclick: function (e, args) {
                            toggleAllOff(me.getSelected(), 'flagged');
                        }
                    },
                    'export': {
                        text:    t("EXPORT"),
                        onclick: mkMultiSelectHndlr(function(fid, uidJobs, rangeJobs) {
                            DA.waiting.show(DA.locale.GetText.t_("EXPORT_OPERATING_PROMPT"));
                            exportIO.execute({
                                fid:  fid,
                                uid:  uidJobs.join(","),
                                area: rangeJobs.join(","),
                                archive: "1",
                                proc: "export"
                            });
                        })
                    },
                    savetolib: {
                        text:    t("SAVETOLIB"),
                        onclick: mkMultiSelectHndlr(function(fid, uidJobs, rangeJobs) {
                            DA.waiting.show(DA.locale.GetText.t_("SAVETOLIB_OPERATING_PROMPT"));
                            saveToLibIO.execute({
                                fid:  fid,
                                uid:  uidJobs.join(","),
                                area: rangeJobs.join(","),
                                archive: "1",
                                proc: "save_to_lib"
                            });
                        })
                    },
                    movefolder: {
                        text:    t("MOVEFOLDER"),
                        onclick: function (e, args) {
                            showMoveFolderDialog(e.clientX, e.clientY);
                        }
                    },
                    print: {
                        text:    t("PRINT"),
                        onclick: function (e, args) {
                            printMail(me.getSelected());
                        }
                    },
                    filter:   {
                        text:    t("RUNFILTER"),
                        onclick: mkMultiSelectHndlr(function(fid, uidJobs, rangeJobs) {
                            DA.waiting.show(DA.locale.GetText.t_("FILTER_OPERATING_PROMPT"));
                            MEvts.onMessagesFiltering.fire({ srcFid: parseInt(fid, 10) });
                            filterIO.execute({
                                fid:  fid,
                                uid:  uidJobs.join(","),
                                area: rangeJobs.join(","),
                                proc: "submit"
                            });
                        })
                    },
                    join:   {
                        text:    t("JOIN"),
                        onclick: mkMultiSelectHndlr(function(fid, uidJobs, rangeJobs) {
                            DA.waiting.show(DA.locale.GetText.t_("JOIN_OPERATING_PROMPT"));
                            joinIO.execute({
                                fid:  fid,
                                uid:  uidJobs.join(","),
                                area: rangeJobs.join(","),
                                proc: "join"
                            });
                        })
                    },
                    'delete': {
                        text:    t("DELETE"),
                        onclick: function(e, args) {
                            me.deleteSelected();
                        } 
                    }
                }
            },
            {
                onTrigger: function(e) { 
                    var row = me._getRowFromEvent(e);
                    if (!row) { /*TODO*/ return false; }
                    var rowMetaData = row.__daGridRowMetaData;

                    if (!rowMetaData || !rowMetaData.uid /*need at least a uid*/) {
                        return false; // No context for a context menu!
                    }

                    // Is the right-clicked row already selected?
                    if (!me.liveGrid.isSelected(rowMetaData)) {
                        // right-clicked on an unselected row; so we need to exclusively 
                        // select it first
                        me.setSelected(row, true /*select this row, unselecting all others*/, true);
                        me._lastClickedRowMetaData = rowMetaData; // This becomes the latest clicked row
                        me._lastClickedRow4RightButton = row;
                    }
                    var selected = me.getSelected();

                    if (!selected || !selected.count) { // If that fails, then too bad
                        // DA_DEBUG_START
                        DA.log('Right-click select onTrigger (ContextMenu) failed', 'warn', 'MboxGrid');
                        // DA_DEBUG_END
                        return false;
                    }

                    // TODO: Think of a nice way to further modularize the 2 if-blocks below?

                    var visibles   = [];
                    var hiddens    = [];
                    var allRead    = checkAll(selected, isRead);
                    var allFlagged = checkAll(selected, isFlagged);
                    
                    if (selected.count > 1) { // stay in multi-select mode only if the context row is one of the selected
                        // TODO: refactor to "hide"
                        if (DA.mailer.util.isLocalFolder(rowMetaData.type) || DA.mailer.util.isBackupFolder(rowMetaData.type)) {
                            hiddens.push('open');
                            hiddens.push('reply');
                            hiddens.push('replyall');
                            hiddens.push('forward');
                            hiddens.push('export');
                            hiddens.push('filter');
                            hiddens.push('join');
                            hiddens.push('print');
                            hiddens.push('savetolib');
                            if (me.searchMode) {
                                visibles.push('movefolder');
                            } else {
                                hiddens.push('movefolder');
                            }
                            visibles.push('delete');
                        } else {
                            hiddens.push('open');
                            hiddens.push('reply');
                            hiddens.push('replyall');
                            hiddens.push('forward');
                            hiddens.push('print');
                            hiddens.push('savetolib');
                            if (me.searchMode) {
                                visibles.push('movefolder');
                            } else {
                                hiddens.push('movefolder');
                            }
                            visibles.push('export');
                            visibles.push('filter');
                            visibles.push('delete');
                            visibles.push('join');
                        }
                    } else {
                        if (DA.mailer.util.isLocalFolder(rowMetaData.type) || DA.mailer.util.isBackupFolder(rowMetaData.type)) {
                            hiddens.push('reply');
                            hiddens.push('replyall');
                            hiddens.push('forward');
                            hiddens.push('export');
                            hiddens.push('filter');
                            hiddens.push('join');
                            visibles.push('open');
                            visibles.push('delete');
                            visibles.push('print');
                            if (me.searchMode) {
                                visibles.push('movefolder');
                            } else {
                                hiddens.push('movefolder');
                            }
                            if ( DA.vars.config.save_to_lib ) {
                                visibles.push('savetolib');
                            } else {
                                hiddens.push('savetolib');
                            }
                        } else {
                            visibles.push('open');
                            visibles.push('reply');
                            visibles.push('replyall');
                            visibles.push('forward');
                            visibles.push('export');
                            if (me.searchMode) {
                                visibles.push('movefolder');
                            } else {
                                hiddens.push('movefolder');
                            }
                            if (me.searchMode) {
                                hiddens.push('filter');
                            } else {
                                visibles.push('filter');
                            }
                            hiddens.push('join');
                            visibles.push('delete');
                            visibles.push('print');
                            if ( DA.vars.config.save_to_lib ) {
                                visibles.push('savetolib');
                            } else {
                                hiddens.push('savetolib');
                            }
                        }
                    }
                    
                    if (DA.mailer.util.isLocalFolder(rowMetaData.type) ||
                        DA.mailer.util.isDraft(rowMetaData.type) ||
                        DA.mailer.util.isSent(rowMetaData.type)|| DA.mailer.util.isBackupFolder(rowMetaData.type)) {
                        hiddens.push('markasunread');
                        hiddens.push('markasread');
                    } else {
                        if (allRead.all) {
                            // All are read; show only the mark-as-unread option
                            hiddens.push('markasread');
                            visibles.push('markasunread');
                        } else if (allRead.none) {
                            // None are read; show only the mark-as-read option
                            hiddens.push('markasunread');
                            visibles.push('markasread');
                        } else {
                            // mixed; show both the options (mark-as-read, mark-as-unread)
                            visibles.push('markasunread');
                            visibles.push('markasread');
                        }
                    }
                    
                    if (DA.mailer.util.isLocalFolder(rowMetaData.type) || DA.mailer.util.isBackupFolder(rowMetaData.type)) {
                        hiddens.push('unflag');
                        hiddens.push('flag');
                    } else {
                        if (allFlagged.all) {
                            // All are flagged; show only the unflag option
                            hiddens.push('flag');
                            visibles.push('unflag');
                        } else if (allFlagged.none) {
                            // All are unflagged; show only the flag option
                            hiddens.push('unflag');
                            visibles.push('flag');
                        } else {
                            // mixed; show both options
                            visibles.push('unflag');
                            visibles.push('flag');
                        }
                    }

		    DA.customEvent.fire("mboxGridSetupContextMenuOnTriggerAfter", this, {
			meta: rowMetaData,
			hiddens: hiddens,
			visibles: visibles,
			selected: selected
		    });
                    
                    hiddens.each(this.hidden.bind(this));
                    visibles.each(this.visible.bind(this));
                    
                    // disable the mouse scroll for a bit
                    me.liveGrid.scroller.disableMouseScroll();
                    return true; // If we made it here, all is OK; display the menu
                },
                onCancel: function() {
                    if (me._lastClickedRow4RightButton) {
                        me.setUnSelected(me._lastClickedRow4RightButton);
                    }
                    me.liveGrid.scroller.enableMouseScroll();
                }
            }
        );

    },


    /**
     * TODO: This ought to be in VirtualScrollingTable; it's general, no?
     * Destructively converts the columns property's widths to percentages
     * instead of pixels.
     * @method _percentify
     * @private
     */
    _percentify: function() {
        var widths = this.columns.pluck('width');
        if (widths.grep('%').first()) {
            return; // WHOA! already in percentage. out!
        }
        var percs = DA.util.toPercentages(widths);

        // FIXME: This should probably use something like _fairPercentages (tables.js)
        percs = percs.map(Math.floor);

        this.columns.each(function(col, index){
            // FIXME: 0-rounded-to-1 hack
            col.width = Math.max(1,percs[index]) + '%';
        });
    },


    /**
     * Connect the Grid to the given IMAP folder (by id).
     * This initializes the LiveGrid object if not yet created.
     * @method changeFolder
     * @param id {Int} Folder ID (IMAP folder to switch to)
     */
    changeFolder: function(id, type) {
        if (id) {
            id = parseInt(id, 10);
        } else {
            id = 0;
        }
        var sameFolder = id === this.folderId;
        this.folderId   = id; // TODO: needed?
        this.folderType = type;
        this.setFolderMode();
        if (!sameFolder && this.liveGrid) {
            this.liveGrid.removeColumnSort();
        }
        this._lazyCreate({fid: id, search_field: '', search_word: ''}, (!sameFolder) /*Perform a param reset only if the folder has changed*/ );
        if (!sameFolder) {
            this.onFolderChanged.fire({
                fid:  id,
                type: type
            });
            if (this.fromColumnIndex) {
                if (DA.mailer.util.isDraft(type) || DA.mailer.util.isSent(type) || DA.mailer.util.isLocalFolder(type) || DA.mailer.util.isBackupFolder(type) ) {
                    this.liveGrid.setColumnTitle(this.fromColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_TO'));
                }else {
                    this.liveGrid.setColumnTitle(this.fromColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_FROM'));
                }
            }
            if(this.dateColumnIndex) {
                if(DA.mailer.util.isBackupFolder(type)) {
                    this.liveGrid.setColumnTitle(this.dateColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_BACKUP_DATE'));
                }else {
                    this.liveGrid.setColumnTitle(this.dateColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_DATE'));
                }
            }
            if(this.sizeColumnIndex) {
                if(DA.mailer.util.isBackupFolder(type) || DA.mailer.util.isLocalFolder(type)) {
                    this.liveGrid.setColumnTitle(this.sizeColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_BACKUP_SIZE'));
                }else {
                    this.liveGrid.setColumnTitle(this.sizeColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_SIZE'));
                }
            }
        } 
    },

    
    clear: function() {
        this.folderId = 0;
        this.liveGrid.clear();
    },


    /**
     * @property onFolderChanged
     * @type  {Object} instance of YAHOO.util.CustomEvent
     * @param arg {Object} hash, with property fid
     */
    onFolderChanged: null,


    /**
     * @property onDoubleClick
     * @type  {Object} instance of YAHOO.util.CustomEvent
     * @param arg {Object} mail meta-data.
     */
    onDoubleClick:   null,

    /**
     * 新着数 - Simple search, within the currently set folder.
     * @method searchInCurrentFolder
     * @param sField {String}
     * @param sText  {String}
     */
    searchInCurrentFolder: function(sField, sText) {
        if (this.searchMode) { 
            // 詳細検索モード
            // DA_DEBUG_START
            DA.log("searchInCurrentFolder not allowed for searchMode (詳細検索)", "error", "MboxGrid");
            // DA_DEBUG_END
            return; // error, no operation
        }

        if (this.folderId) { // We have a valid, non zero folder ID
            if (sField && sText) {
                this._lazyCreate({
                    fid:            this.folderId,
                    search_field:   sField,
                    search_word:    sText
                });
            } else {
                this._lazyCreate({
                    fid:            this.folderId
                }, true /*reset*/);
            }

        } else { // can't search within a folder...
            // DA_DEBUG_START
            DA.log("searchInCurrentFolder failed: no folderId", "error", "MboxGrid");
            // DA_DEBUG_END
        } 
    },



    /**
     * Refresh the contents of the folder.<p>
     * Just refreshes the liveGrid (VirtualScrollingTable) with it's current
     * parameters (start, end, etc)
     * @method refresh
     */
    refresh: function() {
        if (!this.liveGrid) {
            // DA_DEBUG_START
            DA.log("Refresh called before liveGrid exists", "warn", "MboxGrid");
            // DA_DEBUG_END
            return;
        }
        // Call update with an empty hash, and pass in false. This will ensure that
        // the liveGrid refreshes with it's currently set parameters unchanged.
        this.liveGrid.update({} /*empty options*/, false /*no change in the parameters, no reset*/);
    },


    /**
     * Support for DA.session.UIState
     * @method   getUIStateInfo
     * @returns  {Object/Hash} Hash of UI state information (current width of columns, etc)
     */
    getUIStateInfo: function() {
        // Get the UI state info of our LiveGrid 
        var gridUIInfo = this.liveGrid ? this.liveGrid.getUIStateInfo() : null;
        return gridUIInfo; // Just return as-is for now; will probably add keys,values to this later
    },


    /**
     * Go to search-mode
     * @method setSearchMode
     */
    setSearchMode: function () {
        if (this.searchMode) { return; }
        this.searchMode = true;
        this.url = DA.vars.cgiRdir + '/ajx_ma_search.cgi';
    },

    /**
     * Go to folder mode. This is the default.
     * @method setFolderMode
     */
    setFolderMode: function () {
        if (this.searchMode) {
            this.searchMode = false;
            delete this.url; // revert to the prototype
        }
    },

    /**
     * Populate the grid with search results.
     * @method loadSearchResults
     * @param totalMessages {Int} total number of messages found.
     * @param fid           {Int} the folder ID
     * @param srid          {Int} search results id.
     */
    loadSearchResults: function(totalMessages, fid, srid, type) {
        this.folderId   = fid;
        this.folderType = type;
        this.setSearchMode();
        this._lazyCreate({fid: fid, srid: srid});
        this.liveGrid.metaData.setTotalRows(totalMessages);
    },


    /**
     * FIXME: need a better name?
     * @param bResetOptions {Boolean} if true, will cause the JSON-IO's params to
                                      be set to the args, instead of merged with them.
     */
    _lazyCreate: function (args, bResetOptions) {

        if (!this.liveGrid) { // Lazy creation
            this.initLiveGrid(args, bResetOptions); 
        } else {
            // update (either we are loading search results, or changing folders)
            this.isInMutliSelect = false;  // Multiple selection does not survive folder changes
            this.setAllUnSelected();
            this.liveGrid.update(args, bResetOptions);
            if(bResetOptions === false) {$('mboxGrid_search_keyword').value='';}
        }
    },


    _generateFakeTable: function(id, nrows, columns /*ignore this, I guess*/) {

        var div = document.createElement('div');
        // IE only, but I guess it doesn't hurt
        div.onselectstart = div.onselect = function() { return false; } ;
        div.rows = []; // table emulation
        var rowdiv;

        // To fool LiveGrid, rico.js, version 1.1.2 (rico.js: Line: 2261)
        // or see rico-livegrid.js, Line: 630
        var undefArr = columns.map(function (c){ return null; });

        var i = 0;
        for (i = 0; i < nrows; ++i) {
           rowdiv = document.createElement('div');
           rowdiv.cells = undefArr; // table emulation
           rowdiv.id = 'rowdiv' + i; // Not used, but attaching anyway; useful for DOM-debugging
           rowdiv.className = 'da_rowdiv';
           div.appendChild(rowdiv);
           div.rows[i] = rowdiv;
        }

        div.id = id;
        return div;
       
    },



    _generateTableHTML: function(id, nrows, columns) {
        var sb = [];
        var i = 0;
        sb.push('<table id="' + id + '" onselectstart="return false;"><colgroup>');
        var tds = "";
        columns.each(function(col){
            sb.push('<col width="' + col.width + '"/>');
            tds += ("<td class='" + col.key + "'>&nbsp;</td>");
        });
        sb.push('</colgroup>');
        sb.push('<tbody>');
       
        for (i = 0; i < nrows; ++i) {
           sb.push("<tr> " + tds + "\n");
           sb.push('</tr>');
        }
        
        sb.push('</tbody>');
        sb.push('</table>');
        return sb.join('');
       
    },

    /**
     * Flag to indicate whether or not to enable the Fake-table optimization: 
     * If set to true, this will cause LiveGrid (DA.widget.VirtualScrollingTable) 
     * to enable a hack based on the use of DIVs formatted as a table instead
     * of a real TABLE to render grid rows and cells. This greatly boosts
     * performance (Grid redrawing time) on IE (at least).
     * @property isUsingFakeTable 
     * @type {boolean}
     */
    isUsingFakeTable: true,

    
    /**
     * Sets up an instance of VirtualScrollingTable that the MboxGrid will use.
     * (this.liveGrid)
     * This also sets up Event handlers for left click (selection), right-click
     * (context menu) and double-click (open mail in new window), before
     * finally setting up the 'selectionCache'.
     * @method initLiveGrid
     * @param  id {Int} initial folder ID. // FIXME
     */
    initLiveGrid: function(args) {

        if (this.liveGrid !== null) { 
            // DA_DEBUG_START
            DA.log('LiveGrid already initialized', 'error', 'MboxGrid');
            // DA_DEBUG_END
            return;
        }
        
        var tblId = 'mbox_grid_' + (new Date()).getTime();
        var tblRows = DA.vars.system.max_number_per_page4ajx + 1 || 41;

        if (this.isUsingFakeTable) {
            // DA_DEBUG_START
            DA.log('Using FakeTable','info','MboxGrid');
            // DA_DEBUG_END
            this.containerElem.appendChild(this._generateFakeTable(tblId, tblRows, this.columns));
            // Use the Fake-table row finder for the Event delegation.
            this._rowLocator = function(div) {
                return div.parentNode && div.parentNode.id === tblId;
            };
        } else {
            this.containerElem.innerHTML += this._generateTableHTML(tblId, tblRows, this.columns);
        }

        this.liveGrid =  new DA.widget.VirtualScrollingTable ({
            visibleRows:      this.visibleRows,
            maxVisisbleRows:  tblRows - 1, // FIXME: hack needed because Rico is funny (this.visibleRows = visibleRows+1; // ?)
            url:              this.url,
            urlParams:        args,
            resizableColumns: true,
            onLoading:        this.onLoading,
            onLoadDone:       function () {
                                  this._onLoadDone();
                                  this.onLoadDone();
                              }.bind(this),
            table:            $(tblId),
            isUsingFakeTable: this.isUsingFakeTable,
            columns:          this.columns,
            containerElem:    this.containerElem
        });
		var me = this;
		this.liveGrid.getSelected = function(){
			return me.getSelected();
		};

        this.liveGrid.isIORequired = function(){
            return this.folderId > 0;
        }.bind(this);


        // IE vs. W3C cached checks for the event handlers below
        var LEFT_BTN = BrowserDetect.browser === 'Explorer' ? 1 /*IE*/ : 0 /*W3C*/;
        // See http://www.quirksmode.org/js/events_properties.html

        // Setup the single-click listener: 2 stages are required: Mouse-up and Mouse-down.

        /*
         * Setup MOUSE-DOWN:  Stuff happens in mouse-down IF and ONLF if
         * NO modifiers (SHIFT/CTRL) are present in the event, and
         * The clicked row is not already selected.
         */
        YAHOO.util.Event.on(this.liveGrid.tableId, 'mousedown', function(e) {
            if (e.button !== LEFT_BTN) { 
                // Only bother about left-click
                return; 
            }
            this._isBeingDragged = false;
            var hasMods = e.shiftKey || e.ctrlKey; // Has SHIFT or CTRL modifiers?
            if (hasMods) {
                if (this.searchMode) {
                    YAHOO.util.Event.stopEvent(e);
                }
                return; /*if yes, then leave the rest to the mouseup handler*/ 
            }
            var row = this._getRowFromEvent(e);
            var isAlreadySelected = row && this.liveGrid.isSelected(row.__daGridRowMetaData);
            if (isAlreadySelected) { return; /*do nothing if the row is already selected*/ }

            // The actual click-handling
            this._handleRowClicked(row, false); // false, not a double-click
            YAHOO.util.Event.stopEvent(e);

        }, true, this);
        
        /*
         * Setup MOUSE-UP:  Stuff happens in mouse-up IF and ONLF if
         * either a SHIFT/CTRL modifier is presest, or
         * the row is an already selected one.
         */
        YAHOO.util.Event.on(this.liveGrid.tableId, 'mouseup', function(e) {
            if (e.button !== LEFT_BTN) { 
                // Only bother about left-click
                return; 
            }
            var hasMods = e.shiftKey || e.ctrlKey; // Has either SHIFT or CTRL modifiers?
            // If we're out of shift-clicks, then discard the origin marker for the shift range
            if (!e.shiftKey) { this._shiftRangeOriginMeta = null; }
            var row = this._getRowFromEvent(e);
            var rowMetaData = row ? row.__daGridRowMetaData : null;
            var isAlreadySelected = row && this.liveGrid.isSelected(rowMetaData);
            if (!hasMods && !isAlreadySelected) { //
                // Nothing for mouseup to do
                return;
            }
            if (!hasMods && isAlreadySelected && !this._isBeingDragged) {
                this.isInMutliSelect = false;
                this._handleRowClicked(row); // This will also unselect all the others.
                return; // done.
            }


                // SHIFT gets priority over CTRL
                if (e.shiftKey) {
                    // Process a SHIFT-selection request that will select
                    // all rows (from the previous selected row) to the given row.
                    this.setRangeEnd(rowMetaData);
                }

                if (e.ctrlKey) {
                    this.isInMutliSelect = true;
                    if (isAlreadySelected) { // reverse the selection (de-select)
                        if (this._checkShiftRanges(rowMetaData)) {  // If the row is NOT within an existing shift range
                            this._deflateRanges(); // try deflating the ranges.
                        }
                        this.setUnSelected(row);
                    } else {
                        this.setSelected(row, false/*do not clear the others*/);
                    }
                }
            

            // Save a reference to the clicked row.
            this._lastClickedRowMetaData = rowMetaData;

        }, true, this);

        // Setup the double-click listener
        YAHOO.util.Event.on(this.liveGrid.tableId, 'dblclick', function(e) {
            var row = this._getRowFromEvent(e);
            this._handleRowClicked(row, true); // true indicates a double-click
        }, true, this);

        // Setup the context menu
        this._setupContextMenu();

        // Set up a cache that helps track which mails are selected.
        this.initSelectionCache();

        // Key bindings?
        YAHOO.util.Event.on(window.document, 'keydown', function (evt) {
            var k = YAHOO.util.Event.getCharCode(evt);
            if (!this._lastClickedRowMetaData) {    // TODO: using _lastClickedRowMetaData
                return;                             // as a shirt-circuit is not 100% reliable.
            }                                       // Consider the case when the CTRL-key
                                                    // unselects the only selected mail: a 
                                                    // reference to _lastClickedRowMetaData
                                                    // remains, though it should not.
            var el = Event.element(evt);
            if (el.tagName !== "INPUT") {
                switch(k) {
                    case Event.KEY_DOWN:
                        this._handleArrowDown();
                        break;
                    case Event.KEY_UP:
                        this._handleArrowUp();
                        break;
                    case Event.KEY_DELETE:
                        this._handleDelete();
                        break;
                    default:
                }
            }
        }, true, this);
    },


    /**
     * Event that is fired whenever the selection (messages selected in the grid) is
     * modified.
     * @property onSelectionChanged
     * @type {Object} Instance of YAHOO.util.CustomEvent
     */
    onSelectionChanged: null,


    /**
     * Cursor key handler: down-arrow.
     * Just a wrapper to _handleArrowKey; useful for adding 
     * debug/trace log messages.
     * @private
     * @method _handleArrowDown
     */
    _handleArrowDown: function () {
        this._handleArrowKey(1);
    },
    
    /**
     * Cursor key handler: down-up.
     * Just a wrapper to _handleArrowKey; useful for adding 
     * debug/trace log messages.
     * @private
     * @method _handleArrowUp
     */
    _handleArrowUp: function () {
        this._handleArrowKey(-1);
    },

    /**
     * Key handler: delete.
     * @private
     * @method _handleDelete
     */
    _handleDelete: function() {
        this.onDeletePress();
    },

    /**
     * Based on the given numerical offset, moves the selection
     * n rows down (or up, if n is negative). This will cause the
     * viewport to scroll the selection into view.
     * TODO: (1) Multi-sepection modes? CTRL? SHIFT?
     * @private _handleArrowKey
     * @param   n {Number} offset
     * @method _handleArrowKey
     */
    _handleArrowKey: function (n) {
        // First find the last clicked row.
        var lastMMData  = this._lastClickedRowMetaData,
            // Next, where are we presently?
            range       = this._getViewPortRange(),
            lastSno     = lastMMData.sno,
            startSno    = range.start + 1,
            endSno      = range.end + 1,
            vpSize      = endSno - startSno - 1,
            targetSno   = lastSno + n,
            row,
            only        = true;                     // Only one row.

        // IE: Keep focus of scroll bar problem.
        this.containerElem.focus();
        
        // Are we in range?
        if (targetSno < startSno + 1) {
            // Either we are out of visual range,
            // or we are about to leave it. Correct this!
            this.liveGrid.scroller.              // -1: sno is 1-indexed
                moveScroll(targetSno -1 -1);   // -1: some space
        }
        if (targetSno > endSno - 1) {
            // Either we are out of visual range,
            // or we are about to leave it. Correct this!
            this.liveGrid.scroller.                     // -1: sno is 1-indexed
                moveScroll(targetSno -1 -vpSize  +1);  // +1: some space
        }

        // find the desired row in the buffer.
        var findRow = function() { // FIXME: unnecessary closure?
            var targetPosInBuffer = this._findPositionInBuffer(lastMMData) + n;
            // FIXME: Direct access to buffer.rows!
            var target = this.liveGrid.buffer.rows[targetPosInBuffer];
            return target ? this.findRowByMMData(target.meta) : null;
        }.bind(this);

        row = findRow(); // Try it now.

        if (row) { // Got it. Select the row NOW!
            this.setSelected(row, only, false, true); // TODO: multiple?
            this._lastClickedRowMetaData = row.__daGridRowMetaData;
        } else {
            // Probably a reload will need to take place
            this._scheduleJobOnLoadDone(function () {
                    var row = findRow();
                    // got it at last?
                    if (row) { 
                        this.setSelected(row, only, false, true);
                        this._lastClickedRowMetaData = row.__daGridRowMetaData;
                    } else { // forget it.
                        // This should never happen!
                        // DA_DEBUG_START
                        debugger;
                        DA.log("Can't find row.",'warn', 'MboxGrid');
                        // DA_DEBUG_END
                    }
            });
        }
    
    },


    /**
     * Reference to the metadata of the most recently clicked row.
     * @property _lastClickedRowMetaData
     * @private
     * @type {Object}
     */
    _lastClickedRowMetaData: null,

    _lastClickedRow4RightButton: null,

    /**
     * One-call init method that sets up a cache which keeps a track of which
     * mails are currently selected.
     * @method initSelectionCache
     */
    initSelectionCache: function() {
       
        var me = this;

        // Private variable, thanks to the closures below.
        var hash = {};        // CTRL selections
        var shiftRanges = []; // SHIFT selections

        // TODO: Profile this
        this._checkShiftRanges = function(mdata, _shiftRanges) {
            _shiftRanges = _shiftRanges || shiftRanges;
            var i, srLen = _shiftRanges.length, sr;
            var sno = parseInt(mdata.sno, 10); // FIXME: this may be slow
            for (i=0; i<srLen; ++i) { // This needs to be as fast as possible
                sr = _shiftRanges[i];
                if ((sr.start.sno <= sno) && (sr.end.sno >= sno)) {
                    return true;
                }
            }
            return false;
        };

        // Helper function to get the number of rows in a range
        function rowsInRange(nA/*initial number*/, oSR /*shift range*/) {
            if (!oSR.count) { 
                oSR.count = Math.max(0, (oSR.end.sno - oSR.start.sno) + 1); 
            }
            return nA + oSR.count;
        }

        // Use a simple String as the key: $fid_$uid.
        var lg = this.liveGrid;
        // This (isSelected) will be invoked by populateRow (Rico) to see whether or
        // not to apply the 'da_gridSelectedRow' CSS class.
        lg.isSelected = function(mdata) {
            if (!mdata) { return false; }
            // hack to support handling LiveGridBuffer rows 
            mdata = mdata.meta || mdata; // FIXME: This works only for Fake-table
            if (hash[mdata.fid + '_' + mdata.uid]) {  
                return true;
            }
            if (shiftRanges.length < 1) {
                return false;
            }
            return me._checkShiftRanges(mdata);
        };


        /**
         * Use this function to debug:
         * function foo () { var sel = $H(__mboxGrid.getSelected()); 
         *   print (sel.inspect()); 
         *   if(sel.ranges) {sel.ranges.each(function(r){print(r.start.sno+"-"+r.end.sno)}); } 
         *   if(sel.singles) {sel.singles.each(function(r){print($H(r).inspect())}); } 
         * } 
         * TODO: Profile!
         */
        this.getSelected = function() {
            var h = $H(hash);
            var mmdatas = h.values(); // FIXME: slow
            var first = mmdatas.first();
            var identity = me._getIdentity(); // Who are we?

            // FIXME: slow?
            var count = shiftRanges.inject(mmdatas.length, rowsInRange);
                        
            if (count === 0) {
                return {
                    count:    0,
                    single:   null,
                    singles:  [],
                    identity: identity,
                    ranges: []
                };
            }

            first = mmdatas.first() || shiftRanges.first().start;

            if (count === 1) {
                return {
                    count:  1,
                    single: first,
                    singles: [ first ],
                    fid:    first.fid,
                    srid:   first.srid,
                    identity: identity,
                    ranges: []
                };
            }
            
            return {
                count:   count, // Number of messages selected
                singles: mmdatas,
                ranges:  shiftRanges,
                fid:     first.fid,
                srid:    first.srid,
                identity: identity
            };

        };

        this.onSelectionChanged = new YAHOO.util.CustomEvent("onSelectionChanged");

        // Wrapper to fire our custom event
        function fireAsync(right, key) {
            setTimeout(function(){
                me.onSelectionChanged.fire( me.getSelected(), right, key );
            }, 40);
        }

        // helpers
        var addMMData = function (oRowOrMMData /*Either row {HTMLElement}, or meta-data*/) {
            // NOTE: This is NOT an erroneous null-pointer check; we actuall WANT
            //       to treat oRowOrMMData as HTMLElement with an attached __daGridRowMetaData,
            //       which if it is absent, we assume that oRowOrMMData is the meta-data itself
            var mdata = oRowOrMMData.__daGridRowMetaData || oRowOrMMData;
            var key = mdata.fid + '_' + mdata.uid; // String for the hash key
            hash[key] = mdata;
        };
        var deleteMMData = function (oRowOrMMData /*Either row {HTMLElement}, or meta-data*/) {
            // NOTE: See comments for addMMData
            var mdata = oRowOrMMData.__daGridRowMetaData || oRowOrMMData;
            var key = mdata.fid + '_' + mdata.uid; // String for the hash key
            delete hash[key];
        };
        // The methods below provide the actual implementation for 
        // setSelected, setUnSelected
        this.setSelected = function(rows, only, right, key) {
            if (only && only===true) { 
                hash = {}; // empty the singles (CTRL) cache
                shiftRanges.clear(); /*empty the SHIFT ranges*/
                // modify apppearance
                YAHOO.util.Dom.removeClass(lg.table.rows, 'da_gridSelectedRow');
            }
            // YAHOO does batching for us
            YAHOO.util.Dom.addClass(rows, 'da_gridSelectedRow');
            (rows.length ? rows : [rows]).each(addMMData);
            // Tell the world that our selection buffer has been modified
            fireAsync(right, key);
        };
        this.setUnSelected = function(rows) {
            // YAHOO does batching for us
            YAHOO.util.Dom.removeClass(rows, 'da_gridSelectedRow');
            (rows.length ? rows : [rows]).each(deleteMMData);
            fireAsync();
        };
        this.setAllUnSelected = function() {
            YAHOO.util.Dom.removeClass(lg.table.rows, 'da_gridSelectedRow');
            hash = {}; // empty the singles (CTRL) cache
            shiftRanges.clear(); /*empty the SHIFT ranges*/
            me._lastClickedRowMetaData = null;
            me._shiftRangeOriginMeta = null;
            fireAsync();
        };

        // When LiveGrid (VirtualScrollingTable) wants to clear the selection, use setAllUnSelected
        lg.clearSelection = this.setAllUnSelected.bind(this);

        /**
         * Used by the SHIFT-select modifier to select a contiguous range of messages.
         * From the previously selected row to the given row, select all messages
         * @method setRangeEnd
         * @param  meta {Object} LiveGrid (VirtualScrollingTable) Grid-row meta data.
         */
        this.setRangeEnd = function (meta) {
            if (!meta) { return; }
            me._shiftRangeOriginMeta = me._shiftRangeOriginMeta || me._lastClickedRowMetaData;
            var rangeOriginMeta = me._shiftRangeOriginMeta;
            if (!rangeOriginMeta) {
                // DA_DEBUG_START
                debugger;
                // DA_DEBUG_END
                return;
            }
            // DA_DEBUG_START
            DA.log('start setRangeEnd','time', 'MboxGrid');
            // DA_DEBUG_END
            hash = {}; // Forget any CTRL selections
            var sno = parseInt(meta.sno, 10);

            shiftRanges.clear(); // clear the previous ones
            me.isInMutliSelect = false;

            rangeOriginMeta.sno = parseInt(rangeOriginMeta.sno, 10);
            meta.sno = parseInt(meta.sno, 10);

            var start = rangeOriginMeta.sno < meta.sno ? rangeOriginMeta : meta;
            var end   = rangeOriginMeta.sno > meta.sno ? rangeOriginMeta : meta;

            shiftRanges.push({ start: start, end: end });

            // FIXME: This works, but looks naive 
            $H(hash).each(function(pair){
                var md = pair.value;
                if (md && me._checkShiftRanges(md)) {
                    delete hash[pair.key];
                }
            });
            me.liveGrid.viewPort.updateSelectionStatus();
            fireAsync();
            // Try to deflate as much as possible, as early as possible
            me._deflateRanges();
            // DA_DEBUG_START
            DA.log('end setRangeEnd','time', 'MboxGrid');
            // DA_DEBUG_END

        };


        /*
         * Utility functions used by method _deflateRanges
         */
        // Copy a shift-range node
        function copyRangeNode (rn) {
            return { sno:  rn.sno,
                uid:  rn.uid,   fid:  rn.fid,
                srid: rn.srid,  type: rn.type };
        }
        // Add all mail-meta-data with sno between nStart, nEnd to singles (hash)
        function addToSingles(nStart, nEnd, aMMData) {
            var offset = aMMData.first().sno;
            var iEnd = nEnd - offset;
            var mmdata;
            for (var i = (nStart-offset); i <= iEnd; ++i) {
                mmdata = aMMData[i];
                if (mmdata) { 
                    addMMData(mmdata);
                }
            }
        }
        // Return an object suitable as a start/end node in a shift range
        // that corresponds to the given sno (nSno); looks for it in the
        // given array of mail-meta-data, or returns undefined.
        function mkRangeNode (nSno, aMMData) {
            var offset = parseInt(aMMData.first().sno, 10);
            var mmdata = aMMData[nSno - offset];
            if (!mmdata) {
                // Not available in buffer; we refuse to decide
                return undefined;
            }
            return copyRangeNode(mmdata);
        }

        /**
         * @method clipRange
         * @private
         * @param nSRStart
         * @param nSREnd
         * @param nStart
         * @param nEnd
         * @returns {Array} of Arrays, (AoA), each array containing exactly 2 numbers (start, end)
         */
        function clipRange (nSRStart, nSREnd, nStart, nEnd) {
            var newRanges = [];
            var startChunk = Math.max(0, nStart - nSRStart); 
            var endChunk   = Math.max(0, nSREnd - nEnd);
            if (startChunk === 0 && endChunk === 0) {
                // Clipped everything
            } else {
                if (startChunk) {
                    newRanges.push([nSRStart, nStart]);
                }
                if (endChunk) {
                    newRanges.push([nEnd, nSREnd]);
                }
            }
            return newRanges;
        }

        /**
         * Helper method to normalize (as much as possible) the shift-ranges (if any)
         * into individual singles of mail-meta-data.
         * Calling this method (it takes no params, returns nothing) will
         * usually result in the conversion of all shift-ranges to singles
         * (see method: getSelected), when possible, or at least try to convert
         * as much as possible of the ranges to singles.
         * @method _deflateRanges
         * @private
         */ 
        this._deflateRanges = function () {
            if (shiftRanges.length < 1) { return; }
            // FIXME: Directly accessing buffer.rows, which is private
            // FIXME: plucking meta like this is (a) Fake-table-only, and (b) slow
            // rows is an array of the currently available LiveGridBuffer's row meta-data,
            // which in this case is an array of mail-meta-data objects.
            var rows = me.liveGrid.buffer.rows.pluck('meta');
            if (rows.length < 1) { return; }
            var bStart = rows.first().sno;   // sno of the starting meta-data of the buffer
            var bEnd   = rows.last().sno;    // sno of the last meta-data of the buffer
            // Make sure we are dealing with integers
            bStart = parseInt(bStart, 10);
            bEnd   = parseInt(bEnd, 10);

            // Find intersections, and splice, and/or expand the current ranges, storing
            // the resulting ranging in:
            var newRanges = []; // temporary working array to hold the new shift-ranges
            // Examine each shift-range for intersecting regions with the currently
            // available LiveGrid buffer's row meta-data
            shiftRanges.each(function (sr) {
                var rStart = sr.start.sno;   // The start sno of the shift range
                var rEnd   = sr.end.sno;     // and the end sno
                // sno could be a string; make sure it is a number
                rStart = parseInt(rStart, 10);
                rEnd   = parseInt(rEnd, 10);

                if (rEnd <= bStart || rStart >= bEnd) { // OUT of range; ignore this.
                    newRanges.push(sr);
                    return;
                } 
                // start and end of the intersecting regions
                var start = Math.max(rStart, bStart);
                var end   = Math.min(rEnd,  bEnd);
                // The intersection region holds a contiguous array of meta-data
                // that can be expanded to singles
                addToSingles(start, end, rows);  // adds all meta-data with
                                                 // sno from start to end
                // Compute which part(s) of the shift-range were not it the
                // intersection
                var clippings = clipRange(rStart, rEnd, start, end);
                // Create new ranges for each 'unresolved' region 
                // (unresolved, in that the clipped region does not intersect
                // with the currently available mail-meta-data buffer)
                clippings.each(function (aClip) {
                    var startNode = mkRangeNode( aClip[0], rows ) || sr.start;
                    var endNode   = mkRangeNode( aClip[1], rows ) || sr.end;
                    newRanges.push({
                        start: startNode,
                        end:   endNode
                    });
                    // We track these in the edges of the shift-range, so we
                    // can remove them from the MMData hash
                    deleteMMData(startNode);
                    deleteMMData(endNode);
                });
            });
            
            // Copy the working array of shift-ranges to the actual, main array
            // that stores them 
            shiftRanges.clear(); // (before clearing the old one out)
            var tmp;
            while ((tmp = newRanges.pop())) {
                shiftRanges.push(tmp);
            }
            shiftRanges.reverse(); // ! destructive reverse, because we need to
        };

    },

    /**
     * Reference to the meta-data of the row that acts as the origin for 
     * the shift selection range
     * @property _shiftRangeOriginMeta
     * @type {Object}
     * @private
     */
    _shiftRangeOriginMeta: null,

    /**
     * Marks the mail as 'selected'.
     * This does not update the appearance of the row right away; the actual setting
     * up of the CSS to make the row appear selected needs to be done by the click event
     * (or the Rico table row-refresh)
     * TODO: Can't be be a part of VirtualScrollingTable?
     * @method setSelected
     * @param mdata {Object}  metadata of the selected mail.
     * @param only  {boolean} (Optional )if TRUE, then deselect all others.
     */
    setSelected:   Prototype.emptyFunction, // Function will be actually created by initSelectionCache

    /**
     * Marks the mail as 'unselected'.
     * This does not update the appearance of the row right away; the actual setting
     * up of the CSS to make the row appear unselected needs to be done by the click event
     * (or the Rico table row-refresh)
     * TODO: Can't be be a part of VirtualScrollingTable?
     * @method setUnSelected
     * @param mdata {Object}  metadata of the mail to unselect.
     */
    setUnSelected: Prototype.emptyFunction, // Function will be actually created by initSelectionCache

    /**
     * Determine which row of the grid's HTMLTableElement the event is associated
     * with.
     * @method _getRowFromEvent
     * @param e {Object} event
     * @return {HTMLTableRowElement}
     * @private
     */
    _getRowFromEvent: function(e) {
        var target = YAHOO.util.Event.getTarget(e);
        return DA.dom.findParent(target, this._rowLocator, 5);
    },

    /**
     * @property _rowLocator
     * @type {String}
     * @type {function} // Gotta love Javascript
     * @private
     */
    _rowLocator: 'TR', // default row locator is just a String to match the parent tagnames...

    /**
     * handles the row click/selection; for double-click events, additionally
     * fires the onDoubleClick custom event.
     * @method _handleRowClicked
     * @private 
     * @param row      {HTMLTableRowElement}  the clicked row.
     * @param isDouble {boolean} was this a double-click? 
     */
    _handleRowClicked: function(row, isDouble) {

        if (!row) {
            // DA_DEBUG_START
            DA.log('No row', 'error', 'MboxGrid');
            // DA_DEBUG_END
            return;
        }

        var mdata = row.__daGridRowMetaData; // FIXME: hack

        // TODO: review: if we cannot find metadata for a row,
        //       then just do nothing. Is this correct?               
        if (!mdata) { 
            // DA_DEBUG_START
            DA.log('Failed to get mail metadata', 'error', 'MboxGrid');
            // DA_DEBUG_END
            return; 
        }

        if (!mdata.fid || !mdata.uid) {
            return;
        }
        
        // Save a reference to the clicked row.
        this._lastClickedRowMetaData = mdata;
        
        // Set only this row as selected
        this.setSelected(row, true/*unselecting all others*/);
       
        var onDoubleClick = this.onDoubleClick;

        if (isDouble) {
            setTimeout( function () {
                onDoubleClick.fire( mdata );
            }, 100);
        }

    },

    /** 
     * Proxy to liveGrid
     */
    resizeHeight: function(h) {
        this.liveGrid.resizeHeight(h, true);
    },

    onLoading:  Prototype.emptyFunction,

    onLoadDone: Prototype.emptyFunction,

    onDeletePress: Prototype.emptyFunction,

    /* Sometimes we want something to happen later; 
     * for example, when the underlying liveGrid  
     * recieves fresh data from the server, at some
     * point in the future. 
     * We might want some code to be executed at that
     * point of time, but the code (and the logic)
     * is available only now, and not later.  
     *
     * Solution: * Use closures. We 'schedule'
     * a list of jobs to be executed at onLoadDone,
     * each job a closure that will be invoked in 
     * order.
     *
     * _scheduleJobOnLoadDone does this.
     */ 


    /**
     * Maintain a list of jobs to run each time new data
     * has been successfully loaded. 
     * @private
     * @field _onLoadDoneJobs 
     * @type Array (of functions)
     */
    _onLoadDoneJobs: [], 


    /**
     * Runs a sequence of queued jobs; this is typically
     * stuff that could not be done until data has been
     * re-loaded.
     * @private
     * @method _onLoadDone
     */  
    _onLoadDone: function () {
        var jobs = this._onLoadDoneJobs,
            jobF;
        while (jobs.length > 0 && (jobF = jobs.shift())) {
            jobF.apply(this);
        }
    },


    /**
     * Schedule a job to run once during the next data load.
     * @private
     * @method _scheduleJobOnLoadDone
     * @param fJob {Function} closure that will be invoked 
     *                        with this (mboxGrid) as the scope
     */
    _scheduleJobOnLoadDone: function (fJob) {
        this._onLoadDoneJobs.push(fJob);
    },

    
    /**
     * Find Table row (TR) by mail meta-data.
     * NOTE: this also works with the Fake-table hack
     * @method findRowByMMData
     * @param mmdata {Object} hash containing keys fid, uid, etc.
     * @returns {HTMLTableRowElement}
     */
    findRowByMMData: function(mdata) {
        if (!mdata) { return; }
        var lg = this.liveGrid;
        // FIXME: Doing at run-time what can be done at load-time
        //        Why not just make table.rows a link to table.childNodes?
        var rows = lg.isUsingFakeTable ? 
            lg.table.childNodes : // Use the child nodes of the Fake-table DIV element.
            lg.table.rows;        // Use the table rows.

        var length = Math.min(rows.length, lg.viewPort.visibleRows, lg.metaData.totalRows); 
        var __daGridRowMetaData;
        var row;
        for (var i = 0; i < length; ++i) {
            row = rows[i];
            __daGridRowMetaData = row.__daGridRowMetaData;
            if (__daGridRowMetaData && 
                DA.util.cmpNumber(__daGridRowMetaData.fid, mdata.fid) && 
                DA.util.cmpNumber(__daGridRowMetaData.uid, mdata.uid)) {
                return row;
            }
        }
    },
    
    
    /**
     * Finds the position of 
     * @method _findPositionInBuffer
     * @param single {Object} hash containing keys fid, uid.
     * @returns {Number}
     */
    _findPositionInBuffer: function(mmdata) {
        var i    = 0,
            rows = this.liveGrid.buffer.rows,
            len  = rows.length,
            cmp  = DA.util.cmpNumber;

        for (; i<len; ++i) {
            if (cmp(rows[i].meta.fid, mmdata.fid) && 
                cmp(rows[i].meta.uid, mmdata.uid)) {
                return i;
            }
        }
    },

    
    /**
     * 今見えているはどころへん?
     * (start,endのインデクス値は0からになります）
     * @private
     * @method _getViewPortRange
     * @return {Hash} Object: keys -> start, end
     */ 
    _getViewPortRange: function () {
        return this.liveGrid.viewPort.getRange();
    },
        


    /**
     * For the given mmdata (mail metadata), hunt down the TR element that is
     * currently displaying the corresponding mail (if it is within view) and
     * update it's appearance (based on the CSS information the metadat holds)
     * @method setRowAppearance
     * @param mmdata // TODO
     * @param changedProps {Array} Array of string-names of changed properties
     * @param tr           {HTMLElement} (Optional) row element. If passed in, 
     *                                   the row will not be searched for, and 
     *                                   this will be used instead.
     */
    setRowAppearance: function (mmdata, changedProps, tr) {
        if (!mmdata) { return; }

        // First modify the metadata
        // For each property..
        if (changedProps && changedProps.each) {
            if (!mmdata.className || mmdata.className === '') {  // What? No classname?!
                mmdata.className = this._utils.mkCSSClassNameForRow(mmdata); 
            }
            // FIXME: slow
            changedProps.each(function(prop){
                var c = prop.charAt(0);
                if(prop === "forwarded")
                {
                	c='w';
                }
                var re = new RegExp("\\b" + c + "[0-9]\\b");
                mmdata.className = mmdata.className.replace(re, c + mmdata[prop]);
            });
        }

        // Then, if the metadata corresponds to an existing TABLE row, (or row-DIV in a Fake-table)
        // get the DOM element of the row and set it's class.
        tr = tr ? tr : this.findRowByMMData(mmdata);
        if (!tr) { return; } // short-circuit to avoid NPE's and useless calls to isSelected
        // FIXME: the isSelected bit is redundant (see virtual-scroll.js, populateRow)
        var isSelected = this.liveGrid.isSelected(mmdata);
        tr.className = (this.isUsingFakeTable ? 'da_rowdiv ' : '') +
                mmdata.className + (isSelected ? ' da_gridSelectedRow' : ''); 
    },
    
    /**
     * Move all the currently selected messages to the Trash folder (or delete them
     * right away). This is a front-end to moveSelected, which does things like prompting
     * the user.
     * @method deleteSelected
     */
    deleteSelected: function() {
        var selected = this.getSelected();
        var message = (DA.mailer.util.isTrash(this.folderType) ||
                                DA.vars.config["delete"] === 1 ||
                                (selected.count === 1 &&
                                 DA.mailer.util.isTrash(selected.single.type))) ? 
                       DA.locale.GetText.t_("MESSAGE_DELETECOMPLETE_CONFIRM") : 
                       DA.locale.GetText.t_("MESSAGE_DELETE_CONFIRM");
        if (DA.util.confirm(message)) {
            this.moveSelected( { trash: true } ) ;
        }
    },



    /**
     * Move all the currently selected messages to the given target. 
     * If the target has a property 'trash' which evaluates to TRUE, then
     * the messages are moved to trash (or deleted)
     * @method moveSelected
     * @param target {Hash} Object with the properties:
     *                        - trash {Boolean} if true, then move to trash/delete
     *                        - fid   {Number}  ID of the destination folder
     */
    moveSelected: function(target) {
        var selected = this.getSelected();
        DA.mailer.Events.onMessageMoveRequest.fire({
            messages: selected,
            target:   target

        });
        setTimeout(function () {
            this.isInMutliSelect = false;
            this.setAllUnSelected();
        }.bind(this), 500);
    },

   
    /**
     * Computes and sets the changed start offset position (startPos) of the given LiveGrid's buffer
     * based on the assumption that all rows targeted by the given selection object are to be
     * removed.
     * FIXME: LiveGrid (VirtualScrollingTable) specific code
     * 
     * @method _adjustBufferStartPos
     * @private 
     * @param selection {Object} (Optional) hash/object containing count, single,singles and/or ranges
     *                           (The same type of object that is returned by MboxGrid.getSelected())
     * @param liveGrid {Object} (optional) Instance of DA.widget.VirtualScrollingTable
     * @return {Boolean} if TRUE, indicates that the buffer's start position offset was indeed modified.
     */
    _adjustBufferStartPos: function (selection, liveGrid) {
        if (!selection) { return false; }
        var lg = liveGrid || this.liveGrid;

        var startPosOrig = lg.buffer.startPos;
        var rowsAbove = this._countAffectedRows(selection, 0, lg.buffer.startPos);
        var startPosNew  = startPosOrig - rowsAbove;

        if ( startPosNew === startPosOrig ) {
            return false;
        }

        lg.buffer.startPos = startPosNew;

        return true;

    },

   
    /**
     * Recomputes and resets the sequence numbers for the entire buffer's rows.
     * This is needed when the local LiveGridBuffer is directly manipulated
     * (for example, when rows are deleted/removed) and the sequence numbers
     * are out of sync with the rows that the buffer represents (offset at it's startPos)
     * 
     * @method _repairBufferSeqNums
     * @private
     * @param liveGrid {Object} (optional) Instance of DA.widget.VirtualScrollingTable
     */
    _repairBufferSeqNums: function (liveGrid) {
        var lg = liveGrid || this.liveGrid;
         
        var rows = lg.buffer.rows;
        var bufferLength = rows.length;
        var startPos = lg.buffer.startPos + 1; // sno starts from 1, not 0
        var i;
        for (i = 0; i < bufferLength; ++i) {
            rows[i].meta.sno = startPos + i; // FIXME: Fake-table specific
        }

    },

    /**
     * Computes and sets the changed start position (lastRowPos) of the given LiveGrid's viewPort,
     * based on the assumption that all rows targeted by the given selection object are to be
     * removed.
     * FIXME: LiveGrid (VirtualScrollingTable) specific code
     * 
     * @method _adjustViewPortStartPos
     * @private 
     * @param selection {Object} (Optional) hash/object containing count, single,singles and/or ranges
     *                           (The same type of object that is returned by MboxGrid.getSelected())
     * @param liveGrid {Object} (optional) Instance of DA.widget.VirtualScrollingTable
     * @return {Boolean} if TRUE, indicates that the viewPort's start position was indeed modified.
     */
    _adjustViewPortStartPos: function (selection, liveGrid) {
        
        if (!selection) { return false; }

        var lg = liveGrid || this.liveGrid;

        var viewPortStartPos = lg.viewPort.lastRowPos;
        var viewPortStartSno; // Must be equal to viewPortStartPos + 1
        var firstRowHTMLElem = lg.table.firstChild;
        if (firstRowHTMLElem && firstRowHTMLElem.__daGridRowMetaData) {
            viewPortStartSno = parseInt(firstRowHTMLElem.__daGridRowMetaData.sno, 10);
        }
        if (viewPortStartSno !== (viewPortStartPos + 1)) {
            // DA_DEBUG_START
            debugger;
            DA.log("GridRow Metadata sno not matching viewPort startPos", 'error', 'MboxGrid');
            // DA_DEBUG_END
            viewPortStartSno = viewPortStartPos + 1;
        }

        // Find the number of affected rows *above* the viewPort.
        var rowsAbove = this._countAffectedRows(selection, 0, viewPortStartPos);
        // Move up to fill the missing rows.
        var newViewPortStartPos = viewPortStartPos - rowsAbove;

        if (newViewPortStartPos < 0) { // Sanity checks
            // something funny?
            // DA_DEBUG_START
            debugger;
            DA.log('Negative viewport start position:'+newViewPortStartPos, 'error', 'MboxGrid');
            // DA_DEBUG_END
            lg.viewPort.lastRowPos = 0;
        } else { 
            lg.viewPort.lastRowPos = newViewPortStartPos;
        }

        var totalRows = lg.metaData.getTotalRows();
        var pageSize  = lg.metaData.getPageSize();

        var remainingRows = totalRows - newViewPortStartPos;
        if (totalRows >= pageSize) { // If we have enough
            if (remainingRows < pageSize) { 
                lg.viewPort.lastRowPos = (totalRows - pageSize) - 1;
            }
        } else { // scroll-less; to the top
            lg.viewPort.lastRowPos = 0;
        }

        return lg.viewPort.lastRowPos !== viewPortStartPos; // If a start adjustment took place, say yes

    },


    /**
     * For the given selection, return a count of all the rows that fall within
     * the specified start_sno and end_sno.
     * @param start_sno {Number}  sequence number of grid-row meta-data
     * @param end_sno   {Number}  sequence number of grid-row meta-data
     */
    _countAffectedRows: function (selection, start_sno, end_sno) {
        if (!selection || !end_sno) { return 0; }

        var singles = (selection.singles && selection.singles.length) ? selection.singles : 
                selection.single ? [selection.single] : [];
        var ranges = (selection.ranges && selection.ranges.length) ? selection.ranges : [];

        var count = singles.inject(0, function(nA /*accumulated number*/, oS){
            var sno = parseInt(oS.sno, 10);
            return nA + ( (sno >= start_sno && sno <= end_sno) ? 1 : 0 );
        });

        count = ranges.inject(count, function(nA /*accumulated*/, oR) {
            var from = Math.max(oR.start.sno, start_sno);
            var to   = Math.min(oR.end.sno, end_sno);
            return nA + Math.max(0, (to - from + 1));
        });

        if (count < 0) {
            // DA_DEBUG_START
            DA.log('negative count for start:'+start_sno+',end:'+end_sno, 'error', 'MboxGrid');
            // DA_DEBUG_END
            return 0;
        } else {
            return count;
        }

    },

    /**
     * @property _messageMoverJobs
     * @type {Object} Instance of Hash (Prototype.js) 
     *                key: jobId (move, delete event);  value: message collection
     */
    _messageMoverJobs: null,

 
    /**
     * Based on the currently queued Message Mover jobs, creates an 'exception filter'
     * that will be used to remove rows from the next LiveGrid request.
     * Messages that match the enqueued Message Collections will be filtered out 
     * at the IO level (ajx_ma_list will not return them).
     * This is meant to be used during deletion/moving of messages (when messages need to 'vanish'
     * from the grid)
     * @method _updateExceptionFilter
     * @private
     */
    _updateExceptionFilter: function () {

        // FIXME: The following section could get slow.
        var collections = this._messageMoverJobs.values();
        if (collections.length < 1) {
            delete this.liveGrid.jsonIO.defaultParams.except;
        }
        // Merge all the singles arrays into a single singles array;
        var singles = collections.pluck('singles').inject( [], this._utils.listConcat );
        // ..and all the ranges arrays into a single ranges array
        var ranges  = collections.pluck('ranges').inject( [], this._utils.listConcat );

        this.liveGrid.jsonIO.defaultParams.except = 
                singles.map(this._utils.asFidColonUid).concat(
                ranges.map(this._utils.asFidColonUidRange)).join(',');
    }


};


if ("undefined" === typeof DA.mailer.dd) {
    DA.mailer.dd = {};
}

/**
 *
 *
 */
DA.mailer.dd.MboxMail = function (id) {
    this.init(id, "da_folderTree", this.config);
    this.initFrame();
};

YAHOO.extend(DA.mailer.dd.MboxMail, YAHOO.util.DDProxy, {

    // FIXME: Must not access FolderTreeController from here!!!
    _targetId2fid: DA.mailer.FolderTreeController.prototype._targetId2fid,
    _fid2divId:    DA.mailer.FolderTreeController.prototype._fid2divId,
   

    /**
     * See YUI sources, dragdrop.js
     * @method clickValidator
     * @param e {Object} DOM event (mousedown event, probably)
     * @returns {Boolean} if TRUE, continue the drag; if FALSE, the drag will be aborted.
     */
    clickValidator: function(e) {
		if (DA.mailer.util.getOperationFlag() !== '' && DA.mailer.util.getOperationFlag().indexOf(OrgMailer.vars.org_mail_gid.toString()) < 0){
			return false;
		}
        var selectedMails = this.mboxGrid.getSelected(); // REF: Using getSelected for obtaining count
        if (e.ctrlKey &&(!selectedMails || selectedMails.count === 0)) {
           return false;
        } 
        var node = YAHOO.util.Event.getTarget(e);
        var target;
        var children;
        if (!node) {
            return false;
        }
        if (node.id) {
            target = node;
        } else {
            target = node.parentNode;
        }
        if (target.id.match(/^rowdiv\d+$/)) {
            children = target.children /*IE*/ || target.childNodes /*W3C*/ || [];
            if (children.length === 0) {
                return false;
            } 
        }
        return true;

    },

    endDrag: function() {
        this.mboxGrid._isBeingDragged = false;
    },

    onDragDrop: function(e, id) {
        var fid = this._getFid(id);
        if (this._okToDrop(fid)) {
            YAHOO.util.Dom.removeClass($(id).parentNode, "labelTargeted");
            this.mboxGrid.moveSelected({ fid: fid });
        }
    },

    /**
     * @method _okToDrop
     * @private
     * @param nFid {Number} IMAP folderID we are hovering over
     * @return {Boolean} dropping here is OK.
     */
    _okToDrop: function (nFid) {
    	if (nFid) {
	        if (this.mboxGrid.folderTreeController && !this.mboxGrid.folderTreeController._dropMOk(nFid)) {
	             return false;
	        }
	        return parseInt(nFid, 10) !== this.mboxGrid.folderId;
	    } else {
	    	return false;
	    }
    },

    onDragEnter: function(e, id) {
        var fid = this._getFid(id);
        if (this._okToDrop(fid)) {
            YAHOO.util.Dom.addClass($(id).parentNode, "labelTargeted");
            DA.mailer.Events.onMessagesDragEnter.fire({ fid: fid });
        }
    },

    _getFid: function(id) {
        if (!id) {
            // DA_DEBUG_START
            DA.log("onDragEnter, no id", "warn", "MboxMail");
            // DA_DEBUG_END
            return;
        }
        
        var fid = this._targetId2fid(id);

        return fid ? fid : 0;

    },

    onDragOut: function(e, id) {
        var fid = this._getFid(id);
        if (fid) {
            YAHOO.util.Dom.removeClass($(id).parentNode, "labelTargeted");
            DA.mailer.Events.onMessagesDragOut.fire({ fid: fid });
        }
    },
 
    config: {
        scroll:      false,
        resizeFrame: false,
        centerFrame: true,
        dragElId:    "mboxmaildd_dragProxy"
    },

    startDrag: function(x, y) {
        this.mboxGrid._isBeingDragged = true;
    }

});

YAHOO.util.Event.on(window, "load", function(){
    var div = document.createElement("div");
    div.id = "mboxmaildd_dragProxy";
    Object.extend(div.style, {
        visibility:         "hidden",
        position:           "absolute",
        top:                "0px",
        left:               "0px",
        width:              "20px",
        height:             "15px",
        backgroundImage:    "url('/images/ico_fc_mail.gif')",
        backgroundPosition: "center center",
        backgroundRepeat:   "no-repeat"
    });
    document.body.appendChild(div);
});



/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * Our very own loadRows implementation. 
 * <p>
 * FIXME: This contains mailer-specific code!
 *        This should be made general as soon as Kadowaki-san
 *        implements an Array-of-Arrays protocol.
 * 
 * @method loadRows
 * @private ? // TODO: How does one classify such methods?
 * @param obj Object an object retrieved by eval'ing the JSON response
 */
Rico.LiveGridBuffer.prototype.loadRows = function(obj) {

    var totalMessages;

    if (obj.view) {
        // FIXME: Mailer-specific code!
        totalMessages = obj.view.messages; // TODO: null checks...
        this.metaData.setTotalRows( totalMessages ? totalMessages : 0 ); // TODO: error handling
    }

    if (DA.util.isEmpty(obj.srid)) {
        DA.mailer.Events.onMboxGridLoadRows.fire({
            fid:      obj.fid,
            count:    totalMessages ? totalMessages : 0,
            response: obj
        });
    }

    return obj.mail_list || [] /*NPE protection: Rico calls this method, and does not check*/;
                          // AoA; each Array in the array consists of:
                          // (1) a first element which is the metadata
                          // (2) the remaining elements which are the visible data

};


