phina.define("Bullet", {
	superClass: "AAObject",

	speed: 10,
	maxCount: 3,

	init(options: any) {
		this.velocityX = options.leftFace ? -10 : 10;

		const defaults = {
			text: options.leftFace ? "<<" : ">>",
			width: 20,
			height: 14,
			originX: options.leftFace ? 1 : 0,
			originY: 0.5,
		};

		this.superInit(Object.assign(defaults, options));
	},

	update() {
		this.x += this.velocityX;

		if (this.right < 0 || this.left > 550) {
			this.remove();
		}
	},
});

phina.define("BulletManager", {
	init() {
		this.bullets = [];
	},

	setup(scene: any) {
		this.scene = scene;
		this.bulletGroup = new phina.display.DisplayElement();
		this.bulletGroup.addChildTo(scene);
	},

	fire(x: number, y: number, leftFace: boolean) {
		if (this.bullets.length >= Bullet.prototype.maxCount) {
			return;
		}

		const bullet = new Bullet({
			x: x + (leftFace ? -20 : 20),
			y: y,
			leftFace: leftFace,
		});
		bullet.addChildTo(this.bulletGroup);
		this.bullets.push(bullet);
	},

	update() {
		this.bullets = this.bullets.filter((b: any) => {
			if (!b.parent) {
				return false;
			}
			return true;
		});
	},

	reset() {
		this.bullets.forEach((b: any) => {
			b.remove();
		});
		this.bullets = [];
	},
});
