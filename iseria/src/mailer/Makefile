# without thirdparty
all: clean prepare build_js build_css build_html ;
#all: clean prepare build_js build_css build_thirdparty ;


js_files=../common/locale/en/message_core.js \
	../common/DA/DA.js \
	../common/menu/panel.js \
	../common/layout/three-pane.js \
	../common/layout/panel.js \
	../common/locale/message.js \
	../common/file/info.js \
	../common/dialog/dialog.js \
	../common/tables/tables.js \
	../common/io/io.js \
	../common/io/json-io.js \
	../common/io/fileupload-io.js \
	./mailer.js \
	./mboxrw.js \
	./application.js \
	../common/menu/popup.js \
	../common/account/info.js \
	../common/logging/logging.js \
	../common/event/event.js \
	../common/misc/nvpairs.js \
	./message/editor.js \
	./dialog/dialog.js \
	./folder/folder-tree.js \
	../common/grid/virtual-scroll.js \
	./search/message.js \
	./message/viewer.js \
	../common/locale/ja/message_core.js \
	../common/locale/en/message_custom.js \
	../common/toppanel/title.js \
	../common/locale/ja/message_custom.js \
	../common/misc/searchbox.js \
	./toppanel/editor.js \
	./toppanel/viewer.js \
	./toppanel/three-pane.js \
	./mboxgrid/mboxgrid.js \
	./autocomplete/autocomplete.js

css_files=../common/reset/reset.css \
	../common/account/info.css \
	../common/dialog/dialog.css \
	../common/file/info.css \
	../common/grid/virtual-scroll.css \
	../common/layout/three-pane.css \
	../common/layout/panel.css \
	../common/menu/menu.css \
	../common/misc/nvpairs.css \
	../common/tables/tables.css \
	../common/toppanel/title.css \
	./folder/folder-operate-dialog.css \
	./folder/folder-tree.css \
	./mboxgrid/mboxgrid.css \
	./message/common.css \
	./message/editor.css \
	./message/viewer.css \
	./search/message.css \
	./toppanel/editor.css \
	./toppanel/three-pane.css \
	./toppanel/viewer.css \
	./autocomplete/autocomplete.css

thirdparty_js_files=""

build_html:
	@convert_for_patch.pl ../../tests/test_Mailer3Pane.html > $(build_dir)/index.html ;\
	 convert_for_patch.pl ../../tests/test_MessageViewer.html > $(build_dir)/viewer.html ;\
	 convert_for_patch.pl ../../tests/test_MessageEditor.html > $(build_dir)/editor.html ;\
	 convert_for_patch.pl ../../tests/test_MessageSearcher.html > $(build_dir)/searcher.html

include ../common/Makefile-common.mk
