package DA::Ns;
###################################################
##  INSUITE(R)Enterprise Version 1.5.0.          ##
##  Copyright(C)2003 DreamArts Corporation.      ##
##  All rights to INSUITE routines reserved.     ##
###################################################
use strict;
use DA::Init();
use DA::NsView;
use DA::Gettext;
use Storable;

$DA::Ns::keys=[
	( 'o_target1','o_target2','o_target3',
      'n_target1','n_target2','n_target3',
      'c_target','p_target','e_target')
];

# タイトルのみ 300 にしてあるのは歴史的経緯
$DA::Ns::elements={
    'ns_board'      =>  {
        'title'     =>  {   'name'      => N_('タイトル'),
                            'length'    => 300,
                            'byte'      => 1024  },
        'link_text' =>  {   'name'      => N_('リンクＵＲＬ'),
                            'length'    => 128,
                            'byte'      => 512  },
        'memo'      =>  {   'name'      => N_('内容'),
                            'check'     => 'B',
                            'length'    => 2048,
                            'byte'      => 4000 }
    },
    'ns_folder'     =>  {
        'title'     =>  {   'name'      => N_('タイトル'),
                            'length'    => 250,
                            'byte'      => 1000  },
    },
    'ns_form'       =>  {
        'title'     =>  {   'name'      => N_('タイトル'),
                            'length'    => 250,
                            'byte'      => 1000  },
    },
    'ns_form_data'   =>  {
        'store_name' =>  {   'name'      => N_('タイトル'),
                            'length'    => 250,
                            'byte'      => 1000  },
        'store_data' =>  {   'name'      => N_('内容'),
                            'check'     => 'B',
                            'length'    => 2048,
                            'byte'      => 4000 }
    },
    'ns_form_group' =>  {
        'title'     =>  {   'name'      => N_('タイトル'),
                            'length'    => 250,
                            'byte'      => 1000  },
        'memo'      =>  {   'name'      => N_('メモ'),
                            'check'     => 'B',
                            'length'    => 2048,
                            'byte'      => 4000 }
    },
    'ns_form_line'  =>  {
        'title'     =>  {   'name'      => N_('タイトル'),
                            'length'    => 250,
                            'byte'      => 1000  },
    },
};

sub get_board_data {
    my ($session,$num,$tz_mode)=@_;
	# tz_mode:1   時間系データを $session->{timezone} に変換
    my $sql="SELECT * FROM ns_board WHERE num=?";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,int($num),3); $sth->execute();
    my ($data)=$sth->fetchrow_hashref('NAME_lc'); $sth->finish();
    foreach my $key (keys %{$data}) { $data->{$key}=~s/\s+$//; }

    # for timezone ----
	if ($tz_mode && $session->{timezone} &&
        $session->{timezone} ne $DA::Vars::p->{timezone}) {

        # start_date,close_date,dead_date の３つはフォーマット長が違うので注意
        # 日付と時間の間はハイフンではなくスペース
        if ($data->{create_date}) {
            $data->{create_date}=DA::CGIdef::convert_date($session,$data->{create_date});
            $data->{create_date}=~s/\-/ /;
        }
        if ($data->{update_date}) {
            $data->{update_date}=DA::CGIdef::convert_date($session,$data->{update_date});
            $data->{update_date}=~s/\-/ /;
        }
        if ($data->{check_date}) {
            $data->{check_date}=DA::CGIdef::convert_date($session,$data->{check_date});
            $data->{check_date}=~s/\-/ /;
        }
        if ($data->{start_date}) {
            $data->{start_date}=DA::CGIdef::convert_date($session,$data->{start_date});
            $data->{start_date}=substr($data->{start_date},0,16);
            $data->{start_date}=~s/\-/ /;
        }
        if ($data->{close_date}) {
            $data->{close_date}=DA::CGIdef::convert_date($session,$data->{close_date});
            $data->{close_date}=substr($data->{close_date},0,16);
            $data->{close_date}=~s/\-/ /;
        }
        if ($data->{dead_date}) {
            $data->{dead_date}=DA::CGIdef::convert_date($session,$data->{dead_date});
            $data->{dead_date}=substr($data->{dead_date},0,16);
            $data->{dead_date}=~s/\-/ /;
        }
    }
    #----

    ($data->{s_yy},$data->{s_mm},$data->{s_dd},$data->{s_hh})=
        split(/[\/\-\:\s]/,$data->{start_date},4);
    ($data->{e_yy},$data->{e_mm},$data->{e_dd},$data->{e_hh})=
        split(/[\/\-\:\s]/,$data->{close_date},4);
    ($data->{d_yy},$data->{d_mm},$data->{d_dd},$data->{d_hh})=
        split(/[\/\-\:\s]/,$data->{dead_date},4);
    return ($data);
}

sub delete_board_data {
    my ($session,$num,$data)=@_;
	# 連絡事項データの削除
    DA::Session::trans_init($session);
    eval {
        # 本人または管理ユーザのみ削除可能
        my $s_sql="SELECT create_mid FROM ns_board WHERE num=?";
        my $s_sth=$session->{dbh}->prepare($s_sql);
           $s_sth->bind_param(1,int($num),3); $s_sth->execute();
        my $create_mid=$s_sth->fetchrow; $s_sth->finish;

        my $sql="DELETE FROM ns_board WHERE num=?";
        my $sth=$session->{dbh}->prepare($sql); 
		   $sth->bind_param(1,int($num),3); $sth->execute();

		# 月別テーブルの削除
		if ($data->{num} && !$data->{admin}) {
        	my @target_table=DA::Ns::get_target_table($session,
					$data->{start_date},$data->{close_date},1);
			foreach my $table_name (@target_table) {
    			my $tables=DA::DB::get_db_tables($session,$table_name);
    			if (!$tables->{$table_name}) { next; }
        		my $sql="DELETE FROM $table_name WHERE num=?";
        		my $sth=$session->{dbh}->prepare($sql); 
				   $sth->bind_param(1,int($num),3); $sth->execute();
			}
		}

        # 既読データの削除
		DA::Ns::clear_read($session,$num);

        # 添付ファイルデータの削除
        $sql="DELETE FROM ns_board_contents WHERE num=?";
        $sth=$session->{dbh}->prepare($sql); 
		$sth->bind_param(1,int($num),3); $sth->execute();
        my $d_num=DA::CGIdef::get_last_n($num,2);
        my $d_dir="$DA::Vars::p->{data_dir}/ns_board/$d_num/$num";
        DA::System::filepath_rmtree($d_dir);

		# カテゴリテーブルの削除
        $sql="DELETE FROM ns_board_category WHERE num=?";
        $sth=$session->{dbh}->prepare($sql); 
		$sth->bind_param(1,int($num),3); $sth->execute();

		# 権限テーブルの削除
        $sql="DELETE FROM ns_board_o_target WHERE num=?";
        $sth=$session->{dbh}->prepare($sql); 
		$sth->bind_param(1,int($num),3); $sth->execute();

        # リッチテキスト関連のディレクトリを削除
        my $r_dir="$DA::Vars::p->{base_dir}/insuite/ns_board/$d_num/$num";
        File::Path::rmtree($r_dir);
    };
    if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }

    # 検索インデックスの削除
    DA::NsView::delete_index($session,$data);

	DA::Custom::delete_nsboard($session, $data);
}

sub get_form_data {
    my ($session,$form_id,$tz_mode)=@_;
    my $sql="SELECT * FROM ns_form WHERE form_id=?";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,int($form_id),3); $sth->execute();
    my ($data)=$sth->fetchrow_hashref('NAME_lc'); $sth->finish();
    foreach my $key (keys %{$data}) { $data->{$key}=~s/\s+$//; }

    # for timezone ----
    if ($tz_mode && $session->{timezone}) {
        $data->{create_date}=DA::CGIdef::convert_date($session,$data->{create_date});
        $data->{update_date}=DA::CGIdef::convert_date($session,$data->{update_date});
        $data->{check_date}=DA::CGIdef::convert_date($session,$data->{check_date});

        my $start=$data->{start_date}."-".$data->{start_time}.":00";
        my $close=$data->{close_date}."-".$data->{close_time}.":00";
        $start=DA::CGIdef::convert_date($session,$start);
        $close=DA::CGIdef::convert_date($session,$close);
        my ($s_time,$c_time);
        ($data->{start_date}, $s_time) = split(/-/, $start);
        ($data->{close_date}, $c_time) = split(/-/, $close);
        $data->{start_time}=substr($s_time,0,2);
        $data->{close_time}=substr($c_time,0,2);
    }
    #----

    ($data->{s_yy},$data->{s_mm},$data->{s_dd},$data->{s_hh})
		=split(/[\/\-\:\s]/,$data->{start_date});
    ($data->{e_yy},$data->{e_mm},$data->{e_dd},$data->{e_hh})
		=split(/[\/\-\:\s]/,$data->{close_date});
    return ($data);
}

sub get_folder_data {
    my ($session,$folder_id)=@_;
    my $sql="SELECT * FROM ns_folder WHERE folder_id=?";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,int($folder_id),3); $sth->execute();
    my ($data)=$sth->fetchrow_hashref('NAME_lc'); $sth->finish();
    foreach my $key (keys %{$data}) { $data->{$key}=~s/\s+$//; }
    return ($data);
}

sub get_line_data {
    my ($session,$line_id)=@_;
    my $sql="SELECT * FROM ns_form_line WHERE line_id=?";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,int($line_id),3); $sth->execute();
    my ($data)=$sth->fetchrow_hashref('NAME_lc'); $sth->finish();
    foreach my $key (keys %{$data}) { $data->{$key}=~s/\s+$//; }
    return ($data);
}

sub get_read_data {
	my ($session,$num,$ns_conf)=@_;
	my $table='ns_board_read_'.DA::CGIdef::get_last_n($num,2);
	my $sql="SELECT num,mid,read_date,hidden,mark,label FROM $table WHERE num=? AND mid=?";
	my $sth=$session->{dbh}->prepare($sql); 
	   $sth->bind_param(1,int($num),3);
	   $sth->bind_param(2,$session->{user},3);
	   $sth->execute();
	my $read=$sth->fetchrow_hashref('NAME_lc');
       $read->{label} =~ s/(\d)/label$1/g; 
	   $read->{m_num}=$read->{num};

	# ユーザ毎のマーク設定が許可されていない場合、プライマリグループの
	# マーク設定を取得する
	if ($ns_conf->{user_mark} eq 'off') {
		$sth->bind_param(1,int($num),3);
		$sth->bind_param(2,$session->{primary},3);
		$sth->execute();
		my $primary=$sth->fetchrow_hashref('NAME_lc');
		$read->{mark} =$primary->{mark};
		$read->{m_num}=$primary->{num};
	}
	$sth->finish();

	return ($read);
}

sub put_mark_data {
	my ($session,$num,$ns_conf)=@_;
	my $mark;
    DA::Session::trans_init($session);
    eval {
		my $mid=($ns_conf->{user_mark} eq 'on') ? $session->{user} : $session->{primary};

        my $r_table='ns_board_read_'.DA::CGIdef::get_last_n($num,2);
		my $rs_sql="SELECT num,mark FROM $r_table WHERE num=? AND mid=?";
        my $rs_sth=$session->{dbh}->prepare($rs_sql);
           $rs_sth->bind_param(1,int($num),3);
           $rs_sth->bind_param(2,int($mid),3);
           $rs_sth->execute();
		my $r_mark_data=$rs_sth->fetchrow_hashref('NAME_lc'); $rs_sth->finish;
        $mark=($r_mark_data->{mark}) ? 0 : 1;

        if (!$r_mark_data->{num}) {
            my $ri_sql="INSERT INTO $r_table (num,mid,mark) VALUES (?,?,?)";
            my $ri_sth=$session->{dbh}->prepare($ri_sql);
               $ri_sth->bind_param(1,int($num),3);
               $ri_sth->bind_param(2,int($mid),3);
               $ri_sth->bind_param(3,int($mark),3);
               $ri_sth->execute();
        } else {
            my $ru_sql="UPDATE $r_table SET mark=? WHERE num=? AND mid=?";
            my $ru_sth=$session->{dbh}->prepare($ru_sql);
               $ru_sth->bind_param(1,int($mark),3);
               $ru_sth->bind_param(2,int($num),3);
               $ru_sth->bind_param(3,int($mid),3);
               $ru_sth->execute();
        }

        my $u_table='ns_user_read_' .DA::CGIdef::get_last_n($mid,2);
        my $us_sql="SELECT num,mark FROM $u_table WHERE num=? AND mid=?";
        my $us_sth=$session->{dbh}->prepare($us_sql);
           $us_sth->bind_param(1,int($num),3);
           $us_sth->bind_param(2,int($mid),3);
           $us_sth->execute();
        my $u_mark_data=$us_sth->fetchrow_hashref('NAME_lc'); $us_sth->finish;
        if (!$u_mark_data->{num}) {
            my $ui_sql="INSERT INTO $u_table (num,mid,mark) VALUES (?,?,?)";
            my $ui_sth=$session->{dbh}->prepare($ui_sql);
               $ui_sth->bind_param(1,int($num),3);
               $ui_sth->bind_param(2,int($mid),3);
               $ui_sth->bind_param(3,int($mark),3);
               $ui_sth->execute();
        } else {
            my $uu_sql="UPDATE $u_table SET mark=? WHERE num=? AND mid=?";
            my $uu_sth=$session->{dbh}->prepare($uu_sql);
               $uu_sth->bind_param(1,int($mark),3);
               $uu_sth->bind_param(2,int($num),3);
               $uu_sth->bind_param(3,int($mid),3);
               $uu_sth->execute();
        }
    };
    if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }
	return $mark;
}

sub is_form_valid {
	my ($session,$form,$join,$conf,$store_id)=@_;
	# 回答データの重複チェックをしない場合は $store_id に nocheck を入れる
	# if (!DA::Ns::is_target_user($session,$join,$form)) {
    # 	return(t_('回答対象ユーザではありません。'));
	# }
	if (!$form->{start_date} || !$form->{close_date}) {
		return(t_('回答期間が指定されていません。'));
	}
    if ($form->{start_date} ne
        DA::CGIdef::get_target_date($form->{start_date},0,"Y4/MM/DD")){
            return(t_('回答期間の開始日に誤りがあります。'));
    }
    if ($form->{close_date} ne
        DA::CGIdef::get_target_date($form->{close_date},0,"Y4/MM/DD")){
            return(t_('回答期間の終了日に誤りがあります。'));
    }
    my $today=DA::CGIdef::get_date('Y4MMDDHH');
       $form->{start_time}='00' if ($form->{start_time} eq '');
       $form->{close_time}='00' if ($form->{close_time} eq '');
    my ($s_hh,$c_hh);
    my ($s_yy,$s_mm,$s_dd)=split(/[\/-]/,$form->{start_date});
    my ($c_yy,$c_mm,$c_dd)=split(/[\/-]/,$form->{close_date});
    # 例）終了時間が 12:00 の場合は、11:59 までを有効と見なす。
    ($c_yy,$c_mm,$c_dd,$c_hh)=
        Date::Calc::Add_Delta_DHMS($c_yy,$c_mm,$c_dd,
        $form->{close_time},0,0,0,'-1',0,0);
    my $start_date=sprintf("%04d%02d%02d%02d",
        $s_yy,$s_mm,$s_dd,$form->{start_time});
    my $close_date=sprintf("%04d%02d%02d%02d",$c_yy,$c_mm,$c_dd,$c_hh);

	if ($start_date gt $today) {
    	return(t_('回答期間ではありません。'));
	}
	if ($close_date lt $today) {
    	return(t_('回答期間ではありません。'));
	}
	if ($form->{close_f}) {
    	return(t_('回答フォームがクローズされています。'));
	}
	if ($conf->{no_confirm_form} eq 'on' && $form->{c_target} eq '') {
		# 申請なしの回答フォームを許可する場合
	} elsif ($form->{status} ne 2) {
    	return(t_('回答フォームが確認されていません。'));
	}
	if ($form->{form_dup} eq 1) { return(0); }

    if (DA::Ns::get_store_count($session,$form,3,$store_id)) {
    	return(t_('既に回答されています。'));
    }
	return (0);
}


sub get_store_data {
    my ($session,$form,$store_id)=@_;
    my $table;
    if ($form->{form_type}) {
        $table="ns_form_ext_".DA::CGIdef::get_last_n($form->{form_id},2);
    } else {
        $table="ns_form_data_".DA::CGIdef::get_last_n($form->{form_id},2);
    }
        
    my $m_sql;
    my $gid=$session->{primary};
    if($form->{form_dup} eq 3){
       $m_sql="( (save_mode=3 AND gid=?) OR (mid=?) )";
    }else{
       $m_sql="mid=?";
	}
    my $sql="SELECT mid,gid,save_mode FROM $table "
     . "WHERE form_id=? AND store_id = ? AND $m_sql";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,int($form->{form_id}),3);
       $sth->bind_param(2,int($store_id),3);
    if($form->{form_dup} eq 3){
        $sth->bind_param(3,$session->{primary},3);
        $sth->bind_param(4,$session->{user},3);
    }else{
        $sth->bind_param(3,$session->{user},3);
    }
    $sth->execute();
    my $res = {};
    ($res->{mid},$res->{gid},$res->{save_mode})=$sth->fetchrow; $sth->finish;
    return $res;
}

sub get_store_count {
	my ($session,$form,$save_mode,$store_id)=@_;
	if ($store_id eq 'nocheck') { undef $store_id; }
    my $table;
	if ($form->{form_type}) {
    	$table="ns_form_ext_".DA::CGIdef::get_last_n($form->{form_id},2);
	} else {
    	$table="ns_form_data_".DA::CGIdef::get_last_n($form->{form_id},2);
	}
	my $id=($save_mode =~ /[23]/ && $form->{form_dup} eq 3) ? 'gid' : 'mid';
    my $sql="SELECT count(*) FROM $table "
	 . "WHERE form_id=? AND $id=? AND save_mode=? ";
	if ($store_id) { $sql.=" AND store_id != ?"; }
    my $sth=$session->{dbh}->prepare($sql); 
	   $sth->bind_param(1,int($form->{form_id}),3);
	# グループ回答か個人回答かの判別
	if ($save_mode =~ /[23]/ && $form->{form_dup} eq 3) {
		$sth->bind_param(2,$session->{primary},3);
	} else {
		$sth->bind_param(2,$session->{user},3);
	}
	$sth->bind_param(3,int($save_mode),3);
	if ($store_id) { $sth->bind_param(4,int($store_id),3); }
	$sth->execute();
    my $count=$sth->fetchrow; $sth->finish;
	return ($count);
}

sub check_duplicate {
	my ($session,$form)=@_;
	# form_dup=1 : 複数回答可能
	# form_dup=2 : 複数回答禁止
	# form_dup=3 : グループで１回答

	if ($form->{form_dup} eq 1) { return; }

    my $table;
	if ($form->{form_type}) {
    	$table="ns_form_ext_".DA::CGIdef::get_last_n($form->{form_id},2);
	} else {
    	$table="ns_form_data_".DA::CGIdef::get_last_n($form->{form_id},2);
	}

	my $id=($form->{form_dup} eq 3) ? 'gid' : 'mid';
    my $sql="SELECT count(*) FROM $table "
	 . "WHERE form_id=? AND $id=? AND save_mode IN (2,3) ";
    my $sth=$session->{dbh}->prepare($sql); 
	   $sth->bind_param(1,int($form->{form_id}),3);
	# グループ回答か個人回答かの判別
	if ($form->{form_dup} eq 3) {
		$sth->bind_param(2,$session->{primary},3);
	} else {
		$sth->bind_param(2,$session->{user},3);
	}
	$sth->execute();
    my $count=$sth->fetchrow; $sth->finish;
    if ($count) { return(t_('既に回答されています。')); }

	return;
}

sub get_store_name {
	my ($session,$form_id,$store_id)=@_;
	my $table="ns_form_data_".DA::CGIdef::get_last_n($form_id,2);
    my $sql="SELECT store_name FROM $table WHERE form_id=? AND store_id=? "
	 . "AND mid=? AND save_mode=?";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,int($form_id),3);
       $sth->bind_param(2,int($store_id),3);
       $sth->bind_param(3,$session->{user},3);
       $sth->bind_param(4,1,3);
       $sth->execute();
    my $store_name=$sth->fetchrow; $sth->finish;
	return ($store_name);
}

sub get_store_list {
    my ($session,$form,$save_mode)=@_;
    # save_mode = 0 : テストデータ
    # save_mode = 1 : 一時保存データ
    # save_mode = 2 : 確認待ちデータ
    # save_mode = 3 : 確認済みデータ
    # save_mode = 4 : 否認データ

    my $list={};
    my $id=($save_mode =~ /[234]/ && $form->{form_dup} eq 3) ? 'gid' : 'mid';
    my $table;
    if ($form->{form_type}) {
        $table="ns_form_ext_".DA::CGIdef::get_last_n($form->{form_id},2);
    } else {
        $table="ns_form_data_".DA::CGIdef::get_last_n($form->{form_id},2);
    }
	# 重複レコード(同じフォームのセル情報)を取り除くために DISTINCT を追加
    my $sql="SELECT DISTINCT store_id,store_name,store_date,mid FROM $table "
     . "WHERE form_id=? AND $id=? AND save_mode=? ORDER BY store_date";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,int($form->{form_id}),3);
    # グループ回答か個人回答かの判別
    if ($save_mode =~ /[234]/ && $form->{form_dup} eq 3) {
        $sth->bind_param(2,$session->{primary},3);
    } else {
        $sth->bind_param(2,$session->{user},3);
    }
    if ($save_mode eq 4) {
        $sth->bind_param(3,2,3);
    } else {
        $sth->bind_param(3,int($save_mode),3);
    }
    $sth->execute();

    my $a_sql="SELECT check_mid,check_date,status FROM ns_answer_check "
     . "WHERE form_id=? AND store_id=?";
    my $a_sth=$session->{dbh}->prepare($a_sql);

    my $names={};
    while (my ($store_id,$store_name,$store_date,$mid)=$sth->fetchrow) {

        $a_sth->bind_param(1,int($form->{form_id}),3);
        $a_sth->bind_param(2,int($store_id),3);
        $a_sth->execute();
        my ($check_mid,$check_date,$status)=$a_sth->fetchrow;

        if ($save_mode !~ /[14]/ && $status eq 3) { next; }
        if ($save_mode eq 4 && $status ne 3) { next; }

        # 編集不能な場合は read_only とする (一時保存データは編集可能)
        my $read_only;
        if ($mid eq $session->{user}) {
            $read_only=(!$form->{form_edit} && $status ne 3 && $save_mode ne 1) ? 1 : 0;
        }

        if ($save_mode ne 1) { $store_name=$store_date; }
        $store_name = ($store_name) ? $store_name : 'notitle';
        $list->{$store_id}="<a href=\"javascript:NsViewCard.AnswerWin('$form->{form_id}',"
            ."'$form->{form_type}','$store_id','$mid','$read_only');\">$store_name</a>";

        # グループ回答の場合は回答者も表示
        if ($save_mode =~ /[23]/) {
            if (!$names->{$mid}) {
                $names->{$mid}=DA::IS::get_ug_name($session,1,$mid)->{table};
            }
            $list->{$store_id}.="&nbsp;&nbsp;".t_('回答者').":".$names->{$mid};

        }
        if ($save_mode eq 3 && $check_mid) {
            my $v_name=DA::IS::get_ug_name($session,1,$check_mid);
            if (!$names->{$check_mid}) {
                $names->{$check_mid}=DA::IS::get_ug_name($session,1,$check_mid)->{table};
            }
            $list->{$store_id}.="&nbsp;&nbsp;".t_('確認者').":".$names->{$check_mid};
        } elsif ($save_mode eq 4) {
            if ($check_mid && $status eq 3) {
                if (!$names->{$check_mid}) {
                    $names->{$check_mid}=DA::IS::get_ug_name($session,1,$check_mid)->{table};
                }
                $list->{$store_id}.="&nbsp;&nbsp;".t_('否認者').":".$names->{$check_mid};
            }
        }
    }
    $sth->finish;
    $a_sth->finish;

    return ($list);
}

