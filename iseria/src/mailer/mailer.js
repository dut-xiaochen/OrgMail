/* $Id: mailer.js 2378 2014-04-13 08:31:57Z jl_zhou $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/mailer.js $ */
/*for JSLINT undef checks*/
/*extern $H BrowserDetect */
/**
 * TODO: comments
 */
/*extern DA YAHOO*/
if ('undefined' === typeof DA) {
    alert("ERROR: need DA.js");
} else {
    if (! DA.mailer) {
        DA.mailer = {};
        DA.mailer.util = {};
        DA.mailer.connection = {};
        DA.mailer.widget = {};
        DA.mailer.windowController = {};
    }
}

DA.mailer.util = {
    treeOpenStatus: {},

    treeOpenAll: function(id) {
        if (DA.util.isEmpty(DA.mailer.util.treeOpenStatus[id])) {
            DA.mailer.util.treeOpenStatus[id] = false;
        }
        if (DA.mailer.util.treeOpenStatus[id]) {
            DA.mailer.util.treeOpenStatus[id] = false;
            // YAHOO.widget.TreeView.getTree(id).collapseAll();
            // render bug with select folder.
            this._treeCloseAllChildren(YAHOO.widget.TreeView.getTree(id).getRoot());
        } else {
            DA.mailer.util.treeOpenStatus[id] = true;
            // YAHOO.widget.TreeView.getTree(id).expandAll();
            // render bug with select folder.
            this._treeOpenAllChildren(YAHOO.widget.TreeView.getTree(id).getRoot());
        }
    },
    
    _treeOpenAllChildren: function(node) {
        var i, child;
        for (i = 0; i < node.children.length; i ++) {
            child = node.children[i];
            if (child.hasChildren()) {
                child.expand();
                this._treeOpenAllChildren(child);
            }
        }
    },
    
    _treeCloseAllChildren: function(node) {
        var i, child;
        for (i = 0; i < node.children.length; i ++) {
            child = node.children[i];
            if (child.hasChildren()) {
                child.collapse();
                this._treeCloseAllChildren(child);
            }
        }
    },
    
    checkResult: function(o) {
        if (o.result.error === 9) {
			if(o.result.message==='OLD_OF_FOLDER'){
				if(DA.util.confirm(DA.locale.message.core[o.result.message])){
					window.location.reload();
				}
			}else{
            	DA.util.error(o.result.message);
            }
            return false;
        } else if (o.result.error === 2) {
            DA.util.warn(o.result.message);
            return true;
        } else if (o.result.error === 1) {
            DA.util.warn(o.result.message);
            return false;
        } else {
            return true;
        }
    },
    
    reloadPortal: function() {
		var cr_date;
        try {
			cr_date=window.opener.document.date_form.date.value;
			window.opener.DAportletRefresher.refresh_all('mail',cr_date,'');
        } catch(e) {
			window.opener.location.href=DA.util.setUrl(DA.vars.cgiRdir+"/login_main.cgi?time="+DA.util.getTime()+"&date="+window.opener.document.date_form.date.value);
        }
    },
    
    isRoot: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.root, 10);
    },
    
    isServer: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.server, 10);
    },
        
    isInbox: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.inbox, 10);
    },
    
    isDraft: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.draft, 10);
    },

    isSent: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.sent, 10);
    },
    
    isTrash: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.trash, 10);
    },
    
    isSpam: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.spamx, 10);
    },
    
    isDefault: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType['default'], 10);
    },
    
    isMailbox: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.mailbox, 10);
    },
    
    isCabinet: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.cabinet, 10);
    },
    
    isLocalServer: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.localServer, 10);
    },
    
    isLocalFolder: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.localFolder, 10);
    },
    
    isJoin: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.join, 10);
    },
    
    isBackupFolder: function(type) {
       return parseInt(type, 10) === parseInt(DA.vars.folderType.backupFolder, 10);
    },
	
	getOperationFlag: function() {
		var key = OrgMailer.vars.cookie_key + "-operation_flag";
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length ; i++) {
			if (cookies[i].split("=")[0].replace(/(^\s*)|(\s*$)/g, "") === key) {
				if ( typeof cookies[i].split("=")[1] === "undefined"){
					return "";
				}
				return cookies[i].split("=")[1];
			}
		}
		return "";
	},
	
	getOperationWarnedFlag: function() {
		var key = OrgMailer.vars.cookie_key + "-operation_warned";
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length ; i++) {
			if (cookies[i].split("=")[0].replace(/(^\s*)|(\s*$)/g, "") === key) {
				if ( typeof cookies[i].split("=")[1] === "undefined"){
					return "";
				}
				return cookies[i].split("=")[1];
			}
		}
		return "";
	},
	
	getMailAccount: function() {
		var key = OrgMailer.vars.cookie_key + "-org_mail";
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length ; i++) {
			if (cookies[i].split("=")[0].replace(/(^\s*)|(\s*$)/g, "") === key) {
				if ( typeof cookies[i].split("=")[1] === "undefined"){
					return "";
				}
				return cookies[i].split("=")[1];
			}
		}
	},
	
	autoCloseWaitingMask: function() {
		var atuoCloser = window.setInterval(function(){
			if (DA.mailer.util.getOperationFlag() === ""){
				DA.waiting.hide();
				OrgMailer.vars.mask_show = 0;
				OrgMailer.vars.operation_warned = 0;
				window.clearInterval(atuoCloser);
				if (!OrgMailer.vars.is_blured){
					document.cookie = OrgMailer.vars.cookie_key + "-org_mail=" + OrgMailer.vars.org_mail_gid + ";";
				}
			}
		},500);
	},
	
	setOperationFlag: function(flag) {
		document.cookie = OrgMailer.vars.cookie_key + "-operation_flag=" + flag;
	},
	
	setOperationWarnedFlag: function(flag) {
		var tmpWarnedFlag = DA.mailer.util.getOperationWarnedFlag();
		if (flag === ""){
			tmpWarnedFlag = "";
		} else {
			if (tmpWarnedFlag.indexOf(flag) < 0){
				if (tmpWarnedFlag !== ""){
					tmpWarnedFlag += ",";
				}
				tmpWarnedFlag += flag;
			}
		}
		document.cookie = OrgMailer.vars.cookie_key + "-operation_warned=" + tmpWarnedFlag +";";
	}
};



