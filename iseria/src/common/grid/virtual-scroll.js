/* $Id: virtual-scroll.js 2362 2014-02-14 04:44:38Z ww_zhou $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/grid/virtual-scroll.js $ */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern YAHOO */ 
/*extern Prototype $H $ Event $A Insertion */
/*extern Rico */
/*extern DA */

/**
 * The virtual scroll widget is an extension of OpenRico's
 * LiveGrid, that uses JSON and is customized for DA's CGIs.
 * 
 * @module grid
 * @title Virtual Scrolling Widget
 * @requires DA, rico, prototype
 * @namespace DA.widget
 */

/**
 * Builds a ready-to-use Virtual-Scrolling LiveGrid.
 *
 * @class VirtualScrollingTable
 * @uses Rico LiveGrid DA
 * @constructor
 * @param config object
 */
DA.widget.VirtualScrollingTable = function(params) {

    var _params = {
        visibleRows:      10,   // default
        maxVisisbleRows:  20,   // default
        totalRows:        1000, // TODO: hard-coded guess
        resizableColumns: true,
        isUsingFakeTable: false,
        columns: [ { key: 'uid', name: 'uid', width: "50%" } ] // FIXME: Make this 'id', so that it is truly generic        
    };
    
    Object.extend(_params, params || {});

    this.columns = _params.columns;

    // FIXME: This is messy because makeATable has a limitation - it 
    //        skips creating a THEAD only if there are no column names.
    //        We need THEAD-less tables for LiveGrid to function well.
    var widths = _params.columns.map(function(c){
        return { width: c.width };
    });

    this.isUsingFakeTable = _params.isUsingFakeTable;

    //var table = _params.table || DA.widget.makeATable(_params.visibleRows+1, widths);
    var table = _params.table || DA.widget.makeATable(_params.maxVisisbleRows+1, widths);
    var headerTable = _params.headerTable || DA.widget.makeATable(1, widths, null, 
        [ _params.columns.pluck('name') ] ); // Array of one array (only one row)

    table.className = "da_virtualScrollingTable";
    headerTable.className = "da_virtualScrollingHeaderTable";

    table.id = table.id || "da_virtualScrollingTable_" + (new Date()).getTime();
    headerTable.id = table.id + "_header";

    this.containerElem = _params.containerElem || document.createElement('div');
    //this.containerElem.style.width = "100%";
    if (!this.containerElem.parentNode) {
        //this.containerElem.style.display = 'none';
        document.body.appendChild(this.containerElem);
    }
    
    var headerDiv = document.createElement('div');
    Object.extend(headerDiv.style, { // FIXME: hardcoding
        paddingRight    : "18px",
        marginRight     : "3px",
        backgroundColor : "#ddd"
    });
    headerDiv.appendChild(headerTable);

    this.containerElem.appendChild(headerDiv);
    this.containerElem.appendChild(table);


    // TODO: document onLoading, onLoadDone
    if ('function' === typeof _params.onLoading)  { this.onLoading =  _params.onLoading; }
    if ('function' === typeof _params.onLoadDone) { this.onLoadDone = _params.onLoadDone;  }

    this.maxVisisbleRows = _params.maxVisisbleRows;

    this.jsonIO = new DA.io.JsonIO(_params.url, _params.urlParams); // TODO: check for url!

    // DA_DEBUG_START
    this.jsonIO.method = 'get'; // We use GET, this is easier to debug in the Apache logs
    // DA_DEBUG_END

    // TODO: null checks?
    var me = this; // TODO: closure-safe?
    this.jsonIO.callback = function(response, actualArgs) {
        var start_sno = response.start_sno;
        var bufferOffset = me.processingRequest && me.processingRequest.bufferOffset ;
        if (!DA.util.isUndefined(start_sno) && !DA.util.isNull(start_sno) && start_sno !== (bufferOffset+1)) {
            me.processingRequest.bufferOffset=start_sno-1;
            me.buffer.rows.length=start_sno-2;
        }
        me.ajaxUpdate(response);
        me.scroller.updateSize();
        me.onLoadDone();
        // TODO: Need to separate onLoading into 'onLoading' and 'onWarp'?
        if (me.metaData.getTotalRows() === 0) {
            table.className = me.options.emptyClass;
        } else {
            table.className = me.options.tableClass;
        }

		if (!DA.util.isUndefined(response.select_sno)&&response.select_sno!==null) {
			this.__mboxGrid.liveGrid.scroller.moveScroll(response.select_sno);
			this.__mboxGrid._lastClickedRowMetaData.sno=response.select_sno+1;
		}
    };

    if (!this.isUsingFakeTable) {
        this.jsonIO.defaultParams.format = 'AoA';
    }

    // Before initializing the liveGrid, we need to compute a value
    // for height (in pixels) of each row in the grid.
    this._computeRowHeight();
    // This is a good time to do all CSS rul creation.
    this._setupCSS(table.id);

    // Call our original constructor (Rico.LiveGrid#initialize)
    this.initialize(
        table.id,
        _params.visibleRows,
        _params.totalRows,
        _params.url, 
        Object.extend(_params.liveGridOptions || {}, {
            prefetchBuffer:   true,
            sortAscendImg:    DA.vars.imgRdir + '/sort_asec.gif',
            sortDescendImg:   DA.vars.imgRdir + '/sort_desc.gif',
            loadingClass:     'da_virtualScrollingTableLoading',
            emptyClass:       'da_virtualScrollingTableEmpty',
            sortImageHeight:  '11px',
            sortImageWidth:   '7px',
            columns:           _params.columns.map(function(c){
                return [ c.key, true ]; // FIXME: Assuming that all keys are sortable
            }),
            optimizeTinyScroll: true // Perform row-shuffle optimization for tiny scroll distances (1-2 rows)
        })
    );

    // Apply overrides AFTER LiveGrid's member instances have been created
    if (this.isUsingFakeTable) {
        this.applyFakeTableOverrides();
    }

    var crzr;
    if (_params.resizableColumns) {
        // FIXME: hardcoding
        if (this.isUsingFakeTable) {
            // Note that the order of teh 1st 2 arguments (headerTable, table) is reversed;
            // for the MFTColumnResizer (Mirrored, Fake-Table ColumnResizer), we use the headerTable (which is
            // a real HTMLTableElement) as the resize target, and the table (which is actually the DIV of the
            // Fake-table) as the mirrored resize target.
            // This is because the resize target assumes that it is a HTMLTableElement.
            crzr = new DA.widget.MFTColumnResizer(headerTable, table, {minWidth:20}, this.columns); // Mirrored, Fake-Table Column Resizer
        } else {
            // Resize target is the LiveGrid's HTMLTableElement; and the mirrored resize target is the header TABLE
            crzr = new DA.widget.MirroredColumnResizer(table, headerTable, {minWidth:20});
        }
        // TODO: check crzr
        // FIXME: this is a hack
        YAHOO.util.Dom.getElementsByClassName("da_columnResizer", 'div' ,headerTable.rows[0]).each(function(el, i){
            if (!i) { return; } // skip the first (i==0) one; you cannot have a divider between the 0th and the 1st column
            var hndl = new DA.widget.TwoColumnResizeHandle(table, el, crzr, i-1);
        });
        // Call moveRight once just so that the header and the table (of the fake-table)
        // will have thier column widths aligned
        // TODO: can we do without having to call this?
        crzr.moveRight(0,1); // Fake-table needs this for some reason
    }


};



