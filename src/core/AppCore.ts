import { EventManage, GameEvent } from "./EventManage";
import ViewManage from "./ViewManage";
import GameData from "../data/GameData";

/**
 * web app 交互
 */
export default class AppCore {
    /**苹果类型 */
    static typeIos: number = 1;
    /**安卓类型 */
    static typeAndroid: number = 2;


    //===================>>> h5 访问 app 的方法 名称
    /** 关闭webview事件 */
    static closeWebView: string = 'closeWebView';
    /** 加入频道 */
    static joinLiveChannel: string = 'joinLiveChannel';
    /** 离开频道 */
    static leaveChannel: string = 'leaveChannel';
    /** 麦克开关控制 */
    static mikeSwitchController: string = 'mikeSwitchController';
    /** 扬声器开关控制 */
    static hornSwitchController: string = 'hornSwitchController';
    /** app 执行关闭 webview的时候，h5主动调用这个方法，告诉app是否等待关闭 */
    static appCloseWebViewCall: string = 'appCloseWebViewCall';
    /**打开游戏匹配界面 */
    static randomMatchGame: string = 'randomMatchGame';

    /**
     * 执行app交互方法
     * @param name 方法名称
     * @param data 传入数据  
     */
    static runAppFunction(name: string, data?: string): void {
        let webAppFunction;
        if (Laya.Browser.onIOS) {
            webAppFunction = this.detectionHasFunction(this.typeIos, name);
            if (webAppFunction) {
                if (name == this.closeWebView) {//关闭webview特殊处理
                    window['webkit']['messageHandlers'][this.leaveChannel]['postMessage'](JSON.stringify({ status: 1 }));//特殊处理需要先退出频道
                    EventManage.event(GameEvent.CLOSE_SOCKET);
                }
                if (data) {
                    // webAppFunction['postMessage'](data);
                    console.log('run :' + name)
                    window['webkit']['messageHandlers'][name]['postMessage'](data);
                } else {
                    window['webkit']['messageHandlers'][name]['postMessage'](JSON.stringify({ status: 1 }));
                }
            }
        } else {
            webAppFunction = this.detectionHasFunction(this.typeAndroid, name);
            if (webAppFunction) {
                if (name == this.closeWebView) {//关闭webview特殊处理
                    EventManage.event(GameEvent.CLOSE_SOCKET);
                }
                console.log(name)
                if (data) {
                    window['JsCallback'][name](data);
                } else {
                    window['JsCallback'][name]();
                }

            }
        }
    }

    /**
     * 判断app的方法是否存在
     * @param type 1 苹果 2安卓
     * @param name 方法名称
     */
    static detectionHasFunction(type: number, name: string): boolean {
        switch (type) {
            case this.typeIos:
                if (window['webkit']
                    && window['webkit']['messageHandlers']
                    && window['webkit']['messageHandlers'][name]) return true;
            case this.typeAndroid:
                if (window['JsCallback'] && window['JsCallback'][name])
                    return true;
        }
        return false;
    }

    /**
    * 监听app 执行h5 接口
    */
    static listenAppFunction(): void {
        //监听手机关闭事件响应
        window['appCloseWebView'] = () => { this.onCloseWebView(); };
        //监听说话用户id
        window['listenerById'] = (data) => { this.onListenerById(data); };
    }

    /**
    * 关闭webView监听
    */
    static onCloseWebView(): void {
        if (GameData.isStart) {//如果是游戏中，加一游戏提示框
            this.runAppFunction(this.appCloseWebViewCall, JSON.stringify({ state: 1 }));
            // ViewManage.openView('ExitHintDialog');
        } else {
            this.runAppFunction(this.leaveChannel);
            this.runAppFunction(this.appCloseWebViewCall, JSON.stringify({ state: 0 }));
            this.runAppFunction(this.closeWebView);
        }

    }

    /**
    * 监听说话用户id
    */
    static onListenerById(data): void {
        // EventManage.inst.event(EventManage.LISTEN_APP_GET_ID, [data]);
    }

}