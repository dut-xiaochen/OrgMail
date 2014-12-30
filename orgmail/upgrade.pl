#!/usr/local/bin/perl -w
BEGIN {
	use DA::Init();
}
use strict;

my $server_type=$ARGV[0];

my $patch_ver = '3.4.2';
my $last_ver  = '3.4.1';
# インストール前一つバージョンをチェック
&check_ver ($last_ver,$patch_ver);

# V3.1.5 組織世代管理2 マージバージョンだけで必要。
# 以降のVerでは以下4行を外すこと
#use Patch;
#my $session={};
#Patch::create_session($session);
#check_generation($session, $patch_ver);
## ここまで 

local $ENV{PATH} = "/usr/local/bin:/usr/bin:$ENV{PATH}";
my $perl_version = `eval \`perl -V:version\`; echo -n \$version;`;
my $installsitelib = `eval \`perl -V:installsitelib\`; echo -n \$installsitelib;`;
my $libs_dir = "$installsitelib/DA";

my($base_dir,$is_package,$linux);
my $inifile="/usr/local/etc/is_enterprise.ini";
open (IN, "$inifile");
while (<IN>) {
    $_=~s/\r//g; $_=~s/\n//g;
    if ($_=~/^Install=(.*)/i) { $base_dir="$1"; }
    if ($_=~/^Linux=(.*)/i) { $linux="$1"; }
    if ($_=~/^Package=(.*)/i) { $is_package="$1"; }
}
close(IN);

my $inst_dir="$base_dir";
if(!$inst_dir){exit;}

if(! -d "$inst_dir/logs/patch"){
    system("mkdir $inst_dir/logs/patch");
}

if(! -d "$inst_dir/logs/feedcache"){
    system("mkdir $inst_dir/logs/feedcache");
}


if(! -d "$inst_dir/insuite/cab"){
    system("mkdir $inst_dir/insuite/cab");
    system("chown -R iseadmin.iseadmin $inst_dir/insuite/cab");
    system("chmod -R 750 $inst_dir/insuite/cab")
}
if(! -d "$inst_dir/data/operation" && $server_type ne 'app'){
    system("mkdir $inst_dir/data/operation");
    system("mkdir $inst_dir/data/operation/logs");
    system("chown -R iseadmin.iseadmin $inst_dir/data/operation");
    system("chmod -R 770 $inst_dir/data/operation")
}

&time_stamp($patch_ver,"$inst_dir/logs/patch/patch_history.dat",'started');

my $perl_rpm = $perl_version;
if($installsitelib eq "/usr/local/lib/perl5/site_perl/5.6.1"){
	$perl_rpm = "local";
}

my $rssfeedcache_pid;
if($server_type ne 'app') {
   $rssfeedcache_pid =` ps ax -o pid,command |grep 'run rssfeedcache start' |grep -v grep | sed -e "s/^\s*//" |cut -d ' ' -f 1`;
}

if(-d "./RPMS"){
    system("rpm -Uvh --force --nodeps ./RPMS/*.rpm >/dev/null 2>&1");
	# Perl Version 
    if(-d "./RPMS/$perl_rpm"){
        system("rpm -Uvh --force --nodeps ./RPMS/$perl_rpm/*.rpm >/dev/null 2>&1");
    }
    # OS
    if($linux=~/Red\s*Hat\s*Enterprise\s*Linux\s*Server\s*release\s*5\s*.*/){
        if(-d "./RPMS/OS/RH5"){
            system("rpm -Uvh --force --nodeps ./RPMS/OS/RH5/*.rpm >/dev/null 2>&1");
        }
    }

}

if($server_type ne 'app' && $rssfeedcache_pid) {
    system("/etc/rc.d/init.d/rssfeedcache restart >/dev/null 2>&1");
}

