package DA::SmartPhone;

use strict;

my $MAX_TREE_DEPTH          = 4;
my $MAX_FOLDER_PAGE         = 20;
my $MAIL_UPDATE_INTERVAL    = 60; # sec
my $FOLDERS_UPDATE_INTERVAL = 3600; # sec

sub _inboxfile($) {
	my ($session) = @_;
	my $file = "$session->{temp_dir}/$session->{sid}.sp.inboxLastUpdate";

	return($file);
}

sub touch_inboxfile($) {
	my ($session) = @_;
	my $file = &_inboxfile($session);
	DA::System::touch($file);

	return(1);
}

sub check_inboxfile($) {
	my ($session) = @_;
	my $file = &_inboxfile($session);
	my $ctime = (stat($file))[10];

	if (int(time) - int($ctime) > $MAIL_UPDATE_INTERVAL) {
		return(1);
	} else {
		return(0);
	}
}

sub _foldersfile($) {
	my ($session) = @_;
	my $file = "$session->{temp_dir}/$session->{sid}.sp.foldersBuilded";

	return($file);
}

sub touch_foldersfile($) {
	my ($session) = @_;
	my $file = &_foldersfile($session);
	DA::System::touch($file);

	return(1);
}

sub check_foldersfile($) {
	my ($session) = @_;
	my $file = &_foldersfile($session);
	my $ctime = (stat($file))[10];

	if (int(time) - int($ctime) > $FOLDERS_UPDATE_INTERVAL) {
		return(1);
	} else {
		return(0);
	}
}

sub get_except_mail($$) {
	my ($session, $c) = @_;
	my $except;

	if ($c->{func} eq "mail") {
		if ($c->{sub} eq "edit") {
			$except = [qw(name to cc bcc to_text cc_text bcc_text subject body in_reply_to references attachment)];
		}elsif ( $c->{sub } eq "folder" ) {
			$except = [qw(favorites)];
		}
	}

	return($except);
}

sub get_tmpl_mail($$$) {
	my ($session, $c, $p) = @_;
	my ($file, $params) = &get_template_params($session, $c->{func});
	# my $args_h = &json2obj($c->{args});

	# Customize
	# $params->{MAIL_LIST_TITLE}   = t_("メール一覧");
	# $params->{MAIL_FOLDER_TITLE}    = t_("フォルダ一覧");
	# $params->{MAIL_DETAIL_TITLE} = t_("メール詳細");
	# $params->{MAIL_NEW_TITLE}    = t_("メール作成");
	$params->{MAIL_DETAIL_HIDDEN_LINK}      = t_("非表示");
	$params->{MAIL_DETAIL_FROM_TITLE}       = t_("差出人");
	$params->{MAIL_DETAIL_TO_TITLE}         = t_("宛先%(smartphone)");
	$params->{MAIL_DETAIL_CC_TITLE}         = t_("CC");
	$params->{MAIL_DETAIL_BCC_TITLE}        = t_("BCC");
	$params->{MAIL_DETAIL_ATTACHMENT_TITLE} = t_("添付");
	$params->{MAIL_DETAIL_PREV_LINK}        = t_("前へ%(smartphone)");
	$params->{MAIL_DETAIL_NEXT_LINK}        = t_("次へ%(smartphone)");
	$params->{MAIL_DETAIL_UNSEEN}           = t_("未読に戻す");
	$params->{MAIL_EDIT_TO_TITLE}           = t_("宛先%(smartphone)");
	$params->{MAIL_EDIT_CC_TITLE}           = t_("CC");
	$params->{MAIL_EDIT_BCC_TITLE}          = t_("BCC");
	$params->{MAIL_EDIT_SUBJECT_TITLE}      = t_("件名");
	$params->{MAIL_EDIT_BODY_TITLE}         = t_("本文");
	$params->{MAIL_EDIT_ATTACHMENT_TITLE}   = t_("添付");
	$params->{MAIL_EDIT_SIGN_TITLE}         = t_("署名");
	$params->{MAIL_EDIT_PRIORITY_TITLE}     = t_("重要度");
	$params->{MAIL_EDIT_GROUPNAME_TITLE}    = t_("グループ名の記載");
	$params->{MAIL_EDIT_REPLYUSE_TITLE}     = t_("返信アドレスの使用");
	foreach my $t (qw(to cc bcc)) {
		($params->{"MAIL_EDIT_" . uc($t) . "_AREA"},
		 $params->{"MAIL_EDIT_" . uc($t) . "_JS"},
		 $params->{"MAIL_EDIT_" . uc($t) . "_ANCHOR"}) = DA::SmartPhone::set_target_area($session, "address", "DA_mail_edit_address_" . $t . "_Id", "DA_mail_edit_address_" . $t . "_hidden_Id", [], "DA_mail_edit_Id");
	}
	my $options_tag = "";
	my $options_account = &_get_json_mail4orglist($session, $c, $p);
	foreach my $option_account (@{$options_account}) {
		if ($option_account->{gid}) {
			$options_tag .= "<option value='" . $option_account->{gid} . "'";
			if ($c->{org_mail_gid} eq $option_account->{gid}){
				$options_tag .= "selected";
			}
			$options_tag .= ">" . $option_account->{name} . "</option>";
		}
	}
	foreach my $s (qw(list folder detail edit)) {
		if ($s eq "folder") {
			$params->{MAIL_FOLDER_LOOP} = [];
			foreach my $i (0..($MAX_FOLDER_PAGE-1), 'favorite') {
				my $selected = "false";
				if ($c->{func} eq "mail" && $c->{sub} eq $s && $i eq 0) {
#					$selected = "true";
				}
				push(@{$params->{MAIL_FOLDER_LOOP}}, {
					MAIL_FOLDER_ID => "DA_mail_folder_$i\_Id",
					MAIL_FOLDER_CONTENTS_ID => "DA_mail_folder_$i\_contents_Id",
					MAIL_FOLDER_SELECTED => $selected,
					MAIL_FOLDER_SUB_TITLE => ($i eq "favorite") ? t_("よく使うフォルダ") : t_("フォルダ一覧") ,
					MAIL_ACCOUNT_OPTIONS => $options_tag
				});
			}
		} elsif ($s eq "list") {
			foreach my $d (qw(portal inbox draft sent trash spam default)) {
				if ($d eq "portal") {
					# $params->{"MAIL_" . uc($s) . "_" . uc($d) . "_SELECTED"} = ($c->{func} eq "mail" && $c->{sub} eq $s) ? "true" : "false";
					$params->{"MAIL_" . uc($s) . "_" . uc($d) . "_SELECTED"} = "false";
				} else {
					$params->{"MAIL_" . uc($s) . "_" . uc($d) . "_SELECTED"} = "false";
				}
			}
		} else {
#			$params->{"MAIL_" . uc($s) . "_SELECTED"} = ($c->{func} eq "mail" && $c->{sub} eq $s) ? "true" : "false";
			$params->{"MAIL_" . uc($s) . "_SELECTED"} = "false";
		}
	}

	return(&get_template_file($session, $file, $params));
}

sub get_json_mail($$;$) {
	my ($session, $c, $p) = @_;

	$ENV{DA_GETTEXT_CHARSET} = DA::Ajax::Mailer::mailer_charset();

	$c = DA::Ajax::Mailer::convert_mailer($c);
	# my $args_h = &json2obj($c->{args});

	my $data = [];
	if ($c->{func} eq "mail") {
		if ($c->{sub} eq "folder") {
			if ($c->{mail_func} eq "update") {
				$data = &_get_json_mail4folder_update($session, $c, $p);
			} elsif ($c->{mail_func} eq "favorite") {
				$data = &_get_json_mail4folder($session, $c, $p, "favorite");
			} else {
				$data = &_get_json_mail4folder($session, $c, $p);
			}
		} elsif ($c->{sub} eq "detail") {
			if ($c->{mail_func} eq "delete") {
				$data = &_get_json_mail4detail_delete($session, $c, $p);
			} elsif ($c->{mail_func} eq "mdn") {
				$data = &_get_json_mail4detail_mdn($session, $c, $p);
			} elsif ($c->{mail_func} eq "flagged" || $c->{mail_func} eq "unflagged") {
				$data = &_get_json_mail4detail_flagged($session, $c, $p, $c->{mail_func});
			} elsif ($c->{mail_func} eq "seen" || $c->{mail_func} eq "unseen") {
				$data = &_get_json_mail4detail_seen($session, $c, $p, $c->{mail_func});
			} else {
				if ($c->{mail_func} eq "prev" || $c->{mail_func} eq "next") {
					$data = &_get_json_mail4detail($session, $c, $p, $c->{mail_func});
				} else {
					$data = &_get_json_mail4detail($session, $c, $p);
				}
			}
		} elsif ($c->{sub} eq "edit") {
			# if ($c->{mail_func} eq "delete_attach") {
			#	$data = &_get_json_mail4edit_delete_attach($session, $c, $p);
			# } else {
				$data = &_get_json_mail4edit($session, $c, $p, $c->{mail_func});
			# }
		} elsif ($c->{sub} eq "orglist") {
			$data = &_get_json_mail4orglist($session , $c , $p);
		} else {
			if ($c->{mail_func} eq "portal") {
				$data = &_get_json_mail4list($session, $c, $p, "portal");
			} else {
				$data = &_get_json_mail4list($session, $c, $p, "", $c->{org_mail_gid});
			}
		}
	}

	delete $ENV{DA_GETTEXT_CHARSET};

	return(DA::Ajax::Mailer::convert_internal($data));
}

sub _get_json_mail4orglist($$$) {
	my ($session, $c, $p) = @_;
	my $permit = DA::OrgMail::get_org_mail_permit($session,0);
	my $config = DA::IS::get_sys_custom($session,'org_mail');
	my $g_sql = "SELECT mail_name FROM is_org_mail_group WHERE gid=?";
	my $g_sth = $session->{dbh}->prepare($g_sql);
	my $data = [];
	if (($permit->{auth} && %{$permit->{auth}}) && $config->{toggle_button} eq 'on') {
		$permit->{auth}->{$session->{user}}=1;
		foreach my $gid (sort { $permit->{auth}->{$a} cmp $permit->{auth}->{$b} } keys %{$permit->{auth}}) {
			my $name=($gid eq $session->{user}) ? $session->{name} : $permit->{auth}->{$gid};
			if ($name eq 1) {
				$g_sth->bind_param(1,$gid,3); $g_sth->execute();
				$name=$g_sth->fetchrow;
			}
			if ($name eq '') {
				$name=DA::IS::get_ug_name($session,1,$gid)->{simple_name};
			}
			$name=js_esc_($name);
			push(@{$data}, {
				name => $name,
				gid => $gid
			});
		}
	}
	return $data;
}

