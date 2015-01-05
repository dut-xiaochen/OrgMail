package DA::Ajax;
###################################################
##  INSUITE(R)Enterprise Version 2.0.0.          ##
##  Copyright(C)2006 DreamArts Corporation.      ##
##  All rights to INSUITE routines reserved.     ##
###################################################
BEGIN {
	use DA::Ajax::XML();
	use DA::Ajax::Mailer();
	use DA::System();
	use DA::Gettext;
	use JSON();
}
use strict;

## COMMON Method ------------------------------------------>>
my $AJAX_INTERNAL_CHARSET = "UTF-8";
my $AJAX_EXTERNAL_CHARSET = "UTF-8";
my $AJAX_DATA_FORMAT      = "JSON";
my $LOCK_EXPIRE           = 60; # sec

sub internal_charset {
	return(DA::Unicode::internal_charset());
}

sub external_charset {
	return($AJAX_EXTERNAL_CHARSET);
}

sub read_query($$) {
	my ($query, $input) = @_;
	my $c = {};

	if (internal_charset() eq "UTF-8") {
		foreach my $i (@{$input}) {
			$c->{$i} = $query->param($i);
			$c->{$i} = DA::Ajax::encode($c->{$i}, 0, 0, "utf8", "utf8");
		}
	} else {
		foreach my $i (@{$input}) {
			$c->{$i} = $query->param($i);
			$c->{$i} = DA::Ajax::encode($c->{$i}, 0, 0, "utf8", "euc");
		}
	}

	return($c);
}

