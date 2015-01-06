/* $Id: io.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://yuki.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/io/io.js $ */
/*for JSLINT undef checks*/
/*extern $ $$ DA YAHOO Prototype $A $R Element BrowserDetect */
/*
Copyright (c) 2008, DreamArts. All rights reserved.
*/
if (typeof(window.DA) === 'undefined') {
    throw "error: No DA!";
}

if (typeof(DA.rssreader) === 'undefined') {
    throw "error: No DA.rssreader!";
}

// Explicit checks for Prototype, Version 1.6 and above.
if (!Prototype || !Prototype.Version || 
    parseFloat(Prototype.Version, 10) < 1.6 ) {
    throw "error: Prototype.js Version 1.6 or above needed.";
}

DA.rssreader.PortletEvents = {
    onUpdate: new YAHOO.util.CustomEvent('onUpdate')
};



// (function () {

var ENV = {
    messages: {
        feedName:   'Feed',
        title:      'Title',
        dateTime:   'Updated'
    },
    imagesDir: '/images/',
    iconDir: '/images/',
    iconExt: 'gif',
    portletSettings: {
        rowsPerPage:        10,
        clipTitleChars:     0, 
        clipFeedNameChars:  0,
        showDateTime:       true,
        columnOrder: ['feed', 'title', 'date']
    }
};

var Ylang = YAHOO.lang;
var YDOM  = YAHOO.util.Dom;
var YEvent = YAHOO.util.Event;


/**
 * @constructor
 * @class Portlet
 */
DA.rssreader.Portlet = function (params) {
    if (!params || !params.container) {
        throw "bad constructor args to DA.rssreader.Portlet";
    }
    if (Ylang.isObject(params.settings)) {
        this.settings = params.settings;
    }
    this._elemContainer = params.container;
    this._elemStatusBar = document.createElement('div');
    this._elemContainer.appendChild(this._elemStatusBar);
    this._elemStatusBar.style.display = 'none';

    this._pager = new DA.rssreader.Pager({
        pageSize: ENV.portletSettings.rowsPerPage
    });

    this._mkGetNamedCells();

    // make a table
    this._elTable = this._createTable();

    this._elemContainer.appendChild(this._elTable);
    
    // Attach sort-handlers
    this._setupSortControls();

    this._pagerUI = new DA.rssreader.PagerUI(this._pager);

    this._elemContainer.appendChild(this._pagerUI.container);
    // using Prototype's Element.select for this
    this._elemLoading = Element.select(this._elemContainer, 'div.loading').first();
    this._elemFatalErr = Element.select(this._elemContainer, 'div.fatal').first();
    // TODO: what if no DIV element matching 'div.loading' was found?
    //       we need to do some checking then

    // setup put subscribers.
    this._setupSubscribers();

    // A single click event listener for the entire table body::
    YEvent.on(
        this._elTable.tBodies[0],
        'click',
        this._handleTableClick,
        this,
        true
    );

};