sub _get_json_mail4folder($$;$;$) {
	my ($session, $c, $p, $proc) = @_;
	my $fid = $c->{fid} || 0;
	my $rebuild = DA::SmartPhone::check_foldersfile($session);
	my $imaps;
	if($c->{org_mail_gid} && $c->{org_mail_gid} ne "ajaxMailer"){
		$imaps= DA::Ajax::Mailer::connect($session, {
			org_mail => $c->{org_mail_gid},
			pop => 1
		});
	} else {
		$imaps = DA::Ajax::Mailer::connect($session, {
			pop => 1,
			org_mail => $session->{user}
		});
	}
	
	if ($imaps->{error}) {
		if ($c->{noerror}) {
			return([]);
		} else {
			DA::SmartPhone::errorpage($session, $imaps->{message});
		}
	}

	my $result = DA::Ajax::Mailer::folders($session, $imaps, ((!$c->{norebuild} && $rebuild) || $c->{org_changed} eq "true") ? 1 : 0, 1);
	if ($result->{error}) {
		DA::SmartPhone::errorpage($session, $result->{message});
	} else {
		if (!$c->{norebuild} && $rebuild) {
			DA::SmartPhone::touch_foldersfile($session);
		}
	}
	my $folders = $result->{folders_h};
	
	my $real_fid = &_real_fid($session, $imaps, $folders, $fid, 1);
	my $data = [];
	if ($proc eq "favorite") {
		my $favorites = $c->{favorites};
		my $list = [];
		foreach my $path (split(/\n+/, $favorites)) {
			my $fid = DA::Ajax::Mailer::_path2fid($session, $imaps, $folders, $path);
			if ($fid) {
				my $type    = DA::Ajax::Mailer::_fid2type($session, $imaps, $folders, $fid);
				my $name    = DA::Ajax::Mailer::_fid2name($session, $imaps, $folders, $fid);
				my $virtual = &_virtual_fid($session, $imaps, $folders, $fid);
				if (DA::Ajax::Mailer::is_sp_target($session, $imaps, $type)) {
					if (DA::Ajax::Mailer::_fid2select($session, $imaps, $folders, $fid)) {
						my $folder;
						if ($virtual ne "portal") {
							$folder = DA::Ajax::Mailer::_fid2folder($session, $imaps, $folders, $fid);
						}

						my $class  = "DA_mailf_favorite_class DA_list_arrow_class DA_mailf_1step_class"
						           . " " . &folder_class($session, $imaps, $folder, $type);
						my $anchor = "#" . &_anchor_list_div_id($session, $virtual);
						my $link   = "DA.mail.listReload('". &js_esc_($virtual) . "', true);";
						my $count;
						if ($folders->{$fid}->{recent}) {
							$count = int($folders->{$fid}->{recent});
							$class .= " DA_mailf_no_on_class";
						} else {
							$class .= " DA_mailf_no_off_class";
						}

						my $vpath;
						unless (&_is_specific_fid($session, $imaps, $virtual)) {
							if ($folder) {
								$vpath = &folder_path($session, $imaps, $folder);
							}
						}

						if ($vpath eq "") {
							$class .= " DA_mailf_favorite_parent_class";
						}

						my $html =<<end_tag;
<li>
  <a href="@{[enc_($anchor)]}" slidedonejs="@{[enc_($link)]}" favoriteid="mailFolder:@{[enc_($path)]}">
    <div class="DA_list_detail_class">@{[enc_($vpath)]}</div>
    <div class="DA_list_title_class">@{[enc_($name)]}</div>
    <div id="@{[enc_("DA_mail_folder_favorite_list_" . $virtual . "_count_Id")]}" class="DA_mailf_no_class">@{[enc_($count)]}</div>
  </a>
</li>
end_tag

						my $id = "DA_mail_folder_favorite_list_" . $virtual . "_Id";

						push(@{$list}, {
							id   => $id,
							html => $html,
							attr => {
								class => $class
							}
						});
					}
				}
			}
		}
		push(@{$data}, {
			id   => "DA_mail_folder_favorite_Id",
			type => "normal",
			attr => {
				backtitle => t_("TOP")
			}
		}, {
			id   => "DA_mail_folder_favorite_contents_Id",
			type => "list",
			list => $list
		});
	} else {
		my $list = {};
		my $lowers = {};
		my $tree = {};
		my $i = 0;
		
		foreach my $r (@{$result->{folders}}) {
			my $fid     = $r->{fid};
			my $type    = $r->{type};
			my $folder  = $r->{folder};
			my $name    = $r->{name};
			my $parent  = $r->{parent};
			my $path    = $r->{path};
			my $virtual = &_virtual_fid($session, $imaps, $folders, $fid);

			if (DA::Ajax::Mailer::is_sp_target($session, $imaps, $type)) {
				if (DA::Ajax::Mailer::is_sp_top($session, $imaps, $type) || !DA::Ajax::Mailer::is_sp_target($session, $imaps, $folders->{$parent}->{type})) {
					$parent = 0;
				}

				my ($html, $anchor, $link, $vpath, $count);
				my $class = "DA_mailf_class"
				          . " " . &folder_class($session, $imaps, $folder, $type);
				if (DA::Ajax::Mailer::_fid2select($session, $imaps, $folders, $fid)) {
					$class .= " DA_list_arrow_class";
					$anchor = "#" . &_anchor_list_div_id($session, $virtual);
					if ($c->{org_mail_gid}) {
						$link = "DA.mail.listReload('". &js_esc_($virtual) . "', true, '" . $c->{org_mail_gid} . "');";
					} else {
						$link = "DA.mail.listReload('". &js_esc_($virtual) . "', true);";
					}

					unless (&_is_specific_fid($session, $imaps, $virtual)) {
						if ($folder) {
							$vpath = &folder_path($session, $imaps, $folder);
						}
					}
				}

				if ($r->{recent}) {
					$count = int($r->{recent});
					$class .= " DA_mailf_no_on_class";
				} else {
					$class .= " DA_mailf_no_off_class";
				}

				if ($anchor && $link) {

					$html =<<end_tag;
<li>
  <a href="@{[enc_($anchor)]}" slidedonejs="@{[enc_($link)]}" favoriteid="mailFolder:@{[enc_($path)]}">
    <div class="DA_list_detail_class">@{[enc_($vpath)]}</div>
    <div class="DA_list_title_class">@{[enc_($name)]}</div>
    <div id="@{[enc_("DA_mail_folder_list_" . $virtual . "_count_Id")]}" class="DA_mailf_no_class">@{[enc_($count)]}</div>
  </a>
</li>
end_tag

				} else {

					$html =<<end_tag;
<li>
  <div>
    <div class="DA_list_detail_class"></div>
    <div class="DA_list_title_class">@{[enc_($name)]}</div>
    <div class="DA_mailf_no_class"></div>
  </div>
</li>
end_tag

				}


				$tree->{$fid}->{parent}  = $parent;
				$tree->{$fid}->{virtual} = $virtual;
				$tree->{$fid}->{id}      = "DA_mail_folder_list_" . $virtual . "_Id";
				$tree->{$fid}->{under}   = "DA_mail_folder_list_" . $virtual . "_Under_Id";
				$tree->{$fid}->{html}    = $html;
				$tree->{$fid}->{class}   = $class;
				$tree->{$fid}->{sort}    = $i ++;

				unless ($tree->{$parent}->{_child}) {
					$tree->{$parent}->{_child} = [];
				}
				push(@{$tree->{$parent}->{_child}}, $fid);
			}
		}

		&_build_mail_folder_tree_wrap($session, $tree, $real_fid, $list, $lowers);
		
		my %fid_tables;
		@fid_tables{(sort { $a <=> $b } keys %{$list})} = (0 .. (scalar(keys %{$list})));

		my $parent_num = {};
		my $anchor_sub = sub {
			my ($fid, $current_num) = @_;
			my $num = $fid_tables{$fid};
			my $anchor;

			if ($num < $MAX_FOLDER_PAGE) {
				$anchor = "#DA_mail_folder_$num\_Id";
			} else {
				$anchor = "javascript:alert('" . t_("%1ページ以上の階層は表示できません。", $num) . "');";
			}
			unless (defined $parent_num->{$num}) {
				$parent_num->{$num} = $current_num;
			}

			return($anchor);
		};

		my $j = 0;
		foreach my $fid (sort { $a <=> $b } keys %{$list}) {
			my $error = t_("%1ページ以上の階層は表示できません。", $j);
			foreach my $l (@{$list->{$fid}}) {
				$l->{html} =~ s/__ANCHOR_(\d+)__/$anchor_sub->($1, $j)/e;
			}
			push(@{$data}, {
				id   => "DA_mail_folder_$j\_Id",
				type => "normal",
				attr => {
					backtitle => (defined $parent_num->{$j}) ? t_("戻る") : t_("TOP")
				}
			}, {
				id   => "DA_mail_folder_$j\_contents_Id",
				type => "list",
				list => $list->{$fid}
			});
			$j ++;
		}
	}

	DA::Ajax::Mailer::disconnect($session, $imaps);

	return($data);
}

sub _build_mail_folder_tree_wrap($$$$$) {
	my ($session, $tree, $parent, $list, $lowers) = @_;

	unless ($list->{$parent}) {
		$list->{$parent} = [];
	}

	my $low = &_build_mail_folder_tree($session, $tree, $parent, 1, $list->{$parent});
	push(@{$lowers->{$parent}}, @{$low});

	foreach my $l (@{$low}) {
		&_build_mail_folder_tree_wrap($session, $tree, $l, $list, $lowers);
	}
}

sub _build_mail_folder_tree($$$$$) {
	my ($session, $tree, $parent, $depth, $list) = @_;
	my $max = $MAX_TREE_DEPTH;
	my @lowers;

	foreach my $fid (@{$tree->{$parent}->{_child}}) {
		my $id      = $tree->{$fid}->{id};
		my $under   = $tree->{$fid}->{under};
		my $html    = $tree->{$fid}->{html};
		my $class   = $tree->{$fid}->{class};
		my $virtual = $tree->{$fid}->{virtual};

		$class .= " DA_mailf_" . int($depth) . "step_class";

		push(@{$list}, {
			id   => $id,
			html => $html,
			attr => {
				class => $class
			}
		});

		my $child = $tree->{$fid}->{_child};
		if ($child && scalar(@{$child})) {
			if ($depth < $max) {
				push(@lowers, @{&_build_mail_folder_tree($session, $tree, $fid, $depth + 1, $list)});
			} else {
				if ($child) {
					my $html  =<<end_tag;
<li>
  <a href="__ANCHOR_$fid\__">
    <div class="DA_list_detail_class"></div>
    <div class="DA_list_title_class">@{[enc_(t_("さらに下位を表示"))]}</div>
    <div class="DA_mailf_no_class"></div>
  </a>
</li>
end_tag
					my $class = "DA_mailf_class DA_mailf_down_class DA_mailf_no_off_class";

					push(@{$list}, {
						id   => $under,
						html => $html,
						attr => {
							class => $class
						}
					});

					push(@lowers, $fid);
				}
			}
		}
	}

	return(\@lowers);
}

