/*for JSLINT undef checks*/
/*extern $H Ajax DA YAHOO*/
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.io) {
    alert("ERROR: missing DA.js or io.js"); // TODO: formalize/cleanup
}


/**
 * TODO: comments, docs
 *
 */
DA.io.JsonIO = function(url, defaultParams){
   
    // DA_DEBUG_START
    DA.log("Setup up JSON-IO, url: " + url, 'info', 'JSONIO');
    // DA_DEBUG_END
    
    this.defaultParams = defaultParams;
    this.url = DA.util.setUrl(url);

};

(function(){

// Private
var isObject, isFunction;
try {
	isObject = YAHOO.lang.isObject;
	isFunction = YAHOO.lang.isFunction;
} catch(e) {
	isObject = function(obj) {
		return DA.util.isObject(obj) || DA.util.isFunction(obj);
	};
	isFunction = DA.util.isFunction;
}

DA.io.JsonIO.prototype = {

    defaultParams: undefined,

    /**
     * This will be be called after the JSON response has been eval'ed
     * to a Javascript object.
     * Users of JsonIO must assign a function to callback to be able to
     * do something with the object (eval'ed server response)
     * @method callback 
     * @param obj  {Object} Eval'ed server JSON response
     * @param args {Hash}   Reference to the actual parameters used
     * @protected
     */
    callback: function(obj, args) { /* EMPTY FUNCTION */ },

    /**
     * This will be called when an error has been encountered.
     * Users of JsonIO must assign a function to errorHandler
     * to be able to customize the error handling method.
     * Default errorHandler just pops up a Javascript alert...
     * @param e          {Object} error information in a hash 
     * @param actualArgs {Object} Reference to the actual original arguments.
     * @method errorHandler
     * @protected
     */
    errorHandler: function(e, actualArgs) { 
        /*
        if (e && e.type == 'INVALID_CONTENTTYPE') {
            // TODO
            //something.innerHTML = e.body; 
        }
        */
        var s = "";
        var v;
        for (var p in e) {
            try {
                v = e[p];
                if (typeof v === 'function') {continue;}
                s += (p + ":" + v + "\n");
                // TODO: truncate (or rather, quite appending to) s
                //       when the string gets too long...
            } catch (er) {  }
        }
        DA.log("JSON-IO ERROR:" + e, 'error', "JSONIO");
        alert("ERROR: JSON-IO: response was: " + s);
    },
    
    htmlHandler: function(e) {
        var win = DA.windowController.winOpen();
        
        win.document.open();
        win.document.write(e.body);
        win.document.close();
        
        window.close();
    },

    /**
     * The HTTP method to use. Must be either 'get' or 'post'. The default
     * is set as 'post'.
     * @property method
     * @type {String}
     */
    method: 'post',

    /**
     * Perform the IO.
     * Optionally, use the parameters passed (a HASH of name-value pairs)
     * @method execute
     * @param params   {Hash}     (optional) hash of name-value pairs
     * @param callback {Function} (optional) use this as the callback
     * @param callback {Hash}     (optional) DWR-style callback meta-data:
     *                            properties callback, errorHandler are functions
     */
    execute: function( params , callback ) {

        var _params = undefined;

        var callbackFunc     = this.callback;
        var errorHandlerFunc = this.errorHandler;
        var htmlHandlerFunc  = this.htmlHandler;

        // See if we are using an invocation-specific callback
        if (callback) {
            if (isFunction(callback)) {
                callbackFunc = callback;
            } else if (isObject(callback)) {
                if (isFunction(callback.callback)) {
                    callbackFunc = callback.callback;
                } 
                if (isFunction(callback.errorHandler)) {
                    errorHandlerFunc = callback.errorHandler; 
                } 
            } 
        }

        if (this.defaultParams) {
            _params = {};
            Object.extend(_params, this.defaultParams);
        } 
        
        if (params) {
            _params = _params ? _params : {};
            Object.extend(_params, params);
        }

        var _url = this.url;
        // TODO: method changer
        // var _url = _params ? 
        // FIXME: PERFORMANCE -- $H(..), toQueryString might be slow
        //            (this.url + '?' + $H(_params).toQueryString()) : // params added
        //            this.url;                                      // no params
        
        // DA_DEBUG_START
        var __start_time = new Date();
        // DA_DEBUG_END
        
        var serial  = DA.io.Manager.loading(_url);
        var cserial = encodeURIComponent(serial);

        // TODO: Verify if Ajax.Request is fast enough. (seems synchy)
        // serial = No cache fix.
        var req = new Ajax.Request( _url.match(/\?/) ? _url + '&serial=' + cserial : _url + '?serial=' + cserial, {
            method: this.method,
            parameters: $H(_params).toQueryString(),
            onSuccess: function(transport) { /* assuming transport will never be null*/
                // DA_DEBUG_START
                var __io_done_time = new Date();
                var __eval_done_time; // Will use this in the try block
                // DA_DEBUG_END
                var contentType = transport.getResponseHeader('Content-Type');
                if (!contentType || !contentType.match(/(js|json|javascript)/i)) {
                    DA.io.Manager.done(serial);
                    htmlHandlerFunc({
                        type:        "INVALID_CONTENTTYPE",
                        contentType: contentType,
                        body:        transport.responseText
                    });
                    return;
                } 
                // all OK
                var jsonText = transport.responseText;
                var obj; // Because try blocks are blocks
                try {
                    obj = eval('('+ jsonText +')');
                    // DA_DEBUG_START
                    __eval_done_time = new Date();
                    // DA_DEBUG_END
                    if ('object' === typeof obj) {
                        DA.io.Manager.done(serial);
                        callbackFunc(obj, _params);
                        // DA_DEBUG_START
                        DA.log(_url + 
                               " IO: " + DA.util.time_diff(__start_time, __io_done_time) + "ms," + 
                               " EVAL: " + DA.util.time_diff(__io_done_time, __eval_done_time) + "ms," +
                               " callback: " + DA.util.time_diff(__eval_done_time) + "ms.",
                               "time", "JSONIO");
                        // DA_DEBUG_END
                    } else {
                        DA.io.Manager.done(serial);
                        errorHandlerFunc({
                            type:        "NOT_AN_OBJECT",
                            contentType: contentType,
                            body:        transport.responseText
                        }, _params);
                    }
                } catch(e) {
                    DA.io.Manager.done(serial);
                    errorHandlerFunc(e, _params);
                }
            },
            onFailure: function(err) {
                // DA_DEBUG_START
                DA.log("JSON-IO failure: " + err + ": " + 
                       "time: " + DA.util.time_diff(__start_time) + "ms", 
                       "error", "JSONIO");
                // DA_DEBUG_END
                DA.io.Manager.done(serial);
                errorHandlerFunc(err, _params);
            },
            
            onException: function (e) {
                // DA_DEBUG_START
                // debugger;
                DA.log('Exception from Prototype:'+e,'error','JSONIO');
                // DA_DEBUG_END
            }
        
        });
        
    }

};

})();

