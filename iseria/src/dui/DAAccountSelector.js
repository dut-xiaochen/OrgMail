/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern Ext */

Ext.ux.AccountSelector = Ext.extend(Ext.form.ComboBox, {
    minChars: 1,
    shadow: 'drop',
    displayField: 'name',
    typeAhead: false,
    loadingText: 'Searching...',
    pageSize: 0,
    hideTrigger: true,
    itemSelector: 'div.search-item',
    seletorName: '',
    userType: 1,
    requestURL: '',
    tpl: new Ext.XTemplate('<tpl for=".">', '<div class="search-item" style="padding:3px;">', '<tpl if="type === 1">', '<h3><img src="images/ico_fc_user.gif" title="一般ユーザ" class="ImgIcoUser" align="absmiddle"/>', '<span>{name}</span> （{primaryGroup}）</h3>', '</tpl>', '<tpl if="type === 2">', '<h3><img src="images/ico_fc_organization.gif" title="組織" class="ImgIcoOrganization" align="absmiddle"!/>', '<span>{name}</span></h3>', '</tpl>', '<tpl if="type === 3">', '<h3><img src="images/ico_fc_project.gif" title="プロジェクト" class="ImgIcoUser" align="absmiddle"/ >', '<span>{name}</span> </h3>', '</tpl>', '<tpl if="type === 4">', '<h3><img src="images/ico_fc_executive.gif" title="役職グループ"　class="ImgIcoExecutive" align="absmiddle"/>"', '<span>{name}</span></h3>', '</tpl>', '</div>', '</tpl>'),
    
    afterSelectFuc: function(record, index){ // override default onSelect
        return false;
        
    },
    initComponent: function(){
        Ext.ux.AccountSelector.superclass.initComponent.call(this);
        var accountInfo = Ext.data.Record.create([{
                name: 'name',
                mapping: 'name'
            }, {
                name: 'email',
                mapping: 'email'
            }, {
                name: 'primaryGroup',
                mapping: 'primaryGroup'
            }, {
                name: 'type',
                mapping: 'type'
            },{
				name: 'tel3',
				mapping: 'tel3'
			},{
                name: 'login',
                mapping: 'login'
            },{
                name: 'logout',
                mapping: 'logout'
            },{
                                name: 'sum',
                                mapping: 'sum'
                        }]);
        
        var dataProxy = null;
        dataProxy = new Ext.data.HttpProxy({
            url : this.requestURL
        });
        
        var accountData = new Ext.data.Store({
            proxy: dataProxy,
            reader: new Ext.data.JsonReader({
                totalProperty: "results",
                root: "rows",
                id: "id"
            }, accountInfo)
        });
        
        this.store=accountData;
        this.applyTo=this.seletorName;
        this.onSelect= this.afterSelectFuc;
    }   
});