/*
 * A utility object which encapsulates table column resizing 
 * (usually for 2 adjacent columns).<p>
 * <p>
 * The methods moveLeft and moveRight allow the column divider to
 * be moved a few pixels left or right, thus resizing both the
 * columns.
 * @requires DA.widget.ColumnResizer
 * @base DA.widget.ColumnResizer 
 * @class MirroredColumnResizer
 * @constructor
 * @param table  {Object} HTMLTableElement (&tl;table&gt;)
 * @param table2 {Object} HTMLTableElement (&tl;table&gt;)
 *                        A second table object to resize
 *                        in sync with the first
 * @param config Hash Configuration options:
 *                     maintainPercentage: (Boolean) if true, 
 *                                         set the width in percentage 
 *                                         instead of pixels.
 *                     minWidth:           (Integer) minimum column width
 *                                         in PIXELS.
 */
DA.widget.MirroredColumnResizer = function(table, table2, config) {
    DA.widget.MirroredColumnResizer.superclass.constructor.call(this, table, config);
    this.table2 = table2;
    this._cols2 = table2.getElementsByTagName("col");
};
// Extend ColumnResizer
YAHOO.lang.extend(DA.widget.MirroredColumnResizer, DA.widget.ColumnResizer);

/**
 * @see DA.widget.ColumnResizer#setColWidthPerc
 */
DA.widget.MirroredColumnResizer.prototype.setColWidthPerc = function(w, n) {
    this._cols[n].width = this._cols2[n].width = (w + "%");
};

/**
 * @see DA.widget.ColumnResizer#setColWidth
 */
DA.widget.MirroredColumnResizer.prototype.setColWidth = function(w, n) {
    this._cols[n].width = this._cols2[n].width = (w + "px");
};

/**
 * @see DA.widget.ColumnResizer#moveRight
 */
DA.widget.MirroredColumnResizer.prototype.moveRight = function(l, pixels) {
    if (this.tableLayoutHack) { this.table2.style.tableLayout = "auto"; }
    DA.widget.MirroredColumnResizer.superclass.moveRight.call(this, l, pixels);
    if (this.tableLayoutHack) { this.table2.style.tableLayout = "fixed"; }
};



/**
 * Mirrored, Fake-Table Column Resizer.
 * <p>
 * Extension of ColumnResizer adapted to support the Fake-table hack.
 * This is similar to MirroredColumnResizer, only that the mirrored
 * table in this case is the fake-table.
 * 
 * @requires DA.widget.ColumnResizer
 * @base DA.widget.ColumnResizer 
 * @class MFTColumnResizer
 * @constructor
 * @param table    {HTMLTableElement} (&tl;table&gt;)
 * @param divtable {HTMLDivElement}   (&tl;div&gt;)
 *                        A div that looks like a simple table; It must
 *                        have rows built out of divs; and cells in each
 *                        row implemented as left-floating divs of fixed width.
 * @param config Hash Configuration options:
 *                     maintainPercentage: (Boolean) if true, 
 *                                         set the width in percentage 
 *                                         instead of pixels.
 *                     minWidth:           (Integer) minimum column width
 *                                         in PIXELS.
 * @param columns {Array} column meta-into
 */
DA.widget.MFTColumnResizer = function(table, divtable, config, columns) {
    DA.widget.MFTColumnResizer.superclass.constructor.call(this, table, config);
    this.divtable = divtable;
    this.styleSheet = document.styleSheets[0]; // TODO: what happens if we don't have
                                               //       even a single stylesheet?
    // IE uses addRule, FF/Mozilla uses the (W3C) insertRuleObject
    // See http://www.quirksmode.org/dom/w3c_css.html
    var createCSSRule = this.styleSheet.addRule ? this._createCSSRuleIE :
            this.styleSheet.insertRule ? this._createCSSRuleW3C : null; // TODO: null means error

    // Create a CSS rule for each column.
    columns.each(createCSSRule.bind(this));

    var selHash = {}; // Hash of CSS selector keys
    
    // All the rules in our current Stylesheet
    var rules = this.styleSheet.cssRules ? this.styleSheet.cssRules : // Mozilla/W3C
            this.styleSheet.rules ? this.styleSheet.rules : // IE
            []; // TODO: is this OK?

    // build the hash of all the selector keys of the rules.
    $A(rules).each(function(rule){
        selHash[rule.selectorText.toLowerCase()] = rule;
    });

    // _styles is the array of Style objects for each of the columns.
    this._styles = columns.map(function(col){
        return selHash['div.' + col.key]; // convert selector to Rule
    });

};
// Extend ColumnResizer
YAHOO.lang.extend(DA.widget.MFTColumnResizer, DA.widget.ColumnResizer);

/**
 * @see DA.widget.ColumnResizer#setColWidthPerc
 */
DA.widget.MFTColumnResizer.prototype.setColWidthPerc = function(w, n) {
    this._cols[n].width = (w + "%");
    // FIXME: testing repeatly against _styles.length
    if (n===(this._styles.length-1)) { 
        // last column is best left width-less for 
        // this._styles[n].style.width = 'auto'; // float-based table row cells
        // That did not work as we thought, is seems the main cause for Bug #915280 
        // (http://qadb.dreamarts.co.jp/cgi-bin/bug_report_detail.cgi?num=915280)
        // A better fix is to just sacrifice the the width of the last column
        // by 1%.
        this._styles[n].style.width = (w-1) + "%"; // float-based table row cells
    } else {
        this._styles[n].style.width = (w + "%"); // TODO
    }
};

/**
 * @see DA.widget.ColumnResizer#setColWidth
 */
DA.widget.MFTColumnResizer.prototype.setColWidth = function(w, n) {
    // TODO: does this need any special 'last-index' treatment like the
    //       function above?
    this._cols[n].width = this._styles[n].style.width = (w + "px"); // TODO
};

/**
 * @see DA.widget.ColumnResizer#moveRight
 */
DA.widget.MFTColumnResizer.prototype.moveRight = function(l, pixels) {
    if (this.tableLayoutHack) { this.divtable.style.tableLayout = "auto"; }
    DA.widget.MFTColumnResizer.superclass.moveRight.call(this, l, pixels);
    if (this.tableLayoutHack) { this.divtable.style.tableLayout = "fixed"; }
};

/**
 * Create the CSS rule for the given column
 * @method _createCSSRuleW3C
 * @private
 */
DA.widget.MFTColumnResizer.prototype._createCSSRuleW3C = function(column) {
    var ruleText = "div." + column.key + " { width: " + column.width + ";}";
    this.styleSheet.insertRule(ruleText, 0);
};

/**
 * Create the CSS rule for the given column
 * @method _createCSSRuleIE
 * @private
 */
DA.widget.MFTColumnResizer.prototype._createCSSRuleIE = function(column) {
    var selector = "div." + column.key;
    var rule = "width:" + column.width;
    this.styleSheet.addRule(selector, rule);

};




// TODO: formalize dependency checking scheme
if ( 'undefined' === typeof Rico || 
     'undefined' === typeof Rico.LiveGrid ||  
     'undefined' === typeof Rico.LiveGridBuffer ||
     'undefined' === typeof Rico.TableColumn) {
    // RICO not found, we cannot continue.
    throw "DEPENDENCY ERROR: RICO not found, we cannot continue";
}

