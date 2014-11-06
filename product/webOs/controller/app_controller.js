
var app = (function(){
	
	var root = $(".main-screen");	
	
	var openning = false;
	
	var AppObj = function(appInfo){
		this.appInfo = appInfo;
		this.opacity = 1;	
		this.node = null;
		
	}
	
	AppObj.prototype = {
		template: function(appObj){
			var dom  = document.createElement("div");
			dom.className = "app-window";
			
			dom.innerHTML = document.getElementById(appObj.appInfo.templateId).innerHTML;
		
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
			
		root.appendChild(appObj.template(appObj));
		
		appObj.appInfo.callback();
			
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
