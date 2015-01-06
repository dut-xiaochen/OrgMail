/* $Id: mailer.js 1417 2007-06-28 01:58:25Z faiz_kazi $ -- $HeadURL: http://yuki/svn/iseria/insuite-ui/trunk/src/mailer/mailer.js $ */
/*for JSLINT undef checks*/
/*extern DA Ext */
/**
 * TODO: comments
 */

if (!DA || !DA.scheduler) {
    throw "Error: Missing dependencies: (need: DA.js, scheduler.js";
}

if (!DA.widget.TimeRangeSlider || !DA.cal.DateRangeSelector) {
    throw "Error: Missing dependencies: (need: calendar/rangeselector.js, calender/timerangeslider.js";
}

(function () { // private scope

// util
var isN = function (n) {
    return typeof parseInt(n, 10) === 'number';
};

var cmpN = DA.util.cmpNumber;

DA.scheduler.EditPage = {

    /**
     * @public
     * @method init
     * @param config {Object} Hash literal with keys for:
     *                        dateRangeSelector, timeRangeSlider 
     */
    init: function (config) {

        if (!config || !config.rangeSelector) {
            throw "Error: Bad Params: need rangeSelector";
        }
        
        this.dateRangeSelector = new DA.cal.DateRangeSelector (config.rangeSelector);

        if (config.timeRangeSlider) {
        	this.timeRangeSlider = new DA.widget.TimeRangeSlider(Ext.apply({}, config.timeRangeSlider, {
            	scale:      3,
            	resolution: 5,
            	minValue:   0,
            	maxValue:   24,
            	orientation: 'horizontal',
            	plugins:    new DA.widget.TimeRangeSliderTip()
        	}));
        	this.timeRangeSlider.on('change', this.onSliderChange, this);
        }

        // If we are here, all that we need to do is create
        // the slider, and setup event plumbing

        this.dateRangeSelector.on('change', this.onDateRangeChange, this);

        this.dateRangeSelector.on('enabled', this.onSomethingEnabled, this);
        this.dateRangeSelector.on('disabled', this.onSomethingDisabled, this);

        this._setupViewPort();


    },

    /*
     * Emergency 'hack' (requested by Yamamoto-san!)
     * - What?
     *   This saves the difference between the slider-viewport's
     *   width and the window width. This difference can then
     *   be used during window.onresize to set the slider's width
     * - Why?
     *   This allows the slider's to resize to *smaller* widths
     *   Previously, resizing worked only when increasing the width
     * - Limitations
     *   This will probably fail if other percentage-width elements
     *   are present in the layout as horizontal neighbors to the 
     *   slider.
     */
    _determineWidthOffset: function () {
        // First figure out the viewport width
        var vpw = this.simpleViewPort.getBox().width;
        // And then, the entire page's width:
        var pageW = Ext.lib.Dom.getViewWidth();
        this._widthOffset = pageW - vpw;
    },

    _setupViewPort: function () {
    	if(!this.timeRangeSlider){ return;}
        this.simpleViewPort = new DA.widget.SimpleViewPort({
            renderTo: this.timeRangeSlider.container,
            scrollDistance: 144, // 4 hours (1H => 36 pixels)
            style: {
                border: '1px solid #888',
                height: '36px',
                width:  '400px' // A conservative guess
            },
            maxWidth: 864, // 864 pixels => 24H
            items: [ this.timeRangeSlider ]
        });
        (function () {
        	this._resizeViewPort();
            this.simpleViewPort.fitToParentWidth();
            // FIXME: Calling a private method
            this.timeRangeSlider._fixLimits();
            // HACK: See _determineWidthOffset
            this._determineWidthOffset();
        }).defer(10, this);

        this.simpleViewPort.on('enable', function () {
            this.timeRangeSlider.enable();
        }, this);

        this.simpleViewPort.on('disable', function () {
            this.timeRangeSlider.setValues(0, 0);
            this.timeRangeSlider.disable();
        }, this);


        Ext.EventManager.onWindowResize(this.handleWindowResize, this);

    },
	
	_resizeViewPort: function () {
	    var s_h = this.dateRangeSelector.startDateSelector.hhSelector.getValue();
		var s_m = this.dateRangeSelector.startDateSelector.miSelector.getValue();
		var e_h = this.dateRangeSelector.endDateSelector.hhSelector.getValue();
		var e_m = this.dateRangeSelector.endDateSelector.miSelector.getValue();
		if (e_h === '--') {
			e_h = '24';
			e_m = 0;
		}
	    
	    var start = parseInt(s_h, 10) * 60 + parseInt(s_m, 10);
	    var end   = parseInt(e_h, 10) * 60 + parseInt(e_m, 10);
		if (end > start && (s_h < 8 || (e_h === '23' && e_m > 0) || e_h === '24')) {
			this.simpleViewPort.doScrollLeft(null,null,parseInt((start + end)/2/60, 10)/4-2,true); 
		} else {
			this.simpleViewPort.doScrollLeft(null, null,2,true);
		}
	},
	
    handleWindowResize: function (w, h) {
        var svp = this.simpleViewPort;
        var svpW = w - this._widthOffset;
        svp.setWidth(svpW);
        svp.fitToParentWidth();
        this._resizeViewPort();
    },

    onSomethingEnabled: function (adj, noun) {
        if (noun === 'Time' && this.simpleViewPort) {
            this.simpleViewPort.enable();
        }
    },

    onSomethingDisabled: function (adj, noun) {
        if (noun === 'Time' && this.simpleViewPort) {
            this.simpleViewPort.disable();
        }
    },


    /**
     * Called when the date-range has changed.
     * @public
     * @type {Function} event handler
     */
    onDateRangeChange: function (start, end) {
        this.isSameDay = cmpN(start.yy,end.yy) && 
                cmpN(start.mm, end.mm) && cmpN(start.dd,end.dd);
        var trs = this.timeRangeSlider;
        if (!trs) { return; }
        if (!this.isSameDay && this.simpleViewPort) {
            this.simpleViewPort.disable();
            return;
        }
        var sVal = { HH: start.hh, MM: start.mi};
        var eVal = { HH: end.hh,   MM: end.mi};

        this.simpleViewPort.enable();
        trs.setValues(
            this._roundTo5Mins(sVal), 
            this._roundTo5Mins(eVal));

    }, 

    _roundTo5Mins: function (oHHMM) {
        var mm = oHHMM.MM;
        var hh = oHHMM.HH;
        mm = Math.round(mm/5) * 5;
        if (mm >= 60) {
            hh++;
            mm = 0;
        }
        return {
            HH: hh,
            MM: mm
        };
    },

    clearTime: function () {
        this.dateRangeSelector.startDateSelector.resetTime();
        this.dateRangeSelector.endDateSelector.resetTime();
        this.dateRangeSelector.setValue(
            { hh: '--', mi: '--' },
            { hh: '--', mi: '--' },
            true
        );
        if (this.timeRangeSlider) {
            this.timeRangeSlider.setValues(0, 0);
        }
    },
    
	disableAll: function () {
		this.dateRangeSelector.startDateSelector.disableAll();
		this.dateRangeSelector.endDateSelector.disableAll();
		if (this.timeRangeSlider) {
			this.timeRangeSlider.disable();
		}
	},

    /**
     * Called when the date-range has changed.
     * @public
     * @type {Function} event handler
     */
    onSliderChange: function (start, end) {
        this.dateRangeSelector.setValue(
            { hh: start.HH, mi: start.MM },
            { hh: end.HH,   mi: end.MM }
        );
        this.dateRangeSelector.changeWithoutFireEvent();
    }

    
};


})();
