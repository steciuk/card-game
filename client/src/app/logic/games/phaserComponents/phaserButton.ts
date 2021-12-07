import { GameObjects, Scene } from 'phaser';

import { HEX_COLORS } from './HexColors';

export class PhaserButton {
	private button: GameObjects.Text;

	constructor(scene: Scene, x: number, y: number, text: string, callback: () => void) {
		this.button = scene.add
			.text(x, y, text)
			.setOrigin(0.5)
			.setPadding(10)
			.setStyle({ backgroundColor: HEX_COLORS.GREEN })
			.setInteractive({ useHandCursor: true })
			.on('pointerup', callback)
			.on('pointerover', () => this.button.setStyle({ backgroundColor: HEX_COLORS.DARK_GREEN }))
			.on('pointerout', () => this.button.setStyle({ backgroundColor: HEX_COLORS.GREEN }));
	}

	disable(): PhaserButton {
		this.button.setStyle({ backgroundColor: HEX_COLORS.GRAY }).disableInteractive();
		return this;
	}

	enable(): PhaserButton {
		this.button.setStyle({ backgroundColor: HEX_COLORS.GREEN }).setInteractive();
		return this;
	}
}
