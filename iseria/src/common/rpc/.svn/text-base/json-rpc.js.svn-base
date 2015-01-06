/* $Id: io.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://yuki.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/io/io.js $ */
/*for JSLINT undef checks*/
/*extern $A Ajax DA YAHOO Prototype */
/*
Copyright (c) 2007, DreamArts. All rights reserved.

Support for JSON-RPC.
<i>Note: needs Prototype version 1.5.1 and above (1.6.0_rc0 testes OK)</i>

version: ??
*/
if (!DA || !DA.RPC) {
    alert("ERROR: missing DA.js or DA.RPC"); // TODO: formalize/cleanup
}

(function () { // define everything in a private scope

// Private
var isObject   = YAHOO.lang.isObject;
var isArray    = YAHOO.lang.isArray;
var isFunction = YAHOO.lang.isFunction;
var isString   = YAHOO.lang.isString;

var serialNo   = 0;

/**
 * Utility function that splits and arguments array into
 * the actual arguments (from the 1st to (n-1)th element) and
 * the callback-meta-info object (the nth element).
 * The split portionals are returned in an object lteral.
 * @method _splitArgsCallbacks
 * @private
 * @param aArgs {Array} The 'arguments' array; the last element
 *                      is expected to contain callback-meta-info
 * @returns {Object} object literal with keys:
 *                     - args      {Array}  The actual arguments
 *                     - callbacks {Object} object literal of callback-meta-info
 */
function _splitArgsCallbacks (aArgs) {
    var arr = $A(aArgs);
    var len = arr.length;
    if (len === 0) {
        return {
            args:      [],
            callbacks: undefined
        };
    }
    var last = arr.last();
    if (last && 
        (isFunction(last) || isFunction(last.success))) {
        // The last argument is the callback-hash
        arr.splice(len-1, 1);
        return {
            callbacks:     last,
            args:          arr
        };
    } else { // No callback information passed in
        return {
            callbacks:    undefined,
            args:         arr
        };
    }
}


/**
 * This is a HACK!
 *
 * Helper function that runs in the (unusual) case where the response 
 * from the server is NOT JSON. (For example, if the response was HTML)
 * This code is sadly INSUITE-specific, in that it assumes the best way
 * to deal with the server spitting out HTML is to display the HTML to the
 * user.
 * SIDE-EFFECT:  may overwrite the HTML of the entire page!
 * @private handleBadReply
 * @param oResponse {Object} XHR response (or transport) object,
 *                           which is usually the same that is passed 
 *                           to the 'success' handler of Ajax.Request
 * @returns {Boolean} returns TRUE IF (and ONLY IF) the response contained
 *                           HTML.
 */
function handleBadReply (oResponse) {
    var contentType = oResponse.getHeader('Content-type');
    if (contentType && contentType.match('text/html')) {
        // RPC handler returned HTML!! 
        // could this be the logout page?
        window.setTimeout(
            function () {
                document.body.innerHTML = oResponse.responseText;
            },
            500);
        return true; // that means we handled it
    }
}

/**
 * Do the actual XMLHTTPRequest stuff (Actually, just delegate to YUI's connection utility);
 * Serialize the parameters into JSON, post it via Ajax, eval the response and 
 * call the corresponding callbacks.
 * @private
 * @method _execute
 * @param sUrl              {String}   URL of the JSON-RPC service.
 * @param sRemoteMethod     {String}   name of the remote method
 * @param oScope            {Object}   Execution scope (sets the binding for the 'this' keyword)
 * @param aDefaultArgs      {Array}    | 
 * @param oDefaultCallbacks {Object}   | See DA.RPC.JSON, method makeRPC
 * @param oDefaultCallbacks {Function} |
 * @param aArgs             {Array}    The actual arguments passed by the user (method invocation)
 *
 */
function _execute(sUrl, sRemoteMethod, oScope, aDefaultArgs, oDefaultCallbacks, aArgs) {

    // Split the original array of arguments into the arguments and the callback-meta-data.
    // the callback meta info is expected to be the last argument.
    var splitArgs  = _splitArgsCallbacks(aArgs);
    // If no callback info was passed in this invocation, use the defaults (if available)
    var cb         = splitArgs.callbacks ? splitArgs.callbacks : oDefaultCallbacks;
    // if no arguments were passed in this invovation, use the defaults
    var params     = (splitArgs.args.length === 0 && isArray(aDefaultArgs)) ? aDefaultArgs : splitArgs.args; 
  
    var successFunc = Prototype.emptyFunction;
    var failureFunc = Prototype.emptyFunction;
    var errorFunc   = Prototype.emptyFunction;

    if (isFunction(cb)) {
        successFunc = cb;
    } else if (isObject(cb)) {
        if (isFunction(cb.success)) { successFunc = cb.success; }
        if (isFunction(cb.failure)) { failureFunc = cb.failure; }
        if (isFunction(cb.error))   { errorFunc   = cb.error;   }
        if (isObject(cb.scope) && cb.scope) {
            oScope = cb.scope;
        }
    }

    var rpcReq = {
        method: sRemoteMethod,
        params: params, 
        id:     ++serialNo
    };
    var postData = Object.toJSON(rpcReq);

    var reqObj = new Ajax.Request(sUrl, {
        method: 'post',
        postBody: postData,
        contentType: 'application/json',
        onSuccess: function (response) {
            // DA_DEBUG_START
            DA.log('callback start','time', 'JSON-RPC');
            // DA_DEBUG_END
            var json;
            try {
                json = response.responseJSON;
                if (json && 'object' === typeof json) {
                    if (json.error) {
                        errorFunc.call(oScope, json.error);
                    } else {
                        successFunc.call(oScope, json.result);
                    }
                } else {
                    // DA_DEBUG_START
                    debugger;
                    DA.log("Eval failed: json was: \""+json+"\"", 'error', 'JSON-RPC');
                    // DA_DEBUG_END
                    // OK, so if it's not JSON, then what is it?
                    if (!handleBadReply(response)) {
                        throw "Bad reply from Server / JSON eval failed.";
                    }
                }
            } catch (e) {
                failureFunc.call(oScope, e);
            }
            // DA_DEBUG_START
            DA.log('callback end','time', 'JSON-RPC');
            // DA_DEBUG_END
        },
        onFailure: function (response) {
            // DA_DEBUG_START
            debugger;
            // DA_DEBUG_END
            failureFunc.call(oScope, response);
        }
    });

}


/**
 * Static class with static helper methods to create proxy functions which
 * invoke a predifined JSPN-RPC service.
 * @class JSON
 * @static
 */
DA.RPC.JSON = {

    /**
     * @method makeRPC
     * @static
     * @param sUrl              {String} URL
     * @param sRemoteMethod     {String} Name of the remote method.
     * @param oDefaultScope     {Object} what 'this' will default to.
     * @param aDefaultArgs      {Array}  paramters to use (if none are passed)
     * @param oDefaultCallbacks {Object} object-literal of callback-meta-info, with keys
     *                                     - success {Function}
     *                                     - error   {Function}
     *                                     - failure {Function}
     *                                     - scope   {Object}
     * @param oDefaultCallbacks {Function} function to use as the success callback.
     * @returns {Function} a proxy function which, when invoked, will run a JSON-RPC
     *                     request, calling the above callbacks in the specified scope
     *                     arguments 1 to n-1 are considered the params (for the RPC method); 
     *                     the last argument is callback-meta info (see @param oDefaultCallbacks)
     */
    makeRPC: function (sUrl, sRemoteMethod, oDefaultScope, aDefaultArgs, oDefaultCallbacks) {
        if (!isString(sRemoteMethod)) {
            throw "bad/missing RPC-remote-method-name";
        }
        if (!oDefaultScope) {
            oDefaultScope = window;
        }
        return function () {
            _execute(sUrl, sRemoteMethod, oDefaultScope, aDefaultArgs, oDefaultCallbacks, arguments);
        };
    },

    /**
     * FIXME: is this needed?
     * FIXME: If it is, isn't it general?
     * @method getLatestSerialNo
     * @static
     * @returns {Number}
     */
    getLatestSerialNo: function () {
        return serialNo;
    }

};

})();