sub is_permit_user {
	# フォームの編集・削除権限
	my ($session,$join,$conf,$data)=@_;
	my $permit;
    # フォーム作成者は無条件で閲覧権限あり
    if ($data->{create_mid} eq $session->{user}) { return(1); }
    if (!$join) { $join=DA::IS::get_join_group($session,$session->{user},1); }
    $join->{$session->{user}}->{attr}='1';
    if ($data->{permit_user}) {
        foreach my $gid (split(/\,/,$data->{permit_user})) {
            if ($join->{$gid}->{attr} =~ /^[12UW]$/) { $permit=1; }
        }
    }
    # 管理者グループ
    if (!$permit && $conf->{admin_group}) {
        foreach my $gid (split /[\s\,]/, $conf->{admin_group}) {
            if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $permit=1; }
        }
    }
	return ($permit);
}

sub is_total_user {
    # フォームの集計権限
    my ($session,$join,$conf,$data)=@_;
    my $permit;
    # フォーム作成者は無条件で集計権限あり
    if ($data->{create_mid} eq $session->{user}) { return(1); }
    if (!$join) { $join=DA::IS::get_join_group($session,$session->{user},1); }
    $join->{$session->{user}}->{attr}='1';
    if ($data->{total_user}) {
        foreach my $gid (split(/\,/,$data->{total_user})) {
            if ($join->{$gid}->{attr} =~ /^[12UW]$/) { $permit=1; }
        }
    }
    # 管理者グループ
    if (!$permit && $conf->{admin_group}) {
        foreach my $gid (split /[\s\,]/, $conf->{admin_group}) {
            if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $permit=1; }
        }
    }
    return ($permit);
}

sub is_form_add_user {
	# フォームの追加権限ユーザ
	my ($session,$join,$conf,$data)=@_;
	my $permit;
	if ($conf->{use_form} eq 'off') {return(0);}

    if (!%$join) { $join=DA::IS::get_join_group($session,$session->{user},1); }
    $join->{$session->{user}}->{attr}='1';
    if ($data->{f_create_user}) {
        foreach my $gid (split(/\,/,$data->{f_create_user})) {
            if ($join->{$gid}->{attr} =~ /^[12UW]$/) { $permit=1; }
        }
    }
    # 管理者グループ
    if (!$permit && $conf->{admin_group}) {
        foreach my $gid (split /[\s\,]/, $conf->{admin_group}) {
            if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $permit=1; }
        }
    }
	return ($permit);
}
 
sub is_check_user {
	my ($session,$join,$data)=@_;
	# 連絡事項の承認ユーザ
	my $permit;
    if (!$join) { $join=DA::IS::get_join_group($session,$session->{user},1); }
    $join->{$session->{user}}->{attr}='1';
    if ($data->{c_target}) {
        foreach my $gid (split(/\,/,$data->{c_target})) {
            if ($join->{$gid}->{attr} =~ /^[12UW]$/) { $permit=1; }
        }
    }
	return ($permit);
}

sub is_owner_user {
	my ($session,$join,$owner_group)=@_;
	my $owner_permit;
	if (ref($owner_group->{USER}) ne 'HASH') {
		$owner_group=DA::IS::get_owner_group($session,$session->{user},0,'20');
	}
	foreach my $gid (keys %{$owner_group->{USER}}) {
		my ($no,$id,$type,$name)=split(/:/,$owner_group->{USER}->{$gid},20);
		if ($type eq 1) { $owner_permit=1; }
	}
	return ($owner_permit);
}

sub is_public_user {
	# 連絡事項の公開権限チェック
	my ($session,$join,$data,$ns_conf)=@_;
	my $public_permit=DA::Ns::is_update_user($session,$join,$data,$ns_conf);
	if (!$public_permit) {
		if ($ns_conf->{member_notice_open} eq 'on') {
            if ($data->{create_gid} eq $session->{primary}) { $public_permit=1; }
		}
	}
	return ($public_permit);
}
sub is_update_user {
	# 連絡事項の編集権限チェック
	my ($session,$join,$data,$ns_conf)=@_;
	my $update_permit;
    if ($data->{create_mid} eq $session->{user}) {
		$update_permit=1;
	}
	if (!$update_permit) {
    	my $admin_permit=DA::Ns::is_admin_user($session,$join,$ns_conf);
    	if ($ns_conf->{admin_notice_edit} eq 'on' && $admin_permit) { 
			$update_permit=1;
		}
	}
	if (!$update_permit) {
		if ($ns_conf->{member_notice_edit} eq 'on') {
            if ($data->{create_gid} eq $session->{primary}) { $update_permit=1; }
		}
	}

	DA::Custom::override_ns_is_update_user($session,$join,$data,$ns_conf,\$update_permit);

	return ($update_permit);
}

sub is_admin_user {
	my ($session,$join,$conf)=@_;
	# 管理ユーザ権限
	my $permit;
    if ($conf->{admin_group}) {
        foreach my $gid (split /[\s\,]/, $conf->{admin_group}) {
            if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $permit=1; }
        }
    }
	return ($permit);
}

sub is_necessary_user {
	my ($session,$join,$conf)=@_;
    if (!$conf->{necessary_group}) { return(0); }
    my $necessary_permit=0;
    foreach my $gid (split(/\,/,$conf->{necessary_group})) {
        if ($join->{$gid}->{attr}=~/[12UW]/) { $necessary_permit=1; }
    }
	return ($necessary_permit);
}

sub is_folder_user {
	my ($session,$join,$conf)=@_;
	# 回答フォームフォルダの追加・編集権限
	my $permit;
    if (!$permit && $conf->{admin_group}) {
        foreach my $gid (split /[\s\,]/, $conf->{admin_group}) {
            if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $permit=1; }
        }
    }
    if (!$permit && $conf->{folder_group}) {
        foreach my $gid (split /[\s\,]/, $conf->{folder_group}) {
            if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $permit=1; }
        }
    }
	return ($permit);
}

sub regist_permit {
    my ($session,$join,$conf)=@_;
    # 連絡事項の登録権限
    #       管理者グループ:       $permit->{admin}
    #       通常の連絡を設定可能: $permit->{normal}
    #       ポップアップ設定可能: $permit->{popup}
    #       回答連絡を設定可能:   $permit->{reply}
	my $permit={};
	$permit->{admin}=DA::Ns::is_admin_user($session,$join,$conf);
	if ($permit->{admin}) {
		$permit->{normal}=1;
        $permit->{popup} =1;
        $permit->{reply} =1;
	} else {
		my $send_permit = DA::NsView::get_send_permit($session,$conf);
		foreach my $gid (keys %{$send_permit}) {
    		if ($join->{$gid}->{attr} !~ /[12UW]/) { next; }
         	$permit->{popup}  =1 if ($send_permit->{$gid}->{popup});
         	$permit->{normal} =1 if ($send_permit->{$gid}->{normal});
         	$permit->{reply}  =1 if ($send_permit->{$gid}->{reply});
		}
	}
    # if ($conf->{primary_normal} eq 'on') { $permit->{normal}=1; }
    # if ($conf->{primary_popup} eq 'on')  { $permit->{popup} =1; }
    # if ($conf->{primary_reply} eq 'on')  { $permit->{reply} =1; }

	DA::Custom::override_ns_regist_permit($session,$join,$conf,$permit);

    return ($permit);
}

sub is_access_user {
	my ($session,$join,$conf,$data)=@_;
	# フォーム・連絡事項の閲覧権限
	my $permit;
    # フォーム・連絡事項の作成者は無条件で閲覧権限あり
    if ($data->{create_mid} eq $session->{user}) { return(1); }
    if (!$join) { $join=DA::IS::get_join_group($session,$session->{user},1); }
    $join->{$session->{user}}->{attr}='1';
    if ($data->{access_user}) {
        foreach my $gid (split(/\,/,$data->{access_user})) {
            if ($join->{$gid}->{attr} =~ /^[12UW]$/) { $permit=1; }
        }
    }
	# 発信部署の所属ユーザ(プライマリ・セカンダリ)は閲覧権限あり
	if (!$permit) {
		if ($join->{$data->{create_gid}}->{attr} =~ /[12]/) { $permit=1; }
	}
	if (!$permit) {
		$permit=DA::Ns::is_permit_user($session,$join,$conf,$data);
	}
	if (!$permit) {
		$permit=DA::Ns::is_check_user($session,$join,$data);
	}
	if (!$permit) {
		$permit=DA::Ns::is_total_user($session,$join,$conf,$data);
	}
	if (!$permit) {
		$permit=DA::Ns::is_target_user($session,$join,$data);
	}
	# 開示範囲に必ず含まれるグループに閲覧権限を付与
	if (!$permit) {
		$permit=DA::Ns::is_necessary_user($session,$join,$conf);
	}
    # 管理者グループ
    if (!$permit && $conf->{admin_group}) {
        foreach my $gid (split /[\s\,]/, $conf->{admin_group}) {
            if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $permit=1; }
        }
    }

	# カスタム項目の追加 (NHK)
	DA::Custom::override_ns_is_access_user($session,$join,$data,\$permit,$conf);

	return ($permit);
}

#　連絡通知のLuxor検索の権限チェック　V3.4.3
sub is_access_user_for_luxor {
	my ($session,$join,$conf,$data)=@_;
    if ($data->{create_mid} eq $session->{user}) { return 1; }
	if (DA::Ns::is_check_user($session,$join,$data)) { return 1; }
	if ($conf->{admin_notice_edit} eq "on") {
        foreach my $gid (split /[\s\,]/, $conf->{admin_group}) {
            if ($join->{$gid}->{attr} =~ /^[129UW]$/) { return 1; }
        }
    }
	if ($conf->{member_notice_edit} eq "on" && $join->{$data->{create_gid}}->{attr} =~ /[12]/) {
		return 1;
	}
	if ($conf->{no_term_view} eq "off") {
		my $today  = DA::CGIdef::get_date("Y4/MM/DD HH:MI");
		if ($data->{start_date} gt $today) {
			return 0;
		}
	}
	return	(DA::Ns::is_target_user($session,$join,$data) ||
			 DA::Ns::is_necessary_user($session,$join,$conf)) ? return 1 : return 0;
}

sub is_target_user {
	my ($session,$join,$row)=@_;
	# 対象範囲に含まれるユーザかどうかのチェック

	# 追加ユーザ
	$join->{$session->{user}}->{attr}=1;
	if ($row->{p_target}) {
    	foreach my $gid (split(/[\,\|]/, $row->{p_target})) {
        	if ($join->{$gid}->{attr} =~ /^[129UW]$/) { return(1); }
		}
	}

    # 公開組織
	my $permit;
	for (my $i=1; $i<4; $i++) {
		if ($permit) { next; }
		if ($row->{"o_target$i"}) {
    		foreach my $gid (split(/[\,\|]/, $row->{"o_target$i"})) {
        		if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $permit=1; }
    		}
		}
		if ($row->{"n_target$i"} && $permit) {
			my $check;
    		foreach my $gid (split(/[\,\|]/, $row->{"n_target$i"})) {
        		if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $check=1; }
    		}
			if (!$check) { $permit=0; }
		}
	}

	# 除外ユーザ
	if ($row->{e_target}) {
    	foreach my $gid (split(/[\,\|]/, $row->{e_target})) {
        	if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $permit=0; }
		}
	}

	# カスタム項目の追加 (NHK)
	DA::Custom::override_ns_is_target_user($session,$join,$row,\$permit);

	return ($permit);
}

sub folder_update_permit {
	# フォルダ編集権限
    my ($session,$folder,$join,$conf)=@_;
	# フォルダ作成者は無条件で編集権限あり
    if ($folder->{create_mid} eq $session->{user}) { return(1); }
    my $update_permit;
    if (!$join) { $join=DA::IS::get_join_group($session,$session->{user},1); }
    $join->{$session->{user}}->{attr}='1';
    if ($folder->{f_permit_user}) {
        foreach my $gid (split(/\,/,$folder->{f_permit_user})) {
            if ($join->{$gid}->{attr} =~ /^[12UW]$/) { $update_permit=1; }
        }
    }
    # 管理者グループ
    if (!$update_permit && $conf->{admin_group}) {
        foreach my $gid (split /[\s\,]/, $conf->{admin_group}) {
            if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $update_permit=1; }
        }
    }
    return ($update_permit);
}

sub folder_view_permit {
	# フォルダ閲覧権限
    my ($session,$folder,$join,$conf)=@_;
	# フォルダ作成者は無条件で閲覧権限あり
    if ($folder->{create_mid} eq $session->{user}) { return(1); }
    my $view_permit;
    if (!$join) { $join=DA::IS::get_join_group($session,$session->{user},1); }
    $join->{$session->{user}}->{attr}='1';
    if ($folder->{f_access_user}) {
        foreach my $gid (split(/\,/,$folder->{f_access_user})) {
            if ($join->{$gid}->{attr} =~ /^[12UW]$/) { $view_permit=1; }
        }
    }
	# フォルダ編集権限ユーザは参照権限も自動的に付加される
	if (!$view_permit) {
		$view_permit=
			DA::Ns::folder_update_permit($session,$folder,$join,$conf);
	}
    # 管理者グループ
    if (!$view_permit && $conf->{admin_group}) {
        foreach my $gid (split /[\s\,]/, $conf->{admin_group}) {
            if ($join->{$gid}->{attr} =~ /^[129UW]$/) { $view_permit=1; }
        }
    }
    return ($view_permit);
}

sub get_item_tag {
my ($session,$col,$data,$read_only)=@_;

if ($col->{color} eq '') { $col->{color}='000000'; }
if ($col->{bgcolor} eq '') { $col->{bgcolor}='FFFFFF'; }
if ($col->{size} eq '') { $col->{size}='12'; }
my $bold_tag="font-weight: bold;" if ($col->{bold});
my $italic_tag="font-style: italic;" if ($col->{italic});
my $under_tag="text-decoration: underline;" if ($col->{under});

my $style_tag="style='color:$col->{color};'";
my $size_tag ="style='font-size:$col->{size}px;$bold_tag$italic_tag$under_tag'";

my $refer_tag;
if ($col->{refer_check} eq 'on') {
	$refer_tag="<a href=\"javascript:referWin('$col->{object_id}');\">"
		.t_('参考')."</a>";
} elsif ($col->{refer_check} eq 'prev') {
	$refer_tag=t_('参考');
}

my $disable=($read_only) ? 'disabled' : '';

my $tag;
if ($col->{type} eq 1) { # 文字入力ボックス
	$tag="<table border=0 cellspacing=1 cellpadding=1 $style_tag><tr>";
	if ($col->{title_d} eq 'left') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td>";
	} elsif ($col->{title_d} eq 'top') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td></tr><tr>\n";
	}

	$tag.="<td nowrap>";
	if ($col->{unit_align} eq 'left') {
		$tag.="$col->{unit_text}";
	}

	$tag.="<input type=text name=\"$col->{cell_id}\" ";
	$tag.="size=\"$col->{text_size}\" ";
	if ($data->{$col->{cell_id}} ne '' 
		&& $data->{$col->{cell_id}} ne $col->{init_value}) {
		$tag.="value=\"$data->{$col->{cell_id}}\" $disable>\n";
	} else {
		$tag.="value=\"$col->{init_value}\" $disable>\n";
	}

	if ($col->{unit_align} eq 'right') {
		$tag.="$col->{unit_text}";
	}
	$tag.="$refer_tag</td>";

	if ($col->{comment} ne '') {
		if ($col->{comment_d} eq 'under') {
			if ($col->{title_d} eq 'left') {
				$tag.="</tr><tr><td nowrap $size_tag colspan=2>"
				."$col->{comment}</td>";
			} else {
				$tag.="</tr><tr><td nowrap $size_tag>$col->{comment}</td>";
			}
		} elsif ($col->{comment_d} eq 'right') {
			$tag.="<td nowrap $size_tag>$col->{comment}</td>";
		}
	}
	$tag.="</tr></table>";

} elsif ($col->{type} eq 2) { # 数値入力ボックス
	$tag="<table border=0 cellspacing=1 cellpadding=1 $style_tag><tr>";
	if ($col->{title_d} eq 'left') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td>";
	} elsif ($col->{title_d} eq 'top') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td></tr><tr>\n";
	}

	$tag.="<td nowrap>";
	if ($col->{unit_align} eq 'left') {
		$tag.="$col->{unit_text}";
	}

	$tag.="<input type=text name=\"$col->{cell_id}\" ";
	$tag.="size=\"$col->{text_size}\" style=\"ime-mode: disabled\" ";
	if ($data->{$col->{cell_id}} ne '' 
		&& $data->{$col->{cell_id}} ne $col->{init_value}) {
		$tag.="value=\"$data->{$col->{cell_id}}\" $disable>\n";
	} else {
		$tag.="value=\"$col->{init_value}\" $disable>\n";
	}

	if ($col->{unit_align} eq 'right') {
		$tag.="$col->{unit_text}";
	}
	$tag.="$refer_tag</td>";

	if ($col->{comment} ne '') {
		if ($col->{comment_d} eq 'under') {
			if ($col->{title_d} eq 'left') {
				$tag.="</tr><tr><td nowrap $size_tag colspan=2>"
				."$col->{comment}</td>";
			} else {
				$tag.="</tr><tr><td nowrap $size_tag>$col->{comment}</td>";
			}
		} elsif ($col->{comment_d} eq 'right') {
			$tag.="<td nowrap $size_tag>$col->{comment}</td>";
		}
	}
	$tag.="</tr></table>";

} elsif ($col->{type} eq 3) { # テキストエリア
	$tag="<table border=0 cellspacing=1 cellpadding=1 $style_tag><tr>";
	if ($col->{title_d} eq 'left') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td>\n";
	} elsif ($col->{title_d} eq 'top') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td></tr><tr>\n";
	}

	$tag.="<td nowrap>";
	$tag.="<textarea name=\"$col->{cell_id}\" ";
	$tag.=" wrap=\"$col->{area_wrap}\" ";
	$tag.="rows=\"$col->{area_rows}\" cols=\"$col->{area_cols}\" $disable>";
	if ($data->{$col->{cell_id}} ne '' 
		&& $data->{$col->{cell_id}} ne $col->{init_value}) {
		my $text=DA::CGIdef::decode($data->{$col->{cell_id}},1,0);
		$tag.="$text</textarea>";
	} else {
		$tag.="$col->{area_value}</textarea>";
	}
	$tag.="$refer_tag</td>\n";

	if ($col->{comment} ne '') {
		if ($col->{comment_d} eq 'under') {
			if ($col->{title_d} eq 'left') {
				$tag.="</tr><tr><td nowrap $size_tag colspan=2>"
				."$col->{comment}</td>";
			} else {
				$tag.="</tr><tr><td nowrap $size_tag>$col->{comment}</td>";
			}
		} elsif ($col->{comment_d} eq 'right') {
			$tag.="<td nowrap $size_tag>$col->{comment}</td>";
		}
	}
	$tag.="</tr></table>";

} elsif ($col->{type} eq 4) { # ラジオボタン
	if (!$col->{select_cols}) { $col->{select_cols}=3; }

	$tag="<table border=0 cellspacing=1 cellpadding=1 $style_tag><tr>";
	if ($col->{title_d} eq 'left') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td>\n";
	} elsif ($col->{title_d} eq 'top') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td></tr><tr>\n";
	}

	$tag.="<td><table border=0 cellspacing=1 cellpadding=1 $style_tag><tr>";
	my $i=1;
    foreach my $opt (@{$col->{options}}) {
		if ($i > $col->{select_cols}) {
			$tag.="</tr><tr>";
			$i=1;
		}
        $tag.="<td nowrap $size_tag>";
		$tag.="<input type=radio name=$col->{cell_id} "
		     ."value=\"$opt->{option_text}\"";
		if ($data->{$col->{cell_id}} ne '') {
			if ($data->{$col->{cell_id}} eq $opt->{option_text}) {
				$tag.=" checked"; 
			}
		} else {
			if ($col->{init_value} eq $opt->{option_text}) {
				$tag.=" checked"; 
			}
		}
        $tag.=" $disable>$opt->{option_text}</td>\n";
		$i++;
    }
	$tag=~s/<tr>$//i;
	$tag.="</table>$refer_tag</td>";

	if ($col->{comment} ne '') {
		if ($col->{comment_d} eq 'under') {
			if ($col->{title_d} eq 'left') {
				$tag.="</tr><tr><td nowrap $size_tag colspan=2>"
				."$col->{comment}</td>";
			} else {
				$tag.="</tr><tr><td nowrap $size_tag>$col->{comment}</td>";
			}
		} elsif ($col->{comment_d} eq 'right') {
			$tag.="<td nowrap $size_tag>$col->{comment}</td>";
		}
	}
	$tag.="</tr></table>";

} elsif ($col->{type} eq 5) { # チェックボックス
    if (!$col->{select_cols}) { $col->{select_cols}=3; }
	$tag="<table border=0 cellspacing=1 cellpadding=1 $style_tag><tr>";
	if ($col->{title_d} eq 'left') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td>\n";
	} elsif ($col->{title_d} eq 'top') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td></tr><tr>\n";
	}

	$tag.="<td nowrap>"
	."<table border=0 cellspacing=1 cellpadding=1 $style_tag><tr>";

	my $i=1;
    foreach my $opt (@{$col->{options}}) {
		if ($i > $col->{select_cols}) {
			$tag.="</tr><tr>";
			$i=1;
		}
		my $key="$col->{cell_id}\_$opt->{option_no}";
       	$tag.="<td nowrap $size_tag>";
		$tag.="<input type=checkbox name=\"$key\" "
		."value=\"$opt->{option_text}\"";
		if ($data->{$key} eq $opt->{option_text}) {
			$tag.=" checked"; 
		}
		if ($col->{hidden_check} eq 'on') { $opt->{option_text}=''; }
       	$tag.=" $disable>$opt->{option_text}</td>\n";
		$i++;
    }
	$tag=~s/<tr>$//i;
	$tag.="</table>$refer_tag</td>";

	if ($col->{comment} ne '') {
		if ($col->{comment_d} eq 'under') {
			if ($col->{title_d} eq 'left') {
				$tag.="</tr><tr><td nowrap $size_tag colspan=2>"
				."$col->{comment}</td>";
			} else {
				$tag.="</tr><tr><td nowrap $size_tag>$col->{comment}</td>";
			}
		} elsif ($col->{comment_d} eq 'right') {
			$tag.="<td nowrap $size_tag>$col->{comment}</td>";
		}
	}
	$tag.="</tr></table>";

} elsif ($col->{type} eq 6) { # 選択メニュー
	$tag="<table border=0 cellspacing=1 cellpadding=1 $style_tag><tr>";
	if ($col->{title_d} eq 'left') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td>\n";
	} elsif ($col->{title_d} eq 'top') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td></tr><tr>\n";
	}

	$tag.="<td nowrap>";

	my $i=0;
	$tag.="<select name=\"$col->{cell_id}\" $disable>\n";
    foreach my $opt (@{$col->{options}}) {
       	$tag.="<option value=\"$opt->{option_text}\"";
       	if ($data->{$col->{cell_id}} ne '') {
           	if ($data->{$col->{cell_id}} eq $opt->{option_text}) {
               	$tag.=" selected";
           	}
       	} else {
           	if ($col->{init_value} eq $opt->{option_text}) {
               	$tag.=" selected";
           	}
       	}
		# if ($i eq 0) { $tag.=" selected"; }
       	$tag.=">$opt->{option_text}</option>\n";
		$i++;
    }
	$tag.="</select>$refer_tag</td>";

	if ($col->{comment} ne '') {
		if ($col->{comment_d} eq 'under') {
			if ($col->{title_d} eq 'left') {
				$tag.="</tr><tr><td nowrap $size_tag colspan=2>"
				."$col->{comment}</td>";
			} else {
				$tag.="</tr><tr><td nowrap $size_tag>$col->{comment}</td>";
			}
		} elsif ($col->{comment_d} eq 'right') {
			$tag.="<td nowrap $size_tag>$col->{comment}</td>";
		}
	}
	$tag.="</tr></table>";

} elsif ($col->{type} eq 7) { # 日付選択
	$tag="<table border=0 cellspacing=1 cellpadding=1 $style_tag><tr>";
	if ($col->{title_d} eq 'left') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td>\n";
	} elsif ($col->{title_d} eq 'top') {
		$tag.="<td nowrap $size_tag>$col->{title}:</td></tr><tr>\n";
	}

	$tag.="<td nowrap $size_tag>";
	if ($col->{init_date} eq 1) {
		$col->{init_date_yy}=DA::CGIdef::get_date2($session,"Y4");
		$col->{init_date_mm}=DA::CGIdef::get_date2($session,"MM");
		$col->{init_date_dd}=DA::CGIdef::get_date2($session,"DD");
	}
	if ($data->{"$col->{cell_id}\_yy"} ne '' 
			&& $data->{"$col->{cell_id}\_yy"} ne $col->{init_date_yy}) {
		$col->{init_date_yy}=$data->{"$col->{cell_id}\_yy"};
	}
	if ($data->{"$col->{cell_id}\_mm"} ne '' 
			&& $data->{"$col->{cell_id}\_mm"} ne $col->{init_date_mm}) {
		$col->{init_date_mm}=$data->{"$col->{cell_id}\_mm"};
	}
	if ($data->{"$col->{cell_id}\_dd"} ne '' 
			&& $data->{"$col->{cell_id}\_dd"} ne $col->{init_date_dd}) {
		$col->{init_date_dd}=$data->{"$col->{cell_id}\_dd"};
	}

    my $sel_tag=DA::IS::get_date_select_tag($session,0,
        	$col->{init_date_yy},$col->{init_date_mm},$col->{init_date_dd},
        	"$col->{cell_id}\_yy","$col->{cell_id}\_mm","$col->{cell_id}\_dd");
	$sel_tag=~s/<select/<select $disable/g;
	$tag.="$sel_tag $refer_tag</td>";

	if ($col->{comment} ne '') {
		if ($col->{comment_d} eq 'under') {
			if ($col->{title_d} eq 'left') {
				$tag.="</tr><tr><td nowrap $size_tag colspan=2>"
				."$col->{comment}</td>";
			} else {
				$tag.="</tr><tr><td nowrap $size_tag>$col->{comment}</td>";
			}
		} elsif ($col->{comment_d} eq 'right') {
			$tag.="<td nowrap $size_tag>$col->{comment}</td>";
		}
	}
	$tag.="</tr></table>";

} elsif ($col->{type} eq 9) { # テキスト

	$tag="<table border=0 cellspacing=1 cellpadding=1 $style_tag><tr>";
	$tag.="<td nowrap $size_tag>";
	$col->{text}=~s/(?:\r\n|\r|\n)/<br>/g;
	$tag.=$col->{text};
	# $tag.=DA::CGIdef::decode($col->{text},1,0);
	$tag.="</td></tr></table>";

}

	if ($tag eq '') { $tag="&nbsp;"; }
    return ($tag);
}

