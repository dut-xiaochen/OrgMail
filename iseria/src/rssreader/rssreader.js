/* $Id: io.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://yuki.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/io/io.js $ */
/*for JSLINT undef checks*/
/*extern $$ DA YAHOO */
/*
Copyright (c) 2008, DreamArts. All rights reserved.
*/
if (typeof(window.DA) === 'undefined') {
    throw "error: No DA!";
}

DA.rssreader = {
    util: {
        
    },
    Events: {
        onFeedAdded: new YAHOO.util.CustomEvent('onFeedAdded')
    }
};

