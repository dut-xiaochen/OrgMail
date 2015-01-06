/* $Id: three-pane.js 2466 2014-09-16 08:21:38Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/toppanel/three-pane.js $ */
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
 * Builds a Top panel for three-pane. 
 * 
 * Usage: 
 *   var tpc = new DA.mailer.TopPanelController43PANE();
 * 
 * @class TopPanelController43PANE
 * @uses 
 * @constructor
 * Todo: message
 */
DA.mailer.TopPanelController43PANE = function(panelNode, menuNode) {
	this.panelId   = panelNode.id;
    this.panelNode = panelNode;
    this.menuNode  = menuNode;
    
    if (DA.vars.custom.threePane.setTopPanel) {
        eval(DA.vars.custom.threePane.setTopPanel);
    }
    
    this.init();
};

/**
 * Members
 */
DA.mailer.TopPanelController43PANE.prototype = {
    
    panelId: null,
    
    panelNode: null,
    
    menuNode: null,
    
    panelMenu: null,

    panelImages: {
        left   : DA.vars.clrRdir + "/mailhead_main.gif",
        center : DA.vars.clrRdir + "/mailhead_popy4.gif",
        right  : DA.vars.clrRdir + "/mailhead_popy2.gif"
    },
    
    menuData: {
        leftOrder: ['make', 'reply', 'replyall', 'forward', 'delete', 'print'],
        rightOrder: ['close', 'guide', 'setting', 'state'],
        items: {
            make: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_MAKE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_MAKE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_make_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_make_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_make_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            reply: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_REPLY_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_REPLY_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_reply_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_reply_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_reply_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            replyall: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_REPLYALL_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_REPLYALL_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_replyall_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_replyall_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_replyall_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            forward: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_FORWARD_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_FORWARD_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_forward_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_forward_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_forward_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            'delete': {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_DELETE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_DELETE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_delete_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_delete_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_delete_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            print: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_PRINT_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_PRINT_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_print_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_print_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_print_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            state: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_STATE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_STATE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_state_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_state_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_state_dis.gif",
                className   : 'da_panelMenu43PaneItemRight',
                hidden      : 0,
                disable     : 1,
                onSelect    : function() {
                    DA.mailer.connection.saveState();
                },
                pulldown    : null
            },
            setting: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_SETTING_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_SETTING_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_setting_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_setting_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_setting_dis.gif",
                className   : 'da_panelMenu43PaneItemRight',
                hidden      : 0,
                disable     : 1,
                onSelect    : function() {
                    DA.windowController.winOpenNoBar(DA.vars.cgiRdir + '/ma_ajx_env_pop_up.cgi?proc=ma_ajx_config.cgi&title=pop_title_ajxmailer_other.gif&config_opener=ajax_mailer', 'ma_ajx_config', 990, 600);
                },
                pulldown    : null
            },
            guide: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_GUIDE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_GUIDE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_guide_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_guide_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_guide_dis.gif",
                className   : 'da_panelMenu43PaneItemRight',
                hidden      : (DA.vars.system.guide === 1) ? 0: 1,
                disable     : 1,
                onSelect    : function() {
                    DA.windowController.winOpenNoBar(DA.vars.cgiRdir + '/guide.cgi?item=ajx_ma_menu', 'guide', 430, 579);
                },
                pulldown    : null
            },
            close: {
                title       : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_close_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_close_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_close_dis.gif",
                className   : 'da_panelMenu43PaneItemRight',
                hidden      : 0,
                disable     : 1,
                onSelect    : function() {
                    DA.mailer.connection.logout();
                },
                pulldown    : null
            },
            space: {
                title       : '',
                alt         : '',
                smallIcon   : DA.vars.imgRdir + "/null.gif",
                bigIcon     : DA.vars.imgRdir + "/null.gif",
                disableIcon : DA.vars.imgRdir + "/null.gif",
                className   : 'da_panelMenu43PaneItemBlank',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            }
        },
        className: 'da_panelMenu43Pane'
    },
    
    init: function() {
        //テンプレート
        var i;
        var make     = this.menuData.items.make;
        var reply    = this.menuData.items.reply;
        var replyall = this.menuData.items.replyall;
        var forward  = this.menuData.items.forward;
        var print    = this.menuData.items.print;
        if (DA.vars.config.template && DA.vars.config.template.length > 0) {
            make.pulldown = {};
            make.pulldown.className = 'da_topPanel43PanePulldownMenu';
            if(DA.vars.config.template.length > 10){
            	YAHOO.util.Dom.addClass(make.pulldown, 'da_topPanel43PanePulldownMenu2');
            }
            make.pulldown.order = [];
            make.pulldown.order[0] = [];
            make.pulldown.items = {};
            
            make.pulldown.order[0].push(0);
            make.pulldown.items[0] = {
                text: DA.locale.GetText.t_('MESSAGE_NEW_MAKING'),
                onclick: Prototype.emptyFunction,
                args: []
            };
            
            for (i = 0; i < DA.vars.config.template.length; i ++) {
                make.pulldown.order[0].push(i+1);
                make.pulldown.items[i+1] = {
                    text: DA.vars.config.template[i].name,
                    onclick: Prototype.emptyFunction,
                    args: [DA.vars.config.template[i].tid]
                };
            }
        }
        
        // 返信
        reply.pulldown = {};
        reply.pulldown.className = 'da_topPanel43PanePulldownMenu';
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
        
        //　全員に返信       
        replyall.pulldown = {};
        replyall.pulldown.className = 'da_topPanel43PanePulldownMenu';
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
        
        //　転送
        forward.pulldown = {};
        forward.pulldown.className = 'da_topPanel43PanePulldownMenu';
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
        
        var html = '<div id="' + this.panelId + '_TPC" class="da_topPanel43Pane">' +
                   '<div id="' + this.panelId + '_TPCL" class="da_topPanel43PaneLeft" style="background-image:url(' + this.panelImages.left + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCR" class="da_topPanel43PaneRight" style="background-image:url(' + this.panelImages.right + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCC" class="da_topPanel43PaneCenter" style="background-image:url(' + this.panelImages.center + ')"></div>' +
                   '</div>';
        
        this.panelNode.innerHTML = html;


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

        // CustomEvent				
        DA.customEvent.fire("TopPanelController43PANEInitAfter", this, {				
                                                                                        make: make,				
                                                                                        reply: reply,				
                                                                                        replyall: replyall,				
                                                                                        forward: forward				
        });

        this.panelMenu = new DA.widget.PanelMenuController(this.menuNode, this.menuData);
    },
    
    messageSelectedMenu: function(fid, uid) {

	DA.customEvent.fire("topPanelController43PANEmessageSelectedMenuBefore", this, {
		fid: fid,
		uid: uid
	});

        if (fid) {
            this.selectedFid = fid;
        }
        if (uid) {
            this.selectedUid = uid;
        }
        if( !DA.util.isEmpty(window.__folderTree.backupFolderFid) && fid.toString() === window.__folderTree.backupFolderFid.toString()) {
            this.panelMenu.enable('make');
            this.panelMenu.disable('reply');
            this.panelMenu.disable('replyall');
            this.panelMenu.disable('forward');
            this.panelMenu.enable('delete');
            this.panelMenu.enable('print');
            this.panelMenu.enable('state');
            this.panelMenu.enable('setting');
            this.panelMenu.enable('guide');
            this.panelMenu.enable('close');
        } else {
            this.panelMenu.enable('make');
            this.panelMenu.enable('reply');
            this.panelMenu.enable('replyall');
            this.panelMenu.enable('forward');
            this.panelMenu.enable('delete');
            this.panelMenu.enable('print');
            this.panelMenu.enable('state');
            this.panelMenu.enable('setting');
            this.panelMenu.enable('guide');
            this.panelMenu.enable('close'); 
        }          
        

	DA.customEvent.fire("topPanelController43PANEmessageSelectedMenuAfter", this, {
	    fid: fid,
	    uid: uid
	});

    },
    
    messageUnselectedMenu: function() {

	DA.customEvent.fire("topPanelController43PANEmessageUnselectedMenuBefore", this);

        this.panelMenu.enable('make');
        this.panelMenu.disable('reply');
        this.panelMenu.disable('replyall');
        this.panelMenu.disable('forward');
        this.panelMenu.disable('delete');
        this.panelMenu.disable('print');
        this.panelMenu.enable('state');
        this.panelMenu.enable('setting');
        this.panelMenu.enable('guide');
        this.panelMenu.enable('close');

	DA.customEvent.fire("topPanelController43PANEmessageUnselectedMenuAfter", this);

    },
    
    setFunction: function(viewer) {
        var key;
        var me       = this;
        var make     = this.menuData.items.make;
        var reply    = this.menuData.items.reply;
        var replyall = this.menuData.items.replyall;
        var forward  = this.menuData.items.forward;
        var print    = this.menuData.items.print;
        
        make.onSelect = function() {
            viewer.make();
        };
        reply.onSelect = function() {
            viewer.reply(null, me.selectedFid, me.selectedUid);
        };
        replyall.onSelect = function() {
            viewer.replyall(null, me.selectedFid, me.selectedUid);
        };
        forward.onSelect = function() {
            viewer.forward(null, me.selectedFid, me.selectedUid);
        };
        print.onSelect = function() {
            viewer.print(null);
        };
        if (make.pulldown) {
            for (key in make.pulldown.items) {
                if (key.match(/^\d+$/)) {
                    make.pulldown.items[key].onclick = function(e, a) {
                        viewer.make(a[0]);
                    };
                }
            }
        }
        for (key in reply.pulldown.items) {
            if (key.match(/^\d+$/)) {
                reply.pulldown.items[key].onclick = function(e, a) {
                    viewer.reply(a[0], me.selectedFid, me.selectedUid);
                };
            }
        }
        for (key in replyall.pulldown.items) {
            if (key.match(/^\d+$/)) {
                replyall.pulldown.items[key].onclick = function(e, a) {
                    viewer.replyall(a[0], me.selectedFid, me.selectedUid);
                };
            }
        }
        for (key in forward.pulldown.items) {
            if (key.match(/^\d+$/)) {
                forward.pulldown.items[key].onclick = function(e, a) {
                    viewer.forward(a[0], me.selectedFid, me.selectedUid);
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
        DA.customEvent.fire("TopPanelController43PANESetFunctionAfter", this, {				
                                                                                        viewer: viewer,				
                                                                                        make: make,				
                                                                                        reply: reply,				
                                                                                        replyall: replyall,				
                                                                                        forward: forward				
        });				
    }
    
};