// TODO: Right now, we just steal the Rico construtor and overwrite whatever
//       we like.
DA.widget.VirtualScrollingTable.prototype = Rico.LiveGrid.prototype;

/**
 * Perform run-time (constructor-time) method overriding to support
 * the Fake-table performance hack. This is called from the 
 * VirtualScrollingTable constructor to over-write selected methods of 
 * it's GridViewPort object.
 * @method applyFakeTableOverrides
 */
DA.widget.VirtualScrollingTable.prototype.applyFakeTableOverrides = function() {
 
    /*
     * Override populateRow; Fake-table leverages a pure-innerHTML hack to 
     * create the cells in each row.
     */
    this.viewPort.populateRow = function(htmlRow, row) {
        var metaData, isSelected;
        if (htmlRow) {
            metaData = row.meta;
            htmlRow.innerHTML = row.html;
            isSelected = this.liveGrid.isSelected(metaData); // Check if this row is 'selected'
            if (metaData.className) {
                htmlRow.className = 'da_rowdiv ' + metaData.className + (isSelected ? ' da_gridSelectedRow' : '');
            } else {
                htmlRow.className = 'da_rowdiv ' + (isSelected ? 'da_gridSelectedRow' : '');
            }
            htmlRow.__daGridRowMetaData = metaData;
        }
    };

    /*
     * The tiny-scroll optimization itself is slightly different: We cannot use the
     * table.rows[i].cell[j] conventions (though we created a 'fake' rows and cells array).
     * This differs from the original rotate in that it uses only DOM functions like
     * appendChild and insertChild.
     */
    this.viewPort.rotate = function(delta) {
        var tb = this.table;
        var i;
        // scroll down
        if (delta > 0) {
            for (i = 0; i < delta; ++i) {
                // shuffle the first row to the end
                tb.appendChild(tb.firstChild);
            }
        } else { // scroll up
            for (i = 0; i > delta; --i) {
                // shuffle the last to to the top
                tb.insertBefore(tb.lastChild, tb.firstChild);
            }
        }
    };
    
    this.buffer.blankRow = {
        meta: {},
        html: "&nbsp;"
    };


};


/**
 * <b>TENTATIVE METHOD </b><br/>
 * Wrapper to update the livegrid.
 * @method update
 * @param params {Object} (hash) // TODO: comments
 * @param bReset {Boolean} if TRUE, do not merge in the options; rather just overwrite
 *                         the entire hash (so that only the new keys are part of it)
 */
DA.widget.VirtualScrollingTable.prototype.update = function(params, bReset) {
    if (bReset===true) {
        this.jsonIO.defaultParams = params;
    } else {
        Object.extend(
            this.jsonIO.defaultParams, 
            params || {} // TODO: null check really needed? check with prototype
        ); 
    }
    // The following line is needed so that any code that tests the value of getTotalRows
    // will always return false. This is useful in discriminating between the condition
    // of having no rows (IO not required), versus an unknown number of rows (IO required, to find out)
    this.metaData.setTotalRows( undefined ); // we really don't know
    this.resetContents();
    this.requestContentRefresh(0);
    
};


/**
 * The currently set IO paramters that include all the parameters sent
 * to the server (like ids, sort information, etc) - This does not 
 * include the range (paging) parameters (start_sno, end_sno)
 * @method getParameters
 * @returns {Hash} 
 */
DA.widget.VirtualScrollingTable.prototype.getParameters = function () {
    return {
        sortCol: this.sortCol,
        sortDir: this.sortDir
    }.extend(this.jsonIO.defaultParams || {});
};


/**
 * Checks if the given grid instance represents the same data as 
 * this one.
 * @method isEquivalent
 * @param grid {Object} Instance of DA.widget.VirtualScrollingTable
 * @returns {Boolean}
 */
DA.widget.VirtualScrollingTable.prototype.isEquivalent = function (grid) {
    
    if (!grid) { return false; }
    if (this === grid) { return true; }

    var thatParams = grid.getParameters();
    var thisParams = this.getParameters() || {}; // NPE safe

    if (!thatParams) { return false; }

    return DA.util.areEquivObjs(thisParams, thatParams);

};

/**
 * Support for DA.session.UIState. Provides UI stat information (currently, limitted only
 * to columns, and column widths)
 * @method   getUIStateInfo
 * @returns  {Object/Hash} Hash of UI-state information
 *                         key: columns,  value: array of objects
 *                                               name (column name), width (width in pixels)
 */
DA.widget.VirtualScrollingTable.prototype.getUIStateInfo = function() {
    var htcells = this.sort.headerTable.rows[0].cells; // header table cells
    return {
        // An array of column information, each object in the array holding information
        // about the columns name, and it's width.
        columns: this.options.columns.map(function (col, index) {
            return {
                name:   col.name,
                width:  htcells[index].offsetWidth
            };
        })
    };
};

/**
 * Flag to indicate whether or not we are using the Fake-table hack.
 * The Fake-table hack yields very good scroll performance on IE.
 * @property isUsingFakeTable 
 * @type {boolean}
 */
DA.widget.VirtualScrollingTable.prototype.isUsingFakeTable = false;

/**
 * <b>TENTATIVE METHOD </b><br/>
 * Dummy method that must be overridden to actually provide a way to 
 * test whether or not a row corresponding to the given metadata is selected or not,
 * @method isSelected
 * @param metadata {Object} anything you like.
 */
DA.widget.VirtualScrollingTable.prototype.isSelected = function(metadata) {
    return false;
};

/**
 * <b>TENTATIVE METHOD </b><br/>
 * Dummy method that must be overridden to actually provide a way to 
 * clear the selection buffer (if subclasses are going to implement CTRL/SHIFT selection)
 * @method clearSelection
 * @abstract
 */
DA.widget.VirtualScrollingTable.prototype.clearSelection = function() { /*Do nothing by default*/ };

/**
 * Dynamically change the HEIGHT of the grid to pixels pixels.
 * @method resizeHeight
 * @param pixels {Int} Number of pixels to resize by.
 */
DA.widget.VirtualScrollingTable.prototype.resizeHeight = function(pixels /*number*/, redraw /*boolean*/) {
    // TODO: optimize
    var headerH = this.sort.headerTable.offsetHeight; // We need to account for the height of the header table as well
    var height = Math.max((pixels - headerH), 50);  // FIXME: hardcoding
    var vp = this.viewPort;
    var visibleRows = Math.ceil( height / vp.rowHeight );
    var inLimits = true;
    // We need to check whether a full redraw is really needed; this is the case 
    // only if both the redraw option has been explicitly passed AND
    // the number of visible rows has increased.
    var rowsIncreased = visibleRows > (vp.visibleRows - 1); // The horrid +1 hack: See rico.js, v1.1.2, line 2136
    var _redraw = redraw && rowsIncreased;
    if (visibleRows > this.maxVisisbleRows) {
        // DA_DEBUG_START
        DA.log("Reached MAX visibleRows LIMIT: " + this.maxVisisbleRows, "info", "VirtScro");
        // DA_DEBUG_END
        inLimits = false;
        this._setVisibleRows(this.maxVisisbleRows);
        height = this.maxVisisbleRows * vp.rowHeight;
    } else {
        this._setVisibleRows(visibleRows);
    }
    if (rowsIncreased) {
        vp.isPartialBlank = true;
    }
    if (_redraw) { // only redraw if there is a difference in the rows.
        vp.bufferChanged();
    }
    this._resizeHeight(height);
    return inLimits; // FIXME: No point is returning this late; seems that bufferChanged will already have barfed by now
};

