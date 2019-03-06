let
	seg,
	segments = [],
	foods = [],
	initialSegmentsAmount = 7,
	vx = 0,
	vy = 0,
	targetPosition;

class InputDevice_GluttonousSnake {
	constructor() {
		const
			Browser = Laya.Browser,
			WebGL = Laya.WebGL,
			Stage = Laya.Stage,
			Event = Laya.Event;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.width, Browser.height, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		// 初始化蛇
		this.initSnake();
		// 监视滑动
		// Laya.stage.on(Event.MOUSE_DOWN, this, this.onMouseDown);
		// 游戏循环
		Laya.timer.frameLoop(1, this, this.animate);
		// 食物生产
		Laya.timer.loop(3000, this, this.produceFood);
		// 游戏开始时有一个食物
		this.produceFood();
	}

	/**按下事件处理*/
	onMouseDown(e) {
		const Event = Laya.Event;

		//添加鼠标移到侦听
		Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);
		buttonPosition = this.button.x;

		Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
		Laya.stage.on(Event.MOUSE_OUT, this, this.onMouseUp);
	}

	initSnake() {
		const
			Point = Laya.Point;

		for (let i = 0; i < initialSegmentsAmount; i++) {

			// 蛇头部设置
			if (i == 0) {
				let seg = new Segment(40, 30);
				Laya.stage.addChildAt(seg, 0);
				segments.push(seg);
				let header = segments[0];

				// 初始化位置
				// header.rotation = 180;
				targetPosition = new Point();
				targetPosition.x = Laya.stage.width / 2;
				targetPosition.y = Laya.stage.height / 2;

				header.pos(targetPosition.x + header.width, targetPosition.y);
			}
		}
	}

	monitorAccelerator(acceleration, accelerationIncludingGravity, rotationRate, interval) {
		vx = accelerationIncludingGravity.x;
		vy = accelerationIncludingGravity.y;
	}

	animate() {
		let seg = segments[0];

		// 更新蛇的位置
		targetPosition.x += vx;
		targetPosition.y += vy;

		// 限制蛇的移动范围
		this.limitMoveRange();
		// 检测觅食
		// this.checkEatFood();

		// 更新所有关节位置
		let targetX = targetPosition.x;
		let targetY = targetPosition.y;

		for (let i = 0, len = segments.length; i < len; i++) {
			seg = segments[i];

			let dx = targetX - seg.x;
			let dy = targetY - seg.y;

			let radian = Math.atan2(dy, dx);
			seg.rotation = radian * 180 / Math.PI;

			let pinPosition = seg.getPinPosition();
			let w = pinPosition.x - seg.x;
			let h = pinPosition.y - seg.y;

			seg.x = targetX - w;
			seg.y = targetY - h;

			targetX = seg.x;
			targetY = seg.y;
		}
	}

	limitMoveRange() {
		if (targetPosition.x < 0)
			targetPosition.x = 0;
		else if (targetPosition.x > Laya.stage.width)
			targetPosition.x = Laya.stage.width;
		if (targetPosition.y < 0)
			targetPosition.y = 0;
		else if (targetPosition.y > Laya.stage.height)
			targetPosition.y = Laya.stage.height;
	}

	checkEatFood() {
		let food;
		for (let i = foods.length - 1; i >= 0; i--) {
			food = foods[i];
			if (food.hitTestPoint(targetPosition.x, targetPosition.y)) {
				Laya.stage.removeChild(food);
				foods.splice(i, 1);
			}
		}
	}

	produceFood() {
		const Sprite = Laya.Sprite;

		// 最多五个食物同屏
		if (foods.length == 5)
			return;

		let food = new Sprite();
		Laya.stage.addChild(food);
		foods.push(food);

		const foodSize = 40;
		food.size(foodSize, foodSize);
		food.graphics.drawRect(0, 0, foodSize, foodSize, "#00BFFF");

		food.x = Math.random() * Laya.stage.width;
		food.y = Math.random() * Laya.stage.height;
	}
}

class Segment extends Laya.Sprite {
	constructor(width, height) {
		super();
		this.size(width, height);
		this.init();
	}
	
	init() {
		this.graphics.drawRect(-this.height / 2, -this.height / 2, this.width + this.height, this.height, "#FF7F50");
	}
	
	// 获取关节另一头位置
	getPinPosition() {
		const Point = Laya.Point;

		let radian = this.rotation * Math.PI / 180;
		let tx = this.x + Math.cos(radian) * this.width;
		let ty = this.y + Math.sin(radian) * this.width;
		
		return new Point(tx, ty);
	}
}

new InputDevice_GluttonousSnake();