#!/usr/local/bin/perl
BEGIN {
        use DA::Init;
        use Getopt::Long;
        require "../Patch.pm";
}
use strict;
################################################################################
## 初期化処理
################################################################################
my ($dryrun, $log_level, $patch_dir);
GetOptions( "d" => \$dryrun, "log=i" => \$log_level, "patch_dir=s" => \$patch_dir);
$log_level            ||= 0;
$Patch::log_level       = $log_level;
$Patch::dryrun          = $dryrun;
$Patch::patch_dir       = $patch_dir || "..";

my $session={};
Patch::create_session($session);

################################################################################
## 機能別の処理
################################################################################
##
## 機能番号 : 
## 機能名   : 組織メールを同時に開く
## 処理概要 : 設定値を追加
##/home/DreamArts/data/custom/mail.dat change_org_mail_style=を追加する	

return "" if( $Patch::dryrun );

my $pod;
$pod->{head} =<<EOF;
###################################################
##  INSUITE(R)Enterprise Version 3.4.1.          ##
##  Copyright(C)2005-2007 DreamArts Corporation. ##
##  All rights to INSUITE routines reserved.     ##
###################################################
#
# archive_type=zip,lha,tar,mbox,eml
#     メールのダウンロードで指定可能なファイル形式
#         zip  : ZIP 形式
#         lha  : LHA 形式
#         tar  : TGZ 形式 ( tar + gzip )
#         mbox : mbox 形式
#         eml  : eml 形式
# local_server=INSUITE
#     フォルダ一覧に使用されるローカルサーバ名
# local_folder=一時保管
#     フォルダ一覧に使用されるローカルフォルダ名
# quota_limit=(0-100)
#     警告とするメールボックス使用率
# mainte_auto_conf=(on|off)
#     on の場合、メンテナンス「自動設定」項目を表示する。
# mainte_repair=(on|off)
#     on の場合、メンテナンス「修復」項目を表示する。
# menu_action=(on|off)
#     on の場合、環境設定「動作設定」項目を表示する。
# menu_action_mo=(on|off)
#     on の場合、モバイルの環境設定「動作設定」項目を表示する。
# menu_list=(on|off)
#     on の場合、環境設定「一覧表示項目設定」項目を表示する。
# menu_sent=(on|off)
#     on の場合、環境設定「送信設定」項目を表示する。
# menu_sign=(on|off)
#     on の場合、環境設定「署名」項目を表示する。
# menu_sign_mo=(on|off)
#     on の場合、モバイルの環境設定「動作設定」項目を表示する。
# menu_sv=(on|off)
#     on の場合、環境設定「メールサーバ設定」項目を表示する。
# menu_template=(on|off)
#     on の場合、環境設定「テンプレート」項目を表示する。
# menu_view=(on|off)
#     on の場合、環境設定「表示設定」項目を表示する。
# user_name=(on|off)
#     on の場合、環境設定「署名」項目の名前が未設定時、INSUITEユーザ名を名前として使用する。
# open_status=(on|off)
#     on の場合、送信メールの開封状況確認機能を使用する。
# new_mail_link=(on|off)
#     on の場合、各種アプリケーションの情報メール作成画面へのリンクを使用する。
# to_status_ignore=(on|off)
#     on の場合、自分宛メールの識別でアドレスの大文字小文字を無視する。
# user_search=(direct|address|off)
#     ユーザ検索ボタンの動作設定
#         direct  : 直接検索を実行する。
#         address : アドレス帳のユーザ検索画面を表示する。
#         off     : 使用しない。
# group_mail_target=(all|user|group)
#     グループメールでのグループ情報記載の制限
#         all   : 全ての宛先に対してグループ情報を記載する。
#         user  : ユーザのメールにのみグループ情報を記載する。
#         group : グループに所属するメンバーのメールにのみグループ情報を記載する。
# user_mail_target=(all|user|none)
#     ユーザ情報記載の制限
#         all   : 全ての宛先に対してユーザ情報を記載する。
#         user  : ユーザのメールにのみユーザ情報を記載する。
#         none  : ユーザ情報を記載しない。
# portal_ml_target=(on|off)
#     on の場合、ポータルの表示設定に「表示対象」の項目を表示する。
# portal_ml_day_list=表示範囲(日数)リスト
#     電子メールポートレット表示設定の表示範囲(日数)にて選択可能な日数を記載する。
# portal_ml_row_list=表示範囲(件数)リスト
#     電子メールポートレット表示設定の表示範囲(件数)にて選択可能な件数を記載する。
# max_number_per_page4ajx=表示件数
#     Ajaxメーラー使用時の一覧表示部の最大表示件数を設定する。(設定値の変更はで きません)
#         ajax    :Ajaxメーラーのみ使用可能とする
#         classic :標準メーラーのみ使用可能とする
# chg_toself_color=(on|off)
#     on の場合、Ajaxメーラーの自分宛メールを識別する場合の表示色を変更できるよ うにする。
# max_send_size_visible=(on|off)
#     on の場合、最大送信可能メールサイズをメール作成画面に表示する。
# inc_search_interval=秒(s)
#     インクリメンタルサーチが実行される無入力時間。
# inc_search_min_chars=文字数
#     インクリメンタルサーチが実行される最小文字数。
# sales_datalink_enable=(on|off)
#     on の場合、Salesとの連携を有効にする。
# folder_update_interval=秒(s)
#     Ajaxメーラーでフォルダの内容が更新される間隔。
# lock_try4ajx=n
#     ロック失敗時にリトライ回数。
# lock_wait4ajx=n
#     ロックリトライ時の待ち時間（s）。
# lock_expire4ajx=n
#     ロック時に、作成から有効時間を経過したものは削除して再度ロックを行う（s） 。
# cache_master4ajx=(on|off)
#     on の場合、セッション情報にキャッシュが有効。
# richtext2attachment=(on|off|user)
#     on の場合、リッチテキストを強制的に添付ファイルとして扱う。
#     off の場合、リッチテキストを強制的に直接表示する。
#     user の場合、リッチテキストの扱いをユーザ設定に依存する。
# part_search4ajx=(on|off)
# content_type=(text|html|user)
#     text の場合、テキストを強制的に利用として扱う
#     html の場合、リッチテキストを強制的に利用として扱う
#     user の場合、書式の扱いをユーザ設定に依存する
# upload_file_applet=(inline|hidden|off|user)
#     inline の場合、添付ファイルのドラッグ＆ドロップを強制的に有効にする。(初期状態は表示)
#     hidden の場合、添付ファイルのドラッグ＆ドロップを強制的に有効にする。(初期状態は非表示)
#     off の場合、添付ファイルのドラッグ＆ドロップを強制的に無効にする。
#     user の場合、添付ファイルのドラッグ＆ドロップをユーザ設定に依存する。
# auto_fix_consistency=(on|off|user)
#     on の場合、不整合の可能性が発見された場合の自動修復を強制的に有効にする。
#     off の場合、不整合の可能性が発見された場合の自動修復を強制的に無効にする。
#     user の場合、不整合の可能性が発見された場合の自動修復をユーザ設定に依存する。
# upload_retry4ajx=n
#     添付ファイルアップロード失敗時にリトライ回数。
# gaiji_check4ajx=(on|off)
#     on の場合、ニューメーラ画面表示時に漢字コードチェックを行う
#     off の場合、ニューメーラ画面表示時に漢字コードチェックを行わない
# richtext_warn=(on|off)
#     on の場合、スクリプトタグ削除の警告機能有効
#     off の場合、スクリプトタグ削除の警告機能無効
# forced_interruption=(on|off)
#     on  : メール送信時、強制中断を可能とする
#     off : メール送信時、強制中断を可能としない（デフォルト）
# dd_upload_max_file_num:  Ajaxメール編集画面のドラッグ＆ドロップ機能で、一度ア ップできるのファイル数
#                  ( 1~100 )
# org_hide_sender=(on|off)
#     on の場合、組織メール操作の場合個人メールの情報を隠す
#     off の場合、組織メール操作の場合個人メールの情報を隠さない
# auto_backup_on=(on|off|user)
#     on の場合、編集中のメールを自動保存する強制有効
#     off の場合、編集中のメールを自動保存する強制無効
#     user の場合、編集中のメールを自動保存するがユーザ設定に依存する
# auto_backup_interval=30秒(s)
#     編集中のメールを自動保存される間隔。
# backup_folder=自動バックアップ
#     バックフォルダの名前
# displaynone_disable=(on|off)
#     onの場合、メールHTML中の各タグ中の"display:none"の排除を強制的に有効にする(デフォルト)
#     offの場合、メールHTML中の各タグ中の"display:none"の排除を強制的に無効にする
# spellcheck_button_visible=(on|off)
#     onの場合、ユーザーは「スペルチェック」と言う機能を使用時に、Ajaxのメール作成画面の上部に「スペルチェック」のボタンを表示する
#     offの場合、ユーザーは「スペルチェック」と言う機能を使用かかわらず、Ajaxのメール作成画面の上部に「スペルチェック」のボタンを表示しない
# save_mail_to_library_encode=(UTF-8|Shift_JIS)
#     UTF-8の場合、メールをライブラリへ保存する場合は、UTF-8で保存します。
#     Shift_JISの場合、メールをライブラリへ保存する場合は、Shift_JISで保存します。
# save_mail_to_library_encode=(UTF-8|Shift_JIS)
#     UTF-8の場合、メールをライブラリへ保存する場合は、UTF-8で保存します。
#     Shift_JISの場合、メールをライブラリへ保存する場合は、Shift_JISで保存します。
# change_org_mail_style=(on|off)
#     onの場合は、組織メールを切替時に、新しいページで、メーラー画面を開く。
#     onの場合は、組織メールを切替時に、同じページで、メーラー画面を開く。（既存仕様）
#
EOF
Patch::rewrite_sys_custom("mail", 0, {"change_org_mail_style" => 'on'}, $pod );

$session->{dbh}->disconnect();

exit;

1;
