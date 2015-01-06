/* $Id: three-pane.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/layout/three-pane.js $ */
/*for JSLINT undef checks*/
/*extern DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/**
 * Generic 3-pane-view widget, with support for Drag-and-Drop
 * resizing of panes.
 * 
 * @module layout
 * @title 3-Pane View Widget 
 * @requires DA, TODO
 * @namespace DA.widget
 */

/**
 * Builds a ready-to-use 3-pane widget from a set of divs
 *
 * @class ThreePane
 * @uses YAHOO.util.Dom, YAHOO.util.DDProxy
 * @constructor
 * @param options (HASH) keys are:
 *                       leftPane         => HTMLElement,
 *                       rightPane        => HTMLElement,
 *                       rightTopPane     => HTMLElement,
 *                       rightBottomPane  => HTMLElement,
 *                       vDivider         => HTMLElement,
 *                       hDivider         => HTMLElement,
 */
DA.widget.ThreePane = function(options) {

    // FIXME: This can be done using YAHOO.util.Dom (addClass/removeClass)
    function setFirstClass(div, cName) {
        if(!div) {return;}
        var classes;
        if(div.className) {
            classes = div.className.split(' ');
            classes = classes.without(cName); 
            div.className = cName + ' ' + classes.join(' ');
        } else {
            div.className = cName;
        }
    }

    if (options) {
        
        // Copy the options
        Object.extend(this, options);

        setFirstClass(this.leftPane, "da_leftPane");
        setFirstClass(this.rightPane, "da_rightPane");
        setFirstClass(this.rightTopPane, "da_rightTopPane");
        setFirstClass(this.rightBottomPane, "da_rightBottomPane");

        setFirstClass(this.vDivider, "da_vDivider");
        setFirstClass(this.hDivider, "da_hDivider");

        this.init(); // TODO: what about this?

    }
};


