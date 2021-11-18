import { Subject } from 'rxjs';

import { UserDTO } from '../DTO/userDTO';

export class GameState {
	playersInGame = new Map<string, Player>();

	// TODO: emit usernames?
	updateUsers$ = new Subject<void>();
	private emitUpdateUsers = (): void => this.updateUsers$.next();

	setPlayersInGame(playersInGame: UserDTO[]): void {
		playersInGame.forEach((player) => this.playersInGame.set(player.id, new Player(player)));
		this.emitUpdateUsers();
	}

	addPlayer(player: UserDTO): void {
		this.playersInGame.set(player.id, new Player(player));
		this.emitUpdateUsers();
	}

	removePlayer(player: string): void {
		this.playersInGame.delete(player);
		this.emitUpdateUsers();
	}

	setPlayerReady(id: string, isReady: boolean): void {
		const player = this.playersInGame.get(id);
		if (player) player.isReady = isReady;
		this.emitUpdateUsers();
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
