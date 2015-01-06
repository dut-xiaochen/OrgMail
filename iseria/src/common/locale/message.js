/* $Id: message.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/locale/message.js $ */
/*for JSLINT undef checks*/
/*extern DA */
/**
 * TODO: comments
 */
if (!DA || !DA.util) {
    alert("ERROR: missing DA.js or DA.util"); // TODO: formalize/cleanup
}

if (typeof DA.locale === "undefined") {
    DA.locale = {};
    DA.locale.message = {};
}

DA.locale.GetText = {
    t_: function(key) {
        var text = DA.locale.GetText._replace(DA.locale.GetText._get(key), arguments);

        return(text);
    },
    
    _get: function(key) {
        var text;
        
        if (!DA.util.isEmpty(DA.locale.message.custom[key])) {
            text = DA.locale.message.custom[key];
        } else if (!DA.util.isEmpty(DA.locale.message.core[key])) {
            text = DA.locale.message.core[key];
        } else {
            text = key;
        }
        
        return text;
    },
    
    _replace: function(t, args) {

        var text = t.replace(/\%\d+/g, function(s) {
            var n = s.replace(/^\%/, "");
                n = parseInt(n, 10);
            
            if (n > 0 && !DA.util.isEmpty(args[n])) {
                return args[n];
            } else {
                return "";
            }
        });
        
        return text;
    }
};