sub get_library_link {
	my ($session,$bid,$docno,$num)=@_;
	my $file={};
	my $folder={};
	if ($bid) { $folder=DA::Lib::get_folder_data($session,$bid); }
	if ($docno) { $file=DA::Lib::get_file_data($session,$bid,$docno); }

	my $tag;
	if ($folder->{bid}) {
        $tag="<a href=$DA::Vars::p->{cgi_rdir}/lib_file_list.cgi?"
		."bid=$folder->{bid} target=_blank>$folder->{title}</a>";
	}
	if ($file->{docno}) {
		$tag.=" : " if ($tag);
        $tag.="<a href=\"javascript:NsDoc('$folder->{bid}','$file->{docno}',"
		."'view')\">$file->{title}</a>";
	}
	if ($tag && $num) {
		$tag.="<a href=$DA::Vars::p->{cgi_rdir}/ns_board_detail.cgi?"
		."num=$num&del_link=1><img src=$session->{img_rdir}/aqbtn_close_s.gif "
		."border=0 width=14 height=14 hspace=4 align=absmiddle></a>";
	}

	if ($tag eq '') { $tag="&nbsp;"; }
	return ($tag);
}

sub sql_quote_wrap{
    my($str,$table,$fld,$mode,$code)=@_;

    my $length=0;
    my $element=$DA::Ns::elements->{$table}->{$fld};
    if ($element) {
        if (DA::Unicode::internal_charset() eq 'UTF-8'){
            $length = $element->{byte};
        } else {
            $length = $element->{length};
        }
    }
    return DA::CGIdef::sql_quote($str,$length,$mode,$code);
}

sub input_length{
    my($str,$table,$fld,$element)=@_;

	# $element = チェック要素を直接渡す場合。
	#            {'name'   => フィールド名,
	#             'length' => LENGTH,
	#             'byte'   => BYTE  }

    my $error=0;
    if ($table && $fld) {
        $element=$DA::Ns::elements->{$table}->{$fld};
    }
    if (!$element) {
        return 0;
    }
    if (DA::Unicode::internal_charset() eq 'UTF-8'){
        if ($element->{check} ne 'B') {
            if (DA::Charset::num_of_chars($str,DA::Unicode::internal_charset())
                    > $element->{length}){
                $error=t_("%1は%2文字以内で入力してください。"
                            ,T_($element->{name}),$element->{length});
            }
        }
        if (!$error && $element->{byte} > 0 &&
            length($str) > $element->{byte}){
            $error=t_("%1は入力できる文字数を超えています。"
                            ,T_($element->{name}));
        }
    } else {
        if (length($str) > $element->{length}){
            my $han_length = int($element->{length}/2);
            $error=t_("%1は全角%2文字 (半角英数字%3文字) 以内で入力してください。"
            ,T_($element->{name}),$han_length,$element->{length});
        }
    }
    return $error;
}

sub get_target_tag {
my ($session,$board,$title)=@_;
my $tags={};
foreach my $key (@{$DA::Ns::keys}) {
	if ($board->{$key} eq '') { next; }
    my $user=DA::IS::get_access($session,$board->{$key});
    my $tag =DA::IS::get_view_user_sort($session,$user,1);
    if ($tag ne ''){
        $tags->{$key}="<TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>"
        	."$tag</TABLE>";
	}
}

my $ns_conf=DA::IS::get_sys_custom($session,'ns_board');
if ($ns_conf->{necessary_group}) {
    my $user=DA::IS::get_access($session,$ns_conf->{necessary_group});
    my $tag =DA::IS::get_view_user_sort($session,$user,1);
    if ($tag ne ''){
        $tags->{admin}="<TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>"
        	."$tag</TABLE>";
	}
}

my $title_tag;
if ($title) {
	$title_tag="<td width=10% align=right nowrap rowspan=6>"
		."@{[t_('開示範囲')]}:</td>";
}

my $table_tag=<<buf_end;
<table width=100% border=0 cellspacing=1 cellpadding=1 style="background:$DA::Vars::p->{base_color}">
<tr height=20 bgcolor=$DA::Vars::p->{title_color}>
$title_tag
<td width=30% align=center nowrap>@{[t_('範囲%1',1)]}</td>
<td width=30% align=center nowrap>@{[t_('範囲%1',2)]}</td>
<td width=30% align=center nowrap>@{[t_('範囲%1',3)]}</td>
</tr><tr height=20 bgcolor=#FFFFFF>
<td>$tags->{o_target1}</td>
<td>$tags->{o_target2}</td>
<td>$tags->{o_target3}</td>
</tr><tr height=20 bgcolor=$DA::Vars::p->{title_color}>
<td align=center nowrap>@{[t_('条件%1',1)]}</td>
<td align=center nowrap>@{[t_('条件%1',2)]}</td>
<td align=center nowrap>@{[t_('条件%1',3)]}</td>
</tr><tr height=20 bgcolor=#FFFFFF>
<td>$tags->{n_target1}</td>
<td>$tags->{n_target2}</td>
<td>$tags->{n_target3}</td>
</tr><tr height=20 bgcolor=$DA::Vars::p->{title_color}>
<td align=center nowrap>@{[t_('追加')]}</td>
<td align=center nowrap>@{[t_('除外')]}</td>
<td align=center nowrap>@{[t_('管理')]}</td>
</tr><tr height=20 bgcolor=#FFFFFF>
<td>$tags->{p_target}</td>
<td>$tags->{e_target}</td>
<td>$tags->{admin}</td>
</tr></table>
buf_end

DA::Custom::override_ns_board_target_tag($session,$board,\$table_tag);

return ($table_tag);

}

sub get_category_tag {
my ($session,$board,$title)=@_;

my $tag;
if ($board->{category} ne '') {
	my $category=DA::Ns::get_category_data($session);
	foreach my $cid (split(/[\,\|]/,$board->{category})) {
		if ($cid !~ /^\d+$/) { next; }
		my $name=$category->{$cid}->{category_name};
		if ($name eq '') { next; }
		$tag.=($tag) ? "<br>".$name : $name;
	}
}
my $title_tag;
if ($title ne '') {
	$title_tag="<td width=10% align=right nowrap "
		."bgcolor=$DA::Vars::p->{title_color}>@{[t_('カテゴリ')]}:</td>";
}
my $table_tag=<<buf_end;
<table width=100% border=0 cellspacing=1 cellpadding=1>
<tr height=20>
$title_tag
<td bgcolor=#FFFFFF>$tag</td>
</tr></table>
buf_end

return ($table_tag);

}

sub get_target_edit_tag {
my ($session,$target,$form,$error,$unnecessary)=@_;

my $tags={};
foreach my $key (@{$DA::Ns::keys}) {
    if ($target->{$key} eq '') { next; }
    my $tag =DA::IS::get_view_user_sort($session,$target->{$key},1,'',$key);
    if ($tag ne ''){
        $tags->{$key}="<TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>"
            ."$tag</TABLE>";
    }
}
my $ns_conf=DA::IS::get_sys_custom($session,'ns_board');
if ($ns_conf->{necessary_group}) {
    my $user=DA::IS::get_access($session,$ns_conf->{necessary_group});
    my $tag =DA::IS::get_view_user_sort($session,$user,1);
    if ($tag ne ''){
        $tags->{admin}="<TABLE BORDER=0 WIDTH=100% CELLSPACING=0 CELLPADDING=0>"
            ."$tag</TABLE>";
    }
}

my $title=($form) ? t_('回答対象') : t_('開示範囲');
my $red_star="<font color=red>(*)</font>" if (!$form && !$unnecessary);

my $tag=<<buf_end;
<tr bgcolor=$DA::Vars::p->{title_color}>
<td nowrap align=right width=15% rowspan=6>$red_star $title</td>
<td nowrap align=center width=30% colspan=2>@{[t_('範囲%1',1)]}</td>
<td nowrap align=center width=30% colspan=2>@{[t_('範囲%1',2)]}</td>
<td nowrap align=center width=30% colspan=2>@{[t_('範囲%1',3)]}</td>
</tr><tr bgcolor=#FFFFFF height=20>
<td nowrap valign=top width=25%>$tags->{o_target1}$error->{target}$error->{o_target1}</td>
<td nowrap align=center><input type=submit name=o_target1 value="@{[t_('設定')]}"></td>
<td nowrap valign=top width=25%>$tags->{o_target2}$error->{target}$error->{o_target2}</td>
<td nowrap align=center><input type=submit name=o_target2 value="@{[t_('設定')]}"></td>
<td nowrap valign=top width=25%>$tags->{o_target3}$error->{target}$error->{o_target3}</td>
<td nowrap align=center><input type=submit name=o_target3 value="@{[t_('設定')]}"></td>
</tr><tr bgcolor=$DA::Vars::p->{title_color}>
<td nowrap align=center width=30% colspan=2>@{[t_('条件%1',1)]}</td>
<td nowrap align=center width=30% colspan=2>@{[t_('条件%1',2)]}</td>
<td nowrap align=center width=30% colspan=2>@{[t_('条件%1',3)]}</td>
</tr><tr bgcolor=#FFFFFF height=20>
<td nowrap valign=top width=25%>$tags->{n_target1}$error->{n_target1}</td>
<td nowrap align=center><input type=submit name=n_target1 value="@{[t_('設定')]}"></td>
<td nowrap valign=top width=25%>$tags->{n_target2}$error->{n_target2}</td>
<td nowrap align=center><input type=submit name=n_target2 value="@{[t_('設定')]}"></td>
<td nowrap valign=top width=25%>$tags->{n_target3}$error->{n_target3}</td>
<td nowrap align=center><input type=submit name=n_target3 value="@{[t_('設定')]}"></td>
</tr><tr bgcolor=$DA::Vars::p->{title_color}>
<td nowrap align=center width=30% colspan=2>@{[t_('追加ユーザ')]}</td>
<td nowrap align=center width=30% colspan=2>@{[t_('除外ユーザ')]}</td>
<td nowrap align=center width=30% colspan=2>@{[t_('管理グループ')]}</td>
</tr><tr bgcolor=#FFFFFF height=20>
<td nowrap valign=top width=25%>$tags->{p_target}$error->{p_target}</td>
<td nowrap align=center><input type=submit name=p_target value="@{[t_('設定')]}"></td>
<td nowrap valign=top width=25%>$tags->{e_target}$error->{e_target}</td>
<td nowrap align=center><input type=submit name=e_target value="@{[t_('設定')]}"></td>
<td nowrap valign=top colspan=2>$tags->{admin}</td>
</tr>
buf_end

DA::Custom::override_ns_board_target_edit_tag($session,$target,$form,$error,\$tag);

return ($tag);

}

sub get_category_edit_tag {
	my ($session,$target,$ns_conf,$error)=@_;
    my $edit_tag;
    if ($ns_conf->{category_depth} eq 3) {
        $edit_tag=DA::Ns::get_category_edit_tag3($session,$target);
    } else {
        $edit_tag=DA::Ns::get_category_edit_tag2($session,$target);
    }
	my $red_star="<font color=red>(*)</font>" if ($ns_conf->{no_category_data} ne 'on');
	my $tag=qq{
		<tr bgcolor=$DA::Vars::p->{title_color}>
		<td nowrap align=right>$red_star @{[t_('属性カテゴリ区分')]}</td>
		<td colspan=6 bgcolor=#FFFFFF>$edit_tag $error->{category}</td>
		</tr>
	};
    return ($tag);
}

sub get_category_edit_tag2 {
	my ($session,$target)=@_;
	my $c_list_tag;
	my $category=DA::Ns::get_category_data($session);
	$c_list_tag ="<select name=cid onChange=\"CategoryChange();\">";
	$c_list_tag.="<option value=''>.......... @{[t_('記事種別の選択')]}</option>";
	foreach my $key (sort {  $category->{$a}->{sort_level} cmp $category->{$b}->{sort_level}
			or $a <=> $b } keys %{$category}) {
		if (!$key) { next; }
		if ($category->{$key}->{parent_id}) { next; }
    	my $sel='selected' if ($key eq $target->{cid});
		my $name=$category->{$key}->{category_name};
    	$c_list_tag.="<option value='$key' $sel>$name</option>";
	}
	$c_list_tag.="</select>";

	my $cl_list_tag;
	foreach my $cid (@{$category->{$target->{cid}}->{'_children'}}) {
		my $name=$category->{$cid}->{category_name};
		$cl_list_tag.="<option value='$cid'>$name</option>";
	}
	my $cr_list_tag;
	foreach my $cid (split(/[\,\|]/,$target->{category})) {
		my $name=$category->{$cid}->{category_name};
		$cr_list_tag.="<option value='$cid'>$name</option>";
	}

	my $tag=qq{
		<table width=100% border=0 cellspacing=0 cellpadding=0><tr>
		<td colspan=3>$c_list_tag</td>
		</tr><tr>
		<td width=40% bgcolor=#FFFFFF>
			<select name=cl_list size=7 MULTIPLE style="font-size:13px;width:100%">$cl_list_tag</select>
		</td>
		<td bgcolor=#FFFFFF align=center>
    		<input type=submit name=c_add value="@{[t_('追　加＞＞')]}" style='width:80px;'><br>
    		<input type=submit name=c_del value="@{[t_('＜＜削　除')]}" style='width:80px;'><br>
    		<input type=submit name=c_del_all value="@{[t_('すべて削除')]}" style='width:80px;'>
		</td>
		<td width=40% bgcolor=#FFFFFF>
			<select name=cr_list size=7 MULTIPLE style="font-size:13px;width:100%">$cr_list_tag</select>
		</td>
		</tr></table>
	};

	return ($tag);
}
sub get_category_edit_tag3 {
    my ($session,$target)=@_;
    my $category=DA::Ns::get_category_data($session);

    my $c_list_tag;
        $c_list_tag ="<select id=cid name=cid onChange=\"NsViewDetail.CategorySel(3);\">";
        $c_list_tag.="<option value=''>.......... @{[t_('記事種別の選択')]}</option>";
        $c_list_tag.=DA::NsView::get_category_tree_option($session,$target->{cid},$category);
        $c_list_tag.="</select>";

    my $cl_list_tag=DA::NsView::get_category_tree_check($session,$target,$category);

    my $cr_list_tag;
    foreach my $cid (split(/[\,\|]/,$target->{category})) {
        my $name=$category->{$cid}->{category_name};
        $cr_list_tag.="<option value='$cid'>$name</option>";
    }

    my $cl_list_height = 114;
    if ($ENV{'HTTP_USER_AGENT'} =~ /(Trident)/i) {
        $cl_list_height = 110;
    } elsif ($ENV{'HTTP_USER_AGENT'} =~ /(MSIE)/i) {
        $cl_list_height = 118;
    }
    my $tag=qq{
        <table width=100% border=0 cellspacing=0 cellpadding=0><tr>
        <td colspan=4>$c_list_tag</td></tr><tr><td width=40% valign=top>
        <div id=cl_list style="height:${cl_list_height}px;background:#FFFFFF;border:1px #666666 solid;overflow:auto">$cl_list_tag</div>
        </td><td align=center width=10%>
        <input type=button name=c_add value="@{[t_('追　加＞＞')]}" onClick="NsViewDetail.CategoryAdd(3);" style='width:80px;'><br>
        <input type=button name=c_del value="@{[t_('＜＜削　除')]}" onClick="NsViewDetail.CategoryDel(3);" style='width:80px;'><br>
        <input type=button name=c_clear value="@{[t_('すべて削除')]}" onClick="NsViewDetail.CategoryClear(3);" style='width:80px;'>
        </td><td width=40% id=cr_list valign=top>
        <select id=cr_sel name=cr_sel size=7 MULTIPLE style='font-size:13px;width:100%;'>$cr_list_tag</select>
        </td></tr></table>
    };
	return ($tag);
}

