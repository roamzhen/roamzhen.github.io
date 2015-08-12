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

/* idPc */
function IsPC() {
	var userAgentInfo = navigator.userAgent;
	var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
	var flag = true;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = false;
			break;
		}
	}
	return flag;
}
/* end idPc */

/* show and hide */
function showPop(){
    var overlay = document.getElementById("overlay");
    var popMessage = document.getElementById("pop-message");

    overlay.style.display = "block";
    popMessage.style.display = "inline-block";

    document.getElementsByClassName("wrap")[0].addEventListener('touchmove', removePre, false);

}

function hidePop(){
    var overlay = document.getElementById("overlay");
    var popMessage = document.getElementById("pop-message");

    overlay.style.display = "none";
    popMessage.style.display = "none";

    document.getElementsByClassName("wrap")[0].removeEventListener('touchmove', removePre, false);

}

function showLoading(){
	var loadingPage = document.getElementsByClassName("loading_page")[0];

	loadingPage.style['display'] = "block";

    document.getElementsByClassName("wrap")[0].addEventListener('touchmove', removePre, false);

}

function hideLoading(){
	var loadingPage = document.getElementsByClassName("loading_page")[0];

	loadingPage.style['display'] = null;

    document.getElementsByClassName("wrap")[0].addEventListener('touchmove', removePre, false);

}

function showMeassage(str){
	var fakeJson = {
		fake : "yes",
		fakeMessage : str
	}

	var searchDetail = document.getElementsByClassName("search-detail")[0];

	addClass(searchDetail,"visitor");

	initShushe(fakeJson,0);


	/*
    var overlayMessage = document.getElementById("overlayMessage");

    overlayMessage.getElementsByClassName("detail")[0].innerHTML = str;

    overlayMessage.style['display'] = "block";

    document.getElementsByClassName("wrap")[0].addEventListener('touchmove', removePre, false);
	*/
}

/*
function hideMessage(){	
    var overlayMessage = document.getElementById("overlayMessage");

    overlayMessage.style['display']=null;

    document.getElementsByClassName("wrap")[0].removeEventListener('touchmove', removePre, false);
}
*/

function showQrcode(){
	var overlayMessage = document.getElementById("overlayMessage");

    overlayMessage.style['display'] = "block";

    overlayMessage.onclick = function(){
    	hideQrcode();
    }

    document.getElementsByClassName("wrap")[0].addEventListener('touchmove', removePre, false);

}

function hideQrcode(){
	var overlayMessage = document.getElementById("overlayMessage");

    overlayMessage.style['display']=null;

    document.getElementsByClassName("wrap")[0].removeEventListener('touchmove', removePre, false);

}

/* end show and hide */

/* 异步加载js */
function dynamicLoadJs(src,fun,parma1,parma2,num)
{
	var _doc=document.getElementsByTagName('head')[0];
	var script=document.createElement('script');
	script.setAttribute('type','text/javascript');
	script.setAttribute('src',src);
	_doc.appendChild(script);
	script.onload=script.onreadystatechange=function(){
		if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
		   fun(parma1,parma2,num);
		}
		script.onload=script.onreadystatechange=null;
	}
}
/* end 异步加载js */

/* ajax */
function ajaxLoadingInfo(url,fun){
    var xmlhttp = new XMLHttpRequest();
    
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            fun(xmlhttp.responseText)
        }
    }

    xmlhttp.open("GET",url,true);
    xmlhttp.send();

}


