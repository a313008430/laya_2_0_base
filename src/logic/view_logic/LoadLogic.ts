import BaseLogic from "../../core/BaseLogic";
import Game from "../../core/Game";

/**
 * 加载界面逻辑
 */
export default class LoadLogic extends BaseLogic {
    /** @prop {name:loadIcon,tips:"loading顶部icon",type:Node} */
    loadIcon: Laya.Image;
    /** @prop {name:loadBg,tips:"loading背景",type:Node} */
    loadBg: Laya.Image;
    /** @prop {name:loadBar,tips:"loading进度条",type:Node} */
    loadBar: Laya.Sprite;

    /**进度条定时器 */
    private loadBarTween: Laya.Tween;
    /**进度条宽度 */
    private loadBarWidth: number = 601;

    /**
     * 初始化
     */
    protected init(): void {
        Game.eventManage.on(Game.eventType.LOAD_PROGRESS, this, this.loadProgress);
        //设置剪切区域
        this.loadBar.scrollRect = new Laya.Rectangle(0, 0, 0, this.loadBarWidth);
        if (!this.loadBarTween) this.loadBarTween = new Laya.Tween();
        
        //监听界面尺寸改变
        this.owner.on(Laya.Event.RESIZE, this, this.onResize);
    }

    /**
         * 加载进度
         */
    private loadProgress(value: number): void {
        this.loadBarTween.to(this.loadBar.scrollRect, { width: this.loadBarWidth * value }, 300, null, Laya.Handler.create(this, () => {
            //加载完成
            if (value === 1) {
                this.onCloseAnimation();
            }
        }));
    }

    /**
        * 设置界面消失效果
        */
    private onCloseAnimation(): void {
        Laya.Tween.to(this.loadIcon, { y: this.loadIcon.y - 100 }, 300);
        Laya.Tween.to(this.loadBg, { bottom: this.loadBg.bottom - 100 }, 300);
        Laya.Tween.to(this, { alpha: 0 }, 300, null, new Laya.Handler(this, () => {
            Game.viewManage.destroyView(Game.viewConfig.loadView);
        }));

        //游戏主界面
        // Game.viewManage.openView(Game.viewConfig.gameView);
    }

    onDisable(): void {
        Laya.loader.clearTextureRes('res/atlas/load.png');
        Laya.loader.clearRes('res/atlas/load.atlas');
        Laya.loader.clearRes('res/atlas/load.png');
        this.owner.off(Laya.Event.RESIZE, this, this.onResize);
    }

    /**
     * 尺寸改变监听
     */
    private onResize(): void {
        this.owner['width'] = Laya.stage.width;
        this.owner['height'] = Laya.stage.height;
    }

}