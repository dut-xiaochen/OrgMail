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
## 機能番号 : ISE20150210002
## 機能名   : 上長設定の改修
## 処理概要 : 設定値を追加
##   /home/DreamArts/data/system/custom_check.dat
##  +      sdb_superiors_display=off
##

return "" if( $Patch::dryrun );

my $pod;
$pod->{head} =<<EOF;
###################################################
##  INSUITE(R)Enterprise Version 3.4.4.0.        ##
##  Copyright(C)2003-2015 DreamArts Corporation. ##
##  All rights to INSUITE routines reserved.     ##
###################################################
#   書式 : PARAM = VALUE または PARAM <TAB> VALUE
#
# グループ名の重複チェック
#   group_dup = 0   重複チェックをしない
#               1   重複チェックをする(デフォルト)
#
# 廃止組織編集画面でのユーザ削除を可能にする
#   temp_group_user_del = 0 無効[デフォルト]
#                         1 有効
#
# Sm\@rtDBのプロセス機能において、管理画面のグループ編集画面で、
# 上長・上長代行を設定できる
#   sdb_superiors_display = off 無効[デフォルト]
#                           on 有効
#
EOF

Patch::rewrite_sys_custom("cache", 0, {"db_superiors_display => 'off'}, $pod);

$session->{dbh}->disconnect;

1;