//初始化全景及地图方法
function initPanorama(){
	//全景图展示
	var panorama = new BMap.Panorama('panorama');
	panorama.setPosition(new BMap.Point(113.358301,23.158959)); //根据经纬度坐标展示全景图
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
	var testpoint = new BMap.Point(113.358301,23.158959);
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
						panorama.setPosition(new BMap.Point(113.358301,23.158959)); //华农大南门
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
	var startX = 0,
		startY = 0;
		margin = 0;
	var curPage=0;
	var scrollPrevent = false,
		movePrevent = false,
		touchDown = false;
	var wrapWidth = document.getElementsByClassName("wrap")[0].offsetWidth;
	var wrapHeight = document.getElementsByClassName("wrap")[0].offsetHeight;

	var wrap = document.getElementsByClassName("sec")[0];

	var secItem = wrap.getElementsByTagName("section");

	for (var i = secItem.length - 1; i >= 0; i--) {
		secItem[i].style['width'] = wrapWidth+"px";
		secItem[i].style['height'] = wrapHeight+"px";

	};
	
	//top bottom btn
	var bottomBtn = document.getElementById("bottom-btn");
	var topBtn = document.getElementById("top-btn");

	topBtn.style['display']="none";

	bottomBtn.onclick = function(){
		nextPage();
	}

	topBtn.onclick = function(){
		prevPage();
	}

	function onStart(e){
		if (movePrevent == true) {
			event.preventDefault();
			return false;
		}

		touchDown = true;

		// 起始点，页面位置
		startX = e.pageX;
		startY = e.pageY;

		wrap.style["marginTop"] = (-wrapHeight*curPage)+"px";
	}
	function onMove(e){
		if (movePrevent == true || touchDown != true) {
			event.preventDefault();
			return false;
		}

		if (scrollPrevent == false && e.pageY != startY) {
			disY = e.pageY-startY;
			//console.log(disY);
			wrap.style["marginTop"] = (-wrapHeight*curPage+disY)+"px";
			//setWebkitCSS3(wrap,"transform","translateY("+(-wrapHeight*page+disY)+"px)");
		}
	}
	function onEnd(e){

		if (movePrevent == true) {
			event.preventDefault();
			return false;
		}

		touchDown = false;

		if (scrollPrevent == false) {
			// 抬起点，页面位置
			endX = e.pageX;
			endY = e.pageY;
			// swip 事件默认大于50px才会触发，小于这个就将页面归回
			if (Math.abs(endY - startY) <= 50) {
				animatePage(curPage);
			} else {
				if (endY > startY) {
					prevPage();
				} else {
					nextPage();
				}
			}
		}

	}

	function prevPage() {
		if(bottomBtn.style['display']==="none")
			bottomBtn.style['display']=null;
		topBtn.style['display']= "none";

		var newPage = curPage - 1;
		animatePage(newPage);

	}

	function nextPage() {
		if(topBtn.style['display']==="none")
			topBtn.style['display']=null;
		bottomBtn.style['display']= "none";

		var newPage = curPage + 1;
		animatePage(newPage);
	}

	function animatePage(newPage) {
		if (newPage < 0) {
			newPage = 0;
		}
		if (newPage > document.getElementsByClassName("sec-item").length - 1) {
			newPage = document.getElementsByClassName("sec-item").length - 1;
		}

		curPage = newPage;
		var newMarginTop = curPage * (-wrapHeight);

		wrap.style["marginTop"] = newMarginTop+"px";
		//setWebkitCSS3(wrap,"transform","translateY("+newMarginTop+"px)");

		movePrevent = true;
		setTimeout("touchEvent.changeMoveEvent();", 300);

	}


	function setWebkitCSS3(target,cssName,cssValue){
		target.style[cssName] = cssValue;
		target.style["-webkit-"+cssName] = cssValue;
	}
	function changeMoveEvent(){
		movePrevent = false;
	}

	return {
		changeMoveEvent : changeMoveEvent,
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
	var searchInput = document.getElementById("login_user");
	var searchBtn = document.getElementById('login_submit');

	searchBtn.onclick = function(){
		if(searchInput.value===""){
			showMeassage("请输入姓名");
			return;
		}


		ajaxLoadingInfo("info.json");
		showLoading();
	}

	function searchSuccess(text){
		var resJson = JSON.parse(text);
		hideLoading();

		if(resJson.length===0){
			showMeassage("没有找到该新生的相关信息");
			return;
		}

		var  popMessage = document.getElementById("pop-message");

		document.documentElement.removeEventListener("touchmove",removePre, false);

		popMessage.innerHTML = "";
		for(var i =0; i< resJson.length;i++){

			var myMajor ="-"+resJson[i].major;
			if(resJson[i].major===""||resJson[i].major===null)
				myMajor ="";

			popMessage.innerHTML += "<a class='student-choose' href='javascript:;'><span>"+
									resJson[i].name+"</span><span>"+
									resJson[i].college+myMajor+
									"</span></a>"; 
		}

		var studentChoose = document.getElementsByClassName("student-choose");

		for (var i = 0; i < studentChoose.length; i++) {
			studentChoose[i].num= i;

			studentChoose[i].onclick = function(){
				initShushe(resJson,this.num);

				document.documentElement.addEventListener("touchmove",removePre, false);

				hidePop();
			}
		};

		showPop();


	}

}

function initShushe(json,num){
	var searchWrap = document.getElementsByClassName("search-wrap")[0];
	var searchDetail = document.getElementsByClassName("search-detail")[0];

	searchWrap.style['display'] = "none";
	searchDetail.style['display'] = "block";

	var infoName = document.getElementById("info-name"),
	    infoNumber = document.getElementById("info-number"),
		infoShushe = document.getElementById("info-shushe"),
		infoMember = document.getElementById("info-member"),
	    infoType = document.getElementById("info-type");
	
	if(json.fake===undefined){
		var roomie = "";
		for(var i=0; i<json[num].roomie.length;i++){
			roomie+="<span class='roomer'>"+json[num].roomie[i].name +"</span>";
		}

	    infoName.innerHTML = json[num].name;
		infoNumber.innerHTML = json[num].studentid;
		infoShushe.innerHTML = json[num].area+json[num].building+"栋"+json[num].roomnumber;
		infoMember.innerHTML = roomie;
		infoType.innerHTML = json[num].roomsize+"人间";

		//定义读取房间类型
		var numberOfShushe=0;
		if(parseInt(json[num].roomsize)===4){
			if(json[num].area.substr(0,2)==="启林"){
				numberOfShushe = 1;
			}else if(json[num].area.substr(0,2)==="华山"){
				numberOfShushe = 3;
			}

		}else if(parseInt(json[num].roomsize)===6){
			numberOfShushe = 2;
		}

	}else{
		infoShushe.innerHTML = json.fakeMessage;

		var numberOfShushe = 0;
	}

	//重新查询按钮
	var login_out_btn = document.getElementById("login_out_btn");

	login_out_btn.onclick = function(){
		searchWrap.style['display'] = "block";
		searchDetail.style['display'] = "none";

		removeClass(searchDetail,"visitor");
	}

	//初始化宿舍全景
	var shusheItem = document.getElementsByClassName("shushe-item");

	for (var i = shusheItem.length - 1; i >= 0; i--) {
		removeClass(shusheItem[i],"selected");
		addClass(shusheItem[numberOfShushe],"selected");
	};

	shusheObj.loadPanoramaShushe(numberOfShushe);

	
	//宿舍按钮监听事件
	for (var i = shusheItem.length - 1; i >= 0; i--) {
		shusheItem[i].num=i;
		shusheItem[i].onclick = function(){
			if(!hasClass(this,"selected")){
				for (var i = shusheItem.length - 1; i >= 0; i--) {
					removeClass(shusheItem[i],"selected");
					addClass(this,"selected");
				};

				shusheObj.loadPanoramaShushe(this.num);
			}
		}
	}
}


var shusheObj = (function(){
	var loaded = false;

	var sidesList = [
		[
		  {
		    url: 'images/panorama/wushannew/right.jpg',
		    position: [ -512, 0, 0 ],
		    rotation: [ 0, Math.PI / 2, 0 ]
		  },
		  {
		    url: 'images/panorama/wushannew/left.jpg',
		    position: [ 512, 0, 0 ],
		    rotation: [ 0, -Math.PI / 2, 0 ]
		  },
		  {
		    url: 'images/panorama/wushannew/top.jpg',
		    position: [ 0,  512, 0 ],
		    rotation: [ Math.PI / 2, 0, Math.PI ]
		  },
		  {
		    url: 'images/panorama/wushannew/bottom.jpg',
		    position: [ 0, -512, 0 ],
		    rotation: [ - Math.PI / 2, 0, Math.PI ]
		  },
		  {
		    url: 'images/panorama/wushannew/front.jpg',
		    position: [ 0, 0,  512 ],
		    rotation: [ 0, Math.PI, 0 ]
		  },
		  {
		    url: 'images/panorama/wushannew/back.jpg',
		    position: [ 0, 0, -512 ],
		    rotation: [ 0, 0, 0 ]
		  }
		],
		[
		  {
		    url: 'images/panorama/qilin4/right.jpg',
		    position: [ -512, 0, 0 ],
		    rotation: [ 0, Math.PI / 2, 0 ]
		  },
		  {
		    url: 'images/panorama/qilin4/left.jpg',
		    position: [ 512, 0, 0 ],
		    rotation: [ 0, -Math.PI / 2, 0 ]
		  },
		  {
		    url: 'images/panorama/qilin4/top.jpg',
		    position: [ 0,  512, 0 ],
		    rotation: [ Math.PI / 2, 0, Math.PI ]
		  },
		  {
		    url: 'images/panorama/qilin4/bottom.jpg',
		    position: [ 0, -512, 0 ],
		    rotation: [ - Math.PI / 2, 0, Math.PI ]
		  },
		  {
		    url: 'images/panorama/qilin4/front.jpg',
		    position: [ 0, 0,  512 ],
		    rotation: [ 0, Math.PI, 0 ]
		  },
		  {
		    url: 'images/panorama/qilin4/back.jpg',
		    position: [ 0, 0, -512 ],
		    rotation: [ 0, 0, 0 ]
		  }
		],
		[
		  {
		    url: 'images/panorama/qilin6/right.jpg',
		    position: [ -512, 0, 0 ],
		    rotation: [ 0, Math.PI / 2, 0 ]
		  },
		  {
		    url: 'images/panorama/qilin6/left.jpg',
		    position: [ 512, 0, 0 ],
		    rotation: [ 0, -Math.PI / 2, 0 ]
		  },
		  {
		    url: 'images/panorama/qilin6/top.jpg',
		    position: [ 0,  512, 0 ],
		    rotation: [ Math.PI / 2, 0, Math.PI ]
		  },
		  {
		    url: 'images/panorama/qilin6/bottom.jpg',
		    position: [ 0, -512, 0 ],
		    rotation: [ - Math.PI / 2, 0, Math.PI ]
		  },
		  {
		    url: 'images/panorama/qilin6/front.jpg',
		    position: [ 0, 0,  512 ],
		    rotation: [ 0, Math.PI, 0 ]
		  },
		  {
		    url: 'images/panorama/qilin6/back.jpg',
		    position: [ 0, 0, -512 ],
		    rotation: [ 0, 0, 0 ]
		  }
		],
		[
		  {
		    url: 'images/panorama/huashan4/right.jpg',
		    position: [ -512, 0, 0 ],
		    rotation: [ 0, Math.PI / 2, 0 ]
		  },
		  {
		    url: 'images/panorama/huashan4/left.jpg',
		    position: [ 512, 0, 0 ],
		    rotation: [ 0, -Math.PI / 2, 0 ]
		  },
		  {
		    url: 'images/panorama/huashan4/top.jpg',
		    position: [ 0,  512, 0 ],
		    rotation: [ Math.PI / 2, 0, Math.PI ]
		  },
		  {
		    url: 'images/panorama/huashan4/bottom.jpg',
		    position: [ 0, -512, 0 ],
		    rotation: [ - Math.PI / 2, 0, Math.PI ]
		  },
		  {
		    url: 'images/panorama/huashan4/front.jpg',
		    position: [ 0, 0,  512 ],
		    rotation: [ 0, Math.PI, 0 ]
		  },
		  {
		    url: 'images/panorama/huashan4/back.jpg',
		    position: [ 0, 0, -512 ],
		    rotation: [ 0, 0, 0 ]
		  }
		]
	];

	function loadPanoramaShushe(num){
		if(!loaded)
			dynamicLoadJs("js/three.min.js",dynamicLoadJs,"js/renderers/CSS3DRenderer.js",initPanoramaShushe,num);
		else
			initPanoramaShushe(num);
	}

	function initPanoramaShushe(num){

		console.log(num);
		var shushe = document.getElementById("shushe");

		var camera, scene, renderer;
		var geometry, material, mesh;
		var target = new THREE.Vector3();

		var targetWidth = shushe.offsetWidth,
		  	targetHeight = shushe.offsetHeight;;

		var lon = 90, lat = 0;
		var phi = 0, theta = 0;

		var touchX, touchY;

		init();
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 75, targetWidth / targetHeight, 1, 1000 );

			scene = new THREE.Scene();

			var sides = sidesList[num];

			for ( var i = 0; i < sides.length; i ++ ) {

			  var side = sides[ i ];

			  var element = document.createElement( 'img' );
			  element.width = 1026; // 2 pixels extra to close the gap.
			  element.src = side.url;

			  var object = new THREE.CSS3DObject( element );
			  object.position.fromArray( side.position );
			  object.rotation.fromArray( side.rotation );
			  scene.add( object );

			}

			renderer = new THREE.CSS3DRenderer();
			renderer.setSize( targetWidth, targetHeight );

			shushe.innerHTML ="";
			shushe.appendChild( renderer.domElement );

			shushe.addEventListener( 'mousedown', onDocumentMouseDown, false );
			shushe.addEventListener( 'mousewheel', onDocumentMouseWheel, false );

			shushe.addEventListener( 'touchstart', onDocumentTouchStart, false );
			shushe.addEventListener( 'touchmove', onDocumentTouchMove, false );

			shushe.addEventListener( 'resize', onWindowResize, false );

		}

		function onWindowResize() {
			event.stopPropagation();

			camera.aspect = targetWidth / targetHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( targetWidth, targetHeight );

		}

		function onDocumentMouseDown( event ) {
			event.stopPropagation();

			event.preventDefault();

			document.addEventListener( 'mousemove', onDocumentMouseMove, false );
			document.addEventListener( 'mouseup', onDocumentMouseUp, false );

		}

		function onDocumentMouseMove( event ) {
			event.stopPropagation();

			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

			lon -= movementX * 0.1;
			lat += movementY * 0.1;

		}

		function onDocumentMouseUp( event ) {
			event.stopPropagation();

			document.removeEventListener( 'mousemove', onDocumentMouseMove );
			document.removeEventListener( 'mouseup', onDocumentMouseUp );

		}

		function onDocumentMouseWheel( event ) {
			event.stopPropagation();

			camera.fov -= event.wheelDeltaY * 0.05;
			camera.updateProjectionMatrix();

		}

		function onDocumentTouchStart( event ) {
			event.stopPropagation();

			event.preventDefault();

			var touch = event.touches[ 0 ];

			touchX = touch.screenX;
			touchY = touch.screenY;

		}

		function onDocumentTouchMove( event ) {
			event.stopPropagation();

			event.preventDefault();

			var touch = event.touches[ 0 ];

			lon -= ( touch.screenX - touchX ) * 0.1;
			lat += ( touch.screenY - touchY ) * 0.1;

			touchX = touch.screenX;
			touchY = touch.screenY;

		}

		function animate() {

			requestAnimationFrame( animate );

			//  lon +=  0.1;
			lat = Math.max( - 85, Math.min( 85, lat ) );
			phi = THREE.Math.degToRad( 90 - lat );
			theta = THREE.Math.degToRad( lon );

			target.x = Math.sin( phi ) * Math.cos( theta );
			target.y = Math.cos( phi );
			target.z = Math.sin( phi ) * Math.sin( theta );

			camera.lookAt( target );

			renderer.render( scene, camera );

		}
	}


	return {
		"loadPanoramaShushe": loadPanoramaShushe
	}

}());



/* end search */


