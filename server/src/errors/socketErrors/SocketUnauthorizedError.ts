import { SocketError } from './SocketError';

export class SocketUnauthorizedError extends SocketError {
	constructor(message?: string) {
		super(message || `Unauthorized`);
	}
}
