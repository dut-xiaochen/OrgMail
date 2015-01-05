package DA::Portal;
###################################################
##  INSUITE(R)Enterprise Version 1.5.0.          ##
##  Copyright(C)2003 DreamArts Corporation.      ##
##  All rights to INSUITE routines reserved.     ##
###################################################
BEGIN {
	use DA::Mail();
	use DA::Task();
	use DA::Ajax();
	use DA::Ajax::Mailer();
	use DA::RSS::HTML::Portlet(); # Added by Faiz <faiz_kazi@dreamarts.co.jp>
	use DA::Custom();
	use DA::System();
	use DA::Valid();
	use DA::Gettext;
    use HTTP::Request::Common();
    use LWP::UserAgent();
    use LWP::Parallel::UserAgent;
    use HTTP::Cookies;
    use Crypt::CBC;
}
use strict;

sub insert_div_tag {
	my ($html, $id, $nodiv) = @_;
	if ($nodiv) {
		return($html);
	} else {
		return("<div id=$id>" . $html . "</div>");
	}
}

sub insert_refresh_js {
	my ($port, $num, $refresh_time) = @_;

	if ($port->{auto_refresh} ne "off" && $port->{close}->{$num} ne "close" && $refresh_time) {
		return("<script>DAportletRefresher.add('$num', $refresh_time,'__INFO_PLACE__');</script>");
	} else {
		return("");
	}
}

sub cover_frame {
	my ($session, $port, $tmpl, $cover, $num, $date, $str, $filter) = @_;

	# 標準フレームＯＮの場合のみ
	if ($filter->{frame} ne 'on') { return ($str); }
	my $button = DA::Portal::get_close_button(
		$session,
		$date,
		$port,
		"ex_$num",
		$filter->{cache_on}
	);
	$tmpl->param(
		IMG_RDIR  => $session->{img_rdir},
		TITLE_TEXT=> $cover,
		BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
		CONTENTS  => $str
	);

	$str = $tmpl->output;

	return ($str);
}

sub parallel_useragent {
	my ($session, $date, $port, $tmpl, $resv, $data, $nodiv) = @_;
	my $proxy = $data->{proxy};
	my $timeout = $data->{timeout};
	my $reqs = $data->{reqs};
	my $urls = $data->{urls};
	my $cookie = $data->{cookies};
	my $cover = $data->{covers};
	my $expr = $data->{exparams};
	my $fils = $data->{filters};
	my %buffer;

	my $pua = LWP::Parallel::UserAgent->new();

	push(@{$pua->requests_redirectable}, 'POST');

	$ENV{HTTPS_PROXY} = '';
	$ENV{HTTPS_PROXY_USERNAME} = '';
	$ENV{HTTPS_PROXY_PASSWORD} = '';
	my ($server, $protocol, $agent) = split(/\|/, $proxy, 3);

	if ($server ne 'NONE') {
		if ($protocol eq 'https') {
			DA::Portal::set_ssl_proxy($server);
		} else {
			$pua->proxy('http' => $server);
		}
	}

	# 仮想ブラウザのAGETNTを適用する
	# $pua->agent($ENV{'HTTP_USER_AGENT'});
	$agent = $ENV{'HTTP_USER_AGENT'} if (!$agent);
	$pua->agent($agent);

	$pua->in_order(1);      # handle requests in order of registration
	$pua->duplicates(0);    # ignore duplicates
	$pua->timeout($timeout);
	$pua->redirect(1);      # follow redirects
	$pua->max_hosts(50);
	$pua->max_req(50);
	foreach my $num (keys %{$reqs}) {
		if ($num !~ /^\d+$/) { next; }
		my $res = $pua->register($reqs->{$num});
	}
	my $entries = $pua->wait();
	foreach my $key (keys %{$entries}) {
		my $num;
		# リダイレクトされた場合の処理
		if ($entries->{$key}->{response}->previous) {
			if ($entries->{$key}->{response}->previous->is_redirect) {
				my $r = $entries->{$key}->{response};
				while ($r) {
					$num = $r->request->{num};
					$r = $r->previous;
				}
				$urls->{$num} = $entries->{$key}->{response}->base;
			}
		} else {
			$num = $entries->{$key}->{response}->{_request}->{num};
		}

		if (!$num) { next; }

		if ($entries->{$key}->{response}->is_error) {
			$buffer{"ex_$num"} = "<center><font color=red>"
			                   . t_("ポートレットエラー") . "<br>"
			                   . t_("エラーコード") . ": <br>"
			                   . $entries->{$key}->{response}->{_rc} . "<br>["
			                   . DA::Charset::convert_to(
			                         \$entries->{$key}->{response}->{_msg},
			                         DA::Unicode::internal_charset()
			                     )
			                   . "]</font></center>";
			$buffer{"ex_$num"} = &insert_div_tag(DA::Portal::cover_frame(
				$session,
				$port,
				$tmpl,
				$cover->{$num},
				$num,
				$date,
				$buffer{"ex_$num"},
				$fils->{$num}
			), "__REFRESH_DIV__", $nodiv);
			if (-f "$session->{temp_dir}/ex_$num\.$session->{sid}") {
				DA::System::file_unlink("$session->{temp_dir}/ex_$num\.$session->{sid}");
			}
			next;
		}
		$buffer{"ex_$num"} = $entries->{$key}->{response}->{_content};
		if ($fils->{$num}->{cache_embed}) {
			$buffer{"ex_$num"} = DA::Portal::filter_run(
				$session,
				$fils->{$num},
				$buffer{"ex_$num"},
				$num,
				$urls->{$num},
				'',
				$resv
			);
		} else {
			$buffer{"ex_$num"} = DA::Charset::convert_to(
				\$buffer{"ex_$num"},
				DA::Unicode::internal_charset()
			);
		}
		$buffer{"ex_$num"} = DA::Portal::put_header(
			$session,
			$buffer{"ex_$num"},
			$num,
			$resv
		);

		if ($cookie->{$num}->{tag}) {
			$buffer{"ex_$num"} .= "<!-- Cookie Agent No.$num -->";
			$buffer{"ex_$num"} .= $cookie->{$num}->{tag};
		}

		my $cache_file = "ex_$num\.$session->{sid}";
		DA::System::file_open(\*OUT,"> $session->{temp_dir}/$cache_file");
		print OUT $buffer{"ex_$num"};
		close(OUT);

		$buffer{"ex_$num"} = &insert_div_tag(DA::Portal::cover_frame(
			$session,
			$port,
			$tmpl,
			$cover->{$num},
			$num,
			$date,
			$buffer{"ex_$num"},
			$fils->{$num}
		) . &insert_refresh_js(
			$port,
			$num,
			$expr->{$num}->{refresh_time}
		), "__REFRESH_DIV__", $nodiv);
	}

	return(\%buffer);
}

sub get_ex {
	my ($session, $date, $port, $tmpl, $query, $join, $join_clone, $reload, $resv, $hidden, $num, $nodiv, $headers4ex) = @_;
	my $close = $port->{close};
	my $buffer;

	my $pr = DA::Portal::get_external_param(
		$session,
		$num,
		$session->{user},
		'on',
		$resv
	);
	if ($hidden->{portal_window_name} eq 'off') {
		$pr->{win_name} = '';
	}

	# contents_portlet
	if ($pr->{device} ne 1 && $pr->{device} ne 5) {
		return(undef);
	}

	#============================
	#   ---- custom ----
	#============================
	my $through = 0;
	my $switch = DA::Custom::switch_disp_portlet($session, $num, $pr, \$through);

	if (!$switch) {  # 従来通り
		if ($pr->{device} ne '5' || !$pr->{open_g}) {
			if ($join->{$pr->{gid}}->{attr} !~ /^[12UW]$/) { $through = 1; }
		} else {
			$through=1;
			my @open_g = split(":", $pr->{open_g});
			foreach my $id ($pr->{gid}, @open_g) {
				if ($join->{$id}->{attr} =~ /^[12UW]$/) { $through = 0; last; }
			}
		}
	}
	if ($through) { return(undef); }

	# ポートレットの使用頻度を測定するために表示回数をカウント
	if ($hidden->{portal_count} ne 'off') {
		if ($pr->{num}) {
			if ($pr->{portal_count} eq 2) {
			} elsif ($pr->{portal_count} eq 1) {
				DA::Portal::update_view_count($session, $num);
			} elsif ($hidden->{portal_count_default} eq 'on') {
				DA::Portal::update_view_count($session,$num);
			}
		}
	}

	if ($pr->{device} eq 5) {
		my $link_port = {}; %{$link_port} = %{$port};
		$link_port->{portal_param_button} = 'off';
		$buffer = DA::Portal::get_link_portlet(
			$session,
			$pr,
			$date,
			$link_port,
			$tmpl,
			$query,
			$join
		);
		$buffer.=&insert_refresh_js($port,$num,$pr->{refresh_time});
		$buffer =&insert_div_tag($buffer,"__REFRESH_DIV__", $nodiv);
		return($buffer);
	}

	# 標準フレームのタイトルを設定
	my $cover;
	if ($pr->{style} eq 1) {
		my $href;
		if ($hidden->{portal_bar_setting} eq "on") {
			$href = "<a href=\"javascript:callView($num,"
			      . "$pr->{win_x},$pr->{win_y},"
			      . "$pr->{menubar},$pr->{toolbar},"
			      . "$pr->{locationbar},$pr->{statusbar},'$pr->{win_name}');\" "
			      . "style=\"text-decoration:none\">";
		} else {
			$href = "<a href=\"javascript:callView($num,"
			      . "$pr->{win_x},$pr->{win_y},1,1,1,1,'$pr->{win_name}');\" "
			      . "style=\"text-decoration:none\">";
		}
		$cover = "$href$pr->{title}</a>";
	} else {
		$cover = $pr->{title};
	}

	my $sso = DA::Portal::get_sso_param(
		$session,
		$pr->{sso_num},
		$session->{user},
		'on',
		$resv
	);

	my $url = $pr->{url};
	my $filter = DA::Portal::get_filter($num);
	$filter->{auth_user} = $sso->{basic_user};
	$filter->{auth_pass} = $sso->{basic_pass};
	$filter->{auth_url} = $pr->{url};
	$filter->{kanji_code} = $pr->{kanji_code};
	$filter->{cache_on} = $pr->{cache_on};
	$filter->{cache_embed} = $pr->{cache_embed};

	# getHander4ex で必要な情報をセット
	if (defined $headers4ex) {
		$headers4ex->{$num}->{style} = $pr->{style};
		$headers4ex->{$num}->{frame} = $filter->{frame};
	}

	# 初期状態のオープン／クローズ状態を反映させる
	if ($port->{portal_close_button} eq 'off') {
		$port->{close}->{"ex_$num"} = 'open';
		$close->{$num} = 'open';
	} elsif ($close->{$num} !~ /(close|open)/) {
		if ($filter->{close} eq 'on') {
			$port->{close}->{"ex_$num"} = 'close';
			$close->{$num} = 'close';
		}
	}

	if ($close->{$num} eq 'close' &&
		($pr->{style} ne 1 || $filter->{frame} eq 'on')) {
		my $button = DA::Portal::get_close_button(
			$session,
			$date,
			$port,
			"ex_$num",
			$pr->{cache_on}
		);
		$tmpl->param(
			IMG_RDIR   => $session->{img_rdir},
			TITLE_TEXT => $cover,
			BUTTON     => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
			CONTENTS   => ""
		);
		$buffer = $tmpl->output;
		$buffer =&insert_div_tag($buffer,"__REFRESH_DIV__", $nodiv);
		return($buffer);
	}

	my $cache_file = "ex_$num.$session->{sid}";
	my $frame_file = "$session->{user}/temp/if_$num.$session->{sid}.html";
	my $cookie_file = "cookie.$pr->{sso_num}.$session->{sid}";

	# キャッシュ有効期限チェック
	# ファイル更新日付と現在時刻を比較し必要があれば削除
	if ($pr->{cache_time}) {
		my $f_info = DA::CGIdef::get_f_info("$session->{temp_dir}/$cache_file");
		my $expire = int($f_info->{ctime}) + int($pr->{cache_time} * 10 * 60);
		my $now = DA::System::nfs_time();
		if ($expire < $now) {
			if (-f "$session->{temp_dir}/$cache_file") {
				DA::System::file_unlink("$session->{temp_dir}/$cache_file");
			}
			if (-f "$DA::Vars::p->{user_dir}/$frame_file") {
				DA::System::file_unlink("$DA::Vars::p->{user_dir}/$frame_file");
			}
		}
	}

	# リロードボタンがクリックされた場合はキャッシュを削除
	if ($reload) {
		if (-f "$session->{temp_dir}/$cache_file") {
			DA::System::file_unlink("$session->{temp_dir}/$cache_file");
		}
		if (-f "$DA::Vars::p->{user_dir}/$frame_file") {
			DA::System::file_unlink("$DA::Vars::p->{user_dir}/$frame_file");
		}
		if (-f "$session->{temp_dir}/$cookie_file") {
			DA::System::file_unlink("$session->{temp_dir}/$cookie_file");
		}
	}

	# リンク行形式
	if ($pr->{style} eq 1) {
		my $pr_clone = Storable::dclone($pr);

		if ($filter->{frame} eq 'on') {
			#===========================================
			#     Custom
			#===========================================
			DA::Custom::rewrite_link_portlet_title($session,$num,\$cover,$pr_clone,$join_clone,{});
			#===========================================

			my $file = "$DA::Vars::p->{data_dir}/external/$num/explain.dat";
			if (DA::Unicode::file_exist("$file")) {
				$buffer = DA::Unicode::file_read("$file");
				$buffer = DA::CGIdef::encode($buffer, 2, 1, 'euc');
				$buffer = DA::IS::conv_href($session, $buffer);
			}
			my $button = DA::Portal::get_close_button(
				$session,
				$date,
				$port,
				"ex_$num",
				$pr->{cache_on}
			);
			$tmpl->param(
				IMG_RDIR   => $session->{img_rdir},
				TITLE_TEXT => $cover,
				BUTTON     => $button,
				DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
				CONTENTS   => $buffer
			);
			$buffer = $tmpl->output;
		} else {
			my $icon = 'null.gif';
			if ($filter->{icon} && $filter->{icon} ne 'null.gif') {
				$icon = "parts/$filter->{icon}";
			}
			if ("ex_$num" =~ /^($port->{must})$/) {
				$icon .= " alt='__MUST_ALT__'";
			}

			my $href;
			if ($hidden->{portal_bar_setting} eq "on") {
				$href = "<a href=\"javascript:callView($num,"
				      . "$pr->{win_x},$pr->{win_y},"
				      . "$pr->{menubar},$pr->{toolbar},"
				      . "$pr->{locationbar},$pr->{statusbar},"
				      . "'$pr->{win_name}');\">";
			} else {
				$href = "<a href=\"javascript:callView($num,"
				      . "$pr->{win_x},$pr->{win_y},1,1,1,1,"
				      . "'$pr->{win_name}');\">";
			}

			my $title = "$href$pr->{title}</a>";

			#===========================================
			#     Custom
			#===========================================
			DA::Custom::rewrite_link_portlet_title($session,$num,\$title,$pr_clone,$join_clone,{});
			#===========================================

			$buffer = "<table border=0 cellspacing=0 "
			        . "cellpadding=0><tr><td><img src=$session->{img_rdir}/"
			        . "$icon border=0 width=16 height=16></td>"
			        . "<td>&nbsp;<b>"
			        . "$title</b></td>"
			        . "</tr></table><br>\n";
		}
		DA::System::file_open(\*OUT,"> $session->{temp_dir}/$cache_file");
		print OUT $buffer;
		close(OUT);

		$buffer.= &insert_refresh_js($port, $num, $pr->{refresh_time});
		$buffer = &insert_div_tag($buffer, "__REFRESH_DIV__", $nodiv);
		return($buffer);
	}

	# キャッシュＯＫの場合はキャッシュを読み込む
	if ($pr->{cache_on} eq 1 && -f "$session->{temp_dir}/$cache_file") {
		DA::System::file_open(\*IN,"$session->{temp_dir}/$cache_file");
		while (my $ex=<IN>) { $buffer .= $ex; }
		close(IN);
		if (!$buffer) { $buffer = ''; }
		$buffer = &cover_frame(
			$session,
			$port,
			$tmpl,
			$cover,
			$num,
			$date,
			$buffer,
			$filter
		);
		$buffer.=&insert_refresh_js($port,$num,$pr->{refresh_time});
		$buffer =&insert_div_tag($buffer,"__REFRESH_DIV__", $nodiv);
		return($buffer);
	}

	# インラインフレーム＋ブラウザログインの場合
	if ($pr->{frame} eq 1 && $pr->{sso_login} && $sso->{login_url}) {
		if (!DA::IS::is_iframe()) { return(undef); }
		my ($header, $footer) = DA::Portal::get_header($session, $num, $resv);

		# ログイン直後のページを表示する場合も含む
		$pr->{url} = "$DA::Vars::p->{cgi_rdir}/pop_call.cgi?num=$num";
		$pr->{url}.= "&win=call" if ($pr->{sso_view});

		$buffer = $header . "<IFRAME src=$pr->{url} id=\"__REFRESH_IFRAME__\" name=\"__REFRESH_DIV__\""
		        . "frameborder=0 framespacing=0 noresize width=100% "
		        . "height=$pr->{height} scrolling=auto></IFRAME>\n" . $footer;

		DA::Custom::override_portlet_iframe_buffer($session,$pr,$num,\$buffer);

		DA::System::file_open(\*OUT,"> $session->{temp_dir}/$cache_file");
		print OUT $buffer;
		close(OUT);

		$buffer = &cover_frame(
			$session,
			$port,
			$tmpl,
            $cover,
			$num,
			$date,
			$buffer,
			$filter
		);
		$buffer.=&insert_refresh_js($port,$num,$pr->{refresh_time});
		$buffer =&insert_div_tag($buffer,"__REFRESH_DIV__", $nodiv);
		return($buffer);
	}

	# Start of Simple Sign On
	my $cookie = {};
	if ($pr->{frame} eq 1 && $pr->{cache_frame} ne 1 &&
		(!$sso->{num} || !$pr->{sso_view})) {
		# インラインフレーム＆フレームキャッシュＯＦＦの場合はログインなし
		# ログイン処理の結果をそのまま表示するオプション以外
	} else {
		# 埋め込み表示またはフレームキャッシュＯＮ
		if ($sso->{num}) {
			# ログイン処理の結果をそのまま表示するオプション
			if ($pr->{sso_view}) {
				if (-f "$session->{temp_dir}/$cookie_file") {
					DA::System::file_unlink("$session->{temp_dir}/$cookie_file");
				}
				$sso->{sso_view}=($pr->{sso_view_filter}) ? $pr->{num} : 0;
				$sso->{frame}   =($pr->{frame}) ? $pr->{frame} : 0;
				($cookie->{ua}, $cookie->{jar},
				 $cookie->{val}, $cookie->{tag},
				 $cookie->{result})
					= DA::Portal::get_cookie_tag($session, $sso, $cookie_file);

				if ($pr->{frame} eq 1) {
					DA::System::file_open(\*OUT, ">$DA::Vars::p->{user_dir}/$frame_file");
					print OUT $cookie->{result};
					close(OUT);

					$cookie->{result} = "<IFRAME "
					                  . "src=$DA::Vars::p->{user_rdir}/$frame_file "
					                  . "id=\"__REFRESH_IFRAME__\" name=\"__REFRESH_DIV__\" frameborder=0 framespacing=0 noresize "
					                  . "width=100% height=$pr->{height} scrolling=auto>"
					                  . "</IFRAME>\n";
				}
				$buffer = DA::Portal::put_header(
					$session,
					$cookie->{result},
					$num,
					$resv
				);
				if ($cookie->{tag}) {
					$buffer .= "<!-- Cookie Agent No.$num -->";
					$buffer .= $cookie->{tag};
				}

				DA::System::file_open(\*OUT,"> $session->{temp_dir}/$cache_file");
				print OUT $buffer;
				close(OUT);

				$buffer = &cover_frame(
					$session,
					$port,
					$tmpl,
					$cover,
					$num,
					$date,
					$buffer,
					$filter
				);
				$buffer.=&insert_refresh_js($port,$num,$pr->{refresh_time});
				$buffer =&insert_div_tag($buffer,"__REFRESH_DIV__", $nodiv);
				return($buffer);
			} else {
				($cookie->{ua}, $cookie->{jar},
				 $cookie->{val}, $cookie->{tag},
				 $cookie->{result})
					= DA::Portal::get_cookie_tag($session, $sso);
			}
		}
	}
	# End of Simple Sign On

	# TARGET URL が設定されていない場合はヘッダフッタのみを付ける
	if ($pr->{url} eq '') {
		$buffer = DA::Portal::put_header(
			$session,
			$buffer,
			$num,
			$resv
		);
		if ($cookie->{tag}) {
			$buffer .= "<!-- Cookie Agent No.$num -->";
			$buffer .= $cookie->{tag};
		}

		DA::System::file_open(\*OUT,"> $session->{temp_dir}/$cache_file");
		print OUT $buffer;
		close(OUT);
		$buffer = &cover_frame(
			$session,
			$port,
			$tmpl,
            $cover,
			$num,
			$date,
			$buffer,
			$filter
		);
		$buffer.=&insert_refresh_js($port,$num,$pr->{refresh_time});
		$buffer =&insert_div_tag($buffer,"__REFRESH_DIV__", $nodiv);
		return($buffer); 
	}

	# インラインフレームを使用する場合の処理
	if ($pr->{frame} eq 1) {
		# フレーム埋め込み
		if (!DA::IS::is_iframe()) { return(undef); }
		if ($pr->{cache_frame} eq 1) {
			# フレームキャッシュあり
			if (!$cookie->{ua}) {
				# ログイン処理がない場合は Agent を作成
				($cookie->{ua}, $cookie->{jar}) = DA::Portal::make_ua($session, $pr);
			}
			my $req = DA::Portal::make_req($session, $pr, $sso);
			my $res = $cookie->{ua}->request($req);
			my $frame_buffer;
			if ($res->is_error) {
				$frame_buffer = "<html><body bgcolor=#FFFFFF><center>"
				              . "<font color=red>".t_("ポートレットエラー")."<br>"
				              . t_("エラーコード").": ".$res->code . "<br>["
				              . DA::Charset::convert_to(\$res->message, DA::Unicode::internal_charset())
				              . "]</font></center></body></html>";
				$frame_buffer = DA::Unicode::convert_to_html($frame_buffer);
			} else {
				# リダイレクトされた場合の処理
				if ($res->previous) { $url = $res->base; }
				$frame_buffer = DA::Portal::filter_run(
					$session,
					$filter,
					$res->content,
					$num,
					$url,
					'frame',
					$resv
				);
			}
			DA::System::file_open(\*OUT,">$DA::Vars::p->{user_dir}/$frame_file");
			print OUT $frame_buffer;
			close(OUT);

			$pr->{url} = "$DA::Vars::p->{user_rdir}/$frame_file";
		} elsif ($pr->{method} eq 'post') {
			# POST の場合は get_wait_html を呼び出して自動クリック作戦
			my ($frame_buffer, $charset) = DA::Portal::get_wait_html($session, $pr, $sso);
			$frame_buffer = DA::Unicode::convert_to_html($frame_buffer, $charset);
			DA::System::file_open(\*OUT,">$DA::Vars::p->{user_dir}/$frame_file");
			print OUT $frame_buffer;
			close(OUT);

			$pr->{url} = "$DA::Vars::p->{user_rdir}/$frame_file";
		} else {
			# フレームキャッシュなしの GET メソッド
			$pr->{url} = DA::Portal::get_req_param($session, $pr, $sso);
		}
		my ($header, $footer) = DA::Portal::get_header($session, $num, $resv);
		if ($cookie->{tag}) {
			$footer .= "<!-- Cookie Agent No.$num -->";
			$footer .= $cookie->{tag};
		}
		$buffer = $header . "<IFRAME src=$pr->{url} id=\"__REFRESH_IFRAME__\" name=\"__REFRESH_DIV__\" "
		        . "frameborder=0 framespacing=0 noresize width=100% "
		        . "height=$pr->{height} scrolling=auto></IFRAME>\n" . $footer;

		DA::Custom::override_portlet_iframe_buffer($session,$pr,$num,\$buffer);

		DA::System::file_open(\*OUT,"> $session->{temp_dir}/$cache_file");
		print OUT $buffer;
		close(OUT);

		$buffer = &cover_frame(
			$session,
			$port,
			$tmpl,
			$cover,
			$num,
			$date,
			$buffer,
			$filter
		);
		$buffer.=&insert_refresh_js($port,$num,$pr->{refresh_time});
		$buffer =&insert_div_tag($buffer,"__REFRESH_DIV__", $nodiv);
		return($buffer);
	}

	# パラレル処理の準備
	my $req = DA::Portal::make_req(
		$session,
		$pr,
		$sso,
		$cookie->{jar},
		{},
		$query
	);
	my $proxy = DA::IS::get_proxy($session, $pr->{url});
	if (!$proxy) { $proxy = 'NONE'; }

	# SSL と non-SSL Proxy サーバが同じである場合、ターゲットURLの
	# プロトコルによって 別の Agent を作成する必要があるため
	my ($protocol, $url_tmp) = DA::CGIdef::split_url($pr->{url});
	$proxy .= "|$protocol";
	$proxy .= "|$pr->{agent}";

	my $timeout = $pr->{timeout};

	return($buffer, $url, $cookie, $cover, $pr, $filter, $proxy, $req, $timeout);
}

sub get_notice {
	my ($session,$date,$port,$tmpl,$join,$reload,$bosses,$nodiv)=@_;
	# ポップアップを選択した場合は、ログイン時と情報更新時にのみＤＢを確認する。
	# トップページに表示する場合は、トップページが表示される都度ＤＢを確認する。

	my $ntcdat = DA::IS::get_sys_custom($session,"notice");
	my $port_conf=DA::IS::get_sys_custom($session,'portal');
	my $mouse_style = ($port_conf->{drag_drop} eq 'on' && $session->{drag_drop_mode} eq 'on') 
			? "<tr style=\"cursor:no-drop\">" : "<tr>";
	my $boss_join={};
	if (!$bosses || ref($bosses) ne 'HASH') {
		$bosses = DA::IS::get_bosses($session);
	}
	foreach my $boss (keys %$bosses) {
		$boss_join->{$boss}=DA::IS::get_join_group($session,$boss,1);
	}

	my ($notice_top,$notice_pop,$t_count,$p_count);

	my $today=DA::CGIdef::get_date2($session,"Y4/MM/DD-HH:00");
	$date =substr($today,0,10);
	my $time =substr($today,11);
	my $sql="SELECT * FROM is_notice "
	       ."WHERE substr(start_date,1,10) <= ? AND "
	       ."(substr(close_date,1,10) >= ? OR "
	       ." substr(close_date,1,10) = '0000/00/00')"
	       ."ORDER BY p_level,start_date";
	my $sth=$session->{dbh}->prepare($sql);
	   $sth->bind_param(1,$date,1);
	   $sth->bind_param(2,$date,1);
	   $sth->execute();
	while (my $row=$sth->fetchrow_hashref('NAME_lc')) {
		#  通達タイプの判定: メッセージタイプの場合はスキップ
		if($row->{ntc_type}==2){ next; }

		if ($row->{start_date} &&
			substr($row->{start_date},11,5) eq ''){
			$row->{start_date}.="-00:00";
		}
		if ($row->{close_date} &&
			substr($row->{close_date},11,5) eq ''){
			$row->{close_date}=DA::CGIdef::get_target_date(
			$row->{close_date},1,'Y4/MM/DD-00:00');
		}
		if ($row->{start_date} gt $today){ next; }
		if ((substr($row->{close_date},0,4) ne  '0000') || substr($row->{close_date},5,2) ne '00' || substr($row->{close_date},8,2) ne '00'){
			if ($row->{close_date} le $today){ next; }
		}

		my $permit;
		my $join_data = {};
		%$join_data=%$join;
		if ($row->{target} eq 1) {      # プライマリのみ
			if ($join_data->{$row->{gid}}->{attr} =~ /^[1]$/) { $permit=1; }
		} elsif ($row->{target} eq 2) { # プライマリ＋セカンダリ
			if ($join_data->{$row->{gid}}->{attr} =~ /^[12]$/) { $permit=1; }
		} elsif ($row->{target} eq 3) { # 下位組織に所属するユーザ
			if ($join_data->{$row->{gid}}->{attr} =~ /^[12UW]$/) { $permit=1; }
		}
		# 秘書対応
		if ($row->{boss}) {
			foreach my $boss (keys %$boss_join) {
				if ($permit) { next; }
				my $b_join=$boss_join->{$boss};
				if ($row->{target} eq 1) {      # プライマリのみ
					if ($b_join->{$row->{gid}}->{attr} =~ /^[1]$/) { $permit=1; }
				} elsif ($row->{target} eq 2) { # プライマリ＋セカンダリ
					if ($b_join->{$row->{gid}}->{attr} =~ /^[12]$/) { $permit=1; }
				} elsif ($row->{target} eq 3) { # 下位組織に所属するユーザ
					if ($b_join->{$row->{gid}}->{attr} =~ /^[12UW]$/) { $permit=1; }
				}
			}
		}
		if (!$permit) { next; }

		my $class_word = "<!-- class -->"; $row->{class} = $class_word;
		my $line = DA::Notice::get_notice_line($session,$row,$ntcdat,$join);
		my $replace =  sub {
			my ($html, $class) = @_;
			$html =~ s/\Q$class_word\E/$class/g;
        	return($html);
		};

		if ($row->{popup} eq 1) {
			if ($row->{popup_read} eq 1) {
				my $read_date=DA::Notice::get_read_date($session,$row->{num});
				if ($read_date eq '') {
					$notice_pop.=$replace->($line, ($p_count % 2) ? 'even' : 'odd');
					$p_count++;
				}
			} else {
				$notice_pop.=$replace->($line, ($p_count % 2) ? 'even' : 'odd');
				$p_count++;
			}
		}
		$notice_top.=$replace->($line, ($t_count % 2) ? 'even' : 'odd');
		$t_count++;
	}
	$sth->finish;

	my ($notice_menu,$script);
	if ($reload && $notice_pop) {
		DA::System::file_open(\*OUT,"> $session->{temp_dir}/notice\.$session->{user}");
		print OUT $notice_pop;
		close(OUT);
		my $height=($p_count*22)+20+25;
		$script="nlist=window.open('$DA::Vars::p->{cgi_rdir}/pop_up_notice.cgi',"
		       ."'nlist','width=740,height=$height,resizable=1');\n";
	}
	if ($notice_top) {
		my $close_button;
		if ($port->{notice_close_button} ne 'off') {
			$close_button=DA::Portal::get_close_button($session,$date,$port,'notice');
    		$close_button=~s/__INFO_PLACE__/top/g;
		}
		my $list_button;
		if ($ntcdat->{notice_list_button} eq 'on') {
			if($session->{menu_style} eq "preset" && $session->{portlet_style} eq "preset"){
                $list_button=&get_button4preset($session,
                	"javascript:Pop('pop_notice_list.cgi','pop_title_popannounce.gif',700,500);",t_("一覧"));
			} else{
				$list_button="<a href=\"javascript:Pop('pop_notice_list.cgi','pop_title_popannounce.gif',700,500);\">"
			            ."<img src=$session->{img_rdir}/aqbtn_all.gif border=0 width=30 height=15 align=top hspace=2></a>";
			}
		}

		my $reload_timer = DA::Custom::set_reload_timer($session);
		$notice_menu.="<table width=100% border=0 cellspacing=0 cellpadding=0>$mouse_style"
		            . "<td rowspan=2 width=9 height=17 background=$session->{img_rdir}/"
		            . "tbar_red_bg.gif><img src=$session->{img_rdir}/null.gif width=9 height=17>"
		            . "</td><td width=100%><img src=$session->{img_rdir}/tbar_title_announce.gif"
		            . " width=78 height=17></td>"
		            . $reload_timer
		            . "<td nowrap align=right valign=bottom>"
		            . t_("通達件数")." : $t_count @{[t_('件')]}</td><td nowrap align=right "
		            . "valign=bottom>$list_button $close_button</td></tr><tr><td colspan=3 bgcolor=#CCCCCC>"
		            . "<img src=$session->{img_rdir}/null.gif width=1 height=1></td></tr>\n";

		if ($port->{close}->{notice} eq 'close') {
			$notice_menu.="</TABLE><BR>";
		} else {
			$notice_menu.="<tr><td background=$session->{img_rdir}/"
			            . "tbar_gray_bg.gif><img src=$session->{img_rdir}/null.gif width=1 "
			            . "height=1></td><td colspan=3><TABLE border=0 cellspacing=0 "
			            . "cellpadding=1 width=100%>$notice_top</TABLE></td></tr></table><br>";
		}

		if ($session->{portlet_style} eq "aqua" || $session->{portlet_style} eq "preset") {
			my $contents = "<table class='list-portlet list-importance'>$notice_top</table>";
			if ($port->{close}->{notice} eq 'close') {
				$contents = undef;
			}
			my $text = t_("通達件数")." : $t_count @{[t_('件')]}" ;
			   $text = "<td class=\"text\">$text</td>" if ($session->{portlet_style} eq "preset");
			$tmpl->param(
				IMG_RDIR  => $session->{img_rdir},
				TITLE_TEXT => t_("通達事項"),
				TITLE_GIF => "tbar_title_announce.gif",
				CUSTOM_BUTTON => $reload_timer,
				BUTTON    => "$text$list_button$close_button",
				DD_HEADER => $mouse_style,
				CONTENTS  => $contents
			);
			$notice_menu = $tmpl->output;
		}

		$notice_menu = &insert_div_tag($notice_menu, "notice_top_refreshDiv", $nodiv);
	}

	#===========================================
	#     Custom
	#===========================================
	$notice_menu.=DA::Custom::set_auto_popup($session,$reload,$notice_pop,$notice_top,$p_count);

	return ($notice_menu,$script);
}

