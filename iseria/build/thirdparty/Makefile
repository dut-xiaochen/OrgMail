THIRD_PARTY_JS_BASEDIR = /var/www/js
BUILD_TOOLS_DIR = /home/faiz/public_html/tools/build
JS_INTERPRETER = /usr/bin/js
DEPLIST_FILE = thirdparty-deps.list
ALLOUT_FILE = thirdparty-all.js

default: all

test: $(DEPLIST_FILE)
	sed '/^\s*#/d' $(DEPLIST_FILE) |  \
	    ( cd $(THIRD_PARTY_JS_BASEDIR); \
	      xargs cat $(BUILD_TOOLS_DIR)/environment.js  ) | $(JS_INTERPRETER)

testn: $(DEPLIST_FILE)
	head -n $(TRYONLY) $(DEPLIST_FILE) | sed '/^\s*#/d;' |  \
	    ( cd $(THIRD_PARTY_JS_BASEDIR); \
	      xargs cat $(BUILD_TOOLS_DIR)/environment.js  ) | $(JS_INTERPRETER)

all: test $(DEPLIST_FILE)
	sed '/^\s*#/d' $(DEPLIST_FILE) | \
	    ( cd $(THIRD_PARTY_JS_BASEDIR); \
	      xargs cat ) > $(ALLOUT_FILE)