if(-d "LIB"){
	chdir "LIB";
	my $file;
# MODIFIED BY Faiz <faiz_kazi@dreamarts.co.jp>
# START -->
# the find command is safer (than hard-coding the */*... levels)
#	foreach my $pattern (qw(*.pm */*.pm */*/*.pm */*/*/*.pm)) {
#		foreach my $file (glob $pattern) {
#			my $copy_cmd = "install -D -p -m 444 -o root -g root $file $installsitelib/$file";
#			system($copy_cmd);
#		}
#	}
	foreach my $file (`find -name '*.pm'`) {
		chomp $file;
		my $copy_cmd = "install -D -p -m 444 -o root -g root $file $installsitelib/$file";
		system($copy_cmd);
	}
# <-- END 
	chdir "..";
}

#my $pm  = "$libs_dir/Hibiki/SDB_Custom.pm";
#unless( -f  $pm ) {
#    unless ( -d "$libs_dir/Hibiki" ) {
#        system("mkdir $libs_dir/Hibiki");
#        system("chown root.root $libs_dir/Hibiki");
#        system("chmod 755 $libs_dir/Hibiki");
#    }
#    system("chown root.root ./ETC/SDB_Custom.pm");
#    system("chmod 444 ./ETC/SDB_Custom.pm ");
#    system("/bin/cp -p ./ETC/SDB_Custom.pm  $pm ");
#}

if(-d "./CGI"){
    system("/bin/chmod 750 ./CGI/*.cgi");
    system("/bin/cp -p ./CGI/*.cgi $inst_dir/cgi-bin");
    system("chown iseadmin.iseadmin $inst_dir/cgi-bin/*.cgi");
    system("chmod 750 $inst_dir/cgi-bin/*.cgi");
	if (-d "./CGI/custom"){
		system("/bin/cp -p ./CGI/custom/*.cgi $inst_dir/cgi-bin/custom");
	}
	
	unless (-d "$inst_dir/cgi-bin/cert_api" ){
		system("mkdir $inst_dir/cgi-bin/cert_api");
		system("chown iseadmin.iseadmin $inst_dir/cgi-bin/cert_api");
		system("chmod 755 $inst_dir/cgi-bin/cert_api");
	}

	if (-d "./CGI/cert_api"){
		system("/bin/cp -p ./CGI/cert_api/*.cgi $inst_dir/cgi-bin/cert_api");
    	system("chown iseadmin.iseadmin $inst_dir/cgi-bin/cert_api/*.cgi");
    	system("chmod 750 $inst_dir/cgi-bin/cert_api/*.cgi");
	}
}

if(-d "./AD_CGI"){
    system("/bin/chmod 750 ./AD_CGI/*.cgi");
    system("/bin/cp -p ./AD_CGI/*.cgi $inst_dir/admin-cgi-bin");
    system("chown iseadmin.iseadmin $inst_dir/admin-cgi-bin/*.cgi");
    system("chmod 750 $inst_dir/admin-cgi-bin/*.cgi");
}

if(-d "./PB_CGI"){
    system("/bin/chmod 750 ./PB_CGI/*.cgi");
    system("/bin/cp -p ./PB_CGI/*.cgi $inst_dir/public-cgi-bin");
    system("chown iseadmin.iseadmin $inst_dir/public-cgi-bin/*.cgi");
    system("chmod 750 $inst_dir/public-cgi-bin/*.cgi");
}

if(-d "./MO_CGI"){
    system("/bin/chmod 750 ./MO_CGI/*.cgi");
    system("/bin/cp -p ./MO_CGI/*.cgi $inst_dir/mo-cgi-bin");
    system("chown iseadmin.iseadmin $inst_dir/mo-cgi-bin/*.cgi");
    system("chmod 750 $inst_dir/mo-cgi-bin/*.cgi");
}

if(-d "./SSI"){
    system("/bin/cp -p ./SSI/* $inst_dir/ssi-bin");
    system("chown iseadmin.iseadmin $inst_dir/ssi-bin/*");
    system("chmod 750 $inst_dir/ssi-bin/*");
}

