/* $Id: nvpairs.js 1431 2007-07-17 01:56:33Z faiz_kazi $ -- $HeadURL: http://yuki.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/misc/nvpairs.js $ */
/*for JSLINT undef checks*/
/*extern $ DA Prototype YAHOO Element BrowserDetect */
/* 
 * Copyright (c) 2007, DreamArts. All rights reserved. 
 * TODO: message 
 * version: ?? 
 *   
 * Utilities for the AjaxMailer (メール詳細) mail header display
 * @title       Name-Value pair Widget
 * @namespace   DA.widget 
 */ 
if (('undefined' === typeof DA) || ('undefined' === typeof DA.widget) ) {
    throw "DEPENDENCY ERROR: DA.widget is not defined.";
}
if (('undefined' === typeof Prototype) ) {
    throw "DEPENDENCY ERROR: Prototype is not included.";
}
if (('undefined' === typeof YAHOO)) {
    throw "DEPENDENCY ERROR: YAHOO is not included.";
}


/*
 * @class NVPairSet
 * @constructor 
 * @param div (Object) HTMLDivElement
 * @param nvpair (Object) A hash containing Name-Value Pairs   
 * @param args (array) An array of Name-Value Pairs's keys                                          
 */
DA.widget.NVPairSet = function(div      /*HTMLDivElement*/,
                               nvpair   /*hash: Name-Value Pairs*/,
                               args     /*array of pairs' names*/,
                               expanded /*default expanded*/){
    
    
    this.div = $(div);        // Using it to be widget container
    this.nvpair = nvpair;     // Initialize the name-value pairs
    this.args = args;         // When the wedget is collapsed, 
    this.expanded = expanded; //      only the pairs containing the key in the array will be displayed,
                              //      and if the parameter is null, only first 2 Name-Value Pairs will be displayed  
    this.init();          
};