sub _get_json_mail4folder_update($$;$) {
	my ($session, $c, $p) = @_;
	my $fid = $c->{fid} || 0;
	my $update = DA::SmartPhone::check_inboxfile($session);
	my $imaps;
	if($c->{org_mail_gid} && $c->{org_mail_gid} ne "ajaxMailer"){
		$imaps= DA::Ajax::Mailer::connect($session, {
			org_mail => $c->{org_mail_gid},
			pop => ($update) ? 1 : 0
		});
	} else {
		$imaps = DA::Ajax::Mailer::connect($session, {
			pop => ($update) ? 1 : 0,
			org_mail => $session->{user}
		});
	}
	if ($imaps->{error}) {
		if ($c->{noerror}) {
			return([]);
		} else {
			DA::SmartPhone::errorpage($session, $imaps->{message});
		}
	}

	my $result = DA::Ajax::Mailer::folders($session, $imaps, 0, 1);
	if ($result->{error}) {
		DA::SmartPhone::errorpage($session, $result->{message});
	}
	my $folders = $result->{folders_h};
	my $real_fid = &_real_fid($session, $imaps, $folders, $fid, 1);
	my $update_folders = 0;

	if ($update) {
		my $inbox_fid = DA::Ajax::Mailer::_inbox_fid($session, $imaps, $folders);
		my $update_resi = DA::Ajax::Mailer::update($session, $imaps, $folders, {
			fid => $inbox_fid,
			noupdate => 1,
			norecent => 1
		});
		if ($update_resi->{error}) {
			DA::SmartPhone::errorpage($session, $update_resi->{message});
		}
		DA::SmartPhone::touch_inboxfile($session);

		if (&_update_folders_counts($session, $folders, $inbox_fid, $update_resi)) {
			$update_folders = 1;
		}

		# my $portal_fid = DA::Ajax::Mailer::_portal_fid($session, $imaps, $folders);
		# my $update_resp = DA::Ajax::Mailer::update($session, $imaps, $folders, {
		#	fid => $portal_fid,
		#	noupdate => 1
		# });
		# if ($update_resp->{error}) {
		#	DA::SmartPhone::errorpage($session, $update_resp->{message});
		# }

		# if (&_update_folders_counts($session, $folders, $portal_fid, $update_resp)) {
		#	$update_folders = 1;
		# }
	}

	my $data = [];
	if ($update_folders) {
		&_update_folders($session, $folders);

		foreach my $r (@{$result->{folders}}) {
			my $fid     = $r->{fid};
			my $type    = $r->{type};
			my $virtual = &_virtual_fid($session, $imaps, $folders, $fid);
			my $recent  = int($r->{recent}) || "";

			if (DA::Ajax::Mailer::is_sp_target($session, $imaps, $type)) {
				if (DA::Ajax::Mailer::_fid2select($session, $imaps, $folders, $fid)) {
					if ($recent) {
						push(@{$data}, {
							id   => "DA_mail_folder_list_" . $virtual . "_count_Id",
							type => "normal",
							html => enc_($recent)
						}, {
							id   => "DA_mail_folder_favorite_list_" . $virtual . "_count_Id",
							type => "normal",
							html => enc_($recent)
						}, {
							type => "javascript",
							js   =><<end_js
DA.mail.setRecent('@{[js_esc_($virtual)]}', '@{[js_esc_($recent)]}');
end_js
						});
					}
				}
			}
		}
	}

	DA::Ajax::Mailer::disconnect($session, $imaps);

	return($data);
}

sub _get_json_mail4list($$;$;$;$) {
	my ($session, $c, $p, $proc, $org_mail_gid) = @_;
	my $fid    = $c->{fid};
	my $page   = int($c->{page});
	my $inbox  = ($fid eq "inbox" || $fid eq "portal") ? 1 : 0;
	my $update = DA::SmartPhone::check_inboxfile($session);
	my $imaps;
	if($org_mail_gid && $org_mail_gid ne "ajaxMailer"){
		$imaps= DA::Ajax::Mailer::connect($session, {
			org_mail => $org_mail_gid,
			pop => ($update) ? 1 : 0
		});
	} else {
		$imaps = DA::Ajax::Mailer::connect($session, {
			pop => ($update) ? 1 : 0,
			org_mail => $session->{user}
		});
	}
	if ($imaps->{error}) {
		if ($proc eq "portal") {
			return([{
				id   => "DA_portal_mail_Id",
				type => "list",
				list => [{
					id   => "DA_portal_mail_error_Id",
					attr => {
						class => "DA_portal_next_class DA_ico_sc_0_class",
					},
					html =><<end_tag
<li>
<a><div class="DA_list_title_class">@{[enc_($imaps->{message})]}</div></a>
</li>
end_tag
				}]
			}]);
		} else {
			if ($c->{noerror}) {
				return([]);
			} else {
				DA::SmartPhone::errorpage($session, $imaps->{message});
			}
		}
	}

	my $result = DA::Ajax::Mailer::folders($session, $imaps, 0, 1);
	if ($result->{error}) {
		DA::SmartPhone::errorpage($session, $result->{message});
	}
	my $folders = $result->{folders_h};
	my $real_fid = &_real_fid($session, $imaps, $folders, $fid);
	my $virtual = &_virtual_fid($session, $imaps, $folders, $real_fid);
	my $type = DA::Ajax::Mailer::_fid2type($session, $imaps, $folders, $real_fid);
	my $srid = ($proc eq "portal" || DA::Ajax::Mailer::is_portal($session, $imaps, $type)) ? 100000000 : 0;

	my $vfilter = &_get_vfilter($session, $c); # 表示フィルタの仕組みを利用して絞込み
	my $update_folders = 0;
	my $max_row = ($proc eq "portal") ?
		$imaps->{smartphone}->{common}->{portal_listline} || 5 :
		$imaps->{smartphone}->{common}->{listline} || 50;

	if (!$c->{noupdate} && $update) {
		my $inbox_fid = &_real_fid($session, $imaps, $folders, "inbox");
		my $hash = {
			fid => $inbox_fid,
			noupdate => 1
		};
		
		if ($DA::Vars::p->{smartphone}->{sp_mail_sync} eq 'on') {
			if ($c->{reload} && ($hash->{fid} eq $real_fid || $c->{fid} eq 'portal')) {
				delete $hash->{noupdate};
			}
		}
		
		#==========================================================
		#              -----custom----
		#==========================================================
		DA::Custom::sp_rewrite_mail_list_hash($hash,$c,$real_fid);
		#==========================================================
		my $update_res = DA::Ajax::Mailer::update($session, $imaps, $folders, $hash);
		if ($update_res->{error}) {
			DA::SmartPhone::errorpage($session, $update_res->{message});
		}
		if ($inbox) {
			DA::SmartPhone::touch_inboxfile($session);
		}

		if (&_update_folders_counts($session, $folders, $inbox_fid, $update_res)) {
			$update_folders = 1;
		}
	}
	if (!$page && !$c->{noupdate} && $virtual ne "inbox") {
		my $hash = {
			fid => $real_fid,
			noupdate => 1
		};
		
		if ($DA::Vars::p->{smartphone}->{sp_mail_sync} eq 'on') {
			if ($c->{reload} && ($hash->{fid} eq $real_fid || $c->{fid} eq 'portal')) {
				delete $hash->{noupdate};
			}
		}
		
		#==========================================================
		#              -----custom----
		#==========================================================
		DA::Custom::sp_rewrite_mail_list_hash($hash,$c,$real_fid);
		#==========================================================
		my $update_res = DA::Ajax::Mailer::update($session, $imaps, $folders, $hash);
		if ($update_res->{error}) {
			DA::SmartPhone::errorpage($session, $update_res->{message});
		}

		if (&_update_folders_counts($session, $folders, $real_fid, $update_res)) {
			$update_folders = 1;
		}
	}
	if ($update_folders) {
		&_update_folders($session, $folders);
	}

	unless ($page) {
		$page = 1;
	}


	my $start_sno = ($page - 1) * $max_row + 1;
	my $end_sno   = ($page - 1) * $max_row + $max_row;
	my $headers_res = DA::Ajax::Mailer::headers($session, $imaps, $vfilter, $folders, {
		fid => ($srid) ? &_real_fid($session, $imaps, $folders, "portal") : $real_fid,
		srid => $srid,
		start_sno => $start_sno,
		end_sno => $end_sno,
		clear_recent => 1,
		clear_cache => ($page eq 1) ? 1 : 0
	});
	if ($headers_res->{error}) {
		DA::SmartPhone::errorpage($session, $headers_res->{message});
	}
	my @list;
	my $touch_menu_target_list=[];
	my $max_count = $headers_res->{view}->{messages};
	foreach my $h (@{$headers_res->{headers}}) {
		my $anchor = "#DA_mail_detail_Id";
		my $link = "javascript:DA.mail.detailMail('" . js_esc_(&_virtual_fid($session, $imaps, $folders, $h->{meta}->{fid})) . "', '" . js_esc_($h->{meta}->{uid}) . "', '" . js_esc_($srid) . "');";
		my $touch_menu_id = "DA_mail_list_" .  $h->{meta}->{uid};
		my $html = $h->{html};
		   $html =~ s/\<li([^>]*)>/<li $1 touch_menu_id=\"$touch_menu_id\">/;
		   $html =~ s/__ANCHOR__/$anchor/;
		   $html =~ s/__LINK__/$link/;
		push( @{$touch_menu_target_list}, $touch_menu_id );

		my $class = "DA_list_mail_class DA_list_arrow_class";
		my $sno = int($h->{meta}->{sno});
		my $ico = 0;

		if ($proc eq "portal") {
			$class .= " DA_list_mail_portal_class";
		}

		if ($h->{meta}->{seen}) {
			if ($h->{meta}->{replied}) {
				$class .= " DA_ico_mail_open_re_class";
			} elsif ($h->{meta}->{forwarded}) {
				$class .= " DA_ico_mail_open_fw_class";
			} else {
				$class .= " DA_ico_mail_open_class";
			}
		} else {
			if ($h->{meta}->{replied}) {
				$class .= " DA_ico_mail_close_re_class";
			} elsif ($h->{meta}->{forwarded}) {
				$class .= " DA_ico_mail_close_fw_class";
			} else {
				$class .= " DA_ico_mail_close_class";
			}
		}

		if ($h->{meta}->{priority} < 3) {
			$class .= " DA_mail_status_high_class";
			$ico ++;
		} elsif ($h->{meta}->{priority} > 3) {
			$class .= " DA_mail_status_low_class";
			$ico ++;
		}

		if ($h->{meta}->{attachment}) {
			$class .= " DA_mail_attach_on_class";
			$ico ++;
		}

		if ($h->{meta}->{toself}) {
			$class .= " DA_tomail_class";
		}

		$class .= " DA_mail_ico_$ico\_class";

		my $id;
		if ($proc eq "portal") {
			$id = "DA_portal_mail_" . &_virtual_fid($session, $imaps, $folders, $h->{meta}->{fid}) . "\_$h->{meta}->{uid}\_$srid\_Id";
		} else {
			$id = &_anchor_list_id($session, &_virtual_fid($session, $imaps, $folders, $h->{meta}->{fid}), $h->{meta}->{uid}, $srid);
		}

		push(@list, {
			id   => $id,
			html => $html,
			attr => {
				class => $class
			}
		});

	}

	my $view_count = ($end_sno > $max_count) ? $max_count : $end_sno;
	my $data = [];
	if ($proc eq "portal") {
	$view_count = $max_count;
		push(@list, {
			id   => "DA_portal_mail_next_Id",
			html => "<li><a href=\"#DA_mail_folder_0_Id\" slidedonejs=\"DA.mail.switchFolders();\"><div class=\"DA_list_title_class\">".t_('フォルダ一覧を見る')."</div></a></li>",
			attr =>{
				class => "DA_portal_next_class DA_list_arrow_class DA_ico_sc_0_class",
			}
		});
		
		$view_count = sprintf("&nbsp;%s&nbsp;",$view_count) if( DA::SmartPhone::isAndroid() );

		$data = [{
			id   => "DA_portal_mail_count_Id",
			type => "normal",
			html => $view_count,
		}, {
			id   => "DA_portal_mail_Id",
			type => "list",
			list => \@list
		}];
	} else {

		$data = [{
			id   => &_anchor_list_etc_id($session, $virtual, "subtitle"),
			type => "normal",
			html => enc_(DA::Ajax::Mailer::_fid2name($session, $imaps, $folders, $real_fid))
		}, {
			id   => &_anchor_list_etc_id($session, $virtual, "contents"),
			type => "list",
			list => \@list
		}, {
			id   => &_anchor_list_etc_id($session, $virtual, "count"),
			type => "normal",
			html => enc_(t_("%1件中%2件を表示しています。", $max_count, $view_count))
		}];

		if ($max_count > $view_count) {
			push(@{$data}, {
				id   => &_anchor_list_etc_id($session, $virtual, "next"),
				type => "normal",
				html => enc_(t_("続きを読む") . ".."),
				attr => {
					style => "display:;"
				}
			});
		} else {
			push(@{$data}, {
				id   => &_anchor_list_etc_id($session, $virtual, "next"),
				type => "normal",
				html => enc_(t_("続きを読む") . ".."),
				attr => {
					style => "display:none;"
				}
			});
		}
	}

	# ＵＩＤリスト
	my $uidlst = [];
	my $list = DA::Ajax::Mailer::storable_retrieve($session, "$real_fid\.headers.uidlst");
	if ($srid) {
		my $virtuals = {};
		foreach my $l (@{$list}) {
			my $path = DA::Ajax::Mailer::_encode($session, $imaps, $l->{folder_name});
			my $uid = $l->{uid_number};
			my $virtual;
			if ($virtuals->{$path}) {
				$virtual = $virtuals->{$path};
			} else {
				my $fid = DA::Ajax::Mailer::_path2fid($session, $imaps, $folders, $path);
				$virtual = &_virtual_fid($session, $imaps, $folders, $fid);
				$virtuals->{$path} = $virtual;
			}
			push(@{$uidlst}, "$virtual\_$uid");
		}
	} else {
		foreach my $l (@{$list}) {
			push(@{$uidlst}, "$virtual\_$l")
		}
	}

	if ($uidlst) {
		push(@{$data}, {
			type => "javascript",
			js   =><<end_js
DA.mail.setUidlst('@{[js_esc_($virtual)]}', @{[DA::SmartPhone::obj2json($uidlst)]});
end_js
		});
	}
	
	DA::Ajax::Mailer::disconnect($session, $imaps);

	return($data);
}

