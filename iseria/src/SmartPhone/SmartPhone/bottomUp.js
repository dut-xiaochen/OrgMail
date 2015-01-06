

DA.widget.bottomUpContainer = function(id, cfg, cbh) {
        this.id  = id;
        this.cfg = $.extend({}, cfg);

        if (cbh) {
            this._bind(cbh);
        }

        this.init();
};

DA.widget.bottomUpContainer.prototype = $.extend({}, DA.widget.fixContainer.prototype, {

        duration  : 800,
		
		showFlg   : 0,

        onShowBefore: DA.util.emptyFunction,

        onShowAfter: DA.util.emptyFunction,

        onHiddenBefore: DA.util.emptyFunction,

        onHiddenAfter: DA.util.emptyFunction,

        init: function() {
                this.el = $("#" + this.id);
                var bottom = window.innerHeight + 10;
                this.el.css("top", bottom + "px");
		
				
				if( DA.browser.isOverAndroid2_2() || DA.browser.isOveriOS5() ) {
					this.el.css({
                        "position" : "absolute !imporatnt;",
                        "height"   : this.height(),
                        "width"    : this.width(),
                        "z-index"  : this.zIndex(),
                    });
				} else {
                    this.el.css({
                        "position" : "fixed",
                        "height"   : this.height(),
                        "width"    : this.width(),
                        "z-index"  : this.zIndex(),
                    });
					
				}
                //this._setTransition();
        },

        _setTransition : function(mode){
                if ( mode =='none' ){
                        this.el.css({"-webkit-transition": "none"});
                        this.el.css({"-moz-transition": "none"});
                } else {
                        this.el.css({"-webkit-transition": "all " + this.duration  + "ms ease-out"});
                        this.el.css({"-moz-transition": "all " + this.duration  + "ms ease-out"});
                }
        },

		isShow: function(){
			return this.showFlg;
		},
		
		getDuration : function(){
			return this.duration;
		},
		
        show: function() {
				this.onShowBefore();

				var el = this.el;
                var bottom = window.innerHeight;
                bottom -=0;
                this._setTransition('none');
		el.css('top', bottom + "px");
                this._setTransition();
                var top = - bottom;
                this.el.show();
        	setTimeout( function(){
	                el.css('-webkit-transform','translate(0px,'+  top  +'px)');
    	                el.css('-moz-transform','translate(0px,'+  top  +'px)');
                } , 0 );
		this.showFlg = 1 ;

                this.onShowAfter();
        },

        hidden: function(dir) {
                this.onHiddenBefore();

                var el = this.el;
                var start, end;
                if (dir === 'up') {
                        start = "0px";
                        end = -1 * parseInt(window.innerHeight);
                } else {
                        start = "0px";
                        end = window.innerHeight;
                }
                el.css('-webkit-transform','translate(0px,'+  (end)  +'px)');
                el.css('-moz-transform','translate(0px,'+  (end)  +'px)');
				this.showFlg = 0;
                
                var me = this;
				setTimeout( function(){
                        el.hide();
                        me.onHiddenAfter();
                } , this.duration);

        },

        _height: function() {
                return((this.cfg && this.cfg.height) ? this.cfg.height : "100%");
        },

        _width: function() {
                return((this.cfg && this.cfg.width) ? this.cfg.width : "100%");
        }
});




