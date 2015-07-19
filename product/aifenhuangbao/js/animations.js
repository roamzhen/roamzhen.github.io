(function(window, undefined) {
    //动画效果
    var AnimationFrame = function() {
        this.cache = {
            animating: false,
            animationQue: [],
            coreData: [] //缓存动画数字的值
        }
        this.iOS = (function() {
            return navigator.userAgent.match(/iPhone/i) ? true : false;
        })();
    };
    AnimationFrame.prototype = {

        //数字动画前将Dom数字清零
        _dataAnimationPrepare: function($dataDom) {
            var _self = this;
            _self.cache.coreData.length = 0;
            $dataDom.each(function() {
                _self.cache.coreData.push($(this).attr("data-animation"));
                // $(this).html(0);
            });


            return this;
        },
        //数字动画
        dataAnimation: function($root) {
            var _self = this,
                $dataDom = $root.find("[data-animation]");
            _self._dataAnimationPrepare($dataDom);
            $dataDom.each(function(index) {
                var $this = $(this),
                    v = parseInt($this.html()),
                    nb = _self.cache.coreData[index],
                    time = 300,
                    step = nb / 10,
                    starter = isNaN(v) ? 0 : v,
                    startTime = (new Date()).getTime();
                if(nb == 0){
                    $this.html(nb);
                }
                if(starter != nb){
                    var timmer = function() {
                        setTimeout(function() {
                            starter += step;
                            $this.html(parseInt(starter));
                            if (starter <= nb) {
                                timmer();
                            } else {
                                $this.html(nb);
                            }

                        }, 30);
                    }
                    if (step != 0) {
                        timmer();
                    }
                }
            });
            return this;
        }
    };
    window.AnimationFrame = window.AnimationFrame ? window.AnimationFrame : AnimationFrame;
})(window);