"use strict";
(() => {
  phina.define("Owata", {
    superClass: "AAObject",
    speed: 6,
    leftFace: true,
    jumpPower: 13,
    gravity: 1,
    touchingGround: false,
    diedFrame: 0,
    dead: false,
    stayingLeft: "\u250F(^o^ )\u2513\n\u2503\u2503",
    stayingRight: "\u250F( ^o^)\u2513\n\u2503\u2503",
    movingLeftUp: "\u250F(^o^ )\u251B\n\u251B\u250F",
    movingLeftDown: "\u2517(^o^ )\u2513\n\u250F\u2517",
    movingRightUp: "\u2517( ^o^)\u2513\n\u2513\u2517",
    movingRightDown: "\u250F( ^o^)\u251B\n\u251B\u2513",
    jumpingLeft: "\u2517(^o^ )\u251B\n\u2517\u2503",
    jumpingRight: "\u2517( ^o^)\u251B\n\u2503\u251B",
    dying: [
      "\u25CE",
      "\u25CE\n\u25CE  \u25CE\n\u25CE",
      "\u25CE\n\u25CE  \u25CE\n\u25CE      \u25CE\n\u25CE  \u25CE\n\u25CE",
      "\u25CE\n\n\u25CE      \u25CE\n\n\u25CE          \u25CE\n\n\u25CE      \u25CE\n\n\u25CE"
    ],
    init(options) {
      const defaults = {
        text: this.stayingLeft,
        width: 40,
        height: 28,
        originX: 0.5,
        originY: 0.5
      };
      this.superInit(Object.assign(defaults, options));
    },
    stay() {
      this.text = this.leftFace ? this.stayingLeft : this.stayingRight;
      this.originY = 0.5;
    },
    moveLeft(frame) {
      switch (frame % 4) {
        case 0:
        case 1:
          this.text = this.movingLeftUp;
          this.originY = 0.5 + 0.02;
          break;
        case 2:
        case 3:
          this.text = this.movingLeftDown;
          this.originY = 0.5 - 0.02;
          break;
      }
      this.leftFace = true;
      this.x -= this.speed;
    },
    moveRight(frame) {
      switch (frame % 4) {
        case 0:
        case 1:
          this.text = this.movingRightUp;
          this.originY = 0.5 + 0.02;
          break;
        case 2:
        case 3:
          this.text = this.movingRightDown;
          this.originY = 0.5 - 0.02;
          break;
      }
      this.leftFace = false;
      this.x += this.speed;
    },
    jump() {
      this.text = this.leftFace ? this.jumpingLeft : this.jumpingRight;
      if (this.touchingGround) {
        this.physical.velocity.y = -this.jumpPower;
      }
    },
    touchGround(ground) {
      this.touchingGround = true;
      this.physical.velocity.x = ground.physical.velocity.x;
      this.physical.velocity.y = ground.physical.velocity.y;
      this.physical.gravity.y = 0;
      this.bottom = ground.top + 1;
    },
    fall() {
      this.touchingGround = false;
      this.physical.velocity.x *= 0.1;
      this.physical.gravity.y = this.gravity;
    },
    die(frame) {
      if (!this.dead) {
        this.dead = true;
        phina.asset.SoundManager.play("owata");
      }
      if (!this.diedFrame) {
        this.diedFrame = frame;
      }
      const delta = frame - this.diedFrame;
      this.text = this.dying[Math.floor(delta / 2)] || " ";
      this.physical.force(0, 0);
      this.physical.gravity.x = 0;
      this.physical.gravity.y = 0;
    }
  });
})();
//# sourceMappingURL=Owata.js.map
