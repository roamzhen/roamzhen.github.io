(function(){

var query = function(selector){
  return document.querySelector(selector);
};
var winH = document.documentElement.scrollHeight;

var
  $page_bd = $('.page-bd'),
  $scroll_bd = $('.page-bd .scrolling'),
  bd_classNumber = 1,
  bd_length = 3,
  bd_running = false,
  bd_height = $scroll_bd.height();

var
  $page_kf = $('.page-kf'),
  $scroll_kf = $('.page-kf .scrolling'),
  kf_classNumber = 1,
  kf_length = 3,
  kf_running = false,
  kf_height = $scroll_kf.height();

var swiper = new Swiper('.swiper-container', {
    pagination: false,
    speed: 500,
    paginationClickable: true,
    direction: 'vertical',
    onInit: function(swiper){
    },
    onSlideChangeEnd: function(swiper){
    },
    onSlideChangeStart: function(swiper){
      var pur = swiper.previousIndex;
      var cur = swiper.activeIndex;

      switch(cur) {
        case 0:
          break;
        case 1:
          break;
        case 2:
          bd_running = false;
          swiper.unlockSwipes();
          break;
        case 3:
          if(pur===2){
            swiper.lockSwipeToNext();
          }else if(pur===4){
            swiper.lockSwipeToPrev();
          }
          bd_running = true;
          break;
        case 4:
          bd_running = false;
          swiper.unlockSwipes();
          break;
        case 5:
          if(pur===4){
            swiper.lockSwipeToNext();
          }else if(pur===6){
            swiper.lockSwipeToPrev();
          }
          kf_running = true;
          break;
        case 6:
          bd_running = false;
          swiper.unlockSwipes();
          break;
        default:
          break;
      }
    }
});
  
var bd_handler = function(event){
    switch(event['type']){
      case 'swipeup':
        if(bd_running===true && bd_classNumber < bd_length){
          $scroll_bd.addClass('step'+ bd_classNumber);
          bd_classNumber++;
          $scroll_bd.css('-webkit-transform','');

          swiper.lockSwipeToPrev();

          if(bd_classNumber === bd_length) {
            $scroll_bd.css('-webkit-transform','translateY(-'+((bd_height-winH)+'px)'));
            swiper.unlockSwipeToNext();
          }
        }
        break;
      case 'swipedown':
        if(bd_running===true && bd_classNumber > 1){
          bd_classNumber--;
          $scroll_bd.removeClass('step'+ bd_classNumber);
          $scroll_bd.css('-webkit-transform','');

          swiper.lockSwipeToNext();

          if(bd_classNumber === 1) {
            $scroll_bd.css('-webkit-transform','translateY(0px)');
            swiper.unlockSwipeToPrev();
          }
        }
        break;
    }
}
var bd_gest = new mo.Gesture($page_bd[0]).addGesture('swipeup swipedown', bd_handler);

var kf_handler = function(event){
    switch(event['type']){
      case 'swipeup':
        if(kf_running===true && kf_classNumber < kf_length){
          $scroll_kf.addClass('step'+ kf_classNumber);
          kf_classNumber++;
          $scroll_kf.css('-webkit-transform','');

          swiper.lockSwipeToPrev();

          if(kf_classNumber === kf_length) {
            $scroll_kf.css('-webkit-transform','translateY(-'+((kf_height-winH)+'px)'));
            swiper.unlockSwipeToNext();
          }
        }
        break;
      case 'swipedown':
        if(kf_running===true && kf_classNumber > 1){
          kf_classNumber--;
          $scroll_kf.removeClass('step'+ kf_classNumber);
          $scroll_kf.css('-webkit-transform','');

          swiper.lockSwipeToNext();

          if(kf_classNumber === 1) {
            $scroll_kf.css('-webkit-transform','translateY(0px)');
            swiper.unlockSwipeToPrev();
          }
        }
        break;
    }
}
var kf_gest = new mo.Gesture($page_kf[0]).addGesture('swipeup swipedown', kf_handler);

//无脑解决绑定问题
var
  $soluBtns = $('.page-solu .btn-list >li'),
  $soluWords = $('.page-solu .words-list >li');
for(var i = 0; i < $soluBtns.length; i++){
  $($soluBtns[i]).on('touchstart', (function(index){
    return function(e) {
      $soluBtns.removeClass('current').eq(index).addClass('current');
      $soluWords.removeClass('current').eq(index).addClass('current');
    }
  }(i)));
}
var
  $bdBtns1 = $('.bd-1 .btn-list >li'),
  $bdWords1 = $('.bd-1 .words-list >li');
for(var i = 0; i < $bdBtns1.length; i++){
  $($bdBtns1[i]).on('touchstart', (function(index){
    return function(e) {
      $bdBtns1.removeClass('current').eq(index).addClass('current');
      $bdWords1.removeClass('current').eq(index).addClass('current');
    }
  }(i)));
}
var
  $bdBtns2 = $('.bd-2 .btn-list >li'),
  $bdWords2 = $('.bd-2 .words-list >li');
for(var i = 0; i < $bdBtns2.length; i++){
  $($bdBtns2[i]).on('touchstart', (function(index){
    return function(e) {
      $bdBtns2.removeClass('current').eq(index).addClass('current');
      $bdWords2.removeClass('current').eq(index).addClass('current');
    }
  }(i)));
}
var
  $bdBtns3 = $('.bd-3 .btn-list >li'),
  $bdWords3 = $('.bd-3 .words-list >li');
for(var i = 0; i < $bdBtns3.length; i++){
  $($bdBtns3[i]).on('touchstart', (function(index){
    return function(e) {
      $bdBtns3.removeClass('current').eq(index).addClass('current');
      $bdWords3.removeClass('current').eq(index).addClass('current');
    }
  }(i)));
}
var
  $znBtns = $('.page-zn .btn-list >li'),
  $znWords = $('.page-zn .words-list >li');
for(var i = 0; i < $znBtns.length; i++){
  $($znBtns[i]).on('touchstart', (function(index){
    return function(e) {
      $znBtns.removeClass('current').eq(index).addClass('current');
      $znWords.removeClass('current').eq(index).addClass('current');
    }
  }(i)));
}

}());