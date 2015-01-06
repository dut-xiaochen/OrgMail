/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern $ DA Element Prototype Ext*/

if (!DA) {
    throw "ERROR: missing DA.js or DA-min.js";
}
if (!DA.cal) {
    DA.cal = {};
}

/**
 * TODO: comments, JSDOC
 * @class DateSelector
 * @extends Ext.BoxComponent
 * @param cfg {Object} Configuration options
 */
DA.cal.DateSelector = Ext.extend(Ext.BoxComponent, {
    lang: 'ja',

	timeStyle: '24h',
    
    yearList: [],

    firstDay: 0,
    
    holidayList: [],

    customDayColorList: [],
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the year field.
     */
    yyNode: null,
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the month field.
     */
    mmNode: null,
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the day field.
     */
    ddNode: null,
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the hour field.
     */
    hhNode: null,
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the minutes field.
     */
    miNode: null,
    
    /**
     * @cfg {HTMLSelectElement} Pre-populated SELECT node to use as the seconds field.
     */
    ssNode: null,
    
    /**
     * @cfg {HTMLElement} Element where the calender object will be rendered.
     */
    calNode: null,
    
    yyId: null,
    
    mmId: null,
    
    ddId: null,
    
    hhId: null,
    
    miId: null,
    
    ssId: null,
    
    yyName: null,
    
    mmName: null,
    
    ddName: null,
    
    hhName: null,
    
    miName: null,
    
    ssName: null,
    
    _calNumber: 0,
    
    _calAId: null,
    
    _calDivId: null,
    
    _calObjectName: null,
    
    yySelector: null,
    
    mmSelector: null,
    
    ddSelector: null,
    
    hhSelector: null,
    
    miSelector: null,
    
    ssSelector: null,
    
    calSelector: null,
    
	lite: false,

	_dayList : {
		'1' : 31,
		'2' : 29,
		'3' : 31,
		'4' : 30,
		'5' : 31,
		'6' : 30,
		'7' : 31,
		'8' : 31,
		'9' : 30,
		'10': 31,
		'11': 30,
		'12': 31
	},
			
	_itemSaver: {
		'28': null,
		'29': null,
		'30': null
	},

    // Protected
    initComponent: function() {
		var caller = this.lite ? 
					function(para) {
						var ret = new DA.cal.DateSelector.PulldownLite(para);
						return ret;
					}
				   :
					function(para) {
						var ret = new Ext.ux.NumberPulldown(para);
						return ret;
					};
		this.constructor.superclass.initComponent.call(this);
        // Hash that contains this instance's value:
        // keys are yy, mm, dd, hh, mi, ss
        this.value = {}; 
        this.addEvents('change');

        var me = this;

        if (me.yyNode) {
            me.yyId = me.yyNode.id;
            me.yyName = me.yyNode.name;
            me.yySelector = caller({
				transform: me.yyNode,
				forceSelection: true,
				width: 55
			});
        }
        if (me.mmNode) {
            me.mmId = me.mmNode.id;
            me.mmName = me.mmNode.name;
            me.mmSelector = caller({
				transform: me.mmNode,
				forceSelection: (me.lang === 'ja') ? true : false,
				width: (me.lang === 'en') ? 48 : 42
            });
        }
        if (me.ddNode) {
            me.ddId = me.ddNode.id;
            me.ddName = me.ddNode.name;
            me.ddSelector = caller({
				transform: me.ddNode,
				forceSelection: true,
				width: 42
            });
        }
        if (me.hhNode) {
            me.hhId = me.hhNode.id;
            me.hhName = me.hhNode.name;
            me.hhSelector = caller({
				transform: me.hhNode,
				forceSelection: (me.timeStyle==="24h") ? true : false,
				width: (me.timeStyle==="24h") ? 42 : 62
            });
        }
        if (me.miNode) {
            me.miId = me.miNode.id;
            me.miName = me.miNode.name;
            me.miSelector = caller({
            	transform: me.miNode,
				forceSelection: true,
				width: 42
			});
        }
        if (me.ssNode) {
            me.ssId = me.ssNode.id;
            me.ssName = me.ssNode.name;
            me.ssSelector = caller({
            	transform: me.ssNode,
				forceSelection: true,
				width: 42
			});
        }
        if (me.calNode && !this.lite) {
            me._calNumber = DA.cal.DateSelector._calNumber ++;
            me._calAId = me._calIdHeader();
            me._calDivId = me._calIdHeader() + '_Id';
            me._calObjectName = 'DA.cal.DateSelector._calObject[' + me._calNumber + ']';
            
            me.calNode.innerHTML = ['<a id="' + me._calAId + '" href="#" onclick="DA.cal.Calendar.fncPopup2(event, ' + me._calObjectName + ', \'' + me._calDivId + '\', \'' + me._calAId + '\', $(\'' + me.yyId + '\').value, $(\'' + me.mmId + '\').value, $(\'' + me.ddId + '\').value);">',
                                    '<img src="' + DA.vars.imgRdir + '/ico_hibiki_calendar.gif" align="absmiddle">',
                                    '</a>',
                                    '&nbsp;&nbsp;<div id="' + me._calDivId + '" style="display:none"></div>'].join("");
            
            me.calSelector = new DA.cal.Calendar(me._calDivId, me._calObjectName, {
                prefix: {
                    year: me.yyName,
                    month: me.mmName,
                    day: me.ddName
                },
                lang: me.lang,
                firstDay: me.firstDay,
                yearList: me.yearList,
                holidayList: me.holidayList,
                customDayColorList: me.customDayColorList
            }, {
                onSet: function(year, month, day) {
                    me.yySelector.setValue(year);
                    // Calling setValue will not fire any events; so we 
                    // must force Ext-JS (The ComboBox) to fire at least
                    // the select event.
                    me.yySelector.fireEvent('select', me.yySelector);
                    
                    me.mmSelector.setValue(month);
                    me.mmSelector.fireEvent('select', me.mmSelector);

                    me.ddSelector.setValue(day);
                    me.ddSelector.fireEvent('select', me.ddSelector);
                },
                onEnable: function() {
                    $(me._calAId).style.display = "";
                },
                onDisable: function() {
                    $(me._calAId).style.display = "none";
                }
            });
            me.calSelector.writeCal2();
            DA.cal.DateSelector._calObject[me._calNumber] = me.calSelector;
            
            me._saveLast3Item();
        }
        
        // Plumbing: (n) 配管工業
        this._setupEventPlumbing();
    },


    /**
     * @private
     * @method _setupEventPlumbing
     */
    _setupEventPlumbing: function () {
        Ext.each(this._fields, function (fldName) {
            var selector = this[fldName+'Selector'];
            if (!selector || !selector.getValue) {
                return;
            }
            // Initialize our value field.
            // FIXME: redundant code
            var v = selector.getValue();
            if (v === '--') {
                delete this.value[fldName];
            } else {
                this.value[fldName] = v;
            }
            
            var handler = function (sel) {
                var val = sel.getValue();
                if (val === '--') {
                    delete this.value[fldName];
                } else {
                    this.value[fldName] = val;
                }
                this.fireEventsIfValid();
            };
            
            var mmHandler = this.lang === 'ja' ? 
                function (sel) {
                    var val = sel.getValue();
                    if (val === '--') {
                        delete this.value[fldName];
                    } else {
                        this.value[fldName] = val;
                    }
                    this.fireEventsIfValid();
                } :
                function (sel) {
                    var val = sel.getValue();
                    val = DA.util.isEmpty(val) ? sel.getText() : val;
                    if (val === '--') {
                        delete this.value[fldName];
                    } else {
                        this.value[fldName] = this._getMonthNumber(val);
                        if (this.value[fldName] === '') {
                            sel.setValue('');
                        }
                    }
                    this.fireEventsIfValid();
                };
            
			var hhHandler = this.timeStyle === '24h' ? 
				function(sel) {
					var val = sel.getValue();
					if (val === '--') {
						delete this.value[fldName];
					} else {
						this.value[fldName] = val;
					}
					this.fireEventsIfValid();
				} : 
				function(sel) {
					var val=sel.getValue();
					val = DA.util.isEmpty(val) ? sel.getText() : val;
					if (val === '--') {
						delete this.value[fldName];
					} else {
						this.value[fldName] = this._getHourNumber(val);
						if (this.value[fldName] === '') {
							sel.setValue('');
						}
					}
					this.fireEventsIfValid();
				};

            selector.on({
                select: (fldName === 'mm') ? mmHandler : 
							((fldName === 'hh') ? hhHandler : handler),
                enable: (fldName === 'mm') ? mmHandler : 
							((fldName === 'hh') ? hhHandler : handler),
                disable: (fldName === 'mm') ? mmHandler : 
							((fldName === 'hh') ? hhHandler : handler),
                blur: (fldName === 'mm') ? mmHandler : 
							((fldName === 'hh') ? hhHandler : handler),
                scope: this
            });

        }, this);
        // Will fire a 'change' event so that listeners may know
        // what the initial state is. 
        // We use defer() to fire this a bit later.
        this.fireEventsIfValid.defer(10, this, []);
    },

    /**
     * Will be initialized durinf initComponent
     * @private
     * @property value {Hash}
     */
    value: null,

    fireEventsIfValid: function () {
        if (this.value.yy && this.value.mm && this.value.dd) {
            if ('undefined' !== typeof this.value.hh && 
                'undefined' === typeof this.value.mi) {
                this.value.mi = 0;
            }
            this.fireEvent('change', this);
        }
    },


    /**
     * @private
     * @property {Array} _fields
     */
    _fields: ['yy', 'mm', 'dd', 'hh', 'mi', 'ss' /*Seconds needed?? */],


    /**
     * Returns the value set in all the fields (yy/mm/dd hh/mi/ss)
     * as an object literal
     * @public
     * @method getValue
     * @return {Object/Hash}
     */
    getValue: function () {
        // Return a copy of our value hash.
        return Ext.apply({}, this.value);
    },

    /**
     * Set the date/time of the selector in one go by passing in an
     * object literal with values for all fields.
     * @public
     * @method setValue
     * @param obj {Object/Hash} object literal vith values for fields yy, mm, dd, hh, mi, ss
     */
    setValue: function (obj) {
        var method;
        var selector;
        for (var fldName in obj) {
            selector = this[fldName+'Selector'];
            if (!selector || !selector.setValue) { continue; }
            selector.setValue(obj[fldName]);
            // We also need to update our value field
            this.value[fldName] = obj[fldName];
        }
    },

    
    enableYY: function() {
        if (this.yySelector) {
            this.yySelector.enable();
        }
    },
    
    enableMM: function() {
        if (this.mmSelector) {
            this.mmSelector.enable();
        }
    },
    
    enableDD: function() {
        if (this.ddSelector) {
            this.ddSelector.enable();
        }
    },
    
    enableHH: function() {
        if (this.hhSelector) {
            this.hhSelector.enable();
        }
    },
    
    enableMI: function() {
        if (this.miSelector) {
            this.miSelector.enable();
        }
    },
    
    enableSS: function() {
        if (this.ssSelector) {
            this.ssSelector.enable();
        }
    },
    
    enableDate: function() {
        this.enableYY();
        this.enableMM();
        this.enableDD();
        if (this.calSelector) {
            this.calSelector.enable();
        }
    },
    
    enableTime: function() {
        this.enableHH();
        this.enableMI();
        this.enableSS();
    },
    
    enableAll: function() {
        this.enableDate();
        this.enableTime();
        if (this.calSelector) {
            this.calSelector.enable();
        }
    },

    disableYY: function() {
        if (this.yySelector) {
            this.yySelector.disable();
        }
    },
    
    disableMM: function() {
        if (this.mmSelector) {
            this.mmSelector.disable();
        }
    },
    
    disableDD: function() {
        if (this.ddSelector) {
            this.ddSelector.disable();
        }
    },
    
    disableHH: function() {
        if (this.hhSelector) {
            this.hhSelector.disable();
//          this.hhSelector.setValue('--');
        }
    },
    
    disableMI: function() {
        if (this.miSelector) {
            this.miSelector.disable();
//          this.miSelector.setValue('--');
        }
    },
    
    disableSS: function() {
        if (this.ssSelector) {
            this.ssSelector.disable();
//          this.ssSelector.setValue('--');
        }
    },
    
    disableDate: function() {
        this.disableYY();
        this.disableMM();
        this.disableDD();
        if (this.calSelector) {
            this.calSelector.disable();
        }
    },
    
    disableTime: function() {
        this.disableHH();
        this.disableMI();
        this.disableSS();
    },
    
    disableAll: function() {
        this.disableDate();
        this.disableTime();
        if (this.calSelector) {
            this.calSelector.disable();
        }
    },
    
    resetYY: function() {
        if (this.yySelector) {
            this.yySelector.setValue('--');
        }
    },
    
    resetMM: function() {
        if (this.mmSelector) {
            this.mmSelector.setValue('--');
        }
    },
    
    resetDD: function() {
        if (this.ddSelector) {
            this.ddSelector.setValue('--');
        }
    },
    
    resetHH: function() {
        if (this.hhSelector) {
            this.hhSelector.setValue('--');
        }
    },
    
    resetMI: function() {
        if (this.miSelector) {
            this.miSelector.setValue('--');
        }
    },
    
    resetSS: function() {
        if (this.ssSelector) {
            this.ssSelector.setValue('--');
        }
    },
    
    resetDate: function() {
        this.resetYY();
        this.resetMM();
        this.resetDD();
    },
    
    resetTime: function() {
        this.resetHH();
        this.resetMI();
        this.resetSS();
    },
    
    resetAll: function() {
        this.resetDate();
        this.resetTime();
    },
    
    syncYY: function() {
        if (this.yySelector) {
            if (this.yySelector.getText() !== this.yySelector.getValue()) {
                this.yySelector.setValue(this.yySelector.getText());
            }
        }
    },
    
    syncMM: function() {
        if (this.mmSelector) {
            if (this.mmSelector.getText() !== this.mmSelector.getValue()) {
                this.mmSelector.setValue(this.mmSelector.getText());
            }
        }
    },
    
    syncDD: function() {
        if (this.ddSelector) {
            if (this.ddSelector.getText() !== this.ddSelector.getValue()) {
                this.ddSelector.setValue(this.ddSelector.getText());
            }
        }
    },
    
    syncHH: function() {
        if (this.hhSelector) {
            if (this.hhSelector.getText() !== this.hhSelector.getValue()) {
                this.hhSelector.setValue(this.hhSelector.getText());
            }
        }
    },
    
    syncMI: function() {
        if (this.miSelector) {
            if (this.miSelector.getText() !== this.miSelector.getValue()) {
                this.miSelector.setValue(this.miSelector.getText());
            }
        }
    },
    
    syncSS: function() {
        if (this.ssSelector) {
            if (this.ssSelector.getText() !== this.ssSelector.getValue()) {
                this.ssSelector.setValue(this.ssSelector.getText());
            }
        }
    },
    
    syncDate: function() {
        this.syncYY();
        this.syncMM();
        this.syncDD();
    },
    
    syncTime: function() {
        this.syncHH();
        this.syncMI();
        this.syncSS();
    },
    
    syncAll: function() {
        this.syncDate();
        this.syncTime();
    },
    
    updateDayList: function(date) {
		var i;
		var year = Number(date.yy);
		var month = Number(date.mm);
		if (month === 0) {
			return;
		}
		
		var day = this._dayList[String(month)];
		if (month === 2  && year) {
			day = new Date(year, month, 0).getDate();
		}
		var length = this.ddSelector.getPulldownLength();
		if (day < length) {
			if (date.dd > day) {
				this.ddSelector.setValue(day);
			}
			this.ddSelector.removeItem(day, length - 1);
		} else if (day > length) {
			for (i = length; i < day; i++) {
				this.ddSelector.addItem(this._itemSaver[i]);
			}
		}
		if (date.dd > day) {
			date.dd = day;
		}

		return date.dd;
    },
    
    _saveLast3Item: function() {
    	for (var i = 30; i >= 28; i--) {
    		this._itemSaver[String(i)] = this.ddSelector.getItem(i);
    	}
    },    
    
    _calIdHeader: function() {
        return 'DACalendar_' + this._calNumber;
    },
    
    _getMonthNumber: function(mon) {
        var mm;
        
        switch(mon + '') {
            case   '1':
            case  '01':
            case 'Jan': mm = '01'; break;
            case   '2':
            case  '02':
            case 'Feb': mm = '02'; break;
            case   '3':
            case  '03':
            case 'Mar': mm = '03'; break;
            case   '4':
            case  '04':
            case 'Apr': mm = '04'; break;
            case   '5':
            case  '05':
            case 'May': mm = '05'; break;
            case   '6':
            case  '06':
            case 'Jun': mm = '06'; break;
            case   '7':
            case  '07':
            case 'Jul': mm = '07'; break;
            case   '8':
            case  '08':
            case 'Aug': mm = '08'; break;
            case   '9':
            case  '09':
            case 'Sep': mm = '09'; break;
            case  '10':
            case 'Oct': mm = '10'; break;
            case  '11':
            case 'Nov': mm = '11'; break;
            case  '12':
            case 'Dec': mm = '12'; break;
            default: mm = '';
        }
        
        return(mm);
    },

	_getHourNumber: function(hour) {
		var hh;
		switch(hour + '') {
			case '00':
			case '12 AM': hh = '00'; break;
			case '01':
			case '01 AM': hh = '01'; break;
			case '02':
			case '02 AM': hh = '02'; break;
			case '03':
			case '03 AM': hh = '03'; break;
			case '04':
			case '04 AM': hh = '04'; break;
			case '05':
			case '05 AM': hh = '05'; break;
			case '06':
			case '06 AM': hh = '06'; break;
			case '07':
			case '07 AM': hh = '07'; break;
			case '08':
			case '08 AM': hh = '08'; break;
			case '09':
			case '09 AM': hh = '09'; break;
			case '10':
			case '10 AM': hh = '10'; break;
			case '11':
			case '11 AM': hh = '11'; break;
			case '12':
			case '12 PM': hh = '12'; break;
			case '13':
			case '01 PM': hh = '13'; break;
			case '14':
			case '02 PM': hh = '14'; break;
			case '15':
			case '03 PM': hh = '15'; break;
			case '16':
			case '04 PM': hh = '16'; break;
			case '17':
			case '05 PM': hh = '17'; break;
			case '18':
			case '06 PM': hh = '18'; break;
			case '19':
			case '07 PM': hh = '19'; break;
			case '20':
			case '08 PM': hh = '20'; break;
			case '21':
			case '09 PM': hh = '21'; break;
			case '22':
			case '10 PM': hh = '22'; break;
			case '23':
			case '11 PM': hh = '23'; break;
			default: hh = '--';
		}
		return (hh);
	}
});

