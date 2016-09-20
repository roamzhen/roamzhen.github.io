(function() {
	
	var isInQQ = mqq?true:false;
	
	/* interact by hahn */
	if (isInQQ && mqq.QQVersion !== 0) {
		mqq.invoke('ui', 'webviewCanScroll', {"enable" : false});
	}
	
	var $targetVideo = $('#vid'),
		canvasOffset = 0,
		canvasSum = 0,
		canvasX = 0,
		canvasY = 0,
		canvasScale = 1,
		canvasAngle = 0,
		canvasCharacter = 'babyq',
		canvasEmotion = '',
		canvas = $('#preview-canvas')[0],
		ctx = canvas.getContext('2d'),
	    gestureArea = $('.preview-qqfamily')[0],
	    scaleElement = $('.preview-object')[0];

	interact(gestureArea).gesturable({
	    onstart: function (event) {
	    },
	    onmove: function (event) {
	      	canvasScale = canvasScale * (1 + event.ds);
	      	canvasAngle += event.da;

	      	scaleElement.style.webkitTransform = scaleElement.style.transform = 'scale(' + canvasScale + ') rotate(' + canvasAngle + 'deg)';
	      	dragMoveListener(event);
	    },
	    onend: function (event) {
	    }
	})
	.draggable({
		inertia: false,		// 支持惯性运动
	    autoScroll: false,	// 支持自然滚动
	    restrict: {
	      restriction: "body",
	      endOnly: false,
	      elementRect: { top: 0, left: 0, bottom: 1.9, right: 1 }
	    },
		onmove: dragMoveListener
	});

	function dragMoveListener (event) {
	    var target = event.target,
	        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,	// keep the dragged position in the data-x/data-y attributes
	        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	        canvasX = x;
	        canvasY = y;

	    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px) ';	// translate the element

		target.setAttribute('data-x', x);	// update the posiion attributes
		target.setAttribute('data-y', y);
	}
	window.dragMoveListener = dragMoveListener;	// this is used later in the resizing and gesture demos

	$('#preview-canvas').attr('width', $targetVideo.width());
	$('#preview-canvas').attr('height', $targetVideo.height());

	(function loop() {
		if (true) {
			if (canvasCharacter === 'babyq') {
				drawImage('img/babyq_current.png', 0, 0, 140, 156, 0, 0, 140/2, 156/2)	
			}
			else if (canvasCharacter === 'dov') {
				drawImage('img/dov_current.png', 0, 0, 180, 142, 0, 0, 180/2, 142/2)
			}
			else if (canvasCharacter === 'qq') {
				drawImage('img/qq_current'+canvasEmotion+'.png', 0, 0, 208, 194, 0, 0, 208/2, 194/2)	
			}
			else if (canvasCharacter === 'oscar') {
				drawImage('img/oscar_current.png', 0, 0, 124, 144, 0, 0, 124/2, 144/2)	
			}
			else if (canvasCharacter === 'qana') {
				drawImage('img/qana_current.png', 0, 0, 164, 178, 0, 0, 164/2, 178/2)	
			}
			else if (canvasCharacter === 'anko') {
				drawImage('img/anko_current.png', 0, 0, 114, 180, 0, 0, 114/2, 180/2)	
			}
		}
		requestAnimationFrame(loop);
	})()


	function drawImage (img, sx, sy, sw, sh, dx, dy, dw, dh) {
		var image = new Image();
		image.onload = function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			ctx.translate($targetVideo.width()/2-35, $targetVideo.height()/2-39);
			// ctx.fillRect(canvasX+dw/2, canvasY+dh/2, 2*canvasScale, 2*canvasScale);
			ctx.rotate(canvasAngle*Math.PI/360);
			ctx.scale(canvasScale, canvasScale);
			ctx.drawImage(image, sx, sy, sw, sh, dx+canvasX, dy+canvasY, dw, dh);
			ctx.restore();
		}
		image.src = img;
	}

	$('.role-list li').on('click', function(event) {
		canvasCharacter = $(event.target).data('name');
	})






	/* WebRTC by roam */

	var screenWidth = document.body.clientWidth;
	var screenHeight = document.body.clientHeight -110;
	var vid = document.getElementById('vid');
	var canvasInput = document.getElementById('compare');
	var overlay = document.getElementById('overlay');
	var overlayCC = overlay.getContext('2d');

	vid.width = screenWidth/4;
	vid.height = screenHeight/4;
	overlay.width = screenWidth;
	overlay.height = screenHeight;

	var mwebrtc = webrtc;

	mwebrtc.init(vid, canvasInput, {
		"video": {
		  "mandatory": {
		    "minAspectRatio": screenWidth/screenHeight,
		    "maxAspectRatio": screenWidth/screenHeight   
		  }
		}
	});

	/*********** setup of emotion detection *************/
	var emotionTag = document.querySelector('.emotion-tag');

	var ctracker = new clm.tracker({useWebGL : true});
	ctracker.init(pModel);

	vid.addEventListener('canplay', function() {
		vid.play();
		ctracker.start(vid);
		drawLoop();
	}, false);

	function drawLoop() {
		requestAnimationFrame(drawLoop);
		overlayCC.clearRect(0, 0, overlay.width, overlay.height);

		var cp = ctracker.getCurrentParameters();
		var er = ec.meanPredict(cp);
		if(er) {
		  emotionTag.innerHTML = '';
		  // if(er[0]['value'] >= 0.4) {
		  //   emotionTag.innerHTML = emotionTag.innerHTML + er[0]['emotion'] + " ";
		  // }
		  // if(er[1]['value'] >= 0.4) {
		  //   emotionTag.innerHTML = emotionTag.innerHTML + er[1]['emotion'] + " ";
		  // }
		  // if(er[2]['value'] >= 0.4) {
		  //   emotionTag.innerHTML = emotionTag.innerHTML + er[2]['emotion'] + " ";
		  // }

		  // 剔除其他因素，关注 happy
		  // if(er[0]['value'] <= 0.3 && er[1]['value']  <= 0.3 && er[2]['value']  <= 0.3 && er[3]['value'] >= 0.4) {
		  //   emotionTag.innerHTML = emotionTag.innerHTML + er[3]['emotion'] + " ";
		  // } else {
		  // 	emotionTag.innerHTML = 'analyzing';
		  // }

		  if(er[3]['value'] >= 0.3) {
		  	canvasEmotion = "_happy";
		    emotionTag.innerHTML = emotionTag.innerHTML + er[3]['emotion'] + " ";
		  } else {
		  	canvasEmotion = "";
		  	emotionTag.innerHTML = 'analyzing';
		  }

		}
	}

	var ec = new emotionClassifier();
	ec.init(emotionModel);
	var emotionData = ec.getBlank(); 


	//切换公仔 开始
	(function(){
		$(".role-list").on("click","li",function(){
			$(this).addClass("current").siblings().removeClass("current");
		});
	})();
	//切换公仔 结束



	//拍照部分 开始
	(function(){
		var $video = $("#vid"),video = $video[0];
		var qqImg = new Image();
		qqImg.src = "img/babyq.gif";
		$(".btn-capture").on("click",function(){
			var canvas = document.createElement("canvas");
			var context = canvas.getContext('2d');
		    canvas.width = video.videoWidth;
		    canvas.height = video.videoHeight;
		    if(!$video.hasClass("hor-change")){//hor-change类,没有的话表示翻转了，要做处翻转处理
		    		context.save();
		    		//以右上点为中心 向右翻转画布
				context.translate(canvas.width, 0);
			    context.scale(-1, 1);
			   	//画图
			    context.drawImage(video, 0, 0, canvas.width, canvas.height);
			    context.restore();
		    }else{
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
		    }
	       	context.drawImage($("#preview-canvas")[0], 0, 0, canvas.width, canvas.height);
		    $(".capture-img").attr("src",canvas.toDataURL());
		    $(".capture-box").show();
		    //手Q下保存照片
		    if (isInQQ) {
		    		mqq.media.saveImage({"content":$(".capture-img").attr("src")},function(data){
			    });
		    }
		});
		
		$(".btn-recapture").on("click",function(){
			$(".capture-box").hide();
		});
	})();
	//拍照部分 结束

})();