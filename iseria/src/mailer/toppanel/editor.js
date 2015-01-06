/* $Id: editor.js 2467 2014-09-16 11:12:09Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/toppanel/editor.js $ */
/*jslint evil: true */
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
 * Builds a Top panel for message editor. 
 * 
 * Usage: 
 *   var tpc = new DA.mailer.TopPanelController4Editor();
 * 
 * @class TopPanelController4Editor
 * @uses 
 * @constructor
 * Todo: message
 */
DA.mailer.TopPanelController4Editor = function(panelNode, menuNode, query) {
	this.panelId   = panelNode.id;
    this.panelNode = panelNode;
    this.menuNode  = menuNode;
    
    if (DA.vars.custom.editor.setTopPanel) {
        eval(DA.vars.custom.editor.setTopPanel);
    }
    
    this.init(query);
};

/**
 * Members
 */
DA.mailer.TopPanelController4Editor.prototype = {
    
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
        leftOrder: ['transmit', 'save', 'template', 'preview', 'spellcheck' ,'back','print'],
        rightOrder: ['popy', 'close'],
        items: {
            transmit: {
                title       : DA.locale.GetText.t_('TOPMENU4EDITOR_TRANSMIT_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4EDITOR_TRANSMIT_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_transmit_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_transmit_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_transmit_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            save: {
                title       : DA.locale.GetText.t_('TOPMENU4EDITOR_SAVE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4EDITOR_SAVE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_save_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_save_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_save_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            template: {
                title       : DA.locale.GetText.t_('TOPMENU4EDITOR_TEMPLATE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4EDITOR_TEMPLATE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_template_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_template_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_template_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : null,
                pulldown    : null
            },            
            preview: {
                title       : DA.locale.GetText.t_('TOPMENU4EDITOR_PREVIEW_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4EDITOR_PREVIEW_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_preview_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_preview_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_preview_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            spellcheck: {
                title       : DA.locale.GetText.t_('SPELL_CHECK_BUTTON'),
                alt         : DA.locale.GetText.t_('SPELL_CHECK_BUTTON'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_preview_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_preview_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_preview_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            back: {
                title       : DA.locale.GetText.t_('TOPMENU4EDITOR_BACK_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4EDITOR_BACK_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_edit_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_edit_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_edit_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 1,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
          },
          print:{
                title       :DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),
                alt         :DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),
                smallIcon   :DA.vars.clrRdir+"/maildetails_print_s.gif",
                bigIcon     :DA.vars.clrRdir+"/maildetails_print_b.gif",
                disableIcon :DA.vars.clrRdir+"/maildetails_print_dis.gif",
                className   :'da_panelMenu4EditorItemLeft',
                hidden      :0,
                disable     :1,
                onSelect    :Prototype.emptyFunction,
                pulldown    :null
          },
            close: {
                title       : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_close_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_close_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_close_dis.gif",
                className   : 'da_panelMenu4EditorItemRight',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            popy: {
                title       : '',
                alt         : '',
                smallIcon   : DA.vars.clrRdir + "/maildetails_popy.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_popy.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_popy.gif",
                className   : 'da_panelMenu4EditorItemPopy',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            }
        },
        className: 'da_panelMenu4Editor'
    },
    
    init: function(query) {
    	//テンプレート
        var i;
        var clrRdir = DA.vars.clrRdir;
        if(!DA.util.isEmpty(query.backup_org_clrRdir)) {
            clrRdir = query.backup_org_clrRdir;
        }
        this.panelImages.center = clrRdir + "/mail_pop_back.gif";
        this.menuData.items.transmit.smallIcon = clrRdir + "/maildetails_transmit_s.gif";
        this.menuData.items.transmit.bigIcon = clrRdir + "/maildetails_transmit_b.gif";
        this.menuData.items.transmit.disableIcon = clrRdir + "/maildetails_transmit_dis.gif";

        this.menuData.items.save.smallIcon = clrRdir + "/maildetails_save_s.gif";
        this.menuData.items.save.bigIcon = clrRdir + "/maildetails_save_b.gif";
        this.menuData.items.save.disableIcon = clrRdir + "/maildetails_save_dis.gif";

        this.menuData.items.template.smallIcon = clrRdir + "/maildetails_template_s.gif";
        this.menuData.items.template.bigIcon = clrRdir + "/maildetails_template_b.gif";
        this.menuData.items.template.disableIcon = clrRdir + "/maildetails_template_dis.gif";

        this.menuData.items.preview.smallIcon = clrRdir + "/maildetails_preview_s.gif";
        this.menuData.items.preview.bigIcon = clrRdir + "/maildetails_preview_b.gif";
        this.menuData.items.preview.disableIcon = clrRdir + "/maildetails_preview_dis.gif";

        this.menuData.items.spellcheck.smallIcon = clrRdir + "/maildetails_preview_s.gif";
        this.menuData.items.spellcheck.bigIcon = clrRdir + "/maildetails_preview_b.gif";
        this.menuData.items.spellcheck.disableIcon = clrRdir + "/maildetails_preview_dis.gif";

        this.menuData.items.back.smallIcon = clrRdir + "/maildetails_edit_s.gif";
        this.menuData.items.back.bigIcon = clrRdir + "/maildetails_edit_b.gif";
        this.menuData.items.back.disableIcon = clrRdir + "/maildetails_edit_dis.gif";

        this.menuData.items.print.smallIcon = clrRdir + "/maildetails_print_s.gif";
        this.menuData.items.print.bigIcon = clrRdir + "/maildetails_print_b.gif";
        this.menuData.items.print.disableIcon = clrRdir + "/maildetails_print_dis.gif";

        this.menuData.items.close.smallIcon = clrRdir + "/maildetails_close_s.gif";
        this.menuData.items.close.bigIcon = clrRdir + "/maildetails_close_b.gif";
        this.menuData.items.close.disableIcon = clrRdir + "/maildetails_close_dis.gif";

        this.menuData.items.popy.smallIcon = clrRdir + "/maildetails_popy.gif";
        this.menuData.items.popy.bigIcon = clrRdir + "/maildetails_popy.gif";
        this.menuData.items.popy.disableIcon = clrRdir + "/maildetails_popy.gif";

        var template = this.menuData.items.template;
        var preview = this.menuData.items.preview;
        var spellcheck = this.menuData.items.spellcheck;
        var transmit = this.menuData.items.transmit;
        var print = this.menuData.items.print;
        
        if (DA.vars.config.template && DA.vars.config.template.length > 0) {
            template.pulldown = {};
            template.pulldown.className = 'da_topPanel4EditorPulldownMenu';
            if(DA.vars.config.template.length > 10){
            	YAHOO.util.Dom.addClass(template.pulldown, 'da_topPanel4EditorPulldownMenu2');
            }
            template.pulldown.order = [];
            template.pulldown.order[0] = [];
            template.pulldown.items = {};
            
            for (i = 0; i < DA.vars.config.template.length; i ++) {
                template.pulldown.order[0].push(i);
                template.pulldown.items[i] = {
                    text: DA.vars.config.template[i].name,
                    onclick: Prototype.emptyFunction,
                    args: [DA.vars.config.template[i].tid]
                };
            }
        } else {
            template.disable = 1;
        }
		if (DA.vars.config.spellcheck) {
	        //プレビュー
	        preview.pulldown = {};
	        preview.pulldown.className = 'da_topPanel4EditorPulldownMenu';
	        preview.pulldown.order = [];
	        preview.pulldown.order[0] = ['0','1'];
	        preview.pulldown.items = {};
	        preview.pulldown.items[0] = {
	        	text: DA.locale.GetText.t_('SPELLCHECK'),
	        	onclick: Prototype.emptyFunction,
	        	args: [1, 'preview']
	        };
	        preview.pulldown.items[1] = {
	        	text: DA.locale.GetText.t_('SPELLCHECK_NO'),
	        	onclick: Prototype.emptyFunction,
	        	args: [0, 'preview']
	        };
        
	        //送信
	        transmit.pulldown = {};
	        transmit.pulldown.className = 'da_topPanel4EditorPulldownMenu';
	        transmit.pulldown.order = [];
	        transmit.pulldown.order[0] = ['0','1'];
	        transmit.pulldown.items = {};
	        transmit.pulldown.items[0] = {
	        	text: DA.locale.GetText.t_('SPELLCHECK'),
	        	onclick: Prototype.emptyFunction,
	        	args: [1, 'transmit']
	        };
	        transmit.pulldown.items[1] = {
	        	text: DA.locale.GetText.t_('SPELLCHECK_NO'),
	        	onclick: Prototype.emptyFunction,
	        	args: [0, 'transmit']
	        };
	    }
        if (DA.vars.system.spellcheck_button_visible && DA.vars.config.spellcheck) {
            spellcheck.disable = 0;
        } else {
            spellcheck.hidden = 1;
        }

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

        var html = '<div id="' + this.panelId + '_TPC" class="da_topPanel4Editor">' +
                   '<div id="' + this.panelId + '_TPCL" class="da_topPanel4EditorLeft" style="background-image:url(' + this.panelImages.left + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCR" class="da_topPanel4EditorRight" style="background-image:url(' + this.panelImages.right + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCC" class="da_topPanel4EditorCenter" style="background-image:url(' + this.panelImages.center + ')"></div>' +
                   '</div>';
        
        this.panelNode.innerHTML = html;
        
        this.panelMenu = new DA.widget.PanelMenuController(this.menuNode, this.menuData);
    },
    
    setFunction: function(editor) {
        var me = this;
        var key;

        DA.customEvent.fire('topPanelController4EditorSetFunctionBefore', this, {
            editor: editor
        });
        
        this.menuData.items.transmit.onSelect = function() {
            editor.transmit();
        };
        this.menuData.items.save.onSelect = function() {
            editor.save();
        };
        this.menuData.items.preview.onSelect = function() {
            editor.preview();
        };
        this.menuData.items.spellcheck.onSelect = function(){
            editor.spellcheck( 1 , "preview");
        };
        this.menuData.items.back.onSelect = function() {
            editor.back();
        };
        this.menuData.items.close.onSelect = function() {
            if(DA.util.confirm(DA.locale.GetText.t_("EDITOR_CLOSE_CONFIRM"))){
                DA.windowController.allClose();
                editor.close();
            }
		};
        this.menuData.items.print.onSelect=function(){
			editor.print(null);
		};
        if (this.menuData.items.template.pulldown) {
            for (key in this.menuData.items.template.pulldown.items) {
                if (key.match(/^\d+$/)) {
                    this.menuData.items.template.pulldown.items[key].onclick = function(e, a) {
                        editor.template(a[0]);
                    };
                }
            }
        }
        if (this.menuData.items.preview.pulldown) {
            for (key in this.menuData.items.preview.pulldown.items) {
                if (key.match(/^\d+$/)) {
                    this.menuData.items.preview.pulldown.items[key].onclick = function(e, a) {
                        editor.spellcheck(a[0],a[1]);
                    };
                }
            }
        }
        if (this.menuData.items.transmit.pulldown) {
            for (key in this.menuData.items.transmit.pulldown.items) {
                if (key.match(/^\d+$/)) {
                    this.menuData.items.transmit.pulldown.items[key].onclick = function(e, a) {
                        editor.spellcheck(a[0],a[1]);
                    };
                }
            }
        }
        for (key in this.menuData.items.print.pulldown.items) {
            if (key.match(/^\d+$/)) {
                this.menuData.items.print.pulldown.items[key].onclick = function(e, a) {
                    editor.print(a[0]);
                };
            }
        }
        
        DA.customEvent.fire('topPanelController4EditorSetFunctionAfter', this, {
            editor: editor
        });
    }
};
