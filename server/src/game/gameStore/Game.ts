import { GameTypes } from '../GameTypes';
import { Player, PlayerDTO } from './Player';

export abstract class Game {
	// CONSTANTS
	constructor(
		public readonly gameType: GameTypes,
		public readonly owner: { id: string; username: string },
		public readonly maxPlayers: number,
		public readonly roomName: string,
		public readonly isPasswordProtected: boolean,
		public readonly created: number,
		public readonly id: string,
		public readonly password?: string
	) {}
	// VARIABLES
	isStarted = false;
	numPlayersInGame = 0;
	protected abstract playersInGame: Map<string, Player>;

	isRoomFull(): boolean {
		return this.maxPlayers - this.numPlayersInGame <= 0;
	}

	start(): void {
		this.isStarted = true;
	}

	stop(): void {
		this.isStarted = false;
	}

	getAllPlayersDTO(): PlayerDTO[] {
		return Array.from(this.playersInGame.values()).map((player) => PlayerDTO.fromPlayer(player));
	}

	addPlayer(player: Player): void {
		this.playersInGame.set(player.id, player);
		this.numPlayersInGame++;
	}

	removePlayer(player: Player): void {
		this.playersInGame.delete(player.id);
		this.numPlayersInGame--;
	}

	getPlayer(id: string): Player | undefined {
		return this.playersInGame.get(id);
	}

	areAllPlayersReady(): boolean {
		return Array.from(this.playersInGame.values()).every((player) => player.isReady);
	}
}
