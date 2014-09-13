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
var gameTimer = document.getElementById("gameTimer");

var overlayGame1 = document.getElementById("overlayGame1");

var gameTime = 0;

/* mini touchEvent by Roam */
var touchEvent = (function(){
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

	for (var i = secItem.length - 1; i >= 0; i--) {
		secItem[i].style['width'] = wrapWidth+"px";
		secItem[i].style['height'] = wrapHeight+"px";

	};


	/* start X */
	function onStartX(e){
		event.stopPropagation();
		
		
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
		event.stopPropagation();
		
		if (movePrevent == true || touchDown != true) {
			event.preventDefault();
			return false;
		}

		if (scrollPrevent == false && e.pageX != startX) {
			disX = e.pageX-startX;
			setWebkitCSS3(picSlider,"transform","translateX("+(-wrapWidth*curPageX+disX)+"px)");
		}
	}
	function onEndX(e){
		event.stopPropagation();
		
		if (movePrevent == true) {
			event.preventDefault();
			return false;
		}

		touchDown = false;

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
		
		console.log(newPage);

		curPageX = newPage;
		var newMargin = curPageX * (-wrapWidth);

		setWebkitCSS3(picSlider,"transform","translateX("+newMargin+"px)");

		movePrevent = true;
		setTimeout("touchEvent.changeMoveEvent();", 300);

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

		setWebkitCSS3(wrap,"transform","translateY("+(-wrapHeight*curPageY)+"px)");
	}
	function onMoveY(e){
		event.stopPropagation();
		
		if (movePrevent == true || touchDown != true) {
			event.preventDefault();
			return false;
		}

		if (scrollPrevent == false && e.pageY != startY) {
			disY = e.pageY-startY;
			setWebkitCSS3(wrap,"transform","translateY("+(-wrapHeight*curPageY+disY)+"px)");
		}
	}
	function onEndY(e){
		event.stopPropagation();
		
		if (movePrevent == true) {
			event.preventDefault();
			return false;
		}

		touchDown = false;

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
		setTimeout("touchEvent.changeMoveEvent();", 300);

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
	
	var faceSrc= new Array();
	
	var wrap = game1.getElementsByClassName("sec-wrap")[0];
	var picSlider = document.getElementById("pic-slider");
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
	wrap.addEventListener("touchstart",function(e){
		touchEvent.onStartY(e.changedTouches[0]);
	});

	wrap.addEventListener("touchmove",function(e){
		touchEvent.onMoveY(e.changedTouches[0]);
	});

	wrap.addEventListener("touchend",function(e){
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
		var num = -1;
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
	

	function initGame(){
		
	}
	
	return {
		"init": initGame
	}
	
}());

window.onload = function(){
	
	//game1.style['display']="none";
	game2.style['display']="none";
	game3.style['display']="none";

}

