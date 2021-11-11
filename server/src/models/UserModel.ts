import { model, Schema } from 'mongoose';

export interface UserDocument extends Document {
	username: string;
	hash: string;
	salt: string;
	id: string;
}

const userSchema = new Schema<UserDocument>({
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

export const UserModel = model<UserDocument>('User', userSchema);
