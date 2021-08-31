import mongoose from 'mongoose';

type UserData = {
	username: string;
	password: string;
};

const userSchema = new mongoose.Schema({
	username: String,
	password: String,
});

export const UserModel = mongoose.model<UserData & mongoose.Document>(
	'User',
	userSchema
);
