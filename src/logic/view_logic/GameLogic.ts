import BaseLogic from "../../core/BaseLogic";
import Game from "../../core/Game";

/**
 * 游戏主逻辑
 */
export default class GameLogic extends BaseLogic {
    /**
     * 初始化
     */
    protected init(): void {
        //监听界面尺寸改变
        this.owner.on(Laya.Event.RESIZE, this, this.onResize);

    }
    /**
     * 尺寸改变监听
     */
    private onResize(): void {
        this.owner['width'] = Laya.stage.width;
        this.owner['height'] = Laya.stage.height;
    }
}