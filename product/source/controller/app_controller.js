
var app = (function(){
	
	var root = $(".main-screen");	
	
	
	
	var AppObj = function(appInfo){
		this.info = appInfo;
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
		var appObj = new AppObj(appInfo);
		
		appObj.show();
		
		process.enProcess(appObj);
	}
	
	function openApp(appInfo){
		loadApp(appInfo);
	}
	
	return {
		open: openApp
	}
	
}());
