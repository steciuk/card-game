import { GameObjects, Scene } from 'phaser';

import { HEX_COLORS_NUMBER } from './HexColors';

export class PhaserDropZone {
	private dropZoneContainer: GameObjects.Container;

	constructor(scene: Scene, x: number, y: number, width: number, height: number) {
		this.dropZoneContainer = scene.add.container(x, y);
		this.dropZoneContainer.add([
			scene.add.zone(0, 0, width, height).setRectangleDropZone(width, height),
			scene.add
				.graphics()
				.lineStyle(2, HEX_COLORS_NUMBER.DARK_GREEN)
				.strokeRect(-width / 2, -height / 2, width, height),
		]);
	}
}
