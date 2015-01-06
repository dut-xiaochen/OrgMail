/* $Id: mboxgrid.js 1622 2008-06-16 07:38:27Z faiz_kazi $ -- $HeadURL: http://yuki/svn/iseria/insuite-ui/trunk/src/mailer/mboxgrid/mboxgrid.js $ */
/*for JSLINT undef checks*/
/*extern Ext DA */ 
/*
Copyright (c) 2008, DreamArts. All rights reserved.
*/

/*
 * TODO: in dragSelection mode, onMouseDown needs to be discarded if within
 *       the slider?
 */

/**
 * @class DA.widget.TimeRangeSlider
 * @extends Ext.BoxComponent
 * A range-slider implementation that allows the user to select a time range.
 * Uses a third-party extension: Ext.ux.SlideZone: http://www.jaredgisin.com/software/Ext.ux.SlideZone/
 * @constructor
 * Create a time-range slider object.
 * @param {Object} config The config object
 */
DA.widget.TimeRangeSlider = Ext.extend(Ext.BoxComponent, {

    /**
     * Maximum precision for selectable times, expressed
     * in minutes.  The default is 5 minutes.
     * @cfg {Number} resolution
     */
    resolution: 5, // 5 mins

    /**
     * By default, 1 pixel represents one minumum unit of resolution
     * (1px => 5 minutes). Setting this to a number will allocate that many
     * pixels for each unit of resolution, while making the entire slidezone
     * larger by the same amount.
     * @cfg {Number} scale
     */
    scale: 1,

    // FIXME: hardcoding
    /**
     * @cfg {Number} initialMin
     */
    initialMin: 0,

    /**
     * @cfg {Number} initialMax
     */
    initialMax: 0,

    /**
     * @cfg {Number} minValue
     */
    minValue: 0,

    /**
     * @cfg {Number} maxValue
     */
    maxValue: 24,

    /**
     * The precision, expressed in hours, of the approximation
     * to use for dragSelection. Setting it to 0.5
     * (the default value) will cause the range to always start
     * from a half-hour increment.
     * Only meaningful when dragSelection is TRUE.
     * NOTE: Sou Jr.'s idea
     * @cfg {Number} warpSnap
     */
    warpSnap: 0.5,

    /**
     * @cfg {String} orientation
     */
    orientation: 'horizontal',

    // protected
    initComponent: function () {
        this.constructor.superclass.initComponent.call(this);
        this.addEvents(
            /**
             * @event change
             * Fires when the range values change
             * @param {Object} from - Object literal, with HH, MM fields.
             * @param {Object} tos- Object literal, with HH, MM fields.
             */
            'change');
        this.scale = parseInt(this.scale, 10);
        this.resolution = parseInt(this.resolution, 10);
    },

    /**
     * A crude mapping mechanism that helps in setting the 
     * CSS background classname
     * @private
     * @type {Object|Hash} values are functions.
     */
    _bgClasses: {
        'bg-08hto20h': function (s) {
            return s.minValue === 8 &&
                s.maxValue === 20 &&
                    (s.resolution / s.scale === 5/2);
        },
        'bg-08hto20h-scale2': function (s) {
            return s.minValue === 8 &&
                s.maxValue === 20 &&
                    (s.resolution / s.scale === 5/4);
        },
        'bg-24h': function (s) {
            return s.minValue === 0 &&
                s.maxValue === 24 &&
                    (s.resolution / s.scale === 5);
        },
        'bg-24h-scale2': function (s) {
            return s.minValue === 0 &&
                s.maxValue === 24 &&
                    (s.resolution / s.scale === 5/2);
        },
        'bg-24h-scale3': function (s) {
            // FIXME
            return (s.maxValue - s.minValue === 24) &&
                    (s.resolution / s.scale === 5/3);
        }

    },
    
    /**
     * HALF the width (or height, when in vertical orientation) of the
     * resize handle (日本語: 矢印の幅)
     * FIXME: This should not be hard-coded
     * NOTE: 'width' is a misnomer. In vertical orientation, this
     *       means the height of the resize handle.
     * @property halfHandleWidth
     * @type {Number}
     */
    halfHandleWidth: 0,


    /**
     * @protected
     * @param ct TODO
     */
    onRender: function (ct, pos) {
        // TODO: Need to check ct?
        var range = this.maxValue - this.minValue;
        var sizeInPixels = (range * (60/this.resolution) * this.scale);

        this.el = ct.createChild({
            id: this.id,
            cls: 'timerangeslider'
        }, pos);

        this.slideZone = new Ext.ux.SlideZone(this.el.dom, { 
            type: this.orientation, 
            size: sizeInPixels, 
            sliderHeight: 24, 
            maxValue: this.maxValue, 
            minValue: this.minValue, 
            sliderSnap: [Math.max(1,this.scale), Math.max(1, this.scale)]
        });

        this._doHalfHandleStuff();

        // We want to allow setting out-of-range values as well.
        // In this case, the slider must appear hidden.
        this.slideZone.el.setStyle('overflow', 'hidden');

        for (var cn in this._bgClasses) {
            if (this._bgClasses[cn](this)) {
                this.el.addClass(cn + 
                    (this.orientation === 'vertical' ? '-v' : ''));
            }
        }
        this.rangeSlider = new Ext.ux.RangeSlider({
            value: [this.initialMin, this.initialMax],
            name: '24H'
        });

        this.slideZone.add(this.rangeSlider);

        // Set the minimum width to correspod to 30 minutes 
        // (For example, if we use scale=3, res=5, 30 mins => 18px)
        // This is necessary because SlideZone hard-codes the minWidth 
        // to 20px
        this.rangeSlider.resizable.minWidth = (30 * this.scale) / this.resolution;

        // Apply overrides to the SlideZone objects so it
        // works better for us
        this._slideZoneFixes();

        // We use a spreadsheet-like drag-select mode
        this._setupDragSelection();

        this._setupEventPlumbing();
        //this.setValues.defer(10, this, [this.initialMin, this.initialMax]);
    },


    _doHalfHandleStuff: function () {
        if (this.orientation === 'vertical') {
            this.el.setHeight(this.slideZone.el.getHeight() + (2*this.halfHandleWidth));
            this.slideZone.el.setStyle({top: this.halfHandleWidth+"px"});
        } else {
            this.el.setWidth(this.slideZone.el.getWidth() + (2*this.halfHandleWidth));
            this.slideZone.el.setStyle({left: this.halfHandleWidth+"px"});
        } 
    },

    
    /**
     * PRIVATE init-time method that overrides the behavior of
     * some parts of the SlideZone object. This currenty applies
     * 3 fixes:
     *   (1) During resizing (the rangeSlider), the Event object
     *       is passed to the drag event.
     *   (2) When the rangeSlider is dragged, the Event object
     *       is passed on to the drag event.
     *   (3) The method updateValues does not do any bounds
     *       checking, We override it and check against
     *       minValue and maxValue
     * @private
     * @method _slideZoneFixes
     */
    _slideZoneFixes: function () {
        var zone = this.slideZone;
        var rs = this.rangeSlider;
        
        // (1)
        rs.resizable.onMouseMove = function (e) {
            var box = this.constrainTo.getRegion(), tgt = e.getXY();
            //redefine the constraining box if slider crossing resrictions
            if(!zone.allowSliderCrossing) {
                if( zone.type === 'vertical') {
                        box = {left:   box.left,  right:  box.right,
                               top:    this.startBox.y - this.leftTravel[0],
                               bottom: this.startBox.y + this.startBox.height + this.rightTravel[0] };
                }
                if( zone.type === 'horizontal') {
                        box = {left:   this.startBox.x - this.leftTravel[0],
                               right:  this.startBox.x + this.startBox.width + this.rightTravel[0],
                               top:    box.top, bottom: box.bottom };
                }
            }

            e.xy = [
                tgt[0] - box.left < 0 ? box.left - this.startBox.x + this.startPoint[0] : 
                    tgt[0] - box.right > 0 ? box.right - this.startBox.right + this.startPoint[0] : 
                        tgt[0],
                tgt[1] - box.top < 0 ? box.top - this.startBox.y + this.startPoint[1] : 
                    tgt[1] - box.bottom > 0 ? box.bottom - this.startBox.bottom + this.startPoint[1] : 
                        tgt[1]
            ];
            
            Ext.Resizable.prototype.onMouseMove.call(this, e);
            zone.updateValues();
            rs.fireEvent('drag', rs, e);
        };

        // (2)
        // The original updateValues does not do bounds checking. We
        // override it, and calling the original updateValues we 
        // do bounds checks and correct values if needed.
        var minValue = this.minValue;
        var maxValue = this.maxValue;
        zone.updateValues = function () {
            Ext.ux.SlideZone.prototype.updateValues.call(this);
            rs.value[0] = Math.max(minValue, rs.value[0]);
            rs.value[1] = Math.min(maxValue, rs.value[1]);
        };

        // (3)
        rs.ddEl.onDrag = function (e) {
			zone.updateValues();
			rs.fireEvent('drag', rs, e);
        };
        rs.pointer = 'move';

    },



    /**
     * エクセル見たいな動作を指定する
     * Setup a spreadsheet-like mode for selection a time span:
     *   - mousedown will move the range to the point where the
     *     mousedown occured
     *   - draging will elongate/shrink the selection range
     * @private
     * @method _setupDragSelection
     */
    _setupDragSelection: function () {
        var me = this;
        var rs = this.rangeSlider;
        var zone = this.slideZone;
        var ddZone = new Ext.dd.DragDrop(this.slideZone.el);
        var startPos, maxPos, /* Pixel positions, start (onmousedown) and max allowed*/
            getMaxPos, /*function*/
            getPageFn, resizeTo /*function*/, fixed, XorY;

        // Snap approximation must be done manually, because calling
        // Ext.Resizable's resizeTo(w, h) method does not respect
        // snapping.
        var snap = zone.sliderSnap[0]; // [0] === [1] any value will do

        /* Calculate the snap required for spreadsheet-like drag-selection
         * エクセル見たいドラッグ＆セレクトモードの「snap」ピクセルの計算
         *
         * If this.resolution is in minutes, then snap is the number of
         * pixels required.  Therefore, if this.warpSnap is the number
         * of HOURS to allow snapping during spreadsheet-like selection,
         * we can calculate a snap for it as well.
         *
         * this.resolution      -->     snap
         *
         * 30 mins = (60 * this.warpSnap) // Sou Jr. Suggestion;
         * 
         * (60 * this.warpSnap) -->     spreadsheetSpan
         *
         * spreadsheetSpan  =  (60 * this.warpSnap)      snap
         *                     --------------------  X 
         *                     this.resolution
         */
        var spreadsheetSpan = (60 * this.warpSnap * snap) / this.resolution;

        // The following function will be called to snap the arguments to resizeTo.
        var snapped = function (x) {
            return x - (x % spreadsheetSpan) + spreadsheetSpan;
        };


        if (this.orientation === 'vertical') {
            fixed = rs.resizable.el.getWidth();
            getPageFn = 'getPageY';
            resizeTo = function (h) {
                h = snapped(h);
                rs.resizable.resizeTo(fixed, h);
            };
            XorY = 1;
            getMaxPos = function () {
                return zone.el.getBottom();
            };
        } else {
            fixed = rs.resizable.el.getHeight();
            getPageFn = 'getPageX';
            resizeTo = function (w) {
                w = snapped(w);
                rs.resizable.resizeTo(w, fixed);
            };
            getMaxPos = function () {
                return zone.el.getRight();
            };
            XorY = 0;
        }

        var sliderInstancePointer;  // Will save the value of rs.pointer

        // On mousedown, do 2 things:
        //   1. Warp the range's position to start where the click occured.
        //   2. Re-adjust the position so that it falls at an apporximate
        //      value instead of an exact value (such as 10:30, instead of 10:47)
        ddZone.onMouseDown = function (e) {
            startPos = e.xy[XorY];
            maxPos = getMaxPos();
            rs.setPosition([startPos]);
            zone.updateValues();
            var value = me.getValues();
            // Default value of me.warpSnap is 0.5 (30 mins)
            var extraPrecision = value[0] % me.warpSnap;
            var from = value[0] - extraPrecision;
            var to = value[1] - extraPrecision;
            if (from === to) {
                to += me.warpSnap;
            }
            var diff = to - from;
            if (to >= me.maxValue) {
                from = me.maxValue - diff;
                to = me.maxValue;
            }
            me._setValues(from, to, e);
            // Suggestion from Sou Jr.: choose the
            // nearest 30min interval as the start
            startPos = rs.getPosition()[XorY];
            rs.fireEvent('dragstart', rs, e);
            // The following lines make the cursor appear uniform
            // (i.e., not flickering between 'move' and 'w-resize')
            zone.el.addClass('spreadsheet-mode');
            sliderInstancePointer = rs.pointer; // Save the original value
            rs.pointer = 'w-resize';
        };
        // On dragging, simply adjust the range (change it's height/width,
        // depending on it's orientation)
        ddZone.onDrag = function (e) {
            var pos = e.xy[XorY];
            var hOrW = pos - startPos;
            if (hOrW < 0) { // going back? no
                return;
            }
            if (pos >= maxPos) {
                return;
            }
            resizeTo(hOrW); // SlideZone will fire a 'dragend'! See below.
            zone.updateValues();
            /* TODO: We need to fire dragstart during onDrag. That
             *       seems silly, but iit is necessary because of 
             *       the way things are implemented in SlideZone:
             *       - SlideZone fires the 'dragend' event whenever
             *         the resizable element fires a resize event. 
             *       - We simply re-fire a 'dragstart' event.
             *       - This is helpful in at least one place:
             *         TimeRangeSliderTip depends on dragstart/dragend
             *         to figure out when to show/hide itself, and
             *         if we do not re-fire dragstart, then the tooltip
             *         disappears prematurely.
             */
            rs.fireEvent('dragstart', rs);
            rs.fireEvent('drag', rs, e);
        };
        // Not sure why we really need a mouseup handler: all it does
        // (that ondrag does not) is call zone.updateConstraints()
        ddZone.onMouseUp = function (e) {
            zone.updateConstraints();
            zone.updateValues();
            rs.fireEvent('dragend', rs);
            zone.el.removeClass('spreadsheet-mode');
            rs.pointer = sliderInstancePointer; // Reset to original
        };

        this.ddZone = ddZone;
    },


    // private
    _setupEventPlumbing: function () {
        this.rangeSlider.on('drag', function(slider, e) {
            var value = slider.value;
            this.fireEvent(
                'change', 
                this.toHHMM(value[0]), 
                this.toHHMM(value[1]),
                e);
        }, this);
        // The only possible timing in which to invoke _fixLimits
        this.el.on('mouseover', this._fixLimits, this);
    },

    
    /**
     * PRIVATE METHOD that is needed as a workaround to a limitation
     * in the original SlideZone (Version: 93 2007-12-12) implementation:
     * Needed because:
     *   1. Many calculations that take place in SlideZone depend on
     *      precomputed X/Y base offsets that are stored in el.lowLimit,
     *      el.highLimit.
     *   2. These values are ONLY set during init time. Which means that
     *      when the zone changes position, these must be updated, but
     *      they aren't
     * Calling this._fixLimits will recalculate and set correct values
     * for highLimit, lowLimit.
     * @method _fixLimits
     * @private
     */
    _fixLimits: function () {
        var el = this.slideZone.el;
		switch(this.orientation) {
    		case 'horizontal':
				el.lowLimit = [el.getX()];
				el.highLimit = [el.getRight()];
				break;
			case 'vertical':
				el.lowLimit = [el.getY()];
				el.highLimit = [el.getBottom()];
				break;
			case 'area':
				el.lowLimit = el.getXY();
				el.highLimit = [el.getRight(), el.getBottom()];
				break;
		}
        this.updateConstraints();
    },

    /**
     * Our own updateConstraints method, that simply calls out
     * to this.slideZone.updateConstraints() and also resets
     * and applies correct constraints to ddZone, the drag-drop
     * element that allows dragSelection.
     * @private 
     * @method updateConstraints
     */
    updateConstraints: function () {
        this.slideZone.updateConstraints();
        var rsDdEl = this.rangeSlider.ddEl;
        this.ddZone.resetConstraints();
        if (this.orientation === 'vertical') {
            this.ddZone.setYConstraint(
                rsDdEl.topConstraint,
                rsDdEl.bottomConstraint,
                rsDdEl.yTickSize);
        } else {
            this.ddZone.setXConstraint(
                rsDdEl.leftConstraint,
                rsDdEl.rightConstraint,
                rsDdEl.xTickSize);
        }
    },



    /**
     * @public
     * @method setValues
     * @param min {Number} hours, in decimal format (Ex: 10.25 => 10:15)
     * @param min {Object} hours and minutes, in an object literal ( {HH:10, MM:15} )
     * @param max {Number} The maximum value.
     * @param max {Object} expressed as an object.
     */
    setValues: function (min, max) {
        this._setValues(min, max, null /*no event*/);
    },


    /**
     * @private
     * @method _roundTo4Dec
     * @param n {Number}
     * @return {Number}
     */
    _roundTo4Dec: function (n) {
        if (!n) { return 0; }
        var str = Number(n).toFixed(4);
        return parseFloat(str, 10);
    },


    // Private
    _setValues: function (min, max, e) {
        if (this.disabled) {
            return;
        }
        var rs = this.rangeSlider;
        var zone = this.slideZone;
        min = (typeof min === 'number') ? min : this.fromHHMM(min);
        max = (typeof max === 'number') ? max : this.fromHHMM(max);
        /* min          max     result      comments
         * ===          ===     ======      ========
         * --           --      0,0         do not show anything
         * 06           --      6,24        end defaults to 24 (maxValue)
         * --           20      0,20        start defaults to 0
         * 07           19      7,19        normal 
         * ----------------------------
         * for any of the above values, isFinite() can tell us if
         * a valid number is available or not.
         */
        if (isFinite(min) || isFinite(max)) {
            // Atleast 1 of max/min is available.
            max = isFinite(max) ? max : this.maxValue;
            min = isFinite(min) ? min : this.minValue;
        } else {
            // do not show anything.
            min = max = 0;
        }
        
        // It's a good idea to round of to about 4 decimal places:
        // 15.4999999 -> 15:29  // WRONG!
        // This ensures that values are rounded off sanely.
        min = this._roundTo4Dec(min);
        max = this._roundTo4Dec(max);

        rs.value = [ min, max ];

        var w, h, dim;
        if (this.orientation === 'vertical') {
            h = this._valueToPx(max - min);
            w = rs.resizable.el.getWidth();
            dim = 'y';
        } else {
            w = this._valueToPx(max - min);
            h = rs.resizable.el.getHeight();
            dim = 'x';
        }
        var posPx = zone.getBox()[dim] + this._valueToPx(min - this.minValue);
        // Math.round needed because 10.9 pixels must be considered 11 pixels
        posPx = Math.round(posPx);
        rs.setPosition([posPx]);
        rs.resizable.resizeTo(w, h);
        zone.updateConstraints();
        zone.updateValues();
        // If Event information is not available, then that means 
        // the drag has been triggered by code calling the 
        // public setValues method, and not by user interaction.
        if (e) {
            rs.fireEvent('drag', rs, e);
        }
    },

    /**
     * Returns the currently set values as an array of 2 numbers.
     * @public
     * @method getValues
     * @return {Array}
     */
    getValues: function () {
        return this.rangeSlider.value;
    },


    /**
     * Converts a value to it's equivalent size in pixels
     * TODO: Do we need to factor in this.scale as well?
     * @private
     * @method _valueToPx
     * @param n {Number}
     * @return {Number} pixels
     */
    _valueToPx: function (n) {
        var zone = this.slideZone;
        var w = n / (zone.maxValue - zone.minValue) * zone.size;
        return w;
    },


    /**
     * @private
     * @method _HHMMStringToObj
     * @param sHHMM {String}
     */
    _HHMMStringToObj: function (sHHMM) {
         if (!sHHMM) { return null; }
         var matched = sHHMM.match( /^(\d{1,2}):(\d{1,2})$/ );
         if (matched && matched.length === 3) {
            return {
                HH: parseInt(matched[1], 10),
                MM: parseInt(matched[2], 10)
            };
         } else {
            return null;
         }
    },

    /**
     * @public
     * @method fromHHMM
     * @param hours {String}
     * @param hours {Object}
     * @return {Number}
     */
    fromHHMM: function (hours) {
        var o = typeof hours === 'object' ? hours :
            this._HHMMStringToObj(hours);
        if (!o) { return null; }
        var hh = parseInt(o.HH, 10);
        var mm = parseInt(o.MM, 10);
        // Only if the minutes are not specified, treat them
        // as 0.
        mm = isFinite(mm) ? mm : 0;
        // If hours (HH,hh) are not specified, the results
        // are undefined. It is the job of the caller to
        // handle the situation.
        return hh + (mm / 60);
    },

    /**
     * @method toHHMM
     * @public
     * @param nHoursFloat {Number}
     * @return {Object}
     */
    toHHMM: function (nHoursFloat) {
        var hh = Math.floor(nHoursFloat);
        var mm = Number((nHoursFloat % 1)*60);
        //mm = Math.round(mm);
        mm = Math.round(mm/5)*5; 
        if (mm >= 60) {
            hh += Math.floor(mm/60);
            mm = mm % 60;
        }
        return { HH: hh, MM: mm };
    },

    /**
     * @method toHHMMString
     * @public
     * @param hours {Number}
     * @param hours {Object}
     * @return {String}
     */
    toHHMMString: function (hours) {
        var o = typeof hours === 'object' ? hours :
                this.toHHMM(hours);
        var HH = o.HH, MM = o.MM;
        return  (HH < 0 ? ('-0'+Math.abs(HH)) : HH < 10 ? '0'+HH : HH) + ':' +
                (MM < 10 ? '0'+MM : MM);
        
    },

    // protected
    disable: function () {
        // disable drag-selection
        this.ddZone.lock();
        // disable resizing the range
        this.rangeSlider.resizable.enabled = false;
        // disable draging the range (moving it)
        this.rangeSlider.ddEl.lock();
        this.constructor.superclass.disable.call(this);
    },

    // protected
    enable: function () {
        // enable drag-selection
        this.ddZone.unlock();
        // enable resizing the range
        this.rangeSlider.resizable.enabled = true;
        // enable draging the range (moving it)
        this.rangeSlider.ddEl.unlock();
        this.constructor.superclass.enable.call(this);
    }


});

