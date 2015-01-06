.PHONY: all build_thirdparty lint_js build_js build_css clean prepare

export LC_CTYPE=ja_JP.UTF-8

build_dir=./build
custom_rhino=/usr/local/bin/custom_rhino.jar

prepare:;
	@mkdir $(build_dir)

build_thirdparty: $(thirdparty_js_files);
	@if [ -n "$(thirdparty_js_files)" ]; then \
		cat $(thirdparty_js_files) | sed 's%"http:/"+"/extjs.com/s.gif"%"/images/jslib/extjs/default/s\.gif"%g' > $(build_dir)/thirdparty-all.js; \
	fi


lint_js: $(js_files)
	@runjsl_da.pl $^ ;

build_js: lint_js;
	@if [ -n "$(js_files)" ]; then \
		cat $(js_files) | sed 's%"http:/"+"/extjs.com/s.gif"%"/images/jslib/extjs/default/s\.gif"%g' > $(build_dir)/all.js ;\
		sed '/DA_DEBUG_START/,/DA_DEBUG_END/d' $(build_dir)/all.js > $(build_dir)/all-nodebug.js ;\
		java -jar $(custom_rhino) -strict -opt -1 -c $(build_dir)/all-nodebug.js > $(build_dir)/all-nodebug-comp.js ;\
	fi


build_css: $(css_files);
	@if [ -n "$(css_files)" ]; then \
		cat $(css_files) | tr -d '\r' > $(build_dir)/all.css.org ;\
		sed 's/url(images\//url(\/images\/jslib\/extjs\//g' $(build_dir)/all.css.org | sed 's/url( images\//url( \/images\/jslib\/extjs\//g' | sed 's/\.\.\/images\//\/images\/jslib\/extjs\//g' > $(build_dir)/all.css ;\
		rm -f $(build_dir)/all.css.org ;\
		cat $(build_dir)/all.css | perl -pe 's/\n/ /g' | perl -pe 's#/\*.*?\*/##g' |  perl -pe 's/\s+/ /g' > $(build_dir)/all-comp.css ;\
		makeIE8css.pl $(build_dir)/all.css $(build_dir)/all_IE8.css ;\
	fi

clean:;
	@rm -rf $(build_dir)



