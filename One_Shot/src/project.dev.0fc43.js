window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  gameScript: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "156efwbDV1NUqI3SfYVvYpc", "gameScript");
    "use strict";
    var _cc$Class;
    function _defineProperty(obj, key, value) {
      key in obj ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      }) : obj[key] = value;
      return obj;
    }
    var background = cc.Class((_cc$Class = {
      extends: cc.Component,
      properties: {
        playerNode: cc.Node,
        bulletNode: cc.Node,
        enemyNode: cc.Node,
        scoreLabel: cc.Label,
        hitEffectNode: cc.Node
      },
      onLoad: function onLoad() {
        this.starter = 0;
        this.score = 0;
        this.placePlayer();
        this.placeEnemy();
        this.isHit = false;
        this.gameOver = false;
      },
      onDestroy: function onDestroy() {
        this.playerNode.off("touchstart", this.snipe, this);
      },
      update: function update() {
        if (!this.gameOver && (this.enemyNode.position.sub(this.bulletNode.position).mag() < this.enemyNode.width + this.bulletNode.width || this.enemyNode.position.sub(this.bulletNode.position).mag() < this.enemyNode.height + this.bulletNode.height)) {
          this.isHit = true;
          this.bulletNode.active = false;
          this.enemyNode.active = false;
          this.objectDestroyed(this.enemyNode.position);
          this.bulletNode.stopAction(this.bulletAction);
          0 == this.starter ? this.enemyNode.stopAction(this.enemyAction0) : this.enemyNode.stopAction(this.enemyAction1);
          this.scoreLabel.string = ++this.score;
          this.placePlayer();
          this.placeEnemy();
        }
      },
      placePlayer: function placePlayer() {
        this.playerNode.on("touchstart", this.snipe, this);
        this.bulletNode.active = true;
        this.isSniped = false;
        this.playerNode.y = -cc.winSize.height / 3;
        this.bulletNode.y = -cc.winSize.height / 3;
      }
    }, _defineProperty(_cc$Class, "onDestroy", function onDestroy() {
      this.playerNode.off("touchstart", this.snipe, this);
    }), _defineProperty(_cc$Class, "placeEnemy", function placeEnemy() {
      this.isHit = false;
      this.enemyNode.active = true;
      this.starter = Math.round(1 * Math.random());
      0 == this.starter ? this.enemyNode.x = -(cc.winSize.width / 2 - this.enemyNode.width / 2) : this.enemyNode.x = cc.winSize.width / 2 - this.enemyNode.width / 2;
      this.enemyNode.y = cc.winSize.height / 2 - this.enemyNode.height / 2;
      var desX = cc.winSize.width / 2 - this.enemyNode.width / 2;
      var desY = Math.random() * (cc.winSize.height / 2 - this.enemyNode.height / 2);
      var dua = 1.8;
      this.score <= 16 ? dua -= .1 * this.score : dua = .1;
      var seq0 = cc.repeatForever(cc.sequence(cc.moveTo(dua, desX, desY), cc.moveTo(dua, -desX, desY)));
      var seq1 = cc.repeatForever(cc.sequence(cc.moveTo(dua, -desX, desY), cc.moveTo(dua, desX, desY)));
      0 == this.starter ? this.enemyAction0 = this.enemyNode.runAction(seq0) : this.enemyAction1 = this.enemyNode.runAction(seq1);
    }), _defineProperty(_cc$Class, "snipe", function snipe() {
      var _this = this;
      if (this.isSniped) return;
      this.isSniped = true;
      this.playerNode.off("touchstart", this.snipe, this);
      var duration = .1;
      var seq = cc.sequence(cc.moveTo(duration, cc.v2(0, cc.winSize.height / 2 - this.bulletNode.height / 2)), cc.callFunc(function() {
        _this.bulletNode.active = false;
        _this.objectDestroyed(_this.bulletNode.position);
        _this.isHit ? _this.bulletNode.stopAction(_this.bulletAction) : setTimeout(function() {
          if (confirm("Game Over! Continue?")) _this.restartGame(); else {
            _this.enemyNode.destroy();
            _this.gameOver = true;
          }
        }, 0);
      }));
      this.bulletAction = this.bulletNode.runAction(seq);
    }), _defineProperty(_cc$Class, "objectDestroyed", function objectDestroyed(pos) {
      this.hitEffectNode.setPosition(pos);
      var particle = this.hitEffectNode.getComponent(cc.ParticleSystem);
      particle.resetSystem();
    }), _defineProperty(_cc$Class, "restartGame", function restartGame() {
      setTimeout(function() {
        cc.director.loadScene("game");
      }, 100);
    }), _cc$Class));
    cc._RF.pop();
  }, {} ]
}, {}, [ "gameScript" ]);