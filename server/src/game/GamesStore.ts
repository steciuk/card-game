import { GameTypes } from './GameTypes';

export class GamesStore {
	private static instance: GamesStore;

	private activeGames = new Map<string, Game>();

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {}

	static get Instance(): GamesStore {
		return this.instance || (this.instance = new this());
	}

	addGame(game: Game): void {
		this.activeGames.set(game.id, game);
	}

	deleteGame(id: string): void {
		this.activeGames.delete(id);
	}

	getGame(gameId: string): Game | undefined {
		return this.activeGames.get(gameId);
	}

	get allGamesAsArray(): Game[] {
		return Array.from(this.activeGames.values());
	}
}

export class Game {
	// CONSTANTS
	constructor(
		public gameType: GameTypes,
		public owner: Player,
		public maxPlayers: number,
		public roomName: string,
		public isPasswordProtected: boolean,
		public created: number,
		public id: string,
		public password?: string
	) {}
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

	getAllPlayers(): Player[] {
		return Array.from(this.playersInGame.values());
	}

	addPlayer(player: Player): void {
		this.playersInGame.set(player.id, player);
		this.numPlayersInGame++;
	}

	removePlayer(id: string): void {
		this.playersInGame.delete(id);
		this.numPlayersInGame--;
	}

	getPlayer(id: string): Player | undefined {
		return this.playersInGame.get(id);
	}
}

export class Player {
	isReady = false;
	constructor(public id: string, public username: string) {}

	toggleIsReady() {
		this.isReady = !this.isReady;
	}
}
