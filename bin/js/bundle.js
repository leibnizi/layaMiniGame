var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var seg = void 0,
    segments = [],
    foods = [],
    initialSegmentsAmount = 5,
    vx = 0,
    vy = 0,
    targetPosition = void 0;

var InputDevice_GluttonousSnake = function () {
  function InputDevice_GluttonousSnake() {
    _classCallCheck(this, InputDevice_GluttonousSnake);

    var Browser = Laya.Browser,
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

    // 初始化蛇
    this.initSnake();
    // 监视加速器状态
    Laya.stage.on(Event.MOUSE_DOWN, this, this.onMouseDown);
    // 游戏循环
    Laya.timer.frameLoop(1, this, this.animate);
    // 食物生产
    Laya.timer.loop(3000, this, this.produceFood);
    // 游戏开始时有一个食物
    this.produceFood();

    // Stat.show();
    this.tween();
  }

  _createClass(InputDevice_GluttonousSnake, [{
    key: "tween",
    value: function tween() {
      var Sprite = Laya.Sprite,
          Tween = Laya.Tween;

      var terminalX = 800;

      var characterA = this.createCharacter("../laya/assets/comp/1.png");
      characterA.pivot(46.5, 50);
      characterA.y = 100;

      Laya.stage.graphics.drawLine(terminalX, 0, terminalX, Laya.stage.height, "#FFFFFF");

      // characterA使用Tween.to缓动
      Tween.to(characterA, { x: terminalX }, 1000);
    }
  }, {
    key: "createCharacter",
    value: function createCharacter(skin) {
      var Sprite = Laya.Sprite;

      var character = new Sprite();
      character.loadImage(skin);
      Laya.stage.addChild(character);

      return character;
    }
  }, {
    key: "initSnake",
    value: function initSnake() {
      var Point = Laya.Point;

      for (var i = 0; i < initialSegmentsAmount; i++) {
        this.addSegment();

        // 蛇头部设置
        if (i == 0) {
          var header = segments[0];

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
  }, {
    key: "onMouseDown",
    value: function onMouseDown() {
      var Event = Laya.Event;
      console.log("Laya.stage.mouseX", Laya.stage.mouseX, Laya.stage.mouseY);
      //添加鼠标移到侦听
      Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);

      Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      var _Laya$stage = Laya.stage,
          mouseX = _Laya$stage.mouseX,
          mouseY = _Laya$stage.mouseY;

      if (mouseX > mouseY) {
        vx = mouseX;
      } else {
        vy = mouseY;
      }
    }
  }, {
    key: "addSegment",
    value: function addSegment() {
      var seg = new Segment(40, 30);
      Laya.stage.addChildAt(seg, 0);

      // 蛇尾与上一节身体对齐
      if (segments.length > 0) {
        var prevSeg = segments[segments.length - 1];
        seg.rotation = prevSeg.rotation;
        var point = seg.getPinPosition();
        seg.x = prevSeg.x - point.x;
        seg.y = prevSeg.y - point.y;
      }

      segments.push(seg);
    }
  }, {
    key: "animate",
    value: function animate() {
      var seg = segments[0];

      // 更新蛇的位置
      while (targetPosition.x > 0) {
        clearInterval(this.interval);
        this.interval = setInterval(targetPosition.x--, 1500);
      }
      // targetPosition.y += vy;

      // 限制蛇的移动范围
      this.limitMoveRange();
      // 检测觅食
      this.checkEatFood();

      // 更新所有关节位置
      var targetX = targetPosition.x;
      var targetY = targetPosition.y;

      for (var i = 0, len = segments.length; i < len; i++) {
        seg = segments[i];

        var dx = targetX - seg.x;
        var dy = targetY - seg.y;

        var radian = Math.atan2(dy, dx);
        seg.rotation = radian * 180 / Math.PI;

        var pinPosition = seg.getPinPosition();
        var w = pinPosition.x - seg.x;
        var h = pinPosition.y - seg.y;

        seg.x = targetX - w;
        seg.y = targetY - h;

        targetX = seg.x;
        targetY = seg.y;
      }
    }
  }, {
    key: "limitMoveRange",
    value: function limitMoveRange() {
      if (targetPosition.x < 0) targetPosition.x = 0;else if (targetPosition.x > Laya.stage.width) targetPosition.x = Laya.stage.width;
      if (targetPosition.y < 0) targetPosition.y = 0;else if (targetPosition.y > Laya.stage.height) targetPosition.y = Laya.stage.height;
    }
  }, {
    key: "checkEatFood",
    value: function checkEatFood() {
      var food = void 0;
      for (var i = foods.length - 1; i >= 0; i--) {
        food = foods[i];
        if (food.hitTestPoint(targetPosition.x, targetPosition.y)) {
          this.addSegment();
          Laya.stage.removeChild(food);
          foods.splice(i, 1);
        }
      }
    }
  }, {
    key: "produceFood",
    value: function produceFood() {
      var Sprite = Laya.Sprite;

      // 最多五个食物同屏
      if (foods.length == 5) return;

      var food = new Sprite();
      Laya.stage.addChild(food);
      foods.push(food);

      var foodSize = 40;
      food.size(foodSize, foodSize);
      food.graphics.drawRect(0, 0, foodSize, foodSize, "#00BFFF");

      food.x = Math.random() * Laya.stage.width;
      food.y = Math.random() * Laya.stage.height;
    }
  }]);

  return InputDevice_GluttonousSnake;
}();

var Segment = function (_Laya$Sprite) {
  _inherits(Segment, _Laya$Sprite);

  function Segment(width, height) {
    _classCallCheck(this, Segment);

    var _this = _possibleConstructorReturn(this, (Segment.__proto__ || Object.getPrototypeOf(Segment)).call(this));

    _this.size(width, height);
    _this.init();
    return _this;
  }

  _createClass(Segment, [{
    key: "init",
    value: function init() {
      this.graphics.drawRect(-this.height / 2, -this.height / 2, this.width + this.height, this.height, "#FF7F50");
    }

    // 获取关节另一头位置

  }, {
    key: "getPinPosition",
    value: function getPinPosition() {
      var Point = Laya.Point;

      var radian = this.rotation * Math.PI / 180;
      var tx = this.x + Math.cos(radian) * this.width;
      var ty = this.y + Math.sin(radian) * this.width;

      return new Point(tx, ty);
    }
  }]);

  return Segment;
}(Laya.Sprite);

new InputDevice_GluttonousSnake();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9MYXlhQWlySURFX2JldGEuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TbmFrZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1ZBLElBQUksWUFBSjtBQUFBLElBQ0UsV0FBVyxFQURiO0FBQUEsSUFFRSxRQUFRLEVBRlY7QUFBQSxJQUdFLHdCQUF3QixDQUgxQjtBQUFBLElBSUUsS0FBSyxDQUpQO0FBQUEsSUFLRSxLQUFLLENBTFA7QUFBQSxJQU1FLHVCQU5GOztJQVFNLDJCO0FBQ0oseUNBQWM7QUFBQTs7QUFDWixRQUFNLFVBQVUsS0FBSyxPQUFyQjtBQUFBLFFBQ0UsUUFBUSxLQUFLLEtBRGY7QUFBQSxRQUVFLFFBQVEsS0FBSyxLQUZmO0FBQUEsUUFHRSxPQUFPLEtBQUssSUFIZDtBQUFBLFFBSUUsVUFBVSxLQUFLLE9BSmpCO0FBQUEsUUFLRSxRQUFRLEtBQUssS0FMZjtBQUFBLFFBTUUsY0FBYyxLQUFLLFdBTnJCOztBQVFBO0FBQ0EsU0FBSyxJQUFMLENBQVUsUUFBUSxLQUFsQixFQUF5QixRQUFRLE1BQWpDLEVBQXlDLEtBQXpDOztBQUVBLFNBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsTUFBTSxZQUExQjtBQUNBLFNBQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsTUFBTSxZQUExQjs7QUFFQSxTQUFLLEtBQUwsQ0FBVyxTQUFYLEdBQXVCLE1BQU0sYUFBN0I7QUFDQSxTQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLFNBQXJCOztBQUVBO0FBQ0EsU0FBSyxTQUFMO0FBQ0E7QUFDQSxTQUFLLEtBQUwsQ0FBVyxFQUFYLENBQWMsTUFBTSxVQUFwQixFQUFnQyxJQUFoQyxFQUFzQyxLQUFLLFdBQTND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LENBQVUsRUFBVixFQUFjLEVBQWQsQ0FBUDtBQUNEOzs7O0VBMUJtQixLQUFLLE07O0FBNkIzQixJQUFJLDJCQUFKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImxldCBzZWcsXG4gIHNlZ21lbnRzID0gW10sXG4gIGZvb2RzID0gW10sXG4gIGluaXRpYWxTZWdtZW50c0Ftb3VudCA9IDUsXG4gIHZ4ID0gMCxcbiAgdnkgPSAwLFxuICB0YXJnZXRQb3NpdGlvbjtcblxuY2xhc3MgSW5wdXREZXZpY2VfR2x1dHRvbm91c1NuYWtlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgY29uc3QgQnJvd3NlciA9IExheWEuQnJvd3NlcixcbiAgICAgIFdlYkdMID0gTGF5YS5XZWJHTCxcbiAgICAgIFN0YWdlID0gTGF5YS5TdGFnZSxcbiAgICAgIFN0YXQgPSBMYXlhLlN0YXQsXG4gICAgICBIYW5kbGVyID0gTGF5YS5IYW5kbGVyLFxuICAgICAgRXZlbnQgPSBMYXlhLkV2ZW50LFxuICAgICAgQWNjZWxlcmF0b3IgPSBMYXlhLkFjY2VsZXJhdG9yO1xuXG4gICAgLy8g5LiN5pSv5oyBV2ViR0zml7boh6rliqjliIfmjaLoh7NDYW52YXNcbiAgICBMYXlhLmluaXQoQnJvd3Nlci53aWR0aCwgQnJvd3Nlci5oZWlnaHQsIFdlYkdMKTtcblxuICAgIExheWEuc3RhZ2UuYWxpZ25WID0gU3RhZ2UuQUxJR05fTUlERExFO1xuICAgIExheWEuc3RhZ2UuYWxpZ25IID0gU3RhZ2UuQUxJR05fQ0VOVEVSO1xuXG4gICAgTGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBTdGFnZS5TQ0FMRV9TSE9XQUxMO1xuICAgIExheWEuc3RhZ2UuYmdDb2xvciA9IFwiIzIzMjYyOFwiO1xuXG4gICAgLy8g5Yid5aeL5YyW6JuHXG4gICAgdGhpcy5pbml0U25ha2UoKTtcbiAgICAvLyDnm5Hop4bliqDpgJ/lmajnirbmgIFcbiAgICBMYXlhLnN0YWdlLm9uKEV2ZW50Lk1PVVNFX0RPV04sIHRoaXMsIHRoaXMub25Nb3VzZURvd24pO1xuICAgIC8vIOa4uOaIj+W+queOr1xuICAgIExheWEudGltZXIuZnJhbWVMb29wKDEsIHRoaXMsIHRoaXMuYW5pbWF0ZSk7XG4gICAgLy8g6aOf54mp55Sf5LqnXG4gICAgTGF5YS50aW1lci5sb29wKDMwMDAsIHRoaXMsIHRoaXMucHJvZHVjZUZvb2QpO1xuICAgIC8vIOa4uOaIj+W8gOWni+aXtuacieS4gOS4qumjn+eJqVxuICAgIHRoaXMucHJvZHVjZUZvb2QoKTtcblxuICAgIC8vIFN0YXQuc2hvdygpO1xuICAgIHRoaXMudHdlZW4oKTtcbiAgfVxuXG4gIHR3ZWVuKCkge1xuICAgIGNvbnN0IFNwcml0ZSA9IExheWEuU3ByaXRlLFxuICAgICAgVHdlZW4gPSBMYXlhLlR3ZWVuO1xuXG4gICAgbGV0IHRlcm1pbmFsWCA9IDgwMDtcblxuICAgIGxldCBjaGFyYWN0ZXJBID0gdGhpcy5jcmVhdGVDaGFyYWN0ZXIoXCIuLi9sYXlhL2Fzc2V0cy9jb21wLzEucG5nXCIpO1xuICAgIGNoYXJhY3RlckEucGl2b3QoNDYuNSwgNTApO1xuICAgIGNoYXJhY3RlckEueSA9IDEwMDtcblxuICAgIExheWEuc3RhZ2UuZ3JhcGhpY3MuZHJhd0xpbmUoXG4gICAgICB0ZXJtaW5hbFgsXG4gICAgICAwLFxuICAgICAgdGVybWluYWxYLFxuICAgICAgTGF5YS5zdGFnZS5oZWlnaHQsXG4gICAgICBcIiNGRkZGRkZcIlxuICAgICk7XG5cbiAgICAvLyBjaGFyYWN0ZXJB5L2/55SoVHdlZW4udG/nvJPliqhcbiAgICBUd2Vlbi50byhjaGFyYWN0ZXJBLCB7IHg6IHRlcm1pbmFsWCB9LCAxMDAwKTtcbiAgfVxuXG4gIGNyZWF0ZUNoYXJhY3Rlcihza2luKSB7XG4gICAgY29uc3QgU3ByaXRlID0gTGF5YS5TcHJpdGU7XG5cbiAgICBsZXQgY2hhcmFjdGVyID0gbmV3IFNwcml0ZSgpO1xuICAgIGNoYXJhY3Rlci5sb2FkSW1hZ2Uoc2tpbik7XG4gICAgTGF5YS5zdGFnZS5hZGRDaGlsZChjaGFyYWN0ZXIpO1xuXG4gICAgcmV0dXJuIGNoYXJhY3RlcjtcbiAgfVxuXG4gIGluaXRTbmFrZSgpIHtcbiAgICBjb25zdCBQb2ludCA9IExheWEuUG9pbnQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluaXRpYWxTZWdtZW50c0Ftb3VudDsgaSsrKSB7XG4gICAgICB0aGlzLmFkZFNlZ21lbnQoKTtcblxuICAgICAgLy8g6JuH5aS06YOo6K6+572uXG4gICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgIGxldCBoZWFkZXIgPSBzZWdtZW50c1swXTtcblxuICAgICAgICAvLyDliJ3lp4vljJbkvY3nva5cbiAgICAgICAgaGVhZGVyLnJvdGF0aW9uID0gMTgwO1xuICAgICAgICB0YXJnZXRQb3NpdGlvbiA9IG5ldyBQb2ludCgpO1xuICAgICAgICB0YXJnZXRQb3NpdGlvbi54ID0gTGF5YS5zdGFnZS53aWR0aCAvIDI7XG4gICAgICAgIHRhcmdldFBvc2l0aW9uLnkgPSBMYXlhLnN0YWdlLmhlaWdodCAvIDI7XG5cbiAgICAgICAgaGVhZGVyLnBvcyh0YXJnZXRQb3NpdGlvbi54ICsgaGVhZGVyLndpZHRoLCB0YXJnZXRQb3NpdGlvbi55KTtcblxuICAgICAgICAvLyDom4fnnLznnZvnu5jliLZcbiAgICAgICAgaGVhZGVyLmdyYXBoaWNzLmRyYXdDaXJjbGUoaGVhZGVyLndpZHRoLCA1LCAzLCBcIiMwMDAwMDBcIik7XG4gICAgICAgIGhlYWRlci5ncmFwaGljcy5kcmF3Q2lyY2xlKGhlYWRlci53aWR0aCwgLTUsIDMsIFwiIzAwMDAwMFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbk1vdXNlRG93bigpIHtcbiAgICBjb25zdCBFdmVudCA9IExheWEuRXZlbnQ7XG4gICAgY29uc29sZS5sb2coXCJMYXlhLnN0YWdlLm1vdXNlWFwiLCBMYXlhLnN0YWdlLm1vdXNlWCwgTGF5YS5zdGFnZS5tb3VzZVkpO1xuICAgIC8v5re75Yqg6byg5qCH56e75Yiw5L6m5ZCsXG4gICAgTGF5YS5zdGFnZS5vbihFdmVudC5NT1VTRV9NT1ZFLCB0aGlzLCB0aGlzLm9uTW91c2VNb3ZlKTtcblxuICAgIExheWEuc3RhZ2Uub24oRXZlbnQuTU9VU0VfVVAsIHRoaXMsIHRoaXMub25Nb3VzZVVwKTtcbiAgfVxuXG4gIG9uTW91c2VVcCgpIHtcbiAgICBjb25zdCB7IG1vdXNlWCwgbW91c2VZIH0gPSBMYXlhLnN0YWdlO1xuICAgIGlmIChtb3VzZVggPiBtb3VzZVkpIHtcbiAgICAgIHZ4ID0gbW91c2VYO1xuICAgIH0gZWxzZSB7XG4gICAgICB2eSA9IG1vdXNlWTtcbiAgICB9XG4gIH1cblxuICBhZGRTZWdtZW50KCkge1xuICAgIGxldCBzZWcgPSBuZXcgU2VnbWVudCg0MCwgMzApO1xuICAgIExheWEuc3RhZ2UuYWRkQ2hpbGRBdChzZWcsIDApO1xuXG4gICAgLy8g6JuH5bC+5LiO5LiK5LiA6IqC6Lqr5L2T5a+56b2QXG4gICAgaWYgKHNlZ21lbnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBwcmV2U2VnID0gc2VnbWVudHNbc2VnbWVudHMubGVuZ3RoIC0gMV07XG4gICAgICBzZWcucm90YXRpb24gPSBwcmV2U2VnLnJvdGF0aW9uO1xuICAgICAgbGV0IHBvaW50ID0gc2VnLmdldFBpblBvc2l0aW9uKCk7XG4gICAgICBzZWcueCA9IHByZXZTZWcueCAtIHBvaW50Lng7XG4gICAgICBzZWcueSA9IHByZXZTZWcueSAtIHBvaW50Lnk7XG4gICAgfVxuXG4gICAgc2VnbWVudHMucHVzaChzZWcpO1xuICB9XG5cbiAgYW5pbWF0ZSgpIHtcbiAgICBsZXQgc2VnID0gc2VnbWVudHNbMF07XG5cbiAgICAvLyDmm7TmlrDom4fnmoTkvY3nva5cbiAgICB3aGlsZSAodGFyZ2V0UG9zaXRpb24ueCA+IDApIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwodGFyZ2V0UG9zaXRpb24ueC0tLCAxNTAwKTtcbiAgICB9XG4gICAgLy8gdGFyZ2V0UG9zaXRpb24ueSArPSB2eTtcblxuICAgIC8vIOmZkOWItuibh+eahOenu+WKqOiMg+WbtFxuICAgIHRoaXMubGltaXRNb3ZlUmFuZ2UoKTtcbiAgICAvLyDmo4DmtYvop4Xpo59cbiAgICB0aGlzLmNoZWNrRWF0Rm9vZCgpO1xuXG4gICAgLy8g5pu05paw5omA5pyJ5YWz6IqC5L2N572uXG4gICAgbGV0IHRhcmdldFggPSB0YXJnZXRQb3NpdGlvbi54O1xuICAgIGxldCB0YXJnZXRZID0gdGFyZ2V0UG9zaXRpb24ueTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzZWdtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2VnID0gc2VnbWVudHNbaV07XG5cbiAgICAgIGxldCBkeCA9IHRhcmdldFggLSBzZWcueDtcbiAgICAgIGxldCBkeSA9IHRhcmdldFkgLSBzZWcueTtcblxuICAgICAgbGV0IHJhZGlhbiA9IE1hdGguYXRhbjIoZHksIGR4KTtcbiAgICAgIHNlZy5yb3RhdGlvbiA9IChyYWRpYW4gKiAxODApIC8gTWF0aC5QSTtcblxuICAgICAgbGV0IHBpblBvc2l0aW9uID0gc2VnLmdldFBpblBvc2l0aW9uKCk7XG4gICAgICBsZXQgdyA9IHBpblBvc2l0aW9uLnggLSBzZWcueDtcbiAgICAgIGxldCBoID0gcGluUG9zaXRpb24ueSAtIHNlZy55O1xuXG4gICAgICBzZWcueCA9IHRhcmdldFggLSB3O1xuICAgICAgc2VnLnkgPSB0YXJnZXRZIC0gaDtcblxuICAgICAgdGFyZ2V0WCA9IHNlZy54O1xuICAgICAgdGFyZ2V0WSA9IHNlZy55O1xuICAgIH1cbiAgfVxuXG4gIGxpbWl0TW92ZVJhbmdlKCkge1xuICAgIGlmICh0YXJnZXRQb3NpdGlvbi54IDwgMCkgdGFyZ2V0UG9zaXRpb24ueCA9IDA7XG4gICAgZWxzZSBpZiAodGFyZ2V0UG9zaXRpb24ueCA+IExheWEuc3RhZ2Uud2lkdGgpXG4gICAgICB0YXJnZXRQb3NpdGlvbi54ID0gTGF5YS5zdGFnZS53aWR0aDtcbiAgICBpZiAodGFyZ2V0UG9zaXRpb24ueSA8IDApIHRhcmdldFBvc2l0aW9uLnkgPSAwO1xuICAgIGVsc2UgaWYgKHRhcmdldFBvc2l0aW9uLnkgPiBMYXlhLnN0YWdlLmhlaWdodClcbiAgICAgIHRhcmdldFBvc2l0aW9uLnkgPSBMYXlhLnN0YWdlLmhlaWdodDtcbiAgfVxuXG4gIGNoZWNrRWF0Rm9vZCgpIHtcbiAgICBsZXQgZm9vZDtcbiAgICBmb3IgKGxldCBpID0gZm9vZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGZvb2QgPSBmb29kc1tpXTtcbiAgICAgIGlmIChmb29kLmhpdFRlc3RQb2ludCh0YXJnZXRQb3NpdGlvbi54LCB0YXJnZXRQb3NpdGlvbi55KSkge1xuICAgICAgICB0aGlzLmFkZFNlZ21lbnQoKTtcbiAgICAgICAgTGF5YS5zdGFnZS5yZW1vdmVDaGlsZChmb29kKTtcbiAgICAgICAgZm9vZHMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb2R1Y2VGb29kKCkge1xuICAgIGNvbnN0IFNwcml0ZSA9IExheWEuU3ByaXRlO1xuXG4gICAgLy8g5pyA5aSa5LqU5Liq6aOf54mp5ZCM5bGPXG4gICAgaWYgKGZvb2RzLmxlbmd0aCA9PSA1KSByZXR1cm47XG5cbiAgICBsZXQgZm9vZCA9IG5ldyBTcHJpdGUoKTtcbiAgICBMYXlhLnN0YWdlLmFkZENoaWxkKGZvb2QpO1xuICAgIGZvb2RzLnB1c2goZm9vZCk7XG5cbiAgICBjb25zdCBmb29kU2l6ZSA9IDQwO1xuICAgIGZvb2Quc2l6ZShmb29kU2l6ZSwgZm9vZFNpemUpO1xuICAgIGZvb2QuZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgZm9vZFNpemUsIGZvb2RTaXplLCBcIiMwMEJGRkZcIik7XG5cbiAgICBmb29kLnggPSBNYXRoLnJhbmRvbSgpICogTGF5YS5zdGFnZS53aWR0aDtcbiAgICBmb29kLnkgPSBNYXRoLnJhbmRvbSgpICogTGF5YS5zdGFnZS5oZWlnaHQ7XG4gIH1cbn1cblxuY2xhc3MgU2VnbWVudCBleHRlbmRzIExheWEuU3ByaXRlIHtcbiAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmdyYXBoaWNzLmRyYXdSZWN0KFxuICAgICAgLXRoaXMuaGVpZ2h0IC8gMixcbiAgICAgIC10aGlzLmhlaWdodCAvIDIsXG4gICAgICB0aGlzLndpZHRoICsgdGhpcy5oZWlnaHQsXG4gICAgICB0aGlzLmhlaWdodCxcbiAgICAgIFwiI0ZGN0Y1MFwiXG4gICAgKTtcbiAgfVxuXG4gIC8vIOiOt+WPluWFs+iKguWPpuS4gOWktOS9jee9rlxuICBnZXRQaW5Qb3NpdGlvbigpIHtcbiAgICBjb25zdCBQb2ludCA9IExheWEuUG9pbnQ7XG5cbiAgICBsZXQgcmFkaWFuID0gKHRoaXMucm90YXRpb24gKiBNYXRoLlBJKSAvIDE4MDtcbiAgICBsZXQgdHggPSB0aGlzLnggKyBNYXRoLmNvcyhyYWRpYW4pICogdGhpcy53aWR0aDtcbiAgICBsZXQgdHkgPSB0aGlzLnkgKyBNYXRoLnNpbihyYWRpYW4pICogdGhpcy53aWR0aDtcblxuICAgIHJldHVybiBuZXcgUG9pbnQodHgsIHR5KTtcbiAgfVxufVxuXG5uZXcgSW5wdXREZXZpY2VfR2x1dHRvbm91c1NuYWtlKCk7XG4iXX0=
