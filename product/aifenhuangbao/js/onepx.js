/**
* onepx.js v1.3
* Author: Bear
* Date: 2014-06-05
*/
(function () {
var addStyleCache = [],// 要增加的样式的缓存区
helperID = 0,// 为每一个helper分配一个id
hasSetOnepxCommonStyle = false,// 是否已经设置了helper共用的样式
directions = ["top", "right", "bottom", "left"],
tDirections = ["top-left", "top-right", "bottom-right", "bottom-left"]
;


// 监听ele增加事件
function observeDOMInsert(dom, callback) {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    if (MutationObserver) {
        new MutationObserver(function (mutations) {
            for (var i = 0, lenI = mutations.length; i < lenI; ++i) {
var mutation = mutations[i], addedNodes = mutation.addedNodes;//  有增加元素
if (addedNodes && addedNodes.length) {
    for (var j = 0, lenJ = addedNodes.length; j < lenJ; ++j) {
        var node = addedNodes[j];
        callback(node);
    }
}
}
}).observe(dom, { childList: true, subtree: true });
    }
    else if (window.addEventListener) {
        dom.addEventListener("DOMNodeInserted", function (e) {
            callback(e.target);
        }, false);
    }
}


// 获取style
function getStyle(oElm, strCssRule) {
    var strValue = "";
    if (window.getComputedStyle) {
        strValue = window.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    }
    else if (oElm.currentStyle) {
        strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
            return p1.toUpperCase();
        });
        strValue = oElm.currentStyle[strCssRule];
    }
    return strValue;
}
// 添加style
function addStyle2Head(cssText) {
    addStyleCache.push(cssText);
    setTimeout(function () {
        var stylesText = "";
        while (addStyleCache.length) {
            stylesText += "\n" + addStyleCache.shift();
        }

        if (!stylesText) return;

        var style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = stylesText;
        } else {
            style.appendChild(document.createTextNode(stylesText));
        }
        document.head.appendChild(style);
    }, 100);
}


// 计算元素的border-radius样式，分多方向的原因是兼容部分浏览器
function calcBorderRadiusStyle(ele) {
    var out = "";
    for (var i = 0, lenI = tDirections.length; i < lenI; ++i) {
        var dir = tDirections[i],
        br = getStyle(ele, "border-" + dir + "-radius"), val = "";

        if (br != "0px") {
            val = ";" + "border-" + dir + "-radius:";
            if (br.indexOf("%") > -1) val += br;
            else {
                br = br.match((/([-\d\.]*)(\w*)/));
                val += "" + br[1] * 2 + br[2]
            }
        }
        out += val;
    }
    return out + ";";
}
// 计算元素的正常(非border-radius)样式
function calcBorderNormalStyle(ele) {
    var out = "";
    for (var i = 0, len = directions.length; i < len; ++i) {
        var dir = directions[i], val = getStyle(ele, "border-" + dir + "-width");
        if (!val || val.indexOf("1px") < 0) continue;

        out += ";border-" + dir + ": " + val + " " + getStyle(ele, "border-" + dir + "-style") + " " + getStyle(ele, "border-" + dir + "-color");
    }
    return out;
}


// 设置helper
function setHelper(ele) {
// 计算helper的border的CSS
var helperStyle = calcBorderNormalStyle(ele);
if (!helperStyle) return;

// 计算helper的圆角样式
helperStyle += calcBorderRadiusStyle(ele);

//  创建helper
var helper = document.createElement("div");
helper.className = "onepxHelper";
helper.id = "onepx" + ++helperID;
helperStyle = "#" + helper.id + "{" + helperStyle + "}";

//  处理helper自定义样式
var customStyle = ele.getAttribute("onepx");
if (customStyle) {
    var mods = customStyle.split("&");
    for (var i = 0, len = mods.length; i < len; ++i) {
        var mod = mods[i].split("@");
        if (mod.length < 2) return;

        var parents = mod[0], css = mod[1];
        helperStyle = helperStyle + "\n" + parents + " #" + helper.id + "{" + css + ";}"
    }
}
addStyle2Head(helperStyle);

//  设置载体的相关属性
var nodeName = ele.nodeName;
ele.style.border = "0";
if (nodeName == "IMG" || nodeName == "INPUT" || nodeName == "TEXTAREA" || nodeName == "SELECT" || nodeName == "OBJECT") {
    var margin = "", position = getStyle(ele, "position"), display = getStyle(ele, "display");
    for (i = 0, len = directions.length; i < len; ++i) {
        var dir = directions[i], val = getStyle(ele, "margin-" + dir);
        if (!val) continue;
        margin += ";margin-" + dir + ": " + val;
    }
    if (display == "inline") display = "inline-block";
    if (position != "absolute" && position != "relative") position = "relative";
    ele.style.fontSize = getStyle(ele, "font-size");
    ele.style.margin = "0";
    ele.style.position = "static";
    ele.outerHTML =
    "<span id='onepxWrap" + helperID + "' class='onepxWrap' style='position:" + position + ";display:" + display + margin + ";font-size:0" + "'>"
    + helper.outerHTML
    + ele.outerHTML
    + "</span>"
} else {
    var elePos = getStyle(ele, "position");
    if (elePos != "absolute" && elePos != "relative") {
        ele.style.position = "relative";
    }
    ele.insertBefore(helper, ele.firstChild);
    ele.setAttribute("onepxset", "");
}
}


function onepx(targetSelectors/*[parentSelector][isListen]*/) {//  父类的selector 要设置的class和是否需要动态监听
    var devicePixRatio = window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI) || 1;
    if (devicePixRatio <= 1 || !getStyle(document.body, "display") || !targetSelectors) return;

//  增加helper共用的样式
if (!hasSetOnepxCommonStyle) {
    addStyle2Head(
        "/*Use to build 1px line.*/\n" +
        ".onepxHelper{ position:absolute;z-index:1;pointer-events:none;top:0;left:0;width:200%;height:200%;"
        + "-webkit-transform-origin: 0 0;-ms-transform-origin: 0 0;transform-origin: 0 0;"
        + "-webkit-transform:scale(0.5);-ms-transform:scale(0.5);transform:scale(0.5);"
        + "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box"
        + " }"
        );
    hasSetOnepxCommonStyle = true;
}

//  解析参数
var parentSelector, isListen;//  解析见方法声明
if (arguments[1] && typeof(arguments[1]) == "string") {
    parentSelector = arguments[1];
    isListen = arguments[2];
} else {
    isListen = arguments[1];
}

//  解析要设置的class
var parent = (parentSelector && document.querySelector(parentSelector)) || document.body,
tgtSelectors = targetSelectors.split(",");
for (var i = 0, lenI = tgtSelectors.length; i < lenI; ++i) {
var eles = parent.querySelectorAll(tgtSelectors[i] + ":not(.onepxHelper):not([onepxset])");//预防多次运行
for (var j = 0, lenJ = eles.length; j < lenJ; ++j) {
    setHelper(eles[j]);
}
}
if (isListen) {//  如果有启用监听（新增元素）
    observeDOMInsert(parent, function (ele) {
        if (ele.nodeType != 1) return;

        var eleParent = ele.parentNode;
        if(!eleParent || eleParent.tarName == "HTML") eleParent = document.body;

        for (i = 0, lenI = tgtSelectors.length; i < lenI; ++i) {
            var eles = eleParent.querySelectorAll(tgtSelectors[i] + ":not(.onepxHelper):not([onepxset])");
            for (j = 0, lenJ = eles.length; j < lenJ; ++j) {
                setHelper(eles[j]);
            }
        }
    });
}
}
window.onepx = onepx;
})();