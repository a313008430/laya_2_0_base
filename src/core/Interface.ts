/**
 * 接口
 */
/**
 * viewConfig 接口
 */
interface viewConfigInterFace {
    /**界面名称 */
    name: string,
    /**场景类 */
    class: any
}


/**发送socket数据结构 */
interface socketSendData {
    action: string,
    data?: any
}


/**
 * 坐标
 */
interface pos {
    x: number,
    y: number
}