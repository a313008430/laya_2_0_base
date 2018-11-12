/**
 * 音频音效管理
 */
class SoundManage extends Laya.SoundManager {
    /**是否开启 */
    static soundIsOn: boolean = true;
    /**
     * 播放音效
     */
    static playSound(url: string, loops?: number, complete?: Laya.Handler, startTime?: number): Laya.SoundChannel {
        if (!this.soundIsOn) return;
        let SoundChannel: Laya.SoundChannel = super.playSound(url, loops, complete, startTime);

        return SoundChannel;
    }
    /**
     * 播放音乐
     */
    static playMusic(url: string, loops?: number, complete?: Laya.Handler, startTime?: number): Laya.SoundChannel {
        // console.log(this.soundIsOn)
        if (!this.soundIsOn) return;
        let SoundChannel: Laya.SoundChannel = super.playMusic(url, loops, complete, startTime);

        return SoundChannel;
    }

    /**
     * 设置开关
     */
    static setSwitch(type: boolean): void {
        this.soundIsOn = type;
    }
}

/**音频资源  */
const AudioRes = {
    /**准备 */
    ready: 'res/audio/ready.mp3',
    /**开始 */
    start: 'res/audio/go.mp3',
    /**游戏结束 */
    over: 'res/audio/over.mp3',
    /**撞砖 */
    hit: 'res/audio/hit.mp3',
    /**吃金币 */
    eat: 'res/audio/eat.mp3',
}

export {
    SoundManage,
    AudioRes
}