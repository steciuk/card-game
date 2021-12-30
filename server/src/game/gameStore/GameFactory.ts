import { BadRequestError } from '../../errors/httpErrors/BadRequestError';
import { GAME_TYPE } from '../GameTypes';
import { Game } from './Game';
import { MakaoGame } from './makao/MakaoGame';

export class GameFactory {
	static createGameObject(
		gameType: GAME_TYPE,
		owner: { id: string; username: string },
		maxPlayers: number,
		roomName: string,
		isPasswordProtected: boolean,
		created: number,
		id: string,
		password?: string
	): Game {
		if (gameType === GAME_TYPE.MAKAO)
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