sub parse_query($) {
	my ($query) = @_;
	my $data = {};

	if ($query =~ /\.cgi(?:\?|\%3[fF])([^\"\'\;]+)/) {
		foreach my $item (split(/(?:\&|\%20)/, $1)) {
			my ($key, $value) = split(/\=/, $item);
			$data->{$key} = $value;
		}
	}

	return($data);
}

sub pack_url($) {
	my ($buf) = @_;
	my $url = pack("H*", $buf);

	return($url);
}

sub unpack_url($) {
	my ($url) = @_;
	my $buf = unpack("H*", "$DA::Vars::p->{cgi_rdir}/$url");

	return($buf);
}

sub simple_encode($) {
	my ($in) = @_;

	$in =~ s/&/&amp;/g; $in =~ s/"/&quot;/g;
	$in =~ s/</&lt;/g; $in =~ s/>/&gt;/g;

	return($in);
}

sub simple_decode($) {
	my ($in) = @_;

	$in =~ s/\&lt;/</g; $in =~ s/&gt;/>/g;
	$in =~ s/\&quot\;/"/g; $in =~ s/&amp;/&/g;

	return($in);
}

sub encode($;$;$;$;$) {
	my ($in, $cr, $tag, $from, $to) = @_;
	my $to_charset;

	if ($in eq "") {
		return("");
	}
	if (!$from) {
		$from = "utf8";
	}
	if ($to eq "utf8") {
		$to_charset = "UTF-8";
	} elsif ($to eq "sjis") {
		$to_charset = "Shift_JIS";
	} elsif ($to eq "euc") {
		$to_charset = "EUC-JP";
	} else {
		$to_charset = internal_charset();
	}

	if ($from eq 'utf8') {
		if (check_gaiji($in, "UTF-8")) {
			return(undef);
		}
		$in = DA::Charset::convert(\$in, "UTF-8", $to_charset);
	} elsif ($from eq "sjis") {
		if (check_gaiji($in, "Shift-JIS")) {
			return(undef);
		}
		$in = DA::Charset::convert(\$in, "Shift_JIS", $to_charset);
	} elsif ($from eq "euc") {
		$in = DA::Charset::convert(\$in, "EUC-JP", $to_charset);
	}
	# -- filter
	$in = DA::Charset::filter(\$in, "h2z", $to_charset);

	if ($tag eq 1) {
		$in =~ s/&/&amp;/g; $in =~ s/"/&quot;/g;
		$in =~ s/</&lt;/g; $in =~ s/>/&gt;/g;
	}
	if ($cr eq 1) {
		$in =~ tr/\x0D\x0A//d;
	} elsif ($cr eq 2) {
		$in =~ s/\x0D\x0A/<br>/g;
		$in =~ s/\x0D/<br>/g;
		$in =~ s/\x0A/<br>/g;
	} elsif ($cr eq 3) {
		$in =~s/([^\r\n]+)([\r\n]|$)/<p>$1<\/p>$2/g;
		$in =~s/(^|[\r\n])([\r\n])/$1<p>&nbsp;<\/p>$2/mg;
	}

	return($in);
}

sub decode($;$;$) {
	my ($in, $cr, $tag) = @_;

	if ($in eq "") {
		return("");
	}

	$in =~ s/<return>/\n/g;

	if ($cr eq 1) {
		$in =~ s/<br>/\n/g;
	} elsif ($cr eq 3) {
		$in =~ s/<p>\&nbsp\;<\/p>(\r\n|$)?/$1/gi;
		$in =~ s/<p>([^<>]*)<\/p>(\r\n|$)?/$1$2/gi;
	}
	if ($tag eq 1) {
		$in =~ s/\&lt;/</g;   $in =~ s/&gt;/>/g;
		$in =~ s/\&quot\;/"/g; $in =~ s/&amp;/&/g;
		$in =~ s/<br clear="all">//gi;
	}

	return($in);
}

sub check_gaiji($;$;$) {
	my ($in, $win, $charset) = @_;

	if ($in eq "") {
		return(0);
	}
	if ($charset eq "") {
		$charset = external_charset();
	}
	my ($status, $len) = DA::Charset::verify(\$in, $charset);

	#==========================================
	#        Custom
	#==========================================
	DA::Custom::chg_verify_status(\$status);
	#==========================================

	if ($status < 0) {
		return(1);
	} else {
		return(0);
	}
}

sub user_search_ok($) {
	my ($session) = @_;

	if (&user_agent_ok($session) && $DA::Vars::p->{ria}->{ajax_user_search} ne "off") {
		if ($session->{ajax_user_search} eq "off") {
			return(0);
		} else {
			return(1);
		}
	} else {
		return(0);
	}
}

sub date_selector_ok($) {
	my ($session) = @_;

	if (&user_agent_ok($session) && $DA::Vars::p->{ria}->{ajax_date_selector} ne "off") {
		if ($session->{ajax_date_selector} eq "off") {
			return(0);
		} else {
			return(1);
		}
	} else {
		return(0);
	}
}

sub time_slider_ok($) {
	my ($session) = @_;

	if (&user_agent_ok($session) && $DA::Vars::p->{ria}->{ajax_time_slider} ne "off") {
		if ($session->{ajax_time_slider} eq "off") {
			return(0);
		} else {
			return(1);
		}
	} else {
		return(0);
	}
}

sub mailer_ok($) {
	my ($session) = @_;

	if (DA::IS::check_option_app_license($session, "ajxmailer")) {
		if (&mailer_style_ok($session) && &user_agent_ok($session)) {
			return(1);
		} else {
			return(0);
		}
	} else {
		# 強制的に classic に変更する動作は 廃止
		return(0);
	}
}

sub mailer_license_ok($) {
	my ($session) = @_;

	if (DA::IS::check_option_app_license($session, "ajxmailer")) {
		return(1);
	} else {
		return(0);
	}
}

sub mailer_style_ok($) {
	my ($session) = @_;

	if ($session->{mailer_style} eq "ajax") {
		return(1);
	} else {
		return(0);
	}
}

sub user_agent_ok($) {
	my ($session) = @_;

	if ($ENV{SCRIPT_NAME} =~ /\/cgi\-bin\/chk\_recent\.cgi/) {
		return(1);
	} else {
	if ($ENV{HTTP_USER_AGENT} ne "" && $ENV{HTTP_USER_AGENT} =~ /$DA::Vars::p->{ria}->{ajax_nosupport_user_agent}/) {
		return(0);
	} else {
		return(1);
	}
	}
}

sub new_mail_url($$) {
	my ($session, $param) = @_;

	if (&mailer_ok($session)) {
		my $data = parse_query($param);
		my $proc = $data->{proc};
		my $query;
		if ($proc eq "set") {
			if ($data->{status} eq "aid") {
				if ($data->{pack}) {
					$query = "proc=bulk&aid=$data->{to}";
				} else {
					$query = "proc=bulk&aid=" . unpack("H*", $data->{to});
				}
			} else {
				if ($data->{pack}) {
					$query = "proc=email&email=$data->{to}";
				} else {
					$query = "proc=email&email=" . unpack("H*", $data->{to});
				}
			}
		} elsif ($proc eq "unset") {
			$query = "proc=object";
		} elsif ($proc eq "gsend") {
			$query = "proc=group&gid=$data->{gid}";
		} elsif ($proc eq "ml") {
			$query = "proc=epsml&l=$data->{l}&r=$data->{r}"
			       . "&m=$data->{m}&n=$data->{n}";
		} else {
			$query = "";
		}

		my $url    = "$DA::Vars::p->{cgi_rdir}/ajax_mailer.cgi?html=editor&richtext=1&"
		           . "external=1&url=" . &unpack_url("ajx_ma_new.cgi?" . $query);
           $url    =  DA::IS::add_check_key_url($url);
		my $popup  = DA::Ajax::Mailer::get_popup_size_from_session($session);
		my $width  = int($popup->{editor_window_width});
		my $height = int($popup->{editor_window_height});
		my $pop    = "Pop4AjaxWithMailAccount('$url', '$width', '$height');";

		return($pop);
	} else {
		return($param);
	}
}

# To のみ
sub new_mail_url4href($$) {
	my ($session, $email) = @_;

	if (&mailer_ok($session)) {
		my $query = "proc=email&email=" . unpack("H*", $email);
		my $url    = "$DA::Vars::p->{cgi_rdir}/ajax_mailer.cgi?html=editor&richtext=1&"
		           . "external=1&url=" . &unpack_url("ajx_ma_new.cgi?" . $query);
		my $popup  = DA::Ajax::Mailer::get_popup_size_from_session($session);
		my $width  = int($popup->{editor_window_width});
		my $height = int($popup->{editor_window_height});
		my $pop    = "javascript:Pop4AjaxWithMailAccount('$url', '$width', '$height');";

		return($pop);
	} else {
		return("mailto\:$email");
	}
}

# To 以外にも対応
# ただし、上位でＵＲＬを保存したファイルを作成する必要がある
sub new_mail_url4href_ext($$$$) {
       my ($session, $id, $no, $email) = @_;

       if (&mailer_ok($session)) {
               my $query = "proc=email_ext&id=$id&no=$no";
               my $url    = "$DA::Vars::p->{cgi_rdir}/ajax_mailer.cgi?html=editor&richtext=1&"
                          . "external=1&url=" . &unpack_url("ajx_ma_new.cgi?" . $query);
               my $popup  = DA::Ajax::Mailer::get_popup_size_from_session($session);
               my $width  = int($popup->{editor_window_width});
               my $height = int($popup->{editor_window_height});
               my $pop    = "javascript:Pop4AjaxWithMailAccount('$url', '$width', '$height');";

               return($pop);
       } else {
               return("mailto\:$email");
       }
}

sub object_mail_url($$) {
	my ($session, $param) = @_;

	if (&mailer_ok($session)
	&&  $param =~ /Pop\('([^\,]+),'pop_title_(?:emlresend|emledit|emlreply|emlreplyall|emlforward|email|mkeml)\.gif'/) {
		my $url    = $1;
		   $url    =~s/\%3[fF]/\?/g;
		   $url    =~s/\%20/\&/g;
		my $popup  = DA::Ajax::Mailer::get_popup_size_from_session($session);
	my $width  = int($popup->{editor_window_width});
	my $height = int($popup->{editor_window_height});
        my $pop    = "Pop4AjaxWithMailAccount('$url, '$width', '$height');";

        return($pop);
    } else {
        return($param);
    }
}

sub detail_mail_url($$$;$) {
	my ($session, $fid, $uid, $srid) = @_;
	my $url    = "$DA::Vars::p->{cgi_rdir}/ajax_mailer.cgi?html=viewer&"
	           . "external=1&fid=$fid&uid=$uid&srid=$srid";
	my $width  = 800;
	my $height = 600;
	my $pop    = "Pop4AjaxWithMailAccount('$url', '$width', '$height');";

	return($pop);
}

sub check_use_classic_mailer($) {
	my ($session) = @_;

	if (&mailer_ok($session)) {
		DA::CGIdef::errorpage($session, t_("統合メーラ(ニュースタイル)が選択されています。"), "nobutton");
	}
}


sub lockfile($$) {
	my ($session, $file) = @_;
	my $no = sprintf("%02d", int($session->{user}%100));
	my $lock = "$DA::Vars::p->{lock100_dir}/$no/$session->{user}.Ajax.$file";

	return($lock);
}

sub lock($$;$;$;$) {
	my ($session, $file, $try, $sec, $wait) = @_;
	my $lock = &lockfile($session, $file);

	if (!$try) {
		$try = 5;
	}
	if (!$wait) {
		$wait = 3;
	}
	if (!$sec) {
		$sec = $LOCK_EXPIRE;
	}
	if ($sec) {
		my $info = DA::CGIdef::get_f_info($lock);
		if ($info) {
			my $expire = int($info->{ctime}) + int($sec);
			my $now    = DA::System::nfs_time();
			if ($expire < $now) {
				my $res = DA::System::file_rmdir($lock);
			}
		}
	}
	while (!DA::System::file_mkdir("$lock", 0777)) {
		if (--$try < 0) {
			return(0);
		}
		sleep($wait);
	}

	return(1);
}

sub unlock($$) {
	my ($session, $file) = @_;
	my $lock = &lockfile($session, $file);

	if (my $res = DA::System::file_rmdir($lock)) {
		return(1);
	} else {
		return(0);
	}
}

sub storablefile($$) {
	my ($session, $func) = @_;
	my $file = "$session->{temp_dir}/$session->{sid}.Ajax.storable.$func";

	return($file);
}

sub storable_exist($$) {
	my ($session, $func) = @_;
	my $file = &storablefile($session, $func);

	if (DA::Unicode::file_exist($file)) {
		return(1);
	} else {
		return(0);
	}
}

sub storable_retrieve($$) {
	my ($session, $func) = @_;
	my $file = &storablefile($session, $func);

	if (&lock($session, "storable.$func")) {
		my $param = DA::Unicode::storable_retrieve($file);

		&unlock($session, "storable.$func");

		return($param);
	} else {
		return(undef);
	}
}

sub storable_store($$$) {
	my ($session, $param, $func) = @_;
	my $file = &storablefile($session, $func);

	if (&lock($session, "storable.$func")) {
		DA::Unicode::storable_store($param, $file);

		&unlock($session, "storable.$func");

		return(1);
	} else {
		return(undef);
	}
}

sub storable_clear($$) {
	my ($session, $func) = @_;
	my $file = &storablefile($session, $func);

	if (&lock($session, "storable.$func")) {
		DA::System::file_unlink($file);

		&unlock($session, "storable.$func");

		return(1);
	} else {
		return(undef);
	}
}

## <<------------------------------------------ COMMON Method

## XML Method --------------------------------------------->>
my $XML_CONTENT_TYPE  = "Content-Type: text/xml;";
my $JSON_CONTENT_TYPE = "Content-Type: text/javascript;";
my $FORM_CONTENT_TYPE = "Content-Type: text/html;";

sub scriptname($) {
	my ($proc) = @_;
	my $cgi;

	if ($ENV{SCRIPT_NAME} =~ /\/([^\/]+?\.cgi)/) {
		$cgi = $1;
		unless ($proc) {
			$proc = "_common";
		}
	}

	return($cgi, $proc);
}

sub print_xml($$;$;$) {
	my ($session, $data, $proc, $charset) = @_;
	unless ($charset) {
		$charset = &internal_charset();
	}

	if ($AJAX_DATA_FORMAT eq "JSON") {
		print &make_json_head($session, $proc);
		print &make_json($session, $data, $proc, $charset);
	} else {
		print &make_xml_head($session, $proc);
		print &make_xml($session, $data, $proc, $charset);
	}

	$session->{dbh}->disconnect();

	return(1);
}

sub error_xml($$;$;$) {
	my ($session, $error, $proc, $charset) = @_;
	my $data;

	unless ($charset) {
		$charset = &internal_charset();
	}
	if (ref($error) eq "HASH") {
		$data = {
			"result" => {
				"error"   => $error->{error},
				"message" => $error->{message}
			}
		};
	} else {
		$data = {
			"result" => {
				"error"   => 9,
				"message" => $error
			}
		};
	}

	if ($AJAX_DATA_FORMAT eq "JSON") {
		print &make_json_head($session, $proc);
		print &make_json($session, $data, $proc, $charset);
	} else {
		print &make_xml_head($session, $proc);
		print &make_xml($session, $data, $proc, $charset);
	}

	$session->{dbh}->disconnect();

	Apache::exit();
}

sub make_xml_head($;$) {
	my ($session, $proc) = @_;
	my $cgi;

	($cgi, $proc) = &scriptname($proc);

	my $type = $XML_CONTENT_TYPE;
	my $head = $type . "\n"
	         . "Cache-Control: no-store, no-cache, must-revalidate;\n"
	         . "Cache-Control: post-check=0, pre-check=0;\n"
	         . "Pragma: no-cache;\n\n";

	return($head);
}

sub make_json_head($;$) {
	my ($session, $proc) = @_;
	my $cgi;

	($cgi, $proc) = &scriptname($proc);

	my $type = $JSON_CONTENT_TYPE;
	if ($cgi && $proc) {
		if (exists $DA::Ajax::XML::elements->{$cgi}->{$proc}) {
			if ($DA::Ajax::XML::elements->{$cgi}->{$proc}->{_form}) {
				$type = $FORM_CONTENT_TYPE;
			}
		}
	}

	my $head = $type . "\n"
	         . "Cache-Control: no-store, no-cache, must-revalidate;\n"
	         . "Cache-Control: post-check=0, pre-check=0;\n"
	         . "Pragma: no-cache;\n\n";

	return($head);
}

sub make_json($$;$;$;$;$) {
	my ($session, $data, $proc, $internal, $external, $slash) = @_;
	my ($cgi, $form, $elements, $default);

	unless ($internal) {
		$internal = &internal_charset();
	}
	unless ($external) {
		$external = &external_charset();
	}

	($cgi, $proc) = &scriptname($proc);

	if ($cgi && $proc) {
		if (exists $DA::Ajax::XML::elements->{$cgi}->{$proc}) {
			if ($DA::Ajax::XML::elements->{$cgi}->{$proc}->{_form}) {
				$form = 1;
			}
			$elements = $DA::Ajax::XML::elements->{$cgi}->{$proc};
			$default  = $DA::Ajax::XML::elements->{$cgi}->{$proc}->{_type};
		} else {
			$elements = {};
		}
	} else {
		$elements = {};
	}

	my $obj  = &_make_json($session, $data, $elements, $default);
	my $json = JSON::objToJson($obj, {autoconv => 0});

	if ($slash) {
		$json =~s/\//\\\//g;
	}

	if ($form) {
		$json = "<html>"
		      . "<head>"
		      . "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=" . $external . "\">"
		      . "</head>"
		      . DA::Charset::convert(\$json, $internal, $external)
		      . "</html>";
	} else {
		$json = DA::Charset::convert(\$json, $internal, $external);
	}

	return($json);
}

sub _make_json($$;$;$) {
	my ($session, $data, $elements, $default) = @_;
	my $type = ($elements->{_type}) ? $elements->{_type} : $default;

	if (ref($data) eq "HASH") {
		my %h;
		foreach my $k ($elements->{_sort} ? @{$elements->{_sort}} : (keys %{$data})) {
			$h{$k} = &_make_json($session, $data->{$k}, $elements->{$k}, $type);
		}
		return(\%h);
	} elsif (ref($data) eq "ARRAY") {
		my @l;
		foreach my $l (@{$data}) {
			push(@l, &_make_json($session, $l, $elements, $type));
		}
		return(\@l);
	} else {
		if ($type eq "number") {
			return(($elements->{_type} eq "string") ? $data : JSON::Number($data));
		} else {
			return(($elements->{_type} eq "number") ? JSON::Number($data) : $data);
		}
	}
}

sub make_xml($$;$;$) {
	my ($session, $data, $proc, $charset) = @_;
	my $name  = $1 if ($0 =~ /([^\/]+)$/);
	my $depth = 0;
	my ($xml, $cgi, $sort, $keys);

	($cgi, $proc) = &scriptname($proc);

	if ($cgi && $proc) {
		if (exists $DA::Ajax::XML::elements->{$cgi}->{$proc}) {
			$sort = $DA::Ajax::XML::elements->{$cgi}->{$proc};
			$keys = $DA::Ajax::XML::elements->{$cgi}->{$proc}->{_sort};
		} else {
			$keys = [(sort keys %{$data})];
		}
	} else {
		$keys = [(sort keys %{$data})];
	}

	foreach my $key (@{$keys}) {
		if (ref($data->{$key}) eq "HASH") {
			&_hash_xml($key, $data->{$key}, $depth, \$xml, $charset, $sort->{$key});
		} elsif (ref($data->{$key}) eq "ARRAY") {
			&_array_xml($key, $data->{$key}, $depth, \$xml, $charset, $sort->{$key});
		} else {
			&_line_xml($key, $data->{$key}, $depth, \$xml, $charset, $sort->{$key});
		}
	}

	$xml = "<$name>\n"
	     . $xml
	     . "</$name>\n";

	return($xml);
}

sub _hash_xml($$$$;$;$) {
	my ($key, $ref, $depth, $xml, $charset, $sort) = @_;
	my $out = "\t" x $depth;
	my $keys;

	if (defined $sort) {
		if (exists $sort->{_sort}) {
			$keys = $sort->{_sort};
		} else {
			$keys = [(sort keys %{$ref})];
		}
	} else {
		$keys = [(sort keys %{$ref})];
	}

	$$xml .="$out<$key>\n";

	foreach my $k (@{$keys}) {
		if (ref($ref->{$k}) eq "HASH") {
			&_hash_xml($k, $ref->{$k}, $depth+1, $xml, $charset, $sort->{$k});
		} elsif (ref($ref->{$k}) eq "ARRAY") {
			&_array_xml($k, $ref->{$k}, $depth+1, $xml, $charset, $sort->{$k});
		} else {
			&_line_xml($k, $ref->{$k}, $depth+1, $xml, $charset, $sort->{$k});
		}
	}

	$$xml .="$out</$key>\n";

	return(1);
}

sub _array_xml($$$$;$;$) {
	my ($key, $ref, $depth, $xml, $charset, $sort) = @_;
	my $out = "\t" x $depth;

	if (scalar(@{$ref})) {
		foreach my $l (@{$ref}) {
			if (ref($l) eq "HASH") {
				my ($keys, $join);
				if (defined $sort) {
					if (exists $sort->{_sort}) {
						$keys = $sort->{_sort};
					} else {
						$keys = [(sort keys %{$l})];
					}
					if (exists $sort->{_join}) {
						$join = 1;
					} else {
						$join = 0;
					}
				} else {
					$keys = [(sort keys %{$l})];
				}

				if ($join) {
					my $line;
					foreach my $k (@{$keys}) {
						$line .= "$l->{$k}\t";
					}
					$line =~s/\t+$//g;

					if ($charset eq "UTF-8") {
						$line = encode($line, 0, 1, "utf8", "utf8");
					} else {
						$line = encode($line, 0, 1, "euc", "utf8");
					}

					$$xml .="$out<$key>$line</$key>\n";
				} else {
					$$xml .="$out<$key>\n";

					foreach my $k (@{$keys}) {
						&_line_xml($k, $l->{$k}, $depth+1, $xml, $charset, $sort->{$k});
					}

					$$xml .="$out</$key>\n";
				}
			} else {
				&_line_xml($key, $l->{$key}, $depth+1, $xml, $charset, $sort);
			}
		}
	} else {
		$$xml .="$out<$key></$key>\n";
	}

	return (1);
}

sub _line_xml($$$$;$;$) {
	my ($key, $value, $depth, $xml, $charset, $sort) = @_;
	my $out = "\t" x $depth;

	unless (defined $charset) {
		$charset = internal_charset();
	}
	if ($charset eq "UTF-8") {
		$value = encode($value, 0, 1, "utf8", "utf8");
	} else {
		$value = encode($value, 0, 1, "euc", "utf8");
	}

	$$xml .="$out<$key>"
	      . $value
	      . "</$key>\n";

	return(1);
}

sub parse_xml($$) {
	my ($session, $xml) = @_;
	my $data = {};

	_parse_xml($session, $xml, $data);

	return($data);
}

sub _parse_xml($$$) {
	my ($session, $xml, $data) = @_;

	while ($xml =~ s/<([^<>]+)>([\x00-\xff]*?)<\/\1>//) {
		my ($key, $value) = ($1, $2);

		if ($key =~ /\.cgi$/ && !$data->{_cgi}) {
			$data->{_cgi} = $key;
			&_parse_xml($session, $value, $data);
		} else {
			if ($key =~ /_list$/) {
				if (!defined $data->{$key}) {
					$data->{$key} = [];
				}
				if ($value =~ /[\<\>]/) {
					my $hash = {};
					&_parse_xml($session, $value, $hash);
					push(@{$data->{$key}}, $hash);
				} else {
					push(@{$data->{$key}}, decode($value, 0, 1));
				}
			} else {
				if ($value =~ /[\<\>]/) {
					my $hash = {};
					&_parse_xml($session, $value, $hash);
					$data->{$key} = $hash;
				} else {
					$data->{$key} = decode($value, 0, 1);
				}
			}
		}
	}

	return(1);
}
## <<--------------------------------------------- XML Method

## Ajax 部品用共通関数
sub get_text_calendar_params($;$) {
	my ($session, $overwrite) = @_;
	my $conf = DA::IS::get_master($session, 'schedule');
	my $lang = (DA::IS::get_user_lang($session) eq "ja") ? "ja" : "en";
	my $first = ($conf->{cal_start} eq "mon") ? 1 : 0;

	my $yy_ib = DA::CGIdef::get_date('Y4');
	my $yy_is = $yy_ib - 3;
	my $yy_ie = $yy_ib + 3;

	my ($years, $holidays, $day_colors) = DA::IS::get_holiday_params($session, $yy_is, $yy_ie);

	my $params = {
		lang => $lang,
		firstDay => JSON::Number($first),
		minYear => $yy_is,
		maxYear => $yy_ie,
		yearList => $years,
		holidayList => $holidays,
		customDayColorList => $day_colors
	};
	if ($overwrite) {
		foreach my $key (keys %{$overwrite}) {
			$params->{$key} = $overwrite->{$key};
		}
	}
	my $json = DA::Ajax::make_json($session, $params, undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset());

	return($json);
}

sub get_inc_search_params($;$) {
	my ($session, $overwrite) = @_;
	my $params = {
		selectorNode => "USERSEL_id",
		appType      => "common_usersel",
		onlyOne      => JSON::False,
		userType     => JSON::Number(1),
		groupType    => JSON::Number(7),
		pageSize     => JSON::Number(0),
		readRow      => JSON::Number(100),
		textSize     => JSON::Number(40),
		denyAdd      => JSON::False,
		denyRemove   => JSON::False,
		queryDelay   => JSON::Number(1000),
		searchTitle  => t_("検索") . ":",
		imageData    => DA::Ajax::API::get_image_data4inc_search($session),
		initRecord   => [],
		initContents => ''
	};
	if ($overwrite) {
		foreach my $key (keys %{$overwrite}) {
			$params->{$key} = $overwrite->{$key};
		}
	}
	my $json = DA::Ajax::make_json($session, $params, undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset());

	return($json);
}

sub get_account_control_params($;$) {
	my ($session, $overwrite) = @_;
	my $params = {};
	if ($overwrite) {
		foreach my $key (keys %{$overwrite}) {
			$params->{$key} = $overwrite->{$key};
		}
	}
	my $json = DA::Ajax::make_json($session, $params, undef, DA::Unicode::internal_charset(), DA::Unicode::internal_charset());

	return($json);
}

1;

