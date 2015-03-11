var canvas = $("#gameCanvas");
canvas[0].width = $("#game").width();
canvas[0].height = $("#game").height();
var context = canvas.get(0).getContext("2d");

var playerImg = $("#plane")[0];
var armyImg = $("#army")[0];
var itemSpeed = $("#itemSpeed")[0];
var itemPower = $("#itemPower")[0];

var canvasWidth = canvas.width();
var canvasHeight = canvas.height();

var playGame;
			
var asteroids;
var bullets;
var item;

var numAsteroids;
var radiusB;
var armyWidth;
var armyHeight;
		
var player;

var flag1;
var flag2;
var flag3;
var flag4;
var flag5;
		
var speedFlag;
var powerFlag;

var score;
var scoreTimeout;

var isSupportTouch = "ontouchend" in document ? true : false;

var touched;
var downed;
/*
var arrowLeft = 37;
var arrowUp =38;
var arrowRight = 39;
var arrowDown = 40;
var blank = 32;
*/

var Asteroid = function(x,y,vX,vY,width,height){
	this.x = x;
	this.y = y;
	this.vX = vX;
	this.vY = vY;

	this.width = width;
	this.height = height;
	this.halfWidth = this.width/2;
	this.halfHeight = this.height/2;
};

/*
var Player = function(x,y){
	this.x = x;
	this.y = y;
	this.width = 33;
	this.height = 44;
	this.halfWidth = this.width/2;
	this.halfHeight = this.height/2;
			
	this.vX = 0;
	this.vY = 0;
			
	this.moveRight = false;
	this.moveUp = false;
	this.moveLeft = false;
			
	this.leave=0;
	this.kill=0;
};
*/
		
var Bullet = function(x,y,radiusB){
	this.x = x;
	this.y = y;
	this.vY = -15;
	this.radius = radiusB;
	
};

var Item = function(x,y,vX,vY,width,height,type){
	this.x = x;
	this.y = y;
	this.vX = vX;
	this.vY = vY;
	this.width = width;
	this.height = height;
	this.halfWidth = width/2;
	this.halfHeight = height/2;
	this.type = type;
};

			
var ui = $("#gameUI");
var uiIntro = $("#gameIntro");
var uiStats = $("#gameStats");
var uiComplete = $("#gameComplete");
var uiPlay = $("#gamePlay");
var uiReset = $(".gameReset");
var uiScore = $(".gameScore");

$(document).ready(function()
	{	
		
		function init(){
			uiStats.hide();
			uiComplete.hide();
			
			uiPlay.click(function(e){
				e.preventDefault();
				uiIntro.hide();
				startGame();
			});
			
			uiReset.click(function(e){
				$(".gameTime").html("");
				e.preventDefault();
				uiComplete.hide();
				
//				$(window).unbind("keyup");
//				$(window).unbind("keydown");
				
				if(isSupportTouch){
					$(window).unbind("touchstart");
					$(window).unbind("touchmove");
					$(window).unbind("touchend");
				}else{
					$("#game").unbind("mousemove");
				}

				clearTimeout(scoreTimeout);
				
				startGame();
			});
			
		};

		stopWindowDrag();

		init();

});

/* my change of default prototype */
function stopWindowDrag(){

  var selScrollable = '.scrollable';
  // Uses document because document will be topmost level in bubbling
  $(document).on('touchmove',function(e){
    e.preventDefault();
  });
  // Uses body because jQuery on events are called off of the element they are
  // added to, so bubbling would not work if we used document instead.
  $('body').on('touchstart', selScrollable, function(e) {
    if (e.currentTarget.scrollTop === 0) {
      e.currentTarget.scrollTop = 1;
    } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
      e.currentTarget.scrollTop -= 1;
    }
  });
  // Stops preventDefault from being called on document if it sees a scrollable div
  $('body').on('touchmove', selScrollable, function(e) {
    e.stopPropagation();
  });
  $('body').on('touchmove', selScrollable, function(e) {
    // Only block default if internal div contents are large enough to scroll
    // Warning: scrollHeight support is not universal. (http://stackoverflow.com/a/15033226/40352)
    if($(this)[0].scrollHeight > $(this).height()) {
        e.stopPropagation();
    }

  });
}