sub get_list_tag {
my ($session,$row,$read,$join,$ns_master,$ns_conf,$category_data,$list_num,$mode,$user_list,$not_encode_name,$label_master)=@_;
# $mode=(portlet|list|json|popup)
my $popup;
if ($mode eq 'popup') {
    $mode = 'portlet';
    $popup = 1;
}
my $order=($mode ne 'json') ? $ns_conf->{"$mode\_order"} : $ns_conf->{json_order};


my $col={};
# アイコン
if ('icon' =~ /^($order)$/) {
	if ($row->{icon} && $row->{icon} ne 'null.gif') {
		$row->{icon}=~s/(gif|png)$/$session->{icon_ext}/;
    	$col->{icon}="<img src=$session->{icon_rdir}/parts/$row->{icon} border=0 width=16 height=16>";
	} else {
    	$col->{icon}="<img src=$session->{img_rdir}/null.gif border=0 width=16 height=16>";
	}
	if ($mode ne 'json') {
		$col->{icon}="<td valign=top align=center>$col->{icon}</td>";
	}
}
# 重要度
if ('importance' =~ /^($order)$/) {
	if ($row->{importance} eq 1) {
		$col->{importance}=t_('低%(DCM)');
	} elsif ($row->{importance} eq 2) {
		$col->{importance}=t_('中%(DCM)');
	} elsif ($row->{importance} eq 3) {
		$col->{importance}=t_('高%(DCM)');
	}
	if ($mode ne 'json') {
		$col->{importance}="<td nowrap valign=top>$col->{importance}</td>";
	}
}
# タイトル
if ('title' =~ /^($order)$/) {
	# 月毎の連番を付与
	if (!$row->{seq} && $ns_conf->{monthly_num} eq 'on') {
    	my ($yy,$mm,$dd)=split(/[\/\-\s+]/,$row->{start_date},3);
    	$row->{seq}=sprintf("[%02d%02d-%05d]",$yy-2000,$mm,$row->{seq_no});
	}
    $col->{title}="$row->{seq} $row->{title}";
	if ($mode ne 'json') {
		if ($ns_master->{title} ne 'all') {
    		$col->{title}=DA::IS::format_jsubstr($session,$col->{title},0,$ns_master->{title});
		}
		$col->{title}=DA::CGIdef::encode($col->{title},1,1,'euc');
		$col->{title}="<a href=\"javascript:NsBoard($row->{num});\">$col->{title}</a>";
		$col->{title}="<td valign=top>$col->{title}</td>";
	}
}
# 発信者
if ('create_user' =~ /^($order)$/) {
	if ($user_list->{$row->{create_mid}}) {
    	$col->{create_user}=$user_list->{$row->{create_mid}};
	} else {
		if ($mode ne 'json') {
    		$col->{create_user}=DA::IS::get_ug_name($session,1,$row->{create_mid})->{table};
    		$col->{create_user}="<td nowrap valign=top>$col->{create_user}</td>";
			$user_list->{$row->{create_mid}}=$col->{create_user};
		} else {
    		$col->{create_mid} =$row->{create_mid};
    		$col->{create_user}=DA::IS::get_ug_name($session,1,$row->{create_mid})->{simple_name};
			$user_list->{$row->{create_mid}}=$col->{create_user};
		}
	}
}
# 更新者
if ('update_user' =~ /^($order)$/) {
	if ($user_list->{$row->{update_mid}}) {
    	$col->{update_user}=$user_list->{$row->{update_mid}};
	} else {
		if ($mode ne 'json') {
    		$col->{update_user}=DA::IS::get_ug_name($session,1,$row->{update_mid})->{table};
    		$col->{update_user}="<td nowrap valign=top>$col->{update_user}</td>";
			$user_list->{$row->{update_mid}}=$col->{update_user};
		} else {
    		$col->{update_mid} =$row->{update_mid};
    		$col->{update_user}=DA::IS::get_ug_name($session,1,$row->{update_mid})->{simple_name};
			$user_list->{$row->{update_mid}}=$col->{update_user};
		}
	}
}
# 更新日時
if ('update_date' =~ /^($order)$/) {
	$col->{update_date}=DA::CGIdef::get_display_date2($session,$row->{update_date});
	if ($mode ne 'json') {
    	$col->{update_date}="<td nowrap valign=top>$col->{update_date}</td>";
	}
}
# 登録日時
if ('create_date' =~ /^($order)$/) {
	$col->{create_date}=DA::CGIdef::get_display_date2($session,$row->{create_date});
	if ($mode ne 'json') {
    	$col->{create_date}="<td nowrap valign=top>$col->{create_date}</td>";
	}
}
# 発信部署
if ('create_group' =~ /^($order)$/) {
	$col->{create_group}=$row->{create_group};
	if ($mode ne 'json') {
		$col->{create_group}=DA::CGIdef::encode($col->{create_group},1,1,'euc') unless $not_encode_name;
		$col->{create_group}="<td nowrap valign=top>$col->{create_group}</td>";
	}
}
# 組織略称
if ('short_name' =~ /^($order)$/) {
	if (!$row->{get_short_name}) {
		$col->{short_name}=DA::Ns::get_short_name($session,$ns_conf,$row->{create_gid},$row->{create_group});
	} else {
		$col->{short_name}=$row->{short_name};
	}
	if ($mode ne 'json') {
		if ($col->{short_name} !~ /^<_TMP_(\d+)_NAME>$/) {
			$col->{short_name}=DA::CGIdef::encode($col->{short_name},1,1,'euc');
		}
		$col->{short_name}="<td nowrap valign=top>$col->{short_name}</td>";
	}
}
# マーク
if ('mark' =~ /^($order)$/) {
	if ($mode ne 'json') {
    	if ($read->{mark}) {
        	$col->{mark}="<a href=\"javascript:markProc($row->{num});\">"
        	."<img id='mark_$row->{num}' src=$session->{icon_rdir}/icons_mail_flag_on.$session->{icon_ext} "
			."border=0 width=14 height=14></a>";
    	} else {
        	$col->{mark}="<a href=\"javascript:markProc($row->{num});\">"
        	."<img id='mark_$row->{num}' src=$session->{icon_rdir}/icons_mail_flag_off.$session->{icon_ext} "
			."border=0 width=14 height=14></a>";
    	}
    	$col->{mark}="<td nowrap valign=top align=center>$col->{mark}</td>";
	} else {
		$col->{mark}=$row->{mark};
	}
}
# カテゴリ
if ('category' =~ /^($order)$/) {
	if ($mode ne 'json') {
    	my $category_tag;
    	my $category_lines=0;
    	foreach my $cid (split(/\,/,$row->{category})) {
			if ($category_data->{$cid}->{category_name} eq '') { next; }

        	$category_lines++;
			my $name = $category_data->{$cid}->{category_name};
			my $path = $category_data->{$cid}->{category_name};
			my $parent_id=$category_data->{$cid}->{parent_id};
			if ($parent_id) {
				my $parent_name=$category_data->{$parent_id}->{category_name};
				$path=$parent_name.": ".$path;
			}
			my $top_id  =$category_data->{$parent_id}->{parent_id};
			if ($top_id) {
				my $top_name=$category_data->{$top_id}->{category_name};
				$path=$top_name.": ".$path;
			}
			if ($ns_conf->{category_depth} eq 3) {
				$name="<span title='$path'>$name</span>";
			} else {
				$name=$path;
			}
        	if ($category_lines > 1) { next; }
        	$category_tag.=($category_tag) ? "<br>".$name : $name;
    	}
        my $icon;
        if ($category_lines > 1) {
            $icon="<a href=\"javascript:NsViewList.toggleCategory('$row->{num}');\">"
                 ."<img id='cat_icon_$row->{num}' src='$session->{img_rdir}/PLUS.gif' border=0 width=9 height=9>"
                 ."</a>";
        }
    	$col->{category}=qq{
            <td valign=top>
                <div style='float:left;width:10px;margin-top:3px;margin-right:3px;'>$icon</div>
                <div style='float:left;'>$category_tag <span id='cat_list_$row->{num}'></span></div>
            </td>
        };
	} else {
    	$col->{category}=$row->{category};
    	foreach my $cid (split(/\,/,$row->{category})) {
			my $name = $category_data->{$cid}->{category_name};
			my $path = $category_data->{$cid}->{category_name};
			my $parent_id  =$category_data->{$cid}->{parent_id};
			if ($parent_id) {
				my $parent_name=$category_data->{$parent_id}->{category_name};
				$path=$parent_name.": ".$path;
			}
			my $top_id  =$category_data->{$parent_id}->{parent_id};
			if ($top_id) {
				my $top_name=$category_data->{$top_id}->{category_name};
				$path=$top_name.": ".$path;
			}
			if ($ns_conf->{category_depth} eq 3) {
			} else {
				$name=$path;
			}
        	push(@{$col->{category_name}},$name);
    	}
	}
}
# 回答ボタン
if ('form' =~ /^($order)$/) {
	my $form_tag;
	if ($row->{form_id}) {
    	my $form_valid=0;
    	my $form=DA::Ns::get_form_data($session,$row->{form_id});
    	my $error=DA::Ns::is_form_valid($session,$form,$join,$ns_conf);
    	if (!$error) { $form_valid=1; }
    	my $target_valid=DA::Ns::is_target_user($session,$join,$form);
    	if ($form_valid && $target_valid) {
			if ($mode ne 'json') {
        		$col->{form}="<div class='btns btn_mini' style='width:84px'>"
					."<a href=\"javascript:NsViewCard.AnswerWin('$row->{form_id}','$form->{form_type}');\">"
					."<span><img src='$session->{img_rdir}/ico_edit_s.gif' width=10 height=10 align=absbottom>"
					."@{[t_('回答する')]}</span></a></div>";
			} else {
				$col->{form_id}  =$form->{form_id};
				$col->{form_type}=$form->{form_type};
			}
    	}
	}
	if ($mode ne 'json') {
		$col->{form}="&nbsp;" if ($col->{form} eq '');
    	$col->{form}="<td valign=top>$col->{form}</td>";
	}
}
# リンク
if ('link' =~ /^($order)$/) {
	if ($row->{link_text} ne '') {
		$row->{link_text}=DA::CGIdef::encode($row->{link_text},1,1,'euc');
		my $link_url=DA::CGIdef::set_http($row->{link_text});
		DA::Custom::ns_link_rewrite($session,\$link_url);

		if ($mode ne 'json') {
    		$col->{link}="<div class='btns btn_mini' style='width:48px;'><a href=\"$link_url\" target=_blank>"
			."<span><img src='$session->{img_rdir}/ico_link_s.gif' width=10 height=10 align=absbottom>"
			."@{[t_('リンク')]}</span></a></div>";
		} else {
    		$col->{link}=$link_url;
		}
	}
	if ($mode ne 'json') {
		$col->{link}="&nbsp;" if ($col->{link} eq '');
    	$col->{link}="<td nowrap valign=top>$col->{link}</td>";
	}
}
# 連絡期間
if ('date' =~ /^($order)$/) {
	my $disp_start_date = DA::CGIdef::get_display_date2($session,$row->{start_date},9);
	my $disp_close_date = DA::CGIdef::get_display_date2($session,$row->{close_date},9);
	if ($mode ne 'json') {
		$col->{date}="$disp_start_date<br>&nbsp;&nbsp;@{[t_('〜')]}$disp_close_date";
		$col->{date}="<td nowrap valign=top>$col->{date}</td>";
	} else {
		$col->{date}="$disp_start_date @{[t_('〜')]} $disp_close_date";
		$col->{start_date}=$disp_start_date;
		$col->{close_date}=$disp_close_date;
	}
}
# 連絡開始日時
if ('start_date' =~ /^($order)$/) {
	my $disp_start_date = DA::CGIdef::get_display_date2($session,$row->{start_date},9);
	$col->{start_date}="$disp_start_date";
	if ($mode ne 'json') {
		$col->{start_date}="<td nowrap valign=top>$col->{start_date}</td>";
	}
}
# 連絡終了日時
if ('close_date' =~ /^($order)$/) {
	my $disp_close_date = DA::CGIdef::get_display_date2($session,$row->{close_date},9);
	$col->{close_date}="$disp_close_date";
	if ($mode ne 'json') {
		$col->{close_date}="<td nowrap valign=top>$col->{close_date}</td>";
	}
}
# 更新日時
if ('update_date' =~ /^($order)$/) {
	$col->{update_date}=DA::CGIdef::get_display_date2($session,$row->{update_date});
	if ($mode ne 'json') {
    	$col->{update_date}="<td nowrap valign=top>$col->{update_date}</td>";
	}
}

# ラベル
if ('label' =~ /^($order)$/ && ($popup ne 1 || $ns_conf->{hidden_pop_label_option} ne 'on')) {
    my $g_label = &get_label($session, $row->{num}, $ns_conf);
    if ($mode ne 'json') {
        my $label_tag;
        my $label_lines=0;
        foreach my $lb_name (split(/,/, $g_label->{label})) {
            $label_lines++;
            my $value = DA::CGIdef::encode($label_master->{$lb_name}, 0, 1, 'euc');
            if ($label_lines > 1) { next; }
            $label_tag.=($label_tag) ? "<br>".$value : $value;
        }
        my $icon;
        if ($label_lines > 1) {
            $icon="<a href=\"javascript:NsViewList.toggleLabel('$row->{num}');\">"
                 ."<img id='label_cat_icon_$row->{num}' src='$session->{img_rdir}/PLUS.gif' border=0 width=9 height=9>"
                 ."</a>";
        }
        $col->{label}=qq{
            <td valign=top>
                <div style='float:left;width:10px;margin-top:3px;margin-right:3px;'>$icon</div>
                <div style='float:left;'>$label_tag<span id='label_cat_list_$row->{num}'></span></div>
            </td>
        };
    } else {
        $col->{label} = $g_label->{label};
    }
}

return ($col);

}

sub get_header_tag {
my ($session,$ns_conf,$list_num,$sort_index,$mode)=@_;

my $header={};
my ($link_url,$color);
if ($mode eq 'portlet') {
	$link_url="$DA::Vars::p->{cgi_rdir}/ns_board_main.cgi?list_num=$list_num";
	$color="bgcolor=#999999";
} else {
	$link_url="$DA::Vars::p->{cgi_rdir}/ns_board_list.cgi?list_num=$list_num";
}
$header->{icon}="<th>&nbsp;</th>";

# DCM_01000026
if ($mode eq 'popup') {
	$header->{title}="<th nowrap align=center>@{[t_('タイトル')]}</th>";
	$header->{date} ="<th nowrap align=center>&nbsp;@{[t_('連絡期間')]}&nbsp;</th>";
	$header->{start_date} ="<th nowrap align=center width=10%>&nbsp;@{[t_('連絡開始日時')]}&nbsp;</th>";
	$header->{close_date} ="<th nowrap align=center width=10%>&nbsp;@{[t_('連絡終了日時')]}&nbsp;</th>";
	$header->{importance} ="<th nowrap align=center width=5%>&nbsp;@{[t_('重要度%(DCM)')]}&nbsp;</th>";
	$header->{create_date}="<th nowrap align=center width=10%>@{[t_('登録日')]}</th>";
    if($ns_conf->{hidden_pop_label_option} ne 'on') {
         $header->{label}="<th nowrap align=center>@{[t_('ラベル')]}</th>";
    }
} else {
	$header->{title}="<th nowrap align=center>"
		."<a href=\"$link_url&sort=$sort_index->{title}->{next}\">@{[t_('タイトル')]}</a>"
		."$sort_index->{title}->{icon}</th>";
	$header->{date}="<th nowrap align=center>"
		."&nbsp;<a href=\"$link_url&sort=$sort_index->{date}->{next}\">"
		."@{[t_('連絡期間')]}</a>$sort_index->{date}->{icon}&nbsp;</th>";
	$header->{start_date}="<th nowrap align=center width=10%>"
		."&nbsp;<a href=\"$link_url&sort=$sort_index->{start_date}->{next}\">"
		."@{[t_('連絡開始日時')]}</a>$sort_index->{start_date}->{icon}&nbsp;</th>";
	$header->{close_date}="<th nowrap align=center width=10%>"
		."&nbsp;<a href=\"$link_url&sort=$sort_index->{close_date}->{next}\">"
		."@{[t_('連絡終了日時')]}</a>$sort_index->{close_date}->{icon}&nbsp;</th>";
	$header->{importance}="<th nowrap align=center width=5%>"
		."&nbsp;<a href=\"$link_url&sort=$sort_index->{importance}->{next}\">"
		."@{[t_('重要度%(DCM)')]}</a>$sort_index->{importance}->{icon}&nbsp;</th>";
	$header->{create_date}="<th nowrap align=center width=10%><a href=\"$link_url"
		."&sort=$sort_index->{create}->{next}\">@{[t_('登録日')]}</a>"
		."$sort_index->{create}->{icon}</th>";
    $header->{label}="<th nowrap align=center>@{[t_('ラベル')]}</th>";
}

# DCM_01000039
# portlet では、is_member との結合を行わないように変更しているため、ソート不可に変更
if ($mode eq 'portlet' || $mode eq 'popup') {
	$header->{create_user}="<th nowrap align=center>&nbsp;@{[t_('発信者')]}&nbsp;</th>";
} else {
	$header->{create_user}="<th nowrap align=center>"
	."&nbsp;<a href=\"$link_url&sort=$sort_index->{user}->{next}\">"
	."@{[t_('発信者')]}</a>$sort_index->{user}->{icon}&nbsp;</th>";
}

$header->{create_group}="<th nowrap align=center>&nbsp;@{[t_('発信部署')]}&nbsp;</th>";
$header->{short_name}  ="<th nowrap align=center>&nbsp;@{[t_('組織略称')]}&nbsp;</th>";
$header->{category}	   ="<th nowrap align=center>&nbsp;@{[t_('カテゴリ')]}&nbsp;</th>";
$header->{link}="<th nowrap align=center width=2%>&nbsp;@{[t_('リンク')]}&nbsp;</th>";
$header->{form}="<th nowrap align=center width=2%>&nbsp;@{[t_('回答フォーム')]}&nbsp;</th>";
$header->{mark}="<th nowrap align=center width=2%>&nbsp;@{[t_('マーク')]}&nbsp;</th>";
$header->{status}="<th nowrap align=center>"
	."<a href=\"$link_url&sort=$sort_index->{status}->{next}\">@{[t_('ステータス')]}</a>"
	."$sort_index->{status}->{icon}</th>";
$header->{update_user}="<th nowrap align=center>@{[t_('最終更新者')]}</th>";
if ($mode eq 'popup') {
	$header->{update_date}="<th nowrap align=center>@{[t_('最終更新日')]}</th>";
} else {
	$header->{update_date}="<th nowrap align=center><a href=\"$link_url&sort=$sort_index->{update}->{next}\">@{[t_('最終更新日')]}</a>$sort_index->{update}->{icon}</th>";
}
$header->{button}="<th nowrap align=center>@{[t_('操作')]}</th>";
$header->{check_user}="<th nowrap align=center>@{[t_('確認者')]}</th>";

return ($header);

}

sub get_sort_index {
	my ($session,$list_conf)=@_;

	my $asec_icon="<img src=$session->{img_rdir}/sort_asec.gif border=0 "
	 . "width=7 height=11 align=top hspace=2 title=\"@{[t_('昇順')]}\">";
	my $desc_icon="<img src=$session->{img_rdir}/sort_desc.gif border=0 "
	 . "width=7 height=11 align=top hspace=2 title=\"@{[t_('降順')]}\">";

	my $sort_index;
	$sort_index->{num}->{next}='num1';
	$sort_index->{title}->{next}='title1';
	$sort_index->{date}->{next}='date1';
	$sort_index->{start_date}->{next}='start_date1';
	$sort_index->{close_date}->{next}='close_date1';
	$sort_index->{user}->{next}='user1';
	$sort_index->{importance}->{next}='importance1';
	$sort_index->{create}->{next}='create1';
	$sort_index->{update}->{next}='update1';
	$sort_index->{status}->{next}='status1';
	if ($list_conf->{sort} eq 'num1') {
		$sort_index->{num}->{icon}=$asec_icon;
   		$sort_index->{num}->{next}='num2';
   		$sort_index->{title}->{next}='title1';
   		$sort_index->{sql}='b.num ASC';
	} elsif ($list_conf->{sort} eq 'num2') {
   		$sort_index->{num}->{icon}=$desc_icon;
   		$sort_index->{num}->{next}='num1';
   		$sort_index->{title}->{next}='title1';
   		$sort_index->{sql}='b.num DESC';
	} elsif ($list_conf->{sort} eq 'title1') {
   		$sort_index->{title}->{icon}=$asec_icon;
   		$sort_index->{num}->{next}='num1';
   		$sort_index->{title}->{next}='title2';
   		$sort_index->{sql}='b.title ASC';
	} elsif ($list_conf->{sort} eq 'title2') {
   		$sort_index->{title}->{icon}=$desc_icon;
   		$sort_index->{num}->{next}='num1';
   		$sort_index->{title}->{next}='title1';
   		$sort_index->{sql}='b.title DESC';
	} elsif ($list_conf->{sort} eq 'date1') {
   		$sort_index->{date}->{icon}=$asec_icon;
   		$sort_index->{date}->{next}='date2';
   		$sort_index->{sql}='b.start_date ASC, b.update_date DESC';
	} elsif ($list_conf->{sort} eq 'date2') {
   		$sort_index->{date}->{icon}=$desc_icon;
   		$sort_index->{sql}='b.start_date DESC, b.update_date DESC';
	} elsif ($list_conf->{sort} eq 'start_date1') {
   		$sort_index->{start_date}->{icon}=$asec_icon;
   		$sort_index->{start_date}->{next}='start_date2';
   		$sort_index->{sql}='b.start_date ASC';
	} elsif ($list_conf->{sort} eq 'start_date2') {
   		$sort_index->{start_date}->{icon}=$desc_icon;
   		$sort_index->{sql}='b.start_date DESC';
	} elsif ($list_conf->{sort} eq 'close_date1') {
   		$sort_index->{close_date}->{icon}=$asec_icon;
   		$sort_index->{close_date}->{next}='close_date2';
   		$sort_index->{sql}='b.close_date ASC';
	} elsif ($list_conf->{sort} eq 'close_date2') {
   		$sort_index->{close_date}->{icon}=$desc_icon;
   		$sort_index->{sql}='b.close_date DESC';
	} elsif ($list_conf->{sort} eq 'user1') {
   		$sort_index->{user}->{icon}=$asec_icon;
   		$sort_index->{user}->{next}='user2';
   		$sort_index->{sql}='m.kana ASC';
	} elsif ($list_conf->{sort} eq 'user2') {
   		$sort_index->{user}->{icon}=$desc_icon;
   		$sort_index->{sql}='m.kana DESC';
	} elsif ($list_conf->{sort} eq 'create1') {
   		$sort_index->{create}->{icon}=$asec_icon;
   		$sort_index->{create}->{next}='create2';
   		$sort_index->{sql}='b.create_date ASC';
	} elsif ($list_conf->{sort} eq 'create2') {
   		$sort_index->{create}->{icon}=$desc_icon;
   		$sort_index->{sql}='b.create_date DESC';
	} elsif ($list_conf->{sort} eq 'update1') {
   		$sort_index->{update}->{icon}=$asec_icon;
   		$sort_index->{update}->{next}='update2';
   		$sort_index->{sql}='b.update_date ASC';
	} elsif ($list_conf->{sort} eq 'update2') {
   		$sort_index->{update}->{icon}=$desc_icon;
   		$sort_index->{sql}='b.update_date DESC';
	} elsif ($list_conf->{sort} eq 'status1') {
   		$sort_index->{status}->{icon}=$asec_icon;
   		$sort_index->{status}->{next}='status2';
   		$sort_index->{sql}='b.status ASC';
	} elsif ($list_conf->{sort} eq 'status2') {
   		$sort_index->{status}->{icon}=$desc_icon;
   		$sort_index->{sql}='b.status DESC';
	} elsif ($list_conf->{sort} eq 'importance1') {
   		$sort_index->{importance}->{icon}=$asec_icon;
   		$sort_index->{importance}->{next}='importance2';
   		if ($DA::Vars::p->{res}->{database} eq 'oracle') {
      		$sort_index->{sql}='nvl(b.importance,0) ASC';
   		} else {
      		$sort_index->{sql}='b.importance ASC';
   		}
	} elsif ($list_conf->{sort} eq 'importance2') {
   		$sort_index->{importance}->{icon}=$desc_icon;
   		if ($DA::Vars::p->{res}->{database} eq 'oracle') {
      		$sort_index->{sql}='nvl(b.importance,0) DESC';
   		} else {
      		$sort_index->{sql}='b.importance DESC';
   		}
	} else {
		$sort_index->{num}->{icon}=$asec_icon;
   		$sort_index->{num}->{next}='num2';
   		$sort_index->{title}->{next}='title1';
   		$sort_index->{sql}='b.num ASC';
	}

    if ($list_conf->{sort2} eq 'create1') {
        $sort_index->{sql}.=",b.create_date ASC";
    } elsif ($list_conf->{sort2} eq 'create2') {
        $sort_index->{sql}.=",b.create_date DESC";
    } elsif ($list_conf->{sort2} eq 'update1') {
        $sort_index->{sql}.=",b.update_date ASC";
    } elsif ($list_conf->{sort2} eq 'update2') {
        $sort_index->{sql}.=",b.update_date DESC";
    } elsif ($list_conf->{sort2} eq 'importance1') {
   		if ($DA::Vars::p->{res}->{database} eq 'oracle') {
      		$sort_index->{sql}.=',nvl(b.importance,0) ASC';
   		} else {
      		$sort_index->{sql}.=',b.importance ASC';
   		}
    } elsif ($list_conf->{sort2} eq 'importance2') {
   		if ($DA::Vars::p->{res}->{database} eq 'oracle') {
      		$sort_index->{sql}.=',nvl(b.importance,0) DESC';
   		} else {
      		$sort_index->{sql}.=',b.importance DESC';
   		}
    } elsif ($list_conf->{sort2} eq 'start_date1') {
        $sort_index->{sql}.=",b.start_date ASC";
    } elsif ($list_conf->{sort2} eq 'start_date2') {
        $sort_index->{sql}.=",b.start_date DESC";
    } elsif ($list_conf->{sort2} eq 'close_date1') {
        $sort_index->{sql}.=",b.close_date ASC";
    } elsif ($list_conf->{sort2} eq 'close_date2') {
        $sort_index->{sql}.=",b.close_date DESC";
	}

	DA::Custom::rewrite_ns_board_list_sort($session,$list_conf,$sort_index);

	return ($sort_index);
}

sub search_text {
	my ($session,$board,$list_conf,$sr_param)=@_;
	my $sr_flg;
    if ($list_conf->{sr_type} eq 'or') {
        foreach my $word (keys %$sr_param) {
            # DCM_01000027
            # if ($board->{title}  =~ /$word/) { $sr_flg=1; last; }
            # if ($board->{memo}   =~ /$word/) { $sr_flg=1; last; }
            # if ($board->{seq}    =~ /$word/) { $sr_flg=1; last; }
            if ($board->{title}  =~ /\Q$word\E/) { $sr_flg=1; last; }
            if ($board->{memo}   =~ /\Q$word\E/) { $sr_flg=1; last; }
            if ($board->{seq}    =~ /\Q$word\E/) { $sr_flg=1; last; }
        }
    } else {
        my $param = {};
        %$param=%$sr_param;
        foreach my $word (keys %$param) {
            # DCM_01000027
            # if ($board->{title}  =~ /$word/) { $param->{$word}=1; next; }
            # if ($board->{memo}   =~ /$word/) { $param->{$word}=1; next; }
            # if ($board->{seq}    =~ /$word/) { $param->{$word}=1; next; }
            if ($board->{title}  =~ /\Q$word\E/) { $param->{$word}=1; next; }
            if ($board->{memo}   =~ /\Q$word\E/) { $param->{$word}=1; next; }
            if ($board->{seq}    =~ /\Q$word\E/) { $param->{$word}=1; next; }
        }
        $sr_flg=1;
        foreach my $word (keys %$param) {
            if (!$param->{$word}) { $sr_flg=0; }
        }
    }
	return ($sr_flg);
}

sub make_attach_tag {
	my ($session,$num,$attach_list,$del_btn)=@_;
	my $list;
    foreach my $no (sort keys %$attach_list) {
        my ($type,$fname,$path,$img)=split(/\n/,$attach_list->{"$no"});
        $list.="<tr><td nowrap>"
             ."<img src=$session->{img_rdir}/$img width=14 height=14></td>";
        my $del_tag;
        if ($del_btn) {
            $del_tag="<a href=\"javascript:deleteItem('$del_btn','$no');\">"
			."<img src=$session->{img_rdir}/aqbtn_close_s.gif width=14 "
			."height=14 border=0 align=top></a>";
        }
        if ($type eq 'url') {
            my ($bid,$docno)=split(/\:/,$path,2);
            if (!$docno) { next; }
			my $title;
			# フォルダ指定の場合 BID が２番目になるのは歴史的経緯
            if ($bid) { # file
                $path="$DA::Vars::p->{cgi_rdir}/lib_doc.cgi?"."bid=$bid&docno=$docno&mode=view";
				my $data=DA::Lib::get_file_data($session,$bid,$docno);
                $title=$data->{title};
            }else{ 		# folder
                $path="$DA::Vars::p->{cgi_rdir}/lib_file_list.cgi?"."bid=$docno&from=attach&popup=1";
				my $data=DA::Lib::get_folder_data($session,$docno);
                $title=$data->{title};
            }
            $attach_list->{$no}="$type\n$fname\n$path\n$img";
            $list.="<td>&nbsp;<a href=\"$path\" target=_blank>$title</a>"
                 ."@{[b_('ライブラリ')]}$del_tag";
		} else {
			my $file;
			if (!$path) {
				my $d_num=DA::CGIdef::get_last_n($num,2);
    			$file="$DA::Vars::p->{data_dir}/ns_board/$d_num/$num/$no";
			} else {
    			$file="$DA::Vars::p->{base_dir}/insuite/$path";
			}
    		my $cipher=new Crypt::CBC($session->{sid},'Blowfish');
    		my $c_path=$cipher->encrypt($file);
    		   $c_path=unpack("H*",$c_path);
    		   $c_path=URI::Escape::uri_escape($c_path);
    		my $c_name=$cipher->encrypt($fname);
    		   $c_name=unpack("H*",$c_name);
    		   $c_name=URI::Escape::uri_escape($c_name);
            $path="$DA::Vars::p->{cgi_rdir}/download.cgi?"
				."path=$c_path&name=$c_name";
            $list.="<td>&nbsp;<a href=\"$path\" target=_self>$fname</a>$del_tag";
        }
		$list.="</td></tr>";
    }
    my $attach_tag;
    if ($list) {
        $attach_tag="<table border=0 cellspacing=0 cellpadding=0>$list</table>";
    }
	return ($attach_tag);
}

