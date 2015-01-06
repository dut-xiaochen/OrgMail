all: clean prepare build_js build_thirdparty ;

js_files=../common/DA/DA-min.js

thirdparty_js_files=../../../../libraries/prototype/v1.6.0.3/prototype.js

.PHONY: all build_thirdparty lint_js build_js clean prepare

export LC_CTYPE=ja_JP.UTF-8

build_dir=./build
custom_rhino=/usr/local/bin/custom_rhino.jar

prepare:;
	@mkdir $(build_dir)

build_thirdparty: $(thirdparty_js_files);
	@if [ -n "$(thirdparty_js_files)" ]; then \
		cat $(thirdparty_js_files) > $(build_dir)/thirdparty-all.js; \
	fi

lint_js: $(js_files)
	@runjsl_da.pl $^ ;

build_js: lint_js;
	@if [ -n "$(js_files)" ]; then \
		cat $(js_files) > $(build_dir)/all.js ;\
		sed '/DA_DEBUG_START/,/DA_DEBUG_END/d' $(build_dir)/all.js > $(build_dir)/all-nodebug.js ;\
		java -jar $(custom_rhino) -strict -opt -1 -c $(build_dir)/all-nodebug.js > $(build_dir)/all-nodebug-comp.js ;\
	fi

clean:;
	@rm -rf $(build_dir)

