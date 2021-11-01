import {
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	Min
} from 'class-validator';
import { Document, model, ObjectId, Schema } from 'mongoose';

export enum GameType {
	'MAKAO',
}

export class GameDTO {
	@IsEnum(GameType)
	gameType: GameType;

	@IsNumber()
	@Min(2)
	@Max(8)
	maxPlayers: number;

	@IsString()
	name: string;

	@IsString()
	@IsOptional()
	password?: string;
}

export interface Game extends Document {
	gameType: string; // Mongoose does not support typescript enums
	ownerId: ObjectId;
	ownerName: string;
	maxPlayers: number;
	name: string;
	password?: string;
	created: number;
	id: ObjectId;
}

const gameSchema = new Schema<Game>({
	gameType: {
		type: String,
		enum: Object.values(GameType),
		required: true,
	},
	ownerId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	ownerName: {
		type: String,
		required: true,
	},
	maxPlayers: {
		type: Number,
		required: true,
	},
	name: {
		type: String, // TODO: validate with regex
		minlength: 3,
		maxlength: 20,
		required: true,
	},
	password: {
		type: String, // TODO: do not store in plaintext
		minlength: 3,
		maxlength: 20,
		required: false,
	},
	created: {
		type: Number,
		required: true,
	},
});

export const GameModel = model<Game>('Game', gameSchema);

export class GameResponseDTO {
	private isPasswordProtected = false;

	constructor(
		private ownerName: string,
		private gameType: GameType,
		private maxPlayers: number,
		private name: string,
		private id: string,
		password: string | undefined
	) {
		if (password) this.isPasswordProtected = true;
	}
}

export function gameToResponseDTO(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	game: Document<any, any, Game> & Game & { _id: ObjectId } // TODO: temporary workaround
): GameResponseDTO {
	return new GameResponseDTO(
		game.ownerName,
		game.gameType as unknown as GameType,
		game.maxPlayers,
		game.name,
		game.id,
		game.password
	);
}
