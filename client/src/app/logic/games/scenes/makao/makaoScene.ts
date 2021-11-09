import { SocketController } from 'src/app/logic/games/socketController';

import { BaseScene } from '../baseScene';

// TODO: How to do it cleaner?
let socketController: SocketController;
export function injectSocketController(context: SocketController): typeof MakaoScene {
	socketController = context;
	return MakaoScene;
}

class MakaoScene extends BaseScene {
	private socketController!: SocketController;

	constructor() {
		super({ key: 'MAKAO' });
		this.socketController = socketController;
	}

	init(): void {}

	preload(): void {
		this.loadAllPlayingCards();
	}

	create(): void {}
}
