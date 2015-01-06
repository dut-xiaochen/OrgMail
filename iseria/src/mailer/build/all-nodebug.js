/* $Id: message_core.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/locale/en/message_core.js $ */
/**
 * en core message.
 */

/*
DA.locale.message.core = {
    //'KEYWORD' : 'TEXT'
    ADDRESS_SET_ERROR                      : 'アドレス情報が取得できませんでした。',
    DEFAULT_MESSAGE_BODY                   : 'No Message Selected.',
    DIALOG_CANCEL_BUTTON                   : 'Cancel',
    DIALOG_ERROR                           : 'ダイアログの生成に失敗しました。',
    DIALOG_OK_BUTTON                       : 'OK',
    DIALOG_SETTING_BUTTON                  : 'Done',
    EDITOR_DIALOG_CHANGEEMAIL              : 'Enter an email address.',
    EDITOR_DIALOG_CHANGEEMAIL              : 'Enter email-address here',
    EDITOR_DIALOG_RENAME                   : 'Enter a name',
    EDITOR_PULLDOWNMENU_CHANGEEMAILCUSTOM  : '%1へ変更',
    EDITOR_PULLDOWNMENU_CHANGEEMAIL        : 'Edit Address',
    EDITOR_PULLDOWNMENU_CHANGELANG         : '%1表記へ変更',
    EDITOR_PULLDOWNMENU_MOVEBCC            : 'Move to Bcc',
    EDITOR_PULLDOWNMENU_MOVECC             : 'Move to Cc',
    EDITOR_PULLDOWNMENU_MOVETO             : '宛先へ移動',
    EDITOR_PULLDOWNMENU_RENAME             : 'Rename',
    EDITOR_PULLDOWNMENU_TITLENAMEON        : '敬称を利用',
    EDITOR_PULLDOWNMENU_TITLEOFF           : '敬称無し',
    EDITOR_PULLDOWNMENU_TITLEON            : '役職を利用',
    EXPORT_ERROR                           : 'エクスポートに失敗しました。',
    EXPORT_FILE_EMPTY                      : 'エクスポートに失敗しました。',
    EXPORT_OPERATING_PROMPT                : 'エクスポート処理中',
    FILTER_ERROR                           : 'フィルタが実行できませんでした。',
    FILTER_OPERATING_PROMPT                : 'フィルタ処理中',
    FOLDER_ADD_MENU                        : 'Add Folder',
    FOLDER_CLOSE_MENU                      : 'Collapse',
    FOLDER_CREATE_DIALOG                   : 'Enter a name for the new folder:',
    FOLDER_CREATE_ERROR                    : 'Failed to create folder.',
    FOLDER_DELETE_CONFIRM4PARENT           : "フォルダを削除します。下位のフォルダも削除されます。よろしいですか？\n［注意：メールも全て削除されます！元に戻すことはできません。］",
    FOLDER_DELETE_CONFIRM                  : "フォルダを削除します。よろしいですか？\n［注意：メールも全て削除されます！元に戻すことはできません。］",
    FOLDER_DELETE_ERROR                    : 'Could not delete the folder.',
    FOLDER_DELETE_MENU                     : 'Delete',
    FOLDER_EXPORT_MENU                     : 'Export',
    FOLDER_FILTER_MENU                     : 'Run Filters',
    FOLDER_IMPORT_DIALOG                   : 'Import',
    FOLDER_IMPORTEML_CONFIRM               : 'The given file does not have a ".eml" extension. Still continue?',
    FOLDER_IMPORT_MENU                     : 'Import',
    FOLDER_MOVE_ERROR                      : 'フォルダを移動できませんでした。',
    FOLDER_NEXT_FID_ERROR                  : 'フォルダ番号が取得できませんでした。',
    FOLDER_OPEN_MENU                       : 'Expand',
    FOLDER_REBUILD_CONFIRM                 : "This will rebuild the entire contents of this folder. If the number of messages is large, this could take a few moments. OK to continue?",
    FOLDER_REBUILD_MENU                    : 'Rebuild',
    FOLDER_RENAME_DIALOG                   : 'Enter a new name for this folder:',
    FOLDER_RENAME_ERROR                    : 'フォルダ名が変更できませんでした。',
    FOLDER_RENAME_MENU                     : 'Rename Folder',
    FOLDER_SELECT_ERROR                    : 'Unable to select folder.',
    FOLDER_TREE_ERROR                      : 'Could not display the folder tree.',
    FOLDER_TREE_TITLE                      : 'Folders',
    GROUPINFO_ERROR                        : 'Error retrieving Group Information.',
    IMPORT_ERROR                           : 'インポートに失敗しました。',
    IMPORT_OPERATING_PROMPT                : 'インポート処理中',
    IMPORT_PATH_EMPTY                      : 'インポートファイルが指定されていません。',
    JSON_ERROR                             : 'An error occured communicating with the server.',
    LOGOUT_ERROR_CONFIRM                   : '通信障害などで処理が終了できませんでした。強制終了しますか？',
    MAILER_CLOSE_CONFIRM                   : 'Ajaxメーラーを終了します。メーラーの全てのウィンドウを閉じてもよろしいですか？',
    MBOXGRID_COLUMNTITLE_ATTACHMENT        : 'Attachment?',
    MBOXGRID_COLUMNTITLE_DATE              : 'Date',
    MBOXGRID_COLUMNTITLE_FLAGGED           : 'Marked?',
    MBOXGRID_COLUMNTITLE_FROM              : 'From',
    MBOXGRID_COLUMNTITLE_PRIORITY          : 'Priority',
    MBOXGRID_COLUMNTITLE_SEEN              : 'Seen',
    MBOXGRID_COLUMNTITLE_SIZE              : 'Size',
    MBOXGRID_COLUMNTITLE_SUBJECT           : 'Subject',
    MBOXGRID_COLUMNTITLE_TO                : 'To',
    MBOXGRID_KEYWORD_EMPTY                 : 'Enter a search phrase.',
    MBOXGRID_LOADING                       : 'Loading...',
    MBOXGRID_NOFOLDERSELECTED              : 'No folder selected',
    MBOXGRID_NOMESSAGE                     : 'No messages',
    MBOXGRID_ROWCONTEXTMENU_DELETE         : 'Delete',
    MBOXGRID_ROWCONTEXTMENU_EXPORT         : 'Export',
    MBOXGRID_ROWCONTEXTMENU_FORWARD        : 'Forward',
    MBOXGRID_ROWCONTEXTMENU_MARKASREAD     : 'Mark as Read',
    MBOXGRID_ROWCONTEXTMENU_MARKASUNREAD   : 'Mark as Unread',
    MBOXGRID_ROWCONTEXTMENU_OPEN           : 'Open',
    MBOXGRID_ROWCONTEXTMENU_REPLYALL       : 'Reply All',
    MBOXGRID_ROWCONTEXTMENU_REPLY          : 'Reply',
    MBOXGRID_ROWCONTEXTMENU_RUNFILTER      : 'Run Filter',
    MBOXGRID_ROWCONTEXTMENU_SETMARK        : 'Apply Mark',
    MBOXGRID_ROWCONTEXTMENU_UNSETMARK      : 'Remove Mark',
    MDN_ERROR                              : 'Read notification failed.',
    MESSAGE_CHARSET_ISO2022JP              : 'Japanese only (ISO2022-JP)',
    MESSAGE_CHARSET_UTF8                   : 'UTF-8',
    MESSAGE_CHECKBOXMESSAGE_GROUPNAME      : '宛先グループ名を本文に記載',
    MESSAGE_CHECKBOXMESSAGE_NOTIFICATION   : '開封通知を要求 ',
    MESSAGE_CHECKBOXMESSAGE_REPLYUSE       : '返信メールアドレスを使用する',
    MESSAGE_COLUMNTITLE_ATTACHMENT         : 'Attachment?',
    MESSAGE_COLUMNTITLE_ATTACHMENTFILE     : 'Attached File',
    MESSAGE_COLUMNTITLE_BCC                : 'Bcc',
    MESSAGE_COLUMNTITLE_CC                 : 'Cc',
    MESSAGE_COLUMNTITLE_CHARSET            : 'Charset',
    MESSAGE_COLUMNTITLE_CONTENTTYPE        : '書式',
    MESSAGE_COLUMNTITLE_DATE               : 'Date',
    MESSAGE_COLUMNTITLE_FROM               : 'From',
    MESSAGE_COLUMNTITLE_OPTIONS            : '付加情報',
    MESSAGE_COLUMNTITLE_PRIORITY           : 'Priority',
    MESSAGE_COLUMNTITLE_SIGN               : 'Signature',
    MESSAGE_COLUMNTITLE_SUBJECT            : 'Subject',
    MESSAGE_COLUMNTITLE_TO                 : 'To',
    MESSAGE_CONTENTTYPE_HTML               : 'Rich-Text (HTML)',
    MESSAGE_CONTENTTYPE_TEXT               : 'Plain Text',
    MESSAGE_DELETECOMPLETE_CONFIRM         : 'Really delete these messages?  Please note that recovery will not be possible.',
    MESSAGE_DELETE_CONFIRM                 : 'Really delete these messages?',
    MESSAGE_DELETE_ERROR                   : 'Could not delete the message(s)',
    MESSAGE_EDIT_ERROR                     : 'Error editing the message.',
    MESSAGE_EXPORT_MENU                    : 'Export',
    MESSAGE_HEADER_MENU                    : 'View headers',
    MESSAGE_PRIORITY_HIGH                  : 'High',
    MESSAGE_PRIORITY_LOW                   : 'Low',
    MESSAGE_PRIORITY_NORMAL                : 'Normal',
    MESSAGES                               : '%1 messages',
    MESSAGE_SAVE_ERROR                     : 'Error saving message.',
    MESSAGE_TEMPLATE_ERROR                 : 'Error retrieving template.',
    MESSAGE_TRANSMIT_ERROR                 : 'Error sending message.',
    MESSAGE_VIEW_ERROR                     : 'Could not display the message.',
    POPUP_TITLENAME_SEARCH                 : 'Search',
    POPUP_TITLENAME_SEARCH                 : 'メール検索',
    QUOTE_00_TITLE                         : '引用（本文/添付）',
    QUOTE_01_TITLE                         : '引用（本文のみ）',
    QUOTE_02_TITLE                         : '引用（添付のみ）',
    QUOTE_10_TITLE                         : '引用符なし（本文/添付）',
    QUOTE_11_TITLE                         : '引用符なし（本文のみ）',
    QUOTE_99_TITLE                         : '引用しない',
    SEARCH_BUTTON                          : 'Search',
    SEARCH_CHECKBOXMESSAGE_CLASS           : '指定したフォルダ以下すべてを含む',
    SEARCH_CHECKBOXMESSAGE_DELETED         : 'Deleted messages',
    SEARCH_CHECKBOXMESSAGE_TOSELF          : 'Messages addressed to me',
    SEARCH_COLUMNTITLE_FID                 : '対象フォルダ',
    SEARCH_COLUMNTITLE_FIELD               : '検索対象項目',
    SEARCH_COLUMNTITLE_KEYWORD             : 'Keyword',
    SEARCH_COLUMNTITLE_NORROWING           : '絞込み条件',
    SEARCH_COLUMNTITLE_TOTAL               : 'Total Results',
    SEARCH_ERROR                           : 'Search failed.',
    SEARCH_KEYWORD_EMPTY                   : 'Please enter a search phrase.',
    SEARCH_MESSAGE_GUIDE                   : 'キーワードはスペースで区切って入力してください。 大文字、小文字の区別はありません。',
    SEARCH_NOMATCH                         : 'No matching mails found.',
    SEARCH_OPERATING_PROMPT                : 'searching...',
    SEARCH_OPTIONNAME_COND_AND             : 'If all',
    SEARCH_OPTIONNAME_COND_OR              : 'If one or more',
    SEARCH_OPTIONNAME_FIELD_BCC            : 'Bcc',
    SEARCH_OPTIONNAME_FIELD_BODY           : 'Body',
    SEARCH_OPTIONNAME_FIELD_CC             : 'Cc',
    SEARCH_OPTIONNAME_FIELD_FROM           : 'From',
    SEARCH_OPTIONNAME_FIELD_GROUP          : 'Group',
    SEARCH_OPTIONNAME_FIELD_SUBJECT        : 'Subject',
    SEARCH_OPTIONNAME_FIELD_TEXT           : 'Header/Body',
    SEARCH_OPTIONNAME_FIELD_TO             : 'To',
    SEARCH_OVER_WARN                       : '検索結果が%1件を超えました。処理を中断します。',
    SEARCH_RADIONAME_ATTACHMENT_ALL        : 'All',
    SEARCH_RADIONAME_ATTACHMENT_EXISTS     : 'With Attachment(s)',
    SEARCH_RADIONAME_ATTACHMENT_NOEXISTS   : 'Without Attachment(s)',
    SEARCH_RADIONAME_ATTACHMENT            : 'Has Attachment',
    SEARCH_RADIONAME_ETC                   : 'Others',
    SEARCH_RADIONAME_FLAGGED               : 'Flagged',
    SEARCH_RADIONAME_FLAGGED_ALL           : 'All',
    SEARCH_RADIONAME_FLAGGED_FLAGGED       : 'marked',
    SEARCH_RADIONAME_FLAGGED_UNFLAGGED     : 'unmarked',
    SEARCH_RADIONAME_PRIORITY_ALL          : 'all',
    SEARCH_RADIONAME_PRIORITY_HIGH         : 'high',
    SEARCH_RADIONAME_PRIORITY_LOW          : 'low',
    SEARCH_RADIONAME_PRIORITY_NORMAL       : 'normal',
    SEARCH_RADIONAME_PRIORITY              : 'Priority',
    SEARCH_RADIONAME_SEEN_ALL              : 'All',
    SEARCH_RADIONAME_SEEN_SEEN             : 'Read',
    SEARCH_RADIONAME_SEEN_UNSEEN           : 'Unread',
    SEARCH_RADIONAME_SEEN                  : 'Seen',
    SET_BUTTON                             : 'Confirm',
    SIMPLESEARCH_MENUTITLE_ADVANCE         : 'Advanced...',
    SIMPLESEARCH_MENUTITLE_FROM            : 'Sender contains',
    SIMPLESEARCH_MENUTITLE_SUBJECT         : 'Subject like',
    SIMPLESEARCH_MENUTITLE_TO              : 'Recipient like',
    SPAM                                   : 'Spam',
    STORAGE_UNIT                           : 'KB',
    TOPMENU43PANE_DELETE_TITLE             : 'Trash',
    TOPMENU43PANE_FORWARD_TITLE            : 'Forward',
    TOPMENU43PANE_GUIDE_TITLE              : 'Help',
    TOPMENU43PANE_MAKE_TITLE               : 'Compose',
    TOPMENU43PANE_REPLYALL_TITLE           : 'Reply All',
    TOPMENU43PANE_REPLY_TITLE              : 'Reply',
    TOPMENU43PANE_SETTING_TITLE            : 'Settings',
    TOPMENU43PANE_STATE_TITLE              : 'Save Visual State',
    TOPMENU4EDITOR_BACK_TITLE              : 'Back',
    TOPMENU4EDITOR_PREVIEW_TITLE           : 'Preview',
    TOPMENU4EDITOR_SAVE_TITLE              : 'Save',
    TOPMENU4EDITOR_TEMPLATE_TITLE          : 'Template',
    TOPMENU4EDITOR_TRANSMIT_TITLE          : 'Send',
    TOPMENU4VIEWER_DELETE_TITLE            : 'Trash',
    TOPMENU4VIEWER_EDIT_TITLE              : 'Edit',
    TOPMENU4VIEWER_FILTER_TITLE            : 'Filter',
    TOPMENU4VIEWER_FORWARD_TITLE           : 'Forward',
    TOPMENU4VIEWER_NEXT_TITLE              : 'Next Message',
    TOPMENU4VIEWER_OPTION_TITLE            : 'Option',
    TOPMENU4VIEWER_PREV_TITLE              : 'Previous Message',
    TOPMENU4VIEWER_PRINT_TITLE             : 'Print',
    TOPMENU4VIEWER_REPLYALL_TITLE          : 'Reply All',
    TOPMENU4VIEWER_REPLY_TITLE             : 'Reply',
    TOPMENU_CLOSE_TITLE                    : 'Close',
    TRANSMIT_MAIL_MESSAGE                  : 'Message sent.',
    TRANSMIT_OPERATING_PROMPT              : 'Sending...',
    TRASH_ERROR                            : 'Error trashing message.',
    TRASH                                  : 'Trash',
    UPLOAD_ERROR                           : 'An error occured during the file upload.',
    USERINFO_ERROR                         : 'ユーザ情報の取得に失敗しました。',
    WASTE_TRASH_CONFIRM                    : 'OK to move [%1] to trash?',
    WASTE_TRASH_MENU                       : 'Move [%1] to trash,
    WINDOW_SIZE_WARN                       : 'ウィンドウサイズ小さすぎるため、ウィンドウサイズを変更します。'

};

*/
/* $Id: DA.js 2303 2012-08-20 08:26:51Z ch_zhang $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/DA/DA.js $ */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
/*jslint evil: true */
/*for JSLINT undef checks*/
/*extern YAHOO */ 
/*extern$H $ Event*/

/**
 * The DA object is the single global object used by
 * DreamArts RIA Javascript applications.
 * 
 * @module DA
 * @title DA Global
 */

/**
  * The DA global namespace.
  */
var DA = {
    widget: {},
    // Empty logger; this should be set by clients later
    log: function(message, category, source) { }
};

DA.vars = window.userConfig;
/*
 * イメージパスの https 対応
 * セキュリティの警告回避
 * http://support.microsoft.com/kb/925014/ja
 */
(function () {
    var server;
    if (location.href.match(/^(https\:\/\/[^\/]+)/)) {
        server = RegExp.$1;
        if (DA.vars.imgRdir.match(/^\//)) {
            DA.vars.imgRdir = DA.vars.imgRdir.replace(/\//, server + '/');
        }
        if (DA.vars.clrRdir.match(/^\//)) {
            DA.vars.clrRdir = DA.vars.clrRdir.replace(/\//, server + '/');
        }
    }
})();

/*
 * BrowserDetect2.0 as copied from the website of PPK (Peter-Paul Koch)
 * http://www.quirksmode.org/
 *
 * Global object that can provide information about which browser we
 * are running. Please note that this needs to be maintained.
 */
var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent) ||
			 this.searchVersion(navigator.appVersion) ||
			 "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
	    var dataString;
		var dataProp;
		for (var i=0;i<data.length;i++)	{
			dataString = data[i].string;
			dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) !== -1) {
					return data[i].identity;
				}
			}
			else if (dataProp) {
				return data[i].identity;
			}
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index === -1) { return; }
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari"
		},
		{
			prop: window.opera,
			identity: "Opera"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};
BrowserDetect.init();

DA.util = {
    isNull: function(obj) {
        if (obj === null) {
            return true;
        } else {
            return false;
        }
    },
    
    /**
     * TODO: for review.
     */
    isUndefined: function(obj) {
        if (obj === undefined || (typeof(obj) === 'string' && obj === '')) {
            return true;
        } else {
            return false;
        }
    },
    
    isEmpty: function(obj) {
        if (DA.util.isNull(obj) || DA.util.isUndefined(obj)) {
            return true;
        } else {
            return false;
        }
    },

    isNumber: function(obj) {
        if (typeof(obj) === 'number' && isFinite(obj)) {
            return true;
        } else {
            return false;
        }
    },
    
    /**
     * TODO: for review.
     */
    isString: function(obj) {
        return typeof(obj) === 'string';
    },
    
    isArray: function(obj) {
        if (obj.constructor && obj.constructor.toString().indexOf('Array') > -1) {
            return true;
        } else {
            return false;
        }
    },
    
    isObject: function(obj) {
        return typeof(obj) === 'object';
    },
    
    isFunction: function(obj) {
        return typeof(obj) === 'function';
    },
    
    cmp: function(obj1, obj2) {
        var s1 = (DA.util.isNumber(obj1)) ? obj1.toString() : obj1;
        var s2 = (DA.util.isNumber(obj2)) ? obj2.toString() : obj2;
        
        return s1 === s2;
    },
    
    cmpNumber: function(obj1, obj2) {
        return parseInt(obj1, 10) === parseInt(obj2, 10);
    },
   
    /**
     * Helper for ECMAScript RegExp match tests.
     * @static
     * @param str  {String} a string to test.
     * @param rule {String} a Regular Expression.
     * @returns TRUE if str is non-null, defined and matched rule.
     */
    match: function(str, rule) {
        var reg = new RegExp(rule);
        return str && str.match(reg);
    },
    
    /**
     * TODO: for review. Maybe we can use 
     *       Douglas Crockford's version?
     */
    encode: function(str, cr, sq, sp) {
        var buf = str;
        if (DA.util.isString(str)) {
            buf = buf.replace(/&/g, "&amp;");
            buf = buf.replace(/"/g, "&quot;");
            buf = buf.replace(/</g, "&lt;");
            buf = buf.replace(/>/g, "&gt;");
            if (sq === 1) {
                buf = buf.replace(/'/g, "&squo;");
            }
            if (cr === 1) {
                buf = buf.replace(/(\r\n|[\r\n])/g, "<br>");
            } else if (cr === 2) {
                buf = buf.replace(/([^\r\n]+)(\r\n|$)/mg, "<p>$1</p>$2");
                buf = buf.replace(/(^|\r\n)(\r\n)/mg, "$1<p>&nbsp;</p>$2");
                if (BrowserDetect.browser !== "Explorer"){
					buf=buf.replace(/(^|\n)(\n)/mg,"$1<p>&nbsp;</p>$2");
				}
            }
            if (sp === 1) {
                buf = buf.replace(/ /g, "&nbsp;");
            }
        }
        return buf;
    },
    
    /**
     * TODO: for review. Maybe we can use 
     *       Douglas Crockford's version?
     */
    decode: function(str, cr, sq, sp) {
        var buf = str;
        if (DA.util.isString(str)) {
            buf = buf.replace(/&lt;/g, "<");
            buf = buf.replace(/&gt;/g, ">");
            buf = buf.replace(/&quot;/g, "\"");
            if (sq === 1) {
                buf = buf.replace(/&squo;/g, "'");
            }
            buf = buf.replace(/&amp;/g, "&");
            if (cr === 1) {
                buf = buf.replace(/<br>/g, "\r\n");
            } else if (cr === 2) {
                buf = buf.replace(/<p>\&nbsp\;<\/p>([\r\n]|$)?/gi, "$1");
                buf = buf.replace(/<p>([^<>]*)<\/p>([\r\n]|$)?/gi, "$1$2");
            }
            if (sp === 1) {
                buf = buf.replace(/&nbsp;/g, " ");
            }
        }
        return buf;
    },
    
    /**
     * TODO: for review. Maybe we can use 
     *       Douglas Crockford's version?
     */
    escape: function(str) {
        var buf = str;
        if (DA.util.isString(str)) {
            buf = buf.replace(/\\/, "\\\\");
            buf = buf.replace(/"/, "\\\"");
        }
        return buf;
    },
    
    /**
     * TODO: for review. Maybe we can use 
     *       Douglas Crockford's version?
     */
    unescape: function(str) {
        var buf = str;
        if (DA.util.isString(str)) {
            buf = buf.replace(/\\\"/, "\"");
            buf = buf.replace(/\\\\/, "\\");
        }
        return buf;
    },
    
    warn: function(str) {
        alert(str);
    },
    
    error: function(str) {
        alert(str);
    },
    
    confirm: function(str) {
        if (confirm(str)) {
            return true;
        } else {
            return false;
        }
    },
    
    lockData: {},

    lock: function(name) {
		var operationFlag = DA.mailer.util.getOperationFlag();
        if ((operationFlag !== "" && operationFlag.indexOf(OrgMailer.vars.org_mail_gid.toString()) < 0) || this.existsLock(name)) {
            return false;
        } else {
			operationFlag += OrgMailer.vars.org_mail_gid.toString() + name;
            DA.mailer.util.setOperationFlag(operationFlag);
            this.lockData[name] = true;
            return true;
        }
    },
    
    unlock: function(name) {
		var operationFlag = DA.mailer.util.getOperationFlag();
		var reg = null;
		if (operationFlag !== "" && operationFlag.indexOf(OrgMailer.vars.org_mail_gid.toString() + name) >= 0){
			reg = new RegExp(OrgMailer.vars.org_mail_gid.toString() + name, 'g');
        	DA.mailer.util.setOperationFlag(operationFlag.replace(reg,''));
        	DA.mailer.util.setOperationWarnedFlag('');
		}
        delete this.lockData[name];
        return true;
    },
    
    existsLock: function(name) {
        if (this.lockData[name]) {
            return true;
        } else {
            return false;
        }
    },
    
    pack: function(string) {
        var i, p = '', s = '';
        
        for (i = 0; i < string.length; i ++) {
            p += string.charAt(i);
            if (p.length === 2) {
                s += String.fromCharCode(parseInt(p, 16));
                p = '';
            }
        }
        
        return s;
    },
    
    unpack: function(string) {
        var i, s = '';
        
        for (i = 0; i < string.length; i ++) {
            s += parseInt(string.charCodeAt(i), 10).toString(16);
        }
        
        return s;
    },
    
	setUrl: function(url){
		// add check key  CSRF対応用
	    var chk_key = DA.vars.check_key_url;
	    if (DA.util.isEmpty(chk_key)) { 
	    	return url;
	    } else {
		    if ( url.match(/\?/) ){
				return url + chk_key ;    
		    }else{
		        return url + chk_key.replace(/^&/, '?');
		    }
	    }
	},
    
    parseJson: function(jsonText) {
        try {
	    // TODO: what happens to scope here?
            return eval('('+ jsonText +')');
        } catch(e) {
            return undefined;
        }
    },
    
    parseQuery: function(qs) {
        var url   = (DA.util.isEmpty(qs)) ? location.href : qs;
        var tmp   = url.split("?");
        var part  = (tmp.length > 1) ? tmp[1].split("&") : [];
        var item  = [];
        var query = {};
        
        for (var i = 0; i < part.length; i ++) {
            item = part[i].split("=");
            query[item[0]] = item[1];
        }
        
        return query;
    },
    
    makeXml: function(object, root) {
        var k;
        var xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                ((DA.util.isEmpty(root)) ? '' : '<' + root + '>\n');
        
        
        for (k in object) {
            xml += DA.util._object2xml(object[k], k);
        }
        xml += ((DA.util.isEmpty(root)) ? '' : '</' + root + '>\n') +
             '</xml>\n';
        
        return xml;
    },
    
    _object2xml: function(object, key) {
        var k, xml = '';
        
        if (DA.util.isFunction(object)) {
            xml = '';
        } else if (DA.util.isString(object)) {
            xml = '<' + key + '>' +
                ((DA.util.isEmpty(object)) ? '' : DA.util.encode(object)) +
                '</' + key + '>\n';
        } else if (DA.util.isNumber(object)) {
            xml = '<' + key + '>' +
                ((DA.util.isEmpty(object.toString())) ? '' : object.toString()) +
                '</' + key + '>\n';
        } else if (DA.util.isArray(object)) {
            object.map(function(o) {
                xml += DA.util._object2xml(o, key);
            });
        } else {
            xml = '<' + key + '>';
            for (k in object) {
                xml += DA.util._object2xml(object[k], k);
            }
            xml += '</' + key + '>\n';
        }
        
        return xml;
    },
    
    getTime: function() {
        var date = new Date();
        return date.getTime();
    },

    /**
     * Returns the time difference in milliseconds between the 2 given 
     * Date objects.
     * @param start (Javascript Date object)
     * @param end   (Javascript Date object) if not specified, defaults to current
     * @return difference in milliseconds
     * @type Number
     */
    time_diff: function (start /*JS Date object*/, end /*JS Date object*/) {
        // TODO: Are further null-checks needed?
        return (end? end.getTime() : new Date().getTime()) - start.getTime();
    },

    /**
     * Compress repeated calls to a function to a slower frequency; 
     * This effecticely wraps the given function f so that f will
     * only be fired once during the threshold threshold milliseconds,
     * discarding the redundant calls.
     * <p>
     * This is potentially useful when dealing with events that fire
     * too often, too fast, and are safe to handle less frequently
     * (than they are being fired).
     * Example: window.resize in IE
     * @method slowdown
     * @param f {Function} a function reference
     * @param threshold {Int} milliseconds to set as the threshold for 
     *                        call frequency compression.
     * @returns {Function} a function reference that represents the
     *                        frequency limited function.
     */
    slowdown: function(f, threshold) {
        threshold = threshold ? threshold : 1000;
        var last = new Date().getTime();
        var todoArgs = [];
        var tout; // timeout
        function dolater() {
            // invoke the saved function reference
            // with the saved arguments
            f.call(todoArgs);
        }
        return function() {
            var now = new Date().getTime(); // TODO: Is there a more high-performance 
                                            //       way to get the time in ms?
            if ((now - last) > threshold) { 
                last = now;
                f.call(arguments);  // invoke f now
            } else { // procrastinate
                clearTimeout(tout); // forget the last one
                todoArgs = arguments; // and it's args to do later
                tout = setTimeout(dolater, threshold);
            }
        };
    },


    /**
     * Creates a run-once-only version of the given function. The returned
     * function will only run once (the last time) in a constant sequence
     * of rapid invocations; i.e., if it is called 1000 times, it will only
     * execute once, the last time, if the time interval between each invocation
     * is lesser that the specified threshhold.<p>
     * This is provided as yet another workaround to the IE window.onresize
     * continuous event firing problem.
     * @method onlyonce
     * @param  scope  {Object}  the scope in which to invoke the method
     * @param  f      {Funcion} the function to wrap.
     * @param  thresh {Int}     The interval threshold (in milliseconds)
     * @returns {Function} wrapped function which will only be run once.
     */
    onlyonce: function (scope, f, thresh) {
        var todoArgs = []; // Saved array reference which will always be overwritten
                           // With the current arguments.
        var todoFunc = function() {   // Saved reference to the invocation of the actual
            f.apply(scope, todoArgs); // function
        };
        var to; // private reference to the latest timeout
        // Create and return the wrapped function
        return function() {
            clearTimeout(to); // Clear the current queued job.
            todoArgs = arguments;
            to = setTimeout(todoFunc, thresh); // queue an invocation within the threshold.
        };

    }, 


    /**
     * Test if the given objects/hashes have the same keys and corresponding values.
     * @method areEquivObjs
     * @param o1 {Object/Hash}
     * @param o2 {Object/Hash}
     * @return {Boolean} TRUE if o1 is o2 or o1 and o2 have the same keys/values; FALSE otherwise
     */
    areEquivObjs: function (o1, o2) {
        if (!(YAHOO.lang.isObject(o1) && YAHOO.lang.isObject(o2))) { return false; }
        if (o1 === o2) { return true; }

        // TODO: reusability?
        return $H(o1).all(function (p) { return o2[p.key] === p.value; }) &&
               $H(o2).all(function (p) { return o1[p.key] === p.value; }) ;

    },


   /**
     * Convert an array of numerical values to percentages.
     * @static
     * @method toPercentages
     * @param numbers Array on non-negative numbers
     * @private
     * @returns Array of percentages
     */
    toPercentages: function( numbers /*array of numbers*/ ) {
        if (!numbers) { return []; }
        var total = numbers.inject(0, DA.util._add);
        return numbers.map(function(n){
            return (n/total) * 100;
        });
    },

    /**
     * FIXME: What is this supposed to be, a static private sort of thing?
     * @method _add
     * @param a number
     * @param b number
     * @private
     */
    _add: function(a, b) { return a + b; },
    
    disableKey: function(key){
        if (key === "backspace"){
    			YAHOO.util.Event.addListener(window.document, "keydown", function() {
            		var elTarget = YAHOO.util.Event.getTarget(event);
            		if (YAHOO.util.Event.getCharCode(event) === Event.KEY_BACKSPACE && (elTarget.type !== 'text') && (elTarget.type !== 'textarea') && (elTarget.type !== 'file')) {
                		return false;
            		}
            		return true;
        		}, window.document, true);
    	}
	},
	
	jsubstr4attach: function(str, length){
		var len, h_len, str_len, res, n, t;
		len = length || DA.vars.config.attachment_length;
		if (len === 'none'){return str;}
		if (len === null){len=15;}
		h_len = parseInt((len-3)/2,10);
		str_len = str.length;
		if (str_len > len){
			if (str.match(/(.*)\.([\w\d]+)/g)) {
				n = RegExp.$1;
				t = RegExp.$2;
				res = n.substring(0,h_len)+ '...' + n.substr(n.length-h_len,h_len)+ '.'+ t;
			} else {
				res = str.substring(0,h_len)+ '...' + str.substr(str_len-h_len,h_len);
			}
			return res;	
		} else {
			return str;
		}
	},
	
    getSessionId: function() {
        var cookie = document.cookie;
        var cookies = cookie.split(/\;\s*/);
        var i, kv, sessionId;
        for (i = 0; i < cookies.length; i++ ) {
            kv = cookies[i].split(/\=/);
            if (kv[0] === DA.vars.sessionKey) {
                sessionId = kv[1];
            }
        }
        return sessionId;
    },
    
    getServer: function() {
        var server;
        if (location.href.match(/^(http[s]*\:\/\/[^\/]+)/)) {
            server = RegExp.$1;
        }
        return server;
    }
};

DA.time = {
    GetTime: function() {
        var date = new Date();
        var time = date.getTime();
        
        delete date;
        
        return time;
    },
    
    DiffTime: function(t1, t2) {
        var time = t2 - t1;
        
        return time;
    }
};

DA.customEvent = {
	set: function(event, func) {
 		if (func) {
 			this.events[event] = func;
 		}
 	},
 	fire: function(event, me, args) {
 		if (this.events[event]) {
 			this.events[event](me, args);
 		}
 	},
 	events: {}
};

/* 
 * FCKEditor Common function
 */
var FCKEditorIframeController = {
    createIframe: function(IframeId, parent) {
        var HTMLArea = document.createElement("iframe");
            HTMLArea.setAttribute("id", IframeId);
            HTMLArea.setAttribute("width", "100%");
            HTMLArea.setAttribute("height", "100%");
            HTMLArea.setAttribute("frameborder", 0);
        parent.innerHTML = '';
        parent.appendChild(HTMLArea);
    },
    
    removeIframe: function(IframeId, parent) {
        var HTMLNode = YAHOO.util.Dom.get(IframeId);
        
        if (HTMLNode) {
            this.setIframeBody(IframeId, '');
            parent.removeChild(HTMLNode);
        }
    },

    setIframeBody: function(IframeId, html) {
        var HTMLNode = YAHOO.util.Dom.get(IframeId);
        var doc;
        
        if (HTMLNode) {
            if (BrowserDetect.browser === 'Explorer') {
                doc = HTMLNode.contentWindow.document;
            } else {
                doc = HTMLNode.contentDocument;
            }
            
            doc.open();
            doc.writeln(html);
            doc.close();
        }
    },
    
    isFCKeditorData: function(html) {
        var fckHeaderMatcher = /^<\!-- Created by DA_Richtext .*? end default style -->/;
        return fckHeaderMatcher.test(html);
    }
};

/*
 * Window Controler
 */
DA.windowController = {
    data: [],
    
    _url: function(url) {
        if (DA.util.isEmpty(url)) {
            return '';
        } else {
            if (url.match(/\?/)) {
                return url + '&time=' + DA.util.getTime() + DA.vars.check_key_url;
            } else {
                return url + '?time=' + DA.util.getTime() + DA.vars.check_key_url;
            }
        }
    },
    
    _name: function(name) {
        if (DA.util.isEmpty(name)) {
            return '';
        } else {
            return DA.vars.mid + '_' + name;
        }
    },
    
    _width: function(width) {
        if (DA.util.isEmpty(width)) {
            return 800;
        } else {
            return width;
        }
    },
    
    _height: function(height) {
        if (DA.util.isEmpty(height)) {
            return 600;
        } else {
            return height;
        }
    },
    
    width: function(win) {
        if (win) {
            return win.document.body.clientWidth;
        } else {
            return window.document.body.clientWidth;
        }
    },
    
    height: function(win) {
        if (win) {
            return win.document.body.clientWidth;
        } else {
            return window.document.body.clientHeight;
        }
    },
    
    // TODO: comments
    getX: (BrowserDetect.browser === 'Explorer') ?
            function(win) {
                return win ? win.screenLeft : window.screenLeft;
            } :
            function(win) {
                return win ? win.screenX : window.screenX;
            } , 

    // TODO: comments
    getY: (BrowserDetect.browser === 'Explorer') ?
            function(win) {
                return win ? win.screenTop : window.screenTop;
            } :
            function(win) {
                return win ? win.screenY : window.screenY;
            } ,

    winOpen: function(url, name, width, height) {
        var status = 'width=' + this._width(width) + ',height=' + this._height(height) +
                     ',resizable=yes,scrollbars=yes,location=yes' +
                     ',menubar=yes,toolbar=yes,statusbar=yes';
        
        var win = window.open(this._url(url), this._name(name), status);
        win.moveTo(this.getX(win.opener) + 10, this.getY(win.opener) + 10);
        win.focus();
        
        this.data[this.data.length] = win;
        
        return win;
    },
    
    winOpenNoBar: function(url, name, width, height, flg) {
    	var win;
        var status = 'width=' + this._width(width) + ',height=' + this._height(height) +
                     ',resizable=yes,scrollbars=no,location=no' +
                     ',menubar=no,toolbar=no,statusbar=no';
		if (DA.vars.config.download_type === 'simple' && flg === 1) {
			win = window.open(this._url(url), '_self', status);
		} else {
        	win = window.open(this._url(url), this._name(name), status);
            win.moveTo(this.getX(win.opener) + 10, this.getY(win.opener) + 10);
            win.focus();
        	this.data[this.data.length] = win;
    	}
        return win;
    },
    
    winOpenCustom: function(url, name, status) {
        var win = window.open(this._url(url), this._name(name), status);
        win.moveTo(this.getX(win.opener) + 10, this.getY(win.opener) + 10);
        win.focus();
        
        this.data[this.data.length] = win;
        
        return win;
    },
    
    isePopup: function(Proc, Title, Width, Height, no, noname, POSX, POSY) {
        var Param = 'width=' + Width + ',height=' + Height + ',resizable=yes';
        var Url   = DA.vars.cgiRdir + '/pop_up.cgi?proc=' + Proc + '&title=' + Title;
        var pwin, last, name, winname;
        if (!noname) {
            last = Title.indexOf('.gif');
            name = Title.substring(0,last);
            winname = name + no;
            pwin = this.winOpenCustom(Url, winname, Param);
        } else {
            pwin = this.winOpenCustom(Url, '', Param);
        }
        if (!DA.util.isEmpty(POSX) && !DA.util.isEmpty(POSY)) {
            pwin.moveTo(POSX, POSY);
        }
        pwin.focus();
    },
    
    allClose: function(parent) {
    	if(!DA.util.isObject(parent)){
    		parent=window;
    	}
        for (var i = 0; i < this.data.length; i ++) {
            if (this.data[i]) {
                try {
                    if(parent === this.data[i]){ 
						continue; 
					} 
					this.data[i].DA.windowController.allClose(this.data[i]); 
                } catch(e) {
                }
                try {
                    this.data[i].close();
                } catch(e) {
                }
            }
        }
    },

    /**
     * Custom Event (YUI) that will be fired whenever the window has been resized.
     * This is recommended (instead of directly using window.onresize) because it
     * provides a cross-browser event that fires only once <b>after</b> the resize
     * has been completed, instead of continuously (as in IE)
     * @static
     * @property onGentleResize
     * @type {Object} Instance of YAHOO.util.CustomEvent
     */
    onGentleResize: new YAHOO.util.CustomEvent("onGentleResize")
    
};


DA.imageLoader = {
    tag: function(imageSrc, imageAlt, obj) {
        var image = new Image();
        image.src = imageSrc;
        
        var src = (DA.util.isEmpty(imageSrc)) ?
                  '' : ' src="' + DA.util.escape(imageSrc) + '"';
        var alt = (DA.util.isEmpty(imageAlt)) ?
                  '' : ' alt="' + DA.util.escape(imageAlt) + '"';
        var opt;
        if (obj) {
            opt = '';
            for (var key in obj) {
               if (!DA.util.isEmpty(obj[key]) && (DA.util.isString(obj[key]) || DA.util.isNumber(obj[key]))) {
                   opt += ' ' + key + '=' + obj[key];
               }
            }
        } else {
            opt = ' border=0';
        }
        var tag = '<img' + src + alt + opt + '>';
        
        delete image;
        
        return tag;
    },
    
    nullTag: function(x, y) {
        return this.tag(DA.vars.imgRdir + '/null.gif', '', { width: (DA.util.isEmpty(x)) ? 1 : x, height: (DA.util.isEmpty(y)) ? 1 : y });
    }
    
};

DA.dom = {
    createDiv: function(id) {
        var body = document.body;
        var div  = document.createElement("div"); div.id = id;
        
        body.insertBefore(div, body.firstChild);
        
        var node = YAHOO.util.Dom.get(id);
        
        return node;
    },
    
    id2node: function(obj) {
        if (DA.util.isString(obj)) {
            return YAHOO.util.Dom.get(obj);
        } else {
            return obj;
        }
    },
    
    left: function(obj) {
        var node = this.id2node(obj);
        
        return node.offsetLeft;
    },
    
    top: function(obj) {
        var node = this.id2node(obj);
        
        return node.offsetTop;
    },
    
    width: function(obj) {
        var node = this.id2node(obj);
        
        return node.offsetWidth;
    },
    
    height: function(obj) {
        var node = this.id2node(obj);
        
        return node.offsetHeight;
    },
    
    size: function(obj, width, height) {
        var node = this.id2node(obj);
        
        this.sizeWidth(width);
        this.sizeHeight(height);
    },
    
    sizeWidth: function(obj, width) {
        var node = this.id2node(obj);
        
        node.style.width = width + 'px';
    },
    
    sizeHeight: function(obj, height) {
        var node = this.id2node(obj);
        
        node.style.height = height + 'px';
    },
    
    position: function(obj, x, y) {
        var node = this.id2node(obj);
        
        this.positionX(obj, x);
        this.positionY(obj, y);
    },
    
    positionX: function(obj, x) {
        var node = this.id2node(obj);
        
        node.style.left = x + 'px';
    },
    
    positionY: function(obj, y) {
        var node = this.id2node(obj);
        
        node.style.top  = y + 'px'; 
    },
    
    adjustPosition: function(obj) {
        var node = this.id2node(obj);
        var windowWidth  = YAHOO.util.Dom.getViewportWidth();
        var windowHeight = YAHOO.util.Dom.getViewportHeight();
        var offsetWidth  = this.width(node);
        var offsetHeight = this.height(node);
        var offsetLeft   = this.left(node);
        var offsetTop    = this.top(node);
        var x, y;
        
        if (offsetLeft + offsetWidth > windowWidth) {
            x = offsetLeft + windowWidth - (offsetLeft + offsetWidth) - 10;
            if (x < 0) {
                x = 0;
            }
        } else {
            x = offsetLeft;
        }
        if (offsetTop + offsetHeight > windowHeight) {
            y = offsetTop + windowHeight - (offsetTop + offsetHeight) - 30;
            if (y < 0) {
                y = 0;
            }
        } else {
            y = offsetTop;
        }
        
        this.position(node, x, y);
    },
    
    textAreaValue: function(obj) {
        var node = this.id2node(obj);
        
        return node.value;
    },
    
    textValue: function(obj) {
        var node = this.id2node(obj);
        
        return node.value;
    },
    
    fileValue: function(obj) {
        var node = this.id2node(obj);
        
        return node.value;
    },
    
    hiddenValue: function(obj) {
        var node = this.id2node(obj);
        
        return node.value;
    },
    
    selectValue: function(obj) {
        var node = this.id2node(obj);
        
        return node.value;
    },
    
    radioValue: function(name) {
        var value = null;
        var root  = document.getElementsByName(name);
        
        for (var i = 0; i < root.length; ++i) {
            if (root[i].checked) {
                value = root[i].value;
                break;
            }
        }
        
        return value;
    },
    
    checkedOk: function(obj) {
        var node = this.id2node(obj);
        
        return node.checked;
    },
    
    changeValue: function(obj, value) {
        var node = this.id2node(obj);
        
        node.value = (DA.util.isEmpty(value)) ? '' : value;
    },
    
    changeSelectedIndex: function(obj, target) {
        var node    = this.id2node(obj);
        var tString = (DA.util.isNumber(target)) ? String(target) : target;
        var i;
        
        for (i = 0; i < node.childNodes.length; i ++) {
            if (node.childNodes[i].value && node.childNodes[i].value === tString) {
                node.selectedIndex = node.childNodes[i].index;
                break;
            }
        }
    },
    
    changeChecked: function(obj, value) {
        var node = this.id2node(obj);
        
        node.checked = (DA.util.isEmpty(value)) ? false : value;
    },

    /**
     * Given a node, finds the first parent node (or itself) if one of it's ancestors
     * (or itself) matches the specified criteria 
     * @param node          {HTMLElement} a node to start searching from (upwards).
     * @param criteria      {String}      the tagName of the HTMLElement to find (Example: TR)
     * @param criteria      {function}    a function that acts as an acceptor 
     *                                    (Example: function(el){return el.className == 'nice'})
     * @param levels        {Int}         The maximum number of levels to search. The default is 3.
     * @return {HTMLElement} The matching parent node (if found) or null.
     */
    findParent: function(node, criteria, levels) {
        if (!node || !node.tagName || !criteria) { return null; } 
        if (!levels) { levels = 3; } 
        
        var test = typeof criteria === 'function' ?  criteria : // already a function
                // Make a tagName matcher
                function(n) { // n: node
                    return criteria === n.tagName.toUpperCase();
                };

        var level = 0;
        if (test(node)) {
            return node;
        }
        do {
            level++;
            if (test(node)) {
                return node;
            }
        } while ((node = node.parentNode) && node.tagName && (level < levels));
        return null;
    },

    /**
     * Move all the childNodes from src to dest.
     * @param src  {HTMLElement} The source DOM Element.
     * @param dest {HTMLElement} The destination DOM Element.
     */
    moveAllChildren: function (src, dest) {
        if (!src || !dest) { return; }
        while (src.firstChild) {
            dest.appendChild(src.firstChild);
        }
    },


    /**
     * Cross-Browser utility to create new CSS rules.
     * The rules are specifed by passing in a CSS selector as a first argument,
     * and text for the CSS rule (sans the trailing semicolon) as the second.
     * The created rule will be inserted into the first stylesheet in the
     * document; unless a stylesheet has already been specified before the
     * loading of this script (DA.js)
     *
     * Example:
     * // calling
     * DA.dom.createCSSRule('div.pinkish', 'background-color:pink');
     * // Will turn all existing as well as future DIV elements with
     * // a 'pinkish' class to pink.
     *  
     * @method createCSSRule
     * @public
     * @static
     * @param selector {String}
     * @param ruleText {String}
     */
    createCSSRule: (function () {
        /*
         * We avoid doing at run-time what can be done once at load-time:
         * instead of defining createCSSRule as a function with if/else
         * branches for IE/Gecko, we use a closure for each browser
         * and decide at load-time (or more correctly, at the time of 
         * createCSSRule's definition) which function to use.
         */
        if (document.styleSheets.length === 0) {
           document.write("<style>\n</style>");
        }
        // 
        var styleSheet = document.styleSheets[0];

        // Function for IE
        var IE = function (selector, ruleText) {
            styleSheet.addRule(selector, ruleText);
        };

        // Function for W3C browsers (FF/Gecko/Mozilla conforms and tests OK)
        var W3C = function (selector, ruleText) {
            styleSheet.insertRule(selector + " {" + ruleText + ";}" , 0);
        };

        // A dummy function.
        var Unimplemented = function () {
        };

        return styleSheet.addRule ? IE : 
                styleSheet.insertRule ? W3C : Unimplemented;
    })()


};

DA.tip = {
    tipNode: [],

    open: function(id, title, array, event, clickedId) {
        var i, list = "";
        var len = array.length;
        var node;
        if (this.tipNode[id]) {
            node = this.tipNode[id];
        } else {
            node = DA.dom.createDiv(id);
            node.style.position = "absolute";
            node.style.display = "block";
            this.tipNode[id] = node;
        }
        node.style.visibility = "hidden";
        for (i = 0; i < len; i ++) {
            list += ['<tr><td style="" onmouseout="this.parentNode.style.backgroudColor=\'red\';" onmouseover="this.parentNode.style.backgroudColor=\'black\';" onclick="var clickedDom = document.getElementById(\''+clickedId+'\'); clickedDom.innerHTML=\'' + array[i] + '\';DA.tip.close(\'DASpellCheckList\')" nowrap><font color="#000000">', array[i], '</font></td></tr>'].join("");
        }
        var html = [
            '<table border="0" width="150" cellspacing="0" cellpadding="0">',
            '<tr>',
            '  <td width="100%" bgcolor="#000000">',
            '  <table border="0" width="100%" cellspacing="1" cellpadding="0">',
            '  <tr>',
            '    <td width="100%" bgcolor="#FFFFE0" nowrap>',
            '      <font color="#000000">', title, '</font>',
            '    </td>',
            '  </tr>',
            '  <tr>',
            '    <td width="100%" bgcolor="#FFFFE0">',
            '    <table border="0" cellspacing="1">', list, '</table>',
            '    </td>',
            '  </tr>',
            '  </table>',
            '  </td>',
            '</tr>',
            '</table>'
        ].join("\n");

        node.innerHTML = html;
        DA.shim.open(node);
        node.style.visibility = "";

        var x = YAHOO.util.Event.getPageX(event); x += 5;
        var y = YAHOO.util.Event.getPageY(event); y += 5;
        var w = DA.dom.width(node);
        var h = DA.dom.height(node);

        var vw = YAHOO.util.Dom.getViewportWidth();
        var vh = YAHOO.util.Dom.getViewportHeight();

        if (x + w > vw - 5) {
            x = vw - w - 5;
            if (x < 5) {
                x = 5;
            }
        }
        if (y + h > vh - 5) {
            y = vh - h - 5;
            if (y < 5) {
                y = 5;
            }
        }

        this.move(id, x, y);
    },

    close: function(id) {
        var node = this.tipNode[id];

        node.style.visibility = "hidden";
        DA.shim.close(node);
    },

    move: function(id, x, y) {
        var node = this.tipNode[id];

        YAHOO.util.Dom.setXY(node, [x, y], true);
    }
};
        
DA.shim = {
    //Opens a shim, if no shim exists for the menu, one is created
    open: function(menu) {
        if (BrowserDetect.browser !== 'Explorer') {
            return; // IE Only
        }
        if (menu === null) {
            return;
        }
        var shim = this._getShim(menu);
        if (shim === null) {
            shim = this._createMenuShim(menu);
        }
                
        //Change menu zIndex so shim can work with it
        menu.style.zIndex = 100;
        
        var width = menu.offsetWidth;
        var height = menu.offsetHeight;
        
        shim.style.width = width;
        shim.style.height = height;
        shim.style.top = menu.style.top;
        shim.style.left = menu.style.left;
        shim.style.zIndex = menu.style.zIndex - 1;
        shim.style.position = "absolute";
        shim.style.display = "block";
        
        var offset;
        if (shim.style.top === "" || shim.style.left === "") {
            offset = this._cumulativeOffset(menu);
            shim.style.top  = offset[1];
            shim.style.left = offset[0];
        }
    },
    
    close: function(menu) {
        if (document.all === null) {
            return; // IE Only
        }
        if (menu === null) {
            return;
        }
        var shim = this._getShim(menu);
        if (shim !== null) {
            shim.style.display = "none";
        }
    },
    
    //Creates a new shim for the menu
    _createMenuShim: function(menu) {
        if (menu === null) {
            return null;
        }
        
        var shim = document.createElement("iframe");
        shim.scrolling = 'no';
        shim.frameborder = '0';
        shim.style.position = 'absolute';
        shim.style.top = '0px';
        shim.style.left = '0px';
        shim.style.display = 'none';
        
        shim.name = this._getShimId(menu);
        shim.id = this._getShimId(menu);
        
        //shim.src = DA.vars.imgRdir + "/null.gif";
        shim.src = 'javascript:false;';
        
        //Unremark this line if you need your menus to be transparent for some reason
        shim.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
        
        if (menu.offsetParent === null || menu.offsetParent.id === "") {
            window.document.body.appendChild(shim);
        } else {
            menu.offsetParent.appendChild(shim);
        }
        
        return shim;
    },
    
    //Creates an id for the shim based on the menu id
    _getShimId: function(menu) {
        if (menu.id === null) {
            return "__shim";
        } else {
            return "__shim" + menu.id;
        }
    },
    
    //Returns the shim for a specific menu
    _getShim: function(menu) {
        return document.getElementById(this._getShimId(menu));
    },
    
    _cumulativeOffset: function(element) {
        var valueT = 0, valueL = 0;
        do {
          valueT += element.offsetTop  || 0;
          valueL += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element);
        
        return [valueL, valueT];
    }
};

// overwrite YAHOO.widget.Node
if (YAHOO && YAHOO.widget && YAHOO.widget.Node) {
    YAHOO.widget.Node.prototype.getToggleLink = function() {
        return "DA.util.getTreeViewToggle(\'" + this.tree.id + "\'," + this.index + ")";
    };
    
    DA.util.getTreeViewToggle = function(id, index) {
        YAHOO.widget.TreeView.getNode(id, index).toggle();
    };
}


if (BrowserDetect.browser === 'Explorer' &&
    typeof(window.opener) === 'object' && 
    typeof(window.opener.DA) === 'object' &&
    typeof(window.opener.DA.session) === 'object') {
    // Take the global reference to DA.session from the one, single parent window for IE
    DA.session = window.opener.DA.session;
} else if (BrowserDetect.browser !== 'Explorer' &&
           window.opener &&
           window.opener.DA &&
           window.opener.DA.session) {
    // Take the global reference to DA.session from the one, single parent window for FireFox
    DA.session = window.opener.DA.session;
} else {    // This must be the main window.

    (function () { // Create a private scope

        var widgets = $H({}); // private hash
		var values = $H({});
        function _getStateInfo(w) {
            if ('function' !== typeof w.getUIStateInfo) { // duck typing?
                return;
            }
            return w.getUIStateInfo();
        }

        DA.session = {
        	Values: {
				registerValue: function(name, value) {
				values[name] = value;
				},
				getValue: function(name) {
				return values[name];
				}
			},

            UIState: {
               
                /**
                 * @method registerWidget
                 * @static
                 * @param name   {String} unique name/id for the widget
                 * @param widget {Object} instance of DA.*widget.*
                 */
                registerWidget: function(name, widget) {
                    widgets[name] = widget;
                },

                /**
                 * Retrieve state information for the given widget.
                 * 
                 * @method getStateInfo
                 * @static
                 * @param name   {String} unique name/id of the widget
                 * @returns      {Hash} object containing name/value pairs
                 *                      of state information 
                 */
                getStateInfo: function(name) {
                    var w = widgets[name];
                    if (!w) {
                        return;
                    }
                    return _getStateInfo(w);
                   
                },


                /**
                 * Get all the state info we have registered....
                 * @method getAllStateInfo
                 * @static
                 * @return {Array} Array of Objects, each with
                 *                          name: name of the widget
                 *                          info: hash containing state info
                 */
                getAllStateInfo: function() {
                    return widgets.map(function (ent /*entry*/) {
                        return {
                            name: ent.key,
                            info: _getStateInfo(ent.value)
                        };
                    });
                }

            }
        };

    })();

}

/*
 * Setup a per-window CustomEvent that fires 'gently' (i.e., after, and not continuously during)
 * on a window resize event.
 */
YAHOO.util.Event.on(window, 'load', function () {
  
    // To defeat IE's dehavior of continuouly firing the onresize event for the window object,
    // we use an onResize handler attached to a DIV (IE supports onresize for HTMLElements)
    function getResizingElem() {
        // Create a container div unless it is already present
        var outermost = document.getElementById('da_outermost'); // Try looking for the outermost DIV
        if (!outermost) {
            outermost = document.createElement('div');
            outermost.id = 'da_outermost';
            DA.dom.moveAllChildren(document.body, outermost);
            document.body.insertBefore(outermost, document.body.firstChild);
            Object.extend(outermost.style, {
                height  : "100%",
                width   : "100%",
                margin  : "0px",
                padding : "0px"
            });
        }
        return outermost;
    }

    // Code can subscribe to DA.windowController.onGentleResize instead of directly
    // listening to window.resize
    var customEvent = DA.windowController.onGentleResize;

    if (BrowserDetect.browser === 'Explorer') {
        // Explorer supports onResize for single HTMLElements; and this does not fire
        // continuously as in window.onresize
        YAHOO.util.Event.on(getResizingElem(), 'resize', DA.util.onlyonce(customEvent, customEvent.fire, 50));
    } else {
        // Most other browsers invoke window.onresize only once...
        YAHOO.util.Event.on(window, 'resize', customEvent.fire, customEvent, true);
    }

});

/**
 * TODO: Comments
 */
DA.init = function(disableESC) {
    if (DA.waiting && 'function' === typeof DA.waiting.init) {
        DA.waiting.init();
    }
    if (disableESC && BrowserDetect.browser === 'Explorer') {
		YAHOO.util.Event.addListener(window.document,"keydown",function(e){
			var elementType;
			if (BrowserDetect.browser === 'Explorer') {
				e = window.event;
				elementType = e.srcElement.type;
			} else {
				elementType = e.target.type;
			}
			if (elementType === 'text' || elementType === 'textarea') {
				if (YAHOO.util.Event.getCharCode(event) === Event.KEY_ESC) {
					return false;
				}
			}
			return true;
        }, window.document, true);
    }
    if (BrowserDetect.browser === 'Explorer') {
        YAHOO.util.Event.addListener(window.document.body, "dragover", function() {
            return false;
        }, window.document.body, true);
    }
};


/*
 * IMPORTANT:  YUI (YAHOO UI Library, V2.2.0 ~ V2.2.2)  Overrides!
 *
 * The folling code will be executed on load time, and will override the following
 * Classes/Objects/Methods of the YUI library:
 *
 * Why:     To support concurrent modification of (the list of) subscribers.
 *          This allows a subscriber to be unsubscribed *during* the firing
 *          of the event.
 *          ALSO: IE, sharing (CustomEvent) objects across windows
 *          causes some concurrency issues (JS in each window seems to
 *          run in it's own thread simultaneously!)
 *
 * Class:   YAHOO.util.CustomEvent
 * Method:  fire
 *          Will set a flag to indicate that the event is in a firing state.
 *          After the firing (after notinfyying all subscribers), it will
 *          flush the deleted (subscribers marked for removal) subscribers
 *          from the subscribers list.
 * Method:  _delete
 *          Will check if the event is currently firing, before attempting to
 *          directly remove the subscriber from the subscriber's list. If the
 *          event is in a fireing state, will simply mark the subscriber for
 *          later removal (after fire has completely notified all subscribers).
 */
(function(){

// Comparator for reverse sort 
var reverseComp = function (a,b) { return b-a; };

var CE = YAHOO.util.CustomEvent; // CE: alias for CustomEvent

// Flag to represent state
CE.prototype.isFiring = false; 
// Save the original fire, and _delete functions
CE.prototype._fire_orig = CE.prototype.fire;  
CE.prototype._delete_orig = CE.prototype._delete;

// Override fire, making it a wrapper that calls the original fire
CE.prototype.fire = function () {
    this.isFiring = true; // Disables direct deletion during iteration
    // Call the original method
    var ret = this._fire_orig.apply(this, arguments);
    if (this._pendingRemoval) { // Check if we have any queued deletions
        // For each queued deletion, call the original _delete method
        // id descending order of the indexes (so as to not mess up the
        // subscribers array)
        this._pendingRemoval.keys().sort(reverseComp).each(
            // TODO: For efficiency: Move this closure to a prototype method
            function (n) {
                this._delete_orig(n);
                delete this._pendingRemoval[n];
            }.bind(this)
        );
    }
    this.isFiring = false; // done
    return ret;

};

// Override _delete, making it a wrapper that calls the original _delete 
CE.prototype._delete = function (n) {
    // Check if the subscribers array is currently being iterated
    if (this.isFiring) {
        if (!this._pendingRemoval) { // Make a per-event cache of pending removals
            this._pendingRemoval = $H({}); // (if not already in existence)
        }
        this._pendingRemoval[n] = true; // This subscriber (whose index is n) will
        return;                         // be removed after the event firing is done
    }
    // Event is not currently firing; OK to delete straight away
    this._delete_orig(n);
};

})();

/* $Id: panel.js 2342 2013-05-17 03:10:38Z gx_sun $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/menu/panel.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

if (!DA || !DA.util) {
    throw "ERROR: missing DA.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Builds a panel menu. 
 * 
 * Usage: 
 *   var pmc = new DA.widget.PanelMenuController();
 * 
 * @class PanelMenuController
 * @uses 
 * @constructor
 * @param menuNode HTMLElement DOM node in which to draw the panel menu.
 */
DA.widget.PanelMenuController = function(menuNode, menuData) {
	this.menuId   = menuNode.id;
    this.menuNode = menuNode;
    this.menuData = menuData;
    
    if (DA.util.isEmpty(menuData.className)) {
        this.className = 'da_panelMenu';
    } else {
        this.className = menuData.className;
    }
    
    this.init();
};

/**
 * Members
 */
DA.widget.PanelMenuController.prototype = {

	menuId: null,
    
    menuNode: null,
    
    menuLeftNode: null,

    menuRightNode: null,
    
    menuData: null,
    
    className: null,
    
    init: function() {
        var html = '<div id="' + this.menuId + 'PMC" class="' + this.className + '">' +
                   '<div id="' + this.menuId + 'PMCL" class="' + this.className + 'Left"></div>' +
                   '<div id="' + this.menuId + 'PMCR" class="' + this.className+ 'Right"></div>' +
                   '<div id="' + this.menuId + 'PMCC" class="' + this.className + 'Center">' +
                   '<div id="' + this.menuId + 'PMCCL" class="' + this.className + 'CenterLeft"></div>' +
                   '<div id="' + this.menuId + 'PMCCR" class="' + this.className + 'CenterRight"></div>' +
                   '</div>' +
                   '</div>';
        this.menuNode.innerHTML = html;
        
        this.menuLeftNode  = YAHOO.util.Dom.get(this.menuId + 'PMCCL');
        this.menuRightNode = YAHOO.util.Dom.get(this.menuId + 'PMCCR');

        var i;
        var left     = '';
        var right    = '';
        var hides    = [];
        var disables = [];
        for (i = 0; i < this.menuData.leftOrder.length; i ++) {
            left += this._menuItem(this.menuData.leftOrder[i]);
            if (!this._visibleOk(this.menuData.leftOrder[i])) {
                hides.push(this.menuData.leftOrder[i]);
            }
            if (!this._enableOk(this.menuData.leftOrder[i])) {
                disables.push(this.menuData.leftOrder[i]);
            }
        }
        for (i = 0; i < this.menuData.rightOrder.length; i ++) {
            right += this._menuItem(this.menuData.rightOrder[i]);
            if (!this._visibleOk(this.menuData.rightOrder[i])) {
                hides.push(this.menuData.rightOrder[i]);
            }
            if (!this._enableOk(this.menuData.rightOrder[i])) {
                disables.push(this.menuData.rightOrder[i]);
            }
        }

        this.menuLeftNode.innerHTML  = left;
        this.menuRightNode.innerHTML = right;
				
        // CustomEvent				
        DA.customEvent.fire("PanelMenuControllerInitAfter", this, {hides: hides,disables: disables});				
        
        for (i = 0; i < hides.length; i ++) {
            this.hide(hides[i]);
        }
        for (i = 0; i < disables.length; i ++) {
            this.disable(disables[i]);
        }
    },
    
    select: function(e, func) {
        this.menuData.items[func].onSelect(e, this.menuData.items[func].args);
    },
    
    enable: function(func) {
        var elt = YAHOO.util.Dom.get(this._func2id(func, 't'));
        var elm = YAHOO.util.Dom.get(this._func2id(func, 'm'));
        var eli = YAHOO.util.Dom.get(this._func2id(func, 'i'));
        var elb = YAHOO.util.Dom.get(this._func2id(func, 'b'));
        var ela = YAHOO.util.Dom.get(this._func2id(func, 'a'));
        
        this.menuData.items[func].disable = 0;
        
        eli.src = this._smallIcon(func);
        YAHOO.util.Dom.removeClass(elt, this.className + 'ItemHidden');
        YAHOO.util.Dom.removeClass(elt, this.className + 'ItemGray');
        YAHOO.util.Dom.removeClass(elm, this.className + 'ItemNoPointer');
        YAHOO.util.Dom.removeClass(eli, this.className + 'ItemNoPointer');
        YAHOO.util.Dom.removeClass(elb, this.className + 'ItemHidden');
        YAHOO.util.Dom.removeClass(ela, this.className + 'ItemNoPointer');
    },
    
    disable: function(func) {
        var elt = YAHOO.util.Dom.get(this._func2id(func, 't'));
        var elm = YAHOO.util.Dom.get(this._func2id(func, 'm'));
        var eli = YAHOO.util.Dom.get(this._func2id(func, 'i'));
        var elb = YAHOO.util.Dom.get(this._func2id(func, 'b'));
        var ela = YAHOO.util.Dom.get(this._func2id(func, 'a'));
        
        this.menuData.items[func].disable = 1;
        
        eli.src = this._disableIcon(func);
        YAHOO.util.Dom.removeClass(elt, this.className + 'ItemHidden');
        YAHOO.util.Dom.addClass(elt, this.className + 'ItemGray');
        YAHOO.util.Dom.addClass(elm, this.className + 'ItemNoPointer');
        YAHOO.util.Dom.addClass(eli, this.className + 'ItemNoPointer');
        YAHOO.util.Dom.addClass(elb, this.className + 'ItemHidden');
        YAHOO.util.Dom.addClass(ela, this.className + 'ItemNoPointer');
    },
    
    show: function(func) {
        YAHOO.util.Dom.get(this._func2id(func)).style.display = '';
    },
    
    hide: function(func) {
        YAHOO.util.Dom.get(this._func2id(func)).style.display = 'none';
    },
    
    _id: function(func) {
        return this.menuId + 'MenuItem_' + func;
    },
    
    _title: function(func) {
        return this.menuData.items[func].title;
    },
    
    _alt: function(func) {
        return this.menuData.items[func].alt;
    },
    
    _smallIcon: function(func) {
        return this.menuData.items[func].smallIcon;
    },
    
    _bigIcon: function(func) {
        return this.menuData.items[func].bigIcon;
    },
    
    _disableIcon: function(func) {
        return this.menuData.items[func].disableIcon;
    },
    
    _className: function(func) {
        return this.menuData.items[func].className;
    },

    _hidden: function(func) {
        return this.menuData.items[func].hidden;
    },
    
    _disable: function(func) {
        return this.menuData.items[func].disable;
    },
    
    _pulldown: function(func) {
        return this.menuData.items[func].pulldown;
    },
    
    _visibleOk: function(func) {
        if (this._hidden(func) === 1) {
            return false;
        } else {
            return true;
        }
    },
    
    _enableOk: function(func) {
        if (this._disable(func) === 1) {
            return false;
        } else {
            return true;
        }
    },
    
    _selectOk: function(func) {
        if (DA.util.isFunction(this.menuData.items[func].onSelect)) {
            return true;
        } else {
            return false;
        }
    },    
    
    _pulldownOk: function(func) {
        if (this._pulldown(func)) {
            return true;
        } else {
            return false;
        }
    },
    
    _mouseover: function(e) {
        var el   = YAHOO.util.Event.getTarget(e);
        var id   = el.id;
        var func = this._id2func(id);
        
        if (this._enableOk(func)) {
            YAHOO.util.Dom.addClass(YAHOO.util.Dom.get(this._func2id(func, 't')), this.className + 'ItemHidden');
            
            el.src = this._bigIcon(func);
        }
    },
    
    _mouseout: function(e) {
        var el   = YAHOO.util.Event.getTarget(e);
        var id   = el.id;
        var func = this._id2func(id);
        
        if (this._enableOk(func)) {
            YAHOO.util.Dom.removeClass(YAHOO.util.Dom.get(this._func2id(func, 't')), this.className + 'ItemHidden');
            
            el.src = this._smallIcon(func);
        }
    },
    
    _click: function(e) {
        var el   = YAHOO.util.Event.getTarget(e);
        var id   = el.id;
        var func = this._id2func(id);
        
        if (this._enableOk(func)) {
            this.select(e, func);
        }
    },
    
    _id2func: function(id) {
        id.match(/\_([^\_]+)\_[^\_]+$/);
        return RegExp.$1;
    },
    
    _func2id: function(func, ex) {
        if (DA.util.isEmpty(ex)) {
            return this._id(func);
        } else {
            return this._id(func) + '_' + ex;
        }
    },

    _menuItem: function(func) {
         var title = this._title(func);
         var image = DA.imageLoader.tag(this._smallIcon(func), this._alt(func), { id: this._func2id(func, 'i') });
         var arrow = (this._pulldownOk(func)) ? DA.imageLoader.tag(DA.vars.imgRdir + '/ico_mail_arrow.gif', '', { id: this._func2id(func, 'a') }) : '';
         var noPointer = (this._pulldownOk(func)) ? '' : this.className + 'ItemNoPointer';
         var item = '<div id="' + this._func2id(func) + '" class="' + this._className(func) + '">' +
                    '<div id="' + this._func2id(func, 't') + '" class="' + this._className(func) + 'Top">' + DA.util.encode(title) + '</div>' +
                    '<div id="' + this._func2id(func, 'm') + '" class="' + this._className(func) + 'Middle">' + image + '</div>' +
                    '<div id="' + this._func2id(func, 'b') + '" class="' + this._className(func) + 'Bottom">' + arrow + '</div>' +
                    '</div>';
         
         var me = this;
         if (this._pulldownOk(func)) {
             if (this._selectOk(func)) {
                 YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseover", this._mouseover, this, true);
                 YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseout", this._mouseout, this, true);
                 YAHOO.util.Event.addListener(this._func2id(func, 'i'), "click", this._click, this, true);
                 
                 this.menuData.items[func].pulldownMenu = new DA.widget.PulldownMenuController(this._func2id(func, 'p'), this._func2id(func, 'b'), this._pulldown(func), {
                     onTrigger: function(e) {
                         var srcElem = YAHOO.util.Event.getTarget(e);
                         return srcElem && 
                            (DA.util.match(srcElem.id, me._func2id(func, 'b')) || 
                             DA.util.match(srcElem.id, me._func2id(func, 'a')));
                     }
                 });
             } else {
                 YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseover", this._mouseover, this, true);
                 YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseout", this._mouseout, this, true);
                 
                 this.menuData.items[func].pulldownMenu = new DA.widget.PulldownMenuController(this._func2id(func, 'p'), this._func2id(func), this._pulldown(func), {
                     onTrigger: function(e) {
                         var srcElem = YAHOO.util.Event.getTarget(e);
                         return srcElem && DA.util.match(srcElem.id, me._func2id(func));
                     }
                 });
             }
         } else {
             YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseover", this._mouseover, this, true);
             YAHOO.util.Event.addListener(this._func2id(func, 'i'), "mouseout", this._mouseout, this, true);
             YAHOO.util.Event.addListener(this._func2id(func, 'i'), "click", this._click, this, true);
         }
         
         return item;
    }
        
};
/* $Id: three-pane.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/layout/three-pane.js $ */
/*for JSLINT undef checks*/
/*extern DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/**
 * Generic 3-pane-view widget, with support for Drag-and-Drop
 * resizing of panes.
 * 
 * @module layout
 * @title 3-Pane View Widget 
 * @requires DA, TODO
 * @namespace DA.widget
 */

/**
 * Builds a ready-to-use 3-pane widget from a set of divs
 *
 * @class ThreePane
 * @uses YAHOO.util.Dom, YAHOO.util.DDProxy
 * @constructor
 * @param options (HASH) keys are:
 *                       leftPane         => HTMLElement,
 *                       rightPane        => HTMLElement,
 *                       rightTopPane     => HTMLElement,
 *                       rightBottomPane  => HTMLElement,
 *                       vDivider         => HTMLElement,
 *                       hDivider         => HTMLElement,
 */
DA.widget.ThreePane = function(options) {

    // FIXME: This can be done using YAHOO.util.Dom (addClass/removeClass)
    function setFirstClass(div, cName) {
        if(!div) {return;}
        var classes;
        if(div.className) {
            classes = div.className.split(' ');
            classes = classes.without(cName); 
            div.className = cName + ' ' + classes.join(' ');
        } else {
            div.className = cName;
        }
    }

    if (options) {
        
        // Copy the options
        Object.extend(this, options);

        setFirstClass(this.leftPane, "da_leftPane");
        setFirstClass(this.rightPane, "da_rightPane");
        setFirstClass(this.rightTopPane, "da_rightTopPane");
        setFirstClass(this.rightBottomPane, "da_rightBottomPane");

        setFirstClass(this.vDivider, "da_vDivider");
        setFirstClass(this.hDivider, "da_hDivider");

        this.init(); // TODO: what about this?

    }
};


// TODO: add methods.
DA.widget.ThreePane.prototype = {

    /**
     * See the CSS (three-pane.css) for how to customize the 
     * proxy drag element (selected by ID)
     * @property dragElId
     * @type {String} id of the drag proxy element
     */
    dragElId: "da_threePaneResizerDragProxy",
    
    /**
     * The DOM Element for the left-pane.
     * @property leftPane
     * @type {HTMLElement}
     */
    leftPane: null,

    /**
     * The DOM Element for the right-pane (parent of the right-top and right-bottom).
     * @property rightPane
     * @type {HTMLElement}
     */
    rightPane: null,

    /**
     * The DOM Element for the right top-pane.
     * @property rightTopPane
     * @type {HTMLElement}
     */
    rightTopPane: null,

    /**
     * The DOM Element for the right bottom-pane.
     * @property rightBottomPane
     * @type {HTMLElement}
     */
    rightBottomPane: null,

    /**
     * The DOM Element for the Vertical Divider (DIV element that vertically divides
     * the widget into left and right parts)
     * @property vDivider
     * @type {HTMLElement}
     */
    vDivider: null,

    /**
     * The DOM Element for the Horizontal Divider (DIV element that horizontally divides
     * the right pane of the widget into top and bottom panes)
     * @property hDivider
     * @type {HTMLElement}
     */
    hDivider: null,


    /**
     * Vertical drag-drop
     * Drag-drop object for the left-right resizer.
     * @property vdd
     * @type {Object} instance of YAHOO.util.DDProxy
     */
    vdd: null,


    /**
     * Horizontal drag-drop
     * Drag-drop object for the right-top/right-bottom resizer.
     * @property hdd
     * @type {Object} instance of YAHOO.util.DDProxy
     */
    hdd: null,

    /**
     * Called by the constructor.
     * @method init
     */
    init: function() {
        
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

        // TODO: Make vdd, hdd subclasses?

        var me = this;
        // Vertical drag/drop
        this.vdd = new YAHOO.util.DDProxy(this.vDivider, "vdd", config);
        // Horizontal drag/drop
        this.hdd = new YAHOO.util.DDProxy(this.hDivider, "hdd", config);
        
        // For the closures
        var _leftPane = this.leftPane;
        var _rightPane = this.rightPane;
        var _topPane = this.rightTopPane;
        var _bottomPane = this.rightBottomPane;

        var availablePercentage = 100 - ( ( (_topPane.offsetHeight + this.hDivider.offsetHeight) / this.rightPane.offsetHeight) * 100 );

        _bottomPane.style.height = availablePercentage + "%";

        var DOM = YAHOO.util.Dom;

        var startWidthLeft  = _leftPane.offsetWidth;
        var startWidthRight = _rightPane.offsetWidth;
        var startX = 0;

        this.vdd.onMouseDown = function(e) {
            startWidthLeft  = _leftPane.offsetWidth;
            startWidthRight = _rightPane.offsetWidth;
            startX = YAHOO.util.Event.getPageX(e);
            this.setInitPosition();
            // Now for the constraints...
            this.setXConstraint(_leftPane.offsetWidth - 100, me.rightPane.offsetWidth - 100);
            this.setYConstraint(0,0);
            var del = this.getDragEl();
            del.style.cursor = 'w-resize';
        };

        this.vdd.endDrag = function(e) {
            var lel = this.getEl();
            var del = this.getDragEl();
          
            // FIXME: copy-pasted from YUI, redundant code
            // Show the drag frame briefly so we can get its position
            // del.style.visibility = "";
            DOM.setStyle(del, "visibility", ""); 
            var curX = DOM.getX( del );
            DOM.setStyle(del, "visibility", "hidden"); 
            DOM.setStyle(lel, "visibility", ""); 
           
            var offset = curX - startX;
            var newLW = Math.max((startWidthLeft  + offset), 10);
            var newRW = Math.max((startWidthRight - offset), 10);
            var vDivW = me.vDivider.offsetWidth;

            var fullX = startWidthLeft + startWidthRight + vDivW;

            var leftPer  = Math.max(((newLW / fullX) * 100), 1); // Prevent anything from
            var rightPer = Math.max(((newRW / fullX) * 100), 1); // becoming less that 3%
            var vDivPer  = (vDivW/ fullX)  * 100;
            
            var excessPercentage = (leftPer + rightPer + vDivPer) - 100;
                rightPer -= excessPercentage;

            _leftPane.style.width = leftPer + "%";
            me.vDivider.style.width  = (100 - (leftPer + rightPer)) + "%"; 
            _rightPane.style.width = rightPer + "%";

            // Absolute positioning
            me.vDivider.style.left = leftPer + '%';
            
            me.onXResized(_leftPane, _topPane, _bottomPane);
            me.hdd.resetConstraints();
        };

        var startHeightTop = _topPane.offsetHeight;
        var startHeightBottom = _bottomPane.offsetHeight;
        var startY = 0;
    
        this.hdd.onMouseDown = function(e) {
            startHeightTop = _topPane.offsetHeight;
            startHeightBottom = _bottomPane.offsetHeight;
            startY = YAHOO.util.Event.getPageY(e);
            this.setInitPosition();
            // Now for the constraints...
            this.setYConstraint(startHeightTop - 50, startHeightBottom - 50);
            this.setXConstraint(0, 0);
            var del = this.getDragEl();
            del.style.cursor = 'n-resize';
        };
        
        this.hdd.endDrag = function(e) {
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
            var newTopH = Math.max((startHeightTop + offset), 10);
            var newBottomH = Math.max((startHeightBottom - offset), 10);
            
            var fullY = startHeightTop + startHeightBottom + me.hDivider.offsetHeight;
            var topPer = (newTopH/fullY) * 100;
            var bottomPer = (newBottomH/fullY) * 100;
            _topPane.style.height = topPer + "%";
            _bottomPane.style.height = bottomPer + "%";
            me.onYResized(_leftPane, _topPane, _bottomPane);
        };

    },


    /**
     * For the given value (dim), returns a 'sane' percentage value of the full amount.
     * The returned percantage will be clipped tp limit it within 5% and 95%. If dim
     * itself is a percentage (a string containing digits and ending with '%'), then it 
     * will be just returned as a (clipped) number.
     * @method _toGracefulPercs
     * @private
     * @param dim  {Number} Number of pixels
     * @param dim  {String} Number of pixels, or percentage itself (if it contains '%')
     * @param full {Number} A total value to base the percentage calculation on.
     * @returns    {Number} A value representing a smoothened percentage.
     */
    _toGracefulPercs: function(dim, full) {
        var dimPerc;
        // TODO: error handling?
        if (typeof dim === 'string' && dim.charAt(dim.length-1) === '%') {
           dimPerc = parseFloat(dim.substr(0,dim.length-1), 10);
        } else {
           dimPerc = (parseFloat(dim,10) / full) * 100;
        }
        // TODO: what id Nan?
        // Limit wo between 5% and 95%
        dimPerc = Math.max(dimPerc, 5);  // FIXME: hardcoding
        dimPerc = Math.min(dimPerc, 95); // FIXME: hardcoding
        return dimPerc;
    },


    /**
     * Set the widths for the leftPane, rightPane
     * @method _setLRWidth
     * @private
     * @param key {String} must either be 'left' or 'right'
     * @param w  {Number} Width in pixels
     * @param w  {String} Width in pixels, or percentage itself (if it contains '%')
     */
    _setLRWidth: function(key, w) {
        if (!key) { return ; }
        var otherPane = key === 'left' ? 'right' : (key === 'right' ? 'left' : null);
        if (!otherPane) {
            return;
        }
        var fullW = this.leftPane.offsetWidth + this.rightPane.offsetWidth + this.vDivider.offsetWidth;
        var paneWPerc = this._toGracefulPercs(w, fullW);
        if (!YAHOO.lang.isNumber(paneWPerc)) {
            return;
        }
        var vDivWPerc = (this.vDivider.offsetWidth / fullW) * 100;
        var otherPaneWPerc = 100 - (paneWPerc + vDivWPerc);
        this[key+"Pane"].style.width  = paneWPerc + "%";
        this[otherPane+"Pane"].style.width = otherPaneWPerc + "%";
        // ABS?
        this.vDivider.style.left = paneWPerc + '%';
        this.onXResized(this.leftPane, this.rightTopPane, this.rightBottomPane);
        this.hdd.resetConstraints();

    },


    /**
     * Set the width of the left pane. This will also balance out with the
     * right-pane's width.
     * @method setLeftWidth
     * @param w  {Number} Width in pixels
     * @param w  {String} Width in pixels, or percentage itself (if it contains '%')
     */
    setLeftWidth: function(w) {
        this._setLRWidth('left', w);
    },

    /**
     * Set the width of the right pane. This will also banance out with the
     * left-pane's width
     * @method setRightWidth
     * @param w  {Number} Width in pixels
     * @param w  {String} Width in pixels, or percentage itself (if it contains '%')
     */
    setRightWidth: function(w) {
        this._setLRWidth('right', w);
    },

    /**
     * Set the heights for the rightTopPane, rightBottomPane
     * @method _setTBHeight
     * @private
     * @param key {String} must either be 'rightTop' or 'rightBottom'
     * @param h  {Number} Height in pixels
     * @param h  {String} Height in pixels, or percentage itself (if it contains '%')
     */
    _setTBHeight: function(key, h) {
        if (!key) { return ; }
        var otherPane = key === 'rightTop' ? 'rightBottom' : (key === 'rightBottom' ? 'rightTop' : null);
        if (!otherPane) {
            return;
        }
        var fullH = this.rightTopPane.offsetHeight + this.rightBottomPane.offsetHeight + this.hDivider.offsetHeight;
        var paneHPerc = this._toGracefulPercs(h, fullH);
        if (!YAHOO.lang.isNumber(paneHPerc)) {
            return;
        }
        var hDivHPerc = (this.hDivider.offsetHeight / fullH) * 100;
        var otherPaneHPerc = 100 - (paneHPerc + hDivHPerc);
        this[key+"Pane"].style.height  = paneHPerc + "%";
        this[otherPane+"Pane"].style.height = otherPaneHPerc + "%";
        this.onYResized(this.leftPane, this.rightTopPane, this.rightBottomPane);
        this.vdd.resetConstraints();
    },


    /**
     * Set the height of the right-top pane. This will also balance out with the
     * right-bottom pane's height.
     * @method setRightTopHeight
     * @param h  {Number} Height in pixels
     * @param h  {String} Height in pixels, or percentage itself (if it contains '%')
     */
    setRightTopHeight: function(h) {
        this._setTBHeight('rightTop', h);
    },


    /**
     * Set the height of the right-bottom pane. This will also balance out with the
     * right-top pane's height.
     * @method setRightBottomHeight
     * @param h  {Number} Height in pixels
     * @param h  {String} Height in pixels, or percentage itself (if it contains '%')
     */
    setRightBottomHeight: function(h) {
        this._setTBHeight('rightBottom', h);
    },


    /**
     * Fired AFTER a width-resize has completed
     * (after the vertical rightPane-leftPane resize) 
     * @prototype onXResizing
     * @type function
     * @param leftPane HTMLElement
     * @param rightTopPane HTMLElement
     * @param rightBottomPane HTMLElement
     */
    onXResized:  Prototype.emptyFunction,

    /**
     * Fired AFTER a height-resize has completed
     * (after the horizontal rightTopPane-rightBottomPane resize) 
     * @prototype onYResized
     * @type function
     * @param leftPane HTMLElement
     * @param rightTopPane HTMLElement
     * @param rightBottomPane HTMLElement
     */
    onYResized:  Prototype.emptyFunction,


    /**
     * Support for DA.session.UIState
     * @method getUIStateInfo
     * @returns {Hash} a hash of UI state information, mainly the width and height of the
     *                 leftPane, rightTopPane, rightBottomPane
     */
    getUIStateInfo: function () {
        return {
            leftPane: {
                width : this.leftPane.offsetWidth,
                height: this.leftPane.offsetHeight
            },
            rightTopPane: {
                width : this.rightTopPane.offsetWidth,
                height: this.rightTopPane.offsetHeight
            },
            rightBottomPane: {
                width : this.rightBottomPane.offsetWidth,
                height: this.rightBottomPane.offsetHeight
            }
        };
    }

};




/* $Id: panel.js 1622 2008-06-16 07:38:27Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/layout/panel.js $ */
/*for JSLINT undef checks*/
/*extern $A $H DA YAHOO */




// Begin a Private scope..
(function() {

var clrRdir = DA.vars ? (DA.vars.clrRdir) : null;

DA.widget.Panel = function(id, config) {
    // Dynamically set our StyleSheet based on the color-directory path
    $H({
        ".da_panel div.left-edge"             : "mf_l_c.gif",
        ".da_panel div.right-edge"            : "mf_r.gif",
        ".da_panel div.top-left"              : "mf_head_l.gif",
        ".da_panel div.top-right-edge"        : "mf_head_r.gif",
        ".da_panel div.bottom-edge-left"      : "mf_l_b.gif",
        ".da_panel div.bottom-edge-right-tip" : "mf_r_b.gif",
        ".da_panel div.top-edge-left"         : "mf_l_t.gif",
        ".da_panel div.top-edge-right-tip"    : "mf_r_t.gif"
    }).each(function(entry){
        var selector = entry.key; 
        var fileName = entry.value;
        var rule = clrRdir ? 
                "background-image: url(" + clrRdir + "/" + fileName + ")" :
                "border : 1px solid #aaa";
        DA.dom.createCSSRule(selector, rule);
    });
    this.config = Object.extend({
            titleBar : true
    }, config || {});
    this.init(id);
};


function div(attrs) {
    var el = document.createElement('div');
    if (attrs) {
        $H(attrs).each(function(attr){
            var key = attr.key;
            var val = attr.value;
            if (key === 'class' || key === 'className') {
                el.className = val;
            } else {
                el.setAttribute(key,val);
            }
        });
    }
    var children = [];
    if (arguments.length === 2) {
        // second arg could be an array
        if (arguments[1].constructor === Array) {
            children = arguments[1];
        } else {
            children.push(arguments[1]);
        }
    } else if (arguments.length > 2) {
        children = $A(arguments);
        children.shift();
    }
    if (children && children.each) {
        children.each(function(child){
            if ('string' === typeof child) {
                el.appendChild(document.createTextNode(child));
            } else if (child.tagName) { // is a DOM element?
                el.appendChild(child);
            }
        });
    }
    return el;
}

var templates = {
    panelBottom: div({className: 'bottom-edge-left'},
                     div({className: 'bottom-edge-right-tip'}))
};




DA.widget.Panel.prototype = {



    /**
     * DOM Element of the title node. (applicaple if titleBar == true)
     * @property titleNode 
     * @type {Object} HTMLElement
     */
    titleNode: null,

    /**
     * DOM Element of the right-corner of the titleBar. (applicaple if titleBar == true)
     * @property topRightNode
     * @type {Object} HTMLElement
     */
    topRightNode: null,


    init: function(panelId) {
        var id = panelId ? panelId : "da_panel_" + (new Date()).getTime();
        this.contentsNode = div({className: 'contents'});
        var topNode;

        if (this.config.titleBar) {
            this.titleNode    = div({className: 'useful'});
            this.topRightNode = this.titleNode.cloneNode(true);
            topNode = div({className: 'top-left'}, 
                          div({className: 'top-right-edge'}),
                          div({className: 'top-right'}, this.topRightNode),
                          this.titleNode);
        } else {
            topNode = div({className: 'top-edge-left'},
                          div({className: 'top-edge-right-tip'}));
        }

        var bottom = templates.panelBottom.cloneNode(true);
        var middle = div({className: 'middle'},
                             div({className: 'left-edge'},
                                 div({className: 'right-edge'}, this.contentsNode)));

        this.node =  div({id: id, className: 'da_panel'},
                         topNode, middle, bottom);
        
        this._topNode    = topNode;
        this._middleNode = middle;
        this._bottomNode = bottom;

        YAHOO.util.Event.on(window, 'resize', this.fixHeights, this, true);

    },


    /**
     * TENTATIVE METHOD
     * Based on the panel's parent DOM node's height, recalculates the height of the
     * middle node (the content, or the portion excluding the header/lower border)
     * @method fixHeights
     */
    fixHeights: function () {
        // Bug found during performance testing/profiling: 
        // The correct DOM Element on which to base the total height for the
        // percentage calculation should be the parentNode, not the node itself.
        var referenceNode = this.node.parentNode ? this.node.parentNode : this.node;
        var totalH = referenceNode.offsetHeight;
        if (totalH <= 0) { // Avoid divide-by-zero errors
            return;
        }
        var fixedHeights = this._topNode.offsetHeight + this._bottomNode.offsetHeight;
        // FIXME: The IE fix which involves setting an onresize for a DIV, leads to
        //        this method being called unnecessarily (onmousedown of threePane.hdd)
        var remaining = (totalH - fixedHeights) - 1; // kindness (1px)
        remaining = Math.max(remaining, 0); // Protect from negative values
        this._middleNode.style.height = ((remaining/totalH)*100) + "%";
    }




};

})();
/* $Id: message.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/locale/message.js $ */
/*for JSLINT undef checks*/
/*extern DA */
/**
 * TODO: comments
 */
if (!DA || !DA.util) {
    alert("ERROR: missing DA.js or DA.util"); // TODO: formalize/cleanup
}

if (typeof DA.locale === "undefined") {
    DA.locale = {};
    DA.locale.message = {};
}

DA.locale.GetText = {
    t_: function(key) {
        var text = DA.locale.GetText._replace(DA.locale.GetText._get(key), arguments);

        return(text);
    },
    
    _get: function(key) {
        var text;
        
        if (!DA.util.isEmpty(DA.locale.message.custom[key])) {
            text = DA.locale.message.custom[key];
        } else if (!DA.util.isEmpty(DA.locale.message.core[key])) {
            text = DA.locale.message.core[key];
        } else {
            text = key;
        }
        
        return text;
    },
    
    _replace: function(t, args) {

        var text = t.replace(/\%\d+/g, function(s) {
            var n = s.replace(/^\%/, "");
                n = parseInt(n, 10);
            
            if (n > 0 && !DA.util.isEmpty(args[n])) {
                return args[n];
            } else {
                return "";
            }
        });
        
        return text;
    }
};
/* $Id: info.js 2510 2014-11-05 05:07:38Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/file/info.js $ */
/*for JSLINT undef checks*/
/*extern $H DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

DA.file = {
   list2String: function(filelist, cols, max) {
        var i, l, f;
        var string = '';
        var Bdown_link;
        
        if (DA.util.isEmpty(cols)) {
            cols = 3;
        }
        
        if (filelist) {
        	if (filelist.length >= 2 && DA.vars.config.soft_install === 1) {
        		Bdown_link = filelist[0].link.replace(/(.;)/g,", 'all'$1");
        		string += '<span style="white-space: nowrap;" id="down_all_button" >' +
        					'<span style="float:right;white-space: nowrap;" onclick="' + Bdown_link + '' +
        					'" class="da_fileInformationListLink">'+ DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_download_all.gif', '', {width:80,height:15,border:0})+ '</span></span>';
        		string += '<span style="white-space: nowrap;" id="save_all_button" >' +
                            '<span style="float:right;white-space: nowrap;" onclick = "window.__messageViewer.showsaveattachestolibdialog(event.clientX, event.clientY);"' + 
                            '" class="da_fileInformationListLink">'+ DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_library_save.gif', '', {width:80,height:15,border:0})+ '</span></span>';
                }
            for(i = 0; i < filelist.length; i ++) {
                l = '';
                f = filelist[i];
                
                if (DA.util.isEmpty(f.name)) {
                    continue;
                } else {
                	f.name = DA.util.jsubstr4attach(f.name);
                    l = this.object2String(f, true, true, true);
                }
                
                if (!DA.util.isEmpty(l)) {
                    l = '<span style="white-space: nowrap;">' + l + '</span>';
                }
                
                if (!DA.util.isEmpty(l)) {
                    if (DA.util.isNumber(max) && i + 1 >= max) {
                        string += '<span style="white-space: nowrap;">' + l + '&nbsp;<b>..</b></span>\n';
                        break;
                    } else {
                        string += '<span style="white-space: nowrap;">' + l + '&nbsp;</span>\n';
                    }
                    if (cols > 0 && (i + 1) % cols === 0) {
                        string += '<br>';
                    }
                }
            }
        }
        
        return string;
    },
    
    object2String: function(f, icon, link, document) {
        var string = DA.util.encode(f.name);
        
        if (!DA.util.isEmpty(f.link) && link) {
            string = '<span onclick="' + f.link + '" class="da_fileInformationListLink" title="'+f.title+'">' + string + '</span>';
        }
        
        if (!DA.util.isEmpty(f.icon) && icon) {
            string = DA.imageLoader.tag(f.icon, f.alt, { align: 'absmiddle' }) + string;
        }
        
        if (!DA.util.isEmpty(f.document) && document) {
            string += '<span onclick="' + f.document + '" class="da_fileInformationListLink">' +
                      DA.imageLoader.tag(DA.vars.imgRdir + '/ico_fc_docsave.gif', '', { align: 'absmiddle' }) +
                      '</span>';
        }
        
        return string;
    },
    
    openDownload4New: function(MAID, AID, ALL) {
    	var Proc, url, pwin, flg;
    	if (DA.vars.config.download_type === 'simple' && typeof(ALL) === 'undefined') {
    		url = DA.vars.cgiRdir + '/ma_ajx_download.cgi?proc=mail&maid=' + MAID + '&aid=' + AID;
    		flg=1;
    	} else { 
			if(ALL==='all'){
				Proc  = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=Bdownload%26maid=' + MAID + '%26aid=' + AID;
			} else {
        		Proc  = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=mail%26maid=' + MAID + '%26aid=' + AID;
			}
        	url = DA.vars.cgiRdir + '/down_pop4ajax.cgi?proc='+Proc;
    	}
        pwin = DA.windowController.winOpenNoBar(url, '', 400, 450, flg);
    },
    
    openDownload4Detail: function(FID, UID, AID, ALL) {
    	var pwin, url, Proc, flg;
    	if (DA.vars.config.download_type === 'simple' && typeof(ALL) === 'undefined'){
    		url = DA.vars.cgiRdir+'/ma_ajx_download.cgi?proc=detail&fid='+FID+'&uid='+UID+'&aid='+AID;
    		flg=1;
    	} else {
    		if(ALL==='all'){
    			Proc=DA.vars.cgiRdir+'/ma_ajx_download.cgi%3fproc=Bdownload%26fid='+FID+'%26uid='+UID+'%26aid='+AID;
    		} else {
    			Proc=DA.vars.cgiRdir+'/ma_ajx_download.cgi%3fproc=detail%26fid='+FID+'%26uid='+UID+'%26aid='+AID;
    		}
         	url = DA.vars.cgiRdir + '/down_pop4ajax.cgi?proc='+Proc;
    	}
         pwin=DA.windowController.winOpenNoBar(url,'','400','450',flg);
    },
    
    openDocument4New: function(MAID, AID, TYPE) {
        var Cgi  = (TYPE === 1) ? "ow_folder_select.cgi" : "lib_foldersel.cgi";
        var Proc = Cgi + '%3fproc=mail%20maid=' + MAID + '%20aid=' + AID;
        var Img  = 'pop_title_attachsave.gif';
        DA.windowController.isePopup(Proc, Img, 400, 450, MAID);
    },
    
    openDocument4Detail: function(FID, UID, AID, TYPE) {
        var Cgi  = (TYPE === 1) ? "ow_folder_select.cgi" : "lib_foldersel.cgi";
        var Proc = Cgi + '%3fproc=detail%20fid=' + FID + '%20uid=' + UID + '%20aid=' + AID;
        var Img  = 'pop_title_attachsave.gif';
        DA.windowController.isePopup(Proc, Img, 400, 550, FID + "_" + UID);
    },
    
    openAttach: function(MAID) {
        var Proc = 'ma_ajx_attach.cgi%3fmaid=' + MAID;
        var Img  = 'pop_title_attachfile.gif';
        DA.windowController.isePopup(Proc, Img, 500, 450, MAID);
    }
};

DA.file.InformationListController = function(node, filelist, cbhash, cfg) {
    this.fileNode = node;
    
    if (cbhash) {
        if (DA.util.isFunction(cbhash.onRemove)) {
            this.onRemove = cbhash.onRemove;
        }
        if (DA.util.isFunction(cbhash.onPopup)) {
            this.onPopup = cbhash.onPopup;
        }
    }
    
    if (cfg) {
        if (cfg.maxView) {
            this.maxView = cfg.maxView;
        }
        if (cfg.lineHeight) {
            this.lineHeight = cfg.lineHeight;
        }
        if (cfg.documentEnabled) {
            this.documentEnabled = cfg.documentEnabled;
        }
        if (cfg.popupEnabled) {
            this.popupEnabled = cfg.popupEnabled;
        }
        if (cfg.deleteEnabled) {
           this.deleteEnabled = cfg.deleteEnabled;
        }
    }
    
    this.init(filelist);
};

DA.file.InformationListController.prototype = {
    fileNode: null,
    
    fileData: null,
    
    fileNdata: null,
    
    onRemove: Prototype.emptyFunction,
    
    onPopup: Prototype.emptyFunction,
    
    maxView: 0,
    
    lineHeight: 0,
    
    totalSize: 0,
    
    documentEnabled: false,
    
    popupEnabled: false,
    
    deleteEnabled: true,
    
    init: function(filelist) {
        // style.display = "none" fixes an apperance-bug on IE
        // TODO: if this.fileNode is not an HTMLElement, this will throw an exception
        this.fileNode.style.display = "none";
        
        this.fileData  = {};
        this.fileNdata = {};
        this.addList(filelist);
    },
    
    add: function(f, noresize, perf) {
        var l  = {};
        var n  = {};
        var me = this;
        
        if (DA.util.isEmpty(f.aid)) {
            return;
        }

        // div 生成
        n.lineNode     = document.createElement('div');
        n.iconNode     = document.createElement('span');
        n.nameNode     = document.createElement('span');
        n.documentNode = document.createElement('span');
        n.popupNode    = document.createElement('span');
        n.deleteNode   = document.createElement('span');
            
        // class 指定
        n.lineNode.className     = 'da_fileInformationListLine da_fileInformationListLineAid_' + f.aid;
        n.iconNode.className     = 'da_fileInformationListIcon';
        n.nameNode.className     = 'da_fileInformationListName';
        n.documentNode.className = 'da_fileInformationListDocument';
        n.popupNode.className    = 'da_fileInformationListPopup';
        n.deleteNode.className   = 'da_fileInformationListDelete';
        
        // append
        n.lineNode.appendChild(n.iconNode);
        n.lineNode.appendChild(n.nameNode);
        n.lineNode.appendChild(n.deleteNode);
        this.fileData[f.aid]  = l;
        this.fileNdata[f.aid] = n;
        
        this.aid(f.aid);
        this.icon(f.aid, f.icon, f.alt);
        this.name(f.aid, f.name);
        this.title(f.aid, f.title);
        this.size(f.aid, f.size);
        this.link(f.aid, f.link, f.warn);
        this.document(f.aid, f.document);
        this.popup(f.aid);
        this['delete'](f.aid);
        this.linkStyle(f.aid);
        this.fileNode.appendChild(n.lineNode);
        
        // Make sure we are performing calculations with a parent whose
        // offsetHeight is not 0...
        // This is to prevent lineHeight from getting set to 0 (Bug in FF (not FF's fault))
        if (perf !== true) {
            this.fileNode.style.display = "block";
            this.lineHeight = this.height(f.aid);
        }
        
        if (!noresize) {
            this.resize();
            this.scroll();
        }
    },

    addList: function(filelist, perf) {
        var i;
        
        // for performance
        if (perf === true) {
            this.ugNode.style.display = 'none';
        }
        if (filelist) {
            for (i = 0; i < filelist.length; i ++) {
                this.add(filelist[i], true, perf);
            }
            this.resize();
            this.scroll();
        }
    },
    
    linkStyle: function(aid) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(l.link)) {
            YAHOO.util.Dom.removeClass(n.title1Node, 'da_fileInformationListLink');
            YAHOO.util.Dom.removeClass(n.nameNode, 'da_fileInformationListLink');
            YAHOO.util.Dom.removeClass(n.emailNode, 'da_fileInformationListLink');
            YAHOO.util.Dom.removeClass(n.title0Node, 'da_fileInformationListLink');
            YAHOO.util.Dom.addClass(n.title1Node, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.addClass(n.nameNode, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.addClass(n.emailNode, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.addClass(n.title0Node, 'da_fileInformationListNoLink');
        } else {
            YAHOO.util.Dom.removeClass(n.title1Node, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.removeClass(n.nameNode, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.removeClass(n.emailNode, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.removeClass(n.title0Node, 'da_fileInformationListNoLink');
            YAHOO.util.Dom.addClass(n.title1Node, 'da_fileInformationListLink');
            YAHOO.util.Dom.addClass(n.nameNode, 'da_fileInformationListLink');
            YAHOO.util.Dom.addClass(n.emailNode, 'da_fileInformationListLink');
            YAHOO.util.Dom.addClass(n.title0Node, 'da_fileInformationListLink');
        }
    },
    
    list: function() {
        var aid;
        var list = [];
        
        for (aid in this.fileData) {
            if (aid.match(/^\d+$/) && aid > 0) {
                list.push($H(this.fileData[aid]));
            }
        }
        
        return list;
    },
    
    get: function(aid, key) {
        if (DA.util.isEmpty(key)) {
            return this.fileData[aid];
        } else {
            return this.fileData[aid][key];
        }
    },
    
    width: function(aid) {
        if (this.fileNdata[aid]) {
            return DA.dom.width(this.fileNdata[aid].lineNode);
        } else {
            return 0;
        }
    },
    
    height: function(aid) {
        if (this.fileNdata[aid]) {
            return DA.dom.height(this.fileNdata[aid].lineNode);
        } else {
            return 0;
        }
    },
    
    count: function() {
        var key, count = 0;
        
        for (key in this.fileData) {
            if (!DA.util.isFunction(this.fileData[key])) {
                count ++;
            }
        }
        
        return count;
    },
    
    total: function() {
        var count = this.count();
        
        if (count > 0) {
            if (DA.vars.system.max_send_size_visible === 'on' && DA.vars.system.max_send_size && DA.vars.system.max_send_size > 0) {
                if (this.totalSize >= DA.vars.system.max_send_size) {
                    return '&nbsp;<font color=red>(&nbsp;' + this.totalSize + '&nbsp;/&nbsp;' + DA.vars.system.max_send_size + '&nbsp;)</font>&nbsp;KB';
                } else {
                    return '&nbsp;(&nbsp;' + this.totalSize + '&nbsp;/&nbsp;' + DA.vars.system.max_send_size + '&nbsp;)&nbsp;KB';
                }
            } else {
                return '&nbsp;(&nbsp;' + this.totalSize + '&nbsp;)&nbsp;KB';
            }
        } else {
            return '';
        }
    },
    
    resize: function() {
        var count;
        var height=0;
        
        if (this.maxView > 0) {
            count = this.count();
            
            if (count > 0) {
            	if(this.fileNode.firstChild){
                    height=this.fileNode.firstChild.offsetHeight;
            	}
            	if(this.lineHeight>height){
                    height=this.lineHeight;
            	}
                if (count > this.maxView) {
                    YAHOO.util.Dom.addClass(this.fileNode, 'da_fileInformationListOverflowAuto');
                    DA.dom.sizeHeight(this.fileNode, height * this.maxView);
                } else {
                    YAHOO.util.Dom.removeClass(this.fileNode, 'da_fileInformationListOverflowAuto');
                    DA.dom.sizeHeight(this.fileNode, height * count);
                }
                this.fileNode.style.display = '';
            } else {
                this.fileNode.style.display = 'none';
            }
        }
    },
    
    dummy: function(aid) {
        var n    = this.fileNdata[aid];
        var html = n.iconNode.innerHTML + n.nameNode.innerHTML;
        
        return html;
    },
    
    aid: function(aid) {
        this.fileData[aid].aid = (DA.util.isEmpty(aid)) ? '' : aid;
    },
    
    icon: function(aid, icon, alt) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(icon)) {
            l.icon = '';
            l.alt  = '';
            n.iconNode.innerHTML = '';
            n.iconNode.style.display = 'none';
        } else {
            l.icon = icon;
            l.alt  = (DA.util.isEmpty(alt)) ? '' : alt;
            n.iconNode.innerHTML = DA.imageLoader.tag(icon, alt, {'class': 'da_fileInformationListIconImage'});
            n.iconNode.style.display = '';
        }
    },
    
    name: function(aid, name) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(name)) {
            l.name = '';
            n.nameNode.innerHTML = '';
            n.nameNode.style.display = 'none';
        } else {
            l.name = name;
            n.nameNode.innerHTML = DA.util.encode(DA.util.jsubstr4attach(name, 25));
            n.nameNode.style.display = '';
        }
    },
    
    title: function(aid, title) {
        var l = this.fileData[aid];
                
        if (DA.util.isEmpty(title)) {
            l.title = '';
        } else {
            l.title = title;
        }
    },
    
    size: function(aid, size) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(size)) {
            l.size = 0;
        } else {
            l.size = size;
            
            this.totalSize += l.size;
        }
    },
    
    link: function(aid, link, warn) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(link)) {
            l.link = '';
            n.nameNode.onclick = Prototype.emptyFunction;
        } else {
            l.link = link;
            if (DA.util.isEmpty(warn)) {
                l.warn = '';
                n.nameNode.onclick = function() {
                    eval(link);
                };
            } else {
                l.warn = warn;
                n.nameNode.onclick = function() {
                    DA.util.warn(warn);
                    eval(link);
                };
            }
        }
    },
    
    document: function(aid, document) {
        var l = this.fileData[aid];
        var n = this.fileNdata[aid];
        
        if (DA.util.isEmpty(document) || !this.documentEnabled) {
            l.document = '';
            n.documentNode.innerHTML = '';
            n.documentNode.onclick = Prototype.emptyFunction;
            n.documentNode.style.display = 'none';
        } else {
            l.document = document;
            n.documentNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_fc_docsave.gif', '', { 'class': 'da_fileInformationListDocument' });
            n.documentNode.onclick = function() {
                eval(document);
            };
            n.documentNode.style.display = '';
        }
    },
    
    popup: function(aid) {
        var l  = this.fileData[aid];
        var n  = this.fileNdata[aid];
        var me = this;
        
        if (String(aid).match(/^\d+$/) && this.popupEnabled) {
            n.popupNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/scroll_btn_down02.gif', '', { 'class': 'da_fileInformationListPopup' });
            n.popupNode.onclick = function(e) {
                me.onPopup(e, aid);
            };
            n.popupNode.style.display = '';
        } else {
            n.popupNode.style.display = 'none';
        }
    },
    
    'delete': function(aid) {
        var l  = this.fileData[aid];
        var n  = this.fileNdata[aid];
        var me = this;
        
        if (String(aid).match(/^\d+$/) && this.deleteEnabled) {
            n.deleteNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_close_s.gif', '', { 'class': 'da_fileInformationListDelete' });
            n.deleteNode.onclick = function(e) {
                me.remove(aid);
                me.onRemove(e, aid);
            };
            n.deleteNode.style.display = '';
        } else {
            n.deleteNode.style.display = 'none';
        }
    },
    
    remove: function(aid) {
        this.fileNdata[aid].lineNode.innerHTML = '';
        this.fileNdata[aid].lineNode.parentNode.removeChild(this.fileNdata[aid].lineNode);
        
        this.totalSize -= this.fileData[aid].size;
        
        delete this.fileData[aid];
        delete this.fileNdata[aid];
        
        this.resize();
    },
    
    clear: function() {
        this.fileNode.innerHTML = '';
        this.fileNode.style.display = 'none';
        this.fileData  = {};
        this.fileNdata = {};
    },
    
    scroll: function() {
        try {
            this.fileNode.scrollTop = this.fileNode.scrollHeight;
        } catch(e) {
        }
    }
};



/* $Id: dialog.js 2482 2014-09-29 01:49:42Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/dialog/dialog.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
var BrowserDetect = window.BrowserDetect;
/**
 * Builds a Dialog with a YUI container widget.
 * @constructor
 * @param {HTMLElement}	node The element representing the Dialog
 * TODO: write
 * @class Dialog
 * @namespace DA.widget
 */

DA.widget.Dialog = function(nodeId, hash, buttons, cbhash) {
    this.nodeId   = nodeId;
    this.buttons  = buttons;
    
    this.setWidth(hash.width);
    this.setHead(hash.head);
    this.setBody(hash.body);
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

DA.widget.Dialog.prototype = {

    node: null,

    nodeId: null,
    
    head: null,
    
    body: null,
    
    width: null,
    
    buttons: null,
    
    dialog: null,
    
    focusId: null,
    
    /**
     * Enter Function.
     */
    onEnter: function() {
        return true;
    },
    
    /**
     * Cancel Function.
     */
    onCancel: function() {
        return true;
    },
    
    _headId: function() {
        return this.nodeId + '_hd';
    },
    
    _bodyId: function() {
        return this.nodeId + '_bd';
    },
    
    childId: function(id) {
        return this.nodeId + '_' + id;
    },
    
    childClass: function(id) {
        return this.nodeId + '_' + id;
    },
        
    /**
     * set dialog
     * @method setDialog
     * @public
     */
    setDialog: function() {
        var node = DA.dom.createDiv(this.nodeId);
        var html = '<div id="' + this._headId() + '" class="hd">' + this.head + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>' +
                   '<div id="' + this._bodyId() + '" class="bd">' + this.body + '</div>';        
        
        this.node = node;
        this.node.innerHTML = html;
        
        this.dialog = new YAHOO.widget.Dialog(this.nodeId, {
            width: this.width,
            visible: false,
            constraintoviewport: true,
            buttons: (DA.util.isEmpty(this.buttons)) ? undefined : this.buttons,
            zindex: 200
        });
        
        this.dialog.render();
    
    },
    
    setHead: function(head) {
        this.head = head;
    },
    
    setBody: function(body) {
        this.body = body;
    },
    
    setWidth: function(width) {
        this.width = width;
    },
    
    setCbhash: function(cbhash) {
        if (DA.util.isFunction(cbhash.onEnter)) {
            this.onEnter = cbhash.onEnter;
        }
        if (DA.util.isFunction(cbhash.onCancel)) {
            this.onCancel = cbhash.onCancel;
        }
    },
    
    setListener: function() {
    },
    
    _enter: function() {
        if (this.onEnter()) {
            this.hide();
        }
    },
    
    _cancel: function() {
        if (this.onCancel()) {
            this.hide();
        }
    },
    
    /**
     * Show dialog on position (x, y).
     * @method show
     * @param {String} x Dialog's left.
     * @param {String} y Dialog's top.
     * @public
     */
    show: function(x, y) {
        if (DA.util.isNumber(x) && DA.util.isNumber(y)) {
            this.position(x, y);
        }
        this.dialog.show();
        if (this.focusId) {
            YAHOO.util.Dom.get(this.focusId).focus();
        }
    },
    
    /**
     * Hide the dialog
     * @method hide
     * @public
     */
    hide: function() {
        this.dialog.hide();
    },
    
    /**
     * reset the dialog
     * @mehotd reset
     * @public
     */
     
    position: function(x, y) {
        this.dialog.moveTo(x, y);
    },
    
    reset: function(head, body) {
        this.dialog.setHeader(head);
        this.dialog.setBody(body);
        this.setListener();
    },
    
    refresh: function() {
        this.dialog.setHeader(this.head);
        this.dialog.setBody(this.body);
        this.setListener();
    },
    
    remove: function() {
        this.node.innerHTML = "";
        this.node.parentNode.removeChild(this.node);
    }
};

/**
 * Builds a Message Dialog with a YUI container widget.
 * @constructor
 * @param {HTMLElement}	node the element representing the Dialog
 * @class MessageDialog
 * @namespace DA.widget
 */

DA.widget.MessageDialog = function(nodeId, title, message, cbhash) {
    this.nodeId = nodeId;

    this.setHead(title);
    this.setBody(message);
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

Object.extend(DA.widget.MessageDialog.prototype, DA.widget.Dialog.prototype);
DA.widget.MessageDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.widget.MessageDialog.prototype.setBody = function(message) {
    message = (DA.util.isEmpty(message)) ? '' : message;
    
    this.body = DA.util.encode(message) +
                '<input type=button id="' + this.childId('ok') + '" class="' + this.childClass('ok') + '" value="' + DA.locale.GetText.t_("DIALOG_OK_BUTTON") + '">';
};
DA.widget.MessageDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('ok'), "click", this._enter, this, true);
};

/**
 * Builds a String Changer Dialog with a YUI container widget.
 * @constructor
 * @param {HTMLElement}	node the element representing the Dialog
 * @class StringChangerDialog
 * @namespace DA.widget
 */
 
DA.widget.StringChangerDialog = function(nodeId, title, string, cbhash) {
    this.nodeId = nodeId;

    this.setHead(title);
    this.setBody(string);
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

Object.extend(DA.widget.StringChangerDialog.prototype, DA.widget.Dialog.prototype);
DA.widget.StringChangerDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.widget.StringChangerDialog.prototype.setBody = function(string) {
    this.body = '<input type=text id="' + this.childId('text') + '" class="' + this.childClass('text') + '" value="' + DA.util.encode(string) + '">' +
                '<input type=button id="' + this.childId('set') + '" class="' + this.childClass('set') + '" value="' + DA.locale.GetText.t_("DIALOG_SETTING_BUTTON") + '">';
    this.focusId = this.childId('text');
};
DA.widget.StringChangerDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('set'), "click", this._enter, this, true);
};
DA.widget.StringChangerDialog.prototype.setString = function(string) {
    var el = YAHOO.util.Dom.get(this.childId('text'));
    el.value = string;
};

/**
 * Builds a File Upload Dialog with a YUI container widget.
 * @constructor
 * @param {HTMLElement}	node the element representing the Dialog
 * @class FileUploadDialog
 * @namespace DA.widget
 */

DA.widget.FileUploadDialog = function(nodeId, title, cbhash) {
    this.nodeId = nodeId;

    this.setHead(title);
    this.setBody();
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

Object.extend(DA.widget.FileUploadDialog.prototype, DA.widget.Dialog.prototype);
DA.widget.FileUploadDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.widget.FileUploadDialog.prototype.setBody = function() {
    this.body = '<form id="' + this.childId('form') + '">' +
                '<input type=file id="' + this.childId('file') + '" class="' + this.childClass('file') + '" name="path" value="">' +
                '<input type=button id="' + this.childId('set') + '" class="' + this.childClass('set') + '" value="' + DA.locale.GetText.t_("DIALOG_SETTING_BUTTON") + '">' +
                '</form>';
    this.focusId = this.childId('file');
};
DA.widget.FileUploadDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('set'), "click", this._enter, this, true);
};

/**
 * Builds a wait-mask with Yahoo Dialog widget.
 * @constructor
 * @param {String} nodeId Waiting image,get from DA.vars.waitImage.
 * @class MaskDialog
 * @extends DA.widget.Dialog
 * @namespace DA.widget
 */
DA.widget.MaskDialog = function(nodeId, message, image, buttons, from) {
    this.nodeId = nodeId;
    this.setBody(message, image, buttons, from);
    this.setDialog();
};

Object.extend(DA.widget.MaskDialog.prototype, DA.widget.Dialog.prototype);

DA.widget.MaskDialog.prototype.setDialog = function() {
    var node = DA.dom.createDiv(this.nodeId);
    var html = '<div id="' + this._bodyId() + '" class="bd">' + this.body + '</div>';        
    
    this.node = node;
    this.node.innerHTML = html;
    
    this.dialog = new YAHOO.widget.Dialog(this.nodeId, {
        fixedcenter: true,
        close: false,
        draggable: false,
        modal: true,
        visible: false,
        zindex: 999
    });
    
    this.dialog.render();
};
DA.widget.MaskDialog.prototype.setBody = function(message, image, buttons, from) {
    message = (DA.util.isEmpty(message)) ? '' : message;
    image   = (DA.util.isEmpty(image)) ? DA.vars.imgRdir + '/popy_wait.gif' : image;
    var array;
    var ie6 = 0;
	if (buttons){
		image   = '<center><img src="' + image + '"></center>';
	} else {
		image   = '<img src="' + image + '">';
	}
    if(BrowserDetect.browser === "Explorer" && BrowserDetect.version === 6 && from === "transmit"){
    	array = [
			'<div class="' + this._bodyId() + '">',
			'<table><tr><td>' + image + '<br></td></tr>',
			'<tr><td><center><span style="font-size:20px;">' + message + '</span></center><br></td></tr>'
		];
		ie6 = 1;
	} else {
		array = [
			'<div class="' + this._bodyId() + '">',
			image + '<br>',
			'<center><span>' + message + '</span></center><br>'
		];
	}

	var i, l;
	if (buttons) {
		l = buttons.length;
		if(ie6 === 1){
			array.push('<tr><td>');
		}
		array.push('<center><span>');
		for (i = 0; i < l; i ++) {
			array.push('<button id="' + this._bodyId() + 'Button' + i + '">' + buttons[i].string + '</button>');
		}
		array.push('</center></span><br>');
		if(ie6 === 1){
			array.push('</td></tr></table>');
		}
	}
	array.push('</div>');
	
	this.body = array.join("") + "";               
};
DA.widget.MaskDialog.prototype.refresh = function(buttons) {
    this.dialog.setBody(this.body);
	var i, l, el;
	if (buttons) {
		l = buttons.length;
		for (i = 0; i < l; i ++) {
			if (buttons[i].onclick) {
				el = YAHOO.util.Dom.get(this._bodyId() + 'Button' + i);
				el.onclick = buttons[i].onclick;
			}
		}
	}
};
DA.waiting = {
    wtDialog: null,
    init: function () {
        this.wtDialog = new DA.widget.MaskDialog("da_waitingDialog", '');
    },
    show: function (message, image, buttons, from) {
        this.wtDialog.setBody(message, image, buttons, from);
        this.wtDialog.refresh(buttons);
        this.wtDialog.show();
    },
    hide: function () {
        this.wtDialog.hide();
    },
    remove: function () {
        this.wtDialog.remove();
    }
};

DA.widget.TipDialog = function(nodeId, DlgTitle, msgTitle, message) {
    this.nodeId = nodeId;
    this.setBody(msgTitle ,message);
    this.setDialog(DlgTitle);
};

Object.extend(DA.widget.TipDialog.prototype, DA.widget.Dialog.prototype);

DA.widget.TipDialog.prototype.setDialog = function(DlgTitle) {
    var node = DA.dom.createDiv(this.nodeId);
    var html = '<div id="' + this._bodyId() + '" class="bd">' + this.body + '</div>';        
    
    this.node = node;
    this.node.innerHTML = html;
    
    this.dialog = new YAHOO.widget.Dialog(this.nodeId, {
        fixedcenter: true,
        close: true,
        draggable: true,
        modal: false,
        visible: false,
        zindex: 999,
        width: '230px'
    });
    this.dialog.setHeader('<b>' + DlgTitle + '</b>');
    
    this.dialog.render();
};
DA.widget.TipDialog.prototype.refresh = function() {
    this.dialog.setBody(this.body);
};

DA.widget.TipDialog.prototype.setBody = function(msgTitle, message, picture) {
    message = (DA.util.isEmpty(message)) ? '' : message;
    picture   = (DA.util.isEmpty(picture)) ? DA.vars.imgRdir + '/popy_ok.gif' : picture;

	this.body = document.createElement('div');
	this.body.imageP = document.createElement('p');
	this.body.imageP.image = document.createElement('img');
	this.body.msg1 = document.createElement('span');
	this.body.msg2 = document.createElement('p');
	this.body.buttons = document.createElement('div');
	this.body.buttons.button1 = document.createElement('input');
	this.body.buttons.button2 = document.createElement('input');
	
	this.body.className = this._bodyId();
	this.body.imageP.image.src = picture;
	this.body.msg1.innerHTML = message;
	this.body.msg2.innerHTML = msgTitle;
	this.body.buttons.button1.type = 'button';
	this.body.buttons.button1.value = DA.locale.GetText.t_("CONFIRM_CANCEL_BUTTON");
	this.body.buttons.button2.type = 'button';
	this.body.buttons.button2.value = DA.locale.GetText.t_("CONFIRM_SEND_BUTTON");
	
	this.body.imageP.appendChild(this.body.imageP.image);
	this.body.appendChild(this.body.imageP);
	this.body.appendChild(this.body.msg1);
	this.body.appendChild(this.body.msg2);
	this.body.buttons.appendChild(this.body.buttons.button1);
	this.body.buttons.appendChild(this.body.buttons.button2);
	this.body.appendChild(this.body.buttons);
};

DA.widget.TipDialog.prototype.setBtnsOnclick = function(funcs) {
	this.body.buttons.button1.onclick = funcs[0];
	this.body.buttons.button2.onclick = funcs[1];
};

DA.widget.TipDialog.prototype.setFocus = function(obj) {
	obj.focus();
};

DA.tipDlg = {
    TipDialog: null,
    init: function (DlgTitle, msgTitle, message, btnBack) {
        this.TipDialog = new DA.widget.TipDialog("da_TipDialog", DlgTitle, msgTitle, message);
        var onclickfunc1;
        if (btnBack === 'preview') {
        	onclickfunc1 = function() {
        		if (DA.tipDlg.isInit()) {
					DA.tipDlg.hide();
				}
			};
        } else {
        	onclickfunc1 = function() {
        		window.__messageEditor.back();
        	};
        }
        var onclickfunc2 = function() {
			window.__messageEditor.transmit();
		};
		this.TipDialog.setBtnsOnclick([onclickfunc1, onclickfunc2]);
    },
    show: function () {
        this.TipDialog.refresh();
        this.TipDialog.show();
        this.TipDialog.setFocus(this.TipDialog.body.buttons.button1);
    },
    hide: function () {
        this.TipDialog.hide();
    },
    isInit: function () {
    	if (this.TipDialog) {
    		return true;
    	} else {
    		return false;
    	}
    }
};

DA.widget.SaveAttachesToLibDialog = function(nodeId, title, attaches, fid, uid, cbhash) {
    this.nodeId = nodeId;
    this.setHead(title);
    if(attaches.order){
        this.setBody(attaches,fid,uid);
    }
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

Object.extend(DA.widget.SaveAttachesToLibDialog.prototype, DA.widget.Dialog.prototype);
DA.widget.SaveAttachesToLibDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.widget.SaveAttachesToLibDialog.prototype.setBody = function(attaches,fid,uid) {
    var attacheslength = attaches.order[0].length;
    var tempbody = '';
    var aid;
    for( var i = 0 ; i < attacheslength ; i++ ) {
        aid = i + 1 ;
        tempbody += '<input type=checkbox name=' + this.childClass('attaches') + ' value="' + aid + '"></input>' + '<span title="' + attaches.items[i].title +'">' + DA.util.jsubstr4attach(attaches.items[i].title, 22) + '</span><br>';
    }
    tempbody += '<input type=button id="' + this.childClass('save') + '" value="' + DA.locale.GetText.t_("DIALOG_SAVE_BUTTON") + '">';
    this.body = tempbody;
};
DA.widget.SaveAttachesToLibDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('save'), 'click', this._enter, this, true);
};

DA.widget.SearchMoveFolderDialog = function(nodeId, title, cbhash) {
    this.nodeId = nodeId;
    this.setHead(title);
    this.setCbhash(cbhash);
    this.setBody();
    this.setDialog();
    this.setListener();
};

Object.extend(DA.widget.SearchMoveFolderDialog.prototype, DA.widget.Dialog.prototype);
DA.widget.SearchMoveFolderDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.widget.SearchMoveFolderDialog.prototype.setBody = function() {
    var tempbody =  '<select style = "width:200px;" id="da_searchMoveToFid">' + DA.vars.options.folder_tree + '</select>' ;
    tempbody += '<input type=button id="' + this.childClass('save') + '" value="' + DA.locale.GetText.t_("DIALOG_MOVE_BUTTON") + '">';
    this.body = tempbody;
};
DA.widget.SearchMoveFolderDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('save'), 'click', this._enter, this, true);
};
/* $Id: tables.js 2259 2011-08-11 09:06:26Z ch_zhang $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/tables/tables.js $ */
/*for JSLINT undef checks*/
/*extern BrowserDetect DA Prototype YAHOO */
/*
 * Copyright (c) 2007, DreamArts. All rights reserved.
 * TODO: message
 * version: ??
 *
 * Utilities for HTML Table manipulation in Javascript.
 */

if (!DA || !DA.widget) {
    throw "ERROR: missing DA.js"; // TODO: formalize/cleanup
}

/**
 * Set of utility functions related to tables.
 */
DA.tableutils = {
    /**
     * TODO: Should this be general?
     * TODO: This seems to be slow on Firefox.
     * @method getComputedWidths
     * @param  {NodeList} (usually a (Node) list of TABLE COL elements)
     * @returns {Array} an array of numbers representing the 
     *                  computed widths of each node (typically column)
     */
    getComputedWidths: function(list /*HTMLNodeList*/) {
        // TODO: null-checks
        var widths = []; // Array of positive numbers
        for (var i=0; i<list.length; i++) {
            widths.push( list[i].offsetWidth );
        }
        return widths;
    }
};

/**
 * Generate a new HTML TABLE DOM element with the given parameters.
 * <p>
 * TODO: <ol>
 *         <li> Must this be refacored to DA.widget.Tables.createNew? </li>
 *         <li> How about some more generic JS-DOM/CSS mapping? Like ParenScript? </li>
 *       </ol>
 * </p>
 * @method makeATable
 * @static
 * @param rows integer The number of rows
 * @param columns {Int}   The number of columns
 *                        OR,
 *                {Array} An array of hashes, each hash
 *                        having data that describes on column:
 *                        Example:
 *                        [ { name: "Column Title", width: "10%" }, ... ]
 *                        COL elements will be created, and each will be
 *                        given a generated className of 'colN'... (starting from 0..(n-1))
 * @param styleInfo {Object} A hash containing CSS (className) information
 *                           Key: element name,  Value: CSS class name
 *                           Example:
 *                           { table: "my_table_Style", td: "my_cell_Style" }
 * @param data {Array} (AoA) An array of arrays; each element contains HTML that
 *                     Will be inserted into the cells.
 *                     Example:
 *                     [ [1, "A", "abc"],  [2, "B", "def"], .. ]
 * @return HTMLTableElement
 */
DA.widget.makeATable = function(rows,      /* int */
                                columns,   /* int OR array of hashes */
                                styleInfo, /* hash */
                                data       /* array of arrays */) 
{
    var ncolumns = 1;   // The number of columns; use the integer mode as default
    var thr, colgroup;  // Tentative references to be made to the TABLE head row and COLGROUP
    styleInfo = styleInfo ? styleInfo : {}; // Just to avoid NP checks
    rows = rows ? rows : 1; // Default number of rows is one
    var hasHead = false;
    var thnames = [];
    if(!columns)   { 
        ncolumns = 1; // use the integer mode
    } else {
        if ('number' === typeof columns) { // Using simple (integer) mode
            ncolumns = columns;
        } else {
            if (columns.each) { // see if this is an array
                // Using verbose mode (Array of Hashes)
                colgroup = document.createElement("colgroup");
                hasHead = false;
                thnames = columns.map(function(_col, index){
                    var col = document.createElement("col");
                    col.width = _col.width;
                    col.className = 'col' + index;
                    colgroup.appendChild(col);
                    if (_col.name) { hasHead = true; }
                    return hasHead ? _col.name : '&nbsp'; 
                });
                colgroup.span = thnames.length;
                if (hasHead) {
                    thr = document.createElement("tr");
                    if (styleInfo.tr) { thr.className = styleInfo.tr; }
                    thnames.each(function(name) {
                        var th = document.createElement("th");
                        if (styleInfo.th) { th.className = styleInfo; } 
                        th.innerHTML = name;
                        thr.appendChild(th);
                    });
                }
                ncolumns = thnames.length; // 
            }
        }
    }

    data = data ? data : [];

    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    if (colgroup) {
        table.appendChild(colgroup);
    }
    var thead;
    if (thr) {
        thead = document.createElement("thead");
        thead.appendChild(thr);
        table.appendChild(thead);
    }
    table.appendChild(tbody);
    table.className = styleInfo.table;
    tbody.className = styleInfo.table;
    var tr;
    var td;
    var rowData;
    var stripeClass;
    for (var j,i=0; i<rows; i++) { // for each row
        tr = document.createElement("tr");
        // striping!
        stripeClass = (i % 2) ? 'odd' : 'even';
        tr.className = styleInfo.tr ? 
                (styleInfo.tr + ' ' + stripeClass) : stripeClass;
        rowData = data[i] || [];
        for (j=0; j<ncolumns; j++) { // for each cell
            td = document.createElement("td");
            if(styleInfo.td) { td.className = styleInfo.td; }
            td.innerHTML = rowData[j] || "&nbsp;";
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    return table;

};


/*
 * Everything below needs YUI's drag-and-drop
 */
if (YAHOO && YAHOO.util && YAHOO.util.DragDrop) {

/*
 * A utility object which encapsulates table column resizing 
 * (usually for 2 adjacent columns).<p>
 * The methods moveLeft and moveRight allow the column divider to
 * be moved a few pixels left or right, thus resizing both the
 * columns.
 * @class ColumnResizer
 * @constructor
 * @param table {Object} HTMLTableElement (&tl;table&gt;)
 * @param config Hash Configuration options:
 *                     maintainPercentage: (Boolean) if true, 
 *                                         set the width in percentage 
 *                                         instead of pixels.
 *                     minWidth:           (Integer) minimum column width
 *                                         in PIXELS.
 */
DA.widget.ColumnResizer = function(table  /*HTMLTableElement*/,
                                   config /*hash*/) {
    this.table = table; // TODO: really a table? null?
    // TODO: We are assuming that we have cols. If we don't,
    //       then we need to 'treat' this table and generate
    //       a simple list of cols.
    // TODO: We are also making the assumption that IF there
    //       are cols, they are just a simple sequence
    this._cols = this.table.getElementsByTagName("col");
    // TODO: copy-pasted from TwoColumnResizer... any ideas?
    this.config = Object.extend({
        maintainPercentage: true, // TODO: no point actually setting this to false?
        minWidth:           20
    }, config || {});

};

DA.widget.ColumnResizer.prototype = {

    /**
     * @field table HTMLTableElement
     */
    table: null,

    /**
     * @field _cols HTMLNodeList (of HTMLCol elements)
     * @private
     */
    _cols: null,

    /**
     * @method getComputedWidths
     * @return Array of numbers
     */
    getComputedWidths: function() {
        return DA.tableutils.getComputedWidths(this._cols);
    },

    /**
     * Move the divider of the 2 given columns (l is the index of the left column) 
     * pixels pixels to the right.
     * <p><b>WARNING</b>DOES NOT check if the param is valid (is an integer or not)
     * @method moveRight
     * @param l Index of the left column (index begins from 0)
     * @param pixels Integer
     */
    moveRight: function(l/*number*/, pixels/*number*/) {
        this.preResize(l, pixels);
        if (this.tableLayoutHack) {
            this.table.style.tableLayout = "auto";
        }
        var compWidths = this.getComputedWidths();
        var minW = this.config.minWidth;
        var lwidth = compWidths[l];
        var rwidth = compWidths[l+1];
        // Only if the current width is greater than the minimum allowed, check
        // whether applying the pixel width resize will break things (IE barfs when negative
        // width values are set)
        if ((rwidth > minW) && (rwidth - pixels <= minW)) { pixels = rwidth - minW; }
        if ((lwidth > minW) && (lwidth + pixels <= minW)) { pixels = minW - lwidth; }
        compWidths[l] = (lwidth + pixels);
        compWidths[l+1] = (rwidth - pixels);
        this._setNewWidths(compWidths);
        if (this.tableLayoutHack) {
            this.table.style.tableLayout = "fixed";
        }
        this.postResize(l, pixels);
    },

    /**
     * @methods _setNewWidths
     * @private
     */
    _setNewWidths: function(widths /*Array of numbers*/) {
        if (!widths || (widths.length !== this._cols.length)) {
            return;
        }
        var widthsToSet = (this.config.maintainPercentage) ?
               this._fairPercentages(DA.util.toPercentages(widths)) : widths;
        var func = (this.config.maintainPercentage) ? 
               this.setColWidthPerc : this.setColWidth;
        widthsToSet.each( func.bind(this) );
        widthsToSet.each( func.bind(this) );
    },

    /**
     * Converts the given array of percentages (which could be floats)
     * to rounded-values (integers), based on a crude rule of 'fairness'.
     * All the values are rounded-off to their nearest integer, and 
     * and depending on whether the sum of rounded-off percentages
     * is equal to, greater than, or less than 100, adjusts the values
     * so that the values that were affected the most by the rounding-off
     * get compensated.
     * FIXME: This is probably slow. Too much Prototype nonsense.
     * FIXME: Oh, and it has nothing specific to do with tables.
     * 
     * @method _fairPercentages
     * @private
     * @param arr {Array} Array of numbers.
     * @returns {Array} array of positive integers.
     */
    _fairPercentages: function(arr) {
        var approxes = []; // approximations
        // Get an array of rounded-off values.
        var no_zero_flag = true;
        var rounded = arr.map(function(p,i){
            var r = Math.round(p); // r: rounded value
            if(r<1){
            	no_zero_flag = false;
            }
            approxes.push({  
                i:      i,   // The index of the rounded value
                profit: r-p  // benefit (or negative benefit) of the rounding off
            });
            return r;
        });
        // See if the rounding-off yielded a neat total of 100 (100%)
        var total = rounded.inject(0, function (a,b){return a+b;});
        if (total===100&&no_zero_flag) {
            return rounded; // good enough; we're done
        }
        // Compensation
        if (total > 100) {
            // Re-order the approximations;
            // positive round-offs first
            approxes.sortBy(function (a,b){
                return a.profit > b.profit;
            });
            // For each extra 1-percent, compensate
            // the rounded value which benefitted the most
            (total-100).times(function(i){
                var index = approxes[i].i;
                --rounded[index];
            });    
        } else if (total < 100) {
            // Re-order the approximations;
            // negative round-offs first
            approxes.sortBy(function (a,b){
                return b.profit > a.profit;
            });
            // For each missing 1-percent, compensate
            // the rounded value which was reduced the most 
            (100-total).times(function(i){
                var index = approxes[i].i;
                ++rounded[index];
            });    
        }
        var num;
        var sum = 0;
        var temp = 0;
        for(var i = 0; i < rounded.length; i ++){
        	if(rounded[i]<1){
        		sum = sum + (1-rounded[i]);
        		rounded[i]=1;
        	}
        	if(rounded[i]>temp){
        		temp = rounded[i];
        		num = i;
        	}
        }
        if(sum!==0){
        	rounded[num]=rounded[num]-sum;
        }
        // Should now be all compensated and 
        // total 100%.
        return rounded;

    },

    /**
     * @method _setColWidth
     * @param  w {number} width in pixels
     * @param  colIndex {number} index of the column
     * @protected
     */
    setColWidth: function(w, colIndex) {
        this._cols[colIndex].width = (w + "px");
    },

    /**
     * @method _setColWidthPerc
     * @param  w {number} width in percentage
     * @param  colIndex {number} index of the column
     * @protected
     */
    setColWidthPerc: function(w, colIndex) {
        this._cols[colIndex].width = (w + "%");
    },


 
    // FIXME: Dirty browser detected hack - Mozilla needs this
    tableLayoutHack:  (BrowserDetect.browser === 'Mozilla' || BrowserDetect.browser === 'Firefox'),

    /**
     * pre-hook
     * @method preResize
     * @protected
     */
    preResize: Prototype.emptyFunction,
     
    /**
     * post-hook
     * @method postResize
     * @protected
     */
    postResize: Prototype.emptyFunction

};

/*
 * A utility object which encapsulates table column resizing 
 * (usually for 2 adjacent columns).<p>
 * The methods moveLeft and moveRight allow the column divider to
 * be moved a few pixels left or right, thus resizing both the
 * columns.
 * @class TwoColumnResizeHandle
 * @constructor
 * @param table   {HTMLTableElement} (&tl;table&gt;)
 * @param elem    {HTMLElement} node that will actually be the drag element.
 * @param resizer {Object} instance of ColumnResizer
 * @param index   {int} Index of the column division (Example: 0 - first, second column)
 */ 
DA.widget.TwoColumnResizeHandle = function(
        table   /*HTMLTableElement*/,
        elem    /*HTMLElement*/, 
        resizer /*TwoColumnResizer*/,
        index   /*number*/) {
    this.index = index;
    this.resizer = resizer;
    this.table = table;
    this.init(elem); // YUI wants this
    // TODO: null checks, sanity checks
    var msg; // TODO: cleanup
    if ('number' !== typeof index) {
        msg = "ERROR: index not supplied for TwoColumnResizeHandle";
        throw msg;
    }
};

// Inherit from YAHOO DragDrop, and override:
YAHOO.lang.extend(DA.widget.TwoColumnResizeHandle, YAHOO.util.DragDrop, {
    
    /**
     * @property resizer
     * @type {Object} Instance of ColumnResizer
     */
    resizer: null,

    /**
     * An invisible div that follows the mouse on drag.
     * (Mary had a little lamb)
     * @property _lamb
     * @private
     * @type {HTMLDivElement}
     */
    _lamb: null,

    /**
     * Out custom proxy element; a thin line that shows where
     * the table columns will divide.
     * @property _proxyEl
     * @private
     * @type {HTMLDivElement}
     */
    _proxyEl: null,

    /**
     * @see YAHOO.util.DragDrop#onMouseDown
     */
    onMouseDown: function(e) {
     
        // Create a proxy element: A thin vertical line (a DIV)
        // that will follow the mouse on the X-axis indicating
        // where the columns will be resized
        this._proxyEl = document.createElement("div");
        var proxyEl = this._proxyEl;
        proxyEl.className = 'da_columnResizeLineActive';
        // Attach the proxy to the body; it is now positioned 
        // relative to the window
        document.body.appendChild(this._proxyEl);

        var startX = YAHOO.util.Event.getPageX(e);
        var tableY = YAHOO.util.Dom.getY(this.table);

        Object.extend(proxyEl.style, {
            height: this.table.parentNode.offsetHeight + "px",
            left: startX + "px",
            top:  tableY + "px"
        });

        // Calculate X-constraints: Use the width fields
        var widths = this.resizer.getComputedWidths();
        var rcolW = widths[this.index + 1];
        var lcolW = widths[this.index];
        // TODO: use something smarter that resizer.config.minWidth
        var minW = this.resizer.config.minWidth;

        // YUI stuff
        this.setInitPosition();
        this.setXConstraint( lcolW-minW,  rcolW-minW );

        // Create an invisible, follow-around div
        this._lamb = document.createElement("div");
        this._lamb.innerHTML = '&nbsp;';
        document.body.appendChild(this._lamb);
        var lambStyle = this._lamb.style;
        Object.extend(lambStyle, { // TODO: optimize
            height : "10px",
            width  : "10px",
            cursor : 'w-resize',
            position : 'absolute',
            // Place the invisible follow-around div in such a way that
            // it's center falls where the mouse is
            top : (YAHOO.util.Event.getPageY(e) - 4) + "px" ,
            left : (startX - 4) + "px"
        });
        
    },

    /**
     * @see YAHOO.util.DragDrop#onDrag
     */
    onDrag: function(e) {
        var curX = YAHOO.util.Event.getPageX(e);
        // Check constraints TODO: see if YUI can do this for us (think it should be)
        if (curX < this.minX || curX > this.maxX) { return; }
        this._proxyEl.style.left = curX + "px";
        this._lamb.style.left = (curX - 4) + "px";
        this._lamb.style.top = (YAHOO.util.Event.getPageY(e) - 4) + "px";
    },

    /**
     * @see YAHOO.util.DragDrop#onMouseUp
     */
    onMouseUp: function(e) {
        var curX = YAHOO.util.Dom.getX( this._proxyEl );
        var offset = curX - this.startPageX;
        this.resizer.moveRight(this.index, offset);
        this._proxyEl.style.display = "none";
        // Remove the invisible follow-around div
        document.body.removeChild(this._lamb);
        // Remove the thin vertical column divider line
        document.body.removeChild(this._proxyEl);
    }

});

}

/* :vim:expandtab */
/* $Id: io.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/io/io.js $ */
/*for JSLINT undef checks*/
/*extern DA */
/**
 * TODO: comments
 */
if ('undefined' === typeof DA) {
    alert("ERROR: need DA.js");
} else {
    if (! DA.io) {
        DA.io = {};
    }
}

/**
 * TODO: comments, docs
 *
 */
DA.io.Manager = {
    data: {},
    
    _serialize: function(url) {
        return url + '_' + DA.util.getTime();
    },
    
    loading: function(url) {
        var s;
        
        if (DA.util.isEmpty(url)) {
            return '';
        } else {
            s = this._serialize(url);
            
            this.data[s] = true;
            
            return s;
        }
    },
    
    done: function(s) {
        if (!DA.util.isEmpty(s)) {
            delete this.data[s];
        }
    },
    
    isActive: function() {
        var key, active = false;
        
        for (key in this.data) {
            if (!DA.util.isFunction(this.data[key])) {
                active = true; break;
            }
        }
        
        return active;
    }
};
/*for JSLINT undef checks*/
/*extern $H Ajax DA YAHOO*/
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.io) {
    alert("ERROR: missing DA.js or io.js"); // TODO: formalize/cleanup
}


/**
 * TODO: comments, docs
 *
 */
DA.io.JsonIO = function(url, defaultParams){
   
    
    this.defaultParams = defaultParams;
    this.url = DA.util.setUrl(url);

};

(function(){

// Private
var isObject, isFunction;
try {
	isObject = YAHOO.lang.isObject;
	isFunction = YAHOO.lang.isFunction;
} catch(e) {
	isObject = function(obj) {
		return DA.util.isObject(obj) || DA.util.isFunction(obj);
	};
	isFunction = DA.util.isFunction;
}

DA.io.JsonIO.prototype = {

    defaultParams: undefined,

    /**
     * This will be be called after the JSON response has been eval'ed
     * to a Javascript object.
     * Users of JsonIO must assign a function to callback to be able to
     * do something with the object (eval'ed server response)
     * @method callback 
     * @param obj  {Object} Eval'ed server JSON response
     * @param args {Hash}   Reference to the actual parameters used
     * @protected
     */
    callback: function(obj, args) { /* EMPTY FUNCTION */ },

    /**
     * This will be called when an error has been encountered.
     * Users of JsonIO must assign a function to errorHandler
     * to be able to customize the error handling method.
     * Default errorHandler just pops up a Javascript alert...
     * @param e          {Object} error information in a hash 
     * @param actualArgs {Object} Reference to the actual original arguments.
     * @method errorHandler
     * @protected
     */
    errorHandler: function(e, actualArgs) { 
        /*
        if (e && e.type == 'INVALID_CONTENTTYPE') {
            // TODO
            //something.innerHTML = e.body; 
        }
        */
        var s = "";
        var v;
        for (var p in e) {
            try {
                v = e[p];
                if (typeof v === 'function') {continue;}
                s += (p + ":" + v + "\n");
                // TODO: truncate (or rather, quite appending to) s
                //       when the string gets too long...
            } catch (er) {  }
        }
        DA.log("JSON-IO ERROR:" + e, 'error', "JSONIO");
        alert("ERROR: JSON-IO: response was: " + s);
    },
    
    htmlHandler: function(e) {
        var win = DA.windowController.winOpen();
        
        win.document.open();
        win.document.write(e.body);
        win.document.close();
        
        window.close();
    },

    /**
     * The HTTP method to use. Must be either 'get' or 'post'. The default
     * is set as 'post'.
     * @property method
     * @type {String}
     */
    method: 'post',

    /**
     * Perform the IO.
     * Optionally, use the parameters passed (a HASH of name-value pairs)
     * @method execute
     * @param params   {Hash}     (optional) hash of name-value pairs
     * @param callback {Function} (optional) use this as the callback
     * @param callback {Hash}     (optional) DWR-style callback meta-data:
     *                            properties callback, errorHandler are functions
     */
    execute: function( params , callback ) {

        var _params = undefined;

        var callbackFunc     = this.callback;
        var errorHandlerFunc = this.errorHandler;
        var htmlHandlerFunc  = this.htmlHandler;

        // See if we are using an invocation-specific callback
        if (callback) {
            if (isFunction(callback)) {
                callbackFunc = callback;
            } else if (isObject(callback)) {
                if (isFunction(callback.callback)) {
                    callbackFunc = callback.callback;
                } 
                if (isFunction(callback.errorHandler)) {
                    errorHandlerFunc = callback.errorHandler; 
                } 
            } 
        }

        if (this.defaultParams) {
            _params = {};
            Object.extend(_params, this.defaultParams);
        } 
        
        if (params) {
            _params = _params ? _params : {};
            Object.extend(_params, params);
        }

        var _url = this.url;
        // TODO: method changer
        // var _url = _params ? 
        // FIXME: PERFORMANCE -- $H(..), toQueryString might be slow
        //            (this.url + '?' + $H(_params).toQueryString()) : // params added
        //            this.url;                                      // no params
        
        
        var serial  = DA.io.Manager.loading(_url);
        var cserial = encodeURIComponent(serial);

        // TODO: Verify if Ajax.Request is fast enough. (seems synchy)
        // serial = No cache fix.
        var req = new Ajax.Request( _url.match(/\?/) ? _url + '&serial=' + cserial : _url + '?serial=' + cserial, {
            method: this.method,
            parameters: $H(_params).toQueryString(),
            onSuccess: function(transport) { /* assuming transport will never be null*/
                var contentType = transport.getResponseHeader('Content-Type');
                if (!contentType || !contentType.match(/(js|json|javascript)/i)) {
                    DA.io.Manager.done(serial);
                    htmlHandlerFunc({
                        type:        "INVALID_CONTENTTYPE",
                        contentType: contentType,
                        body:        transport.responseText
                    });
                    return;
                } 
                // all OK
                var jsonText = transport.responseText;
                var obj; // Because try blocks are blocks
                try {
                    obj = eval('('+ jsonText +')');
                    if ('object' === typeof obj) {
                        DA.io.Manager.done(serial);
                        callbackFunc(obj, _params);
                    } else {
                        DA.io.Manager.done(serial);
                        errorHandlerFunc({
                            type:        "NOT_AN_OBJECT",
                            contentType: contentType,
                            body:        transport.responseText
                        }, _params);
                    }
                } catch(e) {
                    DA.io.Manager.done(serial);
                    errorHandlerFunc(e, _params);
                }
            },
            onFailure: function(err) {
                DA.io.Manager.done(serial);
                errorHandlerFunc(err, _params);
            },
            
            onException: function (e) {
            }
        
        });
        
    }

};

})();

/* $Id: fileupload-io.js 2039 2009-11-11 08:29:34Z yp_shao $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/io/fileupload-io.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.io) {
    alert("ERROR: missing DA.js or DA.io"); // TODO: formalize/cleanup
}

if (!YAHOO.util || !YAHOO.util.Dom || !YAHOO.util.Connect) {
    alert("ERROR: missing YAHOO.util or YAHOO.util.Dom or YAHOO.util.Connect"); // TODO: formalize/cleanup
}

/**
 * TODO: comments, docs
 *
 */
DA.io.FileUploadIO = function(url, formId, defaultParams){
    
    this.url    = DA.util.setUrl(url);
    this.formId = formId;
    this.defaultParams = defaultParams;
    
    if (location.href.match(/^[hH][tT][tT][pP][sS]\:\/\//)) {
        this.secureUri = true;
    } else {
        this.secureUri = false;
    }

};

DA.io.FileUploadIO.prototype = {

    url: null,

    formId: null,
    
    defaultParams: undefined,
    
    secureUri: null,

    /**
     * This will be be called after the file upload response has been eval'ed
     * to a Javascript object.
     * Users of FileUploadIO must assign a function to callback to be able to
     * do something with the object (eval'ed server response)
     * @method callback 
     * @param obj (Object) Eval'ed server JSON response
     * @param args {Hash}   Reference to the actual parameters used
     * @protected
     */
    callback: function(obj, args) { /* EMPTY FUNCTION */ },

    /**
     * This will be called when an error has been encountered.
     * Users of FileUploadIO must assign a function to errorHandler
     * to be able to customize the error handling method.
     * Default errorHandler just pops up a Javascript alert...
     * @param e (Object) error information in a hash
     * @param actualArgs {Object} Reference to the actual original arguments.
     * @method errorHandler
     * @protected
     */
    errorHandler: function(e, actualArgs) { 
        /*
        if (e && e.type == 'INVALID_CONTENTTYPE') {
            // TODO
            //something.innerHTML = e.body; 
        }
        */
        var v, s = "";
        for (var p in e) {
            try {
                v = e[p];
                if (typeof v === 'function') {continue;}
                s += (p + ":" + v + "\n");
                // TODO: truncate (or rather, quite appending to) s
                //       when the string gets too long...
            } catch (er) {  }
        }
        DA.log("FileUpload-IO ERROR:" + e, "fileupload-io.js");
        alert("ERROR: FileUpload-IO: response was: " + s);
    },
    
    htmlHandler: function(e) {
        var win = DA.windowController.winOpen();
        
        win.document.open();
        win.document.write(e.body);
        win.document.close();
        
        window.close();
    },

    /**
     * Perform the IO.
     * Optionally, use the parameters passed (a HASH of name-value pairs)
     * @method execute
     * @param params (HASH) optional hash of name-value pairs
     */
    execute: function(formId, params) {
      
        var me = this;
        
        var _params = undefined;
        
        if (this.defaultParams) {
            _params = {};
            Object.extend(_params, this.defaultParams);
        } 
        
        if (params) {
            _params = _params ? _params : {};
            Object.extend(_params, params);
        }
        
        var _url = this.url;

        
        if (!formId) {
            formId = this.formId;
        }
        
        var serial = DA.io.Manager.loading(_url);
        
        try {
            YAHOO.util.Connect.setForm(YAHOO.util.Dom.get(formId), true, this.secureUri);   
            YAHOO.util.Connect.asyncRequest('POST', _url, {
                upload: function(transport) {

                    // all OK
                    var obj;
                    var __eval_done_time;
                    var jsonText = transport.responseText;
                    jsonText = jsonText.replace(/^<pre>/i, "");
                    jsonText = jsonText.replace(/<\/pre>[\s\r\n\t]*$/i, "");

                    obj = eval('('+ jsonText +')');
                    if ('object' === typeof obj) {
                        DA.io.Manager.done(serial);
                        me.callback(obj, _params);
                    } else {
                        // TODO: case by error(text/html)
                        DA.io.Manager.done(serial);
                        me.htmlHandler({
                            type: "NOT_AN_OBJECT",
                            // contentType: "text/html",
                            body: transport.responseText
                        });
                    }
                },
                
                failure: function(transport) {
                    DA.io.Manager.done(serial);
                    me.errorHandler({
                        type: "NOT_AN_OBJECT",
                        // contentType: "text/html",
                        body: transport.statusText
                    }, _params);
                }
            });
        } catch(e) {
            DA.io.Manager.done(serial);
            me.errorHandler(e, _params);
        }   

    }

};

/* $Id: mailer.js 2378 2014-04-13 08:31:57Z jl_zhou $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/mailer.js $ */
/*for JSLINT undef checks*/
/*extern $H BrowserDetect */
/**
 * TODO: comments
 */
/*extern DA YAHOO*/
if ('undefined' === typeof DA) {
    alert("ERROR: need DA.js");
} else {
    if (! DA.mailer) {
        DA.mailer = {};
        DA.mailer.util = {};
        DA.mailer.connection = {};
        DA.mailer.widget = {};
        DA.mailer.windowController = {};
    }
}

DA.mailer.util = {
    treeOpenStatus: {},

    treeOpenAll: function(id) {
        if (DA.util.isEmpty(DA.mailer.util.treeOpenStatus[id])) {
            DA.mailer.util.treeOpenStatus[id] = false;
        }
        if (DA.mailer.util.treeOpenStatus[id]) {
            DA.mailer.util.treeOpenStatus[id] = false;
            // YAHOO.widget.TreeView.getTree(id).collapseAll();
            // render bug with select folder.
            this._treeCloseAllChildren(YAHOO.widget.TreeView.getTree(id).getRoot());
        } else {
            DA.mailer.util.treeOpenStatus[id] = true;
            // YAHOO.widget.TreeView.getTree(id).expandAll();
            // render bug with select folder.
            this._treeOpenAllChildren(YAHOO.widget.TreeView.getTree(id).getRoot());
        }
    },
    
    _treeOpenAllChildren: function(node) {
        var i, child;
        for (i = 0; i < node.children.length; i ++) {
            child = node.children[i];
            if (child.hasChildren()) {
                child.expand();
                this._treeOpenAllChildren(child);
            }
        }
    },
    
    _treeCloseAllChildren: function(node) {
        var i, child;
        for (i = 0; i < node.children.length; i ++) {
            child = node.children[i];
            if (child.hasChildren()) {
                child.collapse();
                this._treeCloseAllChildren(child);
            }
        }
    },
    
    checkResult: function(o) {
        if (o.result.error === 9) {
			if(o.result.message==='OLD_OF_FOLDER'){
				if(DA.util.confirm(DA.locale.message.core[o.result.message])){
					window.location.reload();
				}
			}else{
            	DA.util.error(o.result.message);
            }
            return false;
        } else if (o.result.error === 2) {
            DA.util.warn(o.result.message);
            return true;
        } else if (o.result.error === 1) {
            DA.util.warn(o.result.message);
            return false;
        } else {
            return true;
        }
    },
    
    reloadPortal: function() {
		var cr_date;
        try {
			cr_date=window.opener.document.date_form.date.value;
			window.opener.DAportletRefresher.refresh_all('mail',cr_date,'');
        } catch(e) {
			window.opener.location.href=DA.util.setUrl(DA.vars.cgiRdir+"/login_main.cgi?time="+DA.util.getTime()+"&date="+window.opener.document.date_form.date.value);
        }
    },
    
    isRoot: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.root, 10);
    },
    
    isServer: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.server, 10);
    },
        
    isInbox: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.inbox, 10);
    },
    
    isDraft: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.draft, 10);
    },

    isSent: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.sent, 10);
    },
    
    isTrash: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.trash, 10);
    },
    
    isSpam: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.spamx, 10);
    },
    
    isDefault: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType['default'], 10);
    },
    
    isMailbox: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.mailbox, 10);
    },
    
    isCabinet: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.cabinet, 10);
    },
    
    isLocalServer: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.localServer, 10);
    },
    
    isLocalFolder: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.localFolder, 10);
    },
    
    isJoin: function(type) {
        return parseInt(type, 10) === parseInt(DA.vars.folderType.join, 10);
    },
    
    isBackupFolder: function(type) {
       return parseInt(type, 10) === parseInt(DA.vars.folderType.backupFolder, 10);
    },
	
	getOperationFlag: function() {
		var key = OrgMailer.vars.cookie_key + "-operation_flag";
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length ; i++) {
			if (cookies[i].split("=")[0].replace(/(^\s*)|(\s*$)/g, "") === key) {
				if ( typeof cookies[i].split("=")[1] === "undefined"){
					return "";
				}
				return cookies[i].split("=")[1];
			}
		}
		return "";
	},
	
	getOperationWarnedFlag: function() {
		var key = OrgMailer.vars.cookie_key + "-operation_warned";
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length ; i++) {
			if (cookies[i].split("=")[0].replace(/(^\s*)|(\s*$)/g, "") === key) {
				if ( typeof cookies[i].split("=")[1] === "undefined"){
					return "";
				}
				return cookies[i].split("=")[1];
			}
		}
		return "";
	},
	
	getMailAccount: function() {
		var key = OrgMailer.vars.cookie_key + "-org_mail";
		var cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length ; i++) {
			if (cookies[i].split("=")[0].replace(/(^\s*)|(\s*$)/g, "") === key) {
				if ( typeof cookies[i].split("=")[1] === "undefined"){
					return "";
				}
				return cookies[i].split("=")[1];
			}
		}
	},
	
	autoCloseWaitingMask: function() {
		var atuoCloser = window.setInterval(function(){
			if (DA.mailer.util.getOperationFlag() === ""){
				DA.waiting.hide();
				OrgMailer.vars.mask_show = 0;
				OrgMailer.vars.operation_warned = 0;
				window.clearInterval(atuoCloser);
				if (!OrgMailer.vars.is_blured){
					document.cookie = OrgMailer.vars.cookie_key + "-org_mail=" + OrgMailer.vars.org_mail_gid + ";";
				}
			}
		},500);
	},
	
	setOperationFlag: function(flag) {
		document.cookie = OrgMailer.vars.cookie_key + "-operation_flag=" + flag;
	},
	
	setOperationWarnedFlag: function(flag) {
		var tmpWarnedFlag = DA.mailer.util.getOperationWarnedFlag();
		if (flag === ""){
			tmpWarnedFlag = "";
		} else {
			if (tmpWarnedFlag.indexOf(flag) < 0){
				if (tmpWarnedFlag !== ""){
					tmpWarnedFlag += ",";
				}
				tmpWarnedFlag += flag;
			}
		}
		document.cookie = OrgMailer.vars.cookie_key + "-operation_warned=" + tmpWarnedFlag +";";
	}
};



DA.mailer.connection = {
    titleNode: null,
    
    titleBarNode: null,
    
    titleBarNumber: 0,
    
    clearLogined: function() {
        try {
            window.opener.AjaxMailerLogined = 0;
            window.opener.AjaxMailerWindow  = null;
        } catch(e) {
        }
    },
    
    login: function() {
        // min window size
        if (YAHOO.util.Dom.getViewportWidth() < 100 || YAHOO.util.Dom.getViewportHeight() < 100) {
            DA.util.warn(DA.locale.GetText.t_('WINDOW_SIZE_WARN'));
            window.resizeTo(800, 600);
        }
        
        // title
        var body = document.body;
        var div  = document.createElement('div');
        var img  = document.createElement('div');
        
        // Recommended way of setting many properties of the same object
        Object.extend(div.style, {
            position : 'absolute',
            top      : '0px',
            left     : '0px',
            width    : '100%',
            height   : '100%',
            zIndex   : '1000',
            verticalAlign      : 'middle',
            backgroundColor    : '#e1e1e1',
            backgroundImage    : 'url(' + DA.vars.imgRdir + '/ajaxmail_bk.gif)',
            backgroundRepeat   : '',
            backgroundPosition : ''
        });

        img.innerHTML = '<div style="text-align:center; margin:70px 0px 0px 0px;">' +
                        '<div>' + DA.imageLoader.tag(DA.vars.imgRdir + '/ajaxmail_logo.gif', '', { width:120, height:30 }) + '</div>' +
                        '<div style="margin:20px 0px 0px 0px;">' + DA.imageLoader.tag(DA.vars.imgRdir + '/ajaxmail_read.gif', '', { width:44, height:44 }) + '</div>' +
                        '<div>' + DA.imageLoader.tag(DA.vars.imgRdir + '/ajaxmail_bar00.gif', '', { id:'da_title_bar', width:290, height:53 }) + '</div>' +
                        '<div style="margin:2px 0px 6px 0px;">' +DA.locale.GetText.t_('STARTING') + '</div>' +
                        '<div style="font-size:9px;">' + DA.locale.GetText.t_('STARTING_WARN') + '</div>' +
                        '<div style="margin:30px 0px 0px 0px;font-size:9px;">' + DA.imageLoader.tag(DA.vars.imgRdir + '/ajaxmail_iselogo.gif', '') + '<br>' +
                        DA.locale.GetText.t_('COPYRIGHT', '2006-2014') + '</div>' +
                        '</div>';
        
        div.appendChild(img);
        body.insertBefore(div, body.firstChild);
        
        this.titleNode = div;
        this.titleBarNode = YAHOO.util.Dom.get('da_title_bar');
        
        if (BrowserDetect.browser === 'Explorer') {
            if (BrowserDetect.version === 6) {
            } else if (BrowserDetect.version > 6) {
            } else {
                DA.util.warn(DA.locale.GetText.t_('BROWSER_ERROR'));
                window.close();
            }
        } else if (BrowserDetect.browser === 'Firefox') {
            if (BrowserDetect.version > 1) {
            } else {
                DA.util.warn(DA.locale.GetText.t_('BROWSER_WARN'));
            }
        } else if (BrowserDetect.browser === 'Mozilla') {
            if (BrowserDetect.OS === 'Linux') {
                // Be nice to Linux users; they can't run IE6!
            } else { // Probably Windows.
                DA.util.warn(DA.locale.GetText.t_('BROWSER_WARN'));
            }
        } else {
            //DA.util.warn(DA.locale.GetText.t_('BROWSER_ERROR'));
            //window.close();
        }
    },
    
    logout: function() {
        var id, me = this;

        if (DA.util.lock('logout')) {
            if (DA.util.confirm(DA.locale.GetText.t_('MAILER_CLOSE_CONFIRM'))) {
                id = setInterval(function() {
                    var io;
                    
                    if (!DA.io.Manager.isActive()) {
                        clearInterval(id);
                        DA.windowController.allClose();
                        
                        io = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_logout.cgi' );
                        
                        io.callback = function(o) {
                            if (DA.mailer.util.checkResult(o)) {
                                me.clearLogined();
                                if (BrowserDetect.browser === 'Mozilla' || BrowserDetect.browser === 'Firefox') {
									// close window in Mozilla/Firefox
									window.open(null,"_self").close();
                                } else {
                                    window.close();
                                }
                            } else {
                                if (DA.util.confirm(DA.locale.GetText.t_('LOGOUT_ERROR_CONFIRM'))) {
                                    me.clearLogined();
                                    if (BrowserDetect.browser === 'Mozilla' || BrowserDetect.browser === 'Firefox') {
                                        // close window in Mozilla/Firefox
									    window.open(null,"_self").close();
                                    } else {
                                        window.close();
                                    }
                                } else {
                                    DA.util.unlock('logout');
                                }
                            }
                        };
                        
                        io.errorHandler = function(e) {
                            if (DA.util.confirm(DA.locale.GetText.t_('LOGOUT_ERROR_CONFIRM'))) {
                                me.clearLogined();
                                if (BrowserDetect.browser === 'Mozilla' || BrowserDetect.browser === 'Firefox') {
									// close window in Mozilla/Firefox
									window.open(null,"_self").close();
                                } else {
                                    window.close();
                                }
                            } else {
                                DA.util.unlock('logout');
                            }
                        };
                        
                        io.execute();
                    }
                }, 1000);
            } else {
                DA.util.unlock('logout');
            }
        }
    },
    
    _saveStateIO: new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_config.cgi' ),
    
    saveState: function() {
        var io, params, aUIInfo, i;
        
        if (DA.util.lock('saveState')) {
            io = this._saveStateIO;
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    DA.util.warn(DA.locale.GetText.t_('SAVE_STATE_MESSAGE'));
                    DA.util.unlock('saveState');
                    try {
                        window.opener.AjaxMailerWindowWidth  = params.window_width;
                        window.opener.AjaxMailerWindowHeight = params.window_height;
                        window.opener.AjaxMailerWindowPosX   = params.window_pos_x;
                        window.opener.AjaxMailerWindowPosY   = params.window_pos_y;
                    } catch(e) {
                    }
                }
            };
            
            io.errorHandler = function(e) {
                DA.util.unlock('saveState');
            };
            
            params  = {
                proc:          'default',
                window_pos_x:  (BrowserDetect.browser === 'Explorer') ? window.screenLeft - 4 : window.screenX,
                window_pos_y:  (BrowserDetect.browser === 'Explorer') ? window.screenTop - 30 : window.screenY,
                window_width:  YAHOO.util.Dom.getViewportWidth(),
                window_height: YAHOO.util.Dom.getViewportHeight()
            };
            if (params.window_pos_x < 0) {
                params.window_pos_x = 0;
            }
            if (params.window_pos_y < 0) {
                params.window_pos_y = 0;
            }
            aUIInfo = DA.session.UIState.getAllStateInfo();
            aUIInfo.each(function(widget) {
                var list_column_width = '';
                if (widget.name === 'threePane') {
                    params.dir_width   = widget.info.leftPane.width;
                    params.list_height = widget.info.rightTopPane.height;
                } else if (widget.name === 'mboxgrid') {
                    widget.info.columns.each(function(col) {
                        list_column_width += col.width + '|';
                    });
                    params.list_column_width = list_column_width.replace(/\|+$/, "");
                } else if (widget.name === 'messageViewer') {
                    params.detail_header_open = widget.info.headerExpanded;
                    params.detail_header_to_open = widget.info.headerToExpanded;
                    params.detail_header_cc_open = widget.info.headerCcExpanded;
                    params.detail_header_attachment_open = widget.info.headerAttachmentExpanded;
                }
            });
            
            io.execute(params);
        }
    },
    
    titleShow: function() {
        if (this.titleNode.style.display === 'none') {
            this.titleNode.style.display = '';
        }
    },
    
    titleHide: function() {
        if (this.titleNode.style.display === '') {
            this.titleNode.style.display = 'none';
        }
    },
    
    titleBar: function() {
        if (this.titleNode.style.display === '') {
            this.titleBarNumber ++;
            if (this.titleBarNumber < 10) {
                this.titleBarNode.src = DA.vars.imgRdir + '/ajaxmail_bar0' + this.titleBarNumber.toString() + '.gif';
            } else {
                this.titleBarNumber = 10;
                this.titleBarNode.src = DA.vars.imgRdir + '/ajaxmail_bar' + this.titleBarNumber.toString() + '.gif';
            }
        }
    }
};

DA.mailer.windowController = {
	viewerWidth: function(w) {
		if (w) {
			DA.session.Values.registerValue("viewerWindowWidth", w);
		}
		return DA.session.Values.getValue("viewerWindowWidth") || DA.vars.config.viewer_width;
	},
	viewerHeight: function(h) {
		if (h) {
			DA.session.Values.registerValue("viewerWindowHeight", h);
		}
		return DA.session.Values.getValue("viewerWindowHeight") || DA.vars.config.viewer_height;
	},
    viewerOpen: function(fid, uid, srid) {
        var url;
        if (DA.util.isEmpty(srid)) {
            url = DA.vars.cgiRdir + '/ajax_mailer.cgi?html=viewer&fid=' + fid + '&uid=' + uid;
        } else {
            url = DA.vars.cgiRdir + '/ajax_mailer.cgi?html=viewer&fid=' + fid + '&uid=' + uid + '&srid=' + srid;
        }
		url += "&org_mail_gid=" + OrgMailer.vars.org_mail_gid;

        if (DA.vars.html && DA.vars.html.viewer) {
            DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",this.viewerWidth(),this.viewerHeight()),url,DA.vars.html.viewer);
        } else {
            DA.windowController.winOpenNoBar(url,"",this.viewerWidth(),this.viewerHeight());
        }
    },
    
    /**
     * TODO: comments needs; what is proc?
     */
   editorWidth: function(w) {
		if (w) {
	               DA.session.Values.registerValue("editorWindowWidth", w);
	    }
		return DA.session.Values.getValue("editorWindowWidth") || DA.vars.config.editor_width;
	},
	editorHeight: function(h) {
		if (h) {
			       DA.session.Values.registerValue("editorWindowHeight", h);
	    }
	    return DA.session.Values.getValue("editorWindowHeight") || DA.vars.config.editor_height;
	},
    editorOpen: function(proc, fid, uid, tid, quote) {
        var url = DA.vars.cgiRdir + '/ajax_mailer.cgi?html=editor&richtext=1';      
        if (!DA.util.isEmpty(proc)) {
            url += '&proc=' + proc;
        }
        if (!DA.util.isEmpty(fid)) {
            url += '&fid=' + fid + '&uid=' + uid;
        }
        if (!DA.util.isEmpty(tid)) {
            url += '&tid=' + tid;
        }
        if (!DA.util.isEmpty(quote)) {
            url += '&quote=' + quote;
        }
		url += "&org_mail_gid=" + OrgMailer.vars.org_mail_gid;
        if (DA.vars.html && DA.vars.html.editor) {
            DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",this.editorWidth(),this.editorHeight()),url,DA.vars.html.editor);
        } else {
            DA.windowController.winOpenNoBar(url,"",this.editorWidth(),this.editorHeight());
        }
    },

     editorOpenBackUp: function(proc, fid, uid, backup_maid, backup_org_clrRdir) {
        var url = DA.vars.cgiRdir + '/ajax_mailer.cgi?html=editor&richtext=1';
        if( !DA.mailer.windowController.backup_reopenable(proc, fid, uid)) {
            DA.util.warn(DA.locale.GetText.t_("MESSAGE_EDIT_REOPEN_ERROR"));
            return;
        }
        if (!DA.util.isEmpty(proc)) {
            url += '&proc=' + proc;
        }
        if (!DA.util.isEmpty(fid)) {
            url += '&fid=' + fid + '&uid=' + uid;
        }
        if(!DA.util.isEmpty(backup_maid)) {
            url += '&backup_maid=' + backup_maid;
        }
        if(!DA.util.isEmpty(backup_org_clrRdir)) {
            url += '&backup_org_clrRdir=' + backup_org_clrRdir;
        }
		url += "&org_mail_gid=" + OrgMailer.vars.org_mail_gid;
        if (DA.vars.html && DA.vars.html.editor) {
            DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",this.editorWidth(),this.editorHeight()),url,DA.vars.html.editor);
        } else {
            DA.windowController.winOpenNoBar(url,"",this.editorWidth(),this.editorHeight());
        }
    },	

    backup_reopenable: function(proc, fid, uid) {
        var c_set,c_win,backup_maid;
        var i = 0;
        var flag = true;
        if(!DA.util.isEmpty(fid) && !DA.util.isEmpty(window.__folderTree.backupFolderFid) && fid === window.__folderTree.backupFolderFid.toString() && proc ==='edit') { 
            c_set = window.DA.windowController.data;
            if(!DA.util.isUndefined(c_set)) {
                for(i=0;i<c_set.length;i++) {
                   try { 
                    c_win = c_set[i];
                   }catch(e) {
                     continue;
                   }
                    if(!DA.util.isUndefined(c_win) && !c_win.closed) {
                        if(DA.util.isUndefined(c_win.__messageEditor)) {
                            continue;
                        }
                        backup_maid = c_win.__messageEditor.backup_maid;
                        if( !DA.util.isEmpty(uid) && !DA.util.isEmpty(backup_maid) && uid.toString() === backup_maid.toString())  {
                            flag = false;
                            break;
                        }
                    }
                }
            }
        }
        return flag;
    },
    
    editorOpen4url: function(url, width, height) {
        url = url.replace(/&external\=\d/, "");
        if (DA.vars.html && DA.vars.html.editor) {
            DA.mailer.windowController.documentWrite(DA.windowController.winOpenNoBar("","",DA.mailer.windowController.editorWidth(),DA.mailer.windowController.editorHeight()),url,DA.vars.html.editor);
        } else {
            DA.windowController.winOpenNoBar(url, '', width, height);
        }
    },
    
    searcherOpen: function(fid) {
        var status = 'width=800,height=600' +
                     ',resizable=yes,scrollbars=yes,location=no' +
                     ',menubar=no,toolbar=no,statusbar=no';
        var url = DA.vars.cgiRdir + '/ajax_mailer.cgi?html=searcher&search=1&fid=' + fid;
		url += "&org_mail_gid=" + OrgMailer.vars.org_mail_gid;
        if (DA.vars.html && DA.vars.html.searcher) {
            DA.mailer.windowController.documentWrite(DA.windowController.winOpenCustom('', '', status), url, DA.vars.html.searcher);
        } else {
            DA.windowController.winOpenCustom(url, '', status);
        }
    },
    
    documentWrite: function(obj, url, html) {
        html = html.replace(/\<\!\-\- requestUrl \-\-\>/, url);
        obj.document.open();
        obj.document.write(html);
        obj.document.close();
    }
};

DA.mailer.checkSession = function (){
    if(BrowserDetect.browser==="Explorer"&&typeof (window.opener)==="object"&&typeof (window.opener.DA)==="object"&&typeof (window.opener.DA.session)==="object"){
        try{
            DA.session.Values.getValue();
        }catch(e){
            DA.session=window.opener.DA.session;
        }
    }else{
        if(BrowserDetect.browser!=="Explorer"&&window.opener&&window.opener.DA&&window.opener.DA.session){
            try{
                DA.session.Values.getValue();
            }catch(e){
                DA.session=window.opener.DA.session;
            }
        }else{
            try{
                DA.session.Values.getValue();
            }catch(e){
                (function () { // Create a private scope

                    var widgets = $H({}); // private hash
                    var values = $H({});
                    function _getStateInfo(w) {
                        if ('function' !== typeof w.getUIStateInfo) { // duck typing?
                            return;
                        }
                        return w.getUIStateInfo();
                    }

                     DA.session = {
                         Values: {
                                registerValue: function(name, value) {
                                values[name] = value;
                                },
                                getValue: function(name) {
                                return values[name];
                                }
                         },

                         UIState: {

                /**
                 * @method registerWidget
                 * @static
                 * @param name   {String} unique name/id for the widget
                 * @param widget {Object} instance of DA.*widget.*
                 */
                             registerWidget: function(name, widget) {
                                 widgets[name] = widget;
                             },

                /**
                 * Retrieve state information for the given widget.
                 *
                 * @method getStateInfo
                 * @static
                 * @param name   {String} unique name/id of the widget
                 * @returns      {Hash} object containing name/value pairs
                 *                      of state information
                 */
                             getStateInfo: function(name) {
                                 var w = widgets[name];
                                 if (!w) {
                                     return;
                                 }
                                 return _getStateInfo(w);

                            },


                /**
                 * Get all the state info we have registered....
                 * @method getAllStateInfo
                 * @static
                 * @return {Array} Array of Objects, each with
                 *                          name: name of the widget
                 *                          info: hash containing state info
                 */
                             getAllStateInfo: function() {
                                 return widgets.map(function (ent /*entry*/) {
                                     return {
                                         name: ent.key,
                                         info: _getStateInfo(ent.value)
                                     };
                                 });
                             }
                         }
                     };
                })();
            }
        }
    }
};
if (!OrgMailer.vars.is_mail_box && BrowserDetect.browser === 'Explorer' &&
    typeof(window.opener) === 'object' && 
    typeof(window.opener.DA) === 'object' &&
    typeof(window.opener.DA.mailer) === 'object' &&
    typeof(window.opener.DA.mailer.Events) === 'object') {
    // Take the global reference to Events from the one, single parent window for IE
    DA.mailer.Events = window.opener.DA.mailer.Events;

} else if (!OrgMailer.vars.is_mail_box && BrowserDetect.browser !== 'Explorer' &&
           window.opener &&
           window.opener.DA &&
           window.opener.DA.mailer &&
           window.opener.DA.mailer.Events) {
    // Take the global reference to Events from the one, single parent window for FireFox
    DA.mailer.Events = window.opener.DA.mailer.Events;
    
} else {

    DA.mailer.Events = {
    
        /**
         * Custom event fired when messages are either MOVING (folder-to-folder) or
         * DELETING (also if they are just moving to the TRASH folder).
         * （削除イベント）
         * @property onMessagesMoving
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                      - messages {Object} The collecion of messages being moved
         *                                          keys: singles, ranges, etc
         *                      - target   {Hash}   Object literal with info about
         *                                          where the messages are being moved
         *                                          keys: fid, or trash
         * @param    {Number} serial number, or JOB ID
         */
        onMessagesMoving: new YAHOO.util.CustomEvent("onMessagesMoving"),
    
        /**
         * Custom event fired when messages are either MOVED (folder-to-folder) or
         * DELETED (also if they are just moved to the TRASH folder).
         * （削除イベント）
         * @property onMessagesMoved
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                    - srcFid:   {Int}    The ID of the IMAP folder from which messages were moved
         *                    - target:   {Object} Information about the destination folder, or the deletion:
         *                                         Keys: fid:   {Int}     Destination IMAP folder ID
         *                                               trash: {Boolean} If, true, implies TRASH/DELETE
         *                    - count:    {Int}    The number of messages moved/deleted
         *                    - response: {Object} The eval'd JSON response as returned
         *                                         by the CGI /ajx_ma_move.cgi
         */
        onMessagesMoved: new YAHOO.util.CustomEvent("onMessagesMoved"),
    
        /**
         * Custom event fired when messages are either MOVE FAILER (folder-to-folder) or
         * DELETE FAILURE (also if they are just move failure to the TRASH folder).
         * （削除イベント）
         * @property onMessagesMoveFailure
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                    - srcFid:   {Int}    The ID of the IMAP folder from which messages were move failer
         *                    - target:   {Object} Information about the destination folder, or the deletion:
         *                                         Keys: fid:   {Int}     Destination IMAP folder ID
         *                                               trash: {Boolean} If, true, implies TRASH/DELETE
         *                    - count:    {Int}    The number of messages move failer/delete failer
         *                    - response: {Object} The eval'd JSON response as returned
         *                                         by the CGI /ajx_ma_move.cgi
         */
        onMessagesMoveFailure: new YAHOO.util.CustomEvent("onMessagesMoveFailure"),
      
        // FIXME: Comments, JSDOC?
        onMessageSent: new YAHOO.util.CustomEvent("onMessageSent"),
        onMessageSaved: new YAHOO.util.CustomEvent("onMessageSaved"),

        /**
         * TODO: comments
         */
        onMessagesFiltering: new YAHOO.util.CustomEvent("onMessagesFiltering"),
    
        onMessagesFiltered: new YAHOO.util.CustomEvent("onMessagesFiltered"),
    
        onMessagesFilterFailure: new YAHOO.util.CustomEvent("onMessagesFilterFailure"),
    
        /**
         * Custom event fired when messages are mbox grid loadRows
         * @property onMboxGridLoadRows
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                    - fid:      {Int}    The ID of the affected IMAP folder
         *                    - count:    {Int}    The number of messages affected
         *                    - response: {Object} The eval'd JSON response as returned
         *                                         by the CGI /ajx_ma_list.cgi
         */
        onMboxGridLoadRows: new YAHOO.util.CustomEvent("onMboxGridLoadRows"),
        
        /**
         * Custom event fired when messages drag out on folder
         * @property onMessagesDragOut
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                    - fid:      {Int}    The ID of the affected IMAP folder
         */
        onMessagesDragOut: new YAHOO.util.CustomEvent("onMessagesDragOut"),
        
        /**
         * Custom event fired when messages drag enter on folder
         * @property onMessagesDragEnter
         * @type     {Object} YUI CustomEvent
         * @param    {Object} object literal, with the following fields:
         *                    - fid:      {Int}    The ID of the affected IMAP folder
         */
        onMessagesDragEnter: new YAHOO.util.CustomEvent("onMessagesDragEnter"),

        /**
         * CustomEvent 
         */
        onFolderTreeReady: new YAHOO.util.CustomEvent("onFolderTreeReady"),

        // TODO: comments, jsdoc
        onMessageMoveRequest:  new YAHOO.util.CustomEvent("onMessageMoveRequest"),
       
        onMessageRead:         new YAHOO.util.CustomEvent("onMessageRead"),

        // TODO: comments, jsdoc
        onMessageFlagRequest:  new YAHOO.util.CustomEvent("onMessageFlagRequest"),
        onMessagesFlagging:    new YAHOO.util.CustomEvent("onMessagesFlagging"),
        onMessagesFlagged:     new YAHOO.util.CustomEvent("onMessagesFlagged"),
        onMessagesFlagFailure: new YAHOO.util.CustomEvent("onMessagesFlagFailure")
    };
}

var Pop4Ajax = DA.mailer.windowController.editorOpen4url;
/* $Id: mailer.js 1417 2007-06-28 01:58:25Z faiz_kazi $ -- $HeadURL: http://yuki/svn/iseria/insuite-ui/trunk/src/mailer/mailer.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO Prototype $A $H */
/**
 * All Read-Write operations (as seen/done from the client/javascript) on mailbox's
 * and their contents:
 */


(function () { // begin private scope...

// Create a default do-nothing-but-crib CustomEvent
var unimplementedEvt = new YAHOO.util.CustomEvent("unimplemented");
unimplementedEvt.subscribe(function (type, args) {
});


/**
 * Abstract Message Processor (in want of a better name...)
 *
 * Abstract base class that handles all the message processing stuff.
 * Subclasses can implement specifi methods that do things like 
 * move, delete, flag messages.
 *
 * @class AbstMsgProc
 * @abstract
 */
DA.mailer.util.AbstMsgProc = function () {};


DA.mailer.util.AbstMsgProc.prototype = {
   
    /**
     * @property _serialNo
     * @type {Number}
     * @private
     */
    _serialNo: 0,

    /**
     * Collection of utility methods.
     * FIXME: more reusability needed: similar methods are already defined in mboxgrid!
     * @property _utils
     * @private
     * @type {object} hash of functions
     */
    _utils: {
    
        asFidColonUid: function (m) {
            return m.fid + ':' + m.uid;
        },

        asFidColonUidRange: function(r){
            // FIXME: No null checks (start? end? if they are undefined?)
            return r.start.fid + ":" + r.start.uid + "-" + r.end.fid + ":" + r.end.uid;
        }
    
    },
    

   /**
    * process the command.
    * @method proc
    * @protected
    * @param   oMessages {Object} a message collection (singles, single, count, ranges, etc)
    * @param   oArgs     {Object} a hash of parameters to pass along.
    * @params  params    {Object} Reference to the original parameters...
    */
   proc: function( oMessages, oArgs, params ) {

        if (!oMessages.count) {
            return;
        }

        // Build a list of FID:UID strings.
        var uidList = oMessages.singles.map( this._utils.asFidColonUid );

        // Area selection
        var areas = oMessages.ranges.map( this._utils.asFidColonUidRange );

        var ioArgs = Object.extend(oArgs || {}, {
            uid: uidList.join(','),
            area: areas.join(',')
        });

        ++this._serialNo;

        var jobId = this._serialNo;

        var evtDone    = this.evtDone;
        var evtDoing   = this.evtDoing;
        var evtFailure = this.evtFailure;
       
        this.io.execute( ioArgs, {
            callback: function (response) {
                if (!DA.mailer.util.checkResult(response)) {
                    evtFailure.fire( jobId, params, response );
                }
                evtDone.fire( jobId, params, response );
            },
            errorHandler: function (e) {
                evtFailure.fire( jobId, params, e );
            }
        });
        
        window.setTimeout( function () {
            evtDoing.fire( jobId, params );
        }, 10);

    },

    /**
     * @method mockProc
     * @param oParams {Object}
     * @param oServerResponse {Object}
     */
    mockProc: function (oParams, oServerResponse) {
        ++this._serialNo; // directly incrementing a private counter, but should be OK..
        var jobId = this._serialNo;
        this.evtDoing.fire(jobId, oParams);
        // TODO: what about MoveFailure?
        this.evtDone.fire(jobId, oParams, oServerResponse);
    },

    evtDoing:   unimplementedEvt,
    evtDone:    unimplementedEvt,
    evtFailure: unimplementedEvt,
    // TODO: make a mock obj
    io:         null

};



/**
 * Utility class for both moving and deletion of mail messages. This can move
 * a given message (or, an array of messages) from a given IMAP folder to 
 * another IMAP folder; or, depending on the settings, either directly delete
 * or move the given messages to the TRASH folder.
 * 
 * @class MessageMover
 * @constructor
 */
DA.mailer.util.MessageMover = function () {
    // Use one IO instance for both deletion and move: Defaulting to 'move'
    this.io = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi', { proc: 'move' } );
};

YAHOO.lang.extend(DA.mailer.util.MessageMover, DA.mailer.util.AbstMsgProc, {

    /**
     * @property trashFid
     * @type {Number}
     */
    trashFid: 0,

    /**
     * MOVE, MOVE to TRASH, or DELETE the given message(s), and call the specified
     * callback (onMoved) after completed.<p>
     * NOTE: All the given mails MUST belong to the same source folder. (those that
     * do not, will be discarded (not moved/deleted))
     * @method move
     * @params {Object} hash with the following properties
     *                  - target   {Hash}     Destination
     *                  - messages {Hash}     Collection of Messages (singles, ranges, etc)
     */
    move: function(params) {


        if (!params) {
            throw "No params to move";
        }

        if (!params.messages || !params.target || !(params.target.fid || (params.target.trash===true))) {
            throw "Invalid/Insufficient params to move:" + $H(params).inspect();
        }

        // FIXME: What happens to this when we implement multi-move?
        var srcFid = params.messages.fid; // Source folder ID
        // Check if we are attempting to move into the same folder...
        if (DA.util.cmpNumber(srcFid, params.target.fid)) {
            // Do nothing...
            return;
        }

        // The target folder depends on whether or not this is a move-to-trash
        var target_fid = params.target.trash === true ? this.trashFid : params.target.fid;
            
        var ioArgs = { fid:  srcFid };

        if (params.messages.srid) {
            ioArgs.srid = params.messages.srid;
        }

        ioArgs.extend(
            (params.target.trash && this.reallyDelete(srcFid)) ? // Check to see if we must do a real DELETE
                    { proc: 'delete' } : { proc: 'move', target_fid: target_fid }
        );

        this.proc(params.messages, ioArgs, params /*the original params*/);
       
    },


    /**
     * Depending on the source folder (whether or not the source folder is the TRASH folder)
     * and the user's settings ((a) Move to trash, or, (b) Delete immediately),
     * determines whether or not to perform an actual DELETE (as opposed to just moving
     * the mail to the TRASH folder)
     * @method reallyDelete
     * @param srcFid {Int} ID of the source IMAP folder
     * @rerurns {Boolean} TRUE if we have to perform an actual delete, FALSE otherwise
     */
    reallyDelete: function(srcFid) {
        if (!srcFid) { return false; /* play it safe... */ }
        if (parseInt(srcFid, 10) === parseInt(this.trashFid, 10)) {
            // We are removing something from the trash folder... bye!
            return true;
        }
        return DA.vars.config['delete'] === 1;
    },

   
    /**
     * @method mockMove
     * @param oParams {Object}
     * @param oServerResponse {Object}
     */
    mockMove: function (oParams, oServerResponse) {
        this.mockProc(oParams, oServerResponse);
    },

    evtDoing:   DA.mailer.Events.onMessagesMoving,
    evtDone:    DA.mailer.Events.onMessagesMoved,
    evtFailure: DA.mailer.Events.onMessagesMoveFailure

});



/**
 * Utilty class that provides a facade for performing all 'flag' operations
 * on a message (or a collection of messages). This covers marking the
 * messages as 'seen', 'unseen', 'flag', 'unflag' (all that ajx_ma_flag.cgi)
 * has to offer. It also throws CustomEvents (onMessagesFlagging, onMessagesFlagged, etc)
 * @class MessageFlagger
 * @constructor
 */
DA.mailer.util.MessageFlagger = function () {  
    /**
     * @property io
     * @type {Object} instance of DA.io.JsonIO
     */
    this.io = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_flag.cgi');
};

YAHOO.lang.extend(DA.mailer.util.MessageFlagger, DA.mailer.util.AbstMsgProc, {
    /**
     * @method flag
     * @param params {Object} Hash with the properties:
     *                  - property   {String}   Can be 'seen' or  'flagged'
     *                  - state      {Boolean}  
     *                  - messages   {Hash}     Collection of Messages (singles, ranges, etc)
     */
    flag: function (params) {
        var property, messages; 
        if (!params || !this._isValidProp(property = params.property) || !(messages = params.messages)) {
            return;
        }

        var ioArgs = {
            proc: (params.state === false) ? 'un'+property : property,
            fid:  messages.fid
        };

        if (messages.srid) {
            ioArgs.srid = messages.srid;
        }

        this.proc(messages, ioArgs, params);

    },
    
    /**
     * @method mockFlag
     * @param oParams {Object}
     * @param oServerResponse {Object}
     */
    mockFlag: function (oParams, oServerResponse) {
        this.mockProc(oParams, oServerResponse);
    },

    /**
     * @method _isValidProp
     * @returns {Boolean}
     * @param sProp {String}
     */
    _isValidProp: function (sProp) {
        return YAHOO.lang.isString(sProp) &&
               (sProp === 'seen' || sProp === 'flagged');
    },

    evtDoing:   DA.mailer.Events.onMessagesFlagging,
    evtDone:    DA.mailer.Events.onMessagesFlagged,
    evtFailure: DA.mailer.Events.onMessagesFlagFailure

});


})(); // End private scope
/* $Id: mailer.js 1417 2007-06-28 01:58:25Z faiz_kazi $ -- $HeadURL: http://yuki/svn/iseria/insuite-ui/trunk/src/mailer/mailer.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO Prototype $A $H */
/**
 * TODO: comments
 */

(function () { // private scope

var bInitDone = false;
var oConfig = {};
var messageMover = {
    // Fallback function (must not be used!)
    // This will get called only if a real instance of MessageMover is
    // not available (i.e., if it was never created)
    move: function  () {
    }
};

var messageFlagger = {
    // Fallback function (must not be used!)
    // This will get called only if a real instance of MessageFlagger is
    // not available (i.e., if it was never created)
    flag: function  () {
    }
};



// Deep copy of object graphs of nestes hashes/arrays
// Will limit recursion to 10 levels, and will ignore
// functional values.
var isArray = YAHOO.lang.isArray;
function deepCopy(o) {
    var depth = arguments[1] || 0;
    ++depth;
    if (depth > 10) { return {}; }
    if (o === null || typeof o !== 'object') {
        return o;
    }

    // Could be an array or an object
    var ret, i, len, val;
    
    if (isArray(o)) {
        ret = [];
        len = o.length;
        for (i = 0; i < len; ++i) {
            ret[i] = deepCopy(o[i], depth);
        }
    } else {
        ret = {};
        $H(o).each(function (item, i) {
            ret[item.key] = deepCopy(item.value);
        });
    }

    return ret;

}

function mkMsgColl(oMMData) {
    return {
        fid:      oMMData.fid,
        count:    1,
        singles:  [oMMData],
        single:   oMMData,
        ranges:   [],
        identity: {}
   
    };
}


function mkSubs(f) {
    return function(type, args) {
        if (!args || !args[0]) { 
            return; 
        }
        return f(args[0]);
    };
}

var E = DA.mailer.Events;
if (!E) {
     return;
}


function setupPlumbing(app) {
    
    E.onFolderTreeReady.subscribe(mkSubs(function(folderTree){
        
        ['trash', 'sent', 'draft', 'backupFolder'].each(function(sIDProp){
            var prop = sIDProp + 'Fid';
            var id = parseInt(folderTree[prop], 10);
            if (YAHOO.lang.isNumber(id)) {
                oConfig[prop] = id;
                messageMover[prop] = id;
            } else {
            }
        });
        
    }));

    // Proxy all Message Move Requests to the Message Mover
    E.onMessageMoveRequest.subscribe(mkSubs(function(o){
        var myo = deepCopy(o);  /* copy as much as possible into this context
                                 * to workaround enexpected data-loss bugs 
                                 * due to garbage collection (which could occur
                                 * in certain cross-window scenarios) */
        setTimeout(function() { // asynchronously
            messageMover.move( myo ); 
        }, 10);
    }));

    // Proxy all Message Flag Requests to the Message Flagger
    E.onMessageFlagRequest.subscribe(mkSubs(function(o){
        var myo = deepCopy(o);  // See Comments above (onMessageMoveRequest)
        setTimeout(function() { // asynchronously
            messageFlagger.flag( myo );
        }, 10);
    }));


    // One handler for both sending or saving messages
    function mkSentOrSavedHandler(folder) {
        return function(type, args) {
                var mmdata  = args[0];
                var resp    = args[1];
                if (!mmdata || !resp) {
                    return;
                }
                mmdata = deepCopy(mmdata);
                resp   = deepCopy(resp);
                if(mmdata.mode !== 0)
                {
       				mmdata.originuid = mmdata.uid;
                }
                var req = {
                    messages: mkMsgColl(mmdata),
                    target:   { fid: oConfig[folder] }
                };
                var originFid = parseInt(mmdata.fid, 10);
                if (originFid !== oConfig.draftFid &&
                    originFid !== oConfig.sentFid && originFid !== oConfig.backupFolderFid && originFid !== oConfig.localFolderFid) {
                    req.messages.single.uid = 0;
                }
                window.__mboxGrid.refreshGrid();
                setTimeout(function () { // Async; always a good idea
                    messageMover.mockMove(req, resp);
                }, 10);
            };

    }

    E.onMessageSent.subscribe( mkSentOrSavedHandler('sentFid'), app, true );

    E.onMessageSaved.subscribe( mkSentOrSavedHandler('draftFid'), app, true );

}


DA.mailer.Application = {
    
    init: function () {
        if (bInitDone) {
            // TODO: throw an exception as well?
            return;
        }

        messageMover = new DA.mailer.util.MessageMover();
        messageFlagger = new DA.mailer.util.MessageFlagger();

        setupPlumbing(this);

        bInitDone = true;
        return this;
    }



};


})();
/* $Id: popup.js 2508 2014-11-04 11:49:32Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/menu/popup.js $ */
/*for JSLINT undef checks*/
/*extern BrowserDetect DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/**
 * Builds a popup Menu.
 * @constructor
 * @class PopupMenuController
 * @namespace DA.widget
 */

DA.widget.PopupMenuController = function(popupId, triggerId, menuData, cbhash){
    this.popupId     = popupId;
    this.triggerId   = triggerId;
    this.triggerNode = YAHOO.util.Dom.get(triggerId);
    this.menuData    = menuData;
    
    if (DA.util.isFunction(cbhash.onTrigger)) {
        this.onTrigger = cbhash.onTrigger;
    }
    
    this.init();
};

DA.widget.PopupMenuController.prototype = {
    
    popupId: null,
    
    popupNode: null,
    
    triggerId: null,
    
    triggerNode: null,
    
    menuData: null,
    
    itemData: null,
    
    popupMenu: null,
    
    onTrigger: Prototype.emptyFunction,
    
    /**
     * @method init
     * @description init a popup menu.
     */
    init: function() {
        this.popupNode = DA.dom.createDiv(this.popupId);
        this.popupNode.style.visibility = 'hidden';
        
        YAHOO.util.Dom.addClass(this.popupNode, 'da_popupMenu' + this._className());
        YAHOO.util.Event.addListener(window.document, "click", this._onTrigger, this, true);
        YAHOO.util.Event.addListener(window.document, "contextmenu", this.cancel, this, true);
    },
    
    _onTrigger: function(e) {
        if (DA.event.onClick(e)) {
            if (this.onTrigger(e)) {
                this.position(e.clientX + 1, e.clientY + 1);
                this.show();
            } else {
                this.cancel();
            }
        } else {
            this.cancel();
        }
    },
    
    _onClick: function(e) {
        var el = YAHOO.util.Event.getTarget(e);
        var func;
         
        if (el && el.id && el.id.match(/MenuItem\_([^\_]+)\_[^\_]+$/)) {
            func  = RegExp.$1;
            if (!this._disabled(func)) {
                // TODO: test if func yeilds and actual function (NPE check)
                this._onclick(func)(e, this._args(func));
            }
        }
    },
    
    _className: function() {
        if (DA.util.isEmpty(this.menuData.className)) {
            return '';
        } else {
            return ' ' + this.menuData.className;
        }
    },
    
    _func: function(i, j) {
        return this.menuData.order[i][j];
    },
    
    _id: function(func) {
        return this.popupId + 'MenuItem_' + func;
    },
    
    _text: function(func) {
        return this.menuData.items[func].text;
    },
    _title: function(func) {
        return this.menuData.items[func].title;
    },  
    _onclick: function(func) {
        return this.menuData.items[func].onclick;
    },
    
    _args: function(func) {
        return this.menuData.items[func].args;
    },
    
    _selected: function(func) {
        if (DA.util.isEmpty(this.menuData.items[func].selected)) {
            return false;
        } else {
            return this.menuData.items[func].selected;
        }
    },
    
    _disabled: function(func) {
        if (DA.util.isEmpty(this.menuData.items[func].disabled)) {
            return false;
        } else {
            return this.menuData.items[func].disabled;
        }
    },
    
    _hidden: function(func) {
        if (DA.util.isEmpty(this.menuData.items[func].hidden)) {
            return false;
        } else {
            return this.menuData.items[func].hidden;
        }
    },
    
    text: function(func, text) {
        this.menuData.items[func].text = text;
    },
    
    onclick: function(func, onclick) {
        this.menuData.items[func].onclick = onclick;
    },
    
    args: function(func, args) {
        this.menuData.items[func].args = args;
    },
    
    enabled: function(func) {
        this.menuData.items[func].disabled = false;
    },
    
    disabled: function(func) {
        this.menuData.items[func].disabled = true;
    },
    
    visible: function(func) {
        this.menuData.items[func].hidden = false;
    },
    
    hidden: function(func) {
        this.menuData.items[func].hidden = true;
    },
    
    /**
     * @method show
     * @description Show or hidden the popup menu.
     * @param {Object} itemData Data of popup menu.
     * @public
     */
    show: function() {
        var i, j, l, s, d, t,ti,title;
        var me   = this;
        var html = '<div oncontextmenu="return false;">';
        var iLength, jLength, node;
        var BLink, T_link;
		var overColor = "this.style.background='#e0e0e0'";
        var outColor = "this.style.background='#efefef fixed top'"; 
        iLength = this.menuData.order.length;

        if (DA.vars.custom.menu.setPopupMenu) {
             eval(DA.vars.custom.menu.setPopupMenu);
        }

        for (i = 0; i < iLength; i ++) {
            l = '';
            jLength = this.menuData.order[i].length;
            for (j = 0; j < jLength; j ++) {
                if (!this._hidden(this._func(i, j))) {
                    s  = (this._selected(this._func(i, j))) ? ' selected' : '';
                    d  = (this._disabled(this._func(i, j))) ? ' disabled' : '';
                    t  = (this.menuData.encode === false) ? this._text(this._func(i, j)) : DA.util.encode(this._text(this._func(i, j)));
                    if (this.menuData.className === 'da_messageViewerHeaderAttachmentPulldownMenu') {
                    	ti  = (this.menuData.encode === false) ? this._title(this._func(i, j)) : DA.util.encode(this._title(this._func(i, j)));
                    	title = 'title="'+ti+'"';
                    }
                    l += '<li id="' + this._id(this._func(i, j)) + '_li" class="da_popupMenuItem' + s + d + this._className()+'"'+ title+ '>' +
                         '<a id="' + this._id(this._func(i, j)) + '_a" class="' + s + d + '">' + t + '</a>' +
                         '</li>';
                }
            }
            if ((this.menuData.className === 'da_messageViewerHeaderAttachmentPulldownMenu') && DA.vars.config.soft_install === 1){
            	if(jLength >= 2){
                    BLink = this.menuData.items[0].args.toString();
                    T_link = BLink.replace(/(.;)/g,", 'all'$1");
                    l += '</ul><ul><li id="message_headerAttachmentIconPopupMenuItem_downAll_li" class="da_popupMenuItem" '+
                        'onmouseover="'+overColor+';"'+
                        'onmouseout="'+outColor+';" onclick="'+T_link+'">'+ DA.imageLoader.tag(DA.vars.imgRdir + '/ico_fc_download.gif', '', { align: 'absmiddle' }) + DA.locale.GetText.t_('B_DOWNLOAD') + '</li>'; 
                }
                l += '<li id="message_headerAttachmentIconPopupMenuItem_saveAttaches_li" class="da_popupMenuItem" '+
                    'onmouseover="'+overColor+';"'+
                    'onmouseout="'+outColor+';" onclick="window.__messageViewer.showsaveattachestolibdialog(event.clientX,event.clientY);">'+ DA.imageLoader.tag(DA.vars.imgRdir + '/ico_fc_docsave.gif', '', { align: 'absmiddle' }) + DA.locale.GetText.t_('MESSAGE_SAVEATTACHESTOLIB_MENU') + '</li>';
            }
            if (!DA.util.isEmpty(l)) {
                html += '<ul>' + l + '</ul>';
            }
        }
        
        html += '</div>';
        
        this.popupNode.innerHTML = html;
        
        iLength = this.menuData.order.length;
        for (i = 0; i < iLength; i ++) {
            jLength = this.menuData.order[i].length;
            for (j = 0; j < jLength; j ++) {
                if (!this._hidden(this._func(i, j)) && !this._disabled(this._func(i, j))) {
                    node = YAHOO.util.Dom.get(this._id(this._func(i, j)) + '_li');
                    node.onmouseover = function(e) {
                        YAHOO.util.Dom.addClass(this, 'selected');
                    };
                    node.onmouseout = function(e) {
                        YAHOO.util.Dom.removeClass(this, 'selected');
                    };
                    YAHOO.util.Event.addListener(node, "click", this._onClick, this, true);
                }
            }
        }
        
        this.adjustPosition();
        DA.shim.open(this.popupNode);
        
        this.popupNode.style.visibility = '';
    },
    
    /**
     * @method cancel
     * @description cancel the dialog.
     * @public
     */
    cancel: function() {
        if (this.visibility()) {
            this.popupNode.style.visibility = 'hidden';
            DA.shim.close(this.popupNode);

            this.onCancel();
        }
    },

    /**
     * @prototype onCancel 
     * @type {function} callback executed when the menu/popup is hidden/cancelled.
     */
    onCancel: Prototype.emptyFunction,
    
    position: function(x, y) {
        DA.dom.position(this.popupNode, x, y);
    },
    
    adjustPosition: function() {
        DA.dom.adjustPosition(this.popupNode);
    },
    
    visibility: function() {
        if (this.popupNode.style.visibility === 'hidden') {
            return false;
        } else {
            return true;
        }
    }

};

/**
 * Builds a popup Menu.
 * FIXME: JSDOC for the params
 * @constructor
 * @class PopupMenuNoTrigger
 * @namespace DA.widget
 */

DA.widget.PopupMenuNoTrigger = function(popupId, menuData, cbhash){
    this.popupId  = popupId;
    this.menuData = menuData;
    
    if (DA.util.isFunction(cbhash.onTrigger)) {
        this.onTrigger = cbhash.onTrigger;
    }
    
    this.init();
};

Object.extend(DA.widget.PopupMenuNoTrigger.prototype, DA.widget.PopupMenuController.prototype);
DA.widget.PopupMenuNoTrigger.prototype.init = function() {
    this.popupNode = DA.dom.createDiv(this.popupId);
    this.popupNode.style.visibility = 'hidden';
    
    YAHOO.util.Dom.addClass(this.popupNode, 'da_popupMenu' + this._className());
    YAHOO.util.Event.addListener(window.document, "click", this._onTrigger, this, true);
    YAHOO.util.Event.addListener(window.document, "contextmenu", this.cancel, this, true);
    
    DA.widget.PopupMenuManager.registMenu(this.popupId, this);
};
DA.widget.PopupMenuNoTrigger.prototype._onTrigger = function(e) {
    if (!DA.event.onClick(e) || !this.onTrigger(e)) {
        this.cancel();
    }
};

/**
 * Builds a context Menu.
 * FIXME: JSDOC for the params
 * @constructor
 * @class ContextMenuController
 * @namespace DA.widget
 */

DA.widget.ContextMenuController = function(popupId, triggerId, menuData, cbhash){
    this.popupId     = popupId;
    this.triggerId   = triggerId;
    this.triggerNode = YAHOO.util.Dom.get(triggerId);
    this.menuData    = menuData;
    
    if (DA.util.isFunction(cbhash.onTrigger)) {
        this.onTrigger = cbhash.onTrigger;
    }
    /**
     * FIXME: this looks like repetitive code...
     */
    if (DA.util.isFunction(cbhash.onCancel)) {
        this.onCancel = cbhash.onCancel;
    }
    
    this.init();
};

Object.extend(DA.widget.ContextMenuController.prototype, DA.widget.PopupMenuController.prototype);
DA.widget.ContextMenuController.prototype.init = function() {
    this.popupNode = DA.dom.createDiv(this.popupId);
    this.popupNode.style.visibility = 'hidden';

    YAHOO.util.Dom.addClass(this.popupNode, 'da_popupMenu' + this._className());
    if (BrowserDetect.browser === 'Explorer') {
        YAHOO.util.Event.addListener(window.document, "contextmenu", this._onTrigger, this, true);
        YAHOO.util.Event.addListener(window.document, "click", this.cancel, this, true);
    } else {
        YAHOO.util.Event.addListener(window.document, "click", this._onTrigger, this, true);
    }
    
    DA.widget.PopupMenuManager.registMenu(this.popupId, this);
};
DA.widget.ContextMenuController.prototype._onTrigger = function(e) {
    if (DA.event.onContextMenu(e)) {
        if (this.onTrigger(e)) {
            this.position(e.clientX + 1, e.clientY + 1);
            this.show();
        } else {
            this.cancel();
        }
    } else {
        this.cancel();
    }
};

/**
 * Builds a pulldown Menu.
 * @constructor
 * @class PulldownMenuController
 * @namespace DA.widget
 */

DA.widget.PulldownMenuController = function(popupId, triggerId, menuData, cbhash){
    this.popupId     = popupId;
    this.triggerId   = triggerId;
    this.triggerNode = YAHOO.util.Dom.get(triggerId);
    this.menuData    = menuData;
    
    if (DA.util.isFunction(cbhash.onTrigger)) {
        this.onTrigger = cbhash.onTrigger;
    }
    
    this.init();
};

Object.extend(DA.widget.PulldownMenuController.prototype, DA.widget.PopupMenuController.prototype);
DA.widget.PulldownMenuController.prototype.init = function() {
    this.popupNode = DA.dom.createDiv(this.popupId);
    this.popupNode.style.visibility = 'hidden';

    YAHOO.util.Dom.addClass(this.popupNode, 'da_popupMenu' + this._className());
    YAHOO.util.Event.addListener(window.document, "click", this._onTrigger, this, true);
    YAHOO.util.Event.addListener(window.document, "contextmenu", this.cancel, this, true);
    
    DA.widget.PopupMenuManager.registMenu(this.popupId, this);
};
DA.widget.PulldownMenuController.prototype._onTrigger = function(e) {
    if (DA.event.onClick(e)) {
        if (this.onTrigger(e)) {
            if (this.visibility()) {
                this.cancel();
            } else {
                this.position(e.clientX + 1, e.clientY + 1);
                this.show();
            }
        } else {
            this.cancel();
        }
    } else {
        this.cancel();
    }
};

DA.widget.PopupMenuManager = {
    data: {},
    
    registMenu: function(id, r) {
        this.data[id] = r;
    },
    
    allCancel: function() {
        var id;
        for (id in this.data) {
            if (!DA.util.isFunction(this.data[id])) {
                this.data[id].cancel();
            }
        }
    }
};
/* $Id: info.js 2515 2014-11-12 01:46:31Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/account/info.js $ */
/*jslint evil: true */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

/*for JSLINT undef checks*/
/*extern YAHOO */ 
/*extern Prototype $ $H */
/*extern DA */

/**
 * TODO: comments, explanation
 * @class ug
 * @static
 */
DA.ug = {
   
   /**
    * TODO: comments
    * @static
    * @method list2String
    */
   list2String: function(uglist, cols, max) {
        var i, l, u, e;
        var string = '';
        
        if (DA.util.isEmpty(cols)) {
            cols = 3;
        }
        
        if (uglist) {
            for(i = 0; i < uglist.length; i ++) {
                l = '';
                e = '';
                u = uglist[i];
                
                if (DA.util.isEmpty(u.name)) {
                    if (DA.util.isEmpty(u.email)) {
                        continue;
                    } else {
                        l = DA.util.encode(u.email);
                    }
                } else {
                    if (DA.util.isEmpty(u.title)) {
                        l = DA.util.encode(u.name);
                    } else {
                        if (u.title_pos === 1) {
                            l = DA.util.encode(u.title + u.name);
                        } else {
                            l = DA.util.encode(u.name + u.title);
                        }
                    }
                    if (!DA.util.isEmpty(u.email)) {
                        l += '&nbsp;' + DA.util.encode('<' + u.email + '>');
                    }
                }
                
                if (u.external === 1) {
                    e = ' da_ugInfromationListExternal';
                }

                if (!DA.util.isEmpty(u.link)) {
                    l = '<span onclick="' + u.link + '" class="da_ugInformationListLink' + e + '">' + l + '</span>';
                } else {
                    l = '<span class="da_ugInformationListNoLink' + e + '">' + l + '</span>';
                }

                if (!DA.util.isEmpty(u.icon)) {
                    l = DA.imageLoader.tag(u.icon, u.alt, { align: 'absmiddle' }) + l;
                }
                
                if (!DA.util.isEmpty(u.regist)) {
                    l += '<span onclick="' + u.regist + '" class="da_ugInformationListLink">' +
                         DA.imageLoader.tag(DA.vars.imgRdir + '/ico_adradd.gif', '', { align: 'absmiddle' }) +
                         '</span>';
                }
                
                if (!DA.util.isEmpty(l)) {
                    if (DA.util.isNumber(max) && i + 1 >= max) {
                        string += '<span style="white-space: nowrap;">' + l + '&nbsp;<b>..</b></span>\n';
                        break;
                    } else {
                        string += '<span style="white-space: nowrap;">' + l + '&nbsp;</span>\n';
                    }
                    if (cols > 0 && (i + 1) % cols === 0) {
                        string += '<br>';
                    }
                }
            }
        }
        
        return string;
    },
    
   /**
    * TODO: comments
    * @static
    * @method openAddrInfo
    */
    openAddrInfo: function(id, noname) {
        var Ids = id.split('-');
        var winname = 'aInfo' + Ids[0];
        
        if (!noname) {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + '/og_card_addr.cgi?id=' + id, winname, 'width=450,height=600,resizable=yes,scrollbars=yes');
        } else {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + '/og_card_addr.cgi?id=' + id, '', 'width=450,height=600,resizable=yes,scrollbars=yes');
        }
    },
    
   /**
    * TODO: comments
    * @static
    * @method openUserInfo
    */
    openUserInfo: function(mid, type, noname) {
        if (DA.util.isEmpty(type)) {
            type = 'addr';
        }
        
        var cgi = '/info_card.cgi?type=' + type + '&id=' + mid;
        var winname = 'Info' + mid;
        if (!noname) {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, winname, 'width=480,height=600,resizable=yes,scrollbars=yes');
        } else {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, '', 'width=480,height=600,resizable=yes,scrollbars=yes');
        }
    },
    
   /**
    * TODO: comments
    * @static
    * @method openGroupInfo
    */
    openGroupInfo: function(gid, noname) {
        var cgi = '/info_card.cgi?type=group&id=' + gid;
        var winname = 'gInfo' + gid;
        
        if (!noname) {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, winname,'width=500,height=480,resizable=yes,scrollbars=yes');
        } else {
            DA.windowController.winOpenCustom(DA.vars.cgiRdir + cgi, '', 'width=500,height=480,resizable=yes,scrollbars=yes');
        }
    },
    
   /**
    * TODO: comments
    * @static
    * @method openMLInfo
    */
    openMLInfo: function(mlid, noname) {
        var Proc = 'ml_card.cgi%3fl=' + mlid;
        var Img  = 'pop_title_mlinfo.gif';
        DA.windowController.isePopup(Proc, Img, 500, 500, '', 1);
    },
    
   /**
    * TODO: comments
    * @static
    * @method openBulkInfo
    */
    openBulkInfo: function(id, noname) {
        var Proc = 'address_card.cgi%3fid=' + id;
        var Img  = 'pop_title_mladinfo.gif';
        DA.windowController.isePopup(Proc, Img, 650, 600, '', 1);
    },
    
   /**
    * TODO: comments
    * @static
    * @method openAddrRegist
    */
    openAddrRegist: function(NAME, EMAIL) {
        var Proc = 'ma_ajx_addr_regist.cgi%3fname=' +
                   encodeURIComponent(encodeURIComponent(NAME)) +
                   '%20email=' +
                   encodeURIComponent(encodeURIComponent(EMAIL));
        var Img  = 'pop_title_regaddress.gif';
        if (DA.vars.custom.threePane.setAddressInsertProc) {
            eval(DA.vars.custom.threePane.setAddressInsertProc);
        }
        DA.windowController.isePopup(Proc, Img, 600, 400, '', 1);
    }
};

/**
 * TODO: comments, JSDOC
 * @constructor
 * @class InformationListController
 * @param node {HTMLElement} a DIV element which is container node for this widget.
 * @para  uglist // TODO
 * @param cbhash // TODO
 * @param cfg    // TODO
 */
DA.ug.InformationListController = function(node, uglist, cbhash, cfg) {
    this.ugNode = node;
    
    if (cbhash) {
        if (DA.util.isFunction(cbhash.onRemove)) {
            this.onRemove = cbhash.onRemove;
        }
        if (DA.util.isFunction(cbhash.onPopup)) {
            this.onPopup = cbhash.onPopup;
        }
    }
    
    if (cfg) {
        if (cfg.maxView) {
            this.maxView = cfg.maxView;
        }
        if (cfg.lineHeight) {
            this.lineHeight = cfg.lineHeight;
        }
        if (cfg.registEnabled) {
            this.registEnabled = cfg.registEnabled;
        }
        if (cfg.popupEnabled) {
            this.popupEnabled = cfg.popupEnabled;
        }
        if (cfg.deleteEnabled) {
            this.deleteEnabled = cfg.deleteEnabled;
        }
    }
   
    this.init(uglist);
};

// FIXME: comments, JSDOC really needed here
DA.ug.InformationListController.prototype = {

    ugNode: null,
    
    ugData: null,
    
    ugNdata: null,
    
    sno: 1,
    
    onRemove: Prototype.emptyFunction,
    
    onPopup: Prototype.emptyFunction,
    
    maxView: 0,
    
    lineHeight: 0,
    
    registEnabled: false,
    
    popupEnabled: true,
    
    deleteEnabled: true,

    beforeInsertScrollTop: 0,
    
    init: function(uglist) {
        // style.display = "none" fixes an apperance-bug on IE
        // TODO: if this.ugNode is not an HTMLElement, this will throw an exception
        this.ugNode.style.display = "none";

        // FIXME: ugData is a hash or an array?
        this.ugData  = {};
        this.ugNdata = {};
        this.addList(uglist);
    },
    
    add: function(u, noresize, perf) {
        var l   = {};
        var n   = {};
        var me  = this;

        // TODO: confirm this behavior
        // id not exists pattern.
        if (!u) {
            return;
        }
        
        if (DA.util.isEmpty(u.name) && DA.util.isEmpty(u.email)) {
            return;
        }
        
        var sno = this.sno++;
        
        // div 生成
        n.lineNode   = document.createElement('div');
        n.iconNode   = document.createElement('span');
        n.nameNode   = document.createElement('span');
        n.emailNode  = document.createElement('span');
        n.title0Node = document.createElement('span');
        n.title1Node = document.createElement('span');
        n.popupNode  = document.createElement('span');
        n.registNode = document.createElement('span');
        n.deleteNode = document.createElement('span');
        
        // class 指定
        n.lineNode.id          = 'da_ugInformationList' + me.ugNode.id.split("Item")[1] + 'LineId_' + sno;
        n.lineNode.className   = 'da_ugInformationListLine da_ugInformationListLineSno_' + sno + ' da_ugInformationListDragDrop_' + sno;
        n.iconNode.className   = 'da_ugInformationListIcon ' + 'da_ugInformationListDragDrop_' + sno;
        n.nameNode.className   = 'da_ugInformationListName ' + 'da_ugInformationListDragDrop_' + sno;
        n.emailNode.className  = 'da_ugInformationListEmail ' + 'da_ugInformationListDragDrop_' + sno;
        n.title0Node.className = 'da_ugInformationListTitle';
        n.title1Node.className = 'da_ugInformationListTitle';
        n.popupNode.className  = 'da_ugInformationListPopup';
        n.registNode.className = 'da_ugInformationListRegist';
        n.deleteNode.className = 'da_ugInformationListDelete';
        
        // append
        n.lineNode.appendChild(n.iconNode);
        n.lineNode.appendChild(n.title1Node);
        n.lineNode.appendChild(n.nameNode);
        n.lineNode.appendChild(n.title0Node);
        n.lineNode.appendChild(n.emailNode);
        n.lineNode.appendChild(n.popupNode);
        n.lineNode.appendChild(n.deleteNode);
        this.ugData[sno]  = l;
        this.ugNdata[sno] = n;
        
        this.id(sno, u.id);
        this.type(sno, u.type);
        this.lang(sno, u.lang);
        this.icon(sno, u.icon, u.alt);
        this.name(sno, u.name);
        this.title(sno, u.title, u.title_pos);
        this.email(sno, u.email || u.keitai_mail || u.pmail1 || u.pmail2);
        this.link(sno, u.link);
        this.regist(sno, u.regist);
        this.popup(sno);
        this['delete'](sno);
        this.linkStyle(sno);
        this.ugNode.appendChild(n.lineNode);
        eval("DA.mailer.MessageEditor.prototype.dropAddress"+sno+"To = setInterval(function(){return new YAHOO.util.DDTarget(\"da_ugInformationList"+me.ugNode.id.split("Item")[1]+"LineId_"+sno+"\",\"editorAddress\")},1000)");

        // Make sure we are performing calculations with a parent whose
        // offsetHeight is not 0...
        // This is to prevent lineHeight from getting set to 0 (Bug in FF (not FF's fault))
        if (perf !== true) {
            this.ugNode.style.display = "block";
            this.lineHeight = this.height(sno);
            if(this.lineHeight > DA.dom.height("da_messageEditorItemToText") && DA.dom.height("da_messageEditorItemToText") >= 19){
                this.lineHeight = DA.dom.height("da_messageEditorItemToText") - 2;
            }
        }
        
        if (!noresize) {
            this.resize();
            this.scroll();
        }
    },

    insertToTop: function(u, deleteSno) {
        var l   = {};
        var n   = {};
        var me  = this;

        // TODO: confirm this behavior
        // id not exists pattern.
        if (!u) {
            return;
        }
        
        if (DA.util.isEmpty(u.name) && DA.util.isEmpty(u.email)) {
            return;
        }
        
        var sno = this.sno++;
        if ( deleteSno !== 0 ) {
            delete this.ugData[deleteSno];
        }
        var ugDataBefore = this.ugData;
        this.ugNode.innerHTML = '';
        this.ugNode.style.display = 'none';
        this.ugData  = {};
        this.ugNdata = {};
        // div 生成
        n.lineNode   = document.createElement('div');
        n.iconNode   = document.createElement('span');
        n.nameNode   = document.createElement('span');
        n.emailNode  = document.createElement('span');
        n.title0Node = document.createElement('span');
        n.title1Node = document.createElement('span');
        n.popupNode  = document.createElement('span');
        n.registNode = document.createElement('span');
        n.deleteNode = document.createElement('span');
        
        // class 指定
        n.lineNode.id          = 'da_ugInformationList' + me.ugNode.id.split("Item")[1] + 'LineId_' + sno;
        n.lineNode.className   = 'da_ugInformationListLine da_ugInformationListLineSno_' + sno + ' da_ugInformationListDragDrop_' + sno;
        n.iconNode.className   = 'da_ugInformationListIcon ' + 'da_ugInformationListDragDrop_' + sno;
        n.nameNode.className   = 'da_ugInformationListName ' + 'da_ugInformationListDragDrop_' + sno;
        n.emailNode.className  = 'da_ugInformationListEmail ' + 'da_ugInformationListDragDrop_' + sno;
        n.title0Node.className = 'da_ugInformationListTitle';
        n.title1Node.className = 'da_ugInformationListTitle';
        n.popupNode.className  = 'da_ugInformationListPopup';
        n.registNode.className = 'da_ugInformationListRegist';
        n.deleteNode.className = 'da_ugInformationListDelete';
        
        // append
        n.lineNode.appendChild(n.iconNode);
        n.lineNode.appendChild(n.title1Node);
        n.lineNode.appendChild(n.nameNode);
        n.lineNode.appendChild(n.title0Node);
        n.lineNode.appendChild(n.emailNode);
        n.lineNode.appendChild(n.popupNode);
        n.lineNode.appendChild(n.deleteNode);
        this.ugData[sno]  = l;
        this.ugNdata[sno] = n;
        
        this.id(sno, u.id);
        this.type(sno, u.type);
        this.lang(sno, u.lang);
        this.icon(sno, u.icon, u.alt);
        this.name(sno, u.name);
        this.title(sno, u.title, u.title_pos);
        this.email(sno, u.email || u.keitai_mail || u.pmail1 || u.pmail2);
        this.link(sno, u.link);
        this.regist(sno, u.regist);
        this.popup(sno);
        this['delete'](sno);
        this.linkStyle(sno);
        this.ugNode.appendChild(n.lineNode);
        eval("DA.mailer.MessageEditor.prototype.dropAddress"+sno+"To = setInterval(function(){new YAHOO.util.DDTarget(\"da_ugInformationList"+me.ugNode.id.split("Item")[1]+"LineId_"+sno+"\",\"editorAddress\")},1000)");

        // Make sure we are performing calculations with a parent whose
        // offsetHeight is not 0...
        // This is to prevent lineHeight from getting set to 0 (Bug in FF (not FF's fault))
        var addList = [];
        var listCounter = 0;
        for (var i in ugDataBefore) {
            if (ugDataBefore[i]) {
                addList[listCounter++] = ugDataBefore[i];
            }
        }
        this.ugNode.style.display = "block";
        this.lineHeight = this.height(sno);
        if(this.lineHeight > DA.dom.height("da_messageEditorItemToText") && DA.dom.height("da_messageEditorItemToText") >= 19){
            this.lineHeight = DA.dom.height("da_messageEditorItemToText") - 2;
        }
        if (!addList || !addList.length) { return; }
        var uglistLength = addList.length; // Loop optimizations
        
        for (i = 0; i < uglistLength; ++i) {
            this.add(addList[i]);
        }
        this.resize();
        this.scroll();
    },

    insertAfterNode: function(u, afterSno, insertAfterNodeId, isInsideSameArea) {
        var l   = {};
        var n   = {};
        var me  = this;

        // TODO: confirm this behavior
        // id not exists pattern.
        if (!u) {
            return;
        }
        if (DA.util.isEmpty(u.name) && DA.util.isEmpty(u.email)) {
            return;
        }
        if (isInsideSameArea === "true") {
            delete this.ugData[afterSno];
            delete this.ugNdata[afterSno];
        }
        var sno = this.sno++;
        var ugDataBefore = this.ugData;
        var ugNdataBefore = this.ugNdata;
        this.ugNode.innerHTML = '';
        this.ugNode.style.display = 'none';
        this.ugData  = {};
        this.ugNdata = {};
        var addList = [];
        var listCounter = 0;
        var nodeCounter = 0;
        var nodeCounterResult = 0;
        for (var i in ugDataBefore) {
            if (i.match(/^\d+$/) && i > 0) {
                if (ugDataBefore[i]) {
                    if (ugNdataBefore[i].lineNode.id !== insertAfterNodeId) {
                        addList[listCounter++] = ugDataBefore[i];
                        nodeCounter++;
                    } else {
                        addList[listCounter++] = ugDataBefore[i];
                        addList[listCounter++] = u;
                        nodeCounterResult = nodeCounter;
                    }
                }
            }
        }
        if ( nodeCounterResult > 1 ) {
            this.beforeInsertScrollTop = (nodeCounterResult - 1) * 20;
        } else {
            this.beforeInsertScrollTop = 0;
        }
        this.ugNode.style.display = "block";
        this.lineHeight = this.height(sno);
        if(this.lineHeight > DA.dom.height("da_messageEditorItemToText") && DA.dom.height("da_messageEditorItemToText") >= 19){
            this.lineHeight = DA.dom.height("da_messageEditorItemToText") - 2;
        }
        if (!addList || !addList.length) { return; }
        var uglistLength = addList.length; // Loop optimizations
        
        for (i = 0; i < uglistLength; ++i) {
            this.add(addList[i], true);
        }
        this.resize();
        this.scrollTo(this.beforeInsertScrollTop);
    },

    showAllAddress: function() {
        var me = this;
        var length = this.list().length;
        me.ugNode.style.height = (length * 18 +  10)+ "px";
    },
   
    /**
     * Convenience method that allows list addition.
     * @method addList
     * @param uglist {Array} array of user/group info objects
     */
    addList: function(uglist, perf) {
        if (!uglist || !uglist.length) { return; }
        var uglistLength = uglist.length; // Loop optimizations
        var i;
        
        // for performance
        if (perf === true) {
            this.ugNode.style.display = 'none';
        }
        for (i = 0; i < uglistLength; ++i) {
            this.add(uglist[i], true, perf);
        }
        this.resize();
        this.scroll();
    },
    
    linkStyle: function(sno) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(l.link)) {
            YAHOO.util.Dom.removeClass( [n.title1Node, n.nameNode, n.emailNode, n.title0Node], 
                    'da_ugInformationListLink');
            YAHOO.util.Dom.addClass( [n.title1Node, n.nameNode, n.emailNode, n.title0Node], 
                    'da_ugInformationListNoLink');
        } else {
            YAHOO.util.Dom.removeClass( [n.title1Node, n.nameNode, n.emailNode, n.title0Node], 
                    'da_ugInformationListNoLink');
            YAHOO.util.Dom.addClass( [n.title1Node, n.nameNode, n.emailNode, n.title0Node], 
                    'da_ugInformationListLink');
        }
    },
    
    list: function() {
        var sno;
        var list = [];
        
        for (sno in this.ugData) {
            if (sno.match(/^\d+$/) && sno > 0) {
                list.push($H(this.ugData[sno]));
            }
        }
        
        return list;
    },
    
    get: function(sno, key) {
        if (DA.util.isEmpty(key)) {
            return this.ugData[sno];
        } else {
            return this.ugData[sno][key];
        }
    },

    getNdata: function(sno) {
        return this.ugNdata[sno];
    }, 
    
    width: function(sno) {
        if (this.ugNdata[sno]) {
            return DA.dom.width(this.ugNdata[sno].lineNode);
        } else {
            return 0;
        }
    },
    
    height: function(sno) {
        if (this.ugNdata[sno]) {
            return DA.dom.height(this.ugNdata[sno].lineNode);
        } else {
            return 0;
        }
    },
    
    count: function() {
        var key, count = 0;
        
        for (key in this.ugData) {
            if (!DA.util.isFunction(this.ugData[key])) {
                count ++;
            }
        }
        
        return count;
    },
    
    resize: function() {
        var count;
        var height=0; 
       
        if (this.maxView > 0) {
            count = this.count();
            
            if (count > 0) {
                if(this.ugNode.firstChild){ 
                    height=this.ugNode.firstChild.offsetHeight; 
                } 
                if(this.lineHeight>height){ 
                    height=this.lineHeight; 
                } 
                if (count > this.maxView) {
                    YAHOO.util.Dom.addClass(this.ugNode, 'da_ugInformationListOverflowAuto');
                    DA.dom.sizeHeight(this.ugNode, height * this.maxView);
                } else {
                    YAHOO.util.Dom.removeClass(this.ugNode, 'da_ugInformationListOverflowAuto');
                    DA.dom.sizeHeight(this.ugNode, height * count);
                }
                this.ugNode.style.display = '';
            } else {
                this.ugNode.style.display = 'none';
            }
        }
    },
    
    dummy: function(sno) {
        var n    = this.ugNdata[sno];
        var html = n.iconNode.innerHTML + n.title1Node.innerHTML + n.nameNode.innerHTML + n.emailNode.innerHTML + n.title0Node.innerHTML;
        
        return html;
    },
    
    id: function(sno, id) {
        this.ugData[sno].id = (DA.util.isEmpty(id)) ? '' : id;
    },
    
    type: function(sno, type) {
        this.ugData[sno].type = (DA.util.isEmpty(type)) ? '' : type;
    },
    
    lang: function(sno, lang) {
        this.ugData[sno].lang = (DA.util.isEmpty(lang)) ? 'ja' : lang;
    },
    
    icon: function(sno, icon, alt) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(icon)) {
            l.icon = '';
            l.alt  = '';
            n.iconNode.innerHTML = '';
            n.iconNode.style.display = 'none';
        } else {
            l.icon = icon;
            l.alt  = (DA.util.isEmpty(alt)) ? '' : alt;
            n.iconNode.innerHTML = DA.imageLoader.tag(icon, alt, {'class': 'da_ugInformationListIconImage'});
            n.iconNode.style.display = '';
        }
    },
    
    name: function(sno, name, refreshEmail) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(name)) {
            l.name = '';
            n.nameNode.innerHTML = '';
            n.nameNode.style.display = 'none';
        } else {
            l.name = name;
            n.nameNode.innerHTML = DA.util.encode(name);
            n.nameNode.style.display = '';
        }
        
        if (refreshEmail) {
            this.email(sno, l.email);
        }
    },
    
    email: function(sno, email) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(email)) {
            l.email = '';
            n.emailNode.innerHTML = '';
            n.emailNode.style.display = 'none';
        } else {
            l.email = email;
            if (DA.util.isEmpty(l.name) && DA.util.isEmpty(l.title)) {
                n.emailNode.innerHTML = DA.util.encode(email);
                n.emailNode.style.display = '';
            } else {
                n.emailNode.innerHTML = '&nbsp;' + DA.util.encode('<' + email + '>');
                n.emailNode.style.display = '';
            }
        }
    },
    
    title: function(sno, title, title_pos, refreshEmail) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(title)) {
            l.title = '';
            l.title_pos = 0;
            n.title0Node.innerHTML = '';
            n.title1Node.innerHTML = '';
            n.title0Node.style.display = 'none';
            n.title1Node.style.display = 'none';
        } else {
            l.title = title;
            l.title_pos = title_pos;
            if (title_pos === 1) {
                n.title0Node.innerHTML = '';
                n.title1Node.innerHTML = DA.util.encode(title);
                n.title0Node.style.display = 'none';
                n.title1Node.style.display = '';
            } else {
                n.title0Node.innerHTML = DA.util.encode(title);
                n.title1Node.innerHTML = '';
                n.title0Node.style.display = '';
                n.title1Node.style.display = 'none';
            }
        }
        
        if (refreshEmail) {
            this.email(sno, l.email);
        }
    },
    
    link: function(sno, link) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(link)) {
            l.link = '';
            n.nameNode.onclick   = Prototype.emptyFunction;
            n.emailNode.onclick  = Prototype.emptyFunction;
            n.title0Node.onclick = Prototype.emptyFunction;
            n.title1Node.onclick = Prototype.emptyFunction;
        } else {
            l.link = link;
            n.nameNode.onclick = function(e) {
                eval(link);
            };
            n.emailNode.onclick = function(e) {
                eval(link);
            };
            n.title0Node.onclick = function(e) {
                eval(link);
            };
            n.title1Node.onclick = function(e) {
                eval(link);
            };
        }
    },
    
    regist: function(sno, regist) {
        var l = this.ugData[sno];
        var n = this.ugNdata[sno];
        
        if (DA.util.isEmpty(regist) || !this.registEnabled) {
            l.regist = '';
            n.registNode.innerHTML = '';
            n.registNode.style.display = 'none';
        } else {
            l.regist = regist;
            n.registNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_adradd.gif', '', { 'class': 'da_ugInformationListRegist' });
            n.registNode.onclick = function() {
                eval(regist);
            };
            n.registNode.style.display = '';
        }
    },
    
    popup: function(sno) {
        var l  = this.ugData[sno];
        var n  = this.ugNdata[sno];
        var me = this;
        
        if (String(sno).match(/^\d+$/) && this.popupEnabled) {
            n.popupNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/scroll_btn_down02.gif', '', { 'class': 'da_ugInformationListPopup' });
            n.popupNode.onclick = function(e) {
                me.onPopup(DA.event.get(e), sno);
            };
            n.popupNode.style.display = '';
        } else {
            n.popupNode.style.display = 'none';
        }
    },
    
    'delete': function(sno) {
        var l  = this.ugData[sno];
        var n  = this.ugNdata[sno];
        var me = this;
        
        if (String(sno).match(/^\d+$/) && this.deleteEnabled) {
            n.deleteNode.innerHTML = DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_close_s.gif', '', { 'class': 'da_ugInformationListDelete' });
            n.deleteNode.onclick = function(e) {
                me.remove(sno);
                me.onRemove(DA.event.get(e), sno);
            };
            n.deleteNode.style.display = '';
        } else {
            n.deleteNode.style.display = 'none';
        }
    },
    
    remove: function(sno) {
        if (!this.ugNdata[sno]) {
            return;
        }
        var lineNode = this.ugNdata[sno].lineNode;
        if (lineNode) {
            lineNode.innerHTML = '';
            lineNode.parentNode.removeChild(lineNode);
        }
        delete this.ugData[sno];
        delete this.ugNdata[sno];
        
        this.resize();
    },
    
    clear: function() {
        this.ugNode.innerHTML = '';
        this.ugNode.style.display = 'none';
        this.ugData  = {};
        this.ugNdata = {};
    },
    
    isAddr: function(sno) {
        return (this.get(sno, 'type') === DA.vars.ugType.addr) ? true: false;
    },
    
    isUser: function(sno) {
        return (this.get(sno, 'type') === DA.vars.ugType.user) ? true: false;
    },
    
    isGroup: function(sno) {
        return (this.get(sno, 'type') === DA.vars.ugType.group) ? true: false;
    },
    
    isBulk: function(sno) {
        return (this.get(sno, 'type') === DA.vars.ugType.bulk) ? true: false;
    },
    
    isML: function(sno) {
        return (this.get(sno, 'type') === DA.vars.ugType.ml) ? true: false;
    },
    
    groupExists: function() {
        var sno;
        for (sno in this.ugData) {
            if (sno.match(/^\d+$/) && this.isGroup(sno)) {
                return true;
            }
        }
        return false;
    },

	userExists:function(){
		var sno;
		for(sno in this.ugData){
			if(sno.match(/^\d+$/)&&this.isUser(sno)){
				return true;
			}
		}
		return false;
		// return true;
	},
	
    scroll: function() {
        try {
            this.ugNode.scrollTop = this.ugNode.scrollHeight;
        } catch(e) {
        }
    },

    scrollTo: function(height) {
        try{
            this.ugNode.scrollTop = height;
        } catch(e){
        }
    }
};

/* $Id: logging.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/logging/logging.js $ */
/*for JSLINT undef checks*/
/*extern DA */
/**
 * TODO: comments
 *
 *
 *
 */
 
if ('undefined' === typeof DA) {
    alert("ERROR: need DA.js");
} else {
    if (! DA.logging) {
        DA.logging = {};
    }
}

/**
 * TODO: comments
 *
 *
 *
 */
DA.logging.Logger = function (elem) {
  var _elem = elem ? elem : document.body;
  var div = document.createElement("div");
  div.innerHTML = 'Log: ';
  
  // 3 buttons
  var showBtn = document.createElement("button");
  showBtn.innerHTML = "Show Log";
  var hideBtn = document.createElement("button");
  hideBtn.innerHTML = "Hide Log";
  hideBtn.disabled = true;
  var clearBtn = document.createElement("button");
  clearBtn.innerHTML = "Clear Log";

  // <PRE> tag for the log
  var pre = document.createElement("pre");
  pre.style.display = "none";
  pre.style.height = "100px";
  pre.style.overflow = 'scroll';
  pre.style.backgroundColor = '#225522';
  pre.style.color =  '#ffffff';
  pre.style.fontSize = '9pt';

  showBtn.onclick = function() {
    pre.style.display = 'block';
    this.disabled = true;
    hideBtn.disabled = false;
  };
  hideBtn.onclick = function() {
    pre.style.display = 'none';
    this.disabled = true;
    showBtn.disabled = false;
  };
  clearBtn.onclick = function() {
    pre.innerHTML = "";
  };

  div.appendChild(showBtn);
  div.appendChild(hideBtn);
  div.appendChild(clearBtn);
  
  div.appendChild(pre);
 
  _elem.appendChild(div);
  this.log = function(str) {
    pre.appendChild(document.createTextNode(str + "\n\r"));
    pre.scrollTop = pre.scrollHeight;

  };
  
};

/**
 * @see DA.util#time_diff
 */
DA.logging.time_diff = DA.util.time_diff;

/* $Id: event.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/event/event.js $ */
/*for JSLINT undef checks*/
/*extern BrowserDetect DA */
/**
 * TODO: comments
 */
if (!DA || !DA.util) {
    alert("ERROR: missing DA.js"); // TODO: formalize/cleanup
}

if (typeof DA.event === "undefined") {
    DA.event = {};
}

DA.event = {
    
    get: function(e) {
        if (e) {
            return e;
        } else {
            return window.event;
        }
    },
    
    onClick: function(e) {
        if (e.button === 0) {
            return true;
        } else {
            return false;
        }
    },
   
    /**
     * FIXME: this is hard to understand and needs comments...
     */
    onContextMenu: function(e) {
        var b = (BrowserDetect.browser === 'Explorer') ? 0 : 2;
        
        if (e.button === b) {
            return true;
        } else {
            return false;
        }
    }
};
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
/* $Id: editor.js 2515 2014-11-12 01:46:31Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/message/editor.js $ */
/*jslint evil: true */
/*for JSLINT undef checks*/
/*extern $ initRTE writeRichText BrowserDetect DA Event Prototype YAHOO FCKeditor FCKeditorAPI FCKEditorIframeController*/
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.mailer || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Message viewer widget. 
 * 
 * Usage: 
 *   var mv = new DA.mailer.MessageEditor();
 * 
 * @class MessageEditor
 * @uses 
 * @constructor
 * @param messageNode HTMLElement DOM node in which to draw the message.
 */
DA.mailer.MessageEditor = function(headerNode, textNode, htmlNode, previewNode, cbhash, threePane, requestUrl, ddApplet) {
    this.headerNode  = headerNode;
    this.headerId    = headerNode.id;
    this.textNode    = textNode;
    this.textId      = textNode.id;
    this.htmlNode    = htmlNode;
    this.htmlId      = htmlNode.id;
    this.previewNode = previewNode; 
    this.previewId   = previewNode.id;
    this.threePane    = threePane;
    this.requestUrl   = requestUrl;
    this.forced_interruption = 0;
    
    if (cbhash) {
        if (DA.util.isFunction(cbhash.onLoad)) {
            this.onLoad = cbhash.onLoad;
        }
        if (DA.util.isFunction(cbhash.onPreview)) {
            this.onPreview = cbhash.onPreview;
        }
        if (DA.util.isFunction(cbhash.onForcedInterruption)) {
            this.onForcedInterruption = cbhash.onForcedInterruption;
        }
        if (DA.util.isFunction(cbhash.onBack)) {
            this.onBack = cbhash.onBack;
        }
        if (DA.util.isFunction(cbhash.doResize)) {
            this.doResize = cbhash.doResize;
        }
        if (DA.util.isFunction(cbhash.onEnable)) {
            this.onEnable = cbhash.onEnable;
        }
    }
    if (ddApplet) {
        if (ddApplet.uploadCompleted) {
            this.ddAppletUploadCompleted = ddApplet.uploadCompleted;
        }
        if (ddApplet.beforeUpload) {
            this.ddAppletBeforeUpload = ddApplet.beforeUpload;
        }
        if (ddApplet.afterUpload) {
            this.ddAppletAfterUpload = ddApplet.afterUpload;
        }
        if (ddApplet.afterMoreThanMax) {
            this.ddAppletAfterMoreThanMax = ddApplet.afterMoreThanMax;
        }
    }
    
    var query = DA.util.parseQuery(this.requestUrl);
    if (query.external && DA.util.cmpNumber(query.external, 1)) {
        this.external = true;
    } else {
        this.external = false;
    }
    
    // Callback point (pre-init)
    if (DA.vars.custom.editor.setMessageEditor) {
        eval(DA.vars.custom.editor.setMessageEditor);
    }
    
    this.init();
    
    // Callback point (post-init)
    if (DA.vars.custom.editor.setMessageEditor2) {
        eval(DA.vars.custom.editor.setMessageEditor2);
    }
};

/**
 * Members
 */
DA.mailer.MessageEditor.prototype = {
    
    warnNode: null,
    
    headerNode: null,
    
    headerId : null,
    
    textNode: null,
    
    textId: null,
    
    htmlNode: null,
    
    htmlId: null,
    
    previewNode: null,
    
    previewId: null,
    
    headerContentsNode: null,
    
    textContentsNode: null,
    
    htmlContentsNode: null,
    
    selectedFid: null,
    
    selectedUid: null,

    proc       :  null,
    
    selectedMaid: null,
    
    selectedTid: null,
    
    selectedFrom:null,
    
    selectedSid: null,
    
    selectedFld: null,
    
    selectedSno: null,
    
    selectFolderType: null,
    
    currentUploadForm: null,
    
    currentSizeNode: null,
    
    toController: null,
    
    ccController: null,
    
    bccController: null,
    
    fileController: null,
    
    jsonIO: null,
    
    tmplIO: null,
    
    signIO: null,
    
    userIO: null,
    
    addrIO: null,
    
    groupIO: null,
    
    rnDialog: null,
    
    ceDialog: null,
    
    popup: null,
    
    menuData: null,
    
    dragAddressTo: null,
    
    dragAddressCc: null,
    
    dragAddressBcc: null,
    
    titleList: null,
    
    langList: null,
    
    signList: null,
    
    previewMode: false,
    
    spellcheckMode:  DA.vars.config.spellcheck_mode,
    
    fck: null,
    fckAPIs:null, 
    
    _FCKEditorCompleted: false,
    // no use
    threePane: null,
    
    requestUrl: null,
    
    ddAppletUploadCompleted: null,
    
    ddAppletBeforeUpload: null,
    
    ddAppletAfterUpload: null,
    
    ddAppletAfterMoreThanMax: null,
    
    mode: null,

    autoBackupedXML: null,

    backup_maid:null,

    backup_timeout_msg_alerted:null,
    
    autoBackupTimeout: DA.vars.system.auto_backup_interval * 1000,
    
    /**
     * FIXME: Need comments/JSDOC! Cannot understand what external means.
     * @property external
     * @type {Boolean}
     */
    external: false,
    
    uploading: {},
    
    /**
     * Load Function.
     */
    onLoad: Prototype.emptyFunction,
    
    /**
     * Preview Function.
     */
    onPreview: Prototype.emptyFunction,
    
    /**
     * Forced Interruption Function.
     */
    onForcedInterruption:Prototype.emptyFunction,
        
    /**
     * Back Function.
     */
    onBack: Prototype.emptyFunction,
    
    /**
     * Resize Functin.
     */
    doResize: Prototype.emptyFunction,
    
    /**
     * onEnable Functin.
     */
    onEnable: Prototype.emptyFunction,
    
    init: function() {
        DA.customEvent.fire('messageEditorInitBefore', this);

        var me = this;
        var header = ['<div class="da_messageEditorHeader">',
                      '<div id="da_messageEditorItemWarn" class="da_messageEditorWarn"></div>',
                      '<table class="da_messageEditorHeaderTable">',
                      '<tr>',
                      '  <td colspan="2" class="da_messageEditorHeaderTableTopLeft">', DA.imageLoader.nullTag(1, 3), '</td>',
                      '  <td class="da_messageEditorHeaderTableTopRight">', DA.imageLoader.nullTag(2, 3), '</td>',
                      '</tr>',
                      '<tr>',
                      '  <td class="da_messageEditorHeaderTableMiddleLeft">', DA.imageLoader.nullTag(2, 1), '</td>',
                      '  <td class="da_messageEditorHeaderTableMiddleCenter">', 
                      '    <table class="da_messageEditorHeaderContents">',
                      '    <tr>',
                      '      <td><div id="', this.headerId, 'Contents"></div><div id="', this.headerId, 'Preview"></div></td>',
                      '    </tr>',
                      '    </table>',
                      '  </td>',
                      '  <td class="da_messageEditorHeaderTableMiddleRight">', DA.imageLoader.nullTag(2, 1), '</td>',
                      '</tr>',
                      '<tr>',
                      '  <td colspan="2" class="da_messageEditorHeaderTableBottomLeft">', DA.imageLoader.nullTag(1, 2), '</td>',
                      '  <td class="da_messageEditorHeaderTableBottomRight">', DA.imageLoader.nullTag(2, 2), '</td>',
                      '</tr>',
                      '</table>',
                      '</div>'].join('');
        
        var text   = ['<div id="', this.textId, 'Contents" class="da_messageEditorBody">',
                      '<textarea id="da_messageEditorItemText" class="da_messageEditorText"></textarea>',
                      '</div>'].join('');
        
        var preview= ['<div id="', this.previewId, 'Contents" class="da_messageEditorBody da_messageEditorPreview"></div>'].join('');
        
        this._hideBodyText();
        this.headerNode.innerHTML  = header;
        this.textNode.innerHTML    = text;
        this.previewNode.innerHTML = preview;
        if (DA.vars.richText) {
              switch(DA.vars.richText.type){
                case 'crossbrowser':this.create_RTE(); break;
                case 'fckeditor': this.create_FCKeditor(); break;
          }
        }
        this._hideBodyHTML();
        this.warnNode            = YAHOO.util.Dom.get('da_messageEditorItemWarn');
        this.headerContentsNode  = YAHOO.util.Dom.get(this.headerId + 'Contents');
        this.textContentsNode    = YAHOO.util.Dom.get(this.textId + 'Contents');
        if (DA.vars.richText) {
            switch(DA.vars.richText.type){
                case 'crossbrowser':
                    this.htmlContentsNode    = YAHOO.util.Dom.get(this.htmlId + 'Contents');                                    
                    break;    
                case 'fckeditor':
                    this.htmlContentsNode    = YAHOO.util.Dom.get(this.htmlId + 'Contents___Frame');
                    break;
            }
        }
        this.previewContentsNode = YAHOO.util.Dom.get(this.previewId + 'Contents'); 
        if (DA.vars.config.font === 'on') {
            YAHOO.util.Dom.addClass(this.textContentsNode, 'da_nonProportionalFont');
            YAHOO.util.Dom.addClass(this.previewContentsNode, 'da_nonProportionalFont');
        }
    
        YAHOO.util.Dom.addClass(this.htmlContentsNode.parentNode, 'da_messageEditorBody da_messageEditorBodyBoarder');
        YAHOO.util.Dom.addClass(this.htmlContentsNode, 'da_messageEditorHTML');
        
    var nvPairParams = {
                // FIXME: To, Cc and Bcc have very similar 'value' strings. This ought to be modularized
                To: {
                    id:    'da_messageEditorItemToField',
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_TO'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner"><input type=text id="da_messageEditorItemToText" class="da_messageEditorItemText">&nbsp;</span>',
                            '<span id="da_messageEditorItemAddressCcBcc" class="da_messageEditorItemInner da_messageEditorPointer">', DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_ccbcc.gif'), '</span>',
                            '<span>&nbsp;</span>',
                            '<span id="da_messageEditorItemToAddress" class="da_messageEditorItemInner da_messageEditorPointer">', DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_address_off.gif'), '</span>',
                            '<div id="da_messageEditorItemToTextACContainer" class="da_autoCompleteContainer"></div>',
                            '<div id="da_messageEditorItemTo" class="da_messageEditorItemInner"></div>',
                            '</div>'].join('')
                },
                Cc: {
                    id:    'da_messageEditorItemCcField',
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_CC'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner"><input type=text id="da_messageEditorItemCcText" class="da_messageEditorItemText">&nbsp;&nbsp;</span>',
                            '<span id="da_messageEditorItemCcAddress" class="da_messageEditorItemInner da_messageEditorPointer">', DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_address_off.gif'), '</span>',
                            '<div id="da_messageEditorItemCcTextACContainer" class="da_autoCompleteContainer"></div>',
                            '<div id="da_messageEditorItemCc" class="da_messageEditorItemInner"></div>',
                            '</div>'].join(''),
                    border: false,
                    hidden: true
                },
                Bcc: {
                    id:    'da_messageEditorItemBccField',
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_BCC'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner"><input type=text id="da_messageEditorItemBccText" class="da_messageEditorItemText">&nbsp;&nbsp;</span>',
                            '<span id="da_messageEditorItemBccAddress" class="da_messageEditorItemInner da_messageEditorPointer">', DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_address_off.gif'), '</span>',
                            '<div id="da_messageEditorItemBccTextACContainer" class="da_autoCompleteContainer"></div>',
                            '<div id="da_messageEditorItemBcc" class="da_messageEditorItemInner"></div>',
                            '</div>'].join(''),
                    border: false,
                    hidden: true
                },
                From: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_FROM'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span id="da_messageEditorItemFromName" class="da_messageEditorItemInner"></span>',
                            '<span id="da_messageEditorItemFromAddress" class="da_messageEditorItemInner"></span>',
                            '<span id="da_messageEditorItemReplyUseOuter" class="da_messageEditorItemInner">&nbsp;',
                            '<input type=checkbox id="da_messageEditorItemReplyUse">&nbsp;', DA.locale.GetText.t_('MESSAGE_CHECKBOXMESSAGE_REPLYUSE'), '&nbsp;',
                            '</span>',
                            '</div>'].join('')
                },
                Subject: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner"><input type=text id="da_messageEditorItemSubject" class="da_messageEditorItemText">&nbsp;</span>',
                            '<span class="da_messageEditorItemInner">', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_PRIORITY'), '&nbsp;:&nbsp;',
                            '<select id="da_messageEditorItemPriority" size=1 disabled="disabled">',
                            '<option value="1">', DA.locale.GetText.t_('MESSAGE_PRIORITY_HIGH'), '</option>',
                            '<option value="3">', DA.locale.GetText.t_('MESSAGE_PRIORITY_NORMAL'), '</option>',
                            '<option value="5">', DA.locale.GetText.t_('MESSAGE_PRIORITY_LOW'), '</option>',
                            '</select>',
                            '</span>',
                            '</div>'].join('')
                },
                Attachment: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_ATTACHMENTFILE'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            (DA.vars.config.upload_file_applet === "inline" || DA.vars.config.upload_file_applet === "hidden") ? '<div id="da_messageEditorItemAttachmentDDApplet" class="da_messageEditorItemInner"></div>' : '',
                            '<span id="da_messageEditorItemAttachmentButtonsOuter" class="da_messageEditorItemInner" style="float:right;">',
                            '<input id="da_messageEditorItemAttachmentButtonsApplet" type=button value="' + DA.locale.GetText.t_('EDITOR_SHOW_APPLET_BUTTON') + '" ',(DA.vars.config.upload_file_applet === "hidden") ? '' : ' style="display:none;"',' disabled>',
                            '<input id="da_messageEditorItemAttachmentButtonsLibrary" type=button value="' + DA.locale.GetText.t_('EDITOR_LIBRARYSEL_BUTTON') + '" style="display:none;" disabled>',
                            '</span>',
                            '<span id="da_messageEditorItemAttachmentFormOuter" class="da_messageEditorItemInner"></span>',
                            '<div id="da_messageEditorItemAttachment" class="da_messageEditorItemInner"></div>',
                            '</div>'].join('')
                },
                Options: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_OPTIONS'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner">', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SIGN'), '&nbsp;:&nbsp;',
                            '<span id="da_messageEditorItemSignList"></span>&nbsp;',
                            '</span>',
                            '<span class="da_messageEditorItemInner">', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_CHARSET'), '&nbsp;:&nbsp;',
                            '<select id="da_messageEditorItemCharset" size=1 disabled="disabled">',
                            '<option value="ISO-2022-JP">', DA.locale.GetText.t_('MESSAGE_CHARSET_ISO2022JP'), '</option>',
                            '<option value="UTF-8">', DA.locale.GetText.t_('MESSAGE_CHARSET_UTF8'), '</option>',
                            '</select>&nbsp;',
                            '</span>',
                            '<span id="da_messageEditorItemContentTypeAll" class="da_messageEditorItemInner">', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_CONTENTTYPE'), '&nbsp;:&nbsp;',
                            '<select id="da_messageEditorItemContentType" size=1 disabled="disabled">',
                            '<option value="text">', DA.locale.GetText.t_('MESSAGE_CONTENTTYPE_TEXT'), '</option>',
                            '<option value="html">', DA.locale.GetText.t_('MESSAGE_CONTENTTYPE_HTML'), '</option>',
                            '</select>&nbsp;',
                            '</span>',
                            '<span class="da_messageEditorItemInner">',
                            '<input type=checkbox id="da_messageEditorItemNotification">&nbsp;', DA.locale.GetText.t_('MESSAGE_CHECKBOXMESSAGE_NOTIFICATION'), '&nbsp;',
                            '</span>',
                            '<span id="da_messageEditorItemOpenStatusOuter" class="da_messageEditorItemInner">' +
                            '<input type=checkbox id="da_messageEditorItemOpenStatus">&nbsp;',DA.locale.GetText.t_("MESSAGE_CHECKBOXMESSAGE_OPENSTATUS"), '&nbsp;',
                            '</span>',
                            '<span id="da_messageEditorItemGroupNameOuter" class="da_messageEditorItemInner">' +
                            '<br><input type=checkbox id="da_messageEditorItemGroupName">&nbsp;', DA.locale.GetText.t_('MESSAGE_CHECKBOXMESSAGE_GROUPNAME'), '&nbsp;',
                            '</span>',
                            '</div>'].join('')
                },
                Hidden: {
                    name:   'hidden',
                    value:  ['<div class="da_messageEditorItemOuter">',
                             '<span class="da_messageEditorItemInner">',
                             '<input type=hidden id="da_messageEditorItemInReplyTo" value="">',
                             '<input type=hidden id="da_messageEditorItemReferences" value="">',
                             '</span>',
                             '</div>'].join(''),
                    border: false,
                    hidden: true
                },
                Custom: {
                    id: 'da_messageEditorItemCustom',
                    row: DA.vars.custom.editor.headerOpen,
                    html: DA.vars.custom.editor.headerClose,
                    border: false,
                    hidden: (DA.vars.custom.editor.headerOpen || DA.vars.custom.editor.headerClose) ? false : true
                },
                SubjectCollapse: {
                    name: DA.imageLoader.nullTag(14, 14) + DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'),
                    value: ['<div class="da_messageEditorItemOuter">',
                            '<span class="da_messageEditorItemInner"><input type=text id="da_messageEditorItemSubjectCollapse" class="da_messageEditorItemText">&nbsp;</span>',
                            '<span class="da_messageEditorItemInner">', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_PRIORITY'), '&nbsp;:&nbsp;',
                            '<select id="da_messageEditorItemPriorityCollapse" size=1 disabled="disabled">',
                            '<option value="1">', DA.locale.GetText.t_('MESSAGE_PRIORITY_HIGH'), '</option>',
                            '<option value="3">', DA.locale.GetText.t_('MESSAGE_PRIORITY_NORMAL'), '</option>',
                            '<option value="5">', DA.locale.GetText.t_('MESSAGE_PRIORITY_LOW'), '</option>',
                            '</select>',
                            '</span>',
                            '</div>'].join('')
                }
            };

    DA.customEvent.fire("messageEditorRewriteNVPairParams", this, nvPairParams);

    this.contentsPairs=new DA.widget.NVPairSet($(this.headerId+"Contents"), nvPairParams, ['SubjectCollapse'], true);
        this.contentsPairs.hideColumn('SubjectCollapse');
        this.contentsPairs.onExpand = function () {
            DA.customEvent.fire("messageEditorNVPairOnExpandBefore", me);
            DA.dom.changeValue('da_messageEditorItemSubject', DA.dom.textValue('da_messageEditorItemSubjectCollapse'));
            YAHOO.util.Dom.get("da_messageEditorItemSubjectCollapse").value="";
            DA.dom.changeValue('da_messageEditorItemPriority', DA.dom.selectValue('da_messageEditorItemPriorityCollapse'));
            me.doResize();
        DA.customEvent.fire("messageEditorNVPairOnExpandAfter", me);
        };
        this.contentsPairs.onCollapse = function () {
        DA.customEvent.fire("messageEditorNVPairOnCollapseBefore", me);
            me.doResize();
            this._pendingResizeCollapsed=false;
            DA.dom.changeValue('da_messageEditorItemSubjectCollapse', DA.dom.textValue('da_messageEditorItemSubject'));
            YAHOO.util.Dom.get("da_messageEditorItemSubject").value="";
            DA.dom.changeValue('da_messageEditorItemPriorityCollapse', DA.dom.selectValue('da_messageEditorItemPriority'));
            var div = YAHOO.util.Dom.getElementsByClassName('da_nvPairValue da_nvPairFloatLeft')[0];
            if(div.style.width){
                div.style.width = "";
            }
        DA.customEvent.fire("messageEditorNVPairOnCollapseAfter", me);
        };
        this.previewPairs = new DA.widget.NVPairSet(
            $(this.headerId + 'Preview'), {
                To: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_TO'),
                    value: ''
                },
                Cc: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_CC'),
                    value: ''
                },
                Bcc: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_BCC'),
                    value: ''
                },
                From: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_FROM'),
                    value: ''
                },
                Subject: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'),
                    value: ''
                },
                Attachment: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_ATTACHMENTFILE'),
                    value: ''
                }
            }, [], true
        );
        this._switchPreviewMode(false);
        
        // JSON IO
        this.jsonIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_new.cgi' );
        this.tmplIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_template.cgi' );
        this.signIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_sign.cgi' );
        this.addrIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_addr.cgi' );
        this.userIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_user.cgi' );
        this.groupIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_group.cgi' );
        this._addUploadForm();
        
        // ポップアップメニュー
        this.menuData = {};
        this.popup = new DA.widget.PopupMenuNoTrigger("da_messageEditorPopupMenu", this.menuData, {
            onTrigger: function(e) {
                var srcElem = YAHOO.util.Event.getTarget(e);
                var srcClass;
                
                if (srcElem) {
                    srcClass = srcElem.className;
                    if (srcClass.match(/(^|\s)da_ugInformationListPopup(\s|$)/)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        });
        
        // 宛先共通
        this.dropAddressTo      = new YAHOO.util.DDTarget('da_messageEditorItemToText', 'editorAddress');
        this.dropAddressCc      = new YAHOO.util.DDTarget('da_messageEditorItemCcText', 'editorAddress');
        this.dropAddressBcc     = new YAHOO.util.DDTarget('da_messageEditorItemBccText', 'editorAddress');
        
        // 宛先アドレス
        this.toController = new DA.ug.InformationListController(YAHOO.util.Dom.get('da_messageEditorItemTo'), null, {
            onRemove: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me._refreshGroupName();
                me.doResize();
            },
            onPopup: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me.popup.position(YAHOO.util.Event.getPageX(e) + 1, YAHOO.util.Event.getPageY(e) + 1);
                me._showPopupMenu('to', sno);
            }
        }, {
            baseId: 'da_ugInformationList_to',
            maxView: 5
        });
        this.dragAddressTo = new DA.mailer.AddressDragDrop('da_messageEditorItemTo', 'editorAddress', {
            scroll:      false,
            resizeFrame: false
        });
        this.dragAddressTo.onMouseDown = function(e) {
            var cur  = this.getDragEl();
            var node = YAHOO.util.Event.getTarget(e);
            var i, sno, target;
            var dst = null;
            var dragFlag = false;
            var stop;
            window.dragedElClassName = "";
            stop = setTimeout(function(){
                dragFlag = true;
                if (node) {
                    if (node.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                        target = node.parentNode; 
                        if (target) {
                            if (target.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                                window.dragedElClassName = target.className;
                                sno = RegExp.$1;
                                me.selectedFld = 'to';
                                me.selectedSno = sno;
                                cur.innerHTML = me.toController.dummy(sno);
                                dst = me._controller("to");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("cc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("bcc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                            }
                            YAHOO.util.DDM.refreshCache();
                        }
                    } else {
                        window.dragedElClassName = "";
                    }
                }
            },200);
            node.onmouseup = function(e){
                if(!dragFlag){
                    clearTimeout(stop);
                    me.dragAddressTo.endDrag();
                }
            };
        };

        this.dragAddressTo.onDragEnter = function(e, id) {
            var underline = null;
            var div = null;
            var toArea = null;
            var beforeNode = null;
            if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)) {
                if ( id.indexOf("Text") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id; 
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    if ( id.indexOf("To") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemTo");
                    } else if (id.indexOf("Cc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemCc");
                    } else if ( id.indexOf("Bcc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemBcc");
                    }
                    beforeNode = toArea.childNodes[0];
                    if ( beforeNode ) {
                        toArea.insertBefore(div, toArea.childNodes[0]);
                    } else {
                        toArea.appendChild(div);
                        toArea.style.display = "block";
                    }
                } else if ( id.indexOf("da_ugInformationList") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id; 
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    document.getElementById(id).appendChild(div);
                }
            }
        };

        this.dragAddressTo.onDragDrop = function(e, id) {
            var underline = null;
            var mask = null;
            var topController = me._controller("to");
            if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)) {
                if (id) {
                    if ( id.match(/da_messageEditorItemToText/) ) {
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemToText");
                        mask.parentNode.removeChild(mask);
                        me.moveTop("to", me.selectedSno, "to", 1);
                    } else if ( id.match(/da_messageEditorItemCcText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemCcText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("to", me.selectedSno, "cc", 0, topController.get(me.selectedSno));
                    } else if ( id.match(/da_messageEditorItemBccText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("to", me.selectedSno, "bcc", 0, topController.get(me.selectedSno));
                    } else if (id.match(/da_ugInformationListToLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'to', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListCcLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'cc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListBccLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'bcc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    }
                    YAHOO.util.Dom.removeClass(id, 'da_messageEditorSilver');
                }
            }
        };

        this.dragAddressTo.onMouseUp = function(e) {
            this.getDragEl().innerHTML = '';
            me.resizeAll();
            
        };
        
        // Ｃｃアドレス
        this.ccController = new DA.ug.InformationListController(YAHOO.util.Dom.get('da_messageEditorItemCc'), null, {
            onRemove: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me._refreshGroupName();
                me.doResize();
            },
            onPopup: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me.popup.position(YAHOO.util.Event.getPageX(e) + 1, YAHOO.util.Event.getPageY(e) + 1);
                me._showPopupMenu('cc', sno);
            }
        }, {
            baseId: 'da_ugInformationList_cc',
            maxView: 5
        });
        this.dragAddressCc = new DA.mailer.AddressDragDrop('da_messageEditorItemCc', 'editorAddress', {
            scroll:      false,
            resizeFrame: false
        });
        this.dragAddressCc.onMouseDown = function(e) {
            var cur  = this.getDragEl();
            var node = YAHOO.util.Event.getTarget(e);
            var i, sno, target;
            var dst = null;
            var dragFlag = false;
            var stop;
            window.dragedElClassName = "";
            stop = setTimeout(function(){
                dragFlag = true;
                if (node) {
                    if (node.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                        target = node.parentNode; 
                        if (target) {
                            if (target.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                                window.dragedElClassName = target.className;
                                sno = RegExp.$1;
                                me.selectedFld = 'cc';
                                me.selectedSno = sno;
                                cur.innerHTML = me.ccController.dummy(sno);
                                dst = me._controller("to");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("cc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("bcc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                            }
                            YAHOO.util.DDM.refreshCache();
                        }
                    } else {
                        window.dragedElClassName = "";
                    }
                }
            },200);
            node.onmouseup = function(e){
                if(!dragFlag){
                    clearTimeout(stop);
                    me.dragAddressTo.endDrag();
                }
            };
        };

        this.dragAddressCc.onDragEnter = function(e, id) {
            var underline = null;
            var div = null;
            var toArea = null;
            var beforeNode = null;
            if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)) {
                if ( id.indexOf("Text") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id; 
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    if ( id.indexOf("To") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemTo");
                    } else if (id.indexOf("Cc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemCc");
                    } else if ( id.indexOf("Bcc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemBcc");
                    }
                    beforeNode = toArea.childNodes[0];
                    if ( beforeNode ) {
                        toArea.insertBefore(div, toArea.childNodes[0]);
                    } else {
                        toArea.appendChild(div);
                        toArea.style.display = "block";
                    }
                } else if ( id.indexOf("da_ugInformationList") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id;  
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    document.getElementById(id).appendChild(div);
                }
            }
        };

        this.dragAddressCc.onDragDrop = function(e, id) {
            var underline = null;
            var mask = null;
            var topController = me._controller("cc");
            if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)) {
                if (id) {
                   if ( id.match(/da_messageEditorItemToText/) ) {
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemToText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("cc", me.selectedSno, "to", 0, topController.get(me.selectedSno));
                    } else if ( id.match(/da_messageEditorItemCcText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemCcText");
                        mask.parentNode.removeChild(mask);
                        me.moveTop("cc", me.selectedSno, "cc", 1);
                    } else if ( id.match(/da_messageEditorItemBccText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("cc", me.selectedSno, "bcc", 0, topController.get(me.selectedSno));
                    } else if (id.match(/da_ugInformationListToLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'to', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListCcLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'cc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListBccLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'bcc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    }
                    YAHOO.util.Dom.removeClass(id, 'da_messageEditorSilver');
                }
            }
        };

        this.dragAddressCc.onMouseUp = function(e) {
            this.getDragEl().innerHTML = '';
            me.resizeAll();
        };
        
        // Ｂｃｃアドレス
        this.bccController = new DA.ug.InformationListController(YAHOO.util.Dom.get('da_messageEditorItemBcc'), null, {
            onRemove: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me._refreshGroupName();
                me.doResize();
            },
            onPopup: function(e, sno) {
                me._hideRnDialog();
                me._hideCeDialog();
                me.popup.position(YAHOO.util.Event.getPageX(e) + 1, YAHOO.util.Event.getPageY(e) + 1);
                me._showPopupMenu('bcc', sno);
            }
        }, {
            baseId: 'da_ugInformationList_bcc',
            maxView: 5
        });
        this.dragAddressBcc = new DA.mailer.AddressDragDrop('da_messageEditorItemBcc', 'editorAddress', {
            scroll:      false,
            resizeFrame: false
        });
        this.dragAddressBcc.onMouseDown = function(e) {
            var cur  = this.getDragEl();
            var node = YAHOO.util.Event.getTarget(e);
            var i, sno, target;
            var dst = null;
            var dragFlag = false;
            var stop;
            window.dragedElClassName = "";
            stop = setTimeout(function(){
                dragFlag = true;
                if (node) {
                    if (node.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                        target = node.parentNode; 
                        if (target) {
                            if (target.className.match(/da_ugInformationListDragDrop_(\d+)/)) {
                                window.dragedElClassName = target.className;
                                sno = RegExp.$1;
                                me.selectedFld = 'bcc';
                                me.selectedSno = sno;
                                cur.innerHTML = me.bccController.dummy(sno);
                                dst = me._controller("to");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("cc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                                dst = me._controller("bcc");
                                dst.scrollTo(0);
                                dst.showAllAddress();
                            }
                            YAHOO.util.DDM.refreshCache();
                        }
                    } else {
                        window.dragedElClassName = "";
                    }
                }
            },200);
            node.onmouseup = function(e){
                if(!dragFlag){
                    clearTimeout(stop);
                    me.dragAddressBcc.endDrag();
                }
            };
        };

        this.dragAddressBcc.onDragEnter = function(e, id) {
            var underline = null;
            var div = null;
            var toArea = null;
            var beforeNode = null;
            if ( window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/) ) {
                if ( id.indexOf("Text") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id; 
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    if ( id.indexOf("To") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemTo");
                    } else if (id.indexOf("Cc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemCc");
                    } else if ( id.indexOf("Bcc") > 0 ) {
                        toArea = document.getElementById("da_messageEditorItemBcc");
                    }
                    beforeNode = toArea.childNodes[0];
                    if ( beforeNode ) {
                        toArea.insertBefore(div, toArea.childNodes[0]);
                    } else {
                        toArea.appendChild(div);
                        toArea.style.display = "block";
                    }
                } else if ( id.indexOf("da_ugInformationList") >= 0) {
                    div = document.createElement("div");
                    div.className = "insertAddressAfterMark";
                    div.id = "insertAddressAfterMark" + id; 
                    underline = document.createElement("hr");
                    underline.style.height = "2px";
                    underline.style.display = "block";
                    underline.style.backgroundColor = "gray";
                    underline.style.borderColor = "gray";
                    if ( BrowserDetect.browser === "Explorer" ) {
                        underline.style.marginTop = "-9px";
                        underline.style.borderWidth = "2px";
                    } else {
                        underline.style.borderWidth = "1px";
                    }
                    div.appendChild(underline);
                    document.getElementById(id).appendChild(div);
                }
            }
        };

        this.dragAddressBcc.onDragDrop = function(e, id) {
            var underline = null;
            var mask = null;
            var topController = me._controller("bcc");
            if(window.dragedElClassName.match(/da_ugInformationListDragDrop_(\d+)/)) {
                if (id) {
                  if ( id.match(/da_messageEditorItemToText/) ) {
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemToText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("bcc", me.selectedSno, "to", 0, topController.get(me.selectedSno));
                    } else if ( id.match(/da_messageEditorItemCcText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemCcText");
                        mask.parentNode.removeChild(mask);
                        me.insertBeforeNode("bcc", me.selectedSno, "cc", 0, topController.get(me.selectedSno));
                    } else if ( id.match(/da_messageEditorItemBccText/) ){
                        mask = document.getElementById("insertAddressAfterMarkda_messageEditorItemBccText");
                        mask.parentNode.removeChild(mask);
                        me.moveTop("bcc", me.selectedSno, "bcc", 1);
                    } else if (id.match(/da_ugInformationListToLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'to', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListCcLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'cc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    } else if (id.match(/da_ugInformationListBccLineId_(\d+)/)) {
                        me.insertAfterNode(me.selectedFld, me.selectedSno, 'bcc', id);
                        underline = document.getElementById("insertAddressAfterMark" + id);
                        if ( underline ) {
                            underline.parentNode.removeChild(underline);
                        }
                    }
                    YAHOO.util.Dom.removeClass(id, 'da_messageEditorSilver');
                }
            }
        };

        this.dragAddressBcc.onMouseUp = function(e) {
            this.getDragEl().innerHTML = '';
            me.resizeAll();
        };
        
        // 添付ファイル
        this.fileController = new DA.file.InformationListController(YAHOO.util.Dom.get('da_messageEditorItemAttachment'), null, {
            onRemove: function(e, aid) {
                me.currentSizeNode.innerHTML = me.fileController.total();
                me.doResize();
            }
        }, {
            baseId: 'da_fileInformationList_attach',
            maxView: 5
        });
        
        YAHOO.util.Dom.get('da_messageEditorItemToAddress').onclick = function() {
            me.openAddress('to');
        };
        YAHOO.util.Dom.get('da_messageEditorItemCcAddress').onclick = function() {
            me.openAddress('cc');
        };
        YAHOO.util.Dom.get('da_messageEditorItemBccAddress').onclick = function() {
            me.openAddress('bcc');
        };
        YAHOO.util.Dom.get('da_messageEditorItemAddressCcBcc').onclick = function() {
            me._showAddressCcBcc();
            me.doResize();
        };
        YAHOO.util.Dom.get('da_messageEditorItemAttachmentButtonsApplet').onclick = function() {
            me.createDDApplet({ maid: me.selectedMaid });
        };
        YAHOO.util.Dom.get('da_messageEditorItemAttachmentButtonsLibrary').onclick = function() {
            DA.windowController.winOpenNoBar(DA.vars.cgiRdir + '/lib_file_select.cgi?maid=' + me.selectedMaid, 'library', 450, 480);
        };
        YAHOO.util.Dom.get('da_messageEditorItemContentType').onchange = function() {
            if (this.value === 'html') {
                me._text2html();
                me._switchContentType(YAHOO.util.Dom.get('da_messageEditorItemContentType').value);
                me._hide_spellcheck_menu();
                YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'html';
                me._focusHTML();              
            } else {
                if (DA.util.confirm(DA.locale.GetText.t_('MESSAGE_SWITCH_CONTENTTYPE_CONFIRM'))) {
                    me._html2text();
                    me._switchContentType(YAHOO.util.Dom.get('da_messageEditorItemContentType').value);
                    me._show_spellcheck_menu();
                    YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'text';
            me._focusText();
                } else {
                    DA.dom.changeSelectedIndex('da_messageEditorItemContentType', 'html');
                }
            }
        };
        /*if (BrowserDetect.browser === 'Explorer') {
            YAHOO.util.Dom.get('da_messageEditorItemToText').onkeydown  = this._disableESC;
            YAHOO.util.Dom.get('da_messageEditorItemCcText').onkeydown  = this._disableESC;
            YAHOO.util.Dom.get('da_messageEditorItemBccText').onkeydown = this._disableESC;
            YAHOO.util.Dom.get('da_messageEditorItemSubject').onkeydown = this._disableESC;
            YAHOO.util.Dom.get('da_messageEditorItemText').onkeydown    = this._disableESC;
        }*/
    
        this._addressWidth = this.addressWidth();
        this._addressHeight = this.addressHeight();

        DA.customEvent.fire('messageEditorInitAfter', this);
    },
    
    create_RTE: function(){
        initRTE(DA.vars.imgRdir + '/richText/','/js/richText/','/css/richText/', '', 'ajxmailer');
        writeRichText(this.htmlId + 'Contents', '', '100%', 300, true, false, "ja_JP", "ajxmailer", this.htmlNode);
    },

    create_FCKeditor: function(){
        var sBasePath = "/dui/richtext/";
        var me = this;
        
        window.FCKeditor_OnComplete = function(editorInstance) {
            me._FCKEditorCompleted = true;
        };
        
        this.fck = new FCKeditor(this.htmlId + 'Contents');
        this.fck.BasePath = sBasePath;
        this.fck.Config.CustomConfigurationsPath = sBasePath + DA.vars.richText.fckconfig.custom_file;
        if(DA.vars.richText.fckconfig.debug === '1'){
            this.fck.ToolbarSet = "DEBUG";
        }else{
            this.fck.ToolbarSet = "AJAX";
        }
        this.fck.Width = '100%';
        this.fck.Height = '100%';
        this.fck.Config.AutoDetectLanguage = false ;
        this.fck.Config.DefaultLanguage = DA.vars.richText.fckconfig.lang ;
    this.fck.Config.EditorAreaStyles=DA.vars.richText.fckconfig.editor_style;
    this.fck.Config.DefaultFontLabel=DA.vars.richText.fckconfig.font;
    this.fck.Config.DefaultFontSizeLabel=DA.vars.richText.fckconfig.font_size;

        var csrf;
        if (DA.vars.check_key_url) {
            csrf = DA.vars.check_key_url.replace(/^[\&]+/, "").split(/[\=]+/);
            this.fck.Config._DA_CSRF_KEY_ = csrf[0];
            this.fck.Config._DA_CSRF_VALUE_ = csrf[1];
        }

        if(DA.vars.richText.fckconfig.sm_link){
            this.fck.Config.InsSelectLink_SM = 1;
        }else{
            this.fck.Config.InsSelectLink_SM = 0;
        }
        if(DA.vars.richText.fckconfig.sh_link){
            this.fck.Config.InsSelectLink_OW = 1;
        }else{
            this.fck.Config.InsSelectLink_OW = 0;
        }
        if(DA.vars.richText.fckconfig.lib_link){
            this.fck.Config.InsSelectLink_LIB = 1;
        }else{
            this.fck.Config.InsSelectLink_LIB = 0;
        }
        this.htmlNode.innerHTML = this.fck.CreateHtml();    
    },
    
    createDDApplet: function(o) {
        var dd_applet;
        var warning = "<font color=red>" + DA.util.encode(DA.vars.appletDisabledMessage) + "</font>";
        var appletDom = YAHOO.util.Dom.get('da_messageEditorItemAttachmentDDApplet');
        var buttonDom = YAHOO.util.Dom.get('da_messageEditorItemAttachmentButtonsApplet');

        if ((DA.vars.config.upload_file_applet === 'inline' || DA.vars.config.upload_file_applet === 'hidden') && this.ddAppletAfterUpload && o.maid) {
             dd_applet = ['<applet mayscript code="at.activ8.a8dropzone.A8Dropzone" codebase="' + DA.util.encode(DA.vars.appletRdir) + '" archive="' + DA.util.encode(DA.vars.appletFile) + '" name="A8Dropzone" width="100%" height="40px">',
                          '<param name="postURL" value="' + DA.util.encode(DA.util.getServer() + DA.vars.cgiRdir + '/ajx_ma_upload.cgi?applet=1') + '">',
                          '<param name="postParam0" value="key=' + DA.util.encode(DA.util.getSessionId()) + '">',
                          '<param name="postParam1" value="proc=add">',
                          '<param name="postParam2" value="maid=' + DA.util.encode(o.maid) + '">',
                          '<param name="JavaScriptUploadCompleted" value="' + DA.util.encode(this.ddAppletUploadCompleted) + '">',
                          '<param name="JavaScriptBeforeUpload" value="' + DA.util.encode(this.ddAppletBeforeUpload) + '">',
                          '<param name="JavaScriptAfterUpload" value="' + DA.util.encode(this.ddAppletAfterUpload) + '">',
                          '<param name="label" value="' + DA.util.encode(DA.vars.appletLabel) + '">',
                          '<param name="bgImageName" value="' + DA.util.encode(DA.vars.appletImage) + '">',
                          '<param name="encoding" value="' + DA.util.encode(DA.vars.charset) + '">',
                          '<param name="maxFileNum" value="' + DA.util.encode(DA.vars.appletMaxFile) + '">',
                          '<param name="moreThanMaxMessage" value="' + DA.util.encode(DA.vars.appletMoreThanMaxMessage) + '">',
                          '<param name="JavaScriptmoreThanMax" value="' + DA.util.encode(this.ddAppletAfterMoreThanMax) + '">',
                          '<param name="openButton" value="' + DA.util.encode(DA.vars.appletFiler) + '">',
                          '<param name="directoryUpload" value="false">',warning,
                          '</applet>'].join('');
            buttonDom.style.display = "none";
        dd_applet = "<table width=100%><tr><td width=100%>" + dd_applet + "</td><td align=left valign=top><img  src=\""+DA.vars.imgRdir+"/dd_helpico.gif\" title=\""+DA.util.encode(DA.vars.appletTipMessage)+"\" border=0></td></tr></table>"; 
            appletDom.innerHTML = dd_applet;
            /* appletDom.style.borderStyle = "solid";
            appletDom.style.borderWidth = "2px";
            appletDom.style.paddingWidth = "0px";
            appletDom.style.marginWidth = "0px";
            appletDom.style.borderColor = "#84d195";
            appletDom.style.height = "40px"; */

            if (appletDom.innerHTML === "") {
                appletDom.innerHTML = warning;
            }

            this.doResize();
        }
    },
    
    values: function() {
        var values = {
            maid: this.selectedMaid,
            tid: this.selectedTid,
            sid: this.selectedSid,
            priority: (this.contentsPairs.expanded) ? DA.dom.selectValue('da_messageEditorItemPriority') : DA.dom.selectValue('da_messageEditorItemPriorityCollapse'),
            charset: DA.dom.selectValue('da_messageEditorItemCharset'),
            notification: (DA.dom.checkedOk('da_messageEditorItemNotification') ? 1 : 0),
            preview: 0,
            reply_use: (DA.dom.checkedOk('da_messageEditorItemReplyUse') ? 1 : 0),
            group_name: (DA.dom.checkedOk('da_messageEditorItemGroupName') ? 1 : 0),
            open_status: (DA.dom.checkedOk("da_messageEditorItemOpenStatus") ? 1 : 0),
            to_list: this.toController.list(),
            cc_list: this.ccController.list(),
            bcc_list: this.bccController.list(),
            to_text: DA.dom.textValue('da_messageEditorItemToText'),
            cc_text: DA.dom.textValue('da_messageEditorItemCcText'),
            bcc_text: DA.dom.textValue('da_messageEditorItemBccText'),
            from: {
                select: DA.dom.selectValue('da_messageEditorItemFromAddressSelect')
            },
            in_reply_to: DA.dom.hiddenValue('da_messageEditorItemInReplyTo'),
            references: DA.dom.hiddenValue('da_messageEditorItemReferences'),
            subject: (this.contentsPairs.expanded) ? DA.dom.textValue('da_messageEditorItemSubject'): DA.dom.selectValue('da_messageEditorItemSubjectCollapse'),
            body: {
                text: this._getText(),
                html: this._getHTML()
            },
            attach_list: this.fileController.list()
        };
        DA.customEvent.fire("messageEditorValuesAfter", this, values); 
        return values;
    },
    
    add: function(o) {
        if (o.to_list && o.to_list.length > 0) {
            this.toController.addList(o.to_list);
        }
        if (o.cc_list && o.cc_list.length > 0) {
            this._showAddressCcBcc();
            this.ccController.addList(o.cc_list);
        }
        if (o.bcc_list && o.bcc_list.length > 0) {
            this._showAddressCcBcc();
            this.bccController.addList(o.bcc_list);
        }
        if (o.to_list || o.cc_list || o.bcc_list) {
            this._refreshGroupName();
        }
        if (o.attach_list && o.attach_list.length > 0) {
            this.fileController.addList(o.attach_list);
            this.currentSizeNode.innerHTML = this.fileController.total();
        }
    },
    
    set: function(o) {
        var me = this;
        var i, fromKeys = ['email', 'keitai_mail', 'pmail1', 'pmail2'], html = '';
        
        if(o.mode)
        {
            this.mode = o.mode;
        }
        
        if (DA.util.isNull(o.to_text)) {
            DA.dom.changeValue('da_messageEditorItemToText', '');
        } else if (o.to_text) {
            DA.dom.changeValue('da_messageEditorItemToText', o.to_text);
        }
        if (DA.util.isNull(o.cc_text)) {
            DA.dom.changeValue('da_messageEditorItemCcText', '');
        } else if (o.cc_text) {
            DA.dom.changeValue('da_messageEditorItemCcText', o.cc_text);
            this._showAddressCcBcc();
        }
        if (DA.util.isNull(o.bcc_text)) {
            DA.dom.changeValue('da_messageEditorItemBccText', '');
        } else if (o.bcc_text) {
            DA.dom.changeValue('da_messageEditorItemBccText', o.bcc_text);
            this._showAddressCcBcc();
        }
        if (o.to_list) {
            if (this.toController) {
                this.toController.clear();
                this.toController.addList(o.to_list);
            }
        }
        if (o.cc_list) {
            if (o.cc_list.length > 0) {
                this._showAddressCcBcc();
            }
            if (this.ccController) {
                this.ccController.clear();
                this.ccController.addList(o.cc_list);
            }
        }
        if (o.bcc_list) {
            if (o.bcc_list.length > 0) {
                this._showAddressCcBcc();
            }
            if (this.bccController) {
                this.bccController.clear();
                this.bccController.addList(o.bcc_list);
            }
        }
        if (o.to_list || o.cc_list || o.bcc_list) {
            this._refreshGroupName();
        }
        if (o.from) {
            for (i = 0; i < fromKeys.length; i ++) {
                if (!DA.util.isEmpty(o.from[fromKeys[i]])) {
                    html += '<option value="' + fromKeys[i] + '">' + DA.util.encode(o.from[fromKeys[i]]) + '</option>';
                }
            }
            if (!DA.util.isEmpty(html)) {
                html = DA.util.encode('<') + '<select id="da_messageEditorItemFromAddressSelect" disabled="disabled">' + html + '</select>' + DA.util.encode('>');
                YAHOO.util.Dom.get('da_messageEditorItemFromAddress').innerHTML = html;
                DA.dom.changeSelectedIndex('da_messageEditorItemFromAddressSelect', o.from.select);
                me.selectedFrom=YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value;
                YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').onchange = function() {
                    if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'keitai_mail') {
                        if (!DA.util.isNull(o.from.nameM)) {
                            YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.nameM)+'&nbsp;';
            }
                        DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sign_init.sign_init_pM);
                        me.sign(o.sign_init.sign_init_pM, me.selectedSid, 'keitai_mail', me.selectedFrom);
                    } else if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'email') {
                        if(!DA.util.isNull(o.from.name)){
                            YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name)+'&nbsp;';
        }
                        DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sign_init.sign_init_p);
                        me.sign(o.sign_init.sign_init_p, me.selectedSid, 'email', me.selectedFrom);
                    } else if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'pmail1') {
                        if (!DA.util.isNull(o.from.name1)) {
                            YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name1)+'&nbsp;';
                        }
                        DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sign_init.sign_init_p1);
                        me.sign(o.sign_init.sign_init_p1, me.selectedSid, 'pmail1', me.selectedFrom);
                    } else {
                        if (!DA.util.isNull(o.from.name2)) {
                            YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name2)+'&nbsp;';
                        }
                        DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sign_init.sign_init_p2);
                        me.sign(o.sign_init.sign_init_p2, me.selectedSid, 'pmail2', me.selectedFrom);
                    }
                };
            }
            if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'keitai_mail') {
                if (!DA.util.isNull(o.from.nameM)) {
                    YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.nameM)+'&nbsp;';
                }
            } else if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'email') {
                if (!DA.util.isNull(o.from.name)) {
                    YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name)+'&nbsp;';
                }
            } else if (YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect').value === 'pmail1') {
                if (!DA.util.isNull(o.from.name1)) {
                    YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name1)+'&nbsp;';
                }
            } else {
                if (!DA.util.isNull(o.from.name2)) {
                    YAHOO.util.Dom.get('da_messageEditorItemFromName').innerHTML=DA.util.encode(o.from.name2)+'&nbsp;';
                }
            }
        }
        if (DA.util.isNull(o.subject)) {
            DA.dom.changeValue('da_messageEditorItemSubject', '');
        } else if (o.subject) {
            DA.dom.changeValue('da_messageEditorItemSubject', o.subject);
        }
        if (o.priority) {
            DA.dom.changeSelectedIndex('da_messageEditorItemPriority', o.priority);
        }
        if (o.charset) {
            DA.dom.changeSelectedIndex('da_messageEditorItemCharset', o.charset);
        }
        if (o.notification) {
            if (o.notification === 1) {
                DA.dom.changeChecked('da_messageEditorItemNotification', true);
            } else {
                DA.dom.changeChecked('da_messageEditorItemNotification', false);
            }
        }
        if(o.open_status){
            if(o.open_status===1){
                DA.dom.changeChecked("da_messageEditorItemOpenStatus",true);
            }else{
                DA.dom.changeChecked("da_messageEditorItemOpenStatus",false);
            }
        }
        if (o.group_name) {
            if (o.group_name === 1) {
                DA.dom.changeChecked('da_messageEditorItemGroupName', true);
            } else {
                DA.dom.changeChecked('da_messageEditorItemGroupName', false);
            }
        }
        if (o.reply_use) {
            if (o.reply_use === 1) {
                DA.dom.changeChecked('da_messageEditorItemReplyUse', true);
            } else {
                DA.dom.changeChecked('da_messageEditorItemReplyUse', false);
            }
        }
        if (DA.util.isNull(o.in_reply_to)) {
            DA.dom.changeValue('da_messageEditorItemInReplyTo', '');
        } else if (o.in_reply_to) {
            DA.dom.changeValue('da_messageEditorItemInReplyTo', o.in_reply_to);
        }
        if (DA.util.isNull(o.references)) {
            DA.dom.changeValue('da_messageEditorItemReferences', '');
        } else if (o.references) {
            DA.dom.changeValue('da_messageEditorItemReferences', o.references);
        }
        if (o.attach_list) {
            if (this.fileController) {
                this.fileController.clear();
                this.fileController.addList(o.attach_list);
                this.currentSizeNode.innerHTML = this.fileController.total();
            }
        }
        if (o.body) {
            if(o.content_type_all === 'text'){
                this._switchContentType('text');
                this._setText(o.body.text);
                this._setHTML('');
                YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'text';
                YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').innerHTML=DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CONTENTTYPE") + "&nbsp;:&nbsp;" + DA.locale.GetText.t_("MESSAGE_CONTENTTYPE_TEXT") + "&nbsp;&nbsp;";
            }else 
                if(o.content_type_all === 'html'){
                this._hide_spellcheck_menu();
                this._switchContentType('html');
                this._setHTML(o.body.html);
                this._setText('');
                YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'html';
                YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').innerHTML=DA.locale.GetText.t_("MESSAGE_COLUMNTITLE_CONTENTTYPE") + "&nbsp;:&nbsp;" + DA.locale.GetText.t_("MESSAGE_CONTENTTYPE_HTML") + "&nbsp;&nbsp;";
            }else{
                if (o.content_type === 'html') {
                    this._hide_spellcheck_menu();
                    this._switchContentType('html');
                    this._setHTML(o.body.html);
                    this._setText('');
                    DA.dom.changeSelectedIndex('da_messageEditorItemContentType', 'html');
                    YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'html';
                } else {
                    this._switchContentType('text');
                    this._setText(o.body.text);
                    this._setHTML('');
                    DA.dom.changeSelectedIndex('da_messageEditorItemContentType', 'text');
                    YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value = 'text';
                }
            }
        }
        if (o.title_list) {
            this.titleList = o.title_list;
        }
        if (o.lang_list) {
            this.langList = o.lang_list;
        }
        if (o.sign_list) {
            this.signList = o.sign_list;
            this.selectedSid = o.sid;
            this.selectedFrom = o.from.select;
            
            html = '';
            for (i = 0; i < this.signList.length; i ++) {
                html += '<option value="' + DA.util.encode(this.signList[i].sid) + '">' + DA.util.encode(this.signList[i].name) + '</option>';
            }
            if (!DA.util.isEmpty(html)) {
                html = '<select id="da_messageEditorItemSign" disabled="disabled">' + html + '</select>';
                YAHOO.util.Dom.get('da_messageEditorItemSignList').innerHTML = html;
                DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sid);
                YAHOO.util.Dom.get('da_messageEditorItemSign').onchange = function() {
                    me.sign(DA.dom.selectValue(YAHOO.util.Dom.get('da_messageEditorItemSign')), me.selectedSid, DA.dom.selectValue(YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect')), me.selectedFrom);
                };
            }
        } else if (!DA.util.isEmpty(o.sid)) {
            this.selectedSid = o.sid;
            this.selectedFrom = o.before_from;
            
            DA.dom.changeSelectedIndex('da_messageEditorItemSign', o.sid);
        }
    },
    
    setPreview: function(o) {
    
        var fckHeadStyle, fckBody;
        var fckHeaderMatcher = /^<\!-- Created by DA_Richtext .*? end default style -->/;
        var fckStyleMatcher = /<style>.*?<\/style>/;
        
        this._setWarn(o.warn);
        
        if (o.to_list) {
            this.previewPairs.changeValue('To', DA.ug.list2String(o.to_list, 3));
        if (o.to_list.length > DA.vars.config.mail_to_resize_num) {
                this.previewPairs.scrollSeparator('To');
                this.previewPairs.showCursor("Cc");
            } else {
                this.previewPairs.unscrollSeparator('To');
                this.previewPairs.hideCursor("Cc");
            }
        } else {
            this.previewPairs.changeValue('To', '');
        this.previewPairs.unscrollSeparator('To');
        }
        if (o.cc_list) {
            this.previewPairs.changeValue('Cc', DA.ug.list2String(o.cc_list, 3));
        if (o.cc_list.length > DA.vars.config.mail_to_resize_num) {
                this.previewPairs.scrollSeparator('Cc');
                this.previewPairs.showCursor("Bcc");
            } else {
                this.previewPairs.unscrollSeparator('Cc');
                this.previewPairs.hideCursor("Bcc");
            }
        } else {
            this.previewPairs.changeValue('Cc', '');
            this.previewPairs.unscrollSeparator('Cc');
        }
        if (o.bcc_list) {
            this.previewPairs.changeValue('Bcc', DA.ug.list2String(o.bcc_list, 3));
        if (o.bcc_list.length > DA.vars.config.mail_to_resize_num) {
                this.previewPairs.scrollSeparator('Bcc');
                this.previewPairs.showCursor("Date");
            } else {
                this.previewPairs.unscrollSeparator('Bcc');
                this.previewPairs.hideCursor("Date");
            }
        } else {
            this.previewPairs.changeValue('Bcc', '');
        this.previewPairs.unscrollSeparator('Bcc');
        }
        if (o.from_list) {
            this.previewPairs.changeValue('From', DA.ug.list2String(o.from_list, 3));
        if (o.from_list.length > 12) {
                this.previewPairs.scrollSeparator('From');
            } else {
                this.previewPairs.unscrollSeparator('From');
            }
        } else {
            this.previewPairs.changeValue('From', '');
        this.previewPairs.unscrollSeparator('From');
        }
        if (o.attach_list) {
            this.previewPairs.changeValue('Attachment', DA.file.list2String(o.attach_list, 3));
        } else {
            this.previewPairs.changeValue('Attachment', '');
        }
        
        this.previewPairs.changeValue('Subject', DA.util.encode(o.subject));
        FCKEditorIframeController.removeIframe(this.previewId + 'Contents' + "FckEditorPreViewer", this.previewContentsNode);
        if (DA.util.isEmpty(o.body.html)) {
            if (DA.util.isEmpty(o.body.text)) {
                this.previewContentsNode.innerHTML = '';
            }else if(DA.vars.config.b_wrap === 'on'){
                this.previewContentsNode.innerHTML = o.body.text;
            } else {
                this.previewContentsNode.innerHTML = '<pre style="height:100%;">' + o.body.text + '</pre>';
            }
        } else {
            if (FCKEditorIframeController.isFCKeditorData(o.body.html)) {
                fckHeadStyle = o.body.html.match(fckStyleMatcher);
                fckBody = o.body.html.replace(fckStyleMatcher, "");
                FCKEditorIframeController.createIframe(this.previewId + 'Contents' + "FckEditorPreViewer", this.previewContentsNode);
                FCKEditorIframeController.setIframeBody(this.previewId + 'Contents' + "FckEditorPreViewer", ['<head>', fckHeadStyle, '<style>body {margin:0px; padding:0px; border:0;}</style>','<script>function Pop4Ajax(Url,Width,Height,POSX,POSY){ top.Pop4Ajax(Url,Width,Height,POSX,POSY);}</script>', '</head>', '<body>','<div style="word-break:break-all">', fckBody, '</div>', '</body>'].join("\n"));
            } else{            
                this.previewContentsNode.innerHTML = o.body.html;
            }
        }
    },
    
    edit: function(query) {
        var me = this;
        var h = { proc: query.proc };
        var c_set;
        var c_win;
        var maid_input;
        var i = 0;
        
        if (me.lock()) {
            me.jsonIO.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me.selectedFid  = parseInt(query.fid, 10);
                    me.proc         = query.proc; 
                    if(me.proc === 'new') {
                         me.selectedUid  = null;
                    }else {
                         me.selectedUid  = parseInt(query.uid, 10);
                    }
                    me.selectedMaid = o.maid;
                    me.selectedTid  = (DA.util.isEmpty(o.tid)) ? '' :o.tid;
                    
                    if (DA.vars.config.upload_file_applet === 'inline') {
                        me.createDDApplet(o);
                    } else if (DA.vars.config.upload_file_applet === 'hidden') {
                        YAHOO.util.Dom.get('da_messageEditorItemAttachmentButtonsApplet').disabled = false;
                    }
                    me.set(o);
                    me.doResize();
                    me.onLoad(o); 
                    if(o.hide_save_button === 'true') {
                        window.__topPanel.panelMenu.hide('save');
                    }
                    if (DA.vars.system.auto_backup_on === 1 && DA.vars.config.backup === 'on') {
                        me.setAutoBackup();
                    }
            DA.customEvent.fire("messageEditorOnLoadDoneAfter", me, o);
                } else {
                    DA.windowController.allClose();
                    window.close();                
                }
                
                me.unlock();
                me.onEnable();
                me._enableButtons();
            };
            
            me.jsonIO.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("MESSAGE_EDIT_ERROR"));
                
                me.unlock();
            };
            
            if (DA.util.isEmpty(query.url)) {
                if (!DA.util.isEmpty(query.fid)) {
                    h.fid = query.fid;
                    h.uid = query.uid;
                }
                if(!DA.util.isEmpty(query.backup_maid)) {
                    h.backup_maid = query.backup_maid;
                    me.backup_maid = query.backup_maid;
                }
                if (!DA.util.isEmpty(query.tid)) {
                    h.tid = query.tid;
                }
                if (!DA.util.isEmpty(query.quote)) {
                    h.quote = query.quote;
                }
                me.jsonIO.execute(h);
            } else {
                h = DA.util.parseQuery(DA.util.pack(query.url));
                me.jsonIO.execute(h);
            }
        }
    },

    setAutoBackup: function() {
        this._autoBackup();
    },
   
   _autoBackup: function() {
        var me = this;
        var val, val_d, xml, xml_d, io;
        
        if (me.lock()) {
            val   = me.values();
            me.unlock();
            xml = DA.util.makeXml(val, 'ajx_ma_new.cgi');
            xml_d = xml;
            xml_d = xml_d.replace(/!-- start default style.*!-- end default style/ig, "");
            if (me.autoBackupedXML === xml_d) {
                setTimeout(function() {
                    me._autoBackup();
                }, me.autoBackupTimeout);
            } else {
                io = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_new.cgi' );
                io.callback = function(o) {
                    if (DA.mailer.util.checkResult(o)) {
                        if (!DA.util.isEmpty(o.result.error) && o.result.error !== 0 && DA.util.isEmpty(me.backup_timeout_msg_alerted)) {
                            me.backup_timeout_msg_alerted = 1;
                            DA.util.warn(o.result.message);
                        }else if(DA.util.isEmpty(o.result.error) || o.result.error === 0) {
                            me.backup_maid = o.result.backup_maid;
                        }
                        me.autoBackupedXML = xml_d;
                   
                        setTimeout(function() {
                            me._autoBackup();
                        }, me.autoBackupTimeout);
                    }else {
                         setTimeout(function() {
                            me._autoBackup();
                         }, me.autoBackupTimeout);
                    }
                };
                
                io.errorHandler = function(e) {
                    setTimeout(function() {
                        me._autoBackup();
                    }, me.autoBackupTimeout);
                };

                io.execute({ proc: 'backup', maid: me.selectedMaid, backup_maid: me.backup_maid, Preproc:me.proc, uid:me.selectedUid, xml: xml, content_type:YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value });
            }
        } else {
            setTimeout(function() {
                me._autoBackup();
            }, me.autoBackupTimeout);
        }
    },
   
    template: function(tid) {
        var me = this;
        var io;
        var type;
        
        if(null===document.getElementById('da_messageEditorItemContentType')){
            type = YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value || "text";
        }else{
            type = YAHOO.util.Dom.get('da_messageEditorItemContentType').value || "text";
        }
        
        if (me.lock()) {
            if (DA.util.confirm(DA.locale.GetText.t_('MESSAGE_TEMPLATE_CONFIRM'))) {
                io = this.tmplIO;
                
                io.callback = function(o) {
                    if (DA.mailer.util.checkResult(o)) {
                        me.selectedTid = (DA.util.isEmpty(o.tid)) ? '' :o.tid;
                        me.set(o);
                        me.selectedFrom = DA.dom.selectValue(YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect'));
                        me.doResize();
                    }
                    
                    me.unlock();
                };
                
                io.errorHandler = function(o) {
                    DA.util.warn(DA.locale.GetText.t_("MESSAGE_TEMPLATE_ERROR"));
                    
                    me.unlock();
                };
                
                io.execute({ tid: tid, from: DA.dom.selectValue(YAHOO.util.Dom.get('da_messageEditorItemFromAddressSelect')), content_type:type, content_type_all:YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value });
            } else {
                me.unlock();
            }
        }
    },
    
    sign: function(sid, before_sid, from, beFrom) {
        var me = this;
        var io, contentType, body;
        
        if (me.lock()) {
            io = this.signIO;
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me.selectedSid = o.sid;
                    me.selectedFrom = o.before_from;
                    me.set(o);
                    me.doResize();
                }
                
                me.unlock();
            };
            
            io.errorHandler = function(o) {
                DA.util.warn(DA.locale.GetText.t_("MESSAGE_SIGN_ERROR"));
                
                me.unlock();
            };
            
            contentType = DA.dom.selectValue("da_messageEditorItemContentTypeAll");
            body = (contentType === 'html') ? this._getHTML() : this._getText();
            
            io.execute({
                sid: sid,
                before_sid: before_sid,
                content_type: contentType,
                from: from,
                before_from: beFrom,
                body: body
            });
        }
    },
    
    transmit: function() {
        var me = this;
        var splchk = this.spellcheckMode;
        var id;
        var timeOut = 0;
        var msg;

        if (me.lock()) {
            if (this.previewMode ||
               !this.isEmpty(DA.dom.textValue('da_messageEditorItemSubject')) ||
               !this.isEmpty(DA.dom.textValue('da_messageEditorItemSubjectCollapse')) ||
                DA.util.confirm(DA.locale.GetText.t_('EDITOR_TITLEEMPTY_TRANSMIT_CONFIRM'))) {
                
                if (DA.tipDlg.isInit()) {
                    DA.tipDlg.hide();
                }
                me.forced_interruption=0;
                msg = DA.locale.GetText.t_("TRANSMIT_OPERATING_PROMPT")+'</span><br><span style="font-size:10px;color:red;">&nbsp;'+DA.locale.GetText.t_("FORCED_INTERRUPTION_COMMENT")+'&nbsp;';
                if(DA.vars.config.forced_interruption==='on'){
                    DA.waiting.show(msg, null, [{
                        string: DA.locale.GetText.t_("FORCED_INTERRUPTION"),
                            onclick: function() {
                            me.forced_interruption=1;
                            alert(DA.locale.GetText.t_("FORCED_INTERRUPTION_ALERT"));
                            me.onForcedInterruption();
                            me.unlock();
                            DA.waiting.hide();
                            }
                    }], "transmit");
                }else{
                    DA.waiting.show(DA.locale.GetText.t_("TRANSMIT_OPERATING_PROMPT"));
                    
                }
                
                
                id = setInterval(function() {
                    var io, val, xml;
                    timeOut+=1;
                    if (timeOut > DA.vars.system.upload_retry4ajx) {
                        clearInterval(id);
                        DA.util.warn(DA.locale.GetText.t_("MESSAGE_ATTACHMENT_UPLOAD_ERROR"));
                        me.unlock();
                        DA.waiting.hide();
                    }
                    
                    if (!DA.io.Manager.isActive() && !me.isUploading()) {
                        clearInterval(id);
                        io  = me.jsonIO;
                        val = me.values();
                        xml = DA.util.makeXml(val, 'ajx_ma_new.cgi');
                        
                        io.callback = function(o) {
                            // TODO: 根本対応
                            // IE で SELECTが表示されなくなる対応
                            if(me.forced_interruption!==1){
                            
                                DA.waiting.hide();
                            
                                setTimeout(function() {
                                    var msgstr = '';
                                    var i;
                                    var btnBack;
                                    if (DA.mailer.util.checkResult(o)) {
                                        if (o.warn && o.warn.length > 0) {
                                            if (DA.tipDlg && 'function' === typeof DA.tipDlg.init) {
                                                for (i = 0; i < o.warn.length; i ++) {
                                                    msgstr += '[ ! ] ' + o.warn[i] + '<br>';
                                                    if (o.warn[i] === DA.locale.GetText.t_('SPELLCHECK_NG')) {
                                                        btnBack = 'preview';
                                                    }
                                                }
                                                DA.tipDlg.init(DA.locale.GetText.t_('MAIL_SEND_CONFIRM'),
                                                           DA.locale.GetText.t_("READY_OK"),
                                                           msgstr, btnBack);
                                            }
                                            me.setPreview(o);
                                            me._switchPreviewMode(true);
                                            me.doResize();
                                            me.onPreview();
                                            DA.tipDlg.show();
                                        } else {
                                            if (!me.external) {
                                                try {
                                                    DA.mailer.Events.onMessageSent.fire({
                                                        uid: me.selectedUid,
                                                        fid: me.selectedFid,
                                                        mode:me.mode
                                                    }, o);
                                                } catch (e) {
                                                    DA.util.warn(DA.locale.GetText.t_("MESSAGE_TRANSMIT_ERROR2"));
                                                }
                                            }
                                            DA.windowController.allClose();
                                            me.close();
                                        }
                                    }
                                    me.unlock();
                                }, 500);
                            }
                        };
                        
                        io.errorHandler = function(o) {
                            DA.util.warn(DA.locale.GetText.t_("MESSAGE_TRANSMIT_ERROR"));
                            me.unlock();
                            DA.waiting.hide();
                        };
                        
                        io.execute({ proc: 'send', maid: me.selectedMaid, backup_maid: me.backup_maid, Preproc:me.proc, fid:me.selectedFid, uid:me.selectedUid,  mode:me.mode, xml: xml, nopreview: (me.previewMode) ? 1 : 0, spellcheck: splchk, content_type:YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value, external:this.external ? 1 : 0 });
                    }
                }, 1000);
            } else {
                me.unlock();
            }
        }
    },
    
    save: function() {
        var me = this;
        var id;
        var mailSaveFlag = 0;        
        var timeOut = 0;
 
        if (me.lock()) {
            if (this.previewMode ||
               !DA.util.isEmpty(DA.dom.textValue('da_messageEditorItemSubject')) ||
               !DA.util.isEmpty(DA.dom.textValue('da_messageEditorItemSubjectCollapse')) ||
                DA.util.confirm(DA.locale.GetText.t_('EDITOR_TITLEEMPTY_SAVE_CONFIRM'))) {
                
                if (DA.tipDlg.isInit()) {
                    DA.tipDlg.hide();
                }
                DA.waiting.show(DA.locale.GetText.t_("SAVE_OPERATING_PROMPT"));
                
                id = setInterval(function() {
                    var io, val, xml;
                    
                    timeOut+=1;
                    if (timeOut > DA.vars.system.upload_retry4ajx) {
                        clearInterval(id);
                        DA.util.warn(DA.locale.GetText.t_("MESSAGE_ATTACHMENT_UPLOAD_ERROR"));
                        me.unlock();
                        DA.waiting.hide();
                    }
                    if (!DA.io.Manager.isActive() && !me.isUploading()) {
                        clearInterval(id);
                        io  = me.jsonIO;
                        val = me.values();
                        xml = DA.util.makeXml(val, 'ajx_ma_new.cgi');
                        
                        io.callback = function(o) {
                            if (DA.mailer.util.checkResult(o)) {
                                mailSaveFlag = 1;
                                if (!me.external) {
                                    DA.mailer.Events.onMessageSaved.fire({
                                        uid: me.selectedUid,
                                        fid: me.selectedFid
                                    }, o);
                                }
                                me.unlock();
                                DA.waiting.hide();
                                if (o.save_target) {
                                    DA.util.warn(DA.locale.GetText.t_('SAVE_MAIL_MESSAGE', o.save_target));
                                    DA.windowController.allClose();
                                    me.close();
                                }
                            }
                            else{
                            me.unlock();
                            DA.waiting.hide();
                            }
                        };
                        
                        io.errorHandler = function(o) {
                            if (mailSaveFlag === 1) {
                                DA.util.warn(DA.locale.GetText.t_("MESSAGE_SAVE_ERROR2"));
                            } else {
                                DA.util.warn(DA.locale.GetText.t_("MESSAGE_SAVE_ERROR"));
                            }
                            me.unlock();
                            DA.waiting.hide();
                        };
                        
                        io.execute({ proc: 'draft', maid: me.selectedMaid, backup_maid: me.backup_maid, Preproc:me.proc, uid:me.selectedUid, fid:me.selectedFid,  xml: xml, content_type:YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value, external:this.external ? 1 : 0 });
                    }
                }, 1000);
            } else {
                me.unlock();
            }
        }
    },
    
    preview: function() {
        var me = this;
        var splchk = this.spellcheckMode;
        var id;
        
        if (me.lock()) {
            id = setInterval(function() {
                var io, val, xml;

                if (!DA.io.Manager.isActive() && !me.isUploading()) {
                    clearInterval(id);
                    io  = me.jsonIO;
                    val = me.values();
                    xml = DA.util.makeXml(val, 'ajx_ma_new.cgi');
                    
                    io.callback = function(o) {
                        if (DA.mailer.util.checkResult(o)) {
                            me.setPreview(o);
                            me._switchPreviewMode(true);
                            me.doResize();
                            me.onPreview();
                        }
                        
                        me.unlock();
                    };
                    
                    io.errorHandler = function(o) {
                        DA.util.warn(DA.locale.GetText.t_("MESSAGE_PREVIEW_ERROR"));
                        
                        me.unlock();
                    };
                    
                    io.execute({ proc: 'preview', maid: me.selectedMaid,uid:me.selectedUid, fid:me.selectedFid,  xml: xml, spellcheck: splchk, content_type:YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value });
                }
            }, 1000);
        }
    },
    print: function(printToConfig) {
        var me=this;
        var id;
        if(me.lock()){
            id=setInterval(function(){
                var io,val,xml;
                if(!DA.io.Manager.isActive()&&!me.isUploading()){
                    clearInterval(id);
                    io=me.jsonIO;
                    val=me.values();
                    xml=DA.util.makeXml(val,"ajx_ma_new.cgi");
                    io.callback=function(o){
                        DA.windowController.winOpen(DA.vars.cgiRdir+"/ma_ajx_print.cgi?maid="+me.selectedMaid+"&content_type="+YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value+ '&printtoconfig=' + printToConfig,"",710,600);
                        me.unlock();
                    };
                    io.errorHandler=function(o){
                        DA.util.warn(DA.locale.GetText.t_("MESSAGE_PRINT_ERROR"));
                        me.unlock();
                    };
                    io.execute({proc:"print",maid:me.selectedMaid,xml:xml,content_type:YAHOO.util.Dom.get("da_messageEditorItemContentTypeAll").value});
                }
            },1000);
        }
    },
    spellcheck: function(splckMode, splckType) {
        this.spellcheckMode = splckMode;        
        if (splckType === 'preview') {
            this.preview();
        } else if (splckType === 'transmit') {
            this.transmit();
        }
        
        this.spellcheckMode =  DA.vars.config.spellcheck_mode;
    },
    
    back: function() {
        if (!this.existsLock()) {
            if (DA.tipDlg.isInit()) {
                DA.tipDlg.hide();
            }
            this._switchPreviewMode(false);
            this.onBack();
            if (YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value === 'html'){
                this._hide_spellcheck_menu();
            } else {
                this._show_spellcheck_menu();
        }
        }
    },
        
    addressWidth: function(w) {
        if (w) {
            DA.session.Values.registerValue("addressWindowWidth", w);
        }
        return DA.session.Values.getValue("addressWindowWidth") || DA.vars.config.width_addr;
    },
    addressHeight: function(h) {
        if (h) {
         DA.session.Values.registerValue("addressWindowHeight", h);
        }
        return DA.session.Values.getValue("addressWindowHeight") || DA.vars.config.height_addr;
    },
    setAddressWindowSize: function(self) {
        var document = self.document;

        var getViewportWidth = function() {
            var mode = document.compatMode;
            var width = (mode ==='CSS1Compat') ?
            document.documentElement.clientWidth : // Standards
            document.body.clientWidth; // Quirks

            return width;
    };
        var getViewportHeight = function() {
            var mode = document.compatMode;
            var height = (mode ==='CSS1Compat') ?
            document.documentElement.clientHeight : // Standards
            document.body.clientHeight; // Quirks

         return height;
     };

        var width = getViewportWidth();
        var height = getViewportHeight();
        try {
            this.addressWidth(width);
            this.addressHeight(height);
        } catch(e) {
        }
    },
    close: function() {

        DA.mailer.checkSession();

        var io = new DA.io.JsonIO(DA.vars.cgiRdir + "/ajx_ma_config.cgi");
        var s = {
            editorWidth: YAHOO.util.Dom.getViewportWidth(),
            editorHeight: YAHOO.util.Dom.getViewportHeight(),
            addressWidth: this.addressWidth(),
            addressHeight: this.addressHeight()
        };

        var h = {
            proc: "editor"
        };

        if (s.editorWidth) {
            h.editor_window_width = s.editorWidth;
        }
        if (s.editorHeight) {
            h.editor_window_height = s.editorHeight;
        }
        if (s.addressWidth) {
            h.address_window_width = s.addressWidth;
        }
        if (s.addressHeight) {
            h.address_window_height = s.addressHeight;
        }

        if (s.editorWidth !== DA.mailer.windowController.editorWidth() || s.editorHeight !== DA.mailer.windowController.editorHeight() || s.addressWidth !== this._addressWidth || s.addressHeight !== this._addressHeight) {

            if (s.editorWidth) {
                DA.mailer.windowController.editorWidth(s.editorWidth);
            }
            if (s.editorHeight) {
                DA.mailer.windowController.editorHeight(s.editorHeight);
            }

            io.callback = function() {
                window.close();
            };

            io.errorHandler = function() {
                window.close();
            };
    
            io.execute(h);
        } else {
            window.close();
        }
    },
    openAddress:function(fld){
        var Target = '';
        var Proc = 'ma_address.cgi%3ffld=' + fld + ':' + this.selectedMaid +
                   '%20search_target=' + Target;
        var Img  = 'pop_title_adrbook.gif';
        
        if (DA.vars.custom.editor.setAddressProc) {
            eval(DA.vars.custom.editor.setAddressProc);
        }
        
        if (DA.util.isEmpty(this.selectedMaid)) {
            return;
        } else {
        DA.mailer.checkSession();
            DA.windowController.isePopup(Proc,Img,this.addressWidth(),this.addressHeight(),this.selectedMaid);
        }
    },
    
    setAddress: function() {
        var me = this;
        var io;
        
        if (!me.existsLock()) {
            io = this.jsonIO;
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me.add(o);
                    me.doResize();
                }
            };
            
            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("ADDRESS_SET_ERROR"));
            };
            
            io.execute({ proc: 'address', maid: this.selectedMaid });
        }
    },
    
    upload: function() {
        var me = this;
        var io, i, time, current, name;
        
        if (!me.existsLock()) {
            time = DA.util.getTime();
            current = me.currentUploadForm;
            
            for (i = 0; i < current.childNodes.length; i ++) {
                switch (current.childNodes[i].name) {
                    case 'path' :
                        name = current.childNodes[i].value;
                        break;
                    case 'maid' :
                        current.childNodes[i].value = me.selectedMaid;
                        break;
                    default:
                        break;
                }
            }
            
            if (!name.match(/^\s*$/)) {
                me._hideUploadForm(current);
                me._addUploadForm();
                me.fileController.add({
                    aid: 'dummy_' + time,
                    name: name,
                    size: 0,
                    icon: '',
                    warn: '',
                    link: '',
                    document: ''
                });
                me.uploading[time] = true;
                me.doResize();
                
                io = new DA.io.FileUploadIO( DA.vars.cgiRdir + '/ajx_ma_upload.cgi' );
                
                io.callback = function(o, args) {
                    me.fileController.remove('dummy_' + args.time);
                    me._removeUploadForm(current);
                    
                    if (DA.mailer.util.checkResult(o)) {
                        me.add(o);
                        me.doResize();
                    }
                    
                    me.uploading[args.time] = false;
                };
                
                io.errorHandler = function(e, args) {
                    DA.util.warn(DA.locale.GetText.t_("UPLOAD_ERROR"));
                    
                    me.fileController.remove('dummy_' + args.time);
                    me._removeUploadForm(current);
                    
                    me.uploading[args.time] = false;
                    
                    me.doResize();
                };
                
                io.execute(current, { time: time });
            }
        }
    },
    
    isUploading: function() {
        var time, uploading = false;
        
        for (time in this.uploading) {
            if (!DA.util.isFunction(this.uploading[time])) {
                if (this.uploading[time]) {
                    uploading = true;
                }
            }
        }
        
        return uploading;
    },
    
    _addUploadForm: function() {
        var me = this;

        var form = document.createElement('form');
        var proc = document.createElement('input');
        var maid = document.createElement('input');
        var path = document.createElement('input');
        var size = document.createElement('span');
        var icon = document.createElement('img');
        
        form.id = 'da_messageEditorItemAttachmentForm_' + DA.util.getTime();
        
        proc.type  = 'hidden';
        proc.name  = 'proc';
        proc.value = 'add';
        
        maid.type = 'hidden';
        maid.name = 'maid';
        
        path.type = 'file';
        path.name = 'path';
        path.className = 'da_messageEditorItemFile';
        path.onchange = function() {
            me.upload();
        };
        if (BrowserDetect.browser === 'Explorer') {
            path.onkeydown = function() {
                var keyCode = YAHOO.util.Event.getCharCode(event);
                if (keyCode === Event.KEY_ESC) {
                    return false;
                } else if (path.value.match(/^\s*$/) && keyCode === Event.KEY_RETURN) {
                    return false;
                }
                return true;
            };
        }
        
        if (this.fileController) {
            size.innerHTML = this.fileController.total();
        }
        
        icon.src = DA.vars.imgRdir + '/aqbtn_attach.gif';
        icon.onclick = function() {
            path.click();
        };
        
        form.appendChild(proc);
        form.appendChild(maid);
        form.appendChild(path);
        form.appendChild(size);
        form.appendChild(icon);
        
        if (BrowserDetect.browser === 'Explorer') {
            //form.style.display = 'none';
            icon.style.display = 'none';
        } else {
            icon.style.display = 'none';
        }
        
        YAHOO.util.Dom.get('da_messageEditorItemAttachmentFormOuter').appendChild(form);
        
        this.currentUploadForm = form;
        this.currentSizeNode = size;
    },
    
    disableUploadForm: function() {
        if (BrowserDetect.browser === 'Explorer') {
            this.currentUploadForm.disabled = true;
        } else {
            this.currentUploadForm.path.disabled = true;
        }
    },
    
    enableUploadForm: function() {
        if (BrowserDetect.browser === 'Explorer') {
            this.currentUploadForm.disabled = false;
        } else {
            this.currentUploadForm.path.disabled = false;
        }
    },
    
    _hideUploadForm: function() {
        this.currentUploadForm.style.display = 'none';
    },
    
    _removeUploadForm: function(node) {
        node.parentNode.removeChild(node);
    },
    
    _switchPreviewMode: function(mode) {
        if (mode) {
            this.contentsPairs.hide();
            this.previewPairs.show();
            this._hideBodyText();
            this._hideBodyHTML();
            this._showWarn();
            this._showBodyPreview();
            this.previewMode = true;
        } else {
            this.previewPairs.hide();
            this.contentsPairs.show();
            this._hideWarn();
            this._hideBodyPreview();
            if(YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value === 'html'){
                this._showBodyHTML();
                this._focusHTML();
            }else 
            if(YAHOO.util.Dom.get('da_messageEditorItemContentTypeAll').value === 'text'){
                this._showBodyText();
                this._focusText();
            }else 
            if (DA.dom.selectValue('da_messageEditorItemContentType') === 'html') {
                this._showBodyHTML();
                this._focusHTML();
            } else {
                this._showBodyText();
        this._focusText();
            }
            this.previewMode = false;
            this.doResize();
        }
    },
    
    _switchContentType: function(contentType) {
        if (contentType === 'text') {
            this._hideBodyHTML();
            this._showBodyText();
        } else {
            this._hideBodyText();
            this._showBodyHTML();
        }
    },
    
    _hideBodyText: function() {
        this.textNode.style.display = 'none';
    },
    
    _showBodyText: function() {
        this.textNode.style.display = '';
    },
    
    _hideBodyHTML: function() {
        this.htmlNode.style.display = 'none';
    },
    
    _showBodyHTML: function() {
        this.htmlNode.style.display = '';
    },
    
    _hideBodyPreview: function() {
        this.previewNode.style.display = 'none';
    },
    
    _showBodyPreview: function() {
        this.previewNode.style.display = '';
    },
    
    _getText: function() {
        return DA.dom.textAreaValue('da_messageEditorItemText');
    },
    
    _getHTML: function(opt) {
        if (!DA.vars.richText) { return; }
        if (DA.vars.richText.type === 'crossbrowser'){
                return this._getRTEHTML(opt);
        }
        else if (DA.vars.richText.type === 'fckeditor'){
                return this._getFCKHTML(opt);
        }
        else { }
    },

    _getRTEHTML: function(opt){
     try {
            if (opt) {
                if (BrowserDetect.browser === 'Explorer') {

                    return this.htmlContentsNode.contentWindow.document.body.innerText;
                } else {
            return this.htmlContentsNode.contentDocument.body.textContent.replace(/\xA0/g, ' ');
                }
            } else {
                return this.htmlContentsNode.contentWindow.document.body.innerHTML;
            }
        } catch (e) {
        }  
    },
    
    _getFCKHTML: function(opt){
        try {
            this.fckAPIs = FCKeditorAPI.GetInstance(this.fck.InstanceName);
            if (opt) {
                if (BrowserDetect.browser === 'Explorer') {
                    return this.fckAPIs.EditorDocument.body.innerText;
                } else {
            return this.fckAPIs.EditorDocument.body.textContent.replace(/\xA0/g, ' ');
                }
            } else {
                    return this.fckAPIs.GetXHTML();
            }
        } catch (e) {
        }
    },
    
    _setText: function(text) {
        DA.dom.changeValue('da_messageEditorItemText', text);
    this._focusText();
    },
   
    _focusText: function() {
    var me = this;
    setTimeout(function() {
        if (me.textNode.style.display !== "none") {
        YAHOO.util.Dom.get("da_messageEditorItemText").focus();
        }
    }, 200);
    },

    _setHTML: function(html) {
    if (!DA.vars.richText) { return; }
                switch(DA.vars.richText.type) {
                        case 'crossbrowser':   this._setRTEHTML(html); break;
                        case 'fckeditor':       this._setFCKHTML(html); break;
                }
    },
    
    _setRTEHTML: function(html){
         this.htmlContentsNode.contentWindow.document.body.innerHTML = (DA.util.isEmpty(html)) ? '' : html;
    },

    _setFCKHTML: function(html){
         var me = this;
         setTimeout(function() {
             if (me._FCKEditorCompleted === true) {
                 if (!me.fckAPIs) {
                     me.fckAPIs = FCKeditorAPI.GetInstance(me.fck.InstanceName);
                     me.fckAPIs.Events.AttachEvent('OnAfterSetHTML', function() {
                if (DA.dom.selectValue("da_messageEditorItemContentTypeAll") === "html") {
                            me._focusHTML();
                }
                     });
                 }
                 me.fckAPIs.SetHTML(DA.util.isEmpty(html) ? '' : html);
             } else {
                 me._setFCKHTML(html);
             }
         }, 100);
    },
    _focusHTML: function() {
        if (DA.vars.richText.type === 'crossbrowser') {
            this._focusRTEHTML();
        } else {
        clearTimeout(this._focusTimeout);
            this._focusFCKHTML();
        }
    },
    _focusRTEHTML: function() {
        this.htmlContentsNode.focus();
    },
    _focusFCKHTML: function() {
    var me = this;
    if (window.document.focus) {
        window.document.focus();
    } else {
        window.focus();
    }
    me.fckAPIs.Focus();
    setTimeout(function(){
    if (!me.fckAPIs.HasFocus) {
            me._focusFCKHTML();
        }
    }, 500);
    },
    _text2html: function() {
        this._setHTML(DA.util.encode(this._getText(), 2, 0, 1));
    },
    
    _html2text: function() {
        this._setText(this._getHTML(1));
    },
    
    _setWarn: function(warn) {
        var i, str = '';
        
        if (warn.length > 0) {
            for (i = 0; i < warn.length; i ++) {
                str += '[ ! ] ' + warn[i] + '<br>';
            }
            str += DA.locale.GetText.t_('READY_OK') + '<br>';
        } else {
            str = '&nbsp;';
        }
        
        this.warnNode.innerHTML = str;
    },
    
    _showWarn: function() {
        if (this.warnNode.innerHTML !== '&nbsp;') {
            this.warnNode.style.display = '';
        }
    },
    
    _hideWarn: function() {
        this.warnNode.style.display = 'none';
    },
    
    _refreshGroupName: function() {
        var to  = this._controller('to');
        var cc  = this._controller('cc');
        var bcc = this._controller('bcc');
        
        if (to.groupExists() || cc.groupExists() || bcc.groupExists()) {
            this._showGroupName();
        } else {
            this._hideGroupName();
        }

        if(to.userExists()||cc.userExists()||bcc.userExists()||to.groupExists()||cc.groupExists()||bcc.groupExists()){
            this._showOpenStatus();
        }else{
            this._hideOpenStatus();
        }
    },

    _showGroupName: function() {
        if (YAHOO.util.Dom.get('da_messageEditorItemGroupNameOuter').style.display === 'none') {
            YAHOO.util.Dom.get('da_messageEditorItemGroupNameOuter').style.display = '';
        }
    },
    
    _hideGroupName: function() {
        if (YAHOO.util.Dom.get('da_messageEditorItemGroupNameOuter').style.display === '') {
            YAHOO.util.Dom.get('da_messageEditorItemGroupNameOuter').style.display = 'none';
        }
    },

    _showOpenStatus:function(){
        if (DA.vars.system.open_status) {
            if(YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display==="none"){
                YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display="";
            }
        }
    },

    _hideOpenStatus:function(){
        if(YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display===""){
            YAHOO.util.Dom.get("da_messageEditorItemOpenStatusOuter").style.display="none";
        }
    },
    
    _showAddressCcBcc: function() {
        if (YAHOO.util.Dom.get('da_messageEditorItemAddressCcBcc').style.display === '') {
            YAHOO.util.Dom.get('da_messageEditorItemAddressCcBcc').style.display = 'none';
            this.contentsPairs.showColumn('Cc');
            this.contentsPairs.showColumn('Bcc');
        }
    },
    
    _showRnDialog: function(string, x, y) {
        var me = this;
        
        if (!this.rnDialog) {
            this.rnDialog = new DA.widget.StringChangerDialog("da_messageEditorRenameDialog", DA.locale.GetText.t_("EDITOR_DIALOG_RENAME"), "", {
                onEnter: function() {
                    var name = YAHOO.util.Dom.get(me.rnDialog.childId('text')).value;

                    var a = {name:name}; 
                    
                    DA.customEvent.fire('changeNameDialogRenameBefore',me,{a:a}); 

                    me.rename(me.selectedFld, me.selectedSno, name);
                    
                    return true;
                }
            });
        }
        
        this.rnDialog.setString(string);
        this.rnDialog.show(x, y);
    },
    
    _hideRnDialog: function() {
        if (this.rnDialog) {
            this.rnDialog.hide();
        }
    },
    
    _showCeDialog: function(string, x, y) {
        var me = this;
        
        if (!this.ceDialog) {
            this.ceDialog = new DA.widget.StringChangerDialog("da_messageEditorChangeEmailDialog", DA.locale.GetText.t_("EDITOR_DIALOG_CHANGEEMAIL"), "", {
                onEnter: function() {
                    var email = YAHOO.util.Dom.get(me.ceDialog.childId('text')).value;
                    
                    me.changeEmail(me.selectedFld, me.selectedSno, email);
                    
                    return true;
                }
            });
        }
        
        this.ceDialog.setString(string);
        this.ceDialog.show(x, y);
    },
    
    _hideCeDialog: function() {
        if (this.ceDialog) {
            this.ceDialog.hide();
        }
    },
    
    _showPopupMenu: function(fld, sno) {
        var controller = this._controller(fld);
        var me = this;
        var io;
        
        if (!this.existsLock()) {
            if (controller.isUser(sno)) {
                io = this.userIO;
            } else if (controller.isAddr(sno)) {
                io = this.addrIO;
            }
            
            if (io) {
                io.callback = function(o) {
                    if (DA.mailer.util.checkResult(o)) {
                        me._makePopupMenu(fld, sno, o);
                        me.popup.show();
                    }
                };
                
                io.errorHandler = function(e) {
                    DA.util.warn(DA.locale.GetText.t_("USERINFO_ERROR"));
                };
                
                if (controller.isUser(sno)) {
                    io.execute({
                        proc: 'email',
                        mid: controller.get(sno, 'id')
                    });
                } else {
                    io.execute({
                        proc: 'email',
                        id: controller.get(sno, 'id')
                    });
                }
            } else {
                me._makePopupMenu(fld, sno);
                me.popup.show();
            }
        }
    },
    
    _makePopupMenu: function(fld, sno, o) {
        var controller = this._controller(fld);
        var me = this;
        var i, j = 0;
        
        me.popup.menuData.order = [];
        me.popup.menuData.items = {};
        me.popup.menuData.className = 'da_messageEditorItemAddressPopupMenu';
        
        // 所属ユーザに展開
        if (controller.isGroup(sno)) {
            me.popup.menuData.order[j] = ['openGroup'];
            me.popup.menuData.items.openGroup = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_OPENGROUP'),
                args: [fld, sno],
                onclick: function(e, a) {
                    me.openGroup(a[0], a[1]);
                }
            };
        
            j ++;
        }
        
        // 役職、敬称
        if (controller.isAddr(sno) || controller.isUser(sno)) {
            me.popup.menuData.order[j] = ['titleOff'];
            me.popup.menuData.items.titleOff = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_TITLEOFF'),
                args: [fld, sno],
                onclick: function(e, a) {
                    me.titleOff(a[0], a[1]);
                }
            };
            if (DA.vars.user_information_restriction.title!=='off'||!controller.isUser(sno)) {//INSUITE ユーザの情報表示制限
                me.popup.menuData.order[j].push("titleOn");
                me.popup.menuData.items.titleOn = {
                    text: DA.locale.GetText.t_('EDITOR_POPUPMENU_TITLEON'),
                    args: [fld, sno],
                    onclick: function(e, a) {
                        me.titleOn(a[0], a[1], 0);
                    }
                };
            }
            if (DA.vars.user_information_restriction.title_name!=='off'||!controller.isUser(sno)) {//INSUITE ユーザの情報表示制限
                me.popup.menuData.order[j].push("titleNameOn");
                me.popup.menuData.items.titleNameOn = {
                    text: DA.locale.GetText.t_('EDITOR_POPUPMENU_TITLENAMEON'),
                    args: [fld, sno],
                    onclick: function(e, a) {
                        me.titleOn(a[0], a[1], 1);
                    }
                };
            }
            j ++;
        }

        // 敬称リスト
        if (controller.isAddr(sno) || controller.isUser(sno)) {
            if (me.titleList) {
                me.popup.menuData.order[j] = [];
                for (i = 0; i < me.titleList.length; i ++) {
                    me.popup.menuData.items['titleList' + i] = {
                        text: me.titleList[i].title,
                        args: [fld, sno, me.titleList[i].title, me.titleList[i].title_pos],
                        onclick: function(e, a) {
                            me.titleCustom(a[0], a[1], a[2], a[3]);
                        }
                    };
                    me.popup.menuData.order[j].push('titleList' + i);
                }
            }
            
            j ++;
        }
        
        // 名称、メールアドレス変更
        if (!controller.isGroup(sno)) {
            if (controller.isML(sno)) {
                me.popup.menuData.order[j] = ['changeName'];
            } else {
                me.popup.menuData.order[j] = ['changeName', 'changeEmail'];
            }
            me.popup.menuData.items.changeName = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_RENAME'),
                args: [fld, sno, controller.get(sno, 'name')],
                onclick: function(e, a) {
                    DA.customEvent.fire('changeNameDialogShowBefore',me,{e:e,a:a}); 
                    me.selectedFld = a[0];
                    me.selectedSno = a[1];
                    me._showRnDialog(a[2], e.clientX, e.clientY);
                    DA.customEvent.fire('changeNameDialogShowAfter',me,{e:e,a:a}); 
                }
            };
            me.popup.menuData.items.changeEmail = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_CHANGEEMAIL'),
                args: [fld, sno, controller.get(sno, 'email')],
                onclick: function(e, a) {
                    me.selectedFld = a[0];
                    me.selectedSno = a[1];
                    me._showCeDialog(a[2], e.clientX, e.clientY);
                }
            };
            
            j ++;
        }
        
        // 言語リスト
        if (controller.isAddr(sno)) {
            me.popup.menuData.order[j] = ['langList0', 'langList1'];
            me.popup.menuData.items.langList0 = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_CHANGELANG_ENGLISH'),
                args: [fld, sno, 'en'],
                onclick: function(e, a) {
                    me.changeLang(a[0], a[1], a[2]);
                }
            };
            me.popup.menuData.items.langList1 = {
                text: DA.locale.GetText.t_('EDITOR_POPUPMENU_CHANGELANG_VIEW'),
                args: [fld, sno, 'ja'],
                onclick: function(e, a) {
                    me.changeLang(a[0], a[1], a[2]);
                }
            };            
            
            j ++;
        } else if (controller.isUser(sno) || controller.isGroup(sno)) {
            if (me.langList) {
                me.popup.menuData.order[j] = [];
                for (i = 0; i < me.langList.length; i ++) {
                    me.popup.menuData.items['langList' + i] = {
                        text: DA.locale.GetText.t_('EDITOR_POPUPMENU_CHANGELANG', me.langList[i].name),
                        args: [fld, sno, me.langList[i].lang],
                        onclick: function(e, a) {
                            me.changeLang(a[0], a[1], a[2]);
                        }
                    };
                    me.popup.menuData.order[j].push('langList' + i);
                }
            }
            
            j ++;
        }
        
        // メールアドレスリスト
        var emailKeys = ['email', 'keitai_mail', 'pmail1', 'pmail2'];
        if (controller.isAddr(sno) || controller.isUser(sno)) {
            me.popup.menuData.order[j] = [];
            for (i = 0; i < emailKeys.length; i ++) {
                if (!DA.util.isEmpty(o[emailKeys[i]])&&(DA.vars.user_information_restriction[emailKeys[i]]!=='off'||!controller.isUser(sno))) {
                    me.popup.menuData.items['emailList' + i] = {
                        text: DA.locale.GetText.t_('EDITOR_POPUPMENU_CHANGEEMAILCUSTOM', o[emailKeys[i]]),
                        args: [fld, sno, o[emailKeys[i]]],
                        onclick: function(e, a) {
                            me.changeEmail(a[0], a[1], a[2]);
                        }
                    };
                    me.popup.menuData.order[j].push('emailList' + i);
                }
            }
            
            j ++;
        }
        
        // 移動
        switch(fld) {
            case 'to':
                me.popup.menuData.order[j] = ['moveCc', 'moveBcc', 'moveToTop', 'moveToBottom'];
                break;
            case 'cc':
                me.popup.menuData.order[j] = ['moveTo', 'moveBcc', 'moveCcTop', 'moveCcBottom'];
                break;
            case 'bcc':
                me.popup.menuData.order[j] = ['moveTo', 'moveCc', 'moveBccTop', 'moveBccBottom'];
                break;
            default:
                me.popup.menuData.order[j] = ['moveCc', 'moveBcc'];
                break;
        }
        me.popup.menuData.items.moveTo = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVETO'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'to');
            }
        };
        me.popup.menuData.items.moveCc = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVECC'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'cc');
            }
        };
        me.popup.menuData.items.moveBcc = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVEBCC'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'bcc');
            }
        };
        me.popup.menuData.items.moveToTop = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVETOP'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveTop(a[0], a[1], 'to', 1);
            }
        };
        me.popup.menuData.items.moveCcTop = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVETOP'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveTop(a[0], a[1], 'cc', 1);
            }
        };
        me.popup.menuData.items.moveBccTop = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVETOP'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveTop(a[0], a[1], 'bcc', 1);
            }
        };
        me.popup.menuData.items.moveToBottom = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVEBOTTOM'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'to', 1);
            }
        };
        me.popup.menuData.items.moveCcBottom = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVEBOTTOM'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'cc', 1);
            }
        };
        me.popup.menuData.items.moveBccBottom = {
            text: DA.locale.GetText.t_('EDITOR_POPUPMENU_MOVEBOTTOM'),
            args: [fld, sno],
            onclick: function(e, a) {
                me.moveField(a[0], a[1], 'bcc', 1);
            }
        };
        
        j ++;      
    },
    
    _controller: function(fld) {
        var controller;
        
        switch(fld) {
            case 'to':
                controller = this.toController;
                break;
            case 'cc':
                controller = this.ccController;
                break;
            case 'bcc':
                controller = this.bccController;
                break;
            default:
                controller = this.toController;
                break;
        }
        
        return controller;
    },
    
    openGroup:function(fld, sno) {
        var controller = this._controller(fld);
        var me = this;
        var io;
        
        if (!this.existsLock()) {
            io = this.groupIO;
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    controller.addList(o.user_list, true);
                    controller.remove(sno);
                    
                    me._refreshGroupName();
                    me.doResize();
                }
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("GROUPINFO_ERROR"));
            };
            
            io.execute({
                proc: 'extract',
                gid: controller.get(sno, 'id'),
                lang: controller.get(sno, 'lang')
            });
        }
    },
    
    titleOff: function(fld, sno) {
        var controller = this._controller(fld);
        
        if (!this.existsLock()) {
            controller.title(sno, '', 0, true);
        }
    },
    
    titleOn: function(fld, sno, type) {
        var controller = this._controller(fld);
        var io;
        
        if (!this.existsLock()) {
            if (controller.isUser(sno)) {
                io = this.userIO;
            } else {
                io = this.addrIO;
            }
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    controller.title(sno, o.title, o.title_pos, true);
                }
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("USERINFO_ERROR"));
            };
            
            if (controller.isUser(sno)) {
                io.execute({
                    proc: 'title',
                    mid: controller.get(sno, 'id'),
                    lang: controller.get(sno, 'lang'),
                    type: type
                });
            } else {
                io.execute({
                    proc: 'title',
                    id: controller.get(sno, 'id'),
                    lang: controller.get(sno, 'lang'),
                    type: type
                });
            }
        }
    },
    
    titleCustom: function(fld, sno, title, title_pos) {
        var controller = this._controller(fld);
        
        if (!this.existsLock()) {
            controller.title(sno, title, title_pos, true);
        }
    },
    
    rename: function(fld, sno, name) {
        var controller = this._controller(fld);
        
        if (!this.existsLock()) {
            controller.name(sno, name, true);
        }
    },
    
    changeEmail: function(fld, sno, email) {
        var controller = this._controller(fld);
        
        if (!this.existsLock()) {
            controller.email(sno, email);
        }
    },
    
    changeLang: function(fld, sno, lang) {
        var controller = this._controller(fld);
        var io;
        
        if (!this.existsLock()) {
            if (controller.isGroup(sno)) {
                io = this.groupIO;
            } else if (controller.isUser(sno)) {
                io = this.userIO;
            } else {
                io = this.addrIO;
            }
            
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    controller.lang(sno, lang);
                    controller.name(sno, o.name, true);
                }
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("USERINFO_ERROR"));
            };
            
            if (controller.isGroup(sno)) {
                io.execute({
                    proc: 'name',
                    gid: controller.get(sno, 'id'),
                    lang: lang
                });
            } else if (controller.isUser(sno)) {
                io.execute({
                    proc: 'name',
                    mid: controller.get(sno, 'id'),
                    lang: lang
                });
            } else {
                io.execute({
                    proc: 'name',
                    id: controller.get(sno, 'id'),
                    lang: lang
                });
            }
        }
    },
    
    moveField: function(fld, sno, targetFld, isForMoveInside) {
        var src = this._controller(fld);
        var dst = this._controller(targetFld);
        
        if (!this.existsLock()) {
            if (fld !== dst) {
                this._hideRnDialog();
                this._hideCeDialog();
                if (isForMoveInside !== 1) {
                    this._showAddressCcBcc();
                }
                
                dst.add(src.get(sno));
                src.remove(sno);                

                this.doResize();
            }
        }
    },

    insertAfterNode: function(fld, sno, targetFld, insertAfterNodeId) {
        var src = this._controller(fld);
        var dst = this._controller(targetFld);
        if (!this.existsLock()) {
            this._hideRnDialog();
            this._hideCeDialog();
            if (fld !== targetFld) {
                this._showAddressCcBcc();
            }
            if ( fld === targetFld && sno !== insertAfterNodeId.split("_")[2] ) {
                dst.insertAfterNode(src.get(sno), sno, insertAfterNodeId, "true");
            } else if( fld !== targetFld ){
                dst.insertAfterNode(src.get(sno), sno, insertAfterNodeId, "false");
                src.remove(sno);
            }
            this.doResize();
        }
    },

    resizeAll: function() {
        var dst = null;
        dst = this._controller("to");
        dst.resize();
        dst = this._controller("cc");
        dst.resize();
        dst = this._controller("bcc");
        dst.resize();
    },

    moveTop: function(fld, sno, targetFld, isForMoveInside) {
        var src = this._controller(fld);
        var dst = this._controller(targetFld);
        
        if (!this.existsLock()) {
            if (fld !== dst) {
                this._hideRnDialog();
                this._hideCeDialog();
                if (isForMoveInside !== 1) {
                    this._showAddressCcBcc();
                }
                
                dst.insertToTop(src.get(sno),sno);            

                this.doResize();
            }
        }
    },

    insertBeforeNode: function(fld, sno, targetFld, isForMoveInside, srcNode) {
        var src = this._controller(fld);
        var dst = this._controller(targetFld);
        
        if (!this.existsLock()) {
            if (fld !== dst) {
                this._hideRnDialog();
                this._hideCeDialog();
                if (isForMoveInside !== 1) {
                    this._showAddressCcBcc();
                }
                
                dst.insertToTop(srcNode,0);            
                src.remove(sno);
                this.doResize();
            }
        }
    },
    
    showRichTextSelectForm: function() {
        var me = this;
        
        ["formatblock", "fontname", "fontsize"].each(function(target) {
            try {
                YAHOO.util.Dom.get(target + '_' + me.htmlContentsNode.id).style.visibility = '';
            } catch(e) {
            }
        });
    },
    
    hideRichTextSelectForm: function() {
        var me = this;
        
        ["formatblock", "fontname", "fontsize"].each(function(target) {
            try {
                YAHOO.util.Dom.get(target + '_' + me.htmlContentsNode.id).style.visibility = 'hidden';
            } catch(e) {
            }
        });
    },
    
    showTextArea: function() {
        var me = this;
        
        try {
            me.textNode.style.visibility = '';
            me.htmlNode.style.visibility = '';
        } catch(e) {
        }
    },
    
    hideTextArea: function() {
        var me = this;
        
        try {
            me.textNode.style.visibility = 'hidden';
            me.htmlNode.style.visibility = 'hidden';
        } catch(e) {
        }
    },
    
    lock: function() {
        if (DA.util.lock('messageEditor')) {
            return true;
        } else {
            return false;
        }
    },
    
    unlock: function() {
        return DA.util.unlock('messageEditor');
    },
    
    existsLock: function() {
        return DA.util.existsLock('messageEditor');
    },
    
    isEmpty: function(str) {
        if (DA.util.isEmpty(str)) {
            return true;
        } else {
            if (str.match(/^(\s|\xe3\x80\x80)+$/)) {
                return true;
            } else {
                return false;
            }
        }
    },
    
    _hide_spellcheck_menu: function () {
        if(YAHOO.util.Dom.get('panel_menuMenuItem_transmit_b')){
            YAHOO.util.Dom.get('panel_menuMenuItem_transmit_b').style.display = 'none';
        }
        if(YAHOO.util.Dom.get('panel_menuMenuItem_preview_b')){
            YAHOO.util.Dom.get('panel_menuMenuItem_preview_b').style.display = 'none';
        }
        if(YAHOO.util.Dom.get('panel_menuMenuItem_spellcheck')){
            YAHOO.util.Dom.get('panel_menuMenuItem_spellcheck').style.display = 'none';
        }
    },
    
    _show_spellcheck_menu: function () {
        if(YAHOO.util.Dom.get('panel_menuMenuItem_transmit_b')){
            YAHOO.util.Dom.get('panel_menuMenuItem_transmit_b').style.display = '';
        }
        if(YAHOO.util.Dom.get('panel_menuMenuItem_preview_b')){
            YAHOO.util.Dom.get('panel_menuMenuItem_preview_b').style.display = '';
        }
        if(YAHOO.util.Dom.get('panel_menuMenuItem_spellcheck') && DA.vars.system.spellcheck_button_visible && DA.vars.config.spellcheck){
            YAHOO.util.Dom.get('panel_menuMenuItem_spellcheck').style.display = '';
        }
    },
   
    _disableESC: function() {
        if (YAHOO.util.Event.getCharCode(event) === Event.KEY_ESC) {
            return false;
        }
        return true;
    },
    
    _enableButtons: function() {
        var addr_html = DA.imageLoader.tag(DA.vars.imgRdir + '/aqbtn_address.gif');

        $('da_messageEditorItemToAddress').innerHTML = $('da_messageEditorItemCcAddress').innerHTML =
        $('da_messageEditorItemBccAddress').innerHTML = addr_html;
        $('da_messageEditorItemAttachmentButtonsLibrary').disabled = false;
    }
};

/**
 * Drag and Drop method.
 */    
DA.mailer.AddressDragDrop = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
        if (!this.DDFrameCreated) {
            this.DDFrameCreated = true;
            this.initFrame();
        }
    }
};

YAHOO.extend(DA.mailer.AddressDragDrop, YAHOO.util.DDProxy, {
    createFrame: function() {
        var self = this;
        var body = document.body;
        
        var div = this.getDragEl();
        var s;
        
        if (!div) {
            div = DA.dom.createDiv(this.dragElId);
            div.style.visibility = "hidden";
            div.style.cursor = "pointer";
            body.insertBefore(div, body.firstChild);
            
            YAHOO.util.Dom.addClass(div, 'da_messageEditorAddressDummy');
        }
    },
    
    onDragOut: function(e, id) {
        var underline = null;
        if ( id.indexOf("Text") >= 0) {
            underline = document.getElementById("insertAddressAfterMark" + id);
            if (underline) {
                underline.parentNode.removeChild(underline);
            }
        } else if ( id.indexOf("da_ugInformationList") >= 0) {
            underline = document.getElementById("insertAddressAfterMark" + id);
            if (underline) {
                underline.parentNode.removeChild(underline);
            }
        }
    },
    
    startDrag: function(x, y) {
        this.startX = x;
        this.startY = y;
        this.deltaX = 0;
        this.deltaY = 0;
    },
        
    endDrag: function(e) { }
    
});



/* $Id: dialog.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/dialog/dialog.js $ */
/*for JSLINT undef checks*/
/*extern DA YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

if (!DA || !DA.mailer || !DA.util || !DA.locale || !DA.widget) {
    throw "ERROR: missing DA.js or mailer.js or message.js or dialog.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util || !YAHOO.widget) {
    throw "ERROR: missing yahoo.js or container.js"; // TODO: formalize/cleanup
}

/**
 * Builds a Mail Import Dialog with a YUI container widget.
 * @constructor
 * @param {HTMLElement}	node the element representing the Dialog
 * @class MailImportDialog
 * @namespace DA.mailer.widget
 */

DA.mailer.widget.MailImportDialog = function(nodeId, title, cbhash) {
    this.nodeId = nodeId;

    this.setHead(title);
    this.setBody();
    this.setCbhash(cbhash);
    this.setDialog();
    this.setListener();
};

Object.extend(DA.mailer.widget.MailImportDialog.prototype, DA.widget.Dialog.prototype);
DA.mailer.widget.MailImportDialog.prototype.setHead = function(title) {
    this.head = DA.util.encode(title);
};
DA.mailer.widget.MailImportDialog.prototype.setBody = function(fid) {
    this.body = '<form id="' + this.childId('form') + '">' +
                '<input type=hidden id="' + this.childId('proc') + '" class="' + this.childClass('proc') + '" name="proc" value="import">' +
                '<input type=hidden id="' + this.childId('fid') + '" class="' + this.childClass('fid') + '" name="fid" value="">' +
                this.archiveTypeRadio() + '<br>' +
                '<input type=file id="' + this.childId('file') + '" class="' + this.childClass('file') + '" name="path" value="">' +
                '<input type=button id="' + this.childId('set') + '" class="' + this.childClass('set') + '" value="' + DA.locale.GetText.t_("DIALOG_SETTING_BUTTON") + '">' +
                '<input type=reset id="' + this.childId('clear') + '" class="' + this.childClass('clear') + '" value="clear" style="display:none;">' +
                '</form>';
    this.focusId = this.childId('file');
};
DA.mailer.widget.MailImportDialog.prototype.setListener = function() {
    YAHOO.util.Event.addListener(this.childId('set'), "click", this._enter, this, true);
};
DA.mailer.widget.MailImportDialog.prototype.archiveType = {
    zip  : 'ZIP',
    tar  : 'TGZ',
    lha  : 'LZH',
    eml  : 'eml',
    mbox : 'mbox'
};
DA.mailer.widget.MailImportDialog.prototype.archiveTypeRadio = function() {
    var types = DA.vars.config.archive_list.split('|');
    var radio = '';
    var i, checked;
    
    for (i = 0; i < types.length; i ++) {
        if (types[i] === DA.vars.config.archive) {
            checked = ' checked';
        } else {
            checked = '';
        }
        radio += '<input type=radio id="' + this.childId('archive_type') + '" class="' + this.childClass('archive_type') + '" name="archive_type" value="' + types[i] +  '"' + checked + '>' + this.archiveType[types[i]] + '&nbsp;';
    }

    return radio;
};
DA.mailer.widget.MailImportDialog.prototype.clear = function() {
    YAHOO.util.Dom.get(this.childId('clear')).click();
};
/* $Id: folder-tree.js 2383 2014-04-15 04:42:52Z jl_zhou $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/folder/folder-tree.js $ */
/*for JSLINT undef checks*/
/*extern $ $H DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
/*jslint evil: true */
if (!DA || !DA.mailer || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util || !YAHOO.widget) {
    throw "ERROR: missing yahoo.js or treeview.js"; // TODO: formalize/cleanup
}


/**
 * Drag and Drop method.
 */
DA.mailer.FolderDragDrop = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
        if (!this.DDFrameCreated) {
            this.DDFrameCreated = true;
            this.initFrame();
        }
    }
};

YAHOO.extend(DA.mailer.FolderDragDrop, YAHOO.util.DDProxy, {

    createFrame: function() {
            var self = this;
            var body = document.body;

            var div = this.getDragEl();
            var s;

            if (!div) {
                div = DA.dom.createDiv(this.dragElId);
                div.style.visibility = "hidden";

                body.insertBefore(div, body.firstChild);

                YAHOO.util.Dom.addClass(div, 'labelDummy');
            }
    },

    onDragEnter: function(e, id) { },

    onDragOut: function(e, id) { },

    onDragDrop: function(e, id) { },

    startDrag: function(x, y) {
        this.startX = x;
        this.startY = y;
        this.deltaX = 0;
        this.deltaY = 0;
    },

    endDrag: function(e) { },

    onMouseDown: function(e) { },

    onMouseUp: function(e) { }

});

/**
 * Builds a IMAP folder-tree and renders it with a YUI TreeView widget.
 *
 * Usage:
 *   var ftc = new DA.mailer.FolderTreeController();
 *
 * @class FolderTreeController
 * @uses
 * @constructor
 * @param treeNode HTMLElement DOM node in which to draw the tree.
 *        quotaStoNode HTMLElement DOM node for storage QUOTA.
 *        quotaMesNode HTMLElement DOM node for message QUOTA.
 *        cbhash Call back method in hash.
 */
DA.mailer.FolderTreeController = function(topNode, treeNode, quotaStoNode, quotaMesNode, selectedNode, cbhash) {

    this.jsonIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_dir.cgi' );
    this.listIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_list.cgi' );
    this.moveIO   = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
    this.filterIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_filter.cgi' );
    this.mainteIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_mainte.cgi' );
    this.fileIO   = new DA.io.FileUploadIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );

    this.jsonIO.extend({
        callback: function (o) {
            if (DA.mailer.util.checkResult(o)) {
                this._drawTree(o);
                this._viewQuota(o);
                this._setDrag(o);
                this._setDrop(o);
                this._setupSubscribers();
                DA.mailer.Events.onFolderTreeReady.fire(this);
            } else {
                DA.util.warn(DA.locale.GetText.t_("FOLDER_TREE_ERROR"));
            }
        }.bind(this),
        errorHandler: function (e) {
            DA.util.warn(DA.locale.GetText.t_("JSON_ERROR"));
        }.bind(this)
    });

    this.topNode      = topNode;
    this.treeNode     = treeNode;
    this.selectedNode = selectedNode;
    this.quota        = new DA.mailer.QuotaController(quotaStoNode, quotaMesNode);
    this.popup        = new DA.mailer.FolderTreePopupMenu(this);
    // FIXME: Use Prototype.js Object.extend to do the following:
    if (DA.util.isFunction(cbhash.onUpdating)) {
        this.onUpdating = cbhash.onUpdating;
    }
    if (DA.util.isFunction(cbhash.onUpdateDone)) {
        this.onUpdateDone = cbhash.onUpdateDone;
    }
    if (DA.util.isFunction(cbhash.onSelect)) {
        this.onSelect = cbhash.onSelect;
    }
    if (DA.util.isFunction(cbhash.onDelete)) {
        this.onDelete = cbhash.onDelete;
    }
    if (DA.util.isFunction(cbhash.onTrash)) {
        this.onTrash = cbhash.onTrash;
    }

    this.init();
};

/**
 * Members
 */
DA.mailer.FolderTreeController.prototype = {

    topNode: null,

    /**
     * The HTML DOM element in which the TreeView will be drawn.
     * @property treeNode
     * @type: HTMLElement
     */
    treeNode: null,

    /**
     * Selected folder name.
     */
    selectedNode: null,

    /**
     * Import Form.
     */
    importNode: null,

    /**
     * Popup menu Element.
     */
    popupNode: null,

    /**
     * QuotaController object.
     */
    quota: null,

    /**
     * Popup Menu.
     */
    popup: null,

    drag: null,

    /**
     * The object containing the folder tree structure and meta-data.
     * @property folderData
     * @type Object
     *
     */
    folderData: null, /* JSON */

    /**
     * YUI TreeView objecy
     * @property treeView
     * @type Object YAHOO.widget.TreeView
     */
    treeView: null, /* YUI TreeView object */

    /**
     * JSON IO utility
     * @property jsonIO
     * @type Object DA.io.JsonIO
     */
    jsonIO: null,

    listIO: null,

    moveIO: null,

    filterIO: null,

    mainteIO: null,

    fileIO: null,

    /**
     * Init.
     * @method init
     */
    init: function() {
        this.treeNode.innerHTML = DA.locale.GetText.t_('DEFAULT_FOLDER_TREE');
        this.jsonIO.execute();
    },


    /**
     * Sets up subscribing handler-functions to all (possibly) relevant
     * CustomEvents (usually under DA.mailer.Events.*)
     * @method _setupSubscribers
     * @private
     */
    _setupSubscribers: function () {
        var E = DA.mailer.Events;
        if (!E) {
            return;
        }
        var me = this;
        // The 's' prefix leads to 'onMessages' (plural)
        [ 'sMoved', 'sFiltered', 'sFlagged', 'Read' ].each(function(name) {
            name = 'onMessage' + name;
            var ce = E[name]; // ce => CustomEvent
            var hndlr = me[name]; // hndlr => handler function
            if (!ce || !YAHOO.lang.isFunction(hndlr)) {
                return;
            }
            ce.subscribe(function(type, args){
                return hndlr.apply(me, args);
            });
        });

    },


    /**
     * Tree Data.
     */
    treeData: {},
    ygtvData: {},

    /**
     * Selected Fid.
     */
    selectedFid: null,

    /**
     * Drag and Drop targeted Fid.
     */
    targetedFid: null,

    /**
     * Drag and Drop source Fid.
     */
    sourceFid: null,

    /**
     * Next Fid.
     */
    nextFid: null,

    /**
     * Root Fid.
     */
    rootFid: null,

    /**
     * IMAP Server Fid.
     */
    serverFid: null,

    /**
     * INBOX Fid.
     */
    inboxFid: null,

    /**
     * Draft Fid.
     */
    draftFid: null,

    /**
     * Sent Fid.
     */
    sentFid: null,

    /**
     * Trash Fid.
     */
    trashFid: null,

    /**
     * SPAM Fid.
     */
    spamFid: null,

    /**
     * Local Server Fid.
     */
    localServerFid: null,

    /**
     * Local Folder Fid.
     */
    localFolderFid: null,

    /**
     * Backup Folder Fid.
     */
    backupFolderFid: null,

    /**
     * Update Function.
     * @property onUpdating
     * @type {function}
     */
    onUpdating: Prototype.emptyFunction,

    /**
     * Update done Function.
     */
    onUpdateDone: Prototype.emptyFunction,

    /**
     * Select Function.
     */
    onSelect: Prototype.emptyFunction,

    /**
     * Delete Function.
     */
    onDelete: Prototype.emptyFunction,

    /**
     * Trash Function.
     */
    onTrash: Prototype.emptyFunction,

    /**
     * @property onMessagesMoved
     * @type {Function} handler for (YUI) CustomEvent DA.mailer.Events.onMessagesMoved
     * @param sJobId {String}
     * @param oRequest {Object} with keys: messages, target
     * @param oResponse {Object} server response (post-move/delete of the server) from ajx_ma_move
     */
    onMessagesMoved: function(sJobId, oRequest, oResponse) {
        this._viewQuota(oResponse);
        if (!oRequest || !oRequest.messages || !oResponse) {
            return;
        }
        // FIXME: Assumption/reliance on messages.fid; implying same-source
        var srcFid = oRequest.messages.fid;
        var destFid = oRequest.target.fid;
        this._setCounts(oResponse, srcFid);
        if (DA.util.cmpNumber(srcFid, this.selectedFid) ||
            DA.util.cmpNumber(destFid, this.selectedFid)) {
            this.selectedNode.innerHTML = this._labeler(this.selectedFid).selected();
        }
    },

    onMessagesFiltered: function(arg1) {
        this._viewQuota(arg1.response);
        this._setCounts(arg1.response, arg1.srcFid);
        this._selectUI(arg1.srcFid);
    },

    /**
     * @property onMessagesFlagged
     * @type {Function} handler for (YUI) CustomEvent DA.mailer.Events.onMessagesFlagged
     * @param sJobId {String}
     * @param oRequest {Object} with keys: messages, property, state
     * @param oResponse {Object} server response (post-move/delete of the server) from ajx_ma_flag
     */
    onMessagesFlagged: function (sJobId, oRequest, oResponse) {
        // Right now, only bother about seen/unseen
        if (!oRequest || !oRequest.messages || !oResponse) { // trouble
            return;
        }
        var fid = oRequest.messages.fid;
        if (oRequest.property === 'seen') {
            this._setCounts(oResponse, fid);
            if (DA.util.cmpNumber(fid, this.selectedFid)) {
                this.selectedNode.innerHTML = this._labeler(fid).selected();
            }
        }
    },

    /**
     * CustomEvent handler for DA.mailer.Events.onMessageRead
     * @property onMessageRead
     * @type {Function} YUI CustomEvent subscriber
     * @param oMMData {Object} mail meta-data (uid, fid etc)
     */
    onMessageRead: function (oMMData) {
        if (oMMData && oMMData.fid) {
            this._incSeen(oMMData.fid);
        }
        if (DA.util.cmpNumber(oMMData.fid, this.selectedFid)) {
            this.selectedNode.innerHTML = this._labeler(this.selectedFid).selected();
        }

    },

    onMessagesDragEnter: function(arg1) {
        this._open(arg1.fid);
    },

    inboxName: function() {
        return this._name(this.inboxFid);
    },

    draftName: function() {
        return this._name(this.draftFid);
    },

    sentName: function() {
        return this._name(this.sentFid);
    },

    trashName: function() {
        return this._name(this.trashFid);
    },

    spamName: function() {
        return this._name(this.spamFid);
    },

    /*
     * Set Drag Object.
     */
    _setDrag: function(o) {
        var me = this;

        // Drag
        this.drag = new DA.mailer.FolderDragDrop(this.treeNode, "da_folderTree", {
            scroll:      false,
            resizeFrame: false
        });
        this.drag.onMouseDown = function(e) {
            var cur  = this.getDragEl();
            var node = YAHOO.util.Event.getTarget(e);
            var fid;

            if (node) {
                fid = me._targetId2fid(node.id);

                if (fid && !me.existsLock()) {

                    if (me._dragOk(fid)) {
                        me.sourceFid = fid;

                        cur.innerHTML = me.treeData[fid].labeler.dummy();
                    }
                }
            }
        };
	    /**
	     * See YUI sources, dragdrop.js
	     * @method clickValidator
	     * @param e {Object} DOM event (mousedown event, probably)
	     * @returns {Boolean} if TRUE, continue the drag; if FALSE, the drag will be aborted.
	     */
	    this.drag.clickValidator= function(e) {
			if (DA.mailer.util.getOperationFlag() !== '' && DA.mailer.util.getOperationFlag().indexOf(OrgMailer.vars.org_mail_gid.toString()) < 0){
				return false;
			} else{
				return true;
			}
	    };
        this.drag.onMouseUp = function(e) {
            var cur  = this.getDragEl();

            if (me.sourceFid) {
                me.sourceFid =null;

                cur.innerHTML = "";
            }
        };
        this.drag.onDragOver = function(e) {
        };
        this.drag.onDragEnter = function(e, id) {
            var fid;

            if (id) {

                fid = me._targetId2fid(id);

                if (fid && !me.existsLock() && me.sourceFid) {
                    if (me._dropFOk(fid) && fid !== me.sourceFid) {
                        me._addClass($(me._fid2divId(fid)).parentNode, "labelTargeted");
                    }
                }
            } else {
            }
        };
        this.drag.onDragOut = function(e, id) {
            var fid;

            if (id) {

                fid = me._targetId2fid(id);

                if (fid && !me.existsLock() && me.sourceFid) {
                    if (me._dropFOk(fid) && fid !== me.sourceFid) {
                        me._removeClass($(me._fid2divId(fid)).parentNode, "labelTargeted");
                    }
                }
            } else {
            }
        };
        this.drag.onDragDrop = function(e, id) {
            var fid;

            if (id) {

                fid = me._targetId2fid(id);

                if (fid && !me.existsLock() && me.sourceFid) {
                    if (me._dropFOk(fid) && fid !== me.sourceFid) {
                        me._removeClass($(me._fid2divId(fid)).parentNode, "labelTargeted");
                        me._move(me.sourceFid, fid);
                    }
                }
            }
        };
    },

    /*
     * Set Drop Object.
     */
    _setDrop: function(o) {
        var me = this;
        // Simpler way to iterate all the treeDatas and create their DropTarget references
        $H(this.treeData).each( function(f) {
            var fid = f.key;
            var obj = f.value;
            if (me._dropFOk(fid) || me._dropMOk(fid)) {
                // save a reference as drop - this was intended earlier, but seemed wrong
                obj.drop = new YAHOO.util.DDTarget(me._fid2divId(fid), "da_folderTree");
            }
        });
    },

    /*
     * View Quota.
     */
    _viewQuota: function(o) {
        var me = this;

        this.quota.set(o);
        this.quota.view();

    },

    /**
     * Draw the tree from the (json) object.
     * @method init
     * @private
     * @param Object corresponding to ajx_ma_dir.cgi
     */
    _drawTree: function(o) {
        var topFid;
        var folders = o.folder_list || [];
        var me = this; var fo;
        var firstFolders  = [];
        var foldersLength = folders.length;

        for (var i = 0; i < foldersLength; i ++) {
            fo = folders[i]; me.treeData[fo.fid] = {};
            for (var key in fo) {
                me.treeData[fo.fid][key] = fo[key];
            }
            me.treeData[fo.fid].last_update = 0;
            me.treeData[fo.fid].children = [];
            me.treeData[fo.fid].labeler = new DA.mailer.FolderLabeler(this.topNode, this.treeNode, me._data(fo.fid));

            if (fo.parent === 0) {
                topFid = fo.fid;
            } else {
                me.treeData[fo.parent].children.push(me._data(fo.fid));
                if (me._parent(fo.fid) === topFid) {
                    firstFolders.push(fo.fid);
                }
            }

            // 特殊フォルダの判定
            switch(fo.type) {
                case DA.vars.folderType.root:
                    this.rootFid = fo.fid;
                    break;
                case DA.vars.folderType.server:
                    this.serverFid = fo.fid;
                    break;
                case DA.vars.folderType.inbox:
                    this.inboxFid = fo.fid;
                    break;
                case DA.vars.folderType.draft:
                    this.draftFid = fo.fid;
                    break;
                case DA.vars.folderType.sent:
                    this.sentFid = fo.fid;
                    break;
                case DA.vars.folderType.trash:
                    this.trashFid = fo.fid;
                    break;
                case DA.vars.folderType.spam:
                    this.spamFid = fo.fid;
                    break;
                case DA.vars.folderType.localServer:
                    this.localServerFid = fo.fid;
                    break;
                case DA.vars.folderType.localFolder:
                    this.localFolderFid = fo.fid;
                    break;
                case DA.vars.folderType.backupFolder:
                    this.backupFolderFid = fo.fid;
                    break;    
                default:
                    break;
            }
        }

        me.treeView = new YAHOO.widget.TreeView( me.treeNode );
        me.nextFid  = o.next_fid;

        this.topNode.innerHTML = me.treeData[topFid].labeler.root();

        var root = me.treeView.getRoot();
        var firstFoldersLength = firstFolders.length;
        var fid, to;
        for (var j = 0; j < firstFoldersLength; j ++) {
            fid = firstFolders[j];
            me._populate(me.treeData[fid], root);
            me.treeView.subscribe("labelClick", function(node) {
                clearTimeout(to);
                to = setTimeout(function() {
                    DA.widget.PopupMenuManager.allCancel();
                    me._select(node.data.id);
                }, 100);
                return false;
            });
        }

        me.treeView.draw();
        me._open(me.serverFid);
        me._open(me.inboxFid);  
        if (DA.vars.system.auto_backup_on === 1 && DA.vars.config.backup_exists === 1 && DA.vars.config.backup_msg_show ===1) {
            me._open(me.localServerFid);
            me._select(me.backupFolderFid);
            $("mboxGrid_search_keyword").disabled = true;
            $("mboxGrid_search_button").disabled  = true;
            DA.util.warn(DA.locale.GetText.t_("EXISTS_BACKUP_FILES"));
        } else {
            me._select(me.inboxFid);
        }

    },

    /**
     * Draw a singe node, and recursively draw it's children (if any)
     * TODO: cleanup the doc-comments
     * @method _populate
     * @private
     * @param _f node info (Object)
     * @param parentNode YAHOO.widget.*Node
     */
    _populate: function (f, parentNode) {
        var me     = this;
        if (f.hidden === 1) { return; }
        
        var node   = new YAHOO.widget.TextNode(f.labeler.label(true), parentNode);
        var length = f.children.length;

        me.treeData[f.fid].node = node;
        me.ygtvData[node.getElId()] = f.fid;

        for (var i = 0; i < length; i ++) {
            me._populate(f.children[i], node);
        }
    },

    /**
     * FIXME: comments
     * @method _open
     * @private
     */
    _open: function(fid) {
        var node = this._node(fid);
        if (!node.expanded && !node.childrenRendered) {
            // We need to clear the YUI DragDrop DOM reference cache
            // if the node is collapsed AND or it's children are due
            // for a rendering
            this._clearYUIDragDropMgrDomRefCache(); // Faiz: Sorry for the long names...
        }
        node.expand();
    },

    /**
     * Clear all cached DOM references that may be held in the 'da_folderTree'
     * DD group.
     * Faiz: Sorry for the long names...
     * @method _clearYUIDragDropMgrDomRefCache
     * @private
     */
    _clearYUIDragDropMgrDomRefCache: function() {
        // Get a hash of all DD objects associated with folderTree
        var hash = YAHOO.util.DDM.ids.da_folderTree || {};
        $H(hash).values().each(function(oDD){  // For each DD object, delete the reference
            oDD._domRef = null;                // to the cached (lazy-loaded) DOM reference
        });
        // TODO: location cache?
    },

    _close: function(fid) {
        var node = this._node(fid);

        node.collapse();
    },

    _parentsOpen: function(fid, top) {
        var parent = this._parent(fid);

        if (parent !== 0 && parent !== top) {
            this._parentsOpen(parent, top);
        }

        this._showChildren(parent);
    },

    _refresh: function(fid) {
        var node = this._node(fid);
        this._clearYUIDragDropMgrDomRefCache(); // unconditionally clear the YUI DDM cache
        node.refresh();
    },

    _select: function(fid) {
        var me = this;
        var node, labeler, h, io;

        if (me._selectOk(fid) && me.lock()) {
            node = this._node(fid);

            if (me.selectedFid && me._exists(me.selectedFid)) {
                me._labeler(me.selectedFid).removeClass("labelSelected");
                me._clearRecent(me.selectedFid);
            }
            me._labeler(fid).addClass("labelSelected");

            me.selectedFid = fid;

            if (me._updateOk(fid)) {
                DA.waiting.show('', DA.vars.imgRdir + '/popy_wait_mail.gif');
                me.onUpdating(fid);

                io = this.listIO;

                io.callback = function(o) {
                    me.onUpdateDone(fid);

                    if (DA.mailer.util.checkResult(o)) {
                        me.treeData[fid].last_update = DA.time.GetTime();

                        me._viewQuota(o);
                        me._setCounts(o, fid);
                        me._selectUI(fid);
                    }
                    if(DA.vars.new_mail){
                    	eval(DA.vars.new_mail);
                    }
                    if (DA.vars.custom.threePane.updateFolder) {
                        eval(DA.vars.custom.threePane.updateFolder);
                    }

                    me.unlock();
                    DA.waiting.hide();
					if (o.result.error === 1001) {
						DA.util.warn(o.result.message);
						me._rebuild(fid);
					} else if (o.result.error === 1002) {
						if (DA.util.confirm(o.result.message)) {
							me._rebuild(fid);
						}
					}
                };

                io.errorHandler = function(e) {
          		    DA.util.warn(DA.locale.GetText.t_("FOLDER_SELECT_ERROR"));

                    me.onUpdateDone(fid);
                    me.unlock();
                    DA.waiting.hide();
                };

                io.execute({ proc : "update", fid : fid, ignoreQuota:"yes" });

            } else {
                me._selectUI(fid);

                me.unlock();
            }
        }

    },

    _selectUI: function(fid) {
        var me = this;

        if (me._selectOk(fid)) {
                me.selectedNode.innerHTML = me._labeler(fid).selected();
                me.onSelect(fid, me._type(fid));
        }

    },

    _create: function(fid, name, type) {
        var me = this;
        var h, io;

        if (me._createOk(fid) && me.lock()) {
            io = this.jsonIO;

            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._createUI(fid, name, type);

                    if (DA.util.isEmpty(o.next_fid)) {
                        DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
                    } else {
                        me.nextFid = o.next_fid;
                    }
                }

                me.unlock();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("FOLDER_CREATE_ERROR"));

                me.unlock();
            };

            io.execute({ proc : "create", fid : fid, name : name, type : type });

        }

    },

    _createUI: function(fid, name, type) {
        var me = this;
        var c, node, next_fid, trash_m, messages_e, unseen_e, recent_e;

        if (me._createOk(fid)) {
            this.popup.cfDialog.hide();

            c        = {};
            node     = me._node(fid);
            next_fid = me.nextFid;

            if (DA.vars.config['delete'] === 1) {
                trash_m = 1;
            } else {
                trash_m = 0;
            }

            if (DA.vars.config.count === "all" || DA.vars.config.count === "half") {
                messages_e = 1;
            } else {
                messages_e = 0;
            }

            if (DA.vars.config.count === "all") {
                unseen_e = 1;
            } else {
                unseen_e = 0;
            }

            if (DA.vars.config.recent === "on") {
                recent_e = 1;
            } else {
                recent_e = 0;
            }

            if (type === DA.vars.folderType.cabinet) {
                c = {
                    fid         : next_fid,
                    parent      : fid,
                    uidvalidity : 0,
                    type        : 18,
                    name        : name,
                    icon        : DA.vars.imgRdir + '/ico_fc_cabinet.gif',
                    alt         : '',
                    select      : 0,
                    update      : 0,
                    create      : 1,
                    rename      : 1,
                    'delete'    : 1,
                    move        : 1,
                    'import'    : 0,
                    'export'    : 0,
                    filter      : 0,
                    rebuild     : 0,
                    move_f      : 1,
                    move_m      : 0,
                    open_m      : 0,
                    trash_m     : trash_m,
                    messages    : 0,
                    unseen      : 0,
                    recent      : 0,
                    messages_e  : messages_e,
                    unseen_e    : unseen_e,
                    recent_e    : recent_e,
                    last_update : 0,
                    children    : [],
                    drop        : new YAHOO.util.DDTarget(this._fid2divId(next_fid), "da_folderTree")
                };
            } else if (type === DA.vars.folderType.mailbox) {
                c = {
                    fid         : next_fid,
                    parent      : fid,
                    uidvalidity : 0,
                    type        : 17,
                    name        : name,
                    icon        : DA.vars.imgRdir + '/ico_14_folder_c.gif',
                    alt         : '',
                    select      : 1,
                    update      : 1,
                    create      : 0,
                    rename      : 1,
                    'delete'    : 1,
                    move        : 1,
                    'import'    : 1,
                    'export'    : 1,
                    filter      : 1,
                    rebuild     : 1,
                    move_f      : 0,
                    move_m      : 1,
                    open_m      : 1,
                    trash_m     : trash_m,
                    messages    : 0,
                    unseen      : 0,
                    recent      : 0,
                    messages_e  : messages_e,
                    unseen_e    : unseen_e,
                    recent_e    : recent_e,
                    last_update : 0,
                    children    : [],
                    drop        : null
                };
            } else {
                c = {
                    fid         : next_fid,
                    parent      : fid,
                    uidvalidity : 0,
                    type        : 16,
                    name        : name,
                    icon        : DA.vars.imgRdir + '/ico_14_folder_c.gif',
                    alt         : '',
                    select      : 1,
                    update      : 1,
                    create      : 1,
                    rename      : 1,
                    'delete'    : 1,
                    move        : 1,
                    'import'    : 1,
                    'export'    : 1,
                    filter      : 1,
                    rebuild     : 1,
                    move_f      : 1,
                    move_m      : 1,
                    open_m      : 1,
                    trash_m     : trash_m,
                    messages    : 0,
                    unseen      : 0,
                    recent      : 0,
                    messages_e  : messages_e,
                    unseen_e    : unseen_e,
                    recent_e    : recent_e,
                    last_update : 0,
                    children    : [],
                    drop        : new YAHOO.util.DDTarget(this._fid2divId(next_fid), "da_folderTree")
                };
            }

            me.treeData[next_fid] = c;
            me.treeData[next_fid].labeler = new DA.mailer.FolderLabeler(me.topNode, me.treeNode, me._data(next_fid));
            me.treeData[fid].children.push(me.treeData[next_fid]);

            me._populate(me.treeData[next_fid], node);
            me._refresh(me._parent(next_fid));

            me._showChildren(fid);
            me._hideChildren(me.inboxFid);
        }

    },

    _rename: function(fid, name) {
        var me = this;
        var h, io;

        if (me._renameOk(fid) && me.lock()) {
            io = this.jsonIO;

            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._renameUI(fid, name);

                    if (DA.util.isEmpty(o.next_fid)) {
                        DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
                    } else {
                        me.nextFid = o.next_fid;
                    }
                }

                me.unlock();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("FOLDER_RENAME_ERROR"));

                me.unlock();
            };

            io.execute({ proc : "rename", fid : fid, name : name });

        }

    },

    _renameUI: function(fid, name) {
        var me = this;
        var c, labeler;

        if (me._renameOk(fid)) {
             this.popup.rfDialog.hide();

             c = me._data(fid);
             labeler = me._labeler(fid);

             c.name = name;

             labeler.refresh();
        }

    },

    _move: function(src, dst) {
        var me = this;
        var h, io;

        if (me._dragOk(src) && me._dropFOk(dst) && me.lock()) {
            io = this.jsonIO;

            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._moveUI(src, dst);

                    if (DA.util.isEmpty(o.next_fid)) {
                        DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
                    } else {
                        me.nextFid = o.next_fid;
                    }
                }

                me.unlock();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("FOLDER_MOVE_ERROR"));

                me.unlock();
            };

            io.execute({ proc : "move", fid : src, target_fid : dst });

        }

    },

    _moveUI: function(src, dst) {
        var me = this;
        var cp, cs, cd, i, dp;

        if (me._dragOk(src) && me._dropFOk(dst)) {
            dp = me._parent(src);
            cp = me._data(dp);
            cs = me._data(src);
            cd = me._data(dst);

            cs.parent = dst;
            for (i = 0; i < cp.children.length; i ++) {
                if (cp.children[i].fid === src) {
                    cd.children.push(cs);
                    cp.children.splice(i, 1);
                    break;
                }
            }

            me.treeView.removeNode(me._node(src), true);
            me._populate(cs, me._node(dst));

            me.treeView.draw();
            // calling draw will affect DragDrop references because TreeView uses
            // innerHTML. We need to clear the cached DOM references that any DragDrop
            // DDTarget (drop target instances) might be holding.
            this._clearYUIDragDropMgrDomRefCache();

            me._hideChildren(dp);
            me._showChildren(dst);
            me._hideChildren(me.inboxFid);

            if (me.selectedFid) {
                me._parentsOpen(me.selectedFid, dst);
                me._labeler(me.selectedFid).addClass("labelSelected");
            }
        }

    },

    _delete: function(fid) {
        var me = this;
        var h, io;

        if (me._deleteOk(fid) && me.lock()) {
            io = this.jsonIO;

            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._deleteUI(fid);
                    if (me.selectedFid === fid) {
                         me.selectedFid = null;
                    }
                    if (DA.util.isEmpty(o.next_fid)) {
                        DA.util.warn(DA.locale.GetText.t_("FOLDER_NEXT_FID_ERROR"));
                    } else {
                        me.nextFid = o.next_fid;
                    }
                }

                me.unlock();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("FOLDER_DELETE_ERROR"));

                me.unlock();
            };

            io.execute({ proc : "delete", fid : fid });

        }

    },

    _deleteUI: function(fid) {

        if (!this._deleteOk(fid)) {
            return;
        }

        var node = this._node(fid);
        var parent = this._parent(fid);
        var parentNode = this._node(parent);
        var parentData = this._data(parent);

        var i;
        for (i = 0; i < parentData.children.length; i++) {
            if (parentData.children[i].fid === fid) {
                // FIXME: comments
                // This is hard to understand.
                parentData.children.splice(i, 1);
                break;
            }
        }

        this.treeView.removeNode(node);

        this.treeView.draw();
        // calling draw will affect DragDrop references because TreeView uses
        // innerHTML. We need to clear the cached DOM references that any DragDrop
        // DDTarget (drop target instances) might be holding.
        this._clearYUIDragDropMgrDomRefCache();

        this._hideChildren(parent);
        this._hideChildren(this.inboxFid);

        delete this.treeData[fid];

        this.onDelete(fid);

    },

    _filter: function(fid) {
        var me = this;
        var h, io;
        if (me._filterOk(fid) && me.lock()) {
            io = this.filterIO;

            DA.waiting.show(DA.locale.GetText.t_("FILTER_OPERATING_PROMPT"));
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._setCounts(o, fid);
                    me._filterUI(fid);
                    if (me.selectedFid === fid) {
                        me._selectUI(fid);
                    }
                }

                me.unlock();
                DA.waiting.hide();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("FILTER_ERROR"));

                me.unlock();
                DA.waiting.hide();
            };

            io.execute({ proc : "submit", fid : fid, uid : "all" });

        }
    },

    _filterUI: function(fid) {
        var me = this;

        if (me._filterOk(fid)) {
        }

    },

    _rebuild: function(fid) {
        var me = this;
        var h, io;
        if (me._rebuildOk(fid) && me.lock()) {
            io = this.mainteIO;

            DA.waiting.show(DA.locale.GetText.t_("REBUILD_OPERATING_PROMPT"));
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._setCounts(o, fid);
                    me._rebuildUI(fid);
                    if (me.selectedFid === fid) {
                        me._selectUI(fid);
                    }
                }

                me.unlock();
                DA.waiting.hide();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("REBUILD_ERROR"));

                me.unlock();
                DA.waiting.hide();
            };

            io.execute({ proc : "rebuild", fid : fid });

        }
    },

    _rebuildUI: function(fid) {
        var me = this;

        if (me._rebuildOk(fid)) {
        }

    },

    _export: function(fid) {
        var me = this;
        var h, io;

        if (me._exportOk(fid) && me.lock()) {
            io = this.moveIO;

            DA.waiting.show(DA.locale.GetText.t_("EXPORT_OPERATING_PROMPT"));
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    if (!DA.util.isEmpty(o.file)) {
                        me._viewQuota(o);
                        me._exportUI(fid, o.file, o.file_name);
                    } else {
                        DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
                    }
                }

                me.unlock();
                DA.waiting.hide();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("EXPORT_ERROR"));

                me.unlock();
                DA.waiting.hide();
            };

            io.execute({ proc : "export", fid : fid, uid : "all", archive : "1" });

        }

    },

    _exportUI: function(fid, file, file_name) {
        var me = this;
        var url,Proc;

        if (me._exportOk(fid)) {
            if(DA.util.isNull(file_name)){
                Proc = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=archive%26file=' + file;
            }else{
                Proc = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=archive%26file=' + file + '%26file_name=' + file_name;
            }
            url = DA.vars.cgiRdir + '/down_pop4ajax.cgi?proc='+Proc;
            DA.windowController.winOpenNoBar(url, '', 400, 450);
        }

    },

    _import: function(fid) {
        var me = this;
        var io;

        if (me._importOk(fid) && me.lock()) {
            YAHOO.util.Dom.get(this.importNode).fid.value = fid;

            io = this.fileIO;

            DA.waiting.show(DA.locale.GetText.t_("IMPORT_OPERATING_PROMPT"));
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._setCounts(o, fid);
                    me._importUI(fid);
                    if (me.selectedFid === fid) {
                        me._selectUI(fid);
                    }
                }

                me.unlock();
                DA.waiting.hide();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("IMPORT_ERROR"));

                me.unlock();
                DA.waiting.hide();
            };

            io.execute(this.importNode);

        } else {
            return false;
        }

    },

    _importUI: function(fid) {
        var me = this;

        if (me._importOk(fid)) {
            this.popup.ifDialog.hide();
        }

    },

    _trash: function(fid) {
        var me = this;
        var h, io;

        if (me._trashOk(fid) && me.lock()) {
            io = this.moveIO;

            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    me._viewQuota(o);
                    me._trashUI(fid);
                    if (me.selectedFid === fid) {
                        me._selectUI(fid);
                    }

                    // this.onTrash(fid);
                }

                me.unlock();
            };

            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("TRASH_ERROR"));

                me.unlock();
            };

            io.execute({ proc : "delete", fid : fid, uid : "all" });

        }

    },

    _trashUI: function(fid) {
        var me = this;

        if (me._trashOk(fid)) {
            me._clearCount(fid);
        }

    },

    _openOk: function(fid) {
        var me = this;

        if (me.treeData[fid].children.length > 0 && !me._opened(fid)) {
            return true;
        } else {
            return false;
        }
    },

    _closeOk: function(fid) {
        var me = this;

        if (me.treeData[fid].children.length > 0 && me._opened(fid)) {
            return true;
        } else {
            return false;
        }
    },

    _selectOk: function(fid) {
        var me = this;

        if (me.treeData[fid].select === 1) {
            return true;
        } else {
            return false;
        }

    },

    _updateOk: function(fid) {
        var me = this;
        var labeler;

        if (me.treeData[fid].update === 1) {
            labeler = me._labeler(fid);
            if (labeler.recent() > 0 ||
                DA.vars.config.update_time === 0 ||
                DA.time.DiffTime(me.treeData[fid].last_update, DA.time.GetTime()) > DA.vars.config.update_time * 1000) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    },

    _createOk: function(fid) {
        var me = this;

        if (me.treeData[fid].create === 1) {
            return true;
        } else {
            return false;
        }

    },

    _renameOk: function(fid) {
        var me = this;

        if (me.treeData[fid].rename === 1) {
            return true;
        } else {
            return false;
        }

    },

    _dragOk: function(fid) {
        var me = this;

        if (me.treeData[fid].move === 1) {
            return true;
        } else {
            return false;
        }

    },

    _dropFOk: function(fid) {
        var me = this;

        if (me.treeData[fid].move_f === 1) {
            return true;
        } else {
            return false;
        }

    },

    _dropMOk: function(fid) {
        var me = this;

        if (me.treeData[fid].move_m === 1) {
            return true;
        } else {
            return false;
        }

    },

    _deleteOk: function(fid) {
        var me = this;

        if (me.treeData[fid]['delete'] === 1) {
            return true;
        } else {
            return false;
        }

    },

    _filterOk: function(fid) {
        var me = this;

        if (me.treeData[fid].filter === 1) {
            return true;
        } else {
            return false;
        }

    },

    _rebuildOk: function(fid) {
        var me = this;

        if (me.treeData[fid].rebuild === 1) {
            return true;
        } else {
            return false;
        }

    },

    _exportOk: function(fid) {
        var me = this;

        if (me.treeData[fid]['export'] === 1) {
            return true;
        } else {
            return false;
        }

    },

    _importOk: function(fid) {
        var me = this;

        if (me.treeData[fid]['import'] === 1) {
            return true;
        } else {
            return false;
        }

    },

    _trashOk: function(fid) {
        var me = this;

        if (me.treeData[fid].trash === 1) {
            return true;
        } else {
            return false;
        }

    },

    _opened: function(fid) {
        var me    = this;
        var node  = me._node(fid);
        var style = node.getStyle();

        if (style.match(/(?:^|\s)ygtv[lt]m[h]?(?:\s|$)/)) {
            return true;
        } else {
            return false;
        }
    },

    _hasChildren: function(fid) {
        var me   = this;
        var data = me._data(fid);

        if (data.children.length > 0) {
            return true;
        } else {
            return false;
        }
    },

    _showChildren: function(fid) {
        var node;
        if (fid !== 0) {
            node = this._node(fid);
            if (node && node.hasChildren()) {
                this._open(fid);
            }
        }
    },

    _hideChildren: function(fid) {
        var node;
        if (fid !== 0) {
            node = this._node(fid);
            if (node && !node.hasChildren()) {
                this._close(fid);
            }
        }
    },

    _exists: function(fid) {
        if (this.treeData[fid]) {
            return true;
        } else {
            return false;
        }
    },

    _data: function(fid) {
        return this.treeData[fid];
    },

    _node: function(fid) {
        return this.treeData[fid].node;
    },

    _labeler: function(fid) {
        return this.treeData[fid].labeler;
    },

    _parent: function(fid) {
        return this.treeData[fid].parent;
    },

    _name: function(fid) {
        return this.treeData[fid].name;
    },

    _type: function(fid) {
        return this.treeData[fid].type;
    },

    _incSeen: function(fid) {
        var labeler = this._labeler(fid);

        labeler.data.unseen = (labeler.data.unseen - 1 < 0) ? 0 : labeler.data.unseen - 1;

        labeler.refresh();
    },

    _setCounts: function(o, fid) {
        var counts = o.count_list;
        var total  = o.total;
        var i;

        if (counts) {
            for (i = 0; i < counts.length; i ++) {
                this._setCount(counts[i].fid, counts[i].messages, counts[i].unseen, counts[i].recent);
            }
        }
        if (total) {
            this._setCount(fid, total.messages, total.unseen, total.recent);
        }
    },

    _setCount: function(fid, messages, unseen, recent) {
        var labeler = this._labeler(fid);

        if (!DA.util.isEmpty(messages)) {
            labeler.messages(messages);
        }

        if (!DA.util.isEmpty(unseen)) {
            labeler.unseen(unseen);
        }

        if (!DA.util.isEmpty(recent)) {
            labeler.recent(recent);
        }

        labeler.refresh();
    },

    _clearCount: function(fid) {

        this._setCount(fid, 0, 0, 0);

    },

    _clearRecent: function(fid) {

        this._setCount(fid, null, null, 0);

    },

    _fid2divId: function(fid) {
        var divId =  'da_folderTreeDivId_' + fid;

        return divId;
    },

    _divId2fid: function(divId) {
        var array = divId.split("_");

        return parseInt(array[2], 10);
    },

    _targetId2fid: function(id) {
        var fid;

        if (id.match(/^da\_folderTreeDivId\_(\d+)$/)) {
            fid = RegExp.$1;
        } else if (id.match(/^ygtv\d+$/)) {
            fid = this.ygtvData[id];
        }

        return parseInt(fid, 10);
    },

    lock: function() {
        if (DA.util.lock('folderTree')) {
            return true;
        } else {
            return false;
        }
    },

    unlock: function() {
        return DA.util.unlock('folderTree');
    },

    existsLock: function() {
        return DA.util.existsLock('folderTree');
    },

    _addClass: function(divId, cname) {
        var el = YAHOO.util.Dom.get(divId);
        YAHOO.util.Dom.addClass(el, cname);
    },

    _removeClass: function(divId, cname) {
        var el = YAHOO.util.Dom.get(divId);
        YAHOO.util.Dom.removeClass(el, cname);
    }

};



/**
 * Folder Labeler.
 *
 * Usage:
 *   var fl = new DA.mailer.FolderLabeler();
 *
 * @class FolderLabeler
 * @uses
 * @constructor
 * @param data folder object.
 */
DA.mailer.FolderLabeler = function(topNode, treeNode, data) {
    this.topNode  = topNode;
    this.treeNode = treeNode;
    this.data = data;
};

/**
 * Members
 */
DA.mailer.FolderLabeler.prototype = {

    topNode: null,

    treeNode: null,

    data: null,

    fid: function() {
        return this.data.fid;
    },

    divId: function() {
        return 'da_folderTreeDivId_' + this.data.fid;
    },

    node: function() {
        return this.data.node;
    },

    messagesEnable: function() {
        if (this.data.messages_e === 1) {
            return true;
        } else {
            return false;
        }
    },

    unseenEnable: function() {
        if (this.data.unseen_e === 1) {
            return true;
        } else {
            return false;
        }
    },

    recentEnable: function() {
        if (this.data.recent_e === 1) {
            return true;
        } else {
            return false;
        }
    },

    messages: function(n) {
        if (!DA.util.isEmpty(n)) {
            this.data.messages = n;
        }

        return this.data.messages;
    },

    unseen: function(n) {
        if (!DA.util.isEmpty(n)) {
            this.data.unseen = n;
        }

        return this.data.unseen;
    },

    recent: function(n) {
        if (!DA.util.isEmpty(n)) {
            this.data.recent = n;
        }

        return this.data.recent;
    },

    name: function() {
        return this.data.name;
    },

    icon: function() {
        return this.data.icon;
    },

    alt: function() {
        return this.data.alt;
    },

    type: function() {
        return this.data.type;
    },

    select: function() {
        return this.data.select;
    },

    _image: function() {
        var image = DA.imageLoader.tag(this.icon(), this.alt());

        return image;
    },

    _name: function() {
        var n = this.name();
        var name = DA.util.encode(n);

        return name;
    },

    _count: function() {
        var count = '';
        var messages = this.messages();
        var unseen   = this.unseen();
        var recent   = this.recent();

        if (this.messagesEnable()) {
            if (this.unseenEnable()) {
                count = '[' + DA.util.encode(unseen) + '/' + DA.util.encode(messages) + ']';
            } else {
                count = '[' + DA.util.encode(messages) + ']';
            }
        } else {
            if (this.unseenEnable()) {
                count = '[' + DA.util.encode(unseen) + ']';
            } else {
                count = '';
            }
        }
        if (this.recentEnable()) {
            if (recent !== 0) {
                count += '&nbsp;';
                count += '(' + DA.util.encode(recent) + ')';
            }
        }

        return count;
    },

    _countOnly: function() {
        var count = '';
        var messages = this.messages();
        var unseen   = this.unseen();

        if (DA.mailer.util.isLocalFolder(this.type()) || DA.mailer.util.isBackupFolder(this.type())) {
            count = '';
        } else if (DA.mailer.util.isSent(this.type()) || DA.mailer.util.isDraft(this.type())) {
            count = DA.locale.GetText.t_('MESSAGES_NOUNSEEN_UNIT', DA.util.encode(messages));
        } else {
            count = DA.locale.GetText.t_('MESSAGES_UNSEEN_UNIT', DA.util.encode(messages), DA.util.encode(unseen));
        }

        return count;
    },

    _class: function(only) {
        var cname = 'ygtvlabel';

        if (this._isRecent()) {
            cname += " labelRecent";
        }
        if (this._isSelected()) {
            cname += " labelSelected";
        }
        if (this._isTargeted()) {
            cname += " labelTargeted";
        }
        if (this.select() === 0) {
            cname += " labelNoPointer";
        }

        var classes = ' class="' + cname + '"';

        return (only) ? cname : classes;
    },

    _isRecent: function() {
        if (this.recentEnable() && this.recent() > 0) {
            return true;
        } else {
            return false;
        }
    },

    _isSelected: function() {
        // var el = YAHOO.util.Dom.get(this.divId());
        var selected;

        // if (YAHOO.util.Dom.hasClass(el, "labelSelected")) {
        if (this.hasClass('labelSelected')) {
            selected = true;
        } else {
            selected = false;
        }

        return selected;
    },

    _isTargeted: function() {
        // var el = YAHOO.util.Dom.get(this.divId());
        var targeted;

        // if (YAHOO.util.Dom.hasClass(el, "labelTargeted")) {
        if (this.hasClass('labelTargeted')) {
            targeted = true;
        } else {
            targeted = false;
        }

        return targeted;
    },

    root: function() {
        var space = '&nbsp;';
        var mouse = ' onmouseover="YAHOO.util.Dom.addClass(this.parentNode, \'labelHover\');" onmouseout="YAHOO.util.Dom.removeClass(this.parentNode, \'labelHover\');"';
        var label = '<div id="' + this.divId() + '" class="ygtvlabel labelRoot"' + mouse + '" onclick="DA.mailer.util.treeOpenAll(\'' + this.treeNode.id + '\');">' +
                    this._image() + space +
                    this._name() + space +
                    this._count() + '</div>';

        return label;
    },

    label: function(object) {
        var space = '&nbsp;';
        var mouse = (this.data.select === 1) ? ' onmouseover="YAHOO.util.Dom.addClass(this.parentNode, \'labelHover\');" onmouseout="YAHOO.util.Dom.removeClass(this.parentNode, \'labelHover\');"' : '';
        var label;
        if (object) {
            label = {
                id: this.fid(),
                label: '<div id="' + this.divId() + '"' + mouse + '>' +
                       this._image() + space +
                       this._name() + space +
                       this._count() +
                       '</div>',
                style: this._class(true)
            };
        } else {
            label = '<div id="' + this.divId() + '"' + this._class() + mouse + '>' +
                    this._image() + space +
                    this._name() + space +
                    this._count() +
                    '</div>';
        }

        return label;
    },

    dummy: function() {
        var space = '&nbsp;';
        var dummy = this._image() + space +
                    this._name() + space +
                    this._count();

        return dummy;
    },

    selected: function() {
        var space = '&nbsp;';
        var label = this._image() + space +
                    this._name() + space +
                    this._countOnly();

        return label;
    },

    _cachedFuncs : {
        mouseover: function() { YAHOO.util.Dom.addClass(this.parentNode,    'labelHover'); },
        mouseout:  function() { YAHOO.util.Dom.removeClass(this.parentNode, 'labelHover'); }
    },

    refresh: function() {
        var node  = this.node();
        var divId = this.divId();
        var div = $(divId);
        if (!div || div.tagName !== 'DIV') {
        	if (node) {
        		node.setUpLabel(this.label(true));
        	}
            return;
        }

        if (node) {
            node.setUpLabel(this.label(true));
            node.getLabelEl().className = this._class(true);

            div.innerHTML = [this._image(),  this._name(), this._count()].join("&nbsp;");
        }
        // TODO: Warn if no node?
    },

    hasClass: function(name) {
        if (this.node()) {
            if (YAHOO.util.Dom.hasClass(this.node().getLabelEl(), name)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    addClass: function(name) {
        var node = this.node();
        var el   = node.getLabelEl();

        YAHOO.util.Dom.addClass(el, name);
        node.labelStyle = el.className;
    },

    removeClass: function(name) {
        var node = this.node();
        var el   = node.getLabelEl();

        if (el) {
            YAHOO.util.Dom.removeClass(el, name);
            node.labelStyle = el.className;
        }
    }

};

/**
 * Quota Controller.
 *
 * Usage:
 *   var qc = new DA.mailer.QuotaController();
 *
 * @class QuotaController
 * @uses
 * @constructor
 * @param data json object.
 */
DA.mailer.QuotaController = function(storageNode, messagesNode) {
    this.storageNode  = storageNode;
    this.messagesNode = messagesNode;

    if (DA.vars.custom.threePane.setQuota) {
        eval(DA.vars.custom.threePane.setQuota);
    }
};

/**
 * Members
 */
DA.mailer.QuotaController.prototype = {
    storageNode: null,

    messagesNode: null,

    storageQuota: null,

    messagesQuota: null,

    storageUse: null,

    messagesUse: null,

    storageOver: null,

    messagesOver: null,

    _storage: function() {
        var storageQuota = this.storageQuota;
        var storageUse   = this.storageUse;
        var storage = '';

        if (!DA.util.isEmpty(storageQuota) && !DA.util.isEmpty(storageUse)) {
        	
        	if (DA.vars.config.cap_size_unit === 'MB') {
        		storageUse = (storageUse/1024).toFixed(2);
        		storageQuota = (storageQuota/1024).toFixed(2);
        		storage = '&lt;' + DA.util.encode(storageUse) + '/' + DA.util.encode(storageQuota) + '&gt;' + DA.locale.GetText.t_('STORAGE_UNIT_MB');
        	} else {
            	storage = '&lt;' + DA.util.encode(storageUse) + '/' + DA.util.encode(storageQuota) + '&gt;' + DA.locale.GetText.t_('STORAGE_UNIT');
        	}
        }

        return storage;
    },

    _messages: function() {
        var messagesQuota = this.messagesQuota;
        var messagesUse   = this.messagesUse;
        var messages;

        if (!DA.util.isEmpty(messagesQuota) && !DA.util.isEmpty(messagesUse)) {
            messages = '&lt;' + DA.util.encode(messagesUse) + '/' + DA.util.encode(messagesQuota) + '&gt;' + DA.locale.GetText.t_('MESSAGE_UNIT');
        }

        return messages;
    },

    set: function(data) {
		if(data.quota !== null){
			this.storageQuota  = data.quota.storage;
			this.messagesQuota = data.quota.messages;
			this.storageUse    = data.use.storage;
			this.messagesUse   = data.use.messages;

			if (data.quota.limit.storage === 1 || data.quota.over.storage === 1) {
				this.storageOver = true;
			} else {
				this.storageOver = false;
			}

        	if (data.quota.limit.messages === 1 || data.quota.over.messages === 1) {
            	this.messagesOver = true;
        	} else {
            	this.messagesOver = false;
        	}
		}

    },

    view: function() {
        var storage  = this._storage();
        var messages = this._messages();

        if (!DA.util.isEmpty(storage)) {
            this.storageNode.innerHTML = storage;
            if (this.storageOver) {
                YAHOO.util.Dom.removeClass(this.storageNode, "quotaNormal");
                YAHOO.util.Dom.addClass(this.storageNode, "quotaWarn");
            } else {
                YAHOO.util.Dom.removeClass(this.storageNode, "quotaWarn");
                YAHOO.util.Dom.addClass(this.storageNode, "quotaNormal");
            }
        }
        if (!DA.util.isEmpty(messages)) {
            this.messagesNode.innerHTML = messages;
            if (this.messagesOver) {
                YAHOO.util.Dom.removeClass(this.messagesNode, "quotaNormal");
                YAHOO.util.Dom.addClass(this.messagesNode, "quotaWarn");
            } else {
                YAHOO.util.Dom.removeClass(this.messagesNode, "quotaWarn");
                YAHOO.util.Dom.addClass(this.messagesNode, "quotaNormal");
            }
        }

    }

};

/**
 * Builds a folder-tree's popup Menu.
 * @constructor
 * @param ftc  Instance of "DA.mailer.FolderTreeController"
 * @class FolderTreePopupMenu
 * @namespace DA.mailer
 */
DA.mailer.FolderTreePopupMenu = function(ftc){
    this.ftc       = ftc;
    this.treeData  = ftc.treeData;
    this.treeNode  = ftc.treeNode;
    this.popupNode = ftc.popupNode;
    this.init();
};

/**
 * Members
 */
DA.mailer.FolderTreePopupMenu.prototype = {

    ftc: null,

    /**
     * @property treeData
     * @description Tree Data.
     * @default null
     */
    treeData: null,

    treeNode: null,

    popupNode: null,

    /**
     * @property menuData
     * @description The object containing popup Menu-data.
     * @default null
     */
    menuData: null,

    /**
     * @property popupMenu
     * @description The object of popup menu.
     * @default null
     */
    poupuMenu: null,

    cfDialog: null,

    rfDialog: null,

    ifDialog: null,

    targetedFid: null,

    _id2fid: function(id) {
        if (id.match(/^da\_folderTreeDivId\_(\d+)$/)) {
            return parseInt(RegExp.$1, 10);
        } else {
            return null;
        }
    },

    /**
     * @method init
     * @description init popup menu.
     * @private
     */
    init: function(){
        var me = this;

        this.menuData = {
            order: [
                ['open', 'close'],
                ['trash'],
                ['create', 'delete', 'rename'],
                ['import', 'export'],
                ['filter'],
                ['rebuild']
            ],
            items: {
                open : {
                    text: DA.locale.GetText.t_("FOLDER_OPEN_MENU"),
                    onclick: function() {
                        me.ftc._open(me.targetedFid);
                    }
                },
                close: {
                    text: DA.locale.GetText.t_("FOLDER_CLOSE_MENU"),
                    onclick: function() {
                        me.ftc._close(me.targetedFid);
                    }
                },
                trash: {
                    text: DA.locale.GetText.t_("WASTE_TRASH_MENU", DA.locale.GetText.t_("TRASH")),
                    onclick: function() {
                        if (DA.util.confirm(DA.locale.GetText.t_('WASTE_TRASH_CONFIRM', me.ftc._name(me.targetedFid)))) {
                            me.ftc._trash(me.targetedFid);
                        }
                    }
                },
                create: {
                    text: DA.locale.GetText.t_("FOLDER_ADD_MENU"),
                    onclick: function(e) {
                        me.cfDialog.setString("");
                        me.cfDialog.show(e.clientX, e.clientY);
                    }
                },
                'delete': {
                    text: DA.locale.GetText.t_("FOLDER_DELETE_MENU"),
                    onclick: function() {
                        if (me.ftc._hasChildren(me.targetedFid)) {
                            if (DA.util.confirm(DA.locale.GetText.t_('FOLDER_DELETE_CONFIRM4PARENT',me.ftc._name(me.targetedFid)))) {
                                me.ftc._delete(me.targetedFid);
                            }
                        } else {
                            if (DA.util.confirm(DA.locale.GetText.t_('FOLDER_DELETE_CONFIRM',me.ftc._name(me.targetedFid)))) {
                                me.ftc._delete(me.targetedFid);
                            }
                        }
                    }
                },
                rename: {
                    text: DA.locale.GetText.t_("FOLDER_RENAME_MENU"),
                    onclick: function(e) {
                        me.rfDialog.setString(me.ftc._name(me.targetedFid));
                        me.rfDialog.show(e.clientX, e.clientY);
                    }
                },
                'import': {
                    text: DA.locale.GetText.t_("FOLDER_IMPORT_MENU"),
                    onclick: function(e) {
                        me.ifDialog.clear();
                        me.ifDialog.show(e.clientX, e.clientY);
                    }
                },
                'export': {
                    text: DA.locale.GetText.t_("FOLDER_EXPORT_MENU"),
                    onclick: function() {
                        me.ftc._export(me.targetedFid);
                    }
                },
                filter: {
                    text: DA.locale.GetText.t_("FOLDER_FILTER_MENU"),
                    onclick: function() {
                        me.ftc._filter(me.targetedFid);
                    }
                },
                rebuild: {
                    text: DA.locale.GetText.t_("FOLDER_REBUILD_MENU"),
                    onclick: function() {
                        if (DA.util.confirm(DA.locale.GetText.t_('FOLDER_REBUILD_CONFIRM'))) {
                            me.ftc._rebuild(me.targetedFid);
                        }
                    }
                }
            }
        };

        me.popupMenu = new DA.widget.ContextMenuController(
            "da_folderTreePopupMenu", me.treeNode.id, me.menuData, {
                onTrigger: function(e) {
                    //For finding the right click event in the div of INBOX
                    var target = YAHOO.util.Event.getTarget(e);
                    var srcElem = DA.dom.findParent(target, "DIV", 5);

                    if (!srcElem || !srcElem.id) {
                        return false;
                    }

                    var srcId = srcElem.id;

                    if (!srcId.match(/^da\_folderTreeDivId\_(\d+)$/)) {
                        return false;
                    }

                    if (me.ftc.existsLock()) {
                        return false;
                    }

                    me.cfDialog.hide();
                    me.rfDialog.hide();
                    me.ifDialog.hide();

                    var fid = me._id2fid(srcId);

                    if (DA.util.isNull(fid) || me.ftc._type(fid) === DA.vars.folderType.root) {
                        return false;
                    }

                    // TODO: Consider using some dispatcher pattern for blocks like this one.
                    if (me.ftc._openOk(fid)) {
                        me.popupMenu.enabled('open');
                    } else {
                        me.popupMenu.disabled('open');
                    }
                    if (me.ftc._closeOk(fid)) {
                        me.popupMenu.enabled('close');
                    } else {
                        me.popupMenu.disabled('close');
                    }
                    if (me.ftc._trashOk(fid)) {
                        me.popupMenu.text('trash', DA.locale.GetText.t_("WASTE_TRASH_MENU", me.ftc._name(fid)));
                        me.popupMenu.visible('trash');
                    } else {
                        me.popupMenu.hidden('trash');
                    }
                    if (me.ftc._createOk(fid)) {
                        me.popupMenu.enabled('create');
                    } else {
                        me.popupMenu.disabled('create');
                    }
                    if (me.ftc._deleteOk(fid)) {
                        me.popupMenu.enabled('delete');
                    } else {
                        me.popupMenu.disabled('delete');
                    }
                    if (me.ftc._renameOk(fid)) {
                        me.popupMenu.enabled('rename');
                    } else {
                        me.popupMenu.disabled('rename');
                    }
                    if (me.ftc._importOk(fid)) {
                        me.popupMenu.enabled('import');
                    } else {
                        me.popupMenu.disabled('import');
                    }
                    if (me.ftc._exportOk(fid)) {
                        me.popupMenu.enabled('export');
                    } else {
                        me.popupMenu.disabled('export');
                    }
                    if (me.ftc._filterOk(fid)) {
                        me.popupMenu.enabled('filter');
                    } else {
                        me.popupMenu.disabled('filter');
                    }
                    if (me.ftc._rebuildOk(fid)) {
                        me.popupMenu.enabled('rebuild');
                    } else {
                        me.popupMenu.disabled('rebuild');
                    }

                    me.targetedFid = fid;

                    return true;
                }
            }
        );

        //create a new folder dialog(hidden).
        this.cfDialog = new DA.widget.StringChangerDialog("da_createFolderDialog", DA.locale.GetText.t_("FOLDER_CREATE_DIALOG"), "", {
            onEnter: function() {
                var el = YAHOO.util.Dom.get(me.cfDialog.childId('text'));
                me.ftc._create(me.targetedFid, el.value, DA.vars.folderType['default']);
                return false;
            }
        });

        //rename folder dialog(hidden).
        this.rfDialog = new DA.widget.StringChangerDialog("da_renameFolderDialog", DA.locale.GetText.t_("FOLDER_RENAME_DIALOG"), "", {
            onEnter: function() {
                var el = YAHOO.util.Dom.get(me.rfDialog.childId('text'));
                me.ftc._rename(me.targetedFid, el.value);
                return false;
            }
        });

        //import folder dialog(hidden).
        this.ifDialog = new DA.mailer.widget.MailImportDialog("da_importFolderDialog", DA.locale.GetText.t_("FOLDER_IMPORT_DIALOG"), {
            onEnter: function() {
                var file = DA.dom.fileValue(me.ifDialog.childId('file'));
                var type = DA.dom.radioValue(me.ifDialog.childId('archive_type'));
                if (DA.util.isEmpty(file)) {
                    DA.util.warn(DA.locale.GetText.t_('IMPORT_PATH_EMPTY'));
                } else {
                    if (type === 'eml' && !file.match(/\.eml$/i) && !DA.util.confirm(DA.locale.GetText.t_('FOLDER_IMPORTEML_CONFIRM'))) {
                        return false;
                    }
                    me.ftc.importNode = YAHOO.util.Dom.get(me.ifDialog.childId('form'));
                    me.ftc._import(me.targetedFid);
                }
                return false;
            }
        });

    }

};

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
                return;
            }

        } else if (this.viewPort.isGoingDown(offset)) {
            if (!this.buffer.isAtBottom() && this.buffer.isNearingBottomLimit(offset)) {
                isNearingBottomLimit = true; // down-going IO needed
            } else {
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

    } else {


        for (i=0; i < rowsLength; ++i) {//initialize what we have
          this.populateRow(tableRows[i + contentOffset], rows[i]);
        }
        for (i=0; i < blankSize; ++i) {// blank out the rest 
          this.populateRow(tableRows[i + blankOffset], blankRow);
        }


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

/* $Id: message.js 2482 2014-09-29 01:49:42Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/search/message.js $ */
/*jslint evil: true */
/*for JSLINT undef checks*/
/*extern DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.mailer || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Message searcher widget. 
 * 
 * Usage: 
 *   var mv = new DA.mailer.MessageSearcher();
 * 
 * @class MessageSearcher
 * @uses 
 * @constructor
 * TODO: message
 */
DA.mailer.MessageSearcher = function(itemNode, gridNode, cbhash, folderTreeData) {
    this.itemNode = itemNode;
    this.itemId   = itemNode.id;
    this.gridNode = gridNode;
    this.gridId   = gridNode.id;
    this.folderTreeData = folderTreeData;
    
    if (DA.util.isFunction(cbhash.onSearch)) {
        this.onSearch = cbhash.onSearch;
    }
    
    if (DA.vars.custom.searcher.setMessageSearcher) {
    	eval(DA.vars.custom.searcher.setMessageSearcher);
    }
    this.init();
	if (DA.vars.custom.searcher.setMessageSearcher2) {
		eval(DA.vars.custom.searcher.setMessageSearcher2);
	}
};

/**
 * Members
 */
DA.mailer.MessageSearcher.prototype = {
    
    itemNode: null,
    
    itemId : null,
    
    gridNode: null,
    
    gridId: null,
    
    guideNode: null,
    
    nomatchNode: null,
    
    resultNode: null,
    
    resultFolderNode: null,
    
    resultTotalNode: null,
    
    itemContentsNode: null,
    
    selectedFid: null,
    
    selectedSrid: null,
    
    selectFolderType: null,
    
    folderName: null,
    
    totalMessages: null,
    
    jsonIO: null,

    folderTreeData: null,
    
    /**
     * Search Function.
     */
    onSearch: Prototype.emptyFunction,
    
    init: function() {
        var me = this;
        
        var item = document.createElement('div');
        item.id = this.itemId + 'Contents';
        item.className = 'da_messageSearcherItem';
        var guide = document.createElement('div');
        guide.innerHTML = DA.locale.GetText.t_('SEARCH_MESSAGE_GUIDE') + '<br>' +
                          '<input type=button id="da_messageSearcherSubmit" value="' + DA.locale.GetText.t_('SEARCH_BUTTON') + '">' +
                          '<hr>';
        guide.className = 'da_messageSearcherGuide';
        var nomatch = document.createElement('div');
        nomatch.className = 'da_messageSearcherNomatch';
        nomatch.innerHTML = DA.locale.GetText.t_('SEARCH_NOMATCH');
        var result = document.createElement('div');
        result.className = 'da_messageSearcherResult';
        
        this.itemNode.appendChild(item);
        this.itemNode.appendChild(guide);
        this.itemNode.appendChild(nomatch);
        this.itemNode.appendChild(result);
        this.itemContentsNode = item;
        this.guideNode   = guide;
        this.nomatchNode = nomatch;
        this.resultNode  = result;
        
        var resultChild = DA.widget.makeATable(
            2,
            [
                { width: "5%"  },
                { width: "95%" }
            ],
            {
                table: "da_messageSearcherResultTable",
                td:    "da_messageSearcherResultTd"
            }, 
            [
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_FID'),
                    '<div id="da_messageSearcherResultFolder">&nbsp;</div>'
                ],
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_TOTAL'),
                    '<div id="da_messageSearcherResultTotal">&nbsp;</div>'
                ]
            ]
        );
        result.appendChild(resultChild);
        this.hideNomatch();
        this.hideResult();
        this.resultFolderNode = YAHOO.util.Dom.get('da_messageSearcherResultFolder');
        this.resultTotalNode  = YAHOO.util.Dom.get('da_messageSearcherResultTotal');
        
        var itemChild = DA.widget.makeATable(
            4,
            [
                { width: "5%"  },
                { width: "95%" }
            ],
            {
                table: "da_messageSearcherItemTable",
                td:    "da_messageSearcherItemTd"
            }, 
            [
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_FID'),
                    '<select id="da_messageSearcherItemFid">' + DA.vars.options.folder_tree + '</select>&nbsp;' +
                    '<input type=checkbox id="da_messageSearcherItemClass">&nbsp;' + DA.locale.GetText.t_('SEARCH_CHECKBOXMESSAGE_CLASS')
                ],
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_KEYWORD'),
                    '<input type=text id="da_messageSearcherItemKeyword" style="height:1.5em; margin-right:2px" size="50" maxlength="200">' +
                    '<select id="da_messageSearcherItemCond" size=1>' +
                    '<option value="and">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_COND_AND') + '</option>' +
                    '<option value="or">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_COND_OR') + '</option>' +
                    '</select>'
                ],
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_FIELD'),
                    '<select id="da_messageSearcherItemField" size=1>' +
                    '<option value="text">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_TEXT') + '</option>' +
                    '<option value="body">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_BODY') + '</option>' +
                    '<option value="subject">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_SUBJECT') + '</option>' +
                    '<option value="from">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_FROM') + '</option>' +
                    '<option value="to">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_TO') + '</option>' +
                    '<option value="cc">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_CC') + '</option>' +
                    '<option value="bcc">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_BCC') + '</option>' +
                    '<option value="group">' + DA.locale.GetText.t_('SEARCH_OPTIONNAME_FIELD_GROUP') + '</option>' +
                    '</select>'
                ],
                [
                    DA.locale.GetText.t_('SEARCH_COLUMNTITLE_NORROWING'),
                    '<div id="' + this.itemId + 'NORROWING"></div>'
                ]
            ]
        );
        this.itemContentsNode.appendChild(itemChild);
        
        this.nvPairs = new DA.widget.NVPairSet(
            YAHOO.util.Dom.get(this.itemId + 'NORROWING'), {
                Seen: {
                    name:  DA.locale.GetText.t_('SEARCH_RADIONAME_SEEN'),
                    value: '<input type=radio id="da_messageSearcherItemSeen_0" name="seen" value="0" checked>&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_SEEN_ALL') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherItemSeen_1" name="seen" value="1">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_SEEN_UNSEEN') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherItemSeen_2" name="seen" value="2">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_SEEN_SEEN'),
                    border: false,
                    weight: false
                },
                Flagged: {
                    name:  DA.locale.GetText.t_('SEARCH_RADIONAME_FLAGGED'),
                    value: '<input type=radio id="da_messageSearcherFlagged_0" name="flagged" value="0" checked>&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_FLAGGED_ALL') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherFlagged_1" name="flagged" value="1">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_FLAGGED_UNFLAGGED') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherFlagged_2" name="flagged" value="2">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_FLAGGED_FLAGGED'),
                    border: false,
                    weight: false
                },
                Attachment: {
                    name:  DA.locale.GetText.t_('SEARCH_RADIONAME_ATTACHMENT'),
                    value: '<input type=radio id="da_messageSearcherAttachment_0" name="attachment" value="0" checked>&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_ATTACHMENT_ALL') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherAttachment_1" name="attachment" value="1">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_ATTACHMENT_NOEXISTS') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherAttachment_2" name="attachment" value="2">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_ATTACHMENT_EXISTS'),
                    border: false,
                    weight: false
                },
                Priority: {
                    name:  DA.locale.GetText.t_('SEARCH_RADIONAME_PRIORITY'),
                    value: '<input type=radio id="da_messageSearcherItemPriority_0" name="priority" value="0" checked>&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_PRIORITY_ALL') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherPriority_5" name="priority" value="5">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_PRIORITY_LOW') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherPriority_3" name="priority" value="3">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_PRIORITY_NORMAL') + '&nbsp;' +
                           '<input type=radio id="da_messageSearcherPriority_1" name="priority" value="1">&nbsp;' + DA.locale.GetText.t_('SEARCH_RADIONAME_PRIORITY_HIGH'),
                    border: false,
                    weight: false
                },
                ETC: {
                    name:  DA.locale.GetText.t_('SEARCH_RADIONAME_ETC'),
                    value: '<input type=checkbox id="da_messageSearcherItemToself">&nbsp;' + DA.locale.GetText.t_('SEARCH_CHECKBOXMESSAGE_TOSELF') + '<br>' +
                           '<input type=checkbox id="da_messageSearcherItemDeleted">&nbsp;' + DA.locale.GetText.t_('SEARCH_CHECKBOXMESSAGE_DELETED'),
                    border: false,
                    weight: false
                }
            }, [], true
        );
                
        this.jsonIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_search.cgi' );
        
        YAHOO.util.Event.addListener(YAHOO.util.Dom.get('da_messageSearcherSubmit'), "click", this.search, this, true);
    },
    
    select: function(fid) {
        DA.dom.changeSelectedIndex('da_messageSearcherItemFid', fid);
    },
    
    search: function() {
        var me = this;
        var fid, cl, keyword, cond, field, seen, flagged, attachment, priority, toself, deleted;
        
        if (me.lock()) {
            fid        = DA.dom.selectValue('da_messageSearcherItemFid');
            cl         = (DA.dom.checkedOk('da_messageSearcherItemClass')) ? '2' : '1';
            keyword    = DA.dom.textValue('da_messageSearcherItemKeyword');
            cond       = DA.dom.selectValue('da_messageSearcherItemCond');
            field      = DA.dom.selectValue('da_messageSearcherItemField');
            seen       = DA.dom.radioValue('seen');
            flagged    = DA.dom.radioValue('flagged');
            attachment = DA.dom.radioValue('attachment');
            priority   = DA.dom.radioValue('priority');
            toself     = (DA.dom.checkedOk('da_messageSearcherItemToself')) ? '2' : '0';
            deleted    = (DA.dom.checkedOk('da_messageSearcherItemDeleted')) ? '0' : '1';
            
            if (!keyword.match(/^\s*$/)) {
                DA.waiting.show(DA.locale.GetText.t_("SEARCH_OPERATING_PROMPT"));
                
                me.jsonIO.callback = function(o) {
                
                    if (DA.mailer.util.checkResult(o)) {
                        me.selectedFid   = o.fid;
                        me.selectedSrid  = o.srid;
                        me.folderName    = o.target;
                        me.totalMessages = o.total.messages;
                        
                        if (o.over === 1) {
                            DA.util.warn(DA.locale.GetText.t_('SEARCH_OVER_WARN', DA.vars.system.max_search_hit));
                        }
                        
                        if (o.total.messages > 0) {
                            me.hideNomatch();
                            me.showResult();
                            me.showGrid();
                            me.onSearch(o);
                        } else {
                            me.hideResult();
                            me.hideGrid();
                            me.showNomatch();
                        }
                    } else {
                        me.hideResult();
                    }
                    
                    me.unlock();
                    DA.waiting.hide();
                };
                
                me.jsonIO.errorHandler = function(e) {
                    DA.util.warn(DA.locale.GetText.t_("SEARCH_ERROR"));
                    
                    me.unlock();
                    DA.waiting.hide();
                };
                
                me.jsonIO.execute({
                    proc       : 'search',
                    fid        : fid,
                    'class'    : cl,
                    keyword    : keyword,
                    cond       : cond,
                    field      : field,
                    seen       : seen,
                    flagged    : flagged,
                    attachment : attachment,
                    priority   : priority,
                    toself     : toself,
                    deleted    : deleted
                });
                
                me.unlock();
            } else {
                DA.util.warn(DA.locale.GetText.t_('SEARCH_KEYWORD_EMPTY'));
                
                me.unlock();
            }
        }
    },
    
    showNomatch: function() {
        this.nomatchNode.style.display = '';
    },
    
    hideNomatch: function() {
        this.nomatchNode.style.display = 'none';
    },
    
    showResult: function() {
        this.resultFolderNode.innerHTML = DA.util.encode(this.folderName);
        this.resultTotalNode.innerHTML  = DA.locale.GetText.t_('MESSAGES', DA.util.encode(this.totalMessages));
        this.resultNode.style.display   = "";
    },
    
    hideResult: function() {
        this.resultNode.style.display = "none";
    },
    
    showGrid: function() {
        this.gridNode.style.visibility = '';
    },
    
    hideGrid: function() {
        this.gridNode.style.visibility = 'hidden';
    },
    
    lock: function() {
        if (DA.util.lock('messageSearcher')) {
            return true;
        } else {
            return false;
        }
    },
    
    unlock: function() {
        return DA.util.unlock('messageSearcher');
    },
    
    existsLock: function() {
        return DA.util.existsLock('messageSearcher');
    }
    
};

/* $Id: viewer.js 2506 2014-11-04 08:20:53Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/message/viewer.js $ */
/*for JSLINT undef checks*/
/*extern $ DA Prototype YAHOO BrowserDetect FCKEditorIframeController */
/*jslint evil: true */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

if (!DA || !DA.mailer || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

(function () { // Private scope

// DA.mailer.Events can be used in several places; this just finishes up
// with the NPE checks on load time.
var ME = DA.mailer.Events; // Mailer Events
if (!ME) {
     throw 'MsgView: No Custom Events!';
}

/**
 * Message viewer widget. 
 * 
 * Usage: 
 *   var mv = new DA.mailer.MessageViewer();
 * 
 * @class MessageViewer
 * @uses 
 * @constructor
 * @param headerNode {HTMLElement} DOM node in which to render the mail header.
 * @param bodyNode   {HTMLElement} DOM node in which to render the message body.
 * @param bodyNode   {HTMLElement} DOM node that contains the header/body.
 * @param cbhash     {Object}      A hash of callback functions.
 */
DA.mailer.MessageViewer = function(headerNode, bodyNode, containerNode, cbhash, threePane, requestUrl) {
    this.headerNode    = headerNode;
    this.headerId      = headerNode.id;
    this.bodyNode      = bodyNode;
    this.bodyId        = bodyNode.id;
    this.containerNode = containerNode;
    this.threePane     = threePane;
    this.requestUrl    = requestUrl;
    
    // FIXME: This is best done using Object.extend
    if (cbhash) {
        if (DA.util.isFunction(cbhash.onLoading)) {
            this.onLoading = cbhash.onLoading;
        }
        if (DA.util.isFunction(cbhash.onLoadDone)) {
            this.onLoadDone = cbhash.onLoadDone;
        }
        if (DA.util.isFunction(cbhash.onLoadFailed)) {
            this.onLoadFailed = cbhash.onLoadFailed;
        }
        if (DA.util.isFunction(cbhash.doResize)) {
            this.doResize = cbhash.doResize;
        }
    }
    
    var query = DA.util.parseQuery(this.requestUrl);
    if (query.external && DA.util.cmpNumber(query.external, 1)) {
        this.external = true;
    } else {
        this.external = false;
    }
    
    // Callback point (pre-init)
    if (DA.vars.custom.viewer.setMessageViewer) {
        eval(DA.vars.custom.viewer.setMessageViewer);
    }
    
    this.init();

    // Callback point (post-init)
    if (DA.vars.custom.viewer.setMessageViewer2) {
        eval(DA.vars.custom.viewer.setMessageViewer2);
    }
    
};

/**
 * Members
 */
DA.mailer.MessageViewer.prototype = {
    
    headerNode: null,
    
    headerId : null,
    
    bodyNode: null,
    
    bodyId: null,
    
    headerContentsNode: null,
    
    bodyContentsNode: null,
    
    threePane: null,
    
    requestUrl: null,
    
    external: false,
    
    customHeader: false,
    
    loadingFid: null,
    
    loadingUid: null,
    
    selectedFid: null,
    
    selectedUid: null,
    
    selectedSrid: null,
    
    selectFolderType: null,
    
    selectMessageEditable: null,
    
    selectMessageNotification: null,
    
    jsonIO: null,
    
    moveIO: null,
    
    flagIO: null,
    
    attachMenu: null,
    
    attachData: {},
    
    attachNode: null,
    
    attachArea: null,
    
    customNode: null,
    
    subject: null,

    dialog: null,
    
    saveAttachesToLibDialog: null,
    /**
     * Recalculate and set a new height for the bodyNode, so that 
     * the sum of heights of the header and body nodes never exceed the
     * container: this has an effect of limiting the appearance of
     * scrollbars only to the body node.
     * @method recalculateHeights
     */
    recalculateHeights: function () {
        var hn = this.headerNode;
        var bn = this.bodyNode;
        var cn = this.containerNode;
        var marginH = 5; // FIXME: hardcoding
        var hBuffer = 2;
        // To defeat IE lazy readouts
        var useless = (hn.offsetHeight + 1) + (bn.offsetHeight + 1) + (cn.offsetHeight + 1);
        var maxBH = cn.offsetHeight - (hn.offsetHeight + (marginH * 2) + hBuffer);  
        if (maxBH > 10) { // FIXME: hardcoding
            bn.style.height = maxBH + 'px';
        } else {
            // let everything scroll
            bn.style.height = 'auto';
        }
    },

    /**
     * Callback function which is invoked once when a message starts loading.
     * @property onLoading
     * @type {function}
     * @param // TODO 
     */
    onLoading: Prototype.emptyFunction,
    
    /**
     * Callback function which is invoked once after a message has loaded.
     * @property onLoadDone
     * @type {function}
     * @param // TODO 
     */
    onLoadDone: Prototype.emptyFunction,
    
    /**
     * Resize Functin.
     */
    doResize: Prototype.emptyFunction,
    
    init: function() {
        var me = this;
        // FIXME: Are tables really needed here?
        var header = ['<div class="da_messageViewerHeader">',
                      '<table class="da_messageViewerHeaderTable">',
                      '<tr>',
                      '  <td colspan="2" class="da_messageViewerHeaderTableTopLeft">', DA.imageLoader.nullTag(1, 3), '</td>',
                      '  <td class="da_messageViewerHeaderTableTopRight">', DA.imageLoader.nullTag(2, 3), '</td>',
                      '</tr>',
                      '<tr>',
                      '  <td class="da_messageViewerHeaderTableMiddleLeft">', DA.imageLoader.nullTag(2, 1), '</td>',
                      '  <td class="da_messageViewerHeaderTableMiddleCenter">', 
                      '    <table class="da_messageViewerHeaderContents">',
                      '    <tr>',
                      '      <td id="', this.headerId, 'Contents"></td>',
                      '    </tr>',
                      '    </table>',
                      '  </td>',
                      '  <td class="da_messageViewerHeaderTableMiddleRight">', DA.imageLoader.nullTag(2, 1), '</td>',
                      '</tr>',
                      '<tr>',
                      '  <td colspan="2" class="da_messageViewerHeaderTableBottomLeft">', DA.imageLoader.nullTag(1, 2), '</td>',
                      '  <td class="da_messageViewerHeaderTableBottomRight">', DA.imageLoader.nullTag(2, 2), '</td>',
                      '</tr>',
                      '</table>',
                      '</div>'].join('');

        var body   = ['<div class="da_messageViewerBodyContents" id="', this.bodyId, 'Contents"></div>'].join(''); 
        
        this.headerNode.innerHTML = header;
        this.bodyNode.innerHTML   = body;
        
        this.headerContentsNode = YAHOO.util.Dom.get(this.headerId + 'Contents');
        this.bodyContentsNode   = YAHOO.util.Dom.get(this.bodyId + 'Contents');
        if (DA.vars.config.font === 'on') {
            YAHOO.util.Dom.addClass(this.bodyContentsNode, 'da_nonProportionalFont');
        }
        if (DA.vars.custom.viewer.headerOpen || DA.vars.custom.viewer.headerClose) {
            this.customHeader = true;
        }
        
        this.nvPairs = new DA.widget.NVPairSet(
            $(this.headerId + 'Contents'), {
                Subject: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'),
                    value: ''
                },
                From: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_FROM'),
                    value: ''
                },
                To: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_TO'),
                    value: '',
                    expanded: (DA.vars.config.detail_header_to_open === 1) ? true : false
                },
                Cc: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_CC'),
                    value: '',
                    expanded: (DA.vars.config.detail_header_cc_open === 1) ? true : false
                },
                Bcc: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_BCC'),
                    value: '',
                    expanded: (DA.vars.config.detail_header_bcc_open === 1) ? true : false
                },
                Date: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_DATE'),
                    value: ''
                },
                Attachment: {
                    name:  DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_ATTACHMENT'),
                    value: '',
                    expanded: (DA.vars.config.detail_header_attachment_open === 1) ? true : false,
                    id: this.headerId + 'Attachment',
                    icon: DA.vars.imgRdir + '/ico_mail_attach.gif'
                },
                Custom: {
                    id: this.headerId + 'Custom',
                    row: DA.vars.custom.viewer.headerOpen,
                    html: DA.vars.custom.viewer.headerClose,
                    border: false,
                    hidden: (this.customHeader) ? false : true
                }
            }, 
            ['Subject', 'From', 'Date', 'Custom', 'Attachment', 'To', 'Cc','Bcc'], 
            (DA.vars.config.detail_header_open === 1) ? true : false
        );
        
        // Whenever the header nvpairs changes size (expands/collapses), recalculate the
        // viewer's header-div and body-div heights, so that scrollbars appear only for
        // the body and the header stay where it is.
        this.nvPairs.onExpand = this.nvPairs.onCollapse = function () {
            me.doResize();
            if (me.threePane) {
                me.recalculateHeights();
            }
        };

        this.attachMenu = new DA.widget.PulldownMenuController(this.headerId + 'AttachmentIconPopup', this.headerId + 'AttachmentIcon', this.attachData, {
            onTrigger: function(e) {
                var srcElem = YAHOO.util.Event.getTarget(e);
                return srcElem && DA.util.match(srcElem.id, me.headerId + 'AttachmentIcon');
            }
        });

        // FIXME: OO violation: attachNode is a reference to a member object of NVPairs
        this.attachNode = YAHOO.util.Dom.get(this.headerId + 'AttachmentIcon');
        if (this.customHeader) {
            // FIXME: OO violation: customNode is a reference to a member object of NVPairs
            this.customNode = YAHOO.util.Dom.get(this.headerId + 'CustomHTML');
        }
        me.attachArea = YAHOO.util.Dom.get(this.headerId + 'AttachmentSeparator');
        
        this.jsonIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_detail.cgi' );
        this.moveIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
        this.flagIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_flag.cgi' );
        if( this.selectedFid ){
            this.saveAttachesToLibDialog = new DA.widget.SaveAttachesToLibDialog("da_saveAttachToLibDialog", DA.locale.GetText.t_("SAVE_TO_LIB_DIALOG_TITLE"), me.attachData, me.selectedFid, me.selectedUid, {
            onEnter: function() {
              var attaches = document.getElementsByName("da_saveAttachToLibDialog_attaches");
              var checkedAttachesAid = "";
              for( var i = 0; i < attaches.length; i++ ){
                if ( checkedAttachesAid !== "" ) {
                  if ( attaches[i].checked ){
                    checkedAttachesAid += ',';
                  }
                }
                if ( attaches[i].checked ){
                  checkedAttachesAid += attaches[i].value;
                }
              }
              if ( checkedAttachesAid === "" ) {
                alert(DA.locale.GetText.t_("MESSAGE_SELECT_ATTACHES_ERROR"));
                return false;
              }
              var url, flg;
              url = "lib_foldersel.cgi%3fcall=ma_bundle%20uid=" + this.selectedUid + "%20fid=" + this.selectedFid + "%20aid=" + checkedAttachesAid;
              var Img  = 'pop_title_attachsave.gif';
              DA.windowController.isePopup(url, Img, 400, 550, "");
              return false;
            }
          });
        }
        this.clear();

        this._setupSubscribers();
        this._setupCleanupHandlers();

    },
    
    clear: function() {
        FCKEditorIframeController.removeIframe(this.bodyId + 'Contents' + "FckEditorViewer", this.bodyContentsNode);
        this.bodyContentsNode.innerHTML = (this.threePane) ? DA.locale.GetText.t_('DEFAULT_MESSAGE_BODY') : '';
        this.nvPairs.changeName('Subject', DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'));
        this.nvPairs.changeValue('Subject', '');
        this.nvPairs.changeValue('From', '');
        this.nvPairs.changeValue('To', '');
        this.nvPairs.changeValue('Cc', '');
        this.nvPairs.changeValue('Bcc', '');
        this.nvPairs.changeValue('Date', '');
        this.nvPairs.changeValue('Attachment', '');
        this.nvPairs.changeExpand('From', '');
        this.nvPairs.changeExpand('To', '');
        this.nvPairs.changeExpand('Cc', '');
        this.nvPairs.changeExpand('Bcc', '');
        this.nvPairs.changeExpand('Attachment', '');
        this.nvPairs.disableExpand();
        
        this.attachNode.style.display = 'none';
        this.attachNode.className = 'da_messageViewerHeaderAttachmentDisabled';
        if (this.customHeader && this.customNode) {
            this.customNode.style.display = 'none';
        }
        
        this.loadingFid = null;
        this.loadingUid = null;
        this.selectedUid = null;
    },

	add_reply_icon: function(mmdata)
	{
		var me = this;
		var reply;
		if((DA.vars.system.no_replied_flag===0)&&(mmdata.fid === this.selectedFid)&&(mmdata.uid === this.selectedUid))
		{
			reply = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_sc_reply.gif', 'Replied', { width: 16, height: 16 });			
			me.nvPairs.changeValue('Subject', reply+this.subject);
		}
	},
	
	add_forward_icon: function(mmdata)
	{
	    var me = this;
		var forward;
		if((DA.vars.system.no_replied_flag===0)&&(mmdata.fid === this.selectedFid)&&(mmdata.uid === this.selectedUid))
		{
			
			forward = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_sc_forward.gif', 'Forwarded', { width: 16, height: 16 });
            me.nvPairs.changeValue('Subject', forward+this.subject);
		}
	},

    /**
     * @property _handleMessagesMoving
     * @type {Function} to be used as a subscriber to DA.mailer.Events.onMessagesMoving
     * @private
     */
    _handleMessagesMoving: function (type, args) {
        var jobId = args[0], params = args[1];
        var messages;
        if (!params || !(messages = params.messages)) {
            return;
        }
        if (messages.ranges.length) {
        }
        if(messages.singles.length ===1)
        {	
        	if(messages.single.mode === 1)
        	{
        		this.add_reply_icon({fid:messages.single.fid,uid:messages.single.originuid});
        	}
        	else if(messages.single.mode ===2)
        	{
        		this.add_forward_icon({fid:messages.single.fid,uid:messages.single.originuid});
        	}
        	else {}
        }
        if (messages.singles.find(this._isSameMessage.bind(this))) {
            if (params.target.trash) {
                this.onMessageDeleted();
            } else {
                this.onMessageMoved(params.target.fid);
            }
        }
    },

    /**
     * Callback invoked when the message that we were viewing has been deleted.
     * By default, this closes the viewer
     * @property onMessageDeleted
     * @protected
     * @type {Function} Callback
     */
    onMessageDeleted: function () {
        this.close();
    },

    /**
     * Callback invoked when the message that we were moving has been moved
     * to another folder.
     * @property onMessageMoved
     * @type {Function} Callback
     * @param fid {Number} ID of the destination IMAP folder
     */
    onMessageMoved:   Prototype.emptyFunction,

    /**
     * init-time method that sets up subscribers to DA.mailer.Events.*
     * @method _setupSubscribers
     * @private
     */
    _setupSubscribers: function () {
        ME.onMessagesMoving.subscribe(this._handleMessagesMoving, this, true);
    },

    /**
     * init-time method.
     * CustomEvent subscribers <b>MUST</b> be removed if the window has been
     * closed.
     * @method _setupCleanupHandlers
     * @private
     */
    _setupCleanupHandlers: function () {
        YAHOO.util.Event.on(window, 'unload', this._unsubscribe, this, true);
    },
   
    /**
     * @method _unsubscribe
     * @private
     */
    _unsubscribe: function () {
        ME.onMessagesMoving.unsubscribe(this._handleMessagesMoving, this);
    },

    /**
     * @method _isSameMessage
     * @private
     * @returns {Boolean}
     */
    _isSameMessage: function (oMmdata) {
        if (!oMmdata) { return false; }
        var fid = parseInt(this.selectedFid, 10);
        var uid = parseInt(this.selectedUid, 10);
        return parseInt(oMmdata.fid, 10) === fid &&
               parseInt(oMmdata.uid, 10) === uid ;
    
    },
   
    /**
     * Loads and views the given message (by it's meta-data) in the viewer.
     * @method view
     * @param oMMData {Object} mail meta-data (uid, fid etc)
     * @param proc    {String} can be 'next', 'prev'
     * @param nomdn   ? // FIXME: Comments needed.
     */
    view: function(oMMData, proc, nomdn) {
        var fid, uid, srid, backup_maid, fckHeadStyle, fckBody;
        var fckHeaderMatcher = /^<\!-- Created by DA_Richtext .*? end default style -->/;
        var fckStyleMatcher = /<style>.*?<\/style>/;
        if (!oMMData || !(uid = oMMData.uid)) {
        }
        fid  = oMMData.fid;
        srid = oMMData.srid;
        backup_maid = oMMData.backup_maid;

        var me = this;
        
        if (!this.loadingFid || !this.loadingUid ||
            this.loadingFid !== fid || this.loadingUid !== uid) {
            
            this.loadingFid = fid;
            this.loadingUid = uid;
            
            if (me.lock()) {
                me.jsonIO.callback = function(o) {
                    var i, priority,reply,forward;
                
                    if (DA.mailer.util.checkResult(o)) {
                        me.selectedFid      = o.fid;
                        me.selectedUid      = o.uid;
                        me.selectedSrid     = o.srid;
                        me.selectFolderType = o.type;
                        me.selectMessageEditable     = (o.edit_m === 1) ? true : false;
                        if(me.selectFolderType === 21){
                           me.selectMessageEditable = "true";
                        }
                        me.selectMessageExportable   = (o['export'] === 1) ? true : false;
                        me.selectMessageNotification = (DA.util.isEmpty(o.notification)) ? 0 : o.notification;
                        if(DA.mailer.util.isDraft(me.selectFolderType) || DA.mailer.util.isSent(me.selectFolderType) || DA.mailer.util.isLocalFolder(me.selectFolderType) || DA.mailer.util.isBackupFolder(me.selectFolderType)){
                        	me.nvPairs.reorder(['Subject','To','Date','Attachment','Cc', 'From']);
                        } else {
                        	me.nvPairs.reorder(['Subject','From','Date', 'Attachment','To', 'Cc']);
                        }
                        
                        me.nvPairs.enableExpand();
                        
                        if (o.priority < 3) {
                            priority = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_mail_high.gif', '', { width: 14, height: 14 });
                        } else if (o.priority > 3) {
                            priority = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_mail_low.gif', '', { width: 14, height: 14 });
                        } else {
                            priority = DA.imageLoader.nullTag(14, 14);
                        }
                        
                        me.subject = DA.util.encode(o.subject);
                        if(me.subject === null){ me.subject='';} 
                        me.nvPairs.changeName('Subject', priority + DA.locale.GetText.t_('MESSAGE_COLUMNTITLE_SUBJECT'));
                        if (DA.vars.system.no_forwarded_flag===0 && o.replied === 1) {
                            reply = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_sc_reply.gif', 'Replied', { width: 16, height: 16 });                   
                            me.nvPairs.changeValue('Subject', reply+me.subject);
                        } else if(DA.vars.system.no_forwarded_flag===0 && o.forwarded === 1) {
                            forward = DA.imageLoader.tag(DA.vars.imgRdir + '/ico_sc_forward.gif', 'Forwarded', { width: 16, height: 16 });
                            me.nvPairs.changeValue('Subject', forward+me.subject);
                        } else {
                            me.nvPairs.changeValue('Subject', me.subject);
                        }
                        
                        if (o.from_list && o.from_list.length > 3) {
                            me.nvPairs.changeValue('From', DA.ug.list2String(o.from_list, 3, 3));
                            me.nvPairs.changeExpand('From', DA.ug.list2String(o.from_list, 3));
                            if (o.from_list.length > DA.vars.config.mail_to_resize_num) { 
                            	me.nvPairs.scrollSeparator('From', 1);
                            } else { 
                            	me.nvPairs.unscrollSeparator('From', 1);
                            }
                        } else {
                            me.nvPairs.changeValue('From', DA.ug.list2String(o.from_list));
                            me.nvPairs.changeExpand('From', '');
                            me.nvPairs.unscrollSeparator('From', 1);
                        }
                        
                        if (o.to_list && o.to_list.length > 3) {
                            me.nvPairs.changeValue('To', DA.ug.list2String(o.to_list, 3, 3));
                            me.nvPairs.changeExpand('To', DA.ug.list2String(o.to_list, 3));
                            if (o.to_list.length > DA.vars.config.mail_to_resize_num) { 
                            	me.nvPairs.scrollSeparator('To', 1);
                              me.nvPairs.showCursor("Cc");
                            } else { 
                              me.nvPairs.hideCursor("Cc");
                            	me.nvPairs.unscrollSeparator('To', 1);
                            }
                        } else {
                            me.nvPairs.hideCursor("Cc");
                            me.nvPairs.changeValue('To', DA.ug.list2String(o.to_list));
                            me.nvPairs.changeExpand('To', '');
                            me.nvPairs.unscrollSeparator('To', 1);
                        }
                        
                        if (o.cc_list && o.cc_list.length > 3) {
                            me.nvPairs.changeValue('Cc', DA.ug.list2String(o.cc_list, 3, 3));
                            me.nvPairs.changeExpand('Cc', DA.ug.list2String(o.cc_list, 3));
                            if (o.cc_list.length > DA.vars.config.mail_to_resize_num) { 
                            	me.nvPairs.scrollSeparator('Cc', 1);
                              me.nvPairs.showCursor("Bcc");
                            } else { 
                              me.nvPairs.hideCursor("Bcc");
                            	me.nvPairs.unscrollSeparator('Cc', 1);
                            }
                        } else {
                            me.nvPairs.hideCursor("Bcc");
                            me.nvPairs.changeValue('Cc', DA.ug.list2String(o.cc_list));
                            me.nvPairs.changeExpand('Cc', '');
                            me.nvPairs.unscrollSeparator('Cc', 1);
                        }
                        if (DA.mailer.util.isDraft(me.selectFolderType) || DA.mailer.util.isSent(me.selectFolderType)) {
                            me.nvPairs.showColumn('Bcc');
                            if (o.bcc_list && o.bcc_list.length > 3) {
                                me.nvPairs.changeValue('Bcc', DA.ug.list2String(o.bcc_list, 3, 3));
                                me.nvPairs.changeExpand('Bcc', DA.ug.list2String(o.bcc_list, 3));
                                if (o.bcc_list.length > DA.vars.config.mail_to_resize_num) { 
	                            	me.nvPairs.scrollSeparator('Bcc', 1);
                                me.nvPairs.showCursor("Date");
	                            } else { 
                                me.nvPairs.hideCursor("Date");
	                            	me.nvPairs.unscrollSeparator('Bcc', 1);
	                            }
                            } else {
                                me.nvPairs.hideCursor("Date");
                                me.nvPairs.changeValue('Bcc', DA.ug.list2String(o.bcc_list));
                                me.nvPairs.changeExpand('Bcc', '');
                                me.nvPairs.unscrollSeparator('Bcc', 1);
                            }
                        } else {
                            me.nvPairs.hideColumn('Bcc');
                        }

                        me.nvPairs.changeValue('Date', DA.util.encode(o.date));
                        if (o.attach_list && o.attach_list.length > 3) {
                            me.nvPairs.changeValue('Attachment', DA.file.list2String(o.attach_list, 3, 3));
                            me.nvPairs.changeExpand('Attachment', DA.file.list2String(o.attach_list, 3));
                        } else {
                            me.nvPairs.changeValue('Attachment', DA.file.list2String(o.attach_list));
                            me.nvPairs.changeExpand('Attachment', '');
                        }
                        if (o.attach_list && o.attach_list.length > 0) {
                            me.attachNode.style.display = '';
                            me.attachNode.className = 'da_messageViewerHeaderAttachmentEnabled';
                            
                            me.attachData.order = [];
                            me.attachData.order[0] = [];
                            me.attachData.items = {};
                            me.attachData.className = 'da_messageViewerHeaderAttachmentPulldownMenu';
                            me.attachData.encode = false;
                            for (i = 0; i < o.attach_list.length; i ++) {
                                me.attachData.order[0].push(i);
                                me.attachData.items[i] = {
                                    text: DA.file.object2String(o.attach_list[i], true),
                                    onclick: function(e, a) {
                                        eval(a[0]);
                                    },
                                    args: [o.attach_list[i].link],
                                    title: DA.util.encode(o.attach_list[i].title)
                                };
                            }
                            
                            me.attachArea.style.height = (o.attach_list.length>12) ? "80px":"";
                        } else {
                            // FIXME: OO Vioalation: Directly manipulating a member object of NVPairs
                            me.attachNode.style.display = 'none';
                            me.attachNode.className = 'da_messageViewerHeaderAttachmentDisabled';
                            me.attachArea.style.height = "";
                        }
                        me.saveAttachesToLibDialog = new DA.widget.SaveAttachesToLibDialog("da_saveAttachToLibDialog", DA.locale.GetText.t_("SAVE_TO_LIB_DIALOG_TITLE"), me.attachData, me.selectedFid, me.selectedUid, {
                          onEnter: function() {
                            var attaches = document.getElementsByName("da_saveAttachToLibDialog_attaches");
                            var checkedAttachesAid = "";
                            for( var i = 0; i < attaches.length; i++ ){
                              if ( checkedAttachesAid !== "" ) {
                                if ( attaches[i].checked ){
                                  checkedAttachesAid += ',';
                                }
                              }
                              if ( attaches[i].checked ){
                                checkedAttachesAid += attaches[i].value;
                              }
                            }
                            if ( checkedAttachesAid === "" ) {
                              alert(DA.locale.GetText.t_("MESSAGE_SELECT_ATTACHES_ERROR"));
                              return false;
                            }
                            var url, flg;
                            url = "lib_foldersel.cgi%3fcall=ma_bundle%20uid=" + me.selectedUid + "%20fid=" + me.selectedFid + "%20aid=" + checkedAttachesAid;
                            var Img  = 'pop_title_attachsave.gif';
                            DA.windowController.isePopup(url, Img, 400, 550, "");
                            return true;
                          }
                        });
                        
                        if (me.customHeader && me.customNode) {
                            // FIXME: OO Vioalation: Directly manipulating a member object of NVPairs
                            me.customNode.style.display = '';
                        }
                        
                        // Have to call resize explicitly because we directly manipulate NVPairs's properties
                        // (we mess with the style.display property of attachNode, customNode)
                        me.nvPairs.resize();
                        
                        FCKEditorIframeController.removeIframe(me.bodyId + 'Contents' + "FckEditorViewer", me.bodyContentsNode);
                        
                        if (DA.util.isEmpty(o.body.html)) {
                            if (DA.util.isEmpty(o.body.text)) {
                                me.bodyContentsNode.innerHTML = '';
                            }else if(DA.vars.config.b_wrap === 'on'){
								me.bodyContentsNode.innerHTML = o.body.text;
                            } else {
                                me.bodyContentsNode.innerHTML = '<pre style="height:100%;">' + o.body.text + '</pre>';
                            }
                        } else {
                            if (FCKEditorIframeController.isFCKeditorData(o.body.html)) {
                                fckHeadStyle = o.body.html.match(fckStyleMatcher);
                                fckBody = o.body.html.replace(fckStyleMatcher, "");
                                FCKEditorIframeController.createIframe(me.bodyId + 'Contents' + "FckEditorViewer", me.bodyContentsNode);
                                FCKEditorIframeController.setIframeBody(me.bodyId + 'Contents' + "FckEditorViewer", ['<head>', fckHeadStyle,'<style>body {margin:0px; padding:0px; border:0;}</style>','<script>function Pop4Ajax(Url,Width,Height,POSX,POSY){ top.Pop4Ajax(Url,Width,Height,POSX,POSY);}</script>','</head>', '<body>', '<div style="word-break:break-all">', fckBody, '</div>', '</body>'].join("\n"));
                            } else{
                                me.bodyContentsNode.innerHTML = o.body.html;
                            }
                        }
                        
                        me.doResize();
                        if (me.threePane) {
                            me.recalculateHeights();
                        }
                        
                        me.bodyContentsNode.scrollTop = 0; // Scroll up! It's a new message.
                        
                        if (me.selectMessageNotification !== 0) {
                            me.mdn();
                        }
                        
                        me.onLoadDone(o);
                        // Now tell the world that this message has been read ;-)

			DA.customEvent.fire("messageViewerOnLoadDoneAfter", me, o);

                        if (DA.mailer.util.isJoin(o.type) !== true) {
                            if (!o.seen || parseInt(o.seen, 10) === 0) {
                                // Indeed, this is a new message!
                                o.seen = 1; 
                                oMMData.seen = 1;
                                DA.mailer.Events.onMessageRead.fire(o); // o should do nicely as mail-meta-data..
                            }
                        }      
                        
                    } else {
                        me.loadingFid = null;
                        me.loadingUid = null;
			me.onLoadFailed(oMMData);
                    }
                    
                    me.unlock();
                };
                
                me.jsonIO.errorHandler = function(e) {
                    DA.util.warn(DA.locale.GetText.t_("MESSAGE_VIEW_ERROR"));
                    
                    me.loadingFid = null;
                    me.loadingUid = null;
                    
                    me.unlock();
		    me.onLoadFailed(oMMData, e);
                };
                
                me.jsonIO.execute({ 
                    fid: fid,  uid : uid,
                    backup_maid: (DA.util.isEmpty(backup_maid)) ? '' : backup_maid,
                    srid: (DA.util.isEmpty(srid)) ? '' : srid, 
                    proc: (DA.util.isEmpty(proc)) ? '' : proc,
                    nomdn: (DA.util.isEmpty(nomdn)) ? '' : nomdn
                });

                me.onLoading(oMMData); // TODO: do we need to pass any arguments? 
            } else {
                this.loadingFid = null;
                this.loadingUid = null;
            }
        }
    },
    
    make: function(tid) {
        this._editor('new', null, null, tid, null);
    },
    
    edit: function(quote, fid, uid) {
        this._editor('edit', fid, uid, null, quote);
    },
    
    reply: function(quote, fid, uid) {
        this._editor('reply', fid, uid, null, quote);
    },
    
    replyall: function(quote, fid, uid) {
        this._editor('all_reply', fid, uid, null, quote);
    },
    
    forward: function(quote, fid, uid) {
        this._editor('forward', fid, uid, null, quote);
    },

    /**
     * Callback function invoked when close is called.
     * @property onClose
     * @type {Function}
     * @returns {Boolean}
     */
    onClose: function () { return true; },

    /**
     * Can be called to finish up. This will invoke the onClose callback,
     * and then proceed to call clear.
     * @method close
     */
    close: function () {
        if (this.onClose()) {
            this.clear();
        }
    },

    'delete': function() {
        var me = this;
        var message = (DA.mailer.util.isTrash(this.selectFolderType) || DA.vars.config["delete"] === 1) ? DA.locale.GetText.t_("MESSAGE_DELETECOMPLETE_CONFIRM") : DA.locale.GetText.t_("MESSAGE_DELETE_CONFIRM");
        var io;

        var mmdata = {
            fid: me.selectedFid,
            uid: me.selectedUid,
            srid: (DA.util.isEmpty(me.selectedSrid)) ? me.selectedSrid : ''
        };
        
        if (me.lock()) {
            if (DA.util.confirm(message)) {
                if (this.external) {
                    io = this.moveIO;
                    
                    io.callback = function(o) {
                        if (DA.mailer.util.checkResult(o)) {
                            if (me.selectedSrid === 100000000) {
                                DA.mailer.util.reloadPortal();
                            }
                            DA.windowController.allClose();
                            me.close();
                        }
                        
                        me.unlock();
                    };
                    
                    io.errorHandler = function(e) {
                        DA.util.warn(DA.locale.GetText.t_("MESSAGE_DELETE_ERROR"));
                        
                        me.unlock();
                    };
                    
                    io.execute({
                        proc: (DA.mailer.util.isTrash(me.selectFolderType) || DA.vars.config["delete"] === 1) ? 'delete' : 'trash',
                        fid: me.selectedFid,
                        uid: me.selectedUid,
                        srid: (DA.util.isEmpty(me.selectedSrid)) ? me.selectedSrid : ''
                    });
                } else {
                    try {
                        setTimeout(function () { // Asynchronous
                            DA.mailer.Events.onMessageMoveRequest.fire({
                                target:   { trash: true },
                                messages: {
                                    fid:     me.selectedFid,
                                    srid:    me.selectedSrid,
                                    single:  mmdata,
                                    singles:  [ mmdata ],
                                    ranges:   [],
                                    count:    1,
                                    identity: {}
                                }
                            });
                        }, 200);
                    } catch(e) {
                        me.unlock();
                    }
                }
            } else {
                me.unlock();
            }
        } else {
            me.unlock();
        }
    },
    
    print: function(printToConfig) {
        if (!this.existsLock()) {
            DA.windowController.winOpen(DA.vars.cgiRdir + '/ma_ajx_print.cgi?fid=' + this.selectedFid + '&uid=' + this.selectedUid + '&printtoconfig=' + printToConfig , '', 710, 600);
        }
    },
    
    filter: function() {
        var Proc = 'ma_ajx_filter.cgi%3ffid=' + this.selectedFid + '%20uid=' + this.selectedUid + '%20edit=add%20detail=1%20title_mode=1';
        var Img  = 'pop_title_filter.gif';
        
        if (!this.existsLock()) {
            DA.windowController.isePopup(Proc, Img, 800, 600, '', 1);
        }
    },
    
    prev: function() {
        if (!this.existsLock()) {
            this.view({
                fid:  this.selectedFid, 
                uid:  this.selectedUid, 
                srid: this.selectedSrid
            }, 'prev');
        }
    },
    
    next: function() {
        if (!this.existsLock()) {
            this.view({
                fid:  this.selectedFid, 
                uid:  this.selectedUid, 
                srid: this.selectedSrid
            }, 'next');
        }
    },
    
    header: function() {
        var Proc = 'ma_ajx_header.cgi%3ffid=' + this.selectedFid + '%20uid=' + this.selectedUid;
        var Img  = 'pop_title_emlhead.gif';
        
        if (!this.existsLock()) {
            DA.windowController.isePopup(Proc, Img, 650, 600, '', 1);
        }
    },
    
    'export': function() {
        var me = this;
        var h, io;
		var url,Proc;
        
        if (me.selectMessageExportable && me.lock()) {
            io = this.moveIO;
            io.callback = function(o) {
                if (DA.mailer.util.checkResult(o)) {
                    if (!DA.util.isEmpty(o.file)) {
                        if(DA.util.isNull(o.file_name)){
                  		Proc = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=archive%26file=' + o.file;
                        }else{
                            Proc = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=archive%26file=' + o.file + '%26file_name=' + o.file_name;
                        }
                    	url = DA.vars.cgiRdir + '/down_pop4ajax.cgi?proc='+Proc;
                        DA.windowController.winOpenNoBar(url, '', 400, 450);
                    } else {
                        DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
                    }
                }
                
                me.unlock();
            };
            
            io.errorHandler = function(e) {
                DA.util.warn(DA.locale.GetText.t_("EXPORT_ERROR"));
                
                me.unlock();
            };
            
            io.execute({ proc: 'export', fid: me.selectedFid, uid: me.selectedUid, archive: '0' });
            
        }
        
    },

    savetolib: function(){
        var me = this;
        var saveToLibIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
        saveToLibIO.method = 'get';
        var Img  = 'pop_title_attachsave.gif';
        saveToLibIO.errorHandler = function(e) {
            DA.util.warn(DA.locale.GetText.t_("SAVE_TO_LIB_ERROR"));
        };
        saveToLibIO.callback = function(o) {
            var url;
            if (!DA.util.isEmpty(o.file)) {
                url = "lib_foldersel.cgi%3fcall=ma_detail%20path=" + o.file + "%20name=" + o.file_name + "%20is_for_save_mail=true";
                DA.windowController.isePopup(url, Img, 400, 550, DA.mailer.util.getMailAccount(), false);
            } else {
                DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
            }
        };
        saveToLibIO.execute({
              fid:  me.selectedFid,
              uid:  me.selectedFid + ":" + me.selectedUid,
              area: "",
              archive: "1",
              proc: "save_to_lib"
        });
    },

    getattachesnum: function() {
      var me = this;
      if(me.attachData.order){
        return me.attachData.order.length;
      }else{
        return 0;
      }
    },

    showsaveattachestolibdialog: function(height,width) {
        var me = this;
        me.saveAttachesToLibDialog.show(height,width);
    },
    
    sales: function() {
        if (!this.existsLock()) {
            DA.windowController.winOpen(DA.vars.cgiRdir + '/ma_ajx_sales.cgi?fid=' + this.selectedFid + '&uid=' + this.selectedUid);
        }
    },
   
    // FIXME: Comments! 
    mdn: function() {
        var me = this;
        var h, io;
        
        if (me.selectMessageNotification === 2) {
            DA.util.warn(DA.locale.GetText.t_("MESSAGE_MDN_SENT"));
        } else if (me.selectMessageNotification === 3) {
            DA.util.warn(DA.locale.GetText.t_("MESSAGE_MDN_SENT")+'\n'+DA.locale.GetText.t_("MESSAGE_APPEND_MAIL2LOCAL"));
        } else if (me.selectMessageNotification === 1) {
            if (DA.util.confirm(DA.locale.GetText.t_("MESSAGE_MDN_CONFIRM"))) {
                io = this.flagIO;
                
                io.callback = function(o) {
                	if (o.result && o.result.message) {
                		DA.util.warn(DA.locale.GetText.t_("MESSAGE_MDN_SENT")+'\n'+o.result.message);
                	}
                };
                
                io.errorHandler = function(e) {
                    DA.util.warn(DA.locale.GetText.t_("MDN_ERROR"));
                };
                
                io.execute({ proc: 'mdn', fid: me.selectedFid, uid: me.selectedUid });
            }
        }
    },
    
    lock: function() {
         if (DA.util.lock('messageViewer')) {
            return true;
        } else {
            return false;
        }
        //return true;
    },
    
    unlock: function() {
        return DA.util.unlock('messageViewer');
        //return true;
    },
    
    existsLock: function() {
        return DA.util.existsLock('messageViewer');
        //return false;
    },
    
    _editor: function(proc, fid, uid, tid, quote) {
        var query;
        var _fid = (fid) ? fid : this.selectedFid;
        var _uid = (uid) ? uid : this.selectedUid;
        var _tid = tid;
        var _quote = quote;
        
        if (this.threePane) {
            DA.mailer.windowController.editorOpen(proc, _fid, _uid, _tid, _quote);
        } else {
            query = '&proc=' + proc;
            if (!DA.util.isEmpty(_fid)) {
                query += '&fid=' + _fid + '&uid=' + _uid;
            }
            if (!DA.util.isEmpty(_tid)) {
                query += '&tid=' + _tid;
            }
            if (!DA.util.isEmpty(_quote)) {
                query += '&quote=' + _quote;
            }
            location.href = DA.util.setUrl(DA.vars.cgiRdir + '/ajax_mailer.cgi?html=editor&richtext=1' + query + "&org_mail_gid=" + OrgMailer.vars.org_mail_gid);
        }
    },
    
    /**
     * Support for DA.session.UIState
     * @method getUIStateInfo
     * @returns {Hash}
     */
    getUIStateInfo: function () {
        return {
            headerExpanded: (this.nvPairs.expanded) ? 1 : 0,
            headerToExpanded: (this.nvPairs.nvpair.To.expanded) ? 1 : 0,
            headerCcExpanded: (this.nvPairs.nvpair.Cc.expanded) ? 1 : 0,
            headerAttachmentExpanded: (this.nvPairs.nvpair.Attachment.expanded) ? 1 : 0 
        };
    }
    
};

})(); // End private scope

/* $Id: message_core.js 1429 2007-07-13 10:38:15Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/locale/ja/message_core.js $ */
/*for JSLINT undef checks*/
/*extern DA */
/**
 * ja core message.
 */

/*
DA.locale.message.core = {
    // 'KEYWORD' : 'TEXT'
    STARTING                               : '起動中です...',
    STARTING_WARN                          : 'メール数が多いと、処理に時間が掛かる場合があります。',
    COPYRIGHT                              : 'DreamArts INSUITE&reg;Enterprise Copyright %1, DreamArts Corporation.',
    ADDRESS_SET_ERROR                      : 'アドレス情報が取得できませんでした。',
    BROWSER_ERROR                          : "ご使用のブラウザは、Ajaxメーラーのサポート対象ブラウザではありません。\nサポート対象ブラウザ(Internet Explorer 6.0)をご使用ください。",
    BROWSER_WARN                           : "ご使用のブラウザは、Ajaxメーラーのサポート対象ブラウザではありません。\nサポート対象ブラウザ(Internet Explorer 6.0)のご使用を推奨致します。",
    DEFAULT_FOLDER_TREE                    : '階層構造を<br>読み込み中です。<br><br>メール数が多いと、<br>処理に時間が掛かる<br>場合があります。',
    DEFAULT_MESSAGE_BODY                   : 'メールが選択されていません。',
    DIALOG_CANCEL_BUTTON                   : 'Cancel',
    DIALOG_ERROR                           : 'ダイアログの生成に失敗しました。',
    DIALOG_OK_BUTTON                       : 'OK',
    DIALOG_SETTING_BUTTON                  : '設定',
    EDITOR_CLOSE_CONFIRM                   : 'メール作成画面を閉じます。よろしいですか？',
    EDITOR_DIALOG_CHANGEEMAIL              : 'メールアドレスを入力してください。',
    EDITOR_DIALOG_RENAME                   : '名前を入力してください。',
    EDITOR_POPUPMENU_CHANGEEMAILCUSTOM     : '%1へ変更',
    EDITOR_POPUPMENU_CHANGEEMAIL           : 'メールアドレス変更',
    EDITOR_POPUPMENU_CHANGELANG            : '%1表記へ変更',
    EDITOR_POPUPMENU_CHANGELANG_ENGLISH    : '英語表記へ変更',
    EDITOR_POPUPMENU_CHANGELANG_VIEW       : '表示言語へ変更',
    EDITOR_POPUPMENU_MOVEBCC               : 'Ｂｃｃへ移動',
    EDITOR_POPUPMENU_MOVECC                : 'Ｃｃへ移動',
    EDITOR_POPUPMENU_MOVETO                : '宛先へ移動',
    EDITOR_POPUPMENU_OPENGROUP             : '所属ユーザに展開',
    EDITOR_POPUPMENU_RENAME                : '名前変更',
    EDITOR_POPUPMENU_TITLENAMEON           : '敬称を利用',
    EDITOR_POPUPMENU_TITLEOFF              : '敬称無し',
    EDITOR_POPUPMENU_TITLEON               : '役職を利用',
    EDITOR_TITLEEMPTY_SAVE_CONFIRM         : '件名が入力されていません。このまま保存しますか？',
    EDITOR_TITLEEMPTY_TRANSMIT_CONFIRM     : '件名が入力されていません。このまま送信しますか？',
    EXPORT_ERROR                           : 'エクスポートに失敗しました。',
    EXPORT_FILE_EMPTY                      : 'エクスポートに失敗しました。',
    EXPORT_OPERATING_PROMPT                : 'エクスポート処理中',
    FILTER_ERROR                           : 'フィルタが実行できませんでした。',
    FILTER_OPERATING_PROMPT                : 'フィルタ処理中',
    FOLDER_ADD_MENU                        : 'フォルダを追加',
    FOLDER_CLOSE_MENU                      : '下位を閉じる',
    FOLDER_CREATE_DIALOG                   : '作成するフォルダ名を入力して下さい。',
    FOLDER_CREATE_ERROR                    : 'フォルダを作成できませんでした。',
    FOLDER_DELETE_CONFIRM4PARENT           : "フォルダを削除します。下位のフォルダも削除されます。よろしいですか？\n［注意：メールも全て削除されます！元に戻すことはできません。］",
    FOLDER_DELETE_CONFIRM                  : "フォルダを削除します。よろしいですか？\n［注意：メールも全て削除されます！元に戻すことはできません。］",
    FOLDER_DELETE_ERROR                    : 'フォルダが削除できませんでした。',
    FOLDER_DELETE_MENU                     : '削除',
    FOLDER_EXPORT_MENU                     : 'エクスポート',
    FOLDER_FILTER_MENU                     : 'フィルタを実行',
    FOLDER_IMPORT_DIALOG                   : 'インポートファイルを指定して下さい。',
    FOLDER_IMPORTEML_CONFIRM               : '拡張子がemlではありません。よろしいですか？',
    FOLDER_IMPORT_MENU                     : 'インポート',
    FOLDER_MOVE_ERROR                      : 'フォルダを移動できませんでした。',
    FOLDER_NEXT_FID_ERROR                  : 'フォルダ番号が取得できませんでした。',
    FOLDER_OPEN_MENU                       : '下位を開く',
    FOLDER_REBUILD_CONFIRM                 : "メール情報を再構築します。メール数が多い場合は、\n処理に時間が掛かる場合があります。よろしいですか？",
    FOLDER_REBUILD_MENU                    : '再構築',
    FOLDER_RENAME_DIALOG                   : '変更するフォルダ名を入力して下さい。',
    FOLDER_RENAME_ERROR                    : 'フォルダ名が変更できませんでした。',
    FOLDER_RENAME_MENU                     : 'フォルダ名の変更',
    FOLDER_SELECT_ERROR                    : 'フォルダを選択できませんでした。',
    FOLDER_TREE_ERROR                      : 'フォルダツリーが生成できませんでした。',
    FOLDER_TREE_TITLE                      : 'フォルダ',
    GROUPINFO_ERROR                        : 'グループ情報の取得に失敗しました。',
    IMPORT_ERROR                           : 'インポートに失敗しました。',
    IMPORT_OPERATING_PROMPT                : 'インポート処理中',
    IMPORT_PATH_EMPTY                      : 'インポートファイルが指定されていません。',
    JSON_ERROR                             : 'サーバーと通信ができませんでした。',
    LOGOUT_ERROR_CONFIRM                   : '通信障害などで処理が終了できませんでした。強制終了しますか？',
    MAILER_CLOSE_CONFIRM                   : 'Ajaxメーラーを終了します。メーラーの全てのウィンドウを閉じてもよろしいですか？',
    MBOXGRID_COLUMNTITLE_ATTACHMENT        : '添付',
    MBOXGRID_COLUMNTITLE_DATE              : '送信日時',
    MBOXGRID_COLUMNTITLE_FLAGGED           : 'マーク',
    MBOXGRID_COLUMNTITLE_FROM              : '差出人',
    MBOXGRID_COLUMNTITLE_PRIORITY          : '重要度',
    MBOXGRID_COLUMNTITLE_SEEN              : '未読',
    MBOXGRID_COLUMNTITLE_SIZE              : 'サイズ',
    MBOXGRID_COLUMNTITLE_SUBJECT           : '件名',
    MBOXGRID_COLUMNTITLE_TO                : '宛先',
    MBOXGRID_KEYWORD_EMPTY                 : 'キーワードを入力してください。',
    MBOXGRID_LOADING                       : '読み込み中...',
    MBOXGRID_NOFOLDERSELECTED              : 'フォルダが選択されていません',
    MBOXGRID_NOMESSAGE                     : '表示可能なメールはありません。',
    MBOXGRID_ROWCONTEXTMENU_DELETE         : '削除',
    MBOXGRID_ROWCONTEXTMENU_EXPORT         : 'エクスポート',
    MBOXGRID_ROWCONTEXTMENU_FORWARD        : '転送',
    MBOXGRID_ROWCONTEXTMENU_MARKASREAD     : '既読にする',
    MBOXGRID_ROWCONTEXTMENU_MARKASUNREAD   : '未読にする',
    MBOXGRID_ROWCONTEXTMENU_OPEN           : '開く',
    MBOXGRID_ROWCONTEXTMENU_REPLYALL       : '全員に返信',
    MBOXGRID_ROWCONTEXTMENU_REPLY          : '返信',
    MBOXGRID_ROWCONTEXTMENU_RUNFILTER      : 'フィルタを実行',
    MBOXGRID_ROWCONTEXTMENU_SETMARK        : 'マークを付ける',
    MBOXGRID_ROWCONTEXTMENU_UNSETMARK      : 'マークを外す',
    MDN_ERROR                              : '開封通知が送信できませんでした。',
    MESSAGE_CHARSET_ISO2022JP              : '日本語のみ',
    MESSAGE_CHARSET_UTF8                   : '日本語以外の言語を含む',
    MESSAGE_CHECKBOXMESSAGE_GROUPNAME      : '宛先グループ名を本文に記載',
    MESSAGE_CHECKBOXMESSAGE_NOTIFICATION   : '開封通知を要求',
    MESSAGE_CHECKBOXMESSAGE_REPLYUSE       : '返信メールアドレスを使用する',
    MESSAGE_COLUMNTITLE_ATTACHMENTFILE     : '添付ファイル',
    MESSAGE_COLUMNTITLE_ATTACHMENT         : '添付',
    MESSAGE_COLUMNTITLE_BCC                : 'Bcc',
    MESSAGE_COLUMNTITLE_CC                 : 'Cc',
    MESSAGE_COLUMNTITLE_CHARSET            : '言語',
    MESSAGE_COLUMNTITLE_CONTENTTYPE        : '書式',
    MESSAGE_COLUMNTITLE_DATE               : '日付',
    MESSAGE_COLUMNTITLE_FROM               : '差出人',
    MESSAGE_COLUMNTITLE_OPTIONS            : '付加情報',
    MESSAGE_COLUMNTITLE_PRIORITY           : '重要度',
    MESSAGE_COLUMNTITLE_SIGN               : '署名',
    MESSAGE_COLUMNTITLE_SUBJECT            : '件名',
    MESSAGE_COLUMNTITLE_TO                 : '宛先',
    MESSAGE_CONTENTTYPE_HTML               : 'リッチテキスト',
    MESSAGE_CONTENTTYPE_TEXT               : 'テキスト',
    MESSAGE_DELETECOMPLETE_CONFIRM         : 'メールを削除します。削除されたメールは元に戻すことは出来ません。よろしいですか？',
    MESSAGE_DELETE_CONFIRM                 : 'メールを削除します。よろしいですか？',
    MESSAGE_DELETE_ERROR                   : 'メールが削除できませんでした。',
    MESSAGE_EDIT_ERROR                     : 'メールが編集できません。',
    MESSAGE_EXPORT_MENU                    : 'エクスポート',
    MESSAGE_HEADER_MENU                    : 'ヘッダ表示',
    MESSAGE_MDN_CONFIRM                    : '開封通知を要求されています。送信しますか？',
    MESSAGE_MDN_SENT                       : '開封通知を送信しました。',
    MESSAGE_NEW_MAKING                     : '新規作成',
    MESSAGE_PREVIEW_ERROR                  : 'プレビューが表示できません。',
    MESSAGE_PRIORITY_HIGH                  : '高い',
    MESSAGE_PRIORITY_LOW                   : '低い',
    MESSAGE_PRIORITY_NORMAL                : '通常',
    MESSAGE_REGIST_MENU                    : '%1に登録',
    MESSAGES                               : '%1通',
    MESSAGE_SAVE_ERROR                     : 'メールが保存できません。',
    MESSAGE_SIGN_ERROR                     : '署名が取得できません。',
    MESSAGES_NOUNSEEN_UNIT                 : '（%1件）',
    MESSAGES_UNSEEN_UNIT                   : '（%1件中未読：%2件）',
    MESSAGE_SWITCH_CONTENTTYPE_CONFIRM     : '書式情報が初期化されます。よろしいですか？',
    MESSAGE_TEMPLATE_CONFIRM               : '指定のテンプレートで上書きします。よろしいですか？',
    MESSAGE_TEMPLATE_ERROR                 : 'テンプレートが取得できません。',
    MESSAGE_TRANSMIT_ERROR                 : 'メールが送信できません。',
    MESSAGE_UNIT                           : '通',
    MESSAGE_VIEW_ERROR                     : 'メールが表示できません。',
    POPUP_TITLENAME_SEARCH                 : 'メール検索',
    QUOTE_00_TITLE                         : '引用（本文/添付）',
    QUOTE_01_TITLE                         : '引用（本文のみ）',
    QUOTE_02_TITLE                         : '引用（添付のみ）',
    QUOTE_10_TITLE                         : '引用符なし（本文/添付）',
    QUOTE_11_TITLE                         : '引用符なし（本文のみ）',
    QUOTE_99_TITLE                         : '引用しない',
    REBUILD_ERROR                          : '再構築に失敗しました。',
    REBUILD_OPERATING_PROMPT               : '再構築中',
    SAVE_MAIL_MESSAGE                      : '[%1]に保存しました。',
    SAVE_OPERATING_PROMPT                  : '保存中',
    SAVE_STATE_MESSAGE                     : '状態を保存しました。',
    SEARCH_BUTTON                          : '検　索',
    SEARCH_CHECKBOXMESSAGE_CLASS           : '指定したフォルダ以下すべてを含む',
    SEARCH_CHECKBOXMESSAGE_DELETED         : '削除済みメールも表示',
    SEARCH_CHECKBOXMESSAGE_TOSELF          : '自分宛のみ表示',
    SEARCH_COLUMNTITLE_FID                 : '対象フォルダ',
    SEARCH_COLUMNTITLE_FIELD               : '検索対象項目',
    SEARCH_COLUMNTITLE_KEYWORD             : '検索文字列',
    SEARCH_COLUMNTITLE_NORROWING           : '絞込み条件',
    SEARCH_COLUMNTITLE_TOTAL               : '検索結果',
    SEARCH_ERROR                           : '検索に失敗しました。',
    SEARCH_KEYWORD_EMPTY                   : 'キーワードを入力してください。',
    SEARCH_MESSAGE_GUIDE                   : 'キーワードはスペースで区切って入力してください。 大文字、小文字の区別はありません。',
    SEARCH_NOMATCH                         : '条件に一致するメールはありません。',
    SEARCH_OPERATING_PROMPT                : '検索中',
    SEARCH_OPTIONNAME_COND_AND             : '全ての語を含む',
    SEARCH_OPTIONNAME_COND_OR              : 'いずれかの語を含む',
    SEARCH_OPTIONNAME_FIELD_BCC            : 'Ｂｃｃ',
    SEARCH_OPTIONNAME_FIELD_BODY           : '本文',
    SEARCH_OPTIONNAME_FIELD_CC             : 'Ｃｃ',
    SEARCH_OPTIONNAME_FIELD_FROM           : '差出人',
    SEARCH_OPTIONNAME_FIELD_GROUP          : 'グループ',
    SEARCH_OPTIONNAME_FIELD_SUBJECT        : '件名',
    SEARCH_OPTIONNAME_FIELD_TEXT           : 'ヘッダまたは本文',
    SEARCH_OPTIONNAME_FIELD_TO             : '宛先',
    SEARCH_OVER_WARN                       : '検索結果が%1件を超えました。処理を中断します。',
    SEARCH_RADIONAME_ATTACHMENT_ALL        : '全て',
    SEARCH_RADIONAME_ATTACHMENT_EXISTS     : '添付あり',
    SEARCH_RADIONAME_ATTACHMENT_NOEXISTS   : '添付なし',
    SEARCH_RADIONAME_ATTACHMENT            : '添付',
    SEARCH_RADIONAME_ETC                   : 'その他',
    SEARCH_RADIONAME_FLAGGED               : 'マーク',
    SEARCH_RADIONAME_FLAGGED_ALL           : '全て',
    SEARCH_RADIONAME_FLAGGED_FLAGGED       : 'マークあり',
    SEARCH_RADIONAME_FLAGGED_UNFLAGGED     : 'マークなし',
    SEARCH_RADIONAME_PRIORITY_ALL          : '全て',
    SEARCH_RADIONAME_PRIORITY_HIGH         : '高い',
    SEARCH_RADIONAME_PRIORITY_LOW          : '低い',
    SEARCH_RADIONAME_PRIORITY_NORMAL       : '通常',
    SEARCH_RADIONAME_PRIORITY              : '重要度',
    SEARCH_RADIONAME_SEEN_ALL              : '全て',
    SEARCH_RADIONAME_SEEN_SEEN             : '既読',
    SEARCH_RADIONAME_SEEN_UNSEEN           : '未読',
    SEARCH_RADIONAME_SEEN                  : '既読',
    SET_BUTTON                             : '設定',
    SIMPLESEARCH_MENUTITLE_ADVANCE         : '詳細検索',
    SIMPLESEARCH_MENUTITLE_FROM            : '差出人検索',
    SIMPLESEARCH_MENUTITLE_SUBJECT         : '件名検索',
    SIMPLESEARCH_MENUTITLE_TO              : '宛先検索',
    SPAM                                   : 'SPAM',
    STORAGE_UNIT                           : 'KB',
    TOPMENU43PANE_DELETE_TITLE             : '削除',
    TOPMENU43PANE_FORWARD_TITLE            : '転送',
    TOPMENU43PANE_GUIDE_TITLE              : 'ガイド',
    TOPMENU43PANE_MAKE_TITLE               : '作成',
    TOPMENU43PANE_REPLYALL_TITLE           : '全員に返信',
    TOPMENU43PANE_REPLY_TITLE              : '返信',
    TOPMENU43PANE_SETTING_TITLE            : '設定',
    TOPMENU43PANE_STATE_TITLE              : '状態保存',
    TOPMENU4EDITOR_BACK_TITLE              : '戻る',
    TOPMENU4EDITOR_PREVIEW_TITLE           : 'プレビュー',
    TOPMENU4EDITOR_SAVE_TITLE              : '保存',
    TOPMENU4EDITOR_TEMPLATE_TITLE          : 'テンプレート',
    TOPMENU4EDITOR_TRANSMIT_TITLE          : '送信',
    TOPMENU4VIEWER_DELETE_TITLE            : '削除',
    TOPMENU4VIEWER_EDIT_TITLE              : '編集',
    TOPMENU4VIEWER_FILTER_TITLE            : 'フィルタ',
    TOPMENU4VIEWER_FORWARD_TITLE           : '転送',
    TOPMENU4VIEWER_NEXT_TITLE              : '後へ',
    TOPMENU4VIEWER_OPTION_TITLE            : 'オプション',
    TOPMENU4VIEWER_PREV_TITLE              : '前へ',
    TOPMENU4VIEWER_PRINT_TITLE             : '印刷',
    TOPMENU4VIEWER_REPLYALL_TITLE          : '全員に返信',
    TOPMENU4VIEWER_REPLY_TITLE             : '返信',
    TOPMENU_CLOSE_TITLE                    : '閉じる',
    TRANSMIT_MAIL_MESSAGE                  : '送信が完了しました。',
    TRANSMIT_OPERATING_PROMPT              : '送信中',
    TRASH_ERROR                            : '削除できませんでした。',
    TRASH                                  : 'ごみ箱',
    UPLOAD_ERROR                           : 'ファイルのアップロードに失敗しました。',
    USERINFO_ERROR                         : 'ユーザ情報の取得に失敗しました。',
    WASTE_TRASH_CONFIRM                    : '[%1]を空にします。よろしいですか？',
    WASTE_TRASH_MENU                       : '[%1]を空にする',
    WINDOW_SIZE_WARN                       : 'ウィンドウサイズ小さすぎるため、ウィンドウサイズを変更します。'

};
*/

DA.locale.message.core = window.messageCore;
/* $Id: message_custom.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/locale/en/message_custom.js $ */
/*for JSLINT undef checks*/
/*extern DA */
/**
 * en custom message.
 */

DA.locale.message.custom = {
    // 'KEYWORD' : 'TEXT'
};

/* $Id: title.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/toppanel/title.js $ */
/*for JSLINT undef checks*/
/*extern DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/

 if (!DA || !DA.mailer || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}


if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Builds a Top panel for message viewer. 
 * 
 * Usage: 
 *   var tpc = new DA.mailer.TopTitleController();
 * 
 * @class TopTitleController
 * @uses 
 * @constructor
 * Todo: message
 */
DA.widget.TopTitleController = function(panelNode, menuNode, title) {
	this.panelId   = panelNode.id;
    this.panelNode = panelNode;
    this.menuNode  = menuNode;
	this.title     = title;
    this.init();
};

/**
 * Members
 */
DA.widget.TopTitleController.prototype = {
    
    panelId: null,
    
    panelNode: null,
    
    menuNode: null,
    
    panelMenu: null,

    panelImages: {
        left   : DA.vars.clrRdir + "/maildetails_s_bg.gif",
        center : DA.vars.clrRdir + "/maildetails_s_bg.gif",
        right  : DA.vars.clrRdir + "/maildetails_s_bg.gif"
    },
    
    menuData: {
        leftOrder: [],
        rightOrder: ['logo'],
        items: {
            logo: {
                title       : '',
                alt         : '',
                smallIcon   : DA.vars.clrRdir + "/maildetails_s_logo.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_s_logo.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_s_logo.gif",
                className   : 'da_titleMenuItemLogo',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            }
        },
        className: 'da_titleMenu'
    },
    
    init: function(){
        var html = '<div id="' + this.panelId + '_TPC" class="da_topTitle">' +
                   '<div id="' + this.panelId + '_TPCL" class="da_topTitleLeft" style="background-image:url(' + this.panelImages.left + ')">' +
                   '<div class="da_topTitleLeftDiv">' + DA.imageLoader.tag(this.title.icon) + this.title.name+ '</div>' +
                   '</div>' + 
                   '<div id="' + this.panelId + '_TPCC" class="da_topTitleCenter" style="background-image:url(' + this.panelImages.center + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCR" class="da_topTitleRight" style="background-image:url(' + this.panelImages.right + ')"></div>' +
                   '</div>';

        this.panelNode.innerHTML = html;
        
        this.panelMenu = new DA.widget.PanelMenuController(this.menuNode, this.menuData);
    }
};

/* $Id: message_custom.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/locale/ja/message_custom.js $ */
/*for JSLINT undef checks*/
/*extern DA */
/**
 * ja custom message.
 */

DA.locale.message.custom = {
    // 'KEYWORD' : 'TEXT'
};

/* $Id: searchbox.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/misc/searchbox.js $ */
/*for JSLINT undef checks*/
/*extern DA Prototype YAHOO */
/* 
 * Copyright (c) 2007, DreamArts. All rights reserved. 
 * TODO: message 
 * version: ?? 
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
 * @class SearchBox
 * @constructor 
 * @param field   {HTMLSpanElement}
 * @param textBox {HTMLTextInputElement}
 * @param button  {HTMLButtonElement}
 * @param button  {Object} An instance of a DA button widget // TODO:
 */
DA.widget.SearchBox = function(field, textBox, button, menuData) {

    this.field   = field;
    this.textBox = textBox; // TODO: check these
    this.button  = button;
    this.icon    = document.createElement('img');
    this.select  = document.createElement('span');
    this.arrow   = document.createElement('img');
    
    this.icon.src  = DA.vars.imgRdir + '/ico_mail_search.gif';
    this.arrow.src = DA.vars.imgRdir + '/ico_mail_arrow.gif';
    this.arrow.id  = 'da_searchBox_arrow';
    this.arrow.style.cursor = 'pointer';
    
    this.field.appendChild(this.icon);
    this.field.appendChild(this.select);
    this.field.appendChild(this.arrow);
    
    this.button.onclick    = this._buttonClicked.bindAsEventListener(this);
    this.textBox.onkeyup   = this._handleKeyUp.bindAsEventListener(this);
    this.textBox.onkeydown = this._handleKeyDown.bindAsEventListener(this);
    
    this.onSearch = new YAHOO.util.CustomEvent("onSearch");
    
    this.menu = new DA.widget.PulldownMenuController("da_searchBox", this.arrow, menuData, {
        onTrigger: function(e) {
            var srcElem = YAHOO.util.Event.getTarget(e);
            
            if (!srcElem || !srcElem.id) { 
                return false; 
            }
            
            var srcId = srcElem.id;
            
            if (!srcId.match(/^da\_searchBox\_arrow$/)) {
                return false;
            }
            
            return true;
        }
    });
    
};

DA.widget.SearchBox.prototype = {

    _buttonClicked: function() {
        
        var conditions = this.getConditions();

        this.onSearch.fire({
            text:       this.textBox.value,
            conditions: conditions
        });
    },

    _handleKeyUp: function() {
        var value = this.textBox.value;
        // TODO: This was commented out for bug: 915268
        /*
        if (value && value !== "") {
            this.button.disabled = false;
        } else {
            this.button.disabled = true;
        }
        */
    },

    _handleKeyDown: function(e) {
        var charCode = YAHOO.util.Event.getCharCode(e);
        if (charCode === 13) { // Enter
            this._buttonClicked();
        }
    },

    getConditions: function() {
        return {};
    },
    
    changeField: function() {
    },

    reset: function () {
        this.textBox.value = '';
    }
    
};

/* $Id: editor.js 2467 2014-09-16 11:12:09Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/toppanel/editor.js $ */
/*jslint evil: true */
/*for JSLINT undef checks*/
/*extern DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.mailer || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Builds a Top panel for message editor. 
 * 
 * Usage: 
 *   var tpc = new DA.mailer.TopPanelController4Editor();
 * 
 * @class TopPanelController4Editor
 * @uses 
 * @constructor
 * Todo: message
 */
DA.mailer.TopPanelController4Editor = function(panelNode, menuNode, query) {
	this.panelId   = panelNode.id;
    this.panelNode = panelNode;
    this.menuNode  = menuNode;
    
    if (DA.vars.custom.editor.setTopPanel) {
        eval(DA.vars.custom.editor.setTopPanel);
    }
    
    this.init(query);
};

/**
 * Members
 */
DA.mailer.TopPanelController4Editor.prototype = {
    
    panelId: null,
    
    panelNode: null,
    
    menuNode: null,
    
    panelMenu: null,

    panelImages: {
        left   : DA.vars.imgRdir + "/null.gif",
        center : DA.vars.clrRdir + "/mail_pop_back.gif",
        right  : DA.vars.imgRdir + "/null.gif"
    },
    
    menuData: {
        leftOrder: ['transmit', 'save', 'template', 'preview', 'spellcheck' ,'back','print'],
        rightOrder: ['popy', 'close'],
        items: {
            transmit: {
                title       : DA.locale.GetText.t_('TOPMENU4EDITOR_TRANSMIT_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4EDITOR_TRANSMIT_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_transmit_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_transmit_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_transmit_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            save: {
                title       : DA.locale.GetText.t_('TOPMENU4EDITOR_SAVE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4EDITOR_SAVE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_save_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_save_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_save_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            template: {
                title       : DA.locale.GetText.t_('TOPMENU4EDITOR_TEMPLATE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4EDITOR_TEMPLATE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_template_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_template_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_template_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : null,
                pulldown    : null
            },            
            preview: {
                title       : DA.locale.GetText.t_('TOPMENU4EDITOR_PREVIEW_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4EDITOR_PREVIEW_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_preview_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_preview_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_preview_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            spellcheck: {
                title       : DA.locale.GetText.t_('SPELL_CHECK_BUTTON'),
                alt         : DA.locale.GetText.t_('SPELL_CHECK_BUTTON'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_preview_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_preview_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_preview_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            back: {
                title       : DA.locale.GetText.t_('TOPMENU4EDITOR_BACK_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4EDITOR_BACK_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_edit_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_edit_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_edit_dis.gif",
                className   : 'da_panelMenu4EditorItemLeft',
                hidden      : 1,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
          },
          print:{
                title       :DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),
                alt         :DA.locale.GetText.t_("TOPMENU4VIEWER_PRINT_TITLE"),
                smallIcon   :DA.vars.clrRdir+"/maildetails_print_s.gif",
                bigIcon     :DA.vars.clrRdir+"/maildetails_print_b.gif",
                disableIcon :DA.vars.clrRdir+"/maildetails_print_dis.gif",
                className   :'da_panelMenu4EditorItemLeft',
                hidden      :0,
                disable     :1,
                onSelect    :Prototype.emptyFunction,
                pulldown    :null
          },
            close: {
                title       : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_close_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_close_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_close_dis.gif",
                className   : 'da_panelMenu4EditorItemRight',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            popy: {
                title       : '',
                alt         : '',
                smallIcon   : DA.vars.clrRdir + "/maildetails_popy.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_popy.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_popy.gif",
                className   : 'da_panelMenu4EditorItemPopy',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            }
        },
        className: 'da_panelMenu4Editor'
    },
    
    init: function(query) {
    	//テンプレート
        var i;
        var clrRdir = DA.vars.clrRdir;
        if(!DA.util.isEmpty(query.backup_org_clrRdir)) {
            clrRdir = query.backup_org_clrRdir;
        }
        this.panelImages.center = clrRdir + "/mail_pop_back.gif";
        this.menuData.items.transmit.smallIcon = clrRdir + "/maildetails_transmit_s.gif";
        this.menuData.items.transmit.bigIcon = clrRdir + "/maildetails_transmit_b.gif";
        this.menuData.items.transmit.disableIcon = clrRdir + "/maildetails_transmit_dis.gif";

        this.menuData.items.save.smallIcon = clrRdir + "/maildetails_save_s.gif";
        this.menuData.items.save.bigIcon = clrRdir + "/maildetails_save_b.gif";
        this.menuData.items.save.disableIcon = clrRdir + "/maildetails_save_dis.gif";

        this.menuData.items.template.smallIcon = clrRdir + "/maildetails_template_s.gif";
        this.menuData.items.template.bigIcon = clrRdir + "/maildetails_template_b.gif";
        this.menuData.items.template.disableIcon = clrRdir + "/maildetails_template_dis.gif";

        this.menuData.items.preview.smallIcon = clrRdir + "/maildetails_preview_s.gif";
        this.menuData.items.preview.bigIcon = clrRdir + "/maildetails_preview_b.gif";
        this.menuData.items.preview.disableIcon = clrRdir + "/maildetails_preview_dis.gif";

        this.menuData.items.spellcheck.smallIcon = clrRdir + "/maildetails_preview_s.gif";
        this.menuData.items.spellcheck.bigIcon = clrRdir + "/maildetails_preview_b.gif";
        this.menuData.items.spellcheck.disableIcon = clrRdir + "/maildetails_preview_dis.gif";

        this.menuData.items.back.smallIcon = clrRdir + "/maildetails_edit_s.gif";
        this.menuData.items.back.bigIcon = clrRdir + "/maildetails_edit_b.gif";
        this.menuData.items.back.disableIcon = clrRdir + "/maildetails_edit_dis.gif";

        this.menuData.items.print.smallIcon = clrRdir + "/maildetails_print_s.gif";
        this.menuData.items.print.bigIcon = clrRdir + "/maildetails_print_b.gif";
        this.menuData.items.print.disableIcon = clrRdir + "/maildetails_print_dis.gif";

        this.menuData.items.close.smallIcon = clrRdir + "/maildetails_close_s.gif";
        this.menuData.items.close.bigIcon = clrRdir + "/maildetails_close_b.gif";
        this.menuData.items.close.disableIcon = clrRdir + "/maildetails_close_dis.gif";

        this.menuData.items.popy.smallIcon = clrRdir + "/maildetails_popy.gif";
        this.menuData.items.popy.bigIcon = clrRdir + "/maildetails_popy.gif";
        this.menuData.items.popy.disableIcon = clrRdir + "/maildetails_popy.gif";

        var template = this.menuData.items.template;
        var preview = this.menuData.items.preview;
        var spellcheck = this.menuData.items.spellcheck;
        var transmit = this.menuData.items.transmit;
        var print = this.menuData.items.print;
        
        if (DA.vars.config.template && DA.vars.config.template.length > 0) {
            template.pulldown = {};
            template.pulldown.className = 'da_topPanel4EditorPulldownMenu';
            if(DA.vars.config.template.length > 10){
            	YAHOO.util.Dom.addClass(template.pulldown, 'da_topPanel4EditorPulldownMenu2');
            }
            template.pulldown.order = [];
            template.pulldown.order[0] = [];
            template.pulldown.items = {};
            
            for (i = 0; i < DA.vars.config.template.length; i ++) {
                template.pulldown.order[0].push(i);
                template.pulldown.items[i] = {
                    text: DA.vars.config.template[i].name,
                    onclick: Prototype.emptyFunction,
                    args: [DA.vars.config.template[i].tid]
                };
            }
        } else {
            template.disable = 1;
        }
		if (DA.vars.config.spellcheck) {
	        //プレビュー
	        preview.pulldown = {};
	        preview.pulldown.className = 'da_topPanel4EditorPulldownMenu';
	        preview.pulldown.order = [];
	        preview.pulldown.order[0] = ['0','1'];
	        preview.pulldown.items = {};
	        preview.pulldown.items[0] = {
	        	text: DA.locale.GetText.t_('SPELLCHECK'),
	        	onclick: Prototype.emptyFunction,
	        	args: [1, 'preview']
	        };
	        preview.pulldown.items[1] = {
	        	text: DA.locale.GetText.t_('SPELLCHECK_NO'),
	        	onclick: Prototype.emptyFunction,
	        	args: [0, 'preview']
	        };
        
	        //送信
	        transmit.pulldown = {};
	        transmit.pulldown.className = 'da_topPanel4EditorPulldownMenu';
	        transmit.pulldown.order = [];
	        transmit.pulldown.order[0] = ['0','1'];
	        transmit.pulldown.items = {};
	        transmit.pulldown.items[0] = {
	        	text: DA.locale.GetText.t_('SPELLCHECK'),
	        	onclick: Prototype.emptyFunction,
	        	args: [1, 'transmit']
	        };
	        transmit.pulldown.items[1] = {
	        	text: DA.locale.GetText.t_('SPELLCHECK_NO'),
	        	onclick: Prototype.emptyFunction,
	        	args: [0, 'transmit']
	        };
	    }
        if (DA.vars.system.spellcheck_button_visible && DA.vars.config.spellcheck) {
            spellcheck.disable = 0;
        } else {
            spellcheck.hidden = 1;
        }

        // 印刷
        print.pulldown = {};
        print.pulldown.className = 'da_topPanel43PanePulldownMenu';
        print.pulldown.order = [];
        print.pulldown.order[0] = ['0', '1'];
        print.pulldown.items = {};
        print.pulldown.items[0] = {
            text: DA.locale.GetText.t_('PRINT_WITH_TO'),
            onclick: Prototype.emptyFunction,
            args: ['on','printtoconfig']
        };
        print.pulldown.items[1] = {
            text: DA.locale.GetText.t_('PRINT_WITHOUT_TO'),
            onclick: Prototype.emptyFunction,
            args: ['off','printtoconfig']
        };

        var html = '<div id="' + this.panelId + '_TPC" class="da_topPanel4Editor">' +
                   '<div id="' + this.panelId + '_TPCL" class="da_topPanel4EditorLeft" style="background-image:url(' + this.panelImages.left + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCR" class="da_topPanel4EditorRight" style="background-image:url(' + this.panelImages.right + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCC" class="da_topPanel4EditorCenter" style="background-image:url(' + this.panelImages.center + ')"></div>' +
                   '</div>';
        
        this.panelNode.innerHTML = html;
        
        this.panelMenu = new DA.widget.PanelMenuController(this.menuNode, this.menuData);
    },
    
    setFunction: function(editor) {
        var me = this;
        var key;

        DA.customEvent.fire('topPanelController4EditorSetFunctionBefore', this, {
            editor: editor
        });
        
        this.menuData.items.transmit.onSelect = function() {
            editor.transmit();
        };
        this.menuData.items.save.onSelect = function() {
            editor.save();
        };
        this.menuData.items.preview.onSelect = function() {
            editor.preview();
        };
        this.menuData.items.spellcheck.onSelect = function(){
            editor.spellcheck( 1 , "preview");
        };
        this.menuData.items.back.onSelect = function() {
            editor.back();
        };
        this.menuData.items.close.onSelect = function() {
            if(DA.util.confirm(DA.locale.GetText.t_("EDITOR_CLOSE_CONFIRM"))){
                DA.windowController.allClose();
                editor.close();
            }
		};
        this.menuData.items.print.onSelect=function(){
			editor.print(null);
		};
        if (this.menuData.items.template.pulldown) {
            for (key in this.menuData.items.template.pulldown.items) {
                if (key.match(/^\d+$/)) {
                    this.menuData.items.template.pulldown.items[key].onclick = function(e, a) {
                        editor.template(a[0]);
                    };
                }
            }
        }
        if (this.menuData.items.preview.pulldown) {
            for (key in this.menuData.items.preview.pulldown.items) {
                if (key.match(/^\d+$/)) {
                    this.menuData.items.preview.pulldown.items[key].onclick = function(e, a) {
                        editor.spellcheck(a[0],a[1]);
                    };
                }
            }
        }
        if (this.menuData.items.transmit.pulldown) {
            for (key in this.menuData.items.transmit.pulldown.items) {
                if (key.match(/^\d+$/)) {
                    this.menuData.items.transmit.pulldown.items[key].onclick = function(e, a) {
                        editor.spellcheck(a[0],a[1]);
                    };
                }
            }
        }
        for (key in this.menuData.items.print.pulldown.items) {
            if (key.match(/^\d+$/)) {
                this.menuData.items.print.pulldown.items[key].onclick = function(e, a) {
                    editor.print(a[0]);
                };
            }
        }
        
        DA.customEvent.fire('topPanelController4EditorSetFunctionAfter', this, {
            editor: editor
        });
    }
};
/* $Id: viewer.js 2478 2014-09-22 06:07:40Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/toppanel/viewer.js $ */
/*for JSLINT undef checks*/
/*extern DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.mailer || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Builds a Top panel for message viewer. 
 * 
 * Usage: 
 *   var tpc = new DA.mailer.TopPanelController4Viewer();
 * 
 * @class TopPanelController4Viewer
 * @uses 
 * @constructor
 * Todo: message
 */
DA.mailer.TopPanelController4Viewer = function(panelNode, menuNode) {
    this.panelId   = panelNode.id;
    this.panelNode = panelNode;
    this.menuNode  = menuNode;
    
    if (DA.vars.custom.viewer.setTopPanel) {
        eval(DA.vars.custom.viewer.setTopPanel);
    }
    
    this.init();
};

/**
 * Members
 */
DA.mailer.TopPanelController4Viewer.prototype = {
    
    panelId: null,
    
    panelNode: null,
    
    menuNode: null,
    
    panelMenu: null,

    panelImages: {
        left   : DA.vars.imgRdir + "/null.gif",
        center : DA.vars.clrRdir + "/mail_pop_back.gif",
        right  : DA.vars.imgRdir + "/null.gif"
    },
    
    menuData: {
        leftOrder: ['edit', 'reply', 'replyall', 'forward', 'delete', 'print', 'filter', 'prev', 'next', 'option'],
        rightOrder: ['popy', 'close'],
        items: {
            edit: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_EDIT_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_EDIT_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_edit_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_edit_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_edit_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 1,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            reply: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_REPLY_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_REPLY_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_reply_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_reply_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_reply_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            replyall: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_REPLYALL_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_REPLYALL_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_replyall_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_replyall_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_replyall_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            forward: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_FORWARD_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_FORWARD_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_forward_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_forward_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_forward_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            'delete': {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_DELETE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_DELETE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_delete_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_delete_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_delete_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            print: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_PRINT_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_PRINT_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_print_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_print_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_print_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            filter: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_FILTER_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_FILTER_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_filter_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_filter_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_filter_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            prev: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_PREV_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_PREV_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_back_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_back_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_back_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            next: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_NEXT_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_NEXT_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_next_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_next_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_next_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            option: {
                title       : DA.locale.GetText.t_('TOPMENU4VIEWER_OPTION_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU4VIEWER_OPTION_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_option_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_option_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_option_dis.gif",
                className   : 'da_panelMenu4ViewerItemLeft',
                hidden      : 0,
                disable     : 0,
                onSelect    : null,
                pulldown    : {
                    order: [['header', 'export', 'savetolib', 'saveattachestolib', 'sales']],
                    items: {
                        header: {
                            text: DA.locale.GetText.t_('MESSAGE_HEADER_MENU'),
                            onclick: Prototype.emptyFunction
                        },
                        'export': {
                            text: DA.locale.GetText.t_('MESSAGE_EXPORT_MENU'),
                            onclick: Prototype.emptyFunction
                        },
                        savetolib: {
                            text: DA.locale.GetText.t_('MESSAGE_SAVETOLIB_MENU'),
                            onclick: Prototype.emptyFunction,
                            hidden: (DA.vars.config.save_to_lib === 0) ? 1 : 0
                        },
                        saveattachestolib: {
                            text: DA.locale.GetText.t_('MESSAGE_SAVEATTACHESTOLIBOPTION_MENU'),
                            onclick: Prototype.emptyFunction
                        },
                        sales: {
                            text: DA.locale.GetText.t_('MESSAGE_REGIST_MENU', DA.vars.hibiki.sales.name),
                            onclick: Prototype.emptyFunction,
                            hidden: (DA.vars.license.hibiki_sales === 1 && DA.vars.system.sales_datalink_enable !== 'off') ? 0 : 1
                        }
                    },
                    className: 'da_topPanel4ViewerPulldownMenu'
                }
            },
            close: {
                title       : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/maildetails_close_s.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_close_b.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_close_dis.gif",
                className   : 'da_panelMenu4ViewerItemRight',
                hidden      : 0,
                disable     : 0,
                onSelect    : function() {
                    DA.windowController.allClose();
                    window.close();
                },
                pulldown    : null
            },
            popy: {
                title       : '',
                alt         : '',
                smallIcon   : DA.vars.clrRdir + "/maildetails_popy.gif",
                bigIcon     : DA.vars.clrRdir + "/maildetails_popy.gif",
                disableIcon : DA.vars.clrRdir + "/maildetails_popy.gif",
                className   : 'da_panelMenu4ViewerItemPopy',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            }
        },
        className: 'da_panelMenu4Viewer'
    },
    
    init: function() {
        var reply    = this.menuData.items.reply;
        var replyall = this.menuData.items.replyall;
        var forward  = this.menuData.items.forward;
        var print    = this.menuData.items.print;
        
        // 返信
        reply.pulldown = {};
        reply.pulldown.className = 'da_topPanel4ViewerPulldownMenu';
        reply.pulldown.order = [];
        reply.pulldown.order[0] = ['0', '1', '2'];
        reply.pulldown.items = {};
        reply.pulldown.items[0] = {
            text: DA.locale.GetText.t_('QUOTE_01_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['01'],
            selected: (DA.vars.config.quote_reply === '01') ? true : false
        };
        reply.pulldown.items[1] = {
            text: DA.locale.GetText.t_('QUOTE_11_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['11'],
            selected: (DA.vars.config.quote_reply === '11') ? true : false
        };
        reply.pulldown.items[2] = {
            text: DA.locale.GetText.t_('QUOTE_99_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['99'],
            selected: (DA.vars.config.quote_reply === '99') ? true : false
        };
        
        // 全員に返信
        replyall.pulldown = {};
        replyall.pulldown.className = 'da_topPanel4ViewerPulldownMenu';
        replyall.pulldown.order = [];
        replyall.pulldown.order[0] = ['0', '1', '2'];
        replyall.pulldown.items = {};
        replyall.pulldown.items[0] = {
            text: DA.locale.GetText.t_('QUOTE_01_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['01'],
            selected: (DA.vars.config.quote_reply === '01') ? true : false
        };
        replyall.pulldown.items[1] = {
            text: DA.locale.GetText.t_('QUOTE_11_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['11'],
            selected: (DA.vars.config.quote_reply === '11') ? true : false
        };
        replyall.pulldown.items[2] = {
            text: DA.locale.GetText.t_('QUOTE_99_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['99'],
            selected: (DA.vars.config.quote_reply === '99') ? true : false
        };
        
        // 転送
        forward.pulldown = {};
        forward.pulldown.className = 'da_topPanel4ViewerPulldownMenu';
        forward.pulldown.order = [];
        forward.pulldown.order[0] = ['0', '1', '2', '3', '4', '5'];
        forward.pulldown.items = {};
        forward.pulldown.items[0] = {
            text: DA.locale.GetText.t_('QUOTE_00_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['00'],
            selected: (DA.vars.config.quote_forward === '00') ? true : false
        };
        forward.pulldown.items[1] = {
            text: DA.locale.GetText.t_('QUOTE_01_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['01'],
            selected: (DA.vars.config.quote_forward === '01') ? true : false
        };
        forward.pulldown.items[2] = {
            text: DA.locale.GetText.t_('QUOTE_02_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['02'],
            selected: (DA.vars.config.quote_forward === '02') ? true : false
        };
        forward.pulldown.items[3] = {
            text: DA.locale.GetText.t_('QUOTE_10_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['10'],
            selected: (DA.vars.config.quote_forward === '10') ? true : false
        };
        forward.pulldown.items[4] = {
            text: DA.locale.GetText.t_('QUOTE_11_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['11'],
            selected: (DA.vars.config.quote_forward === '11') ? true : false
        };
        forward.pulldown.items[5] = {
            text: DA.locale.GetText.t_('QUOTE_99_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['99'],
            selected: (DA.vars.config.quote_forward === '99') ? true : false
        };

        // 印刷
        print.pulldown = {};
        print.pulldown.className = 'da_topPanel43PanePulldownMenu';
        print.pulldown.order = [];
        print.pulldown.order[0] = ['0', '1'];
        print.pulldown.items = {};
        print.pulldown.items[0] = {
            text: DA.locale.GetText.t_('PRINT_WITH_TO'),
            onclick: Prototype.emptyFunction,
            args: ['on','printtoconfig']
        };
        print.pulldown.items[1] = {
            text: DA.locale.GetText.t_('PRINT_WITHOUT_TO'),
            onclick: Prototype.emptyFunction,
            args: ['off','printtoconfig']
        };

        
        var html = '<div id="' + this.panelId + '_TPC" class="da_topPanel4Viewer">' +
                   '<div id="' + this.panelId + '_TPCL" class="da_topPanel4ViewerLeft" style="background-image:url(' + this.panelImages.left + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCR" class="da_topPanel4ViewerRight" style="background-image:url(' + this.panelImages.right + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCC" class="da_topPanel4ViewerCenter" style="background-image:url(' + this.panelImages.center + ')"></div>' +
                   '</div>';
        
        this.panelNode.innerHTML = html;
                
        // CustomEvent              
        DA.customEvent.fire("TopPanelController4ViewerInitAfter", this, {               
                                                                                        reply: reply,               
                                                                                        replyall: replyall,             
                                                                                        forward: forward                
        });             

        this.panelMenu = new DA.widget.PanelMenuController(this.menuNode, this.menuData);
    },
    
    setFunction: function(viewer) {
        var key;
        
        if (viewer.selectMessageEditable) {
            this.panelMenu.show('edit');
        } else {
            this.panelMenu.hide('edit');
        }
        if (viewer.selectMessageExportable) {
            this.menuData.items.option.pulldownMenu.enabled('export');
        } else {
            this.menuData.items.option.pulldownMenu.disabled('export');
        }
        this.menuData.items.edit.onSelect = function() {
            viewer.edit();
        };
        this.menuData.items.reply.onSelect = function() {
            viewer.reply();
        };
        this.menuData.items.replyall.onSelect = function() {
            viewer.replyall();
        };
        this.menuData.items.forward.onSelect = function() {
            viewer.forward();
        };
        this.menuData.items['delete'].onSelect = function() {
            viewer['delete']();
        };
        this.menuData.items.print.onSelect = function() {
            viewer.print(null);
        };
        this.menuData.items.filter.onSelect = function() {
            viewer.filter();
        };
        this.menuData.items.prev.onSelect = function() {
            viewer.prev();
        };
        this.menuData.items.next.onSelect = function() {
            viewer.next();
        };
        this.menuData.items.option.pulldown.items.header.onclick = function() {
            viewer.header();
        };
        this.menuData.items.option.pulldown.items['export'].onclick = function() {
            viewer['export']();
        };
        this.menuData.items.option.pulldown.items.sales.onclick = function() {
            viewer.sales();
        };
        this.menuData.items.option.pulldown.items.savetolib.onclick = function() {
            viewer.savetolib();
        };
        this.menuData.items.option.pulldown.items.saveattachestolib.onclick = function(e) {
            viewer.showsaveattachestolibdialog(e.clientX,e.clientY);
        };
        if (viewer.getattachesnum() > 0) {
            this.menuData.items.option.pulldown.items.saveattachestolib.hidden = 0;
        } else {
            this.menuData.items.option.pulldown.items.saveattachestolib.hidden = 1;
        }

        var reply    = this.menuData.items.reply;
        var replyall = this.menuData.items.replyall;
        var forward  = this.menuData.items.forward;
        var print    = this.menuData.items.print;
        for (key in reply.pulldown.items) {
            if (key.match(/^\d+$/)) {
                reply.pulldown.items[key].onclick = function(e, a) {
                    viewer.reply(a[0]);
                };
            }
        }
        for (key in replyall.pulldown.items) {
            if (key.match(/^\d+$/)) {
                replyall.pulldown.items[key].onclick = function(e, a) {
                    viewer.replyall(a[0]);
                };
            }
        }
        for (key in forward.pulldown.items) {
            if (key.match(/^\d+$/)) {
                forward.pulldown.items[key].onclick = function(e, a) {
                    viewer.forward(a[0]);
                };
            }
        }
        for (key in print.pulldown.items) {
            if (key.match(/^\d+$/)) {
                print.pulldown.items[key].onclick = function(e, a) {
                    viewer.print(a[0]);
                };
            }
        }

        // CustomEvent              
        DA.customEvent.fire("TopPanelController4ViewerSetFunctionAfter", this, {                
                                                                                        viewer: viewer,             
                                                                                        reply: reply,               
                                                                                        replyall: replyall,             
                                                                                        forward: forward    			
        });			
    }
};
/* $Id: three-pane.js 2466 2014-09-16 08:21:38Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/toppanel/three-pane.js $ */
/*for JSLINT undef checks*/
/*extern DA Prototype YAHOO */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.mailer || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Builds a Top panel for three-pane. 
 * 
 * Usage: 
 *   var tpc = new DA.mailer.TopPanelController43PANE();
 * 
 * @class TopPanelController43PANE
 * @uses 
 * @constructor
 * Todo: message
 */
DA.mailer.TopPanelController43PANE = function(panelNode, menuNode) {
	this.panelId   = panelNode.id;
    this.panelNode = panelNode;
    this.menuNode  = menuNode;
    
    if (DA.vars.custom.threePane.setTopPanel) {
        eval(DA.vars.custom.threePane.setTopPanel);
    }
    
    this.init();
};

/**
 * Members
 */
DA.mailer.TopPanelController43PANE.prototype = {
    
    panelId: null,
    
    panelNode: null,
    
    menuNode: null,
    
    panelMenu: null,

    panelImages: {
        left   : DA.vars.clrRdir + "/mailhead_main.gif",
        center : DA.vars.clrRdir + "/mailhead_popy4.gif",
        right  : DA.vars.clrRdir + "/mailhead_popy2.gif"
    },
    
    menuData: {
        leftOrder: ['make', 'reply', 'replyall', 'forward', 'delete', 'print'],
        rightOrder: ['close', 'guide', 'setting', 'state'],
        items: {
            make: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_MAKE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_MAKE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_make_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_make_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_make_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            reply: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_REPLY_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_REPLY_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_reply_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_reply_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_reply_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            replyall: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_REPLYALL_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_REPLYALL_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_replyall_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_replyall_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_replyall_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            forward: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_FORWARD_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_FORWARD_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_forward_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_forward_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_forward_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            'delete': {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_DELETE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_DELETE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_delete_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_delete_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_delete_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            print: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_PRINT_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_PRINT_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_print_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_print_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_print_dis.gif",
                className   : 'da_panelMenu43PaneItemLeft',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            },
            state: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_STATE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_STATE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_state_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_state_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_state_dis.gif",
                className   : 'da_panelMenu43PaneItemRight',
                hidden      : 0,
                disable     : 1,
                onSelect    : function() {
                    DA.mailer.connection.saveState();
                },
                pulldown    : null
            },
            setting: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_SETTING_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_SETTING_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_setting_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_setting_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_setting_dis.gif",
                className   : 'da_panelMenu43PaneItemRight',
                hidden      : 0,
                disable     : 1,
                onSelect    : function() {
                    DA.windowController.winOpenNoBar(DA.vars.cgiRdir + '/ma_ajx_env_pop_up.cgi?proc=ma_ajx_config.cgi&title=pop_title_ajxmailer_other.gif&config_opener=ajax_mailer', 'ma_ajx_config', 990, 600);
                },
                pulldown    : null
            },
            guide: {
                title       : DA.locale.GetText.t_('TOPMENU43PANE_GUIDE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU43PANE_GUIDE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_guide_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_guide_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_guide_dis.gif",
                className   : 'da_panelMenu43PaneItemRight',
                hidden      : (DA.vars.system.guide === 1) ? 0: 1,
                disable     : 1,
                onSelect    : function() {
                    DA.windowController.winOpenNoBar(DA.vars.cgiRdir + '/guide.cgi?item=ajx_ma_menu', 'guide', 430, 579);
                },
                pulldown    : null
            },
            close: {
                title       : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                alt         : DA.locale.GetText.t_('TOPMENU_CLOSE_TITLE'),
                smallIcon   : DA.vars.clrRdir + "/mailhead_close_s.gif",
                bigIcon     : DA.vars.clrRdir + "/mailhead_close_b.gif",
                disableIcon : DA.vars.clrRdir + "/mailhead_close_dis.gif",
                className   : 'da_panelMenu43PaneItemRight',
                hidden      : 0,
                disable     : 1,
                onSelect    : function() {
                    DA.mailer.connection.logout();
                },
                pulldown    : null
            },
            space: {
                title       : '',
                alt         : '',
                smallIcon   : DA.vars.imgRdir + "/null.gif",
                bigIcon     : DA.vars.imgRdir + "/null.gif",
                disableIcon : DA.vars.imgRdir + "/null.gif",
                className   : 'da_panelMenu43PaneItemBlank',
                hidden      : 0,
                disable     : 1,
                onSelect    : Prototype.emptyFunction,
                pulldown    : null
            }
        },
        className: 'da_panelMenu43Pane'
    },
    
    init: function() {
        //テンプレート
        var i;
        var make     = this.menuData.items.make;
        var reply    = this.menuData.items.reply;
        var replyall = this.menuData.items.replyall;
        var forward  = this.menuData.items.forward;
        var print    = this.menuData.items.print;
        if (DA.vars.config.template && DA.vars.config.template.length > 0) {
            make.pulldown = {};
            make.pulldown.className = 'da_topPanel43PanePulldownMenu';
            if(DA.vars.config.template.length > 10){
            	YAHOO.util.Dom.addClass(make.pulldown, 'da_topPanel43PanePulldownMenu2');
            }
            make.pulldown.order = [];
            make.pulldown.order[0] = [];
            make.pulldown.items = {};
            
            make.pulldown.order[0].push(0);
            make.pulldown.items[0] = {
                text: DA.locale.GetText.t_('MESSAGE_NEW_MAKING'),
                onclick: Prototype.emptyFunction,
                args: []
            };
            
            for (i = 0; i < DA.vars.config.template.length; i ++) {
                make.pulldown.order[0].push(i+1);
                make.pulldown.items[i+1] = {
                    text: DA.vars.config.template[i].name,
                    onclick: Prototype.emptyFunction,
                    args: [DA.vars.config.template[i].tid]
                };
            }
        }
        
        // 返信
        reply.pulldown = {};
        reply.pulldown.className = 'da_topPanel43PanePulldownMenu';
        reply.pulldown.order = [];
        reply.pulldown.order[0] = ['0', '1', '2'];
        reply.pulldown.items = {};
        reply.pulldown.items[0] = {
            text: DA.locale.GetText.t_('QUOTE_01_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['01'],
            selected: (DA.vars.config.quote_reply === '01') ? true : false
        };
        reply.pulldown.items[1] = {
            text: DA.locale.GetText.t_('QUOTE_11_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['11'],
            selected: (DA.vars.config.quote_reply === '11') ? true : false
        };
        reply.pulldown.items[2] = {
            text: DA.locale.GetText.t_('QUOTE_99_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['99'],
            selected: (DA.vars.config.quote_reply === '99') ? true : false
        };
        
        //　全員に返信       
        replyall.pulldown = {};
        replyall.pulldown.className = 'da_topPanel43PanePulldownMenu';
        replyall.pulldown.order = [];
        replyall.pulldown.order[0] = ['0', '1', '2'];
        replyall.pulldown.items = {};
        replyall.pulldown.items[0] = {
            text: DA.locale.GetText.t_('QUOTE_01_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['01'],
            selected: (DA.vars.config.quote_reply === '01') ? true : false
        };
        replyall.pulldown.items[1] = {
            text: DA.locale.GetText.t_('QUOTE_11_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['11'],
            selected: (DA.vars.config.quote_reply === '11') ? true : false
        };
        replyall.pulldown.items[2] = {
            text: DA.locale.GetText.t_('QUOTE_99_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['99'],
            selected: (DA.vars.config.quote_reply === '99') ? true : false
        };
        
        //　転送
        forward.pulldown = {};
        forward.pulldown.className = 'da_topPanel43PanePulldownMenu';
        forward.pulldown.order = [];
        forward.pulldown.order[0] = ['0', '1', '2', '3', '4', '5'];
        forward.pulldown.items = {};
        forward.pulldown.items[0] = {
            text: DA.locale.GetText.t_('QUOTE_00_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['00'],
            selected: (DA.vars.config.quote_forward === '00') ? true : false
        };
        forward.pulldown.items[1] = {
            text: DA.locale.GetText.t_('QUOTE_01_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['01'],
            selected: (DA.vars.config.quote_forward === '01') ? true : false
        };
        forward.pulldown.items[2] = {
            text: DA.locale.GetText.t_('QUOTE_02_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['02'],
            selected: (DA.vars.config.quote_forward === '02') ? true : false
        };
        forward.pulldown.items[3] = {
            text: DA.locale.GetText.t_('QUOTE_10_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['10'],
            selected: (DA.vars.config.quote_forward === '10') ? true : false
        };
        forward.pulldown.items[4] = {
            text: DA.locale.GetText.t_('QUOTE_11_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['11'],
            selected: (DA.vars.config.quote_forward === '11') ? true : false
        };
        forward.pulldown.items[5] = {
            text: DA.locale.GetText.t_('QUOTE_99_TITLE'),
            onclick: Prototype.emptyFunction,
            args: ['99'],
            selected: (DA.vars.config.quote_forward === '99') ? true : false
        };
        
        var html = '<div id="' + this.panelId + '_TPC" class="da_topPanel43Pane">' +
                   '<div id="' + this.panelId + '_TPCL" class="da_topPanel43PaneLeft" style="background-image:url(' + this.panelImages.left + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCR" class="da_topPanel43PaneRight" style="background-image:url(' + this.panelImages.right + ')"></div>' +
                   '<div id="' + this.panelId + '_TPCC" class="da_topPanel43PaneCenter" style="background-image:url(' + this.panelImages.center + ')"></div>' +
                   '</div>';
        
        this.panelNode.innerHTML = html;


        // 印刷
        print.pulldown = {};
        print.pulldown.className = 'da_topPanel43PanePulldownMenu';
        print.pulldown.order = [];
        print.pulldown.order[0] = ['0', '1'];
        print.pulldown.items = {};
        print.pulldown.items[0] = {
            text: DA.locale.GetText.t_('PRINT_WITH_TO'),
            onclick: Prototype.emptyFunction,
            args: ['on','printtoconfig']
        };
        print.pulldown.items[1] = {
            text: DA.locale.GetText.t_('PRINT_WITHOUT_TO'),
            onclick: Prototype.emptyFunction,
            args: ['off','printtoconfig']
        };

        // CustomEvent				
        DA.customEvent.fire("TopPanelController43PANEInitAfter", this, {				
                                                                                        make: make,				
                                                                                        reply: reply,				
                                                                                        replyall: replyall,				
                                                                                        forward: forward				
        });

        this.panelMenu = new DA.widget.PanelMenuController(this.menuNode, this.menuData);
    },
    
    messageSelectedMenu: function(fid, uid) {

	DA.customEvent.fire("topPanelController43PANEmessageSelectedMenuBefore", this, {
		fid: fid,
		uid: uid
	});

        if (fid) {
            this.selectedFid = fid;
        }
        if (uid) {
            this.selectedUid = uid;
        }
        if( !DA.util.isEmpty(window.__folderTree.backupFolderFid) && fid.toString() === window.__folderTree.backupFolderFid.toString()) {
            this.panelMenu.enable('make');
            this.panelMenu.disable('reply');
            this.panelMenu.disable('replyall');
            this.panelMenu.disable('forward');
            this.panelMenu.enable('delete');
            this.panelMenu.enable('print');
            this.panelMenu.enable('state');
            this.panelMenu.enable('setting');
            this.panelMenu.enable('guide');
            this.panelMenu.enable('close');
        } else {
            this.panelMenu.enable('make');
            this.panelMenu.enable('reply');
            this.panelMenu.enable('replyall');
            this.panelMenu.enable('forward');
            this.panelMenu.enable('delete');
            this.panelMenu.enable('print');
            this.panelMenu.enable('state');
            this.panelMenu.enable('setting');
            this.panelMenu.enable('guide');
            this.panelMenu.enable('close'); 
        }          
        

	DA.customEvent.fire("topPanelController43PANEmessageSelectedMenuAfter", this, {
	    fid: fid,
	    uid: uid
	});

    },
    
    messageUnselectedMenu: function() {

	DA.customEvent.fire("topPanelController43PANEmessageUnselectedMenuBefore", this);

        this.panelMenu.enable('make');
        this.panelMenu.disable('reply');
        this.panelMenu.disable('replyall');
        this.panelMenu.disable('forward');
        this.panelMenu.disable('delete');
        this.panelMenu.disable('print');
        this.panelMenu.enable('state');
        this.panelMenu.enable('setting');
        this.panelMenu.enable('guide');
        this.panelMenu.enable('close');

	DA.customEvent.fire("topPanelController43PANEmessageUnselectedMenuAfter", this);

    },
    
    setFunction: function(viewer) {
        var key;
        var me       = this;
        var make     = this.menuData.items.make;
        var reply    = this.menuData.items.reply;
        var replyall = this.menuData.items.replyall;
        var forward  = this.menuData.items.forward;
        var print    = this.menuData.items.print;
        
        make.onSelect = function() {
            viewer.make();
        };
        reply.onSelect = function() {
            viewer.reply(null, me.selectedFid, me.selectedUid);
        };
        replyall.onSelect = function() {
            viewer.replyall(null, me.selectedFid, me.selectedUid);
        };
        forward.onSelect = function() {
            viewer.forward(null, me.selectedFid, me.selectedUid);
        };
        print.onSelect = function() {
            viewer.print(null);
        };
        if (make.pulldown) {
            for (key in make.pulldown.items) {
                if (key.match(/^\d+$/)) {
                    make.pulldown.items[key].onclick = function(e, a) {
                        viewer.make(a[0]);
                    };
                }
            }
        }
        for (key in reply.pulldown.items) {
            if (key.match(/^\d+$/)) {
                reply.pulldown.items[key].onclick = function(e, a) {
                    viewer.reply(a[0], me.selectedFid, me.selectedUid);
                };
            }
        }
        for (key in replyall.pulldown.items) {
            if (key.match(/^\d+$/)) {
                replyall.pulldown.items[key].onclick = function(e, a) {
                    viewer.replyall(a[0], me.selectedFid, me.selectedUid);
                };
            }
        }
        for (key in forward.pulldown.items) {
            if (key.match(/^\d+$/)) {
                forward.pulldown.items[key].onclick = function(e, a) {
                    viewer.forward(a[0], me.selectedFid, me.selectedUid);
                };
            }
        }
        for (key in print.pulldown.items) {
            if (key.match(/^\d+$/)) {
                print.pulldown.items[key].onclick = function(e, a) {
                    viewer.print(a[0]);
                };
            }
        }
				
        // CustomEvent				
        DA.customEvent.fire("TopPanelController43PANESetFunctionAfter", this, {				
                                                                                        viewer: viewer,				
                                                                                        make: make,				
                                                                                        reply: reply,				
                                                                                        replyall: replyall,				
                                                                                        forward: forward				
        });				
    }
    
};

/* $Id: mboxgrid.js 2484 2014-09-30 02:28:28Z xc_zhai $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/mboxgrid/mboxgrid.js $ */
/*for JSLINT undef checks*/
/*extern $ $H BrowserDetect DA Prototype Rico YAHOO Event */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.mailer || !DA.mailer.widget || !DA.widget || !DA.util) {
    throw "ERROR: missing DA.js or mailer.js"; // TODO: formalize/cleanup
}
if (!DA.widget.VirtualScrollingTable) {
    throw "ERROR: missing VirtualScrollingTable (virtual-scroll.js)";
}

if (!YAHOO || !YAHOO.util || !YAHOO.widget) {
    throw "ERROR: missing yahoo.js or treeview.js"; // TODO: formalize/cleanup
}

// TODO: formalize dependency checking scheme
if ( 'undefined' === typeof Rico || 
     'undefined' === typeof Rico.LiveGrid ||  
     'undefined' === typeof Rico.LiveGridBuffer ||
     'undefined' === typeof Rico.TableColumn) {
    // RICO not found, we cannot continue.
    throw "DEPENDENCY ERROR: RICO not found, we cannot continue";
}



/**
 * Wraps a LiveGrid (VirtualScrollingTable) widget with added functionality for 
 * viewing a listing of emails, in 2 modes:
 * <ol>
 *   <li> Folder Mode (when searchMode == true) </li>
 *   <li> Search Mode </li>
 * </ol>
 * @class MboxGrid
 * @module mailer.widget
 * @constructor
 * @params {Object} hash containing the following values:
 *                  containerElem - {HTMLElement} DOM element to place the grid in.
 *                  visibleRows   - {Int}         nummber of rows to display
 *                  folderId      - {Int}         folder ID
 *                  folderType    - {Int}         folder Type
 *                  searchMode    - {boolean}     if true, the grid displays search results
 *                  srid          - {Int}         ID of canned search results.
 *                  onLoading     - {function}    callback executed while network IO happens
 *                  onLoadDone    - {function}    callback executed after network IO is done
 *                  isUsingFakeTable - {boolean}  If true, enable the the Fake-table optimization:
 *                                                This will setup a structure of DIV elements formatted
 *                                                like a table, which greatly speeds up LiveGrid redrawing
 *                                                on IE. Default: True
 */
DA.mailer.widget.MboxGrid = function(params) {
    var _params = {
        visibleRows: 10,
        folderId: 0,
        folderType: 0,
        isUsingFakeTable: true
    };
    Object.extend(_params, params || {});
    if (_params.srid || _params.searchMode) {
        // searchmode
        this.setSearchMode();
    }
    this.isUsingFakeTable = _params.isUsingFakeTable;
    this.visibleRows = _params.visibleRows;
	if (_params.folderTreeController) {
        this.folderTreeController = _params.folderTreeController;
    }
    if ('function' === typeof _params.onLoading)  { this.onLoading  = _params.onLoading ; }
    if ('function' === typeof _params.onLoadDone) { this.onLoadDone = _params.onLoadDone; }
    if ('function' === typeof _params.onDeletePress) { this.onDeletePress = _params.onDeletePress; }


    this.init(_params);


};


DA.mailer.widget.MboxGrid.prototype = {

    /**
     * The grid can also be used to display search results; by default
     * this is not the case unless specified.
     * @property searchMode
     * @type {boolean}
     */
    searchMode: false,

    
    url: DA.vars.cgiRdir + "/ajx_ma_list.cgi",

    /**
     * Columns to display (default names are in English)
     * @property columns
     * @type {Array}
     */
    columns: [ 
        { key: 'subject', name: 'subject', width: "45%" },
        { key: 'from',    name: 'from',    width: "20%" },
        { key: 'to',      name: 'to',      width: "20%" },
        { key: 'date',    name: 'date',    width: "15%" }
    ],
    
    /**
     * From column index
     * @property fromColumnIndex
     * @type {Int}
     */
    fromColumnIndex: 1,

    /**
     * Date column index
     * @property dateColumnIndex
     * @type {Int}
     */
    dateColumnIndex: 1,

    /**
     * Size column index
     * @property sizeColumnIndex
     * @type {Int}
     */
    sizeColumnIndex: 1,
    
    /**
     * Folder ID
     * @property folderId
     * @type {Int}
     */
    folderId: 0,
    
    /**
     * Folder Type
     * @property folderType
     * @type {Int}
     */
    folderType: 0,
    
    /**
     * Folder tree controller
     */
    folderTreeController: null,
    
    /**
     * @property liveGrid
     * @type {Object} Instance of DA.widget.VirtualScrollingTable
     */
    liveGrid: null,
  
   
    /**
     * Message drag-and-drop proxy draggable.
     * @property _mdd
     * @private
     * @type {Object} Instance of DA.mailer.dd.MboxMail
     */
    _mdd: null,

    /**
     * Flag to indicate whether a message-drag operation is currently 
     * taking place. This is needed because deselection (on mouse-up) must be
     * disabled if we mouse-up after a drag.
     *
     * @property _isBeingDragged
     * @private 
     * @type {Boolean}
     */
    _isBeingDragged: false,

    /**
     * Search result page .
     * Move selected mail to other folder dialog
     *
     * @property SearchMoveFolderDialog
     * @private 
     * @type {Object} Instance of DA.widget.SearchMoveFolderDialog
     */
    searchMoveFolderDialog: null,

    /**
     * Stuff that one would rather not fill up the constructor with.
     */
    init: function(params, folderTreeData) {
        var me = this;
        var conf = DA.vars.config;
        me.folderTreeData = folderTreeData;
       
        // FIXME: data not instance-specific, yet declared per-instance
        var imageTitles = {
            attachment: "mailsort_attach.gif",
            flagged:    "mailsort_flag.gif",
            priority:   "mailsort_important.gif",
            seen:       "mailsort_mail.gif"
        };

        var imgDir = DA.vars.imgRdir + '/';

        // FIXME: code not instance-specific, yet declared per-instance
        function getTitleHtml(colName) {
            var img = imageTitles[colName];
            if (img) {
                return "<img src='" + imgDir + img + "'/>";
            } else {
                return DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_' + colName.toUpperCase());
            }
        }

        // Set the columns from the config, if the information is available
        var existsFrom = false;
        var existsDate = false;
        var existsSize = false;
        if (conf.list_order && conf.list_order.split) {
            this.columns = conf.list_order.split('|').map(function(colName, i){
                if (colName === 'from') {
                    me.fromColumnIndex = i;
                    existsFrom = true;
                }else if(colName === 'date') {
                     me.dateColumnIndex = i;
                     existsDate = true;
                }else if(colName === 'size') {
                    me.sizeColumnIndex = i;
                    existsSize = true;
                }
                
                return { 
                    // TODO: what if this returns undefined?
                    width: conf.list_width[colName],
                    name:  getTitleHtml(colName),
                    key:   colName
                }; 
            });
            this._percentify();
            
            if (!existsFrom) {
                me.fromColumnIndex = null;
            }
            if(!existsDate) {
                me.dateColumnIndex = null;
            }
            if(!existsSize) {
                me.sizeColumnIndex = null;
            }
        }

        if (!params.containerElem) { throw "MISSING ARG: containerElem" ; }
        this.containerElem = params.containerElem;

        this._initCustomEvents();
        this._setupSubscribers();
        this._messageMoverJobs = $H({}); // Initialize as empty (Prototype.js) hash

        
        if (this.searchMode) {
            this.loadSearchResults(params.totalMessages, params.fid, params.srid, params.type);
            me.searchMoveFolderDialog = new DA.widget.SearchMoveFolderDialog("da_searchMoveFolderDialog", 
                DA.locale.GetText.t_("SEARCH_MOVE_FOLDER_DIALOG_TITLE"), {
                onEnter: function() {
                    var moveToFid = document.getElementById("da_searchMoveToFid").value;
                    if (window.__messageSearcher.folderTreeData[moveToFid].move_m === 1) {
                        me.moveSelected( {fid:moveToFid} );
                        return true;
                    } else {
                        alert(DA.locale.GetText.t_("MESSAGE_MOVE_FOLDER_ERROR"));
                        return false;
                    }
                }
            });
        } else {
            this.changeFolder(params.folderId, params.folderType);
            // Drag-and-drop only for non-search mode
            this._mdd = new DA.mailer.dd.MboxMail(this.liveGrid.tableId);
            this._mdd.mboxGrid = this;

        }

        this.setupCSS();

        this._onLoadDoneJobs = [];

    },

    /**
     *
     * @method _initCustomEvents
     * @private
     */
    _initCustomEvents: function () {
        this.onFolderChanged = new YAHOO.util.CustomEvent("folderChanged");
        this.onDoubleClick   = new YAHOO.util.CustomEvent("onDoubleClick");
    },


    /**
    *  @add a reply icon the the mail which has been replied
    *  by hou for INSUITE2.3.0 
    *
    */
    _add_reply_flag: function(mmdata){
    
    	var temp_mmdata = this.liveGrid.buffer.findRowMetaData(function(r){ if((r.fid === mmdata.fid.toString())&&(r.uid === mmdata.uid.toString())){ return r;}});
    	if(DA.vars.system.no_replied_flag===0 && temp_mmdata.length === 1)
    	{
    		temp_mmdata[0].replied = "1";
    		temp_mmdata[0].forwarded = "0";
			this.setRowAppearance(temp_mmdata[0],["replied","forwarded"]);
    	}
    },

    /**
    *  @add a forward icon the the mail which has been replied
    *  by hou for INSUITE2.3.0 
    *
    */
	_add_forwarded_flag: function(mmdata){
	
		var temp_mmdata = this.liveGrid.buffer.findRowMetaData(function(r){if((r.fid === mmdata.fid.toString())&&(r.uid === mmdata.uid.toString())){ return r;} });
    	if(DA.vars.system.no_replied_flag===0 && temp_mmdata.length === 1)
    	{
    		temp_mmdata[0].replied = "0";
    		temp_mmdata[0].forwarded = "1";
			this.setRowAppearance(temp_mmdata[0],["replied","forwarded"]);
    	}
	},

    /**
     * @method _removeMessagesFromGrid
     * @param sJobId {String} id of the message-move job
     */
    _removeMessagesFromGrid: function (sJobId) {

        var oMsgColl = this._messageMoverJobs[sJobId];

        if (!oMsgColl) {
            return;
        }

        var count = oMsgColl.count;

        // FIXME: What about this?
        // if (DA.util.cmpNumber(fid, target.fid)) { return; } ?

        if (count === 0) {
            return;
        }

        var me = this;


        // START: update the ViewPort
        var lg = this.liveGrid;
        this._updateExceptionFilter();
        // Update the totalRows; we need to do this ourselves.
        var totalRows = lg.metaData.getTotalRows();
        totalRows -= count;
        lg.metaData.setTotalRows(totalRows);
        // And update the scroller's size.
        lg.scroller.updateSize();
      
        lg.viewPort.isPartialBlank = true; 
        // Remove the oMsgColl/specified messages from the buffer
        // using a filtering function
        var uidHash = {}; // FIXME: What a waste!
        oMsgColl.singles.each(function (mmdata) {
            uidHash[mmdata.fid+'_'+mmdata.uid] = true;
        });
        var shiftRanges = oMsgColl.ranges;
        var bufferChanged = lg.buffer.removeIf( function (bufferRow) {
            var mdata = bufferRow.meta;
            if (!mdata) { return false; }
            if (uidHash[mdata.fid+'_'+mdata.uid]) {
                return true;
            }
            if (shiftRanges.length < 1) {
                return false;
            }
            return me._checkShiftRanges(mdata, shiftRanges);
            
        });

        // If messages have been moved/deleted above the viewPort, try
        // to adjust the startPos to reflect that change
        var vpAdjusted = this._adjustViewPortStartPos(oMsgColl, lg);
        var bfAdjusted = this._adjustBufferStartPos(oMsgColl, lg);

        // This is needed to ensure that meta.sno's are all consistent
        this._repairBufferSeqNums(lg); 
  
        var scrolled = lg.scroller.moveScroll(lg.viewPort.lastRowPos);

        if (!scrolled) { // No change in scroll offset, so just redraw the current offset
            lg.requestContentRefresh(lg.viewPort.lastRowPos);
            lg.viewPort.refreshContents(lg.viewPort.lastRowPos);
        }
        // DONE: updated the ViewPort
    },


    /**
     * @property _utils
     * @type {Object}  a collection of utility methods.
     * @private
     */
    _utils: {
        /**
         * For the given message collection object, returns a new one which
         * does not contain SHIFT-key selection ranges.
         * @method removeShiftRanges
         * @param oMsgColl {Object} MessageCollection (hash with singles, ranges, count, etc)
         * @private
         */
        removeShiftRanges: function (oMsgColl) {
            // Make a copy of the given Message Collection
            var newMsgColl = {}.extend(oMsgColl);
            if (!newMsgColl.ranges.length) {
                // No ranges anyway; just return
                return newMsgColl;
            }
            newMsgColl.ranges.each(function (oSR) {
                newMsgColl.count -= oSR.count;
            });
            newMsgColl.ranges = [];
            return newMsgColl; 
        },

        /**
         * Returns a new array which is the result of concatenating a to l.
         * @method listConcat
         * @param l {Array}
         * @param a {Array}
         * @returns {Array}
         * @private
         */
        listConcat: function (l, a) {
            if (a && a.length) {
                return l.concat(a || []);
            } else {
                return l;
            }
        },

        /**
         * Utility function to pass the uid= parameter (ajx_ma_*)
         * @method asFidColonUid
         * @param mmdata {Object} mail meta-data (uid, fid, etc)
         * @returns {String} 'fid:uid'
         */
        asFidColonUid: function (mmdata) {
            return mmdata.fid + ':' + mmdata.uid;
        },

        /**
         * Utility function to pass the areas= parameter 
         * NOTE: This does not bother with any null-checks...
         * @method asFidColonUidRange
         * @param r {Object} shift-range (start, end, etc)
         * @returns {String} 'fid1:uid1-fid2:uid2'
         */
        asFidColonUidRange: function (r) {
            return r.start.fid + ":" + r.start.uid + "-" + r.end.fid + ":" + r.end.uid;
        },

        /**
         * FIXME: the mboxgrid parameter shows an underlying design ugliness...
         * @method mkMsgAcceptor
         * @param oMsgColl  {Object} singles, ranges, etc
         * @param oMboxGrid {Object} instance of an mboxgrid
         * @returns {Function} a function whose argument is a LiveGrid buffer row/row-meta-data
         *                       which returns a boolean.
         */
        mkMsgAcceptor: function (oMsgColl, oMboxGrid) {
          
            var shiftRanges = oMsgColl.ranges;
            var hash = $H({}); // FIXME: Need memoizing?
            oMsgColl.singles.each(function (m) {
                hash[m.fid + '_' + m.uid] = true;
            });

            // FIXME: Severe copy-paste!
            return function (mdata) {
                if (!mdata) { return false; }
                mdata = mdata.meta || mdata; // FIXME: This works only for Fake-table
                if (hash[mdata.fid + '_' + mdata.uid]) {  
                    return true;
                }
                if (shiftRanges.length < 1) {
                    return false;
                }
                if (!oMboxGrid) { return false; }
                // FIXME: Ugly use of _checkShiftRanges
                return oMboxGrid._checkShiftRanges(mdata, shiftRanges);
             
            };
        },

        /**
         * For the given mail-meta-data, returns a string that can be used as the
         * CSS className of the LiveGrid row for the mail. It is usually of the form
         * 'a1 s0 t1 p3 do f1' (meaning it has an attachment (a1), it is unseen (s0),
         * has normal priority (p3), and so on).
         * @method  mkCSSClassNameForRow
         * @param   oMMData {Object}
         * @returns {String}
         */ 
        mkCSSClassNameForRow: function (oMMData) {
            return ['seen', 'flagged', 'attachment', 
                    'priority', 'toself', 'deleted','replied','forwarded'].map(
                function (prop) {
                    var value = oMMData[prop];
                    if (!value) { return ''; /*Better '' than undefined*/ }
                    var c; 
                    if(prop === "forwarded")
                    { c='w';}
                    else
                    {c = prop.charAt(0);}
                    return c + value;
                }
            ).join(' ');
        },

        /**
         * FIXME: This should be in a more common location?
         * @property yes
         * @type {Function}
         * @returns {Boolean} always returns TRUE
         */
        yes: function () {
            return true;
        }
    
    },

    /**
     * Refreshes the contents of the grid (from the network) without
     * disturbing the current scroll offset or blanking the viewport.
     * Use this when a smooth redraw is needed, and loss of scroll
     * position and selection information is undesirable,
     * @method refreshGrid
     * FIXME: This ought to be in VirtualScrollingTable?
     * FIXME: refreshGrid is not the best name?
     */
    refreshGrid: function () {
        var lg = this.liveGrid;
        var currentPos = lg.viewPort.lastRowPos;
        lg.buffer.removeIf( this._utils.yes );
        lg.viewPort.isPartialBlank = true;
        lg.requestContentRefresh(currentPos);
    },


    /**
     * init-time method that setups up subscribers for all the (YUI) CustomEvents
     * (usually under DA.mailer.Events.*) that we are interested in.
     * @method _setupSubscribers
     * @private
     */
    _setupSubscribers: function () {
        var E = DA.mailer.Events;
        if (!E) {
             return;
        }

   
        function mkHndlr (f) {
            return function (type, args) {
                var _, jobId;
                if (!args || !(jobId = args[0]) || !(_ = args[1]) ||
                    !(_.target && _.messages)) {  
                    return;
                }

                // FIXME: We need a "don't bother" check; if the fids are totally off, for one
                
                var response = args[2];

                var incoming = false;

                if (parseInt(_.target.fid, 10) === this.folderId) {
                    // moving stuff *INTO* us!
                    incoming = true;
                }
                
                // Was this from us?
                var ours = DA.util.areEquivObjs(_.messages.identity, this._getIdentity());

                var unresolvedRanges = (!ours) && _.messages.ranges.length;

                f.call(this, incoming, unresolvedRanges, jobId, _.messages, _.target, response);

            };  
        }

        // function references for all the event handlers we are interested in
        var hndlMoving, hndlMoved, hndlMoveFailure;

        E.onMessagesMoving.subscribe( hndlMoving = mkHndlr ( 
            function (bIncoming, hasUnresolvedRanges, sJobId, oMsgColl, oTarget) {
                if (bIncoming) { return; /*We don't do incoming mode*/ }
                // Use a range-less copy of the Message Collection, if it contains
                // unresolvable ranges
                var msgColl = hasUnresolvedRanges ? 
                        this._utils.removeShiftRanges(oMsgColl) : 
                        oMsgColl;
                // Enqueue a move-message job:
            	if(oMsgColl.singles.length ===1)
            	{      
                	if(oMsgColl.single.mode === 1)
                	{

                    	this._add_reply_flag({fid:oMsgColl.single.fid,uid:oMsgColl.single.originuid});		
                	}
                	else if(oMsgColl.single.mode === 2)
                	{
                		this._add_forwarded_flag({fid:oMsgColl.single.fid,uid:oMsgColl.single.originuid});
                	}
					else {}                
				}
                this._messageMoverJobs[sJobId] = msgColl;
                this._removeMessagesFromGrid(sJobId);
            }), 
        this, true);

        E.onMessagesMoved.subscribe( hndlMoved = mkHndlr (
            function (bIncoming, hasUnresolvedRanges, sJobId, oMessages, oTarget, oResponse) {
                if (bIncoming) {
                    this.refreshGrid();
                    // Nothing else we can do about incoming mode... 
                    return;
                }
                delete this._messageMoverJobs[sJobId];
                if (hasUnresolvedRanges) {
                    // No choice but to refresh...
                    this.refreshGrid();
                }
                if (this._messageMoverJobs.entries().length === 0) {
                    this._updateExceptionFilter();
                } 
            }), 
        this, true);

        E.onMessagesMoveFailure.subscribe( hndlMoveFailure = mkHndlr (
            function (bIncoming, hasUnresolvedRanges, sJobId) {
                delete this._messageMoverJobs[sJobId];
                this._updateExceptionFilter();
            }), 
        this, true);

        

        /* **********************************************************************************
         * Now for the toggle-related events (flagged, seen, etc)
         */
        function mkFlagHndlr (f) {
            return function (type, args) {
                var _, jobId;
                if (!args || !(jobId = args[0]) || !(_ = args[1]) ||
                    !(_.property && _.messages)) {  
                    return;
                }
                // FIXME: We need a "don't bother" check; if the fids are totally off, for one

                var response = args[2];
                var state = _.state !== false; // Be optimistic

                // Was this from us?
                var ours = DA.util.areEquivObjs(_.messages.identity, this._getIdentity());
                var unresolvedRanges = (!ours) && _.messages.ranges.length;

                f.call(this, unresolvedRanges, jobId, _.messages, _.property, state, response);
            };  
        }
       
        // A mapping of ID -> command object
        var togglerJobs = $H({});
        // References to our subscribers (handlers)
        var hndlFlagging, hndlFlagged, hndlFlagFailure;

        E.onMessagesFlagging.subscribe( hndlFlagging = mkFlagHndlr (
            function ( hasUnresolvedRanges, sJobId, oMsgColl, sProp, bState, oResp) {
                // Use a range-less copy of the Message Collection, if it contains
                // unresolvable ranges
                var msgColl = hasUnresolvedRanges ? 
                        this._utils.removeShiftRanges(oMsgColl) : 
                        oMsgColl;
                var me = this;
                // List of affected Grid-row meta-data
                var affectedRowMetaData = this.liveGrid.buffer.
                        findRowMetaData(this._utils.mkMsgAcceptor(oMsgColl, me));
                // Undo information
                var undos = affectedRowMetaData.map( function (md) {
                    var preToggle = md[sProp];
                    var preToggleCn = md.className;
                    // Set the value here...
                    md[sProp] = bState ? '1' : '0';
                    me.setRowAppearance(md, [sProp]); // FIXME: slow: calling setRowAppearance too many times.
                    return { property:  preToggle,
                             className: preToggleCn,
                             mmdata:    md };
                });
                // Enqueue a toggling job:
                togglerJobs[sJobId] = {
                    // Function to rollback the UI and any state saved in the buffer's row meta-data
                    undo: function () {
                        undos.each( function (undo) { // FIXME: Looks slow
                            var mmdata = undo.mmdata;
                            mmdata[sProp] = undo.property;
                            mmdata.className = undo.className;
                            // No second parameter; we have a copy of the original className
                            // so we need not pass in the list of properties to change
                            me.setRowAppearance(mmdata);
                        });
                        // TODO: warn the user that something failed here.
                    }
                };
            }),        
        this, true );

        E.onMessagesFlagged.subscribe( hndlFlagged = mkFlagHndlr(
            function ( hasUnresolvedRanges, sJobId, oMsgColl, sProp, bState, oResp) {
                if (hasUnresolvedRanges) {
                    // Nothing else that we can do?
                    this.refreshGrid();
                }
                delete togglerJobs[sJobId];
            }),
        this, true);
        
        E.onMessagesFlagFailure.subscribe( hndlFlagFailure = mkFlagHndlr(
            function ( hasUnresolvedRanges, sJobId, oMsgColl, sProp, bState, oResp) {
                var job = togglerJobs[sJobId];
                if (!job) { 
                    return;
                }
                job.undo();
                delete togglerJobs[sJobId];
            }),        
        this, true );

        var hndlRead;
        E.onMessageRead.subscribe( hndlRead = function (type, args) {
            var mmdata = args[0];
            if (!mmdata || !mmdata.uid) {
                return;
            }
            if (!DA.util.cmpNumber(mmdata.fid, this.folderId) &&
                !DA.util.cmpNumber(mmdata.srid, this._getIdentity().srid)) {
                return; // Not our problem
            }
            var tr = this.findRowByMMData(mmdata);
            if (!tr) { return; /*Not our problem*/ }
            var md = tr.__daGridRowMetaData;
            if (!md) { // very, very strange!
                return;
            }
            md.seen = '1';
            this.setRowAppearance(md, ['seen'], tr);
        }, this, true);

       
        // Making sure we remove all installed subscribers
        YAHOO.util.Event.on(window, 'unload', function() {
            // move, delete
            E.onMessagesMoving.unsubscribe(hndlMoving, this);
            E.onMessagesMoved.unsubscribe(hndlMoved, this);
            E.onMessagesMoveFailure.unsubscribe(hndlMoveFailure, this);
            // flag
            E.onMessagesFlagging.unsubscribe(hndlFlagging, this);
            E.onMessagesFlagged.unsubscribe(hndlFlagged, this);
            E.onMessagesFlagFailure.unsubscribe(hndlFlagFailure, this);
            // message read
            E.onMessageRead.unsubscribe(hndlRead, this);
        }, this, true);

    },


    /**
     * @method _getIdentity
     * @returns {Hash} an object which represents the data set that this
     *                 MboxGrid instance is currently viewing
     */
    _getIdentity: function () {
        var identity = this.liveGrid.getParameters();
        delete identity.except;
        identity.isaMboxGrid = true;
        return identity;
    },


    /**
     * Performs all CSS settings that can be done only at load time.
     * For now, this only adds the CSS required to correctly display
     * mails addressed directly to the recipient (to_self). This
     * needs to read the color value off of DA.vars.config.toself_color
     * @method setupCSS
     */
    setupCSS: function() {
        // CSS selector and Rule for styling to_self rows
        var selector = this.isUsingFakeTable ? 
                "div#" + this.liveGrid.tableId + " div.t1" :
                "table#" + this.liveGrid.tableId + " tr.t1" ;
        var ruleText = "color:" + DA.vars.config.toself_color;
        DA.dom.createCSSRule(selector, ruleText);
    },


    /**
     * Initialize a single instance of a Context-menu.
     * @method _setupContextMenu
     * @private
     */
    _setupContextMenu: function() {
        // TODO: need to review whether at all an id needs to be 
        //       a parameter for ContextMenuController 
        
        // Alias to DA.locale.GetText.t_
        var t_ =  DA.locale.GetText.t_;
        var t = function(key){
            return t_("MBOXGRID_ROWCONTEXTMENU_" + key);
        };

        // Utility function to pass the uid= parameter (ajx_ma_*)
        var asFidColonUid      = this._utils.asFidColonUid;
        // and the area= parameter 
        var asFidColonUidRange = this._utils.asFidColonUidRange;

        var MEvts = DA.mailer.Events; // MEvts -> Mailer Events
        var me = this;

        var togglerIO = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_flag.cgi' );

        // Setup th JSON-IO object for Export, and also it's callback and errorHandler
        var exportIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
        exportIO.errorHandler = function(e) {
            DA.util.warn(DA.locale.GetText.t_("EXPORT_ERROR"));
            DA.waiting.hide();
        };
        exportIO.callback = function(o) {
            var url,Proc;
            if (DA.mailer.util.checkResult(o)) {
                if (!DA.util.isEmpty(o.file)) {
                    if(DA.util.isNull(o.file_name)){
                        Proc = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=archive%26file=' + o.file;
                    }else{
                        Proc = DA.vars.cgiRdir + '/ma_ajx_download.cgi%3fproc=archive%26file=' + o.file + '%26file_name=' + o.file_name;
                    }
                    url = DA.vars.cgiRdir + '/down_pop4ajax.cgi?proc='+Proc;
                    DA.windowController.winOpenNoBar(url, '', 400, 450);
                } else {
                    DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
                }
            }
            DA.waiting.hide();
        };
        
        // Setup th JSON-IO object for Export, and also it's callback and errorHandler
        var saveToLibIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
        saveToLibIO.errorHandler = function(e) {
            DA.util.warn(DA.locale.GetText.t_("SAVE_TO_LIB_ERROR"));
            DA.waiting.hide();
        };
        saveToLibIO.callback = function(o) {
            var url;
            var Img  = 'pop_title_attachsave.gif';
            if (!DA.util.isEmpty(o.file)) {
                url = "lib_foldersel.cgi%3fcall=ma_detail%20path=" + o.file + "%20name=" + o.file_name + "%20is_for_save_mail=true";
                DA.windowController.isePopup(url, Img, 400, 550, DA.mailer.util.getMailAccount(), false);
            } else {
                DA.util.warn(DA.locale.GetText.t_("EXPORT_FILE_EMPTY"));
            }
            DA.waiting.hide();
        };

        // Setup th JSON-IO object for Filter, and also it's callback and errorHandler
        var filterIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_filter.cgi' );
        filterIO.errorHandler = function(e, actualArgs /*Reference to the original args to execute*/) {
            DA.util.warn(DA.locale.GetText.t_("FILTER_ERROR"));
            // Fire our Custom Event
            MEvts.onMessagesFilterFailure.fire({
                srcFid: actualArgs.fid
            });
            DA.waiting.hide();
        };
        filterIO.callback = function(o, actualArgs/*Reference to the original args to execute*/) {
            if (DA.mailer.util.checkResult(o)) {
                // Fire our Custom Event
                MEvts.onMessagesFiltered.fire({
                    srcFid:   actualArgs.fid,
                    response: o
                });
            }
            DA.waiting.hide();
        };

        // Setup th JSON-IO object for multipart/partial, and also it's callback and errorHandler
        var joinIO  = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_ma_move.cgi' );
        joinIO.errorHandler = function(e, actualArgs /*Reference to the original args to execute*/) {
            DA.util.warn(DA.locale.GetText.t_("JOIN_ERROR"));
            DA.waiting.hide();
        };
        joinIO.callback = function(o, actualArgs/*Reference to the original args to execute*/) {
            if (DA.mailer.util.checkResult(o)) {
                DA.mailer.windowController.viewerOpen(o.fid, o.uid);
            }
            DA.waiting.hide();
        };

        function toggleAllOn(selection, prop, isOff) {
            MEvts.onMessageFlagRequest.fire({
                messages: selection,
                property: prop,
                state:    isOff !== true
            });
        }

        function toggleAllOff(selection, prop) {
            return toggleAllOn(selection, prop, true);
        }

        function _mkIsSet_str(prop) {
            return function(mmdata) {
                return mmdata && mmdata[prop] && mmdata[prop].charAt(0) === '1';
            };
        }

        function _mkIsSet_int(prop) {
            return function(mmdata) {
                return mmdata && mmdata[prop] && mmdata[prop] === 1;
            };
        }
        
        function _mkIsSet_coerce(prop) {
            return function(mmdata) {
                var v;
                return mmdata && (v = mmdata[prop]) &&
                       (v === 1 || 
                        (v.charAt && v.charAt(0) === '1'));
            };
        }

        function printMail(selection) {
            var mmdata = me.getSelected().single;
            DA.windowController.winOpen(DA.vars.cgiRdir + '/ma_ajx_print.cgi?fid=' + selection.fid + '&uid=' + mmdata.uid , '', 710, 600);
        }

        function showMoveFolderDialog(x, y) {
            window.__mboxGrid.searchMoveFolderDialog.show(x, y);
        }

        /**
         * @function checkAll
         * @param selection {Object}  Object containing count, single,singles and/or ranges properties
         *                            (similar to the return value of getSelected)
         * @param f {Function} code to wrap. 
         */
        function checkAll(selection, f) {
            
            if (!selection || !selection.count || selection.count < 1) { return { none: true } ; }

            if (selection.count === 1) {
                if (selection.single && f(selection.single)) {
                    return { all: true };
                } else {
                    return { none: true };
                }
            }

            if (selection.ranges && selection.ranges.length > 0) {
                // Shift! stop trying to be very clever;
                return { some: true };
            }

            if (!selection.singles || selection.singles.length === 0 ) { return { none: true } ; }

            var falses = 0;
            var trues  = 0;

            var arr = selection.singles;

            arr.each(function (a) {
                if (f(a)) { ++trues; } else { ++falses; }
            });

            return arr.length === trues ? { all: true } :
                    arr.length === falses ? { none: true } : { some: true };
                    
        }

        var isFlagged = _mkIsSet_coerce("flagged");
        var isRead    = _mkIsSet_coerce("seen");

        // Wrapper to enable code reuse
        var mkSingleSelectHndlr = function (f) {
            return function (e, args) {
                var mmdata = me.getSelected().single; // REF: want single
                if (!mmdata) {
                    return;
                }
                return f(mmdata);
            };
        };

        // Wrapper to enable code reuse
        var mkMultiSelectHndlr = function (f) {
            return function(e, args) {
                var selection = me.getSelected();
                if (!selection || !selection.count) { return; }
                var singles = selection.singles ? selection.singles : 
                        selection.single ? [ selection.single ] : []; 
                
                var ranges = selection.ranges;
                ranges = (ranges && ranges.map) ? ranges : [];

                var fid  = selection.fid;
                var uidJobs = singles.map(asFidColonUid);
                var rangeJobs = ranges.map(asFidColonUidRange);

                return f(fid, uidJobs, rangeJobs);
            };
        };

        /*
         * Finally, creare rge ContextMenuController object. It will use a lot
         * of closures for it's onclicks, or functions generated by the functions
         * defined above (mkSingleSelectHndlr, mkMultiSelectHndlr, etc)
         */
        var contextMenu = new DA.widget.ContextMenuController(
            "da_mboxGridContextMenu", 
            this.liveGrid.tableId,
            {
                order: [
                   [ 'open' ],
                   [ 'reply', 'replyall', 'forward' ],
                   [ 'delete' ],
                   [ 'print' ],
                   [ 'markasread', 'markasunread', 'flag', 'unflag' ],
                   [ 'export', 'savetolib' , 'filter', 'join' , 'movefolder']
                ],
                items: {
                    open: {
                        text:    t('OPEN'),
                        onclick: mkSingleSelectHndlr(function(mmdata){
                            if (DA.util.cmpNumber(mmdata.open_m, 2)) {
                                if (DA.mailer.util.isBackupFolder(mmdata.type)) {   
                                    DA.mailer.windowController.editorOpenBackUp('edit', mmdata.fid, mmdata.uid, mmdata.backup_maid, mmdata.backup_org_clrRdir);
                                }else {
                                    DA.mailer.windowController.editorOpen('edit', mmdata.fid, mmdata.uid);
                                }
                            } else {
                                DA.mailer.windowController.viewerOpen(mmdata.fid, mmdata.uid, mmdata.srid);
                            }
                        })
                    },
                    reply: {
                        text:    t("REPLY"),
                        onclick: mkSingleSelectHndlr(function(mmdata){
                            DA.mailer.windowController.editorOpen('reply', mmdata.fid, mmdata.uid);
                        })
                    },
                    replyall: {
                        text:    t("REPLYALL"),
                        onclick: mkSingleSelectHndlr(function(mmdata){
                            DA.mailer.windowController.editorOpen('all_reply', mmdata.fid, mmdata.uid);
                        })
                    },
                    forward: {
                        text:    t("FORWARD"),
                        onclick: mkSingleSelectHndlr(function(mmdata){
                            DA.mailer.windowController.editorOpen('forward', mmdata.fid, mmdata.uid);
                        })
                    },
                    markasread: {
                        text:    t("MARKASREAD"), // toggles with MARKASUNREAD
                        onclick: function (e, args) {
                            toggleAllOn(me.getSelected(), 'seen');
                        }
                    },
                    markasunread: {
                        text:    t("MARKASUNREAD"), // toggles with MARKASUNREAD
                        onclick: function (e, args) {
                            toggleAllOff(me.getSelected(), 'seen');
                        }
                    },
                    flag: { // 'flag', the verb
                        text:    t("SETMARK"), // toggles with UNSETMARK
                        onclick: function (e, args) {
                            toggleAllOn(me.getSelected(), 'flagged');
                        }
                    },
                    unflag: { // 'un-flag', the verb
                        text:    t("UNSETMARK"), // toggles with UNSETMARK
                        onclick: function (e, args) {
                            toggleAllOff(me.getSelected(), 'flagged');
                        }
                    },
                    'export': {
                        text:    t("EXPORT"),
                        onclick: mkMultiSelectHndlr(function(fid, uidJobs, rangeJobs) {
                            DA.waiting.show(DA.locale.GetText.t_("EXPORT_OPERATING_PROMPT"));
                            exportIO.execute({
                                fid:  fid,
                                uid:  uidJobs.join(","),
                                area: rangeJobs.join(","),
                                archive: "1",
                                proc: "export"
                            });
                        })
                    },
                    savetolib: {
                        text:    t("SAVETOLIB"),
                        onclick: mkMultiSelectHndlr(function(fid, uidJobs, rangeJobs) {
                            DA.waiting.show(DA.locale.GetText.t_("SAVETOLIB_OPERATING_PROMPT"));
                            saveToLibIO.execute({
                                fid:  fid,
                                uid:  uidJobs.join(","),
                                area: rangeJobs.join(","),
                                archive: "1",
                                proc: "save_to_lib"
                            });
                        })
                    },
                    movefolder: {
                        text:    t("MOVEFOLDER"),
                        onclick: function (e, args) {
                            showMoveFolderDialog(e.clientX, e.clientY);
                        }
                    },
                    print: {
                        text:    t("PRINT"),
                        onclick: function (e, args) {
                            printMail(me.getSelected());
                        }
                    },
                    filter:   {
                        text:    t("RUNFILTER"),
                        onclick: mkMultiSelectHndlr(function(fid, uidJobs, rangeJobs) {
                            DA.waiting.show(DA.locale.GetText.t_("FILTER_OPERATING_PROMPT"));
                            MEvts.onMessagesFiltering.fire({ srcFid: parseInt(fid, 10) });
                            filterIO.execute({
                                fid:  fid,
                                uid:  uidJobs.join(","),
                                area: rangeJobs.join(","),
                                proc: "submit"
                            });
                        })
                    },
                    join:   {
                        text:    t("JOIN"),
                        onclick: mkMultiSelectHndlr(function(fid, uidJobs, rangeJobs) {
                            DA.waiting.show(DA.locale.GetText.t_("JOIN_OPERATING_PROMPT"));
                            joinIO.execute({
                                fid:  fid,
                                uid:  uidJobs.join(","),
                                area: rangeJobs.join(","),
                                proc: "join"
                            });
                        })
                    },
                    'delete': {
                        text:    t("DELETE"),
                        onclick: function(e, args) {
                            me.deleteSelected();
                        } 
                    }
                }
            },
            {
                onTrigger: function(e) { 
                    var row = me._getRowFromEvent(e);
                    if (!row) { /*TODO*/ return false; }
                    var rowMetaData = row.__daGridRowMetaData;

                    if (!rowMetaData || !rowMetaData.uid /*need at least a uid*/) {
                        return false; // No context for a context menu!
                    }

                    // Is the right-clicked row already selected?
                    if (!me.liveGrid.isSelected(rowMetaData)) {
                        // right-clicked on an unselected row; so we need to exclusively 
                        // select it first
                        me.setSelected(row, true /*select this row, unselecting all others*/, true);
                        me._lastClickedRowMetaData = rowMetaData; // This becomes the latest clicked row
                        me._lastClickedRow4RightButton = row;
                    }
                    var selected = me.getSelected();

                    if (!selected || !selected.count) { // If that fails, then too bad
                        return false;
                    }

                    // TODO: Think of a nice way to further modularize the 2 if-blocks below?

                    var visibles   = [];
                    var hiddens    = [];
                    var allRead    = checkAll(selected, isRead);
                    var allFlagged = checkAll(selected, isFlagged);
                    
                    if (selected.count > 1) { // stay in multi-select mode only if the context row is one of the selected
                        // TODO: refactor to "hide"
                        if (DA.mailer.util.isLocalFolder(rowMetaData.type) || DA.mailer.util.isBackupFolder(rowMetaData.type)) {
                            hiddens.push('open');
                            hiddens.push('reply');
                            hiddens.push('replyall');
                            hiddens.push('forward');
                            hiddens.push('export');
                            hiddens.push('filter');
                            hiddens.push('join');
                            hiddens.push('print');
                            hiddens.push('savetolib');
                            if (me.searchMode) {
                                visibles.push('movefolder');
                            } else {
                                hiddens.push('movefolder');
                            }
                            visibles.push('delete');
                        } else {
                            hiddens.push('open');
                            hiddens.push('reply');
                            hiddens.push('replyall');
                            hiddens.push('forward');
                            hiddens.push('print');
                            hiddens.push('savetolib');
                            if (me.searchMode) {
                                visibles.push('movefolder');
                            } else {
                                hiddens.push('movefolder');
                            }
                            visibles.push('export');
                            visibles.push('filter');
                            visibles.push('delete');
                            visibles.push('join');
                        }
                    } else {
                        if (DA.mailer.util.isLocalFolder(rowMetaData.type) || DA.mailer.util.isBackupFolder(rowMetaData.type)) {
                            hiddens.push('reply');
                            hiddens.push('replyall');
                            hiddens.push('forward');
                            hiddens.push('export');
                            hiddens.push('filter');
                            hiddens.push('join');
                            visibles.push('open');
                            visibles.push('delete');
                            visibles.push('print');
                            if (me.searchMode) {
                                visibles.push('movefolder');
                            } else {
                                hiddens.push('movefolder');
                            }
                            if ( DA.vars.config.save_to_lib ) {
                                visibles.push('savetolib');
                            } else {
                                hiddens.push('savetolib');
                            }
                        } else {
                            visibles.push('open');
                            visibles.push('reply');
                            visibles.push('replyall');
                            visibles.push('forward');
                            visibles.push('export');
                            if (me.searchMode) {
                                visibles.push('movefolder');
                            } else {
                                hiddens.push('movefolder');
                            }
                            if (me.searchMode) {
                                hiddens.push('filter');
                            } else {
                                visibles.push('filter');
                            }
                            hiddens.push('join');
                            visibles.push('delete');
                            visibles.push('print');
                            if ( DA.vars.config.save_to_lib ) {
                                visibles.push('savetolib');
                            } else {
                                hiddens.push('savetolib');
                            }
                        }
                    }
                    
                    if (DA.mailer.util.isLocalFolder(rowMetaData.type) ||
                        DA.mailer.util.isDraft(rowMetaData.type) ||
                        DA.mailer.util.isSent(rowMetaData.type)|| DA.mailer.util.isBackupFolder(rowMetaData.type)) {
                        hiddens.push('markasunread');
                        hiddens.push('markasread');
                    } else {
                        if (allRead.all) {
                            // All are read; show only the mark-as-unread option
                            hiddens.push('markasread');
                            visibles.push('markasunread');
                        } else if (allRead.none) {
                            // None are read; show only the mark-as-read option
                            hiddens.push('markasunread');
                            visibles.push('markasread');
                        } else {
                            // mixed; show both the options (mark-as-read, mark-as-unread)
                            visibles.push('markasunread');
                            visibles.push('markasread');
                        }
                    }
                    
                    if (DA.mailer.util.isLocalFolder(rowMetaData.type) || DA.mailer.util.isBackupFolder(rowMetaData.type)) {
                        hiddens.push('unflag');
                        hiddens.push('flag');
                    } else {
                        if (allFlagged.all) {
                            // All are flagged; show only the unflag option
                            hiddens.push('flag');
                            visibles.push('unflag');
                        } else if (allFlagged.none) {
                            // All are unflagged; show only the flag option
                            hiddens.push('unflag');
                            visibles.push('flag');
                        } else {
                            // mixed; show both options
                            visibles.push('unflag');
                            visibles.push('flag');
                        }
                    }

		    DA.customEvent.fire("mboxGridSetupContextMenuOnTriggerAfter", this, {
			meta: rowMetaData,
			hiddens: hiddens,
			visibles: visibles,
			selected: selected
		    });
                    
                    hiddens.each(this.hidden.bind(this));
                    visibles.each(this.visible.bind(this));
                    
                    // disable the mouse scroll for a bit
                    me.liveGrid.scroller.disableMouseScroll();
                    return true; // If we made it here, all is OK; display the menu
                },
                onCancel: function() {
                    if (me._lastClickedRow4RightButton) {
                        me.setUnSelected(me._lastClickedRow4RightButton);
                    }
                    me.liveGrid.scroller.enableMouseScroll();
                }
            }
        );

    },


    /**
     * TODO: This ought to be in VirtualScrollingTable; it's general, no?
     * Destructively converts the columns property's widths to percentages
     * instead of pixels.
     * @method _percentify
     * @private
     */
    _percentify: function() {
        var widths = this.columns.pluck('width');
        if (widths.grep('%').first()) {
            return; // WHOA! already in percentage. out!
        }
        var percs = DA.util.toPercentages(widths);

        // FIXME: This should probably use something like _fairPercentages (tables.js)
        percs = percs.map(Math.floor);

        this.columns.each(function(col, index){
            // FIXME: 0-rounded-to-1 hack
            col.width = Math.max(1,percs[index]) + '%';
        });
    },


    /**
     * Connect the Grid to the given IMAP folder (by id).
     * This initializes the LiveGrid object if not yet created.
     * @method changeFolder
     * @param id {Int} Folder ID (IMAP folder to switch to)
     */
    changeFolder: function(id, type) {
        if (id) {
            id = parseInt(id, 10);
        } else {
            id = 0;
        }
        var sameFolder = id === this.folderId;
        this.folderId   = id; // TODO: needed?
        this.folderType = type;
        this.setFolderMode();
        if (!sameFolder && this.liveGrid) {
            this.liveGrid.removeColumnSort();
        }
        this._lazyCreate({fid: id, search_field: '', search_word: ''}, (!sameFolder) /*Perform a param reset only if the folder has changed*/ );
        if (!sameFolder) {
            this.onFolderChanged.fire({
                fid:  id,
                type: type
            });
            if (this.fromColumnIndex) {
                if (DA.mailer.util.isDraft(type) || DA.mailer.util.isSent(type) || DA.mailer.util.isLocalFolder(type) || DA.mailer.util.isBackupFolder(type) ) {
                    this.liveGrid.setColumnTitle(this.fromColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_TO'));
                }else {
                    this.liveGrid.setColumnTitle(this.fromColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_FROM'));
                }
            }
            if(this.dateColumnIndex) {
                if(DA.mailer.util.isBackupFolder(type)) {
                    this.liveGrid.setColumnTitle(this.dateColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_BACKUP_DATE'));
                }else {
                    this.liveGrid.setColumnTitle(this.dateColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_DATE'));
                }
            }
            if(this.sizeColumnIndex) {
                if(DA.mailer.util.isBackupFolder(type) || DA.mailer.util.isLocalFolder(type)) {
                    this.liveGrid.setColumnTitle(this.sizeColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_BACKUP_SIZE'));
                }else {
                    this.liveGrid.setColumnTitle(this.sizeColumnIndex, DA.locale.GetText.t_('MBOXGRID_COLUMNTITLE_SIZE'));
                }
            }
        } 
    },

    
    clear: function() {
        this.folderId = 0;
        this.liveGrid.clear();
    },


    /**
     * @property onFolderChanged
     * @type  {Object} instance of YAHOO.util.CustomEvent
     * @param arg {Object} hash, with property fid
     */
    onFolderChanged: null,


    /**
     * @property onDoubleClick
     * @type  {Object} instance of YAHOO.util.CustomEvent
     * @param arg {Object} mail meta-data.
     */
    onDoubleClick:   null,

    /**
     * 新着数 - Simple search, within the currently set folder.
     * @method searchInCurrentFolder
     * @param sField {String}
     * @param sText  {String}
     */
    searchInCurrentFolder: function(sField, sText) {
        if (this.searchMode) { 
            // 詳細検索モード
            return; // error, no operation
        }

        if (this.folderId) { // We have a valid, non zero folder ID
            if (sField && sText) {
                this._lazyCreate({
                    fid:            this.folderId,
                    search_field:   sField,
                    search_word:    sText
                });
            } else {
                this._lazyCreate({
                    fid:            this.folderId
                }, true /*reset*/);
            }

        } else { // can't search within a folder...
        } 
    },



    /**
     * Refresh the contents of the folder.<p>
     * Just refreshes the liveGrid (VirtualScrollingTable) with it's current
     * parameters (start, end, etc)
     * @method refresh
     */
    refresh: function() {
        if (!this.liveGrid) {
            return;
        }
        // Call update with an empty hash, and pass in false. This will ensure that
        // the liveGrid refreshes with it's currently set parameters unchanged.
        this.liveGrid.update({} /*empty options*/, false /*no change in the parameters, no reset*/);
    },


    /**
     * Support for DA.session.UIState
     * @method   getUIStateInfo
     * @returns  {Object/Hash} Hash of UI state information (current width of columns, etc)
     */
    getUIStateInfo: function() {
        // Get the UI state info of our LiveGrid 
        var gridUIInfo = this.liveGrid ? this.liveGrid.getUIStateInfo() : null;
        return gridUIInfo; // Just return as-is for now; will probably add keys,values to this later
    },


    /**
     * Go to search-mode
     * @method setSearchMode
     */
    setSearchMode: function () {
        if (this.searchMode) { return; }
        this.searchMode = true;
        this.url = DA.vars.cgiRdir + '/ajx_ma_search.cgi';
    },

    /**
     * Go to folder mode. This is the default.
     * @method setFolderMode
     */
    setFolderMode: function () {
        if (this.searchMode) {
            this.searchMode = false;
            delete this.url; // revert to the prototype
        }
    },

    /**
     * Populate the grid with search results.
     * @method loadSearchResults
     * @param totalMessages {Int} total number of messages found.
     * @param fid           {Int} the folder ID
     * @param srid          {Int} search results id.
     */
    loadSearchResults: function(totalMessages, fid, srid, type) {
        this.folderId   = fid;
        this.folderType = type;
        this.setSearchMode();
        this._lazyCreate({fid: fid, srid: srid});
        this.liveGrid.metaData.setTotalRows(totalMessages);
    },


    /**
     * FIXME: need a better name?
     * @param bResetOptions {Boolean} if true, will cause the JSON-IO's params to
                                      be set to the args, instead of merged with them.
     */
    _lazyCreate: function (args, bResetOptions) {

        if (!this.liveGrid) { // Lazy creation
            this.initLiveGrid(args, bResetOptions); 
        } else {
            // update (either we are loading search results, or changing folders)
            this.isInMutliSelect = false;  // Multiple selection does not survive folder changes
            this.setAllUnSelected();
            this.liveGrid.update(args, bResetOptions);
            if(bResetOptions === false) {$('mboxGrid_search_keyword').value='';}
        }
    },


    _generateFakeTable: function(id, nrows, columns /*ignore this, I guess*/) {

        var div = document.createElement('div');
        // IE only, but I guess it doesn't hurt
        div.onselectstart = div.onselect = function() { return false; } ;
        div.rows = []; // table emulation
        var rowdiv;

        // To fool LiveGrid, rico.js, version 1.1.2 (rico.js: Line: 2261)
        // or see rico-livegrid.js, Line: 630
        var undefArr = columns.map(function (c){ return null; });

        var i = 0;
        for (i = 0; i < nrows; ++i) {
           rowdiv = document.createElement('div');
           rowdiv.cells = undefArr; // table emulation
           rowdiv.id = 'rowdiv' + i; // Not used, but attaching anyway; useful for DOM-debugging
           rowdiv.className = 'da_rowdiv';
           div.appendChild(rowdiv);
           div.rows[i] = rowdiv;
        }

        div.id = id;
        return div;
       
    },



    _generateTableHTML: function(id, nrows, columns) {
        var sb = [];
        var i = 0;
        sb.push('<table id="' + id + '" onselectstart="return false;"><colgroup>');
        var tds = "";
        columns.each(function(col){
            sb.push('<col width="' + col.width + '"/>');
            tds += ("<td class='" + col.key + "'>&nbsp;</td>");
        });
        sb.push('</colgroup>');
        sb.push('<tbody>');
       
        for (i = 0; i < nrows; ++i) {
           sb.push("<tr> " + tds + "\n");
           sb.push('</tr>');
        }
        
        sb.push('</tbody>');
        sb.push('</table>');
        return sb.join('');
       
    },

    /**
     * Flag to indicate whether or not to enable the Fake-table optimization: 
     * If set to true, this will cause LiveGrid (DA.widget.VirtualScrollingTable) 
     * to enable a hack based on the use of DIVs formatted as a table instead
     * of a real TABLE to render grid rows and cells. This greatly boosts
     * performance (Grid redrawing time) on IE (at least).
     * @property isUsingFakeTable 
     * @type {boolean}
     */
    isUsingFakeTable: true,

    
    /**
     * Sets up an instance of VirtualScrollingTable that the MboxGrid will use.
     * (this.liveGrid)
     * This also sets up Event handlers for left click (selection), right-click
     * (context menu) and double-click (open mail in new window), before
     * finally setting up the 'selectionCache'.
     * @method initLiveGrid
     * @param  id {Int} initial folder ID. // FIXME
     */
    initLiveGrid: function(args) {

        if (this.liveGrid !== null) { 
            return;
        }
        
        var tblId = 'mbox_grid_' + (new Date()).getTime();
        var tblRows = DA.vars.system.max_number_per_page4ajx + 1 || 41;

        if (this.isUsingFakeTable) {
            this.containerElem.appendChild(this._generateFakeTable(tblId, tblRows, this.columns));
            // Use the Fake-table row finder for the Event delegation.
            this._rowLocator = function(div) {
                return div.parentNode && div.parentNode.id === tblId;
            };
        } else {
            this.containerElem.innerHTML += this._generateTableHTML(tblId, tblRows, this.columns);
        }

        this.liveGrid =  new DA.widget.VirtualScrollingTable ({
            visibleRows:      this.visibleRows,
            maxVisisbleRows:  tblRows - 1, // FIXME: hack needed because Rico is funny (this.visibleRows = visibleRows+1; // ?)
            url:              this.url,
            urlParams:        args,
            resizableColumns: true,
            onLoading:        this.onLoading,
            onLoadDone:       function () {
                                  this._onLoadDone();
                                  this.onLoadDone();
                              }.bind(this),
            table:            $(tblId),
            isUsingFakeTable: this.isUsingFakeTable,
            columns:          this.columns,
            containerElem:    this.containerElem
        });
		var me = this;
		this.liveGrid.getSelected = function(){
			return me.getSelected();
		};

        this.liveGrid.isIORequired = function(){
            return this.folderId > 0;
        }.bind(this);


        // IE vs. W3C cached checks for the event handlers below
        var LEFT_BTN = BrowserDetect.browser === 'Explorer' ? 1 /*IE*/ : 0 /*W3C*/;
        // See http://www.quirksmode.org/js/events_properties.html

        // Setup the single-click listener: 2 stages are required: Mouse-up and Mouse-down.

        /*
         * Setup MOUSE-DOWN:  Stuff happens in mouse-down IF and ONLF if
         * NO modifiers (SHIFT/CTRL) are present in the event, and
         * The clicked row is not already selected.
         */
        YAHOO.util.Event.on(this.liveGrid.tableId, 'mousedown', function(e) {
            if (e.button !== LEFT_BTN) { 
                // Only bother about left-click
                return; 
            }
            this._isBeingDragged = false;
            var hasMods = e.shiftKey || e.ctrlKey; // Has SHIFT or CTRL modifiers?
            if (hasMods) {
                if (this.searchMode) {
                    YAHOO.util.Event.stopEvent(e);
                }
                return; /*if yes, then leave the rest to the mouseup handler*/ 
            }
            var row = this._getRowFromEvent(e);
            var isAlreadySelected = row && this.liveGrid.isSelected(row.__daGridRowMetaData);
            if (isAlreadySelected) { return; /*do nothing if the row is already selected*/ }

            // The actual click-handling
            this._handleRowClicked(row, false); // false, not a double-click
            YAHOO.util.Event.stopEvent(e);

        }, true, this);
        
        /*
         * Setup MOUSE-UP:  Stuff happens in mouse-up IF and ONLF if
         * either a SHIFT/CTRL modifier is presest, or
         * the row is an already selected one.
         */
        YAHOO.util.Event.on(this.liveGrid.tableId, 'mouseup', function(e) {
            if (e.button !== LEFT_BTN) { 
                // Only bother about left-click
                return; 
            }
            var hasMods = e.shiftKey || e.ctrlKey; // Has either SHIFT or CTRL modifiers?
            // If we're out of shift-clicks, then discard the origin marker for the shift range
            if (!e.shiftKey) { this._shiftRangeOriginMeta = null; }
            var row = this._getRowFromEvent(e);
            var rowMetaData = row ? row.__daGridRowMetaData : null;
            var isAlreadySelected = row && this.liveGrid.isSelected(rowMetaData);
            if (!hasMods && !isAlreadySelected) { //
                // Nothing for mouseup to do
                return;
            }
            if (!hasMods && isAlreadySelected && !this._isBeingDragged) {
                this.isInMutliSelect = false;
                this._handleRowClicked(row); // This will also unselect all the others.
                return; // done.
            }


                // SHIFT gets priority over CTRL
                if (e.shiftKey) {
                    // Process a SHIFT-selection request that will select
                    // all rows (from the previous selected row) to the given row.
                    this.setRangeEnd(rowMetaData);
                }

                if (e.ctrlKey) {
                    this.isInMutliSelect = true;
                    if (isAlreadySelected) { // reverse the selection (de-select)
                        if (this._checkShiftRanges(rowMetaData)) {  // If the row is NOT within an existing shift range
                            this._deflateRanges(); // try deflating the ranges.
                        }
                        this.setUnSelected(row);
                    } else {
                        this.setSelected(row, false/*do not clear the others*/);
                    }
                }
            

            // Save a reference to the clicked row.
            this._lastClickedRowMetaData = rowMetaData;

        }, true, this);

        // Setup the double-click listener
        YAHOO.util.Event.on(this.liveGrid.tableId, 'dblclick', function(e) {
            var row = this._getRowFromEvent(e);
            this._handleRowClicked(row, true); // true indicates a double-click
        }, true, this);

        // Setup the context menu
        this._setupContextMenu();

        // Set up a cache that helps track which mails are selected.
        this.initSelectionCache();

        // Key bindings?
        YAHOO.util.Event.on(window.document, 'keydown', function (evt) {
            var k = YAHOO.util.Event.getCharCode(evt);
            if (!this._lastClickedRowMetaData) {    // TODO: using _lastClickedRowMetaData
                return;                             // as a shirt-circuit is not 100% reliable.
            }                                       // Consider the case when the CTRL-key
                                                    // unselects the only selected mail: a 
                                                    // reference to _lastClickedRowMetaData
                                                    // remains, though it should not.
            var el = Event.element(evt);
            if (el.tagName !== "INPUT") {
                switch(k) {
                    case Event.KEY_DOWN:
                        this._handleArrowDown();
                        break;
                    case Event.KEY_UP:
                        this._handleArrowUp();
                        break;
                    case Event.KEY_DELETE:
                        this._handleDelete();
                        break;
                    default:
                }
            }
        }, true, this);
    },


    /**
     * Event that is fired whenever the selection (messages selected in the grid) is
     * modified.
     * @property onSelectionChanged
     * @type {Object} Instance of YAHOO.util.CustomEvent
     */
    onSelectionChanged: null,


    /**
     * Cursor key handler: down-arrow.
     * Just a wrapper to _handleArrowKey; useful for adding 
     * debug/trace log messages.
     * @private
     * @method _handleArrowDown
     */
    _handleArrowDown: function () {
        this._handleArrowKey(1);
    },
    
    /**
     * Cursor key handler: down-up.
     * Just a wrapper to _handleArrowKey; useful for adding 
     * debug/trace log messages.
     * @private
     * @method _handleArrowUp
     */
    _handleArrowUp: function () {
        this._handleArrowKey(-1);
    },

    /**
     * Key handler: delete.
     * @private
     * @method _handleDelete
     */
    _handleDelete: function() {
        this.onDeletePress();
    },

    /**
     * Based on the given numerical offset, moves the selection
     * n rows down (or up, if n is negative). This will cause the
     * viewport to scroll the selection into view.
     * TODO: (1) Multi-sepection modes? CTRL? SHIFT?
     * @private _handleArrowKey
     * @param   n {Number} offset
     * @method _handleArrowKey
     */
    _handleArrowKey: function (n) {
        // First find the last clicked row.
        var lastMMData  = this._lastClickedRowMetaData,
            // Next, where are we presently?
            range       = this._getViewPortRange(),
            lastSno     = lastMMData.sno,
            startSno    = range.start + 1,
            endSno      = range.end + 1,
            vpSize      = endSno - startSno - 1,
            targetSno   = lastSno + n,
            row,
            only        = true;                     // Only one row.

        // IE: Keep focus of scroll bar problem.
        this.containerElem.focus();
        
        // Are we in range?
        if (targetSno < startSno + 1) {
            // Either we are out of visual range,
            // or we are about to leave it. Correct this!
            this.liveGrid.scroller.              // -1: sno is 1-indexed
                moveScroll(targetSno -1 -1);   // -1: some space
        }
        if (targetSno > endSno - 1) {
            // Either we are out of visual range,
            // or we are about to leave it. Correct this!
            this.liveGrid.scroller.                     // -1: sno is 1-indexed
                moveScroll(targetSno -1 -vpSize  +1);  // +1: some space
        }

        // find the desired row in the buffer.
        var findRow = function() { // FIXME: unnecessary closure?
            var targetPosInBuffer = this._findPositionInBuffer(lastMMData) + n;
            // FIXME: Direct access to buffer.rows!
            var target = this.liveGrid.buffer.rows[targetPosInBuffer];
            return target ? this.findRowByMMData(target.meta) : null;
        }.bind(this);

        row = findRow(); // Try it now.

        if (row) { // Got it. Select the row NOW!
            this.setSelected(row, only, false, true); // TODO: multiple?
            this._lastClickedRowMetaData = row.__daGridRowMetaData;
        } else {
            // Probably a reload will need to take place
            this._scheduleJobOnLoadDone(function () {
                    var row = findRow();
                    // got it at last?
                    if (row) { 
                        this.setSelected(row, only, false, true);
                        this._lastClickedRowMetaData = row.__daGridRowMetaData;
                    } else { // forget it.
                        // This should never happen!
                    }
            });
        }
    
    },


    /**
     * Reference to the metadata of the most recently clicked row.
     * @property _lastClickedRowMetaData
     * @private
     * @type {Object}
     */
    _lastClickedRowMetaData: null,

    _lastClickedRow4RightButton: null,

    /**
     * One-call init method that sets up a cache which keeps a track of which
     * mails are currently selected.
     * @method initSelectionCache
     */
    initSelectionCache: function() {
       
        var me = this;

        // Private variable, thanks to the closures below.
        var hash = {};        // CTRL selections
        var shiftRanges = []; // SHIFT selections

        // TODO: Profile this
        this._checkShiftRanges = function(mdata, _shiftRanges) {
            _shiftRanges = _shiftRanges || shiftRanges;
            var i, srLen = _shiftRanges.length, sr;
            var sno = parseInt(mdata.sno, 10); // FIXME: this may be slow
            for (i=0; i<srLen; ++i) { // This needs to be as fast as possible
                sr = _shiftRanges[i];
                if ((sr.start.sno <= sno) && (sr.end.sno >= sno)) {
                    return true;
                }
            }
            return false;
        };

        // Helper function to get the number of rows in a range
        function rowsInRange(nA/*initial number*/, oSR /*shift range*/) {
            if (!oSR.count) { 
                oSR.count = Math.max(0, (oSR.end.sno - oSR.start.sno) + 1); 
            }
            return nA + oSR.count;
        }

        // Use a simple String as the key: $fid_$uid.
        var lg = this.liveGrid;
        // This (isSelected) will be invoked by populateRow (Rico) to see whether or
        // not to apply the 'da_gridSelectedRow' CSS class.
        lg.isSelected = function(mdata) {
            if (!mdata) { return false; }
            // hack to support handling LiveGridBuffer rows 
            mdata = mdata.meta || mdata; // FIXME: This works only for Fake-table
            if (hash[mdata.fid + '_' + mdata.uid]) {  
                return true;
            }
            if (shiftRanges.length < 1) {
                return false;
            }
            return me._checkShiftRanges(mdata);
        };


        /**
         * Use this function to debug:
         * function foo () { var sel = $H(__mboxGrid.getSelected()); 
         *   print (sel.inspect()); 
         *   if(sel.ranges) {sel.ranges.each(function(r){print(r.start.sno+"-"+r.end.sno)}); } 
         *   if(sel.singles) {sel.singles.each(function(r){print($H(r).inspect())}); } 
         * } 
         * TODO: Profile!
         */
        this.getSelected = function() {
            var h = $H(hash);
            var mmdatas = h.values(); // FIXME: slow
            var first = mmdatas.first();
            var identity = me._getIdentity(); // Who are we?

            // FIXME: slow?
            var count = shiftRanges.inject(mmdatas.length, rowsInRange);
                        
            if (count === 0) {
                return {
                    count:    0,
                    single:   null,
                    singles:  [],
                    identity: identity,
                    ranges: []
                };
            }

            first = mmdatas.first() || shiftRanges.first().start;

            if (count === 1) {
                return {
                    count:  1,
                    single: first,
                    singles: [ first ],
                    fid:    first.fid,
                    srid:   first.srid,
                    identity: identity,
                    ranges: []
                };
            }
            
            return {
                count:   count, // Number of messages selected
                singles: mmdatas,
                ranges:  shiftRanges,
                fid:     first.fid,
                srid:    first.srid,
                identity: identity
            };

        };

        this.onSelectionChanged = new YAHOO.util.CustomEvent("onSelectionChanged");

        // Wrapper to fire our custom event
        function fireAsync(right, key) {
            setTimeout(function(){
                me.onSelectionChanged.fire( me.getSelected(), right, key );
            }, 40);
        }

        // helpers
        var addMMData = function (oRowOrMMData /*Either row {HTMLElement}, or meta-data*/) {
            // NOTE: This is NOT an erroneous null-pointer check; we actuall WANT
            //       to treat oRowOrMMData as HTMLElement with an attached __daGridRowMetaData,
            //       which if it is absent, we assume that oRowOrMMData is the meta-data itself
            var mdata = oRowOrMMData.__daGridRowMetaData || oRowOrMMData;
            var key = mdata.fid + '_' + mdata.uid; // String for the hash key
            hash[key] = mdata;
        };
        var deleteMMData = function (oRowOrMMData /*Either row {HTMLElement}, or meta-data*/) {
            // NOTE: See comments for addMMData
            var mdata = oRowOrMMData.__daGridRowMetaData || oRowOrMMData;
            var key = mdata.fid + '_' + mdata.uid; // String for the hash key
            delete hash[key];
        };
        // The methods below provide the actual implementation for 
        // setSelected, setUnSelected
        this.setSelected = function(rows, only, right, key) {
            if (only && only===true) { 
                hash = {}; // empty the singles (CTRL) cache
                shiftRanges.clear(); /*empty the SHIFT ranges*/
                // modify apppearance
                YAHOO.util.Dom.removeClass(lg.table.rows, 'da_gridSelectedRow');
            }
            // YAHOO does batching for us
            YAHOO.util.Dom.addClass(rows, 'da_gridSelectedRow');
            (rows.length ? rows : [rows]).each(addMMData);
            // Tell the world that our selection buffer has been modified
            fireAsync(right, key);
        };
        this.setUnSelected = function(rows) {
            // YAHOO does batching for us
            YAHOO.util.Dom.removeClass(rows, 'da_gridSelectedRow');
            (rows.length ? rows : [rows]).each(deleteMMData);
            fireAsync();
        };
        this.setAllUnSelected = function() {
            YAHOO.util.Dom.removeClass(lg.table.rows, 'da_gridSelectedRow');
            hash = {}; // empty the singles (CTRL) cache
            shiftRanges.clear(); /*empty the SHIFT ranges*/
            me._lastClickedRowMetaData = null;
            me._shiftRangeOriginMeta = null;
            fireAsync();
        };

        // When LiveGrid (VirtualScrollingTable) wants to clear the selection, use setAllUnSelected
        lg.clearSelection = this.setAllUnSelected.bind(this);

        /**
         * Used by the SHIFT-select modifier to select a contiguous range of messages.
         * From the previously selected row to the given row, select all messages
         * @method setRangeEnd
         * @param  meta {Object} LiveGrid (VirtualScrollingTable) Grid-row meta data.
         */
        this.setRangeEnd = function (meta) {
            if (!meta) { return; }
            me._shiftRangeOriginMeta = me._shiftRangeOriginMeta || me._lastClickedRowMetaData;
            var rangeOriginMeta = me._shiftRangeOriginMeta;
            if (!rangeOriginMeta) {
                return;
            }
            hash = {}; // Forget any CTRL selections
            var sno = parseInt(meta.sno, 10);

            shiftRanges.clear(); // clear the previous ones
            me.isInMutliSelect = false;

            rangeOriginMeta.sno = parseInt(rangeOriginMeta.sno, 10);
            meta.sno = parseInt(meta.sno, 10);

            var start = rangeOriginMeta.sno < meta.sno ? rangeOriginMeta : meta;
            var end   = rangeOriginMeta.sno > meta.sno ? rangeOriginMeta : meta;

            shiftRanges.push({ start: start, end: end });

            // FIXME: This works, but looks naive 
            $H(hash).each(function(pair){
                var md = pair.value;
                if (md && me._checkShiftRanges(md)) {
                    delete hash[pair.key];
                }
            });
            me.liveGrid.viewPort.updateSelectionStatus();
            fireAsync();
            // Try to deflate as much as possible, as early as possible
            me._deflateRanges();

        };


        /*
         * Utility functions used by method _deflateRanges
         */
        // Copy a shift-range node
        function copyRangeNode (rn) {
            return { sno:  rn.sno,
                uid:  rn.uid,   fid:  rn.fid,
                srid: rn.srid,  type: rn.type };
        }
        // Add all mail-meta-data with sno between nStart, nEnd to singles (hash)
        function addToSingles(nStart, nEnd, aMMData) {
            var offset = aMMData.first().sno;
            var iEnd = nEnd - offset;
            var mmdata;
            for (var i = (nStart-offset); i <= iEnd; ++i) {
                mmdata = aMMData[i];
                if (mmdata) { 
                    addMMData(mmdata);
                }
            }
        }
        // Return an object suitable as a start/end node in a shift range
        // that corresponds to the given sno (nSno); looks for it in the
        // given array of mail-meta-data, or returns undefined.
        function mkRangeNode (nSno, aMMData) {
            var offset = parseInt(aMMData.first().sno, 10);
            var mmdata = aMMData[nSno - offset];
            if (!mmdata) {
                // Not available in buffer; we refuse to decide
                return undefined;
            }
            return copyRangeNode(mmdata);
        }

        /**
         * @method clipRange
         * @private
         * @param nSRStart
         * @param nSREnd
         * @param nStart
         * @param nEnd
         * @returns {Array} of Arrays, (AoA), each array containing exactly 2 numbers (start, end)
         */
        function clipRange (nSRStart, nSREnd, nStart, nEnd) {
            var newRanges = [];
            var startChunk = Math.max(0, nStart - nSRStart); 
            var endChunk   = Math.max(0, nSREnd - nEnd);
            if (startChunk === 0 && endChunk === 0) {
                // Clipped everything
            } else {
                if (startChunk) {
                    newRanges.push([nSRStart, nStart]);
                }
                if (endChunk) {
                    newRanges.push([nEnd, nSREnd]);
                }
            }
            return newRanges;
        }

        /**
         * Helper method to normalize (as much as possible) the shift-ranges (if any)
         * into individual singles of mail-meta-data.
         * Calling this method (it takes no params, returns nothing) will
         * usually result in the conversion of all shift-ranges to singles
         * (see method: getSelected), when possible, or at least try to convert
         * as much as possible of the ranges to singles.
         * @method _deflateRanges
         * @private
         */ 
        this._deflateRanges = function () {
            if (shiftRanges.length < 1) { return; }
            // FIXME: Directly accessing buffer.rows, which is private
            // FIXME: plucking meta like this is (a) Fake-table-only, and (b) slow
            // rows is an array of the currently available LiveGridBuffer's row meta-data,
            // which in this case is an array of mail-meta-data objects.
            var rows = me.liveGrid.buffer.rows.pluck('meta');
            if (rows.length < 1) { return; }
            var bStart = rows.first().sno;   // sno of the starting meta-data of the buffer
            var bEnd   = rows.last().sno;    // sno of the last meta-data of the buffer
            // Make sure we are dealing with integers
            bStart = parseInt(bStart, 10);
            bEnd   = parseInt(bEnd, 10);

            // Find intersections, and splice, and/or expand the current ranges, storing
            // the resulting ranging in:
            var newRanges = []; // temporary working array to hold the new shift-ranges
            // Examine each shift-range for intersecting regions with the currently
            // available LiveGrid buffer's row meta-data
            shiftRanges.each(function (sr) {
                var rStart = sr.start.sno;   // The start sno of the shift range
                var rEnd   = sr.end.sno;     // and the end sno
                // sno could be a string; make sure it is a number
                rStart = parseInt(rStart, 10);
                rEnd   = parseInt(rEnd, 10);

                if (rEnd <= bStart || rStart >= bEnd) { // OUT of range; ignore this.
                    newRanges.push(sr);
                    return;
                } 
                // start and end of the intersecting regions
                var start = Math.max(rStart, bStart);
                var end   = Math.min(rEnd,  bEnd);
                // The intersection region holds a contiguous array of meta-data
                // that can be expanded to singles
                addToSingles(start, end, rows);  // adds all meta-data with
                                                 // sno from start to end
                // Compute which part(s) of the shift-range were not it the
                // intersection
                var clippings = clipRange(rStart, rEnd, start, end);
                // Create new ranges for each 'unresolved' region 
                // (unresolved, in that the clipped region does not intersect
                // with the currently available mail-meta-data buffer)
                clippings.each(function (aClip) {
                    var startNode = mkRangeNode( aClip[0], rows ) || sr.start;
                    var endNode   = mkRangeNode( aClip[1], rows ) || sr.end;
                    newRanges.push({
                        start: startNode,
                        end:   endNode
                    });
                    // We track these in the edges of the shift-range, so we
                    // can remove them from the MMData hash
                    deleteMMData(startNode);
                    deleteMMData(endNode);
                });
            });
            
            // Copy the working array of shift-ranges to the actual, main array
            // that stores them 
            shiftRanges.clear(); // (before clearing the old one out)
            var tmp;
            while ((tmp = newRanges.pop())) {
                shiftRanges.push(tmp);
            }
            shiftRanges.reverse(); // ! destructive reverse, because we need to
        };

    },

    /**
     * Reference to the meta-data of the row that acts as the origin for 
     * the shift selection range
     * @property _shiftRangeOriginMeta
     * @type {Object}
     * @private
     */
    _shiftRangeOriginMeta: null,

    /**
     * Marks the mail as 'selected'.
     * This does not update the appearance of the row right away; the actual setting
     * up of the CSS to make the row appear selected needs to be done by the click event
     * (or the Rico table row-refresh)
     * TODO: Can't be be a part of VirtualScrollingTable?
     * @method setSelected
     * @param mdata {Object}  metadata of the selected mail.
     * @param only  {boolean} (Optional )if TRUE, then deselect all others.
     */
    setSelected:   Prototype.emptyFunction, // Function will be actually created by initSelectionCache

    /**
     * Marks the mail as 'unselected'.
     * This does not update the appearance of the row right away; the actual setting
     * up of the CSS to make the row appear unselected needs to be done by the click event
     * (or the Rico table row-refresh)
     * TODO: Can't be be a part of VirtualScrollingTable?
     * @method setUnSelected
     * @param mdata {Object}  metadata of the mail to unselect.
     */
    setUnSelected: Prototype.emptyFunction, // Function will be actually created by initSelectionCache

    /**
     * Determine which row of the grid's HTMLTableElement the event is associated
     * with.
     * @method _getRowFromEvent
     * @param e {Object} event
     * @return {HTMLTableRowElement}
     * @private
     */
    _getRowFromEvent: function(e) {
        var target = YAHOO.util.Event.getTarget(e);
        return DA.dom.findParent(target, this._rowLocator, 5);
    },

    /**
     * @property _rowLocator
     * @type {String}
     * @type {function} // Gotta love Javascript
     * @private
     */
    _rowLocator: 'TR', // default row locator is just a String to match the parent tagnames...

    /**
     * handles the row click/selection; for double-click events, additionally
     * fires the onDoubleClick custom event.
     * @method _handleRowClicked
     * @private 
     * @param row      {HTMLTableRowElement}  the clicked row.
     * @param isDouble {boolean} was this a double-click? 
     */
    _handleRowClicked: function(row, isDouble) {

        if (!row) {
            return;
        }

        var mdata = row.__daGridRowMetaData; // FIXME: hack

        // TODO: review: if we cannot find metadata for a row,
        //       then just do nothing. Is this correct?               
        if (!mdata) { 
            return; 
        }

        if (!mdata.fid || !mdata.uid) {
            return;
        }
        
        // Save a reference to the clicked row.
        this._lastClickedRowMetaData = mdata;
        
        // Set only this row as selected
        this.setSelected(row, true/*unselecting all others*/);
       
        var onDoubleClick = this.onDoubleClick;

        if (isDouble) {
            setTimeout( function () {
                onDoubleClick.fire( mdata );
            }, 100);
        }

    },

    /** 
     * Proxy to liveGrid
     */
    resizeHeight: function(h) {
        this.liveGrid.resizeHeight(h, true);
    },

    onLoading:  Prototype.emptyFunction,

    onLoadDone: Prototype.emptyFunction,

    onDeletePress: Prototype.emptyFunction,

    /* Sometimes we want something to happen later; 
     * for example, when the underlying liveGrid  
     * recieves fresh data from the server, at some
     * point in the future. 
     * We might want some code to be executed at that
     * point of time, but the code (and the logic)
     * is available only now, and not later.  
     *
     * Solution: * Use closures. We 'schedule'
     * a list of jobs to be executed at onLoadDone,
     * each job a closure that will be invoked in 
     * order.
     *
     * _scheduleJobOnLoadDone does this.
     */ 


    /**
     * Maintain a list of jobs to run each time new data
     * has been successfully loaded. 
     * @private
     * @field _onLoadDoneJobs 
     * @type Array (of functions)
     */
    _onLoadDoneJobs: [], 


    /**
     * Runs a sequence of queued jobs; this is typically
     * stuff that could not be done until data has been
     * re-loaded.
     * @private
     * @method _onLoadDone
     */  
    _onLoadDone: function () {
        var jobs = this._onLoadDoneJobs,
            jobF;
        while (jobs.length > 0 && (jobF = jobs.shift())) {
            jobF.apply(this);
        }
    },


    /**
     * Schedule a job to run once during the next data load.
     * @private
     * @method _scheduleJobOnLoadDone
     * @param fJob {Function} closure that will be invoked 
     *                        with this (mboxGrid) as the scope
     */
    _scheduleJobOnLoadDone: function (fJob) {
        this._onLoadDoneJobs.push(fJob);
    },

    
    /**
     * Find Table row (TR) by mail meta-data.
     * NOTE: this also works with the Fake-table hack
     * @method findRowByMMData
     * @param mmdata {Object} hash containing keys fid, uid, etc.
     * @returns {HTMLTableRowElement}
     */
    findRowByMMData: function(mdata) {
        if (!mdata) { return; }
        var lg = this.liveGrid;
        // FIXME: Doing at run-time what can be done at load-time
        //        Why not just make table.rows a link to table.childNodes?
        var rows = lg.isUsingFakeTable ? 
            lg.table.childNodes : // Use the child nodes of the Fake-table DIV element.
            lg.table.rows;        // Use the table rows.

        var length = Math.min(rows.length, lg.viewPort.visibleRows, lg.metaData.totalRows); 
        var __daGridRowMetaData;
        var row;
        for (var i = 0; i < length; ++i) {
            row = rows[i];
            __daGridRowMetaData = row.__daGridRowMetaData;
            if (__daGridRowMetaData && 
                DA.util.cmpNumber(__daGridRowMetaData.fid, mdata.fid) && 
                DA.util.cmpNumber(__daGridRowMetaData.uid, mdata.uid)) {
                return row;
            }
        }
    },
    
    
    /**
     * Finds the position of 
     * @method _findPositionInBuffer
     * @param single {Object} hash containing keys fid, uid.
     * @returns {Number}
     */
    _findPositionInBuffer: function(mmdata) {
        var i    = 0,
            rows = this.liveGrid.buffer.rows,
            len  = rows.length,
            cmp  = DA.util.cmpNumber;

        for (; i<len; ++i) {
            if (cmp(rows[i].meta.fid, mmdata.fid) && 
                cmp(rows[i].meta.uid, mmdata.uid)) {
                return i;
            }
        }
    },

    
    /**
     * 今見えているはどころへん?
     * (start,endのインデクス値は0からになります）
     * @private
     * @method _getViewPortRange
     * @return {Hash} Object: keys -> start, end
     */ 
    _getViewPortRange: function () {
        return this.liveGrid.viewPort.getRange();
    },
        


    /**
     * For the given mmdata (mail metadata), hunt down the TR element that is
     * currently displaying the corresponding mail (if it is within view) and
     * update it's appearance (based on the CSS information the metadat holds)
     * @method setRowAppearance
     * @param mmdata // TODO
     * @param changedProps {Array} Array of string-names of changed properties
     * @param tr           {HTMLElement} (Optional) row element. If passed in, 
     *                                   the row will not be searched for, and 
     *                                   this will be used instead.
     */
    setRowAppearance: function (mmdata, changedProps, tr) {
        if (!mmdata) { return; }

        // First modify the metadata
        // For each property..
        if (changedProps && changedProps.each) {
            if (!mmdata.className || mmdata.className === '') {  // What? No classname?!
                mmdata.className = this._utils.mkCSSClassNameForRow(mmdata); 
            }
            // FIXME: slow
            changedProps.each(function(prop){
                var c = prop.charAt(0);
                if(prop === "forwarded")
                {
                	c='w';
                }
                var re = new RegExp("\\b" + c + "[0-9]\\b");
                mmdata.className = mmdata.className.replace(re, c + mmdata[prop]);
            });
        }

        // Then, if the metadata corresponds to an existing TABLE row, (or row-DIV in a Fake-table)
        // get the DOM element of the row and set it's class.
        tr = tr ? tr : this.findRowByMMData(mmdata);
        if (!tr) { return; } // short-circuit to avoid NPE's and useless calls to isSelected
        // FIXME: the isSelected bit is redundant (see virtual-scroll.js, populateRow)
        var isSelected = this.liveGrid.isSelected(mmdata);
        tr.className = (this.isUsingFakeTable ? 'da_rowdiv ' : '') +
                mmdata.className + (isSelected ? ' da_gridSelectedRow' : ''); 
    },
    
    /**
     * Move all the currently selected messages to the Trash folder (or delete them
     * right away). This is a front-end to moveSelected, which does things like prompting
     * the user.
     * @method deleteSelected
     */
    deleteSelected: function() {
        var selected = this.getSelected();
        var message = (DA.mailer.util.isTrash(this.folderType) ||
                                DA.vars.config["delete"] === 1 ||
                                (selected.count === 1 &&
                                 DA.mailer.util.isTrash(selected.single.type))) ? 
                       DA.locale.GetText.t_("MESSAGE_DELETECOMPLETE_CONFIRM") : 
                       DA.locale.GetText.t_("MESSAGE_DELETE_CONFIRM");
        if (DA.util.confirm(message)) {
            this.moveSelected( { trash: true } ) ;
        }
    },



    /**
     * Move all the currently selected messages to the given target. 
     * If the target has a property 'trash' which evaluates to TRUE, then
     * the messages are moved to trash (or deleted)
     * @method moveSelected
     * @param target {Hash} Object with the properties:
     *                        - trash {Boolean} if true, then move to trash/delete
     *                        - fid   {Number}  ID of the destination folder
     */
    moveSelected: function(target) {
        var selected = this.getSelected();
        DA.mailer.Events.onMessageMoveRequest.fire({
            messages: selected,
            target:   target

        });
        setTimeout(function () {
            this.isInMutliSelect = false;
            this.setAllUnSelected();
        }.bind(this), 500);
    },

   
    /**
     * Computes and sets the changed start offset position (startPos) of the given LiveGrid's buffer
     * based on the assumption that all rows targeted by the given selection object are to be
     * removed.
     * FIXME: LiveGrid (VirtualScrollingTable) specific code
     * 
     * @method _adjustBufferStartPos
     * @private 
     * @param selection {Object} (Optional) hash/object containing count, single,singles and/or ranges
     *                           (The same type of object that is returned by MboxGrid.getSelected())
     * @param liveGrid {Object} (optional) Instance of DA.widget.VirtualScrollingTable
     * @return {Boolean} if TRUE, indicates that the buffer's start position offset was indeed modified.
     */
    _adjustBufferStartPos: function (selection, liveGrid) {
        if (!selection) { return false; }
        var lg = liveGrid || this.liveGrid;

        var startPosOrig = lg.buffer.startPos;
        var rowsAbove = this._countAffectedRows(selection, 0, lg.buffer.startPos);
        var startPosNew  = startPosOrig - rowsAbove;

        if ( startPosNew === startPosOrig ) {
            return false;
        }

        lg.buffer.startPos = startPosNew;

        return true;

    },

   
    /**
     * Recomputes and resets the sequence numbers for the entire buffer's rows.
     * This is needed when the local LiveGridBuffer is directly manipulated
     * (for example, when rows are deleted/removed) and the sequence numbers
     * are out of sync with the rows that the buffer represents (offset at it's startPos)
     * 
     * @method _repairBufferSeqNums
     * @private
     * @param liveGrid {Object} (optional) Instance of DA.widget.VirtualScrollingTable
     */
    _repairBufferSeqNums: function (liveGrid) {
        var lg = liveGrid || this.liveGrid;
         
        var rows = lg.buffer.rows;
        var bufferLength = rows.length;
        var startPos = lg.buffer.startPos + 1; // sno starts from 1, not 0
        var i;
        for (i = 0; i < bufferLength; ++i) {
            rows[i].meta.sno = startPos + i; // FIXME: Fake-table specific
        }

    },

    /**
     * Computes and sets the changed start position (lastRowPos) of the given LiveGrid's viewPort,
     * based on the assumption that all rows targeted by the given selection object are to be
     * removed.
     * FIXME: LiveGrid (VirtualScrollingTable) specific code
     * 
     * @method _adjustViewPortStartPos
     * @private 
     * @param selection {Object} (Optional) hash/object containing count, single,singles and/or ranges
     *                           (The same type of object that is returned by MboxGrid.getSelected())
     * @param liveGrid {Object} (optional) Instance of DA.widget.VirtualScrollingTable
     * @return {Boolean} if TRUE, indicates that the viewPort's start position was indeed modified.
     */
    _adjustViewPortStartPos: function (selection, liveGrid) {
        
        if (!selection) { return false; }

        var lg = liveGrid || this.liveGrid;

        var viewPortStartPos = lg.viewPort.lastRowPos;
        var viewPortStartSno; // Must be equal to viewPortStartPos + 1
        var firstRowHTMLElem = lg.table.firstChild;
        if (firstRowHTMLElem && firstRowHTMLElem.__daGridRowMetaData) {
            viewPortStartSno = parseInt(firstRowHTMLElem.__daGridRowMetaData.sno, 10);
        }
        if (viewPortStartSno !== (viewPortStartPos + 1)) {
            viewPortStartSno = viewPortStartPos + 1;
        }

        // Find the number of affected rows *above* the viewPort.
        var rowsAbove = this._countAffectedRows(selection, 0, viewPortStartPos);
        // Move up to fill the missing rows.
        var newViewPortStartPos = viewPortStartPos - rowsAbove;

        if (newViewPortStartPos < 0) { // Sanity checks
            // something funny?
            lg.viewPort.lastRowPos = 0;
        } else { 
            lg.viewPort.lastRowPos = newViewPortStartPos;
        }

        var totalRows = lg.metaData.getTotalRows();
        var pageSize  = lg.metaData.getPageSize();

        var remainingRows = totalRows - newViewPortStartPos;
        if (totalRows >= pageSize) { // If we have enough
            if (remainingRows < pageSize) { 
                lg.viewPort.lastRowPos = (totalRows - pageSize) - 1;
            }
        } else { // scroll-less; to the top
            lg.viewPort.lastRowPos = 0;
        }

        return lg.viewPort.lastRowPos !== viewPortStartPos; // If a start adjustment took place, say yes

    },


    /**
     * For the given selection, return a count of all the rows that fall within
     * the specified start_sno and end_sno.
     * @param start_sno {Number}  sequence number of grid-row meta-data
     * @param end_sno   {Number}  sequence number of grid-row meta-data
     */
    _countAffectedRows: function (selection, start_sno, end_sno) {
        if (!selection || !end_sno) { return 0; }

        var singles = (selection.singles && selection.singles.length) ? selection.singles : 
                selection.single ? [selection.single] : [];
        var ranges = (selection.ranges && selection.ranges.length) ? selection.ranges : [];

        var count = singles.inject(0, function(nA /*accumulated number*/, oS){
            var sno = parseInt(oS.sno, 10);
            return nA + ( (sno >= start_sno && sno <= end_sno) ? 1 : 0 );
        });

        count = ranges.inject(count, function(nA /*accumulated*/, oR) {
            var from = Math.max(oR.start.sno, start_sno);
            var to   = Math.min(oR.end.sno, end_sno);
            return nA + Math.max(0, (to - from + 1));
        });

        if (count < 0) {
            return 0;
        } else {
            return count;
        }

    },

    /**
     * @property _messageMoverJobs
     * @type {Object} Instance of Hash (Prototype.js) 
     *                key: jobId (move, delete event);  value: message collection
     */
    _messageMoverJobs: null,

 
    /**
     * Based on the currently queued Message Mover jobs, creates an 'exception filter'
     * that will be used to remove rows from the next LiveGrid request.
     * Messages that match the enqueued Message Collections will be filtered out 
     * at the IO level (ajx_ma_list will not return them).
     * This is meant to be used during deletion/moving of messages (when messages need to 'vanish'
     * from the grid)
     * @method _updateExceptionFilter
     * @private
     */
    _updateExceptionFilter: function () {

        // FIXME: The following section could get slow.
        var collections = this._messageMoverJobs.values();
        if (collections.length < 1) {
            delete this.liveGrid.jsonIO.defaultParams.except;
        }
        // Merge all the singles arrays into a single singles array;
        var singles = collections.pluck('singles').inject( [], this._utils.listConcat );
        // ..and all the ranges arrays into a single ranges array
        var ranges  = collections.pluck('ranges').inject( [], this._utils.listConcat );

        this.liveGrid.jsonIO.defaultParams.except = 
                singles.map(this._utils.asFidColonUid).concat(
                ranges.map(this._utils.asFidColonUidRange)).join(',');
    }


};


if ("undefined" === typeof DA.mailer.dd) {
    DA.mailer.dd = {};
}

/**
 *
 *
 */
DA.mailer.dd.MboxMail = function (id) {
    this.init(id, "da_folderTree", this.config);
    this.initFrame();
};

YAHOO.extend(DA.mailer.dd.MboxMail, YAHOO.util.DDProxy, {

    // FIXME: Must not access FolderTreeController from here!!!
    _targetId2fid: DA.mailer.FolderTreeController.prototype._targetId2fid,
    _fid2divId:    DA.mailer.FolderTreeController.prototype._fid2divId,
   

    /**
     * See YUI sources, dragdrop.js
     * @method clickValidator
     * @param e {Object} DOM event (mousedown event, probably)
     * @returns {Boolean} if TRUE, continue the drag; if FALSE, the drag will be aborted.
     */
    clickValidator: function(e) {
		if (DA.mailer.util.getOperationFlag() !== '' && DA.mailer.util.getOperationFlag().indexOf(OrgMailer.vars.org_mail_gid.toString()) < 0){
			return false;
		}
        var selectedMails = this.mboxGrid.getSelected(); // REF: Using getSelected for obtaining count
        if (e.ctrlKey &&(!selectedMails || selectedMails.count === 0)) {
           return false;
        } 
        var node = YAHOO.util.Event.getTarget(e);
        var target;
        var children;
        if (!node) {
            return false;
        }
        if (node.id) {
            target = node;
        } else {
            target = node.parentNode;
        }
        if (target.id.match(/^rowdiv\d+$/)) {
            children = target.children /*IE*/ || target.childNodes /*W3C*/ || [];
            if (children.length === 0) {
                return false;
            } 
        }
        return true;

    },

    endDrag: function() {
        this.mboxGrid._isBeingDragged = false;
    },

    onDragDrop: function(e, id) {
        var fid = this._getFid(id);
        if (this._okToDrop(fid)) {
            YAHOO.util.Dom.removeClass($(id).parentNode, "labelTargeted");
            this.mboxGrid.moveSelected({ fid: fid });
        }
    },

    /**
     * @method _okToDrop
     * @private
     * @param nFid {Number} IMAP folderID we are hovering over
     * @return {Boolean} dropping here is OK.
     */
    _okToDrop: function (nFid) {
    	if (nFid) {
	        if (this.mboxGrid.folderTreeController && !this.mboxGrid.folderTreeController._dropMOk(nFid)) {
	             return false;
	        }
	        return parseInt(nFid, 10) !== this.mboxGrid.folderId;
	    } else {
	    	return false;
	    }
    },

    onDragEnter: function(e, id) {
        var fid = this._getFid(id);
        if (this._okToDrop(fid)) {
            YAHOO.util.Dom.addClass($(id).parentNode, "labelTargeted");
            DA.mailer.Events.onMessagesDragEnter.fire({ fid: fid });
        }
    },

    _getFid: function(id) {
        if (!id) {
            return;
        }
        
        var fid = this._targetId2fid(id);

        return fid ? fid : 0;

    },

    onDragOut: function(e, id) {
        var fid = this._getFid(id);
        if (fid) {
            YAHOO.util.Dom.removeClass($(id).parentNode, "labelTargeted");
            DA.mailer.Events.onMessagesDragOut.fire({ fid: fid });
        }
    },
 
    config: {
        scroll:      false,
        resizeFrame: false,
        centerFrame: true,
        dragElId:    "mboxmaildd_dragProxy"
    },

    startDrag: function(x, y) {
        this.mboxGrid._isBeingDragged = true;
    }

});

YAHOO.util.Event.on(window, "load", function(){
    var div = document.createElement("div");
    div.id = "mboxmaildd_dragProxy";
    Object.extend(div.style, {
        visibility:         "hidden",
        position:           "absolute",
        top:                "0px",
        left:               "0px",
        width:              "20px",
        height:             "15px",
        backgroundImage:    "url('/images/ico_fc_mail.gif')",
        backgroundPosition: "center center",
        backgroundRepeat:   "no-repeat"
    });
    document.body.appendChild(div);
});



/**
 * LIBRARY METHOD OVERWRITE!  We are changing Rico by doing this.
 * Our very own loadRows implementation. 
 * <p>
 * FIXME: This contains mailer-specific code!
 *        This should be made general as soon as Kadowaki-san
 *        implements an Array-of-Arrays protocol.
 * 
 * @method loadRows
 * @private ? // TODO: How does one classify such methods?
 * @param obj Object an object retrieved by eval'ing the JSON response
 */
Rico.LiveGridBuffer.prototype.loadRows = function(obj) {

    var totalMessages;

    if (obj.view) {
        // FIXME: Mailer-specific code!
        totalMessages = obj.view.messages; // TODO: null checks...
        this.metaData.setTotalRows( totalMessages ? totalMessages : 0 ); // TODO: error handling
    }

    if (DA.util.isEmpty(obj.srid)) {
        DA.mailer.Events.onMboxGridLoadRows.fire({
            fid:      obj.fid,
            count:    totalMessages ? totalMessages : 0,
            response: obj
        });
    }

    return obj.mail_list || [] /*NPE protection: Rico calls this method, and does not check*/;
                          // AoA; each Array in the array consists of:
                          // (1) a first element which is the metadata
                          // (2) the remaining elements which are the visible data

};


/* $Id: autocomplete.js 2144 2010-09-21 06:30:44Z yp_shao $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/mailer/autocomplete/autocomplete.js $ */
/*for JSLINT undef checks*/
/*extern DA Event YAHOO */
/*extern $H BrowserDetect */
/*
Copyright (c) 2007, DreamArts. All rights reserved.
TODO: message
version: ??
*/
if (!DA || !DA.mailer || !DA.mailer.widget || !DA.util || !DA.locale) {
    throw "ERROR: missing DA.js or mailer.js or message.js"; // TODO: formalize/cleanup
}

if (!YAHOO || !YAHOO.util) {
    throw "ERROR: missing yahoo.js"; // TODO: formalize/cleanup
}

/**
 * Address auto-completion, using YUI 
 * 
 * @class AutoComplete
 * @constructor
 * @param input          {HTMLElementInputElement}
 * @param input          {String} ID of an INPUT element.
 * @param container      {HTMLDivElement}
 * @param container      ID of a DIV element.
 * @param field          {String} Either 'to', 'cc', or 'bcc'
 * @param listController {Object} Instance of DA.ug.InformationListController
 */
DA.mailer.widget.AddressAutoComplete = function(input, container, field, listController) {
    var errMsg;
    if (!input || !container || !field) {
        errMsg = "Invalid/Missing args";
        throw errMsg;
    }
    // Use InformationListController if available
    if (listController instanceof DA.ug.InformationListController) {
        this.listController = listController;
        this._selectItem = this._listController_selectItem;
    }
    this._initDataSource(field); 
    DA.mailer.widget.AddressAutoComplete.superclass.constructor.call(this, input, container, this.dataSource);
    this.useIFrame = true;

};

YAHOO.extend(DA.mailer.widget.AddressAutoComplete, YAHOO.widget.AutoComplete, {

    /**
     * @property listController
     * @type     {Object} instance of DA.ug.InformationListController
     */
    listController: null,
    
    /**
     * AutoComplete override.
     * This is not really used; since we use the InformationListController
     */
    delimChar:  [","],

    /**
     * The list of fields that have a "xxx_hit" property 
     * (which will be === 1 if the property's value was a
     * hit)
     * @property _hitFields
     * @type    {String[]}
     */
    _hitFields: [
        "email",
        "name",
        "alpha",
        "kana",
        "keitai_mail",
        "pmail1",
        "pmail2"
    ],


    /**
     * Override to implement our own result formatting
     * @param aResultItem {Array} An array, whose 
     *                            0. first  ([0]) element is a String (email) 
     *                            1. second ([1]) element is a hash (Object),
     *                               which contains user information.
     * @param sQuery      {String} the actual query string entered
     */
    formatResult: function(aResultItem, sQuery) {

        var email = aResultItem[0];

        var userInfo = aResultItem[1];

        if (!userInfo) {
            return "";
        }

        var aMarkup = ["<div>",
                       "<img src='", userInfo.icon, "'/>"];

        var j = aMarkup.length; // for our StringBuffer (aMarkup)
        var sQueryLength = sQuery.length;

        // Generate HTML for each hit; look for hits
        // (checking xxx_hit===1) for each field
        
        var hitFields       = this._hitFields;
        var sHtml           = {};
        var hitFieldsLength = hitFields.length;
        var reg             = new RegExp(["^(", DA.util.encode(sQuery).replace(/(?:\s|　)/, "(?:\\s|　)"), ")"].join(""));
        var i, val, offset, field;
        
        for (i = 0; i < hitFieldsLength; ++i) {
            field = hitFields[i];
            val = userInfo[field];
            if (!val || !val.indexOf) { continue; }
            if (userInfo[field+'_hit'] === 1) { 
                // Highlight this hit
                sHtml[field] = DA.util.encode(val).replace(reg, "<span style='font-weight:bold'>$1</span>");
            } else {
                sHtml[field] = DA.util.encode(val);
            }
        }

        aMarkup[j++] = "&nbsp;";
        aMarkup[j++] = sHtml.name;  // TODO: other preference?
        aMarkup[j++] = "&nbsp;";
        
        if (!DA.util.isEmpty(sHtml.email) || !DA.util.isEmpty(sHtml.keitai_mail) || !DA.util.isEmpty(sHtml.pmail1) || !DA.util.isEmpty(sHtml.pmail2)) {
            aMarkup[j++] = "&lt;";
            if (!DA.util.isEmpty(sHtml.email)) {
                aMarkup[j++] = sHtml.email; // TODO: other preference?
            } else if (!DA.util.isEmpty(sHtml.keitai_mail)) {
                aMarkup[j++] = sHtml.keitai_mail; // TODO: other preference?
            } else if (!DA.util.isEmpty(sHtml.pmail1)) {
                aMarkup[j++] = sHtml.pmail1; // TODO: other preference?
            } else if (!DA.util.isEmpty(sHtml.pmail2)) {
                aMarkup[j++] = sHtml.pemail2; // TODO: other preference?
            }
            aMarkup[j++] = "&gt;";
            aMarkup[j++] = "&nbsp;";
        }
        
        if (!DA.util.isEmpty(userInfo.gname)) {
            aMarkup[j++] = "(";
            aMarkup[j++] = userInfo.gname;
            aMarkup[j++] = ")";
        }

        aMarkup[j++] = "</div>";
        
        //   Can't view long name.
        //// Cc Bcc hidden case fix.
        //// this._oContainer.style.width = this._oTextbox.offsetWidth + "px";

        return (aMarkup.join(""));
    },

    /**
     * @property dataSource
     * @type {Object} instance of YAHOO.widget.DS_XHR
     */
    dataSource: null,

    /**
     * @method _initDataSource
     * @private
     * @param sField {String} either 'to', 'cc' or 'bcc'
     */
    _initDataSource: function(sField) {
        this.dataSource = Object.extend(new YAHOO.widget.DS_XHR(
            DA.vars.cgiRdir + "/ajx_ma_addr_search.cgi", /*script URI*/
            ["user_list", "email"]), {
                doQuery: function(oCallbackFn, sQuery, oParent) {
                    var isXML, sUri;
                    var oResponse, oSelf;
                    var responseSuccess, responseFailure, oCallback;
                    
                    if (DA.util.lock('incSearch')) {
                        isXML = (this.responseType === YAHOO.widget.DS_XHR.TYPE_XML);
                        sUri  = this.scriptURI + "?" + this.scriptQueryParam + "=" + sQuery;
                        if (this.scriptQueryAppend.length > 0) {
                            sUri += "&" + this.scriptQueryAppend;
                        }
                        sUri = DA.util.setUrl(sUri);
                        oResponse = null;
                        
                        oSelf = this;
                        /*
                         * Sets up ajax request callback
                         *
                         * @param {object} oReq          HTTPXMLRequest object
                         * @private
                         */
                        responseSuccess = function(oResp) {
                            // Response ID does not match last made request ID.
                            if (!oSelf._oConn || (oResp.tId !== oSelf._oConn.tId)) {
                                oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DataSource.ERROR_DATANULL);
                                DA.util.unlock('incSearch');
                                return;
                            }
                            if (!isXML) {
                                oResp = oResp.responseText;
                            } else { 
                                oResp = oResp.responseXML;
                            }
                            if (oResp === null) {
                                oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DataSource.ERROR_DATANULL);
                                DA.util.unlock('incSearch');
                                return;
                            }
                            
                            var aResults  = oSelf.parseResponse(sQuery, oResp, oParent);
                            var resultObj = {};
                            resultObj.query = decodeURIComponent(sQuery);
                            resultObj.results = aResults;
                            if (aResults === null) {
                                oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DataSource.ERROR_DATAPARSE);
                                aResults = [];
                            } else {
                                oSelf.getResultsEvent.fire(oSelf, oParent, sQuery, aResults);
                                oSelf._addCacheElem(resultObj);
                            }
                            oCallbackFn(sQuery, aResults, oParent);
                            DA.util.unlock('incSearch');
                        };
                        
                        responseFailure = function(oResp) {
                            oSelf.dataErrorEvent.fire(oSelf, oParent, sQuery, YAHOO.widget.DS_XHR.ERROR_DATAXHR);
                            DA.util.unlock('incSearch');
                            return;
                        };
                        
                        oCallback = {
                            success:responseSuccess,
                            failure:responseFailure
                        };
                        
                        if (!isNaN(this.connTimeout) && this.connTimeout > 0) {
                            oCallback.timeout = this.connTimeout;
                        }
                        
                        if (this._oConn) {
                            this.connMgr.abort(this._oConn);
                        }
                        
                        oSelf._oConn = this.connMgr.asyncRequest("GET", sUri, oCallback, null);
                    }
                }
            });
        this.dataSource.scriptQueryAppend = "field=" + sField; // TODO: null/empty check?
        this.dataSource.scriptQueryParam = "keyword";
    },
    
    // Enter fix.
    /**
     * @method _isIgnoreKey
     * @private
     * @param nKeyCode {int}
     */
    _isIgnoreKey: function(nKeyCode) {
        if ((nKeyCode === 9)  || // tab
            (nKeyCode === 16) || (nKeyCode === 17) || // shift, ctl
            (nKeyCode >= 18 && nKeyCode <= 20) || // alt,pause/break,caps lock
            (nKeyCode === 27) || // esc
            (nKeyCode >= 33 && nKeyCode <= 35) || // page up,page down,end
            (nKeyCode >= 36 && nKeyCode <= 38) || // home,left,up
            (nKeyCode === 40) || // down
            (nKeyCode >= 44 && nKeyCode <= 45)) { // print screen,insert
            return true;
        }
        return false;
    },
    
    /**
     * @method _onTextboxKeyup
     * @private
     * @param :TODO
     */
    _onTextboxKeyUp: function(v,oSelf) {
        // Check to see if any of the public properties have been updated
        oSelf._initProps();
        
        var nKeyCode = v.keyCode;
        oSelf._nKeyCode = nKeyCode;
        var sText = this.value; //string in textbox
        
        // Filter out chars that don't trigger queries
        if (oSelf._isIgnoreKey(nKeyCode) || (sText.toLowerCase() === oSelf._sCurQuery)) {
            return;
        } else if (sText.length > 100) {
            return;
        } else {
            oSelf.textboxKeyEvent.fire(oSelf, nKeyCode);
        }
        
        // Set timeout on the request
        var nDelayID;
        if (nKeyCode === Event.KEY_RETURN) {
            if (oSelf._nDelayID !== -1) {
                clearTimeout(oSelf._nDelayID);
            }
            oSelf._sendQuery(sText);
        } else if (oSelf.queryDelay > 0) {
            oSelf._toggleContainer(false);
            nDelayID =
                setTimeout(function(){oSelf._sendQuery(sText);},(oSelf.queryDelay * 1000));
            
            if (oSelf._nDelayID !== -1) {
                clearTimeout(oSelf._nDelayID);
            }
            
            oSelf._nDelayID = nDelayID;
        } else {
            // No delay so send request immediately
            oSelf._sendQuery(sText);
        }
    },
	
    /**
     * @method _onTextboxKeyPress
     * @private
     * @param :TODO
     */	
	_onTextboxKeyPress: function(v,oSelf) {
    var nKeyCode = v.keyCode;
	oSelf._cancelIntervalDetection(oSelf);
	
        //Expose only to Mac browsers, where stopEvent is ineffective on keydown events (bug 790337)
        var isMac = (navigator.userAgent.toLowerCase().indexOf("mac") !== -1);
        if(isMac) {
            switch (nKeyCode) {
            case 9: // tab
                if(oSelf.delimChar && (oSelf._nKeyCode !== nKeyCode)) {
                    if(oSelf._bContainerOpen) {
                        YAHOO.util.Event.stopEvent(v);
                    }
                }
                break;
            case 13: // enter
                    if(oSelf._nKeyCode !== nKeyCode) {
                        if(oSelf._bContainerOpen) {
                            YAHOO.util.Event.stopEvent(v);
                        }
                    }
                break;
            case 38: // up
            case 40: // down
                YAHOO.util.Event.stopEvent(v);
                break;
            default:
                break;
            }
        }

        // IME Mode detected For firefox
        else if(nKeyCode === 229) {
			if(oSelf.queryDelay > 0) {
				oSelf._onIMEDetected(oSelf);
	        	oSelf._queryInterval = setInterval(
					function() {
						oSelf._onIMEDetected(oSelf); 
					},
					(oSelf.queryDelay * 1000)
				);				
			} else {
				oSelf._onIMEDetected(oSelf);
	        	oSelf._queryInterval = setInterval(
					function() {
						oSelf._onIMEDetected(oSelf); 
					},
					(500)
				);
			}
		}
	},
    
    /**
     * This will override the _selectItem method (YAHOO.widget.AutoComplete._selectItem)
     * if an InformationListController (DA.ug.InformationListController) is specified
     * as a constructor argument
     * TODO: more comments
     * @method _listController_selectItem
     * @private 
     */
    _listController_selectItem: function (oItem) {
        this._bItemSelected = true;
        var oResultData = oItem._oResultData;
        if (oResultData && oResultData[1]) { 
        	//add the bulk address
        	if(DA.vars.ugType.bulk === oResultData[1].type){
        		this._openBulk(oResultData[1]);
        	}else{
            this.listController.addList( [ oResultData[1] ] );
        }
        }
        // reset the text-box to only the saved query
        // (i.e., only the text that wa entered fully by the user 
        // without any autocompletion)
        //// this._oTextbox.value = this._sSavedQuery ? this._sSavedQuery.replace(/\,+$/, "") : "";
        this._oTextbox.value = this._sSavedQuery ? this._sSavedQuery : "";
        this._cancelIntervalDetection(this);
        this.itemSelectEvent.fire(this, oItem, oResultData);
        this._toggleContainer(false);
        var itemObj = YAHOO.util.Dom.get('da_messageEditorItemGroupNameOuter');
        if(this.listController.groupExists()) {
        	this._showGroupName(itemObj);
        } else {
        	this._hideGroupName(itemObj);
		}
    },

	_showGroupName: function(itemObj) {
		if (itemObj && itemObj.style.display === 'none') {
   			itemObj.style.display = '';
  		}
	},
	_hideGroupName: function(itemObj) {
		if (itemObj && itemObj.style.display === '') {
			itemObj.style.display = 'none';
		}
	},

    /**
     * Overriding doBeforeExpandContainer to set the container size; this enables
     * scrolling if the number of results to display exceeds maxResultsBeforeScroll
     */
    doBeforeExpandContainer: function(oTextbox, oContainer, sQuery, aResults) {
        var nResults = aResults? aResults.length : 0;
        oContainer._oContent.style.height = 
                ( Math.min(nResults, this.maxResultsBeforeScroll) * this.resultRowHeight ) + 
                4 + /*FIXME: hard-coded approximation for header+footer height*/
                "px";
        if (BrowserDetect.browser === 'Explorer') {
        	oContainer._oContent.style.width = "100%"; /* TODO Realtime resize */
        } else {
        	oContainer._oContent.style.width = "80%";
        }
        return nResults > 0;
    },

    // FIXME: The spec wants this to be 20, but I'm using 10 because 10 seems easier for testing
    maxResultsBeforeScroll: 20,

    maxResultsDisplayed: DA.vars.system.max_incsearch_hits?parseInt(DA.vars.system.max_incsearch_hits, 10): 100,

    // FIXME: make this dynamically updateable
    resultRowHeight: 18,

    /**
     * The number of seconds to wait before firing requests for each key down event
     * @property queryDelay
     * @protected
     * @type {Float} Seconds
     */
    queryDelay: DA.vars.system.inc_search_interval ? 
            parseFloat(DA.vars.system.inc_search_interval, 10) : // From the config settings
            0.25, // Default, if no config

    /**
     * The minimum characters a user needs to key in before autocompletion kicks in.
     * @property minQueryLength
     * @type {Number}
     */
    minQueryLength: DA.vars.system.inc_search_min_chars ?
            parseInt(DA.vars.system.inc_search_min_chars, 10) :  // From the config settings
            1, // Default to 1 (YUI recommendation)

	_openBulk: function(oResultData){
		var me = this;
        var io = new DA.io.JsonIO( DA.vars.cgiRdir + '/ajx_addr.cgi' );
        io.callback = function(o) {
            if (DA.mailer.util.checkResult(o)) {
            	me.listController.addList(o.user_list);
            }
        };

        io.errorHandler = function(e) {
            DA.util.warn(DA.locale.GetText.t_("BULKINFO_ERROR"));
        };
        
        io.execute({
            proc: 'extract',
            aid: oResultData.id,
            lang: oResultDa