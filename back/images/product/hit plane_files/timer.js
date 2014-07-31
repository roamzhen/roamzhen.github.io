function timer(){
			if(playGame){
				scoreTimeout = setTimeout(function(){
					if(speedFlag){
						score+=2;
					}else{
						score++;
					}
					uiScore.html(score);
					if(score % 5 == 0){
						numAsteroids += 10;
					};

					if(score % 5 == 0){
						var x = Math.floor(Math.random()*canvasWidth);
						var y = -canvasHeight - 22/2 - Math.floor(Math.random()*canvasHeight);
						var vY = 5 + (Math.random()*5);
						var type = Math.floor(1+Math.random()*2);

						item.push(new Item(x,y,0,vY,30,30,type));
					}
					timer();
				},1000);
			};
		};