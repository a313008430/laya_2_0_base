

import { ui } from "../ui/layaMaxUI";

/**
 * 界面配置=>主要用来配置界面类的缓存
 * 新的界面需要在这里注册下，方便管理
 */
export default class ViewConfig {
    /**加载界面 */
    static loadView: viewConfigInterFace = { name: 'loadView', class: ui.LoadViewUI };
    /**主场景 */
    static mainScene: viewConfigInterFace = { name: 'mainScene', class: ui.MainSceneUI };
    /**游戏层 */
    static gameView: viewConfigInterFace = { name: 'gameView', class: ui.GameViewUI };
}

