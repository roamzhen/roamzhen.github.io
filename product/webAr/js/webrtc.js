
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



  webrtc.init = function (video, canvas, option) {
    if(webrtc.useable) {
      var cameras = [];
      var actId = null;

      // if many sources try to get the environemt-facing camera
      var go = function(video_source_id){
        var options = option;
        if (video_source_id) {
          options['video']['optional'] = [{ facingMode: "environment" }, {sourceId: video_source_id}];
        }

        navigator.getUserMedia(options, function( stream ) {
          if (window.stream) { 
            window.stream.getTracks().forEach(function(track) {
              track.stop();
            });
          }
          window.stream = stream;
          video.setAttribute('width', '100%');  
          video.setAttribute('height', '100%');
          video.style.height = '100%';
          video.style.width = '100%'; 


          document.querySelector('.btn-change-camare').addEventListener('touchstart', function(e) {
            if(cameras.length >= 2){
              var actCamare =  null;
              for(var i=0; i<cameras.length; i++) {
                if (cameras[i]['id'] === actId){
                  if(i === cameras.length-1) {
                    actId = cameras[i-1]['id'];
                    alert(actId);
                    go(actId);
                  }else {
                    actId = cameras[i+1]['id'];
                    alert(actId);
                    go(actId);
                  }


                }
              }
            }
          });

          if (video.mozCaptureStream) {
            video.mozSrcObject = stream;
          } else {
            video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
          }
          vid.play();

        }, function() {
          alert('init fail');
        });
      }

      if (window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
        MediaStreamTrack.getSources(function(source_infos) {
          var selected_source = null;
          for (var i = 0; i != source_infos.length; ++i) {
            var source_info = source_infos[i];
            if (source_info.kind === 'video') {
              cameras.push(source_info);

              if (source_info.facing && source_info.facing == "environment") {
                selected_source = source_info.id;
                actId = source_info.id;
              }
            }
          }
          go(selected_source);
        });
      }
      else {
        go();
      }

    }
  }



  return webrtc;
}));