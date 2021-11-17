import { SocketError } from './SocketError';

export class SocketRoomFullError extends SocketError {
	constructor() {
		super(`Room full`);
	}
}