sub get_category_sel {
	my ($session)=@_;
	my $category_sel={};
	my $sql="SELECT category_id FROM ns_category_sel "
	 . "WHERE mid=? ORDER BY category_id";
    my $sth = $session->{dbh}->prepare($sql); 
	   $sth->bind_param(1,$session->{user},3); $sth->execute();
    while (my $category_id = $sth->fetchrow) {
        $category_sel->{$category_id}=1;
	}
	$sth->finish;
	return ($category_sel);
}

sub get_category_data {
    my ($session) = @_;
    my $list = DA::Ns::get_category_list($session);
    push(@{$list},{
            category_id     => 0,
            parent_id       => 0,
            category_name   => t_('カテゴリ')
    });
    my $cache=DA::Ns::make_children($list,"category_id","parent_id");
    return $cache;
}

sub get_category_list {
    my ($session) = @_;
    my $db_list = [];
    my $sql = "SELECT * FROM ns_category "
     . "ORDER BY sort_level,category_id";
    my $sth = $session->{dbh}->prepare($sql); $sth->execute();
    while (my $hash = $sth->fetchrow_hashref('NAME_lc')) {
        $hash->{category_name}=DA::IS::check_view_name2($session,
                $hash->{category_name},$hash->{category_alpha});
        $hash->{category_name}=
            DA::CGIdef::encode($hash->{category_name},1,1,'euc');
        if (!$hash->{gid}) { $hash->{gid}=0; }
        if (!$hash->{parent_id}) { $hash->{parent_id}=0; }
        push(@$db_list, $hash);
    }
    $sth->finish();
    return $db_list;
}

sub get_category_tree {
    my ($session) = @_;
    my $category_tree_file="$DA::Vars::p->{master_dir}/"
            ."$DA::Vars::p->{top_gid}/ns_category_tree.dat";
    #if (! -e $category_tree_file) {
        my $info = {};
        my $index = {};
        my $category = DA::Ns::get_category_data($session);
        while (my ($id, $data) = each %$category) {
            $info->{$id} = {
                "name"       => $data->{category_name},
                "parent_id"  => $data->{parent_id},
                "level"      => $data->{level},
                "id"         => $id
            };
            if (@{$data->{_children}} > 0) {
                $index->{$id} = $data->{_children};
            }
        }

		DA::Session::lock("ns_category_tree");
        Storable::store({ "info" => $info, "index" => $index },
            $category_tree_file);
		DA::Session::unlock("ns_category_tree");

		my $res=DA::System::file_chown(
				$DA::Vars::p->{www_user}, 
				$DA::Vars::p->{www_group},
        		( $category_tree_file )
    	);
    #}

	DA::Session::lock("ns_category_tree");
    my $cache = Storable::retrieve($category_tree_file);
	DA::Session::unlock("ns_category_tree");

    return $cache;
}

sub make_children {
    my ($db_list, $id_name, $parent_name) = @_;
    my $sort_level = {};
    my $children   = {};
    foreach my $db (@$db_list) {
        my $id = $db->{$id_name};
        my $prent_id = $db->{$parent_name};
        if (!$db->{$id_name}) { next; }
        $sort_level->{$id}=$db->{sort_level};
        if (!exists $children->{$prent_id}) {
            $children->{$prent_id} = [];
        }
        push (@{$children->{$prent_id}}, $db->{$id_name});
    }

    my $cache = {};
    foreach my $db (@$db_list) {
        my $id = $db->{$id_name};
        $cache->{$id} = {};
        foreach my $key (keys %$db) {
            $cache->{$id}->{$key} = $db->{$key};
        }
        my $parent_id=$db->{$parent_name};
        $cache->{$id}->{p_sort_level}=int($sort_level->{$parent_id});

        if (exists $children->{$id}) {
            if (!exists $cache->{$id}) {
                $cache->{$id} = {}; # for root_id
            }
            $cache->{$id}->{_children} = $children->{$id};
        } else {
            $cache->{$id}->{_children} = [];
        }
    }

	# 階層レベルを設定
	foreach my $id (keys %{$cache}) {
		$cache->{$id}->{level}=1;
		my $parent_id = $cache->{$id}->{parent_id};
		if ($parent_id) {
			$cache->{$id}->{level}++;
			if ($cache->{$parent_id}->{parent_id}) {
				$cache->{$id}->{level}++;
			}
		}
	}

    return $cache;
}

sub uncache_category_data {
    my ($session)=@_;
    my $dummy;
    my $category_cache_file="$DA::Vars::p->{master_dir}/"."$DA::Vars::p->{top_gid}/ns_category_cache.dat";
    my $category_tree_file="$DA::Vars::p->{master_dir}/"."$DA::Vars::p->{top_gid}/ns_category_tree.dat";
    DA::System::file_unlink("$category_cache_file");
    $dummy = DA::Ns::get_category_data($session);
    DA::System::file_unlink("$category_tree_file");
    $dummy = DA::Ns::get_category_tree($session);
}

sub update_category {
    my ($session, $category_id, $data) = @_;

    my ($sql, $sth, $msg);
    my $proc = (defined $category_id) ? "mod" : "add";
    delete $data->{category_id};
    if (exists $data->{category_name}) {
        $data->{category_name} = WA::CGI::trim_jspace("$data->{category_name}");
        if (length($data->{category_name}) == 0) {
            return t_("カテゴリ名が入力されていません。");
        }
    	if (DA::Unicode::is_space($data->{category_name})) {
        	return t_("空白のみのカテゴリ名は使用できません。");
    	}
    }
    my $org_data = {};
    if ($proc eq 'add') {
        if (!defined $data->{parent_id} || $data->{parent_id} eq '') {
            return t_("親カテゴリが指定されていません。");
        }
    } elsif ($proc eq 'mod') {
        $sql = "SELECT * FROM ns_category WHERE category_id=?";
        $sth = $session->{dbh}->prepare($sql);
        $sth->bind_param(1,int($category_id),3); $sth->execute();
        $org_data = $sth->fetchrow_hashref('NAME_lc');
        unless (defined $org_data) {
            return t_("指定されたカテゴリが存在しません。")
                  .t_("削除された可能性があります。");
        }
        $sth->finish();
    }

    if (exists $data->{parent_id}) {
        my $category_tmp=DA::Ns::get_category_data($session);
        if ($proc eq 'mod') {
            if ($data->{parent_id} == $category_id) {
                return t_("自分自身を親カテゴリとして指定する事はできません。");
            }
        }
    }

    DA::Session::trans_init($session);
    eval {
        if ($proc eq 'add') {
			$category_id = DA::IS::get_seq($session,'custom');
            $sql="INSERT INTO ns_category (category_id) VALUES (?)";
			$sth=$session->{dbh}->prepare($sql);
			$sth->bind_param(1,int($category_id),3);
			$sth->execute();

            $data->{category_code} = $category_id;
        }
        if ($proc eq 'add' || $proc eq 'mod') {
            my $is_number = {
                    gid         => 1,
                    category_id => 1,
                    parent_id   => 1,
                    sort_level  => 1
            };
            my $length = {
				category_name 	=> (DA::Unicode::internal_charset() eq 'UTF-8') ? 240 : 1024,
				category_kana 	=> (DA::Unicode::internal_charset() eq 'UTF-8') ? 240 : 1024,
				category_alpha 	=> (DA::Unicode::internal_charset() eq 'UTF-8') ? 240 : 1024,
				category_code 	=> (DA::Unicode::internal_charset() eq 'UTF-8') ? 240 : 1024,
				search_words 	=> (DA::Unicode::internal_charset() eq 'UTF-8') ? 2048 : 4000,
				search_query 	=> (DA::Unicode::internal_charset() eq 'UTF-8') ? 2048 : 4000,
				description 	=> (DA::Unicode::internal_charset() eq 'UTF-8') ? 2048 : 4000,
			};
            my $set;
            foreach my $key (sort keys %$data) {
                $set.=($set) ? ",$key=?" : "$key=?";
            }
            $sql="UPDATE ns_category SET $set WHERE category_id=?";
            $sth=$session->{dbh}->prepare($sql);
            my $ix=0;
            foreach my $key (sort keys %$data) {
                my $quote=$is_number->{$key} ? 3 : 1;
				if ($length->{$key}) {
					$data->{$key}=DA::CGIdef::sql_quote($data->{$key},
						$length->{$key},1);
				}
                $sth->bind_param(++$ix,$data->{$key},$quote);
            }
            $sth->bind_param(++$ix,int($category_id),3);
            $sth->execute();
        }
    };
    if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }
    # -- キャッシュのクリア
    DA::Ns::uncache_category_data($session);

    return undef;
}

sub delete_category {
    my ($session, $category_id, $mapping) = @_;
    my ($sql, $sth, $data);
    my ($category_name, $parent_id);

    DA::Session::trans_init($session);
    eval {
        # -- 操作対象のカテゴリ情報の取得
        $sql = "SELECT category_name,parent_id FROM ns_category "
            ."WHERE category_id=? FOR UPDATE";
        $sth = $session->{dbh}->prepare($sql);
        $sth->bind_param(1,int($category_id),3); $sth->execute();
        $data = $sth->fetchrow_arrayref;
        if (ref($data) ne 'ARRAY') {
            return t_("カテゴリが見つかりません");
        }
        # -- カテゴリ名と親カテゴリIDの取得
        ($category_name, $parent_id) = (@$data);

        # -- 対象カテゴリに子供がいないかどうかチェック
        $sql = "SELECT parent_id FROM ns_category WHERE parent_id=?";
        $sth = $session->{dbh}->prepare($sql);
        $sth->bind_param(1,int($category_id),3); $sth->execute();
        $data = $sth->fetchrow_arrayref;
        if (ref($data) eq 'ARRAY') {
            return t_("下位カテゴリが存在している場合は削除できません");
        }

        $sql = "DELETE FROM ns_category WHERE category_id=?";
        $sth = $session->{dbh}->prepare($sql);
        $sth->bind_param(1,int($category_id),3); $sth->execute();
    };
    if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }
    # -- キャッシュのクリア
    DA::Ns::uncache_category_data($session);

    $session->{dbh}->commit();

    return undef;
}

sub get_color_style {
my ($session,$ns_conf)=@_;

if (!$ns_conf->{color})  { $ns_conf->{color}='#000000'; }
if (!$ns_conf->{color1}) { $ns_conf->{color1}='#000000'; }
if (!$ns_conf->{color2}) { $ns_conf->{color2}='#000000'; }
if (!$ns_conf->{color3}) { $ns_conf->{color3}='#000000'; }
if (!$ns_conf->{bgcolor})  { $ns_conf->{bgcolor}='#FFFFFF'; }
if (!$ns_conf->{bgcolor1}) { $ns_conf->{bgcolor1}='#FFFFFF'; }
if (!$ns_conf->{bgcolor2}) { $ns_conf->{bgcolor2}='#FFFFFF'; }
if (!$ns_conf->{bgcolor3}) { $ns_conf->{bgcolor3}='#FFFFFF'; }

my $style_tag=<<buf_end;
.c0 div { color: $ns_conf->{color} !important; background: $ns_conf->{bgcolor}; }
.c0 td { color: $ns_conf->{color} !important; background: $ns_conf->{bgcolor}; }
.c0 a:link { color: $ns_conf->{color} !important; background: $ns_conf->{bgcolor} }
.c0 a:visited { color: $ns_conf->{color} !important; background: $ns_conf->{bgcolor} }
.c0 a:hover { color: $ns_conf->{color} !important; background: $ns_conf->{bgcolor}; }
.c1 div { color: $ns_conf->{color1} !important; background: $ns_conf->{bgcolor1}; }
.c1 td { color: $ns_conf->{color1} !important; background: $ns_conf->{bgcolor1}; }
.c1 a:link { color: $ns_conf->{color1} !important; background: $ns_conf->{bgcolor1} }
.c1 a:visited { color: $ns_conf->{color1} !important; background: $ns_conf->{bgcolor1} }
.c1 a:hover { color: $ns_conf->{color1} !important; background: $ns_conf->{bgcolor1} }
.c2 div { color: $ns_conf->{color2} !important; background: $ns_conf->{bgcolor2}; }
.c2 td { color: $ns_conf->{color2} !important; background: $ns_conf->{bgcolor2}; }
.c2 a:link { color: $ns_conf->{color2} !important; background: $ns_conf->{bgcolor2} }
.c2 a:visited { color: $ns_conf->{color2} !important; background: $ns_conf->{bgcolor2} }
.c2 a:hover { color: $ns_conf->{color2} !important; background: $ns_conf->{bgcolor2} }
.c3 div { color: $ns_conf->{color3} !important; background: $ns_conf->{bgcolor3}; }
.c3 td { color: $ns_conf->{color3} !important; background: $ns_conf->{bgcolor3}; }
.c3 a:link { color: $ns_conf->{color3} !important; background: $ns_conf->{bgcolor3} }
.c3 a:visited { color: $ns_conf->{color3} !important; background: $ns_conf->{bgcolor3} }
.c3 a:hover { color: $ns_conf->{color3} !important; background: $ns_conf->{bgcolor3} }
buf_end

return ($style_tag);

}

sub check_answer_data {
	# 上長による回答データの確認
	my ($session,$form,$store_id)=@_;
    my $today=DA::CGIdef::get_date('Y4/MM/DD HH:MI:SS');
    DA::Session::trans_init($session);
    eval {
		my ($sql,$sth);
        $sql="UPDATE ns_answer_check SET status=2,check_mid=?,check_date=? "
         . "WHERE form_id=? AND store_id=?";
        $sth=$session->{dbh}->prepare($sql);
        $sth->bind_param(1,$session->{user},3);
        $sth->bind_param(2,$today,1);
        $sth->bind_param(3,int($form->{form_id}),3);
        $sth->bind_param(4,int($store_id),3);
        $sth->execute();

        # 確認者以外の確認依頼データを削除
        $sql="DELETE FROM ns_answer_check "
         . "WHERE form_id=? AND store_id=? AND check_mid != ?";
        $sth=$session->{dbh}->prepare($sql);
        $sth->bind_param(1,int($form->{form_id}),3);
        $sth->bind_param(2,int($store_id),3);
        $sth->bind_param(3,$session->{user},3);
        $sth->execute();

        # 採用されたデータのステータスを変更
        my $table;
		if ($form->{form_type}) {
    		$table="ns_form_ext_".DA::CGIdef::get_last_n($form->{form_id},2);
		} else {
    		$table="ns_form_data_".DA::CGIdef::get_last_n($form->{form_id},2);
		}
        $sql="UPDATE $table SET save_mode=3 WHERE form_id=? AND store_id=?";
        $sth=$session->{dbh}->prepare($sql);
        $sth->bind_param(1,int($form->{form_id}),3);
        $sth->bind_param(2,int($store_id),3);
        $sth->execute();

        # 採用された確認待ちデータを削除
        if ($form->{form_dup} eq 3) {
            $sql="DELETE FROM $table WHERE save_mode IN (1,2) "
            ."AND form_id=? AND store_id != ?";
            $sth=$session->{dbh}->prepare($sql);
            $sth->bind_param(1,int($form->{form_id}),3);
            $sth->bind_param(2,int($store_id),3);
            $sth->execute();
        }
    };
    if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }
	return;
}

sub reject_answer_data {
	# 上長による回答データの確認
	my ($session,$form,$store_id)=@_;
    my $today=DA::CGIdef::get_date('Y4/MM/DD HH:MI:SS');
    DA::Session::trans_init($session);
    eval {
		my ($sql,$sth);
        $sql="UPDATE ns_answer_check SET status=3,check_mid=?,check_date=? "
         . "WHERE form_id=? AND store_id=?";
        $sth=$session->{dbh}->prepare($sql);
        $sth->bind_param(1,$session->{user},3);
        $sth->bind_param(2,$today,1);
        $sth->bind_param(3,int($form->{form_id}),3);
        $sth->bind_param(4,int($store_id),3);
        $sth->execute();
    };
    if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }
	return;
}

sub get_short_name {
	# 組織略称の取得
	my ($session,$ns_conf,$gid,$gname)=@_;
	if ($ns_conf->{use_short_name} ne 'on') { return; }
	if ($ns_conf->{short_name} !~ /^text/) { 
		return $gname;
	}

	my $view_lang   =DA::IS::get_user_lang($session);
    my $iv_group_ext=DA::IS::get_lang_view($session, $view_lang, "group_ext");
	my $sql="SELECT $ns_conf->{short_name} FROM $iv_group_ext WHERE gid=?";
	my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,int($gid),3); $sth->execute();
    my $short_name=$sth->fetchrow; $sth->finish();

	return ($short_name);
}

sub reset_form_status {
	my ($session,$form_id,$status,$update_mid)=@_;
	if (!$status) { $status=0; }
	if (!$update_mid) { $update_mid=$session->{user}; }
    my $update_date=DA::CGIdef::get_date('Y4-MM-DD HH:MI:SS');
	DA::Session::trans_init($session);
	eval {
		my $sql="UPDATE ns_form SET status=?,update_mid=?,update_date=? WHERE form_id=?";
		my $sth=$session->{dbh}->prepare($sql);
    	   $sth->bind_param(1,int($status),3); 
    	   $sth->bind_param(2,int($update_mid),3); 
    	   $sth->bind_param(3,$update_date,1); 
    	   $sth->bind_param(4,int($form_id),3); 
		   $sth->execute();
	};
	if (!DA::Session::exception($session)) {
    	DA::Error::system_error($session);
	}
}

sub put_answerlist_user {
	my ($session,$form,$store_id)=@_;
    my $master=DA::IS::get_master($session,'ns_board');
	my $today=DA::CGIdef::get_date2($session,"Y4/MM/DD HH:MI:SS");

	DA::Session::trans_init($session);
	eval {
        my $d_sql="DELETE FROM ns_answer_check WHERE form_id=? AND store_id=?";
        my $d_sth=$session->{dbh}->prepare($d_sql);
           $d_sth->bind_param(1,int($form->{form_id}),3);
           $d_sth->bind_param(2,int($store_id),3);
           $d_sth->execute();

    	my $b_sql="INSERT INTO ns_answer_check (form_id,store_id,title,"
    	 . "update_mid,update_date,check_mid,status) VALUES (?,?,?,?,?,?,?)";
    	my $b_sth=$session->{dbh}->prepare($b_sql);
    	foreach my $boss (split(/\,/,$master->{boss})) {
        	$b_sth->bind_param(1,int($form->{form_id}),3);
        	$b_sth->bind_param(2,int($store_id),3);
        	$b_sth->bind_param(3,$form->{title},1);
        	$b_sth->bind_param(4,$session->{user},3);
        	$b_sth->bind_param(5,$today,1);
        	$b_sth->bind_param(6,$boss,3);
        	$b_sth->bind_param(7,1,3);
        	$b_sth->execute();
    	}
	};
	if (!DA::Session::exception($session)) {
    	DA::Error::system_error($session);
	}
}

sub get_target_group {
    my ($session,$data)=@_;
	my $target_group={};
	my $member_table=DA::IS::get_member_table($session);
	my $group_table =DA::IS::get_group_table($session);
	my $m_sql="SELECT name,kana,sort_level,type FROM $member_table WHERE mid=?";
	my $m_sth=$session->{dbh}->prepare($m_sql);
	my $g_sql="SELECT name,kana,sort_level,type FROM $group_table WHERE gid=?";
	my $g_sth=$session->{dbh}->prepare($g_sql);
	my $keys=[('o_target1','o_target2','o_target3','p_target')];
	foreach my $key (@$keys) {
    	foreach my $gid (split(/[\,\|]/, $data->{$key})) {
			if ($gid < $DA::Vars::p->{top_gid}) {
        		$m_sth->bind_param(1,int($gid),3); $m_sth->execute();
        		my $member=$m_sth->fetchrow_hashref('NAME_lc');
				$target_group->{$gid}=$member;
			} else {
				my $down=DA::IS::get_all_down_group($session, $gid);
				push(@{$down},$gid);
				foreach my $sub (@$down) {
        			$g_sth->bind_param(1,int($sub),3); $g_sth->execute();
        			my $group=$g_sth->fetchrow_hashref('NAME_lc');
					if ($group->{type} ne 1) { next; }
					$target_group->{$sub}=$group;
				}
			}
		}
	}

	$m_sth->finish;
	$g_sth->finish;

    foreach my $gid (split(/[\,\|]/, $data->{e_target})) {
		delete $target_group->{$gid};
	}

	DA::Custom::override_ns_target_group_list($session,$data,$target_group);

	return($target_group);
}
sub get_target_user {
    my ($session,$data,$force)=@_;
	my $count=0;
	my $member={};
	my $max_count=500;
	my $over = 0;
	for (my $i=1; $i<=3; $i++) {
    	my $o_list={};
    	my $o_key="o_target$i";
    	foreach my $id (split(/,/,$data->{$o_key})) {
        	if ($id < $DA::Vars::p->{top_gid}) {
            	$o_list->{$id}=1;
        	} else {
            	my $user_list=DA::IS::get_all_user_list($session,$id,0,1);
            	foreach my $mid (@{$user_list}) { $o_list->{$mid}=1; }
        	}
    	}
    	my $n_key="n_target$i";
		if ($data->{$n_key}) {
    		my $n_list={};
       		foreach my $id (split(/,/,$data->{$n_key})) {
        		if ($id < $DA::Vars::p->{top_gid}) {
            		$n_list->{$id}=1;
				} else {
           			my $user_list=DA::IS::get_all_user_list($session,$id,0,1);
            		foreach my $mid (@{$user_list}) { $n_list->{$mid}=1; }
				}
        	}
        	foreach my $mid (keys %{$o_list}) {
           		if (!$n_list->{$mid}) { delete $o_list->{$mid}; }
        	}
		}
    	foreach my $mid (keys %{$o_list}) {
        	$count++;
        	if (!$force && $count > $max_count) { $over=1; last; }
        	$member->{$mid}=1;
    	}
	}

	# 追加ユーザ･グループ
	foreach my $id (split(/,/,$data->{p_target})) {
    	if ($id < $DA::Vars::p->{top_gid}) {
        	$member->{$id}=1;
    	} else {
        	my $user_list=DA::IS::get_all_user_list($session,$id,0,1);
        	foreach my $mid (@{$user_list}) { $member->{$mid}=1; }
    	}
	}
	# 除外ユーザ･グループ
	foreach my $id (split(/,/,$data->{e_target})) {
    	if ($id < $DA::Vars::p->{top_gid}) {
        	delete $member->{$id};
    	} else {
        	my $user_list=DA::IS::get_all_user_list($session,$id,0,1);
        	foreach my $mid (@{$user_list}) { delete $member->{$mid}; }
    	}
	}

	DA::Custom::override_ns_target_user_list($session,$data,$force,\$over,$member);

	return($member,$over);
}

