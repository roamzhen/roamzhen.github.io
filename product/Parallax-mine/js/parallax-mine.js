
(function() {

var
  version = '1.0.0-beta.0',
  mParallex = function( opts ){
    return new MParallex( opts );
  };

var MParallex = function(opts){

  this._setting(opts);
  this._bindDom();
  this._bindScroll();
};

MParallex.prototype._setting = function(opts){
  
  this.version = version;
  this._opts = opts;

  this.bodyHeight = document.body.clientHeight;
  this.screenHeight = window.screen.availHeight;

  if(opts.targets && opts.targets.length>0){
    this.targets = opts.targets;
  }

}

MParallex.prototype._bindDom = function(){
  
  for(var i=0; this.targets && i < this.targets.length; i++){
    var tmpObj = this.targets[i];

    tmpObj.offsetTop = getoffsetTop(tmpObj.dom);
    tmpObj.clientHeight = tmpObj.dom.clientHeight;

    tmpObj.showTop = tmpObj.offsetTop - this.screenHeight;
    tmpObj.hideTop = tmpObj.offsetTop - this.screenHeight + tmpObj.clientHeight;

    if(tmpObj.animation)
      tmpObj.dom.style.cssText = "-webkit-transform:translate3d(" + tmpObj.animation.from + "px,0,0);";

  }

  function getoffsetTop(dom){
    var offsetTop = 0;
    if(dom.parentNode && (dom.parentNode != document.body)){
      offsetTop = dom.offsetTop + getoffsetTop(dom.parentNode);
      return offsetTop;
    }else{
      return dom.offsetTop;
    }

  }

}

MParallex.prototype._bindScroll = function(){
  var that = this;
  
  this.touched = false;
  this.scrollTop = 0;

  this.scrollTimer = setInterval(function(){
    if(that.touched)
      scrollCheck.call(that);
  },200);
  
  document.body.addEventListener("touchmove",function(){
    that.touched = true;
  });

  document.body.addEventListener("touchend",function(){
    that.touched = false;
  });

}

function scrollCheck(){
  this.scrollTop = document.body.scrollTop;

  for(var i=0; i< this.targets.length; i++){
    var tmpObj = this.targets[i];


    if(tmpObj.animation && this.scrollTop >= tmpObj.showTop){
      var dis = (this.scrollTop - tmpObj.showTop)*((tmpObj.animation.step)?(tmpObj.animation.step):(1));

      tmpObj.dom.style.cssText = "-webkit-transform:translate3d(" + (tmpObj.animation.from - dis) + "px,0,0)";

      if(tmpObj.animation.to >= (tmpObj.animation.from - dis)){
        tmpObj.dom.style.cssText = "-webkit-transform:translate3d(" + tmpObj.animation.to + "px,0,0)";
      }
    }

  }
}

function scorllListner(e){
  if(this.touched){

  }

}

window.mParallex = mParallex;

})();

var box = document.getElementsByClassName("box");

for (var i = box.length - 1; i >= 0; i--) {
  box[i]
};

var opts = {
  targets: [
  ]
};

var box = document.getElementsByClassName("box");

for (var i = box.length - 1; i >= 0; i--) {
  opts.targets.push({
    dom : box[i],
    animation:{
        step : 0.9,
        from : window.screen.availWidth,
        to : 0
      }
  });
};

var mParallex  = mParallex(opts);
