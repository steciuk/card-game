import { HEX_COLORS_STRING } from './HexColors';

export class PhaserButton {
	private button: Phaser.GameObjects.Text;
	private isEnabled = true;

	constructor(scene: Phaser.Scene, x: number, y: number, text: string, callback: () => void) {
		this.button = scene.add
			.text(x, y, text)
			.setOrigin(0.5)
			.setPadding(10)
			.setStyle({ backgroundColor: HEX_COLORS_STRING.GREEN })
			.setDepth(1)
			.setInteractive({ useHandCursor: true })
			.on('pointerup', callback)
			.on('pointerover', () => this.button.setStyle({ backgroundColor: HEX_COLORS_STRING.DARK_GREEN }))
			.on('pointerout', () => {
				if (this.isEnabled) this.button.setStyle({ backgroundColor: HEX_COLORS_STRING.GREEN });
			});
	}

	setEnabled(enable: boolean): PhaserButton {
		if (enable) this.button.setStyle({ backgroundColor: HEX_COLORS_STRING.GREEN }).setInteractive();
		else this.button.disableInteractive().setStyle({ backgroundColor: HEX_COLORS_STRING.GRAY });

		this.isEnabled = enable;
		return this;
	}
}
