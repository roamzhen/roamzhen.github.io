(function() {


	/* interact by hahn */
	
	if (mqq) {
		mqq.invoke('ui', 'webviewCanScroll', {"enable" : false});
	}

	var $video = $('.video-box');
	var eidtor = new mo.ImageEditor({
		id:"emotion-canvas",
		trigger: $('.role-list li'),
		container: $('#container'),
		fps: 60,
		width: $video.width(),
		height: $video.height(),
		offsetTop: $video.offset().top,
		offsetBottom: $video.offset().bottom,
	});
	
	$($('.role-list li').eq(0)).trigger('click');



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
		  // er[0]['value'] <= 0.3 && er[1]['value']  <= 0.3 && er[2]['value']  <= 0.3 && er[3]['value'] >= 0.4
		  if(er[3]['value'] >= 0.3) {
		    emotionTag.innerHTML = emotionTag.innerHTML + er[3]['emotion'] + " ";
		  } else {
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
	       	context.drawImage($("#emotion-canvas")[0], 0, 0, canvas.width, canvas.height);
		    $(".capture-img").attr("src",canvas.toDataURL());
		    $(".capture-box").show();
		    if (mqq) {
		    		mqq.media.saveImage({"content":$(".capture-img").attr("src")},function(data){
			    		alert(data.retCode);
			    });
		    }
		});
		
		$(".btn-recapture").on("click",function(){
			$(".capture-box").hide();
		});
	})();
	//拍照部分 结束

})();