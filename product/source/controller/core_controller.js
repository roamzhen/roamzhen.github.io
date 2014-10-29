
var process = new Process();

var os = (function(){

	var loadingScreen = $(".loading-screen"),
		mainScreen = $(".main-screen"),
		appList = $(".g-list"),
		homeBtn = $(".u-home-btn");

	function initOs(){
		$$.bind(homeBtn,TAD,homeBtnHandler);
		
	}
	
	function homeBtnHandler(e){
		if(process.getLength()!==0){
			console.log(process.list);
			process.list[process.getLength()-1].hide();
		}
	}
	

	function startOs(){
		initOs();
		loadingScreen.fadeOut(500);
		listMenu.init();
	}
	
	return {
		start: startOs,
		init: initOs
	}
}());

window.onresize = function(){
	listMenu.reinit();
}

setTimeout(os.start,1000);
