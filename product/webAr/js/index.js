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
    screenWidth = window.screen.availWidth;
    screenHeight = window.screen.availHeight;

    mwebrtc.init(videoInput, canvasInput, options);
  };



})();