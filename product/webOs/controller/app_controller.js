
var app = (function(){
	
	var root = $(".main-screen");	
	
	var openning = false;
	
	var AppObj = function(appInfo){
		this.appInfo = appInfo;
		this.started = true;
		this.opacity = 1;		
		
		root.appendChild(this.template());
		
	}
	
	AppObj.prototype = {
		template: function(){
			var dom  = document.createElement("div");
			dom.className = "app-window";
			
			dom.innerHTML = "";
		
			
			this.node = dom;
			
			return dom 
		},
		show : function(){
			var that = this;
			
			that.node.show();
			
			setTimeout(function(){
				that.node.addClass('show');
			},10);
			
		},
		hide : function(){
			var that = this;
			
			that.node.removeClass('show');
			
			setTimeout(function(){
				that.node.hide();
			},500);
		},
		eidtzIndex : function(zindex){
			this.zIndex = zindex;
		}
		
	};
	
	
	
	function loadApp(appInfo){
		openning = true;
		
		for(var i=0; i<process.getLength();i++){
			
		}
		var appObj = new AppObj(appInfo);
		
		appObj.show();
		
		process.enProcess(appObj);
		
		setTimeout(function(){
			app.changeOpenning();
		},300);
		
	}
	
	function openApp(appInfo){
		if(!openning)
			loadApp(appInfo);
	}
	
	return {
		open : openApp,
		changeOpenning : function(){
			openning = false;
		}
	}
	
}());