sub get_form_sum {
my ($session,$form,$list_num,$sort)=@_;
my $target_group=DA::Ns::get_target_group($session,$form);
my $tar_count=scalar keys %{$target_group};

my $test_sql;
if ($form->{test_data}) {
    $test_sql="save_mode IN (0,3)";
} else {
    $test_sql="save_mode=3";
}

my $table;
if ($form->{form_type}) {
    $table="ns_form_ext_".DA::CGIdef::get_last_n($form->{form_id},2);
} else {
    $table="ns_form_data_".DA::CGIdef::get_last_n($form->{form_id},2);
}
my $users={};
my $sql="SELECT mid,gid FROM $table WHERE form_id=? AND $test_sql";
my $sth=$session->{dbh}->prepare($sql);
   $sth->bind_param(1,int($form->{form_id}),3); $sth->execute();
while (my ($mid,$gid)=$sth->fetchrow) {
    if ($target_group->{$mid}) {
        $users->{$mid}++;
    } elsif ($target_group->{$gid}) {
        $users->{$gid}++;
    } else {
        $users->{other}++;
    }
    $users->{total}++;
}
$sth->finish;

my $asc="<img src=$session->{img_rdir}/sort_asec.gif border=0 "
 . "width=7 height=11 hspace=2 title=\"@{[t_('昇順')]}\">";
my $dsc="<img src=$session->{img_rdir}/sort_desc.gif border=0 "
 . "width=7 height=11 hspace=2 title=\"@{[t_('降順')]}\">";

my @groups;
my $sort_param={};
if ($sort eq 'kana1') {
    $sort_param->{icon}->{kana}=$asc;
    $sort_param->{next}->{kana}='kana2';
    foreach my $gid (
        sort { $target_group->{$a}->{kana} cmp $target_group->{$b}->{kana} }
        keys %$target_group) {
            push(@groups,$gid);
    }
} else {
    $sort_param->{icon}->{kana}=$dsc;
    $sort_param->{next}->{kana}='kana1';
    foreach my $gid (
        sort { $target_group->{$b}->{kana} cmp $target_group->{$a}->{kana} }
        keys %$target_group) {
            push(@groups,$gid);
    }
}

my $other_count=DA::CGIdef::int_format($users->{other});
my $total_count=DA::CGIdef::int_format($users->{total});

my $group_tag;
my $other_tag;

## 匿名回答の場合は「対象組織」欄、「その他(セカンダリ所属ユーザ)」欄を表示しない
## add seiichi 2008/8/21
if ( $form->{anonymous} eq '1' ){
    $group_tag.="<tr height=20>"
    ."<td nowrap bgcolor=$DA::Vars::p->{title_color}>"."@{[t_('匿名ユーザ')]}"."</td>"
    ."<td bgcolor=#FFFFFF align=right>$total_count</td></tr>";
} else{
	foreach my $gid (@groups) {
    	my $v_name=DA::IS::get_ug_name($session,1,$gid);
		my $count=DA::CGIdef::int_format($users->{$gid});
    	$group_tag.="<tr height=20>"
    	."<td nowrap bgcolor=$DA::Vars::p->{title_color}>$v_name->{table}</td>"
    	."<td bgcolor=#FFFFFF align=right>$count</td></tr>";
	}

	$other_tag	.="<tr height=20>"
				."<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>"
				."@{[t_('その他')]}(@{[t_('セカンダリ所属ユーザ')]})</td>"
				."<td bgcolor=#FFFFFF align=right>$other_count</td></tr>";
}

my $tag=<<buf_end;
<TABLE WIDTH=300 BORDER=0 CELLPADDING=0 CELLSPACING=0>
<TR><TD BGCOLOR=$DA::Vars::p->{base_color}>

<TABLE WIDTH=100% BORDER=0 CELLSPACING=1 CELLPADDING=1><tr height=20>
<td nowrap align=center BGCOLOR=$DA::Vars::p->{title_color} width=50%>
<a href=$DA::Vars::p->{cgi_rdir}/ns_simple_form_status.cgi?form_id=$form->{form_id}&list_num=$list_num&p_sort=$sort_param->{next}->{kana}>@{[t_('対象組織(ユーザ)名')]}</a>$sort_param->{icon}->{kana}</td>
<td nowrap align=center BGCOLOR=$DA::Vars::p->{title_color}>
@{[t_('回答数')]}</td></tr>

$group_tag
$other_tag

<tr height=20>
<td nowrap bgcolor=$DA::Vars::p->{title_color} align=right>
@{[t_('合　計')]}</td>
<td bgcolor=#FFFFFF align=right>$total_count</td></tr>

</tr></table>

</td></tr></table>
buf_end

return ($tag);

}

sub input_check {
	my ($session,$clone,$data,$error)=@_;
	my $cell_id=$clone->{cell_id};
    # 入力必須チェック
    if ($clone->{must_check} eq 'on') {
        if ($clone->{type} =~ /^[123]$/) {
            if ($data->{$cell_id} eq '') {
                $error->{$cell_id}=t_('[%1]は入力必須項目です。',$clone->{title});
            }
        } elsif ($clone->{type} =~ /^[5]$/) {
            my $chk;
            foreach my $hash (@{$clone->{options}}) {
                my $key="$cell_id\_$hash->{option_no}";
                if ($data->{$key}) { $chk=1; }
            }
            if (!$chk) {
                $error->{$cell_id}=t_('[%1]は入力必須項目です。',$clone->{title});
            }
        }
    }
    # 数値チェック
    if ($clone->{type} eq '2') {
        my $value=$data->{$cell_id};
        if ($value ne '' && DA::CGIdef::is_number($value) eq '') {
            $error->{$cell_id}=t_('[%1]は数値のみ入力可能です。',$clone->{title});
        }
    }
    # 日付チェック
    if ($clone->{type} eq '7') {
        my $yy=$data->{"$cell_id\_yy"};
        my $mm=$data->{"$cell_id\_mm"};
        my $dd=$data->{"$cell_id\_dd"};
        my $check="$yy/$mm/$dd";
        if ($check ne DA::CGIdef::get_target_date($check,0,"Y4/MM/DD")){
            $error->{$cell_id}=t_('[%1]は無効な日付が選択されています。',$clone->{title});
        }
    }
    # 入力長さチェック  #チェックボックス と 日付選択 を対象外
    if ($clone->{type} =~ /^[12346]$/ ) {
    	my $value = $data->{$cell_id};
    	if (my $msg = DA::Ns::input_length($value,'ns_form_data','store_data')) {
			DA::CGIdef::errorpage($session,$msg);
		}
    }
	# チェックボックスの入力長さチェック
	if ($clone->{type} eq 5) {
		my $value;
        foreach my $hash (@{$clone->{options}}) {
            if ($data->{"$cell_id\_$hash->{option_no}"}) {
                my $opt=$data->{"$cell_id\_$hash->{option_no}"};
                $value.=DA::CGIdef::encode($opt,2,0,'euc')."\n";
            }
        }
    	if (my $msg = DA::Ns::input_length($value,'ns_form_data','store_data')) {
			$msg=t_('選択可能なオプションの最大値を超えています。');
			DA::CGIdef::errorpage($session,$msg);
		}
	}
}

sub get_target_table {
    my ($session,$start_date,$close_date,$del_mode)=@_;
	# $del_mode=1 : CREATE TABLE を実行しない
    my ($s_yy,$s_mm,$s_dd)=split(/[\/\-\s+]/,$start_date,3);
    my ($c_yy,$c_mm,$c_dd)=split(/[\/\-\s+]/,$close_date,3);
    my @target_table;

    # ポートレット一覧用の月別テーブルを作成
    my $yymm={};
    my $this="$s_yy/$s_mm/01";
    while ($this lt "$c_yy/$c_mm/01") {
        $this=DA::CGIdef::get_target_date_m($this,"+1","Y4/MM/01");
        my ($t_yy,$t_mm,$t_dd)=split(/[\/\-\s+]/,$this,3);
        $yymm->{"$t_yy$t_mm"}=1;
    }
    $yymm->{"$s_yy$s_mm"}=1; $yymm->{"$c_yy$c_mm"}=1;

    my $tables=DA::DB::get_db_tables($session);
    foreach my $ym (sort keys %{$yymm}) {
        if (!$del_mode && !$tables->{"ns_board_$ym"}) {
            DA::DB::create_table($session,'ns_board',"ns_board_$ym");
        }
        push(@target_table,"ns_board_$ym");
    }

    return (@target_table);
}

sub put_library_file_tab {
    my ($session,$query,$num,$param,$file)=@_;
    if (!$file->{docno}) { return; }
    
    my $module=DA::IS::get_module($session,0);
    if ($module->{dcm} ne 'on') { return; }

	# ファイル共有タイプのみに限定 (プライベートを除く)
	my $folder=DA::Lib::get_folder_data($session,$file->{bid});
	if ($folder->{style} ne 4) { return; }
	if ($folder->{gid} < $DA::Vars::p->{top_gid}) { return; }

    # 発信グループ設定のチェック
    my $join=DA::IS::get_join_group($session,$session->{user},1);
    if ($join->{$folder->{gid}}->{attr} !~ /[12UW]/) { return; }
    my $master=DA::IS::get_master({ user => $folder->{gid} },'ns_board');
	if ($master->{select_folder} =~ /\d+/) {
		my $send_permit;
    	foreach my $line (split(/\,/,$master->{select_folder})) {
        	my ($c_gid,$c_bid)=split(/\:/,$line,2);
        	if ($folder->{bid} eq $c_bid) { $send_permit=1; }
		}
    	if (!$send_permit) { return; }
	}

    # 登録可能ユーザのチェック
    my $ns_conf=DA::IS::get_sys_custom($session,'ns_board');
    my $permit=DA::Ns::regist_permit($session,$join,$ns_conf);
    if (!$permit->{normal} && !$permit->{reply}) { return; }

	my $cgi = ($ns_conf->{richtext} eq 'on') ? 'ns_view_detail.cgi' : 'ns_board_detail.cgi';

	# 新規登録
    my $tab_param="bid=$file->{bid}&docno=$file->{docno}&file_num=$num";
    my $tab_name=t_('連絡事項に登録');

   	$param->{tabs}++;
   	$param->{"tab_name$param->{tabs}"}="&nbsp;&nbsp;$tab_name&nbsp;&nbsp;";
   	$param->{"tab_href$param->{tabs}"}="$DA::Vars::p->{cgi_rdir}/$cgi?$tab_param";
	if ($param->{select_num} eq 'new') { $param->{tab_on}=$param->{tabs}; }
	my $new_tab=$param->{tabs};

    # 既に連絡事項に登録されている場合
    my $sql="SELECT num FROM ns_board_contents WHERE type=? AND pathname=?";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,'url',1);
       $sth->bind_param(2,"$file->{bid}:$file->{docno}",1);
       $sth->execute();
	my $ix=1;
    while (my $b_num=$sth->fetchrow) {
        my $tab_param="id=$b_num&mode=detail&file_num=$num";
		my $board =DA::Ns::get_board_data($session,$b_num);
		my $status=DA::Ns::get_status_name($session,$board);
        my $tab_name=t_('連絡事項').$ix.$status;

    	$param->{tabs}++;
    	$param->{"tab_name$param->{tabs}"}="&nbsp;&nbsp;$tab_name&nbsp;&nbsp;";
    	$param->{"tab_href$param->{tabs}"}="$DA::Vars::p->{cgi_rdir}/$cgi?$tab_param";
		if ($param->{select_num} eq $b_num) { $param->{tab_on}=$param->{tabs}; }
		$ix++;
	}
	$sth->finish;

	if (!$param->{tab_on}) { $param->{tab_on}=$new_tab; }

	DA::Custom::put_library_file_tab($session,$query,$num,$param,$file);
}

sub login_main_top {
    my ($session,$query,$port,$reload,$date,$port_conf)=@_;

    my $button;
    my $join=DA::IS::get_join_group($session,$session->{user},1);
    my $ns_conf=DA::IS::get_sys_custom($session,'ns_board');
	if (!$ns_conf->{portlet}) { $ns_conf->{portlet}='group'; }
	my $d_cgi = ($ns_conf->{richtext} eq 'on') ? 'ns_view_detail.cgi' : 'ns_board_detail.cgi';

    #======================================================
    #              ----custom----
    #======================================================
    my ($skip,$hidden_portlet) = DA::Custom::hidden_ns_board_portlet($session,$query,$ns_conf);
    if ($hidden_portlet) {return;}

    unless($skip){
        if ($ns_conf->{portlet_permit} ) {
            # spaceに値がある時→メインポータル以外のポータル
            if ($query->param('space') || $session->{space}) {
                # 「メインポータルにのみ表示」の場合
                if ($ns_conf->{portlet_permit} eq 'main') {
                    return;
                # 「プライマリ所属グループポータルにのみ表示」の場合
                } elsif ($ns_conf->{portlet_permit} eq 'group') {
                    if ( ! ($query->param('space') eq $session->{primary} || $session->{space} eq $session->{primary} ) ) {
                        return;
                    }
                }
            } else {
                if ($ns_conf->{portlet_permit} eq 'group') { return; }
            }
        } else {
            #　「ポータルに表示しない」の場合
            if ($ns_conf->{portlet} eq 'none') {
                return;
            # spaceに値がある時→メインポータル以外のポータル
            } elsif ($query->param('space') || $session->{space}) {
                # 「メインポータルにのみ表示」の場合
                if ($ns_conf->{portlet} eq 'main') {
                    return;
                # 「プライマリ所属グループポータルにのみ表示」の場合
                } elsif ($ns_conf->{portlet} eq 'group') {
                    if ( ! ($query->param('space') eq $session->{primary} || $session->{space} eq $session->{primary} ) ) {
                        return;
                    }
                }
            } else {
                if ($ns_conf->{portlet} eq 'group') { return; }
            }
        }
    }

    my $tmpl = DA::IS::get_top_page_tmpl($session,$port);

    my $tag;
    if ($port->{close}->{dcm} ne 'close') {
        $tag="<iframe width=100% height=50 src=/cgi-bin/ns_board_frame.cgi?"
        . "reload=$reload name=ns_board_frame id=ns_board_frame scrolling=no "
        . "marginwidth=0 frameborder=0></iframe><br>";
    }

    my $permit=DA::Ns::regist_permit($session,$join,$ns_conf);

    if ($permit->{normal} || $permit->{reply}) {
		my $regist_url=$d_cgi."%3fmode=add";
		if($session->{menu_style} eq "preset" && $session->{portlet_style} eq "preset"){
	     	$button = DA::Portal::get_button4preset($session,
				    "javascript:Pop('$regist_url','pop_title_board_info.gif',780,850);",t_('登録'));
		} else{
        	$button="<img src=$session->{img_rdir}/aqbtn_regist.gif border=0 width=30 height=15 "
        	."onClick=\"Pop('$regist_url','pop_title_board_info.gif',780,850);\" "
        	."style=\"cursor:pointer;\" title=\"@{[t_('登録')]}\">";
		}
    }
    if ($port->{portal_conf_button} ne 'off') {
    	if($session->{menu_style} eq "preset" && $session->{portlet_style} eq "preset"){
			my $href = "javascript:Pop('ns_board_view.cgi?win=pop','pop_title_setboard.gif',450,420);";
			my $text = t_('表示設定');
            $button.= DA::Portal::get_button4preset2($session, $href, $text);
    	} else{
        	$button.="<a href=\"javascript:Pop('ns_board_view.cgi?win=pop',"
        		."'pop_title_setboard.gif',450,420)\"><img src=$session->{img_rdir}/"
        		."aqbtn_setview.gif width=52 height=15 border=0 title=\"@{[t_('表示設定')]}\"></a>";
    	}
    }
    $button.=DA::Portal::get_close_button($session,$date,$port,'dcm');

    $button=~s/__INFO_PLACE__/top/g;

    #======================================================
    #              ----custom----
    #======================================================
    DA::Custom::rewrite_ns_board_portlet($session,$query,$port,$reload,$date,$port_conf,\$tag,\$button);

    $tmpl->param(
        IMG_RDIR  => $session->{img_rdir},
        TITLE_GIF => "tbar_title_dcm.gif",
        TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset')
            ? t_('連絡・通知') : "",
        BUTTON    => $button,
		DD_HEADER => ($port_conf->{drag_drop} eq 'on') ? "<tr style=\"cursor:no-drop\">" : "<tr>",
        CONTENTS  => $tag
    );
    # return ($tmpl->output);

	my $tags=DA::Portal::insert_div_tag($tmpl->output, "dcm_top_refreshDiv");

    return ($tags);
}

sub get_config_tab {
	my ($session,$tab_on)=@_;
	my $param={};
	$param->{tabs}=7;
	$param->{tab_on}=$tab_on;
	$param->{tab_name1}="&nbsp;&nbsp;@{[t_('管理グループ設定')]}&nbsp;&nbsp;";
	$param->{tab_href1}="$DA::Vars::p->{cgi_rdir}/ns_config_admin.cgi";
	$param->{tab_name2}="&nbsp;&nbsp;@{[t_('発信グループ設定')]}&nbsp;&nbsp;";
	$param->{tab_href2}="$DA::Vars::p->{cgi_rdir}/ns_config_group.cgi";
	$param->{tab_name3}="&nbsp;&nbsp;@{[t_('メールグループ設定')]}&nbsp;&nbsp;";
	$param->{tab_href3}="$DA::Vars::p->{cgi_rdir}/ns_config_mail.cgi";
	$param->{tab_name4}="&nbsp;&nbsp;@{[t_('期間設定')]}&nbsp;&nbsp;";
	$param->{tab_href4}="$DA::Vars::p->{cgi_rdir}/ns_config_term.cgi";
	$param->{tab_name5}="&nbsp;&nbsp;@{[t_('許可設定')]}&nbsp;&nbsp;";
	$param->{tab_href5}="$DA::Vars::p->{cgi_rdir}/ns_config_permit.cgi";
	$param->{tab_name6}="&nbsp;&nbsp;@{[t_('表示項目設定')]}&nbsp;&nbsp;";
	$param->{tab_href6}="$DA::Vars::p->{cgi_rdir}/ns_config_list.cgi";
	$param->{tab_name7}="&nbsp;&nbsp;@{[t_('表示設定')]}&nbsp;&nbsp;";
	$param->{tab_href7}="$DA::Vars::p->{cgi_rdir}/ns_config_etc.cgi";

	DA::Custom::put_ns_config_tab($session,$param);

	return($param);
}
sub get_setting_tabs {
	my ($session,$config)=@_;
	my $param={};
    $param->{tabs}= (($config->{user_read_data} && $config->{user_read_data} ne 'off') && $config->{user_label_controller} eq 'on' && $config->{user_label} eq 'on') ? 3 : 2;
    $param->{tab_on}=1;
    $param->{tab_name1}=t_('表示設定');
    $param->{tab_href1}="$DA::Vars::p->{cgi_rdir}/ns_board_view.cgi";
	if ($ENV{SCRIPT_NAME}=~/ns_board_view.cgi/) { $param->{tab_on}=1; }
    $param->{tab_name2}=t_('上長設定');
    $param->{tab_href2}="$DA::Vars::p->{cgi_rdir}/ns_board_boss.cgi";
	if ($ENV{SCRIPT_NAME}=~/ns_board_boss.cgi/) { $param->{tab_on}=2; }
    $param->{tab_name3}=t_('ラベル設定');
    $param->{tab_href3}="$DA::Vars::p->{cgi_rdir}/ns_board_label.cgi";
	if ($ENV{SCRIPT_NAME}=~/ns_board_label.cgi/) { $param->{tab_on}=3; }
	return($param);
}

sub check_ug_nums {
   my ($session,$val,$map)=@_;
   my $error={};
   foreach my $k (keys %{$map}){
	   my @target;
       if (ref ($val->{$k}) eq 'HASH') {
           @target = keys %{$val->{$k}};
       } else {
           @target = split (/\,/,$val->{$k});
       }
       if (50 < scalar(@target)){
           my $msg = t_("%1に設定できるユーザ・グループは５０件までです。",$map->{$k});
		   $error->{$k} = "<br><font color=red>".$msg."</font>";
       }
   }
   return $error;
}

# バッチ処理
sub daily_proc {
	my ($session)=@_;
    my $conf=DA::IS::get_sys_custom($session,'ns_board');
	if (!$conf->{save_term} && !$conf->{save_read_term}) { return; }

	print DA::CGIdef::get_date('HH:MI:SS')." :DCM daily proc started.\n";

	my $delete_date = $conf->{delete_date} eq "close" ? "close_date" : "update_date";
    my $today=DA::CGIdef::get_date('Y4/MM/DD');
	if ($conf->{save_term}) {
    	my $check_date=DA::CGIdef::get_target_date_m($today,"-$conf->{save_term}",'Y4/MM/DD');

    	my $sql="SELECT num,form_id,update_date,start_date,close_date FROM ns_board "
    	 . "WHERE $delete_date < ? AND admin = 0";
    	my $sth=$session->{dbh}->prepare($sql);
    	   $sth->bind_param(1,$check_date,1); $sth->execute();
    	while (my ($num,$form_id,$update_date,$start_date,$close_date)=$sth->fetchrow) {
        	&daily_delete_data($session,$num,$start_date,$close_date);
        	if ($form_id) { &daily_delete_form_data($session,$form_id); }
    	}
    	$sth->finish;

    	if($delete_date eq "update_date"){
        	$check_date=~s/\//\-/g;
        	$check_date.=" 00:00:00";
    	}
    	$sql="SELECT form_id,update_date FROM ns_form WHERE $delete_date < ?";
    	$sth=$session->{dbh}->prepare($sql);
    	$sth->bind_param(1,$check_date,1); $sth->execute();
    	while (my ($form_id,$update_date)=$sth->fetchrow) {
        	&daily_delete_form_data($session,$form_id);
    	}
    	$sth->finish;
	}

	print DA::CGIdef::get_date('HH:MI:SS')." :DCM daily proc finished.\n";

	if (!$conf->{save_read_term}) { return; }

	print DA::CGIdef::get_date('HH:MI:SS')." :DCM read delete started.\n";

    DA::Session::trans_init($session);
    eval {
    	my $check_date =DA::CGIdef::get_target_date_m($today,"-$conf->{save_read_term}",'Y4/MM/DD');
    	   $check_date.=" 00:00:00";
		for (my $i=0; $i<100; $i++) {
			my $table = 'ns_board_read_'.sprintf("%02d",$i);
			my $d_sql="DELETE FROM $table WHERE mark IS NULL AND hidden IS NULL AND ans_date IS NULL AND read_date < ?";
    		my $d_sth=$session->{dbh}->prepare($d_sql);
    		   $d_sth->bind_param(1,$check_date,1); 
			   $d_sth->execute();
			my $u_sql="UPDATE $table SET read_date=NULL WHERE hidden IS NULL AND read_date < ?";
    		my $u_sth=$session->{dbh}->prepare($u_sql);
    		   $u_sth->bind_param(1,$check_date,1); 
			   $u_sth->execute();
			$session->{dbh}->commit();
			print DA::CGIdef::get_date('HH:MI:SS')." :DCM delete $table end.\n";
		}
		for (my $i=0; $i<100; $i++) {
			my $table = 'ns_user_read_'.sprintf("%02d",$i);
			my $d_sql="DELETE FROM $table WHERE mark IS NULL AND hidden IS NULL AND ans_date IS NULL AND read_date < ?";
    		my $d_sth=$session->{dbh}->prepare($d_sql);
    		   $d_sth->bind_param(1,$check_date,1); 
			   $d_sth->execute();
			my $u_sql="UPDATE $table SET read_date=NULL WHERE hidden IS NULL AND read_date < ?";
    		my $u_sth=$session->{dbh}->prepare($u_sql);
    		   $u_sth->bind_param(1,$check_date,1); 
			   $u_sth->execute();
			$session->{dbh}->commit();
			print DA::CGIdef::get_date('HH:MI:SS')." :DCM delete $table end.\n";
		}
    };
    if(!DA::Session::exception($session)){
        print "Error delete DCM read data\n";
    }

	print DA::CGIdef::get_date('Y4/MM/DD HH:MI:SS')." :DCM read delete finished.\n";
}
sub daily_delete_data {
    my ($session,$num,$start_date,$close_date)=@_;
    DA::Session::trans_init($session);
    eval {
        my ($sql,$sth);
        # 連絡事項データの削除
        my @target_table=DA::Ns::get_target_table($session,$start_date,$close_date,1);
        foreach my $table_name (@target_table) {
            my $tables=DA::DB::get_db_tables($session,$table_name);
            if (!$tables->{$table_name}) { next; }
            my $sql="DELETE FROM $table_name WHERE num=?";
            my $sth=$session->{dbh}->prepare($sql); $sth->execute($num);
        }
        $sql="DELETE FROM ns_board WHERE num=?";
        $sth=$session->{dbh}->prepare($sql);
        $sth->bind_param(1,int($num),3);
        $sth->execute();

        # 既読データの削除
		DA::Ns::clear_read($session,$num);

        # 添付ファイルデータの削除
        $sql="DELETE FROM ns_board_contents WHERE num=?";
        $sth=$session->{dbh}->prepare($sql);
        $sth->bind_param(1,int($num),3);
        $sth->execute();

        my $d_num=DA::CGIdef::get_last_n($num,2);
        my $d_dir="$DA::Vars::p->{data_dir}/ns_board/$d_num/$num";
        File::Path::rmtree($d_dir);

        # リッチテキスト関連のディレクトリを削除
        my $r_dir="$DA::Vars::p->{base_dir}/insuite/ns_board/$d_num/$num";
        File::Path::rmtree($r_dir);
    };
    if(!DA::Session::exception($session)){
        print "Error delete DCM data : $num\n";
    }

    my $data = {};
    $data->{num} = $num;
    $data->{start_date} = $start_date;
    # 検索インデックスの削除
    DA::NsView::delete_index($session,$data);
}
sub daily_delete_form_data {
    my ($session,$form_id)=@_;
    DA::Session::trans_init($session);
    eval {
        my ($sql,$sth);
        $sql="DELETE FROM ns_form WHERE form_id=?";
        $sth=$session->{dbh}->prepare($sql); $sth->execute($form_id);
        $sql="DELETE FROM ns_form_line WHERE form_id=?";
        $sth=$session->{dbh}->prepare($sql); $sth->execute($form_id);
        $sql="DELETE FROM ns_form_item WHERE session_id LIKE '$form_id\.%'";
        $sth=$session->{dbh}->prepare($sql); $sth->execute();
        $sql="DELETE FROM ns_form_group WHERE form_id=?";
        $sth=$session->{dbh}->prepare($sql); $sth->execute($form_id);
        my $dat_table="ns_form_data_".DA::CGIdef::get_last_n($form_id,2);
        $sql="DELETE FROM $dat_table WHERE form_id=?";
        $sth=$session->{dbh}->prepare($sql); $sth->execute($form_id);
        my $ext_table="ns_form_ext_".DA::CGIdef::get_last_n($form_id,2);
        $sql="DELETE FROM $ext_table WHERE form_id=?";
        $sth=$session->{dbh}->prepare($sql); $sth->execute($form_id);
    };
    if(!DA::Session::exception($session)){
        print "Error delete DCM form data : $form_id\n";
    }
}

