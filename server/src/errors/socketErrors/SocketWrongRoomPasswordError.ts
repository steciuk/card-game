import { SocketError } from './SocketError';

export class SocketWrongRoomPasswordError extends SocketError {
	constructor() {
		super(499, 'Wrong room password');
	}
}
