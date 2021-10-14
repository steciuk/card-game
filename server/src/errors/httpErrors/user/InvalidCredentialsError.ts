import { HttpError } from '../HttpError';

export class InvalidCredentialsError extends HttpError {
	constructor() {
		super(404, `Invalid username or password`);
	}
}
