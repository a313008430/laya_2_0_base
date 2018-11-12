import { EventManage, GameEvent } from "./EventManage";
import GameData from "../data/GameData";
import SystemData from "../data/SystemData";
import ViewConfig from "./ViewConfig";
import ViewManage from "./ViewManage";
import MainConfig from "../MainConfig";
import AppCore from "./AppCore";
import UserData from "../data/UserDate";
import { SoundManage, AudioRes } from "./SoundManage";
import GameSocket from "../net/GameSocket";
import Utils from "./Utils";
/**
 * 游戏内部业务逻辑中转层
 */
export default class {
    /**工具类 */
    static utils = Utils;
    /**事件管理器 */
    static eventManage = EventManage;
    /**事件方法 */
    static eventType = GameEvent;
    /**游戏数据 */
    static gameData = GameData;
    /**游戏配置数据类型 */
    static systemDate = SystemData;
    /**界面配置 */
    static viewConfig = ViewConfig;
    /**界面管理器 */
    static viewManage = ViewManage;
    /**游戏配置 */
    static config = MainConfig;
    /**web app 交互 */
    static appCore = AppCore;
    /**用户数据 */
    static userData = UserData;
    /**音效管理 */
    static soundManage = SoundManage;
    /**音效资源 */
    static audioRes = AudioRes;
    /**socket */
    static socket = GameSocket;
}
