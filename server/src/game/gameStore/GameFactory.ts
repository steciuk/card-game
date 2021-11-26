import { BadRequestError } from '../../errors/httpErrors/BadRequestError';
import { GameTypes } from '../GameTypes';
import { Game } from './Game';
import { MakaoGame } from './makao/MakaoGame';
import { Player } from './Player';

export class GameFactory {
	static createGameObject(
		gameType: GameTypes,
		owner: Player,
		maxPlayers: number,
		roomName: string,
		isPasswordProtected: boolean,
		created: number,
		id: string,
		password?: string
	): Game {
		if (gameType === GameTypes.MAKAO)
			return new MakaoGame(
				gameType,
				owner,
				maxPlayers,
				roomName,
				isPasswordProtected,
				created,
				id,
				password
			);

		throw new BadRequestError();
	}
}
