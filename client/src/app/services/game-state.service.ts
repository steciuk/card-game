import { Injectable } from '@angular/core';

import { UserDTO } from '../logic/DTO/userDTO';

@Injectable({
	providedIn: 'root',
})
export class GameStateService {
	private playersInGame = new Map<string, Player>();

	constructor() {}

	resetGameState(): void {
		this.playersInGame.clear();
	}

	setPlayersInGame(playersInGame: Player[]): void {
		playersInGame.forEach((player) => this.playersInGame.set(player.id, player));
	}

	addPlayer(player: Player): void {
		this.playersInGame.set(player.id, player);
	}

	removePlayer(player: string): void {
		this.playersInGame.delete(player);
	}

	setPlayerReady(id: string, isReady: boolean): void {
		const player = this.playersInGame.get(id);
		if (player) player.isReady = isReady;
	}

	getAllUsernamesAsArray(): Player[] {
		return Array.from(this.playersInGame.values());
	}
}

export class Player {
	isReady = false;
	id: string;
	username: string;

	constructor(userDTO: UserDTO) {
		this.id = userDTO.id;
		this.username = userDTO.username;
	}
}