DA.mailer.connection = {
    titleNode: null,
    
    titleBarNode: null,
    
    titleBarNumber: 0,
    
    clearLogined: function() {
        try {
            window.opener.AjaxMailerLogined = 0;
            window.opener.AjaxMailerWindow  = null;
        } catch(e) {
        }
    },
    
    login: function() {
        // min window size
        if (YAHOO.util.Dom.getViewportWidth() < 100 || YAHOO.util.Dom.getViewportHeight() < 100) {
            DA.util.warn(DA.locale.GetText.t_('WINDOW_SIZE_WARN'));
            window.resizeTo(800, 600);
        }
        
        // title
        var body = document.body;
        var div  = document.createElement('div');
        var img  = document.createElement('div');
        
        // Recommended way of setting many properties of the same object
        Object.extend(div.style, {
            position : 'absolute',
            top      : '0px',
            left     : '0px',
            width    : '100%',
            height   : '100%',
            zIndex   : '1000',
            verticalAlign      : 'middle',
            backgroundColor    : '#e1e1e1',
            backgroundImage    : 'url(' + DA.vars.imgRdir + '/ajaxmail_bk.gif)',
            backgroundRepeat   : '',
            backgroundPosition : ''
        });

        img.innerHTML = '<div style="text-align:center; margin:70px 0px 0px 0px;">' +
                        '<div>' + DA.imageLoader.tag(DA.vars.imgRdir + '/ajaxmail_logo.gif', '', { width:120, height:30 }) + '</div>' +
                        '<div style="margin:20px 0px 0px 0px;">' + DA.imageLoader.tag(DA.vars.imgRdir + '/ajaxmail_read.gif', '', { width:44, height:44 }) + '</div>' +
                        '<div>' + DA.imageLoader.tag(DA.vars.imgRdir + '/ajaxmail_bar00.gif', '', { id:'da_title_bar', width:290, height:53 }) + '</div>' +
                        '<div style="margin:2px 0px 6px 0px;">' +DA.locale.GetText.t_('STARTING') + '</div>' +
                        '<div style="font-size:9px;">' + DA.locale.GetText.t_('STARTING_WARN') + '</div>' +
                        '<div style="margin:30px 0px 0px 0px;font-size:9px;">' + DA.imageLoader.tag(DA.vars.imgRdir + '/ajaxmail_iselogo.gif', '') + '<br>' +
                        DA.locale.GetText.t_('COPYRIGHT', '2006-2014') + '</div>' +
                        '</div>';
        
        div.appendChild(img);
        body.insertBefore(div, body.firstChild);
        
        this.titleNode = div;
        this.titleBarNode = YAHOO.util.Dom.get('da_title_bar');
        
        if (BrowserDetect.browser === 'Explorer') {
            if (BrowserDetect.version === 6) {
            } else if (BrowserDetect.version > 6) {
            } else {
                DA.util.warn(DA.locale.GetText.t_('BROWSER_ERROR'));
                window.close();
            }
        } else if (BrowserDetect.browser === 'Firefox') {
            if (BrowserDetect.version > 1) {
            } else {
                DA.util.warn(DA.locale.GetText.t_('BROWSER_WARN'));
            }
        } else if (BrowserDetect.browser === 'Mozilla') {
            if (BrowserDetect.OS === 'Linux') {
                // Be nice to Linux users; they can't run IE6!
            } else { // Probably Windows.
                DA.util.warn(DA.locale.GetText.t_('BROWSER_WARN'));
            }
        } else {
            //DA.util.warn(DA.locale.GetText.t_('BROWSER_ERROR'));
            //window.close();
        }
    },
    
    logout: function() {
        var id, me = this;

        if (DA.util.lock('logout')) {
            if (DA.util.confirm(DA.locale.GetText.t_('MAILER_CLOSE_CONFIRM'))) {
                id = setInterval(function() {
                    var io;
                    
                    if (!DA.io.Manager.isActive()) {
                        clearInterval(id);
                        DA.windowController.allClose();
                        
                        io = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_logout.cgi' );
                        
                        io.callback = function(o) {
                            if (DA.mailer.util.checkResult(o)) {
                                me.clearLogined();
                                if (BrowserDetect.browser === 'Mozilla' || BrowserDetect.browser === 'Firefox') {
									// close window in Mozilla/Firefox
									window.open(null,"_self").close();
                                } else {
                                    window.close();
                                }
                            } else {
                                if (DA.util.confirm(DA.locale.GetText.t_('LOGOUT_ERROR_CONFIRM'))) {
                                    me.clearLogined();
                                    if (BrowserDetect.browser === 'Mozilla' || BrowserDetect.browser === 'Firefox') {
                                        // close window in Mozilla/Firefox
									    window.open(null,"_self").close();
                                    } else {
                                        window.close();
                                    }
                                } else {
                                    DA.util.unlock('logout');
                                }
                            }
                        };
                        
                        io.errorHandler = function(e) {
                            if (DA.util.confirm(DA.locale.GetText.t_('LOGOUT_ERROR_CONFIRM'))) {
                                me.clearLogined();
                                if (BrowserDetect.browser === 'Mozilla' || BrowserDetect.browser === 'Firefox') {
									// close window in Mozilla/Firefox
									window.open(null,"_self").close();
                                } else {
                                    window.close();
                                }
                            } else {
                                DA.util.unlock('logout');
                            }
                        };
                        
                        io.execute();
                    }
                }, 1000);
            } else {
                DA.util.unlock('logout');
            }
        }
    },
    
    _saveStateIO: new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_config.cgi' ),
    
    saveState: function() {
        var io, params, aUIInfo, i;
        
        if (DA.util.lock('saveState')) {
            io = this._saveStateIO;
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    DA.util.warn(DA.locale.GetText.t_('SAVE_STATE_MESSAGE'));
                    DA.util.unlock('saveState');
                    try {
                        window.opener.AjaxMailerWindowWidth  = params.window_width;
                        window.opener.AjaxMailerWindowHeight = params.window_height;
                        window.opener.AjaxMailerWindowPosX   = params.window_pos_x;
                        window.opener.AjaxMailerWindowPosY   = params.window_pos_y;
                    } catch(e) {
                    }
                }
            };
            
            io.errorHandler = function(e) {
                DA.util.unlock('saveState');
            };
            
            params  = {
                proc:          'default',
                window_pos_x:  (BrowserDetect.browser === 'Explorer') ? window.screenLeft - 4 : window.screenX,
                window_pos_y:  (BrowserDetect.browser === 'Explorer') ? window.screenTop - 30 : window.screenY,
                window_width:  YAHOO.util.Dom.getViewportWidth(),
                window_height: YAHOO.util.Dom.getViewportHeight()
            };
            if (params.window_pos_x < 0) {
                params.window_pos_x = 0;
            }
            if (params.window_pos_y < 0) {
                params.window_pos_y = 0;
            }
            aUIInfo = DA.session.UIState.getAllStateInfo();
            aUIInfo.each(function(widget) {
                var list_column_width = '';
                if (widget.name === 'threePane') {
                    params.dir_width   = widget.info.leftPane.width;
                    params.list_height = widget.info.rightTopPane.height;
                } else if (widget.name === 'mboxgrid') {
                    widget.info.columns.each(function(col) {
                        list_column_width += col.width + '|';
                    });
                    params.list_column_width = list_column_width.replace(/\|+$/, "");
                } else if (widget.name === 'messageViewer') {
                    params.detail_header_open = widget.info.headerExpanded;
                    params.detail_header_to_open = widget.info.headerToExpanded;
                    params.detail_header_cc_open = widget.info.headerCcExpanded;
                    params.detail_header_attachment_open = widget.info.headerAttachmentExpanded;
                }
            });
            
            io.execute(params);
        }
    },
    
    titleShow: function() {
        if (this.titleNode.style.display === 'none') {
            this.titleNode.style.display = '';
        }
    },
    
    titleHide: function() {
        if (this.titleNode.style.display === '') {
            this.titleNode.style.display = 'none';
        }
    },
    
    titleBar: function() {
        if (this.titleNode.style.display === '') {
            this.titleBarNumber ++;
            if (this.titleBarNumber < 10) {
                this.titleBarNode.src = DA.vars.imgRdir + '/ajaxmail_bar0' + this.titleBarNumber.toString() + '.gif';
            } else {
                this.titleBarNumber = 10;
                this.titleBarNode.src = DA.vars.imgRdir + '/ajaxmail_bar' + this.titleBarNumber.toString() + '.gif';
            }
        }
    }
};

