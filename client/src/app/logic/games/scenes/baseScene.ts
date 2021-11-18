import { Scene } from 'phaser';
import { Socket } from 'socket.io-client';

import { GameHandler } from '../gameHandler';
import { GameState } from '../gameState';

export abstract class BaseScene extends Scene {
	private static gameHandler: GameHandler;
	protected gameState: GameState;
	protected socket: Socket;

	constructor(config: Phaser.Types.Scenes.SettingsConfig) {
		super(config);
		this.gameState = BaseScene.gameHandler.gameState;
		this.socket = BaseScene.gameHandler.socket as Socket;
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
