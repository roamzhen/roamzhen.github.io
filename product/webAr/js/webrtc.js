
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

  webrtc.init = function (vid, canvas, option) {
    if(webrtc.useable) {
      var videoSelector = (option) ? (option) : ({video: true});
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

  webrtc.getAllAudioVideoDevices =  function (successCallback, failureCallback) {
     alert('meet');
    if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
        navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
    }

    if (!navigator.enumerateDevices && navigator.mediaDevices.enumerateDevices) {
        navigator.enumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator);
    }

    if (!navigator.enumerateDevices) {
        failureCallback(null, 'Neither navigator.mediaDevices.enumerateDevices NOR MediaStreamTrack.getSources are available.');
        return;
    }


    var allMdiaDevices = [];
    var allAudioDevices = [];
    var allVideoDevices = [];

    var audioInputDevices = [];
    var audioOutputDevices = [];
    var videoInputDevices = [];
    var videoOutputDevices = [];

    navigator.enumerateDevices(function(devices) {
      devices.forEach(function(_device) {
        var device = {};
        for (var d in _device) {
            device[d] = _device[d];
        }

        // make sure that we are not fetching duplicate devics
        var skip;
        allMdiaDevices.forEach(function(d) {
            if (d.id === device.id) {
                skip = true;
            }
        });

        if (skip) {
            return;
        }

        // if it is MediaStreamTrack.getSources
        if (device.kind === 'audio') {
            device.kind = 'audioinput';
        }

        if (device.kind === 'video') {
            device.kind = 'videoinput';
        }

        if (!device.deviceId) {
            device.deviceId = device.id;
        }

        if (!device.id) {
            device.id = device.deviceId;
        }

        if (!device.label) {
            device.label = 'Please invoke getUserMedia once.';
        }

        if (device.kind === 'audioinput' || device.kind === 'audio') {
            audioInputDevices.push(device);
        }

        if (device.kind === 'audiooutput') {
            audioOutputDevices.push(device);
        }

        if (device.kind === 'videoinput' || device.kind === 'video') {
            videoInputDevices.push(device);
        }

        if (device.kind.indexOf('audio') !== -1) {
            allAudioDevices.push(device);
        }

        if (device.kind.indexOf('video') !== -1) {
            allVideoDevices.push(device);
        }

        // there is no 'videoouput' in the spec.
        // so videoOutputDevices will always be [empty]

        allMdiaDevices.push(device);
      });

      if (successCallback) {
        successCallback({
          allMdiaDevices: allMdiaDevices,
          allVideoDevices: allVideoDevices,
          allAudioDevices: allAudioDevices,
          videoInputDevices: videoInputDevices,
          audioInputDevices: audioInputDevices,
          audioOutputDevices: audioOutputDevices
        });
      }
    });
  }


  return webrtc;
}));