

var os = (function(){

	var loadingScreen = $(".loading-screen"),
		mainScreen = $(".main-screen"),
		appList = $(".g-list"),
		homeBtn = $(".u-home-btn"),
		homeBtnCover = homeBtn.querySelector(".u-home-btn-cover");

	var hasTadFirst = false,
		hasTadSecond = false;
	
	function initOs(){
		$$.bind(homeBtn,TAD,homeBtnHandler);
		
	}
	
	/* home btn */
	function homeBtnHandler(e){
		
		if(!hasTadFirst){
			homeBtnCover.addClass("show");
			hasTadFirst = true;
			
			setTimeout(function(){
				if(!os.getHomeBtnSecond()){
					if(process.getLength()!==0){
						process.hide();
					}
				}
				homeBtnCover.removeClass("show");
				os.changeHomeBtnFirst();
			},300);
		}else if(!hasTadSecond){
			hasTadSecond = true;
			
			process.processManagement();
			
			setTimeout(function(){
				os.changeHomeBtnSecond();
			},300);
		}
		
	}
	

	function startOs(){
		initOs();
		loadingScreen.fadeOut(500);
		listMenu.init();
	}
	
	return {
		start: startOs,
		init: initOs,
		changeHomeBtnFirst : function(){
			hasTadFirst = false;
		},
		getHomeBtnSecond : function(){
			return hasTadSecond;
		},
		changeHomeBtnSecond : function(){
			hasTadSecond = false;
		}
	}
}());

window.onresize = function(){
	listMenu.reinit();
}

setTimeout(os.start,1000);