sub _get_json_mail4detail($$;$;$) {
	my ($session, $c, $p, $proc) = @_;
	my $fid  = $c->{fid};
	my $uid  = int($c->{uid});
	my $srid = int($c->{srid});
	my $keep = int($c->{keep});

	my ($module, $icons, $allow) = DA::SmartPhone::get_sp_params($session, $p, [qw(module icons htmlmail_allow_tag)]);

	unless ($allow) {
		DA::SmartPhone::errorpage($session, t_("ＨＴＭＬメール設定の読み込みに失敗しました。"));
	}

	my $imaps;

	if($c->{org_mail_gid} && $c->{org_mail_gid} ne "ajaxMailer"){
		$imaps= DA::Ajax::Mailer::connect($session, {
			org_mail => $c->{org_mail_gid},
			pop => 1
		});
	} else {
		$imaps = DA::Ajax::Mailer::connect($session, {
			pop => 1,
			org_mail => $session->{user}
		});
	}
	if ($imaps->{error}) {
		DA::SmartPhone::errorpage($session, $imaps->{message});
	}

	my $result = DA::Ajax::Mailer::folders($session, $imaps);
	if ($result->{error}) {
		DA::SmartPhone::errorpage($session, $result->{message});
	}
	my $folders = $result->{folders_h};
	my $real_fid = &_real_fid($session, $imaps, $folders, $fid);
	my $exists = $folders->{$real_fid}->{messages};

	my $rd = DA::Ajax::Mailer::detail($session, $imaps, $folders, {
		fid  => $real_fid,
		uid  => $uid,
		srid => $srid
	});
	my $rf = DA::Ajax::Mailer::flag($session, $imaps, $folders, {
		fid  => $real_fid,
		uid  => $uid,
		srid => $srid
	});
	if ($rd->{error}) {
		DA::SmartPhone::errorpage($session, $rd->{message});
	} elsif ($rf->{error}) {
		DA::SmartPhone::errorpage($session, $rf->{message});
	}

	if (!$rf->{flag}->{seen} && !$c->{keep}) {
		my $rs = DA::Ajax::Mailer::seen_mail($session, $imaps, undef, $folders, {
			fid  => $real_fid,
			uid  => $uid,
			srid => $srid
		});
		if ($rs->{error}) {
			DA::SmartPhone::errorpage($session, $rs->{message});
		}
	}

	my $icon_class = "DA_mail_header_title";
	if ($rd->{detail}->{priority} > 3) {
		$icon_class .= " DA_mail_status_low_class";
	} elsif ($rd->{detail}->{priority} < 3) {
		$icon_class .= " DA_mail_status_high_class";
	}
	my $attach_class = "DA_mail_heder_switch_class";
	if ($rd->{detail}->{last_aid}) {
		$attach_class .= " DA_mail_attach_on_class";
	}

	#===============================
	#  custom
	#===============================    
	DA::Custom::sp_rewrite_mail_detail($session, $rd);

	my $fields = {};
	foreach my $f (qw(from to cc bcc)) {
		if ($rd->{detail}->{$f}) {
			foreach my $d (@{$rd->{detail}->{$f}}) {
				my $name = $d->{name};
				my $email = $d->{email};
				my $stype = $d->{stype};
				my $text;
				if (DA::SmartPhone::is_group($session, $stype)) {
					$text = $name;
				} else {
					if ($name eq "") {
						$text = $email;
					} else {
						if ($email) {
							$text = "$name <$email>";
						} else {
							$text = $name;
						}
					}
				}
				$fields->{$f} .= &ug_tag4class($session, $text, $stype);
			}
		}
	}

	my $notification = (!$rd->{sendtype} && scalar(@{$rd->{detail}->{notification}}) && !$rf->{flag}->{seen} && !$rf->{flag}->{mdn}) ? 1 : 0;

	if ($notification) {
		if ($imaps->{custom}->{mdn_reply} eq "force") {
			my $rm = DA::Ajax::Mailer::mdn_mail($session, $imaps, undef, $folders, {
				fid  => $real_fid,
				uid  => $uid,
				srid => $srid
			});
			if ($rm->{error}) {
				DA::SmartPhone::errorpage($session, $rm->{message});
			}
			$notification = 2;
		} elsif ($imaps->{custom}->{mdn_reply} eq "deny") {
			$notification = 0;
		} else {
			if ($imaps->{mail}->{mdn_prompt} eq "off") {
				$notification = 0;
			} else {
				$notification = 1;
			}
		}
	}

	my ($text, $html, $attachs) = &_get_mailtext_with_attachment($session, $imaps, $module, $allow, $icons, $rd);

	my $data = [{
		id   => "DA_mail_detail_subject_Id",
		type => "normal",
		html => ($rd->{detail}->{subject} eq "") ? "&nbsp;" : enc_($rd->{detail}->{subject})
	}, {
		id   => "DA_mail_detail_flagged_Id",
		type => "normal",
		attr => {
			class => ($rf->{flag}->{flagged}) ? "DA_mail_flag_on_class" : "DA_mail_flag_off_class"
		}
	}, {
		id   => "DA_mail_detail_icon_Id",
		type => "normal",
		attr => {
			class => $icon_class
		}
	}, {
		id   => "DA_mail_detail_switcharea_Id",
		type => "normal",
		attr => {
			class => $attach_class
		}
	}, {
		id   => "DA_mail_detail_from_Id",
		type => "normal",
		html => $fields->{from}
	}, {
		id   => "DA_mail_detail_to_Id",
		type => "normal",
		html => ($fields->{to} eq "") ? "&nbsp;" : $fields->{to}
	}, {
		id   => "DA_mail_detail_cc_Id",
		type => "normal",
		html => ($fields->{cc} eq "") ? "&nbsp;" : $fields->{cc}
	}, {
		id   => "DA_mail_detail_bcc_label_Id",
		type => "normal",
		attr => {
			style => ($fields->{bcc} eq "") ? "display:none;" : "display:;"
		}
	}, {
		id   => "DA_mail_detail_bcc_Id",
		type => "normal",
		html => $fields->{bcc},
		attr => {
			style => ($fields->{bcc} eq "") ? "display:none;" : "display:;"
		}
	}, {
		id   => "DA_mail_detail_date_Id",
		type => "normal",
		html => DA::SmartPhone::date_format4detail($session, DA::Mailer::format_date($rd->{detail}->{date}, 0, $DA::Vars::p->{timezone}))
	}, {
		id   => "DA_mail_detail_attachment_Id",
		type => "normal",
		html => $attachs
	}, {
		id   => "DA_mail_detail_body_Id",
		type => "normal",
		html => $text
	}, {
		id   => "DA_mail_detail_prev_link_Id",
		type => "normal",
		attr => {
			href => "javascript:DA.mail.nextMail('prev');"
		}
	}, {
		id   => "DA_mail_detail_next_link_Id",
		type => "normal",
		attr => {
			href => "javascript:DA.mail.nextMail('next');"
		}
	}, {
		id   => "DA_head_mail_detail_prev_button_Id",
		type => "normal",
		attr => {
			href => "javascript:DA.mail.nextMail('prev');"
		}
	}, {
		id   => "DA_head_mail_detail_next_button_Id",
		type => "normal",
		attr => {
			href => "javascript:DA.mail.nextMail('next');"
		}
	}];

	push(@{$data}, {
		id   => "DA_mail_detail_next_Id",
		type => "normal",
		html => enc_(t_("続きを読む") . ".."),
		attr => {
			style => "display:none;"
		}
	});

	my $id;
	if ($srid eq 100000000) {
		$id = "DA_portal_mail_" . &_virtual_fid($session, $imaps, $folders, $fid) . "_" . $uid . "_" . $srid . "_Id";
	} else {
		$id = &_anchor_list_id($session, &_virtual_fid($session, $imaps, $folders, $fid), $uid, $srid);
	}
	push(@{$data}, {
		type => "javascript",
		js   =><<end_js
@{[($proc) ? "DA.mail.seenMailList('" . js_esc_($id) . "');" : ""]}
end_js
	}, {
		type => "javascript.withoutcache",
		js   =><<end_js
@{[
($notification eq 2) ? "alert('" . js_esc_(t_("開封通知を送信しました。")) . "')" :
($notification eq 1) ? "DA.mail.mdnMail('" . js_esc_(t_("開封通知を要求されています。送信しますか？")) . "')" : ""
]}
end_js
	});

	DA::Ajax::Mailer::disconnect($session, $imaps);
	
	return($data);
}

