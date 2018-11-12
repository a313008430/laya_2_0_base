import { EventManage, GameEvent } from "../core/EventManage";
import GameData from "../data/GameData";
import MainConfig from "../MainConfig";
import AppCore from "../core/AppCore";
import UserData from "../data/UserDate";
/**
 * socket
 */
export default class GameSocket {
    /**
     * 游戏socket
     */
    private socket: Laya.Socket;
    /**心跳定时器 */
    private heartBeatTime = null;
    /**发送心跳的时间 */
    private sendHeartBeatTime = null;
    /**是否已经加入语音频道 */
    private isAddChannel: boolean = false;

    /**构造函数 */
    constructor() {
        this.init();
    }

    /**
     * 初始化
     */
    private init(): void {
        this.createSocket();
        EventManage.on(GameEvent.CLOSE_SOCKET, this, this.setCloseSocket);
    }
    /**
     * 创建socket
     */
    private createSocket(): void {
        let socket = new Laya.Socket();


        socket.connectByUrl(GameData.wsDomain);
        socket.on(Laya.Event.OPEN, this, this.openHandler);//成功
        socket.on(Laya.Event.MESSAGE, this, this.receiveHandler);//信息交互
        socket.on(Laya.Event.CLOSE, this, this.closeHandler);//结束
        socket.on(Laya.Event.ERROR, this, this.errorHandler);//异常
        this.socket = socket;

        EventManage.on(GameEvent.SOCKET_SEND, this, this.socketEvent);
    }

    /**
     * 关闭socket
     */
    private setCloseSocket(): void {
        if (this.socket) this.socket.close();
    }
    //socket发送事件处理
    private socketEvent(d: socketSendData): void {
        if (MainConfig.isDebug() && d["action"] != "proto.HeartBeat")
            console.log('%c ==> ', 'color:red;background-color:rgba(167, 167, 167, 0.2)', d);
        this.socket.send(d["action"] + '\n' + JSON.stringify(d["data"] ? d["data"] : {}));//data 默认必须为{}
    }

    /**
     * 正确建立连接
     * @param e 
     */
    private openHandler(e: any = null): void {
        console.log('begin');
        GameData.socketConnect = true;
        this.loginGame();
        this.openHeartBeat(true);
    }

    /**
     * 上报音频
     */
    private joinLiveChannel(): void {
        if (this.isAddChannel) return;
        this.isAddChannel = true;
        //进入游戏，上报到app进入频道
        if (GameData.channelName && GameData.channelKey)
            AppCore.runAppFunction(AppCore.joinLiveChannel, JSON.stringify({
                channel_name: GameData.channelName,
                channel_key: GameData.channelKey,
            }));
    }

    /**
     * 注册登陆
     */
    private loginGame(): void {
        this.socketEvent({
            action: 'proto.Login',
            data: { "sid": GameData.sid, "game_history_id": GameData.gameHistoryId, enter_from: GameData.enterFrom, request_root: GameData.requestRoot }
        });
    }

    ///接收到数据触发函数
    private receiveHandler(msg: any = null): void {
        msg = msg.split('\n');
        let d = JSON.parse(msg[1]);

        if (d['error_code']) {
            //游戏结束
            GameData.isStart = false;
            console.error(d['error_reason']);
            // EventManage.event(GameEvent.GAME_ALERT, { msg: d['error_reason'], color: '#ff0000', time: 2000 });
            return;
        }

        if (MainConfig.isDebug() && d['type'] != "HeartBeat") {
            console.log('%c <== ', "color:green;background-color:rgba(167, 167, 167, 0.2)", d);
        }

        switch (d['type']) {
            case "login"://用户登陆
                this.onLogin(d);
                break;
            case "join"://得到房间用户列表
                this.onJoin(d['result']);
                this.joinLiveChannel();
                break;
            case "add"://用户加入
                // this.onAdd(d['result']);
                break;
            case "leave"://用户离开
                // this.onLeave(d['extra']);
                break;
            case "ready"://用户准备
                // this.onReady(d['extra']);
                break;
            case "cancel"://用户取消准备
                // this.onCancel(d['extra']);
                break;
            case "HeartBeat"://心跳
                this.onHeartBeat();
                break;
            case "mic"://麦克处理
                this.onMic(d['extra']);
                break;
        }

    }

    /**
     * 用户登陆
     * @param d 数据
     */
    private onLogin(d: any): void {
        GameData.userId = d['extra']['user_id'];
    }

    /**
     * 得到房间用户列表
     * @param d 数据
     */
    private onJoin(d: any): void {
        // 缓存用户列表
        if (d) {
            for (let x = 0, l = d.length; x < l; x++) {
                if (d[x]) UserData.inst.add(d[x]);
            }
        }

        // //获取语音聊天参数
        // EventManage.event(GameEvent.SOCKET_SEND, {
        //     action: 'proto.SPY',
        //     data: { "action": SystemData.net_id_12 }
        // });
    }


    /**
     * 心跳
     */
    private onHeartBeat(): void {
        EventManage.event(GameEvent.HEART_BEAT, Date.now() - this.sendHeartBeatTime);
    }

    /**
     * 麦克处理
     * @param d 数据
     */
    private onMic(d: any): void {
        EventManage.event(GameEvent.MIKE_CONTROL, d);
    }


    //关闭事件
    private closeHandler(e: any = null): void {
        console.log(e)
        console.error('close socket')
        this.openHeartBeat(false);
        GameData.socketConnect = false;
        GameData.isStart = false;
        EventManage.event(GameEvent.GAME_ALERT, { msg: '连接出错啦，请退出重试！', color: '#ff0000' });
    }

    //连接出错
    private errorHandler(e: any = null): void {
        console.log(e);
        console.error('error');
        this.openHeartBeat(false);
        GameData.socketConnect = false;
        GameData.isStart = false;
        EventManage.event(GameEvent.GAME_ALERT, { msg: '连接出错啦，请退出重试！', color: '#ff0000' });
    }

    /**
     * 开起心跳
     * @param state 开户状态
     */
    private openHeartBeat(state: boolean): void {
        if (state) {
            if (this.heartBeatTime) clearInterval(this.heartBeatTime);
            this.heartBeatTime = setInterval(() => {
                this.sendHeartBeatTime = Date.now();
                this.socketEvent({ action: "proto.HeartBeat" });
            }, 1000);
        } else {
            if (this.heartBeatTime) clearInterval(this.heartBeatTime);
        }
    }
}