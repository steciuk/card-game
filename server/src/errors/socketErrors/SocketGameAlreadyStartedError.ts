import { SocketError } from './SocketError';

export class SocketGameAlreadyStartedError extends SocketError {
	constructor() {
		super(`Game has already started`);
	}
}
