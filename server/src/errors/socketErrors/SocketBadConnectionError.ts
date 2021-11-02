import { SocketError } from './SocketError';

export class SocketBadConnectionError extends SocketError {
	constructor() {
		super('Bad connection');
	}
}
