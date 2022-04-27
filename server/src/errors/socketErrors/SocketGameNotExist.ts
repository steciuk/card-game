import { SocketError } from './SocketError';

export class SocketGameNotExistError extends SocketError {
	constructor() {
		super(404, 'Game no longer exists');
	}
}
