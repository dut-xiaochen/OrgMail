package DA::Ajax::XML;
###################################################
##  INSUITE(R)Enterprise Version 2.0.0.          ##
##  Copyright(C)2006 DreamArts Corporation.      ##
##  All rights to INSUITE routines reserved.     ##
###################################################
BEGIN {
	use DA::Gettext;
}
use strict;

$DA::Ajax::XML::elements = {
	"ajax_mailer.cgi" => {
		"_common" => {
			"_sort" => [qw(charset mid sessionKey jsRdir cssRdir imgRdir clrRdir cgiRdir appRdir appletRdir appletFile appletImage appletFiler appletMaxFile appletLabel appletUploadMessage appletMoreThanMaxMessage appletDisabledMessage appletTipMessage folderType ugType richText license hibiki system config options custom new_mail check_key_url html user_information_restriction error)],
			"_type" => "string",
			"folderType" => {
				"_sort" => [qw(root server inbox draft sent trash spam default mailbox cabinet localServer localFolder join backupFolder)],
				"_type" => "number"
			},
			"ugType" => {
				"_sort" => [qw(addr user group bulk ml)],
				"_type" => "number"
			},
			"richText" => {
				"_sort" => [qw(headRTE type fckconfig)],
				"_type" => "string",
				fckconfig => {
					"_sort" =>[qw(debug custom_file lang sm_link sh_link lib_link editor_style font font_size)],
					"_type" => "string"
				}
			},
			"license" => {
				"_sort" => [qw(hibiki_sales)],
				"_type" => "number"
			},
			"hibiki" => {
				"_sort" => [qw(sales)],
				"sales" => {
					"_sort" => [qw(name)],
					"_type" => "string"
				}
			},
			"system" => {
				"_sort" => [qw(guide search_target max_number_per_page4ajx max_send_size max_search_hit max_incsearch_hits max_send_size_visible inc_search_interval inc_search_min_chars sales_datalink_enable no_replied_flag no_forwarded_flag open_status auto_fix_consistency upload_retry4ajx auto_backup_interval auto_backup_on spellcheck_button_visible change_org_mail_style)],
				"_type" => "number",
				"max_send_size_visible" => { "_type" => "string" },
				"inc_search_interval" => {"_type" => "string" },
				"sales_datalink_enable" => {"_type" => "string" },
				"auto_fix_consistency" => {"_type" => "string" }
			},
			"config" => {
				"_sort" => [qw(window_pos_x window_pos_y window_width window_height dir_width list_height mail_to_resize_num detail_header_open detail_header_to_open detail_header_cc_open detail_header_attachment_open list_order backup_list_order list_width delete count recent backup backup_exists backup_msg_show update_time archive_list archive soft_install download_type quote_reply quote_forward toself_color template font viewer_width viewer_height editor_width editor_height width_addr height_addr spellcheck spellcheck_mode upload_file_applet attachment_length auto_fix_consistency b_wrap cap_size_unit forced_interruption save_to_lib)],
				"_type" => "number",
				"list_order" => { "_type" => "string" },
				"backup_list_order" => { "_type" => "string" },
				"attachment_length" => { "_type" => "string" },
				"list_width" => {
					"_sort" => [qw(attachment date flagged from priority seen size subject)],
					"_type" => "number"
				},
				"count" => { "_type" => "string" },
				"recent" => { "_type" => "string" },
				"backup" => { "_type" => "string" },
				"archive_list" => { "_type" => "string" },
				"archive" => { "_type" => "string" },
				"download_type" => { "_type" => "string" },
				"toself_color" => { "_type" => "string" },
				"template" => {
					"_sort" => [qw(tid name)],
					"_type" => "number",
					"name" => { "_type" => "string" }
				},
				"font" => { "_type" => "string" },
				"auto_fix_consistency" => { "_type" => "string" },
                "spellcheck" => { "_type" => "string" },
				"spellcheck_mode" => { "_type" => "string" },
				"upload_file_applet" => { "_type" => "string" },
				"b_wrap" => { "_type" => "string" },
				"cap_size_unit" => { "_type" => "string" },
				"forced_interruption" => { "_type" => "string" }
			},
			"options" => {
				"_sort" => [qw(folder_tree)],
				"_type" => "string"
			},
			"custom" => {
				"_sort" => [qw(threePane viewer editor searcher menu)],
				"_type" => "string",
				"threePane" => {
					"_sort" => [qw(setQuota updateFolder setTopPanel setAddressInsertProc)]
				},
				"viewer" => {
					"_sort" => [qw(headerOpen headerClose setTopPanel setMessageViewer setMessageViewer2)]
				},
				"editor" => {
					"_sort" => [qw(headerOpen headerClose setTopPanel setMessageEditor setMessageEditor2 setAddressProc)]
				},
				"searcher" => {
					"_sort" => [qw(setMessageSearcher setMessageSearcher2)]
				},
                "menu" => {
                    "_sort" => [qw(setPopupMenu)]
                }
			},
			"html" => {
				"_sort" => [qw(viewer editor)],
				"_type" => "string"
			},
			"user_information_restriction" => {
				"_sort" => [qw(title_name title pmail1 pmail2 keitai_mail)],
				"_type" => "string"
			},
			"error" => {
				"_sort" => [qw(error message)],
				"_type" => "number",
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_dir.cgi" => {
		"_common" => {
			"_sort" => [qw(quota use next_fid folder_list result)],
			"_type" => "number",
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)],
			},
			"folder_list" => {
				"_sort" => [qw(fid parent uidvalidity name type icon alt hidden select update create rename delete move import export filter rebuild trash move_f move_m open_m edit_m trash_m messages unseen recent messages_e unseen_e recent_e)],
				"name" => { "_type" => "string" },
				"icon" => { "_type" => "string" },
				"alt" => { "_type" => "string" }
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"create" => {
			"_sort" => [qw(quota use result next_fid)],
			"_type" => "number",
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"rename" => {
			"_sort" => [qw(quota use result next_fid)],
			"_type" => "number",
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"delete" => {
			"_sort" => [qw(quota use result next_fid)],
			"_type" => "number",
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"move" => {
			"_sort" => [qw(quota use result next_fid)],
			"_type" => "number",
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_list.cgi" => {
		"_common" => {
			"_sort" => [qw(fid cid type filter_view_list total view mail_list start_sno select_sno result)],
			"_type" => "number",
			"filter_view_list" => {
				"_sort" => [qw(cid name)],
				"name" => { "_type" => "string" }
			},
			"total" => {
				"_sort" => [qw(messages unseen recent)]
			},
			"view" => {
				"_sort" => [qw(messages)]
			},
			"mail_list" => {
				"_sort" => [qw(meta html)],
				"meta" => {
					"_sort" => [qw(fid uid srid sno replied forwarded deleted toself internal priority seen attachment flagged className open_m type reserve1 reserve2 backup_maid backup_org_clrRdir)],
					"_type" => { "_type" => "number" },
					"internal" => { "_type" => "string" },
					"className" => { "_type" => "string" },
					"backup_org_clrRdir" => { "_type" => "string" }
				},
				"html" => { "_type" => "string" }
			},
			# "mail_list" => {
			#	"_sort" => [qw(fid uid srid sno replied forwarded deleted toself internal priority seen attachment flagged className)],
			#	"_type" => { "_type" => "string" },
			#	"fid" => { "_type" => "number" },
			#	"uid" => { "_type" => "number" },
			#	"srid" => { "_type" => "number" },
			#	"sno" => { "_type" => "number" },
			#	"replied" => { "_type" => "number" },
			#	"forwarded" => { "_type" => "number" },
			#	"deleted" => { "_type" => "number" },
			#	"toself" => { "_type" => "number" },
			#	"priority" => { "_type" => "number" },
			#	"seen" => { "_type" => "number" },
			#	"attachment" => { "_type" => "number" },
			#	"flagged" => { "_type" => "number" }
			# },
			"start_sno" => { "_type" => "number" },
			"select_sno" => { "_type" => "number" },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"uid" => {
			"_sort" => [qw(fid cid type read_row target_sno filter_view_list total view mail_list result)],
			"_type" => "number",
			"filter_view_list" => {
				"_sort" => [qw(cid name)],
				"name" => { "_type" => "string" }
			},
			"total" => {
				"_sort" => [qw(messages unseen recent)]
			},
			"view" => {
				"_sort" => [qw(messages)]
			},
			"mail_list" => {
				"_sort" => [qw(meta html)],
				"meta" => {
				"_sort" => [qw(fid uid srid sno replied forwarded deleted toself internal priority seen attachment flagged className open_m type reserve1 reserve2)],
					"_type" => { "_type" => "number" },
					"internal" => { "_type" => "string" },
					"className" => { "_type" => "string" }
				},
				"html" => { "_type" => "string" }
			},
			# "mail_list" => {
			#	"_sort" => [qw(fid uid srid sno replied forwarded deleted toself internal priority seen attachment flagged className)],
			#	"_type" => { "_type" => "string" },
			#	"fid" => { "_type" => "number" },
			#	"uid" => { "_type" => "number" },
			#	"srid" => { "_type" => "number" },
			#	"sno" => { "_type" => "number" },
			#	"replied" => { "_type" => "number" },
			#	"forwarded" => { "_type" => "number" },
			#	"deleted" => { "_type" => "number" },
			#	"toself" => { "_type" => "number" },
			#	"priority" => { "_type" => "number" },
			#	"seen" => { "_type" => "number" },
			#	"attachment" => { "_type" => "number" },
			#	"flagged" => { "_type" => "number" }
			# },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"update" => {
			"_sort" => [qw(fid cid trash_fid type filter_view_list quota use total count_list result)],
			"_type" => "number",
			"filter_view_list" => {
				"_sort" => [qw(cid name)],
				"name" => { "_type" => "string" }
			},
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"total" => {
				"_sort" => [qw(messages unseen recent)]
			},
			"count_list" => {
				"_sort" => [qw(fid messages unseen recent)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_search.cgi" => {
		"_common" => {
			"_sort" => [qw(fid srid cid type filter_view_list mail_list result)],
			"_type" => "number",
			"filter_view_list" => {
				"_sort" => [qw(cid name)],
				"name" => { "_type" => "string" }
			},
			"mail_list" => {
				"_sort" => [qw(meta html)],
				"meta" => {
				"_sort" => [qw(fid uid srid sno replied forwarded deleted toself internal priority seen attachment flagged className open_m type reserve1 reserve2)],
					"_type" => { "_type" => "number" },
					"internal" => { "_type" => "string" },
					"className" => { "_type" => "string" }
				},
				"html" => { "_type" => "string" }
			},
			# "mail_list" => {
			#	"_sort" => [qw(srid fid uid srid sno replied forwarded deleted toself internal priority seen attachment flagged className)],
			#	"_type" => { "_type" => "string" },
			#	"fid" => { "_type" => "number" },
			#	"uid" => { "_type" => "number" },
			#	"srid" => { "_type" => "number" },
			#	"sno" => { "_type" => "number" },
			#	"replied" => { "_type" => "number" },
			#	"forwarded" => { "_type" => "number" },
			#	"deleted" => { "_type" => "number" },
			#	"toself" => { "_type" => "number" },
			#	"priority" => { "_type" => "number" },
			#	"seen" => { "_type" => "number" },
			#	"attachment" => { "_type" => "number" },
			#	"flagged" => { "_type" => "number" }
			# },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
        },
		"uid" => {
			"_sort" => [qw(fid srid cid type read_row target_sno filter_view_list mail_list result)],
			"_type" => "number",
			"filter_view_list" => {
				"_sort" => [qw(cid name)],
				"name" =>  { "_type" => "string" }
			},
			"mail_list" => {
				"_sort" => [qw(meta html)],
				"meta" => {
					"_sort" => [qw(fid uid srid sno replied forwarded deleted toself internal priority seen attachment flagged className open_m type reserve1 reserve2)],
					"_type" => { "_type" => "number" },
					"internal" => { "_type" => "string" },
					"className" => { "_type" => "string" }
				},
				"html" => { "_type" => "string" }
			},
			# "mail_list" => {
			#	"_sort" => [qw(fid uid srid sno replied forwarded deleted toself internal priority seen attachment flagged className)],
			#	"_type" => { "_type" => "string" },
			#	"fid" => { "_type" => "number" },
			#	"uid" => { "_type" => "number" },
			#	"srid" => { "_type" => "number" },
			#	"sno" => { "_type" => "number" },
			#	"replied" => { "_type" => "number" },
			#	"forwarded" => { "_type" => "number" },
			#	"deleted" => { "_type" => "number" },
			#	"toself" => { "_type" => "number" },
			#	"priority" => { "_type" => "number" },
			#	"seen" => { "_type" => "number" },
			#	"attachment" => { "_type" => "number" },
			#	"flagged" => { "_type" => "number" }
			# },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
        },
		"search" => {
			"_sort" => [qw(fid cid trash_fid type filter_view_list target total srid over result)],
			"_type" => "number",
			"filter_view_list" => {
				"_sort" => [qw(cid name)],
				"name" =>  { "_type" => "string" }
			},
			"target" => { "_type" => "string" },
			"total" => {
				"_sort" => [qw(messages)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
        }
	},
	"ajx_ma_move.cgi" => {
		"_common" => {
			"_sort" => [qw(quota use total count_list result)],
			"_type" => "number",
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"total" => {
				"_sort" => [qw(messages unseen recent)]
			},
			"count_list" => {
				"_sort" => [qw(fid messages unseen recent)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"import" => {
			"_sort" => [qw(quota use total count_list result)],
			"_type" => "number",
			"_form" => 1,
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"total" => {
				"_sort" => [qw(messages unseen recent)]
			},
			"count_list" => {
				"_sort" => [qw(fid messages unseen recent)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"export" => {
			"_sort" => [qw(quota use file file_name result)],
			"_type" => "number",
			"file" => { "_type" => "string" },
			"file_name" => { "_type" => "string" },
            "quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
            },
            "use" => {
                "_sort" => [qw(messages storage)]
            },
            "result" => {
                "_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
            }
		},
		"join" => {
			"_sort" => [qw(quota use fid uid result)],
			"_type" => "number",
			"uid"   => { "_type" => "string" },
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_flag.cgi" => {
		"_common" => {
			"_sort" => [qw(quota use total count_list result)],
			"_type" => "number",
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"total" => {
				"_sort" => [qw(messages unseen recent)]
			},
			"count_list" => {
				"_sort" => [qw(fid messages unseen recent)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_filter.cgi" => {
		"_common" => {
			"_sort" => [qw(quota use count_list result)],
			"_type" => "number",
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"count_list" => {
				"_sort" => [qw(fid messages unseen recent)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"add" => {
			"_sort" => [qw(result)],
			"_type" => "number",
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_mainte.cgi" => {
		"_common" => {
			"_sort" => [qw(quota use total count_list result)],
			"_type" => "number",
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"total" => {
				"_sort" => [qw(messages unseen recent)]
			},
			"count_list" => {
				"_sort" => [qw(fid messages unseen recent)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_addr_regist.cgi" => {
		"add" => {
			"_sort" => [qw(result)],
			"_type" => "number",
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_addr_search.cgi" => {
		"_common" => {
			"_sort" => [qw(user_list count over result)],
			"_type" => "number",
			"user_list" => {
				"_sort" => [qw(id type name_hit name name1 name2 nameM kana_hit kana alpha_hit alpha lang title title_pos email_hit email keitai_mail_hit keitai_mail pmail1_hit pmail1 pmail2_hit pmail2 icon alt link regist gid gname external)],
				"_join" => 0,
				"id" => { "_type" => "string" },
				"name" => { "_type" => "string" },
				"name1" => { "_type" => "string" },
				"name2" => { "_type" => "string" },
				"nameM" => { "_type" => "string" },
				"kana" => { "_type" => "string" },
				"alpha" => { "_type" => "string" },
				"lang" => { "_type" => "string" },
				"title" => { "_type" => "string" },
				"email" => { "_type" => "string" },
				"keitai_mail" => { "_type" => "string" },
				"pmail1" => { "_type" => "string" },
				"pmail2" => { "_type" => "string" },
				"icon" => { "_type" => "string" },
				"alt" => { "_type" => "string" },
				"link" => { "_type" => "string" },
				"regist" => { "_type" => "string" },
				"gname" => { "_type" => "string" }
			},
			"count" => {
				"_sort" => [qw(user cache)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_detail.cgi" => {
		"_common" => {
			"_sort" => [qw(fid uid srid type edit_m sales_m export priority seen flagged replied forwarded deleted toself attachment notification to_list cc_list bcc_list sender_list from_list date message_id in_reply_to references subject body attach_list reserve1 reserve2 result)],
			"_type" => "number",
			"date" => { "_type" => "string" },
			"message_id" => { "_type" => "string" },
			"in_reply_to" => { "_type" => "string" },
			"references" => { "_type" => "string" },
			"subject" => { "_type" => "string" },
			"to_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"cc_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"bcc_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"sender_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"from_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"body" => {
				"_sort" => [qw(text html)],
				"_type" => { "_type" => "string" }
			},
			"attach_list" => {
				"_sort" => [qw(aid name icon size warn link document title)],
				"_type" => "string",
				"aid" => { "_type" => "number" },
				"size" => { "_type" => "number" }
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"header" => {
			"_sort" => [qw(header result)],
			"_type" => "number",
			"header" => { "_type" => "string" },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_new.cgi" => {
		"_common" => {
			"_sort" => [qw(maid tid sid priority charset content_type content_type_all notification preview reply_use group_name open_status lang_list title_list template_list sign_list to_list cc_list bcc_list to_text cc_text bcc_text from sign_init in_reply_to references subject body attach_list mode reserve1 reserve2 result hide_save_button)],
			"_type" => "number",
			"charset" => { "_type" => "string" },
			"hide_save_button" => { "_type" => "string" },
			"content_type" => {"_type" => "string" },
			"content_type_all" => {"_type" => "string" },
			"to_text" => { "_type" => "string" },
			"cc_text" => { "_type" => "string" },
			"bcc_text" => { "_type" => "string" },
			"in_reply_to" => { "_type" => "string" },
			"references" => { "_type" => "string" },
			"subject" => { "_type" => "string" },
			"lang_list" => {
				"_sort" => [qw(lang name)],
				"lang" => { "_type" => "string" },
				"name" => { "_type" => "string" }
			},
			"title_list" => {
				"_sort" => [qw(title title_pos)],
				"title" => { "_type" => "string" }
			},
			"template_list" => {
				"_sort" => [qw(tid name)],
				"name" => { "_type" => "string" }
			},
			"sign_list" => {
				"_sort" => [qw(sid name)],
				"name" => { "_type" => "string" }
			},
			"to_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"cc_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"bcc_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"from" => {
				"_sort" => [qw(name name1 name2 nameM select email keitai_mail pmail1 pmail2)],
				"_type" => "string"
			},
			"sign_init" => {
				"_sort" => [qw(sign_init_p sign_init_p1 sign_init_p2 sign_init_pM)],
				"_type" => "string"
			},
			"body" => {
				"_sort" => [qw(text html)],
				"_type" => "string"
			},
			"attach_list" => {
				"_sort" => [qw(aid name icon size warn link document title)],
				"_type" => "string",
				"aid" => { "_type" => "number" },
				"size" => { "_type" => "number" }
			},
			"result" => {
				"_sort" => [qw(error message backup_maid)],
				"message" => { "_type" => "string" },
				"backup_maid" => { "_type" => "number" }
			}
		},
		"send" => {
			"_sort" => [qw(quota use count_list save_target result)],
			"_type" => "number",
			"save_target" => { "_type" => "string" },
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"count_list" => {
				"_sort" => [qw(fid messages unseen recent)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"draft" => {
			"_sort" => [qw(quota use count_list save_target result)],
			"_type" => "number",
			"save_target" => { "_type" => "string" },
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"count_list" => {
				"_sort" => [qw(fid messages unseen recent)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"backup" => {
			"_sort" => [qw(result)],
			"_type" => "number",
			"result" => {
				"_sort" => [qw(error message backup_maid)],
				"message" => { "_type" => "string" },
				"backup_maid" => { "_type" => "number" }
			}
		},
		"preview" => {
			"_sort" => [qw(warn to_list cc_list bcc_list from_list attach_list subject body result)],
			"_type" => "string",
			"to_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"cc_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"bcc_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"from_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"attach_list" => {
				"_sort" => [qw(aid name icon size warn link document title)],
				"_type" => "string",
				"aid" => { "_type" => "number" },
				"size" => { "_type" => "number" }
			},
			"body" => {
				"_sort" => [qw(text html)],
				"_type" => "string"
			},
			"result" => {
				"_sort" => [qw(error message)],
				"error" => { "_type" => "number" }
			}
		},
		"custom" => {
			"_sort" => [qw(quota use count_list result)],
			"_type" => "number",
			"quota" => {
				"_sort" => [qw(messages storage limit over)],
				"limit" => {
					"_sort" => [qw(messages storage)]
				},
				"over" => {
					"_sort" => [qw(messages storage)]
				}
			},
			"use" => {
				"_sort" => [qw(messages storage)]
			},
			"count_list" => {
				"_sort" => [qw(fid messages unseen recent)]
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"address" => {
			"_sort" => [qw(to_list cc_list bcc_list result)],
			"_type" => "number",
			"to_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"cc_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"bcc_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"attach" => {
			"_sort" => [qw(attach_list result)],
			"_type" => "number",
			 "attach_list" => {
				"_sort" => [qw(aid name icon size warn link document)],
				"_type" => "string",
				"aid" => { "_type" => "number" },
				"size" => { "_type" => "number" }
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_template.cgi" => {
		"_common" => {
			"_sort" => [qw(tid sid content_type content_type_all to_list cc_list bcc_list to_text cc_text bcc_text subject body result)],
			"to_text" => { "_type" => "string" },
			"cc_text" => { "_type" => "string" },
			"bcc_text" => { "_type" => "string" },
			"subject" => { "_type" => "string" },
			"content_type" => { "_type" => "string" },
			"content_type_all" => { "_type" => "string" },
			"_type" => "number",
			"to_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"cc_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"bcc_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"body" => {
				"_sort" => [qw(text html)],
				"_type" => "string"
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_sign.cgi" => {
		"_common" => {
			"_sort" => [qw(sid sign sign_pos content_type content_type_all from before_from body result)],
			"_type" => "number",
			"sign" => { "_type" => "string" },
			"before_from" => { "_type" => "string" },
			"content_type" => { "_type" => "string" },
			"content_type_all" => { "_type" => "string" },
			"body" => {
				"_sort" => [qw(text html)],
				"_type" => "string"
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_group.cgi" => {
		"name" => {
			"_sort" => [qw(name result)],
			"_type" => "number",
			"name" => { "_type" => "string" },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"extract" => {
			"_sort" => [qw(user_list result)],
			"_type" => "number",
			"user_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_user.cgi" => {
		"name" => {
			"_sort" => [qw(name title title_pos result)],
			"_type" => "number",
			"name" => { "_type" => "string" },
			"title" => { "_type" => "string" },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"title" => {
			"_sort" => [qw(title title_pos result)],
			"_type" => "number",
			"title" => { "_type" => "string" },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"email" => {
			"_sort" => [qw(email keitai_mail pmail1 pmail2 result)],
			"_type" => "number",
			"email" => { "_type" => "string" },
			"keitai_mail" => { "_type" => "string" },
			"pmail1" => { "_type" => "string" },
			"pmail2" => { "_type" => "string" },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_addr.cgi" => {
		"name" => {
			"_sort" => [qw(name title title_pos result)],
			"_type" => "number",
			"name" => { "_type" => "string" },
			"title" => { "_type" => "string" },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"title" => {
			"_sort" => [qw(title title_pos result)],
			"_type" => "number",
			"title" => { "_type" => "string" },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"email" => {
			"_sort" => [qw(email keitai_mail pmail1 pmail2 result)],
			"_type" => "number",
			"email" => { "_type" => "string" },
			"keitai_mail" => { "_type" => "string" },
			"pmail1" => { "_type" => "string" },
			"pmail2" => { "_type" => "string" },
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"extract" => {
			"_sort" => [qw(user_list result)],
			"_type" => "number",
			"user_list" => {
				"_sort" => [qw(id type name title title_pos lang email icon alt link regist external)],
				"_type" => "string",
				"type" => { "_type" => "number" },
				"title_pos" => { "_type" => "number" },
				"external" => { "_type" => "number" }
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_logout.cgi" => {
		"_common" => {
			"_sort" => [qw(result)],
			"_type" => "number",
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_config.cgi" => {
		"_common" => {
			"_sort" => [qw(result)],
			"_type" => "number",
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	},
	"ajx_ma_upload.cgi" => {
		"_common" => {
			"_sort" => [qw(attach_list result)],
			"_type" => "number",
			"_form" => 1,
			"attach_list" => {
				"_sort" => [qw(aid name icon size warn link document title)],
				"_type" => "string",
				"aid" => { "_type" => "number" },
				"size" => { "_type" => "number" }
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"common_without_form" => {
			"_sort" => [qw(attach_list result)],
			"_type" => "number",
			"attach_list" => {
				"_sort" => [qw(aid name icon size warn link document title)],
				"_type" => "string",
				"aid" => { "_type" => "number" },
				"size" => { "_type" => "number" }
			},
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		},
		"delete" => {
			"_sort" => [qw(result)],
			"_type" => "number",
			"result" => {
				"_sort" => [qw(error message)],
				"message" => { "_type" => "string" }
			}
		}
	}
};

1;

