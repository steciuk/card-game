import { HttpError } from '../HttpError';

export class SessionExpiredError extends HttpError {
	constructor() {
		super(440, 'Session expired');
	}
}