/**
 * Dynamically change the height of the grid so that exactly n rows are visible.
 * @method setVisibleRows
 * @param n {Int} Number of rows to display
 * @return {Boolean} TRUE if the value could be set;
 *                   FALSE otherwise (for example, if the specified parameter
 *                   exceeds the Maximum limit for visible rows)
 */
DA.widget.VirtualScrollingTable.prototype.setVisibleRows = function(n) {
    var allowablen = this._setVisibleRows(n);
    this._resizeHeight(allowablen * this.viewPort.rowHeight);
    return (allowablen < this.maxVisisbleRows);
};

/**
 * Resize the viewport and the scrollbar's DOM heights.
 * @method _resizeHeight
 * @private
 */
DA.widget.VirtualScrollingTable.prototype._resizeHeight = function(pixels) {
    this.viewPort.div.style.height = pixels + "px"; 
    this.scroller.scrollerDiv.style.height = pixels + "px";
    this.scroller.updateSize();
};

/**
 * Dynamically change the height of the grid so that exactly n rows are visible.
 * @method _setVisibleRows
 * @param n {Int} number of rows
 * @private
 */
DA.widget.VirtualScrollingTable.prototype._setVisibleRows = function(n) {
    // TODO: optimize
    var inLimits = true;
    var allowablen = n;
    if (n > this.maxVisisbleRows) {
        // DA_DEBUG_START
        DA.log("Reached MAX visibleRows LIMIT: " + this.maxVisisbleRows, "info", "VirtScro");
        // DA_DEBUG_END
        inLimits = false;
        allowablen = this.maxVisisbleRows;
    }
    this.viewPort.visibleRows = allowablen + 1;
    this.metaData.pageSize = allowablen;
    this.buffer.maxBufferSize = this.metaData.getLargeBufferSize() * 2;
    this.buffer.maxFetchSize = this.metaData.getLargeBufferSize();

    return allowablen;
};



/**
 * Init-time setup method that dynamically computes a decent 
 * CSS row-height before applying it to the stylesheet.
 * SIDE-EFFECTS: Sets this._computedRowHeightPx
 * @private
 * @method _computeRowHeight 
 */
DA.widget.VirtualScrollingTable.prototype._computeRowHeight = function () {
    // Create a just to calculate how high it will be if it
    // contains default font-size text
    var div = document.createElement('div');
    div.style.fontColor = 'white';
    div.innerHTML = 'Sample Text';
    document.body.appendChild(div);
    // Use YUI's Region object to determine the height of the div
    var region = YAHOO.util.Dom.getRegion(div);
    this._computedRowHeightPx = (region.bottom - region.top) + 2;
    // Finally, get rid of the div.
    document.body.removeChild(div);
};


/**
 * Will stores the initially computed pixel-height of a row.
 * Default pixel-height if not specified is 16.
 * @property _computedRowHeightPx
 * @private
 */
DA.widget.VirtualScrollingTable.prototype._computedRowHeightPx = 16;

/**
 * Init-time setup method that sets up CSS rules (by inserting them into
 * the current first stylesheet). Currently the following rules are
 * dynamically created and inserted:
 *   1. the height (in pixels) of the da_rowdiv class of elements.
 * @private
 * @method _setupCSS
 */
DA.widget.VirtualScrollingTable.prototype._setupCSS = function (tableId) {
    DA.dom.createCSSRule(
        (this.isUsingFakeTable ? 
            "div#" + tableId + " div.da_rowdiv" :
            "table#" + tableId + " td"),
        ("height:" + this._computedRowHeightPx + 'px')
    );
};


/**
 * Event that is fired once when network IO has been completed.
 * @property onLoadDone
 * @type function
 * @protected
 */
DA.widget.VirtualScrollingTable.prototype.onLoadDone = Prototype.emptyFunction;

/**
 * Event that fires once as soon as we begin waiting for data
 * (network IO wait).
 * @property onLoading
 * @type function 
 * @protected
 */
DA.widget.VirtualScrollingTable.prototype.onLoading = Prototype.emptyFunction;


/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * Our very own loadRows implementation. 
 * <p>
 * @method loadRows
 * @private ? // TODO: How does one classify such methods?
 * @param obj Object an object retrieved by eval'ing the JSON response
 */
Rico.LiveGridBuffer.prototype.loadRows = function(obj) {
    var total = obj.total;
    // TODO: if total is zero, we need to make sure we blank out the grid.
    this.metaData.setTotalRows( total ? total : 0 ); // TODO: Error handling
    var ret = obj.list; // TODO: do we need to bother about anything else?
    return ret ? ret : [];
};


/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * Our very own update implementation. 
 * The original Rico implementation is flawed because: it does not
 * consider the situation where start == this.startPos; Thus when
 * the requested start position is the same as the buffer's current
 * start position (this.startPos), it incorrectly branches off to
 * the else ('//prepending') which simply leaves the current buffer
 * rows as they are.
 * <p>
 * This fix seems logical and safe, and also the most direct solution
 * to bug (QADB): 915818 http://qadb.dreamarts.co.jp/cgi-bin/bug_report_detail.cgi?num=915818
 * and maybe also 915805 http://qadb.dreamarts.co.jp/cgi-bin/bug_report_detail.cgi?num=915805
 * <p>
 * @method loadRows
 * @private ? // TODO: How does one classify such methods?
 * @param obj Object an object retrieved by eval'ing the JSON response
 */
Rico.LiveGridBuffer.prototype.update = function (ajaxResponse, start) {
    var newRows = this.loadRows(ajaxResponse);
    if (this.rows.length === 0 || start === this.startPos ) { // initial load; or reload.
        this.rows = newRows;
        this.size = this.rows.length;
        this.startPos = start;
        return;
    }
    var fullSize;
    if (start > this.startPos) { //appending
        if (this.startPos + this.rows.length < start) {
            this.rows =  newRows;
            this.startPos = start;//
        } else {
            this.rows = this.rows.concat( newRows.slice(0, newRows.length));
            if (this.rows.length > this.maxBufferSize) {
                fullSize = this.rows.length;
                this.rows = this.rows.slice(this.rows.length - this.maxBufferSize, this.rows.length);
                this.startPos = this.startPos +  (fullSize - this.rows.length);
            }
        }
    } else { //prepending
        if (start + newRows.length < this.startPos) {
            this.rows =  newRows;
        } else {
            this.rows = newRows.slice(0, this.startPos).concat(this.rows);
            if (this.rows.length > this.maxBufferSize) {
                this.rows = this.rows.slice(0, this.maxBufferSize);
            }
        }
        this.startPos =  start;
    }
    this.size = this.rows.length;
};



/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * Just glue code.
 *
 * @method initAjax
 * @private ? // TODO: How does one classify such methods?
 * @param url String the CGI to use.
 */
Rico.LiveGrid.prototype.initAjax = Prototype.emptyFunction; /* intentionally empty */


// LIBRARY MEMBER DATA OVERWRITE!
// Need to use kadowaki-san's sorting identifiers
// LIBRARY CONSTANT OVERWRITE!  We are changing Rico by doing this.
Rico.TableColumn.SORT_ASC  = "asec";
Rico.TableColumn.SORT_DESC = "desc";


