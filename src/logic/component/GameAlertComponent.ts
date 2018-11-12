import BaseLogic from "../../core/BaseLogic";
import Game from "../../core/Game";

/**
 * 游戏弹窗组件 (一些错误信息提示等)
 */
export default class GameAlertComponent extends BaseLogic {
    /** @prop {name:alertNode,tips:"提示内容",type:Prefab} */
    alertNode: Laya.Prefab;



    onAwake() {
        //打开游戏alert提示框
        Game.eventManage.on(Game.eventType.GAME_ALERT, this, this.showGameAlert);
    }

    /**
    * 打开游戏提示
    */
    private showGameAlert(d: any): void {
        //从对象池取预置资源
        let v = Laya.Pool.getItemByCreateFun('gameAlert', this.alertNode.create, this.alertNode) as Laya.Image;
        v.zOrder = Game.systemDate.view_zOrder_9999;
        v.centerY = 0;
        v.alpha = 1;
        this.owner.addChild(v);

        let content: Laya.Label = v.getChildByName('content') as Laya.Label;
        content.text = d['msg'];
        content.color = d['color'] ? d['color'] : '#ffffff';
        if (d["time"]) {
            Laya.timer.once(d['time'], this, (v) => {
                this.onceTimer(v)
            }, [v])
        }
    }

    /**
     * 定时器
     * @param v 打开的界面
     */
    private onceTimer(v: Laya.Image): void {
        Laya.Tween.to(v, { centerY: -100, alpha: 0 }, 300, null, new Laya.Handler(this, () => {
            v.removeSelf();
            Laya.Pool.recover('gameAlert', v);
        }));
    }
}