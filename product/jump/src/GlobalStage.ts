
class GlobalStage extends egret.DisplayObjectContainer {

   /**
    * 事件记录变量，都已毫秒为单位
    */
   private startTime = 0;
   private endTime = 0;
   private durationTime = 0;
   private longTimeTap = 1000;  // 按住超过1S看做长按事件
   private touchBeginTime = null;

   private camaraState = {
       x: 0,
       y: 0
   };
   /**
    * 心形形状，尺寸参数
    */
   private heartWidthMax = 100;
   private heartWidthMin = 60;
   private heartHeightMax = 150;
   private heartHeightMin = 80;
   private minScale = 0.6;
   private currentScale = 1;
   private currentSmall = 0.6;
   /**
    * 桌子形状，尺寸参数
    */
   private tableWidth = 190;
   private tableHeight = 178;
   private tableIndex = 0;
   /**
    * 功能记录变量，待添加注释
    */
   private mainLine = 0;
   private moveDirection = 1;
   private heartState;
   private tableNow;
   private tableNext;
   private angleSqrt = {
       x: Math.cos(Math.PI/6),
       y: Math.sin(Math.PI/6)
   };
   private sqrt3 = Math.sqrt(3);
   
   private animating = false;
   private touchBegined = false;

   // 图形变量
   private heart:egret.Bitmap;
   private table:egret.Bitmap;

   private tableGroup: egret.DisplayObjectContainer;
   private lineGroup: egret.DisplayObjectContainer;

   public constructor() {
        super();

        this.once( egret.Event.ADDED_TO_STAGE, this.onAddToStage, this );
    }

    private onAddToStage(event:egret.Event) {
        this.tableGroup = new egret.DisplayObjectContainer();
        this.lineGroup = new egret.DisplayObjectContainer();
        
        this.initGame();

        const imgLoader:egret.ImageLoader = new egret.ImageLoader;
        imgLoader.once( egret.Event.COMPLETE, this.imgLoadHandler, this );
        imgLoader.load("resource/assets/man1.png");

        this.startCreateScene();
        this.addStageEventListener();
    }

    private initGame(): void {
        let that = this;
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        this.heartState = {
            x: stageW/2,
            y: stageH*4/5,
            radius: 30
        };
        this.tableNow = {
            x: stageW/2,
            y: stageH*4/5,
            radius: 20
        };



        if (that.heart && that.heart.x && that.heart.y) {
            console.log('Fail and back')
            this.heart.skewY = 0;

            const tween = egret.Tween.get(this.heart);
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
        
    }

    
    /**
     * 绑定场景事件
     */
    protected addStageEventListener(): void {
        this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.stageEventHandler, this );
        this.stage.addEventListener( egret.TouchEvent.TOUCH_END, this.stageEventHandler, this );
    }

    /**
     * 创建主要场景界面
     * Create scene interface
     */
    protected startCreateScene(): void {
        this.addChild(this.tableGroup);
        this.addChild(this.lineGroup);
    }
    

    /**
     * 图像场景增加
     */
    private imgLoadHandler( evt:egret.Event ):void{
        
        /**
         * 心形相关
         */
        var bmd:egret.BitmapData = evt.currentTarget.data;
        /// 将已加载完成的图像显示出来
        this.heart = new egret.Bitmap( bmd );
        this.heart.width = this.heartWidthMax;
        this.heart.height = this.heartHeightMax;
        // 设定定位基准
        this.heart.anchorOffsetX = this.heartWidthMax/2;
        this.heart.anchorOffsetY = this.heartHeightMax;
        this.heart.x = this.heartState.x;
        this.heart.y = this.heartState.y;
        this.addChild( this.heart );
        
    }


