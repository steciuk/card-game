import { SCENE_KEYS } from 'src/app/logic/games/scenes/gamesSetup';
import { SOCKET_GAME_EVENTS } from 'src/app/logic/games/socketEvents/socketEvents';
import { SocketService } from 'src/app/services/socket.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCallback = (...args: any[]) => void;
//TODO: restrict so key is mandatory
type PhaserConfig = Phaser.Types.Scenes.SettingsConfig;

export abstract class BaseScene extends Phaser.Scene {
	protected registeredEvents = new Map<SOCKET_GAME_EVENTS, AnyCallback>();
	key: SCENE_KEYS;
	nextSceneKey?: SCENE_KEYS;

	constructor(public socketService: SocketService, config: PhaserConfig) {
		super(config);
		this.key = config.key as SCENE_KEYS;
		this.registerBaseListeners();
	}

	abstract init(): void;
	abstract preload(): void;
	abstract create(): void;
	abstract override update(): void;

	setNextSceneKey(key: SCENE_KEYS): void {
		this.nextSceneKey = key;
	}

	protected registerSocketListenerForScene(event: SOCKET_GAME_EVENTS, callback: AnyCallback): void {
		this.registeredEvents.set(event, callback);
		this.socketService.registerSocketListener(event, callback);
	}

	protected changeScene(sceneKey: SCENE_KEYS): void {
		this.unregisterSocketListenersForThisScene();
		this.scene.start(sceneKey);
	}

	protected nextScene(): void {
		if (this.nextSceneKey) this.changeScene(this.nextSceneKey);
		else {
			console.log(this);
			console.error('Next scene key not set');
		}
	}

	private unregisterSocketListenersForThisScene(): void {
		this.registeredEvents.forEach((callback: AnyCallback, event: SOCKET_GAME_EVENTS) => {
			this.socketService.unregisterSocketListener(event, callback);
		});
	}

	protected loadAllPlayingCards(): void {
		const shapes = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
		const colors = ['C', 'D', 'H', 'S'];
		for (const s of shapes)
			for (const c of colors) {
				this.load.image(s + c, `assets/cards/playing/${s + c}.png`);
			}
	}

	protected loadBacks(): void {
		this.load.image('RB', 'assets/cards/backs/red_back.png');
	}

	protected loadTurnArrow(): void {
		this.load.image('arrow', 'assets/tables/arrow.png');
	}

	xRelative(x: number): number {
		return this.width * x;
	}

	yRelative(y: number): number {
		return this.height * y;
	}

	get smallerScreenDimension(): number {
		return Math.min(this.height, this.width);
	}

	protected get width(): number {
		return this.sys.game.canvas.width;
	}

	protected get height(): number {
		return this.sys.game.canvas.height;
	}

	private registerBaseListeners(): void {
		// this.socketService.registerSocketListener(SOCKET_GAME_EVENTS.PLAYER_CONNECTED, (player: Player) => {
		// 	console.log(`player connected: ${player.id}`);
		// });
		// this.socketService.registerSocketListener(
		// 	SOCKET_GAME_EVENTS.PLAYER_DISCONNECTED,
		// 	(playerId: string) => {
		// 		console.log(`player disconnected: ${playerId}`);
		// 	}
		// );
	}
}
