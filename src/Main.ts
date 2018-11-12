import GameConfig from "./GameConfig";
import Game from "./core/Game";

class Main {
	constructor() {
		//根据IDE设置初始化引擎		
		Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
		// Laya["Physics"] && Laya["Physics"].enable();
		// Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		Laya.stage.scaleMode = GameConfig.scaleMode;
		Laya.stage.screenMode = GameConfig.screenMode;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		// if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		// if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();//默认会添加物理引擎，需要注释掉
		if (Laya.Utils.getQueryString("debug")) Laya.Stat.show();
		// Laya.alertGlobalError = true;

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);

		//监听场景resize todo 此功能暂时不用
		//  Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);

		// window['game'] = Game;

		 //是否开启多点触控
		 Laya.MouseManager.multiTouchEnabled = false;
		 //开始监听app交互接口
		 Game.appCore.listenAppFunction();
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
		Game.viewManage.openView(Game.viewConfig.mainScene);
		Game.viewManage.openView(Game.viewConfig.loadView);
		/**加载*/
		Laya.loader.load([
			{ url: 'res/atlas/scene.atlas', type: Laya.Loader.ATLAS },
			{ url: 'res/atlas/result.atlas', type: Laya.Loader.ATLAS },
		], Laya.Handler.create(this, this.onComplete), new Laya.Handler(this, this.onProgress));
	}

	/**
     * 加载完成
     */
	private onComplete(): void {
		console.log('资源加载完成...开始游戏主逻辑');
		//游戏主界面
		Game.viewManage.openView(Game.viewConfig.gameView);
		new Game.socket;
		// new GameSocket();
		// SoundManager.playMusic(AudioRes.background_music, 0);
		// 进入游戏，上报到app进入频道
		if (Game.gameData.channelName && Game.gameData.channelKey)
		    Game.appCore.runAppFunction(Game.appCore.joinLiveChannel, JSON.stringify({
		        channel_name: Game.gameData.channelName,
		        channel_key: Game.gameData.channelKey,
		    }));

		console.error('缺少游戏音频上报')
	}

    /**
     * 加载进度
     */
	private onProgress(e): void {
		Game.eventManage.event(Game.eventType.LOAD_PROGRESS, e);
	}

	/**
     * 场景尺寸改变监听
     */
	// private onResize(): void {
	//     Game.eventManage.event(Game.eventType.RESIZE, { width: Laya.stage.width, height: Laya.stage.height });
	// }
}
//激活启动类
new Main();
