(function(){
var
  videoIndex1 = document.getElementById("videoIndex1"),
  videoIndex2 = document.getElementById("videoIndex2"),
  btnVideo = document.getElementById("btnVideo"),
  cameraBtn = document.getElementById('cameraBtn'),
  photoMask = document.querySelector('.photo-mask');


var
  windowWidth = document.body.offsetWidth;
  windowHeight = document.body.offsetHeight;

var 
  loadingWrap = document.querySelector('.loading-wrapper'),
  loadingPercent = document.querySelector('.loading-percent'),
  eggWrap = document.querySelector('.egg-wrap'),
  namingWrap = document.querySelector('.naming-wrap'),
  submitTarget = document.getElementById('submit-target'),
  submitYou = document.getElementById('submit-you');
  

var sourceArr = [
    "../img/background.jpg",
    "../img/egg.png",
    "../img/shadow.png",
    "../img/loading-title.png",
    "../img/loading-words.png",
    "../img/back.jpg",
    "../img/front.jpg",
    "../img/camera.png",
    "../img/corner.png",
    "../img/icon-shaking.png",
    "../img/xiao-light.png",
    "../img/xiao.png",
    "../img/you-light.png",
    "../img/you.png",

];

new mo.Loader(sourceArr,{
    onLoading : function(count,total){
      loadingPercent.innerHTML =  parseInt((count/total)*100)+"%";
    },
    onComplete : function(time){
      eggWrap.style.opacity = 0;
      namingWrap.classList.add('show');

      setTimeout(function(){
        eggWrap.style.display = 'none';
      },600);

      setTimeout(function(){
        document.querySelector('.input-1').style.display = 'block';

        setTimeout(function(){
          namingWrap.classList.add('show-words2');
        },100);
      },2700);
      /*
      loadingWrap.style.opacity = '0';

      setTimeout(function(){
        loadingWrap.style.display = 'none';
      },600);
      */
    }
});

submitTarget.addEventListener('click',function(){
  document.querySelector('.input-2').style.display = 'block';

  setTimeout(function(){
    namingWrap.classList.add('show-words3');
  },100);
});
submitYou.addEventListener('click',function(){
  loadingWrap.style.opacity = '0';

  setTimeout(function(){
    loadingWrap.style.display = 'none';
  },600);
});

videoIndex1.addEventListener('ended',function(){
  videoIndex2.load();
  videoIndex2.classList.remove('hide');
  videoIndex1.classList.add('hide');

  showYou();
});
videoIndex2.addEventListener('ended',function(){
  videoIndex1.load();
  videoIndex1.classList.remove('hide');
  videoIndex2.classList.add('hide');

  showXiao();
});

var video_sequence = true;
var video_running = false;
var xiao_running = false;
var you_running = false;
btnVideo.addEventListener("touchstart",function(){

  if(!video_running){
    if(video_sequence) {

      if(videoIndex1.ended) {

        videoIndex2.play();

        video_sequence = false;
      }else{
        videoIndex1.play();
      }

    }else{

      if(videoIndex2.ended){

        videoIndex1.play();

        video_sequence = true;
      }else {
        videoIndex2.play();
      }

    }
    btnVideo.classList.remove('animating');
    video_running = true;
  }

  setTimeout(function(){video_running = false; btnVideo.classList.add('animating');}, 6500);
});

var camera_animating = false;
cameraBtn.addEventListener("touchstart",function(){
  if(!video_running && !camera_animating){
    photoMask.classList.add('show');
    setTimeout(function(){
      photoMask.classList.add('animating');
      setTimeout(function(){
        camera_animating=  false;

        location.href= 'share.html';
      }, 1400); 
    }, 100);
  }
});

function showXiao() {
  btnVideo.classList.remove("show-you");
  btnVideo.classList.add("show-xiao");
  /*
  if(!xiao_running) {
    xiao_running = true;

    setTimeout(function(){
      btnVideo.classList.remove("show-you");
      btnVideo.classList.add("show-xiao");

      xiao_running = false;
    },2500);
  }
  */
}

function showYou() {
  btnVideo.classList.remove("show-xiao");
  btnVideo.classList.add("show-you");
  /*
  if(!you_running) {
    you_running = true;

    setTimeout(function(){
      btnVideo.classList.remove("show-xiao");
      btnVideo.classList.add("show-you");
      you_running = false;
    },4500);
  }
  */
}

}());