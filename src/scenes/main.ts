phina.define("TitleScene", {
	superClass: "DisplayScene",

	init(options: any) {
		this.superInit(options);

		new (phina.display as any).Label({
			text: "The Big Adventure of Owata`s Life",
			padding: 0,
			fontSize: 14,
			originY: 0,
			x: this.gridX.center(),
			y: 3,
		}).addChildTo(this);

		new (phina.display as any).Label({
			text: "人生ｵﾜﾀ                       \n＼(^o^)／\n                     の大冒険",
			fontSize: 44,
			lineHeight: 1,
			originY: 0,
			x: this.gridX.center(),
			y: 20,
		}).addChildTo(this);

		new (phina.display as any).RectangleShape({
			width: 518,
			height: 146,
			padding: 0,
			fill: "transparent",
			stroke: "black",
			strokeWidth: 1,
			originY: 0,
			x: this.gridX.center(),
			y: 20,
		}).addChildTo(this);

		new (phina.display as any).Label({
			text: "START",
			fontSize: 32,
			lineHeight: 1,
			x: this.gridX.center(),
			y: 213,
		}).addChildTo(this);
	},

	onpointend() {
		this.exit();
	},
});

phina.define("MainScene", {
	superClass: "DisplayScene",

	init(options: any) {
		this.superInit(options);

		this.backgroundColor = "white";

		const owata = new (phina as any).Owata({
			x: 484,
			y: 280,
		});
		owata.addChildTo(this);
		this.owata = owata;

		this.bulletManager = new (phina as any).BulletManager();
		this.bulletManager.setup(this);

		new (phina.display as any).Label({
			text: "┌───┐\n│←樹海│\n└───┘\n║\n║",
			padding: -6,
			width: 57,
			height: 58,
			originY: 0,
			x: 10,
			y: this.gridY.width - 92,
		}).addChildTo(this);

		const grounds = new (phina.display as any).DisplayElement();
		grounds.addChildTo(this);
		this.grounds = grounds;

		new (phina.display as any).Label({
			text: "┌────────────\n│                        \n│                        ",
			width: 167,
			height: 34,
			padding: -6,
			x: this.gridX.width - 167,
			y: this.gridY.width - 34,
		}).addChildTo(grounds);

		new (phina.display as any).Label({
			text: "────────────┐\n                        │\n                        │",
			width: 167,
			height: 34,
			padding: -6,
			x: 0,
			y: this.gridY.width - 34,
		}).addChildTo(grounds);

		const n = new (phina.display as any).Label({
			text: "△△△△△△△△△△△△△△△\n│                            │\n└──────────────┘\n§\n§\n§\n§\n§\n§\n§\n§",
			width: 212,
			height: 14 * 3 - 6,
			originX: 0.5,
			x: 276.5,
			y: this.gridY.width - 14,
		}).addChildTo(grounds);
		(n as any).start = function () {
			this.tweener
				.by({ y: -135 }, 400, "easeOutCubic")
				.wait(500)
				.by({ y: 135 }, 2200, "easeOutCubic")
				.wait(100)
				.play();
		};
		this.needle = n;

		const s = new (phina as any).Scaffold({
			text: "[ニニニ]",
			width: 52,
			height: 13,
			velocityX: 5,
			originX: 0.5,
			x: this.gridX.center(),
			y: this.gridY.width - 100,
			boundaryRight: 366,
			boundaryLeft: 222,
		}).addChildTo(grounds);
		this.scaffold = s;

		this.label = new (phina.display as any).Label({
			text: "リトライ (R)",
			originX: 1,
			originY: 0,
			x: this.gridX.width,
			y: 0,
		})
			.addChildTo(this)
			.hide();

		this.gameover = false;
		this.xPressed = false;
	},

	update(args: { keyboard: any; frame: number }) {
		const { keyboard, frame } = args;
		const owata = this.owata as any;
		const grounds = this.grounds as any;
		const needle = this.needle as any;
		const scaffold = this.scaffold as any;
		const bulletManager = this.bulletManager as any;

		if (this.gameover || owata.hitTestElement(needle)) {
			this.gameover = true;
			this.label.show();
			owata.die(frame);
		} else {
			const ground = grounds.children.find((g: any) => owata.hitTestElement(g));
			if (ground) {
				owata.touchGround(ground);
			} else {
				owata.fall();
			}

			if (owata.hitTestElement(scaffold)) {
				(needle as any).start();
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

	onkeypress(args: { keyCode: number }) {
		if (this.gameover && args.keyCode === "r".charCodeAt(0)) {
			this.exit();
		}
	},
});

phina.main(() => {
	const app = new (phina.app as any).GameApp({
		startLabel: "title",
		width: 550,
		height: 350,
		fit: false,
		assets: {
			sound: {
				owata: "owata1.wav",
			},
		},
		scenes: [
			{ label: "title", className: "TitleScene", nextLabel: "main" },
			{ label: "main", className: "MainScene", nextLabel: "main" },
		],
	});
	app.run();
});
