let seg,
  segments = [],
  foods = [],
  initialSegmentsAmount = 5,
  currentMouseX = 0,
  currentMouseY = 0,
  characterA,
  targetPosition;

class InputDevice_GluttonousSnake {
  constructor() {
    const Browser = Laya.Browser,
      WebGL = Laya.WebGL,
      Stage = Laya.Stage,
      Stat = Laya.Stat,
      Handler = Laya.Handler,
      Event = Laya.Event,
      Accelerator = Laya.Accelerator;

    // 不支持WebGL时自动切换至Canvas
    Laya.init(Browser.width, Browser.height, WebGL);

    Laya.stage.alignV = Stage.ALIGN_MIDDLE;
    Laya.stage.alignH = Stage.ALIGN_CENTER;

    Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
    Laya.stage.bgColor = "#232628";
    console.log("Laya.stage: ", Laya.stage);

    // 初始化蛇
    this.initSnake();
    // 游戏循环
    Laya.timer.frameLoop(1, this, this.animate);
    // 食物生产
    Laya.timer.loop(3000, this, this.produceFood);
    // 游戏开始时有一个食物
    this.produceFood();

    this.initCharacter();
    Laya.stage.on(Event.MOUSE_DOWN, this, this.onMouseDown);
  }

  initCharacter() {
    const {
      stage: { designWidth, designHeight },
      Tween
    } = Laya;
    this.characterA = this.createCharacter("../laya/assets/comp/1.png");
    this.characterA.pivot(46.5, 50);
    this.characterA.x = designWidth / 2;
    this.characterA.y = designHeight - 100;
  }

  onMouseDown() {
    const {
      Event,
      Tween,
      stage: { mouseX, mouseY }
    } = Laya;
    Tween.to(this.characterA, { y: 0 }, 2000);
    console.log("MOUSE_DOWN mouseX", Laya.stage.mouseX);
    this.currentMouseX = mouseX;
    this.currentMouseY = mouseY;
    Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
    Laya.stage.on(Event.MOUSE_OUT, this, this.onMouseUp);
  }

  onMouseUp() {
    const {
      Event,
      Tween,
      stage: { mouseX, mouseY, designWidth, designHeight }
    } = Laya;
    const offsetX = mouseX - this.currentMouseX,
      offsetY = mouseY - this.currentMouseY;
    // Laya.stage.off(Event.MOUSE_UP, this, this.onMouseUp);
    // Laya.stage.off(Event.MOUSE_OUT, this, this.onMouseUp);

    if (Math.abs(offsetX) > Math.abs(offsetY)) {
      if (offsetX > 0) {
        this.tweenTo({ x: designWidth, y: this.characterA.y });
      } else {
        this.tweenTo({ x: 0, y: this.characterA.y });
      }
    } else {
      if (offsetY > 0) {
        this.tweenTo({ x: this.characterA.x, y: designHeight });
      } else {
        this.tweenTo({ x: this.characterA.x, y: 0 });
      }
    }
  }

  tweenTo(terminal) {
    const { Tween } = Laya;
    // Laya.stage.graphics.drawLine(
    //   terminalX,
    //   0,
    //   terminalX,
    //   Laya.stage.height,
    //   "#FFFFFF"
    // );
    Tween.to(this.characterA, terminal, 2000);
  }

  createCharacter(skin) {
    const Sprite = Laya.Sprite;

    let character = new Sprite();
    character.loadImage(skin);
    Laya.stage.addChild(character);

    return character;
  }

  initSnake() {
    const Point = Laya.Point;

    for (let i = 0; i < initialSegmentsAmount; i++) {
      this.addSegment();

      // 蛇头部设置
      if (i == 0) {
        let header = segments[0];

        // 初始化位置
        header.rotation = 180;
        targetPosition = new Point();
        targetPosition.x = Laya.stage.width / 2;
        targetPosition.y = Laya.stage.height / 2;

        header.pos(targetPosition.x + header.width, targetPosition.y);

        // 蛇眼睛绘制
        header.graphics.drawCircle(header.width, 5, 3, "#000000");
        header.graphics.drawCircle(header.width, -5, 3, "#000000");
      }
    }
  }

  addSegment() {
    let seg = new Segment(40, 30);
    Laya.stage.addChildAt(seg, 0);

    // 蛇尾与上一节身体对齐
    if (segments.length > 0) {
      let prevSeg = segments[segments.length - 1];
      seg.rotation = prevSeg.rotation;
      let point = seg.getPinPosition();
      seg.x = prevSeg.x - point.x;
      seg.y = prevSeg.y - point.y;
    }

    segments.push(seg);
  }

  animate() {
    const Tween = Laya.Tween;
    let seg = segments[0];

    // 更新蛇的位置
    // while (targetPosition.x > 0) {
    //   clearInterval(this.interval);
    //   this.interval = setInterval(targetPosition.x--, 1500);
    // }
    // targetPosition.pivot(46.5, 50);
    Tween.to(targetPosition, { x: 0 }, 0);

    // 限制蛇的移动范围
    this.limitMoveRange();
    // 检测觅食
    this.checkEatFood();

    // 更新所有关节位置
    let targetX = targetPosition.x;
    let targetY = targetPosition.y;

    for (let i = 0, len = segments.length; i < len; i++) {
      seg = segments[i];

      let dx = targetX - seg.x;
      let dy = targetY - seg.y;

      let radian = Math.atan2(dy, dx);
      seg.rotation = (radian * 180) / Math.PI;

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
    if (targetPosition.x < 0) targetPosition.x = 0;
    else if (targetPosition.x > Laya.stage.width)
      targetPosition.x = Laya.stage.width;
    if (targetPosition.y < 0) targetPosition.y = 0;
    else if (targetPosition.y > Laya.stage.height)
      targetPosition.y = Laya.stage.height;
  }

  checkEatFood() {
    let food;
    for (let i = foods.length - 1; i >= 0; i--) {
      food = foods[i];
      if (food.hitTestPoint(targetPosition.x, targetPosition.y)) {
        this.addSegment();
        Laya.stage.removeChild(food);
        foods.splice(i, 1);
      }
    }
  }

  produceFood() {
    const Sprite = Laya.Sprite;

    // 最多五个食物同屏
    if (foods.length == 5) return;

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
    this.graphics.drawRect(
      -this.height / 2,
      -this.height / 2,
      this.width + this.height,
      this.height,
      "#FF7F50"
    );
  }

  // 获取关节另一头位置
  getPinPosition() {
    const Point = Laya.Point;

    let radian = (this.rotation * Math.PI) / 180;
    let tx = this.x + Math.cos(radian) * this.width;
    let ty = this.y + Math.sin(radian) * this.width;

    return new Point(tx, ty);
  }
}

new InputDevice_GluttonousSnake();
