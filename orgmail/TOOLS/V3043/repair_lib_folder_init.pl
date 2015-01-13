#!/usr/local/bin/perl
BEGIN {
        use DA::Init;
        use Getopt::Long;
}
use strict;

my $session={};
DA::Session::db_open($session);

################################################################################
## 機能別の処理
################################################################################
##
## 機能番号 : V3.4.3.0_031


# 古い分類フォルダについてフォルダの登録時の権限設定カラムの初期値を挿入

# mode = 1; # すべてのフォルダをルートから引き継ぐ
# mode = 2; # init_access/init_permitがブランクの場合のみ引き継ぐ
my $mode = $ARGV[0];

if ($mode !~ /^[1|2]$/ ) {
	print "引数に1か2を指定してください\n";
	print "mode = 1; # すべてのフォルダをルートから引き継ぐ\n";
	print "mode = 2; # init_access/init_permitがブランクの場合のみ引き継ぐ\n";
}

my $log_file = $DA::Vars::p->{log_dir} . "/alert/repair_lib_folder_init." . DA::CGIdef::get_date("Y4MMDDHHMISS");

&_log ("repair_lib_folder_init start", $log_file);
&_log ("mode: [$mode]", $log_file);

DA::Session::trans_init($session);
my $gid_count=0;
my $bid_count=0;
eval {
	my $roots ={};
	my $permit={};
	my $sql;
	if ($mode == 1) {
		$sql="SELECT DISTINCT gid FROM is_lib_folder WHERE style=3";
	} else {
		$sql="SELECT gid,bid,init_access,init_permit,style FROM is_lib_folder WHERE init_access IS NULL OR init_permit IS NULL";
	}
	my $sth=$session->{dbh}->prepare($sql); $sth->execute();
	while (my $data=$sth->fetchrow_hashref('NAME_lc')) {
		my $gid = $data->{gid};
		if (!$roots->{$gid}) {
			$gid_count++;
			&_log ("check gid: [$gid]", $log_file) if ($mode == 1);
			$roots->{$gid}={};
			$roots->{$gid}=DA::Lib::get_root_access($session,$gid,$roots->{$gid});
			if (!$roots->{$gid}->{init_access}) {
				$roots->{$gid}->{init_access} = "group";
			}
			if (!$roots->{$gid}->{init_permit}) {
				$roots->{$gid}->{init_permit} = "group";
			}
		}
		next if ($mode == 1);
		my $bid = $data->{bid};
		$bid_count++;
		&_log ("check bid: [$bid]", $log_file);
		next if ($data->{init_access} && $data->{init_permit});
		my $lib_conf = DA::IS::get_sys_custom($session, "library");
		if ($data->{init_access}) {
			$permit->{$bid}->{init_access}=$data->{init_access};
		} elsif ($data->{style} ne 3 && $lib_conf->{file_access}) {
			$permit->{$bid}->{init_access}=$lib_conf->{file_access};
		} elsif ($roots->{$gid}->{init_access}) {
			$permit->{$bid}->{init_access}=$roots->{$gid}->{init_access};
		} else {
			$permit->{$bid}->{init_access}="group";
		}
		if ($data->{init_permit}) {
			$permit->{$bid}->{init_permit}=$data->{init_permit};
		} elsif ($data->{style} ne 3 && $lib_conf->{file_permit}) {
			$permit->{$bid}->{init_permit}=$lib_conf->{file_permit};
		} elsif ($roots->{$gid}->{init_permit}) {
			$permit->{$bid}->{init_permit}=$roots->{$gid}->{init_permit};
		} else {
			$permit->{$bid}->{init_permit}="group";
		}
	}
	$sth->finish;

	my $total;
	if ($mode == 1) {
		$total = $gid_count;
		$gid_count = 0;
	} else {
		$total = $bid_count;
		$bid_count = 0;
	}

	if ($mode == 1) {
		my $u_sql="UPDATE is_lib_folder SET init_access=?,init_permit=? WHERE gid=? AND style=3";
		my $u_sth=$session->{dbh}->prepare($u_sql);
		foreach my $gid (keys %{$roots}) {
			$u_sth->bind_param(1,$roots->{$gid}->{init_access},1);
			$u_sth->bind_param(2,$roots->{$gid}->{init_permit},1);
			$u_sth->bind_param(3,$gid,3);
			$u_sth->execute();
			$gid_count++;
			&_log ("update gid: [$gid] ($gid_count/$total)", $log_file);
		}
		$u_sth->finish();
	} else {
		my $u_sql="UPDATE is_lib_folder SET init_access=?,init_permit=? WHERE bid=?";
		my $u_sth=$session->{dbh}->prepare($u_sql);
		foreach my $bid (keys %{$permit}) {
			$u_sth->bind_param(1,$permit->{$bid}->{init_access},1);
			$u_sth->bind_param(2,$permit->{$bid}->{init_permit},1);
			$u_sth->bind_param(3,$bid,3);
			$u_sth->execute();
			$bid_count++;
			&_log ("update bid: [$bid] ($bid_count/$total)", $log_file);
		}
		$u_sth->finish();
	}
	if (!$total) {
		&_log ("no need repair", $log_file);
	}
};
if (!DA::Session::exception($session)) {
	DA::Error::system_error($session);
}
&_log ("repair_lib_folder_init finish", $log_file);
$session->{dbh}->disconnect;

exit 1;

sub _log {
my ($msg, $log_file) = @_;
print "$msg\n";
if (DA::System::file_open(\*LOG, ">>$log_file")) {
	print LOG "$msg\n";
	close(LOG);
}
}

1;
