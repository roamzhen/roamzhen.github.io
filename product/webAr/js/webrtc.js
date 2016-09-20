
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

  var cameras = [];
  var actId = null;

  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
  window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    // Firefox 38+, Microsoft Edge, and Chrome 44+ seems having support of enumerateDevices
    navigator.enumerateDevices = function(callback) {
      navigator.mediaDevices.enumerateDevices().then(callback);
    };
  } 

  webrtc.useable = function () {
    if (navigator.getUserMedia) {
      return true;
    } else {
      return false;
    }
  }

  webrtc.renderVideo = function (video, option, video_source_id) {
    var options = option;
    if (video_source_id) {
      options['video']['optional'] = [{ facingMode: "environment" }, {sourceId: video_source_id}];
    }

    navigator.getUserMedia(options, function( stream ) {
      window.stream = stream;

      if (video.mozCaptureStream) {
        video.mozSrcObject = stream;
      } else {
        video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
      }
      video.play();

    }, function() {
      alert('getUserMedia Fail!!');
    });
  }

  webrtc.init = function (video, canvas, option) {
    var that = this;
    if(!option) {
      option = {video: true};
    }

    if (window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
      MediaStreamTrack.getSources(function(source_infos) {
        var selected_source = null;
        for (var i = 0; i != source_infos.length; ++i) {
          var source_info = source_infos[i];
          if (source_info.kind === 'video') {
            cameras.push(source_info);
            if (source_info.facing && source_info.facing != "environment") {
              selected_source = source_info.id;
              actId = source_info.id;
            }
          }
        }
        that.renderVideo(video, option, actId);
      });
    }
    else {
      that.renderVideo(video, option);
    }

    document.querySelector('.btn-change-camera').addEventListener('touchstart', function(e) {
      if(cameras.length >= 2){
 
        var foundCamera =  false;
        for(var i=0; !foundCamera && i<cameras.length; i++) {
          if (cameras[i]['id'] === actId){
            if(document.getElementById('vid').classList.contains('hor-change')){
              document.getElementById('vid').classList.remove('hor-change'); 
            }else {
              document.getElementById('vid').classList.add('hor-change');
            }

            if(i === cameras.length-1) {
              actId = cameras[i-1]['id'];
              webrtc.reinit(video, option, actId);
            }else {
              actId = cameras[i+1]['id'];
              webrtc.reinit(video, option, actId);
            }
            foundCamera = true;
          }
        }
      }
    });

  }

  webrtc.reinit = function(video, option, actId) {
    var that = this;

    if (window.stream) {
      window.stream.getTracks().forEach(function(track) {
        track.stop();
      });
    }

    if(!option) {
      option = {video: true};
    }

    that.renderVideo(video, option, actId);
  }

  return webrtc;
}));