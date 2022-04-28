import { SocketError } from './SocketError';

export class SocketSessionExpiredError extends SocketError {
	constructor() {
		super(440, 'Session expired');
	}
}

//TODO: Change status codes for own so no conflict between WrongRoomPassword and Unauthorized