if(-d "./SP_CGI"){

    unless( -d  "$inst_dir/sp-cgi-bin"  ){
      system("mkdir $inst_dir/sp-cgi-bin  ");
      system("chown iseadmin.iseadmin $inst_dir/sp-cgi-bin ");
      system("chmod 775 $inst_dir/sp-cgi-bin ");
    }

    system("/bin/chmod 750 ./SP_CGI/*.cgi");
    system("/bin/cp -p ./SP_CGI/*.cgi $inst_dir/sp-cgi-bin");
    system("chown iseadmin.iseadmin $inst_dir/sp-cgi-bin/*.cgi");
    system("chmod 750 $inst_dir/sp-cgi-bin/*.cgi");
}

if(-d "./GUIDE_CGI"){
    system("/bin/cp -p ./GUIDE_CGI/* $inst_dir/guide-cgi-bin");
    system("chown iseadmin.iseadmin $inst_dir/guide-cgi-bin/*");
    system("chmod 755 $inst_dir/guide-cgi-bin/*");
}

if(-d "./IMAGES"){
    system("find ./IMAGES -type f -exec chmod 644 {} \\;");
    system("find ./IMAGES -type f -exec chown iseadmin:iseadmin {} \\;");
    system("find ./IMAGES -type d -exec chmod 750 {} \\;");
    system("find ./IMAGES -type d -exec chown iseadmin:iseadmin {} \\;");
    system("/bin/cp -rp ./IMAGES/* $inst_dir/images/");
}

if(-d "./IMAGES-EN"){
    system("find ./IMAGES-EN -type f -exec chmod 644 {} \\;");
    system("find ./IMAGES-EN -type d -exec chmod 750 {} \\;");
    system("/bin/cp -rp ./IMAGES-EN/* $inst_dir/images/en");
}

if(-d "./IMAGES-ZH"){
    system("find ./IMAGES-ZH -type f -exec chmod 644 {} \\;");
    system("find ./IMAGES-ZH -type d -exec chmod 750 {} \\;");
    system("/bin/cp -rp ./IMAGES-ZH/* $inst_dir/images/zh");
}

if(-d "./MO_IMAGES"){
    if (!-d "$inst_dir/insuite/i/images") {
        system("mkdir -p $inst_dir/insuite/i/images");
        system("chown iseadmin.iseadmin $inst_dir/insuite/i/images");
        system("chmod 750 $inst_dir/insuite/i/images");
    }
    system("chown -R iseadmin.iseadmin ./MO_IMAGES/*");
    system("/bin/cp -rp ./MO_IMAGES/* $inst_dir/insuite/i/images");
}

