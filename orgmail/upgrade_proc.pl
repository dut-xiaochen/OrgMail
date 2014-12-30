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
������upgrade_proc�ǹԤʤäƤ����ѥå������ϵ�ǽ�̥ѥå��ˤƹԤ�
�����ե�������ꡢ����٥����
��dry_run�⡼���ɲ�

log_level: log��٥�����
0: ������Ϥ��ʤ�
1: �¹Ԥ���뵡ǽ�̥ѥå�̾������ϡ�
2: INSUITE���Ф��Ʋ��餫���ѹ����Ԥ�����ˡ��������Ƥ�����ϡ�
 (����ե������ѹ���DB����ѹ� �ʤ�)
log_file: log����Ϥ���ե���������
=cut


my ($help, $dryrun, $log_level, $log_file, $before_version);
GetOptions( "help!" => \$help, "d" => \$dryrun, "log=i" => \$log_level, "log_file=s" => \$log_file);

if( $help ){
	$help="usage : upgrade_proc.pl [-help] [-d] [-log=LOG_LEVEL] \n"
	     . "  -help       ���ޥ�ɥإ�פ�ɽ������\n"
	     . "  -log        ����٥�����\n"
	     . "  -d          �������Ƥ���ϡ����������ϹԤ�ʤ�\n";
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
	
	### ADMIN,APP�����ж���������
	&common_before_proc($session);
	if($server->{type} eq 'app'){
		
		### APP���������ѽ���
		&app_server($session);
		
	}else{
		
		### ADMIN����������������
		&admin_server($session);
		unless( $Patch::dryrun ){
			open(OUT,">$DA::Vars::p->{data_dir}/system/version.dat");
			print OUT "version=$DA::IsVersion::Version\n";
			close(OUT);
		}
		
		### ADMIN���������Ѹ����
		&admin_server_after($session);
		
	}
	
	### ADMIN,APP�����ж��̸����
	&common_after_proc($session);
	
	$session->{dbh}->disconnect;

	# ��ǽ�̥ѥå��ǤΥ��顼���ʤ���� success.dat �����	
	unless ( Patch::is_func_patch_err() ) {
		system("touch $success_file");
	}
}

################################################################################
# ��������(APP,����������)�ν���
################################################################################

sub common_before_proc{
	my($session)=@_;
	
	# �� APP�����С����������ж���������
	# �ƥ����Ф�local�Ķ�����������˻��Ѥ��롣
	# �ƥ����и�ͭ�ν������Ԥʤ�������ɬ�פʽ�����¹Ԥ��롣
	# ----------------------------------------------------------------------
	Patch::log("==== ADMIN,APP�����ж��������� start ====", 1);
	
	# -- pound �κƵ�ư��ɬ�פ˱����ơ�
	# system("/etc/rc.d/init.d/pound status </dev/null >/dev/null 2>&1 && /etc/rc.d/init.d/pound restart </dev/null >/dev/null 2>&1");
	
	# ��ǽ�̥ѥå��μ¹�
	Patch::exe_func_patch($session, COMMON_BEFORE_DIR);
	
	Patch::log("==== ADMIN,APP�����ж��������� end ====", 1);
}

sub common_after_proc{
	my($session)=@_;
	
	# �� APP�����С����������ж��̸����
	# �ƥ����Ф�local�Ķ�����������˻��Ѥ��롣
	# �ƥ����и�ͭ�ν������Ԥʤ�줿���ɬ�פʽ�����¹Ԥ��롣
	# -------------------------------------------------------------------------
	Patch::log("==== ADMIN,APP�����ж��̸���� start ====", 1);
	
	# ��ǽ�̥ѥå��μ¹�
	Patch::exe_func_patch($session, COMMON_AFTER_DIR);
	
	Patch::log("==== ADMIN,APP�����ж��̸���� end ====", 1);
}

sub app_server{
	my($session)=@_;

	# �� APP���������ѽ���
	# APP�����Ф�local�Ķ�����������˻��Ѥ��롣
	# ��ͭ�ǥ��쥯�ȥ������DB�����ϹԤʤ�ʤ��褦����դ��롣
	# -------------------------------------------------------------------------
	Patch::log("==== APP�����н��� start ====", 1);
	
	# ��ǽ�̥ѥå��μ¹�
	Patch::exe_func_patch($session, APP_SERVER_DIR);
	
	Patch::log("==== APP�����н��� end ====", 1);

}

sub admin_server{
	my($session)=@_;
	
	# �� �������������ѽ���
	# ���������Ф�local�Ķ�����������˻��Ѥ��롣
	# ��˶�ͭ�ǥ��쥯�ȥ������DB������Ԥʤ����ϡ������Ǽ¹Ԥ��롣
	# -------------------------------------------------------------------------
	Patch::log("==== ADMIN������������ start ====", 1);
	
	#---------------------
	# �ơ��֥����ι����ʥǡ����١����������ɬ�ܡ���
	Patch::remake_all_db_tables($session) unless( $Patch::dryrun );
	#---------------------
	
	Patch::control_copy();
	
	
	# ��ǽ�̥ѥå��μ¹�
	Patch::exe_func_patch($session, ADMIN_SERVER_BEFORE_DIR);
	
	
	#---------------------
	# �ơ��֥����ι����ʥǡ����١������塧ɬ�ܡ���
	Patch::remake_all_db_tables($session) unless( $Patch::dryrun );
	#---------------------

	# �� UTF-8�������ι���
	Patch::exe("$DA::Vars::p->{bin_dir}/euc2utf_msg en");
	Patch::trans_utf_catalogue($session, 'zh');
	
	Patch::log("==== ADMIN������������ end ====", 1);

}

sub admin_server_after{
	my ($session)   = @_;

	# �� �������������ѽ���
	# -------------------------------------------------------------------------
	Patch::log("==== ADMIN�����и���� start ====", 1);
	
	# ��ǽ�̥ѥå��μ¹�
	Patch::exe_func_patch($session, ADMIN_SERVER_AFTER_DIR);
	
	Patch::log("==== ADMIN�����и���� end ====", 1);

}

sub current_dir {
	my $dir = `pwd`;
	$dir =~ s/^\s+|\s+$//g;
	return $dir;
}

################################################################################
# ��������ؿ�
################################################################################
1; 
