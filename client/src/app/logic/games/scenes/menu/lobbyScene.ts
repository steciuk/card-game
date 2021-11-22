import { GameObjects } from 'phaser';
import { GameStateService } from 'src/app/services/game-state.service';
import { SocketService } from 'src/app/services/socket.service';

import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketEvents';
import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../gamesSetup';

export class LobbyScene extends BaseScene {
	constructor(socketService: SocketService, gameStateService: GameStateService) {
		super(socketService, gameStateService, { key: SCENE_KEYS.LOBBY });
		this.registerListeners();
	}

	private usernames: GameObjects.Text[] = [];

	init(): void {}
	preload(): void {}
	create(): void {
		this.updateUsernames();

		////
		const readyBtn = this.add.text(100, 100, 'Ready!');
		readyBtn.setInteractive();
		readyBtn.on('pointerup', () => {
			this.socketService.emitSocketEvent(SOCKET_GAME_EVENTS.PLAYER_TOGGLE_READY);
		});
		this.time.addEvent({
			delay: 3000,
			loop: false,
			callback: () => {
				this.changeScene(SCENE_KEYS.MAKAO);
			},
		});
	}

	update(): void {}

	private updateUsernames(): void {
		this.usernames.forEach((username) => {
			username.destroy();
		});
		this.gameStateService.getAllUsernamesAsArray().forEach((player, i) => {
			if (player.isReady)
				this.usernames.push(this.add.text(10, 10 * i, player.username, { color: '#11ff00' }));
			else this.usernames.push(this.add.text(10, 10 * i, player.username, { color: '#ffffff' }));
		});
	}

	private registerListeners(): void {
		this.registerSocketListenerForScene(SOCKET_GAME_EVENTS.PLAYER_CONNECTED, () => {
			this.updateUsernames();
		});

		this.registerSocketListenerForScene(SOCKET_GAME_EVENTS.PLAYER_DISCONNECTED, () => {
			this.updateUsernames();
		});

		this.registerSocketListenerForScene(SOCKET_GAME_EVENTS.PLAYER_TOGGLE_READY, () => {
			this.updateUsernames();
		});
	}
}
