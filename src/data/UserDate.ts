import GameData from "./GameData";

/**
 * 房间用户数据
 */
export default class UserData {
    private static instance: UserData;//单例对象缓存
    //实例化
    public static get inst(): UserData {
        if (!this.instance) {
            this.instance = new UserData();
        }
        return this.instance;
    }

    /**
     * 用户控制信息列表
     */
    private userControlList: any[] = [];

    /**
     * 用户列表
     */
    private userList: any[] = [];

    /**
     * 获取用户列表
     */
    public getUserList(): any[] {
        return this.userList;
    }

    /**
     * 添加用户
     * @param obj 用户数据 
     */
    public add(obj: any): void {
        let list: any[] = this.userList,
            x = 0, l = list.length;
        for (; x < l; x++) {
            if (list[x]['user_id'] == obj['user_id']) return;;
        }
        //是否离开
        obj['is_leave'] = false;
        list.push(obj);
    }

    /**
     * 删除用户
     * @param id 用户id
     */
    public remove(id: any): void {
        let list: any[] = this.userList,
            x = 0, l = list.length;
        for (; x < l; x++) {
            if (list[x] && list[x]['user_id'] == id) list.splice(x, 1);
        }
    }

    /**
     * 用户离开
     * @param id 用户id
     */
    public userLeave(id: any): void {
        let user = this.getPlayerObjById(id);
        if (user) {
            user['ready'] = false;
            user['is_leave'] = true;
        }
    }

    /**
    * 对方玩家是否已经离开
    */
    public hasUserLeave(): boolean {
        let list = this.userList,
            is_leave: boolean = false;
        for (let x = 0; x < list.length; x++) {
            if (list[x]['is_leave'] && list[x]['user_id'] != GameData.userId) {
                is_leave = true;
            }
        }
        return is_leave;
    }

    /**
     * 通过id获取用户信息
     * @param id 用户id
     */
    public getPlayerObjById(id: any): any {
        let list = this.userList,
            x = 0, l = list.length;
        for (; x < l; x++) {
            if (list[x]['user_id'] == id) {
                return list[x];
            }
        }
        return null;
    }

    /**
     * 通过角色获取用户对象
     */
    public getPlayerObjByRole(role: any): any {
        let list = this.userList,
            x = 0, l = list.length;
        for (; x < l; x++) {
            if (list[x]['mark'] == role) {
                return list[x];
            }
        }
        return null;
    }

    /**
     * 通过id设置用户准备
     * @param id 用户id
     */
    public setReadyById(id: any, status: boolean): void {
        let obj = this.getPlayerObjById(id);
        if (obj) {
            obj['ready'] = status;
            if (status) obj['is_leave'] = false;
        }
    }

    /**
     * 通过id获取当前玩家准备状态
     */
    public getIsReadyById(id: any): boolean {
        let obj = this.getPlayerObjById(id);
        if (obj) return obj['ready'];
        return false;
    }

    /**
     * 取消所有用户准备
     */
    public clearAllReady(): void {
        let list = this.userList,
            x = 0, l = list.length;
        for (; x < l; x++) {
            list[x]['ready'] = false;
        }
    }

    /**
     * 清除所有用户
     */
    public clearAllPlayer(): void {
        this.userList = [];
    }


}