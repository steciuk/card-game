import { GAME_TYPE } from '../GameTypes';
import { GamesStore } from './GamesStore';
import { Player, PlayerDTO } from './Player';

export abstract class Game {
	// CONSTANTS
	constructor(
		public readonly gameType: GAME_TYPE,
		public readonly owner: { id: string; username: string },
		public readonly maxPlayers: number,
		public readonly roomName: string,
		public readonly isPasswordProtected: boolean,
		public readonly created: number,
		public readonly id: string,
		public readonly password?: string
	) {
		this.startRemoveFromGameStoreTimeout();
	}
	// VARIABLES
	gameState = GAME_STATE.NOT_STARTED;
	protected abstract playersInGame: Map<string, Player>;
	private removeFromGameStoreTimeout?: NodeJS.Timeout;

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
		this.stopRemoveFromGameStoreTimeout();
	}

	disconnectPlayer(player: Player): void {
		if (this.gameState === GAME_STATE.NOT_STARTED) this.playersInGame.delete(player.id);
		else player.isDisconnected = true;

		if (this.numConnectedPlayersInGame <= 0) this.startRemoveFromGameStoreTimeout();
	}

	getPlayer(id: string): Player | undefined {
		return this.playersInGame.get(id);
	}

	areAllPlayersReady(): boolean {
		return Array.from(this.playersInGame.values()).every((player) => player.isReady);
	}

	protected startRemoveFromGameStoreTimeout(): void {
		this.removeFromGameStoreTimeout = setTimeout(() => {
			GamesStore.Instance.deleteGame(this.id);
		}, 3 * 60_000);
	}

	protected stopRemoveFromGameStoreTimeout(): void {
		if (this.removeFromGameStoreTimeout) clearTimeout(this.removeFromGameStoreTimeout);
	}
}

export enum GAME_STATE {
	NOT_STARTED,
	STARTED,
	FINISHED,
}
