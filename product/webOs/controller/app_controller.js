
var app = (function(){
	
	var root = $(".main-screen");	
	
	var openning = false;
	
	var AppObj = function(appInfo){
		this.appInfo = appInfo;
		this.started = true;
		this.opacity = 1;		
		
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
	
	
	
	function addApp(appObj){
			
		root.appendChild(appObj.template());
			
		appObj.show();
		
	}
	
	function openApp(appInfo){
		if(!openning){
			openning = true;
			var appObj = new AppObj(appInfo);
			
			process.enProcess(appObj);
		}
	}
	
	return {
		open : openApp,
		add : addApp,
		changeOpenning : function(){
			openning = false;
		}
	}
	
}());
