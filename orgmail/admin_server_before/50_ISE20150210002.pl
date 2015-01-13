#!/usr/local/bin/perl
BEGIN {
        use DA::Init;
        use Getopt::Long;
        require "../Patch.pm";
}
use strict;
################################################################################
## ���������
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
## ��ǽ�̤ν���
################################################################################
##
## ��ǽ�ֹ� : ISE20150210002
## ��ǽ̾   : ��Ĺ����β���
## �������� : �����ͤ��ɲ�
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
#   �� : PARAM = VALUE �ޤ��� PARAM <TAB> VALUE
#
# ���롼��̾�ν�ʣ�����å�
#   group_dup = 0   ��ʣ�����å��򤷤ʤ�
#               1   ��ʣ�����å��򤹤�(�ǥե����)
#
# �ѻ��ȿ��Խ����̤ǤΥ桼��������ǽ�ˤ���
#   temp_group_user_del = 0 ̵��[�ǥե����]
#                         1 ͭ��
#
# Sm\@rtDB�Υץ�����ǽ�ˤ����ơ��������̤Υ��롼���Խ����̤ǡ�
# ��Ĺ����Ĺ��Ԥ�����Ǥ���
#   sdb_superiors_display = off ̵��[�ǥե����]
#                           on ͭ��
#
EOF

Patch::rewrite_sys_custom("cache", 0, {"db_superiors_display => 'off'}, $pod);

$session->{dbh}->disconnect;

1;
