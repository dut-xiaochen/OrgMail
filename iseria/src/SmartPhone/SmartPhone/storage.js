var DAsessionStorage = {
	key: function(key) {
		return DA.util.getMID() + "." + key;
	},
	r_key: function(key) {
		var reg = new RegExp("^" + DA.util.getMID() + '\\.');
		return key.replace(reg, "");
	},
	keys: function() {
		var keys = [];
		for (var i = 0; i < sessionStorage.length; i ++) {
			keys.push(this.r_key(sessionStorage.key(i)));
		}
		return(keys);
	},
	all: function() {
		var data = {};
		for (var i = 0; i < sessionStorage.length; i ++) {
			data[this.r_key(sessionStorage.key(i))] = sessionStorage[sessionStorage.key(i)];
		}
		return(data);
	},
	get: function(key) {
		key = this.key(key);
		return(sessionStorage.getItem(key));
	},
	add: function(key, value) {
		key = this.key(key);
		try {
			sessionStorage.setItem(key, value);
			return(true);
		} catch(e) {
			// e.name == 'QUOTA_EXCEEDED_ERR'
			return(false);
		}
	},
	remove: function(key) {
		key = this.key(key);
		sessionStorage.removeItem(key);
		return(true);
	},
	clear: function() {
		sessionStorage.clear();
		return(true);
	},
	object: function(key) {
		key = this.key(key);

		var str = this.get(key);
		if (str) {
			return(DA.util.string2Object(str));
		} else {
			return(undefined);
		}
	}
};


var DAJsStorage = {};
var DAStorageMethod = window.localStorage ? '' : 'js';
//DAStorageMethod ='js';
var DAlocalStorage = {
	key: function(key) {
		return DA.util.getMID() + "." + key;
	},
	r_key: function(key) {
		var reg = new RegExp("^" + DA.util.getMID() + '\\.');
		return key.replace(reg, "");
	},
	keys: function() {
		var keys = [];
		if( DAStorageMethod== 'js' ){
			for(var k in DAJsStorage){
				keys.push(this.r_key(k));
			}
		} else {
			for (var i = 0; i < localStorage.length; i ++) {
				keys.push(this.r_key(localStorage.key(i)));
			}
		}
		return(keys);
	},
	all: function() {
		var data = {};
		if( DAStorageMethod =='js'){
			for(var k in DAJsStorage){
				data[this.r_key(k)] = DAJsStorage[k];
			}
			
		} else {
			for (var i = 0; i < localStorage.length; i ++) {
				data[this.r_key(localStorage.key(i))] = localStorage[localStorage.key(i)];
			}
		}
		return(data);
	},
	get: function(key) {
		key = this.key(key);

		if ( DAStorageMethod =='js' ){
			return(DAJsStorage[key]);
		} else {
			return(localStorage.getItem(key));
		}
	},
	add: function(key, value) {
		key = this.key(key);

		if ( DAStorageMethod =='js' ){
			DAJsStorage[key] = value;
			return(true);
		} else {
			try {
				localStorage.setItem(key, value);
				return(true);
			} catch(e) {
				// e.name == 'QUOTA_EXCEEDED_ERR'
				return(false);
			}
		}
	},
	remove: function(key) {
		key = this.key(key);

		if ( DAStorageMethod =='js' ){
			delete DAJsStorage[key];
		} else {
			localStorage.removeItem(key);
		}
		return(true);
	},
	clear: function() {
		if ( DAStorageMethod =='js' ){
			DAJsStorage = new Object();
		} else {
			localStorage.clear();
		}
		return(true);
	},
	object: function(key) {
		key = this.key(key);

		var str = this.get(key);
		if (str) {
			return(DA.util.string2Object(str));
		} else {
			return(undefined);
		}
	}
};

DA.autoElementOpener = {
	
	init : function(group) {
		//DAsessionStorage.remove("DA_ISE_autoElementOpener_" + group);
		DAsessionStorage.add("DA_ISE_autoElementOpener_" + group,'');
	},
	
	set: function(group, id, flg) {
		var obj = $("#" + id);

		if (obj) {
			var db = DAsessionStorage.object("DA_ISE_autoElementOpener_" + group);

			if (!db) {
				db = {};
			}
			db[id] = flg;

			DAsessionStorage.add("DA_ISE_autoElementOpener_" + group, DA.util.object2String(db));
		}
	},
	
	toggle: function(group, id) {
		var obj = $("#" + id);

		if (obj) {
			var db = DAsessionStorage.object("DA_ISE_autoElementOpener_" + group);

			if (!db) {
				db = {};
			}
			
			if ( db[id] ){
				db[id] = false;  
			} else {
				db[id] = true;  
			}
			DAsessionStorage.add("DA_ISE_autoElementOpener_" + group, DA.util.object2String(db));
		}
	},

	refresh: function(group) {
		var db = DAsessionStorage.object("DA_ISE_autoElementOpener_" + group);

		if (db) {
			jQuery.each(db, function(key, val) {
				var obj = $("#" + key);
				if (obj) {
					if ( db[key] === true ){
						obj.show();
					}else{
						obj.hide();
					}
				}
			});
		}
	}
};

