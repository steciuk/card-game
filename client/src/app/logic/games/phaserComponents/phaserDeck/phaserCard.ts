import { GameObjects, Scene } from 'phaser';

export class PhaserCard extends GameObjects.Sprite {
	constructor(scene: Scene, x: number, y: number, public cardId: string, scale: number) {
		super(scene, x, y, cardId);
		this.setScale(scale);
		scene.add.existing(this);
	}
}
