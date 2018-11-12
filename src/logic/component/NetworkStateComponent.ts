import BaseLogic from "../../core/BaseLogic";
import Game from "../../core/Game";

/**
 * 网络状态
 */
export default class NetworkStateComponent extends BaseLogic {
    /** @prop {name:delayNode,tips:"网络延迟显示",type:Prefab} */
    delayNode: Laya.Prefab;

    private delayLabel: Laya.Label;

    onAwake(): void {
        let node: Laya.Image = this.delayNode.create();
        Laya.stage.addChild(node);
        node.zOrder = Game.systemDate.view_zOrder_9999;
        node.right = 10;
        node.top = 70;

        this.delayLabel = node.getChildByName('delayLabel') as Laya.Label;

        // 延迟心跳显示网络状态
        Game.eventManage.on(Game.eventType.HEART_BEAT, this, this.delayHeart);
    }

    /**
    * 延迟心跳 显示网络状态
    */
    private delayHeart(time: number): void {
        this.delayLabel.text = time + 'ms';
        this.delayLabel.color = time > 500 ? '#f15e30' : '#ffffff';
    }
}