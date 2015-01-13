function waitting_screen_on(){
    var wobj=document.getElementById('waitting_screen');
    if (!wobj) {
        wobj=document.createElement('DIV');
        document.body.appendChild(wobj);
        wobj.id='waitting_screen';
        wobj.style.display='none';
        wobj.style.zIndex=10;
        wobj.style.backgroundColor='#FFFFFF';
        wobj.style.position='absolute';
        wobj.style.top=0;
        wobj.style.left=0;
        wobj.style.opacity=0.65;
        wobj.style.filter='alpha(opacity=65)';
    }
    wobj.style.display = 'block';
    wobj.style.width  = document.body.scrollWidth;
    wobj.style.height = document.body.scrollHeight;
}
function waitting_screen_off(){
    var wobj=document.getElementById('waitting_screen');
    wobj.style.display = 'none';
}
var mouse_flag = false;
var dx,dy,X,Y;
window.document.onmousemove = mouse_move;
window.document.onmouseup   = mouse_up;
function mouse_down(event){
    mouse_flag = true;
    if(document.all){
        dx = window.event.offsetX;
        dy = window.event.offsetY;
    } else if(document.layers || document.getElementById){
        dx = event.layerX;
        dy = event.layerY;
    }
    index_value=document.getElementById('detail').style.zIndex;
    document.getElementById('detail').style.zIndex=999;
}
function mouseXY(event){
    if(document.all) { X=document.body.scrollLeft+window.event.clientX;}
    else if(document.layers || document.getElementById){X=event.pageX;}
    if(document.all) {Y=document.body.scrollTop+window.event.clientY;}
    else if(document.layers || document.getElementById){Y= event.pageY;}
}
function mouse_move(event){
    if (mouse_flag==false) return;
    mouseXY(event);
    document.getElementById('detail').style.left = X - dx;
    document.getElementById('detail').style.top  = Y - dy;
    return false;
}
function mouse_up(){
    mouse_flag = false;
}

var NsFormAnswer = {
	resizeProc: function() {
    	var height=0;
    	if (window.innerHeight) {
        	height = window.innerHeight;
    	} else if (document.documentElement && document.documentElement.clientHeight != 0) {
        	height = document.documentElement.clientHeight;
    	} else if ( document.body ) {
        	height = document.body.clientHeight;
    	}
    	height -= 200;
    	if (height < 200) { height=200; }
    	document.getElementById('list').style.height = height + 'px';
	},
	detailProc: function(num,form_id,gid) {
        var xmlhttp;
        if (window.ActiveXObject && !window.XMLHttpRequest) {
            try {
                xmlhttp=new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {}
            try {
                xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}
        } else {
            xmlhttp=new XMLHttpRequest();
        }
		var d_target=document.getElementById('d-'+gid);
		var o_target=document.getElementById('o-'+gid);
		if (d_target.style.display != 'block') {
        	var url='/cgi-bin/ns_form_answer.cgi?num='+num+'&form_id='+form_id+'&gid='+gid+'&detail=1&time'+new Date;
        	xmlhttp.open('GET',setUrl(url),true);
        	xmlhttp.onreadystatechange = function() {
            	if (xmlhttp.readyState ==4 && xmlhttp.status == 200) {
                	d_target.innerHTML=xmlhttp.responseText;
                	d_target.style.display='block';
                	o_target.src='/images/MINUS.gif';
            	}
        	};
        	xmlhttp.send(null);
		} else {
			if (d_target) { d_target.style.display='none'; }
            if (o_target) { o_target.src='/images/PLUS.gif'; }
		}
	}
};

var NsViewList = {
	copyConfirm: function(event,num) {
		var px=0;
		var py=0;
    	if(document.all) { 
			px=document.body.scrollLeft+window.event.clientX;
		} else if(document.layers || document.getElementById){
			px=event.pageX;
		}
    	if(document.all) {
			py=document.body.scrollTop+window.event.clientY;
		} else if(document.layers || document.getElementById){
			py= event.pageY;
		}
		var pop_height=NsViewList.detailOpen(350,140,px,py);
    	var conn = new Ext.data.Connection();
    	conn.request({
        	url:    setUrl('/cgi-bin/ns_board_list.cgi'),
        	method: 'POST',
        	params: { mode : 'copy_confirm', num : num },
        	success: function(responseObject) {
            	var result = Ext.util.JSON.decode(responseObject.responseText);
            	if (result.error) {
                	alert(result.error);
            	} else {
                	document.getElementById('detail').innerHTML = result.tag;
        			document.getElementById('detail_main').style.height = pop_height - 45 - 50;
        			document.getElementById('detail').style.backgroundColor = '#EEEEEE';
            	}
        	},
        	failure: function() {
            	alert(MyMsg.ajaxError);
        	}
    	});
	},
	detailOpen: function(p_w,p_h,p_x,p_y) {
    	var height=0;
    	var width =0;
    	if (window.innerHeight) {
        	height = window.innerHeight;
        	width  = window.innerWidth;
    	} else if (document.documentElement && document.documentElement.clientHeight != 0) {
        	height = document.documentElement.clientHeight;
        	width  = document.documentElement.clientWidth;
    	} else if ( document.body ) {
        	height = document.body.clientHeight;
        	width  = document.body.clientWidth;
    	}
    	document.getElementById('detail').innerHTML = '';
    	var pop_width  = (width  > p_w) ? p_w : width  - 20;
    	var pop_height = (height > p_h) ? p_h : height - 40;
		if (p_y) {
    		document.getElementById('detail').style.top  = p_y;
		} else {
    		document.getElementById('detail').style.top  = (height - pop_height) / 2;
		}
		if (p_x) {
    		document.getElementById('detail').style.left = p_x - (pop_width / 2);
		} else {
    		document.getElementById('detail').style.left = (width  - pop_width)  / 2;
		}
    	document.getElementById('detail').style.width  = pop_width;
    	document.getElementById('detail').style.height = pop_height;

    	waitting_screen_on();
    	document.getElementById('detail').style.display = 'block';
    	document.getElementById('detail').style.backgroundColor  = '#FFFFFF';
		return pop_height;
	},
	detailClose: function() {
    	document.getElementById('detail').innerHTML = '';
    	document.getElementById('detail').style.display = 'none';
    	waitting_screen_off();
	},
    toggleCategory: function(num) {
        var cat_icon = document.getElementById('cat_icon_'+num);
        if (cat_icon.src.match(/PLUS/)) {
            NsViewList.categoryOpen(num);
        } else {
            NsViewList.categoryClose(num);
        }
    },
    toggleLabel: function(num) {
        var label_cat_icon = document.getElementById('label_cat_icon_'+num);
        if (label_cat_icon.src.match(/PLUS/)) {
            NsViewList.labelOpen(num);
        } else {
            NsViewList.labelClose(num);
        }
    },
    labelOpen: function(num) {
        var xmlhttp;
        if (window.ActiveXObject && !window.XMLHttpRequest) {
            try {
                xmlhttp=new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {}
            try {
                xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}
        } else {
            xmlhttp=new XMLHttpRequest();
        }
        var label_cat_list = document.getElementById('label_cat_list_'+num);
        var label_cat_icon = document.getElementById('label_cat_icon_'+num);
        var url='/cgi-bin/ns_view_card.cgi?mode=label_open&num='+num+'&time'+new Date;
        xmlhttp.open('GET',setUrl(url),true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState ==4 && xmlhttp.status == 200) {
                label_cat_list.innerHTML=xmlhttp.responseText;
                label_cat_list.style.display='block';
                label_cat_icon.src='/images/MINUS.gif';
            }
        };
        xmlhttp.send(null);
    },
    labelClose: function(num) {
        var label_cat_list = document.getElementById('label_cat_list_'+num);
            label_cat_list.style.display='none';
        var label_cat_icon = document.getElementById('label_cat_icon_'+num);
            label_cat_icon.src='/images/PLUS.gif';
    },
    categoryOpen: function(num) {
        var xmlhttp;
        if (window.ActiveXObject && !window.XMLHttpRequest) {
            try {
                xmlhttp=new ActiveXObject('Msxml2.XMLHTTP');
            } catch (e) {}
            try {
                xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {}
        } else {
            xmlhttp=new XMLHttpRequest();
        }
        var cat_list = document.getElementById('cat_list_'+num);
        var cat_icon = document.getElementById('cat_icon_'+num);
        var url='/cgi-bin/ns_view_card.cgi?mode=category_open&num='+num+'&time'+new Date;
        xmlhttp.open('GET',setUrl(url),true);
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState ==4 && xmlhttp.status == 200) {
                cat_list.innerHTML=xmlhttp.responseText;
                cat_list.style.display='block';
                cat_icon.src='/images/MINUS.gif';
            }
        };
        xmlhttp.send(null);
    },
    categoryClose: function(num) {
        var cat_list = document.getElementById('cat_list_'+num);
            cat_list.style.display='none';
        var cat_icon = document.getElementById('cat_icon_'+num);
            cat_icon.src='/images/PLUS.gif';
    }
};