// TODO: add methods.
DA.widget.ThreePane.prototype = {

    /**
     * See the CSS (three-pane.css) for how to customize the 
     * proxy drag element (selected by ID)
     * @property dragElId
     * @type {String} id of the drag proxy element
     */
    dragElId: "da_threePaneResizerDragProxy",
    
    /**
     * The DOM Element for the left-pane.
     * @property leftPane
     * @type {HTMLElement}
     */
    leftPane: null,

    /**
     * The DOM Element for the right-pane (parent of the right-top and right-bottom).
     * @property rightPane
     * @type {HTMLElement}
     */
    rightPane: null,

    /**
     * The DOM Element for the right top-pane.
     * @property rightTopPane
     * @type {HTMLElement}
     */
    rightTopPane: null,

    /**
     * The DOM Element for the right bottom-pane.
     * @property rightBottomPane
     * @type {HTMLElement}
     */
    rightBottomPane: null,

    /**
     * The DOM Element for the Vertical Divider (DIV element that vertically divides
     * the widget into left and right parts)
     * @property vDivider
     * @type {HTMLElement}
     */
    vDivider: null,

    /**
     * The DOM Element for the Horizontal Divider (DIV element that horizontally divides
     * the right pane of the widget into top and bottom panes)
     * @property hDivider
     * @type {HTMLElement}
     */
    hDivider: null,


    /**
     * Vertical drag-drop
     * Drag-drop object for the left-right resizer.
     * @property vdd
     * @type {Object} instance of YAHOO.util.DDProxy
     */
    vdd: null,


    /**
     * Horizontal drag-drop
     * Drag-drop object for the right-top/right-bottom resizer.
     * @property hdd
     * @type {Object} instance of YAHOO.util.DDProxy
     */
    hdd: null,

    /**
     * Called by the constructor.
     * @method init
     */
    init: function() {
        
        // Lazily create the Proxy drag element.
        var dragEl = YAHOO.util.Dom.get(this.dragElId);
        if (!dragEl) {
            dragEl = document.createElement('div');
            dragEl.id = this.dragElId;
            document.body.insertBefore(dragEl, document.body.firstChild);
        }

        // TODO: Make this a prototype member instead?
        var config = {
            maintainOffset: true,
            dragElId: this.dragElId
        };

        // TODO: Make vdd, hdd subclasses?

        var me = this;
        // Vertical drag/drop
        this.vdd = new YAHOO.util.DDProxy(this.vDivider, "vdd", config);
        // Horizontal drag/drop
        this.hdd = new YAHOO.util.DDProxy(this.hDivider, "hdd", config);
        
        // For the closures
        var _leftPane = this.leftPane;
        var _rightPane = this.rightPane;
        var _topPane = this.rightTopPane;
        var _bottomPane = this.rightBottomPane;

        var availablePercentage = 100 - ( ( (_topPane.offsetHeight + this.hDivider.offsetHeight) / this.rightPane.offsetHeight) * 100 );

        _bottomPane.style.height = availablePercentage + "%";

        var DOM = YAHOO.util.Dom;

        var startWidthLeft  = _leftPane.offsetWidth;
        var startWidthRight = _rightPane.offsetWidth;
        var startX = 0;

        this.vdd.onMouseDown = function(e) {
            startWidthLeft  = _leftPane.offsetWidth;
            startWidthRight = _rightPane.offsetWidth;
            startX = YAHOO.util.Event.getPageX(e);
            this.setInitPosition();
            // Now for the constraints...
            this.setXConstraint(_leftPane.offsetWidth - 100, me.rightPane.offsetWidth - 100);
            this.setYConstraint(0,0);
            var del = this.getDragEl();
            del.style.cursor = 'w-resize';
        };

        this.vdd.endDrag = function(e) {
            var lel = this.getEl();
            var del = this.getDragEl();
          
            // FIXME: copy-pasted from YUI, redundant code
            // Show the drag frame briefly so we can get its position
            // del.style.visibility = "";
            DOM.setStyle(del, "visibility", ""); 
            var curX = DOM.getX( del );
            DOM.setStyle(del, "visibility", "hidden"); 
            DOM.setStyle(lel, "visibility", ""); 
           
            var offset = curX - startX;
            var newLW = Math.max((startWidthLeft  + offset), 10);
            var newRW = Math.max((startWidthRight - offset), 10);
            var vDivW = me.vDivider.offsetWidth;

            var fullX = startWidthLeft + startWidthRight + vDivW;

            var leftPer  = Math.max(((newLW / fullX) * 100), 1); // Prevent anything from
            var rightPer = Math.max(((newRW / fullX) * 100), 1); // becoming less that 3%
            var vDivPer  = (vDivW/ fullX)  * 100;
            
            var excessPercentage = (leftPer + rightPer + vDivPer) - 100;
                rightPer -= excessPercentage;

            _leftPane.style.width = leftPer + "%";
            me.vDivider.style.width  = (100 - (leftPer + rightPer)) + "%"; 
            _rightPane.style.width = rightPer + "%";

            // Absolute positioning
            me.vDivider.style.left = leftPer + '%';
            
            me.onXResized(_leftPane, _topPane, _bottomPane);
            me.hdd.resetConstraints();
        };

        var startHeightTop = _topPane.offsetHeight;
        var startHeightBottom = _bottomPane.offsetHeight;
        var startY = 0;
    
        this.hdd.onMouseDown = function(e) {
            startHeightTop = _topPane.offsetHeight;
            startHeightBottom = _bottomPane.offsetHeight;
            startY = YAHOO.util.Event.getPageY(e);
            this.setInitPosition();
            // Now for the constraints...
            this.setYConstraint(startHeightTop - 50, startHeightBottom - 50);
            this.setXConstraint(0, 0);
            var del = this.getDragEl();
            del.style.cursor = 'n-resize';
        };
        
        this.hdd.endDrag = function(e) {
            var lel = this.getEl();
            var del = this.getDragEl();
         
            // FIXME: copy-pasted from YUI, redundant code
            // Show the drag frame briefly so we can get its position
            // del.style.visibility = "";
            DOM.setStyle(del, "visibility", ""); 
            var curY = DOM.getY( del );
            DOM.setStyle(del, "visibility", "hidden"); 
            DOM.setStyle(lel, "visibility", ""); 
           
            var offset = curY - startY;
            var newTopH = Math.max((startHeightTop + offset), 10);
            var newBottomH = Math.max((startHeightBottom - offset), 10);
            
            var fullY = startHeightTop + startHeightBottom + me.hDivider.offsetHeight;
            var topPer = (newTopH/fullY) * 100;
            var bottomPer = (newBottomH/fullY) * 100;
            _topPane.style.height = topPer + "%";
            _bottomPane.style.height = bottomPer + "%";
            me.onYResized(_leftPane, _topPane, _bottomPane);
        };

    },


    /**
     * For the given value (dim), returns a 'sane' percentage value of the full amount.
     * The returned percantage will be clipped tp limit it within 5% and 95%. If dim
     * itself is a percentage (a string containing digits and ending with '%'), then it 
     * will be just returned as a (clipped) number.
     * @method _toGracefulPercs
     * @private
     * @param dim  {Number} Number of pixels
     * @param dim  {String} Number of pixels, or percentage itself (if it contains '%')
     * @param full {Number} A total value to base the percentage calculation on.
     * @returns    {Number} A value representing a smoothened percentage.
     */
    _toGracefulPercs: function(dim, full) {
        var dimPerc;
        // TODO: error handling?
        if (typeof dim === 'string' && dim.charAt(dim.length-1) === '%') {
           dimPerc = parseFloat(dim.substr(0,dim.length-1), 10);
        } else {
           dimPerc = (parseFloat(dim,10) / full) * 100;
        }
        // TODO: what id Nan?
        // Limit wo between 5% and 95%
        dimPerc = Math.max(dimPerc, 5);  // FIXME: hardcoding
        dimPerc = Math.min(dimPerc, 95); // FIXME: hardcoding
        return dimPerc;
    },


    /**
     * Set the widths for the leftPane, rightPane
     * @method _setLRWidth
     * @private
     * @param key {String} must either be 'left' or 'right'
     * @param w  {Number} Width in pixels
     * @param w  {String} Width in pixels, or percentage itself (if it contains '%')
     */
    _setLRWidth: function(key, w) {
        if (!key) { return ; }
        var otherPane = key === 'left' ? 'right' : (key === 'right' ? 'left' : null);
        if (!otherPane) {
            // DA_DEBUG_START
            DA.log("invalid key to _setLRWidths:"+key, "error", "ThreePane");
            // DA_DEBUG_END
            return;
        }
        var fullW = this.leftPane.offsetWidth + this.rightPane.offsetWidth + this.vDivider.offsetWidth;
        var paneWPerc = this._toGracefulPercs(w, fullW);
        if (!YAHOO.lang.isNumber(paneWPerc)) {
            // DA_DEBUG_START
            DA.log("(W)percentage calc failed:"+w, "error", "ThreePane");
            // DA_DEBUG_END
            return;
        }
        var vDivWPerc = (this.vDivider.offsetWidth / fullW) * 100;
        var otherPaneWPerc = 100 - (paneWPerc + vDivWPerc);
        this[key+"Pane"].style.width  = paneWPerc + "%";
        this[otherPane+"Pane"].style.width = otherPaneWPerc + "%";
        // ABS?
        this.vDivider.style.left = paneWPerc + '%';
        this.onXResized(this.leftPane, this.rightTopPane, this.rightBottomPane);
        this.hdd.resetConstraints();

    },


    /**
     * Set the width of the left pane. This will also balance out with the
     * right-pane's width.
     * @method setLeftWidth
     * @param w  {Number} Width in pixels
     * @param w  {String} Width in pixels, or percentage itself (if it contains '%')
     */
    setLeftWidth: function(w) {
        this._setLRWidth('left', w);
    },

    /**
     * Set the width of the right pane. This will also banance out with the
     * left-pane's width
     * @method setRightWidth
     * @param w  {Number} Width in pixels
     * @param w  {String} Width in pixels, or percentage itself (if it contains '%')
     */
    setRightWidth: function(w) {
        this._setLRWidth('right', w);
    },

    /**
     * Set the heights for the rightTopPane, rightBottomPane
     * @method _setTBHeight
     * @private
     * @param key {String} must either be 'rightTop' or 'rightBottom'
     * @param h  {Number} Height in pixels
     * @param h  {String} Height in pixels, or percentage itself (if it contains '%')
     */
    _setTBHeight: function(key, h) {
        if (!key) { return ; }
        var otherPane = key === 'rightTop' ? 'rightBottom' : (key === 'rightBottom' ? 'rightTop' : null);
        if (!otherPane) {
            // DA_DEBUG_START
            DA.log("invalid key to _setLRWidths:"+key, "error", "ThreePane");
            // DA_DEBUG_END
            return;
        }
        var fullH = this.rightTopPane.offsetHeight + this.rightBottomPane.offsetHeight + this.hDivider.offsetHeight;
        var paneHPerc = this._toGracefulPercs(h, fullH);
        if (!YAHOO.lang.isNumber(paneHPerc)) {
            // DA_DEBUG_START
            DA.log("(H)percentage calc failed:"+h, "error", "ThreePane");
            // DA_DEBUG_END
            return;
        }
        var hDivHPerc = (this.hDivider.offsetHeight / fullH) * 100;
        var otherPaneHPerc = 100 - (paneHPerc + hDivHPerc);
        this[key+"Pane"].style.height  = paneHPerc + "%";
        this[otherPane+"Pane"].style.height = otherPaneHPerc + "%";
        this.onYResized(this.leftPane, this.rightTopPane, this.rightBottomPane);
        this.vdd.resetConstraints();
    },


    /**
     * Set the height of the right-top pane. This will also balance out with the
     * right-bottom pane's height.
     * @method setRightTopHeight
     * @param h  {Number} Height in pixels
     * @param h  {String} Height in pixels, or percentage itself (if it contains '%')
     */
    setRightTopHeight: function(h) {
        this._setTBHeight('rightTop', h);
    },


    /**
     * Set the height of the right-bottom pane. This will also balance out with the
     * right-top pane's height.
     * @method setRightBottomHeight
     * @param h  {Number} Height in pixels
     * @param h  {String} Height in pixels, or percentage itself (if it contains '%')
     */
    setRightBottomHeight: function(h) {
        this._setTBHeight('rightBottom', h);
    },


    /**
     * Fired AFTER a width-resize has completed
     * (after the vertical rightPane-leftPane resize) 
     * @prototype onXResizing
     * @type function
     * @param leftPane HTMLElement
     * @param rightTopPane HTMLElement
     * @param rightBottomPane HTMLElement
     */
    onXResized:  Prototype.emptyFunction,

    /**
     * Fired AFTER a height-resize has completed
     * (after the horizontal rightTopPane-rightBottomPane resize) 
     * @prototype onYResized
     * @type function
     * @param leftPane HTMLElement
     * @param rightTopPane HTMLElement
     * @param rightBottomPane HTMLElement
     */
    onYResized:  Prototype.emptyFunction,


    /**
     * Support for DA.session.UIState
     * @method getUIStateInfo
     * @returns {Hash} a hash of UI state information, mainly the width and height of the
     *                 leftPane, rightTopPane, rightBottomPane
     */
    getUIStateInfo: function () {
        return {
            leftPane: {
                width : this.leftPane.offsetWidth,
                height: this.leftPane.offsetHeight
            },
            rightTopPane: {
                width : this.rightTopPane.offsetWidth,
                height: this.rightTopPane.offsetHeight
            },
            rightBottomPane: {
                width : this.rightBottomPane.offsetWidth,
                height: this.rightBottomPane.offsetHeight
            }
        };
    }

};




