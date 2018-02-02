var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GlobalStage = (function (_super) {
    __extends(GlobalStage, _super);
    function GlobalStage() {
        var _this = _super.call(this) || this;
        /**
         * 事件记录变量，都已毫秒为单位
         */
        _this.startTime = 0;
        _this.endTime = 0;
        _this.durationTime = 0;
        _this.longTimeTap = 1000; // 按住超过1S看做长按事件
        _this.touchBeginTime = null;
        _this.camaraState = {
            x: 0,
            y: 0
        };
        /**
         * 心形形状，尺寸参数
         */
        _this.heartWidthMax = 100;
        _this.heartWidthMin = 60;
        _this.heartHeightMax = 150;
        _this.heartHeightMin = 80;
        _this.minScale = 0.6;
        _this.currentScale = 1;
        /**
         * 桌子形状，尺寸参数
         */
        _this.tableWidth = 190;
        _this.tableHeight = 178;
        _this.tableIndex = 0;
        /**
         * 功能记录变量，待添加注释
         */
        _this.mainLine = 0;
        _this.moveDirection = 1;
        _this.angleSqrt = {
            x: Math.cos(Math.PI / 6),
            y: Math.sin(Math.PI / 6)
        };
        _this.sqrt3 = Math.sqrt(3);
        _this.animating = false;
        _this.touchBegined = false;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    GlobalStage.prototype.onAddToStage = function (event) {
        this.tableGroup = new egret.DisplayObjectContainer();
        this.lineGroup = new egret.DisplayObjectContainer();
        this.initGame();
        var imgLoader = new egret.ImageLoader;
        imgLoader.once(egret.Event.COMPLETE, this.imgLoadHandler, this);
        imgLoader.load("resource/assets/man1.png");
        this.startCreateScene();
        this.addStageEventListener();
    };
    GlobalStage.prototype.initGame = function () {
        var that = this;
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        this.heartState = {
            x: stageW / 2,
            y: stageH * 4 / 5,
            radius: 30
        };
        this.tableNow = {
            x: stageW / 2,
            y: stageH * 4 / 5,
            radius: 20
        };
        if (that.heart && that.heart.x && that.heart.y) {
            console.log('Fail and back');
            this.heart.skewY = 0;
            var tween = egret.Tween.get(this.heart);
            // 补间动画
            tween.to({
                x: that.heartState.x,
                y: that.heartState.y
            }, 350);
        }
        /**
         * 初始化参数
         */
        this.mainLine = 0;
        this.moveDirection = 1;
        /**
         * 清空类
         */
        this.tableGroup.removeChildren();
        this.lineGroup.removeChildren();
        this.addTabble();
    };
    /**
     * 绑定场景事件
     */
    GlobalStage.prototype.addStageEventListener = function () {
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.stageEventHandler, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stageEventHandler, this);
    };
    /**
     * 创建主要场景界面
     * Create scene interface
     */
    GlobalStage.prototype.startCreateScene = function () {
        this.addChild(this.tableGroup);
        this.addChild(this.lineGroup);
    };
    /**
     * 图像场景增加
     */
    GlobalStage.prototype.imgLoadHandler = function (evt) {
        /**
         * 心形相关
         */
        var bmd = evt.currentTarget.data;
        /// 将已加载完成的图像显示出来
        this.heart = new egret.Bitmap(bmd);
        this.heart.width = this.heartWidthMax;
        this.heart.height = this.heartHeightMax;
        // 设定定位基准
        this.heart.anchorOffsetX = this.heartWidthMax / 2;
        this.heart.anchorOffsetY = this.heartHeightMax;
        this.heart.x = this.heartState.x;
        this.heart.y = this.heartState.y;
        this.addChild(this.heart);
    };
    GlobalStage.prototype.Calculator = function (move) {
        var tableNext = this.tableNext;
        var moveDistanceX = this.angleSqrt.x * move;
        var moveDistanceY = this.angleSqrt.y * move;
        switch (this.moveDirection) {
            case 0:
                this.heartState.x = this.tableNow.x - moveDistanceX;
                break;
            case 1:
                this.heartState.x = this.tableNow.x + moveDistanceX;
                break;
            default:
                break;
        }
        this.heartState.y = this.tableNow.y - moveDistanceY;
        if (move > tableNext.targetMin && move < tableNext.targetMax) {
            this.mainLine = this.mainLine + move;
            this.tableNow = {
                x: this.tableNext.x,
                y: this.tableNext.y,
                radius: this.tableNext.radius
            };
            var nextCamaraX = void 0;
            if (this.moveDirection === 0) {
                nextCamaraX = this.camaraState.x + moveDistanceX;
            }
            else {
                nextCamaraX = this.camaraState.x - moveDistanceX;
            }
            if (this.heartState.y + this.camaraState.y > this.stage.stageHeight * 3 / 5) {
                this.tweenCamara(this.camaraState.x, this.camaraState.y, nextCamaraX, this.camaraState.y);
            }
            else {
                this.tweenCamara(this.camaraState.x, this.camaraState.y, nextCamaraX, this.camaraState.y + moveDistanceY);
            }
            // 结束后随机方向
            this.moveDirection = Math.round(Math.random());
            if (this.moveDirection === 0) {
                this.heart.skewY = -180;
            }
            else {
                this.heart.skewY = 0;
            }
            this.addTabble();
        }
        else {
            var that = this;
            setTimeout(function () {
                that.restartGame();
            }, 700);
        }
    };
    GlobalStage.prototype.restartGame = function () {
        this.initGame();
        this.tweenCamara(this.camaraState.x, this.camaraState.y, 0, 0);
    };
    GlobalStage.prototype.addTabble = function () {
        var tableNow = this.tableNow;
        var nextTableRadius = Math.round(Math.random() * 30) + 40;
        var nextTableDistance = Math.round(Math.random() * 100 + 40) + tableNow.radius + nextTableRadius + nextTableRadius / 2;
        var nextX = (this.moveDirection === 0) ? tableNow.x - nextTableDistance * this.angleSqrt.x : tableNow.x + nextTableDistance * this.angleSqrt.x;
        this.tableNext = {
            x: nextX,
            y: tableNow.y - nextTableDistance * this.angleSqrt.y,
            radius: nextTableRadius,
            distance: nextTableDistance,
            targetMin: nextTableDistance - nextTableRadius,
            targetMax: nextTableDistance + nextTableRadius
        };
        this.loadTable(this.tableNext.x, this.tableNext.y, this.tableNext.radius);
        var shp = new egret.Shape();
        shp.graphics.lineStyle(2, 0x00ff00);
        shp.graphics.moveTo(this.tableNow.x, this.tableNow.y);
        shp.graphics.lineTo(this.tableNext.x, this.tableNext.y);
        shp.graphics.endFill();
        this.lineGroup.addChild(shp);
        var shp2 = new egret.Shape();
        shp2.graphics.lineStyle(2, 0x000000);
        if (this.moveDirection === 1) {
            shp2.graphics.moveTo(this.tableNow.x + this.tableNext.targetMin * this.angleSqrt.x, this.tableNow.y - this.tableNext.targetMin * this.angleSqrt.y);
            shp2.graphics.lineTo(this.tableNow.x + this.tableNext.targetMax * this.angleSqrt.x, this.tableNow.y - this.tableNext.targetMax * this.angleSqrt.y);
        }
        else {
            shp2.graphics.moveTo(this.tableNow.x - this.tableNext.targetMin * this.angleSqrt.x, this.tableNow.y - this.tableNext.targetMin * this.angleSqrt.y);
            shp2.graphics.lineTo(this.tableNow.x - this.tableNext.targetMax * this.angleSqrt.x, this.tableNow.y - this.tableNext.targetMax * this.angleSqrt.y);
        }
        shp2.graphics.endFill();
        this.lineGroup.addChild(shp2);
        var shp3 = new egret.Shape();
        shp3.x = this.tableNext.x;
        shp3.y = this.tableNext.y;
        shp3.graphics.lineStyle(1, 0x00ff00);
        shp3.graphics.drawArc(0, 0, this.tableNext.radius, 0, Math.PI * 2, true);
        this.lineGroup.addChild(shp3);
    };
    GlobalStage.prototype.loadTable = function (x, y, r) {
        var _this = this;
        var imgLoader = new egret.ImageLoader;
        imgLoader.once(egret.Event.COMPLETE, function (evt) {
            var bmd = evt.currentTarget.data;
            _this.table = new egret.Bitmap(bmd);
            _this.table.width = 2 * _this.sqrt3 * r + r;
            _this.table.height = _this.table.width / 190 * 178;
            _this.table.x = x - _this.table.width / 2;
            _this.table.y = y - r - r / 3;
            _this.tableGroup.addChild(_this.table);
            _this.tableGroup.setChildIndex(_this.table, 0);
        }, this);
        imgLoader.load("resource/assets/table.png");
    };
    /**
     * 场景点击事件
     */
    GlobalStage.prototype.stageEventHandler = function (e) {
        var _this = this;
        var tm;
        if (!this.animating) {
            switch (e.type) {
                case egret.TouchEvent.TOUCH_BEGIN:
                    tm = new Date();
                    this.startTime = tm.getTime();
                    this.touchBeginTime = setInterval(function () { _this.longPress(); }, 17);
                    this.touchBegined = true;
                    break;
                case egret.TouchEvent.TOUCH_END:
                    if (this.touchBegined) {
                        tm = new Date();
                        this.endTime = tm.getTime();
                        this.countTime();
                        clearInterval(this.touchBeginTime);
                        this.touchBegined = false;
                    }
                    break;
            }
        }
    };
    /**
     *  心形缩小
     */
    GlobalStage.prototype.heartTransformation = function () {
        if (this.currentScale <= this.minScale) {
            return;
        }
        else {
            this.currentScale = this.currentScale - 0.015;
            this.heart.scaleX = this.currentScale;
            this.heart.scaleY = this.currentScale;
        }
    };
    GlobalStage.prototype.longPress = function () {
        // 心形自身图形变换（缩小）和长按事件成正向关系
        this.heartTransformation();
    };
    /**
     * 根据起点和重点坐标，做心跳的补间动画
     */
    GlobalStage.prototype.tween = function (startX, startY, endX, endY) {
        var that = this;
        this.animating = true;
        var tween = egret.Tween.get(this.heart);
        // 中间点
        var midSite = {
            x: (startX + endX) / 2,
            y: (startY + endY) / 2,
        };
        // 补间动画
        tween.to({
            x: midSite.x,
            y: Math.min(startY, endY) - 60,
            scaleX: 0.8,
            scaleY: 0.8
        }, 350).to({
            x: endX,
            y: endY,
            scaleX: 1,
            scaleY: 1
        }, 350);
        setTimeout(function () {
            that.animating = false;
        }, 700);
    };
    GlobalStage.prototype.tweenCamara = function (startX, startY, endX, endY) {
        var tween = egret.Tween.get(this);
        // 中间点
        var midSite = {
            x: (startX + endX) / 2,
            y: (startY + endY) / 2,
        };
        // 补间动画
        tween.to({
            x: midSite.x,
            y: Math.min(startY, endY),
        }, 350).to({
            x: endX,
            y: endY
        }, 350);
        this.camaraState.x = endX;
        this.camaraState.y = endY;
    };
    /**
     * 计算长按事件
     */
    GlobalStage.prototype.countTime = function () {
        // ms 
        this.durationTime = this.endTime - this.startTime;
        this.durationTime2mainLine(this.durationTime);
        this.currentScale = 1;
        this.clearTime();
    };
    /**
     * 清除时间记录
     */
    GlobalStage.prototype.clearTime = function () {
        this.endTime = 0;
        this.startTime = 0;
    };
    /**
     * 长按事件转换为距离
     */
    GlobalStage.prototype.durationTime2mainLine = function (durationTime) {
        var move = Math.round(durationTime / 3);
        var preX = this.heartState.x, preY = this.heartState.y;
        this.Calculator(move);
        this.tween(preX, preY, this.heartState.x, this.heartState.y);
    };
    /**
     * tools
     */
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    GlobalStage.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return GlobalStage;
}(egret.DisplayObjectContainer));
__reflect(GlobalStage.prototype, "GlobalStage");