var NsViewDetail = {
	expand    : 0,
	linkOpen  : 0,
    maskProc: function(func) {
        var height;
        var width;
        if (window.innerHeight) {
            height = window.innerHeight;
            width  = window.innerWidth;
        } else if (document.documentElement && document.documentElement.clientHeight != 0) {
            height = document.documentElement.clientHeight;
            width  = document.documentElement.clientWidth;
        } else if ( document.body ) {
            height = document.body.clientHeight;
            width  = document.body.clientWidth;
        }
        var scrollY;
		var ua = navigator.userAgent.toLowerCase();
		var isIE = ((ua.indexOf("msie") != -1) && (ua.indexOf("opera") == -1) && (ua.indexOf("webtv") == -1));
        if (isIE) {
            if(document.compatMode == "CSS1Compat"){
                scrollY=document.documentElement.scrollTop;
            } else {
                scrollY=document.body.scrollTop;
            }
        } else {
            scrollY=window.pageYOffset;
        }
        var mask=document.getElementById('mask');
            mask.style.width  = width + 'px';
            mask.style.height = scrollY + height + 'px';
            mask.style.zIndex = 999999;
            mask.style.display = "block";
        if(func == 'attach'){
            allSelectTagHide();
        }else{
            var shim=document.getElementById('shim');
                shim.style.width  = width + 'px';
                shim.style.height = scrollY + height + 'px';
                shim.style.zIndex = mask.style.zIndex - 1;
                shim.style.display = "block";
        }
    },
    unmaskProc: function(func) {
        var mask=document.getElementById('mask');
            mask.style.display = "none";
		if(func == 'attach'){
            allSelectTagShow();
        }else{
            var shim=document.getElementById('shim');
                shim.style.display = "none";
		}
    },
    deleteItem: function(target,id) {
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: { proc_no: Params['proc_no'], mode: "delete", target: target, id: id },
            success: function(responseObject) {
    			if (target.match(/^(o_target|n_target|e_target|p_target)/)) {
					NsViewDetail.reloadProc('access');
				} else {
                	document.getElementById(target).innerHTML=responseObject.responseText;
				}
                if (target == 'c_target') { reloadButton(); }
			    NsViewDetail.ResizeProc();
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    reloadProc: function(element) {
        var mode = 'reload_'+element;
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: { proc_no: Params['proc_no'], mode: mode },
            success: function(responseObject) {
                document.getElementById(element).innerHTML=responseObject.responseText;
			    NsViewDetail.ResizeProc();
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    reloadForm: function() {
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: { proc_no: Params['proc_no'], mode: "reload_form" },
            success: function(responseObject) {
                document.getElementById('form').innerHTML=responseObject.responseText;
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    reloadButton: function() {
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: { proc_no: Params['proc_no'], mode: "reload_button" },
            success: function(responseObject) {
                document.getElementById('footer').innerHTML=responseObject.responseText;
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    TemplateSel: function() {
        document.forms[0].mode.value='template_sel';
        document.forms[0].submit();
    },
    UserSel: function(target,mode) {
        var url ='/cgi-bin/ow_folder_public.cgi?num='+Params['proc_no'];
            url+='&call='+Params['call'];
            url+='&item='+target+'&element=reloadProc';
            url+='&user='+Params['user'];
        if (typeof(mode) != 'undefined') {
            url+='&mode='+mode;
        } else {
            url+='&mode=1';
        }
        if (Params['ug_sel_popup'] == 'extension') {
            url+='&extension=1';
            window.open(setUrl(url),'UserselPopup','width=680,height=570,resizable=1,scrollbars=1,status=yes');
        } else {
            url=url.replace(/\?/g, "%3f");
            url=url.replace(/\&/g, "%20");
            Pop(url,'pop_title_selusergroup.gif',450,570);
        }
    },
    UserList: function() {
        var list_url='/cgi-bin/ns_view_target.cgi?proc_no='+Params['proc_no'];
        var list_param="width=600,height=650,resizable=1,scrollbars=1";
        window.open(setUrl(list_url),'target_member',list_param);
    },
    AttachSel: function() {
		var attach_url='/cgi-bin/pop_up.cgi?proc=ns_attach_object.cgi%3fproc_no='+Params['proc_no']
					  +'%20init=1&title=pop_title_attachfile_link.gif';
        window.open(setUrl(attach_url),'newpopup','width=500,height=500,resizable=1,scrollbars=1');
    },
    FormSel: function() {
		var formsel_url='/cgi-bin/pop_up.cgi?proc=ns_formsel.cgi%3fnum='+Params['proc_no']
					   +'&title=pop_title_selform.gif';
        window.open(setUrl(formsel_url),'newpopup','width=500,height=500,resizable=1,scrollbars=1');
    },
    IconSel: function() {
        var icon=document.forms[0].icon.value;
        Pop('sm_icon_select.cgi?icon='+icon,'pop_title_selicon.gif',350,350,'',1);
    },
    IconDel: function() {
        document.forms[0].icon.value=0;
        document.images['icon'].src=Icons['null'];
    },
    FormPreview: function(form_id,form_type) {
        var url;
        if (form_type > 0) {
            url='/cgi-bin/ns_simple_form_regist.cgi?form_id='+form_id;
        } else {
            url='/cgi-bin/ns_form_preview.cgi?form_id='+form_id;
        }
        url+='&preview=1';
        var param="width=800,height=600,resizable=1,scrollbars=1";
        window.open(setUrl(url),'',param);
    },
    CategorySel: function(depth) {
        var cid=document.getElementById('cid').value;
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: { proc_no: Params['proc_no'], mode: 'category_sel', cid: cid },
            success: function(responseObject) {
                document.getElementById('cl_list').innerHTML=responseObject.responseText;

				// category_depth = 3
				if (depth == 3) {
                	document.getElementById('cl_list').scrollTop=0;
				}
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    CategoryAdd: function(depth) {
        var cl_sel=document.getElementById('cl_sel');
        var add='';
		if (depth == 3) {
			var checks=document.getElementsByTagName('INPUT');
			for (var i=0; i<checks.length; i++) {
				if (checks[i].id.match(/^CAT-/)) {
					if (checks[i].checked) {
						var cid=checks[i].id.split('-')[1];
                		add+=(add != '') ? ','+cid : cid;
						checks[i].checked = false;
					}
				}
			}
		} else {
        	for (var i=0; i<cl_sel.options.length; i++) {
            	if (cl_sel.options[i].selected == true) {
                	add+=(add != '') ? ','+cl_sel.options[i].value : cl_sel.options[i].value;
                	cl_sel.options[i].selected=false;
            	}
        	}
		}
        if (add == '') { return false; }
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: { proc_no: Params['proc_no'], mode: 'category_add', add: add },
            success: function(responseObject) {
                document.getElementById('cr_list').innerHTML=responseObject.responseText;

				// category_depth = 3
				if (depth == 3) {
					var checks = add.split(/,/);
					for (var i=0; i<checks.length; i++) {
						if (document.getElementById('TREE-'+checks[i])) {
							document.getElementById('TREE-'+checks[i]).style.display = 'none';
						}
					}
				}
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    CategoryDel: function(depth) {
        var cr_sel=document.getElementById('cr_sel');
        var del='';
        for (var i=0; i<cr_sel.options.length; i++) {
            if (cr_sel.options[i].selected == true) {
				var cid = cr_sel.options[i].value;
                del+=(del != '') ? ','+cid : cid;
            }
        }
        if (del == '') { return false; }
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: { proc_no: Params['proc_no'], mode: 'category_del', del: del },
            success: function(responseObject) {
                document.getElementById('cr_list').innerHTML=responseObject.responseText;

				// category_depth = 3
				if (depth == 3) {
					var checks = del.split(/,/);
					for (var i=0; i<checks.length; i++) {
						if (document.getElementById('TREE-'+checks[i])) {
							document.getElementById('TREE-'+checks[i]).style.display = '';
						}
					}
				}
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    CategoryClear: function(depth) {
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: { proc_no: Params['proc_no'], mode: 'category_clear' },
            success: function(responseObject) {
                document.getElementById('cr_list').innerHTML=responseObject.responseText;

				// category_depth = 3
				if (depth == 3) {
					var divs=document.getElementsByTagName('DIV');
					for (var i=0; i<divs.length; i++) {
						if (divs[i].id.match(/^TREE-\d+$/)) {
							divs[i].style.display = '';
						}
					}
				}
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    LinkEdit: function() {
        document.getElementById('link_text').style.display='';
        document.getElementById('link_edit').style.display='none';
        NsViewDetail.linkOpen = 1;
        NsViewDetail.ResizeProc();
    },
	toggleTextStyle: function() {
        if (document.getElementById('text_style').value == 'plaintext') {
    		NsViewDetail.plainTextStyle();
		} else {
    		NsViewDetail.richTextStyle();
		}
	},
    richTextStyle: function() {
        document.getElementById('contentRich').style.display='block';
        document.getElementById('contentText').style.display='none';
		var html;
        var ua = navigator.userAgent;
        if (ua.indexOf('MSIE') != -1) {
        	html=DA.util.encode(document.getElementById('memo').value,2,0,1);
		} else {
        	html=DA.util.encode(document.getElementById('memo').value,1,0,1);
		}
		if (document.getElementById('ckeditor')) {
			if (html) {
				html='<span style="font-family:'+ckeDefaultFamily+';font-size:'+ckeDefaultSize+';">'+html+'</span>';
			}
			var temp_text = document.getElementById('memo').value;
				temp_text=temp_text.replace(/[\r\n]/ig,"<p>");
			document.getElementById('ckeditor').value = temp_text;
			createCKEDITOR();
			// CKEDITOR.instances.ckeditor.setData(html);
		} else if (document.getElementById('content')) {
        	FCKeditorAPI.GetInstance('content').SetHTML(html);
        }
        NsViewDetail.ResizeProc();
    },
    plainTextStyle: function() {
        if (confirm(MyMsg['style_confirm'])==true) {
            document.getElementById('contentRich').style.display='none';
            document.getElementById('contentText').style.display='block';
            var text;
            var ua = navigator.userAgent;
			if (document.getElementById('ckeditor')) {
				var temp_text=CKEDITOR.instances.ckeditor.getData();
				   	temp_text=temp_text.replace(/[\r\n]/ig,"");
				   	temp_text=temp_text.replace(/<br \/>/ig,"\r\n");
				   	temp_text=temp_text.replace(/<p>/ig,"");
				   	temp_text=temp_text.replace(/<\/p>/ig,"\r\n");
					temp_text=temp_text.replace( /<[^<|>]+?>/gi,'');
					temp_text=temp_text.replace( /&nbsp;/gi,'');
					temp_text=temp_text.replace( /&shy;/gi,'');
    			var dom=document.createElement("DIV");
    				dom.innerHTML=temp_text;
    			text=(dom.textContent || dom.innerText);
				if (text) {
					text=text.replace(/^[\r\n]/, "");
					text=text.replace(/[\r\n]$/,"");
				} else {
					text='';
				}
				CKEDITOR.instances.ckeditor.destroy();
			} else if (document.getElementById('content')) {
            	if (ua.indexOf('MSIE') != -1) {
               		text=FCKeditorAPI.GetInstance('content').EditorDocument.body.innerText;
            	} else {
					var content=FCKeditorAPI.GetInstance('content').EditorDocument.body;
                	var temp_text=content.innerHTML;
				    	temp_text=temp_text.replace(/<br>/ig,"\r\n");
					if (navigator.userAgent.toLowerCase().indexOf('chrome/') > -1) {
						temp_text=temp_text.replace(/<\/p><p>/ig,"</p>\r\n<p>");
					}
                	content.innerHTML=temp_text;
                	text=FCKeditorAPI.GetInstance('content').EditorDocument.body.textContent.replace(/\xA0/g," ");
            	}
			}
            document.getElementById('memo').value=text;
            NsViewDetail.ResizeProc();
    	} else {
    		document.getElementById('text_style').value = 'richtext';
    	}
    },
    ToggleProc: function(target,nochange) {
		if (typeof(nochange) != 'undefined')  {
			// Just reload target element
		} else {
        	MyClose[target]=(MyClose[target] == '1') ? '0' : '1';
		}
        if (MyClose[target] == '1') {
            document.getElementById(target+'_toggle_button').innerHTML=Icons['plus'];
        } else {
            document.getElementById(target+'_toggle_button').innerHTML=Icons['minus'];
        }
        var params={};
        params.proc_no = Params['proc_no'];
        params.mode    = target+'_toggle';
        params.close   = MyClose[target];
        if (target == 'form') {
            var form=document.forms[0];
            if (form.p_level) { params.p_level=form.p_level.value; }
            if (form.d_yy) { params.d_yy=form.d_yy.value; }
            if (form.d_mm) { params.d_mm=form.d_mm.value; }
            if (form.d_dd) { params.d_dd=form.d_dd.value; }
            if (form.d_hh) { params.d_hh=form.d_hh.value; }
            if (form.notice_mail)  {
                if (form.notice_mail.type == 'checkbox') {
                    params.notice_mail =(form.notice_mail.checked == true) ? 1 : 0;
                } else {
                    params.notice_mail =form.notice_mail.value;
                }
            }
            if (form.confine_mail) {
                if (form.confine_mail.type == 'checkbox') {
                    params.confine_mail=(form.confine_mail.checked == true) ? 1 : 0;
                } else {
                    params.confine_mail =form.confine_mail.value;
                }
            }
        }
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: params,
            success: function(responseObject) {
                document.getElementById(target).innerHTML=responseObject.responseText;
                NsViewDetail.ResizeProc();
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    P_LevelToggleProc: function() {
        var params={};
        params.proc_no = Params['proc_no'];
        params.mode    = 'p_level_toggle';
        var form=document.forms[0];
        if (form.p_level) { params.p_level=form.p_level.value; }
        if (form.d_yy) { params.d_yy=form.d_yy.value; }
        if (form.d_mm) { params.d_mm=form.d_mm.value; }
        if (form.d_dd) { params.d_dd=form.d_dd.value; }
        if (form.d_hh) { params.d_hh=form.d_hh.value; }
        if (form.notice_mail)  {
            if (form.notice_mail.type == 'checkbox') {
                params.notice_mail =(form.notice_mail.checked == true) ? 1 : 0;
            } else {
                params.notice_mail =form.notice_mail.value;
            }
        }
        if (form.confine_mail) {
            if (form.confine_mail.type == 'checkbox') {
                params.confine_mail=(form.confine_mail.checked == true) ? 1 : 0;
            } else {
                params.confine_mail =form.confine_mail.value;
            }
        }
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: params,
            success: function(responseObject) {
                document.getElementById('form').innerHTML=responseObject.responseText;
				if (form.p_level) {
					if (form.p_level.value == 1) {
                		document.getElementById('form_toggle').style.display='';
					} else {
                		document.getElementById('form_toggle').style.display='none';
					}
				}
                NsViewDetail.ResizeProc();
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    Create_GidToggleProc:function(gid){
        var params={};
        params.proc_no = Params['proc_no'];
        params.mode    = 'create_gid_toggle';
        if (gid) { params.create_gid=gid; }
        if (document.forms[0].popup) { params.popup=document.forms[0].popup.value; }
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: params,
            success: function(responseObject) {
				var result = Ext.util.JSON.decode(responseObject.responseText);
                document.getElementById('popup').innerHTML=result.popup;
                document.getElementById('form').innerHTML =result.form;
                if (result.p_level == 1) {
                    document.getElementById('form_toggle').style.display='';
                } else {
                    document.getElementById('form_toggle').style.display='none';
                }
                NsViewDetail.ResizeProc();
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    submitProc: function(mode) {
        NsViewDetail.maskProc();
        var form=document.forms[0];

        var params={};
        params.proc_no     = Params['proc_no'];
        params.mode        = mode;
        params.s_yy        = form.s_yy.value;
        params.s_mm        = form.s_mm.value;
        params.s_dd        = form.s_dd.value;
        params.s_hh        = form.s_hh.value;
        params.e_yy        = form.e_yy.value;
        params.e_mm        = form.e_mm.value;
        params.e_dd        = form.e_dd.value;
        params.e_hh        = form.e_hh.value;
        params.title       = form.title.value;
        params.create_gid  = form.create_gid.value;
        params.importance  = form.importance.value;
        params.icon  	   = form.icon.value;

        if (form.keep)      { params.keep=(form.keep.checked == true) ? 1 : 0; }
        if (form.link_text) { params.link_text=form.link_text.value; }

        if (form.p_level)   { params.p_level = form.p_level.value; }
        if (form.d_yy) { params.d_yy=form.d_yy.value; }
        if (form.d_mm) { params.d_mm=form.d_mm.value; }
        if (form.d_dd) { params.d_dd=form.d_dd.value; }
        if (form.d_hh) { params.d_hh=form.d_hh.value; }
        if (form.mail) { params.mail =(form.mail.checked == true) ? 1 : 0; }
        if (form.notice_mail)  { params.notice_mail =(form.notice_mail.checked == true) ? 1 : 0; }
        if (form.confine_mail) { params.confine_mail=(form.confine_mail.checked == true) ? 1 : 0; }
        if (form.popup) { params.popup=form.popup.value; }

        if (document.getElementById('contentRich').style.display != 'none') {
            if (document.getElementById('ckeditor')) {
                params.content = CKEDITOR.instances.ckeditor.getData();
            } else if (document.getElementById('content')) {
                params.content = FCKeditorAPI.GetInstance('content').EditorDocument.body.innerHTML;
            }
        } else if (document.getElementById('contentText').style.display != 'none') {
            params.memo    = document.getElementById('memo').value;
        }
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
            method: 'POST',
            params: params,
            success: function(responseObject) {
                var error=0;
                var spans=document.getElementsByTagName('SPAN');
                for (var i=0; i<spans.length; i++) {
                    if (spans[i].id.match(/^error_/)) { spans[i].innerHTML=''; }
                }
                var insertJSON = Ext.util.JSON.decode(responseObject.responseText.trim());
                var alertContent = '';

                for (var key in insertJSON) {
                    if (typeof(insertJSON[key]) == 'string') {
                        if (key == 'alert_content') {alertContent = insertJSON[key];}
                        if (document.getElementById('error_'+key)) {
                            document.getElementById('error_'+key).innerHTML=insertJSON[key];
                            error=1;
                        }
                    }
                }
                if (!error) {
                    NsViewDetail.closeProc(insertJSON.num,mode);
                } else {
                    NsViewDetail.unmaskProc();
                    NsViewDetail.expandProc(0);
                    NsViewDetail.ResizeProc();
                }
                if (alertContent != '') {
                    alert(alertContent);
                }
            },
            failure: function() { alert(MyMsg['ajax_error']); }
        });
    },
    ResizeProc: function(init) {
		if (init) { 
			window.onresize=function() { NsViewDetail.ResizeProc(); } 
			if (!document.getElementById('link_edit')) { NsViewDetail.linkOpen=1; }
		}
        var page_title_height = 0;
        if (document.getElementById('page_title').innerHTML != '') {
            var page_title_size = Ext.fly(document.getElementById('page_title')).getSize();
            page_title_height = page_title_size.height;
        }

        var height=0;
    	var width =0;
        if (window.innerHeight) {
            height = window.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight != 0) {
            height = document.documentElement.clientHeight;
        } else if ( document.body ) {
            height = document.body.clientHeight;
        }
    	if (window.innerHeight) {
        	width = window.innerWidth;
    	} else if (document.documentElement && document.documentElement.clientWidth != 0) {
        	width = document.documentElement.clientWidth;
    	} else if ( document.body ) {
        	width = document.body.clientWidth;
    	}

		if (Params['win'].match(/^pop/)) { 
			width-=0; 
		} else {
			width-=10; 
		}

		var width_gap=0;
        var header_size = Ext.fly(document.getElementById('header')).getSize();
        var footer_size = Ext.fly(document.getElementById('footer')).getSize();
        var area_height = height - footer_size.height - page_title_height - 30;
		if (document.getElementById('lib_tab_body')) {
			document.getElementById('lib_tab_body').style.width = width - 70;
			area_height -= 70;
			width_gap   += 70;
		}
		if (area_height < 200) { return; }

		var memo_height  =0;
		var header_height=0;
		if (NsViewDetail.expand) {
			header_height = header_size.height+ 2;
			memo_height   = area_height - header_size.height - 2;
			if (memo_height < 200) { memo_height   = 200; }
		} else {
			if (area_height < 500) {
				header_height = 300;
				memo_height   = 200;
			} else if (header_size.height > 500) {
				header_height = 500;
				memo_height   = area_height - 500;
			} else {
				header_height = header_size.height;
				memo_height   = area_height - header_size.height;
			}
			if (memo_height < 200) {
				memo_height   = 200;
				header_height = area_height - 200;
			}
			width_gap += (header_height < header_size.height) ? 20 : 0;
		}
		document.getElementById('header_area').style.height=header_height+6;

        if (document.getElementById('contentRich')) {
            document.getElementById('contentRich').style.height = memo_height+'px';
        }
        if (document.getElementById('contentText')) {
            document.getElementById('contentText').style.height = memo_height+'px';
        }
        if (document.getElementById('memo')) {
            document.getElementById('memo').style.height = memo_height+'px';
        }
        if (document.getElementById('ckeditor')) {
			if (CKEDITOR.instances.ckeditor) {
				try {
            		CKEDITOR.instances.ckeditor.resize('100%', memo_height);
				} catch(e) { }
			}
        } else if (document.getElementById('content')) {
            document.getElementById('content').style.height = memo_height+'px';
        }
		if (document.location.href.match(/ns_view_detail/)) {
    		if (!document.location.href.match(/file_num=\d+/)) {
    			if (document.getElementById('header_area')) {
        			document.getElementById('header_area').style.width=width - 20;
    			}
				width_gap += 20;
    			if (document.getElementById('contentRich')) {
        			document.getElementById('contentRich').style.width = width - 20;
    			}
    			if (document.getElementById('memo')) {
        			document.getElementById('memo').style.width = width - 22;
    			}
    			if (document.getElementById('content')) {
        			document.getElementById('content').style.width = width - 20;
    			} else if (document.getElementById('contentText')) {
        			document.getElementById('contentText').style.width = width - 22;
    			}
				var btns = document.getElementsByClassName('btns');
				for (var i=0; i<btns.length; i++) {
					btns[i].style.zoom=1;
				}
    		}
		}
    	if (document.getElementById('header')) {
        	document.getElementById('header').style.width=width - width_gap;
    	}
		NsViewDetail.closeCal();
    },
	expandProc: function(mode) {
		if (mode == undefined) { mode = (NsViewDetail.expand) ? 0 : 1; }

		var lines = document.getElementsByTagName('TR');
		for (var i=0; i<lines.length; i++) {
			if (lines[i].className == 'expand') {
				lines[i].style.display=(mode) ? 'none' : '';
			}
		}
		if (!mode) {
			if (document.getElementById('link_text')) {
				document.getElementById('link_text').style.display=(NsViewDetail.linkOpen) ? '' : 'none';
			}
			if (document.getElementById('link_edit')) {
				document.getElementById('link_edit').style.display=(NsViewDetail.linkOpen) ? 'none' : '';
			}
		}
		if (mode) {
			if (document.getElementById('expand_icon')) {
				document.getElementById('expand_icon').src='/images/arrow_in.png';
			}
			if (document.getElementById('expand_plus')) {
            	document.getElementById('expand_plus').innerHTML=Icons['plus'];
			}
		} else {
			if (document.getElementById('expand_icon')) {
				document.getElementById('expand_icon').src='/images/arrow_out.png';
			}
			if (document.getElementById('expand_plus')) {
            	document.getElementById('expand_plus').innerHTML=Icons['minus'];
			}
		}
		NsViewDetail.expand = mode;
		NsViewDetail.ResizeProc();
	},
	targetResizeProc: function() {
		var o_target1=document.getElementById('o_target1');
		if (o_target1) {
			if (Ext.fly(o_target1).getSize().height > 60) {
				o_target1.style.height='60px';
			} else {
				o_target1.style.height='';
			}
		}
	},
    closeProc: function(num,mode){
        if (Params['from'] == 'ns_board_list') {
            var url='/cgi-bin/ns_board_list.cgi?list_num='+Params['list_num'];
            document.location.href=setUrl(url);
        } else if (Params['from'] == 'ns_form_list') {
            var url='/cgi-bin/ns_form_list.cgi?list_num='+Params['list_num']+'&folder_id='+Params['folder_id'];
            document.location.href=setUrl(url);
        } else if (Params['from'] == 'lib_file_detail') {
            var url='/cgi-bin/ns_view_detail.cgi?id='+num+'&mode=detail&file_num='+Params['file_num']+'&message_mode='+mode;
            document.location.href=setUrl(url);
        } else if (Params['from'] == 'ns_menu') {
            var url='/cgi-bin/ns_board_list.cgi?member=self';
            document.location.href=setUrl(url);
        } else {
            top.window.close();
        }
    },
	calendar : { s_ym:'', e_ym:'',d_ym:'' },
	openCal : function(e,mode,ym){
		var posx = 0; var posy = 0;
		if (!e) var e = window.event;
		if (e.pageX || e.pageY) 	{
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) 	{
			posx = e.clientX + document.body.scrollLeft
				 + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop
				 + document.documentElement.scrollTop;
		}
    	var target=document.getElementById(mode+'_cal');
			target.style.left = posx - 125;
			target.style.top  = posy + 15;
    	if (mode == 's') {
        	if (document.getElementById('e_cal')) { document.getElementById('e_cal').style.display='none'; }
			if (document.getElementById('d_cal')) { document.getElementById('d_cal').style.display='none'; }
			if (!NsViewDetail.calendar.s_ym) { NsViewDetail.calendar.s_ym = ym; }
    	} else if (mode == 'e') {
        	if (document.getElementById('s_cal')) { document.getElementById('s_cal').style.display='none'; }
			if (document.getElementById('d_cal')) { document.getElementById('d_cal').style.display='none'; }
			if (!NsViewDetail.calendar.e_ym) { NsViewDetail.calendar.e_ym = ym; }
    	} else if (mode == 'd') {
        	if (document.getElementById('s_cal')) { document.getElementById('s_cal').style.display='none'; }
        	if (document.getElementById('e_cal')) { document.getElementById('e_cal').style.display='none'; }
			if (!NsViewDetail.calendar.d_ym) { NsViewDetail.calendar.d_ym = ym; }
    	}
    	if (target.style.display != 'none') {
        	target.style.display='none';
        	return;
    	}

    	var yy = document.forms[0][mode+'_yy'].value.toString();
    	var mm = document.forms[0][mode+'_mm'].value.toString();
    	var target_ym=yy + mm;
    	if (target_ym != NsViewDetail.calendar[mode+'_ym']) {
        	NsViewDetail.ChangeMonth(target_ym+'01',mode);
    	} else {
        	target.style.display='block';
    	}
	},
	closeCal : function() {
		if (document.getElementById('s_cal')) { document.getElementById('s_cal').style.display='none'; }
		if (document.getElementById('e_cal')) { document.getElementById('e_cal').style.display='none'; }
		if (document.getElementById('d_cal')) { document.getElementById('d_cal').style.display='none'; }
	},
	ChangeMonth : function(target_date,mode) {
    	var params={};
    	var params={};
        	params.proc_mode   = 'calendar';
        	params.target_date = target_date;
        	params.mode  = mode;
    	var conn = new Ext.data.Connection();
    	conn.request({
        	url:    setUrl('/cgi-bin/ns_view_detail.cgi'),
        	method: 'POST',
        	params: params,
        	success: function(responseObject) {
            	var result = Ext.util.JSON.decode(responseObject.responseText);
            	document.getElementById(mode+'_cal').innerHTML = result.html;
            	document.getElementById(mode+'_cal').style.display='block';
            	NsViewDetail.calendar[mode+'_ym']=target_date.substr(0,6);
        	},
        	failure: function() { alert(MyMsg['ajax_error']); }
    	});
	},
	SelectDate : function(target_date,mode) {
    	var yy = target_date.substr(0,4);
    	var mm = target_date.substr(4,2);
    	var dd = target_date.substr(6,2);
    	document.forms[0][mode+'_yy'].value = yy;
    	document.forms[0][mode+'_mm'].value = mm;
    	document.forms[0][mode+'_dd'].value = dd;
		if (mode == 's') { NsViewDetail.ChangeDate(); }
        NsViewDetail.calendar[mode+'_ym']=target_date.substr(0,6);
    	var target=document.getElementById(mode+'_cal');
        	target.style.display='none';
	},
	ChangeDate : function() {
		if (Params.monthly_num != 'on') { return; }
		if (!document.getElementById('keep_msg')) { return; }
    	var s_yy = document.forms[0]['s_yy'].value;
    	var s_mm = document.forms[0]['s_mm'].value;
		var seq_no_ym = s_yy+'/'+s_mm;
		if (seq_no_ym != Params.seq_no_ym) {
			document.getElementById('keep_msg').innerHTML = MyMsg.keep_read;
		} else {
			document.getElementById('keep_msg').innerHTML = MyMsg.keep_both;
		}
	}
};

var NsViewCard = {
	popupClose : 'on',
    maskProc: function() {
        var buttons=document.getElementsByTagName('input');
        for (var i=0; i<buttons.length; i++) {
            if (buttons[i].type == 'button') {
                buttons[i].disabled=true;
            }
        }
    },
    toggleTarget: function(open) {
    	if (open) {
    		document.getElementById('target_open').style.display ='block';
    		document.getElementById('target_close').style.display='none';
    	} else {
    		document.getElementById('target_open').style.display ='none';
    		document.getElementById('target_close').style.display='block';
    	}
    	NsViewCard.resizeProc();
    },
    UserList: function(num) {
    	var list_url='/cgi-bin/ns_view_target.cgi?num='+num;
    	var list_param="width=600,height=600,resizable=1,scrollbars=1";
    	window.open(setUrl(list_url),'target_member',list_param);
    },
    LabelList: function(num) {
    	var labels = document.getElementsByName('labels');
	    var lb = '';
	    for (var i=0; i<labels.length; i++) {
	    	lb += labels[i].value + ',';
	    }
	    lb = lb.substring(0, lb.length-1);
        var list_url='/cgi-bin/ns_view_label.cgi?num='+num+'&mode=ns_card&labels='+lb;
        Pop(escape(list_url), 'pop_title_board_info.gif', 320, 430, '', 1);
    },
    toggleProc: function(mode) {
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_card.cgi'),
            method: 'POST',
            params: { mode: 'toggle_header',close_mode:mode },
            success: function(responseObject) {
        		var header_p=document.getElementById('header_p');
        		var header_m=document.getElementById('header_m');
        		if (mode == 1) {
            		header_p.style.display='';
            		header_m.style.display='none';
        		} else {
            		header_p.style.display='none';
            		header_m.style.display='';
        		}
        		NsViewCard.resizeProc();
            },
            failure: function() { alert(MyMsg.ajax_error); }
        });
    },
    AnswerWin: function(form_id,form_type,store_id,mid,read_only) {
        var url;
        if (form_type > 0) {
            url='/cgi-bin/ns_simple_form_regist.cgi?form_id='+form_id;
        } else {
            url='/cgi-bin/ns_form_preview.cgi?form_id='+form_id;
        }
        if (typeof(store_id) != 'undefined') { url+='&store_id='+store_id; }
        if (typeof(mid) != 'undefined') { url+='&mid='+mid; }
        if (typeof(read_only) != 'undefined') { url+='&read_only='+read_only; }
        var param="width=800,height=600,resizable=1,scrollbars=1";
        window.open(setUrl(url),'',param);
    },
    circulationProc: function(mode) {
        var num=document.forms[0].num.value;
        Pop('ns_board_circulation.cgi%3fnum='+num+'%20mode=list',
            'pop_title_mkcirc.gif',665,600,1);
    },
    reprintProc: function() {
        var num=document.forms[0].num.value;
        var str='/cgi-bin/ns_board_reprint.cgi%3fnum='+num;
        var Param='width=700,height=700,resizable=1';
        var Url='/cgi-bin/pop_up.cgi?proc='+str+'&title=pop_title_bulletin.gif';
        var pwin=window.open(setUrl(Url),'',Param);
    },
    replyProc: function() {
        var num=document.forms[0].num.value;
        var str='/cgi-bin/ns_board_reply.cgi%3fid='+num;
        var Param='width=800,height=700,resizable=1';
        var Url='/cgi-bin/pop_up.cgi?proc='+str+'&title=pop_title_board_info.gif';
        var pwin=window.open(setUrl(Url),'',Param);
    },
    transferProc: function() {
        var num=document.forms[0].num.value;
        var str='/cgi-bin/ns_board_reply.cgi%3fid='+num+'%20mode=transfer';
        var Param='width=800,height=700,resizable=1';
        var Url='/cgi-bin/pop_up.cgi?proc='+str+'&title=pop_title_board_info.gif';
        var pwin=window.open(setUrl(Url),'',Param);
    },
    hiddenProc: function(num) {
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_card.cgi'),
            method: 'POST',
            params: { num: num, mode: 'hidden' },
            success: function(responseObject) {
                NsViewCard.reloadProc();
                NsViewCard.closeProc('hidden');
            },
            failure: function() { alert(MyMsg.ajax_error); }
        });
    },
    resetProc: function(num) {
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_card.cgi'),
            method: 'POST',
            params: { num: num, mode: 'reset' },
            success: function(responseObject) {
                try {
                    if (typeof(top.opener)=='object' && typeof(top.opener.document)=='object' && top.opener.document.forms[0]) {
                        // top.opener.document.getElementById('tr_'+num).style.display='';
                        // top.opener.document.getElementById('tr_'+num).style.fontWeight='bold';
						top.opener.document.forms[0].submit();
                    }
                    NsViewCard.closeProc('reset');
                } catch (e) { }
            },
            failure: function() { alert(MyMsg.ajax_error); }
        });
    },
    public_okProc: function(){
        if (confirm(MyMsg.ok_confirm)==true) {
            NsViewCard.maskProc();
            var num=document.forms[0].num.value;
            var conn = new Ext.data.Connection();
            conn.request({
                url:    setUrl('/cgi-bin/ns_view_card.cgi'),
                method: 'POST',
                params: { num: num, mode: 'ok' },
                success: function(responseObject) {
                    NsViewCard.reloadProc();
                    NsViewCard.closeProc('ok');
                },
                failure: function() { alert(MyMsg.ajax_error); }
            });
        }
    },
    public_ngProc: function(){
        if (confirm(MyMsg.ng_confirm)==true) {
            NsViewCard.maskProc();
            var num=document.forms[0].num.value;
            var conn = new Ext.data.Connection();
            conn.request({
                url:    setUrl('/cgi-bin/ns_view_card.cgi'),
                method: 'POST',
                params: { num: num, mode: 'ng' },
                success: function(responseObject) {
                    NsViewCard.reloadProc();
                    NsViewCard.closeProc('ng');
                },
                failure: function() { alert(MyMsg.ajax_error); }
            });
        }
    },
    submitProc: function(){
        if (confirm(MyMsg.submit_confirm)==true) {
            NsViewCard.maskProc();
            var num=document.forms[0].num.value;
            var conn = new Ext.data.Connection();
            conn.request({
                url:    setUrl('/cgi-bin/ns_view_card.cgi'),
                method: 'POST',
                params: { num: num, mode: 'submit' },
                success: function(responseObject) {
                    NsViewCard.reloadProc();
                    NsViewCard.closeProc('submit');
                },
                failure: function() { alert(MyMsg.ajax_error); }
            });
        }
    },
    publicProc: function(){
        if (confirm(MyMsg.public_confirm)==true) {
            NsViewCard.maskProc();
            var num=document.forms[0].num.value;
            var conn = new Ext.data.Connection();
            conn.request({
                url:    setUrl('/cgi-bin/ns_view_card.cgi'),
                method: 'POST',
                params: { num: num, mode: 'public' },
                success: function(responseObject) {
                    NsViewCard.reloadProc();
                    NsViewCard.closeProc('public');
                },
                failure: function() { alert(MyMsg.ajax_error); }
            });
        }
    },
    cancelProc: function(){
        if (confirm(MyMsg.cancel_confirm)==true) {
            NsViewCard.maskProc();
            var num=document.forms[0].num.value;
            var conn = new Ext.data.Connection();
            conn.request({
                url:    setUrl('/cgi-bin/ns_view_card.cgi'),
                method: 'POST',
                params: { num: num, mode: 'cancel' },
                success: function(responseObject) {
                    NsViewCard.reloadProc();
                    NsViewCard.closeProc('cancel');
                },
                failure: function() { alert(MyMsg.ajax_error); }
            });
        }
    },
	avoidProc: function() {
        if (confirm(MyMsg.avoid_confirm)==true) {
            NsViewCard.maskProc();
            var num=document.forms[0].num.value;
            var conn = new Ext.data.Connection();
            conn.request({
                url:    setUrl('/cgi-bin/ns_view_card.cgi'),
                method: 'POST',
                params: { num: num, mode: 'avoid' },
                success: function(responseObject) {
                    NsViewCard.reloadProc();
                    NsViewCard.closeProc('avoid');
                },
                failure: function() { alert(MyMsg.ajax_error); }
            });
        }
	},
	unavoidProc: function() {
        if (confirm(MyMsg.unavoid_confirm)==true) {
            NsViewCard.maskProc();
            var num=document.forms[0].num.value;
            var conn = new Ext.data.Connection();
            conn.request({
                url:    setUrl('/cgi-bin/ns_view_card.cgi'),
                method: 'POST',
                params: { num: num, mode: 'unavoid' },
                success: function(responseObject) {
                    NsViewCard.reloadProc();
                    NsViewCard.closeProc('unavoid');
                },
                failure: function() { alert(MyMsg.ajax_error); }
            });
        }
	},
    deleteConfirm: function(num,store_id,store_mode){
        var msg=(store_mode == 1) ? MyMsg.deltemp_confirm : MyMsg.delete_confirm;
        if (confirm(msg)==true) {
            NsViewCard.deleteAnswerProc(num,store_id,store_mode);
        }
    },
    deleteAnswerProc: function(num,store_id,store_mode) {
        var conn = new Ext.data.Connection();
        conn.request({
            url:    setUrl('/cgi-bin/ns_view_card.cgi'),
            method: 'POST',
            params: { num: num, mode: 'delete_answer', store_id: store_id, store_mode: store_mode },
            success: function(responseObject) {
                if (store_mode == 1) {
                    document.getElementById('temp_list').innerHTML=responseObject.responseText;
                } else if (store_mode == 3) {
                    document.getElementById('data_list').innerHTML=responseObject.responseText;
                }
                NsViewCard.resizeProc();
            },
            failure: function() { alert(MyMsg.ajax_error); }
        });
    },
    closeProc: function(mode) {
		try {
			if (NsViewCard.popupClose == 'off') {
				var msg = MyMsg[mode+'_done'];
				if (msg) { alert(msg); }
				if (mode != 'reset') {
                	var num		=document.forms[0].num.value;
                	var jump_num=document.forms[0].jump_num.value;
                	document.location.href=setUrl('/cgi-bin/ns_view_card.cgi?num='+num+'&jump_num='+jump_num);
				}
			} else {
        		top.window.close();
			}
		} catch(e) { 
        	top.window.close();
		}
    },
    reloadProc: function() {
        if (typeof(top.opener)=='object' && typeof(top.opener.document)=='object') {
            if (top.opener.document.title == 'ns_board_list') {
                var list_num=top.opener.document.forms[0].list_num.value;
                top.opener.document.location.href=setUrl('/cgi-bin/ns_board_list.cgi?list_num='+list_num);
            }
            if (top.opener.document.title == 'ns_board_main') {
                var list_num=top.opener.document.forms[0].list_num.value;
                var point=top.opener.document.forms[0].point.value;
                var page =top.opener.document.forms[0].page.value;
                top.opener.document.location.href=setUrl('/cgi-bin//ns_board_main.cgi?list_num='+list_num
                    +'&point='+point+'&page='+page);
            }
            if (top.opener.document.title == 'ns_check_list') {
                var mode=top.opener.document.forms[0].mode.value;
                var sort=top.opener.document.forms[0].sort.value;
                var page=top.opener.document.forms[0].page.value;
                top.opener.document.location.href=setUrl('/cgi-bin//ns_check_list.cgi?mode='+mode
                    +'&page='+page+'&sort='+sort);
			}
        }
    },
    resizeProc: function() {
        document.getElementById('message').style.height = '0px';
        var height;
        if (window.innerHeight) {
            height = window.innerHeight;
        } else if (document.documentElement && document.documentElement.clientHeight != 0) {
            height = document.documentElement.clientHeight;
        } else if ( document.body ) {
            height = document.body.clientHeight;
        }
        var menu_size   = Ext.fly(document.getElementById('menu')).getSize();
        var header_size = Ext.fly(document.getElementById('header')).getSize();
        height = height - header_size.height - menu_size.height - 30;
        if (document.getElementById('popup_header')) {
            var popup_size  = Ext.fly(document.getElementById('popup_header')).getSize();
            height = height - popup_size.height;
        }
        if (height < 0) { height=30; }
        document.getElementById('message').style.height = height + 'px';
    }
};
