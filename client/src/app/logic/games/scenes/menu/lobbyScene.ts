import { GameObjects } from 'phaser';
import { SubSink } from 'subsink';

import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketGameEvents';
import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../sceneKeys';

export class LobbyScene extends BaseScene {
	constructor() {
		super({ key: SCENE_KEYS.LOBBY });
	}

	private subs = new SubSink();
	private usernames: GameObjects.Text[] = [];

	init(): void {}
	preload(): void {}
	create(): void {
		this.updateUsernames();
		// TODO: unsubscribe
		this.subs.sink = this.gameState.updateUsers$.subscribe(() => this.updateUsernames());

		////
		const readyBtn = this.add.text(100, 100, 'Ready!');
		readyBtn.setInteractive();
		readyBtn.on('pointerup', () => {
			this.socket.emit(SOCKET_GAME_EVENTS.PLAYER_TOGGLE_READY);
		});
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

	private updateUsernames(): void {
		this.usernames.forEach((username) => {
			username.destroy();
		});
		this.gameState.getAllUsernamesAsArray().forEach((player, i) => {
			if (player.isReady)
				this.usernames.push(this.add.text(10, 10 * i, player.username, { color: '#11ff00' }));
			else this.usernames.push(this.add.text(10, 10 * i, player.username, { color: '#ffffff' }));
		});
	}
}
