
"undefined"!=typeof jQuery&&function(a){"use strict";a.imgpreload=function(b,c){function g(f,h){var i=new Image,j=h,k=i;"string"!=typeof h&&(j=a(h).attr("src")||a(h).css("background-image").replace(/^url\((?:"|')?(.*)(?:'|")?\)$/gm,"$1"),k=h),a(i).bind("load error",function(f){d.push(k),a.data(k,"loaded","error"==f.type?!1:!0),c.each instanceof Function&&c.each.call(k,d.slice(0)),e<b.length?(g(e,b[e]),e++):d.length>=b.length&&c.all instanceof Function&&c.all.call(d),a(this).unbind("load error")}),i.src=j}var d,e,f;for(c=a.extend({},a.fn.imgpreload.defaults,c instanceof Function?{all:c}:c),"string"==typeof b&&(b=[b]),d=[],e=0,f=Math.min(c.number,b.length);f>e;)g(e,b[e]),e++},a.fn.imgpreload=function(b){return a.imgpreload(this,b),this},a.fn.imgpreload.defaults={each:null,all:null,number:5}}(jQuery);

var btnControll = $('#btn-controll');
var ringItemWrap = $("#btn-controll .ring-item-wrap");
var ringWords = $('#btn-controll ring-words');
var ringLight = $('#btn-controll ring-light');
var longList = $("#long-list");

var longCurr=0,longMax=0,moveStep=0,timeStart=0,loopReq,totalTime=60000;
var lightCurr=0,lightStep=360/1000;
var loadP=0,loadInterv,loadTp=0;
var basePath="../img/", bgPath="../img/bg/";

var longMax = $("#long-list").height()-$(".sec-page").height();

moveStep=longMax/totalTime;


var likeNumber = 0;
var tmpLikeNum = 0;
var likeBtn = $('.iconLike-wrap');
var likeList = $('.like-list');

likeBtn.on('touchstart', function(){
  addLikeFun(1);
});

function addLikeFun (num) {
  var $addLike = $('<div class="add-like-wrap"><span>+' + num + '</span><div class="add-like"></div></div>');
  likeList.append($addLike);

  likeNumber+=num;

  $addLike.on('animationend', function(){
    $addLike.remove();
  })
}

PreLoadImages();

function PreLoadImages(){
  var loadImages=['/bg/bg_1.jpg',"ring.png","ringHalo.png"];
  for(var i=0;i<loadImages.length;i++) loadImages[i]=basePath+loadImages[i];
  jQuery.imgpreload(loadImages,{number:6,all: LoadImages});
}

function LoadImages(){
  var loadImages=[
    'bg_1.jpg',
    'bg_2.jpg',
    'bg_3.jpg',
    'bg_4.jpg',
    'bg_5.jpg',
    'bg_6.jpg',
    'bg_7.jpg',
    'bg_8.jpg',
    'bg_9.jpg',
    'bg_10.jpg',
    'bg_11.jpg',
    'bg_12.jpg',
    'bg_13.jpg',
    'bg_14.jpg',
    'bg_15.jpg',
    'bg_16.jpg',
    'bg_17.jpg',
    'bg_18.jpg',
    'bg_19.jpg',
    'bg_20.jpg'
  ];
  for(var i=0;i<loadImages.length;i++) loadImages[i]=bgPath+loadImages[i];
  jQuery.imgpreload(loadImages,{
    number:6,
    each: function(imgs){
      var loadPercent=(imgs.length*100/loadImages.length+0.5)|0;  
      loadTp=parseInt(loadPercent);
    },
    all: function(){loadTp=100;}
  });
  loadInterv=setInterval(LoadStep,20);
}

function LoadStep(){
  loadP+=1;
  (loadP>loadTp) && (loadP=loadTp);
  if(loadP>=100){
    $("#load-p").text("100%");
    $(".loading-light, .loading-number").fadeOut(400, function(){
      var bottomValue = '0.6rem';
      $(".loading-ring-wrap").animate({bottom: bottomValue}, 1000, 'linear', function(){
        $("#btn-controll").addClass('show');
        $("#sec-load").fadeOut(400,SetHamm);
      });
    });

  }else{
    $("#load-p").text(loadP+"%");
  }
}

function SetHamm(){
  $("#btn-controll").off("touchstart").on( "touchstart", btnPanPressAct);
  $("#btn-controll").off("touchend").on( "touchend", btnPanEndAct);
}
function DestroyPress(){
  $("#btn-controll").off("touchstart");
  $("#btn-controll").off("touchend");
}

function btnPanPressAct(e){
  e.preventDefault();
  cancelAnimationFrame(loopReq);
  timeStart=$.now();
  tmpLikeNum = $.now();
  loopReq=requestAnimationFrame(SetLongAction);
}

function btnPanEndAct(){
  btnControll.removeClass('press');
  tmpLikeNum = $.now() - tmpLikeNum;
  addLikeFun(parseInt(tmpLikeNum/50));
  cancelAnimationFrame(loopReq);
}

function EndAct() {
}

function SetLongAction(){
  var nowTime=$.now();
  longCurr=longCurr+(nowTime-timeStart)*moveStep;
  lightCurr=(lightCurr+(nowTime-timeStart)*lightStep)%360;
  timeStart=nowTime;
  if(longCurr>=longMax){
    longCurr=longMax;
    SetLongTransform(longMax);
    EndAct();
  }else{
    btnControll.addClass('press');
    ringItemWrap.css({"-webkit-transform":"rotate("+lightCurr+"deg)","transform":"translateY(-"+lightCurr+"deg)"});
    SetLongTransform(longCurr);
    loopReq=requestAnimationFrame(SetLongAction);
  }
}

function SetLongTransform(tx){
  longList.css({"-webkit-transform":"translateY(-"+tx+"px)","transform":"translateY(-"+tx+"px)"});
}


function IsWeixinCheck(){
  var ua = navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i)=="micromessenger") {
    return true;
  } else {
    return false;
  }
}

if (!Date.now)
    Date.now = function() { return new Date().getTime(); };

function IsWeixinCheck(){
  var ua = navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i)=="micromessenger") {
    return true;
  } else {
    return false;
  }
}


(function() {
    'use strict';
    
    var vendors = ['webkit', 'moz'];
    for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp+'RequestAnimationFrame'];
        window.cancelAnimationFrame = (window[vp+'CancelAnimationFrame']
                                   || window[vp+'CancelRequestAnimationFrame']);
    }
    if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) // iOS6 is buggy
        || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;
        window.requestAnimationFrame = function(callback) {
            var now = Date.now();
            var nextTime = Math.max(lastTime + 16, now);
            return setTimeout(function() { callback(lastTime = nextTime); },
                              nextTime - now);
        };
        window.cancelAnimationFrame = clearTimeout;
    }
}());
