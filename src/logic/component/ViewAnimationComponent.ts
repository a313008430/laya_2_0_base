import BaseLogic from "../../core/BaseLogic";

/**
 * 界面打开关闭动画组件
 */
export default class ViewAnimationComponent extends BaseLogic {

    /**动画 */
    private animation: Laya.Tween;
    /**节点 */
    private node: Laya.View;

    onAwake() {
        this.node = this.owner as Laya.View;
        this.node.anchorX = 0.5;
        this.node.anchorY = 0.5;
    }

    onEnable() {
        //监听界面尺寸改变
        this.owner.on(Laya.Event.RESIZE, this, this.onResize);
        this.onResize();
        this.openAnimation();
    }

    openAnimation(): void {
        if (!this.animation) this.animation = new Laya.Tween;
        this.node.scale(1, 1);
        this.node.pos(Laya.stage.width / 2, Laya.stage.height / 2);
        this.animation.from(this.owner, { x: Laya.stage.width / 2, y: Laya.stage.height / 2, scaleX: 0, scaleY: 0 }, 300, Laya.Ease.backOut);
    }

    /**
     * 关闭层动画
     */
    closeAnimation() {
        if (!this.animation) this.animation = new Laya.Tween;
        this.animation.to(this.owner, { scaleX: 0, scaleY: 0 }, 300, Laya.Ease.strongOut, new Laya.Handler(this, () => {
            this.owner.removeSelf();
        }));
    }

    onDisable() {
        //监听界面尺寸改变
        this.owner.off(Laya.Event.RESIZE, this, this.onResize);
    }

    private onResize(): void {
        this.node.width = Laya.stage.width;
        this.node.height = Laya.stage.height;
    }
}