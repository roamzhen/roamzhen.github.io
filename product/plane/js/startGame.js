function startGame(){
			uiScore.html("0");
			uiStats.show();
			
			playGame = false;
			radiusB=3;

			flag1 = true;
			flag2 = true;
			flag3 = true;
			flag4 = true;
			flag5 = true;

			speedFlag = false;
			powerFlag = false;

			armyWidth = 33;
			armyHeight = 44;

			asteroids = new Array();
			bullets = new Array();
			item = new Array();
			numAsteroids = 10;

			score = 0;
			
//			player = new Player(canvasWidth/2,canvasHeight-10);

			player = {	
						"x": canvasWidth/2,
						"y": (canvasHeight-10),
						"width": 33,
						"height" : 44,
						"halfWidth" : 16.5,
						"halfHeight" : 22,
								
						"vX" : 0,
						"vY" : 0,
								
						"moveRight" : false,
						"moveUp" : false,
						"moveLeft" :false,
								
						"leave":0,
						"kill":0
					};

			player.hitTimer = setInterval(function(){
				if(powerFlag){
					bullets.push(new Bullet(player.x,player.y,radiusB));
					bullets.push(new Bullet(player.x-radiusB*3,player.y,radiusB));
					bullets.push(new Bullet(player.x+radiusB*3,player.y,radiusB));
				}
				else{
					bullets.push(new Bullet(player.x,player.y,radiusB));
				}
			},100);
			
			for(var i = 0; i < numAsteroids; i++){
				var x = Math.floor(Math.random()*canvasWidth);
				var y = -canvasHeight - armyHeight/2 - Math.floor(Math.random()*canvasHeight);
				var vY = 5 + (Math.random()*5);
				
				asteroids.push(new Asteroid(x,y,0,vY,armyWidth,armyHeight));
			};
			
			/*
			$(window).keydown(function(e){
				var keyCode = e.keyCode;
				
				if(!playGame){
					playGame = true;
					animate();
					timer();
				};
				if(keyCode==arrowRight){
					player.moveRight = true;
				}else if(keyCode == arrowUp){
					player.moveUp = true;
				}else if(keyCode == arrowLeft){
					player.moveLeft = true;
				};
				
				if(keyCode==blank){
					if(powerFlag){
						bullets.push(new Bullet(player.x,player.y,radiusB));
						bullets.push(new Bullet(player.x-radiusB*3,player.y,radiusB));
						bullets.push(new Bullet(player.x+radiusB*3,player.y,radiusB));
					}
					else{
						bullets.push(new Bullet(player.x,player.y,radiusB));
					}
				};
			});
			
			$(window).keyup(function(e){
				var keyCode = e.keyCode;
				
				if(keyCode==arrowRight){
					player.moveRight = false;
				}else if(keyCode == arrowUp){
					player.moveUp = false;
				}else if(keyCode == arrowLeft){
					player.moveLeft = false;
				};
			});
			*/
			if(isSupportTouch){
				
				$(window).bind("touchmove",function(){

					if(!playGame){
						playGame = true;
						animate();
						timer();
					};

					// 如果这个元素的位置内只有一个手指的话
				    if (event.targetTouches.length == 1) 
				  	{
				    	var touch = event.targetTouches[0];
				      	// 把元素放在手指所在的位置
				      	player.x = touch.pageX;
				        player.y = touch.pageY;
				    }
				});
			}else{
				$("#game").bind("mousemove",function(e){
					var canvasOffset =canvas.offset();
					var canvasX = Math.floor(e.pageX-canvasOffset.left);
					var canvasY = Math.floor(e.pageY-canvasOffset.top);

					if(!playGame){
						playGame = true;
						animate();
						timer();
					};

					player.x = canvasX;
				    player.y = canvasY;

				});
			}
			animate();
		};