import { GameObjects } from 'phaser';
import { SocketService } from 'src/app/services/socket.service';

import { HEX_COLORS } from '../../phaserComponents/HexColors';
import { PhaserButton } from '../../phaserComponents/phaserButton';
import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketEvents';
import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../gamesSetup';

export class LobbyScene extends BaseScene {
	playersInLobby = new Map<string, PlayerLobbyInfo>();

	constructor(socketService: SocketService) {
		super(socketService, { key: SCENE_KEYS.LOBBY });
		this.registerListeners();
	}

	//TODO: change to PhaserComponent
	private usernames: GameObjects.Text[] = [];
	private startBtn!: PhaserButton;

	init(): void {}
	preload(): void {}
	create(): void {
		this.updateUsernames();

		new PhaserButton(this, this.xRelative(0.5), this.yRelative(0.8), 'Ready', () => {
			this.socketService.emitSocketEvent(SOCKET_GAME_EVENTS.PLAYER_TOGGLE_READY);
		});

		this.startBtn = new PhaserButton(this, this.xRelative(0.5), this.yRelative(0.85), 'Start', () => {
			this.socketService.emitSocketEvent(SOCKET_GAME_EVENTS.START_GAME, (messageToLog: string) => {
				//TODO: standardize callback responses
				console.log(messageToLog);
			});
		}).disable();
		this.updateStartButton();

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
		this.playersInLobbyAsArray.forEach((player, i) => {
			if (player.isReady)
				this.usernames.push(this.add.text(10, 10 * i, player.username, { color: HEX_COLORS.GREEN }));
			else this.usernames.push(this.add.text(10, 10 * i, player.username, { color: HEX_COLORS.BLACK }));
		});
	}

	private updateStartButton(): void {
		if (
			this.playersInLobbyAsArray.every((player) => {
				return player.isReady;
			})
		)
			this.startBtn.enable();
		else this.startBtn.disable();
	}

	private registerListeners(): void {
		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.PLAYERS_IN_GAME,
			(players: PlayerLobbyInfo[]) => {
				this.playersInLobby.clear();
				players.forEach((player) => {
					this.playersInLobby.set(player.id, player);
				});
			}
		);

		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.PLAYER_CONNECTED,
			(player: PlayerLobbyInfo) => {
				this.playersInLobby.set(player.id, player);
				this.updateUsernames();
				this.updateStartButton();
			}
		);

		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.PLAYER_DISCONNECTED,
			(player: PlayerLobbyInfo) => {
				this.playersInLobby.delete(player.id);
				this.updateUsernames();
				this.updateStartButton();
			}
		);

		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.PLAYER_TOGGLE_READY,
			(player: PlayerLobbyInfo) => {
				const playerInLobby = this.playersInLobby.get(player.id);
				if (playerInLobby) {
					playerInLobby.isReady = player.isReady;
					this.updateUsernames();
					this.updateStartButton();
				}
			}
		);

		this.registerSocketListenerForScene(SOCKET_GAME_EVENTS.START_GAME, () => {
			console.log(this.nextSceneKey);
			this.nextScene();
		});
	}

	private get playersInLobbyAsArray(): PlayerLobbyInfo[] {
		return Array.from(this.playersInLobby.values());
	}
}

type PlayerLobbyInfo = {
	id: string;
	username: string;
	isReady: boolean;
};
