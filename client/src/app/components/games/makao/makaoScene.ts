import { Scene } from 'phaser';

import { SocketController } from '../socketController';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let socketController: SocketController;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function injectSocketController(context: SocketController): typeof MakaoScene {
	socketController = context;
	return MakaoScene;
}

class MakaoScene extends Scene {
	private socketController!: SocketController;

	constructor() {
		super({
			key: 'Game',
		});
		this.socketController = socketController;
	}

	preload(): void {
		// let shapes = [
		//     '2',
		//     '3',
		//     '4',
		//     '5',
		//     '6',
		//     '7',
		//     '8',
		//     '9',
		//     '10',
		//     'J',
		//     'Q',
		//     'K',
		//     'A',
		// ];
		// let colors = ['C', 'D', 'H', 'S'];
		// for (let s of shapes)
		//     for (let c of colors) {
		//         this.load.image(s + c, `./assets/playing/${s + c}.png`);
		//     }
		// this.load.image('RB', './assets/backs/red_back.png');
	}

	create(): void {
		this.socketController.connect();
	}
}
