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
		Accelerator.instance.on(Event.CHANGE, this, this.monitorAccelerator);
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
					header.graphics.drawCircle(header.width, 5, 3, "#000000");
					header.graphics.drawCircle(header.width, -5, 3, "#000000");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0Rvd25sb2Fkcy9MYXlhQWlySURFX2JldGEuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9TbmFrZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ1ZBLElBQ0MsWUFERDtBQUFBLElBRUMsV0FBVyxFQUZaO0FBQUEsSUFHQyxRQUFRLEVBSFQ7QUFBQSxJQUlDLHdCQUF3QixDQUp6QjtBQUFBLElBS0MsS0FBSyxDQUxOO0FBQUEsSUFNQyxLQUFLLENBTk47QUFBQSxJQU9DLHVCQVBEOztJQVNNLDJCO0FBQ0wsd0NBQWM7QUFBQTs7QUFDYixNQUNDLFVBQVUsS0FBSyxPQURoQjtBQUFBLE1BRUMsUUFBUSxLQUFLLEtBRmQ7QUFBQSxNQUdDLFFBQVEsS0FBSyxLQUhkO0FBQUEsTUFJQyxPQUFPLEtBQUssSUFKYjtBQUFBLE1BS0MsVUFBVSxLQUFLLE9BTGhCO0FBQUEsTUFNQyxRQUFRLEtBQUssS0FOZDtBQUFBLE1BT0MsY0FBYyxLQUFLLFdBUHBCOztBQVNBO0FBQ0EsT0FBSyxJQUFMLENBQVUsUUFBUSxLQUFsQixFQUF5QixRQUFRLE1BQWpDLEVBQXlDLEtBQXpDOztBQUVBLE9BQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsTUFBTSxZQUExQjtBQUNBLE9BQUssS0FBTCxDQUFXLE1BQVgsR0FBb0IsTUFBTSxZQUExQjs7QUFFQSxPQUFLLEtBQUwsQ0FBVyxTQUFYLEdBQXVCLE1BQU0sYUFBN0I7QUFDQSxPQUFLLEtBQUwsQ0FBVyxPQUFYLEdBQXFCLFNBQXJCOztBQUVBO0FBQ0EsT0FBSyxTQUFMO0FBQ0E7QUFDQSxjQUFZLFFBQVosQ0FBcUIsRUFBckIsQ0FBd0IsTUFBTSxNQUE5QixFQUFzQyxJQUF0QyxFQUE0QyxLQUFLLGtCQUFqRDtBQUNB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ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxyXG4gICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xyXG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG4gICAgfTtcclxufSkoKTtcclxuKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImxldCBcblx0c2VnLFxuXHRzZWdtZW50cyA9IFtdLFxuXHRmb29kcyA9IFtdLFxuXHRpbml0aWFsU2VnbWVudHNBbW91bnQgPSA1LFxuXHR2eCA9IDAsIFxuXHR2eSA9IDAsXG5cdHRhcmdldFBvc2l0aW9uO1xuXG5jbGFzcyBJbnB1dERldmljZV9HbHV0dG9ub3VzU25ha2Uge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRjb25zdCBcblx0XHRcdEJyb3dzZXIgPSBMYXlhLkJyb3dzZXIsXG5cdFx0XHRXZWJHTCA9IExheWEuV2ViR0wsXG5cdFx0XHRTdGFnZSA9IExheWEuU3RhZ2UsXG5cdFx0XHRTdGF0ID0gTGF5YS5TdGF0LFxuXHRcdFx0SGFuZGxlciA9IExheWEuSGFuZGxlcixcblx0XHRcdEV2ZW50ID0gTGF5YS5FdmVudCxcblx0XHRcdEFjY2VsZXJhdG9yID0gTGF5YS5BY2NlbGVyYXRvcjtcblxuXHRcdC8vIOS4jeaUr+aMgVdlYkdM5pe26Ieq5Yqo5YiH5o2i6IezQ2FudmFzXG5cdFx0TGF5YS5pbml0KEJyb3dzZXIud2lkdGgsIEJyb3dzZXIuaGVpZ2h0LCBXZWJHTCk7XG5cblx0XHRMYXlhLnN0YWdlLmFsaWduViA9IFN0YWdlLkFMSUdOX01JRERMRTtcblx0XHRMYXlhLnN0YWdlLmFsaWduSCA9IFN0YWdlLkFMSUdOX0NFTlRFUjtcblxuXHRcdExheWEuc3RhZ2Uuc2NhbGVNb2RlID0gU3RhZ2UuU0NBTEVfU0hPV0FMTDtcblx0XHRMYXlhLnN0YWdlLmJnQ29sb3IgPSBcIiMyMzI2MjhcIjtcblxuXHRcdC8vIOWIneWni+WMluibh1xuXHRcdHRoaXMuaW5pdFNuYWtlKCk7XG5cdFx0Ly8g55uR6KeG5Yqg6YCf5Zmo54q25oCBXG5cdFx0QWNjZWxlcmF0b3IuaW5zdGFuY2Uub24oRXZlbnQuQ0hBTkdFLCB0aGlzLCB0aGlzLm1vbml0b3JBY2NlbGVyYXRvcik7XG5cdFx0Ly8g5ri45oiP5b6q546vXG5cdFx0TGF5YS50aW1lci5mcmFtZUxvb3AoMSwgdGhpcywgdGhpcy5hbmltYXRlKTtcblx0XHQvLyDpo5/niannlJ/kuqdcblx0XHRMYXlhLnRpbWVyLmxvb3AoMzAwMCwgdGhpcywgdGhpcy5wcm9kdWNlRm9vZCk7XG5cdFx0Ly8g5ri45oiP5byA5aeL5pe25pyJ5LiA5Liq6aOf54mpXG5cdFx0dGhpcy5wcm9kdWNlRm9vZCgpO1xuXHR9XG5cblx0aW5pdFNuYWtlKCkge1xuXHRcdGNvbnN0IFxuXHRcdFx0UG9pbnQgPSBMYXlhLlBvaW50O1xuXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbml0aWFsU2VnbWVudHNBbW91bnQ7IGkrKykge1xuXHRcdFx0dGhpcy5hZGRTZWdtZW50KCk7XG5cdFx0XHRcblx0XHRcdC8vIOibh+WktOmDqOiuvue9rlxuXHRcdFx0aWYgKGkgPT0gMCkge1xuXHRcdFx0XHRsZXQgaGVhZGVyID0gc2VnbWVudHNbMF07XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyDliJ3lp4vljJbkvY3nva5cblx0XHRcdFx0aGVhZGVyLnJvdGF0aW9uID0gMTgwO1xuXHRcdFx0XHR0YXJnZXRQb3NpdGlvbiA9IG5ldyBQb2ludCgpO1xuXHRcdFx0XHR0YXJnZXRQb3NpdGlvbi54ID0gTGF5YS5zdGFnZS53aWR0aCAvIDI7XG5cdFx0XHRcdHRhcmdldFBvc2l0aW9uLnkgPSBMYXlhLnN0YWdlLmhlaWdodCAvIDI7XG5cdFx0XHRcdFxuXHRcdFx0XHRoZWFkZXIucG9zKHRhcmdldFBvc2l0aW9uLnggKyBoZWFkZXIud2lkdGgsIHRhcmdldFBvc2l0aW9uLnkpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly8g6JuH55y8552b57uY5Yi2XG5cdFx0XHRcdGhlYWRlci5ncmFwaGljcy5kcmF3Q2lyY2xlKGhlYWRlci53aWR0aCwgNSwgMywgXCIjMDAwMDAwXCIpO1xuXHRcdFx0XHRoZWFkZXIuZ3JhcGhpY3MuZHJhd0NpcmNsZShoZWFkZXIud2lkdGgsIC01LCAzLCBcIiMwMDAwMDBcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0bW9uaXRvckFjY2VsZXJhdG9yKGFjY2VsZXJhdGlvbiwgYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSwgcm90YXRpb25SYXRlLCBpbnRlcnZhbCkge1xuXHRcdHZ4ID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS54O1xuXHRcdHZ5ID0gYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eS55O1xuXHR9XG5cblx0YWRkU2VnbWVudCgpIHtcblx0XHRsZXQgc2VnID0gbmV3IFNlZ21lbnQoNDAsIDMwKTtcblx0XHRMYXlhLnN0YWdlLmFkZENoaWxkQXQoc2VnLCAwKTtcblx0XHRcblx0XHQvLyDom4flsL7kuI7kuIrkuIDoioLouqvkvZPlr7npvZBcblx0XHRpZiAoc2VnbWVudHMubGVuZ3RoID4gMCkge1xuXHRcdFx0bGV0IHByZXZTZWcgPSBzZWdtZW50c1tzZWdtZW50cy5sZW5ndGggLSAxXTtcblx0XHRcdHNlZy5yb3RhdGlvbiA9IHByZXZTZWcucm90YXRpb247XG5cdFx0XHRsZXQgcG9pbnQgPSBzZWcuZ2V0UGluUG9zaXRpb24oKTtcblx0XHRcdHNlZy54ID0gcHJldlNlZy54IC0gcG9pbnQueDtcblx0XHRcdHNlZy55ID0gcHJldlNlZy55IC0gcG9pbnQueTtcblx0XHR9XG5cdFx0XG5cdFx0c2VnbWVudHMucHVzaChzZWcpO1xuXHR9XG5cblx0YW5pbWF0ZSgpIHtcblx0XHRsZXQgc2VnID0gc2VnbWVudHNbMF07XG5cdFx0XG5cdFx0Ly8g5pu05paw6JuH55qE5L2N572uXG5cdFx0dGFyZ2V0UG9zaXRpb24ueCArPSB2eDtcblx0XHR0YXJnZXRQb3NpdGlvbi55ICs9IHZ5O1xuXHRcdFxuXHRcdC8vIOmZkOWItuibh+eahOenu+WKqOiMg+WbtFxuXHRcdHRoaXMubGltaXRNb3ZlUmFuZ2UoKTtcblx0XHQvLyDmo4DmtYvop4Xpo59cblx0XHR0aGlzLmNoZWNrRWF0Rm9vZCgpO1xuXHRcdFxuXHRcdC8vIOabtOaWsOaJgOacieWFs+iKguS9jee9rlxuXHRcdGxldCB0YXJnZXRYID0gdGFyZ2V0UG9zaXRpb24ueDtcblx0XHRsZXQgdGFyZ2V0WSA9IHRhcmdldFBvc2l0aW9uLnk7XG5cdFx0XG5cdFx0Zm9yIChsZXQgaSA9IDAsIGxlbiA9IHNlZ21lbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG5cdFx0XHRzZWcgPSBzZWdtZW50c1tpXTtcblx0XHRcdFxuXHRcdFx0bGV0IGR4ID0gdGFyZ2V0WCAtIHNlZy54O1xuXHRcdFx0bGV0IGR5ID0gdGFyZ2V0WSAtIHNlZy55O1xuXHRcdFx0XG5cdFx0XHRsZXQgcmFkaWFuID0gTWF0aC5hdGFuMihkeSwgZHgpO1xuXHRcdFx0c2VnLnJvdGF0aW9uID0gcmFkaWFuICogMTgwIC8gTWF0aC5QSTtcblx0XHRcdFxuXHRcdFx0bGV0IHBpblBvc2l0aW9uID0gc2VnLmdldFBpblBvc2l0aW9uKCk7XG5cdFx0XHRsZXQgdyA9IHBpblBvc2l0aW9uLnggLSBzZWcueDtcblx0XHRcdGxldCBoID0gcGluUG9zaXRpb24ueSAtIHNlZy55O1xuXHRcdFx0XG5cdFx0XHRzZWcueCA9IHRhcmdldFggLSB3O1xuXHRcdFx0c2VnLnkgPSB0YXJnZXRZIC0gaDtcblx0XHRcdFxuXHRcdFx0dGFyZ2V0WCA9IHNlZy54O1xuXHRcdFx0dGFyZ2V0WSA9IHNlZy55O1xuXHRcdH1cblx0fVxuXHRcdFx0XG5cdGxpbWl0TW92ZVJhbmdlKCkge1xuXHRcdGlmICh0YXJnZXRQb3NpdGlvbi54IDwgMClcblx0XHRcdHRhcmdldFBvc2l0aW9uLnggPSAwO1xuXHRcdGVsc2UgaWYgKHRhcmdldFBvc2l0aW9uLnggPiBMYXlhLnN0YWdlLndpZHRoKVxuXHRcdFx0dGFyZ2V0UG9zaXRpb24ueCA9IExheWEuc3RhZ2Uud2lkdGg7XG5cdFx0aWYgKHRhcmdldFBvc2l0aW9uLnkgPCAwKVxuXHRcdFx0dGFyZ2V0UG9zaXRpb24ueSA9IDA7XG5cdFx0ZWxzZSBpZiAodGFyZ2V0UG9zaXRpb24ueSA+IExheWEuc3RhZ2UuaGVpZ2h0KVxuXHRcdFx0dGFyZ2V0UG9zaXRpb24ueSA9IExheWEuc3RhZ2UuaGVpZ2h0O1xuXHR9XG5cdFx0XHRcblx0Y2hlY2tFYXRGb29kKCkge1xuXHRcdGxldCBmb29kO1xuXHRcdGZvciAobGV0IGkgPSBmb29kcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHRcdFx0Zm9vZCA9IGZvb2RzW2ldO1xuXHRcdFx0aWYgKGZvb2QuaGl0VGVzdFBvaW50KHRhcmdldFBvc2l0aW9uLngsIHRhcmdldFBvc2l0aW9uLnkpKSB7XG5cdFx0XHRcdHRoaXMuYWRkU2VnbWVudCgpO1xuXHRcdFx0XHRMYXlhLnN0YWdlLnJlbW92ZUNoaWxkKGZvb2QpO1xuXHRcdFx0XHRmb29kcy5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdFx0XHRcblx0cHJvZHVjZUZvb2QoKSB7XG5cdFx0Y29uc3QgU3ByaXRlID0gTGF5YS5TcHJpdGU7XG5cblx0XHQvLyDmnIDlpJrkupTkuKrpo5/nianlkIzlsY9cblx0XHRpZiAoZm9vZHMubGVuZ3RoID09IDUpXG5cdFx0XHRyZXR1cm47XG5cdFx0XG5cdFx0bGV0IGZvb2QgPSBuZXcgU3ByaXRlKCk7XG5cdFx0TGF5YS5zdGFnZS5hZGRDaGlsZChmb29kKTtcblx0XHRmb29kcy5wdXNoKGZvb2QpO1xuXHRcdFxuXHRcdGNvbnN0IGZvb2RTaXplID0gNDA7XG5cdFx0Zm9vZC5zaXplKGZvb2RTaXplLCBmb29kU2l6ZSk7XG5cdFx0Zm9vZC5ncmFwaGljcy5kcmF3UmVjdCgwLCAwLCBmb29kU2l6ZSwgZm9vZFNpemUsIFwiIzAwQkZGRlwiKTtcblx0XHRcblx0XHRmb29kLnggPSBNYXRoLnJhbmRvbSgpICogTGF5YS5zdGFnZS53aWR0aDtcblx0XHRmb29kLnkgPSBNYXRoLnJhbmRvbSgpICogTGF5YS5zdGFnZS5oZWlnaHQ7XG5cdH1cbn1cblxuY2xhc3MgU2VnbWVudCBleHRlbmRzIExheWEuU3ByaXRlIHtcblx0Y29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy5zaXplKHdpZHRoLCBoZWlnaHQpO1xuXHRcdHRoaXMuaW5pdCgpO1xuXHR9XG5cdFxuXHRpbml0KCkge1xuXHRcdHRoaXMuZ3JhcGhpY3MuZHJhd1JlY3QoLXRoaXMuaGVpZ2h0IC8gMiwgLXRoaXMuaGVpZ2h0IC8gMiwgdGhpcy53aWR0aCArIHRoaXMuaGVpZ2h0LCB0aGlzLmhlaWdodCwgXCIjRkY3RjUwXCIpO1xuXHR9XG5cdFxuXHQvLyDojrflj5blhbPoioLlj6bkuIDlpLTkvY3nva5cblx0Z2V0UGluUG9zaXRpb24oKSB7XG5cdFx0Y29uc3QgUG9pbnQgPSBMYXlhLlBvaW50O1xuXG5cdFx0bGV0IHJhZGlhbiA9IHRoaXMucm90YXRpb24gKiBNYXRoLlBJIC8gMTgwO1xuXHRcdGxldCB0eCA9IHRoaXMueCArIE1hdGguY29zKHJhZGlhbikgKiB0aGlzLndpZHRoO1xuXHRcdGxldCB0eSA9IHRoaXMueSArIE1hdGguc2luKHJhZGlhbikgKiB0aGlzLndpZHRoO1xuXHRcdFxuXHRcdHJldHVybiBuZXcgUG9pbnQodHgsIHR5KTtcblx0fVxufVxuXG5uZXcgSW5wdXREZXZpY2VfR2x1dHRvbm91c1NuYWtlKCk7Il19
