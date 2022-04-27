import { SocketError } from './SocketError';

export class SocketGameAlreadyStartedError extends SocketError {
	constructor() {
		super(410, `Game has already started`);
	}
}