sub _get_mailtext_with_attachment($$$$$$) {
	my ($session, $imaps, $module, $allow, $icons, $rd) = @_;
	my $charset = DA::Ajax::Mailer::mailer_charset();
	my $real_fid = $rd->{detail}->{fid};
	my $uid = $rd->{detail}->{uid};

	my $text = $rd->{detail}->{body}->{text};
	my $html = $rd->{detail}->{body}->{html};
	if ($html ne "") {
		$html = DA::Ajax::Mailer::_extract_htmlmail_part($session, $module, $allow, $html, DA::Ajax::Mailer::mailer_charset(), "attach", $imaps->{custom});
		$html =~s/^(\s*<p[^<>]*?>[\r\n]*<hr)/<br>$1/i;
		$html = DA::Ajax::Mailer::_make_htmlmail_part($html, DA::Ajax::Mailer::mailer_charset(), 1);

		my $file = DA::Ajax::Mailer::_fullpath($session, "detail\-$real_fid\-$uid\-html\.html");
		unless (DA::Ajax::Mailer::write_file_buf($session, $file, $html)) {
			DA::SmartPhone::errorpage($session, t_("リッチテキストファイルの書き込みに失敗しました。"));
		}
	}

	$text = DA::SmartPhone::cut_text($text, $charset);
	$text = DA::CGIdef::encode($text, 2, 1, ($charset eq "UTF-8") ? "utf8" : "euc");
	$text = DA::IS::conv_href($session, $text, 1, $charset, 1);

	my $attachs;
	if ($html ne "") {
		my $name = t_("リッチテキスト本文");
		my $file = DA::Ajax::Mailer::_fullpath($session, "detail\-$real_fid\-$uid\-html\.html");
		my $link = DA::Ajax::Mailer::_urlpath($session, "detail\-$real_fid\-$uid\-html\.html");
		$attachs .= &file_tag4class($session, $name, $link, $file, $icons);
	}
	if ($rd->{detail}->{attach}) {
		foreach my $aid (sort {$a <=> $b} keys %{$rd->{detail}->{attach}}) {
			my $name = $rd->{detail}->{attach}->{$aid}->{name};
			my $file = DA::Ajax::Mailer::_fullpath($session, $rd->{detail}->{attach}->{$aid}->{path});
			my $link = DA::Ajax::Mailer::_urlpath($session, $rd->{detail}->{attach}->{$aid}->{path});
			$attachs .= &file_tag4class($session, $name, $link, $file, $icons);
		}
	}

	return($text, $html, $attachs);
}

sub _get_json_mail4detail_delete($$;$) {
	my ($session, $c, $p) = @_;
	my $fid  = $c->{fid};
	my $uid  = int($c->{uid});
	my $srid = int($c->{srid});

	my $imaps;
	if($c->{org_mail_gid} && $c->{org_mail_gid} ne "ajaxMailer"){
		$imaps= DA::Ajax::Mailer::connect($session, {
			org_mail => $c->{org_mail_gid},
			pop => 1
		});
	} else {
		$imaps = DA::Ajax::Mailer::connect($session, {
			pop => 1,
			org_mail => $session->{user}
		});
	}
	if ($imaps->{error}) {
		DA::SmartPhone::errorpage($session, $imaps->{message});
	}

	my $folders = DA::Ajax::Mailer::storable_retrieve($session, "folders");
	unless ($folders) {
		DA::SmartPhone::errorpage($session, $imaps->{message});
	}
	my $real_fid = &_real_fid($session, $imaps, $folders, $fid);
	my $virtual = &_virtual_fid($session, $imaps, $folders, $real_fid);

	my $vfilter = &_get_vfilter($session, $c); # 表示フィルタの仕組みを利用して絞込み

	my $res;
	if (DA::Ajax::Mailer::_fid2trash_m($session, $imaps, $folders, $real_fid)) {
		$res = DA::Ajax::Mailer::move_mail($session, $imaps, $vfilter, $folders, {
			fid  => $real_fid,
			uid  => $uid,
			srid => $srid
		}, 1);
	} else {
		$res = DA::Ajax::Mailer::delete_mail($session, $imaps, $vfilter, $folders, {
			fid  => $real_fid,
			uid  => $uid,
			srid => $srid
		});
	}
	if ($res->{error}) {
		DA::SmartPhone::errorpage($session, $res->{message});
	}

	my ($id, $reload_fid);
	if ($srid eq 100000000) {
		$id = "DA_mail_list_portal_Id";
		$reload_fid = "portal";
	} else {
		$id = &_anchor_list_div_id($session, $virtual);
		$reload_fid = $virtual;
	}

	my $data = [];
	push(@{$data}, {
		type => "javascript.withoutcache",
		js   =><<end_js
DA.param.mail.uid = null;
DA.param.mail.page = 0;
DA.navigationController.simpleBackPage('@{[js_esc_($id)]}');
DA.mail.listReload('@{[js_esc_($reload_fid)]}');
DA.message.dispNotice('@{[js_esc_(t_("メールが削除されました。"))]}');
DA.mail.jsonConExecute('portal', {'mail_func':'portal','fid':'portal'}, false, true, 'portal_mail');
end_js
	});

	DA::Ajax::Mailer::disconnect($session, $imaps);

	return($data);
}

sub _get_json_mail4detail_flagged($$;$;$) {
	my ($session, $c, $p, $proc) = @_;
	my $fid  = $c->{fid};
	my $uid  = int($c->{uid});
	my $srid = int($c->{srid});

	my $imaps;
	if($c->{org_mail_gid} && $c->{org_mail_gid} ne "ajaxMailer"){
		$imaps= DA::Ajax::Mailer::connect($session, {
			org_mail => $c->{org_mail_gid},
			pop => 1
		});
	} else {
		$imaps = DA::Ajax::Mailer::connect($session, {
			pop => 1,
			org_mail => $session->{user}
		});
	}
	if ($imaps->{error}) {
		DA::SmartPhone::errorpage($session, $imaps->{message});
	}

	my $folders = DA::Ajax::Mailer::storable_retrieve($session, "folders");
	unless ($folders) {
		DA::SmartPhone::errorpage($session, t_("フォルダ一覧が取得できませんでした。"));
	}
	my $real_fid = &_real_fid($session, $imaps, $folders, $fid);

	my $res;
	if ($proc eq "flagged") {
		$res = DA::Ajax::Mailer::flagged_mail($session, $imaps, undef, $folders, {
			fid  => $real_fid,
			uid  => $c->{uid},
			srid => $c->{srid}
		});
	} else {
		$res = DA::Ajax::Mailer::unflagged_mail($session, $imaps, undef, $folders, {
			fid  => $real_fid,
			uid  => $c->{uid},
			srid => $c->{srid}
		});
	}

	if ($res->{error}) {
		DA::SmartPhone::errorpage($session, $res->{message});
	}

	my $data = [];
	push(@{$data}, {
		id   => "DA_mail_detail_flagged_Id",
		type => "normal",
		attr => {
			class => ($proc eq "flagged") ? "DA_mail_flag_on_class" : "DA_mail_flag_off_class"
		}
	});

	DA::Ajax::Mailer::disconnect($session, $imaps);

	return($data);
}

sub _get_json_mail4detail_seen($$;$;$) {
	my ($session, $c, $p, $proc) = @_;
	my $fid  = $c->{fid};
	my $uid  = int($c->{uid});
	my $srid = int($c->{srid});
	my $data = [];

	my $imaps;
	if($c->{org_mail_gid} && $c->{org_mail_gid} ne "ajaxMailer"){
		$imaps= DA::Ajax::Mailer::connect($session, {
			org_mail => $c->{org_mail_gid},
			pop => 1
		});
	} else {
		$imaps = DA::Ajax::Mailer::connect($session, {
			pop => 1,
			org_mail => $session->{user}
		});
	}
	if ($imaps->{error}) {
		DA::SmartPhone::errorpage($session, $imaps->{message});
	}

	my $folders = DA::Ajax::Mailer::storable_retrieve($session, "folders");
	unless ($folders) {
		DA::SmartPhone::errorpage($session, t_("フォルダ一覧が取得できませんでした。"));
	}
	my $real_fid = &_real_fid($session, $imaps, $folders, $fid);

	my $rf = DA::Ajax::Mailer::flag($session, $imaps, $folders, {
		fid  => $real_fid,
		uid  => $uid,
		srid => $srid
	});
	if ($rf->{error}) {
		DA::SmartPhone::errorpage($session, $rf->{message});
	}

	my $res;
	# 未既読処理
	if ($proc eq "seen" && !$rf->{flag}->{seen}) {
		$res = DA::Ajax::Mailer::seen_mail($session, $imaps, undef, $folders, {
			fid  => $real_fid,
			uid  => $uid,
			srid => $srid
		});
	} elsif ($proc eq "unseen" && $rf->{flag}->{seen}) {
		$res = DA::Ajax::Mailer::unseen_mail($session, $imaps, undef, $folders, {
			fid  => $real_fid,
			uid  => $uid,
			srid => $srid
		});
	}
	if ($res->{error}) {
		DA::SmartPhone::errorpage($session, $res->{message});
	}

	# 添付ファイルチェック
	if ($rf->{attach4ajx}) {
		if (!DA::Ajax::storable_exist($session, "$fid\.$uid\.detail")) {
			my ($module, $icons, $allow) = DA::SmartPhone::get_sp_params($session, $p, [qw(module icons htmlmail_allow_tag)]);

			unless ($allow) {
				DA::SmartPhone::errorpage($session, t_("ＨＴＭＬメール設定の読み込みに失敗しました。"));
			}

			my $rd = DA::Ajax::Mailer::detail($session, $imaps, $folders, {
				fid  => $real_fid,
				uid  => $uid,
				srid => $srid
			});
			if ($rd->{error}) {
				DA::SmartPhone::errorpage($session, $rd->{message});
			}

			my ($text, $html, $attachs) = &_get_mailtext_with_attachment($session, $imaps, $module, $allow, $icons, $rd);
			if ($attachs) {
				push(@{$data}, {
					id   => "DA_mail_detail_attachment_Id",
					type => "normal",
					html => $attachs
				});
			}
		}
	}

	my $portal_id = "DA_portal_mail_" . &_virtual_fid($session, $imaps, $folders, $real_fid) . "_" . $uid . "_" . "100000000" . "_Id";
	my $other_id = &_anchor_list_id($session, &_virtual_fid($session, $imaps, $folders, $real_fid), $uid, $srid);
	if ( $proc eq "unseen" ) {
		push(@{$data}, {
		type => "javascript",
		js   =><<end_js
DA.mail.unseenMailList('@{[js_esc_($portal_id)]}');
DA.mail.unseenMailList('@{[js_esc_($other_id)]}');
end_js
});
		push(@{$data}, {
			type => "javascript.withoutcache",
			js   =><<end_js
DA.message.dispNotice('@{[js_esc_(t_("未読に戻しました。"))]}');
end_js
});
	} else {
		push(@{$data}, {
		type => "javascript",
		js   =><<end_js
DA.mail.seenMailList('@{[js_esc_($portal_id)]}');
DA.mail.seenMailList('@{[js_esc_($other_id)]}');
end_js
	});
	}

	DA::Ajax::Mailer::disconnect($session, $imaps);

	return($data);
}

