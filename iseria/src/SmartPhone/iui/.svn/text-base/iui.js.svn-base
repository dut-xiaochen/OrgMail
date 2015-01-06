/*
   Copyright (c) 2007-9, iUI Project Members
   See LICENSE.txt for licensing terms
 */


(function() {

var slideSpeed = 20;
var slideInterval = 0;

var currentPage = null;
var currentDialog = null;
var currentWidth = 0;
var currentHash = location.hash;
var hashPrefix = "#_";
var pageHistory = [];
var newPageCount = 0;
var checkTimer;
var hasOrientationEvent = false;
var portraitVal = "portrait";
var landscapeVal = "landscape";

// *************************************************************************************************

window.iui =
{
	animOn: false,	// Slide animation with CSS transition is now enabled by default where supported

	showPage: function(page, backwards, customParams)
	{
		if (page)
		{
// for ISE
			DA.customEvent.fire("iui.showPage.before", {
				page: page,
				backwards: backwards,
				customParams: customParams
			});
// <-- end

			if (currentDialog)
			{
				currentDialog.removeAttribute("selected");
				currentDialog = null;
			}

			if (hasClass(page, "dialog"))
				showDialog(page);
			else
			{
				var fromPage = currentPage;
				currentPage = page;

// for ISE
				// if (fromPage)
				if (fromPage && fromPage.id !== currentPage.id)
					setTimeout(slidePages, 0, fromPage, page, backwards, customParams);
				else
					updatePage(page, fromPage);
// <-- end
			}

// for ISE
			DA.customEvent.fire("iui.showPage.after", {
				page: page,
				backwards: backwards,
				customParams: customParams
			});
// <-- end
		}
	},

	showPageById: function(pageId)
	{
		var page = $(pageId);
		if (page)
		{
			var index = pageHistory.indexOf(pageId);
			var backwards = index != -1;
			if (backwards)
				pageHistory.splice(index, pageHistory.length);

			iui.showPage(page, backwards);
		}
	},

	showPageByHref: function(href, args, method, replace, cb)
	{
		var req = new XMLHttpRequest();
		req.onerror = function()
		{
			if (cb)
				cb(false);
		};
		
		req.onreadystatechange = function()
		{
			if (req.readyState == 4)
			{
				if (replace)
					replaceElementWithSource(replace, req.responseText);
				else
				{
					var frag = document.createElement("div");
					frag.innerHTML = req.responseText;
					iui.insertPages(frag.childNodes);
				}
				if (cb)
					setTimeout(cb, 1000, true);
			}
		};

		if (args)
		{
			req.open(method || "GET", href, true);
			req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			req.setRequestHeader("Content-Length", args.length);
			req.send(args.join("&"));
		}
		else
		{
			req.open(method || "GET", href, true);
			req.send(null);
		}
	},
	
	insertPages: function(nodes)
	{
		var targetPage;
		for (var i = 0; i < nodes.length; ++i)
		{
			var child = nodes[i];
			if (child.nodeType == 1)
			{
				if (!child.id)
					child.id = "__" + (++newPageCount) + "__";

				var clone = $(child.id);
				if (clone)
					clone.parentNode.replaceChild(child, clone);
				else
					document.body.appendChild(child);

				if (child.getAttribute("selected") == "true" || !targetPage)
					targetPage = child;
				
				--i;
			}
		}

		if (targetPage)
			iui.showPage(targetPage);	 
	},

	getSelectedPage: function()
	{
		for (var child = document.body.firstChild; child; child = child.nextSibling)
		{
			if (child.nodeType == 1 && child.getAttribute("selected") == "true")
				return child;
		}	 
	},
// for ISE
	getCurrentPage: function()
	{
		return currentPage;
	},
// <-- end
	isNativeUrl: function(href)
	{
		for(var i = 0; i < iui.nativeUrlPatterns.length; i++)
		{
			if(href.match(iui.nativeUrlPatterns[i])) return true;
		}
		return false;
	},
	nativeUrlPatterns: [
		new RegExp("^http:\/\/maps.google.com\/maps\?"),
		new RegExp("^mailto:"),
		new RegExp("^tel:"),
		new RegExp("^http:\/\/www.youtube.com\/watch\\?v="),
		new RegExp("^http:\/\/www.youtube.com\/v\/"),
		new RegExp("^javascript:"),

	]
};

// *************************************************************************************************

// for ISE
// addEventListener("load", function(event)
// {
window.iui.onload = function()
{
// <-- end
	var page = iui.getSelectedPage();
	var locPage = getPageFromLoc();
		
	if (page)
			iui.showPage(page);
	
	if (locPage && (locPage != page))
		iui.showPage(locPage);
	
	setTimeout(preloadImages, 0);
	if (typeof window.onorientationchange == "object")
	{
		window.onorientationchange=orientChangeHandler;
		hasOrientationEvent = true;
		setTimeout(orientChangeHandler, 0);
	}
	setTimeout(checkOrientAndLocation, 0);
	checkTimer = setInterval(checkOrientAndLocation, 300);
// for ISE
// }, false);
};
// <-- end

addEventListener("unload", function(event)
{
	return;
}, false);
	
addEventListener("click", function(event)
{
// for ISE
	DA.customEvent.fire("iui.onclickEvent.before", {
		event: event
	});
// <-- end

	var link = findParent(event.target, "a");
	if (link)
	{
		function unselect() { link.removeAttribute("selected"); }
	
		if (link.href && link.hash && link.hash != "#" && !link.target)
		{
// for ISE
			var t = $(link.hash.substr(1));
			if( ! t ) {
				if( typeof(DA.vars) == 'object' ){
					alert( DA.vars.notFoundPageMsg );
				} else {
					alert("Under construction!");

				}
				event.preventDefault();		   
				return ;	
			}
			
			DA.customEvent.fire("iui.onclickLink.before", {
				event: event,
				link: link
			});
// <-- end

			link.setAttribute("selected", "true");

// for ISE
			// iui.showPage($(link.hash.substr(1)));
			iui.showPage($(link.hash.substr(1)), link.id === "backButton");
// <-- end

			setTimeout(unselect, 500);

// for ISE
			DA.customEvent.fire("iui.onclickLink.after", {
				event: event,
				link: link
			});
// <-- end
		}
		else if (link == $("backButton"))
		{
// for ISE
			var page = iui.getSelectedPage();
			var back = page.getAttribute("historyback");

			// history.back();
			DA.customEvent.fire("iui.onclickBackButton.before", {
				event: event,
				link: link,
				page: page,
				back: back
			});

			if (back) {
				iui.showPage($(back.substr(1)), true);
			} else {
				history.back();
			}

			DA.customEvent.fire("iui.onclickBackButton.after", {
				event: event,
				link: link,
				page: page,
				back: back
			});
// <-- end
		}
		else if (link.getAttribute("type") == "submit")
		{
			var form = findParent(link, "form");
			if (form.target == "_self")
			{
			    form.submit();
			    return;  // return so we don't preventDefault
			}
			submitForm(form);
		}
		else if (link.getAttribute("type") == "cancel")
			cancelDialog(findParent(link, "form"));
		else if (link.target == "_replace")
		{
			link.setAttribute("selected", "progress");
			iui.showPageByHref(link.href, null, null, link, unselect);
		}
		else if (iui.isNativeUrl(link.href))
		{
			return;
		}
		else if (link.target == "_webapp")
		{
			location.href = link.href;
		}
		else if (!link.target)
		{
// for ISE
			// link.setAttribute("selected", "progress");
			// iui.showPageByHref(link.href, null, null, null, unselect);
			var url = link.protocol + "//" + link.host + link.pathname + link.search + "#";
			if (link.href && !link.href.match(/\/return\%20false;/) && url !== link.href && url !== "#") {
				link.setAttribute("selected", "progress");
				iui.showPageByHref(link.href, null, null, null, unselect);
			}
// <-- end
		}
		else
			return;

// for ISE
		DA.customEvent.fire("iui.onclickEvent.after", {
			event: event
		});
// <-- end
		
// for ISE 
		event.preventDefault();		   
	}
}, true);

addEventListener("click", function(event)
{
	var div = findParent(event.target, "div");
	if (div && hasClass(div, "toggle"))
	{
		div.setAttribute("toggled", div.getAttribute("toggled") != "true");
		event.preventDefault();		   
	}
}, true);

function getPageFromLoc()
{
	var page;
	var result = location.hash.match(/#_([^\?_]+)/);
	if (result)
		page = result[1];
	if (page)
		page = $(page);
	return page;
}

function orientChangeHandler()
{
	var orientation=window.orientation;
	switch(orientation)
	{
	case 0:
		setOrientation(portraitVal);
		break;	
		
	case 90:
	case -90: 
		setOrientation(landscapeVal);
		break;
	}
}


function checkOrientAndLocation()
{
	if (!hasOrientationEvent)
	{
	  if (window.innerWidth != currentWidth)
	  {	  
		  currentWidth = window.innerWidth;
		  var orient = DAterm.getOrientation();
		  setOrientation(orient);
	  }
	}

	if (location.hash != currentHash)
	{
// for ISE
		DA.customEvent.fire("iui.checkOrientAndLocation.showPageById.before", {
		});
// <-- end

		var pageId = location.hash.substr(hashPrefix.length);
		iui.showPageById(pageId);

// for ISE
		DA.customEvent.fire("iui.checkOrientAndLocation.showPageById.after", {
			pageId: pageId
		});
// <-- end
	}
}

function setOrientation(orient)
{
	document.body.setAttribute("orient", orient);
	setTimeout(scrollTo, 100, 0, 1);
}

function showDialog(page)
{
	currentDialog = page;
	page.setAttribute("selected", "true");
	
	if (hasClass(page, "dialog") && !page.target)
		showForm(page);
}

function showForm(form)
{
	form.onsubmit = function(event)
	{
		event.preventDefault();
		submitForm(form);
	};
	
	form.onclick = function(event)
	{
		if (event.target == form && hasClass(form, "dialog"))
			cancelDialog(form);
	};
}

function cancelDialog(form)
{
	form.removeAttribute("selected");
}

function updatePage(page, fromPage)
{
	if (!page.id)
		page.id = "__" + (++newPageCount) + "__";

	location.hash = currentHash = hashPrefix + page.id;
	pageHistory.push(page.id);

/* for ISE
	var pageTitle = $("pageTitle");
	if (page.title)
		pageTitle.innerHTML = page.title; */

	if (page.localName.toLowerCase() == "form" && !page.target)
		showForm(page);
	
/* for ISE	
	var backButton = $("backButton");
	if (backButton)
	{
		var prevPage = $(pageHistory[pageHistory.length-2]);
		if (prevPage && !page.getAttribute("hideBackButton"))
		{
			backButton.style.display = "inline";
			backButton.innerHTML = prevPage.title ? prevPage.title : "Back";
		}
		else
			backButton.style.display = "none";
	}*/
// for ISE
	var backButton = $("backButton");
	if (backButton)
	{
		var title = page.getAttribute("backtitle");
		if (title) {
			backButton.innerHTML = title;
		}
	}
}

function slidePages(fromPage, toPage, backwards, customParams)
{		 
	var axis = (backwards ? fromPage : toPage).getAttribute("axis");

	clearInterval(checkTimer);

// for ISE	
//	if (canDoSlideAnim() && axis != 'y')
//	{
//	  slide2(fromPage, toPage, backwards, slideDone);
	if (canDoSlideAnim())
	{
	  slide2(fromPage, toPage, backwards, axis, slideDone);
// <-- end
	}
	else
	{
	  slide1(fromPage, toPage, backwards, axis, slideDone);
	}

	function slideDone()
	{
// for ISE
		DA.customEvent.fire("iui.slidePages.slideDone.before", {
			fromPage: fromPage,
			toPage: toPage,
			backwards: backwards,
			customParams: customParams
		});
// <-- end

// for ISE
//        if (!hasClass(toPage, "dialog"))
//                fromPage.removeAttribute("selected");
	  if (!hasClass(toPage, "dialog")) {
	      fromPage.removeAttribute("selected");
              fromPage.style.display = "";
          }
// <-- end
	  checkTimer = setInterval(checkOrientAndLocation, 300);
	  setTimeout(updatePage, 0, toPage, fromPage);
// for ISE
//	  fromPage.removeEventListener('webkitTransitionEnd', slideDone, false);
	  if (axis) {
	  	if (backwards) {
	  		fromPage.removeEventListener('webkitTransitionEnd', slideDone, false);
	  	} else {
	  		toPage.removeEventListener('webkitTransitionEnd', slideDone, false);
	  	}
	  } else {
	  	fromPage.removeEventListener('webkitTransitionEnd', slideDone, false);
	  }
// <-- end

// for ISE
		DA.customEvent.fire("iui.slidePages.slideDone.after", {
			fromPage: fromPage,
			toPage: toPage,
			backwards: backwards,
			customParams: customParams
		});
// <-- end
	}
}

function canDoSlideAnim()
{
  return (iui.animOn) && (typeof WebKitCSSMatrix == "object");
}

function slide1(fromPage, toPage, backwards, axis, cb)
{
// for ISE
//	if (axis == "y")
//		(backwards ? fromPage : toPage).style.top = "100%";
//	else
//		toPage.style.left = "100%";
	if (axis == "y") {
		(backwards ? fromPage : toPage).style.top = "100%";
		fromPage.style.left = "";
		toPage.style.left = "";
	} else {
		toPage.style.left = "100%";

	}
// <-- end

	scrollTo(0, 1);
	toPage.setAttribute("selected", "true");
	var percent = 100;
	slide();
	var timer = setInterval(slide, slideInterval);

	function slide()
	{
		percent -= slideSpeed;
		if (percent <= 0)
		{
			percent = 0;
			clearInterval(timer);
			cb();
		}
	
		if (axis == "y")
		{
			backwards
				? fromPage.style.top = (100-percent) + "%"
				: toPage.style.top = percent + "%";
		}
		else
		{
			fromPage.style.left = (backwards ? (100-percent) : (percent-100)) + "%"; 
			toPage.style.left = (backwards ? -percent : percent) + "%"; 
		}
	}
}

// for ISE
// function slide2(fromPage, toPage, backwards, cb)
function slide2(fromPage, toPage, backwards, axis, cb)
// <-- end
{
// for ISE
//	toPage.style.webkitTransitionDuration = '0ms'; // Turn off transitions to set toPage start offset
	// fromStart is always 0% and toEnd is always 0%
	// iPhone won't take % width on toPage
//	var toStart = 'translateX(' + (backwards ? '-' : '') + window.innerWidth +	'px)';
//	var fromEnd = 'translateX(' + (backwards ? '100%' : '-100%') + ')';
//	toPage.style.webkitTransform = toStart;
//	toPage.setAttribute("selected", "true");
//	toPage.style.webkitTransitionDuration = '500ms';          // Turn transitions back on
	var toStart, toEnd, fromEnd, targetPage;
	if (axis) {
		targetPage = backwards ? fromPage : toPage;
		toStart = 'translateY(' + (backwards ? '0' : window.innerHeight) + 'px)';
		toEnd   = 'translateY(' + (backwards ? '100' : '0') + '%)';
		toPage.style.webkitTransform = "";
		fromPage.style.webkitTransform = "";
		targetPage.style.webkitTransitionDuration = '0ms';
		targetPage.style.webkitTransform = toStart;
		targetPage.style.webkitTransitionDuration = '500ms';
		toPage.setAttribute("selected", "true");
	} else {
		toStart = 'translateX(' + (backwards ? '-' : '') + window.innerWidth + 'px)';
		toEnd   = 'translateX(0%)';
		fromEnd = 'translateX(' + (backwards ? '100%' : '-100%') + ')';
		toPage.style.webkitTransitionDuration = '0ms';
		toPage.style.webkitTransform = toStart;
		toPage.style.webkitTransitionDuration = '500ms';
		toPage.setAttribute("selected", "true");
	}
// <-- end

// for ISE
//	function startTrans()
//	{
//		fromPage.style.webkitTransform = fromEnd;
//		toPage.style.webkitTransform = 'translateX(0%)'; //toEnd
//	}
//	fromPage.addEventListener('webkitTransitionEnd', cb, false);
	if (axis) {
		window.scrollTo(0, 1);
		var startTrans = function()
		{
			targetPage.style.zIndex = "10";
			targetPage.style.webkitTransform = toEnd; //toEnd
		}
		targetPage.addEventListener('webkitTransitionEnd', cb, false);
	} else {
		var startTrans = function ()
		{
			fromPage.style.webkitTransform = fromEnd;
			toPage.style.webkitTransform = toEnd; //toEnd
		}
		fromPage.addEventListener('webkitTransitionEnd', cb, false);
	}
// <-- end
	setTimeout(startTrans, 0);
}

function preloadImages()
{
	var preloader = document.createElement("div");
	preloader.id = "preloader";
	document.body.appendChild(preloader);
}

function submitForm(form)
{
	iui.showPageByHref(form.action || "POST", encodeForm(form), form.method);
}

function encodeForm(form)
{
	function encode(inputs)
	{
		for (var i = 0; i < inputs.length; ++i)
		{
			if (inputs[i].name)
				args.push(inputs[i].name + "=" + escape(inputs[i].value));
		}
	}

	var args = [];
	encode(form.getElementsByTagName("input"));
	encode(form.getElementsByTagName("textarea"));
	encode(form.getElementsByTagName("select"));
	return args;	
}

function findParent(node, localName)
{
// for ISE
	// while (node && (node.nodeType != 1 || node.localName.toLowerCase() != localName))
	while (node && (node.nodeType != 1 || node.localName.toLowerCase() != localName || node.tagName.toLowerCase() != localName))
		node = node.parentNode;
// <-- end
	return node;
}

function hasClass(self, name)
{
	var re = new RegExp("(^|\\s)"+name+"($|\\s)");
	return re.exec(self.getAttribute("class")) != null;
}

function replaceElementWithSource(replace, source)
{
	var page = replace.parentNode;
	var parent = replace;
	while (page.parentNode != document.body)
	{
		page = page.parentNode;
		parent = parent.parentNode;
	}

	var frag = document.createElement(parent.localName);
	frag.innerHTML = source;

	page.removeChild(parent);

	while (frag.firstChild)
		page.appendChild(frag.firstChild);
}

function $(id) { return document.getElementById(id); }
function ddd() { console.log.apply(console, arguments); }

})();