DA.widget.NVPairSet.prototype = {
  
    /**
     * The display state of the PairSet (expanded/collapsed)
     * @property isCollapsed
     */
    expanded: false,
   
    /**
     * The maximimum name-value pairs that will be displayed in collapse mode.
     * @property maxDisplayCollapsed
     * @type {Number}
     */
    maxDisplayCollapsed: 3,

    /**
     * The divider for mailTo area.
     * @property mailToDivider
     * @type {HTMLElement}
     */
    mailToDivider: null,

    /**
     * The divider for mailCc area.
     * @property mailCcDivider
     * @type {HTMLElement}
     */
    mailCcDivider: null,

    /**
     * The divider for mailBcc area.
     * @property mailBccDivider
     * @type {HTMLElement}
     */
    mailBccDivider: null,

    /**
     * Horizontal drag-drop
     * Drag-drop object for the mailTo up/down resizer.
     * @property hdd
     * @type {Object} instance of YAHOO.util.DDProxy
     */
    toHdd: null,

    /**
     * Horizontal drag-drop
     * Drag-drop object for the mailCc up/down resizer.
     * @property hdd
     * @type {Object} instance of YAHOO.util.DDProxy
     */
    ccHdd: null,

    /**
     * Horizontal drag-drop
     * Drag-drop object for the mailBcc up/down resizer.
     * @property hdd
     * @type {Object} instance of YAHOO.util.DDProxy
     */
    bccHdd: null,

    /**
     * See the CSS (three-pane.css) for how to customize the 
     * proxy drag element (selected by ID)
     * @property dragElId
     * @type {String} id of the drag proxy element
     */
    dragElId: "da_threePaneResizerDragProxy",
    
    /**
     * Initialize 'name-value pairs' wedget
     * @method init
     */
    init: function(){
        var me  = this;
        this.rootTable = document.createElement("table"); // Create root table
        this.rootTbody = document.createElement("tbody"); // Create root tbody
        this.rootTr    = document.createElement("tr");  // Create the image td
        this.rootTable.className = "da_nvPairSet";
        
        // PLUS-MINUS Image
        this.plusMinusTd  = document.createElement("td");  // Create image td
        this.plusMinusTd.className = "da_toggleOuter";
        
        this.plusMinusDiv = document.createElement("div"); // Create image
        this.plusMinusDiv.onclick = function(){
            if (me.expanded) {
                me.collapse();
            } else {
                me.expand();
            }
        };
        this.plusMinusDiv.className = "da_toggleCollapse";
        this.plusMinusDiv.innerHTML = DA.imageLoader.nullTag();
        
        this.widgetTd = document.createElement("td");  // Create the widget td   
        
        this.plusMinusTd.appendChild(this.plusMinusDiv);
        this.rootTr.appendChild(this.plusMinusTd);
        this.rootTr.appendChild(this.widgetTd);
        this.rootTbody.appendChild(this.rootTr);
        this.rootTable.appendChild(this.rootTbody);
        this.div.appendChild(this.rootTable);
        
        this.expandTable = document.createElement("table"); // Create the expand table
        this.expandTable.className = "da_nvPairSetExpanded";
        this.expandTbody = document.createElement("tbody"); // Create the expand tbody
        this.collapseTable = document.createElement("table"); //Create the collapse table
        this.collapseTable.className = "da_nvPairSetCollapsed";
        this.collapseTbody = document.createElement("tbody"); //Create the collapse tbody
        
        this.collapseTable.appendChild(this.collapseTbody);
        this.expandTable.appendChild(this.expandTbody);
        this.widgetTd.appendChild(this.collapseTable);
        this.widgetTd.appendChild(this.expandTable);
        
        this._expandPair = {}; // Create a hash to save the name-value pairs in the expand table 
        this._collapsePair = {}; // Create a hash to save the name-value pairs in the collapse table
        this._collapseResizeNodes = [];
        this._collapseResizeExceptNodes = [];
        
        var pairtr; // tr
        var pairtd; // td
        var nametd, valuetd, septd; // td
        var nvpairnameTd; // name's td
        var nvpairvalueTd; // value's td
        
        var i, key; // used for account
        
        // initialize collapse table
        // TODO: this should be improved
        pairtr = document.createElement("tr");
        pairtd = document.createElement("td");
        pairtr.className = "da_nvCollapsedPair";
        if ('undefined' !== typeof this.args){
            if (this.args.length > 0) {
                for (i=0; i<this.args.length; i++ )
                {
                    if ('undefined' !== typeof this.nvpair[this.args[i]])
                    {
                        this.putCollapse(this.args[i], pairtd);
                    }
                }
            } else {
                this.plusMinusDiv.style.display = 'none';
            }
        }        
        else {
            i = 0;
            for (key in this.nvpair)
            {
                if ('function' === typeof this.nvpair[key]) 
                {
                    continue;
                }
                this.putCollapse(key, pairtd);
                if((++i) === 2)
                {
                    break;
                }
            }
        }
        pairtr.appendChild(pairtd);
        this.collapseTbody.appendChild(pairtr);
        this._hideExcessCollapsedPairs();
        
        //initialize expand table
        var first = 1;
        for (key in this.nvpair) {
            if ('function' === typeof this.nvpair[key]) 
            {
                continue;
            }
            if (first !== 1 && this.nvpair[key].border !== false) {
                this.putExpandBorder(key);
                this.mailToDivider = document.getElementById("mailCcDivider");
                this.mailCcDivider = document.getElementById("mailBccDivider");
                this.mailBccDivider = document.getElementById("mailDateDivider");
            }
            this.putExpand(key, this.expandTbody);
            
            first = 0;
        }
        
        if (this.expanded) {
            this.expand();
        } else {
            this.collapse();
        }

        // Lazily create the Proxy drag element.
        var dragEl = YAHOO.util.Dom.get(this.dragElId);
        if (!dragEl) {
            dragEl = document.createElement('div');
            dragEl.id = this.dragElId;
            document.body.insertBefore(dragEl, document.body.firstChild);
        }

        // TODO: Make this a prototype member instead?
        var config = {
            maintainOffset: true,
            dragElId: this.dragElId
        };

        // Horizontal drag/drop
        this.toHdd  = new YAHOO.util.DDProxy(this.mailToDivider,  "toHdd",  config);
        this.ccHdd  = new YAHOO.util.DDProxy(this.mailCcDivider,  "ccHdd",  config);
        this.bccHdd = new YAHOO.util.DDProxy(this.mailBccDivider, "bccHdd", config);
        var DOM = YAHOO.util.Dom;
        var startY = 0;
        this.toHdd.onMouseDown = function(e) {
            startY = YAHOO.util.Event.getPageY(e);
            var del = this.getDragEl();
            this.setInitPosition();
            // Now for the constraints...
            var dragElAreaId = "mailToArea";
            if (!DOM.get(dragElAreaId) || DOM.get(dragElAreaId).style.display === "none") {
                this.endDrag();
                this.setYConstraint(0, 0);
                this.setXConstraint(0, 0);
                return;
            }
            var beforeDragUpHeight = parseInt((DOM.get(dragElAreaId).style.height).split("px")[0], 10);
            var beforeDragDownHeight = DOM.getClientHeight() - DOM.getY(DOM.get(dragElAreaId)) - beforeDragUpHeight;
            this.setYConstraint(beforeDragUpHeight - 18, beforeDragDownHeight - 40);
            this.setXConstraint(0, 0);
            del.style.cursor = 'n-resize';
        };
        
        this.toHdd.endDrag = function(e) {
            var lel = this.getEl();
            var del = this.getDragEl();
         
            // FIXME: copy-pasted from YUI, redundant code
            // Show the drag frame briefly so we can get its position
            // del.style.visibility = "";

            DOM.setStyle(del, "visibility", ""); 
            var curY = DOM.getY( del );
            DOM.setStyle(del, "visibility", "hidden"); 
            DOM.setStyle(lel, "visibility", "");
            var offset = curY - startY;
            var dragElAreaId = "mailToArea";
            if (!DOM.get(dragElAreaId) || DOM.get(dragElAreaId).style.display === "none") {
                return;
            }
            var afterDragHeight = parseInt((DOM.get(dragElAreaId).style.height).split("px")[0], 10) + offset;
            DOM.get(dragElAreaId).style.height = afterDragHeight + "px";
        };
        this.ccHdd.onMouseDown = function(e) {
           startY = YAHOO.util.Event.getPageY(e);
            var del = this.getDragEl();
            this.setInitPosition();
            // Now for the constraints...
            var dragElAreaId = "mailCcArea";
            if (!DOM.get(dragElAreaId) || DOM.get(dragElAreaId).style.display === "none") {
                this.endDrag();
                this.setYConstraint(0, 0);
                this.setXConstraint(0, 0);
                return;
            }
            var beforeDragUpHeight = parseInt((DOM.get(dragElAreaId).style.height).split("px")[0], 10);
            var beforeDragDownHeight = DOM.getClientHeight() - DOM.getY(DOM.get(dragElAreaId)) - beforeDragUpHeight;
            this.setYConstraint(beforeDragUpHeight - 18, beforeDragDownHeight - 40);
            this.setXConstraint(0, 0);
            del.style.cursor = 'n-resize';
        };
        
        this.ccHdd.endDrag = function(e) {
            var lel = this.getEl();
            var del = this.getDragEl();
            
            // FIXME: copy-pasted from YUI, redundant code
            // Show the drag frame briefly so we can get its position
            // del.style.visibility = "";
            DOM.setStyle(del, "visibility", ""); 
            var curY = DOM.getY( del );
            DOM.setStyle(del, "visibility", "hidden"); 
            DOM.setStyle(lel, "visibility", "");
            var offset = curY - startY;
            var dragElAreaId = "mailCcArea";
            if (!DOM.get(dragElAreaId) || DOM.get(dragElAreaId).style.display === "none") {
                return;
            }
            var afterDragHeight = parseInt((DOM.get(dragElAreaId).style.height).split("px")[0], 10) + offset;
            DOM.get(dragElAreaId).style.height = afterDragHeight + "px";
        };
        this.bccHdd.onMouseDown = function(e) {
            startY = YAHOO.util.Event.getPageY(e);
            var del = this.getDragEl();
            this.setInitPosition();
            // Now for the constraints...
            var dragElAreaId = "mailBccArea";
            if (!DOM.get(dragElAreaId) || DOM.get(dragElAreaId).style.display === "none") {
                this.endDrag();
                this.setYConstraint(0, 0);
                this.setXConstraint(0, 0);
                return;
            }
            var beforeDragUpHeight = parseInt((DOM.get(dragElAreaId).style.height).split("px")[0], 10);
            var beforeDragDownHeight = DOM.getClientHeight() - DOM.getY(DOM.get(dragElAreaId)) - beforeDragUpHeight;
            this.setYConstraint(beforeDragUpHeight - 18, beforeDragDownHeight - 40);
            this.setXConstraint(0, 0);
            del.style.cursor = 'n-resize';
        };
        
        this.bccHdd.endDrag = function(e) {
            var lel = this.getEl();
            var del = this.getDragEl();
            
            // FIXME: copy-pasted from YUI, redundant code
            // Show the drag frame briefly so we can get its position
            // del.style.visibility = "";
            DOM.setStyle(del, "visibility", ""); 
            var curY = DOM.getY( del );
            DOM.setStyle(del, "visibility", "hidden"); 
            DOM.setStyle(lel, "visibility", "");
            var offset = curY - startY;
            var dragElAreaId = "mailBccArea";
            if (!DOM.get(dragElAreaId) || DOM.get(dragElAreaId).style.display === "none") {
                return;
            }
            var afterDragHeight = parseInt((DOM.get(dragElAreaId).style.height).split("px")[0], 10) + offset;
            DOM.get(dragElAreaId).style.height = afterDragHeight + "px";
        };
        
        this.resize();
    },

    /**
     * @method showCursor
     * @private
     */
    showCursor: function(key) {
        var DOM = YAHOO.util.Dom;
        var divider = DOM.get("mail"+key+"Divider");
        DOM.setStyle(divider, "cursor", "n-resize");
    },

    /**
     * @method showCursor
     * @private
     */
    hideCursor: function(key) {
        var DOM = YAHOO.util.Dom;
        var divider = DOM.get("mail"+key+"Divider");
        DOM.setStyle(divider, "cursor", "default");
    },

    /**
     * @method _hideExcessCollapsedPairs
     * @private
     */
    _hideExcessCollapsedPairs: function() {
        var max = this.maxDisplayCollapsed;
        var domNodes = this._collapseResizeNodes.pluck( 'parentNode' ); // Copy the array of nodes! 
        var toShow = domNodes.splice(0, max);
        var toHide = domNodes;
        var YDom = YAHOO.util.Dom;
        toHide.each( function (n, i) {
            if (YDom.hasClass(n, 'da_nvPairFloatRight')) { // right-floated elements
                toShow.push(toHide.splice(i, 1).pop()); // must always be shown
            }
        });
        Element.show.apply(null, toShow);
        Element.hide.apply(null, toHide);
    },
    
    putCollapse: function(key, parent) {
        var i, pairDiv, nameDiv, valueDiv, sepDiv, iconDiv, htmlDiv;
        if (!DA.util.isEmpty(this.nvpair[key].icon)) {
            pairDiv = document.createElement("div");
            iconDiv = document.createElement("div");
            pairDiv.className  = (this.nvpair[key].hidden) ? "da_nvPairOuter da_nvPairHidden da_nvPairFloatRight" : "da_nvPairOuter da_nvPairFloatRight";
            iconDiv.className = "da_nvPairIcon";
            this._collapsePair[key] = {
                domPairElem: pairDiv,
                domIconElem: iconDiv
            };
            iconDiv.innerHTML = DA.imageLoader.tag(this.nvpair[key].icon, '', { id: (DA.util.isEmpty(this.nvpair[key].id)) ? '' : this.nvpair[key].id + 'Icon' }); 
            pairDiv.appendChild(iconDiv);
            parent.appendChild(pairDiv);
            
            this._collapseResizeExceptNodes.push(pairDiv);
        } else if (!DA.util.isEmpty(this.nvpair[key].html)) {
            pairDiv = document.createElement("div");
            htmlDiv = document.createElement("div");
            pairDiv.className = (this.nvpair[key].hidden) ? "da_nvPairOuter da_nvPairHidden da_nvPairFloatRight" : "da_nvPairOuter da_nvPairFloatRight";
            htmlDiv.className = "da_nvPairHTML";
            this._collapsePair[key] = {
                domPairElem: pairDiv,
                domHTMLElem: htmlDiv
            };
            if (!DA.util.isEmpty(this.nvpair[key].id)) {
                htmlDiv.id = this.nvpair[key].id + 'HTML';
            }
            htmlDiv.innerHTML = this.nvpair[key].html;
            pairDiv.appendChild(htmlDiv);
            parent.appendChild(pairDiv);
            
            this._collapseResizeExceptNodes.push(pairDiv);
        } else if (!DA.util.isEmpty(this.nvpair[key].name) || !DA.util.isEmpty(this.nvpair[key].value)) {
            pairDiv  = document.createElement("div");
            nameDiv  = document.createElement("div");
            valueDiv = document.createElement("div");
            sepDiv   = document.createElement("div");
            pairDiv.className  = (this.nvpair[key].hidden) ? "da_nvPairOuter da_nvPairHidden" : "da_nvPairOuter";
            nameDiv.className  = "da_nvPairCollapseName da_nvPairFloatLeft";
            valueDiv.className = "da_nvPairValue da_nvPairFloatLeft"; valueDiv.style.width = "25%";
            sepDiv.className   = "da_nvPairSeparator da_nvPairFloatLeft";
            this._collapsePair[key] = {
                domPairElem: pairDiv,
                domNameElem: nameDiv,
                domValueElem: valueDiv
            };
            if (!DA.util.isEmpty(this.nvpair[key].id)) {
                nameDiv.id  = this.nvpair[key].id + 'Name';
                valueDiv.id = this.nvpair[key].id + 'Value';
            }
            if (this.nvpair[key].weight === false) {
                nameDiv.style.fontWeight  = 'normal';
                valueDiv.style.fontWeight = 'normal';
                sepDiv.style.fontWeight   = 'normal';
            }
            nameDiv.innerHTML  = this.nvpair[key].name;
            valueDiv.innerHTML = this.nvpair[key].value;
            sepDiv.innerHTML   = ':';
            pairDiv.appendChild(nameDiv);
            pairDiv.appendChild(sepDiv);
            pairDiv.appendChild(valueDiv);
            parent.appendChild(pairDiv);
            
            this._collapseResizeNodes.push(valueDiv);
            this._collapseResizeExceptNodes.push(nameDiv);
            this._collapseResizeExceptNodes.push(sepDiv);
        }
    },
    
    /**
     * Put a new name-value pair into the widget
     * @method put
     */    
    putExpand: function(key, parent) {
        var me = this;
        var name, value, expand, row;
        var nvpairTr, nvpairpmTd, nvpairpmDiv, nvpairnameTd, nvpairvalueTd, nvpairvalueDiv, nvpairexpandDiv, nvpairsepTd, nvpairRowTd, nvpairRowDiv;
        if (this.nvpair[key].row) {
            row = (DA.util.isEmpty(this.nvpair[key].row)) ? '' : this.nvpair[key].row;
            
            nvpairTr     = document.createElement("tr");
            nvpairRowTd  = document.createElement("td");
            nvpairRowDiv = document.createElement("div");
            nvpairRowTd.colSpan = 4;
            nvpairTr.className = (this.nvpair[key].hidden) ? "da_nvExpandedPair da_nvPairHidden" : "da_nvExpandedPair";
            nvpairRowTd.className = "da_nvPairRow";
            
            this._expandPair[key] = {
                domPairElem: nvpairTr,
                domRowElem: nvpairRowDiv
            };
            if (!DA.util.isEmpty(this.nvpair[key].id)) {
                nvpairTr.id      = this.nvpair[key].id + 'Parent';
                nvpairRowDiv.id = this.nvpair[key].id + 'Row';
            }
            if (this.nvpair[key].weight === false) {
                nvpairRowDiv.style.fontWeight = 'normal';
            }
            
            nvpairRowDiv.innerHTML = row;
            
            nvpairRowTd.appendChild(nvpairRowDiv);
            nvpairTr.appendChild(nvpairRowTd);
            parent.appendChild(nvpairTr);
        } else if (!DA.util.isEmpty(this.nvpair[key].name) || !DA.util.isEmpty(this.nvpair[key].value)) {
            name   = (DA.util.isEmpty(this.nvpair[key].name)) ? '' : this.nvpair[key].name;
            value  = (DA.util.isEmpty(this.nvpair[key].value)) ? '' : this.nvpair[key].value;
            expand = (DA.util.isEmpty(this.nvpair[key].expand)) ? '' : this.nvpair[key].expand;

            nvpairTr        = document.createElement("tr");
            nvpairpmTd      = document.createElement("td");
            nvpairpmDiv     = document.createElement("div");
            nvpairnameTd    = document.createElement("td");
            nvpairvalueTd   = document.createElement("td");
            nvpairvalueDiv  = document.createElement("div");
            nvpairexpandDiv = document.createElement("div");
            nvpairsepTd     = document.createElement("td");
            nvpairTr.className       = (this.nvpair[key].hidden) ? "da_nvExpandedPair da_nvPairHidden" : "da_nvExpandedPair";
            nvpairpmTd.className     = "da_toggleOuter";
            nvpairnameTd.className   = "da_nvPairExpandName";
            nvpairvalueTd.className  = "da_nvPairValue da_nvPairBreak";
            nvpairsepTd.className    = "da_nvPairSeparator";
            
            this._expandPair[key] = {
                domPairElem:   nvpairTr,
                domPMElem:     nvpairpmDiv,
                domNameElem:   nvpairnameTd,
                domValueElem:  nvpairvalueDiv,
                domExpandElem: nvpairexpandDiv
            };
            if (!DA.util.isEmpty(this.nvpair[key].id)) {
                nvpairTr.id        = this.nvpair[key].id + 'Parent';
                nvpairpmDiv.id     = this.nvpair[key].id + 'PlusMinus';
                nvpairnameTd.id    = this.nvpair[key].id + 'Name';
                nvpairvalueDiv.id  = this.nvpair[key].id + 'Value';
                nvpairexpandDiv.id = this.nvpair[key].id + 'Separator';
            }
            if (DA.util.isEmpty(expand)) {
                this.disableColumnExpand(key);
            } else {
                this.enableColumnExpand(key);
            }
            if (this.nvpair[key].weight === false) {
                nvpairnameTd.style.fontWeight  = 'normal';
                nvpairvalueTd.style.fontWeight = 'normal';
                nvpairsepTd.style.fontWeight   = 'normal';
            }
            
            nvpairpmDiv.innerHTML     = DA.imageLoader.nullTag();
            nvpairnameTd.innerHTML    = name;
            nvpairvalueDiv.innerHTML  = value;
            nvpairexpandDiv.innerHTML = expand;
            nvpairsepTd.innerHTML     = ':';
            nvpairpmDiv.onclick       = function() {
                if (me.columnExpanded(key)) {
                    me.collapseColumn(key);
                } else {
                    me.expandColumn(key);
                }
            };
            
            nvpairpmTd.appendChild(nvpairpmDiv);
            nvpairvalueTd.appendChild(nvpairvalueDiv);
            nvpairvalueTd.appendChild(nvpairexpandDiv);
            nvpairTr.appendChild(nvpairpmTd);
            nvpairTr.appendChild(nvpairnameTd);
            nvpairTr.appendChild(nvpairsepTd);
            nvpairTr.appendChild(nvpairvalueTd);
            parent.appendChild(nvpairTr);
        }
    },
    
    putExpandBorder: function(key) {
        var nvpairTr = document.createElement("tr");
        var nvpairTd = document.createElement("td");
        var nvpairDividerDiv = document.createElement("div");
        if(key === "Cc" || key === "Bcc" || key === "Date") {
            nvpairDividerDiv.className = "da_nvPairDivider";
            nvpairDividerDiv.id = "mail"+key+"Divider";
            nvpairTd.colSpan   = 5;
            nvpairTd.className = "da_nvPairBorder";
            nvpairTd.appendChild(nvpairDividerDiv);
        } else {
            nvpairTd.innerHTML = DA.imageLoader.nullTag();
            nvpairTd.className = "da_nvPairBorder";
            nvpairTd.colSpan   = 5;
        }
        nvpairTr.appendChild(nvpairTd);
        this.expandTbody.appendChild(nvpairTr);        
    },
    
    changeName: function(key, name) {
        this.nvpair[key].name = (DA.util.isEmpty(name)) ? '' : name;
        if (this._expandPair[key] && !this.columnIsRow(key)) {
            this._expandPair[key].domNameElem.innerHTML = this.nvpair[key].name;
        }
        if (this._collapsePair[key] && !this.columnIsIcon(key) && !this.columnIsHTML(key)) {
            this._collapsePair[key].domNameElem.innerHTML = this.nvpair[key].name;
        }
        this.resize();
    },

    changeValue: function(key, value) {
        this.nvpair[key].value = (DA.util.isEmpty(value)) ? '' : value;
        var parent, dom;
        if (this._expandPair[key] && !this.columnIsRow(key)) {
            // this._expandPair[key].domValueElem.innerHTML = this.nvpair[key].value;
            if (DA.util.isEmpty(value)) {
                parent = this._expandPair[key].domValueElem.parentNode;
                dom = document.createElement("div");
                dom.id = this._expandPair[key].domValueElem.id;
                dom.className = this._expandPair[key].domValueElem.className;
                parent.removeChild(this._expandPair[key].domValueElem);
                parent.appendChild(dom);
                this._expandPair[key].domValueElem = dom;
            } else {
                this._expandPair[key].domValueElem.innerHTML=this.nvpair[key].value;
            }
        }
        if (this._collapsePair[key] && !this.columnIsIcon(key) && !this.columnIsHTML(key)) {
            this._collapsePair[key].domValueElem.innerHTML = this.nvpair[key].value;
        }
        this.resize();
    },
    
    changeExpand: function(key, expand) {
        this.nvpair[key].expand = (DA.util.isEmpty(expand)) ? '' : expand;
        if (this._expandPair[key] && !this.columnIsRow(key)) {
            this._expandPair[key].domExpandElem.innerHTML = this.nvpair[key].expand;
            if (DA.util.isEmpty(expand)) {
                this.disableColumnExpand(key);
            } else {
                this.enableColumnExpand(key);
            }
        }
    },
        
    changeNameValue: function(key, name, value) {
        this.nvpair[key].name  = (DA.util.isEmpty(name)) ? '' : name;
        this.nvpair[key].value = (DA.util.isEmpty(value)) ? '' : value;
        if (this._expandPair[key] && !this.columnIsRow(key)) {
            this._expandPair[key].domNameElem.innerHTML  = this.nvpair[key].name;
            this._expandPair[key].domValueElem.innerHTML = this.nvpair[key].value;
        }
        if (this._collapsePair[key] && !this.columnIsIcon(key) && !this.collumnIsHTML(key)) {
            this._collapsePair[key].domNameElem.innerHTML  = this.nvpair[key].name;
            this._collapsePair[key].domValueElem.innerHTML = this.nvpair[key].value;
        }
    },

    enableColumnExpand: function(key) {
        this.nvpair[key].expandDisabled = false;
        if (this.columnExpanded(key)) {
            this._expandPair[key].domPMElem.className = "da_toggleExpand";
            this._expandPair[key].domValueElem.style.display  = "none";
            this._expandPair[key].domExpandElem.style.display = "";
        } else {
            this._expandPair[key].domPMElem.className = "da_toggleCollapse";
            this._expandPair[key].domExpandElem.style.display  = "none";
            this._expandPair[key].domValueElem.style.display   = "";
        }
    },
    
    disableColumnExpand: function(key) {
        this.nvpair[key].expandDisabled = true;
        this._expandPair[key].domPMElem.className = "da_toggleNull";
        this._expandPair[key].domExpandElem.style.display = "none";
        this._expandPair[key].domValueElem.style.display = "";
    },
    
    columnIsRow: function(key) {
        if (DA.util.isEmpty(this.nvpair[key].row)) {
            return false;
        } else {
            return true;
        }
    },
    
    columnIsIcon: function(key) {
        var o = this.nvpair[key];
        return o && !DA.util.isEmpty(o.icon);
    },
    
    columnIsHTML: function(key) {
        var o = this.nvpair[key];
        return o && !DA.util.isEmpty(o.html);
    },
    
    columnExpanded: function(key) {
        var o = this.nvpair[key];
        return o && o.expanded;
    },
    
    showColumn: function(key) {
        var tr = (this._expandPair[key]) ?  this._expandPair[key].domPairElem :
                                (this._collapsePair[key]) ? this._collapsePair[key].domPairElem : null;
        if (!tr) { return; }
        YAHOO.util.Dom.removeClass(tr, "da_nvPairHidden");
        var borderTrPre = tr.previousSibling; //tr.pre
        var borderTrNext = tr.nextSibling; // tr.next
        if (!borderTrPre && !borderTrNext) {
                return;
        }
        if (borderTrNext && borderTrNext.tagName === "TR" && borderTrNext.firstChild && YAHOO.util.Dom.hasClass(borderTrNext.firstChild, "da_nvPairBorder")) {
                borderTrNext.style.display = "";
                return;
        }
        if (borderTrPre && borderTrPre.tagName === "TR" && borderTrPre.firstChild && YAHOO.util.Dom.hasClass(borderTrPre.firstChild, "da_nvPairBorder")) {
                borderTrPre.style.display = "";
        }
},
    
    hideColumn: function(key) {
        var tr = (this._expandPair[key]) ?  this._expandPair[key].domPairElem :
                                (this._collapsePair[key]) ? this._collapsePair[key].domPairElem : null;
        if (!tr) { return; }
        YAHOO.util.Dom.addClass(tr, "da_nvPairHidden");
        var borderTrPre = tr.previousSibling; //tr.pre
        var borderTrNext = tr.nextSibling; // tr.next
        if (!borderTrPre && !borderTrNext) {
                return;
        }
        if (borderTrNext && borderTrNext.tagName === "TR" && borderTrNext.firstChild && YAHOO.util.Dom.hasClass(borderTrNext.firstChild, "da_nvPairBorder")) {
                borderTrNext.style.display = "none";
                return;
        }
        if (borderTrPre && borderTrPre.tagName === "TR" && borderTrPre.firstChild && YAHOO.util.Dom.hasClass(borderTrPre.firstChild, "da_nvPairBorder")) {
                borderTrPre.style.display = "none";
        }
    
     },
    
    collapseColumn: function(key) {
        if (!this.nvpair[key].expandDisabled) {
            this.nvpair[key].expanded = false;
            this._expandPair[key].domPMElem.className = 'da_toggleCollapse';
            this._expandPair[key].domExpandElem.style.display = "none";
            this._expandPair[key].domValueElem.style.display = "";
            this.onCollapse();
        }
    },
    
    expandColumn: function(key) {
        if (!this.nvpair[key].expandDisabled) {
            this.nvpair[key].expanded = true;
            this._expandPair[key].domPMElem.className = 'da_toggleExpand';
            this._expandPair[key].domValueElem.style.display = "none";
            this._expandPair[key].domExpandElem.style.display = "";
            this.onExpand();
        }
    },
    
    scrollSeparator: function(key, expand) {
        var el = (expand === 1) ? this._expandPair[key].domExpandElem : this._expandPair[key].domValueElem;
        if (el) {
            el.className = 'da_nvPairSeparator4scroll';
            el.style.height = '80px';
            el.id = "mail"+key+"Area";
        }
    },
    
    unscrollSeparator: function(key, expand) {
        var el = (expand === 1) ? this._expandPair[key].domExpandElem : this._expandPair[key].domValueElem;
        if (el && el.className) {
            el.className = '';
            el.style.height = '';
            el.id = '';
        }
    },
    
    /**
     * Remove a name-value pair from the widget
     * TODO: this should be improved
     * @method remove
     * @param  removeName
     */
    remove: function(removeKey /*key*/){
        delete this.nvpair[removeKey];
        var exp = this._expandPair[removeKey];
        var col = this._collapsePair[removeKey];
        if (exp) {
            exp.domPairElem.parentNode.removeChild(exp.domPairElem); //remove the tr
        }
        if (col) {
            if (this.columnIsHTML(removeKey)) {
                col.domIconElem.parentNode.removeChild(col.domHTMLElem); //remove the tr
            } else if (this.columnIsIcon(removeKey)) {
                col.domIconElem.parentNode.removeChild(col.domIconElem); //remove the tr
            } else {
                col.domNameElem.parentNode.removeChild(col.domNameElem); //remove the tr
                col.domValueElem.parentNode.removeChild(col.domValueElem); //remove the tr
            }
        }
    },
    
    enableExpand: function() {
        this.expandDisabled = false;
        if (this.expanded) {
            this.plusMinusDiv.className = 'da_toggleExpand';
            this.collapseTable.style.display = "none";
            this.expandTable.style.display = "";       
        } else {
            this.plusMinusDiv.className = 'da_toggleCollapse';
            this.collapseTable.style.display = "";
            this.expandTable.style.display = "none";
        }
    },
    
    disableExpand: function() {
        this.expandDisabled = true;
        this.plusMinusDiv.className = 'da_toggleNull';
        this.expandTable.style.display = "none";
        this.collapseTable.style.display = "";
    },

    /**
     * Collapse the widget
     * @method collapse
     */
    collapse: function(){
        if (!this.expandDisabled) {
            this.expanded = false;
            this.plusMinusDiv.className = 'da_toggleCollapse';
            this.collapseTable.style.display = "";
            this.expandTable.style.display = "none";
            this.onCollapse();
            /* In case a resize occured when the widget was in the expanded state,
             * we need to resize the collapsed mode now that it is visible
             */
            if (this._pendingResizeCollapsed) { 
                this._resizeCollapsed();
            }
        }
    },
    
    /**
     * Expand the widget
     * @method expand
     */
    expand: function(){
        if (!this.expandDisabled) {
            this.expanded = true;
            this.plusMinusDiv.className = 'da_toggleExpand';
            this.collapseTable.style.display = "none";
            this.expandTable.style.display = "";
            this.onExpand();
        }
    },
    
    /**
     * Hide the widget
     * @method hide
     */
    hide: function(){
        this.div.style.display = "none";
        this.onHide();
    },
    
    /**
     * Show the widget
     * @method show
     */
    show: function(){
        this.div.style.display = "";
        this.onShow(); 
    },
   
    /**
     * @method resize
     */
    resize: function () {
        if (this.expanded) {
            /**
             * Flag that will be set to indicate that _resizeCollapsed should be called later.
             * @property _pendingResizeCollapsed
             * @type {Boolean}
             */
            this._pendingResizeCollapsed = true;
        } else {
            this._resizeCollapsed();
        }
    },

    /**
     * @method _resizeCollapsed
     * @private
     */
    _resizeCollapsed: function() {
        var i, e = 0, d;
        this._pendingResizeCollapsed = false;

        // Find the width in pixels of the nodes NOT to be included in the resize calculation.
        for (i = 0; i < this._collapseResizeExceptNodes.length; i ++) {
            e += this._collapseResizeExceptNodes[i].offsetWidth;
        }
        // Find the width (in pixels) of to allocate for each column
        d = parseInt((this.collapseTable.offsetWidth - e - 30) / this.maxDisplayCollapsed, 10);
        d = (d < 0) ? 0 : d;
     
        /* The following code (function borrow, mapping and iterating over nodes)
         * is useful in adjusting the widths of the displayed name-value pairs
         * so that extra width (pixels) is 'donated' to the fields that require it.
         */

        // Extra pixels (more than the div's offsetWidth) accumulated here
        var extra = 0;
        /**
         * borrows n pixels from the accumulated pixels, returning the borrowed
         * amount. If the requested amount is more than what is available,
         * then the borrowed amount will be lesser than the requested amount.
         * @private
         * @param n {Number} The number of pixels needed
         * @returns {Number} The number of pixels that could be donated
         */
        function borrow (n) {
            var tmp = extra;
            extra -= n;
            if (extra >= 0) {
                return n;
            } else {
                extra = 0;
                return tmp;
            }
        }

        /* Map all the DOM elements to object literals with the keys:
         * el {HTMLDivElement},  origW {Number} number of pixels,
         * excess {Number} extra pixels available
         */
        var nodes = this._collapseResizeNodes.map( function (el) {
            el.style.width = 'auto'; // temporarily disable styles
            // Find the original width; if offsetWidth==0, that means we cannot count this
            var offsetWidth = el.offsetWidth;
            var excess = offsetWidth ? d - offsetWidth : 0;
            if (excess > 0) { // Accumulate any extra pixels
                extra += excess;
            }
            return { // return object literal
                el:     el,
                origW:  offsetWidth,
                excess: excess
            };   
        });

        /* For each HTMLDivElement (in the 'el' property of the object literals),
         * set the style width property, using any extra pixels for those elements
         * that need it.
         */
        nodes.each( function (node) {
            var newWidth = d;
            if (node.excess < 0 && extra > 0) {   // This el will be truncated. Check to see
                newWidth += borrow(-node.excess); // if we can borrow some extra pixels to avoid that.
            } else if (node.excess > 0) {         // This el has excess width; just use it's
                newWidth = node.origW;            // original width.
            }
            node.el.style.width = newWidth + 'px';
        });

    },

   
    /**
     * @property _utils
     * @private
     * @type {Object}
     */
    _utils: {
        /**
         * Function that can be used as a comparator to Array.sort.
         * @property nodePositionComparator
         * @type {Function}
         * @param l {HTMLElement}
         * @param r {HTMLElement}
         * @returns {Number} 0, 1, or -1
         */
        nodePositionComparator: BrowserDetect.browser === 'Explorer' ? 
            function (l, r) { // IE
                var comp = l.parentNode.sourceIndex - r.parentNode.sourceIndex;
                return comp > 0 ? 1 : comp < 0 ? -1 : 0;
            } :
            function (l, r) { // W3C
                var comp = l.parentNode.compareDocumentPosition(r.parentNode);
                return comp === 0 ? 0 :
                       (comp === 4) ? -1 : 1;
            }
    },


    /**
     * Set/Change the order of the displayed name-value pairs.
     *
     * FIXME: This handles only collapse-mode as of now.
     * @method reorder
     * @param newOrder {Array} of Strings
     */
    reorder: function(newOrder) {
        var order = newOrder || [];
        var collapsePairs = this._collapsePair || {};
        var ct = this.collapseTable;
        var collapseCont = ct && ct.rows && ct.rows[0] && ct.rows[0].cells[0];
        if (collapseCont && collapseCont.insertBefore) {
            order.reverse(false).each(function(key){
                var pair = collapsePairs[key];
                if (!pair) { return; }
                var pairElem = pair.domPairElem;
                if (!pairElem) { return; }
                collapseCont.insertBefore(pairElem, collapseCont.firstChild);
            });
        }
        // Re-order _collapseResizeNodes so that it follows the document order
        this._collapseResizeNodes.sort( this._utils.nodePositionComparator );
        this._hideExcessCollapsedPairs(); // show only the first 4
    },

    
    /**
     * User-settable event
     * @property onCollapse
     * @type Function
     */
    onCollapse: Prototype.emptyFunction, 
    
    /**
     * User-settable event
     * @property onExpand
     * @type Function
     */
    onExpand: Prototype.emptyFunction,
    
    /**
     * User-settable event
     * @property onHide
     * @type Function
     */
    onHide: Prototype.emptyFunction,
    
    /**
     * User-settable event
     * @property onShow
     * @type Function
     */
    onShow: Prototype.emptyFunction
};
