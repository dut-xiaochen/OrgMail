/* $Id: mailer.js 1417 2007-06-28 01:58:25Z faiz_kazi $ -- $HeadURL: http://yuki/svn/iseria/insuite-ui/trunk/src/mailer/mailer.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO Prototype $A $H */
/**
 * TODO: comments
 */

(function () { // private scope

var bInitDone = false;
var oConfig = {};
var messageMover = {
    // Fallback function (must not be used!)
    // This will get called only if a real instance of MessageMover is
    // not available (i.e., if it was never created)
    move: function  () {
        // DA_DEBUG_START
        DA.log('No MessageMover! requested move: '+$A(arguments).inspect(), 'error', 'mailer/app');
        debugger;
        // DA_DEBUG_END
    }
};

var messageFlagger = {
    // Fallback function (must not be used!)
    // This will get called only if a real instance of MessageFlagger is
    // not available (i.e., if it was never created)
    flag: function  () {
        // DA_DEBUG_START
        DA.log('No MessageFlagger! requested flag: '+$A(arguments).inspect(), 'error', 'mailer/app');
        debugger;
        // DA_DEBUG_END
    }
};



// Deep copy of object graphs of nestes hashes/arrays
// Will limit recursion to 10 levels, and will ignore
// functional values.
var isArray = YAHOO.lang.isArray;
function deepCopy(o) {
    var depth = arguments[1] || 0;
    ++depth;
    if (depth > 10) { return {}; }
    if (o === null || typeof o !== 'object') {
        return o;
    }

    // Could be an array or an object
    var ret, i, len, val;
    
    if (isArray(o)) {
        ret = [];
        len = o.length;
        for (i = 0; i < len; ++i) {
            ret[i] = deepCopy(o[i], depth);
        }
    } else {
        ret = {};
        $H(o).each(function (item, i) {
            ret[item.key] = deepCopy(item.value);
        });
    }

    return ret;

}

function mkMsgColl(oMMData) {
    return {
        fid:      oMMData.fid,
        count:    1,
        singles:  [oMMData],
        single:   oMMData,
        ranges:   [],
        identity: {}
   
    };
}


function mkSubs(f) {
    return function(type, args) {
        if (!args || !args[0]) { 
            // DA_DEBUG_START
            DA.log(type + " event useless", "error", 'mailer/app');
            debugger;
            // DA_DEBUG_END
            return; 
        }
        return f(args[0]);
    };
}

var E = DA.mailer.Events;
if (!E) {
     // DA_DEBUG_START
     DA.log('No Custom Events!', 'error', 'mailer/app');
     debugger;
     // DA_DEBUG_END
     return;
}


function setupPlumbing(app) {
    
    E.onFolderTreeReady.subscribe(mkSubs(function(folderTree){
        
        ['trash', 'sent', 'draft', 'backupFolder'].each(function(sIDProp){
            var prop = sIDProp + 'Fid';
            var id = parseInt(folderTree[prop], 10);
            if (YAHOO.lang.isNumber(id)) {
                oConfig[prop] = id;
                messageMover[prop] = id;
            } else {
                // DA_DEBUG_START
                DA.log('FolderTreeReady event provides no '+prop,'error','mailer/app');
                // DA_DEBUG_END
            }
        });
        
    }));

    // Proxy all Message Move Requests to the Message Mover
    E.onMessageMoveRequest.subscribe(mkSubs(function(o){
        var myo = deepCopy(o);  /* copy as much as possible into this context
                                 * to workaround enexpected data-loss bugs 
                                 * due to garbage collection (which could occur
                                 * in certain cross-window scenarios) */
        setTimeout(function() { // asynchronously
            messageMover.move( myo ); 
        }, 10);
    }));

    // Proxy all Message Flag Requests to the Message Flagger
    E.onMessageFlagRequest.subscribe(mkSubs(function(o){
        var myo = deepCopy(o);  // See Comments above (onMessageMoveRequest)
        setTimeout(function() { // asynchronously
            messageFlagger.flag( myo );
        }, 10);
    }));


    // One handler for both sending or saving messages
    function mkSentOrSavedHandler(folder) {
        return function(type, args) {
                var mmdata  = args[0];
                var resp    = args[1];
                if (!mmdata || !resp) {
                    // DA_DEBUG_START
                    DA.log('Bad/Missing args for event:'+type, 
                           'error', 'mailer/app');
                    // DA_DEBUG_END
                    return;
                }
                mmdata = deepCopy(mmdata);
                resp   = deepCopy(resp);
                if(mmdata.mode !== 0)
                {
       				mmdata.originuid = mmdata.uid;
                }
                var req = {
                    messages: mkMsgColl(mmdata),
                    target:   { fid: oConfig[folder] }
                };
                var originFid = parseInt(mmdata.fid, 10);
                if (originFid !== oConfig.draftFid &&
                    originFid !== oConfig.sentFid && originFid !== oConfig.backupFolderFid && originFid !== oConfig.localFolderFid) {
                    req.messages.single.uid = 0;
                }
                window.__mboxGrid.refreshGrid();
                setTimeout(function () { // Async; always a good idea
                    messageMover.mockMove(req, resp);
                }, 10);
            };

    }

    E.onMessageSent.subscribe( mkSentOrSavedHandler('sentFid'), app, true );

    E.onMessageSaved.subscribe( mkSentOrSavedHandler('draftFid'), app, true );

}


DA.mailer.Application = {
    
    init: function () {
        if (bInitDone) {
            // DA_DEBUG_START
            DA.log("init called again",'error','mailer/app');
            // DA_DEBUG_END
            // TODO: throw an exception as well?
            return;
        }

        messageMover = new DA.mailer.util.MessageMover();
        messageFlagger = new DA.mailer.util.MessageFlagger();

        setupPlumbing(this);

        bInitDone = true;
        return this;
    }



};


})();