sub get_notice_msg {
	my ($session,$date,$port,$tmpl,$join,$reload,$bosses,$hidden,$nodiv)=@_;

	# ポップアップを選択した場合は、ログイン時と情報更新時にのみＤＢを確認する。
	# トップページに表示する場合は、トップページが表示される都度ＤＢを確認する。

	my $ntcdat = DA::IS::get_sys_custom($session,"notice");
	my $port_conf=DA::IS::get_sys_custom($session,'portal');
 	my $mouse_style = ($port_conf->{drag_drop} eq 'on' && $session->{drag_drop_mode} eq 'on') 
			? "<tr style=\"cursor:no-drop\">" : "<tr>";

	my $boss_join={};
	if (!$bosses || ref($bosses) ne 'HASH') {
		$bosses = DA::IS::get_bosses($session);
	}
	foreach my $boss (keys %$bosses) {
		$boss_join->{$boss}=DA::IS::get_join_group($session,$boss,1);
	}

	my $notice_part_data;   #メッセージタイプ表示データ
	my ($notice_top,$notice_msg_pop,$t_count,$p_count);
	my $today=DA::CGIdef::get_date2($session,"Y4/MM/DD-HH:00");
	$date =substr($today,0,10);
	my $time =substr($today,11);
	my $sql="SELECT * FROM is_notice "
	       ."WHERE substr(start_date,1,10) <= ? AND "
	       ."(substr(close_date,1,10) >= ? OR "
	       ." substr(close_date,1,10) = '0000/00/00')"
	       ."ORDER BY p_level,start_date";
	my $sth=$session->{dbh}->prepare($sql);
	   $sth->bind_param(1,$date,1);
	   $sth->bind_param(2,$date,1);
	   $sth->execute();
	while (my $row=$sth->fetchrow_hashref('NAME_lc')) {
		#  通達タイプの判定: 通常タイプの場合はスキップ
		if($row->{ntc_type}!=2 || $ntcdat->{notice_type} ne 'on'){ next; }

		if ($row->{start_date} &&
			substr($row->{start_date},11,5) eq ''){
			$row->{start_date}.="-00:00";
		}
		if ($row->{close_date} &&
			substr($row->{close_date},11,5) eq ''){
			$row->{close_date}=DA::CGIdef::get_target_date(
			$row->{close_date},1,'Y4/MM/DD-00:00');
		}
		if ($row->{start_date} gt $today){ next; }
		if ((substr($row->{close_date},0,4) ne  '0000') || substr($row->{close_date},5,2) ne '00' || substr($row->{close_date},8,2) ne '00'){
			if ($row->{close_date} le $today){ next; }
		}

		my $permit;
		my $join_data = {};
		%$join_data=%$join;

		# 表示ポータルがオーナーポータルのみの場合
		# spaceが一致するポータルにしか表示させない
		if (($row->{out_portal} eq 2)&&($row->{gid} ne $session->{space})){
			# ただし表示ポータルの設定がOFFに変更された場合を考慮して
			# notice.datの設定値がOFFならば、全ポータルに表示する
			if($ntcdat->{notice_msgtype_portal} eq 'on'){ next; }
		}
		#### 対象ユーザの表示
		#    対象ユーザが「下位組織に所属するユーザ」以外に設定されていても
		#    notice.datの対象ユーザ選択表示がOFFに変更されていた場合を考慮して
		#    設定値がOFFになっている場合は、
		#    対象ユーザの値を「下位組織に所属するユーザ」として扱う
		if($row->{target} ne '3' && $ntcdat->{notice_msgtype_usrslct} eq 'off'){
			$row->{target}='3'
		}
		if ($row->{target} eq 1) {      # プライマリのみ
			if ($join_data->{$row->{gid}}->{attr} =~ /^[1]$/) { $permit=1; }
		} elsif ($row->{target} eq 2) { # プライマリ＋セカンダリ
			if ($join_data->{$row->{gid}}->{attr} =~ /^[12]$/) { $permit=1; }
		} elsif ($row->{target} eq 3) { # 下位組織に所属するユーザ
			if ($join_data->{$row->{gid}}->{attr} =~ /^[12UW]$/) { $permit=1; }
		}
		# 秘書対応
		if ($row->{boss}) {
			foreach my $boss (keys %$boss_join) {
				if ($permit) { next; }
				my $b_join=$boss_join->{$boss};
				if ($row->{target} eq 1) {      # プライマリのみ
					if ($b_join->{$row->{gid}}->{attr} =~ /^[1]$/) { $permit=1; }
				} elsif ($row->{target} eq 2) { # プライマリ＋セカンダリ
					if ($b_join->{$row->{gid}}->{attr} =~ /^[12]$/) { $permit=1; }
				} elsif ($row->{target} eq 3) { # 下位組織に所属するユーザ
					if ($b_join->{$row->{gid}}->{attr} =~ /^[12UW]$/) { $permit=1; }
				}
			}
		}
		if (!$permit) { next; }

		$row->{read_date}=DA::Notice::get_read_date($session,$row->{num});
		if ($row->{popup} eq 1) {
			if ($row->{popup_read} eq 1) {
				if ($row->{read_date} eq '') {
					$row->{class}=($p_count % 2) ? 'even' : 'odd';
					$notice_msg_pop.=DA::Notice::get_notice_msg_line($session,$row,$ntcdat,$join);
					$p_count++;
				}
			} else {
				$row->{class}=($p_count % 2) ? 'even' : 'odd';
				$notice_msg_pop.=DA::Notice::get_notice_msg_line($session,$row,$ntcdat,$join);
				$p_count++;
			}
		}
		$row->{class}=($t_count % 2) ? 'even' : 'odd';
		$notice_part_data.=DA::Notice::get_notice_msg_line($session,$row,$ntcdat,$join);
		$t_count++;
	}
	$sth->finish;

	## 表示データ部の作成
	if($t_count){
		$notice_top ="<table class=\"list-portlet message-list list-importance\"><tbody>";
		$notice_top.=$notice_part_data;
		$notice_top.="</tbody></table>";
	}

	my ($notice_msg_menu,$script);
	if ($reload && $notice_msg_pop) {
		if(DA::System::file_open(\*OUT,"> $session->{temp_dir}/notice_ntc\.$session->{user}")){
			print OUT $notice_msg_pop;
			if(close(OUT)){
			}else{
				warn("cannot close $session->{temp_dir}/notice_ntc\.$session->{user}");
			}
		}else{
			warn("cannot open $session->{temp_dir}/notice_ntc\.$session->{user}");
		}
		my $height=($p_count*130)+20+25;
		$script="ntc_list=window.open('$DA::Vars::p->{cgi_rdir}/pop_up_notice.cgi?ntc_type=2',"
		       ."'ntc_list','width=740,height=$height,resizable=1');\n";
	}
	if ($notice_top) {
		my $close_button;
		if ($port->{notice_close_button} ne 'off') {
			$close_button=DA::Portal::get_close_button($session,$date,$port,'notice_msg');
    		$close_button=~s/__INFO_PLACE__/top/g;
		}
		my $list_button;
		if ($ntcdat->{notice_list_button} eq 'on') {
			if($session->{menu_style} eq "preset" && $session->{portlet_style} eq "preset"){
				$list_button=&get_button4preset($session,
					"javascript:Pop('pop_notice_list.cgi?ntc_type=2','pop_title_popannounce.gif',700,500);",t_("一覧"));
			} else{
				$list_button="<a href=\"javascript:Pop('pop_notice_list.cgi?ntc_type=2','pop_title_popannounce.gif',700,500);\">"
			        . "<img src=$session->{img_rdir}/aqbtn_all.gif border=0 width=30 height=15 align=top hspace=2></a>";
			}
		}

		my $reload_timer;
		if ($session->{portlet_style} eq "aqua" || $session->{portlet_style} eq "preset") {
			my $contents = $notice_top;
			if ($port->{close}->{notice_msg} eq 'close') {
				$contents = undef;
			}
			my $text = t_("件数")." : $t_count @{[t_('件')]}";
			$text    = "<td class=\"text\">$text</td>" if ($session->{portlet_style} eq "preset");
			$tmpl->param(
				IMG_RDIR  => $session->{img_rdir},
				TITLE_TEXT => t_("メッセージ"),
				TITLE_GIF => "tbar_title_announce.gif",
				CUSTOM_BUTTON => $reload_timer,
				BUTTON    => "$text$list_button$close_button",
				DD_HEADER => $mouse_style,                 
				CONTENTS  => $contents,
			);
			$notice_msg_menu = $tmpl->output;
		}

		$notice_msg_menu = &insert_div_tag($notice_msg_menu, "notice_msg_top_refreshDiv", $nodiv);
	}

	return ($notice_msg_menu,$script);
}

sub get_workflow {
	my ($session,$date,$port,$tmpl,$query,$join)=@_;

	my $button;
	my $module=DA::IS::get_module($session);
	my ($href, $text);
	if ($module->{wf} eq 'on') {
		if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
			$href = "javascript:Pop('wf_form_select.cgi?open=portal','pop_title_mkappli.gif',600,530);";
			$text = t_('申請書作成');
			$button .= &get_button4preset($session, $href, $text);
		} else {	
			$button.="<a href=\"javascript:Pop('wf_form_select.cgi?open=portal',"
			."'pop_title_mkappli.gif',600,530)\"><img src=$session->{img_rdir}/"
			."aqbtn_mkadmit.gif width=58 height=15 border=0 "
			."title=\"@{[t_('申請書作成')]}\"></a>";
		}
	} else {
		$port->{wf_wf}='off';
		$port->{wf_dn}='off';
		$port->{wf_rb}='off';
	}
	if ($module->{cc} eq 'on') {
		if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
			$href = "javascript:Pop('cc_form_select.cgi','pop_title_mkcirc.gif',600,530);";
			$text = t_('回覧作成');
			$button .= &get_button4preset($session, $href, $text);
		} else {
			$button.="<a href=\"javascript:Pop('cc_form_select.cgi',"
			."'pop_title_mkcirc.gif',600,530)\"><img src=$session->{img_rdir}/"
			."aqbtn_mkcirculation.gif width=52 height=15 border=0 "
			."title=\"@{[t_('回覧作成')]}\"></a>";
		}
	} else {
		$port->{wf_cc}='off';
	}

	if ($port->{portal_conf_button} ne 'off') { 
		if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
			$href = "javascript:Pop('port_flow.cgi','pop_title_setworkflow.gif',430,360);";
			$text = t_('表示設定');
			$button .= &get_button4preset($session, $href, $text);
		} else {
			$button.="<a href=\"javascript:Pop('port_flow.cgi',"
			."'pop_title_setworkflow.gif',430,360)\"><img src=$session->{img_rdir}/"
			."aqbtn_setview.gif width=52 height=15 border=0 "
			."title=\"@{[t_('表示設定')]}\"></a>";
		}
	}
	$button.=DA::Portal::get_close_button($session,$date,$port,'workflow');

	if ($port->{close}->{workflow} eq 'close') {
		$tmpl->param(
    		IMG_RDIR  => $session->{img_rdir},
    		TITLE_GIF => "tbar_title_workflow.gif",
    		TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
				? t_('ワークフロー') : "",
    		BUTTON    => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
    		CONTENTS  => ''
		);
		my $tags=$tmpl->output;
		   $tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
		return ($tags);
	}

	# 一覧の内容を作成
	my ($html,$height)=DA::Portal::get_workflow_list($session,
			$query,$date,$port,$join);

	my $tags;
    if ($port->{wf_iframe} eq 'on') {
		my $html_file="$session->{temp_dir}/$session->{sid}.WF_PORTAL.dat";
	    my $OUT=DA::Unicode::file_open($html_file,"w");
    	print $OUT $html;
    	close($OUT);

        if (!DA::IS::is_iframe()) { return; }
        $tags="<iframe name=\"__REFRESH_DIV__\" height=$port->{iframe_height} "
		."width=100% src=$DA::Vars::p->{cgi_rdir}/portlet_iframe.cgi?"
		."portlet_type=WF_PORTAL&init=1 "
        ."frameborder=0 framespacing=0 noresize scrolling=auto></iframe>";
    } else {
		$tags=$html;
    }

    $tmpl->param(
        IMG_RDIR  => $session->{img_rdir},
    	TITLE_GIF => "tbar_title_workflow.gif",
        TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
			? t_('ワークフロー') : "",
        BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
        CONTENTS  => $tags
    );

	$tags=$tmpl->output;
	$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
	return ($tags);
}

sub get_board {
	my ($session,$date,$port,$tmpl,$query,$join)=@_;

    if($port->{bd_row} eq '')   {$port->{bd_row}=10;}
    if($port->{bd_title} eq '') {$port->{bd_title}=20;}
    if($port->{bd_gname} eq '') {$port->{bd_gname}=10;}
    if($port->{bd_group} eq '') {$port->{bd_group}='on';}
    if($port->{bd_date} eq '')  {$port->{bd_date}='on';}
    if($port->{bd_attach} eq ''){$port->{bd_attach}='on';}
    if($port->{bd_iframe} eq ''){$port->{bd_iframe}='off';}

	my ($button, $href);
	if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
		$href = "javascript:Pop('bd_regist.cgi%3fproc=new%20mode=top','pop_title_bulletin.gif',650,490,'',1);";
		$button .= &get_button4preset($session, $href, t_('登録'));
		$href = "javascript:Pop('bd_list.cgi%3fmode=top','pop_title_bulletin.gif',600,500);";
		$button .= &get_button4preset($session, $href, t_('一覧'));
	} else {
		$button="<a href=\"javascript:Pop('bd_regist.cgi%3fproc=new%20mode=top',"
		."'pop_title_bulletin.gif',650,490,'',1)\"><img src=$session->{img_rdir}/"
		."aqbtn_regist.gif width=30 height=15 border=0 title=\"@{[t_('登録')]}\"></a>"
    	."<a href=\"javascript:Pop('bd_list.cgi%3fmode=top',"
    	."'pop_title_bulletin.gif',600,500)\" class=\"tab\">"
    	."<img src=$session->{img_rdir}/aqbtn_all.gif width=30 height=15 border=0 "
    	."title=\"@{[t_('一覧')]}\"></a>";
	}

	if ($port->{portal_conf_button} ne 'off') { 
		if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
			$href = "javascript:Pop('port_board.cgi','pop_title_setbulletin.gif',430,330);";
			$button .= &get_button4preset($session, $href, t_('表示設定'));
		} else {
			$button.="<a href=\"javascript:Pop('port_board.cgi',"
			."'pop_title_setbulletin.gif',430,330)\">"
			."<img src=$session->{img_rdir}/aqbtn_setview.gif width=52 "
			."height=15 border=0 title=\"@{[t_('表示設定')]}\"></a>";
		}
	}
	$button.=DA::Portal::get_close_button($session,$date,$port,'board');

	my $tags;
	if ($port->{close}->{board} eq 'close') {
		$tmpl->param(
    		IMG_RDIR  => $session->{img_rdir},
    		TITLE_GIF => "tbar_title_bulletin.gif",
			TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
				? t_('連絡掲示板') : "",
    		BUTTON    => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
    		CONTENTS  => $tags
		);
		# return ($tmpl->output);

		$tags=$tmpl->output;
		$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
    	return ($tags);
	}

	# 一覧の内容を作成
	my ($html,$height)=DA::Portal::get_board_list($session,
			$query,$date,$port,$join);

    if ($port->{bd_iframe} eq 'on') {
		my $html_file="$session->{temp_dir}/$session->{sid}.BD_PORTAL.dat";
	    my $OUT=DA::Unicode::file_open($html_file,"w");
    	print $OUT $html;
    	close($OUT);

        if (!DA::IS::is_iframe()) { return; }
        $tags="<iframe id=\"__REFRESH_IFRAME__\" height=$port->{iframe_height} "
		."width=100% src=$DA::Vars::p->{cgi_rdir}/portlet_iframe.cgi"
		."?portlet_type=BD_PORTAL&init=1 frameborder=0 framespacing=0 "
		."noresize scrolling=auto></iframe>";
    } else {
		$tags=$html;
    }

    $tmpl->param(
        IMG_RDIR  => $session->{img_rdir},
        TITLE_GIF => "tbar_title_bulletin.gif",
        TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
			? t_('連絡掲示板') : "",
        BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
        CONTENTS  => $tags
    );

	$tags=$tmpl->output;
	$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
    return ($tags);
}

sub get_mail {
	my ($session,$date,$port,$tmpl,$join,$query)=@_;
	my $conf = DA::IS::get_popup_size($session);

	my $new_pop  = "mailDetail('ma_new.cgi?proc=new%20mode=pop',"
	             . "'pop_title_mkeml.gif',$conf->{width_ma},$conf->{height_ma},"
	             . "'','','$conf->{pos_x_ma}','$conf->{pos_y_ma}')";
	my $new_mail = DA::Ajax::new_mail_url($session, $new_pop);

	my $reload = "javascript:DAportletRefresher.refresh('mail','__INFO_PLACE__','$date','new_mail_check=1');";

	my ($button, $href);
	if ($session->{menu_style} eq 'preset'&& $session->{portlet_style} eq "preset") {
		$button.=&get_button4preset($session, $reload, t_('メール確認'));
		$button.=&get_button4preset($session, "javascript:$new_mail;", t_('メール作成'));
	} else {
		$button="<a href=\"$reload\"><img src=$session->{img_rdir}/aqbtn_emlcheck.gif "
		."width=59 height=15 border=0 title=\"@{[t_('メール確認')]}\"></a>"
		."<a href=\"javascript:$new_mail\;\">"
		."<img src=$session->{img_rdir}/aqbtn_emlwrite.gif width=59 height=15 "
		."border=0 title=\"@{[t_('メール作成')]}\"></a>";
	}

	if ($port->{portal_conf_button} ne 'off') { 
		if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
			$href = "javascript:Pop('port_mail.cgi','pop_title_setemail.gif',430,390);";
			$button .= &get_button4preset($session, $href, t_('表示設定'));
		} else {
			$button.="<a href=\"javascript:Pop('port_mail.cgi',"
			."'pop_title_setemail.gif',430,390)\"><img src=$session->{img_rdir}/"
			."aqbtn_setview.gif width=52 height=15 border=0 "
			."title=\"@{[t_('表示設定')]}\"></a>";
		}
	}
	$button.=DA::Portal::get_close_button($session,$date,$port,'mail');

	my $tags;
	if ($port->{close}->{mail} ne 'close') {
		if (DA::Ajax::mailer_ok($session)) {
			$tags=DA::Ajax::Mailer::print_portal($session,$query);
		} else {
			$tags=DA::Mail::mail_list_top($session,$port,$query);
		}
		$tags=&insert_div_tag($tags, '__REFRESH_DIV__');
	}
	$tmpl->param(
   		IMG_RDIR  => $session->{img_rdir},
   		TITLE_GIF => "tbar_title_email.gif",
		TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{menu_style} eq 'preset') ? t_('電子メール') : "",
   		BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
   		CONTENTS  => $tags
	);
	$tags=&insert_div_tag($tmpl->output, '__REFRESH_DIV__');
	my $mailAccount = DA::OrgMail::get_cookie($session);
	if ($mailAccount eq ""){
		$mailAccount = $session->{user};
	}
	$tags.= "<input type='hidden' id = 'portal_mail_cookie_key' value ='$session->{sid}'>"
		."<input type='hidden' id = 'protal_mail_data_account' value ='$mailAccount'>";
	return ($tags);
}

sub get_link {
	my ($session,$date,$port,$tmpl,$query,$join)=@_;

	my $regist_link="<a href=\"javascript:Pop('conf_link.cgi',"
	."'pop_title_links.gif',640,450)\" style=\"color:blue\">";
	my $conf_link  ="<a href=\"javascript:Pop('port_link.cgi',"
	."'pop_title_setlinks.gif',430,380)\" style=\"color:blue\">";

	my ($button, $href);
	if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
		$href = "javascript:Pop('conf_link.cgi','pop_title_links.gif',640,450);";
		$button .= &get_button4preset($session, $href, t_('登録'));
	} else {
		if ($session->{text_mode} eq 'on') {
			$button="[$regist_link@{[t_('登録')]}</a>]&nbsp;";
		} else {
			$button=$regist_link."<img src=$session->{img_rdir}/aqbtn_regist.gif "
			."width=30 height=15 border=0 title=\"@{[t_('登録')]}\"></a>";
		}
	}
	if ($port->{portal_conf_button} ne 'off') {
		if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
			$href = "javascript:Pop('port_link.cgi','pop_title_setlinks.gif',430,380);";
			$button .= &get_button4preset($session, $href, t_('表示設定'));
		} else {
			if ($session->{text_mode} eq 'on') {
				$button.="[$conf_link@{[t_('表示設定')]}</a>]&nbsp;";
			} else {
				$button.=$conf_link."<img src=$session->{img_rdir}/"
        		."aqbtn_setview.gif width=52 height=15 border=0 "
        		."title=\"@{[t_('表示設定')]}\"></a>";
			}
		}
	}
	$button.=DA::Portal::get_close_button($session,$date,$port,'link');

	my $tags;
	if ($port->{close}->{link} eq 'close') {
		$tmpl->param(
    		IMG_RDIR  => $session->{img_rdir},
    		TITLE_GIF => "tbar_title_links.gif",
			TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
				? t_('リンク集') : "",
    		BUTTON    => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
    		CONTENTS  => $tags
		);
		$tags=&insert_div_tag($tmpl->output, '__REFRESH_DIV__');
		return ($tags);
	}

    # 一覧の内容を作成
    my ($html,$height)=DA::Portal::get_link_list($session,
            $query,$date,$port,$join);

    if ($port->{link_iframe} eq 'on') {
        my $html_file="$session->{temp_dir}/$session->{sid}.LINK_PORTAL.dat";
        my $OUT=DA::Unicode::file_open($html_file,"w");
        print $OUT $html;
        close($OUT);

        if (!DA::IS::is_iframe()) { return; }
        $tags="<iframe id=\"__REFRESH_IFRAME__\" height=$port->{iframe_height} "
		."width=100% src=$DA::Vars::p->{cgi_rdir}/portlet_iframe.cgi"
		."?portlet_type=LINK_PORTAL&init=1 "
        ."frameborder=0 framespacing=0 noresize scrolling=auto></iframe>";
    } else {
		$tags=&insert_div_tag($html, "__REFRESH_DIV__");
    }
	$tmpl->param(
   		IMG_RDIR  => $session->{img_rdir},
   		TITLE_GIF => "tbar_title_links.gif",
		TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
			? t_('リンク集') : "",
   		BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
   		CONTENTS  => $tags
	);
	$tags=&insert_div_tag($tmpl->output, '__REFRESH_DIV__');
	return ($tags);
}

sub get_task {
	my ($session,$date,$port,$tmpl,$query,$join)=@_;

	my ($button, $href);
	if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
		$href = "javascript:Pop('todo_detail.cgi','pop_title_task.gif',560,500,1);";
		$button .= &get_button4preset($session, $href, t_('登録'));
	} else {
		$button="<a href=\"javascript:Pop('todo_detail.cgi',"
		."'pop_title_task.gif',560,600,1)\"><img src=$session->{img_rdir}/"
		."aqbtn_regist.gif width=30 height=15 border=0 "
		."title=\"@{[t_('登録')]}\"></a>";
	}

	if ($port->{portal_conf_button} ne 'off') {
		if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
			$href = "javascript:Pop('port_task.cgi','pop_title_settask.gif',430,330);";
			$button .= &get_button4preset($session, $href, t_('表示設定'));
		} else {
			$button.="<a href=\"javascript:Pop('port_task.cgi',"
			."'pop_title_settask.gif',430,330)\"><img src=$session->{img_rdir}/"
			."aqbtn_setview.gif width=52 height=15 border=0 "
			."title=\"@{[t_('表示設定')]}\"></a>";
		}
	}
	$button.=DA::Portal::get_close_button($session,$date,$port,'task');

	my $tags;
	if ($port->{close}->{task} eq 'close') {
		$tmpl->param(
    		IMG_RDIR  => $session->{img_rdir},
    		TITLE_GIF => "tbar_title_tasklist.gif",
			TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
				? t_('タスクリスト') : "",
    		BUTTON    => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
    		CONTENTS  => $tags
		);
		$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
		return ($tags);
	}

    # 一覧の内容を作成
    my ($html,$height)=DA::Portal::get_task_list($session,
            $query,$date,$port,$join);

    if ($port->{td_iframe} eq 'on') {
        my $html_file="$session->{temp_dir}/$session->{sid}.TODO_PORTAL.dat";
        my $OUT=DA::Unicode::file_open($html_file,"w");
        print $OUT $html;
        close($OUT);

        if (!DA::IS::is_iframe()) { return; }
        $tags="<iframe id=\"__REFRESH_IFRAME__\" name=\"__REFRESH_DIV__\" height=$port->{iframe_height} "
		."width=100% src=$DA::Vars::p->{cgi_rdir}/portlet_iframe.cgi"
		."?portlet_type=TODO_PORTAL&init=1 "
        ."frameborder=0 framespacing=0 noresize scrolling=auto></iframe>";
    } else {
		$tags=$html;
    }

    $tmpl->param(
        IMG_RDIR  => $session->{img_rdir},
   		TITLE_GIF => "tbar_title_tasklist.gif",
        TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
			? t_('タスクリスト') : "",
        BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
        CONTENTS  => $tags
    );
	$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
	return ($tags);
}

sub get_reminder {
	my ($session,$date,$port,$tmpl,$query,$join)=@_;

	my ($button, $href);
	if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
		$href = "javascript:Pop('sc_reminder.cgi?mode=new%20date=$date','pop_title_memo.gif',450,400);";
		$button = &get_button4preset($session, $href, t_('登録'));
	} else {
		$button="<a href=\"javascript:Pop('sc_reminder.cgi?mode=new%20date="
		."$date','pop_title_memo.gif',450,400)\"><img src=$session->{img_rdir}/"
		."aqbtn_regist.gif width=30 height=15 border=0 "
		."title=\"@{[t_('登録')]}\"></a>";
	}

	if ($port->{portal_conf_button} ne 'off') {
		if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
			$href = "javascript:Pop('port_reminder.cgi','pop_title_setmemo.gif',460,300);";
			$button .= &get_button4preset($session, $href, t_('表示設定'));
		} else {
			$button.="<a href=\"javascript:Pop('port_reminder.cgi',"
			."'pop_title_setmemo.gif',460,300)\"><img src=$session->{img_rdir}/"
			."aqbtn_setview.gif width=52 height=15 border=0 "
			."title=\"@{[t_('表示設定')]}\"></a>";
		}
	}
	$button.=DA::Portal::get_close_button($session,$date,$port,'reminder');

	if ($date=~/^\d{8}$/) {
    	$date= substr($date,0,4)."/".substr($date,4,2)."/".substr($date,6,2);
	}

	my $tags;
	if ($port->{close}->{reminder} eq 'close') {
		$tmpl->param(
    		IMG_RDIR  => $session->{img_rdir},
    		TITLE_GIF => "tbar_title_memo.gif",
			TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{menu_style} eq 'preset') 
				? t_('メモ') : "",
    		BUTTON    => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
    		CONTENTS  => $tags
		);

		$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
		return ($tags);
	}

    # 一覧の内容を作成
    my ($html,$height)=DA::Portal::get_reminder_list($session,
            $query,$date,$port,$join);

    if ($port->{memo_iframe} eq 'on') {
        my $html_file="$session->{temp_dir}/$session->{sid}.MEMO_PORTAL.dat";
        my $OUT=DA::Unicode::file_open($html_file,"w");
        print $OUT $html;
        close($OUT);

        if (!DA::IS::is_iframe()) { return; }
        $tags="<iframe id=\"__REFRESH_IFRAME__\" height=$port->{iframe_height} "
		."width=100% src=$DA::Vars::p->{cgi_rdir}/portlet_iframe.cgi"
		."?portlet_type=MEMO_PORTAL&init=1 "
        ."frameborder=0 framespacing=0 noresize scrolling=auto></iframe>";
    } else {
		$tags=$html;
    }
	$tmpl->param(
   		IMG_RDIR  => $session->{img_rdir},
   		TITLE_GIF => "tbar_title_memo.gif",
		TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{menu_style} eq 'preset') ? t_('メモ') : "",
   		BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
   		CONTENTS  => $tags
	);
	$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
	return ($tags);
}

sub get_grouplist {
	my ($session,$date,$port,$tmpl,$join_group)=@_;

	my $button=DA::Portal::get_close_button($session,$date,$port,'grouplist');

	my $tags;
	if ($port->{close}->{grouplist} eq 'close') {
		$tmpl->param(
    		IMG_RDIR  => $session->{img_rdir},
    		TITLE_GIF => "tbar_title_grouplist.gif",
			TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
				? t_('所属グループ') : "",
    		BUTTON    => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
    		CONTENTS  => $tags
		);

		$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
		return ($tags);
	}

	# 一覧の内容を作成
	my ($html,$height)=DA::Portal::get_grouplist_list($session,$date,$port,$join_group);

	$tags = $html;
	$tmpl->param(
   		IMG_RDIR  => $session->{img_rdir},
   		TITLE_GIF => "tbar_title_grouplist.gif",
		TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
			? t_('所属グループ') : "",
   		BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
   		CONTENTS  => $tags
	);

	$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
	return ($tags);
}

sub get_memlist {
	my ($session,$date,$port,$tmpl,$join)=@_;

	my $button=DA::Portal::get_close_button($session,$date,$port,'memlist');

	my $tags;
	if ($port->{close}->{memlist} eq 'close') {
		$tmpl->param(
    		IMG_RDIR  => $session->{img_rdir},
    		TITLE_GIF => "tbar_title_memlist.gif",
			TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
				? t_('所属ユーザ') : "",
    		BUTTON    => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
    		CONTENTS  => $tags
		);

		$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
		return ($tags);
	}

	# 一覧の内容を作成
	my ($html,$height)=DA::Portal::get_memlist_list($session,$date,$port,$join);

	$tags = $html;
	$tmpl->param(
   		IMG_RDIR  => $session->{img_rdir},
   		TITLE_GIF => "tbar_title_memlist.gif",
		TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
			? t_('所属ユーザ') : "",
   		BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
   		CONTENTS  => $tags
	);

	$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
	return ($tags);
}

sub get_newest {
	my ($session,$date,$port,$tmpl,$query,$join)=@_;

	my ($cgi, $title, $key);
	$title  = t_("統合クリッピング");
	$key    = 'newest';
	$cgi    = "port_newest.cgi";
	my $l = DA::IS::get_current_cgi();

	my $button;
	if ($port->{portal_conf_button} ne 'off') {
		if ($session->{portlet_style} eq 'preset'&& $session->{menu_style} eq "preset") {
			$button = &get_button4preset($session, "javascript:Pop('$cgi','pop_title_setnewest.gif',430,320);", t_('表示設定'));
		} else {
			$button="<a href=\"javascript:Pop('$cgi',".
				"'pop_title_setnewest.gif',430,320)\">".
				"<img src=$session->{img_rdir}/aqbtn_setview.gif width=52 ".
				"height=15 border=0 title=\"@{[t_('表示設定')]}\"></a>";
		}
	}
	$button.=DA::Portal::get_close_button($session,$date,$port,'newest');

	my $tags;
	if ($port->{close}->{$key} eq 'close') {
		$tmpl->param(
    		IMG_RDIR  => $session->{img_rdir},
    		TITLE_GIF => "tbar_title_newest.gif",
			TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
				? t_('統合クリッピング') : "",
    		BUTTON    => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
    		CONTENTS  => $tags
		);

		$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
		return ($tags);
	}

	my @param = $query->param;
	my $params;
	foreach my $name (@param) {
		if ($name eq 'portlet_param') { next; }
		$params .= "$name=".$query->param($name)."&";
	}

    if (($port->{newest_iframe} eq 'on') && DA::IS::is_iframe()){
        $tags="<iframe id=\"__REFRESH_IFRAME__\" height=$port->{iframe_height} "
			."width=100% src=$DA::Vars::p->{cgi_rdir}/is_newest_list.cgi?$params "
        	."frameborder=0 framespacing=0 noresize scrolling=auto></iframe>";
    } else {
		$tags = WA::CGI::call_cgi_portlet(
					session => $session,
					query   => $query,
					join    => $join,
					uri => "/cgi-bin/is_newest_list.cgi?$params",
		);
	}
			
	return undef unless(defined $tags);

	$tmpl->param(
   		IMG_RDIR  => $session->{img_rdir},
   		TITLE_GIF => "tbar_title_newest.gif",
		TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
			? t_('統合クリッピング') : "",
   		BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
   		CONTENTS  => $tags
	);

	$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
	return ($tags);
}

sub get_report {
    my ($session,$date,$port,$tmpl,$query,$join)=@_;

	my $button;
	if ($port->{portal_conf_button} ne 'off') {
		if ($session->{portlet_style} eq 'preset'&& $session->{menu_style} eq "preset") {
			$button = &get_button4preset($session, 
				"javascript:Pop('port_report.cgi','pop_title_setreport.gif',430,300);", t_('表示設定'));
		} else {
    		$button="<a href=\"javascript:Pop('port_report.cgi',"
        	."'pop_title_setreport.gif',430,300)\">"
        	."<img src=$session->{img_rdir}/aqbtn_setview.gif width=52 "
        	."height=15 border=0 title=\"@{[t_('表示設定')]}\"></a>";
		}
	}
    $button.=DA::Portal::get_close_button($session,$date,$port,'report');

	my $tags;
	if ($port->{close}->{report} eq 'close') {
		$tmpl->param(
    		IMG_RDIR  => $session->{img_rdir},
    		TITLE_GIF => "tbar_title_report.gif",
			TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
				? t_('新着レポート') : "",
    		BUTTON    => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
    		CONTENTS  => $tags
		);

		$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
		return ($tags);
	}

    if ($port->{report_iframe} eq 'on') {
        if (!DA::IS::is_iframe()) { return; }
        $tags="<iframe id=\"__REFRESH_IFRAME__\" height=$port->{iframe_height} "
		."width=100% src=$DA::Vars::p->{cgi_rdir}/sc_report_new.cgi?iframe=1 "
        ."frameborder=0 framespacing=0 noresize scrolling=auto></iframe>";
    } else {
		$query->param( date => $date );
        $tags=WA::CGI::call_cgi_portlet(
			session => $session,
			query   => $query,
			join    => $join,
            uri     => "/cgi-bin/sc_report_new.cgi"
		);
    }

	$tmpl->param(
   		IMG_RDIR  => $session->{img_rdir},
   		TITLE_GIF => "tbar_title_report.gif",
		TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
				? t_('新着レポート') : "",
   		BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
   		CONTENTS  => $tags
	);

	$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
	return ($tags);
}

