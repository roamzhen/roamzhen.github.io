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
var nearDis = 20;

var choiceList = document.getElementById("choice-list");

var popInfoWrap = document.getElementById("pop-info-wrap");
var popMore = document.getElementById("pop-more");
var popIcon = document.getElementById("pop-icon");

var treeList = [
	{
		"name": "人面子",
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
		"name": "塞楝",
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
		"name": "黄葛榕",
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
		"name": "王棕",
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
		"name": "荔枝",
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
		"name": "黄葛榕2",
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
	},
	{
		"name": "黄葛榕3",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=81",
		"miniPic":"images/tree/huanggerong2.jpg",
		"pos":{
			"lng": 113.361046,
			"lat": 23.160305
		},
		"pov":{
			"heading": 337,
			"pitch": -6
		}
	},
	{
		"name": "黄葛榕4",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=81",
		"miniPic":"images/tree/huanggerong2.jpg",
		"pos":{
			"lng": 113.360339,
			"lat": 23.160303
		},
		"pov":{
			"heading": 62,
			"pitch": 8
		}
	},
	{
		"name": "黄葛榕5",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=81",
		"miniPic":"images/tree/huanggerong2.jpg",
		"pos":{
			"lng": 113.360430,
			"lat": 23.160289
		},
		"pov":{
			"heading": 200,
			"pitch": 9
		}
	},
	{
		"name": "黄葛榕6",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=81",
		"miniPic":"images/tree/huanggerong2.jpg",
		"pos":{
			"lng": 113.359890,
			"lat": 23.160404
		},
		"pov":{
			"heading": 320,
			"pitch": 5
		}
	},
	{
		"name": "黄葛榕7",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=81",
		"miniPic":"images/tree/huanggerong2.jpg",
		"pos":{
			"lng": 113.359344,
			"lat": 23.160638
		},
		"pov":{
			"heading": 214,
			"pitch": 5
		}
	},
	{
		"name": "洋紫荆",
		"href": "javascript:;",
		"miniPic":"images/tree/yangzijing.jpg",
		"pos":{
			"lng": 113.359271,
			"lat": 23.160667
		},
		"pov":{
			"heading": 203,
			"pitch": 7
		}
	},
	{
		"name": "塞楝2",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=114",
		"miniPic":"images/tree/tangjiaoshu.jpg",
		"pos":{
			"lng": 113.361166,
			"lat": 23.162498
		},
		"pov":{
			"heading": 323,
			"pitch": 10
		}
	},
	{
		"name": "塞楝3",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=114",
		"miniPic":"images/tree/tangjiaoshu.jpg",
		"pos":{
			"lng": 113.361166,
			"lat": 23.162498
		},
		"pov":{
			"heading": 7,
			"pitch": 11
		}
	},
	{
		"name": "黄槿",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=114",
		"miniPic":"images/tree/huangjing.jpg",
		"pos":{
			"lng": 113.361166,
			"lat": 23.162498
		},
		"pov":{
			"heading": 44,
			"pitch": 6
		}
	},
	{
		"name": "人面子2",
		"href": "http://xy.scau.edu.cn/tree/go.asp?id=109",
		"miniPic":"images/tree/renmainzi.jpg",
		"pos":{
			"lng": 113.361166,
			"lat": 23.162498
		},
		"pov":{
			"heading": 122,
			"pitch": 5
		}
	}
	
];

var appendedList = new Array();

var nowList = new Array();


//初始化全景及地图方法
function initPanorama(){
	
	var targetlng;
	var targetlat;
	
	//初始属性
	var initPlace = new BMap.Point(113.361203,23.162477);
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
				
			if(nowList.length==0&&hideFlag){
				hideFlag = false;
				hidePopInfo();
			}
			for(var i=0;i<nowList.length;i++){
				var targetHeading = nowList[i].pov.heading;
				
				if(Math.abs(Math.floor(targetHeading-pov.heading))>10&&hideFlag){
					hideFlag = false;
					hidePopInfo();
				}
				if(Math.abs(Math.floor(targetHeading-pov.heading))<6&&showFlag){
					showFlag = false;
					showPopInfo(nowList[i]);
				}
				
			}
				
			
			/*
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
			*/
			
		}
		else if (e.type=='onposition_changed') {
			
			nowList.splice(0,nowList.length);
			for(var i=0;i<appendedList.length;i++){
				if(treeList[appendedList[i]].pos.lng==pos.lng&&treeList[appendedList[i]].pos.lat==pos.lat){
					nowList.push(treeList[appendedList[i]]);
				}
			}
			
			if(nowList.length==0&&hideFlag){
				hideFlag = false;
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
					if(i==appendedList[j])
						flag = false;
				}
				if(flag){
					choiceList.appendChild(getChoice(treeList[i],i));
					
					appendedList.push(i);
				}
			}
		}
		
	}
	
	function getDis(pos1,pos2){
		var disX = Math.abs(pos1.lng - pos2.lng)*10000;
		var disY = Math.abs(pos1.lat - pos2.lat)*10000;
		
		return Math.floor(disX*disX+ disY*disY);
		
	}
	
	function getChoice(obj,id){
		var dom = document.createElement("div");
		dom.className = "choice-item";
		dom.innerHTML = "<img class='inner-img' src='"+obj.miniPic+"' />"+
		"<span class='choice-item-title'>"+obj.name+"</span>";
		dom.setAttribute("id",id);
		
		
		dom.onclick = function(){
			var choiceListItems = choiceList.getElementsByClassName("choice-item");
			
			for(var i=0;i<choiceListItems.length;i++){
				removeClass(choiceListItems[i],"actived");
			}
			
			addClass(this,"actived");
			
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
			popMore.innerText = obj.name;
			popMore.href = obj.href;
			
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

