/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern $ DA Element Prototype Ext Event BrowserDetect*/

if (!DA) {
    throw "ERROR: missing DA.js or DA-min.js";
}
if (!DA.ug) {
    DA.ug = {};
}

/**
 * TODO: comments, JSDOC
 * @constructor
 * @class AccountSelector
 * @param cfg {Object} Configuration options
 */
DA.ug.AccountSelector = Ext.extend(Ext.Component, {
    
    appType: 'common',
    
    onlyOne: false,
    
    userType: 1,
    
    groupType: 2,
    
    addrType: 0,
    
    pageSize: 0,
    
    readRow: 100,
    
    textSize: 60,
    
    denyAdd: false,
    
    denyRemove: false,
    
    selectorNode: null,
    
    selectorId: null,
    
    searchNode: null,
    
    searchId: null,
    
    searchTitle: '検索:',
    
    contentsNode: null,
    
    contentsId: null,
    
    listNode: null,
    
    listId: null,
    
    textNode: null,
    
    textId: null,
    
    displayNode: null,
    
    displayId: null,
    
    hiddenNode: null,
    
    hiddenId: null,

	queryDelay: null,
    
    imageData: {
        1: {
            src: DA.vars.imgRdir + "/ico_fc_user.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "一般ユーザ",
            align: "absmiddle"
        },
        3: {
            src: DA.vars.imgRdir + "/ico_fc_userfsh.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "ファイル共有限定ユーザ",
            align: "absmiddle"
        },
        4: {
            src: DA.vars.imgRdir + "/ico_fc_userx.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "ログイン不能ユーザ",
            align: "absmiddle"
        },
        5: {
            src: DA.vars.imgRdir + "/ico_fc_useradm.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "システム管理者",
            align: "absmiddle"
        },
        A: { 
			src: DA.vars.imgRdir + "/ico_fc_userx.gif", 
			width: "14", 
			height: "14", 
			border: "0", 
			alt: "その他参加者", 
			align: "absmiddle" 
		}, 
        G: {
            src: DA.vars.imgRdir + "/ico_fc_organization.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "組織",
            align: "absmiddle"
        },
        P: {
            src: DA.vars.imgRdir + "/ico_fc_project.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "プロジェクト",
            align: "absmiddle"
        },
        T: {
            src: DA.vars.imgRdir + "/ico_fc_executive.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "役職グループ",
            align: "absmiddle"
        },
        S1: {
            src: DA.vars.imgRdir + "/ico_fc_organization_rpl.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "廃止組織",
            align: "absmiddle"
        },
        S2: {
            src: DA.vars.imgRdir + "/ico_fc_work_rpl.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "廃止プロジェクト",
            align: "absmiddle"
        },
        S3: {
            src: DA.vars.imgRdir + "/ico_fc_executive_rpl.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "廃止役職グループ",
            align: "absmiddle"
        },
        ext: {
            src: DA.vars.imgRdir + "/aqbtn_arrowd.gif",
            width: "16",
            height: "16",
            border: "0",
            alt: "展開",
            align: "top"
        },
        del: {
            src: DA.vars.imgRdir + "/aqbtn_close_s.gif",
            width: "14",
            height: "14",
            border: "0",
            alt: "削除",
            align: "top"
        },
        log: {
            src: DA.vars.imgRdir + "/aqbtn_compellogout.gif",
            width: "55",
            height: "15",
            border: "0",
            alt: "ログアウト",
            align: "top"
        }
    },
    
    selector: Prototype.emptyFunction,
    
    initRecord: null,
    
    selectedRecord: null,
    
    initContents: null,
    
    initSearch: false,
    
    // Protected
    initComponent: function() {
        this.constructor.superclass.initComponent.call(this);

        this.selectorNode = $(this.selectorNode); 
        this.selectorId = this.selectorNode.id;
        
        this.searchId = this.selectorId + 'Search';
        this.contentsId = this.selectorId + 'Contents';
        this.listId = this.selectorId + 'List';
        this.textId = this.selectorId + 'Text';
        this.displayId = this.selectorId + 'Display';
        this.hiddenId = this.selectorId + 'Hidden';
        
        var me = this;
        var selectorBox = ['<table border=0 width=100% cellspacing=0 cellpadding=0>',
                           '<tr id="' + me.searchId + '">',
                           '  <td style="padding-left:2px;background-color:#9F9F9F;" nowrap>' + me.searchTitle + '</td>',
                           '  <td style="padding:2px;background-color:#9F9F9F;width:100%;">',
                           '    <input type="text" size="' + me.textSize + '" id="' + me.textId + '">',
                           '  </td>',
                           '  <td style="background-color:#9F9F9F;" align="right">',
                           '    <span id="' + me.hiddenId + '" style="margin-right:5px;cursor:pointer;"><img src="' + DA.vars.imgRdir + '/aqbtn_close2.gif" align=absmiddle></span>',
                           '  </td>',
                           '</tr>',
                           '<tr>',
                           '  <td style="width:100%;" colspan=2>',
                           '   <span id="' + me.contentsId + '"></span>',
                           '    <ul id="' + me.listId + '" class="da_accountSelectorList"></ul>',
                           '  </td>',
                           '  <td align="right">',
                           '    <span id="' + me.displayId + '" style="margin-right:5px;cursor:pointer;"><img src="' + DA.vars.imgRdir + '/aqbtn_search_s.gif" align=absmiddle></span>',
                           '  </td>',
                           '</tr>',
                           '</table>'].join('');
        me.selectorNode.innerHTML = selectorBox;
        
        me.searchNode = $(me.searchId);
        me.contentsNode = $(me.contentsId);
        me.listNode = $(me.listId);
        me.textNode = $(me.textId);
        me.displayNode = $(me.displayId);
        me.hiddenNode = $(me.hiddenId);
        
        me.selectedRecord = [];
        var i;
        for (i = 0; i < me.initRecord.length; i ++) {
            me.addItem({
                id: me.initRecord[i].id,
                data: {
                    type: me.initRecord[i].type,
                    name: me.initRecord[i].name,
					tel3: me.initRecord[i].tel3,
					login:me.initRecord[i].login,
					logout: me.initRecord[i].logout,
		     sum: me.initRecord[i].sum
                }
            });
        }
        
        if (me.initContents) {
            me.contentsNode.innerHTML = me.initContents;
            if (me.selectedRecord.length === 0) {
                me._showContents();
                me._hideList();
            }
        }
        
        var tmpl = ['<tpl for=".">',
                    '<div class="search-item" style="padding:3px;">',
                    '<tpl if="type === \'1\'">',
                    '<img src="' + me.imageData['1'].src + '" title="' + me.imageData['1'].alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'3\'">',
                    '<img src="' + me.imageData['3'].src + '" title="' + me.imageData['3'].alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'4\'">',
                    '<img src="' + me.imageData['4'].src + '" title="' + me.imageData['4'].alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'5\'">',
                    '<img src="' + me.imageData['5'].src + '" title="' + me.imageData['5'].alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
					'<tpl if="type === \'A\'">', 
                    '<img src="' + me.imageData.A.src + '" title="' + me.imageData.A.alt + '" class="ImgIcoUser" align="absmiddle"/>', 
                    '<span>{name:htmlEncode}</span>', 
                    '</tpl>',
                    '<tpl if="type === \'G\'">',
                    '<img src="' + me.imageData.G.src + '" title="' + me.imageData.G.alt + '" class="ImgIcoOrganization" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'P\'">',
                    '<img src="' + me.imageData.P.src + '" title="' + me.imageData.P.alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'T\'">',
                    '<img src="' + me.imageData.T.src + '" title="' + me.imageData.T.alt + '" class="ImgIcoExecutive" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'S1\'">',
                    '<img src="' + me.imageData.S1.src + '" title="' + me.imageData.S1.alt + '" class="ImgIcoOrganization" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'S2\'">',
                    '<img src="' + me.imageData.S2.src + '" title="' + me.imageData.S2.alt + '" class="ImgIcoUser" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '<tpl if="type === \'S3\'">',
                    '<img src="' + me.imageData.S3.src + '" title="' + me.imageData.S3.alt + '" class="ImgIcoExecutive" align="absmiddle"/>',
                    '<span>{name:htmlEncode}</span>',
                    '</tpl>',
                    '</div>',
                    '</tpl>'].join('');
        
        Ext.onReady(function(){
            me.selector = new Ext.ux.AccountSelector({
                requestURL: DA.vars.cgiRdir + '/ajx_api.cgi?func=inc_search&app_type=' + me.appType + '&user_type=' + me.userType + '&group_type=' + me.groupType + '&addr_type=' + me.addrType + '&read_row=' + me.readRow,
                seletorName: me.textId,
                userType: me.userType,
                groupType: me.groupType,
				addrType: me.addrType,
                pageSize: me.pageSize,
                queryDelay: me.queryDelay,
                listeners: {
                    specialkey: function(t,e) {
                        this.dqTask.cancel();
                        this.onTriggerClick();
                        // this.doQuery(this.getRawValue(), true);
                    },
                    expand: function() {
                        this.syncSize();
                    }
                },                
                tpl: new Ext.XTemplate(tmpl),
                afterSelectFuc: function(record, index) {
                    if (me.onlyOne) {
                        me.clearItem(1);
                    } else if (me._existsRecord(record.id)) {
                        me.removeItem(record.id, 1);
                    }
                    
                    me.addItem(record);
                    
                    this.setValue('');
                    this.collapse();
                }
            });
            
            me.displayNode.onclick = function() {
                me.toggleSearch(true);
            };
            me.hiddenNode.onclick = function() {
                me.toggleSearch(false);
            };
            
            me.selectorNode.onkeypress = function(event) {
                var keyCode = (BrowserDetect.browser === 'Explorer') ? window.event.keyCode : event.which;
                if (keyCode === Event.KEY_RETURN) {
                    return false;
                }
            };
            
            if (me.initSearch) {
                me.toggleSearch(true);
            }
            
            if (me.denyAdd) {
                me.searchNode.style.display = 'none';
                me.displayNode.style.display = 'none';                
            }            
        });
    },
    
    toggleSearch: function(searchForce) {
        if (this.searchNode !== null && this.displayNode !== null && this.denyAdd === false) {
            if (DA.util.isEmpty(searchForce)) {
                if (this.searchNode.style.display === 'none') {
                    this.searchNode.style.display = '';
                    this.displayNode.style.display = 'none';
                } else {
                    this.textNode.value = '';
                    this.searchNode.style.display = 'none';
                    this.displayNode.style.display = '';
                }
            } else {
                if (searchForce === true) {
                    this.searchNode.style.display = '';
                    this.displayNode.style.display = 'none';
                } else {
                    this.textNode.value = '';
                    this.searchNode.style.display = 'none';
                    this.displayNode.style.display = '';                    
                }
            }
        }
    },
    
    selectorStatus: function() {
        if (this.searchNode !== null && this.displayNode !== null) {
            if (this.searchNode.style.display === 'none') {
                return 0;
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    },
    
    addItemCustom: null,
    
    removeItemCustom: null,
    
    extractItemCustom: null,
    
    logoutItemCustom: null,
    
    clearItemCustom: null,
    
    addItem: function(record) {
        var me = this;
        var targetAccountList = me.listNode;
        var key;
        var accountLi, iconImg, nameLink, extLink, extIconImg, delLink, delIconImg, logLink, logIconImg;
		
        if (targetAccountList !== null) {
            accountLi = document.createElement('li');
            accountLi.setAttribute("id", me._getId(record.id));
            
            iconImg = document.createElement('img');
            for (key in me.imageData[record.data.type]) {
                iconImg.setAttribute(key, me.imageData[record.data.type][key]);
            }
            
            accountLi.appendChild(iconImg);
                        
            nameLink = document.createElement('a');
            nameLink.setAttribute("href", "#");
	
            if (String(record.data.type).match(/^[1-5]/)) {
                nameLink.onclick = function() {
                    me.openUserInfo(record.id, '', record.data.type);
                };
            }else if (record.data.type === 'A') { 
				nameLink.onclick = function() { 
					me.openAddrInfo(record.id, ''); 
				}; 
            } else {
                nameLink.onclick = function() {
                    me.openGroupInfo(record.id, '');
                };
            }
            
            nameLink.appendChild(document.createTextNode(record.data.name));
            
            accountLi.appendChild(nameLink);

			if (record.data.tel3){
				accountLi.appendChild(document.createTextNode(record.data.tel3));
			}
			if (record.data.login){
				accountLi.appendChild(document.createTextNode(record.data.login));
				if (record.data.logout) {
					logLink = document.createElement('a');
					 logLink.setAttribute("href", "#");
					logLink.onclick = function() {
						me.logoutItem(record.id);
					};
					
					logIconImg = document.createElement('img');
					for (key in me.imageData.log) {
						logIconImg.setAttribute(key, me.imageData.log[key]);
					}
					
					logLink.appendChild(logIconImg);
					accountLi.appendChild(logLink);
				}
			}
            if (me.extractItemCustom && String(record.data.type).match(/^[GPTS]/)) {
                extLink = document.createElement('a');
                extLink.setAttribute("href", "#");
                extLink.onclick = function() {
                    me.extractItem(record.id);
                };                
                
                extIconImg = document.createElement('img');
                for (key in me.imageData.ext) {
                    extIconImg.setAttribute(key, me.imageData.ext[key]);
                }
                
                extLink.appendChild(extIconImg);
                accountLi.appendChild(extLink);
            }
            if (me.denyRemove === false) {
                delLink = document.createElement('a');
                delLink.setAttribute("href", "#");
                delLink.onclick = function() {
                    me.removeItem(record.id);
                };
                
                delIconImg = document.createElement('img');
                for (key in me.imageData.del) {
                    delIconImg.setAttribute(key, me.imageData.del[key]);
                }
                
                delLink.appendChild(delIconImg);
                accountLi.appendChild(delLink);
            }
            
            me._hideContents();
            me._showList();
            targetAccountList.appendChild(accountLi);
            
            me._addRecord(record.id, record.data);
            
            if (me.addItemCustom) {
                me.addItemCustom(record);
            }
            
            return true;
        } else {
            return false;
        }
    },
    
    removeItem: function(id, opt) {
        var node = $(this._getId(id));
        if (node !== null) {
            this._removeRecord(id);
            node.innerHTML = "";
            node.parentNode.removeChild(node);
            if (this.selectedRecord.length === 0) {
                this._showContents();
                this._hideList();
            }
            
            if (this.removeItemCustom) {
                this.removeItemCustom(id, opt);
            }
        }
    },
    
    extractItem: function(id) {
        if (this.extractItemCustom) {
            this.extractItemCustom(id);
        }
    },
    
    logoutItem: function(id) {
        if (this.logoutItemCustom) {
            this.logoutItemCustom(id);
        }
    },
    
    clearItem: function(opt) {
        this.selectedRecord = [];
        this.listNode.innerHTML = "";
        this._showContents();
        this._hideList();

        if (this.clearItemCustom) {
            this.clearItemCustom(opt);
        }
    },
    
    recordList: function(s, items) {
        var i, r, a, data = '';
        if (DA.util.isEmpty(s)) {
            s = "\n";
        }
        if (!items) {
            items = ['id', 'type', 'sum', 'name'];
        }
        for (i = 0; i < this.selectedRecord.length; i ++) {
            r = this.selectedRecord[i];
            a = [];
            items.each(function(k) {
                a.push(r[k]);
            });
            data += a.join(':') + s;
        }
        return data;
    },
    
   /**
    * TODO: comments, DA.ug.openUserInfo
    * @static
    * @method openUserInfo
    */
    openUserInfo: function(mid, type, noname) {
        if (DA.util.isEmpty(type)) {
            type = 'addr';
        }
        
        var cgi = '/info_card.cgi?type=' + type + '&id=' + mid;
        var winname = 'Info' + mid;
        if (!noname || this._isOldBrowser()) {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, winname, 'width=480,height=600,resizable=yes,scrollbars=yes');
        } else {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, '', 'width=480,height=600,resizable=yes,scrollbars=yes');
        }
    },
    
   /**
    * TODO: comments, DA.ug.openGroupInfo
    * @static
    * @method openGroupInfo
    */
    openGroupInfo: function(gid, noname) {
        var cgi = '/info_card.cgi?type=group&id=' + gid;
        var winname = 'gInfo' + gid;
        
        if (!noname || this._isOldBrowser()) {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, winname,'width=500,height=480,resizable=yes,scrollbars=yes');
        } else {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, '', 'width=500,height=480,resizable=yes,scrollbars=yes');
        }
    },    
    
	openAddrInfo: function(aid, noname) { 
		var cgi = '/og_card_addr.cgi?id=' + aid; 
		var Ids = aid.split('-'); 
		var winname = 'aInfo' + Ids[0];  
		if (!noname || this._isOldBrowser()) { 
			DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, winname,'width=450,height=600,resizable=1,scrollbars=1'); 
		} else { 
			DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, '', 'width=450,height=600,resizable=1,scrollbars=1'); 
		} 
	},
    
    _getId: function(id) {
        return this.selectorId + "_Id_" + id;
    },
    
    _isOldBrowser: function() {
        var ua  = navigator.userAgent;
        if (ua.indexOf('MSIE') !== -1) {
            return true;
        } else {
            if (ua.indexOf('Mozilla/4') !== -1 ) {
                return false;
            } else {
                return true;
            }
        }
    },
    
    _existsRecord: function(id) {
        var i;
        for (i = 0; i < this.selectedRecord.length; i ++) {
            if (this.selectedRecord[i].id === id) {
                return true;
            }
        }
        return false;
    },
    
    _addRecord: function(id, data) {
        var hash = {};
        
        Object.extend(hash, data);
        hash.id = id;
        
        this.selectedRecord.push(hash);
    },
    
    _removeRecord: function(id) {
        var array = [];
        var i;
        for (i = 0; i < this.selectedRecord.length; i ++) {
            if (this.selectedRecord[i].id !== id) {
                array.push(this.selectedRecord[i]);
            }
        }
        this.selectedRecord = array;
    },
    
    _showContents: function() {
        if (this.contentsNode.style.display === "none") {
            this.contentsNode.style.display = "";
        }
    },
    
    _hideContents: function() {
        if (this.contentsNode.style.display !== "none") {
            this.contentsNode.style.display = "none";
        }
    },
    _hideList: function() {
        if (this.listNode.style.display !== "none") {
            this.listNode.style.display = "none";
        }
    },
    _showList: function() {
        if (this.listNode.style.display === "none") {
            this.listNode.style.display = "";
        }
    }
});

