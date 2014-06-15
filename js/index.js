var angleTnow=0,
  angleMnow=0,
  angleBnow=0;

//productSlider Class
var productClass = (function(){

  var product_left=0;
  var product_location=0;

  var cWidth = document.body.clientWidth;

  var product_dev = Math.min(parseInt(cWidth / 270),3);

  var product_number = Math.ceil(GetClass("product-con").length/product_dev);
  var product_item_width = 270 * product_dev;

  function productSlider(){
    cWidth = document.body.clientWidth;

    var product = document.getElementById("product");
    var arrow_left = document.getElementById("arrow_left");
    var arrow_right = document.getElementById("arrow_right");

    product_dev = Math.min(parseInt(cWidth / 270),3);

    product_number = Math.ceil(GetClass("product-con").length/product_dev);
    product_item_width = 270 * product_dev;

    product.style.width = product_number*product_item_width +"px";

    arrow_left.onclick = function(){
      cWidth = document.body.clientWidth;

      product_dev = Math.min(parseInt(cWidth / 270),3);

      product_number = Math.ceil(GetClass("product-con").length/product_dev);
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

      product_number = Math.ceil(GetClass("product-con").length/product_dev);
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

window.onload=function(){
//  scrollEvent();
  faceSlider();
  productClass.productSlider();
}



function scrollEvent(){
  var slider1 = document.getElementById("slider1");
  var slider2 = document.getElementById("slider2");
  var slider3 = document.getElementById("slider3");
  var slider4 = document.getElementById("slider4");

  var slider1Height = slider1.clientHeight;
  var slider2Height = slider2.clientHeight;
  var slider3Height = slider3.clientHeight;
  var slider4Height = slider4.clientHeight;

  window.onscroll=function(){
    var scrollTop = Math.max(document.documentElement.scrollTop,document.body.scrollTop);
    var downSpeed = 0.2;
    var downHeight = scrollTop*downSpeed;

    slider1.style.backgroundPosition = "0% " + (-downHeight) + "px";
    slider2.style.backgroundPosition = "0% "+ (slider1Height*downSpeed - downHeight) + "px";
    slider3.style.backgroundPosition = "0% "+ ((slider1Height+slider2Height)*downSpeed - downHeight) + "px";
    slider4.style.backgroundPosition = "0% "+ ((slider1Height+slider2Height+slider3)*downSpeed - downHeight) + "px";

  }
}


 
function faceSlider(){
  var top=document.getElementById('face-top');
  var mid=document.getElementById('face-mid');
  var bottom=document.getElementById('face-bottom');

  var angleT=0;
  var angleM=0;
  var angleB=0;

  setInterval(function(){
    var num = parseInt(Math.random()*6);

    switch(num){
      case 0:
        angleT+=90;
        break;
      case 1:
        angleT-=90;
        break;
      case 2:
        angleB+=90;
        break;
      case 3:
        angleB-=90;
        break;
      case 4:
        angleM+=90;
        break;
      case 5:
        angleM-=90;
        break;
    }

    sliderAnimate(top,angleT,1);
    sliderAnimate(mid,angleM,2);
    sliderAnimate(bottom,angleB,3);
    
  },1000)
}

function sliderAnimate(obj,target,type){
  clearInterval(obj.timer);
  obj.timer=setInterval(function(){
    var cur = 0;
    var speed = 0;

    switch(type){
      case 1:
        cur = angleTnow;
        speed = (target-cur)/4;
        angleTnow += speed;
          setCss3(obj,{transform:"rotateY("+angleTnow+"deg)"});
        break;
      case 2:
        cur = angleMnow;
        speed = (target-cur)/4;
        angleMnow += speed;
          setCss3(obj,{transform:"rotateY("+angleMnow+"deg)"});
        break;
      case 3:
        cur = angleBnow;
        speed = (target-cur)/4;
        angleBnow += speed;
          setCss3(obj,{transform:"rotateY("+angleBnow+"deg)"});
        break;
    }
    

      if(cur==target)
        clearInterval(obj.timer);

    },30);
}

function setCss3 (obj,attrObj) {
for (var i in attrObj) {
  var newi=i;
  if(newi.indexOf("-")>0){
    var num=newi.indexOf("-");
    newi=newi.replace(newi.substr(num,2),newi.substr(num+1,1).toUpperCase());
  }
  obj.style[newi]=attrObj[i];
  newi=newi.replace(newi.charAt(0),newi.charAt(0).toUpperCase());
  obj.style["webkit"+newi]=attrObj[i];
  obj.style["moz"+newi]=attrObj[i];
  obj.style["o"+newi]=attrObj[i];
  obj.style["ms"+newi]=attrObj[i];
 }
}