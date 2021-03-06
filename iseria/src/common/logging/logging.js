/* $Id: logging.js 1397 2007-06-13 02:17:47Z faiz_kazi $ -- $HeadURL: http://svn.dev.dreamarts.co.jp/svn/iseria/insuite-ui/trunk/src/common/logging/logging.js $ */
/*for JSLINT undef checks*/
/*extern DA */
/**
 * TODO: comments
 *
 *
 *
 */
 
if ('undefined' === typeof DA) {
    alert("ERROR: need DA.js");
} else {
    if (! DA.logging) {
        DA.logging = {};
    }
}

/**
 * TODO: comments
 *
 *
 *
 */
DA.logging.Logger = function (elem) {
  var _elem = elem ? elem : document.body;
  var div = document.createElement("div");
  div.innerHTML = 'Log: ';
  
  // 3 buttons
  var showBtn = document.createElement("button");
  showBtn.innerHTML = "Show Log";
  var hideBtn = document.createElement("button");
  hideBtn.innerHTML = "Hide Log";
  hideBtn.disabled = true;
  var clearBtn = document.createElement("button");
  clearBtn.innerHTML = "Clear Log";

  // <PRE> tag for the log
  var pre = document.createElement("pre");
  pre.style.display = "none";
  pre.style.height = "100px";
  pre.style.overflow = 'scroll';
  pre.style.backgroundColor = '#225522';
  pre.style.color =  '#ffffff';
  pre.style.fontSize = '9pt';

  showBtn.onclick = function() {
    pre.style.display = 'block';
    this.disabled = true;
    hideBtn.disabled = false;
  };
  hideBtn.onclick = function() {
    pre.style.display = 'none';
    this.disabled = true;
    showBtn.disabled = false;
  };
  clearBtn.onclick = function() {
    pre.innerHTML = "";
  };

  div.appendChild(showBtn);
  div.appendChild(hideBtn);
  div.appendChild(clearBtn);
  
  div.appendChild(pre);
 
  _elem.appendChild(div);
  this.log = function(str) {
    pre.appendChild(document.createTextNode(str + "\n\r"));
    pre.scrollTop = pre.scrollHeight;

  };
  
};

/**
 * @see DA.util#time_diff
 */
DA.logging.time_diff = DA.util.time_diff;

