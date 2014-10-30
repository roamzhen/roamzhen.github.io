

var os = (function(){

	var loadingScreen = $(".loading-screen"),
		mainScreen = $(".main-screen"),
		appList = $(".g-list"),
		homeBtn = $(".u-home-btn"),
		homeBtnCover = homeBtn.querySelector(".u-home-btn-cover");

	function initOs(){
		$$.bind(homeBtn,TAD,homeBtnHandler);
		
	}
	
	function homeBtnHandler(e){
		homeBtnCover.addClass("show");
		setTimeout(function(){
			if(process.getLength()!==0){
				process.processes[process.getLength()-1].hide();
			}
			homeBtnCover.removeClass("show");
		},300);
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
