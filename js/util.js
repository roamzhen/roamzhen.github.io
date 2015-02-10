
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

// style changer
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

// Utils
function $ (selector) {
  var elems = document.querySelectorAll(selector);
  return (elems.length > 1) ? elems : elems[0];
}
