/* $Id: info.js 2515 2014-11-12 01:46:31Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/account/info.js $ */
/*jslint evil: true */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern YAHOO */ 
/*extern Prototype $ $H */
/*extern DA */

/**
 * TODO: comments, explanation
 * @class ug
 * @static
 */
DA.ug = {
   
   /**
    * TODO: comments
    * @static
    * @method list2String
    */
   list2String: function(uglist, cols, max) {
        var i, l, u, e;
        var string = '';
        
        if (DA.util.isEmpty(cols)) {
            cols = 3;
        }
        
        if (uglist) {
            for(i = 0; i < uglist.length; i ++) {
                l = '';
                e = '';
                u = uglist[i];
                
                if (DA.util.isEmpty(u.name)) {
                    if (DA.util.isEmpty(u.email)) {
                        continue;
                    } else {
                        l = DA.util.encode(u.email);
                    }
                } else {
                    if (DA.util.isEmpty(u.title)) {
                        l = DA.util.encode(u.name);
                    } else {
                        if (u.title_pos === 1) {
                            l = DA.util.encode(u.title + u.name);
                        } else {
                            l = DA.util.encode(u.name + u.title);
                        }
                    }
                    if (!DA.util.isEmpty(u.email)) {
                        l += '&nbsp;' + DA.util.encode('<' + u.email + '>');
                    }
                }
                
                if (u.external === 1) {
                    e = ' da_ugInfromationListExternal';
                }

                if (!DA.util.isEmpty(u.link)) {
                    l = '<span onclick="' + u.link + '" class="da_ugInformationListLink' + e + '">' + l + '</span>';
                } else {
                    l = '<span class="da_ugInformationListNoLink' + e + '">' + l + '</span>';
                }

                if (!DA.util.isEmpty(u.icon)) {
                    l = DA.imageLoader.tag(u.icon, u.alt, { align: 'absmiddle' }) + l;
                }
                
                if (!DA.util.isEmpty(u.regist)) {
                    l += '<span onclick="' + u.regist + '" class="da_ugInformationListLink">' +
                         DA.imageLoader.tag(DA.vars.imgRdir + '/ico_adradd.gif', '', { align: 'absmiddle' }) +
                         '</span>';
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
    
   /**
    * TODO: comments
    * @static
    * @method openAddrInfo
    */
    openAddrInfo: function(id, noname) {
        var Ids = id.split('-');
        var winname = 'aInfo' + Ids[0];
        
        if (!noname) {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + '/og_card_addr.cgi?id=' + id, winname, 'width=450,height=600,resizable=yes,scrollbars=yes');
        } else {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + '/og_card_addr.cgi?id=' + id, '', 'width=450,height=600,resizable=yes,scrollbars=yes');
        }
    },
    
   /**
    * TODO: comments
    * @static
    * @method openUserInfo
    */
    openUserInfo: function(mid, type, noname) {
        if (DA.util.isEmpty(type)) {
            type = 'addr';
        }
        
        var cgi = '/info_card.cgi?type=' + type + '&id=' + mid;
        var winname = 'Info' + mid;
        if (!noname) {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, winname, 'width=480,height=600,resizable=yes,scrollbars=yes');
        } else {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, '', 'width=480,height=600,resizable=yes,scrollbars=yes');
        }
    },
    
   /**
    * TODO: comments
    * @static
    * @method openGroupInfo
    */
    openGroupInfo: function(gid, noname) {
        var cgi = '/info_card.cgi?type=group&id=' + gid;
        var winname = 'gInfo' + gid;
        
        if (!noname) {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, winname,'width=500,height=480,resizable=yes,scrollbars=yes');
        } else {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, '', 'width=500,height=480,resizable=yes,scrollbars=yes');
        }
    },
    
   /**
    * TODO: comments
    * @static
    * @method openMLInfo
    */
    openMLInfo: function(mlid, noname) {
        var Proc = 'ml_card.cgi%3fl=' + mlid;
        var Img  = 'pop_title_mlinfo.gif';
        DA.windowController.isePopup(Proc, Img, 500, 500, '', 1);
    },
    
   /**
    * TODO: comments
    * @static
    * @method openBulkInfo
    */
    openBulkInfo: function(id, noname) {
        var Proc = 'address_card.cgi%3fid=' + id;
        var Img  = 'pop_title_mladinfo.gif';
        DA.windowController.isePopup(Proc, Img, 650, 600, '', 1);
    },
    
   /**
    * TODO: comments
    * @static
    * @method openAddrRegist
    */
    openAddrRegist: function(NAME, EMAIL) {
        var Proc = 'ma_ajx_addr_regist.cgi%3fname=' +
                   encodeURIComponent(encodeURIComponent(NAME)) +
                   '%20email=' +
                   encodeURIComponent(encodeURIComponent(EMAIL));
        var Img  = 'pop_title_regaddress.gif';
        if (DA.vars.custom.threePane.setAddressInsertProc) {
            eval(DA.vars.custom.threePane.setAddressInsertProc);
        }
        DA.windowController.isePopup(Proc, Img, 600, 400, '', 1);
    }
};

