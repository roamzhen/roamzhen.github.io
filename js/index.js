window.onload = function(){
  initMenuBtn();
  initStepBtn();
  initWordChanger();
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

