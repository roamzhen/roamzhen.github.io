function animate(){
			context.clearRect(0,0,canvasWidth,canvasHeight);
			
			
			//子弹碰撞判断
			
			var bulletsLength = bullets.length;
			outermost:
			for(var i = 0; i <bulletsLength; i++){
				var tmpBullet = bullets[i];
				
				tmpBullet.y +=tmpBullet.vY;
				
				if(tmpBullet.y - tmpBullet.radius < 0){
					bullets.splice(i,1);
					bulletsLength = bullets.length;
					continue;
				};
		
				var asteroidsLength = asteroids.length;
				for(var j = 0; j <asteroidsLength; j++){
					var tmpAsteroid = asteroids[j];
					
					//行星与子弹碰撞
					var dXb = tmpBullet.x - tmpAsteroid.x;
					var dYb = tmpBullet.y - tmpAsteroid.y;
					var distance = Math.sqrt((dXb*dXb)+(dYb*dYb));
					
					var hx = player.halfWidth/2;
					var hy = player.halfHeight/2;

					if(distance < Math.floor(Math.sqrt(hx*hx+hy*hy))){
						bullets.splice(i,1);
						asteroids.splice(j,1);
						player.kill++;
						bulletsLength = bullets.length;
						continue outermost;
					};
					
					
				};
				
			};
			
			bulletsLength = bullets.length;
			for(var i = 0; i <bulletsLength; i++){
				var tmpBullet = bullets[i];
				
				context.save();
				context.translate(tmpBullet.x-tmpBullet.radius/2,tmpBullet.y-tmpBullet.radius/2);
				context.fillStyle = "rgb(40,41,48)";
				context.beginPath();
				context.moveTo(0,0);
				context.lineTo(0,tmpBullet.radius*3);
				context.lineTo(tmpBullet.radius,tmpBullet.radius*3);
				context.lineTo(tmpBullet.radius,0);
				context.closePath();
				context.fill();
				context.restore();

			};
			
			var asteroidsLength = asteroids.length;
				for(var j = 0; j <asteroidsLength; j++){
					var tmpAsteroid = asteroids[j];
					
					if(speedFlag){
						tmpAsteroid.y +=tmpAsteroid.vY*2;
					}else{
						tmpAsteroid.y +=tmpAsteroid.vY;
					}

					if(tmpAsteroid.y + tmpAsteroid.halfHeight > canvasHeight){
						tmpAsteroid.x =Math.floor(Math.random()*canvasWidth);
						tmpAsteroid.y = -canvasHeight - tmpAsteroid.halfHeight;
						tmpAsteroid.vY = 5 + (Math.random()*5);
					};
					
					//行星与飞机碰撞
					var dX = player.x - tmpAsteroid.x;
					var dY = player.y - tmpAsteroid.y;
					var distance = Math.sqrt((dX*dX)+(dY*dY));
					
					var hx = player.halfWidth/3 + tmpAsteroid.halfWidth/3;
					var hy = player.halfHeight/3 + tmpAsteroid.halfHeight/3;

					if(speedFlag&&distance < Math.floor(Math.sqrt(hx*hx+hy*hy)*2)){
						asteroids.splice(j,1);
						player.kill++;
						asteroidsLength = asteroids.length;
						continue;
					}

					if(distance < Math.floor(Math.sqrt(hx*hx+hy*hy))){
							playGame = false;
							clearTimeout(scoreTimeout);
							uiStats.hide();
							uiComplete.show();
														
//							$(window).unbind("keydown");
//							$(window).unbind("keyup");

							if(isSupportTouch){
								$(window).unbind("touchmove");
							}else{
								$("#game").unbind("mousemove");
							}

					}
					

					context.save();
					context.translate(tmpAsteroid.x-tmpAsteroid.halfWidth,tmpAsteroid.y-tmpAsteroid.halfHeight);
					context.drawImage(armyImg,0,0);
			
					context.restore();
					
				};

			//物品碰撞逻辑
			var itemLength = item.length;
			outermostI:
			for(var i = 0; i <itemLength; i++){
				var tmpItem = item[i];
				
				if(speedFlag){
					tmpItem.y +=tmpItem.vY*2;
				}else{
					tmpItem.y +=tmpItem.vY;
				}

				if(tmpItem.y + tmpItem.halfHeight > canvasHeight){
					item.splice(i,1);
					itemLength = item.length;
					continue;
				};

				//物品与玩家碰撞
				var dXI = tmpItem.x - player.x;
				var dYI = tmpItem.y - player.y;
				var distance = Math.sqrt((dXI*dXI)+(dYI*dYI));
					
				var hx = player.halfWidth/2+tmpItem.halfWidth/2;
				var hy = player.halfHeight/2+tmpItem.halfHeight/2;

				if(distance < Math.floor(Math.sqrt(hx*hx+hy*hy))){
					if(tmpItem.type==1){
						speedFlag=true;
						setTimeout(function(){speedFlag=false;},5000);
					}else if(tmpItem.type==2){
						powerFlag = true;
						setTimeout(function(){powerFlag=false;},5000);
					}

					item.splice(i,1);
					itemLength = item.length;
					continue outermostI;
				};
				
			};


			//物品逻辑
			var itemLength = item.length;
				for(var i = 0; i <itemLength; i++){
					var tmpItem = item[i];

					if(tmpItem.type==1){
						context.save();
						context.translate(tmpItem.x-tmpItem.halfWidth,tmpItem.y-tmpItem.halfHeight);
						context.drawImage(itemSpeed,0,0);
			
						context.restore();
					}else if(tmpItem.type==2){
						context.save();
						context.translate(tmpItem.x-tmpItem.halfWidth,tmpItem.y-tmpItem.halfHeight);
						context.drawImage(itemPower,0,0);
			
						context.restore();
					}

				};
			
			//玩家逻辑
			player.vX=0;
			player.vY=0;
			
			if(player.kill>10)
			{
				player.kill=0;
				player.leave++;
			};

			if(player.leave>100 && flag1 && score<50){
				$(".gameTime").html($(".gameTime").html()+" 虐机狂魔");
				flag1=false;
			};

			if(score>100 && flag2){
				$(".gameTime").html($(".gameTime").html()+" 飞得真远");
				flag2=false;
			}

			if(score>100 && player.leave<10 && flag3){
				$(".gameTime").html($(".gameTime").html()+" 仁慈者");
				flag3=false;
			}

			if(player.leave>10 && flag4){
				$(".gameTime").html($(".gameTime").html()+" 百机斩");
				flag4=false;
			}

			if(player.leave>100 && flag5){
				$(".gameTime").html($(".gameTime").html()+" 千机斩");
				flag5=false;
			}

			/*
			
			if(player.moveRight){
				player.vX=5;
			};
			if(player.moveUp){
				player.vY=-5;

			}else{
				player.vY=5;
			};
			if(player.moveLeft){
				player.vX=-5;
			};
			player.x+=player.vX;
			player.y+=player.vY;

			*/
			
			if(player.x - player.halfWidth < 20){
				player.x = 20 + player.halfWidth;
			}else if(player.x + player.halfWidth > canvasWidth -20){
				player.x = canvasWidth -20 - player.halfWidth;
			};
			
			if(player.y - player.halfHeight <20){
				player.y = 20 + player.halfHeight;
			}else if(player.y + player.halfHeight > canvasHeight -20){
				player.y = canvasHeight -20 - player.halfHeight;
			};
			
			//画玩家
			context.save();
			context.translate(player.x-player.halfWidth,player.y-player.halfHeight);
			/*
			if(player.moveUp){
				if(speedFlag){
					context.shadowBlur = 20;
					context.shadowColor = "rgb(0,0,0)";
				}else{
					context.shadowBlur = 10;
					context.shadowColor = "rgb(0,0,0)";
				}
			}
			*/

			context.drawImage(playerImg,0,0);

			context.restore();

			while(asteroids.length < numAsteroids){
				var x = Math.floor(Math.random()*canvasWidth);
				var y = -canvasHeight - armyHeight/2 - Math.floor(Math.random()*canvasHeight);
				var vY = 5 + (Math.random()*10);
				
				asteroids.push(new Asteroid(x,y,0,vY,armyWidth,armyHeight));
			};
			
			if(numAsteroids>500)
			{
				playGame = false;
				clearTimeout(scoreTimeout);
				uiStats.hide();
				uiComplete.show();
												
//				$(window).unbind("keydown");
//				$(window).unbind("keyup");

				if(isSupportTouch){
					$(window).unbind("touchmove");
				}else{
					$("#game").unbind("mousemove");
				}

			}
			
			if(playGame){
				setTimeout(animate,33);
			};
};