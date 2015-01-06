/* $Id: mailer.js 1417 2007-06-28 01:58:25Z faiz_kazi $ -- $HeadURL: http://yuki/svn/iseria/insuite-ui/trunk/src/mailer/mailer.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO Prototype $A $H */
/**
 * All Read-Write operations (as seen/done from the client/javascript) on mailbox's
 * and their contents:
 */


(function () { // begin private scope...

// Create a default do-nothing-but-crib CustomEvent
var unimplementedEvt = new YAHOO.util.CustomEvent("unimplemented");
unimplementedEvt.subscribe(function (type, args) {
    // DA_DEBUG_START
    DA.log("Unimplemented Custom Event","error", 'AbstMsgProc');
    debugger;
    // DA_DEBUG_END
});


/**
 * Abstract Message Processor (in want of a better name...)
 *
 * Abstract base class that handles all the message processing stuff.
 * Subclasses can implement specifi methods that do things like 
 * move, delete, flag messages.
 *
 * @class AbstMsgProc
 * @abstract
 */
DA.mailer.util.AbstMsgProc = function () {};


DA.mailer.util.AbstMsgProc.prototype = {
   
    /**
     * @property _serialNo
     * @type {Number}
     * @private
     */
    _serialNo: 0,

    /**
     * Collection of utility methods.
     * FIXME: more reusability needed: similar methods are already defined in mboxgrid!
     * @property _utils
     * @private
     * @type {object} hash of functions
     */
    _utils: {
    
        asFidColonUid: function (m) {
            // DA_DEBUG_START
            if (!YAHOO.lang.isNumber(parseInt(m.fid, 10))) {
                DA.log("Fid missing!", "error", "AbstMsgProc");
                debugger;
            }
            // DA_DEBUG_END
            return m.fid + ':' + m.uid;
        },

        asFidColonUidRange: function(r){
            // FIXME: No null checks (start? end? if they are undefined?)
            return r.start.fid + ":" + r.start.uid + "-" + r.end.fid + ":" + r.end.uid;
        }
    
    },
    

   /**
    * process the command.
    * @method proc
    * @protected
    * @param   oMessages {Object} a message collection (singles, single, count, ranges, etc)
    * @param   oArgs     {Object} a hash of parameters to pass along.
    * @params  params    {Object} Reference to the original parameters...
    */
   proc: function( oMessages, oArgs, params ) {

        if (!oMessages.count) {
            // DA_DEBUG_START
            DA.log("No mails specified", "warn", "MessageMover");
            // DA_DEBUG_END
            return;
        }

        // Build a list of FID:UID strings.
        var uidList = oMessages.singles.map( this._utils.asFidColonUid );

        // Area selection
        var areas = oMessages.ranges.map( this._utils.asFidColonUidRange );

        var ioArgs = Object.extend(oArgs || {}, {
            uid: uidList.join(','),
            area: areas.join(',')
        });

        ++this._serialNo;

        var jobId = this._serialNo;

        var evtDone    = this.evtDone;
        var evtDoing   = this.evtDoing;
        var evtFailure = this.evtFailure;
       
        this.io.execute( ioArgs, {
            callback: function (response) {
                if (!DA.mailer.util.checkResult(response)) {
                    evtFailure.fire( jobId, params, response );
                }
                evtDone.fire( jobId, params, response );
            },
            errorHandler: function (e) {
                evtFailure.fire( jobId, params, e );
            }
        });
        
        window.setTimeout( function () {
            evtDoing.fire( jobId, params );
        }, 10);

    },

    /**
     * @method mockProc
     * @param oParams {Object}
     * @param oServerResponse {Object}
     */
    mockProc: function (oParams, oServerResponse) {
        ++this._serialNo; // directly incrementing a private counter, but should be OK..
        var jobId = this._serialNo;
        this.evtDoing.fire(jobId, oParams);
        // TODO: what about MoveFailure?
        this.evtDone.fire(jobId, oParams, oServerResponse);
    },

    evtDoing:   unimplementedEvt,
    evtDone:    unimplementedEvt,
    evtFailure: unimplementedEvt,
    // TODO: make a mock obj
    io:         null

};



/**
 * Utility class for both moving and deletion of mail messages. This can move
 * a given message (or, an array of messages) from a given IMAP folder to 
 * another IMAP folder; or, depending on the settings, either directly delete
 * or move the given messages to the TRASH folder.
 * 
 * @class MessageMover
 * @constructor
 */
DA.mailer.util.MessageMover = function () {
    // Use one IO instance for both deletion and move: Defaulting to 'move'
    this.io = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi', { proc: 'move' } );
};

YAHOO.lang.extend(DA.mailer.util.MessageMover, DA.mailer.util.AbstMsgProc, {

    /**
     * @property trashFid
     * @type {Number}
     */
    trashFid: 0,

    /**
     * MOVE, MOVE to TRASH, or DELETE the given message(s), and call the specified
     * callback (onMoved) after completed.<p>
     * NOTE: All the given mails MUST belong to the same source folder. (those that
     * do not, will be discarded (not moved/deleted))
     * @method move
     * @params {Object} hash with the following properties
     *                  - target   {Hash}     Destination
     *                  - messages {Hash}     Collection of Messages (singles, ranges, etc)
     */
    move: function(params) {

        // DA_DEBUG_START
        DA.log("start move:", "time", "MessageMover");
        // DA_DEBUG_END

        if (!params) {
            throw "No params to move";
        }

        if (!params.messages || !params.target || !(params.target.fid || (params.target.trash===true))) {
            throw "Invalid/Insufficient params to move:" + $H(params).inspect();
        }

        // FIXME: What happens to this when we implement multi-move?
        var srcFid = params.messages.fid; // Source folder ID
        // Check if we are attempting to move into the same folder...
        if (DA.util.cmpNumber(srcFid, params.target.fid)) {
            // Do nothing...
            // DA_DEBUG_START
            DA.log('src/dest same; cannot move', 'error', 'MessageMover');
            // DA_DEBUG_END
            return;
        }

        // The target folder depends on whether or not this is a move-to-trash
        var target_fid = params.target.trash === true ? this.trashFid : params.target.fid;
            
        var ioArgs = { fid:  srcFid };

        if (params.messages.srid) {
            ioArgs.srid = params.messages.srid;
        }

        ioArgs.extend(
            (params.target.trash && this.reallyDelete(srcFid)) ? // Check to see if we must do a real DELETE
                    { proc: 'delete' } : { proc: 'move', target_fid: target_fid }
        );

        this.proc(params.messages, ioArgs, params /*the original params*/);
       
        // DA_DEBUG_START
        DA.log("end move:", "time", "MessageMover");
        // DA_DEBUG_END
    },


    /**
     * Depending on the source folder (whether or not the source folder is the TRASH folder)
     * and the user's settings ((a) Move to trash, or, (b) Delete immediately),
     * determines whether or not to perform an actual DELETE (as opposed to just moving
     * the mail to the TRASH folder)
     * @method reallyDelete
     * @param srcFid {Int} ID of the source IMAP folder
     * @rerurns {Boolean} TRUE if we have to perform an actual delete, FALSE otherwise
     */
    reallyDelete: function(srcFid) {
        if (!srcFid) { return false; /* play it safe... */ }
        if (parseInt(srcFid, 10) === parseInt(this.trashFid, 10)) {
            // We are removing something from the trash folder... bye!
            return true;
        }
        return DA.vars.config['delete'] === 1;
    },

   
    /**
     * @method mockMove
     * @param oParams {Object}
     * @param oServerResponse {Object}
     */
    mockMove: function (oParams, oServerResponse) {
        this.mockProc(oParams, oServerResponse);
    },

    evtDoing:   DA.mailer.Events.onMessagesMoving,
    evtDone:    DA.mailer.Events.onMessagesMoved,
    evtFailure: DA.mailer.Events.onMessagesMoveFailure

});



/**
 * Utilty class that provides a facade for performing all 'flag' operations
 * on a message (or a collection of messages). This covers marking the
 * messages as 'seen', 'unseen', 'flag', 'unflag' (all that ajx_ma_flag.cgi)
 * has to offer. It also throws CustomEvents (onMessagesFlagging, onMessagesFlagged, etc)
 * @class MessageFlagger
 * @constructor
 */
DA.mailer.util.MessageFlagger = function () {  
    /**
     * @property io
     * @type {Object} instance of DA.io.JsonIO
     */
    this.io = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_flag.cgi');
};

YAHOO.lang.extend(DA.mailer.util.MessageFlagger, DA.mailer.util.AbstMsgProc, {
    /**
     * @method flag
     * @param params {Object} Hash with the properties:
     *                  - property   {String}   Can be 'seen' or  'flagged'
     *                  - state      {Boolean}  
     *                  - messages   {Hash}     Collection of Messages (singles, ranges, etc)
     */
    flag: function (params) {
        var property, messages; 
        if (!params || !this._isValidProp(property = params.property) || !(messages = params.messages)) {
            // DA_DEBUG_START
            DA.log('bad args to flag','error', 'MessageFlagger');
            // DA_DEBUG_END
            return;
        }

        var ioArgs = {
            proc: (params.state === false) ? 'un'+property : property,
            fid:  messages.fid
        };

        if (messages.srid) {
            ioArgs.srid = messages.srid;
        }

        this.proc(messages, ioArgs, params);

    },
    
    /**
     * @method mockFlag
     * @param oParams {Object}
     * @param oServerResponse {Object}
     */
    mockFlag: function (oParams, oServerResponse) {
        this.mockProc(oParams, oServerResponse);
    },

    /**
     * @method _isValidProp
     * @returns {Boolean}
     * @param sProp {String}
     */
    _isValidProp: function (sProp) {
        return YAHOO.lang.isString(sProp) &&
               (sProp === 'seen' || sProp === 'flagged');
    },

    evtDoing:   DA.mailer.Events.onMessagesFlagging,
    evtDone:    DA.mailer.Events.onMessagesFlagged,
    evtFailure: DA.mailer.Events.onMessagesFlagFailure

});


})(); // End private scope