/**
 * @class DA.widget.TimeRangeSliderTip
 * @extends DA.widget.TimeRangeSliderTip
 * Inspiration from http://extjs.com/deploy/dev/examples/slider/slider.js
 * A plugin for a TimeRangeSlider that implements a tooltip 
 * that follows the mouse on drag-selection, resizing and moving.
 */
DA.widget.TimeRangeSliderTip = Ext.extend(Ext.Tip, {
    minWidth: 50,
    offsets: [0, -10],
    // protected: called at plugin init-time
    init: function (timeRangeSlider) {
        // We need to set the rest of the event handlers
        // AFTER the TimeRangeSlider widget has rendered:
        // This is when the slideZone and rangeSlider objects
        // will be visible.
        timeRangeSlider.on('render', function (trs) {
            var zone = trs.slideZone;
            var rs = trs.rangeSlider;
            rs.on('dragstart', this.show, this);
            rs.on('dragend', this.hide, this);
            rs.el.on('mouseover', this._setLocation, this);
        }, this);
        timeRangeSlider.on('destroy', this.destroy, this);
        timeRangeSlider.on('change', this.onChange, this);
        this.slider = timeRangeSlider;
        if (timeRangeSlider.orientation === 'vertical') {
            this.offsets = [20, 0];
        } else {
            this.offsets = [-10, 10];
        }

    },
    // Called whenever the timerangeslider's values change.
    // Does nothing if the tip is not visible.
    onChange: function (from, to, e) {
        if (!this.body) {
            return;
        }
        this._updateValues([from, to]);
        this._setLocation(e);
    },
    _setLocation: function (e) {
        if (e) {
            if (this.el) {
                this.el.setLocation(
                    e.getPageX() + this.offsets[0],
                    e.getPageY() + this.offsets[1]);
            } else {
                this.pageX = e.getPageX() + this.offsets[0];
                this.pageY = e.getPageY() + this.offsets[1];
            }
        }
    },
    onDestroy: function () {
        this.slider.un('change', this.onChange, this);
        this.slider.rangeSlider.el.un('mouseover', this._setLocation, this);
        this.slider = null;
    },
    show: function (slider, e) {
        if (!this.hidden) {
            return;
        }
        this._setLocation(e);
        this.constructor.superclass.show.call(this);
        // The following lines are needed to ensure that the tip
        // has a meaningful, non-enpty value hwne it is first displayed.
        if (!this.body.getValue()) {
            this._updateValues(this.slider.getValues());
        }
    },
    _updateValues: function (values) {
        this.body.update(
            this.slider.toHHMMString(values[0]) + ' - ' +
            this.slider.toHHMMString(values[1])
        );
        this.doAutoWidth();
    }
});
