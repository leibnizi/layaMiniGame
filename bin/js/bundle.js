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
    currentMouseX = 0,
    currentMouseY = 0,
    characterA = void 0,
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

  _createClass(InputDevice_GluttonousSnake, [{
    key: "initCharacter",
    value: function initCharacter() {
      var _Laya = Laya,
          _Laya$stage = _Laya.stage,
          designWidth = _Laya$stage.designWidth,
          designHeight = _Laya$stage.designHeight,
          Tween = _Laya.Tween;

      this.characterA = this.createCharacter("../laya/assets/comp/1.png");
      this.characterA.pivot(46.5, 50);
      this.characterA.x = designWidth / 2;
      this.characterA.y = designHeight - 100;
    }
  }, {
    key: "onMouseDown",
    value: function onMouseDown() {
      var _Laya2 = Laya,
          Event = _Laya2.Event,
          Tween = _Laya2.Tween,
          _Laya2$stage = _Laya2.stage,
          mouseX = _Laya2$stage.mouseX,
          mouseY = _Laya2$stage.mouseY;

      Tween.to(this.characterA, { y: 0 }, 2000);
      console.log("MOUSE_DOWN mouseX", Laya.stage.mouseX);
      this.currentMouseX = mouseX;
      this.currentMouseY = mouseY;
      Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
      Laya.stage.on(Event.MOUSE_OUT, this, this.onMouseUp);
    }
  }, {
    key: "onMouseUp",
    value: function onMouseUp() {
      var _Laya3 = Laya,
          Event = _Laya3.Event,
          Tween = _Laya3.Tween,
          _Laya3$stage = _Laya3.stage,
          mouseX = _Laya3$stage.mouseX,
          mouseY = _Laya3$stage.mouseY,
          designWidth = _Laya3$stage.designWidth,
          designHeight = _Laya3$stage.designHeight;

      var offsetX = mouseX - this.currentMouseX,
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
  }, {
    key: "tweenTo",
    value: function tweenTo(terminal) {
      var _Laya4 = Laya,
          Tween = _Laya4.Tween;
      // Laya.stage.graphics.drawLine(
      //   terminalX,
      //   0,
      //   terminalX,
      //   Laya.stage.height,
      //   "#FFFFFF"
      // );

      Tween.to(this.characterA, terminal, 2000);
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
      var Tween = Laya.Tween;
      var seg = segments[0];

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9MYXlhQWlySURFX2JldGEuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TbmFrZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1ZBLElBQUksWUFBSjtBQUFBLElBQ0UsV0FBVyxFQURiO0FBQUEsSUFFRSxRQUFRLEVBRlY7QUFBQSxJQUdFLHdCQUF3QixDQUgxQjtBQUFBLElBSUUsZ0JBQWdCLENBSmxCO0FBQUEsSUFLRSxnQkFBZ0IsQ0FMbEI7QUFBQSxJQU1FLG1CQU5GO0FBQUEsSUFPRSx1QkFQRjs7SUFTTSwyQjtBQUNKLHlDQUFjO0FBQUE7O0FBQ1osUUFBTSxVQUFVLEtBQUssT0FBckI7QUFBQSxRQUNFLFFBQVEsS0FBSyxLQURmO0FBQUEsUUFFRSxRQUFRLEtBQUssS0FGZjtBQUFBLFFBR0UsT0FBTyxLQUFLLElBSGQ7QUFBQSxRQUlFLFVBQVUsS0FBSyxPQUpqQjtBQUFBLFFBS0UsUUFBUSxLQUFLLEtBTGY7QUFBQSxRQU1FLGNBQWMsS0FBSyxXQU5yQjs7QUFRQTtBQUNBLFNBQUssSUFBTCxDQUFVLFFBQVEsS0FBbEIsRUFBeUIsUUFBUSxNQUFqQyxFQUF5QyxLQUF6Qzs7QUFFQSxTQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLE1BQU0sWUFBMUI7QUFDQSxTQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLE1BQU0sWUFBMUI7O0FBRUEsU0FBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixNQUFNLGFBQTdCO0FBQ0EsU0FBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixTQUFyQjtBQUNBLFlBQVEsR0FBUixDQUFZLGNBQVosRUFBNEIsS0FBSyxLQUFqQzs7QUFFQTtBQUNBLFNBQUssU0FBTDtBQUNBO0FBQ0Es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OztBQUVBLGFBQU8sSUFBSSxLQUFKLENBQVUsRUFBVixFQUFjLEVBQWQsQ0FBUDtBQUNEOzs7O0VBMUJtQixLQUFLLE07O0FBNkIzQixJQUFJLDJCQUFKIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImxldCBzZWcsXG4gIHNlZ21lbnRzID0gW10sXG4gIGZvb2RzID0gW10sXG4gIGluaXRpYWxTZWdtZW50c0Ftb3VudCA9IDUsXG4gIGN1cnJlbnRNb3VzZVggPSAwLFxuICBjdXJyZW50TW91c2VZID0gMCxcbiAgY2hhcmFjdGVyQSxcbiAgdGFyZ2V0UG9zaXRpb247XG5cbmNsYXNzIElucHV0RGV2aWNlX0dsdXR0b25vdXNTbmFrZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGNvbnN0IEJyb3dzZXIgPSBMYXlhLkJyb3dzZXIsXG4gICAgICBXZWJHTCA9IExheWEuV2ViR0wsXG4gICAgICBTdGFnZSA9IExheWEuU3RhZ2UsXG4gICAgICBTdGF0ID0gTGF5YS5TdGF0LFxuICAgICAgSGFuZGxlciA9IExheWEuSGFuZGxlcixcbiAgICAgIEV2ZW50ID0gTGF5YS5FdmVudCxcbiAgICAgIEFjY2VsZXJhdG9yID0gTGF5YS5BY2NlbGVyYXRvcjtcblxuICAgIC8vIOS4jeaUr+aMgVdlYkdM5pe26Ieq5Yqo5YiH5o2i6IezQ2FudmFzXG4gICAgTGF5YS5pbml0KEJyb3dzZXIud2lkdGgsIEJyb3dzZXIuaGVpZ2h0LCBXZWJHTCk7XG5cbiAgICBMYXlhLnN0YWdlLmFsaWduViA9IFN0YWdlLkFMSUdOX01JRERMRTtcbiAgICBMYXlhLnN0YWdlLmFsaWduSCA9IFN0YWdlLkFMSUdOX0NFTlRFUjtcblxuICAgIExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gU3RhZ2UuU0NBTEVfU0hPV0FMTDtcbiAgICBMYXlhLnN0YWdlLmJnQ29sb3IgPSBcIiMyMzI2MjhcIjtcbiAgICBjb25zb2xlLmxvZyhcIkxheWEuc3RhZ2U6IFwiLCBMYXlhLnN0YWdlKTtcblxuICAgIC8vIOWIneWni+WMluibh1xuICAgIHRoaXMuaW5pdFNuYWtlKCk7XG4gICAgLy8g5ri45oiP5b6q546vXG4gICAgTGF5YS50aW1lci5mcmFtZUxvb3AoMSwgdGhpcywgdGhpcy5hbmltYXRlKTtcbiAgICAvLyDpo5/niannlJ/kuqdcbiAgICBMYXlhLnRpbWVyLmxvb3AoMzAwMCwgdGhpcywgdGhpcy5wcm9kdWNlRm9vZCk7XG4gICAgLy8g5ri45oiP5byA5aeL5pe25pyJ5LiA5Liq6aOf54mpXG4gICAgdGhpcy5wcm9kdWNlRm9vZCgpO1xuXG4gICAgdGhpcy5pbml0Q2hhcmFjdGVyKCk7XG4gICAgTGF5YS5zdGFnZS5vbihFdmVudC5NT1VTRV9ET1dOLCB0aGlzLCB0aGlzLm9uTW91c2VEb3duKTtcbiAgfVxuXG4gIGluaXRDaGFyYWN0ZXIoKSB7XG4gICAgY29uc3Qge1xuICAgICAgc3RhZ2U6IHsgZGVzaWduV2lkdGgsIGRlc2lnbkhlaWdodCB9LFxuICAgICAgVHdlZW5cbiAgICB9ID0gTGF5YTtcbiAgICB0aGlzLmNoYXJhY3RlckEgPSB0aGlzLmNyZWF0ZUNoYXJhY3RlcihcIi4uL2xheWEvYXNzZXRzL2NvbXAvMS5wbmdcIik7XG4gICAgdGhpcy5jaGFyYWN0ZXJBLnBpdm90KDQ2LjUsIDUwKTtcbiAgICB0aGlzLmNoYXJhY3RlckEueCA9IGRlc2lnbldpZHRoIC8gMjtcbiAgICB0aGlzLmNoYXJhY3RlckEueSA9IGRlc2lnbkhlaWdodCAtIDEwMDtcbiAgfVxuXG4gIG9uTW91c2VEb3duKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIEV2ZW50LFxuICAgICAgVHdlZW4sXG4gICAgICBzdGFnZTogeyBtb3VzZVgsIG1vdXNlWSB9XG4gICAgfSA9IExheWE7XG4gICAgVHdlZW4udG8odGhpcy5jaGFyYWN0ZXJBLCB7IHk6IDAgfSwgMjAwMCk7XG4gICAgY29uc29sZS5sb2coXCJNT1VTRV9ET1dOIG1vdXNlWFwiLCBMYXlhLnN0YWdlLm1vdXNlWCk7XG4gICAgdGhpcy5jdXJyZW50TW91c2VYID0gbW91c2VYO1xuICAgIHRoaXMuY3VycmVudE1vdXNlWSA9IG1vdXNlWTtcbiAgICBMYXlhLnN0YWdlLm9uKEV2ZW50Lk1PVVNFX1VQLCB0aGlzLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgTGF5YS5zdGFnZS5vbihFdmVudC5NT1VTRV9PVVQsIHRoaXMsIHRoaXMub25Nb3VzZVVwKTtcbiAgfVxuXG4gIG9uTW91c2VVcCgpIHtcbiAgICBjb25zdCB7XG4gICAgICBFdmVudCxcbiAgICAgIFR3ZWVuLFxuICAgICAgc3RhZ2U6IHsgbW91c2VYLCBtb3VzZVksIGRlc2lnbldpZHRoLCBkZXNpZ25IZWlnaHQgfVxuICAgIH0gPSBMYXlhO1xuICAgIGNvbnN0IG9mZnNldFggPSBtb3VzZVggLSB0aGlzLmN1cnJlbnRNb3VzZVgsXG4gICAgICBvZmZzZXRZID0gbW91c2VZIC0gdGhpcy5jdXJyZW50TW91c2VZO1xuICAgIC8vIExheWEuc3RhZ2Uub2ZmKEV2ZW50Lk1PVVNFX1VQLCB0aGlzLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgLy8gTGF5YS5zdGFnZS5vZmYoRXZlbnQuTU9VU0VfT1VULCB0aGlzLCB0aGlzLm9uTW91c2VVcCk7XG5cbiAgICBpZiAoTWF0aC5hYnMob2Zmc2V0WCkgPiBNYXRoLmFicyhvZmZzZXRZKSkge1xuICAgICAgaWYgKG9mZnNldFggPiAwKSB7XG4gICAgICAgIHRoaXMudHdlZW5Ubyh7IHg6IGRlc2lnbldpZHRoLCB5OiB0aGlzLmNoYXJhY3RlckEueSB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHdlZW5Ubyh7IHg6IDAsIHk6IHRoaXMuY2hhcmFjdGVyQS55IH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob2Zmc2V0WSA+IDApIHtcbiAgICAgICAgdGhpcy50d2VlblRvKHsgeDogdGhpcy5jaGFyYWN0ZXJBLngsIHk6IGRlc2lnbkhlaWdodCB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudHdlZW5Ubyh7IHg6IHRoaXMuY2hhcmFjdGVyQS54LCB5OiAwIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHR3ZWVuVG8odGVybWluYWwpIHtcbiAgICBjb25zdCB7IFR3ZWVuIH0gPSBMYXlhO1xuICAgIC8vIExheWEuc3RhZ2UuZ3JhcGhpY3MuZHJhd0xpbmUoXG4gICAgLy8gICB0ZXJtaW5hbFgsXG4gICAgLy8gICAwLFxuICAgIC8vICAgdGVybWluYWxYLFxuICAgIC8vICAgTGF5YS5zdGFnZS5oZWlnaHQsXG4gICAgLy8gICBcIiNGRkZGRkZcIlxuICAgIC8vICk7XG4gICAgVHdlZW4udG8odGhpcy5jaGFyYWN0ZXJBLCB0ZXJtaW5hbCwgMjAwMCk7XG4gIH1cblxuICBjcmVhdGVDaGFyYWN0ZXIoc2tpbikge1xuICAgIGNvbnN0IFNwcml0ZSA9IExheWEuU3ByaXRlO1xuXG4gICAgbGV0IGNoYXJhY3RlciA9IG5ldyBTcHJpdGUoKTtcbiAgICBjaGFyYWN0ZXIubG9hZEltYWdlKHNraW4pO1xuICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoY2hhcmFjdGVyKTtcblxuICAgIHJldHVybiBjaGFyYWN0ZXI7XG4gIH1cblxuICBpbml0U25ha2UoKSB7XG4gICAgY29uc3QgUG9pbnQgPSBMYXlhLlBvaW50O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbml0aWFsU2VnbWVudHNBbW91bnQ7IGkrKykge1xuICAgICAgdGhpcy5hZGRTZWdtZW50KCk7XG5cbiAgICAgIC8vIOibh+WktOmDqOiuvue9rlxuICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICBsZXQgaGVhZGVyID0gc2VnbWVudHNbMF07XG5cbiAgICAgICAgLy8g5Yid5aeL5YyW5L2N572uXG4gICAgICAgIGhlYWRlci5yb3RhdGlvbiA9IDE4MDtcbiAgICAgICAgdGFyZ2V0UG9zaXRpb24gPSBuZXcgUG9pbnQoKTtcbiAgICAgICAgdGFyZ2V0UG9zaXRpb24ueCA9IExheWEuc3RhZ2Uud2lkdGggLyAyO1xuICAgICAgICB0YXJnZXRQb3NpdGlvbi55ID0gTGF5YS5zdGFnZS5oZWlnaHQgLyAyO1xuXG4gICAgICAgIGhlYWRlci5wb3ModGFyZ2V0UG9zaXRpb24ueCArIGhlYWRlci53aWR0aCwgdGFyZ2V0UG9zaXRpb24ueSk7XG5cbiAgICAgICAgLy8g6JuH55y8552b57uY5Yi2XG4gICAgICAgIGhlYWRlci5ncmFwaGljcy5kcmF3Q2lyY2xlKGhlYWRlci53aWR0aCwgNSwgMywgXCIjMDAwMDAwXCIpO1xuICAgICAgICBoZWFkZXIuZ3JhcGhpY3MuZHJhd0NpcmNsZShoZWFkZXIud2lkdGgsIC01LCAzLCBcIiMwMDAwMDBcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkU2VnbWVudCgpIHtcbiAgICBsZXQgc2VnID0gbmV3IFNlZ21lbnQoNDAsIDMwKTtcbiAgICBMYXlhLnN0YWdlLmFkZENoaWxkQXQoc2VnLCAwKTtcblxuICAgIC8vIOibh+WwvuS4juS4iuS4gOiKgui6q+S9k+Wvuem9kFxuICAgIGlmIChzZWdtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgcHJldlNlZyA9IHNlZ21lbnRzW3NlZ21lbnRzLmxlbmd0aCAtIDFdO1xuICAgICAgc2VnLnJvdGF0aW9uID0gcHJldlNlZy5yb3RhdGlvbjtcbiAgICAgIGxldCBwb2ludCA9IHNlZy5nZXRQaW5Qb3NpdGlvbigpO1xuICAgICAgc2VnLnggPSBwcmV2U2VnLnggLSBwb2ludC54O1xuICAgICAgc2VnLnkgPSBwcmV2U2VnLnkgLSBwb2ludC55O1xuICAgIH1cblxuICAgIHNlZ21lbnRzLnB1c2goc2VnKTtcbiAgfVxuXG4gIGFuaW1hdGUoKSB7XG4gICAgY29uc3QgVHdlZW4gPSBMYXlhLlR3ZWVuO1xuICAgIGxldCBzZWcgPSBzZWdtZW50c1swXTtcblxuICAgIC8vIOabtOaWsOibh+eahOS9jee9rlxuICAgIC8vIHdoaWxlICh0YXJnZXRQb3NpdGlvbi54ID4gMCkge1xuICAgIC8vICAgY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKTtcbiAgICAvLyAgIHRoaXMuaW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCh0YXJnZXRQb3NpdGlvbi54LS0sIDE1MDApO1xuICAgIC8vIH1cbiAgICAvLyB0YXJnZXRQb3NpdGlvbi5waXZvdCg0Ni41LCA1MCk7XG4gICAgVHdlZW4udG8odGFyZ2V0UG9zaXRpb24sIHsgeDogMCB9LCAwKTtcblxuICAgIC8vIOmZkOWItuibh+eahOenu+WKqOiMg+WbtFxuICAgIHRoaXMubGltaXRNb3ZlUmFuZ2UoKTtcbiAgICAvLyDmo4DmtYvop4Xpo59cbiAgICB0aGlzLmNoZWNrRWF0Rm9vZCgpO1xuXG4gICAgLy8g5pu05paw5omA5pyJ5YWz6IqC5L2N572uXG4gICAgbGV0IHRhcmdldFggPSB0YXJnZXRQb3NpdGlvbi54O1xuICAgIGxldCB0YXJnZXRZID0gdGFyZ2V0UG9zaXRpb24ueTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBzZWdtZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc2VnID0gc2VnbWVudHNbaV07XG5cbiAgICAgIGxldCBkeCA9IHRhcmdldFggLSBzZWcueDtcbiAgICAgIGxldCBkeSA9IHRhcmdldFkgLSBzZWcueTtcblxuICAgICAgbGV0IHJhZGlhbiA9IE1hdGguYXRhbjIoZHksIGR4KTtcbiAgICAgIHNlZy5yb3RhdGlvbiA9IChyYWRpYW4gKiAxODApIC8gTWF0aC5QSTtcblxuICAgICAgbGV0IHBpblBvc2l0aW9uID0gc2VnLmdldFBpblBvc2l0aW9uKCk7XG4gICAgICBsZXQgdyA9IHBpblBvc2l0aW9uLnggLSBzZWcueDtcbiAgICAgIGxldCBoID0gcGluUG9zaXRpb24ueSAtIHNlZy55O1xuXG4gICAgICBzZWcueCA9IHRhcmdldFggLSB3O1xuICAgICAgc2VnLnkgPSB0YXJnZXRZIC0gaDtcblxuICAgICAgdGFyZ2V0WCA9IHNlZy54O1xuICAgICAgdGFyZ2V0WSA9IHNlZy55O1xuICAgIH1cbiAgfVxuXG4gIGxpbWl0TW92ZVJhbmdlKCkge1xuICAgIGlmICh0YXJnZXRQb3NpdGlvbi54IDwgMCkgdGFyZ2V0UG9zaXRpb24ueCA9IDA7XG4gICAgZWxzZSBpZiAodGFyZ2V0UG9zaXRpb24ueCA+IExheWEuc3RhZ2Uud2lkdGgpXG4gICAgICB0YXJnZXRQb3NpdGlvbi54ID0gTGF5YS5zdGFnZS53aWR0aDtcbiAgICBpZiAodGFyZ2V0UG9zaXRpb24ueSA8IDApIHRhcmdldFBvc2l0aW9uLnkgPSAwO1xuICAgIGVsc2UgaWYgKHRhcmdldFBvc2l0aW9uLnkgPiBMYXlhLnN0YWdlLmhlaWdodClcbiAgICAgIHRhcmdldFBvc2l0aW9uLnkgPSBMYXlhLnN0YWdlLmhlaWdodDtcbiAgfVxuXG4gIGNoZWNrRWF0Rm9vZCgpIHtcbiAgICBsZXQgZm9vZDtcbiAgICBmb3IgKGxldCBpID0gZm9vZHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGZvb2QgPSBmb29kc1tpXTtcbiAgICAgIGlmIChmb29kLmhpdFRlc3RQb2ludCh0YXJnZXRQb3NpdGlvbi54LCB0YXJnZXRQb3NpdGlvbi55KSkge1xuICAgICAgICB0aGlzLmFkZFNlZ21lbnQoKTtcbiAgICAgICAgTGF5YS5zdGFnZS5yZW1vdmVDaGlsZChmb29kKTtcbiAgICAgICAgZm9vZHMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb2R1Y2VGb29kKCkge1xuICAgIGNvbnN0IFNwcml0ZSA9IExheWEuU3ByaXRlO1xuXG4gICAgLy8g5pyA5aSa5LqU5Liq6aOf54mp5ZCM5bGPXG4gICAgaWYgKGZvb2RzLmxlbmd0aCA9PSA1KSByZXR1cm47XG5cbiAgICBsZXQgZm9vZCA9IG5ldyBTcHJpdGUoKTtcbiAgICBMYXlhLnN0YWdlLmFkZENoaWxkKGZvb2QpO1xuICAgIGZvb2RzLnB1c2goZm9vZCk7XG5cbiAgICBjb25zdCBmb29kU2l6ZSA9IDQwO1xuICAgIGZvb2Quc2l6ZShmb29kU2l6ZSwgZm9vZFNpemUpO1xuICAgIGZvb2QuZ3JhcGhpY3MuZHJhd1JlY3QoMCwgMCwgZm9vZFNpemUsIGZvb2RTaXplLCBcIiMwMEJGRkZcIik7XG5cbiAgICBmb29kLnggPSBNYXRoLnJhbmRvbSgpICogTGF5YS5zdGFnZS53aWR0aDtcbiAgICBmb29kLnkgPSBNYXRoLnJhbmRvbSgpICogTGF5YS5zdGFnZS5oZWlnaHQ7XG4gIH1cbn1cblxuY2xhc3MgU2VnbWVudCBleHRlbmRzIExheWEuU3ByaXRlIHtcbiAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmdyYXBoaWNzLmRyYXdSZWN0KFxuICAgICAgLXRoaXMuaGVpZ2h0IC8gMixcbiAgICAgIC10aGlzLmhlaWdodCAvIDIsXG4gICAgICB0aGlzLndpZHRoICsgdGhpcy5oZWlnaHQsXG4gICAgICB0aGlzLmhlaWdodCxcbiAgICAgIFwiI0ZGN0Y1MFwiXG4gICAgKTtcbiAgfVxuXG4gIC8vIOiOt+WPluWFs+iKguWPpuS4gOWktOS9jee9rlxuICBnZXRQaW5Qb3NpdGlvbigpIHtcbiAgICBjb25zdCBQb2ludCA9IExheWEuUG9pbnQ7XG5cbiAgICBsZXQgcmFkaWFuID0gKHRoaXMucm90YXRpb24gKiBNYXRoLlBJKSAvIDE4MDtcbiAgICBsZXQgdHggPSB0aGlzLnggKyBNYXRoLmNvcyhyYWRpYW4pICogdGhpcy53aWR0aDtcbiAgICBsZXQgdHkgPSB0aGlzLnkgKyBNYXRoLnNpbihyYWRpYW4pICogdGhpcy53aWR0aDtcblxuICAgIHJldHVybiBuZXcgUG9pbnQodHgsIHR5KTtcbiAgfVxufVxuXG5uZXcgSW5wdXREZXZpY2VfR2x1dHRvbm91c1NuYWtlKCk7XG4iXX0=
