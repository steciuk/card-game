import { HttpError } from '../HttpError';

export class UserExistsError extends HttpError {
	constructor(username: string) {
		super(409, `User with ${username} already exists`);
	}
}