DA.mailer.windowController = {
	viewerWidth: function(w) {
		if (w) {
			DA.session.Values.registerValue("viewerWindowWidth", w);
		}
		return DA.session.Values.getValue("viewerWindowWidth") || DA.vars.config.viewer_width;
	},
	viewerHeight: function(h) {
		if (h) {
			DA.session.Values.registerValue("viewerWindowHeight", h);
		}
		return DA.session.Values.getValue("viewerWindowHeight") || DA.vars.config.viewer_height;
	},
    viewerOpen: function(fid, uid, srid) {
        var url;
        if (DA.util.isEmpty(srid)) {
            url = DA.vars.cgiRdir + '/ajax_mailer.cgi?html=viewer&fid=' + fid + '&uid=' + uid;
        } else {
            url = DA.vars.cgiRdir + '/ajax_mailer.cgi?html=viewer&fid=' + fid + '&uid=' + uid + '&srid=' + srid;
        }
		url += "&org_mail_gid=" + OrgMailer.vars.org_mail_gid;
        // DA_DEBUG_START
        url = "test_MessageViewer.html?fid=" + fid + "&uid=" + uid + ( srid ? '&srid='+srid : '' );
        // DA_DEBUG_END

        if (DA.vars.html && DA.vars.html.viewer) {
            DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",this.viewerWidth(),this.viewerHeight()),url,DA.vars.html.viewer);
        } else {
            DA.windowController.winOpenNoBar(url,"",this.viewerWidth(),this.viewerHeight());
        }
    },
    
    /**
     * TODO: comments needs; what is proc?
     */
   editorWidth: function(w) {
		if (w) {
	               DA.session.Values.registerValue("editorWindowWidth", w);
	    }
		return DA.session.Values.getValue("editorWindowWidth") || DA.vars.config.editor_width;
	},
	editorHeight: function(h) {
		if (h) {
			       DA.session.Values.registerValue("editorWindowHeight", h);
	    }
	    return DA.session.Values.getValue("editorWindowHeight") || DA.vars.config.editor_height;
	},
    editorOpen: function(proc, fid, uid, tid, quote) {
        var url = DA.vars.cgiRdir + '/ajax_mailer.cgi?html=editor&richtext=1';      
        // DA_DEBUG_START
        url = "test_MessageEditor.html?richtext=1";
        // DA_DEBUG_END
        if (!DA.util.isEmpty(proc)) {
            url += '&proc=' + proc;
        }
        if (!DA.util.isEmpty(fid)) {
            url += '&fid=' + fid + '&uid=' + uid;
        }
        if (!DA.util.isEmpty(tid)) {
            url += '&tid=' + tid;
        }
        if (!DA.util.isEmpty(quote)) {
            url += '&quote=' + quote;
        }
		url += "&org_mail_gid=" + OrgMailer.vars.org_mail_gid;
        if (DA.vars.html && DA.vars.html.editor) {
            DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",this.editorWidth(),this.editorHeight()),url,DA.vars.html.editor);
        } else {
            DA.windowController.winOpenNoBar(url,"",this.editorWidth(),this.editorHeight());
        }
    },

     editorOpenBackUp: function(proc, fid, uid, backup_maid, backup_org_clrRdir) {
        var url = DA.vars.cgiRdir + '/ajax_mailer.cgi?html=editor&richtext=1';
        // DA_DEBUG_START
        url = "test_MessageEditor.html?richtext=1";
        // DA_DEBUG_END
        if( !DA.mailer.windowController.backup_reopenable(proc, fid, uid)) {
            DA.util.warn(DA.locale.GetText.t_("MESSAGE_EDIT_REOPEN_ERROR"));
            return;
        }
        if (!DA.util.isEmpty(proc)) {
            url += '&proc=' + proc;
        }
        if (!DA.util.isEmpty(fid)) {
            url += '&fid=' + fid + '&uid=' + uid;
        }
        if(!DA.util.isEmpty(backup_maid)) {
            url += '&backup_maid=' + backup_maid;
        }
        if(!DA.util.isEmpty(backup_org_clrRdir)) {
            url += '&backup_org_clrRdir=' + backup_org_clrRdir;
        }
		url += "&org_mail_gid=" + OrgMailer.vars.org_mail_gid;
        if (DA.vars.html && DA.vars.html.editor) {
            DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",this.editorWidth(),this.editorHeight()),url,DA.vars.html.editor);
        } else {
            DA.windowController.winOpenNoBar(url,"",this.editorWidth(),this.editorHeight());
        }
    },	

    backup_reopenable: function(proc, fid, uid) {
        var c_set,c_win,backup_maid;
        var i = 0;
        var flag = true;
        if(!DA.util.isEmpty(fid) && !DA.util.isEmpty(window.__folderTree.backupFolderFid) && fid === window.__folderTree.backupFolderFid.toString() && proc ==='edit') { 
            c_set = window.DA.windowController.data;
            if(!DA.util.isUndefined(c_set)) {
                for(i=0;i<c_set.length;i++) {
                   try { 
                    c_win = c_set[i];
                   }catch(e) {
                     continue;
                   }
                    if(!DA.util.isUndefined(c_win) && !c_win.closed) {
                        if(DA.util.isUndefined(c_win.__messageEditor)) {
                            continue;
                        }
                        backup_maid = c_win.__messageEditor.backup_maid;
                        if( !DA.util.isEmpty(uid) && !DA.util.isEmpty(backup_maid) && uid.toString() === backup_maid.toString())  {
                            flag = false;
                            break;
                        }
                    }
                }
            }
        }
        return flag;
    },
    
    editorOpen4url: function(url, width, height) {
        url = url.replace(/&external\=\d/, "");
        if (DA.vars.html && DA.vars.html.editor) {
            DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",DA.mailer.windowController.editorWidth(),DA.mailer.windowController.editorHeight()),url,DA.vars.html.editor);
        } else {
            DA.windowController.winOpenNoBar(url, '', width, height);
        }
    },
    
    searcherOpen: function(fid) {
        var status = 'width=800,height=600' +
                     ',resizable=yes,scrollbars=yes,location=no' +
                     ',menubar=no,toolbar=no,statusbar=no';
        var url = DA.vars.cgiRdir + '/ajax_mailer.cgi?html=searcher&search=1&fid=' + fid;
		url += "&org_mail_gid=" + OrgMailer.vars.org_mail_gid;
        // DA_DEBUG_START
        url = "test_MessageSearcher.html?fid=" + fid;
        // DA_DEBUG_END
        if (DA.vars.html && DA.vars.html.searcher) {
            DA.mailer.windowController.documentWrite(DA.windowController.winOpenCustom('', '', status), url, DA.vars.html.searcher);
        } else {
            DA.windowController.winOpenCustom(url, '', status);
        }
    },
    
    documentWrite: function(obj, url, html) {
        html = html.replace(/\<\!\-\- requestUrl \-\-\>/, url);
        obj.document.open();
        obj.document.write(html);
        obj.document.close();
    }
};

