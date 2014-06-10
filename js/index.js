var angleTnow=0,
  angleMnow=0,
  angleBnow=0,
  product_left=0,
  product_location=0;

window.onload=function(){
  scrollEvent();
  faceSlider();
  productSlider();
}

function productSlider(){
  var product = document.getElementById("product");
  var arrow_left = document.getElementById("arrow_left");
  var arrow_right = document.getElementById("arrow_right");

  var product_number = parseInt(GetClass("product-item").length/6);
  var product_item_width = 810;

  product.style.width = (product_number+1)*product_item_width +"px";

  arrow_left.onclick = function(){
    if(product_location!=0){
      product_left = product_location;
      productionAnimate(product,(-product_item_width));
    }
  }

  arrow_right.onclick = function(){
    if(product_location!=product_number*product_item_width){
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

    if(Math.abs(product_left-product_location)<=1){
      product_left = product_location;
      obj.style.left = (-product_left)+"px";
      clearInterval(obj.timer);
    }

  },30);
}


function scrollEvent(){
  var slider1 = document.getElementById("slider1");
  var slider2 = document.getElementById("slider2");
  var slider3 = document.getElementById("slider3");
  var slider4 = document.getElementById("slider4");

  window.onscroll=function(){
    var scrollTop = Math.max(document.documentElement.scrollTop,document.body.scrollTop);
    
    slider1.style.backgroundPosition = "0% " + (-scrollTop*0.5) + "px";
    slider2.style.backgroundPosition = "0% "+ (310 - scrollTop*0.5) + "px";
    slider3.style.backgroundPosition = "0% "+ (620 - scrollTop*0.5) + "px";
    slider4.style.backgroundPosition = "0% "+ (930 - scrollTop*0.5) + "px";

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