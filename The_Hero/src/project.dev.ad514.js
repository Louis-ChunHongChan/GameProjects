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
  enemyBodyHit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5f909NKvwxHF5bZUlDMzsyD", "enemyBodyHit");
    "use strict";
    var enemyBodyHit = cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.enemy = this.node.parent.getComponent("enemy");
        this.died = false;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        if (!this.died && !window.heroBody.isHurt && !window.heroBody.isDied && "hero" == other.node.group) if (window.enemy.health <= 0) {
          this.enemy.die();
          this.died = true;
        } else window.hero.attacking ? this.enemy.hit() : this.enemy.attack();
      }
    });
    cc._RF.pop();
  }, {} ],
  enemy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1fd94ULjlJEvLLImaB5ECAh", "enemy");
    "use strict";
    var State = {
      stand: 1,
      attack: 2,
      hit: 3
    };
    var enemy = cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        window.enemy = this;
        this.health = 10;
        this.isHit = false;
        this.attacking = false;
        this.chase = false;
        this.turnedLeft = false;
        this.turnedRight = false;
        this.enemyAnim = this.node.getChildByName("body").getComponent(cc.Animation);
        this.enemyAnim.play("idle");
        this.maxSpeed = 50;
        this.speed = cc.v2(0, 0);
        this.AI_Interval = 0;
        this.enemyState = State.stand;
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.enemyAnim.on("finished", this.onAnimFinished, this);
        this.moveLeft = false;
        this.moveRight = false;
        this.playerNode = cc.find("Canvas/bg/hero");
      },
      setAnimation: function setAnimation(animation) {
        if (this.animation == animation) return;
        this.animation = animation;
        this.enemyAnim.play(animation);
      },
      onAnimFinished: function onAnimFinished(e, data) {
        this.isHit = false;
        if ("hit" == data.name) {
          this.setAnimation("idle");
          this.enemyState = State.stand;
        } else if ("die" == data.name) {
          this.node.destroy();
          confirm("You Won! Restart?") && document.location.reload();
        } else if ("attack" == data.name) {
          this.attacking = false;
          this.setAnimation("idle");
          this.enemyState = State.stand;
        }
      },
      hit: function hit() {
        if (this.isHit) this.enemyState = State.attack; else {
          this.isHit = true;
          this.enemyAnim.play("hit");
          this.lv = this.rigidBody.linearVelocity;
          this.lv.x = 0;
          this.rigidBody.linearVelocity = this.lv;
          "attack" == window.hero.animation ? this.health-- : "attack2" == window.hero.animation ? this.health -= 2 : "attack3" == window.hero.animation ? this.health-- : "airborne" == window.hero.animation && (this.health -= 2);
        }
      },
      die: function die() {
        this.enemyAnim.play("die");
      },
      enemyAction: function enemyAction(tt) {
        var p_pos = this.playerNode.position;
        var e_pos = this.node.position;
        var pe_dis = p_pos.sub(e_pos).mag();
        var vector = p_pos.sub(e_pos);
        var scaleX = Math.abs(this.node.scaleX);
        if (pe_dis <= 30) {
          this.turnedLeft = false;
          this.turnedRight = false;
          this.moveLeft = false;
          this.moveRight = false;
          vector.x < 0 ? this.node.scaleX = -scaleX : this.node.scaleX = scaleX;
          this.enemyState = State.attack;
        } else if (pe_dis <= 135) {
          this.chase = true;
          this.turnedLeft = false;
          this.turnedRight = false;
          if (vector.x < 0) {
            this.maxSpeed = 110;
            this.moveLeft = true;
            this.moveRight = false;
          } else {
            this.maxSpeed = 110;
            this.moveLeft = false;
            this.moveRight = true;
          }
        } else {
          this.maxSpeed = 50;
          if (e_pos.x >= 200) {
            this.moveLeft = true;
            this.moveRight = false;
            this.turnedLeft = true;
          } else if (e_pos.x <= -200) {
            this.moveLeft = false;
            this.moveRight = true;
            this.turnedRight = true;
          } else if (vector.x < 0) if (this.chase) {
            this.moveLeft = false;
            this.moveRight = true;
          } else {
            this.moveLeft = true;
            this.moveRight = false;
          } else if (this.chase) {
            this.moveLeft = true;
            this.moveRight = false;
          } else {
            this.moveLeft = false;
            this.moveRight = true;
          }
          (this.turnedLeft || this.turnedRight) && (this.chase = false);
          this.enemyState = State.stand;
        }
      },
      attack: function attack() {
        this.setAnimation("attack");
        this.attacking = true;
        this.lv = this.rigidBody.linearVelocity;
        this.lv.x = 0;
        this.rigidBody.linearVelocity = this.lv;
      },
      move: function move() {
        var scaleX = Math.abs(this.node.scaleX);
        this.lv = this.rigidBody.linearVelocity;
        if (this.moveLeft) {
          this.speed.x = -1;
          this.node.scaleX = -scaleX;
          this.setAnimation("walk");
        } else if (this.moveRight) {
          this.speed.x = 1;
          this.node.scaleX = scaleX;
          this.setAnimation("walk");
        } else {
          this.speed.x = 0;
          this.setAnimation("idle");
        }
        this.speed.x ? this.lv.x = this.speed.x * this.maxSpeed : this.lv.x = 0;
        this.rigidBody.linearVelocity = this.lv;
      },
      update: function update(dt) {
        this.AI_Interval += dt;
        if (this.AI_Interval >= .2 && this.enemyState == State.stand) {
          this.enemyAction(dt);
          this.AI_Interval = 0;
        }
        this.enemyState == State.attack ? this.attack() : this.enemyState == State.stand && this.move();
      }
    });
    cc._RF.pop();
  }, {} ],
  gameScript: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c01a7KtgCtFVZeWWHRHAzDC", "gameScript");
    "use strict";
    var background = cc.Class({
      extends: cc.Component,
      properties: {
        mapNode: cc.Node
      },
      onLoad: function onLoad() {
        cc.director.getPhysicsManager().enabled = true;
      },
      initMapNode: function initMapNode(mapNode) {
        var tiledMap = mapNode.getComponent(cc.TiledMap);
        var tiledSize = tiledMap.getTileSize();
        var layer = tiledMap.getLayer("wall");
        var layerSize = layer.getLayerSize();
        for (var i = 0; i < layerSize.width; i++) for (var j = 0; j < layerSize.height; j++) {
          var tiled = layer.getTiledTileAt(i, j, true);
          if (0 != tiled.gid) {
            tiled.node.group = "wall";
            var body = tiled.node.addComponent(cc.RigidBody);
            body.type = cc.RigidBodyType.Static;
            var collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
            collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
            collider.size = tiledSize;
            collider.apply();
          }
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  heroBodyHit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4453dGRNfVLI6AEYHOYHt5S", "heroBodyHit");
    "use strict";
    var heroBodyHit = cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        window.heroBody = this;
        this.hero = this.node.parent.getComponent("hero");
        this.isDied = false;
      },
      onCollisionEnter: function onCollisionEnter(other, self) {
        if (!this.isHurt && !window.hero.crouching && !this.isDied && "enemy" == other.node.group && !this.hero.attacking) if (this.hero.heroHealth <= 0) {
          this.isDied = true;
          this.hero.die();
        } else this.hero.hurt();
      }
    });
    cc._RF.pop();
  }, {} ],
  hero: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "231d5op91FC3aMAQmTr0tEZ", "hero");
    "use strict";
    var Input = {};
    var State = {
      stand: 1,
      attack: 2,
      crouch: 3,
      hurt: 4,
      died: 5
    };
    var hero = cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        window.hero = this;
        this.heroHealth = 5;
        this.attacking = false;
        this.crouching = false;
        this.isHurt = false;
        this.maxSpeed = 200;
        this.speed = cc.v2(0, 0);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.lv = this.rigidBody.linearVelocity;
        this.heroState = State.stand;
        this.animation = "idle";
        this.heroAnim = this.node.getChildByName("body").getComponent(cc.Animation);
        this.heroAnim.on("finished", this.onAnimFinished, this);
        cc.systemEvent.on("keydown", this.onKeydown, this);
        cc.systemEvent.on("keyup", this.onKeyup, this);
        cc.director.getCollisionManager().enabled = true;
      },
      onDestroy: function onDestroy() {
        this.heroAnim.off("finished", this.onAnimFinished, this);
        cc.systemEvent.off("keydown", this.onKeydown, this);
        cc.systemEvent.off("keyup", this.onKeyup, this);
      },
      setAnimation: function setAnimation(animation) {
        if (this.animation == animation) return;
        this.animation = animation;
        this.heroAnim.play(animation);
      },
      onAnimFinished: function onAnimFinished(e, data) {
        var _this = this;
        if (this.heroState == State.attack) {
          this.heroState = State.stand;
          setTimeout(function() {
            _this.attacking = false;
          }, 150);
        } else if (this.heroState == State.died) confirm("You Died. Restart?") ? document.location.reload() : window.close(); else if (this.heroState == State.hurt) {
          this.heroHealth -= 1;
          this.heroState = State.stand;
          this.isHurt = false;
        }
      },
      hurt: function hurt() {
        this.lv = this.rigidBody.linearVelocity;
        this.lv.x = 0;
        this.rigidBody.linearVelocity = this.lv;
        this.setAnimation("hurt");
        this.isHurt = true;
        this.heroState = State.hurt;
      },
      die: function die() {
        this.lv = this.rigidBody.linearVelocity;
        this.lv.x = 0;
        this.rigidBody.linearVelocity = this.lv;
        this.setAnimation("die");
        this.heroState = State.died;
      },
      onKeydown: function onKeydown(e) {
        this.heroState != State.died && (Input[e.keyCode] = 1);
      },
      onKeyup: function onKeyup(e) {
        Input[e.keyCode] = 0;
        switch (e.keyCode) {
         case cc.macro.KEY.ctrl:
          this.crouching = false;
          this.heroState = State.stand;
        }
      },
      attack: function attack() {
        if (!this.isHurt || !this.attacking) {
          this.lv = this.rigidBody.linearVelocity;
          this.lv.x = 0;
          if (Input[cc.macro.KEY.j]) {
            this.attacking = true;
            this.setAnimation("attack");
          } else if (Input[cc.macro.KEY.i]) {
            this.attacking = true;
            this.setAnimation("attack2");
          } else if (Input[cc.macro.KEY.k]) {
            this.attacking = true;
            this.setAnimation("attack3");
          } else if (Input[cc.macro.KEY.f]) {
            this.attacking = true;
            this.setAnimation("airborne");
          }
          this.rigidBody.linearVelocity = this.lv;
        }
      },
      move: function move() {
        var scaleX = Math.abs(this.node.scaleX);
        this.lv = this.rigidBody.linearVelocity;
        if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
          this.speed.x = -1;
          this.node.scaleX = -scaleX;
          this.setAnimation("run");
        } else if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
          this.speed.x = 1;
          this.node.scaleX = scaleX;
          this.setAnimation("run");
        } else {
          this.speed.x = 0;
          this.setAnimation("idle");
        }
        this.speed.x ? this.lv.x = this.speed.x * this.maxSpeed : this.lv.x = 0;
        this.rigidBody.linearVelocity = this.lv;
      },
      crouch: function crouch() {
        this.crouching = true;
        this.lv = this.rigidBody.linearVelocity;
        if (Input[cc.macro.KEY.ctrl]) {
          this.setAnimation("crouch");
          this.lv.x = 0;
        }
        this.rigidBody.linearVelocity = this.lv;
      },
      update: function update(dt) {
        switch (this.heroState) {
         case State.stand:
          if (Input[cc.macro.KEY.j] || Input[cc.macro.KEY.k] || Input[cc.macro.KEY.f] || Input[cc.macro.KEY.i]) {
            if (!this.attacking) {
              this.heroState = State.attack;
              this.attacking = true;
            }
          } else Input[cc.macro.KEY.ctrl] && (this.heroState = State.crouch);
        }
        if (this.heroState != State.attack || this.isHurt) {
          if (this.heroState == State.stand) this.move(); else if (this.heroState == State.crouch) this.crouch(); else if (this.heroState == State.hurt) {
            this.lv = this.rigidBody.linearVelocity;
            this.lv.x = 0;
            this.rigidBody.linearVelocity = this.lv;
          } else if (this.heroState == State.died) {
            this.lv = this.rigidBody.linearVelocity;
            this.lv.x = 0;
            this.rigidBody.linearVelocity = this.lv;
          }
        } else this.attack();
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "enemy", "enemyBodyHit", "gameScript", "hero", "heroBodyHit" ]);