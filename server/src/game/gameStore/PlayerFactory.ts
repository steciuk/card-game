import { BadRequestError } from '../../errors/httpErrors/BadRequestError';
import { GAME_TYPE } from '../GameTypes';
import { MakaoPlayer } from './makao/MakaoPlayer';
import { Player } from './Player';

export class PlayerFactory {
	static createPlayerObject(
		gameType: GAME_TYPE,
		id: string,
		username: string,
		socketId: string,
		isOwner: boolean
	): Player {
		if (gameType === GAME_TYPE.MAKAO) return new MakaoPlayer(id, username, socketId, isOwner);

		throw new BadRequestError();
	}
}
