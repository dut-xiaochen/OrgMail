/* $Id: panel.js 2342 2013-05-17 03:10:38Z gx_sun $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/menu/panel.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

if (!DA || !DA.util) {
    throw "ERROR: missing DA.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Builds a panel menu. 
 * 
 * Usage: 
 *   var pmc = new DA.widget.PanelMenuController();
 * 
 * @class PanelMenuController
 * @uses 
 * @constructor
 * @param menuNode HTMLElement DOM node in which to draw the panel menu.
 */
DA.widget.PanelMenuController = function(menuNode, menuData) {
	this.menuId   = menuNode.id;
    this.menuNode = menuNode;
    this.menuData = menuData;
    
    if (DA.util.isEmpty(menuData.className)) {
        this.className = 'da_panelMenu';
    } else {
        this.className = menuData.className;
    }
    
    this.init();
};

/**
 * Members
 */
DA.widget.PanelMenuController.prototype = {

	menuId: null,
    
    menuNode: null,
    
    menuLeftNode: null,

    menuRightNode: null,
    
    menuData: null,
    
    className: null,
    
    init: function() {
        var html = '<div id="' + this.menuId + 'PMC" class="' + this.className + '">' +
                   '<div id="' + this.menuId + 'PMCL" class="' + this.className + 'Left"></div>' +
                   '<div id="' + this.menuId + 'PMCR" class="' + this.className+ 'Right"></div>' +
                   '<div id="' + this.menuId + 'PMCC" class="' + this.className + 'Center">' +
                   '<div id="' + this.menuId + 'PMCCL" class="' + this.className + 'CenterLeft"></div>' +
                   '<div id="' + this.menuId + 'PMCCR" class="' + this.className + 'CenterRight"></div>' +
                   '</div>' +
                   '</div>';
        this.menuNode.innerHTML = html;
        
        this.menuLeftNode  = YAHOO.util.Dom.get(this.menuId + 'PMCCL');
        this.menuRightNode = YAHOO.util.Dom.get(this.menuId + 'PMCCR');

        var i;
        var left     = '';
        var right    = '';
        var hides    = [];
        var disables = [];
        for (i = 0; i < this.menuData.leftOrder.length; i ++) {
            left += this._menuItem(this.menuData.leftOrder[i]);
            if (!this._visibleOk(this.menuData.leftOrder[i])) {
                hides.push(this.menuData.leftOrder[i]);
            }
            if (!this._enableOk(this.menuData.leftOrder[i])) {
                disables.push(this.menuData.leftOrder[i]);
            }
        }
        for (i = 0; i < this.menuData.rightOrder.length; i ++) {
            right += this._menuItem(this.menuData.rightOrder[i]);
            if (!this._visibleOk(this.menuData.rightOrder[i])) {
                hides.push(this.menuData.rightOrder[i]);
            }
            if (!this._enableOk(this.menuData.rightOrder[i])) {
                disables.push(this.menuData.rightOrder[i]);
            }
        }

        this.menuLeftNode.innerHTML  = left;
        this.menuRightNode.innerHTML = right;
				
        // CustomEvent				
        DA.customEvent.fire("PanelMenuControllerInitAfter", this, {hides: hides,disables: disables});				
        
        for (i = 0; i < hides.length; i ++) {
            this.hide(hides[i]);
        }
        for (i = 0; i < disables.length; i ++) {
            this.disable(disables[i]);
        }
    },
    
    select: function(e, func) {
        this.menuData.items[func].onSelect(e, this.menuData.items[func].args);
    },
    
    enable: function(func) {
        var elt = YAHOO.util.Dom.get(this._func2id(func, 't'));
        var elm = YAHOO.util.Dom.get(this._func2id(func, 'm'));
        var eli = YAHOO.util.Dom.get(this._func2id(func, 'i'));
        var elb = YAHOO.util.Dom.get(this._func2id(func, 'b'));
        var ela = YAHOO.util.Dom.get(this._func2id(func, 'a'));
        
        this.menuData.items[func].disable = 0;
        
        eli.src = this._smallIcon(func);
        YAHOO.util.Dom.removeClass(elt, this.className + 'ItemHidden');
        YAHOO.util.Dom.removeClass(elt, this.className + 'ItemGray');
        YAHOO.util.Dom.removeClass(elm, this.className + 'ItemNoPointer');
        YAHOO.util.Dom.removeClass(eli, this.className + 'ItemNoPointer');
        YAHOO.util.Dom.removeClass(elb, this.className + 'ItemHidden');
        YAHOO.util.Dom.removeClass(ela, this.className + 'ItemNoPointer');
    },
    
    disable: function(func) {
        var elt = YAHOO.util.Dom.get(this._func2id(func, 't'));
        var elm = YAHOO.util.Dom.get(this._func2id(func, 'm'));
        var eli = YAHOO.util.Dom.get(this._func2id(func, 'i'));
        var elb = YAHOO.util.Dom.get(this._func2id(func, 'b'));
        var ela = YAHOO.util.Dom.get(this._func2id(func, 'a'));
        
        this.menuData.items[func].disable = 1;
        
        eli.src = this._disableIcon(func);
        YAHOO.util.Dom.removeClass(elt, this.className + 'ItemHidden');
        YAHOO.util.Dom.addClass(elt, this.className + 'ItemGray');
        YAHOO.util.Dom.addClass(elm, this.className + 'ItemNoPointer');
        YAHOO.util.Dom.addClass(eli, this.className + 'ItemNoPointer');
        YAHOO.util.Dom.addClass(elb, this.className + 'ItemHidden');
        YAHOO.util.Dom.addClass(ela, this.className + 'ItemNoPointer');
    },
    
    show: function(func) {
        YAHOO.util.Dom.get(this._func2id(func)).style.display = '';
    },
    
    hide: function(func) {
        YAHOO.util.Dom.get(this._func2id(func)).style.display = 'none';
    },
    
    _id: function(func) {
        return this.menuId + 'MenuItem_' + func;
    },
    
    _title: function(func) {
        return this.menuData.items[func].title;
    },
    
    _alt: function(func) {
        return this.menuData.items[func].alt;
    },
    
    _smallIcon: function(func) {
        return this.menuData.items[func].smallIcon;
    },
    
    _bigIcon: function(func) {
        return this.menuData.items[func].bigIcon;
    },
    
    _disableIcon: function(func) {
        return this.menuData.items[func].disableIcon;
    },
    
    _className: function(func) {
        return this.menuData.items[func].className;
    },

    _hidden: function(func) {
        return this.menuData.items[func].hidden;
    },
    
    _disable: function(func) {
        return this.menuData.items[func].disable;
    },
    
    _pulldown: function(func) {
        return this.menuData.items[func].pulldown;
    },
    
    _visibleOk: function(func) {
        if (this._hidden(func) === 1) {
            return false;
        } else {
            return true;
        }
    },
    
    _enableOk: function(func) {
        if (this._disable(func) === 1) {
            return false;
        } else {
            return true;
        }
    },
    
    _selectOk: function(func) {
        if (DA.util.isFunction(this.menuData.items[func].onSelect)) {
            return true;
        } else {
            return false;
        }
    },    
    
    _pulldownOk: function(func) {
        if (this._pulldown(func)) {
            return true;
        } else {
            return false;
        }
    },
    
    _mouseover: function(e) {
        var el   = YAHOO.util.Event.getTarget(e);
        var id   = el.id;
        var func = this._id2func(id);
        
        if (this._enableOk(func)) {
            YAHOO.util.Dom.addClass(YAHOO.util.Dom.get(this._func2id(func, 't')), this.className + 'ItemHidden');
            
            el.src = this._bigIcon(func);
        }
    },
    
    _mouseout: function(e) {
        var el   = YAHOO.util.Event.getTarget(e);
        var id   = el.id;
        var func = this._id2func(id);
        
        if (this._enableOk(func)) {
            YAHOO.util.Dom.removeClass(YAHOO.util.Dom.get(this._func2id(func, 't')), this.className + 'ItemHidden');
            
            el.src = this._smallIcon(func);
        }
    },
    
    _click: function(e) {
        var el   = YAHOO.util.Event.getTarget(e);
        var id   = el.id;
        var func = this._id2func(id);
        
        if (this._enableOk(func)) {
            this.select(e, func);
        }
    },
    
    _id2func: function(id) {
        id.match(/\_([^\_]+)\_[^\_]+$/);
        return RegExp.$1;
    },
    
    _func2id: function(func, ex) {
        if (DA.util.isEmpty(ex)) {
            return this._id(func);
        } else {
            return this._id(func) + '_' + ex;
        }
    },

    _menuItem: function(func) {
         var title = this._title(func);
         var image = DA.imageLoader.tag(this._smallIcon(func), this._alt(func), { id: this._func2id(func, 'i') });
         var arrow = (this._pulldownOk(func)) ? DA.imageLoader.tag(DA.vars.imgRdir + '/ico_mail_arrow.gif', '', { id: this._func2id(func, 'a') }) : '';
         var noPointer = (this._pulldownOk(func)) ? '' : this.className + 'ItemNoPointer';
         var item = '<div id="' + this._func2id(func) + '" class="' + this._className(func) + '">' +
                    '<div id="' + this._func2id(func, 't') + '" class="' + this._className(func) + 'Top">' + DA.util.encode(title) + '</div>' +
                    '<div id="' + this._func2id(func, 'm') + '" class="' + this._className(func) + 'Middle">' + image + '</div>' +
                    '<div id="' + this._func2id(func, 'b') + '" class="' + this._className(func) + 'Bottom">' + arrow + '</div>' +
                    '</div>';
         
         var me = this;
         if (this._pulldownOk(func)) {
             if (this._selectOk(func)) {
                 YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseover", this._mouseover, this, true);
                 YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseout", this._mouseout, this, true);
                 YAHOO.util.Event.addListener(this._func2id(func, 'i'), "click", this._click, this, true);
                 
                 this.menuData.items[func].pulldownMenu = new DA.widget.PulldownMenuController(this._func2id(func, 'p'), this._func2id(func, 'b'), this._pulldown(func), {
                     onTrigger: function(e) {
                         var srcElem = YAHOO.util.Event.getTarget(e);
                         return srcElem && 
                            (DA.util.match(srcElem.id, me._func2id(func, 'b')) || 
                             DA.util.match(srcElem.id, me._func2id(func, 'a')));
                     }
                 });
             } else {
                 YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseover", this._mouseover, this, true);
                 YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseout", this._mouseout, this, true);
                 
                 this.menuData.items[func].pulldownMenu = new DA.widget.PulldownMenuController(this._func2id(func, 'p'), this._func2id(func), this._pulldown(func), {
                     onTrigger: function(e) {
                         var srcElem = YAHOO.util.Event.getTarget(e);
                         return srcElem && DA.util.match(srcElem.id, me._func2id(func));
                     }
                 });
             }
         } else {
             YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseover", this._mouseover, this, true);
             YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseout", this._mouseout, this, true);
             YAHOO.util.Event.addListener(this._func2id(func, 'i'), "click", this._click, this, true);
         }
         
         return item;
    }
        
};
