/* $Id: info.js 2510 2014-11-05 05:07:38Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/file/info.js $ */
/*for JSLINT undef checks*/
/*extern $H DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

DA.file = {
   list2String: function(filelist, cols, max) {
        var i, l, f;
        var string = '';
        var Bdown_link;
        
        if (DA.util.isEmpty(cols)) {
            cols = 3;
        }
        
        if (filelist) {
        	if (filelist.length >= 2 && DA.vars.config.soft_install === 1) {
        		Bdown_link = filelist[0].link.replace(/(.;)/g,", 'all'$1");
        		string += '<span style="white-space: nowrap;" id="down_all_button" >' +
        					'<span style="float:right;white-space: nowrap;" onclick="' + Bdown_link + '' +
        					'" class="da_fileInformationListLink">'+ DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_download_all.gif', '', {width:80,height:15,border:0})+ '</span></span>';
        		string += '<span style="white-space: nowrap;" id="save_all_button" >' +
                            '<span style="float:right;white-space: nowrap;" onclick = "window.__messageViewer.showsaveattachestolibdialog(event.clientX, event.clientY);"' + 
                            '" class="da_fileInformationListLink">'+ DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_library_save.gif', '', {width:80,height:15,border:0})+ '</span></span>';
                }
            for(i = 0; i < filelist.length; i ++) {
                l = '';
                f = filelist[i];
                
                if (DA.util.isEmpty(f.name)) {
                    continue;
                } else {
                	f.name = DA.util.jsubstr4attach(f.name);
                    l = this.object2String(f, true, true, true);
                }
                
                if (!DA.util.isEmpty(l)) {
                    l = '<span style="white-space: nowrap;">' + l + '</span>';
                }
                
                if (!DA.util.isEmpty(l)) {
                    if (DA.util.isNumber(max) && i + 1 >= max) {
                        string += '<span style="white-space: nowrap;">' + l + '&nbsp;<b>..</b></span>\n';
                        break;
                    } else {
                        string += '<span style="white-space: nowrap;">' + l + '&nbsp;</span>\n';
                    }
                    if (cols > 0 && (i + 1) % cols === 0) {
                        string += '<br>';
                    }
                }
            }
        }
        
        return string;
    },
    
    object2String: function(f, icon, link, document) {
        var string = DA.util.encode(f.name);
        
        if (!DA.util.isEmpty(f.link) && link) {
            string = '<span onclick="' + f.link + '" class="da_fileInformationListLink" title="'+f.title+'">' + string + '</span>';
        }
        
        if (!DA.util.isEmpty(f.icon) && icon) {
            string = DA.imageLoader.tag(f.icon, f.alt, { align: 'absmiddle' }) + string;
        }
        
        if (!DA.util.isEmpty(f.document) && document) {
            string += '<span onclick="' + f.document + '" class="da_fileInformationListLink">' +
                      DA.imageLoader.tag(DA.vars.imgRdir + '/ico_fc_docsave.gif', '', { align: 'absmiddle' }) +
                      '</span>';
        }
        
        return string;
    },
    
    openDownload4New: function(MAID, AID, ALL) {
    	var Proc, url, pwin, flg;
    	if (DA.vars.config.download_type === 'simple' && typeof(ALL) === 'undefined') {
    		url = DA.vars.cgiRdir + '/ma_ajx_download.cgi?proc=mail&maid=' + MAID + '&aid=' + AID;
    		flg=1;
    	} else { 
			if(ALL==='all'){
				Proc  = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=Bdownload%26maid=' + MAID + '%26aid=' + AID;
			} else {
        		Proc  = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=mail%26maid=' + MAID + '%26aid=' + AID;
			}
        	url = DA.vars.cgiRdir + '/down_pop4ajax.cgi?proc='+Proc;
    	}
        pwin = DA.windowController.winOpenNoBar(url, '', 400, 450, flg);
    },
    
    openDownload4Detail: function(FID, UID, AID, ALL) {
    	var pwin, url, Proc, flg;
    	if (DA.vars.config.download_type === 'simple' && typeof(ALL) === 'undefined'){
    		url = DA.vars.cgiRdir+'/ma_ajx_download.cgi?proc=detail&fid='+FID+'&uid='+UID+'&aid='+AID;
    		flg=1;
    	} else {
    		if(ALL==='all'){
    			Proc=DA.vars.cgiRdir+'/ma_ajx_download.cgi%3fproc=Bdownload%26fid='+FID+'%26uid='+UID+'%26aid='+AID;
    		} else {
    			Proc=DA.vars.cgiRdir+'/ma_ajx_download.cgi%3fproc=detail%26fid='+FID+'%26uid='+UID+'%26aid='+AID;
    		}
         	url = DA.vars.cgiRdir + '/down_pop4ajax.cgi?proc='+Proc;
    	}
         pwin=DA.windowController.winOpenNoBar(url,'','400','450',flg);
    },
    
    openDocument4New: function(MAID, AID, TYPE) {
        var Cgi  = (TYPE === 1) ? "ow_folder_select.cgi" : "lib_foldersel.cgi";
        var Proc = Cgi + '%3fproc=mail%20maid=' + MAID + '%20aid=' + AID;
        var Img  = 'pop_title_attachsave.gif';
        DA.windowController.isePopup(Proc, Img, 400, 450, MAID);
    },
    
    openDocument4Detail: function(FID, UID, AID, TYPE) {
        var Cgi  = (TYPE === 1) ? "ow_folder_select.cgi" : "lib_foldersel.cgi";
        var Proc = Cgi + '%3fproc=detail%20fid=' + FID + '%20uid=' + UID + '%20aid=' + AID;
        var Img  = 'pop_title_attachsave.gif';
        DA.windowController.isePopup(Proc, Img, 400, 550, FID + "_" + UID);
    },
    
    openAttach: function(MAID) {
        var Proc = 'ma_ajx_attach.cgi%3fmaid=' + MAID;
        var Img  = 'pop_title_attachfile.gif';
        DA.windowController.isePopup(Proc, Img, 500, 450, MAID);
    }
};

DA.file.InformationListController = function(node, filelist, cbhash, cfg) {
    this.fileNode = node;
    
    if (cbhash) {
        if (DA.util.isFunction(cbhash.onRemove)) {
            this.onRemove = cbhash.onRemove;
        }
        if (DA.util.isFunction(cbhash.onPopup)) {
            this.onPopup = cbhash.onPopup;
        }
    }
    
    if (cfg) {
        if (cfg.maxView) {
            this.maxView = cfg.maxView;
        }
        if (cfg.lineHeight) {
            this.lineHeight = cfg.lineHeight;
        }
        if (cfg.documentEnabled) {
            this.documentEnabled = cfg.documentEnabled;
        }
        if (cfg.popupEnabled) {
            this.popupEnabled = cfg.popupEnabled;
        }
        if (cfg.deleteEnabled) {
           this.deleteEnabled = cfg.deleteEnabled;
        }
    }
    
    this.init(filelist);
};

DA.file.InformationListController.prototype = {
    fileNode: null,
    
    fileData: null,
    
    fileNdata: null,
    
    onRemove: Prototype.emptyFunction,
    
    onPopup: Prototype.emptyFunction,
    
    maxView: 0,
    
    lineHeight: 0,
    
    totalSize: 0,
    
    documentEnabled: false,
    
    popupEnabled: false,
    
    deleteEnabled: true,
    
    init: function(filelist) {
        // style.display = "none" fixes an apperance-bug on IE
        // TODO: if this.fileNode is not an HTMLElement, this will throw an exception
        this.fileNode.style.display = "none";
        
        this.fileData  = {};
        this.fileNdata = {};
        this.addList(filelist);
    },
    
    add: function(f, noresize, perf) {
        var l  = {};
        var n  = {};
        var me = this;
        
        if (DA.util.isEmpty(f.aid)) {
            return;
        }

        // div 生成
        n.lineNode     = document.createElement('div');
        n.iconNode     = document.createElement('span');
        n.nameNode     = document.createElement('span');
        n.documentNode = document.createElement('span');
        n.popupNode    = document.createElement('span');
        n.deleteNode   = document.createElement('span');
            
        // class 指定
        n.lineNode.className     = 'da_fileInformationListLine da_fileInformationListLineAid_' + f.aid;
        n.iconNode.className     = 'da_fileInformationListIcon';
        n.nameNode.className     = 'da_fileInformationListName';
        n.documentNode.className = 'da_fileInformationListDocument';
        n.popupNode.className    = 'da_fileInformationListPopup';
        n.deleteNode.className   = 'da_fileInformationListDelete';
        
        // append
        n.lineNode.appendChild(n.iconNode);
        n.lineNode.appendChild(n.nameNode);
        n.lineNode.appendChild(n.deleteNode);
        this.fileData[f.aid]  = l;
        this.fileNdata[f.aid] = n;
        
        this.aid(f.aid);
        this.icon(f.aid, f.icon, f.alt);
        this.name(f.aid, f.name);
        this.title(f.aid, f.title);
        this.size(f.aid, f.size);
        this.link(f.aid, f.link, f.warn);
        this.document(f.aid, f.document);
        this.popup(f.aid);
        this['delete'](f.aid);
        this.linkStyle(f.aid);
        this.fileNode.appendChild(n.lineNode);
        
        // Make sure we are performing calculations with a parent whose
        // offsetHeight is not 0...
        // This is to prevent lineHeight from getting set to 0 (Bug in FF (not FF's fault))
        if (perf !== true) {
            this.fileNode.style.display = "block";
            this.lineHeight = this.height(f.aid);
        }
        
        if (!noresize) {
            this.resize();
            this.scroll();
        }
    },

    addList: function(filelist, perf) {
        var i;
        
        // for performance
        if (perf === true) {
            this.ugNode.style.display = 'none';
        }
        if (filelist) {
            for (i = 0; i < filelist.length; i ++) {
                this.add(filelist[i], true, perf);
            }
            this.resize();
            this.scroll();
        }
    },
    
    linkStyle: function(aid) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(l.link)) {
            YAHOO.util.Dom.removeClass(n.title1Node, 'da_fileInformationListLink');
            YAHOO.util.Dom.removeClass(n.nameNode, 'da_fileInformationListLink');
            YAHOO.util.Dom.removeClass(n.emailNode, 'da_fileInformationListLink');
            YAHOO.util.Dom.removeClass(n.title0Node, 'da_fileInformationListLink');
            YAHOO.util.Dom.addClass(n.title1Node, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.addClass(n.nameNode, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.addClass(n.emailNode, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.addClass(n.title0Node, 'da_fileInformationListNoLink');
        } else {
            YAHOO.util.Dom.removeClass(n.title1Node, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.removeClass(n.nameNode, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.removeClass(n.emailNode, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.removeClass(n.title0Node, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.addClass(n.title1Node, 'da_fileInformationListLink');
            YAHOO.util.Dom.addClass(n.nameNode, 'da_fileInformationListLink');
            YAHOO.util.Dom.addClass(n.emailNode, 'da_fileInformationListLink');
            YAHOO.util.Dom.addClass(n.title0Node, 'da_fileInformationListLink');
        }
    },
    
    list: function() {
        var aid;
        var list = [];
        
        for (aid in this.fileData) {
            if (aid.match(/^\d+$/) && aid > 0) {
                list.push($H(this.fileData[aid]));
            }
        }
        
        return list;
    },
    
    get: function(aid, key) {
        if (DA.util.isEmpty(key)) {
            return this.fileData[aid];
        } else {
            return this.fileData[aid][key];
        }
    },
    
    width: function(aid) {
        if (this.fileNdata[aid]) {
            return DA.dom.width(this.fileNdata[aid].lineNode);
        } else {
            return 0;
        }
    },
    
    height: function(aid) {
        if (this.fileNdata[aid]) {
            return DA.dom.height(this.fileNdata[aid].lineNode);
        } else {
            return 0;
        }
    },
    
    count: function() {
        var key, count = 0;
        
        for (key in this.fileData) {
            if (!DA.util.isFunction(this.fileData[key])) {
                count ++;
            }
        }
        
        return count;
    },
    
    total: function() {
        var count = this.count();
        
        if (count > 0) {
            if (DA.vars.system.max_send_size_visible === 'on' && DA.vars.system.max_send_size && DA.vars.system.max_send_size > 0) {
                if (this.totalSize >= DA.vars.system.max_send_size) {
                    return '&nbsp;<font color=red>(&nbsp;' + this.totalSize + '&nbsp;/&nbsp;' + DA.vars.system.max_send_size + '&nbsp;)</font>&nbsp;KB';
                } else {
                    return '&nbsp;(&nbsp;' + this.totalSize + '&nbsp;/&nbsp;' + DA.vars.system.max_send_size + '&nbsp;)&nbsp;KB';
                }
            } else {
                return '&nbsp;(&nbsp;' + this.totalSize + '&nbsp;)&nbsp;KB';
            }
        } else {
            return '';
        }
    },
    
    resize: function() {
        var count;
        var height=0;
        
        if (this.maxView > 0) {
            count = this.count();
            
            if (count > 0) {
            	if(this.fileNode.firstChild){
                    height=this.fileNode.firstChild.offsetHeight;
            	}
            	if(this.lineHeight>height){
                    height=this.lineHeight;
            	}
                if (count > this.maxView) {
                    YAHOO.util.Dom.addClass(this.fileNode, 'da_fileInformationListOverflowAuto');
                    DA.dom.sizeHeight(this.fileNode, height * this.maxView);
                } else {
                    YAHOO.util.Dom.removeClass(this.fileNode, 'da_fileInformationListOverflowAuto');
                    DA.dom.sizeHeight(this.fileNode, height * count);
                }
                this.fileNode.style.display = '';
            } else {
                this.fileNode.style.display = 'none';
            }
        }
    },
    
    dummy: function(aid) {
        var n    = this.fileNdata[aid];
        var html = n.iconNode.innerHTML + n.nameNode.innerHTML;
        
        return html;
    },
    
    aid: function(aid) {
        this.fileData[aid].aid = (DA.util.isEmpty(aid)) ? '' : aid;
    },
    
    icon: function(aid, icon, alt) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(icon)) {
            l.icon = '';
            l.alt  = '';
            n.iconNode.innerHTML = '';
            n.iconNode.style.display = 'none';
        } else {
            l.icon = icon;
            l.alt  = (DA.util.isEmpty(alt)) ? '' : alt;
            n.iconNode.innerHTML = DA.imageLoader.tag(icon, alt, {'class': 'da_fileInformationListIconImage'});
            n.iconNode.style.display = '';
        }
    },
    
    name: function(aid, name) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(name)) {
            l.name = '';
            n.nameNode.innerHTML = '';
            n.nameNode.style.display = 'none';
        } else {
            l.name = name;
            n.nameNode.innerHTML = DA.util.encode(DA.util.jsubstr4attach(name, 25));
            n.nameNode.style.display = '';
        }
    },
    
    title: function(aid, title) {
        var l = this.fileData[aid];
                
        if (DA.util.isEmpty(title)) {
            l.title = '';
        } else {
            l.title = title;
        }
    },
    
    size: function(aid, size) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(size)) {
            l.size = 0;
        } else {
            l.size = size;
            
            this.totalSize += l.size;
        }
    },
    
    link: function(aid, link, warn) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(link)) {
            l.link = '';
            n.nameNode.onclick = Prototype.emptyFunction;
        } else {
            l.link = link;
            if (DA.util.isEmpty(warn)) {
                l.warn = '';
                n.nameNode.onclick = function() {
                    eval(link);
                };
            } else {
                l.warn = warn;
                n.nameNode.onclick = function() {
                    DA.util.warn(warn);
                    eval(link);
                };
            }
        }
    },
    
    document: function(aid, document) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(document) || !this.documentEnabled) {
            l.document = '';
            n.documentNode.innerHTML = '';
            n.documentNode.onclick = Prototype.emptyFunction;
            n.documentNode.style.display = 'none';
        } else {
            l.document = document;
            n.documentNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_fc_docsave.gif', '', { 'class': 'da_fileInformationListDocument' });
            n.documentNode.onclick = function() {
                eval(document);
            };
            n.documentNode.style.display = '';
        }
    },
    
    popup: function(aid) {
        var l  = this.fileData[aid];
        var n  = this.fileNdata[aid];
        var me = this;
        
        if (String(aid).match(/^\d+$/) && this.popupEnabled) {
            n.popupNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/scroll_btn_down02.gif', '', { 'class': 'da_fileInformationListPopup' });
            n.popupNode.onclick = function(e) {
                me.onPopup(e, aid);
            };
            n.popupNode.style.display = '';
        } else {
            n.popupNode.style.display = 'none';
        }
    },
    
    'delete': function(aid) {
        var l  = this.fileData[aid];
        var n  = this.fileNdata[aid];
        var me = this;
        
        if (String(aid).match(/^\d+$/) && this.deleteEnabled) {
            n.deleteNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_close_s.gif', '', { 'class': 'da_fileInformationListDelete' });
            n.deleteNode.onclick = function(e) {
                me.remove(aid);
                me.onRemove(e, aid);
            };
            n.deleteNode.style.display = '';
        } else {
            n.deleteNode.style.display = 'none';
        }
    },
    
    remove: function(aid) {
        this.fileNdata[aid].lineNode.innerHTML = '';
        this.fileNdata[aid].lineNode.parentNode.removeChild(this.fileNdata[aid].lineNode);
        
        this.totalSize -= this.fileData[aid].size;
        
        delete this.fileData[aid];
        delete this.fileNdata[aid];
        
        this.resize();
    },
    
    clear: function() {
        this.fileNode.innerHTML = '';
        this.fileNode.style.display = 'none';
        this.fileData  = {};
        this.fileNdata = {};
    },
    
    scroll: function() {
        try {
            this.fileNode.scrollTop = this.fileNode.scrollHeight;
        } catch(e) {
        }
    }
};



