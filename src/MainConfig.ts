import GameConfig from "./GameConfig";

/**
 * 游戏配置  => 需要调整
 */
export default {
    /**版本 */
    version: Date.now(),
    /** 设计的游戏宽度 */
    width: 750,
    /**设计的游戏高度 */
    height: 1334,
    /**资源目录 */
    res_base_brc: 'res/',
    /**音频是否开启 */
    soundIsOn: true,
    /**麦克是否开启 */
    mikeIsOn: true,
    /**喇叭是否开启 */
    hornIsOn: true,
    /**玩家可操作时间 */
    game_control_time: 30,
    /**是否开起debug  */
    isDebug: (): string => {
        // return Utils.getValueByUrl('request_root').indexOf('api') == -1;

        return Laya.Utils.getQueryString('debug');
    },
}