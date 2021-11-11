import { Document, ObjectId } from 'mongoose';

import { GameTypes } from '../game/GameTypes';
import { GameDocument } from '../models/GameModel';

export class GameResponseDTO {
	private isPasswordProtected = false;

	constructor(
		private ownerName: string,
		private gameType: GameTypes,
		private maxPlayers: number,
		private name: string,
		private id: string,
		password: string | undefined
	) {
		if (password) this.isPasswordProtected = true;
	}

	static fromGameDocument(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		game: Document<any, any, GameDocument> & GameDocument & { _id: ObjectId }
	): GameResponseDTO {
		return new GameResponseDTO(
			game.ownerName,
			game.gameType as unknown as GameTypes,
			game.maxPlayers,
			game.name,
			game.id,
			game.password
		);
	}
}
