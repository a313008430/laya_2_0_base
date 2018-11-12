/**时间差转换成时分秒接口 */
interface timeDifferenceConversionInterface {
    hours: number, minutes: any, seconds: any
}
/**
 * 工具类 模块
 */
export default {
    /**
     * 对象转换成url地址链接
     * @param data 对象
     */
    objConvertUrl: (data: any): string => {
        let dataUrl = '';
        for (let i in data) {
            if (data.hasOwnProperty(i)) {
                dataUrl += `${i}=${data[i]}&`;
            }
        }
        return dataUrl;
    },

    /**
     * 文字截取 0-n 之后 替换成 ...
     * @param string 文本
     * @param len 截取多长
     * @param replace 要替换的内容
     */
    stringReplace: function (string: string, len: number = 0, replace = ''): string {
        if (!string.length) return '';
        let re = new RegExp(`.{0,${string.length > len ? len - 1 : len}}`);
        return string.match(re)[0] + (string.length > len ? replace : '');
    },

    /**
     * 时间转换 
     * @param timestamp 时间戳
     * @param type 类型  默认格式 2018-05-10 15:45:54 类型 1： 01/14 12:45  
     * @returns 
     */
    conversionTime: function (timestamp: number, type?: number): string {
        let d: Date = new Date(timestamp),
            m = d.getMonth() + 1,
            day = d.getDate(),
            h = d.getHours() + 1,
            min = d.getMinutes(),
            sec = d.getSeconds();
        switch (type) {
            case 1:
                return `${m < 10 ? '0' + m : m}/${day < 10 ? '0' + day : day} ${h < 10 ? '0' + h : h}:${min < 10 ? '0' + min : min}`;
            default:
                return `${d.getFullYear()}-${m < 10 ? '0' + m : m}-${day < 10 ? '0' + day : day} ${h < 10 ? '0' + h : h}:${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
        }
    },

    /**
     * 时间转换 => 时间戳差 {hours,minutes,seconds}
     * @param time 秒
     */
    timeDifferenceConversion: (time: number): timeDifferenceConversionInterface => {
        let h = Math.floor(time / 3600),
            min = Math.floor((time - h * 3600) / 60),
            sec = time - h * 3600 - min * 60;
        return { hours: h, minutes: (min < 10 ? '0' + min : min), seconds: (sec < 10 ? ('0' + sec) : sec) };
    },

    /**
     * 获取url里面的参数值
     * @param  key 传进来的参数
     * @param notMust 不是必须的参数 用来判断一些特殊的字段(如是否debug)
     * http://192.168.4.206:8900/bin/index.html?userId=12312&roomId=1234545
     */
    getValueByUrl: function (key: string, notMust?: boolean): any {
        let value = location.search.match(new RegExp("[?=?|?=&]" + key + "=([^&]*)"));
        if (value === null) {
            if (notMust) return null;
            alert('lose ' + key);
            return null;
        };
        return value[1];
    },

    /**
     *  音频插件 (临时用==>没有添加destroy)
     * @author Created by xia on 2018/5/28 0028  11:57.
     */
    SoundManager: class SoundManager {

        static audioCtx;//AudioContext
        static audioList: any = {};//音频列表
        static isInit: boolean = false;
        /**是否禁用 */
        static isDisabled: boolean = true;

        //初始化
        static init(): void {
            let AudioContext = window['AudioContext'] || window['webkitAudioContext'];
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            } else {
                console.warn("音频不支持！可能会没有声音哦！")
            }
            this.isInit = true;
        }

        /**
         * 加载并播放音效
         * @param res 音频资源路径
         * @param loop 是否循环
         * @param isCover 是否覆盖之前音频轨道
         */
        static playSound(res, loop?: number, isCover?: boolean): void {
            if (!this.isDisabled) return;
            if (!this.audioCtx && !this.isInit) this.init();
            if (!this.audioCtx) return;
            let audioRes = Laya.loader.getRes(res);
            if (audioRes) {//有资源
                this.setPlay(res, loop, isCover);//播放
            } else {//加载音频
                this.loadSound(res, () => {
                    this.setPlay(res, loop, isCover);//播放
                })
            }
        }

        //加载音频
        static loadSound(res, fn): void {
            Laya.loader.load([
                { url: res, type: Laya.Loader.SOUND }
            ], Laya.Handler.create(this, fn))
        }

        //停止音频
        static stopSound(res): void {
            if (!this.audioCtx) return;
            if (this.audioList[res]) {
                this.audioList[res].stop();
                this.audioList[res] = null;
            }
        }

        /**
         * 设置音频状态
         * @param state 是否禁用
         */
        static stopSoundState(state: boolean): void {
            this.isDisabled = state;
        }

        //创建音频容器
        static createBufferSource(res): void {
            let audioCtx = this.audioCtx,
                source = audioCtx.createBufferSource();
            source.buffer = Laya.loader.getRes(res).audioBuffer;//  告诉音频源 播放哪一段音频
            source.connect(audioCtx.destination);// 连接到输出源

            //缓存音频
            this.audioList[res] = source;

        }

        //播放音频
        static setPlay(res, loop?: number, isCover?: boolean): void {
            //是否覆盖原始声音
            if (this.audioList[res] && isCover) {
                this.stopSound(res);
            }
            this.createBufferSource(res);
            this.audioList[res].start(0);//开始播放
            this.audioList[res].loop = loop;
        }
    },

    /**
     * 网络延迟功能 时间监听
     */
    TimeDelay: class TimeDelay {
        static oldTime: number;
        /**记录时间开始 */
        static start(): void {
            this.oldTime = Date.now();
        }
        /**时间结束 */
        static end(): number {
            if (!this.oldTime) return 0;
            let oldTime = this.oldTime;
            this.oldTime = 0;
            return Date.now() - oldTime;
        }
    },

    /**
     * 根据两点坐标计算角度 返回孤度
     * @param start 开始坐标
     * @param end 结束坐标
     * @param type 1 返回角度 不传为孤度
     */
    getAngleByPosition: (start: pos, end: pos, type?) => type ? Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI) : Math.atan2(end.y - start.y, end.x - start.x),

    /**
     * 根据孤度计算坐标
     * @param radian 没有转抱成角度的
     */
    getPositionByAngle: (radian: number, radius: number, center: pos) => {
        return {
            x: center.x + radius * Math.cos(radian),
            y: center.y + radius * Math.sin(radian)
        }
    },

    /**
     * 计算两点的距离 
     * @param start 
     * @param end 
     */
    getPositionLength(start: pos, end: pos) {
        let s = end.x - start.x,
            e = end.y - start.y;
        return Math.abs(Math.pow((s * s + e * e), 0.5));
    }
}