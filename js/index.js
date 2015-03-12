(function(){

var 
  wrap = $(".wrap"),
  aside = $(".aside"),
  menuBtn = $(".menu-btn");

var tad = (IsPC())?("click"):("touchstart");

var myPage = {
  init : function(){
    initMenuBtn();
    initWordChanger();

    stopWindowDrag();

    myPage._initStep();
    myPage._initProduct();
  },
  _initStep: function(){
    initStepBtn();
  },
  _initProduct : function(){
    productClass.init();
  }
}


/* step-btn */
function initStepBtn(){

  var 
    helloTop = $(".hello")[0].offsetTop + $(".hello")[0].offsetHeight/2,
    intrTop = $(".intr")[0].offsetTop + $(".intr")[0].offsetHeight/2,
    productTop = $(".product")[0].offsetTop + $(".product")[0].offsetHeight/4,
    contactTop = productTop + $(".product")[0].offsetHeight/2;

  var scrollList = [helloTop,intrTop,productTop,contactTop,contactTop,contactTop];

  var stepBtnList = $(".step-btn");


  stepBtnList.each(function(i){
    this.num = i;

    $(this).on(tad,function(){
      for (var j = stepBtnList.length - 1; j >= 0; j--) {
        stepBtnList.removeClass("active");
      };
      $(this).addClass("active");

      wrap[0].scrollTop = scrollList[this.num];
    });
  });

  wrap.on("scroll",function(){
    var nowTop = wrap[0].scrollTop;
    if(nowTop <= helloTop){
      
      stepBtnList.removeClass("active");
      $(stepBtnList[0]).addClass("active");

    }else{

      if(nowTop <= intrTop){
        stepBtnList.removeClass("active");
        $(stepBtnList[1]).addClass("active");
      }else{

        if(nowTop <= productTop){
          stepBtnList.removeClass("active");
          $(stepBtnList[2]).addClass("active");
        }else{
          stepBtnList.removeClass("active");
          $(stepBtnList[3]).addClass("active");
          $(stepBtnList[4]).addClass("active");
          $(stepBtnList[5]).addClass("active");

        }
      }

    }

  });
}

/* end step-btn */

/* menuBtn */
function initMenuBtn(){

  menuBtn[0].clicked = false;
  menuBtn.on(tad,function(){
    if(this.clicked){
      menuHide();
    }else{
      menuShow();
    }
    this.clicked = !this.clicked;
  });

  function menuShow(){

    if(wrap!=null&&aside!=null&&menuBtn!=null)
    {
      menuBtn.addClass("active");
      aside.addClass("active");
      wrap.addClass("scale");
    }
  }
  function menuHide(){

    if(wrap!=null&&aside!=null&&menuBtn!=null)
    {

      menuBtn.removeClass("active");
      aside.removeClass("active");
      wrap.removeClass("scale");
    }
  }
}
/* end Menu Btn */

/* word-changer */
function initWordChanger(){
  var newSpan = $(".new")[0];
  var oldSpan = $(".old")[0];

  var likeList = ["Javascript","HTML5","WebApp","Hybrid App","Programing","Cook","Yummy Food","Web Components","React"];

  var backNumber = 0;

  var wordChangerTimer = setInterval(function(){

    var random = parseInt(Math.random()*(likeList.length));
    if(random==backNumber)
        while(random==backNumber){
          random = parseInt(Math.random()*(likeList.length));
        }
    backNumber=random;

    var newWord = likeList[random];
    var oldWord = newSpan.innerHTML;

    var newIndex = 0;
    var oldIndex = 0;

    for (var i = 0; i <= newWord.length; i++) {
      setTimeout(function(){
          newSpan.innerHTML = newWord.substr(0,newIndex);
          newIndex++;
      },i*40);

    };

    for (var j = 0; j <= oldWord.length; j++) {
      setTimeout(function(){
          oldSpan.innerHTML = oldWord.substr(oldIndex);
          oldIndex++;
      },j*40);

    };


  },2000);
}
/* end word-changer */

//productSlider Class
var productClass = (function(){

  var 
    product = $("#product")[0],
    arrow_left = $("#arrow_left"),
    arrow_right = $("#arrow_right");

  var product_left=0;
  var product_location=0;

  var cWidth = document.body.clientWidth;

  var product_dev = Math.min(parseInt(cWidth / 270),3);

  var product_number = Math.ceil($(".product-con").length/product_dev);
  var product_item_width = 270 * product_dev;

  function init(){

    product_dev = Math.min(parseInt(cWidth / 270),3);

    product_number = Math.ceil(document.getElementsByClassName("product-con").length/product_dev);
    product_item_width = 270 * product_dev;

    product.style.width = product_number*product_item_width +"px";

    arrow_left.on(tad,function(){
      cWidth = document.body.clientWidth;

      product_dev = Math.min(parseInt(cWidth / 270),3);

      product_number = Math.ceil($(".product-con").length/product_dev);
      product_item_width = 270 * product_dev;

      product.style.width = product_number*product_item_width +"px";

      if(product_location!=0){
        product_left = product_location;
        productionAnimate(product,(-product_item_width));
      }
    });

    arrow_right.on(tad,function(){
      cWidth = document.body.clientWidth;

      product_dev = Math.min(parseInt(cWidth / 270),3);

      product_number = Math.ceil($(".product-con").length/product_dev);
      product_item_width = 270 * product_dev;

      product.style.width = product_number*product_item_width +"px";

      if(product_location!=(product_number-1)*product_item_width){
        product_left = product_location;
        productionAnimate(product,product_item_width);
      }
    });


  }

  function productionAnimate(obj,target){
    clearInterval(obj.timer);
    
    product_location = product_left + target;

    obj.timer=setInterval(function(){
      product_left+=(product_location - product_left)/4;
      obj.style.webkitTransform= "translate3d("+(-product_left)+"px,0,0)";

      if(product_left<=1){
        product_left = 0;
        product_location = 0;
        obj.style.webkitTransform = "translate3d(0,0,0)";
        clearInterval(obj.timer);
      }
      if(product_left>(product_number-1)*product_item_width){
        product_left = (product_number-1)*product_item_width;
        product_location = (product_number-1)*product_item_width;
        obj.style.left = (product_number-1)*product_item_width + "px";
        clearInterval(obj.timer);
      }

      if(Math.abs(product_left-product_location)<=1){
        product_left = product_location;
        obj.style.webkitTransform = "translate3d("+ (-product_left)+"px,0,0)";
        clearInterval(obj.timer);
      }

    },30);
  }

  return{
      init : init
    }
}())

/* my change of default prototype */
function stopWindowDrag(){

  var selScrollable = '.scrollable';
  // Uses document because document will be topmost level in bubbling
  $(document).on('touchmove',function(e){
    e.preventDefault();
  });
  // Uses body because jQuery on events are called off of the element they are
  // added to, so bubbling would not work if we used document instead.
  $('body').on('touchstart', selScrollable, function(e) {
    if (e.currentTarget.scrollTop === 0) {
      e.currentTarget.scrollTop = 1;
    } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
      e.currentTarget.scrollTop -= 1;
    }
  });
  $('body').on('touchmove', selScrollable, function(e) {
    // Only block default if internal div contents are large enough to scroll
    // Warning: scrollHeight support is not universal. (http://stackoverflow.com/a/15033226/40352)
    if($(this)[0].scrollHeight > $(this).height()) {
        e.stopPropagation();
    }

  });
}

function IsPC() {
  var userAgentInfo = navigator.userAgent;
  var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
  var flag = true;
  for (var v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}

window.myPage = myPage;

})();

window.onload = function(){
  myPage.init();
}
