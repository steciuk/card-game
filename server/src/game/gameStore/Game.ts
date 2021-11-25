import { GameTypes } from '../GameTypes';
import { Player } from './GamesStore';

export abstract class Game {
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

	areAllPlayersReady(): boolean {
		return Array.from(this.playersInGame.values()).every((player) => player.isReady);
	}
}
