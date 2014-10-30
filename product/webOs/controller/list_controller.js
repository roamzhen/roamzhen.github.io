var listMenu = (function(){
	var appList = $(".g-list");
	
	var appListWidth = appList.offsetWidth,
		appListHeight = appList.offsetHeight,
		appItemWidth,appItemHeight;
	
	if(document.body.offsetWidth<=480){
		appItemWidth = appListWidth /4,
		appItemHeight = appItemWidth + 20;
	}else{
		appItemWidth = 140;
		appItemHeight = 170;
	}
	
	var currentSlide = 0;
	var slideList = new Array();
	
	var colNumber = Math.floor(appListWidth/appItemWidth),
		rowNumber = Math.floor(appListHeight/appItemHeight),
		maxNumber = colNumber * rowNumber,
		step,
		iconNum = 1;
		tmpObj = {
			itemList : []
		};
	
	var touchEvent = (function(){
		var fromX = 0,
			lastX = 0;
		
		var movePre = false;
		var started = false;
		
		function goTo(slideNum,state){
			var thisSlide;
			
				
			if(!slideList[slideNum]){
				goTo(currentSlide);
			}else{
				thisSlide = slideList[slideNum];
				
				buildSlide(slideNum);
				buildSlide(slideNum + 1);
				buildSlide(slideNum - 1);
				
				if(thisSlide.node){
					addTransition(thisSlide.node);
					setPosition(thisSlide.node,0);
				}
				
				if(slideList[slideNum - 1] && slideList[slideNum - 1].node){
					
					if(currentSlide < slideNum){
						addTransition(slideList[slideNum - 1].node);
						setPosition(slideList[slideNum - 1].node,(0-appListWidth));
					}else if(state==="right"){
						addTransition(slideList[slideNum - 1].node);
						setPosition(slideList[slideNum - 1].node,(0-appListWidth));
					}
					
				}
				
				if(slideList[slideNum + 1] && slideList[slideNum + 1].node){
					if(currentSlide > slideNum){
						addTransition(slideList[slideNum + 1].node);
						setPosition(slideList[slideNum + 1].node,appListWidth);
					}else if(state==="left"){
						addTransition(slideList[slideNum + 1].node);
						setPosition(slideList[slideNum + 1].node,appListWidth);
					}
					
				}
				
			
				currentSlide = slideNum;
			}	
		}
		
		function handler(e){
			event.preventDefault();
			
			if(!movePre){
			
				switch(e.type){
					case "touchstart":
						fromX = e.touches[0].clientX;
						lastX = e.touches[0].clientX;
						break;
					case "touchmove":
						started = true;
						lastX = e.touches[0].clientX;
						setPosition(slideList[currentSlide].node,lastX-fromX);
						
						if(lastX-fromX>0&&slideList[currentSlide-1]&&slideList[currentSlide-1].node){
							setPosition(slideList[currentSlide-1].node,lastX-fromX-appListWidth);
						}else if(lastX-fromX<0&&slideList[currentSlide+1]&&slideList[currentSlide+1].node){
							setPosition(slideList[currentSlide+1].node,lastX-fromX+appListWidth);
						}
					
						break;
					case "touchend":
						setTimeout(function(){
							touchEvent.changeStarted();
						},300);
						
						if(Math.abs(lastX-fromX)<50){
							if(lastX-fromX>0){
								goTo(currentSlide,"right");
							}else if(lastX-fromX<0){
								goTo(currentSlide,"left");
							}else{
								goTo(currentSlide);
							}
						}else if(lastX-fromX>0){
							movePre = true;
							goTo(currentSlide-1);
						}else if(lastX-fromX<0){
							movePre = true;
							goTo(currentSlide+1);
						}
						
						break;
				};
			}
		}
		
		return {
			handler : handler,
			goTo : goTo,
			changeMove : function(){
				movePre = false;
			},
			getStarted : function(){
				return started;
			},
			changeStarted : function(){
				started = false;
			}
		}
	}());
	
	
	function itemTemplate(item){
		var button = document.createElement("button");
		button.className = "g-item";
		button.innerHTML = "<img class='g-item-icon' src='"+item.iconurl+"' /><div class='g-item-icon-cover'></div>'" +"<p class='g-item-title''>"+item.name+"</p>";
		
		$$.bind(button,TAD,function(){
			var cover = button.querySelector(".g-item-icon-cover");
			cover.addClass("show");
			setTimeout(function(){
				if(!touchEvent.getStarted()){
					app.open(item);
				}
				
				cover.removeClass("show");
			},200);
		});
		
		return button;
	}
	
	function slideTemplate(slide){
		var div  = document.createElement("div");
		div.className = "m-slide";
		div.innerHTML = "";
		
		for(var i=0; i<slide.itemList.length;i++){
			div.appendChild(itemTemplate(slide.itemList[i]));
		}
				
		return div;
	}
	
	function buildSlide(sliceNum){
		
		var thisSlide,s;
		
		if(!slideList[sliceNum] || slideList[sliceNum].node){
			return false;
		}
		
		thisSlide = slideList[sliceNum];
		
		s = slideTemplate(thisSlide);
		
		thisSlide.node = s;
		
		appList.appendChild(s);
		
		setPosition(s,appListWidth);
		
	}
	
	
	function initAppList(){
		
		for(var i=0,step=0; i<savedApp.length;i++){
			step++;
			
			tmpObj.itemList.push(savedApp[i]);
			
			if(step===maxNumber){
				iconNum++;
				step=0;
				slideList.push(tmpObj);
				tmpObj = {
					itemList : []
				};
			}
		}
		
		if(tmpObj.itemList.length!=0){
			slideList.push(tmpObj);
		}
		
		for(var i=0;i<iconNum;i++){
			var span = document.createElement("span");
			span.className = "g-list-bar-icon";
			if(i===0){
				span.className = "g-list-bar-icon ative";
			}
			$(".g-list-bar").appendChild(span);
		}
			
		
		/* first init */
		thisSlide = slideList[currentSlide];
		
		buildSlide(currentSlide);
		buildSlide(currentSlide + 1);
		buildSlide(currentSlide - 1);
		
		if(thisSlide.node)
			setPosition(thisSlide.node,0);
		if(slideList[currentSlide - 1] && slideList[currentSlide - 1].node)
			setPosition(slideList[currentSlide - 1].node,(0-appListWidth));
		if(slideList[currentSlide + 1] && slideList[currentSlide + 1].node)
			setPosition(slideList[currentSlide + 1].node,appListWidth);
		
		/* listener */
		$$.bind(appList,"touchstart",touchEvent.handler);
		$$.bind(appList,"touchmove",touchEvent.handler);
		$$.bind(appList,"touchend",touchEvent.handler);
		
	}
	
	/* tools function */
	function setPosition(node,left){
		node.style[TRANSFORM] = "translate3d("+left+"px, 0, 0)";
	}
	
	function addTransition(node){
		
		node.style[TRANSITION] = TRANSFORM_CSS + '.25s ease-in-out';
		
		setTimeout(function(){
			node.style[TRANSITION] = 'none';
			touchEvent.changeMove();
			
		},300);
		/*
		node.addEventListener(TRANSITION_END, function(e){
					
			e.target.style[TRANSITION] = 'none';
			touchEvent.changeMove();
			
		});
		*/
		
	}
	
	function cleanTransitions(node){
		node.style[TRANSITION]= 'none';
	}
	
	
	function reinit(){
		appList.innerHTML = "";
		
		appListWidth = appList.offsetWidth;
		appListHeight = appList.offsetHeight;
	
		if(config.isMobile){
			appItemWidth = appListWidth /4,
			appItemHeight = appItemWidth + 20;
		}else if(document.body.offsetWidth<=480){
			appItemWidth = appListWidth /4,
			appItemHeight = appItemWidth + 20;
		}else{
			appItemWidth = 140;
			appItemHeight = 170;
		}
		
		currentSlide = 0;
		slideList = new Array();
	
		colNumber = Math.floor(appListWidth/appItemWidth),
		rowNumber = Math.floor(appListHeight/appItemHeight),
		maxNumber = colNumber * rowNumber,
		step,
		iconNum = 1;
		tmpObj = {
			itemList : []
		};
		
		for(var i=0,step=0; i<savedApp.length;i++){
			step++;
			
			tmpObj.itemList.push(savedApp[i]);
			
			if(step===maxNumber){
				iconNum++;
				step=0;
				slideList.push(tmpObj);
				tmpObj = {
					itemList : []
				};
			}
		}
		
		if(tmpObj.itemList.length!=0){
			slideList.push(tmpObj);
		}
		
		$(".g-list-bar").innerHTML = "";
		for(var i=0;i<iconNum;i++){
			var span = document.createElement("span");
			span.className = "g-list-bar-icon";
			if(i===0){
				span.className = "g-list-bar-icon ative";
			}
			$(".g-list-bar").appendChild(span);
		}
			
		
		/* first init */
		thisSlide = slideList[currentSlide];
		
		buildSlide(currentSlide);
		buildSlide(currentSlide + 1);
		buildSlide(currentSlide - 1);
		
		if(thisSlide.node)
			setPosition(thisSlide.node,0);
		if(slideList[currentSlide - 1] && slideList[currentSlide - 1].node)
			setPosition(slideList[currentSlide - 1].node,(0-appListWidth));
		if(slideList[currentSlide + 1] && slideList[currentSlide + 1].node)
			setPosition(slideList[currentSlide + 1].node,appListWidth);
	}
	
	return {
		init: initAppList,
		reinit : reinit
	}
}());