sub _get_json_mail4detail_mdn($$;$;$) {
	my ($session, $c, $p, $proc) = @_;
	my $fid  = $c->{fid};
	my $uid  = int($c->{uid});
	my $srid = int($c->{srid});

	my $imaps;
	if($c->{org_mail_gid} && $c->{org_mail_gid} ne "ajaxMailer"){
		$imaps= DA::Ajax::Mailer::connect($session, {
			org_mail => $c->{org_mail_gid},
			pop => 1
		});
	} else {
		$imaps = DA::Ajax::Mailer::connect($session, {
			pop => 1,
			org_mail => $session->{user}
		});
	}
	if ($imaps->{error}) {
		DA::SmartPhone::errorpage($session, $imaps->{message});
	}

	my $folders = DA::Ajax::Mailer::storable_retrieve($session, "folders");
	unless ($folders) {
		DA::SmartPhone::errorpage($session, t_("フォルダ一覧が取得できませんでした。"));
	}
	my $real_fid = &_real_fid($session, $imaps, $folders, $fid);
	my $virtual = &_virtual_fid($session, $imaps, $folders, $real_fid);

	my $res = DA::Ajax::Mailer::mdn_mail($session, $imaps, undef, $folders, {
		fid  => $real_fid,
		uid  => $uid,
		srid => $srid
	});
	if ($res->{error}) {
		DA::SmartPhone::errorpage($session, $res->{message});
	}

	my $data = [];
	push(@{$data}, {
		type => "javascript.withoutcache",
		js   =><<end_js
DA.param.mail.uid = null;
DA.navigationController.simpleBackPage('@{[js_esc_(&_anchor_list_div_id($session, $virtual))]}');
DA.message.dispNotice('@{[js_esc_(t_("開封通知を送信しました。"))]}');
end_js
	});

	DA::Ajax::Mailer::disconnect($session, $imaps);

	return($data);
}

sub _get_json_mail4edit($$;$;$) {
	my ($session, $c, $p, $proc) = @_;
	my ($icons) = DA::SmartPhone::get_sp_params($session, $p, [qw(icons)]);
	my $imaps;
	my $org_mail_gid;
	if($c->{org_mail_gid} && $c->{org_mail_gid} ne "ajaxMailer"){	
		$org_mail_gid = $c->{org_mail_gid};
		DA::Session::update($session);
	} else {
		$org_mail_gid = $session->{user};
	}
	if ($proc eq "send") {
		$imaps = DA::Ajax::Mailer::connect($session, { "nocheck" => 1, "org_mail" => $org_mail_gid, "nosessionerror" => 1});
	} elsif ($proc eq "draft" || $proc eq "reply" || $proc eq "all_reply" || $proc eq "forward" || $proc eq "edit") {
		$imaps = DA::Ajax::Mailer::connect($session, { "org_mail" => $org_mail_gid});
	} else {
		$imaps = DA::Ajax::Mailer::connect($session, { "nosession" => 1, "org_mail" => $org_mail_gid});
	}
	
	if ($imaps->{error}) {
		DA::SmartPhone::errorpage($session, $imaps->{message});
	}

	my $result;
	if ($proc eq "send" || $proc eq "draft") {
		if (my $mail = DA::Ajax::Mailer::storable_retrieve($session, "mail.$c->{maid}")) {
			$c->{xml} = &_query2data4edit($session, $imaps, $c, $mail);

			my $attachment = &json2obj($c->{attachment} || "{}");
			my $res;
			if ($proc eq "send") {
				$res = DA::Ajax::Mailer::send_mail($session, $imaps, {
					maid => $c->{maid},
					xml => $c->{xml},
					fid => $mail->{fid},
					uid => $mail->{uid},
					target_attach_list => $attachment,
					nopreview => $c->{nopreview},
					org_mail_gid => $org_mail_gid
				});
			} else {
				$res = DA::Ajax::Mailer::draft_mail($session, $imaps, {
					maid => $c->{maid},
					xml => $c->{xml},
					arget_attach_list => $attachment
				});
			}
			if ($res->{error}) {
				DA::SmartPhone::errorpage($session, $res->{message});
			}

			if ($res->{errors} && scalar(keys %{$res->{errors}}) && !$c->{nopreview}) {
				$result = {
					mail   => &_get_query4edit($session, $imaps, $c, $mail),
					errors => $res->{errors}
				};
			} elsif ($res->{warns} && scalar(keys %{$res->{warns}}) && !$c->{nopreview}) {
				$result = {
					mail  => &_get_query4edit($session, $imaps, $c, $mail),
					warns => $res->{$res}
				};
			} else {
				my $folders = DA::Ajax::Mailer::storable_retrieve($session, "folders");
				my $virtual = &_virtual_fid($session, $imaps, $folders, $mail->{fid});

				unless ($folders) {
					DA::SmartPhone::errorpage($session, t_("フォルダ一覧が取得できませんでした。"));
				}

				if ($mail->{proc} =~ /^(?:reply|all_reply|forward)$/) {
					my $res;
					if ($mail->{proc} eq "forward") {
						$res = DA::Ajax::Mailer::forwarded_mail($session, $imaps, undef, $folders, {
							fid => $mail->{fid},
							uid => $mail->{uid}
						});
					} else {
						$res = DA::Ajax::Mailer::replied_mail($session, $imaps, undef, $folders, {
							fid => $mail->{fid},
							uid => $mail->{uid}
						});
					}
					if ($res->{error}) {
						DA::SmartPhone::errorpage($session, $res->{message});
					}
				}

				&_regist_addr4edit($session, $c->{xml});

				if ($mail->{proc} eq "edit") {
					return([{
						type => "javascript.withoutcache",
						js   =><<end_js
DA.navigationController.simpleBackPage('@{[js_esc_(&_anchor_list_div_id($session, $virtual))]}');
DA.mail.listReload();
DA.message.dispNotice('@{[js_esc_(($proc eq "send") ? t_("メールの送信が完了しました。") : t_("メールの保存が完了しました。"))]}');
end_js
					}]);
				} else {
					return([{
						type => "javascript.withoutcache",
						js   =><<end_js
DA.mail.historyBack();
DA.message.dispNotice('@{[js_esc_(($proc eq "send") ? t_("メールの送信が完了しました。") : t_("メールの保存が完了しました。"))]}');
end_js
					}]);
				}
			}
		} else {
			DA::SmartPhone::errorpage($session, t_("メールの読み込みに失敗しました。"));
		}
	} elsif ($proc eq "template") {
		my $template = DA::Ajax::Mailer::template($session, $imaps, {
			tid => $c->{tid}
		});
		if ($template->{error}) {
			DA::SmartPhone::errorpage($session, $template->{message});
		}

		# 上書き処理
		if (my $mail = DA::Ajax::Mailer::storable_retrieve($session, "mail.$c->{maid}")) {
			$result = {
				mail => &_get_query4edit($session, $imaps, $c, $mail)
			};

			if ($template->{template}->{cc_text} ne "" || $template->{template}->{bcc_text} ne "") {
				$c->{ccbcc} = 1;
			}

			$result->{mail}->{tid} = $template->{template}->{tid};
			$result->{mail}->{to}  = $template->{template}->{to};
			$result->{mail}->{cc}  = $template->{template}->{cc};
			$result->{mail}->{bcc} = $template->{template}->{bcc};
			$result->{mail}->{to_text} = $template->{template}->{to_text};
			$result->{mail}->{cc_text} = $template->{template}->{cc_text};
			$result->{mail}->{bcc_text} = $template->{template}->{bcc_text};
			$result->{mail}->{subject} = $template->{template}->{subject};
			$result->{mail}->{body}->{text} = $template->{template}->{body}->{text};
		} else {
			DA::SmartPhone::errorpage($session, t_("メールの読み込みに失敗しました。"));
		}
	} elsif ($proc eq "reply" || $proc eq "all_reply" || $proc eq "forward" || $proc eq "edit") {
		my $folders = DA::Ajax::Mailer::storable_retrieve($session, "folders");
		unless ($folders) {
			DA::SmartPhone::errorpage($session, t_("フォルダ一覧が取得できませんでした。"));
		}
		my $ec = {
			fid => &_real_fid($session, $imaps, $folders, $c->{fid}),
			uid => $c->{uid}
		};
		if ($proc eq "reply") {
			$result = DA::Ajax::Mailer::reply_mail($session, $imaps, $folders, $ec);
		} elsif ($proc eq "all_reply") {
			$result = DA::Ajax::Mailer::all_reply_mail($session, $imaps, $folders, $ec);
		} elsif ($proc eq "forward") {
			$result = DA::Ajax::Mailer::forward_mail($session, $imaps, $folders, $ec);
		} elsif ($proc eq "edit") {
			$result = DA::Ajax::Mailer::edit_mail($session, $imaps, $folders, $ec);
		}
	} else {
		if ($proc eq "email") {
			$result = DA::Ajax::Mailer::email_mail($session, $imaps, undef, $c);
		} elsif ($proc eq "share") {
			$result = DA::Ajax::Mailer::share_mail($session, $imaps, undef, $c);
		} elsif ($proc eq "bulk") {
			$result = DA::Ajax::Mailer::bulk_mail($session, $imaps, undef, $c);
		} elsif ($proc eq "user") {
			$result = DA::Ajax::Mailer::user_mail($session, $imaps, undef, $c);
		} elsif ($proc eq "group") {
			$result = DA::Ajax::Mailer::group_mail($session, $imaps, undef, $c);
		} else {
			$result = DA::Ajax::Mailer::new_mail($session, $imaps, undef, $c);
		}
	}
	if ($result->{error}) {
		DA::SmartPhone::errorpage($session, $result->{message});
	}

	my $mail = $result->{mail};
	my $maid = $mail->{maid} || $c->{maid};

	# ページタイトル
	my $title;
	if ($proc eq "reply" || $proc eq "all_reply") {
		$title = t_("返信メール");
	} elsif ($proc eq "forward") {
		$title = t_("転送メール");
	} elsif ($proc eq "edit") {
		$title = t_("メール編集");
	} else {
		$title = t_("メール作成");
	}

	# 宛先
	my ($address, $address_text) = &_split_address_data4edit($session, $mail);

	# 件名
	my $subject = $mail->{subject};

	# 本文
	my $body = $mail->{body}->{text};
	   $body =~s/[\r\n]+$//g;

	# 添付ファイル
	my $attachment = &json2obj($c->{attachment} || "{}");
	my $attach;
	if ($mail->{attach}) {
		foreach my $aid (sort {$a <=> $b} keys %{$mail->{attach}}) {
			my $name = $mail->{attach}->{$aid}->{name};
			my $file = DA::Ajax::Mailer::_fullpath($session, $mail->{attach}->{$aid}->{path});
			my $size = $mail->{attach}->{$aid}->{size};

			$attach .= &file_tag4checkbox($session, $name, $file, $size, $icons, {
				id      => "DA_mail_edit_attachment_$maid\_$aid\_Id",
				name    => "DA_mail_edit_attachment_Name",
				checked => (!$c->{attachment} || $attachment->{$aid}) ? 1 : 0
			});
		}
	}

	# 署名
	my $sid = $mail->{status}->{sid};

	# 重要度
	my $priority = $mail->{priority} || 3;

	# グループ名を記載する
	my $group_name = ($mail->{status}->{group_name}) ? "true" : "false";

	# 返信アドレスを使用する
	my $reply_use = ($mail->{status}->{reply_use}) ? "true" : "false";

	my $data = [];
	if ($proc ne "template") {
		# テンプレート一覧
		my $template_options=<<end_tag;
<option value="">@{[t_("テンプレート選択")]}</option>
end_tag

		if ($mail->{template}) {
			foreach my $t (@{$mail->{template}}) {

				$template_options .= <<end_tag;
<option value="@{[enc_($t->{tid})]}">@{[enc_($t->{name})]}</option>
end_tag

			}
		}

		push(@{$data}, {
			id   => "DA_mail_edit_template_Id",
			type => "normal",
			html => $template_options
		});

		# 署名一覧
		my $sign_options;
		if ($mail->{sign}) {
			foreach my $s (@{$mail->{sign}}) {
				my $selected = ($sid eq $s->{sid}) ? " selected" : "";

			$sign_options .=<<end_tag;
<option value="@{[enc_($s->{sid})]}"$selected>@{[enc_($s->{name})]}</option>
end_tag

			}
		}

		push(@{$data}, {
			id   => "DA_mail_edit_sign_Id",
			type => "normal",
			html => $sign_options
		});

		# 重要度一覧
		my $priority_selected = {};
		   $priority_selected->{$priority} = " selected";
		my $priority_options =<<end_tag;
<option value="1"$priority_selected->{1}>@{[t_("高い")]}</option>
<option value="3"$priority_selected->{3}>@{[t_("通常")]}</option>
<option value="5"$priority_selected->{5}>@{[t_("低い")]}</option>
end_tag

		push(@{$data}, {
			id   => "DA_mail_edit_priority_Id",
			type => "normal",
			html => $priority_options
		});

		# グループ名の記載
		push(@{$data}, {
			id   => "DA_mail_edit_groupname_Id",
			type => "normal",
			attr => {
				toggled => $group_name
			}
		});

		# 返信アドレスの使用
		push(@{$data}, {
			id   => "DA_mail_edit_replyuse_Id",
			type => "normal",
			attr => {
				toggled => $reply_use
			}
		});

		# 返信履歴
		my $in_reply_to = $mail->{in_reply_to};
		my $references = $mail->{references};
		push(@{$data}, {
			id   => "DA_mail_edit_inreplyto_Id",
			type => "normal",
			attr => {
				value => $in_reply_to
			}
		}, {
			id   => "DA_mail_edit_references_Id",
			type => "normal",
			attr => {
				value => $references
			}
		});

		# エンコード
		my $charset = $mail->{status}->{charset};
		push(@{$data}, {
			id   => "DA_mail_edit_charset_Id",
			type => "normal",
			attr => {
				value => $charset
			}
		});

		# 開封通知(未対応)
		my $notification = $mail->{status}->{notification};
		push(@{$data}, {
			id   => "DA_mail_edit_notification_Id",
			type => "normal",
			attr => {
				value => $notification
			}
		});

		# 書式
		my $content_type = $mail->{status}->{content_type};
		push(@{$data}, {
			id   => "DA_mail_edit_contenttype_Id",
			type => "normal",
			attr => {
				value => $content_type
			}
		});

		# 差出人アドレス
		my $from = $mail->{status}->{from};
		push(@{$data}, {
			id   => "DA_mail_edit_from_Id",
			type => "normal",
			attr => {
				value => $from
			}
		});

		push(@{$data}, {
			type => "javascript",
			js   =><<end_js
DA.param.mail.sign      = '@{[js_esc_($sid)]}';
DA.param.mail.priority  = '@{[js_esc_($priority)]}';
DA.param.mail.groupname = '@{[js_esc_($group_name)]}';
DA.param.mail.replyuse  = '@{[js_esc_($reply_use)]}';
end_js
		});
	}

	# エラー表示
	my $alerts = [];
	my $m = {};
	my $errors = $result->{errors};
	my $error;
	foreach my $f (qw(fieldset1 fieldset2 fieldset3 fieldset4)) {
		if ($errors->{$f}) {
			unless ($m->{$f}) {
				$m->{$f} = [];
			}
			foreach my $r (@{$errors->{$f}}) {
				push(@{$alerts}, enc_($r->{message}));
				push(@{$m->{$f}}, "[!]" . enc_($r->{message}));
			}
			$error = 1;
		}
	}

	# 警告表示
	my $warns = $result->{warns};
	my $warn;
	foreach my $f (qw(fieldset1 fieldset2 fieldset3 fieldset4)) {
		if ($warns->{$f}) {
			unless ($m->{$f}) {
				$m->{$f} = [];
			}
			foreach my $r (@{$warns->{$f}}) {
				push(@{$alerts}, enc_($r->{message}));
				push(@{$m->{$f}}, "[!]" . enc_($r->{message}));
			}
			$warn = 1;
		}
	}

	push(@{$data}, {
		id   => "pageTitle",
		type => "normal",
		html => enc_($title)
	}, {
		id   => "DA_mail_edit_to_text_Id",
		type => "normal",
		attr => {
			value => $address_text->{to}
		}
	}, {
		id   => "DA_mail_edit_cc_text_Id",
		type => "normal",
		attr => {
			value => $address_text->{cc}
		}
	}, {
		id   => "DA_mail_edit_bcc_text_Id",
		type => "normal",
		attr => {
			value => $address_text->{bcc}
		}
	}, {
		id   => "DA_mail_edit_subject_textarea_Id",
		type => "normal",
		attr => {
			value => $subject
		}
	}, {
		id   => "DA_mail_edit_attachment_Id",
		type => "normal",
		html => $attach
	}, {
		id   => "DA_mail_edit_attachment_fieldset_Id",
		type => "normal",
		attr => {
			style => ($attach) ? "display:;" : "display:none"
		}
	}, {
		id   => "DA_mail_edit_body_textarea_Id",
		type => "normal",
		attr => {
			value => $body
		}
	}, {
		id   => "DA_mail_edit_other_Id",
		type => "normal",
		html => "<label>" . t_("その他") . "</label>"
	}, {
		id   => "DA_mail_edit_fieldset1_message_Id",
		type => "normal",
		html => ($m->{fieldset1}) ? join("<br>", @{$m->{fieldset1}}) : ""
	}, {
		id   => "DA_mail_edit_fieldset2_message_Id",
		type => "normal",
		html => ($m->{fieldset2}) ? join("<br>", @{$m->{fieldset2}}) : ""
	}, {
		id   => "DA_mail_edit_fieldset3_message_Id",
		type => "normal",
		html => ($m->{fieldset3}) ? join("<br>", @{$m->{fieldset3}}) : ""
	}, {
		id   => "DA_mail_edit_fieldset4_message_Id",
		type => "normal",
		html => ($m->{fieldset4}) ? join("<br>", @{$m->{fieldset4}}) : ""
	}, {
		type => "javascript",
		js   =><<end_js
DA.param.mail.maid = '@{[js_esc_($maid)]}';
DA.Select.InitSelectItem('address', 'DA_mail_edit_address_to_Id','DA_mail_edit_address_to_hidden_Id', @{[DA::SmartPhone::obj2json($address->{to})]}, {
	onSelected: function() {
		DA.mail.switchAddressArea("to");
	},
	onDeleted: function() {
		DA.mail.switchAddressArea("to");
	}
});
DA.Select.InitSelectItem('address', 'DA_mail_edit_address_cc_Id','DA_mail_edit_address_cc_hidden_Id', @{[DA::SmartPhone::obj2json($address->{cc})]}, {
	onSelected: function() {
		DA.mail.switchAddressArea("cc");
	},
	onDeleted: function() {
		DA.mail.switchAddressArea("cc");
	}
});
DA.Select.InitSelectItem('address', 'DA_mail_edit_address_bcc_Id','DA_mail_edit_address_bcc_hidden_Id', @{[DA::SmartPhone::obj2json($address->{bcc})]}, {
	onSelected: function() {
		DA.mail.switchAddressArea("bcc");
	},
	onDeleted: function() {
		DA.mail.switchAddressArea("bcc");
	}
});
DA.mail.switchAddressArea();
DA.mail.switchTextArea();
DA.mail.setElValue("nopreview", '@{[(!$error && $warn) ? 1 : 0]}');
end_js
	});

	if (scalar(@{$alerts})) {
		push(@{$data}, {
			type => "javascript.withoutcache",
			js   =><<end_js

(function() {

var _alertArray = @{[&obj2json($alerts) || "[]"]};
DA.message.error(_alertArray.join("\\n"));

})();
end_js
		});
	}
	# ###############################
	# custom
	# ###############################
	DA::Custom::rewrite_sp_mail_data($session,$c, $proc,$result,$imaps,$data);

	return($data);
}

