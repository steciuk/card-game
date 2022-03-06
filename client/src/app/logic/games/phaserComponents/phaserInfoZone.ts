import { HEX_COLORS_NUMBER, HEX_COLORS_STRING } from './HexColors';

export class PhaserInfoZone {
	private infoZoneContainer: Phaser.GameObjects.Container;
	private infoObject: Phaser.GameObjects.Text;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		size: number,
		label: string,
		info: string | number = ''
	) {
		if (typeof info === 'number') info = info.toString();
		this.infoZoneContainer = scene.add.container(x, y);
		this.infoObject = scene.add
			.text(0, 0, '', { color: HEX_COLORS_STRING.BLACK })
			.setOrigin(0.5, 0.5)
			.setFontSize(40)
			.setFontStyle('bold');

		this.infoZoneContainer.add([
			scene.add
				.graphics()
				.lineStyle(2, HEX_COLORS_NUMBER.DARK_GREEN)
				.fillStyle(HEX_COLORS_NUMBER.PALE_GREEN)
				.fillRect(-size / 2, -size / 2, size, size)
				.strokeRect(-size / 2, -size / 2, size, size),
			scene.add
				.text(0, -size / 2 - 10, label, {
					color: HEX_COLORS_STRING.BLACK,
					backgroundColor: HEX_COLORS_STRING.PALE_GREEN,
				})
				.setOrigin(0.5, 0.5),
			this.infoObject,
		]);

		this.setInfo(info);
	}

	setInfo(info: string | number = ''): void {
		if (typeof info === 'number') {
			if (info === 0) {
				this.infoObject.setText('');
				return;
			}
			info = info.toString();
		}
		this.infoObject.setText(info);
	}
}
