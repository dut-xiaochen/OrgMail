/* $Id: viewer.js 2478 2014-09-22 06:07:40Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/toppanel/viewer.js $ */
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
 *   var tpc = new DA.mailer.TopPanelController4Viewer();
 * 
 * @class TopPanelController4Viewer
 * @uses 
 * @constructor
 * Todo: message
 */
DA.mailer.TopPanelController4Viewer = function(panelNode, menuNode) {
    this.panelId   = panelNode.id;
    this.panelNode = panelNode;
    this.menuNode  = menuNode;
    
    if (DA.vars.custom.viewer.setTopPanel) {
        eval(DA.vars.custom.viewer.setTopPanel);
    }
    
    this.init();
};

/**
 * Members
 */
DA.mailer.TopPanelController4Viewer.prototype = {
    
    panelId: null,
    
    panelNode: null,
    
    menuNode: null,
    
    panelMenu: null,

    panelImages: {
        left   : DA.vars.imgRdir + "/null.gif",
        center : DA.vars.clrRdir + "/mail_pop_back.gif",
        right  : DA.vars.imgRdir + "/null.gif"
    },
    
    menuData: {
        leftOrder: ['edit', 'reply', 'replyall', 'forward', 'delete', 'print', 'filter', 'prev', 'next', 'option'],
        rightOrder: ['popy', 'close'],
        items: {
            edit: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_EDIT_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_EDIT_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_edit_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_edit_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_edit_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 1,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            reply: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_REPLY_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_REPLY_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_reply_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_reply_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_reply_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            replyall: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_REPLYALL_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_REPLYALL_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_replyall_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_replyall_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_replyall_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            forward: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_FORWARD_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_FORWARD_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_forward_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_forward_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_forward_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            'delete': {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_DELETE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_DELETE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_delete_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_delete_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_delete_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            print: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_PRINT_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_PRINT_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_print_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_print_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_print_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            filter: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_FILTER_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_FILTER_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_filter_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_filter_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_filter_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            prev: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_PREV_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_PREV_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_back_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_back_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_back_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            next: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_NEXT_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_NEXT_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_next_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_next_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_next_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            option: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_OPTION_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_OPTION_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_option_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_option_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_option_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : null,
                pulldown    : {
                    order: [['header', 'export', 'savetolib', 'saveattachestolib', 'sales']],
                    items: {
                        header: {
                            text: DA.locale.GetText.t_('MESSAGE_HEADER_MENU'),
                            onclick: Prototype.emptyFunction
                        },
                        'export': {
                            text: DA.locale.GetText.t_('MESSAGE_EXPORT_MENU'),
                            onclick: Prototype.emptyFunction
                        },
                        savetolib: {
                            text: DA.locale.GetText.t_('MESSAGE_SAVETOLIB_MENU'),
                            onclick: Prototype.emptyFunction,
                            hidden: (DA.vars.config.save_to_lib === 0) ? 1 : 0
                        },
                        saveattachestolib: {
                            text: DA.locale.GetText.t_('MESSAGE_SAVEATTACHESTOLIBOPTION_MENU'),
                            onclick: Prototype.emptyFunction
                        },
                        sales: {
                            text: DA.locale.GetText.t_('MESSAGE_REGIST_MENU', DA.vars.hibiki.sales.name),
                            onclick: Prototype.emptyFunction,
                            hidden: (DA.vars.license.hibiki_sales === 1 && DA.vars.system.sales_datalink_enable !== 'off') ? 0 : 1
                        }
                    },
                    className: 'da_topPanel4ViewerPulldownMenu'
                }
            },
            close: {
                title       : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_close_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_close_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_close_dis.gif",
                className   : 'da_panelMenu4ViewerItemRight',
                hidden      : 0,
                disable     : 0,
                onSelect    : function() {
                    DA.windowController.allClose();
                    window.close();
                },
                pulldown    : null
            },
            popy: {
                title       : '',
                alt         : '',
                smallIcon   : DA.vars.clrRdir + "/maildetails_popy.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_popy.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_popy.gif",
                className   : 'da_panelMenu4ViewerItemPopy',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            }
        },
        className: 'da_panelMenu4Viewer'
    },
    
    init: function() {
        var reply    = this.menuData.items.reply;
        var replyall = this.menuData.items.replyall;
        var forward  = this.menuData.items.forward;
        var print    = this.menuData.items.print;
        
        // 返信
        reply.pulldown = {};
        reply.pulldown.className = 'da_topPanel4ViewerPulldownMenu';
        reply.pulldown.order = [];
        reply.pulldown.order[0] = ['0', '1', '2'];
        reply.pulldown.items = {};
        reply.pulldown.items[0] = {
            text: DA.locale.GetText.t_('QUOTE_01_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['01'],
            selected: (DA.vars.config.quote_reply === '01') ? true : false
        };
        reply.pulldown.items[1] = {
            text: DA.locale.GetText.t_('QUOTE_11_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['11'],
            selected: (DA.vars.config.quote_reply === '11') ? true : false
        };
        reply.pulldown.items[2] = {
            text: DA.locale.GetText.t_('QUOTE_99_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['99'],
            selected: (DA.vars.config.quote_reply === '99') ? true : false
        };
        
        // 全員に返信
        replyall.pulldown = {};
        replyall.pulldown.className = 'da_topPanel4ViewerPulldownMenu';
        replyall.pulldown.order = [];
        replyall.pulldown.order[0] = ['0', '1', '2'];
        replyall.pulldown.items = {};
        replyall.pulldown.items[0] = {
            text: DA.locale.GetText.t_('QUOTE_01_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['01'],
            selected: (DA.vars.config.quote_reply === '01') ? true : false
        };
        replyall.pulldown.items[1] = {
            text: DA.locale.GetText.t_('QUOTE_11_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['11'],
            selected: (DA.vars.config.quote_reply === '11') ? true : false
        };
        replyall.pulldown.items[2] = {
            text: DA.locale.GetText.t_('QUOTE_99_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['99'],
            selected: (DA.vars.config.quote_reply === '99') ? true : false
        };
        
        // 転送
        forward.pulldown = {};
        forward.pulldown.className = 'da_topPanel4ViewerPulldownMenu';
        forward.pulldown.order = [];
        forward.pulldown.order[0] = ['0', '1', '2', '3', '4', '5'];
        forward.pulldown.items = {};
        forward.pulldown.items[0] = {
            text: DA.locale.GetText.t_('QUOTE_00_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['00'],
            selected: (DA.vars.config.quote_forward === '00') ? true : false
        };
        forward.pulldown.items[1] = {
            text: DA.locale.GetText.t_('QUOTE_01_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['01'],
            selected: (DA.vars.config.quote_forward === '01') ? true : false
        };
        forward.pulldown.items[2] = {
            text: DA.locale.GetText.t_('QUOTE_02_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['02'],
            selected: (DA.vars.config.quote_forward === '02') ? true : false
        };
        forward.pulldown.items[3] = {
            text: DA.locale.GetText.t_('QUOTE_10_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['10'],
            selected: (DA.vars.config.quote_forward === '10') ? true : false
        };
        forward.pulldown.items[4] = {
            text: DA.locale.GetText.t_('QUOTE_11_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['11'],
            selected: (DA.vars.config.quote_forward === '11') ? true : false
        };
        forward.pulldown.items[5] = {
            text: DA.locale.GetText.t_('QUOTE_99_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['99'],
            selected: (DA.vars.config.quote_forward === '99') ? true : false
        };

        // 印刷
        print.pulldown = {};
        print.pulldown.className = 'da_topPanel43PanePulldownMenu';
        print.pulldown.order = [];
        print.pulldown.order[0] = ['0', '1'];
        print.pulldown.items = {};
        print.pulldown.items[0] = {
            text: DA.locale.GetText.t_('PRINT_WITH_TO'),
            onclick: Prototype.emptyFunction,
            args: ['on','printtoconfig']
        };
        print.pulldown.items[1] = {
            text: DA.locale.GetText.t_('PRINT_WITHOUT_TO'),
            onclick: Prototype.emptyFunction,
            args: ['off','printtoconfig']
        };

        
        var html = '<div id="' + this.panelId + '_TPC" class="da_topPanel4Viewer">' +
                   '<div id="' + this.panelId + '_TPCL" class="da_topPanel4ViewerLeft" style="background-image:url(' + this.panelImages.left + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCR" class="da_topPanel4ViewerRight" style="background-image:url(' + this.panelImages.right + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCC" class="da_topPanel4ViewerCenter" style="background-image:url(' + this.panelImages.center + ')"></div>' +
                   '</div>';
        
        this.panelNode.innerHTML = html;
                
        // CustomEvent              
        DA.customEvent.fire("TopPanelController4ViewerInitAfter", this, {               
                                                                                        reply: reply,               
                                                                                        replyall: replyall,             
                                                                                        forward: forward                
        });             

        this.panelMenu = new DA.widget.PanelMenuController(this.menuNode, this.menuData);
    },
    
    setFunction: function(viewer) {
        var key;
        
        if (viewer.selectMessageEditable) {
            this.panelMenu.show('edit');
        } else {
            this.panelMenu.hide('edit');
        }
        if (viewer.selectMessageExportable) {
            this.menuData.items.option.pulldownMenu.enabled('export');
        } else {
            this.menuData.items.option.pulldownMenu.disabled('export');
        }
        this.menuData.items.edit.onSelect = function() {
            viewer.edit();
        };
        this.menuData.items.reply.onSelect = function() {
            viewer.reply();
        };
        this.menuData.items.replyall.onSelect = function() {
            viewer.replyall();
        };
        this.menuData.items.forward.onSelect = function() {
            viewer.forward();
        };
        this.menuData.items['delete'].onSelect = function() {
            viewer['delete']();
        };
        this.menuData.items.print.onSelect = function() {
            viewer.print(null);
        };
        this.menuData.items.filter.onSelect = function() {
            viewer.filter();
        };
        this.menuData.items.prev.onSelect = function() {
            viewer.prev();
        };
        this.menuData.items.next.onSelect = function() {
            viewer.next();
        };
        this.menuData.items.option.pulldown.items.header.onclick = function() {
            viewer.header();
        };
        this.menuData.items.option.pulldown.items['export'].onclick = function() {
            viewer['export']();
        };
        this.menuData.items.option.pulldown.items.sales.onclick = function() {
            viewer.sales();
        };
        this.menuData.items.option.pulldown.items.savetolib.onclick = function() {
            viewer.savetolib();
        };
        this.menuData.items.option.pulldown.items.saveattachestolib.onclick = function(e) {
            viewer.showsaveattachestolibdialog(e.clientX,e.clientY);
        };
        if (viewer.getattachesnum() > 0) {
            this.menuData.items.option.pulldown.items.saveattachestolib.hidden = 0;
        } else {
            this.menuData.items.option.pulldown.items.saveattachestolib.hidden = 1;
        }

        var reply    = this.menuData.items.reply;
        var replyall = this.menuData.items.replyall;
        var forward  = this.menuData.items.forward;
        var print    = this.menuData.items.print;
        for (key in reply.pulldown.items) {
            if (key.match(/^\d+$/)) {
                reply.pulldown.items[key].onclick = function(e, a) {
                    viewer.reply(a[0]);
                };
            }
        }
        for (key in replyall.pulldown.items) {
            if (key.match(/^\d+$/)) {
                replyall.pulldown.items[key].onclick = function(e, a) {
                    viewer.replyall(a[0]);
                };
            }
        }
        for (key in forward.pulldown.items) {
            if (key.match(/^\d+$/)) {
                forward.pulldown.items[key].onclick = function(e, a) {
                    viewer.forward(a[0]);
                };
            }
        }
        for (key in print.pulldown.items) {
            if (key.match(/^\d+$/)) {
                print.pulldown.items[key].onclick = function(e, a) {
                    viewer.print(a[0]);
                };
            }
        }

        // CustomEvent              
        DA.customEvent.fire("TopPanelController4ViewerSetFunctionAfter", this, {                
                                                                                        viewer: viewer,             
                                                                                        reply: reply,               
                                                                                        replyall: replyall,             
                                                                                        forward: forward    			
        });			
    }
};
