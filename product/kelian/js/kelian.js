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

/* gobal var */
var game1 = document.getElementById("game1");
var game2 = document.getElementById("game2");
var game3 = document.getElementById("game3");
var baoming = document.getElementById("baoming");
var gameTimer = document.getElementById("gameTimer");

var contentWrap = (function(){
var gameTime = 0;

/* mini touchEvent by Roam */
var touchEvent = (function(){
	var userAgentInfo = navigator.userAgent;
	
	var startX = 0,
		startY = 0;
	var curPageX=0,
		curPageY=0;
	var scrollPrevent = false,
		movePrevent = false,
		touchDown = false;
	
	var wrap = game1.getElementsByClassName("sec-wrap")[0];
	var picSlider = document.getElementById("pic-slider");
	var imgList = picSlider.getElementsByTagName("img");

	var wrapWidth = wrap.offsetWidth;
	var wrapHeight = wrap.offsetHeight;

	var secItem = wrap.getElementsByTagName("section");
	
	var loadImg = new Array();

	for (var i = secItem.length - 1; i >= 0; i--) {
		secItem[i].style['width'] = wrapWidth+"px";
		secItem[i].style['height'] = wrapHeight+"px";

	};


	/* start X */
	function onStartX(e){
		//event.stopPropagation();
		
		
		if (movePrevent == true) {
			event.preventDefault();
			return false;
		}
		touchDown = true;

		// 起始点，页面位置
		startX = e.pageX;

		//setWebkitCSS3(picSlider,"transform","translateX("+(-wrapWidth*curPageX)+"px)");
	}
	function onMoveX(e){
		//event.stopPropagation();
		
		if (movePrevent == true || touchDown != true) {
			event.preventDefault();
			return false;
		}
		
		if(userAgentInfo.indexOf("iPhone") > 0){
			if (scrollPrevent == false && e.pageX != startX) {
				disX = e.pageX-startX;
				setWebkitCSS3(picSlider,"transform","translateX("+(-wrapWidth*curPageX+disX)+"px)");
			}
		}else{
			if (scrollPrevent == false) {
				// 抬起点，页面位置
				endX = e.pageX;
				
				// swip 事件默认大于10px才会触发，小于这个就将页面归回
				if (Math.abs(endX - startX) <= 10) {
					animatePageX(curPageX);
				} else {
					if (endX > startX) {
						prevPageX();
					} else {
						nextPageX();
					}
				}
			}
			
		}
		
	}
	function onEndX(e){
		//event.stopPropagation();
		
		if (movePrevent == true) {
			event.preventDefault();
			return false;
		}

		touchDown = false;
		
		if(userAgentInfo.indexOf("iPhone") > 0){
			
			if (scrollPrevent == false) {
				// 抬起点，页面位置
				endX = e.pageX;
				
				// swip 事件默认大于50px才会触发，小于这个就将页面归回
				if (Math.abs(endX - startX) <= 50) {
					animatePageX(curPageX);
				} else {
					if (endX > startX) {
						prevPageX();
					} else {
						nextPageX();
					}
				}
			}
		}

	}

	function prevPageX() {
		var newPage = curPageX - 1;
		animatePageX(newPage);
	}
	function nextPageX() {
		var newPage = curPageX + 1;
		animatePageX(newPage);
	}
	function animatePageX(newPage) {
		if (newPage < 0) {
			newPage = 0;
		}
		if (newPage > imgList.length - 1) {
			newPage = imgList.length - 1;
		}

		curPageX = newPage;
		var newMargin = curPageX * (-wrapWidth);

		setWebkitCSS3(picSlider,"transform","translateX("+newMargin+"px)");

		movePrevent = true;
		setTimeout("contentWrap.touchEvent.changeMoveEvent();", 300);

	}
	/* end X */


	/* start Y */
	function onStartY(e){
		event.stopPropagation();
		
		
		if (movePrevent == true) {
			event.preventDefault();
			return false;
		}
		touchDown = true;

		// 起始点，页面位置
		startY = e.pageY;

		//setWebkitCSS3(wrap,"transform","translateY("+(-wrapHeight*curPageY)+"px)");
	}
	function onMoveY(e){
		event.stopPropagation();
		
		if (movePrevent == true || touchDown != true) {
			event.preventDefault();
			return false;
		}
		
		if(userAgentInfo.indexOf("iPhone") > 0){
			if (scrollPrevent == false && e.pageY != startY) {
				disY = e.pageY-startY;
				setWebkitCSS3(wrap,"transform","translateY("+(-wrapHeight*curPageY+disY)+"px)");
			}
		}else{
			if (scrollPrevent == false) {
				// 抬起点，页面位置
				endY = e.pageY;
				
				// swip 事件默认大于10px才会触发，小于这个就将页面归回
				if (Math.abs(endY - startY) <= 10) {
					animatePageY(curPageY);
				} else {
					if (endY > startY) {
						prevPageY();
					} else {
						nextPageY();
					}
				}
			}
		}
		
		
	}
	function onEndY(e){
		event.stopPropagation();
		
		if (movePrevent == true) {
			event.preventDefault();
			return false;
		}

		touchDown = false;
	
		if(userAgentInfo.indexOf("iPhone") > 0){
			if (scrollPrevent == false) {
				// 抬起点，页面位置
				endY = e.pageY;
				
				// swip 事件默认大于50px才会触发，小于这个就将页面归回
				if (Math.abs(endY - startY) <= 50) {
					animatePageY(curPageY);
				} else {
					if (endY > startY) {
						prevPageY();
					} else {
						nextPageY();
					}
				}
			}
		}

	}

	function prevPageY() {
		var newPage = curPageY - 1;
		animatePageY(newPage);
	}
	function nextPageY() {
		var newPage = curPageY + 1;
		animatePageY(newPage);
	}
	function animatePageY(newPage) {
		if (newPage < 0) {
			newPage = 0;
		}
		if (newPage > game1.getElementsByClassName("sec-wrap")[0].getElementsByTagName("section").length - 1) {
			newPage = game1.getElementsByClassName("sec-wrap")[0].getElementsByTagName("section").length - 1;
		}
		
		if(newPage===1){
			if(fnGame1.returnPlay()!=true){
				fnGame1.changePlay();
				fnGame1.init();
			}
		}
		
		curPageY = newPage;
		var newMargin = curPageY * (-wrapHeight);

		setWebkitCSS3(wrap,"transform","translateY("+newMargin+"px)");

		movePrevent = true;
		setTimeout("contentWrap.touchEvent.changeMoveEvent();", 300);

	}
	/* end Y */

	function setWebkitCSS3(target,cssName,cssValue){
		target.style[cssName] = cssValue;
		target.style["-webkit-"+cssName] = cssValue;
	}
	function changeMoveEvent(){
		movePrevent = false;
	}

	return {
		changeMoveEvent : changeMoveEvent,
		onStartX: onStartX,
		onMoveX: onMoveX,
		onEndX: onEndX,
		onStartY: onStartY,
		onMoveY: onMoveY,
		onEndY: onEndY
	}
})();

/* fnGame1 */
var fnGame1 = (function(){
	var playing = false;
	var game1Time = 0;
	var game1Timer;
	
	var overlayGame1 = document.getElementById("overlayGame1");
	
	var faceSrc= new Array();
	
	var wrap = game1.getElementsByClassName("sec-wrap")[0];
	var picSlider = document.getElementById("pic-slider");
	var sec1Rest = wrap.getElementsByClassName("sec1-rest")[0];
	var imgList = picSlider.getElementsByTagName("img");
	var faceImg = document.getElementById("face-img");

	var wrapWidth = wrap.offsetWidth;
	var wrapHeight = wrap.offsetHeight;

	var secItem = wrap.getElementsByTagName("section");
	
	var sec2 = secItem[1];
	var itemList = sec2.getElementsByClassName("choose-item");
	
	faceImg.src = "images/step1/mini/mini-face"+getNewNumber()+".jpg";

	for (var i = secItem.length - 1; i >= 0; i--) {
		secItem[i].style['width'] = wrapWidth+"px";
		secItem[i].style['height'] = wrapHeight+"px";

	};
	
	picSlider.style["width"]= wrapWidth * imgList.length+"px";
	
	for(var i=0;i<imgList.length;i++){
		imgList[i].style["width"] = wrapWidth +"px";
	}
	
	for(var i=0;i<itemList.length;i++){
		itemList[i].num = i;
		itemList[i].onclick = function(){
			checkChoose(this,this.num);
		}
	}
	
	//wrap Listener
	sec1Rest.addEventListener("touchstart",function(e){
		touchEvent.onStartY(e.changedTouches[0]);
	});

	sec1Rest.addEventListener("touchmove",function(e){
		touchEvent.onMoveY(e.changedTouches[0]);
	});

	sec1Rest.addEventListener("touchend",function(e){
		touchEvent.onEndY(e.changedTouches[0]);
	});
	
	sec2.addEventListener("touchstart",function(e){
		touchEvent.onStartY(e.changedTouches[0]);
	});

	sec2.addEventListener("touchmove",function(e){
		touchEvent.onMoveY(e.changedTouches[0]);
	});

	sec2.addEventListener("touchend",function(e){
		touchEvent.onEndY(e.changedTouches[0]);
	});
	
	//picSlider Listner
	picSlider.addEventListener("touchstart",function(e){
		touchEvent.onStartX(e.changedTouches[0]);
	});

	picSlider.addEventListener("touchmove",function(e){
		touchEvent.onMoveX(e.changedTouches[0]);
	});

	picSlider.addEventListener("touchend",function(e){
		touchEvent.onEndX(e.changedTouches[0]);
	});
	
	function checkChoose(obj,num){
		var checkNum = getCheckNum();
		
		if(checkNum==num){
			addClass(obj,"anHide");
			setTimeout(function(){
				obj.style['display']="none";
			},500);
			
			faceSrc.push(num);
			
			if(faceSrc.length!=12){
				var newNum = getNewNumber();
				
				faceImg.src = "images/step1/mini/mini-face"+newNum+".jpg";
			}else{
				finishGame();
			}
			
		}else{
			game1Time += 5;
		}
	}
	
	function getCheckNum(){
		var checkNum="";
		if(faceImg.src.substr(faceImg.src.length-7,1)=="e"){
			checkNum = parseInt(faceImg.src.substr(faceImg.src.length-6,2));
		}else if(faceImg.src.substr(faceImg.src.length-6,1)=="e"){
			checkNum = parseInt(faceImg.src.substr(faceImg.src.length-5,1));
		}
		
		return checkNum;
	}
	
	function getNewNumber(){
		var num = 0;
		var flag=true;
		
		while(flag){
			flag=false;
			num = Math.floor(Math.random()*12);
			
			for(var i=0; i<faceSrc.length;i++){
				if(num==faceSrc[i]){
					flag=true;
				}
			}
		}
		
		return num;
		
	}
	
	function initGame(){
		gameTimer.style["display"]="block";
		
		//game1Timer
		game1Timer = setInterval(function(){
			game1Time++;
			gameTimer.innerText = game1Time;
		},1000);
		
	}
	
	function finishGame(){
		clearInterval(game1Timer);
		
		gameTimer.style['display']=null;
		
		gameTime+=game1Time;
		
		document.getElementById("game1TimeText").innerHTML = game1Time;
		
		overlayGame1.style['display']= "block";
		
		var nextBtn = overlayGame1.getElementsByClassName("next-btn")[0];
		nextBtn.onclick = function(){
			fnGame2.init();
			
			overlayGame1.style['display']= null;
			game1.style['display'] = "none";
			game2.style['display'] = "block";
		}
		
	}
	
	function returnPlay(){
		return playing;
	}
	
	function changePlay(){
		playing = !playing;
	}
	
	return {
		"returnPlay" : returnPlay,
		"changePlay" : changePlay,
		"init" : initGame
	}
	
}());

/* fnGame2 */
var fnGame2 = (function(){
	var game2Time=0;
	var game2Timer;
	
	var differentImg = game2.getElementsByClassName("different-img");
	var game2Title = document.getElementById("game2-title");	
	
	var nameList = ["8090粤商见面会",
					"创龙电子创始人朱雅在介绍长距离RFID2",
					"创新创业论坛",
					"创新梦工厂答辩会",
					"大学生科技创业墙",
					"青年创业集市",
					"省委副书记马兴瑞考察神农田园团队",
					"挑战杯创青春创业大赛",
					"在校生企业富维网络招聘实习生",
					"自制方程式赛车"
					];
	
	var srcList = [];
	
	for(var i=0;i<differentImg.length;i++){
		differentImg[i].onclick = function(){
			if(this.goal){
				addImgToList();
			}else{
				game2Time+=10;
			}
		}
	}
	
	function addImgToList(){
		if(srcList.length!=10){
			var randomImg = Math.floor(Math.random()*4);
			
			var randomList = getListNum();
			
			srcList.push(randomList);
			
			game2Title.innerText = nameList[randomList-1];
			
			for(var i=0;i<differentImg.length;i++){
				if(randomImg===i){
					differentImg[i].goal=true;
					differentImg[i].src="images/step2/group"+randomList+"D.jpg";
				}else{
					differentImg[i].goal=false;
					differentImg[i].src="images/step2/group"+randomList+".jpg";
				}
			}
		}else{
			finishGame();
		}
	}
	
	function getListNum(){
		var num = 0;
		var flag=true;
		
		while(flag){
			flag=false;
			num = Math.floor(1+Math.random()*10);
			
			for(var i=0; i<srcList.length;i++){
				if(num==srcList[i]){
					flag=true;
				}
			}
		}
		
		return num;
		
	}

	function initGame(){
		addImgToList();
		
		gameTimer.innerText = "";
		gameTimer.style["display"]="block";
		
		//game1Timer
		game2Timer = setInterval(function(){
			game2Time++;
			gameTimer.innerText = game2Time;
		},1000);
		
	}
	
	function finishGame(){
		clearInterval(game2Timer);
		
		gameTimer.style['display']=null;
		
		gameTime+=game2Time;
		
		document.getElementById("game2TimeText").innerHTML = game2Time;
		
		overlayGame2.style['display']= "block";
		
		var nextBtn = overlayGame2.getElementsByClassName("next-btn")[0];
		nextBtn.onclick = function(){
			fnGame3.init();
			
			overlayGame2.style['display']= null;
			game2.style['display'] = "none";
			game3.style['display'] = "block";
		}
	}
	
	return {
		"init": initGame
	}
	
}());

// fnGame3
var fnGame3 = (function(){
	var speed = 50;
	var itemTimeFlag = true;
	
	var game3Time = 0;
	var game3Timer;
	var itemTimer;
	
	var mario1 = document.getElementById("mario1"),
		mario2 = document.getElementById("mario2"),
		mario3 = document.getElementById("mario3"),
		marioJump = document.getElementById("marioJump"),
		itemQ1 = document.getElementById("item-q-block1"),
		itemQ2 = document.getElementById("item-q-block2"),
		itemQ3 = document.getElementById("item-q-block3"),
		itemQN = document.getElementById("item-q-blockN"),
		itemB = document.getElementById("item-brick"),
		shroom = document.getElementById("shroom"),
		marioBg = document.getElementById("mario-bg");
	
	var game3Title = document.getElementById("game3-title");
	
	var canvasWrap = game3.getElementsByClassName("canvas-wrap")[0];
	var canvas = document.getElementById("mar-canvas");
	
	var wrapWidth = canvasWrap.offsetWidth;
	var wrapHeight = canvasWrap.offsetHeight;
	
	canvas.width = wrapWidth;
	canvas.height = wrapHeight;
	
	var context = canvas.getContext("2d");
	
	var Player = function(){
		this.width = 48;
		this.height = 48;
		this.x = wrapWidth/2-this.width/2;
		this.y = wrapHeight-this.height-23;
		this.vX = 0;
		this.vY = 0;
		this.aX = 0;
		this.aY = 0;
		this.running = true;
		this.step = 1;
		this.jumpping = false;
		this.goaled = false;
	};
	
	var player = new Player();
	
	var Item = function(x,y,type){
		this.x = x;
		this.y = y;
		this.vX = -20;
		this.vY = 0;
		this.aY = 0;
		this.type = type;
		this.flag = true;
		this.step = 0;
		
		if(this.type==0){
			this.width = 24;
			this.height = 48;
		}else if(this.type==1){
			this.width = 48;
			this.height = 48;
			
		}
		
	}
	var itemTop = wrapHeight-player.height-23-100;
	
	var itemList = new Array();
	
	var Shroom = function(x,y){
		this.x = x;
		this.y = y;
		this.width = 48;
		this.height = 48;
		this.vX = -3;
		this.vY = -12;
	}
	var shroomList = new Array();
	
	var goalList = [];
	
	var goalSrc = [
				"ERP沙盘大赛",
				"“赢在广州”创业大赛",
				"挑战杯",
				"丁颖杯",
				"ACM程序设计竞赛",
				"空间信息技术大赛",
				"大学生电子设计竞赛",
				"大学生方程式汽车大赛",
				"机械创新设计大赛",
				"三维数字化设计大赛",
				"数学建模竞赛", 
				"“启航计划”",
				"兽医技能大赛",
				"生物化学实验技能大赛",
				"桥梁设计大赛",
				"电子商务营销大赛"		
			];
	
	var bg = {
		"x" : 0,
		"y" : wrapHeight-198
	}
	
	function getGoalNumber(){
		var num = 0;
		var flag=true;
		
		while(flag){
			flag=false;
			num = Math.floor(0+Math.random()*16);
			
			for(var i=0; i<goalList.length;i++){
				if(num==goalList[i]){
					flag=true;
				}
			}
		}
		
		return num;
	}
	
	function dataReNew(){
		bg.x-=20;
		if(bg.x<(wrapWidth-2800)){
			bg.x=0;
		}
		
		for(var i = 0; i<itemList.length;i++){
			// watchless and pop
			if(itemList[i].x<0-itemList[i].width*2){
				itemList.splice(i,1);
				i--;
				continue;
			}
			
			if(itemList[i].flag&&itemList[i].x+48<player.x){
				itemList[i].flag = false;
			}
			
			itemList[i].x += itemList[i].vX;
			
		}
		
		if(player.jumpping){
			for(var i=0;i<itemList.length;i++){
				if(itemList[i].flag&&player.x>=itemList[i].x&&player.y<itemTop+itemList[i].height){
					player.vY = 0;
					player.y = itemTop+itemList[i].height;
					
					if(itemList[i].type==1){
						
						var showNum =getGoalNumber();
						goalList.push(showNum);
						
						if(goalList.length==16){
							finishGame();
						}
						
						shroomList.push(new Shroom(itemList[i].x,itemList[i].y));
						
						game3Title.innerText = goalSrc[showNum];
							
						player.goaled = true;
						
						var thatItem = itemList[i];
						thatItem.timer = setInterval(function(){
							thatItem.step++;
							
							if(thatItem.step==5)
								clearInterval(thatItem.timer);
						},33);
						
					}else if(itemList[i].type==0){
						var thatItem = itemList[i];
						
						thatItem.vY=-10;
						thatItem.aY=5;
						thatItem.timer = setInterval(function(){
							thatItem.y+=thatItem.vY;
							thatItem.vY+=thatItem.aY;
							
							if(thatItem.y>=itemTop){
								thatItem.y = itemTop;
								thatItem.vY= 0;
								thatItem.aY= 0;
								clearInterval(thatItem.timer);
							}
						},33);
					}
				}else{
					if(itemList[i].flag&&player.x+player.width>itemList[i].x&&player.y<itemTop+itemList[i].height){
						player.x = itemList[i].x -player.width;
						player.vX=-20;
					}else
						player.vX=0;
				}
				
				
			}
			
			player.vY+=player.aY;
			player.y += player.vY;
			
			player.x += player.vX;
			
			if(player.y>=wrapHeight-player.height-23){
				player.y = wrapHeight-player.height-23;
				player.vY=0;
				player.aY=0;
				player.running = true;
				player.jumpping = false;
				
				if(!player.goaled){
					game3Time+=5;
				}
				player.goaled = false;
			}
			
			
		}
		
		for(var i = 0; i<shroomList.length;i++){		
			if(shroomList[i].y+shroomList[i].height<=0){
				shroomList.splice(i,1);
				i--;
				continue;
			}
			
			shroomList[i].x+=shroomList[i].vX;
			shroomList[i].y+=shroomList[i].vY;
			
		}
		
	}
	
	function animation(){
		context.clearRect(0,0,wrapWidth,wrapHeight);
		
		// 1. draw bg
		context.save();
		context.translate(bg.x,bg.y);
		context.drawImage(marioBg,0,0);
		context.restore();
		
		// 2. draw player
		context.save();
		context.translate(player.x,player.y);
		
		// run
		if(player.running){
			if(player.x<=wrapWidth/2-player.width/2){
				player.aX = 2;
				player.vX+= player.aX;
				player.x += player.vX;
			}else{
				player.vX =0;
				player.x = wrapWidth/2-player.width/2;
			}
			
			if(player.step>=0&&player.step<=3)
				context.drawImage(mario1,0,0);
			else if(player.step>3&&player.step<=6)
				context.drawImage(mario2,0,0);
			else if(player.step>9)
				context.drawImage(mario3,0,0);
	
			if(++player.step===6){
				player.step=1;
			}
		// jump
		}else if(player.jumpping){
			context.drawImage(marioJump,0,0);
		}
		context.restore();
		
		// 3. draw Shroom
		for(var i = 0; i<shroomList.length;i++){		
			context.save();
			context.translate(shroomList[i].x,shroomList[i].y);
			
			context.drawImage(shroom,0,0);
			
			context.restore();
		}
		
		// 4. draw item
		for(var i = 0; i<itemList.length;i++){
			
			context.save();
			context.translate(itemList[i].x,itemList[i].y);
			
			if(itemList[i].type==0){
				context.drawImage(itemB,0,0);
				context.drawImage(itemB,itemList[i].width,0);
			}else if(itemList[i].type==1){
				if(itemList[i].step==0)
					context.drawImage(itemQ1,0,0);
				else if(itemList[i].step>=1&&itemList[i].step<=2)
					context.drawImage(itemQ2,0,0);
				else if(itemList[i].step>2&&itemList[i].step<=4)
					context.drawImage(itemQ3,0,0);
				else if(itemList[i].step>4)
					context.drawImage(itemQN,0,0);
			}
			
			context.restore();
		}
		
		
	}
	
	function fnItemTimer(){
		if(itemTimeFlag){
			var randomLength =Math.floor(1+Math.random()*2);
			for(var i=0; i<randomLength;i++){
				var randomType = Math.floor(Math.random()*2);
			
				itemList.push(new Item(wrapWidth+i*48,itemTop,randomType));
			}
			
			var randomTime = Math.floor(1.5+Math.random()*3)*500;
			setTimeout(fnItemTimer,randomTime);
		}
	}
	
	function initGame(){
		gameTimer.style['display']= "block";
		
		game3Timer = setInterval(function(){
			gameTimer.innerText = game3Time;
		},speed);
		
		animationTimer = setInterval(function(){
			dataReNew();
			animation();
		},speed);
		
		var randomTime = Math.floor(Math.random()*4)*500;
		setTimeout(fnItemTimer,randomTime);
		
		canvasWrap.addEventListener("touchstart",function(){
			if(!player.jumpping){
				player.running = false;
				player.jumpping = true;
				player.vY = -55;
				player.aY = 10;
			}
		});
	}
	
	function finishGame(){
		clearInterval(animationTimer);
		clearInterval(game3Timer);
		itemTimeFlag =false;
		
		gameTimer.style['display']=null;
		
		gameTime+=game3Time;
		
		document.getElementById("game3TimeText").innerHTML = game3Time;
		document.getElementById("gameAllTimeText").innerHTML = gameTime;
		
		overlayGame3.style['display']= "block";
		
		var nextBtn = overlayGame3.getElementsByClassName("next-btn")[0];
		nextBtn.onclick = function(){
			
			overlayGame3.style['display']= null;
			game3.style['display'] = "none";
			
			baoming.style['display'] = null;
		}
	}
	
	return {
		"init": initGame
	}
	
}());
	
	return {
		"touchEvent" :touchEvent
	}
}());

window.onload = function(){	
	game1.style['display']="none";
	game2.style['display']="none";
	game3.style['display']="none";
	//baoming.style['display'] = "none";

	initEachPop();
}

//防止屏幕拖动
game1.documentElement.addEventListener('touchmove', removePre);
game2.documentElement.addEventListener('touchmove', removePre);
game3.documentElement.addEventListener('touchmove', removePre);



