import { SocketError } from './SocketError';

export class SocketWrongRoomPasswordError extends SocketError {
	constructor() {
		super('Wrong room password');
	}
}