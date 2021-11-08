import { elog } from '../../utils/Logger';

export class SocketError extends Error {
	constructor(message?: string) {
		super(message ? `Socket - ${message}` : 'Socket - Something gone wrong');
		elog('CONSTRUCTOR', this);
	}
}