if(-d "./JS"){
    if (!-d "$inst_dir/insuite/js") {
        system("mkdir -p $inst_dir/insuite/js");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js");
        system("chmod 750 $inst_dir/insuite/js");
    }
    if (!-d "$inst_dir/insuite/js/common") {
        system("mkdir -p $inst_dir/insuite/js/common");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/common");
        system("chmod 750 $inst_dir/insuite/js/common");
    }
    if (!-d "$inst_dir/insuite/js/richText") {
        system("mkdir -p $inst_dir/insuite/js/richText");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/richText");
        system("chmod 750 $inst_dir/insuite/js/richText");
    }
    if (!-d "$inst_dir/insuite/js/iseria") {
        system("mkdir -p $inst_dir/insuite/js/iseria");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/iseria");
        system("chmod 750 $inst_dir/insuite/js/iseria");
    }
    if (!-d "$inst_dir/insuite/js/iseria/mailer") {
        system("mkdir -p $inst_dir/insuite/js/iseria/mailer");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/iseria/mailer");
        system("chmod 750 $inst_dir/insuite/js/iseria/mailer");
    }
    if (!-d "$inst_dir/insuite/js/rssreader") {
        system("mkdir -p $inst_dir/insuite/js/rssreader");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/rssreader");
        system("chmod 750 $inst_dir/insuite/js/rssreader");
    }
    if (!-d "$inst_dir/insuite/js/info_card") {
        system("mkdir -p $inst_dir/insuite/js/info_card");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/info_card");
        system("chmod 750 $inst_dir/insuite/js/info_card");
    }
	if (!-d "$inst_dir/insuite/js/portal") {
        system("mkdir -p $inst_dir/insuite/js/portal");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/portal");
        system("chmod 750 $inst_dir/insuite/js/portal");
    }
	if (!-d "$inst_dir/insuite/js/prototype")
	{
		system("mkdir -p $inst_dir/insuite/js/prototype ");
		system("chown iseadmin.iseadmin $inst_dir/insuite/js/prototype");
		system("chmod 755 $inst_dir/insuite/js/prototype");
	}
	if (!-d "$inst_dir/insuite/js/prototype/v1.6.0_rc1")
	{
		system("mkdir -p $inst_dir/insuite/js/prototype/v1.6.0_rc1 ");
		system("chown iseadmin.iseadmin $inst_dir/insuite/js/prototype/v1.6.0_rc1");
		system("chmod 755 $inst_dir/insuite/js/prototype/v1.6.0_rc1");
	}
	if (!-d "$inst_dir/insuite/js/prototype/v1.6.0.3")
	{
		system("mkdir -p $inst_dir/insuite/js/prototype/v1.6.0.3 ");
		system("chown iseadmin.iseadmin $inst_dir/insuite/js/prototype/v1.6.0.3");
		system("chmod 755 $inst_dir/insuite/js/prototype/v1.6.0.3");
	}
    if (!-d "$inst_dir/insuite/js/SmartPhone")
    {
        system("mkdir -p $inst_dir/insuite/js/SmartPhone ");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/SmartPhone");
        system("chmod 755 $inst_dir/insuite/js/SmartPhone");
    }
    if (!-d "$inst_dir/insuite/js/jquery")
    {
        system("mkdir -p $inst_dir/insuite/js/jquery ");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/jquery");
        system("chmod 755 $inst_dir/insuite/js/jquery");
    }
    if (!-d "$inst_dir/insuite/js/jquery/ui")
    {
        system("mkdir -p $inst_dir/insuite/js/jquery/ui");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/jquery/ui");
        system("chmod 755 $inst_dir/insuite/js/jquery/ui");
    }
    if (!-d "$inst_dir/insuite/js/jquery/themes")
    {
        system("mkdir -p $inst_dir/insuite/js/jquery/themes ");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/jquery/themes");
        system("chmod 755 $inst_dir/insuite/js/jquery/themes");
    }
    if (!-d "$inst_dir/insuite/js/iui")
    {
        system("mkdir -p $inst_dir/insuite/js/iui ");
        system("chown iseadmin.iseadmin $inst_dir/insuite/js/iui");
        system("chmod 755 $inst_dir/insuite/js/iui");
    }
	if (!-d "$inst_dir/insuite/js/custom")
	{
    	system("mkdir -p $inst_dir/insuite/js/custom");
    	system("chown iseadmin.iseadmin $inst_dir/insuite/js/custom");
    	system("chmod 755 $inst_dir/insuite/js/custom");
	}

	#system("chmod -R 644 ./JS/*");
    system("chown -R iseadmin.iseadmin ./JS/*");
	#system("chmod 755 ./JS/common");
	#system("chmod 755 ./JS/iseria");
	#system("chmod 755 ./JS/iseria/mailer");
	#system("chmod 755 ./JS/prototype");
	#system("chmod 755 ./JS/prototype/v1.6.0_rc1");
	#system("chmod 755 ./JS/prototype/v1.6.0.3");
	#system("chmod 755 ./JS/rssreader");
	#system("chmod 755 ./JS/SmartPhone");
	#system("chmod 755 ./JS/jquery");
	#system("chmod 755 ./JS/jquery/ui");
	#system("chmod 755 ./JS/jquery/themes");
	#system("chmod 755 ./JS/iui");

	system("/bin/cp -rp ./JS/* $inst_dir/insuite/js/");

	if (-d "$inst_dir/insuite/js/iseria/mailer/custom"){
		system("chmod 755 $inst_dir/insuite/js/iseria/mailer/custom");
	}

   # DCM 対応
    if (-d "$inst_dir/insuite/js/DCM") {
        system("chmod 755 $inst_dir/insuite/js/DCM");
        system("chmod 755 $inst_dir/insuite/js/DCM/*");
    }
}