/**
 * TODO: comments, JSDOC
 * @constructor
 * @class InformationListController
 * @param node {HTMLElement} a DIV element which is container node for this widget.
 * @para  uglist // TODO
 * @param cbhash // TODO
 * @param cfg    // TODO
 */
DA.ug.InformationListController = function(node, uglist, cbhash, cfg) {
    this.ugNode = node;
    
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
        if (cfg.registEnabled) {
            this.registEnabled = cfg.registEnabled;
        }
        if (cfg.popupEnabled) {
            this.popupEnabled = cfg.popupEnabled;
        }
        if (cfg.deleteEnabled) {
            this.deleteEnabled = cfg.deleteEnabled;
        }
    }
   
    this.init(uglist);
};

// FIXME: comments, JSDOC really needed here
DA.ug.InformationListController.prototype = {

    ugNode: null,
    
    ugData: null,
    
    ugNdata: null,
    
    sno: 1,
    
    onRemove: Prototype.emptyFunction,
    
    onPopup: Prototype.emptyFunction,
    
    maxView: 0,
    
    lineHeight: 0,
    
    registEnabled: false,
    
    popupEnabled: true,
    
    deleteEnabled: true,

    beforeInsertScrollTop: 0,
    
    init: function(uglist) {
        // style.display = "none" fixes an apperance-bug on IE
        // TODO: if this.ugNode is not an HTMLElement, this will throw an exception
        this.ugNode.style.display = "none";

        // FIXME: ugData is a hash or an array?
        this.ugData  = {};
        this.ugNdata = {};
        this.addList(uglist);
    },
    
    add: function(u, noresize, perf) {
        var l   = {};
        var n   = {};
        var me  = this;

        // TODO: confirm this behavior
        // id not exists pattern.
        if (!u) {
            return;
        }
        
        if (DA.util.isEmpty(u.name) && DA.util.isEmpty(u.email)) {
            return;
        }
        
        var sno = this.sno++;
        
        // div 生成
        n.lineNode   = document.createElement('div');
        n.iconNode   = document.createElement('span');
        n.nameNode   = document.createElement('span');
        n.emailNode  = document.createElement('span');
        n.title0Node = document.createElement('span');
        n.title1Node = document.createElement('span');
        n.popupNode  = document.createElement('span');
        n.registNode = document.createElement('span');
        n.deleteNode = document.createElement('span');
        
        // class 指定
        n.lineNode.id          = 'da_ugInformationList' + me.ugNode.id.split("Item")[1] + 'LineId_' + sno;
        n.lineNode.className   = 'da_ugInformationListLine da_ugInformationListLineSno_' + sno + ' da_ugInformationListDragDrop_' + sno;
        n.iconNode.className   = 'da_ugInformationListIcon ' + 'da_ugInformationListDragDrop_' + sno;
        n.nameNode.className   = 'da_ugInformationListName ' + 'da_ugInformationListDragDrop_' + sno;
        n.emailNode.className  = 'da_ugInformationListEmail ' + 'da_ugInformationListDragDrop_' + sno;
        n.title0Node.className = 'da_ugInformationListTitle';
        n.title1Node.className = 'da_ugInformationListTitle';
        n.popupNode.className  = 'da_ugInformationListPopup';
        n.registNode.className = 'da_ugInformationListRegist';
        n.deleteNode.className = 'da_ugInformationListDelete';
        
        // append
        n.lineNode.appendChild(n.iconNode);
        n.lineNode.appendChild(n.title1Node);
        n.lineNode.appendChild(n.nameNode);
        n.lineNode.appendChild(n.title0Node);
        n.lineNode.appendChild(n.emailNode);
        n.lineNode.appendChild(n.popupNode);
        n.lineNode.appendChild(n.deleteNode);
        this.ugData[sno]  = l;
        this.ugNdata[sno] = n;
        
        this.id(sno, u.id);
        this.type(sno, u.type);
        this.lang(sno, u.lang);
        this.icon(sno, u.icon, u.alt);
        this.name(sno, u.name);
        this.title(sno, u.title, u.title_pos);
        this.email(sno, u.email || u.keitai_mail || u.pmail1 || u.pmail2);
        this.link(sno, u.link);
        this.regist(sno, u.regist);
        this.popup(sno);
        this['delete'](sno);
        this.linkStyle(sno);
        this.ugNode.appendChild(n.lineNode);
        eval("DA.mailer.MessageEditor.prototype.dropAddress"+sno+"To = setInterval(function(){return new YAHOO.util.DDTarget(\"da_ugInformationList"+me.ugNode.id.split("Item")[1]+"LineId_"+sno+"\",\"editorAddress\")},1000)");

        // Make sure we are performing calculations with a parent whose
        // offsetHeight is not 0...
        // This is to prevent lineHeight from getting set to 0 (Bug in FF (not FF's fault))
        if (perf !== true) {
            this.ugNode.style.display = "block";
            this.lineHeight = this.height(sno);
            if(this.lineHeight > DA.dom.height("da_messageEditorItemToText") && DA.dom.height("da_messageEditorItemToText") >= 19){
                this.lineHeight = DA.dom.height("da_messageEditorItemToText") - 2;
            }
        }
        
        if (!noresize) {
            this.resize();
            this.scroll();
        }
    },

    insertToTop: function(u, deleteSno) {
        var l   = {};
        var n   = {};
        var me  = this;

        // TODO: confirm this behavior
        // id not exists pattern.
        if (!u) {
            return;
        }
        
        if (DA.util.isEmpty(u.name) && DA.util.isEmpty(u.email)) {
            return;
        }
        
        var sno = this.sno++;
        if ( deleteSno !== 0 ) {
            delete this.ugData[deleteSno];
        }
        var ugDataBefore = this.ugData;
        this.ugNode.innerHTML = '';
        this.ugNode.style.display = 'none';
        this.ugData  = {};
        this.ugNdata = {};
        // div 生成
        n.lineNode   = document.createElement('div');
        n.iconNode   = document.createElement('span');
        n.nameNode   = document.createElement('span');
        n.emailNode  = document.createElement('span');
        n.title0Node = document.createElement('span');
        n.title1Node = document.createElement('span');
        n.popupNode  = document.createElement('span');
        n.registNode = document.createElement('span');
        n.deleteNode = document.createElement('span');
        
        // class 指定
        n.lineNode.id          = 'da_ugInformationList' + me.ugNode.id.split("Item")[1] + 'LineId_' + sno;
        n.lineNode.className   = 'da_ugInformationListLine da_ugInformationListLineSno_' + sno + ' da_ugInformationListDragDrop_' + sno;
        n.iconNode.className   = 'da_ugInformationListIcon ' + 'da_ugInformationListDragDrop_' + sno;
        n.nameNode.className   = 'da_ugInformationListName ' + 'da_ugInformationListDragDrop_' + sno;
        n.emailNode.className  = 'da_ugInformationListEmail ' + 'da_ugInformationListDragDrop_' + sno;
        n.title0Node.className = 'da_ugInformationListTitle';
        n.title1Node.className = 'da_ugInformationListTitle';
        n.popupNode.className  = 'da_ugInformationListPopup';
        n.registNode.className = 'da_ugInformationListRegist';
        n.deleteNode.className = 'da_ugInformationListDelete';
        
        // append
        n.lineNode.appendChild(n.iconNode);
        n.lineNode.appendChild(n.title1Node);
        n.lineNode.appendChild(n.nameNode);
        n.lineNode.appendChild(n.title0Node);
        n.lineNode.appendChild(n.emailNode);
        n.lineNode.appendChild(n.popupNode);
        n.lineNode.appendChild(n.deleteNode);
        this.ugData[sno]  = l;
        this.ugNdata[sno] = n;
        
        this.id(sno, u.id);
        this.type(sno, u.type);
        this.lang(sno, u.lang);
        this.icon(sno, u.icon, u.alt);
        this.name(sno, u.name);
        this.title(sno, u.title, u.title_pos);
        this.email(sno, u.email || u.keitai_mail || u.pmail1 || u.pmail2);
        this.link(sno, u.link);
        this.regist(sno, u.regist);
        this.popup(sno);
        this['delete'](sno);
        this.linkStyle(sno);
        this.ugNode.appendChild(n.lineNode);
        eval("DA.mailer.MessageEditor.prototype.dropAddress"+sno+"To = setInterval(function(){new YAHOO.util.DDTarget(\"da_ugInformationList"+me.ugNode.id.split("Item")[1]+"LineId_"+sno+"\",\"editorAddress\")},1000)");

        // Make sure we are performing calculations with a parent whose
        // offsetHeight is not 0...
        // This is to prevent lineHeight from getting set to 0 (Bug in FF (not FF's fault))
        var addList = [];
        var listCounter = 0;
        for (var i in ugDataBefore) {
            if (ugDataBefore[i]) {
                addList[listCounter++] = ugDataBefore[i];
            }
        }
        this.ugNode.style.display = "block";
        this.lineHeight = this.height(sno);
        if(this.lineHeight > DA.dom.height("da_messageEditorItemToText") && DA.dom.height("da_messageEditorItemToText") >= 19){
            this.lineHeight = DA.dom.height("da_messageEditorItemToText") - 2;
        }
        if (!addList || !addList.length) { return; }
        var uglistLength = addList.length; // Loop optimizations
        
        for (i = 0; i < uglistLength; ++i) {
            this.add(addList[i]);
        }
        this.resize();
        this.scroll();
    },

    insertAfterNode: function(u, afterSno, insertAfterNodeId, isInsideSameArea) {
        var l   = {};
        var n   = {};
        var me  = this;

        // TODO: confirm this behavior
        // id not exists pattern.
        if (!u) {
            return;
        }
        if (DA.util.isEmpty(u.name) && DA.util.isEmpty(u.email)) {
            return;
        }
        if (isInsideSameArea === "true") {
            delete this.ugData[afterSno];
            delete this.ugNdata[afterSno];
        }
        var sno = this.sno++;
        var ugDataBefore = this.ugData;
        var ugNdataBefore = this.ugNdata;
        this.ugNode.innerHTML = '';
        this.ugNode.style.display = 'none';
        this.ugData  = {};
        this.ugNdata = {};
        var addList = [];
        var listCounter = 0;
        var nodeCounter = 0;
        var nodeCounterResult = 0;
        for (var i in ugDataBefore) {
            if (i.match(/^\d+$/) && i > 0) {
                if (ugDataBefore[i]) {
                    if (ugNdataBefore[i].lineNode.id !== insertAfterNodeId) {
                        addList[listCounter++] = ugDataBefore[i];
                        nodeCounter++;
                    } else {
                        addList[listCounter++] = ugDataBefore[i];
                        addList[listCounter++] = u;
                        nodeCounterResult = nodeCounter;
                    }
                }
            }
        }
        if ( nodeCounterResult > 1 ) {
            this.beforeInsertScrollTop = (nodeCounterResult - 1) * 20;
        } else {
            this.beforeInsertScrollTop = 0;
        }
        this.ugNode.style.display = "block";
        this.lineHeight = this.height(sno);
        if(this.lineHeight > DA.dom.height("da_messageEditorItemToText") && DA.dom.height("da_messageEditorItemToText") >= 19){
            this.lineHeight = DA.dom.height("da_messageEditorItemToText") - 2;
        }
        if (!addList || !addList.length) { return; }
        var uglistLength = addList.length; // Loop optimizations
        
        for (i = 0; i < uglistLength; ++i) {
            this.add(addList[i], true);
        }
        this.resize();
        this.scrollTo(this.beforeInsertScrollTop);
    },

    showAllAddress: function() {
        var me = this;
        var length = this.list().length;
        me.ugNode.style.height = (length * 18 +  10)+ "px";
    },
   
    /**
     * Convenience method that allows list addition.
     * @method addList
     * @param uglist {Array} array of user/group info objects
     */
    addList: function(uglist, perf) {
        if (!uglist || !uglist.length) { return; }
        var uglistLength = uglist.length; // Loop optimizations
        var i;
        
        // for performance
        if (perf === true) {
            this.ugNode.style.display = 'none';
        }
        for (i = 0; i < uglistLength; ++i) {
            this.add(uglist[i], true, perf);
        }
        this.resize();
        this.scroll();
    },
    
    linkStyle: function(sno) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(l.link)) {
            YAHOO.util.Dom.removeClass( [n.title1Node, n.nameNode, n.emailNode, n.title0Node], 
                    'da_ugInformationListLink');
            YAHOO.util.Dom.addClass( [n.title1Node, n.nameNode, n.emailNode, n.title0Node], 
                    'da_ugInformationListNoLink');
        } else {
            YAHOO.util.Dom.removeClass( [n.title1Node, n.nameNode, n.emailNode, n.title0Node], 
                    'da_ugInformationListNoLink');
            YAHOO.util.Dom.addClass( [n.title1Node, n.nameNode, n.emailNode, n.title0Node], 
                    'da_ugInformationListLink');
        }
    },
    
    list: function() {
        var sno;
        var list = [];
        
        for (sno in this.ugData) {
            if (sno.match(/^\d+$/) && sno > 0) {
                list.push($H(this.ugData[sno]));
            }
        }
        
        return list;
    },
    
    get: function(sno, key) {
        if (DA.util.isEmpty(key)) {
            return this.ugData[sno];
        } else {
            return this.ugData[sno][key];
        }
    },

    getNdata: function(sno) {
        return this.ugNdata[sno];
    }, 
    
    width: function(sno) {
        if (this.ugNdata[sno]) {
            return DA.dom.width(this.ugNdata[sno].lineNode);
        } else {
            return 0;
        }
    },
    
    height: function(sno) {
        if (this.ugNdata[sno]) {
            return DA.dom.height(this.ugNdata[sno].lineNode);
        } else {
            return 0;
        }
    },
    
    count: function() {
        var key, count = 0;
        
        for (key in this.ugData) {
            if (!DA.util.isFunction(this.ugData[key])) {
                count ++;
            }
        }
        
        return count;
    },
    
    resize: function() {
        var count;
        var height=0; 
       
        if (this.maxView > 0) {
            count = this.count();
            
            if (count > 0) {
                if(this.ugNode.firstChild){ 
                    height=this.ugNode.firstChild.offsetHeight; 
                } 
                if(this.lineHeight>height){ 
                    height=this.lineHeight; 
                } 
                if (count > this.maxView) {
                    YAHOO.util.Dom.addClass(this.ugNode, 'da_ugInformationListOverflowAuto');
                    DA.dom.sizeHeight(this.ugNode, height * this.maxView);
                } else {
                    YAHOO.util.Dom.removeClass(this.ugNode, 'da_ugInformationListOverflowAuto');
                    DA.dom.sizeHeight(this.ugNode, height * count);
                }
                this.ugNode.style.display = '';
            } else {
                this.ugNode.style.display = 'none';
            }
        }
    },
    
    dummy: function(sno) {
        var n    = this.ugNdata[sno];
        var html = n.iconNode.innerHTML + n.title1Node.innerHTML + n.nameNode.innerHTML + n.emailNode.innerHTML + n.title0Node.innerHTML;
        
        return html;
    },
    
    id: function(sno, id) {
        this.ugData[sno].id = (DA.util.isEmpty(id)) ? '' : id;
    },
    
    type: function(sno, type) {
        this.ugData[sno].type = (DA.util.isEmpty(type)) ? '' : type;
    },
    
    lang: function(sno, lang) {
        this.ugData[sno].lang = (DA.util.isEmpty(lang)) ? 'ja' : lang;
    },
    
    icon: function(sno, icon, alt) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(icon)) {
            l.icon = '';
            l.alt  = '';
            n.iconNode.innerHTML = '';
            n.iconNode.style.display = 'none';
        } else {
            l.icon = icon;
            l.alt  = (DA.util.isEmpty(alt)) ? '' : alt;
            n.iconNode.innerHTML = DA.imageLoader.tag(icon, alt, {'class': 'da_ugInformationListIconImage'});
            n.iconNode.style.display = '';
        }
    },
    
    name: function(sno, name, refreshEmail) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(name)) {
            l.name = '';
            n.nameNode.innerHTML = '';
            n.nameNode.style.display = 'none';
        } else {
            l.name = name;
            n.nameNode.innerHTML = DA.util.encode(name);
            n.nameNode.style.display = '';
        }
        
        if (refreshEmail) {
            this.email(sno, l.email);
        }
    },
    
    email: function(sno, email) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(email)) {
            l.email = '';
            n.emailNode.innerHTML = '';
            n.emailNode.style.display = 'none';
        } else {
            l.email = email;
            if (DA.util.isEmpty(l.name) && DA.util.isEmpty(l.title)) {
                n.emailNode.innerHTML = DA.util.encode(email);
                n.emailNode.style.display = '';
            } else {
                n.emailNode.innerHTML = '&nbsp;' + DA.util.encode('<' + email + '>');
                n.emailNode.style.display = '';
            }
        }
    },
    
    title: function(sno, title, title_pos, refreshEmail) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(title)) {
            l.title = '';
            l.title_pos = 0;
            n.title0Node.innerHTML = '';
            n.title1Node.innerHTML = '';
            n.title0Node.style.display = 'none';
            n.title1Node.style.display = 'none';
        } else {
            l.title = title;
            l.title_pos = title_pos;
            if (title_pos === 1) {
                n.title0Node.innerHTML = '';
                n.title1Node.innerHTML = DA.util.encode(title);
                n.title0Node.style.display = 'none';
                n.title1Node.style.display = '';
            } else {
                n.title0Node.innerHTML = DA.util.encode(title);
                n.title1Node.innerHTML = '';
                n.title0Node.style.display = '';
                n.title1Node.style.display = 'none';
            }
        }
        
        if (refreshEmail) {
            this.email(sno, l.email);
        }
    },
    
    link: function(sno, link) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(link)) {
            l.link = '';
            n.nameNode.onclick   = Prototype.emptyFunction;
            n.emailNode.onclick  = Prototype.emptyFunction;
            n.title0Node.onclick = Prototype.emptyFunction;
            n.title1Node.onclick = Prototype.emptyFunction;
        } else {
            l.link = link;
            n.nameNode.onclick = function(e) {
                eval(link);
            };
            n.emailNode.onclick = function(e) {
                eval(link);
            };
            n.title0Node.onclick = function(e) {
                eval(link);
            };
            n.title1Node.onclick = function(e) {
                eval(link);
            };
        }
    },
    
    regist: function(sno, regist) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(regist) || !this.registEnabled) {
            l.regist = '';
            n.registNode.innerHTML = '';
            n.registNode.style.display = 'none';
        } else {
            l.regist = regist;
            n.registNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_adradd.gif', '', { 'class': 'da_ugInformationListRegist' });
            n.registNode.onclick = function() {
                eval(regist);
            };
            n.registNode.style.display = '';
        }
    },
    
    popup: function(sno) {
        var l  = this.ugData[sno];
        var n  = this.ugNdata[sno];
        var me = this;
        
        if (String(sno).match(/^\d+$/) && this.popupEnabled) {
            n.popupNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/scroll_btn_down02.gif', '', { 'class': 'da_ugInformationListPopup' });
            n.popupNode.onclick = function(e) {
                me.onPopup(DA.event.get(e), sno);
            };
            n.popupNode.style.display = '';
        } else {
            n.popupNode.style.display = 'none';
        }
    },
    
    'delete': function(sno) {
        var l  = this.ugData[sno];
        var n  = this.ugNdata[sno];
        var me = this;
        
        if (String(sno).match(/^\d+$/) && this.deleteEnabled) {
            n.deleteNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_close_s.gif', '', { 'class': 'da_ugInformationListDelete' });
            n.deleteNode.onclick = function(e) {
                me.remove(sno);
                me.onRemove(DA.event.get(e), sno);
            };
            n.deleteNode.style.display = '';
        } else {
            n.deleteNode.style.display = 'none';
        }
    },
    
    remove: function(sno) {
        if (!this.ugNdata[sno]) {
            return;
        }
        var lineNode = this.ugNdata[sno].lineNode;
        if (lineNode) {
            lineNode.innerHTML = '';
            lineNode.parentNode.removeChild(lineNode);
        }
        delete this.ugData[sno];
        delete this.ugNdata[sno];
        
        this.resize();
    },
    
    clear: function() {
        this.ugNode.innerHTML = '';
        this.ugNode.style.display = 'none';
        this.ugData  = {};
        this.ugNdata = {};
    },
    
    isAddr: function(sno) {
        return (this.get(sno, 'type') === DA.vars.ugType.addr) ? true: false;
    },
    
    isUser: function(sno) {
        return (this.get(sno, 'type') === DA.vars.ugType.user) ? true: false;
    },
    
    isGroup: function(sno) {
        return (this.get(sno, 'type') === DA.vars.ugType.group) ? true: false;
    },
    
    isBulk: function(sno) {
        return (this.get(sno, 'type') === DA.vars.ugType.bulk) ? true: false;
    },
    
    isML: function(sno) {
        return (this.get(sno, 'type') === DA.vars.ugType.ml) ? true: false;
    },
    
    groupExists: function() {
        var sno;
        for (sno in this.ugData) {
            if (sno.match(/^\d+$/) && this.isGroup(sno)) {
                return true;
            }
        }
        return false;
    },

	userExists:function(){
		var sno;
		for(sno in this.ugData){
			if(sno.match(/^\d+$/)&&this.isUser(sno)){
				return true;
			}
		}
		return false;
		// return true;
	},
	
    scroll: function() {
        try {
            this.ugNode.scrollTop = this.ugNode.scrollHeight;
        } catch(e) {
        }
    },

    scrollTo: function(height) {
        try{
            this.ugNode.scrollTop = height;
        } catch(e){
        }
    }
};

