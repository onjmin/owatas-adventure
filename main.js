"use strict";
var phina = (() => {
  // src/scenes/main.ts
  phina.define("TitleScene", {
    superClass: "DisplayScene",
    init(options) {
      this.superInit(options);
      new phina.display.Label({
        text: "The Big Adventure of Owata`s Life",
        padding: 0,
        fontSize: 14,
        originY: 0,
        x: this.gridX.center(),
        y: 3
      }).addChildTo(this);
      new phina.display.Label({
        text: "\u4EBA\u751F\uFF75\uFF9C\uFF80                       \n\uFF3C(^o^)\uFF0F\n                     \u306E\u5927\u5192\u967A",
        fontSize: 44,
        lineHeight: 1,
        originY: 0,
        x: this.gridX.center(),
        y: 20
      }).addChildTo(this);
      new phina.display.RectangleShape({
        width: 518,
        height: 146,
        padding: 0,
        fill: "transparent",
        stroke: "black",
        strokeWidth: 1,
        originY: 0,
        x: this.gridX.center(),
        y: 20
      }).addChildTo(this);
      new phina.display.Label({
        text: "START",
        fontSize: 32,
        lineHeight: 1,
        x: this.gridX.center(),
        y: 213
      }).addChildTo(this);
    },
    onpointend() {
      this.exit();
    }
  });
  phina.define("MainScene", {
    superClass: "DisplayScene",
    init(options) {
      this.superInit(options);
      this.backgroundColor = "white";
      const owata = new phina.Owata({
        x: 484,
        y: 280
      });
      owata.addChildTo(this);
      this.owata = owata;
      this.bulletManager = new phina.BulletManager();
      this.bulletManager.setup(this);
      new phina.display.Label({
        text: "\u250C\u2500\u2500\u2500\u2510\n\u2502\u2190\u6A39\u6D77\u2502\n\u2514\u2500\u2500\u2500\u2518\n\u2551\n\u2551",
        padding: -6,
        width: 57,
        height: 58,
        originY: 0,
        x: 10,
        y: this.gridY.width - 92
      }).addChildTo(this);
      const grounds = new phina.display.DisplayElement();
      grounds.addChildTo(this);
      this.grounds = grounds;
      new phina.display.Label({
        text: "\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n\u2502                        \n\u2502                        ",
        width: 167,
        height: 34,
        padding: -6,
        x: this.gridX.width - 167,
        y: this.gridY.width - 34
      }).addChildTo(grounds);
      new phina.display.Label({
        text: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n                        \u2502\n                        \u2502",
        width: 167,
        height: 34,
        padding: -6,
        x: 0,
        y: this.gridY.width - 34
      }).addChildTo(grounds);
      const n = new phina.display.Label({
        text: "\u25B3\u25B3\u25B3\u25B3\u25B3\u25B3\u25B3\u25B3\u25B3\u25B3\u25B3\u25B3\u25B3\u25B3\u25B3\n\u2502                            \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\xA7\n\xA7\n\xA7\n\xA7\n\xA7\n\xA7\n\xA7\n\xA7",
        width: 212,
        height: 14 * 3 - 6,
        originX: 0.5,
        x: 276.5,
        y: this.gridY.width - 14
      }).addChildTo(grounds);
      n.start = function() {
        this.tweener.by({ y: -135 }, 400, "easeOutCubic").wait(500).by({ y: 135 }, 2200, "easeOutCubic").wait(100).play();
      };
      this.needle = n;
      const s = new phina.Scaffold({
        text: "[\u30CB\u30CB\u30CB]",
        width: 52,
        height: 13,
        velocityX: 5,
        originX: 0.5,
        x: this.gridX.center(),
        y: this.gridY.width - 100,
        boundaryRight: 366,
        boundaryLeft: 222
      }).addChildTo(grounds);
      this.scaffold = s;
      this.label = new phina.display.Label({
        text: "\u30EA\u30C8\u30E9\u30A4 (R)",
        originX: 1,
        originY: 0,
        x: this.gridX.width,
        y: 0
      }).addChildTo(this).hide();
      this.gameover = false;
      this.xPressed = false;
    },
    update(args) {
      const { keyboard, frame } = args;
      const owata = this.owata;
      const grounds = this.grounds;
      const needle = this.needle;
      const scaffold = this.scaffold;
      const bulletManager = this.bulletManager;
      if (this.gameover || owata.hitTestElement(needle)) {
        this.gameover = true;
        this.label.show();
        owata.die(frame);
      } else {
        const ground = grounds.children.find((g) => owata.hitTestElement(g));
        if (ground) {
          owata.touchGround(ground);
        } else {
          owata.fall();
        }
        if (owata.hitTestElement(scaffold)) {
          needle.start();
        }
        if (keyboard.getKey("left")) {
          owata.moveLeft(frame);
        } else if (keyboard.getKey("right")) {
          owata.moveRight(frame);
        } else {
          owata.stay();
        }
        if (keyboard.getKey("z")) {
          owata.jump();
        }
        if (keyboard.getKey("x")) {
          if (!this.xPressed) {
            bulletManager.fire(owata.x, owata.y, owata.leftFace);
            this.xPressed = true;
          }
        } else {
          this.xPressed = false;
        }
        bulletManager.update();
      }
    },
    onkeypress(args) {
      if (this.gameover && args.keyCode === "r".charCodeAt(0)) {
        this.exit();
      }
    }
  });
  phina.main(() => {
    const app = new phina.app.GameApp({
      startLabel: "title",
      width: 550,
      height: 350,
      fit: false,
      assets: {
        sound: {
          owata: "owata1.wav"
        }
      },
      scenes: [
        { label: "title", className: "TitleScene", nextLabel: "main" },
        { label: "main", className: "MainScene", nextLabel: "main" }
      ]
    });
    app.run();
  });
})();
//# sourceMappingURL=main.js.map
