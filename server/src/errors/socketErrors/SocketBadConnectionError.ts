import { SocketError } from './SocketError';

export class SocketBadConnectionError extends SocketError {
	constructor() {
		super(400, 'Bad connection');
	}
}
