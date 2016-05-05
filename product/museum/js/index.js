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
  loadingPercent = document.querySelector('.loading-percent');
  

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
      console.log(count);
      loadingPercent.innerHTML =  parseInt((count/total)*100)+"%";
    },
    onComplete : function(time){
      loadingWrap.style.opacity = '0';

      setTimeout(function(){
        loadingWrap.style.display = 'none';
      },600);
    }
});


var video_sequence = true;
var video_running = false;
var xiao_running = false;
var you_running = false;
btnVideo.addEventListener("touchstart",function(){

  if(!video_running){
    if(video_sequence) {

      if(videoIndex1.ended) {
        showXiao();
        videoIndex1.className = 'hide';
        videoIndex2.className = '';

        videoIndex2.play();

        video_sequence = false;
      }else{
        showYou();
        videoIndex1.play();
      }

    }else{

      if(videoIndex2.ended){
        showYou();
        videoIndex1.className = '';
        videoIndex2.className = 'hide';

        videoIndex1.play();

        video_sequence = true;
      }else {
        showXiao();
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
        photoMask.classList.remove('animating');
        photoMask.classList.remove('show');
      }, 1600); 
    }, 100);
  }
});

function showXiao() {
  if(!xiao_running) {
    xiao_running = true;

    setTimeout(function(){
      btnVideo.classList.remove("show-you");
      btnVideo.classList.add("show-xiao");
      xiao_running = false;
    },2500);
  }
}

function showYou() {
  if(!you_running) {
    you_running = true;

    setTimeout(function(){
      btnVideo.classList.remove("show-xiao");
      btnVideo.classList.add("show-you");
      you_running = false;
    },4500);
  }
}

}());