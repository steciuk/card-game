import { Scene } from 'phaser';

import { GameHandler } from '../gameHandler';

export abstract class BaseScene extends Scene {
	static gameHandler: GameHandler;

	constructor(config: Phaser.Types.Scenes.SettingsConfig) {
		super(config);
	}

	static injectGameHandler(gameHandler: GameHandler): typeof BaseScene {
		BaseScene.gameHandler = gameHandler;
		return this;
	}

	abstract init(): void;
	abstract preload(): void;
	abstract create(): void;
	abstract update(): void;

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
