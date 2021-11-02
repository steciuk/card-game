import { SocketError } from './SocketError';

export class SocketUserAlreadyConnectedError extends SocketError {
	constructor(id: string) {
		super(`User with ${id} already connected`);
	}
}
