package DA::Ajax::Mailer;
###################################################
##  INSUITE(R)Enterprise Version 2.0.0.          ##
##  Copyright(C)2006 DreamArts Corporation.      ##
##  All rights to INSUITE routines reserved.     ##
###################################################
BEGIN {
	use DA::MailCommon::Constants();
	use DA::Mailer();
	use DA::MailParser();
	use DA::IMAP();
	use DA::EPSML();
	use DA::EPSML::Client();
	use DA::EPSML::Tools();
	use DA::RichtextValid();
	use DA::SpellCheck();
	use DA::System();
	use DA::Gettext;
	use IO::Socket::SSL;
	use DB_File;
	use DA::OrgMail();
	use DA::IsVersion;
}
use strict;
use vars qw($MATCH_RULE $MAIL_VALUE);

my $MATCH_RULE         = $DA::MailCommon::Constants::MATCH_RULE;
my $MAIL_VALUE         = $DA::MailCommon::Constants::MAIL_VALUE;
my $CHAR_CODE          = $DA::MailCommon::Constants::CHAR_CODE;
my $LIST_ITEM          = $DA::MailCommon::Constants::LIST_ITEM;
my $L_LIST_ITEM        = $DA::MailCommon::Constants::L_LIST_ITEM;
my $P_LIST_ITEM        = $DA::MailCommon::Constants::P_LIST_ITEM;
my $DBM_TYPE           = 'DB_File';
my $DBM_FLAGS          = O_RDWR|O_CREAT;
my $DBM_MODE           = 0666;
my $COMMIT_COUNT       = $DA::Vars::p->{mail_commit_count};
my $MAX_HEADER_STN     = 500;
my $MAX_NUMBER_LENGTH  = 1000;
my $MAX_EXPORT_STN     = 20;
my $MAX_EXPORT_SIZE    = 10000000;
my $MAX_JOIN_STN       = 20;
my $MAX_SEARCH_HITS    = 1000;
my $MAX_INCSEARCH_SAVE = 1000;
my $MAX_INCSEARCH_HITS = 100;
my $INC_TARGET_TOTAL   = 3;
my $INC_CACHE_EXPIRE   = 3600; # sec
# my $INC_CACHE_EXPIRE   = 3;  # sec
my $LOCK_EXPIRE        = 3600; # sec
my $SEARCH_KIND_ADDR   = 0;
my $SEARCH_KIND_USER   = 1;
my $SEARCH_KIND_GROUP  = 2;
my $SEARCH_KIND_BULK   = 3;
my $SEARCH_KIND_ML     = 4;
my $TYPE_ROOT          = "00";
my $TYPE_SERVER        = "10";
my $TYPE_INBOX         = "11";
my $TYPE_DRAFT         = "12";
my $TYPE_SENT          = "13";
my $TYPE_TRASH         = "14";
my $TYPE_SPAM          = "15";
my $TYPE_DEFAULT       = "16";
my $TYPE_MAILBOX       = "17";
my $TYPE_CABINET       = "18";
my $TYPE_LOCAL_SERVER  = "20";
my $TYPE_LOCAL_FOLDER  = "21";
my $TYPE_BACKUP_FOLDER = "22";
my $BACKUP_MAID_INDEX  = "5";
my $BACKUP_PRIORITY_INDEX = "6";
my $TYPE_PORTAL        = "30";
my $TYPE_JOIN          = "40";
my $SORT_ROOT          = "00";
my $SORT_SERVER        = "10";
my $SORT_FOLDER        = "11";
my $SORT_LOCAL_SERVER  = "20";
my $SORT_LOCAL_FOLDER  = "21";
my $SORT_BACKUP_FOLDER = "22";
my $SORT_PORTAL        = "10";
my $SORT_JOIN          = "40";
my $MAIL_ROW_LENGTH    = 80;
my $MAIL_TEXT_TYPE     = "text/plain";
my $MAIL_TEXT_ENCODING = "7bit";
my $MAIL_HTML_TYPE     = "text/html";
my $MAIL_HTML_ENCODING = "base64";
my $MAIL_MIME_TYPE     = "multipart/mixed";
my $MAIL_MIME_ENCODING = "base64";
my $MAIL_ALTER_TYPE    = 'multipart/alternative';
my $MAIL_X_MAILER      = ($DA::Vars::p->{package_name} eq 'INSUITE') ?
                         "INSUITE Enterprise $DA::IsVersion::Version AjaxMailer"
                       : "$DA::Vars::p->{PRODUCT_NAME} $DA::IsVersion::Version AjaxMailer";
my $MESSAGE_ID_FILE    = "$DA::Vars::p->{base_dir}/local/mail/message_id.dat";
my $MESSAGE_ID_LOCK    = "message_id";
my $SERVER_NO          = &get_server_no();
my $XML_CONTENT_TYPE   = "Content-Type: text/xml;\n\n";
my $SPACER             = '###spacer###'; 
my @INIT_MASTER_ITEMS  = qw (
	delete list_order quote_r quote_f quote_f_attach reply_all
	cr attach from bcc group_name open_status priority encode content_type
	mdn group reply_use name sign_init_p sign_init_m sign_act reply
	count recent t_len b_wrap d_date toself
	tab filter mdn_prompt mdn_save auto_fix_consistency
);
my @FILTER_ITEMS       = qw (
	h1 c1 t1 cond h2 c2 t2 proc move_path seen done deleted auto manual
);
my @VFILTER_ITEMS      = qw (
	title seen flagged attach priority toself deleted today term
);
my @PORTAL_ITEMS       = qw (
	sno uid_number seen flagged deleted replied forwarded attachment attach4ajx
	mail_size internal from_field to_field date_field subject_field
	priority target from_ext to_ext subject_ext to_status folder_name
);
my @SERVER_OUTPUT_ITEMS= qw (
	uid_number seen flagged deleted replied forwarded
	attachment attach4ajx mail_size internal
	from_field to_field date_field subject_field
	priority to_status
	from_ext to_ext subject_ext
	reserve1 reserve2
);
my @LOCAL_OUTPUT_ITEMS = qw (
	uid_number seen flagged deleted replied forwarded
	attachment attach4ajx mail_size internal
	from_field to_field date_field subject_field
	priority to_status
);
my @PORTAL_OUTPUT_ITEMS = qw(
	uid_number seen flagged deleted replied forwarded
	attachment attach4ajx mail_size internal
	from_field to_field date_field subject_field
	priority to_status
	from_ext to_ext subject_ext folder_name
);
my @SEARCH_INPUT_ITEMS= qw (
	uid_number seen flagged deleted replied forwarded
	attachment attach4ajx mail_size internal
	from_field to_field date_field subject_field
	priority to_status
	from_ext to_ext subject_ext
	reserve1 reserve2
);
my @SEARCH_OUTPUT_ITEMS= qw (
	fid uid_number seen flagged deleted replied forwarded
	attachment attach4ajx mail_size internal
	from_field to_field date_field subject_field
	priority to_status
	from_ext to_ext subject_ext
	reserve1 reserve2
);
my @SEARCH_FLAGS_ITEMS = qw (
	seen flagged deleted replied forwarded
);
my @SEARCH_INFOS_ITEMS = qw (
	srkey fid uid_number attachment attach4ajx mail_size internal
	from_field to_field date_field subject_field
	priority to_status
	from_ext to_ext subject_ext
	reserve1 reserve2
);
my $CACHE_MASTER_FILE = {
	base => 1,
	portal => 1,
	address => 1,
	imap => 1,
	imap_org => 1,
	imap_enabled => 1,
	imap_org_enabled => 1,
	ajxmailer => 1,
	ajxmailer_enabled => 1,
};

#===========================================
#     Custom
#===========================================
DA::Custom::rewrite_global_vars4ajx({
	"server_output_items" => \@SERVER_OUTPUT_ITEMS,
	"search_input_items" => \@SEARCH_INPUT_ITEMS,
	"search_output_items" => \@SEARCH_OUTPUT_ITEMS,
	"search_infos_items" => \@SEARCH_INFOS_ITEMS,
	"portal_items" => \@PORTAL_ITEMS
});
#===========================================

sub get_server_no {
	my $BASE_DIR	= "$DA::Vars::p->{base_dir}/local/mail";
	my $SVR_FILE	= "$BASE_DIR/server.dat";

	if (open (SVR, "< " . $SVR_FILE)) {
		my ($svr_no) = <SVR>;
		chomp ($svr_no);
		close (SVR);

		return ($svr_no);
	} else {
		return (0);
	}
}

sub message($;$;@) {
	my ($keyword, $charset, @args) = @_;

	my $messages  = {
		"ALREADY_EXISTS_FOLDER"  => t_("フォルダが既に存在します。"),
		"ALREADY_SEND_MAIL"      => t_("既に送信済みです。"),
		"INCLUDE_EXTERNAL_ADDRESS" => t_("送信先に社外が含まれています。"),
		"LONGER_FOLDER_NAME"     => t_("フォルダ名が長すぎます。"),
		"MAILER_NG"              => t_("統合メーラ(ニュースタイル)は使用できません。"),
		"NO_CLOSE_TABLE_TAG"     => t_("テーブルタグが閉じられていません。"),
		"NO_INPUT_QUERY"         => t_("%1を入力してください。", @args),
		"NO_INPUT_TO_FIELD"      => t_("宛先が指定されていません。"),
		"NO_INPUT_SUBJECT_FIELD" => t_("件名が入力されていません。"),
		"NO_SET_IMAP_CONFIG"     => t_("未設定項目があります。設定を確認してください。"),
		"NO_SET_QUOTA"           => t_("制限は設定されていません。"),
		"NO_TARGET_MAIL"         => t_("対象となるメールがありません。"),
		"NOT_APPEND_MAIL"        => t_("メールが保存できません。"),
		"NOT_APPEND_MAIL2LOCAL"  => t_("メールサーバに保存できませんでした。一時保管に保存します。"),
		"NOT_CLOSE_CACHE"        => t_("キャッシュが閉じれません。"),
		"NOT_CLOSE_DBM"          => t_("ＤＢＭが閉じれません。"),
		"NOT_CREATE_FOLDER"      => t_("フォルダが作成できません。"),
		"NOT_CODE"               => t_("使用出来ない領域の漢字コードが含まれております"),
		"NOT_DELETE_FOLDER"      => t_("フォルダが削除できません。"),
		"NOT_DELETE_HEADER_LOCAL"=> t_("ローカルからヘッダ情報が削除できません。"),
		"NOT_DELETE_HEADER_SEARCH"=>t_("検索結果からヘッダ情報が削除できません。"),
		"NOT_DELETE_HEADER_TABLE"=> t_("データベースからヘッダ情報が削除できません。"),
		"NOT_DELETE_MAIL"        => t_("メールが削除できません。"),
		"NOT_DELETE_MAIL_LOCAL"  => t_("ローカルメールが削除できません。"),
		"NOT_DELETE_MAIL_SEARCH" => t_("検索メールが削除できません。"),
		"NOT_DELETED_MAIL"       => t_("削除フラグが変更できません。"),
		"NOT_EXAMINE_FOLDER"     => t_("フォルダ選択に失敗しました。"),
		"NOT_EXISTS_CACHE"       => t_("キャッシュが存在しません。"),
		"NOT_EXISTS_DBM"         => t_("ＤＢＭが存在しません。"),
		"NOT_EXISTS_NEXT_UID"    => t_("次のメールが見つかりません。"),
		"NOT_EXISTS_PREV_UID"    => t_("前のメールが見つかりません。"),
		"NOT_FETCH_STATUS"       => t_("ステータス情報が取得できません。"),
		"NOT_FLAGGED_MAIL"       => t_("マークが変更できません。"),
		"NOT_FOUND_FOLDER"       => t_("フォルダが特定できません。"),
		"NOT_FOUND_MAIL"         => t_("メールが特定できません。"),
		"NOT_FOUND_PARENT"       => t_("親フォルダが特定できません。"),
		"NOT_FOUND_NEXT_UID"     => t_("次のメールが見つかりません。"),
		"NOT_FOUND_PREV_UID"     => t_("前のメールが見つかりません。"),
		"NOT_GET_ARCHIVE_TYPE"   => t_("圧縮形式が取得できません。"),
		"NOT_GET_COUNT"          => t_("メール数が取得できません。"),
		"NOT_GET_EPSML_ARCHIVE"  => t_("メーリングリストのデータが取得できません。"),
		"NOT_GET_FILTER_UID"     => t_("フォルダ情報が取得できません。"),
		"NOT_GET_FOLDER_LIST"    => t_("フォルダリストが取得できません。"),
		"NOT_GET_FOLDERS"        => t_("フォルダ一覧が取得できません。"),
		"NOT_GET_HEADER"         => t_("メールが見つかりません。既に削除されている可能性があります。"),
		"NOT_GET_LANG_LIST"      => t_("言語リストが取得できません。"),
		"NOT_GET_PORTAL"         => t_("メール情報が取得できません。"),
		"NOT_GET_RFC822"         => t_("メールが見つかりません。既に削除されている可能性があります。"),
		"NOT_GET_SIGN_LIST"      => t_("署名リストが取得できません。"),
		"NOT_GET_SIZE"           => t_("サイズが取得できません。"),
		"NOT_GET_TEMPLATE_LIST"  => t_("テンプレートリストが取得できません。"),
		"NOT_GET_TEMPLATE_DETAIL"=> t_("テンプレートが取得できません。"),
		"NOT_GET_TITLE_LIST"     => t_("敬称リストが取得できません。"),
		"NOT_INC_COUNT"          => t_("メール数が更新できません。"),
		"NOT_INC_FID"            => t_("フォルダ番号が更新できません。"),
		"NOT_INC_GRAPH"          => t_("グラフ番号が更新できません。"),
		"NOT_INC_INFO"           => t_("メール番号が更新できません。"),
		"NOT_INC_MAIL"           => t_("メール番号が更新できません。"),
		"NOT_INC_MSGID"          => t_("メッセージＩＤ番号が更新できません。"),
		"NOT_INC_SEARCH"         => t_("検索番号が更新できません。"),
		"NOT_IMPORT_ARCHIVE"     => t_("アーカイブファイルがインポートできません。"),
		"NOT_INSERT_HEADER_TABLE"=> t_("データベースにヘッダ情報が登録できません。"),
		"NOT_JOIN_RFC822"        => t_("メールが結合できません。"),
		"NOT_LOCK"               => t_("処理中です。しばらく待ってから再度お試しください。"),
		"NOT_LOGIN_IMAP_SERVER"  => t_("メールサーバにログインできません。"),
		"NOT_MAKE_ARCHIVE"       => t_("アーカイブファイルが作成できません。"),
		"NOT_MDN_MAIL"           => t_("開封通知が送信できません。"),
		"NOT_MESSAGE_COUNT"      => t_("メール数が取得できません。"),
		"NOT_MOVE_FILE"          => t_("ファイルが移動できません。"),
		"NOT_MOVE_FOLDER"        => t_("フォルダが移動できません。"),
		"NOT_MOVE_MAIL"          => t_("メールが移動できません。統合メーラを再起動して下さい。"),
		"NOT_MOVE_MAIL_LOCAL"    => t_("ローカルメールが移動できません。"),
		"NOT_OPEN_CACHE"         => t_("キャッシュが開けません。"),
		"NOT_OPEN_DBM"           => t_("ＤＢＭが開けません。"),
		"NOT_PARSE_HEADER"       => t_("ヘッダが解析できませんでした。"),
		"NOT_PARSE_HEADERS"      => t_("ヘッダ情報が取得できませんでした。"),
		"NOT_PARSE_RFC822"       => t_("全文が解析できませんでした。"),
		"NOT_PARSE_TO_FIELD"     => t_("%1の書式に誤りがあります。", @args),
		"NOT_QUOTE_ATTACH"       => t_("添付ファイルが引用できません。"),
		"NOT_QUOTE_BODY"         => t_("本文が引用できません。"),
		"NOT_QUOTE_HEADER"       => t_("ヘッダが引用できません。"),
		"NOT_QOUTE_STATUS"       => t_("ステータスが引用できません。"),
		"NOT_READ_ADDRESS_CONFIG"=> t_("アドレス設定の読み込みに失敗しました。"),
		"NOT_READ_ALIAS"         => t_("エイリアスの読み込みに失敗しました。"),
		"NOT_READ_ATTACHMENT"    => t_("添付ファイルの読み込みに失敗しました。"),
		"NOT_READ_BASE_CONFIG"   => t_("基本設定の読み込みに失敗しました。"),
		"NOT_READ_CACHE"         => t_("キャッシュの読み込みに失敗しました。"),
		"NOT_READ_CUSTOM_CONFIG" => t_("カスタム設定の読み込みに失敗しました。"),
		"NOT_READ_DETAIL"        => t_("メール詳細の読み込みに失敗しました。"),
		"NOT_READ_FILTER_CONFIG" => t_("フィルタ設定の読み込みに失敗しました。"),
		"NOT_READ_FOLDERS"       => t_("フォルダ一覧の読み込みに失敗しました。"),
		"NOT_READ_GUIDE_CONFIG"  => t_("ガイド設定の読み込みに失敗しました。"),
		"NOT_READ_HEADER"        => t_("ヘッダの読み込みに失敗しました。"),
		"NOT_READ_HEADER_LOCAL"  => t_("ローカルヘッダの読み込みに失敗しました。"),
		"NOT_READ_HEADERS_INFO"  => t_("ヘッダ一覧情報の読み込みに失敗しました。"),
		"NOT_READ_HEADERS_UIDLST"=> t_("ヘッダ一覧ＵＩＤリストの読み込みに失敗しました。"),
		"NOT_READ_HTML_PART"     => t_("ＨＴＭＬデータの読み込みに失敗しました。"),
		"NOT_READ_HTMLMAIL_CONFIG" => t_("ＨＴＭＬメール設定の読み込みに失敗しました。"),
		"NOT_READ_IMAP_CONFIG"   => t_("ＩＭＡＰ設定の読み込みに失敗しました。"),
		"NOT_READ_INTERNAL_DOMAIN"=> t_("社内ドメイン設定の読み込みに失敗しました。"),
		"NOT_READ_MAIL"          => t_("メールの読み込みに失敗しました。"),
		"NOT_READ_MAIL_CONFIG"   => t_("メール設定の読み込みに失敗しました。"),
		"NOT_READ_PORTAL_CONFIG" => t_("ポートレット設定の読み込みに失敗しました。"),
		"NOT_READ_RFC822"        => t_("全文の読み込みに失敗しました。"),
		"NOT_READ_MULTIPART"     => t_("マルチパートの読み込みに失敗しました。"),
		"NOT_READ_SEND_SERIAL"   => t_("送信番号の読み込みに失敗しました。"),
		"NOT_READ_SIGN"          => t_("署名の読み込みに失敗しました。"),
		"NOT_READ_SPELLCHECK_CONFIG" => t_("スペルチェック設定の読み込みに失敗しました。"),
		"NOT_READ_SMARTPHONE_CONFIG" => t_("スマートフォン設定の読み込みに失敗しました。"),
		"NOT_READ_STATUS_CONFIG" => t_("ステータス設定の読み込みに失敗しました。"),
		"NOT_READ_SYSTEM_CONFIG" => t_("システム設定の読み込みに失敗しました。"),
		"NOT_READ_TEXT_PART"     => t_("テキストデータの読み込みに失敗しました。"),
		"NOT_READ_UIDVALIDITY"   => t_("UIDVALIDITY履歴の読み込みに失敗しました。"),
		"NOT_RENAME_FOLDER"      => t_("フォルダが変更できません。"),
		"NOT_RENAME_VIEW_FOLDER" => t_("表示フォルダ名が変更できません。"),
		"NOT_SAVE_DRAFT_QUOTAOVER" => t_("容量制限を超えたため、保存できませんでした。"),
		"NOT_SAVE_DRAFT"         => t_("保存できませんでした。"),
		"NOT_SEARCH"             => t_("検索に失敗しました。"),
		"NOT_SEEN_MAIL"          => t_("既読フラグが変更できません。"),
		"NOT_SELECT_FOLDER"      => t_("フォルダ選択に失敗しました。"),
		"NOT_SELECT_FOLDER_TABLE"=> t_("データベースからフォルダ情報が取得できません。"),
		"NOT_SELECT_HEADER_LOCAL"=> t_("ローカルからヘッダ情報が取得できません。"),
		"NOT_SELECT_HEADER_PORTAL"=>t_("ポータルのヘッダ情報が取得できません。"),
		"NOT_SELECT_HEADER_SEARCH"=>t_("検索結果からヘッダ情報が取得できません。"),
		"NOT_SELECT_HEADER_TABLE"=> t_("データベースからヘッダ情報が取得できません。"),
		"NOT_SIMPLE_SEARCH"      => t_("検索に失敗しました。"),
		"NOT_STORE_SEEN"         => t_("既読フラグが設定できません。"),
		"NOT_SWITCH_ADDRESS_CONFIG" => t_("アドレス設定の切り換えに失敗しました。"),
		"NOT_SWITCH_BASE_CONFIG" => t_("基本設定の切り換えに失敗しました。"),
		"NOT_SWITCH_IMAP_CONFIG" => t_("ＩＭＡＰ設定の切り換えに失敗しました。"),
		"NOT_SWITCH_MAIL_CONFIG" => t_("メール設定の切り換えに失敗しました。"),
		"NOT_UPDATE_HEADER_LOCAL"=> t_("ローカルからヘッダ情報が更新できません。"),
		"NOT_UPDATE_HEADER_SEARCH"=>t_("検索結果からヘッダ情報が更新できません。"),
		"NOT_UPDATE_HEADER_TABLE"=> t_("データベースのヘッダ情報が更新できません。"),
		"NOT_USE_FOLDER_NAME"    => t_("指定のフォルダ名は使用できません。"),
		"NOT_USE_FOLDER_CHAR"    => t_("%1に使用できない文字が含まれています。", @args),
		"NOT_USE_SCRIPT_TAG"     => t_("SCRIPT タグは使用できません。"),
		"NOT_WRITE_ATTACHMENT"   => t_("添付ファイルの書き込みに失敗しました。"),
		"NOT_WRITE_CACHE"        => t_("キャッシュの書き込みに失敗しました。"),
		"NOT_WRITE_DETAIL"       => t_("メール詳細の書き込みに失敗しました。"),
		"NOT_WRITE_FILTER_CONFIG"=> t_("フィルタ設定の書き込みに失敗しました。"),
		"NOT_WRITE_FOLDERS"      => t_("フォルダ一覧の書き込みに失敗しました。"),
		"NOT_WRITE_HEADER"       => t_("ヘッダの書き込みに失敗しました。"),
		"NOT_WRITE_HEADER_LOCAL" => t_("ローカルヘッダの書き込みに失敗しました。"),
		"NOT_WRITE_HEADERS_INFO" => t_("ヘッダ一覧情報の書き込みに失敗しました。"),
		"NOT_WRITE_HEADERS_UIDLST"=>t_("ヘッダ一覧ＵＩＤリストの書き込みに失敗しました。"),
		"NOT_WRITE_IMAP_CONFIG"  => t_("ＩＭＡＰ設定の書き込みに失敗しました。"),
		"NOT_WRITE_MAIL"         => t_("メールの書き込みに失敗しました。"),
		"NOT_WRITE_MAIL_LOCAL"   => t_("ローカルメールの書き込みに失敗しました。"),
		"NOT_WRITE_MAIL_CONFIG"  => t_("メール設定の書き込みに失敗しました。"),
		"NOT_WRITE_PORTAL"       => t_("メール情報の書き込みに失敗しました。"),
		"NOT_WRITE_RFC822"       => t_("全文の書き込みに失敗しました。"),
		"NOT_WRITE_SEND_SERIAL"  => t_("送信番号の書き込みに失敗しました。"),
		"NOT_WRITE_STATUS_CONFIG"=> t_("ステータス設定の読み込みに失敗しました。"),
		"NOT_WRITE_UIDVALIDITY"  => t_("UIDVALIDITY履歴の書き込みに失敗しました。"),
		"OVER_MAX_SIZE"          => t_("メールのサイズが制限値を超えました。"),
		"OVER_IMPORT_SIZE"       => t_("インポートファイルサイズが上限を超えています。"),
		"OVER_ATTACH_SIZE"       => t_("添付ファイルサイズが上限を超えています。"),
		"OVER_RECV_SIZE"         => t_("受信サイズが上限を超えています。"),
		"OVER_TEXT_SIZE"         => t_("本文のサイズが上限を超えています。添付ファイルとして保存します。"),
		"OVER_SEND_ADDRESS"      => t_("送信先アドレス数が制限値(%1件)を超えています。", @args),
		"WARN_SEND_ADDRESS"      => t_("送信先に%1件指定されています。", @args),
		"WARN_UIDVALIDITY"       => t_("データの整合性に問題が発見されたため、再構築を実行します。"),
		"WARN_UIDVALIDITY_WITH_CONFIRM" => t_("データの整合性に問題がある可能性があります。再構築を実行しますか？"),
		"WARN_NOT_BACKUP_FOR_OUTDATE"   => t_("同じメールを２重で開いているため、バックアップできませんでした。"),
		"SAME_FOLDER_NAME"       => t_("変更前と変更後のフォルダ名が同じです。"),
		"SAME_MOVE_FOLDER"       => t_("移動元と移動先が同一です。"),
		"SPELLCHECK_NG"          => t_("スペルミスの可能性があります。"),
		"SPELLCHECK_SIZE_NG"     => t_("本文のサイズが上限を超えているため、スペルチェックは実施されませんでした。"),
		"UNKNOWN_CHARSET"        => t_("不明な文字コードです。"),
		"UNKNOWN_ENCODING"       => t_("不明なエンコード形式です。"),
		"UNMATCH_ARCHIVE_TYPE"   => t_("ファイル形式の指定が違います。"),
		"UNSUPPORT_EMAIL_FORMAT" => t_("%1の、メールアドレスの形式に誤りがあります。", @args),
		"NO_INC_SR_KEYWORD"       => t_("検索キーワードがありません。"), 
		"INVALID_INC_SR_KEYWORD"  => t_("有効な検索キーワードではありません。"),
		"INVALID_INC_SR_READ_ROW" => t_("検索結果の取得件数の指定が正しくありません。"),
		"INVALID_INC_SR_SNO"      => t_("検索結果の取得範囲の指定が正しくありません。"),
		"NOT_READ_INC_SRCH"       => t_("検索結果キャッシュの読み込みに失敗しました。"),
		"NOT_WRITE_INC_SRCH"      => t_("検索結果キャッシュの書き込みに失敗しました。"),
		"NOT_DB_INC_SRCH"         => t_("データベースから取得できませんでした。"),
		"INVALID_INC_SR_PARAM"    => t_("入力パラメータに矛盾があります。(read_row と start_sno は同時に指定できません。)"),
		"OUT_OF_INC_RESULT"       => t_("指定した範囲のデータはありません。"),
		"OVER_INC_CACHE_MAX"      => t_("指定した取得件数は最大キャッシュ数を超えています。"),
		"EXISTS_FOLDER_IN_FILE"   => t_("フォルダの追加ができません。フォルダ情報の更新が必要です。メーラを再起動してください。"),
		"NOT_EXISTS_PARENT"       => t_("移動先のフォルダが存在しません。フォルダ情報の更新が必要です。メーラを再起動してください。"),
		"NOT_LOCK_FOLDERS"        => t_("他の管理者がフォルダを操作中です。しばらくお待ちになってから再度お試しください。"),
		"NOT_MOVE_ALL_MAIL"          => t_("%1件のメールの移動に失敗しました。すでに移動されたか、削除された可能性があります。", @args),
		"NOT_DELETE_ALL_MAIL"          => t_("%1件のメールの削除に失敗しました。すでに移動されたか、削除された可能性があります。", @args)
	};

	my $message;
	if ($messages->{$keyword}) {
		$message = $messages->{$keyword};
	} else {
		$message = t_("例外エラー") . "( $keyword )";
	}
	return(DA::Unicode::convert_to($message, $charset || &mailer_charset()));
}
# $level =  0: 正常
#           1: 入力エラー
#           2: 警告
#           3: confirm
#           9: エラー
#        1001: WARN_UIDVALIDITY
#        1002: WARN_UIDVALIDITY_WITH_CONFIRM
#        1003: WARN_NOT_BACKUP_FOR_OUTDATE
sub error($$;@) {
	my ($keyword, $level, @args) = @_;

	return({"message" => &message($keyword, &mailer_charset(), @args), "error" => $level});
}

sub error4smartphone($$$$;@) {
	my ($hash, $field, $keyword, $level, @args) = @_;
	unless ($hash->{$field}) {
		$hash->{$field} = [];
	}

	my $message = &message($keyword, &mailer_charset(), @args);
	my $exists = 0;
	foreach my $h (@{$hash->{$field}}) {
		if ($h->{message} eq $message) {
			$exists = 1; last;
		}
	}

	unless ($exists) {
		push(@{$hash->{$field}}, {
			message => $message,
			error => $level
		});
	}

	return(1);
}

sub backup_ok($$) {
	my ($session, $imaps) = @_;

	if ($imaps->{mail}->{backup} eq "on") {
		return(1);
	} else {
		return(0);
	}
}

sub mailgtwy_ok($$) {
	my ($session, $imaps) = @_;

	if ($DA::IsLicense::op->{mailgw} && $imaps->{mail}->{pop} eq 'yes') {
		return(1);
	} else {
		return(0);
	}
}

sub core_charset {
	if ($DA::Vars::p->{charset}->{mail} =~ /^utf-8$/i) {
		return("UTF-8");
	} else {
		return("EUC-JP");
	}
}

sub mailer_charset {
	if ($DA::Vars::p->{charset}->{mail} =~ /^utf-8$/i) {
		return("UTF-8");
	} else {
		return("EUC-JP");
	}
}

sub search_charset {
	if ($DA::Vars::p->{charset}->{imap} =~ /^utf-8$/i) {
		return("UTF-8");
	} else {
		return("ISO-2022-JP");
	}
}

sub internal_charset {
	return(DA::Unicode::internal_charset());
}

sub source_charset {
	return(DA::Unicode::sourcecode_charset());
}

sub external_charset {
	return("UTF-8");
}

sub gettext_charset {
	return(DA::Unicode::gettext_charset());
}

sub gettext_charset_real {
	return(DA::Unicode::gettext_charset_real());
}

sub convert_core2mailer($) {
	my ($ref) = @_;

	if (ref($ref) eq "HASH") {
		return(&_convert_core2mailer4hash($ref));
	} elsif (ref($ref) eq "ARRAY") {
		return(&_convert_core2mailer4array($ref));
	} else {
		return(&_convert_core2mailer4scalar($ref));
	}
}

sub convert_mailer($) {
	my ($ref) = @_;
	if (ref($ref) eq "HASH") {
		return(&_convert_mailer4hash($ref));
	} elsif (ref($ref) eq "ARRAY") {
		return(&_convert_mailer4array($ref));
	} else {
		return(&_convert_mailer4scalar($ref));
	}
}

sub convert_internal($) {
	my ($ref) = @_;

	if (ref($ref) eq "HASH") {
		return(&_convert_internal4hash($ref));
	} elsif (ref($ref) eq "ARRAY") {
		return(&_convert_internal4array($ref));
	} else {
		return(&_convert_internal4scalar($ref));
	}
}

sub convert_external($) {
	my ($ref) = @_;

	if (ref($ref) eq "HASH") {
		return(&_convert_external4hash($ref));
	} elsif (ref($ref) eq "ARRAY") {
		return(&_convert_external4array($ref));
	} else {
		return(&_convert_external4scalar($ref));
	}
}

sub convert_internal2gettext($) {
	my ($ref) = @_;

	if (ref($ref) eq "HASH") {
		return(&_convert_internal2gettext4hash($ref));
	} elsif (ref($ref) eq "ARRAY") {
		return(&_convert_internal2gettext4array($ref));
	} else {
		return(&_convert_internal2gettext4scalar($ref));
	}
}

sub _convert_core2mailer4hash($) {
	my ($hash) = @_;
	my $h = {};

	foreach my $key (keys %{$hash}) {
		if (ref($hash->{$key}) eq "HASH") {
			$h->{$key} = &_convert_core2mailer4hash($hash->{$key});
		} elsif (ref($hash->{$key}) eq "ARRAY") {
			$h->{$key} = &_convert_core2mailer4array($hash->{$key});
		} else {
			$h->{$key} = &_convert_core2mailer4scalar($hash->{$key});
		}
	}

	return($h);
}

sub _convert_mailer4hash($) {
	my ($hash) = @_;
	my $h = {};

	foreach my $key (keys %{$hash}) {
		if (ref($hash->{$key}) eq "HASH") {
			$h->{$key} = &_convert_mailer4hash($hash->{$key});
		} elsif (ref($hash->{$key}) eq "ARRAY") {
			$h->{$key} = &_convert_mailer4array($hash->{$key});
		} else {
			$h->{$key} = &_convert_mailer4scalar($hash->{$key});
		}
	}

	return($h);
}

sub _convert_internal4hash($) {
	my ($hash) = @_;
	my $h = {};

	foreach my $key (keys %{$hash}) {
		if (ref($hash->{$key}) eq "HASH") {
			$h->{$key} = &_convert_internal4hash($hash->{$key});
		} elsif (ref($hash->{$key}) eq "ARRAY") {
			$h->{$key} = &_convert_internal4array($hash->{$key});
		} else {
			$h->{$key} = &_convert_internal4scalar($hash->{$key});
		}
	}

	return($h);
}

sub _convert_external4hash($) {
	my ($hash) = @_;
	my $h = {};

	foreach my $key (keys %{$hash}) {
		if (ref($hash->{$key}) eq "HASH") {
			$h->{$key} = &_convert_external4hash($hash->{$key});
		} elsif (ref($hash->{$key}) eq "ARRAY") {
			$h->{$key} = &_convert_external4array($hash->{$key});
		} else {
			$h->{$key} = &_convert_external4scalar($hash->{$key});
		}
	}

	return($h);
}

sub _convert_internal2gettext4hash($) {
	my ($hash) = @_;
	my $h = {};

	foreach my $key (keys %{$hash}) {
		if (ref($hash->{$key}) eq "HASH") {
			$h->{$key} = &_convert_internal2gettext4hash($hash->{$key});
		} elsif (ref($hash->{$key}) eq "ARRAY") {
			$h->{$key} = &_convert_internal2gettext4array($hash->{$key});
		} else {
			$h->{$key} = &_convert_internal2gettext4scalar($hash->{$key});
		}
	}

	return($h);
}

sub _convert_core2mailer4array($) {
	my ($array) = @_;
	my $a = [];

	foreach my $l (@{$array}) {
		if (ref($l) eq "HASH") {
			push(@{$a}, &_convert_core2mailer4hash($l));
		} elsif (ref($l) eq "ARRAY") {
			push(@{$a}, &_convert_core2mailer4array($l));
		} else {
			push(@{$a}, &_convert_core2mailer4scalar($l));
		}
	}

	return($a);
}

sub _convert_mailer4array($) {
	my ($array) = @_;
	my $a = [];

	foreach my $l (@{$array}) {
		if (ref($l) eq "HASH") {
			push(@{$a}, &_convert_mailer4hash($l));
		} elsif (ref($l) eq "ARRAY") {
			push(@{$a}, &_convert_mailer4array($l));
		} else {
			push(@{$a}, &_convert_mailer4scalar($l));
		}
	}

	return($a);
}

sub _convert_internal4array($) {
	my ($array) = @_;
	my $a = [];

	foreach my $l (@{$array}) {
		if (ref($l) eq "HASH") {
			push(@{$a}, &_convert_internal4hash($l));
		} elsif (ref($l) eq "ARRAY") {
			push(@{$a}, &_convert_internal4array($l));
		} else {
			push(@{$a}, &_convert_internal4scalar($l));
		}
	}

	return($a);
}

sub _convert_external4array($) {
	my ($array) = @_;
	my $a = [];

	foreach my $l (@{$array}) {
		if (ref($l) eq "HASH") {
			push(@{$a}, &_convert_external4hash($l));
		} elsif (ref($l) eq "ARRAY") {
			push(@{$a}, &_convert_external4array($l));
		} else {
			push(@{$a}, &_convert_external4scalar($l));
		}
	}

	return($a);
}

sub _convert_internal2gettext4array($) {
	my ($array) = @_;
	my $a = [];

	foreach my $l (@{$array}) {
		if (ref($l) eq "HASH") {
			push(@{$a}, &_convert_internal2gettext4hash($l));
		} elsif (ref($l) eq "ARRAY") {
			push(@{$a}, &_convert_internal2gettext4array($l));
		} else {
			push(@{$a}, &_convert_internal2gettext4scalar($l));
		}
	}

	return($a);
}

sub _convert_core2mailer4scalar($) {
	my ($string) = @_;

	if (&mailer_charset() eq &core_charset()) {
		return($string);
	} else {
		return(DA::Charset::convert(\$string, &core_charset(), &mailer_charset()));
	}
}

sub _convert_mailer4scalar($) {
	my ($string) = @_;

	if (&mailer_charset() eq &internal_charset()) {
		return($string);
	} else {
		return(DA::Unicode::convert_to($string, &mailer_charset()));
	}
}

sub _convert_internal4scalar($) {
	my ($string) = @_;

	if (&mailer_charset() eq &internal_charset()) {
		return($string);
	} else {
		return(DA::Unicode::convert_from($string, &mailer_charset()));
	}
}

sub _convert_external4scalar($) {
	my ($string) = @_;

	if (&mailer_charset() eq &external_charset()) {
		return($string);
	} else {
		return(DA::Charset::convert(\$string, &mailer_charset(), &external_charset()));
	}
}

sub _convert_internal2gettext4scalar($) {
	my ($string) = @_;

	if (&internal_charset() eq &gettext_charset_real()) {
		return($string);
	} else {
		return(DA::Charset::convert(\$string, &internal_charset(), &gettext_charset_real()));
	}
}

sub encode_mailer($;$;$) {
	my ($in, $cr, $tag) = @_;

	if (&mailer_charset() eq "UTF-8") {
		return(DA::Ajax::encode($in, $cr, $tag, "utf8", "utf8"));
	} elsif (&mailer_charset() eq "EUC-JP") {
		return(DA::Ajax::encode($in, $cr, $tag, "euc", "euc"));
	} else {
		return(DA::Ajax::encode($in, $cr, $tag, "euc", "euc"));
	}
}

sub encode_internal($;$;$) {
	my ($in, $cr, $tag) = @_;

	if (&internal_charset() eq "UTF-8") {
		return(DA::Ajax::encode($in, $cr, $tag, "utf8", "utf8"));
	} elsif (&internal_charset() eq "EUC-JP") {
		return(DA::Ajax::encode($in, $cr, $tag, "euc", "euc"));
	} else {
		return(DA::Ajax::encode($in, $cr, $tag, "euc", "euc"));
	}
}

sub encode_external($;$;$) {
	my ($in, $cr, $tag) = @_;

	if (&external_charset() eq "UTF-8") {
		return(DA::Ajax::encode($in, $cr, $tag, "utf8", "utf8"));
	} elsif (&external_charset() eq "EUC-JP") {
		return(DA::Ajax::encode($in, $cr, $tag, "euc", "euc"));
	} else {
		return(DA::Ajax::encode($in, $cr, $tag, "sjis", "sjis"));
	}
}

sub _logger_init($;$) {
	my ($session, $mode) = @_;
	my $logger = {
		"log"	=> DA::DeBug::log_init(),
		"time"	=> DA::DeBug::time_init(),
		"noimap"=> ($mode) ? 1 : 0
	};

	return($logger);
}

sub _logger($$;$;$;$) {
	my ($session, $imaps, $logger, $title, $str) = @_;

	if ($title eq "") {
		my @caller = caller;
		$title = "$caller[0]:$caller[2]:$session->{user}";
	} else {
		$title = &convert_internal($title);
	}
	if ($str eq "") {
		$str = "AjaxMailer time logger.";
	} else {
		$str = &convert_internal($str);
	}

	# デバッグログの出力
	if ($DA::Vars::p->{DEBUG} && !$logger->{noimap}) {
		DA::DeBug::debug_log($imaps, $title)
	}

	# IMAPログの出力
	if ($DA::Vars::p->{IMAP_LOG} && ref($imaps->{session}) && !$logger->{noimap}) {
		DA::DeBug::imap_log($imaps->{session}->{History}, $title, $logger->{log})
	}

	# TIMEログの出力
	if ($DA::Vars::p->{TIME_LOG}) {
		DA::DeBug::time_log($str, $title, $logger->{time});
	}

	return(1);
}

sub jreplace($$$;$) {
	my ($buf, $pattern, $replace, $mode) = @_;
	my $str = (ref($buf) eq 'SCALAR') ? $$buf : $buf;
	return undef if (!defined $str);
	if (&mailer_charset() eq "UTF-8") {
		$pattern = DA::Charset::convert
					(\$pattern, &source_charset(), &mailer_charset());
		$replace = DA::Charset::convert
					(\$replace, &source_charset(), &mailer_charset());
		if ($mode) {
			$str =~ s/\Q$pattern\E/$replace/sgi;
		} else {
			$str =~ s/\Q$pattern\E/$replace/sg;
		}
		return($str);
	} else {
		return(DA::Charset::jreplace(\$str, $pattern, $replace, $mode));
	}
}

sub jlength($) {
	my ($buf) = @_;
	my $length = DA::Charset::num_of_chars($buf, &mailer_charset());

	return($length)
}

sub read_query($$;$) {
	my ($query, $input, $check_keys) = @_;
	my $c = {};

	# 組織メールのパラメータ
	DA::OrgMail::custom_mail_read_query4ajx($query, $input);

	DA::Custom::custom_mail_read_query4ajx($query, $input);

	if (&mailer_charset() eq "UTF-8") {
		foreach my $key (@{$check_keys}) {
			next if (!$query->param($key));
			if (DA::CGIdef::check_gaiji_utf8($query->param($key),'return')){
				return (&error("NOT_CODE", 9));	
			}
		}
		foreach my $i (@{$input}) {
			$c->{$i} = $query->param($i);
			$c->{$i} = DA::Ajax::encode($c->{$i}, 0, 0, "utf8", "utf8");
		}
	} else {
		foreach my $i (@{$input}) {
			$c->{$i} = $query->param($i);
			if (DA::SmartPhone::isSmartPhoneUsed()) {
				$c->{$i} = DA::Ajax::encode($c->{$i}, 0, 0, "euc", "euc");
			} else {
				$c->{$i} = DA::Ajax::encode($c->{$i}, 0, 0, "utf8", "euc");
			}
		}
	}
	if (DA::SmartPhone::isSmartPhoneUsed()) {
		$c->{smartphone} = 1;
	}

	return($c);
}

sub lockfile($$) {
	my ($session, $file) = @_;
	my $no = sprintf("%02d", int($session->{user}%100));
	my $lock = "$DA::Vars::p->{lock100_dir}/$no/$session->{user}.AjaxMailer.$file";
	if (DA::OrgMail::check_org_mail_permit($session)) {
		DA::OrgMail::lockfile($session,$file,\$lock);
	}
	return($lock);
}

sub lock($$;$;$;$) {
	my ($session, $file, $try, $sec, $wait) = @_;

	my $lock = &lockfile($session, $file);

	if ($file =~ /^(system|custom)\./) {
		return(1);
	}

	if (!$try) {
		$try = $DA::Vars::p->{ma_lock_try4ajx} || 5;
	}
	if (!$wait) {
		$wait = $DA::Vars::p->{ma_lock_wait4ajx} || 3;
	}
	if (!$sec) {
		$sec = $DA::Vars::p->{ma_lock_expire4ajx} || $LOCK_EXPIRE;
	}

	# --- memcache
	if (DA::FS::check_mc_lock()) {
		if (DA::FS::mc_lock("$session->{user}.AjaxMailer.$file", $try, $sec, $wait)) {
			return(1);
		} else {
			&_warn($session, "Can't lock [$lock]");
			return(0);
		}
	}

	if (DA::Custom::ajxmailer_check_nolock_file($session, $file)) {
		return(1);
	}
	if ($sec) {
		my $info = DA::CGIdef::get_f_info($lock);
		if ($info) {
			my $expire = int($info->{ctime}) + int($sec);
			my $now    = DA::System::nfs_time();
			if ($expire < $now) {
				my $res = DA::System::file_rmdir($lock);
			}
		}
	}
	while (!DA::System::file_mkdir("$lock", 0777)) {
		if (--$try < 0) {
			&_warn($session, "Can't lock [$lock]");
			return(0);
		}
		if($wait>1){
			sleep($wait);
		}else{
			Time::HiRes::usleep($wait*1000000);
		}
		
	}

	return(1);
}

sub unlock($$) {
	my ($session, $file) = @_;
	my $lock = &lockfile($session, $file);

	if ($file =~ /^(system|custom)\./) {
		return(1);
	}

	# --- memcache
	if (DA::FS::check_mc_lock()) {
		if (DA::FS::mc_unlock("$session->{user}.AjaxMailer.$file")) {
			return(1);
		} else {
			&_warn($session, "Can't unlock [$lock]");
			return(0);
		}
	}

	if (DA::Custom::ajxmailer_check_nolock_file($session, $file)) {
		return(1);
	}
	
	if (my $res = DA::System::file_rmdir($lock)) {
		return(1);
	} else {
		&_warn($session, "Can't unlock [$lock]");
		return(0);
	}
}

sub filefunc($$) {
	my ($session, $file) = @_;
	my $func;

	if ($file =~ /([^\/]+)$/) {
		$func = $1;
	} else {
		$func = $file;
	}

	return($func);
}

sub open_file($$$) {
	my ($session, $file, $mode) = @_;
	my $func = &filefunc($session, $file);

	if (&lock($session, "file.$func")) {
		if (my $fh = DA::System::iofile_new($file, $mode)) {
			return($fh);
		} else {
			&unlock($session, "file.$func");
			&_warn($session, "Can't open file [$file]");
			return(undef);
		}
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub open_file_utf($$$) {
	my ($session, $file, $mode) = @_;
	my $func = &filefunc($session, $file);

	if (&lock($session, "file.$func")) {
		if (my $fh = DA::Unicode::file_open($file, $mode)) {
			return($fh);
		} else {
			&unlock($session, "file.$func");
			&_warn($session, "Can't open file [$file]");
			return(undef);
		}
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub close_file($$$) {
	my ($session, $file, $fh) = @_;
	my $func = &filefunc($session, $file);

	my $result = $fh->close;

	&unlock($session, "file.$func");

	if ($result) {
		return($result);
	} else {
		&_warn($session, "Can't close file [$file]");
		return(undef);
	}
}

sub close_file_utf($$$) {
	my ($session, $file, $fh) = @_;
	my $func = &filefunc($session, $file);

	my $result = $fh->close;

	&unlock($session, "file.$func");

	if ($result) {
		return($result);
	} else {
		&_warn($session, "Can't close file [$file]");
		return(undef);
	}
}

sub read_file($$) {
	my ($session, $file) = @_;
	my $buf = "";

	if (-f $file) {
		if (my $fh = &open_file($session, $file, "r")) {
			while (my $l = <$fh>) {
				$buf .= $l;
			}
			&close_file($session, $file, $fh);
			return($buf);
		} else {
			&_warn($session, "open_file");
			return(undef);
		}
	} else {
		return($buf);
	}
}

sub read_file_utf($$) {
	my ($session, $file) = @_;
	my $buf = "";

	if (DA::Unicode::file_exist($file)) {
		if (my $fh = &open_file_utf($session, $file, "r")) {
			while (my $l = <$fh>) {
				$l =~s/\t/    /g;
				$l =~s/^(\r\n)$/ \n/g;
				$buf .= $l;
			}
			&close_file_utf($session, $file, $fh);
			return($buf);
		} else {
			&_warn($session, "open_file_utf");
			return(undef);
		}
	} else {
		return($buf);
	}
}

sub write_file_buf($$$) {
	my ($session, $file, $buf) = @_;

	if (my $fh = &open_file($session, $file, "w")) {
		print $fh $buf;
		if (&close_file($session, $file, $fh)) {
			return(1);
		} else {
			&_warn($session, "close_file");
			return(undef);
		}
	} else {
		&_warn($session, "open_file");
		return(undef);
	}
}

sub write_file_utf($$$) {
	my ($session, $file, $buf) = @_;

	if (my $fh = &open_file_utf($session, $file, "w")) {
		print $fh $buf;
		if (&close_file_utf($session, $file, $fh)) {
			return(1);
		} else {
			&_warn($session, "close_file_utf");
			return(undef);
		}
	} else {
		&_warn($session, "open_file_utf");
		return(undef);
	}
}

sub read_lines($$) {
	my ($session, $file) = @_;
	my $lines = [];

	if (my $fh = &open_file($session, $file, "r")) {
		while (my $l = <$fh>) {
			chomp($l);
			push(@{$lines}, $l);
		}
		&close_file($session, $file, $fh);
		return($lines);
	} else {
		&_warn($session, "open_file");
		return(undef);
	}
}

sub write_lines($$$) {
	my ($session, $file, $lines) = @_;

	if (my $fh = &open_file($session, $file, "w")) {
		foreach my $l (@{$lines}) {
			print $fh "$l\n";
		}
		if (&close_file($session, $file, $fh)) {
			return(1);
		} else {
			&_warn($session, "close_file");
			return(undef);
		}
	} else {
		&_warn($session, "open_file");
		return(undef);
	}
}

sub read_lines_utf($$) {
	my ($session, $file) = @_;
	my $lines = [];

	if (my $fh = &open_file_utf($session, $file, "r")) {
		while (my $l = <$fh>) {
			chomp($l);
			push(@{$lines}, $l);
		}
		&close_file_utf($session, $file, $fh);
		return($lines);
	} else {
		&_warn($session, "open_file");
		return(undef);
	}
}

sub write_lines_utf($$$) {
	my ($session, $file, $lines) = @_;

	if (my $fh = &open_file_utf($session, $file, "w")) {
		foreach my $l (@{$lines}) {
			print $fh "$l\n";
		}
		if (&close_file_utf($session, $file, $fh)) {
			return(1);
		} else {
			&_warn($session, "close_file");
			return(undef);
		}
	} else {
		&_warn($session, "open_file");
		return(undef);
	}
}

sub cachefile($$) {
	my ($session, $func) = @_;
	my $gid =(DA::OrgMail::check_org_mail_permit($session))?DA::OrgMail::get_gid($session):$session->{user};
	my $file = "$session->{temp_dir}/$session->{sid}.$gid.AjaxMailer.cache.$func";

	return($file);
}

sub open_cache($$$) {
	my ($session, $func, $mode) = @_;
	my $file = &cachefile($session, $func);

	if (&lock($session, "cache.$func")) {
		if (my $fh = DA::System::iofile_new($file, $mode)) {
			return($fh);
		} else {
			&unlock($session, "cache.$func");
			&_warn($session, "Can't open file [$file]");
			return(undef);
		}
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub sort_cache($$$) {
	my ($session, $func, $option) = @_;
	my $file = &cachefile($session, $func);

	if (&lock($session, "cache.$func")) {
		if (my $fh = new IO::File("export LANG=C;/bin/sort " . DA::Valid::check_cmdoption($option) . " -t ' ' " . DA::Valid::check_path($file) . " 2>/dev/null |")) {
			return($fh);
		} else {
			&unlock($session, "cache.$func");
			&_warn($session, "Can't open file [$file]");
			return(undef);
		}
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub close_cache($$$) {
	my ($session, $func, $fh) = @_;
	my $file = &cachefile($session, $func);
	my $result = $fh->close;

	&unlock($session, "cache.$func");

	if ($result) {
		return($result);
	} else {
		&_warn($session, "Can't close file [$file]");
		return(undef);
	}
}

sub clear_cache($$) {
	my ($session, $func) = @_;
	my $file = &cachefile($session, $func);

	if (&lock($session, "cache.$func")) {
		DA::System::file_unlink($file);

		&unlock($session, "cache.$func");

		return(1);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub read_cache($$) {
	my ($session, $func) = @_;
	my $cache;

	if (my $fh = &open_cache($session, $func, "r")) {
		while (my $l = <$fh>) {
			$cache .= $l;
		}
		&close_cache($session, $func, $fh);
		return($cache);
	} else {
		&_warn($session, "open_cache");
		return(undef);
	}
}

sub write_cache($$$) {
	my ($session, $func, $cache) = @_;

	if (my $fh = &open_cache($session, $func, "w")) {
		print $fh $cache;
		if (&close_cache($session, $func, $fh)) {
			return(1);
		} else {
			&_warn($session, "close_cache");
			return(undef);
		}
	} else {
		&_warn($session, "open_cache");
		return(undef);
	}
}

sub dbmfile($$) {
	my ($session, $func) = @_;
	my $file;
	if ($func eq "mdn.flags"){
		$file = DA::Mailer::get_mailer_dir($session,$session->{user},undef,"$session->{user}.AjaxMailer.dbm.$func");
	} else {
		$file = "$session->{temp_dir}/$session->{sid}.AjaxMailer.dbm.$func";
	}

	return($file);
}

sub open_dbm($$) {
	my ($session, $func) = @_;
	my $file = &dbmfile($session, $func);
	my %hash;

	if (&lock($session, "dbm.$func")) {
		if ( DA::System::dbm_open(\%hash, $DBM_TYPE, $file, $DBM_FLAGS, $DBM_MODE, 1 )) {
		    return(\%hash);
		} else {
			&unlock($session, "dbm.$func");
			&_warn($session, "Can't open dbm [$file]");
			return(undef);
		}
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub close_dbm($$$) {
	my ($session, $func, $hash) = @_;
	my $file = &dbmfile($session, $func);
	my $result = untie(%{$hash});

	&unlock($session, "dbm.$func");

	if ($result) {
		return($result);
	} else {
		&_warn($session, "Can't close dbm [$file]");
		return(undef);
	}
}

sub clear_dbm($$) {
	my ($session, $func) = @_;
	my $file = &dbmfile($session, $func);

	if (&lock($session, "dbm.$func")) {
		DA::System::file_unlink($file);

		&unlock($session, "dbm.$func");

		return(1);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub read_dbm_line($$$) {
	my ($hash, $key, $items) = @_;
	my %line;

	@line{@{$items}} = split(/\t/, $hash->{$key});

	return(\%line);
}

sub write_dbm_line($$$$) {
	my ($hash, $key, $data, $items) = @_;
	my @values;

	foreach my $i (@{$items}) {
		push(@values, $data->{$i});
	}
	$hash->{$key} = join("\t", @values);

	return(1);
}

sub exists_master_cache($$) {
	my ($session, $func) = @_;

	if ($DA::Vars::p->{ma_cache_master4ajx} eq "on") {
		if (exists $CACHE_MASTER_FILE->{$func}) {
			if (exists $session->{ajxmailer} && exists $session->{ajxmailer}->{$func}) {
				return(1);
			}
		}
	}

	return(0);
}

sub target_master_cache($$) {
	my ($session, $func) = @_;

	if ($DA::Vars::p->{ma_cache_master4ajx} eq "on") {
		if (exists $CACHE_MASTER_FILE->{$func}) {
			return(1);
		}
	}

	return(0);
}

sub get_master($$;$;$) {
	my ($session, $func, $mode, $opt) = @_;

	my $param=DA::OrgMail::get_master(@_) if (DA::OrgMail::check_org_mail_permit($session));
	if (ref($param) eq 'HASH') { return($param); }

	if (&exists_master_cache($session, $func) && !$mode) {
		my $param = {};
		%{$param} = %{$session->{ajxmailer}->{$func}};

		return(&convert_mailer($param));
	}

	if (&lock($session, "master.$func")) {
		my $param = DA::IS::get_master($session, $func, $mode, $opt);

		if (&target_master_cache($session, $func) && !$mode) {
			%{$session->{ajxmailer}->{$func}} = %{$param};
			DA::Session::update($session);
		}

		&unlock($session, "master.$func");

		return(&convert_mailer($param));
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub save_master($$$;$) {
	my ($session, $param, $func, $mode) = @_;

	my $noupdate=DA::OrgMail::save_master(@_) if (DA::OrgMail::check_org_mail_permit($session));
	if ($noupdate) { return(1); }

	if (&lock($session, "master.$func")) {
		my ($user, $pass, $insuite);
		if ($func eq 'imap' || $func eq "imap_enabled") {
			if ($param->{imap_account} eq lc($DA::Vars::p->{package_name})
			||  $DA::Vars::p->{imap_account} eq lc($DA::Vars::p->{package_name})) {
				# アカウント情報の削除
				$user = $param->{user};
				$pass = $param->{pass};
				$insuite = 1;

				delete $param->{user};
				delete $param->{pass};
			}
			if ($param->{smtp_account} ne "account") {
				delete $param->{smtp_user};
				delete $param->{smtp_pass};
			}
		}

		DA::IS::save_master($session, &convert_internal($param), $func, $mode);

		if ($insuite) {
			$param->{user} = $user;
			$param->{pass} = $pass;
		}

		&unlock($session, "master.$func");

		return(1);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub get_master_enabled($$;$;$) {
	my ($session, $func, $mode, $opt) = @_;

	my $param=DA::OrgMail::get_master_enabled(@_) if (DA::OrgMail::check_org_mail_permit($session));
	if (ref($param) eq 'HASH') { return(&convert_mailer($param)); }

	if (&exists_master_cache($session, "$func\_enabled") && !$mode) {
		my $param = {};
		%{$param} = %{$session->{ajxmailer}->{"$func\_enabled"}};

		return(&convert_mailer($param));
	}

	if (&lock($session, "master.enabled.$func")) {
		my $param = DA::IS::get_master($session, "$func\_enabled", $mode, $opt);

		if (&target_master_cache($session, "$func\_enabled") && !$mode) {
			%{$session->{ajxmailer}->{"$func\_enabled"}} = %{$param};
			DA::Session::update($session);
		}

		&unlock($session, "master.enabled.$func");

		return(&convert_mailer($param));
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub save_master_enabled($$$;$) {
	my ($session, $param, $func, $mode) = @_;
	my $noupdate=DA::OrgMail::save_master_enabled(@_) if (DA::OrgMail::check_org_mail_permit($session));
	if ($noupdate) { return(1); }

	my $file="$func\_enabled";
	if (&lock($session, "master.enabled.$func")) {
		DA::IS::save_master($session, &convert_internal($param), $file, $mode);

		&unlock($session, "master.enabled.$func");

		return(1);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub switch_master($$) {
	my ($session, $func) = @_;

    my $orgmail_result=DA::OrgMail::switch_master(@_) if (DA::OrgMail::check_org_mail_permit($session));
    if ($orgmail_result) { return($orgmail_result); }

	my $result = 1;
	if (&lock($session, "master.enabled.$func")) {
		if (&lock($session, "master.$func")) {
			my $src = "$DA::Vars::p->{data_dir}/master/"
			        . "$session->{user}/.$func\.dat";
			   $src = DA::Unicode::get_filename($src);
			my $dst = "$DA::Vars::p->{data_dir}/master/"
			        . "$session->{user}/.$func\_enabled\.dat";
			   $dst = DA::Unicode::get_filename($dst);
			DA::System::file_unlink($dst);
			if ((stat($src))[9] ne (stat($dst))[9]) {
				if (DA::System::file_copy($src, $dst)) {
					# セッション情報の更新
					if (&exists_master_cache($session, "$func\_enabled")) {
						delete $session->{ajxmailer}->{"$func\_enabled"};
						DA::Session::update($session);
					}
				} else {
					&_warn($session, "Can't copy file [$src]");
					$result = undef;
				}
			}

			&unlock($session, "master.$func");
		} else {
			&_warn($session, "lock");
			$result = undef;
		}

		&unlock($session, "master.enabled.$func");
	} else {
		&_warn($session, "lock");
		$result = undef;
	}

	return($result);
}

sub conv_master($) {
	my ($session) = @_;

	if (my $custom = &get_sys_custom($session, "mail")) {
		if ($custom->{mv_stdmailer_setting} eq 'off') {
			my $file = "$DA::Vars::p->{data_dir}/master/$session->{user}/.ajxmailer.dat";
			if (DA::Unicode::file_exist($file)) {
				return(1);
			} else {
				if (my $def = &get_master($session, "ajxmailer", 1)) {
					if (&save_master($session, $def, "ajxmailer")) {
						return(1);
					} else {
						&_warn($session, "save_master");
						return(undef);
					}
				} else {
					&_warn($session, "get_master");
					return(undef);
				}
			}
		} else {
			return(&init_master($session));
		}
	} else {
		&_warn($session, "get_sys_custom");
		return(undef);
	}
}

sub init_master($) {
	my ($session) = @_;
	my $file = "$DA::Vars::p->{data_dir}/master/$session->{user}/.ajxmailer.dat";
	if (DA::Unicode::file_exist($file)) {
		return(1);
	} else {
		if (my $mail = &get_master($session, "mail", 2)) {
			if (my $def = &get_master($session, "ajxmailer")) {
				my $new = {};
				foreach my $key (@INIT_MASTER_ITEMS) {
					if((defined $mail->{$key}) && ($mail->{$key} ne "")){
						if ($key eq "list_order") {
							my $order;
							foreach my $l (split(/\|/, $mail->{$key})) {
								if ($l eq "select") {
									next;
								} elsif ($l eq "action") {
									next;
								} elsif ($l eq "read") {
									$order .= "seen\|";
								} elsif ($l eq "attach") {
									$order .= "attachment\|";
								} else {
									$order .= "$l\|";
								}
							}
							$order =~ s/\|+$//g;
							$new->{$key} = $order;
						} else {
							$new->{$key} = $mail->{$key};
						}
					} elsif ((defined $def->{$key}) && ($def->{$key} ne "")){
						$new->{$key} = $def->{$key};
					}
				}
				if (&save_master($session, $new, "ajxmailer")) {
					return(1);
				} else {
					&_warn($session, "save_master");
					return(undef);
				}
			} else {
				&_warn($session, "get_master");
				return(undef);
			}
		} else {
			&_warn($session, "get_master");
			return(undef);
		}
	}
}

sub get_status($) {
	my ($session) = @_;
	my $file  = DA::Mailer::get_mailer_dir($session,$session->{user},'recv','status.dat');
	my $param = {};

	if (DA::Unicode::file_exist($file)) {
		if (my $fh = &open_file_utf($session, $file, "r")) {
			while (my $l = <$fh>) {
				chomp($l);
				my ($key, $value) = split(/\=/, $l, 2);
				$param->{$key} = $value;
			}

			&close_file_utf($session, $file, $fh);

			return($param);
		} else {
			&_warn($session, "open_file_utf");
			return(undef);
		}
	} else {
		return($param);
	}
}

sub save_status($$) {
	my ($session, $param) = @_;
	my $file = DA::Mailer::get_mailer_dir($session,$session->{user},'recv','status.dat');

	if (my $fh = &open_file_utf($session ,$file, "w")) {
		foreach my $key (sort keys %{$param}) {
			print $fh "$key\=$param->{$key}\n";
		}

		if (&close_file_utf($session, $file, $fh)) {
			return(1);
		} else {
			return(undef);
		}
	} else {
		&_warn($session, "open_file_utf");
		return(undef);
	}
}

sub get_filter($;$) {
	my ($session,$mid) = @_;
	my $func  = "filter";
	
	# 明示的に $mid を指定した場合は組織メール用ディレクトリへの書き換えを行わない
	my $no_orgmail=($mid) ? 1 : 0;
	if (!$mid) { $mid = $session->{user}; }
	
	my $file  = DA::Mailer::get_mailer_dir($session,$mid,'conf',"$func\.dat",$no_orgmail);
	my $lines = [];

	DA::Custom::ajx_get_filter($session,\$file);

	if (DA::Unicode::file_exist($file)) {
		if (&lock($session, "conf.$func")) {
			if (my $fh = DA::Unicode::file_open($file, "r")) {
				while (my $l = <$fh>) {
					chomp($l);
					my %l;
					@l{@FILTER_ITEMS} = split(/\t/, $l);
					push(@{$lines}, \%l);
				}
				close($fh);
			} else {
				&_warn($session, "Can't open file [$file]");
				$lines = undef;
			}

			&unlock($session, "conf.$func");

			return(&convert_mailer($lines));
		} else {
			&_warn($session, "lock");
			return(undef);
		}
	} else {
		return($lines);
	}
}

sub save_filter($$;$) {
	my ($session, $lines, $mid) = @_;
	my $func = "filter";

	# 明示的に $mid を指定した場合は組織メール用ディレクトリへの書き換えを行わない
	my $no_orgmail=($mid) ? 1 : 0;
	if (!$mid) { $mid = $session->{user}; }

	my $file  = DA::Mailer::get_mailer_dir($session,$mid,'conf',"$func\.dat",$no_orgmail);
	DA::Custom::ajx_save_filter($session,\$file);

	if (&lock($session, "conf.$func")) {
		my $result;
		if (my $fh = DA::Unicode::file_open($file, "w")) {
			foreach my $l (@{&convert_internal($lines)}) {
				my @l;
				foreach my $i (@FILTER_ITEMS) {
					push(@l, $l->{$i});
				}
				print $fh join("\t", @l) . "\n";
			}
			$result = (close($fh)) ? 1 : undef;
			unless ($result) {
				&_warn($session, "Can't close file [$file]");
			}
		} else {
			&_warn($session, "Can't open file [$file]");
			$result = undef;
		}

		&unlock($session, "conf.$func");

		return($result);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub get_vfilter($) {
	my ($session) = @_;
	my $func   = "filter_view";
	my $file  = DA::Mailer::get_mailer_dir($session,$session->{user},'conf',"$func\.dat");
	my $exists = DA::Unicode::file_exist($file) ? 1 : 0;

	if (my $data = &get_data($session, $func)) {
		unless ($data->{common}->{default}) {
			$data->{common}->{default} = 1;
		}
		foreach my $n (1..9) {
			if (exists $data->{$n}) {
				foreach my $i (@VFILTER_ITEMS) {
					if ($i eq "title") {
						if ($data->{$n}->{$i} eq "") {
							$data->{$n}->{$i} = "";
						} else {
							if ($exists) {
								$data->{$n}->{$i} = $data->{$n}->{$i};
							} else {
								$data->{$n}->{$i} = &convert_internal($data->{$n}->{$i});
								$data->{$n}->{$i} = T_($data->{$n}->{$i});
								$data->{$n}->{$i} = &convert_mailer($data->{$n}->{$i});
							}
						}
					} else {
						if ($data->{$n}->{$i} eq "") {
							$data->{$n}->{$i} = 0;
						} else {
							$data->{$n}->{$i} = $data->{$n}->{$i};
						}
					}
				}
			}
		}
		return($data);
	} else {
		&_warn($session, "get_data");
		return(undef);
	}
}

sub portalfile($) {
	my ($session) = @_;
	my $file = (DA::SmartPhone::isSmartPhoneUsed()) ?
		DA::Mailer::get_mailer_dir($session,$session->{user},'','smartphone.list') :
		DA::Mailer::get_mailer_dir($session,$session->{user},'','portal.list');
	return($file);
}

sub get_portal($) {
	my ($session) = @_;
	my $file  = &portalfile($session);
	my $lines = [];

	if (-f $file) {
		if (&lock($session, "portal")) {
			if (my $fh = DA::System::iofile_new($file, "r")) {
				while (my $l = <$fh>) {
					chomp($l);
					my %l;
					@l{@PORTAL_ITEMS} = split(/\t/, $l);
					push(@{$lines}, \%l);
				}
				close($fh);

				#===========================================
				#     Custom
				#===========================================
				DA::Custom::rewrite_portal_items4ajx($session,$file,\$lines);
				#===========================================

			} else {
				&_warn($session, "Can't open file [$file]");
				$lines = undef;
			}

			&unlock($session, "portal");
			return(&convert_mailer($lines));
		} else {
			&_warn($session, "lock");
			return(undef);
		}
	} else {
		return($lines);
	}
}

sub save_portal($$) {
	my ($session, $lines) = @_;
	my $file = &portalfile($session);

	if (&lock($session, "portal")) {
		my $result;
		if (my $fh = DA::System::iofile_new($file, "w")) {
			foreach my $l (@{&convert_internal($lines)}) {
				my @l;
				foreach my $i (@PORTAL_ITEMS) {
					push(@l, $l->{$i});
				}
				print $fh join("\t", @l) . "\n";
			}
			$result = (close($fh)) ? 1 : undef;
			unless ($result) {
				&_warn($session, "Can't close file [$file]");
			}
		} else {
			&_warn($session, "Can't open file [$file]");
			$result = undef;
		}
		&unlock($session, "portal");

		return($result);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub get_data($$;$) {
	my ($session, $func, $opt) = @_;
	# $opt=0 : get default value if do not find user's master file
	# $opt=1 : get default value (only)
	# $opt=2 : get user's master value (only)
	my $default = "$DA::Vars::p->{data_dir}/master/default/$func\.dat";
	my $user    = DA::Mailer::get_mailer_dir($session,$session->{user},'conf',"$func\.dat");
	my $file;

	if ($opt eq 2) {
		$file = $user;
	} elsif ($opt eq 1) {
		$file = $default;
	} else {
		if (DA::Unicode::file_exist($user)) {
			$file = $user;
		} else {
			$file = $default;
		}
	}

	my $data = {};
	if (DA::Unicode::file_exist($file)) {
		if (&lock($session, "conf.$func")) {
			if (my $fh = DA::Unicode::file_open($file, "r")) {
				my $key;
				while (my $line = <$fh>) {
					chomp($line);
					$line = &convert_mailer($line);
					$line =~ s/^\s+//;
					$line =~ s/\s+$//;

					if ($line eq "") {
						next;
					} elsif ($line =~ /^#/) {
						next;
					} else {
						if ($line =~ /^\[(.*)\]/) {
							$key = $1;
							$data->{$key} = {};
						} else {
							if ($key ne "") {
								my ($k, $v) = split (/\=/, $line, 2);
								$data->{$key}->{$k} = $v;
							}
						}
					}
				}
				close($fh);
			} else {
				&_warn($session, "Can't open file [$file]");
				$data = undef;
			}

			&unlock($session, "conf.$func");
		} else {
			&_warn($session, "lock");
			$data = undef;
		}
	}

	return($data);
}

sub save_data($$$;$) {
	my ($session, $data, $func, $opt) = @_;
	# $opt=0 : data/mailer/[MID]/conf ディレクトリ内の設定ファイルへ書き込む
	# $opt=1 : data/master/default ディレクトリ内の設定ファイルへ書き込む
	my $default = "$DA::Vars::p->{data_dir}/master/default/$func\.dat";
	my $user    = DA::Mailer::get_mailer_dir($session,$session->{user},'conf',"$func\.dat");
	my $file;

	if ($opt eq 1) {
		$file = $default;
	} else {
		$file = $user;
	}

	if (&lock($session, "conf.$func")) {
		my $result;
		if (my $fh = DA::Unicode::file_open($file, "w")) {
			foreach my $key (sort keys %{$data}) {
				print $fh &convert_internal("[$key]\n");
				foreach my $item (sort keys %{$data->{$key}}) {
					print $fh &convert_internal("$item=$data->{$key}->{$item}\n");
				}
				print $fh &convert_internal("\n");
			}
			if (close($fh)) {
				if (my $res=DA::System::file_chown($DA::Vars::p->{www_user}, $DA::Vars::p->{www_group}, ( DA::Unicode::get_filename($file) ))) {
					$result = 1;
				} else {
					&_warn($session, "Can't chown [$file]");
					$result = undef;
				}
			} else {
				&_warn($session, "Can't close file [$file]");
				$result = undef;
			}
		} else {
			&_warn($session, "Can't open file [$file]");
			$result = undef;
		}

		&unlock($session, "conf.$func");

		return($result);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub get_smartphone($;$) {
	my ($session, $opt) = @_;

	if (&lock($session, "smartphone")) {
		my $param = DA::SmartPhone::get_config($session, $opt);

		&unlock($session, "smartphone");

		return(&convert_mailer($param));
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub save_smartphone($$;$) {
	my ($session, $param, $opt) = @_;

	if (&lock($session, "smartphone")) {
		DA::SmartPhone::save_config($session, &convert_mailer($param), $opt);

		&unlock($session, "smartphone");

		return(1);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub get_temp($$;$;$) {
	my ($session, $func, $cr, $opt) = @_;
	my $file = "$session->{sid}.AjaxMailer.temp.$func";

	if (&lock($session, "temp.$func")) {
		my $param = DA::IS::get_temp($session, $file, $cr, $opt);

		&unlock($session, "temp.$func");

		return($param);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub save_temp($$$;$) {
	my ($session, $param, $func, $cr) = @_;
	my $file = "$session->{sid}.AjaxMailer.temp.$func";

	if (&lock($session, "temp.$func")) {
		DA::IS::save_temp($session, $param, $file, $cr);

		&unlock($session, "temp.$func");

		return(1);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub storablefile($$) {
	my ($session, $func) = @_;
	my $file;
	if ($func eq "folders" || $func eq "uidvalidity") {
		$file = DA::Mailer::get_mailer_dir($session,$session->{user},'recv',"AjaxMailer.storable.$func");
	} else {
		$file = "$session->{temp_dir}/$session->{sid}.AjaxMailer.storable.$func";
	}

	# 組織メールの場合は一時保存ファイルを書き換える
	if (DA::OrgMail::check_org_mail_permit($session)) {
		DA::OrgMail::rewrite_storablefile($session,$func,\$file);
	}
	return($file);
}
sub storable_exist($$) {
	my ($session, $func) = @_;
	my $file = &storablefile($session, $func);
	if (DA::Unicode::file_exist($file)) {
		return(1);
	} else {
		return(0);
	}
}

sub storable_retrieve($$) {
	my ($session, $func) = @_;
	my $file = &storablefile($session, $func);	
	if (&lock($session, "storable.$func")) {
		my $param = DA::Unicode::storable_retrieve($file);		
		&unlock($session, "storable.$func");

		return($param);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub storable_store($$$) {
	my ($session, $param, $func) = @_;
	my $file = &storablefile($session, $func);
	if (&lock($session, "storable.$func")) {
		DA::Unicode::storable_store($param, $file);
		&unlock($session, "storable.$func");
		return(1);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub storable_clear($$) {
	my ($session, $func) = @_;
	my $file = &storablefile($session, $func);

	if (&lock($session, "storable.$func")) {
		DA::System::file_unlink($file);

		&unlock($session, "storable.$func");

		return(1);
	} else {
		&_warn($session, "lock");
		return(undef);
	}
}

sub get_sys_custom($$;$) {
	my ($session, $func, $mode) = @_;
	my $sub = ($mode) ? "system" : "custom";

	my $data = DA::IS::get_sys_custom($session, $func, $mode);

	foreach my $key (keys %{$data}) {
		$data->{$key} = DA::Unicode::convert_from($data->{$key}, "EUC-JP");
	}

	return(&convert_mailer($data));
}

sub get_sys_custom_lines($$;$) {
	my ($session, $func, $mode) = @_;
	my $lines = [];
	my ($sub, $file);

	if ($mode) {
		$sub  = "system";
		$file = "$DA::Vars::p->{system_dir}/$func\.dat";
	} else {
		$sub  = "custom";
		$file = "$DA::Vars::p->{custom_dir}/$func\.dat";
	}

	if (DA::System::file_open(\*IN, "< $file")) {
		while (my $l = <IN>) {
			chomp($l);
			if ($l eq "") {
				next;
			} elsif ($l =~ /^\#/) {
				next;
			}
			push(@{$lines}, DA::Unicode::convert_from($l, "EUC-JP"));
		}
		$lines = &convert_mailer($lines);
	} else {
		&_warn($session, "Can't open file [$file]");
		$lines = undef;
	}

	return($lines);
}

sub get_system($) {
	my ($session) = @_;
	my $func = "mail";

	if (my $system = get_sys_custom($session, $func, 1)) {
		foreach my $key (qw(max_send_size max_recv_size max_text_size
							max_import_size max_external_send_size)) {
			$system->{$key} = DA::CGIdef::convert_byte($system->{$key});
			if ($system->{$key} !~ /^\d+$/ && $system->{$key} !~ /^\d+\.\d+e[+-]\d+$/) {
				delete $system->{$key};
			}
		}

		if ($system->{timeout} !~ /^\d+$/) {
			$system->{timeout} = $MAIL_VALUE->{IMAP_TIMEOUT};
		}
		if ($system->{mail_commit_count} !~ /^\d+$/) {
			$system->{mail_commit_count} = $MAIL_VALUE->{COMMIT_COUNT};
		}
		if ($system->{mobile_mail_extension_size} !~ /^\d+$/) {
			$system->{mobile_mail_extension_size} = $MAIL_VALUE->{MOBILE_EXTENSION_SIZE};
		}
		$system->{mailgw_dotmap} =~s/(^\s+|\s+$)//g;
		if (length($system->{mailgw_dotmap}) > 1) {
			$system->{mailgw_dotmap} = $MAIL_VALUE->{MAILGW_DOTMAP};
		}

		if ($system->{time_zone} =~ /^(gmt)$/i) {
			$system->{time_zone} = '+0000';
		} elsif ($system->{time_zone} =~ /^(\+|\-)(\d{2})(\d{2})$/) {
			$system->{time_zone} = $system->{time_zone};
		} elsif (ref($session) && $session->{timezone}) {
			$system->{time_zone} = $session->{timezone};
		} else {
			$system->{time_zone} = $DA::Vars::p->{timezone} || $MAIL_VALUE->{TIME_ZONE};
		}

		return($system);
	} else {
		&_warn($session, "get_sys_custom");
		return(undef);
	}
}

sub get_custom($) {
	my ($session) = @_;
	my $func = "mail";

	if (my $custom = &get_sys_custom($session, $func)) {
		my $archive_type = (exists $custom->{archive_type}) ?
							lc($custom->{archive_type}) : "zip,tar,mbox,eml";
		my %archive_type; @archive_type{split(/,/, $archive_type)} = 1..1;
		$archive_type{eml} = 1;

		$custom->{archive_type} = {};
		foreach my $type (qw(lha zip tar mbox eml)) {
			if (exists $archive_type{$type}) {
				$custom->{archive_type}->{$type}    = 1;
			}
		}
		$custom->{dd_upload_max_file_num} = int($custom->{dd_upload_max_file_num});
		if ( $custom->{dd_upload_max_file_num} < 1 ) {
			$custom->{dd_upload_max_file_num} = 5;
		} elsif ( $custom->{dd_upload_max_file_num} > 100){
			$custom->{dd_upload_max_file_num} = 100;
		}

		return($custom);
	} else {
		&_warn($session, "get_sys_custom");
		return(undef);
	}
}

sub incfile($$) {
	my ($session, $func) = @_;
	my $file;

	if ($func eq "fid") {
		$file = DA::Mailer::get_mailer_dir($session,$session->{user},'recv',"AjaxMailer.num.$func");	
	} elsif ($func eq "maid") {
		$file = DA::Mailer::get_mailer_dir($session,$session->{user},'sent',"AjaxMailer.num.$func");
	} else {
		$file = "$session->{temp_dir}/$session->{sid}.AjaxMailer.num.$func";
	}

	# 組織メールの場合は一時保存ファイルを書き換える
	if (DA::OrgMail::check_org_mail_permit($session)) {
		DA::OrgMail::rewrite_incfile($session,$func,\$file);
	}
	#バックアップの場合は書き換える
	if ($func eq "backup_maid") {
		$file = "$DA::Vars::p->{mailer_dir}/$session->{user}/backup/AjaxMailer.num.$func";
	} 
	return($file);
}

sub inc_num($$) {
	my ($session, $func) = @_;
	my $file = &incfile($session, $func);
	my $num  = 0;
	if (&lock($session, "num.$func")) {
		if (-f $file) {
			if (DA::System::file_open(\*NUM, "< $file")) {
				$num = <NUM>; chomp($num);
				close(NUM);

				if (DA::System::file_open(\*NUM, "> $file")) {
					# Reserved 100000000 ポータル(srid)
					# Reserved 100000001 Catcher(fid)
					if ($num+1 > 99999999) {
						print NUM "1";
					} else {
						print NUM $num+1;
					}
					if (close(NUM)) {
						$num ++;
					} else {
						&_warn($session, "Can't close file [$file]");
						$num = 0;
					}
				} else {
					&_warn($session, "Can't open file [$file]");
					$num = 0;
				}
			} else {
				&_warn($session, "Can't open file [$file]");
			}
		} else {
			my $init_num = ( $func eq 'maid' ) ? 10000 : 1;
			if (DA::System::file_open(\*NUM, "> $file")) {
				print NUM "$init_num";
				if (close(NUM)) {
					$num = $init_num;
				} else {
					&_warn($session, "Can't close file [$file]");
				}
			} else {
				&_warn($session, "Can't open file [$file]");
			}
		}
		&unlock($session, "num.$func");
	} else {
		&_warn($session, "lock");
	}

	return($num);
}

sub set_num($$$) {
	my ($session, $func, $default) = @_;
	my $file = &incfile($session, $func);
	my $num  = 0;

	if (&lock($session, "num.$func")) {
		if (DA::System::file_open(\*NUM, "> $file")) {
			print NUM $default;
			if (close(NUM)) {
				$num = $default;
			} else {
				&_warn($session, "Can't close file [$file]");
			}
		} else {
			&_warn($session, "Can't open file [$file]");
		}
		&unlock($session, "num.$func");
	} else {
		&_warn($session, "lock");
	}

	return($num);
}

sub next_num($$) {
	my ($session, $func) = @_;
	my $file = &incfile($session, $func);
	my $num  = 0;

	if (-f $file) {
		if (&lock($session, "num.$func")) {
			if (DA::System::file_open(\*NUM, "< $file")) {
				$num = <NUM>; chomp($num); $num ++;
				close(NUM);
			} else {
				&_warn($session, "Can't open file [$file]");
			}
			&unlock($session, "num.$func");
		} else {
			&_warn($session, "lock");
		}
	} else {
		$num = 1;
	}

	return($num);
}

sub inc_msgid($) {
	my ($session) = @_;
	my $file = $MESSAGE_ID_FILE;
	my $num  = 0;
	
	if (DA::Session::lock($MESSAGE_ID_LOCK, 5, 10, 1)) {
		if (-f $file) {
			if (DA::System::file_open(\*NUM, "< $file")) {
				$num = <NUM>; chomp($num);
				close(NUM);

				if (DA::System::file_open(\*NUM, "> $file")) {
					if ($num+1 > 99999999) {
						print NUM "1";
					} else {
						print NUM $num+1;
					}
					if (close(NUM)) {
						$num ++;
					} else {
						&_warn($session, "Can't close file [$file]");
						$num = 0;
					}
				} else {
					&_warn($session, "Can't open file [$file]");
					$num = 0;
				}
			} else {
				&_warn($session, "Can't open file [$file]");
			}
		} else {
			if (DA::System::file_open(\*NUM, "> $file")) {
				print NUM "1";
				if (close(NUM)) {
					$num = 1;
				} else {
					&_warn($session, "Can't close file [$file]");
				}
			} else {
				&_warn($session, "Can't open file [$file]");
			}
		}
		DA::Session::unlock($MESSAGE_ID_LOCK);
	} else {
		&_warn($session, "lock");
	}

	return($num);
}

sub inc_info($$) {
	my ($session, $opt) = @_;
	my $file = &infobase($session, $opt) . "/num.dat";
	my $num  = 0;

	if (&lock($session, "num.info")) {
		if (-f $file) {
			if (DA::System::file_open(\*NUM, "< $file")) {
				$num = <NUM>; chomp($num);
				close(NUM);

				if (DA::System::file_open(\*NUM, "> $file")) {
					print NUM $num+1;
					if (close(NUM)) {
						$num ++;
					} else {
						&_warn($session, "Can't close file [$file]");
						$num = 0;
					}
				} else {
					&_warn($session, "Can't open file [$file]");
					$num = 0;
				}
			} else {
				&_warn($session, "Can't open file [$file]");
			}
		} else {
			if (DA::System::file_open(\*NUM, "> $file")) {
				print NUM "1";
				if (close(NUM)) {
					$num = 1;
				} else {
					&_warn($session, "Can't close file [$file]");
				}
			} else {
				&_warn($session, "Can't open file [$file]");
			}
		}
		&unlock($session, "num.info");
	} else {
		&_warn($session, "lock");
	}

	return($num);
}

# get local_mail dir
sub infobase($;$) {
	my ($session, $target) = @_;
	unless ($target) {
		$target = "sent";
	}
	return("$DA::Vars::p->{mailer_dir}/$session->{user}/$target");
}

# get local_mail info file name
sub infofile($;$) {
	my ($session, $target) = @_;
	return(DA::Unicode::get_filename(&infobase($session, $target) . "/info.dat"));
}

#get backup backup_maid mapping file
sub backup_mapping_file($$) {
	my ($session,$file_name) = @_;
	return(DA::Unicode::get_filename(&infobase($session, 'backup') . '/'.$file_name));
}

sub exist_in_infofile($$$) {
	my($session,$param,$num) = @_;

	if($param && $num && $param->{$num}) {
		return 1;
	}
}

sub get_infofile($$$) {
	my($session, $file_path, $lock_name) = @_;
	my $param = {};
	if (&lock($session, $lock_name)) {
		if(-e "$file_path"){
			DA::System::file_open(\*IN, "$file_path");
			while(my $line = <IN>){
		        chomp($line);
				if ($line eq '') { next; }
				$line =~ s/^\s+//; $line =~ s/\s+$//;
				if ($line=~/^\#/) { next; }
		        my($key,$val)=split(/[\t=]/,$line,2);
				if ($val eq '') { next; }
				$key =~ s/^\s+//; $key =~ s/\s+$//;
				$val =~ s/^\s+//; $val =~ s/\s+$//;
		        $param->{$key}=$val;
		    }
			close(IN);
		}
		&unlock($session, $lock_name);
	}else {
		&_warn($session,'lock');
	}
	return $param;
}

sub connect($;$;$;$) {
	my ($session, $c, $imaps, $mode) = @_;
	# $c->{pop} :   POP接続有
	#           :1  接続する
	#           :0  接続しない
	# $c->{keep}:   POP keep
	#           :0  同期しない（受信メールを残す）
	#           :1  同期する（受信メールを削除する）
	#           :2　強制同期（IMAP上で削除されたメールをPOPでも削除する）
	# $c->{sync}:   POP sync
	#           :0  統計情報をIMAPのレスポンスで見る
	#           :1  POPメール、受信キャッシュを同期する
	#           :2  POPメールだけ同期する
	#           :3  受信キャッシュだけ同期をとる
	# $c->{nosession}:   IMAP接続
	#                :1  IMAPに接続しない
	#                :0  IMAPに接続する
	# $c->{noupdate} :   imap.dat
	#                :1  更新しない
	#                :0  更新する
	# $c->{nocheck}
	# $c->{nosessionerror}
    # $c->{org_mail}  接続する組織メール GID
	my $logger = &_logger_init($session);

	unless ($imaps) {
		$imaps = {};
		if ($mode) {
			if (my $imap = &get_master($session, "imap")) {
				$imaps->{imap} = $imap;
			} else {
				return(&error("NOT_READ_IMAP_CONFIG", 9));
			}
			if (my $mail = &get_master($session, "ajxmailer")) {
				$imaps->{mail} = $mail;
			} else {
				return(&error("NOT_READ_MAIL_CONFIG", 9));
			}
		} elsif (DA::SmartPhone::isSmartPhoneUsed()) {
			if (my $imap = &get_master($session, "imap")) {
				$imaps->{imap} = $imap;
			} else {
				return(&error("NOT_READ_IMAP_CONFIG", 9));
			}
			if (my $mail = &get_master($session, (DA::Ajax::mailer_ok($session)) ? "ajxmailer" : "mail")) {
				$imaps->{mail} = $mail;
			} else {
				return(&error("NOT_READ_MAIL_CONFIG", 9));
			}
		} else {
			if (my $imap = &get_master_enabled($session, "imap")) {
				$imaps->{imap} = $imap;
			} else {
				return(&error("NOT_READ_IMAP_CONFIG", 9));
			}
			if (my $mail = &get_master_enabled($session, "ajxmailer")) {
				$imaps->{mail} = $mail;
			} else {
				return(&error("NOT_READ_MAIL_CONFIG", 9));
			}
		}
		if (DA::SmartPhone::isSmartPhoneUsed()) {
			if (my $smartphone = &get_smartphone($session)) {
				$imaps->{smartphone} = $smartphone;
				# 設定の紐つけ
				foreach my $key (qw(quote_r quote_f quote_f_attach encode sign_init_s)) {
					$imaps->{mail}->{$key} = $imaps->{smartphone}->{mail}->{$key};
				}
				$imaps->{mail}->{sign_init_p} = "off";
				$imaps->{mail}->{sign_act} = "off";
				$imaps->{mail}->{toself} = "to";
			} else {
				return(&error("NOT_READ_SMARTPHONE_CONFIG", 9));
			}
		} else {
			if (my $base = &get_master($session, "base")) {
				$imaps->{base} = $base;
			} else {
				return(&error("NOT_READ_BASE_CONFIG", 9));
			}
			if (my $address = &get_master($session, "address")) {
				$imaps->{address} = $address;
			} else {
				return(&error("NOT_READ_ADDRESS_CONFIG", 9));
			}
		}
		if (my $portal = &get_master($session, "portal")) {
			$imaps->{portal} = $portal;
			if (DA::SmartPhone::isSmartPhoneUsed()) {
				$imaps->{portal}->{ml_read}    = "on";
				$imaps->{portal}->{ml_deleted} = "off";
				$imaps->{portal}->{ml_target}  = "all";
			}
		} else {
			return(&error("NOT_READ_PORTAL_CONFIG", 9));
		}
		if (my $status = &get_status($session)) {
			$imaps->{status} = $status;
		} else {
			return(&error("NOT_READ_STATUS_CONFIG", 9));
		}
		if (my $system = &get_system($session)) {
			$imaps->{system} = $system;
		} else {
			return(&error("NOT_READ_SYSTEM_CONFIG", 9));
		}
		if (my $custom = &get_custom($session)) {
			$imaps->{custom} = $custom;
		} else {
			return(&error("NOT_READ_CUSTOM_CONFIG", 9));
		}

		# 表示フォルダを強制設定
		$imaps->{imap}->{view} = "on";
		if ($imaps->{imap}->{inbox_view} eq "") {
			$imaps->{imap}->{inbox_view} = "INBOX";
		}
		if ($imaps->{imap}->{sent_view} eq "") {
			$imaps->{imap}->{sent_view} = $imaps->{imap}->{sent};
		}
		if ($imaps->{imap}->{draft_view} eq "") {
			$imaps->{imap}->{draft_view} = $imaps->{imap}->{draft};
		}
		if ($imaps->{imap}->{trash_view} eq "") {
			$imaps->{imap}->{trash_view} = $imaps->{imap}->{trash};
		}
		if ($imaps->{imap}->{spam_view} eq "") {
			$imaps->{imap}->{spam_view} = $imaps->{imap}->{spam};
		}
	}
	# 組織メール: $c 内の変数を書き換えるため $c がハッシュ変数であることを保証する
	if (ref($c) ne 'HASH') { $c={}; }
	if (DA::OrgMail::check_org_mail_permit($session)) {
		DA::OrgMail::rewrite_imap_connection_imaps($session, $c, $imaps, $mode);
	}
	DA::Custom::rewrite_imap_connection_imaps($session, $c, $imaps, $mode);

	unless ($c->{nosession}) {
		unless ($c->{nocheck}) {
			foreach my $key (qw(host user pass port name sent draft trash)) {
				if ($imaps->{imap}->{$key} eq "") {
					return(&error("NO_SET_IMAP_CONFIG", 9));
				}
			}
		}

		my $host = $imaps->{imap}->{host};
		my $user = $imaps->{imap}->{user};
		my $pass = $imaps->{imap}->{pass};
		my $port = $imaps->{imap}->{port} || (($imaps->{imap}->{secure} eq "ssl") ? $MAIL_VALUE->{IMAPS_PORT} : $MAIL_VALUE->{IMAP_PORT});
		my $secure = $imaps->{imap}->{secure} || "off";
		my $pop  = $imaps->{imap}->{pop};

		my $timeout = ($imaps->{system}->{timeout} ne '') ?
						$imaps->{system}->{timeout} : $MAIL_VALUE->{IMAP_TIMEOUT};
		my $mailgw  = 0;

		if ($pop eq "yes") {
			my $pop_host = $imaps->{imap}->{pop_host};
			my $pop_port = $imaps->{imap}->{pop_port} || $MAIL_VALUE->{POP_PORT};
			my $pop_keep = $c->{keep} || $imaps->{imap}->{pop_keep};
			my $pop_apop = $imaps->{imap}->{pop_apop};
			my $dotmap   = $imaps->{system}->{mailgw_dotmap};
			my $spam_mbox;
			if ($MAIL_VALUE->{SPAM}) {
				$spam_mbox = &_utf7_encode($session, $imaps, $imaps->{imap}->{spam});
			}
			if ($DA::IsLicense::op->{mailgw} && $c->{pop}) {
				$user =~s/(\@)/sprintf("%%%02X", ord($1))/eg;
				$dotmap =~s/(\W)/sprintf("%%%02X", ord($1))/eg;
				$spam_mbox =~s/(\W)/sprintf("%%%02X", ord($1))/eg;

				$user = 'pop://' . $user . '@' . $pop_host . ':' . $pop_port . '/'
				      . '?keep=' . $pop_keep;
				if ($pop_apop) {
					$user .= '&apop=' . $pop_apop;
				}
				if ($dotmap ne '') {
					$user .= '&dot=' . $dotmap;
				}
				if ($spam_mbox ne '') {
					$user .= '&spam_mbox=' . $spam_mbox;
				}
				if ($c->{sync} ne '') {
					$user .= '&sync_pop=' . $c->{sync};
				}
			} else {
				if ($dotmap ne "") {
					$user =~s/\./\Q$dotmap\E/g;
				}
			}
			$mailgw = 1;
		}

		my $params = {
			Server   => $host,
			User     => $user,
			Password => $pass,
			Port     => $port,
			Secure   => $secure,
			Timeout  => $timeout
		};
		DA::Custom::rewrite_imap_connection_params($session, $c, $imaps, $mode, $params);

		my ($socket, $imap);
		if ($params->{Secure} eq "ssl") {
			$socket = IO::Socket::SSL->new(
				PeerAddr => $params->{Server},
				PeerPort => $params->{Port}
			);

			$imap = DA::IMAP->new(
				Socket   => $socket,
				User     => $params->{User},
				Password => $params->{Password},
				Uid      => 0,
				Timeout  => $params->{Timeout}
			);
		} else {
			$imap = DA::IMAP->new(
			Server   => $params->{Server},
			User     => $params->{User},
			Password => $params->{Password},
			Port     => $params->{Port},
			Uid      => 0,
			Timeout  => $params->{Timeout}
		);
		}

		if (!defined $imap || !ref($imap) || !$imap->{Socket} || $imap->{LastError}) {
			&_logger($session, $imaps, $logger);

			if ($c->{nosessionerror}) {
				return($imaps);
			} else {
				return(&error("NOT_LOGIN_IMAP_SERVER", 9));
			}
		} else {
			$imaps->{param}->{uid_flags} = [];
			$imaps->{uidval}  = {};
			$imaps->{session} = $session->{imap} = $imap;

			my $updated = 0;

			# UPDATE IMAP TYPE
			if (!$imaps->{imap}->{nodetect}) {
				my $imap_type = &imap_type($session, $imaps);
				if ($imaps->{imap}->{imap_type} ne $imap_type) {
					$imaps->{imap}->{imap_type} = $imap_type; $updated = 1;
				}
			}

			# UPDATE QUOTA
			my $q = &quotaroot($session, $imaps);
			my $quota = (defined $q->{sto_quota} || defined $q->{mes_quota}) ? 1 : 0;
			if ($imaps->{imap}->{quota} ne $quota) {
				$imaps->{imap}->{quota} = $quota; $updated = 1;
			}

			# UPDATE CHARSET
			my $charset = ($mailgw) ? 1 : &charset($session, $imaps);
			if ($imaps->{imap}->{charset} ne $charset) {
				$imaps->{imap}->{charset} = $charset; $updated = 1;
			}

			# UPDATE SEPARATOR
			my $separator = &separator($session, $imaps);
			if ($imaps->{imap}->{separator} ne $separator) {
				$imaps->{imap}->{separator} = $separator; $updated = 1;
			}

			# コンフィグレーションファイルのアップデート
			if (!$c->{noupdate} && $updated) {
				unless (&save_master($session, $imaps->{imap}, "imap")) {
					&disconnect($session, $imaps);

					&_logger($session, $imaps, $logger);

					return(&error("NOT_WRITE_IMAP_CONFIG", 1));
				}
			}

			# UIDVALIDITY履歴 の読み込み
			if (&storable_exist($session, "uidvalidity")) {
				if (my $uidval = &storable_retrieve($session, "uidvalidity")) {
					$imaps->{uidval} = $uidval;
				} else {
					&disconnect($session, $imaps);

					&_logger($session, $imaps, $logger);

					return(&error("NOT_READ_UIDVALIDITY", 1));
				}
			}
		}
	}

	&_logger($session, $imaps, $logger);

	return($imaps);
}

sub disconnect($$) {
	my ($session, $imaps) = @_;
	my $logger = &_logger_init($session);

	if (ref($imaps->{session}) eq 'DA::IMAP') {
		if ($imaps->{session}->{Socket}) {
			$imaps->{session}->disconnect();
		}
		if ($imaps->{param}->{uidval_rewrite}) {
			&storable_store($session, $imaps->{uidval}, "uidvalidity");
		}
	}
	&_logger($session, $imaps, $logger);
	&_cleanup($session, $imaps);

	return(1);
}

sub smtp_auth_account($$) {
	my ($session, $imaps) = @_;
	my ($user, $pass);

	if ($imaps->{imap}->{smtp_account} eq "account") {
		$user = $imaps->{imap}->{smtp_user};
		$pass = $imaps->{imap}->{smtp_pass};
	} elsif ($imaps->{imap}->{smtp_account} eq "imap") {
		$user = $imaps->{imap}->{user};
		$pass = $imaps->{imap}->{pass};
	}
	if ($user ne "" && $pass ne "") {
		return({
			user => $user,
			pass => $pass
		});
	} else {
		return(undef);
	}
}

sub imap_type($$) {
	my ($session, $imaps) = @_;
	my $logger  = &_logger_init($session);
	my $history = $imaps->{session}->{History};
	my $type;

	foreach my $h (@{$history->{'0'}->[0]}) {
		if (($h !~ /^\*/) || ($h eq '')) {
			next;
		} else {
			foreach my $key (sort keys %{$DA::Vars::p->{imap_info}}) {
				if ($key eq "uw" || $key eq "uw2") {
					next;
				}
				if ($DA::Vars::p->{imap_info}->{$key}->{tag} ne "") {
					if ($h =~ /$DA::Vars::p->{imap_info}->{$key}->{tag}/i) {
						$type = $key;
						last;
					}
				}
			}
			unless ($type) {
				foreach my $key (qw(uw uw2)) {
					if ($DA::Vars::p->{imap_info}->{$key}->{tag} ne "") {
						if ($h =~ /$DA::Vars::p->{imap_info}->{$key}->{tag}/i) {
							$type = $key;
							last;
						}
					}
				}
			}
		}
		if ($type) {
			last;
		}
	}
	if (!$type) {
		$type = 'default';
	}

	&_logger($session, $imaps, $logger);

	return($type);
}

sub quotaroot($$) {
	my ($session, $imaps) = @_;
	my $logger = &_logger_init($session);
	my $imap   = $imaps->{session};
	my $conf   = $imaps->{imap};
	my $custom = $imaps->{custom};
	my $quota = {};
	my $error = 0;

	my $percent;
	if ($custom->{quota_limit} eq '') {
		if ($conf->{limit} eq '') {
			$percent = $MAIL_VALUE->{QUOTA_LIMIT};
		} else {
			$percent = $conf->{limit};
		}
	} else {
		$percent = $custom->{quota_limit};
	}

	if (&check_imap_info($session, $imaps, "quota")) {
		my $flag;
		if (my $result = &_tag_and_run($session, $imaps, "GETQUOTAROOT INBOX")) {
			foreach my $l (@{$result}) {
				chomp;
				$flag = 1 if ($l =~ /^\*\s+quota\s+/i);
				if ($flag) {
					if ($l =~ /storage\s+(\d+)\s+(\d+)/i) {
						($quota->{sto_use}, $quota->{sto_quota}) = ($1, $2);
					}
					if ($l =~ /message\s+(\d+)\s+(\d+)/i) {
						($quota->{mes_use}, $quota->{mes_quota}) = ($1, $2);
					}
				}
			}
		}
	}

	if (defined $quota->{sto_quota}) {
		my $sto_limit = $quota->{sto_quota} * ($percent / 100);
		$quota->{sto_limit} = ($quota->{sto_use} > $sto_limit) ? 1 : 0;
		$quota->{sto_over}  = ($quota->{sto_use} > $quota->{sto_quota}) ? 1 : 0;
	}
	if (defined $quota->{mes_quota}) {
		my $mes_limit = $quota->{mes_quota} * ($percent / 100);
		$quota->{mes_limit} = ($quota->{mes_use} > $mes_limit) ? 1 : 0;
		$quota->{mes_over}  = ($quota->{mes_use} > $quota->{mes_quota}) ? 1 : 0;
	}

	#===========================================
	#     Custom
	#===========================================
	DA::Custom::get_quotaroot($session, $imap, $conf, $custom, $quota);
	#===========================================

	&_logger($session, $imaps, $logger);

	return($quota);
}

sub charset($$;$) {
	my ($session, $imaps, $charset) = @_;
	my $logger = &_logger_init($session);
	my $imap   = $imaps->{session};
	my $support = 0;

	unless ($charset) {
		$charset = &search_charset();
	}

	if (&_examine($session, $imaps, "INBOX")) {
		if (&_search($session, $imaps, "CHARSET $charset 1")) {
			foreach my $key (sort {$b <=> $a} (keys %{$imap->{History}})) {
				my $last_msg = $imap->{History}->{$key}->[-1]->[-1];
				$support = 1 if ($last_msg =~ /^\d+\s+ok\s+/i);
				last;
			}
		}
	}

	&_logger($session, $imaps, $logger);

	return($support);
}

sub separator($$) {
	my ($session, $imaps) = @_;
	my $logger    = &_logger_init($session);
	my $imap_type = $imaps->{imap}->{imap_type};
	my $separator;

	if ($DA::Vars::p->{imap_info}->{$imap_type}->{separator} eq "") {
		if (my $s = &_separator($session, $imaps)) {
			$separator = $s;
		}
	} else {
		$separator = $DA::Vars::p->{imap_info}->{$imap_type}->{separator};
	}

	&_logger($session, $imaps, $logger);

	return($separator);
}

sub count($$;$;$;$) {
	my ($session, $imaps, $folder, $uidval, $gid) = @_;
	my $c = {
		"folder"	=> $folder,
		"uidval"	=> $uidval,
		"output"	=> [qw(folder_name recent_count exists_count unseen_count)],
		"mode"		=> (defined $folder && defined $uidval) ? "folder" : "user",
		"gid"      => $gid
	};
	my $count = {};
	if (my $lines = &_select_folder($session, $imaps, $c)) {
		if (defined $folder && defined $uidval) {
			$count = {
				"recent_count"	=> $lines->[0]->{recent_count},
				"exists_count"	=> $lines->[0]->{exists_count},
				"unseen_count"	=> $lines->[0]->{unseen_count}
			};
		} else {
			foreach my $l (@{$lines}) {
				$count->{&_encode($session, $imaps, $l->{folder_name})} = {
					"folder_name"	=> $l->{folder_name},
					"recent_count"	=> $l->{recent_count},
					"exists_count"	=> $l->{exists_count},
					"unseen_count"	=> $l->{unseen_count}
				};
			}
		}
	} else {
		&_warn($session, "_select_folder");
		$count = undef;
	}

	return($count);
}

sub counts($$$$;$) {
	my ($session, $imaps, $folders, $fids, $gid) = @_;
	my $counts = [];
	foreach my $fid (@{$fids}) {
		my $type   = &_fid2type($session, $imaps, $folders, $fid);
		my $dummy  = &_fid2dummy($session, $imaps, $folders, $fid);
		my $folder = &_fid2folder($session, $imaps, $folders, $fid);
		my $uidval = &_fid2uidval($session, $imaps, $folders, $fid);
		if (my $cnt = &count($session, $imaps, $folder, $uidval, $gid)) {
			my $view = &view_count($session, $imaps, $cnt, $type, $dummy, 1);
			$view->{fid} = $fid;
			push(@{$counts}, $view);
		} else {
			&_warn($session, "count");
			$counts = undef; last;
		}
	}

	return($counts);
}

sub all_counts($$$$) {
	my ($session, $imaps, $folders, $c, $opt) = @_;	
	my $total_fid = $c->{fid};
	my $area   = $c->{area};
	my $uid    = $c->{uid};
	my $total  = {};
	my $counts = [];
	my $result = {};

	if ($area || $uid =~ /^(all|deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
		my $sc = {
			"output"=> [qw(folder_name recent_count exists_count unseen_count)],
			"mode"  => "user"
		};
		if (my $lines = &_select_folder($session, $imaps, $sc)) {
			foreach my $l (@{$lines}) {
				my $path  = &_encode($session, $imaps, $l->{folder_name});
				my $fid   = &_path2fid($session, $imaps, $folders, $path);
				my $type  = &_fid2type($session, $imaps, $folders, $fid);
				my $dummy = &_fid2dummy($session, $imaps, $folders, $fid);
				if ($fid && $folders->{$fid}->{select}) {
					if ($fid eq $total_fid) {
						$total = &view_count($session, $imaps, $l, $type, $dummy, 1);
					}
					if (!$opt) {
						my $view = &view_count($session, $imaps, $l, $type, $dummy, 1);
						$view->{fid} = $fid;
						push(@{$counts}, $view);
					}
				}
			}

			my $inffile = DA::Unicode::get_filename(DA::Mailer::get_mailer_dir($session,$session->{user},'sent',"info.dat")); 
            if (-f $inffile) { 
	            my $fid   = &_local_fid($session, $imaps, $folders); 
	            my $type  = &_fid2type($session, $imaps, $folders, $fid); 
	            my $dummy = &_fid2dummy($session, $imaps, $folders, $fid); 
	            if ($fid) { 
	                    my $cnt = { 
	                            "recent_count" => 0, 
	                            "exists_count" => DA::System::bq_cmd("/usr/bin/wc -l %1",$inffile), 
	                            "unseen_count" => 0 
	                    }; 
	                    if ($fid eq $total_fid) { 
	                            $total = &view_count($session, $imaps, $cnt, $type, $dummy, 1); 
	                    } 
	                    if (!$opt) { 
	                            my $view = &view_count($session, $imaps, $cnt, $type, $dummy, 1); 
	                            $view->{fid} = $fid; 
	                            push(@{$counts}, $view); 
	                    } 
				}
			}

			$result = {
				"total"  => $total,
				"counts" => $counts
			};
		} else {
			&_warn($session, "_select_folder");
			$result = &error("NOT_SELECT_FOLDER_TABLE", 9);
		}
	}

	return($result);
}

sub re_count($$$$$;$) {
	my ($session, $imaps, $folder, $uidval, $opt, $gid) = @_;
	my $sc_seen = {
		"folder"	=> $folder,
		"uidval"	=> $uidval,
		"output"	=> "count(uid_number)",
		"where"		=> [{ "column" => "seen", "value" => "1" }],
		"list"		=> 1
	};
	my $sc_unseen = {
		"folder"	=> $folder,
		"uidval"	=> $uidval,
		"output"	=> "count(uid_number)",
		"where"		=> [{ "column" => "seen", "value" => "0" }],
		"list"		=> 1
	};
	my $sc_max = {
		"folder"	=> $folder,
		"uidval"	=> $uidval,
		"output"	=> "max(uid_number)",
		"list"		=> 1
	};
	my $sc_filter = {
		"folder"    => $folder,
		"uidval"    => $uidval,
		"output"    => "filter_uid_number",
		"list"      => 1,
		"gid"      => $gid
	};

	if (my $seen = &_select_header($session, $imaps, $sc_seen)) {
		if (my $unseen = &_select_header($session, $imaps, $sc_unseen)) {
			if (my $max = &_select_header($session, $imaps, $sc_max)) {
				if (my $filter = &_select_folder($session, $imaps, $sc_filter)) {
					my $data = {
						"recent_count"      => ($opt) ? $seen->[0] + $unseen->[0] : 0,
						"exists_count"      => $seen->[0] + $unseen->[0],
						"unseen_count"      => $unseen->[0],
						"max_uid_number"    => $max->[0],
						"old_uid_number"    => ($opt) ? 0 : $max->[0],
						"filter_uid_number" => $filter->[0] || 0
					};
					my $dc = {
						"folder" => $folder,
						"uidval" => $uidval,
						"gid"   => $gid
					};
					my $ic = {
						"folder" => $folder,
						"uidval" => $uidval,
						"data"   => $data,
						"gid"   => $gid
					};
					if (&_delete_folder($session, $imaps, $dc)) {
						if (&_insert_folder($session, $imaps, $ic)) {
							return($data);
						} else {
							&_warn($session, "_insert_folder");
							return(undef);
						}
					} else {
						&_warn($session, "_delete_folder");
						return(undef);
					}
				} else {
					&_warn($session, "_select_header");
					return(undef);
				}
			} else {
				&_warn($session, "_select_header");
				return(undef);
			}
		} else {
			&_warn($session, "_select_header");
			return(undef);
		}
	} else {
		&_warn($session, "_select_header");
		return(undef);
	}
}

sub inc_count($$$$$;$) {
	my ($session, $imaps, $folder, $uidval, $count, $gid) = @_;
	my @si = qw (
		recent_count exists_count unseen_count
		max_uid_number old_uid_number
	);
	my $sc = {
		"folder"	=> $folder,
		"uidval"	=> $uidval,
		"output"	=> \@si,
		"gid"      => $gid
	};
	if (my $lines = &_select_folder($session, $imaps, $sc)) {
		if (scalar(@{$lines})) {
			my $data = {
				"recent_count"	=> $lines->[0]->{recent_count} + $count->{recent_count},
				"exists_count"	=> $lines->[0]->{exists_count} + $count->{exists_count},
				"unseen_count"	=> $lines->[0]->{unseen_count} + $count->{unseen_count}
			};
			my $max_uid_number = ($lines->[0]->{max_uid_number} > $count->{max_uid_number}) ?
									$lines->[0]->{max_uid_number} : $count->{max_uid_number};
			my $old_uid_number = $lines->[0]->{old_uid_number};
			
			#負数を0に
			foreach my $key (keys %{$data}) {
				if ($data->{$key} < 0){
					$data->{$key} = 0;
				}
			}

			my $uc = {
				"folder"	=> $folder,
				"uidval"	=> $uidval,
				"set"		=> [
					{ "column" => "recent_count", "value" => $data->{recent_count} },
					{ "column" => "exists_count", "value" => $data->{exists_count} },
					{ "column" => "unseen_count", "value" => $data->{unseen_count} },
					{ "column" => "max_uid_number", "value" => $max_uid_number },
					{ "column" => "old_uid_number", "value" => $old_uid_number }
				],
				"gid"      => $gid
			};
			if (&_update_folder($session, $imaps, $uc)) {
				return($data);
			} else {
				&_warn($session, "_update_folder");
				return(undef);
			}
		} else {
			if (my $data = &re_count($session, $imaps, $folder, $uidval, 1, $gid)) {
				return($data);
			} else {
				&_warn($session, "re_count");
				return(undef);
			}
		}
	} else {
		&_warn($session, "_select_folder");
		return(undef);
	}
}

sub view_count($$$$$;$) {
	my ($session, $imaps, $count, $type, $dummy, $force) = @_;
	my $view_count = {};

	if ($force) {
		$view_count->{messages} = $count->{exists_count} || 0;
		$view_count->{unseen}   = $count->{unseen_count} || 0;
		$view_count->{recent}   = $count->{recent_count} || 0;
	} else {
		if ($type eq $TYPE_DRAFT || $type eq $TYPE_SENT) {
			if ($imaps->{mail}->{count} eq "all") {
				$view_count->{messages} = $count->{exists_count} || 0;
				$view_count->{unseen}   = "";
			} elsif ($imaps->{mail}->{count} eq "half") {
				$view_count->{messages} = $count->{exists_count} || 0;
				$view_count->{unseen}   = "";
			} else {
				$view_count->{messages} = "";
				$view_count->{unseen}   = "";
			}

			$view_count->{recent} = "";
		} elsif ($type =~ /^($TYPE_INBOX|$TYPE_TRASH|$TYPE_SPAM|$TYPE_DEFAULT|$TYPE_MAILBOX)$/) {
			unless ($dummy) {
				if ($imaps->{mail}->{count} eq "all") {
					$view_count->{messages} = $count->{exists_count} || 0;
					$view_count->{unseen}   = $count->{unseen_count} || 0;
				} elsif ($imaps->{mail}->{count} eq "half") {
					$view_count->{messages} = $count->{exists_count} || 0;
					$view_count->{unseen}   = "";
				} else {
					$view_count->{messages} = "";
					$view_count->{unseen}   = "";
				}

				if ($imaps->{mail}->{recent} eq "on") {
					$view_count->{recent} = $count->{recent_count} || 0;
				} else {
					$view_count->{recent} = "";
				}
			}
		}
	}

	return($view_count);
}

sub clear_recent_count($$$$;$) {
	my ($session, $imaps, $folder, $uidval, $gid) = @_;
	my $uc = {
		"folder" => $folder,
		"uidval" => $uidval,
		"set"    => [
			{ "column" => "recent_count", "value" => 0 },
		],
		"gid"   => $gid
	};
	if (&_update_folder($session, $imaps, $uc)) {
		return(1);
	} else {
		&_warn($session, "_update_folder");
		return(undef);
	}
}

sub get_filter_uid_number($$$$) {
	my ($session, $imaps, $folder, $uidval) = @_;
	my @output = qw ( filter_uid_number );
	my $sc = {
		"folder" => $folder,
		"uidval" => $uidval,
		"output" => \@output,
	};

	if (my $lines = &_select_folder($session, $imaps, $sc)) {
		return($lines->[0]->{filter_uid_number} || 0);
	} else {
		&_warn($session, "_select_folder");
		return(undef);
	}
}

sub set_filter_uid_number($$$$$) {
	my ($session, $imaps, $folder, $uidval, $uid) = @_;
	my $uc = {
		"folder" => $folder,
		"uidval" => $uidval,
		"set"    => [
			{ "column" => "filter_uid_number", "value" => $uid }
		]
	};

	if (&_update_folder($session, $imaps, $uc)) {
		return(1);
	} else {
		&_warn($session, "_update_folder");
		return(undef);
	}
}

sub clear_filter_uid_number($$) {
	my ($session, $imaps) = @_;
	my $uc = {
		"mode" => "user",
		"set"  => [
			{ "column" => "filter_uid_number", "value" => "0" }
		]
	};

	if (&_update_folder($session, $imaps, $uc)) {
		return(1);
	} else {
		&_warn($session, "_update_folder");
		return(undef);
	}
}

sub set_portal_reload($$) {
	my ($session, $imaps) = @_;

	if ($imaps->{status}->{portal_reload} && $imaps->{status}->{smartphone_reload}) {
		return(1);
	} else {
		$imaps->{status}->{portal_reload} = 1;
		$imaps->{status}->{smartphone_reload} = 1;

		if (&save_status($session, $imaps->{status})) {
			return(1);
		} else {
			&_warn($session, "save_status");
			return(0);
		}
	}
}

sub unset_portal_reload($$) {
	my ($session, $imaps) = @_;
	my $base = (DA::SmartPhone::isSmartPhoneUsed()) ? "smartphone" : "portal";
	my $save = 0;

	if ($imaps->{status}->{$base} ne $DA::IsVersion::Version) {
		$imaps->{status}->{$base} = $DA::IsVersion::Version;
		$save = 1;
	}
	if ($imaps->{status}->{$base . "_charset"} ne DA::Unicode::internal_charset()) {
		$imaps->{status}->{$base . "_charset"} = DA::Unicode::internal_charset();
		$save = 1;
	}
	if ($imaps->{status}->{$base . "_mailer"} ne "ajax") {
		$imaps->{status}->{$base . "_mailer"} = "ajax";
		$save = 1;
	}
	if ($imaps->{status}->{$base . "_reload"}) {
		$imaps->{status}->{$base . "_reload"} = 0;
		$save = 1;
	}

	if ($save) {
		if (&save_status($session, $imaps->{status})) {
			return(1);
		} else {
			&_warn($session, "save_status");
			return(0);
		}
	} else {
		return(1);
	}
}

sub folders($$;$;$) {
	my ($session, $imaps, $force, $recount) = @_;
	my $logger    = &_logger_init($session);
	my $conf      = $imaps->{conf};
	my $separator = $conf->{separator}; 
	my $result    = {};
	my $error;

	if (&lock($session, "trans.folders")) {
		if ($force || !&storable_exist($session, "folders")) {
			if (DA::OrgMail::check_org_mail_permit($session)) {
				DA::OrgMail::copy_folders_update_info($session);
			}			
			if (my $list = &_list($session, $imaps)) {
				my (@infos, @folders);

				# ルート
				{
					my $info = &_root($session, $imaps);
					push(@infos, $info);
				}

				# IMAP Server
				{
					my $info = &_server($session, $imaps);
					push(@infos, $info);
				}

				# Portal
				{
					my $info = &_portal($session, $imaps);
					push(@infos, $info);
				}

				# 結合用
				{
					my $info = &_join($session, $imaps);
					push(@infos, $info);
				}

				for (my $i = 0; $i < @{$list} + 0; $i ++) {
					$list->[$i] =~ s/(\r\n|\n)$//;

					my ($flags, $delim, $folder)  = ($1, $2, $3)
						if ($list->[$i] =~ /^\*\s+list\s+\(([^\)]*)\)\s+("[^"]*"|nil)\s+(.*)$/i);
					if (&check_imap_info($session, $imaps, "folder_quote")) {
						$folder =~ s/^"(.*)"$/$1/;
						if (&check_imap_info($session, $imaps, "folder_escape")) {
							$folder =~ s/\\"/"/g;
						}
						if ($folder =~ /\.lock$/ && &_exists($session, $imaps, $folder)) {
							next;
						}
					} else {
						if ($folder eq '') {
							for (my $j = $i + 1; $j < @{$list} + 0; $j ++) {
								if ($list->[$j] =~ /^\*\s+list\s+/i) {
									last;
								}
								$list->[$j] =~ s/(\r\n|\n)$//;
								$folder .= $list->[$j];
								$i = $j;
							}
						} else {
							$folder =~ s/^"([^"]*)"$/$1/;
						}
						if ($folder =~ /\r\n|\n/) {
							next;
						}
						if ($folder =~ /^public folders(\/|$)/i
						&&  &check_imap_info($session, $imaps, "public")) {
							next;
						}
						if ($folder =~ /\\$/
						&&  &check_imap_info($session, $imaps, "last_yen")) {
							next;
						}
					}
					$folder =~ s/^[iI][nN][bB][oO][xX](\Q$delim\E|$)/INBOX$1/;

					if ($folder eq "" || $folder =~ /\#/) {
						next;
					} else {
                                               if ( $delim !~ /\\/ && $folder =~ /\\/) {
                                                       next;
                                               }
						my $type = ($flags =~ /\\noselect/i) ? 1 : 0;
						my $uidvalidity = &_uidvalidity($session, $imaps, $folder);
						my $info;
						if (defined $uidvalidity) {
							if (&_is_inbox($session, $imaps, $folder)) {
								$info = &_inbox($session, $imaps);
							} elsif (&_is_draft($session, $imaps, $folder)) {
								$info = &_draft($session, $imaps);
							} elsif (&_is_sent($session, $imaps, $folder)) {
								$info = &_sent($session, $imaps);
							} elsif (&_is_trash($session, $imaps, $folder)) {
								$info = &_trash($session, $imaps);
							} elsif (&_is_spam($session, $imaps, $folder)) {
								$info = &_spam($session, $imaps);
							} else {
								if (&check_imap_info($session, $imaps, "cabinet")) {
									if ($type) {
										$info = &_cabinet($session, $imaps, $folder);
									} else {
										$info = &_mailbox($session, $imaps, $folder);
									}
								} else {
									$info = &_default($session, $imaps, $folder);
								}
							}
						} else {
							$info = &_dummy($session, $imaps, $folder);
						}
						$info->{uidvalidity} = $uidvalidity;
						push(@infos, $info);
					}
				}

				# ローカルサーバ
				{
					my $info = &_local_server($session, $imaps);
					push(@infos, $info);
				}

				# ローカルフォルダ
				{
					my $info = &_local_folder($session, $imaps);
					push(@infos, $info);
				}

				# バックアップフォルダ
				if ($imaps->{custom}->{auto_backup_on} eq "on" || ($imaps->{custom}->{auto_backup_on} eq "user" && &backup_ok($session, $imaps)) ) {
					my $info = &_backup_folder($session, $imaps);
					push(@infos, $info);
				}
				DA::Custom::rewrite_ajxmailer_folder_infos($session, $imaps, \@infos);

				# SORT, COUNT
				my $reverse	= {};
				my $count   = &count($session, $imaps);
				if (defined $count) {
					foreach my $l (
						sort { $a->{sort_root} <=> $b->{sort_root}
							|| $a->{sort_level} <=> $b->{sort_level}
							|| $a->{sort_name} cmp $b->{sort_name} } @infos ) {
						if (my $fid = &inc_num($session, "fid")) {
							$l->{fid} = $fid;
							$reverse->{$l->{path}} = $fid;

							my $path  = $l->{path};
							my $type  = $l->{type};
							my $dummy = $l->{dummy};
							my $view = &view_count($session, $imaps, $count->{$path}, $type, $dummy, 1);
							$l->{recent}   = $view->{recent};
							$l->{messages} = $view->{messages};
							$l->{unseen}   = $view->{unseen};

							push(@folders, $l);
						} else {
							&_warn($session, "inc_num");
							$error = &error("NOT_INC_FID", 9); last;
						}
					}
				} else {
					&_warn($session, "count");
					$error = &error("NOT_GET_COUNT", 9);
				}

				# PARENT
				my $folders = {};
				unless ($error) {
					my $exists_no_parent = 0;

					foreach my $l (@folders) {
						if ($l->{type} eq $TYPE_ROOT) {
							$l->{parent} = 0;
						} else {
							my $path = $l->{path};
							   $path =~ s/\#[^\#]*$//;

							if (defined $reverse->{$path}) {
								$l->{parent} = $reverse->{$path};
							} else {
								$exists_no_parent = 1;
							}
						}

						$folders->{$l->{fid}} = $l;
					}

					# Fix to share folder for sendmail.
					if ($exists_no_parent) {
						my @new_folders;

						foreach my $l (@folders) {
							if (defined $l->{parent}) {
								push(@new_folders, $l);
							} else {
								my $path = $l->{path}; $path =~ s/\#[^\#]*$//;
								if ($reverse->{$path}) {
									$l->{parent} = $reverse->{$path};
									push(@new_folders, $l);
								} else {
									my @paths;
									do {
										push(@paths, $path);
										$path =~ s/\#[^\#]*$//;
									} while($path =~ /\#/ && !defined $reverse->{$path}); 

									my $last_fid = $reverse->{$path} || 0;
									foreach my $path (reverse @paths) {
										my $folder = &_decode($session, $imaps, $path);
										my $info = &_dummy($session, $imaps, $folder);
										if (my $fid = &inc_num($session, "fid")) {
											$info->{fid} = $fid;
											$info->{parent} = $last_fid;
											$reverse->{$path} = $fid;

											my $type  = $info->{type};
											my $dummy = $info->{dummy};
											my $view = &view_count($session, $imaps, $count->{$path}, $type, $dummy, 1);
											$info->{recent}   = $view->{recent};
											$info->{messages} = $view->{messages};
											$info->{unseen}   = $view->{unseen};
											$folders->{$fid}  = $info;
											push(@new_folders, $info);

											$last_fid = $fid;
										} else {
											&_warn($session, "inc_num");
											$error = &error("NOT_INC_FID", 9); last;
										}
									}

									$l->{parent} = $last_fid;
									push(@new_folders, $l);
								}
							}

							if ($error) {
								last;
							}
						}

						@folders = @new_folders;
					}

					unless (&storable_store($session, $folders, "folders")) {
						&_warn($session, "storable_store");
						$error = &error("NOT_WRITE_FOLDERS", 9);
					}
				}

				unless ($error) {
					unless (DA::SmartPhone::isSmartPhoneUsed()) {
						my $i = 0;
						foreach my $l (@folders) {
							my $fid = $l->{fid};
							if (&is_portal($session, $imaps, $folders->{$fid}->{type})) {
								splice(@folders, $i, 1);
								delete $folders->{$fid};
								last;
							}
							$i ++;
						}
					}
					$result->{folders} = \@folders;
					$result->{folders_h} = $folders;
				}
			} else {
				&_warn($session, "_list");
				$error = &error("NOT_GET_FOLDER_LIST", 9);
			}
		} else {
			if (my $folders = &storable_retrieve($session, "folders")) {
				my (@folders, $count, $rewrite);

				if ($recount) {
					$count = &count($session, $imaps);
				}

				foreach my $fid (
					sort { $folders->{$a}->{sort_root} <=> $folders->{$b}->{sort_root}
						|| $folders->{$a}->{sort_level} <=> $folders->{$b}->{sort_level}
						|| $folders->{$a}->{sort_name} cmp $folders->{$b}->{sort_name} } keys %{$folders} ) {
					unless (DA::SmartPhone::isSmartPhoneUsed()) {
						if (&is_portal($session, $imaps, $folders->{$fid}->{type})) {
							delete $folders->{$fid};
							next;
						}
					}
					if ($recount) {
						my $path  = $folders->{$fid}->{path};
						my $type  = $folders->{$fid}->{type};
						my $dummy = $folders->{$fid}->{dummy};
						my $view = &view_count($session, $imaps, $count->{$path}, $type, $dummy, 1);
						if ($folders->{$fid}->{recent}   != $view->{recent}
						||  $folders->{$fid}->{messages} != $view->{messages}
						||  $folders->{$fid}->{unseen}   != $view->{unseen}) {
							$folders->{$fid}->{recent}   = $view->{recent};
							$folders->{$fid}->{messages} = $view->{messages};
							$folders->{$fid}->{unseen}   = $view->{unseen};
							$rewrite = 1;
						}
					}
					push(@folders, $folders->{$fid});
				}

				if ($recount && $rewrite) {
					unless (&storable_store($session, $folders, "folders")) {
						&_warn($session, "storable_store");
						$error = &error("NOT_WRITE_FOLDERS", 9);
					}
				}

				$result->{folders} = \@folders;
				$result->{folders_h} = $folders;
			} else {
				&_warn($session, "storable_retrieve");
				$error = &error("NOT_READ_FOLDERS", 9);
			}
		}

		&unlock($session, "trans.folders");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub headers($$$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;

	if (&_fid2custom($session, $imaps, $folders, $c->{fid})) {
		return(DA::Custom::ajxmailer_headers($session, $imaps, $vfilter, $folders, $c));
	} elsif (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_PORTAL) {
		return(&headers_portal($session, $imaps, $vfilter, $folders, $c));
	} elsif (&_fid2type($session, $imaps, $folders, $c->{fid}) =~ /^($TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) {	
		return(&headers_local($session, $imaps, $vfilter, $folders, $c));
	} elsif ($c->{srid}) {
		return(&headers_search($session, $imaps, $vfilter, $folders, $c));
	} else {
		return(&headers_server($session, $imaps, $vfilter, $folders, $c));
	}
}

sub headers_server($$$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger       = &_logger_init($session);
	my $timezone     = get_timezone($session, $imaps);
	my $h12          = get_time_style($session, $imaps);
	my $tzview       = get_tz_view($session, $imaps);
	my $lang         = get_user_lang($session, $imaps);
	my $fid          = $c->{fid};
	my $uid          = $c->{uid};
	my $cid          = $c->{cid};
	my $sort_key     = $c->{sort_key};
	my $sort         = $c->{sort};
	my $start_sno    = int($c->{start_sno});
	my $end_sno      = int($c->{end_sno});
	my $target_sno   = 0;
	my $read_row     = $c->{read_row};
	my $search_field = $c->{search_field};
	my $search_word  = $c->{search_word};
	my $clear_recent = $c->{clear_recent};
	my $clear_cache  = $c->{clear_cache};
	my $format       = $c->{format};
	my $except       = $c->{except};
	my $result       = {};
	my ($today, $error, @headers);

	if (DA::SmartPhone::isSmartPhoneUsed()) {
		$timezone = $DA::Vars::p->{timezone};
		$h12 = 0;
		$tzview = 0;
		$lang = 'ja';
	}
	my $path      = &_fid2path($session, $imaps, $folders, $fid);
	my $md5_path  = Digest::MD5::md5_hex($path);
	if (&lock($session, "trans.$md5_path")) {
		my $uidlst_update;
		if (&storable_exist($session, "$fid\.headers.info")
		&&  &storable_exist($session, "$fid\.headers.uidlst")) {
			if (my $info = &storable_retrieve($session, "$fid\.headers.info")) {
				foreach my $key (qw(cid sort_key sort search_field search_word)) {
					if ($info->{$key} ne $c->{$key}) {
						$uidlst_update = 1; last;
					}
				}
			} else {
				&_warn($session, "storable_retrieve");
				$error = &error("NOT_READ_HEADERS_INFO", 9);
			}
		} else {
			$uidlst_update = 1;
		}

		my $folder = &_fid2folder($session, $imaps, $folders, $fid);
		my $uidval = &_fid2uidval($session, $imaps, $folders, $fid);
		my $type   = &_fid2type($session, $imaps, $folders, $fid);
		my $dummy  = &_fid2dummy($session, $imaps, $folders, $fid);
		my $sc     = {
			"folder" => $folder,
			"uidval" => $uidval,
			"where"  => &_vfilter_where($session, $imaps, $vfilter, $cid),
			"search" => &_search_where($session, $imaps, $search_field, $search_word),
			"order"  => &_make_order($session, $imaps, $type, $sort_key, $sort),
			"output" => [qw(uid_number)],
			"list"   => 1
		};
		my $uidlst;

		if ($uidlst_update || $clear_cache) {
			if ($uidlst = &_select_header($session, $imaps, $sc)) {
				if (&storable_store($session, $uidlst, "$fid\.headers.uidlst")) {
					unless (&storable_store($session, $c, "$fid\.headers.info")) {
						&_warn($session, "storable_store");
						$error = &error("NOT_WRITE_HEADERS_INFO", 9);
					}
				} else {
					&_warn($session, "storable_store");
					$error = &error("NOT_WRITE_HEADERS_UIDLST", 9);
				}
			} else {
				&_warn($session, "_select_header");
				$error = &error("NOT_SELECT_HEADER_TABLE", 9);
			}
		} else {
			unless ($uidlst = &storable_retrieve($session, "$fid\.headers.uidlst")) {
				&_warn($session, "storable_retrieve");
				$error = &error("NOT_READ_HEADERS_UIDLST", 9);
			}
		}

		unless ($error) {
			if (scalar(@{$uidlst})) {
				if ($except) {
					my %e; @e{@{&_select_uidlst_common($session, $fid, $except, $uidlst)}} = undef;
					my @l;
					foreach my $u (@{$uidlst}) {
						unless (exists $e{$u}) {
							push(@l, $u);
						}
					}
					@{$uidlst} = @l;
				}
				if ($uid) {
					my ($read_next, $read_prev) = split(/\,/, $read_row);
					if (!$read_next) {
						$read_next = 20;
					}
					if (!$read_prev) {
						$read_prev = 0;
					}

					my $max = scalar(@{$uidlst});
					my $i   = 1;
					foreach my $u (@{$uidlst}) {
						if ($u eq $uid) {
							$target_sno = $i;
							last;
						}
						$i ++;
					}
					if ($target_sno) {
						$start_sno = ($target_sno - $read_prev < 1) ?
										1 : $target_sno - $read_prev;
						$end_sno   = ($target_sno + $read_next - 1 > $max) ?
										$max : $target_sno + $read_next - 1;
					} else {
						$start_sno = 1;
						$end_sno   = $read_next;
					}
				}
				if ($c->{select_uid}) {
					my $i = 0;
					foreach my $u (@{$uidlst}) {
						if($c->{select_uid} eq $u){last;}
						$i++;
					}
					$c->{select_sno}=$i;
					my $max = scalar(@{$uidlst});
					my $temp =  $end_sno-$start_sno;
					my $end = $i + $temp;
					if ($end <= $max) {
						$sc->{uidlst} = [(@{$uidlst}[$i..$end])];
						$c->{start_sno} = $start_sno = $i + 1;
					} else {
						$i = $i-($end-$max);
						if ($i<0) {
							$i = 0;
						}
						$sc->{uidlst} = [(@{$uidlst}[$i..$max])];
						$c->{start_sno} = $start_sno = $i + 1;
					}
				} else {
					$sc->{uidlst} = [(@{$uidlst}[$start_sno-1..$end_sno-1])];
				}
				
				$sc->{output} = \@SERVER_OUTPUT_ITEMS;
				$sc->{list}   = 0;

				if (my $list = &_select_header($session, $imaps, $sc)) {
					my $hc = {
						"timezone" => $timezone,
						"today"    => $today,
						"lang"     => $lang,
						"h12"      => $h12,
						"tzview"   => $tzview
					};
					my $sno = $start_sno;
					my $open_m = &_fid2open_m($session, $imaps, $folders, $fid);
					my ($meta, $class, $data) = &list_order($imaps->{mail}, $type);
					foreach my $l (@{$list}) {
						my $h = &_out_header($session, $imaps, $l, $hc);

						$h->{fid} = $fid;
						$h->{sno} = $sno ++;
						$h->{className} = &_class_pattern($session, $imaps, $h, $class);
						$h->{open_m} = $open_m;
						$h->{type} = $type;
						$h->{html} = &_header_html($session, $imaps, $h, $data);

						my %h; @h{@{$meta}} = @$h{@{$meta}};
						push(@headers, { "meta" => \%h, "html" => $h->{html} });
					}
				} else {
					&_warn($session, "_select_header");
					$error = &error("NOT_SELECT_HEADER_TABLE", 9);
				}
			}
		}

		unless ($error) {
			if (my $cnt = &count($session, $imaps, $folder, $uidval)) {
				$result->{total} = &view_count($session, $imaps, $cnt, $type, $dummy, 1);
				$result->{view}  = {
					"messages" => scalar(@{$uidlst})
				};
				if ($c->{clear_recent}) {
					&clear_recent_count($session, $imaps, $folder, $uidval);
				}
			} else {
				&_warn($session, "count");
				$error = &error("NOT_GET_COUNT", 9);
			}
		}

		&unlock($session, "trans.$md5_path");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	} else {
		$result->{headers}    = \@headers;
		$result->{target_sno} = $target_sno;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub headers_local($$$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;	
	my $logger      = &_logger_init($session, 1);
	my $timezone    = &get_timezone($session, $imaps);
	my $h12         = &get_time_style($session, $imaps);
	my $tzview      = &get_tz_view($session, $imaps);
	my $lang        = &get_user_lang($session, $imaps);
	my $fid         = $c->{fid};
	my $uid         = $c->{uid};
	my $cid         = $c->{cid};
	my $sort_key    = $c->{sort_key};
	my $sort        = $c->{sort};
	my $start_sno   = int($c->{start_sno});
	my $end_sno     = int($c->{end_sno});
	my $target_sno  = 0;
	my $read_row    = $c->{read_row};
	my $clear_cache = $c->{clear_cache};
	my $format      = $c->{format};
	my $except      = $c->{except};
	my $result      = {};
	my ($today, $error, @headers);
	my $type  = &_fid2type($session, $imaps, $folders, $fid);

	if (DA::SmartPhone::isSmartPhoneUsed()) {
		$timezone = $DA::Vars::p->{timezone};
		$h12 = 0;
		$tzview = 0;
		$lang = 'ja';
	}
	if(&is_backup($session, $imaps, $type)) {		
		$clear_cache = 1;
		unless($sort_key) {
			$sort_key = 'date';
			$sort = 'desc';
		}
	}
	if (&lock($session, "trans.local")) {	
        my $uidlst_update;
		if (&storable_exist($session, "$fid\.headers.info")
		&&  &storable_exist($session, "$fid\.headers.uidlst")) {
			if (my $info = &storable_retrieve($session, "$fid\.headers.info")) {
				foreach my $key (qw(cid sort_key sort)) {
					if ($info->{$key} ne $c->{$key}) {
						$uidlst_update = 1; last;
					}
				}
			} else {
				&_warn($session, "storable_retrieve");
				$error = &error("NOT_READ_HEADERS_INFO", 9);
			}
		} else {
			$uidlst_update = 1;
		}
		
		my $dummy = &_fid2dummy($session, $imaps, $folders, $fid);
		my $sc    = {
			"order"  => &_make_order_local($session, $imaps, $type, $sort_key, $sort),
			"output" => [qw(uid_number)],
			"list"   => 1,
			"target" => &is_backup($session, $imaps, $type) ? "backup" : "sent"
		};
		my $uidlst;
		if ($uidlst_update || $clear_cache) {		
			if ($uidlst = &_select_header_local($session, $imaps, $sc)) {
				if (&storable_store($session, $uidlst, "$fid\.headers.uidlst")) {
					unless (&storable_store($session, $c, "$fid\.headers.info")) {
						&_warn($session, "storable_store");
						$error = &error("NOT_WRITE_HEADERS_INFO", 9);
					}
				} else {
					&_warn($session, "storable_store");
					$error = &error("NOT_WRITE_HEADERS_UIDLST", 9);
				}
			} else {
				&_warn($session, "_select_header_local");
				$error = &error("NOT_SELECT_HEADER_LOCAL", 9);
			}
		} else {
			unless ($uidlst = &storable_retrieve($session, "$fid\.headers.uidlst")) {
				&_warn($session, "storable_retrieve");
				$error = &error("NOT_READ_HEADERS_UIDLST", 9);
			}
		}
		unless ($error) {							
			if (scalar(@{$uidlst})) {
				if ($except) {
					my %e; @e{@{&_select_uidlst_common($session, $fid, $except, $uidlst)}} = undef;
					my @l;
					foreach my $u (@{$uidlst}) {
						unless (exists $e{$u}) {
							push(@l, $u);
						}
					}
					@{$uidlst} = @l;
				}
				if ($uid) {
					my ($read_next, $read_prev) = split(/\,/, $read_row);
					if (!$read_next) {
						$read_next = 20;
					}
					if (!$read_prev) {
						$read_prev = 0;
					}

					my $max = scalar(@{$uidlst});
					my $i   = 1;
					foreach my $u (@{$uidlst}) {
						if ($u eq $uid) {
							$target_sno = $i;
							last;
						}
						$i ++;
					}
					if ($target_sno) {
						$start_sno = ($target_sno - $read_prev < 1) ?
										1 : $target_sno - $read_prev;
						$end_sno   = ($target_sno + $read_next - 1 > $max) ?
										$max : $target_sno + $read_next - 1;
					} else {
						$start_sno = 1;
						$end_sno   = $read_next;
					}
				}
				if ($c->{select_uid}) {				
					my $i = 0;				
					foreach my $u (@{$uidlst}) {				
						if($c->{select_uid} eq $u){last;}		
						$i++;				
					}				
					$c->{select_sno}=$i;				
					my $max = scalar(@{$uidlst});				
					my $temp =  $end_sno-$start_sno;			
					my $end = $i + $temp;				
					if ($end <= $max) {				
						$sc->{uidlst} = [(@{$uidlst}[$i..$end])];	
						$c->{start_sno} = $start_sno = $i + 1;		
					} else {				
						$i = $i-($end-$max);				
						if ($i<0) {				
							$i = 0;				
						}				
						$sc->{uidlst} = [(@{$uidlst}[$i..$max])];	
						$c->{start_sno} = $start_sno = $i + 1;		
					}				
				} else {				
					$sc->{uidlst} = [(@{$uidlst}[$start_sno-1..$end_sno-1])];
				}				

				$sc->{output} = \@LOCAL_OUTPUT_ITEMS;
				$sc->{list}   = 0;

				my $sno = $start_sno;
				my $open_m = &_fid2open_m($session, $imaps, $folders, $fid);
				my ($meta, $class, $data) = &list_order($imaps->{mail}, $type);			
				if (my $list = &_select_header_local($session, $imaps, $sc)) {					
					foreach my $l (@{$list}) {
						my $h = {
							"fid" => $fid,
							"sno" => $sno ++
						};
						foreach my $k (keys %{$l}) {
							$h->{&_column2xmlname($k)} = $l->{$k};
						}
						$h->{className} = &_class_pattern($session, $imaps, $h, $class);
						$h->{open_m} = $open_m;
						$h->{type} = $type;
						$h->{html} = &_header_html($session, $imaps, $h, $data);
						my %h; @h{@{$meta}} = @$h{@{$meta}};
						push(@headers, { "meta" => \%h, "html" => $h->{html} });
					}
				} else {
					&_warn($session, "_select_header_local");
					$error = &error("NOT_SELECT_HEADER_LOCAL", 9);
				}
			}
		}

		unless ($error) {
			my $cnt = {
				"recent_count" => 0,
				"exists_count" => scalar(@{$uidlst}),
				"unseen_count" => 0
			};
			$result->{total} = &view_count($session, $imaps, $cnt, $type, $dummy, 1);
			$result->{view}  = {
				"messages" => $cnt->{exists_count}
			};
		}
		&unlock($session, "trans.local");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	} else {
		$result->{headers}    = \@headers;
		$result->{target_sno} = $target_sno;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub headers_search($$$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger      = &_logger_init($session, 1);
	my $timezone    = &get_timezone($session, $imaps);
	my $h12         = &get_time_style($session, $imaps);
	my $tzview      = &get_tz_view($session, $imaps);
	my $lang        = &get_user_lang($session, $imaps);
	my $fid         = $c->{fid};
	my $uid         = $c->{uid};
	my $cid         = $c->{cid};
	my $sort_key    = $c->{sort_key};
	my $sort        = $c->{sort};
	my $start_sno   = int($c->{start_sno});
	my $end_sno     = int($c->{end_sno});
	my $target_sno  = 0;
	my $read_row    = $c->{read_row};
	my $srid        = $c->{srid};
	my $clear_cache = $c->{clear_cache};
	my $format      = $c->{format};
	my $except      = $c->{except};
	my $result      = {};
	my ($today, $error, @headers);

	if (DA::SmartPhone::isSmartPhoneUsed()) {
		$timezone = $DA::Vars::p->{timezone};
		$h12 = 0;
		$tzview = 0;
		$lang = 'ja';
	}
	unless (-f &dbmfile($session, "search.flags.$srid")) {
		return(&error("NOT_EXISTS_DBM", 9));
	}
	unless (-f &dbmfile($session, "search.infos.$srid")) {
		return(&error("NOT_EXISTS_DBM", 9));
	}

	if (&lock($session, "trans.search")) {
		my $uidlst_update;
		if (&storable_exist($session, "search.headers.info.$srid")
		&&  &storable_exist($session, "search.headers.uidlst.$srid")) {
			if (my $info = &storable_retrieve($session, "search.headers.info.$srid")) {
				foreach my $key (qw(cid sort_key sort)) {
					if ($info->{$key} ne $c->{$key}) {
						$uidlst_update = 1; last;
					}
				}
			} else {
				&_warn($session, "storable_retrieve");
				$error = &error("NOT_READ_HEADERS_INFO", 9);
			}
		} else {
			$uidlst_update = 1;
		}

		my $type = &_fid2type($session, $imaps, $folders, $fid);
		my $sc   = {
			"srid"   => $srid,
			"order"  => &_make_order_search($session, $imaps, $type, $sort_key, $sort),
			"output" => [qw(srkey)],
			"list"   => 1
		};
		my $uidlst;

		if ($uidlst_update || $clear_cache) {
			if ($uidlst = &_select_header_search($session, $imaps, $sc)) {
				if (&storable_store($session, $uidlst, "search.headers.uidlst.$srid")) {
					unless (&storable_store($session, $c, "search.headers.info.$srid")) {
						&_warn($session, "storable_store");
						$error = &error("NOT_WRITE_HEADERS_INFO", 9);
					}
				} else {
					&_warn($session, "storable_store");
					$error = &error("NOT_WRITE_HEADERS_UIDLST", 9);
				}
			} else {
				&_warn($session, "_select_header_search");
				$error = &error("NOT_SELECT_HEADER_SEARCH", 9);
			}
		} else {
			unless ($uidlst = &storable_retrieve($session, "search.headers.uidlst.$srid")) {
				&_warn($session, "storable_retrieve");
				$error = &error("NOT_READ_HEADERS_UIDLST", 9);
			}
		}

		unless ($error) {
			if (scalar(@{$uidlst})) {
				if ($except) {
					my %e; @e{@{&_select_uidlst_search($session, $srid, $except, $uidlst, 0, $fid)}} = undef;
					my @l;
					foreach my $u (@{$uidlst}) {
						unless (exists $e{$u}) {
							push(@l, $u);
						}
					}
					@{$uidlst} = @l;
				}
				if ($uid) {
					my ($read_next, $read_prev) = split(/\,/, $read_row);
					if (!$read_next) {
						$read_next = 20;
					}
					if (!$read_prev) {
						$read_prev = 0;
					}

					my $max = scalar(@{$uidlst});
					my $i   = 1;
					foreach my $u (@{$uidlst}) {
						if ($u eq "$fid\_$uid") {
							$target_sno = $i;
							last;
						}
						$i ++;
					}
					if ($target_sno) {
						$start_sno = ($target_sno - $read_prev < 1) ?
										1 : $target_sno - $read_prev;
						$end_sno   = ($target_sno + $read_next - 1 > $max) ?
										$max : $target_sno + $read_next - 1;
					} else {
						$start_sno = 1;
						$end_sno   = $read_next;
					}
				}
				$sc->{uidlst} = [(@{$uidlst}[$start_sno-1..$end_sno-1])];
				$sc->{output} = \@SEARCH_OUTPUT_ITEMS;
				$sc->{list}   = 0;

				if (my $list = &_select_header_search($session, $imaps, $sc)) {
					my $hc = {
						"timezone" => $timezone,
						"today"    => $today,
						"lang"     => $lang,
						"h12"      => $h12,
						"tzview"   => $tzview
					};

					my $sno = $start_sno;
					my ($meta, $class, $data) = &list_order($imaps->{mail}, $type);
					foreach my $l (@{$list}) {
						my $h = &_out_header($session, $imaps, $l, $hc);

						$h->{srid} = $srid;
						$h->{sno}  = $sno ++;
						$h->{className} = &_class_pattern($session, $imaps, $h, $class);
						$h->{open_m} = &_fid2open_m($session, $imaps, $folders, $l->{fid});
						$h->{type} = &_fid2type($session, $imaps, $folders, $l->{fid});
						$h->{html} = &_header_html($session, $imaps, $h, $data);

						my %h; @h{@{$meta}} = @$h{@{$meta}};
						push(@headers, { "meta" => \%h, "html" => $h->{html} });
					}
				} else {
					&_warn($session, "_select_header_search");
					$error = &error("NOT_SELECT_HEADER_SEARCH", 9);
				}
			}
		}

		&unlock($session, "trans.search");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	} else {
		$result->{headers}    = \@headers;
		$result->{target_sno} = $target_sno;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub headers_portal($$$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger      = &_logger_init($session, 1);
	my $timezone    = &get_timezone($session, $imaps);
	my $h12         = &get_time_style($session, $imaps);
	my $tzview      = &get_tz_view($session, $imaps);
	my $lang        = &get_user_lang($session, $imaps);
	my $fid         = $c->{fid};
	my $uid         = $c->{uid};
	my $cid         = $c->{cid};
	my $sort_key    = $c->{sort_key};
	my $sort        = $c->{sort};
	my $start_sno   = int($c->{start_sno});
	my $end_sno     = int($c->{end_sno});
	my $target_sno  = 0;
	my $read_row    = $c->{read_row};
	my $clear_cache = $c->{clear_cache};
	my $format      = $c->{format};
	my $except      = $c->{except};
	my $result      = {};
	my ($today, $error, @headers);

	if (DA::SmartPhone::isSmartPhoneUsed()) {
		$timezone = $DA::Vars::p->{timezone};
		$h12 = 0;
		$tzview = 0;
		$lang = 'ja';
	}
	if (&lock($session, "trans.portal")) {
        my $uidlst_update;
		if (&storable_exist($session, "$fid\.headers.info")
		&&  &storable_exist($session, "$fid\.headers.uidlst")) {
			if (my $info = &storable_retrieve($session, "$fid\.headers.info")) {
				foreach my $key (qw(cid sort_key sort)) {
					if ($info->{$key} ne $c->{$key}) {
						$uidlst_update = 1; last;
					}
				}
			} else {
				&_warn($session, "storable_retrieve");
				$error = &error("NOT_READ_HEADERS_INFO", 9);
			}
		} else {
			$uidlst_update = 1;
		}

		my $type  = &_fid2type($session, $imaps, $folders, $fid);
		my $dummy = &_fid2dummy($session, $imaps, $folders, $fid);
		my $sc    = {
			"where"  => &_vfilter_where($session, $imaps, $vfilter, $cid),
			"order"  => &_make_order_portal($session, $imaps, $type, $sort_key, $sort),
			"output" => [qw(sno uid_number folder_name)]
		};
		my $uidlst;

		if ($uidlst_update || $clear_cache) {
			if ($uidlst = &_select_header_portal($session, $imaps, $sc)) {
				if (&storable_store($session, $uidlst, "$fid\.headers.uidlst")) {
					unless (&storable_store($session, $c, "$fid\.headers.info")) {
						&_warn($session, "storable_store");
						$error = &error("NOT_WRITE_HEADERS_INFO", 9);
					}
				} else {
					&_warn($session, "storable_store");
					$error = &error("NOT_WRITE_HEADERS_UIDLST", 9);
				}
			} else {
				&_warn($session, "_select_header_portal");
				$error = &error("NOT_SELECT_HEADER_PORTAL", 9);
			}
		} else {
			unless ($uidlst = &storable_retrieve($session, "$fid\.headers.uidlst")) {
				&_warn($session, "storable_retrieve");
				$error = &error("NOT_READ_HEADERS_UIDLST", 9);
			}
		}

		unless ($error) {
			if (scalar(@{$uidlst})) {
				# TODO: except

				my $snolst = [];
				foreach my $u (@{$uidlst}) {
					push(@{$snolst}, $u->{sno});
				}

				$sc->{snolst} = [(@{$snolst}[$start_sno-1..$end_sno-1])];
				$sc->{output} = \@PORTAL_OUTPUT_ITEMS;
				$sc->{list}   = 0;

				my $sno = $start_sno;
				my ($meta, $class, $data) = &list_order($imaps->{mail}, $type);
				if (my $list = &_select_header_portal($session, $imaps, $sc)) {
					my $hc = {
						"timezone" => $timezone,
						"today"    => $today,
						"lang"     => $lang,
						"h12"      => $h12,
						"tzview"   => $tzview
					};

					foreach my $l (@{$list}) {
						my $path = &_encode($session, $imaps, $l->{folder_name});
						my $fid  = &_path2fid($session, $imaps, $folders, $path);
						my $h = &_out_header($session, $imaps, $l, $hc);

						$h->{fid} = $fid;
						$h->{sno} = $sno ++;
						$h->{className} = &_class_pattern($session, $imaps, $h, $class);
						$h->{open_m} = &_fid2open_m($session, $imaps, $folders, $h->{fid});
						$h->{type} = &_fid2type($session, $imaps, $folders, $h->{fid});

						$h->{html} = &_header_html($session, $imaps, $h, $data);

						if (DA::SmartPhone::isSmartPhoneUsed()) {
							push(@headers, { "meta" => $h, "html" => $h->{html} });
						} else {
							my %h; @h{@{$meta}} = @$h{@{$meta}};
							push(@headers, { "meta" => \%h, "html" => $h->{html} });
						}
					}
				} else {
					&_warn($session, "_select_header_portal");
					$error = &error("NOT_SELECT_HEADER_PORTAL", 9);
				}
			}
		}

		unless ($error) {
			my $cnt = {
				"recent_count" => 0,
				"exists_count" => scalar(@{$uidlst}),
				"unseen_count" => 0
			};
			$result->{total} = &view_count($session, $imaps, $cnt, $type, $dummy, 1);
			$result->{view}  = {
				"messages" => $cnt->{exists_count}
			};
		}

		&unlock($session, "trans.portal");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	} else {
		$result->{headers}    = \@headers;
		$result->{target_sno} = $target_sno;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub update($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_PORTAL) {
		return(&update_portal($session, $imaps, $folders, $c));
	}
	elsif(&_fid2update($session, $imaps, $folders, $c->{fid}) && $c->{from_fid} && &_fid2type($session, $imaps, $folders, $c->{from_fid}) =~ /^($TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) {
		return (&update_local($session, $imaps, $folders, $c));
	}
	elsif (&_fid2update($session, $imaps, $folders, $c->{fid})) {
		return(&update_server($session, $imaps, $folders, $c));
	}
}
#after move update local 
sub update_local($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $fid = $c->{from_fid};
	my $type   = &_fid2type($session, $imaps, $folders, $fid);
	my $target = &is_backup($session, $imaps, $type) ? "backup" : "sent";
	my $result     = {};
	my $file ;
	my $messages = 0;
	if($target eq 'backup') {
		my $mail_mid_gid = DA::OrgMail::get_cookie($session) || $session->{user};
		my $mapping_file = $mail_mid_gid.'.maid_mapping.dat';
		$file = &backup_mapping_file($session,$mapping_file);
	}else {
		$file = &infofile($session,$target);
	}
	
	if (my $fh = &open_file($session, $file, "r")) {
		while (my $l = <$fh>) {
			chomp($l);
			$messages ++;
		} 
		&close_file($session, $file, $fh);
		$result->{total}->{messages} = $messages;
		$result->{total}->{unseen} = 0;
		$result->{total}->{recent} = 0;
	} else {
		&_warn($session, "open_file");
	}
	return $result;
}

sub update_server($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger     = &_logger_init($session);
	my $noinsert   = $c->{noinsert};
	my $noupdate   = $c->{noupdate};
	my $norecent   = $c->{norecent};
	my $recentzero = $c->{recentzero};
	my $fid        = $c->{fid};
	my $ignoreQuota= $c->{ignoreQuota};
	my $nolock     = $c->{nolock};
	my $folder     = &_fid2folder($session, $imaps, $folders, $fid);
	my $uidval     = &_fid2uidval($session, $imaps, $folders, $fid);
	my $type       = &_fid2type($session, $imaps, $folders, $fid);
	my $dummy      = &_fid2dummy($session, $imaps, $folders, $fid);
	my $result     = {};
	my ($error, $warn);

	my @fields = qw (
		Sender From To Cc Bcc Reply-To
		Date Subject
		X-Priority X-MSMail-Priority Importance
	);
	push(@fields, ($MAIL_VALUE->{GROUP_TO}, $MAIL_VALUE->{GROUP_OLD}));

	my @fetchs = qw (
		Flags RFC822.SIZE INTERNALDATE BODYSTRUCTURE
	);

	DA::Custom::rewrite_update_server_params($session, $imaps, $folders, $c, \@fields, \@fetchs);

	&_set_uid_flag($session, $imaps);

	my $path      = &_fid2path($session, $imaps, $folders, $fid);
	my $md5_path  = Digest::MD5::md5_hex($path);
	if (&lock($session, "trans.update.$md5_path")) {
		if (&_select($session, $imaps, $folder)) {
			my $sc = {
				"folder" => $folder,
				"uidval" => $uidval,
				"output" => ($noupdate) ? [qw(uid_number)] : [qw(uid_number seen flagged deleted replied forwarded)],
				"list"   => 2,
				"key"    => "uid_number",
				"gid"    => $c->{gid}
			};
			my $oldlst = &_select_header($session, $imaps, $sc);
			my $exists = &_message_count($session, $imaps, $folder);

			unless ($oldlst) {
				&_warn($session, "_select_header");
				$error = &error("NOT_SELECT_HEADER_TABLE", 9);
			}

			unless (defined $exists) {
				&_warn($session, "_message_count");
				$error = &error("NOT_MESSAGE_COUNT", 9);
			}

			my $newlst = [];
			if ($exists && !$error) {
				unless ($newlst = &_search($session, $imaps, "ALL 1:$exists")) {
					&_warn($session, "_search");
					$error = &error("NOT_SEARCH", 9);
				}
			}

			if ($exists && scalar(keys %{$oldlst})) {
				$warn = 1;
			}

			# 更新処理
			my ($diff_recent, $diff_exists, $diff_unseen, $max_uid_number, $clear_uidlst);
			unless ($noupdate) {
				if (!$error) {
					# 削除反映
					my %tmp;
					@tmp{(keys %{$oldlst})} = undef;
					delete @tmp{@{$newlst}};

					if (scalar(%tmp)) {
						my $dc = {
							"folder" => $folder,
							"uidval" => $uidval,
							"uidlst" => [(sort {$a <=> $b} keys %tmp)],
							"gid"    => $c->{gid}
						};
						if (&_delete_header($session, $imaps, $dc)) {
							my ($de, $ds) = &_diff_count($oldlst, [(keys %tmp)], "delete", 1);

							$diff_exists += $de;
							$diff_unseen += $ds;

							$clear_uidlst = 1;
						} else {
							&_warn($session, "_delete_header");
							$error = &error("NOT_DELETE_HEADER_TABLE", 9);
						}
					}
				}

				# 未読／既読フラグ更新
				if ($exists && !$error) {
					if (my $unseenlst = &_search($session, $imaps, "ALL UNSEEN")) {
						my @oldunseen = grep(!$oldlst->{$_}->{seen}, keys %{$oldlst});
						my %tmp1;
						@tmp1{@oldunseen} = undef;
						delete @tmp1{@{$unseenlst}};

						if (scalar(%tmp1)) {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => [(sort {$a <=> $b} keys %tmp1)],
								"set"    => [{"column" => "seen", "value" => 1}],
								"gid"    => $c->{gid}
							};
							if (&_update_header($session, $imaps, $uc)) {
								my ($de, $ds) = &_diff_count($oldlst, [(keys %tmp1)], "seen");
								$diff_exists += $de;
								$diff_unseen += $ds;

								$clear_uidlst = 1;
							} else {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						}

						my %tmp2;
						@tmp2{(keys %{$oldlst})} = undef;
						delete @tmp2{@oldunseen};
						my %tmp3;
						@tmp3{@{$newlst}} = undef;
						delete @tmp3{@{$unseenlst}};
						my %tmp4;
						@tmp4{(keys %tmp2)} = undef;
						delete @tmp4{(keys %tmp3)};
						if (scalar(%tmp4)) {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => [(sort {$a <=> $b} keys %tmp4)],
								"set"    => [{"column" => "seen", "value" => 0}],
								"gid"    => $c->{gid}
							};
							if (&_update_header($session, $imaps, $uc)) {
								my ($de, $ds) = &_diff_count($oldlst, [(keys %tmp4)], "unseen");
								$diff_exists += $de;
								$diff_unseen += $ds;

								$clear_uidlst = 1;
							} else {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						}
					} else {
						&_warn($session, "_search");
						$error = &error("NOT_SEARCH", 9);
					}
				}

				# マークフラグ更新
				if ($exists && !$error) {
					if (my $unflaggedlst = &_search($session, $imaps, "ALL UNFLAGGED")) {
						my @oldunflagged = grep(!$oldlst->{$_}->{flagged}, keys %{$oldlst});
						my %tmp1;
						@tmp1{@oldunflagged} = undef;
						delete @tmp1{@{$unflaggedlst}};

						if (scalar(%tmp1)) {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => [(sort {$a <=> $b} keys %tmp1)],
								"set"    => [{"column" => "flagged", "value" => 1}],
								"gid"    => $c->{gid}
							};
							if (&_update_header($session, $imaps, $uc)) {
								$clear_uidlst = 1;
							} else {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						}

						my %tmp2;
						@tmp2{(keys %{$oldlst})} = undef;
						delete @tmp2{@oldunflagged};
						my %tmp3;
						@tmp3{@{$newlst}} = undef;
						delete @tmp3{@{$unflaggedlst}};
						my %tmp4;
						@tmp4{(keys %tmp2)} = undef;
						delete @tmp4{(keys %tmp3)};

						if (scalar(%tmp4)) {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => [(sort {$a <=> $b} keys %tmp4)],
								"set"    => [{"column" => "flagged", "value" => 0}],
								"gid"    => $c->{gid}
							};
							if (&_update_header($session, $imaps, $uc)) {
								$clear_uidlst = 1;
							} else {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						}
					} else {
						&_warn($session, "_search");
						$error = &error("NOT_SEARCH", 9);
					}
				}

				# 削除フラグ更新
				if ($exists && !$error) {
					if (my $undeletedlst = &_search($session, $imaps, "ALL UNDELETED")) {
						my @oldundeleted = grep(!$oldlst->{$_}->{deleted}, keys %{$oldlst});
						my %tmp1;
						@tmp1{@oldundeleted} = undef;
						delete @tmp1{@{$undeletedlst}};

						if (scalar(%tmp1)) {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => [(sort {$a <=> $b} keys %tmp1)],
								"set"    => [{"column" => "deleted", "value" => 1}],
								"gid"    => $c->{gid}
							};
							if (&_update_header($session, $imaps, $uc)) {
								$clear_uidlst = 1;
							} else {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						}

						my %tmp2;
						@tmp2{(keys %{$oldlst})} = undef;
						delete @tmp2{@oldundeleted};
						my %tmp3;
						@tmp3{@{$newlst}} = undef;
						delete @tmp3{@{$undeletedlst}};
						my %tmp4;
						@tmp4{(keys %tmp2)} = undef;
						delete @tmp4{(keys %tmp3)};

						if (scalar(%tmp4)) {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => [(sort {$a <=> $b} keys %tmp4)],
								"set"    => [{"column" => "deleted", "value" => 0}],
								"gid"    => $c->{gid}
							};
							if (&_update_header($session, $imaps, $uc)) {
								$clear_uidlst = 1;
							} else {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						}
					} else {
						&_warn($session, "_search");
						$error = &error("NOT_SEARCH", 9);
					}
				}

				unless (&check_imap_info($session, $imaps, "no_user_flag")) {
				# 返信フラグ更新
				if ($exists && !$error && !&check_imap_info($session, $imaps, "no_replied_flag")) {
					if (my $unrepliedlst = &_search($session, $imaps, "ALL UNKEYWORD ISEReplied")) {
						my @oldunreplied = grep(!$oldlst->{$_}->{replied}, keys %{$oldlst});
						my %tmp1;
						@tmp1{@oldunreplied} = undef;
						delete @tmp1{@{$unrepliedlst}};

						if (scalar(%tmp1)) {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => [(sort {$a <=> $b} keys %tmp1)],
								"set"    => [{"column" => "replied", "value" => 1}],
								"gid"    => $c->{gid}
							};
							unless (&_update_header($session, $imaps, $uc)) {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						}

						my %tmp2;
						@tmp2{(keys %{$oldlst})} = undef;
						delete @tmp2{@oldunreplied};
						my %tmp3;
						@tmp3{@{$newlst}} = undef;
						delete @tmp3{@{$unrepliedlst}};
						my %tmp4;
						@tmp4{(keys %tmp2)} = undef;
						delete @tmp4{(keys %tmp3)};

						if (scalar(%tmp4)) {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => [(sort {$a <=> $b} keys %tmp4)],
								"set"    => [{"column" => "replied", "value" => 0}],
								"gid"    => $c->{gid}
							};
							unless (&_update_header($session, $imaps, $uc)) {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						}
					} else {
						&_warn($session, "_search");
						$error = &error("NOT_SEARCH", 9);
					}
				}

				# 転送フラグ更新
				if ($exists && !$error && !&check_imap_info($session, $imaps, "no_forwarded_flag")) {
					if (my $unforwardedlst = &_search($session, $imaps, "ALL UNKEYWORD ISEForwarded")) {
						my @oldunforwarded = grep(!$oldlst->{$_}->{forwarded}, keys %{$oldlst});
						my %tmp1;
						@tmp1{@oldunforwarded} = undef;
						delete @tmp1{@{$unforwardedlst}};

						if (scalar(%tmp1)) {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => [(sort {$a <=> $b} keys %tmp1)],
								"set"    => [{"column" => "forwarded", "value" => 1}],
								"gid"    => $c->{gid}
							};
							unless (&_update_header($session, $imaps, $uc)) {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						}

						my %tmp2;
						@tmp2{(keys %{$oldlst})} = undef;
						delete @tmp2{@oldunforwarded};
						my %tmp3;
						@tmp3{@{$newlst}} = undef;
						delete @tmp3{@{$unforwardedlst}};
						my %tmp4;
						@tmp4{(keys %tmp2)} = undef;
						delete @tmp4{(keys %tmp3)};

						if (scalar(%tmp4)) {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => [(sort {$a <=> $b} keys %tmp4)],
								"set"    => [{"column" => "forwarded", "value" => 0}],
								"gid"    => $c->{gid}
							};
							unless (&_update_header($session, $imaps, $uc)) {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						}
					} else {
						&_warn($session, "_search");
						$error = &error("NOT_SEARCH", 9);
					}
				}
				}
			}

			# 受信処理
			my @inserted;
			unless ($noinsert) {
				my @ins;
				if ($exists && !$error) {
					my %tmp;
					@tmp{@{$newlst}} = undef;
					delete @tmp{(keys %{$oldlst})};

					if ($type eq $TYPE_INBOX && $imaps->{mail}->{filter} eq "on") {
						my $fc = {
							"fid"  => $fid,
							"ignoreQuota" => $ignoreQuota,
							"uid"  => join(",", sort {$a <=> $b} keys %tmp),
							"auto" => 1
						};
						my $rf = &filter($session, $imaps, undef, $folders, $fc);
						if ($rf->{error}) {
							$error = $rf;
						} else {
							if (&_examine($session, $imaps, $folder)) {
								@{$result->{counts}} = @{$rf->{counts}};
								@ins = @{$rf->{uids}};
							} else {
								&_warn($session, "_examine");
								$error = &error("NOT_EXAMINE_FOLDER", 9);
							}
						}
					} else {
						@ins = sort {$a <=> $b} keys %tmp;
					}
				}

				if ($exists && !$error) {
					my $addresses  = &get_user_addresses($session, $imaps);
					my $addr_match = &get_match_rule(values %{$addresses});
					my $fetchs     = join(" ", @fetchs);
					my $nos  = &_number(join(",", @ins), 1);
					my $ins  = 0;
					my $seen = 0;
					my $data = {};
					my $ic   = {
						"folder"	=> $folder,
						"uidval"	=> $uidval,
						"gid"    => $c->{gid}
					};
					if (scalar(@{$nos})) {
						foreach my $n (@{$nos}) {
							my $status = &_fetch($session, $imaps, $n, $fetchs);
							my $header = &_parse_headers($session, $imaps, $n, \@fields);
							unless ($header) {
								&_warn($session, "_parse_headers");
								$error = &error("NOT_PARSE_HEADERS", 9);
								last;
							}
							unless ($status) {
								&_warn($session, "_fetch");
								$error = &error("NOT_FETCH_STATUS", 9);
								last;
							}
							if ($type eq $TYPE_SENT || $type eq $TYPE_DRAFT) {
								unless (&_seen($session, $imaps, $n)) {
									&_warn($session, "_seen");
								}
								$seen = 1;
							}

							foreach my $u (@{&_number2array($n)}) {
								$data->{$u} = &_in_header($session, $imaps, $status->{$u}, $header->{$u}, $addr_match, $seen);
								$ins ++;

								if ($ins >= $MAX_HEADER_STN) {
									$ic->{data} = $data;
									if (&_insert_header($session, $imaps, $ic)) {
										my ($de, $ds) = &_diff_count($data, [(keys %{$data})], "insert");
										my $max = (sort {$a <=> $b} keys %{$data})[-1];
										$diff_recent += $de;
										$diff_exists += $de;
										$diff_unseen += $ds;
										$clear_uidlst = 1;
										$max_uid_number = ($max_uid_number > $max) ?
															$max_uid_number : $max;

										push(@inserted, sort {$a <=> $b} keys %{$data});
										$data = {};
										$ins  = 0;
									} else {
										&_warn($session, "_insert_header");
										$error = &error("NOT_INSERT_HEADER_TABLE", 9);
										last;
									}
								}
							}

							if ($error) {
								last;
							}
						}

						unless ($error) {
							if ($ins) {
								$ic->{data} = $data;
								if (&_insert_header($session, $imaps, $ic)) {
									my ($de, $ds) = &_diff_count($data, [(keys %{$data})], "insert");
									my $max = (sort {$a <=> $b} keys %{$data})[-1];
									$diff_recent += $de;
									$diff_exists += $de;
									$diff_unseen += $ds;
									$clear_uidlst = 1;
									$max_uid_number = ($max_uid_number > $max) ?
														$max_uid_number : $max;

									push(@inserted, sort {$a <=> $b} keys %{$data});
									$data = {};
									$ins  = 0;
								} else {
									&_warn($session, "_insert_header");
									$error = &error("NOT_INSERT_HEADER_TABLE", 9);
								}
							}
						}
					}
				}
			}

			if (scalar(@inserted) || $diff_recent || $diff_exists || $diff_unseen) {
				if (!$error) {
					my $count = {
						"recent_count"	=> $diff_recent,
						"exists_count"	=> $diff_exists,
						"unseen_count"	=> $diff_unseen,
						"max_uid_number"=> $max_uid_number
					};
					if (my $cnt = &inc_count($session, $imaps, $folder, $uidval, $count, $c->{gid})) {
						$result->{total} = &view_count($session, $imaps, $cnt, $type, $dummy, 1);
						if ($recentzero) {
							$result->{total}->{recent} = 0;
						}
						if (!$norecent) {
							&clear_recent_count($session, $imaps, $folder, $uidval, $c->{gid});
						}
						if ($type eq $TYPE_INBOX) {
							&set_portal_reload($session, $imaps);
						} else {
							if ($imaps->{portal}->{ml_target} eq "all") {
								&set_portal_reload($session, $imaps);
							}
						}
					} else {
						&_warn($session, "inc_count");
						$error = &error("NOT_INC_COUNT", 9);
					}
				}
			} else {
				if (!$error) {
					if (my $cnt = &count($session, $imaps, $folder, $uidval, $c->{gid})) {
						$result->{total} = &view_count($session, $imaps, $cnt, $type, $dummy, 1);
						if ($recentzero) {
							$result->{total}->{recent} = 0;
						}
						if (!$norecent) {
							&clear_recent_count($session, $imaps, $folder, $uidval, $c->{gid});
						}
					} else {
						&_warn($session, "count");
						$error = &error("NOT_GET_COUNT", 9);
					}
				}
			}

			# キャッシュがクリアされなかった時の処理がない
			unless (&_clear_uidlst_common($session, $fid)) {
				&_warn($session, "_clear_uidlst_common");
			}
		} else {
			&_warn($session, "_select");
			$error = &error("NOT_SELECT_FOLDER", 9);
		}

		&unlock($session, "trans.update.$md5_path");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	} else {
		if ($ENV{SCRIPT_NAME} =~ /\Qajx_ma_list.cgi\E/) {
			if ($imaps->{uidval}->{$folder}->{warn}) {
				if ($warn) {
					&_warn($session, "Consistency warning($fid)");
					if ($imaps->{custom}->{auto_fix_consistency} eq "on") {
						$result->{result} = &error("WARN_UIDVALIDITY", 1001);
					} elsif ($imaps->{custom}->{auto_fix_consistency} eq "off") {
						$result->{result} = &error("WARN_UIDVALIDITY_WITH_CONFIRM", 1002);
					} else {
						if ($imaps->{mail}->{auto_fix_consistency} eq "on") {
							$result->{result} = &error("WARN_UIDVALIDITY", 1001);
						} else {
							$result->{result} = &error("WARN_UIDVALIDITY_WITH_CONFIRM", 1002);
						}
					}
				}
			}
		}
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);
	return($result);
}

sub update_portal($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session);
	my $fid    = $c->{fid};
	my $result = {};
	my ($error, $warn);

	my $base = (DA::SmartPhone::isSmartPhoneUsed()) ? "smartphone" : "portal";
	if ($imaps->{status}->{$base . "_reload"}
	||  $imaps->{status}->{$base} ne $DA::IsVersion::Version
	||  $imaps->{status}->{$base . "_charset"} ne DA::Unicode::internal_charset()
	||  $imaps->{status}->{$base . "_mailer"} ne "ajax") {
		$error = &make_portal($session, $imaps);

		unless ($error) {
			unless (&_clear_uidlst_common($session, $fid)) {
				&_warn($session, "_clear_uidlst_common");
			}
		}
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub search($$$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger    = &_logger_init($session);
	my $fid       = $c->{fid};
	my $field     = $c->{field};
	my $keyword   = &jreplace($c->{keyword}, '　', ' ');
	   $keyword   =~s/^\s+//;
	   $keyword   =~s/\s+$//;
	my $cond      = $c->{cond};
	my $class     = $c->{class};
	my $seen      = $c->{seen};
	my $flagged   = $c->{flagged};
	my $deleted   = $c->{deleted};
	my $attachment= $c->{attachment};
	my $toself    = $c->{toself};
	my $priority  = $c->{priority};
	my $result    = {};
	my ($today, $error);

	if (DA::Unicode::is_empty($keyword, &mailer_charset())) {
		return(&error("NO_INPUT_QUERY", 1, t_("キーワード")));
	}

	my $srid = &inc_num($session, "srid");
	if ($srid) {
		&clear_dbm($session, "search.flags.$srid");
		&clear_dbm($session, "search.infos.$srid");
	} else {
		return(&error("NOT_INC_SEARCH", 9));
	}

	my @keywords = split(/\s+/, $keyword);
	my (@targets, @wheres, $target);
	if ($class eq 2) {
		my $lowers = &_fid2lowers($session, $imaps, $folders, $fid);
		foreach my $f ($fid, @{$lowers}) {
			if (&_fid2search($session, $imaps, $folders, $f)) {
				push(@targets, $f);
			}
		}

		$target = &_fid2name($session, $imaps, $folders, $fid)
		        . &convert_mailer(t_("以下"));
	} else {
		if (&_fid2search($session, $imaps, $folders, $fid)) {
			push(@targets, $fid);
		}

		$target = &_fid2name($session, $imaps, $folders, $fid);
	}
	if ($seen) {
		if ($seen eq 1) {
			push(@wheres, { "column" => "seen", "value" => 0 });
		} else {
			push(@wheres, { "column" => "seen", "value" => 1 });
		}
	}
	if ($flagged) {
		if ($flagged eq 1) {
			push(@wheres, { "column" => "flagged", "value" => 0 });
		} else {
			push(@wheres, { "column" => "flagged", "value" => 1 });
		}
	}
	if ($deleted) {
		if ($deleted eq 1) {
			push(@wheres, { "column" => "deleted", "value" => 0 });
		} else {
			push(@wheres, { "column" => "deleted", "value" => 1 });
		}
	}
	if ($attachment) {
		if ($attachment eq 1) {
			push(@wheres, { "column" => "attach4ajx", "value" => 0 });
		} else {
			push(@wheres, { "column" => "attach4ajx", "value" => 1 });
		}
	}
	if ($toself) {
		if ($toself eq 1) {
			push(@wheres, { "column" => "to_status", "value" => 0 });
		} else {
			push(@wheres, { "column" => "to_status", "value" => 1 });
		}
	}
	if ($priority) {
		if ($priority =~ /^[1-5]$/) {
			push(@wheres, { "column" => "priority", "value" => $priority });
		}
	}

	&_set_uid_flag($session, $imaps);

	my $hit  = 0;
	my $over = 0;
	#　一時ファイルをロック
	my $lock;
	my $org_mail_permit = 0;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$org_mail_permit = 1;
		$lock = DA::OrgMail::folder_lock($session);
	}
	if (!$org_mail_permit || $lock) {
	foreach my $fid (@targets) {
		my $folder = &_fid2folder($session, $imaps, $folders, $fid);
		my $uidval = &_fid2uidval($session, $imaps, $folders, $fid);
		my $type   = &_fid2type($session, $imaps, $folders, $fid);

		if (&_is_cabinet($session, $imaps, $folder, $type)) {
			next;
		}
		next unless (&_exists($session, $imaps, $folder));
		my @fres;
		if (&lock($session, "trans.search")) {
			if (&_select($session, $imaps, $folder)) {
				my @sres;
				foreach my $w (@keywords) {
					my @wres;
					if (lc($field) eq "group") {
						if (my $res = &search_group($session, $imaps, $w)) {
							push(@wres, @{$res});
						} else {
							&_warn($session, "search_group");
							$error = &error("NOT_SEARCH", 9); last;
						}
					} else {
						if ($imaps->{imap}->{charset}) {
							my $wj  = DA::Charset::convert
										(\$w, &mailer_charset(), &search_charset());
							my $cri = "ALL ". uc($field);

							if (my $res = &_search($session, $imaps, $cri, 1, [$wj])) {
								push(@wres, @{$res});
							} else {
								&_warn($session, "_search");
								$error = &error("NOT_SEARCH", 9); last;
							}
						} else {
							if (my $res = &_simple_search($session, $imaps, $folder, $field, $w)) {
								push(@wres, @{$res});
							} else {
								&_warn($session, "_simple_search");
								$error = &error("NOT_SIMPLE_SEARCH", 9); last;
							}
						}

						if ($field =~ /^(to|cc|bcc)$/) {
							if (my $res = &search_group($session, $imaps, $w)) {
								push(@wres, @{$res});
							} else {
								&_warn($session, "search_group");
								$error = &error("NOT_SEARCH", 9); last;
							}
						}
					}

					#===========================================
					#     Custom
					#===========================================
					DA::Custom::rewrite_mail_search4ajx($session,$imaps,$field,$folder,$uidval,$fid,\$w,\@wres);
					#===========================================

					if (scalar(@wres)) {
						if ($cond eq "and") {
							if (scalar(@sres)) {
								my %tmp1; @tmp1{@sres} = undef; 
								delete @tmp1{@wres};
								my %tmp2; @tmp2{@wres} = undef;
								delete @tmp2{@sres};
								my %tmp3; @tmp3{(@sres, @wres)} = undef;
								delete @tmp3{(keys %tmp1, keys %tmp2)};
								@sres = sort {$a <=> $b} keys %tmp3;
							} else {
								@sres = @wres;
							}
						} else {
							my %tmp; @tmp{(@sres, @wres)} = undef;
							@sres = sort {$a <=> $b} keys %tmp;
						}
					} else {
						# one of the keywords returned nothing
						if ($cond eq 'and' ) {
							# That means no results; resturn an empty array
							@sres = ();
							# no need to look any further
							last; # will end: foreach my $w (@keywords)
						}
					}
				}

				unless ($error) {
					if (scalar(@sres)) {
						my $sc = {
							"folder" => $folder,
							"uidval" => $uidval,
							"output" => [qw(uid_number)],
							"where"  => \@wheres,
							"uidlst" => \@sres,
							"list"   => 1,
						};
						if (my $sel = &_select_header($session, $imaps, $sc)) {
                            my $max_hit=($imaps->{custom}->{max_search_hit})
                                ? $imaps->{custom}->{max_search_hit} : $MAX_SEARCH_HITS;
							foreach my $s (@{$sel}) {
								if ($hit >= $max_hit) {
									$over = 1; last;
								} else {
									push(@fres, $s);
									$hit ++;
								}
							}
						} else {
							&_warn($session, "_select_header");
							$error = &error("NOT_SELECT_HEADER_TABLE", 9);
						}
					}
				}
			} else {
				&_warn($session, "_select");
				$error = &error("NOT_SELECT_FOLDER", 9);
			}

			unless ($error) {
				while (scalar(@fres)) {
					my @tres = splice(@fres, 0, $MAX_HEADER_STN);
					my $sc = {
						"folder" => $folder,
						"uidval" => $uidval,
						"output" => \@SEARCH_INPUT_ITEMS,
						"uidlst" => \@tres,
						"list"   => 0
					};
					if (my $list = &_select_header($session, $imaps, $sc)) {
						if (my $flags = &open_dbm($session, "search.flags.$srid")) {
							my $items = \@SEARCH_FLAGS_ITEMS;
							foreach my $l (@{$list}) {
								&write_dbm_line($flags, "$fid\_$l->{uid_number}", $l, $items);
							}
							unless (&close_dbm($session, "search.flags.$srid", $flags)) {
								&_warn($session, "close_dbm");
								$error = &error("NOT_CLOSE_DBM", 9);
							}
						} else {
							&_warn($session, "open_dbm");
							$error = &error("NOT_OPEN_DBM", 9);
						}
						if (my $infos = &open_dbm($session, "search.infos.$srid")) {
							my $items = \@SEARCH_INFOS_ITEMS;
							foreach my $l (@{$list}) {
								$l->{srkey} = "$fid\_$l->{uid_number}";
								$l->{fid}   = $fid;
								&write_dbm_line($infos, "$fid\_$l->{uid_number}", $l, $items);
							}
							unless (&close_dbm($session, "search.infos.$srid", $infos)) {
								&_warn($session, "close_dbm");
								$error = &error("NOT_CLOSE_DBM", 9);
							}
						} else {
							&_warn($session, "open_dbm");
							$error = &error("NOT_OPEN_DBM", 9);
						}
					} else {
						&_warn($session, "_select_header");
						$error = &error("NOT_SELECT_HEADER_TABLE", 9);
					}
				}
			}

			&unlock($session, "trans.search");
		} else {
			&_warn($session, "lock");
			$error = &error("NOT_LOCK", 9);
		}

		if ($error || $over) {
			last;
		}
	}
		#　一時ファイルのロックを削除
		DA::OrgMail::folder_unlock($session, "lock.folders");
	} else {
		&_warn($session, "lock:lock.folders");
		$error = &error("NOT_LOCK_FOLDERS", 9);
	}

	if ($error) {
		$result = $error;
	} else {
		$result->{srid}   = $srid;
		$result->{target} = $target;
		$result->{total}->{messages} = $hit;
		$result->{over} = $over;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);
	
	return($result);
}

sub search_address($$$) {
    my ($session, $imaps, $c) = @_;
    my $logger = &_logger_init($session, 1);

    my $error = { "error"=> 0, "message"=>"" };
	my $data  = {};

	my $field     = $c->{field};
    my $keyword   = $c->{keyword};
    my $read_row  = $c->{read_row};
    my $start_sno = $c->{start_sno};
    my $end_sno   = $c->{end_sno};

	if (&lock($session, "trans.inc_srch", 1)) {

    my $inc_param = _get_inc_const($session, $imaps);
    my $max_cache = $inc_param->{max_cache};
    my $expire    = $inc_param->{cache_expire};

	my $sys_addr      = &get_sys_custom($session, "address");	
	my $sys_title_pos = &get_sys_custom($session, "title_pos");

	# デフォルト敬称の取得
	my $lang = &get_user_lang($session);
	my $def_title = {
		"title_set" => $imaps->{address}->{"ma_def_title_set_" . $field}
	};
	if ($def_title->{title_set} !~ /^(?:\d)+$/) {
		my $valid = DA::Address::valid_custom_title($lang);
		unless (exists $valid->{&convert_internal($def_title->{title_set})}) {
			$def_title->{title_set} = 1;
		}
	}
	if ($def_title->{title_set} eq 2 || $def_title->{title_set} eq 3) {
		# 役職 or 敬称
		$def_title->{title} = $imaps->{address}->{"ma_def_title"};
		$def_title->{title_pos} = $imaps->{address}->{"ma_def_title_pos"};
	} elsif ($def_title->{title_set} ne 1) {
		# 敬称
		$def_title->{title} = $def_title->{title_set};
		$def_title->{title_pos} = (defined $sys_title_pos->{$lang . "_title_pos"}) ?
			                         $sys_title_pos->{$lang . "_title_pos"} : 0;
	}

    # 入力チェック ------------------------------------
    if ($keyword eq '') {
        $error = &error("NO_INC_SR_KEYWORD", 1);
    } else {
        $keyword = DA::Unicode::trim($keyword, &mailer_charset());
        if ($keyword eq '') {
            $error = &error("INVALID_INC_SR_KEYWORD", 1);
        }
    }
    #-----
    my $range_set = 0;
    if ($start_sno ne '' || $end_sno ne '') {
        if ($start_sno ne '' && $start_sno!~/^\d+$/) {
            $error = &error("INVALID_INC_SR_SNO", 1);
        }
        if ($end_sno ne '' && $end_sno!~/^\d+$/) {
            $error = &error("INVALID_INC_SR_SNO", 1);
        }
        $start_sno = int($start_sno);
        $end_sno   = int($end_sno);
        if (!$start_sno) {                                      # start 指定がなかったら
            $start_sno = $end_sno - $inc_param->{read_row};     # デフォルト read_row 分
            if ($start_sno < 1) { $start_sno=1;}                # (最低は 1)
        }
        if (!$end_sno) {                                        # end 指定がない場合も
            $end_sno = $start_sno + $inc_param->{read_row};     # デフォルト read_row 分
            if ($max_cache < $end_sno) { $end_sno=$max_cache; } # (最高は max_cache)
        }
        if($end_sno < $start_sno || $max_cache < $end_sno) {
            $error = &error("INVALID_INC_SR_SNO", 1);
        }
        $range_set = 1;
    }
    #-----
    if ($read_row eq '') {
        $read_row = $inc_param->{read_row};
    } else {
        if ($range_set) {
            $error = &error("INVALID_INC_SR_PARAM", 1);
        }
        if($read_row!~/^\d+$/) {
            $error = &error("INVALID_INC_SR_READ_ROW", 1);
        }
        $read_row = int($read_row);
        if (!$read_row) {
            $error = &error("INVALID_INC_SR_READ_ROW", 1);
        }
    }
    if ($error->{error}) { &unlock($session, "trans.inc_srch"); return {error=>$error}; }

    #------------------------------------------------
    # キャッシュ判定
    my $cache = {};
    my $cache_exist = 0;
    if (&storable_exist($session, "$session->{user}\.inc_srch\.$field")) {
        if ($cache = &storable_retrieve($session, "$session->{user}\.inc_srch\.$field")) {
            # check keyword
            if (exists $cache->{$keyword}) {
                # check expire
                if ((time() < int($cache->{$keyword}->{time})+$expire) ) {
                    $cache_exist=1;
                }
            }
        } else {
            &_warn($session, "storable_retrieve");
            $error = &error("NOT_READ_INC_SRCH", 9);
        }
    }
    if ($error->{error}) { &unlock($session, "trans.inc_srch"); return {error=>$error}; }

    #------------------------------------------------
    # データ取得
    my $users = [];

    # キャッシュがあればそれを取得
    if ($cache_exist) {
        $users = $cache->{$keyword}->{users};

    # キャッシュがなければ DB 問合せ
    } else {
        my $target_total = $inc_param->{target_total};
        my $target_type = {};
        my $target_gid  = {};
        foreach my $n (1 .. $target_total) {
            $target_type->{$n} = $imaps->{mail}->{"inc_target_type_$n"};
            $target_gid->{$n}  = $imaps->{mail}->{"inc_target_gid_$n"};
        }
        my $addr_sr_flag = {};
        my $bulk_sr_flag = {};
        my $ml_sr_flag = 0;
        my $user_sr_flag = 0;
        my $group_sr_flag = 0;

        my $join = DA::IS::get_join_group($session, $session->{user});

        # 913796
        # 対象にアドレス帳が含まれる場合はオーナー関連情報をあらかじめ取得
        my $rest_conf;
        my $owner_group;
        foreach my $n (1 .. $target_total) {
            my $type = $target_type->{$n}; $type=~s/\s+//g;
            if ($type eq 'addr' || $type eq 'bulk')  {
                $rest_conf = &get_sys_custom($session, "restrict");
                $owner_group = DA::IS::get_owner_group($session, $session->{user}, 0, 12);
                last;
            }
        }

        # for_multi ---
        my $owner_group_all;
        if (DA::IS::get_multi_view_rest_type($session)) {
            $owner_group_all = DA::IS::get_owner_group($session, $session->{user}, 0, 'all');
        }
        #---

        foreach my $n (1 .. $target_total) {
            my $dat_unit={};
            my $type = $target_type->{$n}; $type=~s/\s+//g;
            my $gid  = $target_gid->{$n};  $gid =~s/\s+//g;
            if ($type !~ /^(addr|bulk|ml|user|group)$/) {next;}

            if ($type eq 'addr')  {
                if ($gid !~ /^\d{7}$/)     {next;}
                if ($addr_sr_flag->{$gid}) {next;}
                $addr_sr_flag->{$gid} = 1;
                $dat_unit = &search_addr_inc($session, $imaps, $def_title, $keyword, $gid, $rest_conf, $owner_group, 1);
            } elsif ($type eq 'bulk') {
            	if ($gid !~ /^\d{7}$/)     {next;}
                if ($bulk_sr_flag->{$gid}) {next;}
                $bulk_sr_flag->{$gid} = 1;
                $dat_unit = &search_addr_inc($session, $imaps, $def_title, $keyword, $gid, $rest_conf, $owner_group, 2);
            } elsif ($type eq 'ml') {
            	if ($ml_sr_flag) {next;}
                $ml_sr_flag = 1;
            	$dat_unit = &search_ml_inc($session, $imaps, $def_title, $keyword, $sys_addr, $owner_group_all);
            } elsif ($type eq 'user') {
                if ($user_sr_flag) {next;}
                $user_sr_flag = 1;
                $dat_unit = &search_user_inc($session, $imaps, $def_title, $keyword, $sys_addr, $owner_group_all);
            } elsif ($type eq 'group') {
                if ($group_sr_flag) {next;}
                $group_sr_flag = 1;
                $dat_unit = &search_group_inc($session, $imaps, $def_title, $keyword, $sys_addr, $owner_group_all);
            } else {
                $dat_unit={users=>[]}; # 念のため
            }
            if ($dat_unit->{error}) { # 現状 "db_select" のみ
                $error = &error("NOT_DB_INC_SRCH", 9); last;
            }

            push(@$users, @{$dat_unit->{users}});
            if ($max_cache < scalar(@$users)) { last; } # 「超える」まで実施
        }
    }
    if ($error->{error}) { &unlock($session, "trans.inc_srch"); return {error=>$error}; }

    #------------------------------------------------
    # 結果のキャッシュ
    my $org_count   = scalar(@$users);
    my $cached_count = $org_count;
    my $valid_count  = $org_count;
    my $cache_over  = 0;
    if ($max_cache < $org_count) { # 取れた数が多かった
        $cache_over = 1;
        $cached_count = 0;

        # 余分をちぎる(最大キャッシュ数を超えた部分を返すケースは無い)
        $#$users = $max_cache - 1;
        $valid_count  = $max_cache;
    }
    if (!$cache_exist) {
        if (!$cache_over) {
            $cache->{"$keyword"} = {
                'time'  => time(),
                'users' => $users,
            };
        } else {
            delete $cache->{"$keyword"};
        }
        # ついでに他の古いデータも消す
        #（都度消していればそれほど多くならないはず）
        while (my ($key, $val) = each %$cache ) {
            if (($val->{time}+$expire) <= time()) {
                delete $cache->{$key};
            }
        }
        if (&storable_store($session, $cache, "$session->{user}\.inc_srch\.$field")) {
        } else {
            &_warn($session, "storable_store");
            $error = &error("NOT_WRITE_INC_SRCH", 9);
        }
    }
    if ($error->{error}) { &unlock($session, "trans.inc_srch"); return {error=>$error}; }

    #------------------------------------------------
    # 返却準備
    my $read_count = $valid_count;

    # 範囲指定がされている場合
    if ($range_set) {
        if ($valid_count < $start_sno) { # 範囲外 = ワーニング
            $error = &error("OUT_OF_INC_RESULT", 2),
            $users = [];
            $read_count = 0;
        } else {
            # 切り出し
            my @range_users = ();
            if ($end_sno < $valid_count) {
                @range_users = @$users[$start_sno-1..$end_sno-1];
            } else {
                @range_users = @$users[$start_sno-1..$valid_count];
            }
            @$users=@range_users;
            $read_count = scalar(@$users); # 実際取れた数
        }

    # その他の場合（read_row は入力がなければデフォルトがセットされている）
    } else {
        if ($read_row < $valid_count) {
            $#$users = $read_row - 1;      # 余分をちぎる
            $read_count = scalar(@$users); # 実際取れた数
        }
        # そもそもの read_row の指定がキャッシュ最大を超えていたらワーニングもセット
        if ($max_cache < $read_row) {
            $error = &error("OVER_INC_CACHE_MAX", 2),
        }
    }
    my $count = {
        user  => $read_count,
        cache => $cached_count,
    };
 
	$data = {
        users  => $users,
        count  => $count,
        over   => ($read_count < $org_count) ? 1 : 0,
        error  => $error,
    };

	DA::Custom::rewrite_mail_search_address4ajx($session, $imaps, $c, $data);

	&unlock($session, "trans.inc_srch");

	} else {

	&_warn($session, "lock");
	$data = {
		error => &error("NOT_LOCK", 9)
	};

	}

    &_logger($session, $imaps, $logger);
    return($data);
}

sub _get_inc_const($$) {
    my ($session, $imaps) = @_;
    my $inc={};
    $inc->{max_cache} = ($imaps->{custom}->{max_incsearch_save} ne '')
        ? $imaps->{custom}->{max_incsearch_save}
        : $MAX_INCSEARCH_SAVE;
    $inc->{read_row} = ($imaps->{custom}->{max_incsearch_hits} ne '')
        ? $imaps->{custom}->{max_incsearch_hits}
        : $MAX_INCSEARCH_HITS;
    $inc->{target_total} = ($imaps->{custom}->{inc_target_total} ne '')
        ? $imaps->{custom}->{inc_target_total}
        : $INC_TARGET_TOTAL;
    $inc->{cache_expire} = ($imaps->{custom}->{inc_cache_expire} ne '')
        ? $imaps->{custom}->{inc_cache_expire}
        : $INC_CACHE_EXPIRE;
    return $inc;
}

sub _escape_keyword($) {
    my ($word) = @_;
    my $ESC_CHAR    = '$';
    my $ESC_TARGET  = '\$|\_|\%';
    my $ESC_JTARGET = '\＿|\％';
       $ESC_JTARGET = DA::Unicode::convert_from_sourcecode($ESC_JTARGET, &mailer_charset());
    if (&mailer_charset() eq "UTF-8") {
        my $ascii = $CHAR_CODE->{UTF8}->{ASCII};
        my $two   = $CHAR_CODE->{UTF8}->{TWO};
        my $three = $CHAR_CODE->{UTF8}->{THREE};
        my $four  = $CHAR_CODE->{UTF8}->{FOUR};
        $word =~s/\G((?:$ascii|$two|$three|$four)*?)($ESC_TARGET)/$1$ESC_CHAR$2/g;
        $word =~s/\G((?:$ascii|$two|$three|$four)*?)($ESC_JTARGET)/$1$ESC_CHAR$2/g;
    } else {
        my $ascii = $CHAR_CODE->{EUC}->{ASCII};
        my $two   = $CHAR_CODE->{EUC}->{TWO};
        my $three = $CHAR_CODE->{EUC}->{THREE};
        $word =~s/\G((?:$ascii|$two|$three)*?)($ESC_TARGET)/$1$ESC_CHAR$2/g;
        $word =~s/\G((?:$ascii|$two|$three)*?)($ESC_JTARGET)/$1$ESC_CHAR$2/g;
    }
    return ($word, $ESC_CHAR);
}

sub _check_ascii_only($) {
    my ($word) = @_;
    my $ascii = $CHAR_CODE->{UTF8}->{ASCII}; # EUC も実質同じ
    return ( $word=~/^(?:$ascii)*?$/ ) ? 1 : 0 ;
}

sub search_addr_inc($$$$$$$;$) {
    my ($session, $imaps, $def_title, $str, $target_gid, $rest_conf, $owner_group, $type) = @_;
	$type = 1 if(!$type);

    my $join = DA::IS::get_join_group($session, $session->{user});
    my $owner_ok = 0;
    if ($rest_conf->{ad_g_owner_view} eq 'on' && DA::IS::check_owner($session,$owner_group,$target_gid,12)) {
        $owner_ok = 1;
    }

    my $g_chk=0;
    if ($owner_ok) {
        $g_chk=0; # チェックしないのまま
    } elsif ($target_gid ne $session->{user} && $join->{$target_gid}->{attr} !~ /[12UW]/) {
        $g_chk=1;
    }

    my $space_char=DA::Unicode::convert_from_sourcecode('　', &internal_charset());
    $str = &jreplace(\$str, '　', ' ');
    my $asc_only = (&_check_ascii_only($str)) ? 1 : 0;

    my ($q_str, $esc_char) = &_escape_keyword(DA::Unicode::upper($str, &mailer_charset()));
    $q_str = "$q_str%";

    my $g_last = ($target_gid eq $DA::Vars::p->{top_gid})
                ? "p" : substr($target_gid, -1, 1);
    my $table = "is_address_". $g_last;

    my @read_col = qw(name kana alpha email keitai_mail pmail1 pmail2);
    my @sql_col  = (qw(aid title title_name title_name_pos regist_mid modify_mid), @read_col);
    my @card_col = qw(icon alt link);
    my @bind_col = qw(name kana alpha);
    if ($asc_only) {
        push(@bind_col, qw(email keitai_mail pmail1 pmail2));
    }
    my $bind_last = ($asc_only) ? 9 : 5;

    my $sql = "select ". join(',', @sql_col) . " from $table ";
    $sql .= "where gid=? and type=? and ((";
    $sql .= join(' or ', (map "(replace(upper($_),'$space_char',' ') like ? escape '$esc_char')", (@bind_col)) );
    $sql .= ")) ";
    $sql .= "order by upper(kana)";

    my $users = [];
    DA::Session::trans_init($session);
    eval {
        my $sth = &_prepare($session, $sql);
        &_bind_param($sth, 1, $target_gid, 3);
        &_bind_param($sth, 2, $type);
        for my $i (3..$bind_last) {
            &_bind_param($sth, $i, $q_str, 1);
        }
        $sth->execute();
        foreach my $l (@{&_fetchrow($sth)}) {
            if ($g_chk && ($l->{regist_mid} ne $session->{user} && 
                           $l->{modify_mid} ne $session->{user})) {
                next;
            }
            if ($l->{email} eq '' && $l->{keitai_mail} eq '' && 
                $l->{pmail1} eq '' && $l->{pmail2} eq '') {
                next;
            }
			my ($title, $title_pos, $default);
			if ($def_title->{title_set} eq 2) {
				# 役職
				if ($l->{title}) {
					$title = $l->{title};
					$title_pos = 0;
				} else {
					$default = 1;
				}
			} elsif ($def_title->{title_set} eq 3) {
				# 敬称
				if ($l->{title_name}) {
					$title = $l->{title_name};
					$title_pos = (defined $l->{title_name_pos}) ? $l->{title_name_pos} : 0;
				} else {
					$default = 1;
				}
			} elsif ($def_title->{title_set} ne 1) {
				# その他
				$default = 1;
			}
			if ($default) {
				$title = $def_title->{title};
				$title_pos = $def_title->{title_pos};
			}

			my $search_kind = $type eq '1' ? $SEARCH_KIND_ADDR : $SEARCH_KIND_BULK;
            my $aid  = $l->{aid};
            my $dat = {
                id   => "$aid\-$g_last",
                type => $search_kind,
                lang => $session->{user_lang},
                title     => $title, 
                title_pos => $title_pos
            };
            for my $col (@read_col) {
            	if ($col eq 'email' && $type eq 2) {
            		$dat->{email} = T_("$l->{email}");
            	} else {
            		$dat->{$col} = $l->{$col};	
            	}
                $dat->{$col} = DA::Unicode::trim($dat->{$col}, &mailer_charset());
                $dat->{$col} = &jreplace($dat->{$col}, '　', ' ');

                $dat->{"$col\_hit"} = ($dat->{$col}=~/$str/) ? 1 : 0;
            }
            my $card = &get_card($session, $imaps, "$aid\-$g_last", $search_kind);
            for my $col (@card_col) { $dat->{$col}=$card->{$col}, }
            if (DA::IS::get_user_lang($session) ne 'ja' && $dat->{alpha}){
            	$dat->{name} = $dat->{alpha};
            }
            push(@$users, $dat);
        }
        $sth->finish;
    };
    if (!DA::Session::exception($session)) {
        &_warn($session, "exception");
        return {error=>"db_select"};
    }
    return {users=>$users};
}
sub search_ml_inc(){
	my ($session, $imaps, $def_title, $str, $sys_addr, $owner_group_all) = @_;
    unless (ref($sys_addr) eq 'HASH' && %$sys_addr) {
        $sys_addr = &get_sys_custom($session, 'address');
    }
	my $gid_cri = "$session->{user},";
	my $join = DA::IS::get_join_group($session, $session->{user},1);
	my $cnt	= 1;
	foreach my $gid (keys %{$join}) {
    	if ($join->{$gid}->{attr} =~ /W|U|1|2/) {
			if ($cnt > 800) {
				$gid_cri.= "$gid ";
				if ($cnt ne scalar(keys %{$join})) {
					$gid_cri .= ") or gid in (";
				}
				$cnt = 1;
			} else {
				$gid_cri.="$gid,";
				$cnt++;
			}
    	}
	}	
	$gid_cri =~ s/,+$//;
	my $space_char=DA::Unicode::convert_from_sourcecode('　', &internal_charset());
    $str = jreplace(\$str, '　', ' ');
    my $asc_only = (&_check_ascii_only($str)) ? 1 : 0;
	my ($q_str, $esc_char) = &_escape_keyword(DA::Unicode::upper($str, &mailer_charset()));
    $q_str = "$q_str%";
    my $table = DA::IS::get_member_table($session);   
	my @card_col = qw(icon alt link);
	my @bind_col = qw(ml.list_name ml.list_name_kana);
	my $bind_last = scalar(@bind_col);
	my $sql_where = "(ml.list in (SELECT distinct list FROM is_ml_group ".
					"WHERE gid in ($gid_cri)) OR ml.post_from in ('any','own'))";
    my $sql = "SELECT ml.list, ml.list_name, m.mid ".
    		"FROM $table m RIGHT JOIN is_mailist ml ON m.mid=ml.mid WHERE (";
    $sql .= join(' or ',(map "(replace(upper($_),'$space_char',' ') like ? escape '$esc_char')", (@bind_col)) );
    $sql .= ") AND $sql_where ";
    my $users = [];
    DA::Session::trans_init($session);
    eval {
        my $sth = &_prepare($session, $sql);
        for my $i (1..$bind_last) {
            &_bind_param($sth, $i, $q_str, 1);
        }
        $sth->execute();
        foreach my $l (@{&_fetchrow($sth)}) {
        	my $list = $l->{list};
			my $title = $def_title->{title_pos};
			my $title_pos = $def_title->{title_pos};
			my $email = "$list\@$DA::Vars::p->{mail_domain}";
            my $dat = {
                id   => $list,
                type => $SEARCH_KIND_ML,
                lang => $session->{user_lang},
                title     => '', 
                title_pos => $title_pos, 
                email => $email,
                name => $l->{list_name},
            };
            my @read_col = qw(name email);
            for my $col (@read_col) {
                $dat->{$col} = DA::Unicode::trim($dat->{$col}, &mailer_charset());
                $dat->{$col} = &jreplace($dat->{$col}, '　', ' ');
                $dat->{"$col\_hit"} = ($dat->{$col}=~/$str/) ? 1 : 0;
            }
            $dat->{name} = DA::Unicode::trim($dat->{name}, &mailer_charset());
            $dat->{name} = &jreplace($dat->{name}, '　', ' ');
            $dat->{"name\_hit"} = ($dat->{name}=~/$str/) ? 1 : 0;
            my $card = &get_card($session, $imaps, $list, $SEARCH_KIND_ML);
            for my $col (@card_col) { $dat->{$col}=$card->{$col}, }
            push(@$users, $dat);
        }
        $sth->finish;
    };
    if (!DA::Session::exception($session)) {
        &_warn($session, "exception");
        return {error=>"db_select"};
    }
    return {users=>$users};
}

#------------------------------------------------------
sub search_user_inc($$$$;$) {
    my ($session, $imaps, $def_title, $str, $sys_addr, $owner_group_all) = @_;
    unless (ref($sys_addr) eq 'HASH' && %$sys_addr) {
        $sys_addr = &get_sys_custom($session, 'address');
    }
    my $join = DA::IS::get_join_group($session, $session->{user});

    my $space_char=DA::Unicode::convert_from_sourcecode('　', &internal_charset());
    $str = jreplace(\$str, '　', ' ');
    my $asc_only = (&_check_ascii_only($str)) ? 1 : 0;

    my ($q_str, $esc_char) = &_escape_keyword(DA::Unicode::upper($str, &mailer_charset()));
    $q_str = "$q_str%";

    my $table = DA::IS::get_member_table($session);
    my @read_col = qw(name kana alpha email keitai_mail pmail1 pmail2);

    my @sql_col  = (qw(mid title title_name title_name_pos primary_gid primary_gname), @read_col);
    my @card_col = qw(icon alt link);

    my @bind_col = qw(name kana alpha);
    if ($asc_only) {
        push(@bind_col, 'email');
        foreach my $col (qw(keitai_mail pmail1 pmail2)) {
            if ($sys_addr->{$col} ne 'off') { push(@bind_col, $col); }
        }
    }
    my $bind_last = scalar(@bind_col);

    my $sql = "select ". join(',', @sql_col) . " from $table ";
    $sql .= "where (type in (1,3) and (";
    $sql .= join(' or ', (map "(replace(upper($_),'$space_char',' ') like ? escape '$esc_char')", (@bind_col)) );
    $sql .= ")) ";
    $sql .= "order by type, sort_level, upper(kana)";

    my $users = [];
    DA::Session::trans_init($session);
    eval {
        my $sth = &_prepare($session, $sql);
        for my $i (1..$bind_last) {
            &_bind_param($sth, $i, $q_str, 1);
        }
        $sth->execute();
        foreach my $l (@{&_fetchrow($sth)}) {

            # for_multi ---
            if (DA::IS::get_multi_view_rest_type($session)) {
                if (!DA::IS::is_permit_member($session, 'ajxmailer', $l->{mid}, $join,
                                             {call_mode=>'inc_search',owner_func=>'all'}, $owner_group_all)) {
                    next;
                }
            }
            #---
                        DA::Custom::override_custom_address($session,$sys_addr,$l->{mid}); 
			my ($title, $title_pos, $default);
			if ($def_title->{title_set} eq 2) {
				# 役職
				if ($sys_addr->{title} ne "off") {
					if ($l->{title}) {
						$title = $l->{title};
						$title_pos = 0;
					} else {
						$default = 1;
					}
				}
			} elsif ($def_title->{title_set} eq 3) {
				if ($sys_addr->{title_name} ne "off") {
					# 敬称
					if ($l->{title_name}) {
						$title = $l->{title_name};
						$title_pos = (defined $l->{title_name_pos}) ? $l->{title_name_pos} : 0;
					} else {
						$default = 1;
					}
				}
			} elsif ($def_title->{title_set} ne 1) {
				# その他
				$default = 1;
			}
			if ($default) {
				$title = $def_title->{title};
				$title_pos = $def_title->{title_pos};
			}

            my $mid = $l->{mid};
            my $dat = {
                id   => $mid,
                type => $SEARCH_KIND_USER,
                lang => $session->{user_lang},
                title     => $title, 
                title_pos => $title_pos, 
                gid       => $l->{primary_gid},
                gname     => $l->{primary_gname}
            };
            for my $col (@read_col) {
                if ($sys_addr->{$col} eq 'off') {
                    $dat->{$col}        = '';
                    $dat->{"$col\_hit"} = 0;
                } else {
                    $dat->{$col} = $l->{$col};
                    $dat->{$col} = DA::Unicode::trim($dat->{$col}, &mailer_charset());
                    $dat->{$col} = &jreplace($dat->{$col}, '　', ' ');
                    $dat->{"$col\_hit"} = ($dat->{$col}=~/$str/) ? 1 : 0;
                }
            }
            my $card = &get_card($session, $imaps, $mid, $SEARCH_KIND_USER);
            for my $col (@card_col) { $dat->{$col}=$card->{$col}, }
            push(@$users, $dat);
        }
        $sth->finish;
    };
    if (!DA::Session::exception($session)) {
        &_warn($session, "exception");
        return {error=>"db_select"};
    }
    return {users=>$users};
}

#------------------------------------------------------
sub search_group_inc($$$$;$) {
    my ($session, $imaps, $def_title, $str, $sys_addr, $owner_group_all) = @_;
    unless (ref($sys_addr) eq 'HASH' && %$sys_addr) {
        $sys_addr = &get_sys_custom($session, 'address');
    }
    my $join = DA::IS::get_join_group($session, $session->{user});

    my $space_char=DA::Unicode::convert_from_sourcecode('　', &internal_charset());
    $str = jreplace(\$str, '　', ' ');
    my $asc_only = (&_check_ascii_only($str)) ? 1 : 0;

    my ($q_str, $esc_char)=&_escape_keyword(DA::Unicode::upper($str, &mailer_charset()));
    $q_str = "$q_str%";

    my $table = DA::IS::get_group_table($session);
    my @read_col = qw(name kana alpha);
    my @sql_col  = (qw(gid), @read_col);
    my @card_col = qw(icon alt link);
    my @bind_col = qw(name kana alpha);
    my $bind_last = scalar(@bind_col);

    my $sql = "select ". join(',', @sql_col) . " from $table ";
    $sql .= "where (";
    $sql .= join(' or ',(map "(replace(upper($_),'$space_char',' ') like ? escape '$esc_char')", (@bind_col)) );
    $sql .= ") ";
    $sql .= "order by type, sort_level, upper(kana)";

    my $users = [];
    DA::Session::trans_init($session);
    eval {
        my $sth = &_prepare($session, $sql);
        for my $i (1..$bind_last) {
            &_bind_param($sth, $i, $q_str, 1);
        }
        $sth->execute();
        foreach my $l (@{&_fetchrow($sth)}) {
            my $gid = $l->{gid};
            my $dat = {
                id   => $gid,
                type => $SEARCH_KIND_GROUP,
                lang => $session->{user_lang},
            };

			if ($DA::Vars::p->{top_gid} < $gid && $gid <= 2000010) {
				next;
			}

            # for_multi ---
            if (DA::IS::get_multi_view_rest_type($session)) {
                if (!DA::IS::is_permit_group($session, 'ajxmailer', $gid, $join,
                                             {call_mode=>'inc_search', owner_func=>'all'}, $owner_group_all)) {
                    next;
                }
            }
            #---
            DA::Custom::override_custom_address($session,$sys_addr,$gid); 
            for my $col (@read_col) {
                if ($sys_addr->{$col} eq 'off') {
                    $dat->{$col}        = '';
                    $dat->{"$col\_hit"} = 0;
                } else {
                    $dat->{$col} = $l->{$col};
                    $dat->{$col} = DA::Unicode::trim($dat->{$col}, &mailer_charset());
                    $dat->{$col} = &jreplace($dat->{$col}, '　', ' ');

                    $dat->{"$col\_hit"} = ($dat->{$col}=~/$str/) ? 1 : 0;
                }
            }
            my $card = &get_card($session, $imaps, $gid, $SEARCH_KIND_GROUP);
            for my $col (@card_col) { $dat->{$col}=$card->{$col}, }
            push(@$users, $dat);
        }
        $sth->finish;
    };
    if (!DA::Session::exception($session)) {
        &_warn($session, "exception");
        return {error=>"db_select"};
    }
    return {users=>$users};
}

sub isearch_cache_clear($) {
	my ($session) = @_;

	&storable_clear($session, "$session->{user}\.inc_srch\.to");
	&storable_clear($session, "$session->{user}\.inc_srch\.cc");
	&storable_clear($session, "$session->{user}\.inc_srch\.bcc");

	return(1);
}

sub flag($$$$) {
	my ($session, $imaps, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) =~ /^($TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) {
		return(&flag_local($session, $imaps, $folders, $c));
	} elsif (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&flag_join($session, $imaps, $folders, $c));
	} else {
		return(&flag_server($session, $imaps, $folders, $c));
	}
}

sub flag_server($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $folder = &_fid2folder($session, $imaps, $folders, $fid);
	my $uidval = &_fid2uidval($session, $imaps, $folders, $fid);
	my $result = {};
	my $error;

	&_set_uid_flag($session, $imaps);

	my $sc = {
		"folder" => $folder,
		"uidval" => $uidval,
		"uidlst" => [$uid],
		"output" => [qw(seen flagged deleted replied forwarded mdn to_status attach4ajx)],
	};
	if (my $flag = &_select_header($session, $imaps, $sc)) {
		$result->{flag} = shift @{$flag};
	} else {
		&_warn($session, "_select_header");
		$error = &error("NOT_SELECT_HEADER_TABLE", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub flag_local($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $result = {
		"flag" => {
			"seen"      => 1,
			"flagged"   => 0,
			"deleted"   => 0,
			"replied"   => 0,
			"forwarded" => 0,
			"mdn"       => 0,
			"to_status" => 0
		}
	};

	&_logger($session, $imaps, $logger);

	return($result);
}

sub flag_join($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $result = {
		"flag" => {
			"seen"      => 0,
			"flagged"   => 0,
			"deleted"   => 0,
			"replied"   => 0,
			"forwarded" => 0,
			"mdn"       => 0,
			"to_status" => 0
		}
	};

	&_logger($session, $imaps, $logger);

	return($result);
}

sub header($$$$) {
	my ($session, $imaps, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) =~ /^($TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) {
		return(&header_local($session, $imaps, $folders, $c));
	} elsif (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&header_join($session, $imaps, $folders, $c));
	} else {
		return(&header_server($session, $imaps, $folders, $c));
	}
}

sub header_server($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $folder = &_fid2folder($session, $imaps, $folders, $fid);
	my $result = {};
	my $error;

	&_set_uid_flag($session, $imaps);

	if (-f &cachefile($session, "$fid\.$uid\.header")) {
		if (my $header = &read_cache($session, "$fid\.$uid\.header")) {
			$result->{header} = $header;
		} else {
			&_warn($session, "read_cache");
			$error = &error("NOT_READ_HEADER", 9);
		}
	} else {
		if (&_examine($session, $imaps, $folder)) {
			my $header = &_header($session, $imaps, $uid);
			if ($header->{$uid} ne "") {
				if (&write_cache($session, "$fid\.$uid\.header", $header->{$uid})) {
					$result->{header} = $header->{$uid};
				} else {
					&_warn($session, "_write_cache");
					$error = &error("NOT_WRITE_HEADER", 9);
				}
			} else {
				&_warn($session, "_header");
				$error = &error("NOT_GET_HEADER", 9);
			}
		} else {
			&_warn($session, "_examine");
			$error = &error("NOT_EXAMINE_FOLDER", 9);
		}
	}

	if ($error) {
		$result = $error;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub header_local($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $backup_maid = $c->{backup_maid};
	my $type   = &_fid2type($session, $imaps, $folders, $fid);
	my $target = &is_backup($session, $imaps, $type) ? "backup" : "sent";
	my $result = {};
	my $error;

    #back up の場合にキャッシュファイルをクリアー
    if($target eq 'backup' && $backup_maid =~ /^\d{1,}$/) {
    	#backup use backup_maid as uid
    	$uid = $backup_maid;
    	if (-f &cachefile($session, "$fid\.$uid\.header")) {
    		&clear_cache($session, "$fid\.$uid\.header");
    	}
    }

	if (-f &cachefile($session, "$fid\.$uid\.header")){
		if (my $header = &read_cache($session, "$fid\.$uid\.header")) {
			$result->{header} = $header;
		} else {
			&_warn($session, "read_cache");
			$error = &error("NOT_READ_HEADER", 9);
		}
	} else {
		if (my $header = &_header_local($session, $imaps, $uid, $target)) {
			if (&write_cache($session, "$fid\.$uid\.header", $header->{$uid})) {
				$result->{header} = $header->{$uid};
			} else {
				&_warn($session, "_write_cache");
				$error = &error("NOT_WRITE_HEADER", 9);
			}
		} else {
			&_warn($session, "_header");
			$error = &error("NOT_GET_HEADER", 9);
		}
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub header_join($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $result = {};
	my $error;

	if (-f &cachefile($session, "$fid\.$uid\.header")) {
		if (my $header = &read_cache($session, "$fid\.$uid\.header")) {
			$result->{header} = $header;
		} else {
			&_warn($session, "read_cache");
			$error = &error("NOT_READ_HEADER", 9);
		}
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub rfc822($$$$) {
	my ($session, $imaps, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) =~ /^($TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) {
		return(&rfc822_local($session, $imaps, $folders, $c));
	} elsif (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&rfc822_join($session, $imaps, $folders, $c));
	} else {
		return(&rfc822_server($session, $imaps, $folders, $c));
	}
}

sub rfc822_server($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $folder = &_fid2folder($session, $imaps, $folders, $fid);
	my $result = {};
	my $error;

	&_set_uid_flag($session, $imaps);

	if (-f &cachefile($session, "$fid\.$uid\.rfc822")) {
		if (my $rfc822 = &read_cache($session, "$fid\.$uid\.rfc822")) {
			$result->{rfc822} = $rfc822;
		} else {
			&_warn($session, "read_cache");
			$error = &error("NOT_READ_RFC822", 9);
		}
	} else {
		if (&_examine($session, $imaps, $folder)) {
			my $rfc822 = &_rfc822($session, $imaps, $uid);
			if ($rfc822->{$uid} ne "") {
				if (&write_cache($session, "$fid\.$uid\.rfc822", $rfc822->{$uid})) {
					$result->{rfc822} = $rfc822->{$uid};
				} else {
					&_warn($session, "_write_cache");
					$error = &error("NOT_WRITE_RFC822", 9);
				}
			} else {
				&_warn($session, "_rfc822");
				$error = &error("NOT_GET_RFC822", 9);
			}
		} else {
			&_warn($session, "_examine");
			$error = &error("NOT_EXAMINE_FOLDER", 9);
		}
	}

	if ($error) {
		$result = $error;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub rfc822_local($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $backup_maid = $c->{backup_maid};
	my $type   = &_fid2type($session, $imaps, $folders, $fid);
	my $target = &is_backup($session, $imaps, $type) ? "backup" : "sent";
	my $result = {};
	my $error;
    
    #back up の場合にキャッシュファイルをクリアー
    if($target eq 'backup' && $backup_maid =~ /^\d{1,}$/) {
    	#backup use backup_maid as uid
    	$uid = $backup_maid;
    	if (-f &cachefile($session, "$fid\.$uid\.rfc822")) {
    		&clear_cache($session, "$fid\.$uid\.rfc822");
    	}
    }

	if (-f &cachefile($session, "$fid\.$uid\.rfc822")) {
		if (my $rfc822 = &read_cache($session, "$fid\.$uid\.rfc822")) {
			$result->{rfc822} = $rfc822;
		} else {
			&_warn($session, "read_cache");
			$error = &error("NOT_READ_RFC822", 9);
		}
	} else {
		if (my $rfc822 = &_rfc822_local($session, $imaps, $uid, $target)) {
			if (&write_cache($session, "$fid\.$uid\.rfc822", $rfc822->{$uid})) {
				$result->{rfc822} = $rfc822->{$uid};
			} else {
				&_warn($session, "_write_cache");
				$error = &error("NOT_WRITE_RFC822", 9);
			}	
		} else {
			&_warn($session, "_rfc822");
			$error = &error("NOT_GET_RFC822", 9);
		}
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub rfc822_join($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $result = {};
	my $error;

	if (-f &cachefile($session, "$fid\.$uid\.rfc822")) {
		if (my $rfc822 = &read_cache($session, "$fid\.$uid\.rfc822")) {
			$result->{rfc822} = $rfc822;
		} else {
			&_warn($session, "read_cache");
			$error = &error("NOT_READ_RFC822", 9);
		}
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub detail($$$$) {
	my ($session, $imaps, $folders, $c) = @_;

	if (&_fid2custom($session, $imaps, $folders, $c->{fid})) {
		return(DA::Custom::ajxmailer_detail($session, $imaps, $folders, $c));
	} else {
		return(&detail_common($session, $imaps, $folders, $c));
	}
}

sub detail_common($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session);
	my $module = DA::IS::get_module($session);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $srid   = $c->{srid};
	my $backup_maid = $c->{backup_maid};
	my $type   = &_fid2type($session, $imaps, $folders, $fid);
	my $result = {};
	my $error;


	&_set_uid_flag($session, $imaps);

	my $lock_result ;
	if(&is_backup($session,$imaps,$type) && $backup_maid =~ /^\d{1,}$/) {
		#backup use backup_maid as uid
		$uid = $backup_maid;
	}

	if (&lock($session, "detail\.$fid\.$uid")) {
		#backup folderの場合cache fileをクリアー　	
		if(&is_backup($session,$imaps,$type)) {
			if (&storable_exist($session, "$fid\.$uid\.detail")) {
				&storable_clear($session, "$fid\.$uid\.detail");
			}
		}	
		if (&storable_exist($session, "$fid\.$uid\.detail")) {
			if (my $detail = &storable_retrieve($session, "$fid\.$uid\.detail")) {
				$result->{sendtype} = ($type =~ /^($TYPE_SENT|$TYPE_DRAFT)$/) ? 1 : 0;
				$result->{detail} = $detail;
			} else {
				&_warn($session, "storable_retrieve");
				$error = &error("NOT_READ_DETAIL", 9);
			}
		} else {
			if ($type =~ /(?:$TYPE_INBOX|$TYPE_TRASH|$TYPE_SPAM|$TYPE_DEFAULT|$TYPE_MAILBOX)/) {
				my $folder = _fid2folder($session, $imaps, $folders, $fid);
				if ($imaps->{system}->{max_recv_size}) {
					if (&_examine($session, $imaps, $folder)) {
						if (my $size = &_size($session, $imaps, $uid)) {
							if ($imaps->{system}->{max_recv_size} < $size) {
								&_warn($session, "recv size over");
								$error = &error("OVER_RECV_SIZE", 9);
							}
						} else {
							&_warn($session, "_size");
							$error = &error("NOT_GET_SIZE", 9);
						}
					} else {
						&_warn($session, "_examine");
						$error = &error("NOT_EXAMINE_FOLDER", 9);
					}
				}
			}
			my ($header, $rfc822);
			unless ($error) {

				my $rh = &header($session, $imaps, $folders, $c);
				my $rr = &rfc822($session, $imaps, $folders, $c);

				if ($rh->{error}) {
					&_warn($session, "header");
					$error = $rh;
				} else {
					$header = $rh->{header};
				}

				if ($rr->{error}) {
					&_warn($session, "rfc822");
					$error = $rr;
				} else {
					$rfc822 = $rr->{rfc822};
				}
			}
			# ヘッダの解析
			my $detail = {};
			my $group  = {};
			unless ($error) {
				my %header;

				DA::MailParser::header_parse(\$header, \%header, &mailer_charset());
				if ($header{err_code}) {
					&_warn($session, "header_parse");
					$error = &error("NOT_PARSE_HEADER", 9);
				} else {
					# アドレス
					my $unescape = 1;
					if ($imaps->{custom}->{base64_no_escape} eq 'on') {
						if ($header{header_all} =~/INSUITE Enterprise ([\d\.]+) AjaxMailer/) {
							my ($v1,$v2,$v3,$v4) = split(/\./,$1);
							if ($v4!~/^\d+$/) {$v4=0;}
							my $version = sprintf("%02d%02d%02d%02d",$v1,$v2,$v3,$v4);
							if ($version ge '03040300') {
								$unescape = 0;
							}
						} else {
							$unescape = 0;
						}
					}

					foreach my $f (qw(from send to cc bcc reply notification)) {
						my $key_n = $f . "_name";
						my $key_a = $f . "_addr";
						my ($users, @list);

						if ($f =~ /^(to|cc|bcc|from)$/) {
							$users = DA::Mailer::parse_data_field($header{"X_User_" . ucfirst($f)});
						}

						my $i = 0;
						while (scalar(@{$header{$key_n}}) || scalar(@{$header{$key_a}})) {
							my ($name, $addr);
							if (scalar(@{$header{$key_n}})) {
								$name = shift @{$header{$key_n}};
							}
							if (scalar(@{$header{$key_a}})) {
								$addr = shift @{$header{$key_a}};
							}
							if ($addr eq "") {
								next;
							}
							if ($name eq $addr) {
								$name = "";
								if ($addr =~ /^(recipient\s*list\s*not\s*shown:\s*;|undisclosed-recipients:\s*;|undisclosed\srecipients:\s*;)$/i) {
									next;
								}
							}

							if (DA::CGIdef::iskanji($name, &mailer_charset())) {
								if ($unescape) {
									$name = DA::Mailer::unescape_mail_name($name);
								}
							} else {
								$name = DA::Mailer::unescape_mail_name($name);
							}
						
							my ($id, $type) = &_parse_uid($users->{$i++});
							if (my $card = &get_card($session, $imaps, $id, $type, $name, $addr)) {
								push(@list, $card);
							} else {
								next;
							}
						}

						$detail->{$f} = \@list;
					}

					$detail->{original} = {
						"To"       => &_header2to($header),
						"Cc"       => &_header2cc($header),
						"Bcc"      => &_header2bcc($header),
						"From"     => &_header2from($header),
						"Reply-To" => &_header2reply_to($header),
						"Date"     => &_header2date($header),
						"Subject"  => $header{subject}
					};

					# グループ
					unless ($header{X_Group_To}) {
						$header{X_Group_To} = $header{X_Group};
					}

					foreach my $f (qw(to cc bcc)) {
						my $key_g = "X_Group_" . ucfirst($f);
						my $value = $header{$key_g};
						   $value =~s/[\r\n\s\t]//g;
						my $type  = 2;
						foreach my $id (split(/\,/, $value)) {
							if (my $card = &get_card($session, $imaps, $id, $type)) {
								push(@{$detail->{$f}}, $card);
								push(@{$group->{$f}}, $id);
							} else {
								next;
							}
						}
					}

					# ステータス
					$detail->{status} = &_parse_status($header{X_Status});

					# その他フィールド
					$detail->{message_id} = &_array2line($header{message_id})
				                     || $header{references}[-1];
					$detail->{references} = &_array2line($header{references});
					$detail->{in_reply_to}= &_array2line($header{reply_id});
					$detail->{mailer}     = &_header2mailer($header);
					$detail->{priority}   = &_header2priority($header);
					$detail->{date}       = $header{date_time};
					$detail->{subject}    = $header{subject};

					# メール番号
					$detail->{fid} = $fid;
					$detail->{uid} = $uid;

                    # 予約フラグ
                    if ($type =~ /^($TYPE_INBOX|$TYPE_DRAFT|$TYPE_SENT|$TYPE_TRASH|$TYPE_SPAM|$TYPE_DEFAULT|$TYPE_MAILBOX)$/) {
                        my $folder = &_fid2folder($session, $imaps, $folders, $fid);
                        my $uidval = &_fid2uidval($session, $imaps, $folders, $fid);
                        my $sc = {
                                "folder" => $folder,
                                "uidval" => $uidval,
                                "uidlst" => [$uid],
                                "output" => [qw(reserve1 reserve2)]
                        };
                        if (my $flag = &_select_header($session, $imaps, $sc)) {
                            my $f = shift @{$flag};
                            $detail->{reserve1} = $f->{reserve1};
                            $detail->{reserve2} = $f->{reserve2};
                        } else {
                            &_warn($session, "_select_header");
                            $error = &error("NOT_SELECT_HEADER_TABLE", 9);
                        }
                    }
				}

				#===========================================
				#     Custom
				#===========================================
				DA::Custom::rewrite_mail_header_detail4ajx($session,$imaps,$folders,\$detail);
				#===========================================

			}

			# 本文の解析
			unless ($error) {
				my $gid =(DA::OrgMail::check_org_mail_permit($session))?DA::OrgMail::get_gid($session):$session->{user};
				my $tmppath = "$session->{temp_dir}/$session->{sid}.$gid.AjaxMailer.tmp."
			            	. "$c->{fid}\-$c->{uid}";
			
				my $pc      = {
					"fid"        => $fid,
					"uid"        => $uid,
					"textsize"   => ($type =~ /^($TYPE_SENT|$TYPE_DRAFT)$/) ? 0 : 1,
					"attachment" => &get_sys_custom($session, 'attachment', '1'),
					"icons"      => DA::IS::get_icon_data(),
					"folder_type" => $type
				};
				my $oplog = {
					"app"    => "mail",
					"docid"  => "ajax/detail/$session->{user}/$fid/$uid",
					"type"   => "MD",
					"detail" => {
						"To"         => &convert_internal($detail->{original}->{To}),
						"Cc"         => &convert_internal($detail->{original}->{Cc}),
						"Bcc"        => &convert_internal($detail->{original}->{Bcc}),
						"From"       => &convert_internal($detail->{original}->{From}),
						"Date"       => &convert_internal($detail->{original}->{Date}),
						"Subject"    => &convert_internal($detail->{original}->{Subject}),
						"Message-Id" => &convert_internal($detail->{message_id})
					}
				};
				if(DA::OrgMail::use_org_mail($session)){
					my $gid = DA::OrgMail::get_gid($session);
					$oplog->{type} = "MDO";
					$oplog->{detail}->{gid} = $gid;
				}
				DA::OperationLog::log($session, $oplog);
				$error = &_parse_rfc822($session, $imaps, $pc, $module, $rfc822, $tmppath, $detail);
			}

			# グループ記載チェック
			unless ($error) {
				my $gname = &_gname($session, $imaps, $group);
				   $gname =~s/\r\n/\n/g;
				   $gname =~s/\n+$//g;
				my $text  = $gname;
				my $html  = &_text2html($gname, &mailer_charset());

				if ($gname ne "") {
					if ($detail->{body}->{html} =~ /\<body\>[\r\n]\Q$html\E/) {
						$detail->{status}->{group_name} = 1;
					} elsif ($detail->{body}->{text} =~ /^\Q$text\E/) {
						$detail->{status}->{group_name} = 1;
					}
				}
			}
	
			#backup時の組織メール
			if(&is_backup($session,$imaps,$type)) {
				my $back_dir = &infobase($session,'backup'); 
				my $back_org_dir = "$back_dir/org_info";
				my $org_ma_info="$back_org_dir/$c->{uid}.org_mail";
	        	if (-f $org_ma_info) {
		        	my $org_mail={};
		    		DA::System::file_open(\*IN,"$org_ma_info");
					while (my $line=<IN>) {
						chomp($line);
						my ($key,$val)=split(/\=/,$line,2);
						$org_mail->{$key}=$val;
					}
		        	close(IN);

					# 差出人を書き換える
		        	if ($org_mail->{mode}) {
						my $master=DA::OrgMail::get_org_mail_data($session,$org_mail->{gid});
		            	undef $result->{mail}->{from};
		            	$master->{mail_name}=DA::Charset::convert(\$master->{mail_name},
		                	DA::Unicode::internal_charset(),DA::Ajax::Mailer::mailer_charset());
		            	$detail->{from}[0]->{stype} = '';
						$detail->{from}[0]->{title} = '';
						$detail->{from}[0]->{lang} = '';
						$detail->{from}[0]->{title_pos} = '';
						$detail->{from}[0]->{icon} = '/images/ja/ico_fc_userx.gif';
						$detail->{from}[0]->{alt} = '';
						$detail->{from}[0]->{external} = 0;
						$detail->{from}[0]->{id} = '';
						$detail->{from}[0]->{type} = '';
						$detail->{from}[0]->{link} = '';
						$detail->{from}[0]->{name} = $master->{mail_name};
						$detail->{from}[0]->{email} = $master->{send_address};
						$detail->{from}[0]->{regist} = ($detail->{from}[0]->{email}) ?
		            	   "javascript:DA.ug.openAddrRegist('"
		            	.  unpack("H*", $detail->{from}[0]->{name})
		            	. "', '"
		            	.  unpack("H*", $detail->{from}[0]->{email})
		            	. "');" : "";
					}
	
				}
			}
			# キャッシュの保存
			unless ($error) {
				if ( &storable_store($session, $detail, "$fid\.$uid\.detail")) {
					$result->{sendtype} = ($type =~ /^($TYPE_SENT|$TYPE_DRAFT)$/) ? 1 : 0;
					$result->{detail}   = $detail;
				} else {
					&_warn($session, "_storable_store");
					$error = &error("NOT_WRITE_DETAIL", 9);
				}
			}
		}

    	# 開封確認チェック
    	if ($DA::Vars::p->{ma_open_status} eq "on") {
        	DA::Mail::update_open_status_db($session, $result->{detail}->{message_id});
    	}
	
		&unlock($session, "detail\.$fid\.$uid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}
	#=====================================================
	#           ----custom----
	#=====================================================
	DA::Custom::check_message_details($session, $imaps, $folders, $c, $result);
	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);
	return($result);
}

sub prev_uid($$$$) {
	my ($session, $imaps, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) =~ /^($TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) {
		return(&prev_uid_common($session, $imaps, $folders, $c));
	} elsif ($c->{srid}) {
		return(&prev_uid_search($session, $imaps, $folders, $c));
	} else {
		return(&prev_uid_common($session, $imaps, $folders, $c));
	}
}

sub prev_uid_common($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $result = {};
	my $error;

	if (my $uidlst = &storable_retrieve($session, "$fid\.headers.uidlst")) {
		my ($prev, $tmp, $sno);
		foreach my $u (@{$uidlst}) {
			$sno ++;
			if ($u eq $uid) {
				if ($tmp) {
					$prev = $tmp;
				} else {
					$error = &error("NOT_EXISTS_PREV_UID", 9);
				}
				last;
			} else {
				$tmp = $u;
			}
		}
		if ($prev) {
			$result->{sno} = $sno - 1;
			$result->{fid} = $fid;
			$result->{uid} = $prev;
		} else {
			$error = &error("NOT_FOUND_PREV_UID", 9);
		}
	} else {
		&_warn($session, "storable_retrieve");
		$error = &error("NOT_READ_HEADERS_UIDLST", 9);
	}

    if ($error) {
        $result = $error;
    }

	&_logger($session, $imaps, $logger);

	return($result);
}

sub prev_uid_search($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $srid   = $c->{srid};
	my $result = {};
	my $error;

	if (my $uidlst = &storable_retrieve($session, "search.headers.uidlst.$srid")) {
		my ($prev, $tmp, $sno);
		foreach my $u (@{$uidlst}) {
			$sno ++;
			if ($u eq "$fid\_$uid") {
				if ($tmp) {
					$prev = $tmp;
				} else {
					$error = &error("NOT_EXISTS_PREV_UID", 9);
				}
				last;
			} else {
				$tmp = $u;
			}
		}
		if ($prev) {
			$result->{sno} = $sno - 1;
			$result->{fid} = (split(/\_/, $prev))[0];
			$result->{uid} = (split(/\_/, $prev))[1];
		} else {
			$error = &error("NOT_FOUND_PREV_UID", 9);
		}
	} else {
		&_warn($session, "storable_retrieve");
		$error = &error("NOT_READ_HEADERS_UIDLST", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub next_uid($$$$) {
	my ($session, $imaps, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) =~ /^($TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) {
		return(&next_uid_common($session, $imaps, $folders, $c));
	} elsif ($c->{srid}) {
		return(&next_uid_search($session, $imaps, $folders, $c));
	} else {
		return(&next_uid_common($session, $imaps, $folders, $c));
	}
}

sub next_uid_common($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $result = {};
	my $error;

	if (my $uidlst = &storable_retrieve($session, "$fid\.headers.uidlst")) {
		my ($next, $tmp, $sno);
		foreach my $u (@{$uidlst}) {
			$sno ++;
			if ($u eq $uid) {
				$tmp = $u;
			} elsif ($tmp) {
				$next = $u; last;
			}
		}
		if ($next) {
			$result->{sno} = $sno;
			$result->{fid} = $fid;
			$result->{uid} = $next;
		} else {
			if ($tmp) {
				$error = &error("NOT_EXISTS_NEXT_UID", 9);
			} else {
				$error = &error("NOT_FOUND_NEXT_UID", 9);
			}
		}
	} else {
		&_warn($session, "storable_retrieve");
		$error = &error("NOT_READ_HEADERS_UIDLST", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub next_uid_search($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $srid   = $c->{srid};
	my $result = {};
	my $error;

	if (my $uidlst = &storable_retrieve($session, "search.headers.uidlst.$srid")) {
		my ($next, $tmp, $sno);
		foreach my $u (@{$uidlst}) {
			$sno ++;
			if ($u eq "$fid\_$uid") {
				$tmp = $u;
			} elsif ($tmp) {
				$next = $u; last;
			}
		}
		if ($next) {
			$result->{sno} = $sno;
			$result->{fid} = (split(/\_/, $next))[0];
			$result->{uid} = (split(/\_/, $next))[1];
		} else {
			if ($tmp) {
				$error = &error("NOT_EXISTS_NEXT_UID", 9);
			} else {
				$error = &error("NOT_FOUND_NEXT_UID", 9);
			}
		}
	} else {
		&_warn($session, "storable_retrieve");
		$error = &error("NOT_READ_HEADERS_UIDLST", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub create_folder($$$$$$) {
	my ($session, $imaps, $folders, $fid, $name, $type) = @_;
	DA::Custom::create_mail_folder4ajx($session, $imaps, $folders, $fid, $name, $type);
	my $logger    = &_logger_init($session);
	my $folder    = &_fid2folder($session, $imaps, $folders, $fid);
	my $utf7      = &_utf7_encode($session, $imaps, $name);
	my $separator = $imaps->{imap}->{separator};
    my $parent    = $folder;
	if (defined $folder) {
		if ($folder eq "") {
			$folder = &_utf7_encode($session, $imaps, $name);
		} else {
			$folder = "$folder$separator" . &_utf7_encode($session, $imaps, $name);
		}
		if ($type eq "17") {
			$folder = "$folder$separator";
		}
	}

	my $error;
	#　一時ファイルをロック
	my $lock;
	my $org_mail_permit = 0;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$org_mail_permit = 1;
		$lock = DA::OrgMail::folder_lock($session);
	}
	if (!$org_mail_permit || $lock) {
		if (DA::OrgMail::check_org_mail_permit($session)) {
			# 一時ファイルをチェック
			my $check=DA::OrgMail::check_folders_update_info($session);
			unless($check) {
				$error = "OLD_OF_FOLDER";
			}
		}
		if(!$error){
	if ($parent && !&_select($session, $imaps, $parent)) {
		$error = &error("NOT_SELECT_FOLDER", 9);
	} elsif ($name eq "" || $name =~ /^\s+$/) {
		$error = &error("NO_INPUT_QUERY", 1, t_("フォルダ名"));
	} elsif (&check_folder_name($session, $imaps, $name)) {
		$error = &error("NOT_USE_FOLDER_CHAR", 1, t_("フォルダ名"));
	} elsif (length($utf7) > 100) {
		$error = &error("LONGER_FOLDER_NAME", 1);
	} elsif (!defined $folder) {
		$error = &error("NOT_FOUND_FOLDER", 1);
	} elsif (length($folder) > 200) {
		$error = &error("LONGER_FOLDER_NAME", 1);
	} elsif ($folder =~ /^public folders(?:[\Q$separator\E]|$)/i
	     &&  &check_imap_info($session, $imaps, "public")) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (&_is_inbox($session, $imaps, $folder)) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (&_is_draft($session, $imaps, $folder)) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (&_is_sent($session, $imaps, $folder)) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (&_is_trash($session, $imaps, $folder)) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (&_is_spam($session, $imaps, $folder)) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (!$folders->{$fid}->{create}) {
		$error = &error("NOT_CREATE_FOLDER", 1);
	} elsif (&_exists($session, $imaps, $folder)) {
		$error = &error("ALREADY_EXISTS_FOLDER", 1);
	} else {
        foreach my $key (keys %{$folders}){
			if ($folders->{$key}->{folder} eq $folder){
				$error = &error("EXISTS_FOLDER_IN_FILE", 1);
				last;
			}
		}
	}
	if (!$error) {
		if (&_create($session, $imaps, $folder)) {
			#　IMAP操作成功後、組織一時ファイルと個人一時ファイルを更新
			if (DA::OrgMail::check_org_mail_permit($session)) {
				DA::OrgMail::change_folders_update_info($session);
			}			
			my $fid = &inc_num($session, "fid");
			my $uidvalidity = &_uidvalidity($session, $imaps, $folder);
			if ($fid && defined $uidvalidity) {
				my $info;
				if (&_is_mailbox($session, $imaps, $folder, $type)) {
					$info = &_mailbox($session, $imaps, $folder);
				} elsif (&_is_cabinet($session, $imaps, $folder, $type)) {
					$info = &_cabinet($session, $imaps, $folder);
				} else {
					$info = &_default($session, $imaps, $folder);
				}

				if (my $parent = &_path2parent($session, $imaps, $folders, $info->{path})) {
					$info->{fid}    = $fid;
					$info->{parent} = $parent;
					$info->{uidvalidity} = $uidvalidity;

					$folders->{$fid} = $info;

					unless (&storable_store($session, $folders, "folders")) {
						&_warn($session, "storable_store");
						$error = &error("NOT_WRITE_FOLDERS", 9);
					}
				} else {
					&_warn($session, "_path2parent");
					$error = &error("NOT_FOUND_PARENT", 9);
				}
			} else {
				&_warn($session, "inc_num");
				&_warn($session, "_uidvalidity");
				$error = &error("NOT_INC_FID", 9);
			}
		} else {
			&_warn($session, "_create");
			$error = &error("NOT_CREATE_FOLDER", 9);
		}
	}
		}
		#　一時ファイルのロックを削除
		DA::OrgMail::folder_unlock($session, "lock.folders");
	} else {
		&_warn($session, "lock:lock.folders");
		$error = &error("NOT_LOCK_FOLDERS", 9);
	}

	&_logger($session, $imaps, $logger);

	return($error);
}

sub rename_folder($$$$$) {
	my ($session, $imaps, $folders, $fid, $name) = @_;
	DA::Custom::rename_mail_folder4ajx($session, $imaps, $folders, $fid, $name);
	my $logger    = &_logger_init($session);
	my $folder    = &_fid2folder($session, $imaps, $folders, $fid);
	my $type      = &_fid2type($session, $imaps, $folders, $fid);
	my $specific  = &_fid2specific($session, $imaps, $folders, $fid);
	my $utf7      = &_utf7_encode($session, $imaps, $name);
	my $separator = $imaps->{imap}->{separator};

	my $src = $folder;
	my $dst = $folder;
	my @dst = split(/\Q$separator\E/, $dst);
	$dst[-1]= &_utf7_encode($session, $imaps, $name);
	$dst = join($separator, @dst);

	my $error;
	#　一時ファイルをロック
	my $lock;
	my $org_mail_permit = 0;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$org_mail_permit = 1;
		$lock = DA::OrgMail::folder_lock($session);
	}
	if (!$org_mail_permit || $lock) {
		if (DA::OrgMail::check_org_mail_permit($session)) {
			# 一時ファイルをチェック
			my $check=DA::OrgMail::check_folders_update_info($session);
			unless($check) {
				$error = "OLD_OF_FOLDER";
			}
		}
		if(!$error){

	if ($name eq "" || $name =~ /^\s+$/) {
		$error = &error("NO_INPUT_QUERY", 1, t_("フォルダ名"))
	} elsif (&check_folder_name($session, $imaps, $name)) {
		$error = &error("NOT_USE_FOLDER_CHAR", 1, t_("フォルダ名"));
	} elsif (length($utf7) > 100) {
		$error = &error("LONGER_FOLDER_NAME", 1);
	} elsif ($folder eq "") {
		$error = &error("NOT_FOUND_FOLDER", 1);
	} elsif (length($dst) > 200) {
		$error = &error("LONGER_FOLDER_NAME", 1);
	} elsif ($dst =~ /^public folders(?:[\Q$separator\E]|$)/i
	     &&  &check_imap_info($session, $imaps, "public")) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (&_is_inbox($session, $imaps, $dst) && $type ne $TYPE_INBOX) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (&_is_draft($session, $imaps, $dst) && $type ne $TYPE_DRAFT) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (&_is_sent($session, $imaps, $dst) && $type ne $TYPE_SENT) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (&_is_trash($session, $imaps, $dst) && $type ne $TYPE_TRASH) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (&_is_spam($session, $imaps, $dst) && $type ne $TYPE_SPAM) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (!$folders->{$fid}->{rename}) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	}

	if (!$error && !&_view_exists($session, $imaps, $specific)) {
		if ($src eq $dst) {
			$error = &error("SAME_FOLDER_NAME", 1);
		} elsif (_exists($session, $imaps, $dst)) {
			$error = &error("NOT_USE_FOLDER_NAME", 1);
		}
	}

	if (!$error) {
		if (&_view_exists($session, $imaps, $specific)) {
			if (my $imap = &get_master($session, "imap")) {
				$imap->{"$specific\_view"} = $name;
				unless (&save_master($session, $imap, "imap")) {
					&_warn($session, "save_master");
					$error = &error("NOT_WRITE_IMAP_CONFIG", 9);
				}
			} else {
				&_warn($session, "get_master");
				$error = &error("NOT_READ_IMAP_CONFIG", 9);
			}
			unless ($error) {
				$imaps->{imap}->{"$specific\_view"} = $name;
				if (&save_master_enabled($session, $imaps->{imap}, "imap")) {
					my $info;
					my $parent = &_fid2parent($session, $imaps, $folders, $fid);
					my $uidval = &_fid2uidval($session, $imaps, $folders, $fid);
					if ($type eq $TYPE_INBOX) {
						$info = &_inbox($session, $imaps);
					} elsif ($type eq $TYPE_DRAFT) {
						$info = &_draft($session, $imaps);
					} elsif ($type eq $TYPE_SENT) {
						$info = &_sent($session, $imaps);
					} elsif ($type eq $TYPE_TRASH) {
						$info = &_trash($session, $imaps);
					} elsif ($type eq $TYPE_SPAM) {
						$info = &_spam($session, $imaps);
					}
					$info->{fid}         = $fid;
					$info->{parent}      = $parent;
					$info->{uidvalidity} = $uidval;

					$folders->{$fid} = $info;

					unless (&storable_store($session, $folders, "folders")) {
						&_warn($session, "storable_store");
						$error = &error("NOT_WRITE_FOLDERS", 9);
					}
				} else {
					&_warn($session, "save_master_enabled");
					$error = &error("NOT_WRITE_IMAP_CONFIG", 9);
				}
			}
		} else {
			if ($type =~ /^($TYPE_DRAFT|$TYPE_SENT|$TYPE_TRASH|$TYPE_SPAM)$/) {
				if (my $imap = &get_master($session, "imap")) {
					$imap->{$specific} = $name;
					unless (&save_master($session, $imap, "imap")) {
						&_warn($session, "save_master");
						$error = &error("NOT_WRITE_IMAP_CONFIG", 9);
					}
				} else {
					&_warn($session, "get_master");
					$error = &error("NOT_READ_IMAP_CONFIG", 9);
				}
				unless ($error) {
					$imaps->{imap}->{$specific} = $name;
					unless (&save_master_enabled($session, $imaps->{imap}, "imap")) {
						&_warn($session, "save_master_enabled");
						$error = &error("NOT_WRITE_IMAP_CONFIG", 9);
					}
				}
			}

			unless ($error) {
				if (&_rename($session, $imaps, $src, $dst)) {
					#　IMAP操作成功後、組織一時ファイルと個人一時ファイルを更新
					if (DA::OrgMail::check_org_mail_permit($session)) {
						DA::OrgMail::change_folders_update_info($session);
					}
					my $lowers = &_fid2lowers($session, $imaps, $folders, $fid);
					my $false;
					foreach my $fid ($fid, @{$lowers}) {
						next unless ($fid);

						my $info;
						my $type   = &_fid2type($session, $imaps, $folders, $fid);
						my $parent = &_fid2parent($session, $imaps, $folders, $fid);
						my $old    = &_fid2folder($session, $imaps, $folders, $fid);
						my $new    = &_fid2folder($session, $imaps, $folders, $fid);
						   $new    =~s/^\Q$src\E([\Q$separator\E]|$)/$dst$1/;

						# UIDVALIDITY が時間に依存する不具合対応 (Cyrus?)
						sleep(1);
						# UIDVALIDITY が確定しない不具合対応 (Courier-IMAP)
						unless (&_select($session, $imaps, $new)) {
							&_warn($session, "_select");
						}

						my $old_uidval = &_fid2uidval($session, $imaps, $folders, $fid);
						my $new_uidval = &_uidvalidity($session, $imaps, $new);
						if ($type eq $TYPE_MAILBOX) {
							$info = &_mailbox($session, $imaps, $new);
						} elsif ($type eq $TYPE_CABINET) {
							$info = &_cabinet($session, $imaps, $new);
						} else {
							$info = &_default($session, $imaps, $new);
						}
						$info->{fid}         = $fid;
						$info->{parent}      = $parent;
						$info->{uidvalidity} = $new_uidval;

						$folders->{$fid} = $info;

		                my $folder_new = &_utf7_decode($session, $imaps, $new);
			            my $folder_old = &_utf7_decode($session, $imaps, $old);
						
						my $oplog = {
								"app"    => "mail",
								"docid"  => "ajax/mail/$session->{user}/$fid",
								"type"   => "MFN",
								"detail" => {
										"uidval"	=> $old_uidval,
										"folder_old"    => $folder_old,
										"folder_new"    => $folder_new
								}
						};
						if(DA::OrgMail::use_org_mail($session)){	
							my $gid = DA::OrgMail::get_gid($session);
							$oplog->{type} = "MFNO";
							$oplog->{detail}->{gid} = $gid;
						}
						DA::OperationLog::log($session, $oplog);

						if ($old_uidval eq $new_uidval) {
							unless (&update_folder_name($session, $imaps, $old, $old_uidval, $new, $new_uidval)) {
								$false = 1; last;
							}
						} else {
							my $rc = { fid => $fid, nolock=>1 };
							my $result = &rebuild($session, $imaps, $folders, $rc);
							if ($result->{error}) {
								$false = 1; last;
							}
						}
					}

					my $src_path = &_encode($session, $imaps, $src);
					my $dst_path = &_encode($session, $imaps, $dst);

					if (my $parent = &_path2parent($session, $imaps, $folders, $dst_path)) {
						$folders->{$fid}->{parent} = $parent;

						if (&storable_store($session, $folders, "folders")) {
							unless (&check_filter($session, $src_path, $dst_path)) {
								&_warn($session, "check_filter");
								$error = &error("NOT_WRITE_FILTER_CONFIG", 9);
							}
						} else {
							&_warn($session, "storable_store");
							$error = &error("NOT_WRITE_FOLDERS", 9);
						}
					} else {
						&_warn($session, "_path2parent");
						$error = &error("NOT_FOUND_PARENT", 9);
					}

					if ($false) {
						&_warn($session, "update_folder_name");
						$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
					}
				} else {
					&_warn($session, "_rename");
					$error = &error("NOT_RENAME_FOLDER", 9);
				}
			}
		}
	}

		}

		#　一時ファイルのロックを削除
		DA::OrgMail::folder_unlock($session, "lock.folders");
	} else {
		&_warn($session, "lock:lock.folders");
		$error = &error("NOT_LOCK_FOLDERS", 9);
	}	

	&_logger($session, $imaps, $logger);

	return($error);
}

sub move_folder($$$$$) {
	my ($session, $imaps, $folders, $src_fid, $dst_fid) = @_;
	DA::Custom::move_mail_folder4ajx($session,$imaps,$folders,$src_fid,$dst_fid);
	my $logger    = &_logger_init($session);
	my $src       = &_fid2folder($session, $imaps, $folders, $src_fid);
	my $parent    = &_fid2folder($session, $imaps, $folders, $dst_fid);
	my $separator = $imaps->{imap}->{separator};

	my @src = split(/\Q$separator\E/, $src);
	my $dst = ($parent eq "") ? $src[-1] : $parent . $separator . $src[-1];

	my $error;
	#　一時ファイルをロック
	my $lock;
	my $org_mail_permit = 0;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$org_mail_permit = 1;
		$lock = DA::OrgMail::folder_lock($session);
	}

	if (!$org_mail_permit || $lock) {
		if (DA::OrgMail::check_org_mail_permit($session)) {	
			# 一時ファイルをチェック
			my $check=DA::OrgMail::check_folders_update_info($session);
			unless($check) {
				$error = "OLD_OF_FOLDER";
			}
		}
		if(!$error){
	if (length($dst) > 200) {
		$error = &error("LONGER_FOLDER_NAME", 1);
	} elsif ($src eq "" || !defined $parent) {
		$error = &error("NOT_FOUND_FOLDER", 1);
	} elsif ($src_fid eq $dst_fid) {
		$error = &error("SAME_MOVE_FOLDER", 1);
	} elsif ($dst =~ /^public folders(?:[\Q$separator\E]|$)/i
	     &&  &check_imap_info($session, $imaps, "public")) {
		$error = &error("NOT_USE_FOLDER_NAME", 1);
	} elsif (!$folders->{$dst_fid}->{move_f}) {
		$error = &error("NOT_MOVE_FOLDER", 1);
	} elsif (!$folders->{$src_fid}->{move}) {
		$error = &error("NOT_MOVE_FOLDER", 1);
	} elsif ($dst =~ /^\Q$src$separator\E/) {
		$error = &error("NOT_MOVE_FOLDER", 1);
	} elsif (&_exists($session, $imaps, $dst)) {
		$error = &error("ALREADY_EXISTS_FOLDER", 1);
	} elsif (!&_exists($session, $imaps, $parent)) {
		$error = &error("NOT_EXISTS_PARENT", 1);
	}

	if (!$error) {
		if (&_rename($session, $imaps, $src, $dst)) {
			#　IMAP操作成功後、組織一時ファイルと個人一時ファイルを更新
			if (DA::OrgMail::check_org_mail_permit($session)) {
				DA::OrgMail::change_folders_update_info($session);
			}
			my $lowers = &_fid2lowers($session, $imaps, $folders, $src_fid);
			my $false;
			foreach my $fid ($src_fid, @{$lowers}) {
				next unless ($fid);

				my $info;
				my $type   = &_fid2type($session, $imaps, $folders, $fid);
				my $parent = &_fid2parent($session, $imaps, $folders, $fid);
				my $old    = &_fid2folder($session, $imaps, $folders, $fid);
				my $new    = &_fid2folder($session, $imaps, $folders, $fid);
				   $new    =~s/^\Q$src\E([\Q$separator\E]|$)/$dst$1/;

				# UIDVALIDITY が時間に依存する不具合対応 (Cyrus?)
				sleep(1);
				# UIDVALIDITY が確定しない不具合対応 (Courier-IMAP)
				unless (&_select($session, $imaps, $new)) {
					&_warn($session, "_select");
				}

				my $old_uidval = &_fid2uidval($session, $imaps, $folders, $fid);
				my $new_uidval = &_uidvalidity($session, $imaps, $new);

				if ($type eq $TYPE_MAILBOX) {
					$info = &_mailbox($session, $imaps, $new);
				} elsif ($type eq $TYPE_CABINET) {
					$info = &_cabinet($session, $imaps, $new);
				} else {
					$info = &_default($session, $imaps, $new);
				}
				$info->{fid}         = $fid;
				$info->{parent}      = $parent;
				$info->{uidvalidity} = $new_uidval;

				$folders->{$fid} = $info;

			        my $folder_new = &_utf7_decode($session, $imaps, $new);
				my $folder_old = &_utf7_decode($session, $imaps, $old);

				my $oplog = {
						"app"    => "mail",
						"docid"  => "ajax/mail/$session->{user}/$fid",
						"type"   => "MFV",
						"detail" => {
								"uidval"	=> $old_uidval,
								"folder_old"    => $folder_old,
								"folder_new"    => $folder_new
						}
				};
				if(DA::OrgMail::use_org_mail($session)){
					my $gid = DA::OrgMail::get_gid($session);
					$oplog->{type} = "MFVO";
					$oplog->{detail}->{gid} = $gid;
				}
				DA::OperationLog::log($session, $oplog);

				if ($old_uidval eq $new_uidval) {
					unless (&update_folder_name($session, $imaps, $old, $old_uidval, $new, $new_uidval)) {
						$false = 1; last;
					}
				} else {
					my $rc = { fid => $fid, nolock=>1};
					my $result = &rebuild($session, $imaps, $folders, $rc);
					if ($result->{error}) {
						$false = 1; last;
					}
				}
			}

			my $src_path = &_encode($session, $imaps, $src);
			my $dst_path = &_encode($session, $imaps, $dst);

			if (my $parent = &_path2parent($session, $imaps, $folders, $dst_path)) {
				$folders->{$src_fid}->{parent} = $parent;

				if (&storable_store($session, $folders, "folders")) {
					unless (&check_filter($session, $src_path, $dst_path)) {
						&_warn($session, "check_filter");
						$error = &error("NOT_WRITE_FILTER_CONFIG", 9);
					}
				} else {
					&_warn($session, "storable_store");
					$error = &error("NOT_WRITE_FOLDERS", 9);
				}
			} else {
				&_warn($session, "_path2parent");
				$error = &error("NOT_FOUND_PARENT", 9);
			}

			if ($false) {
				&_warn($session, "update_folder_name");
				$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
			}
		} else {
			&_warn($session, "_rename");
			$error = &error("NOT_RENAME_FOLDER", 9);
		}
	}
		}
	#　一時ファイルのロックを削除
		DA::OrgMail::folder_unlock($session, "lock.folders");
	} else {
		&_warn($session, "lock:lock.folders");
		$error = &error("NOT_LOCK_FOLDERS", 9);
	}

	&_logger($session, $imaps, $logger);

	return($error);
}

sub delete_folder($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;
	DA::Custom::delete_mail_folder4ajx($session,$imaps,$folders,$fid);
	my $logger = &_logger_init($session);
	my $lowers = &_fid2lowers($session, $imaps, $folders, $fid);
	my $error;
	#　一時ファイルをロック
	my $lock;
	my $org_mail_permit = 0;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$org_mail_permit = 1;
		$lock = DA::OrgMail::folder_lock($session);
	}
	if (!$org_mail_permit || $lock) {
		if (DA::OrgMail::check_org_mail_permit($session)) {
			# 一時ファイルをチェック
			my $check=DA::OrgMail::check_folders_update_info($session);
			unless($check) {
				$error = "OLD_OF_FOLDER";
			}
		}
		if(!$error){
	my @fids;
	if (scalar(@{$lowers})) {
		@fids = sort {
			$folders->{$b}->{depth} <=> $folders->{$a}->{depth} ||
			$folders->{$b}->{length} <=> $folders->{$a}->{length}
		} @{$lowers};
		push(@fids, $fid);
	} else {
		push(@fids, $fid);
	}

	foreach my $f (@fids) {
		my $folder    = &_fid2folder($session, $imaps, $folders, $f);
		my $uidval    = &_fid2uidval($session, $imaps, $folders, $f);
		my $path      = &_fid2path($session, $imaps, $folders, $f);
		my $separator = $imaps->{imap}->{separator};

		if ($folder eq "") {
			$error = &error("NOT_FOUND_FOLDER", 1);
		} elsif (!$folders->{$f}->{delete}) {
			$error = &error("NOT_DELETE_FOLDER", 1);
		}

		if (!$error) {
			if (&_delete($session, $imaps, $folder)) {
				#　IMAP操作成功後、組織一時ファイルと個人一時ファイルを更新
				if (DA::OrgMail::check_org_mail_permit($session)) {
					DA::OrgMail::change_folders_update_info($session);
				}
				delete $folders->{$f};

				my $dc = {
					"folder" => $folder,
					"uidval" => $uidval,
				};

				my $folder_del = &_utf7_decode($session, $imaps, $folder);
				my $log = [];
				my $oplog = {
						"app"    => "mail",
						"docid"  => "ajax/mail/$session->{user}/$fid",
						"type"   => "MFR",
						"detail" => {
								"uidval"	=> $uidval,
								"folder"	=> $folder_del
						}
				};
				if(DA::OrgMail::use_org_mail($session)){
					my $gid = DA::OrgMail::get_gid($session);
					$oplog->{type} = "MFRO";
					$oplog->{detail}->{gid} = $gid;
				}
				push (@{$log},$oplog);

				if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
					my $sc = {
						"folder" => $folder,
						"uidval" => $uidval,
						"output" => [qw(uid_number seen to_field from_field date_field subject_field)],
					};
					my $detail = [];
					$detail = &_select_header($session, $imaps, $sc);

					foreach my $dum (@{$detail}) {
						my $oplog = {
								"app"    => "mail",
								"docid"  => "ajax/mail/$session->{user}/$fid/$dum->{uid_number}",
								"type"   => "MR",
								"detail" => {
										"folder"     => $folder_del,
										"To"         => $dum->{to_field},
										"From"       => $dum->{from_field},
										"Date"       => $dum->{date_field},
										"Subject"    => $dum->{subject_field}
								}
						};
						if(DA::OrgMail::use_org_mail($session)){
							my $gid = DA::OrgMail::get_gid($session);
							$oplog->{type} = "MRO";
							$oplog->{detail}->{gid} = $gid;
						}
						push (@{$log},$oplog);
					}
				}
				DA::OperationLog::log($session, $log);

				if (&_delete_header($session, $imaps, $dc)) {
					if (&_delete_folder($session, $imaps, $dc)) {
						if (&storable_store($session, $folders, "folders")) {
							unless (&check_filter($session, $path)) {
								&_warn($session, "check_filter");
								$error = &error("NOT_WRITE_FILTER_CONFIG", 9);
							}
						} else {
							&_warn($session, "storable_store");
							$error = &error("NOT_WRITE_FOLDERS", 9);
						}
					} else {
						&_warn($session, "_delete_folder");
						$error = &error("NOT_DELETE_FOLDER_TABLE", 9);
					}
				} else {
					&_warn($session, "_delete_header");
					$error = &error("NOT_DELETE_HEADER_TABLE", 9);
				}
			} else {
				&_warn($session, "_delete");
				$error = &error("NOT_DELETE_FOLDER", 9);
			}
		}

		if ($error) {
			last;
		}
	}
		}
		#　一時ファイルのロックを削除
		DA::OrgMail::folder_unlock($session, "lock.folders");
	} else {
		&_warn($session, "lock:lock.folders");
		$error = &error("NOT_LOCK_FOLDERS", 9);
	}

	&_logger($session, $imaps, $logger);

	return($error);
}

sub move_mail($$;$$$;$) {
	my ($session, $imaps, $vfilter, $folders, $c, $trash) = @_;

	DA::Custom::move_mail4ajx($session, $imaps, $vfilter, $folders, $c, $trash);
	if ($trash) {
		$c->{target_fid} = &_trash_fid($session, $imaps, $folders);
	}

	my $uc = {
		"fid"      => $c->{target_fid},
		"noupdate" => 1,
		"norecent" => 1,
		"from_fid" => $c->{fid}
	};

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) =~ /^($TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) {
		if ($c->{uid}) {
			$c->{uid} = &_select_uidlst_common($session, $c->{fid}, $c->{uid}, undef, 2);
		}
		if ($c->{area}) {
			$c->{uid} = &_join_uidlst($c->{uid}, &_select_uidlst_common($session, $c->{fid}, $c->{area}));
		}
		my $res1 = &move_mail_local($session, $imaps, $vfilter, $folders, $c);
		if ($res1->{error}) {
			return($res1);
		} else {
			my $res2 = &update($session, $imaps, $folders, $uc);
			if ($res2->{error}) {
				return($res2);
			} else {
				$res2->{total}->{fid} = $c->{fid};
				$res1->{counts} = [$res2->{total}];
				$res1->{total} = $res2->{total};
				if (ref($res2->{counts}) eq "ARRAY") {
					push(@{$res1->{counts}}, @{$res2->{counts}});
				}
				return($res1);
			}
		}
	} else {
		if ($c->{srid}) {
			my $area;
			if ($c->{area}) {
				$area = &_select_uidlst_search($session, $c->{srid}, $c->{area}, undef, 1, $c->{fid});
			} else {
				$area = &_select_uidlst_search($session, $c->{srid}, $c->{uid}, undef, 1, $c->{fid});
			}

			my $bc  = {}; %{$bc} = %{$c};
			my $res = {};
			foreach my $key (sort {$a <=> $b} keys %{$area}) {
				$bc->{fid} = $key;
				if ($c->{area} && $c->{fid} eq $key) {
					$bc->{uid} = &_join_uidlst($c->{uid}, $area->{$key});
				} else {
					$bc->{uid} = join(",", @{$area->{$key}});
				}

				my $res1 = &move_mail_server($session, $imaps, $vfilter, $folders, $bc);
				if ($res1->{error}) {
					return($res1);
				} else {
					my $res2 = &delete_mail_search($session, $imaps, $vfilter, $folders, $bc);
					if ($res2->{error}) {
						return($res2);
					} else {
						$res1->{total}->{fid} = $bc->{fid};
						push(@{$res->{counts}}, $res1->{total});
					}
				}
			}

			my $res3 = &update($session, $imaps, $folders, $uc);
			if ($res3->{error}) {
				return($res3);
			} else {
				$res3->{total}->{fid} = $uc->{fid};
				push(@{$res->{counts}}, $res3->{total});
				if (ref($res3->{counts}) eq "ARRAY") {
					push(@{$res->{counts}}, @{$res3->{counts}});
				}
				return($res);
			}
		} else {
			if ($c->{uid}) {
				$c->{uid} = &_select_uidlst_common($session, $c->{fid}, $c->{uid}, undef, 2);
			}
			if ($c->{area}) {
				$c->{uid} = &_join_uidlst($c->{uid}, &_select_uidlst_common($session, $c->{fid}, $c->{area}));
			}
			my $res1 = &move_mail_server($session, $imaps, $vfilter, $folders, $c);
			if ($res1->{error}) {
				return($res1);
			} else {
				my $res2 = &update($session, $imaps, $folders, $uc);
				if ($res2->{error}) {
					return($res2);
				} else {
					$res2->{total}->{fid} = $uc->{fid};
					$res1->{counts} = [$res2->{total}];
					if (ref($res2->{counts}) eq "ARRAY") {
						push(@{$res1->{counts}}, @{$res2->{counts}});
					}
					return($res1);
				}
			}
		}
	}
}

sub move_mail_server($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger       = &_logger_init($session);
	my $fid          = $c->{fid};
	my $target_fid   = $c->{target_fid};
	my $cid          = $c->{cid};
	my $uids         = $c->{uid};
	my $search_field = $c->{search_field};
	my $search_word  = $c->{search_word};
	my $nocount      = $c->{nocount};
	my $ignoreQuota  = $c->{ignoreQuota};
	my $src_folder   = &_fid2folder($session, $imaps, $folders, $fid);
	my $dst_folder   = &_fid2folder($session, $imaps, $folders, $target_fid);
	my $src_uidval   = &_fid2uidval($session, $imaps, $folders, $fid);
	my $dst_uidval   = &_fid2uidval($session, $imaps, $folders, $target_fid);
	my $src_type     = &_fid2type($session, $imaps, $folders, $fid);
	my $dst_type     = &_fid2type($session, $imaps, $folders, $target_fid);
	my $src_dummy    = &_fid2dummy($session, $imaps, $folders, $fid);
	my $dst_dummy    = &_fid2dummy($session, $imaps, $folders, $target_fid);
	my $result       = {};
	my $error;

	my $seenlst = [];

	&_set_uid_flag($session, $imaps);
	my $path      = &_fid2path($session, $imaps, $folders, $fid);
	my $md5_path  = Digest::MD5::md5_hex($path);
	my $target_path      = &_fid2path($session, $imaps, $folders, $target_fid);
	my $md5_target_path  = Digest::MD5::md5_hex($target_path);
	if (&lock($session, "trans.$md5_path")) {
		 if (&lock($session, "trans.$md5_target_path")) {
			if (&_select($session, $imaps, $src_folder)) {
				if ($uids =~ /^(all|deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
					my $where  = &_vfilter_where($session, $imaps, $vfilter, $cid);
					my $search = &_search_where($session, $imaps, $search_field, $search_word);

					if ($uids =~ /^(deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
						push(@{$where}, &_uids2where($uids));
					}

					my $sc = {
						"folder" => $src_folder,
						"uidval" => $src_uidval,
						"where"  => $where,
						"search" => $search,
						"output" => [qw(uid_number)],
						"list"   => 1
					};
					if (my $uidlst = &_select_header($session, $imaps, $sc)) {
						my $nos = &_number(join(",", @{$uidlst}));
						if (scalar(@{$nos})) {
							my ($inc, @success, @false);
							foreach my $n (@{$nos}) {
								if (&_move($session, $imaps, $n, $dst_folder)) {
									push(@success, @{&_number2array($n)});
								} else {
									push(@false, @{&_number2array($n)});
								}
							}
							if (scalar(@false)) {
								my $dc = {
									"folder" => $src_folder,
									"uidval" => $src_uidval,
									"uidlst" => \@success
								};
								if (&_delete_header($session, $imaps, $dc)) {
									$inc = 1;
									&_delete_uidlst_common($session, $fid, \@success);
									&_warn($session, "Can't move mail [$src_folder]");
									$error = &error("NOT_MOVE_MAIL", 9);
								} else {
									&_warn($session, "_delete_header");
									$error = &error("NOT_DELETE_HEADER_TABLE", 9);
								}
							} else {
								my $dc = {
									"folder" => $src_folder,
									"uidval" => $src_uidval,
									"where"  => $where,
									"search" => $search
								};
								if (&_delete_header($session, $imaps, $dc)) {
									$inc = 1;
									&_delete_uidlst_common($session, $fid, $uidlst);
								} else {
									&_warn($session, "_delete_header");
									$error = &error("NOT_DELETE_HEADER_TABLE", 9);
								}
							}
							if ($inc) {
								if (!$nocount) {
									if (&re_count($session, $imaps, $src_folder, $src_uidval, 1)) {
										if (my $cnt = &count($session, $imaps, $src_folder, $src_uidval)) {
											$result->{total} = &view_count($session, $imaps, $cnt, $src_type, $src_dummy, 1);
										} else {
											&_warn($session, "count");
											$error = &error("NOT_GET_COUNT", 9);
										}
									} else {
										&_warn($session, "re_count");
										$error = &error("NOT_GET_COUNT", 9);
									}
								}
								unless (&_expunge($session, $imaps)) {
									&_warn($session, "_expunge");
								}
								if ($src_type eq $TYPE_INBOX || $dst_type eq $TYPE_INBOX) {
									&set_portal_reload($session, $imaps);
								} else {
									if ($imaps->{portal}->{ml_target} eq "all") {
										&set_portal_reload($session, $imaps);
									}
								}
							}
						}
					} else {
						&_warn($session, "_select_header");
						$error = &error("NOT_SELECT_HEADER_TABLE", 9);
					}
				} else {
					my $success_move = 0;
					my $nos = &_number($uids);
					if (scalar(@{$nos})) {
						my (@success, @false);
						foreach my $n (@{$nos}) {
							my $result_move = &_move($session, $imaps, $n, $dst_folder);
							if ($result_move) {
								if($result_move ne 'none'){
									$success_move=($success_move + $result_move);
								}
								push(@success, @{&_number2array($n)});
							} else {
								push(@false, @{&_number2array($n)});
							}
						}

						if (scalar(@success)) {

							my @output = qw(uid_number seen);
							if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
								 @output = qw(uid_number seen to_field from_field date_field subject_field);	
							}
							my $sc = {
								"folder" => $src_folder,
								"uidval" => $src_uidval,
								"uidlst" => \@success,
								"output" => [@output]
							};
							if ($seenlst = &_select_header($session, $imaps, $sc)) {
								unless ($nocount) {
									if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
										my $folder_old = &_utf7_decode($session, $imaps, $src_folder);
										my $folder_new = &_utf7_decode($session, $imaps, $dst_folder);
										my $log = [];
										my $org_flag = 0;
										my $gid = 0;
										my $trash = 0;
										if(DA::OrgMail::use_org_mail($session)){
											$org_flag = 1;
											$gid = DA::OrgMail::get_gid($session);
										}
										if(&_is_trash($session, $imaps, $dst_folder)){
											$trash = 1;
									}
										foreach my $dum (@{$seenlst}) {
											my $oplog = {
													"app"    => "mail",
													"docid"  => "ajax/mail/$session->{user}/$fid/$dum->{uid_number}",
													"type"   => "MV",
													"detail" => {
														"folder_old" => $folder_old,
														"folder_new" => $folder_new,
														"To"	 => $dum->{to_field},
														"From"       => $dum->{from_field},
														"Date"       => $dum->{date_field},
														"Subject"    => $dum->{subject_field}
													}
											};
											if($org_flag){
												if($trash){
													$oplog->{type} = "MTO";
												}else{
													$oplog->{type} = "MVO";
												}
												$oplog->{detail}->{gid} = $gid;
											}else{
												if($trash){
													$oplog->{type} = "MT";	
												}
											}
											push (@{$log},$oplog);
										}
										DA::OperationLog::log($session, $log);
									}
								}
								my $inc;
								my $dc = {
									"folder" => $src_folder,
									"uidval" => $src_uidval,
									"uidlst" => \@success
								};
								if (&_delete_header($session, $imaps, $dc)) {
									$inc = 1;
									&_delete_uidlst_common($session, $fid, \@success);
									if (scalar(@false)) {
										&_warn($session, "Can't move mail [$src_folder]");
										$error = &error("NOT_MOVE_MAIL", 9);
									}
								} else {
									&_warn($session, "_delete_header");
									$error = &error("NOT_DELETE_HEADER_TABLE", 9);
								}
								if ($inc) {
									if (!$nocount) {
										my $lst = {};
										foreach my $key (@{$seenlst}) {
											$lst->{$key->{uid_number}}->{seen} = $key->{seen};
											$lst->{$key->{uid_number}}->{uid_number} = $key->{uid_number}; 
										}
										my ($de, $ds) = &_diff_count($lst, \@success, "delete");
										my $count = {
											"exists_count" => $de,
											"unseen_count" => $ds
										};
										if (my $cnt = &inc_count($session, $imaps, $src_folder, $src_uidval, $count)) {
											$result->{total} = &view_count($session, $imaps, $cnt, $src_type, $src_dummy, 1);
										} else {
											&_warn($session, "inc_count");
											$error = &error("NOT_INC_COUNT", 9);
										}
									}
									unless (&_expunge($session, $imaps)) {
										&_warn($session, "_expunge");
									}
									if ($src_type eq $TYPE_INBOX || $dst_type eq $TYPE_INBOX) {
										&set_portal_reload($session, $imaps);
									} else {
										if ($imaps->{portal}->{ml_target} eq "all") {
											&set_portal_reload($session, $imaps);
										}
									}
								}
							} else {
								&_warn($session, "_select_header");
								$error = &error("NOT_SELECT_HEADER_TABLE", 9);
							}
						} else {
							if (scalar(@false)) {
								&_warn($session, "Can't move mail[$src_folder]");
								if ($ignoreQuota) {
									$error = &error("NOT_MOVE_MAIL", 2);
								} else {
									$error = &error("NOT_MOVE_MAIL", 9);
								}
							}
						}
						if(!$error && &check_is_cyrus($imaps)){
							my @uid_array=split(',',$uids);
							my $diff = (scalar(@uid_array) - $success_move);
							if($diff>0){
								$error = &error("NOT_MOVE_ALL_MAIL", 9, ($diff));
							}
						}
					}
				}
			} else {
				&_warn($session, "_select");
				$error = &error("NOT_SELECT_FOLDER", 9);
			}

			&unlock($session, "trans.$md5_target_path");
		} else {
			&_warn($session, "lock");
			$error = &error("NOT_LOCK", 9);
		}

		&unlock($session, "trans.$md5_path");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub move_mail_local($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger     = &_logger_init($session);
	my $fid        = $c->{fid};
	my $target_fid = $c->{target_fid};
	my $cid        = $c->{cid};
	my $uids       = $c->{uid};
	my $type       = &_fid2type($session, $imaps, $folders, $fid);
	my $dst_folder = &_fid2folder($session, $imaps, $folders, $target_fid);
	my $dst_uidval = &_fid2uidval($session, $imaps, $folders, $target_fid);
	my $dst_type   = &_fid2type($session, $imaps, $folders, $target_fid);
	my $target     = &is_backup($session, $imaps, $type) ? "backup" : "sent";
	my $base       = &infobase($session, $target);
	my $result     = {};
	my $error;

	my $detail = [];

	&_set_uid_flag($session, $imaps);

	unless (&_exists($session, $imaps, $dst_folder)) {
		unless (&_create($session, $imaps, $dst_folder)) {
			return(&error("NOT_CREATE_FOLDER", 9));
		}
	}

	if (&lock($session, "trans.local")) {
		if (&_select($session, $imaps, $dst_folder)) {
			if ($uids =~ /^(all)$/) {
				my $sc = {
					"output" => [qw(uid_number)],
					"list"   => 1,
					"target" => $target
				};
				if (my $uidlst = &_select_header_local($session, $imaps, $sc)) {
					my (@success, @false);
					foreach my $u (@{$uidlst}) {
						my $uid_new;
						#backup mail file dir  
						if($target eq 'backup') {
							$uid_new = &_append($session, $imaps, $dst_folder, "$base/$u/$u\.jis");
						}else {
							$uid_new = &_append($session, $imaps, $dst_folder, "$base/$u\.jis");
						}
						if ($uid_new) {
							push(@success, $u);
						} else {
							push(@false, $u);
						}
					}
					if (scalar(@false)) {
						if (&_delete_header_local($session, $imaps, { "uidlst" => \@success, "target" => $target })) {
							&_delete_uidlst_common($session, $fid, \@success);
							&_warn($session, "Can't move mail [local]");
							$error = &error("NOT_MOVE_MAIL_LOCAL", 9);
						} else {
							&_warn($session, "_delete_header_local");
							$error = &error("NOT_DELETE_HEADER_LOCAL", 9);
						}
					} else {
						if (&_delete_header_local($session, $imaps, { "mode" => "all", "target" => $target })) {
							unless (&_clear_uidlst_common($session, $fid)) {
								&_warn($session, "_clear_uidlst_common");
							}
						} else {
							&_warn($session, "_delete_header_local");
							$error = &error("NOT_DELETE_HEADER_LOCAL", 9);
						}
					}
				} else {
					&_warn($session, "_select_header_local");
					$error = &error("NOT_SELECT_HEADER_LOCAL", 9);
				}
			} else {
				my @uidlst = split(/\,/, $uids);				
				if (scalar(@uidlst)) {
					my (@success, @false);
					foreach my $u (@uidlst) {
					my $uid_new;
					#backup mail file dir  
					if($target eq 'backup') {
						$uid_new = &_append($session, $imaps, $dst_folder, "$base/$u/$u\.jis");
					}else {
						$uid_new = &_append($session, $imaps, $dst_folder, "$base/$u\.jis");
					}	
					if ($uid_new) {
						push(@success, $u);							
						if($target eq 'backup') {
							if (&_select($session, $imaps, $dst_folder)) {
								&_seen($session, $imaps, $uid_new);
							}else {
								&_warn($session, "_select");
								$error = &error("NOT_SELECT_FOLDER", 9);
							}
						}
						} else {
							push(@false, $u);
						}
					}

					if (scalar(@success)) {
						if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
							my $so = {
								"uidlst" => \@success,
								"output" => [qw(uid_number seen to_field from_field date_field subject_field)]
							};
							$detail = &_select_header_local($session, $imaps, $so);
							my $folder_old = &_local_folder($session,$imaps);
							my $folder_new = &_utf7_decode($session, $imaps, $dst_folder);
							my $log = [];
							my $org_flag = 0;
							my $gid = 0;
							my $trash = 0;
							if(DA::OrgMail::use_org_mail($session)){
								$org_flag = 1;
								$gid = DA::OrgMail::get_gid($session);
							}
							if(&_is_trash($session, $imaps, $dst_folder)){
								$trash = 1;
							}
							foreach my $dum (@{$detail}) {
								my $oplog = {
										"app"    => "mail",
										"docid"  => "ajax/mail/$session->{user}/$fid/$dum->{uid_number}",
										"type"   => "MV",
										"detail" => {
												"folder_old" => $folder_old->{name},
												"folder_new" => $folder_new,
												"To"		 => $dum->{to_field},
												"From"       => $dum->{from_field},
												"Date"       => $dum->{date_field},
												"Subject"    => $dum->{subject_field}
				 						}
								};
								if($org_flag){
									if($trash){
										$oplog->{type} = "MTO";
								 	}else{
										$oplog->{type} = "MVO";
									}
									$oplog->{detail}->{gid} = $gid;
								}else{
									 if($trash){
										 $oplog->{type} = "MT";
									  }
								}
								push (@{$log},$oplog);
							}
							DA::OperationLog::log($session, $log);
						}
						if (&_delete_header_local($session, $imaps, { "uidlst" => \@success, "target" => $target })) {
							&_delete_uidlst_common($session, $fid, \@success);
							if (scalar(@false)) {
								&_warn($session, "Can't move mail [local]");
								$error = &error("NOT_MOVE_MAIL_LOCAL", 9);
							}
						} else {
							&_warn($session, "_delete_header_local");
							$error = &error("NOT_DELETE_HEADER_LOCAL", 9);
						}
					} else {
						if (scalar(@false)) {
							&_warn($session, "Can't move mail [local]");
							$error = &error("NOT_MOVE_MAIL_LOCAL", 9);
						}
					}
				}
			}
		} else {
			&_warn($session, "_select");
			$error = &error("NOT_SELECT_FOLDER", 9);
		}

		&unlock($session, "trans.local");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);
	return($result);
}

sub delete_mail($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	if (&_fid2type($session, $imaps, $folders, $c->{fid}) =~ /^($TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) {
		if ($c->{uid}) {
			$c->{uid} = &_select_uidlst_common($session, $c->{fid}, $c->{uid}, undef, 2);
		}
		if ($c->{area}) {
			$c->{uid} = &_join_uidlst($c->{uid}, &_select_uidlst_common($session, $c->{fid}, $c->{area}));
		}
		return(&delete_mail_local($session, $imaps, $vfilter, $folders, $c));
	} else {
		if ($c->{srid}) {
			my $area;
			if ($c->{area}) {
				$area = &_select_uidlst_search($session, $c->{srid}, $c->{area}, undef, 1, $c->{fid});
			} else {
				$area = &_select_uidlst_search($session, $c->{srid}, $c->{uid}, undef, 1, $c->{fid});
			}

			my $bc  = {}; %{$bc} = %{$c};
			my $res = {};
			foreach my $key (sort {$a <=> $b} keys %{$area}) {
				$bc->{fid} = $key;
				if ($c->{area} && $c->{fid} eq $key) {
					$bc->{uid} = &_join_uidlst($c->{uid}, $area->{$key});
				} else {
					$bc->{uid} = join(",", @{$area->{$key}});
				}

				my $res1 = &delete_mail_server($session, $imaps, $vfilter, $folders, $bc);
				if ($res1->{error}) {
					return($res1);
				} else {
					my $res2 = &delete_mail_search($session, $imaps, $vfilter, $folders, $bc);
					if ($res2->{error}) {
						return($res2);
					} else {
						$res1->{total}->{fid} = $bc->{fid};
						push(@{$res->{counts}}, $res1->{total});
					}
				}
			}

			return($res);
		} else {
			if ($c->{uid}) {
				$c->{uid} = &_select_uidlst_common($session, $c->{fid}, $c->{uid}, undef, 2);
			}
			if ($c->{area}) {
				$c->{uid} = &_join_uidlst($c->{uid}, &_select_uidlst_common($session, $c->{fid}, $c->{area}));
			}
			return(&delete_mail_server($session, $imaps, $vfilter, $folders, $c));
		}
	}
}

sub delete_mail_server($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger       = &_logger_init($session);
	my $fid          = $c->{fid};
	my $cid          = $c->{cid};
	my $uids         = $c->{uid};
	my $search_field = $c->{search_field};
	my $search_word  = $c->{search_word};
	my $nocount      = $c->{nocount};
	my $folder       = &_fid2folder($session, $imaps, $folders, $fid);
	my $uidval       = &_fid2uidval($session, $imaps, $folders, $fid);
	my $type         = &_fid2type($session, $imaps, $folders, $fid);
	my $dummy        = &_fid2dummy($session, $imaps, $folders, $fid);
	my $result       = {};
	my $error;

	my $detail = [];
	my $seenlst = [];

	&_set_uid_flag($session, $imaps);

	my $path      = &_fid2path($session, $imaps, $folders, $fid);
	my $md5_path  = Digest::MD5::md5_hex($path);
	if (&lock($session, "trans.$md5_path")) {
		if (&_select($session, $imaps, $folder)) {
			if ($uids =~ /^(all|deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
				my $where  = &_vfilter_where($session, $imaps, $vfilter, $cid);
				my $search = &_search_where($session, $imaps, $search_field, $search_word);

				if ($uids =~ /^(deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
					push(@{$where}, &_uids2where($uids));
				}

				my $sc = {
					"folder" => $folder,
					"uidval" => $uidval,
					"where"  => $where,
					"search" => $search,
					"output" => [qw(uid_number)],
					"list"   => 1
				};

				if (my $uidlst = &_select_header($session, $imaps, $sc)) {
					my $nos = &_number(join(",", @{$uidlst}));
					if (scalar(@{$nos})) {
						my ($inc, @success, @false);
						foreach my $n (@{$nos}) {
							if (&_deleted($session, $imaps, $n)) {
								push(@success, @{&_number2array($n)});
							} else {
								push(@false, @{&_number2array($n)});
							}
						}
						unless ($nocount){
							if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
								if(scalar(@success)){
									my $so = {
										"folder" => $folder,
										"uidval" => $uidval,
										"uidlst" => \@success,
										"output" => [qw(uid_number seen to_field from_field date_field subject_field)]
									};
									$seenlst = &_select_header($session, $imaps, $so);
									my $log = [];
									my $folder_old = &_utf7_decode($session, $imaps, $folder);
									foreach my $dum (@{$seenlst}) {
										my $oplog = {
												"app"    => "mail",
												"docid"  => "ajax/mail/$session->{user}/$fid/$dum->{uid_number}",
												"type"   => "MR",
												"detail" => {
														"folder"     => $folder_old,
														"To"		 => $dum->{to_field},
														"From"       => $dum->{from_field},
														"Date"       => $dum->{date_field},
														"Subject"    => $dum->{subject_field}
												}
										};
										if(DA::OrgMail::use_org_mail($session)){
											my $gid = DA::OrgMail::get_gid($session);
											$oplog->{type} = "MRO";
											$oplog->{detail}->{gid} = $gid;
										}
										push (@{$log},$oplog);
									}
									DA::OperationLog::log($session, $log);
								}
							}
						}
						if (scalar(@false)) {
							my $dc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => \@success
							};
							if (&_delete_header($session, $imaps, $dc)) {
								$inc = 1;
								&_delete_uidlst_common($session, $fid, \@success);
								&_warn($session, "Can't delete mail [$folder]");
								$error = &error("NOT_DELETE_MAIL", 9);
							} else {
								&_warn($session, "_delete_header");
								$error = &error("NOT_DELETE_HEADER_TABLE", 9);
							}
						} else {
							my $dc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"where"  => $where,
								"search" => $search
							};
							if (&_delete_header($session, $imaps, $dc)) {
								$inc = 1;
								&_delete_uidlst_common($session, $fid, $uidlst);
							} else {
								&_warn($session, "_delete_header");
								$error = &error("NOT_DELETE_HEADER_TABLE", 9);
							}
						}
						if ($inc) {
							if (!$nocount) {
								if (&re_count($session, $imaps, $folder, $uidval, 1)) {
									if (my $cnt = &count($session, $imaps, $folder, $uidval)) {
										$result->{total} = &view_count($session, $imaps, $cnt, $type, $dummy, 1);
									} else {
										&_warn($session, "count");
										$error = &error("NOT_GET_COUNT", 9);
									}
								} else {
									&_warn($session, "re_count");
									$error = &error("NOT_GET_COUNT", 9);
								}
							}
							unless (&_expunge($session, $imaps)) {
								&_warn($session, "_expunge");
							}
							if ($type eq $TYPE_INBOX) {
								&set_portal_reload($session, $imaps);
							} else {
								if ($imaps->{portal}->{ml_target} eq "all") {
									&set_portal_reload($session, $imaps);
								}
							}
						}
					}
				} else {
					&_warn($session, "_select_header");
					$error = &error("NOT_SELECT_HEADER_TABLE", 9);
				}
			} else {
				my $nos = &_number($uids);
				my $cyrus   = &check_is_cyrus($imaps);
				my $del_ids = 0;
				if (scalar(@{$nos})) {
					my (@success, @false);
					foreach my $n (@{$nos}) {
						if (my $result = &_deleted($session, $imaps, $n, $cyrus)) {
							if (ref($result) eq "ARRAY") {
								$del_ids += (scalar(@{$result} - 2)); # for Cyrus only
							}
							push(@success, @{&_number2array($n)});
						} else {
							push(@false, @{&_number2array($n)});
						}
					}

					if (scalar(@success)) {
						my @output = qw(uid_number seen);
						if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
							@output = qw(uid_number seen to_field from_field date_field subject_field);
						}
						my $sc = {
							"folder" => $folder,
							"uidval" => $uidval,
							"uidlst" => \@success,
							"output" => [@output]
						};
						if ($seenlst = &_select_header($session, $imaps, $sc)) {
							unless ($nocount){
								if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
									my $log = [];
									my $folder_old = &_utf7_decode($session, $imaps, $folder);
									foreach my $dum (@{$seenlst}) {
										my $oplog = {
											"app"    => "mail",
											"docid"  => "ajax/mail/$session->{user}/$fid/$dum->{uid_number}",
											"type"   => "MR",
											"detail" => {
												"folder"     => $folder_old,
												"To"	 => $dum->{to_field},
												"From"       => $dum->{from_field},
												"Date"       => $dum->{date_field},
												"Subject"    => $dum->{subject_field}
											}
										};
										if(DA::OrgMail::use_org_mail($session)){
											my $gid = DA::OrgMail::get_gid($session);
											$oplog->{type} = "MRO";
											$oplog->{detail}->{gid} = $gid;
										}
										push (@{$log},$oplog);
									}
									DA::OperationLog::log($session, $log);
								}
							}
							my $inc;
							my $dc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => \@success
							};
							if (&_delete_header($session, $imaps, $dc)) {
								$inc = 1;
								&_delete_uidlst_common($session, $fid, \@success);
								if (scalar(@false)) {
									&_warn($session, "Can't delete mail [$folder]");
									$error = &error("NOT_DELETE_MAIL", 9);
								}
							} else {
								&_warn($session, "_delete_header");
								$error = &error("NOT_DELETE_HEADER_TABLE", 9);
							}
							if ($inc) {
								if (!$nocount) {
									my $lst = {};
									foreach my $key (@{$seenlst}) {
										$lst->{$key->{uid_number}}->{seen} = $key->{seen};
										$lst->{$key->{uid_number}}->{uid_number} = $key->{uid_number};
									}
									my ($de, $ds) = &_diff_count($lst, \@success, "delete");
									my $count = {
										"exists_count" => $de,
										"unseen_count" => $ds
									};
									if (my $cnt = &inc_count($session, $imaps, $folder, $uidval, $count)) {
										$result->{total} = &view_count($session, $imaps, $cnt, $type, $dummy, 1);
									} else {
										&_warn($session, "inc_count");
										$error = &error("NOT_INC_COUNT", 9);
									}
								}
								unless (&_expunge($session, $imaps)) {
									&_warn($session, "_expunge");
								}
								if ($type eq $TYPE_INBOX) {
									&set_portal_reload($session, $imaps);
								} else {
									if ($imaps->{portal}->{ml_target} eq "all") {
										&set_portal_reload($session, $imaps);
									}
								}
							}
						} else {
							&_warn($session, "_select_header");
							$error = &error("NOT_SELECT_HEADER_TABLE", 9);
						}
					} else {
						if (scalar(@false)) {
							&_warn($session, "Can't delete mail [$folder]");
							$error = &error("NOT_DELETE_MAIL", 9);
						}
					}
				}
				if ($cyrus) {
					my @tol = split(/\,/, $uids);
					my $sub_ids = ( scalar(@tol) - $del_ids);
					if ( $sub_ids ) {
						$error = &error("NOT_DELETE_ALL_MAIL", 9, ($sub_ids));
					}
				}
			}
		} else {
			&_warn($session, "_select");
			$error = &error("NOT_SELECT_FOLDER", 9);
		}

		&unlock($session, "trans.$md5_path");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub delete_mail_local($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $cid    = $c->{cid};
	my $uids   = $c->{uid};
	my $type   = &_fid2type($session, $imaps, $folders, $fid);
	my $target = &is_backup($session, $imaps, $type) ? "backup" : "sent";
	my $result = {};
	my $error;

	my $detail = [];

	if (&lock($session, "trans.local")) {
		if ($uids =~ /^(all)$/) {
			if (&_delete_header_local($session, $imaps, { "mode" => "all", "target" => $target })) {
				unless (&_clear_uidlst_common($session, $fid)) {
					&_warn($session, "_clear_uidlst_common");
				}
			} else {
				&_warn($session, "_delete_header_local");
				$error = &error("NOT_DELETE_HEADER_LOCAL", 9);
			}
		} else {
			my @uidlst = split(/\,/, $uids);

			if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
				my $so = {
					"uidlst" => \@uidlst,
					"output" => [qw(uid_number seen to_field from_field date_field subject_field)]
				};
				$detail = &_select_header_local($session, $imaps, $so);
			}

			if (scalar(@uidlst)) {
				if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
					my $log = [];
					my $folder_old = &_local_folder($session,$imaps);
					foreach my $dum (@{$detail}){
						my $oplog = {
							"app"    => "mail",
							"docid"  => "ajax/mail/$session->{user}/$fid/$dum->{uid_number}",
							"type"   => "MR",
							"detail" => {
								"folder"     => $folder_old->{name},
								"To"         => $dum->{to_field},
								"From"       => $dum->{from_field},
								"Date"       => $dum->{date_field},
								"Subject"    => $dum->{subject_field}
							}
						};
						if(DA::OrgMail::use_org_mail($session)){
							my $gid = DA::OrgMail::get_gid($session);
							$oplog->{type} = "MRO";
							$oplog->{detail}->{gid} = $gid;
						}
						push (@{$log},$oplog);
					}
					DA::OperationLog::log($session, $log);
				}
				if (&_delete_header_local($session, $imaps, { "uidlst" => \@uidlst, "target" => $target })) {
					&_delete_uidlst_common($session, $fid, \@uidlst);
				} else {
					&_warn($session, "_delete_header_local");
					$error = &error("NOT_DELETE_HEADER_LOCAL", 9);
				}
			}
		}

		&unlock($session, "trans.local");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}
	&_logger($session, $imaps, $logger);
	return($result);
}

sub delete_mail_search($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $cid    = $c->{cid};
	my $uids   = $c->{uid};
	my $srid   = $c->{srid};
	my $result = {};
	my $error;

	if (&lock($session, "trans.search")) {
		if ($uids =~ /^(all|deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
			my @wheres;
			if ($uids eq "deleted") {
				push(@wheres, { "column" => "deleted", "value" => 1 });
			} elsif ($uids eq "undeleted") {
				push(@wheres, { "column" => "deleted", "value" => 0 });
			} elsif ($uids eq "seen") {
				push(@wheres, { "column" => "seen", "value" => 1 });
			} elsif ($uids eq "unseen") {
				push(@wheres, { "column" => "seen", "value" => 0 });
			} elsif ($uids eq "flagged") {
				push(@wheres, { "column" => "flagged", "value" => 1 });
			} elsif ($uids eq "unflagged") {
				push(@wheres, { "column" => "flagged", "value" => 0 });
			}
			my $dc = {
				"srid"  => $srid,
				"where" => \@wheres
			};
			if (&_delete_header_search($session, $imaps, $dc)) {
				unless (&_clear_uidlst_search($session, $srid)) {
					&_warn($session, "_clear_uidlst_common");
				}
			} else {
				&_warn($session, "_delete_header_search");
				$error = &error("NOT_DELETE_HEADER_SEARCH", 9);
			}
		} else {
			my @uidlst;
			foreach my $u (split(/\,/, $uids)) {
				push(@uidlst, "$fid\_$u");
			}
			if (scalar(@uidlst)) {
				my $dc = {
					"srid"   => $srid,
					"uidlst" => \@uidlst
				};
				if (&_delete_header_search($session, $imaps, $dc)) {
					&_delete_uidlst_search($session, \@uidlst, $srid);
				} else {
					&_warn($session, "_delete_header_search");
					$error = &error("NOT_DELETE_HEADER_SEARCH", 9);
				}
			}
		}

		&unlock($session, "trans.search");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub import_mail($$;$$$) {
	my ($session, $imaps, $vfiter, $folders, $c) = @_;

	DA::Custom::import_mail4ajx($session, $imaps, $vfiter, $folders, $c);
	#　一時ファイルをロック
	my $lock;
	my $org_mail_permit = 0;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$org_mail_permit = 1;
		$lock = DA::OrgMail::folder_lock($session);
	}
	if (!$org_mail_permit || $lock) {
		my $uc  = { "fid" => $c->{fid}, "noupdate" => 1 };
		my $rim = &import_mail_server($session, $imaps, $vfiter, $folders, $c);
		if ($rim->{error}) {
			#　一時ファイルのロックを削除
			DA::OrgMail::folder_unlock($session, "lock.folders");
			return($rim);
		} else {
			my $rum = &update($session, $imaps, $folders, $uc);
			if ($rum->{error}) {
				#　一時ファイルのロックを削除
				DA::OrgMail::folder_unlock($session, "lock.folders");
				return($rum);
			} else {
				#　一時ファイルのロックを削除
				DA::OrgMail::folder_unlock($session, "lock.folders");
				%{$rim->{total}} = ref($rum->{total}) eq 'HASH' ? %{$rum->{total}} : ();
				return($rim);
			}
		}
	} else {
		&_warn($session, "lock:lock.folders");
		return &error("NOT_LOCK_FOLDERS", 9);
	}
}

sub import_mail_server($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger       = &_logger_init($session);
	my $max          = $imaps->{system}->{max_import_size};
	my $fid          = $c->{fid};
	my $archive_type = $c->{archive_type};
	my $upload       = $c->{upload};
	my $folder       = &_fid2folder($session, $imaps, $folders, $fid);
	my $uidval       = &_fid2uidval($session, $imaps, $folders, $fid);
	my $content      = $upload->info->get("Content-Disposition");
	my $atype        = $upload->type;
	   $atype        =~s/\s//og;
	my $asize        = $upload->size;
	my $result       = {};
	my ($afile, $aname, $aext, $error);

	if ($content =~ /filename=\"(.+)\"$/) {
		$afile = $1;
	} else {
		$afile = $upload->filename;
	}
	if ($afile eq "") {
		return(&error("NO_INPUT_QUERY", 1, t_("インポートファイル")));
	} else {
		$afile = DA::Valid::check_filename($afile);
		$afile = DA::Charset::convert(\$afile, &external_charset(), &mailer_charset());
		($aname, $aext) = &get_filename($afile, 1);
	}
	if ($max && $max < $asize) {
		return(&error("OVER_IMPORT_SIZE", 1));
	}

	&_set_uid_flag($session, $imaps);

	my $path      = &_fid2path($session, $imaps, $folders, $fid);
	my $md5_path  = Digest::MD5::md5_hex($path);
	if (&lock($session, "trans.$md5_path")) {
		if (&lock($session, "import")) {
		if (&_select($session, $imaps, $folder)) {
			my $sec = (DA::OrgMail::check_org_mail_permit($session))?DA::OrgMail::get_gid($session):$session->{user};
			my $tfile = "$session->{temp_dir}/$session->{sid}\.$sec\.mimport-archive";
			my ($tmp, $err) = &file_upload($session, $upload, $tfile, $atype, &external_charset());

			if ($err) {
				$error = { "error" => 9, "message" => $err };
			} else {
				my $filecmd = DA::System::bq_cmd("file %1",$tfile);

				if ($filecmd =~ /\slha\s/i) {
					if ($archive_type ne 'lha') {
						$error = &error("UNMATCH_ARCHIVE_TYPE", 9);
					}
				} elsif ($filecmd =~ /\sgzip\s/i) {
					if ($archive_type ne 'tar') {
						$error = &error("UNMATCH_ARCHIVE_TYPE", 9);
					}
				} elsif ($filecmd =~ /\szip\s/i) {
					if ($archive_type ne 'zip') {
						$error = &error("UNMATCH_ARCHIVE_TYPE", 9);
					}
				} else {
					if ($archive_type ne 'eml' && $archive_type ne 'mbox') {
						$error = &error("UNMATCH_ARCHIVE_TYPE", 9);
					}
				}

				unless ($error) {
					my $count = &_import_archive($session, $imaps, $folder, $tfile, $archive_type, $sec);
					if($count eq 0){
						&_warn($session, "_import_archive");
						$error = &error("NOT_IMPORT_ARCHIVE", 9);
					}else{
						my $folder_target = &_utf7_decode($session, $imaps, $folder);
						my $oplog = {
                        	"app"    => "mail",
                            "docid"  => "ajax/mail/$session->{user}/$fid",
                            "type"   => "MI",
                            "detail" => {
								"uidval"	=> $uidval,
                		        "folder"    => $folder_target,
                                "num"       => $count
                            }
                        };
						if(DA::OrgMail::use_org_mail($session)){
                            my $gid = DA::OrgMail::get_gid($session);
                            $oplog->{type} = "MIO";
                            $oplog->{detail}->{gid} = $gid;
                        }
                        DA::OperationLog::log($session, $oplog);
					}
				}
			}
		} else {
			&_warn($session, "_select");
			$error = &error("NOT_SELECT_FOLDER", 9);
		}

			&unlock($session, "import");
		} else {
			&_warn($session, "Can't lock [import]");
			$error = &error("NOT_LOCK", 9);
		}

		&unlock($session, "trans.$md5_path")
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub export_mail($$;$$$) {
	my ($session, $imaps, $vfiter, $folders, $c) = @_;

	if ($c->{uid}) {
		$c->{uid} = &_select_uidlst_common($session, $c->{fid}, $c->{uid}, undef, 2);
	}
	if ($c->{area}) {
		$c->{uid} = &_join_uidlst($c->{uid}, &_select_uidlst_common($session, $c->{fid}, $c->{area}));
	}
	return(&export_mail_server($session, $imaps, $vfiter, $folders, $c));
}

sub export_mail_server($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger       = &_logger_init($session);
	my $fid          = $c->{fid};
	my $cid          = $c->{cid};
	my $uids         = $c->{uid};
	my $search_field = $c->{search_field};
	my $search_word  = $c->{search_word};
	my $archive      = $c->{archive};
	my $folder       = &_fid2folder($session, $imaps, $folders, $fid);
	my $uidval       = &_fid2uidval($session, $imaps, $folders, $fid);
	my $type         = &_fid2type($session, $imaps, $folders, $fid);
	my $result       = {};
	my $error;
	#　一時ファイルをロック
	my $lock;

	my $detail = [];

	my $org_mail_permit = 0;

	if (DA::OrgMail::check_org_mail_permit($session)) {
		$org_mail_permit = 1;
		$lock = DA::OrgMail::folder_lock($session);
	}
	if (!$org_mail_permit || $lock) {
	&_set_uid_flag($session, $imaps);

	my $path      = &_fid2path($session, $imaps, $folders, $fid);
	my $md5_path  = Digest::MD5::md5_hex($path);
	if (&lock($session, "trans.$md5_path")) {
		my $arc_name = 0;
		if($imaps->{mail}->{archive_name} eq "on"){
			$arc_name = 1;
		}
		if (&_select($session, $imaps, $folder)) {
			my $uidlst = [];
			if ($uids =~ /^(all|deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
				my $where  = &_vfilter_where($session, $imaps, $vfilter, $cid);
				my $search = &_search_where($session, $imaps, $search_field, $search_word);

				if($uids =~ /^(all)$/){
					$archive = 2;
				}
				if ($uids =~ /^(deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
					push(@{$where}, &_uids2where($uids));
				}
				my @output = qw(uid_number);

				if($arc_name || $DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
					@output = qw(uid_number seen to_field from_field date_field subject_field);
				}

				my $sc = {
					"folder" => $folder,
					"uidval" => $uidval,
					"where"  => $where,
					"search" => $search,
					"output" => [@output]
				};
				unless ($detail = &_select_header($session, $imaps, $sc)) {
					&_warn($session, "_select_header");
					$error = &error("NOT_SELECT_HEADER_TABLE", 9);
				}
				foreach my $select (@{$detail}){
					push (@{$uidlst},$select->{uid_number});
				} 
			} else {
				$uidlst = [(sort {$a <=> $b} split(/,/, $uids))];

				if($arc_name || $DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
                   my $so = {
                       	"folder" => $folder,
                      	"uidval" => $uidval,
                      	"uidlst" => $uidlst,
                      	"output" => [qw(uid_number seen to_field from_field date_field subject_field)]
                   	};
                    $detail = &_select_header($session, $imaps, $so);
				}
			}
			if (!$error) {		
				DA::Custom::rewrite_export_mail_targets($session, $imaps, $vfilter, $folders, $c, $uidlst);
				if (scalar(@{$uidlst})) {
					if (&lock($session, "export")) {
					if (my ($file,$file_name) = &_make_archive($session, $imaps, $uidlst, $uidval, $archive, $folders, $fid, $arc_name, $detail)) {
						$result = {
							"file" => $file
						};
						if(defined($file_name)){
							my $cipher=new Crypt::CBC($session->{sid},'Blowfish');
							$file_name=$cipher->encrypt($file_name);
							$file_name=unpack("H*",$file_name);
							$result->{"file_name"} = $file_name;
						}
						if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
				            my $log = [];
                			my $folder_target = &_utf7_decode($session, $imaps, $folder);
							foreach my $dum (@{$detail}) {
                                my $oplog = {
                                    "app"    => "mail",
                                    "docid"  => "ajax/mail/$session->{user}/$fid/$dum->{uid_number}",
                                    "type"   => "ME",
                                    "detail" => {
                                         "folder"     => $folder_target,
                                         "To"         => $dum->{to_field},
                                         "From"       => $dum->{from_field},
                                         "Date"       => $dum->{date_field},
                                         "Subject"    => $dum->{subject_field}
                                    }
                                };
								if(DA::OrgMail::use_org_mail($session)){
                                     my $gid = DA::OrgMail::get_gid($session);
                                     $oplog->{type} = "MEO";
                                     $oplog->{detail}->{gid} = $gid;
                                }
								push (@{$log},$oplog);
							}
							DA::OperationLog::log($session,$log)
                    	}
					} else {
						&_warn($session, "_make_archive");
						$error = &error("NOT_MAKE_ARCHIVE", 9);
					}
					&unlock($session, "export");
				} else {
					&_warn($session, "Can't lock [export]");
					$error = &error("NOT_LOCK", 9);
				}

				} else {
					&_warn($session, "_no_target_mail");
					$error = &error("NO_TARGET_MAIL", 2);
				}
			}
		} else {
			&_warn($session, "_select");
			$error = &error("NOT_SELECT_FOLDER", 9);
		}
		&unlock($session, "trans.$md5_path")
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}
		#　一時ファイルのロックを削除
		DA::OrgMail::folder_unlock($session, "lock.folders");
	} else {
		&_warn($session, "lock:lock.folders");
		$error = &error("NOT_LOCK_FOLDERS", 9);
	}

	if ($error) {
		$result = $error;
	}
	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub join_mail($$;$$$) {
	my ($session, $imaps, $vfiter, $folders, $c) = @_;

	if ($c->{uid}) {
		$c->{uid} = &_select_uidlst_common($session, $c->{fid}, $c->{uid}, undef, 2);
	}
	if ($c->{area}) {
		$c->{uid} = &_join_uidlst($c->{uid}, &_select_uidlst_common($session, $c->{fid}, $c->{area}));
	}
	return(&join_mail_server($session, $imaps, $vfiter, $folders, $c));
}

sub join_mail_server($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger       = &_logger_init($session);
	my $fid          = $c->{fid};
	my $cid          = $c->{cid};
	my $uids         = $c->{uid};
	my $search_field = $c->{search_field};
	my $search_word  = $c->{search_word};
	my $folder       = &_fid2folder($session, $imaps, $folders, $fid);
	my $uidval       = &_fid2uidval($session, $imaps, $folders, $fid);
	my $type         = &_fid2type($session, $imaps, $folders, $fid);
	my $result       = {};
	my $error;

	&_set_uid_flag($session, $imaps);

	my $path      = &_fid2path($session, $imaps, $folders, $fid);
	my $md5_path  = Digest::MD5::md5_hex($path);
	if (&lock($session, "trans.$md5_path")) {
		if (&_select($session, $imaps, $folder)) {
			my $uidlst = [];
			if ($uids =~ /^(all|deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
				my $where  = &_vfilter_where($session, $imaps, $vfilter, $cid);
				my $search = &_search_where($session, $imaps, $search_field, $search_word);

				if ($uids =~ /^(deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
					push(@{$where}, &_uids2where($uids));
				}

				my $sc = {
					"folder" => $folder,
					"uidval" => $uidval,
					"where"  => $where,
					"search" => $search,
					"output" => [qw(uid_number)],
					"list"   => 1
				};
				unless ($uidlst = &_select_header($session, $imaps, $sc)) {
					&_warn($session, "The practice of the '_select_header' function failed");
					$error = &error("NOT_SELECT_HEADER_TABLE", 9);
				}
			} else {
				$uidlst = [(sort {$a <=> $b} split(/,/, $uids))]
			}
			if (!$error) {
				my $join_fid = &_join_fid($session, $imaps, $folders);
				if (scalar(@{$uidlst})) {
					if (my $res = &_join_rfc822($session, $imaps, $join_fid, $uidlst)) {
						$result = {
							"fid" => $res->{fid},
							"uid" => $res->{uid}
						};
					} else {
						&_warn($session, "The practice of the '_join_rfc822' function failed");
						$error = &error("NOT_JOIN_RFC822", 9);
					}
				} else {
					&_warn($session, "An email is not selected");
					$error = &error("NO_TARGET_MAIL", 2);
				}
			}
		} else {
			&_warn($session, "The practice of the '_select' function failed");
			$error = &error("NOT_SELECT_FOLDER", 9);
		}

		&unlock($session, "trans.$md5_path")
	} else {
		&_warn($session, "Can't lock [trans.$fid]");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub _join_rfc822($$$$) {
	my ($session, $imaps, $fid, $uidlst) = @_;

	my $parse = sub {
		my ($line) = @_;
		my $data = {};

		foreach my $p (split(/[\s\;]+/, $line)) {
			if ($p =~ /\=/) {
				my ($k, $v) = split(/\=/, $p);
				$data->{$k} = $v;
			}
		}

		return($data);
	};

	my ($id, $total, %sort);
	my $n = 0;
	my @field = qw(Content-Type);
	foreach my $u (@{$uidlst}) {
		if (my $header = &_parse_headers($session, $imaps, $u, \@field)) {
			my $ctype;
			if ($header->{$u}->{"Content-Type"}) {
				foreach my $t (@{$header->{$u}->{"Content-Type"}}) {
					if ($t =~ /message\/partial/i) {
						$ctype = $t; last;
					}
				}
			}

			unless ($ctype) {
				&_warn($session, "The Content-Type does not support it [$ctype]");
				return(undef);
			}

			my $data = $parse->($ctype);

			if ($id) {
				if ($id ne $data->{id}) {
					&_warn($session, "Id is different [$id != $data->{id}]");
					return(undef);
				}
			} else {
				$id = $data->{id};
				$total = $data->{total};
			}

			$sort{$data->{number}} = $u;
			$n ++;

			if ($n > $total) {
				&_warn($session, "There is too many it [total=$total, n=$n]");
				return(undef);
			}
		} else {
			&_warn($session, "The practice of the '_parse_headers' function failed");
			return(undef);
		}
	}

	if ($total ne $n) {
		&_warn($session, "A number is not right [total=$total, n=$n]");
		return(undef);
	}

	my $uid = &inc_num($session, "joinid");
	unless ($uid) {
		&_warn($session, "The practice of the 'inc_num' function failed");
		return(undef);
	}

	my $func_rfc822 = "$fid\.$uid\.rfc822";
	my ($header_buffer, $header_limited);
	if (my $fh = &open_cache($session, $func_rfc822, "w")) {
		my @sort = (sort { $a <=> $b } keys %sort);
		while (my @l = splice(@sort, 0, $MAX_JOIN_STN)) {
			my @uids = @sort{@l};
			if (my $rfc822 = &_rfc822($session, $imaps, join(",", @uids))) {
				foreach my $u (@uids) {
					my ($header, $body) = split(/(?:\r\n\r\n|\n\n)/, $rfc822->{$u}, 2);
					print $fh $body . "\n";

					if (!$header_limited) {
						if ($body =~ /(?:\r\n\r\n|\n\n)/) {
							my ($h, $b) = split(/(?:\r\n\r\n|\n\n)/, $body, 2);
							$header_buffer .= $h . "\n";
							$header_limited = 1;
						} else {
							$header_buffer .= $body . "\n";
						}
					}
				}
			} else {
				&_warn($session, "The practice of the '_rfc822' function failed");
				return(undef);
			}
		}
		unless (&close_cache($session, $func_rfc822, $fh)) {
			&_warn($session, "Can't close file [$func_rfc822]");
			return(undef);
		}
	} else {
		&_warn($session, "Can't open file [$func_rfc822]");
		return(undef);
	}

	my $func_header = "$fid\.$uid\.header";
	if (my $fh = &open_cache($session, $func_header, "w")) {
		print $fh $header_buffer;
		unless (&close_cache($session, $func_header, $fh)) {
			&_warn($session, "Can't close file [$func_header]");
			return(undef);
		}
	} else {
		&_warn($session, "Can't open file [$func_header]");
		return(undef);
	}

	return({
		"fid" => $fid,
		"uid" => $uid
	});
}

sub deleted_mail($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&flag_mail_join($session, $imaps, $vfilter, $folders, $c, "deleted"));
	} else {
		return(&flag_mail($session, $imaps, $vfilter, $folders, $c, "deleted"));
	}
}

sub undeleted_mail($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&flag_mail_join($session, $imaps, $vfilter, $folders, $c, "undeleted"));
	} else {
		return(&flag_mail($session, $imaps, $vfilter, $folders, $c, "undeleted"));
	}
}

sub seen_mail($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&flag_mail_join($session, $imaps, $vfilter, $folders, $c, "seen"));
	} else {
		return(&flag_mail($session, $imaps, $vfilter, $folders, $c, "seen"));
	}
}

sub unseen_mail($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&flag_mail_join($session, $imaps, $vfilter, $folders, $c, "unseen"));
	} else {
		return(&flag_mail($session, $imaps, $vfilter, $folders, $c, "unseen"));
	}
}

sub flagged_mail($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&flag_mail_join($session, $imaps, $vfilter, $folders, $c, "flagged"));
	} else {
		return(&flag_mail($session, $imaps, $vfilter, $folders, $c, "flagged"));
	}
}

sub unflagged_mail($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&flag_mail_join($session, $imaps, $vfilter, $folders, $c, "unflagged"));
	} else {
		return(&flag_mail($session, $imaps, $vfilter, $folders, $c, "unflagged"));
	}
}

sub replied_mail($$;$$$){
	my ($session, $imaps, $vfilter, $folders, $c) = @_;

	&unforwarded_mail($session, $imaps, $vfilter, $folders, $c);
	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&flag_mail_join($session, $imaps, $vfilter, $folders, $c, "replied"));
	} else {
		return(&flag_mail($session, $imaps, $vfilter, $folders, $c, "replied"));
	}
}

sub unreplied_mail($$;$$$){
	my ($session, $imaps, $vfilter, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&flag_mail_join($session, $imaps, $vfilter, $folders, $c, "unreplied"));
	} else {
		return(&flag_mail($session, $imaps, $vfilter, $folders, $c, "unreplied"));
	}
}

sub forwarded_mail($$;$$$){
	my ($session, $imaps, $vfilter, $folders, $c) = @_;

	&unreplied_mail($session, $imaps, $vfilter, $folders, $c);
	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&flag_mail_join($session, $imaps, $vfilter, $folders, $c, "forwarded"));
	} else {
		return(&flag_mail($session, $imaps, $vfilter, $folders, $c, "forwarded"));
	}
}

sub unforwarded_mail($$;$$$){
	my ($session, $imaps, $vfilter, $folders, $c) = @_;

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&flag_mail_join($session, $imaps, $vfilter, $folders, $c, "unforwarded"));
	} else {
		return(&flag_mail($session, $imaps, $vfilter, $folders, $c, "unforwarded"));
	}
}

sub flag_mail($$;$$$$) {
	my ($session, $imaps, $vfilter, $folders, $c, $opt) = @_;

	if ($c->{srid}) {
		my $area;
		if ($c->{area}) {
			$area = &_select_uidlst_search($session, $c->{srid}, $c->{area}, undef, 1, $c->{fid});
		} else {
			$area = &_select_uidlst_search($session, $c->{srid}, $c->{uid}, undef, 1, $c->{fid});
		}

		my $bc  = {}; %{$bc} = %{$c};
		my $res = {};
		foreach my $key (sort {$a <=> $b} keys %{$area}) {
			$bc->{fid} = $key;
			if ($c->{area} && $c->{fid} eq $key) {
				$bc->{uid} = &_join_uidlst($c->{uid}, $area->{$key});
			} else {
				$bc->{uid} = join(",", @{$area->{$key}});
			}

			my $res1 = &flag_mail_server($session, $imaps, $vfilter, $folders, $bc, $opt);
			if ($res1->{error}) {
				return($res1);
			} else {
				my $res2 = &flag_mail_search($session, $imaps, $vfilter, $folders, $bc, $opt);
				if ($res2->{error}) {
					return($res2);
				} else {
					$res1->{total}->{fid} = $bc->{fid};
					push(@{$res->{counts}}, $res1->{total});
				}
			}
		}

		return($res);
	} else {
		if ($c->{uid}) {
			$c->{uid} = &_select_uidlst_common($session, $c->{fid}, $c->{uid}, undef, 2);
		}
		if ($c->{area}) {
			$c->{uid} = &_join_uidlst($c->{uid}, &_select_uidlst_common($session, $c->{fid}, $c->{area}));
		}
		return(&flag_mail_server($session, $imaps, $vfilter, $folders, $c, $opt));
	}
}

sub flag_mail_join($$;$$$$) {
	my ($session, $imaps, $vfilter, $folders, $c, $opt) = @_;

	return({});
}

sub flag_mail_server($$;$$$$) {
	my ($session, $imaps, $vfilter, $folders, $c, $opt) = @_;
	my $logger       = &_logger_init($session);
	my $fid          = $c->{fid};
	my $cid          = $c->{cid};
	my $uids         = $c->{uid};
	my $search_field = $c->{search_field};
	my $search_word  = $c->{search_word};
	my $nocount      = $c->{nocount};
	my $folder       = &_fid2folder($session, $imaps, $folders, $fid);
	my $uidval       = &_fid2uidval($session, $imaps, $folders, $fid);
	my $type         = &_fid2type($session, $imaps, $folders, $fid);
	my $dummy        = &_fid2dummy($session, $imaps, $folders, $fid);
	my $result       = {};
	my $error;

	if ($opt eq "replied" || $opt eq "unreplied") {
		if (&check_imap_info($session, $imaps, "no_replied_flag")) {
			&_logger($session, $imaps, $logger);
			return($result);
		}
	}

	if ($opt eq "forwarded" || $opt eq "unforwarded") {
		if (&check_imap_info($session, $imaps, "no_forwarded_flag")) {
			&_logger($session, $imaps, $logger);
			return($result);
		}
	}

	&_set_uid_flag($session, $imaps);

	my $path      = &_fid2path($session, $imaps, $folders, $fid);
	my $md5_path  = Digest::MD5::md5_hex($path);
	if (&lock($session, "trans.$md5_path")) {
		if (&_select($session, $imaps, $folder)) {
			my ($func, $s_column, $s_value);
			if ($opt eq "deleted") {
				$func = \&_deleted;
				$s_column = "deleted"; $s_value = 1;
			} elsif ($opt eq "undeleted") {
				$func = \&_undeleted;
				$s_column = "deleted"; $s_value = 0;
			} elsif ($opt eq "seen") {
				$func = \&_seen;
				$s_column = "seen"; $s_value = 1;
			} elsif ($opt eq "unseen") {
				$func = \&_unseen;
				$s_column = "seen"; $s_value = 0;
			} elsif ($opt eq "flagged") {
				$func = \&_flagged;
				$s_column = "flagged"; $s_value = 1;
			} elsif ($opt eq "unflagged") {
				$func = \&_unflagged;
				$s_column = "flagged"; $s_value = 0;
			} elsif ($opt eq "replied"){
				$func = \&_replied;
  				$s_column = "replied"; $s_value = 1;
			} elsif ($opt eq "unreplied"){
				$func = \&_unreplied;
				$s_column = "replied"; $s_value = 0;				
			} elsif ($opt eq "forwarded"){
				$func = \&_forwarded;
				$s_column = "forwarded"; $s_value = 1;
			} elsif ($opt eq "unforwarded"){
				$func = \&_unforwarded;
				$s_column = "forwarded"; $s_value = 0;
			}

			if ($uids =~ /^(all|deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
				my $where  = &_vfilter_where($session, $imaps, $vfilter, $cid);
				my $search = &_search_where($session, $imaps, $search_field, $search_word);

				push(@{$where}, {"column" => $s_column, "value" => ($s_value) ? 0 : 1});
				if ($uids =~ /^(deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
					push(@{$where}, &_uids2where($uids));
				}

				my $sc = {
					"folder" => $folder,
					"uidval" => $uidval,
					"where"  => $where,
					"search" => $search,
					"output" => [qw(uid_number)],
					"list"   => 1
				};
				if (my $uidlst = &_select_header($session, $imaps, $sc)) {
					my $nos = &_number(join(",", @{$uidlst}));
					if (scalar(@{$nos})) {
						my ($inc, @success, @false);
						foreach my $n (@{$nos}) {
							if ($func->($session, $imaps, $n)) {
								push(@success, @{&_number2array($n)});
							} else {
								push(@false, @{&_number2array($n)});
							}
						}
						if (scalar(@false)) {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => \@success,
								"set"    => [{"column" => $s_column, "value" => $s_value}]
							};
							if (&_update_header($session, $imaps, $uc)) {
								$inc = 1;
								&_warn($session, "Can't $s_column mail [$folder]");
								$error = &error("NOT_" . uc($s_column) . "_MAIL", 9);
							} else {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						} else {
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"where"  => $where,
								"search" => $search,
								"set"    => [{"column" => $s_column, "value" => $s_value}]
							};
							if (&_update_header($session, $imaps, $uc)) {
								$inc = 1;
							} else {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
						}
						if ($inc) {
							if ($opt =~ /^(seen|unseen)$/) {
								if (!$nocount) {
									my $ds    = scalar(@success);
									my $count = {
										"unseen_count" => ($opt eq "seen") ? -1 * $ds : $ds
									};

									if (my $cnt = &inc_count($session, $imaps, $folder, $uidval, $count)) {
										$result->{total} = &view_count($session, $imaps, $cnt, $type, $dummy, 1);
									} else {
										&_warn($session, "inc_count");
										$error = &error("NOT_INC_COUNT", 9);
									}
								}
								if ($type eq $TYPE_INBOX) {
									&set_portal_reload($session, $imaps);
								} else {
									if ($imaps->{portal}->{ml_target} eq "all") {
										&set_portal_reload($session, $imaps);
									}
								}
							}
						}
					}
				} else {
					&_warn($session, "_select_header");
					$error = &error("NOT_SELECT_HEADER_TABLE", 9);
				}
			} else {
				my $nos = &_number($uids);
				if (scalar(@{$nos})) {
					my (@success, @false);
					foreach my $n (@{$nos}) {
						if ($func->($session, $imaps, $n)) {
							push(@success, @{&_number2array($n)});
						} else {
							push(@false, @{&_number2array($n)});
						}
					}

					if (scalar(@success)) {
						my $sc = {
							"folder" => $folder,
							"uidval" => $uidval,
							"uidlst" => \@success,
							"output" => [qw(uid_number seen)],
							"list"   => 2,
							"key"    => "uid_number"
						};
						my $seenlst;
						if ($opt =~ /^(seen|unseen)$/) {
							$seenlst = &_select_header($session, $imaps, $sc);
						} else {
							$seenlst = {};
						}

						if ($seenlst) {
							my $inc;
							my $uc = {
								"folder" => $folder,
								"uidval" => $uidval,
								"uidlst" => \@success,
								"set"    => [{"column" => $s_column, "value" => $s_value}]
							};
							if (&_update_header($session, $imaps, $uc)) {
								$inc = 1;
								if (scalar(@false)) {
									&_warn($session, "Can't $s_column mail [$folder]");
									$error = &error("NOT_" . uc($s_column) . "_MAIL", 9);
								}
							} else {
								&_warn($session, "_update_header");
								$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
							}
							if ($inc) {
								if (!$nocount) {
									if ($opt =~ /^(seen|unseen)$/) {
										my ($de, $ds) = &_diff_count($seenlst, \@success, $opt);
										my $count = {
											"unseen_count" => $ds
										};

										if (my $cnt = &inc_count($session, $imaps, $folder, $uidval, $count)) {
											$result->{total} = &view_count($session, $imaps, $cnt, $type, $dummy, 1);
										} else {
											&_warn($session, "inc_count");
											$error = &error("NOT_INC_COUNT", 9);
										}
									}
									if ($type eq $TYPE_INBOX) {
										&set_portal_reload($session, $imaps);
									} else {
										if ($imaps->{portal}->{ml_target} eq "all") {
											&set_portal_reload($session, $imaps);
										}
									}
								}
							}
						} else {
							&_warn($session, "_select_header");
							$error = &error("NOT_SELECT_HEADER_TABLE", 9);
						}
					} else {
						if (scalar(@false)) {
							&_warn($session, "Can't $s_column mail [$folder]");
							$error = &error("NOT_" . uc($s_column) . "_MAIL", 9);
						}
					}
				}
			}
		} else {
			&_warn($session, "_select");
			$error = &error("NOT_SELECT_FOLDER", 9);
		}

		&unlock($session, "trans.$md5_path");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub flag_mail_search($$;$$$$) {
	my ($session, $imaps, $vfilter, $folders, $c, $opt) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $cid    = $c->{cid};
	my $uids   = $c->{uid};
	my $srid   = $c->{srid};
	my $result = {};
	my $error;

	if (&lock($session, "trans.search")) {
		my (@sets, @wheres);
		if ($opt eq "deleted") {
			push(@sets, { "column" => "deleted", "value" => 1 });
		} elsif ($opt eq "undeleted") {
			push(@sets, { "column" => "deleted", "value" => 0 });
		} elsif ($opt eq "seen") {
			push(@sets, { "column" => "seen", "value" => 1 });
		} elsif ($opt eq "unseen") {
			push(@sets, { "column" => "seen", "value" => 0 });
		} elsif ($opt eq "flagged") {
			push(@sets, { "column" => "flagged", "value" => 1 });
		} elsif ($opt eq "unflagged") {
			push(@sets, { "column" => "flagged", "value" => 0 });
		}
		if ($uids eq "deleted") {
			push(@wheres, { "column" => "deleted", "value" => 1 });
		} elsif ($uids eq "undeleted") {
			push(@wheres, { "column" => "deleted", "value" => 0 });
		} elsif ($uids eq "seen") {
			push(@wheres, { "column" => "seen", "value" => 1 });
		} elsif ($uids eq "unseen") {
			push(@wheres, { "column" => "seen", "value" => 0 });
		} elsif ($uids eq "flagged") {
			push(@wheres, { "column" => "flagged", "value" => 1 });
		} elsif ($uids eq "unflagged") {
			push(@wheres, { "column" => "flagged", "value" => 0 });
		}
		if ($uids =~ /^(all|deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
			my $uc = {
				"srid"  => $srid,
				"set"   => \@sets,
				"where" => \@wheres
			};
			unless (&_update_header_search($session, $imaps, $uc)) {
				&_warn($session, "_update_header_search");
				$error = &error("NOT_UPDATE_HEADER_SEARCH", 9);
			}
		} else {
			my @uidlst;
			foreach my $u (split(/\,/, $uids)) {
				push(@uidlst, "$fid\_$u");
			}
			if (scalar(@uidlst)) {
				my $uc = {
					"srid"   => $srid,
					"uidlst" => \@uidlst,
					"set"    => \@sets
				};

				unless (&_update_header_search($session, $imaps, $uc)) {
					&_warn($session, "_update_header_search");
					$error = &error("NOT_UPDATE_HEADER_SEARCH", 9);
				}
			}
		}

		&unlock($session, "trans.search");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub mdn_mail($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $info = &_sent($session, $imaps);
	my $uc   = {
		"fid"      => &_path2fid($session, $imaps, $folders, $info->{path}),
		"noupdate" => 1,
		"norecent" => 1
	};

	if (&_fid2type($session, $imaps, $folders, $c->{fid}) eq $TYPE_JOIN) {
		return(&mdn_mail_join($session, $imaps, $vfilter, $folders, $c));
	} elsif ($c->{srid}) {
		my $res1 = &mdn_mail_server($session, $imaps, $vfilter, $folders, $c);
		if ($res1->{error}) {
			return($res1);
		} else {
			my $res2 = &mdn_mail_search($session, $imaps, $vfilter, $folders, $c);
			if ($res2->{error}) {
				return($res2);
			} else {
				my $result = &update($session, $imaps, $folders, $uc);
				if ($res1->{warn}) {
					$result->{warn} = $res1->{warn};
				}
				return ($result);
			}
		}
	} else {
		my $res1 = &mdn_mail_server($session, $imaps, $vfilter, $folders, $c);
		if ($res1->{error}) {
			return($res1);
		} else {
			my $result = &update($session, $imaps, $folders, $uc);
			if ($res1->{warn}) {
				$result->{warn} = $res1->{warn};
			}
			if($res1->{mdnsent}){
				$result->{mdnsent} = $res1->{mdnsent};
			}
			return ($result);
		}
	}
}

sub mdn_mail_server($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger       = &_logger_init($session);
	my $fid          = $c->{fid};
	my $uids         = $c->{uid};
	my $cid          = $c->{cid};
	my $search_field = $c->{search_field};
	my $search_word  = $c->{search_word};
	my $folder       = &_fid2folder($session, $imaps, $folders, $fid);
	my $uidval       = &_fid2uidval($session, $imaps, $folders, $fid);
	my $type         = &_fid2type($session, $imaps, $folders, $fid);
	my $result       = {};
	my $error;
	my $warn;
	my $mdnsent = 0;
	&_set_uid_flag($session, $imaps);

	my $path      = &_fid2path($session, $imaps, $folders, $fid);
	my $md5_path  = Digest::MD5::md5_hex($path);
	if (&lock($session, "trans.$md5_path")) {
		my $s_column = "mdn";
		my $s_value  = 1;
		if ($uids =~ /^(all|deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
			my $where  = &_vfilter_where($session, $imaps, $vfilter, $cid);
			my $search = &_search_where($session, $imaps, $search_field, $search_word);

			push(@{$where}, {"column" => $s_column});
			if ($uids =~ /^(deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
				push(@{$where}, &_uids2where($uids));
			}

			my $sc = {
				"folder" => $folder,
				"uidval" => $uidval,
				"where"  => $where,
				"search" => $search,
				"output" => [qw(uid_number)],
				"list"   => 1
			};
			if (my $uidlst = &_select_header($session, $imaps, $sc)) {
				my (@success, @false);
				foreach my $uid (@{$uidlst}) {
					my $mdn = &mdn($session, $imaps, $fid, $uid);
					if ($mdn) {
						$warn = $mdn if (ref($mdn) eq "HASH");
						push(@success, $uid);
						if ($mdn == 2){
							$mdnsent = 1;
						}
					} else {
						push(@false, $uid);
					}
				}
				if (scalar(@false)) {
					my $uc = {
						"folder" => $folder,
						"uidval" => $uidval,
						"uidlst" => \@success,
						"set"    => [{"column" => $s_column, "value" => $s_value}]
					};
					if (&_update_header($session, $imaps, $uc)) {
						&_warn($session, "Can't $s_column mail [$folder]");
						$error = &error("NOT_" . uc($s_column) . "_MAIL", 9);
					} else {
						&_warn($session, "_update_header");
						$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
					}
				} else {
					my $uc = {
						"folder" => $folder,
						"uidval" => $uidval,
						"where"  => $where,
						"search" => $search,
						"set"    => [{"column" => $s_column, "value" => $s_value}]
					};
					unless (&_update_header($session, $imaps, $uc)) {
						&_warn($session, "_update_header");
						$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
					}
					if($mdnsent){
						$result->{mdnsent} = 1;
					}
				}
			} else {
				&_warn($session, "_select_header");
				$error = &error("NOT_SELECT_HEADER_TABLE", 9);
			}
		} else {
			my (@success, @false);
			foreach my $uid (split(/\,/, $uids)) {
				my $mdn = &mdn($session, $imaps, $fid, $uid);
				if ($mdn) {
					$warn = $mdn if (ref($mdn) eq "HASH");
					push(@success, $uid);
					if($mdn == 2){
						$mdnsent = 1;
					}
				} else {
					push(@false, $uid);
				}
			}
			if (scalar(@success)) {
				my $uc = {
					"folder" => $folder,
					"uidval" => $uidval,
					"uidlst" => \@success,
					"set"    => [{"column" => $s_column, "value" => $s_value}]
				};
				if (&_update_header($session, $imaps, $uc)) {
					if (scalar(@false)) {
						&_warn($session, "Can't $s_column mail [$folder]");
						$error = &error("NOT_" . uc($s_column) . "_MAIL", 9);
					} else{
						if ($mdnsent) {
							$result->{mdnsent} = 1;
						}
					}
				} else {
					&_warn($session, "_update_header");
					$error = &error("NOT_UPDATE_HEADER_TABLE", 9);
				}
			} else {
				if (scalar(@false)) {
					&_warn($session, "Can't $s_column mail [$folder]");
					$error = &error("NOT_" . uc($s_column) . "_MAIL", 9);
				}
			}
		}

		&unlock($session, "trans.$md5_path");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	} elsif ($warn) {
		$result->{warn} = $warn;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub mdn_mail_search($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $fid    = $c->{fid};
	my $cid    = $c->{cid};
	my $uids   = $c->{uid};
	my $srid   = $c->{srid};
	my $result = {};
	my $error;

	if (&lock($session, "trans.search")) {
		my (@sets, @wheres);
		push(@sets, { "column" => "mdn", "value" => 1 });
		if ($uids eq "deleted") {
			push(@wheres, { "column" => "deleted", "value" => 1 });
		} elsif ($uids eq "undeleted") {
			push(@wheres, { "column" => "deleted", "value" => 0 });
		} elsif ($uids eq "seen") {
			push(@wheres, { "column" => "seen", "value" => 1 });
		} elsif ($uids eq "unseen") {
			push(@wheres, { "column" => "seen", "value" => 0 });
		} elsif ($uids eq "flagged") {
			push(@wheres, { "column" => "flagged", "value" => 1 });
		} elsif ($uids eq "unflagged") {
			push(@wheres, { "column" => "flagged", "value" => 0 });
		}
		if ($uids =~ /^(all|deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
			my $uc = {
				"srid"  => $srid,
				"set"   => \@sets,
				"where" => \@wheres
			};
			unless (&_update_header_search($session, $imaps, $uc)) {
				&_warn($session, "_update_header_search");
				$error = &error("NOT_UPDATE_HEADER_SEARCH", 9);
			}
		} else {
			my @uidlst;
			foreach my $u (split(/\,/, $uids)) {
				push(@uidlst, "$fid\_$u");
			}
			if (scalar(@uidlst)) {
				my $uc = {
					"srid"   => $srid,
					"uidlst" => \@uidlst,
					"set"    => \@sets
				};
				unless (&_update_header_search($session, $imaps, $uc)) {
					&_warn($session, "_update_header_search");
					$error = &error("NOT_UPDATE_HEADER_SEARCH", 9);
				}
			}
		}

		&unlock($session, "trans.search");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub mdn_mail_join($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger       = &_logger_init($session);
	my $fid          = $c->{fid};
	my $uids         = $c->{uid};
	my $cid          = $c->{cid};
	my $result       = {};
	my $error;
	my $warn;

	&_set_uid_flag($session, $imaps);

	my $path      = &_fid2path($session, $imaps, $folders, $fid);
	my $md5_path  = Digest::MD5::md5_hex($path);
	if (&lock($session, "trans.$md5_path")) {
		my $s_column = "mdn";
		my (@false);
		foreach my $uid (split(/\,/, $uids)) {
			my $mdn = &mdn($session, $imaps, $fid, $uid);
			if ($mdn) {
				$warn = $mdn if (ref($mdn) eq "HASH");
			} else {
				push(@false, $uid);
			}
		}
		if (scalar(@false)) {
			&_warn($session, "Can't $s_column mail [join]");
			$error = &error("NOT_" . uc($s_column) . "_MAIL", 9);
		}

		&unlock($session, "trans.$md5_path");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	} elsif ($warn) {
		$result->{warn} = $warn;
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub mdn($$$$) {
	my ($session, $imaps, $fid, $uid) = @_;
	my $logger = &_logger_init($session, 1);
	my $result = 1;
	my $message_id;
	my $mdnflags;
	if (my $detail = &storable_retrieve($session, "$fid\.$uid\.detail")) {
		$message_id = $detail->{message_id};
		if ($mdnflags = &open_dbm($session, "mdn.flags")) {
			if($mdnflags->{$message_id}){
				$result = 2;
			}
			unless (&close_dbm($session, "mdn.flags", $mdnflags)) {
				&_warn($session, "close_dbm");
				$result = &error("NOT_CLOSE_DBM", 9);
			}
		}else {
			&_warn($session, "open_dbm");
			$result = &error("NOT_OPEN_DBM", 9);
		}

		if(ref($result) || $result !=1){
			return($result);
		}
		my $lang = &get_user_lang($session, $imaps);
		my $h12  = &get_time_style($session, $imaps);
		my $zone = &get_timezone($session, $imaps);

		# To
		my @to;
		if ($detail->{notification}) {
			foreach my $l (@{$detail->{notification}}) {
				push(@to, $l);
			}
		}

		# Body
		my $s_date  = $detail->{date};
		   $s_date  = &format_date($s_date, 0, $zone, "", "", $lang, $h12);
		my $o_date  = &get_maildate($imaps->{system}->{time_zone});
		   $o_date  = &format_date($o_date, 0, $zone, "", "", $lang, $h12);
		my $from    = &get_user_name($session, $imaps);
		my $subject = "Read Receipt for \"" . $detail->{subject} . "\""; 

		my $text;
		if ($lang eq "ja") {
			$text = "次のメッセージは開封されました。\n\n"
		          . "  宛先       : $session->{email}\n"
			      . "  件名       : <!-- subject -->\n"
			      . "  Message-Id : <!-- message_id -->\n"
			      . "  送信時間   : <!-- s_date -->(<!-- zone -->)\n"
			      . "  開封時間   : <!-- o_date -->(<!-- zone -->)\n"; 
		} else {
			$text = "The following message was opened.\n\n"
			      . "  To          : $session->{email}\n"
			      . "  Subject     : <!-- subject -->\n"
			      . "  Message-Id  : <!-- message_id -->\n"
			      . "  Time sent   : <!-- s_date -->(<!-- zone -->)\n"
			      . "  Time opened : <!-- o_date -->(<!-- zone -->)\n";
		}
		$text = DA::Charset::convert
					(\$text, &source_charset(), &mailer_charset());
		$text =~s/\<\!\-\- (subject|message_id) \-\-\>/$detail->{$1}/g;
		$text =~s/\<\!\-\- (s_date) \-\-\>/$s_date/g;
		$text =~s/\<\!\-\- (o_date) \-\-\>/$o_date/g;
		$text =~s/\<\!\-\- (zone) \-\-\>/$zone/g;

		# Charset
		my $charset;
		if (DA::Unicode::recognize_mail_charset($from, &mailer_charset()) eq "UTF-8"
		||  DA::Unicode::recognize_mail_charset($subject, &mailer_charset()) eq "UTF-8"
		||  DA::Unicode::recognize_mail_charset($text, &mailer_charset()) eq "UTF-8") {
			$charset = "UTF-8";
		} else {
			$charset = "ISO-2022-JP";
		}

		my $data = {
			"charset"  => $charset,
			"subject"  => $subject,
			"from"     => {
				"select"  => "email"
			},
			"to_list"  => \@to,
			"cc_list"  => [],
			"bcc_list" => [],
			"body"     => {
				"text"    => $text
			}
		};
		my $rmm = &make_mail($session, $imaps, {}, 0, $data, "sent");

		if ($rmm->{error}) {
			$result = 0;
		} else {
			my $send = {
				"mime" => $rmm->{mime},
				"from" => $session->{email},
				"file" => "$session->{temp_dir}/$session->{sid}.AjaxMailer.mdn.$fid.$uid",
				"auth" => &smtp_auth_account($session, $imaps)
			};
			#================================================
            # New CBP used for SMTP Auth
            #================================================
            DA::Custom::rewrite_send_param($session, $send, {});
            #================================================
            
			if (my $message = &send_command($send)) {
				&_warn($session, "send_command");
				$result = 0;
			} else {
				if ($imaps->{mail}->{mdn_save} ne "off") {
					my $mime  = $rmm->{mime};
					my $local = $rmm->{local};
					my $c = {};
					if (my $rst = &store_mail($session, $imaps, 0, $mime, $local, "send", $uid, $c)) {
						&_warn($session, "store_mail");
						$result = $rst;
					}
				}
			}
		}
	} else {
		&_warn($session, "storable_retrieve");
		$result = 0;
	}

	&_logger($session, $imaps, $logger);
	if ($result == 1){
		if (my $mdnflags = &open_dbm($session, "mdn.flags")) {
			$mdnflags->{$message_id} = 1;

			unless (&close_dbm($session, "mdn.flags", $mdnflags)) {
				&_warn($session, "close_dbm");
				$result = &error("NOT_CLOSE_DBM", 9);
			}
		} else {
			&_warn($session, "open_dbm");
			$result = &error("NOT_OPEN_DBM", 9);
		}
	}
	return($result);
}

sub filter($$;$$$) {
	my ($session, $imaps, $vfilter, $folders, $c) = @_;
	my $logger       = &_logger_init($session);
	my $fid          = $c->{fid};
	my $uids         = $c->{uid};
	my $area         = $c->{area};
	my $cid          = $c->{cid};
	my $srid         = $c->{srid};
	my $auto         = $c->{auto};
	my $search_field = $c->{search_field};
	my $search_word  = $c->{search_word};
	my $ignoreQuota  = $c->{ignoreQuota};
	my $nolock       = $c->{nolock};
	my $folder = &_fid2folder($session, $imaps, $folders, $fid);
	my $uidval = &_fid2uidval($session, $imaps, $folders, $fid);
	my $result = {};
	my ($error, %ex_uids, @uids, @counts);

	&_set_uid_flag($session, $imaps);

	my $path      = &_fid2path($session, $imaps, $folders, $fid);
	my $md5_path  = Digest::MD5::md5_hex($path);
	if (&lock($session, "trans.filter.$md5_path")) {
		# UID リストの取得
		if ($uids) {
			$uids = &_select_uidlst_common($session, $fid, $uids, undef, 2);
		}
		if ($area) {
			$uids = &_join_uidlst($uids, &_select_uidlst_common($session, $fid, $area));
		}

		# 設定の取得
		my (@filter, %field);
		if (my $filter = &get_filter($session)) {
			foreach my $f (@{$filter}) {
				if ($auto && $f->{auto} =~ /^yes$/i
				|| !$auto && $f->{manual} !~ /^yes$/i) {
					$f->{h1} =~ s/\:+$//g; $f->{t1} = uc($f->{t1});
					$f->{h2} =~ s/\:+$//g; $f->{t2} = uc($f->{t2});

					if ($f->{h1}) {
						$field{$f->{h1}} = 1;
					}
					if ($f->{h2}) {
						$field{$f->{h2}} = 1;
					}

					if ($f->{h1} eq "Date") {
						my $dd = $f->{t1} * -1;
						my $date = DA::CGIdef::get_date2($session, "Y4/MM/DD");
						   $date = DA::CGIdef::get_target_date($date, $dd, "Y4/MM/DD");
						my $time = "24:00:00";
						$f->{date} = DA::CGIdef::convert_date($session, "$date\-$time", 1, "+0000");
					}

					if ($f->{proc} eq "del") {
						my $info = &_trash($session, $imaps);
						my $fid  = &_path2fid($session, $imaps, $folders, $info->{path});
						$f->{info} = $folders->{$fid};
					} elsif ($f->{proc} eq "spam") {
						my $info = &_spam($session, $imaps);
						my $fid  = &_path2fid($session, $imaps, $folders, $info->{path});
						$f->{info} = $folders->{$fid};
					} else {
						if (my $fid = &_path2fid($session, $imaps, $folders, $f->{move_path})) {
							$f->{info} = $folders->{$fid};
						} else {
							next;
						}
					}
					push(@filter, $f);
				}
			}
		} else {
			&_warn($session, "get_filter");
			$error = &error("NOT_READ_FILTER_CONFIG", 9);
		}

		if (!$error && scalar(@filter)) {
			if (&_examine($session, $imaps, $folder)) {
				my $uidlst = {};
				if ($uids =~ /^(all|deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
					my $where  = &_vfilter_where($session, $imaps, $vfilter, $cid);
					my $search = &_search_where($session, $imaps, $search_field, $search_word);

					if ($uids =~ /^(deleted|undeleted|seen|unseen|flagged|unflagged)$/) {
						push(@{$where}, &_uids2where($uids));
					}

					my $sc = {
						"folder" => $folder,
						"uidval" => $uidval,
						"where"  => $where,
						"search" => $search,
						"output" => [qw(uid_number seen deleted)],
						"list"   => 2,
						"key"    => "uid_number"
					};
					if ($uidlst = &_select_header($session, $imaps, $sc)) {
						unless ($auto) {
							my $fuid = &get_filter_uid_number($session, $imaps, $folder, $uidval);
							if (defined $fuid) {
								foreach my $u (keys %{$uidlst}) {
									if ($u <= $fuid) {
										delete $uidlst->{$u};
									}
								}
							} else {
								&_warn($session, "get_filter_uid_number");
								$error = &error("NOT_GET_FILTER_UID", 9);
							}
						}
					} else {
						&_warn($session, "_select_header");
						$error = &error("NOT_SELECT_HEADER_TABLE", 9);
					}
				} else {
					if (my $seenlst = &_search($session, $imaps, "ALL SEEN")) {
						if (my $deletedlst = &_search($session, $imaps, "ALL DELETED")) {
							my (%seenlst, %deletedlst);
							@seenlst{@{$seenlst}} = 1;
							@deletedlst{@{$deletedlst}} = 1;
							foreach my $u (split(/\,/, $uids)) {
								$uidlst->{$u} = {
									"uid_number" => $u,
									"seen"    => (exists $seenlst{$u}) ? 1 : 0,
									"deleted" => (exists $deletedlst{$u}) ? 1 : 0
								};
							}
						} else {
							&_warn($session, "_search");
							$error = &error("NOT_SEARCH", 9);
						}
					} else {
						&_warn($session, "_search");
						$error = &error("NOT_SEARCH", 9);
					}
				}

				# 一時ファイル作成
				my $seen    = [];
				my $delete  = [];
				my $move    = {};
				my $updated = { $fid => 1 };
				my $fuid;
				my $header = {};
				if (!$error) {
					my @field = keys %field;
					my $nos = &_number(join(",", keys %{$uidlst}), 1);
					push (@field,qw(To From Date Subject));
					if (scalar(@{$nos})) {
						foreach my $n (@{$nos}) {
							if ($header = &_parse_headers($session, $imaps, $n, \@field)) {
								foreach my $u (@{&_number2array($n)}) {
									$fuid = $u;

									my $h = &_filter_header($session, $imaps, $header->{$u});
									foreach my $f (@filter) {
										if (&_filter_ok($session, $imaps, $f, $h, $uidlst->{$u})) {
											my $target_fid  = $f->{info}->{fid};
											my $target_type = $f->{info}->{type};
											if ($f->{proc} eq "del") {
												if ($imaps->{mail}->{delete}) {
													push(@{$delete}, $u);
													$ex_uids{$u} = 1; last;
												} else {
													if ($fid eq $target_fid) {
														next;
													} else {
														if ($f->{done} =~ /^yes$/i) {
															push(@{$seen}, $u);
														}
														push(@{$move->{$target_fid}}, $u);
														$ex_uids{$u} = 1; last;
													}
												}
											} elsif ($f->{proc} eq "spam") {
												if ($fid eq $target_fid) {
													next;
												} else {
													if ($f->{done} =~ /^yes$/i) {
														push(@{$seen}, $u);
													}
													push(@{$move->{$target_fid}}, $u);
													$ex_uids{$u} = 1; last;
												}
											} else {
												if ($fid eq $target_fid) {
													next;
												} else {
													if ($f->{done} =~ /^yes$/i) {
														push(@{$seen}, $u);
													}
													push(@{$move->{$target_fid}}, $u);
													$ex_uids{$u} = 1; last;
												}
											}
										}
									}
								}
							} else {
								&_warn($session, "_parse_headers");
								$error = &error("NOT_PARSE_HEADERS", 9);
							}
						}
					}
				}

				# 既読処理
				if (!$error && scalar(@{$seen})) {
					my $sc = {
						"fid"  => $fid,
						"uid"  => join(",", @{$seen}),
						"srid" => $srid,
						"nocount" => ($auto) ? 1 : 0
					};
					my $rsm = &seen_mail($session, $imaps, $vfilter, $folders, $sc);
					if ($rsm->{error}) {
						&_warn($session, "seen_mail");
						$error = $rsm;
					}
				}

				# 削除処理
				if (!$error && scalar(@{$delete})) {
					my $dc = {
						"fid"  => $fid,
						"uid"  => join(",", @{$delete}),
						"srid" => $srid,
						"nocount" => ($auto) ? 1 : 0
					};
					my $rdm = &delete_mail($session, $imaps, $vfilter, $folders, $dc);
					if ($rdm->{error}) {
						&_warn($session, "delete_mail");
						$error = $rdm;
					}
					if($auto){
						if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
							my $log = [];
							my $charset = &mailer_charset();
							my $folder_old = &_utf7_decode($session, $imaps, $folder);
							foreach my $k (@$delete){
								my $subject = DA::Mailer::decode_header_field($header->{$k}->{Subject}->[0], 1, 1, $charset);
								my $oplog = {
									"app"    => "mail",
									"docid"  => "ajax/mail/$session->{user}/$fid/$k",
									"type"   => "MR",
									"detail" => {
			 							"folder"     => $folder_old,
										"To"         => &convert_internal($header->{$k}->{To}->[0]),
										"From"       => &convert_internal($header->{$k}->{From}->[0]),
										"Date"       => &convert_internal($header->{$k}->{Date}->[0]),
										"Subject"    => &convert_internal($subject)
									}
								};
								if(DA::OrgMail::use_org_mail($session)){
									my $gid = DA::OrgMail::get_gid($session);
									$oplog->{type} = "MRO";
									$oplog->{detail}->{gid} = $gid;
								}
								push (@{$log},$oplog);
							}
							DA::OperationLog::log($session, $log);
						}
					}
				}

				# 移動処理
				if (!$error) {
					my $target_fid;
					foreach $target_fid (sort { $a <=> $b } keys %{$move}) {
						my $uc = {
							"fid"  => $fid,
							"uid"  => join(",", @{$move->{$target_fid}}),
							"srid" => $srid,
							"ignoreQuota" => $ignoreQuota,
							"target_fid" => $target_fid,
							"nocount" => ($auto) ? 1 : 0
						};
						my $rmm = &move_mail($session, $imaps, $vfilter, $folders, $uc);
						if ($rmm->{error}) {
							&_warn($session, "move_mail");
							$error = $rmm; last;
						}

						$updated->{$target_fid} = 1;
						if($auto){
							if($DA::Vars::p->{MAIL_DETAIL_OPERATION_LOG}){
								my $log = [];
								my $charset = &mailer_charset();
								my $folder_old = &_utf7_decode($session, $imaps, $folder);
								my $dst_folder = &_fid2folder($session, $imaps, $folders, $target_fid);
								my $folder_new = &_utf7_decode($session, $imaps, $dst_folder);
								my $org_flag = 0;
								my $gid = 0;
								my $trash = 0;
								if(DA::OrgMail::use_org_mail($session)){
									$org_flag = 1;
									$gid = DA::OrgMail::get_gid($session);
								}
								if(&_is_trash($session, $imaps, $dst_folder)){
									$trash = 1;
								}
								foreach my $k (@{$move->{$target_fid}}){
									my $subject = DA::Mailer::decode_header_field($header->{$k}->{Subject}->[0], 1, 1, $charset);
									my $oplog = {
										"app"    => "mail",
										"docid"  => "ajax/mail/$session->{user}/$fid/$k",
										"type"   => "MV",
										"detail" => {
											"folder_old"     => $folder_old,
											"folder_new"     => $folder_new,
											"To"             => &convert_internal($header->{$k}->{To}->[0]),
											"From"           => &convert_internal($header->{$k}->{From}->[0]),
											"Date"           => &convert_internal($header->{$k}->{Date}->[0]),
											"Subject"	=> &convert_internal($subject)
										}
									};
									if($org_flag){
										if($trash){
											$oplog->{type} = "MTO";
										}else{
											$oplog->{type} = "MVO";
										}
										$oplog->{detail}->{gid} = $gid;
									}else{
										if($trash){
									       		$oplog->{type} = "MT";
										}
									}
									push (@{$log},$oplog);
								}
								DA::OperationLog::log($session, $log);
							}
						}
					}
				}

				# filter_uid_number
				if (!$error && !$auto && $uids eq "all") {
					unless (&set_filter_uid_number($session, $imaps, $folder, $uidval, $fuid)) {
						&_warn($session, "set_filter_uid_number");
					}
				}

				# カウンタ
				if (!$error) {
					my $count = &count($session, $imaps);
					if (defined $count) {
						foreach my $fid (
							sort { $folders->{$a}->{sort_root} <=> $folders->{$b}->{sort_root}
						        || $folders->{$a}->{sort_level} <=> $folders->{$b}->{sort_level}
						        || $folders->{$a}->{sort_name} cmp $folders->{$b}->{sort_name} } keys %{$folders}) {
							if ($updated->{$fid}) {
								my $path  = &_fid2path($session, $imaps, $folders, $fid);
								my $type  = &_fid2type($session, $imaps, $folders, $fid);
								my $dummy = &_fid2dummy($session, $imaps, $folders, $fid);
								my $view  = &view_count($session, $imaps, $count->{$path}, $type, $dummy, 1);
								$view->{fid} = $fid;

								push(@counts, $view);
							}
						}
					} else {
						&_warn($session, "count");
						$error = &error("NOT_GET_COUNT", 9);
					}
				}

				# リスト更新
				if (!$error) {
					if ($auto) {
						my %tmp; @tmp{(keys %{$uidlst})} = undef;
						delete @tmp{(keys %ex_uids)};
						@uids = sort {$a <=> $b} keys %tmp;
					}
				}
			} else {
				&_warn($session, "_examine");
				$error = &error("NOT_EXAMINE_FOLDER", 9);
			}
		} else {
			if ($auto) {
				@uids = split(/\,/, $uids);
			}
		}

		&unlock($session, "trans.filter.$md5_path");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	} else {
		$result = {
			"uids"   => \@uids,
			"counts" => \@counts
		};
	}

	&_unset_uid_flag($session, $imaps);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub rebuild($$$$) {
	my ($session, $imaps, $folders, $c) = @_;
	my $logger = &_logger_init($session);
	my $fid    = $c->{fid};
	my $nolock = $c->{nolock};
	my $folder = &_fid2folder($session, $imaps, $folders, $fid);
	my $uidval = &_uidvalidity($session, $imaps, $folder);
	my $result = {};
	my $error;
	#　一時ファイルをロック
	my $lock;
	my $org_mail_permit = 0;
	if (!$nolock && DA::OrgMail::check_org_mail_permit($session)) {
		$org_mail_permit = 1;
		$lock = DA::OrgMail::folder_lock($session);
	}
	if ($nolock || !$org_mail_permit || $lock) {
		my $path      = &_fid2path($session, $imaps, $folders, $fid);
		my $md5_path  = Digest::MD5::md5_hex($path);
		if (&lock($session, "trans.rebuild.$md5_path")) {
			$folders->{$fid}->{uidvalidity} = $uidval;
			if (&storable_store($session, $folders, "folders")) {
				# Delete DB
				my $dc = {
					"mode"   => "folder_name",
					"folder" => $folder
				};
				if (&_delete_header($session, $imaps, $dc)) {
					if (&_delete_folder($session, $imaps, $dc)) {
						my $uc = { "fid" => $fid, "recentzero" => 1 };
						$result = &update($session, $imaps, $folders, $uc);
						unless ($result->{error}) {
							$imaps->{uidval}->{$folder}->{warn} = 0;
							$imaps->{param}->{uidval_rewrite}   = 1;
						}
					} else {
						&_warn($session, "_delete_folder");
						$error = &error("NOT_DELETE_FOLDER_TABLE", 9);
					}
				} else {
					&_warn($session, "_delete_header");
					$error = &error("NOT_DELETE_HEADER_TABLE", 9);
				}
			} else {
				&_warn($session, "storable_store");
				$error = &error("NOT_WRITE_FOLDERS", 9);
			}

			&unlock($session, "trans.rebuild.$md5_path");
		} else {
			&_warn($session, "lock");
			$error = &error("NOT_LOCK", 9);
		}

		#　一時ファイルのロックを削除
		DA::OrgMail::folder_unlock($session, "lock.folders") unless $nolock;
	} else {
		&_warn($session, "lock:lock.folders");
		$error = &error("NOT_LOCK_FOLDERS", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub email_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "email"));       
}

sub email_ext_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "email_ext"));
}

sub user_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "user"));
}

sub group_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "group"));       
}

sub bulk_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "bulk"));       
}

sub share_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "share"));
}

sub epsml_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;

	return(&mail($session, $imaps, $folders, $c, "epsml"));
}

sub object_mail($$;$$) {   
	my ($session, $imaps, $folders, $c) = @_;     

	return(&mail($session, $imaps, $folders, $c, "object"));
}

sub new_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "new"));
}

sub reply_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "reply"));
}

sub all_reply_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "all_reply"));
}

sub forward_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "forward"));
}

sub edit_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "edit"));
}

sub template_mail($$;$$) {
	my ($session, $imaps, $folders, $c) = @_;
	return(&mail($session, $imaps, $folders, $c, "template"));
}

sub mail($$;$$$) {  
	my ($session, $imaps, $folders, $c, $opt) = @_;   
	my $logger = &_logger_init($session, 1);
	my $module = DA::IS::get_module($session);
	my $fid    = $c->{fid};
	my $uid    = $c->{uid};
	my $tid    = $c->{tid};
	my $quote  = $c->{quote};
	my $backup_maid = $c->{backup_maid};
	my $type   ; 
	my $target ;
	my $result = {};
	my $error;
	my $mail = {};
	my $maid = &inc_num($session, "maid");
	if($fid) {
		$type  = &_fid2type($session, $imaps, $folders, $fid);
		$target = &is_backup($session, $imaps, $type) ? "backup" : "sent";
		if($target eq 'backup' && $backup_maid=~/^\d{1,}$/) {
			my $mail_mid_gid = DA::OrgMail::get_gid($session);
			my $mapping_file = $mail_mid_gid.'.maid_mapping.dat';
			$mapping_file = &backup_mapping_file($session,$mapping_file);
			my $buf_mapping;
			if (my $fh = &open_file($session, $mapping_file, "r")) {
				while (my $l = <$fh>) {
					chomp($l);
					my ($maid_old,$back_maid) = split(/=/, $l);
					if ($backup_maid eq $back_maid) {
						$buf_mapping .= "$maid=$backup_maid" . "\n";	
					}else {
						$buf_mapping .= $l . "\n";
					}
				} 
			&close_file($session, $mapping_file, $fh);
		} else {
			&_warn($session, "open_file");
			$result = 0;
		}

		if ($result) {
			unless (&write_file_buf($session, $mapping_file, $buf_mapping)) {
				&_warn($session, "write_file");
				$result = 0;
			}
		}
		}
	}
	if ($maid) {
		&storable_clear($session, "$maid\.mail");
		$mail->{proc} = $opt;
		$mail->{maid} = $maid;
		$mail->{fid}  = $fid;
		$mail->{uid}  = $uid;

		# _create_baggage($session, $imaps, "to", $maid);
		# _create_baggage($session, $imaps, "cc", $maid);
		# _create_baggage($session, $imaps, "bcc", $maid);
	} else {
		return(&error("NOT_INC_MAIL", 9));
	}

	if ($opt =~ /^(?:reply|all_reply)$/) {
		$mail->{mode} = 1;
	} elsif ($opt eq "forward") {
		$mail->{mode} = 2;
	} else {
		$mail->{mode} = 0;
	}
	if (&lock($session, "send.$maid")) {
		# テンプレート
		unless ($error) {
			$mail->{tid} = $tid;
		}

		# 言語
		unless ($error) {
			if (my $lang = &lang_list($session, $imaps)) {
				$mail->{lang} = $lang;
			} else {
				&_warn($session, "lang_list");
				$error = &error("NOT_GET_LANG_LIST", 9);
			}
		}

		# 敬称
		unless ($error) {
			if (my $title = &title_list($session, $imaps)) {
				$mail->{title} = $title;
			} else {
				&_warn($session, "title_list");
				$error = &error("NOT_GET_TITLE_LIST", 9);
			}
		}

		# テンプレート
		unless ($error) {
			if (my $template = &template_list($session, $imaps)) {
				$mail->{template} = $template;
			} else {
				&_warn($session, "template_list");
				$error = &error("NOT_GET_TEMPLATE_LIST", 9);
			}
		}

		# 署名
		unless ($error) {
			if (my $sign = &sign_list($session, $imaps)) {
				$mail->{sign} = $sign;
			} else {
				&_warn($session, "sign_list");
				$error = &error("NOT_GET_SIGN_LIST", 9);
			}
		}
		# その他
		unless ($error) {
			my $detail = {};
			if ($opt =~ /^(reply|all_reply|forward|edit)$/) {
				unless (&storable_exist($session, "$fid\.$uid\.detail")) {
					my $rd = &detail($session, $imaps, $folders, $c);
					my $rf = &flag($session, $imaps, $folders, $c);
					if ($rd->{error}) {
						$error = $rd;
					} elsif ($rf->{error}) {
						$error = $rf;
					}
				}
				$detail = &storable_retrieve($session, "$fid\.$uid\.detail");
				if ($detail) {
					my $oplog = {
						"app"    => "mail",
						"docid"  => "ajax/mail/$session->{user}/$maid",
						"type"   => "MM",
						"detail" => {
							"To"         => &convert_internal($detail->{original}->{To}),
							"Cc"         => &convert_internal($detail->{original}->{Cc}),
							"Bcc"        => &convert_internal($detail->{original}->{Bcc}),
							"From"       => &convert_internal($detail->{original}->{From}),
							"Date"       => &convert_internal($detail->{original}->{Date}),
							"Subject"    => &convert_internal($detail->{original}->{Subject}),
							"Message-Id" => &convert_internal($detail->{message_id})
						}
					};
					if(DA::OrgMail::use_org_mail($session)){
						my $gid = DA::OrgMail::get_gid($session);
						$oplog->{type} = "MMO";
						$oplog->{detail}->{gid} = $gid;
					}
					DA::OperationLog::log($session, $oplog);
				} else {
					&_warn($session, "storable_retrieve");
					$error = &error("NOT_READ_DETAIL", 9);
				}


			} elsif ($opt =~ /^(epsml)$/) {
				my $l = $c->{l};
				my $r = $c->{r};
				my $m = $c->{m};
				my $n = $c->{n};
				unless ($detail = &_epsml($session, $imaps, $l, $r, $m, $n)) {
					&_warn($session, "_epsml");
					$error = &error("NOT_GET_EPSML_ARCHIVE");
				}
			}
			
			my $template = {};
			if ($tid) {
				unless ($template = &template_detail($session, $imaps, $tid)) {
					&_warn($session, "template_detail");
					$error = &error("NOT_GET_TEMPLATE_DETAIL", 9);
				}
			}
			my ($fckstylehead,$enddiv);
                        unless($detail->{body}->{html} eq ""){
if($detail->{body}->{html} =~ s/\<body\>[\r\n]*(\<\!-- Created by DA_Richtext v2\.0 --\>\<\!-- start default style -->.*\<\!-- end default style --\>)([\x00-\xff]+)(\<\/div\>)[\r\n]*\<\/body\>/\<body\>$2\<\/body\>/i){
                                $fckstylehead = $1;
                                $enddiv = $3;
                            }
                        }
			my $allow  = &get_sys_custom($session, "htmlmail_allow_tag");
			my $status = &_quote_status
							($session, $imaps, $module, $allow, $detail, $template, $opt, $quote, $maid);						
			my $header = &_quote_header
							($session, $imaps, $module, $allow, $detail, $template, $opt, $quote, $maid);
			my $body   = &_quote_body
							($session, $imaps, $module, $allow, $detail, $template, $opt, $quote, $maid);
			my $attach = &_quote_attach
							($session, $imaps, $module, $allow, $detail, $template, $opt, $quote, $maid);

			unless ($allow) {
				&_warn($session, "get_sys_custom");
				$error = &error("NOT_READ_HTMLMAIL_CONFIG", 9);
			}
			unless ($status) {
				&_warn($session, "_quote_status");
				$error = &error("NOT_QUOTE_STATUS", 9);
			}
			unless ($header) {
				&_warn($session, "_quote_header");
				$error = &error("NOT_QUOTE_HEADER", 9);
			}
			unless ($body) {
				&_warn($session, "_quote_body");
				$error = &error("NOT_QUOTE_BODY", 9);
			}
			unless ($attach) {
				&_warn($session, "_quote_attach");
				$error = &error("NOT_QUOTE_ATTACH", 9);
			}
			unless ($error) {
				my $sign = &_sign($session, $imaps, $status->{sid}, $status->{from});
				if (defined $sign) {
					# ステータス
					$mail->{status} = $status;

					# ヘッダ
					foreach my $f (qw(to cc bcc to_text cc_text bcc_text from sign_init in_reply_to references subject priority)) {
						$mail->{$f} = $header->{$f};
					}
					if ($opt eq "email") {
						if (DA::SmartPhone::isSmartPhoneUsed()) {
							my $name  = $c->{name};
							my $email = $c->{email};

							if (my $card = &get_card($session, $imaps, "", "", $name, $email)) {
								push(@{$mail->{to}}, $card);
							}
						} else {
							my $email = pack("H*", $c->{email});

							$mail->{to_text} = $email;
						}
					} elsif ($opt eq "email_ext") {
                        my $data = &storable_retrieve($session, $c->{id});
                        foreach my $fld (keys %{$data->{$c->{no}}}) {
                               if ($fld =~ /^(?:to|cc|bcc)$/i) {
                                      $mail->{$fld . "_text"} = $data->{$c->{no}}->{$fld};
                               } elsif ($fld eq "subject") {
                                       $mail->{$fld} = $data->{$c->{no}}->{$fld};
                               }
                        }
                        $body->{text} = $data->{$c->{no}}->{body};
                        $body->{html} = &_text2html($body->{text}, &mailer_charset());
                	}elsif ($opt eq "user") {
						my $mid  = int($c->{mid});
						my $type = 1;
						if (DA::SmartPhone::isSmartPhoneUsed()) {
							my $name  = $c->{name};
							my $email = $c->{email};

							if (my $card = &get_card($session, $imaps, $mid, $type, $name, $email)) {
								push(@{$mail->{to}}, $card);
							}
						} else {
							my $info = DA::IS::get_user_info($session, $c->{mid}, [qw(name alpha email)]);
							my $name  = DA::CGIdef::get_display_name($session, $info->{name});
							my $alpha = DA::CGIdef::get_display_name($session, $info->{alpha});
							my $vname = DA::IS::check_view_name($session, $name, $alpha);
							my $email = $info->{email};

							if (my $card = &get_card($session, $imaps, $mid, $type, $vname, $email)) {
								my $join = DA::IS::get_join_group($session, $session->{user});
								my $owner_group = DA::IS::get_owner_group($session, $session->{user}, 0, 'all');

								# for_multi ---
								if (DA::IS::get_multi_view_rest_type($session)) {
									if (DA::IS::is_permit_member($session, 'ajxmailer', $mid, $join, { call_mode=>'mail_user',owner_func=>'all' }, $owner_group)) {
										push(@{$mail->{to}}, $card);
									}
								} else {
									push(@{$mail->{to}}, $card);
								}
								#---

							}
						}
					} elsif ($opt eq "group") {
						my $gid  = int($c->{gid});
						my $type = 2;

						if (my $card = &get_card($session, $imaps, $gid, $type)) {
							my $join = DA::IS::get_join_group($session, $session->{user});
							my $owner_group = DA::IS::get_owner_group($session, $session->{user}, 0, 'all');

							# for_multi ---
							if (DA::IS::get_multi_view_rest_type($session)) {
								if (DA::IS::is_permit_group($session, 'ajxmailer', $gid, $join, { call_mode=>'mail_group', owner_func=>'all' }, $owner_group)) {
									push(@{$mail->{to}}, $card);
								}
							} else {
								push(@{$mail->{to}}, $card);
							}
							#---

						}
					} elsif ($opt eq "share") {
						if (DA::SmartPhone::isSmartPhoneUsed()) {
							my $aid   = $c->{aid};
							my $type  = 0;
							my $name  = $c->{name};
							my $email = $c->{email};

							if (my $card = &get_card($session, $imaps, $aid, $type, $name, $email)) {
								push(@{$mail->{to}}, $card);
							}
						} else {
						}
					} elsif ($opt eq "bulk") {
						if (DA::SmartPhone::isSmartPhoneUsed()) {
							my $aid = $c->{aid};
							my ($users, $text) = _bulk($session, $imaps, $aid);
							if (scalar(@{$users})) {
								push(@{$mail->{to}}, @{$users});
							}
							foreach my $email (split(/\,/, $text)) {
								if (my $card = &get_card($session, $imaps, "", "", "", $email)) {
									push(@{$mail->{to}}, $card);
								}
							}
						} else {
							my $aid = pack("H*", $c->{aid});
							my ($users, $text) = _bulk($session, $imaps, $aid);
							$mail->{to_text} = $text;
							if (scalar(@{$users})) {
								push(@{$mail->{to}}, @{$users});
							}
						}
					} elsif ($opt eq "object") {
						if (my $obj = &_object($session, $imaps, $module, $maid)) {
							foreach my $f (qw(to cc bcc)) {
								if ($obj->{$f}) {
									push(@{$mail->{$f}}, @{$obj->{$f}});
								}
							}
							foreach my $f (qw(to_text cc_text bcc_text in_reply_to references subject)) {
								if ($obj->{$f}) {
									$mail->{$f} = $obj->{$f};
								}
							}
							$body   = $obj->{body};
							$attach = $obj->{attach};

							my @sign=split(/\:/,$obj->{sign});
							if ($sign[4]  ne '') { $mail->{status}->{notification} =$sign[4];  } # 開封通知
							if ($sign[8]  ne '') { $mail->{status}->{reply_use}    =$sign[8];  } # 返信メールアドレスを使用
							if ($sign[10] ne '') { $mail->{status}->{open_status}  =$sign[10]; } # 開封状況の確認
							if ($sign[12] ne '') { $mail->{status}->{content_type} =$sign[12]; } # 書式

							# その他の一時ファイルのsign行パラメータは影響範囲を限定するために無視する
							# if ($sign[0]  ne '') { $mail->{status}->{sign}         =$sign[0];  }
							# if ($sign[1]  ne '') { $mail->{status}->{priority}     =$sign[1];  }
							# if ($sign[2]  ne '') { $mail->{status}->{group_name}   =$sign[2];  }
							# if ($sign[3]  ne '') { $mail->{status}->{encode}       =$sign[3];  }
							# if ($sign[5]  ne '') { $mail->{status}->{my_addr}      =$sign[5];  }
							# if ($sign[11] ne '') { $mail->{status}->{attach_hidden}=$sign[11]; }
						}
					}
					# 本文
					my $rich_conf = DA::IS::get_sys_custom($session,"richtext");
					foreach my $f (qw(text html)) {
						if ($status->{sid}) {
							my $s = ($f eq "html") ?
										&_text2html($sign, &mailer_charset()) : $sign;
							my $c = ($f eq "html") ?
										&_text2html(" \n \n", &mailer_charset()) : " \n \n";
							if ($sign eq "") {
								$c = "";
							} else {
								if ($f eq "text") {
									#if ($ENV{'HTTP_USER_AGENT'} =~ /MSIE/i){
									if($session->{ua_browser}eq"InternetExplorer") {
					            		if ($s !~ /\n$/) {
											$s .= "\n";
										}
					            	}
								}	
							}
							$body->{$f} = &_tag_html4ajax($body->{$f}) if ($f eq "html");
							if (DA::SmartPhone::isSmartPhoneUsed()) {
								if ($opt eq "edit") {
									$body->{$f} = &_delete_sign($session, $imaps, $status->{sid}, $f, $body->{$f});
								}
								$mail->{body}->{$f} = $body->{$f};
							} elsif ($opt eq "edit") {
								$mail->{body}->{$f} = $body->{$f};
							} else {
								if ($mail->{status}->{from} eq 'keitai_mail' && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_mb.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_mb.txt"))) {
									if ($imaps->{mail}->{sign_actM} eq "on") {
										$mail->{body}->{$f} = $s . $c . $body->{$f};
									} else {
										$mail->{body}->{$f} = $body->{$f} . $c . $s;
									}
								} elsif ($mail->{status}->{from} eq 'pmail1' && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st1.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st1.txt"))) {
									if ($imaps->{mail}->{sign_act1} eq "on") {
										$mail->{body}->{$f} = $s . $c . $body->{$f};
									} else {
										$mail->{body}->{$f} = $body->{$f} . $c . $s;
									}
								} elsif ($mail->{status}->{from} eq 'pmail2'&& (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st2.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st2.txt"))) {
									if ($imaps->{mail}->{sign_act2} eq "on") {
										$mail->{body}->{$f} = $s . $c . $body->{$f};
									} else {
										$mail->{body}->{$f} = $body->{$f} . $c . $s;
									}
								} else {
									if ($imaps->{mail}->{sign_act} eq "on") {
										$mail->{body}->{$f} = $s . $c . $body->{$f};
									} else {
										$mail->{body}->{$f} = $body->{$f} . $c . $s;
									}
								}
							}
						} else {
							$mail->{body}->{$f} = $body->{$f};
						}
						if ($f eq "html" && $mail->{body}->{$f} ne "" && $rich_conf->{editor} ne "crossbrowser"){
							$mail->{body}->{$f} = $fckstylehead.$mail->{body}->{$f}.$enddiv;
						}
					}
					# 添付
					$mail->{attach} = $attach;
					$mail->{last_aid} = (sort {$a <=> $b} keys %{$attach})[-1];

                    # 予約フラグ
                    $mail->{reserve1} = $detail->{reserve1};
                    $mail->{reserve2} = $detail->{reserve2};

					unless (&storable_store($session, $mail, "mail.$maid")) {
						&_warn($session, "storable_store");
						$error = &error("NOT_WRITE_MAIL", 9);
					}
				} else {
					&_warn($session, "_sign");
					return(&error("NOT_READ_SIGN", 9));
				}
			}
		}

		if ($error) {
			$result = $error;
		} else {
			$result->{mail} = $mail;
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$result = &error("NOT_LOCK", 9);
	}

	#back up 組織メール
	my $back_dir = &infobase($session,'backup'); 
	my $back_org_dir = "$back_dir/org_info";
	unless (-d $back_dir) {
		DA::System::mkdir($back_dir, 0750, $DA::Vars::p->{www_user}, $DA::Vars::p->{www_group});
	}
	# 組織メール
	if (DA::OrgMail::check_org_mail_permit($session)) {
		unless (-d $back_org_dir) {
			DA::System::mkdir($back_org_dir, 0750, $DA::Vars::p->{www_user}, $DA::Vars::p->{www_group});
		}

		my $hide_save_button = 'off';
		if( $folders->{$fid}->{type} eq $TYPE_BACKUP_FOLDER ) {
			
			if($c->{uid} =~ /^\d+$/) {

				my $back_group_file =  "$back_org_dir/$c->{uid}.org_mail";
				my $back_group_file_new = "$back_org_dir/$maid.org_mail";
				my $org_ma_temp="$session->{temp_dir}/$session->{sid}.org_mail"; 
				if(-f $back_group_file) {
					unless (-f $org_ma_temp) {
						DA::System::file_copy($back_group_file, $org_ma_temp);	
					}
					my $org_info = &get_infofile($session,$back_group_file,'back_org_mail');
					my $cookie_gid = DA::OrgMail::get_gid($session);

					if($org_info->{gid} ne $cookie_gid) {
						$hide_save_button = 'true';
					}
				}
			}
		}
		
		$result->{hide_save_button} = $hide_save_button;	
		DA::OrgMail::ajxmailer_mail($session, $imaps, $folders, $c, $opt, $result);
	}
	DA::Custom::ajxmailer_mail($session, $imaps, $folders, $c, $opt, $result);
	&_logger($session, $imaps, $logger);

	return($result);
}

sub address($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $maid   = $c->{maid};
	my $result = {};

	if (&lock($session, "send.$maid")) {
		foreach my $fld (qw(to cc bcc)) {
			# ▽ DA::Address::Baggageの取得
			my $bag = _get_baggage($session, $imaps, $fld, $maid);

			$result->{$fld} = &_loop_baggage($session, $imaps, $bag);
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$result = &error("NOT_LOCK", 9);
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub bulk($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $maid   = $c->{maid};
	my $aid    = $c->{aid};
	my $fld    = "to";
	my $result = {};

	if (&lock($session, "send.$maid")) {
		$result->{users} = _bulk($session, $imaps, $aid);

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$result = &error("NOT_LOCK", 9);
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub attach($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $maid   = $c->{maid};
	my $result = {};
	my $error;

	if (&lock($session, "send.$maid")) {
		if (my $mail = &storable_retrieve($session, "mail.$maid")) {
			my $max = $imaps->{system}->{max_send_size};
			my $total;
			foreach my $aid (sort {$a <=> $b} keys %{$mail->{attach}}) {
				my $name = $mail->{attach}->{$aid}->{name};
				my $size = $mail->{attach}->{$aid}->{size};
				$total += $size;
			}

			$result->{max}    = $max;
			$result->{over}   = ($max && $total > $max) ? 1 : 0;
			$result->{total}  = $total;
			$result->{attach} = $mail->{attach};
		} else {
			&_warn($session, "storable_retrieve");
			$error = &error("NOT_READ_MAIL", 9);
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub send_mail($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $maid   = $c->{maid};
	my $xml    = $c->{xml};
	my $uid    = $c->{uid};
	my $result = {};
	my ($sndflg, $error);
	my $is_sosiki_mail = 0;

	if (&lock($session, "send.$maid")) {
		my $rmm = &make_mail($session, $imaps, $c, $maid, $xml, "sent");
		#sosiki mail flag 
		#組織メール送信後Sentフォルダ数変更のバグを改修ため 
		if($uid =~ /^\d{1,}$/) {
			my $back_dir = &infobase($session,'backup'); 
			my $back_org_dir = "$back_dir/org_info";
			my $org_ma_info="$back_org_dir/"
               . "$uid.org_mail";
            if(-f $org_ma_info) {
				my $current_mail_gid = DA::OrgMail::get_gid($session);
				my $orgmail = DA::OrgMail::get_org_mail_data($session,$current_mail_gid);
				if($imaps->{imap}->{user} ne $orgmail->{mail_user}) {
					$is_sosiki_mail = 1;
				}
            }
		}
		
		if ($rmm->{error}) {
			$error = $rmm;
			if(!$rmm->{message}) {
                   #back up 組織メール処理 送信後バックアップの削除
                   my $backup_maid = $c->{backup_maid};
                   if($backup_maid =~ /^\d{1,}$/) {
                           my $current_mail_gid = DA::OrgMail::get_gid($session);
                           my $mapping_info_file = "$current_mail_gid".'.maid_mapping.dat';
                           $mapping_info_file = &backup_mapping_file($session,$mapping_info_file);
                           my $back_mapping_info = &get_infofile($session,$mapping_info_file,'backup_mapping');
                           my %back_mapping_info_inverse = reverse %{$back_mapping_info};
                           &_delete_backup_after_send_or_save($session, $imaps, \%back_mapping_info_inverse, $backup_maid, $maid);
                   }
           }
		} elsif (scalar(keys %{$rmm->{errors}}) && !$c->{nopreview}) {
			$result->{errors}  = $rmm->{errors};
			$result->{preview} = $rmm->{preview};
		} elsif (scalar(@{$rmm->{warn}}) && !$c->{nopreview}) {
			$result->{warn}    = $rmm->{warn};
			$result->{preview} = $rmm->{preview};
		} elsif (scalar(keys %{$rmm->{warns}}) && !$c->{nopreview}) {
			$result->{warns}  = $rmm->{warns};
			$result->{preview} = $rmm->{preview};
		} else {
			if (my $serial = &open_dbm($session, "send.serial")) {
				if ($serial->{$maid}) {
					$error = &error("ALREADY_SEND_MAIL", 9);
				} else {
					my $from = $imaps->{imap}->{mail_address} || $session->{email};
					my $send = {
						"mime"     => $rmm->{mime},
						"from"     => $from,
						"file"     => "$session->{temp_dir}/$session->{sid}.AjaxMailer.send.$maid",
						"auth"     => &smtp_auth_account($session, $imaps),
						"external" => $rmm->{external}
					};
					#================================================
                    # New CBP used for SMTP Auth
                    #================================================
                    DA::Custom::rewrite_send_param($session, $send, {});
                    #================================================
					if (my $message = &send_command($send)) {
						&close_dbm($session, "send.serial", $serial);

						&_warn($session, "send_command");
						$error = { "error" => 9, "message" => $message };
					} else {
						if (&close_dbm($session, "send.serial", $serial)) {
							# DA::OrgMail::rewrite_make_mail_result4ajx　第二回使用して、組織メール承認の場合、DB操作を実行します
							if (DA::OrgMail::check_org_mail_permit($session)) {
								DA::OrgMail::rewrite_make_mail_result4ajx($session, $imaps, 'sent', undef, {maid=>$maid}, $rmm, $c, 1);
							}
							$sndflg = 1;
						} else {
							&_warn($session, "close_dbm");
							$error = &error("NOT_WRITE_SEND_SERIAL", 9);
						}
					}
				}
			} else {
				&_warn($session, "open_dbm");
				$error = &error("NOT_READ_SEND_SERIAL", 9);
			}

            # 開封通知データを挿入
            if (!$error && $sndflg) {
                my $data = DA::Ajax::parse_xml($session, $xml);
                if ($data->{open_status} && $DA::Vars::p->{ma_open_status} eq "on") {
                    DA::Mail::set_open_status_db($session,
                        $rmm->{mime}->{head}->{'Message-Id'},
                        $rmm->{osd}->{date},
                        $rmm->{osd}->{subject},
                        $rmm->{osd}->{sndlst}
                    );
                }
            }
			if (!$error && $sndflg) {
				my $mime  = $rmm->{mime};
				my $local = $rmm->{local};
				if (my $rst = &store_mail($session, $imaps, $maid, $mime, $local, "send", $uid, $c)) {
					&_warn($session, "store_mail");
					$error = $rst;
				}
			}

			if (my $folders_for_del_local = &storable_retrieve($session, "folders")) {
				my $type;
				if ($rmm->{fid} && $rmm->{uid} && $rmm->{proc} eq "edit") {
					$type = &_fid2type($session, $imaps, $folders_for_del_local, $rmm->{fid});

					if ($type eq $TYPE_LOCAL_FOLDER) {
						my $dc = {
							"fid" => $rmm->{fid},
							"uid" => $rmm->{uid}
						};
						my $rdm = &delete_mail($session, $imaps, undef, $folders_for_del_local, $dc);
						if ($rdm->{error}) {
							&_warn($session, "delete_mail");
							$error = $rdm;
						}
					}
				}
			} else {
				&_warn($session, "storable_retrieve");
				$error = &error("NOT_READ_FOLDERS", 9);
			}

			if (!$error && $sndflg) {
				if (my $folders = &storable_retrieve($session, "folders")) {
					my $type;
					if ($rmm->{fid} && $rmm->{uid} && $rmm->{proc} eq "edit") {
						$type = &_fid2type($session, $imaps, $folders, $rmm->{fid});

						if ($type eq $TYPE_DRAFT) {
							my $dc = {
								"fid" => $rmm->{fid},
								"uid" => $rmm->{uid}
							};
							my $rdm = &delete_mail($session, $imaps, undef, $folders, $dc);
							if ($rdm->{error}) {
								&_warn($session, "delete_mail");
								$error = $rdm;
							}
						}
					}

					unless ($error) {
						my $info = &_sent($session, $imaps);
						my $path = $info->{path};
						my $fid  = &_path2fid($session, $imaps, $folders, $path);
						my $uc = {
							"fid"      => $fid,
							"noupdate" => 1,
							"gid"     =>$c->{gid}
						};
						my $r = &update($session, $imaps, $folders, $uc);
						if ($r->{error}) {
							&_warn($session, "update");
							$error  = $r;
						} else {
							my @fids = ($rmm->{fid} && $rmm->{proc} eq "edit") ? ($rmm->{fid}, $fid) : ($fid);	
							if ($type eq $TYPE_BACKUP_FOLDER && $is_sosiki_mail) {
								@fids = ($rmm->{fid});
							}
							if (my $counts = &counts($session, $imaps, $folders, \@fids, $c->{gid})) {
								$result->{warn}   = $rmm->{warn};
								$result->{counts} = $counts;
								$result->{save_target} = $info->{name};
							} else {
								&_warn($session, "counts");
								$error = &error("NOT_GET_COUNT");
							}
						}
					}
				} else {
					&_warn($session, "storable_retrieve");
					$error = &error("NOT_READ_FOLDERS", 9);
				}
			}
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);
	### CBP ###
	DA::Custom::rewrite_send_mail_result4ajx($session, $imaps, $c, $result);	
	
	return($result);
}

sub draft_mail($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $maid   = $c->{maid};
	my $xml    = $c->{xml};
	my $uid    = $c->{uid};
 	my $result = {};
	my $error;

	if (&lock($session, "send.$maid")) {
		my $rmm = &make_mail($session, $imaps, $c, $maid, $xml, "draft");

		if ($rmm->{error}) {
			$error = $rmm;
		} elsif (scalar(keys %{$rmm->{errors}}) && !$c->{nopreview}) {
			$result->{errors}  = $rmm->{errors};
			$result->{preview} = $rmm->{preview};
		} else {
			my $mime  = $rmm->{mime};
			my $local = $rmm->{local};
			if (my $rst = &store_mail($session, $imaps, $maid, $mime, $local, "draft", $uid, $c)) {
				&_warn($session, "store_mail");
				$error = $rst;
			}

			if (!$error) {
				if (my $folders = &storable_retrieve($session, "folders")) {
					if ($rmm->{fid} && $rmm->{uid} && $rmm->{proc} eq "edit") {
						my $type = &_fid2type($session, $imaps, $folders, $rmm->{fid});

						if ($type eq $TYPE_DRAFT || $type eq $TYPE_LOCAL_FOLDER) {
							my $dc = {
								"fid" => $rmm->{fid},
								"uid" => $rmm->{uid}
							};
							my $rdm = &delete_mail($session, $imaps, undef, $folders, $dc);
							if ($rdm->{error}) {
								&_warn($session, "delete_mail");
								$error = $rdm;
							}
						}
					}

					unless ($error) {
						my $info = &_draft($session, $imaps);
						my $path = $info->{path};
						my $fid  = &_path2fid($session, $imaps, $folders, $path);
						my $uc = {
							"fid"      => $fid,
							"noupdate" => 1
						};
						my $r = &update($session, $imaps, $folders, $uc);
						if ($r->{error}) {
							&_warn($session, "update");
							$error = $r;
						} else {
							my @fids = ($rmm->{fid} && $rmm->{proc} eq "edit") ? ($rmm->{fid}, $fid) : ($fid);						
							if (my $counts = &counts($session, $imaps, $folders, \@fids)) {
								$result->{counts} = $counts;
								$result->{save_target} = $info->{name};
							} else {
								&_warn($session, "counts");
								$error = &error("NOT_GET_COUNT");
							}
						}
					}
				} else {
					&_warn($session, "storable_retrieve");
					$error = &error("NOT_READ_FOLDERS", 9);
				}
			}
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub backup_mail($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $maid   = $c->{maid};
	my $xml    = $c->{xml};
	my $uid    = $c->{uid}; 
	my $result = {};
	my $error;
	my $backup_maid;
	my $rst;

	if (&lock($session, "send.$maid")) {
		my $rmm = &make_mail($session, $imaps, $c, $maid, $xml, "backup");

		if ($rmm->{error}) {
			$error = $rmm;
		} elsif (scalar(keys %{$rmm->{errors}}) && !$c->{nopreview}) {
			$result->{errors}  = $rmm->{errors};
			$result->{preview} = $rmm->{preview};
		} else {
			my $mime  = $rmm->{mime};
			my $local = $rmm->{local};	
			($rst,$backup_maid) = &store_mail($session, $imaps, $maid, $mime, $local, "backup", $uid, $c);	
			if ($rst) {
				if($rst->{error} eq '1003') {
					&_info($session, "The same mail opened twice,first opened mail can't be backuped!");
				}else {
					&_warn($session, "store_mail");
				}
				$error = $rst;
			}
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}


	if ($error) {
		$result = $error;
	}
	if($backup_maid) {
		$result->{backup_maid} = $backup_maid;
	}

	&_logger($session, $imaps, $logger);


	return($result);
}

sub preview_mail($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $maid   = $c->{maid};
	my $xml    = $c->{xml};
	my $result = {};
	my $local    = {};
	my $entity   = {};
	my $error;

	if (&lock($session, "send.$maid")) {
		my $rmm = &make_mail($session, $imaps, $c, $maid, $xml, "preview");

		if ($rmm->{error}) {
			$error = $rmm;
		} else {
			$result->{warn}    = $rmm->{warn};
			$result->{preview} = $rmm->{preview};
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub print_mail($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $maid   = $c->{maid};
	my $xml    = $c->{xml};
	my $result = {};
	my $error;

	if (&lock($session, "send.$maid")) {
		my $rmm = &make_mail($session, $imaps, $c, $maid, $xml, "print");

		if ($rmm->{error}) {
			$error = $rmm;
		} else {
			$result->{warn}    = $rmm->{warn};
			$result->{print} = $rmm->{preview};
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub custom_mail($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $maid   = $c->{maid};
	my $xml    = $c->{xml};
	my $result = {};
	my $error;

	if (&lock($session, "send.$maid")) {
		my $rmm = &make_mail($session, $imaps, $c, $maid, $xml, "custom");

		if ($rmm->{error}) {
			$error = $rmm;
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub make_mail($$$$$$) {
	my ($session, $imaps, $c, $maid, $xml, $opt) = @_;
	my $logger   = &_logger_init($session, 1);
	my $module   = DA::IS::get_module($session);
	my $timezone = $DA::Vars::p->{timezone} || $MAIL_VALUE->{TIME_ZONE};	# ISE_01001421 2009/08/03
	my $result   = {};
    my $local    = {};
    my $entity   = {};
	my $preview  = {};
	my $errors   = {};

	# XML Parse
	my $data;
	if (ref($xml)) {
		$data = $xml;
	} else {
		$data = DA::Ajax::parse_xml($session, $xml);
	}

	my $charset      = ($data->{charset} eq "UTF-8") ? "UTF-8" : "ISO-2022-JP";
	my $content_type = ($c->{content_type} eq "html") ? "html" : "text";
	my $tid          = $data->{tid};
	my $sid          = $data->{sid};
	my $priority     = $data->{priority};
	my $notification = $data->{notification};
	my $in_reply_to  = $data->{in_reply_to};
	my $references   = $data->{references};
	my $subject      = $data->{subject};
	my $group_name   = $data->{group_name};
    my $open_status  = ($DA::Vars::p->{ma_open_status} eq "on") ? $data->{open_status} : 0;
	my $reply_use    = $data->{reply_use};
	my $select       = $data->{from}->{select};
	my $user_id      = $session->{user};
	my $user_name    = &get_user_name($session, $imaps, $select);
	my $user_email   = &get_user_address($session, $imaps, $select);
	my $subject_empty   = 0;
	my $external_exists = 0;
	my $spellcheck_ng   = 0;
	my $spellcheck_size_ng = 0;
	my $spellcheck_mode = $c->{spellcheck};
	my ($internal_domain, $allow, $spellcheck, $msgid, $mail, $user_reply);
	if ($select eq 'pmail1' && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st1.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st1.txt"))) {
		$user_reply   = ($reply_use) ? $imaps->{mail}->{reply1} : "";
	} elsif ($select eq 'pmail2' && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st2.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st2.txt"))) {
		$user_reply   = ($reply_use) ? $imaps->{mail}->{reply2} : "";
	} elsif ($select eq 'keitai_mail' && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_mb.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_mb.txt"))) {
		$user_reply   = ($reply_use) ? $imaps->{mail}->{replyM} : "";
	} else {
		$user_reply   = ($reply_use) ? $imaps->{mail}->{reply} : "";
	}
	unless ($internal_domain = &get_sys_custom_lines($session, "internal_domain", 1)) {
		&_warn($session, "get_sys_custom_lines");
		return(&error("NOT_READ_INTERNAL_DOMAIN", 9));
	}
	unless ($allow = &get_sys_custom($session, "htmlmail_allow_tag")) {
		&_warn($session, "get_sys_custom");
		return(&error("NOT_READ_HTMLMAIL_CONFIG", 9));
	}
	unless ($spellcheck = &get_sys_custom($session, "spellcheck")) {
		&_warn($session, "get_sys_custom");
		return(&error("NOT_READ_SPELLCHECK_CONFIG", 9));
	}

	unless ($msgid = &inc_msgid($session)) {
		&_warn($session, "inc_msgid");
		return(&error("NOT_INC_MSGID", 9));
	}

	if ($maid) {
		unless ($mail = &storable_retrieve($session, "mail.$maid")) {
			&_warn($session, "storable_retrieve");
			return(&error("NOT_READ_MAIL", 9));
		}
		if ($c->{target_attach_list}) {
			foreach my $aid (sort {$a <=> $b} keys %{$mail->{attach}}) {
				unless ($c->{target_attach_list}->{$aid}) {
					delete $mail->{attach}->{$aid};
				}
			}
		}
	} else {
		$mail = {
			"proc"   => "direct",
			"fid"    => 0,
			"uid"    => 0,
			"attach" => {}
		};
	}
	#
	# Custom
	#
	if (DA::Custom::check_make_mail_data4ajx($session, $imaps, $opt, $mail, $data, $c)) {
		return({ "error" => $data->{result}->{error}, "message" => $data->{result}->{message} });
	}

	# Message-Id, Boundary
	my $time = time;
	my $message_id = "$time\.$msgid\.$SERVER_NO\@$DA::Vars::p->{mail_domain}";
	my $boundary   = "--_$DA::Vars::p->{package_name}\_"
	               . crypt("$time\.$msgid\.$SERVER_NO", "IW");
	   $boundary   =~s/\@/_/g;
	$entity->{"Message-Id"} = "<$message_id>";

	# From, Reply-To
	my ($encode, $from, $reply, $from_p);
	if (DA::OrgMail::check_org_mail_permit($session)) {
		($user_email, $user_name, $user_reply) = DA::OrgMail::change_sender($session, $imaps, $user_email, $user_name, $user_reply);
	}
	if ($user_name eq "") {
		$from_p = $user_email;
		$from   = $user_email;
		if ($user_reply ne "") {
			$reply = $user_reply;
		}
	} else {
		my $name = $user_name;
		if (DA::CGIdef::iskanji($name, &mailer_charset())) {
			if ($imaps->{custom}->{base64_no_escape} ne 'on') {
				$name = DA::Mailer::escape_mail_name($name);
			}
			$name = DA::Mailer::fold_mime_txt($name, 0, &mailer_charset(), $charset);
			$encode = 1;
		} else {
			$name = DA::Mailer::escape_mail_name($name);
		}

		$from_p = "$user_name <$user_email>";
		$from   = "\"$name\" <$user_email>";
		if ($user_reply ne "") {
			$reply = "\"$name\" <$user_reply>";
		}
	}
	if (my $card = &get_card($session, $imaps, $session->{user}, $session->{type}, $user_name, $user_email)) {
		push(@{$preview->{from_list}}, $card);
	}
	$entity->{"From"}     = $from;
	$entity->{"Reply-To"} = $reply;
    $entity->{$MAIL_VALUE->{USER_FROM}} = &_make_uid($user_id,1,0);

	# To, Cc, Bcc
	my $ne_match = "(?:\"(.*?[^\\\\])\"|([^\\,]*?))\\s*"
	             . "\\<\\s*($MATCH_RULE->{EMAIL})\\s*\\>";
	my $em_match = "($MATCH_RULE->{EMAIL})";
	my $group    = {};

    # 操作ログ出力用
	my $log	= {
		'to' => "",
		'cc' => "",
		'bcc' => "",
        'attachments' => ""
	};

    # 開封確認用の MID リスト
    my @sndlst;

	foreach my $f (qw(to cc bcc)) {
		my $i = 0;
		my @gids;

		foreach my $a (@{$data->{"$f\_list"}}) {
			my $id        = $a->{id};
			my $type      = $a->{type};
			my $name      = $a->{name};
			my $email     = $a->{email};
			my $lang      = $a->{lang};
			my $title     = $a->{title};
			my $title_pos = $a->{title_pos};
			my $external  = 0;
			my $to;
            $log->{$f} .= "$name <$email>,";

			if ($title ne "") {
				if ($title_pos eq 1) {
					$name = $title . $name;
				} else {
					$name = $name . $title;
				}
			}

			if ($type eq 2) {
				if ($name ne "") {
					if (my $card = &get_card($session, $imaps, $a->{id}, $a->{type}, $a->{name}, $a->{email}, $a->{title}, $a->{title_pos}, $a->{lang})) {
						push(@{$preview->{$f . "_list"}}, $card);
					}
				}
                push(@gids, &_make_gid($id,$lang));
			} else {
				if ($email eq "") {
					&_warn($session, "Unsupport email format [$email]");
					if (DA::SmartPhone::isSmartPhoneUsed()) {
						&error4smartphone($errors, "fieldset1", "UNSUPPORT_EMAIL_FORMAT", 1, T_($MAIL_VALUE->{TITLE}->{uc($f)}));
					} else {
						return(&error("UNSUPPORT_EMAIL_FORMAT", 1, T_($MAIL_VALUE->{TITLE}->{uc($f)})));
					}
				} elsif ($email =~ /\@/) {
					if (DA::Mailer::check_external_address($email, $internal_domain)) {
						$external = 1;
						$external_exists = 1;
					}

					if ($name eq "") {
						$to = $email;
					} else {
						my $ename = $name;

						if (DA::CGIdef::iskanji($ename, &mailer_charset())) {
							if ($imaps->{custom}->{base64_no_escape} ne 'on') {
								$ename = DA::Mailer::escape_mail_name($ename);
							}
							$ename = DA::Mailer::fold_mime_txt($ename, 76, &mailer_charset(), $charset);
							$encode = 1;
						} else {
							$ename = DA::Mailer::escape_mail_name($ename);
						}

						$to = "\"$ename\" <$email>";
					}
					if (my $card = &get_card($session, $imaps, $a->{id}, $a->{type}, $a->{name}, $a->{email}, $a->{title}, $a->{title_pos}, $a->{lang}, $external)) {
						push(@{$preview->{$f . "_list"}}, $card);
					}
					$entity->{ucfirst($f)}  .= "$to,\n";

					if ($id ne "" && $type ne "") {
                        $entity->{$MAIL_VALUE->{'USER_' . uc($f)}} .= &_make_uid($id,$type,$i)."; ";

						if ($type eq 1) {
							$entity->{UserMember} .= "$email\,";
							push(@sndlst, $id);
						}
					}

					unless ($local->{$f}) {
						$local->{$f} = $email;
					}

					push(@{$entity->{SendAddress}}, $email);

					$i ++;
				} else {
					&_warn($session, "Unsupport email format [$email]");
					if (DA::SmartPhone::isSmartPhoneUsed()) {
						&error4smartphone($errors, "fieldset1", "UNSUPPORT_EMAIL_FORMAT", 1, T_($MAIL_VALUE->{TITLE}->{uc($f)}));
					} else {
						return(&error("UNSUPPORT_EMAIL_FORMAT", 1, T_($MAIL_VALUE->{TITLE}->{uc($f)})));
					}
				}
			}
		my $el = $a->{email};
		   $el =~s/\t//g;
		   $el =~s/$em_match//;	
		   $el = DA::Mailer::space_cut($el, &mailer_charset());

		if ($el ne "" && $opt ne 'backup') {
                                &_warn($session, "Can't parse To field");
                                if (DA::SmartPhone::isSmartPhoneUsed()) {
                                        &error4smartphone($errors, "fieldset1", "NOT_PARSE_TO_FIELD", 1, T_($MAIL_VALUE->{TITLE}->{uc($f)}));
                                } else {
                                        return(&error("NOT_PARSE_TO_FIELD", 1, T_($MAIL_VALUE->{TITLE}->{uc($f)})));
                                }
                        }
		}
		$group->{$f} = \@gids;
		my $l = $data->{"$f\_text"};
		$l =~s/\t//g;
		$l =~s/\,$//g;
		
		if ($l) {
			my $to_text;
			while ($l =~ s/(?:$ne_match|$em_match)(?:\s*\,\s*|\s*)//) {
				my $name  = $1 || $2;
				my $email = $3 || $4;												
				my $external = 0;
				my $to;

				if ($email =~ /\@/) {
					if (DA::Mailer::check_external_address($email, $internal_domain)) {
						$external = 1;
						$external_exists = 1;
					}

					if ($name eq "") {
						$to = $email;
					} else {
						my $ename = DA::Mailer::escape_mail_name($name);

						if (DA::CGIdef::iskanji($ename, &mailer_charset())) {
							$ename = DA::Mailer::fold_mime_txt($ename, 76, &mailer_charset(), $charset);
							$encode = 1;
						}

						$to = "\"$ename\" <$email>";
					}
					if (my $card = &get_card($session, $imaps, "", "", $name, $email, "", "", "", $external)) {
						push(@{$preview->{$f . "_list"}}, $card);
					}
					$to_text .= "$to,";

					unless ($local->{$f}) {
						$local->{$f} = $email;
					}

					push(@{$entity->{SendAddress}}, $email);
				} else {
					&_warn($session, "Unsupport email format [$email]");
					if (DA::SmartPhone::isSmartPhoneUsed()) {
						&error4smartphone($errors, "fieldset1", "UNSUPPORT_EMAIL_FORMAT", 1, T_($MAIL_VALUE->{TITLE}->{uc($f)}));
					} else {
						return(&error("UNSUPPORT_EMAIL_FORMAT", 1, T_($MAIL_VALUE->{TITLE}->{uc($f)})));
					}
				}
			}			
			$l = DA::Mailer::space_cut($l, &mailer_charset());			
			if ($l eq "" || $opt eq 'backup') {				
				if ($to_text) {					
					$to_text =~ s/\,+$//g;
					$entity->{ucfirst($f)} .= DA::Mailer::fold_form($to_text, 76);
				}
			}else{
				&_warn($session, "Can't parse To field");
				if (DA::SmartPhone::isSmartPhoneUsed()) {
					&error4smartphone($errors, "fieldset1", "NOT_PARSE_TO_FIELD", 1, T_($MAIL_VALUE->{TITLE}->{uc($f)}));
				} else {
					return(&error("NOT_PARSE_TO_FIELD", 1, T_($MAIL_VALUE->{TITLE}->{uc($f)})));
				}
			}
		}
		$entity->{ucfirst($f)} =~ s/(\,\n)+$//g;
		$entity->{$MAIL_VALUE->{'USER_' . uc($f)}} =~ s/(?:\; )+$//g;
	}
	$entity->{UserMember} =~ s/\,+$//g;

	# グループ
	my @all_gids;

	foreach my $f (qw(to cc bcc)) {
		if (scalar(@{$group->{$f}})) {
			my $gkey  = $MAIL_VALUE->{'GROUP_' . uc($f)};
			my $gnkey = $MAIL_VALUE->{'GROUP_NAME_' . uc($f)};
			my $gids  = join(",", @{$group->{$f}});
			my $ginfo = &get_group_info($session, $imaps, $gids, undef, 1);

			$entity->{$gkey} = $gids;

			if (ref($ginfo->{name}) eq "ARRAY") {
				my @gnames;
				foreach my $gname (@{$ginfo->{name}}) {
					if ($imaps->{mail}->{group} =~ /^(on)$/i && DA::CGIdef::iskanji($gname, &mailer_charset())) {
						$gname = DA::Mailer::fold_mime_txt($gname, 0, &mailer_charset(), $charset);
					} else {
						$gname = DA::Charset::convert(\$gname, &mailer_charset(), "ISO-2022-JP");
					}
					push (@gnames, $gname);
				}
				$entity->{$gnkey} = join (",", @gnames);
				$entity->{$gnkey} = DA::Mailer::fold_form($entity->{$gnkey}, 76);
			}

			push(@all_gids, @{$group->{$f}});
		}
	}

	if (scalar(@all_gids) && $opt !~ /^(?:preview|custom)$/) {
		my $gids = join(",", @all_gids);
        my ($alias, $adrlst, $midlst) = &get_group_alias($session, $gids, $open_status);
        if ($open_status) { push (@sndlst, split(/\,/, $midlst)); }

		$entity->{Group}       = $alias;
		$entity->{GroupMember} = $adrlst;
	}

	# 送信先チェック
	if ($opt eq "sent" && !$entity->{To} && !$entity->{Cc} && !$entity->{Bcc} && !$entity->{Group}) {
		if (DA::SmartPhone::isSmartPhoneUsed()) {
			&error4smartphone($errors, "fieldset1", "NO_INPUT_TO_FIELD", 1);
		} else {
			return(&error("NO_INPUT_TO_FIELD", 1));
		}
	}
	# 送信先最大数
	my ($max_send_flag, $alert_send_flag);
	if ($imaps->{system}->{max_send_address} || $imaps->{system}->{alert_send_address}) {
		my $max_send_address   = $imaps->{system}->{max_send_address};
		my $alert_send_address = $imaps->{system}->{alert_send_address};
		my $cnt   = 0;
		my $admin = ($session->{admin} =~ /^(1|2)$/) ? 1 : 0;
		my %addr;

		if (!$alert_send_address && $admin) {
		} else {
			foreach my $a (@{$entity->{SendAddress}}, split(/\,/, $entity->{Group})) {
				if ($a eq "") {
					next;
				} elsif ($a =~ /^(isg\d+)\@\Q$DA::Vars::p->{admin_domain}\E$/) {
					my $alias_file = "$DA::Vars::p->{alias_dir}/.qmail-$1";

					if (my $lines = &read_lines($session, $alias_file)) {
						foreach my $l (@{$lines}) {
							if ($l =~ /^\&(.+)$/ && !exists $addr{$1}) {
								$addr{$1} = 1;
								$cnt ++;
							}
						}
					} else {
						&_warn($session, "read_lines");
						return(&error("NOT_READ_ALIAS", 9));
					}
				} else {
					if (!exists $addr{$a}) {
						$addr{$a} = 1;
						$cnt ++;
					}
				}
				if ($max_send_address && !$admin) {
					if ($cnt > $max_send_address) {
						if ($opt !~ /^(?:preview|custom)$/) {
							$max_send_flag = 1;
							last;
						}
					}
				}
				if ($alert_send_address) {
					if ($cnt > $alert_send_address) {
						$alert_send_flag = 1;
					}
				}
			}
		}

		if ($max_send_flag) {
			if (DA::SmartPhone::isSmartPhoneUsed()) {
				&error4smartphone($errors, "fieldset1", "OVER_SEND_ADDRESS", 1, $max_send_address);
			} else {
				return(&error("OVER_SEND_ADDRESS", 1, $max_send_address));
			}
		}
		if ($alert_send_flag) {
			$alert_send_flag = $cnt;
		}
	}

	# Subject
	$local->{subject}   = $subject;
	$preview->{subject} = $subject;
	if (DA::CGIdef::iskanji($subject, &mailer_charset())) {
		$subject = DA::Mailer::fold_mime_txt($subject, 76, &mailer_charset(), $charset);
		$encode = 1;
	}
	if (DA::SmartPhone::isSmartPhoneUsed()) {
		if ($subject eq "") {
			$subject_empty = 1;
		} else {
			if (DA::Unicode::trim($data->{subject}, &mailer_charset()) eq "") {
				$subject_empty = 1;
			}
		}
	} else {
		if ($subject eq "" && $opt ne "sent") {
			$subject_empty = 1;
		}
	}
	$entity->{Subject} = $subject;

	# In-Reply-To, References
	$entity->{"In-Reply-To"} = $in_reply_to;
	$entity->{"References"}  = $references;

	# Disposition-Notification-To
	if ($notification) {
		$entity->{"Disposition-Notification-To"} = $entity->{"Reply-To"} || $entity->{"From"};
	}

	# Date
	my $date = &get_maildate($timezone);
	$entity->{Date} = $date;
	$local->{date} = &format_date($date, 0);

	# X-Priority
	$entity->{"X-Priority"} = $priority;
	$entity->{"X-MSMail-Priority"} = &get_msmail_priority([qw($priority)]);

	# グループ名
	my $gname;
	if ($group_name) {
		$gname = &_gname($session, $imaps, $group);
	}

    # 開封確認用のデータ
    my $osd={};
    if ($open_status) {
        my $sql="SELECT type FROM is_member WHERE mid=?";
        my $sth=$session->{dbh}->prepare($sql);
        foreach my $mid (@sndlst) {
            $sth->bind_param(1 , $mid, 3);
            $sth->execute();
            my $type = $sth->fetchrow;
            if ($type ne 1) { next; }
            push (@{$osd->{sndlst}}, $mid);
        }
        $sth->finish;

        $osd->{subject} = DA::Charset::convert(\$data->{subject},
                $charset, DA::Unicode::internal_charset());
        $osd->{subject} = DA::Charset::filter(\$osd->{subject},
                "h2z", DA::Unicode::internal_charset());

        $osd->{date}    = &format_date($date, 0, $DA::Vars::p->{timezone});
    }

	# 本文（ＨＴＭＬ）
	my ($text, $html);
	if ($content_type eq "html") {
		$html = &_text2html($gname, &mailer_charset()) . $data->{body}->{html};
		$html =~s/\r\n/\n/g;
		$html = DA::Mailer::space_cut($html, &mailer_charset());

		if (DA::CGIdef::iskanji($html, &mailer_charset())) {
			$encode = 1;
		}
		if (my $message = &_check_htmlmail_part($html)) {
			if (DA::SmartPhone::isSmartPhoneUsed()) {
				push(@{$errors->{fieldset1}}, {
					message => $message,
					error => 1
				});
			} else {
				return({ "error" => 1, "message" => $message });
			}
		}

		$html = DA::Charset::convert(\$html, &mailer_charset(), $charset);
		$text = &_html2text($data->{body}->{html}, &mailer_charset());
	} else {
		$text = $data->{body}->{text};
	}
	#=====================================================
	#           ----custom----
	#=====================================================
	DA::Custom::modify_outgoing_htmlmail($session, $imaps, $c, $data, $mail, $maid, $xml, $opt, \$html);
	# 本文（テキスト）
	$text = $gname . $text;
	$text =~s/\r\n/\n/g;
	$text = DA::Mailer::space_cut($text, &mailer_charset());

	if (DA::SmartPhone::isSmartPhoneUsed()) {
		if ($sid) {
			my $sign = &_sign($session, $imaps, $sid, $select);
			if (defined $sign) {
				my $s = $sign;
				my $c = "\n\n";
				if ($sign eq "") {
					$c = "";
				}
				$text .= $c . $s;
			} else {
				&_warn($session, "_sign");
				return(&error("NOT_READ_SIGN", 9));
			}
		}
	}

	if (DA::CGIdef::iskanji($text, &mailer_charset())) {
		$encode = 1;
	}

	if ($imaps->{mail}->{cr} eq "on") {
		$text = DA::Mailer::fold_txt($text, $MAIL_ROW_LENGTH, &mailer_charset(), 1, 1);
	}
	$text = DA::Charset::convert(\$text, &mailer_charset(), $charset);

	if ($content_type eq "html") {
		$preview->{body}->{html} = DA::Charset::convert(\$html, $charset, &mailer_charset());
		$preview->{body}->{html} = &_extract_htmlmail_part($session, $module, $allow, $preview->{body}->{html}, &mailer_charset(), "detail", $imaps->{custom});
		$preview->{body}->{html} = &_tag_html4ajax($preview->{body}->{html});
	} else {
		$preview->{body}->{text} = DA::Charset::convert(\$text, $charset, &mailer_charset());
		$preview->{body}->{text} = &encode_mailer($preview->{body}->{text}, 0, 1);
		if (($opt eq "sent" || $opt eq "preview") && $spellcheck_mode && DA::SpellCheck::checker($session, $spellcheck) && !DA::SmartPhone::isSmartPhoneUsed()) {
			if (my $dic = DA::SpellCheck::dic($session, $spellcheck, $imaps->{mail}->{spellcheck})) {
				if ($spellcheck->{max_text_size} && length($text) > $spellcheck->{max_text_size}) {
					$spellcheck_size_ng = 1;
				} else { #ISE_01001811
					if (my $check_text = DA::SpellCheck::check($session, $spellcheck, $dic, $preview->{body}->{text}, 1, &mailer_charset())) {
						$preview->{body}->{text} = $check_text;
						$spellcheck_ng = 1;
					}
				}
			}
		}
		# 折り返し表示
		if ($imaps->{mail}->{b_wrap} eq 'on') {
                        $preview->{body}->{text} = "<pre style=\"white-space: -moz-pre-wrap;white-space: -pre-wrap;white-space:-o-pre-wrap;white-space: pre-wrap;word-wrap: break-word;\">" . $preview->{body}->{text} . "</pre>";
                }
	}

	# X-Status
	{
		my $sign_act    = $imaps->{mail}->{sign_act} || "off";
		my $my_addr     = $select;
		my ($type, $sign, $mdn, $reply, $open);
		if ($opt eq 'sent') {
			$type = "sent";
		} else {
			$type = "draft";
		}
		if ($sid eq 2) {
			$sign = "mobile";
		} elsif ($sid eq 1) {
			$sign = "normal";
		} else {
			$sign = "off";
		}
		if ($notification) {
			$mdn = "on";
		} else {
			$mdn = "off";
		}
		if ($reply_use) {
			$reply = "on";
		} else {
			$reply = "off";
		}
        if ($open_status) {
            $open = "on";
        } else {
            $open = "off";
        }
		$entity->{$MAIL_VALUE->{STATUS}} = "type=$type; sign=$sign; sign_act=$sign_act; "
		                                 . "charset=$charset; mdn=$mdn; "
		                                 . "my_addr=$my_addr; reply_use=$reply; "
		                                 . "open_status=$open; "
		                                 . "content_type=$content_type;";
	}

	# Text, Attachment
	my $mime = {};
	if ($data->{attach_list}) {
		unless ($encode) {
			foreach my $a (@{$data->{attach_list}}) {
				if (DA::CGIdef::iskanji($a->{name}, &mailer_charset())) {
					$encode = 1; last;
				}
			}
		}

		my ($cs, $enc);
		if ($encode) {
			if ($charset eq "UTF-8") {
				$text =~s/\n/\r\n/g;
				$text = MIME::Base64::encode_base64($text);
				$cs   = $charset;
				$enc  = "base64";
			} else {
				$cs  = $charset;
				$enc = $MAIL_TEXT_ENCODING;
			}
		} else {
			$cs  = "us-ascii";
			$enc = $MAIL_TEXT_ENCODING;
		}
		$entity->{"Type"}     = $MAIL_MIME_TYPE;
		$entity->{"Boundary"} = $boundary;
		$entity->{"X-Mailer"} = $MAIL_X_MAILER;
		%{$mime->{head}} = %{$entity};

		$mime->{text} = {
			"Type"     => $MAIL_TEXT_TYPE . "; charset=\"$cs\"",
			"Encoding" => $enc,
			"Data"     => $text
		};

		if ($content_type eq "html") {
			my ($cs, $enc);
			if ($encode) {
				$html = &_make_htmlmail_part($html, $charset);
				$cs   = $charset;
				$enc  = $MAIL_HTML_ENCODING;
			} else {
				$html = &_make_htmlmail_part($html, $charset);
				$cs  = "us-ascii";
				$enc = $MAIL_HTML_ENCODING;
			}

			$mime->{alter} = {
				"Type"     => $MAIL_ALTER_TYPE,
				"Boundary" => $boundary . "_001"
			};
			$mime->{html}  = {
				"Type"     => $MAIL_HTML_TYPE . "; charset=\"$cs\"",
				"Encoding" => $enc,
				"Data"     => $html
			};
		}

		my $i = 0;
		foreach my $l (@{$data->{attach_list}}) {
			my $a    = $mail->{attach};
			my $aid  = $l->{aid};
			my $name = $a->{$aid}->{name};
			my $path = &_fullpath($session, $a->{$aid}->{path});
			my $type = $a->{$aid}->{type};
			my $enc;

			push(@{$preview->{attach_list}}, $l);
			if (DA::CGIdef::iskanji($name, &mailer_charset())) {
				if ($imaps->{mail}->{attach} eq "on") {
					$name = DA::Mailer::fold_mime_txt($name, 76, &mailer_charset(), $charset);
				} else {
					$name = DA::Charset::convert(\$name, &mailer_charset(), "ISO-2022-JP");
				}
			}

			if ($type =~ /^message\//) {
				my $buf = &read_file($session, $path);
				if (defined $buf) {
					$buf =~ s/\r\n/\n/g;
					if (&write_file_buf($session, $path, $buf)) {
					} else {
						&_warn($session, "write_file");
						return(&error("NOT_WRITE_ATTACHMENT", 9));
					}
				} else {
					&_warn($session, "read_file");
					return(&error("NOT_READ_ATTACHMENT", 9));
				}
				$enc = "7bit";
			} else {
				$enc = $MAIL_MIME_ENCODING;
			}

			my $attach = {
				"Path"        => $path,
				"Type"        => $type,
				"Encoding"    => $enc,
				"Filename"    => $name,
				"OriginalName"=> $a->{$aid}->{name},
				"OriginalExt" => $a->{$aid}->{ext},
				"Disposition" => "attachment"
			};
			push(@{$mime->{attach}}, $attach);
		}
	} else {
		my ($cs, $enc);
		if ($encode) {
			if ($charset eq "UTF-8") {
				$text =~s/\n/\r\n/g;
				$text = MIME::Base64::encode_base64($text);
				$cs   = $charset;
				$enc  = "base64";
			} else {
				$cs  = $charset;
				$enc = $MAIL_TEXT_ENCODING;
			}
		} else {
			$cs  = "us-ascii";
			$enc = $MAIL_TEXT_ENCODING;
		}
		if ($content_type eq "html") {
			$entity->{"Type"} = $MAIL_ALTER_TYPE;
			$entity->{"X-Mailer"} = $MAIL_X_MAILER;
			$entity->{"Boundary"} = $boundary;
			$mime->{text} = {
				"Type"     => $MAIL_TEXT_TYPE . "; charset=\"$cs\"",
				"Encoding" => $enc,
				"Data"     => $text
			};
			{
				my ($cs, $enc);
				if ($encode) {
					$html = &_make_htmlmail_part($html, $charset);
					$cs   = $charset;
					$enc  = $MAIL_HTML_ENCODING;
				} else {
					$html = &_make_htmlmail_part($html, $charset);
					$cs  = "us-ascii";
					$enc = $MAIL_HTML_ENCODING;
				}
				$mime->{html} = {
					"Type"     => $MAIL_HTML_TYPE . "; charset=\"$cs\"",
					"Encoding" => $enc,
					"Data"     => $html
				};
			}
		} else {
			$entity->{"Type"} = $MAIL_TEXT_TYPE . "; charset=\"$cs\"";
			$entity->{"X-Mailer"} = $MAIL_X_MAILER;
			$entity->{"Encoding"} = $enc;
			$mime->{text}->{"Data"} = $text;
		}
		%{$mime->{head}} = %{$entity};
	}
	#=====================================================
	#           ----custom----
	#=====================================================
	DA::Custom::modify_mime($session, $imaps, $c, $data, $mime, $maid, $xml, $opt);
	$result->{proc}     = $mail->{proc};
	$result->{fid}      = $mail->{fid};
	$result->{uid}      = $mail->{uid};
	$result->{mime}     = $mime;
	$result->{local}    = $local;
	$result->{preview}  = $preview;
	$result->{external} = $external_exists;
	$result->{osd}      = $osd;

	my @warn;
	my $warns = {};
	if ($alert_send_flag) {
		if (DA::SmartPhone::isSmartPhoneUsed()) {
			push(@{$warns->{fieldset1}}, {
				message => &message("WARN_SEND_ADDRESS", "", $alert_send_flag)
			});
		} else {
			push(@warn, &message("WARN_SEND_ADDRESS", "", $alert_send_flag));
		}
	}
	if ($external_exists) {
		if (DA::SmartPhone::isSmartPhoneUsed()) {
			push(@{$warns->{fieldset1}}, {
				message => &message("INCLUDE_EXTERNAL_ADDRESS")
			});
		} else {
			push(@warn, &message("INCLUDE_EXTERNAL_ADDRESS"));
		}
	}
	if ($subject_empty) {
		if (DA::SmartPhone::isSmartPhoneUsed()) {
			push(@{$warns->{fieldset3}}, {
				message => &message("NO_INPUT_SUBJECT_FIELD")
			});
		} else {
			push(@warn, &message("NO_INPUT_SUBJECT_FIELD"));
		}
	}
	if ($spellcheck_ng) {
		if (DA::SmartPhone::isSmartPhoneUsed()) {
			push(@{$warns->{fieldset3}}, {
				message => &message("SPELLCHECK_NG")
			});
		} else {
			push(@warn, &message("SPELLCHECK_NG"));
		}
	}
	if ($spellcheck_size_ng) {
		if (DA::SmartPhone::isSmartPhoneUsed()) {
			push(@{$warns->{fieldset3}}, {
				message => &message("SPELLCHECK_SIZE_NG")
			});
		} else {
			push(@warn, &message("SPELLCHECK_SIZE_NG"));
		}
	}
	$result->{warn} = \@warn;

	$result->{warns} = $warns;
	$result->{errors} = $errors;

	my $current_mail_gid = DA::OrgMail::get_gid($session);
	my $mapping_info_file = "$current_mail_gid".'.maid_mapping.dat';
	$mapping_info_file =  DA::Ajax::Mailer::backup_mapping_file($session,$mapping_info_file);
	my $back_mapping_info =  DA::Ajax::Mailer::get_infofile($session,$mapping_info_file,'backup_mapping');
	my %back_mapping_info_inverse = reverse %{$back_mapping_info};	
	if($c->{proc} eq 'backup') {
		unless($c->{backup_maid} =~/^\d{1,}$/) {
			unless ($c->{backup_maid} =  DA::Ajax::Mailer::inc_num($session, "backup_maid")) {
				&_warn($session, "inc_num");
				$errors = &error("NOT_INC_FID", 9); 	
			}
		}elsif(!$back_mapping_info_inverse{$c->{backup_maid}}){
			#マッピングファイルの中にbackup_maid存在しない場合に、新しいbackup_maidを作成します
			unless ($c->{backup_maid} =  DA::Ajax::Mailer::inc_num($session, "backup_maid")) {
				&_warn($session, "inc_num");
				$errors = &error("NOT_INC_FID", 9); 	
			}
		}
	}

	# 組織メール
	if (DA::OrgMail::check_org_mail_permit($session)) {
		DA::OrgMail::backup_org_operation($session, $imaps, $c, $maid, $data, $result, $errors);
		DA::OrgMail::rewrite_make_mail_result4ajx($session, $imaps, $opt, $mail, $data, $result, $c);
	}
	#
	# Custom
	#
	DA::Custom::rewrite_make_mail_result4ajx($session, $imaps, $opt, $mail, $data, $result, $c);
	&_logger($session, $imaps, $logger);

    my $oplog;
    $log->{'to'} =~ s/\,$//;
    $log->{'cc'} =~ s/\,$//;
    $log->{'bcc'} =~ s/\,$//;
    # to,cc,bccの入力テキスト内容を追加
    foreach my $f (qw(to cc bcc)) {
      if ($data->{"$f\_text"} ne "") {
        if ($log->{$f} ne "") {
          $log->{$f} .= "\, $data->{\"$f\_text\"}";
        } else {
          $log->{$f} = $data->{"$f\_text"};
        }
      }
    }

    # 添付ファイル
    foreach my $a (@{$mime->{attach}}) {
      $log->{'attachments'} .= "$a->{'OriginalName'} ,";
    }
    $log->{'attachments'} =~ s/\,$//;
 
	if ($opt eq 'sent'){
		# 操作ログ（メール送信）
		$oplog = {
			"app"    => "mail",
			"docid"  => "ajax/mail/$session->{user}/$maid",
			"type"   => "MO",
			"detail" => {
				"To"         => &convert_internal($log->{'to'}),
				"Cc"         => &convert_internal($log->{'cc'}),
				"Bcc"        => &convert_internal($log->{'bcc'}),
				"From"       => &convert_internal($from_p),
				"Date"       => &convert_internal($entity->{'Date'}),
				"Subject"    => &convert_internal($local->{subject}),
				"Attachments"=> &convert_internal($log->{'attachments'}),
				"Message-Id" => &convert_internal($entity->{'Message-Id'})
			}
		};
		if(DA::OrgMail::use_org_mail($session)){
			my $gid = DA::OrgMail::get_gid($session);
			$oplog->{type} = "MOO";
			$oplog->{detail}->{gid} = $gid;
		}	
		unless (scalar(keys %{$errors}) && !$c->{nopreview}) {
			DA::OperationLog::log($session, $oplog);
		}
	} elsif ($opt eq 'draft' || $opt eq 'backup') {
		# 操作ログ（メール保存）
		$oplog = {
			"app"    => "mail",
			"docid"  => "ajax/mail/$session->{user}/$maid",
			"type"   => "MS",
			"detail" => {
				"To"         => &convert_internal($log->{'to'}),
				"Cc"         => &convert_internal($log->{'cc'}),
				"Bcc"        => &convert_internal($log->{'bcc'}),
				"From"       => &convert_internal($from_p),
				"Date"       => &convert_internal($entity->{'Date'}),
				"Subject"    => &convert_internal($local->{subject}),
				"Attachments"=> &convert_internal($log->{'attachments'}),
				"Message-Id" => &convert_internal($entity->{'Message-Id'})
			}
		};
		if(DA::OrgMail::use_org_mail($session)){
			my $gid = DA::OrgMail::get_gid($session);
			$oplog->{type} = "MSO";
			$oplog->{detail}->{gid} = $gid;
		}
		unless (scalar(keys %{$errors}) && !$c->{nopreview}) {
			DA::OperationLog::log($session, $oplog);
		}
	}
	return($result);
}

sub store_mail($$$$$$$) {
	my ($session, $imaps, $maid, $mime, $local, $type, $uid, $c) = @_;	
	my $logger  = &_logger_init($session, 1);
	my $fid = $c->{fid};
	my ($info, $target, $error);
	if ($type eq "backup") {
		$info   = &_backup_folder($session, $imaps);
		$target = "backup";
	} elsif ($type eq "send") {
		$info   = &_sent($session, $imaps);
		$target = "sent";
	} else {
		$info = &_draft($session, $imaps);
		$target = "wait";
	}
	my $dirpath = &infobase($session, $target);
	my $inffile = "$dirpath/info.dat";
	my $tmpfile = "$session->{temp_dir}/$session->{user}\.$session->{sid}.AjaxMailer.store.$maid\.jis";

	my $current_mail_gid = DA::OrgMail::get_gid($session);
	my $mapping_info_file = "$current_mail_gid".'.maid_mapping.dat';
	my $backup_maid =$c->{backup_maid} ;
	$mapping_info_file = &backup_mapping_file($session,$mapping_info_file);
	my $back_mapping_info = &get_infofile($session,$mapping_info_file,'backup_mapping');
	my %back_mapping_info_inverse = reverse %{$back_mapping_info};	

	DA::Mailer::build_mail($mime, undef, "as", $tmpfile, 1);
	if ($type eq "draft") {
		my @stat = stat $tmpfile;
		my $mail_size = $stat[7];
		my $max_size = $imaps->{system}->{max_send_size};
		if ($max_size && $mail_size > $max_size) {
			$error = &error("OVER_MAX_SIZE", 9);
		}
		unless ($error) {
			my $imap = $imaps->{session};
			my $result = $imap->append_file($info->{folder}, $tmpfile);
			if (!$result) {
				if (DA::Mail::check_quota_over($imap)){
					$error = &error("NOT_SAVE_DRAFT_QUOTAOVER", 2);
				} else {
					$error = &error("NOT_SAVE_DRAFT", 2);
				}
			}
		}

		unless ($error) {
			&_delete_backup_after_send_or_save($session, $imaps, \%back_mapping_info_inverse, $backup_maid, $maid, $fid);
		}
	} elsif ($type eq "send" || $type eq "backup") {
		if ($type eq "backup"  || !$imaps->{session} || !&_append($session, $imaps, $info->{folder}, $tmpfile)) {
			my $inc;
			if ($type eq "send") {			
				# 1.3.0 Data -> 1.4.0 Data Convert
				if (!$imaps->{status}->{local} && DA::Unicode::file_exist($inffile)) {
					my $src = $inffile;
					my $dst = $inffile . ".tmp";
					if (my $fi = &open_file_utf($session, $src, "r")) {
						if (my $fo = &open_file_utf($session, $dst, "w")) {
							while (my $l = <$fi>) {
								chomp($l);
								my @l = split(/\t/, &convert_mailer($l));
								$l[4] = DA::Ajax::decode($l[4], 0, 1);
								print $fo &convert_internal(join("\t", @l)) . "\n";
							}
							&close_file_utf($session, $src, $fi);
							if (&close_file_utf($session, $dst, $fo)) {
								if (DA::Unicode::file_move($dst, $src)) {
									$imaps->{status}->{local} = $DA::IsVersion::Version;
									unless (&save_status($session, $imaps->{status})) {
										&_warn($session, "save_status");
										$error = &error("NOT_WRITE_STATUS_CONFIG", 9);
									}
								} else {
									&_warn($session, "Can't move file [$dst]");
									$error = &error("NOT_WRITE_HEADER_LOCAL", 9);
								}
							} else {
								&_warn($session, "close_file_utf");
								$error = &error("NOT_WRITE_HEADER_LOCAL", 9);
							}
						} else {
							&_warn($session, "open_file_utf");
							$error = &error("NOT_WRITE_HEADER_LOCAL", 9);
						}
					} else {
						&_warn($session, "open_file_utf");
						$error = &error("NOT_WRITE_HEADER_LOCAL", 9);
					}

				}
				$inc = "sent";
				#一時保存する時にバックアップファイルを削除する
				&_delete_backup_after_send_or_save($session, $imaps, \%back_mapping_info_inverse, $backup_maid, $maid, $fid);
			} else {
				unless (-d $dirpath) {
					DA::System::mkdir($dirpath, 0750, $DA::Vars::p->{www_user}, $DA::Vars::p->{www_group});
				}
				unless (-d "$dirpath/org_info") {
					DA::System::mkdir("$dirpath/org_info", 0750, $DA::Vars::p->{www_user}, $DA::Vars::p->{www_group});
				}

				$inc = "backup";
			}

			if ($error) {
				&_warn($session, "_append");
				$error = &error("NOT_APPEND_MAIL", 2);
			} else {
				if($type eq "backup") {
					#mail page outdate can't backup(from portal,sosiki mail )
					if($back_mapping_info_inverse{$backup_maid} && $back_mapping_info_inverse{$backup_maid} ne $maid) {
						$error = &error("WARN_NOT_BACKUP_FOR_OUTDATE", 1003);
						return $error;
					}
					#new or replace record
					my $param_hash = {
						"maid" => $maid,
						"backup_maid" => $backup_maid,
						"current_mail_gid" => $current_mail_gid,
						"target"  => $target,
						"inffile" => $inffile,
						"error" => $error
					};
					&_replace_new_backup_info($session, $imaps, $back_mapping_info, $mime, $tmpfile, $local, $param_hash);
				} else {

					if (my $num = inc_info($session, $inc)) {				
						my $jisfile = &infobase($session, $target) . "/$num\.jis";
						my $eucfile = &infobase($session, $target) . "/$num\.mes";
						my $attfile = &infobase($session, $target) . "/$num\.attach";
						my $attach;
						
						unless ($error) {
							# Attachment
							if (scalar@{$mime->{attach}}) {
								my $ix = 3;
								my @lines;

								foreach my $a (@{$mime->{attach}}) {
									my $type = $a->{Type};
									my $name = $a->{OriginalName};
									my $ext  = $a->{OriginalExt};
									   $ext  =~s/(\W)/sprintf("%%%02X", ord($1))/eg;
									my ($path, $src, $dst);
									if ($type eq "send") {
										$path = "s$num\-$ix\.$ext";
										$src  = $a->{Path};
										$dst  = "$DA::Vars::p->{mailer_dir}/$session->{user}/"
								    	      . "attach/$path";
									}
									my $line = "$type\t$path\t$name";
									if (DA::System::file_copy($src, $dst)) {
										push(@lines, $line); $ix ++;
									} else {
										&_warn($session, "Can't copy file [$src]");
										$error = &error("NOT_WRITE_ATTACHMENT", 9);
									}
								}

								unless ($error) {
									if (&write_lines_utf($session, $attfile, \@lines)) {
										$attach = 1;
									} else {
										&_warn($session, "write_lines");
										$error = &error("NOT_WRITE_ATTACHMEN", 9);
									}
								}
							}
						}

						#リッチテキスト添付ファイルとして扱うの場合 
						unless ($error) {
							 if ($mime->{html} && &_richtext2attachment($session, $imaps)) {
							 	$attach = 1;
							 }
						}
						
						unless ($error) {
							if (my $fh = &open_file_utf($session, $inffile, "a")) {
								my $to      = $local->{to};
								my $date    = $local->{date};
								my $subject = $local->{subject};
								#backup subject 中の\tの取り替え
								$subject =~ s/\t/$SPACER/g;
								$subject = &encode_space_backup_subject($session,$subject);
								my $session_mid = $session->{user};
								print $fh &convert_internal("$num\t$attach\t$to\t$date\t$subject\n");
							
								if (&close_file_utf($session, $inffile, $fh)) {
									if (my $folders = &storable_retrieve($session, "folders")) {
										my $fid = ($type eq "send") ? &_local_fid($session, $imaps, $folders) : &_backup_fid($session, $imaps, $folders);
										unless (&_clear_uidlst_common($session, $fid)) {
											&_warn($session, "_clear_uidlst_common");
										}
									} else {
										&_warn($session, "storable_retrieve");
									}
								} else {
									&_warn($session, "close_file_utf");
									$error = &error("NOT_WRITE_HEADER_LOCAL", 9);
								}
							} else {
								&_warn($session, "open_file_utf");
								$error = &error("NOT_WRITE_HEADER_LOCAL", 9);
							}
						}

						# RFC822
						unless ($error) {
							if (DA::System::file_move($tmpfile, $jisfile)) {
								DA::Mailer::build_mail($mime, undef, 'ase', $eucfile);
								if ($type eq "send") {
									&_warn($session, "_append");
									$error = &error("NOT_APPEND_MAIL2LOCAL", 2);
								}
							} else {
								&_warn($session, "Can't copy file [$tmpfile]");
								$error = &error("NOT_WRITE_MAIL_LOCAL", 9);
							}
						}
					} else {
						&_warn($session, "inc_info");
						$error = &error("NOT_INC_INFO", 9);
					}
			}
			}
		} else {	
			&_delete_backup_after_send_or_save($session, $imaps, \%back_mapping_info_inverse, $backup_maid, $maid, $fid);
		}
	}

	&_logger($session, $imaps, $logger);
	if($type eq "backup") {
		return ($error,$backup_maid);
	}

	return($error);
}

sub _delete_backup_after_send_or_save {
	my($session, $imaps, $back_mapping_info_inverse, $backup_maid, $maid, $fid) = @_;
	if($backup_maid !~ /^\d{1,}$/) {
		return ;
	}
	if(!$back_mapping_info_inverse->{$backup_maid} || $maid >= $back_mapping_info_inverse->{$backup_maid}) {
		&_delete_backup_info($session, $imaps, $backup_maid);
		#delete detail cache
		if($fid =~ /^\d{1,}$/) {
			if(&lock($session, "detail\.$fid\.$backup_maid")) {
				if (&storable_exist($session, "$fid\.$backup_maid\.detail")) {
					&storable_clear($session, "$fid\.$backup_maid\.detail");
				}
				&unlock($session, "detail\.$fid\.$backup_maid");
			} else {
				&_warn($session, "lock");
			}
		}
	}
}

sub _replace_new_backup_info($$$) {
	my( $session, $imaps, $back_mapping_info, $mime, $tmpfile, $local, $param_hash ) = @_;
	
	my $maid = $param_hash->{maid};
	my $backup_maid = $param_hash->{backup_maid};
	my $current_mail_gid = $param_hash->{current_mail_gid};
	my $error = $param_hash->{error};
	my $target = $param_hash->{target};
	my $inffile = $param_hash->{inffile};
	my $priority = $mime->{head}->{'X-Priority'};
	my $backup_dir = &infobase($session, $target) .'/'."$backup_maid";
	my $mapping_info_file = $current_mail_gid.'.maid_mapping.dat';
	$mapping_info_file = &infobase($session, $target).'/'.$mapping_info_file;

	if($back_mapping_info->{$maid} || $backup_maid =~ /^\d{1,}$/) {
		#delete old record 
		&_delete_backup_info($session, $imaps, $backup_maid, 'backup');
	}
	$back_mapping_info->{$maid} = $backup_maid;
	#new record 
	unless (-d $backup_dir) {
		DA::System::mkdir($backup_dir, 0750, $DA::Vars::p->{www_user}, $DA::Vars::p->{www_group});
	}

	my $jisfile = $backup_dir . "/$backup_maid\.jis";
	my $eucfile = $backup_dir . "/$backup_maid\.mes";
	my $attfile = $backup_dir . "/$backup_maid\.attach";
	my $attach;

	unless ($error) {
		# Attachment
		if (scalar@{$mime->{attach}}) {
			my $ix = 3;
			my @lines;

			foreach my $a (@{$mime->{attach}}) {
				my $type = $a->{Type};
				my $name = $a->{OriginalName};
				my $ext  = $a->{OriginalExt};
				   $ext  =~s/(\W)/sprintf("%%%02X", ord($1))/eg;
				my ($path, $src, $dst);
				$path = "b$backup_maid\-$ix\.$ext";
				$src  = $a->{Path};
				$dst  = $backup_dir . "/$path";
				my $line = "$type\t$path\t$name";
				if (DA::System::file_copy($src, $dst)) {
					push(@lines, $line); $ix ++;
				} else {
					&_warn($session, "Can't copy file [$src]");
					$error = &error("NOT_WRITE_ATTACHMENT", 9);
				}
			}

			unless ($error) {
				if (&write_lines_utf($session, $attfile, \@lines)) {
					$attach = 1;
				} else {
					&_warn($session, "write_lines");
					$error = &error("NOT_WRITE_ATTACHMEN", 9);
				}
			}
		}
	}
	#リッチテキスト添付ファイルとして扱うの場合 
	unless ($error) {
		 if ($mime->{html} && &_richtext2attachment($session, $imaps)) {
		 	unless($attach eq 1) {
		 		$attach = 2;
		 	}
		 }
	}
	unless ($error) {
		if (my $fh = &open_file_utf($session, $inffile, "a")) {
			my $to      = $local->{to};
			my $date    = $local->{date};
			my $subject = $local->{subject};
			#backup subject 中の\tの取り替え
			$subject =~ s/\t/$SPACER/g;
			$subject = &encode_space_backup_subject($session,$subject);
			print $fh &convert_internal("$maid\t$attach\t$to\t$date\t$subject\t$backup_maid\t$priority\n");
		
			if (&close_file_utf($session, $inffile, $fh)) {
				if (my $folders = &storable_retrieve($session, "folders")) {
					my $fid =  &_backup_fid($session, $imaps, $folders);
					unless (&_clear_uidlst_common($session, $fid)) {
						&_warn($session, "_clear_uidlst_common");
					}
				} else {
					&_warn($session, "storable_retrieve");
				}
			} else {
				&_warn($session, "close_file_utf");
				$error = &error("NOT_WRITE_HEADER_LOCAL", 9);
			}
		} else {
			&_warn($session, "open_file_utf");
			$error = &error("NOT_WRITE_HEADER_LOCAL", 9);
		}
	}

	#backup mapping file 
	unless ($error) {
		if (my $fh = &open_file_utf($session, $mapping_info_file, "a")) {
			print $fh "$maid=$backup_maid\n";
			unless (&close_file_utf($session, $mapping_info_file, $fh)) {
				&_warn($session, "close_file_utf");
				$error = &error("NOT_WRITE_HEADER_LOCAL", 9);
			} 
		} else {
			&_warn($session, "open_file_utf");
			$error = &error("NOT_WRITE_HEADER_LOCAL", 9);
		}
	}

	# RFC822
	unless ($error) {
		if (DA::System::file_move($tmpfile, $jisfile)) {
		} else {
			&_warn($session, "Can't copy file [$tmpfile]");
			$error = &error("NOT_WRITE_MAIL_LOCAL", 9);
		}
	}


} 

sub _delete_backup_info($$$;$) {
	my ($session, $imaps, $num, $proc) = @_;		
	my $file = &infofile($session, "backup");
	my $jisfile = &infobase($session, "backup") . "/$num/$num\.jis";
	my @uidlst = (int($num));
	my $error;
	if (($imaps->{custom}->{auto_backup_on} eq "on" || ($imaps->{custom}->{auto_backup_on} eq "user" && &backup_ok($session, $imaps))) && $num && -f $file && -f $jisfile) {
		unless (&_delete_header_local($session, $imaps, { "uidlst" => \@uidlst, "target" => "backup", "proc" => $proc})) {
			&_warn($session, "_delete_header_local");
			$error = &error("NOT_DELETE_HEADER_LOCAL", 9);
		}
	}

	return($error);
}

sub download_detail($$$$) {
	my ($session, $fid, $uid, $aid) = @_;
	my $result = {};

	if (my $detail = &storable_retrieve($session, "$fid\.$uid\.detail")) {
		my $name  = $detail->{attach}->{$aid}->{name};
		my $path  = &_fullpath($session, $detail->{attach}->{$aid}->{path});
		my $rpath = &_urlpath($session, $detail->{attach}->{$aid}->{path});
		my $size  = (stat($path))[7];
		my $head  = &get_download_head($name);

		$result = {
			"name"  => $name,
			"path"  => $path,
			"rpath" => $rpath,
			"size"  => $size,
			"head"  => "Content-length: $size\n$head"
		};
	} else {
		&_warn($session, "storable_retrieve");
		$result = &error("NOT_READ_DETAIL", 9);
	}

	return($result);
}

sub download_mail($$$) {
	my ($session, $maid, $aid) = @_;
	my $result = {};

	if (my $mail = &storable_retrieve($session, "mail\.$maid")) {
		my $name  = $mail->{attach}->{$aid}->{name};
		my $path  = &_fullpath($session, $mail->{attach}->{$aid}->{path});
		my $rpath = &_urlpath($session, $mail->{attach}->{$aid}->{path});
		my $size  = (stat($path))[7];
		my $head  = &get_download_head($name);

		$result = {
			"name"  => $name,
			"path"  => $path,
			"rpath" => $rpath,
			"size"  => $size,
			"head"  => "Content-length: $size\n$head"
		};
	} else {
		&_warn($session, "storable_retrieve");
		$result = &error("NOT_READ_MAIL", 9);
	}

	return($result);
}

sub document_detail($$$$) {
	my ($session, $fid, $uid, $aid) = @_;
	my $result = {};

	if (my $detail = &storable_retrieve($session, "$fid\.$uid\.detail")) {
		my $name = $detail->{attach}->{$aid}->{name};
		my $path = &_fullpath($session, $detail->{attach}->{$aid}->{path});
		my $type = $detail->{attach}->{$aid}->{type};

		$result = {
			"name" => $name,
			"path" => $path,
			"type" => ($type =~ /applefile/i) ? "applefile"
			       :  ($type =~ /html/i) ? "html"
			       :  undef
		};
	} else {
		&_warn($session, "storable_retrieve");
		$result = &error("NOT_READ_DETAIL", 9);
	}

	return($result);
}

sub document_mail($$$) {
	my ($session, $maid, $aid) = @_;
	my $result = {};

	if (my $mail = &storable_retrieve($session, "mail\.$maid")) {
		my $name = $mail->{attach}->{$aid}->{name};
		my $path = &_fullpath($session, $mail->{attach}->{$aid}->{path});
		my $type = $mail->{attach}->{$aid}->{type};

		$result = {
			"name" => $name,
			"path" => $path,
			"type" => ($type =~ /applefile/i) ? "applefile"
			       :  ($type =~ /html/i) ? "html"
			       :  undef
		};
	} else {
		&_warn($session, "storable_retrieve");
		$result = &error("NOT_READ_MAIL", 9);
	}
	
	return($result);
}

sub template($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $tid    = $c->{tid};
	my $from   = $c->{from};
	my $content_type   = $c->{content_type};
	my $result = {};
	my $error;

	if (&lock($session, "trans.mail")) {
		if (my $template = &template_detail($session, $imaps, $tid)) {
			# 署名
			my $sid;
			if ($from eq "pmail1" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st1.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st1.txt"))) {
				$sid = &get_user_sign_init_p1($session, $imaps);
			} elsif ($from eq "pmail2" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st2.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st2.txt"))) {
				$sid = &get_user_sign_init_p2($session, $imaps);
			} elsif ($from eq "keitai_mail" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_mb.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_mb.txt"))) {
				$sid = &get_user_sign_init_pM($session, $imaps);
			} else {
				$sid = &get_user_sign_init_p($session, $imaps);
			}
			$template->{sid} = $sid;
			$template->{from} = $from;
			my $sign = &_sign($session, $imaps, $sid, $from);
			$template->{content_type} = $content_type;
			if (defined $sign) {
				foreach my $f (qw(text html)) {
					if ($sid) {
						my $s = ($f eq "html") ?
									&_text2html($sign, &mailer_charset()) : $sign;
						my $c = ($f eq "html") ?
									&_text2html(" \n \n", &mailer_charset()) : " \n \n";
						if ($sign eq "") {
							$c = "";
						} else {
							if ($f eq "text") {
								if($session->{ua_browser}eq"InternetExplorer") {
					            	if ($s !~ /\n$/) {
										$s .= "\n";
									}
					            }
							}	
						}
						if ($from eq "pmail1" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st1.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st1.txt"))) {
							if ($imaps->{mail}->{sign_act1} eq "on") {
								$template->{body}->{$f} = $s . $c . $template->{body}->{$f};
							} else {
								$template->{body}->{$f} = $template->{body}->{$f} . $c . $s;
							}
						} elsif ($from eq "pmail2" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st2.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st2.txt"))) {
							if ($imaps->{mail}->{sign_act2} eq "on") {
								$template->{body}->{$f} = $s . $c . $template->{body}->{$f};
							} else {
								$template->{body}->{$f} = $template->{body}->{$f} . $c . $s;
							}
						} elsif ($from eq "keitai_mail" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_mb.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_mb.txt"))) {
							if ($imaps->{mail}->{sign_actM} eq "on") {
								$template->{body}->{$f} = $s . $c . $template->{body}->{$f};
							} else {
								$template->{body}->{$f} = $template->{body}->{$f} . $c . $s;
							}
						} else {
							if ($imaps->{mail}->{sign_act} eq "on") {
								$template->{body}->{$f} = $s . $c . $template->{body}->{$f};
							} else {
								$template->{body}->{$f} = $template->{body}->{$f} . $c . $s;
							}
						}
					}
				}

				$result->{template} = $template;
			} else {
				&_warn($session, "_sign");
				$error = &error("NOT_READ_SIGN", 9);
			}
		} else {
			&_warn($session, "template_detail");
			$error = &error("NOT_GET_TEMPLATE_DETAIL", 9);
		}

		&unlock($session, "trans.mail");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub sign($$$) {
        my ($session, $imaps, $c) = @_;
        my $logger       = &_logger_init($session, 1);
        my $sid          = $c->{sid};
        my $before_sid   = $c->{before_sid};
        my $content_type = $c->{content_type};
        my $body         = $c->{body};
        my $from         = $c->{from};
        my $before_from  = $c->{before_from};
        my $spacer       = "\n\n";
        my $reg			 = '<!-- end default style -->';
        my $result       = {};
        my $error;
		
		my $from_pos = &_sign_pos($session, $from);
		my $befrom_pos = &_sign_pos($session, $before_from);
        my $rich_conf = DA::IS::get_sys_custom($session,"richtext");
        if (&lock($session, "trans.mail")) {
                if (my $sign = &sign_detail($session, $imaps, $sid, $from)) {
                		if ($content_type eq "text") {
                			$spacer = " \n \n";
				            if($session->{ua_browser}eq"InternetExplorer") {
								if ($sign->{sign} ne "" && $sign->{sign} !~ /\n$/) {
			                		$sign->{sign} .= "\n";
			                	}
				            }
						}
                        $result->{content_type} = $content_type;
                        if ($content_type eq "html") {
                                $sign->{sign} = &_text2html($sign->{sign}, &mailer_charset());
                                $spacer = &_text2html($spacer, &mailer_charset());
                        }
                        if ($before_sid eq "0") {
                        	if ($sign->{sign} eq "") {
                        		$sign->{body}->{$content_type} = $body;
                        	} else {
                        		if ($sign->{$from_pos} eq "1"){
                        			if($rich_conf->{editor} eq "crossbrowser" || $content_type eq "text"){
                        				$sign->{body}->{$content_type} = $sign->{sign} . $spacer . $body;
                        			}else{
                        				$body =~ s/$reg/$reg$sign->{sign}/i;
                        				$sign->{body}->{$content_type} = $body;
                        			}
                        		} else {
                        			if($rich_conf->{editor} eq "crossbrowser" || $content_type eq "text"){
                        				$sign->{body}->{$content_type} = $body .$spacer . $sign->{sign};
                        			}else{
                        				$body =~ s/(\<\/div\>)$/$sign->{sign}$1/i;
                        				$sign->{body}->{$content_type} = $body;
                        			}	
                        		}
                        	}
                        	$result->{sign} = $sign;
                        } else {
                                if (my $before_sign = &sign_detail($session, $imaps, $before_sid, $before_from)) {
                                        if($rich_conf->{editor} eq "crossbrowser" || $content_type eq "text"){
                                        	if ($body ne "" && $body !~ /\n$/) {
						                		$body .= "\n";
						                	}
                                        } else {
                                        	if ( $body !~ /\n\<\/div\>$/i) {
                                        		$body =~ s/(\<\/div\>)$/\n$1/i;
                                        	}
                                        }
                                        $body =~ s/\r\n/\n/g;
                                        if ($content_type eq "html") {
                                                $before_sign->{sign} = &_text2html($before_sign->{sign}, &mailer_charset());
                                        }
										if($session->{ua_browser}eq"InternetExplorer") {
				                			if ($content_type eq "text") {
				                				if ($before_sign->{sign} ne "" && $before_sign->{sign} !~ /\n$/) {
							                		$before_sign->{sign} .= "\n";
							                	}
				                			}
				                		}
				                		if ($sign->{$from_pos}) {
				                			if ($content_type eq "html") {
												if ($rich_conf->{editor} eq "crossbrowser" && $session->{ua_browser}eq"InternetExplorer") {
                                        			$spacer = "\n" .$spacer;
                                        		}
			                        		}
			                        		if ($before_sign->{sign} ne "") {
			                                	if($rich_conf->{editor} eq "crossbrowser" || $content_type eq "text"){
			                                		if ($sign->{$from_pos} eq $before_sign->{$befrom_pos}) {
			                                			$body =~ s/^([\s\r\n\t]*)\Q$before_sign->{sign}\E(?:$spacer)?/$1/i;
				                                	} else {
				                                		$body =~ s/(?:$spacer)?\Q$before_sign->{sign}\E([\s\r\n\t]*)$//i;
				                                	}
                                                }
			                                }
			                                if ($sign->{sign} eq "") {
			                                	if($rich_conf->{editor} eq "crossbrowser" || $content_type eq "text"){
			                                		$sign->{body}->{$content_type} = $body;
			                                	}else{
			                                		if($before_sign->{sign} ne ""){
			                                			$body =~ s/\Q$before_sign->{sign}\E//i;
			                                		}
			                                		$sign->{body}->{$content_type} = $body;
			                                	}
			                                } else {
			                                	if($rich_conf->{editor} eq "crossbrowser" || $content_type eq "text"){
			                                		$sign->{body}->{$content_type} = $sign->{sign} . $spacer . $body;
			                                	}else{
			                                		if($before_sign->{sign} ne ""){
			                                			if ($sign->{$from_pos} eq $before_sign->{$befrom_pos}) {
			                                				$body =~ s/\Q$before_sign->{sign}\E/$sign->{sign}/i;
			                                			} else {
			                                				$body =~ s/\Q$before_sign->{sign}\E//i;
							                                $body =~ s/$reg/$reg$sign->{sign}/i;
			                                			}
			                                		}else{
			                                			$body =~ s/$reg/$reg$sign->{sign}/i;
			                                		}
			                                		$sign->{body}->{$content_type} = $body;
			                                	}
			                                }
				                		} else {
				                			if ($before_sign->{sign} ne "") {
				                				if($rich_conf->{editor} eq "crossbrowser" || $content_type eq "text"){
				                					if ($sign->{$from_pos} eq $before_sign->{$befrom_pos}) {
				                						$body =~ s/(?:$spacer)?\Q$before_sign->{sign}\E([\s\r\n\t]*)$/$1/i;
				                					} else {
				                						if ($content_type eq "html") {
															if ($rich_conf->{editor} eq "crossbrowser" &&  $session->{ua_browser}eq"InternetExplorer") {
																$spacer = "\n" .$spacer;
				                							}
								                        }
								                        $body =~ s/^([\s\r\n\t]*)\Q$before_sign->{sign}\E(?:$spacer)?//i;
					                                }
				                				}
				                			}
				                			if ($sign->{sign} eq "") {
                                                if($rich_conf->{editor} eq "crossbrowser" || $content_type eq "text"){
                                                	$sign->{body}->{$content_type} = $body;
                                                }else{
                                                	if($before_sign->{sign} ne ""){
                                                		$body =~ s/\Q$before_sign->{sign}\E//i;
                                                	}
                                                	$sign->{body}->{$content_type} = $body;
                                                }
				                			} else {
				                				if($rich_conf->{editor} eq "crossbrowser" || $content_type eq "text"){
                                                	$sign->{body}->{$content_type} = $body . $spacer . $sign->{sign};
                                                }else{
                                                	if($before_sign->{sign} ne ""){
                                                		if ($sign->{$from_pos} eq $before_sign->{$befrom_pos}) {
                                                			$body =~ s/\Q$before_sign->{sign}\E/$sign->{sign}/i;
                                                		} else {
                                                			$body =~ s/\Q$before_sign->{sign}\E//i;
                                                			$body =~ s/(\<\/div\>)$/$sign->{sign}$1/i;
                                                		}
                                                	}else{
                                                		$body =~ s/(\<\/div\>)$/$sign->{sign}$1/i;
                                                	}
                                                	$sign->{body}->{$content_type} = $body;
                                                }
				                			}
				                		}
                                        $result->{sign} = $sign;
                                } else {
                                        &_warn($session, "sign_detail");
                                        $error = &error("NOT_READ_SIGN", 9);
                                }
                        }
                } else {
                        &_warn($session, "sign_detail");
                        $error = &error("NOT_READ_SIGN", 9);
                }

                &unlock($session, "trans.mail");
        } else {
                &_warn($session, "lock");
                $error = &error("NOT_LOCK", 9);
        }

        if ($error) {
                $result = $error;
        }

        &_logger($session, $imaps, $logger);

        return($result);
}

sub upload_file($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger  = &_logger_init($session, 1);
	my $module  = DA::IS::get_module($session);
	my $icons   = DA::IS::get_icon_data();
	my $maid    = $c->{maid};
	my $upload  = $c->{upload};
	my $noname  = $c->{noname};
	my $content = $upload->info->get("Content-Disposition");
	my $type    = $upload->type;
	   $type    =~s/\s//og;
	my $result  = {};
	my ($file, $name, $ext, $error);

	if ($content=~/filename=\"(.+)\"$/) {
		$file = $1;
	} else {
		$file = $upload->filename;
	}
	if ($file eq "") {
		if ($noname) {
			return(&error("NO_INPUT_QUERY", 0, t_("添付ファイル名")));
		} else {
			return(&error("NO_INPUT_QUERY", 1, t_("添付ファイル名")));
		}
	} else {
		$file = DA::Valid::check_filename($file);
		$file = DA::Charset::convert(\$file, &external_charset(), &mailer_charset());
		($name, $ext) = &get_filename($file, 1);
	}
	if ($type =~ /^text\/plain$/i || $type eq "") {
		$type = "application/octet-stream";
	}

	if (&lock($session, "send.$maid")) {
		if (my $mail = &storable_retrieve($session, "mail.$maid")) {
			my $aid  = $mail->{last_aid} + 1;
			my $dst	 = &_fullpath($session, "mail\-$maid\-$aid\.$ext");
			my $dtype= &_document_type($session, $imaps, $module);

			my ($fname, $um) = &file_upload($session, $upload, $dst, $type, &external_charset());
			if ($um) {
				$error = {
					"error"   => 9,
					"message" => $um
				};
			} else {
				$mail->{attach}->{$aid} = {
					"aid"      => $aid,
					"name"     => $name,
					"title"    => $name,
					"type"     => $type,
					"ext"      => $ext,
					"size"     => int(DA::CGIdef::convert_byte((stat($dst))[7], "KB")),
					"icon"     => $session->{img_rdir} . "/"
					           .  DA::IS::get_object_icon($ext, "small", $icons, 14),
					"warn"     => "",
					"path"     => "mail\-$maid\-$aid\.$ext",
					"link"     => "javascript:DA.file.openDownload4New($maid, $aid);",
					"document" => ($dtype) ? "javascript:DA.file.openDocument4New($maid, $aid, $dtype);" : "",
					"org_name" => $file,
				};
				$mail->{last_aid} = $aid;

				if (&storable_store($session, $mail, "mail.$maid")) {
					$result->{attach} = {
						$aid => $mail->{attach}->{$aid}
					};

					DA::OperationLog::upload($session, &_urlpath($session, "mail\-$maid\-$aid\.$ext"), &convert_internal($name));
				} else {
					&_warn($session, "storable_store");
					$error = &error("NOT_WRITE_MAIL", 9);
				}
			}
		} else {
			&_warn($session, "storable_retrieve");
			$error = &error("NOT_READ_MAIL", 9);
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub delete_file($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger  = &_logger_init($session, 1);
	my $maid    = $c->{maid};
	my $aid     = $c->{aid};
	my $result  = {};
	my $error;

	if (&lock($session, "send.$maid")) {
		if (my $mail = &storable_retrieve($session, "mail.$maid")) {
			my $path = &_fullpath($session, $mail->{attach}->{$aid}->{path});
			DA::System::file_unlink($path);

			delete $mail->{attach}->{$aid};

			$result->{count} = scalar(keys %{$mail->{attach}});

			unless (&storable_store($session, $mail, "mail.$maid")) {
				&_warn($session, "storable_store");
				$error = &error("NOT_WRITE_MAIL", 9);
			}
		} else {
			&_warn($session, "storable_retrieve");
			$error = &error("NOT_READ_MAIL", 9);
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub library_file($$$$) {
	my ($session, $imaps, $c, $files) = @_;
	my $logger  = &_logger_init($session, 1);
	my $module  = DA::IS::get_module($session);
	my $icons   = DA::IS::get_icon_data();
	my $maid    = $c->{maid};
	my $result  = {};
	my ($error);

	if (&lock($session, "send.$maid")) {
		if (my $mail = &storable_retrieve($session, "mail.$maid")) {
			my $aid = $mail->{last_aid};

			foreach my $f (@{$files}) {
				$aid ++;

				my $name = $f->{name};
				my $ext  = $f->{ext};
				my $src  = $f->{path};

				my $dst  = &_fullpath($session, "mail\-$maid\-$aid\.$ext");
				my $dtype= &_document_type($session, $imaps, $module);

				if (DA::System::file_copy($src, $dst)) {
					$mail->{attach}->{$aid} = {
						"aid"      => $aid,
						"name"     => $name,
						"title"    => $name,
						"type"     => "", 
						"ext"      => $ext,
						"size"     => int(DA::CGIdef::convert_byte((stat($dst))[7], "KB")),
						"icon"     => $session->{img_rdir} . "/"
						           .  DA::IS::get_object_icon($ext, "small", $icons, 14),
						"warn"     => "",
						"path"     => "mail\-$maid\-$aid\.$ext",
						"link"     => "javascript:DA.file.openDownload4New($maid, $aid);",
						"document" => ($dtype) ? "javascript:DA.file.openDocument4New($maid, $aid, $dtype);" : "",
						"org_name" => $name,
					};

					$result->{attach}->{$aid} = $mail->{attach}->{$aid};

					DA::OperationLog::upload($session, &_urlpath($session, "mail\-$maid\-$aid\.$ext"), &convert_internal($name));

				} else {
					&_warn($session, "Can't copy file [$src]");
					$error = &error("NOT_WRITE_ATTACHMENT", 9);
					last;
				}
			}
			$mail->{last_aid} = $aid;

			unless ($error) {
				unless (&storable_store($session, $mail, "mail.$maid")) {
					&_warn($session, "storable_store");
					$error = &error("NOT_WRITE_MAIL", 9);
				}
			}
		} else {
			&_warn($session, "storable_retrieve");
			$error = &error("NOT_READ_MAIL", 9);
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub size_file($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger  = &_logger_init($session, 1);
	my $maid    = $c->{maid};
	my $result  = {};
	my $error;

	if (&lock($session, "send.$maid")) {
		if (my $mail = &storable_retrieve($session, "mail.$maid")) {
			my $max   = $imaps->{system}->{max_send_size};
			my $total = 0;
			foreach my $aid (sort {$a <=> $b} keys %{$mail->{attach}}) {
				$total += $mail->{attach}->{$aid}->{size};
			}
			if ($max && $total > $max) {
				$error = &error("OVER_ATTACH_SIZE", 9);
			} else {
				$result->{total} = $total;
			}
		} else {
			&_warn($session, "storable_retrieve");
			$error = &error("NOT_READ_MAIL", 9);
		}

		&unlock($session, "send.$maid");
	} else {
		&_warn($session, "lock");
		$error = &error("NOT_LOCK", 9);
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub get_messages($$;$) {
	my ($session, $c, $charset) = @_;

	my $messages =<<end_buf;
{
    STARTING                               : '@{[t_('起動中です...')]}',
    STARTING_WARN                          : '@{[t_('メール数が多いと、処理に時間が掛かる場合があります。')]}',
    COPYRIGHT                              : 'DreamArts INSUITE&reg; Copyright&copy; %1, DreamArts Corporation.',
    ADDRESS_SET_ERROR                      : '@{[t_('アドレス情報が取得できませんでした。')]}',
    BROWSER_ERROR                          : "@{[t_("ご使用のブラウザは、統合メーラ(ニュースタイル)のサポート対象ブラウザではありません。") . "\\n" . t_("サポート対象ブラウザ(Internet Explorer 7.0)をご使用ください。")]}",
    BROWSER_WARN                           : "@{[t_("ご使用のブラウザは、統合メーラ(ニュースタイル)のサポート対象ブラウザではありません。") . "\\n" . t_("サポート対象ブラウザ(Internet Explorer 7.0)のご使用を推奨致します。")]}",
    BULKINFO_ERROR                         : '@{[t_('一括送信アドレス情報の取得に失敗しました。')]}',
    DEFAULT_FOLDER_TREE                    : '@{[t_('階層構造を<br>読み込み中です。<br><br>メール数が多いと、<br>処理に時間が掛かる<br>場合があります。')]}',
    DEFAULT_MESSAGE_BODY                   : '@{[t_('メールが選択されていません。')]}',
    DIALOG_CANCEL_BUTTON                   : '@{[t_('Cancel')]}',
    DIALOG_ERROR                           : '@{[t_('ダイアログの生成に失敗しました。')]}',
    DIALOG_OK_BUTTON                       : '@{[t_('OK')]}',
    DIALOG_SETTING_BUTTON                  : '@{[t_('設定')]}',
    DIALOG_SAVE_BUTTON                     : '@{[t_('保存')]}',
    DIALOG_MOVE_BUTTON                     : '@{[t_('移動')]}',
    EDITOR_CLOSE_CONFIRM                   : '@{[t_('メール作成画面を閉じます。よろしいですか？')]}',
    EDITOR_DIALOG_CHANGEEMAIL              : '@{[t_('メールアドレスを入力してください。')]}',
    EDITOR_DIALOG_RENAME                   : '@{[t_('名前を入力してください。')]}',
    EDITOR_LIBRARYSEL_BUTTON               : '@{[t_('ライブラリから選択')]}',
	EDITOR_SHOW_APPLET_BUTTON              : '@{[t_('ドロップエリアを表示')]}',
    EDITOR_POPUPMENU_CHANGEEMAILCUSTOM     : '@{[t_('%1へ変更', '%1')]}',
    EDITOR_POPUPMENU_CHANGEEMAIL           : '@{[t_('メールアドレス変更')]}',
    EDITOR_POPUPMENU_CHANGELANG            : '@{[t_('%1表記へ変更', '%1')]}',
    EDITOR_POPUPMENU_CHANGELANG_ENGLISH    : '@{[t_('英語表記へ変更')]}',
    EDITOR_POPUPMENU_CHANGELANG_VIEW       : '@{[t_('表示言語へ変更')]}',
    EDITOR_POPUPMENU_MOVEBCC               : '@{[t_('Ｂｃｃへ移動')]}',
    EDITOR_POPUPMENU_MOVECC                : '@{[t_('Ｃｃへ移動')]}',
    EDITOR_POPUPMENU_MOVETO                : '@{[t_('宛先へ移動')]}',
    EDITOR_POPUPMENU_MOVEBOTTOM            : '@{[t_('最後に移動')]}',
    EDITOR_POPUPMENU_MOVETOP               : '@{[t_('一番上に移動')]}',
    EDITOR_POPUPMENU_OPENGROUP             : '@{[t_('所属ユーザに展開')]}',
    EDITOR_POPUPMENU_RENAME                : '@{[t_('名前変更')]}',
    EDITOR_POPUPMENU_TITLENAMEON           : '@{[t_('敬称を利用')]}',
    EDITOR_POPUPMENU_TITLEOFF              : '@{[t_('敬称なし')]}',
    EDITOR_POPUPMENU_TITLEON               : '@{[t_('役職を利用')]}',
    EDITOR_TITLEEMPTY_SAVE_CONFIRM         : '@{[t_('件名が入力されていません。このまま保存しますか？')]}',
    EDITOR_TITLEEMPTY_TRANSMIT_CONFIRM     : '@{[t_('件名が入力されていません。このまま送信しますか？')]}',
    EXISTS_BACKUP_FILES                    : '@{[t_('作成中に中断されたメールが保存されています。\\n確認の上、不要なメールは削除してください。')]}',
    EXPORT_ERROR                           : '@{[t_('エクスポートに失敗しました。')]}',
    SAVE_TO_LIB_ERROR                      : '@{[t_('ライブラリに保存に失敗しました。')]}',
    SAVETOLIB_OPERATING_PROMPT             : '@{[t_('ライブラリに保存中')]}',
    SAVEATTACHTOLIB_OPERATING_PROMPT       : '@{[t_('ライブラリに保存中')]}',
    EXPORT_FILE_EMPTY                      : '@{[t_('エクスポートに失敗しました。')]}',
    EXPORT_OPERATING_PROMPT                : '@{[t_('エクスポート処理中')]}',
    FILTER_ERROR                           : '@{[t_('フィルタが実行できませんでした。')]}',
    FILTER_OPERATING_PROMPT                : '@{[t_('フィルタ処理中')]}',
    FOLDER_ADD_MENU                        : '@{[t_('フォルダを追加')]}',
    FOLDER_CLOSE_MENU                      : '@{[t_('下位を閉じる')]}',
    FOLDER_CREATE_DIALOG                   : '@{[t_('作成するフォルダ名を入力して下さい。')]}',
    FOLDER_CREATE_ERROR                    : '@{[t_('フォルダを作成できませんでした。')]}',
    FOLDER_DELETE_CONFIRM4PARENT           : "@{[t_("フォルダ '%1' を削除します。","%1") . t_("下位のフォルダも削除されます。") . t_("よろしいですか？") . "\\n" . t_("［") . t_("注意：メールも全て削除されます！元に戻すことはできません。") . t_("］")]}",
    FOLDER_DELETE_CONFIRM                  : "@{[t_("フォルダ '%1' を削除します。","%1") . t_("よろしいですか？") . "\\n" . t_("［") . t_("注意：メールも全て削除されます！元に戻すことはできません。") . t_("］")]}",
    FOLDER_DELETE_ERROR                    : '@{[t_('フォルダが削除できませんでした。')]}',
    FOLDER_DELETE_MENU                     : '@{[t_('削除')]}',
    FOLDER_PRINT_MENU                      : '@{[t_('印刷')]}',
    FOLDER_EXPORT_MENU                     : '@{[t_('エクスポート')]}',
    FOLDER_FILTER_MENU                     : '@{[t_('フィルタを実行')]}',
    FOLDER_IMPORT_DIALOG                   : '@{[t_('インポートファイルを指定して下さい。')]}',
    FOLDER_IMPORTEML_CONFIRM               : '@{[t_('拡張子がemlではありません。よろしいですか？')]}',
    FOLDER_IMPORT_MENU                     : '@{[t_('インポート')]}',
    FOLDER_MOVE_ERROR                      : '@{[t_('フォルダを移動できませんでした。')]}',
    FOLDER_NEXT_FID_ERROR                  : '@{[t_('フォルダ番号が取得できませんでした。')]}',
    FOLDER_OPEN_MENU                       : '@{[t_('下位を開く')]}',
    FOLDER_REBUILD_CONFIRM                 : "@{[t_("メール情報を再構築します。") . t_("メール数が多い場合は、\\n処理に時間が掛かる場合があります。") . t_("よろしいですか？")]}",
    FOLDER_REBUILD_MENU                    : '@{[t_('再構築')]}',
    FOLDER_RENAME_DIALOG                   : '@{[t_('変更するフォルダ名を入力して下さい。')]}',
    FOLDER_RENAME_ERROR                    : '@{[t_('フォルダ名が変更できませんでした。')]}',
    FOLDER_RENAME_MENU                     : '@{[t_('フォルダ名の変更')]}',
    FOLDER_SELECT_ERROR                    : '@{[t_('フォルダを選択できませんでした。')]}',
    FOLDER_TREE_ERROR                      : '@{[t_('フォルダツリーが生成できませんでした。')]}',
    FOLDER_TREE_TITLE                      : '@{[t_('フォルダ')]}',
    FORCED_INTERRUPTION                    : '@{[t_('強制中断')]}',
    FORCED_INTERRUPTION_COMMENT            : '@{[t_('以下のボタンを押すと、送信処理を中断し編集画面に戻ります。')]}',
    FORCED_INTERRUPTION_ALERT              : '@{[t_('送信処理を中断しました。このメールが送信済みかどうかは送信済みのフォルダをご確認ください。再送する場合は作成ボタンからメール作成を行ってください。')]}',
    GROUPINFO_ERROR                        : '@{[t_('グループ情報の取得に失敗しました。')]}',
    IMPORT_ERROR                           : '@{[t_('インポートに失敗しました。')]}',
    IMPORT_OPERATING_PROMPT                : '@{[t_('インポート処理中')]}',
    IMPORT_PATH_EMPTY                      : '@{[t_('インポートファイルが指定されていません。')]}',
    JOIN_ERROR                             : '@{[t_('結合できませんでした。')]}',
    JOIN_OPERATING_PROMPT                  : '@{[t_('結合処理中')]}',
    JSON_ERROR                             : '@{[t_('サーバーと通信ができませんでした。')]}',
    LOGOUT_ERROR_CONFIRM                   : '@{[t_('通信障害などで処理が終了できませんでした。強制終了しますか？')]}',
    MAILER_CLOSE_CONFIRM                   : '@{[t_('統合メーラを終了します。メーラの全てのウィンドウを閉じてもよろしいですか？')]}',
    MBOXGRID_COLUMNTITLE_ATTACHMENT        : '@{[t_('添付')]}',
    MBOXGRID_COLUMNTITLE_DATE              : '@{[t_('送信日時')]}',
    MBOXGRID_COLUMNTITLE_BACKUP_DATE       : '@{[t_('保存日時')]}',
    MBOXGRID_COLUMNTITLE_BACKUP_SIZE       : '@{[t_('IMAPサイズ')]}',
    MBOXGRID_COLUMNTITLE_FLAGGED           : '@{[t_('マーク')]}',
    MBOXGRID_COLUMNTITLE_FROM              : '@{[t_('差出人')]}',
    MBOXGRID_COLUMNTITLE_PRIORITY          : '@{[t_('重要度')]}',
    MBOXGRID_COLUMNTITLE_SEEN              : '@{[t_('未読')]}',
    MBOXGRID_COLUMNTITLE_SIZE              : '@{[t_('サイズ')]}',
    MBOXGRID_COLUMNTITLE_SUBJECT           : '@{[t_('件名')]}',
    MBOXGRID_COLUMNTITLE_TO                : '@{[t_('宛先')]}',
    MBOXGRID_KEYWORD_EMPTY                 : '@{[t_('キーワードを入力してください。')]}',
    MBOXGRID_LOADING                       : '@{[t_('読み込み中...')]}',
    MBOXGRID_NOFOLDERSELECTED              : '@{[t_('フォルダが選択されていません')]}',
    MBOXGRID_NOMESSAGE                     : '@{[t_('表示可能なメールはありません。')]}',
    MBOXGRID_ROWCONTEXTMENU_DELETE         : '@{[t_('削除')]}',
    MBOXGRID_ROWCONTEXTMENU_EXPORT         : '@{[t_('エクスポート')]}',
    MBOXGRID_ROWCONTEXTMENU_FORWARD        : '@{[t_('転送')]}',
    MBOXGRID_ROWCONTEXTMENU_JOIN           : '@{[t_('結合する')]}',
    MBOXGRID_ROWCONTEXTMENU_MARKASREAD     : '@{[t_('既読にする')]}',
    MBOXGRID_ROWCONTEXTMENU_MARKASUNREAD   : '@{[t_('未読にする')]}',
    MBOXGRID_ROWCONTEXTMENU_OPEN           : '@{[t_('開く')]}',
    MBOXGRID_ROWCONTEXTMENU_REPLYALL       : '@{[t_('全員に返信')]}',
    MBOXGRID_ROWCONTEXTMENU_REPLY          : '@{[t_('返信')]}',
    MBOXGRID_ROWCONTEXTMENU_RUNFILTER      : '@{[t_('フィルタを実行')]}',
    MBOXGRID_ROWCONTEXTMENU_SETMARK        : '@{[t_('マークを付ける')]}',
    MBOXGRID_ROWCONTEXTMENU_UNSETMARK      : '@{[t_('マークを外す')]}',
    MBOXGRID_ROWCONTEXTMENU_PRINT          : '@{[t_('印刷')]}',
    MBOXGRID_ROWCONTEXTMENU_SAVETOLIB      : '@{[t_('メールを保存')]}',
    MBOXGRID_ROWCONTEXTMENU_MOVEFOLDER     : '@{[t_('他のフォルダに移動')]}',
    MBOXGRID_ROWCONTEXTMENU_SAVEATTTOLIB   : '@{[t_('添付ファイルをライブラリに保存')]}',
    MDN_ERROR                              : '@{[t_('開封通知が送信できませんでした。')]}',
    MESSAGE_APPEND_MAIL2LOCAL              : '@{[t_("メールサーバに保存できませんでした。一時保管に保存します。")]}',
    MESSAGE_CHARSET_ISO2022JP              : '@{[t_('日本語のみ')]}',
    MESSAGE_CHARSET_UTF8                   : '@{[t_('日本語以外の言語を含む')]}',
    MESSAGE_CHECKBOXMESSAGE_GROUPNAME      : '@{[t_('宛先グループ名を本文に記載')]}',
    MESSAGE_CHECKBOXMESSAGE_NOTIFICATION   : '@{[t_('開封通知を要求')]}',
    MESSAGE_CHECKBOXMESSAGE_OPENSTATUS     : '@{[t_('開封状況を確認')]}',
    MESSAGE_CHECKBOXMESSAGE_REPLYUSE       : '@{[t_('返信メールアドレスを使用する')]}',
    MESSAGE_COLUMNTITLE_ATTACHMENTFILE     : '@{[t_('添付ファイル')]}',
    MESSAGE_COLUMNTITLE_ATTACHMENT         : '@{[t_('添付')]}',
    MESSAGE_COLUMNTITLE_BCC                : '@{[t_('Bcc')]}',
    MESSAGE_COLUMNTITLE_CC                 : '@{[t_('Cc')]}',
    MESSAGE_COLUMNTITLE_CHARSET            : '@{[t_('言語')]}',
    MESSAGE_COLUMNTITLE_CONTENTTYPE        : '@{[t_('書式')]}',
    MESSAGE_COLUMNTITLE_DATE               : '@{[t_('日付')]}',
    MESSAGE_COLUMNTITLE_FROM               : '@{[t_('差出人')]}',
    MESSAGE_COLUMNTITLE_OPTIONS            : '@{[t_('付加情報')]}',
    MESSAGE_COLUMNTITLE_PRIORITY           : '@{[t_('重要度')]}',
    MESSAGE_COLUMNTITLE_SIGN               : '@{[t_('署名')]}',
    MESSAGE_COLUMNTITLE_SUBJECT            : '@{[t_('件名')]}',
    MESSAGE_COLUMNTITLE_TO                 : '@{[t_('宛先')]}',
    MESSAGE_CONTENTTYPE_HTML               : '@{[t_('リッチテキスト')]}',
    MESSAGE_CONTENTTYPE_TEXT               : '@{[t_('テキスト')]}',
    MESSAGE_DELETECOMPLETE_CONFIRM         : '@{[t_('メールを削除します。削除されたメールは元に戻すことは出来ません。よろしいですか？')]}',
    MESSAGE_DELETE_CONFIRM                 : '@{[t_('メールを削除します。よろしいですか？')]}',
    MESSAGE_DELETE_ERROR                   : '@{[t_('メールが削除できませんでした。')]}',
    MESSAGE_EDIT_ERROR                     : '@{[t_('メールが編集できません。')]}',
    MESSAGE_EDIT_REOPEN_ERROR              : '@{[t_('既にメール作成画面が開いています。')]}',
    MESSAGE_EXPORT_MENU                    : '@{[t_('エクスポート')]}',
    MESSAGE_HEADER_MENU                    : '@{[t_('ヘッダ表示')]}',
    MESSAGE_MDN_CONFIRM                    : '@{[t_('開封通知を要求されています。送信しますか？')]}',
    MESSAGE_MDN_SENT                       : '@{[t_('開封通知を送信しました。')]}',
    MESSAGE_NEW_MAKING                     : '@{[t_('新規作成')]}',
    MESSAGE_PREVIEW_ERROR                  : '@{[t_('プレビューが表示できません。')]}',
    MESSAGE_PRINT_ERROR                    : '@{[t_('印刷が表示できません。')]}',
    MESSAGE_PRIORITY_HIGH                  : '@{[t_('高い')]}',
    MESSAGE_PRIORITY_LOW                   : '@{[t_('低い')]}',
    MESSAGE_PRIORITY_NORMAL                : '@{[t_('通常')]}',
    MESSAGE_REGIST_MENU                    : '@{[t_('%1に登録', '%1')]}',
    MESSAGES                               : '@{[t_('%1通', '%1')]}',
    MESSAGE_SAVE_ERROR                     : '@{[t_('メールが保存できません。')]}',
    MESSAGE_SAVETOLIB_MENU                 : '@{[t_('メールを保存')]}',
    MESSAGE_SAVEATTACHESTOLIB_MENU         : '@{[t_('ライブラリへ保存')]}',
    MESSAGE_SAVEATTACHESTOLIBOPTION_MENU   : '@{[t_('添付ファイルを保存')]}',
    MESSAGE_SAVE_ERROR2                    : '@{[t_('メールは保存されましたが、内容が画面に反映できませんでした。')]}',
    MESSAGE_SIGN_ERROR                     : '@{[t_('署名が取得できません。')]}',
    MESSAGES_NOUNSEEN_UNIT                 : '@{[t_('（%1件）', '%1')]}',
    MESSAGES_UNSEEN_UNIT                   : '@{[t_('（%1件中未読：%2件）', '%1', '%2')]}',
    MESSAGE_SWITCH_CONTENTTYPE_CONFIRM     : '@{[t_('書式情報が初期化されます。よろしいですか？')]}',
    MESSAGE_TEMPLATE_CONFIRM               : '@{[t_('指定のテンプレートで上書きします。よろしいですか？')]}',
    MESSAGE_TEMPLATE_ERROR                 : '@{[t_('テンプレートが取得できません。')]}',
    MESSAGE_TRANSMIT_ERROR                 : '@{[t_('メールが送信できません。')]}',
    MESSAGE_TRANSMIT_ERROR2                : '@{[t_('メールは送信されましたが、内容が画面に反映できませんでした。')]}',
    MESSAGE_UNIT                           : '@{[t_('通')]}',
    MESSAGE_VIEW_ERROR                     : '@{[t_('メールが表示できません。')]}',
    MESSAGE_SELECT_ATTACHES_ERROR          : '@{[t_('添付ファイルを選択してください。')]}',
    MESSAGE_MOVE_FOLDER_ERROR              : '@{[t_('保存できないフォルダを選択しました、他のフォルダを選択してください。')]}',
    POPUP_TITLENAME_SEARCH                 : '@{[t_('メール検索')]}',
    QUOTE_00_TITLE                         : '@{[t_('引用（本文/添付）')]}',
    QUOTE_01_TITLE                         : '@{[t_('引用（本文のみ）')]}',
    QUOTE_02_TITLE                         : '@{[t_('引用（添付のみ）')]}',
    QUOTE_10_TITLE                         : '@{[t_('引用符なし（本文/添付）')]}',
    QUOTE_11_TITLE                         : '@{[t_('引用符なし（本文のみ）')]}',
    QUOTE_99_TITLE                         : '@{[t_('引用しない')]}',
    PRINT_WITH_TO                          : '@{[t_('送信先を表示して印刷')]}',
    PRINT_WITHOUT_TO                       : '@{[t_('送信先を表示しないで印刷')]}',
    REBUILD_ERROR                          : '@{[t_('再構築に失敗しました。')]}',
    REBUILD_OPERATING_PROMPT               : '@{[t_('再構築中')]}',
    SAVE_MAIL_MESSAGE                      : '@{[t_('[%1]に保存しました。', '%1')]}',
    SAVE_OPERATING_PROMPT                  : '@{[t_('保存中')]}',
    SAVE_STATE_MESSAGE                     : '@{[t_('状態を保存しました。')]}',
    SEARCH_BUTTON                          : '@{[t_('検　索')]}',
    SEARCH_CHECKBOXMESSAGE_CLASS           : '@{[t_('指定したフォルダ以下すべてを含む')]}',
    SEARCH_CHECKBOXMESSAGE_DELETED         : '@{[t_('削除済みメールも表示')]}',
    SEARCH_CHECKBOXMESSAGE_TOSELF          : '@{[t_('自分宛のみ表示')]}',
    SEARCH_COLUMNTITLE_FID                 : '@{[t_('対象フォルダ')]}',
    SEARCH_COLUMNTITLE_FIELD               : '@{[t_('検索対象項目')]}',
    SEARCH_COLUMNTITLE_KEYWORD             : '@{[t_('検索文字列')]}',
    SEARCH_COLUMNTITLE_NORROWING           : '@{[t_('絞込み条件')]}',
    SEARCH_COLUMNTITLE_TOTAL               : '@{[t_('検索結果')]}',
    SEARCH_ERROR                           : '@{[t_('検索に失敗しました。')]}',
    SEARCH_KEYWORD_EMPTY                   : '@{[t_('キーワードを入力してください。')]}',
    SEARCH_MESSAGE_GUIDE                   : '@{[t_('キーワードはスペースで区切って入力してください。 大文字、小文字の区別はありません。')]}',
    SEARCH_NOMATCH                         : '@{[t_('条件に一致するメールはありません。')]}',
    SEARCH_OPERATING_PROMPT                : '@{[t_('検索中')]}',
    SEARCH_OPTIONNAME_COND_AND             : '@{[t_('全ての語を含む')]}',
    SEARCH_OPTIONNAME_COND_OR              : '@{[t_('いずれかの語を含む')]}',
    SEARCH_OPTIONNAME_FIELD_BCC            : '@{[t_('Ｂｃｃ')]}',
    SEARCH_OPTIONNAME_FIELD_BODY           : '@{[t_('本文')]}',
    SEARCH_OPTIONNAME_FIELD_CC             : '@{[t_('Ｃｃ')]}',
    SEARCH_OPTIONNAME_FIELD_FROM           : '@{[t_('差出人')]}',
    SEARCH_OPTIONNAME_FIELD_GROUP          : '@{[t_('グループ')]}',
    SEARCH_OPTIONNAME_FIELD_SUBJECT        : '@{[t_('件名')]}',
    SEARCH_OPTIONNAME_FIELD_TEXT           : '@{[t_('ヘッダまたは本文')]}',
    SEARCH_OPTIONNAME_FIELD_TO             : '@{[t_('宛先')]}',
    SEARCH_OVER_WARN                       : '@{[t_('検索結果が%1件を超えました。処理を中断します。', '%1')]}',
    SEARCH_RADIONAME_ATTACHMENT_ALL        : '@{[t_('全て')]}',
    SEARCH_RADIONAME_ATTACHMENT_EXISTS     : '@{[t_('添付あり')]}',
    SEARCH_RADIONAME_ATTACHMENT_NOEXISTS   : '@{[t_('添付なし')]}',
    SEARCH_RADIONAME_ATTACHMENT            : '@{[t_('添付')]}',
    SEARCH_RADIONAME_ETC                   : '@{[t_('その他')]}',
    SEARCH_RADIONAME_FLAGGED               : '@{[t_('マーク')]}',
    SEARCH_RADIONAME_FLAGGED_ALL           : '@{[t_('全て')]}',
    SEARCH_RADIONAME_FLAGGED_FLAGGED       : '@{[t_('マークあり')]}',
    SEARCH_RADIONAME_FLAGGED_UNFLAGGED     : '@{[t_('マークなし')]}',
    SEARCH_RADIONAME_PRIORITY_ALL          : '@{[t_('全て')]}',
    SEARCH_RADIONAME_PRIORITY_HIGH         : '@{[t_('高い')]}',
    SEARCH_RADIONAME_PRIORITY_LOW          : '@{[t_('低い')]}',
    SEARCH_RADIONAME_PRIORITY_NORMAL       : '@{[t_('通常')]}',
    SEARCH_RADIONAME_PRIORITY              : '@{[t_('重要度')]}',
    SEARCH_RADIONAME_SEEN_ALL              : '@{[t_('全て')]}',
    SEARCH_RADIONAME_SEEN_SEEN             : '@{[t_('既読')]}',
    SEARCH_RADIONAME_SEEN_UNSEEN           : '@{[t_('未読')]}',
    SEARCH_RADIONAME_SEEN                  : '@{[t_('既読')]}',
    SET_BUTTON                             : '@{[t_('設定')]}',
    SIMPLESEARCH_MENUTITLE_ADVANCE         : '@{[t_('詳細検索')]}',
    SIMPLESEARCH_MENUTITLE_FROM            : '@{[t_('差出人')]}',
    SIMPLESEARCH_MENUTITLE_SUBJECT         : '@{[t_('件名')]}',
    SIMPLESEARCH_MENUTITLE_TO              : '@{[t_('宛先')]}',
    SPAM                                   : '@{[t_('SPAM')]}',
    SPELLCHECK                             : '@{[t_('スペルチェックを実行する')]}',
    SPELLCHECK_NO                          : '@{[t_('スペルチェックを実行しない')]}',
    STORAGE_UNIT                           : '@{[t_('KB')]}',
    STORAGE_UNIT_MB                        : '@{[t_('MB')]}',
    TOPMENU43PANE_DELETE_TITLE             : '@{[t_('削除')]}',
    TOPMENU43PANE_FORWARD_TITLE            : '@{[t_('転送')]}',
    TOPMENU43PANE_GUIDE_TITLE              : '@{[t_('ガイド')]}',
    TOPMENU43PANE_MAKE_TITLE               : '@{[t_('作成')]}',
    TOPMENU43PANE_REPLYALL_TITLE           : '@{[t_('全員に返信')]}',
    TOPMENU43PANE_REPLY_TITLE              : '@{[t_('返信')]}',
    TOPMENU43PANE_SETTING_TITLE            : '@{[t_('設定%(preference)')]}',
    TOPMENU43PANE_STATE_TITLE              : '@{[t_('状態保存')]}',
    TOPMENU43PANE_PRINT_TITLE              : '@{[t_('印刷')]}',
    TOPMENU4EDITOR_BACK_TITLE              : '@{[t_('戻る')]}',
    TOPMENU4EDITOR_PREVIEW_TITLE           : '@{[t_('プレビュー')]}',
    TOPMENU4EDITOR_SAVE_TITLE              : '@{[t_('保存')]}',
    TOPMENU4EDITOR_TEMPLATE_TITLE          : '@{[t_('テンプレート')]}',
    TOPMENU4EDITOR_TRANSMIT_TITLE          : '@{[t_('送信')]}',
    TOPMENU4VIEWER_DELETE_TITLE            : '@{[t_('削除')]}',
    TOPMENU4VIEWER_EDIT_TITLE              : '@{[t_('編集')]}',
    TOPMENU4VIEWER_FILTER_TITLE            : '@{[t_('フィルタ')]}',
    TOPMENU4VIEWER_FORWARD_TITLE           : '@{[t_('転送')]}',
    TOPMENU4VIEWER_NEXT_TITLE              : '@{[t_('後へ')]}',
    TOPMENU4VIEWER_OPTION_TITLE            : '@{[t_('オプション')]}',
    TOPMENU4VIEWER_PREV_TITLE              : '@{[t_('前へ')]}',
    TOPMENU4VIEWER_PRINT_TITLE             : '@{[t_('印刷')]}',
    TOPMENU4VIEWER_REPLYALL_TITLE          : '@{[t_('全員に返信')]}',
    TOPMENU4VIEWER_REPLY_TITLE             : '@{[t_('返信')]}',
    TOPMENU_CLOSE_TITLE                    : '@{[t_('閉じる')]}',
    TRANSMIT_MAIL_MESSAGE                  : '@{[t_('送信が完了しました。')]}',
    TRANSMIT_OPERATING_PROMPT              : '@{[t_('送信中')]}',
    TRASH_ERROR                            : '@{[t_('削除できませんでした。')]}',
    TRASH                                  : '@{[t_('ごみ箱')]}',
    UPLOAD_ERROR                           : '@{[t_('ファイルのアップロードに失敗しました。')]}',
    USERINFO_ERROR                         : '@{[t_('ユーザ情報の取得に失敗しました。')]}',
    WASTE_TRASH_CONFIRM                    : '@{[t_('[%1]を空にします。よろしいですか？', '%1')]}',
    WASTE_TRASH_MENU                       : '@{[t_('[%1]を空にする', '%1')]}',
    WINDOW_SIZE_WARN                       : '@{[t_('ウィンドウサイズが小さすぎるため、ウィンドウサイズを変更します。')]}',
	READY_OK                               : '@{[t_('よろしいですか？')]}',
	B_DOWNLOAD                             : '@{[t_('一括ダウンロード')]}',
	MAIL_SEND_CONFIRM                      : '@{[t_('送信確認')]}',
	CONFIRM_SEND_BUTTON                    : '@{[t_('送信')]}',
    CONFIRM_CANCEL_BUTTON                  : '@{[t_('キャンセル')]}',
    MESSAGE_ATTACHMENT_UPLOAD_ERROR        : '@{[t_('ファイルのアップロードが終了しませんでした。添付ファイルがアップロードされていない可能性があります。')]}',
	MESSAGE_CHANGE_TAB_ERROR               : '@{[t_('他の画面で操作しているので、終わるまで少し待ってください。')]}',
	MESSAGE_CHANGE_TAB_WAITING_MESSAGE     : '@{[t_('処理中')]}',
    SPELLCHECK_NG                          : '@{[t_('スペルミスの可能性があります。')]}',
    OLD_OF_FOLDER                          : '@{[t_('フォルダ情報が最新の状態ではありません。フォルダ情報を更新してよろしいですか？')]}',
    SPELL_CHECK_BUTTON                     : '@{[t_('スペルチェック')]}',
    SAVE_TO_LIB_DIALOG_TITLE               : '@{[t_('ライブラリに保存したい添付ファイルを選択してください。')]}',
    SEARCH_MOVE_FOLDER_DIALOG_TITLE        : '@{[t_('移動先のフォルダを選択してください。')]}'
}
end_buf

	# 組織メールで使用する文言を追加
	if (DA::OrgMail::check_org_mail_permit($session)) {
		DA::OrgMail::rewrite_ajxmailer_messages($session, $c, $charset, \$messages);
	}
	DA::Custom::rewrite_ajxmailer_messages($session, $c, $charset, \$messages);

	unless ($charset) {
		$charset = &mailer_charset();
	}

	return(DA::Unicode::convert_to($messages, $charset));
}

sub _fckeditor_custom_config {
       my $custom_config_file = "custom_config_ins_ajaxmailer.js";
       #=====================================================
       #           ----custom----
       #=====================================================
       DA::Custom::ajaxmailer_fckeditor_custom_config(\$custom_config_file);
       return($custom_config_file);
}

sub get_fckeditor_select_tag {
       my ($session, $conf, $admin) = @_;
       my $file = "$DA::Vars::p->{fckeditor_dir}/" . &_fckeditor_custom_config();

       if (DA::System::file_open(\*IN, "< " . $file)) {
               my ($fonts, $font_sizes);
               while (my $l = <IN>) {
                       $l = DA::Unicode::convert_from($l, "UTF-8");
                       if ($l =~ /^\s*FCKConfig.FontNames\s*\=\s*([\"\'])([^\"]+)\1/) {
                               $fonts = $2;
                       } elsif ($l =~ /^\s*FCKConfig.FontSizes\s*\=\s*([\"\'])([^\"]+)\1/) {
                               $font_sizes = $2;
                       }
               }
               close(IN);

               if (!$fonts || !$font_sizes) {
                       return(undef);
               }

               my $richtext_font = $conf->{richtext_font} || t_("ＭＳ 明朝/ＭＳ 明朝");
               my $fonts_tag = "<select name=\"richtext_font\">";
               if ($admin) {
                       $richtext_font = $conf->{richtext_font} || "";
                       $fonts_tag .= "<option value=\"undefine\">" . t_("設定しない") . "</option>";
               }
               foreach my $i (split(/\s*\;\s*/, $fonts)) {
                       my ($value, $key) = split(/\//, $i, 2);
                       my $selected;
                       if ($i eq $richtext_font) {
                               $selected = " selected";
                       }

                       $fonts_tag .= "<option value=\"" . enc_($i) .  "\"$selected>" . enc_($key) . "</option>";
               }
               $fonts_tag .= "</select>";

               my $richtext_font_size = $conf->{richtext_font_size} || t_("10pt/10ポイント");
               my $font_sizes_tag = "<select name=\"richtext_font_size\">";
               if ($admin) {
                       $richtext_font_size = $conf->{richtext_font_size} || "";
                       $font_sizes_tag .= "<option value=\"undefine\">" . t_("設定しない") . "</option>";
               }
               foreach my $i (split(/\s*\;\s*/, $font_sizes)) {
                       my ($value, $key) = split(/\//, $i, 2);
                       my $selected;
                       if ($i eq $richtext_font_size) {
                               $selected = " selected";
                       }

                       $font_sizes_tag .= "<option value=\"" . enc_($i) .  "\"$selected>" . enc_($key) . "</option>";
               }
               $font_sizes_tag .= "</select>";

               return({
                       fonts      => $fonts_tag,
                       font_sizes => $font_sizes_tag
               });
       } else {
               return(undef);
       }
}

sub get_ajax_fckconfig {
        my ($session,$imaps) = @_;
        my $module   = DA::IS::get_module($session);
        my $sm_link  = 1 if( $module->{smartpage} eq "on" );
        my $sh_link  = 1 if( $module->{share} eq "on" );
        my $lib_link = 1 if( $module->{library} eq "on" );
        my $fcklang = DA::IS::get_user_lang($session);
	
	if ($fcklang =~ /^zh$/){
	                $fcklang = 'zh-cn';
       }

       my $font = $imaps->{mail}->{richtext_font} || t_("ＭＳ 明朝/ＭＳ 明朝");
       my $font_size = $imaps->{mail}->{richtext_font_size} || t_("10pt/10ポイント");
       my ($font_value, $font_key) = split(/\//, $font, 2);
       my ($size_value, $size_key) = split(/\//, $font_size, 2);

       my $fckconfig = {
               "debug"        => $DA::Vars::p->{FIREBUG},
               "custom_file"  => &_fckeditor_custom_config(),
               "lang"         => $fcklang,
               "sm_link"      => $sm_link,
               "sh_link"      => $sh_link,
               "lib_link"     => $lib_link,
               "editor_style" => "body, td {font-size:" . $size_value . "; font-family:'" . $font_value . "'}",
               "font"         => $font_key,
               "font_size"    => $size_key
       };

       return($fckconfig);
}
sub get_config($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my ($default_order) = &all_list_items();
	my $popup    = &get_popup_size_from_session($session, $imaps->{mail});
	my $archives = &check_archive($session, $imaps->{custom});
	my $archive  = &select_archive_type($archives, $imaps->{mail}, 1);
	my ($archive_list, $system, $config, $options);
	my ($license, $hibiki, $headRTE, $initRTE, $writeRTE, $error);
	my ($quote_reply, $quote_forward, $search_target, $update_time, $title, $custom);
    my $spellcheck = &get_sys_custom($session, "spellcheck");
	$spellcheck = DA::SpellCheck::checker($session, $spellcheck);
	if($imaps->{mail}->{spellcheck} && $imaps->{mail}->{spellcheck} ne 'off' && $spellcheck eq "hunspell"){
		$spellcheck = 1;
	} else {
		$spellcheck = 0;
	}

	foreach my $type (qw(zip tar lha mbox eml)) {
		if ($archives->{$type}) {
			$archive_list .= "$type\|";
		}
	}
	$archive_list =~ s/\|+$//g;

	$title = &get_mailer_title($session, $c->{org_mail_gid}, $c->{html});

	if ($imaps->{mail}->{quote_r} eq "off") {
		$quote_reply = "99";
	} elsif ($imaps->{mail}->{quote_r} eq "body") {
		$quote_reply = "11";
	} else {
		$quote_reply = "01";
	}

	if ($imaps->{mail}->{quote_f} eq "off") {
		if ($imaps->{mail}->{quote_f_attach} eq "off") {
			$quote_forward = "99";
		} else {
			$quote_forward = "02";
		}
	} elsif ($imaps->{mail}->{quote_f} eq "body") {
		if ($imaps->{mail}->{quote_f_attach} eq "off") {
			$quote_forward = "11";
		} else {
			$quote_forward = "10";
		}
	} else {
		if ($imaps->{mail}->{quote_f_attach} eq "off") {
			$quote_forward = "01";
		} else {
			$quote_forward = "00";
		}
	}

	if ($imaps->{custom}->{user_search} eq "address") {
		$search_target = '51';
	} else {
		$search_target = '';
	}

	if ($imaps->{custom}->{folder_update_interval} eq "") {
		$update_time = ($imaps->{mail}->{update_time} eq "") ? 60 : $imaps->{mail}->{update_time};
	} else {
		$imaps->{custom}->{folder_update_interval}=60 if($imaps->{custom}->{folder_update_interval}!~/^\d+$/);
		$update_time = $imaps->{custom}->{folder_update_interval};
	}

	my $upload_file_applet;
	if ($imaps->{custom}->{upload_file_applet}) {
		if ($imaps->{custom}->{upload_file_applet} eq "user") {
			$upload_file_applet = $imaps->{mail}->{upload_file_applet} || "off";
		} else {
			$upload_file_applet = $imaps->{custom}->{upload_file_applet};
		}
	} else {
		$upload_file_applet = $imaps->{mail}->{upload_file_applet} || "off";
	}

       my $max_incsearch_hits;
       if ($imaps->{custom}->{max_incsearch_hits}) {
               $max_incsearch_hits = $imaps->{custom}->{max_incsearch_hits};
       } else {
               $max_incsearch_hits = $MAX_INCSEARCH_HITS;
       }

	if (my $guide = &get_sys_custom($session, "guide", 1)) {
		if (my $template = &template_list($session, $imaps)) {
			$system = {
				"guide"              => $guide->{ajx_ma_guide},
				"search_target"      => $search_target,
				"max_number_per_page4ajx" => $imaps->{custom}->{max_number_per_page4ajx} || 50,
				"max_send_size"      => int(DA::CGIdef::convert_byte($imaps->{system}->{max_send_size}, "KB")),
                "max_search_hit"     => $imaps->{custom}->{max_search_hit} || $MAX_SEARCH_HITS,
                "max_incsearch_hits" => $max_incsearch_hits,
				"max_send_size_visible" => $imaps->{custom}->{max_send_size_visible} || "on",
				"inc_search_interval"  => $imaps->{custom}->{inc_search_interval} || 3,
				"inc_search_min_chars" => $imaps->{custom}->{inc_search_min_chars} || 1,
				"upload_retry4ajx"    => ($imaps->{custom}->{upload_retry4ajx} =~ /^\d+$/) ? $imaps->{custom}->{upload_retry4ajx} : 300,
				"sales_datalink_enable" => $imaps->{custom}->{sales_datalink_enable} || "on",
				"no_replied_flag" => (&check_imap_info($session, $imaps, "no_replied_flag")) ? 1 : 0,
				"no_forwarded_flag" => (&check_imap_info($session, $imaps, "no_forwarded_flag")) ? 1 : 0,
				"auto_fix_consistency" => $imaps->{custom}->{auto_fix_consistency} || "user",
				"open_status" => ($DA::Vars::p->{ma_open_status} eq "on") ? 1 : 0,
				"auto_backup_interval" => $imaps->{custom}->{auto_backup_interval} || 30,
				"auto_backup_on"       => ($imaps->{custom}->{auto_backup_on} eq "on" || $imaps->{custom}->{auto_backup_on} eq "user") ? 1 : 0,
				"spellcheck_button_visible" => ($imaps->{custom}->{spellcheck_button_visible} eq "on") ? 1 : 0,
				"change_org_mail_style" => ($imaps->{custom}->{change_org_mail_style} eq "on") ? 1 : 0
			};
			$config = {
				"window_pos_x"       => $imaps->{mail}->{window_pos_x} || 0,
				"window_pos_y"       => $imaps->{mail}->{window_pos_y} || 0,
				"window_width"       => $imaps->{mail}->{window_width} || 1024,
				"window_height"      => $imaps->{mail}->{window_height} || 800,
				"dir_width"          => $imaps->{mail}->{dir_width} || 300,
				"list_height"        => $imaps->{mail}->{list_height} || 400,
				"mail_to_resize_num" => $imaps->{mail}->{mail_to_resize_num} || 12,
				"detail_header_open" => $imaps->{mail}->{detail_header_open} || 0,
				"detail_header_to_open" => $imaps->{mail}->{detail_header_to_open} || 0,
				"detail_header_cc_open" => $imaps->{mail}->{detail_header_cc_open} || 0,
				"detail_header_attachment_open" => $imaps->{mail}->{detail_header_attachment_open} || 0,
				"list_order"         => $imaps->{mail}->{list_order} || $default_order,
				"list_width"         => {
					"attachment"     => 30,
					"date"           => $imaps->{mail}->{list_width_date} || 200,
					"flagged"        => 30,
					"from"           => $imaps->{mail}->{list_width_from} || 106,
					"priority"       => 30,
					"seen"           => 30,
					"size"           => $imaps->{mail}->{list_width_size} || 80,
					"subject"        => $imaps->{mail}->{list_width_subject} || 246
				},
				"delete"             => $imaps->{mail}->{delete} || 0,
				"count"              => $imaps->{mail}->{count} || "all",
				"recent"             => $imaps->{mail}->{recent} || "on",
				"backup"             => ($imaps->{mail}->{backup} eq 'on' || $imaps->{custom}->{auto_backup_on} eq "on") ? 'on' : 'off',
				"backup_exists"      => ((($imaps->{custom}->{auto_backup_on} eq "user" && &backup_ok($session, $imaps))|| $imaps->{custom}->{auto_backup_on} eq "on") && &backup_exists($session)) ? 1 : 0,
				"backup_msg_show"    => ($imaps->{mail}->{backup_msg_show}) ? 1 : 0 , 
				"update_time"        => $update_time,
				"archive_list"       => $archive_list,
				"archive"            => $archive,
				"soft_install"       => ($archives->{lha}||$archives->{tar}||$archives->{zip}) ? 1 : 0,#圧縮ソフトインストールされるかどうか
				"download_type"	     =>	$imaps->{base}->{download},
				"quote_reply"        => $quote_reply,
				"quote_forward"      => $quote_forward,
				"toself_color"       => $imaps->{mail}->{toself_color} || "#ff0000",
				"template"           => $template,
				"font"               => $imaps->{mail}->{font} || "on",
				"main_color"         => $imaps->{mail}->{main_color} || "none",
				"viewer_width"       => 800,
                                "viewer_height"      => 600,
                                "editor_width"       => $popup->{editor_window_width},
                                "editor_height"      => $popup->{editor_window_height},
                                "width_addr"         => $popup->{address_window_width},
                                "height_addr"        => $popup->{address_window_height},
				"auto_fix_consistency" => $imaps->{mail}->{auto_fix_consistency} || "off",
				"spellcheck"         => $spellcheck,
				"attachment_length"  => $imaps->{mail}->{attachment_length},
				"spellcheck_mode"    => $imaps->{mail}->{spellcheck_mode} eq '1'? 1 : 0,
				"upload_file_applet" => $upload_file_applet,
				"b_wrap"             => $imaps->{mail}->{b_wrap} || "off",
				"cap_size_unit"             => $imaps->{mail}->{cap_size_unit} || "KB",
				"forced_interruption" => $imaps->{custom}->{forced_interruption} || "off",
				"save_to_lib" 		  => ($imaps->{mail}->{save_to_lib} eq "off") ? 0 : 1
			};

			# 組織メール
			my ($tstp, $estp, $sme);

			$tstp = &convert_mailer(DA::OrgMail::ajxmailer_set_threepane_toppanel_js($session, $imaps)) if (DA::OrgMail::check_org_mail_permit($session));
			$estp = &convert_mailer(DA::OrgMail::ajxmailer_set_editor_toppanel_js($session, $imaps)) if (DA::OrgMail::check_org_mail_permit($session));
			$sme  = &convert_mailer(DA::OrgMail::ajxmailer_set_message_editor_js($session, $imaps)) if (DA::OrgMail::check_org_mail_permit($session));

			$tstp.= &convert_mailer(DA::Custom::ajxmailer_set_threepane_toppanel_js($session, $imaps));
			$estp.= &convert_mailer(DA::Custom::ajxmailer_set_editor_toppanel_js($session, $imaps));
            $sme .= &convert_mailer(DA::Custom::ajxmailer_set_message_editor_js($session, $imaps));

			my $vcho = &convert_mailer(DA::Custom::get_custom_mail_header_open4ajx($session, $imaps, $c));
			my $vchc = &convert_mailer(DA::Custom::get_custom_mail_header_close4ajx($session, $imaps, $c));
			my $echo = &convert_mailer(DA::Custom::get_custom_mail_header4ajx($session, $imaps, $c));
			my $echc = "";
			my $sqjs = &convert_mailer(DA::Custom::set_quota_js4ajx($session, $imaps));
			my $sfjs = &convert_mailer(DA::Custom::custom_mail_script4ajx($session));
			my $vstp = &convert_mailer(DA::Custom::ajxmailer_set_viwer_toppanel_js($session, $imaps));
			my $smv  = &convert_mailer(DA::Custom::ajxmailer_set_message_viewer_js($session, $imaps));
			my $smv2 = &convert_mailer(DA::Custom::ajxmailer_set_message_viewer_js2($session, $imaps));
			my $sme2 = &convert_mailer(DA::Custom::ajxmailer_set_message_editor_js2($session, $imaps));
			my $sppm = &convert_mailer(DA::Custom::ajxmailer_set_popup_menu($session, $imaps));
			my $sap  = &convert_mailer(DA::Custom::ajxmailer_set_address_proc($session, $imaps));
			my $saip = &convert_mailer(DA::Custom::ajxmailer_set_address_insert_proc($session, $imaps));
			my $sms  = &convert_mailer(DA::Custom::ajxmailer_set_search_js($session, $imaps));
			my $sms2 = &convert_mailer(DA::Custom::ajxmailer_set_search_js2($session, $imaps));
			$custom = {
				"threePane" => {
					"setQuota"     => $sqjs,
					"updateFolder" => $sfjs,
					"setTopPanel"  => $tstp,
					"setAddressInsertProc" => $saip
				},
				"viewer" => {
					"headerOpen"  => $vcho,
					"headerClose" => $vchc,
					"setTopPanel" => $vstp,
					"setMessageViewer" => $smv,
					"setMessageViewer2" => $smv2,
				},
				"editor" => {
					"headerOpen"  => $echo,
					"headerClose" => $echc,
					"setTopPanel" => $estp,
					"setMessageEditor" => $sme,
					"setMessageEditor2" => $sme2,
					"setAddressProc" => $sap,
				},
				"searcher" => {
					"setMessageSearcher" => "$sms",
					"setMessageSearcher2" => "$sms2"
				},
				"menu" => {
					"setPopupMenu" => $sppm,
				}
			};
			
			if ($c->{richtext} || $c->{html} =~ /^(index|searcher)$/) {
				my $lang = DA::IS::get_user_lang($session);
				$headRTE = &convert_mailer(DA::IS::get_rte_script($session, &external_charset(), 1));
				$initRTE =<<end_buf;
initRTE('$session->{img_rdir}/richText/','$DA::Vars::p->{js_rdir}/richText/','$DA::Vars::p->{css_rdir}/richText/', '', 'ajxmailer');
end_buf

				$writeRTE=<<end_buf;
writeRichText('message_body_html', '', '100%', 500, true, false, 'ja_JP', 'ajxmailer');
end_buf

			}
			if ($c->{search}) {
				if (my $folders = &storable_retrieve($session, "folders")) {
					$options = {
						"folder_tree" => &make_folders_tag($session, $imaps, $folders)
					};
				} else {
					&_warn($session, "make_folders_tag");
					$error = &error("NOT_READ_FOLDERS", 9);
				}
			}

			$hibiki = {
				"sales" => {
					"name" => &get_hibiki_name($session, "sales")
				}
			};
			$license = {};
			if (DA::IS::check_hibiki_license($session, "sales")
			&&  $DA::Vars::p->{hibiki}->{sales}->{email_upload_url} ne "") {
				$license->{hibiki_sales} = 1;
			} else {
				$license->{hibiki_sales} = 0;
			}
		} else {
			&_warn($session, "template_list");
			$error = &error("NOT_GET_TEMPLATE_LIST", 9);
		}
	} else {
		&_warn($session, "get_sys_custom");
		$error = &error("NOT_READ_GUIDE_CONFIG", 9);
	}


	my $rich_conf = DA::IS::get_sys_custom($session,"richtext");
	my $fckconfig;
	if($rich_conf->{editor} ne "crossbrowser"){
               $fckconfig = get_ajax_fckconfig($session, $imaps);
    }
	my $fcklang = DA::IS::get_user_lang($session);	
	my $new_mail = &convert_mailer(&new_mail_script4ajx($session));
	my $applet;
	if($session->{ua_class} eq 'IE6'){
		$applet="a8dropzone-2.2.10.jar";
	}else{
		$applet="a8dropzone-2.2.10.3.jar";
	}
	my $rich_type = ($rich_conf->{editor} =~ /(^crossbrowser|fckeditor)$/) ? $rich_conf->{editor} : 'fckeditor';
	my $result = ($error) ? $error : {
		"charset" => "UTF-8",
		"title"   => $title,
		"mid"     => $session->{user},
		"sessionKey" => $DA::Vars::p->{session_key},
		"jsRdir"  => "/js",
		"cssRdir" => "/css",
		"imgRdir" => $session->{img_rdir},
		"clrRdir" => $session->{img_rdir} . "/jslib/iseria/mailer/top_panel/$config->{main_color}",
		"cgiRdir" => $DA::Vars::p->{cgi_rdir},
		"appRdir" => "$DA::Vars::p->{iseria_rdir}/mailer",
		"appletRdir"    => "/applet",
		"appletFile"    => "$applet?" . DA::IS::get_uri_prefix(),
		"appletImage"   => "dd_back_mail.gif",
		"appletFiler"   => "0",
		"appletMaxFile" => "$imaps->{custom}->{dd_upload_max_file_num}",
		"appletMoreThanMaxMessage" => &convert_mailer(t_('一度にアップロードできるファイルは %1個までです。',$imaps->{custom}->{dd_upload_max_file_num} )),
		"appletLabel"   => &convert_mailer(t_("ファイルのドラッグ&ドロップエリア", $imaps->{custom}->{dd_upload_max_file_num})),
		"appletUploadMessage"   => &convert_mailer(t_("%1件のファイルをアップロードしました。", "_NUM_")),
		"appletDisabledMessage" => &convert_mailer(t_("JAVAが有効ではありません。")),
		"appletTipMessage" => &convert_mailer(t_("グレーのエリア内に、パソコン（デスクトップやUSBメモリー等を含む）にあるファイルをドラッグ&ドロップすることで、添付ファイルを追加することが出来ます。")),
		"folderType" => {
			"root"    => $TYPE_ROOT, 
			"server"  => $TYPE_SERVER,
			"inbox"   => $TYPE_INBOX,
			"draft"   => $TYPE_DRAFT,
			"sent"    => $TYPE_SENT,
			"trash"   => $TYPE_TRASH,
			"spam"    => $TYPE_SPAM,
			"default" => $TYPE_DEFAULT,
			"mailbox" => $TYPE_MAILBOX,
			"cabinet" => $TYPE_CABINET,
			"localServer"  => $TYPE_LOCAL_SERVER,
			"localFolder"  => $TYPE_LOCAL_FOLDER,
			"backupFolder" => $TYPE_BACKUP_FOLDER,
			"join"    => $TYPE_JOIN
		},
		"ugType" => {
			"addr"  => 0,
			"user"  => 1,
			"group" => 2,
			"bulk"  => 3,
			"ml"    => 4
		},
		"richText" => {
			"headRTE" => $headRTE,
			"type" => $rich_type,
			"fckconfig" => $fckconfig
		},
		"license" => $license,
		"hibiki"  => $hibiki,
		"system"  => $system,
		"config"  => $config,
		"options" => $options,
		"new_mail" => $new_mail,
		"check_key_url" => DA::IS::get_check_key_param('&'),
		"custom"  => $custom,
		"user_information_restriction" => DA::IS::get_sys_custom($session,"address")
	};

	&_logger($session, $imaps, $logger);

	# 組織メールのパラメータ設定を追加
	if (DA::OrgMail::check_org_mail_permit($session)) {
		DA::OrgMail::ajx_get_config($session, $imaps, $c, $result);
	}
	DA::Custom::ajx_get_config($session, $imaps, $c, $result);
	
	return($result);
}

sub get_mailer_title {
	my($session, $gid, $type) = @_;
	my $title = "";
	if ($gid >= 2000000){
		if ($type eq "index") {
			$title = &convert_mailer(t_("INSUITE 組織メーラ・").&get_org_mail_name_by_gid($session, $gid));
		} elsif ($type eq "viewer") {
			$title = &convert_mailer(t_("INSUITE 組織メーラ・").&get_org_mail_name_by_gid($session, $gid).t_(" メール詳細"));
		} elsif ($type eq "editor") {
			$title = &convert_mailer(t_("INSUITE 組織メーラ・").&get_org_mail_name_by_gid($session, $gid).t_(" メール作成"));
		} elsif ($type eq "searcher") {
			$title = &convert_mailer(t_("INSUITE 組織メーラ・").&get_org_mail_name_by_gid($session, $gid).t_(" 詳細検索"));
		}
	} else {
		if ($type eq "index") {
			$title = &convert_mailer(t_("INSUITE 統合メーラ"));
		} elsif ($type eq "viewer") {
			$title = &convert_mailer(t_("INSUITE 統合メーラ メール詳細"));
		} elsif ($type eq "editor") {
			$title = &convert_mailer(t_("INSUITE 統合メーラ メール作成"));
		} elsif ($type eq "searcher") {
			$title = &convert_mailer(t_("INSUITE 統合メーラ 詳細検索"));
		}
	}
	return $title;
}

sub get_org_mail_name_by_gid {
	my($session, $gid) = @_;
	my $group_table=DA::IS::get_group_table($session);
	my $g_sql="SELECT m.mail_name FROM $group_table g,is_org_mail_group m "
	 . "WHERE g.gid=m.gid AND g.gid=?";
	my $g_sth=$session->{dbh}->prepare($g_sql); 
	my $permit=DA::OrgMail::get_org_mail_permit($session,0);
	my $name;
	$g_sth->bind_param(1, int($gid), 3); $g_sth->execute();
	my ($group_name)=$g_sth->fetchrow;
	$name=DA::CGIdef::encode($group_name,1,1,'euc');
	$g_sth->finish;
	return $name;
}

sub backup_exists {
	my ($session) = @_;
	my $current_mail_gid = DA::OrgMail::get_gid($session);
	my $mapping_info_file = "$current_mail_gid".'.maid_mapping.dat';
	$mapping_info_file = &backup_mapping_file($session,$mapping_info_file);
	my $session_mid = $session->{user};
	my $result = 0; 
	if (-s $mapping_info_file) {
		if (my $fh = &open_file($session, $mapping_info_file, "r")) {
			while (my $l = <$fh>) {
	           chomp($l);
	           $result = 1;
	           last;
			}
			&close_file($session, $mapping_info_file, $fh);
		}else {
			&_warn($session, "open_file");
			$result = 0; 
		}

	}else {
		$result = 0;
	}
	return $result;
}

sub default_config($$$) {
	my ($session, $imaps, $c) = @_;
	my $logger = &_logger_init($session, 1);
	my $result = {};

	if ($c->{window_width} eq "") {
		return(&error("NO_INPUT_QUERY", 1, t_("ウィンドウの幅")));
	} elsif ($c->{window_height} eq "") {
		return(&error("NO_INPUT_QUERY", 1, t_("ウィンドウの高さ")));
	} elsif ($c->{list_column_width} eq "") {
		return(&error("NO_INPUT_QUERY", 1, t_("メール一覧項目の列幅")));
	} elsif ($c->{dir_width} eq "") {
		return(&error("NO_INPUT_QUERY", 1, t_("フォルダ一覧の幅")));
	} elsif ($c->{list_height} eq "") {
		return(&error("NO_INPUT_QUERY", 1, t_("メール一覧の高さ")));
	} elsif ($c->{detail_header_open} eq "") {
		return(&error("NO_INPUT_QUERY", 1, t_("メール詳細のヘッダ開閉状態")));
	}

	if (my $mail = &get_master($session, "ajxmailer")) {
		foreach my $key (qw(window_pos_x window_pos_y window_width window_height list_column_width dir_width list_height detail_header_open detail_header_to_open detail_header_cc_open detail_header_attachment_open)) {
			if ($key eq "list_column_width") {
				my @widths = split(/\|/, $c->{$key});
				foreach my $column (split(/\|/, $mail->{list_order})) {
					my $width = shift(@widths);
					if ($width eq "") {
						next;
					} else {
						if ($column =~ /^(attachment|seen|flagged|priority)$/) {
							$width = 30;
						}
						$mail->{"list_width_$column"} = $width;
					}
				}
			} else {
				$mail->{$key} = $c->{$key};
			}
		}

		unless (&save_master($session, $mail, "ajxmailer")) {
			return(&error("NOT_WRITE_MAIL_CONFIG", 9));
		}
	} else {
		return(&error("NOT_READ_MAIL_CONFIG", 9));
	}
	
	&_logger($session, $imaps, $logger);

	return($result);
}
 sub editor_config($$$) {
        my ($session, $imaps, $c) = @_;
        my $logger = &_logger_init($session, 1);
        my $result = {};
 
        if (my $mail = &get_master($session, "ajxmailer")) {
                foreach my $key (qw(
                        editor_window_width editor_window_height
                        address_window_width address_window_height
                )) {
                        if ($c->{$key}) {
                                $mail->{$key} = int($c->{$key});
                        }
                }
 
                if (&save_master($session, $mail, "ajxmailer")) {
                        &update_popup_size2session($session, $mail);
                } else {
                        return(&error("NOT_WRITE_MAIL_CONFIG", 9));
                }
        } else {
                return(&error("NOT_READ_MAIL_CONFIG", 9));
        }
 
        &_logger($session, $imaps, $logger);
 
        return($result);
 }


sub login($$$) {
	my ($session, $imaps, $c) = @_;
	my $result = 1;

	&isearch_cache_clear($session);

	$session->{ajxmailer_logined} = 1;
	$session->{org_mail_permit} = DA::OrgMail::get_org_mail_permit($session,1); # 組織メール権限を更新
	DA::Session::update($session);

	DA::Custom::ajxmailer_login($session, $imaps, $c);

	return($result);
}

sub logout($$;$) {
	my ($session, $imaps, $c) = @_;
	my $result = 1;

	$session->{ajxmailer_logined} = 0;
	DA::Session::update($session);

	DA::Custom::ajxmailer_logout($session, $imaps, $c);

	return($result);
}

sub lang_list($$) {
	my ($session, $imaps) = @_;
	my $list = DA::IS::get_lang_list($session);
	my @lang;

	foreach my $l (@{$list}) {
		my $lang = $l->{code};
		my $name = &convert_mailer($l->{language});
		push(@lang, { "lang" => $lang, "name" => $name });
	}

	return(\@lang);
}

sub title_list($$) {
	my ($session, $imaps) = @_;
	my $lang = &get_user_lang($session, $imaps);
	my $title_pos = $imaps->{address}->{ma_def_title_pos} || 0;
	my ($file, @title);

	if (&get_user_lang($session, $imaps) eq 'ja') {
		$file = "$DA::Vars::p->{custom_dir}/address_title.dat";
	} else {
		$file = "$DA::Vars::p->{custom_dir}/address_title_" . $lang . ".dat";
	}

	if (DA::Unicode::file_exist($file)) {
		if (my $fh = &open_file_utf($session, $file, "r")) {
			while(my $title = <$fh>) {
				$title =~s/\n+$//g;
				$title = &convert_mailer($title);
				push(@title, { "title" => $title, "title_pos" => $title_pos });
			}
			&close_file_utf($session, $file, $fh);
			return(\@title);
		} else {
			&_warn($session, "open_file_utf");
			return(undef);
		}
	} else {
		return(\@title);
	}
}

sub template_list($$) {
	my ($session, $imaps) = @_;
	my $join = DA::IS::get_join_group($session, $session->{user}, 1);
	my @template;

	DA::Session::trans_init($session);
	eval {
		# プライベート
		my $sql = "select temp_id,temp_name from is_template "
		        . "where gid=? order by temp_name";
		my $sth = _prepare($session, $sql);
		&_bind_param($sth, 1, $session->{user}, 3);

		$sth->execute();
		foreach my $l (@{&_fetchrow($sth)}) {
			my $tid  = $l->{temp_id};
			my $name = $l->{temp_name};
			push(@template, { "tid" => $tid, "name" => $name });
		}
		$sth->finish;

		# 所属グループ
		my $gid_in;
		my @ctl_gids; 
		foreach my $gid (keys %{$join}) {
			if ($join->{$gid}->{attr} !~ /^[12UW]$/) { next; }
			push(@ctl_gids,'?');
		}
		while (1) {
			if(!@ctl_gids){last;}
			my @list = splice(@ctl_gids,0,800); 
			$gid_in .= "OR t.gid in (". join(',', @list) . ") "; 
		}
		$gid_in=~s/^OR//;
		if ($gid_in) { $gid_in=" AND ($gid_in) "; }
		
		if ($DA::Vars::p->{POSTGRES}) {
			$sql = "select t.temp_id,t.temp_name,t.gid,t.target,g.name,"
			     . "g.alpha,g.type from is_template t left outer join "
			     . "@{[DA::IS::get_group_table($session)]} g on (t.gid=g.gid) "
			     . "$gid_in order by g.type,g.sort_level,g.kana,t.temp_name";
		} else {
			$sql = "select t.temp_id,t.temp_name,t.gid,t.target,g.name,"
			     . "g.alpha,g.type from is_template t,"
			     . "@{[DA::IS::get_group_table($session)]} g where t.gid=g.gid(+) "
			     . "$gid_in order by g.type,g.sort_level,g.kana,t.temp_name";
		}
		$sth = &_prepare($session, $sql);
		my $ix=0;
		foreach my $gid (keys %{$join}) {
			if ($join->{$gid}->{attr} !~ /^[12UW]$/) { next; }
			$sth->bind_param(++$ix,$gid,3);
		}

		$sth->execute();
		foreach my $l (@{&_fetchrow($sth)}) {
			my $temp_id   = $l->{temp_id};
			my $temp_name = $l->{temp_name};
			my $gid       = $l->{gid};
			my $target    = $l->{target};
			my $g_name    = $l->{name};
			my $g_alpha   = $l->{alpha};
			my $g_type    = $l->{type};
			if ($gid < $DA::Vars::p->{top_gid}) {
				next;
			}
			if ($target eq 1) {        # プライマリのみ
				if ($join->{$gid}->{attr} !~ /^[1]$/) { next; }
			} elsif ($target eq 2) {   # プライマリ＋セカンダリ
				if ($join->{$gid}->{attr} !~ /^[12]$/) { next; }
			} elsif ($target eq 3) {   # 下位組織に所属するユーザ
				if ($join->{$gid}->{attr} !~ /^[12UW]$/) { next; }
			}
			$g_name = DA::IS::check_view_name($session, $g_name, $g_alpha);
			$g_name = &convert_mailer(t_("【廃止】")) . $g_name if ($g_type eq "4");

			my $tid  = $temp_id;
			my $name = $temp_name . "[$g_name]";
			push(@template, { "tid" => $tid, "name" => $name });
		}
		$sth->finish;
	};
	if (DA::Session::exception($session)) {
		return(\@template);
	} else {
		&_warn($session, "template_list");
		return(undef);
	}
}

sub template_detail($$$) {
	my ($session, $imaps, $tid) = @_;
	my $template = {};

	if (my $detail = &_template($session, $imaps, $tid)) {
		if (my $address = &_template_address($session, $imaps, $tid)) {
			foreach my $field (qw(to cc bcc)) {
				$template->{"$field\_text"} = $detail->{$field};
				$template->{$field} = $address->{$field};
			}
			$template->{subject} = $detail->{subject};
			$template->{body}    = $detail->{body};
			$template->{tid}     = $tid;
		} else {
			&_warn($session, "_template_address");
			$template = undef;
		}
	} else {
		&_warn($session, "_template");
		$template = undef;
	}

	return($template);
}

sub sign_list($$) {
	my ($session, $imaps) = @_;
	my @sign;

	push(@sign, { "sid" => 1, "name" => &convert_mailer(t_("署名")) . "1" });
	push(@sign, { "sid" => 2, "name" => &convert_mailer(t_("署名")) . "2" });
	push(@sign, { "sid" => 0, "name" => &convert_mailer(t_("なし")) });

	return(\@sign);
}

sub sign_detail($$$) {
	my ($session, $imaps, $sid, $from) = @_;
	my $sign = {};

	my $detail = &_sign($session, $imaps, $sid, $from);
	if (defined $sign) {
		$sign->{sign}     = $detail;
		$sign->{sign_pos} = ($imaps->{mail}->{sign_act} eq "on") ? 1 : 0;
		if (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st1.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st1.txt")){
			$sign->{sign_pos1} = ($imaps->{mail}->{sign_act1} eq "on") ? 1 : 0;
		} else {
			$sign->{sign_pos1} = $sign->{sign_pos};
		}
		if (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st2.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st2.txt")){
			$sign->{sign_pos2} = ($imaps->{mail}->{sign_act2} eq "on") ? 1 : 0;
		} else {
			$sign->{sign_pos2} = $sign->{sign_pos};
		}
		if (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_mb.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_mb.txt")){
			$sign->{sign_posM} = ($imaps->{mail}->{sign_actM} eq "on") ? 1 : 0; 
		} else {
			$sign->{sign_posM} = $sign->{sign_pos};
		}
		$sign->{sid}      = $sid;
		$sign->{from}     = $from;
	} else {
		&_warn($session, "_sign");
		$sign = undef;
	}

	return($sign);
}

sub check_filter($;$;$;$) {
	my ($session, $match, $folder, $mid) = @_;

	if (my $filter = &get_filter($session,$mid)) {
		foreach my $f (@{$filter}) {
			if ($match) {
				if ($f->{proc} eq "move") {
					$f->{move_path} =~s/^\Q$match\E(\#|$)/$folder$1/g;
				}
			} else {
				if ($f->{proc} eq "move") {
					$f->{move_path} = undef;
				}
			}
		}
		if (&save_filter($session, $filter, $mid)) {
			return(1);
		} else {
			&_warn($session, "save_filter");
			return(undef);
		}
	} else {
		&_warn($session, "get_filter");
		return(undef);
	}
}

sub check_imap_info($$$) {
	my ($session, $imaps, $key) = @_;
	my $logger    = &_logger_init($session, 1);
	my $imap_type = $imaps->{imap}->{imap_type};
	my $data   = $DA::Vars::p->{imap_info}->{$imap_type}->{data};
	my $result = ($data =~ /(?:^|\|)(\Q$key\E)(?:\||$)/) ? 1 : 0;

	&_logger($session, $imaps, $logger);

	return($result);
}

sub check_imap_config($$$;$) {
	my ($session, $imaps, $new, $noupdate) = @_;
	my $default = DA::IS::get_master($session, "imap", 1);
	my $system  = $imaps->{system};
	my $warn;

	my $hostname;
	if ($DA::IsLicense::op->{mailgw} && $new->{pop} eq 'yes') {
		$hostname = t_('Mail Gateway サーバ');
	} else {
		$hostname = t_('受信メールサーバ(IMAP)');
	}

	my $keyname = {
		"host"       => $hostname,
		"name"       => t_("ルートフォルダ名"),
		"user"       => t_("アカウント名"),
		"pass"       => t_("パスワード"),
		"port"       => t_("IMAP ポート番号"),
		"sent"       => t_("送信済みのフォルダ"),
		"draft"      => t_("送信待ちのフォルダ"),
		"trash"      => t_("ごみ箱のフォルダ"),
		"spam"       => t_("スパムフォルダ"),
		"inbox_view" => t_("受信箱のフォルダ"),
		"sent_view"  => t_("送信済みのフォルダ"),
		"draft_view" => t_("送信待ちのフォルダ"),
		"trash_view" => t_("ごみ箱のフォルダ"),
		"spam_view"  => t_("スパムフォルダ"),
		"pop_host"   => t_("受信メールサーバ(POP)"),
		"pop_port"   => t_("POP ポート番号"),
		"smtp_user"  => t_("認証ID(SMTP-AUTH)"),
		"smtp_pass"  => t_("パスワード(SMTP-AUTH)")
	};

	# アカウント情報のセット
	if ($new->{imap_account} eq lc($DA::Vars::p->{package_name})
	||  $DA::Vars::p->{imap_account} eq lc($DA::Vars::p->{package_name})) {
		$new->{imap_account} = lc($DA::Vars::p->{package_name});
		$new->{user} = $session->{user_id};
		$new->{pass} = $session->get_passwd();
	}

	# internal_charset -> mailer_charset
	foreach my $key (keys %{$new}) {
		$new->{$key} = &convert_mailer($new->{$key});
	}

	# Sent, Draft, Trash Set
	$new->{view} = "on";
	foreach my $key (qw(sent draft trash)) {
		$new->{$key} = $imaps->{imap}->{$key};
	}

	# Spam
	if ($new->{spam} eq "" && $new->{spam_view} ne "") {
		$new->{spam} = $new->{spam_view};
	}

	# 未入力チェック
	foreach my $key (qw(host user pass port name sent draft trash inbox_view sent_view draft_view trash_view smtp_user smtp_pass)) {
		if ($new->{smtp_account} ne "account" && $key =~ /^(?:smtp_user|smtp_pass)$/) {
			next;
		}
		if ($new->{$key} eq "") {
			return(t_("%1を入力してください。", $keyname->{$key}), $warn);
		}
	}

	# Trash 変更不可
	if (&check_imap_info($session, $imaps, "trash")) {
		if ($new->{trash} ne "Trash") {
			$new->{trash} = "Trash";
			$warn = t_("ただし、御使用のサーバではごみ箱フォルダは変更できません。");
		}
	}

	# 表示名チェック
	my $duplicate = {};
	foreach my $key (qw(inbox_view sent_view draft_view trash_view spam_view)) {
		if ($new->{$key} ne "") {
			my $utf7 = &_utf7_encode($session, $imaps, $new->{$key});
			if (&check_folder_name($session, $imaps, $new->{$key}, 1)) {
				my $error = t_("%1に使用できない文字が含まれています。", $keyname->{$key});
				return($error, $warn);
			}

			if (&mailer_charset() eq "UTF-8") {
				if (&jlength($new->{$key}) > 100) {
					my $error = t_("%1は%2文字以内で入力してください。", $keyname->{$key}, 100);
					return($error, $warn);
				}
			} else {
				if (length($utf7) > 100) {
					my $error = t_("%1は全角%2文字 (半角英数字%3文字) 以内で入力してください。", $keyname->{$key}, 100, 50);
					return($error, $warn);
				}
			}

			if ($duplicate->{$new->{$key}}) {
				return (t_("%1はそれぞれ固有な名前にしてください。", $keyname->{$key}), $warn);
			} else {
				$duplicate->{$new->{$key}} = 1;
			}

			if ($new->{$key} =~ /^inbox$/i && $key ne "inbox_view") {
				return(t_("%1にINBOXは指定できません。", $keyname->{$key}), $warn);
			}
		}
	}

	# Name Check
	my $root = &_root($session, $imaps);
	if ($new->{name} eq $root->{name}) {
		return(t_("%1というフォルダ名は使用できません。", $new->{name}), $warn);
	}
	if (&check_folder_name($session, $imaps, $new->{name}, 1)) {
		my $error = t_("%1に使用できない文字が含まれています。", $keyname->{name});
		return($error, $warn);
	}

	# Host IP Check
	if (DA::CGIdef::iskanji($new->{host}, &mailer_charset())) {
		return(t_("%1に使用できない文字が指定されています。", $hostname), $warn);
	}

	# Port Check
	if ($new->{port} ne "") {
		unless ($new->{port} =~ /^\d+$/) {
			return(t_("IMAP ポート番号には数字以外指定できません。"), $warn);
		}
	}

	# Limit Check
	if ($new->{limit} eq "") {
		if ($default->{limit} eq "") {
			$new->{limit} = "80";
		} else {
			$new->{limit} = $default->{limit};
		}
	} else {
		$new->{limit} =~ s/^0+//g;

		unless ($new->{limit} =~ /^\d+$/) {
			return(t_("メール保存領域の警戒値には数字以外指定できません。"), $warn);
		}

		if ($new->{limit} < 0 || $new->{limit} > 100) {
			return(t_("メール保存領域の警戒値には[0-100]の値を指定してください。"), $warn);
		}
	}

	# User Check
	my $user_rule = q{^[a-zA-Z0-9\-\_\=\,\.][a-zA-Z0-9\-\_\=\,\.\~]*$};
	my $dotmap    = $system->{mailgw_dotmap};
	$new->{user}  =~s/(^\s+|\s+$)//g;
	if ($new->{pop} eq 'yes') {
		if ($dotmap eq '') {
			if ($new->{user} =~ /\./) {
				return(t_("アカウント名に使用できない文字が指定されています。") . " ( . )", $warn);
			}
		} else {
			if ($new->{user} =~ /\Q$dotmap\E/) {
				return(t_("アカウント名に使用できない文字が指定されています。") . " ( $dotmap )", $warn);
			}
		}
		if (length ($new->{user}) >= 490) {
			return(t_("アカウント名が長すぎます。半角490文字未満で入力して下さい。"), $warn);
		}
	}

	# Psss Check
	if ($new->{pass} =~ /\|/ || DA::CGIdef::iskanji($new->{pass}, &mailer_charset())) {
		return(t_("パスワードに使用できない文字が指定されています。"), $warn);
	}

	if ($new->{smtp_account} eq "account") {
		$new->{smtp_user} =~ s/(^\s+|\s+$)//g;

		if (length ($new->{smtp_user}) >= 490) {
			return(t_("認証ID(SMTP-AUTH)が長すぎます。半角490文字未満で入力して下さい。"), $warn);
		}
		if ($new->{smtp_pass} =~ /\|/ || DA::CGIdef::iskanji($new->{smtp_pass}, &mailer_charset())) {
			return(t_("パスワード(SMTP-AUTH)に使用できない文字が指定されています。"), $warn);
		}
	}

	# POP Check
	my $user = undef;
	if ($DA::IsLicense::op->{mailgw}) {
		if ($new->{pop} eq 'yes') {
			foreach my $key (qw(pop_host pop_port)) {
				if ($new->{$key} eq "") {
					return(t_("%1を入力してください。", $keyname->{$key}), $warn);
				}
			}

			if (DA::CGIdef::iskanji($new->{pop_host}, &mailer_charset())) {
				return(t_("%1に使用できない文字が指定されています。", $keyname->{pop_host}), $warn);
			}

			if ($new->{pop_port} ne "") {
				unless ($new->{pop_port} =~/^\d+$/) {
					return(t_("POP ポート番号には数字以外指定できません。"), $warn);
				}
			}
		}
	}

	my $old = {};
	%{$old} = ref($imaps->{imap}) eq 'HASH' ? %{$imaps->{imap}} : ();

	$imaps->{imap} = $new;

	my $new_imaps = &connect($session, { "noupdate" => 1, "pop" => 1 }, $imaps);
	my $connected;
	if ($new_imaps->{error}) {
		$warn = t_("ただし、現在の設定でメールサーバに接続できませんでした。");
	} else {
		# 古いコンフィグレーションの取得
		my @fitems = qw(
			sent draft trash spam
			inbox_view sent_view draft_view trash_view spam_view
		);
		my (%old_folder, %new_folder);

		$new_folder{inbox} = "INBOX";
		foreach my $key (qw(sent draft trash spam)) {
			if ($new->{$key} ne "") {
				if (&check_imap_info($session, $imaps, "create_server")) {
					$old_folder{$key} = &_utf7_encode($session, $imaps, $old->{$key});
					$new_folder{$key} = &_utf7_encode($session, $imaps, $new->{$key});
				} else {
					$old_folder{$key} = "INBOX" . $old->{separator}
					                  . &_utf7_encode($session, $imaps, $old->{$key});
					$new_folder{$key} = "INBOX" . $new->{separator}
					                  . &_utf7_encode($session, $imaps, $new->{$key});
				}
			}
		}

		foreach my $key (qw(inbox_view sent_view draft_view trash_view spam_view)) {
			if ($new->{$key} ne "") {
				if (&check_imap_info($session, $imaps, "create_server")) {
					$old_folder{$key} = &_utf7_encode($session, $imaps, $old->{$key});
					$new_folder{$key} = &_utf7_encode($session, $imaps, $new->{$key});
				} else {
					$old_folder{$key} = "INBOX" . $old->{separator}
					                  . &_utf7_encode($session, $imaps, $old->{$key});
					$new_folder{$key} = "INBOX" . $new->{separator}
					                  . &_utf7_encode($session, $imaps, $new->{$key});
				}
			}
		}

		# 特殊フォルダの重複チェック
		my $list = {
			"sent"  => [qw(draft trash spam)],
			"draft" => [qw(sent trash spam)],
			"trash" => [qw(sent draft spam)],
			"spam"  => [qw(sent draft trash)]
		};
		foreach my $n (keys %{$list}) {
			foreach my $o (@{$list->{$n}}) {
				if ($new->{$n} eq $old->{$o}) {
					return(t_("%1に指定されたフォルダ名は、以前の%2と重複する為、処理を中断します。", $keyname->{$n}, $keyname->{$o}), $warn);
				}
			}
		}

		# フォルダ表示名の重複チェック
		foreach my $key (qw(inbox sent draft trash spam)) {
			if ($new_folder{$key . "_view"} eq "") {
				next;
			} else {
				if ($new_folder{sent}  ne $new_folder{"$key\_view"}
				&&  $new_folder{draft} ne $new_folder{"$key\_view"}
				&&  $new_folder{trash} ne $new_folder{"$key\_view"}
				&&  $new_folder{spam}  ne $new_folder{"$key\_view"} 
				&&  $new_folder{$key}  ne $new_folder{"$key\_view"}
				&&	&_exists($session, $imaps, $new_folder{"$key\_view"})) {
					return(t_("%1のフォルダに指定されたフォルダ名は既に存在します。", $keyname->{"$key\_view"}), $warn);
				}
			}
		}

		# フォルダ名の変更
		foreach my $key (qw(sent draft trash spam)) {
			my $result;
			my $o = $old_folder{$key};
			my $n = $new_folder{$key};

			if ($n eq "") {
				next;
			} elsif (&_exists($session, $imaps, $n)) {
				next;
			} else {
				unless (&_create($session, $imaps, $n)) {
					return(t_("%1のフォルダが作成できませんでした。", $keyname->{$key}), $warn);
				}
			}
		}

		$connected = 1;
	}

	# $noupdate が設定されていない場合はチェックのみ
	if (!$noupdate) {
		# サーバ変更チェック
		my $server_updated;
		foreach my $key (qw(host user port)) {
			if ($old->{$key} ne $new->{$key}) {
				$server_updated = 1; last;
			}
		}
		if ($server_updated) {
			# テンポラリデータの削除
			unless (&_clear_old_cache($session, $old)) {
				return(t_("一時ファイルが削除できませんでした。"), $warn);
			}
			# フィルタのチェック
			unless (&check_filter($session,undef,undef,$session->{user})) {
				return(t_("フィルタ設定の書き込みに失敗しました。"), $warn);
			}
		}
		unless (&save_master($session, $new, "imap")) {
			return(t_("メールサーバの設定が変更できませんでした。"), $warn);
		}
	} else {
    	# 組織メールの場合だけここを実行します
    	$new->{imap_type}=$new_imaps->{imap}->{imap_type};
    	$new->{separator}=$new_imaps->{imap}->{separator};
    }

	# mailer_charset -> internal_charset
	foreach my $key (keys %{$new}) {
		$new->{$key} = &convert_internal($new->{$key});
	}

	return (undef, $warn);
}

sub check_folder_name {
	my ($session, $imaps, $value, $opt) = @_;
	my $match = q{(?:[\"\/\.\#\\\\])};

	if ($value =~ /$match/) {
		return(1);
	} elsif (!$opt && $imaps->{imap}->{separator} ne "" && $value =~ /\Q$imaps->{imap}->{separator}\E/) {
		return(1);
	} else {
		return(0);
	}
}

sub check_level3_sjis($) {
	my ($str) = @_;

	my $ascii = '[\x00-\x7f\xa1-\xdf]';
	my $two   = '[\x81-\x9f\xe0-\xef][\x40-\x7e\x80-\xfc]';
	my $three = '[\xf0-\xfc][\x40-\xfc]';

	my $result = 1 if ($str =~/^(?:$ascii|$two)*?(?:$three)/);

	return($result);
}

sub compare_euc($$;$) {
	my ($target, $word, $opt)   = @_;
	my $ascii = $CHAR_CODE->{EUC}->{ASCII};
	my $two   = $CHAR_CODE->{EUC}->{TWO};
	my $three = $CHAR_CODE->{EUC}->{THREE};
	my $result;

	if (&mailer_charset() ne "EUC-JP") {
		$target = DA::Charset::convert(\$target, &mailer_charset(), "EUC-JP");
		$word   = DA::Charset::convert(\$word, &mailer_charset(), "EUC-JP");
	}

	if ($opt) {
		$result = 1 if ($target =~ /^(?:$ascii|$two|$three)*?(?:\Q$word\E)/);
	} else {
		$result = 1 if ($target =~ /^(?:$ascii|$two|$three)*?(?:\Q$word\E)/i);
	}

	return($result);
}

sub update_folder_name($$$$$$) {
	my ($session, $imaps, $src, $src_uidval, $dst, $dst_uidval) = @_;

	my $c = {
		"folder"	=> $src,
		"uidval"	=> $src_uidval,
		"set"		=> [
			{ "column" => "folder_name", "value" => $dst },
			{ "column" => "uidvalidity", "value" => $dst_uidval }
		]
	};

	if (&_update_header($session, $imaps, $c)) {
		if (&_update_folder($session, $imaps, $c)) {
			return(1);
		} else {
			&_warn($session, "_update_folder");
			return(0);
		}
	} else {
		&_warn($session, "_update_header");
		return(0);
	}
}

sub get_name_form($;$;$;$) {
	my ($value, $opt, $charset,$no_escape) = @_;
	my ($name, $addr);
	my $match = ($DA::Vars::p->{notes_mail}->{connect} eq 'on') ?
					$MATCH_RULE->{NOTES_MAIL} : $MATCH_RULE->{EMAIL};

	if ($value =~ /^(?:"(.*?[^\\])"|([^\,]+))\s*\<\s*($match)\s*\>/) {
		($name, $addr) = ($1||$2, $3);
		$name = DA::Mailer::decode_header_field($name, 1, 1, $charset);
		if (DA::CGIdef::iskanji($name, &mailer_charset())) {
			$name = DA::Mailer::unescape_mail_name($name) unless ($no_escape);
		} else {
			$name = DA::Mailer::unescape_mail_name($name);
		}		
	} elsif ($value =~ /\s*<\s*($match)\s*>/) {
		($name, $addr) = ($1, $1);
	} elsif ($value =~ /\s*($match)/) {
		($name, $addr) = ($1, $1);
	} else {
		($name, $addr) = ($value, undef);
		$name = DA::Mailer::decode_header_field($name, 1, 1, $charset);
		if (DA::CGIdef::iskanji($name, &mailer_charset())) {
			$name = DA::Mailer::unescape_mail_name($name) unless ($no_escape);
		} else {
			$name = DA::Mailer::unescape_mail_name($name);
		}
	}

	if ($opt) {
		return($addr, $name);
	} else {
		return($name || $addr);
	}
}

sub get_priority($) {
	my ($prioritys) = @_;
	my $priority;

	foreach my $p (@{$prioritys}) {
		if (lc($p) eq 'high') {
			$priority = 1; last;
		} elsif (lc($p) eq 'normal') {
			$priority = 3; last;
		} elsif (lc($p) eq 'low') {
			$priority = 5; last;
		} elsif ($p =~ /^([12])$/) {
			$priority = 1; last;
		} elsif ($p =~ /^([3])$/) {
			$priority = 3; last;
		} elsif ($p =~ /^([45])$/) {
			$priority = 5; last;
		}
	}

	return($priority || 3);
}

sub get_msmail_priority($) {
	my ($prioritys) = @_;
	my $priority;

	foreach my $p (@{$prioritys}) {
		if ($p eq 1) {
			$priority = "High"; last;
		} elsif ($p eq 2) {
			$priority = "Hign"; last;
		} elsif ($p eq 3) {
			$priority = "Normal"; last;
		} elsif ($p eq 4) {
			$priority = "Low"; last;
		} elsif ($p eq 5) {
			$priority = "Low"; last;
		}
	}

	return($priority || "Normal");
}

sub get_card($$$$;$;$;$;$;$;$) {
	my ($session, $imaps, $id, $type, $name, $email, $title, $title_pos, $lang, $external) = @_;
	my ($link, $tid, $ttype, $utype, $otype, $stype, $clang);

	if ($id eq "" || $type eq "") {
		$tid   = "";
		$ttype = "";
	} else {
		if ($type eq 0) {
			my ($aid, $addr) = split(/\-/, $id, 2);
			$tid   = $id;
			$ttype = $type;
			$stype = "AD";
			$link  = "javascript:DA.ug.openAddrInfo('$aid\-$addr');";
			$clang = $lang || &get_user_lang($session, $imaps);
		} elsif ($type eq 1) {
			if ($imaps->{system}->{internal_send_name} eq 'user') {
            	my $v_name = DA::IS::get_ug_name($session, 1, $id);
				$utype = $v_name->{type};
				if ($v_name->{type}) { $name = &convert_mailer($v_name->{simple_name}); }
			} else {
				my $dbo = DA::DBO::Member->new(
					mid    => $id,
					column => ['type'],
					dbh    => $session->{dbh}
				);
				$utype = $dbo->value('type');
			}
			$tid   = $id;
			$ttype = $type;
			$stype = $utype;
			$link  = "javascript:DA.ug.openUserInfo('$id');";
			$clang = $lang || &get_user_lang($session, $imaps);
		} elsif ($type eq 2) {
			my ($gid, $glang) = &_parse_gid($id);
			if ($gid) {
				my $ut_tbl = {
					"G"  => 1,
					"P"  => 2,
					"W"  => 2,
					"T"  => 3,
					"S1" => 4,
					"S2" => 4,
					"S3" => 4
				};
				my $ot_tbl = {
					"G"  => '',
					"P"  => '',
					"W"  => '',
					"T"  => '',
					"S1" => 1,
					"S2" => 2,
					"S3" => 3
				};

				DA::IS::set_temp_lang($session, $glang);

				my $v_name = DA::IS::get_ug_name(
					$session, 1, $gid, undef, undef,
					undef, undef, undef, undef, { "lang" => $glang }
				);

				DA::IS::clear_temp_lang($session);

				if ($v_name->{type} =~ /^(G|P|W|T|S1|S2|S3)/) {
					my $v_type = $1;

					$tid   = $gid;
					$ttype = $type;
					$utype = $ut_tbl->{$v_type};
					$otype = $ot_tbl->{$v_type};
					$stype = $v_type;
					$link  = "javascript:DA.ug.openGroupInfo('$gid');";
					$name  = &convert_mailer($v_name->{simple_name});
					$clang = $glang;
				} else {
					return(undef);
				}
			} else {
				return(undef);
			}
		} elsif ($type eq 3) {
			$tid   = $id;
			$ttype = $type;
			$stype = "BK";
			$link  = "javascript:DA.ug.openBulkInfo('$id');";
			$clang = $lang || &get_user_lang($session, $imaps);
		} elsif ($type eq 4) {
			$tid   = $id;
			$ttype = $type;
			$stype = "ML";
			$link  = "javascript:DA.ug.openMLInfo('$id');";
			$clang = $lang || &get_user_lang($session, $imaps);
		} else {
			$tid   = "";
			$ttype = "";
		}
	}

	my ($icon, $alt);
	if ($utype eq '3' && $tid !~ /^\d+$/) {
		$icon = "$session->{img_rdir}/ico_fc_executiveorg.gif";
		$alt  = &convert_mailer($DA::Vars::p->{title}->{title} . t_("複合条件"));
	} else {
		($icon, $alt) = DA::Address::_get_icon($utype, $ttype, $otype);
		if ($type eq 1 && !$icon) {
			($icon, $alt) = DA::Address::_get_icon(0, 0);
		}
		$icon = &convert_mailer($icon);
		$alt  = &convert_mailer($alt);
	}

	my %card = (
		"id"        => $tid,
		"type"      => $ttype,
		"stype"     => $stype,
		"link"      => $link,
		"icon"      => "$session->{img_rdir}\/$icon",
		"alt"       => $alt,
		"name"      => $name,
		"email"     => $email,
		"title"     => $title,
		"title_pos" => $title_pos,
		"lang"      => $clang,
		"external"  => ($external) ? 1 : 0,
		"regist"    => ($email) ?
		               "javascript:DA.ug.openAddrRegist('"
		            .  unpack("H*", $name)
		            . "', '"
		            .  unpack("H*", $email)
		            . "');" : ""
	);

	return(\%card);
}

sub get_hibiki_name($$) {
	my ($session, $type) = @_;

	return (&convert_mailer(DA::IS::get_hibiki_name($session, $type)));
}

sub get_user_lang($$) {
	my ($session, $imaps) = @_;

	return(DA::IS::get_user_lang($session));
}

sub get_user_name($$;$) {
	my ($session, $imaps, $type) = @_;
	my $custom = &convert_internal($imaps->{custom});
	my $mail   = &convert_internal($imaps->{mail});
	return(&convert_mailer(DA::Mailer::get_user_name($session, $custom, $mail, $type)));
}

sub get_user_sign_init_p($$) {
	my ($session, $imaps) = @_;
	my $mail   = &convert_internal($imaps->{mail});
	my $sid;
        if (DA::SmartPhone::isSmartPhoneUsed()) {
                $sid = 0;
         } else {
		if ($mail->{sign_init_p} eq "mobile") {
			$sid = 2;
		} elsif ($mail->{sign_init_p} eq "normal") {
			$sid = 1;
		} else {
			$sid = 0;
		}
        }
	return($sid);
}
sub get_user_sign_init_p1($$) {
	my ($session, $imaps) = @_;
	my $mail   = &convert_internal($imaps->{mail});
	my $sid;
        if (DA::SmartPhone::isSmartPhoneUsed()) {
		$sid = 0;
         } else {
		if ($mail->{sign_init_p1} eq "mobile") {
			$sid = 2;
		} elsif ($mail->{sign_init_p1} eq "normal") {
			$sid = 1;
		} else {
			$sid = 0;
		}
        }
	return($sid);
}
sub get_user_sign_init_p2($$) {
	my ($session, $imaps) = @_;
	my $mail   = &convert_internal($imaps->{mail});
	my $sid;
        if (DA::SmartPhone::isSmartPhoneUsed()) {
                $sid = 0;
         } else {
		if ($mail->{sign_init_p2} eq "mobile") {
			$sid = 2;
		} elsif ($mail->{sign_init_p2} eq "normal") {
			$sid = 1;
		} else {
			$sid = 0;
		}
         }
	return($sid);
}
sub get_user_sign_init_pM($$) {
	my ($session, $imaps) = @_;
	my $mail   = &convert_internal($imaps->{mail});
	my $sid;
        if (DA::SmartPhone::isSmartPhoneUsed()) {
                $sid = 0;
         } else {
		if ($mail->{sign_init_pM} eq "mobile") {
			$sid = 2;
		} elsif ($mail->{sign_init_pM} eq "normal") {
			$sid = 1;
		} else {
			$sid = 0;
		}
	}
	return($sid);
}

sub get_user_address($$;$) {
	my ($session, $imaps, $type) = @_;

	return(DA::Mailer::get_user_address($session, $type));
}

sub get_user_addresses($$) {
	my ($session, $imaps) = @_;

	return(DA::Mailer::get_user_addresses($session));
}

sub get_timezone($$) {
	my ($session, $imaps) = @_;
	my $system = &convert_internal($imaps->{system});

	return(DA::Mailer::get_timezone($session, $system));
}

sub get_time_style($$) {
	my ($session, $imaps) = @_;

	return(DA::Mailer::get_time_style($session));
}

sub get_tz_view($$) {
	my ($session, $imaps) = @_;

	return(DA::Mailer::get_tz_view($session));
}

sub get_timzone($$) {
	my ($session, $imaps) = @_;
	my $system = &convert_internal($imaps->{system});

	return(DA::Mailer::get_timezone($session, $system));
}

sub get_group_id($$$$) {
	my ($session, $imaps, $g_name, $langs) = @_;

	return(DA::Mailer::get_group_id($session, &convert_internal($g_name), $langs));
}

sub get_group_info($$$;$;$;$) {
	my ($session, $imaps, $gid, $delim, $opt, $mobile) = @_;

	return(&convert_mailer(DA::Mailer::get_group_info($session, $gid, $delim, $opt, $mobile)));
}

sub get_group_alias {
	return(DA::Mailer::get_group_alias(@_));
}

sub get_match_rule {
	return(DA::Mailer::get_match_rule(@_));
}

sub get_maildate {
	return(DA::Mailer::get_maildate(@_));
}

sub format_date {
	return(&convert_mailer(DA::Mailer::format_date(@_)));
}

sub send_command {
	return(&convert_mailer(DA::Mailer::send_mail_command(@_)));
}

sub get_filename {
	my ($path_name, $mode) = @_;
	return(@{&convert_mailer([DA::CGIdef::get_filename(&convert_internal($path_name), $mode)])});
}

sub file_upload {
	my ($session, $upload, $create_file, $type, $code, $app, $style) = @_;
	return(@{&convert_mailer([DA::CGIdef::file_upload($session, $upload, $create_file, $type, $code, $app, $style)])});
}

sub get_download_head {
	my ($filename) = @_;
	return(DA::IS::get_download_head(&convert_internal($filename)));
}

sub omit_filename {
	my ($session, $filename, $length) = @_;

	if ($filename =~ /([^\\]+)$/) {
		$filename = $1;
	}
	if ($length) {
		$filename = DA::Charset::sub_str($filename, &mailer_charset(), 0, $length);
	}

	return($filename);
}

sub get_popup_size {
	return(&convert_mailer(DA::IS::get_popup_size(@_)));
}

sub get_popup_size_from_session($;$) {
	my ($session, $mail) = @_;

	if (!$session->{ajxmailer_editor_width} || !$session->{ajxmailer_editor_height}
	||  !$session->{ajxmailer_address_width} || !$session->{ajxmailer_address_height}) {
		my $popup = &get_popup_size($session);
		unless ($mail) {
			$mail = &get_master($session, "ajxmailer");
		}

		$session->{ajxmailer_editor_width}   = $mail->{editor_window_width} || 800;
		$session->{ajxmailer_editor_height}  = $mail->{editor_window_height} || 600;
		$session->{ajxmailer_address_width}  = $mail->{address_window_width} || 800;
		$session->{ajxmailer_address_height} = $mail->{address_window_height} || $popup->{height_addr};
		DA::Session::update($session);
	}

	return({
		editor_window_width   => $session->{ajxmailer_editor_width},
		editor_window_height  => $session->{ajxmailer_editor_height},
		address_window_width  => $session->{ajxmailer_address_width},
		address_window_height => $session->{ajxmailer_address_height}
	});
 }

sub update_popup_size2session($$) {
	my ($session, $mail) = @_;

	if ($session->{ajxmailer_editor_width} ne $mail->{editor_window_width}
	||  $session->{ajxmailer_editor_height} ne $mail->{editor_window_height}
	||  $session->{ajxmailer_address_width} ne $mail->{address_window_width}
	||  $session->{ajxmailer_address_height} ne $mail->{address_window_height}) {
		$session->{ajxmailer_editor_width}   = $mail->{editor_window_width};
		$session->{ajxmailer_editor_height}  = $mail->{editor_window_height};
		$session->{ajxmailer_address_width}  = $mail->{address_window_width};
		$session->{ajxmailer_address_height} = $mail->{address_window_height};
		DA::Session::update($session);
	}

	return(1);
 }


### INTERNAL CHARSET ###

sub errorpage {
	my ($session, $mes, $mode) = @_;

	DA::CGIdef::errorpage($session, &convert_internal($mes), $mode);
}

sub get_config_param($$$) {
	my ($session, $custom, $select) = @_;
	my $param = {};
	my $title = t_("メールアドレス") . " : " . DA::CGIdef::encode($session->{email}, 0, 1, 'euc');
	my $img = "func_title_emlset.gif";
	my $page_title = t_('電子メール環境設定');

	my $tabs = {
		"names" => {
			"menu_action"   => t_("動作設定"),
			"menu_sent"     => t_("送信設定"),
			"menu_sign"     => t_("署名"),
			"menu_template" => t_("テンプレート"),
			"menu_view"     => t_("表示設定"),
			"menu_list"     => t_("一覧表示項目設定"),
			"menu_sv"       => t_("メールサーバ設定"),
			"menu_new_mail"	=> t_("新着メール設定")
		},
		"hrefs" => {
			"menu_action"   => "ma_ajx_config.cgi",
			"menu_sent"     => "ma_ajx_config_sent.cgi",
			"menu_sign"     => "ma_ajx_config_sign.cgi",
			"menu_template" => "ma_config_template.cgi",
			"menu_view"     => "ma_ajx_config_view.cgi",
			"menu_list"     => "ma_ajx_config_list.cgi",
			"menu_sv"       => "ma_ajx_config_sv.cgi",
			"menu_new_mail"	=> "new_mail_config.cgi"
		}
	};
	my @items = qw (
		menu_action menu_sent menu_view menu_list
		menu_sign menu_template menu_sv menu_new_mail
	);

	foreach my $i (@items) {
		$param->{tabs} ++;
		$param->{"tab_name$param->{tabs}"} = "&nbsp;&nbsp;"
		                                   . $tabs->{names}->{$i}
		                                   . "&nbsp;&nbsp;";
		$param->{"tab_href$param->{tabs}"} = "$DA::Vars::p->{cgi_rdir}/"
		                                   . $tabs->{hrefs}->{$i} . "?time=" . time;
		if ($i eq $select) {
			$param->{tab_on} = $param->{tabs};
		}
		if ($i eq "menu_template"){
			$param->{"tab_href$param->{tabs}"}.="&mailer_style=".$session->{mailer_style};
		}
	}
	$param->{page_title} = DA::CGIdef::get_page_title($session, $img, $title, '', 'on', $page_title);

	#===========================================
	#     Custom
	#===========================================
	DA::Custom::put_mail_config_tab($session, $param, $select);
	#===========================================

	my $module	= ($DA::Vars::p->{package_name} eq 'INSUITE') ?
				DA::IS::get_module($session) : $session->{module};
	if(!($module->{mail} eq 'on')){
		if ($select !~ /^(menu_sent)$/) {
			$param->{error}	= t_("%1は変更できません。", $tabs->{names}->{$select});
			DA::IS::conf_error_msg($session, $param, 1);
		}
	}

	if ($custom->{$select} eq "off") {
		$param->{error} = t_("%1は変更できません。", $tabs->{names}->{$select});
		DA::IS::conf_error_msg($session, $param, 1);
	} elsif (!DA::Ajax::mailer_style_ok($session)) {
		$param->{error} = t_("統合メーラ(クラシックスタイル)が使用されています。");
		DA::IS::conf_error_msg($session, $param, 1);
	} elsif (!DA::Ajax::mailer_ok($session)) {
		$param->{error} = t_("%1は変更できません。", $tabs->{names}->{$select});
		DA::IS::conf_error_msg($session, $param, 1);
	} else {
		unless (&conv_master($session)) {
			$param->{error} = t_("設定が移行できません。");
			DA::IS::conf_error_msg($session, $param, 1);
		}
	}

	return($param);
}

sub get_mainte_param {
	my ($session, $custom, $select) = @_;
	my $param = {};
	my $title = t_("メールアドレス") . " : " . DA::CGIdef::encode($session->{email}, 0, 1, 'euc');
	my $img = "func_title_emlmainte.gif";
	my $page_title = t_('電子メールメンテナンス');
	my $tabs = {
		"names" => {
			"mainte_repair"    => t_("修復")
		},
		"hrefs" => {
			"mainte_repair"    => "ma_ajx_repair.cgi",
		}
	};
	my @items = qw (
		mainte_repair
	);

	foreach my $i (@items) {
		$param->{tabs} ++;
		$param->{"tab_name$param->{tabs}"} = "&nbsp;&nbsp;"
		                                   . $tabs->{names}->{$i}
		                                   . "&nbsp;&nbsp;";
		$param->{"tab_href$param->{tabs}"} = "$DA::Vars::p->{cgi_rdir}/"
		                                   . $tabs->{hrefs}->{$i} . "?time=" . time;
		if ($i eq $select) {
			$param->{tab_on} = $param->{tabs};
		}
	}
	$param->{page_title} = DA::CGIdef::get_page_title($session, $img, $title, '', 'on', $page_title);

	#===========================================
	#     Custom
	#===========================================
	DA::Custom::put_mail_mainte_tab($session, $param, $select);
	#===========================================

	if ($custom->{$select} eq "off") {
		$param->{error} = t_("%1は変更できません。", $tabs->{names}->{$select});
		DA::IS::conf_error_msg($session, $param, 1);
	} elsif (!DA::Ajax::mailer_ok($session)) {
		$param->{error} = t_("クラシックメーラーが使用されています。");
		DA::IS::conf_error_msg($session, $param, 1);
	}

	return($param);
}

sub get_init_param {
    my ($session, $custom, $select)    = @_;
    my $titleimg  = "func_title_initmail.gif";
	my $titlename = t_('電子メールの初期値');
    my $tab_p   = {
        "names" => {
            "menu_action"   => t_("動作設定"),
            "menu_sent"     => t_("送信設定"),
            "menu_view"     => t_("表示設定"),
            "menu_list"     => t_("一覧表示項目設定"),
            "menu_sign"     => t_("署名"),
            "menu_sv"       => t_("メールサーバ設定")
        },
        "hrefs" => {
            "menu_action"   => "init_ma_ajx_config.cgi",
            "menu_sent"     => "init_ma_ajx_config_sent.cgi",
            "menu_view"     => "init_ma_ajx_config_view.cgi",
            "menu_list"     => "init_ma_ajx_config_list.cgi",
            "menu_sign"     => "init_ma_ajx_config_sign.cgi",
            "menu_sv"       => "init_ma_ajx_config_sv.cgi"
        }
    };
    my $param   = {};

    foreach my $menu (qw(menu_action menu_sent menu_view menu_list menu_sign menu_sv)) {
        $param->{tabs} ++;
        $param->{"tab_name$param->{tabs}"}  = "&nbsp;&nbsp;"
                                            . $tab_p->{names}->{$menu}
                                            . "&nbsp;&nbsp;";
        $param->{"tab_href$param->{tabs}"}  = "$DA::Vars::p->{ad_cgi_rdir}/"
                                            . $tab_p->{hrefs}->{$menu};
        if ($menu eq $select) {
            $param->{tab_on}    = $param->{tabs};
        }
    }
    $param->{page_title}    = DA::CGIdef::get_page_title($session, $titleimg, undef, '', 'off', $titlename);

    #===========================================
    #     Custom
    #===========================================
    DA::Custom::put_mail_init_tab($session, $param, $select);
    #===========================================

    return ($param);
}

sub search_group($$$) {
	my ($session, $imaps, $str) = @_;
	my @langs = @DA::MultiLang::login_languages;
	my $group = &get_group_id($session, $imaps, $str, \@langs);
	my @gid   = split(/,/, $group->{gid});
	my $result= [];

	foreach my $gid (@gid) {
		my $cri =<<END_CRI;
ALL OR (OR HEADER "$MAIL_VALUE->{GROUP_OLD}" "$gid" HEADER "$MAIL_VALUE->{GROUP_TO}" "$gid") (OR HEADER "$MAIL_VALUE->{GROUP_CC}" "$gid" HEADER "$MAIL_VALUE->{GROUP_BCC}" "$gid")
END_CRI

		if (my $res = &_search($session, $imaps, $cri)) {
			push(@{$result}, @{$res});
		} else {
			&_warn($session, "_search");
			return(undef);
		}
	}

	return($result);
}

sub mail_address($$$$) {
	my ($session, $fid, $uid, $field) = @_;
	my @users;

	if (my $detail = &storable_retrieve($session, "$fid\.$uid\.detail")) {
		my $num = 1;
		my $unique = {};
		foreach my $f (split(/\|/, $field)) {
			foreach my $l (@{$detail->{$f}}) {
				unless ($unique->{"$l->{name}\t$l->{email}"}) {
					$l->{num} = $num ++;
					$unique->{"$l->{name}\t$l->{email}"} = 1;
					push(@users, &convert_internal($l));
				}
			}
		}
	} else {
		&_warn($session, "storable_retrieve");
		return(undef);
	}

	return(\@users);
}

sub mail_original($$$) {
	my ($session, $fid, $uid) = @_;
	my $original = {};

	if (my $detail = &storable_retrieve($session, "$fid\.$uid\.detail")) {
		foreach my $f (qw(To Cc Bcc From Reply-To Subject)) {
			$original->{$f} = &convert_internal($detail->{original}->{$f});
		}
	} else {
		&_warn($session, "storable_retrieve");
		return(undef);
	}

	return($original);
}

sub make_graph($$$) {
	my ($session, $imaps, $quota) = @_;
	my $logger = &_logger_init($session);
	my $result = {};
	my $error;

	if (&lock($session, "trans.graph")) {
		if (my $graph_id = &inc_num($session, "graph")) {
			if ($quota->{sto_quota} ne '' || $quota->{mes_quota} ne '') {
				my $ctype = "2DPIE";
				my $path  = "$DA::Vars::p->{user_dir}/$session->{user}/temp";
				my $rpath = "$DA::Vars::p->{user_rdir}/$session->{user}/temp";
				my $storage_file = "ma_disk_check_storage_$graph_id\.gif";
				my $message_file = "ma_disk_check_message_$graph_id\.gif";

				my $storage_total_value = int($quota->{sto_quota});
				my $storage_use_value   = int($quota->{sto_use});
				my $storage_unuse_value = (int($quota->{sto_quota} - $quota->{sto_use}) > 0) ?
											int($quota->{sto_quota} - $quota->{sto_use}) : 0;
				my $conf = DA::IS::get_master($session, 'ajxmailer');
				if ($conf->{cap_size_unit} eq 'MB') {
					$storage_total_value = sprintf("%0.2f",DA::CGIdef::convert_byte($storage_total_value.'KB','MB')). " (MB)";
					$storage_use_value = sprintf("%0.2f",DA::CGIdef::convert_byte($storage_use_value.'KB','MB')). " (MB)";
					$storage_unuse_value = sprintf("%0.2f",DA::CGIdef::convert_byte($storage_unuse_value.'KB','MB')). " (MB)";
				} else {
					$storage_total_value = $storage_total_value. " (KB)";
					$storage_use_value = $storage_use_value. " (KB)";
					$storage_unuse_value = $storage_unuse_value. " (KB)";
				}

				my $storage_title = t_("使用容量")
				                  . " - "
				                  . t_("制限容量")
				                  . " : " . $storage_total_value;
				my $message_title = t_("メール数") 
				                  . " - "
			    	              .t_("制限数")
				                  . " : " . int($quota->{mes_quota})
				                  . " (" . t_("通")
				                  . ")";

				my $message_use_value   = int($quota->{mes_use});
				my $message_unuse_value = (int($quota->{mes_quota} - $quota->{mes_use}) > 0) ?
											int($quota->{mes_quota} - $quota->{mes_use}) : 0;

				my $value = {
					'storage_title'       => $storage_title,
					'storage_use_title'   => t_("使用容量") 
					                      .  " : $storage_use_value",
					'storage_unuse_title' => t_("未使用容量")
					                      .  " : $storage_unuse_value",
					'storage_use_value'   => $storage_use_value,
					'storage_unuse_value' => $storage_unuse_value,
					'message_title'       => $message_title,
					'message_use_title'   => t_("保存数")
					                      .  " : $message_use_value ("
					                      .  t_("通")
					                      .  ")",
					'message_unuse_title' => t_("保存可能数")
					                      .  " : $message_unuse_value ("
					                      .  t_("通")
					                      .  ")",
					'message_use_value'   => $message_use_value,
					'message_unuse_value' => $message_unuse_value
				};

				foreach my $key (keys %{$value}) {
					$value->{$key} =~ s/\\/\\\\/g;
					$value->{$key} =~ s/\"/\\\"/g;
					$value->{$key} =~ s/\`/\\\`/g;
					$value->{$key}  =~ s/\$/\\\$/g;
				}

				my $image_dat;
				if ($DA::Vars::p->{linux}=~/Turbo/i) {
					$image_dat = "x_image_turbo_mail.dat";
				} elsif ($DA::Vars::p->{linux}=~/Red/i) {
					$image_dat = "x_image_redhat_mail.dat";
				} elsif ($DA::Vars::p->{linux}=~/Cobalt/i) {
					$image_dat = "x_image_cobalt_mail.dat";
				} elsif ($DA::Vars::p->{linux}=~/Miracle.+V1\./i) {
					$image_dat = "x_image_miracle_mail.dat";
				} elsif ($DA::Vars::p->{linux}=~/Miracle.+V2\./i) {
					$image_dat = "x_image_miracle2_mail.dat";
				}
				my $temp_contents = {};
				my $n;
				if ($quota->{sto_quota} ne '') {
					my @value;

					push(@value,
						sprintf("-DT%02d%02d\"%s\"", 0, 1, $value->{storage_use_title}));
					push(@value,
						sprintf("-DT%02d%02d\"%s\"", 0, 2, $value->{storage_unuse_title}));
					push(@value,
						sprintf("-DT%02d%02d\"%s\"", 1, 1, $value->{storage_use_value}));
					push(@value,
						sprintf("-DT%02d%02d\"%s\"", 1, 2, $value->{storage_unuse_value}));

					if (scalar(@value)) {
						$n = int(($storage_use_value/($storage_unuse_value + $storage_use_value)) * 100);
					}
					        $temp_contents->{sto_contents}.=<<end_buf;
<table border=1 width=100% rules=none bgcolor=white style="
border-collapse: collapse !important;
border-collapse: separate;
">
<tr>
<td valign=top align=center colspan=2>
<font color="#0000ff" style="
text-decoration: underline;
font-size: 14px !important;
font-size: 11pt;
">$value->{storage_title} </font></td>
</tr>
<tr> 
<td align=center rowspan=2 width=60%><img src=\"$session->{img_rdir}/ma_quota/ma_disk_quota_$n.gif\" border=0><p></td>
<td valign=top align=left height=100><img  src=\"$session->{img_rdir}/ma_quota/ma_disk_quota_used.gif\" border=0>&nbsp;$value->{storage_use_title}<br>
    <img  src=\"$session->{img_rdir}/ma_quota/ma_disk_quota_unused.gif\" border=0>&nbsp;$value->{storage_unuse_title}   
</td>
</tr>
<tr>
<td></td>
</tr>
</table>
end_buf

				}
				if ($quota->{mes_quota} ne '') {
					my @value;

					push(@value,
						sprintf("-DT%02d%02d\"%s\"", 0, 1, $value->{message_use_title}));
					push(@value,
						sprintf("-DT%02d%02d\"%s\"", 0, 2, $value->{message_unuse_title}));
					push(@value,
						sprintf("-DT%02d%02d\"%s\"", 1, 1, $value->{message_use_value}));
					push(@value,
						sprintf("-DT%02d%02d\"%s\"", 1, 2, $value->{message_unuse_value}));

					if (scalar(@value)) {
						$n = int(($message_use_value/($message_unuse_value + $message_use_value)) * 100);
					}
					        $temp_contents->{mes_contents}.=<<end_l;
<table border=1 width=100% rules=none bgcolor=white style="
border-collapse: collapse !important;
border-collapse: separate;
">
<tr>
<td valign=top align=center colspan=2>
<font color="#0000ff" style="
text-decoration: underline;
font-size: 14px !important;
font-size: 11pt;
">$value->{message_title} </font></td>
</tr>
<tr> 
<td align=center rowspan=2 width=60%><img src=\"$session->{img_rdir}/ma_quota/ma_disk_quota_$n.gif\" border=0><p></td>
<td valign=top align=left height=100><img  src=\"$session->{img_rdir}/ma_quota/ma_disk_quota_used.gif\" border=0>&nbsp;$value->{message_use_title}<br>
    <img  src=\"$session->{img_rdir}/ma_quota/ma_disk_quota_unused.gif\" border=0>&nbsp;$value->{message_unuse_title}   
</td>
</tr>
<tr>
<td></td>
</tr>
</table>
end_l

				}

				my $warning;
				if ($quota->{sto_over}) {
					$warning .= t_("容量制限を超えています。");
				} elsif ($quota->{sto_limit}) {
					$warning .= t_("容量制限の警戒値を超えています。");
				}
				if ($quota->{mes_over}) {
					$warning .= t_("メール数制限を超えています。");
				} elsif ($quota->{mes_limit}) {
					$warning .= t_("メール数制限の警戒値を超えています。");
				}

				$result = {
					"messages" => {
						"path" => ($quota->{mes_quota} eq "") ? "" : "$rpath/$message_file",
						"contents" =>($quota->{mes_quota} eq "") ? "" : $temp_contents->{mes_contents}
					},
					"storage"  => {
						"path" => ($quota->{sto_quota} eq "") ? "" : "$rpath/$storage_file",
						"contents" =>($quota->{sto_quota} eq "") ? "" : $temp_contents->{sto_contents}
					},
					"warning"  => $warning,
					"quote"    => 1
				};
			} else {
				&_warn($session, "No set quota");
				$error = &convert_internal(&error("NO_SET_QUOTA", 9));
			}
		} else {
			&_warn($session, "inc_num");
			$error = &convert_internal(&error("NOT_INC_GRAPH", 9));
		}

		&unlock($session, "trans.graph");
	} else {
		&_warn($session, "lock");
		$error = &convert_internal(&error("NOT_LOCK", 9));
	}

	if ($error) {
		$result = $error;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub make_folders_old($$$$) {
	my ($session, $imaps, $folders, $SELECT) = @_;
	my $cnt   = 1;
	my $s_dir = {};
	my $s_rev = {};
	my $s_inf = {};
	my $i_dir = {};
	my $i_rev = {};
	my $i_inf = {};

	foreach my $fid (
		sort { $folders->{$a}->{sort_root} <=> $folders->{$b}->{sort_root}
			|| $folders->{$a}->{sort_level} <=> $folders->{$b}->{sort_level}
			|| $folders->{$a}->{sort_name} cmp $folders->{$b}->{sort_name} } keys %{$folders}) {
		my $path   = &_fid2path($session, $imaps, $folders, $fid);
		my $type   = &_fid2type($session, $imaps, $folders, $fid);
		my $o_type = &_fid2old_type($session, $imaps, $folders, $fid);
		my $uidval = &_fid2uidval($session, $imaps, $folders, $fid);
		if ($type =~ /^[01]/) {
			$s_dir->{$cnt}  = $path;
			$s_rev->{$path} = $cnt;
			$s_inf->{$cnt}  = "$path\t$o_type\t$uidval";
		}
		if ($type =~ /^[012]/) {
			$i_dir->{$cnt}  = $path;
			$i_rev->{$path} = $cnt;
			$i_inf->{$cnt}  = "$path\t$o_type\t$uidval";
		}
		$cnt ++;
	}

	# SEARCH
	if ($SELECT ne "INBOX") {
		DA::IS::save_temp($session, $s_dir, "$session->{sid}\.$SELECT\.imap_list");
		DA::IS::save_temp($session, $s_rev, "$session->{sid}\.$SELECT\.imap_list_r");
		DA::IS::save_temp($session, $s_inf, "$session->{sid}\.$SELECT\.imap_info");
	}

	# INBOX
	DA::IS::save_temp($session, $i_dir, "$session->{sid}\.INBOX\.imap_list");
	DA::IS::save_temp($session, $i_rev, "$session->{sid}\.INBOX\.imap_list_r");
	DA::IS::save_temp($session, $i_inf, "$session->{sid}\.INBOX\.imap_info");

	my $root   = &_root($session, $imaps);
	my $server = &_server($session, $imaps);
	my $inbox  = &_inbox($session, $imaps);
	my $open   = { $root->{path} => 1, $server->{path} => 1, $inbox->{path} => 1 };
	DA::IS::save_temp($session, $open, "$session->{sid}\.$SELECT\.imap_open_folder");

	return(1);
}

# フォルダ選択用 SELECT タグの作成
# $select     : セレクトする fid
# $mode   = 0 : 全て表示
#         = 1 : メール移動用
#         = 2 : フォルダ移動用
#         = 3 : メール移動用（ Sent, Trash への移動 OK ）
sub make_folders_tag($$$;$;$) {
	my ($session, $imaps, $folders, $select, $mode) = @_;
	my $specific;
	if ($mode eq 3) {
		$specific = "$TYPE_DRAFT\|$TYPE_SPAM";
	} elsif ($mode eq 2) {
		$specific = "$TYPE_DRAFT\|$TYPE_SENT\|$TYPE_TRASH\|$TYPE_SPAM";
	} elsif ($mode eq 1) {
		$specific = "$TYPE_DRAFT\|$TYPE_SENT\|$TYPE_TRASH\|$TYPE_SPAM";
	} else {
		$specific = "$TYPE_DRAFT\|$TYPE_SENT\|$TYPE_TRASH\|$TYPE_SPAM";
	}

	my $flist = [];
	my $finfo = {};
	my $finv  = {};
	my $top   = {};
	my $root;
	foreach my $fid (
		sort { $folders->{$a}->{sort_root} <=> $folders->{$b}->{sort_root}
			|| $folders->{$a}->{sort_level} <=> $folders->{$b}->{sort_level}
			|| $folders->{$a}->{sort_name} cmp $folders->{$b}->{sort_name} } keys %{$folders}) {
		my $name = &_fid2name($session, $imaps, $folders, $fid);
		my $path = &_fid2path($session, $imaps, $folders, $fid);
		my $type = &_fid2type($session, $imaps, $folders, $fid);
		if ($type =~ /^[02]/) {
			next;
		} elsif ($type eq $TYPE_SERVER) {
			my $folder = &_fid2folder($session, $imaps, $folders, $fid);
			my $value;

			if ($mode eq 1 || $mode eq 3) {
				$value = "";
				$finv->{$path} = 1;
			} elsif ($mode eq 2) {
				if (&check_imap_info($session, $imaps, "create_server")) {
					$value = $fid;
				} else {
					$value = "";
					$finv->{$path} = 1;
				}
			} else {
				$value = $fid;
			}

			$root = $fid;
			$top  = {
				"id"    => $fid,
				"value" => $value,
				"name"  => $name,
				"fpath" => $path
			};
        } else {
			my $folder = &_fid2folder($session, $imaps, $folders, $fid);
			my $key    = $folder;
			   $key    =~s/\Q$imaps->{imap}->{separator}\E/\#/g;
			my $value;

			if ($type eq $TYPE_INBOX) {
				if ($mode eq 1 || $mode eq 3) {
					$value = $fid;
				} elsif ($mode eq 2) {
					if (&check_imap_info($session, $imaps, "create_server")) {
						$value = $fid;
					} else {
						$value = "";
						$finv->{$path} = 1;
					}
				} else {
					$value = $fid;
				}
			} elsif ($type =~ /^($specific)$/) {
				if ($mode) {
					if ($type eq $TYPE_DRAFT) {
						$value = "";
					} elsif ($type eq $TYPE_SENT) {
						$value = "";
					} elsif ($type eq $TYPE_TRASH) {
						$value = "";
					} elsif ($type eq $TYPE_SPAM) {
						$value = "";
					}
					$finv->{$path} = 1;
				} else {
					$value = $fid;
				}
			} elsif (($mode eq 1 || $mode eq 3) && &_is_cabinet($session, $imaps, $folders, $type)) {
				$value = "";
				$finv->{$path} = 1;
			} elsif (($mode eq 2) && &_is_mailbox($session, $imaps, $folders, $type)) {
				$value = "";
				$finv->{$path} = 1;
			} elsif (($mode eq 2) && &check_imap_info($session, $imaps, "folder_nounder")) {
				$value = "";
				$finv->{$path} = 1;
			} else {
				$value = $fid;
			}
			$finfo->{$key} = {
				"id"    => $fid,
				"value" => $value,
				"name"  => $name,
				"fpath" => $path
			};

			push(@{$flist}, $key);
		}
	}

	my $conf = {
		option_maker  => \&_folder_option_maker,
		option_string => \&_folder_option_string,
		selected      => $select,
		invalid       => $finv
	};
	my $struct = DA::HTML::Struct->new(
		list  => &convert_internal($flist),
		info  => &convert_internal($finfo),
		slice => "#",
		root  => &convert_internal($root),
		top   => &convert_internal($top)
	);
	my $tag = $struct->make_option($conf);
	if ($tag) {
		$tag = &convert_mailer($tag)
	}

	return($tag);
}

sub _folder_option_maker {
	my $class = shift;
	my $conf  = shift;

	my $fpath = $class->{fpath};
	my $selected = " selected" if ($fpath eq $conf->{selected});
	my $value = DA::CGIdef::encode($class->{value}, 0, 1, "euc");;

	return "<option value=\"$value\"$selected>";
}

sub _folder_option_string {
	my $class = shift;
	my $conf  = shift;

	my $fpath = $class->{fpath};
	my $name = DA::CGIdef::encode($class->{name}, 0, 1, "euc");
	if (exists $conf->{invalid}->{$fpath}) {
		return "&nbsp;*$name";
	} else {
		return "&nbsp;$name";
	}
}

# フォルダ選択用 SELECT タグの作成
# $select     : セレクトする path
# $mode   = 0 : 全て表示
#         = 1 : メール移動用
#         = 2 : フォルダ移動用
#         = 3 : メール移動用（ Sent, Trash への移動 OK ）
sub make_folders_tag_old($$$$$;$) {
	my ($session, $imaps, $folders, $select, $file, $mode) = @_;
	my $specific;
	if ($mode eq 3) {
		$specific = "$TYPE_DRAFT\|$TYPE_SPAM";
	} elsif ($mode eq 2) {
		$specific = "$TYPE_DRAFT\|$TYPE_SENT\|$TYPE_TRASH\|$TYPE_SPAM";
	} elsif ($mode eq 1) {
		$specific = "$TYPE_DRAFT\|$TYPE_SENT\|$TYPE_TRASH\|$TYPE_SPAM";
	} else {
		$specific = "$TYPE_DRAFT\|$TYPE_SENT\|$TYPE_TRASH\|$TYPE_SPAM";
	}

	my $flist = [];
	my $finfo = {};
	my $finv  = {};
	my $top   = {};
	my $root;
	foreach my $fid (
		sort { $folders->{$a}->{sort_root} <=> $folders->{$b}->{sort_root}
			|| $folders->{$a}->{sort_level} <=> $folders->{$b}->{sort_level}
			|| $folders->{$a}->{sort_name} cmp $folders->{$b}->{sort_name} } keys %{$folders}) {
		my $name = &convert_internal(&_fid2name($session, $imaps, $folders, $fid));
		my $path = &convert_internal(&_fid2path($session, $imaps, $folders, $fid));
		my $type = &convert_internal(&_fid2type($session, $imaps, $folders, $fid));
		if ($type =~ /^[02]/) {
			next;
		} elsif ($type eq $TYPE_SERVER) {
			my $folder = &_fid2folder($session, $imaps, $folders, $fid);
			my $value;

			if ($mode eq 1 || $mode eq 3) {
				$value = "#root";
				$finv->{$path} = 1;
			} elsif ($mode eq 2) {
				if (&check_imap_info($session, $imaps, "create_server")) {
					$value = $path;
				} else {
					$value = "#root";
					$finv->{$path} = 1;
				}
			} else {
				$value = $path;
			}

			$root = $fid;
			$top  = {
				"id"    => $fid,
				"value" => $value,
				"name"  => $name,
				"fpath" => $path
			};
		} else {
			my $folder = &_fid2folder($session, $imaps, $folders, $fid);
			my $key    = $folder;
			   $key    =~s/\Q$imaps->{imap}->{separator}\E/\#/g;
			my $value;

			if ($type eq $TYPE_INBOX) {
				if ($mode eq 1 || $mode eq 3) {
					$value = $path;
				} elsif ($mode eq 2) {
					if (&check_imap_info($session, $imaps, "create_server")) {
						$value = $path;
					} else {
						$value = "#inbox";
						$finv->{$path} = 1;
					}
				} else {
					$value = $path;
				}
			} elsif ($type =~ /^($specific)$/) {
				if ($mode) {
					if ($type eq $TYPE_DRAFT) {
						$value = "#draft";
					} elsif ($type eq $TYPE_SENT) {
						$value = "#sent";
					} elsif ($type eq $TYPE_TRASH) {
						$value = "#trash";
					} elsif ($type eq $TYPE_SPAM) {
						$value = "#spam";
					}
					$finv->{$path} = 1;
				} else {
					$value = $path;
				}
			} elsif (($mode eq 1 || $mode eq 3) && &_is_cabinet($session, $imaps, $folders, $type)) {
				$value = "#cabinet";
				$finv->{$path} = 1;
			} elsif (($mode eq 2) && &_is_mailbox($session, $imaps, $folders, $type)) {
				$value = "#mailbox";
				$finv->{$path} = 1;
			} elsif (($mode eq 2) && &check_imap_info($session, $imaps, "folder_nounder")) {
				$value = "#nocreate";
				$finv->{$path} = 1;
			} else {
				$value = $path;
			}
			$finfo->{$key} = {
				"id"    => $fid,
				"value" => $value,
				"name"  => $name,
				"fpath" => $path
			};

			push(@{$flist}, $key);
		}
	}

	my $conf = {
		option_maker  => \&_folder_option_maker_old,
		option_string => \&_folder_option_string_old,
		selected      => $select,
		invalid       => $finv
	};
	my $struct = DA::HTML::Struct->new(
		list  => $flist,
		info  => $finfo,
		slice => "#",
		root  => $root,
		top   => $top
	);
	my $tag = $struct->make_option($conf);
	if ($tag) {
		$tag = "<select name=move_path>\n"
		     . "<option value=\"\">" . t_("フォルダ選択") . "</option>\n"
		     . $tag
		     . "</select>";
	}

	my $alert = "<table border=0 cellpadding=0 cellspacing=0>\n"
	          . "<tr bgcolor=white align=center>\n"
	          . "  <td nowrap><font color=red>&nbsp;*</font></td>\n"
	          . "  <td nowrap width=25><font color=red>---</font></td>\n"
	          . "  <td nowrap><font color=red>" . t_("選択できません") . "</font></td>\n"
	          . "</tr>\n"
	          . "</table>";

	my $button  = "<input type=button name=sel value=\"@{[t_('設定')]}\" onClick=\"javascript:setMovePath();\">";

	my $script  =<<end_tag;
function setMovePath() {
    var Path = document.forms[0].move_path.options[document.forms[0].move_path.options.selectedIndex].value;
        Path = stringToHex(Path);
    Pop('ma_foldersel.cgi%3ffile=$file%20mode=@{[($mode eq 2) ? 1 : 0]}%20cancel=1%20submit=1%20move_path=' + Path,'pop_title_selfolder.gif',500,500);
}
function stringToHex(STRING) {
    var Hex = "";
    for (i = 0; i < STRING.length; i ++) {
        Hex += STRING.charCodeAt(i).toString(16);
    }
    return (Hex);
}
end_tag

	return (wantarray ? ($tag, $alert, $button, $script) : $tag);
}

sub _folder_option_maker_old {
	my $class = shift;
	my $conf  = shift;

	my $fpath = $class->{fpath};
	my $value = DA::CGIdef::encode($class->{value}, 0, 1, "euc");
	my $selected = " selected" if ($fpath eq $conf->{selected});

	return "<option value=\"$value\"$selected>";
}

sub _folder_option_string_old {
	my $class = shift;
	my $conf  = shift;

	my $fpath = $class->{fpath};
	my $name  = DA::CGIdef::encode($class->{name}, 0, 1, "euc");
	if (exists $conf->{invalid}->{$fpath}) {
		return "&nbsp;*$name";
	} else {
		return "&nbsp;$name";
	}
}

sub repair_all($$) {
	my ($session, $imaps) = @_;
	my $logger = &_logger_init($session);
	my $error;
	#　一時ファイルをロック
	my $lock;
	my $org_mail_permit = 0;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$org_mail_permit = 1;
		$lock = DA::OrgMail::folder_lock($session);
	}
	if (!$org_mail_permit || $lock) {
	if (&lock($session, "trans.repair")) {
		my $rf = &folders($session, $imaps);
		if ($rf->{error}) {
			$error = &convert_internal($rf->{message});
		} else {
			my $exists = {};
			foreach my $l (@{$rf->{folders}}) {
				$exists->{"$l->{folder}\t$l->{uidvalidity}"} = 1;
			}

			my $sc = {
				"output" => [qw(folder_name uidvalidity)],
				"mode"   => "user"
			};
			my $deleted = {};
			if (my $lines = &_select_header($session, $imaps, $sc)) {
				foreach my $l (@{$lines}) {
					unless ($exists->{"$l->{folder_name}\t$l->{uidvalidity}"}) {
						$deleted->{"$l->{folder_name}\t$l->{uidvalidity}"} = 1;
					}
				}
			} else {
				&_warn($session, "_select_header");
				$error = &message("NOT_SELECT_HEADER_TABLE", &internal_charset());
			}

			# Delete DB
			unless ($error) {
				foreach my $key (keys %{$deleted}) {
					my ($folder, $uidval) = split(/\t/, $key);
					my $dc = {
						"folder" => $folder,
						"uidval" => $uidval
					};
					if (&_delete_header($session, $imaps, $dc)) {
						if (&_delete_folder($session, $imaps, $dc)) {
						} else {
							&_warn($session, "_delete_folder");
							$error = &message("NOT_DELETE_FOLDER_TABLE", &internal_charset());
						}
					} else {
						&_warn($session, "_delete_header");
						$error = &message("NOT_DELETE_HEADER_TABLE", &internal_charset());
					}
				}
			}

			# Update
			unless ($error) {
				foreach my $l (@{$rf->{folders}}) {
					if (&_fid2update($session, $imaps, $rf->{folders_h}, $l->{fid})) {
						next unless &_exists($session, $imaps, $l->{folder});
						my $uc  = {
							"fid"      => $l->{fid},
							"noinsert" => 1,
							"norecent" => 1
						};
						my $ru = &update($session, $imaps, $rf->{folders_h}, $uc);
						if ($ru->{error}) {
							&_warn($session, "update");
							$error = &convert_internal($ru->{message});
						} else {
							my $folder = $l->{folder};
							my $uidval = $l->{uidvalidity};
							unless (re_count($session, $imaps, $folder, $uidval, 0)) {
								&_warn($session, "re_count");
								$error = &message("NOT_GET_COUNT", &internal_charset());
							}
						}

						if ($error) {
							last;
						}
					}
				}
			}
		}

		&unlock($session, "trans.repair");
	} else {
		&_warn($session, "lock");
		$error = &message("NOT_LOCK", &internal_charset());
	}
		#　一時ファイルのロックを削除
		DA::OrgMail::folder_unlock($session, "lock.folders");
	} else {
		&_warn($session, "lock:lock.folders");
		$error = &message("NOT_LOCK_FOLDERS", &internal_charset());
	}
	&_logger($session, $imaps, $logger);

	return($error);
}

sub make_portal($$) {
	my ($session, $imaps) = @_;
	my $logger = &_logger_init($session);
	my $portal = $imaps->{portal};
	my $error;

	if (&lock($session, "trans.portal")) {
		my $inbox    = _inbox($session, $imaps);
		my $folder   = $inbox->{folder};
		my $uidval   = &_uidvalidity($session, $imaps, $folder);
		my $target   = $portal->{ml_target} || "inbox";
		my $sort     = $portal->{ml_sort};
		my $seen     = $portal->{ml_read};
		my $deleted  = $portal->{ml_deleted};
		my $word     = $portal->{ml_word};
		my $row      = $portal->{ml_row};
		my $day      = ($portal->{ml_day} || 3) * -1;
		my $date     = DA::CGIdef::get_date2($session, "Y4/MM/DD");
		   $date     = DA::CGIdef::get_target_date($date, $day, "Y4/MM/DD");
		my $time     = "24:00:00";
		my $datetime = DA::CGIdef::convert_date($session, "$date\-$time", 1, "+0000");
		my $order    = "internal desc,uid_number desc";

		# キーワード検索
		my %kres;
		if ($sort ne "recv") {
			my ($new_imaps, $disconnect);
			if ($imaps->{session}) {
				$new_imaps = $imaps;
			} else {
				$new_imaps = &connect($session, { "noupdate" => 1 }, $imaps);
				if ($new_imaps->{error}) {
					$error = $new_imaps;
				}
				$disconnect = 1;
			}

			unless ($error) {
				&_set_uid_flag($session, $new_imaps);

				if (&_examine($session, $new_imaps, $folder)) {
					if ($new_imaps->{imap}->{charset}) {
						my $wj = DA::Charset::convert
									(\$word, &mailer_charset(), &search_charset());
						my $cri = "ALL ". uc($sort);

						if (my $res = &_search($session, $new_imaps, $cri, 1, [$wj])) {
							@kres{@{$res}} = 1;
						} else {
							&_warn($session, "_search");
							$error = &error("NOT_SEARCH", 9); last;
						}
					} else {
						if (my $res = &_simple_search($session, $new_imaps, $folder, $sort, $word)) {
							@kres{@{$res}} = 1;
						} else {
							&_warn($session, "_simple_search");
							$error = &error("NOT_SIMPLE_SEARCH", 9); last;
						}
					}
				} else {
					&_warn($session, "_examine");
					$error = &message("NOT_EXAMINE_FOLDER", &internal_charset());
				}

				&_unset_uid_flag($session, $new_imaps);
			}

			if ($disconnect) {
				&disconnect($session, $new_imaps);
			}
		}

		# 日付、件数による絞込み
		unless ($error) {
			my ($sc, @where);
			my @output = qw (
				folder_name uid_number
				seen flagged deleted replied forwarded attach4ajx
				mail_size internal from_field to_field date_field subject_field
				priority from_ext to_ext subject_ext to_status
			);

			#===========================================
			#     Custom
			#===========================================
			DA::Custom::rewrite_portal_output_items4ajx({"portal_output_items" => \@output});
			#===========================================

			if ($seen eq "off") {
				push(@where, { "column" => "seen", "value" => 0 });
			}
			if ($deleted eq "off") {
				push(@where, { "column" => "deleted", "value" => 0 });
			}
			if ($datetime) {
				push(@where, { "column" => "internal", "value" => $datetime, "rule" => ">=" });
			}
			if ($portal->{ml_target} eq "all") {
				$sc = {
					"where"  => \@where,
					"order"  => $order,
					"output" => \@output,
					"mode"   => "user"
				};
			} else {
				$sc = {
					"folder" => $folder,
					"uidval" => $uidval,
					"where"  => \@where,
					"order"  => $order,
					"output" => \@output
				};
			}
			if (my $res = &_select_header($session, $imaps, $sc)) {
				my $n     = 1;
				my $sent  = &_sent($session, $imaps);
				my $draft = &_draft($session, $imaps);
				my $trash = &_trash($session, $imaps);
				my @lines;
				foreach my $r (@{$res}) {
					if ($r->{folder_name} eq "" || $r->{uid_number} eq "") {
						next;
					} elsif ($r->{folder_name} eq $sent->{folder}
					     ||  $r->{folder_name} eq $draft->{folder}
					     ||  $r->{folder_name} eq $trash->{folder}) {
						next;
					} else {
						$r->{sno}    = $n;
						$r->{target} = "portal";

						if ($sort eq "recv") {
							push(@lines, $r); $n ++;
						} else {
							if (exists $kres{$r->{uid_number}}) {
								push(@lines, $r); $n ++;
							}
						}
						if ($n > $row) {
							last;
						}
					}
				}
				if (&save_portal($session, \@lines)) {
					unless (&unset_portal_reload($session, $imaps)) {
						&_warn($session, "unset_portal_reload");
						$error = &message("NOT_WRITE_STATUS_CONFIG", &internal_charset());
					}
				} else {
					&_warn($session, "save_portal");
					$error = &message("NOT_WRITE_PORTAL", &internal_charset());
				}
			} else {
				&_warn($session, "_select_header");
				$error = &message("NOT_SELECT_HEADER_TABLE", &internal_charset());
			}
		}

		if (&storable_exist($session, "search.headers.uidlst.100000000")) {
			unless (&_clear_uidlst_search($session, "100000000")) {
				&_warn($session, "portal");
			}
		}

		&unlock($session, "trans.portal");
	} else {
		&_warn($session, "lock");
		$error = &message("NOT_LOCK", &internal_charset());
	}

	&_logger($session, $imaps, $logger);

	return($error);
}

sub print_portal($$) {
	my ($session, $query) = @_;
	my $logger   = &_logger_init($session);
	my $timezone = &get_timezone($session);
	my $lang     = &get_user_lang($session);
	my $h12      = &get_time_style($session);
	my $tzview   = &get_tz_view($session);
	my $imaps;

	if (&storable_exist($session, "folders")) {
		$imaps = DA::Ajax::Mailer::connect($session, { "nosession" => 1 });
	} else {
		$imaps = DA::Ajax::Mailer::connect($session);
	}

	if ($imaps->{error}) {
		return(undef);
	}

	if ($imaps->{status}->{portal_reload}
	||  $imaps->{status}->{portal} ne $DA::IsVersion::Version
	||  $imaps->{status}->{portal_charset} ne DA::Unicode::internal_charset()
	||  $imaps->{status}->{portal_mailer} ne "ajax") {
		if (&make_portal($session, $imaps)) {
			return(undef);
		}
	}

	my ($tag, $page);
	if($query->param('MAIL_LIST_TOP_page')){
		$page = $query->param('MAIL_LIST_TOP_page');
	}else{
		$page = 1;
	}
	my $portal = $imaps->{portal};
	my $start  = (($page - 1) * $portal->{ml_view}) + 1;
	my $end    = $start + $portal->{ml_view} - 1;
	my $count  = 1;

	if (&lock($session, "trans.portal")) {
		my $rf = &folders($session, $imaps);
		if ($rf->{error}) {
			&_warn($session, "folders");
			$tag = undef;
		} else {
			if (my $lines = &get_portal($session)) {
				my $srid = "100000000";
				my @uidlst;
				foreach my $l (@{$lines}) {
					my $path = &_encode($session, $imaps, $l->{folder_name});
					my $fid  = &_path2fid($session, $imaps, $rf->{folders_h}, $path);
					my $uid  = $l->{uid_number};

					if ($count >= $start && $count <= $end) {
						my ($mail, $icon, $priority, $date, $from, $subject, $attach);

						$mail = "<td width=16 align=center><img src=$session->{icon_rdir}/"
						      . "ico_sc_mail.$session->{icon_ext} width=14 height=14></td>";

						if ($l->{replied}) {
							$icon = "<img src=$session->{icon_rdir}/ico_sc_reply.$session->{icon_ext} "
							      . "border=0 width=14 height=14>";
						}
						if ($l->{forwarded}) {
							$icon = "<img src=$session->{icon_rdir}/ico_sc_forward.$session->{icon_ext} "
							      . "border=0 width=14 height=14>";
						}

						if ($portal->{ml_priority} eq "on") {
							if ($l->{priority} eq 1) {
								$priority = $MAIL_VALUE->{PRIORITY_IMG}->{1};
							} elsif ($l->{priority} eq 5) {
								$priority = $MAIL_VALUE->{PRIORITY_IMG}->{5};
							} else {
								$priority = "null.gif";
							}
							$priority = "<td width=16 align=center>"
							          . "<img src=$session->{img_rdir}/$priority width=14 "
							          . "height=14></td>";
						}
						if ($portal->{ml_date} ne "hidden") {
							my $opt;
							if ($portal->{ml_date} eq "date") {
								$opt = 4;
							} elsif ($portal->{ml_date} eq "time") {
								$opt = 6;
							} else {
								$opt = 1;
							}
							$date = format_date($l->{date_field}, $opt, $timezone, "", "", $lang, $h12, $tzview);
							$date = DA::CGIdef::encode($date, 0, 1, "euc");
							$date = "<td nowrap>$date</td>";
						}

						if (DA::Unicode::internal_charset() eq "UTF-8") {
							# From
							if ($l->{from_ext} eq "") {
								$from = &convert_internal($l->{from});
							} else {
								$from = MIME::Base64::decode_base64($l->{from_ext});
							}

							# Subject
							if ($l->{subject_ext} eq "") {
								$subject = &convert_internal($l->{subject});
							} else {
								$subject = MIME::Base64::decode_base64($l->{subject_ext});
							}
						} else {
							# From
							$from = &convert_internal($l->{from_field});

							# Subject
							$subject = &convert_internal($l->{subject_field});
						}

						if ($portal->{ml_from} eq "all") {
							$from = DA::CGIdef::encode($from, 0, 1, "euc");
							$from = "<td>$from</td>";
						} elsif ($portal->{ml_from} eq "hidden") {
							$from = "";
						} else {
							$from = DA::Charset::sub_str($from, &internal_charset(), 0, $portal->{ml_from});
							$from = DA::CGIdef::encode($from, 0, 1, "euc");
							$from = "<td>$from</td>";
						}
						if ($subject eq "") {
							$subject = "notitle";
							$subject = DA::CGIdef::encode($subject, 0, 1, "euc");
						}else{
							if ($portal->{ml_title} eq "all") {
								$subject = DA::CGIdef::encode($subject, 0, 1, "euc");
							} else {
								$subject = DA::Charset::sub_str($subject, &internal_charset(), 0, $portal->{ml_title});
								$subject = DA::CGIdef::encode($subject, 0, 1, "euc");
							}
						}
						$subject = "<td>$icon<a href=\"javascript:"
						         . DA::Ajax::detail_mail_url($session, $fid, $uid, $srid)
						         . "\">$subject</a></td>";

						if ($l->{deleted}) {
							$subject = "<strike>$subject</strike>";
						}

						if ($l->{attach4ajx}) {
							$attach = "$session->{icon_rdir}/ico_fc_attach.$session->{icon_ext}";
						} else {
							$attach = "$session->{img_rdir}/null.gif";
						}
						$attach = "<td nowrap width=20><img src=$attach width=14 height=14 align=top></td>";

						my $class=($count % 2) ? 'odd' : 'even';
						$tag .="<tr class='$class'>"
						     . $mail . $priority . $date . $from . $subject . $attach
						     . "</tr>\n";
					}

					push(@uidlst, "$fid\_$uid");

					$count ++;
				}
				if (!&storable_exist($session, "search.headers.uidlst.100000000")) {
					unless (&storable_store($session, \@uidlst, "search.headers.uidlst.100000000")) {
						&_warn($session, "storable_store");
						$tag = undef;
					}
				}
			} else {
				&_warn($session, "get_portal");
				$tag = undef;
			}
		}

		&unlock($session, "trans.portal");
	} else {
		&_warn($session, "lock");
		$tag = undef;
	}

	my $final = $count-1;
	my $line  = $portal->{ml_view};

	my $page_param = {
		'name' => 'MAIL_LIST_TOP_page',
		'page' => $page,
		'final'=> $final,
		'line' => $line,
		'cgi'  => '__PAGE_NAVI__'
	};

	my $page_tag;
	if($line <= $final){
		$page_tag=DA::IS::get_page_navi2($session, $page_param);
		my $func="javascript:DAportletRefresher.refresh";
        $page_tag=~s/__PAGE_NAVI__\&amp;MAIL_LIST_TOP_page=(\d+)/$func('mail','__INFO_PLACE__','','MAIL_LIST_TOP_page=$1');/g;
		$page_tag="<tr class='footer'><td colspan=6>".$page_tag."</td></tr>";
	}
	if ($tag ne '') {
		$tag = "<table class='list-portlet'>"
		     . $tag . $page_tag . "</table>\n";
	}

	#===========================================
	#     Custom
	#===========================================
	DA::Custom::mail_list_top($session, &convert_internal($portal), \$tag);
	#===========================================

	&_logger($session, $imaps, $logger);
	return($tag);
}

sub print_detail($$$$$;$) {
	my ($session, $imaps, $fid, $uid, $print_to_config, $maid) = @_;
	my $logger   = &_logger_init($session);
	my $module   = DA::IS::get_module($session);
	my $timezone = &get_timezone($session, $imaps);
	my $h12      = &get_time_style($session, $imaps);
	my $tzview   = &get_tz_view($session, $imaps);
	my $lang     = &get_user_lang($session, $imaps);
	my $tag;
	my $end_tag;
	my $file;
	if($maid){
		$file="$maid\.print";
	}else{
		$file="$fid\.$uid\.detail";
	}
	if (my $detail = &storable_retrieve($session, $file)) {
		if (my $allow = &get_sys_custom($session, "htmlmail_allow_tag")) {
			my $subject = $detail->{subject};
			my $date    = &format_date($detail->{date}, 3, $timezone, "", "", $lang, $h12, $tzview);
			my $from    = &_make_address_field($detail->{from});
			my $to      = &_make_address_field($detail->{to});
			my $cc      = &_make_address_field($detail->{cc});
			my ($attach, $body);
			if($maid){
				$date="";
			}
			foreach my $aid (sort {$a <=> $b} keys %{$detail->{attach}}) {
				$attach .= "$detail->{attach}->{$aid}->{name},";
			}
			$attach =~ s/\,+$//g;

            my $test_warp = 0;   
            if ($detail->{body}->{html} ne "" && !&_richtext2attachment($session, $imaps)) {
                $body = $detail->{body}->{html};
                $body = &_extract_htmlmail_part($session, $module, $allow,$body, &mailer_charset(), "detail", $imaps->{custom});
            } else {
				$body = $detail->{body}->{text};
				unless($maid){
					$body = &encode_mailer($body, undef, 1);
				}				
				# 折り返し表示
				if ($imaps->{mail}->{b_wrap} eq 'on') {
					 $body = "<div id=\"div_context\" style=\"\"><pre style=\"white-space: -moz-pre-wrap; white-space: -pre-wrap; white-space: -o-pre-wrap; white-space: pre-wrap; word-wrap: break-word;\">" . $body . "</pre></div>";
					 $test_warp = 1;
				} else {
					$body = "<pre>" . $body . "</pre>";
				}
			} 

            DA::Custom::ajx_rewrite_print_mail_detail($session,$fid,$uid,\$subject,\$date,\$from,\$to,\$cc,\$attach,\$body); 
            
            if($session->{ua_class}=~/IE/ && $test_warp){
			$tag =<<end_tag;
</td>
</tr>
</table>
$body
end_tag
            } else{
			$tag =<<end_tag;
$body</td>
</tr>
</table>
end_tag
            }			

	if($print_to_config eq "on"){
		$end_tag =<<end_tag;
	    <tr>
	      <td align=left valign=top nowrap>@{[&convert_mailer(t_("宛先"))]}:</td>
	      <td align=left valign=top>@{[&encode_mailer($to, 1, 1)]}</td>
	    </tr>
        <tr>
	      <td align=left valign=top nowrap>@{[&convert_mailer(t_("Ｃｃ"))]}:</td>
	      <td align=left valign=top>@{[&encode_mailer($cc, 1, 1)]}</td>
	    </tr>
end_tag
	}

			$tag =<<end_tag;
<table width=100% border=0 cellspacing=0 cellpadding=0 style="word-break:break-all;">
<tr>
  <td width=100%>
    <table width=100% border=0 cellspacing=0 cellpadding=0>
    <tr>
      <td align=left width=70% style="word-break:break-all;@{[($session->{char_style} eq "custom_style") ? "\"><font size=+2>" : "font-size:18px;\">"]}<b>@{[&encode_mailer($subject, 1, 1)]}&nbsp;&nbsp;</b>@{[($session->{char_style} eq "custom_style") ? "</font>" : ""]}</td>
      <td align=right nowrap>@{[&encode_mailer($date, 1, 1)]}</td>
    </tr>
    </table>
  </td>
</tr>
<tr>
  <td align=left><hr></td>
</tr>
<tr>
  <td>
    <table width=100% border=0 cellspacing=0 cellpadding=0>
    <tr>
      <td align=left valign=top nowrap width=60><strong>@{[&convert_mailer(t_("差出人"))]}:</strong></td>
      <td align=left valign=top><strong>@{[&encode_mailer($from, 1, 1)]}</strong></td>
    </tr>
$end_tag
    <tr>
      <td align=left valign=top nowrap>@{[&convert_mailer(t_("添付"))]}:</td>
      <td align=left valign=top>@{[&encode_mailer($attach, 1, 1)]}</td>
    </tr>
    </table>
  </td>
</tr>
<tr>
  <td align=left>&nbsp;</td>
</tr>
<tr>
  <td align=left id=body>
$tag
end_tag
		

		} else {
			&_warn($session, "get_sys_custom");
			return(undef);
		}
	} else {
		&_warn($session, "storable_retrieve");
		return(undef);
	}

	&_logger($session, $imaps, $logger);

	return($tag);
}

sub print_detail_to_txt($$$$) {
	my ($session, $imaps, $fid, $uid) = @_;
	my $logger   = &_logger_init($session);
	my $module   = DA::IS::get_module($session);
	my $timezone = &get_timezone($session, $imaps);
	my $h12      = &get_time_style($session, $imaps);
	my $tzview   = &get_tz_view($session, $imaps);
	my $lang     = &get_user_lang($session, $imaps);
	my $tag;
	my $end_tag;
	my $save_encode = $imaps->{custom}->{save_mail_to_library_encode} || "UTF-8";
	if ($uid) {
		$uid = &_select_uidlst_common($session, $fid, $uid, undef, 2);
	}
	my $file = "$fid\.$uid\.detail";;
	if (my $detail = &storable_retrieve($session, $file)) {
		if (my $allow = &get_sys_custom($session, "htmlmail_allow_tag")) {
			my $subject = t_('件名:').$detail->{subject}."\n";
			my $date    = t_('日付:').&format_date($detail->{date}, 3, $timezone, "", "", $lang, $h12, $tzview)."\n";
			my $from    = t_('差出人:').&_make_address_field($detail->{from})."\n";
			my $to      = t_('宛先:').&_make_address_field($detail->{to})."\n";
			my $cc      = t_('Cc:').&_make_address_field($detail->{cc})."\n";
			my ($attach, $body);

			foreach my $aid (sort {$a <=> $b} keys %{$detail->{attach}}) {
				$attach .= "$detail->{attach}->{$aid}->{name},";
			}
			$attach =~ s/\,+$//g;
			$attach = t_('添付:').$attach."\n\n";
            my $test_warp = 0;   
            if ($detail->{body}->{html} ne "") {
                $body = $detail->{body}->{html};
                $body = &_extract_htmlmail_part($session, $module, $allow,$body, &mailer_charset(), "detail", $imaps->{custom});
                $body = &_html2text($body, &mailer_charset())
            } else {
				$body = $detail->{body}->{text};
            }
			$body = $body."\n\n";
			my $date_time = &format_date($detail->{date}, 0,$session->{timezone});
			$date_time =~ s/[\/:]//g;
			my $subject_title = $subject;
			my $charset = DA::Charset::detect(\$subject_title);
			$subject_title = DA::Charset::sub_chars($subject_title, $charset, 100);
			$subject_title =~s/[\\\/:\*\?\"<>\|\s]+/_/g;
			my $file_name = $date_time . '_' . $subject_title . ".txt";
			
			if (DA::System::file_open(\*OUT, ">" . "$DA::Vars::p->{user_dir}/$session->{user}/temp/$file_name")) {
				print OUT DA::Charset::convert_to(\$subject, $save_encode);
				print OUT DA::Charset::convert_to(\$from, $save_encode);
				print OUT DA::Charset::convert_to(\$to, $save_encode);
				print OUT DA::Charset::convert_to(\$cc, $save_encode);
				print OUT DA::Charset::convert_to(\$date, $save_encode);
				print OUT DA::Charset::convert_to(\$attach, $save_encode);
				print OUT DA::Charset::convert_to(\$body, $save_encode);
				if (!close(OUT)) {
					&_warn($session, "Can't close file");
				}
			} else {
				&_warn($session, "Can't open file");
			}
			my $result = {
				"file" => $file_name
			};
			return $result;
		} else {
			&_warn($session, "get_sys_custom");
			return(undef);
		}
	} else {
		&_warn($session, "storable_retrieve $fid $uid");
		return(undef);
	}


	&_logger($session, $imaps, $logger);

	return($tag);
}

sub print_header($$$$) {
	my ($session, $imaps, $fid, $uid) = @_;
	my $logger = &_logger_init($session);
	my $tag;

	if (my $folders = &storable_retrieve($session, "folders")) {
		my $hc = { "fid" => $fid, "uid" => $uid };
		my $result = &header($session, $imaps, $folders, $hc);
		if ($result->{error}) {
			&_warn($session, "header");
			return(undef);
		} else {
			my $header = DA::Charset::convert_to(\$result->{header}, &mailer_charset());
			   $header = &encode_mailer($header, 2, 1);
			$tag = "<pre>$header</pre>";
		}
	} else {
		&_warn($session, "storable_retrieve");
		return(undef);
	}

	&_logger($session, $imaps, $logger);

	return($tag);
}

sub list_order($$) {
	my ($mail, $type) = @_;
	my $order = &check_list_order($mail);
	my @meta = qw (
		fid uid srid sno replied forwarded deleted toself internal priority seen attachment flagged className open_m type reserve1 reserve2 backup_maid backup_org_clrRdir
	);
	my @class = qw (
		priority flagged seen attachment toself deleted replied forwarded
	);
	my @data;

	foreach my $o (split(/\|/, $order)) {
		if ($o eq "from") {
			if ($type =~ /^(?:$TYPE_SENT|$TYPE_DRAFT|$TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) {	
				push(@data, "to");
			} else {
				push(@data, $o);
			}
		} else {
			push(@data, $o);
		}
	}

	return(\@meta, \@class, \@data);
}

sub check_list_order($) {
	my ($mail) = @_;
	my ($default, $items, $names) = &all_list_items();
	my $order;

	if (!defined $mail->{list_order}) {
		$order = $default;
	} else {
		$order = $mail->{list_order};
	}

	return($order);
}

sub all_list_items {
	my $default = "priority|flagged|seen|attachment|from|date|subject";
	my $items   = [qw(priority flagged seen attachment from date subject size)];
	my $names   = {
		'priority'   => T_($MAIL_VALUE->{TITLE}->{PRIORITY}),
		'seen'       => T_($MAIL_VALUE->{TITLE}->{READ}),
		'attachment' => T_($MAIL_VALUE->{TITLE}->{ATTACH}),
		'flagged'    => T_($MAIL_VALUE->{TITLE}->{FLAGGED}),
		'from'       => T_($MAIL_VALUE->{TITLE}->{FROM}) . "/" . T_($MAIL_VALUE->{TITLE}->{TO}),
		'date'       => T_($MAIL_VALUE->{TITLE}->{SENTDATE}),
		'subject'    => T_($MAIL_VALUE->{TITLE}->{SUBJECT}),
		'size'       => T_($MAIL_VALUE->{TITLE}->{SIZE})
	};

	return($default, $items, $names);
}

## COMMON Method ------------------------------------------>>
sub _create_baggage($$$$) {
	my ($session, $imaps, $fld, $maid) = @_;
	my $key = "$session->{sid}\.ma_addr\-$fld\:$maid";
	my $bag = DA::Address::Baggage->new();
	DA::IS::save_temp_db($session, $bag, $key);

	return(1);
}

sub _get_baggage($$$$) {
	my ($session, $imaps, $fld, $maid) = @_;
	my $key = "$session->{sid}\.ma_addr\-$fld\:$maid";
	my $bag = DA::IS::get_temp_db($session, $key);

	return($bag);
}

sub _loop_baggage($$$) {
	my ($session, $imaps, $bag) = @_;
	my $it = $bag->iterator();
	my @list;

	while(my $card = $it->next()) {
		if ($card->is_group) {
			my $id   = &convert_mailer($card->value('id'));
			my $lang = &convert_mailer($card->value('lang'));
			my $gid  = &_make_gid($id, $lang);

			if (my $c = &get_card($session, $imaps, $gid, 2)) {
				push(@list, $c);
			}
		} else {
			my $type  = $card->card_type;
			my $id    = &convert_mailer($card->value('id'));
			my $name  = &convert_mailer($card->value('name'));
			my $addr  = &convert_mailer($card->value('mail'));
			my $title = &convert_mailer($card->value('title'));
			my $pos   = &convert_mailer($card->value('title_name_pos'));
			my $lang  = &convert_mailer($card->value('lang'));

			if (my $c = &get_card($session, $imaps, $id, $type, $name, $addr, $title, $pos, $lang)) {
				push(@list, $c);
			}
		}
	}

	return(\@list);
}

sub _root($$) {
	my ($session, $imaps) = @_;
	my $path = "ROOT";
	my $name = "INSUITE Unified Mailer";
	my $type = $TYPE_ROOT;
	my $info = {
		"path"		=> $path,
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 2,
		"icon"		=> "$session->{icon_rdir}/ico_fc_mail.$session->{icon_ext}",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 0,
		"search"    => 0,
		"update"	=> 0,
		"create"	=> 0,
		"rename"	=> 0,
		"delete"	=> 0,
		"move"		=> 0,
		"import"    => 0,
		"export"    => 0,
		"filter"    => 0,
		"rebuild"   => 0,
		"trash"     => 0,
		"move_f"	=> 0,
		"move_m"	=> 0,
		"open_m"    => 0,
		"edit_m"    => 0,
		"trash_m"   => 0,
		"messages_e"=> 0,
		"unseen_e"  => 0,
		"recent_e"  => 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_ROOT,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _server($$) {
	my ($session, $imaps) = @_;
	my $root = &_root($session, $imaps);
	my $name = $imaps->{imap}->{name};
	my $path = $root->{path} . "#" . &_utf7_encode($session, $imaps, $name);
	my $type = $TYPE_SERVER;
	my $info = {
		"path"		=> $path,
		"folder"	=> "",
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 1,
		"icon"		=> "$session->{img_rdir}/ico_fc_emlserver.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 0,
		"search"    => 0,
		"update"	=> 0,
		"create"	=> &check_imap_info($session, $imaps, "create_server") ? 1 : 0,
		"rename"	=> 0,
		"delete"	=> 0,
		"move"		=> 0,
		"import"    => 0,
		"export"    => 0,
		"filter"    => 0,
		"rebuild"   => 0,
		"trash"     => 0,
		"move_f"	=> &check_imap_info($session, $imaps, "create_server") ? 1 : 0,
		"move_m"	=> 0,
		"open_m"    => 0,
		"edit_m"    => 0,
		"trash_m"   => 0,
		"sales_m"   => 0,
		"messages_e"=> 0,
		"unseen_e"  => 0,
		"recent_e"  => 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_SERVER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _local_server($$) {
	my ($session, $imaps) = @_;
	my $custom = $imaps->{custom};

	my $name;
	if ($custom->{local_server} eq "") {
		$name = uc($DA::Vars::p->{package_name});
	} else {
		$name = $custom->{local_server};
	}

	my $root = &_root($session, $imaps);
	my $path = $root->{path} . "#" . &_utf7_encode($session, $imaps, $name); 
	my $type = $TYPE_LOCAL_SERVER;
	my $info = {
		"path"		=> $path,
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 2,
		"icon"		=> "$session->{img_rdir}/ico_fc_emlserver.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 0,
		"search"    => 0,
		"update"	=> 0,
		"create"	=> 0,
		"rename"	=> 0,
		"delete"	=> 0,
		"move"		=> 0,
		"import"    => 0,
		"export"    => 0,
		"filter"    => 0,
		"rebuild"   => 0,
		"trash"     => 0,
		"move_f"	=> 0,
		"move_m"	=> 0,
		"open_m"    => 0,
		"edit_m"    => 0,
		"trash_m"   => 0,
		"sales_m"   => 0,
		"messages_e"=> 0,
		"unseen_e"  => 0,
		"recent_e"  => 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_LOCAL_SERVER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _local_folder($$) {
	my ($session, $imaps) = @_;
	my $custom = $imaps->{custom};

	my $name;
	if ($custom->{local_folder} eq "") {
		$name = &convert_mailer(t_('一時保管'));
	} else {
		$name = $custom->{local_folder};
	}

	my $parent = _local_server($session, $imaps);
	my $path   = $parent->{path} . "#" . &_utf7_encode($session, $imaps, $name);
	my $type   = $TYPE_LOCAL_FOLDER;
	my $info   = {
		"path"		=> $path,
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 2,
		"icon"		=> "$session->{img_rdir}/ico_14_folder_c.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 1,
		"search"    => 0,
		"update"	=> 0,
		"create"	=> 0,
		"rename"	=> 0,
		"delete"	=> 0,
		"move"		=> 0,
		"import"    => 0,
		"export"    => 0,
		"filter"    => 0,
		"rebuild"   => 0,
		"trash"     => 0,
		"move_f"	=> 0,
		"move_m"	=> 0,
		"open_m"    => 1,
		"edit_m"    => 0,
		"trash_m"   => 0,
		"sales_m"   => 0,
		"messages_e"=> 0,
		"unseen_e"  => 0,
		"recent_e"  => 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_LOCAL_FOLDER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _backup_folder($$) {
	my ($session, $imaps) = @_;
	my $custom = $imaps->{custom};

	my $name;
	if ($custom->{backup_folder} eq "") {
		$name = &convert_mailer(t_('自動バックアップ'));
	} else {
		$name = $custom->{backup_folder};
	}

	my $parent = _local_server($session, $imaps);
	my $path   = $parent->{path} . "#" . &_utf7_encode($session, $imaps, $name);
	my $type   = $TYPE_BACKUP_FOLDER;
	my $info   = {
		"path"      => $path,
		"name"      => $name,
		"type"      => $type,
		"old_type"  => 2,
		"icon"      => "$session->{img_rdir}/ico_14_folder_c.gif",
		"alt"       => "",
		"select"    => 1,
		"search"    => 0,
		"update"    => 0,
		"create"    => 0,
		"rename"    => 0,
		"delete"    => 0,
		"move"      => 0,
		"import"    => 0,
		"export"    => 0,
		"filter"    => 0,
		"rebuild"   => 0,
		"trash"     => 1,
		"move_f"    => 0,
		"move_m"    => 0,
		"open_m"    => 2,
		"edit_m"    => 1,
		"trash_m"   => 0,
		"sales_m"   => 0,
		"messages_e"=> 0,
		"unseen_e"  => 0,
		"recent_e"  => 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root" => $SORT_BACKUP_FOLDER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name" => &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _inbox($$) {
	my ($session, $imaps) = @_;
	my $conf = $imaps->{imap};

	my ($name, $view);
	my $parent = &_server($session, $imaps);
	if ($conf->{view} eq "on") {
		if ($conf->{inbox_view} eq "") {
			$name = "INBOX";
		} else {
			$name = $conf->{inbox_view};
			$view = $parent->{path} . "#"
			      . &_utf7_encode($session, $imaps, $conf->{inbox_view});
		}
	} else {
		$name = "INBOX";
	}

	my $path   = $parent->{path} . "#INBOX";
	my $folder = &_decode($session, $imaps, $path);
	my $type   = $TYPE_INBOX;
	my $info   = {
		"path"		=> $path,
		"view"		=> $view,
		"folder"	=> $folder,
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 0,
		"specific"  => "inbox",
		"icon"		=> "$session->{img_rdir}/ico_fc_inbox.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 1,
		"search"    => 1,
		"update"	=> 1,
		"create"	=> &check_imap_info($session, $imaps, "create_inbox") ? 1 : 0,
		"rename"	=> ($conf->{view} eq "on" && $conf->{inbox_view} ne "") ? 1 : 0,
		"delete"	=> 0,
		"move"		=> 0,
		"import"    => 1,
		"export"    => 1,
		"filter"    => 1,
		"rebuild"   => 1,
		"trash"     => 0,
		"move_f"	=> &check_imap_info($session, $imaps, "create_inbox") ? 1 : 0,
		"move_m"	=> 1,
		"open_m"    => 1,
		"edit_m"    => 0,
		"trash_m"   => ($imaps->{mail}->{delete}) ? 0 : 1,
		"sales_m"   => 1,
		"messages_e"=> ($imaps->{mail}->{count} =~ /^(all|half)$/) ? 1 : 0,
		"unseen_e"  => ($imaps->{mail}->{count} =~ /^(all)$/) ? 1 : 0,
		"recent_e"  => ($imaps->{mail}->{recent} =~ /^(on)$/) ? 1 : 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_FOLDER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _draft($$) {
	my ($session, $imaps) = @_;
	my $conf = $imaps->{imap};

	my ($name, $view, $parent);
	if (&check_imap_info($session, $imaps, "create_server")) {
		$parent = &_server($session, $imaps);
	} else {
		$parent = &_inbox($session, $imaps);
	}
	if ($conf->{view} eq "on") {
		if ($conf->{draft_view} eq "") {
			$name = $conf->{draft};
		} else {
			$name = $conf->{draft_view};
			$view = $parent->{path} . "#"
			      . &_utf7_encode($session, $imaps, $conf->{draft_view});
		}
	} else {
		$name = $conf->{draft};
	}

	my $path   = $parent->{path} . "#" . &_utf7_encode($session, $imaps, $conf->{draft});
	my $folder = &_decode($session, $imaps, $path);
	my $type   = $TYPE_DRAFT;
	my $info   = {
		"path"		=> $path,
		"view"		=> $view,
		"folder"	=> $folder,
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 0,
		"specific"  => "draft",
		"icon"		=> "$session->{img_rdir}/ico_fc_draft.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 1,
		"search"    => 1,
		"update"	=> 1,
		"create"	=> 0,
		"rename"	=> 1,
		"delete"	=> 0,
		"move"		=> 0,
		"import"    => 1,
		"export"    => 1,
		"filter"    => 1,
		"rebuild"   => 1,
		"trash"     => 0,
		"move_f"	=> 0,
		"move_m"    => 0,
		"open_m"    => 2,
		"edit_m"    => 1,
		"trash_m"   => ($imaps->{mail}->{delete}) ? 0 : 1,
		"sales_m"   => 1,
		"messages_e"=> ($imaps->{mail}->{count} =~ /^(all|half)$/) ? 1 : 0,
		"unseen_e"  => 0,
		"recent_e"  => 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_FOLDER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _sent($$) {
	my ($session, $imaps) = @_;
	my $conf = $imaps->{imap};

	my ($name, $view, $parent);
	if (&check_imap_info($session, $imaps, "create_server")) {
		$parent = &_server($session, $imaps);
	} else {
		$parent = &_inbox($session, $imaps);
	}
	if ($conf->{view} eq "on") {
		if ($conf->{sent_view} eq "") {
			$name = $conf->{sent};
		} else {
			$name = $conf->{sent_view};
		}
		$view = $parent->{path} . "#"
		      . &_utf7_encode($session, $imaps, $conf->{sent_view});
	} else {
		$name = $conf->{sent};
	}

	my $path   = $parent->{path} . "#" . &_utf7_encode($session, $imaps, $conf->{sent});
	my $folder = &_decode($session, $imaps, $path);
	my $type   = $TYPE_SENT;
	my $info   = {
		"path"      => $path,
		"view"		=> $view,
		"folder"	=> $folder,
		"name"      => $name,
		"type"      => $type,
		"old_type"  => 0,
		"specific"  => "sent",
		"icon"		=> "$session->{img_rdir}/ico_fc_sent.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 1,
		"search"    => 1,
		"update"	=> 1,
		"create"    => 0,
		"rename"    => 1,
		"delete"    => 0,
		"move"      => 0,
		"import"    => 1,
		"export"    => 1,
		"filter"    => 1,
		"rebuild"   => 1,
		"trash"     => 0,
		"move_f"    => 0,
		"move_m"    => 0,
		"open_m"    => 1,
		"edit_m"    => 1,
		"trash_m"   => ($imaps->{mail}->{delete}) ? 0 : 1,
		"sales_m"   => 1,
		"messages_e"=> ($imaps->{mail}->{count} =~ /^(all|half)$/) ? 1 : 0,
		"unseen_e"  => 0,
		"recent_e"  => 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_FOLDER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _trash($$) {
	my ($session, $imaps) = @_;
	my $conf = $imaps->{imap};

	my ($name, $view, $parent);
	if (&check_imap_info($session, $imaps, "create_server")) {
		$parent = &_server($session, $imaps);
	} else {
		$parent = &_inbox($session, $imaps);
	}
	if ($conf->{view} eq "on") {
		if ($conf->{trash_view} eq "") {
			$name = $conf->{trash};
		} else {
			$name = $conf->{trash_view};
			$view = $parent->{path} . "#"
			      . &_utf7_encode($session, $imaps, $conf->{trash_view});
		}
	} else {
		$name = $conf->{trash};
	}

	my $path   = $parent->{path} . "#" . &_utf7_encode($session, $imaps, $conf->{trash});
	my $folder = &_decode($session, $imaps, $path);
	my $type   = $TYPE_TRASH;
	my $info   = {
		"path"		=> $path,
		"view"		=> $view,
		"folder"	=> $folder,
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 0,
		"specific"  => "trash",
		"icon"		=> "$session->{img_rdir}/ico_fc_trashcan.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 1,
		"search"    => 1,
		"update"	=> 1,
		"create"	=> 0,
		"rename"	=> 1,
		"delete"	=> 0,
		"move"		=> 0,
		"import"    => 1,
		"export"    => 1,
		"filter"    => 1,
		"rebuild"   => 1,
		"trash"     => 1,
		"move_f"	=> 0,
		"move_m"	=> 1,
		"open_m"    => 1,
		"edit_m"    => 0,
		"trash_m"   => 0,
		"sales_m"   => 1,
		"messages_e"=> ($imaps->{mail}->{count} =~ /^(all|half)$/) ? 1 : 0,
		"unseen_e"  => ($imaps->{mail}->{count} =~ /^(all)$/) ? 1 : 0,
		"recent_e"  => ($imaps->{mail}->{recent} =~ /^(on)$/) ? 1 : 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_FOLDER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _spam($$) {
	my ($session, $imaps) = @_;
	my $conf = $imaps->{imap};

	my ($name, $view, $parent);
	if (&check_imap_info($session, $imaps, "create_server")) {
		$parent = &_server($session, $imaps);
	} else {
		$parent = &_inbox($session, $imaps);
	}
	if ($conf->{view} eq "on") {
		if ($conf->{spam_view} eq "") {
			$name = $conf->{spam};
		} else {
			$name = $conf->{spam_view};
			$view = $parent->{path} . "#"
			      . &_utf7_encode($session, $imaps, $conf->{spam_view});
		}
	} else {
		$name = $conf->{spam};
	}

	my $path   = $parent->{path} . "#" . &_utf7_encode($session, $imaps, $conf->{spam});
	my $folder = &_decode($session, $imaps, $path);
	my $type   = $TYPE_SPAM;
	my $info   = {
		"path"		=> $path,
		"view"		=> $view,
		"folder"	=> $folder,
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 0,
		"specific"  => "spam",
		"icon"		=> "$session->{img_rdir}/ico_fc_spam.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 1,
		"search"    => 1,
		"update"	=> 1,
		"create"	=> 0,
		"rename"	=> 1,
		"delete"	=> 0,
		"move"		=> 0,
		"import"    => 1,
		"export"    => 1,
		"filter"    => 1,
		"rebuild"   => 1,
		"trash"     => 1,
		"move_f"	=> 0,
		"move_m"	=> 1,
		"open_m"    => 1,
		"edit_m"    => 0,
		"trash_m"   => 0,
		"sales_m"   => 1,
		"messages_e"=> ($imaps->{mail}->{count} =~ /^(all|half)$/) ? 1 : 0,
		"unseen_e"  => ($imaps->{mail}->{count} =~ /^(all)$/) ? 1 : 0,
		"recent_e"  => ($imaps->{mail}->{recent} =~ /^(on)$/) ? 1 : 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_FOLDER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _default($$$) {
	my ($session, $imaps, $folder) = @_;
	my $path = &_encode($session, $imaps, $folder);
	my $name = &_extract_name($session, $imaps, $folder);
	my $type = $TYPE_DEFAULT;
	my $info = {
		"path"		=> $path,
		"folder"	=> $folder,
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 0,
		"icon"		=> "$session->{img_rdir}/ico_14_folder_c.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 1,
		"search"    => 1,
		"update"	=> 1,
		"create"	=> 1,
		"rename"	=> 1,
		"delete"	=> 1,
		"move"		=> 1,
		"import"    => 1,
		"export"    => 1,
		"filter"    => 1,
		"rebuild"   => 1,
		"trash"     => 0,
		"move_f"	=> 1,
		"move_m"	=> 1,
		"open_m"    => 1,
		"edit_m"    => 0,
		"trash_m"   => ($imaps->{mail}->{delete}) ? 0 : 1,
		"sales_m"   => 1,
		"messages_e"=> ($imaps->{mail}->{count} =~ /^(all|half)$/) ? 1 : 0,
		"unseen_e"  => ($imaps->{mail}->{count} =~ /^(all)$/) ? 1 : 0,
		"recent_e"  => ($imaps->{mail}->{recent} =~ /^(on)$/) ? 1 : 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_FOLDER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _mailbox($$$) {
	my ($session, $imaps, $folder) = @_;
	my $path = &_encode($session, $imaps, $folder);
	my $name = &_extract_name($session, $imaps, $folder);
	my $type = $TYPE_MAILBOX;
	my $info = {
		"path"		=> $path,
		"folder"	=> $folder,
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 0,
		"icon"		=> "$session->{img_rdir}/ico_14_folder_c.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 1,
		"search"    => 1,
		"update"	=> 1,
		"create"	=> 0,
		"rename"	=> 1,
		"delete"	=> 1,
		"move"		=> 1,
		"import"    => 1,
		"export"    => 1,
		"filter"    => 1,
		"rebuild"   => 1,
		"trash"     => 0,
		"move_f"	=> 0,
		"move_m"	=> 1,
		"open_m"    => 1,
		"edit_m"    => 0,
		"trash_m"   => ($imaps->{mail}->{delete}) ? 0 : 1,
		"sales_m"   => 1,
		"messages_e"=> ($imaps->{mail}->{count} =~ /^(all|half)$/) ? 1 : 0,
		"unseen_e"  => ($imaps->{mail}->{count} =~ /^(all)$/) ? 1 : 0,
		"recent_e"  => ($imaps->{mail}->{recent} =~ /^(on)$/) ? 1 : 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_FOLDER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _cabinet($$$) {
	my ($session, $imaps, $folder) = @_;
	my $path = &_encode($session, $imaps, $folder);
	my $name = &_extract_name($session, $imaps, $folder);
	my $type = $TYPE_CABINET;
	my $info = {
		"path"		=> $path,
		"folder"	=> $folder,
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 1,
		"icon"		=> "$session->{img_rdir}/ico_fc_cabinet.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 0,
		"search"    => 0,
		"update"	=> 0,
		"create"	=> 1,
		"rename"	=> 1,
		"delete"	=> 1,
		"move"		=> 1,
		"import"    => 0,
		"export"    => 0,
		"filter"    => 0,
		"rebuild"   => 0,
		"trash"     => 0,
		"move_f"	=> 1,
		"move_m"	=> 0,
		"open_m"    => 0,
		"edit_m"    => 0,
		"trash_m"   => 0,
		"sales_m"   => 0,
		"messages_e"=> 0,
		"unseen_e"  => 0,
		"recent_e"  => 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_FOLDER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _dummy($$$) {
	my ($session, $imaps, $folder) = @_;
	my $path = &_encode($session, $imaps, $folder);
	my $name = &_extract_name($session, $imaps, $folder);
	my $type = $TYPE_DEFAULT;
	my $info = {
		"path"      => $path,
		"folder"    => $folder,
		"name"      => $name,
		"type"      => $type,
		"dummy"     => 1,
		"old_type"  => 0,
		"icon"      => "$session->{img_rdir}/ico_14_folder_c.gif",
		"alt"       => "",
		"hidden"    => 0,
		"select"    => 0,
		"search"    => 0,
		"update"    => 0,
		"create"    => 0,
		"rename"    => 0,
		"delete"    => 0,
		"move"      => 0,
		"import"    => 0,
		"export"    => 0,
		"filter"    => 0,
		"rebuild"   => 0,
		"trash"     => 0,
		"move_f"    => 0,
		"move_m"    => 0,
		"open_m"    => 0,
		"edit_m"    => 0,
		"trash_m"   => 0,
		"sales_m"   => 0,
		"messages_e"=> 0,
		"unseen_e"  => 0,
		"recent_e"  => 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root" => $SORT_FOLDER,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name" => &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _portal($$) {
	my ($session, $imaps) = @_;
	my $name   = &convert_mailer(t_('新着メール'));
	my $parent = &_server($session, $imaps);
	my $path   = $parent->{path} . "#" . &_utf7_encode($session, $imaps, $name);
	my $type   = $TYPE_PORTAL;
	my $info   = {
		"path"		=> $path,
		"name"		=> $name,
		"type"		=> $type,
		"old_type"  => 2,
		"icon"		=> "$session->{img_rdir}/ico_14_folder_c.gif",
		"alt"		=> "",
		"hidden"    => 0,
		"select"	=> 1,
		"search"    => 0,
		"update"	=> 0,
		"create"	=> 0,
		"rename"	=> 0,
		"delete"	=> 0,
		"move"		=> 0,
		"import"    => 0,
		"export"    => 0,
		"filter"    => 0,
		"rebuild"   => 0,
		"trash"     => 0,
		"move_f"	=> 0,
		"move_m"	=> 0,
		"open_m"    => 1,
		"edit_m"    => 0,
		"trash_m"   => 0,
		"sales_m"   => 0,
		"messages_e"=> 0,
		"unseen_e"  => 0,
		"recent_e"  => 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root"	=> $SORT_PORTAL,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name"	=> &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _join($$) {
	my ($session, $imaps) = @_;
	my $name   = &convert_mailer(t_('結合メール'));
	my $parent = &_server($session, $imaps);
	my $path   = $parent->{path} . "#" . &_utf7_encode($session, $imaps, $name);
	my $type   = $TYPE_JOIN;
	my $info   = {
		"path"      => $path,
		"name"      => $name,
		"type"      => $type,
		"old_type"  => 2,
		"icon"      => "$session->{img_rdir}/ico_14_folder_c.gif",
		"alt"       => "",
		"hidden"    => 1,
		"select"    => 0,
		"search"    => 0,
		"update"    => 0,
		"create"    => 0,
		"rename"    => 0,
		"delete"    => 0,
		"move"      => 0,
		"import"    => 0,
		"export"    => 0,
		"filter"    => 0,
		"rebuild"   => 0,
		"trash"     => 0,
		"move_f"    => 0,
		"move_m"    => 0,
		"open_m"    => 1,
		"edit_m"    => 0,
		"trash_m"   => 0,
		"sales_m"   => 0,
		"messages_e"=> 0,
		"unseen_e"  => 0,
		"recent_e"  => 0,
		"depth"     => &_path2depth($session, $imaps, $path),
		"length"    => &_path2length($session, $imaps, $path),
		"sort_root" => $SORT_JOIN,
		"sort_level"=> &_path2level($session, $imaps, $path, $type),
		"sort_name" => &_utf7_decode($session, $imaps, $path)
	};

	return($info);
}

sub _is_inbox($$$) {
	my ($session, $imaps, $folder) = @_;
	my $path = &_encode($session, $imaps, $folder);
	my $info = &_inbox($session, $imaps);
	my $inbox;

	if ($info->{path} eq $path) {
		$inbox = 1;
	} elsif ($info->{view} eq $path && $info->{view} ne "") {
		$inbox = 2;
	} else {
		$inbox = 0;
	}

	return($inbox);
}

sub _is_draft($$$) {
	my ($session, $imaps, $folder) = @_;
	my $path = &_encode($session, $imaps, $folder);
	my $info = &_draft($session, $imaps);
	my $draft;

	if ($info->{path} eq $path) {
		$draft = 1;
	} elsif ($info->{view} eq $path && $info->{view} ne "") {
		$draft = 2;
	} else {
		$draft = 0;
	}

	return($draft);
}

sub _is_sent($$$) {
	my ($session, $imaps, $folder) = @_;
	my $path = &_encode($session, $imaps, $folder);
	my $info = &_sent($session, $imaps);
	my $sent;

	if ($info->{path} eq $path) {
		$sent = 1;
	} elsif ($info->{view} eq $path && $info->{view} ne "") {
		$sent = 2;
	} else {
		$sent = 0;
	}

	return($sent);
}

sub _is_trash($$$) {
	my ($session, $imaps, $folder) = @_;
	my $path = &_encode($session, $imaps, $folder);
	my $info = &_trash($session, $imaps);
	my $trash;

	if ($info->{path} eq $path) {
		$trash = 1;
	} elsif ($info->{view} eq $path && $info->{view} ne "") {
		$trash = 2;
	} else {
		$trash = 0;
	}

	return($trash);
}

sub _is_spam($$$) {
	my ($session, $imaps, $folder) = @_;
	my $path = &_encode($session, $imaps, $folder);
	my $info = &_spam($session, $imaps);
	my $spam;

	if ($imaps->{imap}->{spam} ne "" || $imaps->{imap}->{spam_view} ne "") {
		if ($info->{path} eq $path) {
			$spam = 1;
		} elsif ($info->{view} eq $path && $info->{view} ne "") {
			$spam = 2;
		} else {
			$spam = 0;
		}
	} else {
		$spam = 0;
	}

	return($spam);
}

sub _is_cabinet($$$$) {
	my ($session, $imaps, $folder, $type) = @_;
	my $cabinet;

	if (&check_imap_info($session, $imaps, "cabinet")) {
		if ($type eq $TYPE_CABINET) {
			$cabinet = 1;
		} else {
			$cabinet = 0;
		}
	} else {
		$cabinet = 0;
	}

	return($cabinet);
}

sub _is_mailbox($$$$) {
	my ($session, $imaps, $folder, $type) = @_;
	my $mailbox;

	if (&check_imap_info($session, $imaps, "cabinet")) {
		if ($type eq $TYPE_MAILBOX) {
			$mailbox = 1;
		} else {
			$mailbox = 0;
		}
	} else {
		$mailbox = 0;
	}

	return($mailbox);
}

sub is_local($$$) {
	my ($session, $imaps, $type) = @_;
	my $local;

	if ($type eq $TYPE_LOCAL_FOLDER) {
		$local = 1;
	} else {
		$local = 0;
	}

	return($local);
}

sub is_backup($$$) {
	my ($session, $imaps, $type) = @_;
	my $backup;

	if ($type eq $TYPE_BACKUP_FOLDER) {
		$backup = 1;
	} else {
		$backup = 0;
	}

	return($backup);
}

sub is_portal($$$) {
	my ($session, $imaps, $type) = @_;
	my $portal;

	if ($type eq $TYPE_PORTAL) {
		$portal = 1;
	} else {
		$portal = 0;
	}

	return($portal);
}

sub is_join($$$) {
	my ($session, $imaps, $type) = @_;
	my $join;

	if ($type eq $TYPE_JOIN) {
		$join = 1;
	} else {
		$join = 0;
	}
}

sub is_sp_target($$$) {
	my ($session, $imaps, $type) = @_;

	if ($type =~ /^($TYPE_INBOX|$TYPE_DRAFT|$TYPE_SENT|$TYPE_TRASH|$TYPE_SPAM|$TYPE_DEFAULT|$TYPE_MAILBOX|$TYPE_CABINET|$TYPE_PORTAL)$/) {
		return(1);
	} else {
		return(0);
	}
}

sub is_sp_top($$$) {
	my ($session, $imaps, $type) = @_;

	if ($type =~ /^($TYPE_INBOX|$TYPE_DRAFT|$TYPE_SENT|$TYPE_TRASH|$TYPE_SPAM|$TYPE_PORTAL)$/) {
		return(1);
	} else {
		return(0);
	}
}

sub _view_exists($$$) {
	my ($session, $imaps, $specific) = @_;
	my $view;

	if ($imaps->{imap}->{view} eq "on") {
		if ($specific) {
			if ($imaps->{imap}->{"$specific\_view"} eq "") {
				$view = 0;
			} else {
				$view = 1;
			}
		} else {
			$view = 0;
		}
	} else {
		$view = 0;
	}

	return($view);
}

sub _extract_name($$$) {
	my ($session, $imaps, $folder) = @_;
	my $conf = $imaps->{imap};
	my $separator = $conf->{separator};
	my @path = split(/\Q$separator\E/, $folder);
	my $name = &_utf7_decode($session, $imaps, $path[-1]);

	return($name);
}

sub _path2length($$$) {
	my ($session, $imaps, $path) = @_;
	my $length = length($path);

	return($length);
}

sub _path2depth($$$) {
	my ($session, $imaps, $path) = @_;
	my $depth = ($path =~ s/\#//g);

	return($depth);
}

sub _path2level($$$$) {
	my ($session, $imaps, $path, $type) = @_;
	my $name  = $imaps->{imap}->{name};
	my $inbox = "ROOT#" . &_utf7_encode($session, $imaps, $name) . "#INBOX";
	my $level;

	if ($path =~ /^\Q$inbox\E\#?/) {
		$level = 1000000 + $type;
	} else {
		$level = 2000000 + $type;
	}

	return($level);
}

sub _path2fid($$$$) {
	my ($session, $imaps, $folders, $path) = @_;

	my $fid;
	foreach my $f (sort {$a <=> $b} keys %{$folders}) {
		if ($folders->{$f}->{path} eq $path) {
			$fid = $folders->{$f}->{fid}; last;
		}
	}

	return($fid);
}

sub _path2parent($$$$) {
	my ($session, $imaps, $folders, $path) = @_;
	my $separator = $imaps->{imap}->{separator};
	my @parent = split(/\#/, $path); pop(@parent);
	my $parent = join("#", @parent);

	my $fid;
	foreach my $f (sort {$a <=> $b} keys %{$folders}) {
		if ($folders->{$f}->{path} eq $parent) {
			$fid = $folders->{$f}->{fid}; last;
	}
	}

	return($fid);
}

sub _path2child($$$$) {
	my ($session, $imaps, $folders, $path) = @_;
	my $separator = $imaps->{imap}->{separator};

	my ($parent_fid, $child_fid);
	foreach my $f (sort {$a <=> $b} keys %{$folders}) {
		if ($folders->{$f}->{path} eq $path) {
			$parent_fid = $folders->{$f}->{fid}; last;
		}
	}
	foreach my $f (sort {$a <=> $b} keys %{$folders}) {
		if ($folders->{$f}->{parent} eq $parent_fid) {
			$child_fid = $folders->{$f}->{fid}; last;
		}
	}

	return($child_fid);
}

sub _fid($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if ($fid eq 100000001) {
		my $info = &_inbox($session, $imaps);
		$fid = &_path2fid($session, $imaps, $folders, $info->{path});
	}

	return($fid);
}

sub _fid2path($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{path});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2folder($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;
	
	if (exists $folders->{$fid}) {
		if ($folders->{$fid}->{type} =~ /^1/  ) {
			return($folders->{$fid}->{folder});
		} elsif($folders->{$fid}->{type} ne $TYPE_BACKUP_FOLDER) {
			&_warn($session, "Folder is not IMAP [$fid:$folders->{$fid}->{type}]");
			return(undef);
		}
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2name($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{name});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2uidval($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		if ($folders->{$fid}->{type} =~ /^1/) {
			return($folders->{$fid}->{uidvalidity});
		} else {
			return(undef);
		}
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2parent($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}){
		return($folders->{$fid}->{parent});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2type($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;
	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{type});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2old_type($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{old_type});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2dummy($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{dummy});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2specific($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{specific});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2select($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{select});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2search($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{search});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2update($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{update});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2open_m($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{open_m});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2edit_m($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{edit_m});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2trash_m($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{trash_m});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _fid2lowers($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;
	my $path = &_fid2path($session, $imaps, $folders, $fid);
	my @lowers;

	foreach my $f (
		sort { $folders->{$a}->{sort_root} <=> $folders->{$b}->{sort_root}
			|| $folders->{$a}->{sort_level} <=> $folders->{$b}->{sort_level}
			|| $folders->{$a}->{sort_name} cmp $folders->{$b}->{sort_name} }
			keys %{$folders} ) {
		my $p = &_fid2path($session, $imaps, $folders, $f);
		if ($p =~ /^\Q$path\E\#/) {
			push(@lowers, $f);
		}
	}

	return(\@lowers);
}

sub _fid2custom($$$$) {
	my ($session, $imaps, $folders, $fid) = @_;

	if (exists $folders->{$fid}) {
		return($folders->{$fid}->{custom});
	} else {
		&_warn($session, "Can't found fid [$fid]");
		return(undef);
	}
}

sub _root_fid($$$) {
	my ($session, $imaps, $folders) = @_;
	my $fid;

	foreach my $f (keys %{$folders}) {
		if ($folders->{$f}->{type} eq $TYPE_ROOT) {
			$fid = $f; last;
		}
	}

	return($fid);
}

sub _inbox_fid($$$) {
	my ($session, $imaps, $folders) = @_;
	my $fid;

	foreach my $f (keys %{$folders}) {
		if ($folders->{$f}->{type} eq $TYPE_INBOX) {
			$fid = $f; last;
		}
	}

	return($fid);
}

sub _draft_fid($$$) {
	my ($session, $imaps, $folders) = @_;
	my $fid;

	foreach my $f (keys %{$folders}) {
		if ($folders->{$f}->{type} eq $TYPE_DRAFT) {
			$fid = $f; last;
		}
	}

	return($fid);
}

sub _sent_fid($$$) {
	my ($session, $imaps, $folders) = @_;
	my $fid;

	foreach my $f (keys %{$folders}) {
		if ($folders->{$f}->{type} eq $TYPE_SENT) {
			$fid = $f; last;
		}
	}

	return($fid);
}

sub _spam_fid($$$) {
	my ($session, $imaps, $folders) = @_;
	my $fid;

	foreach my $f (keys %{$folders}) {
		if ($folders->{$f}->{type} eq $TYPE_SPAM) {
			$fid = $f; last;
		}
	}

	return($fid);
}

sub _trash_fid($$$) {
	my ($session, $imaps, $folders) = @_;
	my $fid;

	foreach my $f (keys %{$folders}) {
		if ($folders->{$f}->{type} eq $TYPE_TRASH) {
			$fid = $f; last;
		}
	}

	return($fid);
}

sub _local_fid($$$) {
	my ($session, $imaps, $folders) = @_;
	my $fid;

	foreach my $f (keys %{$folders}) {
		if ($folders->{$f}->{type} eq $TYPE_LOCAL_FOLDER) {
			$fid = $f; last;
		}
	}

	return($fid);
}

sub _backup_fid($$$) {
	my ($session, $imaps, $folders) = @_;
	my $fid;

	foreach my $f (keys %{$folders}) {
		if ($folders->{$f}->{type} eq $TYPE_BACKUP_FOLDER) {
			$fid = $f; last;
		}
	}

	return($fid);
}

sub _portal_fid($$$) {
	my ($session, $imaps, $folders) = @_;
	my $fid;

	foreach my $f (keys %{$folders}) {
		if ($folders->{$f}->{type} eq $TYPE_PORTAL) {
			$fid = $f; last;
		}
	}

	return($fid);
}

sub _join_fid($$$) {
	my ($session, $imaps, $folders) = @_;
	my $fid;

	foreach my $f (keys %{$folders}) {
		if ($folders->{$f}->{type} eq $TYPE_JOIN) {
			$fid = $f; last;
		}
	}

	return($fid);
}

sub _richtext2attachment($$) {
	my ($session, $imaps) = @_;

	if (DA::SmartPhone::isSmartPhoneUsed()) {
		return(0);
	} elsif ($imaps->{custom}->{richtext2attachment} eq "on") {
		return(1);
	} elsif ($imaps->{custom}->{richtext2attachment} eq "off") {
		return(0);
	} else {
		if ($imaps->{mail}->{richtext2attachment} eq "on") {
			return(1);
		} else {
			return(0);
		}
	}

	return(0);
}

sub _document_type($$$) {
	my ($session, $imaps, $module) = @_;
	my $type;
	if ($module->{share} eq "on") {
		$type = 1;
	} elsif ($module->{library} eq "on") {
		$type = 2;
	} else {
		$type = 0;
	}
	# セッションで保持されているフォルダを選択する
	if ($session->{foldersel}) {
		my ($s_call,$s_gid,$s_parent)=split(/:/,$session->{foldersel});
		if ($s_call eq 'share' && $module->{share} eq "on") {
			$type = 1;
		} elsif ($s_call eq 'library' && $module->{library} eq "on") {
			$type = 2;
		}
	}

	DA::Custom::rewrite_mail_attach_document_type($session,\$type);

	return($type);
}

sub _archive_type($$$) {
	my ($session, $imaps, $archive) = @_;
	my $tar = DA::System::bq_cmd("whereis -b tar");
	   $tar =~s/^tar://;
	   $tar =~s/(\s|\n|\r|\:)//g;
	my $zip = DA::System::bq_cmd("whereis -b zip");
	   $zip =~s/^zip://;
	   $zip =~s/(\s|\n|\r|\:)//g;
	my $lha = DA::System::bq_cmd("whereis -b lha");
	   $lha =~s/^lha://;
	   $lha =~s/(\s|\n|\r|\:)//g;
	my $mbox= 1;
	my $eml = 1;
	my $archive_on = {
		"tar" => ($tar && $imaps->{custom}->{archive_type}->{tar}) ? 1 : 0,
		"zip" => ($zip && $imaps->{custom}->{archive_type}->{zip}) ? 1 : 0,
		"lha" => ($lha && $imaps->{custom}->{archive_type}->{lha}) ? 1 : 0,
		"mbox"=> ($mbox && $imaps->{custom}->{archive_type}->{mbox}) ? 1 : 0,
		"eml" => ($eml && $imaps->{custom}->{archive_type}->{eml}) ? 1 : 0
	};

	my $type;
	if ($archive) {
		if ($archive_on->{$imaps->{mail}->{archive}}) {
			$type = $imaps->{mail}->{archive};
		} else {
			$type = ($archive_on->{lha}) ? 'lha'
			      : ($archive_on->{zip}) ? 'zip'
			      : ($archive_on->{tar}) ? 'tar'
			      : ($archive_on->{mbox}) ? 'mbox' : undef;
		}
	} else {
		if ($archive_on->{$imaps->{mail}->{archive_one}}) {
			$type = $imaps->{mail}->{archive_one};
		} else {
			$type = ($archive_on->{eml}) ? 'eml'
			      : ($archive_on->{mbox}) ? 'mbox' : undef;
		}
	}

	return($type);
}

sub _import_archive($$$$$$) {
	my ($session, $imaps, $folder, $file, $archive_type, $sec) = @_;
	my $tmpbase = "$session->{temp_dir}/$session->{sid}\.$sec\.emlarchive\.import";
	my $count = 0;
	if (-d $tmpbase) {
		DA::System::filepath_rmtree($tmpbase);
	}
	if (!-d $tmpbase) {
		DA::System::file_mkdir($tmpbase);
		DA::System::file_chmod(0770, $tmpbase);
	}

	if ($archive_type eq "mbox") {
		my ($cnt, $tag, $error);
		my $eml = "$tmpbase/append.eml";
		if (DA::System::file_open(\*IN, "< " . $file)) {
			while (my $line = <IN>) {
				if ($line =~ /^From\s.*\s\d+\:\d+\:\d+/) {
					$count++;
					if ($cnt) {
						if (&_append($session, $imaps, $folder, $eml)) {
							DA::System::file_unlink($eml);
						} else {
							&_warn($session, "_append [$eml]");
							$error = 1;
						}
					}
					$tag = $line; chomp($tag); $cnt ++;
				} elsif ($tag) {
					if (DA::System::file_open(\*OUT, ">> " . $eml)) {
						print OUT $line;
						if (!close(OUT)) {
							&_warn($session, "Can't close file [$eml]");
							$error = 1;
						}
					} else {
						&_warn($session, "Can't open file [$eml]");
						$error = 1;
					}
				}
				if ($error) {
					last;
				}
			}
			close(IN);

			if (!$error && -f $eml) {
				if (&_append($session, $imaps, $folder, $eml)) {
					DA::System::file_unlink($eml);
				} else {
					&_warn($session, "_append [$eml]");
					$error = 1;
				}
			}

			if ($error) {
				return(undef);
			}
		} else {
			&_warn($session, "Can't open file [$file]");
			return(undef);
		}
	} elsif ($archive_type eq "eml") {
		$count = 1;
		unless (&_append($session, $imaps, $folder, $file)) {
			&_warn($session, "_append [$file]");
			return(undef);
		}
	} else {
		my ($cmd);
		if ($archive_type eq 'tar') {
			$cmd = "tar xfz %1 -C %2";
		} elsif ($archive_type eq 'zip') {
			$cmd = "unzip %1 -d %2";
		} else {
			$cmd = "lha -xw=%2 %1";
		}

		my ($status, $stdout, $stderr) = DA::System::exe($cmd, $file, $tmpbase);
		if ($status || $stderr) {
			return(undef);
		} else {
			if (DA::System::dir_open(\*DIR, $tmpbase)) {
				my (%findex, @eindex);
				while (my $f = readdir(DIR)) {
					if ($f =~ /^(\.|\.\.)$/) {
						next;
					} elsif ($f =~ /^(\d+)\.eml$/ || $f =~ /^(\d{8}-\d{6}_.*)\.eml$/) {
						unless(-s "$tmpbase/$f"){
							&_warn($session, "empty_mail [$tmpbase/$f]");
							next;
						}
						$findex{$1} = 1;
						$count++;
					}
				}
				closedir(DIR);

				foreach my $f (sort {$a <=> $b} keys %findex) {
					unless (&_append($session, $imaps, $folder, "$tmpbase/$f\.eml")) {
						&_warn($session, "_append [$tmpbase/$f\.eml]");
						return(undef);
					}
				}
			}
		}
	}

	DA::System::filepath_rmtree($tmpbase);
	return($count);
}

sub _make_archive($$$$;$$$$$) {
	my ($session, $imaps, $uidlst, $uidval, $archive,$folders, $fid, $arc_name, $arc_filed) = @_;
	my $sec = (DA::OrgMail::check_org_mail_permit($session))?DA::OrgMail::get_gid($session):$session->{user};
	my $tmpbase = "$session->{temp_dir}/$session->{sid}\.$sec\.emlarchive";
	my $file;
	my $file_name;

	if (my $atype = &_archive_type($session, $imaps, $archive)) {
		my $ext;
		if ($atype eq "mbox") {
			$ext .= ".mbox";
		} elsif ($atype eq "tar") {
			$ext .= "";
		} elsif ($atype eq "zip") {
			$ext .= ".zip";
		} elsif ($atype eq "lha") {
			$ext .= ".lzh";
		} else {
			$ext .= ".eml";
		}

		if ($archive) {
			my $path;
			if ($atype eq 'mbox') {
				$path = "$DA::Vars::p->{user_dir}/$session->{user}"
				      . "/temp/mbx_archive_$sec";
			} else {
				$path = "$DA::Vars::p->{user_dir}/$session->{user}"
				      . "/temp/eml_archive_$sec";
			}

			if($arc_name){
				my $f_name;
				my $f_ext;
				my $folder = &_fid2folder($session, $imaps, $folders, $fid);
				my $arc_date = DA::CGIdef::get_date2($session,"Y4MMDD-HHMISS");
				if($archive eq "2"){
					my $separator = $imaps->{imap}->{separator};
					my @fn = split(/\Q$separator\E/, $folder);
					$f_name = '_' .&_utf7_decode($session, $imaps, $fn[-1]);
					$f_name =~s/[\\\/:\*\?\"<>\|\s]+/_/g;
				}
				if($atype eq 'tar'){
					$f_ext = '.tgz';
				}else{
					$f_ext = $ext;
				}
				$file_name = $arc_date .$f_name .$f_ext;
			}

			my $size  = 0;
			my $count = 0;
			my $fpath = $path . '-' . $uidval . $ext;
			my @path  = split(/\//, $fpath);
			my $apath = $path[-1];
			   $apath.= '.tgz' if ($atype eq 'tar');

			if (-f $fpath) {
				DA::System::file_unlink($fpath);
			}

			if($atype ne "mbox" && $arc_name){
				while (my @arc_tmp = splice(@{$arc_filed}, 0, $MAX_EXPORT_STN)){
					my @l = map( $_->{uid_number}, @arc_tmp);
					if (my $rfc822 = &_rfc822($session, $imaps, join(",", @l))) {
						# メールの一時保存
						unless (-d $tmpbase) {
							DA::System::file_mkdir($tmpbase);
						}
						DA::System::file_chmod(0770, $tmpbase);
						
						foreach my $arc_param (@arc_tmp){
							my $u = $arc_param->{uid_number};
							my $file    = "$u\.eml";
							my $tmpfile = "$tmpbase/$file";

							my $date_time = &format_date($arc_param->{date_field},0,$session->{timezone});
							$date_time =~ s/[\/:]//g;
							my $subject = $arc_param->{subject_field};
							if($subject ne ""){
								my $charset = DA::Charset::detect(\$subject);
								$subject = DA::Charset::sub_chars($subject, $charset, 100);
								$subject =~s/[\\\/:\*\?\"<>\|\s]+/_/g;
								$subject = DA::Charset::convert(\$subject, DA::Ajax::Mailer::mailer_charset(), "Shift_JIS");
							}
							my $f_name = $date_time ."_".$subject."_".$u."\.eml";
							my $tmp_name = "$tmpbase/$f_name";

							if (DA::System::file_open(\*EML, "> " . $tmpfile)) {
								print EML $rfc822->{$u};
								if (!close(EML)) {
									return(undef);
								}
								File::Copy::move(DA::Valid::check_path( $tmpfile ),$tmp_name);
								$size += (-s $tmpfile);
							} else {
								return(undef);
							}	
						}
						$count += @l + 0;
					
						if ($size > $MAX_EXPORT_SIZE || $count >= scalar(@{$uidlst})) {
							my $cmd;
							my $zip_type;
							if ($atype eq 'tar') {
								$cmd = "cd %1; tar rf %2 *";
							} elsif ($atype eq 'zip') {
								$cmd = "cd %1; zip -u %2 *";
							} else {
								$cmd = "cd %1; lha -a %2 *";
								$zip_type = "lha";
							}
							my ($status, $stdout, $stderr) = DA::System::exe($cmd, $tmpbase, $fpath);
							DA::System::filepath_rmtree($tmpbase);

							$stderr =~ s/^\s+//g;
							$stderr =~ s/\s+$//g;
							if($zip_type eq "lha"){
								$stderr =~ s/^17$//;
							}
							$stderr =~ s/zip warning\:[^\r\n]+zip not found or empty//g;
							if ($status || $stderr) {
								&_warn($session, "Can't make archive [$fpath] ($stderr)");
								return(undef);
							} else {
								$size  = 0;
								$count = 0;

								next;
							}
						}
					} else {
						&_warn($session, "_rfc822");
						return(undef);
					}
				}	
			}else {
				while (my @l = splice(@{$uidlst}, 0, $MAX_EXPORT_STN)) {
				if (my $rfc822 = &_rfc822($session, $imaps, join(",", @l))) {
					if ($atype eq "mbox") {
						foreach my $u (@l) {
							my %header;

							$rfc822->{$u} =~ s/\r\n/\n/g;
							if ($rfc822->{$u} =~ /[^\n]$/) {
								$rfc822->{$u} .= "\n";
							}
							DA::MailParser::header_parse(\($rfc822->{$u}), \%header, 'ISO-2022-JP');

							if ($header{err_code}) {
								&_warn($session, "Can't header parse [$u]");
								return(undef);
							} else {
								if (DA::System::file_open(\*MBOX, ">> $fpath")) {
									print MBOX "From $header{from_addr}[0] $header{date_time}\n";
									print MBOX $rfc822->{$u} . "\n";
									if (!close(MBOX)) {
										&_warn($session, "Can't close file [$fpath]");
										return(undef);
									}

								} else {
									&_warn($session, "Can't open file [$fpath]");
									return(undef);
								}
							}
						}
					} else {
						# メールの一時保存
						unless (-d $tmpbase) {
							DA::System::file_mkdir($tmpbase);
						}
						DA::System::file_chmod(0770, $tmpbase);

						foreach my $u (@l) {
							my $file    = "$u\.eml";
							my $tmpfile = "$tmpbase/$file";

							if (DA::System::file_open(\*EML, "> " . $tmpfile)) {
								print EML $rfc822->{$u};
								if (!close(EML)) {
									return(undef);
								}
								$size += (-s $tmpfile);
							} else {
								return(undef);
							}
						}
						$count += @l + 0;
						
						# アーカイブの作成
						if ($size > $MAX_EXPORT_SIZE || $count >= scalar(@{$uidlst})) {
							my $cmd;
							my $zip_type;
							if ($atype eq 'tar') {
								$cmd = "cd %1; tar rf %2 *";
							} elsif ($atype eq 'zip') {
								$cmd = "cd %1; zip -u %2 *";
							} else {
								$cmd = "cd %1; lha -a %2 *";
								$zip_type = "lha";
							}
							my ($status, $stdout, $stderr) = DA::System::exe($cmd, $tmpbase, $fpath);
							DA::System::filepath_rmtree($tmpbase);

							$stderr =~ s/^\s+//g;
							$stderr =~ s/\s+$//g;
							if($zip_type eq "lha"){
								$stderr =~ s/^17$//;
							}
							$stderr =~ s/zip warning\:[^\r\n]+zip not found or empty//g;
							if ($status || $stderr) {
								&_warn($session, "Can't make archive [$fpath] ($stderr)");
								return(undef);
							} else {
								$size  = 0;
								$count = 0;

								next;
							}
						}
					}
				} else {
					&_warn($session, "_rfc822");
					return(undef);
				}
			}
				
			}

			if (-f $fpath) {
				if ($atype eq 'tar') {
					DA::System::file_unlink($fpath . "\.tgz") if (-f $fpath . "\.tgz");
					DA::System::cmd("gzip -S .tgz %1", $fpath);
				}
				$file = $apath;
			}
		} else {
			my $path    = "$DA::Vars::p->{user_dir}/$session->{user}/temp";
			my $u       = $uidlst->[0];

			if($arc_name){
				my $date_time = &format_date($arc_filed->[0]->{date_field},0,$session->{timezone});
				$date_time =~ s/[\/:]//g;
				my $subject = $arc_filed->[0]->{subject_field};
				if($arc_filed->[0]->{subject_field} ne ""){
					my $charset = DA::Charset::detect(\$subject);
					$subject = DA::Charset::sub_chars($subject, $charset, 100);
					$subject =~s/[\\\/:\*\?\"<>\|\s]+/_/g;
				}
				$file_name = $date_time . '_' . $subject.'_' . $u . $ext;
			}
			my $fpath   = $path . '/' . $sec . '-' . $uidval . '-' . $u . $ext;
			my @path    = split(/\//, $fpath);
			my $apath   = $path[-1];
			if (-f $fpath) {
				DA::System::file_unlink($fpath);
			}

			if (my $rfc822 = &_rfc822($session, $imaps, $u)) {
				if ($atype eq "mbox") {
					my %header;

					$rfc822->{$u} =~ s/\r\n/\n/g;
					if ($rfc822->{$u} =~ /[^\n]$/) {
						$rfc822->{$u} .= "\n";
					}
					DA::MailParser::header_parse(\($rfc822->{$u}), \%header, 'ISO-2022-JP');
					if ($header{err_code}) {
						&_warn($session, "Can't header parse [$u]");
						return(undef);
					} else {
						if (DA::System::file_open(\*MBOX, ">> $fpath")) {
							print MBOX "From $header{from_addr}[0] $header{date_time}\n";
							print MBOX $rfc822->{$u} . "\n";
							if (!close(MBOX)) {
								&_warn($session, "Can't close file [$fpath]");
								return(undef);
							}
						} else {
							&_warn($session, "Can't open file [$fpath]");
							return(undef);
						}
					}
				} else {
					if (DA::System::file_open(\*EML, "> " . $fpath)) {
						print EML $rfc822->{$u};
						if (!close(EML)) {
							&_warn($session, "Can't close file [$fpath]");
							return(undef);
						}
					} else {
						&_warn($session, "Can't open file [$fpath]");
						return(undef);
					}
				}
				if (-f $fpath) {
					$file = $apath;
				}
			} else {
				&_warn($session, "_rfc822");
				return(undef);
			}
		}
	}

	return($file,$file_name);
}

sub check_archive($$) {
	my ($session, $custom) = @_;

	my $tar = DA::System::bq_cmd("whereis -b tar");
	   $tar =~s/^tar://;
	   $tar =~s/(\s|\n|\r|\:)//g;
	my $zip = DA::System::bq_cmd("whereis -b zip");
	   $zip =~s/^zip://;
	   $zip =~s/(\s|\n|\r|\:)//g;
	my $lha = DA::System::bq_cmd("whereis -b lha");
	   $lha =~s/^lha://;
	   $lha =~s/(\s|\n|\r|\:)//g;
	my $mbox= 1;
	my $eml = 1;

	my $archive = {
		"tar" => ($tar && $custom->{archive_type}->{tar}) ? 1 : 0,
		"zip" => ($zip && $custom->{archive_type}->{zip}) ? 1 : 0,
		"lha" => ($lha && $custom->{archive_type}->{lha}) ? 1 : 0,
		"mbox"=> ($mbox && $custom->{archive_type}->{mbox}) ? 1 : 0,
		"eml" => ($eml && $custom->{archive_type}->{eml}) ? 1 : 0
	};
	
	return($archive);
}

sub select_archive_type {
	my ($archive, $mail, $mode) = @_;
	my $select;

	if ($mode eq '1') {
		if ($archive->{$mail->{archive}}) {
			$select = $mail->{archive};
		} else {
			$select = ($archive->{lha}) ? 'lha'
					: ($archive->{zip}) ? 'zip'
					: ($archive->{tar}) ? 'tar'
					: ($archive->{mbox}) ? 'mbox' : undef;
		}
	} elsif ($mode eq '2') { #添付ファイル一括ダウンロードの選択オプション
		if ($archive->{$mail->{archive_file}}) {
			$select = $mail->{archive_file};
	} else {
			$select = ($archive->{lha}) ? 'lha'
					: ($archive->{zip}) ? 'zip'
					: ($archive->{tar}) ? 'tar' : undef;
		}
	} else {
		if ($archive->{$mail->{archive_one}}) {
			$select = $mail->{archive_one};
		} else {
			$select = ($archive->{eml}) ? 'eml'
			        : ($archive->{mbox}) ? 'mbox' : undef;
		}
	}
	return ($select);
}


sub _out_header($$$$) {
	my ($session, $imaps, $header, $c) = @_;
	my $timezone = $c->{timezone};
	my $today    = $c->{today};
	my $lang     = $c->{lang};
	my $h12      = $c->{h12};
	my $tzview   = $c->{tzview};

	my $h = {};
	foreach my $k (keys %{$header}) {
		if ($k eq "mail_size") {
			my $size = DA::CGIdef::int_round($header->{$k}/1024, 'round');
			   $size = DA::CGIdef::int_format($size);
			$h->{&_column2xmlname($k)} = $size;
		} elsif ($k eq "to_status") {
			if ($imaps->{mail}->{toself} eq "to") {
				$h->{&_column2xmlname($k)} = $header->{$k} || 0;
			} else {
				$h->{&_column2xmlname($k)} = 0;
			}
		} elsif ($k eq "from_field") {
			my $str = &_db_str($header->{from_field}, $header->{from_ext});
			$h->{&_column2xmlname($k)} = $str;
		} elsif ($k eq "to_field") {
			my $str = &_db_str($header->{to_field}, $header->{to_ext});
			if ($str =~ /^<group\/(\d+)\/([^\@\>]*)>$/) {
				my ($gid, $glang) = ($1, $2);

				if ($gid) {
					DA::IS::set_temp_lang($session, $glang);

					my $v_name = DA::IS::get_ug_name(
						$session, 1, $gid, undef, undef,
						undef, undef, undef, undef, { "lang" => $glang }
					);

					DA::IS::clear_temp_lang($session);

					$h->{&_column2xmlname($k)} = &convert_mailer($v_name->{simple_name});
				} else {
					$h->{&_column2xmlname($k)} = "";
				}
			} else {
				$h->{&_column2xmlname($k)} = $str;
			}
		} elsif ($k eq "subject_field") {
			my $str = &_db_str($header->{subject_field}, $header->{subject_ext});
			$h->{&_column2xmlname($k)} = $str;
		} elsif ($k eq "date_field") {
			my $opt = 9;
			my $date= &format_date($header->{$k}, $opt, $timezone, undef, $today, $lang, $h12, $tzview);
			$h->{&_column2xmlname($k)} = $date;
		} elsif ($k eq "attach4ajx"){ 
			if (&_richtext2attachment($session, $imaps)) {
				$h->{&_column2xmlname($k)} = $header->{attachment};
			} else {
				$h->{&_column2xmlname($k)} = $header->{$k};
			}     	
		} elsif ($k eq "from_ext") {
			next;
		} elsif ($k eq "to_ext") {
			next;
		} elsif ($k eq "subject_ext") {
			next;
		} else {
			$h->{&_column2xmlname($k)} = $header->{$k};
		}
	}

	# Custom
	DA::Custom::set_mail_out_header4ajx($session, $imaps, $header, $c, $h);

	return($h);
}

sub _in_header($$$$$$) {
	my ($session, $imaps, $status, $header, $match, $seen) = @_;
	my $charset  = &core_charset();
	my $timezone = "+0000";
	
	my $no_escape = ($imaps->{custom}->{base64_no_escape} eq 'on') ? 1 : 0;

	my $from    = &get_name_form($header->{From}->[0], 0, $charset, $no_escape);
	my $to      = &get_name_form($header->{To}->[0], 0, $charset, $no_escape);
	my $subject = DA::Mailer::decode_header_field
					($header->{Subject}->[0], 1, 1, $charset);
	my $date    = &format_date($header->{Date}->[0], undef, $timezone);
	my $internal= &format_date($status->{$MATCH_RULE->{FETCH_INTDATE}}, undef, $timezone);
	my $priority= &get_priority([
		$header->{'X-Priority'}->[0],
		$header->{'X-MSMail-Priority'}->[0],
		$header->{'Importance'}->[0]
	]);
	my $group   = $header->{$MAIL_VALUE->{GROUP_TO}}->[0] || $header->{$MAIL_VALUE->{GROUP_OLD}}->[0];
	my $to_status;

	if ($match) {
		my $to = join (',', @{$header->{To}});
		if ($DA::Vars::p->{ma_to_status_ignore} eq "off") {
			if ($to =~ /(^|,|\<)\s*($match)\s*(\>|,|$)/) {
				$to_status = 1;
			}
		} else {
			if ($to =~ /(^|,|\<)\s*($match)\s*(\>|,|$)/i) {
				$to_status = 1;
			}
		}
	}

	my ($from_ext, $to_ext, $subject_ext);
	if ($charset eq "UTF-8") {
		$from_ext    = &get_name_form($header->{From}->[0], 0, $charset, $no_escape);
		$to_ext      = &get_name_form($header->{To}->[0], 0, $charset, $no_escape);
		$subject_ext = DA::Mailer::decode_header_field
						($header->{Subject}->[0], 1, 1, $charset);
	}

	if ($to eq "" && $group ne "") {
		my ($gid, $glang) = &_parse_gid((split(/\,/, $group))[0]);
		if ($gid) {
			$to = $to_ext = "<group/$gid/$glang>";
		}
	}

	my $h = {
		"seen"          => ($status->{$MATCH_RULE->{FETCH_FLAGS}} =~ /\\seen/i || $seen) ? 1 : 0,
		"flagged"       => ($status->{$MATCH_RULE->{FETCH_FLAGS}} =~ /\\flagged/i) ? 1 : 0,
		"deleted"       => ($status->{$MATCH_RULE->{FETCH_FLAGS}} =~ /\\deleted/i) ? 1 : 0,
		"replied"       => ($status->{$MATCH_RULE->{FETCH_FLAGS}} =~ /isereplied/i) ? 1 : 0,
		"forwarded"	    => ($status->{$MATCH_RULE->{FETCH_FLAGS}} =~ /iseforwarded/i) ? 1 : 0,
		"attachment"    => ($status->{$MATCH_RULE->{FETCH_STRUCT}} =~ /($MATCH_RULE->{MIME_ATTACH})/i) ? 1 : 0,
		"attach4ajx"    => ($status->{$MATCH_RULE->{FETCH_STRUCT}} =~ /($MATCH_RULE->{MIME_ATTACH4AJX})/i) ? 1 : 0,
		"mail_size"     => $status->{$MATCH_RULE->{FETCH_SIZE}},
		"priority"      => $priority,
		"internal"      => $internal,
		"from_field"    => $from,
		"to_field"	    => $to,
		"subject_field" => $subject,
		"date_field"    => $date,
		"from_ext"      => $from_ext,
		"to_ext"        => $to_ext,
		"subject_ext"   => $subject_ext,
		"to_status"     => $to_status
	};
	# Custom
	DA::Custom::set_mail_in_header4ajx($session, $imaps, $status, $header, $match, $seen, $h);

	return(&convert_core2mailer($h));
}

sub _class_pattern($$$$) {
	my ($session, $imaps, $header, $order) = @_;
	my $table = {
		"priority"   => "p" . $header->{priority},
		"seen"       => "s" . $header->{seen},
		"flagged"    => "f" . $header->{flagged},
		"attachment" => "a" . $header->{attachment},
		"toself"     => "t" . $header->{toself},
		"deleted"    => "d" . $header->{deleted},
		"replied"    => "r" . $header->{replied},
		"forwarded"  => "w" . $header->{forwarded},
	};
	my $pattern;
	foreach my $o (@{$order}) {
		$pattern .= $table->{$o} . " ";
	}
	$pattern =~ s/\s+$//g;

	return($pattern);
}

sub _header_html($$$$) {
	my ($session, $imaps, $h, $order) = @_;
	my $html;

	if (DA::SmartPhone::isSmartPhoneUsed()) {
		my $from = ($h->{type} eq $TYPE_DRAFT || $h->{type} eq $TYPE_SENT) ? $h->{to} : $h->{from};

		$html=<<end_tag;
<li>
  <a href="__ANCHOR__" slidedonejs="__LINK__">
    <div class="DA_list_mail_sub_class">@{[enc_(DA::SmartPhone::date_format4list($session, $h->{date}, 1))]}</div>
    <div class="DA_list_mail_title_class">@{[($from eq "") ? "&nbsp;" : enc_($from)]}</div>
    <div class="DA_list_mail_detail_class"><div class="DA_mail_status_class"></div><div class="DA_list_mail_detail_main_class">@{[($h->{subject} eq "") ? "&nbsp;" : enc_($h->{subject})]}</div><div class="DA_mail_attach_class"></div></div>
  </a>
</li>
end_tag

	} else {
		foreach my $o (@{$order}) {
			if ($o eq "to") {
				$html .= "<div class='from'>" . &encode_mailer($h->{$o}, 1, 1) . "</div>";
			} else {
				$html .= "<div class='$o'>" . &encode_mailer($h->{$o}, 1, 1) . "</div>";
			}
		}
	}

	return $html;
}

sub _filter_header($$$) {
	my ($session, $imaps, $header) = @_;
	my $charset  = &mailer_charset();
	my $timezone = "+0000";

	my $h = {};
	foreach my $f (keys %{$header}) {
		if ($f =~ /^(date)$/i) {
			$h->{$f} = &format_date($header->{Date}->[0], undef, $timezone);
		} elsif ($f =~ /^(to|from)$/i) {
			$h->{$f} = DA::Mailer::decode_header_field
						(join(",", @{$header->{$f}}), 1, 1, $charset);
			my $unescape = ($imaps->{custom}->{base64_no_escape} eq 'on') ? 1 : 0;
						
			$h->{$f} = DA::Mailer::unescape_mail_name($h->{$f}) if ($unescape);
			$h->{$f} = uc($h->{$f});
		}else {
			$h->{$f} = DA::Mailer::decode_header_field
						(join(",", @{$header->{$f}}), 1, 1, $charset);
			$h->{$f} = DA::Mailer::unescape_mail_name($h->{$f});
			$h->{$f} = uc($h->{$f});
		}
	}

	return($h);
}

sub _filter_ok($$$$$) {
	my ($session, $imaps, $filter, $header, $flag) = @_;
	my $h1      = $filter->{h1};
	my $h2      = $filter->{h2};
	my $c1      = $filter->{c1};
	my $c2      = $filter->{c2};
	my $t1      = $filter->{t1};
	my $t2      = $filter->{t2};
	my $date    = $filter->{date};
	my $cond    = $filter->{cond};
	my $seen    = $filter->{seen};
	my $deleted = $filter->{deleted};
	my $q1      = ($h1 =~ /^(From|To|Cc|Reply\-To)$/) ? '["<>\s]*' : "";
	my $q2      = ($h2 =~ /^(From|To|Cc|Reply\-To)$/) ? '["<>\s]*' : "";
	my $ok      = 0;

	if ($h1 eq "Date") {
		if (!$flag->{deleted} || ($flag->{deleted} && $deleted =~ /^yes$/i)) {
			if ($flag->{seen} || (!$flag->{seen} && $seen =~ /^yes$/i)) {
				if ($header->{$h1} lt $date) {
					$ok = 1;
				}
			}
		}
	} else {
		if (!$flag->{deleted} || ($flag->{deleted} && $deleted =~ /^yes$/i)) {
			if ($flag->{seen} || (!$flag->{seen} && $seen =~ /^yes$/i)) {
				if ($c1 eq "1") {
					if ($header->{$h1} =~ /^$q1\Q$t1\E$q1$/) {
						$ok = 1;
					}
				} elsif ($c1 eq "2") {
					if ($header->{$h1} !~ /^$q1\Q$t1\E$q1$/) {
						$ok = 1;
					}
				} elsif ($c1 eq "3") {
					if ($header->{$h1} =~ /^$q1\Q$t1\E/) {
						$ok = 1;
					}
				} elsif ($c1 eq "4") {
					if ($header->{$h1} =~ /\Q$t1\E$q1$/) {
						$ok = 1;
					}
				} elsif ($c1 eq "5") {
					if ($header->{$h1} =~ /\Q$t1\E/) {
						$ok = 1;
					}
				} elsif ($c1 eq "6") {
					if ($header->{$h1} !~ /\Q$t1\E/) {
						$ok = 1;
					}
				}
				if ($cond) {
					if (($cond eq "and" && $ok) || ($cond eq "or" && !$ok)) {
						if ($c2 eq "1") {
							if ($header->{$h2} =~ /^$q2\Q$t2\E$q2$/) {
								$ok = 1;
							} else {
								if ($cond eq "and") {
									$ok = 0;
								}
							}
						} elsif ($c2 eq "2") {
							if ($header->{$h2} !~ /^$q2\Q$t2\E$q2$/) {
								$ok = 1;
							} else {
								if ($cond eq "and") {
									$ok = 0;
								}
							}
						} elsif ($c2 eq "3") {
							if ($header->{$h2} =~ /^$q2\Q$t2\E/) {
								$ok = 1;
							} else {
								if ($cond eq "and") {
									$ok = 0;
								}
							}
						} elsif ($c2 eq "4") {
							if ($header->{$h2} =~ /\Q$t2\E$q2$/) {
								$ok = 1;
							} else {
								if ($cond eq "and") {
									$ok = 0;
								}
							}
						} elsif ($c2 eq "5") {
							if ($header->{$h2} =~ /\Q$t2\E/) {
								$ok = 1;
							} else {
								if ($cond eq "and") {
									$ok = 0;
								}
							}
						} elsif ($c2 eq "6") {
							if ($header->{$h2} !~ /\Q$t2\E/) {
								$ok = 1;
							} else {
								if ($cond eq "and") {
									$ok = 0;
								}
							}
						}
					}
				}
			}
		}
	}

	return($ok);
}

sub _check_htmlmail_part {
	my ($html) = @_;

	if ($html =~ /<(\/?)script/i) {
		return(&message("NOT_USE_SCRIPT_TAG"));
	}

	my %cnt;
	foreach my $t (qw(table tr th td)) {
		$cnt{$t} += $html =~ s/\<\s*\Q$t\E.*?\>//g;
		$cnt{$t} -= $html =~ s/\<\s*\/\Q$t\E.*?\>//g;
	}

	foreach my $t (qw(table tr th td)) {
		if ($cnt{$t}) {
			return(&message("NO_CLOSE_TABLE_TAG"));
		}
	}

	return(undef);
}

sub _make_htmlmail_part {
	my ($html, $charset, $noencode) = @_;
        my $default_style = qq |
<style type="text/css"><!--
* {
  margin:  0px;
  padding: 0px;
  }
//--></style> |;
	my $html_head =<<end_tag;
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=$charset">
end_tag
        unless($html =~ /(\<\!-- Created by DA_Richtext v2.0 --\>\<\!-- start default style -->.*\<\!-- end default style --\>)/i){
            $html_head .= $default_style;
        }
        $html_head .= qq|</head><body>|;
        my $html_end =<<end_tag;
</body>
</html>
end_tag
        $html = $html_head.$html.$html_end;
	$html =~s/\n/\r\n/g;
	$html = MIME::Base64::encode_base64($html) unless ($noencode);

	return($html);
}

sub _extract_htmlmail_part($$$$$$;$) {
	my ($session, $module, $allow, $html, $charset, $opt, $custom) = @_;
	my $q = "(?:&quot;)";
	my $fckstylehead;
	my $conv = DA::IS::get_convert_data();
	my $regex =$DA::Vars::p->{http_URL_regex};
	$html =~s{href="($regex)"}
        {
               my $result= DA::IS::conv_access_url($1);
	       "href=\"$result\"";
        }eg;
	
    if($html =~ s/(\<\!-- Created by DA_Richtext v2.0 --\>\<\!-- start default style -->.*?\<\!-- end default style --\>)//i){
        $fckstylehead = $1;

    }

	my @deny_part = qw (
		script style head
	);
	my @deny_tag  = qw (
		html /html body /body
		meta /meta link /link
		!doctype
	);
	my @span_style;
	my $remove = {};
	$html = DA::Charset::convert(\$html, $charset, &mailer_charset());
	foreach my $deny (@deny_part) {
               if ($html =~ s/<$deny[^<>]*?>[\x00-\xff]*?<\/$deny[^<>]*?>//ig) {
                       $remove->{$deny} = 1;
               }
	}
	foreach my $deny (@deny_tag) {
		$html =~ s/<$deny[^<>]*?>//ig;
	}
	
	my $richtext = DA::IS::get_sys_custom($session, "richtext");
	if ($richtext->{editor} eq 'fckeditor') {
		$html = DA::RichtextValid::font2span($html);
	}
	
	#=====================================================
	#           ----custom----
	#=====================================================
	DA::Custom::modify_incoming_htmlmail($session, $module, $allow, $charset, $opt, \$html);

	my $cache={};
	my $disable;
	if($custom && $custom->{displaynone_disable}){
		$disable = $custom->{displaynone_disable};
	}
	my $id = "mailto_" . $$ . "_" . Time::HiRes::time();
	my $mailto = { id => $id, no => 0, data => {} };

	$html =~s/(<[^<>]*?>)/&_htmlmail_tag($session, $module, $allow, $1,\@span_style, $opt, $mailto, $cache, $disable)/eg;
	$html = $fckstylehead.$html;
	$html = DA::Charset::convert(\$html, &mailer_charset(), $charset);
	if ($mailto->{no}) {
		&storable_store($session, $mailto->{data}, $id);
	}
	return(wantarray ? ($html, $remove) : $html);
}

sub _htmlmail_tag($$$$$$$;$$) {
	my ($session, $module, $allow, $tag,$span_style, $opt, $mailto, $cache, $disable) = @_;
	my $mailer = ($session->{mailer} eq 'insuite') ? 'on' : 'off';
	my $org    = $tag;
	my $isemailer;
	if ($mailer ne 'on' || $module->{mail} ne 'on' || $session->{type} =~ /^(3|4)$/) {
		$isemailer = 0;
	} else {
		$isemailer = 1;
	}
	
	#V3.3.8に発見した不具合 ISE_02001144の対応するために、削除された
	#不具合詳細：https://moe.dreamarts.co.jp/hibiki/BRDFrame.do?func=document_detail&binderId=13512&recordId=1144 
	
	$tag =~ s/^<//; $tag =~ s/>$//;

	if ($tag =~ /^(\/?)([^\s\/]+)/) {
		my $flag = $1;
		my $name = lc($2);
		my $name_before_transfer;
		if($name eq "blockquote"){
		    $name_before_transfer = $name;
		    $name = "div";
		}
		$tag =~ s/^\///;

		if ($allow->{$name}) {

			# 同じタグはキャッシュを返す
			my $cache_key = $org;
			if ($cache->{$cache_key}) {
				return($cache->{$cache_key});
			}
			
			#V3.3.8_103 display:noneの対応
			if ($disable eq 'on'){
				$tag =~ s/(style\s*=\s*['"]{1}[\s\S]*?)display\s*:\s*none\s*;?/$1/ig;
				$tag =~ s/style\s*=\s*(?:'\s*'|"\s*")//ig;
			}

			my @tmp;
			while ($tag =~ s/((?:[^\s\=]+)\=([\"\'])\2|(?:[^\s\=]+)\=([\"\'])(?:[\x00-\xff]*?)[^\\]\3|(?:[^\s\=]+)\=\S*|(?:[^\s\=]+))//) {
				my $i = $1;
				if ($i eq "") {
					next;
				} else {
					if ($i =~ /\=/) {
						my ($n, $v) = split(/\=/, $i, 2);
						if ($name eq "a" && $n =~ /^target$/i) {
							next;
						}
						if ($allow->{$name} =~ /(?:^|\,)\Q$n\E(?:\,|$)/i) {
							if ($n =~ /^href$/i) {
								if ($v =~ /^[\"\']?(?:(?:http|https|ftp)\:\/\/|(mailto)\:|\/)/i) {
									if ($1 eq "mailto") {
										if ($isemailer && $opt eq "detail") {
											my $to = $v;
											$to =~s/^[\s\"\']+mailto\://g;
											$to =~s/[\s\"\']+$//g;
										    if ($mailto && $to =~ /\?/) {
                                               $mailto->{no} ++;
                                               $mailto->{data}->{$mailto->{no}} = &_parse_rfc2368(DA::Ajax::simple_decode($to));
                                               $to = DA::Ajax::new_mail_url4href_ext($session, $mailto->{id}, $mailto->{no}, $to);
                                       	    } else {
                                               $to = DA::Ajax::new_mail_url4href($session, $to);
                                            }
											push(@tmp, "$n\=\"$to\"");
										} else {
											push(@tmp, "$n\=$v");
										}
									} else {
										push(@tmp, "$n\=$v");
										push(@tmp, "target=\"_blank\"");
									}
								} else {
									push(@tmp, "$n\=$v");
									if($v !~ /^[\"\']?(javascript\:Pop4Ajax)/i){
										push(@tmp, "target=\"_blank\"");
									}
								}
							} elsif ($n =~ /^src$/i) {
								if ($v =~ /^[\"\']?(?:http|https)\:\/\//i) {
									push(@tmp, "$n\=$v");
								} elsif ($v =~ /^[\"\']?$DA::Vars::p->{user_rdir}\/$session->{user}\/temp/i) {
									push(@tmp, "$n\=$v");
								} else {
									push(@tmp, "$n\=\"\"");
								}
							} elsif ($n =~ /^style$/i) {
								if ($name eq "p" || $name eq "blockquote") {
									if ($v !~ /margin/i) {
										$v =~ s/\;?([\"\']?)$/;margin:0px;$1/;
									}
									if ($v !~ /padding/i) {
										$v =~ s/\;?([\"\']?)$/;padding:0px;$1/;
									}
								}
								if ($name_before_transfer eq "blockquote" && $name eq "div") {
									my @tempstyle;	
									if ($v  =~ /(padding[^\;\"]*)\;?/ig) {
										push(@tempstyle, $1);
									}
									if ($v =~ /(border[^\;\"]*)\;?/ig) {
										push(@tempstyle, $1);
									}
									if ($v =~ /(margin[^\;\"]*)\;?/ig) {
										push(@tempstyle, $1);
									}
									$v = '"'.join(";",@tempstyle).'"';
								}
								$v =~ s/(\s*)position\s*\:\s*(?:absolute|fixed)(\s*)/$1position: relative$2/ig;
								#V3.3.8に発見した不具合 ISE_02001144の対応するために、削除された
								#不具合詳細：https://moe.dreamarts.co.jp/hibiki/BRDFrame.do?func=document_detail&binderId=13512&recordId=1144 
								push(@tmp, "$n\=$v");
							} 
							else {
								push(@tmp, $i);
							}
						} else {
							next;
						}
					} else {
						if($i eq "blockquote"){
						    $i = "div";
						}
						$i =~ s/\s//ig;
						$i =~ s/\///ig;
						if ($allow->{$name} =~ /(?:^|\,)\Q$i\E(?:\,|$)/i) {
							push(@tmp, $i);
						} else {
							next;
						}
					}
				}
				if ($name eq "p" || $name eq "blockquote") {
					if (!$flag && $org !~ /style\=/i) {
						push(@tmp, "style=\"margin:0px;padding:0px;\"");
					}
				}
			}
			
			#V3.3.8に発見した不具合 ISE_02001144の対応するために、削除された
			#不具合詳細：https://moe.dreamarts.co.jp/hibiki/BRDFrame.do?func=document_detail&binderId=13512&recordId=1144 
			
			my $result;
			if (scalar(@tmp)) {
				my $temp = "<" . $flag . join(" ", @tmp) . ">";
				$result=("<" . $flag . join(" ", @tmp) . ">");
			}
			$cache->{$cache_key}=$result;
			return($result);
		} else {
			return("");
		}
	} else {
		return("");
	}
}

sub _parse_rfc2368 {
       my ($query) = @_;
       my $data = {};

       my ($base, $ext) = ($query =~ /\?/) ? split(/\?/, $query) : ("", $query);
       foreach my $item (split(/\&/, $ext)) {
               my ($key, $value) = split(/\=/, $item);
               $key =~ s/^\s+//; $key =~ s/\s+$//;
               $data->{lc($key)} = URI::Escape::uri_unescape($value);
       }
       if ($base ne "") {
               $data->{to} = ($data->{to} eq "") ? $base : $base . "," . $data->{to};
       }

       return($data);
}

sub style_to_hashes{
       my $styles = shift;
       my %style_hashes;
       foreach(@$styles){
           my ($attr,$value) =split(/:/,$_);
	   $attr = lc($attr);
	   
           $style_hashes{$attr} = $value;
       }
       return \%style_hashes;
}
sub push_span_styles{
      my ($parrent_styles,$current_styles) = @_;
      if(scalar(@$current_styles) <= 0){
          push(@$parrent_styles,{});
      }else{
          push(@$parrent_styles,style_to_hashes($current_styles));
      }
      
      
}
sub span_inherient($$){
       my ($style,$ans_styles) = @_;
       my %style ;
       my $style_hash = style_to_hashes($style);
       my @styles_to_inherient;
       foreach(@$ans_styles){
           foreach my $key (keys %$_){
	       if($style_hash->{$key}){
               }else{
                  push(@styles_to_inherient,join(':',$key,$_->{$key}));
               }
	   } 
       }
       my $style_to_inher = join(';',@styles_to_inherient);
       my $current_style = join(';',@$style);
	   $current_style =~ s/\"/\&quot\;/g;
	   $style_to_inher =~ s/\"/\&quot\;/g;
       return '"'.$current_style.';'.$style_to_inher.'"';
}

sub _text2html {
	my ($string, $charset) = @_;

	$string = DA::Ajax::simple_encode($string);
	$string =~s/ /&nbsp;/g;
	$string =~s/(?:\r\n|\r)/\n/g;
        $string =~s/([^\n]+)([\n]|$)/<p>$1<\/p>$2/g;
        $string =~s/(^|[\n])([\n])/$1<p>&nbsp;<\/p>$2/mg;
	return($string);
}

sub _html2text {
	my ($string, $charset) = @_;
	my $ol = sub {
		my ($s) = @_;
		my $i   = 1;
		$s =~ s/[\r\n]//g;
		$s =~ s/<li[\x00-\xff]*?>(.+?)<\/li>/$i++ . "\. $1\n"/eig;
		return($s);
	};
	my $ul = sub {
		my ($s) = @_;
		$s =~ s/[\r\n]//g;
		$s =~ s/<li[\x00-\xff]*?>(.+?)<\/li>/"\* $1\n"/eig;
		return($s);
	};
	$string =~ s/<style>[^<>]*<\/style>//ig;
	$string =~ s/[\r\n]//g;
        $string =~ s/<\/div>/\n/ig;
	$string =~ s/<ol>([\x00-\xff]+?)<\/ol>/$ol->($1)/eig;
	$string =~ s/<ul>([\x00-\xff]+?)<\/ul>/$ul->($1)/eig;
	$string =~ s/<p(?:\s+[^<>]+)?>([\x00-\xff]+?)<\/p>/$1\n/ig;
	$string =~ s/<br\s*\/?\s*>/\n/ig;
	$string =~ s/<[^<>]+?>//g;
	$string =~ s/&nbsp;/ /g;
	$string = DA::Ajax::simple_decode($string);
	return($string);
}

sub _html3text {
	my ($string, $charset) = @_;
	my $new='padding-left: 5px; margin-left: 5px;';
	my $ol = sub {
		my ($s) = @_;
		my $i   = 1;
		$s =~ s/<li[\x00-\xff]*?>(.+?)<\/li>/$i++ . "\. $1\<br\>"/esig;
		return($s);
	};
	my $ul = sub {
		my ($s) = @_;
		$s =~ s/<li[\x00-\xff]*?>(.+?)<\/li>/"\* $1\<br\>"/esig;
		return($s);
	};
	$string =~s/(\<span\s+style\=).+?\>/$1\"\"\>/iog;
	$string =~s/\<hr.+?\>//iog;
	$string =~s/\<a.+?\>//iog;
	$string =~s/(\<li\s+style\=).+?\>/$1\"\"\>/iog;
	$string =~s/(\<p\s+style\=).+?\>/$1\"margin:0px;padding:0px;\"\>/iog;
	$string =~s/<ol>([\x00-\xff]+?)<\/ol>/$ol->($1)/eig;
	$string =~s/<ul>([\x00-\xff]+?)<\/ul>/$ul->($1)/eig;
	$string =~s/(\<table\s+).+?\>//iog;
	$string =~s/(margin-left\:).+?\;/margin-left\: 5px\;/iog;
	$string =~s/(padding-left\:).+?\;/padding-left\: 5px\;/iog;	
	$string =~s/(style\=\"border-left\:\s*\S+sold\s+rgb\(0\,\s+0\,\s+0\)\;)/$1$new/iog;
	$string =~s/(text-align:).+?\;//iog;
	$string =~s/(href)//iog;
	$string =~s/<ul>|<\/ul>|<li>|<\/li>|<ol>|<\/ol>|<em>|<\/em>|<u>|<strong>|<hr>//eig;
	$string = DA::Ajax::simple_decode($string);
	return($string);
}
sub _make_address_field($;$) {
	my ($address, $length) = @_;
	my $field;

	if (scalar(@{$address})) {
		my $len = 0;
		foreach my $a (@{$address}) {
			my $name  = $a->{name};
			my $email = $a->{email};
			my $type  = $a->{type};
			my $l;
			if ($type eq "2") {
				$l = "$name";
			} else {
				if ($name eq "") {
					$l = "$email";
				} else {
					$l = "$name \<$email\>";
				}
			}
			if ($length) {
				if ($len == 0) {
					$field .= "$l,";
					$len += DA::Mailer::multiLength($l, mailer_charset(), 1);
				} else {
					if ($len + DA::Mailer::multiLength($l, mailer_charset(), 1) > $length) {
						$field .= "\n$l,";
						$len = 0;
					} else {
						$field .= "$l,";
						$len += DA::Mailer::multiLength($l, mailer_charset(), 1);
					}
				}
			} else {
				$field .= "$l,";
			}
		}
		$field =~ s/\,+$//g;
	}

	return($field);
}


sub _exclude_address($$) {
	my ($array, $email) = @_;
	my @result;

	foreach my $a (@{$array}) {
		if ($a->{email} eq $email) {
			next;
		} else {
			push(@result, $a);
		}
	}

	return(\@result);
}

sub _unique_address($) {
	my ($array) = @_;
	my $data = {};

	my $i = 0;
	foreach my $a (@{$array}) {
		if ($data->{$a->{email}}) {
			if ($data->{$a->{email}}->{ref}->{name} eq "" && $a->{name} ne "") {
				$data->{$a->{email}}->{sort} = $i ++;
				$data->{$a->{email}}->{ref}  = $a;
			} elsif ($data->{$a->{email}}->{ref}->{type} eq "" && $a->{type} ne "") {
				$data->{$a->{email}}->{sort} = $i ++;
				$data->{$a->{email}}->{ref}  = $a;
			} else {
				next;
			}
		} else {
			$data->{$a->{email}}->{sort} = $i ++;
			$data->{$a->{email}}->{ref}  = $a;
		}
	}

	my @result;
	foreach my $email (sort {$data->{$a}->{sort} <=> $data->{$b}->{sort}} keys %{$data}) {
		push(@result, $data->{$email}->{ref});
	}

	return(\@result);
}

sub _quote_status($$$$$$$$$) {
	my ($session, $imaps, $module, $allow, $detail, $template, $mode, $quote, $maid) = @_;
	my $status = {};
	my $from = &get_user_addresses($session, $imaps);
	if (!$from->{$imaps->{mail}->{from}}){
		$imaps->{mail}->{from} = "email";
	}
	if ($mode eq "edit") {
		%{$status} = ref($detail->{status}) eq 'HASH' ? %{$detail->{status}} : ();
	} else {
		# Charset
		if ($imaps->{mail}->{encode} eq "UTF-8") {
			$status->{charset} = "UTF-8";
		} else {
			$status->{charset} = "ISO-2022-JP";
		}

		# Content-Type
                if (DA::SmartPhone::isSmartPhoneUsed()) {
			$status->{content_type} = "text";
		} else {
			if ($mode =~ /^(reply|all_reply|forward)$/ && $detail->{body}->{html} ne "") {
				if (&_richtext2attachment($session, $imaps)) {
					$status->{content_type} = "text";
				} else {
					$status->{content_type} = "html";
				}      
			} else {
				if ($imaps->{custom}->{content_type} eq "html") {
					$status->{content_type} = "html";
				} elsif ($imaps->{custom}->{content_type} eq "text") {
					$status->{content_type} = "text";
				} else {
					if ($imaps->{mail}->{content_type} eq "html") {
						$status->{content_type} = "html";
					} else {
						$status->{content_type} = "text";
			    		}	
				}
			}	
 		}
		# 開封通知
		if (DA::SmartPhone::isSmartPhoneUsed()) {
			$status->{notification} = 0;
		} else {
			if ($imaps->{mail}->{mdn} eq "on") {
				$status->{notification} = 1;
			} else {
				$status->{notification} = 0;
			}
		}
		if (DA::SmartPhone::isSmartPhoneUsed()) {
			if ($imaps->{smartphone}->{mail}->{sign_init_s} eq "mobile") {
				$status->{sid} = 2;
			} elsif ($imaps->{mail}->{sign_init_s} eq "normal") {
				$status->{sid} = 1;
			} else {
				$status->{sid} = 0;
			}
		} else {

		if ($imaps->{mail}->{from} eq "keitai_mail" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_mb.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_mb.txt"))) {
			# 署名
			if ($imaps->{mail}->{sign_init_pM} eq "mobile") {
				$status->{sid} = 2;
			} elsif ($imaps->{mail}->{sign_init_pM} eq "normal") {
				$status->{sid} = 1;
			} else {
				$status->{sid} = 0;
			}
	
			# 署名動作
			if ($imaps->{mail}->{sign_actM} eq "on") {
				$status->{sign_actM} = 1;
			} else {
				$status->{sign_actM} = 0;
			}
		} elsif ($imaps->{mail}->{from} eq "pmail1" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st1.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st1.txt"))) {
			# 署名
			if ($imaps->{mail}->{sign_init_p1} eq "mobile") {
				$status->{sid} = 2;
			} elsif ($imaps->{mail}->{sign_init_p1} eq "normal") {
				$status->{sid} = 1;
			} else {
				$status->{sid} = 0;
			}
	
			# 署名動作
			if ($imaps->{mail}->{sign_act1} eq "on") {
				$status->{sign_act1} = 1;
			} else {
				$status->{sign_act1} = 0;
			}
		} elsif ($imaps->{mail}->{from} eq "pmail2" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st2.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st2.txt"))) {
			# 署名
			if ($imaps->{mail}->{sign_init_p2} eq "mobile") {
				$status->{sid} = 2;
			} elsif ($imaps->{mail}->{sign_init_p2} eq "normal") {
				$status->{sid} = 1;
			} else {
				$status->{sid} = 0;
			}
	
			# 署名動作
			if ($imaps->{mail}->{sign_act2} eq "on") {
				$status->{sign_act2} = 1;
			} else {
				$status->{sign_act2} = 0;
			}
		} else {
			# 署名
			if ($imaps->{mail}->{sign_init_p} eq "mobile") {
				$status->{sid} = 2;
			} elsif ($imaps->{mail}->{sign_init_p} eq "normal") {
				$status->{sid} = 1;
			} else {
				$status->{sid} = 0;
			}
		
			# 署名動作
			if ($imaps->{mail}->{sign_act} eq "on") {
				$status->{sign_act} = 1;
			} else {
				$status->{sign_act} = 0;
			}
		}
	     }
		# 返信アドレス
		if ($imaps->{mail}->{reply_use} eq "on") {
			$status->{reply_use} = 1;
		} else {
			$status->{reply_use} = 0;
		}

		# グループ名
		if ($imaps->{mail}->{group_name} eq "on") {
			$status->{group_name} = 1;
		} else {
			$status->{group_name} = 0;
		}

        # 開封確認
        if ($imaps->{mail}->{open_status} eq "on") {
            $status->{open_status} = 1;
        } else {
            $status->{open_status} = 0;
        }

		# 差出人
		$status->{from} = $imaps->{mail}->{from};
	}

	# プレビュー
	if (DA::SmartPhone::isSmartPhoneUsed()) {
		$status->{preview} = 0;
	} else {
		if ($imaps->{mail}->{preview} eq "on") {
			$status->{preview} = 1;
		} else {
			$status->{preview} = 0;
		}
	}

	# Custom
	DA::Custom::set_mail_quote_status4ajx($session, $imaps, $module, $detail, $template, $mode, $quote, $maid, $status);

	return($status);
}

sub _quote_header($$$$$$$$$) {
	my ($session, $imaps, $module, $allow, $detail, $template, $mode, $quote, $maid) = @_;
	my %pt = (
		"high"   => 1,
		"normal" => 3,
		"low"    => 5
	);

	my $to  = [];
	my $cc  = [];
	my $bcc = [];
	my ($to_text, $cc_text, $bcc_text, $in_reply_to, $references, $subject, $priority);
	if ($mode eq "reply" || $mode eq "epsml") {
		if (scalar(@{$detail->{reply}})) {
			push(@{$to}, @{$detail->{reply}});
		} elsif (scalar(@{$detail->{from}})) {
			push(@{$to}, @{$detail->{from}});
		}
		if ($detail->{references}) {
			$references = "$detail->{references}\,$detail->{message_id}";
		} else {
			$references = "$detail->{message_id}";
		}
		$in_reply_to = $detail->{message_id};
		$subject  = $detail->{subject};
		$subject  =~s/^\s*re\s*\:\s*//i;
		$subject  = "Re: $subject";
		$priority = $pt{$imaps->{mail}->{priority}} || 3;
	} elsif ($mode eq "all_reply") {
		if (scalar(@{$detail->{reply}})) {
			push(@{$to}, @{$detail->{reply}});
		} elsif (scalar(@{$detail->{from}})) {
			push(@{$to}, @{$detail->{from}});
		}
		if ($imaps->{mail}->{reply_all} eq "on") {
			push(@{$cc}, @{&_exclude_address($detail->{to}, $session->{email})});
			push(@{$cc}, @{&_exclude_address($detail->{cc}, $session->{email})});
		} else {
			push(@{$to}, @{&_exclude_address($detail->{to}, $session->{email})});
			push(@{$cc}, @{&_exclude_address($detail->{cc}, $session->{email})});
		}
		if ($detail->{references}) {
			$references = "$detail->{references}\,$detail->{message_id}";
		} else {
			$references = "$detail->{message_id}";
		}
		$in_reply_to = $detail->{message_id};
		$subject  = $detail->{subject};
		$subject  =~s/^\s*re\s*\:\s*//i;
		$subject  = "Re: $subject";
		$priority = $pt{$imaps->{mail}->{priority}} || 3;
	} elsif ($mode eq "forward") {
		$subject  = $detail->{subject};
		$subject  =~s/^\s*fwd\s*\:\s*//i;
		$subject  = "Fwd: $subject";
		$priority = $detail->{priority};
	} elsif ($mode eq "edit") {
		if ($detail->{to}) {
			@{$to}  = @{$detail->{to}};
		}
		if ($detail->{cc}) {
			@{$cc}  = @{$detail->{cc}};
		}
		if ($detail->{bcc}) {
			@{$bcc} = @{$detail->{bcc}};
		}
		$references  = $detail->{references};
		$in_reply_to = $detail->{in_reply_to};
		$subject  = $detail->{subject};
		$priority = $detail->{priority};
	} else {
		if ($template->{to}) {
			@{$to}  = @{$template->{to}};
		}
		if ($template->{cc}) {
			@{$cc}  = @{$template->{cc}};
		}
		if ($template->{bcc}) {
			@{$bcc} = @{$template->{bcc}};
		}
		$to_text  = $template->{to_text};
		$cc_text  = $template->{cc_text};
		$bcc_text = $template->{bcc_text};
		$subject  = $template->{subject}; 
		$priority = $pt{$imaps->{mail}->{priority}} || 3;
	}

	if ($imaps->{mail}->{bcc} =~ /^(email|pmail1|pmail2|keitai_mail)$/) {
		unless ($mode eq "edit") {
			my @c = qw (name alpha type email keitai_mail pmail1 pmail2);
			my $mid   = $session->{user};
			my $info  = DA::IS::get_user_info($session, $mid, \@c);
			my $name  = DA::IS::check_view_name($session, $info->{name}, $info->{alpha});
			   $name  = &convert_mailer($name);
			my $type  = &convert_mailer($info->{type});
			my $addr  = &convert_mailer($info->{$imaps->{mail}->{bcc}});
			my $title = "";
			my $pos   = "";
			my $lang  = &get_user_lang($session, $imaps);
			if ($addr ne "") {
				if (my $card = &get_card($session, $imaps, $mid, $type, $name, $addr, $title, $pos, $lang)) {
					push(@{$bcc}, $card);
				}
			}
		}
	}

	my $from = &get_user_addresses($session, $imaps);
	$from->{name}  = &get_user_name($session, $imaps, "email");
	$from->{name1} = &get_user_name($session, $imaps, "pmail1");
	$from->{name2} = &get_user_name($session, $imaps, "pmail2");
	$from->{nameM} = &get_user_name($session, $imaps, "keitai_mail");
	
	my $signInit;
	$signInit->{sign_init_p}  = &get_user_sign_init_p($session, $imaps);
	if (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_mb.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_mb.txt")){
		$signInit->{sign_init_pM} = &get_user_sign_init_pM($session, $imaps);
	} else {
		$signInit->{sign_init_pM} = $signInit->{sign_init_p};
	} 
	if (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st1.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st1.txt")){
		$signInit->{sign_init_p1} = &get_user_sign_init_p1($session, $imaps);
	} else {
		$signInit->{sign_init_p1} = $signInit->{sign_init_p};
	}
	if (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st2.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st2.txt")){
		$signInit->{sign_init_p2} = &get_user_sign_init_p2($session, $imaps);
	} else {
		$signInit->{sign_init_p2} = $signInit->{sign_init_p};
	}
	
	
	my $header = {
		"to"          => $to,
		"cc"          => $cc,
		"bcc"         => $bcc,
		"to_text"     => $to_text,
		"cc_text"     => $cc_text,
		"bcc_text"    => $bcc_text,
		"from"        => $from,
		"sign_init"   => $signInit,
		"in_reply_to" => $in_reply_to,
		"references"  => $references,
		"subject"     => $subject,
		"priority"    => $priority
	};

	# Custom
	DA::Custom::set_mail_quote_header4ajx($session, $imaps, $module, $detail, $template, $mode, $quote, $maid, $header);

	return($header);
}

sub _quote_body($$$$$$$$$) {
	my ($session, $imaps, $module, $allow, $detail, $template, $mode, $quote, $maid) = @_;
	my $body = {};
	my $flag;

	if ($quote =~ /^(00|01)$/) {
		# 引用
		$flag = 1;
	} elsif ($quote =~ /^(10|11)$/) {
		# 引用符なし
		$flag = 2;
	} elsif ($quote =~ /^(02|99)$/) {
		# 引用しない
		$flag = 0;
	} else {
		# 設定次第
		if ($mode eq "reply" || $mode eq "all_reply" || $mode eq "epsml") {
			if ($imaps->{mail}->{quote_r} eq "off") {
				$flag = 0;
			} elsif ($imaps->{mail}->{quote_r} eq "body") {
				$flag = 2;
			} else {
				$flag = 1;
			}
		} elsif ($mode eq "forward") {
			if ($imaps->{mail}->{quote_f} eq "off") {
				$flag = 0;
			} elsif ($imaps->{mail}->{quote_f} eq "body") {
				$flag = 2;
			} else {
				$flag = 1;
			}
		} elsif ($mode eq "edit") {
			$flag = 2;
		} else {
			$flag = 0;
		}
	}
	if ($flag) {
		my ($text_head, $html_head, $text, $html, $text_foot, $html_foot);
		if ($mode eq "reply" || $mode eq "all_reply" || $mode eq "epsml") {
			my $date = $detail->{date};
			my $from = &_make_address_field($detail->{from});

			$text_head .= "\n\nAt $date\n $from wrote\:\n";
			$html_head =  &_text2html($text_head, &mailer_charset());

			foreach my $aid (sort {$a <=> $b} keys %{$detail->{attach}}) {
				$text_foot .= "Attachment-File: $detail->{attach}->{$aid}->{name}\n";
			}
			$html_foot =  &_text2html($text_foot, &mailer_charset());
		} elsif ($mode eq "forward") {
			my $email = &convert_mailer($session->{email});
			my $name = $imaps->{mail}->{name};
			if (DA::OrgMail::check_org_mail_permit($session)) {
				if($imaps->{custom}->{org_hide_sender} eq 'on') {
					my $reply;
					($email, $name, $reply) = DA::OrgMail::change_sender($session, $imaps, $email, $name, $reply);
				}
			}
			my $from = ($name eq "") ? "$email" : "$name <$email>";

			$text_head .= "\n\nForwarded by $from\n";
			if ($detail->{date}) {
				$text_head .= "Date: $detail->{date}\n";
			}
			if ($detail->{to}) {
				$text_head .= "To: " . &_make_address_field($detail->{to}) . "\n";
			}
			if ($detail->{cc}) {
				$text_head .= "Cc: " . &_make_address_field($detail->{cc}) . "\n";
			}
			if ($detail->{from}) {
				$text_head .= "From: " . &_make_address_field($detail->{from}) . "\n";
			}
			if ($detail->{subject}) {
				$text_head .= "Subject: $detail->{subject}\n";
			}

			$text_head .= "----------Original Message follows----------\n\n";
			$html_head =  &_text2html($text_head, &mailer_charset());
		}
		if ($flag eq 1) {
			$text = ($detail->{body}->{text} eq "") ?
			        &_html2text($detail->{body}->{html}, &mailer_charset())
			      : $detail->{body}->{text};
			$text =~s/(^|\n)/$1> /g;
			$html = ($detail->{body}->{html} eq "") ?
			        &_text2html($detail->{body}->{text}, &mailer_charset())
			      : &_extract_htmlmail_part($session, $module, $allow, $detail->{body}->{html}, &mailer_charset(), "mail", $imaps->{custom});
			$html = "<div style=\"PADDING-LEFT: 5px; MARGIN-LEFT: 5px; "
			      . "BORDER-LEFT: #000000 2px solid\">"
			      . $html
			      . "</div>";
			$text_foot =~s/(^|\n)/$1> /g;
		} else {
			$text = ($detail->{body}->{text} eq "") ?
			        &_html2text($detail->{body}->{html}, &mailer_charset())
			      : $detail->{body}->{text};
			$html = ($detail->{body}->{html} eq "") ?
			        &_text2html($detail->{body}->{text}, &mailer_charset())
			      : &_extract_htmlmail_part($session, $module, $allow, $detail->{body}->{html}, &mailer_charset(), "mail", $imaps->{custom});
		}
		if ($text ne "") {
			$body->{text} = $text_head
			              . $text;
			if ($text_foot) {
				$body->{text} .= "\n" . $text_foot;
			}
		}
		if ($html ne "") {
			if (!&_richtext2attachment($session, $imaps) || $mode eq "edit") {
				$body->{html} = $html_head
				              . $html;
				if ($html_foot) {
					$body->{html} .= "<p>&nbsp;</p>" . $html_foot;
				}
			} else {
				$html = &_html3text($html, &mailer_charset());
				$body->{html} = $html_head
				              . $html;
				if ($html_foot) {
					$body->{html} .= "<p>&nbsp;</p>" . $html_foot;
			}
			}
		}
	} else {
		unless ($mode =~ /^(reply|all_reply|forward|edit|email|group|bulk|object|epsml)$/) {
			$body->{text} = $template->{body}->{text};
			$body->{html} = $template->{body}->{html};
		}
	}

	# Custom
	DA::Custom::set_mail_quote_body4ajx($session, $imaps, $module, $detail, $template, $mode, $quote, $maid, $body);

	return($body);
}

sub _quote_attach($$$$$$$$$) {
	my ($session, $imaps, $module, $allow, $detail, $template, $mode, $quote, $maid) = @_;
	my $attach = {};
	my $flag;

	if ($quote =~ /^(00|02|10)$/) {
		# 引用
		$flag = 1;
	} elsif ($quote =~ /^(01|11|99)$/) {
		# 引用しない
		$flag = 0;
	} else {
		# 設定次第
		if ($mode eq "forward") {
			if ($imaps->{mail}->{quote_f_attach} eq "off") {
				$flag = 0;
			} else {
				$flag = 1;
			}
		} elsif ($mode eq "edit") {
			$flag = 1;
		} else {
			$flag = 0;
		}
	}

	if ($flag) {
		my $dtype = &_document_type($session, $imaps, $module);
		foreach my $aid (sort {$a <=> $b} keys %{$detail->{attach}}) {
			if ($mode eq "edit" && $detail->{attach}->{$aid}->{is_richtext2attach}) {
				next;
			}
			my $ext  = $detail->{attach}->{$aid}->{ext};
			my $path = $detail->{attach}->{$aid}->{path};
			my $src  = &_fullpath($session, $path);
			my $dst  = &_fullpath($session, "mail\-$maid\-$aid\.$ext");
			if (DA::System::file_copy($src, $dst)) {
				foreach my $key (qw(aid name type ext icon size warn title)) {
					$attach->{$aid}->{$key} = $detail->{attach}->{$aid}->{$key};
				}
				$attach->{$aid}->{path} = "mail\-$maid\-$aid\.$ext";
				$attach->{$aid}->{link} = "javascript:DA.file.openDownload4New($maid, $aid);",
				$attach->{$aid}->{document}
				                        = ($dtype) ? "javascript:DA.file.openDocument4New($maid, $aid, $dtype);" : "";
			} else {
				&_warn($session, "Can't copy file [$src]");
				$attach = undef; last;
			}
		}
	}

	# Custom
	DA::Custom::set_mail_quote_attach4ajx($session, $imaps, $module, $detail, $template, $mode, $quote, $maid, $attach);

	return($attach);
}

sub _template($$$) {
	my ($session, $imaps, $tid) = @_;
	my $data;

	DA::Session::trans_init($session);
	eval {
		my $sql = "select temp_to,temp_cc,temp_bcc,temp_subject,temp_memo "
		        . "from is_template where temp_id=?";
		my $sth = &_prepare($session, $sql);
		&_bind_param($sth, 1, $tid, 3);

		$sth->execute();

		my @lines = @{&_fetchrow($sth)};
		if (scalar(@lines)) {
			my $l = shift @lines;
			$data->{to}  = $l->{temp_to};
			$data->{cc}  = $l->{temp_cc};
			$data->{bcc} = $l->{temp_bcc};
			$data->{subject} = $l->{temp_subject};
			$data->{body}->{text} = $l->{temp_memo};
			$data->{body}->{html} = &_text2html($data->{body}->{text}, &mailer_charset());
		} else {
			&_warn($session, "Can't found template.");
		}

		$sth->finish();
	};
	if (!DA::Session::exception($session)) {
		&_warn($session, "Can't select table [is_template]");
		$data = undef;
	}

	foreach my $f (qw(text html)) {
		if ($data->{body}->{$f} ne "" && $data->{body}->{$f} !~ /\n$/) {
			$data->{body}->{$f} .= "\n";
			$data->{body}->{$f} =~ s/\r\n/\n/g;
		}
	}
	return($data);
}

sub _template_address($$$) {
	my ($session, $imaps, $tid) = @_;
	my $table   = 'is_template_address_' . substr($tid, -1, 1);
	my $address = {
		"to"  => [],
		"cc"  => [],
		"bcc" => []
	};

	DA::Session::trans_init($session);
	eval {
		my $sql1 = "select field,type,aid,name,email from $table where temp_id=? "
		         . "and gflag=? order by sno";
		my $sth1 = &_prepare($session, $sql1);
		_bind_param($sth1, 1, $tid, 3);
		_bind_param($sth1, 2, '0', 3);

		$sth1->execute();
		foreach my $l (@{&_fetchrow($sth1)}) {
			my $field;
			if ($l->{field} eq 1) {
				$field = "to";
			} elsif ($l->{field} eq 2) {
				$field = "cc";
			} elsif ($l->{field} eq 3) {
				$field = "bcc";
			}
			if ($field) {
				my $id    = $l->{aid};
				my $type  = $l->{type};
				my $name  = $l->{name};
				my $addr  = $l->{email};

				if (my $card = &get_card($session, $imaps, $id, $type, $name, $addr)) {
					push(@{$address->{$field}}, $card);
				} else {
					next;
				}
			}
		}
		$sth1->finish();

		my $sql2 = "select field,aid from $table where temp_id=? and gflag=? "
		         . "order by sno";
		my $sth2 = &_prepare($session, $sql2);
		_bind_param($sth2, 1, $tid, 3);
		_bind_param($sth2, 2, '1', 3);

		$sth2->execute();
		foreach my $l (@{&_fetchrow($sth2)}) {
			my $field;
			if ($l->{field} eq 1) {
				$field = "to";
			} elsif ($l->{field} eq 2) {
				$field = "cc";
			} elsif ($l->{field} eq 3) {
				$field = "bcc";
			}
			if ($field) {
				my $id = $l->{aid};
				if (my $card = &get_card($session, $imaps, $id, 2)) {
					push(@{$address->{$field}}, $card);
				} else {
					next;
				}
			}
		}
		$sth2->finish();
	};
	if (!DA::Session::exception($session)) {
		&_warn($session, "Can't select table [$table]");
		$address = undef;
	}

	return($address);
}

sub _sign($$$) {
	my ($session, $imaps, $sid, $from) = @_;
	my $file;

	if ($sid) {
		if ($from eq "keitai_mail" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_mb.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_mb.txt"))){
			if ($sid eq 2) {
				$file = "$DA::Vars::p->{master_dir}/$session->{user}/im_sign_mb.txt";
			} elsif ($sid eq 1) {
				$file = "$DA::Vars::p->{master_dir}/$session->{user}/sign1_mb.txt";
			}
		} elsif ($from eq "pmail1" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st1.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st1.txt"))){
			if ($sid eq 2) {
				$file = "$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st1.txt";
			} elsif ($sid eq 1) {
				$file = "$DA::Vars::p->{master_dir}/$session->{user}/sign1_st1.txt";
			}
		} elsif ($from eq "pmail2" && (DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st2.txt")||DA::Unicode::file_exist("$DA::Vars::p->{master_dir}/$session->{user}/sign1_st2.txt"))){
			if ($sid eq 2) {
				$file = "$DA::Vars::p->{master_dir}/$session->{user}/im_sign_st2.txt";
			} elsif ($sid eq 1) {
				$file = "$DA::Vars::p->{master_dir}/$session->{user}/sign1_st2.txt";
			}
		} else {
			if ($sid eq 2) {
				$file = "$DA::Vars::p->{master_dir}/$session->{user}/im_sign.txt";
			} elsif ($sid eq 1) {
				$file = "$DA::Vars::p->{master_dir}/$session->{user}/sign1.txt";
			}
		}

		my $sign = &read_file_utf($session, $file);
		if (defined $sign) {
			$sign = &convert_mailer($sign);
			$sign = DA::Unicode::ltrim($sign, &mailer_charset());
			$sign = DA::Unicode::rtrim($sign, &mailer_charset());
			$sign =~s/\r\n/\n/g;
			$sign = (defined $sign) ? $sign : "";
			if($session->{ua_browser} ne "InternetExplorer") {
				if ($sign ne "" && $sign !~ /\n$/) {
			    	$sign .= " \n";
			    	$sign =~ s/\r\n/ \n/g;
			    }	
			}
			return($sign);
		} else {
			return(undef);
		}
	} else {
		return("");
	}
}

sub _gname($$$) {
	my ($session, $imaps, $gids) = @_;
	my $gname;

	foreach my $f (qw(to cc)) {
		my $g = &get_group_info($session, $imaps, $gids->{$f});

		if ($g->{name} ne "") {
			my $name = DA::Mailer::fold_form($g->{name}, 50, "\n      ", ' , ');
			$gname .= "  " . &convert_mailer(T_($MAIL_VALUE->{TITLE}->{uc($f)}))
			       . ": " . $name . "\n";
		}
	}

	if ($gname ne "") {
		$gname = &convert_mailer(t_("送信先グループ")) . "\n"
		       . $gname . "\n\n";
	}

	return ($gname);
}

sub _bulk($$$) {
	my ($session, $imaps, $aid) = @_;
	my $conf = &convert_internal($imaps->{address});
	my $bag  = DA::Address::Baggage->new();
	my $p    = { "aid" => $aid };

	DA::Address::search_card($session, "bag" => $bag, "proc" => "bulk", "p" => $p, "fld" => "to", "conf" => $conf);

	my $users = &_loop_baggage($session, $imaps, $bag);
	my $text;

	if (ref($p->{addr}) eq "ARRAY") {
		$text = &convert_mailer(join(",", @{$p->{addr}}));
	}

	return($users, $text);
}

sub _epsml($$$$$) {
	my ($session, $imaps, $ol, $or, $om, $on) = @_;
	my $cipher  = new Crypt::CBC($session->{sid}, 'Blowfish');
	my $l = $ol;
	my $r = $or;
	my $m = pack("H*", $om);
	   $m = $cipher->decrypt($m);
	my $n = pack("H*", $on);
	   $n = $cipher->decrypt($n);
	my $ml_doc  = "$DA::Vars::p->{doc_ml_dir}/$l/htdocs/$m\.month";
	my $src_adr = "$ml_doc/$n\.address";
	my $src_mes = "$ml_doc/$n\.mes";
	my $src_att = "$ml_doc/$n\.attach";

	if (!-d $ml_doc || !DA::Unicode::file_exist($src_mes)) {
		&_warn($session, "Can't found file [$src_mes]");
		return(undef);
	}

	# 返信先の取得
	my $detail = {
		"to"    => [],
		"cc"    => [],
		"bcc"   => [],
		"reply" => []
	};
	if ($r eq "ml") {
		my $ml   = &convert_mailer(DA::ML::get_list_info($session, $l));
		my $id   = &convert_mailer($l);
		my $type = 4;
		my $name = $ml->{list_name};
		my $addr = "$id\@$DA::Vars::p->{mail_domain}";
		if (my $card = &get_card($session, $imaps, $id, $type, $name, $addr)) {
			push(@{$detail->{reply}}, $card);
		}
	}

	if (DA::Unicode::file_exist($src_adr . "_ext")) {
		if (my $fh = DA::Unicode::file_open($src_adr . "_ext", "r")) {
			while (my $l = <$fh>) {
				chomp($l);
				my $id   = "";
				my $type = "";
				my ($key, $value) = split(/\=/, &convert_mailer($l));
				my ($fld, $addr, $name, $status) = split(/\t/, $value);
				if ($fld eq "reply" && $status) {
					next;
				}
				if (my $card = &get_card($session, $imaps, $id, $type, $name, $addr)) {
					push(@{$detail->{$fld}}, $card);
				}
			}
			close($fh);
		} else {
			&_warn($session, "Can't open file [$src_adr]");
			return(undef);
		}
	} else {
		if (my $fh = DA::Unicode::file_open($src_adr, "r")) {
			while (my $l = <$fh>) {
				chomp($l);
				my $id   = "";
				my $type = "";
				my $name = "";
				my ($fld, $addr) = split(/\t/, &convert_mailer($l));
				if (my $card = &get_card($session, $imaps, $id, $type, $name, $addr)) {
					push(@{$detail->{$fld}}, $card);
				}
			}
			close($fh);
		} else {
			&_warn($session, "Can't open file [$src_adr\_ext]");
			return(undef);
		}
	}

	# 件名、本文の取得
	if (my $fh = DA::Unicode::file_open($src_mes, "r")) {
		my $tmp = {};
		my ($text, $flag);
		while (my $l = <$fh>) {
			$l =~ s/\r\n/\n/g; $l = &convert_mailer($l);
			if ($flag) {
				$text .= $l;
			} else {
				if ($l =~ /^message\-id\s*\:\s*([^\n]+)/i) {
					$detail->{message_id} = $1;
				} elsif ($l =~ /^references\s*\:\s*([^\n]+)/i) {
					$detail->{references} = $1;
				} elsif ($l =~ /^in\-reply\-to\s*\:\s*([^\n]+)/i) {
					$detail->{in_reply_to} = $1;
				} elsif ($l =~ /^date\s*\:\s*([^\n]+)/i) {
					$detail->{date} = $1;
				} elsif ($l =~ /^subject\s*\:\s*([^\n]+)/i) {
					$detail->{subject} = $1;
				} elsif ($l eq "\n") {
					$flag = 1;
				}
			}
		}
		$detail->{body}->{text} = $text;
		$detail->{body}->{html} = &_text2html($text, &mailer_charset());

		close($fh);
	} else {
		&_warn($session, "Can't open file [$src_mes]");
		return(undef);
	}

	unless ($detail->{message_id}) {
		$detail->{message_id} = (split(/\,/, $detail->{references}))[-1];
	}
	$detail->{status} = {};
	$detail->{attach} = {};

	return($detail);
}

sub _object($$$$) {
	my ($session, $imaps, $module, $maid) = @_;   
	my $src_mail    = "$session->{temp_dir}/$session->{sid}.mail";
	my $src_address = "$session->{temp_dir}/$session->{sid}.mail.address";
	my $src_group   = "$session->{temp_dir}/$session->{sid}.mail.group";
	my $src_attach  = "$session->{temp_dir}/$session->{sid}.mail.attach";

	my $mail = {
		"to"     => [],
		"cc"     => [],
		"bcc"    => [],
		"status" => {},
		"attach" => {}
	};
	if (-f $src_mail) {
		my $content_type;
		if (my $fh = DA::System::iofile_new($src_mail, "r")) {
			foreach my $key (qw(to cc bcc)) {
				my $l = <$fh>; chomp($l);
				   $l = DA::Ajax::decode(&convert_mailer($l), 0, 1);
				$mail->{"$key\_text"} = $l;
			}
			foreach my $key (qw(subject sign in_reply_to)) {
				my $l = <$fh>; chomp($l);
				   $l = DA::Ajax::decode(&convert_mailer($l), 0, 1);
				if ($key eq "sign") {
					$mail->{$key} = $l;

					# 本文の書式を設定
					my @sign=split(/\:/,$l);
					$content_type=$sign[12];

					# next;
				} elsif ($key eq "in_reply_to") {
					($mail->{in_reply_to}, $mail->{references}) = split(/\t/, $l);
				} else {
					$mail->{$key} = $l;
				}
			}
			while (my $l = <$fh>) {
				$mail->{body}->{text} .= DA::Ajax::decode(&convert_mailer($l), 0, 1);
			}
			if ($content_type eq 'html') {
				$mail->{body}->{html} = $mail->{body}->{text};
			} else {
				$mail->{body}->{html} = &_text2html($mail->{body}->{text}, &mailer_charset());
			}

			close($fh);
		} else {
			&_warn($session, "Can't open file [$src_mail]");
			return(undef);
		}
	}

	if (DA::Unicode::file_exist($src_address)) {
		if (my $fh = DA::Unicode::file_open($src_address)) {
			while (my $l = <$fh>) {
				chomp($l);
				my ($key, $value) = split(/\=/, &convert_mailer($l));
				my ($fld, $addr, $name, $id, $type) = split(/\t/, $value);
				if (my $card = &get_card($session, $imaps, $id, $type, $name, $addr)) {
					push(@{$mail->{$fld}}, $card);
				}
			}

			close($fh);
		} else {
			&_warn($session, "Can't open file [$src_address]");
			return(undef);
		}
	}

	if (DA::Unicode::file_exist($src_group)) {
		if (my $fh = DA::Unicode::file_open($src_group)) {
			while (my $l = <$fh>) {
				chomp($l);
				my ($key, $value) = split(/\=/, &convert_mailer($l));
				if ($key =~ /^gid_(to|cc|bcc)$/) {
					my $fld  = $1;
					my $type = 2;
					foreach my $id (split(/\,/, $value)) {
						if (my $card = &get_card($session, $imaps, $id, $type)) {
							push(@{$mail->{$fld}}, $card);
						}
					}
				}
			}

			close($fh);
		} else {
			&_warn($session, "Can't open file [$src_group]");
			return(undef);
		}
	}

	if (DA::Unicode::file_exist($src_attach)) {
		if (my $fh = DA::Unicode::file_open($src_attach)) {
			my $icons  = DA::IS::get_icon_data();
			my $dtype  = &_document_type($session, $imaps, $module);
			my $aid    = 1;
			while (my $l = <$fh>) {
				chomp($l);
				my ($type, $path, $name) = split(/\t/, &convert_mailer($l));
				my $ext = $1 if ($path =~ /\.([^\/\.]+)$/);
				$mail->{attach}->{$aid} = {
					"aid"      => $aid,
					"name"     => $name,
					"type"     => $type,
					"ext"      => $ext,
					"size"     => int(DA::CGIdef::convert_byte((stat(_fullpath($session, $path)))[7], "KB")),
					"icon"     => $session->{img_rdir} . "/"
					           .  DA::IS::get_object_icon($ext, "small", $icons, 14),
					"warn"     => "",
					"path"     => $path,
					"link"     => "javascript:DA.file.openDownload4New($maid, $aid);",
					"document" => ($dtype) ? "javascript:DA.file.openDocument4New($maid, $aid, $dtype);" : ""
				};
				$aid ++;
			}
			$mail->{last_aid} = $aid;

			close($fh);
		} else {
			&_warn($session, "Can't open file [$src_attach]");
			return(undef);
		}
	}

	return($mail);
}

sub _delete_sign($$$$$) {
	my ($session, $imaps, $sid, $content_type, $body) = @_;
	my $buf = $body;
	my $sign = &_sign($session, $imaps, $sid);

	if (defined $sign) {
		$sign =~ s/^\n//;
		$sign = DA::Mailer::space_cut($sign, &mailer_charset());

		# Todo: for HTML
		if ($content_type eq "html") {
		} else {
			$buf = DA::Mailer::space_cut($buf, &mailer_charset());
			$buf =~s/\n{0,3}\Q$sign\E$//;
		}

		return($buf);
	} else {
		return(0);
	}
}

sub _fullpath($$) {
	my ($session, $path) = @_;
	my $fullpath = "$DA::Vars::p->{user_dir}/$session->{user}/temp/"
	             . "$session->{sid}\.AjaxMailer\.$path";
	return($fullpath);
}

sub _urlpath($$) {
	my ($session, $path) = @_;
	my $urlpath = "$DA::Vars::p->{user_rdir}/$session->{user}/temp/"
	            . "$session->{sid}\.AjaxMailer\.$path";
	return($urlpath);
}

sub _hash2line($$) {
	my ($hash, $output) = @_;
	my $delimiter = "\t";
	my $line;

	foreach my $o (@{$output}) {
		$line .= $hash->{$o} . $delimiter;
	}
	$line =~ s/(?:$delimiter)+$//;

	return($line);
}

sub _header2message_id($) {
	my ($header) = @_;
	my $message_id;

	if ($header =~ /$MATCH_RULE->{MESSAGE_ID}/i) {
		$message_id = $1;
	}

	return($message_id);
}

sub _header2mailer($) {
	my ($header) = @_;
	my $mailer;

	if ($header =~ /$MATCH_RULE->{MAILER}/i) {
		$mailer = $1;
	}

	return($mailer);
}

sub _header2priority($) {
	my ($header) = @_;
	my $priority;

	if ($header =~ /$MATCH_RULE->{PRIORITY}/i) {
		$priority = get_priority([$2]);
	} else {
		$priority = 3;
	}

	return($priority);
}

sub _header2to($) {
	my ($header) = @_;
	my $charset = &mailer_charset();
	my $to;

	if ($header =~ /(?:^|\n)to\s*:\s*([\x00-\xff]+?)(\n\S|\n+$)/i) {
		$to = DA::Mailer::decode_header_field($1, 1, 1, $charset);
	}

	return($to);
}

sub _header2cc($) {
	my ($header) = @_;
	my $charset = &mailer_charset();
	my $cc;

	if ($header =~ /(?:^|\n)cc\s*:\s*([\x00-\xff]+?)(\n\S|\n+$)/i) {
		$cc = DA::Mailer::decode_header_field($1, 1, 1, $charset);
	}

	return($cc);
}

sub _header2bcc($) {
	my ($header) = @_;
	my $charset = &mailer_charset();
	my $bcc;

	if ($header =~ /(?:^|\n)bcc\s*:\s*([\x00-\xff]+?)(\n\S|\n+$)/i) {
		$bcc = DA::Mailer::decode_header_field($1, 1, 1, $charset);
	}

	return($bcc);
}

sub _header2from($) {
	my ($header) = @_;
	my $charset = &mailer_charset();
	my $from;

	if ($header =~ /(?:^|\n)from\s*:\s*([\x00-\xff]+?)(\n\S|\n+$)/i) {
		$from = DA::Mailer::decode_header_field($1, 1, 1, $charset);
	}

	return($from);
}

sub _header2sender($) {
	my ($header) = @_;
	my $charset = &mailer_charset();
	my $sender;

	if ($header =~ /(?:^|\n)sender\s*:\s*([\x00-\xff]+?)(\n\S|\n+$)/i) {
		$sender = DA::Mailer::decode_header_field($1, 1, 1, $charset);
	}

	return($sender);
}

sub _header2reply_to($) {
	my ($header) = @_;
	my $charset = &mailer_charset();
	my $reply_to;

	if ($header =~ /(?:^|\n)reply\-to\s*:\s*([\x00-\xff]+?)(\n\S|\n+$)/i) {
		$reply_to = DA::Mailer::decode_header_field($1, 1, 1, $charset);
	}

	return($reply_to);
}

sub _header2date($) {
	my ($header) = @_;
	my $charset = &mailer_charset();
	my $date;

	if ($header =~ /(?:^|\n)date\s*:\s*([\x00-\xff]+?)(\n\S|\n+$)/i) {
		$date = $1;
		$date =~s/[\t\r\n]/ /g;
	}

	return($date);
}

sub _parse_uid($) {
    my ($id) = @_;
    my $DOMAIN = $DA::Vars::p->{session_domain};
    my ($uid_type,$domain) = split(/\@/, $id, 2);
    my ($type, $uid) = split(/\//, $uid_type, 2);

    if ($domain) {
       if ($domain eq $DOMAIN) {
          return(wantarray ? ($uid, $type) : $uid);
       } else {
          return(wantarray ? (undef, undef) : undef);
       }
    } else {
       return(wantarray ? ($uid, $type) : $uid);
    }
}

sub _make_uid($) {
    my ($uid, $type, $num) = @_;
    my $DOMAIN = $DA::Vars::p->{session_domain};

    return("$num\=$type\/$uid\@$DOMAIN");
}

sub _parse_gid($) {
	my ($id) = @_;
	my $DOMAIN = $DA::Vars::p->{session_domain};
	my ($gid_lang, $domain) = split(/\@/, $id, 2);
	my ($gid, $lang) = split(/\//, $gid_lang);

	$gid = int($gid);

	if ($domain) {
		if ($domain eq $DOMAIN) {
			return(wantarray ? ($gid, $lang) : $gid);
		} else {
			return(wantarray ? (undef, undef) : undef);
		}
	} else {
		return(wantarray ? ($gid, $lang) : $gid);
	}
}

sub _make_gid($$) {
	my ($gid, $lang) = @_;
	my $DOMAIN = $DA::Vars::p->{session_domain};

	return("$gid\/$lang\@$DOMAIN");
}

sub _parse_status($) {
	my ($string) = @_;
	my %st = (
		"off"    => 0,
		"normal" => 1,
		"mobile" => 2
	);
	my %sat = (
		"off"    => 0,
		"on"     => 1
	);
	my $s = DA::Mailer::parse_data_field($string);
	my $r = {
		"charset"      => ($s->{charset} =~ /^(utf-8)$/i) ? "UTF-8" : "ISO-2022-JP",
		"content_type" => ($s->{content_type} eq "html") ? "html" : "text",
		"notification" => ($s->{mdn} =~ /^(on)$/i) ? 1 : 0,
		"sid"          => $st{lc($s->{sign})} || 0,
		"sign_act"     => $sat{lc($s->{sign_act})} || 0,
		"from"         => $s->{my_addr} || "email",
		"reply_use"    => ($s->{reply_use} =~ /^(on)$/i) ? 1 : 0,
		"group_name"   => 0,
		"open_status"  => ($s->{open_status} =~ /^(on)$/i) ? 1 : 0,
	};

	return($r);
}

sub _parse_rfc822($$$$$$$) {
	my ($session, $imaps, $c, $module, $rfc822, $tmppath, $detail) = @_;
	my $max_size= $imaps->{system}->{max_text_size};
	my $mailer  = $detail->{mailer};
	my $dtype   = &_document_type($session, $imaps, $module);
	my $opt     = 2;
	my $folder_type = $c->{folder_type};
	my ($error, %rfc822);

	DA::MailParser::text_parse(\$rfc822, \%rfc822, &mailer_charset(), $opt, $tmppath);
	if ($rfc822{err_code}) {
		&_warn($session, "text_parse");
		$error = &error("NOT_PARSE_RFC822", 9);
	} else {
		if (-f "$tmppath\-t") {
			unless (DA::System::file_move("$tmppath\-t", "$tmppath\-d0")) {
				&_warn($session, "move");
				$error = &error("NOT_MOVE_FILE", 9);
			}
		}
	}

	unless ($error) {
		for (my $i = 0; $i < scalar(@{$rfc822{content_type}}); $i ++) {
			my $content_type = $rfc822{content_type}[$i];
			my $attach_name  = $rfc822{attach_name}[$i];
			my $disposition  = $rfc822{disposition}[$i];
			my $encoding     = $rfc822{encoding}[$i];
			my $charset      = $rfc822{charset}[$i];
			my $aid          = $detail->{last_aid} + 1;
			my ($type, $name, $ext, $encode, $attach,$is_richtext2attach);
			my $content_id = $rfc822{content_id}[$i];
			if ($content_type =~ /^multipart\//i) {
				# Multipart
				#
				my $rfc822 = &read_file($session, "$tmppath\-e$i");
				if (defined $rfc822) {
					$error = &_parse_rfc822($session, $imaps, $c, $module, $rfc822, "$tmppath\-$i", $detail);
					if ($error) {
						&_warn($session, "_parse_rfc822"); last;
					}
				} else {
					&_warn($session, "read_file");
					$error = &error("NOT_READ_MULTIPART", 9); last;
				}
			} elsif ($attach_name ne ''
			     ||  $disposition =~ /^attachment/i
			     ||  $content_type =~ /^message\//i
			     ||  ($mailer =~ /Mozilla/ && $disposition =~ /^inline/i)) {
				# Attachment
				#
				$type = ($content_type =~/^\s*([^\s\r\n\;]+)/i) ?
							$1 : 'application/octet-stream';
				$name = $attach_name;
				$name = DA::Mailer::space_cut($name, &mailer_charset());
				$name =~s/[\r\n]//g;
				if ($name) {
					if ($name =~ /\.([^\.]+)$/) {
						$ext = $1;
					} else {
						$ext = "non";
					}
				} else {
					if ($type =~ /^message\/rfc822/i) {
						$name = "Unknown-$c->{fid}\-$c->{uid}\-$aid\.eml";
						$ext  = "eml";
					} else {
						$name = "Unknown-$c->{fid}\-$c->{uid}\-$aid\.non";
						$ext  = "non";
					}
				}
				if (($encoding ne ''
				&&   $encoding !~ /(7bit|8bit|base64|quoted-printable)/i)
				||   $content_type =~ /binhex/i) {
					if ($encoding =~ /uuencode/i) {
						$ext = "uu";
					} elsif ($content_type =~ /binhex/i) {
						$ext = "hqx";
					} else {
						$ext = "non";
					}
					$encode = $encoding || "Unknown";
					if ($name !~ /\.\Q$ext\E$/) {
						if ($name =~ /\.non$/) {
							$name =~ s/\.non$//;
						}
						$name .= ".$ext";
					}
					$attach = 2;
				} else {
					$attach = 1;
				}
			} elsif ($content_type =~ /^text\/plain/i
			     ||  $content_type =~ /^text\/enriched/i
			     ||  $content_type eq '') {
				# Text
				#
				#backup folder $content_type eq '' skip
				# fix mail text show twice bug 
				if(&is_backup($session,$imaps,$folder_type) && $content_type eq '') {
					next;
				}
				my $text = &read_file($session, "$tmppath\-d$i");
				if (defined $text) {
					my ($detect, $offset)  = DA::Charset::detect_partial(\$text);
					my $convert;
					if (!$charset) {
						if ($content_type =~ /charset\s*=\s*(\S+)/i) {
							$charset = $1;
						} else {
							$charset = $detect;
						}
						$convert = 1;
					} elsif ($content_type =~ /^text\/enriched/i) {
						$convert = 1;
					}
					my $cs = DA::Mailer::get_charset($charset, undef, 1, &mailer_charset());
					my $text_size  = length($detail->{body}->{text});
					my $part_size  = length($text);
					my $plus_size  = $text_size + $part_size;
					my $minus_size = $max_size - $text_size;
					if ($cs eq "err") {
						if ($content_type =~ /^text\/enriched/i) {
							$type = "text/enriched";
						} else {
							$type = "text/plain";
						}
						$name   = "Unknown-$c->{fid}\-$c->{uid}\-$aid\.txt";
						$ext    = "txt";
						$attach = 3;
					} elsif ($convert) {
						$text = ($cs =~ /us\-ascii/i) ?
								DA::Charset::convert_to(\$text, &mailer_charset())
							:	DA::Charset::convert(\$text, $cs, &mailer_charset());
					}
					if (!$attach) {
						if ($c->{textsize} && $max_size && $max_size < $plus_size) {
							if ($content_type =~ /^text\/enriched/i) {
								$type = "text/enriched";
							} else {
								$type = "text/plain";
							}
							$name   = "Unknown-$c->{fid}\-$c->{uid}\-$aid\.txt";
							$ext    = "txt";
							$attach = 4;
							if ($minus_size > 0) {
								$text = DA::Charset::sub_str($text, &mailer_charset(), 0, $minus_size);
								$text =~s/\r\n/\n/g;
								$detail->{body}->{text} .= $text;
								$detail->{body}->{text} .= "\n\n" . &message("OVER_TEXT_SIZE") . "($name)";
							}
						} else {
							$text =~ s/\r\n/\n/g;
							$detail->{body}->{text} .= $text;
						}
					}
				} else {
					&_warn($session, "read_file");
					$error = &error("NOT_READ_TEXT_PART", 9); last;
				}
			} elsif ($content_type =~ /^(text\/html)/i) {
				# HTML
				#
				if ($detail->{body}->{html} eq "") {
					my $exception;
					if (&mailer_charset() eq "UTF-8") {
						$exception = "err|utf-8";
					} else {
						$exception = "err|euc-jp";
					}
					DA::Mailer::chg_html_charset
						($tmppath . "-d$i", $charset, $exception, &mailer_charset());

					my $html = &read_file($session, "$tmppath\-d$i");

					if (defined $html) {
						$html =~ s/\r\n/\n/g;
						$detail->{body}->{html} = $html;
                        if (&_richtext2attachment($session, $imaps)) {
							$type   = "text/html";
							$name   = "$c->{fid}\-$c->{uid}\-$aid\.html";
							$ext    = "html";
							$attach = 1;
							$is_richtext2attach = 1;
						}
 
					} else {
						&_warn($session, "read_file");
						$error = &error("NOT_READ_HTML_PART", 9); last;
					}
				} else {
					my $exception;
					if (&external_charset() eq "UTF-8") {
						$exception = "err|utf-8";
					} else {
						$exception = "err|x-sjis|shift_jis";
					}
					DA::Mailer::chg_html_charset
						($tmppath . "-d$i", $charset, $exception, &external_charset());

					$type   = "text/html";
					$name   = "Unknown-$c->{fid}\-$c->{uid}\-$aid\.html";
					$ext    = "html";
					$attach = 1;
				}
			} else {
				# Attachment
				#
				$type = ($content_type =~/^\s*([^\s\r\n\;]+)/i) ?
							$1 : 'application/octet-stream';
				if ($type =~ /^message\/rfc822/i) {
					$name = "Unknown-$c->{fid}\-$c->{uid}\-$aid\.eml";
					$ext  = "eml";
				} else {
					$name = "Unknown-$c->{fid}\-$c->{uid}\-$aid\.non";
					$ext  = "non";
				}
				if (($encoding ne ''
				&&   $encoding !~ /(7bit|8bit|base64|quoted-printable)/i)
				||   $content_type =~ /binhex/i) {
					if ($encoding =~ /uuencode/i) {
						$ext = "uu";
					} elsif ($content_type =~ /binhex/i) {
						$ext = "hqx";
					} else {
						$ext = "non";
					}
					$encode = $encoding || "Unknown";
					if ($name !~ /\.\Q$ext\E$/) {
						if ($name =~ /\.non$/) {
							$name =~ s/\.non$//;
						}
						$name .= ".$ext";
					}
					$attach = 2;
				} else {
					$attach = 1;
				}
			}
			if ($attach) {
				my $warn;
				if ($attach eq 4) {
					$warn = &message("OVER_TEXT_SIZE");
				} elsif ($attach eq 3) {
					$warn = &message("UNKNOWN_CHARSET") . "($charset)";
				} elsif ($attach eq 2) {
					$warn = &message("UNKNOWN_ENCODING") . "($encoding)";
				}

				#==========================================
				#      Custom
				#==========================================
				DA::Custom::check_file("$tmppath\-d$i", $session, $name, 
									   "DA::Ajax::Mailer::_parse_rfc822");

				my $gid =(DA::OrgMail::check_org_mail_permit($session))?DA::OrgMail::get_gid($session):$session->{user};
				my $attach_file = "$gid\.detail\-$c->{fid}\-$c->{uid}\-$aid\.$ext";				
				my $dst = _fullpath($session, $attach_file);
				if (DA::System::file_move("$tmppath\-d$i", $dst)) {
					$detail->{attach}->{$aid} = {
						"aid"      => $aid,
						"name"     => $name,
						"type"     => $type,
						"ext"      => $ext,
						"title"    => $name,
						"is_richtext2attach" => $is_richtext2attach,
						"size"     => int(DA::CGIdef::convert_byte((stat($dst))[7], "KB")),
						"icon"     => $session->{img_rdir} . "/"
						           .  DA::IS::get_object_icon($ext, "small", $c->{icons}, 14),
						"warn"     => $warn,
						"path"     => $attach_file,
						"link"     => "javascript:DA.file.openDownload4Detail"
						           .  "($c->{fid}, $c->{uid}, $aid);",
						"document" => ($dtype) ? "javascript:DA.file.openDocument4Detail"
						           .  "($c->{fid}, $c->{uid}, $aid, $dtype);" : "",
						"content_id" => $content_id
					};
					$detail->{last_aid} = $aid;
				} else {
					&_warn($session, "move");
					$error = &error("NOT_MOVE_FILE", 9); last;
				}
			}
		}
		if($detail->{body}->{text} eq ""){
			$detail->{body}->{text} = &_html2text($detail->{body}->{html}, &mailer_charset());	
		} 
	}

	return($error);
}

sub _join_uidlst($$) {
	my ($uid, $uidlst) = @_;
	my $uids = $uid . "," . join(",", (ref($uidlst) eq "ARRAY") ? @{$uidlst} : ());
	   $uids =~s/(^\,+|\,+$)//;

	return $uids;
}

sub _select_uidlst_common($$$;$;$) {
	my ($session, $fid, $area, $uidlst, $opt) = @_;

	if ($area) {
		if (!$uidlst && $area =~ /\-/) {
			unless ($uidlst = &storable_retrieve($session, "$fid\.headers.uidlst")) {
				&_warn($session, "storable_retrieve");
				return(undef);
			}
		}
		my $newlst = ($opt eq 1) ? {} : [];
		foreach my $a (split(/\,/, $area)) {
			if ($a =~ /\-/) {
				my ($start_area, $end_area) = split(/\-/, $a);
				my ($start_fid, $start_uid) = split(/\:/, $start_area);
				my ($end_fid, $end_uid) = split(/\:/, $end_area);
				my ($flag);
				foreach my $u (@{$uidlst}) {
					if (!$flag) {
						if ($u eq $start_uid) {
							$flag = 1; 
						} elsif ($u eq $end_uid) {
							$flag = 2;
						}
					}

					if ($flag) {
						if ($opt eq 1) {
							push(@{$newlst->{$fid}}, $u);
						} else {
							push(@{$newlst}, $u);
						}

						if ($u eq $end_uid && $flag == 1) {
							last;
						} elsif ($u eq $start_uid && $flag == 2) {
							last;
						}
					}
				}
			} else {
				if ($a =~ /\:/) {
					my ($fid, $uid) = split(/\:/, $a);
					if ($opt eq 1) {
						push(@{$newlst->{$fid}}, $uid);
					} else {
						push(@{$newlst}, $uid);
					}
				} else {
					push(@{$newlst}, $a);
				}
			}
		}
		if ($opt eq 2) {
			return(join(",", @{$newlst}));
		} else {
			return($newlst);
		}
	} else {
		return(undef);
	}
}

sub _select_uidlst_search($$$;$;$;$) {
	my ($session, $srid, $area, $uidlst, $opt, $fid) = @_;

	if ($area) {
		if (!$uidlst && $area =~ /\-/) {
			unless ($uidlst = &storable_retrieve($session, "search.headers.uidlst.$srid")) {
				&_warn($session, "storable_retrieve");
				return(undef);
			}
		}
		my $newlst = ($opt eq 1) ? {} : [];
		foreach my $a (split(/\,/, $area)) {
			if ($a =~ /\-/) {
				my ($start_area, $end_area) = split(/\-/, $a);
				my ($start_fid, $start_uid) = split(/\:/, $start_area);
				my ($end_fid, $end_uid) = split(/\:/, $end_area);
				my ($flag);
				foreach my $u (@{$uidlst}) {
					if (!$flag) {
						if ($u eq "$start_fid\_$start_uid") {
							$flag = 1;
						} elsif ($u eq "$end_fid\_$end_uid") {
							$flag = 2;
						}
					}

					if ($flag) {
						if ($opt eq 1) {
							my ($fid, $uid) = split(/\:/, $u);
							push(@{$newlst->{$fid}}, $uid);
						} else {
							push(@{$newlst}, $u);
						}

						if ($u eq "$end_fid\_$end_uid" && $flag == 1) {
							last;
						} elsif ($u eq "$start_fid\_$start_uid" && $flag == 2) {
							last;
						}
					}
				}
			} else {
				if ($a =~ /\:/) {
					my ($fid, $uid) = split(/\:/, $a);
					if ($opt eq 1) {
						push(@{$newlst->{$fid}}, $uid);
					} else {
						push(@{$newlst}, "$fid\_$uid");
					}
				} else {
					if ($fid) {
						if ($opt eq 1) {
							push(@{$newlst->{$fid}}, $a);
						} else {
							push(@{$newlst}, "$fid\_$a");
						}
					} else {
						&_warn($session, "No fid [$a]");
					}
				}
			}
		}
		if ($opt eq 2) {
			return(join(",", @{$newlst}));
		} else {
			return($newlst);
		}
	} else {
		return(undef);
	}
}

sub _delete_uidlst_common($$$) {
	my ($session, $fid, $uid) = @_;
	my $uids;

	if (ref($uid) eq "ARRAY") {
		$uids = $uid;
	} else {
		$uids = [(split(/\,/, $uid))];
	}

	if (&storable_exist($session, "$fid\.headers.uidlst")) {
		if (my $uidlst = &storable_retrieve($session, "$fid\.headers.uidlst")) {
			my %chk; @chk{@{$uids}} = undef;
			my @newlst;
			foreach my $u (@{$uidlst}) {
				unless (exists $chk{$u}) {
					push(@newlst, $u);
				}
			}
			if (&storable_store($session, \@newlst, "$fid\.headers.uidlst")) {
				return(1);
			} else {
				&_warn($session, "storable_store");
				return(undef);
			}
		} else {
			&_warn($session, "storable_retrieve");
			return(undef);
		}
	} else {
		return(1);
	}
}

sub _delete_uidlst_search($$$) {
	my ($session, $srkey, $srid) = @_;
	my $srkeys;

	if (ref($srkey) eq "ARRAY") {
		$srkeys = $srkey;
	} else {
		$srkeys = [(split(/\,/, $srkey))];
	}

	if (&storable_exist($session, "search.headers.uidlst.$srid")) {
		if (my $uidlst = &storable_retrieve($session, "search.headers.uidlst.$srid")) {
			my %chk; @chk{@{$srkeys}} = undef;
			my @newlst;
			foreach my $u (@{$uidlst}) {
				unless (exists $chk{$u}) {
					push(@newlst, $u);
				}
			}
			if (&storable_store($session, \@newlst, "search.headers.uidlst.$srid")) {
				return(1);
			} else {
				&_warn($session, "storable_store");
				return(undef);
			}
		} else {
			&_warn($session, "storable_retrieve");
			return(undef);
		}
	} else {
		return(1);
	}
}

sub _clear_uidlst_common($$) {
	my ($session, $fid) = @_;

	if (&storable_clear($session, "$fid\.headers.uidlst")) {
		return(1);
	} else {
		&_warn($session, "_storable_clear");
		return(0);
	}
}

sub _clear_uidlst_search($$) {
	my ($session, $srid) = @_;

	if (&storable_clear($session, "search.headers.uidlst.$srid")) {
		return(1);
	} else {
		&_warn($session, "_storable_clear");
		return(0);
	}
}

sub _clear_old_cache($$;$) {
	my ($session, $conf) = @_;
	
	my @delete = (
		DA::Mailer::get_mailer_dir($session,$session->{user},'recv',"uidval.dat",1),
		"$session->{temp_dir}/$session->{sid}.INBOX.imap_exists",
		"$session->{temp_dir}/$session->{sid}.INBOX.imap_recent",
		"$session->{temp_dir}/$session->{sid}.INBOX.imap_list",
		"$session->{temp_dir}/$session->{sid}.INBOX.imap_list_r",
		"$session->{temp_dir}/$session->{sid}.INBOX.imap_open_folder",
		"$session->{temp_dir}/$session->{sid}.INBOX.imap_tree",
		"$session->{temp_dir}/$session->{sid}.INBOX.imap_info",
		"$session->{temp_dir}/$session->{sid}.INBOX.imap_target",
		"$session->{temp_dir}/$session->{sid}.SEARCH.imap_exists",
		"$session->{temp_dir}/$session->{sid}.SEARCH.imap_recent",
		"$session->{temp_dir}/$session->{sid}.SEARCH.imap_list",
		"$session->{temp_dir}/$session->{sid}.SEARCH.imap_list_r",
		"$session->{temp_dir}/$session->{sid}.SEARCH.imap_open_folder",
		"$session->{temp_dir}/$session->{sid}.SEARCH.imap_tree",
		"$session->{temp_dir}/$session->{sid}.SEARCH.imap_info",
		"$session->{temp_dir}/$session->{sid}.SEARCH.imap_target"
	);
	DA::Unicode::file_unlink(@delete);
	return(1);
}

sub _diff_count($$$;$) {
	my ($oldlst, $uids, $mode, $opt) = @_;
	my $de = 0;
	my $ds = 0;

	if ($mode eq "delete") {
		foreach my $u (@{$uids}) {
			if (exists $oldlst->{$u}) {
				if ($oldlst->{$u}->{seen}) {
					$de --;
				} else {
					$de --;
					$ds --;
				}
				if ($opt){
					delete $oldlst->{$u};
				}
			}
		}
	} elsif ($mode eq "seen") {
		foreach my $u (@{$uids}) {
			if (exists $oldlst->{$u}) {
				if ($oldlst->{$u}->{seen}) {
				} else {
					$ds --;
				}
			}
		}
	} elsif ($mode eq "unseen") {
		foreach my $u (@{$uids}) {
			if (exists $oldlst->{$u}) {
				if ($oldlst->{$u}->{seen}) {
					$ds ++;
				} else {
				}
			}
		}
	} elsif ($mode eq "insert") {
		foreach my $u (@{$uids}) {
			if (exists $oldlst->{$u}) {
				if ($oldlst->{$u}->{seen}) {
					$de ++;
				} else {
					$de ++;
					$ds ++;
				}
			}
		}
	}

	return($de, $ds);
}

sub _array2line($) {
	my ($array) = @_;
	my $line;

	if (ref($array) eq "ARRAY") {
		$line = join(",", @{$array});
	} else {
		$line = $array;
	}

	return($line);
}

sub _encode($$$) {
	my ($session, $imaps, $folder) = @_;
	my $conf = $imaps->{imap};
	my $separator = $conf->{separator};
	my $parent = &_server($session, $imaps);
	my $path = $folder;
	   $path =~s/\Q$separator\E/\#/g;
	   $path = $parent->{path} . "#" . $path;

	return($path);
}

sub _decode($$$;$) {
	my ($session, $imaps, $path, $opt) = @_;
	my $conf = $imaps->{imap};
	my $separator = $conf->{separator};
	my $parent = &_server($session, $imaps);
	my $folder = $path;
	   $folder =~s/^\Q$parent->{path}\E\#?//g;
	   $folder =~s/\#/$separator/g;

	return($folder);
}

sub _utf7_encode($$$) {
	my ($session, $imaps, $str) = @_;
	my $buf = DA::Unicode::imap_utf7_encode($str, &mailer_charset());
	return($buf);
}

sub _utf7_decode($$$) {
	my ($session, $imaps, $str) = @_;
	my $buf = DA::Unicode::imap_utf7_decode($str, &mailer_charset());
	return($buf);
}

sub _upper($$) {
	my ($buf, $charset) = @_;
	return(&convert_mailer(DA::Unicode::upper(&convert_internal($buf), $charset)));
}

sub _lower($$) {
	my ($buf, $charset) = @_;
	return(&convert_mailer(DA::Unicode::lower(&convert_internal($buf), $charset)));
}

sub _warn($$) {
	my ($session, $message) = @_;
	my @caller = caller;
	my $time = DA::CGIdef::get_date('Y4/MM/DD HH:MI:SS');
	warn "[$time][pid:$$] error: $message. ($caller[1]_$caller[2]_$session->{user})";

	return(1);
}

sub _info($$) {
	my ($session, $message) = @_;
	my @caller = caller;

	warn "info: $message. ($caller[1]_$caller[2]_$session->{user})";

	return(1);
}
## <<------------------------------------------ COMMON Method

## XML Method --------------------------------------------->>
sub print_xml($$$;$) {
	my ($session, $imaps, $data, $proc) = @_;
	&disconnect($session, $imaps);
	if (DA::Ajax::mailer_ok($session)) {
		DA::Ajax::print_xml($session, $data, $proc, &mailer_charset());
	} else {
		DA::Ajax::error_xml($session, &error("MAILER_NG", 9), $proc, &mailer_charset());
	}

	return(1);
}

sub error_xml($$$;$) {
	my ($session, $imaps, $error, $proc) = @_;

	&disconnect($session, $imaps);
	DA::Ajax::error_xml($session, $error, $proc, &mailer_charset());

	return(1);
}
## <<--------------------------------------------- XML Method

## IMAP Method -------------------------------------------->>
sub _number($;$) {
	my ($nos, $opt) = @_;
	my @nos;

	my ($s, $e, $l, $i);
	foreach my $n (sort {$a <=> $b} split(/\,/, $nos)) {
		if ($s) {
			if ($e) {
				if (int($n) - 1 == $e) {
					$e = int($n);
				} else {
					$l .="$s\:$e,";
					$s = int($n);
					$e = 0;

					if (length($l) >= $MAX_NUMBER_LENGTH) {
						$l =~s/\,+$//g;
						push(@nos, $l);
						$l = "";
						$i = 0;
					}
				}
			} else {
				if (int($n) - 1 == $s) {
					$e = int($n);
				} else {
					$l .="$s,";
					$s = int($n);

					if (length($l) >= $MAX_NUMBER_LENGTH) {
						$l =~s/\,+$//g;
						push(@nos, $l);
						$l = "";
						$i = 0;
					}
				}
			}
		} else {
			$s = int($n);
		}
		$i ++;

		if ($opt) {
			if ($i >= $MAX_HEADER_STN) {
				if ($s) {
					if ($e) {
						$l .="$s\:$e";
					} else {
						$l .=$s;
					}
				} else {
					$l =~s/\,+$//g;
				}
				push(@nos, $l);
				$l = "";
				$s = 0;
				$e = 0;
				$i = 0;
			}
		}
	}
	if ($s) {
		if ($e) {
			$l .="$s\:$e";
		} else {
			$l .=$s;
		}
		push(@nos, $l);
	}

	return(\@nos);
}

sub _number2array($) {
	my ($no) = @_;
	my @array;

	foreach my $n (split(/\,/, $no)) {
		if ($n =~ /^(\d+)\:(\d+)$/) {
			push(@array, ($1..$2))
		} else {
			push(@array, $n);
		}
	}

	return(\@array);
}

sub _uids2where($) {
	my ($uids) = @_;

	my ($w_column, $w_value);
	if ($uids eq "deleted") {
		$w_column = "deleted"; $w_value = 1;
	} elsif ($uids eq "undeleted") {
		$w_column = "deleted"; $w_value = 0;
	} elsif ($uids eq "seen") {
		$w_column = "seen"; $w_value = 1;
	} elsif ($uids eq "unseen") {
		$w_column = "seen"; $w_value = 0;
	} elsif ($uids eq "flagged") {
		$w_column = "flagged"; $w_value = 1;
	} elsif ($uids eq "unflagged") {
		$w_column = "flagged"; $w_value = 0;
	}

	return({"column" => $w_column, "value" => $w_value});
}

sub _uid_flag($$) {
	my ($session, $imaps) = @_;
	my $uid_flag = $imaps->{session}->Uid();

	return($uid_flag);
}

sub _set_uid_flag($$;$) {
	my ($session, $imaps, $uid_flag) = @_;
	push(@{$imaps->{param}->{uid_flags}}, &_uid_flag($session, $imaps));

	if (defined $uid_flag) {
		$imaps->{session}->Uid($uid_flag);
	} else {
		$imaps->{session}->Uid(1);
	}

	return(1);
}

sub _unset_uid_flag($$) {
	my ($session, $imaps) = @_;
	my $uid_flag = pop(@{$imaps->{param}->{uid_flags}});

	if (defined $uid_flag) {
		$imaps->{session}->Uid($uid_flag);
	} else {
		$imaps->{session}->Uid(0);
	}

	return(1);
}

sub _check_uidvalidity($$$$) {
	my ($session, $imaps, $folder, $uidval) = @_;

	if (defined $uidval) {
		if ($imaps->{uidval}->{$folder}) {
			if ($imaps->{uidval}->{$folder}->{history} ne $uidval) {
				$imaps->{uidval}->{$folder}->{history} = $uidval;
				$imaps->{uidval}->{$folder}->{warn}    = 1;
				$imaps->{param}->{uidval_rewrite}      = 1;
			}
		} else {
			$imaps->{uidval}->{$folder}->{history} = $uidval;
			$imaps->{uidval}->{$folder}->{warn}    = 0;
			$imaps->{param}->{uidval_rewrite}      = 1;
		}
	}

	return(1);
}

sub _uidvalidity($$$;$) {
	my ($session, $imaps, $folder, $real) = @_;
	my $imap = $imaps->{session};

	if ($folder =~ /^inbox$/i && !$real) {
		return(0);
	} else {
		my $uidvalidity = $imap->uidvalidity($folder);
		if (&_error($session, $imaps) && !$uidvalidity) {
			return(undef);
		} else {
			return($uidvalidity);
		}
	}
}

sub _select($$$) {
	my ($session, $imaps, $folder) = @_;
	my $imap   = $imaps->{session};
	my $uidval = &_uidvalidity($session, $imaps, $folder, 1);

	&_check_uidvalidity($session, $imaps, $folder, $uidval);
	$imap->select($folder);

	if (&_error($session, $imaps)) {
		return(undef);
	} else {
		return(1);
	}
}

sub _examine($$$) {
	my ($session, $imaps, $folder) = @_;
	my $imap = $imaps->{session};

	if (my $now_folder = &_folder($session, $imaps)) {
		if ($now_folder ne $folder) {
			my $uidval = &_uidvalidity($session, $imaps, $folder, 1);

			&_check_uidvalidity($session, $imaps, $folder, $uidval);
			$imap->examine($folder);
		}
	} else {
		my $uidval = &_uidvalidity($session, $imaps, $folder, 1);

		&_check_uidvalidity($session, $imaps, $folder, $uidval);
		$imap->examine($folder);
	}

	if (&_error($session, $imaps)) {
		return(undef);
	} else {
		return(1);
	}
}

sub _expunge($$$) {
	my ($session, $imaps, $force) = @_;

	if ($force) {
		$imaps->{session}->expunge();
	} else {
		if ($imaps->{mail}->{delete_after}) {
		} else {
			$imaps->{session}->expunge();
		}
	}

	if (&_error($session, $imaps)) {
		return(undef);
	} else {
		return(1);
	}
}

sub _exists($$$) {
	my ($session, $imaps, $folder) = @_;
	my $imap   = $imaps->{session};
	my $exists = $imap->exists($folder);

	&_error($session, $imaps);

	if ($exists) {
		return(1);
	} else {
		return(undef);
	}
}

sub _create($$$) {
	my ($session, $imaps, $folder) = @_;
	my $imap   = $imaps->{session};
	my $create = $imap->create($folder);

	if (&_error($session, $imaps) && !$create) {
		return(undef);
	} else {
		# UIDVALIDITY が時間に依存する不具合対応 (Cyrus?)
		sleep(1);
		# UIDVALIDITY が確定しない不具合対応 (Courier-IMAP)
		if (&_select($session, $imaps, $folder)) {
			return(1);
		} else {
			return(undef);
		}
	}
}

sub _rename($$$$) {
	my ($session, $imaps, $src, $dst) = @_;
	my $imap   = $imaps->{session};

	$src =~ s/\\/\\\\/g; $src =~ s/\"/\\\"/g;
	$dst =~ s/\\/\\\\/g; $dst =~ s/\"/\\\"/g;

	my $rename = $imap->rename($src, $dst);

	if (&_error($session, $imaps) && !$rename) {
		return(undef)
	} else {
		# UIDVALIDITY が取得できなる不具合あり (UW-IMAP)
		# UIDVALIDITY が時間に依存する不具合対応 (Cyrus?)
		sleep(1);
		# UIDVALIDITY が確定しない不具合対応 (Courier-IMAP)
		if (&_select($session, $imaps, $dst)) {
			return(1);
		} else {
			return(undef);
		}
	}
}

sub _delete($$$) {
	my ($session, $imaps, $folder) = @_;
	my $imap   = $imaps->{session};
	my $delete = $imap->delete($folder);

	if (&_error($session, $imaps) && !$delete) {
		return(undef);
	} else {
		return(1);
	}
}

sub _folder($$) {
	my ($session, $imaps) = @_;
	my $imap = $imaps->{session};
	my $folder = $imap->Folder();

	if (&_error($session, $imaps) && $folder eq "") {
		return(undef);
	} else {
		return($folder);
	}
}

sub _list($$) {
	my ($session, $imaps) = @_;
	my $imap = $imaps->{session};
	my @list = $imap->list();

	if (&_error($session, $imaps) && !scalar(@list)) {
		return(undef);
	} else {
		return(\@list);
	}
}

sub _message_count($$$) {
	my ($session, $imaps, $folder) = @_;
	my $imap = $imaps->{session};
	my $count = $imap->message_count($folder);

	if (&_error($session, $imaps) && !$count) {
		return(undef);
	} else {
		return($count);
	}
}

sub _search($$$;$;$) {
	my ($session, $imaps, $str, $opt, $keywords) = @_;
	my $charset = ($opt && $imaps->{imap}->{charset}) ?
					"CHARSET " . &search_charset() . " " : "";
	my $imap = $imaps->{session};

	my $result;
	if (defined $keywords) {
		if (&check_imap_info($session, $imaps, "literal_search")) {
			$result = $imap->literal_search($charset . $str, @{$keywords});
		} else {
			my @new_keywords;
			foreach my $k (@{$keywords}) {
				$k =~ s/(\"|\\)/\\$1/g;
				push(@new_keywords, "\"$k\"");
			}
			$result = $imap->search($charset . $str . " " . join("", @new_keywords));
		}
	} else {
		$result = $imap->search($charset . $str);
	}

	&_error($session, $imaps);

	if ($result) {
		return($result);
	} else {
		return([]);
	}
}

sub _sign_pos($$) {
	my ($session, $from) = @_;
	my $signature;
	if ($from eq 'keitai_mail') {
		$signature = "sign_posM";
	} elsif ($from eq 'pmail1') {
		$signature = "sign_pos1";
	} elsif ($from eq 'pmail2') {
		$signature = "sign_pos2";
	} else {
		$signature = "sign_pos";
	}
	return $signature;
}

sub _simple_search($$$$$) {
	my ($session, $imaps, $folder, $field, $word) = @_;
	my $imap = $imaps->{session};
	my %fields = (
		"from"    => 1,
		"to"      => 1,
		"cc"      => 1,
		"bcc"     => 1,
		"subject" => 1,
		"text"    => 1,
        "body"    => 1
	);
	my $result = [];

	if ($field =~ /^(header)$/i || DA::CGIdef::iskanji($word, &mailer_charset())) {
		if (my $exists = &_message_count($session, $imaps, $folder)) {
			my $nos = &_number(join(",", (1..$exists)), 1);
			if (scalar(@{$nos})) {
				foreach my $uids (@{$nos}) {
					if (my $headers = &_header($session, $imaps, $uids)) {
						foreach my $n (keys %{$headers}) {
							my $h;
							if ($field eq "header") {
								$h = DA::Mailer::decode_header_field
										($headers->{$n}, 1, 0, &mailer_charset());
							} else {
								if ($h =~ /(?:^|\n)(?:\Q$field\E)\s*:\s*([\x00-\xff]+?)(\n\S|\n+$)/i) {
									$h = $1; $h =~ s/\n\s+//g;
									$h = DA::Mailer::decode_header_field
											($h, 1, 0, &mailer_charset());
								} else {
									next;
								}
							}
							if (&compare_euc($h, $word)) {
								push(@{$result}, $n);
							}
						}
					} else {
						$result = undef; last;
					}
				}
			}
		} else {
			$result = undef;
		}
	} else {
		# フィールドなしもしくは、ASCIIのみ
		my $wj  = DA::Charset::convert(\$word, &mailer_charset(), &search_charset());
		   $wj  =~s/(\"|\\)/\\$1/g;
		my $cri = "ALL";
		my $f   = uc($field);
		if ($fields{$field}) {
			$cri .= " $f \"$wj\"";
		} elsif ($field) {
			$cri .= " HEADER $f \"$wj\"";
		}
		if (my $list = &_search($session, $imaps, $cri)) {
			push(@{$result}, @{$list});
		} else {
			$result = undef;
		}
	}

	return($result);
}

sub _parse_headers($$$$) {
	my ($session, $imaps, $uids, $fields) = @_;
	my $imap = $imaps->{session};

	my $result = $imap->parse_headers([@{&_number2array($uids)}], @{$fields});

	if (&_error($session, $imaps)) {
		return(undef);
	} else {
		return($result);
	}
}

sub _fetch($$$$) {
	my ($session, $imaps, $uids, $type) = @_;
	# BODYSTRUCTURE は $type の末尾が望ましい
	my $imap = $imaps->{session};
	my $match = {
		$MATCH_RULE->{FETCH_FLAGS}	=> "flags\\s+\\(([^\\(\\)]*?)\\)",
		$MATCH_RULE->{FETCH_SIZE}	=> "rfc822.size\\s+(\\d+)",
		$MATCH_RULE->{FETCH_INTDATE}=> "internaldate\\s+\\\"\\s*([^\\\"]*)\\\"",
		$MATCH_RULE->{FETCH_STRUCT}	=> "bodystructure\\s+\\(([\x00-\xff]+)\\)"
	};

	my $result = $imap->fetch($uids, "($type)");

	if (&_error($session, $imaps)) {
		return(undef);
	} else {
		my ($flag, $uid, $line);
		my $fetch = {};
		my @types = split(/\s+/, $type);
		while (scalar(@{$result})) {
			my $l = shift @{$result}; $l =~ s/\r\n/\n/g;
			my $lb;
			if ($l =~ /^\*\s+(\d+)\s+fetch\s+\(/i) {
				$flag = $1;
			}
			if ($flag) {
				if ($type eq $MATCH_RULE->{FETCH_FLAGS}) {
					if ($l =~ /\d+\s+fetch\s+\($match->{$type}\)/i) {
						$line = $1;
					}
				} elsif ($type eq $MATCH_RULE->{FETCH_SIZE}) {
					if ($l =~ /$match->{$type}/i) {
						$line = $1;
					}
				} elsif ($type eq $MATCH_RULE->{FETCH_INTDATE}) {
					if ($l =~ /$match->{$type}/i) {
						$line = $1;
					}
				} elsif ($type eq $MATCH_RULE->{FETCH_STRUCT}) {
					my $lb = $l; $lb =~ s/^.+?\s+fetch\s+\(//i; $lb =~ s/\)[\s\r\n]*$//i;
					if ($lb =~ /$match->{$type}/i) {
						$line = $1;
					}
				} elsif ($type eq $MATCH_RULE->{FETCH_HEADER}) {
					$line = shift @{$result};
				} elsif ($type eq $MATCH_RULE->{FETCH_RFC822}) {
					$line = shift @{$result};
				} else {
					$lb = $l; $lb =~ s/^.+?\s+fetch\s+\(//i; $lb =~ s/\)[\s\r\n]*$//i;
				}

				if ($l =~ /^\*\s+\d+\s+fetch\s+\(.*\s*uid\s+(\d+)\s+/i) {
					$uid = $1;
				} elsif ($l =~ /\s+uid\s+(\d+)\)/i) {
					$uid = $1;
				}

				while(scalar(@{$result})) {
					if ($result->[0] =~ /^\*\s+(\d+)\s+/ && $1 != $flag) {
						last;
					}
					if (!$uid && $result->[0] =~ /\s+uid\s+(\d+).*\s*\)/i) {
						$uid = $1;
					}
					if ($lb) {
						$lb .= shift @{$result};
					} else {
						shift @{$result};
					}
				}

				if ($lb) {
					$line = {};
					foreach my $t (@types) {
						if ($t eq $MATCH_RULE->{FETCH_FLAGS}) {
							if ($lb =~ s/$match->{$t}//i) {
								$line->{$t} = $1;
							}
						} elsif ($t eq $MATCH_RULE->{FETCH_SIZE}) {
							if ($lb =~ s/$match->{$t}//i) {
								$line->{$t} = $1;
							}
						} elsif ($t eq $MATCH_RULE->{FETCH_INTDATE}) {
							if ($lb =~ s/$match->{$t}//i) {
								$line->{$t} = $1;
							}
						} elsif ($t eq $MATCH_RULE->{FETCH_STRUCT}) {
							if ($lb =~ s/$match->{$t}//i) {
								$line->{$t} = $1;
							}
						}
					}
				}

				if ($uid) {
					if (ref($line) eq "HASH") {
						%{$fetch->{$uid}} = %{$line};
					} else {
						$fetch->{$uid} = $line;
					}
				}

				$flag = 0;
				$uid  = 0;
				$line = "";
			}
		}

		return($fetch);
	}
}

sub _flags($$$) {
	my ($session, $imaps, $uids) = @_;
	return(&_fetch($session, $imaps, $uids, $MATCH_RULE->{FETCH_FLAGS}))
}

sub _header($$$) {
	my ($session, $imaps, $uids) = @_;
	return(&_fetch($session, $imaps, $uids, $MATCH_RULE->{FETCH_HEADER}));
}

sub _header_local($$$$) {
	my ($session, $imaps, $uids, $target) = @_;
	my $h = {};
	unless ($target) {
		$target = "sent";
	}

	foreach my $u (@{&_number2array($uids)}) {
		my $file ;
		if($target eq 'backup') {
			#backup change dir
			$file = &infobase($session, $target) . "/$u/$u\.jis";
		}else {
			$file = &infobase($session, $target) . "/$u\.jis";
		}
		if (my $fh = &open_file($session, $file, "r")) {
			while (my $l = <$fh>) {
				$l =~ s/\r\n/\n/g; $h->{$u} .= $l;
				if ($l =~ /^\n+$/) {
					last;
				}
			}
			&close_file($session, $file, $fh);
		} else {
			&_warn($session, "open_file"); $h = undef; last;
		}
	}

	return($h);
}

sub _rfc822($$$) {
	my ($session, $imaps, $uids) = @_;
	return(&_fetch($session, $imaps, $uids, $MATCH_RULE->{FETCH_RFC822}));
}

sub _rfc822_local($$$$) {
	my ($session, $imaps, $uids, $target) = @_;
	my $r = {};
	unless ($target) {
		$target = "sent";
	}

	foreach my $u (@{&_number2array($uids)}) {
		my $file ;
		if($target eq 'backup') {
			$file = &infobase($session, $target) . "/$u/$u\.jis";
		}else {
			$file = &infobase($session, $target) . "/$u\.jis";
		}
		my $buf = &read_file($session, $file);
		if (defined $buf) {
			$r->{$u} = $buf;
		} else {
			&_warn($session, "read_file"); $r = undef; last;
		}
	}

	return($r);
}

sub _store($$$$;$) {
	my ($session, $imaps, $uids, $flag, $return_flag) = @_;

	my $result = $imaps->{session}->store($uids, $flag);

	if (&_error($session, $imaps)) {
		return(undef);
	} elsif ($return_flag) {
		return($result);
	} else {
		return(1);
	}
}

sub _deleted($$$;$) {
	my ($session, $imaps, $uids, $return_flag) = @_;
	return(&_store($session, $imaps, $uids, '+FLAGS (\Deleted)', $return_flag));
}

sub _undeleted($$$) {
	my ($session, $imaps, $uids) = @_;
	return(&_store($session, $imaps, $uids, '-FLAGS (\Deleted)'));
}

sub _seen($$$) {
	my ($session, $imaps, $uids) = @_;
	return(&_store($session, $imaps, $uids, '+FLAGS (\Seen)'));
}

sub _unseen($$$) {
	my ($session, $imaps, $uids) = @_;
	return(&_store($session, $imaps, $uids, '-FLAGS (\Seen)'));
}

sub _flagged($$$) {
	my ($session, $imaps, $uids) = @_;
	return(&_store($session, $imaps, $uids, '+FLAGS (\Flagged)'));
}

sub _unflagged($$$) {
	my ($session, $imaps, $uids) = @_;
	return(&_store($session, $imaps, $uids, '-FLAGS (\Flagged)'));
}

sub _replied($$$) {
	my ($session, $imaps, $uids) = @_;
	if (&check_imap_info($session, $imaps, "no_user_flag") || &check_imap_info($session, $imaps, "no_replied_flag")) {
		return(1);
	} else{
		return(&_store($session, $imaps, $uids, '+FLAGS (ISEReplied)'));
	}
}

sub _unreplied($$$) {
	my ($session, $imaps, $uids) = @_;
	if (&check_imap_info($session, $imaps, "no_user_flag") || &check_imap_info($session, $imaps, "no_replied_flag")) {
		return(1);
	} else {
		return(&_store($session, $imaps, $uids, '-FLAGS (ISEReplied)'));
	}
}

sub _forwarded($$$) {
	my ($session, $imaps, $uids) = @_;
	if (&check_imap_info($session, $imaps, "no_user_flag") || &check_imap_info($session, $imaps, "no_forwarded_flag")) {
		return(1);
	} else {
		return(&_store($session, $imaps, $uids, '+FLAGS (ISEForwarded)'));
	}
}

sub _unforwarded($$$) {
	my ($session, $imaps, $uids) = @_;
	if (&check_imap_info($session, $imaps, "no_user_flag") || &check_imap_info($session, $imaps, "no_forwarded_flag")) {
		return(1);
	} else {
		return(&_store($session, $imaps, $uids, '-FLAGS (ISEForwarded)'));
	}
}

sub _move($$$$) {
	my ($session, $imaps, $uids, $folder) = @_;
	my $relust = &_copy($session, $imaps, $uids, $folder);
	if ($relust) {
		if (&_deleted($session, $imaps, $uids)) {
			return($relust);
		} else {
			return(undef);
		}
	} else {
		return(undef);
	} 
}

sub _copy($$$$) {
	my ($session, $imaps, $uids, $folder) = @_;
	my $imap = $imaps->{session};

	unless ( _exists($session, $imaps, $folder) ){
		return(undef);
	}

	my $result = $imap->copy($folder, $uids);

	if (&_copy_error($session, $imaps) && !$result) {
		return(undef);
	} else {
		if(ref($result) eq 'DA::IMAP'){
			return('none');
		}else{
			my @array=split(/\,/,$result);
			my $success=scalar(@array);
			return($success);
		}
		
	}
}

sub _size($$$) {
	my ($session, $imaps, $uid) = @_;
	my $imap = $imaps->{session};
	my $size = $imap->size($uid);

	if (&_error($session, $imaps)) {
		return(undef);
	} else {
		return($size);
	}
}

sub _append($$$) {
	my ($session, $imaps, $folder, $file) = @_;
	my $imap = $imaps->{session};
	my $result = $imap->append_file($folder, $file);
	if (&_error($session, $imaps)) {
		return(undef);
	} else {
		return $result;
	}
}

sub _separator($$) {
	my ($session, $imaps) = @_;
	my $imap = $imaps->{session};
	my $separator = $imap->separator();

	if (&_error($session, $imaps) && !$separator) {
		return(undef);
	} else {
		return($separator);
	}
}

sub _tag_and_run($$$) {
	my ($session, $imaps, $str) = @_;
	my $imap = $imaps->{session};
	my @result = $imap->tag_and_run("GETQUOTAROOT INBOX");

	if (&_error($session, $imaps) && !scalar(@result)) {
		return(undef);
	} else {
		return(\@result);
	}
}

sub _error($$) {
	my ($session, $imaps, $name) = @_;
	my $error = $imaps->{session}->{LastError};

	if ($error =~ /^(?:\d+\s+[nN][oO]\s+|[eE][rR][rR][oO][rR]\s+)/) {
		if ($name eq "") {
			my @call = caller;
			$name = "$call[1]\_$call[2]\_$session->{user}";
		}

		delete $imaps->{session}->{LastError};

		&_warn($session, "IMAP error [$name:$error]");
	} else {
		$error = 0;
	}

	if ($@) {
		if ($@ =~ /Socket closed while reading data from server/i) {
			my $new = &connect($session);
			foreach my $key (keys %{$new}) {
				$imaps->{$key} = $new->{$key};
			}
		}
		$@ = undef;
	}

	return($error);
}

sub _copy_error($$;$) {
	my ($session, $imaps, $name) = @_;
	my $error = $imaps->{session}->{LastError};

	if ($error =~ /^\d+\s+(BAD|NO)\s+/i) {
		if ($name eq "") {
			my @call = caller;
			$name = "$call[1]\_$call[2]\_$session->{user}";
		}

		delete $imaps->{session}->{LastError};

		&_warn($session, "IMAP error [$name:$error]");
	} else {
		$error = 0;
	}

	if ($@) {
		if ($@ =~ /Socket closed while reading data from server/i) {
			my $new = &connect($session);
			foreach my $key (keys %{$new}) {
				$imaps->{$key} = $new->{$key};
			}
		}
		$@ = undef;
	}

	return($error);
}

sub _cleanup($$) {
	my ($session, $imaps) = @_;

	if (ref($imaps->{session}) eq 'DA::IMAP') {
		undef %{$imaps->{session}};
	} elsif (ref($imaps->{session}) eq 'HASH')  {
		undef %{$imaps->{session}};
	} else {
		undef $imaps;
	}

	return(1);
}
## <<-------------------------------------------- IMAP Method

## DB Method <<----------------------------------------------
sub _header_table($) {
	my ($mid) = @_;
	my $table;

	if ($DA::Vars::p->{mail_header_tables}) {
		$table = 'is_mail_header_'
		       . ($mid%$DA::Vars::p->{mail_header_tables});
	} else {
		$table = 'is_mail_header_'
		       . substr($mid, -1, 1);
	}

	return($table);
}

sub _folder_table($) {
	my ($mid) = @_;
	my $table;

	if ($DA::Vars::p->{mail_folder_tables}) {
		$table = 'is_mail_folder_'
		       . ($mid%$DA::Vars::p->{mail_folder_tables});
	} else {
		$table = 'is_mail_folder_'
		       . ($mid%100);
	}

	return($table);
}

sub _bind_num($$) {
	my ($table, $column) = @_;
	my $num;

	if ($table =~ /^is_mail_header/i) {
		my $table = {
			"mid"			=> 3,
			"imap_host"		=> 1,
			"imap_user"		=> 1,
			"folder_name"	=> 1,
			"uidvalidity"	=> 3,
			"uid_number"	=> 3,
			"priority"		=> 3,
			"seen"			=> 3,
			"flagged"		=> 3,
			"replied"		=> 3,
			"forwarded"		=> 3,
			"deleted"		=> 3,
			"attachment"	=> 3,
			"attach4ajx"	=> 3,
			"mail_size"		=> 3,
			"to_status"		=> 3,
			"to_field"		=> 1,
			"from_field"	=> 1,
			"date_field"	=> 1,
			"subject_field"	=> 1,
			"to_ext"		=> 1,
			"from_ext"		=> 1,
			"subject_ext"	=> 1,
			"internal"      	=> 1,
                        "reserve1"              => 3,
                        "reserve2"              => 3
		};
		$num = $table->{lc($column)};
	} else {
		my $table = {
			"mid"			=> 3,
			"imap_host"		=> 1,
			"imap_user"		=> 1,
			"folder_name"	=> 1,
			"uidvalidity"	=> 1,
			"recent_count"	=> 3,
			"exists_count"	=> 3,
			"unseen_count"	=> 3,
			"max_uid_number"=> 3,
			"old_uid_number"=> 3,
			"filter_number"	=> 1
		};
		$num = $table->{lc($column)};
	}

	#===========================================
	#     Custom
	#===========================================
	DA::Custom::rewrite_mail_bind_num4ajx($table,$column,\$num);
	#===========================================

	return($num);
}

sub _column2xmlname($) {
	my ($column) = @_;
	
	my %xmlname	= (
		"uid_number"	=> "uid",
		"priority"		=> "priority",
		"seen"			=> "seen",
		"flagged"		=> "flagged",
		"replied"		=> "replied",
		"forwarded"		=> "forwarded",
		"deleted"		=> "deleted",
		"attachment"	=> "attach4old",
		"attach4ajx"	=> "attachment",
		"mail_size"		=> "size",
		"to_status"		=> "toself",
		"to_field"		=> "to",
		"from_field"	=> "from",
		"date_field"	=> "date",
		"subject_field"	=> "subject",
		"backup_maid"   => "backup_maid",
		"backup_org_clrRdir" => "backup_org_clrRdir"
	);

	if ($xmlname{lc($column)}) {
		return($xmlname{lc($column)});
	} else {
		return($column);
	}
}

sub _xmlname2column($) {
	my ($xmlname) = @_;
	my %column = (
		"uid"			=> "uid_number",
		"priority"		=> "priority",
		"seen"			=> "seen",
		"flagged"		=> "flagged",
		"replied"		=> "replied",
		"forwarded"		=> "forwarded",
		"deleted"		=> "deleted",
		"attach4old"	=> "attachment",
		"attachment"	=> "attach4ajx",
		"size"			=> "mail_size",
		"toself"		=> "to_status",
		"to"			=> "to_field",
		"from"			=> "from_field",
		"date"			=> "date_field",
		"subject"		=> "subject_field"
	);

	if ($column{lc($xmlname)}) {
		return($column{lc($xmlname)});
	} else {
		return($xmlname);
	}
}

sub _db_str($$) {
	my ($euc, $utf8) = @_;

	if (&mailer_charset() eq "UTF-8") {
		if ($utf8 eq "") {
			return($euc);
		} else {
			return(MIME::Base64::decode_base64($utf8));
		}
	} else {
		return($euc);
	}
}

sub _db_substr($$) {
	my ($column, $value) = @_;
	my %length = (
		"uid_number"	=> 1000,
		"folder_name"	=> 200,
		"to_field"		=> 2000,
		"from_field"	=> 2000,
		"date_field"	=> 21,
		"subject_field"	=> 2000,
		"to_ext"		=> 1500,
		"from_ext"		=> 1500,
		"subject_ext"	=> 1500
	);

	if (defined $length{$column}) {
		my $charset = &mailer_charset();
		my $length  = $length{$column};

		if ($column =~ /ext$/) {
			my $string = DA::Charset::convert(\$value, $charset, "UTF-8");
			   $string = DA::Charset::sub_str($string, "UTF-8", 0, $length);
			   $string = MIME::Base64::encode_base64($string); $string =~ s/[\r\n]//g;
			return($string);
		} else {
			my $string = DA::Charset::sub_str($value, $charset, 0, $length);
			return($string);
		}
	} else {
		return($value);
	}
}

sub _splice_uidlst($) {
	my ($uidlst) = @_;
	my $length = 1000;
	my @list;

	while (my @l = splice(@{$uidlst}, 0, $length)) {
		my $in = "?," x scalar(@l); $in =~ s/\,+$//g;
		my $h  = {
			"in"	=> $in,
			"uids"	=> \@l
		};
		push(@list, $h);
	}

	return(\@list);
}

sub _vfilter_where($$$$) {
	my ($session, $imaps, $vfilter, $cid) = @_;

	unless ($cid) {
		$cid = ($vfilter->{common}->{default}) ? ($vfilter->{common}->{default}) : 1;
	}

	my $today;
	if ($vfilter->{$cid}->{today} eq 2) {
		$today = DA::CGIdef::get_date2($session, "Y4/MM/DD");
		$today = DA::CGIdef::get_target_date
					($today, $vfilter->{$cid}->{term} * -1, "Y4/MM/DD") . "-00:00:00";
		$today = DA::CGIdef::convert_date($session, $today, 1, "+0000");
	} else {
		$today = DA::CGIdef::get_date2($session, "Y4/MM/DD") . "-00:00:00";
		$today = DA::CGIdef::convert_date($session, $today, 1, "+0000");
	}

	my $where_tbl = {
		"seen" => {
			"1" => { "column" => "seen", "value" => 0 },
			"2" => { "column" => "seen", "value" => 1 }
		},
		"flagged" => {
			"1" => { "column" => "flagged", "value" => 0 },
			"2" => { "column" => "flagged", "value" => 1 }
		},
		"attach" => {
			"1" => { "column" => "attach4ajx", "value" => 0 },
			"2" => { "column" => "attach4ajx", "value" => 1 }
		},
		"priority" => {
			"1" => { "column" => "priority", "value" => [1,2] },
			"3" => { "column" => "priority", "value" => 3 },
			"5" => { "column" => "priority", "value" => [4,5] }
		},
		"toself" => {
			"1" => { "column" => "to_status", "value" => 1 }
		},
		"deleted" => {
			"0" => { "column" => "deleted", "value" => 0 }
		},
		"today" => {
			"1" => { "column" => "date_field", "value" => $today, "rule" => ">=" },
			"2" => { "column" => "date_field", "value" => $today, "rule" => ">=" }
		}
	};

	my @where;
	if (DA::SmartPhone::isSmartPhoneUsed()) {
		foreach my $i (qw(seen flagged attach priority toself deleted today)) {
			if (defined $where_tbl->{$i}->{$vfilter->{$cid}->{$i}}) {
				push(@where, $where_tbl->{$i}->{$vfilter->{$cid}->{$i}});
			}
		}
	}

	return(\@where);
}

sub _search_where($$$$) {
	my ($session, $imaps, $field, $word) = @_;
	my @search;
	my $part;
	if ($imaps->{custom}->{part_search4ajx} eq 'on'){
		$part="%";
	}
	$word=DA::Unicode::trim($word);
	if ($word ne "") {
		my $ESC_CHAR = '$';
		($word, $ESC_CHAR) = &_escape_keyword($word);

		if ($field eq "subject") {
			my $column = "subject_field";
			my $value  = $part . $word . "%";
			my $rule   = " like ";
			my $opt    = "escape '$ESC_CHAR'";
			my $line   = {
				"column" => $column,
				"value"  => $value,
				"rule"   => $rule,
				"opt"    => $opt
			};
			push(@search, $line);
		} elsif ($field eq "from") {
			my $column = "from_field";
			my $value  = $part . $word . "%";
			my $rule   = " like ";
			my $opt    = "escape '$ESC_CHAR'";
			my $line   = {
				"column" => $column,
				"value"  => $value,
				"rule"   => $rule,
				"opt"    => $opt
			};
			push(@search, $line);
		} elsif ($field eq "to") {
			my $column = "to_field";
			my $value  = $part . $word . "%";
			my $rule   = " like ";
			my $opt    = "escape '$ESC_CHAR'";
			my $line   = {
				"column" => $column,
				"value"  => $value,
				"rule"   => $rule,
				"opt"    => $opt
			};
			push(@search, $line);
		}

		#===========================================
		#     Custom
		#===========================================
		DA::Custom::rewrite_mail_search_where4ajx($session,$imaps,$field,$word,$part,$ESC_CHAR,\@search);
		#===========================================

	}

	return(\@search);

}

sub _make_where($) {
	my ($wheres) = @_;
	my $where;

	foreach my $w (@{$wheres}) {
		if (exists $w->{value}) {
			if (ref($w->{value}) eq "ARRAY") {
				my $h = "?," x scalar(@{$w->{value}}); $h =~ s/\,+$//g;
				$where .= "$w->{column} in ($h) and ";
			} else {
				if ($w->{rule}) {
					$where .= "$w->{column}$w->{rule}? and ";
				} else {
					$where .= "$w->{column}=? and ";
				}
			}
		} else {
			$where .= "$w->{column} is null and ";
		}
	}
	$where =~ s/ and $//g;

	return($where);
}

sub _make_search($) {
	my ($searchs) = @_;
	my $search;

	foreach my $s (@{$searchs}) {
		my $opt = " " . $s->{opt};
		if (exists $s->{value}) {
			if (ref($s->{value}) eq "ARRAY") {
				my $h = "?," x scalar(@{$s->{value}}); $h =~ s/\,+$//g;
				$search .= "$s->{column} in ($h)$opt and ";
			} else {
				if ($s->{rule}) {
					$search .= "$s->{column}$s->{rule}?$opt or ";
				} else {
					$search .= "$s->{column}=?$opt or ";
				}
			}
		} else {
			$search .= "$s->{column} is null$opt or ";
		}
	}
	$search =~ s/ or $//g;

	if ($search) {
		$search = "($search)";
	}

	return($search);
}

sub _make_set($) {
	my ($sets) = @_;
	my $set;

	foreach my $s (@{$sets}) {
		if (exists $s->{value}) {
			$set .= "$s->{column}=?,";
		} else {
			$set .= "$s->{column} is null,";
		}
	}
	$set =~ s/\,+$/ /g;

	return($set);
}

sub _make_order($$$$$) {
	my ($session, $imaps, $type, $sort_key, $sort) = @_;
	my $default;

	if ($type eq $TYPE_INBOX) {
		$default = $imaps->{mail}->{def_sort_inbox};
	} elsif ($type eq $TYPE_SENT) {
		$default = $imaps->{mail}->{def_sort_sent};
	} elsif ($type eq $TYPE_DRAFT) {
		$default = $imaps->{mail}->{def_sort_draft};
	} elsif ($type eq $TYPE_TRASH) {
		$default = $imaps->{mail}->{def_sort_trash};
	} else {
		$default = $imaps->{mail}->{def_sort};
	}

	if (!$sort_key && $default) {
		($sort_key, $sort) = split(/\_/, $default);
		if ($sort_key !~ /^(flagged|priority|seen|attachment|size|from|date|subject)$/) {
			$sort_key = ""; $sort = "";
		}
	}

	if ($sort_key eq "") {
		$sort_key = "recent";
	}
	if ($sort eq "") {
		$sort = "desc";
	}

	my $sort_tbl = {
		"priority" => {
			"asec" => "priority desc,internal asc,uid_number asc",
			"desc" => "priority asc,internal desc,uid_number desc"
		},
		"seen" => {
			"asec" => "seen desc,internal asc,uid_number asc",
			"desc" => "seen asc,internal desc,uid_number desc"
		},
		"flagged" => {
			"asec" => "flagged asc,internal asc,uid_number asc",
			"desc" => "flagged desc,internal desc,uid_number desc"
		},
		"attachment" => {
			"asec" => "attach4ajx asc,internal asc,uid_number asc",
			"desc" => "attach4ajx desc,internal desc,uid_number desc"
		},
		"size" => {
			"asec" => "mail_size asc,internal asc,uid_number asc",
			"desc" => "mail_size desc,internal desc,uid_number desc"
		},
		"from" => {
			"asec" => ($type eq $TYPE_SENT || $type eq $TYPE_DRAFT) ?
			         "to_field asc,internal asc,uid_number asc"
			       : "from_field asc,internal asc,uid_number asc",
			"desc" => ($type eq $TYPE_SENT || $type eq $TYPE_DRAFT) ?
			         "to_field desc,internal desc,uid_number desc"
			       : "from_field desc,internal desc,uid_number desc"
		},
		"date" => {
			"asec" => "date_field asc,internal asc,uid_number asc",
			"desc" => "date_field desc,internal desc,uid_number desc" 
		},
		"subject" => {
			"asec" => "subject_field asc,internal asc,uid_number asc",
			"desc" => "subject_field desc,internal desc,uid_number desc"
		},
		"recent" => {
			"asec" => "internal asc,uid_number asc",
			"desc" => "internal desc,uid_number desc"
		}
	};
	
	# "subject_field asc" => "subject_field IS NULL asc,subject_field asc "にしてNULLの並びをOracleと同じにする処理
	my $sort_spec = $sort_tbl->{$sort_key}->{$sort};
	if($DA::Vars::p->{MYSQL}){
		my @s_list = split(',', $sort_spec);
		$sort_spec="";
		foreach my$ts(@s_list){
			my($col,$dist)=split(" ",$ts);
			$sort_spec.="$col IS NULL $dist,$col $dist,";
		}
		$sort_spec =~ s/,$//;
	}
	return($sort_spec);

}

sub _prepare($$) {
	my ($session, $sql) = @_;
	my $internal_sql = &convert_internal($sql);

	if ($DA::Vars::p->{SQL_LOG}) {
		my @call  = caller;
		my $title = "$call[0]:$call[3]:$session->{user}";
		DA::DeBug::sql_log($internal_sql, $title);
	}

	my $sth = $session->{dbh}->prepare($internal_sql);

	return($sth);
}

sub _bind_param($$$$) {
	my ($sth, $cn, $value, $type) = @_;
	my $internal_value = &convert_internal($value);

	if ($DA::Vars::p->{SQL_LOG}) {
		DA::DeBug::sql_log("$cn: $internal_value ($type)", "_bind_param");
	}
	$sth->bind_param($cn, $internal_value, $type);

	return(1);
}

sub _bind_params($$;$;$;$;$) {
	my ($sth, $table, $wheres, $uids, $sets, $searchs) = @_;

	my $i = 1;
	if ($sets) {
		foreach my $s (@{$sets}) {
			if (exists $s->{value}) {
				&_bind_param($sth, $i++, $s->{value}, &_bind_num($table, $s->{column}));
			} else {
				next;
			}
		}
	}

	if ($wheres) {
		foreach my $w (@{$wheres}) {
			if (exists $w->{value}) {
				if (ref($w->{value}) eq "ARRAY") {
					foreach my $v (@{$w->{value}}) {
						&_bind_param($sth, $i++, $v, &_bind_num($table, $w->{column}));
					}
				} else {
					&_bind_param($sth, $i++, $w->{value}, &_bind_num($table, $w->{column}));
				}
			} else {
				next;
			}
		}
	}

	if ($uids) {
		foreach my $u (@{$uids}) {
			&_bind_param($sth, $i++, $u, &_bind_num($table, "uid_number"));
		}
	}

	if ($searchs) {
		foreach my $s (@{$searchs}) {
			if (exists $s->{value}) {
				if (ref($s->{value}) eq "ARRAY") {
					foreach my $v (@{$s->{value}}) {
						&_bind_param($sth, $i++, $v, &_bind_num($table, $s->{column}));
					}
				} else {
					&_bind_param($sth, $i++, $s->{value}, &_bind_num($table, $s->{column}));
				}
			} else {
				next;
			}
		}
	}

	return($i);
}

sub _fetchrow($;$;$) {
	my ($sth, $opt, $key) = @_;
	my $lines;

	if ($opt eq 2) {
		$lines = {};

		while (my (@line) = $sth->fetchrow()) {
			my %line;
			for (my $i = 0; $i < @line; $i ++) {
				$line[$i] =~ s/\s+$//g;
				$line{lc($sth->{NAME}[$i])} = &convert_mailer($line[$i]);
			}
			$lines->{$line{$key}} = \%line;
		}
	} else {
		$lines = [];

		if ($opt) {
			while (my ($line) = $sth->fetchrow()) {
				push(@{$lines}, &convert_mailer($line));
			}
		} else {
			while (my (@line) = $sth->fetchrow()) {
				my %line;
				for (my $i = 0; $i < @line; $i ++) {
					$line[$i] =~ s/\s+$//g;
					$line{lc($sth->{NAME}[$i])} = &convert_mailer($line[$i]);
				}
				push(@{$lines}, \%line);
			}
		}
	}
	return($lines);
}

sub _insert_header($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{host}    : IMAP HOST       （省略可）
	#   ->{user}    : IMAP USER       （省略可）
	#   ->{folder}  : FOLDER NAME     （必須）
	#   ->{uidval}  : UIDVALIDITY     （必須）
	#   ->{data}    : INSERT DATA     （必須）
	my $logger  = &_logger_init($session, 1);
	my $mid;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$mid = DA::OrgMail::get_mid4folder($session, $c);
	} else {
		$mid = $c->{mid} || $session->{user};
	}
	my $host    = $c->{host}   || $imaps->{imap}->{host};
	my $user    = $c->{user}   || $imaps->{imap}->{user};
	my $folder  = $c->{folder};
	my $uidval  = $c->{uidval};
	my $data    = $c->{data};
	my $table   = &_header_table($mid);
	my $result  = 1;
	if($folder eq ""){
		return 0;
	}
	
	my @items = qw (
		mid imap_host imap_user folder_name uidvalidity
		uid_number seen flagged deleted replied forwarded
		attachment attach4ajx mail_size priority internal
		date_field from_field to_field subject_field
		from_ext to_ext subject_ext
		to_status
		reserve1 reserve2
	);

	#===========================================
	#     Custom
	#===========================================
	DA::Custom::rewrite_insert_header_items4ajx({"insert_header_items" => \@items});
	#===========================================

	my $values = "?," x scalar(@items); $values =~ s/\,+$//g;

	if (&lock($session, "header.table")) {
		DA::Session::trans_init($session);
		eval {
			my $sql	= "insert into $table ("
					. join(",", @items)
					. ") values ("
					. $values
					. ")";
			my $sth = &_prepare($session, $sql);

			my $commit = 0;
			foreach my $u (sort {$a <=> $b} keys %{$data}) {
				for (my $i = 0; $i < scalar(@items); $i ++) {
					my $num    = $i+1;
					my $column = $items[$i];
					my $type   = _bind_num($table, $column);
					if ($column eq "mid") {
						&_bind_param($sth, $num, $mid, $type);
					} elsif ($column eq "imap_host") {
						&_bind_param($sth, $num, $host, $type);
					} elsif ($column eq "imap_user") {
						&_bind_param($sth, $num, $user, $type);
					} elsif ($column eq "folder_name") {
						&_bind_param($sth, $num, $folder, $type);
					} elsif ($column eq "uidvalidity") {
						&_bind_param($sth, $num, $uidval, $type);
					} elsif ($column eq "uid_number") {
						&_bind_param($sth, $num, $u, $type);
                                        } elsif ($column =~ /^reserve[\d+]$/) {
                                                &_bind_param($sth, $num, $data->{$u}->{$column}, $type);
					} else {
						my $value = _db_substr($column, $data->{$u}->{$column});
						&_bind_param($sth, $num, $value, $type);
					}
				}
				$sth->execute();

				$commit ++;
				if ($commit >= $COMMIT_COUNT) {
					$session->{dbh}->commit();
					$commit = 0;
				}
			}
			$sth->finish();
		};
		if (!DA::Session::exception($session)) {
			&_warn($session, "exception");
			$result = 0;
		}

		&unlock($session, "header.table");
	} else {
		&_warn($session, "lock");
		$result = 0;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub _select_header($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{host}    : IMAP HOST       （省略可）
	#   ->{user}    : IMAP USER       （省略可）
	#   ->{folder}  : FOLDER NAME     （省略可）
	#   ->{uidval}  : UIDVALIDITY     （省略可）
	#   ->{uidlst}  : UID LIST        （省略可）
	#   ->{output}  : OUTPUT ITEM     （必須）
	#   ->{where}   : WHERE           （省略可）
	#   ->{search}  : SEARCH用        （省略可）
	#   ->{order}   : ORDER BY        （省略可）
	#   ->{mode}    : user or folder  （省略可）
	#   ->{list}    : OUTPUT is list  （省略可）
	#               : 0 = Simple
	#               : 1 = Array
	#               : 2 = Hash
	#   ->{key}     : Hash key        （省略可）
	my $logger  = &_logger_init($session, 1);
	my $mid;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$mid = DA::OrgMail::get_mid4folder($session, $c);
	} else {
		$mid = $c->{mid} || $session->{user};
	}
	my $host    = $c->{host}   || $imaps->{imap}->{host};
	my $user    = $c->{user}   || $imaps->{imap}->{user};
	my $folder  = $c->{folder};
	my $uidval  = $c->{uidval};
	my $order	= $c->{order}  || "uid_number desc";
	my $table   = &_header_table($mid);
	my $headers;

	my $output;
	if (ref($c->{output}) eq "ARRAY") {
		
		$output = join(",", @{$c->{output}});
	} else {
		$output = $c->{output};
	}

	if ($output =~ /^(?:count|max)\(/) {
		$order = "";
	} else {
		$order = " order by $order";
	}

	my (@wheres, @searchs);
	if ($c->{mode} eq "user") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
	} elsif ($c->{mode} eq "folder_name") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
	} else {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
		if ($uidval eq "") {
			push(@wheres, { "column" => "uidvalidity" });
		} else {
			push(@wheres, { "column" => "uidvalidity", "value" => $uidval });
		}
	}
	if (ref($c->{where}) eq "ARRAY") {
		push(@wheres, @{$c->{where}});
	}
	if (ref($c->{search}) eq "ARRAY") {
		push(@searchs, @{$c->{search}});
	}

	if (&lock($session, "header.table")) {
		DA::Session::trans_init($session);
		eval {
			my $where  = &_make_where(\@wheres);
			my $search = &_make_search(\@searchs);
			if ($search) {
				$search = " and $search";
			}
			if (ref($c->{uidlst}) eq "ARRAY") {
				if ($c->{list} eq 2) {
					$headers = {};
				} else {
					$headers = [];
				}
				foreach my $h (@{_splice_uidlst([@{$c->{uidlst}}])}) {
					my $sql = "select $output from $table where $where"
					        . " and uid_number in ($h->{in})$search$order";
					my $sth = &_prepare($session, $sql);
					my $i   = &_bind_params
								($sth, $table, \@wheres, $h->{uids}, 0, \@searchs);

					$sth->execute();

					my $l = &_fetchrow($sth, $c->{list}, $c->{key});
					if ($c->{list} eq 2) {
						foreach my $k (sort {$a <=> $b} keys %{$l}) {
							$headers->{$k} = $l->{$k};
						}
					} else {
						push(@{$headers}, @{$l});
					}
					$sth->finish;
				}
			} else {
				my $sql = "select $output from $table where $where$search$order";
				my $sth = &_prepare($session, $sql);
				my $i   = &_bind_params($sth, $table, \@wheres, 0, 0, \@searchs);

				$sth->execute();

				$headers = [];
				$headers = &_fetchrow($sth, $c->{list}, $c->{key});

				$sth->finish;
			}
		};
		if (!DA::Session::exception($session)) {
			&_warn($session, "exception");
			$headers = undef;
		}

		&unlock($session, "header.table");
	} else {
		&_warn($session, "lock");
		$headers = undef;
	}

	&_logger($session, $imaps, $logger);

	return($headers);
}

sub _update_header($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{host}    : IMAP HOST       （省略可）
	#   ->{user}    : IMAP USER       （省略可）
	#   ->{folder}  : FOLDER NAME     （省略可）
	#   ->{uidval}  : UIDVALIDITY     （省略可）
	#   ->{uidlst}  : UID LIST        （省略可）
	#   ->{set}     : SET             （必須）
	#   ->{where}   : WHERE           （省略可）
	#   ->{mode}    : user or folder  （省略可）
	my $logger  = &_logger_init($session, 1);
	my $mid;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$mid = DA::OrgMail::get_mid4folder($session, $c);
	} else {
		$mid = $c->{mid} || $session->{user};
	}
	my $host    = $c->{host}   || $imaps->{imap}->{host};
	my $user    = $c->{user}   || $imaps->{imap}->{user};
	my $folder  = $c->{folder};
	my $uidval  = $c->{uidval};
	my $table   = &_header_table($mid);
	my $result  = 1;

	my (@wheres, @sets);
	if ($c->{mode} eq "user") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
	} elsif ($c->{mode} eq "folder_name") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
	} else {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
		if ($uidval eq "") {
			push(@wheres, { "column" => "uidvalidity" });
		} else {
			push(@wheres, { "column" => "uidvalidity", "value" => $uidval });
		}
	}	
    if (ref($c->{where}) eq "ARRAY") {
        push(@wheres, @{$c->{where}});
    }
	if (ref($c->{set}) eq "ARRAY") {
		push(@sets, @{$c->{set}});
	}

	if (&lock($session, "header.table")) {
		DA::Session::trans_init($session);
		eval {
			my $where = &_make_where(\@wheres);
			my $set   = &_make_set(\@sets);
			if (ref($c->{uidlst}) eq "ARRAY") {
				my $commit = 0;
				foreach my $h (@{_splice_uidlst([@{$c->{uidlst}}])}) {
					my $sql = "update $table set $set where $where"
					        . " and uid_number in ($h->{in})";
					my $sth = &_prepare($session, $sql);
					my $i   = &_bind_params($sth, $table, \@wheres, $h->{uids}, \@sets);

					$sth->execute();
					$sth->finish;

					$commit += scalar(@{$h->{uids}});
					if ($commit >= $COMMIT_COUNT) {
						$session->{dbh}->commit();
						$commit = 0;
					}
				}
			} else {
				my $sql = "update $table set $set where $where";
				my $sth = &_prepare($session, $sql);
				my $i   = &_bind_params($sth, $table, \@wheres, 0, \@sets);

				$sth->execute();
				$sth->finish;
			}
		};
		if (!DA::Session::exception($session)) {
			&_warn($session, "exception");
			$result = 0;
		}

		&unlock($session, "header.table");
	} else {
		&_warn($session, "lock");
		$result = 0;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub _delete_header($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{host}    : IMAP HOST       （省略可）
	#   ->{user}    : IMAP USER       （省略可）
	#   ->{folder}  : FOLDER NAME     （省略可）
	#   ->{uidval}  : UIDVALIDITY     （省略可）
	#   ->{uidlst}  : UID LIST        （省略可）
	#   ->{where}   : WHERE           （省略可）
	#   ->{mode}    : user or folder  （省略可）
	my $logger  = &_logger_init($session, 1);
	my $mid;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$mid = DA::OrgMail::get_mid4folder($session, $c);
	} else {
		$mid = $c->{mid} || $session->{user};
	}
	my $host    = $c->{host}   || $imaps->{imap}->{host};
	my $user    = $c->{user}   || $imaps->{imap}->{user};
	my $folder  = $c->{folder};
	my $uidval  = $c->{uidval};
	my $table   = &_header_table($mid);
	my $result  = 1;

	my @wheres;
	if ($c->{mode} eq "user") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
	} elsif ($c->{mode} eq "folder_name") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
	} else {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
		if ($uidval eq "") {
			push(@wheres, { "column" => "uidvalidity" });
		} else {
			push(@wheres, { "column" => "uidvalidity", "value" => $uidval });
		}
	}
	if (ref($c->{where}) eq "ARRAY") {
		push(@wheres, @{$c->{where}});
	}

	if (&lock($session, "header.table")) {
		DA::Session::trans_init($session);
		eval {
			my $where = &_make_where(\@wheres);
			if (ref($c->{uidlst}) eq "ARRAY") {
				my $commit = 0;
				foreach my $h (@{_splice_uidlst([@{$c->{uidlst}}])}) {
					my $sql = "delete from $table where $where"
					        . " and uid_number in ($h->{in})";
					my $sth = &_prepare($session, $sql);
					my $i   = &_bind_params($sth, $table, \@wheres, $h->{uids});

					$sth->execute();
					$sth->finish;

					$commit += scalar(@{$h->{uids}});
					if ($commit >= $COMMIT_COUNT) {
						$session->{dbh}->commit();
						$commit = 0;
					}
				}
			} else {
				my $sql = "delete from $table where $where";
				my $sth = &_prepare($session, $sql);
				my $i   = &_bind_params($sth, $table, \@wheres);

				$sth->execute();
				$sth->finish;
			}
		};
		if (!DA::Session::exception($session)) {
			&_warn($session, "exception");
			$result = 0;
		}

		&unlock($session, "header.table");
	} else {
		&_warn($session, "lock");
		$result = 0;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub _insert_folder($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{host}    : IMAP HOST       （省略可）
	#   ->{user}    : IMAP USER       （省略可）
	#   ->{folder}  : FOLDER NAME     （必須）
	#   ->{uidval}  : UIDVALIDITY     （必須）
	#   ->{data}    : INSERT DATA     （必須）
	my $logger  = &_logger_init($session, 1);
	my $mid;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$mid = DA::OrgMail::get_mid4folder($session, $c);
	} else {
		$mid = $c->{mid} || $session->{user};
	}
	my $host    = $c->{host}   || $imaps->{imap}->{host};
	my $user    = $c->{user}   || $imaps->{imap}->{user};
	my $folder  = $c->{folder};
	my $uidval  = $c->{uidval};
	my $data    = $c->{data};
	my $table   = &_folder_table($mid);
	my $result  = 1;
	if($folder eq ""){
		return 0;
	}

	my @items = qw (
		mid imap_host imap_user folder_name uidvalidity
		recent_count exists_count unseen_count
		max_uid_number old_uid_number filter_uid_number
	);
	my $values = "?," x scalar(@items); $values =~ s/\,+$//g;

	if (&lock($session, "folder.table")) {
		DA::Session::trans_init($session);
		eval {
			my $sql	= "insert into $table ("
					. join(",", @items)
					. ") values ("
					. $values
					. ")";
			my $sth	= &_prepare($session, $sql);

			for (my $i = 0; $i < scalar(@items); $i ++) {
				my $num    = $i+1;
				my $column = $items[$i];
				my $type   = &_bind_num($table, $column);
				if ($column eq "mid") {
					&_bind_param($sth, $num, $mid, $type);
				} elsif ($column eq "imap_host") {
					&_bind_param($sth, $num, $host, $type);
				} elsif ($column eq "imap_user") {
					&_bind_param($sth, $num, $user, $type);
				} elsif ($column eq "folder_name") {
					&_bind_param($sth, $num, $folder, $type);
				} elsif ($column eq "uidvalidity") {
					&_bind_param($sth, $num, $uidval, $type);
				} else {
					my $value = $data->{$column} || 0;
					&_bind_param($sth, $num, $value, $type);
				}
			}

			$sth->execute();
			$sth->finish();
		};
		if (!DA::Session::exception($session)) {
			&_warn($session, "exception");
			$result = 0;
		}

		&unlock($session, "folder.table");
	} else {
		&_warn($session, "lock");
		$result = 0;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub _select_folder($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{host}    : IMAP HOST       （省略可）
	#   ->{user}    : IMAP USER       （省略可）
	#   ->{folder}  : FOLDER NAME     （省略可）
	#   ->{uidval}  : UIDVALIDITY     （省略可）
	#   ->{output}  : OUTPUT ITEM     （必須）
	#   ->{where}   : WHERE           （省略可）
	#   ->{mode}    : user or folder  （省略可）
	#   ->{list}    : OUTPUT is list  （省略可）
	#               : 0 = Simple
	#               : 1 = Array
	#               : 2 = Hash
	#   ->{key}     : Hash key        （省略可）
	my $logger  = &_logger_init($session, 1);
	my $mid;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$mid = DA::OrgMail::get_mid4folder($session, $c);
	} else {
		$mid = $c->{mid} || $session->{user};
	}
	my $host    = $c->{host}   || $imaps->{imap}->{host};
	my $user    = $c->{user}   || $imaps->{imap}->{user};
	my $folder  = $c->{folder};
	my $uidval  = $c->{uidval};
	my $table   = &_folder_table($mid);
	my $folders = [];

	my $output;
	if (ref($c->{output}) eq "ARRAY") {
		$output = join(",", @{$c->{output}});
	} else {
		$output = $c->{output};
	}

	my @wheres;
	if ($c->{mode} eq "user") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
	} elsif ($c->{mode} eq "folder_name") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
	} else {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
		if ($uidval eq "") {
			push(@wheres, { "column" => "uidvalidity" });
		} else {
			push(@wheres, { "column" => "uidvalidity", "value" => $uidval });
		}
	}
	if (ref($c->{where}) eq "ARRAY") {
		push(@wheres, @{$c->{where}});
	}
	if (&lock($session, "folder.table")) {
		DA::Session::trans_init($session);
		eval {
			my $where = &_make_where(\@wheres);
			my $sql = "select $output from $table where $where";
			my $sth = &_prepare($session, $sql);
			my $i   = &_bind_params($sth, $table, \@wheres);

			$sth->execute();

			$folders = &_fetchrow($sth, $c->{list}, $c->{key});

			$sth->finish;
		};
		if (!DA::Session::exception($session)) {
			&_warn($session, "exception");
			$folders = undef;
		}

		&unlock($session, "folder.table");
	} else {
		&_warn($session, "lock");
		$folders = undef;
	}

	&_logger($session, $imaps, $logger);
	return($folders);
}

sub _update_folder($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{host}    : IMAP HOST       （省略可）
	#   ->{user}    : IMAP USER       （省略可）
	#   ->{folder}  : FOLDER NAME     （省略可）
	#   ->{uidval}  : UIDVALIDITY     （省略可）
	#   ->{set}     : SET             （必須）
	#   ->{where}   : WHERE           （省略可）
	#   ->{mode}    : user or folder  （省略可）
	my $logger  = &_logger_init($session, 1);
	my $mid;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$mid = DA::OrgMail::get_mid4folder($session, $c);
	} else {
		$mid = $c->{mid} || $session->{user};
	}
	my $host    = $c->{host}   || $imaps->{imap}->{host};
	my $user    = $c->{user}   || $imaps->{imap}->{user};
	my $folder  = $c->{folder};
	my $uidval  = $c->{uidval};
	my $table   = &_folder_table($mid);
	my $result  = 1;

	my (@wheres, @sets);
	if ($c->{mode} eq "user") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
	} elsif ($c->{mode} eq "folder_name") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
	} else {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
		if ($uidval eq "") {
			push(@wheres, { "column" => "uidvalidity" });
		} else {
			push(@wheres, { "column" => "uidvalidity", "value" => $uidval });
		}
	}
	if (ref($c->{where}) eq "ARRAY") {
		push(@wheres, @{$c->{where}});
	}
	if (ref($c->{set}) eq "ARRAY") {
		push(@sets, @{$c->{set}});
	}

	if (&lock($session, "folder.table")) {
		DA::Session::trans_init($session);
		eval {
			my $where = &_make_where(\@wheres);
			my $set   = &_make_set(\@sets);
			my $sql   = "update $table set $set where $where";
			my $sth   = &_prepare($session, $sql);
			my $i     = &_bind_params($sth, $table, \@wheres, 0, \@sets);

			$sth->execute();
			$sth->finish;
		};
		if (!DA::Session::exception($session)) {
			&_warn($session, "exception");
			$result = 0;
		}

		&unlock($session, "folder.table");
	} else {
		&_warn($session, "lock");
		$result = 0;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub _delete_folder($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
    #   ->{host}    : IMAP HOST       （省略可）
	#   ->{user}    : IMAP USER       （省略可）
	#   ->{folder}  : FOLDER NAME     （省略可）
	#   ->{uidval}  : UIDVALIDITY     （省略可）
	#   ->{where}   : WHERE           （省略可）
	#   ->{mode}    : user or folder  （省略可）
	my $logger  = &_logger_init($session, 1);
	my $mid;
	if (DA::OrgMail::check_org_mail_permit($session)) {
		$mid = DA::OrgMail::get_mid4folder($session, $c);
	} else {
		$mid = $c->{mid} || $session->{user};
	}
	my $host    = $c->{host}   || $imaps->{imap}->{host};
	my $user    = $c->{user}   || $imaps->{imap}->{user};
	my $folder  = $c->{folder};
	my $uidval  = $c->{uidval};
	my $table   = &_folder_table($mid);
	my $result  = 1;

	my @wheres;
	if ($c->{mode} eq "user") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
	} elsif ($c->{mode} eq "folder_name") {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
	} else {
		push(@wheres, { "column" => "mid", "value" => $mid });
		push(@wheres, { "column" => "imap_host", "value" => $host });
		push(@wheres, { "column" => "imap_user", "value" => $user });
		push(@wheres, { "column" => "folder_name", "value" => $folder });
		if ($uidval eq "") {
			push(@wheres, { "column" => "uidvalidity" });
		} else {
			push(@wheres, { "column" => "uidvalidity", "value" => $uidval });
		}
	}
	if (ref($c->{where}) eq "ARRAY") {
		push(@wheres, @{$c->{where}});
	}

	if (&lock($session, "folder.table")) {
		DA::Session::trans_init($session);
		eval {
			my $where = &_make_where(\@wheres);
			my $sql   = "delete from $table where $where";
			my $sth   = &_prepare($session, $sql);
			my $i     = &_bind_params($sth, $table, \@wheres);

			$sth->execute();
			$sth->finish;
		};
		if (!DA::Session::exception($session)) {
			&_warn($session, "exception");
			$result = 0;
		}

		&unlock($session, "folder.table");
	} else {
		&_warn($session, "lock");
		$result = 0;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}
## <<---------------------------------------------- DB Method

## Local Method ------------------------------------------->>
sub _make_order_local($$$$$) {
	my ($session, $imaps, $type, $sort_key, $sort) = @_;

	if ($sort_key eq "") {
		$sort_key = "recent";
	}
	if ($sort eq "") {
		$sort = "desc";
	}

	my $sort_tbl = {
		"attachment" => {
			"asec" => "-k @{[$L_LIST_ITEM->{ATTACHMENT}+1]},"
			       .  "@{[$L_LIST_ITEM->{ATTACHMENT}+1]} "
			       .  "-k @{[$L_LIST_ITEM->{UID}+1]},"
			       .  "@{[$L_LIST_ITEM->{UID}+1]}n",
			"desc" => "-k @{[$L_LIST_ITEM->{ATTACHMENT}+1]},"
			       .  "@{[$L_LIST_ITEM->{ATTACHMENT}+1]}r "
			       .  "-k @{[$L_LIST_ITEM->{UID}+1]},"
			       .  "@{[$L_LIST_ITEM->{UID}+1]}nr"
		},
		"from" => {
			"asec" => ($type =~ /^($TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) ?
			          "-k @{[$L_LIST_ITEM->{TO}+1]},"
                   .  "@{[$L_LIST_ITEM->{TO}+1]} "
                   .  "-k @{[$L_LIST_ITEM->{UID}+1]},"
                   .  "@{[$L_LIST_ITEM->{UID}+1]}n"
			       :  "-k @{[$L_LIST_ITEM->{UID}+1]},"
			       .  "@{[$L_LIST_ITEM->{UID}+1]}n",
			"desc" => ($type =~ /^($TYPE_LOCAL_FOLDER|$TYPE_BACKUP_FOLDER)$/) ?
			          "-k @{[$L_LIST_ITEM->{TO}+1]},"
        	       .  "@{[$L_LIST_ITEM->{TO}+1]}r "
        	       .  "-k @{[$L_LIST_ITEM->{UID}+1]},"
        	       .  "@{[$L_LIST_ITEM->{UID}+1]}nr"
		           :  "-k @{[$L_LIST_ITEM->{UID}+1]},"
			       .  "@{[$L_LIST_ITEM->{UID}+1]}nr"
		},
		"date" => {
			"asec" => "-k @{[$L_LIST_ITEM->{DATE}+1]},"
			       .  "@{[$L_LIST_ITEM->{DATE}+1]} "
			       .  "-k @{[$L_LIST_ITEM->{UID}+1]},"
			       .  "@{[$L_LIST_ITEM->{UID}+1]}n",
			"desc" => "-k @{[$L_LIST_ITEM->{DATE}+1]},"
			       .  "@{[$L_LIST_ITEM->{DATE}+1]}r "
			       .  "-k @{[$L_LIST_ITEM->{UID}+1]},"
			       .  "@{[$L_LIST_ITEM->{UID}+1]}nr"
		},
		"subject" => {
			"asec" => "-k @{[$L_LIST_ITEM->{SUBJECT}+1]},"
			       .  "@{[$L_LIST_ITEM->{SUBJECT}+1]} "
			       .  "-k @{[$L_LIST_ITEM->{UID}+1]},"
			       .  "@{[$L_LIST_ITEM->{UID}+1]}n",
			"desc" => "-k @{[$L_LIST_ITEM->{SUBJECT}+1]},"
			       .  "@{[$L_LIST_ITEM->{SUBJECT}+1]}r "
			       .  "-k @{[$L_LIST_ITEM->{UID}+1]},"
			       .  "@{[$L_LIST_ITEM->{UID}+1]}nr"
		},
		"recent" => {
			"asec" => "-k @{[$L_LIST_ITEM->{UID}+1]},"
			       .  "@{[$L_LIST_ITEM->{UID}+1]}n",
			"desc" => "-k @{[$L_LIST_ITEM->{UID}+1]},"
			       .  "@{[$L_LIST_ITEM->{UID}+1]}nr"
		}
	};

	return($sort_tbl->{$sort_key}->{$sort});
}

sub _select_header_local($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{output}  : OUTPUT ITEM     （必須）
	#   ->{order}   : ORDER BY        （省略可）
	#   ->{list}    : OUTPUT is list  （省略可）
	#               : 0 = Simple
	#               : 1 = Array
	#   ->{target}  : sent, backup
	my $logger  = &_logger_init($session, 1);
	my $mid     = $c->{mid}    || $session->{user};
	my $order   = $c->{order}
	           || "-k @{[$L_LIST_ITEM->{UID}+1]},@{[$L_LIST_ITEM->{UID}+1]}n";	
	my $target  = $c->{target} || "sent";
	my $file  ;
	if($target eq 'backup') {
		 $file = &infofile($session, $target);
	}else {
		$file = &infofile({ "user" => $mid }, $target);
	}
    my $headers = [];
	my $output;
	if (ref($c->{output}) eq "ARRAY") {
		$output = join(",", @{$c->{output}});
	} else {
		$output = $c->{output};
	}
	my $current_mail_gid = DA::OrgMail::get_gid($session);
	my $mapping_info_file = "$current_mail_gid".'.maid_mapping.dat';
	$mapping_info_file = &backup_mapping_file($session,$mapping_info_file);
	my $back_mapping_info = &get_infofile($session,$mapping_info_file,'backup_mapping');
	my %back_mapping_info_inverse = reverse %{$back_mapping_info};	
	my $name  = &get_user_name($session, $imaps);
	my $addr  = &get_user_address($session, $imaps);
	my $from  = ($name eq "") ? $addr : $name; 
	if (&lock($session, "header.table.local")) {
		if (open(HIN, "export LANG=C;/bin/sort " . DA::Valid::check_cmdoption($order) . " -t '	' " . DA::Valid::check_path($file) . " 2>/dev/null |")) {
			if (ref($c->{uidlst}) eq "ARRAY") {
				my %uids; @uids{@{$c->{uidlst}}} = undef;
				while (my $line = <HIN>) {
					chomp($line);
					my @line = split(/\t/, $line);
					if (exists $uids{$line[$L_LIST_ITEM->{UID}]}) {
						if ($c->{list}) {
							my $tmp;
							if ($output =~ /(?:^|\,)(uid_number)(?:\,|$)/) {
								$tmp = $line[$L_LIST_ITEM->{UID}];
							} elsif ($output =~ /(?:^|\,)(seen)(?:\,|$)/) {
								$tmp = 1;
							} elsif ($output =~ /(?:^|\,)(flagged)(?:\,|$)/) {
								$tmp = 0;
							} elsif ($output =~ /(?:^|\,)(deleted)(?:\,|$)/) {
								$tmp = 0;
							} elsif ($output =~ /(?:^|\,)(replied)(?:\,|$)/) {
								$tmp = 0;
							} elsif ($output =~ /(?:^|\,)(forwarded)(?:\,|$)/) {
								$tmp = 0;
							} elsif ($output =~ /(?:^|\,)(attachment|attach4ajx)(?:\,|$)/) {
								$tmp = $line[$L_LIST_ITEM->{ATTACHMENT}] || 0;
							} elsif ($output =~ /(?:^|\,)(mail_size)(?:\,|$)/) {
								$tmp = 0;
							} elsif ($output =~ /(?:^|\,)(internal)(?:\,|$)/) {
								$tmp = 0;
							} elsif ($output =~ /(?:^|\,)(from_field)(?:\,|$)/) {
								$tmp = $from;
							} elsif ($output =~ /(?:^|\,)(to_field)(?:\,|$)/) {
								$tmp = $line[$L_LIST_ITEM->{TO}];
							} elsif ($output =~ /(?:^|\,)(date_field)(?:\,|$)/) {
								$tmp = $line[$L_LIST_ITEM->{DATE}];
							} elsif ($output =~ /(?:^|\,)(subject_field)(?:\,|$)/) {
								$tmp = $line[$L_LIST_ITEM->{SUBJECT}];
								if($target eq 'backup') {
									$tmp = &decode_space_backup_subject($session,$tmp);
								}
							} elsif ($output =~ /(?:^|\,)(priority)(?:\,|$)/) {
								$tmp = 3;
							} elsif ($output =~ /(?:^|\,)(to_status)(?:\,|$)/) {
								$tmp = 0;
							}
							if($target eq 'backup') {
								my $backup_maid = $line[$BACKUP_MAID_INDEX];
								if ($backup_maid ) {				
									#$tmp = $backup_maid;
									if(!$back_mapping_info_inverse{$backup_maid}) {
										next;
									}	
								}
							}
							push(@{$headers}, &convert_mailer($tmp));
						} else {
							my %tmp;
														
							if ($output =~ /(?:^|\,)(uid_number)(?:\,|$)/) {
								$tmp{$1} = $line[$L_LIST_ITEM->{UID}];
							}
							#backup mail use backup_maid as uid
							if($target eq 'backup') {
								my $backup_maid = $line[$BACKUP_MAID_INDEX];
								if ($backup_maid ) {				
									if(!$back_mapping_info_inverse{$backup_maid}) {
										next;
									}
									$tmp{uid_number} = $backup_maid;
									$tmp{backup_maid} = $backup_maid;
									$tmp{backup_org_clrRdir} = DA::OrgMail::get_backup_org_clrRdir($session,$backup_maid);
									
								}
							}
							if ($output =~ /(?:^|\,)(seen)(?:\,|$)/) {
								$tmp{$1} = 1;
							}
							if ($output =~ /(?:^|\,)(flagged)(?:\,|$)/) {
								$tmp{$1} = 0;
							}
							if ($output =~ /(?:^|\,)(deleted)(?:\,|$)/) {
								$tmp{$1} = 0;
							}
							if ($output =~ /(?:^|\,)(replied)(?:\,|$)/) {
								$tmp{$1} = 0;
							}
							if ($output =~ /(?:^|\,)(forwarded)(?:\,|$)/) {
								$tmp{$1} = 0;
							}
							if ($output =~ /(?:^|\,)(attachment)(?:\,|$)/) {
								if($target eq 'backup' && !&_richtext2attachment($session, $imaps) && $line[$L_LIST_ITEM->{ATTACHMENT}] eq 2) {
									$tmp{$1} = 0;
								}elsif( $target eq 'backup' && &_richtext2attachment($session, $imaps) && $line[$L_LIST_ITEM->{ATTACHMENT}] eq 2) {
									$tmp{$1} = 1;
								}else {
									$tmp{$1} = $line[$L_LIST_ITEM->{ATTACHMENT}] || 0;
								}
							}
							if ($output =~ /(?:^|\,)(attach4ajx)(?:\,|$)/) {
								if($target eq 'backup' && !&_richtext2attachment($session, $imaps) && $line[$L_LIST_ITEM->{ATTACHMENT}] eq 2) {
									$tmp{$1} = 0;
								}elsif( $target eq 'backup' && &_richtext2attachment($session, $imaps) && $line[$L_LIST_ITEM->{ATTACHMENT}] eq 2) {
									$tmp{$1} = 1;
								}else {
									$tmp{$1} = $line[$L_LIST_ITEM->{ATTACHMENT}] || 0;
								}
							}
							if ($output =~ /(?:^|\,)(mail_size)(?:\,|$)/) {
								$tmp{$1} = 0;
							}
							if ($output =~ /(?:^|\,)(internal)(?:\,|$)/) {
								$tmp{$1} = 0;
							}
							if ($output =~ /(?:^|\,)(from_field)(?:\,|$)/) {
								$tmp{$1} = $from;
							}
							if ($output =~ /(?:^|\,)(to_field)(?:\,|$)/) {
								$tmp{$1} = $line[$L_LIST_ITEM->{TO}];
							}
							if ($output =~ /(?:^|\,)(date_field)(?:\,|$)/) {
								$tmp{$1} = $line[$L_LIST_ITEM->{DATE}];
							}
							if ($output =~ /(?:^|\,)(subject_field)(?:\,|$)/) {
								$tmp{$1} = $line[$L_LIST_ITEM->{SUBJECT}];
								if($target eq 'backup') {
									$tmp{$1} = &decode_space_backup_subject($session,$tmp{$1});
								}
							}						
							if ($output =~ /(?:^|\,)(priority)(?:\,|$)/) {
								if($target eq 'backup') {
									$tmp{$1} = $line[$BACKUP_PRIORITY_INDEX];
								}else {
									$tmp{$1} = 3;
								}
							}
							if ($output =~ /(?:^|\,)(to_status)(?:\,|$)/) {
								$tmp{$1} = 0;
							}

							push(@{$headers}, &convert_mailer(\%tmp));
						}
					} else {
						next;
					}
				}
			} else {
				while (my $line = <HIN>) {
					chomp($line);
					my @line = split(/\t/, $line);
					if ($c->{list}) {
						my $tmp;
						
						if ($output =~ /(?:^|\,)(uid_number)(?:\,|$)/) {
							$tmp = $line[$L_LIST_ITEM->{UID}];
						} elsif ($output =~ /(?:^|\,)(seen)(?:\,|$)/) {
							$tmp = 1;
						} elsif ($output =~ /(?:^|\,)(flagged)(?:\,|$)/) {
							$tmp = 0;
						} elsif ($output =~ /(?:^|\,)(deleted)(?:\,|$)/) {
							$tmp = 0;
						} elsif ($output =~ /(?:^|\,)(replied)(?:\,|$)/) {
							$tmp = 0;
						} elsif ($output =~ /(?:^|\,)(forwarded)(?:\,|$)/) {
							$tmp = 0;
						} elsif ($output =~ /(?:^|\,)(attachment|attach4ajx)(?:\,|$)/) {
							$tmp = $line[$L_LIST_ITEM->{ATTACHMENT}] || 0;
						} elsif ($output =~ /(?:^|\,)(mail_size)(?:\,|$)/) {
							$tmp = 0;
						} elsif ($output =~ /(?:^|\,)(internal)(?:\,|$)/) {
							$tmp = 0;
						} elsif ($output =~ /(?:^|\,)(from_field)(?:\,|$)/) {
							$tmp = $from;
						} elsif ($output =~ /(?:^|\,)(to_field)(?:\,|$)/) {
							$tmp = $line[$L_LIST_ITEM->{TO}];
						} elsif ($output =~ /(?:^|\,)(date_field)(?:\,|$)/) {
							$tmp = $line[$L_LIST_ITEM->{DATE}];
						} elsif ($output =~ /(?:^|\,)(subject_field)(?:\,|$)/) {
							$tmp = $line[$L_LIST_ITEM->{SUBJECT}];
							if($target eq 'backup') {
								$tmp = &decode_space_backup_subject($session,$tmp);
							}
						} elsif ($output =~ /(?:^|\,)(priority)(?:\,|$)/) {
							$tmp = 3;
						} elsif ($output =~ /(?:^|\,)(to_status)(?:\,|$)/) {
							$tmp = 0;
						}

						if($target eq 'backup') {
							my $backup_maid = $line[$BACKUP_MAID_INDEX];
							if ($backup_maid ) {				
								if(!$back_mapping_info_inverse{$backup_maid}) {
									next;
								}	
							}
						}
						push(@{$headers}, &convert_mailer($tmp));
					} else {
						my %tmp;
						
						if ($output =~ /(?:^|\,)(uid_number)(?:\,|$)/) {
							$tmp{$1} = $line[$L_LIST_ITEM->{UID}];
						}
						#backup mail use backup_maid as uid
						if($target eq 'backup') {
							my $backup_maid = $line[$BACKUP_MAID_INDEX];
							if ($backup_maid ) {				
								if(!$back_mapping_info_inverse{$backup_maid}) {
									next;
								}
								$tmp{uid_number} = $backup_maid;
								$tmp{backup_maid} = $backup_maid;
								$tmp{backup_org_clrRdir} = DA::OrgMail::get_backup_org_clrRdir($session,$backup_maid);
							}
						}
						if ($output =~ /(?:^|\,)(seen)(?:\,|$)/) {
							$tmp{$1} = 1;
						}
						if ($output =~ /(?:^|\,)(flagged)(?:\,|$)/) {
							$tmp{$1} = 0;
						}
						if ($output =~ /(?:^|\,)(deleted)(?:\,|$)/) {
							$tmp{$1} = 0;
						}
						if ($output =~ /(?:^|\,)(replied)(?:\,|$)/) {
							$tmp{$1} = 0;
						}
						if ($output =~ /(?:^|\,)(forwarded)(?:\,|$)/) {
							$tmp{$1} = 0;
						}
						if ($output =~ /(?:^|\,)(attachment)(?:\,|$)/) {
							if($target eq 'backup' && !&_richtext2attachment($session, $imaps) && $line[$L_LIST_ITEM->{ATTACHMENT}] eq 2) {
								$tmp{$1} = 0;
							}elsif( $target eq 'backup' && &_richtext2attachment($session, $imaps) && $line[$L_LIST_ITEM->{ATTACHMENT}] eq 2) {
								$tmp{$1} = 1;
							}else {
								$tmp{$1} = $line[$L_LIST_ITEM->{ATTACHMENT}] || 0;
							}
						}
						if ($output =~ /(?:^|\,)(attach4ajx)(?:\,|$)/) {
							if($target eq 'backup' && !&_richtext2attachment($session, $imaps) && $line[$L_LIST_ITEM->{ATTACHMENT}] eq 2) {
								$tmp{$1} = 0;
							}elsif( $target eq 'backup' && &_richtext2attachment($session, $imaps) && $line[$L_LIST_ITEM->{ATTACHMENT}] eq 2) {
								$tmp{$1} = 1;
							}else {
								$tmp{$1} = $line[$L_LIST_ITEM->{ATTACHMENT}] || 0;
							}
						}
						if ($output =~ /(?:^|\,)(mail_size)(?:\,|$)/) {
							$tmp{$1} = 0;
						}
						if ($output =~ /(?:^|\,)(internal)(?:\,|$)/) {
							$tmp{$1} = 0;
						}
						if ($output =~ /(?:^|\,)(from_field)(?:\,|$)/) {
							$tmp{$1} = $from;
						}
						if ($output =~ /(?:^|\,)(to_field)(?:\,|$)/) {
							$tmp{$1} = $line[$L_LIST_ITEM->{TO}];
						}
						if ($output =~ /(?:^|\,)(date_field)(?:\,|$)/) {
							$tmp{$1} = $line[$L_LIST_ITEM->{DATE}];
						}
						if ($output =~ /(?:^|\,)(subject_field)(?:\,|$)/) {
							$tmp{$1} = $line[$L_LIST_ITEM->{SUBJECT}];
							if($target eq 'backup') {
								$tmp{$1} = &decode_space_backup_subject($session,$tmp{$1});
							}
						}
						if ($output =~ /(?:^|\,)(priority)(?:\,|$)/) {
							if($target eq 'backup') {
								$tmp{$1} = $line[$BACKUP_PRIORITY_INDEX];
							}else {
								$tmp{$1} = 3;
							}
						}
						if ($output =~ /(?:^|\,)(to_status)(?:\,|$)/) {
							$tmp{$1} = 0;
						}
						push(@{$headers}, &convert_mailer(\%tmp));
					}
				}
			}

			close(HIN);
		} else {
			&_warn($session, "Can't open file [$file]");
			$headers = undef;
		}

		&unlock($session, "header.table.local");
	} else {
		&_warn($session, "lock");
		$headers = undef;
	}

	&_logger($session, $imaps, $logger);

	return($headers);
}

sub encode_space_backup_subject {
	my ($session,$subject) = @_;
	$subject =~ s/\t/$SPACER/g;
	return $subject;
}

sub decode_space_backup_subject {
	my ($session,$subject) = @_;
	$subject =~ s/\Q$SPACER\E/\t/g;
	return $subject;
}

sub _delete_header_local($$$) {
	my ($session, $imaps, $c) = @_;
		
	# $c->{mid}     : MID             （省略可）
	# $c->{uidlst}  : UID LIST        （省略可）
	# $c->{mode}    : all or sno      （省略可）
	# $c->{target}  : sent, backup
	my $logger = &_logger_init($session, 1);
	my $mid    = $c->{mid} || $session->{user};
	my $target = $c->{target} || "sent";
	my $base   ;
	my $current_mail_gid = DA::OrgMail::get_gid($session);
	my $mapping_info_file = "$current_mail_gid".'.maid_mapping.dat';
	$mapping_info_file = &backup_mapping_file($session,$mapping_info_file);
	my $back_mapping_info = &get_infofile($session,$mapping_info_file,'backup_mapping');
	my %back_mapping_info_inverse = reverse %{$back_mapping_info};

	my $file  ;
	if($target eq 'backup') {
		 $file = &infofile($session, $target);
		 $base = "$DA::Vars::p->{mailer_dir}/$session->{user}";
	}else {
		$file = &infofile({ "user" => $mid }, $target);
		$base = DA::Mailer::get_mailer_dir($session,$mid);
	}
	my $result = 1;
	my $session_mid = $session->{user};
	if (&lock($session, "header.table.local")) {
		my $buf;
		if (my $fh = &open_file($session, $file, "r")) {
			if (ref($c->{uidlst}) eq "ARRAY") {
				my %uids; @uids{@{$c->{uidlst}}} = undef;

				while (my $l = <$fh>) {
					chomp($l);
					my ($num, $attach, $to, $date, $subject, $backup_maid);
					if($target eq 'backup') {
						($num, $attach, $to, $date, $subject, $backup_maid) = split(/\t/, $l);
						#backup use backup_maid as num
						$num = $backup_maid;
						if(!$back_mapping_info_inverse{$num}) {
							$buf .= $l . "\n";
							next;
						}
						
					}else {
						($num, $attach, $to, $date, $subject ) = split(/\t/, $l);
					}
				
					if (exists $uids{$num}) {
							my ($mes, $att);
							if ($target eq "sent") {
								$mes = "$base/$target/$num\.";
								$att = "$base/attach/s$num\-";
								DA::System::file_unlink(<$mes*>); 
								DA::System::file_unlink(<$att*>);
							} elsif($target eq 'backup' && -d "$base/$target/$num") {
								DA::System::filepath_rmtree("$base/$target/$num");
								unless($c->{proc} eq 'backup') {
									my $back_org = "$base/$target/org_info/$num\.";
									DA::System::file_unlink(<$back_org*>);
								}
							}
							
						
					} else {
						$buf .= $l . "\n";
					}
				}
			} else {
				if ($c->{mode} eq "all") {
					while (my $l = <$fh>) {
						chomp($l);
						my ($num, $attach, $to, $date, $subject, $backup_maid);
						if($target eq 'backup') {
							($num, $attach, $to, $date, $subject, $backup_maid) = split(/\t/, $l);
							#backup use backup_maid as num
							$num = $backup_maid;
							if(!$back_mapping_info_inverse{$num}) {
								$buf .= $l . "\n";
								next;
							}
						}else {
							($num, $attach, $to, $date, $subject ) = split(/\t/, $l);
						}
						my ($mes, $att);
						if ($target eq "sent") {
							$mes = "$base/$target/$num\.";
							$att = "$base/attach/s$num\-";
							DA::System::file_unlink(<$mes*>); 
							DA::System::file_unlink(<$att*>);
						}elsif($target eq 'backup' && -d "$base/$target/$num") {
							DA::System::filepath_rmtree("$base/$target/$num");
							my $back_org = "$base/$target/org_info/$num\.";
							DA::System::file_unlink(<$back_org*>);
						}
						
						
					}
				}
			}
			&close_file($session, $file, $fh);
		} else {
			&_warn($session, "open_file");
			$result = 0;
		}

		if ($result) {
			unless (&write_file_buf($session, $file, $buf)) {
				&_warn($session, "write_file");
				$result = 0;
			}
		}
		$result = 1;
		my $buf_mapping;
		if($target eq 'backup') {
			if (my $fh = &open_file($session, $mapping_info_file, "r")) {
			if (ref($c->{uidlst}) eq "ARRAY") {
				my %uids; @uids{@{$c->{uidlst}}} = undef;

				while (my $l = <$fh>) {
					chomp($l);
					my ($maid,$back_maid) = split(/=/, $l);
					unless (exists $uids{$back_maid}) {
						$buf_mapping .= $l . "\n";	
					} 
				}
			} 
			&close_file($session, $mapping_info_file, $fh);
		} else {
			&_warn($session, "open_file");
			$result = 0;
		}

		if ($result) {
			unless (&write_file_buf($session, $mapping_info_file, $buf_mapping)) {
				&_warn($session, "write_file");
				$result = 0;
			}
		}
			

		}

		&unlock($session, "header.table.local");
	} else {
		&_warn($session, "lock");
		$result = 0;
	}
	&_logger($session, $imaps, $logger);
	return($result);
}
## <<------------------------------------------- Local Method

## Search Method ------------------------------------------>>
sub _make_order_search($$$$$) {
	my ($session, $imaps, $type, $sort_key, $sort) = @_;

	if ($sort_key eq "") {
		$sort_key = "recent";
	}
	if ($sort eq "") {
		$sort = "desc";
	}

	my $sort_tbl = {
		"priority" => {
			"asec" => {
				"key" => "priority", "numeric" => 1, "asec" => 1, "reverse" => 1
			},
			"desc" => {
				"key" => "priority", "numeric" => 1, "desc" => 1, "reverse" => 1
			}
		},
		"seen" => {
			"asec" => {
				"key" => "seen", "numeric" => 1, "asec" => 1, "reverse" => 1
			},
			"desc" => {
				"key" => "seen", "numeric" => 1, "desc" => 1, "reverse" => 1
			}
		},
		"flagged" => {
			"asec" => {
				"key" => "flagged", "numeric" => 1, "asec" => 1 
			},
			"desc" => {
				"key" => "flagged", "numeric" => 1, "desc" => 1
			}
		},
		"attachment" => {
			"asec" => {
				"key" => "attach4ajx", "numeric" => 1, "asec" => 1
			},
			"desc" => {
				"key" => "attach4ajx", "numeric" => 1, "desc" => 1
			}
		},
		"size" => {
			"asec" => {
				"key" => "mail_size", "numeric" => 1, "asec" => 1
			},
			"desc" => {
				"key" => "mail_size", "numeric" => 1, "desc" => 1
			}
		},
		"to" => {
			"asec" => {
				"key" => "to_field", "asec" => 1
			},
			"desc" => {
				"key" => "to_field", "desc" => 1
			}
		},
		"from" => {
			"asec" => {
				"key" => "from_field", "asec" => 1
			},
			"desc" => {
				"key" => "from_field", "desc" => 1
			}
		},
		"date" => {
			"asec" => {
				"key" => "date_field", "asec" => 1
			},
			"desc" => {
				"key" => "date_field", "desc" => 1
			}
		},
		"subject" => {
			"asec" => {
				"key" => "subject_field", "asec" => 1
			},
			"desc" => {
				"key" => "subject_field", "desc" => 1
			}
		},
		"recent" => {
			"asec" => {
				"key" => "internal", "asec" => 1
			},
			"desc" => {
				"key" => "internal", "desc" => 1
			}
		}
	};

	return($sort_tbl->{$sort_key}->{$sort});
}

sub _select_header_search($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{output}  : OUTPUT ITEM     （必須）
	#   ->{order}   : ORDER BY        （省略可）
	#   ->{list}    : OUTPUT is list  （省略可）
	#               : 0 = Simple
	#               : 1 = Array
	#   ->{srid}    : Search ID       （必須）
	my $logger  = &_logger_init($session, 1);
	my $mid     = $c->{mid}    || $session->{user};
	my $order   = $c->{order}  || { "key" => "internal", "asec" => 1 };
	my $srid    = $c->{srid};
	my $headers = [];

	my @output;
	if (ref($c->{output}) eq "ARRAY") {
		@output = @{$c->{output}};
	} else {
		@output = split(/\,/, $c->{output});
	}

	if (&lock($session, "header.table.search")) {
		my $hbuf = {};
		if (my $flags = &open_dbm($session, "search.flags.$srid")) {
			if (my $infos = &open_dbm($session, "search.infos.$srid")) {
				while (my ($key, $value) = each %{$flags}) {
					my $lf = &read_dbm_line($flags, $key, \@SEARCH_FLAGS_ITEMS);
					my $li = &read_dbm_line($infos, $key, \@SEARCH_INFOS_ITEMS);

					foreach my $i (@SEARCH_FLAGS_ITEMS) {
						$hbuf->{$key}->{$i} = $lf->{$i};
					}
					foreach my $i (@SEARCH_INFOS_ITEMS) {
						$hbuf->{$key}->{$i} = $li->{$i};
					}
				}
				&close_dbm($session, "search.infos.$srid", $infos);
			} else {
				&_warn($session, "open_dbm");
				$headers = undef;
			}
			&close_dbm($session, "search.flags.$srid", $flags);
		} else {
			&_warn($session, "open_dbm");
			$headers = undef;
		}

		if ($headers) {
			my @sortkeys;
			if ($order->{asec}) {
				if ($order->{numeric}) {
					if ($order->{reverse}) {
						@sortkeys = sort {
						   $hbuf->{$b}->{$order->{key}} <=> $hbuf->{$a}->{$order->{key}}
						|| $hbuf->{$a}->{internal} cmp $hbuf->{$b}->{internal}
						|| $hbuf->{$a}->{uid_number} <=> $hbuf->{$b}->{uid_number}
						} keys %{$hbuf};
					} else {
						@sortkeys = sort {
						   $hbuf->{$a}->{$order->{key}} <=> $hbuf->{$b}->{$order->{key}}
						|| $hbuf->{$a}->{internal} cmp $hbuf->{$b}->{internal}
						|| $hbuf->{$a}->{uid_number} <=> $hbuf->{$b}->{uid_number}
						} keys %{$hbuf};
					}
				} else {
					if ($order->{reverse}) {
						@sortkeys = sort {
						   $hbuf->{$b}->{$order->{key}} cmp $hbuf->{$a}->{$order->{key}}
						|| $hbuf->{$a}->{internal} cmp $hbuf->{$b}->{internal}
						|| $hbuf->{$a}->{uid_number} <=> $hbuf->{$b}->{uid_number}
						} keys %{$hbuf};
					} else {
						@sortkeys = sort {
						   $hbuf->{$a}->{$order->{key}} cmp $hbuf->{$b}->{$order->{key}}
						|| $hbuf->{$a}->{internal} cmp $hbuf->{$b}->{internal}
						|| $hbuf->{$a}->{uid_number} <=> $hbuf->{$b}->{uid_number}
						} keys %{$hbuf};
					}
				}
			} else {
				if ($order->{numeric}) {
					if ($order->{reverse}) {
						@sortkeys = sort {
						   $hbuf->{$a}->{$order->{key}} <=> $hbuf->{$b}->{$order->{key}}
						|| $hbuf->{$b}->{internal} cmp $hbuf->{$a}->{internal}
						|| $hbuf->{$b}->{uid_number} <=> $hbuf->{$a}->{uid_number}
						} keys %{$hbuf};
					} else {
						@sortkeys = sort {
						   $hbuf->{$b}->{$order->{key}} <=> $hbuf->{$a}->{$order->{key}}
						|| $hbuf->{$b}->{internal} cmp $hbuf->{$a}->{internal}
						|| $hbuf->{$b}->{uid_number} <=> $hbuf->{$a}->{uid_number}
						} keys %{$hbuf};
					}
				} else {
					if ($order->{reverse}) {
						@sortkeys = sort {
						   $hbuf->{$a}->{$order->{key}} cmp $hbuf->{$b}->{$order->{key}}
						|| $hbuf->{$b}->{internal} cmp $hbuf->{$a}->{internal}
						|| $hbuf->{$b}->{uid_number} <=> $hbuf->{$a}->{uid_number}
						} keys %{$hbuf};
					} else {
						@sortkeys = sort {
						   $hbuf->{$b}->{$order->{key}} cmp $hbuf->{$a}->{$order->{key}}
						|| $hbuf->{$b}->{internal} cmp $hbuf->{$a}->{internal}
						|| $hbuf->{$b}->{uid_number} <=> $hbuf->{$a}->{uid_number}
						} keys %{$hbuf};
					}
				}
			}

			if (ref($c->{uidlst}) eq "ARRAY") {
				my %uids; @uids{@{$c->{uidlst}}} = undef;
				foreach my $key (@sortkeys) {
					if (exists $uids{$key}) {
						if ($c->{list}) {
							foreach my $o (@output) {
								push(@{$headers}, $hbuf->{$key}->{$o}); last;
							}
						} else {
							my %tmp;
							foreach my $o (@output) {
								$tmp{$o} = $hbuf->{$key}->{$o};
							}
							push(@{$headers}, \%tmp);
						}
					} else {
						next;
					}
				}
			} else {
				foreach my $key (@sortkeys) {
					if ($c->{list}) {
						foreach my $o (@output) {
							push(@{$headers}, $hbuf->{$key}->{$o}); last;
						}
					} else {
						my %tmp;
						foreach my $o (@output) {
							$tmp{$o} = $hbuf->{$key}->{$o};
						}
						push(@{$headers}, \%tmp);
					}
				}
			}
		}

		&unlock($session, "header.table.search");
	} else {
		&_warn($session, "lock");
		$headers = undef;
	}

	&_logger($session, $imaps, $logger);

	return($headers);
}

sub _update_header_search($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{srid}    : Search ID       （必須）
	#   ->{uidlst}  : UID LIST        （省略可）
	#   ->{set}     : SET             （省略可）
	#   ->{where}   : WHERE           （省略可）
	my $logger = &_logger_init($session, 1);
	my $mid    = $c->{mid} || $session->{user};
	my $srid   = $c->{srid};
	my $result = 1;

	my (%uids, @wheres, @sets);
	if (ref($c->{uidlst}) eq "ARRAY") {
		@uids{@{$c->{uidlst}}} = undef;
	} else {
		@uids{split(/\,/, $c->{uidlst})} = undef;
	}
	if (ref($c->{where}) eq "ARRAY") {
		push(@wheres, @{$c->{where}});
	}
	if (ref($c->{set}) eq "ARRAY") {
		push(@sets, @{$c->{set}});
	}

	if (&lock($session, "header.table.search")) {
		if (my $flags = &open_dbm($session, "search.flags.$srid")) {
			if (my $infos = &open_dbm($session, "search.infos.$srid")) {
				while (my ($key, $value) = each %{$flags}) {
					my $lf = &read_dbm_line($flags, $key, \@SEARCH_FLAGS_ITEMS);
					my $update = 1;
					if ($c->{uidlst}) {
						unless (exists $uids{$key}) {
							$update = 0;
						}
					}
					if ($c->{where}) {
						foreach my $w (@wheres) {
							if ($lf->{$w->{column}} eq $w->{value}) {
								next;
							} else {
								$update = 0; last;
							}
						}
					}

					if ($update) {
						foreach my $s (@sets) {
							$lf->{$s->{column}} = $s->{value};
						}
						&write_dbm_line($flags, $key, $lf, \@SEARCH_FLAGS_ITEMS);
					}
				}
				unless (&close_dbm($session, "search.infos.$srid", $infos)) {
					&_warn($session, "close_dbm");
					$result = 0;
				}
			} else {
				&_warn($session, "open_dbm");
				$result = 0;
			}
			unless (&close_dbm($session, "search.flags.$srid", $flags)) {
				&_warn($session, "close_dbm");
				$result = 0;
			}
		} else {
			&_warn($session, "open_dbm");
			$result = 0;
		}

		&unlock($session, "header.table.search");
	} else {
		&_warn($session, "lock");
		$result = 0;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}

sub _delete_header_search($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{srid}    : Search ID       （必須）
	#   ->{uidlst}  : UID LIST        （省略可）
	#   ->{where}   : WHERE           （省略可）
	my $logger = &_logger_init($session, 1);
	my $mid    = $c->{mid} || $session->{user};
	my $srid   = $c->{srid};
	my $result = 1;

	my %uids;
	if (ref($c->{uidlst}) eq "ARRAY") {
		@uids{@{$c->{uidlst}}} = undef;
	} else {
		@uids{split(/\,/, $c->{uidlst})} = undef;
	}

	my @wheres;
	if (ref($c->{where}) eq "ARRAY") {
		push(@wheres, @{$c->{where}});
	}

	if (&lock($session, "header.table.search")) {
		if (my $flags = &open_dbm($session, "search.flags.$srid")) {
			if (my $infos = &open_dbm($session, "search.infos.$srid")) {
				while (my ($key, $value) = each %{$flags}) {
					my $delete = 1;
					if ($c->{uidlst}) {
						unless (exists $uids{$key}) {
							$delete = 0;
						}
					}
					if ($c->{where}) {
						my $lf = &read_dbm_line($flags, $key, \@SEARCH_FLAGS_ITEMS);
						foreach my $w (@wheres) {
							if ($lf->{$w->{column}} eq $w->{value}) {
								next;
							} else {
								$delete = 0; last;
							}
						}
					}
					if ($delete) {
						delete $flags->{$key};
						delete $infos->{$key};
					}
				}
				unless (&close_dbm($session, "search.infos.$srid", $infos)) {
					&_warn($session, "close_dbm");
					$result = 0;
				}
			} else {
				&_warn($session, "open_dbm");
				$result = 0;
			}
			unless (&close_dbm($session, "search.flags.$srid", $flags)) {
				&_warn($session, "close_dbm");
				$result = 0;
			}
		} else {
			&_warn($session, "open_dbm");
			$result = 0;
		}

		&unlock($session, "header.table.search");
	} else {
		&_warn($session, "lock");
		$result = 0;
	}

	&_logger($session, $imaps, $logger);

	return($result);
}
## <<------------------------------------------ Search Method

## Portal Method ------------------------------------------>>
sub _make_order_portal($$$$$) {
	my ($session, $imaps, $type, $sort_key, $sort) = @_;

	if ($sort_key eq "") {
		$sort_key = "recent";
	}
	if ($sort eq "") {
		$sort = "desc";
	}

	my $sort_tbl = {
		"attachment" => {
			"asec" => "-k @{[$P_LIST_ITEM->{ATTACH4AJX}+1]},"
			       .  "@{[$P_LIST_ITEM->{ATTACH4AJX}+1]} "
			       .  "-k @{[$P_LIST_ITEM->{SNO}+1]},"
			       .  "@{[$P_LIST_ITEM->{SNO}+1]}n",
			"desc" => "-k @{[$P_LIST_ITEM->{ATTACH4AJX}+1]},"
			       .  "@{[$P_LIST_ITEM->{ATTACH4AJX}+1]}r "
			       .  "-k @{[$P_LIST_ITEM->{SNO}+1]},"
			       .  "@{[$P_LIST_ITEM->{SNO}+1]}nr"
		},
		"from" => {
			"asec" => "-k @{[$P_LIST_ITEM->{FROM}+1]},"
                   .  "@{[$P_LIST_ITEM->{FROM}+1]} "
                   .  "-k @{[$P_LIST_ITEM->{SNO}+1]},"
                   .  "@{[$P_LIST_ITEM->{SNO}+1]}n",
			"desc" => "-k @{[$P_LIST_ITEM->{FROM}+1]},"
        	       .  "@{[$P_LIST_ITEM->{FROM}+1]}r "
        	       .  "-k @{[$P_LIST_ITEM->{SNO}+1]},"
        	       .  "@{[$P_LIST_ITEM->{SNO}+1]}nr"
		},
		"date" => {
			"asec" => "-k @{[$P_LIST_ITEM->{DATE}+1]},"
			       .  "@{[$P_LIST_ITEM->{DATE}+1]} "
			       .  "-k @{[$P_LIST_ITEM->{SNO}+1]},"
			       .  "@{[$P_LIST_ITEM->{SNO}+1]}n",
			"desc" => "-k @{[$P_LIST_ITEM->{DATE}+1]},"
			       .  "@{[$P_LIST_ITEM->{DATE}+1]}r "
			       .  "-k @{[$P_LIST_ITEM->{SNO}+1]},"
			       .  "@{[$P_LIST_ITEM->{SNO}+1]}nr"
		},
		"subject" => {
			"asec" => "-k @{[$P_LIST_ITEM->{SUBJECT}+1]},"
			       .  "@{[$P_LIST_ITEM->{SUBJECT}+1]} "
			       .  "-k @{[$P_LIST_ITEM->{SNO}+1]},"
			       .  "@{[$P_LIST_ITEM->{SNO}+1]}n",
			"desc" => "-k @{[$P_LIST_ITEM->{SUBJECT}+1]},"
			       .  "@{[$P_LIST_ITEM->{SUBJECT}+1]}r "
			       .  "-k @{[$P_LIST_ITEM->{SNO}+1]},"
			       .  "@{[$P_LIST_ITEM->{SNO}+1]}nr"
		},
		"recent" => {
			"asec" => "-k @{[$P_LIST_ITEM->{SNO}+1]},"
			       .  "@{[$P_LIST_ITEM->{SNO}+1]}nr",
			"desc" => "-k @{[$P_LIST_ITEM->{SNO}+1]},"
			       .  "@{[$P_LIST_ITEM->{SNO}+1]}n"
		}
	};

	return($sort_tbl->{$sort_key}->{$sort});
}

sub _select_header_portal($$$) {
	my ($session, $imaps, $c) = @_;
	# $c->{mid}     : MID             （省略可）
	#   ->{output}  : OUTPUT ITEM     （必須）
	#   ->{order}   : ORDER BY        （省略可）
	#   ->{list}    : OUTPUT is list  （省略可）
	#               : 0 = Simple
	#               : 1 = Array
	my $logger  = &_logger_init($session, 1);
	my $mid     = $c->{mid}    || $session->{user};
	my $order   = $c->{order}
	           || "-k @{[$P_LIST_ITEM->{SNO}+1]},@{[$P_LIST_ITEM->{SNO}+1]}n";
	my $file    = &portalfile($session);
	my $headers = [];

	my $output;
	if (ref($c->{output}) eq "ARRAY") {
		$output = join(",", @{$c->{output}});
	} else {
		$output = $c->{output};
	}

	my $is_target = sub {
		my ($l) = @_;

		if (ref($c->{where}) eq "ARRAY") {
			foreach my $w (@{$c->{where}}) {
				my $column = $w->{column};
				my $value  = $w->{value};
				if ($column =~ /^(seen|to_status|flagged)$/) {
					if ($l->[$P_LIST_ITEM->{uc($column)}] ne $value) {
						return(0);
					}
				}
			}
		}

		return(1);
	};

	if (&lock($session, "header.table.portal")) {
		if (open(HIN, "export LANG=C;/bin/sort " . DA::Valid::check_cmdoption($order) . " -t '	' " . DA::Valid::check_path($file) . " 2>/dev/null |")) {
			if (ref($c->{snolst}) eq "ARRAY") {
				my %snos; @snos{@{$c->{snolst}}} = undef;
				while (my $line = <HIN>) {
					chomp($line);
					my @line = split(/\t/, $line);
					unless ($is_target->(\@line)) {
						next;
					}
					if (exists $snos{$line[$P_LIST_ITEM->{SNO}]}) {
						if ($c->{list}) {
							my $tmp;
							if ($output =~ /(?:^|\,)(sno)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{SNO}];
							} elsif ($output =~ /(?:^|\,)(uid_number)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{UID}];
							} elsif ($output =~ /(?:^|\,)(seen)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{SEEN}];
							} elsif ($output =~ /(?:^|\,)(flagged)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{FLAGGED}];
							} elsif ($output =~ /(?:^|\,)(deleted)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{DELETED}];
							} elsif ($output =~ /(?:^|\,)(replied)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{REPLIED}];
							} elsif ($output =~ /(?:^|\,)(forwarded)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{FORWARDED}];
							} elsif ($output =~ /(?:^|\,)(attachment)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{ATTACHMENT}] || 0;
							} elsif ($output =~ /(?:^|\,)(attach4ajx)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{ATTACH4AJX}] || 0;
							} elsif ($output =~ /(?:^|\,)(mail_size)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{SIZE}];
							} elsif ($output =~ /(?:^|\,)(internal)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{INTERNAL}];
							} elsif ($output =~ /(?:^|\,)(from_field)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{FROM}];
							} elsif ($output =~ /(?:^|\,)(to_field)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{TO}];
							} elsif ($output =~ /(?:^|\,)(date_field)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{DATE}];
							} elsif ($output =~ /(?:^|\,)(subject_field)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{SUBJECT}];
							} elsif ($output =~ /(?:^|\,)(priority)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{PRIORITY}];
							} elsif ($output =~ /(?:^|\,)(to_status)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{TO_STATUS}];
							} elsif ($output =~ /(?:^|\,)(target)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{TARGET}];
							} elsif ($output =~ /(?:^|\,)(folder_name)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{FOLDER_NAME}];
							} elsif ($output =~ /(?:^|\,)(from_ext)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{FROM_EXT}];
							} elsif ($output =~ /(?:^|\,)(to_ext)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{TO_EXT}];
							} elsif ($output =~ /(?:^|\,)(subject_ext)(?:\,|$)/) {
								$tmp = $line[$P_LIST_ITEM->{SUBJECT_EXT}];
							}
							push(@{$headers}, &convert_mailer($tmp));
						} else {
							my %tmp;
							if ($output =~ /(?:^|\,)(sno)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{SNO}];
							}
							if ($output =~ /(?:^|\,)(uid_number)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{UID}];
							}
							if ($output =~ /(?:^|\,)(seen)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{SEEN}];
							}
							if ($output =~ /(?:^|\,)(flagged)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{FLAGGED}];
							}
							if ($output =~ /(?:^|\,)(deleted)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{DELETED}];
							}
							if ($output =~ /(?:^|\,)(replied)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{REPLIED}];
							}
							if ($output =~ /(?:^|\,)(forwarded)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{FORWARDED}];
							}
							if ($output =~ /(?:^|\,)(attachment)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{ATTACHMENT}] || 0;
							}
							if ($output =~ /(?:^|\,)(attach4ajx)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{ATTACH4AJX}] || 0;
							}
							if ($output =~ /(?:^|\,)(mail_size)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{SIZE}];
							}
							if ($output =~ /(?:^|\,)(internal)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{INTERNAL}];
							}
							if ($output =~ /(?:^|\,)(from_field)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{FROM}];
							}
							if ($output =~ /(?:^|\,)(to_field)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{TO}];
							}
							if ($output =~ /(?:^|\,)(date_field)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{DATE}];
							}
							if ($output =~ /(?:^|\,)(subject_field)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{SUBJECT}];
							}
							if ($output =~ /(?:^|\,)(priority)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{PRIORITY}];
							}
							if ($output =~ /(?:^|\,)(to_status)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{TO_STATUS}];
							}
							if ($output =~ /(?:^|\,)(target)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{TARGET}];
							}
							if ($output =~ /(?:^|\,)(folder_name)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{FOLDER_NAME}];
							}
							if ($output =~ /(?:^|\,)(from_ext)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{FROM_EXT}];
							}
							if ($output =~ /(?:^|\,)(to_ext)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{TO_EXT}];
							}
							if ($output =~ /(?:^|\,)(subject_ext)(?:\,|$)/) {
								$tmp{$1} = $line[$P_LIST_ITEM->{SUBJECT_EXT}];
							}
							push(@{$headers}, &convert_mailer(\%tmp));
						}
					} else {
						next;
					}
				}
			} else {
				while (my $line = <HIN>) {
					chomp($line);
					my @line = split(/\t/, $line);
					unless ($is_target->(\@line)) {
						next;
					}
					if ($c->{list}) {
						my $tmp;
						if ($output =~ /(?:^|\,)(sno)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{SNO}];
						} elsif ($output =~ /(?:^|\,)(uid_number)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{UID}];
						} elsif ($output =~ /(?:^|\,)(seen)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{SEEN}];
						} elsif ($output =~ /(?:^|\,)(flagged)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{FLAGGED}];
						} elsif ($output =~ /(?:^|\,)(deleted)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{DELETED}];
						} elsif ($output =~ /(?:^|\,)(replied)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{REPLIED}];
						} elsif ($output =~ /(?:^|\,)(forwarded)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{FORWARDED}];
						} elsif ($output =~ /(?:^|\,)(attachment)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{ATTACHMENT}] || 0;
						} elsif ($output =~ /(?:^|\,)(attach4ajx)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{ATTACH4AJX}] || 0;
						} elsif ($output =~ /(?:^|\,)(mail_size)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{SIZE}];
						} elsif ($output =~ /(?:^|\,)(internal)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{INTERNAL}];
						} elsif ($output =~ /(?:^|\,)(from_field)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{FROM}];
						} elsif ($output =~ /(?:^|\,)(to_field)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{TO}];
						} elsif ($output =~ /(?:^|\,)(date_field)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{DATE}];
						} elsif ($output =~ /(?:^|\,)(subject_field)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{SUBJECT}];
						} elsif ($output =~ /(?:^|\,)(priority)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{PRIORITY}];
						} elsif ($output =~ /(?:^|\,)(to_status)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{TO_STATUS}];
						} elsif ($output =~ /(?:^|\,)(target)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{TARGET}];
						} elsif ($output =~ /(?:^|\,)(folder_name)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{FOLDER_NAME}];
						} elsif ($output =~ /(?:^|\,)(from_ext)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{FROM_EXT}];
						} elsif ($output =~ /(?:^|\,)(to_ext)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{TO_EXT}];
						} elsif ($output =~ /(?:^|\,)(subject_ext)(?:\,|$)/) {
							$tmp = $line[$P_LIST_ITEM->{SUBJECT_EXT}];
						}
						push(@{$headers}, &convert_mailer($tmp));
					} else {
						my %tmp;
						if ($output =~ /(?:^|\,)(sno)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{SNO}];
						}
						if ($output =~ /(?:^|\,)(uid_number)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{UID}];
						}
						if ($output =~ /(?:^|\,)(seen)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{SEEN}];
						}
						if ($output =~ /(?:^|\,)(flagged)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{FLAGGED}];
						}
						if ($output =~ /(?:^|\,)(deleted)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{DELETED}];
						}
						if ($output =~ /(?:^|\,)(replied)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{REPLIED}];
						}
						if ($output =~ /(?:^|\,)(forwarded)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{FORWARDED}];
						}
						if ($output =~ /(?:^|\,)(attachment)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{ATTACHMENT}] || 0;
						}
						if ($output =~ /(?:^|\,)(attach4ajx)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{ATTACHMENT}] || 0;
						}
						if ($output =~ /(?:^|\,)(mail_size)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{SIZE}];
						}
						if ($output =~ /(?:^|\,)(internal)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{INTERNAL}];
						}
						if ($output =~ /(?:^|\,)(from_field)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{FROM}];
						}
						if ($output =~ /(?:^|\,)(to_field)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{TO}];
						}
						if ($output =~ /(?:^|\,)(date_field)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{DATE}];
						}
						if ($output =~ /(?:^|\,)(subject_field)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{SUBJECT}];
						}
						if ($output =~ /(?:^|\,)(priority)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{PRIORITY}];
						}
						if ($output =~ /(?:^|\,)(to_status)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{TO_STATUS}];
						}
						if ($output =~ /(?:^|\,)(target)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{TARGET}];
						}
						if ($output =~ /(?:^|\,)(folder_name)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{FOLDER_NAME}];
						}
						if ($output =~ /(?:^|\,)(from_ext)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{FROM_EXT}];
						}
						if ($output =~ /(?:^|\,)(to_ext)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{TO_EXT}];
						}
						if ($output =~ /(?:^|\,)(subject_ext)(?:\,|$)/) {
							$tmp{$1} = $line[$P_LIST_ITEM->{SUBJECT_EXT}];
						}
						push(@{$headers}, &convert_mailer(\%tmp));
					}
				}
			}

			close(HIN);
		} else {
			&_warn($session, "Can't open file [$file]");
			$headers = undef;
		}

		&unlock($session, "header.table.portal");
	} else {
		&_warn($session, "lock");
		$headers = undef;
	}

	&_logger($session, $imaps, $logger);

	return($headers);
}
## <<------------------------------------------ Portal Method

#--------------------------------------------------------------------
# host, user が変更されたか否かの情報を取得
sub get_sv_change_dat {
    my ($session, $target) = @_;

    # 変更記録ファイル
    my $filename = "ma_sv_change_". $target .".dat";
    my $file = "$DA::Vars::p->{custom_dir}/check/$filename";
    my $dat={};

    if (-e $file) {
        # データ取得
        if (!DA::Session::lock($filename)) {
            &_warn($session, "lock");
            return 0;
        }
        $dat = Storable::retrieve($file);

        if (!DA::Session::unlock($filename)) {
            &_warn($session, "unlock");
            return 0;
        }
    }
    return $dat;
}

sub put_sv_change_dat {
    my ($session, $mid, $old, $new) = @_;

    # old=new だったら記録しない
    if ($old->{host} eq $new->{host} &&
        $old->{user} eq $new->{user}) {
        return 1;
    }

    #------------------------
    # 変更記録ファイル
    my $target = substr($mid, -1, 1);
    my $filename = "ma_sv_change_". $target .".dat";
    my $file = "$DA::Vars::p->{custom_dir}/check/$filename";

    # ロック
    if (!DA::Session::lock($filename)) {
        &_warn($session, "lock");
        return 0;
    }

    # 記録
    my $dat = {};
    if (-e $file) {
        $dat = Storable::retrieve($file);
    }
    my $unit={};
    $unit->{old_host} = $old->{host};
    $unit->{old_user} = $old->{user};
    $unit->{host}     = $new->{host};
    $unit->{user}     = $new->{user};
    %{$dat->{$mid}} = %{$unit};

    my $result=1;
    my $ret = Storable::store($dat, $file);
    if (!$ret) {
        &_warn($session, "store");
        $result=0;
    }

    # ロック解除
    if (!DA::Session::unlock($filename)) {
        &_warn($session, "unlock");
        $result=0;
    }
    return $result;
}

#--------------------------------------------------------------------
sub del_sv_change_dat {
    my ($session, $target, $done_dat) = @_;

    # 変更記録ファイル
    my $filename = "ma_sv_change_". $target .".dat";
    my $file = "$DA::Vars::p->{custom_dir}/check/$filename";
    if (!-e $file) {
        return 1; # 正常終了
    }

    # ロック
    if (!DA::Session::lock($filename)) {
        &_warn($session, "lock");
        return 0;
    }

    # 記録
    my $dat = Storable::retrieve($file);
    foreach my $mid (keys %$done_dat) {
        if (exists $dat->{$mid}) {
            # 新情報が変更されていなかったら削除
            if ($dat->{$mid}->{host} eq $done_dat->{$mid}->{host} &&
                $dat->{$mid}->{user} eq $done_dat->{$mid}->{user}) {
                delete $dat->{$mid};
            }
        }
    }
    my $result=1;
    my $ret = Storable::store($dat, $file);
    if (!$ret) {
        &_warn($session, "store");
        $result=0;
    }

    # ロック解除
    if (!DA::Session::unlock($filename)) {
        &_warn($session, "unlock");
        $result=0;
    }
    return $result;
}

sub new_mail_script4ajx {
my ($session)=@_;

my $script=<<buf_end;
function setCookie(item, value) {
    top.document.cookie = item + "=" + value + ";";
}
setCookie('$session->{sid}\-new_mail_clear','on');
buf_end
if (DA::OrgMail::check_org_mail_permit($session)) {
	DA::OrgMail::new_mail_script4ajx($session,\$script);
}
return ($script);

}

#------------add <br> tag when the start of html is <hr> in tag <p>-------#
sub _tag_html4ajax {
	my ($html) = @_;

	if ($html =~ /<hr/i) {
		$html =~ s/^((?:\s+|<[^<>]+>)*?<p[^<>]*?>(?:\s+|<[^<>]+>)*?<hr)/<br>$1/i;
	}

	return $html;
}

sub check_gaiji {
	my ($session, $detail, $key) = @_;

	my $result = {};
	return ($result) if ($DA::Vars::p->{ma_gaiji_check4ajx} eq 'off' || &mailer_charset() ne "UTF-8");

	unless ($key) {
		@{$key} = %{$detail} if ref($detail) eq 'HASH' || ref($detail) eq 'ARRAY';
	}
	foreach my $n (@{$key}) {
		next unless($detail->{$n});
		$result = &_check_gaiji($detail->{$n});
		if ($result->{error}) {
			last;
		}
	}
	return ($result);
}

sub _check_gaiji($) {
	my ($ref) = @_;
	my $result = {};
	if (ref($ref) eq "HASH") {
		$result = &_check_gaiji4hash($ref);
	} elsif (ref($ref) eq "ARRAY") {
		$result = &_check_gaiji4array($ref);
	} else {
		$result = &_check_gaiji4scalar($ref);
	}
	return $result;
}

sub _check_gaiji4hash($) {
	my ($hash) = @_;
	my $result = {};
	foreach my $key (keys %{$hash}) {
		if (ref($hash->{$key}) eq "HASH") {
			$result = &_check_gaiji4hash($hash->{$key});
		} elsif (ref($hash->{$key}) eq "ARRAY") {
			$result = &_check_gaiji4array($hash->{$key});
		} else {
			$result = &_check_gaiji4scalar($hash->{$key});
			if ($result->{error}) {
				last;
			}
		}
	}
	return $result;
}

sub _check_gaiji4array($) {
	my ($array) = @_;
	my $result = {};
	foreach my $l (@{$array}) {
		if (ref($l) eq "HASH") {
			$result = &_check_gaiji4hash($l);
		} elsif (ref($l) eq "ARRAY") {
			$result = &_check_gaiji4array($l);
		} else {
			$result = &_check_gaiji4scalar($l);
			if ($result->{error}) {
				last;
			}
		}
	}
	return $result;
}

sub _check_gaiji4scalar($) {
	my ($string) = @_;
	my $result = {};
	if (DA::CGIdef::check_gaiji_utf8($string, 'return')){
		$result = &error("NOT_CODE", 9);
	}
	return $result;
}

sub check_is_cyrus($) {
	my ($imaps) = @_;
	my $conf = DA::Ajax::Mailer::convert_internal($imaps->{imap});
    if($conf->{imap_type} =~/cyrus/i){
    	return 1;
    }else {
    	return undef;
    }
}

1;
