/* $Id: io.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/io/io.js $ */
/*for JSLINT undef checks*/
/*extern DA */
/**
 * TODO: comments
 */
if ('undefined' === typeof DA) {
    alert("ERROR: need DA.js");
} else {
    if (! DA.io) {
        DA.io = {};
    }
}

/**
 * TODO: comments, docs
 *
 */
DA.io.Manager = {
    data: {},
    
    _serialize: function(url) {
        return url + '_' + DA.util.getTime();
    },
    
    loading: function(url) {
        var s;
        
        if (DA.util.isEmpty(url)) {
            return '';
        } else {
            s = this._serialize(url);
            
            this.data[s] = true;
            
            return s;
        }
    },
    
    done: function(s) {
        if (!DA.util.isEmpty(s)) {
            delete this.data[s];
        }
    },
    
    isActive: function() {
        var key, active = false;
        
        for (key in this.data) {
            if (!DA.util.isFunction(this.data[key])) {
                active = true; break;
            }
        }
        
        return active;
    }
};