DA.mailer.checkSession = function (){
    if(BrowserDetect.browser==="Explorer"&&typeof (window.opener)==="object"&&typeof (window.opener.DA)==="object"&&typeof (window.opener.DA.session)==="object"){
        try{
            DA.session.Values.getValue();
        }catch(e){
            DA.session=window.opener.DA.session;
        }
    }else{
        if(BrowserDetect.browser!=="Explorer"&&window.opener&&window.opener.DA&&window.opener.DA.session){
            try{
                DA.session.Values.getValue();
            }catch(e){
                DA.session=window.opener.DA.session;
            }
        }else{
            try{
                DA.session.Values.getValue();
            }catch(e){
                (function () { // Create a private scope

                    var widgets = $H({}); // private hash
                    var values = $H({});
                    function _getStateInfo(w) {
                        if ('function' !== typeof w.getUIStateInfo) { // duck typing?
                            // DA_DEBUG_START
                            DA.log("No widget for "+name, "warn", "UIState");
                            // DA_DEBUG_END
                            return;
                        }
                        return w.getUIStateInfo();
                    }

                     DA.session = {
                         Values: {
                                registerValue: function(name, value) {
                                values[name] = value;
                                },
                                getValue: function(name) {
                                return values[name];
                                }
                         },

                         UIState: {

                /**
                 * @method registerWidget
                 * @static
                 * @param name   {String} unique name/id for the widget
                 * @param widget {Object} instance of DA.*widget.*
                 */
                             registerWidget: function(name, widget) {
                                 widgets[name] = widget;
                             },

                /**
                 * Retrieve state information for the given widget.
                 *
                 * @method getStateInfo
                 * @static
                 * @param name   {String} unique name/id of the widget
                 * @returns      {Hash} object containing name/value pairs
                 *                      of state information
                 */
                             getStateInfo: function(name) {
                                 var w = widgets[name];
                                 if (!w) {
                                     // DA_DEBUG_START
                                     DA.log("No widget for "+name, "warn", "UIState");
                                     // DA_DEBUG_END
                                     return;
                                 }
                                 return _getStateInfo(w);

                            },


                /**
                 * Get all the state info we have registered....
                 * @method getAllStateInfo
                 * @static
                 * @return {Array} Array of Objects, each with
                 *                          name: name of the widget
                 *                          info: hash containing state info
                 */
                             getAllStateInfo: function() {
                                 return widgets.map(function (ent /*entry*/) {
                                     return {
                                         name: ent.key,
                                         info: _getStateInfo(ent.value)
                                     };
                                 });
                             }
                         }
                     };
                })();
            }
        }
    }
};
if (!OrgMailer.vars.is_mail_box && BrowserDetect.browser === 'Explorer' &&
    typeof(window.opener) === 'object' && 
    typeof(window.opener.DA) === 'object' &&
    typeof(window.opener.DA.mailer) === 'object' &&
    typeof(window.opener.DA.mailer.Events) === 'object') {
    // Take the global reference to Events from the one, single parent window for IE
    DA.mailer.Events = window.opener.DA.mailer.Events;

} else if (!OrgMailer.vars.is_mail_box && BrowserDetect.browser !== 'Explorer' &&
           window.opener &&
           window.opener.DA &&
           window.opener.DA.mailer &&
           window.opener.DA.mailer.Events) {
    // Take the global reference to Events from the one, single parent window for FireFox
    DA.mailer.Events = window.opener.DA.mailer.Events;
    
} else {

    DA.mailer.Events = {
    
        /**
         * Custom event fired when messages are either MOVING (folder-to-folder) or
         * DELETING (also if they are just moving to the TRASH folder).
         * （削除イベント）
         * @property onMessagesMoving
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                      - messages {Object} The collecion of messages being moved
         *                                          keys: singles, ranges, etc
         *                      - target   {Hash}   Object literal with info about
         *                                          where the messages are being moved
         *                                          keys: fid, or trash
         * @param    {Number} serial number, or JOB ID
         */
        onMessagesMoving: new YAHOO.util.CustomEvent("onMessagesMoving"),
    
        /**
         * Custom event fired when messages are either MOVED (folder-to-folder) or
         * DELETED (also if they are just moved to the TRASH folder).
         * （削除イベント）
         * @property onMessagesMoved
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                    - srcFid:   {Int}    The ID of the IMAP folder from which messages were moved
         *                    - target:   {Object} Information about the destination folder, or the deletion:
         *                                         Keys: fid:   {Int}     Destination IMAP folder ID
         *                                               trash: {Boolean} If, true, implies TRASH/DELETE
         *                    - count:    {Int}    The number of messages moved/deleted
         *                    - response: {Object} The eval'd JSON response as returned
         *                                         by the CGI /ajx_ma_move.cgi
         */
        onMessagesMoved: new YAHOO.util.CustomEvent("onMessagesMoved"),
    
        /**
         * Custom event fired when messages are either MOVE FAILER (folder-to-folder) or
         * DELETE FAILURE (also if they are just move failure to the TRASH folder).
         * （削除イベント）
         * @property onMessagesMoveFailure
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                    - srcFid:   {Int}    The ID of the IMAP folder from which messages were move failer
         *                    - target:   {Object} Information about the destination folder, or the deletion:
         *                                         Keys: fid:   {Int}     Destination IMAP folder ID
         *                                               trash: {Boolean} If, true, implies TRASH/DELETE
         *                    - count:    {Int}    The number of messages move failer/delete failer
         *                    - response: {Object} The eval'd JSON response as returned
         *                                         by the CGI /ajx_ma_move.cgi
         */
        onMessagesMoveFailure: new YAHOO.util.CustomEvent("onMessagesMoveFailure"),
      
        // FIXME: Comments, JSDOC?
        onMessageSent: new YAHOO.util.CustomEvent("onMessageSent"),
        onMessageSaved: new YAHOO.util.CustomEvent("onMessageSaved"),

        /**
         * TODO: comments
         */
        onMessagesFiltering: new YAHOO.util.CustomEvent("onMessagesFiltering"),
    
        onMessagesFiltered: new YAHOO.util.CustomEvent("onMessagesFiltered"),
    
        onMessagesFilterFailure: new YAHOO.util.CustomEvent("onMessagesFilterFailure"),
    
        /**
         * Custom event fired when messages are mbox grid loadRows
         * @property onMboxGridLoadRows
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                    - fid:      {Int}    The ID of the affected IMAP folder
         *                    - count:    {Int}    The number of messages affected
         *                    - response: {Object} The eval'd JSON response as returned
         *                                         by the CGI /ajx_ma_list.cgi
         */
        onMboxGridLoadRows: new YAHOO.util.CustomEvent("onMboxGridLoadRows"),
        
        /**
         * Custom event fired when messages drag out on folder
         * @property onMessagesDragOut
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                    - fid:      {Int}    The ID of the affected IMAP folder
         */
        onMessagesDragOut: new YAHOO.util.CustomEvent("onMessagesDragOut"),
        
        /**
         * Custom event fired when messages drag enter on folder
         * @property onMessagesDragEnter
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                    - fid:      {Int}    The ID of the affected IMAP folder
         */
        onMessagesDragEnter: new YAHOO.util.CustomEvent("onMessagesDragEnter"),

        /**
         * CustomEvent 
         */
        onFolderTreeReady: new YAHOO.util.CustomEvent("onFolderTreeReady"),

        // TODO: comments, jsdoc
        onMessageMoveRequest:  new YAHOO.util.CustomEvent("onMessageMoveRequest"),
       
        onMessageRead:         new YAHOO.util.CustomEvent("onMessageRead"),

        // TODO: comments, jsdoc
        onMessageFlagRequest:  new YAHOO.util.CustomEvent("onMessageFlagRequest"),
        onMessagesFlagging:    new YAHOO.util.CustomEvent("onMessagesFlagging"),
        onMessagesFlagged:     new YAHOO.util.CustomEvent("onMessagesFlagged"),
        onMessagesFlagFailure: new YAHOO.util.CustomEvent("onMessagesFlagFailure")
    };
}

var Pop4Ajax = DA.mailer.windowController.editorOpen4url;
