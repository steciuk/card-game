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
	gameState = GAME_STATE.NOT_STARTED;
	protected abstract playersInGame: Map<string, Player>;

	get numPlayersInGame(): number {
		return this.playersInGame.size;
	}

	get numConnectedPlayersInGame(): number {
		return Array.from(this.playersInGame.values()).filter((player) => !player.isDisconnected).length;
	}

	isRoomFull(): boolean {
		return this.maxPlayers - this.numPlayersInGame <= 0;
	}

	start(): void {
		this.gameState = GAME_STATE.STARTED;
	}

	finish(): void {
		this.gameState = GAME_STATE.FINISHED;
	}

	getAllPlayersDTO(): PlayerDTO[] {
		return Array.from(this.playersInGame.values()).map((player) => PlayerDTO.fromPlayer(player));
	}

	addPlayer(player: Player): void {
		this.playersInGame.set(player.id, player);
	}

	disconnectPlayer(player: Player): void {
		if (this.gameState === GAME_STATE.NOT_STARTED) {
			this.playersInGame.delete(player.id);
			return;
		}

		player.isDisconnected = true;
	}

	getPlayer(id: string): Player | undefined {
		return this.playersInGame.get(id);
	}

	areAllPlayersReady(): boolean {
		return Array.from(this.playersInGame.values()).every((player) => player.isReady);
	}
}

export enum GAME_STATE {
	NOT_STARTED,
	STARTED,
	FINISHED,
}
