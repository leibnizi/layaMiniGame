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
          Tween = _Laya2.Tween;

      Tween.to(this.characterA, { y: 0 }, 2000);
      Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);
    }
  }, {
    key: "tweenRight",
    value: function tweenRight() {
      console.log("Tween: ", Tween);

      // Laya.stage.graphics.drawLine(
      //   terminalX,
      //   0,
      //   terminalX,
      //   Laya.stage.height,
      //   "#FFFFFF"
      // );
      Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
      Tween.to(characterA, { x: terminalX }, 2000);
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
    key: "onMouseUp",
    value: function onMouseUp() {
      var _Laya$stage2 = Laya.stage,
          mouseX = _Laya$stage2.mouseX,
          mouseY = _Laya$stage2.mouseY;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9MYXlhQWlySURFX2JldGEuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TbmFrZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1ZBLElBQUksWUFBSjtBQUFBLElBQ0UsV0FBVyxFQURiO0FBQUEsSUFFRSxRQUFRLEVBRlY7QUFBQSxJQUdFLHdCQUF3QixDQUgxQjtBQUFBLElBSUUsS0FBSyxDQUpQO0FBQUEsSUFLRSxLQUFLLENBTFA7QUFBQSxJQU1FLG1CQU5GO0FBQUEsSUFPRSx1QkFQRjs7SUFTTSwyQjtBQUNKLHlDQUFjO0FBQUE7O0FBQ1osUUFBTSxVQUFVLEtBQUssT0FBckI7QUFBQSxRQUNFLFFBQVEsS0FBSyxLQURmO0FBQUEsUUFFRSxRQUFRLEtBQUssS0FGZjtBQUFBLFFBR0UsT0FBTyxLQUFLLElBSGQ7QUFBQSxRQUlFLFVBQVUsS0FBSyxPQUpqQjtBQUFBLFFBS0UsUUFBUSxLQUFLLEtBTGY7QUFBQSxRQU1FLGNBQWMsS0FBSyxXQU5yQjs7QUFRQTtBQUNBLFNBQUssSUFBTCxDQUFVLFFBQVEsS0FBbEIsRUFBeUIsUUFBUSxNQUFqQyxFQUF5QyxLQUF6Qzs7QUFFQSxTQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLE1BQU0sWUFBMUI7QUFDQSxTQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLE1BQU0sWUFBMUI7O0FBRUEsU0FBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixNQUFNLGFBQTdCO0FBQ0EsU0FBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixTQUFyQjtBQUNBLFlBQVEsR0FBUixDQUFZLGNBQVosRUFBNEIsS0FBSyxLQUFqQzs7QUFFQTtBQUNBLFNBQUssU0FBTDtBQUNBO0FBQ0EsU0FBSyxL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VUFBSSxLQUFLLEtBQUssQ0FBTCxHQUFTLEtBQUssR0FBTCxDQUFTLE1BQVQsSUFBbUIsS0FBSyxLQUExQztBQUNBLFVBQUksS0FBSyxLQUFLLENBQUwsR0FBUyxLQUFLLEdBQUwsQ0FBUyxNQUFULElBQW1CLEtBQUssS0FBMUM7O0FBRUEsYUFBTyxJQUFJLEtBQUosQ0FBVSxFQUFWLEVBQWMsRUFBZCxDQUFQO0FBQ0Q7Ozs7RUExQm1CLEtBQUssTTs7QUE2QjNCLElBQUksMkJBQUoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibGV0IHNlZyxcbiAgc2VnbWVudHMgPSBbXSxcbiAgZm9vZHMgPSBbXSxcbiAgaW5pdGlhbFNlZ21lbnRzQW1vdW50ID0gNSxcbiAgdnggPSAwLFxuICB2eSA9IDAsXG4gIGNoYXJhY3RlckEsXG4gIHRhcmdldFBvc2l0aW9uO1xuXG5jbGFzcyBJbnB1dERldmljZV9HbHV0dG9ub3VzU25ha2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBjb25zdCBCcm93c2VyID0gTGF5YS5Ccm93c2VyLFxuICAgICAgV2ViR0wgPSBMYXlhLldlYkdMLFxuICAgICAgU3RhZ2UgPSBMYXlhLlN0YWdlLFxuICAgICAgU3RhdCA9IExheWEuU3RhdCxcbiAgICAgIEhhbmRsZXIgPSBMYXlhLkhhbmRsZXIsXG4gICAgICBFdmVudCA9IExheWEuRXZlbnQsXG4gICAgICBBY2NlbGVyYXRvciA9IExheWEuQWNjZWxlcmF0b3I7XG5cbiAgICAvLyDkuI3mlK/mjIFXZWJHTOaXtuiHquWKqOWIh+aNouiHs0NhbnZhc1xuICAgIExheWEuaW5pdChCcm93c2VyLndpZHRoLCBCcm93c2VyLmhlaWdodCwgV2ViR0wpO1xuXG4gICAgTGF5YS5zdGFnZS5hbGlnblYgPSBTdGFnZS5BTElHTl9NSURETEU7XG4gICAgTGF5YS5zdGFnZS5hbGlnbkggPSBTdGFnZS5BTElHTl9DRU5URVI7XG5cbiAgICBMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IFN0YWdlLlNDQUxFX1NIT1dBTEw7XG4gICAgTGF5YS5zdGFnZS5iZ0NvbG9yID0gXCIjMjMyNjI4XCI7XG4gICAgY29uc29sZS5sb2coXCJMYXlhLnN0YWdlOiBcIiwgTGF5YS5zdGFnZSk7XG5cbiAgICAvLyDliJ3lp4vljJbom4dcbiAgICB0aGlzLmluaXRTbmFrZSgpO1xuICAgIC8vIOa4uOaIj+W+queOr1xuICAgIExheWEudGltZXIuZnJhbWVMb29wKDEsIHRoaXMsIHRoaXMuYW5pbWF0ZSk7XG4gICAgLy8g6aOf54mp55Sf5LqnXG4gICAgTGF5YS50aW1lci5sb29wKDMwMDAsIHRoaXMsIHRoaXMucHJvZHVjZUZvb2QpO1xuICAgIC8vIOa4uOaIj+W8gOWni+aXtuacieS4gOS4qumjn+eJqVxuICAgIHRoaXMucHJvZHVjZUZvb2QoKTtcblxuICAgIHRoaXMuaW5pdENoYXJhY3RlcigpO1xuICAgIExheWEuc3RhZ2Uub24oRXZlbnQuTU9VU0VfRE9XTiwgdGhpcywgdGhpcy5vbk1vdXNlRG93bik7XG4gIH1cblxuICBpbml0Q2hhcmFjdGVyKCkge1xuICAgIGNvbnN0IHtcbiAgICAgIHN0YWdlOiB7IGRlc2lnbldpZHRoLCBkZXNpZ25IZWlnaHQgfSxcbiAgICAgIFR3ZWVuXG4gICAgfSA9IExheWE7XG4gICAgdGhpcy5jaGFyYWN0ZXJBID0gdGhpcy5jcmVhdGVDaGFyYWN0ZXIoXCIuLi9sYXlhL2Fzc2V0cy9jb21wLzEucG5nXCIpO1xuICAgIHRoaXMuY2hhcmFjdGVyQS5waXZvdCg0Ni41LCA1MCk7XG4gICAgdGhpcy5jaGFyYWN0ZXJBLnggPSBkZXNpZ25XaWR0aCAvIDI7XG4gICAgdGhpcy5jaGFyYWN0ZXJBLnkgPSBkZXNpZ25IZWlnaHQgLSAxMDA7XG4gIH1cblxuICBvbk1vdXNlRG93bigpIHtcbiAgICBjb25zdCB7IEV2ZW50LCBUd2VlbiB9ID0gTGF5YTtcbiAgICBUd2Vlbi50byh0aGlzLmNoYXJhY3RlckEsIHsgeTogMCB9LCAyMDAwKTtcbiAgICBMYXlhLnN0YWdlLm9uKEV2ZW50Lk1PVVNFX01PVkUsIHRoaXMsIHRoaXMub25Nb3VzZU1vdmUpO1xuICB9XG5cbiAgdHdlZW5SaWdodCgpIHtcbiAgICBjb25zb2xlLmxvZyhcIlR3ZWVuOiBcIiwgVHdlZW4pO1xuXG4gICAgLy8gTGF5YS5zdGFnZS5ncmFwaGljcy5kcmF3TGluZShcbiAgICAvLyAgIHRlcm1pbmFsWCxcbiAgICAvLyAgIDAsXG4gICAgLy8gICB0ZXJtaW5hbFgsXG4gICAgLy8gICBMYXlhLnN0YWdlLmhlaWdodCxcbiAgICAvLyAgIFwiI0ZGRkZGRlwiXG4gICAgLy8gKTtcbiAgICBMYXlhLnN0YWdlLm9uKEV2ZW50Lk1PVVNFX1VQLCB0aGlzLCB0aGlzLm9uTW91c2VVcCk7XG4gICAgVHdlZW4udG8oY2hhcmFjdGVyQSwgeyB4OiB0ZXJtaW5hbFggfSwgMjAwMCk7XG4gIH1cblxuICBjcmVhdGVDaGFyYWN0ZXIoc2tpbikge1xuICAgIGNvbnN0IFNwcml0ZSA9IExheWEuU3ByaXRlO1xuXG4gICAgbGV0IGNoYXJhY3RlciA9IG5ldyBTcHJpdGUoKTtcbiAgICBjaGFyYWN0ZXIubG9hZEltYWdlKHNraW4pO1xuICAgIExheWEuc3RhZ2UuYWRkQ2hpbGQoY2hhcmFjdGVyKTtcblxuICAgIHJldHVybiBjaGFyYWN0ZXI7XG4gIH1cblxuICBpbml0U25ha2UoKSB7XG4gICAgY29uc3QgUG9pbnQgPSBMYXlhLlBvaW50O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbml0aWFsU2VnbWVudHNBbW91bnQ7IGkrKykge1xuICAgICAgdGhpcy5hZGRTZWdtZW50KCk7XG5cbiAgICAgIC8vIOibh+WktOmDqOiuvue9rlxuICAgICAgaWYgKGkgPT0gMCkge1xuICAgICAgICBsZXQgaGVhZGVyID0gc2VnbWVudHNbMF07XG5cbiAgICAgICAgLy8g5Yid5aeL5YyW5L2N572uXG4gICAgICAgIGhlYWRlci5yb3RhdGlvbiA9IDE4MDtcbiAgICAgICAgdGFyZ2V0UG9zaXRpb24gPSBuZXcgUG9pbnQoKTtcbiAgICAgICAgdGFyZ2V0UG9zaXRpb24ueCA9IExheWEuc3RhZ2Uud2lkdGggLyAyO1xuICAgICAgICB0YXJnZXRQb3NpdGlvbi55ID0gTGF5YS5zdGFnZS5oZWlnaHQgLyAyO1xuXG4gICAgICAgIGhlYWRlci5wb3ModGFyZ2V0UG9zaXRpb24ueCArIGhlYWRlci53aWR0aCwgdGFyZ2V0UG9zaXRpb24ueSk7XG5cbiAgICAgICAgLy8g6JuH55y8552b57uY5Yi2XG4gICAgICAgIGhlYWRlci5ncmFwaGljcy5kcmF3Q2lyY2xlKGhlYWRlci53aWR0aCwgNSwgMywgXCIjMDAwMDAwXCIpO1xuICAgICAgICBoZWFkZXIuZ3JhcGhpY3MuZHJhd0NpcmNsZShoZWFkZXIud2lkdGgsIC01LCAzLCBcIiMwMDAwMDBcIik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZVVwKCkge1xuICAgIGNvbnN0IHsgbW91c2VYLCBtb3VzZVkgfSA9IExheWEuc3RhZ2U7XG4gICAgaWYgKG1vdXNlWCA+IG1vdXNlWSkge1xuICAgICAgdnggPSBtb3VzZVg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZ5ID0gbW91c2VZO1xuICAgIH1cbiAgfVxuXG4gIGFkZFNlZ21lbnQoKSB7XG4gICAgbGV0IHNlZyA9IG5ldyBTZWdtZW50KDQwLCAzMCk7XG4gICAgTGF5YS5zdGFnZS5hZGRDaGlsZEF0KHNlZywgMCk7XG5cbiAgICAvLyDom4flsL7kuI7kuIrkuIDoioLouqvkvZPlr7npvZBcbiAgICBpZiAoc2VnbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHByZXZTZWcgPSBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLSAxXTtcbiAgICAgIHNlZy5yb3RhdGlvbiA9IHByZXZTZWcucm90YXRpb247XG4gICAgICBsZXQgcG9pbnQgPSBzZWcuZ2V0UGluUG9zaXRpb24oKTtcbiAgICAgIHNlZy54ID0gcHJldlNlZy54IC0gcG9pbnQueDtcbiAgICAgIHNlZy55ID0gcHJldlNlZy55IC0gcG9pbnQueTtcbiAgICB9XG5cbiAgICBzZWdtZW50cy5wdXNoKHNlZyk7XG4gIH1cblxuICBhbmltYXRlKCkge1xuICAgIGNvbnN0IFR3ZWVuID0gTGF5YS5Ud2VlbjtcbiAgICBsZXQgc2VnID0gc2VnbWVudHNbMF07XG5cbiAgICAvLyDmm7TmlrDom4fnmoTkvY3nva5cbiAgICAvLyB3aGlsZSAodGFyZ2V0UG9zaXRpb24ueCA+IDApIHtcbiAgICAvLyAgIGNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbCk7XG4gICAgLy8gICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwodGFyZ2V0UG9zaXRpb24ueC0tLCAxNTAwKTtcbiAgICAvLyB9XG4gICAgLy8gdGFyZ2V0UG9zaXRpb24ucGl2b3QoNDYuNSwgNTApO1xuICAgIFR3ZWVuLnRvKHRhcmdldFBvc2l0aW9uLCB7IHg6IDAgfSwgMCk7XG5cbiAgICAvLyDpmZDliLbom4fnmoTnp7vliqjojIPlm7RcbiAgICB0aGlzLmxpbWl0TW92ZVJhbmdlKCk7XG4gICAgLy8g5qOA5rWL6KeF6aOfXG4gICAgdGhpcy5jaGVja0VhdEZvb2QoKTtcblxuICAgIC8vIOabtOaWsOaJgOacieWFs+iKguS9jee9rlxuICAgIGxldCB0YXJnZXRYID0gdGFyZ2V0UG9zaXRpb24ueDtcbiAgICBsZXQgdGFyZ2V0WSA9IHRhcmdldFBvc2l0aW9uLnk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHNlZyA9IHNlZ21lbnRzW2ldO1xuXG4gICAgICBsZXQgZHggPSB0YXJnZXRYIC0gc2VnLng7XG4gICAgICBsZXQgZHkgPSB0YXJnZXRZIC0gc2VnLnk7XG5cbiAgICAgIGxldCByYWRpYW4gPSBNYXRoLmF0YW4yKGR5LCBkeCk7XG4gICAgICBzZWcucm90YXRpb24gPSAocmFkaWFuICogMTgwKSAvIE1hdGguUEk7XG5cbiAgICAgIGxldCBwaW5Qb3NpdGlvbiA9IHNlZy5nZXRQaW5Qb3NpdGlvbigpO1xuICAgICAgbGV0IHcgPSBwaW5Qb3NpdGlvbi54IC0gc2VnLng7XG4gICAgICBsZXQgaCA9IHBpblBvc2l0aW9uLnkgLSBzZWcueTtcblxuICAgICAgc2VnLnggPSB0YXJnZXRYIC0gdztcbiAgICAgIHNlZy55ID0gdGFyZ2V0WSAtIGg7XG5cbiAgICAgIHRhcmdldFggPSBzZWcueDtcbiAgICAgIHRhcmdldFkgPSBzZWcueTtcbiAgICB9XG4gIH1cblxuICBsaW1pdE1vdmVSYW5nZSgpIHtcbiAgICBpZiAodGFyZ2V0UG9zaXRpb24ueCA8IDApIHRhcmdldFBvc2l0aW9uLnggPSAwO1xuICAgIGVsc2UgaWYgKHRhcmdldFBvc2l0aW9uLnggPiBMYXlhLnN0YWdlLndpZHRoKVxuICAgICAgdGFyZ2V0UG9zaXRpb24ueCA9IExheWEuc3RhZ2Uud2lkdGg7XG4gICAgaWYgKHRhcmdldFBvc2l0aW9uLnkgPCAwKSB0YXJnZXRQb3NpdGlvbi55ID0gMDtcbiAgICBlbHNlIGlmICh0YXJnZXRQb3NpdGlvbi55ID4gTGF5YS5zdGFnZS5oZWlnaHQpXG4gICAgICB0YXJnZXRQb3NpdGlvbi55ID0gTGF5YS5zdGFnZS5oZWlnaHQ7XG4gIH1cblxuICBjaGVja0VhdEZvb2QoKSB7XG4gICAgbGV0IGZvb2Q7XG4gICAgZm9yIChsZXQgaSA9IGZvb2RzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBmb29kID0gZm9vZHNbaV07XG4gICAgICBpZiAoZm9vZC5oaXRUZXN0UG9pbnQodGFyZ2V0UG9zaXRpb24ueCwgdGFyZ2V0UG9zaXRpb24ueSkpIHtcbiAgICAgICAgdGhpcy5hZGRTZWdtZW50KCk7XG4gICAgICAgIExheWEuc3RhZ2UucmVtb3ZlQ2hpbGQoZm9vZCk7XG4gICAgICAgIGZvb2RzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm9kdWNlRm9vZCgpIHtcbiAgICBjb25zdCBTcHJpdGUgPSBMYXlhLlNwcml0ZTtcblxuICAgIC8vIOacgOWkmuS6lOS4qumjn+eJqeWQjOWxj1xuICAgIGlmIChmb29kcy5sZW5ndGggPT0gNSkgcmV0dXJuO1xuXG4gICAgbGV0IGZvb2QgPSBuZXcgU3ByaXRlKCk7XG4gICAgTGF5YS5zdGFnZS5hZGRDaGlsZChmb29kKTtcbiAgICBmb29kcy5wdXNoKGZvb2QpO1xuXG4gICAgY29uc3QgZm9vZFNpemUgPSA0MDtcbiAgICBmb29kLnNpemUoZm9vZFNpemUsIGZvb2RTaXplKTtcbiAgICBmb29kLmdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIGZvb2RTaXplLCBmb29kU2l6ZSwgXCIjMDBCRkZGXCIpO1xuXG4gICAgZm9vZC54ID0gTWF0aC5yYW5kb20oKSAqIExheWEuc3RhZ2Uud2lkdGg7XG4gICAgZm9vZC55ID0gTWF0aC5yYW5kb20oKSAqIExheWEuc3RhZ2UuaGVpZ2h0O1xuICB9XG59XG5cbmNsYXNzIFNlZ21lbnQgZXh0ZW5kcyBMYXlhLlNwcml0ZSB7XG4gIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5ncmFwaGljcy5kcmF3UmVjdChcbiAgICAgIC10aGlzLmhlaWdodCAvIDIsXG4gICAgICAtdGhpcy5oZWlnaHQgLyAyLFxuICAgICAgdGhpcy53aWR0aCArIHRoaXMuaGVpZ2h0LFxuICAgICAgdGhpcy5oZWlnaHQsXG4gICAgICBcIiNGRjdGNTBcIlxuICAgICk7XG4gIH1cblxuICAvLyDojrflj5blhbPoioLlj6bkuIDlpLTkvY3nva5cbiAgZ2V0UGluUG9zaXRpb24oKSB7XG4gICAgY29uc3QgUG9pbnQgPSBMYXlhLlBvaW50O1xuXG4gICAgbGV0IHJhZGlhbiA9ICh0aGlzLnJvdGF0aW9uICogTWF0aC5QSSkgLyAxODA7XG4gICAgbGV0IHR4ID0gdGhpcy54ICsgTWF0aC5jb3MocmFkaWFuKSAqIHRoaXMud2lkdGg7XG4gICAgbGV0IHR5ID0gdGhpcy55ICsgTWF0aC5zaW4ocmFkaWFuKSAqIHRoaXMud2lkdGg7XG5cbiAgICByZXR1cm4gbmV3IFBvaW50KHR4LCB0eSk7XG4gIH1cbn1cblxubmV3IElucHV0RGV2aWNlX0dsdXR0b25vdXNTbmFrZSgpO1xuIl19
