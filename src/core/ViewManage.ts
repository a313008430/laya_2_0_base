import BaseLogic from "./BaseLogic";
import ViewAnimationComponent from "../logic/component/ViewAnimationComponent";

/**
 * 界面管理器
 * @description 由于界面不多，所以现在界面的发布模式用的是内嵌模式，如果界面多需要防止前期的包太大的情况下，就需要使用文件模式
 */

export default class ViewManage {
    /**已经打开界面缓存 => 后期如果需要批量处理界面可以用到 */
    private static viewCache: any = {};
    /**
     * 打开界面
     * @param viewConfig ViewConfig 里面的数据
     * @param data 数据 把数据绑定在组件上，现在不绑定在view层
     */
    static openView(viewConfig: viewConfigInterFace, data?: any): void {
        let view: Laya.Scene = this.viewCache[viewConfig.name];
        if (!view) {//检测界面是否已经缓存实例
            view = new viewConfig.class;
            this.viewCache[viewConfig.name] = view;
        }
        if (!view.parent) {//防止界面重复添加
            Laya.stage.addChild(view);
            console.log('%c ==> ', 'color:#fff;font-weight:700;background-color:rgba(27, 144, 4, 0.7)', ` open ${viewConfig.name}`);
        }
        //设置数据
        let baseLogic: BaseLogic[] = view.getComponents(BaseLogic);
        if (baseLogic) {//检查是否有组件 和 是否有setData方法
            for (let x = 0, l = baseLogic.length; x < l; x++) {
                if (baseLogic[x]['setData']) baseLogic[x].setData(data);
            }
        }
    }

    /**
     * 关闭界面
     * @param viewConfig ViewConfig 里面的数据
     */
    static closeView(viewConfig: viewConfigInterFace): void {
        let view: Laya.Scene = this.viewCache[viewConfig.name];
        if (!view) {
            console.warn(`Lose ${viewConfig.name} view!`);
            return;
        }

        if (view.parent) {//防止已经关闭的界面重复关闭
            let animation: ViewAnimationComponent = view.getComponent(ViewAnimationComponent);
            if (animation) {
                animation.closeAnimation();
            } else {
                view.removeSelf();
            }

            console.log('%c <== ', 'color:#fff;font-weight:700;background-color:rgba(255, 0, 0, 0.7)', ` close ${viewConfig.name}`);
        }
    }


    /**
     * 销毁界面
     * @param viewConfig ViewConfig 里面的数据
     */
    static destroyView(viewConfig: viewConfigInterFace): void {
        let view: Laya.Scene = this.viewCache[viewConfig.name];
        if (!view) {
            console.warn(`Lose ${viewConfig.name} view!`);
            return;
        }

        view.destroy(true);
        this.viewCache[viewConfig.name] = null;
        console.log('%c <== ', 'color:#fff;font-weight:700;background-color:rgba(255, 0, 0, 0.7)', ` destroy ${viewConfig.name}`);

    }

    /**
     * 定时清除无用界面
     */

}


