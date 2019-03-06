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
    initialSegmentsAmount = 7,
    vx = 0,
    vy = 0,
    targetPosition = void 0;

var InputDevice_GluttonousSnake = function () {
	function InputDevice_GluttonousSnake() {
		_classCallCheck(this, InputDevice_GluttonousSnake);

		var Browser = Laya.Browser,
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


	_createClass(InputDevice_GluttonousSnake, [{
		key: "onMouseDown",
		value: function onMouseDown(e) {
			var Event = Laya.Event;

			//添加鼠标移到侦听
			Laya.stage.on(Event.MOUSE_MOVE, this, this.onMouseMove);
			buttonPosition = this.button.x;

			Laya.stage.on(Event.MOUSE_UP, this, this.onMouseUp);
			Laya.stage.on(Event.MOUSE_OUT, this, this.onMouseUp);
		}
	}, {
		key: "initSnake",
		value: function initSnake() {
			var Point = Laya.Point;

			for (var i = 0; i < initialSegmentsAmount; i++) {

				// 蛇头部设置
				if (i == 0) {
					var _seg = new Segment(40, 30);
					Laya.stage.addChildAt(_seg, 0);
					segments.push(_seg);
					var header = segments[0];

					// 初始化位置
					// header.rotation = 180;
					targetPosition = new Point();
					targetPosition.x = Laya.stage.width / 2;
					targetPosition.y = Laya.stage.height / 2;

					header.pos(targetPosition.x + header.width, targetPosition.y);
				}
			}
		}
	}, {
		key: "monitorAccelerator",
		value: function monitorAccelerator(acceleration, accelerationIncludingGravity, rotationRate, interval) {
			vx = accelerationIncludingGravity.x;
			vy = accelerationIncludingGravity.y;
		}
	}, {
		key: "animate",
		value: function animate() {
			var seg = segments[0];

			// 更新蛇的位置
			targetPosition.x += vx;
			targetPosition.y += vy;

			// 限制蛇的移动范围
			this.limitMoveRange();
			// 检测觅食
			// this.checkEatFood();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9MYXlhQWlySURFX2JldGEuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TbmFrZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1ZBLElBQ0MsWUFERDtBQUFBLElBRUMsV0FBVyxFQUZaO0FBQUEsSUFHQyxRQUFRLEVBSFQ7QUFBQSxJQUlDLHdCQUF3QixDQUp6QjtBQUFBLElBS0MsS0FBSyxDQUxOO0FBQUEsSUFNQyxLQUFLLENBTk47QUFBQSxJQU9DLHVCQVBEOztJQVNNLDJCO0FBQ0wsd0NBQWM7QUFBQTs7QUFDYixNQUNDLFVBQVUsS0FBSyxPQURoQjtBQUFBLE1BRUMsUUFBUSxLQUFLLEtBRmQ7QUFBQSxNQUdDLFFBQVEsS0FBSyxLQUhkO0FBQUEsTUFJQyxRQUFRLEtBQUssS0FKZDs7QUFNQTtBQUNBLE9BQUssSUFBTCxDQUFVLFFBQVEsS0FBbEIsRUFBeUIsUUFBUSxNQUFqQyxFQUF5QyxLQUF6Qzs7QUFFQSxPQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLE1BQU0sWUFBMUI7QUFDQSxPQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLE1BQU0sWUFBMUI7O0FBRUEsT0FBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixNQUFNLGFBQTdCO0FBQ0EsT0FBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixTQUFyQjs7QUFFQTtBQUNBLE9BQUssU0FBTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsQ0FBckIsRUFBd0IsSUFBeEIsRUFBOEIsS0FBSyxPQUFuQztBQUNBO0FBQ0EsT0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixFQUFzQixJQUF0QixFQUE0QixLQUFLLFdBQWpD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O0FBQUE7O0FBQUE7O0FBRTFCLFFBQUssSUFBTCxDQUFVLEtBQVYsRUFBaUIsTUFBakI7QUFDQSxRQUFLLElBQUw7QUFIMEI7QUFJMUI7Ozs7eUJBRU07QUFDTixRQUFLLFFBQUwsQ0FBYyxRQUFkLENBQXVCLENBQUMsS0FBSyxNQUFOLEdBQWUsQ0FBdEMsRUFBeUMsQ0FBQyxLQUFLLE1BQU4sR0FBZSxDQUF4RCxFQUEyRCxLQUFLLEtBQUwsR0FBYSxLQUFLLE1BQTdFLEVBQXFGLEtBQUssTUFBMUYsRUFBa0csU0FBbEc7QUFDQTs7QUFFRDs7OzttQ0FDaUI7QUFDaEIsT0FBTSxRQUFRLEtBQUssS0FBbkI7O0FBRUEsT0FBSSxTQUFTLEtBQUssUUFBTCxHQUFnQixLQUFLLEVBQXJCLEdBQTBCLEdBQXZDO0FBQ0EsT0FBSSxLQUFLLEtBQUssQ0FBTCxHQUFTLEtBQUssR0FBTCxDQUFTLE1BQVQsSUFBbUIsS0FBSyxLQUExQztBQUNBLE9BQUksS0FBSyxLQUFLLENBQUwsR0FBUyxLQUFLLEdBQUwsQ0FBUyxNQUFULElBQW1CLEtBQUssS0FBMUM7O0FBRUEsVUFBTyxJQUFJLEtBQUosQ0FBVSxFQUFWLEVBQWMsRUFBZCxDQUFQO0FBQ0E7Ozs7RUFwQm9CLEtBQUssTTs7QUF1QjNCLElBQUksMkJBQUoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibGV0XG5cdHNlZyxcblx0c2VnbWVudHMgPSBbXSxcblx0Zm9vZHMgPSBbXSxcblx0aW5pdGlhbFNlZ21lbnRzQW1vdW50ID0gNyxcblx0dnggPSAwLFxuXHR2eSA9IDAsXG5cdHRhcmdldFBvc2l0aW9uO1xuXG5jbGFzcyBJbnB1dERldmljZV9HbHV0dG9ub3VzU25ha2Uge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRjb25zdFxuXHRcdFx0QnJvd3NlciA9IExheWEuQnJvd3Nlcixcblx0XHRcdFdlYkdMID0gTGF5YS5XZWJHTCxcblx0XHRcdFN0YWdlID0gTGF5YS5TdGFnZSxcblx0XHRcdEV2ZW50ID0gTGF5YS5FdmVudDtcblxuXHRcdC8vIOS4jeaUr+aMgVdlYkdM5pe26Ieq5Yqo5YiH5o2i6IezQ2FudmFzXG5cdFx0TGF5YS5pbml0KEJyb3dzZXIud2lkdGgsIEJyb3dzZXIuaGVpZ2h0LCBXZWJHTCk7XG5cblx0XHRMYXlhLnN0YWdlLmFsaWduViA9IFN0YWdlLkFMSUdOX01JRERMRTtcblx0XHRMYXlhLnN0YWdlLmFsaWduSCA9IFN0YWdlLkFMSUdOX0NFTlRFUjtcblxuXHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gU3RhZ2UuU0NBTEVfU0hPV0FMTDtcblx0XHRMYXlhLnN0YWdlLmJnQ29sb3IgPSBcIiMyMzI2MjhcIjtcblxuXHRcdC8vIOWIneWni+WMluibh1xuXHRcdHRoaXMuaW5pdFNuYWtlKCk7XG5cdFx0Ly8g55uR6KeG5ruR5YqoXG5cdFx0Ly8gTGF5YS5zdGFnZS5vbihFdmVudC5NT1VTRV9ET1dOLCB0aGlzLCB0aGlzLm9uTW91c2VEb3duKTtcblx0XHQvLyDmuLjmiI/lvqrnjq9cblx0XHRMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLCB0aGlzLCB0aGlzLmFuaW1hdGUpO1xuXHRcdC8vIOmjn+eJqeeUn+S6p1xuXHRcdExheWEudGltZXIubG9vcCgzMDAwLCB0aGlzLCB0aGlzLnByb2R1Y2VGb29kKTtcblx0XHQvLyDmuLjmiI/lvIDlp4vml7bmnInkuIDkuKrpo5/nialcblx0XHR0aGlzLnByb2R1Y2VGb29kKCk7XG5cdH1cblxuXHQvKirmjInkuIvkuovku7blpITnkIYqL1xuXHRvbk1vdXNlRG93bihlKSB7XG5cdFx0Y29uc3QgRXZlbnQgPSBMYXlhLkV2ZW50O1xuXG5cdFx0Ly/mt7vliqDpvKDmoIfnp7vliLDkvqblkKxcblx0XHRMYXlhLnN0YWdlLm9uKEV2ZW50Lk1PVVNFX01PVkUsIHRoaXMsIHRoaXMub25Nb3VzZU1vdmUpO1xuXHRcdGJ1dHRvblBvc2l0aW9uID0gdGhpcy5idXR0b24ueDtcblxuXHRcdExheWEuc3RhZ2Uub24oRXZlbnQuTU9VU0VfVVAsIHRoaXMsIHRoaXMub25Nb3VzZVVwKTtcblx0XHRMYXlhLnN0YWdlLm9uKEV2ZW50Lk1PVVNFX09VVCwgdGhpcywgdGhpcy5vbk1vdXNlVXApO1xuXHR9XG5cblx0aW5pdFNuYWtlKCkge1xuXHRcdGNvbnN0XG5cdFx0XHRQb2ludCA9IExheWEuUG9pbnQ7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGluaXRpYWxTZWdtZW50c0Ftb3VudDsgaSsrKSB7XG5cblx0XHRcdC8vIOibh+WktOmDqOiuvue9rlxuXHRcdFx0aWYgKGkgPT0gMCkge1xuXHRcdFx0XHRsZXQgc2VnID0gbmV3IFNlZ21lbnQoNDAsIDMwKTtcblx0XHRcdFx0TGF5YS5zdGFnZS5hZGRDaGlsZEF0KHNlZywgMCk7XG5cdFx0XHRcdHNlZ21lbnRzLnB1c2goc2VnKTtcblx0XHRcdFx0bGV0IGhlYWRlciA9IHNlZ21lbnRzWzBdO1xuXG5cdFx0XHRcdC8vIOWIneWni+WMluS9jee9rlxuXHRcdFx0XHQvLyBoZWFkZXIucm90YXRpb24gPSAxODA7XG5cdFx0XHRcdHRhcmdldFBvc2l0aW9uID0gbmV3IFBvaW50KCk7XG5cdFx0XHRcdHRhcmdldFBvc2l0aW9uLnggPSBMYXlhLnN0YWdlLndpZHRoIC8gMjtcblx0XHRcdFx0dGFyZ2V0UG9zaXRpb24ueSA9IExheWEuc3RhZ2UuaGVpZ2h0IC8gMjtcblxuXHRcdFx0XHRoZWFkZXIucG9zKHRhcmdldFBvc2l0aW9uLnggKyBoZWFkZXIud2lkdGgsIHRhcmdldFBvc2l0aW9uLnkpO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdG1vbml0b3JBY2NlbGVyYXRvcihhY2NlbGVyYXRpb24sIGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHksIHJvdGF0aW9uUmF0ZSwgaW50ZXJ2YWwpIHtcblx0XHR2eCA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueDtcblx0XHR2eSA9IGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHkueTtcblx0fVxuXG5cdGFuaW1hdGUoKSB7XG5cdFx0bGV0IHNlZyA9IHNlZ21lbnRzWzBdO1xuXG5cdFx0Ly8g5pu05paw6JuH55qE5L2N572uXG5cdFx0dGFyZ2V0UG9zaXRpb24ueCArPSB2eDtcblx0XHR0YXJnZXRQb3NpdGlvbi55ICs9IHZ5O1xuXG5cdFx0Ly8g6ZmQ5Yi26JuH55qE56e75Yqo6IyD5Zu0XG5cdFx0dGhpcy5saW1pdE1vdmVSYW5nZSgpO1xuXHRcdC8vIOajgOa1i+inhemjn1xuXHRcdC8vIHRoaXMuY2hlY2tFYXRGb29kKCk7XG5cblx0XHQvLyDmm7TmlrDmiYDmnInlhbPoioLkvY3nva5cblx0XHRsZXQgdGFyZ2V0WCA9IHRhcmdldFBvc2l0aW9uLng7XG5cdFx0bGV0IHRhcmdldFkgPSB0YXJnZXRQb3NpdGlvbi55O1xuXG5cdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRzZWcgPSBzZWdtZW50c1tpXTtcblxuXHRcdFx0bGV0IGR4ID0gdGFyZ2V0WCAtIHNlZy54O1xuXHRcdFx0bGV0IGR5ID0gdGFyZ2V0WSAtIHNlZy55O1xuXG5cdFx0XHRsZXQgcmFkaWFuID0gTWF0aC5hdGFuMihkeSwgZHgpO1xuXHRcdFx0c2VnLnJvdGF0aW9uID0gcmFkaWFuICogMTgwIC8gTWF0aC5QSTtcblxuXHRcdFx0bGV0IHBpblBvc2l0aW9uID0gc2VnLmdldFBpblBvc2l0aW9uKCk7XG5cdFx0XHRsZXQgdyA9IHBpblBvc2l0aW9uLnggLSBzZWcueDtcblx0XHRcdGxldCBoID0gcGluUG9zaXRpb24ueSAtIHNlZy55O1xuXG5cdFx0XHRzZWcueCA9IHRhcmdldFggLSB3O1xuXHRcdFx0c2VnLnkgPSB0YXJnZXRZIC0gaDtcblxuXHRcdFx0dGFyZ2V0WCA9IHNlZy54O1xuXHRcdFx0dGFyZ2V0WSA9IHNlZy55O1xuXHRcdH1cblx0fVxuXG5cdGxpbWl0TW92ZVJhbmdlKCkge1xuXHRcdGlmICh0YXJnZXRQb3NpdGlvbi54IDwgMClcblx0XHRcdHRhcmdldFBvc2l0aW9uLnggPSAwO1xuXHRcdGVsc2UgaWYgKHRhcmdldFBvc2l0aW9uLnggPiBMYXlhLnN0YWdlLndpZHRoKVxuXHRcdFx0dGFyZ2V0UG9zaXRpb24ueCA9IExheWEuc3RhZ2Uud2lkdGg7XG5cdFx0aWYgKHRhcmdldFBvc2l0aW9uLnkgPCAwKVxuXHRcdFx0dGFyZ2V0UG9zaXRpb24ueSA9IDA7XG5cdFx0ZWxzZSBpZiAodGFyZ2V0UG9zaXRpb24ueSA+IExheWEuc3RhZ2UuaGVpZ2h0KVxuXHRcdFx0dGFyZ2V0UG9zaXRpb24ueSA9IExheWEuc3RhZ2UuaGVpZ2h0O1xuXHR9XG5cblx0Y2hlY2tFYXRGb29kKCkge1xuXHRcdGxldCBmb29kO1xuXHRcdGZvciAobGV0IGkgPSBmb29kcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0Zm9vZCA9IGZvb2RzW2ldO1xuXHRcdFx0aWYgKGZvb2QuaGl0VGVzdFBvaW50KHRhcmdldFBvc2l0aW9uLngsIHRhcmdldFBvc2l0aW9uLnkpKSB7XG5cdFx0XHRcdExheWEuc3RhZ2UucmVtb3ZlQ2hpbGQoZm9vZCk7XG5cdFx0XHRcdGZvb2RzLnNwbGljZShpLCAxKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcm9kdWNlRm9vZCgpIHtcblx0XHRjb25zdCBTcHJpdGUgPSBMYXlhLlNwcml0ZTtcblxuXHRcdC8vIOacgOWkmuS6lOS4qumjn+eJqeWQjOWxj1xuXHRcdGlmIChmb29kcy5sZW5ndGggPT0gNSlcblx0XHRcdHJldHVybjtcblxuXHRcdGxldCBmb29kID0gbmV3IFNwcml0ZSgpO1xuXHRcdExheWEuc3RhZ2UuYWRkQ2hpbGQoZm9vZCk7XG5cdFx0Zm9vZHMucHVzaChmb29kKTtcblxuXHRcdGNvbnN0IGZvb2RTaXplID0gNDA7XG5cdFx0Zm9vZC5zaXplKGZvb2RTaXplLCBmb29kU2l6ZSk7XG5cdFx0Zm9vZC5ncmFwaGljcy5kcmF3UmVjdCgwLCAwLCBmb29kU2l6ZSwgZm9vZFNpemUsIFwiIzAwQkZGRlwiKTtcblxuXHRcdGZvb2QueCA9IE1hdGgucmFuZG9tKCkgKiBMYXlhLnN0YWdlLndpZHRoO1xuXHRcdGZvb2QueSA9IE1hdGgucmFuZG9tKCkgKiBMYXlhLnN0YWdlLmhlaWdodDtcblx0fVxufVxuXG5jbGFzcyBTZWdtZW50IGV4dGVuZHMgTGF5YS5TcHJpdGUge1xuXHRjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNpemUod2lkdGgsIGhlaWdodCk7XG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblx0XG5cdGluaXQoKSB7XG5cdFx0dGhpcy5ncmFwaGljcy5kcmF3UmVjdCgtdGhpcy5oZWlnaHQgLyAyLCAtdGhpcy5oZWlnaHQgLyAyLCB0aGlzLndpZHRoICsgdGhpcy5oZWlnaHQsIHRoaXMuaGVpZ2h0LCBcIiNGRjdGNTBcIik7XG5cdH1cblx0XG5cdC8vIOiOt+WPluWFs+iKguWPpuS4gOWktOS9jee9rlxuXHRnZXRQaW5Qb3NpdGlvbigpIHtcblx0XHRjb25zdCBQb2ludCA9IExheWEuUG9pbnQ7XG5cblx0XHRsZXQgcmFkaWFuID0gdGhpcy5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODA7XG5cdFx0bGV0IHR4ID0gdGhpcy54ICsgTWF0aC5jb3MocmFkaWFuKSAqIHRoaXMud2lkdGg7XG5cdFx0bGV0IHR5ID0gdGhpcy55ICsgTWF0aC5zaW4ocmFkaWFuKSAqIHRoaXMud2lkdGg7XG5cdFx0XG5cdFx0cmV0dXJuIG5ldyBQb2ludCh0eCwgdHkpO1xuXHR9XG59XG5cbm5ldyBJbnB1dERldmljZV9HbHV0dG9ub3VzU25ha2UoKTsiXX0=
