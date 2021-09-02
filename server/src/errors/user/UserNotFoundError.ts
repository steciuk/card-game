import { HttpError } from '../HttpError';

export class UserNotFoundError extends HttpError {
	constructor(id: string) {
		super(404, `User with ${id} not found`);
	}
}
