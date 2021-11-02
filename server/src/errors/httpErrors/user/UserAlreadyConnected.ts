import { HttpError } from '../HttpError';

export class UserAlreadyConnected extends HttpError {
	constructor(id: string) {
		super(409, `User with ${id} already connected`);
	}
}
