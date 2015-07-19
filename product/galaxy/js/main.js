(function(){
var 
  wrap = $('.p-section'),
  gift_wrap = $('.gift-wrap'),
  drawing_picture_color = $('.drawing-picture-color'),
  controller_wrap = $('.controller-wrap'),
  words3 = $('.words-3'),
  donate_send_btn = $('.donate-send-btn'),
  donate_share_btn = $('.donate-share-btn'),
  donate_bg = $('.donate-bg'),
  donate_box_wrap = $('.donate-box-wrap'),
  check_wrap = $('.check-wrap'),
  donate_btn_20 = $('.donate-btn-20'),
  donate_btn_50 = $('.donate-btn-50'),
  donate_btn_100 = $('.donate-btn-100'),
  donate_btn_500 = $('.donate-btn-500'),
  donate_btn_other = $('.donate-btn-other'),
  rule_close_btn = $('.rule-close-btn'),
  box_close_btn = $('.box-close-btn'),
  loading_page = $('.loading-page'),
  loading_number =$('.loading-number')
  arrow_down = $('.arrow-down'),
  rainbow_change = $('.rainbow-change'),
  share_wrap = $('.share-wrap');

var words3_showed = false;

var slide_model = {
    'page': 0,
    'length': 5,
    'time_list': [
        4,0.5,4.1,1,1,1,1
    ],
    'callback_list': [
        function() {
            moveTo();
            console.log("0");
        },
        function() {
            moveTo();
            console.log("1");
        },
        function() {
            moveTo();
            gift_wrap.touchable = false;
            slide_model.nextable = true;
            slide_model.preable = true;

            wrap.removeClass('gift-down');
            console.log("2");
        },
        function() {
            moveTo();
            gift_wrap.touchable = true;
            slide_model.nextable = false;
            slide_model.preable = false;

            arrow_down.addClass('hide');

            console.log("3");
        },
        function() {
            moveTo();
            wrap.removeClass('gift-down');

            if(!words3_showed){
                slide_model.nextable = false;
                slide_model.preable = false;
            }

            console.log("4");
        },
        function() {
            moveTo();

            console.log("5");
        },
        function() {
            moveTo();
            console.log("6");
        },
    ],
    'animating': false,
    'nextable': false,
    'preable': false
};

var sourceArr = [
    "../img/bg-crow.jpg",
    "../img/cloud-1.png",
    "../img/cloud-2.png",
    "../img/cloud-3.png",
    "../img/cloud-ori.png",
    "../img/donate-bg.jpg",
    "../img/donate-box.png",
    "../img/donate-btn-20.png",
    "../img/donate-btn-50.png",
    "../img/donate-btn-100.png",
    "../img/donate-btn-500.png",
    "../img/donate-btn-other.png",
    "../img/donate-send-btn.png",
    "../img/donate-share-btn.png",
    "../img/drawing-chair-color.png",
    "../img/drawing-chair.png",
    "../img/drawing-girl-color.png",
    "../img/drawing-girl-stand.png",
    "../img/drawing-girl.png",
    "../img/drawing-hand-color.png",
    "../img/drawing-hand.png",
    "../img/drawing-picture.png",
    "../img/footer-bottom.jpg",
    "../img/footer-color.png",
    "../img/footer-top.png",
    "../img/gift-box-inner.png",
    "../img/gift-box-wrap.png",
    "../img/gift-item.png",
    "../img/gift-list.png",
    "../img/girl-raise-left-hand.png",
    "../img/girl-raise-right-hand.png",
    "../img/girl-stand-left-hand.png",
    "../img/girl-stand-right-hand.png",
    "../img/guide-bottom.jpg",
    "../img/guide-title.png",
    "../img/guide-top.jpg",
    "../img/guide-words.png",
    "../img/left-ballon.png",
    "../img/middle-ballon.png",
    "../img/picture-color.png",
    "../img/picture-nocolor.png",
    "../img/rainbow-show.png",
    "../img/rainbow.png",
    "../img/right-ballon.png",
    "../img/rule-close-btn.png",
    "../img/the_rule.png",
    "../img/tree-band.png",
    "../img/words-1.png",
    "../img/words-2.png",
    "../img/words-3.png"
];  

new mo.Loader(sourceArr,{
    onLoading : function(count,total){
        console.log('onloading:single loaded:',arguments);
        loading_number.html(count/total*100);
    },
    onComplete : function(time){
        console.log('oncomplete:all source loaded:',arguments);
        loading_number.html(100);
        wrap.addClass('step0');

        setTimeout(function(){
            loading_page.css('display','none');
        }, 200);
        setTimeout(function(){
            slide_model.nextable = true;
            slide_model.preable = true;
            arrow_down.removeClass('hide');
        }, 4000);
    }
});

var handler = function(event){
    switch(event['type']){
        case 'swipeup':
            if(slide_model.nextable && !slide_model.animating && slide_model.page < slide_model.length ){
                slide_model.page+=1;
                slide_model.animating = true;

                slide_model.callback_list[slide_model.page]();

                var delay_time = Number(slide_model.time_list[slide_model.page]*1000);

                arrow_down.addClass('hide');
                setTimeout(function(){
                    slide_model.animating = false;

                    if(slide_model.nextable) {
                        arrow_down.removeClass('hide');
                    }

                }, delay_time);
            }
            
            break;
        case 'swipedown':
            if(slide_model.preable &&!slide_model.animating && slide_model.page > 0) {
                slide_model.page-=1;

                slide_model.callback_list[slide_model.page]();

            }
            break;

    }
      
}
var target = document;
var gest = new mo.Gesture(target).addGesture('swipeup swipedown', handler);

gift_wrap.touchable = false;
gift_wrap.on('touchstart',function(e){
    if(gift_wrap.touchable){
        wrap.addClass('gift-down');
        gift_wrap.touchable = false;

        setTimeout(function(){
            slide_model.nextable = true;
            slide_model.preable = true;

            arrow_down.removeClass('hide');
        }, 2000);
    }
});

donate_send_btn.on('touchstart',function(e){
    donate_bg.addClass('show-box');
    donate_box_wrap.addClass('show-rule');

    slide_model.nextable = false;
    slide_model.preable = false;
});
donate_share_btn.on('touchstart',function(e){
    share_wrap.css('display','block');

    slide_model.nextable = false;
    slide_model.preable = false;
});

share_wrap.on('touchstart',function(e){
    share_wrap.css('display','none');

    slide_model.nextable = true;
    slide_model.preable = true;
});

check_wrap.on('touchstart',function(e){
    $(this).toggleClass('checked');
});

box_close_btn.on('touchstart',function(e){
    donate_bg.removeClass('show-box');

    slide_model.nextable = true;
    slide_model.preable = true;
});

rule_close_btn.on('touchstart',function(e){
    donate_box_wrap.removeClass('show-rule');
});

donate_btn_20.on('touchstart',function(e){
    location.href = "thanks.html";
});
donate_btn_50.on('touchstart',function(e){
    location.href = "thanks.html";
});
donate_btn_100.on('touchstart',function(e){
    location.href = "thanks.html";
});
donate_btn_500.on('touchstart',function(e){
    location.href = "thanks.html";
});
donate_btn_other.on('touchstart',function(e){
    location.href = "thanks.html";
});

/* touchEvent */
var drawHandle = (function(wrapper, opt){
    var controller_wrap_width = controller_wrap.width();
    var drawable = false;
    var draw_x_now = controller_wrap_width;

    function TouchHandler (wrapper) {
        var that = this;

        this.startX = 0;
        this.startY = 0;

        wrapper.on('touchstart',function(e){
            that.touchstart.call(that,e);
        });
        wrapper.on('touchmove',function(e){
            that.touchmove.call(that,e);
        });
        wrapper.on('touchend',function(e){
            that.touchend.call(that,e);
        });
        wrapper.on('toucncancel',function(e){
            that.toucncancel.call(that,e);
        });
    }

    TouchHandler.prototype.touchstart = function (e) {
        this.startX = e.changedTouches[0].pageX;
        this.startY = e.changedTouches[0].pageY;

        if(this.startX > draw_x_now - 30 && this.startX < draw_x_now + 30){
            drawable = true;
        }
    }
    TouchHandler.prototype.touchmove = function (e) {
        var nowX = e.changedTouches[0].pageX;

        if(drawable){
            drawing_picture_color.width(controller_wrap_width - nowX);
            rainbow_change.css('right',controller_wrap_width - nowX);

            if(!words3_showed && nowX < controller_wrap_width/2){
                words3_showed = true;
                wrap.addClass('show_words3');

                slide_model.nextable = true;
                slide_model.preable = true;

                arrow_down.removeClass('hide');
            }
        }

    }
    TouchHandler.prototype.touchend = function (e) {
        var nowX = e.changedTouches[0].pageX;

        if(drawable){
            drawing_picture_color.width(controller_wrap_width - nowX);
            rainbow_change.css('right',controller_wrap_width - nowX);
            draw_x_now = nowX;

        }
        
        drawable = false;

    }
    TouchHandler.prototype.toucncancel = function (e) {
        drawable = false;
    }

    return new TouchHandler(wrapper, opt);
}(controller_wrap));

function moveTo() {
    var back_class = getTypeClass(wrap[0], 'step');

    wrap.removeClass(back_class);
    wrap.addClass('step'+(slide_model.page));
}

function getTypeClass (item, str) {
  if(!item || !str){
    return false;
  }

  var back_class = "";

  var p_index = item.className.indexOf(str),
    pl_index =item.className.indexOf(' ',p_index);

  if(p_index != -1 && pl_index === -1){
    back_class = item.className.slice(p_index);
  }else{
    back_class = item.className.slice(p_index,pl_index);
  }

  return back_class;
}

}());