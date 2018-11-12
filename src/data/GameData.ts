import SystemData from "./SystemData";

/**
 * 游戏数据 
 */
export default class GameData {
    /**socket连接状态 */
    static socketConnect: boolean = false;
    /**游戏是否已经开始 */
    static isStart: boolean = false;
    /**是否是电脑ai */
    static isAi: boolean = false;
    /**ai 用户id */
    static ai_user_id: number = 22;
    /**是否是好友 */  /* 0:没有关系 1:已添加 2:等待验证 3:等待接收 */
    static isFriend: boolean = false;
    /** 是否可操作 */
    static isCanTouch: boolean = false;
    /**是否可直接打开结束界面 */
    static isCanResult: boolean = false;
    /**胜利者id */
    static winnerId: any = null;
    /**胜利 结果 类型 */
    static winnerType: any = null;
    /**玩家标识 */
    static mark: any = SystemData.player_type_1;
    /**游戏开始时间 */
    static gameStartTime: number = 0;
    /**游戏结束时间 */
    static gameOverTime: number = 0;
    /**游戏回合类型 */
    static roundType: number;
    /**玩家人数上限 */
    static maxPlayer: number;
    /**自己的词语 */
    static selfWords: string = '';
    /**信息提示窗口显示状态 */
    static hintShow: boolean = false;
    /**是否已经加入房间 */
    static isJoin: boolean = false;
    /**是否是关闭webView事件 */
    static isCloseVebView: boolean = false;

    /**game code */
    static get gameCode(): string {
        return Laya.Utils.getQueryString('game_code');
    }
    /**sid */
    static get sid(): string {
        return Laya.Utils.getQueryString('sid');
    }
    /**获取语音频名称 */
    static get channelName(): string {
        return Laya.Utils.getQueryString('channel_name');
    }
    /**获取语音频key */
    static get channelKey(): string {
        return Laya.Utils.getQueryString('channel_key');
    }
    /**用户id */
    static userId: number;
    // static get userId(): string {
    //     return GameData.sid.match(/\d+/)[0];
    // }
    /**游戏历史id */
    static get gameHistoryId(): string {
        return Laya.Utils.getQueryString('game_history_id');
    }
    /**HI语音URL地址 */
    static get requestRoot(): string {
        return unescape(Laya.Utils.getQueryString('request_root'));
    }

    /**游戏交互接口渠道 */
    static get code(): string {
        return Laya.Utils.getQueryString('code');
    }
    /**特殊值 进入房间 客户端使用 结束时返回 */
    static get enterFrom(): string {
        return Laya.Utils.getQueryString('enter_from');
    }
    /**
     * 获取socket地址
     */
    static get wsDomain(): string {
        return unescape(Laya.Utils.getQueryString('ws_domain'));
    }
    /**
     * 获取游戏id
     */
    static get gameId(): string {
        return Laya.Utils.getQueryString('game_id');
    }
    /**
     * 是否钻石场 1钻石场 0 普通场
     */
    static get sceneType(): string {
        return Laya.Utils.getQueryString('scene_type');
    }
}