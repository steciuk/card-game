import { BaseScene } from 'src/app/logic/games/scenes/baseScene';

export class PhaserTurnArrow {
	private container: Phaser.GameObjects.Container;
	private arrow: Phaser.GameObjects.Sprite;
	private yOffset = 150;

	constructor(private scene: BaseScene, x: number, y: number, rotation: number) {
		this.container = scene.add.container(x, y).setRotation(rotation);
		this.arrow = scene.add.sprite(0, this.yOffset, 'arrow').setScale(0.05);
		this.container.add(this.arrow);

		this.scene.tweens.add({
			targets: this.arrow,
			y: this.yOffset + 20,
			duration: 1000,
			yoyo: true,
			loop: -1,
			ease: Phaser.Math.Easing.Sine.InOut,
		});
	}

	updateRotation(rotation: number): void {
		if (this.container.rotation - rotation < -Math.PI) rotation -= 2 * Math.PI;
		this.scene.tweens.add({
			targets: this.container,
			rotation: rotation,
			duration: 1000,
			ease: Phaser.Math.Easing.Bounce.Out,
		});
	}
}
