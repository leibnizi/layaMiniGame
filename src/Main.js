// import GameConfig from "./GameConfig";
// class Main {
// 	constructor() {
// 		//根据IDE设置初始化引擎		
// 		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
// 		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
// 		Laya["Physics"] && Laya["Physics"].enable();
// 		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
// 		Laya.stage.scaleMode = GameConfig.scaleMode;
// 		Laya.stage.screenMode = GameConfig.screenMode;
// 		Laya.stage.alignV = GameConfig.alignV;
// 		Laya.stage.alignH = GameConfig.alignH;
// 		//兼容微信不支持加载scene后缀场景
// 		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

// 		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
// 		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
// 		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
// 		if (GameConfig.stat) Laya.Stat.show();
// 		Laya.alertGlobalError = true;

// 		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
// 		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
// 	}

// 	onVersionLoaded() {
// 		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
// 		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
// 	}

// 	onConfigLoaded() {
// 		//加载IDE指定的场景
// 		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
// 	}
// }
// //激活启动类
// new Main();


class Tween_SimpleSample {
	constructor() {
		const 
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Stat = Laya.Stat,
			Handler = Laya.Handler;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		Stat.show();
		this.setup();
	}

	setup() {
		const 
			Sprite = Laya.Sprite,
			Tween = Laya.Tween;

		let terminalX = 200;
		
		let characterA = this.createCharacter("../laya/assets/comp/1.png");
		characterA.pivot(46.5, 50);
		characterA.y = 100;

		let characterB = this.createCharacter("../laya/assets/comp/2.png");
		characterB.pivot(34, 50);
		characterB.y = 250;

		Laya.stage.graphics.drawLine(terminalX, 0, terminalX, Laya.stage.height, "#FFFFFF");
		
		// characterA使用Tween.to缓动
		Tween.to(characterA, { x : terminalX }, 1000);
		// characterB使用Tween.from缓动
		characterB.x = terminalX;
		Tween.from(characterB, { x:0 }, 1000);
	}

	createCharacter(skin) {
		const Sprite = Laya.Sprite;

		let character = new Sprite();
		character.loadImage(skin);
		Laya.stage.addChild(character);

		return character;
	}
}

new Tween_SimpleSample();