sub get_fa_temp {
    my ($session,$date,$port,$tmpl,$query,$join)=@_;

	my $button;
	if ($port->{portal_conf_button} ne 'off') {
		if ($session->{portlet_style} eq 'preset' && $session->{menu_style} eq "preset") {
			$button = &get_button4preset($session,"javascript:Pop('port_fa_temp.cgi','pop_title_setfatemp.gif',480,290);",t_('表示設定'));
		} else {
    		$button="<a href=\"javascript:Pop('port_fa_temp.cgi','pop_title_setfatemp.gif',480,290)\">".
            		"<img src=$session->{img_rdir}/aqbtn_setview.gif width=52 height=15 border=0 title=\"@{[t_('表示設定')]}\"></a>";
		}
	}
    $button.=DA::Portal::get_close_button($session,$date,$port,'fa_temp');

	my $tags;
	if ($port->{close}->{fa_temp} eq 'close') {
		$tmpl->param(
    		IMG_RDIR  => $session->{img_rdir},
    		TITLE_GIF => "tbar_title_fa_temp.gif",
			TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
				? t_('仮予約承認待ち一覧') : "",
    		BUTTON    => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
    		CONTENTS  => $tags
		);
		$tags=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
		return ($tags);
	}

    if ($port->{fa_temp_iframe} eq 'on') {
        if (!DA::IS::is_iframe()) { return; }
        $tags="<iframe id=\"__REFRESH_IFRAME__\" height=$port->{iframe_height} "
			 ."width=100% src=$DA::Vars::p->{cgi_rdir}/fa_temp_new.cgi?iframe=1 "
        	 ."frameborder=0 framespacing=0 noresize scrolling=auto></iframe>";
    } else {
    	my ($div_html, $div_js);
    	my $fa_mode = DA::IS::get_sys_custom($session,"fa_mode");
		if (int($fa_mode->{category_depth}) > 1) {
    		my $prefx = DA::IS::get_uri_prefix();
			$div_js=qq{
				<script type="text/javascript" src="$DA::Vars::p->{js_rdir}/schedule/category_tree.js?$prefx"></script>
        		<SCRIPT LANGUAGE="JavaScript"><!--
            		function treeSubmit(target){ openCategoryPortlet(target); }
        		//--></SCRIPT>
			};
		}
		$query->param(date => $date);
        $tags=WA::CGI::call_cgi_portlet(
			session => $session,
			query   => $query,
			join    => $join,
            uri     => "/cgi-bin/fa_temp_new.cgi"
		);
		$tags.=$div_js;
    }

    $tmpl->param(
        IMG_RDIR  => $session->{img_rdir},
        TITLE_GIF => "tbar_title_fa_temp.gif",
        TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
                        ? t_('仮予約承認待ち一覧') : "",
        BUTTON    => $button,
        DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
        CONTENTS  => $tags
    );

	my $html=&insert_div_tag($tmpl->output, "__REFRESH_DIV__");
	return ($html);
}

sub get_program {
	my ($session,$num,$mode,$popup)=@_;

	my $resv=DA::IS::get_sys_custom($session,"portlet_reserve");
	my $pr =DA::Portal::get_external_param($session,$num,$session->{user});
	my $sso=DA::Portal::get_sso_param($session,$pr->{sso_num},$session->{user});
	my $url=$pr->{url};
	if ($pr->{device} eq 2 || $pr->{device} eq 3) { 
		if ($mode ne 'filter') { return; }
		$pr->{method}='get'; $pr->{timeout}='30'; 
	}

	# HEADER/FOOTER/FILTER の読込
	my ($header,$footer);
	if ($mode ne 'filter') {
		($header,$footer)=DA::Portal::get_header($session,$pr->{num},$resv);
	}
	my $filter=DA::Portal::get_filter($num);
	   $filter->{auth_user}=$sso->{basic_user};
	   $filter->{auth_pass}=$sso->{basic_pass};
	   $filter->{auth_url}=$pr->{url};
	   $filter->{kanji_code}=$pr->{kanji_code};

	if (!$pr->{sso_view} && $url eq '') {
		# ＵＲＬが指定されていない場合はヘッダ・フッタのみ返す
		return ($header . $footer);
	}
	if ($pr->{sso_view} && !$sso->{num}) {
		# ログイン後のページ表示でログイン定義がない場合はヘッダ・フッタのみ返す
		return ($header . $footer);
	}

	my ($ua,$jar,$cookie_val,$cookie_tag,$result);
    if ($sso->{login_url}) {
		my $cookie_file;
		if ($mode eq 'preview') {
			$cookie_file=
				"$session->{temp_dir}/cookie_check.$num.$session->{sid}";
			if (-f $cookie_file) { DA::System::file_unlink($cookie_file); }

			# ポータルの Cookie ファイルも削除する
			my $cookie_port=
				"$session->{temp_dir}/cookie.$pr->{sso_num}.$session->{sid}";
			if (-f $cookie_port) { DA::System::file_unlink($cookie_port); }
		}
		$sso->{sso_view}=($pr->{sso_view_filter}) ? $pr->{num} : 0;
		$sso->{frame}   =($pr->{frame}) ? $pr->{frame} : 0;
        ($ua,$jar,$cookie_val,$cookie_tag,$result)=
			DA::Portal::get_cookie_tag($session,$sso,$cookie_file);
		# ログイン後のページをそのまま返す
		if ($pr->{sso_view}) { return($result); }
    } else {
		($ua,$jar)=DA::Portal::make_ua($session,$pr);
	}

	my $req=DA::Portal::make_req($session,$pr,$sso,$jar);
	DA::Portal::set_proxy_env($session,$ua,$pr->{url});
   	my $res=$ua->request($req);
   	if ($res->is_error) {
		my $message=$res->message;
       	my $outbuf="<center><font color=red>@{[t_('ポートレットエラー')]}<br>"
		."@{[t_('エラーコード')]}: " . $res->code . "<br>"
		."[" . DA::Charset::convert_to(\$message,DA::Unicode::internal_charset()) . "]" 
		."</font></center>";
		if ($mode eq 'iframe') {
			return ($outbuf);
		} else {
			return ($header . $outbuf . $footer);
		}
	} elsif (!grep(/text/,$res->headers->{'content-type'})) {
		# テキスト以外の場合はヘッダ・フッタのみ返す
		# return ($header . $footer);
	}
	my $r_buf=$res->content;
	# リダイレクトされた場合はリダイレクト先のＵＲＬで変換する
   	if ($res->previous) { $pr->{url}=$res->base; }
    if ($mode eq 'preview') {
		$r_buf=DA::Charset::convert_to(\$r_buf,DA::Unicode::internal_charset());
    } elsif ($mode eq 'source') {
		$r_buf=DA::Charset::convert_to(\$r_buf,DA::Unicode::internal_charset());
		return($r_buf);
    } else {
		if ($pr->{kanji_code} eq 'jis') {
			$r_buf=DA::Charset::convert(\$r_buf,
				"ISO-2022-JP",DA::Unicode::internal_charset());
		} elsif ($pr->{kanji_code} eq 'sjis') {
			$r_buf=DA::Charset::convert(\$r_buf,
				"Shift_JIS",DA::Unicode::internal_charset());
		} elsif ($pr->{kanji_code} eq 'utf8') {
			$r_buf=DA::Charset::convert(\$r_buf,
				"UTF-8",DA::Unicode::internal_charset());
		} elsif ($pr->{kanji_code} eq 'euc') {
			$r_buf=DA::Charset::convert(\$r_buf,
				"EUC-JP",DA::Unicode::internal_charset());
		}
	}

	if ($mode eq 'filter') {
		# フィルタ設定画面用
		my $dom=DA::HTMLDOMParser->new(indent => 0);
		$dom->parse(\$r_buf, DA::Unicode::internal_charset());
		$dom->filter_links(type => "both", url => $pr->{url});
		$dom->filter_events();
	 	my $script=$dom->filter_script(DA::Unicode::internal_charset());
        my $meta=$dom->filter_meta();
    	my $iframe=$dom->filter_iframe() if ($filter->{iframe} eq 'on');
        my $style=$dom->filter_style(DA::Unicode::internal_charset());
		my $outbuf=$dom->dump({ xpath	=> "/html",
								charset => DA::Unicode::internal_charset() });
		return ($outbuf);
	} elsif ($mode eq 'iframe') {
		my $outbuf=DA::Portal::filter_run($session,$filter,
				$r_buf,$pr->{num},$pr->{url},'frame');
		return ($outbuf);
	} else {
		my $outbuf;
		if ($pr->{frame} ne 1 && $pr->{cache_embed} eq 1) {
			$outbuf=DA::Portal::filter_run($session,$filter,
				$r_buf,$pr->{num},$pr->{url},$mode);
		} elsif ($pr->{frame} eq 1  && $pr->{cache_frame} eq 1) {
			$outbuf=DA::Portal::filter_run($session,$filter,
				$r_buf,$pr->{num},$pr->{url},$mode);
		} else {
			$outbuf=$r_buf;
		}
		if ($popup eq 'popup') {
			if ($cookie_tag) {
            	$outbuf.="<!-- Cookie Agent No.$num -->";
            	$outbuf.=$cookie_tag;
			}
        } else {
		   $outbuf=DA::Portal::put_header($session,$outbuf,$pr->{num},$resv);
		}
		return ($outbuf);
	}
}

sub get_schedule {
    my ($session, $query, $date, $port, $bosses, $nodiv) = @_;
    my $sc_buf;
    my $close = $port->{close};

    my $option = DA::IS::get_master($session,'schedule');
    my $sc_param={};
    $sc_param->{mode} = 'top';
    $sc_param->{mid}  = $session->{user};
    $sc_param->{date} = $date;
    $sc_param->{from} = 'top';

    my $v_date = $query->param('v_date');
    if ($v_date) {
        $sc_param->{date} = $v_date;
        $sc_param->{v_date} = $v_date;
    }

    $sc_param->{cgi}  = "login.cgi";
    $sc_param->{user_type}  = "1";
    $sc_param->{must} = $port->{must};

    $sc_param->{portal_close_button}=$port->{portal_close_button};
    $sc_param->{portal_param_button}=$port->{portal_param_button};
    $sc_param->{portal_info_button} =$port->{portal_info_button};
    $sc_param->{portal_must_button} =$port->{portal_must_button};
    $sc_param->{portal_conf_button} =$port->{portal_conf_button};
    $sc_param->{portal_info_place}  =$port->{portal_info_place} || '__INFO_PLACE__';

    $sc_param->{close_button} = $close->{schedule};

    my $s_update=0;
    if ($query->param('range_r') eq '' && $query->param('range_l') eq '') {
        $sc_param->{range_l} = $session->{range_l};
        $sc_param->{range_r} = $session->{range_r};
    } else {
        $sc_param->{range_l} = $query->param('range_l');
        $sc_param->{range_r} = $query->param('range_r');
        $session->{range_l}  = $query->param('range_l');
        $session->{range_r}  = $query->param('range_r');
        # DA::Session::update($session);
        $s_update = 1;
    }
    if ($session->{top_sc_fix_scale} eq '') {
        $session->{top_sc_fix_scale} = ($option->{fix_scale}) ? 1 : 0;
        $s_update = 1;
    } elsif ($query->param('fix_change')) {
        $session->{top_sc_fix_scale} = ($session->{top_sc_fix_scale}) ? 0 : 1; # 反転
        $s_update = 1;
    }
    if ($s_update) {
        DA::Session::update($session);
    }

    my ($time_tag,$hidden_tag);
    if ($port->{sc_type} eq 'week') {
        ($time_tag,$hidden_tag)=
            DA::Scheduler::get_sc_week($session,$sc_param);
        $sc_buf=$time_tag;
    } elsif ($port->{sc_type} eq 'week_list') {
        ($time_tag,$hidden_tag)=
            DA::Scheduler::get_sc_week_list($session,$sc_param,undef,$bosses);
        $sc_buf=$time_tag;
    } elsif ($port->{sc_type} eq 'week_list_v') {
        ($time_tag,$hidden_tag)=
            DA::Scheduler::get_sc_week_list_vertical($session,$sc_param,undef,$bosses);
        $sc_buf=$time_tag;
    } elsif ($port->{sc_type} eq 'day_h') {
        ($time_tag,$hidden_tag)=
            DA::Scheduler::get_sc_day_horizontal($session,$sc_param,undef,$bosses);
        $sc_buf=$time_tag;
    } else {
        ($time_tag,$hidden_tag)=DA::Scheduler::get_sc_day($session,$sc_param);
        $sc_buf=$time_tag;
    }
    $sc_buf.="<br>";

    if ($session->{portlet_style} eq "aqua" || $session->{portlet_style} eq "preset") {
        my $tmpl_file = ($session->{portlet_style} eq "aqua") ? "top_page_aqua.tmpl" : "top_page_preset.tmpl";
        my $tmpl = HTML::Template->new(
            filename => "$DA::Vars::p->{html_dir}/template/$tmpl_file",
            cache  => 1
        );

		my $button={};
		my $today=DA::CGIdef::get_date('Y4MMDD');
		my $today_href = "javascript:DAportletRefresher.refresh('schedule','$sc_param->{portal_info_place}','$today','');";

        my $sc_print_mode = "day";
        if ($port->{sc_type}=~/^week/) {
            $sc_print_mode = "week";
        }
		if ($session->{portlet_style} eq "preset" && $session->{menu_style} eq "preset") {
			my ($href, $text);
			$href = "javascript:Pop('sc_reminder.cgi%3fmode=new%20date=$date','pop_title_memo.gif','450','400');";
			$text = t_('メモ登録');
			$button->{memo} = &get_button4preset($session, $href, $text);
			$href = "$DA::Vars::p->{cgi_rdir}/login_main.cgi?date=";
			$text = t_('今日');
			$button->{today} = &get_button4preset($session, $today_href, $text);
			$href = "javascript:Pop('sc_print.cgi%3fdate=$sc_param->{date}%20mode=$sc_print_mode','pop_title_schprint.gif','450','270');";
			$text = t_('印刷');

            DA::Custom::sc_day_print_rewrite($session,$port->{sc_type},$sc_param,\$href);

			$button->{print} = &get_button4preset($session, $href, $text);
			if ($port->{portal_conf_button} ne 'off') {
				$href = "javascript:Pop('port_schedule.cgi','pop_title_setschedule.gif',480,280);";
				$text = t_('表示設定');
				$button->{conf} = &get_button4preset($session, $href, $text);
			}
			if ($port->{close}->{schedule} ne 'close' && $port->{sc_type} ne 'week' && $option->{range} eq 'fix') {
	        	if ($sc_param->{range_l} && $sc_param->{range_r}) {
	          		# $href = "$DA::Vars::p->{cgi_rdir}/login_main.cgi?date=$sc_param->{date}&range_l=0&range_r=0";
					my $base_param="range_l=0&range_r=0";
					$href = "javascript:DAportletRefresher.refresh('schedule','$sc_param->{portal_info_place}','$sc_param->{date}','$base_param');";
					$text = t_('固定時間表示');
	        	} else {
	          		# $href = "$DA::Vars::p->{cgi_rdir}/login_main.cgi?date=$sc_param->{date}&range_l=1&range_r=1";
					my $base_param="range_l=1&range_r=1";
					$href = "javascript:DAportletRefresher.refresh('schedule','$sc_param->{portal_info_place}','$sc_param->{date}','$base_param');";
					$text = t_('24時間表示');
	          	}
	          	$button->{range} = &get_button4preset($session, $href, $text);
			}
			if ($port->{close}->{schedule} ne 'close' && $port->{sc_type} ne 'week' && $port->{sc_type} ne 'day') {
	            # $href = "$DA::Vars::p->{cgi_rdir}/login_main.cgi?date=$sc_param->{date}"
	            #		."&range_l=$sc_param->{range_l}&range_r=$sc_param->{range_r}&fix_change=1";
				my $base_param="range_l=$sc_param->{range_l}&range_r=$sc_param->{range_r}&fix_change=1";
				$href = "javascript:DAportletRefresher.refresh('schedule','$sc_param->{portal_info_place}','$sc_param->{date}','$base_param');";
				$text = ($session->{top_sc_fix_scale}) ? t_('データ表示') : t_('目盛り固定');
	            $button->{scale} = &get_button4preset($session, $href, $text);
	        }
		} else {
        	$button->{memo}="<a href=\"javascript:Pop('sc_reminder.cgi%3fmode=new%20date=$date','pop_title_memo.gif','450','400');\">"
				."<img src=\"$session->{img_rdir}/aqbtn_memregist.gif\" width=52 height=15 border=0 title=\"@{[t_('メモ登録')]}\"></a>"
				."<a href=\"$today_href\"><img src=\"$session->{img_rdir}/aqbtn_today.gif\" width=30 height=15 border=0 title=\"@{[t_('今日')]}\"></a>";
        	my $href ="javascript:Pop('sc_print.cgi%3fdate=$sc_param->{date}%20mode=$sc_print_mode',"
                     ."'pop_title_schprint.gif','450','270')";

            DA::Custom::sc_day_print_rewrite($session,$port->{sc_type},$sc_param,\$href);

        	my $sc_print_btn ="<a href=\"$href\">"
                     . DA::Scheduler::img_tag($session, 'btn_schprint') ."</a>";  # 印刷

        	$button->{print}=$sc_print_btn;

        	if ($port->{portal_conf_button} ne 'off') {
            	$button->{conf}="<a href=\"javascript:Pop('port_schedule.cgi',"
                	."'pop_title_setschedule.gif',480,280);\">"
                	."<img src=$session->{img_rdir}/aqbtn_setview.gif width=52 "
                	."height=15 border=0 title=\"@{[t_('表示設定')]}\"></a>";
        	}

        	if ($port->{close}->{schedule} ne 'close' && $port->{sc_type} ne 'week' && $option->{range} eq 'fix') {
        		my $range_btn = "";
          		if ($sc_param->{range_l} && $sc_param->{range_r}) {
					my $base_param="range_l=0&range_r=0";
					my $href="javascript:DAportletRefresher.refresh('schedule','$sc_param->{portal_info_place}','$sc_param->{date}','$base_param');";
              		$range_btn = "<a href=\"$href\"><img src=\"$session->{img_rdir}/aqbtn_fixed.gif\" "
                		."height=\"15\" border=\"0\" title=\"".t_("固定時間表示")."\"></a>";
          		} else {
					my $base_param="range_l=1&range_r=1";
					my $href="javascript:DAportletRefresher.refresh('schedule','$sc_param->{portal_info_place}','$sc_param->{date}','$base_param');";
              		$range_btn = "<a href=\"$href\"><img src=\"$session->{img_rdir}/aqbtn_24h.gif\" "
                		."height=\"15\" border=\"0\" title=\"".t_("24時間表示")."\"></a>";
          		}
          		$button->{range}=$range_btn;
        	}

        	# fix_scale
        	if ($port->{close}->{schedule} ne 'close' && $port->{sc_type} ne 'week' && $port->{sc_type} ne 'day') {
        		my $fix_gif = DA::Scheduler::img_tag($session, 'btn_fix_scale');
        		if ($session->{top_sc_fix_scale}) {
            		$fix_gif = DA::Scheduler::img_tag($session, 'btn_disp_data');
        		}
				my $base_param="range_l=$sc_param->{range_l}&range_r=$sc_param->{range_r}&fix_change=1";
				my $href="javascript:DAportletRefresher.refresh('schedule','$sc_param->{portal_info_place}','$sc_param->{date}','$base_param');";
        		$button->{scale}="<a href=\"$href\">$fix_gif</a>";
	        }
        }

        $button->{close}=DA::Portal::get_close_button($session,$date,$port,'schedule');

        ## add CBP for Change sc_portlet Button 2014/08/31 takashi
        my $custom_button = DA::Custom::custom_sc_portlet_button($session,$button,$date,$port);

        my $button_buf;
        if ($custom_button){
            $button_buf=$custom_button;
        } else {
            $button_buf .= $button->{memo}  if($button->{memo});
            $button_buf .= $button->{today} if($button->{today});
            $button_buf .= $button->{print} if($button->{print});
            $button_buf .= $button->{conf}  if($button->{conf});
            $button_buf .= $button->{range} if($button->{range});
            $button_buf .= $button->{scale} if($button->{scale});
            $button_buf .= $button->{close} if($button->{close});
        }

        if ($port->{close}->{schedule} eq 'close') {
            $tmpl->param(
                IMG_RDIR  => $session->{img_rdir},
                TITLE_GIF => "tbar_title_schedule.gif",
                TITLE_TEXT => t_("スケジュール"),
                BUTTON    => $button_buf,
				DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
                CONTENTS  => "",
            );
            $sc_buf = $tmpl->output;
        } else {
            $tmpl->param(
                IMG_RDIR  => $session->{img_rdir},
                TITLE_TEXT => t_("スケジュール"),
                TITLE_GIF => "tbar_title_schedule.gif",
                BUTTON    => $button_buf,
				DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
                CONTENTS  => $time_tag,
            );
            $sc_buf = $tmpl->output;
        }
    }
    $sc_buf = &insert_div_tag($sc_buf, "__REFRESH_DIV__", $nodiv);
    return $sc_buf;
}

sub get_must_icon {
	my ($session,$port,$code,$place)=@_;

	my ($button,$alt,$must);
	if ($code =~ /^($port->{"must_$place"}->{menu})$/) {
		my $g_name=($port->{"must_$place"}->{$code}) 
			? $port->{"must_$place"}->{$code} : $session->{space_group};
		$alt=t_('%1のオーナーによる表示指定',enc_($g_name));
		$must = 1;
		if ($session->{menu_style} eq 'preset' && $session->{portlet_style} eq "preset") {
			$button = "<td class=\"ico\"><img height=\"9\" width=\"9\" "
			."src=\"$session->{img_rdir}/ctm03_porico_owner.png\" title=\"$alt\"></td>";
		} else {
		$button="<img src=$session->{img_rdir}/aqbtn_sign.gif border=0 "
		."width=17 height=15 title='$alt'>";
		}
	} elsif ($session->{menu_style} ne 'preset'&& $session->{portlet_style} eq "preset") {
		$must = 0;
		$button="<img src=$session->{img_rdir}/null.gif border=0 "
		."width=17 height=15>";
	}

	return($button,$alt,$must);
}

sub get_close_button {
	my ($session,$date,$port,$code,$cache_on,$no)=@_;

    my $info_place=$port->{portal_info_place} || '__INFO_PLACE__';

	# 必須メニューを示すアイコンを表示
	my $must;
	if ($port->{portal_must_button} ne 'off') { 
		if ($code =~ /^($port->{must})$/) {
			$must="__MUST_BUTTON__";
		} elsif ($code =~ /^(notice|dcm|notice_msg)$/g){ #通達、連絡などで必須画像を表示させる
			if ($session->{menu_style} eq 'preset'&& $session->{portlet_style} eq "preset") {
				$must = "<td class=\"ico\"><img height=\"9\" width=\"9\" "
				."src=\"$session->{img_rdir}/ctm03_porico_owner.png\"></td>";
			} else {
				$must="<img src=$session->{img_rdir}/aqbtn_sign.gif border=0"
				."width=17 height=15>";
			}
		}elsif ($session->{menu_style} ne 'preset'&& $session->{portlet_style} eq "preset") {
			$must="<img src=$session->{img_rdir}/null.gif border=0 "
			."width=17 height=15>";
		}
	}
	my $popup;
	if ($code=~/^ex_(\d+)$/) {
		$code=$1;
		if ($port->{portal_param_button} ne 'off') { 
			if ($session->{menu_style} eq 'preset'&& $session->{portlet_style} eq "preset") {
				$popup .= "<td class=\"ico\">"
				       ."<a href=\"javascript:Pop('port_program.cgi%3fnum=$code%20edit=1','pop_title_editpara.gif',550,500);\">"
				       ."<img height=\"9\" width=\"9\" src=\"$session->{img_rdir}/ctm03_porico_check.png\"></a></td>";
			} else {
				$popup.="<a href=\"javascript:Pop('port_program.cgi%3fnum=$code%20"
				."edit=1','pop_title_editpara.gif',550,500);\">"
				."<img src=$session->{img_rdir}/aqbtn_set.gif border=0 width=17 "
				."height=15 title='@{[t_('パラメータ設定')]}'></a>";
			}
		}
		# ポートレット単体でのリフレッシュが可能となったので、全ポートレットを対象にする
		# if ($cache_on eq 1) {
		#	$popup.="<a href=$DA::Vars::p->{cgi_rdir}/login_main.cgi?"
		#	."date=$date&refresh=$code><img src=$session->{img_rdir}/"
		#	."aqbtn_small_refresh.gif border=0 width=17 height=15 "
		#	."title='@{[t_('ポートレット更新')]}'></a>";
		# }
		if ($port->{portal_refresh_button} ne 'off') {
			if ($session->{menu_style} eq 'preset'&& $session->{portlet_style} eq "preset") {
				$popup .= "<td class=\"ico\">"
					   ."<a href=\"javascript:DAportletRefresher.refresh('$code','__INFO_PLACE__','$date');\">"
				       ."<img class=refresh height=\"9\" width=\"9\" src=\"$session->{img_rdir}/ctm03_porico_update.png\"></a></td>";
			} else {
				$popup .= "<a href=\"javascript:DAportletRefresher.refresh('$code','__INFO_PLACE__','$date');\">"
			       .  "<img class=refresh src=$session->{img_rdir}/"
			       .  "aqbtn_small_refresh.gif border=0 width=17 height=15 "
			       .  "title='@{[t_('ポートレット更新')]}'></a>";
			}
		}
		if ($port->{portal_info_button} ne 'off') { 
			if ($session->{menu_style} eq 'preset'&& $session->{portlet_style} eq "preset") {
				$popup .= "<td class=\"ico\">"
					   ."<a href=\"javascript:cInfo('$code','__INFO_PLACE__');\">"
				       ."<img height=\"9\" width=\"9\" src=\"$session->{img_rdir}/ctm03_porico_info.png\"></a></td>";
			} else {
				$popup.="<a href=\"javascript:cInfo('$code','__INFO_PLACE__');\">"
				."<img src=$session->{img_rdir}/aqbtn_info_s.gif border=0 width=17 "
				."height=15 title='@{[t_('ポートレット情報')]}'></a>";
			}
		}
	} else {
		if ($code ne "rssreader") {
			my $param='new_mail_check=1' if ($code eq 'mail');
			if ($session->{menu_style} eq 'preset'&& $session->{portlet_style} eq "preset") {
				$popup .= "<td class=\"ico\">"
					   ."<a href=\"javascript:DAportletRefresher.refresh('$code','__INFO_PLACE__','$date','$param');\">"
				       ."<img class=refresh height=\"9\" width=\"9\" src=\"$session->{img_rdir}/ctm03_porico_update.png\"></a></td>";
			} else {
				$popup .= "<a href=\"javascript:DAportletRefresher.refresh('$code','__INFO_PLACE__','$date','$param');\">"
			       .  "<img class=refresh src=$session->{img_rdir}/"
		   		   .  "aqbtn_small_refresh.gif border=0 width=17 height=15 "
		  	 	   .  "title='@{[t_('ポートレット更新')]}'></a>";
			}
		}
	}
	my $close;
	if ($port->{portal_close_button} ne 'off' && $no ne 'no') { 
		# 枠がないポートレットにはcloseボタンが表示させない
		my ($open_button,$close_button);
		if ($session->{menu_style} eq 'preset'&& $session->{portlet_style} eq "preset") {
			my $btn = {
				'mode' => ($port->{close}->{$code} eq 'close') ? 'open' : 'close',
				'text' => ($port->{close}->{$code} eq 'close') ? t_("開　く") : t_("閉じる"),
			};
			if ($code eq "rssreader") {
				$close = "<td class=\"btn\" id=\"close_rssreader__INFO_PLACE__\">"
					."<a class=\"$btn->{mode}\" title=\"$btn->{text}\" "
					."href=\"javascript:DAportletRefresher.refresh_rss('__INFO_PLACE__','$btn->{mode}');\">"
					."$btn->{text}</a></td>";
			} else {
				$close = "<td class=\"btn\"><a class=\"$btn->{mode}\" title=\"$btn->{text}\" "
					."href=\"javascript:DAportletRefresher.refresh('$code','__INFO_PLACE__','','','$btn->{mode}');\">"
					."$btn->{text}</a></td>";
			}
		} else {
			if ($session->{text_mode} eq 'on') {
				$open_button ="[".t_('開　く')."]";
				$close_button="[".t_('閉じる')."]";
			} else {
				$open_button ="<img src=$session->{img_rdir}/"
            	."aqbtn_small_open.gif border=0 width=17 height=15 "
            	."title=\"@{[t_('開く')]}\" title=\"@{[t_('開く')]}\">";
				$close_button="<img src=$session->{img_rdir}/"
				."aqbtn_small_close.gif border=0 width=17 height=15 "
				."title=\"@{[t_('閉じる')]}\" title=\"@{[t_('閉じる')]}\">";
			}
			my $btn = {
				'mode' => ($port->{close}->{$code} eq 'close') ? 'open' : 'close',
				'text' => ($port->{close}->{$code} eq 'close') ? $open_button : $close_button,
			};
			if ($code eq "rssreader") {
				my $func="javascript:DAportletRefresher.refresh_rss";
				$close="<a href=\"$func('__INFO_PLACE__','$btn->{mode}');\" "
					  ."style=\"color:blue\">$btn->{text}</a>";
				$close="<span id=\"close_rssreader__INFO_PLACE__\">$close</span>";
			} else {
				my $func="javascript:DAportletRefresher.refresh";
				$close="<a href=\"$func('$code','__INFO_PLACE__','','','$btn->{mode}');\" "
					  ."style=\"color:blue\">$btn->{text}</a>";
			}
		}
	}
	
	return ($popup.$must.$close);
}
sub get_button4preset {
	my ($session, $href, $text) = @_;
	my $btn_tag =<<end_tag;
<td class="function">
<table><tbody>
<tr><td class="hl"><a class="small" href="$href">$text</a></td>
<td class="hr"></td></tr>
<tr><td class="bl"></td><td class="br"></td></tr>
</tbody></table></td>
end_tag
	return $btn_tag;
}
sub get_button4preset2 {
    my ($session, $href, $text) = @_;
    my $btn_tag =<<end_tag;
<td class="function">
<table><tbody>
<tr><td class="hl"><a class="small" href="#" onClick="$href">$text</a></td>
<td class="hr"></td></tr>
<tr><td class="bl"></td><td class="br"></td></tr>
</tbody></table></td>
end_tag
    return $btn_tag;
}

