/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern Ext */

Ext.DAGrid = Ext.extend(Ext.Component, {
	gridName : '',
	gridTitle : '',
	requestUrl : '',
	params : '',
	width : 0,
	height : 0,
	pageSize : 20,
	columnModel : null,
	initComponent : function() {
		Ext.DAGrid.superclass.initComponent.call(this);
		this.create();
	},
	create : function() {

		var fieldNames = [this.columnModel.getColumnCount()];
		for (var i = 0; i < this.columnModel.getColumnCount(); i++) {
			fieldNames[i] = this.columnModel.getDataIndex(i);
		}

		var dataProxy = null;
		if (this.requestUrl.indexOf("http") === 0) {
			dataProxy = new Ext.data.ScriptTagProxy({
				url : this.requestUrl
			});
		} else {
			dataProxy = new Ext.data.HttpProxy({
				url : this.requestUrl
			});

		}
		// create the Data Store
		var store = new Ext.data.Store({

			proxy : dataProxy,

			// create reader that reads the Topic records
			reader : new Ext.data.JsonReader({
				root : 'rowData',
				totalProperty : 'totalCount',
				id : 'dataId',
				fields : fieldNames
			}),

			// turn on remote sorting
			remoteSort : true,

			baseParams : this.params
		});
		store.setDefaultSort('lastUpdateDate', 'desc');

		var autoHeightFlag = true;
		if (this.height > 0) {
			autoHeightFlag = false;
		}
		var grid = new Ext.grid.GridPanel({
			el : this.gridName,
			width : this.width,
			autoHeight : autoHeightFlag,
			height : this.height,
			title : this.gridTitle,
			store : store,
			stripeRows : true,
			cm : this.columnModel,
			loadMask : true,
			viewConfig : {
				forceFit : true,
				enableRowBody : true,
				showPreview : true,
				sortAscText : "昇順",
				sortDescText : "降順",
				columnsText : "コラム"
			},
			bbar : new Ext.PagingToolbar({
				pageSize : this.pageSize,
				store : store,
				displayInfo : true,
				displayMsg : '{2}件中 {0} - {1}件を表示しています。',
				emptyMsg : "表示可能なデータがありません。"
			})
		});

		// render it
		grid.render();

		// trigger the data store load
		store.load({
			params : {
				start : 0,
				limit : this.pageSize
			}
		});

	}
});
