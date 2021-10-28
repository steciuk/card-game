import { IsString } from 'class-validator';
import { model, ObjectId, Schema } from 'mongoose';

//TODO: restrict length of inputs on backend
export class UserDTO {
	@IsString()
	username: string;
	@IsString()
	password: string;
}

export interface User extends Document {
	username: string;
	hash: string;
	salt: string;
	id: ObjectId;
}

const userSchema = new Schema<User>({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	hash: {
		type: String,
		required: true,
	},
	salt: {
		type: String,
		required: true,
	},
});

export const UserModel = model<User>('User', userSchema);
