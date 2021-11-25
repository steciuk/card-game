import { GameObjects } from 'phaser';
import { RoomStateService } from 'src/app/services/room-state.service';
import { SocketService } from 'src/app/services/socket.service';

import { HEX_COLORS } from '../../phaserComponents/HexColors';
import { PhaserButton } from '../../phaserComponents/phaserButton';
import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketEvents';
import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../gamesSetup';

export class LobbyScene extends BaseScene {
	constructor(socketService: SocketService, roomStateService: RoomStateService) {
		super(socketService, roomStateService, { key: SCENE_KEYS.LOBBY });
		this.registerListeners();
	}

	private usernames: GameObjects.Text[] = [];
	private startBtn!: PhaserButton;

	init(): void {}
	preload(): void {}
	create(): void {
		this.updateUsernames();

		////

		new PhaserButton(this, this.xRelative(0.5), this.yRelative(0.8), 'Ready', () => {
			this.socketService.emitSocketEvent(SOCKET_GAME_EVENTS.PLAYER_TOGGLE_READY);
		});

		this.startBtn = new PhaserButton(this, this.xRelative(0.5), this.yRelative(0.85), 'Start', () => {
			this.socketService.emitSocketEvent(SOCKET_GAME_EVENTS.START_GAME, (messageToLog: string) => {
				//TODO: standardize callback responses
				console.log(messageToLog);
			});
		}).disable();

		// this.time.addEvent({
		// 	delay: 3000,
		// 	loop: false,
		// 	callback: () => {
		// 		this.changeScene(SCENE_KEYS.MAKAO);
		// 	},
		// });
	}

	update(): void {}

	private updateUsernames(): void {
		this.usernames.forEach((username) => {
			username.destroy();
		});
		this.roomStateService.getAllUsernamesAsArray().forEach((player, i) => {
			if (player.isReady)
				this.usernames.push(this.add.text(10, 10 * i, player.username, { color: HEX_COLORS.GREEN }));
			else this.usernames.push(this.add.text(10, 10 * i, player.username, { color: HEX_COLORS.BLACK }));
		});
	}

	private updateStartButton(): void {
		if (this.roomStateService.areAllPlayersReady()) this.startBtn.enable();
		else this.startBtn.disable();
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
			this.updateStartButton();
		});

		this.registerSocketListenerForScene(SOCKET_GAME_EVENTS.START_GAME, () => {
			this.nextScene();
		});
	}
}
