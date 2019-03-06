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
		console.log('Laya', Laya);
		// Accelerator.instance.on(Event.CHANGE, this, this.monitorAccelerator);
		// 游戏循环
		Laya.timer.frameLoop(1, this, this.animate);
		// 食物生产
		Laya.timer.loop(3000, this, this.produceFood);
		// 游戏开始时有一个食物
		this.produceFood();
	}

	_createClass(InputDevice_GluttonousSnake, [{
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
					// header.graphics.drawCircle(header.width, 5, 3, "#000000");
					// header.graphics.drawCircle(header.width, -5, 3, "#000000");
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
			targetPosition.x += vx;
			targetPosition.y += vy;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0Rvd25sb2Fkcy9MYXlhQWlySURFX2JldGEuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TbmFrZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1ZBLElBQ0MsWUFERDtBQUFBLElBRUMsV0FBVyxFQUZaO0FBQUEsSUFHQyxRQUFRLEVBSFQ7QUFBQSxJQUlDLHdCQUF3QixDQUp6QjtBQUFBLElBS0MsS0FBSyxDQUxOO0FBQUEsSUFNQyxLQUFLLENBTk47QUFBQSxJQU9DLHVCQVBEOztJQVNNLDJCO0FBQ0wsd0NBQWM7QUFBQTs7QUFDYixNQUNDLFVBQVUsS0FBSyxPQURoQjtBQUFBLE1BRUMsUUFBUSxLQUFLLEtBRmQ7QUFBQSxNQUdDLFFBQVEsS0FBSyxLQUhkO0FBQUEsTUFJQyxPQUFPLEtBQUssSUFKYjtBQUFBLE1BS0MsVUFBVSxLQUFLLE9BTGhCO0FBQUEsTUFNQyxRQUFRLEtBQUssS0FOZDtBQUFBLE1BT0MsY0FBYyxLQUFLLFdBUHBCOztBQVNBO0FBQ0EsT0FBSyxJQUFMLENBQVUsUUFBUSxLQUFsQixFQUF5QixRQUFRLE1BQWpDLEVBQXlDLEtBQXpDOztBQUVBLE9BQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsTUFBTSxZQUExQjtBQUNBLE9BQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsTUFBTSxZQUExQjs7QUFFQSxPQUFLLEtBQUwsQ0FBVyxTQUFYLEdBQXVCLE1BQU0sYUFBN0I7QUFDQSxPQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLFNBQXJCOztBQUVBO0FBQ0EsT0FBSyxTQUFMO0FBQ007QUFDQSxVQUFRLEdBQVIsQ0FBWSxNQUFaLEVBQW9CLElBQXBCO0FBQ047QUFDQTtBQUNBLE9BQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIs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QUssTUFBTCxLQUFnQixLQUFLLEtBQUwsQ0FBVyxLQUFwQztBQUNBLFFBQUssQ0FBTCxHQUFTLEtBQUssTUFBTCxLQUFnQixLQUFLLEtBQUwsQ0FBVyxNQUFwQztBQUNBOzs7Ozs7SUFHSSxPOzs7QUFDTCxrQkFBWSxLQUFaLEVBQW1CLE1BQW5CLEVBQTJCO0FBQUE7O0FBQUE7O0FBRTFCLFFBQUssSUFBTCxDQUFVLEtBQVYsRUFBaUIsTUFBakI7QUFDQSxRQUFLLElBQUw7QUFIMEI7QUFJMUI7Ozs7eUJBRU07QUFDTixRQUFLLFFBQUwsQ0FBYyxRQUFkLENBQXVCLENBQUMsS0FBSyxNQUFOLEdBQWUsQ0FBdEMsRUFBeUMsQ0FBQyxLQUFLLE1BQU4sR0FBZSxDQUF4RCxFQUEyRCxLQUFLLEtBQUwsR0FBYSxLQUFLLE1BQTdFLEVBQXFGLEtBQUssTUFBMUYsRUFBa0csU0FBbEc7QUFDQTs7QUFFRDs7OzttQ0FDaUI7QUFDaEIsT0FBTSxRQUFRLEtBQUssS0FBbkI7O0FBRUEsT0FBSSxTQUFTLEtBQUssUUFBTCxHQUFnQixLQUFLLEVBQXJCLEdBQTBCLEdBQXZDO0FBQ0EsT0FBSSxLQUFLLEtBQUssQ0FBTCxHQUFTLEtBQUssR0FBTCxDQUFTLE1BQVQsSUFBbUIsS0FBSyxLQUExQztBQUNBLE9BQUksS0FBSyxLQUFLLENBQUwsR0FBUyxLQUFLLEdBQUwsQ0FBUyxNQUFULElBQW1CLEtBQUssS0FBMUM7O0FBRUEsVUFBTyxJQUFJLEtBQUosQ0FBVSxFQUFWLEVBQWMsRUFBZCxDQUFQO0FBQ0E7Ozs7RUFwQm9CLEtBQUssTTs7QUF1QjNCLElBQUksMkJBQUoiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG4oZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibGV0IFxuXHRzZWcsXG5cdHNlZ21lbnRzID0gW10sXG5cdGZvb2RzID0gW10sXG5cdGluaXRpYWxTZWdtZW50c0Ftb3VudCA9IDcsXG5cdHZ4ID0gMCwgXG5cdHZ5ID0gMCxcblx0dGFyZ2V0UG9zaXRpb247XG5cbmNsYXNzIElucHV0RGV2aWNlX0dsdXR0b25vdXNTbmFrZSB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdGNvbnN0IFxuXHRcdFx0QnJvd3NlciA9IExheWEuQnJvd3Nlcixcblx0XHRcdFdlYkdMID0gTGF5YS5XZWJHTCxcblx0XHRcdFN0YWdlID0gTGF5YS5TdGFnZSxcblx0XHRcdFN0YXQgPSBMYXlhLlN0YXQsXG5cdFx0XHRIYW5kbGVyID0gTGF5YS5IYW5kbGVyLFxuXHRcdFx0RXZlbnQgPSBMYXlhLkV2ZW50LFxuXHRcdFx0QWNjZWxlcmF0b3IgPSBMYXlhLkFjY2VsZXJhdG9yO1xuXG5cdFx0Ly8g5LiN5pSv5oyBV2ViR0zml7boh6rliqjliIfmjaLoh7NDYW52YXNcblx0XHRMYXlhLmluaXQoQnJvd3Nlci53aWR0aCwgQnJvd3Nlci5oZWlnaHQsIFdlYkdMKTtcblxuXHRcdExheWEuc3RhZ2UuYWxpZ25WID0gU3RhZ2UuQUxJR05fTUlERExFO1xuXHRcdExheWEuc3RhZ2UuYWxpZ25IID0gU3RhZ2UuQUxJR05fQ0VOVEVSO1xuXG5cdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBTdGFnZS5TQ0FMRV9TSE9XQUxMO1xuXHRcdExheWEuc3RhZ2UuYmdDb2xvciA9IFwiIzIzMjYyOFwiO1xuXG5cdFx0Ly8g5Yid5aeL5YyW6JuHXG5cdFx0dGhpcy5pbml0U25ha2UoKTtcbiAgICAgICAgLy8g55uR6KeG5Yqg6YCf5Zmo54q25oCBXG4gICAgICAgIGNvbnNvbGUubG9nKCdMYXlhJywgTGF5YSlcblx0XHQvLyBBY2NlbGVyYXRvci5pbnN0YW5jZS5vbihFdmVudC5DSEFOR0UsIHRoaXMsIHRoaXMubW9uaXRvckFjY2VsZXJhdG9yKTtcblx0XHQvLyDmuLjmiI/lvqrnjq9cblx0XHRMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLCB0aGlzLCB0aGlzLmFuaW1hdGUpO1xuXHRcdC8vIOmjn+eJqeeUn+S6p1xuXHRcdExheWEudGltZXIubG9vcCgzMDAwLCB0aGlzLCB0aGlzLnByb2R1Y2VGb29kKTtcblx0XHQvLyDmuLjmiI/lvIDlp4vml7bmnInkuIDkuKrpo5/nialcblx0XHR0aGlzLnByb2R1Y2VGb29kKCk7XG5cdH1cblxuXHRpbml0U25ha2UoKSB7XG5cdFx0Y29uc3QgXG5cdFx0XHRQb2ludCA9IExheWEuUG9pbnQ7XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGluaXRpYWxTZWdtZW50c0Ftb3VudDsgaSsrKSB7XG5cdFx0XHR0aGlzLmFkZFNlZ21lbnQoKTtcblx0XHRcdFxuXHRcdFx0Ly8g6JuH5aS06YOo6K6+572uXG5cdFx0XHRpZiAoaSA9PSAwKSB7XG5cdFx0XHRcdGxldCBoZWFkZXIgPSBzZWdtZW50c1swXTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIOWIneWni+WMluS9jee9rlxuXHRcdFx0XHRoZWFkZXIucm90YXRpb24gPSAxODA7XG5cdFx0XHRcdHRhcmdldFBvc2l0aW9uID0gbmV3IFBvaW50KCk7XG5cdFx0XHRcdHRhcmdldFBvc2l0aW9uLnggPSBMYXlhLnN0YWdlLndpZHRoIC8gMjtcblx0XHRcdFx0dGFyZ2V0UG9zaXRpb24ueSA9IExheWEuc3RhZ2UuaGVpZ2h0IC8gMjtcblx0XHRcdFx0XG5cdFx0XHRcdGhlYWRlci5wb3ModGFyZ2V0UG9zaXRpb24ueCArIGhlYWRlci53aWR0aCwgdGFyZ2V0UG9zaXRpb24ueSk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyDom4fnnLznnZvnu5jliLZcblx0XHRcdFx0Ly8gaGVhZGVyLmdyYXBoaWNzLmRyYXdDaXJjbGUoaGVhZGVyLndpZHRoLCA1LCAzLCBcIiMwMDAwMDBcIik7XG5cdFx0XHRcdC8vIGhlYWRlci5ncmFwaGljcy5kcmF3Q2lyY2xlKGhlYWRlci53aWR0aCwgLTUsIDMsIFwiIzAwMDAwMFwiKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRtb25pdG9yQWNjZWxlcmF0b3IoYWNjZWxlcmF0aW9uLCBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5LCByb3RhdGlvblJhdGUsIGludGVydmFsKSB7XG5cdFx0dnggPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lng7XG5cdFx0dnkgPSBhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5Lnk7XG5cdH1cblxuXHRhZGRTZWdtZW50KCkge1xuXHRcdGxldCBzZWcgPSBuZXcgU2VnbWVudCg0MCwgMzApO1xuXHRcdExheWEuc3RhZ2UuYWRkQ2hpbGRBdChzZWcsIDApO1xuXHRcdFxuXHRcdC8vIOibh+WwvuS4juS4iuS4gOiKgui6q+S9k+Wvuem9kFxuXHRcdGlmIChzZWdtZW50cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRsZXQgcHJldlNlZyA9IHNlZ21lbnRzW3NlZ21lbnRzLmxlbmd0aCAtIDFdO1xuXHRcdFx0c2VnLnJvdGF0aW9uID0gcHJldlNlZy5yb3RhdGlvbjtcblx0XHRcdGxldCBwb2ludCA9IHNlZy5nZXRQaW5Qb3NpdGlvbigpO1xuXHRcdFx0c2VnLnggPSBwcmV2U2VnLnggLSBwb2ludC54O1xuXHRcdFx0c2VnLnkgPSBwcmV2U2VnLnkgLSBwb2ludC55O1xuXHRcdH1cblx0XHRcblx0XHRzZWdtZW50cy5wdXNoKHNlZyk7XG5cdH1cblxuXHRhbmltYXRlKCkge1xuXHRcdGxldCBzZWcgPSBzZWdtZW50c1swXTtcblx0XHRcblx0XHQvLyDmm7TmlrDom4fnmoTkvY3nva5cblx0XHR0YXJnZXRQb3NpdGlvbi54ICs9IHZ4O1xuXHRcdHRhcmdldFBvc2l0aW9uLnkgKz0gdnk7XG5cdFx0XG5cdFx0Ly8g6ZmQ5Yi26JuH55qE56e75Yqo6IyD5Zu0XG5cdFx0dGhpcy5saW1pdE1vdmVSYW5nZSgpO1xuXHRcdC8vIOajgOa1i+inhemjn1xuXHRcdHRoaXMuY2hlY2tFYXRGb29kKCk7XG5cdFx0XG5cdFx0Ly8g5pu05paw5omA5pyJ5YWz6IqC5L2N572uXG5cdFx0bGV0IHRhcmdldFggPSB0YXJnZXRQb3NpdGlvbi54O1xuXHRcdGxldCB0YXJnZXRZID0gdGFyZ2V0UG9zaXRpb24ueTtcblx0XHRcblx0XHRmb3IgKGxldCBpID0gMCwgbGVuID0gc2VnbWVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcblx0XHRcdHNlZyA9IHNlZ21lbnRzW2ldO1xuXHRcdFx0XG5cdFx0XHRsZXQgZHggPSB0YXJnZXRYIC0gc2VnLng7XG5cdFx0XHRsZXQgZHkgPSB0YXJnZXRZIC0gc2VnLnk7XG5cdFx0XHRcblx0XHRcdGxldCByYWRpYW4gPSBNYXRoLmF0YW4yKGR5LCBkeCk7XG5cdFx0XHRzZWcucm90YXRpb24gPSByYWRpYW4gKiAxODAgLyBNYXRoLlBJO1xuXHRcdFx0XG5cdFx0XHRsZXQgcGluUG9zaXRpb24gPSBzZWcuZ2V0UGluUG9zaXRpb24oKTtcblx0XHRcdGxldCB3ID0gcGluUG9zaXRpb24ueCAtIHNlZy54O1xuXHRcdFx0bGV0IGggPSBwaW5Qb3NpdGlvbi55IC0gc2VnLnk7XG5cdFx0XHRcblx0XHRcdHNlZy54ID0gdGFyZ2V0WCAtIHc7XG5cdFx0XHRzZWcueSA9IHRhcmdldFkgLSBoO1xuXHRcdFx0XG5cdFx0XHR0YXJnZXRYID0gc2VnLng7XG5cdFx0XHR0YXJnZXRZID0gc2VnLnk7XG5cdFx0fVxuXHR9XG5cdFx0XHRcblx0bGltaXRNb3ZlUmFuZ2UoKSB7XG5cdFx0aWYgKHRhcmdldFBvc2l0aW9uLnggPCAwKVxuXHRcdFx0dGFyZ2V0UG9zaXRpb24ueCA9IDA7XG5cdFx0ZWxzZSBpZiAodGFyZ2V0UG9zaXRpb24ueCA+IExheWEuc3RhZ2Uud2lkdGgpXG5cdFx0XHR0YXJnZXRQb3NpdGlvbi54ID0gTGF5YS5zdGFnZS53aWR0aDtcblx0XHRpZiAodGFyZ2V0UG9zaXRpb24ueSA8IDApXG5cdFx0XHR0YXJnZXRQb3NpdGlvbi55ID0gMDtcblx0XHRlbHNlIGlmICh0YXJnZXRQb3NpdGlvbi55ID4gTGF5YS5zdGFnZS5oZWlnaHQpXG5cdFx0XHR0YXJnZXRQb3NpdGlvbi55ID0gTGF5YS5zdGFnZS5oZWlnaHQ7XG5cdH1cblx0XHRcdFxuXHRjaGVja0VhdEZvb2QoKSB7XG5cdFx0bGV0IGZvb2Q7XG5cdFx0Zm9yIChsZXQgaSA9IGZvb2RzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG5cdFx0XHRmb29kID0gZm9vZHNbaV07XG5cdFx0XHRpZiAoZm9vZC5oaXRUZXN0UG9pbnQodGFyZ2V0UG9zaXRpb24ueCwgdGFyZ2V0UG9zaXRpb24ueSkpIHtcblx0XHRcdFx0dGhpcy5hZGRTZWdtZW50KCk7XG5cdFx0XHRcdExheWEuc3RhZ2UucmVtb3ZlQ2hpbGQoZm9vZCk7XG5cdFx0XHRcdGZvb2RzLnNwbGljZShpLCAxKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0XHRcdFxuXHRwcm9kdWNlRm9vZCgpIHtcblx0XHRjb25zdCBTcHJpdGUgPSBMYXlhLlNwcml0ZTtcblxuXHRcdC8vIOacgOWkmuS6lOS4qumjn+eJqeWQjOWxj1xuXHRcdGlmIChmb29kcy5sZW5ndGggPT0gNSlcblx0XHRcdHJldHVybjtcblx0XHRcblx0XHRsZXQgZm9vZCA9IG5ldyBTcHJpdGUoKTtcblx0XHRMYXlhLnN0YWdlLmFkZENoaWxkKGZvb2QpO1xuXHRcdGZvb2RzLnB1c2goZm9vZCk7XG5cdFx0XG5cdFx0Y29uc3QgZm9vZFNpemUgPSA0MDtcblx0XHRmb29kLnNpemUoZm9vZFNpemUsIGZvb2RTaXplKTtcblx0XHRmb29kLmdyYXBoaWNzLmRyYXdSZWN0KDAsIDAsIGZvb2RTaXplLCBmb29kU2l6ZSwgXCIjMDBCRkZGXCIpO1xuXHRcdFxuXHRcdGZvb2QueCA9IE1hdGgucmFuZG9tKCkgKiBMYXlhLnN0YWdlLndpZHRoO1xuXHRcdGZvb2QueSA9IE1hdGgucmFuZG9tKCkgKiBMYXlhLnN0YWdlLmhlaWdodDtcblx0fVxufVxuXG5jbGFzcyBTZWdtZW50IGV4dGVuZHMgTGF5YS5TcHJpdGUge1xuXHRjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnNpemUod2lkdGgsIGhlaWdodCk7XG5cdFx0dGhpcy5pbml0KCk7XG5cdH1cblx0XG5cdGluaXQoKSB7XG5cdFx0dGhpcy5ncmFwaGljcy5kcmF3UmVjdCgtdGhpcy5oZWlnaHQgLyAyLCAtdGhpcy5oZWlnaHQgLyAyLCB0aGlzLndpZHRoICsgdGhpcy5oZWlnaHQsIHRoaXMuaGVpZ2h0LCBcIiNGRjdGNTBcIik7XG5cdH1cblx0XG5cdC8vIOiOt+WPluWFs+iKguWPpuS4gOWktOS9jee9rlxuXHRnZXRQaW5Qb3NpdGlvbigpIHtcblx0XHRjb25zdCBQb2ludCA9IExheWEuUG9pbnQ7XG5cblx0XHRsZXQgcmFkaWFuID0gdGhpcy5yb3RhdGlvbiAqIE1hdGguUEkgLyAxODA7XG5cdFx0bGV0IHR4ID0gdGhpcy54ICsgTWF0aC5jb3MocmFkaWFuKSAqIHRoaXMud2lkdGg7XG5cdFx0bGV0IHR5ID0gdGhpcy55ICsgTWF0aC5zaW4ocmFkaWFuKSAqIHRoaXMud2lkdGg7XG5cdFx0XG5cdFx0cmV0dXJuIG5ldyBQb2ludCh0eCwgdHkpO1xuXHR9XG59XG5cbm5ldyBJbnB1dERldmljZV9HbHV0dG9ub3VzU25ha2UoKTsiXX0=
