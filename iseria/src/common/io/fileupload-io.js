/* $Id: fileupload-io.js 2039 2009-11-11 08:29:34Z yp_shao $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/io/fileupload-io.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.io) {
    alert("ERROR: missing DA.js or DA.io"); // TODO: formalize/cleanup
}

if (!YAHOO.util || !YAHOO.util.Dom || !YAHOO.util.Connect) {
    alert("ERROR: missing YAHOO.util or YAHOO.util.Dom or YAHOO.util.Connect"); // TODO: formalize/cleanup
}

/**
 * TODO: comments, docs
 *
 */
DA.io.FileUploadIO = function(url, formId, defaultParams){
    
    this.url    = DA.util.setUrl(url);
    this.formId = formId;
    this.defaultParams = defaultParams;
    
    if (location.href.match(/^[hH][tT][tT][pP][sS]\:\/\//)) {
        this.secureUri = true;
    } else {
        this.secureUri = false;
    }

};

DA.io.FileUploadIO.prototype = {

    url: null,

    formId: null,
    
    defaultParams: undefined,
    
    secureUri: null,

    /**
     * This will be be called after the file upload response has been eval'ed
     * to a Javascript object.
     * Users of FileUploadIO must assign a function to callback to be able to
     * do something with the object (eval'ed server response)
     * @method callback 
     * @param obj (Object) Eval'ed server JSON response
     * @param args {Hash}   Reference to the actual parameters used
     * @protected
     */
    callback: function(obj, args) { /* EMPTY FUNCTION */ },

    /**
     * This will be called when an error has been encountered.
     * Users of FileUploadIO must assign a function to errorHandler
     * to be able to customize the error handling method.
     * Default errorHandler just pops up a Javascript alert...
     * @param e (Object) error information in a hash
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
        var v, s = "";
        for (var p in e) {
            try {
                v = e[p];
                if (typeof v === 'function') {continue;}
                s += (p + ":" + v + "\n");
                // TODO: truncate (or rather, quite appending to) s
                //       when the string gets too long...
            } catch (er) {  }
        }
        DA.log("FileUpload-IO ERROR:" + e, "fileupload-io.js");
        alert("ERROR: FileUpload-IO: response was: " + s);
    },
    
    htmlHandler: function(e) {
        var win = DA.windowController.winOpen();
        
        win.document.open();
        win.document.write(e.body);
        win.document.close();
        
        window.close();
    },

    /**
     * Perform the IO.
     * Optionally, use the parameters passed (a HASH of name-value pairs)
     * @method execute
     * @param params (HASH) optional hash of name-value pairs
     */
    execute: function(formId, params) {
      
        var me = this;
        
        var _params = undefined;
        
        if (this.defaultParams) {
            _params = {};
            Object.extend(_params, this.defaultParams);
        } 
        
        if (params) {
            _params = _params ? _params : {};
            Object.extend(_params, params);
        }
        
        var _url = this.url;

        // DA_DEBUG_START
        var __start_time = new Date();
        // DA_DEBUG_END
        
        if (!formId) {
            formId = this.formId;
        }
        
        var serial = DA.io.Manager.loading(_url);
        
        try {
            YAHOO.util.Connect.setForm(YAHOO.util.Dom.get(formId), true, this.secureUri);   
            YAHOO.util.Connect.asyncRequest('POST', _url, {
                upload: function(transport) {
                    // DA_DEBUG_START
                    var __io_done_time = new Date();
                    // DA_DEBUG_END

                    // all OK
                    var obj;
                    var __eval_done_time;
                    var jsonText = transport.responseText;
                    jsonText = jsonText.replace(/^<pre>/i, "");
                    jsonText = jsonText.replace(/<\/pre>[\s\r\n\t]*$/i, "");

                    obj = eval('('+ jsonText +')');
                    // DA_DEBUG_START
                    __eval_done_time = new Date();
                    // DA_DEBUG_END
                    if ('object' === typeof obj) {
                        DA.io.Manager.done(serial);
                        me.callback(obj, _params);
                        // DA_DEBUG_START
                        DA.log("FileUpload-IO:" + 
                               " IO: " + DA.util.time_diff(__start_time, __io_done_time) + "ms," + 
                               " EVAL: " + DA.util.time_diff(__io_done_time, __eval_done_time) + "ms," +
                               " callback: " + DA.util.time_diff(__eval_done_time) + "ms.",
                               "time", "fileupload-io.js");
                        // DA_DEBUG_END
                    } else {
                        // TODO: case by error(text/html)
                        DA.io.Manager.done(serial);
                        me.htmlHandler({
                            type: "NOT_AN_OBJECT",
                            // contentType: "text/html",
                            body: transport.responseText
                        });
                    }
                },
                
                failure: function(transport) {
                    // DA_DEBUG_START
                    DA.log("FileUpload-IO failure: " + transport.statusText + ": " + 
                       "time: " + DA.util.time_diff(__start_time) + "ms", 
                           "error", "fileupload-io.js");
                    // DA_DEBUG_END
                    DA.io.Manager.done(serial);
                    me.errorHandler({
                        type: "NOT_AN_OBJECT",
                        // contentType: "text/html",
                        body: transport.statusText
                    }, _params);
                }
            });
        } catch(e) {
            DA.io.Manager.done(serial);
            me.errorHandler(e, _params);
        }   

    }

};

