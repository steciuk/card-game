import { SocketError } from './SocketError';

export class SocketUserAlreadyConnectedError extends SocketError {
	constructor() {
		super(403, `You are already connected to game room`);
	}
}
