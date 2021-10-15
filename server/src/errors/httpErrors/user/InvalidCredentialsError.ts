import { HttpError } from '../HttpError';

export class InvalidCredentialsError extends HttpError {
	constructor() {
		super(401, 'Invalid username or password');
	}
}
