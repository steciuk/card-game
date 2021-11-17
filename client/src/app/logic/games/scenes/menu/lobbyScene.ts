import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../sceneKeys';

export class LobbyScene extends BaseScene {
	constructor() {
		super({ key: SCENE_KEYS.LOBBY });
	}

	init(): void {}
	preload(): void {}
	create(): void {
		// this.time.addEvent({
		// 	delay: 3000,
		// 	loop: false,
		// 	callback: () => {
		// 		this.scene.start(SCENE_KEYS.MAKAO);
		// 	},
		// });
	}
	update(): void {
		// LobbyScene.gameHandler.gameState.playersInGame.forEach((player, i) => {
		// 	this.add.text(0, 10 * i, player.username);
		// });
	}
}