DA.rssreader.Portlet.prototype = {
    
    update: function (oParams) {
        window.setTimeout(this._hideStatus.bind(this), 4000);
        /*
         * This is a hack. We wait for 3.5 seconds before updating,
         * because we know that only the add_feed popup calls this
         * update, and some time is needed between feed addition and
         * successful parsing
         */
        var pager = this._pager;
        window.setTimeout(
            function () {
                pager.update({});
            }, 3500);
    },

    start: function (oParams) {
        this._pager.update( oParams );
    },

    _showStatus: function (sMsg) {
        this._elemStatusBar.innerHTML = sMsg;
        this._elemStatusBar.style.display = 'block';
		// this._elemStatusBar.className = 'footer';
    },

    _hideStatus: function () {
        this._elemStatusBar.style.display = 'none';
    },

    _setupSubscribers: function () {
        var E = DA.rssreader.PortletEvents; // TODO NPE checks?
        E.onUpdate.subscribe(this.update, this, true);

        this._pager.evtContentsUpdated.subscribe(
            this._handleContentsUpdated,
            this,
            true
        );
        
        this._pager.evtLoading.subscribe(
            this._handleLoadingUI,
            this,
            true
        );

        this._pager.evtCacheConnError.subscribe(
            function (sEvtName, oErr) {
                this._elTable.hide();
                Element.hide( this._elemLoading );
                // FIXME: NLS
                // TODO: cleanup
                Element.show( this._elemFatalErr );
            },
            this,
            true
        );

    },

    
    /**
     * @private
     * @property _handleTableClick
     * @type {Function} - DOM event handler/delegator
     * @param evt {Object} Javascript event
     */
    _handleTableClick: function (evt) {
        // What was actually clicked?
        var elTarget = $( YEvent.getTarget(evt) );  // lets just stick to 
                                                    // Prototype's extended 
                                                    // DOM objects
        var ret;
        // Simple event delegation based on CSS selectors
        if ( elTarget.match('span.plus-minus') ) {
            ret = this._handlePlusMinusClicked(elTarget);
        } else if (elTarget.match('img.rss-icon')) {
            ret = this._handleRSSIconClicked(elTarget);
        } else {
            // we don't care
            return true; // TODO: Is this OK?
        }

        YEvent.stopEvent(evt);
        return ret;
    },


    /**
     * Delegated by _handleTableClick, when the [+]/[-] 
     * description expanders are clicked.
     * @private
     * @method _handlePlusMinusClicked
     * @param elTarget {HTMLElement} most typically is TD/TR
     *                               which should contain a
     *                               a SPAN with a 'plus-minus'
     *                               className, and a DIV
     *                               with a 'description' class
     */
    _handlePlusMinusClicked: function (elTarget) {
        // Hunt down the DIV where the description lies...
        var div = elTarget.up('td').down('div.description');
    
        if (!div) {
            // DA_DEBUG_START
            debugger;
            // DA_DEBUG_END
            return false;
        }

        if (elTarget.match('span.plus')) {
            div.show();
            YDOM.replaceClass(elTarget, 'plus', 'minus');
        } else if (elTarget.match('span.minus')) {
            div.hide();
            YDOM.replaceClass(elTarget, 'minus', 'plus');
        } else {
            // nothing to do! This headline probably
            // does not have a description
        }

        return false;

    },

    
    /**
     * Delegated by _handleTableClick, when the RSS icon
     * next to the feed name is clicked.
     * @private
     * @method _handleRSSIconClicked
     * @param elTarget {HTMLElement} most typically a TD/TR
     *                               which contains an IMG
     *                               with classname 'rss-icon'
     */
    _handleRSSIconClicked: function (elTarget) {
        this._pager.updateCurrentPage();
    },


    /**
     * @private
     * @property _handleLoadingUI
     * @type {Function} (YUI CustomEvent subscriber)
     * @param sEvtName  {String} Ought to be evtLoading
     * @param aArgs     {Array}  Expected to contain at least one element,
     *                           an object/hash of pager arguments.
     */
    _handleLoadingUI: function (sEvtName, aArgs) {
        Element.show( this._elemLoading );
    },


    /**
     * A hash where we store miscellaneous debugging/benchmarking info
     * @private
     * @property _debugInfo
     * @type {Hash|Object}
     */
    _debugInfo: {},


    /**
     * Subscriber for DA.rssreader.Pager custom event evtContentsUpdated
     * @private
     * @method _handleContentsUpdated
     * @params name {String} Ought to be 'evtContentsUpdated'
     * @params args {Array}  Contains at least one element,
     *                       an array of headlines.
     */
    _handleContentsUpdated: function (name, args) {
        // This is a performance-critical section: We expect it to be
        // quite slow. So we'll just gather some benchmarking info.
        // BENCHMARKING_CODE_START
        var startTime = (new Date()).getTime();
        // BENCHMARKING_CODE_END

        var headlines = args[0];
        // TODO: NPE / sanity checks needed for headlines?
        var nHeadlines = headlines.length;
        /**
         * Cache the value of the number of visible rows; this is equal to
         * the number of items being rendered on this page
         * @property visibleRows
         * @type Number
         */
        this.visibleRows = nHeadlines;
        // We need to make sure our table is large enough to accomodate
        // all the headlines.
        this._growTable(nHeadlines);
        var tbody = this._elTable.tBodies[0];
        var i = 0;
        for (i = 0; i < nHeadlines; ++i) {
            this._populateRow(tbody.rows[i], headlines[i]);
        }
        setTimeout(
            function () {
                this._hideUnusedTRs(tbody.rows, nHeadlines);
            }.bind(this), 100);

        // update the 'current approximate time'
        this._approxCurrTime = new Date();
        // Merge contiguous cells
        // (or, at least, the congiguous cells in the first column...)
        var mergeCellDelay = Prototype.Browser.IE ? 0 : 200;
        // We know that so far only IE can handle a _mergeCells
        // (mergining contiguous cell into a single rowspan)
        // directly without a timout
        setTimeout(this._mergeCells.bind(this), mergeCellDelay);
        Element.hide( this._elemLoading );
        // BENCHMARKING_CODE_START
        var timeDiff = (new Date()).getTime() - startTime;
        this._debugInfo.tableRenderingTime = timeDiff;
        // BENCHMARKING_CODE_END
        
    },

    
    /**
     * Workaround for the word-breaking for non-IE browsers; IE supports
     * the "work-break" CSS property; FF (and other browsers) do not (yet).
     * This is based on PPK's advice: 
     * http://www.quirksmode.org/oddsandends/wbr.html
     *
     * @private
     * @method _embedWBR
     * @param str {String}
     * @return {String} a copy of the original string but with embedded <WBR/> tags
     */
    _embedWBR: function (str) {

        str = str.replace(/&lt;/g,"<");
        str = str.replace(/&gt;/g,">");
        str = str.replace(/&quot;/g,"\"");
        str = str.replace(/&amp;/g,"&"); 
        var buf = []; 
        var start=0; 
        var piece; 
        while ((piece = str.substr(start,4))) { 
            start+=4; 
            buf.push(piece); 
        } 
        return buf.join("<wbr />"); 
    },


    /**
     * @private
     * @method _formatTitle
     * @param oHl {Object} Headline object, as returned from the server via 
     *            JSON-RPC (DA::RSS::Remote::Portlet::get_aggregated_headlines)
     * @return {String} Markup for use with innerHTML
     */
    _formatTitle: function (oHl) {
        var headline = oHl.headline || "";
        var clip = this.settings.clipTitleChars;
        var length = headline.length;
        if (clip > 0) {
            headline = headline.substr(0, clip);
            if (headline.length < length) {
                headline += '...';
            }
        }
        return [
            // The title is rendered as a link that opens the headline's
            // permalink in a new window
            '<img style="float:left;" src="', ENV.iconDir,
                (oHl._isRecent ? 'ico_rss_itemnew.'+ENV.iconExt : 'ico_rss_item.'+ENV.iconExt),
                '"/> ',
            (oHl.description && oHl.description !="undefined" ?  // Add the plus-minus icon ONLY when there 
                                // is a description available.
                '<span class="plus-minus plus">&nbsp;</span>' : ''),
            '<a href="', oHl.url, '" ',
                (oHl._isRecent ? 'class="recent" ' : ""),
                'target="_blank">',
                headline, 
            '</a>',
            // The description is tucked away as a hidden div.
            '<div class="description" style="display:none;">',
            oHl.description,
            '</div>'
        ].join("");
    },


    _mkGetNamedCells: function () {
        var me = this;
        var colOrderMap = {};
        var columnOrder = this.settings.showDateTime ?
                this.settings.columnOrder :
                this.settings.columnOrder.without('date');
        columnOrder.each(
            function (col, index) {
                colOrderMap[col] = index;
            }
        );
        this._getNamedCells = function (elRow) {
            var cells = elRow.cells;
            return {
                feed:   cells[colOrderMap.feed],
                title:  cells[colOrderMap.title],
                date:   cells[colOrderMap.date]
            };
        };
        this._colSortComparator = function (c1, c2) {
              var lkey = c1.key;
              var rkey = c2.key;
              var lpos = colOrderMap[lkey];
              var rpos = colOrderMap[rkey];
              return (lpos > rpos) ? 1 : -1;
        };
        this._columnOrderMap = colOrderMap;
        
    },

    _populateRow: function (row, headline) {
        var cells = this._getNamedCells(row);
        // Need to convert the timestamp in ms to a JS Date object
        var d = new Date();
        d.setTime( headline.hires_timestamp * 1000 );
        headline._isRecent = this._isRecent(d);
        /* FEED NAME
         * We need to set the feed (feed name) column's HTML (an RSS icon and 
         * the feed name will do) and also give it a '_feedId' attribute 
         * that can be used to identify it.
         */
        cells.feed.innerHTML = this._formatFeedName(headline);
        cells.feed.setAttribute('_feedId', headline.feed_id);
        // The title formatting contains HTML for various things...
        cells.title.innerHTML = this._formatTitle(headline);
        if (cells.date) {
            cells.date.innerHTML = this._formatDate(d);
        }
        // un-hide if it was hidden
        Element.show(row); 
    }, 

    
    /**
     * @private
     * @method _formatFeedName
     * @param oHl {Object} Headline object, as returned from the server via 
     *            JSON-RPC (DA::RSS::Remote::Portlet::get_aggregated_headlines)
     * @return {String} HTML for the 'feed name' column
     */
    _formatFeedName: function (oHl) {
        var feedName = (oHl.feed_name || "");
        var length = feedName.length;
        var clip = this.settings.clipFeedNameChars;
        var icon = ENV.iconDir + 'ico_rss.' + ENV.iconExt;
        if (clip > 0) {
            feedName = feedName.substr(0, clip);
            if (feedName.length < length) {
                feedName += '..';
            }
        }
        var sb = [
            // FIXME: hard-coded image path OK?
            // FIXME: non-CSS! (align="absmiddle")
            '<img class="rss-icon" align="absmiddle" ', 
                'src="', icon, '" ',
                'title="', (oHl.feed_title || feedName) , '" ',
            '/> '
        ];
        //if (!Prototype.Browser.IE) {
        //    feedName = this._embedWBR(feedName);
        //}
        if (oHl.feed_link) {
            // Create a hyperlink
            sb.push('<a target="_blank" href="');
            sb.push(oHl.feed_link);
            sb.push('">');
            sb.push(feedName);
            sb.push('</a>');
        } else {
            // just text
            sb.push(feedName);
        }

        return sb.join("");
    },


    /**
     * A date formatter. Taked a JS Date object and returns 
     * a string representation of the date.
     * NOTE: Uses a lot or Prototype's toPaddedString().
     * @private
     * @property _formatDate
     * @type {Function}
     * @params oDate {Date} 
     * @return {String} formatted date/time
     */
    _formatDate: function (oDate) {
        if(this._isRecent(oDate)){
                if(this._isRecent(oDate) === 1){
                        return (oDate.getHours().toPaddedString(2) + ':' +oDate.getMinutes().toPaddedString(2));
                } else{
                        return (oDate.getFullYear() + '/' + (oDate.getMonth() + 1).toPaddedString(2) + '/' + oDate.getDate().toPaddedString(2)) ;
                }
        }else{
                return (oDate.getFullYear() + '/' + (oDate.getMonth() + 1).toPaddedString(2) + '/' + oDate.getDate().toPaddedString(2)) ;
         }

    },


    _isRecent: function (oDate) {
        var age = this._approxCurrTime - oDate;
        if((age > this._formatAsDateThresh)){
                return 0;
        } else if(age < this._formatAsDateThresh){
                if(this._approxCurrTime.getDate() === oDate.getDate()){
                        return 1;
                } else{
                        return 2; //the feed for the furture
                }
        }

    },


    settings: ENV.portletSettings,
    
    /**
     * The Approximate current time
     * This is updated usually whenever data arrived from the server.
     * We prefer to just use this value rather than always computing the
     * current time (using new Date()) for performance reasons.
     * @property _approxCurrTime
     * @private
     * @type {Date}
     */
    _approxCurrTime: new Date(),


    /**
     * Threshhold value, in Milliseconds, that indicates 
     * when to format as a time (HH:MM) and when to format
     * as a date (YYYY/MM/DD)
     * @private
     * @property _formatAsDateThresh
     * @type {Number}
     */
    _formatAsDateThresh: ( 
        24 *    /*hours*/ 
        3600 *  /*secs per hour*/ 
        1000    /*ms*/ ),


    /**
     * Returns a simple DOM object of an HTML Table element,
     * with 3 columns and a header.
     * FIXME: a lot of hardcoding here
     * @private
     * @method _createTable
     * @return {HTMLTableElement}
     */
    _createTable: function () {
        var showDateTime = ENV.portletSettings.showDateTime;
        var aColDefns = [
            { key: 'feed', 
              info: { name: this._makeColumnHeaderHTML('feed', ENV.messages.feedName), 
                      width: "88px" } },
            { key: 'title',
              info : { name: this._makeColumnHeaderHTML('title', ENV.messages.title),
                       width: (showDateTime ? "74%" : "87%") } }
        ];
        if (showDateTime) {
            aColDefns.push({
                key: 'date',
                info: { name:   this._makeColumnHeaderHTML('date', ENV.messages.dateTime),
                        width:  "72px" }
            });
        }

        aColDefns.sort(this._colSortComparator);

        var table = DA.widget.makeATable(
            this._pager.pageSize,
            // FIXME: NLS
            aColDefns.pluck('info'),
            { table: "rssreader-headline-table" }
        );
        // Set up some Prototype magic: 
        // http://www.prototypejs.org/learn/extensions
        Element.extend(table);
        return table;
    },


    /**
     * Grow the table by adding new rows to it
     * @private
     * @method _growTable
     * @param nRows {Number} the total number of rows we want the table to be
     */
    _growTable: function (nRows) {
        var table = this._elTable;
        var elParent = table.parentNode;
        // Off-screen DOM manipulation is fastest.
        Element.hide(table);
        var tBody = table.tBodies[0];
        var emptyRow = document.createElement('tr');
        emptyRow.appendChild(document.createElement('td'));
        emptyRow.appendChild(document.createElement('td'));
        if (ENV.portletSettings.showDateTime) {
            emptyRow.appendChild(document.createElement('td'));
        }
        var nExistingRows = tBody.rows.length;
        // We don't need to bother with *shrinking* the table
        var nNewRows = Math.max((nRows - nExistingRows), 0);
        (nNewRows).times(function (n) {
            var newRow = emptyRow.cloneNode(true);
            newRow.style.display = 'none';
            newRow.className = ((nExistingRows + n) % 2) ? 'even' : 'odd';
            tBody.appendChild(newRow);
        });
        Element.show(table);
        
    },


    _makeColumnHeaderHTML: function (sKey, sName) {
        return '<a href="#" class="click-to-sort" _key="' +sKey+ '">' +sName+ 
                '</a>' +
                // Note the '&nbsp': this is needed because according to W3C,
                // an inline element '<span>' will not show up without contents.
                // If we were *floating* it, then it's not a 'proper' inline
                // element and then it somehow shows up, but since we're not 
                // floating it, the '&nbsp;' is needed.
                '<span class="sort-indicator">&nbsp;</span>';
    },


    /**
     * SIDE-EFFECTS: (1) Adds event listeners to <A HREF='..'> elements
     *                   in the table's column headers (TH)
     *               (2) Subscribes the sort indicators (the images that
     *                   appear on the column head of sorted columns 
     *                   showing ascending/descending order)
     * @private 
     * @method _setupSortControls
     */
    _setupSortControls: function () {
        if (!this._elTable || !this._elTable.tHead || !this._pager) {
            // DA_DEBUG_START
            DA.log('No TABLE! / No Pager!', 'error', 'RSSReaderPortlet');
            debugger;   // This is an exceptional condition, one that we
                        // will attend to only in debug mode.
            // DA_DEBUG_END
            return;
        }
        var pager = this._pager;
        /* 
         * For each TH element (probably 3), we 
         *   1) Hunt down the title link
         *   2) Attach an onclick event handler to it
         *   3) Hunt down the sort-direction indicator
         *   4) Subscribe it to the evtSorted CustomEvent
         *      So that it knows when to change!
         */
        this._elTable.select('thead th').each(
            function (th) {
                // The title link, which the use clicks on
                var link = th.down('a.click-to-sort');
                // information about the sort key is tucked away in a '_key' attrib
                var key  = link.getAttribute('_key');
                // SPAN element that shows the sort direction (asc or desc)
                var indicator = th.down('span.sort-indicator');
                // Add an onclick handler only to the link
                YEvent.on( link, 'click', function (evt) {
                    var dir = (pager.args.sort_by === key) ?
                            // Flip the direction,
                            (pager.args.sort_dir === 'asc' ? 'desc' : 'asc') :
                            // ...Or stick with the same direction.
                            pager.args.sort_dir;
                    // GO!
                    // Calling update has the effect of resetting the page to
                    // the first page.
                    pager.update({
                        sort_by:    key,
                        sort_dir:   dir
                    });
                    // We're done here.
                    YEvent.stopEvent(evt);
                });
                // And now, specify what happens to the indicator after
                // the sort succeeded.
                pager.evtSorted.subscribe( 
                    /**
                     * Handler/Subscriber for DA.rssreader.Pager's
                     * CustomEvent evtSorted.
                     * @param sName {String} Ought to be
                     * @param aArgs {Array} whose first element is
                     *                      an object literal/hash
                     *                      which contains keys:
                     *                        - by:  sort key
                     *                        - dir: sort direction
                     */         
                    function (sName, aArgs) {
                        var oSortInfo = aArgs[0];
                        // First forget everything.
                        indicator.removeClassName('asc').
                                removeClassName('desc');
                        if (oSortInfo.by === key) {
                            // This is us!
                            // 'dir' is either 'asc' or 'desc'.
                            indicator.addClassName(oSortInfo.dir);
                        }
                    }
                );
                // OK, we've setup both an onclick handler that 
                // tells the pager to update with new sort options,
                // and we've also setup a subscriber for the evtSorted
                // custom event which lets the sort indicators know
                // how to show the status of the sort (asc, desc).
            }
        ); // End the TH iteration

    },

    

    /**
     * In case the results to be displayed for the given page
     * are lesser than the available table rows (TR elements),
     * the unused rows will be simply hidden from view using
     * CSS.
     * @private
     * @method _hideUnusedTRs
     * @param rows  {HTMLCollection} of HTMLTableRowElement objects.
     * @param nUsed {Number} the number of used rows.
     */
    _hideUnusedTRs: function (rows, nUsed) {
        var totalTRs = rows.length;
        var i; // iterate rows
        var row; // the current row during the iteration
        for (i = nUsed; i < totalTRs; ++i) {
            row = rows[i];
            if (!row) { 
                // DA_DEBUG_START
                debugger;
                // DA_DEBUG_END
                break; 
            }
            Element.hide(row);
        } 
    },


    /**
     * The cells in the column that will be subject to 
     * merging if they are contiguous.
     * It is an array of HTMLTableCellElements, most typically
     * of that column which needs to be merged, if their
     * contents are the same.
     * @private
     * @property
     * @type {Array}
     */
    _mergeableCells: undefined,


    /**
     * SIDE-EFFECTS:
     *   (1) Affects the DOM, namely the feedName column's 
     *       TD (HTMLTableCellElement) elements, by using
     *       a combination of rowspan and 'display:none;'
     *       to merge contiguous cells (of the same value).
     *   (2) lazily initializes the private array of cells
     *       in the first column, _mergeableCells
     * TODO: The key for the merge identifier is currently hardcoded
     *       as '_feedId'
     * @private
     * @method _mergeCells
     */
    _mergeCells: function () {

        // This is a performance-critical section: We expect it to be
        // quite slow. So we'll just gather some benchmarking info.
        // BENCHMARKING_CODE_START
        var startTime = (new Date()).getTime();
        // BENCHMARKING_CODE_END

        var feedNameCol = this._columnOrderMap.feed;
        // Lazy initialization
        if (!this._mergeableCells) {
            this._mergeableCells = $A(this._elTable.tBodies[0].rows).map(
                function (row) {
                    return row.cells[feedNameCol];
                }
            );
        }
        /*
         * Tricky code:
         * Traverse the list of cells (HTMLTableCellElement, or TD elements)
         * in the mergeable column, dividing up the list into lists
         * of contiguous cells.
         *   To Illustrate:
         *      [a,a,a,b,b,a,c,c,c,b] -> [ [a,a,a], [b,b], [a], [c,c,c], [b] ]
         */
        var lastKey;    // Keep track of the previous rows's cell value
        var contiguous = []; // the first (contiguous) sequence;
        var arrays = []; // an array of arrays
        this._mergeableCells.slice(0, this.visibleRows).each(function(cell) {
            var key = cell.getAttribute('_feedId'); // FIXME: hadcoding
            if (key !== lastKey) {
                // different this time;
                // use a new array
                contiguous = []; // new Array()
                arrays.push(contiguous);
                lastKey = key;
            }
            contiguous.push(cell);
        });

        // FIXME: no need to create this func each time, no?
        var fHideTD = function (td) {
            td.rowSpan = 1;
            td.style.display = 'none';
        };
        
        /* 
         * For each contiguous array of TD's,
         *   (1) set the rowspan of the top
         *       cell to span the rest
         *   (2) hide the rest of (displaced) tds.
         */
	var ix = 0;
        arrays.each(
            function (aContiguous) {
                var length = aContiguous.length;
                var first = aContiguous.shift();
                aContiguous.each(fHideTD);
                first.style.display = "";
                first.rowSpan = length;
                                first.style.background=(ix % 2) ? "#FFFFFF" : "#EEEEEE";
                                ix++;
            }
        );

        // BENCHMARKING_CODE_START
        var timeDiff = (new Date()).getTime() - startTime;
        this._debugInfo.mergeCellTime = timeDiff;
        // BENCHMARKING_CODE_END
    }

   
};

