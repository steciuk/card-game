import { BadRequestError } from '../../errors/httpErrors/BadRequestError';
import { GameTypes } from '../GameTypes';
import { MakaoPlayer } from './makao/MakaoPlayer';
import { Player } from './Player';

export class PlayerFactory {
	static createPlayerObject(
		gameType: GameTypes,
		id: string,
		username: string,
		socketId: string,
		isOwner: boolean
	): Player {
		if (gameType === GameTypes.MAKAO) return new MakaoPlayer(id, username, socketId, isOwner);

		throw new BadRequestError();
	}
}
