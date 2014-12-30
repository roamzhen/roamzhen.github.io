window.onload = function(){
  initMenuBtn();
  initStepBtn();
  initWordChanger();
  productClass.productSlider();


  localStorage.clear();
}
/* basic class method */
function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, '');
    }
}
/* end basic class method */

/* step-btn */
function initStepBtn(){
  var stepBtnList = document.getElementsByClassName("step-btn");

  for (var i = stepBtnList.length - 1; i >= 0; i--) {
    stepBtnList[i].onclick = function(){
      for (var j = stepBtnList.length - 1; j >= 0; j--) {
        removeClass(stepBtnList[j],"active");
      };
      addClass(this,"active");
    }
  };
}

/* end step-btn */

/* menuBtn */
function initMenuBtn(){
  var menuBtn = document.getElementsByClassName("menu-btn")[0];

  menuBtn.cliked = false;
  menuBtn.onclick = function(){
    if(this.clicked){
      menuHide();
    }else{
      menuShow();
    }
    menuBtn.clicked = !menuBtn.clicked;
  }

  function menuShow(){
    var wrap = document.getElementsByClassName("wrap")[0];
    var aside = document.getElementsByClassName("aside")[0];
    var menuBtn = document.getElementsByClassName("menu-btn")[0];

    if(wrap!=null&&aside!=null&&menuBtn!=null)
    {
      addClass(menuBtn,"active");
      addClass(aside,"active");
      addClass(wrap,"scale");
    }
  }
  function menuHide(){
    var wrap = document.getElementsByClassName("wrap")[0];
    var aside = document.getElementsByClassName("aside")[0];
    var menuBtn = document.getElementsByClassName("menu-btn")[0];

    if(wrap!=null&&aside!=null&&menuBtn!=null)
    {

      removeClass(menuBtn,"active");
      removeClass(aside,"active");
      removeClass(wrap,"scale");
    }
  }
}
/* end Menu Btn */

/* word-changer */
function initWordChanger(){
  var newSpan = document.getElementsByClassName("new")[0];
  var oldSpan = document.getElementsByClassName("old")[0];

  var likeList = ["Javascript","HTML5","WebApp","Hybrid App","Programing","Cook","Yummy Food"];

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

  var product_left=0;
  var product_location=0;

  var cWidth = document.body.clientWidth;

  var product_dev = Math.min(parseInt(cWidth / 270),3);

  var product_number = Math.ceil(document.getElementsByClassName("product-con").length/product_dev);
  var product_item_width = 270 * product_dev;

  function productSlider(){
    cWidth = document.body.clientWidth;

    var product = document.getElementById("product");
    var arrow_left = document.getElementById("arrow_left");
    var arrow_right = document.getElementById("arrow_right");

    product_dev = Math.min(parseInt(cWidth / 270),3);

    product_number = Math.ceil(document.getElementsByClassName("product-con").length/product_dev);
    product_item_width = 270 * product_dev;

    product.style.width = product_number*product_item_width +"px";

    arrow_left.onclick = function(){
      cWidth = document.body.clientWidth;

      product_dev = Math.min(parseInt(cWidth / 270),3);

      product_number = Math.ceil(document.getElementsByClassName("product-con").length/product_dev);
      product_item_width = 270 * product_dev;

      product.style.width = product_number*product_item_width +"px";

      if(product_location!=0){
        product_left = product_location;
        productionAnimate(product,(-product_item_width));
      }
    }

    arrow_right.onclick = function(){
      cWidth = document.body.clientWidth;

      product_dev = Math.min(parseInt(cWidth / 270),3);

      product_number = Math.ceil(document.getElementsByClassName("product-con").length/product_dev);
      product_item_width = 270 * product_dev;

      product.style.width = product_number*product_item_width +"px";

      if(product_location!=(product_number-1)*product_item_width){
        product_left = product_location;
        productionAnimate(product,product_item_width);
      }
    }


  }

  function productionAnimate(obj,target){
    clearInterval(obj.timer);
    
    product_location = product_left + target;

    obj.timer=setInterval(function(){
      product_left+=(product_location - product_left)/4;
      obj.style.left=(-product_left)+"px";

      if(product_left<=1){
        product_left = 0;
        product_location = 0;
        obj.style.left = "0px";
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
        obj.style.left = (-product_left)+"px";
        clearInterval(obj.timer);
      }

    },30);
  }

  return{
      productSlider:productSlider
    }
}())
//productSlider class end
