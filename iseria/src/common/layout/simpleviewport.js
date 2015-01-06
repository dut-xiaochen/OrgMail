/* $Id: mboxgrid.js 1622 2008-06-16 07:38:27Z faiz_kazi $ -- $HeadURL: http://yuki/svn/iseria/insuite-ui/trunk/src/mailer/mboxgrid/mboxgrid.js $ */
/*for JSLINT undef checks*/
/*extern Ext DA */ 
/*
Copyright (c) 2008, DreamArts. All rights reserved.
*/


/**
 * @class DA.widget.SimpleViewPort
 * @extends Ext.Container
 * A container widget that implements a simple viewport.
 * A simple scrolling mechanism is provided so that 
 * instead of using the browser's scrollbars 
 * (which appear if you use overflow:auto),
 * animated scrolling is possible by clicking 'left' and 'right'
 * buttons.
 * @constructor
 * Create a SimpleViewPort container.
 * @param {Object} config The config object.
 */
DA.widget.SimpleViewPort = Ext.extend(Ext.Container, {
    
    // TODO: only horizontal is supported at the moment.
    /**
     * @cfg orientation {String} Either horizontal or vertical.
     */
    orientation: 'horizontal',

    // Protected.
    initComponent: function () {
        this.constructor.superclass.initComponent.call(this);
        // Public Events
        // TODO: Do we need any?
        //this.addEvents();
        this._setupEventPlumbing();
    },

    
    _setupEventPlumbing: function () {
        this.on('add', this.onAdd, this);
        
    },

    // Private
    onAdd: function () {
        this.syncSize();
    },


    /**
     * @cfg scrollRepeatInterval {Number} The number of milliseconds to set
     * the repeat-rate when the scroll button is pressed.
     */
    scrollRepeatInterval: 300,

    /**
     * @cfg btnWidth {Number} width (or height, if using vertical orientation)
     *                        of the scroll buttons.
     */
    btnWidth: 16,
    
    /**
     * @cfg disabledBtnCls {String} CSS className to use for disabled buttons.
     */
    disabledBtnCls: 'btn-disabled',

    // TODO: this needs to be smarter.
    /**
     * @cfg scrollDistance {Number} pixels to scroll by.
     */
    scrollDistance: 100,

    // Protected
    onRender: function (ct /*Container*/, pos /*Position*/) {
        // TODO: What if we have no container.
        if (!ct) {
            throw "No container! Please specify one using renderTo.";
        }

        var btnWPx = this.btnWidth+'px';
        if (this.orientation === 'horizontal') {
            this.el = ct.createChild({
                id: this.id,
                tag: 'div', cls: 'simple-viewport',
                style: {
                    position: 'relative',
                    width:    "100%",
                    overflow:   'hidden'
                }
            });
            this.leftBtn = this.el.insertFirst({
                cls: 'scroll-btn scroll-left-btn', 
                style: {
                    position: "absolute",
                    width:  btnWPx,
                    height: '100%',
                    left:   '0px',
                    top:    '0px'
                }
            });
            this.rightBtn = this.el.insertFirst({
                cls: 'scroll-btn scroll-right-btn', 
                style: {
                    position: "absolute",
                    width:  btnWPx,
                    height: "100%",
                    right:  "0px",
                    top:    '0px'
                }
            });
            this.body = this.el.insertFirst({
                cls: 'content', 
                style: {
                    position: 'relative',
                    overflow: 'hidden',
                    'margin-left':   btnWPx,
                    'margin-right':  btnWPx
                }
            });
        
            this.rightRepeater = new Ext.util.ClickRepeater(this.rightBtn, {
                interval : this.scrollRepeatInterval,
                handler: this.doScrollLeft,
                scope: this
            });
            this.leftRepeater = new Ext.util.ClickRepeater(this.leftBtn, {
                interval : this.scrollRepeatInterval,
                handler: this.doScrollRight,
                scope: this
            });

        } else {
            throw "Vertical Orientation is not yet implemented.";
        }

        // Calling this will ensure that sizes (w, h) are calculated and set
        // We defer it a little because then we know the correct height
        // since browsers take a while to set the values.
        //this.fitToParentWidth.defer(10, this);
        this.syncSize.defer(10, this);
        // This is needed for FF/Gecko browsers, if the viewport's size
        // is going to change
        this._fixScrollPosition.defer(100, this);

        this.updateScrollButtons.defer(600, this);

    },


    /**
     * Utility to resize this widget's width so that it fits snugly within it's parent.
     * The w, h params from the original event (the ViewPort's w/h) are ignored;
     * We just repair our own width so that it is basically an exact fit of our
     * parent's width (minus the parent's borders, etc).
     * @private
     * @method fitToParentWidth
     */
    fitToParentWidth: function () {
        var containerWidth = this.el.parent().getWidth(true /*Without borders, padding*/);
        // Calling setWidth will fire onResize, which will cause the body's
        // widths to also get properly set.
        
        this.setWidth(containerWidth);
    },


    /**
     * Overrides the original setWidth so that it can fix
     * viewport-specific stuff that needs to be fixed during
     * a resize.
     * @protected
     * @method setWidth
     * @param w {Number} width in pixels
     */
    setWidth: function (w) {
        var wToSet = this.maxWidth ?
                // Why the -1 ? Because FF/Gecko needs it. Setting the full
                // width causes _fixScrollPosition to not work.
                Math.min(this.maxWidth+(this.btnWidth*2)-1, w) : w;
        this.constructor.superclass.setWidth.call(this, wToSet);
        this._fixScrollPosition();
        this.updateScrollButtons();
    },

    
    /*
     * In FF/Gecko at least, this workaround is necessary to prevent
     * the ugly situatio where the viewport grows but it's contents
     * remain scrolled leaving an empty area exposed.
     * @private
     */
    _fixScrollPosition: function () {
        if (!Ext.isIE) {
            this.body.scroll('l', 1, false);
            this.body.scroll('r', 1, false);
        }
    },

    /**
     * @cfg maxWidth {Number} (in pixels) The maximum width to allow when auto-expanding.
     * If unset, then there is no limit.
     */

    /**
     * @private
     * @method doScrollLeft
     * @param e {BrowserEvent}
     * @param el {HTMLElement} The scroll button
     * @param num {Number} The number of units to scroll
     * @param noAnimation {Boolean} true to disable animation (default: false, animate)
     */
    doScrollLeft: function (e, el, num, noAnimation) {
        this._doScroll(e, el, num, 'l', noAnimation);
    },


    /**
     * @private
     * @method doScrollRight
     * @param e {BrowserEvent}
     * @param el {HTMLElement} The scroll button
     * @param num {Number} The number of units to scroll
     * @param noAnimation {Boolean} true to disable animation (default: false, animate)
     */
    doScrollRight: function (e, el, num, noAnimation) {
        this._doScroll(e, el, num, 'r', noAnimation);
    },


    // Private
    _doScroll: function (e, el, num, direction, noAnimation) {
        if (!num) { num = 1; }
        if (this.disabled) { return; }
        this.body.scroll(direction, num * this.getScrollDistance(), !noAnimation);
        this.updateScrollButtons.defer(600, this);
    
    },

    // Protected
    getLayoutTarget: function () {
        return this.body;
    },

    /**
     * Calling this will update the state of the buttons:
     * it will disable a scroll button if it can determine
     * that scrolling in that direction is no longer possible.
     * This only disables the buttons visually (the events
     * will probably fire if the user continues to click on
     * a button even if it is disabled); but this should not
     * be a problem since Ext.Element#scroll does bounds checking.
     * @private
     * @method updateScrollButtons
     */
    updateScrollButtons: function () {
        var scroll = this.body.getScroll();
        var box = this.body.getBox();
        if (this.orientation === 'horizontal') {
            if(scroll.left <= 1) { // Trial-error shows that 1 is better than 0
                this.leftBtn.addClass(this.disabledBtnCls);
            } else {
                this.leftBtn.removeClass(this.disabledBtnCls);
            }
            // Trial-error shows that 1 is better than 0
            if ((scroll.left + box.width +1) >= this.body.dom.scrollWidth) {
                this.rightBtn.addClass(this.disabledBtnCls);
            } else {
                this.rightBtn.removeClass(this.disabledBtnCls);
            }
        } else {
            // TODO
        }
    },

    /**
     * Called by the Ext.Contain#setSize
     * We adjust our body size to the correct amount here.  It needs
     * to have slightly lesser width than the container's width, to
     * account for the bottons.
     * @protected
     * @method onResize
     */
    onResize: function (boxW, boxH, rawW, rawH) {
        var w = (rawW ? rawW : this.el.getComputedWidth()),
            h = (rawH ? rawH : this.el.getComputedHeight());
        w = this.orientation === 'vertical' ? w : w - (this.btnWidth * 2);
        h = this.orientation === 'vertical' ? h - (this.btnWidth * 2) : h;
        this.body.setSize(w, h);
        this.updateScrollButtons();
    },

    getScrollDistance: function () {
        return this.scrollDistance; // TODO: calculate this?
    },

    onEnable: function () {
        this.constructor.superclass.onEnable.call(this);
    },

    onDisable: function () {
        this.constructor.superclass.onDisable.call(this);
    }

});


