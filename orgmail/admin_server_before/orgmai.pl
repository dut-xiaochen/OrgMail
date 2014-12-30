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
## ��ǽ�ֹ� : 
## ��ǽ̾   : �ȿ��᡼���Ʊ���˳���
## �������� : �����ͤ��ɲ�
##/home/DreamArts/data/custom/mail.dat change_org_mail_style=���ɲä���	

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
#     �᡼��Υ�������ɤǻ����ǽ�ʥե��������
#         zip  : ZIP ����
#         lha  : LHA ����
#         tar  : TGZ ���� ( tar + gzip )
#         mbox : mbox ����
#         eml  : eml ����
# local_server=INSUITE
#     �ե���������˻��Ѥ��������륵����̾
# local_folder=����ݴ�
#     �ե���������˻��Ѥ���������ե����̾
# quota_limit=(0-100)
#     �ٹ�Ȥ���᡼��ܥå�������Ψ
# mainte_auto_conf=(on|off)
#     on �ξ�硢���ƥʥ󥹡ּ�ư����׹��ܤ�ɽ�����롣
# mainte_repair=(on|off)
#     on �ξ�硢���ƥʥ󥹡ֽ����׹��ܤ�ɽ�����롣
# menu_action=(on|off)
#     on �ξ�硢�Ķ������ư������׹��ܤ�ɽ�����롣
# menu_action_mo=(on|off)
#     on �ξ�硢��Х���δĶ������ư������׹��ܤ�ɽ�����롣
# menu_list=(on|off)
#     on �ξ�硢�Ķ�����ְ���ɽ����������׹��ܤ�ɽ�����롣
# menu_sent=(on|off)
#     on �ξ�硢�Ķ��������������׹��ܤ�ɽ�����롣
# menu_sign=(on|off)
#     on �ξ�硢�Ķ�����ֽ�̾�׹��ܤ�ɽ�����롣
# menu_sign_mo=(on|off)
#     on �ξ�硢��Х���δĶ������ư������׹��ܤ�ɽ�����롣
# menu_sv=(on|off)
#     on �ξ�硢�Ķ�����֥᡼�륵��������׹��ܤ�ɽ�����롣
# menu_template=(on|off)
#     on �ξ�硢�Ķ�����֥ƥ�ץ졼�ȡ׹��ܤ�ɽ�����롣
# menu_view=(on|off)
#     on �ξ�硢�Ķ������ɽ������׹��ܤ�ɽ�����롣
# user_name=(on|off)
#     on �ξ�硢�Ķ�����ֽ�̾�׹��ܤ�̾����̤�������INSUITE�桼��̾��̾���Ȥ��ƻ��Ѥ��롣
# open_status=(on|off)
#     on �ξ�硢�����᡼��γ���������ǧ��ǽ����Ѥ��롣
# new_mail_link=(on|off)
#     on �ξ�硢�Ƽ異�ץꥱ�������ξ���᡼��������̤ؤΥ�󥯤���Ѥ��롣
# to_status_ignore=(on|off)
#     on �ξ�硢��ʬ���᡼��μ��̤ǥ��ɥ쥹����ʸ����ʸ����̵�뤹�롣
# user_search=(direct|address|off)
#     �桼�������ܥ����ư������
#         direct  : ľ�ܸ�����¹Ԥ��롣
#         address : ���ɥ쥹Ģ�Υ桼���������̤�ɽ�����롣
#         off     : ���Ѥ��ʤ���
# group_mail_target=(all|user|group)
#     ���롼�ץ᡼��ǤΥ��롼�׾��󵭺ܤ�����
#         all   : ���Ƥΰ�����Ф��ƥ��롼�׾���򵭺ܤ��롣
#         user  : �桼���Υ᡼��ˤΤߥ��롼�׾���򵭺ܤ��롣
#         group : ���롼�פ˽�°������С��Υ᡼��ˤΤߥ��롼�׾���򵭺ܤ��롣
# user_mail_target=(all|user|none)
#     �桼�����󵭺ܤ�����
#         all   : ���Ƥΰ�����Ф��ƥ桼������򵭺ܤ��롣
#         user  : �桼���Υ᡼��ˤΤߥ桼������򵭺ܤ��롣
#         none  : �桼������򵭺ܤ��ʤ���
# portal_ml_target=(on|off)
#     on �ξ�硢�ݡ������ɽ������ˡ�ɽ���оݡפι��ܤ�ɽ�����롣
# portal_ml_day_list=ɽ���ϰ�(����)�ꥹ��
#     �Żҥ᡼��ݡ��ȥ�å�ɽ�������ɽ���ϰ�(����)�ˤ������ǽ�������򵭺ܤ��롣
# portal_ml_row_list=ɽ���ϰ�(���)�ꥹ��
#     �Żҥ᡼��ݡ��ȥ�å�ɽ�������ɽ���ϰ�(���)�ˤ������ǽ�ʷ���򵭺ܤ��롣
# max_number_per_page4ajx=ɽ�����
#     Ajax�᡼�顼���ѻ��ΰ���ɽ�����κ���ɽ����������ꤹ�롣(�����ͤ��ѹ��Ϥ� ���ޤ���)
#         ajax    :Ajax�᡼�顼�Τ߻��Ѳ�ǽ�Ȥ���
#         classic :ɸ��᡼�顼�Τ߻��Ѳ�ǽ�Ȥ���
# chg_toself_color=(on|off)
#     on �ξ�硢Ajax�᡼�顼�μ�ʬ���᡼����̤������ɽ�������ѹ��Ǥ���� ���ˤ��롣
# max_send_size_visible=(on|off)
#     on �ξ�硢����������ǽ�᡼�륵������᡼��������̤�ɽ�����롣
# inc_search_interval=��(s)
#     ���󥯥��󥿥륵�������¹Ԥ����̵���ϻ��֡�
# inc_search_min_chars=ʸ����
#     ���󥯥��󥿥륵�������¹Ԥ����Ǿ�ʸ������
# sales_datalink_enable=(on|off)
#     on �ξ�硢Sales�Ȥ�Ϣ�Ȥ�ͭ���ˤ��롣
# folder_update_interval=��(s)
#     Ajax�᡼�顼�ǥե���������Ƥ����������ֳ֡�
# lock_try4ajx=n
#     ��å����Ի��˥�ȥ饤�����
# lock_wait4ajx=n
#     ��å���ȥ饤�����Ԥ����֡�s�ˡ�
# lock_expire4ajx=n
#     ��å����ˡ���������ͭ�����֤�вᤷ����ΤϺ�����ƺ��٥�å���Ԥ���s�� ��
# cache_master4ajx=(on|off)
#     on �ξ�硢���å�������˥���å��夬ͭ����
# richtext2attachment=(on|off|user)
#     on �ξ�硢��å��ƥ����Ȥ���Ū��ź�եե�����Ȥ��ư�����
#     off �ξ�硢��å��ƥ����Ȥ���Ū��ľ��ɽ�����롣
#     user �ξ�硢��å��ƥ����Ȥΰ�����桼������˰�¸���롣
# part_search4ajx=(on|off)
# content_type=(text|html|user)
#     text �ξ�硢�ƥ����Ȥ���Ū�����ѤȤ��ư���
#     html �ξ�硢��å��ƥ����Ȥ���Ū�����ѤȤ��ư���
#     user �ξ�硢�񼰤ΰ�����桼������˰�¸����
# upload_file_applet=(inline|hidden|off|user)
#     inline �ξ�硢ź�եե�����Υɥ�å����ɥ�åפ���Ū��ͭ���ˤ��롣(������֤�ɽ��)
#     hidden �ξ�硢ź�եե�����Υɥ�å����ɥ�åפ���Ū��ͭ���ˤ��롣(������֤���ɽ��)
#     off �ξ�硢ź�եե�����Υɥ�å����ɥ�åפ���Ū��̵���ˤ��롣
#     user �ξ�硢ź�եե�����Υɥ�å����ɥ�åפ�桼������˰�¸���롣
# auto_fix_consistency=(on|off|user)
#     on �ξ�硢������β�ǽ����ȯ�����줿���μ�ư��������Ū��ͭ���ˤ��롣
#     off �ξ�硢������β�ǽ����ȯ�����줿���μ�ư��������Ū��̵���ˤ��롣
#     user �ξ�硢������β�ǽ����ȯ�����줿���μ�ư������桼������˰�¸���롣
# upload_retry4ajx=n
#     ź�եե����륢�åץ��ɼ��Ի��˥�ȥ饤�����
# gaiji_check4ajx=(on|off)
#     on �ξ�硢�˥塼�᡼�����ɽ�����˴��������ɥ����å���Ԥ�
#     off �ξ�硢�˥塼�᡼�����ɽ�����˴��������ɥ����å���Ԥ�ʤ�
# richtext_warn=(on|off)
#     on �ξ�硢������ץȥ�������ηٹ�ǽͭ��
#     off �ξ�硢������ץȥ�������ηٹ�ǽ̵��
# forced_interruption=(on|off)
#     on  : �᡼�����������������Ǥ��ǽ�Ȥ���
#     off : �᡼�����������������Ǥ��ǽ�Ȥ��ʤ��ʥǥե���ȡ�
# dd_upload_max_file_num:  Ajax�᡼���Խ����̤Υɥ�å����ɥ�å׵�ǽ�ǡ����٥� �åפǤ���Υե������
#                  ( 1~100 )
# org_hide_sender=(on|off)
#     on �ξ�硢�ȿ��᡼�����ξ��Ŀͥ᡼��ξ���򱣤�
#     off �ξ�硢�ȿ��᡼�����ξ��Ŀͥ᡼��ξ���򱣤��ʤ�
# auto_backup_on=(on|off|user)
#     on �ξ�硢�Խ���Υ᡼���ư��¸���붯��ͭ��
#     off �ξ�硢�Խ���Υ᡼���ư��¸���붯��̵��
#     user �ξ�硢�Խ���Υ᡼���ư��¸���뤬�桼������˰�¸����
# auto_backup_interval=30��(s)
#     �Խ���Υ᡼���ư��¸�����ֳ֡�
# backup_folder=��ư�Хå����å�
#     �Хå��ե������̾��
# displaynone_disable=(on|off)
#     on�ξ�硢�᡼��HTML��γƥ������"display:none"���ӽ�����Ū��ͭ���ˤ���(�ǥե����)
#     off�ξ�硢�᡼��HTML��γƥ������"display:none"���ӽ�����Ū��̵���ˤ���
# spellcheck_button_visible=(on|off)
#     on�ξ�硢�桼�����ϡ֥��ڥ�����å��פȸ�����ǽ����ѻ��ˡ�Ajax�Υ᡼��������̤ξ����ˡ֥��ڥ�����å��פΥܥ����ɽ������
#     off�ξ�硢�桼�����ϡ֥��ڥ�����å��פȸ�����ǽ����Ѥ�����餺��Ajax�Υ᡼��������̤ξ����ˡ֥��ڥ�����å��פΥܥ����ɽ�����ʤ�
# save_mail_to_library_encode=(UTF-8|Shift_JIS)
#     UTF-8�ξ�硢�᡼���饤�֥�����¸������ϡ�UTF-8����¸���ޤ���
#     Shift_JIS�ξ�硢�᡼���饤�֥�����¸������ϡ�Shift_JIS����¸���ޤ���
# save_mail_to_library_encode=(UTF-8|Shift_JIS)
#     UTF-8�ξ�硢�᡼���饤�֥�����¸������ϡ�UTF-8����¸���ޤ���
#     Shift_JIS�ξ�硢�᡼���饤�֥�����¸������ϡ�Shift_JIS����¸���ޤ���
# change_org_mail_style=(on|off)
#     on�ξ��ϡ��ȿ��᡼������ػ��ˡ��������ڡ����ǡ��᡼�顼���̤򳫤���
#     on�ξ��ϡ��ȿ��᡼������ػ��ˡ�Ʊ���ڡ����ǡ��᡼�顼���̤򳫤����ʴ�¸���͡�
#
EOF
Patch::rewrite_sys_custom("mail", 0, {"change_org_mail_style" => 'on'}, $pod );

$session->{dbh}->disconnect();

exit;

1;
