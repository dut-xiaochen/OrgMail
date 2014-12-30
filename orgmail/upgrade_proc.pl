#!/usr/local/bin/perl -w
BEGIN {
	use DA::Init();
	use DA::DB();
	use DA::Ns();
	use DA::Gettext;
	use Getopt::Long;
	use Patch;

}
use IO::File;
use strict;

=comment
・従来upgrade_procで行なっていたパッチ処理は機能別パッチにて行う
・ログファイル指定、ログレベル指定
・dry_runモード追加

log_level: logレベルを指定
0: 何も出力しない
1: 実行される機能別パッチ名をログ出力。
2: INSUITEの対して何らかの変更が行われる場合に、処理内容をログ出力。
 (設定ファイル変更、DB定義変更 など)
log_file: logを出力するファイルを指定
=cut


my ($help, $dryrun, $log_level, $log_file, $before_version);
GetOptions( "help!" => \$help, "d" => \$dryrun, "log=i" => \$log_level, "log_file=s" => \$log_file);

if( $help ){
	$help="usage : upgrade_proc.pl [-help] [-d] [-log=LOG_LEVEL] \n"
	     . "  -help       コマンドヘルプを表示する\n"
	     . "  -log        ログレベルを指定\n"
	     . "  -d          更新内容を出力。更新処理は行わない\n";
	die($help);
}

use constant COMMON_BEFORE_DIR			=> "./common_before";
use constant APP_SERVER_DIR				=> "./app_server";
use constant ADMIN_SERVER_BEFORE_DIR	=> "./admin_server_before";
use constant ADMIN_SERVER_AFTER_DIR		=> "./admin_server_after";
use constant COMMON_AFTER_DIR			=> "./common_after";

$log_level            ||= 0;
$Patch::log_level       = $log_level;
$Patch::dryrun          = $dryrun;
$Patch::patch_dir       = &current_dir();
$before_version         = $DA::IsVersion::Version;

&main();
exit;

sub main{
	my $session = {};
	Patch::create_session($session);
	
	my $success_file ="./success.dat";
	
	if ( -e $success_file ) {
		Patch::exe("rm $success_file");
	}
	
	my $server = DA::IS::get_data_file($session,"$DA::Vars::p->{base_dir}/system/etc/server.conf");
	
	### ADMIN,APPサーバ共通前処理
	&common_before_proc($session);
	if($server->{type} eq 'app'){
		
		### APPサーバ専用処理
		&app_server($session);
		
	}else{
		
		### ADMINサーバ専用前処理
		&admin_server($session);
		unless( $Patch::dryrun ){
			open(OUT,">$DA::Vars::p->{data_dir}/system/version.dat");
			print OUT "version=$DA::IsVersion::Version\n";
			close(OUT);
		}
		
		### ADMINサーバ専用後処理
		&admin_server_after($session);
		
	}
	
	### ADMIN,APPサーバ共通後処理
	&common_after_proc($session);
	
	$session->{dbh}->disconnect;

	# 機能別パッチでのエラーがなければ success.dat を作成	
	unless ( Patch::is_func_patch_err() ) {
		system("touch $success_file");
	}
}

################################################################################
# サーバ別(APP,管理サーバ)の処理
################################################################################

sub common_before_proc{
	my($session)=@_;
	
	# ▼ APPサーバ、管理サーバ共通前処理
	# 各サーバのlocal環境を修正する場合に使用する。
	# 各サーバ固有の処理が行なわれる前に必要な処理を実行する。
	# ----------------------------------------------------------------------
	Patch::log("==== ADMIN,APPサーバ共通前処理 start ====", 1);
	
	# -- pound の再起動（必要に応じて）
	# system("/etc/rc.d/init.d/pound status </dev/null >/dev/null 2>&1 && /etc/rc.d/init.d/pound restart </dev/null >/dev/null 2>&1");
	
	# 機能別パッチの実行
	Patch::exe_func_patch($session, COMMON_BEFORE_DIR);
	
	Patch::log("==== ADMIN,APPサーバ共通前処理 end ====", 1);
}

sub common_after_proc{
	my($session)=@_;
	
	# ▼ APPサーバ、管理サーバ共通後処理
	# 各サーバのlocal環境を修正する場合に使用する。
	# 各サーバ固有の処理が行なわれた後に必要な処理を実行する。
	# -------------------------------------------------------------------------
	Patch::log("==== ADMIN,APPサーバ共通後処理 start ====", 1);
	
	# 機能別パッチの実行
	Patch::exe_func_patch($session, COMMON_AFTER_DIR);
	
	Patch::log("==== ADMIN,APPサーバ共通後処理 end ====", 1);
}

sub app_server{
	my($session)=@_;

	# ▼ APPサーバ専用処理
	# APPサーバのlocal環境を修正する場合に使用する。
	# 共有ディレクトリの操作やDBの操作は行なわないように注意する。
	# -------------------------------------------------------------------------
	Patch::log("==== APPサーバ処理 start ====", 1);
	
	# 機能別パッチの実行
	Patch::exe_func_patch($session, APP_SERVER_DIR);
	
	Patch::log("==== APPサーバ処理 end ====", 1);

}

sub admin_server{
	my($session)=@_;
	
	# ▼ 管理サーバ専用処理
	# 管理サーバのlocal環境を修正する場合に使用する。
	# 主に共有ディレクトリの操作やDBの操作を行なう場合は、ここで実行する。
	# -------------------------------------------------------------------------
	Patch::log("==== ADMINサーバ前処理 start ====", 1);
	
	#---------------------
	# テーブル情報の更新（データベース操作前：必須！）
	Patch::remake_all_db_tables($session) unless( $Patch::dryrun );
	#---------------------
	
	Patch::control_copy();
	
	
	# 機能別パッチの実行
	Patch::exe_func_patch($session, ADMIN_SERVER_BEFORE_DIR);
	
	
	#---------------------
	# テーブル情報の更新（データベース操作後：必須！）
	Patch::remake_all_db_tables($session) unless( $Patch::dryrun );
	#---------------------

	# ▼ UTF-8カタログの更新
	Patch::exe("$DA::Vars::p->{bin_dir}/euc2utf_msg en");
	Patch::trans_utf_catalogue($session, 'zh');
	
	Patch::log("==== ADMINサーバ前処理 end ====", 1);

}

sub admin_server_after{
	my ($session)   = @_;

	# ▼ 管理サーバ専用処理
	# -------------------------------------------------------------------------
	Patch::log("==== ADMINサーバ後処理 start ====", 1);
	
	# 機能別パッチの実行
	Patch::exe_func_patch($session, ADMIN_SERVER_AFTER_DIR);
	
	Patch::log("==== ADMINサーバ後処理 end ====", 1);

}

sub current_dir {
	my $dir = `pwd`;
	$dir =~ s/^\s+|\s+$//g;
	return $dir;
}

################################################################################
# カスタム関数
################################################################################
1; 
