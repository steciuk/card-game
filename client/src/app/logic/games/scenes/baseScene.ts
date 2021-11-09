import { Scene } from 'phaser';

export abstract class BaseScene extends Scene {
	protected loadAllPlayingCards(): void {
		const shapes = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
		const colors = ['C', 'D', 'H', 'S'];
		for (const s of shapes)
			for (const c of colors) {
				this.load.image(s + c, `./assets/cards/playing/${s + c}.png`);
			}
	}

	protected loadBacks(): void {
		this.load.image('RB', './assets/cards/backs/red_back.png');
	}
}
