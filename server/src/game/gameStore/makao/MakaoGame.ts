import { GameTypes } from '../../GameTypes';
import { Game } from '../Game';
import { Player } from '../Player';
import { MakaoPlayer } from './MakaoPlayer';

export class MakaoGame extends Game {
	playersInGame: Map<string, MakaoPlayer>;

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
