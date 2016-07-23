(function(){
var browser={
  versions:function(){
    var u = navigator.userAgent, app = navigator.appVersion;
    return {
      webKit: u.indexOf('AppleWebKit') > -1, 
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), 
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, 
      weixin: u.indexOf('MicroMessenger') > -1, 
      txnews: u.indexOf('qqnews') > -1,
      sinawb: u.indexOf('weibo') > -1,
      mqq   : u.indexOf('QQ') > -1
    };
  }(),
  language:(navigator.browserLanguage || navigator.language).toLowerCase()
};

var query = function(selector){
  return document.querySelector(selector);
};

var
  videoIndex1 = document.getElementById("videoIndex1"),
  videoIndex2 = document.getElementById("videoIndex2"),
  videoIndex3 = document.getElementById("videoIndex3"),
  $videoBox1 = $(query('.video-box1')),
  $videoBox2 = $(query('.video-box2')),
  $videoBox3 = $(query('.video-box3')),
  $step1Controller = $(query('.step1-controller')),
  $step2Controller = $(query('.step2-controller')),
  $step3Controller = $(query('.step3-controller')),
  $step4Controller = $(query('.step4-controller'));

videoIndex1.addEventListener('canplay', function(){

});

videoIndex1.addEventListener('ended', function(){
  $step1Controller.removeClass('show');
  $step2Controller.addClass('show');
});

videoIndex2.addEventListener('ended', function(){
  $step2Controller.removeClass('show');
  $step3Controller.addClass('show');
});
videoIndex3.addEventListener('ended', function(){
  $step3Controller.removeClass('show');
  $step4Controller.addClass('show');
});


$step1Controller.on('touchstart', function(){
  $step1Controller.addClass('animating');
  setTimeout(function(){ videoIndex1.play()}, 500);
});
$step2Controller.on('touchstart', function(){
  $step2Controller.addClass('animating');
  $videoBox1.removeClass('show');
  $videoBox2.addClass('show');

  setTimeout(function(){ videoIndex2.play()}, 500);
});

$step3Controller.on('touchstart', function(){
  $step3Controller.addClass('animating');
  $videoBox2.removeClass('show');
  $videoBox3.addClass('show');

  setTimeout(function(){ videoIndex3.play()}, 500);
});


}());