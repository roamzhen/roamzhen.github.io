
"undefined"!=typeof jQuery&&function(a){"use strict";a.imgpreload=function(b,c){function g(f,h){var i=new Image,j=h,k=i;"string"!=typeof h&&(j=a(h).attr("src")||a(h).css("background-image").replace(/^url\((?:"|')?(.*)(?:'|")?\)$/gm,"$1"),k=h),a(i).bind("load error",function(f){d.push(k),a.data(k,"loaded","error"==f.type?!1:!0),c.each instanceof Function&&c.each.call(k,d.slice(0)),e<b.length?(g(e,b[e]),e++):d.length>=b.length&&c.all instanceof Function&&c.all.call(d),a(this).unbind("load error")}),i.src=j}var d,e,f;for(c=a.extend({},a.fn.imgpreload.defaults,c instanceof Function?{all:c}:c),"string"==typeof b&&(b=[b]),d=[],e=0,f=Math.min(c.number,b.length);f>e;)g(e,b[e]),e++},a.fn.imgpreload=function(b){return a.imgpreload(this,b),this},a.fn.imgpreload.defaults={each:null,all:null,number:5}}(jQuery);

Array.prototype.remove = function(from, to) {  
  var rest = this.slice((to || from) + 1 || this.length);  
  this.length = from < 0 ? this.length + from : from;  
  return this.push.apply(this, rest);  
};  

var btnControll = $('#btn-controll');
var ringItemWrap = $("#btn-controll .ring-item-wrap");
var ringWords = $('#btn-controll ring-words');
var ringLight = $('#btn-controll ring-light');
var longList = $("#long-list");
var loveNumber =$('#loveNumber');

var secEffect = $('.sec-effect');
var secEffectMiddle = $('.sec-effect .effect-middle');
secEffectMiddle.on('animationend', function(){
  secEffect.removeClass('anim-in');
});

var longCurr=0,longMax=0,moveStep=0,timeStart=0,loopReq,totalTime=60000;// 60000
var timeLevel = totalTime/4/9;
var lightCurr=0,lightStep=360/1000;
var loadP=0,loadInterv,loadTp=0;
var basePath="../img/", bgPath="../img/bg/", dialogPath="../img/dialog/";

var longMax = $("#long-list").height()-$(".sec-page").height();

moveStep=longMax/totalTime;

var $ph=$("body").height(), $pw=$("body").width(), remStep=$pw*100/640;
var sayStep=0,sayArr=[
  {h:25.55,id:"#dialog_1"},
  {h:37.55,id:"#dialog_2"},
  {h:51.97,id:"#dialog_3"},
  {h:64.6,id:"#dialog_4"},
  {h:77.49,id:"#dialog_5"},
  {h:88.82,id:"#dialog_6"},
  {h:102.2,id:"#dialog_7"},
  {h:114.8,id:"#dialog_8"},
  {h:125.8,id:"#dialog_9"},
  {h:138.5,id:"#dialog_10"},
  {h:148.5,id:"#dialog_11"},
  {h:164.8,id:"#dialog_12"},
  {h:172.9,id:"#dialog_13"},];


// like Canvas
var secCanvas = $('.sec-canvas');
var likes = [];
var likeNumber = 0;
var tmpLikeNum = 0;

var canvasW = secCanvas.width() ,canvasH = secCanvas.height();
var likeInitX = htmlWidth/2, likeInitY = canvasH - htmlWidth/640*140;

var app = new PIXI.Application({
  width: canvasW, 
  height: canvasH,
  transparent: true,
});
secCanvas.append(app.view);

function addCricle(num) {
  for(var i =0; i< num; i++) {
    newLike(0);
  }
}

function addLR(num) {
  for(var i =0; i< num; i++) {
    newLike(i%2 + 1);
  }
}

