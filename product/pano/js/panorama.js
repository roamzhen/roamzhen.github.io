/* removePre() */
function removePre(e) { 
	e.preventDefault(); 
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

/* show and hide */
function showPop(type){
    var overlay = document.getElementById("overlay");
    var popMessage = document.getElementById("pop-message");
    var popStatus = document.getElementById("pop-status");

    switch(type){
        //message
        case 1:
            overlay.style.display = "block";
            popMessage.style.display = "inline-block";
            popStatus.style.display = "none";
            break;
        //status
        case 2:
            overlay.style.display = "block";
            popMessage.style.display = "none";
            popStatus.style.display = "block";
            break;
        default:
            break;
    }

    document.body.addEventListener('touchmove', removePre, false);

}

function hidePop(type){
    var overlay = document.getElementById("overlay");
    var popMessage = document.getElementById("pop-message");
    var popStatus = document.getElementById("pop-status");

    overlay.style.display = "none";
    popMessage.style.display = "none";

    switch(type){
        //message
        case 1:
            overlay.style.display = "none";
            popMessage.style.display = "none";
            break;
        //status
        case 2:
            overlay.style.display = "none";
            popStatus.style.display = "none";
            break;
        default:
            break;
    }

    document.body.removeEventListener('touchmove', removePre, false);

}

/* end show and hide */


//初始化全景及地图方法
function initPanorama(){
	//全景图展示
	var panorama = new BMap.Panorama('panorama');
	panorama.setPosition(new BMap.Point(113.358263,23.158888)); //根据经纬度坐标展示全景图
	panorama.setPov({heading: 0, pitch: -10});

	panorama.addEventListener('position_changed', function(e){ //全景图位置改变后，普通地图中心点也随之改变
		var pos = panorama.getPosition();
		map.setCenter(new BMap.Point(pos.lng, pos.lat));
		marker.setPosition(pos);
	});
	//普通地图展示
	var mapOption = {
			mapType: BMAP_NORMAL_MAP,
			maxZoom: 18,
			drawMargin:0,
			enableFulltimeSpotClick: true,
			enableHighResolution:true
		}
	var map = new BMap.Map("normal_map", mapOption);
	var testpoint = new BMap.Point(113.358263,23.158888);
	map.centerAndZoom(testpoint, 18);
	var marker=new BMap.Marker(testpoint);
	marker.enableDragging();
	map.addOverlay(marker);  
	marker.addEventListener('dragend',function(e){
		panorama.setPosition(e.point); //拖动marker后，全景图位置也随着改变
		panorama.setPov({heading: 0, pitch: -10});}
	);

	//地点按钮监听事件
	var selectItem = document.getElementsByClassName("select-item");

	for (var i = selectItem.length - 1; i >= 0; i--) {
		selectItem[i].num=i;
		selectItem[i].onclick = function(){
			if(!hasClass(this,"selected")){
				for (var i = selectItem.length - 1; i >= 0; i--) {
					removeClass(selectItem[i],"selected");
					addClass(this,"selected");
				};

				switch(this.num){
					case 0:
						panorama.setPosition(new BMap.Point(113.358263,23.158888)); //华农大南门
						panorama.setPov({heading: 0, pitch: -10});
						break;
					case 1:
						panorama.setPosition(new BMap.Point(113.35368,23.1667)); //华山报到点
						panorama.setPov({heading: -180, pitch: -10});
						break;
					case 2:
						panorama.setPosition(new BMap.Point(113.372922,23.159042)); //五山报到点
						panorama.setPov({heading: -150, pitch: 20});
						break;
					case 3:
						panorama.setPosition(new BMap.Point(113.372693,23.165595)); //启林报到点
						panorama.setPov({heading: -40, pitch: -10});
						break;
					default:
						break;
				}
			}
		}
	}

}

/**
* mini lib by roam
*/
var touchEvent = (function(){
	var oe,disY;
	var page=0;
	var movePrevent;
	var wrapWidth = window.innerWidth;
	var wrapHeight = window.innerHeight;

	var wrap = document.getElementsByClassName("sec")[0];

	var secItem = wrap.getElementsByTagName("section");

	for (var i = secItem.length - 1; i >= 0; i--) {
		secItem[i].style['width'] = wrapWidth+"px";
		secItem[i].style['height'] = wrapHeight+"px";

	};
	
	function onStart(e){
		oe = e;
	}
	function onMove(e){
		event.preventDefault();

		disY = e.pageY-oe.pageY;
		//console.log(disY);
		wrap.style["marginTop"] = (-wrapHeight*page+disY)+"px";
		//setWebkitCSS3(wrap,"transform","translateY("+(-wrapHeight*page+disY)+"px)");
	}
	function onEnd(e){

		if(disY>50){
			if (--page<0) {page=0};
		}
			
		if(disY<-50){
			if (++page>1) {page=1};
		}
		setPage();
	}

	function setPage(){
		wrap.style["marginTop"] = (-wrapHeight*page)+"px";
		//setWebkitCSS3(wrap,"transform","translateY("+(-wrapHeight*page)+"px)");
	}

	function setWebkitCSS3(target,cssName,cssValue){
		target.style[cssName] = cssValue;
		target.style["-webkit-"+cssName] = cssValue;
	}

	return {
		onStart: onStart,
		onMove: onMove,
		onEnd: onEnd
	}
})();


/* 单页面切换 */
function initOnePage(){

	/*
	document.body.addEventListener("touchstart",function(e){
		touchEvent.onStart(e.changedTouches[0]);
	});

	document.body.addEventListener("touchmove",function(e){
		touchEvent.onMove(e.changedTouches[0]);
	});

	document.body.addEventListener("touchend",function(e){
		touchEvent.onEnd(e.changedTouches[0]);
	});
	*/

	var selectWrap = document.getElementsByClassName("select-wrap")[0];

	selectWrap.addEventListener("touchstart",function(e){
		touchEvent.onStart(e.changedTouches[0]);
	});

	selectWrap.addEventListener("touchmove",function(e){
		touchEvent.onMove(e.changedTouches[0]);
	});

	selectWrap.addEventListener("touchend",function(e){
		touchEvent.onEnd(e.changedTouches[0]);
	});

	var secTouchable = document.getElementsByClassName("sec-touchable");

	for (var i = secTouchable.length - 1; i >= 0; i--) {
		secTouchable[i].addEventListener("touchstart",function(e){
			touchEvent.onStart(e.changedTouches[0]);
		});

		secTouchable[i].addEventListener("touchmove",function(e){
			touchEvent.onMove(e.changedTouches[0]);
		});

		secTouchable[i].addEventListener("touchend",function(e){
			touchEvent.onEnd(e.changedTouches[0]);
		});
	};

}

/* search */
function initSearch(){
	var searchBtn = document.getElementById('login_submit');

	searchBtn.onclick = function(){
		showPop(1);
	}

	var studentChoose = document.getElementsByClassName("student-choose");

	for (var i = studentChoose.length - 1; i >= 0; i--) {
		studentChoose[i].onclick = function(){
			var searchWrap = document.getElementsByClassName("search-wrap")[0];
			var searchDetail = document.getElementsByClassName("search-detail")[0];

			searchWrap.style['display'] = "none";
			searchDetail.style['display'] = "block";
			
			initShushe();

			hidePop(1);
		}
	};


}

function initShushe(){
	//宿舍按钮监听事件
	var shusheItem = document.getElementsByClassName("shushe-item");

	for (var i = shusheItem.length - 1; i >= 0; i--) {
		shusheItem[i].num=i;
		shusheItem[i].onclick = function(){
			if(!hasClass(this,"selected")){
				for (var i = shusheItem.length - 1; i >= 0; i--) {
					removeClass(shusheItem[i],"selected");
					addClass(this,"selected");
				};

				switch(this.num){
					case 0:
						
						break;
					case 1:
						
						break;
					case 2:
						
						break;
					case 3:
						
						break;
					case 4:

						break;
					default:
						break;
				}
			}
		}
	}
}
/* end search */