sub get_filter {
    my ($num)=@_;
	my $files={};
	$files->{filter} ="$DA::Vars::p->{data_dir}/external/$num/filter.dat";
	$files->{header} ="$DA::Vars::p->{data_dir}/external/$num/header.dat";
	$files->{footer} ="$DA::Vars::p->{data_dir}/external/$num/footer.dat";
	$files->{explain}="$DA::Vars::p->{data_dir}/external/$num/explain.dat";
	$files->{separator}="$DA::Vars::p->{data_dir}/external/$num/separator.dat";
	$files->{start}  ="$DA::Vars::p->{data_dir}/external/$num/start.dat";
	$files->{end}    ="$DA::Vars::p->{data_dir}/external/$num/end.dat";

    my $filter={};
    if (-f "$files->{filter}") {
        DA::System::file_open(\*IN,"$files->{filter}");
        while(defined(my $line=<IN>)) {
            chomp($line);
			if ($line=~/^\#/) { next; }
            my ($key,$value)=split(/\=/,$line);
			if ($value eq 1) { $value='on'; }
            $filter->{$key}=$value;
        }
        close(IN);
	}
    if (DA::Unicode::file_exist("$files->{separator}")) {
        my $IN=DA::Unicode::file_open("$files->{separator}","r");
        while(defined(my $line=<$IN>)) {
            chomp($line);
            $filter->{separator}.=$line;
        }
        close($IN);
	}
    if (DA::Unicode::file_exist("$files->{start}")) {
        my $IN=DA::Unicode::file_open("$files->{start}","r");
        while(defined(my $line=<$IN>)) {
            chomp($line);
            $filter->{start}.=$line;
        }
        close($IN);
	}
    if (DA::Unicode::file_exist("$files->{end}")) {
        my $IN=DA::Unicode::file_open("$files->{end}","r");
        while(defined(my $line=<$IN>)) {
            chomp($line);
            $filter->{end}.=$line;
        }
        close($IN);
	}
    return($filter);
}

sub make_ua {
	my ($session,$pr,$file)=@_;
	$file="$session->{temp_dir}/cookie.$pr->{num}.$session->{sid}" if (!$file);

	# 多重ログインを回避するため、同一セッション内でクッキーを保持
	# 	my $jar=HTTP::Cookies->new(File=>$file, AutoSave => 1);
	# 	$jar->clear();
	my $jar=HTTP::Cookies->new(File=>$file, AutoSave=>1, ignore_discard=>1);

	my $ua=new LWP::UserAgent(requests_redirectable => ['GET','HEAD','POST']);
	   $ua->cookie_jar($jar);
	if ($pr->{agent}) {
		$ua->agent($pr->{agent});
	} else {
		$ua->agent($ENV{'HTTP_USER_AGENT'});
	}
	if ($pr->{timeout}) { $ua->timeout($pr->{timeout}); }

    my ($proxy_addr,$protocol,$url);
    if ($pr->{init_url}) {
        $proxy_addr=DA::IS::get_proxy($session,$pr->{init_url});
        ($protocol,$url)=DA::CGIdef::split_url($pr->{init_url});
    } elsif ($pr->{login_url}) {
        $proxy_addr=DA::IS::get_proxy($session,$pr->{login_url});
        ($protocol,$url)=DA::CGIdef::split_url($pr->{login_url});
    } else {
        $proxy_addr=DA::IS::get_proxy($session,$pr->{url});
        ($protocol,$url)=DA::CGIdef::split_url($pr->{url});
    }
	$ENV{HTTPS_PROXY} = '';
	$ENV{HTTPS_PROXY_USERNAME} = '';
	$ENV{HTTPS_PROXY_PASSWORD} = '';
	if ($proxy_addr) {
        if ($protocol eq 'https') {
			DA::Portal::set_ssl_proxy($proxy_addr);
        } else {
            $ua->proxy('http' => $proxy_addr);
        }
	}

	return ($ua,$jar);
}

sub filter_run {
	my ($session,$filter,$str,$num,$url,$mode,$resv)=@_;

	if ($str eq '') { return; }

	# InterBrain を経由した場合の対応
	if ($ENV{'HTTP_X_VIA_INTERBRAIN'}) {
		$url =~ s/^\Q$DA::Vars::p->{app_session_url}\E/$ENV{'HTTP_X_VIA_INTERBRAIN'}/;
	}

	$str=DA::Charset::convert_to(\$str,DA::Unicode::internal_charset());
    my $dom=DA::HTMLDOMParser->new(indent => 0);
   	$dom->parse(\$str,DA::Unicode::internal_charset());

	# リンク書き換え処理
	# BASIC 認証付加する場合は必ず filter_links が処理される。
    $dom->filter_target(target => "_blank") if ($filter->{target} eq 'on');
	if($filter->{auth} eq 'on' && $filter->{auth_user} && $filter->{auth_pass}){
    	$dom->filter_links(type => "both", url => $url);
		$dom->filter_auth($filter->{auth_user},
			$filter->{auth_pass},$filter->{auth_url});
	} elsif ($filter->{url} eq 'on') {
    	$dom->filter_links(type => "both", url => $url);
	}

	my $charset;
    if ($filter->{kanji_code} eq 'jis') {
		$charset="ISO-2022-JP";
    } elsif ($filter->{kanji_code} eq 'euc') {
		$charset='EUC-JP';
    } elsif ($filter->{kanji_code} eq 'utf8') {
		$charset="UTF-8";
    } else {
		$charset="Shift_JIS";
    }

	my $extra;
	for (my $i=1; $i<$DA::Vars::p->{max_xpath}; $i++) {
		if ($filter->{"param$i"} !~ /^\//) { next; }
		$extra=1;
	}

    my $buf;
	if ($mode ne 'frame') {
		# HTML のページ埋め込み
		my $script=$dom->filter_script(DA::Unicode::internal_charset());
		$dom->filter_events() if ($filter->{script} eq 'on');
    	my $iframe=$dom->filter_iframe() if ($filter->{iframe} eq 'on');

    	if ($filter->{param} !~ /^\// && !$extra) { 
			$filter->{param}="/html/body/"; 
		}
		if ($filter->{param} =~ /^\//) {
    		$buf.=$dom->dump({ xpath   => $filter->{param},
					  charset => DA::Unicode::internal_charset(),
					  script  => ($filter->{script} ne 'on') ? $script : '',
					  baseurl => ($filter->{url} eq 'on') ? $url : '' });
		}

		# XPATH の複数指定に対応
		for (my $i=1; $i<$DA::Vars::p->{max_xpath}; $i++) {
			if ($filter->{"param$i"} !~ /^\//) { next; }
    		$buf.=$filter->{separator} if ($buf);
			$buf.=$dom->dump({ xpath   => $filter->{"param$i"},
				  charset => DA::Unicode::internal_charset(),
				  script  => ($filter->{script} ne 'on') ? $script : '',
				  baseurl => ($filter->{url} eq 'on') ? $url : '' });
		}
    	$buf=$filter->{start}.$buf.$filter->{end};
	} else {
		# フレームキャッシュあり
		my $meta=$dom->filter_meta();

		my $exist={};
		foreach my $tag (@$meta) {
			if ($tag->{"http-equiv"} =~ /^Pragma$/i) {
				$tag->{"content"}="no-cache"; $exist->{"Pragma"}=1;
			} elsif ($tag->{"http-equiv"} =~ /^Expires$/i) {
				$tag->{"content"}="0"; $exist->{"Expires"}=1;
			} elsif ($tag->{"http-equiv"} =~ /^Cache-Control$/i) {
				$tag->{"content"}="no-cache"; $exist->{"Cache-Control"}=1;
			} elsif ($tag->{"http-equiv"} =~ /^Content-Type$/i) {
				$tag->{"content"}="text/html; charset=$charset"; 
				$exist->{"Content-Type"}=1;
			}
		}
		if (!$exist->{"Pragma"}) {
			push(@{$meta},{ "http-equiv" => "Pragma", "content"=>"no-cache"});
		}
		if (!$exist->{"Expires"}) {
			push(@{$meta},{ "http-equiv" => "Expires", "content"=>"0"});
		}
		if (!$exist->{"Cache-Control"}) {
			push(@{$meta},{ "http-equiv" => "Expires", "content"=>"no-cache"});
		}
		if (!$exist->{"Content-Type"}) {
			push(@{$meta},{ "http-equiv" => "Content-Type", 
				"content"=>"text/html; charset=$charset"});
		}

		my $style=$dom->filter_style(DA::Unicode::internal_charset());
		my $script=$dom->filter_script(DA::Unicode::internal_charset());
		$dom->filter_events() if ($filter->{script} eq 'on');
    	my $iframe=$dom->filter_iframe() if ($filter->{iframe} eq 'on');

    	my $body;
    	if ($filter->{param} !~ /^\// && !$extra) { 
			$filter->{param}="/html/body/";
		}
		my $meta_use=1;
		if ($filter->{param} =~ /^\//) {
    		$body=$dom->dump({ xpath   => $filter->{param},
					  charset => DA::Unicode::internal_charset(),
		 			  script  => ($filter->{script} ne 'on') ? $script : '',
		 			  style   => $style,
					  baseurl => ($filter->{url} eq 'on') ? $url : '',
				      meta    => (!$meta_use) ? $meta : undef });
			$meta_use=1;
		}

		# XPATH の複数指定に対応
		for (my $i=1; $i<$DA::Vars::p->{max_xpath}; $i++) {
			if ($filter->{"param$i"} !~ /^\//) { next; }
    		$body.=$filter->{separator} if ($body);
			$body.=$dom->dump({ xpath   => $filter->{"param$i"},
				  charset => DA::Unicode::internal_charset(),
		 		  script  => ($filter->{script} ne 'on') ? $script : '',
		 		  style   => $style,
				  baseurl => ($filter->{url} eq 'on') ? $url : '',
				  meta    => (!$meta_use) ? $meta : undef });
		}
    	$body=$filter->{start}.$body.$filter->{end};

        $buf="<html><title>Frame Buffer</title>\n"
        ."<meta http-equiv=\"Pragma\" content=\"no-cache\">\n"
        ."<meta http-equiv=\"Expires\" content=\"0\">\n"
        ."<meta http-equiv=\"Cache-Control\" content=\"no-cache\">\n"
        ."<meta http-equiv=\"Content-Type\" content=\"text/html; "
        ."charset=$charset\">\n";

		if ($filter->{param}) {
			$buf.="<body bgcolor=#FFFFFF>".$body."</body></html>";
		} else {
			$buf.=$body."</html>";
		}
	}
	if ($filter->{replace} eq 'on') {
    	$buf=DA::Portal::replace_reserve($session,$buf,$num,$resv);
	}

	#===========================================
	#     Custom
	#===========================================
	DA::Custom::portlet_filter($session,\$buf,
		{ num => $num, url => $url });

	# インラインフレームの場合のみオリジナルの文字コードに変換
	if ($mode eq 'frame') {
		$buf=DA::Charset::convert(\$buf,DA::Unicode::internal_charset(),$charset);
	}

	return ($buf);
}

sub put_header {
	my ($session,$buf,$num,$resv)=@_;
	my ($header,$footer)=DA::Portal::get_header($session,$num,$resv);
    if ($header || $buf ||  $footer) {
        $header ="\n<!-- Call No.$num Start -->\n" . $header;
        $footer.="\n<!-- Call No.$num End   -->\n";
    }
	$buf=$header . $buf . $footer;
	return ($buf);
}

sub get_header {
	my ($session,$num,$resv)=@_;
	my $files={};
	$files->{header}="$DA::Vars::p->{data_dir}/external/$num/header.dat";
	$files->{footer}="$DA::Vars::p->{data_dir}/external/$num/footer.dat";

	my ($header,$footer);
    if (DA::Unicode::file_exist("$files->{header}")) {
        $header=DA::Unicode::file_read("$files->{header}");
    }
    if (DA::Unicode::file_exist("$files->{footer}")) {
        $footer=DA::Unicode::file_read("$files->{footer}");
    }
    $header=DA::Portal::replace_reserve($session,$header,$num,$resv);
    $footer=DA::Portal::replace_reserve($session,$footer,$num,$resv);
	return ($header,$footer);
}

sub make_req {
	my ($session,$pr,$sso,$jar,$hidden,$query)=@_;

    # SSL Proxy での DNS lookup 対応
    # my $url=DA::Portal::proxy_lookup($pr->{url});
    my $url=$pr->{url};

    my %count;
    my $params={};
    for (my $i=1; $i<10; $i++) {
    	my $key=$pr->{"key$i"};
       	if ($key eq '') { next; }
       	my $value=$pr->{"value$i"};

		# INSUITE 側の定義で設定されている値がないフィールドには、
		# init_url の HIDDEN タグで設定されている値を使用する。
		if ($value eq '' && $hidden->{$key} ne '') { $value=$hidden->{$key}; }

		$key   = DA::CGIdef::decode($key,2,1);
		$value = DA::CGIdef::decode($value,2,1);
       	if ($pr->{kanji_code} eq 'jis') {
			$key   = DA::Charset::convert(\$key,
				DA::Unicode::internal_charset(),"ISO-2022-JP");
			$value = DA::Charset::convert(\$value,
				DA::Unicode::internal_charset(),"ISO-2022-JP");
       	} elsif ($pr->{kanji_code} eq 'sjis') {
			$key   = DA::Charset::convert(\$key,
				DA::Unicode::internal_charset(),"Shift_JIS");
			$value = DA::Charset::convert(\$value,
				DA::Unicode::internal_charset(),"Shift_JIS");
		} elsif ($pr->{kanji_code} eq 'utf8') {
			$key   = DA::Charset::convert(\$key,
				DA::Unicode::internal_charset(),"UTF-8");
			$value = DA::Charset::convert(\$value,
				DA::Unicode::internal_charset(),"UTF-8");
       	} elsif ($pr->{kanji_code} eq 'euc') {
       	}
       	if ($pr->{method} eq 'get') { $key=URI::Escape::uri_escape($key); }
       	if ($pr->{method} eq 'get') { $value=URI::Escape::uri_escape($value); }

       	$params->{$key} = $value;
		$count{$key}++;
    }
    if ($pr->{insuite}) { $params->{insuite}=$session->{user}; }

    #==========================================================
    #              -----custom----
    #==========================================================
	DA::Custom::portal_make_req($session,$pr,$query,$params);
    #==========================================================
	
	my ($url_domain,$url_param,$app_domain);
	$url_domain=$url; 
	$app_domain=$DA::Vars::p->{app_session_url}; 
	$url_domain=~s/^(http|https)\:\/\///;
	$app_domain=~s/^(http|https)\:\/\///;
    ($url_domain,$url_param)=split(/[?\/]/,$url_domain,2);

	# CSRF対策
	# csrf=on でAPサーバへのリクエストの場合だけトークンを付加する
	if( $DA::Vars::p->{csrf} eq 'on' && ($url_domain eq $app_domain) ) {
		$params->{$DA::Vars::p->{chk_key_param_name}} = DA::IS::generate_check_key_val($session->{sid});
		$count{$DA::Vars::p->{chk_key_param_name}}++;
	}

	my $get_param;
	foreach my $key (keys %$params) {
		$get_param.="$key=$params->{$key}&";
	}
    $get_param=~s/\&$//;

    if ($get_param ne '' && $pr->{method} eq 'get') { 
    	if (index($url, "?") >= 0) {
			$url.="&$get_param"; 
		} else {
			$url.="?$get_param"; 
		}
	}

    my $req;
    if ($pr->{method} eq 'get') {
    	$req = HTTP::Request::Common::GET $url;
    } else {
		# 同じ名前の引数がある場合は multipart/form-data とする
		my $multi;
		foreach my $key (keys %count) {
			if ($count{$key} > 1) { $multi=1; }
		}
		if (!$multi) {
    		$req=HTTP::Request::Common::POST $url, [ %{$params} ];
       		$req->content_type('application/x-www-form-urlencoded');
		} else {
    		$req=HTTP::Request::Common::POST $url, 
				Content_Type => 'form-data', Content => [ %{$params} ];
		}
    }
	$req->{num}=$pr->{num};
	if ($sso->{basic_user} && $sso->{basic_pass}) {
		$sso->{basic_user}=~s/\:/\%3A/g;
		$req->authorization_basic($sso->{basic_user},$sso->{basic_pass});
    }

	# ブラウザの Cookie を継承 (同一ドメインのみ取得可能)
	# call_cookie.dat で継承するCookieを制限する


	my ($deny,$call_cookie);
	if ($url_domain eq $app_domain) {
		$deny=0;
	} else {
		$call_cookie=DA::IS::get_sys_custom($session,'call_cookie');
		$deny=($call_cookie->{DEFAULT} eq 'deny') ? 1 : 0;
		foreach my $key (keys %$call_cookie) {
			if ($call_cookie->{$key} ne $url_domain) {
				delete $call_cookie->{$key};
			}
		}
	}

   	my $req_header;
	my $cookie=DA::CGIdef::get_cookie();
	foreach my $key (keys %$cookie) {
		if ($deny eq 1) {
			if (!$call_cookie->{$key}) { next; }
		} else {
			if ($call_cookie->{$key}) { next; }
		}
		my $cookie_value = URI::Escape::uri_escape($cookie->{$key}->{value});
   		$req_header.=($req_header ? "; " : "")."$key=$cookie_value";
		if (!$jar) { next; }
       	$jar->set_cookie(
           	0,
           	$key,
           	$cookie->{$key}->{value},
           	$cookie->{$key}->{path},
           	$cookie->{$key}->{domain},
           	undef,
           	'path_spec',
           	$cookie->{$key}->{secure} ? 1 : 0,
           	undef,
			0,
           	{ Comment => "Set by INSUITE" }
       	);
   	}
   	$req->header("Cookie" => $req_header);
   	
   	#================================================================
    #  New CBP for SYOKKI
    #================================================================
    DA::Custom::custom_req_header($session, $pr, $sso, $req, $req_header);
    #================================================================

	# Simple Sign On で取得した Cookie をセットする
	if ($jar) { $jar->add_cookie_header($req); }

    # 呼び出し元の環境変数 (HTTP_*) を引き渡す
    if (-f "$DA::Vars::p->{custom_dir}/call_env.dat") {
    	DA::System::file_open(\*IN,"$DA::Vars::p->{custom_dir}/call_env.dat");
       	while (my $line=<IN>) {
       		chomp($line);
       		if ($line=~/^\#/) { next; }
       		$line=~tr/[a-z]/[A-Z]/;
       		$line=~s/^\s+//; $line=~s/\s+$//;
       		if ($line !~ /^HTTP_/) { next; }
       		my $target=$line; $target=~s/^HTTP_//;
       		$req->header($target => $ENV{"$line"});
       	}
       	close(IN);
    }

	return ($req);
}

sub get_cookie_tag {
	my ($session,$sso,$file)=@_;

	if (!$sso->{num}) { return; }

	my ($cookie,$result);
	my ($ua,$jar)=DA::Portal::make_ua($session,$sso,$file);

	# 保存した Cookie の読み込み
	my $cookie_file="$session->{temp_dir}/cookie.$sso->{num}.$session->{sid}";
	if (!$file && -f $cookie_file) {
		DA::System::file_open(\*IN,"$cookie_file");
		while (my $line=<IN>) { $cookie.=$line; }
		close(IN);
	}
	if ($cookie) {
		# 保存した Cookie を適用
		foreach my $line (split(/\n/,$cookie)) {
			my $cookie_data=DA::Portal::split_lwp_cookie($line);
    		$jar->set_cookie(
      				0,
      				$cookie_data->{key},
      				$cookie_data->{$cookie_data->{key}},
      				$cookie_data->{path},
      				$cookie_data->{domain},
     				undef,
      				'path_spec',
      				$cookie_data->{secure} ? 1 : 0,
      				undef,
      				$cookie_data->{discard} ? 0 : 0,
      				{ Comment => "Set by INSUITE" }
    		);
		}
                my $keep_cookie_domain = $DA::Vars::p->{"keep_cookie_domain"} eq "on" ? 1 : 0;
		$cookie=~s/Set-Cookie(\d)?/Set-Cookie/g;
		$cookie=~s/\"//g; $cookie=~s/\n$//;
		$cookie=~s/domain=(.*);//g unless ($keep_cookie_domain);
		my $tag;
		if ($sso->{agent_url}) {
			my $key="INSUITE Enterprise";
			my $cipher=new Crypt::CBC($key,'Blowfish');
                        foreach my $line ( split(/\n/,$cookie) ){
				next if ( $line =~ /^#LWP-Cookies/i );
                                $line =~ /Set-Cookie:\s+(.*?)=.*/;
                                unless ( DA::CGIdef::get_cookie($1, 1) ){
					my $ciphertext=$cipher->encrypt_hex($line);
					$tag .= "<img src=\"$sso->{agent_url}?cookie=$ciphertext\" "
			 . "border=0 width=1 height=1>";
				}
			}
		}
		return ($ua,$jar,$cookie,$tag);
	}

	my $hidden={};
	if ($sso->{init_url} ne '') {
		my %pr=%$sso;
		   $pr{url}=$sso->{init_url}; $pr{method}='get';
		my $req=DA::Portal::make_req($session,\%pr,$sso,$jar);
		my $res=$ua->request($req);
		DA::Portal::set_proxy_env($session,$ua,$sso->{init_url});
		$cookie.=$jar->as_string(0);

		if ($sso->{hidden_over}) {
			# FORM の HIDDEN タグを $hidden に抜き出す
			my $r_buf=DA::Charset::convert_to(\$res->content,
					DA::Unicode::internal_charset());
			my $dom=DA::HTMLDOMParser->new(indent => 0);
			$dom->parse(\$r_buf, DA::Unicode::internal_charset());
	 		my @forms=$dom->extract_forms(DA::Unicode::internal_charset());
			foreach my $form (@forms) {
				foreach my $key (keys %{$form->{params}}) {
					if ($key eq '' || $form->{params}->{$key} eq '') { next; }
					$hidden->{$key}=$form->{params}->{$key};
				}
			}
		}
	}
	if ($sso->{login_url} ne '') {
		my %temp=%$sso;
		   $temp{url}=$sso->{login_url};
		my $req=DA::Portal::make_req($session,\%temp,$sso,$jar,$hidden);
		DA::Portal::set_proxy_env($session,$ua,$sso->{login_url});
		my $res=$ua->request($req);
		$cookie.=$jar->as_string(0);

		$result=DA::Charset::convert_to(\$res->content,
			DA::Unicode::internal_charset());

		# $sso->{sso_view}=$pr->{num} が設定されていれば、ログイン実行結果に
		# filter を適用する (FRAME タグを無視するオプションの問題あり)
		if ($sso->{sso_view}) {
			my $url=($res->previous) ? $res->base : $sso->{login_url};
			my $filter=DA::Portal::get_filter($sso->{sso_view});
	    		$filter->{auth_user}= $sso->{basic_user};
	    		$filter->{auth_pass}= $sso->{basic_pass};
	    		$filter->{auth_url} = $sso->{login_url};
	    		$filter->{kanji_code}=$sso->{kanji_code};
			# ログイン後のページに対しては XPATH は無効にする
			foreach my $key (keys %$filter) {
				if ($key =~ /^param/) { delete $filter->{$key}; }
			}
			my $mode=($sso->{frame}) ? 'frame' : 'html';
		 	$result=DA::Portal::filter_run($session,$filter,
		 			$result,$sso->{sso_view},$url,$mode);
		}
	}

	my $tag;
	if (!$file && $cookie) {
		# ログイン処理で取得した Cookie を保存
		DA::System::file_open(\*OUT,"> $cookie_file");
		foreach my $line (split(/\n/,$cookie)) { print OUT $line . "\n"; }
		close(OUT);

                my $keep_cookie_domain = $DA::Vars::p->{"keep_cookie_domain"} eq "on" ? 1 : 0;
		$cookie=~s/Set-Cookie(\d)?/Set-Cookie/g;
		$cookie=~s/\"//g; $cookie=~s/\n$//;
		$cookie=~s/domain=(.*);//g unless ($keep_cookie_domain);

		if ($sso->{agent_url}) {
			my $key="INSUITE Enterprise";
			my $cipher=new Crypt::CBC($key,'Blowfish');
                        foreach my $line ( split(/\n/,$cookie) ){
				my $ciphertext=$cipher->encrypt_hex($line);
				$tag .= "<img src=\"$sso->{agent_url}?cookie=$ciphertext\" "
			 . "border=0 width=1 height=1>";
			}
		}
	}

	return ($ua,$jar,$cookie,$tag,$result);
}

sub get_external_param {
	my ($session,$num,$mid,$replace,$resv)=@_;

	my $table1="is_program";
	my $table2="is_params_p";
	my $table3="is_params_";

	if (!$num) {
		my $pr={};
    	$pr->{method}="get"; 
		$pr->{timeout}="5"; 
		$pr->{kanji_code}="sjis";
		$pr->{height}="400";
    	$pr->{cache_embed}="1"; 
    	$pr->{frame}="0";
		$pr->{portal_count}="0";
		$pr->{menubar}="1";
		$pr->{toolbar}="1";
		$pr->{locationbar}="1";
		$pr->{statusbar}="1";
		$pr->{win_x}="0";
		$pr->{win_y}="0";
		$pr->{refresh_time}="0";
		$pr->{cid}="0";
		return($pr); 
	}

	my $sql="SELECT * FROM $table1 WHERE num=?";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,int($num),3); $sth->execute();
    my ($pr)=$sth->fetchrow_hashref('NAME_lc'); $sth->finish();
    foreach my $key (keys %{$pr}) {
        $pr->{$key}=~s/\s+$//;
    }

    $pr->{method}="get" 		if (!$pr->{method});
    $pr->{timeout}="5" 			if (!$pr->{timeout});
    $pr->{kanji_code}="sjis" 	if (!$pr->{kanji_code});
	$pr->{height}="400" 		if (!$pr->{height});
    $pr->{frame}="0" 			if (!$pr->{frame});
	$pr->{portal_count}="0"		if ($pr->{portal_count} eq "");
	$pr->{menubar}="1"			if ($pr->{menubar} eq "");
	$pr->{toolbar}="1"			if ($pr->{toolbar} eq "");
	$pr->{locationbar}="1"		if ($pr->{locationbar} eq "");
	$pr->{statusbar}="1"		if ($pr->{statusbar} eq "");
	$pr->{win_x}="0"			if ($pr->{win_x} eq "");
	$pr->{win_y}="0"			if ($pr->{win_y} eq "");
	$pr->{refresh_time}="0"		if ($pr->{refresh_time} eq "");
	$pr->{cid}="0"              if ($pr->{cid} eq "");

	if (!$pr->{num}) { return($pr); }

    # InterBrain を経由した場合の対応 (インラインフレームおよびリンク行形式の場合のみ)
	if ($replace ne 'off' && $ENV{'HTTP_X_VIA_INTERBRAIN'}) {
		if (($pr->{frame} eq 1 && $pr->{cache_frame} ne 1) || $pr->{style} eq 1) {
			$pr->{url} =~ s/^\Q$DA::Vars::p->{app_session_url}\E/$ENV{'HTTP_X_VIA_INTERBRAIN'}/;
		}
	}

    my $c=0;
    my %change_index;
    foreach my $key (split(//,$pr->{param_change})) {
        $change_index{$c}=$key;
        $c++;
    }

	my ($pid,$key,$value,$label);
	my $col_key = $DA::Vars::p->{MYSQL} ? "`key`" : "key";
    $sql="SELECT pid,$col_key,long_value,label FROM $table2 WHERE num=?";
    $sth=$session->{dbh}->prepare($sql);
    $sth->bind_param(1,int($num),3); $sth->execute();
    while (($pid,$key,$value,$label)=$sth->fetchrow) {
        $key=~s/\s+$//; $value=~s/\s+$//; $label=~s/\s+$//;
        $key=DA::CGIdef::encode($key,3,1,'euc');
        $value=DA::CGIdef::encode($value,3,1,'euc');
        $label=DA::CGIdef::encode($label,3,1,'euc');
		# パラメータ値内の予約語を変換
		if ($replace ne 'off') {
			$value=DA::Portal::replace_reserve($session,$value,$num,$resv);
		}
        if ($pid eq 0) {
            $pr->{$key}=$value;
        } else {
            $pr->{"key$pid"}=$key;
            $pr->{"value$pid"}=$value;
            $pr->{"label$pid"}=$label;
        }
    }
    $sth->finish();

   if ($mid eq '') { return($pr); }

    my $table_name=$table3 . DA::CGIdef::get_last_n($mid);
    $sql="SELECT pid,$col_key,long_value FROM $table_name WHERE num=? AND mid=?";
    $sth=$session->{dbh}->prepare($sql);
    $sth->bind_param(1,int($num),3);
    $sth->bind_param(2,int($mid),3);
    $sth->execute();
    while (($pid,$key,$value)=$sth->fetchrow) {
        $key=~s/\s+$//; $value=~s/\s+$//;
        $key=DA::CGIdef::encode($key,3,1,'euc');
        $value=DA::CGIdef::encode($value,3,1,'euc');
        if ($value eq '') { next; }
        if (!$change_index{$pid}) { next; }
        if ($pid eq 0) {
            $pr->{$key}=$value;
        } else {
            $pr->{"value$pid"}=$value;
        }
    }
    $sth->finish();

	# リンク形式またはインラインフレームでない場合はブラウザログインＯＦＦ
	# if ($pr->{frame} ne 1 && $pr->{style} ne 1) { $pr->{sso_login}=0; }

    #===========================================
    #     Custom
    #===========================================
    DA::Custom::portlet_param($session,$pr,$mid);

	return ($pr);
}

sub get_sso_param {
	my ($session,$num,$mid,$replace,$resv)=@_;

	if (!$num) { return; }

	my $table1="is_sso";
	my $table2="is_sso_params_p";
	my $table3="is_sso_params_";

	my $sql="SELECT * FROM $table1 WHERE num=?";
    my $sth=$session->{dbh}->prepare($sql);
	   $sth->bind_param(1,int($num),3); $sth->execute();
    my ($sso)=$sth->fetchrow_hashref('NAME_lc'); $sth->finish();
    foreach my $key (keys %{$sso}) { $sso->{$key}=~s/\s+$//; }
	if (!$sso->{num}) { return($sso); }
	my $col_key = $DA::Vars::p->{MYSQL} ? "`key`" : "key";
    $sql="SELECT pid,$col_key,long_value,label FROM $table2 WHERE num=?";
    $sth=$session->{dbh}->prepare($sql);
	$sth->bind_param(1,int($num),3); $sth->execute();
    while (my ($pid,$key,$value,$label)=$sth->fetchrow) {
        $key=~s/\s+$//; $value=~s/\s+$//; $label=~s/\s+$//;
        $key=DA::CGIdef::encode($key,3,1,'euc');
		if ($key !~ /^(basic_user|basic_pass)$/) {
        	$value=DA::CGIdef::encode($value,3,1,'euc');
		}
        $label=DA::CGIdef::encode($label,3,1,'euc');
		# パラメータ値内の予約語を変換
		if ($replace ne 'off') {
			$value=DA::Portal::replace_reserve($session,$value,$num,$resv);
		}
        if ($pid eq 0) {
            $sso->{$key}=$value;
        } else {
            $sso->{"key$pid"}=$key;
            $sso->{"value$pid"}=$value;
            $sso->{"label$pid"}=$label;
        }
    }
    $sth->finish();

	if ($mid eq '') { return($sso); }

    my $c=0;
    my %change_index;
    foreach my $key (split(//,$sso->{param_change})) {
        $change_index{$c}=$key;
        $c++;
    }

    my $table_name=DA::Valid::check_tablename($table3 . DA::CGIdef::get_last_n($mid));
    $sql="SELECT pid,$col_key,long_value FROM $table_name "
	."WHERE num=? AND mid=?";
    $sth=$session->{dbh}->prepare($sql);
    $sth->bind_param(1,int($num),3);
    $sth->bind_param(2,int($mid),3);
    $sth->execute();
    while (my ($pid,$key,$value)=$sth->fetchrow) {
        $key=~s/\s+$//; $value=~s/\s+$//;
        $key=DA::CGIdef::encode($key,3,1,'euc');
		# レコードがある場合は空白でも上書きさせる
		if ($key !~ /^(basic_user|basic_pass)$/) {
        	$value=DA::CGIdef::encode($value,3,1,'euc');
		}
        if ($pid eq 0) {
			if (!$sso->{basic_change} && $key=~/^(basic_user|basic_pass)$/) {
				next; 
			}
            $sso->{$key}=$value;
        } else {
        	if (!$change_index{$pid}) { next; }
            $sso->{"value$pid"}=$value;
        }
    }
    $sth->finish();

    #===========================================
    #     Custom
    #===========================================
    DA::Custom::portlet_sso_param($session,$sso,$mid);

	return ($sso);
}

sub get_req_param {
    my ($session,$pr,$sso)=@_;

	# インラインフレームの src に BASIC 認証を指定する場合は encode が必要
	# if ($pr->{frame} eq 1) {
	# 	$sso->{basic_user}=DA::CGIdef::encode($sso->{basic_user},1,1,'euc');
	# 	$sso->{basic_pass}=DA::CGIdef::encode($sso->{basic_pass},1,1,'euc');
	# }

    if ($sso->{basic_user} && $sso->{basic_pass}) {
		$sso->{basic_user}=URI::Escape::uri_escape($sso->{basic_user});
		$sso->{basic_pass}=URI::Escape::uri_escape($sso->{basic_pass});
		$pr->{url}=~s/^(http:\/\/|https:\/\/)/$1$sso->{basic_user}:$sso->{basic_pass}\@/;
	}

    my $get_param;
    for (my $i=1; $i<10; $i++) {
        my $key=$pr->{"key$i"};
        if ($key eq '') { next; }
        my $value=$pr->{"value$i"};

        if ($pr->{kanji_code} eq 'jis') {
            $value = DA::Charset::convert(\$value,
				DA::Unicode::internal_charset(),"ISO-2022-JP");
        } elsif ($pr->{kanji_code} eq 'sjis') {
            $value = DA::Charset::convert(\$value,
				DA::Unicode::internal_charset(),"Shift_JIS");
        } elsif ($pr->{kanji_code} eq 'utf8') {
            $value = DA::Charset::convert(\$value,
				DA::Unicode::internal_charset(),"UTF-8");
        } elsif ($pr->{kanji_code} eq 'euc') {
        }
        $key = DA::CGIdef::decode($key,2,1);
        if ($pr->{method} eq 'get') { $key=URI::Escape::uri_escape($key); }
        $value = DA::CGIdef::decode($value,2,1);
        if ($pr->{method} eq 'get') { $value=URI::Escape::uri_escape($value); }
        $get_param .= "$key=$value&";
    }
    if ($pr->{insuite}) {
        $get_param.="insuite=$session->{user}&";
    }
    $get_param=~s/\&$//;
    if ($get_param ne '' && $pr->{method} eq 'get') {
        if ($pr->{url} =~ /\?/) {
            $pr->{url}.="\&$get_param";
        } else {
            $pr->{url}.="\?$get_param";
        }
    }

    return ($pr->{url});
}

sub replace_reserve {
	my ($session,$buf,$num,$resv)=@_;

	# $buf=~s/(?:.*)?<!--(?:\s+)__insuite_parse_start__(?:\s+)-->//s;
	# $buf=~s/<!--(?:\s+)__insuite_parse_end__(?:\s+)-->(?:.*)?//s;

	# 複数の予約語セットに対応
	my $tranc;
	my $start='<!--(?:\s+)?__insuite_parse_start__(?:\s+)?-->(?:[\r\n])?';
	my $end='<!--(?:\s+)?__insuite_parse_end__(?:\s+)?-->(?:[\r\n])?';
	if ($buf=~/$start/s) {
		foreach my $line (split(/$start/,$buf)) {
    		if ($line !~ /$end/) { next; }
    		$line =~ s/$end(.*)//s;
    		$tranc.=$line;
		}
	} else {
		$tranc=$buf;
	}

	# 予約語の使用許可フラグを追加
	my $conf={};
	if (ref($resv) eq 'HASH') {
		$conf=$resv;
	} else {
		$conf=DA::IS::get_sys_custom($session,"portlet_reserve");
	}
	if ($conf->{__insuite_session_key__} eq 'on') {
		$tranc=~s/__insuite_session_key__/$session->{sid}/g;
	}
	if ($conf->{__insuite_session_user__} eq 'on') {
		$tranc=~s/__insuite_session_user__/$session->{user}/g;
	}
	if ($conf->{__insuite_session_user_id__} eq 'on') {
		$tranc=~s/__insuite_session_user_id__/$session->{user_id}/g;
	}
	if ($conf->{__insuite_session_name__} eq 'on') {
		$tranc=~s/__insuite_session_name__/$session->{name}/g;
	}
	if ($conf->{__insuite_session_primary__} eq 'on') {
		$tranc=~s/__insuite_session_primary__/$session->{primary}/g;
	}
	if ($conf->{__insuite_session_primary_gname__} eq 'on') {
		$tranc=~s/__insuite_session_primary_gname__/$session->{primary_gname}/g;
	}
	if ($conf->{__insuite_app_session_url__} eq 'on') {
		$tranc=~s/__insuite_app_session_url__/$DA::Vars::p->{app_session_url}/g;
	}
	if ($conf->{__insuite_portlet_num__} eq 'on') {
		$tranc=~s/__insuite_portlet_num__/$num/g;
	}
	if ($conf->{__insuite_session_user_lang__} eq 'on') {
		$tranc=~s/__insuite_session_user_lang__/$session->{user_lang}/g;
	}
	if ($conf->{__insuite_group_portal_num__} eq 'on') {
		if ($session->{space} >= $DA::Vars::p->{top_gid}) {
			$tranc=~s/__insuite_group_portal_num__/$session->{space}/g;
		} else {
			$tranc=~s/__insuite_group_portal_num__/$session->{user}/g;
		}
	}
	if ($conf->{__insuite_session_password__} eq 'on') {
		if ($tranc=~/__insuite_session_password__/) {
			my $password=$session->get_passwd();
			$tranc=~s/__insuite_session_password__/$password/g;
		}
	}
	
	#===========================================
	#   Custom
	#===========================================
	DA::Custom::custom_portal_reserve_word($session,\$tranc);
	#===========================================

	return ($tranc);
}

sub update_view_count {
    my ($session,$num)=@_;
    DA::Session::trans_init($session);
    eval {
        my $sql="SELECT view_count FROM is_program WHERE num=? FOR UPDATE";
        my $sth=$session->{dbh}->prepare($sql);
		   $sth->bind_param(1,int($num),3); $sth->execute();
        my $count=$sth->fetchrow; $sth->finish;
        $count=$count+1;
        $sql="UPDATE is_program SET view_count=? WHERE num=?";
        $sth=$session->{dbh}->prepare($sql);
        $sth->bind_param(1,$count,3);
        $sth->bind_param(2,int($num),3);
        $sth->execute();
    };
    if(!DA::Session::exception($session)){
        DA::Error::system_error($session);
    }
}

sub split_lwp_cookie {
	my ($cookie)=@_;
	my $data={};
	chomp($cookie);
	foreach my $item (split(/;/,$cookie)) {
		$item=~s/^\s+//; $item=~s/\s+$//;
		if ($item=~/^Set-Cookie(?:\d+)?:(?:\s+)(.*)/) {
			my ($key,$value)=split(/\=/,$1,2);
			$key=~s/^\s+//; $key=~s/\s+$//;
			$value=~s/^\s+//; $value=~s/\s+$//;
			$value=~s/^\"//; $value=~s/\"$//;
			$data->{key}=$key;
			$data->{$key}=$value;
			next;
		} elsif ($item=~/\=/) {
			my ($key,$value)=split(/\=/,$item,2);
			$key=~s/^\s+//; $key=~s/\s+$//;
			$value=~s/^\s+//; $value=~s/\s+$//;
			$value=~s/^\"//; $value=~s/\"$//;
			$data->{$key}=$value;
		} elsif ($item eq 'discard') {
			$data->{discard}=1;
		} elsif ($item eq 'path_spec') {
			$data->{path_spec}=1;
		} elsif ($item eq 'secure') {
			$data->{secure}=1;
		}
	}
	return ($data);
}

sub get_decrypt_javascript {
my ($session) = @_;
my $prefx = DA::IS::get_uri_prefix();
my $decrypt_javascript=<<"EOF";
<SCRIPT type="text/javascript" src="/html/base64.js?$prefx"></SCRIPT>
<SCRIPT type="text/javascript" src="/html/Tea_JS.js?$prefx"></SCRIPT>
<SCRIPT type="text/javascript" src="/js/portal/decrypt.js?$prefx"></SCRIPT>
EOF

return $decrypt_javascript;

}

sub get_wait_html {
my ($session,$pr,$sso)=@_;

my $target="target=_top" if ($pr->{frame} ne 1);
my ($hidden_tag,$multi,$submit,$charset)=
	DA::Portal::get_hidden_tag($session,$pr);
if ($pr->{insuite}) {
    $hidden_tag.=DA::Portal::encode_hidden_tag($session,
		"insuite",$session->{user},1);
}

# ログイン処理が不要な場合はターゲットＵＲＬに直接ジャンプさせる。
# またログイン処理がある場合は、ログインが終了するより前にターゲット
# ＵＲＬへのリクエストが実行されないように wait 処理を追加

my ($onload,$submit_button1,$submit_button2,$submit_button3);
if ($sso->{login_url} eq '') {
	if ($submit) {
		# name=submit の input タグがある場合
    	$onload="onLoad=\"document.forms[0].insuite_sso.click();\"";
    	$submit_button1="<input type=submit name=insuite_sso value='Go'>";
	} else {
    	$onload="onLoad=\"document.forms[0].submit();\"";
    	$submit_button1="<input type=submit name=insuite_sso value='Go'>";
	}
} else {
	if ($submit) {
		# name=submit の input タグがある場合
    	$submit_button1="<input type=button name=insuite_sso value='Step1' "
    	."onClick='submitSSO();'>";
    	$submit_button2="<input type=submit name=insuite_jmp value='Step2'>";
    	$submit_button3="document.forms['0'].insuite_jmp.click()";
		$onload="onLoad=\"document.forms[0].insuite_sso.click();\"";
	} else {
    	$submit_button1="<input type=button name=insuite_sso value='Step1' "
    	."onClick='submitSSO();'>";
    	$submit_button2="<input type=submit name=insuite_jmp value='Step2'>";
    	$submit_button3="document.forms[0].submit()";
		$onload="onLoad=\"document.forms[0].insuite_sso.click();\"";
	}
}
my $portal = DA::IS::get_master($session, 'portal');
my $wait_sso_time = (exists $portal->{wait_sso_time}) 
		? $portal->{wait_sso_time} : 2;
$wait_sso_time = int($wait_sso_time) * 1000;
my $decrypt_javascript = DA::Portal::get_decrypt_javascript($session);

my $buf=<<buf_end;
<html><head><title>BUFFER</title>
<link rel="stylesheet" type="text/css" href="$session->{char_style_rdir}/$session->{char_style}.css">
<STYLE type=text/css><!--
    BODY, TD { color: black; }
//--></STYLE>
$decrypt_javascript
<SCRIPT LANGUAGE="JavaScript"><!--
function submitSSO () {
    setTimeout("$submit_button3",$wait_sso_time);
}
//--></SCRIPT>
</head>
<body bgcolor=#FFFFFF $onload><center>
<table border=0 width=100% height=100%><tr><td align=center valign=top>
<br><br><H3>@{[t_('ログイン処理中・・・・・')]}</H3><br>
@{[t_('しばらくお待ちください。')]}<br>
<img src=$session->{img_rdir}/popy_wait.gif border=0 width=133 height=88>
</td></tr></table>
<p><br>
<form $multi action=$pr->{url} method=$pr->{method} $target>
$hidden_tag
$submit_button1
$submit_button2
</form>
<SCRIPT LANGUAGE="JavaScript"><!--
decrypt_form(0, '@{[js_esc_($DA::Vars::p->{session_key})]}');
//--></SCRIPT>
</center>
</body></html>
buf_end

DA::Custom::rewrite_portlet_wait_html($session, $pr, $sso, $portal, \$buf);

return return wantarray ? ($buf,$charset) : $buf;

}

sub encode_hidden_tag {
	my ($session, $key, $value, $encrypt) = @_;
	# $encrypt = 0;
	if ($encrypt) {
		# GenKeyは64bit未対応するために、暗号化方式がCrypt::Tea_JSに変更します。
		eval "use Crypt::Tea_JS();";
		my $crypt_key = exists $session->{key} ? $session->{key} : "key";
		$value = MIME::Base64::encode_base64(Crypt::Tea_JS::encrypt($value,$crypt_key));
		$value =~ s/\s+$//o;
		$value = '=?US-ASCII?B?' . $value . '?=';
	} else {
		$value = DA::Unicode::html_escape($value);
	}
	return "<input type=\"hidden\" name=\"$key\" value=\"$value\">\n";
}

sub get_hidden_tag {
	my ($session,$sso)=@_;

	# INPUT タグを継承する場合 INPUT タグを $hidden に抜き出す
	# ただし、Cookie と MAGIC ID を比較するパターンでは無意味
	my $hidden={};
	if ($sso->{init_url} && $sso->{hidden_over}) {
    	my ($ua,$jar)=DA::Portal::make_ua($session,$sso);
		my %pr=%$sso;
		   $pr{url}=$sso->{init_url}; $pr{method}='get';
    	my $init_req=DA::Portal::make_req($session,\%pr,$sso);
		DA::Portal::set_proxy_env($session,$ua,$sso->{init_url});
    	my $init_res=$ua->request($init_req);
    	my $r_buf=DA::Charset::convert_to(\$init_res->content,
			DA::Unicode::internal_charset());
    	my $dom=DA::HTMLDOMParser->new(indent => 0);
    	   $dom->parse(\$r_buf, DA::Unicode::internal_charset());
    	my @forms=$dom->extract_forms(DA::Unicode::internal_charset());
    	foreach my $form (@forms) {
        	foreach my $key (keys %{$form->{params}}) {
            	if ($key eq '' || $form->{params}->{$key} eq '') { next; }
            	$hidden->{$key}=$form->{params}->{$key};
        	}
    	}
	}

	my %count;
	my $hidden_tag;
	my $submit_tag;
	my $submit;
	my $charset;
	if ($sso->{kanji_code} eq 'jis') {
    	$charset = "ISO-2022-JP";
	} elsif ($sso->{kanji_code} eq 'utf8') {
    	$charset = "UTF-8";
	} elsif ($sso->{kanji_code} eq 'euc') {
    	$charset = "EUC-JP";
	} else {
    	$charset = "Shift_JIS";
	}
	# フォーム内に submit という名前の input タグがある場合は 1 を返す
	for (my $i=1; $i<10; $i++) {
    	my $key     = $sso->{"key$i"};
    	my $value   = $sso->{"value$i"};
    	my $encrypt = 0;
    	if ($key eq '') { next; }
    	if ($value eq '' && $hidden->{$key} ne '') { $value=$hidden->{$key}; }
    	unless (DA::CGIdef::iskanji($value)) {
        	$value = DA::Charset::convert(\$value,DA::Unicode::internal_charset(),$charset);
        	$encrypt = 1;
    	}
    	$key   = DA::CGIdef::decode($key,2,1);
    	$value = DA::CGIdef::decode($value,2,1);
    	if ($key =~ /^submit$/i) {
			$submit=1;
        	$submit_tag .= DA::Portal::encode_hidden_tag($session, $key, $value, 0);
    	} else {
        	$hidden_tag .= DA::Portal::encode_hidden_tag($session, $key, $value, $encrypt);
    	}
    	$count{$key}++;
	}
	# キー名が submit の引数は最後に移動する。
	$hidden_tag.=$submit_tag;

	# 同じ名前の引数がある場合は multipart/form-data とする
	my $multi;
	foreach my $key (keys %count) {
   		if ($count{$key} > 1) { $multi=1; }
	}
	if ($multi) { $multi="ENCTYPE=\"multipart/form-data\""; }

	return ($hidden_tag,$multi,$submit,$charset);
}

sub set_ssl_proxy {
	my ($url)=@_;
    if ($url=~/^(http:\/\/|https:\/\/)?([^\:\@]+):([^\:\@]+)\@(.*)/) {
        $ENV{HTTPS_PROXY}  = $1 . $4;
        $ENV{HTTPS_PROXY_USERNAME} = $2;
        $ENV{HTTPS_PROXY_PASSWORD} = $3;
    } else {
        $ENV{HTTPS_PROXY}=$url;
    }
}

sub set_proxy_env {
	my ($session,$ua,$url)=@_;
    $ENV{HTTPS_PROXY} = '';
    $ENV{HTTPS_PROXY_USERNAME} = '';
    $ENV{HTTPS_PROXY_PASSWORD} = '';
	my $proxy=DA::IS::get_proxy($session,$url);
    if ($proxy) {
		my ($protocol,$server)=DA::CGIdef::split_url($url);
        if ($protocol eq 'https') {
            DA::Portal::set_ssl_proxy($proxy);
        } else {
            $ua->proxy('http' => $proxy);
        }
    }
}

sub get_upper_port {
    my ($session,$gid,$g_port,$port_conf)=@_;
	my $group_table=DA::Valid::check_tablename(DA::IS::get_group_table($session));
    my $sql="SELECT parent,name,alpha,type FROM $group_table WHERE gid=?";
    my $sth=$session->{dbh}->prepare($sql); 
	   $sth->bind_param(1,int($gid),3); $sth->execute();
    my ($parent,$name,$alpha,$type)=$sth->fetchrow; $sth->finish;
    $name=DA::IS::check_view_name($session,$name,$alpha);
    if ($type eq 4) { $name=DA::IS::pre_suspend($session).$name; }
    my $p_port=DA::IS::get_master({ user => $gid },'portal', 2);
    if ($p_port->{right_order}) {
		my $right_order;
        foreach my $key (split(/\|/,$p_port->{right_order})) {
            if (!$key) { next; }
            if ($key eq 'none') { next; }
            if ($key =~ /^($g_port->{right_order})$/) {
                $g_port->{right_order} =~ s/(\|)?$key//;
            }
            $g_port->{must_right}->{$key}=$name;
            $right_order.=($right_order) ? "|$key" : $key;
        }
        $g_port->{right_order}=($g_port->{right_order})
                ? "$right_order|$g_port->{right_order}" : $right_order;
        $g_port->{right_order}=~s/^\|//; $g_port->{right_order}=~s/\|$//;
    }
    if ($p_port->{left_order}) {
		my $left_order;
        foreach my $key (split(/\|/,$p_port->{left_order})) {
            if (!$key) { next; }
            if ($key eq 'none') { next; }
            if ($key =~ /^($g_port->{left_order})$/) {
                $g_port->{left_order} =~ s/(\|)?$key//;
            }
            $g_port->{must_left}->{$key}=$name;
            $left_order.=($left_order) ? "|$key" : $key;
        }
        $g_port->{left_order}=($g_port->{left_order})
                ? "$left_order|$g_port->{left_order}" : $left_order;
        $g_port->{left_order}=~s/^\|//; $g_port->{left_order}=~s/\|$//;
    }
    if ($p_port->{top_order}) {
		my $top_order;
        foreach my $key (split(/\|/,$p_port->{top_order})) {
            if (!$key) { next; }
            if ($key eq 'none') { next; }
            if ($key =~ /^($g_port->{top_order})$/) {
                $g_port->{top_order} =~ s/(\|)?$key//;
            }
            $g_port->{must_top}->{$key}=$name;
            $top_order.=($top_order) ? "|$key" : $key;
        }
        $g_port->{top_order}=($g_port->{top_order})
                ? "$top_order|$g_port->{top_order}" : $top_order;
        $g_port->{top_order}=~s/^\|//; $g_port->{top_order}=~s/\|$//;
    }
    if ($p_port->{bottom_order}) {
		my $bottom_order;
        foreach my $key (split(/\|/,$p_port->{bottom_order})) {
            if (!$key) { next; }
            if ($key eq 'none') { next; }
            if ($key =~ /^($g_port->{bottom_order})$/) {
                $g_port->{bottom_order} =~ s/(\|)?$key//;
            }
            $g_port->{must_top}->{$key}=$name;
            $bottom_order.=($bottom_order) ? "|$key" : $key;
        }
        $g_port->{bottom_order}=($g_port->{bottom_order})
                ? "$bottom_order|$g_port->{bottom_order}" : $bottom_order;
        $g_port->{bottom_order}=~s/^\|//; $g_port->{bottom_order}=~s/\|$//;
    }
    if ($p_port->{i_order}) {
		my $i_order;
        foreach my $key (split(/\|/,$p_port->{i_order})) {
            if (!$key) { next; }
            if ($key eq 'none') { next; }
            if ($key =~ /^($g_port->{i_order})$/) {
                $g_port->{i_order} =~ s/(\|)?$key//;
            }
            $g_port->{must_i}->{$key}=$name;
            $i_order.=($i_order) ? "|$key" : $key;
        }
        $g_port->{i_order}=($g_port->{i_order})
                ? "$i_order|$g_port->{i_order}" : $i_order;
        $g_port->{i_order}=~s/^\|//; $g_port->{i_order}=~s/\|$//;
    }
    if ($p_port->{p_order}) {
		my $p_order;
        foreach my $key (split(/\|/,$p_port->{p_order})) {
            if (!$key) { next; }
            if ($key eq 'none') { next; }
            if ($key =~ /^($g_port->{p_order})$/) {
                $g_port->{p_order} =~ s/(\|)?$key//;
            }
            $g_port->{must_p}->{$key}=$name;
            $p_order.=($p_order) ? "|$key" : $key;
        }
        $g_port->{p_order}=($g_port->{p_order})
                ? "$p_order|$g_port->{p_order}" : $p_order;
        $g_port->{p_order}=~s/^\|//; $g_port->{p_order}=~s/\|$//;
    }
    if ($port_conf->{group_inherit} eq 'on' && $parent) {
        $g_port=DA::Portal::get_upper_port($session,$parent,$g_port,$port_conf);
    }

    return ($g_port);
}

sub merge_group_port {
	my ($session, $port_conf, $port, $frame) = @_;

	if ($session->{space} >= $DA::Vars::p->{top_gid}) {
		my $left_key   = "left_order_" . $session->{space};
		my $right_key  = "right_order_" . $session->{space};
		my $top_key    = "top_order_" . $session->{space};
		my $bottom_key = "bottom_order_" . $session->{space};

		my $g_port = DA::IS::get_master({ user => $session->{space} }, 'portal', 2);

		# Custom =================
		if ($frame ne 'tab') {
			my $custom_port = DA::Custom::arrange_portal_layout($session, $g_port, $session->{space}, {});
			if (defined $custom_port) {
				$g_port = $custom_port;
			}
		}
		#=========================

		$port->{$left_key}   = $g_port->{$left_key};
		$port->{$right_key}  = $g_port->{$right_key};
		$port->{$top_key}    = $g_port->{$top_key};
		$port->{$bottom_key} = $g_port->{$bottom_key};

		$port->{must} = $g_port->{$left_key};
		$port->{must}.= ($port->{must}) ? "|$g_port->{$right_key}" : $g_port->{$right_key};
		$port->{must}.= ($port->{must}) ? "|$g_port->{$top_key}" : $g_port->{$top_key};
		$port->{must}.= ($port->{must}) ? "|$g_port->{$bottom_key}" : $g_port->{$bottom_key};

		$port->{"space_width$session->{space}"} = $g_port->{"space_width$session->{space}"};
        $port->{"space_color$session->{space}"} = $g_port->{"space_color$session->{space}"};

    }

	return($port);
}

sub merge_upper_port {
	my ($session, $port_conf, $port) = @_;
	my $left_key   = "left_order";
	my $right_key  = "right_order";
	my $top_key    = "top_order";
	my $bottom_key = "bottom_order";

	# プライマリグループ(+上位組織)の表示必須メニューを設定
	my $g_port = {};
	$g_port = DA::Portal::get_upper_port($session, $session->{primary}, $g_port, $port_conf);

	$port->{must} = $g_port->{$left_key};
	$port->{must}.= ($port->{must}) ? "|$g_port->{$right_key}" : $g_port->{$right_key};
	$port->{must}.= ($port->{must}) ? "|$g_port->{$top_key}" : $g_port->{$top_key};
	$port->{must}.= ($port->{must}) ? "|$g_port->{$bottom_key}" : $g_port->{$bottom_key};

	$port->{must_top}    = $g_port->{must_top};
	$port->{must_bottom} = $g_port->{must_bottom};
	$port->{must_left}   = $g_port->{must_left};
	$port->{must_right}  = $g_port->{must_right};
	$port->{must_top}->{menu}    = $g_port->{$top_key};
	$port->{must_bottom}->{menu} = $g_port->{$bottom_key};
	$port->{must_left}->{menu}   = $g_port->{$left_key};
	$port->{must_right}->{menu}  = $g_port->{$right_key};

	# 表示幅は個人設定が優先
	if (!$port->{space_width}) {
		my $p_port = DA::IS::get_master({ user => $session->{primary} }, 'portal', 2);
		$port->{space_width} = $p_port->{space_width};
	}

	foreach my $key (split(/\|/, $port->{$left_key})) {
		if ($key eq '') { next; }
		$g_port->{$left_key} .= ($g_port->{$left_key}) ? "|$key" : $key;
	}
	$g_port->{$left_key} =~ s/^\|//; $g_port->{$left_key} =~ s/\|$//;

	foreach my $key (split(/\|/, $port->{$right_key})) {
		if ($key eq '') { next; }
		$g_port->{$right_key} .= ($g_port->{$right_key}) ? "|$key" : $key;
	}
	$g_port->{$right_key} =~ s/^\|//; $g_port->{$right_key} =~ s/\|$//;

	foreach my $key (split(/\|/, $port->{$top_key})) {
		if ($key eq '') { next; }
		$g_port->{$top_key} .= ($g_port->{$top_key}) ? "|$key" : $key;
	}
	$g_port->{$top_key} =~ s/^\|//; $g_port->{$top_key} =~ s/\|$//;

	foreach my $key (split(/\|/, $port->{$bottom_key})) {    #add the part of bottom
		if ($key eq '') { next; }
		$g_port->{$bottom_key} .= ($g_port->{$bottom_key}) ? "|$key" : $key;
	}
	$g_port->{$bottom_key} =~ s/^\|//; $g_port->{$bottom_key} =~ s/\|$//;

	$port->{$left_key}   = $g_port->{$left_key};
	$port->{$right_key}  = $g_port->{$right_key};
	$port->{$top_key}    = $g_port->{$top_key};
	$port->{$bottom_key} = $g_port->{$bottom_key};

	return($port);
}

sub get_custom_menu {
    my ($session,$port,$mode,$custom_menu)=@_;
    my $file_path="$DA::Vars::p->{custom_dir}/top_menu\.dat";
    if (!DA::Unicode::file_exist("$file_path")) { return; }
    my $menu;
    my @array;
    my $info={};
    my $IN=DA::Unicode::file_open("$file_path","r");
    while(defined (my $line = <$IN>)){
        chomp($line);
        if ($line eq '') { next; }
        $line =~ s/^\s+//; $line =~ s/\s+$//;
        if ($line=~/^\#/) { next; }

        if ($line=~/\:$/) {
            $line=~s/\:$//;
            $menu=$line;
            push(@array,$menu);
        } else {
            my ($key,$val)=split(/=/,$line,2);
            $key=~s/^\s+//; $key=~s/\s+$//;
            $val=~s/^\s+//; $val=~s/\s+$//;
            $info->{$menu}->{$key}=$val;
        }
    }
    close($IN);

    my $space="<img src=$session->{img_rdir}/null.gif width=5 height=21>";

    my $tag;
    my ($line1,$line2);
    my $count=1;
    foreach my $menu (@array) {

        my $i=$info->{$menu};
        my $target="target=$i->{link_target}" if ($i->{link_target});
        my $title =T_("$i->{title}") if ($i->{title});

        $i->{link_url}=~s/__insuite_session_key__/$session->{sid}/g;
        $i->{link_url}=~s/__insuite_session_user__/$session->{user}/g;
        $i->{link_url}=~s/__insuite_session_user_id__/$session->{user_id}/g;
        $i->{link_url}=~s/__insuite_session_user_lang__/$session->{user_lang}/g;
        $i->{link_url}=~s/__insuite_session_primary__/$session->{primary}/g;
        $i->{link_url}=~s/__insuite_app_session_url__/$DA::Vars::p->{app_session_url}/g;
        $i->{image_url}=~s/__insuite_session_key__/$session->{sid}/g;
        $i->{image_url}=~s/__insuite_session_user__/$session->{user}/g;
        $i->{image_url}=~s/__insuite_session_user_id__/$session->{user_id}/g;
        $i->{image_url}=~s/__insuite_session_user_lang__/$session->{user_lang}/g;
        $i->{image_url}=~s/__insuite_session_primary__/$session->{primary}/g;
        $i->{image_url}=~s/__insuite_app_session_url__/$DA::Vars::p->{app_session_url}/g;

        if ($mode eq 'small') {
            if ($title eq '') { next; }
            $tag.="<td align=center nowrap><a href=$i->{link_url} "
            ."target=$i->{link_target}>$title</a></td>"
            ."<td><img src=$session->{img_rdir}/func_obi_devider.gif "
            ."border=0 width=1 height=19 hspace=4></td>\n";
        } else {
            my $cell;
            if ($i->{image_url} ne '' && $port->{top_style} ne 3) {
                my $height="height=$i->{image_height}" if ($i->{image_height});
                my $width ="width=$i->{image_width}" if ($i->{image_width});
                $cell="<td nowrap><a href=$i->{link_url} $target>"
                ."<img src=$i->{image_url} $height $width border=0 "
                ."title=\"$title\"></a></td><td>$space</td>";
            } elsif ($title ne '') {
                $cell="<td nowrap><a href=$i->{link_url} $target>"
                ."$title</a></td><td>$space</td>";
            } else {
                next;
            }
            if ($count%2) {
                $line1.=$cell;
            } else {
                $line2.=$cell;
            }
        }
        $count++;
    }
    if ($mode eq 'small') {
        $tag.=$custom_menu;
    } else {
        if ($line1 || $line2) {
            $tag="<table border=0 cellspacing=0 cellpadding=0>"
            ."<tr><td>$space</td>$line1</tr>"
            ."<tr><td>$space</td>$line2</tr>"
            ."</table>";
        }
        if ($custom_menu && $tag) {
            $tag="<table border=0 cellspacing=0 cellpadding=0><tr>"
            ."<td>$tag</td><td nowrap>$custom_menu</td></tr></table>";
        } elsif ($custom_menu) {
            $tag=$custom_menu;
        }
    }

    return ($tag);
}

sub get_link_portlet {
    my ($session,$pr,$date,$port,$tmpl,$query,$join) = @_;
    my $num = $pr->{num};

	my $button;
    $button.=DA::Portal::get_close_button($session,$date,$port,"ex_$num");

    my $tags;
    if ($port->{close}->{$num} eq 'close') {
        $tmpl->param(
            IMG_RDIR  => $session->{img_rdir},
            TITLE_TEXT => $pr->{title},
            BUTTON    => $button,
			DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
            CONTENTS  => $tags
        );
        return ($tmpl->output);
    }
    if ($pr->{frame}) {
        if (!DA::IS::is_iframe()) { return; }
        $tags="<iframe id=\"__REFRESH_IFRAME__\" name=\"__REFRESH_DIV__\" height=\"$pr->{height}\" width=\"100%\" "
        ."src=$DA::Vars::p->{cgi_rdir}/link_portlet.cgi?iframe=1&num=$num "
        ."frameborder=0 framespacing=0 noresize scrolling=auto></iframe>";
    } else {
        $query->param(date => $date);
        $query->param(num => $num);
        $tags=&insert_div_tag(WA::CGI::call_cgi_portlet(
            session => $session,
            query   => $query,
            uri     => "/cgi-bin/link_portlet.cgi"
        ), "__REFRESH_DIV__");
    }
    $tmpl->param(
        IMG_RDIR  => $session->{img_rdir},
        TITLE_TEXT => $pr->{title},
        BUTTON    => $button,
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
        CONTENTS  => $tags
    );
    return $tmpl->output;
}

sub get_conf_tabs {
    my ($session, $param, $on_tab, $device, $gid) = @_;
    # 現在 $device はカスタマイズ用にしか使っていない
    # (表示するタブは $on_tab で識別)

    $param->{tab_on} = $on_tab;
    $param->{tab_name1}="&nbsp;&nbsp;@{[t_('トップページ')]}(".t_('汎用').")&nbsp;&nbsp;";
    $param->{tab_href1}=
        "$DA::Vars::p->{cgi_rdir}/conf_owner_call_list.cgi?gid=$gid&device=1";
    $param->{tab_name2}="&nbsp;&nbsp;@{[t_('トップページ')]}(". t_('リンク集') .")&nbsp;&nbsp;";
    $param->{tab_href2}=
        "$DA::Vars::p->{cgi_rdir}/conf_owner_call_list.cgi?gid=$gid&device=5";

    if ($DA::IsLicense::op->{mobile}) {
       $param->{tabs}=4;
       $param->{tab_name3}="&nbsp;&nbsp;@{[t_('携帯電話メニュー')]}&nbsp;&nbsp;";
       $param->{tab_href3}=
          "$DA::Vars::p->{cgi_rdir}/conf_owner_call_list.cgi?gid=$gid&device=2";
       $param->{tab_name4}="&nbsp;&nbsp;@{[t_('ＰＤＡメニュー')]}&nbsp;&nbsp;";
       $param->{tab_href4}=
          "$DA::Vars::p->{cgi_rdir}/conf_owner_call_list.cgi?gid=$gid&device=3";

       if ($DA::IsLicense::op->{tool_ver} && !$DA::IsLicense::op->{eip} && !$DA::IsLicense::op->{cl_smartpage}) {
           # 新ライセンス体系
       } else {
           $param->{tabs}++;
           $param->{tab_name5}="&nbsp;&nbsp;@{[t_('スマートページ')]}&nbsp;&nbsp;";
           $param->{tab_href5}=
              "$DA::Vars::p->{cgi_rdir}/conf_owner_call_list.cgi?gid=$gid&device=4";
       }
    } else {
       if ($DA::IsLicense::op->{tool_ver} && !$DA::IsLicense::op->{eip} && !$DA::IsLicense::op->{cl_smartpage}) {
           $param->{tabs}=2;
       } else {
           $param->{tabs}=3;
           $param->{tab_name3}="&nbsp;&nbsp;@{[t_('スマートページ')]}&nbsp;&nbsp;";
           $param->{tab_href3}=
              "$DA::Vars::p->{cgi_rdir}/conf_owner_call_list.cgi?gid=$gid&device=4";
       }
    }

    if ($DA::IsLicense::op->{eip} || $DA::IsLicense::op->{cl_portal}) {
    	$param->{tabs}++;
    	$param->{"tab_name$param->{tabs}"}=
    		"&nbsp;&nbsp;@{[t_('ログイン定義')]}&nbsp;&nbsp;";
    	$param->{"tab_href$param->{tabs}"}=
    		"$DA::Vars::p->{cgi_rdir}/conf_owner_sso_list.cgi?gid=$gid";
    
		my $hidden = DA::IS::get_sys_custom($session,"hidden");
		if ($hidden->{portal_count} ne 'off') {
       		$param->{tabs}++;
       		$param->{"tab_name$param->{tabs}"}=
           	   "&nbsp;&nbsp;@{[t_('表示回数')]}&nbsp;&nbsp;";
       		$param->{"tab_href$param->{tabs}"}=
               "$DA::Vars::p->{cgi_rdir}/conf_owner_call_view.cgi?gid=$gid";
		}
    }

    # Custom ===========
    DA::Custom::get_portlet_list_conf_tabs($session,$param,$on_tab,$device,$gid);
    #===================
}

sub get_link_data {
    my ($session, $num) = @_;
    my $link = {};
    my $sql="SELECT title,seq,url FROM is_param_link WHERE num=? ORDER BY seq";
    my $sth=$session->{dbh}->prepare($sql); 
	   $sth->bind_param(1,int($num),3); $sth->execute();
    my $n = 0;
    while(my($title,$seq,$url) = $sth->fetchrow) {
        $n++;
        $link->{$n} = "url\n$title\n$url";
    }
    $sth->finish;
    return $link;
}

# $mode
#   0: 全て有効
#   1: プレビューボタンが disable
#   2: プレビューボタンを表示しない
sub get_call_preview_popup_param {
	my ($session, $pr, $gid, $device, $num, $mode) = @_;
	my $hidden = DA::IS::get_sys_custom($session, "hidden");

	my ($prev_button, $prev_cgi, $prev_param, $prev_script, $switch_script);
	if ($device eq '1' || $device eq '4') {
		$prev_cgi = "conf_owner_call_preview.cgi";
		if ($pr->{style} eq 1) {
			$prev_param = "scrollbars=1,resizable=1";
			if ($hidden->{portal_bar_setting} eq "on") {
				if ($pr->{menubar}) {
					$prev_param .= ",menubar=1";
				}
				if ($pr->{toolbar}) {
					$prev_param .= ",toolbar=1";
				}
				if ($pr->{locationbar}) {
					$prev_param .= ",location=1";
				}
				if ($pr->{statusbar}) {
					$prev_param .= ",status=1";
				}
			} else {
				$prev_param .= ",menubar=1,toolbar=1,location=1,status=1";
			}
			if ($pr->{win_x}) {
				$prev_param .= ",width=$pr->{win_x}";
			}
			if ($pr->{win_y}) {
				$prev_param .= ",height=$pr->{win_y}";
			}
		} else {
			$prev_param = "width=700,height=550,scrollbars=1,resizable=1,"
						. "menubar=1,toolbar=1,location=1,status=1";
		}
	} elsif ($device eq '5') {
		$prev_cgi = "conf_owner_call_preview_link.cgi";
		$prev_param = "width=700,height=550,scrollbars=1,resizable=1,"
					. "menubar=1,toolbar=1,location=1,status=1";
	}
	if ($device eq '1' || $device eq '4' || $device eq '5') {
		if ($mode eq 2) {
			$prev_button= "";
		} elsif ($mode eq 1) {
			$prev_button= "<input type=button name=preview value=\""
						. t_("プレビュー") . "\" onClick=\"Prev();\" disabled>";
		} else {
			$prev_button= "<input type=button name=preview value=\""
						. t_("プレビュー") . "\" onClick=\"Prev();\">";
		}

		if ($mode eq 2) {

			$switch_script=<<end_tag;
function switchPrev(STATUS) {
}
end_tag

		} else {

			$prev_script=<<end_tag;
function Prev(){
    var Param='$prev_param';
    var Url='$DA::Vars::p->{cgi_rdir}/$prev_cgi?'
        +'gid=$gid&device=$device&num=$num&win=pop&menu=no';
    if (!check_poptype()) {
        var pwin=window.open(setUrl(Url),'Prev',Param);
    } else {
        var pwin=window.open(setUrl(Url),'',Param);
    }
}
end_tag

			$switch_script=<<end_tag;
function switchPrev(STATUS) {
    if (STATUS) {
        document.forms[0].preview.disabled = false;
    } else {
        document.forms[0].preview.disabled = true;
    }
}
end_tag

		}
	} else {

			$switch_script=<<end_tag;
function switchPrev(STATUS) {
}
end_tag

	}

	return ($prev_button, $prev_script, $switch_script);
}

sub get_workflow_list {
	my ($session,$query,$date,$port,$join)=@_;

	my $html;
	my $height=0;

    my $page   = $query->param('WF_PORTAL_page');
       $page   = 1 if ($page <= 0);

    my $list={};
    my $type_count;
    if (!$port->{wf_sort}) { $port->{wf_sort}='type'; }

	my ($sql,$sth);
	if ($port->{wf_wf} eq 'on') {
		# 自分が含まれている承認グループを先に取得する
		my $my_group=DA::Workflow::get_my_route_group($session,'recv');

		my $count;
		my $today=DA::CGIdef::get_date('Y4/MM/DD-HH:00:00');
		$sql="SELECT f.fid,f.fid_code,f.header,f.title,f.expire_date,"
		 . "r.mid AS r_mid,r.gdate,r.cdate,r.substitute "
		 . "FROM is_wf_route r,is_workflow f "
		 . "WHERE r.fid=f.fid AND r.remove=0 "
		 . "AND r.orders=f.orders AND r.cdate IS NULL AND f.status=1 "
    	 . "AND (r.mid=? OR r.substitute IS NOT NULL OR r.mid > ?) "
		 . "ORDER BY r.gdate DESC";
		$sth=$session->{dbh}->prepare($sql);
   		$sth->bind_param(1,$session->{user},3);
   		$sth->bind_param(2,$DA::Vars::p->{top_gid},3);
   		$sth->execute();
		while (my $r=$sth->fetchrow_hashref('NAME_lc')) {
			if ($r->{cdate}) { next; }
			if ($r->{r_mid} > 8000000) { next; }

			my $view_permit;
			if ($r->{r_mid} eq $session->{user}) { 
				$view_permit=1; 
			} elsif ($r->{r_mid} > $DA::Vars::p->{top_gid}) {
				if ($my_group->{$r->{fid}}->{$r->{r_mid}}) { $view_permit=1; }
			}
        	# 代行承認のチェック
    		if (!$view_permit && $r->{substitute}) {
        		$view_permit=DA::Workflow::is_substitute_user($session,
                		$r->{fid},$r->{substitute},$join);
    		}
			if (!$view_permit) { next; }

            $count++;
            if ($port->{wf_row} ne 'all' && $count > $port->{wf_row}) { last; }

    		if ($r->{header} ne "" && $r->{title} ne $r->{header}) {
        		$r->{title}="$r->{title} $r->{header}";
    		}
			if ($port->{wf_number} eq 'on') {
				$r->{title}="[No.$r->{fid_code}] " . $r->{title};
			}
			if ($port->{wf_title} ne 'all') {
				$r->{title}=DA::CGIdef::decode($r->{title},1,1,'euc');
        		$r->{title}=DA::IS::format_jsubstr($session,$r->{title},0,
                              $port->{wf_title});
				$r->{title}=DA::CGIdef::encode($r->{title},0,1,'euc');
			}

			my $over_style;
			my $icon="ico_sc_admit.$session->{icon_ext}";
    		if ($r->{expire_date} && $r->{expire_date} le $today) {
				$icon="ico_sc_admit_over.$session->{icon_ext}";
				$over_style="style=\"font-weight:bold;color:red;\"";
    		}

			my $tag.="<tr class='__ROW_CLASS__' $over_style><td align=center>"
			."<img src=$session->{icon_rdir}/$icon border=0 width=14 "
			."height=14 align=top title=\"@{[t_('承認')]}\"></td>"
			."<td width=100%><a href=\"javascript:Pop('wf_detail.cgi?"
			."fid=$r->{fid}%20mode=recv','pop_title_workflow.gif',670,600)\" "
			."$over_style>$r->{title}</a></td>\n";
			if ($port->{wf_date} eq 'on') {
				my $date=DA::CGIdef::get_display_date2($session,$r->{gdate},10);
				$tag.="<td align=right nowrap>$date</td>";
			}
			$tag.="</tr>\n";

			my $key=($port->{wf_sort} eq 'type') ? ++$type_count : $r->{gdate};
			   $key=~s/[\/\-\s\:]//g;
            $list->{$key}=$tag;
		}
		$sth->finish;
	}

	if ($port->{wf_rb} eq 'on') {
		my $count;
		$sql="SELECT fid,fid_code,header,title,rb_date,status,mid,keep_mid "
		 . "FROM is_workflow WHERE remove=0 AND status=5 AND "
		 . "mid=? ORDER BY rb_date DESC";
		$sth=$session->{dbh}->prepare($sql);
		$sth->bind_param(1,$session->{user},3); $sth->execute();
		while (my $r=$sth->fetchrow_hashref('NAME_lc')) {
			$count++;
			if ($port->{rb_row} ne 'all' && $count > $port->{rb_row}) { last; }

			my $title=$r->{title};
            if ($r->{header} ne "" && $r->{title} ne $r->{header}) {
                $title="$r->{title} $r->{header}";
            }
			if ($port->{wf_number} eq 'on') {
				$title="[No.$r->{fid_code}] " . $title;
			}
			my ($icon,$alt);
			$icon="ico_sc_admit_edit.$session->{icon_ext}"; $alt=t_('修正');
			if ($port->{wf_title} ne 'all') {
				$title=DA::CGIdef::decode($title,1,1,'euc');
        		$title=DA::IS::format_jsubstr($session,$title,0,
                              $port->{wf_title});
				$title=DA::CGIdef::encode($title,0,1,'euc');
			}
			my $tag="<tr class='__ROW_CLASS__'><td align=center>"
			."<img src=$session->{icon_rdir}/$icon border=0 width=14 "
			."height=14 align=top title=\"$alt\"></td>"
			."<td width=100%><a href=\"javascript:Pop('wf_detail.cgi?"
			."fid=$r->{fid}%20mode=return','pop_title_workflow.gif',670,600)\">"
			."$title</a></td>\n";
			if ($port->{wf_date} eq 'on') {
				my $date=DA::CGIdef::get_display_date2($session,
						$r->{rb_date},10);
				$tag.="<td nowrap align=right>$date</td>";
			}
			$tag.="</tr>\n";

            my $key=($port->{wf_sort} eq 'type') 
					? ++$type_count : $r->{rb_date};
			   $key=~s/[\/\-\s\:]//g;
            $list->{$key}=$tag;
		}
	}

	if ($port->{wf_dn} eq 'on') {
		my $count;
		$sql="SELECT fid,fid_code,header,title,close_date,status,mid,keep_mid "
		 . "FROM is_workflow WHERE remove=0 AND status IN (2,3) AND "
		 . "(keep_mid=? OR mid=?) ORDER BY close_date DESC";
		$sth=$session->{dbh}->prepare($sql);
		$sth->bind_param(1,$session->{user},3); 
		$sth->bind_param(2,$session->{user},3); 
		$sth->execute();
		while (my ($fid,$fid_code,$header,$title,$close,$status,$mid,$keep_mid)=
			$sth->fetchrow) {

    		if ($status eq 2 && $keep_mid ne $session->{user}) { next; }
    		if ($status eq 3 && $mid ne $session->{user}) { next; }

			$count++;
			if ($port->{dn_row} ne 'all' && $count > $port->{dn_row}) {
				last; 
			}
            $header=~s/\s+$//; $title=~s/\s+$//; $close=~s/\s+$//;
            if ($header ne "" && $title ne $header) {
                $title="$title $header";
            }
			if ($port->{wf_number} eq 'on') {
				$title="[No.$fid_code] " . $title;
			}
			my ($icon,$alt);
			if ($status eq  2) {
				$icon="ico_sc_stamped.$session->{icon_ext}"; $alt=t_('終了');
			} else {
				$icon="ico_sc_denied.$session->{icon_ext}"; $alt=t_('否認');
			}
			if ($port->{wf_title} ne 'all') {
				$title=DA::CGIdef::decode($title,1,1,'euc');
        		$title=DA::IS::format_jsubstr($session,$title,0,
                              $port->{wf_title});
				$title=DA::CGIdef::encode($title,0,1,'euc');
			}
			my $tag="<tr class='__ROW_CLASS__'><td align=center>"
			."<img src=$session->{icon_rdir}/$icon border=0 width=14 "
			."height=14 align=top title=\"$alt\"></td>"
			."<td width=100%><a href=\"javascript:Pop('wf_detail.cgi?"
			."fid=$fid%20mode=fine','pop_title_workflow.gif',670,600)\">"
			."$title</a></td>\n";
			if ($port->{wf_date} eq 'on') {
				my $date=DA::CGIdef::get_display_date2($session,$close,10);
				$tag.="<td nowrap align=right>$date</td>";
			}
			$tag.="</tr>\n";

            my $key=($port->{wf_sort} eq 'type') ? ++$type_count : $close;
			   $key=~s/[\/\-\s\:]//g;
            $list->{$key}=$tag;
		}
	}

	if ($port->{wf_cc} eq 'on') {
		my $count;
		$sql="SELECT f.fid,f.fid_code,f.header,f.title,r.gdate "
		 . "FROM is_circulation f,is_cc_route r "
		 . "WHERE r.mid=? AND r.fid=f.fid AND r.cdate is null "
		 . "AND r.remove=0 ORDER BY r.gdate DESC";
		$sth=$session->{dbh}->prepare($sql);
		$sth->bind_param(1,$session->{user},3); $sth->execute();
		while (my ($fid,$fid_code,$header,$title,$gdate)=$sth->fetchrow) {
			$count++;
			if ($port->{cc_row} ne 'all' && $count > $port->{cc_row}) {
				last; 
			}
			$header=~s/\s+$//; $title=~s/\s+$//; $gdate=~s/\s+$//;
            if ($header ne "" && $title ne $header) {
                $title="$title $header";
            }
			if ($port->{wf_number} eq 'on') {
				$title="[No.$fid_code] " . $title;
			}
			if ($port->{wf_title} ne 'all') {
				$title=DA::CGIdef::decode($title,1,1,'euc');
        		$title=DA::IS::format_jsubstr($session,$title,0,
                              $port->{wf_title});
				$title=DA::CGIdef::encode($title,0,1,'euc');
			}
			my $tag="<tr class='__ROW_CLASS__'><td align=center>"
			."<img src=$session->{icon_rdir}/ico_sc_circ.$session->{icon_ext} border=0 "
			."width=14 height=14 align=top title=\"@{[t_('回覧')]}\"></td>"
			."<td width=100%><a href=\"javascript:Pop('cc_detail.cgi?"
			."fid=$fid%20mode=recv','pop_title_workflow.gif',670,600)\">"
			."$title</a></td>\n";
			if ($port->{wf_date} eq 'on') {
				my $date=DA::CGIdef::get_display_date2($session,$gdate,10);
				$tag.="<td nowrap align=right>$date</td>";
			}
			$tag.="</tr>\n";

            my $key=($port->{wf_sort} eq 'type') ? ++$type_count : $gdate;
			   $key=~s/[\/\-\s\:]//g;
            $list->{$key}=$tag;
		}
	}

    my $param={};
       $param->{line}=$session->{list_row};
       $param->{page}=$page;
       $param->{name}='WF_PORTAL_page';
	if ($port->{wf_iframe} eq 'on') {
       $param->{cgi}="portlet_iframe.cgi?date=$date&portlet_type=WF_PORTAL&reload=1";
	} else {
       $param->{cgi}="__PAGE_NAVI__";
	}

    my $ix=1; my $iy=0; my $idx=0;
    my $start = int($param->{page}-1)*$param->{line}+1;
    my $end =int($param->{line} * 10)
            - ($start % int($param->{line} * 10)) + $start;

    my $tags;
    if ($port->{wf_sort} eq 'type') {
        foreach my $key (sort { $a <=> $b } keys %{$list}) {
            $iy++;
            if ($iy < $start){ next; }
            if ($ix > $param->{line}) {
               	if ($iy <= $end) { next; }
               	$iy++;last;
            }
            $ix++;
			my $class=($ix % 2) ? 'even' : 'odd';
			$list->{$key}=~s/__ROW_CLASS__/$class/g;
            $tags.=$list->{$key};
        }
    } elsif ($port->{wf_sort} eq 'date1') {
        foreach my $key (sort { $a cmp $b } keys %{$list}) {
            $iy++;
            if ($iy < $start){ next; }
            if ($ix > $param->{line}) {
               	if ($iy <= $end) { next; }
               	$iy++;last;
            }
            $ix++;
			my $class=($ix % 2) ? 'even' : 'odd';
			$list->{$key}=~s/__ROW_CLASS__/$class/g;
            $tags.=$list->{$key};
        }
    } elsif ($port->{wf_sort} eq 'date2') {
        foreach my $key (sort { $b cmp $a } keys %{$list}) {
            $iy++;
            if ($iy < $start){ next; }
            if ($ix > $param->{line}) {
               	if ($iy <= $end) { next; }
               	$iy++;last;
            }
            $ix++;
			my $class=($ix % 2) ? 'even' : 'odd';
			$list->{$key}=~s/__ROW_CLASS__/$class/g;
            $tags.=$list->{$key};
        }
    }
    $param->{final}= $iy;
	$height=$ix*20;

    if ($tags) {
		my $colspan=2;
        if ($port->{wf_date} eq 'on') { $colspan++; }

    	my $page_navi = DA::IS::get_page_navi2($session,$param);
		if ($port->{wf_iframe} ne 'on') {
			my $func="javascript:DAportletRefresher.refresh";
			$page_navi=~s/__PAGE_NAVI__\&amp;WF_PORTAL_page=(\d+)/$func('workflow','__INFO_PLACE__','$date','WF_PORTAL_page=$1');/g;
		}
    	if ($page_navi) {
        	$tags.="<TR class='footer'><TD WIDTH=99% COLSPAN=$colspan>"
        	."$page_navi</TD></TR>";
			$height+=30;
    	}
       	$html.="<TABLE class='list-portlet'>";
		$html.=$tags;
		$html.="</TABLE>";
    }

	return ($html,$height);
}

sub get_board_list {
	my ($session,$query,$date,$port,$join)=@_;

    if($port->{bd_row} eq '')   {$port->{bd_row}=10;}
    if($port->{bd_title} eq '') {$port->{bd_title}=20;}
    if($port->{bd_gname} eq '') {$port->{bd_gname}=10;}
    if($port->{bd_group} eq '') {$port->{bd_group}='on';}
    if($port->{bd_date} eq '')  {$port->{bd_date}='on';}
    if($port->{bd_attach} eq ''){$port->{bd_attach}='on';}
    if($port->{bd_iframe} eq ''){$port->{bd_iframe}='off';}

	my $html;
	my $height=0;

    my $page   = $query->param('BD_PORTAL_page');
       $page   = 1 if ($page <= 0);
    my $bd_date= DA::CGIdef::get_date("Y4/MM/DD");

    my $where;
    my $target_gid;
    foreach my $id (keys %$join) {
        if ($join->{$id}->{attr} !~ /[12UW]/){ next; }
        $where.="$id,";
        $target_gid++;
    }
    $where =~ s/\,$//;
    if (!$where) { return; }

	##########################
	#### ORDER BY句の設定 ####
	##########################
	my $order;
	my $category_order;
	#### カテゴリの有効無効判定
	my $category_valid = DA::Board::check_bd_category_validity($session);

	if($category_valid ne 'on'){
		### カテゴリが有効でない場合は「開始日昇順」とする。
		### またカテゴリに関するORDER句は設定しない。
		if($port->{bd_sort} =~ /category_(asc|desc)/){
			$port->{bd_sort} = 's_date_desc';
		}
	}else{
		### カテゴリが有効な場合は、ORDER句ソート番号を設定する。
		$category_order = "l.sort_num";
	}
	
	if($port->{bd_sort} =~ /title_(asc|desc)/){
		#タイトル
		$category_order = ",".$category_order if($category_valid eq 'on');
		my $val;
		if($1 eq "desc"){
			$val="DESC";
		}
		$order = "b.title $val,b.s_date DESC,b.s_time DESC,b.c_date DESC,b.p_level DESC $category_order";

	}elsif($port->{bd_sort} eq 's_date_asc'){
		#開始日時昇順
		$category_order = $category_order."," if($category_valid eq 'on');
		$order = "b.s_date,b.s_time,b.c_date DESC,b.p_level DESC ,$category_order b.title DESC";

	}elsif($port->{bd_sort} =~ /p_level_(asc|desc)/){
		#重要度
		$category_order = $category_order."," if($category_valid eq 'on');
		my $val;
		if($1 eq "desc"){
			$val="DESC";
		}
		$order = "b.p_level $val,b.s_date DESC,b.s_time DESC,b.c_date DESC ,$category_order b.title DESC";

	}elsif($port->{bd_sort} =~ /category_(asc|desc)/){
		#カテゴリ
		my $val;
		if($1 eq "desc"){
			$val="DESC";
		}
		$order = "l.sort_num $val,b.s_date DESC,b.s_time DESC,b.c_date DESC,b.p_level DESC,b.title DESC";

	}else{
		#開始日時降順
		$category_order = $category_order."," if($category_valid eq 'on');
		$order = "b.s_date DESC,b.s_time DESC,c_date DESC,b.p_level DESC,$category_order b.title DESC";

	}

	my $tags;
    my $count=0;
    my $save_row;

	## 表示カテゴリの反映
	my $view_cat_id = $query->param('BD_PORTAL_category');
	$view_cat_id = 'all' if ($view_cat_id eq '');

    my $param={};
    $param->{line}=$port->{bd_row};
	if ($param->{line} eq '') { $param->{line}=20; }
    $param->{page}=$page;
    $param->{name}='BD_PORTAL_page';
	if ($port->{bd_iframe} eq 'on') {
       $param->{cgi}="portlet_iframe.cgi?date=$date&portlet_type=BD_PORTAL&BD_PORTAL_category=$view_cat_id&reload=1";
	} else {
       $param->{cgi}="__PAGE_NAVI__";
	}

    my $ix=1; my $iy=0; my $idx=0;
	my $start; my $end;

	if ($param->{line} ne 'all') {
    	$start = int($param->{page}-1)*$param->{line}+1;
    	$end =int($param->{line} * 10)
            - ($start % int($param->{line} * 10)) + $start;
	}

    if ($target_gid > 800) {
        $where='';
    } else {
        $where="b.gid IN ($where) AND ";
    }
    my $time=DA::CGIdef::get_date('HH').":00";
    my $group_table=DA::Valid::check_tablename(DA::IS::get_group_table($session));

	#####################################
	#### FROM句・WHERE句の追加設定 ####
	#####################################
	my $sql_from;
	if ($DA::Vars::p->{POSTGRES}) {
		### POSTGRES
		$sql_from = "is_board b "
			."LEFT OUTER JOIN @{[DA::IS::get_lang_view($session,$session->{user_lang},'bd_category')]} l "
			."ON (b.cat_id=l.cat_id)";
	} else {
		### ORACLE
		$sql_from = "is_board b ,@{[DA::IS::get_lang_view($session,$session->{user_lang},'bd_category')]} l ";
		$where	.=" b.cat_id = l.cat_id(+) AND ";
	}
	

	if($category_valid eq 'on'){
		unless($view_cat_id eq 'all'){
			if($view_cat_id eq '0'){
				$where	.=" l.cat_id is null AND ";
			}else{
				$where	.=" l.cat_id=".$view_cat_id." AND ";
			}
		}
	}

	# DA::Custom::rewrite_portal_board_list <-- START

	$port->{category_valid}=$category_valid;
	$port->{view_cat_id}   =$view_cat_id;
	my $sel = new DA::ReadManager::URISelect($session, "board");

	my $sql="SELECT b.num,b.gid,b.title,b.s_date,b.s_time,b.e_date,b.e_time,"
		."b.attach,g.name,g.kana,g.alpha,g.type,b.p_level,l.cat_name,g.grade,b.c_date "
		."FROM $group_table g, $sql_from WHERE $where "
		."b.s_date <=? AND (b.e_date>=? OR b.e_date is null) AND b.gid=g.gid "
		."ORDER BY $order,g.type,g.sort_level,"
		."g.grade,upper(g.kana)";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,$bd_date,1);
       $sth->bind_param(2,$bd_date,1);
       $sth->execute();
    my $exists = {};
	while(my $data=$sth->fetchrow_hashref('NAME_lc')){
        if (exists $exists->{$data->{num}}) {
			next;
        } else {
			$exists->{$data->{num}} = 1;
        }
		
        if ($join->{$data->{gid}}->{attr} !~/[12UW]/) { next; }
        if ($data->{s_date} eq $bd_date 
			&& $data->{s_time} && $data->{s_time} gt $time) { next; }
        if ($data->{e_date} eq $bd_date 
			&& $data->{e_time} && $data->{e_time} le $time) { next; }

		if ($param->{line} ne 'all') {
            $iy++;
            if ($iy < $start){ next; }
            if ($ix > $param->{line}) {
                if ($iy <= $end) { next; }
                $iy++;last;
            }
            $ix++;
		}

		$idx++;
        my $color=(($idx % 2) eq 0) ? "#FFFFFF" : "#EEEEEE";

		my $line={};
		my $col_order="bd_group|bd_category_view|bd_title|bd_date|bd_attach";

		if ($port->{bd_group} eq 'on') {
        	my $gname=DA::IS::check_view_name($session,$data->{name},$data->{alpha});
        	if ($data->{gid} eq $DA::Vars::p->{top_gid}) {
            	$gname=DA::IS::get_top_gid_name($session,0,$gname);
        	}
        	if ($data->{type} eq '4') { 
				$gname=DA::IS::pre_suspend($session).$gname; 
			}
            if ($port->{bd_gname} eq 'all') {
                $gname = DA::CGIdef::encode($gname,0,1,'euc');
            } else {
                $gname = DA::IS::format_jsubstr($session,
					$gname,0,$port->{bd_gname});
                $gname = DA::CGIdef::encode($gname,0,1,'euc');
            }
            $line->{bd_group}="<td nowrap>$gname</td>";
        }

		if($port->{bd_category_view} ne 'off' && $category_valid eq 'on'){
			my $lcat_name=$data->{cat_name};
			if($port->{bd_category_length} ne 'all'){
				$lcat_name=DA::IS::format_jsubstr($session,
					$lcat_name,0,$port->{bd_category_length});
			}
			$lcat_name=DA::CGIdef::encode($lcat_name,0,1,'euc');
			$line->{bd_category_view}="<td nowrap>$lcat_name</td>";
		}

		my $title=$data->{title};
        if ($port->{bd_title} ne 'all') {
            $title = DA::IS::format_jsubstr($session,
				$title,0,$port->{bd_title});
		}
        $title = DA::CGIdef::encode($title,0,1,'euc');
        my $class=($count % 2) ? 'odd' : 'even';
        my $level_c = ($data->{p_level} eq 3) ? 'high' : ($data->{p_level} eq 1 ? 'low' : 'normal');
        $class = "$class $level_c";
		my $read = $sel->is_read("$data->{num}", $data->{c_date});
		my $tr_id = "__INFO_PLACE__bd_tr_$data->{num}_$data->{gid}";
		my $js;
		if (!$read) {# 未読
			$js = "javascript:document.getElementById('".$tr_id."').className='"."$class read"."';";
			$class .= " unread";
		} else {
			$class .= " read";
		}
        $line->{bd_title}="<td width=100%><a href=\"javascript:Pop('"
        ."bd_view.cgi%3fp=detail%20num=$data->{num}%20mode=top%20"
		."view_catid=$view_cat_id','pop_title_bulletin.gif',"
		."650,450,'bd$data->{num}')\" onClick=\"$js\" >$title</a></td>";

        if ($port->{bd_date} eq 'on') {
			my $s_date=$data->{s_date};
			my $e_date=$data->{e_date};
        	my $s_time=(!$data->{s_time}) ? '00:00' : $data->{s_time};
        	my $e_time=(!$data->{e_time}) ? '24:00' : $data->{e_time};
        	if ($e_date eq '') {
            	$e_date = t_('無期限');
            	$s_date = DA::CGIdef::get_display_date2($session,
					"$s_date-$s_time",10);
        	} else {
            	$e_date = DA::CGIdef::get_display_date2($session,
					"$e_date-$e_time",10);
            	$s_date = DA::CGIdef::get_display_date2($session,
					"$s_date-$s_time",10,'',1);
        	}
            $line->{bd_date}="<td nowrap>$s_date".t_('〜')."$e_date</td>";
        }

		if ($port->{bd_attach} eq 'on') {
            if ($data->{attach}) {
                $line->{bd_attach}="<td width=16 align=center>"
                 . "<img src=$session->{icon_rdir}/ico_fc_attach.$session->{icon_ext} "
                 . "width=14 height=14></td>";
            } else {
                $line->{bd_attach}="<td nowrap><img src=$session->{img_rdir}/"
                ."null.gif width=14 height=14></td>";
            }
        }

		DA::Custom::rewrite_portal_board_list($session,
				$port,$data,$line,\$col_order);
		
		if ($data->{p_level} eq 3) {	# 重要度：高い
            $tags.="<tr class=\"$class\" id =\"$tr_id\"><td>"
            ."<img src=$session->{icon_rdir}/ico_sc_announce01.$session->{icon_ext} height=14 "
            ."width=14 title=\"@{[t_('重要度')]}:@{[t_('高い%(board)')]}\"></td>";
        } elsif ($data->{p_level} eq 1) { # 重要度：低い
            $tags.="<tr class=\"$class\" id =\"$tr_id\"><td>"
            ."<img src=$session->{icon_rdir}/ico_sc_announce03.$session->{icon_ext} height=14 "
            ."width=14 title=\"@{[t_('重要度')]}:@{[t_('低い%(board)')]}\"></td>";
        } else { # その他(重要度：通常)
            $tags.="<tr class=\"$class\" id =\"$tr_id\"><td>"
            ."<img src=$session->{icon_rdir}/ico_sc_announce02.$session->{icon_ext} height=14 "
            ."width=14 title=\"@{[t_('重要度')]}:@{[t_('通常%(board)')]}\"></td>";
        }
		foreach my $key (split(/\|/,$col_order)) {
			$tags.=$line->{$key};
		}
        $tags.="</tr>\n";
        $count++;
    }

	$sel->finish();
	# DA::Custom::rewrite_portal_board_list <-- END

	$sth->finish;
    $param->{final}= $iy;
	$height=$count*20;

	if ($port->{bd_iframe} eq 'on') {
		$html="<FORM ACTION=\"$DA::Vars::p->{cgi_rdir}/portlet_iframe.cgi\" METHOD=\"POST\" NAME=\"BD_PORTAL\" STYLE=\"margin:0px;\">";
    	$html.="<INPUT TYPE=HIDDEN name=\"date\" VALUE=\"$date\">";
    	$html.="<INPUT TYPE=HIDDEN name=\"reload\" VALUE=\"1\">";
    	$html.="<INPUT TYPE=HIDDEN name=\"portlet_type\" VALUE=\"BD_PORTAL\">";
	}

	#### 表示カテゴリ選択プルダウンの作成
	my $bd_category_select;
	if($port->{bd_category_view} ne 'off' && $category_valid eq 'on'){
		my %cat_idx;
		%cat_idx = ($view_cat_id=>" selected ");
		
		my $list;
		### カテゴリID、カテゴリ名の取得
		my $sql ="SELECT cat_id,sort_num,cat_name ";
		$sql.="FROM @{[DA::IS::get_lang_view($session,$session->{user_lang},'bd_category')]} ";
		$sql.="ORDER BY sort_num";

		my $sth=$session->{dbh}->prepare("$sql");
		$sth->execute();
	
		while(my($cat_id,$sort_num,$cat_name) = $sth->fetchrow){
			$cat_name =~ s/\s+$//;
			$cat_name = DA::CGIdef::encode($cat_name,3,1,'euc');
			$list.="<option value=\"$cat_id\" $cat_idx{$cat_id}>$cat_name</option>\n";
		}
		$sth->finish;
	
		### カテゴリ選択セレクトタグの作成
		my $js=qq{
			<script LANGUAGE="JavaScript"><!--
			var onBoardChange=0;
			function BoardChange() {
    			try {
        			if (document.title == 'login_main') {
            			var cr_date=document.date_form.date.value;
            			var cid=document.getElementById('BD_PORTAL_category').value;
            			DAportletRefresher.refresh_all('board',cr_date,
                			'BD_PORTAL_category='+cid);
        			} else {
            			if (onBoardChange == 0) {
                			onBoardChange = 1;
                			document.forms[0].submit();
            			}
        			}
    			} catch (e) { }
			}
			//--></SCRIPT>
		};
		$bd_category_select=$js."<table border=\"0\" cellspacing=\"1\" cellpadding=\"1\" width=\"100%\"><tr>\n"
			."<td nowrap>".t_("カテゴリ%(board)")."&nbsp;:</td>\n"
			."<td><select name=\"BD_PORTAL_category\" id=\"BD_PORTAL_category\" onChange=\"BoardChange();\">\n"
			."<option value=\"all\" $cat_idx{all}>".t_("全て")."</option>\n"
			.$list
			."<option value=\"0\" $cat_idx{0}>".t_("なし")."</option>\n"
			."</select>\n"
			."</td>\n"
			."<td width=\"90%\">&nbsp;</td>\n"
			."</tr></table>\n";
		$html .=$bd_category_select;
		$height+=30;
	}

    if ($tags) {
		my $colspan=3;
        if ($port->{bd_group} eq 'on') { $colspan++; }
        if ($port->{bd_date} eq 'on') { $colspan++; }
        if ($port->{bd_attach} eq 'on') { $colspan++; }

    	my $page_navi = DA::IS::get_page_navi2($session,$param);
		if ($port->{bd_iframe} ne 'on') {
			my $func="javascript:DAportletRefresher.refresh";
			$page_navi=~s/__PAGE_NAVI__\&amp;BD_PORTAL_page=(\d+)/$func('board','__INFO_PLACE__','$date','BD_PORTAL_page=$1&BD_PORTAL_category=$view_cat_id');/g;
		}
    	if ($page_navi) {
        	$tags.="<TR class='footer'><TD WIDTH=99% COLSPAN=$colspan>"
        	."$page_navi</TD></TR>";
			$height+=30;
    	}
       	$html.="<TABLE class='list-portlet list-importance'>";
		$html.=$tags;
		$html.="</TABLE>";
    }

	if ($port->{bd_iframe} eq 'on') {
		$html.="</FORM>";
	}

	return ($html,$height);
}

sub get_task_list {
	my ($session,$query,$date,$port,$join)=@_;

	my $html;
	my $height=0;

    my $page   = $query->param('TODO_PORTAL_page');
       $page   = 1 if ($page <= 0);

	my $t_datetime	= DA::CGIdef::get_date('Y4/MM/DD-HH:MI');
	my ($t_date, $t_time)	= split (/\-/, $t_datetime);
	my $today	= $t_datetime;
	my $week	= DA::CGIdef::get_target_date($t_date, +7, 'Y4/MM/DD');
       $week	= $week . '-' . $t_time;
	my $before	= DA::CGIdef::convert_date($session, $t_datetime);
	   $before	=~s/\-[\d\:]+/\-24\:00\:00/;
	   $before	= DA::CGIdef::convert_date($session, 
						$before, 1, $DA::Vars::p->{timezone});
	   $before	=~s/(\-\d{2}\:\d{2}).*/$1/;

	my $sort_key;
	if ($port->{td_sort} eq 'title1') {
		$sort_key="title,tid";
	} elsif ($port->{td_sort} eq 'title2') {
		$sort_key="title desc,tid desc";
	} elsif ($port->{td_sort} eq 'start1') {
		$sort_key="start_date,start_time,tid";
	} elsif ($port->{td_sort} eq 'start2') {
		$sort_key="start_date desc,start_time desc,tid desc";
	} elsif ($port->{td_sort} eq 'end1') {
		$sort_key="end_date,end_time,tid";
	} elsif ($port->{td_sort} eq 'end2') {
		$sort_key="end_date desc,end_time desc,tid desc";
	} elsif ($port->{td_sort} eq 'priority1') {
		$sort_key="priority desc,tid desc";
	} elsif ($port->{td_sort} eq 'priority2') {
		$sort_key="priority,tid";
	} elsif ($port->{td_sort} eq 'retio1') {
		$sort_key="retio,tid";
	} elsif ($port->{td_sort} eq 'retio2') {
		$sort_key="retio desc,tid desc";
	} else {
		$sort_key="end_date,end_time,tid";
	}
	# #############################
	# custom
	# #############################
	DA::Custom::rewrite_port_task_sort_key($session,\$sort_key,$port);

	my $done_sql=" AND retio < 10 " if ($port->{td_done} eq 'off');

    my $param={};
       $param->{line}=$port->{td_lines};
	if ($param->{line} eq '') { $param->{line}=20; }
       $param->{page}=$page;
       $param->{name}='TODO_PORTAL_page';
	if ($port->{td_iframe} eq 'on') {
       $param->{cgi}="portlet_iframe.cgi?date=$date&portlet_type=TODO_PORTAL&reload=1";
	} else {
       $param->{cgi}="__PAGE_NAVI__";
	}

    my $ix=1; my $iy=0; my $idx=0;
	my $start=0; my $end=0;
	if ($param->{line} ne 'all') {
    	$start = int($param->{page}-1)*$param->{line}+1;
    	$end =int($param->{line} * 10)
            - ($start % int($param->{line} * 10)) + $start;
	}

	my $tags;
	my $table_name=DA::Valid::check_tablename(DA::Task::get_table_name($session->{user}));
	my $sql="SELECT tid,title,end_date,end_time,priority,retio,status,private "
	 . "FROM $table_name WHERE status IN (0,1) AND mid=? "
	 . "$done_sql ORDER BY $sort_key";
	my $sth=$session->{dbh}->prepare($sql); 
	   $sth->bind_param(1,$session->{user},3); $sth->execute();
	while(my ($tid,$title,$end_date,$end_time,$priority,$retio,$status,$private)
		=$sth->fetchrow) {
		$title=~s/\s+$//;
		if ($port->{td_title} ne 'all') {
			$title = DA::IS::format_jsubstr($session, 
				$title, 0, $port->{td_title});
		}
		$title = DA::CGIdef::encode($title,0,1,'euc');
		my $cnd = $end_date . '-' . $end_time;
		if ($port->{td_row} eq 'over' && $cnd gt $today) { next; }
		if ($port->{td_row} eq 'week' && $cnd gt $week) { next; }
		if ($port->{td_row} eq 'before' && $cnd gt $before) { next; }
		if ($status eq 1 || $retio eq 10) { $title="<strike>$title</strike>"; }

		if ($port->{td_lines} ne 'all') {
   			$iy++;
   			if ($iy < $start){ next; }
   			if ($ix > $param->{line}){
       			if ($iy <= $end) { next; }
       			$iy++;last;
   			}
   			$ix++;
		}

		my $class=($ix % 2) ? 'even' : 'odd';
		if ($priority eq 1) {
			$class.=" high";
		} elsif ($priority eq 2) {
			$class.=" normal";
		} elsif ($priority eq 3) {
			$class.=" low";
		}
		my $icon=($cnd lt $today) ? "ico_sc_taskover.$session->{icon_ext}" : "ico_sc_task.$session->{icon_ext}";
		$tags.="<tr class='$class'><td width=5% align=center>"
		     . "<img src=$session->{icon_rdir}/$icon border=0 width=14 height=14></td>\n";
		if ($port->{td_priority} eq 'on') {
			$tags.="<td width=5% align=center><img src=$session->{icon_rdir}/"
			."ico_sc_priority0" . $priority . "." .$session->{icon_ext}. " border=0 width=14 "
			."height=14></td>";
		}
		if ($port->{td_date} eq 'on') {
			my $date=DA::CGIdef::get_display_date2($session,
						"$end_date\-$end_time",10);
			$tags.="<td nowrap width=15%>$date</td>\n";
		}
		$tags.="<td><a href=\"javascript:Pop('todo_detail.cgi?"
		."tid=$tid%20top=true','pop_title_task.gif',560,500)\">$title</a>";
		if ($private eq 2) {
			$tags.="<IMG SRC=$session->{icon_rdir}/ico_14_secret.$session->{icon_ext} "
			."BORDER=0 WIDTH=14 HEIGHT=14 ALIGN=top hspace=2 "
			."title=\"@{[t_('非公開')]}\">";
		}
		$tags.="</td></tr>\n";
	}
	$sth->finish;
    $param->{final}= $iy;
	$height=$ix*20;

    if ($tags) {
		my $colspan=2;
		if ($port->{td_priority} eq 'on') { $colspan++; }
		if ($port->{td_date} eq 'on') { $colspan++; }

    	my $page_navi = DA::IS::get_page_navi2($session,$param);
		if ($port->{td_iframe} ne 'on') {
            my $func="javascript:DAportletRefresher.refresh";
            $page_navi=~s/__PAGE_NAVI__\&amp;TODO_PORTAL_page=(\d+)/$func('task','__INFO_PLACE__','$date','TODO_PORTAL_page=$1');/g;
		}
    	if ($page_navi) {
        	$tags.="<TR class='footer'><TD WIDTH=99% COLSPAN=$colspan>"
        	."$page_navi</TD></TR>";
			$height+=30;
		}
       	$html.="<TABLE class='list-portlet list-importance'>";
		$html.=$tags;
		$html.="</TABLE>";
    }

	return ($html,$height);
}

sub get_link_list {
	my ($session,$query,$date,$port,$join)=@_;

	my $html;
	my $height=0;

    my $page   = $query->param('LINK_PORTAL_page');
       $page   = 1 if ($page <= 0);

	my $icons;
	if ($port->{link_0} eq 'on') { $icons.="0,"; }
	if ($port->{link_1} eq 'on') { $icons.="1,"; }
	if ($port->{link_2} eq 'on') { $icons.="2,"; }
	if ($port->{link_3} eq 'on') { $icons.="3,"; }
	if ($port->{link_4} eq 'on') { $icons.="4,"; }

	my $tags;

    my $param={};
       $param->{line}=$port->{link_row};
	if ($param->{line} eq '') { $param->{line}=20; }
       $param->{page}=$page;
       $param->{name}='LINK_PORTAL_page';
	if ($port->{link_iframe} eq 'on') {
       $param->{cgi}="portlet_iframe.cgi?date=$date&portlet_type=LINK_PORTAL&reload=1";
	} else {
       $param->{cgi}="__PAGE_NAVI__";
	}

    my $ix=1; my $iy=0; my $idx=0;
	my $start=0; my $end=0;
	if ($param->{line} ne 'all') {
    	$start = int($param->{page}-1)*$param->{line}+1;
    	$end =int($param->{line} * 10)
            - ($start % int($param->{line} * 10)) + $start;
	}

	if ($icons ne '') {
		$icons=~s/\,$//o; 
		$icons=" AND icon IN ($icons) "; 

    	$session->{user}=~/(\d)$/;
    	my $table_name=DA::Valid::check_tablename("is_links_$1");
		my $sql="SELECT title,long_link,icon FROM $table_name "
		 . "WHERE mid=? $icons ORDER BY sort_level,icon,title";
		my $sth=$session->{dbh}->prepare($sql);
		   $sth->bind_param(1,$session->{user},3); $sth->execute();
		my ($l_title,$l_link,$l_icon);
		while(($l_title,$l_link,$l_icon)=$sth->fetchrow) {
			if ($param->{line} ne 'all') {
   				$iy++;
   				if ($iy < $start){ next; }
   				if ($ix > $param->{line}){
       				if ($iy <= $end) { next; }
       				$iy++;last;
   				}
   				$ix++;
			} else {
   				$ix++;
			}

			$l_title=~s/\s+$//g; $l_link=~s/\s+$//g; 
			if ($port->{link_title} ne 'all') {
				$l_title=DA::CGIdef::decode($l_title,1,1,'euc');
        		$l_title=DA::IS::format_jsubstr($session,$l_title,0,
                              $port->{link_title});
				$l_title=DA::CGIdef::encode($l_title,0,1,'euc');
			}
			my $alt;
			if ($l_icon eq 0) {
				$alt=t_('その他');
				$l_icon="ico_sc_lnkother.".$session->{icon_ext};
			} elsif ($l_icon eq 1) {
				$alt=t_('パーソナル');
				$l_icon="ico_sc_lnkpersonal.".$session->{icon_ext};
			} elsif ($l_icon eq 2) {
				$alt=t_('ビジネス');
				$l_icon="ico_sc_lnkbusiness.".$session->{icon_ext};
			} elsif ($l_icon eq 3) {
				$alt=t_('携帯電話');
				$l_icon="ico_sc_lnkimode.".$session->{icon_ext};
			} elsif ($l_icon eq 4) {
				$alt="@{[t_('ＰＤＡ')]}";
				$l_icon="ico_sc_lnkpalm.".$session->{icon_ext};
			}
			my $gname_tag="<td>[@{[t_('プライベート')]}]</td>" 
					if ($port->{link_gname} eq 'on');

			my $class=($ix % 2) ? "even" : "odd";
			my $img_rdir=($l_icon =~ /gif$/) ? $session->{img_rdir} : $session->{icon_rdir};
			$tags.="<tr class='$class'><td width=5% align=center>"
			."<img src=$img_rdir/$l_icon border=0 width=14 "
			."height=14 title=\"$alt\"></td><td><a href=\"$l_link\" "
			."target=_blank>$l_title</a></td>$gname_tag</tr>";
		}
		$sth->finish;
	}
    # グループ共有リンク
    if ($port->{link_5} eq 'on') {
        foreach my $gid (sort {$join->{$a}->{type} <=> $join->{$b}->{type}
                           or  $join->{$a}->{sort} <=> $join->{$b}->{sort} 
                           or  $join->{$a}->{kana} cmp $join->{$b}->{kana}} keys %$join) {
            if ($join->{$gid}->{attr} !~ /^[12UW]$/) { next; }
            $gid=~/(\d)$/;
			if ($gid < $DA::Vars::p->{top_gid}) { next; }
			$join->{$gid}->{name}=DA::IS::check_view_name($session,
				$join->{$gid}->{name},$join->{$gid}->{alpha});
			if ($join->{$gid}->{type} eq 4) {
        		$join->{$gid}->{name}=
            		DA::IS::pre_suspend($session).$join->{$gid}->{name};
    		}
			my $gname=DA::CGIdef::encode($join->{$gid}->{name},1,1,'euc');
			my $gname_tag="<td>[$gname]</td>" if ($port->{link_gname} eq 'on');
            my $table_name=DA::Valid::check_tablename("is_links_$1");
            my $sql="SELECT title,long_link,target FROM $table_name "
			 . "WHERE mid=? AND device=1 ORDER BY sort_level,title";
            my $sth=$session->{dbh}->prepare($sql);
               $sth->bind_param(1,int($gid),3); $sth->execute();
            while(my($l_title,$l_link,$l_target)=$sth->fetchrow) {
                $l_title=~s/\s+$//; $l_link=~s/\s+$//;
                if ($l_target eq 1) {        # プライマリのみ
                    if ($join->{$gid}->{attr} !~ /^[1]$/) { next; }
                } elsif ($l_target eq 2) {   # プライマリ＋セカンダリ
                    if ($join->{$gid}->{attr} !~ /^[12]$/) { next; }
                } elsif ($l_target eq 3) {   # 下位組織に所属するユーザ
                    if ($join->{$gid}->{attr} !~ /^[12UW]$/) { next; }
                }

				if ($param->{line} ne 'all') {
   					$iy++;
   					if ($iy < $start){ next; }
   					if ($ix > $param->{line}){
       					if ($iy <= $end) { next; }
       					$iy++;last;
   					}
   					$ix++;
				} else {
   					$ix++;
				}

                if ($port->{link_title} ne 'all') {
					$l_title=DA::CGIdef::decode($l_title,1,1,'euc');
        			$l_title=DA::IS::format_jsubstr($session,$l_title,0,
                              $port->{link_title});
					$l_title=DA::CGIdef::encode($l_title,0,1,'euc');
                }

				my $class=($ix % 2) ? "even" : "odd";
                $tags.="<tr class='$class'><td width=5% align=center>"
                ."<img src=$session->{icon_rdir}/ico_sc_lnkgrp.$session->{icon_ext} "
                ."border=0 width=14 height=14 title=\"$gname\"></td>"
				."<td><a href=\"$l_link\" target=_blank>$l_title</a>"
                ."</td>$gname_tag</tr>";
            }
        }
    }
	$param->{final}= $iy;
	$height=$ix*20;

    if ($tags) {
		my $colspan=2;
		if ($port->{link_gname} eq 'on') { $colspan++; }

    	my $page_navi = DA::IS::get_page_navi2($session,$param);
		if ($port->{link_iframe} ne 'on') {
           	my $func="javascript:DAportletRefresher.refresh";
           	$page_navi=~s/__PAGE_NAVI__\&amp;LINK_PORTAL_page=(\d+)/$func('link','__INFO_PLACE__','$date','LINK_PORTAL_page=$1');/g;
        }
    	if ($page_navi) {
        	$tags.="<TR class='footer'><TD WIDTH=99% COLSPAN=$colspan>"
        	."$page_navi</TD></TR>";
			$height+=30;
    	}
       	$html.="<TABLE class='list-portlet'>";
		$html.=$tags;
		$html.="</TABLE>";
    }

	return ($html,$height);
}

sub get_reminder_list {
	my ($session,$query,$date,$port,$join)=@_;
	my $html;
	my $height=0;

    my $page   = $query->param('MEMO_PORTAL_page');
       $page   = 1 if ($page <= 0);
	my($where);
	my $today = DA::CGIdef::get_date2($session,"Y4/MM/DD");
	if($port->{mm_line} eq ''){$port->{mm_line}='all';}
	if($port->{mm_sort} eq ''){$port->{mm_sort}='asc';}
	if($port->{mm_priod} eq 'day'){
		$where = "AND r_date='$today'";
	}elsif($port->{mm_priod} eq 'week'){
        my $wday = DA::CGIdef::get_wday($today,1);
		   $wday = ($wday eq 0) ? 6 : $wday--;
		my $s_ymd = DA::CGIdef::get_target_date($today,"-$wday","Y4/MM/DD");
		my $e_ymd = DA::CGIdef::get_target_date($s_ymd,"7","Y4/MM/DD");
		$where = "AND r_date>'$s_ymd' AND r_date<='$e_ymd'";
	}elsif($port->{mm_priod} eq 'month'){
		my $ym	=	substr($today,0,7);
		my $db_sdate = DA::CGIdef::sql_quote("$ym\/01");
		my $db_edate = DA::CGIdef::sql_quote("$ym\/31");
		$where = "AND r_date>=$db_sdate AND r_date<=$db_edate";
	}elsif($port->{mm_priod} eq 'all'){
		$where = "";
	}else{
        my $days = 7;
	    $port->{mm_priod} =~ /^pre_next_(\d)/;
        if($1 > 0){$days=$days*int($1);}
		my $s_ymd = DA::CGIdef::get_target_date($today,"-$days","Y4/MM/DD");
		my $e_ymd = DA::CGIdef::get_target_date($today,"$days","Y4/MM/DD");
		$where = "AND r_date>'$s_ymd' AND r_date<'$e_ymd'";
	}
    my $no = DA::CGIdef::get_last_n($session->{user},1);
    my $reminder_table = DA::Valid::check_tablename("is_reminder_$no");
	my $r_sql="SELECT num,title,r_date FROM $reminder_table WHERE mid=? $where";
    if($port->{mm_sort} eq 'asc'){
       $r_sql.=" ORDER BY r_date,num";
    }else{
       $r_sql.=" ORDER BY r_date desc ,num";
    }

    my $param={};
       $param->{line}=$port->{mm_line};
	if ($param->{line} eq '') { $param->{line}=20; }
       $param->{page}=$page;
       $param->{name}='MEMO_PORTAL_page';
	if ($port->{memo_iframe} eq 'on') {
       $param->{cgi}="portlet_iframe.cgi?date=$date&portlet_type=MEMO_PORTAL&reload=1";
	} else {
       $param->{cgi}="__PAGE_NAVI__";
	}

    my $ix=1; my $iy=0; my $idx=0;
	my $start=0; my $end=0;
	if ($param->{line} ne 'all') {
    	$start = int($param->{page}-1)*$param->{line}+1;
    	$end =int($param->{line} * 10)
            - ($start % int($param->{line} * 10)) + $start;
	}

    my $tags;
	my $r_sth=$session->{dbh}->prepare($r_sql); 
	   $r_sth->bind_param(1,$session->{user},3); $r_sth->execute();
	while(my ($r_num,$r_title,$r_date)=$r_sth->fetchrow) {
		$r_title=~s/\s+$//; 
		if ($param->{line} ne 'all') {
   			$iy++;
   			if ($iy < $start){ next; }
   			if ($ix > $param->{line}){
       			if ($iy <= $end) { next; }
       			$iy++;last;
   			}
   			$ix++;
		} else {
   			$ix++;
		}

		if ($port->{mm_title} ne 'all') {
			$r_title=DA::IS::format_jsubstr($session,
				$r_title,0,$port->{mm_title});
		}
		$r_title=DA::CGIdef::encode($r_title,2,1,'euc');
        my $f_date;
        if ($port->{mm_priod} eq 'all'){
            $f_date=DA::CGIdef::get_display_date2($session,$r_date,5,'no');
        } else {
            $f_date=DA::CGIdef::get_display_date2($session,$r_date,7,'no');
        }

		my $class=($ix % 2) ? 'even' : 'odd';
        $tags.="<tr class='$class'><td width=5%><img src=$session->{icon_rdir}/ico_sc_memo.$session->{icon_ext} "
		."width=14 height=14></td><td width=15%>$f_date</td><td>&nbsp;"
		."<a href=\"javascript:Pop('sc_reminder.cgi%3fnum=$r_num',"
		."'pop_title_memo.gif',450,400)\">$r_title</a></td></tr>";
	}
	$r_sth->finish;
    $param->{final}= $iy;
	$height=$ix*20;

    if ($tags) {
		my $colspan=3;
    	my $page_navi = DA::IS::get_page_navi2($session,$param);
		if ($port->{memo_iframe} ne 'on') {
           	my $func="javascript:DAportletRefresher.refresh";
           	$page_navi=~s/__PAGE_NAVI__\&amp;MEMO_PORTAL_page=(\d+)/$func('reminder','__INFO_PLACE__','$date','MEMO_PORTAL_page=$1');/g;
		}
    	if ($page_navi) {
        	$tags.="<TR class='footer'><TD WIDTH=99% COLSPAN=$colspan>"
        	."$page_navi</TD></TR>";
			$height+=30;
    	}
       	$html.="<TABLE class='list-portlet'>";
		$html.=$tags;
		$html.="</TABLE>";
    }

	return ($html,$height);
}

sub get_grouplist_list {
	my ($session,$date,$port,$join_group)=@_;
	my $html;
	my $height=0; # 現在未使用

    my ($pgroup,$sgroup,$project,$g_project,$title);

    #===========================================
    #     Custom
    #===========================================
    DA::Custom::rewrite_user_info_join_group($session,$join_group);
    #===========================================

    my @sort_list=sort{$join_group->{$a}->{sort} <=> $join_group->{$b}->{sort}
                    or $join_group->{$a}->{kana} cmp $join_group->{$b}->{kana}}
                    keys %$join_group;
    foreach my $id(@sort_list){
		if ($id < $DA::Vars::p->{top_gid}) {next;} #ISE_01003101
        my $gname=DA::IS::check_view_name($session,$join_group->{$id}->{name},
                                                   $join_group->{$id}->{alpha});
        my $v_name=DA::IS::get_ug_name($session,0,$id,
                                     $join_group->{$id}->{type},$gname,'','',0,
                                     $join_group->{$id}->{org_type});
        my $group="<a href=javascript:gInfo('$id','$session->{pop_noname}');>"
                 ."$v_name->{name}</a>";
        if($join_group->{$id}->{type} eq '1' ||
          ($join_group->{$id}->{type} eq '4' &&
           $join_group->{$id}->{org_type} eq '1')){
            if($join_group->{$id}->{attr} eq '1'){
                $pgroup.=($pgroup) ? "<br>$group\n" : $group;
            }elsif($join_group->{$id}->{attr} eq '2'){
                $sgroup.=($sgroup) ? "<br>$group\n" : $group;
            }
        }elsif($join_group->{$id}->{type} eq '2' ||
          ($join_group->{$id}->{type} eq '4' &&
           $join_group->{$id}->{org_type} eq '2')){
            if($join_group->{$id}->{attr} eq '1'){
                # Custom
                DA::Custom::rewrite_info_card_join_project_tag($session, $join_group, $id, \$group);

                if ($group) {
                    if($join_group->{$id}->{g_attr} eq '5'){
                        $g_project.=($g_project) ? "<br>$group\n" : $group;
                    }elsif($join_group->{$id}->{g_attr} eq '1'){
                        $g_project.=($g_project) ? "<br>$group\n" : $group;
                        $project.=($project) ? "<br>$group\n" : $group;
                    }else{
                        $project.=($project) ? "<br>$group\n" : $group;
                    }
                }
            }
        }elsif($join_group->{$id}->{type} eq '3' ||
          ($join_group->{$id}->{type} eq '4' &&
           $join_group->{$id}->{org_type} eq '3')){
            if($join_group->{$id}->{attr} eq '1'){
                $title.=($title) ? "<br>$group\n" : $group;
            }
        }
    }

	$html=<<buf_end;
<table class='list-portlet'><tr class='even'>
<td valign=top><img src=$session->{icon_rdir}/ico_fc_organization.$session->{icon_ext} width=14 height=14></td>
<td nowrap valign=top>@{[t_('プライマリ所属組織')]}&nbsp;</td><td valign=top width=80%>$pgroup</td>
</tr><tr class='odd'>
<td nowrap valign=top><img src=$session->{icon_rdir}/ico_fc_organization.$session->{icon_ext} width=14 height=14></td>
<td nowrap valign=top>@{[t_('セカンダリ所属組織')]}&nbsp;</td><td valign=top>$sgroup</td>
</tr><tr class='even'>
<td valign=top><img src=$session->{icon_rdir}/ico_fc_project.$session->{icon_ext} width=14 height=14></td>
<td nowrap valign=top>@{[t_('ユーザ参加プロジェクト')]}&nbsp;</td><td valign=top>$project</td>
</tr><tr class='odd'>
<td valign=top><img src=$session->{icon_rdir}/ico_fc_project.$session->{icon_ext} width=14 height=14></td>
<td nowrap valign=top>@{[t_('グループ参加プロジェクト')]}&nbsp;</td><td valign=top>$g_project</td>
</tr><tr class='even'>
<td valign=top><img src=$session->{icon_rdir}/ico_fc_executive.$session->{icon_ext} width=14 height=14></td>
<td nowrap valign=top>@{[t_('参加役職グループ')]}&nbsp;</td><td valign=top>$title</td>
</tr></table>
buf_end

	return ($html,$height);
}

sub get_memlist_list {
	my ($session,$date,$port,$join)=@_;
	my $html;
	my $height=0; # 現在未使用

    my ($p_owner,$s_owner,$member,$g_type);
    my $g_name=DA::IS::get_ug_name($session,1,$session->{space});
    my $ix=1;
    my $data=DA::IS::get_group_member_data($session,$session->{space},'123456');
    foreach my $value(sort values %{$data->{PO_USERSEL}}){
        my($no,$id,$type,$name)=split(/:/,$value,4);
        my $v_name = DA::IS::get_ug_name($session,0,$id,$type,$name);
        $p_owner.="$v_name->{icon}$v_name->{href}$v_name->{name}</a><br>";
    }
    foreach my $value(sort values %{$data->{SO_USERSEL}}){
        my($no,$id,$type,$name)=split(/:/,$value,4);
        my $v_name = DA::IS::get_ug_name($session,0,$id,$type,$name);
        my $group="$v_name->{icon}$v_name->{href}$v_name->{name}</a>";
        if($data->{SOWNER_TYPE}->{$id} eq '1'){
            my $wauth=$data->{SOWNER_AUTH}->{$id};
            $wauth=~s/\,/\-/g;
            $group.="&nbsp;&nbsp;<a href=\"javascript:authInfo('$wauth','$session->{pop_noname}')\">"
                  . "@{[b_('権限制限')]}</a>";
        }
        $s_owner.="$group<br>";
    }
    foreach my $value(sort values %{$data->{USERSEL}}){
        my($no,$id,$type,$name)=split(/:/,$value,4);
        my $v_name = DA::IS::get_ug_name($session,0,$id,$type,$name);
        if($type eq '1' &&
           ($g_name->{type} eq 'G' || $g_name->{type} eq 'S1')){
             $v_name->{flg}='[P]';
        }
        if ($ix eq 1) {
            $member.="<tr class='even'><td width=50% nowrap>" . $v_name->{flg}
            . $v_name->{href} . $v_name->{name} . "</a></td>\n";
            $ix = 2;
        } else {
            $member.="<td width=50% nowrap>" . $v_name->{flg} . $v_name->{href}
            . $v_name->{name} . "</a></td></tr>\n";
            $ix = 1;
        }
    }
    foreach my $value(sort values %{$data->{S_USERSEL}}){
        my($no,$id,$type,$name)=split(/:/,$value,4);
        my $v_name = DA::IS::get_ug_name($session,0,$id,$type,$name);
        if(($g_name->{type} eq 'G' ||
            substr($g_name->{type},0,1) eq 'S' ) && $v_name->{type} eq '1'){
            $v_name->{flg}='[S]';
        }
        if ($ix eq 1) {
            $member.="<tr class='even'><td width=50% nowrap>" . $v_name->{flg}
            . $v_name->{href} . $v_name->{name} . "</a></td>\n";
            $ix = 2;
        } else {
            $member.="<td width=50% nowrap>" . $v_name->{flg} . $v_name->{href}
            . $v_name->{name} . "</a></td></tr>\n";
            $ix = 1;
        }
    }

    if($ix == 2){ $member.="<td width=50%></td></tr>\n"; }
    if ($member) {
        $member="<table width=100% border=0 cellspacing=1 cellpadding=1>"
        . $member . "</table>\n";
    }

    my $ug_title;
    if ($g_name->{type} eq 'P'){
        $ug_title=t_('所属ユーザ・グループ');
    }else{
        $ug_title=t_('所属ユーザ');
    }

	$html=<<buf_end;
<table class='list-portlet'><tr class='even'>
<td width=25% nowrap valign=top>@{[t_('プライマリオーナー')]}&nbsp;</td>
<td valign=top>$p_owner</td>
</tr><tr class='odd'>
<td width=25% nowrap valign=top>@{[t_('セカンダリオーナー')]}&nbsp;</td>
<td valign=top>$s_owner</td>
</tr><tr class='even'>
<td width=25% nowrap valign=top>$ug_title&nbsp;</td>
<td valign=top>$member</td>
</tr></table>
buf_end

	return ($html,$height);
}

sub get_rssreader {
	my ($session,$date,$port,$tmpl,$query)=@_;

	my $tags;

	my $cant_add_feed = 0;  # Of course we can..

    my $portlet = DA::RSS::HTML::Portlet->new(
            session => $session,
            query   => $query,      # TODO: is query needed? we don't seem to be using it.
    );
    $cant_add_feed = 1 unless $portlet->feed_manager->user_can_add_feed;

	my $closed = $port->{close}->{rssreader} eq 'close';

	$tags = $portlet->html();
	if ($closed) {
		$tags="<div class='rssreader-main' style='display:none;'>$tags</div>";
	} else {
		$tags="<div class='rssreader-main'>$tags</div>";
	}

	my @buttons;
	if ($session->{portlet_style} eq 'preset'&& $session->{menu_style} eq "preset") {
		my $href = "javascript:Pop('$DA::Vars::p->{rss_config_rdir}/feed?add=true','pop_title_rss_addfeed.gif','630','280');";
		if (!$cant_add_feed) {
			push (@buttons, &get_button4preset($session, $href, t_('フィード登録')));
		} 
		if ($port->{portal_conf_button} ne 'off') {
			$href = "javascript:Pop('$DA::Vars::p->{rss_config_rdir}/view_settings','pop_title_rss_viewsttng.gif','430','230');";
			push (@buttons, &get_button4preset($session, $href, t_('表示設定')));
		}
		if (1) {
			my $btn_tag =<<end_tag;
<td class="icon">
<img src="$session->{img_rdir}/ctm03_porico_update.png" class="refresh-button" style="cursor:pointer;" height=9 width=9  title="@{ [t_('更新')] }" />
</td>
end_tag
			push(@buttons,$btn_tag);
		}
	} else {
		@buttons = (

		$cant_add_feed ? () : (qq|
			<a href="javascript:Pop('$DA::Vars::p->{rss_config_rdir}/feed?add=true',
								'pop_title_rss_addfeed.gif',
								'630','280');">
				<img src="$session->{img_rdir}/aqbtn_regist.gif"
					 height="15px" border="0"
					 title="@{ [t_('フィード登録')] }" /></a>
		|),
	
		$port->{portal_conf_button} eq 'off' ? () : (qq|
			<a href="javascript:Pop('$DA::Vars::p->{rss_config_rdir}/view_settings',
								'pop_title_rss_viewsttng.gif',
								'430','230');">
				<img src="$session->{img_rdir}/aqbtn_setview.gif"
					 height="15px" border="0"
					 title="@{ [t_('表示設定')] }" /></a>|), 

		qq|<img src="$session->{img_rdir}/aqbtn_small_refresh.gif"
				height="15px" border="0"
				class="refresh-button"
				style="cursor:pointer;"
				title="@{ [t_('更新')] }"/>|,
		
		);
	}
	
	push @buttons, 
		DA::Portal::get_close_button($session,$date,$port,'rssreader');

	$tmpl->param(
   		IMG_RDIR  => $session->{img_rdir},
   		TITLE_GIF => "tbar_title_rss.gif",
		TITLE_TEXT => ($session->{portlet_style} eq 'aqua' || $session->{portlet_style} eq 'preset') 
				? t_('RSSリーダー') : "",
   		BUTTON    => join ('', @buttons),
		DD_HEADER => "__DD_HANDER__", #Drop&Drag hander
   		CONTENTS  => $tags,
	);

	$tags=$tmpl->output;

	$tags=&insert_div_tag($tags, '__REFRESH_DIV__');
	return ($tags);
}

# Ticker START
sub get_ticker_menu {
    my ($session,$join,$bosses)=@_;

    my $boss_join={};
    foreach my $boss (keys %$bosses) {
        $boss_join->{$boss}=DA::IS::get_join_group($session,$boss,1);
    }

    my $content;
    my $space; for (my $i=0; $i<10; $i++) { $space.="&nbsp;&nbsp;"; }
    my $today=DA::CGIdef::get_date2($session,"Y4/MM/DD-HH:00");
    my $date =substr($today,0,10);
    my $time =substr($today,11);
    my $sql="SELECT * FROM is_ticker WHERE substr(start_date,1,10) <= ? AND "
     . "(substr(close_date,1,10) >= ? OR substr(close_date,1,10) = '0000/00/00')"
     . "ORDER BY p_level,start_date";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,$date,1);
       $sth->bind_param(2,$date,1);
       $sth->execute();
    my $p_level;
    while (my $row=$sth->fetchrow_hashref('NAME_lc')) {
        if ($row->{start_date} &&
            substr($row->{start_date},11,5) eq ''){
            $row->{start_date}.="-00:00";
        }
        if ($row->{close_date} &&
            substr($row->{close_date},11,5) eq ''){
            $row->{close_date}=DA::CGIdef::get_target_date(
                $row->{close_date},1,'Y4/MM/DD-00:00');
        }
        if ($row->{start_date} gt $today){ next; }
        if ((substr($row->{close_date},0,4) ne  '0000')
                || substr($row->{close_date},5,2) ne '00'
                || substr($row->{close_date},8,2) ne '00'){
            if ($row->{close_date} le $today){ next; }
        }

        my $permit;
        if ($row->{target} eq 1) {      # プライマリのみ
            if ($join->{$row->{gid}}->{attr} =~ /^[1]$/) { $permit=1; }
        } elsif ($row->{target} eq 2) { # プライマリ＋セカンダリ
            if ($join->{$row->{gid}}->{attr} =~ /^[12]$/) { $permit=1; }
        } elsif ($row->{target} eq 3) { # 下位組織に所属するユーザ
            if ($join->{$row->{gid}}->{attr} =~ /^[12UW]$/) { $permit=1; }
        }
        # 秘書対応
        if (!$permit && $row->{boss}) {
            foreach my $boss (keys %$boss_join) {
                if ($permit) { next; }
                if ($row->{target} eq 1) {      # プライマリのみ
                    if ($boss_join->{$boss}->{$row->{gid}}->{attr} =~ /^[1]$/) { $permit=1; }
                } elsif ($row->{target} eq 2) { # プライマリ＋セカンダリ
                    if ($boss_join->{$boss}->{$row->{gid}}->{attr} =~ /^[12]$/) { $permit=1; }
                } elsif ($row->{target} eq 3) { # 下位組織に所属するユーザ
                    if ($boss_join->{$boss}->{$row->{gid}}->{attr} =~ /^[12UW]$/) { $permit=1; }
                }
                if ($permit) {last;}
            }
        }
        if (!$permit) { next; }

        my $code=DA::IS::get_user_lang($session);
           $code=($code) ? "memo_$code" : "memo_ja";
        my $memo=$row->{$code};
        if ($memo eq '') { next; }

        $memo=DA::CGIdef::encode($memo,1,1,'euc');
        $memo=~s/\s/&nbsp;/g;
        if ($row->{link_url}) {
            $row->{link_url}=DA::CGIdef::encode($row->{link_url},1,1,'euc');
            if ($row->{link_url} !~ /^\// && $row->{link_url} !~ /^http/i) {
                $row->{link_url}="http://".$row->{link_url};
            }
            $memo="<a href=\"$row->{link_url}\" "
                  ."style=' text-decoration:none;color:__LINK_COLOR__;' "
                  ."target=_blank>$memo</a>";
        }
        $content.=($content) ? $space.$memo : $memo;
        if ($row->{p_level} eq 1) { $p_level = 1; }
    }
    $sth->finish;

    if ($content eq '') { return; }

    my $tag=DA::Portal::get_ticker_tag($session,$content,$p_level);

    return($tag);
}
sub get_ticker_data {
    my ($session,$num)=@_;
    my $sql="SELECT * FROM is_ticker WHERE num=?";
    my $sth=$session->{dbh}->prepare($sql);
       $sth->bind_param(1,int($num),3); $sth->execute();
    my $data=$sth->fetchrow_hashref('NAME_lc'); $sth->finish();
    return ($data);
}
sub get_ticker_tag {
    my ($session,$content,$p_level,$id,$notPortlet)=@_;
    my $ticker_conf=DA::IS::get_sys_custom($session,'ticker');
    if ($id eq '') { $id = 'ticker'; }
    my $color  =($p_level eq 1) ? $ticker_conf->{color1} : $ticker_conf->{color2};
    my $bgcolor=($p_level eq 1) ? $ticker_conf->{bgcolor1} : $ticker_conf->{bgcolor2};
    $content=~s/__LINK_COLOR__/$color/g;

	my $style="text-decoration:none;white-space:nowrap;color:$color;background-color:$bgcolor;"
			 ."height:20px;font-size:16px;font-weight:bold;padding:2px;";

    my $tag="<marquee style=\"$style\" id=$id scrolldelay=100 scrollamount=5 "
		   ."onMouseOver=\"document.getElementById('$id').scrollDelay=500;\" "
		   ."onMouseOut=\"document.getElementById('$id').scrollDelay=100;\">$content</marquee>";

	if ($session->{portlet_style} eq "preset" && $notPortlet ne "1") {
		my $null="<img src=\"$session->{img_rdir}/null.png\" height=\"1\" width=\"1\">";
		$tag=qq{
			<div class="portlet">
    			<table class="portlet-main"><tr>
        			<td class="portlet-hl">$null</td>
        			<td class="portlet-hc">$null</td>
        			<td class="portlet-hr">$null</td>
      			</tr><tr>
        			<td class="portlet-ml">$null</td>
        			<td class="portlet-mc"><div class="base_portlet">$tag</div></td>
        			<td class="portlet-mr">$null</td>
      			</tr><tr>
        			<td class="portlet-bl">$null</td>
        			<td class="portlet-bc">$null</td>
        			<td class="portlet-br">$null</td>
      			</tr></table>
  			</div>
		};
	} else {
		my $null="<img src=\"$session->{img_rdir}/null.gif\" height=\"1\" width=\"1\">";
		$tag=qq{
    		<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>
        		<td width="3"><img src="$session->{img_rdir}/ctm_port_hl_s.gif" width="3" height="3"></td>
        		<td width="100%" background="$session->{img_rdir}/ctm_port_h_s.gif">$null</td>
        		<td width="3"><img src="$session->{img_rdir}/ctm_port_hr_s.gif" width="3" height="3"></td>
      		</tr><tr>
        		<td width="3" background="$session->{img_rdir}/ctm_port_l.gif">$null</td>
        		<td bgcolor="#FFFFFF">$tag</td>
        		<td width="3" background="$session->{img_rdir}/ctm_port_r.gif">$null</td>
      		</tr><tr>
        		<td width="3"><img src="$session->{img_rdir}/ctm_port_bl.gif" width="3" height="3"></td>
        		<td width="100%" background="$session->{img_rdir}/ctm_port_b.gif">$null</td>
        		<td width="3"><img src="$session->{img_rdir}/ctm_port_br.gif" width="3" height="3"></td>
      		</tr></table><br>
		};
	}

    return($tag);
}
# Ticker END

sub get_portlet_cache {
	my ($session, $gid, $device, $sort, $search_title) = @_;

	if (DA::Session::lock("$session->{sid}-portlet_cache_store")) {
		my $expire  = 10 * 60;
		my $portlet;
		my $file = "$session->{temp_dir}/$session->{sid}.portlet_cache_store.$gid";
		if (DA::Unicode::file_exist($file)) {
			$portlet = DA::Unicode::storable_retrieve($file);
			if (time - $expire > $portlet->{modify}) {
				DA::Unicode::file_unlink($file);
				$portlet = undef;
			}
		}

		unless ($portlet) {
			$portlet = {};

			my $sort_sql;
			if ($sort eq "num1") {
				$sort_sql  = "num";
			} elsif ($sort eq "num2") {
				$sort_sql  = "num desc";
			} elsif ($sort eq "title1") {
				$sort_sql  = "title";
			} elsif ($sort eq "title2") {
				$sort_sql  = "title desc";
			}
			if ($sort_sql) {
				$sort_sql = " ORDER BY $sort_sql";
			}

			my $where_sql;
			my $sql = "SELECT num,title,cid FROM is_program WHERE device=? AND gid=?" . $where_sql . $sort_sql;
			my $sth = $session->{dbh}->prepare($sql);
			   $sth->bind_param(1, $device, 3);
			   $sth->bind_param(2, $gid, 3);
			$sth->execute();

			while (my ($num, $title, $cid) = $sth->fetchrow) {
				$title =~ s/\s+$//;
				my $hidden = 0;
				if ($search_title ne "" && !DA::IS::string_match($title, enc_($search_title))) {
					$hidden = 1;
				}
				push(@{$portlet->{data}}, {
					num    => $num,
					title  => $title,
					cid    => $cid,
					hidden => $hidden
				});
			}

			$portlet->{modify} = time;

			DA::Unicode::storable_store($portlet, $file);
		}
		DA::Session::unlock("$session->{sid}-portlet_cache_store");

		return($portlet->{data} || []);
	} else {
		return(undef);
	}
}

sub clear_portlet_cache {
	my ($session, $gid) = @_;

	if (DA::Session::lock("$session->{sid}-portlet_cache_store")) {
		my $file = "$session->{temp_dir}/$session->{sid}.portlet_cache_store.$gid";

		DA::Unicode::file_unlink($file);

		DA::Session::unlock("$session->{sid}-portlet_cache_store");
	} else {
		return(undef);
	}
}

sub get_portlet_cache4portal_setting {
	my ($session, $gid, $device, $sort, $search_title, $func, $type, $module, $rest_conf, $force, $list, $extract) = @_;

	if (DA::Session::lock("$session->{sid}-portlet_cache4portal_setting_store")) {
		my $expire  = 10 * 60;
		my $portlet;
		my $file = "$session->{temp_dir}/$session->{sid}.portlet_cache4portal_setting_store.$gid.$func";
		if (!$force && DA::Unicode::file_exist($file)) {
			$portlet = DA::Unicode::storable_retrieve($file);
			if (time - $expire > $portlet->{modify}) {
				DA::Unicode::file_unlink($file);
				$portlet = undef;
			}
		}

		unless ($portlet) {
			$portlet = {};

			my $names = {};
			if ($func ne "port_program_$device" && ref($module) eq 'HASH') {
				if ($device =~ /^[23]$/) {
					if ($module->{board} eq 'on') {
						$names->{board} = t_("連絡掲示板");
					}
					if ($module->{schedule} eq 'on') {
						$names->{schedule} = t_("スケジュール");
					}
					if ($module->{schedule} eq 'on') {
						$names->{facilities} = t_("施設予約");
					}
					if ($module->{task} eq 'on') {
						$names->{task} = t_("タスクリスト");
					}
					if ($module->{mail} eq 'on') {
						$names->{mail} = t_("電子メール");
					}
					if ($module->{address} eq 'on') {
						$names->{address} = t_("共有アドレス帳");
					}
					if ($module->{workflow} eq 'on') {
						$names->{workflow} = t_("ワークフロー");
					}
					if ($module->{link} eq 'on') {
						$names->{link} = t_("リンク集");
					}
					if ($module->{report} eq 'on') {
						$names->{report} = t_("レポート一覧");
					}
				} else {
					$names->{memlist} = t_("所属ユーザ");
					if ($module->{board} eq 'on') {
						$names->{board} = t_("連絡掲示板");
					}
					if ($module->{group} eq 'on') {
						$names->{group} = t_("所属グループ");
					}
					if ($module->{link} eq 'on') {
						$names->{link} = t_("リンク集");
					}
					if ($module->{mail} eq 'on') {
						$names->{mail} = t_("電子メール");
					}
					if ($module->{reminder} eq 'on') {
						$names->{reminder} = t_("メモ");
					}
					if ($module->{schedule} eq 'on') {
						$names->{schedule} = t_("スケジュール");
					}
					if ($module->{task} eq 'on') {
						$names->{task} = t_("タスクリスト");
					}
					if ($module->{workflow} eq 'on') {
						$names->{workflow} = t_("ワークフロー");
					}
					if ($module->{report} eq 'on') {
						$names->{report} = t_("新着レポート一覧");
					}
					$names->{grouplist} = t_("所属グループ");
					if ($module->{schedule} eq 'on' && $rest_conf->{fa_temp}) {
						$names->{fa_temp} = t_("仮予約承認待ち一覧");
					}
					if ($module->{newest} eq 'on') {
						$names->{newest} = t_("統合クリッピング");
					}
					if ($module->{rssreader} eq 'on') {
						$names->{rssreader} = t_("RSSリーダー");
					}
				}
			}

			my $sort_sql;
			if ($sort eq 'num1') {
				$sort_sql = 'p.num';
			} elsif ($sort eq 'num2') {
				$sort_sql = 'p.num DESC';
			} elsif ($sort eq 'title1') {
				$sort_sql = 'p.title';
			} elsif ($sort eq 'title2') {
				$sort_sql = 'p.title DESC';
			}

			my $where_sql;
			
			my ($pat,$up_group,$join,$owner_group);
			if ($func =~ /^(?:personal|personal_imode|personal_palm|port_program_$device)$/ && $gid < $DA::Vars::p->{top_gid}) { #各種設定の個人の場合
				$pat='12UW';
				if (DA::IS::get_multi_view_rest_type($session) eq '1' && $func eq 'personal') {
					$pat='12';
				}
				$join=DA::IS::get_join_group($session,$session->{user},1);
				$owner_group=DA::IS::get_owner_group($session,$session->{user},0,'document');
			} else {
				$up_group = $gid;
				$up_group .="|$DA::Vars::p->{top_gid}" if ($type =~ /[23]/);
				my ($u_list, $d_list) = DA::IS::get_group_path($session, $gid);
				foreach my $key (@{$u_list}) {
					$up_group .= ($up_group) ? "|$key" : $key;
				}
			}
			# contents_portlet
			my @ex_array;
			my $groups = {};
			my $info = {};
			my $group_table = DA::IS::get_group_table($session);
			my $sql = "SELECT p.num,p.gid,p.title,p.device,p.open_g,p.param_change,p.cid,g.name,g.alpha,g.type,g.org_type "
					. "FROM is_program p, $group_table g "
			        . "WHERE p.gid=g.gid AND p.device IN ("
					. (($device eq 3) ? "3" : ($device eq 2) ? "2" : ($device eq 4 && $module eq 'custom_portlet') ? "4" : "1,5") . ") "
			        . $where_sql . " "
			        . "ORDER BY g.type,g.sort_level,g.grade,upper(g.kana),p.gid,p.device"
					. (($sort_sql) ? ",$sort_sql" : "");

			my $sth = $session->{dbh}->prepare($sql);
			$sth->execute();
			while (my ($num, $gid, $title, $dev, $open_g, $change, $cid, $name, $alpha, $type, $org_type) = $sth->fetchrow) {
				$title =~ s/\s+$//; $name =~ s/\s+$//;$change=~s/\s+$//;
                if ($title eq '0'){}

				if ($pat && $join) { #各種設定の個人ポータル、モバイル設定での携帯電話、PDAの個人の場合
					if ($dev ne '5') {
                        if ($join->{$gid}->{attr} !~ /^[$pat]$/) {
                            if ($dev eq '4' && $module eq 'custom_portlet') { #
                                if (!DA::IS::get_sp_view_permit($session,'sm',$gid,'',$rest_conf,$join,$owner_group)) {
                                    next;
                                }
                            } else {
                                next;
                            }
                        }

					} else {
						if ($join->{$gid}->{attr} !~ /^[$pat]$/) {
							my $o_flg = 0;
							my @open_g_list = split(':', $open_g);
							foreach my $g (@open_g_list) {
								if ($join->{$g}->{attr} =~ /^[12UW]$/) {
									$o_flg = 1; last;
								}
							}
							if (!$o_flg) { next; }
						}
					}
                    if ($extract eq 'on') {
                        if ($num !~ /^($list)$/) { next; }
                    }
				} else {
				# contents_portlet
					if ($dev eq '5') {
						if ($gid !~ /^($up_group)$/) {
							my $o_flg = 0;
							if ($open_g) {
								my @g_list = split(':', $open_g);
								$o_flg = 0;
								foreach my $g (@g_list) {
									if ( $g =~ /^($up_group)$/) {
										$o_flg = 1; last;
									}
								}
							}
							if (!$o_flg) {next;}
						}
					} else {
						if ($gid !~ /^($up_group)$/) { next; }
					}
				}
				$name = DA::IS::check_view_name($session, $name, $alpha);

				if ($type eq '2') {
					$groups->{"ex_$num"}->{icon} = "[P]";
				} elsif ($type eq '3') {
					$groups->{"ex_$num"}->{icon} = "[T]";
				} elsif ($type eq '4') {
					$name = DA::IS::pre_suspend($session) . $name;
					if ($org_type eq 2) {
						$groups->{"ex_$num"}->{icon} = "[P]";
	        		} elsif ($org_type eq 3) {
						$groups->{"ex_$num"}->{icon} = "[T]";
					} else {
						$groups->{"ex_$num"}->{icon} = "[G]";
					}
				} else {
					$groups->{"ex_$num"}->{icon} = "[G]";
				}
				$groups->{"ex_$num"}->{gid} = $gid;
				$groups->{"ex_$num"}->{name} = enc_($name);
				$groups->{"ex_$num"}->{type} = $type;
				$groups->{"ex_$num"}->{org_type} = $org_type;
				$names->{"ex_$num"} = $title;
				$info->{"ex_$num"} = {
					num    => $num,
					title  => $title,
					cid    => $cid,
					hidden => 0
				};
				if ($search_title ne "" && !DA::IS::string_match($title, enc_($search_title))) {
					$info->{"ex_$num"}->{hidden} = 1;
				}
				push(@ex_array,"ex_$num");
			}
			$sth->finish();

			$portlet->{data} = {
				groups   => $groups,
				names    => $names,
				ex_array => \@ex_array,
				info     => $info
			};

			$portlet->{modify} = time;

			DA::Unicode::storable_store($portlet, $file);
		}
		DA::Session::unlock("$session->{sid}-portlet_cache4portal_setting_store");

		return($portlet->{data} || {});
	} else {
		return(undef);
	}
}

sub clear_portlet_cache4portal_setting {
	my ($session, $gid, $func) = @_;
	if (DA::Session::lock("$session->{sid}-portlet_cache4portal_setting_store")) {
		my $file = "$session->{temp_dir}/$session->{sid}.portlet_cache4portal_setting_store.$gid.$func";

		DA::Unicode::file_unlink($file);

		DA::Session::unlock("$session->{sid}-portlet_cache4portal_setting_store");
	} else {
		return(undef);
	}
}

sub get_module4portal_setting {
	my ($session, $rest_conf, $func) = @_;
	if ($func =~ /^port\_program\_/) {return "custom_portlet";}
	my $module = DA::IS::get_module($session, 1);

	$module->{memlist} = 'on';
	$module->{grouplist} = 'on';
	if ($module->{schedule} eq 'on' && $rest_conf->{fa_temp}) {
		$module->{fa_temp} = 'on';
	}
	if ($module->{schedule} eq 'on' && $func =~/^(?:personal_imode|personal_palm)$/) {
		$module->{facilities}="on";
	}

	return($module);
}

sub get_hidden_param4portal_setting {
	my ($session, $module, $groups, $names, $ex_array, $order, $opt) = @_;
	my @default_order = ($opt) ? qw (
		board schedule facilities task mail address
		workflow link report
	) : qw (
		memlist board schedule facilities task mail
		address workflow link reminder grouplist report fa_temp
		newest rssreader
	);

	if ($opt eq "personal") {#各種設定の個人ポータルの場合
		@default_order = qw ( 
        	board       schedule 
        	facilities  task 
        	mail        address 
        	workflow    link 
        	reminder    grouplist 
        	report      fa_temp
        	newest      rssreader
    	);
	}

	my $hidden_param;
	if (ref($module) eq 'HASH' && $opt ne 'custom') {

		# 標準メニューをリストに追加
		$hidden_param .= "default\:";
		foreach my $key (@default_order) {
			if (!$names->{$key}) { next; }
			if ($module->{$key} ne 'on') { next; }
			if ($opt && $key =~ /^(?:$order)$/i) { next; }
			$hidden_param .= "$key,";
		}
		$hidden_param =~ s/\,*$//;
	}

	# ポートレットをリストに追加
	my $now;
	foreach my $key (@{$ex_array}) {
		if ($names->{$key} eq "" ) { next; }
		if ($opt) {
			if ($key !~ /^(?:$order)$/i) {
				if ($groups->{$key}->{name} ne $now) {
					$hidden_param =~ s/\,*$/\|/;
					$hidden_param .= "$groups->{$key}->{gid}\:";
				}
				$hidden_param .= "$key,";
				$now = $groups->{$key}->{name};
			}
		} else {
			if ($groups->{$key}->{name} ne $now) {
				$hidden_param =~ s/\,*$/\|/;
				$hidden_param .= "$groups->{$key}->{gid}\:";
			}
			$hidden_param .= "$key,";
			$now = $groups->{$key}->{name};
		}
	}
	$hidden_param =~ s/[\,\|]+$//;
	$hidden_param =~ s/^[\,\|]+//;

	return($hidden_param);
}

sub get_dd_useful4portlet{
    my ($session,$port_conf,$div_id,$must,$dd_arr,$isNotOwner)=@_;
    my ($hander,$cls);
    if ($div_id =~ /_INFO_PLACE_/g) { # 通達、連絡場合、置き換える必要なし
        return ($hander,$cls);
    }   
    if (!$must) { #必須ポートレットではない
        push (@{$dd_arr},$div_id) if (ref($dd_arr) eq 'ARRAY');
        $cls = "class=\"box\"";
    	my $style="style='cursor:move;'" if ($port_conf->{drag_drop} eq 'on');
        $hander = "<tr $style id=\"$div_id\_hander\">";
    } else {
        $cls = "class=\"mustBox\"";
    	my $style="style='cursor:no-drop;'" if ($port_conf->{drag_drop} eq 'on' && $session->{drag_drop_mode} eq 'on');
        $hander = "<tr $style id=\"$div_id\_hander\">";
    }    
    if ($port_conf->{drag_drop} eq 'on') {
        if ($isNotOwner) { $hander="<tr>"; }    
    } else {
        $hander="<tr>";
    }    

    return ($hander,$cls);
}

sub get_tab_param {
	my ($session,$func,$module)=@_;
	if (!$module) { $module=DA::IS::get_module($session); }
    my $rest_conf = DA::IS::get_sys_custom($session,"restrict");
    my $v_name = DA::IS::get_ug_name($session,0,$session->{user},1,
       $session->{name},$session->{primary_gname},'','',$session->{primary_gtype});

    my $tabs;
    my $param={};

    $param->{page_title}=DA::CGIdef::get_page_title($session,'func_title_csttoppage.gif',
       t_("ユーザ")." : $v_name->{page_title}",'','on',t_('トップページのカスタマイズ')
	);

    if ($module->{schedule} eq 'on') {
        $tabs++;
        if ($func eq 'schedule') { $param->{tab_on}=$tabs; }
        $param->{"tab_name$tabs"}="&nbsp;&nbsp;@{[t_('スケジュール')]}&nbsp;&nbsp;";
        $param->{"tab_href$tabs"}="$DA::Vars::p->{cgi_rdir}/port_schedule.cgi";
    }
    if ($module->{workflow} eq 'on') {
        $tabs++;
        if ($func eq 'workflow') { $param->{tab_on}=$tabs; }
        $param->{"tab_name$tabs"}="&nbsp;&nbsp;@{[t_('ワークフロー')]}&nbsp;&nbsp;";
        $param->{"tab_href$tabs"}="$DA::Vars::p->{cgi_rdir}/port_flow.cgi";
    }
    if ($module->{board} eq 'on') {
        $tabs++;
        if ($func eq 'board') { $param->{tab_on}=$tabs; }
        $param->{"tab_name$tabs"}="&nbsp;&nbsp;@{[t_('連絡掲示板')]}&nbsp;&nbsp;";
        $param->{"tab_href$tabs"}="$DA::Vars::p->{cgi_rdir}/port_board.cgi";
    }
    if ($module->{mail} eq 'on') {
        $tabs++;
        if ($func eq 'mail') { $param->{tab_on}=$tabs; }
        $param->{"tab_name$tabs"}="&nbsp;&nbsp;@{[t_('電子メール')]}&nbsp;&nbsp;";
        $param->{"tab_href$tabs"}="$DA::Vars::p->{cgi_rdir}/port_mail.cgi";
    }
    if ($module->{link} eq 'on') {
        $tabs++;
        if ($func eq 'link') { $param->{tab_on}=$tabs; }
        $param->{"tab_name$tabs"}="&nbsp;&nbsp;@{[t_('リンク集')]}&nbsp;&nbsp;";
        $param->{"tab_href$tabs"}="$DA::Vars::p->{cgi_rdir}/port_link.cgi";
    }
    if ($module->{task} eq 'on') {
        $tabs++;
        if ($func eq 'task') { $param->{tab_on}=$tabs; }
        $param->{"tab_name$tabs"}="&nbsp;&nbsp;@{[t_('タスクリスト')]}&nbsp;&nbsp;";
        $param->{"tab_href$tabs"}="$DA::Vars::p->{cgi_rdir}/port_task.cgi";
    }
    if ($module->{reminder} eq 'on') {
        $tabs++;
        if ($func eq 'reminder') { $param->{tab_on}=$tabs; }
        $param->{"tab_name$tabs"}="&nbsp;&nbsp;@{[t_('メモ')]}&nbsp;&nbsp;";
        $param->{"tab_href$tabs"}="$DA::Vars::p->{cgi_rdir}/port_reminder.cgi";
    }
    if ($module->{report} eq 'on') {
        $tabs++;
        if ($func eq 'report') { $param->{tab_on}=$tabs; }
        $param->{"tab_name$tabs"}="&nbsp;&nbsp;@{[t_('レポート')]}&nbsp;&nbsp;";
        $param->{"tab_href$tabs"}="$DA::Vars::p->{cgi_rdir}/port_report.cgi";
    }
    if ($module->{schedule} eq 'on' && $rest_conf->{fa_temp}){
        $tabs++;
        if ($func eq 'fa_temp') { $param->{tab_on}=$tabs; }
        $param->{"tab_name$tabs"}="&nbsp;&nbsp;@{[t_('施設仮予約')]}&nbsp;&nbsp;";
        $param->{"tab_href$tabs"}="$DA::Vars::p->{cgi_rdir}/port_fa_temp.cgi";
    }
    if ($module->{newest} eq 'on') {
        $tabs++;
        if ($func eq 'newest') { $param->{tab_on}=$tabs; }
        $param->{"tab_name$tabs"}="&nbsp;&nbsp;@{[t_('統合クリッピング')]}&nbsp;&nbsp;";
        $param->{"tab_href$tabs"}="$DA::Vars::p->{cgi_rdir}/port_newest.cgi";
    }
    if ($module->{rssreader} eq 'on') {
        $tabs++;
        if ($func eq 'rssreader') { $param->{tab_on}=$tabs; }
        $param->{"tab_name$tabs"}="&nbsp;&nbsp;@{[t_('RSSリーダー')]}&nbsp;&nbsp;";
        $param->{"tab_href$tabs"}="$DA::Vars::p->{cgi_rdir}/port_rssreader.cgi";
    }
	$param->{tabs}=$tabs;
	return($param);
}

sub copy_call_data {
	my ($session,$old_data,$new_data,$new_sso)=@_;
	DA::Session::trans_init($session);
	eval {
		if (ref($new_sso) eq 'HASH' && $new_sso->{gid}) {
			$new_sso->{num}=DA::IS::get_count($session,'is_sso');
			$new_data->{sso_num}=$new_sso->{num};
		}

		$new_data->{num}=int(DA::IS::get_count($session,'is_program'))+10;
    	my $c_sql="INSERT INTO is_program (num,device,title,url,method,agent,"
    		."timeout,kanji_code,param_change,frame,height,cache_on,gid,"
    		."param_crypt,cache_frame,style,cache_time,sso_num,sso_view,"
    		."sso_view_filter,view_count,cache_embed,sso_login,open_g,portal_count,"
    		."menubar,toolbar,locationbar,statusbar,win_x,win_y,win_name,refresh_time,cid) "
    		."VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    	my $c_sth=$session->{dbh}->prepare($c_sql);
    	my $cx=0;
    	$c_sth->bind_param(++$cx,$new_data->{num},3);
    	$c_sth->bind_param(++$cx,$new_data->{device},3);
    	$c_sth->bind_param(++$cx,$new_data->{title},1);
    	$c_sth->bind_param(++$cx,$new_data->{url},1);
    	$c_sth->bind_param(++$cx,$new_data->{method},1);
    	$c_sth->bind_param(++$cx,$new_data->{agent},1);
    	$c_sth->bind_param(++$cx,$new_data->{timeout},3);
    	$c_sth->bind_param(++$cx,$new_data->{kanji_code},1);
    	$c_sth->bind_param(++$cx,$new_data->{param_change},1);
    	$c_sth->bind_param(++$cx,$new_data->{frame},3);
    	$c_sth->bind_param(++$cx,$new_data->{height},3);
    	$c_sth->bind_param(++$cx,$new_data->{cache_on},3);
    	$c_sth->bind_param(++$cx,$new_data->{gid},3);
    	$c_sth->bind_param(++$cx,$new_data->{param_crypt},1);
    	$c_sth->bind_param(++$cx,$new_data->{cache_frame},3);
    	$c_sth->bind_param(++$cx,$new_data->{style},3);
    	$c_sth->bind_param(++$cx,$new_data->{cache_time},3);
    	$c_sth->bind_param(++$cx,$new_data->{sso_num},3);
    	$c_sth->bind_param(++$cx,$new_data->{sso_view},3);
    	$c_sth->bind_param(++$cx,$new_data->{sso_view_filter},3);
    	$c_sth->bind_param(++$cx,$new_data->{cache_embed},3);
    	$c_sth->bind_param(++$cx,$new_data->{sso_login},3);
    	$c_sth->bind_param(++$cx,$new_data->{open_g},1);
    	$c_sth->bind_param(++$cx,$new_data->{portal_count},3);
    	$c_sth->bind_param(++$cx,$new_data->{menubar},3);
    	$c_sth->bind_param(++$cx,$new_data->{toolbar},3);
    	$c_sth->bind_param(++$cx,$new_data->{locationbar},3);
    	$c_sth->bind_param(++$cx,$new_data->{statusbar},3);
    	$c_sth->bind_param(++$cx,$new_data->{win_x},3);
    	$c_sth->bind_param(++$cx,$new_data->{win_y},3);
    	$c_sth->bind_param(++$cx,$new_data->{win_name},1);
    	$c_sth->bind_param(++$cx,$new_data->{refresh_time},3);
    	$c_sth->bind_param(++$cx,$new_data->{cid},3);
    	$c_sth->execute();

		my $col_key = $DA::Vars::p->{MYSQL} ? "`key`" : "key";
		if ($new_data->{device} ne '5') {
			my $cpx=0;
    		my $cp_sql="INSERT INTO is_params_p (num,mid,pid,$col_key,label,long_value) VALUES (?,?,?,?,?,?)";
    		my $cp_sth=$session->{dbh}->prepare($cp_sql);

    		$cp_sth->bind_param(++$cpx,$new_data->{num},3);
    		$cp_sth->bind_param(++$cpx,0,3);
    		$cp_sth->bind_param(++$cpx,0,3);
    		$cp_sth->bind_param(++$cpx,'insuite',1);
    		$cp_sth->bind_param(++$cpx,'',1);
    		$cp_sth->bind_param(++$cpx,$new_data->{insuite},1);
    		$cp_sth->execute();

    		for (my $i=1; $i<10; $i++) {
				$cpx=0;
        		$cp_sth->bind_param(++$cpx,$new_data->{num},3);
        		$cp_sth->bind_param(++$cpx,0,3);
        		$cp_sth->bind_param(++$cpx,$i,3);
        		$cp_sth->bind_param(++$cpx,$new_data->{"key$i"},1);
        		$cp_sth->bind_param(++$cpx,$new_data->{"label$i"},1);
        		$cp_sth->bind_param(++$cpx,$new_data->{"value$i"},1);
        		$cp_sth->execute();
    		}

			if (ref($new_sso) eq 'HASH' && $new_sso->{gid}) {
        		my $s_sql="INSERT INTO is_sso (num,init_url,login_url,agent_url,method,"
        			."timeout,kanji_code,param_change,param_crypt,hidden_over,gid,"
        			."title,basic_change) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        		my $s_sth=$session->{dbh}->prepare($s_sql);
        		my $sx=0;
        		$s_sth->bind_param(++$sx,$new_sso->{num},3);
        		$s_sth->bind_param(++$sx,$new_sso->{init_url},1);
        		$s_sth->bind_param(++$sx,$new_sso->{login_url},1);
        		$s_sth->bind_param(++$sx,$new_sso->{agent_url},1);
        		$s_sth->bind_param(++$sx,$new_sso->{method},1);
        		$s_sth->bind_param(++$sx,$new_sso->{timeout},3);
        		$s_sth->bind_param(++$sx,$new_sso->{kanji_code},1);
        		$s_sth->bind_param(++$sx,$new_sso->{param_change},1);
        		$s_sth->bind_param(++$sx,$new_sso->{param_crypt},1);
        		$s_sth->bind_param(++$sx,$new_sso->{hidden_over},3);
        		$s_sth->bind_param(++$sx,$new_sso->{gid},3);
        		$s_sth->bind_param(++$sx,$new_sso->{title},1);
        		$s_sth->bind_param(++$sx,$new_sso->{basic_change},3);
        		$s_sth->execute();

				my $spx=0;
        		my $sp_sql="INSERT INTO is_sso_params_p (num,mid,pid,$col_key,label,long_value) VALUES (?,?,?,?,?,?)";
        		my $sp_sth=$session->{dbh}->prepare($sp_sql);

				$sp_sth->bind_param(++$spx,$new_sso->{num},3);
        		$sp_sth->bind_param(++$spx,0,3);
        		$sp_sth->bind_param(++$spx,0,3);
        		$sp_sth->bind_param(++$spx,'basic_user',1);
        		$sp_sth->bind_param(++$spx,'',1);
        		$sp_sth->bind_param(++$spx,$new_sso->{basic_user},1);
        		$sp_sth->execute();

				$spx=0;
        		$sp_sth->bind_param(++$spx,$new_sso->{num},3);
        		$sp_sth->bind_param(++$spx,0,3);
        		$sp_sth->bind_param(++$spx,0,3);
        		$sp_sth->bind_param(++$spx,'basic_pass',1);
        		$sp_sth->bind_param(++$spx,'',1);
        		$sp_sth->bind_param(++$spx,$new_sso->{basic_pass},1);
        		$sp_sth->execute();

        		for (my $i=1; $i<10; $i++) {
					$spx=0;
            		$sp_sth->bind_param(++$spx,$new_sso->{num},3);
            		$sp_sth->bind_param(++$spx,0,3);
            		$sp_sth->bind_param(++$spx,$i,3);
            		$sp_sth->bind_param(++$spx,$new_sso->{"key$i"},1);
            		$sp_sth->bind_param(++$spx,$new_sso->{"label$i"},1);
            		$sp_sth->bind_param(++$spx,$new_sso->{"value$i"},1);
            		$sp_sth->execute();
        		}
    		}

    		DA::System::filepath_mkpath("$DA::Vars::p->{data_dir}/external/$new_data->{num}");
    		DA::System::file_copy(
				"$DA::Vars::p->{data_dir}/external/$old_data->{num}/filter.dat",
        		"$DA::Vars::p->{data_dir}/external/$new_data->{num}/filter.dat"
			);
    		DA::Unicode::file_copy(
				"$DA::Vars::p->{data_dir}/external/$old_data->{num}/header.dat",
        		"$DA::Vars::p->{data_dir}/external/$new_data->{num}/header.dat"
			);
    		DA::Unicode::file_copy(
				"$DA::Vars::p->{data_dir}/external/$old_data->{num}/footer.dat",
        		"$DA::Vars::p->{data_dir}/external/$new_data->{num}/footer.dat"
			);
    		DA::Unicode::file_copy(
				"$DA::Vars::p->{data_dir}/external/$old_data->{num}/explain.dat",
        		"$DA::Vars::p->{data_dir}/external/$new_data->{num}/explain.dat"
			);
    		DA::Unicode::file_copy(
        		"$DA::Vars::p->{data_dir}/external/$old_data->{num}/separator.dat",
        		"$DA::Vars::p->{data_dir}/external/$new_data->{num}/separator.dat"
			);
    		DA::Unicode::file_copy(
				"$DA::Vars::p->{data_dir}/external/$old_data->{num}/start.dat",
        		"$DA::Vars::p->{data_dir}/external/$new_data->{num}/start.dat"
			);
    		DA::Unicode::file_copy(
				"$DA::Vars::p->{data_dir}/external/$old_data->{num}/end.dat",
        		"$DA::Vars::p->{data_dir}/external/$new_data->{num}/end.dat"
			);
			DA::System::cmd("chown -R $DA::Vars::p->{www_user}.$DA::Vars::p->{www_group} %1","$DA::Vars::p->{data_dir}/external/$new_data->{num}");
		} else {
    		my $link = DA::Portal::get_link_data($session, $old_data->{num});
    		my $d_sql="DELETE FROM is_param_link WHERE num=?";
    		my $d_sth=$session->{dbh}->prepare($d_sql);
    		   $d_sth->bind_param(1,$old_data->{num},3);
    		   $d_sth->execute();

    		my $i_sql="INSERT INTO is_param_link (num,seq,title,url) VALUES (?,?,?,?)";
    		my $i_sth=$session->{dbh}->prepare($i_sql);
    		foreach my $n (keys %{$link}) {
				my $ix=0;
        		my ($type, $title, $url, $open) = split("\n", $link->{$n});
        		$i_sth->bind_param(++$ix,$new_data->{num},3);
        		$i_sth->bind_param(++$ix,$n,3);
        		$i_sth->bind_param(++$ix,$title,1);
        		$i_sth->bind_param(++$ix,$url,1);
        		$i_sth->execute();
    		}
		}
	};
	if (!DA::Session::exception($session)) {
    	DA::Error::system_error($session);
	}
}
sub insert_link_data {
	my ($session,$data)=@_;
	# $data->{gid} : 個人設定の場合は mid を指定
    DA::Session::trans_init($session);
    eval {
        my $ix=0;
        if (!$data->{num}) { $data->{num}=DA::IS::get_count($session,'is_links'); }
    	my $table_name="is_links_".DA::CGIdef::get_last_n($data->{gid});
        my $sql="INSERT INTO $table_name (num,mid,title,long_link,icon,device,target) VALUES (?,?,?,?,?,?,?)";
        my $sth=$session->{dbh}->prepare($sql);
           $sth->bind_param(++$ix,$data->{num}, 3);
           $sth->bind_param(++$ix,$data->{gid}, 3);
           $sth->bind_param(++$ix,$data->{title},  1);
           $sth->bind_param(++$ix,$data->{link},   1);
           $sth->bind_param(++$ix,$data->{icon},   3);
           $sth->bind_param(++$ix,$data->{device}, 3);
           $sth->bind_param(++$ix,$data->{target}, 3);
           $sth->execute();
    };
    if (!DA::Session::exception($session)) {
        DA::Error::system_error($session);
    }

    # 操作ログ（データ更新）
    my $today=DA::CGIdef::get_date('Y4-MM-DD HH:MI:SS');
    # 表示エリア　１：トップページ　２：携帯メニュー　３：ＰＤＡメニュー
    my $area;
    if ($data->{device} eq "1") {
      	$area=t_("トップページ");
    } elsif ($data->{device} eq "2") {
      	$area=t_("携帯メニュー");
    } else {
      	$area=t_("ＰＤＡメニュー");
    }
    DA::OperationLog::log($session,{
        "app"    => "link",  			# リンク集:link
        "docid"  => "$data->{num}",  	# リンク集番号
        "type"   => "OU",    			# OU：データ更新
        "detail" => {
            "mid"         => $data->{gid}, 		# 更新ユーザ
            "area"        => $area, 			# 表示エリア
            "title"       => $data->{title},	# タイトル
            "link"        => $data->{link}, 	# リンク先
            "update_date" => sprintf("%04d\/%02d\/%02d\-%02d\:%02d\:%02d", split(/[\-\s\/\:]/, $today)) # 更新日時
        }
    });
}

1;
