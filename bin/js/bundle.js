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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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


var Sprite_Container = function () {
	function Sprite_Container() {
		_classCallCheck(this, Sprite_Container);

		var Browser = Laya.Browser,
		    WebGL = Laya.WebGL,
		    Stage = Laya.Stage;

		// 不支持WebGL时自动切换至Canvas
		Laya.init(Browser.clientWidth, Browser.clientHeight, WebGL);

		Laya.stage.alignV = Stage.ALIGN_MIDDLE;
		Laya.stage.alignH = Stage.ALIGN_CENTER;

		Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
		Laya.stage.bgColor = "#232628";

		this.showApe();
	}

	_createClass(Sprite_Container, [{
		key: "showApe",
		value: function showApe() {
			var Sprite = Laya.Sprite;
			var layoutRadius = 150,
			    radianUnit = Math.PI / 2;
			// 该容器用于装载4张猩猩图片
			this.apesCon = new Sprite();
			Laya.stage.addChild(this.apesCon);

			// 添加4张猩猩图片
			var ape = void 0;
			for (var i = 0; i < 4; i++) {
				ape = new Sprite();
				this.apesCon.addChild(ape);
				ape.loadImage("../laya/assets/comp/image.png");
				ape.pivot(55, 72).pos(Math.cos(radianUnit * i) * layoutRadius, Math.sin(radianUnit * i) * layoutRadius);
			}

			this.apesCon.pos(Laya.stage.width / 2, Laya.stage.height / 2);
			Laya.timer.frameLoop(1, this, this.animate);
		}
	}, {
		key: "animate",
		value: function animate() {
			this.apesCon.rotation += 1;
		}
	}]);

	return Sprite_Container;
}();

