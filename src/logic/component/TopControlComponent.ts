import BaseLogic from "../../core/BaseLogic";
import Game from "../../core/Game";

/**
 * 顶部用户麦克，喇叭控制组件
 */
export default class TopControlComponent extends BaseLogic {
    /** @prop {name:addFriendBtn,tips:"添加好友按钮",type:Node} */
    addFriendBtn: Laya.Sprite;
    /** @prop {name:mikeSwitchBtn,tips:"麦克控制按钮",type:Node} */
    mikeSwitchBtn: Laya.Sprite;
    /** @prop {name:hornSwitchBtn,tips:"喇叭控制按钮",type:Node} */
    hornSwitchBtn: Laya.Sprite;
    /** @prop {name:soundBtn,tips:"音效控制按钮",type:Node} */
    soundBtn: Laya.Sprite;
    /** @prop {name:questionBtn,tips:"游戏描述按钮",type:Node} */
    questionBtn: Laya.Sprite;
    /** @prop {name:addFriendHintBox,tips:"发送好友提示框",type:Node} */
    addFriendHintBox: Laya.Box;
    /** @prop {name:addFriendHintLabel,tips:"添加好友提示文本",type:Node} */
    addFriendHintLabel: Laya.Label;

    /**添加朋友提示定时器 */
    private addFriendTimeLine: Laya.TimeLine;

    onAwake() {
        //添加好友请求提示
        Game.eventManage.on(Game.eventType.ADD_FRIEND, this, this.onFriend);
    }

    /**
     * 点击事件
     * @param e 节点 
     */
    onClick(e: Laya.Event): void {
        switch (e.target.name) {
            case 'addFriendBtn'://添加好友 
                this.addFriend();
                break;
            case 'mikeSwitchBtn'://麦克控制 
                this.setMikeSwitch();
                break;
            case 'hornSwitchBtn'://喇叭控制 
                this.setHornSwitch();
                break;
            case 'soundBtn'://音效控制 
                this.updateSoundState();
                break;
            case 'questionBtn'://打开引导
                Game.viewManage.openView(Game.viewConfig.dialogView, { type: Game.systemDate.alter_type_1 });
                break;
        }
    }



    /**
     * 添加朋友
     */
    private addFriend(): void {
        let userId: any,
            GameData = Game.gameData,
            SystemData = Game.systemDate,
            UserData = Game.userData;
        if (GameData.mark == SystemData.player_type_1) {//获取对方的userid
            if (UserData.inst.getPlayerObjByRole(SystemData.player_type_2)) userId = (UserData.inst.getPlayerObjByRole(SystemData.player_type_2))['user_id'];
        } else {
            if (UserData.inst.getPlayerObjByRole(SystemData.player_type_1)) userId = (UserData.inst.getPlayerObjByRole(SystemData.player_type_1))['user_id'];
        }

        if (!userId) return;

        Game.eventManage.event(Game.eventType.SOCKET_SEND, {
            'action': 'proto.Friend',
            'data': {
                'user_id': userId,
                request_root: GameData.requestRoot
            }
        });
        this.addFriendBtn.visible = false;
        this.addFriendHintControl('您已发送好友请求，请等待对方同意~');
    }

    /**
     * 接受请求好友提示
     * @param d 数据
     */
    private onFriend(d: any): void {
        if (d['user_id'] != Game.gameData.userId)
            this.addFriendHintControl('对方请求加您为好友~');
    }

    /**
     * 添加朋友提示框控制 
     */
    private addFriendHintControl(msg: string): void {
        this.addFriendHintLabel.text = msg;
        this.addFriendHintBox.visible = true;
        if (!this.addFriendTimeLine) {
            this.addFriendTimeLine = new Laya.TimeLine;
            this.addFriendTimeLine.to(this.addFriendHintBox, { alpha: 1, y: 10 }, 300)
                .to(this.addFriendHintBox, { alpha: 0, y: -70 }, 500, null, 2500);
            this.addFriendHintBox.on(Laya.Event.COMPLETE, this, this.addFriendAnimationComplete);
        }
        this.addFriendTimeLine.play();
    }

    /**
     * 添加好友 动画层播放完成
     */
    private addFriendAnimationComplete(): void {
        this.addFriendHintBox.visible = false;
    }

    /**
     * 设置麦克开关
     */
    private setMikeSwitch(): void {
        Game.config.mikeIsOn = !Game.config.mikeIsOn;
        Game.appCore.runAppFunction(Game.appCore.mikeSwitchController, JSON.stringify({ state: Game.config.mikeIsOn ? '1' : '0' }));
        this.mikeSwitchBtn.texture = Laya.loader.getRes(Game.config.mikeIsOn ? 'scene/mike_open.png' : 'scene/mike_close.png');
        //麦克控制  => 广播
        Game.eventManage.event(Game.eventType.SOCKET_SEND, {
            action: Game.systemDate.net_guide,
            data: {
                action: Game.systemDate.net_id_8,
                mic: Game.config.mikeIsOn
            }
        })
    }

    /**
     * 设置喇叭开关
     */
    private setHornSwitch(): void {
        Game.config.hornIsOn = !Game.config.hornIsOn;
        Game.appCore.runAppFunction(Game.appCore.hornSwitchController, JSON.stringify({ state: Game.config.hornIsOn ? '1' : '0' }));
        this.hornSwitchBtn.texture = Laya.loader.getRes(Game.config.hornIsOn ? 'scene/horn_open.png' : 'scene/horn_close.png');
    }

    /**
     * 更新音效状态和资源显示 
     */
    private updateSoundState(): void {
        Game.config.soundIsOn = !Game.config.soundIsOn;
        this.soundBtn.texture = Laya.loader.getRes(Game.config.soundIsOn ? 'scene/sound_open.png' : 'scene/sound_close.png');
        Game.soundManage.setSwitch(Game.config.soundIsOn);
        // if (GameConfig.soundIsOn) { 这个游戏暂时没有背景音乐
        //     SoundManager.playMusic(AudioRes.background_music, 0);
        // } else {
        //     SoundManager.stopAll();
        // }
    }
}