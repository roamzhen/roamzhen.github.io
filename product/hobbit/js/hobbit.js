(function(){

/* gobal value */
var
  version = "1.0.0-beta",
  ui_canvas = document.getElementById("ui_canvas"),
  ui_context = ui_canvas.getContext("2d"),
  controller_div = document.getElementById("controller_div"),
  screenWidth = window.screen.availWidth,
  screenHeight = window.screen.availHeight,
  spriteWidth = 64,
  spriteHeight = 108;

/* image dom */
var hobbitImage = document.getElementById("hobbit");

/* default init */
ui_canvas.width = screenWidth;
ui_canvas.height = screenHeight;

/* Game class */
var Game = function(){
  
  this._setting();
  this._init();

}

Game.prototype._setting = function(){
  
  this.version = version;


}

Game.prototype._init = function(){

  this.hobbit = new Hobbit({
  	posX : screenWidth/2,
  	posY : screenHeight/2
  });

  this.gollum = new Gollum();

  this._bindEvent();
  this._animation();
}

Game.prototype._bindEvent = function(){
  var that = this;
  
  controller_div.addEventListener("touchstart",function(e){
  	gameTouchStart.call(that,e);
  });
  controller_div.addEventListener("touchmove",function(e){
  	gameTouchMove.call(that,e);
  });
  controller_div.addEventListener("touchend",function(e){
  	gameTouchEnd.call(that,e);
  });

  function gameTouchStart(e){
  	e.preventDefault();

  	this.nowX = e.changedTouches[0].pageX;
  	this.nowY = e.changedTouches[0].pageY;

  }
  function gameTouchMove(e){
  	e.preventDefault();

  	this.hobbit.moving = true;

  	var
  	  disX = e.changedTouches[0].pageX - this.nowX,
  	  disY = e.changedTouches[0].pageY - this.nowY;


  	if(disX>0){
  		this.hobbit.actionType = 1;
  	}else if(disX<0){
  		this.hobbit.actionType = 0;
  	}

  	this.nowX = e.changedTouches[0].pageX;
  	this.nowY = e.changedTouches[0].pageY;

  	this.hobbit.posX += disX / 2;
  	this.hobbit.posY += disY / 2;

  }
  function gameTouchEnd(e){
  	e.preventDefault();

  	this.hobbit.moving = false;
  	this.hobbit.step = 0;
  }

}

Game.prototype._animation = function(){
  var that = this;
  
  setInterval(function(){
  	if(that.hobbit.moving){
	  if(that.hobbit.step<3){
		that.hobbit.step++;
	  }else{ 
		that.hobbit.step=0;
	  }
	}
  },120);

  setInterval(function(){
	ui_context.clearRect(0,0,screenWidth,screenHeight);

	/* draw hobbit */
	ui_context.drawImage(hobbitImage,that.hobbit.step*spriteWidth,that.hobbit.actionType*spriteHeight,64,108,that.hobbit.posX,that.hobbit.posY,32,54);

  },33);

}

/* Sprite class */
var Sprite = function(opt){
  if(opt){
  	this.posX = (opt.posX)?opt.posX:0;
  	this.posY = (opt.posY)?opt.posY:0;
  }else{
  	this.posX = 0;
  	this.posY = 0;
  }

  this.step = 0;
  this.actionType = 1;
  this.moving = false;

}

Sprite.prototype = {

}

var Hobbit = function(opt){
  Sprite.call(this,opt);

}

var Gollum = function(opt){
  Sprite.call(this,opt);

}


var game = new Game();


})();