DA.cal.DateSelector.PulldownLite = function(pa) {
	Ext.apply(this, pa);
	if(!this.transform) {
		throw "ERROR: Bad args: PulldownLite needs { transform: HTMLSELECTElement }";
	}
	this.el = $(this.transform);
	this.addEvents({
					select: true,
					enable: true,
					disable: true,
					blur: true
	});
	this._setupEventPlumbing();
};

Ext.extend(DA.cal.DateSelector.PulldownLite,
		   Ext.util.Observable,
		   {
			setValue: function(val) {
				var nVal = parseInt(val, 10);
				var result;
				if(isFinite(nVal)) {
					result = (nVal < 10) ? ('0' + nVal) : ('' + nVal);
				} else {
					result = '--';
				}
				this.el.value = result;
				if(!this.el.value) {
					this.el.value = '--';
				}
			},
			getValue: function() {
				return this.el.value;
			},
			getText: function() {
				return this.el.value;
			},
			enable: function() {
				this.el.disabled = false;
//				this.fireEvent('enable', this);
			},
			disable: function() {
				this.el.disabled = true;
//				this.fireEvent('disable', this);
			},
			isDisable:function(){
				return this.el.disabled;
			},
			_setupEventPlumbing: function() {
				var el = Ext.get(this.el);
				el.on('change', 
					  function(eve) {
					      this.fireEvent('select', this);
					  },
					  this);
				el.on('blur',
					  function(eve) {
						  this.fireEvent('blur', this);
					  },
					  this);
			}
		}
);

DA.cal.DateSelector._calNumber = 0;

DA.cal.DateSelector._calObject = [];

