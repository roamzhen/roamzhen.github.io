(function() {


	/* interact by hahn */

	var scale = 1,
		angle = 0,
	    gestureArea = $('.gesture-area')[0],
	    scaleElement = $('.scale-element')[0];

	interact(gestureArea).gesturable({
	    onstart: function (event) {
	    },
	    onmove: function (event) {
	      	scale = scale * (1 + event.ds);
	      	angle += event.da;
	      	scaleElement.style.webkitTransform = scaleElement.style.transform = 'scale(' + scale + ') rotate(' + angle + 'deg)';
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
	      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	    },
		onmove: dragMoveListener
	});

	function dragMoveListener (event) {
	    var target = event.target,
	        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,	// keep the dragged position in the data-x/data-y attributes
	        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px) ';	// translate the element

		target.setAttribute('data-x', x);	// update the posiion attributes
		target.setAttribute('data-y', y);
	}
	
	window.dragMoveListener = dragMoveListener;	// this is used later in the resizing and gesture demos

	if (mqq) {
		mqq.invoke('ui', 'webviewCanScroll', {"enable" : false});
	}
	



	/* WebRTC by roam */

	var screenWidth = document.body.clientWidth;
  var screenHeight = document.body.clientHeight;

  var videoInput = document.getElementById('vid');
  var canvasInput = document.getElementById('compare');

  var mwebrtc = new webrtc();

  mwebrtc.init(videoInput, canvasInput, {
    "video": {
      "mandatory": {
        "minWidth": screenWidth,
        "maxWidth": screenWidth,
        "minHeight": screenHeight,
        "maxHeight": screenHeight
      }
    }
  });

  window.onorientationchange = function() {
    screenWidth = document.body.clientWidth;
    screenHeight = document.body.clientHeight;

    mwebrtc.init(videoInput, canvasInput, options);
    
  };

	//拍照部分 开始
	(function(){
		var video = $("#vid")[0];
		var qqImg = new Image();
		qqImg.src = "img/babyq.gif";
		$(".btn-capture").on("click",function(){
			var canvas = document.createElement("canvas");
		    canvas.width = video.videoWidth;
		    canvas.height = video.videoHeight;
		    canvas.getContext('2d')
		       .drawImage(video, 0, 0, canvas.width, canvas.height);
		    var $qq = $(".gesture-area");
		    var x = parseInt($qq.attr("data-x")) || 0;
		    var y = parseInt($qq.attr("data-y")) || 0;
		    canvas.getContext('2d')
		       .drawImage(qqImg,x,screenHeight+y-$qq.height()*scale,$qq.width()*scale,$qq.height()*scale);
		    $(".capture-img").attr("src",canvas.toDataURL());
		    $(".capture-box").show();
		});
		
		$(".btn-recapture").on("click",function(){
			$(".capture-box").hide();
		});
	})();
	//拍照部分 结束

})();