    private Calculator(move:number):void {

        let tableNext = this.tableNext;

        let moveDistanceX = this.angleSqrt.x * move;
        let moveDistanceY = this.angleSqrt.y * move;

        switch(this.moveDirection){
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

        
        if( move > tableNext.targetMin && move < tableNext.targetMax ){
            this.mainLine = this.mainLine + move;

            this.tableNow = {
                x: this.tableNext.x,
                y: this.tableNext.y,
                radius: this.tableNext.radius
            };
            let nextCamaraX;

            if(this.moveDirection === 0){
                nextCamaraX = this.camaraState.x + moveDistanceX;
            }else {
                nextCamaraX = this.camaraState.x - moveDistanceX;
            }

            if (this.heartState.y + this.camaraState.y > this.stage.stageHeight *3/5) {
                this.tweenCamara(this.camaraState.x, this.camaraState.y, nextCamaraX, this.camaraState.y);
            }else {
                this.tweenCamara(this.camaraState.x, this.camaraState.y, nextCamaraX, this.camaraState.y + moveDistanceY);
            }

            // 结束后随机方向
            this.moveDirection = Math.round(Math.random());

            if(this.moveDirection === 0) {
                this.heart.skewY = -180;
            }else {
                this.heart.skewY = 0;
            }

            this.addTabble();
        }else {
            var that = this;
            setTimeout(function(){
                that.restartGame();
            }, 700);
        }
        
    }

    private restartGame():void {
        this.initGame(); 
        this.tweenCamara(this.camaraState.x, this.camaraState.y, 0, 0);
    }

    private addTabble():void {
        let tableNow = this.tableNow;
        let nextTableRadius:number = Math.round(Math.random() * 30) + 40;
        let nextTableDistance: number = Math.round(Math.random() * 100 + 40) + tableNow.radius + nextTableRadius + nextTableRadius/2;

        let nextX = (this.moveDirection === 0) ? tableNow.x - nextTableDistance*this.angleSqrt.x : tableNow.x + nextTableDistance*this.angleSqrt.x;
        
        this.tableNext = {
            x: nextX,
            y: tableNow.y - nextTableDistance*this.angleSqrt.y,
            radius:  nextTableRadius,
            distance: nextTableDistance,
            targetMin: nextTableDistance - nextTableRadius,
            targetMax: nextTableDistance + nextTableRadius
        }

        this.loadTable(this.tableNext.x, this.tableNext.y, this.tableNext.radius);

        var shp: egret.Shape = new egret.Shape();
        shp.graphics.lineStyle(2, 0x00ff00);
        shp.graphics.moveTo(this.tableNow.x, this.tableNow.y);
        shp.graphics.lineTo(this.tableNext.x, this.tableNext.y);
        shp.graphics.endFill();
        this.lineGroup.addChild(shp);

        var shp2: egret.Shape = new egret.Shape();
        shp2.graphics.lineStyle(2, 0x000000);
        if(this.moveDirection === 1){
            shp2.graphics.moveTo(this.tableNow.x + this.tableNext.targetMin * this.angleSqrt.x, this.tableNow.y - this.tableNext.targetMin * this.angleSqrt.y);
            shp2.graphics.lineTo(this.tableNow.x + this.tableNext.targetMax * this.angleSqrt.x, this.tableNow.y - this.tableNext.targetMax * this.angleSqrt.y);
        }else {
            shp2.graphics.moveTo(this.tableNow.x - this.tableNext.targetMin * this.angleSqrt.x, this.tableNow.y - this.tableNext.targetMin * this.angleSqrt.y);
            shp2.graphics.lineTo(this.tableNow.x - this.tableNext.targetMax * this.angleSqrt.x, this.tableNow.y - this.tableNext.targetMax * this.angleSqrt.y);
        }
        shp2.graphics.endFill();
        this.lineGroup.addChild(shp2);

        var shp3: egret.Shape = new egret.Shape();
        shp3.x = this.tableNext.x;
        shp3.y = this.tableNext.y;
        shp3.graphics.lineStyle(1, 0x00ff00);
        shp3.graphics.drawArc(0, 0, this.tableNext.radius, 0, Math.PI *2, true);
        this.lineGroup.addChild(shp3);
    }

    private loadTable(x: number, y: number, r: number):void {
        const imgLoader:egret.ImageLoader = new egret.ImageLoader;
        imgLoader.once( egret.Event.COMPLETE, (evt) => {
            var bmd:egret.BitmapData = evt.currentTarget.data;
            this.table = new egret.Bitmap( bmd );
            this.table.width = 2 * this.sqrt3 * r + r;
            this.table.height = this.table.width/190*178;
            this.table.x = x - this.table.width/2;
            this.table.y = y - r - r/3;
            this.tableGroup.addChild(this.table);

            this.tableGroup.setChildIndex(this.table, 0);

        }, this );
        imgLoader.load("resource/assets/table.png");
    }


    /**
     * 场景点击事件
     */
    private stageEventHandler(e: egret.TouchEvent) {

        let tm;
        if(!this.animating){
            switch ( e.type ){
                case egret.TouchEvent.TOUCH_BEGIN:
                    tm = new Date();
                    this.startTime = tm.getTime();
                    this.touchBeginTime = setInterval(() => { this.longPress(); }, 17);
                    this.touchBegined = true;
                    break;
                case egret.TouchEvent.TOUCH_END:
                    if(this.touchBegined) {
                        tm = new Date();
                        this.endTime = tm.getTime();
                        this.countTime();
                        clearInterval(this.touchBeginTime);
                        this.touchBegined = false;
                    }
                    break;
            }
        }
    }

    /**
     *  心形缩小
     */
    private heartTransformation():void {

      if (this.currentScale <= this.minScale) {
        this.currentSmall = this.currentSmall - 0.001;
        
        if(this.currentSmall> 0.3){
            this.heart.scaleX = this.currentSmall;
            this.heart.scaleY = this.currentSmall;
        }
        return;
      } else {
        this.currentScale = this.currentScale - 0.015;
        this.heart.scaleX = this.currentScale;
        this.heart.scaleY = this.currentScale;
      }
    }
    private longPress() {
       // 心形自身图形变换（缩小）和长按事件成正向关系
       this.heartTransformation();
    }

    /**
     * 根据起点和重点坐标，做心跳的补间动画
     */
    private tween(startX: number, startY: number, endX: number, endY: number) {

        let that = this;

        this.animating = true;

        const tween = egret.Tween.get(this.heart);
        // 中间点
        const midSite = {
            x: (startX + endX)/2,
            y: (startY + endY)/2,
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

       setTimeout(() => {
           that.animating = false;
       }, 700);
    }

    private tweenCamara(startX: number, startY: number, endX: number, endY: number) {

        const tween = egret.Tween.get(this);
        // 中间点
        const midSite = {
            x: (startX + endX)/2,
            y: (startY + endY)/2,
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
    }
    /**
     * 计算长按事件
     */
    private countTime():void {
        // ms 
        this.durationTime = this.endTime - this.startTime;
        
        this.durationTime2mainLine(this.durationTime);

        this.currentScale = 1;
        this.currentSmall = 0.6;
        this.clearTime();
    }
    /**
     * 清除时间记录
     */
    private clearTime():void {
        this.endTime = 0;
        this.startTime = 0;
    }
    /**
     * 长按事件转换为距离
     */

    private durationTime2mainLine(durationTime:number) {
        let move = Math.round(durationTime/3);

        let preX = this.heartState.x, preY = this.heartState.y;

        this.Calculator(move);

        this.tween(preX, preY , this.heartState.x, this.heartState.y);
        
    }

    /**
     * tools
     */

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

}
