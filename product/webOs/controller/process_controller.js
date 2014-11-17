
var process = (function(){
	
	var root = $(".main-screen");
	var processManager = $(".g-process-management");
	var processList = $(".u-process-list");
	
	function Process(){
		this.processes = new Array();	
	}
	
	function processItemTemplate(obj){
		var processObj = {};
		
		var processPcb = {
			state :"running",
			
		};
		
		processObj.pcb = processPcb;
		processObj.sourceApp = obj;
		
		return processObj;
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
		
		var processObj = processItemTemplate(obj);
		
		this.processes.push(processObj);
		
		app.add(obj);
		
	}
	
	Process.prototype.kill = function(dom){
		
		var matchItem = false;
		var matchIndex = 0;
		
		for(var i=0;i<this.processes.length;i++){
			if(this.processes[i].sourceApp.appInfo.appId === parseInt(dom.getAttribute("appid"))){
				matchItem = this.processes[i];
				matchIndex = i;
			}
		}
		
		if(matchItem){
			processItemHide(dom);
			root.removeChild(matchItem.sourceApp.node);
			this.processes.splice(matchIndex,1);
		}
		
	}
	
	Process.prototype.changeState = function(dom){
		
		var matchItem = false;
		var matchIndex = 0;
		
		for(var i=0;i<this.processes.length;i++){
			if(this.processes[i].sourceApp.appInfo.appId === parseInt(dom.getAttribute("appid"))){
				matchItem = this.processes[i];
				matchIndex = i;
			}
		}
		
		if(matchItem){
			var stateFlag = (matchItem.pcb.state=="running");
			var stateDom = dom.getElementsByClassName("g-process-item-status")[0];
		
			stateDom.removeClass(matchItem.pcb.state);
			matchItem.pcb.state = (stateFlag)?"sleep":"running";
			stateDom.addClass(matchItem.pcb.state);
			
			if(stateFlag){
				matchItem.sourceApp.hide();
			}else{
				matchItem.sourceApp.show();
			}
		}
		
	}
	
	Process.prototype.enProcess = function(obj){
		
		var matchItem = false;
		
		for(var i=0;i<this.processes.length;i++){
			if(this.processes[i].sourceApp.appInfo.appId === obj.appInfo.appId){
				matchItem = this.processes[i];
			}
			
		}
		
		if(!matchItem){
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
		for(var i=this.processes.length-1;i>=0;i--){
			processList.appendChild(processManageItem(this.processes[i]));
		}
		
		processManager.fadeIn();
	}
	
	function processManageItem(processObj){
		var dom = document.createElement("div");
		dom.className = "u-process-item";
		dom.setAttribute("appid",processObj.sourceApp.appInfo.appId);
		
		var status = processObj.pcb.state;
		
		dom.innerHTML = "<img class='g-process-item-icon' src='"+processObj.sourceApp.appInfo.iconurl+"' />"+
						"<p class='g-process-item-name'>"+processObj.sourceApp.appInfo.name+"</p>"+
						"<div class='g-process-item-status "+status+"'></div>";
		
		dom.addEventListener("touchstart",processItemTouchEvent.handler);
		dom.addEventListener("touchmove",processItemTouchEvent.handler);
		dom.addEventListener("touchend",processItemTouchEvent.handler);
		
		return dom;
	}
	
	var processItemTouchEvent = (function(){
		var fromX = 0,
			lastX = 0;
		
		var movePre = false;
		
		var targetNode;
		
		function getTargetItem(target){
			if(target.hasClass("u-process-item")){
				return target;
			}else{
				return getTargetItem(target.parentNode);
			}
		}
		
		function handler(e){
			
			if(!movePre){
				switch(e.type){
					case "touchstart":
						fromX = e.touches[0].clientX;
						lastX = e.touches[0].clientX;
						
						targetNode = getTargetItem(event.target);
						
						break;
					case "touchmove":
						if(Math.abs(lastX - fromX)>15)
							event.preventDefault();
						lastX = e.touches[0].clientX;
						setPosition(targetNode,lastX-fromX);
						
						break;
					case "touchend":
						if(lastX - fromX > 100){
							addTransition(targetNode);
							setPosition(targetNode,targetNode.offsetWidth+10);
							setTimeout((function(targetNode){
								return function(){
									process.kill(targetNode);
								}
							}(targetNode)),300);
						}else if(lastX - fromX < -100){
							addTransition(targetNode);
							setPosition(targetNode,0);
							process.changeState(targetNode);
						}else{
							addTransition(targetNode);
							setPosition(targetNode,0);
						}
						
						targetNode = null;
						
						break;
				};	
			}
			
		}
		
		
		
		return {
			handler : handler,
			changeMove : function(){
				movePre = false;
			}
		}
	}());
	
	/* tools function */
	function setPosition(node,left){
		node.style[TRANSFORM] = "translate3d("+left+"px, 0, 0)";
	}
	
	function addTransition(node){
		
		node.style[TRANSITION] = TRANSFORM_CSS + '.25s ease-in-out';
		
		setTimeout(function(){
			node.style[TRANSITION] = 'none';
			processItemTouchEvent.changeMove();
		},300);
		
	}
	
	function processItemHide(node){
		node.style[TRANSITION] = 'height .25s ease-in-out, magrin .25s ease-in-out';
		node.style['height'] = "0px";
		node.style['margin'] = "0px";
		
		setTimeout(function(){
			processList.removeChild(node);
		},300);
		
	}
	
	function cleanTransitions(node){
		node.style[TRANSITION]= 'none';
	}
	
	return new Process();
}());

