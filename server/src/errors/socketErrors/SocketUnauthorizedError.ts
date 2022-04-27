import { SocketError } from './SocketError';

export class SocketUnauthorizedError extends SocketError {
	constructor() {
		super(401, 'Unauthorized');
	}
}

//TODO: Change status codes for own so no conflict between WrongRoomPassword and Unauthorized