DA.rssreader.Pager = function (oParams) {
    if (!oParams) { oParams = {}; }
    if (!Ylang.isObject(oParams)) {
        throw "Bad params to DA.rssreader.Pager.";
    }
    this.args = {};
    Object.extend(this, oParams);

    this._setupJSONRPC();
    this._setupCustomEvents();
};

DA.rssreader.Pager.prototype = {
    /**
     * Number of items/rows/things per page?
     * @property pageSize
     * @type {Number}
     */
    pageSize: 10,

    /**
     * The starting page (indexed from 1 as the first)
     * @property startPage
     * @type {Number}
     */
    startPage:  1,

    /**
     * Where are we now?
     * @property currentPage
     * @type {Number}
     */
    currentPage: 1,

    /**
     *
     * Side-effects: evtLoading is fired right after sending off an 
     *               AJAX (JSON-RPC) request for data.
     * Side-effects: might eventually trigger the following events:
     *   (1) evtPageCountChanged    if the total number of pages changed
     *   (2) evtContentsUpdated     When new data is available
     * @method pageTo
     * @param nPage {Number} Which page to move to?
     */
    pageTo: function (nPage) {
        this.currentPage = Math.max(nPage, 1);
        var start = 0;  // This (the default start-end) combination
        var end = -1;   // implies the WHOLE data set.
        if (this.pageSize) {
            start = (this.currentPage - 1) * this.pageSize;
            end   = start + (this.pageSize - 1);
        }
        var argsThisTime = Object.extend({}, this.args);
        argsThisTime.start = start;
        argsThisTime.end   = end;
        this._remoteProcedure(argsThisTime);
        this.evtLoading.fire(argsThisTime);
    },

    pageToNext: function () {
        this.pageTo(this.currentPage + 1);
    },

    pageToPrev: function () {
        this.pageTo(this.currentPage - 1);
    },

    update: function (oArgs) {
        if (!oArgs) { oArgs = {}; }
        if (!Ylang.isObject(oArgs)) { throw "Bad args to Pager.update."; }
        Object.extend(this.args, oArgs);
        this.pageTo(1);
    },

    updateCurrentPage: function () {
        this.pageTo(this.currentPage);
    },

    args: {},

    _setupJSONRPC: function () {
        this._remoteProcedure = DA.RPC.JSON.makeRPC(
            '/jsonrpc?return_die_message=1',
            'DA.RSS.Remote.Portlet.get_aggregated_headlines',
            this,
            this.args,
            {
                success: this._handleIncomingData,
                failure: this._handleRPCFailure,
                error:   this._handleRPCError
            }
        );
    },

    /**
     * @property totalPages
     * @type {Number}
     */
    totalPages: 0,

    _handleIncomingData: function (oResponse) {
        var pagedList = Ylang.isArray(oResponse.paged) ?
                oResponse.paged : [];
        this._currentBuffer = pagedList;
        var total = parseInt(oResponse.total, 10);

        var totalPages = 1;

        if (this.pageSize) {
            totalPages = Math.ceil(total/this.pageSize);
        }

        if (this.totalPages !== totalPages) {
            this.totalPages = totalPages;
            this.evtPageCountChanged.fire(this.totalPages);
        }
        this.evtContentsUpdated.fire(pagedList);
        this.evtPageChanged.fire(this.currentPage);
        // FIXME: We need a better way of detecting when to fire
        //        the evtSorted CustomEvent.
        //        Ideally, we want to fire this only when the 
        //        sort direction/key has changed.
        if (oResponse.sorted) {
            // Let's update our state.
            this.args.sort_by  = oResponse.sorted.by;
            this.args.sort_dir = oResponse.sorted.dir;
            // ... and only then fire our event.
            this.evtSorted.fire(oResponse.sorted);
        }
    },


    /**
     * The most recently obtained array of records will be stored here.
     * @private
     * @property _currentBuffer
     * @type {Array}
     */
    _currentBuffer: [],

    _setupCustomEvents: function () {
        this.evtPageCountChanged = 
                new YAHOO.util.CustomEvent('evtPageCountChanged');
        this.evtPageChanged = 
                new YAHOO.util.CustomEvent('evtPageChanged');
        this.evtContentsUpdated = 
                new YAHOO.util.CustomEvent('evtContentsUpdated');
        this.evtLoading =
                new YAHOO.util.CustomEvent('evtLoading');
        this.evtSorted =
                new YAHOO.util.CustomEvent('evtSorted');
        this.evtCacheConnError = 
                new YAHOO.util.CustomEvent('evtCacheConnError');
    },

    _handleRPCFailure: function (e) {
        // DA_DEBUG_START
        debugger;
        // DA_DEBUG_END
    },

    _handleRPCError: function (e) {
        // FIXME 
        // DA_DEBUG_START
        debugger;
        // DA_DEBUG_END
        // FIXME: NLS
        var msg = Ylang.isString(e) ? e : 
                    Ylang.isString(e.message) ? e.message :
                      "See logs for details.";
	this.evtCacheConnError.fire(e);
    }

};


