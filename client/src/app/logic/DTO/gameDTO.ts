import { GameTypes } from '../games/scenes/gamesSetup';
import { UserDTO } from './userDTO';

export type GameDTO = {
	gameType: GameTypes;
	owner: UserDTO;
	maxPlayers: number;
	roomName: string;
	isPasswordProtected: boolean;
	id: string;
	numPlayersInGame: number;
};
