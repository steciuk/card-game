import { Scene } from 'phaser';
import { GameStateService, Player } from 'src/app/services/game-state.service';
import { SocketService } from 'src/app/services/socket.service';

import { SOCKET_GAME_EVENTS } from '../socketEvents/socketEvents';
import { SCENE_KEYS } from './gamesSetup';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCallback = (...args: any[]) => void;
//TODO: restrict so key is mandatory
type PhaserConfig = Phaser.Types.Scenes.SettingsConfig;

export abstract class BaseScene extends Scene {
	protected registeredEvents = new Map<SOCKET_GAME_EVENTS, AnyCallback>();
	key: SCENE_KEYS;

	constructor(
		protected socketService: SocketService,
		protected gameStateService: GameStateService,
		config: PhaserConfig
	) {
		super(config);
		this.key = config.key as SCENE_KEYS;
		this.registerBaseListeners();
	}

	abstract init(): void;
	abstract preload(): void;
	abstract create(): void;
	abstract update(): void;

	private registerBaseListeners(): void {
		this.socketService.registerSocketListener(SOCKET_GAME_EVENTS.PLAYERS_IN_GAME, (players: Player[]) => {
			this.gameStateService.setPlayersInGame(players);
		});

		this.socketService.registerSocketListener(SOCKET_GAME_EVENTS.PLAYER_CONNECTED, (player: Player) => {
			this.gameStateService.addPlayer(player);
		});

		this.socketService.registerSocketListener(
			SOCKET_GAME_EVENTS.PLAYER_DISCONNECTED,
			(playerId: string) => {
				this.gameStateService.removePlayer(playerId);
			}
		);

		this.socketService.registerSocketListener(
			SOCKET_GAME_EVENTS.PLAYER_TOGGLE_READY,
			(dto: { id: string; isReady: boolean }) => {
				this.gameStateService.setPlayerReady(dto.id, dto.isReady);
			}
		);
	}

	protected registerSocketListenerForScene(event: SOCKET_GAME_EVENTS, callback: AnyCallback): void {
		this.registeredEvents.set(event, callback);
		this.socketService.registerSocketListener(event, callback);
	}

	protected changeScene(sceneKey: SCENE_KEYS): void {
		this.registeredEvents.forEach((callback: AnyCallback, event: SOCKET_GAME_EVENTS) => {
			this.socketService.unregisterSocketListener(event, callback);
		});
		this.scene.start(sceneKey);
	}

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

	protected xRelative(x: number): number {
		return this.sys.game.canvas.width * x;
	}

	protected yRelative(y: number): number {
		return this.sys.game.canvas.width * y;
	}
}
