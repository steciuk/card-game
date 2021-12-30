import { Game } from '../game/gameStore/Game';
import { GAME_TYPE } from '../game/GameTypes';
import { UserResponseDTO } from './UserResponseDTO';

export class GameResponseDTO {
	constructor(
		private gameType: GAME_TYPE,
		private owner: UserResponseDTO,
		private maxPlayers: number,
		private roomName: string,
		private isPasswordProtected: boolean,
		private id: string,
		private numPlayersInGame: number
	) {}

	static fromGame(game: Game): GameResponseDTO {
		return new GameResponseDTO(
			game.gameType,
			new UserResponseDTO(game.owner.id, game.owner.username),
			game.maxPlayers,
			game.roomName,
			game.isPasswordProtected,
			game.id,
			game.numPlayersInGame
		);
	}
}
