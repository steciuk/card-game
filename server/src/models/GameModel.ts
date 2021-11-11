import { Document, model, ObjectId, Schema } from 'mongoose';

import { GameTypes } from '../game/GameTypes';

export interface GameDocument extends Document {
	gameType: GameTypes;
	ownerId: ObjectId;
	maxPlayers: number;
	roomName: string;
	created: number;
	isPasswordProtected: boolean;
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
	maxPlayers: {
		type: Number,
		required: true,
	},
	roomName: {
		type: String, // TODO: validate with regex
		minlength: 3,
		maxlength: 20,
		required: true,
	},
	created: {
		type: Number,
		required: true,
	},
	isPasswordProtected: {
		type: Boolean,
		required: true,
	},
});

export const GameModel = model<GameDocument>('Game', gameSchema);
