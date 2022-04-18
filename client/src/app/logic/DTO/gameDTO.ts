import { UserDTO } from 'src/app/logic/DTO/userDTO';
import { GameTypes } from 'src/app/logic/games/scenes/gameTypes';

export type GameDTO = {
	gameType: GameTypes;
	owner: UserDTO;
	maxPlayers: number;
	roomName: string;
	isPasswordProtected: boolean;
	id: string;
	numPlayersInGame: number;
};