function newLike(type) {
  var like = PIXI.Sprite.fromImage('data:image/png;base64,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');
  var scale = Math.random() * 1 + 0.4;
  like.width = 28 * scale;
  like.height = 24 * scale;
  like.x = likeInitX;
  like.y = likeInitY;
  like.anchor.set(0.5);
  like.anchor.set(0.5);
  like.ltype = type;
  switch(type) {
    case 0:
      like.ren = Math.random() * Math.PI * 2;
      like.speed = 3 + Math.random() * 2;
      like.vX = Math.cos(like.ren) * like.speed;
      like.vY = Math.sin(like.ren) * like.speed;
      like.aX = -like.vX / 70;
      like.aY = -like.vY / 70;
      like.alpha = 0;
      like.alphaV = 0.08;
      like.alphaA = -like.alphaV / (30 - Math.random()*10);
      break;
    case 1:
      like.speed = 3 + Math.random() * 3;
      like.vX = -like.speed;
      like.vY = 0;
      like.aX = -like.vX / 70;
      like.aY = -(Math.random() * 0.06 + 0.02);
      like.alpha = 0;
      like.alphaV = 0.04;
      like.alphaA = -(0.0005 + Math.random() * 0.0005);
      break;
    case 2:
      like.speed = 3 + Math.random() * 3;
      like.vX = like.speed;
      like.vY = 0;
      like.aX = -like.vX / 70;
      like.aY = -(Math.random() * 0.06 + 0.02);
      like.alpha = 0;
      like.alphaV = 0.04;
      like.alphaA = -(0.0005 + Math.random() * 0.0005);
      break;
    default:
      break;
  }

  likes.push(like);

  app.stage.addChild(like);

  return like;
}


app.ticker.add(function() {

    // let's rotate the aliens a little bit
    for (var i = 0; i < likes.length; i++) {
        var like = likes[i];
        switch(like.ltype) {
          case 0:
            like.alpha = like.alpha + like.alphaV;
            like.alphaV = like.alphaV + like.alphaA;
            like.x = like.x + like.vX;
            like.y = like.y + like.vY;
            like.vX = like.vX + like.aX;
            like.vY = like.vY + like.aY;

            if(like.alpha <= 0) {
              likes.remove(i);
            }
            break;
          case 1:
            like.alpha = like.alpha + like.alphaV;
            like.alphaV = like.alphaV + like.alphaA;
            like.x = like.x + like.vX;
            like.y = like.y + like.vY;
            if(like.vX + like.aX <= 0){
              like.vX = like.vX + like.aX;
            }
            like.vY = like.vY + like.aY;

            if(like.alpha <= 0) {
              likes.remove(i);
            }
            break;
          case 2:
            like.alpha = like.alpha + like.alphaV;
            like.alphaV = like.alphaV + like.alphaA;
            like.x = like.x + like.vX;
            like.y = like.y + like.vY;
            if(like.vX + like.aX >= 0){
              like.vX = like.vX + like.aX;
            }
            like.vY = like.vY + like.aY;

            if(like.alpha <= 0) {
              likes.remove(i);
            }
            break;
          default:
            break;
        }
    }

});

PreLoadImages();

function PreLoadImages(){
  var loadImages=['hintImg.png','/bg/bg_1.jpg',"ring.png","ringHalo.png","effect-bar.png","ringWords.png","share-words.png"];
  for(var i=0;i<loadImages.length;i++) loadImages[i]=basePath+loadImages[i];
  jQuery.imgpreload(loadImages,{number:6,all: LoadImages});
}