/**
 * @constructor
 * @class DA.rssreader.PagerUI
 * @param oPager {Object} Instance of DA.rssreader.Pager
 */
DA.rssreader.PagerUI = function (oPager) {
    this.pager = oPager; // TODO: NPE checks
    this.pager.evtPageCountChanged.subscribe(
        this._handlePageCountChanged,
        this,
        true
    );
    this.pager.evtPageChanged.subscribe(
        this._handlePageChanged,
        this,
        true
    );
    this.container = document.createElement('div');
    this.container.className = 'paginator';
    // Event dispatcher: share the same onclick handler attached
    // to the parent for all the <a href=".."> pager links
    YEvent.on( 
        this.container, 
        'click',
        this._handleClick,
        this,
        true
    );
    this.pager.evtCacheConnError.subscribe(
        /**
         * Hide the pager UI when we find out that we can't contact the
         * cache server.
         * @type {Function} CustomEvent subscriber
         * @param sEvtName {String} Ought to be evtCacheConnError
         * @param aArgs {Array} the first element is an error
         *                      object (message, cache_connect_failed)
         */
        function (sEvtName, aArgs) {
            this.container.style.display = 'none';
        },
        this,
        true
    );
};

DA.rssreader.PagerUI.prototype = {

    /**
     * Must subscriber to DA.rssreader.Pager's evtPageCountChanged
     * @private 
     * @method _handlePageCountChanged
     * @param name {String} Ought to be 'evtPageCountChanged'
     * @param args {Array} the first argument is expected to be the number of pages.
     */
    _handlePageCountChanged: function (name, args) {
        var pages = args[0];
        if (pages > 1) {
            Element.show(this.container);
            this._draw( this.pager.currentPage, pages);
        } else {
            Element.hide(this.container);
        }
    },


    /**
     * Subscribed to DA.rssreader.Pager's evtPageChanged
     * @private
     * @method _handlePageChanged
     * @param name {String} Ought to be 'evtPageChanged'
     * @param args {Array} Probably the current page, but the already have it
     */
    _handlePageChanged: function (name, args) {
        this._draw( this.pager.currentPage, this.pager.totalPages );
    },


    /**
     * @private
     * @method _handleClick
     * @param evt {Object} The click event
     */
    _handleClick: function (evt) {
        var el = YEvent.getTarget(evt);
        var page;   // Which page? this will either be a page number.
                    // or the string 'next', or 'prev'
        if ( YDOM.hasClass(el, 'paginator-link') &&
             YDOM.hasClass(el, 'other' )) {
            // This is it!
            page = el.getAttribute('_page');
            // Depending on page, either page to a page number,
            // or using the 'magic' strings 'next' or 'prev',
            // page using pager.pageToNext() or pageToPrev()
            if (Ylang.isNumber(parseInt(page, 10))) {
                this.pager.pageTo(page);
            } else { // probably a string?
                switch (page) {
                    case 'next':
                        this.pager.pageToNext();
                        break;
                    case 'prev':
                        this.pager.pageToPrev();
                        break;
                    default:
                        // DA_DEBUG_START 
                        debugger; // what the hell!?
                        // DA_DEBUG_END
                }
            }

        }
        YEvent.stopEvent(evt);
        return false;
    },


    
    /**
     * Renders the pager, as hyperlinks with page numbers.
     * Side effects: Completely renews the HTML mark-up within
     * the DOM container element.
     * @private
     * @method _draw
     * @param nCurrentPage {Number} of the current page, indexed starting with 1.
     * @param nTotalPages  {Number} if the total pageable pages.
     */
    _draw: function (nCurrentPage, nTotalPages) {
        // String buffer array. each element containing markup for a single link.
        var start = Math.max(1, ((Math.ceil(nCurrentPage/10) -1 ) * 10) + 1);
        var end = Math.min(nTotalPages, (start+10-1));
        var sb = $R(start, end).map(
            // For each of the pages, from 1 to n, create HTML markup
            // for a <a href=..> link.
            /**
             * @param n {Number} The page number
             * @returns {String} of HTML markup, for a single <a href=".."> link.
             */
            function (n) {
                // Set the CSS class-name depending on where this link's page number
                // is the same as the currently selected number.
                var className = (n === nCurrentPage) ? 'current' : 'other';
                return '<a href="#" ' + 
                       'class="paginator-link '+className+'" ' +
                       ' _page="'+n+'">' + n + '</a>&nbsp;';
            }
        );

        // The little arrow image-link for paging to the beginning of the 
        // previous 10 pages
        if (nCurrentPage > 10) {
            sb.unshift( 
                '<img class="paginator-link other" ', 
                '_page="', (start - 10), '" ',
                'align="absmiddle" src="', ENV.imagesDir, 'btn_left.gif"/> ');
        }
        // ... and the link to page ahead to the start of the next 10 pages
        if (Math.ceil(nCurrentPage/10) < Math.ceil(nTotalPages/10)) {
            sb.push(
                ' <img class="paginator-link other" ',
                '_page="', (start  + 10), '" ',
                'align="absmiddle" src="', ENV.imagesDir, 'btn_right.gif"/>');
        }
   
        // need to wrap the links in a centerable div
        sb.unshift('<div style="text-align:center">');
        sb.push('</div>');

        // FIXME: using non-CSS 'align="absmiddle"'
        // add the 'PREV' link at the beginning
        if (nCurrentPage > 1) {
            sb.unshift(
                '<div class="prev-button">',
                '<img class="paginator-link other prev" _page="prev" src="', 
                    ENV.imagesDir,  'aqbtn_pageback.gif"/>',
                '</div>');
        }
        // NOTE the 'other' className: the next/prev page is always an 'other' page!
        // and, if applicable, add a 'NEXT' link at the end
        if (nCurrentPage < nTotalPages) {
            sb.push(
                '<div class="next-button">',
                '<img class="paginator-link other" _page="next" src="', 
                    ENV.imagesDir,  'aqbtn_pagenext.gif"/>',
                '</div>');
        }
       
        this.container.innerHTML = sb.join("");
    }

};