sub _split_address_data4edit($$) {
	my ($session, $mail) = @_;
	my $address = {};
	my $address_text = {};
	my $times = 0;

	foreach my $f (qw(to cc bcc)) {
		$address->{$f} = [];

		foreach my $a (@{$mail->{$f}}) {
			my $mail  = $a->{email};
			if(!$mail){$mail=''};
			my $id;
			if (DA::SmartPhone::isSmartPhoneUsed()){
				$id    = ($a->{id} eq "") ? "_email_addr_$times" : $a->{id};
			}else{
				$id    = ($a->{id} eq "") ? $mail : $a->{id};
			}
			my $name  = ($a->{name} eq "") ? $mail : dec_($a->{name});
			my $stype = $a->{stype} || "O";
			my $icon  = DA::SmartPhone::ug_tag4class($session, $name, $stype, undef, undef, "item_select");

			push(@{$address->{$f}}, {
				id   => $id,
				name => $name,
				icon => $icon,
				mail => $mail,
				type => $stype
			});
			$times ++;
		}
		if ($mail->{$f . "_text"}) {
			foreach my $a (split(/\,/, $mail->{$f . "_text"})) {
				my $mail = $a;
				my $id = (DA::SmartPhone::isSmartPhoneUsed()) ? "_email_addr_$times" : $mail;
				my $type = DA::SmartPhone::type_user_other();
				my $icon = DA::SmartPhone::ug_tag4class($session, $mail, $type, undef, undef, "item_select");
				push(@{$address->{$f}}, {
					id   => $id,
					name => $mail,
					icon => $icon,
					mail => $mail,
					type => $type
				});
			$times ++;
			}
		}
	}

	return($address, $address_text);
}

sub _modal2data4edit($$$) {
	my ($session, $imaps, $modal) = @_;
	my $lang = DA::Ajax::Mailer::get_user_lang($session, $imaps);
	my $data = {};

	foreach my $f (qw(to cc bcc)) {
		$data->{$f} = [];

		foreach my $a (@{$modal->{$f}}) {
			my $type;
			my $id = $a->{id};
			if ($a->{type} eq DA::SmartPhone::type_user_other()) {
				$type = "";
			} elsif ($a->{type} eq DA::SmartPhone::type_address()) {
				$type = 0;
			} elsif (DA::SmartPhone::is_user($session, $a->{type})) {
				$type = 1;
			} elsif (DA::SmartPhone::is_group($session, $a->{type})) {
				$type = 2;
				$id = DA::Ajax::Mailer::_make_gid($id, $lang);
			} elsif ($a->{type} eq DA::SmartPhone::type_bulk()) {
				$type = 3;
			} elsif ($a->{type} eq DA::SmartPhone::type_ml()) {
				$type = 4;
			}
			my $card = DA::Ajax::Mailer::get_card($session, $imaps, $id, $type, $a->{name}, $a->{mail});
			if ($card) {
				push(@{$data->{$f}}, $card);
			}
		}
	}

	return($data);
}

sub _get_query4edit($$$;$) {
	my ($session, $imaps, $c, $mail) = @_;
	my @input = qw (
		maid fid uid sid tid page to_text cc_text bcc_text
		subject body priority in_reply_to references
		charset group_name reply_use notification from content_type
	);
	my $data = ($mail) ? $mail : {};

	foreach my $key (@input) {
		if ($key eq "body") {
			$data->{body}->{text} = $c->{$key};
		} elsif ($key =~ /^(?:sid|charset|group_name|reply_use|notification|from|content_type)$/) {
			$data->{status}->{$key} = $c->{$key};
		} else {
			$data->{$key} = $c->{$key};
		}
	}

	my $modal = {
		"to" => DA::SmartPhone::json2obj($c->{to}) || [],
		"cc" => DA::SmartPhone::json2obj($c->{cc}) || [],
		"bcc" => DA::SmartPhone::json2obj($c->{bcc}) || []
	};
	my $address = &_modal2data4edit($session, $imaps, $modal);

	$data->{to} = $address->{to};
	$data->{cc} = $address->{cc};
	$data->{bcc} = $address->{bcc};

	return($data);
}

