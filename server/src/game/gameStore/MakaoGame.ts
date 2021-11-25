import { GameTypes } from '../GameTypes';
import { Game } from './Game';
import { Player } from './GamesStore';

export class MakaoGame extends Game {
	constructor(
		public gameType: GameTypes,
		public owner: Player,
		public maxPlayers: number,
		public roomName: string,
		public isPasswordProtected: boolean,
		public created: number,
		public id: string,
		public password?: string
	) {
		super(gameType, owner, maxPlayers, roomName, isPasswordProtected, created, id, password);
	}
}