if(-d "./APPLET" && $server_type ne 'app'){
	unless (-d "$inst_dir/insuite/applet") {
		system("mkdir -p $inst_dir/insuite/applet");
		system("chown iseadmin.iseadmin $inst_dir/insuite/applet");
		system("chmod 750 $inst_dir/insuite/applet");
	}
	system("/bin/cp -rp ./APPLET/* $inst_dir/insuite/applet");
	system("/bin/chown iseadmin.iseadmin $inst_dir/insuite/applet/*");
	system("/bin/chmod 644 $inst_dir/insuite/applet/*");
}

if(-d "./HTML-JS" && $server_type ne 'app'){
	system("/bin/cp -p ./HTML-JS/* $inst_dir/insuite/html/");
	system("/bin/chown iseadmin.iseadmin $inst_dir/insuite/html/*.js");
	system("/bin/chmod 640 $inst_dir/insuite/html/*.js");
}
if(-d "./HTML_SP"){
    unless( -d "$inst_dir/insuite/sp" ){
		system("mkdir -p $inst_dir/insuite/sp");
		system("chown iseadmin.iseadmin $inst_dir/insuite/sp");
		system("chmod 750 $inst_dir/insuite/sp");
    }
	system("/bin/cp -rp ./HTML_SP/* $inst_dir/insuite/sp");
	system("/bin/chown iseadmin.iseadmin $inst_dir/insuite/sp/*");
	system("/bin/chmod 640 $inst_dir/insuite/sp/*");
}


if(-d "./ETC/css"){
        system("/bin/cp -rp ./ETC/css/* $inst_dir/insuite/css");
}   

if(-d "./CSS"){
	unless( -d "$inst_dir/insuite/css/SmartPhone" ){
		system("mkdir -p $inst_dir/insuite/css/SmartPhone");
		system("chown iseadmin.iseadmin $inst_dir/insuite/css/SmartPhone");
		system("chmod 750 $inst_dir/insuite/css/SmartPhone");
	}
	unless( -d "$inst_dir/insuite/css/custom" ){
	  system("mkdir -p $inst_dir/insuite/css/custom");
	  system("chown iseadmin.iseadmin $inst_dir/insuite/css/custom");
	  system("chmod 750 $inst_dir/insuite/css/custom");
	}
	umask 0;
	system("/bin/cp -rp ./CSS/* $inst_dir/insuite/css");
	system("/bin/chmod 644  $inst_dir/insuite/css/*.css");
	system("/bin/chmod 664 $inst_dir/insuite/css/normal_style.css");
	system("/bin/chmod 664 $inst_dir/insuite/css/UTF-8/custom_style.css");
        system("/bin/chmod 664 $inst_dir/insuite/css/custom_style.css");
        system("/bin/chmod 664 $inst_dir/insuite/css/UTF-8/normal_style.css");

	system("/bin/chown -R iseadmin:iseadmin $inst_dir/insuite/css/*");
	system("/bin/chown -R www:www $inst_dir/insuite/css/custom_style.css");
        system("/bin/chown -R www:www $inst_dir/insuite/css/UTF-8/custom_style.css");
        system("/bin/chown -R www:www $inst_dir/insuite/css/normal_style.css");
        system("/bin/chown -R www:www $inst_dir/insuite/css/UTF-8/normal_style.css");
        system("/bin/chown -R www:www $inst_dir/insuite/css/smartpage.css");
        system("/bin/chown -R www:www $inst_dir/insuite/css/UTF-8/smartpage.css");

	system("/bin/chown iseadmin.iseadmin $inst_dir/insuite/css/SmartPhone/*");
	system("/bin/chmod 644 $inst_dir/insuite/css/SmartPhone/*");

}

