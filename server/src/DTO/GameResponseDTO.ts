import { Game } from '../game/gameStore/Game';
import { GameTypes } from '../game/GameTypes';
import { UserResponseDTO } from './UserResponseDTO';

export class GameResponseDTO {
	constructor(
		private gameType: GameTypes,
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
			UserResponseDTO.fromPlayer(game.owner),
			game.maxPlayers,
			game.roomName,
			game.isPasswordProtected,
			game.id,
			game.numPlayersInGame
		);
	}
}