/**
 * LIBRARY METHOD ADDITION!  This method is not originally a part of Rico.GridViewPort
 * @param offset {Number} A desired row number to warp/scroll to.
 * @returns {Boolean}  if TRUE, indicates that we are probablu scrolling upwards.
 */
Rico.GridViewPort.prototype.isGoingUp = function (offset) {
    return offset < this.lastRowPos;
};


/**
 * LIBRARY METHOD ADDITION!  This method is not originally a part of Rico.GridViewPort
 * @param offset {Number} A desired row number to warp/scroll to.
 * @returns {Boolean}  if TRUE, indicates that we are probablu scrolling downwards.
 */
Rico.GridViewPort.prototype.isGoingDown = function (offset) {
    return offset > this.lastRowPos;
};


/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * Most of this function is just copied from the original as it was 
 * difficult to remove it.
 * <p>
 * This hack is needed because we use our own JSON-IO instead of the
 * default Rico XML format.
 *
 * @method fetchBuffer
 * @private ? // TODO: How does one classify such methods?
 * @param offset Rico stuff. Ask them, not me... ;-)
 */
Rico.LiveGrid.prototype.fetchBuffer = function(offset) {

    var isInRange = false, isNearingTopLimit = false, isNearingBottomLimit = false;
    var bufferStartPos, fetchSize;

    if (this.buffer.isInRange(offset)) { // If we are in range
        isInRange = true;
        // And we are NOT moving closer to either the top/bottom limits
        if (this.viewPort.isGoingUp(offset)) {
            if (!this.buffer.isAtTop() && this.buffer.isNearingTopLimit(offset)) {
                isNearingTopLimit = true; // up-going IO needed
            } else {
                // DA_DEBUG_START
                DA.log("going up, no IO needed", 'info', 'VirtScro');
                // DA_DEBUG_END
                return;
            }

        } else if (this.viewPort.isGoingDown(offset)) {
            if (!this.buffer.isAtBottom() && this.buffer.isNearingBottomLimit(offset)) {
                isNearingBottomLimit = true; // down-going IO needed
            } else {
                // DA_DEBUG_START
                DA.log("going down, no IO needed", 'info', 'VirtScro');
                // DA_DEBUG_END
                return;
            }
        } else {
            // No 'scrolling' detected; no need to fetch any buffer.
            return; //
        }
    }

    if (this.processingRequest) {
        this.unprocessedRequest = new Rico.LiveGridRequest(offset);
       return;
    }
    // Hook that subclasses can override
    if (! this.isIORequired() ) {
        return;
    }

    if (!isInRange) { // simple
        bufferStartPos = this.buffer.getFetchOffset(offset);
        fetchSize      = this.buffer.getFetchSize(offset);
    } else if (isNearingBottomLimit) {
        bufferStartPos = this.buffer.getFetchOffset(offset);
        fetchSize      = this.buffer.getFetchSize(offset);
    } else if (isNearingTopLimit) {
        bufferStartPos = this.buffer.startPos - this.buffer.maxFetchSize;
        fetchSize      = this.buffer.maxFetchSize;
    } else {
        // Should never be here
        // DA_DEBUG_START
        debugger;
        // DA_DEBUG_END
        return;
    }
    
    if (bufferStartPos < 0) {
        bufferStartPos = 0;
    }
    
    if (fetchSize === 0) { // short circuit
        return;
    }
    this.processingRequest = new Rico.LiveGridRequest(offset);
    this.processingRequest.bufferOffset = bufferStartPos;   
   
    // TODO: start_sno, end_sno, sort, sort_key are all CGI-specific


    var params = {
      start_sno: (bufferStartPos + 1),          // TODO: start_sno needs to be taken out?
      end_sno: (bufferStartPos + fetchSize)     // TODO: end_sno needs to be taken out?   
    };

    if (this.sortCol) {
      params.sort_key = this.sortCol;           // TODO: sort_key needs to be taken out?   
      params.sort = this.sortDir;               // TODO: sort needs to be taken out?   
      if (!DA.util.isUndefined(this.select_uid)) {
      	  params.select_uid = this.select_uid;
      	  delete this.select_uid;
      }
    } 

    // DA_DEBUG_START
    DA.log('IO START (JSON)', 'time', 'VirtScro');
    //DA_DEBUG_END

    this.jsonIO.execute( params );
    this.timeoutHandler = setTimeout( this.handleTimedOut.bind(this), this.options.bufferTimeout);

    // Notify the world that we are loading...
    this.onLoading();

};

/**
 * Subclasses can override this to short-circuit the decision to
 * fetch data from the network.
 * @method isIORequired
 * @returns {Boolean} is TRUE, JSON-IO requests will be made; if false, they will be skipped.
 */
Rico.LiveGrid.prototype.isIORequired = function() {
    return true; // Assume that IO is always required  
};