var toggleDisplay = function(id) {
	var obj = $("#" + id);

	if (obj) {
		if (obj.css("display") === "none") {
			obj.css("display", "");
		} else {
			obj.css("display", "none");
		}
	}
};

DA.favorite = {
	parseId: function(fid) {
		var a = fid.split(/\:/);
		var h = {
			group: a.shift(),
			id: a.join(":")
		};
		return h;
	},
	storageId: function(group) {
		return "DA_ISE_FAVORITE:" + group;
	},
	get: function(group) {
		return DA.util.string2Object(DAlocalStorage.get(this.storageId(group))) || [];
	},
	set: function(group, l) {
		DAlocalStorage.add(this.storageId(group), DA.util.object2String(l || []));
	},
	push: function(fid) {
		var h = this.parseId(fid);
		var a = this.get(h.group);
		a.push(h.id);

		var l = a.length;
		while (l > DA.sys.maxFavorite) {
			a.shift(); l --;
		}

		this.set(h.group, a);

		return true;
	},
	history: function(group, n) {
		var a = this.get(group).reverse();
		var l = a.length;
		var r = [];
		var h = {};
		for (var i = 0; i < l; i ++) {
			if (!r[a[i]]) {
				r[a[i]] = true;
				r.push(a[i]);
			}
		}
		if (DA.util.isEmpty(n) || !DA.util.isNumber(n)) {
			n = DA.sys.maxFavorite;
		}
		n = (n > r.length) ? r.length : n;
		return r.slice(0, n);
	},
	ranking: function(group, n) {
		var a = this.get(group).reverse();
		var l = a.length;
		var h = {};
		for (var i = 0; i < l; i ++) {
			if (!h[a[i]]) {
				h[a[i]] = {
					sort: i,
					cnt: 0
				};
			}
			h[a[i]]['cnt'] ++;
		}

		var keys = [];
		for (var k in h) {
			keys.push(k);
		}

		var keys2 = keys.sort(function(a, b) {
			if (h[a]['cnt'] == h[b]['cnt']) {
				return h[a]['sort'] > h[b]['sort'] ? 1 : -1
			} else if (h[a]['cnt'] > h[b]['cnt']) {
				return -1;
			} else {
				return 1;
			}
		});
		if (DA.util.isEmpty(n) || !DA.util.isNumber(n)) {
			n = DA.sys.maxFavorite;
		}
		n = (n > keys2.length) ? keys2.length : n;

		return keys2.slice(0, n);
	}
};

DAdb = {
	initialize: function() {
		if (window.openDatabase) {
			try {
				this.db = openDatabase("DAisdb", "1.0", "DA INSUITE(R)Enterprise Web Storage", DA.sys.maxDBSize);
			} catch (e) {
			}
		}
	},
	getTime: function() {
		var date = new Date();
		var time = parseInt(date.getTime() / 1000, 10);
		return(time);
	},
	select: function(table, params, success, error) {
		var mid  = parseInt(params.mid, 10);
		var func = params.func;
		if (this.db) {
			this.db.transaction(function(tx) {
				tx.executeSql("SELECT * FROM " + table + " WHERE MID=? AND FUNC=?", [mid, func], function(tx, rs) {
					var row = rs.rows.item(0);
					success(DA.util.string2Object(row.data));
				}, error);
			});
		}
	},
	update: function(table, params) {
		var mid  = parseInt(params.mid, 10);
		var func = params.func;
		var data = DA.util.object2String(params.data);
		var modify = this.getTime();

		if (this.db) {
			this.db.transaction(function(tx) {
				tx.executeSql("CREATE TABLE IF NOT EXISTS " + table + "(mid INTEGER PRIMARY KEY,func VARCHAR(16),modify INTEGER,data TEXT)", [], function(tx, rs) {
					tx.executeSql("DELETE FROM " + table + " WHERE MID=? AND FUNC=?", [mid, func], function(tx, rs) {
					}, function(tx, error) {
						alert("delete failed.");
					});
					tx.executeSql("INSERT INTO " + table + " (mid,func,modify,data) VALUES (?,?,?,?)", [mid,func,modify,data], function(tx, rs) {
					}, function(tx, error) {
						alert("insert failed.");
					});
				}, function(tx, error) {
					alert("update failed.");
				});
			});
		}
	}
};

