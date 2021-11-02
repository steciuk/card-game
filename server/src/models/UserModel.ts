import { IsString } from 'class-validator';
import { model, Schema } from 'mongoose';

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
	id: string;
}

const userSchema = new Schema<User>({
	username: {
		type: String,
		minlength: 6,
		maxlength: 20,
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
