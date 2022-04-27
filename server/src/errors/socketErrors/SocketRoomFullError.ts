import { SocketError } from './SocketError';

export class SocketRoomFullError extends SocketError {
	constructor() {
		super(423, `Room full`);
	}
}
