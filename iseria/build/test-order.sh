#!/bin/sh
DEPLIST_FILE=$1;
usage() {
    echo "Usage: "
    echo "  VAR=value, .. $0 <path-to-dependency file>";
    echo
    echo "Need the following environment variables:"
    echo "**required** PREFIX_DIR        (Path to the Javascript sources)"
    echo "**optional** TRYONLY           limit the number of entries, to allow resolution by trial-error"
    echo "**optional** ENVIRONMENT_FILES ':' separated list of JS files to include in the context"
}
[ -f "$DEPLIST_FILE"  -a -d "$PREFIX_DIR" ] || { 
    usage
    exit 1;
}
HERE=`pwd`
## FIXME: The process of parsing ENVIRONMENT_FILES does not allow
##        filenames with ' ' in between.
if [ -n "$ENVIRONMENT_FILES" ] ; then
    ENVIRONMENT_FILES=`echo $ENVIRONMENT_FILES | tr ':' ' '`
    for f in $ENVIRONMENT_FILES; do
        if [ -f "$f" ] ; then
	    if ! echo $f | egrep -q '^/' ; then 
               f=$HERE/$f
	    fi
	    _ENVIRONMENT_FILES="$_ENVIRONMENT_FILES $f"
	else
	    echo "Error: $f is not a file."
            exit 1;
	fi
    done
fi

if [ -z "$TRYONLY" ] ; then  TRYONLY='$'; fi

sed '/^\s*#/d' $DEPLIST_FILE |  sed -n "1,${TRYONLY}p" |
    ( cd $PREFIX_DIR; 
      xargs cat $_ENVIRONMENT_FILES ) | js && echo "Dependency order check OK"