new Sprite_Container();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL0Rvd25sb2Fkcy9MYXlhQWlySURFX2JldGEuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9NYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7SUFHTSxnQjtBQUNMLDZCQUFjO0FBQUE7O0FBQ2IsTUFDQyxVQUFVLEtBQUssT0FEaEI7QUFBQSxNQUVDLFFBQVEsS0FBSyxLQUZkO0FBQUEsTUFHQyxRQUFRLEtBQUssS0FIZDs7QUFLQTtBQUNBLE9BQUssSUFBTCxDQUFVLFFBQVEsV0FBbEIsRUFBK0IsUUFBUSxZQUF2QyxFQUFxRCxLQUFyRDs7QUFFQSxPQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLE1BQU0sWUFBMUI7QUFDQSxPQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLE1BQU0sWUFBMUI7O0FBRUEsT0FBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixNQUFNLGFBQTdCO0FBQ0EsT0FBSyxLQUFMLENBQVcsT0FBWCxHQUFxQixTQUFyQjs7QUFFQSxPQUFLLE9BQUw7QUFDQTs7Ozs0QkFFUztBQUNULE9BQ0MsU0FBUyxLQUFLLE1BRGY7QUFFQSxPQUNDLGVBQWUsR0FEaEI7QUFBQSxPQUVDLGFBQWEsS0FBSyxFQUFMLEdBQVUsQ0FGeEI7QUFHQTtBQUNBLFFBQUssT0FBTCxHQUFlLElBQUksTUFBSixFQUFmO0FBQ0EsUUFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixLQUFLLE9BQXpCOztBQUVBO0FBQ0EsT0FBSSxZQUFKO0FBQ0EsUUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLENBQXBCLEVBQXVCLEdBQXZCLEVBQTRCO0FBQzNCLFVBQU0sSUFBSSxNQUFKLEVBQU47QUFDQSxTQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLEdBQXRCO0FBQ0EsUUFBSSxTQUFKO0FBQ0EsUUFBSSxLQUFKLENBQVUsRUFBVixFQUFjLEVBQWQsRUFBa0IsR0FBbEIsQ0FDQyxLQUFLLEdBQUwsQ0FBUyxhQUFhLENBQXRCLElBQTJCLFlBRDVCLEVBRUMsS0FBSyxHQUFMLENBQVMsYUFBYSxDQUF0QixJQUEyQixZQUY1QjtBQUlBOztBQUVELFFBQUssT0FBTCxDQUFhLEdBQWIsQ0FBaUIsS0FBSyxLQUFMLENBQVcsS0FBWCxHQUFtQixDQUFwQyxFQUF1QyxLQUFLLEtBQUwsQ0FBVyxNQUFYLEdBQW9CLENBQTNEO0FBQ0EsUUFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixDQUFyQixFQUF3QixJQUF4QixFQUE4QixLQUFLLE9BQW5DO0FBQ0E7Ozs0QkFFUztBQUNULFFBQUssT0FBTCxDQUFhLFFBQWIsSUFBeUIsQ0FBekI7QUFDQTs7Ozs7O0FBR0YsSUFBSSxnQkFBSiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxuICAgIH07XHJcbn0pKCk7XHJcbihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvLyBpbXBvcnQgR2FtZUNvbmZpZyBmcm9tIFwiLi9HYW1lQ29uZmlnXCI7XHJcbi8vIGNsYXNzIE1haW4ge1xyXG4vLyBcdGNvbnN0cnVjdG9yKCkge1xyXG4vLyBcdFx0Ly/moLnmja5JREXorr7nva7liJ3lp4vljJblvJXmk45cdFx0XHJcbi8vIFx0XHRpZiAod2luZG93W1wiTGF5YTNEXCJdKSBMYXlhM0QuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCk7XHJcbi8vIFx0XHRlbHNlIExheWEuaW5pdChHYW1lQ29uZmlnLndpZHRoLCBHYW1lQ29uZmlnLmhlaWdodCwgTGF5YVtcIldlYkdMXCJdKTtcclxuLy8gXHRcdExheWFbXCJQaHlzaWNzXCJdICYmIExheWFbXCJQaHlzaWNzXCJdLmVuYWJsZSgpO1xyXG4vLyBcdFx0TGF5YVtcIkRlYnVnUGFuZWxcIl0gJiYgTGF5YVtcIkRlYnVnUGFuZWxcIl0uZW5hYmxlKCk7XHJcbi8vIFx0XHRMYXlhLnN0YWdlLnNjYWxlTW9kZSA9IEdhbWVDb25maWcuc2NhbGVNb2RlO1xyXG4vLyBcdFx0TGF5YS5zdGFnZS5zY3JlZW5Nb2RlID0gR2FtZUNvbmZpZy5zY3JlZW5Nb2RlO1xyXG4vLyBcdFx0TGF5YS5zdGFnZS5hbGlnblYgPSBHYW1lQ29uZmlnLmFsaWduVjtcclxuLy8gXHRcdExheWEuc3RhZ2UuYWxpZ25IID0gR2FtZUNvbmZpZy5hbGlnbkg7XHJcbi8vIFx0XHQvL+WFvOWuueW+ruS/oeS4jeaUr+aMgeWKoOi9vXNjZW5l5ZCO57yA5Zy65pmvXHJcbi8vIFx0XHRMYXlhLlVSTC5leHBvcnRTY2VuZVRvSnNvbiA9IEdhbWVDb25maWcuZXhwb3J0U2NlbmVUb0pzb247XHJcblxyXG4vLyBcdFx0Ly/miZPlvIDosIPor5XpnaLmnb/vvIjpgJrov4dJREXorr7nva7osIPor5XmqKHlvI/vvIzmiJbogIV1cmzlnLDlnYDlop7liqBkZWJ1Zz10cnVl5Y+C5pWw77yM5Z2H5Y+v5omT5byA6LCD6K+V6Z2i5p2/77yJXHJcbi8vIFx0XHRpZiAoR2FtZUNvbmZpZy5kZWJ1ZyB8fCBMYXlhLlV0aWxzLmdldFF1ZXJ5U3RyaW5nKFwiZGVidWdcIikgPT0gXCJ0cnVlXCIpIExheWEuZW5hYmxlRGVidWdQYW5lbCgpO1xyXG4vLyBcdFx0aWYgKEdhbWVDb25maWcucGh5c2ljc0RlYnVnICYmIExheWFbXCJQaHlzaWNzRGVidWdEcmF3XCJdKSBMYXlhW1wiUGh5c2ljc0RlYnVnRHJhd1wiXS5lbmFibGUoKTtcclxuLy8gXHRcdGlmIChHYW1lQ29uZmlnLnN0YXQpIExheWEuU3RhdC5zaG93KCk7XHJcbi8vIFx0XHRMYXlhLmFsZXJ0R2xvYmFsRXJyb3IgPSB0cnVlO1xyXG5cclxuLy8gXHRcdC8v5r+A5rS76LWE5rqQ54mI5pys5o6n5Yi277yMdmVyc2lvbi5qc29u55SxSURF5Y+R5biD5Yqf6IO96Ieq5Yqo55Sf5oiQ77yM5aaC5p6c5rKh5pyJ5Lmf5LiN5b2x5ZON5ZCO57ut5rWB56iLXHJcbi8vIFx0XHRMYXlhLlJlc291cmNlVmVyc2lvbi5lbmFibGUoXCJ2ZXJzaW9uLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uVmVyc2lvbkxvYWRlZCksIExheWEuUmVzb3VyY2VWZXJzaW9uLkZJTEVOQU1FX1ZFUlNJT04pO1xyXG4vLyBcdH1cclxuXHJcbi8vIFx0b25WZXJzaW9uTG9hZGVkKCkge1xyXG4vLyBcdFx0Ly/mv4DmtLvlpKflsI/lm77mmKDlsITvvIzliqDovb3lsI/lm77nmoTml7blgJnvvIzlpoLmnpzlj5HnjrDlsI/lm77lnKjlpKflm77lkIjpm4bph4zpnaLvvIzliJnkvJjlhYjliqDovb3lpKflm77lkIjpm4bvvIzogIzkuI3mmK/lsI/lm75cclxuLy8gXHRcdExheWEuQXRsYXNJbmZvTWFuYWdlci5lbmFibGUoXCJmaWxlY29uZmlnLmpzb25cIiwgTGF5YS5IYW5kbGVyLmNyZWF0ZSh0aGlzLCB0aGlzLm9uQ29uZmlnTG9hZGVkKSk7XHJcbi8vIFx0fVxyXG5cclxuLy8gXHRvbkNvbmZpZ0xvYWRlZCgpIHtcclxuLy8gXHRcdC8v5Yqg6L29SURF5oyH5a6a55qE5Zy65pmvXHJcbi8vIFx0XHRHYW1lQ29uZmlnLnN0YXJ0U2NlbmUgJiYgTGF5YS5TY2VuZS5vcGVuKEdhbWVDb25maWcuc3RhcnRTY2VuZSk7XHJcbi8vIFx0fVxyXG4vLyB9XHJcbi8vIC8v5r+A5rS75ZCv5Yqo57G7XHJcbi8vIG5ldyBNYWluKCk7XHJcblxyXG5cclxuY2xhc3MgU3ByaXRlX0NvbnRhaW5lciB7XHJcblx0Y29uc3RydWN0b3IoKSB7XHJcblx0XHRjb25zdCBcclxuXHRcdFx0QnJvd3NlciA9IExheWEuQnJvd3NlcixcclxuXHRcdFx0V2ViR0wgPSBMYXlhLldlYkdMLFxyXG5cdFx0XHRTdGFnZSA9IExheWEuU3RhZ2U7XHJcblxyXG5cdFx0Ly8g5LiN5pSv5oyBV2ViR0zml7boh6rliqjliIfmjaLoh7NDYW52YXNcclxuXHRcdExheWEuaW5pdChCcm93c2VyLmNsaWVudFdpZHRoLCBCcm93c2VyLmNsaWVudEhlaWdodCwgV2ViR0wpO1xyXG5cclxuXHRcdExheWEuc3RhZ2UuYWxpZ25WID0gU3RhZ2UuQUxJR05fTUlERExFO1xyXG5cdFx0TGF5YS5zdGFnZS5hbGlnbkggPSBTdGFnZS5BTElHTl9DRU5URVI7XHJcblxyXG5cdFx0TGF5YS5zdGFnZS5zY2FsZU1vZGUgPSBTdGFnZS5TQ0FMRV9TSE9XQUxMO1xyXG5cdFx0TGF5YS5zdGFnZS5iZ0NvbG9yID0gXCIjMjMyNjI4XCI7XHJcblxyXG5cdFx0dGhpcy5zaG93QXBlKCk7XHJcblx0fVxyXG5cclxuXHRzaG93QXBlKCkge1xyXG5cdFx0Y29uc3QgXHJcblx0XHRcdFNwcml0ZSA9IExheWEuU3ByaXRlO1xyXG5cdFx0Y29uc3QgXHJcblx0XHRcdGxheW91dFJhZGl1cyA9IDE1MCxcclxuXHRcdFx0cmFkaWFuVW5pdCA9IE1hdGguUEkgLyAyO1xyXG5cdFx0Ly8g6K+l5a655Zmo55So5LqO6KOF6L29NOW8oOeMqeeMqeWbvueJh1xyXG5cdFx0dGhpcy5hcGVzQ29uID0gbmV3IFNwcml0ZSgpO1xyXG5cdFx0TGF5YS5zdGFnZS5hZGRDaGlsZCh0aGlzLmFwZXNDb24pO1xyXG5cclxuXHRcdC8vIOa3u+WKoDTlvKDnjKnnjKnlm77niYdcclxuXHRcdGxldCBhcGU7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xyXG5cdFx0XHRhcGUgPSBuZXcgU3ByaXRlKCk7XHJcblx0XHRcdHRoaXMuYXBlc0Nvbi5hZGRDaGlsZChhcGUpO1xyXG5cdFx0XHRhcGUubG9hZEltYWdlKGAuLi9sYXlhL2Fzc2V0cy9jb21wL2ltYWdlLnBuZ2ApO1xyXG5cdFx0XHRhcGUucGl2b3QoNTUsIDcyKS5wb3MoXHJcblx0XHRcdFx0TWF0aC5jb3MocmFkaWFuVW5pdCAqIGkpICogbGF5b3V0UmFkaXVzLFxyXG5cdFx0XHRcdE1hdGguc2luKHJhZGlhblVuaXQgKiBpKSAqIGxheW91dFJhZGl1c1xyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMuYXBlc0Nvbi5wb3MoTGF5YS5zdGFnZS53aWR0aCAvIDIsIExheWEuc3RhZ2UuaGVpZ2h0IC8gMik7XHJcblx0XHRMYXlhLnRpbWVyLmZyYW1lTG9vcCgxLCB0aGlzLCB0aGlzLmFuaW1hdGUpO1xyXG5cdH1cclxuXHJcblx0YW5pbWF0ZSgpIHtcclxuXHRcdHRoaXMuYXBlc0Nvbi5yb3RhdGlvbiArPSAxO1xyXG5cdH1cclxufVxyXG5cclxubmV3IFNwcml0ZV9Db250YWluZXIoKTsiXX0=
