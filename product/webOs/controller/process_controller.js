
var Process = (function(){
	
	var root = $(".main-screen");
	var processManager = $(".g-process-management");
	var processList = $(".u-process-list");
	
	function Process(){
		this.processes = new Array();	
	}
	
	Process.prototype.getLength = function(){
		return this.processes.length;
	}
	
	Process.prototype.hide = function(){
		for(var i=0;i<this.processes.length;i++){
			this.processes[i].pcb.state = "sleep";
			this.processes[i].sourceApp.hide();
		}
	}
	
	Process.prototype.create = function(obj){
		var processObj = {};
		
		var processPcb = {
			state :"running",
			
		};
		
		processObj.pcb = processPcb;
		processObj.sourceApp = obj;
		
		this.processes.push(processObj);
		
		app.add(obj);
		
	}
	
	Process.prototype.enProcess = function(obj){
		
		var created = false;
		var matchItem = false;
		
		for(var i=0;i<this.processes.length;i++){
			if(this.processes[i].sourceApp.appInfo.appId === obj.appInfo.appId){
				created = true;
				matchItem = this.processes[i];
			}
			
		}
		
		if(!created){
			this.create(obj);
		}else{
			matchItem.sourceApp.show();
		}
		setTimeout(function(){
			app.changeOpenning();
		},300);
		
	}
	
	Process.prototype.processManagement = function(){
		processList.innerHTML = "";
		
		
		/* add HomeBtn */
		var homeBtn = document.createElement("div");
		homeBtn.className = "u-process-item";
		
		homeBtn.innerHTML = "<img class='g-process-item-icon' src='../resources/images/home-btn.png' /><p class='g-process-item-name'>Back To Menu</p>";
		
		processList.appendChild(homeBtn);
		$$.bind(homeBtn,TAD,function(){
			processManager.fadeOut(300);
		});
		
		/* add Each Item */
		for(var i=0;i<this.processes.length;i++){
			processList.appendChild(processManageItem(this.processes[i]));
		}
		
		processManager.fadeIn();
	}
	
	function processManageItem(processObj){
		var dom = document.createElement("div");
		dom.className = "u-process-item";
		
		dom.innerHTML = "<img class='g-process-item-icon' src='"+processObj.sourceApp.appInfo.iconurl+"' />"+
						"<p class='g-process-item-name'>"+processObj.sourceApp.appInfo.name+"</p>";
		
		
		return dom;
	}
	
	
	return Process;
}());

var process = new Process();