if(-d "./CMD"){
    system("/bin/cp -rp ./CMD/* $inst_dir/cmd/");
    system("chown -R iseadmin.iseadmin $inst_dir/cmd");
    system("chmod 550 $inst_dir/cmd");
    system("chmod 550 $inst_dir/cmd/*");
    system("chown iseadmin.iseadmin $inst_dir/cmd/scripts/*");
    system("chmod 555 $inst_dir/cmd/scripts/*");
    system("chmod 500 $inst_dir/cmd/scripts/sudo");
}

if(-d "./JAVA"){
    if (!-d "$inst_dir/java") {
        system("mkdir -p $inst_dir/java");
        system("chown iseadmin.iseadmin $inst_dir/java");
        system("chmod 750 $inst_dir/java");
    }
    system("/bin/cp -rp ./JAVA/* $inst_dir/java");
    system("chown -R iseadmin.iseadmin $inst_dir/java/*");
}

if(-d "./SYS_BIN"){
	system("/bin/cp -rp ./SYS_BIN/* $inst_dir/system/bin");
	system("chown iseadmin.iseadmin $inst_dir/system/bin/*");
	system("chmod 755 $inst_dir/system/bin/*");
}

# APPサーバにインストールする場合、共有ファイル類はコピーしない。
if(-d "./BIN" && $server_type ne 'app'){
    system("/bin/chmod 750 ./BIN/*");
    system("/bin/cp -p ./BIN/* $inst_dir/bin >/dev/null 2>&1");
    if(-d "./BIN/$perl_rpm"){
	system("/bin/cp -p ./BIN/$perl_rpm/* $inst_dir/bin");
    }
    system("chown -R iseadmin.iseadmin $inst_dir/bin/*");
    system("chmod -R 750 $inst_dir/bin/*");
=pod cl_liu 090202 
	if(-d "./BIN/$perl_rpm"){
		system("/bin/cp -p ./BIN/$perl_rpm/* $inst_dir/bin");
	}
=cut
}

if(-d "./TMPL" && $server_type ne 'app'){
	system("/bin/cp -p ./TMPL/* $inst_dir/insuite/html/template");
	system("/bin/chown iseadmin.iseadmin $inst_dir/insuite/html/template/*");
	system("/bin/chmod 640 $inst_dir/insuite/html/template/*.tmpl");
}

if(-d "./DATA_SQL" && $server_type ne 'app'){
	#  V3.0.2用処理 START #
	opendir DATA_SQL, "./DATA_SQL";
	while (my $file = readdir DATA_SQL) {
		if ($file=~/\.sql$/) {
			system("/bin/cp -p ./DATA_SQL/*.sql $inst_dir/data/sql");
			system("/bin/chown iseadmin.iseadmin $inst_dir/data/sql/*.sql");
			system("/bin/chmod 640 $inst_dir/data/sql/*.sql"); 
			last;
		}
	}
	# V3.0.2用処理 END #

	if(-d "./DATA_SQL/mysql"){
		unless( -d "$inst_dir/data/sql/mysql"){
			mkdir("$inst_dir/data/sql/mysql");
			system("/bin/chown iseadmin.iseadmin $inst_dir/data/sql/mysql");
			system("/bin/chmod 770 $inst_dir/data/sql/mysql");
		}
		system("/bin/cp -p ./DATA_SQL/mysql/*.sql $inst_dir/data/sql/mysql");
		system("/bin/chown iseadmin.iseadmin $inst_dir/data/sql/mysql/*.sql");
		system("/bin/chmod 640 $inst_dir/data/sql/mysql/*.sql");
	}
	if(-d "./DATA_SQL/UTF-8"){
                system("/bin/cp -p ./DATA_SQL/UTF-8/*.sql $inst_dir/data/sql/UTF-8");
                system("/bin/chown iseadmin.iseadmin $inst_dir/data/sql/UTF-8/*.sql");
                system("/bin/chmod 640 $inst_dir/data/sql/UTF-8/*.sql");
        }
}

