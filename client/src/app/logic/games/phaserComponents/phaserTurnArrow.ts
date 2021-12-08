import { GameObjects } from 'phaser';

import { BaseScene } from '../scenes/baseScene';

export class PhaserTurnArrow {
	private container: GameObjects.Container;
	private arrow: GameObjects.Sprite;
	private yOffset = 150;

	constructor(private scene: BaseScene, rotation: number) {
		this.container = scene.add
			.container(scene.xRelative(0.5), scene.yRelative(0.5))
			.setRotation(rotation);
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
		this.scene.tweens.add({
			targets: this.container,
			rotation: rotation,
			duration: 1000,
			ease: Phaser.Math.Easing.Bounce.Out,
		});
	}
}