sub hourly_proc {
	my ($session)=@_;
	my $conf=DA::IS::get_sys_custom($session,'ns_board');
	if (!$conf->{notice_date}) { return; }

	print DA::CGIdef::get_date('HH:MI:SS')." :DCM hourly proc started.\n";

	my $now  =DA::CGIdef::get_date('HH');
	my $today=DA::CGIdef::get_date("Y4/MM/DD HH:00");

	# テスト用の日付設定
	# $today='2013/04/13 10:00';
	# $now='09';

	my $m_sql="SELECT email,user_lang FROM is_member WHERE mid=?";
	my $m_sth=$session->{dbh}->prepare($m_sql);
	   $m_sth->bind_param(1,$DA::Vars::p->{insuite_mid},3); $m_sth->execute();
	my ($admin_email,$admin_lang)=$m_sth->fetchrow;

	# 要回答のみ未回答者に確認メールを送信
	my $sql="SELECT * FROM ns_board WHERE p_level=1 AND status=2";
	my $sth=$session->{dbh}->prepare($sql); $sth->execute();
	while (my $data=$sth->fetchrow_hashref('NAME_lc')) {
		if (!$data->{dead_date}) { next; }
		if (!$data->{notice_mail}) { next; }

		my ($d_yy,$d_mm,$d_dd,$d_hh,$d_mi)=split(/[\/\-\:\s]/,$data->{dead_date});
		if (!$d_yy) { next; }

		$d_hh='00' if ($d_hh eq '');

		# 一日一回だけ送信
		if ($d_hh ne $now) { next; }

		# メールが来ても表示されなければ回答できないため
    	# 回答期限後の表示期を過ぎていれば送信しない
    	my $check_date;
    	if ($conf->{over_term} eq 'day') {
    		$check_date=DA::CGIdef::get_target_date("$d_yy/$d_mm/$d_dd",
        		$conf->{over_date},"Y4/MM/DD $d_hh:$d_mi");
    	} else {
        	$check_date=DA::CGIdef::get_target_date_m("$d_yy/$d_mm/$d_dd",
                $conf->{over_date},"Y4/MM/DD $d_hh:$d_mi");
    	}
    	if ($check_date lt $today) { next; }

		my $max_date=DA::CGIdef::get_target_date("$d_yy/$d_mm/$d_dd",
			$conf->{notice_date},"Y4/MM/DD $d_hh:$d_mi");

		# 要回答の場合、回答期限を超えて回答がないユーザに警告メールを送信
   		if ($data->{dead_date} gt $today) { next; }

		# メール送信期間を超えている場合はスキップする
   		if ($today gt $max_date) { next; }

		my $member=&hourly_get_member($session,$data,$m_sth,$admin_email,$today);
	}
	$sth->finish;
	$m_sth->finish;

	print DA::CGIdef::get_date('HH:MI:SS')." :DCM hourly proc finished.\n";
}
sub hourly_get_member {
	my ($session,$data,$m_sth,$admin_email,$today)=@_;

	# 確認メールの送信先は回答フォームの回答対象者を見て送信
	if ($data->{confine_mail}) {
		my $form=DA::Ns::get_form_data($session,$data->{form_id});
		$data->{area}=$form->{area};
		$data->{o_target1}=$form->{o_target1};
		$data->{o_target2}=$form->{o_target2};
		$data->{o_target3}=$form->{o_target3};
		$data->{n_target1}=$form->{n_target1};
		$data->{n_target2}=$form->{n_target2};
		$data->{n_target3}=$form->{n_target3};
		$data->{p_target} =$form->{p_target};
		$data->{e_target} =$form->{e_target};
	}

	my ($a_member,$error) = DA::Ns::get_target_user($session,$data,1);

    # form_type,form_dup を取得
    my $form_sql="SELECT form_type,form_dup FROM ns_form WHERE form_id=?";
    my $form_sth=$session->{dbh}->prepare($form_sql);
       $form_sth->bind_param(1,int($data->{form_id}),3); $form_sth->execute();
    my ($form_type, $form_dup)=$form_sth->fetchrow; $form_sth->finish;

	my $test_sql;
	if ($data->{test_data}) {
		$test_sql="save_mode IN (0,2,3)";
	} else {
		$test_sql="save_mode IN (2,3)";
	}
	# 回答済みユーザの除外
	my $table;
	if ($form_type) {
		$table="ns_form_ext_".DA::CGIdef::get_last_n($data->{form_id},2);
	} else {
		$table="ns_form_data_".DA::CGIdef::get_last_n($data->{form_id},2);
	}

    my $exist_gid={};
	my $sql="SELECT mid,gid FROM $table WHERE form_id=? AND $test_sql";
	my $sth=$session->{dbh}->prepare($sql); 
	   $sth->bind_param(1,int($data->{form_id}),3); $sth->execute();
	while(my($mid,$gid)=$sth->fetchrow){
		delete $a_member->{$mid};
        $exist_gid->{$gid} = 1;
	}
	$sth->finish;

    # グループで１つの回答を受け取る場合
    if ($form_dup eq '3') {
        my $g_sql="SELECT primary_gid FROM is_member WHERE mid=? ";
        my $g_sth=$session->{dbh}->prepare($g_sql);
        foreach my $mid (keys %$a_member) {
            $g_sth->bind_param(1,int($mid),3); $g_sth->execute();
            my ($p_gid)=$g_sth->fetchrow;
            if ($exist_gid->{$p_gid}) {
                delete $a_member->{$mid};
            }
        }
        $g_sth->finish;
    }

	DA::Custom::ns_hourly_send_mail($session,$data,$a_member,$today);

	# 未回答ユーザにメールを送信
	foreach my $mid (keys %$a_member) {
		&hourly_send_mail($session,$mid,$m_sth,$data,$admin_email);
	}
}
sub hourly_send_mail {
	my ($session,$mid,$m_sth,$data,$admin_email)=@_;

	$m_sth->bind_param(1,int($mid),3);
	$m_sth->execute();
	my ($email,$user_lang)=$m_sth->fetchrow;
	if (!$user_lang) { $user_lang='ja'; }

	DA::IS::set_temp_lang($session, $user_lang);

	my $start=DA::CGIdef::get_display_date2($session,$data->{start_date},2);
	my $close=DA::CGIdef::get_display_date2($session,$data->{close_date},2);
	my $dead =DA::CGIdef::get_display_date2($session,$data->{dead_date},2);

	my $title=t_('[掲示板]アンケートからのお知らせ');
	my $body=<<buf_end;
@{[t_('以下のアンケートフォームの回答期限が過ぎています。')]}

@{[t_('タイトル')]} : $data->{title}
@{[t_('回答期限')]} : $dead

@{[t_('連絡事項ポートレットをご確認ください。')]}
buf_end

    my $mail = {
        'name'      => t_('システム管理者'),
        'from'      => $admin_email,
        'to'        => $email,
        'subject'   => $title,
        'body'      => $body,
    };
    DA::Mailer::send_mail($mail,$session);
	DA::IS::clear_temp_lang($session);

    print "DCM $email send_mail processed.\n";
}

sub get_nsboard_category_name {
	my($session,$category_tree,$category_ids) = @_;
	my $category_names = [];
	foreach my $id (@{$category_ids}){
		push(@{$category_names},$category_tree->{info}->{$id}->{name});
	}
	return $category_names;
}

# ポートレット 連絡・通知一覧取得関数 (SP版、モバイル版用 ) 
sub get_nsboard_portlet_data {
	# 引数:
	#  $session : セッション
	#  $params  : 共通設定情報
	#		module     : 表示メニュー
	#		conf       : 各種設定
	#			portal_listline 
	#  		join_gid   : グループ情報
	#       ns_conf    : DA::IS::get_sys_custom($session, 'ns_board') の取得値
	#       ns_master  : DA::IS::get_master($session, 'ns_board') の取得値
	#       listline   : 取得件数
	#       page       : 対象ページ番号(all=全て)
	#       start_upd_date : 対象とする更新日期間(開始日)
	#       end_upd_date   : 対象とする更新日期間(終了日)
	#       without_shortname : 1=グループの短縮名を取得しない
	#       with_attachment   : 1=添付ファイルの有無をチェックする
	#  
	# 戻り値:
	#  @array : 各レコードのハッシュ
	#  		num   	: 連絡・通知の識別番号
	#  		title 	: 連絡・通知のタイトル
	#		importance : 重要度 (0:なし, 1:低, 2:中, 3:高)
	#  		read_date  : 既読日時
	my ($session, $params) = @_;

	my $s_upd_date = $params->{start_upd_date};
	my $e_upd_date = $params->{end_upd_date};
	if ($s_upd_date && $e_upd_date && $s_upd_date gt $e_upd_date) {
		($s_upd_date, $e_upd_date) = ($e_upd_date, $s_upd_date);
	}
	if ($s_upd_date) {
		$s_upd_date = sprintf("%04d/%02d/%02d %02d:%02d:%02d", split(/[\/\-\:\s]/, $s_upd_date));
	}
	if ($e_upd_date) {
		$e_upd_date = sprintf("%04d/%02d/%02d %02d:%02d:%02d", split(/[\/\-\:\s]/, $e_upd_date));
	}
	
	my $line = int($params->{listline}) || 5;
	my $page = int($params->{page}) || 1;
	my $start = ( $page - 1 ) * $line + 1;
	my $end   = ( $start + $line -1 ) ;

	my $ns_conf   = $params->{ns_conf};
	   $ns_conf->{over_date} = 0 if ($ns_conf->{over_date} eq '');
	   $ns_conf->{over_term} = 'day' if (!$ns_conf->{over_term});
	
	# PC側のポータル設定	
	my $ns_master = $params->{ns_master};
	   $ns_master->{read}  = 'on' if (!$ns_master->{read});
	   $ns_master->{hidden}= 'off' if (!$ns_master->{hidden});
	   $ns_master->{regist}= 'off' if (!$ns_master->{regist});

	my $date  = DA::CGIdef::get_date("Y4/MM/DD HH:MI");
	my $today = DA::CGIdef::get_date('Y4/MM/DD');
	
	my $hint;
	if ($ns_conf->{main_hint} ne '') { $hint = "/*+ $ns_conf->{main_hint} */"; }
	
	my $start_comp_mode = 0;  # 0:従来通り, 1:不等号比較, 2:LIKE 比較
	my $start_comp_date = "";
	my @target_date_arr = ();
	my $target_date_like= "";
	my $start_where     = "start_date <= ?";
	my $running = $ns_conf->{main_running};
	if ($running=~/^\d+$/ && $running > 0) {
	    if ($ns_conf->{main_start_comp_like} eq 'on') {
	        push(@target_date_arr, $today);
	        for my $n (1..$running) {
	            my $d = DA::CGIdef::get_target_date($today,"-$n",'Y4/MM/DD');
	            push(@target_date_arr, $d);
	        }
	        $target_date_like = join(' OR ', map {"start_date LIKE ?"} @target_date_arr);
	        if ($target_date_like) {
	            $start_where = $target_date_like;
	            $start_comp_mode=2;
	        }
	    } else {
	        $start_comp_date = DA::CGIdef::get_target_date($today,"-$running",'Y4/MM/DD 00:00');
	        $start_where = "start_date >= ? AND start_date <= ?";
	        $start_comp_mode=1;
	    }
	}
	
	my @colmns = qw(
	    num create_mid create_gid admin c_target p_target e_target
	    o_target1 n_target1 o_target2 n_target2 o_target3 n_target3
	    update_date start_date close_date dead_date title p_level importance status 
		custom_target1 category
	);
	my $colmns_str = join(',', @colmns);
	my $table_name;
	if ($ns_conf->{monthly_table} eq 'on') {
	    $table_name = 'ns_board_'.DA::CGIdef::get_date('Y4MM');
	    my $tables  = DA::DB::get_db_tables($session,$table_name);
	    if (!$tables->{$table_name}) { $table_name='ns_board'; }
	} else {
	    $table_name = 'ns_board';
	}
	
	my $sort =" ORDER BY importance DESC, start_date desc, update_date DESC";
	my $sql="SELECT $hint $colmns_str FROM $table_name "
		   ."WHERE admin=0 AND status=2 AND ($start_where) AND close_date >= ? ";
	if ($s_upd_date) { $sql.=" AND update_date >= ? "; }
	if ($e_upd_date) { $sql.=" AND update_date <= ? "; }
	$sql.=$sort;
	my $sth=$session->{dbh}->prepare($sql);

	my ($c_sql, $c_sth);
	if ($params->{with_attachment}) {
		$c_sql="SELECT count(num) FROM ns_board_contents WHERE num=?";
		$c_sth=$session->{dbh}->prepare($c_sql);
	}
	
	my $sx = 0;
	if (1==$start_comp_mode) {                # start_date 不等号比較
	    $sth->bind_param(++$sx,$start_comp_date,1);
	    $sth->bind_param(++$sx,$date,1);
	} elsif (2==$start_comp_mode) {           # start_date LIKE 比較
	    for my $d (0..$#target_date_arr) {
	        $sth->bind_param(++$sx,"$target_date_arr[$d]%",1);
	    }
	} else {                                  # 従来通り(今日以前全て)
	    $sth->bind_param(++$sx,$date,1);
	}
	$sth->bind_param(++$sx,$date,1);
	if ($s_upd_date) { $sth->bind_param(++$sx,$s_upd_date,1); }
	if ($e_upd_date) { $sth->bind_param(++$sx,$e_upd_date,1); }
	$sth->execute();

	# ユーザごとの既読情報を取得
	my $read_data={};
	if ($ns_conf->{user_read_data} eq 'on') {
    	my $start_date;
    	if ($ns_conf->{main_running}=~/^\d+$/ && 0 <= $ns_conf->{main_running}) {
        	$start_date = DA::CGIdef::get_target_date($today,"-$ns_conf->{main_running}",'Y4/MM/DD');
    	}
    	$read_data=DA::Ns::get_user_read_data($session,$ns_conf,$start_date);
	}

	my $admin_permit=DA::Ns::is_admin_user($session,$params->{join_gid},$ns_conf);

	my @data_list;
	my $cnt = 0;
	while (my $board=$sth->fetchrow_hashref('NAME_lc')) {
    	# 無効化された連絡事項は管理者のみに表示
    	if ($board->{status} =~ /[5678]/ && !$admin_permit) { next; }

	    # start_date を LIKE 比較して取得した場合は、改めて時間を含めて比較
	    if (2 == $start_comp_mode) {
	        if ($board->{start_date} gt $date) {next;}
	    }

		# 承認が必要で承認されていないものをスキップ
	    if ($board->{c_target} && $board->{status} ne 2) { next; }
	
	    my $view_permit;
	    # 開示範囲のチェック
	    $view_permit=DA::Ns::is_target_user($session,$params->{join_gid},$board);
	    # 連絡必須グループ
	    if (!$view_permit && $ns_conf->{necessary_group}) {
	        foreach my $gid (split /[\s\,]/, $ns_conf->{necessary_group}) {
	            if ($params->{join_gid}->{$gid}->{attr} =~ /^[129UW]$/) { $view_permit=1; }
	        }
	    }
	    if (!$view_permit) { next; }
	
	    # 例）終了時間が 12:00 の場合は、11:59 までを有効と見なす。
	    my ($c_yy,$c_mm,$c_dd,$c_hh,$c_mi)=split(/[\/\-\s\:]/,$board->{close_date});
	    $c_hh = "00" if ($c_hh eq '');
	    $c_mi = "00" if ($c_mi eq '');
	    ($c_yy,$c_mm,$c_dd,$c_hh) = Date::Calc::Add_Delta_DHMS($c_yy,$c_mm,$c_dd,$c_hh,0,0,0,'-1',0,0);
	    my $close_date = sprintf("%04d/%02d/%02d %02d:00",$c_yy,$c_mm,$c_dd,$c_hh);
	    if ($board->{p_level} eq 1 && $board->{dead_date}) {
	        # 要回答の場合は回答期限から指定した日数経過するまでか、
	        # 連絡期間の期間の後ろに表示期間を設定する。
            my $check_date;
            my ($d_yy,$d_mm,$d_dd,$d_hh,$d_mi) = split(/[\/\-\s\:]/,$board->{dead_date});
            if ($ns_conf->{over_term} eq 'day') {
                $check_date=DA::CGIdef::get_target_date(
                    "$d_yy/$d_mm/$d_dd",$ns_conf->{over_date},"Y4/MM/DD $d_hh:00");
            } else {
                $check_date=DA::CGIdef::get_target_date_m(
                    "$d_yy/$d_mm/$d_dd",$ns_conf->{over_date},"Y4/MM/DD $d_hh:00");
            }
            my ($p_yy,$p_mm,$p_dd,$p_hh,$p_mi)=split(/[\/\-\s\:]/,$check_date);
            $p_hh="00" if ($p_hh eq ''); $p_mi="00" if ($p_mi eq '');
            ($p_yy,$p_mm,$p_dd,$p_hh)=
                Date::Calc::Add_Delta_DHMS($p_yy,$p_mm,$p_dd,$p_hh,0,0,0,'-1',0,0);
            $check_date=sprintf("%04d/%02d/%02d %02d:00",$p_yy,$p_mm,$p_dd,$p_hh);
            if ($check_date gt $close_date) {
                if ($check_date lt $date) { next; }
            } else {
                if ($close_date lt $date) { next; }
            }
	    }

    	my $read={};
    	# ユーザごとの既読情報を代入
    	if ($ns_conf->{user_read_data} eq 'on') {
        	$read=$read_data->{$board->{num}};
        	$read->{num}=$board->{num};
    	} else {
	    	$read = DA::Ns::get_read_data($session,$board->{num},$ns_conf);
		}
	    
		$board->{read_date} = $read->{read_date};
		
		# 既読分の非表示オプション
	    next if ($ns_master->{read} eq 'off' && $read->{read_date});
	    # 非表示フラグの判定
	    next if ($ns_master->{hidden} ne 'on' && $read->{hidden});
	    # 自分の登録分の非表示オプション
	    next if ($ns_master->{regist} ne 'on' && $board->{create_mid} eq $session->{user});
		 
		my ($group);
		if ($board->{create_gid}) {
			my $g_name = DA::IS::get_ug_name($session,1,$board->{create_gid});
			$group = $g_name->{simple_name};
			if ($params->{without_shortname} ne 1) {
				my $short_name = DA::Ns::get_short_name($session,$ns_conf,$board->{create_gid},$board->{create_group});
				# $short_name = DA::CGIdef::encode($short_name,1,1,'euc');
				$group .= "($short_name)" if($short_name ne '');
			}
			$board->{group} = $group;
		}

		if ($params->{with_attachment}) {
			$c_sth->bind_param(1, $board->{num}, 3);
			$c_sth->execute();
			my ($c_cnt) = $c_sth->fetchrow(); $c_sth->finish();
			$board->{attachment} = $c_cnt ? 1 : 0;
		}

		$cnt++;
		if ( $params->{page} eq "all" || ( $start <= $cnt && $cnt <= $end ) ) {
			push(@data_list , $board);
		}
	}
	$sth->finish;

	my $last_page = int( $cnt / $line ) ;
	$last_page ++ if (  0 < ( $cnt % $line) ) ;
	
	return(\@data_list, $last_page, $cnt);

}

# 既読情報をセット
sub set_read{
	my ($session,$num,$param) = @_;
	my $conf  = $param->{ns_conf};
	my $read  = DA::Ns::get_read_data($session,$num,$conf);
	my $today = DA::Ns::set_read_data($session,$num,$read);
	return ($today);
}
sub set_read_data {
	my ($session, $num, $read) = @_;
    my $r_table = 'ns_board_read_'.DA::CGIdef::get_last_n($num,2);
    my $u_table = 'ns_user_read_' .DA::CGIdef::get_last_n($session->{user},2);
    my $today = DA::CGIdef::get_date('Y4/MM/DD HH:MI:SS');
    DA::Session::trans_init($session);
    eval {
        if ($read->{num}) {
            my $r_sql="UPDATE $r_table SET read_date=? WHERE num=? AND mid=?";
            my $r_sth=$session->{dbh}->prepare($r_sql);
               $r_sth->bind_param(1,$today,1);
               $r_sth->bind_param(2,$num,3);
               $r_sth->bind_param(3,$session->{user},3);
               $r_sth->execute();
        } else {
            my $r_sql="INSERT INTO $r_table (num,mid,gid,read_date) VALUES (?,?,?,?)";
            my $r_sth=$session->{dbh}->prepare($r_sql);
               $r_sth->bind_param(1,$num,3);
               $r_sth->bind_param(2,$session->{user},3);
               $r_sth->bind_param(3,$session->{primary},3);
               $r_sth->bind_param(4,$today,1);
               $r_sth->execute();
        }
		my $s_sql="SELECT num FROM $u_table WHERE num=? AND mid=?";
        my $s_sth=$session->{dbh}->prepare($s_sql);
           $s_sth->bind_param(1,$num,3);
           $s_sth->bind_param(2,$session->{user},3);
           $s_sth->execute();
		my $exist=$s_sth->fetchrow; $s_sth->finish;
		if ($exist) {
            my $u_sql="UPDATE $u_table SET read_date=? WHERE num=? AND mid=?";
            my $u_sth=$session->{dbh}->prepare($u_sql);
               $u_sth->bind_param(1,$today,1);
               $u_sth->bind_param(2,$num,3);
               $u_sth->bind_param(3,$session->{user},3);
               $u_sth->execute();
		} else {
            my $u_sql="INSERT INTO $u_table (num,mid,gid,read_date) VALUES (?,?,?,?)";
            my $u_sth=$session->{dbh}->prepare($u_sql);
               $u_sth->bind_param(1,$num,3);
               $u_sth->bind_param(2,$session->{user},3);
               $u_sth->bind_param(3,$session->{primary},3);
               $u_sth->bind_param(4,$today,1);
               $u_sth->execute();
		}
    };
    if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }
	return ($today);
}
# 未読に戻す
sub reset_read {
	my ($session, $num) = @_;
	my $r_table = 'ns_board_read_'.DA::CGIdef::get_last_n($num,2);
	my $u_table = 'ns_user_read_' .DA::CGIdef::get_last_n($session->{user},2);
	DA::Session::trans_init($session);
	eval {
		my $sql="UPDATE $r_table SET read_date=NULL,hidden=NULL WHERE num=? AND mid=?";
		my $sth=$session->{dbh}->prepare($sql);
		   $sth->bind_param(1,$num,3);
		   $sth->bind_param(2,$session->{user},3);
		   $sth->execute();

		$sql="UPDATE $u_table SET read_date=NULL,hidden=NULL WHERE num=? AND mid=?";
		$sth=$session->{dbh}->prepare($sql);
		   $sth->bind_param(1,$num,3);
		   $sth->bind_param(2,$session->{user},3);
		   $sth->execute();
	};
	if (!DA::Session::exception($session)) {
		DA::Error::system_error($session);
	}
}
# 既読情報のクリア
sub clear_read {
	my ($session, $num) = @_;
    DA::Session::trans_init($session);
    eval {
        my $r_table='ns_board_read_'.DA::CGIdef::get_last_n($num,2);
        my $d_sql="DELETE FROM $r_table WHERE num=?";
        my $d_sth=$session->{dbh}->prepare($d_sql);
           $d_sth->bind_param(1,$num,3);
           $d_sth->execute();

        for (my $i=0; $i<100; $i++) {
            my $u_table='ns_user_read_'.sprintf("%02d",$i);
            my $d_sql="DELETE FROM $u_table WHERE num=?";
            my $d_sth=$session->{dbh}->prepare($d_sql);
           	   $d_sth->bind_param(1,$num,3);
               $d_sth->execute();
        }
    };
    if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }
}
# 非表示フラグをセット
sub set_hidden {
	my ($session, $num) = @_;
	my $r_table = 'ns_board_read_'.DA::CGIdef::get_last_n($num,2);
	my $u_table = 'ns_user_read_' .DA::CGIdef::get_last_n($session->{user},2);
    my $today=DA::CGIdef::get_date('Y4/MM/DD HH:MI:SS');
    DA::Session::trans_init($session);
    eval {
        my $sql="UPDATE $r_table SET hidden=1,ans_date=? WHERE num=? AND mid=?";
        my $sth=$session->{dbh}->prepare($sql);
           $sth->bind_param(1,$today,1);
           $sth->bind_param(2,$num,3);
           $sth->bind_param(3,$session->{user},3);
           $sth->execute();

        $sql="UPDATE $u_table SET hidden=1,ans_date=? WHERE num=? AND mid=?";
        $sth=$session->{dbh}->prepare($sql);
           $sth->bind_param(1,$today,1);
           $sth->bind_param(2,$num,3);
           $sth->bind_param(3,$session->{user},3);
           $sth->execute();
    };
    if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }
}

