/*
Copyright (c) 2011, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern $ DA Element Prototype Ext Event BrowserDetect*/

if (!DA) {
    throw "ERROR: missing DA.js or DA-min.js";
}
if (!DA.ug) {
    DA.ug = {};
}

/**
 * TODO: comments, JSDOC
 * @constructor
 * @class AccountController
 */
DA.ug.AccountController = function(incSearch, cfg, cbh) {
    this.init(incSearch, cfg, cbh);
};

DA.ug.AccountController.prototype = {
    cfg: null,

    cbh: null,

    init: function(incSearch, cfg, cbh) {
        this.incSearch = incSearch;
        this.cfg = cfg ? Object.extend({}, cfg) : {};
        this.cbh = cbh ? Object.extend({}, cbh) : {};
    },

    openUsersel: function() {
        var userselIO = new DA.io.JsonIO( DA.vars.cgiRdir + "/ajx_api.cgi" );

        var me = this;
        userselIO.callback = function(o) {
            if (o.error) {
                DA.util.error(me.cfg.errCode[o.error]);
            } else {
                if (DA.util.isFunction(me.cbh.onOpened)) {
                    me.cbh.onOpened(o);
                }
            }
        };

        userselIO.errorHandler = function(o) {
            DA.util.warn(me.cfg.errCode.ERR_SYS_000000);
        };

        userselIO.execute({
            proc: "usersel_open",
            proc_no: me.cfg.proc_no,
            usersel: this.incSearch.recordList("|", ['id', 'sum'])
        });
    },

    closeUsersel: function(extension) {
        var userselIO = new DA.io.JsonIO( DA.vars.cgiRdir + "/ajx_api.cgi" );

        var me = this;
        userselIO.callback = function(o) {
            var i;
            if (o.error) {
                DA.util.error(me.cfg.errCode[o.error]);
            } else {
                me.incSearch.clearItem();
                if (DA.util.isArray(o.selectedItems)) {
                    for (i = 0; i < o.selectedItems.length; i ++) {
                        me.incSearch.addItem({
                            id: o.selectedItems[i].id,
                            data: {
                                type: o.selectedItems[i].type,
                                name: o.selectedItems[i].name,
                                tel3: o.selectedItems[i].tel3,
                                sum: o.selectedItems[i].sum
                            }
                        });
                    }
                }
                if (DA.util.isFunction(me.cbh.onClosed)) {
                    me.cbh.onClosed(o);
                }
            }
        };

        userselIO.errorHandler = function(o) {
            DA.util.warn(me.cfg.errCode.ERR_SYS_000000);
        };

        userselIO.execute({
            proc: "usersel_close",
            proc_no: me.cfg.proc_no,
            extension: extension || false
        });
    }
};

