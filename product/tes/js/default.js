function hasClass(obj, cls) {
  return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
  if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
  if (hasClass(obj, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    obj.className = obj.className.replace(reg, ' ');
  }
}

function GetClass(className){
  return getElementsByClassName(className)
} 

var $c= function(array){
  var nArray = [];
  for (var i=0;i<array.length;i++) nArray.push(array[i]);
  return nArray;
}; 

Array.prototype.each=function(func){
  for(var i=0,l=this.length;i<l;i++) {func(this[i],i);};}; 
  var getElementsByClassName=function(cn){ 
    var hasClass=function(w,Name){ 
      var hasClass = false; 
      w.className.split(' ').each(function(s){ 
      if (s == Name) hasClass = true; 
    }); 
    return hasClass; 
  }; 
  var elems =document.getElementsByTagName("*")||document.all; 
  var elemList = []; 
  $c(elems).each(function(e){ 
  if(hasClass(e,cn)){elemList.push(e);} 
  }) 
  return $c(elemList); 
};

function getCurrentStyle(element) {
  return element.currentStyle || document.defaultView &&
    document.defaultView.getComputedStyle(element, null);
}

function offset(ele) {
    var top = ele.offsetTop;
    var left = ele.offsetLeft;
    while (ele.offsetParent) {
        ele = ele.offsetParent;
        if (window.navigator.userAgent.indexOf('MSTE 8') > -1) {
            top += ele.offsetTop;
            left += ele.offsetLeft;
        } else {
            top += ele.offsetTop + ele.clientTop;
            left += ele.offsetLeft + ele.clientLeft;
        }
    }
    return {
        left: left,
        top: top
    }

}

function clickAnimate(obj,left,top){
  var canvas = obj.getElementsByTagName("canvas")[0];

  var context = canvas.getContext("2d");
  var canvasWidth = canvas.offsetWidth;
  var canvasHeight = canvas.offsetHeight;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  var r = 0;

  var timer = setInterval(function(){
    r+=8;

    context.clearRect(0,0,canvasWidth,canvasHeight);

    context.save();
      
    context.fillStyle="rgba(220,220,220,0.2)";
    context.beginPath();
    context.arc(left,top,r,0,Math.PI*2,true);
    context.closePath();
    context.fill();

    context.restore();
    
    if((r+left)>=canvasWidth&&(left-r)<=0&&(r+top)>=canvasHeight&&(top-r)<=0){
      context.clearRect(0,0,canvasWidth,canvasHeight);
      clearInterval(timer);

      obj.style.zIndex = "9";
    }


  },13);

}

function menuShow(obj){
  var number = obj.getAttribute("value");
      
  if(number!=null){
    var bg
      , bgList = document.getElementsByClassName("menuBg");
    for (var i = bgList.length - 1; i >= 0; i--) {
      if(bgList[i].getAttribute("value")==number)
        bg=bgList[i];
    };
    if(bg!=null){
      if(hasClass(bg,"hideStatus"))
        removeClass(bg,"hideStatus");

      bg.style.display = "block";
      bg.style.width = getCurrentStyle(obj).width;
      bg.style.height = parseInt(getCurrentStyle(obj).height) +parseInt(getCurrentStyle(obj).paddingBottom)+"px";
      bg.style.backgroundColor = getCurrentStyle(obj).backgroundColor;
      bg.style.left = offset(obj).left +"px";
      bg.style.top = offset(obj).top+ "px";

      var status = {
        width:bg.style.width,
        height:bg.style.height,
        left:bg.style.left,
        top:bg.style.top,
        margin:bg.style.margin,
        zIndex:getCurrentStyle(bg).zIndex,
        position:getCurrentStyle(bg).position
      }

      addClass(bg,"showStatus");
      
      bg.style.width="100%";
      bg.style.height="100%";
      bg.style.left="0";
      bg.style.top="0";
      bg.style.margin="0";
      bg.style.zIndex = "13";
      setTimeout(function(){bg.style.position = "fixed";},900)

      var backBtn = bg.getElementsByClassName("back")[0];

      backBtn.style.opacity = "1";

      var enterBtn = bg.getElementsByClassName("enter")[0];

      
      if(enterBtn!=null){
        enterBtn.style.opacity = "1";

        enterBtn.onclick = function(){
          containShow(bg);
        }

      }

      backBtn.onclick = function(){
        if(enterBtn!=null&&enterBtn.style.display=="none"){
          setTimeout(function(){menuHide(backBtn,enterBtn,bg,obj,status)},200);
          containHide(bg);
        }else{
          menuHide(backBtn,enterBtn,bg,obj,status);
        }
      }
    }
  }
}

function menuHide(backBtn,enterBtn,bg,obj,status){
  removeClass(bg,"showStatus");
  addClass(bg,"hideStatus");

  backBtn.style.opacity="0";
  if(enterBtn!=null)
    enterBtn.style.opacity="0";

  bg.style.width=status.width;
  bg.style.height=status.height;
  bg.style.left=status.left;
  bg.style.top=status.top;
  bg.style.margin=status.margin;
  bg.style.zIndex = status.zIndex;
  bg.style.position = status.position;
  setTimeout(function(){bg.style.display = "none";},300);

  obj.style.zIndex = null;

  var menu = document.getElementsByClassName("menu");
  for (var i = menu.length - 1; i >= 0; i--) {
    menu[i].clicked=false;
  };

}

function containShow(bg){
  var contain = bg.getElementsByClassName("contain-box")[0];
  var bottom = bg.getElementsByClassName("bottom-bar")[0];
  var enterBtn = bg.getElementsByClassName("enter")[0];

  bottom.style.height = 0;
  setTimeout(function(){enterBtn.style.display="none";},100);
  contain.style.top = 0;

}

function containHide(bg){
  var contain = bg.getElementsByClassName("contain-box")[0];
  var bottom = bg.getElementsByClassName("bottom-bar")[0];
  var enterBtn = bg.getElementsByClassName("enter")[0];

  setTimeout(function(){enterBtn.style.display="block";},300);
  
  bottom.style.height = 64+ "px";
  contain.style.top = "100%";
}


function initPage(){
  var menu = document.getElementsByClassName("menu");

  for (var i = menu.length - 1; i >= 0; i--) {
    menu[i].appendChild(document.createElement("canvas"));

    menu[i].clicked=false;

    menu[i].onclick = function(e){
      var buttonOffset = offset(this);
      var canvasLeft = e.pageX-buttonOffset.left;
      var canvasTop = e.pageY-buttonOffset.top;


      clickAnimate(this,canvasLeft,canvasTop);

      if(!this.clicked)
        menuShow(this);

      for (var i = menu.length - 1; i >= 0; i--) {
        menu[i].clicked=true;
      };
      
    };
  };
}