# ユーザごとの既読情報を取得
sub get_user_read_data {
	my ($session,$ns_conf,$start_date)=@_;
	my $where_sql;
	my @where_param;
	if ($start_date) {
		my ($yy,$mm,$dd,$hh,$mi,$ss)=split(/[\/\s\-\:]/,$start_date);
        $where_sql = " AND (read_date >= ? OR mark = 1 OR hidden = 1) ";
		push(@where_param,{ value => "$yy/$mm/$dd 00:00:00", type => 1 });
    }
	my $read_data={};
	my $table = 'ns_user_read_'.DA::CGIdef::get_last_n($session->{user},2);
	my $sql="SELECT num,mid,read_date,hidden,mark,label FROM $table WHERE mid=? $where_sql";
	my $sth=$session->{dbh}->prepare($sql);
	my $ix=0;
	$sth->bind_param(++$ix,$session->{user},3);
	foreach my $p (@where_param) {
		$sth->bind_param(++$ix,$p->{value},$p->{type});
	}
	$sth->execute();
    while (my $read=$sth->fetchrow_hashref('NAME_lc')) {
        $read->{label} =~ s/(\d)/label$1/g; 
		$read_data->{$read->{num}}=$read;
	}
	$sth->finish;

    # マークを共有する場合
    if ($ns_conf->{user_mark} eq 'off') {
		my $table = 'ns_user_read_'.DA::CGIdef::get_last_n($session->{primary},2);
		my $sql="SELECT num,mark FROM $table WHERE mid=? $where_sql";
		my $sth=$session->{dbh}->prepare($sql);
		my $ix=0;
		$sth->bind_param(++$ix,$session->{primary},3);
		foreach my $p (@where_param) {
			$sth->bind_param(++$ix,$p->{value},$p->{type});
		}
		$sth->execute();
    	while (my ($num,$mark)=$sth->fetchrow) {
			$read_data->{$num}->{mark}=$mark;
		}
		$sth->finish;
    }
	return($read_data);
}

# カテゴリ選択オプション
sub get_category_option {
	my ($session,$list_conf,$ns_conf,$format)=@_;
    my $sel = { $list_conf->{view} => 'selected' };

    my $tag;
	if ($ns_conf->{use_category_select} ne 'off') {
    	$tag="<option value='sel' $sel->{sel}>... @{[t_('選択カテゴリ')]}</option>"
	}
    $tag.="<option value='all' $sel->{all}>... @{[t_('全表示')]}</option>";

	my $list=[];
    if ($list_conf->{list_parent_category} eq 'on' && $list_conf->{parent_category} !~ /^\d+$/) {
        # カテゴリオプションを階層で表示 (下位階層も含めて表示対象とする)
		# ただし、親カテゴリが限定されている場合は限定された親カテゴリ配下を非階層でリスト表示
        my $children={};
		if ($ns_conf->{use_category_select} eq 'off') {
        	my $c_sql="SELECT c.category_id,c.parent_id,c.category_name,c.category_alpha "
        	 . "FROM ns_category c ORDER BY c.sort_level,c.category_id";
        	my $c_sth=$session->{dbh}->prepare($c_sql); $c_sth->execute();
        	while (my ($cid,$pid,$name,$alpha)=$c_sth->fetchrow) {
				$name=DA::IS::check_view_name2($session,$name,$alpha);
            	push(@{$children->{$pid}},{ id => $cid, name => $name });
        	}
        	$c_sth->finish;
		} else {
        	my $c_sql="SELECT c.category_id,c.parent_id,c.category_name,c.category_alpha "
        	 . "FROM ns_category c,ns_category_sel s WHERE c.category_id=s.category_id AND s.mid = ? "
			 . "ORDER BY c.sort_level,c.category_id";
        	my $c_sth=$session->{dbh}->prepare($c_sql);
        	   $c_sth->bind_param(1,$session->{user},3); $c_sth->execute();
        	while (my ($cid,$pid,$name,$alpha)=$c_sth->fetchrow) {
				$name=DA::IS::check_view_name2($session,$name,$alpha);
            	push(@{$children->{$pid}},{ id => $cid, name => $name });
        	}
        	$c_sth->finish;
		}

       	my $p_sql="SELECT category_id,category_name,category_alpha FROM ns_category WHERE parent_id=? ORDER BY sort_level,category_id";
       	my $p_sth=$session->{dbh}->prepare($p_sql);

		my $indent="&nbsp;&nbsp;&nbsp;&nbsp;";
		if ($ns_conf->{category_depth} eq 3) {
			my $index={};
        	my $category_data=DA::Ns::get_category_data($session);
            foreach my $pid (sort keys %{$children}) {
				my $tid = $category_data->{$pid}->{parent_id} if ($category_data->{$pid});
				if ($tid) { $index->{$tid}=1; }
				if ($pid) { $index->{$pid}=1; }
			}

			my $top=[];
			$p_sth->bind_param(1,0,3); $p_sth->execute();
       		while (my ($cid,$name,$alpha)=$p_sth->fetchrow) {
           		if (!$index->{$cid}) { next; }
				$name=DA::IS::check_view_name2($session,$name,$alpha);
				push(@{$top},{ id => $cid, name => $name });
       		}
			my $middle={};
			foreach my $level1 (@{$top}) {
		   		$p_sth->bind_param(1,$level1->{id},3); $p_sth->execute();
       			while (my ($cid_2,$name_2,$alpha_2)=$p_sth->fetchrow) {
					if (!$index->{$cid_2}) { next; }
					$name_2=DA::IS::check_view_name2($session,$name_2,$alpha_2);
					push(@{$middle->{$level1->{id}}},{ id => $cid_2, name => $name_2 });
				}
			}
			foreach my $level1 (@{$top}) {
				push(@{$list},$level1);
				my $name1=$level1->{name};
				my $cid_1=$level1->{id};
				if (!$middle->{$cid_1}) { next; }

				$name1=DA::CGIdef::encode($name1,1,1,'euc');
				$tag.="<option value=$cid_1 $sel->{$cid_1}>$name1</option>";

           		foreach my $level2 (@{$middle->{$cid_1}}) {
					my $name2=$level2->{name};
					my $cid_2=$level2->{id};
				 	push(@{$list},{ id => $cid_2, name => $cid_2, child => 1 });

					if (!$children->{$cid_2}) { next; }
					$name2=DA::CGIdef::encode($name2,1,1,'euc');
					$tag.="<option value=$cid_2 $sel->{$cid_2}>$indent $name2</option>";
           			foreach my $level3 (@{$children->{$cid_2}}) {
						my $name3=$level3->{name};
						my $cid_3=$level3->{id};
				 		push(@{$list},{ id => $cid_3, name => $name3, child => 1 });
				 		$name3=DA::CGIdef::encode($name3,1,1,'euc');
				 		$tag.="<option value=$cid_3 $sel->{$cid_3}>$indent $indent $name3</option>";
           			}
				}
			}
		} else {
			my $top=[];
			$p_sth->bind_param(1,0,3); $p_sth->execute();
       		while (my ($cid,$name,$alpha)=$p_sth->fetchrow) {
           		if (!$children->{$cid}) { next; }
				$name=DA::IS::check_view_name2($session,$name,$alpha);
				push(@{$top},{ id => $cid, name => $name });
       		}
			foreach my $level1 (@{$top}) {
				push(@{$list},$level1);
				my $name=$level1->{name};
				my $cid =$level1->{id};
				$name=DA::CGIdef::encode($level1->{name},1,1,'euc');
				$tag.="<option value=$cid $sel->{$cid}>$name</option>";
           		foreach my $child (@{$children->{$cid}}) {
				 	push(@{$list},{ id => $child->{id}, name => $child->{name}, child => 1 });
				 	my $name=DA::CGIdef::encode($child->{name},1,1,'euc');
				 	$tag.="<option value=$child->{id} $sel->{$child->{id}}>$indent $name</option>";
           		}
			}
		}
       	$p_sth->finish;

    } else {
		my $category_data=DA::Ns::get_category_data($session);
		if ($ns_conf->{use_category_select} eq 'off') {
			# ユーザ毎の表示カテゴリ選択を許可しない場合は全カテゴリが選択可能
            my $c_sql="SELECT c.category_id,c.parent_id,c.category_name,c.sort_level,c.category_alpha "
                    . "FROM ns_category c ORDER BY c.sort_level,c.category_id";
            my $c_sth=$session->{dbh}->prepare($c_sql); $c_sth->execute();
            my $cr_data={};
            while (my ($cid,$pid,$name,$sort_level,$alpha)=$c_sth->fetchrow) {
                if ($list_conf->{parent_category} =~ /^\d+$/) {
					my $top_id = $category_data->{$pid}->{parent} if ($category_data->{$pid});
                    if ($pid ne $list_conf->{parent_category} || $top_id ne $list_conf->{parent_category}) { next; }
                }
				if ($pid eq '0') { next; }
				# 子カテゴリを持つ分類カテゴリは表示しない
    			if ($list_conf->{list_parent_category} ne 'on') {
					if (@{$category_data->{$cid}->{_children}}) { next; }
				}
				# 最終階層以外のカテゴリは表示しない
				if ($ns_conf->{category_depth} && $category_data->{$pid}->{level} ne $ns_conf->{category_depth}-1) {
					next;
				}
                $name=DA::IS::check_view_name2($session,$name,$alpha);
				push(@{$list},{ id => $cid, name => $name });
                $name=DA::CGIdef::encode($name,1,1,'euc');
                $tag.="<option value=$cid $sel->{$cid}>$name</option>";
            }
            $c_sth->finish;
		} else {
			# ユーザ毎に選択したカテゴリのみを選択オプションに表示
        	my $c_sql;
        	if ($list_conf->{view} =~ /^\d+$/){
            	$c_sql="SELECT c.category_id,c.parent_id,c.category_name,c.sort_level,c.category_alpha "
                    . "FROM ns_category c "
                    . "WHERE exists( select 'x' "
                    .                "from ns_category_sel s "
                    .                "where c.category_id = s.category_id "
                    .                "and s.mid = ? ) "
                    . "OR c.category_id = ? "
                    . "ORDER BY c.sort_level,c.category_id";
        	}else{
            	$c_sql="SELECT c.category_id,c.parent_id,c.category_name,c.sort_level,c.category_alpha "
                    . "FROM ns_category c,ns_category_sel s "
                    . "WHERE c.category_id=s.category_id AND s.mid = ? ORDER BY c.sort_level,c.category_id";
        	}
        	my $c_sth=$session->{dbh}->prepare($c_sql);
        	   $c_sth->bind_param(1,$session->{user},3);
        	if ($list_conf->{view} =~ /^\d+$/) {
            	$c_sth->bind_param(2,$list_conf->{view},3);
        	}
        	$c_sth->execute();
        	my $cr_data={};
        	while (my ($cid,$pid,$name,$sort_level,$alpha)=$c_sth->fetchrow) {
            	if ($list_conf->{parent_category} =~ /^\d+$/) {
					my $top_id = $category_data->{$pid}->{parent} if ($category_data->{$pid});
                	if ($pid ne $list_conf->{parent_category} || $top_id ne $list_conf->{parent_category}) { next; }
            	}
				# 子カテゴリを持つ分類カテゴリは表示しない
    			if ($list_conf->{list_parent_category} ne 'on') {
					if (@{$category_data->{$cid}->{_children}}) { next; }
				}
				# 最終階層以外のカテゴリは表示しない
				if ($ns_conf->{category_depth} && $category_data->{$pid}->{level} ne $ns_conf->{category_depth}-1) {
					next;
				}
				$name=DA::IS::check_view_name2($session,$name,$alpha);
				push(@{$list},{ id => $cid, name => $name });
            	$name=DA::CGIdef::encode($name,1,1,'euc');
            	$tag.="<option value=$cid $sel->{$cid}>$name</option>";
        	}
        	$c_sth->finish;
		}
    }
	if ($format eq 'html') {
		return($tag);
	} else {
		return($list);
	}
}
# テンプレート選択オプション
sub get_template_option {
	my ($session,$ns_conf,$join,$parent_category)=@_;
	my $list=[];
    if ($ns_conf->{template_upper_enabled} eq "on") {
    	if ($ns_conf->{template_secondly_enabled} eq "off") {
    		my $sql="SELECT num,title,category FROM ns_board WHERE admin=1 AND (admin_gid=? OR admin_gid IN "
				   ."(SELECT gid FROM is_group_path WHERE attr='U' AND real_gid = ?)) ORDER BY title";
        	my $sth=$session->{dbh}->prepare($sql);
        	   $sth->bind_param(1,$session->{primary},3);
        	   $sth->bind_param(2,$session->{primary},3);
			   $sth->execute();
        	while (my $board=$sth->fetchrow_hashref('NAME_lc')) {
				push(@{$list},$board);
        	}
    		$sth->finish;
		} else {
       		my $sql="SELECT num,title,category,admin_gid FROM ns_board WHERE admin=1 ORDER BY title";
       		my $sth=$session->{dbh}->prepare($sql); $sth->execute();
        	while (my $board=$sth->fetchrow_hashref('NAME_lc')) {
           		if ($join->{$board->{admin_gid}}->{attr} !~ /[12UW]/) { next; }
           		if ($ns_conf->{template_project_enabled} ne 'on' && $join->{$board->{admin_gid}}->{type} =~ /[23]/) { next; }
				push(@{$list},$board);
       		}
    		$sth->finish;
		}
	} else {
    	if ($ns_conf->{template_secondly_enabled} eq "off") {
        	my $sql="SELECT num,title,category FROM ns_board WHERE admin=1 AND admin_gid=? ORDER BY title";
        	my $sth=$session->{dbh}->prepare($sql);
        	   $sth->bind_param(1,$session->{primary},3); $sth->execute();
        	while (my $board=$sth->fetchrow_hashref('NAME_lc')) {
				push(@{$list},$board);
        	}
    		$sth->finish;
    	} else {
        	my $sql="SELECT num,title,category,admin_gid FROM ns_board WHERE admin=1 ORDER BY title";
        	my $sth=$session->{dbh}->prepare($sql); $sth->execute();
        	while (my $board=$sth->fetchrow_hashref('NAME_lc')) {
           		if ($join->{$board->{admin_gid}}->{attr} !~ /[12]/) { next; }
           		if ($ns_conf->{template_project_enabled} ne 'on' && $join->{$board->{admin_gid}}->{type} =~ /[23]/) { next; }
				push(@{$list},$board);
        	}
    		$sth->finish;
    	}
	}

	my $category_data={};
	if ($parent_category) { $category_data=DA::Ns::get_category_data($session); }

	my $tag;
	foreach my $board (@{$list}) {
		# 親カテゴリが指定された場合、同じ親カテゴリに所属するカテゴリが定義されたテンプレートのみ表示
		if ($parent_category) {
           	my $category_permit=0;
           	foreach my $cid (split(/,/,$board->{category})) {
               	if ($category_data->{$cid}->{parent_id} eq $parent_category) {
                   	$category_permit=1;
               	}
           	}
           	if (!$category_permit) { next; }
		}
        my $title=DA::CGIdef::encode($board->{title},1,1,'euc');
        $tag.="<option value=$board->{num}>$title</option>";
	}
	return($tag);
}
# ステータス文言の取得
sub get_status_name {
	my ($session,$board)=@_;
	my $name;
	if (int($board->{status}) eq 0) {
		$name = ($board->{c_target}) ? t_('申請待ち') : t_('上長未設定');
	} elsif (int($board->{status}) eq 1) {
		$name=t_('申請中');
	} elsif (int($board->{status}) eq 2) {
		$name=t_('確認済み');
	} elsif (int($board->{status}) eq 3) {
		$name=t_('否認');
	} elsif (int($board->{status}) eq 4) {
	} elsif (int($board->{status}) eq 5) {
		$name=t_('未申請').':'.t_('無効');
	} elsif (int($board->{status}) eq 6) {
		$name=t_('申請中').':'.t_('無効');
	} elsif (int($board->{status}) eq 7) {
		$name=t_('確認済み').':'.t_('無効');
	} elsif (int($board->{status}) eq 8) {
		$name=t_('否認').':'.t_('無効');
	}
	return($name);
}

#　ラベルの値の取得
sub get_label {
    my ($session,$num,$ns_conf) = @_;

    DA::Session::trans_init($session);
    my $label;
    eval {
        my $table = 'ns_board_read_'.DA::CGIdef::get_last_n($num,2);
        my $sql = "SELECT num,mid,label FROM $table WHERE num = ? AND mid = ?";

        if (($ns_conf->{user_read_data} && $ns_conf->{user_read_data} ne 'off') && $ns_conf->{user_label_controller} eq 'on' && $ns_conf->{user_label} eq 'on') {
            my $sth = $session->{dbh}->prepare($sql);
            $sth->bind_param(1,int($num),3);
            $sth->bind_param(2,$session->{user},3);
            $sth->execute();
            $label = $sth->fetchrow_hashref('NAME_lc');
            $sth->finish();
        }
    };
    if (!DA::Session::exception($session)) {
        # 異常終了処理
        DA::Error::system_error($session);
    }
    $label->{label} =~ s/(\d)/label$1/g;
    return ($label);
}

# ラベル設定
sub set_label {
    my ($session,$labels,$num) = @_;
    $labels =~ s/label//g; 
    DA::Session::trans_init($session);
    eval {
        my $mid = $session->{user};

        my $r_table='ns_board_read_'.DA::CGIdef::get_last_n($num,2);
        my $rs_sql="SELECT num,label FROM $r_table WHERE num=? AND mid=?";
        my $rs_sth=$session->{dbh}->prepare($rs_sql);
           $rs_sth->bind_param(1,int($num),3);
           $rs_sth->bind_param(2,int($mid),3);
           $rs_sth->execute();
        my $r_label_data=$rs_sth->fetchrow_hashref('NAME_lc'); 
           $rs_sth->finish;

        if (!$r_label_data->{num}) {
            my $ri_sql="INSERT INTO $r_table (num,mid,label) VALUES (?,?,?)";
            my $ri_sth=$session->{dbh}->prepare($ri_sql);
               $ri_sth->bind_param(1,int($num),3);
               $ri_sth->bind_param(2,int($mid),3);
               $ri_sth->bind_param(3,$labels,1);
               $ri_sth->execute();
        } else {
            my $ru_sql="UPDATE $r_table SET label=? WHERE num=? AND mid=?";
            my $ru_sth=$session->{dbh}->prepare($ru_sql);
               $ru_sth->bind_param(1,$labels,1);
               $ru_sth->bind_param(2,int($num),3);
               $ru_sth->bind_param(3,int($mid),3);
               $ru_sth->execute();
        }

        my $u_table='ns_user_read_' .DA::CGIdef::get_last_n($mid,2);
        my $us_sql="SELECT num,label FROM $u_table WHERE num=? AND mid=?";
        my $us_sth=$session->{dbh}->prepare($us_sql);
           $us_sth->bind_param(1,int($num),3);
           $us_sth->bind_param(2,int($mid),3);
           $us_sth->execute();
        my $u_label_data=$us_sth->fetchrow_hashref('NAME_lc'); 
           $us_sth->finish;

        if (!$u_label_data->{num}) {
            my $ui_sql="INSERT INTO $u_table (num,mid,label) VALUES (?,?,?)";
            my $ui_sth=$session->{dbh}->prepare($ui_sql);
               $ui_sth->bind_param(1,int($num),3);
               $ui_sth->bind_param(2,int($mid),3);
               $ui_sth->bind_param(3,$labels,1);
               $ui_sth->execute();
        } else {
            my $uu_sql="UPDATE $u_table SET label=? WHERE num=? AND mid=?";
            my $uu_sth=$session->{dbh}->prepare($uu_sql);
               $uu_sth->bind_param(1,$labels,1);
               $uu_sth->bind_param(2,int($num),3);
               $uu_sth->bind_param(3,int($mid),3);
               $uu_sth->execute();
        }
    };
    if ( !DA::Session::exception($session) ) {
        # 異常終了処理
        DA::Error::system_error($session);
    }
}

sub get_label_master {
    my ($session,$label_master) = @_;
    my $labels = {};
    my $count = 0;
    foreach my $key (sort keys %{$label_master}) {
        $count++;
        if ($key =~ /^label\d+/) {
            if ($label_master->{$key} eq 'default') {
                $labels->{$key} = t_('ラベル%1', $count);
            } else {
                $labels->{$key} = $label_master->{$key};
            }
        }
    }
    return $labels;
}

# ユーザごとのラベルを取得
sub get_user_label {
    my ($session,$ns_conf)=@_;

    DA::Session::trans_init($session);
    my $label_list;
    eval {
        my $table = 'ns_user_read_'.DA::CGIdef::get_last_n($session->{user},2);
        my $sql="SELECT num,mid,label FROM $table WHERE mid=? AND label IS NOT NULL";
        my $sth=$session->{dbh}->prepare($sql);

        if (($ns_conf->{user_read_data} && $ns_conf->{user_read_data} ne 'off') && $ns_conf->{user_label_controller} eq 'on' && $ns_conf->{user_label} eq 'on') {
            my $sth = $session->{dbh}->prepare($sql);
            $sth->bind_param(1,$session->{user},3);
            $sth->execute();
            while (my $label=$sth->fetchrow_hashref('NAME_lc')) {
                $label->{label} =~ s/(\d)/label$1/g;
                $label_list->{$label->{num}} = $label;
            }
            $sth->finish;
        }
    };
    if (!DA::Session::exception($session)) {
        # 異常終了処理
        DA::Error::system_error($session);
    }
    return ($label_list);
}

sub is_except_column {
    my($key,$ns_conf) = @_;
    if($key eq 'label') {
        if ( !$ns_conf->{user_read_data} || $ns_conf->{user_read_data} eq 'off' || $ns_conf->{user_label_controller} ne 'on' || $ns_conf->{user_label} ne 'on') {
            return 1;
        }   
    }elsif($key eq 'category') {
        if ($ns_conf->{use_category} ne 'on') {
            return 1;
        } 
    }
    return 0;
}

# 連絡事項が添付ファイルの有無をチェエク
sub has_attachment($$) {
	my ($session, $board) = @_;
	my $c_sql="SELECT count(num) FROM ns_board_contents WHERE num=?";
	my $c_sth=$session->{dbh}->prepare($c_sql);
	   $c_sth->bind_param(1, $board->{num}, 3);
	   $c_sth->execute();
	my ($c_cnt) = $c_sth->fetchrow(); $c_sth->finish();
	$board->{attachment} = $c_cnt ? 1 : 0;
	return $board->{attachment};
}

1;