/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * Most of this function is just copied from the original as it was 
 * difficult to remove it.
 * <p>
 * This hack is needed to create a scrollbar-div in the markup.
 * This div will be refered to (by it's ID) by LiveGridScroller#createScrollBar
 *
 * @method addLiveGridHtml
 * @private ? // TODO: How does one classify such methods?
 */
Rico.LiveGrid.prototype.addLiveGridHtml = function() {
    // Check to see if need to create a header table.
    var tableHeader;
    var i = 0;
    if (this.table.getElementsByTagName("thead").length > 0){
      // Create Table this.tableId+'_header'
      tableHeader = this.table.cloneNode(true);
      tableHeader.setAttribute('id', this.tableId+'_header');
      tableHeader.setAttribute('class', this.table.className+'_header');

      // Clean up and insert
      for( i = 0; i < tableHeader.tBodies.length; i++ ) {
          tableHeader.removeChild(tableHeader.tBodies[i]);
      }
      this.table.deleteTHead();
      this.table.parentNode.insertBefore(tableHeader,this.table);
    }

    var ins = new Insertion.Before(this.table, 
                         "<div id='"+this.tableId+"_container'>" +
                         "<div id='"+this.tableId+"_scrollerdiv' style='float:right'></div>");
    this.table.previousSibling.appendChild(this.table);
    ins = new Insertion.Before(this.table,"<div id='"+this.tableId+"_viewport'></div>");
    this.table.previousSibling.appendChild(this.table);
};

/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * Most of this function is just copied from the original as it was 
 * difficult to remove it.
 * <p>
 * This hack modifies the position of the scrollbar-div. It is different
 * from the Rico version in that it:
 * <ol>
 *   <li> Allows fluid width layouts</li>
 *   <li> Depends on a pre-existing scrollbar div </li>
 * </ol>
 * @method createScrollBar
 * @private ? // TODO: How does one classify such methods?
 */
Rico.LiveGridScroller.prototype.createScrollBar = function() {
     var visibleHeight = this.liveGrid.viewPort.visibleHeight();
     // Do not create the div; instead depend on it to be there.
     //this.scrollerDiv  = document.createElement("div");
     this.scrollerDiv  = $(this.liveGrid.tableId + "_scrollerdiv");
     var scrollerStyle = this.scrollerDiv.style;
     // TODO: CSS this
     Object.extend(scrollerStyle, {
          position    : "relative",
          'float'     : "right",
          //left        : (this.isIE ? "-6px" : "-3px"),
          left        : "-3px", // no idea why
          width       : "24px", // 24pixels works well better than 19
                                // and serves as a workaround to the
                                // problems caused by setting large font
                                // sizes in Windows. Does not affect FF.
          height      : visibleHeight + "px",
          overflow    : "auto"
     });

     // create the inner div...
     this.heightDiv = document.createElement("div");
     this.heightDiv.style.width  = "1px";

     this.heightDiv.style.height = parseInt(visibleHeight *
                       this.metaData.getTotalRows()/this.metaData.getPageSize(), 10) + "px" ;
     this.scrollerDiv.appendChild(this.heightDiv);
     this.scrollerDiv.onscroll = this.handleScroll.bindAsEventListener(this);

     var table = this.liveGrid.table;
     var eventName = this.isIE ? "mousewheel" : "DOMMouseScroll";

     var scrollHndlr = function(evt) {
         if (evt.wheelDelta>=0 || evt.detail < 0) { //wheel-up
            this.scrollerDiv.scrollTop -= (2*this.viewPort.rowHeight);
         } else {
            this.scrollerDiv.scrollTop += (2*this.viewPort.rowHeight);
         }
         this.handleScroll(false);
         Event.stop(evt);
     }.bindAsEventListener(this);

     var mouseScrollOn = false;

     this.disableMouseScroll = function () {
         if (!mouseScrollOn) { return; }
         mouseScrollOn = false;
         Event.stopObserving(table, eventName, scrollHndlr, false);
     };

     this.enableMouseScroll = function () {
         if (mouseScrollOn) { return; }
         mouseScrollOn = true;
         Event.observe(table, eventName, scrollHndlr, false);
     };

     this.enableMouseScroll();

};

/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * Most of this function is just copied from the original as it was 
 * difficult to remove it.
 * <p>
 * This hack adds the markup needed to support column resizing.
 *
 * @method addSortBehaviorToColumn
 * @private ? // TODO: How does one classify such methods?
 */
Rico.LiveGridSort.prototype.addSortBehaviorToColumn = function( n, cell ) {
    var elem; // The element that will be clicked on to activate the sort
    if ( this.options.columns[n].isSortable() ) {
        // TODO: see id these spaces ('') actually make any difference
        cell.innerHTML = '<div class="da_columnResizer">|&nbsp;</div>' + 
                         '<span>' + cell.innerHTML + '</span>' +
                         '<span id="' + this.headerTableId + '_img_' + n + '">&nbsp;&nbsp;&nbsp;</span>';
        elem = cell;
        if (elem) {
            elem.style.cursor = 'pointer';
            elem.id = this.headerTableId + '_' + n;
            Event.observe(elem, 'click', this.headerCellClicked.bindAsEventListener(this), true);
        } else {
            // DA_DEBUG_START
            DA.log('Error setting sort behavior: column:'+n, 'error','VirtScro');
            // DA_DEBUG_END
        }
    }
};

Rico.LiveGridSort.prototype.setSortImage = function(n) {
    var sortDirection = this.options.columns[n].getSortDirection();

    var sortImageSpan = $( this.headerTableId + '_img_' + n );
    if ( sortDirection === Rico.TableColumn.UNSORTED ) {
       sortImageSpan.innerHTML = '&nbsp;&nbsp;';
    } else if ( sortDirection === Rico.TableColumn.SORT_ASC ) {
       sortImageSpan.innerHTML = '<img width="'  + this.options.sortImageWidth    + '" ' +
                                 'height="'+ this.options.sortImageHeight   + '" ' +
                                 'src="'   + this.options.sortAscendImg + '"/>';
    } else if ( sortDirection === Rico.TableColumn.SORT_DESC ) {
       sortImageSpan.innerHTML = '<img width="'  + this.options.sortImageWidth    + '" ' +
                                 'height="'+ this.options.sortImageHeight   + '" ' +
                                 'src="'   + this.options.sortDescendImg + '"/>';
    }
};

/**
 * Change the title text of the given column (by it's index (starting from 0)).
 * @method setColumnTitle
 * @param n      {Int}     column index
 * @param sTitle {String}  text, or HTML text to use as the new title
 * @returns      {Boolean} TRUE if the change succeeded, FALSE otherwise.
 */
DA.widget.VirtualScrollingTable.prototype.setColumnTitle = function(n , sTitle) {
    var hTable = $(this.tableId + "_header");
    if (!hTable) { return false; }
    var row = hTable.rows ? hTable.rows[0] : undefined;
    if (!row)    { return false; }
    var cell = row.cells[n];
    if (!cell)   { return false; }
    
    if (this.options.columns[n] && this.options.columns[n].isSortable()) {
        cell.getElementsByTagName('span')[0].innerHTML = sTitle;
    } else {
        cell.innerHTML = sTitle;
    }

    return true;
};

DA.widget.VirtualScrollingTable.prototype.removeColumnSort = function() {
    var sortedColumnIndex = this.sort.getSortedColumnIndex();
    if (sortedColumnIndex !== -1) {
        this.sortCol = '';
        this.sortDir = '';
        this.sort.removeColumnSort(sortedColumnIndex);
    }
};

Rico.LiveGridSort.prototype.headerCellClicked = function(evt) {
    var eventTarget = evt.target ? evt.target : evt.srcElement;
    var cell = DA.dom.findParent(eventTarget, 'TD', 3); // FIXME: use Prototype: it has a findParent
    if (!cell) { 
        // DA_DEBUG_START
        DA.log('Failure finding TD with 3 levels of ' + eventTarget, 'error', 'VirtScro');
        // DA_DEBUG_END
        return; 
    }
    var cellId = cell.id;
    var columnNumber = parseInt(cellId.substring( cellId.lastIndexOf('_') + 1 ), 10);
    var sortedColumnIndex = this.getSortedColumnIndex();
    if ( sortedColumnIndex !== -1 ) {
        if ( sortedColumnIndex !== columnNumber ) {
           this.removeColumnSort(sortedColumnIndex);
           this.setColumnSort(columnNumber, Rico.TableColumn.SORT_DESC);
        } else {
           this.toggleColumnSort(sortedColumnIndex);
        }
    } else {
       this.setColumnSort(columnNumber, Rico.TableColumn.SORT_DESC);
    }

    if (this.options.sortHandler) {
       this.options.sortHandler(this.options.columns[columnNumber]);
    }
};


Rico.LiveGrid.prototype.sortHandler = function(column) {
    if(!column) { return ; }
    this.sortCol = column.name;
    this.sortDir = column.currentSort;
    if(this.metaData.getTotalRows()===0) { return; }
    var selected=this.getSelected();
    if (DA.util.isNull(selected.srid) && selected.count===1){
    	this.select_uid=selected.singles[0].uid;
    } else {
    	this.clearSelection();
    }
    this.resetContents();
    //this.clearSelection();
    this.requestContentRefresh(0);
};




/**
 * NEW Method Added To Rico LiveGrid
 * Just empties out the grid
 * @method clear
 */
Rico.LiveGrid.prototype.clear = function() {
    this.jsonIO.defaultParams = {};
    this.table.className = this.options.emptyClass;
};



/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * Our very own getRows implementation. 
 * <p>
 * This is needed because we need to process metadata as well,
 * and also apply CSS styles to each row.
 * @method populateRow
 * @private ? // TODO: How does one classify such methods?
 * @param htmlRow {HTMLTableRowElement} A TR element.
 * @param row     {Array} An Array whose first element is metadata,
 *                        and whose remaing elements are Strings to insert into the row's cell.
 */
Rico.GridViewPort.prototype.populateRow = function(htmlRow, row) {
    var j = 0;
    var metaData = row[0]; // The first element is not cell data, but a hash containing metadata
    var length = row.length;
    var cells = htmlRow.cells;
    var isSelected = this.liveGrid.isSelected(metaData); // Check if this row is 'selected'
    for (j=1; j < length; j++) {
        cells[j-1].innerHTML = row[j]; // j-1: The first element is metadata
    }
    if (metaData.className) {
        htmlRow.className = metaData.className + (isSelected ? ' da_gridSelectedRow' : '');
    } else {
        htmlRow.className = (isSelected ? 'da_gridSelectedRow' : '');
    }
    htmlRow.__daGridRowMetaData = metaData;
};


Rico.GridViewPort.prototype.updateSelectionStatus = function () {
    var nRows = this.visibleRows;
    var lg = this.liveGrid;
    var i;   
    var rows = this.liveGrid.isUsingFakeTable ? 
            this.table.childNodes : // Use the child nodes of the Fake-table DIV element.
            this.table.rows;        // Use the table rows.
    var htmlRow;
    var metaData;
    var yes = [];
    var no  = [];

    for (i = 0; i < nRows; ++i) {
        htmlRow = rows[i];
        if (!htmlRow) { continue; }
        metaData = htmlRow.__daGridRowMetaData;
        if (lg.isSelected(metaData)) {
            yes.push(htmlRow);
        } else {
            no.push(htmlRow);
        }
    }

    YAHOO.util.Dom.removeClass(no, "da_gridSelectedRow");
    YAHOO.util.Dom.addClass(yes, "da_gridSelectedRow");

};



Rico.GridViewPort.prototype.clearRows = function(noBlanking) {
    // TODO: This if block basically switches CSS to set the appearance
    //       for a data-less grid vs a data-waiting grid.
    //       Could the CSS switching cause the browswer to slow down?
    if (this.buffer.size === 0) {
        // no data...
        this.liveGrid.table.className = this.liveGrid.options.emptyClass;
    } else {
        // There /may/ be data, we are just warping/scrolling
        this.liveGrid.table.className = this.liveGrid.options.loadingClass;
    }

    // FIXME: I wish this could have stayed on the top. (performance)
    if (this.isBlank) {
        return;
    }

    if (noBlanking) {
        // Do nothing
        this.isBlank = true;
        return;
    } 
    var visibleRows = this.visibleRows;
    var blankRow = this.buffer.getBlankRow();
    var rows = this.table.rows;
    var i;
    for (i=0; i < visibleRows; ++i) {
        this.populateRow(rows[i], blankRow);
    }
    this.isBlank = true; 
};

/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * <p>
 * We meed a custom version of getBlankRow becaus
 * <p>
 * @method getBlankRow
 * @private ? // TODO: How does one classify such methods?
 * @returns {Array} an array of Strings (each string is '&nbsp;' which is used to blank out a single row)
 *                  Note that the first element of the Array is just a dummy meta-data object.
 */
Rico.LiveGridBuffer.prototype.getBlankRow = function() {
    var i = 0;
    if (!this.blankRow ) {
        this.blankRow = [ { /* meta-data */ } ]; 
        for ( i=0; i < this.metaData.columnCount; i++ ) {
            this.blankRow[i+1] = "&nbsp;";
        }
    }
    return this.blankRow;
};

/**
 * LIBRARY METHOD ADDITION!  This method is not originally a part of Rico.LiveGridBuffer
 * With the given functional argument, destructively remove any matching rows in the
 * buffer.
 * @param f {Function} Function that accepts a buffer row, and returns TRUE if the row must be deleted.
 * @returns {Boolean}  if TRUE, implies that 1 or more rows were removed from the buffer.
 */
Rico.LiveGridBuffer.prototype.removeIf = function(f) {
    this.rows = this.rows.reject(f);
    var changed = this.rows.length < this.size;
    this.size = this.rows.length;
    return changed;
};


/**
 * LIBRARY METHOD ADDITION!  This method is not originally a part of Rico.LiveGridBuffer
 * With the given functional argument, returns an array of matching row meta-data objects.
 * @method findRowMetaData
 * @param acceptor {Function} function that accepts a row metadata instance and
 *                            returns whether of not to accept the metadata. 
 * @returns {Array} array of row metadata objects.
 */
Rico.LiveGridBuffer.prototype.findRowMetaData = function(acceptor) {
    // FIXME: slow
    // FIXME: This works ONLY with the Fake-table optimization: the HTMLTable based
    //        VirtualScrollingTable implementation does not have a 'meta' field
    return this.rows.pluck('meta').findAll(acceptor || Prototype.emptyFunction);
};

Rico.GridViewPort.prototype.rotate = function(delta) {
    var tb = this.table.tBodies[0];
    var rows = tb.rows;
    var lastRowIndex = rows.length-1;
    var i;
    if (delta > 0) {
        for (i = 0; i < delta; ++i) {
            tb.appendChild(rows[0]);
        }
    } else {
        for (i = 0; i > delta; --i) {
            tb.insertBefore(rows[lastRowIndex], rows[0]);
        }
    }
};

/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * <p>
 * Trying to minimize the use of scrollTop
 * @method handleScroll
 * @private ? // TODO: How does one classify such methods?
 */
Rico.LiveGridScroller.prototype.handleScroll = function() {
    if ( this.scrollTimeout ) {
         clearTimeout( this.scrollTimeout );
    }

    var sdScrollTop = this.scrollerDiv.scrollTop;
    var scrollDiff = this.lastScrollPos - sdScrollTop;
    var r;
    var scrollTopMax = this.scrollerDiv.scrollHeight-this.scrollerDiv.offsetHeight;

    if (scrollDiff !== 0.00) {
       r = sdScrollTop % this.viewPort.rowHeight;
       if (r !== 0) {
          this.unplug();
          if ( scrollDiff < 0 || sdScrollTop === scrollTopMax ) {
             sdScrollTop += (this.viewPort.rowHeight-r);
          } else {
             sdScrollTop -= r;
          }
          this.scrollerDiv.scrollTop = sdScrollTop;
          sdScrollTop=this.scrollerDiv.scrollTop;
          this.plugin();
       }
    }
    var contentOffset = parseInt(sdScrollTop / this.viewPort.rowHeight, 10);
    this.liveGrid.requestContentRefresh(contentOffset);
    this.viewPort.scrollTo(sdScrollTop);

    this.scrollTimeout = setTimeout(this.scrollIdle.bind(this), 1200 );
    this.lastScrollPos = sdScrollTop;
};


/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * <p>
 * Modifying moveScroll because it would be nice if it could return
 * a value (to let us know whether the scroll position changed or not)
 * @method moveScroll
 * @param offset {Number} offset to scroll to.
 * @returns {Boolean} if TRUE, then actual scroll position was affected.
 * @private ? // TODO: How does one classify such methods?
 */
Rico.LiveGridScroller.prototype.moveScroll = function (rowOffset) {
    var scrollTop = this.rowToPixel(rowOffset);
    var changed = (scrollTop !== this.scrollerDiv.scrollTop);
    this.scrollerDiv.scrollTop = scrollTop;
    if (!changed) {
        this.viewPort.lastPixelOffset = scrollTop;
    }
    return changed;
};



   
// Overriding this because we don't see why setting the scrollTop is really needed
Rico.GridViewPort.prototype.scrollTo = function (pixelOffset) {
    if (this.lastPixelOffset === pixelOffset) {
        return;
    }
    this.refreshContents(parseInt(pixelOffset / this.rowHeight, 10));
    //this.div.scrollTop = pixelOffset % this.rowHeight;
    this.lastPixelOffset = pixelOffset;
};


/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * <p>
 * The original method seems wrong; this one is simpler, and looks right.
 * This also fixes a bug: http://qadb.dreamarts.co.jp/cgi-bin/bug_report_detail.cgi?num=914998
 * ("メール一覧で一番下のメールを表示できない場合がある" )
 * @method updateSize
 * @private ? // TODO: How does one classify such methods?
 */
Rico.LiveGridScroller.prototype.updateSize = function () {
    var rows = this.metaData.getTotalRows();
    if (rows >= 0) {
        this.heightDiv.style.height = (this.viewPort.rowHeight * rows) + "px";
    }
};

/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * <p>
 * The original method does not account for getTotalRows == 0, and results
 * in a divide-by-zero error which makes it return NaN.
 * @method rowToPixel
 * @param rowOffset {Number}
 * @return {Number} number of pixels from the top
 * @private ? // TODO: How does one classify such methods?
 */
Rico.LiveGridScroller.prototype.rowToPixel = function (rowOffset) {
    // 0th row, or nth row of 0 total rows, is 0 pixels.
    if (!rowOffset) { return 0; }
    var totalRows = this.metaData.getTotalRows();
    if (!totalRows) { return 0; } 
    return (rowOffset / totalRows) * this.heightDiv.offsetHeight;
};


Rico.GridViewPort.prototype.refreshContents = function(startPos) {
    if (startPos === this.lastRowPos && !this.isPartialBlank && !this.isBlank) {
       return;
    }
    if ((startPos + this.visibleRows < this.buffer.startPos) || 
        (this.buffer.startPos + this.buffer.size < startPos)) {
       this.clearRows(true); // true: don't do expensive blanking out
       return;
    }

    if (this.buffer.size === 0) {
        // DA_DEBUG_START
        DA.log("Zero Buffer!", "info", "VirtScro");
        // DA_DEBUG_END
        this.clearRows(true); // Expensive blanking-out
        return;
    }

    // We need to remember this and check for it before doing our
    // row-shuffling optimization
    var obligation = this.isBlank===true; 
    this.isBlank = false;
    var viewPrecedesBuffer = this.buffer.startPos > startPos;
    var contentStartPos = viewPrecedesBuffer ? this.buffer.startPos: startPos; 
    var contentEndPos = (this.buffer.startPos + this.buffer.size < startPos + this.visibleRows) ?
                               this.buffer.startPos + this.buffer.size :
                               startPos + this.visibleRows;
    var rowSize = contentEndPos - contentStartPos;
    var rows = this.buffer.getRows(contentStartPos, rowSize );
    var blankSize = this.visibleRows - rowSize;
    var blankOffset = viewPrecedesBuffer ? 0: rowSize;
    var contentOffset = viewPrecedesBuffer ? blankSize: 0;

    var i = 0; // for all the iteration we might do
    var delta = startPos - this.lastRowPos;
    var tableRows = this.liveGrid.isUsingFakeTable ? 
            this.table.childNodes : // Use the child nodes of the Fake-table DIV element.
            this.table.rows;        // Use the table rows.
    var blankRow = this.buffer.getBlankRow();
    var rowsLength = rows.length;
   
    if ((this.liveGrid.options.optimizeTinyScroll===true) && // Use the optimized 'tiny' scroll if specified, 
        (Math.abs(delta) < (this.visibleRows/2)) &&          // and Only a small number of rows need to be shuffled
        (contentOffset === 0) &&                             // and if this is a predictable, non-complex case
        !this.isPartialBlank &&                              // (no partial blank buffers and stuff like that)
        !obligation) {

        // DA_DEBUG_START
        DA.log("opt:in:"+startPos,'time','VirtScro');
        // DA_DEBUG_END

        // Optimize! Shuffle delta rows (up or down, depending on delta being +ve or -ve)
        this.rotate(delta);

        // Populate only the shuffled rows; we'll have to check if the rows we shuffled
        // uo or down.
        if (delta > 0) { 
            // [+] scroll down
            for (i=(rowsLength-delta); i<rowsLength; ++i) {
                this.populateRow(tableRows[i], rows[i]);
            }
            this.populateRow(tableRows[i], blankRow); //ISE_01002439対応
        } else {
            // [-] scroll up
            for (i=0; i<(-delta); ++i) {
                this.populateRow(tableRows[i], rows[i]);
            }
        }
        // DA_DEBUG_START 
        DA.log("opt:out:"+startPos,'time','VirtScro');
        // DA_DEBUG_END

    } else {

        // DA_DEBUG_START
        DA.log("brut:in:"+startPos,'time','VirtScro');
        // DA_DEBUG_END

        for (i=0; i < rowsLength; ++i) {//initialize what we have
          this.populateRow(tableRows[i + contentOffset], rows[i]);
        }
        for (i=0; i < blankSize; ++i) {// blank out the rest 
          this.populateRow(tableRows[i + blankOffset], blankRow);
        }

        // DA_DEBUG_START 
        DA.log("brut:out:"+startPos,'time','VirtScro');
        // DA_DEBUG_END

    }

    this.isPartialBlank = blankSize > 0;
    this.lastRowPos = startPos;
    
};


/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * <p>
 * The original method seems insufficient; It does not account for this particular case:
 * When the total number of rows is lesser than the pageSize, and we are within the buffer,
 * IO should not ne required, but the original method returns false causing IO to take place
 * (See http://qadb.dreamarts.co.jp/cgi-bin/bug_report_detail.cgi?num=914573
 *  メール数が少ない場合、ホイールスクロールすると常にサーバにアクセスする )
 * @method isInRange
 * @param position {Number} offset position 
 * @returns {Boolean} if TRUE, then then the given position is within the buffer's range
 * @private ? // TODO: How does one classify such methods?
 */
Rico.LiveGridBuffer.prototype.isInRange = function (position) {

    // Check if the desired position falls within (after) the start of the buffer
    if (position < this.startPos) { 
        return false;
    }

    // So the start check is OK; no check if the desired position falls
    // before the end of the buffer
     
    var pageSize = this.metaData.getPageSize();
    var endPos   = this.endPos();

    // Assuming that the total number of rows is more than the page size,
    if (position + pageSize <= endPos) {  
        return true;
    }

    // If we are here, either
    //   (a) We are outside the buffer - not in range
    //   (b) The total number of rows is less than the pageSize

    var totalRows = this.metaData.getTotalRows();

    if (totalRows < pageSize) {
        return position + totalRows <= endPos;
    }

    // We now know that (b) is false, so (a) is true. we are outside the range
    return false;
    
};



/**
 * LIBRARY METHOD ADDITION!  This method is not originally a part of Rico.GridViewPort
 * Provides the current position of the viewport, expressed as a range
 * (of start, end) 
 * NOTE: indexed from 0, not 1
 * @method getRange
 * @returns {Hash} Hash/Object literal with keys start, end
 */
Rico.GridViewPort.prototype.getRange = function() {
    var start = this.lastRowPos;
    var end = parseInt(this.visibleHeight() / this.rowHeight, 10) + start -1;
    return {  
        start:  start,
        end:    end
    };
};

