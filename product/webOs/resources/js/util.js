/* removePre() */
function removePre(e) { e.preventDefault(); }

// dom manipulation
HTMLElement.prototype.addClass = function (classNames) {
  this.className += ' ' + classNames
}

HTMLElement.prototype.removeClass = function (classNames) {
  classNames = classNames.split(' ');
  for (var i = 0; i < classNames.length; i++) {
    this.className = this.className.replace(classNames[i], '');
  }
}

HTMLElement.prototype.hasClass = function (classNames) {
  this.className += ' ';
  classNames = classNames.split(' ');
  for (var i = 0; i < classNames.length; i++) {
    if (!this.className.match(classNames[i] + ' ')) {
      this.className = this.className.substring(0, this.className.length - 1);
      return false
    }
  }
  this.className = this.className.substring(0, this.className.length - 1);
  return true
}

HTMLElement.prototype.find = function (selector) {
  var elems = this.querySelectorAll(selector);
  return (elems.length > 1) ? elems : elems[0];
}

// style changer
HTMLElement.prototype.show = function (option) {
  this.style.display = (option) ? option : 'block';
}

HTMLElement.prototype.hide = function () {
  this.style.display = 'none';
}

HTMLElement.prototype.css = function (params) {
  for (param in params) {
    this.style[param] = params[param];
  }
}

HTMLElement.prototype.animate = function (params, duration) {
  var currentParams = {};
  for (param in params) {
    currentParams[param] = parseInt(getComputedStyle(this, null)[param]);
  }
}

HTMLElement.prototype.fadeOut = function (time) {
  var _self = this,
  	  _time = (time) ? time : 1000; 
  	
  _self.style.opacity = 0;
  
  
  setTimeout(function () {
    _self.style.display = 'none';
  }, _time);
}

HTMLElement.prototype.fadeIn = function () {
  var _self = this;
  _self.style.display = 'block';
  setTimeout(function () {
    _self.style.opacity = 1;
  }, 10);
}

// String Extension
String.prototype.getLengthOfBytes = function () {
  var chinese = this.match(/[^\x00-\xff]/ig);
  return this.length + (chinese == null ? 0 : chinese.length);
}

// Utils
function $ (selector) {
  var elems = document.querySelectorAll(selector);
  return (elems.length > 1) ? elems : elems[0];
}

var $$ = (function () {

  function init (dom) {
    var _dom = [];
    if (dom instanceof HTMLElement) {
      _dom.push(dom);
    } else {
      _dom = dom;
    }
    return _dom
  }

  return {
    show : function (dom) {
      var _dom = init(dom);
      for (var i = 0; i < _dom.length; i++) {
        _dom[i].show();
      }
    },
    hide : function (dom) {
      var _dom = init(dom);
      for (var i = 0; i < _dom.length; i++) {
        _dom[i].hide();
      }
    },
    bind : function (dom, event, handler) {
      var _dom = init(dom);
      for (var i = 0; i < _dom.length; i++) {
        _dom[i].addEventListener(event, function (e) {
          e.preventDefault();
          handler(e);
        }, false);
      }
    },
    unbind : function (dom, event) {
      var _dom = init(dom);
      for (var i = 0; i < _dom.length; i++) {
        _dom[i].removeEventListener(event);
      }
    },
    ready : function(fn){
		if(document.addEventListener){//兼容非IE
			document.addEventListener("DOMContentLoaded",function(){
				//注销事件，避免反复触发
				document.removeEventListener("DOMContentLoaded",arguments.callee,false);
				fn();//调用参数函数
			},false);
		}else if(document.attachEvent){//兼容IE
			document.attachEvent("onreadystatechange",function(){
				if(document.readyState==="complete"){
					document.detachEvent("onreadystatechange",arguments.callee);
					fn();
				}
			});
		}
	}
  }

})();