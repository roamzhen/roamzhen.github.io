
(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([],factory);
  } else {
    root.webrtc = factory();
  }
}(this, function () {
  /*
  * webRtc wrapper
  *
  */
  var webrtc = {};

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

  webrtc.useable = function () {
    if (navigator.getUserMedia) {
      return true;
    } else {
      return false;
    }
  }

  webrtc.init = function (vid, canvas, option) {
    if(webrtc.useable) {
      var videoSelector = (option) ? (option) : ({video: true});
      console.log(videoSelector);
      if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
        var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
        if (chromeVersion < 20) {
          videoSelector = "video";
        }
      };

      navigator.getUserMedia(videoSelector, function( stream ) {
        if (vid.mozCaptureStream) {
          vid.mozSrcObject = stream;
        } else {
          vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
        }
        vid.play();
      }, function() {
        alert('init fail');
      });

    }
  }


  return webrtc;
}));