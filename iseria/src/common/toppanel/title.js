/* $Id: title.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/toppanel/title.js $ */
/*for JSLINT undef checks*/
/*extern DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

 if (!DA || !DA.mailer || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}


if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Builds a Top panel for message viewer. 
 * 
 * Usage: 
 *   var tpc = new DA.mailer.TopTitleController();
 * 
 * @class TopTitleController
 * @uses 
 * @constructor
 * Todo: message
 */
DA.widget.TopTitleController = function(panelNode, menuNode, title) {
	this.panelId   = panelNode.id;
    this.panelNode = panelNode;
    this.menuNode  = menuNode;
	this.title     = title;
    this.init();
};

/**
 * Members
 */
DA.widget.TopTitleController.prototype = {
    
    panelId: null,
    
    panelNode: null,
    
    menuNode: null,
    
    panelMenu: null,

    panelImages: {
        left   : DA.vars.clrRdir + "/maildetails_s_bg.gif",
        center : DA.vars.clrRdir + "/maildetails_s_bg.gif",
        right  : DA.vars.clrRdir + "/maildetails_s_bg.gif"
    },
    
    menuData: {
        leftOrder: [],
        rightOrder: ['logo'],
        items: {
            logo: {
                title       : '',
                alt         : '',
                smallIcon   : DA.vars.clrRdir + "/maildetails_s_logo.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_s_logo.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_s_logo.gif",
                className   : 'da_titleMenuItemLogo',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            }
        },
        className: 'da_titleMenu'
    },
    
    init: function(){
        var html = '<div id="' + this.panelId + '_TPC" class="da_topTitle">' +
                   '<div id="' + this.panelId + '_TPCL" class="da_topTitleLeft" style="background-image:url(' + this.panelImages.left + ')">' +
                   '<div class="da_topTitleLeftDiv">' + DA.imageLoader.tag(this.title.icon) + this.title.name+ '</div>' +
                   '</div>' + 
                   '<div id="' + this.panelId + '_TPCC" class="da_topTitleCenter" style="background-image:url(' + this.panelImages.center + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCR" class="da_topTitleRight" style="background-image:url(' + this.panelImages.right + ')"></div>' +
                   '</div>';

        this.panelNode.innerHTML = html;
        
        this.panelMenu = new DA.widget.PanelMenuController(this.menuNode, this.menuData);
    }
};