function LoadImages(){
  var loadImages = [];
  var loadBgImages=[
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
    'bg_20.jpg',
    'bg_21.jpg'
  ];
  for(var i=0;i<loadBgImages.length;i++) loadBgImages[i]=bgPath+loadBgImages[i];
  var loadDialogImages=[
    'dialog1.png',
    'dialog2.png',
    'dialog3.png',
    'dialog4.png',
    'dialog5.png',
    'dialog6.png',
    'dialog7.png',
    'dialog8.png',
    'dialog9.png',
    'dialog10.png',
    'dialog11.png',
    'dialog12.png',
    'dialog13.png',
  ];
  for(var i=0;i<loadDialogImages.length;i++) loadDialogImages[i]=dialogPath+loadDialogImages[i];
  loadImages = loadImages.concat(loadBgImages, loadDialogImages);
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
        $("#sec-load").fadeOut(400,function(){
          $(".loading-ring-wrap").remove();
          SetHamm();
        });
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

var likeAddTimer;
var addTimes = 0;

function addLoop(number) {
  if(addTimes < 4 ) {
    if(number){
      addCricle(Math.random()*4 + 3 + number);
    }else{
      addCricle(Math.random()*4 + 3);
    }

    addTimes++;
  }else {
    addLR(2);
  }
}

function btnPanPressAct(e){
  e.preventDefault();
  clearInterval(likeAddTimer);
  cancelAnimationFrame(loopReq);
  timeStart=$.now();
  tmpLikeNum = $.now();

  addLoop(6);
  likeAddTimer = setInterval(addLoop, 150);

  loopReq=requestAnimationFrame(SetLongAction);
}

function btnPanEndAct(){
  btnControll.removeClass('press');
  tmpLikeNum = $.now() - tmpLikeNum;

  clearInterval(likeAddTimer);
  addTimes= 0;
  cancelAnimationFrame(loopReq);

  if(tmpLikeNum <= timeLevel) {
    loveNumber.html('99');
    likeNumber=Math.max(99,likeNumber);
  }else if(tmpLikeNum <= timeLevel*2) {
    loveNumber.html('168');
    likeNumber=Math.max(168,likeNumber);
  }else if(tmpLikeNum <= timeLevel*3) {
    loveNumber.html('365');
    likeNumber=Math.max(365,likeNumber);
  }else if(tmpLikeNum <= timeLevel*4) {
    loveNumber.html('520');
    likeNumber=Math.max(520,likeNumber);
  }else if(tmpLikeNum <= timeLevel*5) {
    loveNumber.html('666');
    likeNumber=Math.max(666,likeNumber);
  }else if(tmpLikeNum <= timeLevel*6) {
    loveNumber.html('999');
    likeNumber=Math.max(999,likeNumber);
  }else if(tmpLikeNum <= timeLevel*7) {
    loveNumber.html('1314');
    likeNumber=Math.max(1314,likeNumber);
  }else if(tmpLikeNum <= timeLevel*8) {
    loveNumber.html('1668');
    likeNumber=Math.max(1668,likeNumber);
  }else if (tmpLikeNum > timeLevel*8) {
    loveNumber.html('2018');
    likeNumber=Math.max(2018,likeNumber);
  }

  wx.onMenuShareTimeline({
    title: "习近平邀你重温2017，我为长长的回忆连击"+likeNumber+"次赞，你呢？", // 分享标题
    link: wxlink,//window.location.href.split("?")[0]
    imgUrl: "http://news.cctv.com/special/xysp/h5/ceshiyemian2017ccdhy/img/hintImg.png" // 分享图标
  });
  // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
  wx.onMenuShareAppMessage({
    title: "习近平邀你重温2017，我为长长的回忆连击"+likeNumber+"次赞，你呢？？", // 分享标题
    desc: "贺新春：长长的回忆", // 分享描述
    link: wxlink, //window.location.href.split("?")[0]
    imgUrl: "http://news.cctv.com/special/xysp/h5/ceshiyemian2017ccdhy/img/hintImg.png", // 分享图标
    type: "link", // 分享类型,music、video或link，不填默认为link
  });

  secEffect.addClass('anim-in');
}

function EndAct() {
  btnPanEndAct();
  btnControll.fadeOut();


  wx.onMenuShareTimeline({
    title: "习近平邀你重温2017，我为长长的回忆连击"+likeNumber+"次赞，你呢？", // 分享标题
    link: wxlink,//window.location.href.split("?")[0]
    imgUrl: "http://news.cctv.com/special/xysp/h5/ceshiyemian2017ccdhy/img/hintImg.png" // 分享图标
  });
  // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
  wx.onMenuShareAppMessage({
    title: "习近平邀你重温2017，我为长长的回忆连击"+likeNumber+"次赞，你呢？？", // 分享标题
    desc: "贺新春：长长的回忆", // 分享描述
    link: wxlink, //window.location.href.split("?")[0]
    imgUrl: "http://news.cctv.com/special/xysp/h5/ceshiyemian2017ccdhy/img/hintImg.png", // 分享图标
    type: "link", // 分享类型,music、video或link，不填默认为link
  });
}

$('.share-btn').on('touchstart', function(){
  $('.sec-share').show();
})
$('.sec-share').on('touchstart', function(){
  $(this).hide();
})
$('.reload-btn').on('touchstart', function(){
  PlayAgainAct();
})

function PlayAgainAct(){
  likeNumber=0;
  longCurr=sayStep=0;
  SetLongTransform(0);
  btnControll.show();
  for (var i = sayArr.length - 1; i >= 0; i--) {
    $(sayArr[i]["id"]).removeClass("zoom");
  }
  SetHamm();
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
    CheckSayShow(longCurr);
    loopReq=requestAnimationFrame(SetLongAction);
  }
}

function CheckSayShow(hCurr){
  if(sayStep>sayArr.length-1) return;
  if(hCurr>sayArr[sayStep]["h"]*remStep-$ph/2){
    $(sayArr[sayStep]["id"]).addClass("zoom");
    sayStep++;
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