sub _query2data4edit($$$$) {
	my ($session, $imaps, $c, $mail) = @_;
	my @input = qw (
		sid tid to_text cc_text bcc_text subject body
		priority in_reply_to references
		charset group_name reply_use notification from content_type
	);
	my $data = {};

	foreach my $key (@input) {
		if ($key eq "body") {
			$data->{body}->{text} = $c->{$key};
		} elsif ($key eq "from") {
			$data->{from}->{select} = $c->{$key};
		} else {
			$data->{$key} = $c->{$key};
		}
	}

	my $modal = {
		"to" => DA::SmartPhone::json2obj($c->{to}) || [],
		"cc" => DA::SmartPhone::json2obj($c->{cc}) || [],
		"bcc" => DA::SmartPhone::json2obj($c->{bcc}) || []
	};
	my $address = &_modal2data4edit($session, $imaps, $modal);

	$data->{to_list} = $address->{to};
	$data->{cc_list} = $address->{cc};
	$data->{bcc_list} = $address->{bcc};

	$data->{attach_list} = [];
	foreach my $aid (sort {$a <=> $b} keys %{$mail->{attach}}) {
		my $a = {}; %{$a} = ref($mail->{attach}->{$aid}) eq 'HASH' ? %{$mail->{attach}->{$aid}} : ();
		push(@{$data->{attach_list}}, $a);
	}

	return($data);
}

sub _regist_addr4edit($$) {
	my ($session, $xml) = @_;
	my @regist;
	my $gnum;

	foreach my $f (qw(to cc bcc)) {
		foreach my $a (@{$xml->{$f . "_list"}}) {
			if ($a->{stype} ne "O" && $a->{stype}) {
				($a->{id}, $gnum) = split(/\-/, $a->{id});
				push(@regist, {
					r_type => $a->{stype},
					target => $a->{id}
				});
			}
		}
	}
	DA::SmartPhone::set_is_addr_regist($session, \@regist);
}

# 未使用
sub _get_json_mail4edit_delete_attach($$;$) {
	my ($session, $c, $p) = @_;
	my $maid = int($c->{maid});
	my $aid  = int($c->{aid});

	my $imaps = DA::Ajax::Mailer::connect($session, { "nosession" => 1 });
	if ($imaps->{error}) {
		DA::SmartPhone::errorpart($session, $imaps->{message});
	}

	my $result = DA::Ajax::Mailer::delete_file($session, $imaps, {
		"maid" => $maid,
		"aid"  => $aid
	});
	if ($result->{error}) {
		DA::SmartPhone::errorpart($session, $result->{message});
	}

	my $none = ($result->{count}) ? "" : "\:DA_mail_edit_attachment_fieldset_Id";

	DA::Ajax::Mailer::disconnect($session, $imaps);

	return("successa" . $none);
}

sub get_tmplcon_params_mail($$) {
	my ($session, $c) = @_;
	my $url = &get_cache_tmpl_url($session, {});
	my $params = {}; %{$params} = %{$c};

	return($url, $c);
}

sub get_jsoncon_params_mail($$) {
	my ($session, $c) = @_;
	my $url = &get_cache_json_url($session, {});
	my $params = {}; %{$params} = %{$c};

	return($url, $c);
}

sub get_default_params_mail($$) {
	my ($session, $c) = @_;
	my @q = qw (fid uid unseen toself flagged);
	my $p = {};

	foreach my $key (@q) {
		$p->{$key} = $c->{$key};
	}

	return($p);
}

sub get_parallel_urls_mail($$) {
	my ($session, $c) = @_;
	my $urls = [];

	return($urls);
}

sub _is_specific_fid($$$) {
	my ($session, $imaps, $fid) = @_;

	if ($fid =~ /^(root|portal|inbox|draft|sent|spam|trash|100000001)$/) {
		return(1);
	} else {
		return(0);
	}
}

sub _real_fid($$$$;$) {
	my ($session, $imaps, $folders, $fid, $opt) = @_;
	my $real_fid;
	if ($fid) {
		if ($fid eq "root") {
			$real_fid = DA::Ajax::Mailer::_root_fid($session, $imaps, $folders);
		} elsif ($fid eq "portal") {
			$real_fid = DA::Ajax::Mailer::_portal_fid($session, $imaps, $folders);
		} elsif ($fid eq "inbox" || $fid eq 100000001) {
			$real_fid = DA::Ajax::Mailer::_inbox_fid($session, $imaps, $folders);
		} elsif ($fid eq "draft") {
			$real_fid = DA::Ajax::Mailer::_draft_fid($session, $imaps, $folders);
		} elsif ($fid eq "sent") {
			$real_fid = DA::Ajax::Mailer::_sent_fid($session, $imaps, $folders);
		} elsif ($fid eq "spam") {
			$real_fid = DA::Ajax::Mailer::_spam_fid($session, $imaps, $folders);
		} elsif ($fid eq "trash") {
			$real_fid = DA::Ajax::Mailer::_trash_fid($session, $imaps, $folders);
		} else {
			$real_fid = int($fid);
		}
	} else {
		$real_fid = 0;
	}

	if (!$real_fid && !$opt) {
		$real_fid = DA::Ajax::Mailer::_inbox_fid($session, $imaps, $folders);
	}
	return($real_fid);
}

sub _virtual_fid($$$$;$) {
	my ($session, $imaps, $folders, $fid, $opt) = @_;
	my $virtual_fid;

	if ($fid) {
		if ($fid eq "root" || $fid eq DA::Ajax::Mailer::_root_fid($session, $imaps, $folders)) {
			$virtual_fid = "root";
		} elsif ($fid eq "portal" || $fid eq DA::Ajax::Mailer::_portal_fid($session, $imaps, $folders)) {
			$virtual_fid = "portal";
		} elsif ($fid eq "inbox" || $fid eq DA::Ajax::Mailer::_inbox_fid($session, $imaps, $folders)) {
			$virtual_fid = "inbox";
		} elsif ($fid eq "draft" || $fid eq DA::Ajax::Mailer::_draft_fid($session, $imaps, $folders)) {
			$virtual_fid = "draft";
		} elsif ($fid eq "sent" || $fid eq DA::Ajax::Mailer::_sent_fid($session, $imaps, $folders)) {
			$virtual_fid = "sent";
		} elsif ($fid eq "spam" || $fid eq DA::Ajax::Mailer::_spam_fid($session, $imaps, $folders)) {
			$virtual_fid = "spam";
		} elsif ($fid eq "trash" || $fid eq DA::Ajax::Mailer::_trash_fid($session, $imaps, $folders)) {
			$virtual_fid = "trash";
		} else {
			$virtual_fid = int($fid);
		}
	} else {
		$virtual_fid = 0;
	}

	if (!$virtual_fid && !$opt) {
		$virtual_fid = "inbox";
	}

	return($virtual_fid);
}

sub folder_class($$$$) {
	my ($session, $imaps, $folder, $type) = @_;
	my $class;

	if (DA::Ajax::Mailer::is_portal($session, $imaps, $type)) {
		$class = " DA_ico_mail_new_class";
	} elsif (DA::Ajax::Mailer::_is_inbox($session, $imaps, $folder)) {
		$class = " DA_ico_mail_folder_top_class";
	} elsif (DA::Ajax::Mailer::_is_draft($session, $imaps, $folder)) {
		$class = " DA_ico_mail_draft_class";
	} elsif (DA::Ajax::Mailer::_is_sent($session, $imaps, $folder)) {
		$class = " DA_ico_mail_sent_class";
	} elsif (DA::Ajax::Mailer::_is_trash($session, $imaps, $folder)) {
		$class = " DA_ico_mail_trashcan_class";
	} elsif (DA::Ajax::Mailer::_is_spam($session, $imaps, $folder)) {
		$class = " DA_ico_mail_spam_class";
	} else {
		$class = " DA_ico_mail_folder_class";
	}

	return($class);
}

sub folder_path($$$) {
	my ($session, $imaps, $str) = @_;
	my @n;

	foreach my $s (split(/\Q$imaps->{imap}->{separator}\E/, $str)) {
		push(@n, DA::Ajax::Mailer::_utf7_decode($session, $imaps, $s));
	}
	pop(@n);

	return(join(">", @n));
}

sub _anchor_list_div_id($$) {
	my ($session, $virtual) = @_;

	if ($virtual =~ /^\d+$/) {
		return("DA_mail_list_default_Id");
	} else {
		return("DA_mail_list_" . $virtual . "_Id");
	}
}

sub _anchor_list_id($$$$) {
	my ($session, $virtual, $uid, $srid) = @_;

	my $foot_id;
	if ($uid) {
		$foot_id .= "_$uid\_$srid";
	}

	# if ($virtual =~ /^\d+$/) {
	#	return("DA_mail_list_default" . $foot_id . "_Id");
	# } else {
		return("DA_mail_list_" . $virtual . $foot_id . "_Id");
	# }
}

sub _anchor_list_etc_id($$$) {
	my ($session, $virtual, $opt) = @_;

	if ($virtual =~ /^\d+$/) {
		return("DA_mail_list_default_" . $opt . "_Id");
	} else {
		return("DA_mail_list_" . $virtual . "_" . $opt . "_Id");
	}
}

sub _get_vfilter($$) {
	my ($session, $c) = @_;

	my $vfilter = { # 表示フィルタの仕組みを利用して絞込み
		common => {
			default => 1000000
		},
		1000000 => {
			seen    => ($c->{unseen} ne "true") ? 0 : 1,
			toself  => ($c->{toself} eq "true") ? 1 : 0,
			flagged => ($c->{flagged} eq "true") ? 2 : 0
		}
	};

	return($vfilter);
}

sub _update_folders {
	my ($session, $folders) = @_;
	my @folders;

	foreach my $fid (
		sort { $folders->{$a}->{sort_root} <=> $folders->{$b}->{sort_root}
		    || $folders->{$a}->{sort_level} <=> $folders->{$b}->{sort_level}
		    || $folders->{$a}->{sort_name} cmp $folders->{$b}->{sort_name} } keys %{$folders} ) {
		 push(@folders, $folders->{$fid});
	}

	unless (DA::Ajax::Mailer::storable_store($session, $folders, "folders")) {
		DA::Ajax::Mailer::_warn($session, "storable_store");
	}
}

sub _update_folders_counts {
	my ($session, $folders, $real_fid, $res) = @_;

	if ($res->{total}) {
		$folders->{$real_fid}->{unseen}   = $res->{total}->{unseen};
		$folders->{$real_fid}->{recent}   = $res->{total}->{recent};
		$folders->{$real_fid}->{messages} = $res->{total}->{messages};

		if ($res->{counts}) {
			foreach my $v (@{$res->{counts}}) {
				$folders->{$v->{fid}}->{unseen}   = $v->{unseen};
				$folders->{$v->{fid}}->{recent}   = $v->{recent};
				$folders->{$v->{fid}}->{messages} = $v->{messages};
			}
		}

		return(1);
	} else {
		return(0);
	}
}

1;
