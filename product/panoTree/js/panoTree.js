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

var showFlag = true,
	hideFlag = false;

(function(){
var nearDis = 40;

var choiceList = document.getElementById("choice-list");

var popInfoWrap = document.getElementById("pop-info-wrap");
var popTitle = document.getElementById("pop-title");
var popContent = document.getElementById("pop-content");
var popMore = document.getElementById("pop-more");
var popIcon = document.getElementById("pop-icon");

var treeList = [
	{
		"id": 1,
		"name": "人面子",
		"content": "主要分布: 校园常见，集中分布在三角市黄河路两侧、嵩山住宅区。",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=109",
		"miniPic":"images/tree/renmainzi.jpg",
		"pos":{
			"lng": 113.361025,
			"lat": 23.162501
		},
		"pov":{
			"heading": 292,
			"pitch": 9
		}
	},
	{
		"id": 2,
		"name": "塞楝",
		"content": "主要分布: 巢湖路、图书馆北侧、华山学生宿舍区、六一区研究生宿舍区。",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=114",
		"miniPic":"images/tree/tangjiaoshu.jpg",
		"pos":{
			"lng": 113.361096,
			"lat": 23.162373
		},
		"pov":{
			"heading": 273,
			"pitch": 4
		}
	},
	{
		"id": 3,
		"name": "黄葛榕",
		"content": "用途:宜作园景树、庭园树、行道树。也是紫胶虫寄主树种，可供紫胶生产之用。",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=81",
		"miniPic":"images/tree/huanggerong.jpg",
		"pos":{
			"lng": 113.359714,
			"lat": 23.160472
		},
		"pov":{
			"heading": 15,
			"pitch": 5
		}
	},
	{
		"id": 4,
		"name": "王棕",
		"content": "Ps.网站无收录",
		"href": "javascript:;",
		"miniPic":"images/tree/wangzhong.jpg",
		"pos":{
			"lng": 113.359229,
			"lat": 23.160924
		},
		"pov":{
			"heading": 86,
			"pitch": 24
		}
	},
	{
		"id": 5,
		"name": "荔枝",
		"content": "主要分布:校园常见。综合行政楼西侧15棵百年古荔为从化校友会捐赠。",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=172",
		"miniPic":"images/tree/lizhi.jpg",
		"pos":{
			"lng": 113.359231,
			"lat": 23.161507
		},
		"pov":{
			"heading": 56,
			"pitch": 14
		}
	},
	{
		"id": 6,
		"name": "黄葛榕",
		"content": "用途:宜作园景树、庭园树、行道树。也是紫胶虫寄主树种，可供紫胶生产之用。",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=81",
		"miniPic":"images/tree/huanggerong2.jpg",
		"pos":{
			"lng": 113.361316,
			"lat": 23.16035
		},
		"pov":{
			"heading": 174,
			"pitch": 1
		}
	}
];

var appendedList = new Array();


//初始化全景及地图方法
function initPanorama(){
	
	var targetHeading;
	var targetPitch;
	var targetlng;
	var targetlat;
	
	//初始属性
	var initPlace = new BMap.Point(113.361166,23.162498);
	var initHead = {heading: 278.945082, pitch: -4.07999};
	
	//全景图展示
	var panorama = new BMap.Panorama('panoramaTree');
	panorama.setPosition(initPlace); //根据经纬度坐标展示全景图
	panorama.setPov(initHead);
	
	panorama.addEventListener('pov_changed', function(e){ //全景视角改变事件
		panoramaCallBack(e);
	});

	panorama.addEventListener('position_changed', function(e){ //全景图位置改变事件
		panoramaCallBack(e);
	});

	
	//全景地图展示
	var mapOption = {
			mapType: BMAP_NORMAL_MAP,
			maxZoom: 18,
			drawMargin:0,
			enableFulltimeSpotClick: true,
			enableHighResolution:true
		}
	var map = new BMap.Map("pano_map", mapOption);
	map.centerAndZoom(initPlace, 18);
	map.addTileLayer(new BMap.PanoramaCoverageLayer());
	
	for(var i=0;i<treeList.length;i++){
		var tmpMarker=new BMap.Marker(new BMap.Point(treeList[i].pos.lng,treeList[i].pos.lat));
		var tmpIcon = new BMap.Icon("images/pano-tree.png", new BMap.Size(20,20));
		tmpMarker.setIcon(tmpIcon);
		map.addOverlay(tmpMarker);
	}
	
	var marker=new BMap.Marker(initPlace);
	marker.enableDragging();
	map.addOverlay(marker);  
	
	marker.addEventListener('dragend',function(e){
		panorama.setPosition(e.point); //拖动marker后，全景图位置也随着改变
	});
	
	var getInfoBtn = document.getElementById("get-info");
	
	getInfoBtn.onclick = function(){
		var words = "pov.lng:"+panorama.getPosition().lng+"  pov.lat:"+panorama.getPosition().lat+
					"  pos.heading:"+Math.floor(panorama.getPov().heading)+"  pos.pitch:"+Math.floor(panorama.getPov().pitch);
		
		alert(words);
	}
	
// pano inner function
	function panoramaCallBack(e){ //事件回调函数
		var pos = panorama.getPosition();
		var pov = panorama.getPov();
		
		if (e.type == 'onpov_changed') { 
			//console.log("heading: " + pov.heading+" pitch:"+pov.pitch);
			
			if(targetHeading!=null&&targetPitch!=null&&targetlng==pos.lng&&targetlat==pos.lat){
				if(Math.abs(Math.floor(targetHeading-pov.heading))>10&&hideFlag){
					hideFlag = false;
					hidePopInfo();
				}
				if(Math.abs(Math.floor(targetHeading-pov.heading))<6&&showFlag){
					showFlag = false;
					showPopInfo();
				}
			}
			
		}
		else if (e.type=='onposition_changed') {
			console.log("lng: " + pos.lng+" lat:"+pos.lat);
			
			if(targetlng!=pos.lng&&targetlat!=pos.lat&&hideFlag){
				hidePopInfo();
			}
			
			checkNearItem(pos);
			
			map.setCenter(new BMap.Point(pos.lng, pos.lat));
			marker.setPosition(pos);
		}
	}

	function checkNearItem(pos){
		
		for(var i=0;i<appendedList.length;i++){
			if(getDis(pos,treeList[i].pos)>nearDis){
				var choiceListItems = choiceList.getElementsByClassName("choice-item");
				var removeDom = "";
				for(var j =0;j<choiceListItems.length;j++){
					if(choiceListItems[j].getAttribute("id")==appendedList[i])
						removeDom = choiceListItems[j];
				}
				
				choiceList.removeChild(removeDom);
				appendedList.splice(i,1);
				i--;
			}
		}
		
		for(var i=0;i<treeList.length;i++){
			var dis = getDis(pos,treeList[i].pos);
			
			if(dis<nearDis){
				var flag = true;
				for(var j=0;j<appendedList.length;j++){
					if(treeList[i].id==appendedList[j])
						flag = false;
				}
				if(flag){
					choiceList.appendChild(getChoice(treeList[i]));
					
					appendedList.push(treeList[i].id);
				}
			}
		}
		
	}
	
	function getDis(pos1,pos2){
		var disX = Math.abs(pos1.lng - pos2.lng)*10000;
		var disY = Math.abs(pos1.lat - pos2.lat)*10000;
		
		return Math.floor(disX*disX+ disY*disY);
		
	}
	
	function getChoice(obj){
		var dom = document.createElement("div");
		dom.className = "choice-item";
		dom.innerHTML = "<img class='inner-img' src='"+obj.miniPic+"' />"+
		"<span class='choice-item-title'>"+obj.name+"</span>";
		dom.setAttribute("id",obj.id);
		
		
		dom.onclick = function(){
			var choiceListItems = choiceList.getElementsByClassName("choice-item");
			
			for(var i=0;i<choiceListItems.length;i++){
				removeClass(choiceListItems[i],"actived");
			}
			
			addClass(this,"actived");
			
			targetHeading = obj.pov.heading;
			targetPitch = obj.pov.pitch;
			targetlng = obj.pos.lng;
			targetlat = obj.pos.lat;
			
			showPopInfo(obj);
			
			
			if(panorama.getPosition().lng == obj.pos.lng && panorama.getPosition().lat == obj.pos.lat){
				panorama.setPov({heading: obj.pov.heading, pitch: obj.pov.pitch});
				
			}else{
				panorama.setPosition(new BMap.Point(obj.pos.lng,obj.pos.lat));
				
				/*
				var pov = panorama.getPov();
				var changeH = obj.pov.heading-pov.heading;
				var changeP = obj.pov.pitch-pov.pitch;
				var tmpChangeAnimation = setInterval(function(){
					var pov = panorama.getPov();
					console.log(Math.abs(pov.heading-obj.pov.heading)+" "+Math.abs(pov.pitch-obj.pov.pitch));
					if(Math.abs(pov.heading-obj.pov.heading)>1&&Math.abs(pov.pitch-obj.pov.pitch)>1){
						panorama.setPov({heading:pov.heading+changeH/8,pitch:pov.pitch+changeP/8});
					}else{
						clearInterval(tmpChangeAnimation);
					}
				},33);
				*/
				
				setTimeout(function(){
					panorama.setPov({heading: obj.pov.heading, pitch: obj.pov.pitch});
				},800);
				
			}
			
		}
		
		return dom;
		
	}
	
	function showPopInfo(obj){
		
		if(obj!=undefined){
			popTitle.innerText = obj.name;
			popContent.innerText = obj.content;
			popMore.href = obj.href;
			
			popInfoWrap.style['display']= "block";
			popIcon.style['display']="block";
			
			setTimeout(function(){
				popInfoWrap.style['opacity']=1;
				popIcon.style['opacity']=1;
			},500);
		}else{
			
			popInfoWrap.style['display']= "block";
			popIcon.style['display']="block";
			
			setTimeout(function(){
				popInfoWrap.style['opacity']=1;
				popIcon.style['opacity']=1;
				
			},10);
			setTimeout(function(){
				showFlag = false;
				hideFlag = true;
			},600);
		}
	}
	
	function hidePopInfo(){
		
		popInfoWrap.style['opacity']=null;
		popIcon.style['opacity']=null;
		
		setTimeout(function(){
			popInfoWrap.style['display']= null;
			popIcon.style['display']=null;
			
			showFlag = true;
			hideFlag = false;
		},500);
	}
// end pano inner function

}



window.onload = function(){
	initPanorama();
}

}())

