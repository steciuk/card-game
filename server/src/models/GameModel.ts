import { Document, model, ObjectId, Schema } from 'mongoose';

import { GameTypes } from '../game/GameTypes';

export interface GameDocument extends Document {
	gameType: string; // Mongoose does not support typescript enums
	ownerId: ObjectId;
	ownerName: string;
	maxPlayers: number;
	name: string;
	password?: string;
	created: number;
	id: string;
}

const gameSchema = new Schema<GameDocument>({
	gameType: {
		type: String,
		enum: Object.values(GameTypes),
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

export const GameModel = model<GameDocument>('Game', gameSchema);
