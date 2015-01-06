/*
Copyright (c) 2011, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern $ DA Element Prototype Insertion Event $break*/

if (!DA) {
    throw "ERROR: missing DA.js or DA-min.js";
}
if (!DA.textCal) {
    DA.textCal = {};
}

/**
 * TODO: comments, JSDOC
 * @class DateSelector
 * @param cfg {Object} Configuration options
 */
DA.textCal.DateSelector = function(textEl, name, cfg) {
    this.init(textEl, name, cfg);
};

DA.textCal.DateSelector.prototype = {

    lang: 'ja',

    yearList: [],

    firstDay: 0,

    holidayList: [],

    customDayColorList: [],

    textEl: null,

	linkClass: "",

	linkTitle: "",

    init: function(textEl, name, cfg) {
        if (cfg) {
            for (var i in cfg) {
                this[i] = cfg[i];
            }
        }

        this.textEl = $(textEl);
        this.textEl.style.imeMode = "disabled";

        this.name = name;
        this.divId = name + "DivId";
        this.imgId = name + "ImgId";

        var objName = ["DA.textCal.DateSelector._calObject['", name, "'].object"].join("");
        var html = ['<a id="', this.imgId, '" href="#" onclick="DA.textCal.DateSelector._calObject[\'', name, '\'].fncPopup(event, ', objName, ', \'', this.divId, '\', \'', this.imgId, '\');" class="', DA.util.encode(this.linkClass), '", title="', DA.util.encode(this.linkTitle), '">',
                    '<img src="', DA.vars.imgRdir, '/search_fc_calendar.png" align="absmiddle" border=0>',
                    '</a>',
                    '&nbsp;&nbsp;<div id="', this.divId, '" style="display:none"></div>'].join("");
        Insertion.After(this.textEl, html);

        var me = this;
        this.calSelector = new DA.cal.Calendar(this.divId, objName, {
            prefix: {
                year: 'yy',
                month: 'mm',
                day: 'dd'
            },
            lang: me.lang,
            firstDay: me.firstDay,
            yearList: me.yearList,
            holidayList: me.holidayList,
            customDayColorList: me.customDayColorList,
            minYear: me.minYear,
            maxYear: me.maxYear,
            linkFunc: "DA.textCal.DateSelector._calObject['" + me.name + "'].fncSet(" + objName + ",\'" + me.divId + "\')"
        }, {
            onSet: function(year, month, day) {
                me.textEl.value = [year, "/", me._twobytes(month), "/", me._twobytes(day)].join("");
            },
            onEnable: function() {
                $(me.imgId).style.display = "";
            },
            onDisable: function() {
                $(me.imgId).style.display = "none";
            }
        });
        this.calSelector.writeCal2();

        DA.textCal.DateSelector._calObject[this.name] = {
            object: this.calSelector,
            fncPopup: function(_ev, _calobj, _calid, _pickerid) {
                var a = me.textEl.value.split(/\//);
                var year = a[0] ? a[0] : 0;
                var month = a[1] ? a[1] : 0;
                var day = a[2] ? a[2] : 0;
                DA.cal.Calendar.fncPopup2(_ev, _calobj, _calid, _pickerid, year, month, day);
            },
            fncSet: function(_calobj, _calid) {
                DA.cal.Calendar.fncClose(_calid);

                if (_calobj.onSet) {
                    _calobj.onSet(_calobj.nowYear, _calobj.nowMonth + 1, _calobj.nowDay);
                }
            }
        };

        Event.observe(this.textEl, "change", function() {
            var val = me._validate(me.textEl.value);
            me.textEl.value = val;
        }, false);
    },

	_validate: function(date) {
        var ary = date.split(/\//);
        var year = parseInt(ary[0], 10);
        var month = parseInt(ary[1], 10);
        var day = parseInt(ary[2], 10);

        var i, exists = false;
        var l = this.yearList.length;
        if (l > 0) {
            this.yearList.each(function(y) {
                if (DA.util.cmpNumber(y, year)) {
                    exists = true; throw $break;
                }
            });
        } else {
            exists = true;
        }

        if (exists && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            return(year + "/" + this._twobytes(month) + "/" + this._twobytes(day));
        } else {
            return("");
        }
	},

    _twobytes: function(n) {
        return n < 10 ? "0" + n : "" + n;
    }

};

DA.textCal.DateSelector._calObject = {};

