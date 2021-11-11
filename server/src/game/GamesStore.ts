import { GameTypes } from './GameTypes';

export class GamesStore {
	private static instance: GamesStore;

	private activeGames = new Set<Game>();

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}

	public static get Instance(): GamesStore {
		return this.instance || (this.instance = new this());
	}
}

export class Game {
	// CONSTANTS
	gameType: GameTypes;
	owner: Player;
	maxPlayers: number;
	roomName: string;
	isPasswordProtected: boolean;
	password?: string;
	created: number;
	id: string;
	// VARIABLES
	isStarted = false;
	numPlayersInGame = 0;
	playersInGame = new Map<string, Player>();

	isRoomFull(): boolean {
		return this.maxPlayers - this.numPlayersInGame > 0;
	}

	start(): void {
		this.isStarted = true;
	}

	stop(): void {
		this.isStarted = false;
	}
}

export class Player {
	constructor(private id: string, private username: string) {}
}