if(-d "./BATCH" && $server_type ne 'app') {
	my $ver	= $patch_ver;
	   $ver	=~s/\.//g;
	my $rdir= "$inst_dir/data/batch";
	my $vdir= "$rdir/$ver";

	system("/bin/cp -pr ./BATCH/* $rdir");
	system("/bin/chown -R root:iseadmin $rdir/*");
	system("/bin/chmod 750 $rdir/batch_app.pl");
	system("/bin/chmod 700 $vdir/batch_proc.pl");
	system("/bin/chmod 750 $vdir/batch_app.pl");
}

if(-d "./MSG/en"){
    system("chown iseadmin.iseadmin ./MSG/en/*");
    system("chmod 644 ./MSG/en/*");
    system("/bin/cp -p ./MSG/en/* $inst_dir/data/messages/en/");
}
if(-d "./MSG/ja"){
    system("chown iseadmin.iseadmin ./MSG/ja/*");
    system("chmod 644 ./MSG/ja/*");
    system("/bin/cp -p ./MSG/ja/* $inst_dir/data/messages/ja/");
}
if(-d "./MSG/UTF-8/en" && "$inst_dir/data/messages/UTF-8/en"){
    system("chown iseadmin.iseadmin ./MSG/UTF-8/en/*");
    system("chmod 644 ./MSG/UTF-8/en/*");
    system("/bin/cp -p ./MSG/UTF-8/en/* $inst_dir/data/messages/UTF-8/en/");
}
if(-d "./MSG/UTF-8/zh" && "$inst_dir/data/messages/UTF-8/zh"){
    system("chown iseadmin.iseadmin ./MSG/UTF-8/zh/*");
    system("chmod 644 ./MSG/UTF-8/zh/*");
    system("/bin/cp -p ./MSG/UTF-8/zh/* $inst_dir/data/messages/UTF-8/zh/");
}
if(-d "./TMPL"){
	system("/bin/cp -p ./TMPL/* $inst_dir/insuite/html/template");
	system("/bin/chown iseadmin.iseadmin $inst_dir/insuite/html/template/*.tmpl");
	system("/bin/chmod 640 $inst_dir/insuite/html/template/*.tmpl");
}

if(-d "./TOOLS"){
    if (!-d "$inst_dir/tools") {
        system("mkdir -p $inst_dir/tools");
        system("chown iseadmin.iseadmin $inst_dir/tools");
        system("chmod 550 $inst_dir/tools");
    }
    system("/bin/cp -pr ./TOOLS/* $inst_dir/tools");
    system("chown -R iseadmin.iseadmin $inst_dir/tools/*");
}

############################################################################
if (-d "./DUI") {
	if (!-d "$inst_dir/insuite/dui") {
    	system("mkdir -p $inst_dir/insuite/dui");
    	system("chown iseadmin.iseadmin $inst_dir/insuite/dui");
    	system("chmod 755 $inst_dir/insuite/dui");
	}
	#system("cp -rp DUI/richtext $inst_dir/insuite/dui/.");
	#system("chown -R iseadmin.iseadmin $inst_dir/insuite/dui/richtext");
	#system("chmod -R 644 $inst_dir/insuite/dui/richtext/*");

        system("cp -rp DUI/* $inst_dir/insuite/dui/");
        system("chown -R iseadmin.iseadmin $inst_dir/insuite/dui/richtext");
        system("chmod -R 644 $inst_dir/insuite/dui/richtext/*");
        system("chown -R iseadmin.iseadmin $inst_dir/insuite/dui/ckeditor");
        system("chmod -R 644 $inst_dir/insuite/dui/ckeditor/*");

	my $dir=`pwd`;
	system("cd $inst_dir/insuite/dui; find ./ -type d -exec chmod ugo+x {} \\;");
	system("cd $dir");
}
# <<==================================================================

