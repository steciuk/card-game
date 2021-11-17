import { UserDTO } from '../DTO/userDTO';

export class GameState {
	playersInGame: UserDTO[] = [];

	setPlayersInGame(playersInGame: UserDTO[]): void {
		this.playersInGame = playersInGame;
	}
}
