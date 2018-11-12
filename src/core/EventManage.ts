/**
 * 事件管理器
 */
//实例化引擎事件管理组件 
const EventManage = new Laya.EventDispatcher;
/**
 * 事件名称
 */
const GameEvent = {
    //==============游戏内部事件===================
    /** resize事件 */
    RESIZE: 'resize',
    /** 加载进度 */
    LOAD_PROGRESS: 'load_progress',
    /** 游戏开始 */
    GAME_START: 'game_start',
    /** 游戏结束 */
    GAME_OVER: 'game_over',
    /** 准备 */
    READY: 'ready',
    /**添加游戏alert弹窗 */
    GAME_ALERT: 'game_alert',
    /**心跳协议 */
    HEART_BEAT: 'heart_beat',
    /**关闭close */
    CLOSE_SOCKET: 'close_socket',
    /** 发送socket信息 */
    SOCKET_SEND: 'socket_send',
    /**麦克控制 */
    MIKE_CONTROL: 'mike_control',
    /**更新顶部用户 */
    UPDATE_TOP_PLAYER: 'update_top_player',
    /**用户离开 */
    LEAVE_ROOM: 'leave_room',
    /**用户离开 */
    ADD_FRIEND: 'add_friend',

    //==============协议事件 【公共】===================
    /**麦克控制 */
    NET_MIKE_CONTROL: 'mike_control',
    /**发起好友请求 */
    NET_ADD_FRIEND: 'add_friend',
    /**用户离开 */
    NET_LEAVE_ROOM: 'leave_room',
    /**心跳协议 */
    NET_HEART_BEAT: 'heart_beat',

    //==============单独游戏协议事件 (每个游戏都不一样，换游戏时重置)===================



}

export { EventManage, GameEvent }
