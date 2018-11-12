/**
 * 组件父类
 */
export default class BaseLogic extends Laya.Script {

    /**数据 */
    protected data: any;

    /**
     * 设置数据
     * @param data 主要用于组件关联时所需要用到的数据
     */
    setData(data: any): void {
        this.data = data;
        this.init();
    }

    /**
     * 初始化且数据已经缓存
     */
    protected init(): void { };

    /**
     * 节点从舞台移除
     */
    onDisable(): void {
        this.data = null;
    }
}

