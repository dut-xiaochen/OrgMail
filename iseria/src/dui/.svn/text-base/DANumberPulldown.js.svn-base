/*
Copyright (c) 2008, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern Ext */

/**
 * @class Ext.ux.NumberPulldown
 * @extends Ext.form.ComboBox
 */
Ext.ux.NumberPulldown = Ext.extend(Ext.form.ComboBox, {
    typeAhead: true,
    triggerAction: 'all',
    forceSelection: true,
    validationEvent: true,

    width: 50,
    initComponent: function () {
        Ext.ux.NumberPulldown.superclass.initComponent.call(this);
    },

    onFocus: function () {
        Ext.form.TriggerField.superclass.onFocus.call(this);
        if (!this.mimicing) {
            this.wrap.addClass('x-trigger-wrap-focus');
            this.mimicing = true;
            Ext.get(Ext.isIE ? document.body : document).on("mousedown", this.mimicBlur, this, {
                delay: 10
            });
            if (this.monitorTab) {
                this.el.on("keydown", this.checkTab, this);
            }
            this.onTriggerClick();
        }
    },

    validator: function (A) {
        var F = this.valueField;
        var X;
        var flag;
        var tmpNumber = Number.MAX_VALUE;
        var tmpData = A;
        if (this.store.snapshot) {
            this.store.data = this.store.snapshot;
            this.view.store = this.store;
            this.view.refresh();
        }
        this.store.each(function(D){
            flag = Math.abs(D.data[F] - A);
            if (flag <= tmpNumber) {
                tmpNumber = flag;
                tmpData = D;
            }
            if (D.data[F] === A) {
                X = D;
                return false;
            }
        });
        
        var M;
        if (X) {
            M = X.data[this.displayField];
        }
        else 
            if (tmpData.data) {
                M = tmpData.data[this.displayField];
            }
        this.lastSelectionText = M;
        if (this.hiddenField) {
            this.hiddenField.value = A;
        }
        this.value = M;
        
        return true;
    },

    setValue: function(A){
        this.collapse();
        return this.constructor.superclass.setValue.call(this, A);
    },
    getText: function(A){
        return this.getRawValue(A);
    },
    setText: function(A){
        return this.setRawValue(A);
    },
    getPulldownN: function(N){
        return this.store.data.items[N].data.value;
    },
    getPulldownLength: function(){
        return this.store.data.length;
    },
    /**
     * Comments: TODO
     * @public // public or private?
     * @method getPulldownList
     * @return {Array}
     */
    getPulldownList: function(){
        var arr = [], length = this.getPulldownLength();
        for (var i = 0; i < length; ++i) {
            arr[i] = this.getPulldownN(i);
        }
        return arr;
    },
    
	addItem: function(item) {
		this.store.data.add(item);
		if (this.view) {
			this.view.refresh();
		}
    },
    	
	removeItem: function(startIndex, endIndex) {
		for (var i = endIndex; i >= startIndex; i--) {
			this.store.data.remove(this.store.data.items[i]);
		}
		if (this.view) {
			this.view.refresh();
		}
    },
    	
    getItem: function(index) {
    	return this.store.data.items[index];
    },
    
    setDisable: function(value) {
    	this.disabled = value;
    },
    
    isDisable: function() {
    	return this.disabled;
    }
});