system("perl ./upgrade_proc.pl");

system("/etc/rc.d/init.d/gimp stop /dev/null 2>&1");
system("/etc/rc.d/init.d/gimp start /dev/null 2>&1");

&time_stamp($patch_ver,"$inst_dir/logs/patch/patch_history.dat",'finished');

exit;

sub time_stamp{
    my($patch_ver,$file,$mode)=@_;
    my @time = localtime;
    my $yy=1900+int($time[5]); my $mm=int($time[4]+1); my $dd=int($time[3]);
    my $hh=int($time[2]); my $mi=int($time[1]); my $ss=int($time[0]);
    my $date=sprintf("%04d/%02d/%02d-%02d:%02d:%02d",$yy,$mm,$dd,$hh,$mi,$ss);
#    use Net::Domain qw(hostname domainname hostdomain);
#    my $domain = domainname();
    open(OUT,">>$file");
    print OUT "$date - Patch V$patch_ver install $mode\.\n";
    close(OUT);
}

sub check_ver{
	my ($last_ver,$patch_ver) = @_;
	my ($v1,$v2,$v3,$v4) = split(/\./,$last_ver);
	if($v4!~/^\d+$/){$v4=0;}
	my $check_version = sprintf("%02d%02d%02d%02d",$v1,$v2,$v3,$v4);
	my $bug_ver=0;
	($v1,$v2,$v3,$v4)  = split(/\./,$patch_ver);
	if($v4!~/^\d+$/){$v4=0;}
	if($v4){$bug_ver=1;}
	my $now_ver;

	open(IN,"$DA::Vars::p->{perllib_dir}/DA/IsVersion.pm");
	while(my $line = <IN>){
		chomp($line);
		if (!$line){next;}
		if ($line=~/^\#/){next;}
		my ($key,$val) = split(/\=/,$line,2);
		if ($key =~ /IsVersion::Version/){
			$val=~s/(\'|\;)//g;
			$now_ver = $val;
			($v1,$v2,$v3,$v4)  = split(/\./,$val);
			if($v4!~/^\d+$/){$v4=0;}
			last;
		}
	}
	close(IN);
	my $is_ver = sprintf("%02d%02d%02d%02d",$v1,$v2,$v3,$v4);
	if($bug_ver && !$v4 && $check_version ne $is_ver){
		print ("V".$now_ver." 環境に V".$patch_ver." モジュールは適用できません。\nV".$patch_ver." モジュールは V".$last_ver." 環境に対し適用が可能です。\n");
		exit;
	}
	if ($check_version gt $is_ver) {
		print ("先にV".$last_ver."のパッチを適用してください。\n");
		exit;
	}
}

# 組織世代関連の制限チェック
sub check_generation {
	
	my ($session,$ver) = @_;
	
	my $active_msid   = Patch::get_active_msid_fromdb($session);
	my $chk_tbl_name  = DA::MasterManager::gen_tbl_name("is_external_member", $active_msid);
	
	# is_external_member が世代化されておらず、なおかつ 未来世代が存在する場合はパッチ適用不可
	if ( ! Patch::check_exist_table($session ,$chk_tbl_name, "int_mid") && DA::MasterManager::exists_before_active($session) ) {
		$session->{dbh}->disconnect();
		die("未来(作業中),未来(確定)世代が存在する場合は、$ver のパッチは適用できません。該当世代を削除してから再度実行してください。");
	}
	$session->{dbh}->disconnect();
	
}

1;