DA.rssreader.initProc = function(update) {
    if (BrowserDetect.browser === 'Explorer') {
        if (BrowserDetect.version < 6) {
            // We do not support anything in the Explorer family lesser than
            // IE6!
            //
            return;
        }
    }
 
    // Look for an Environment hash set by the server, and merge values
    // from it
    if (DA.rssreader.ENV && Ylang.isObject(DA.rssreader.ENV)) {
        if (DA.rssreader.ENV.portletSettings && 
            Ylang.isObject(DA.rssreader.ENV.portletSettings)) {
            Object.extend(ENV.portletSettings, DA.rssreader.ENV.portletSettings);
        }
        if (DA.rssreader.ENV.imagesDir) {
            ENV.imagesDir = DA.rssreader.ENV.imagesDir;
        }
        if (DA.rssreader.ENV.iconDir) {
            ENV.iconDir = DA.rssreader.ENV.iconDir;
        }
        if (DA.rssreader.ENV.iconExt) {
            ENV.iconExt = DA.rssreader.ENV.iconExt;
        }
        if (DA.rssreader.ENV.messages && Ylang.isObject(DA.rssreader.ENV.messages)) {
            Object.extend(ENV.messages, DA.rssreader.ENV.messages);
        }
        // Perl may give us Strings...
        ENV.portletSettings.showDateTime = parseInt(ENV.portletSettings.showDateTime, 10);
        // boolean-ify; the '!!' is intended!
        ENV.portletSettings.showDateTime = !!ENV.portletSettings.showDateTime;
        ENV.portletSettings.rowsPerPage = parseInt(ENV.portletSettings.rowsPerPage, 10);
        
    }
   
    // Find our portlets
    var divs = $$('div.rssreader-portlet');
    var portlets = divs.map(function (div) {
		var tt, pp;
        if (update) {
            // HACK to update portlet setting.
            tt = div.down('table.rssreader-headline-table');
            tt.parentNode.removeChild(tt);
            pp = div.down('div.paginator');
            pp.parentNode.removeChild(pp);
        }

        // HACK to find our refresh button
        // The common parent Element of our RSS reader DIV is a table element
        var commonParent  = div.up('table').parentNode;
        var refreshButton = commonParent ? commonParent.down('img.refresh-button') : undefined;
        if (refreshButton) {
            refreshButton.onclick = function () {
                portlet.start({
                    sort_by:    ENV.portletSettings.defaultSortBy,
                    sort_dir:   ENV.portletSettings.defaultSortDir
                });
            };
        }

        var portlet = new DA.rssreader.Portlet({
            container: div,
            settings:  ENV.portletSettings
        });
        return portlet;
    });

    DA.rssreader.PortletController = {
    
        _portlets: portlets,
        
        fireUpdate: function () {
            DA.rssreader.PortletEvents.onUpdate.fire();
        }

    };

    // start all the portlets.
    DA.rssreader.PortletController._portlets.each(
        function (p) {
            p.start({
                categoryId: 1,
                clipTitleChars: ENV.portletSettings.clipTitleChars,
                clipFeedNameChars: ENV.portletSettings.clipFeedNameChars,
                sort_by:        ENV.portletSettings.defaultSortBy,
                sort_dir:       ENV.portletSettings.defaultSortDir
            }); // TODO: params?
        }
    );
}

YEvent.on(window, 'load', function () {
	DA.rssreader.initProc();
});

// })();
