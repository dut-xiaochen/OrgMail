/* $Id: event.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/event/event.js $ */
/*for JSLINT undef checks*/
/*extern BrowserDetect DA */
/**
 * TODO: comments
 */
if (!DA || !DA.util) {
    alert("ERROR: missing DA.js"); // TODO: formalize/cleanup
}

if (typeof DA.event === "undefined") {
    DA.event = {};
}

DA.event = {
    
    get: function(e) {
        if (e) {
            return e;
        } else {
            return window.event;
        }
    },
    
    onClick: function(e) {
        if (e.button === 0) {
            return true;
        } else {
            return false;
        }
    },
   
    /**
     * FIXME: this is hard to understand and needs comments...
     */
    onContextMenu: function(e) {
        var b = (BrowserDetect.browser === 'Explorer') ? 0 : 2;
        
        if (e.button === b) {
            return true;
        } else {
            return false;
        }
    }
};
