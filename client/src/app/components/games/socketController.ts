import { io, Socket } from 'socket.io-client';
import { NotLoggedInError } from 'src/app/errors/notLoggedInError';

export class SocketController {
	private socket?: Socket;

	private url = '';

	connect(): void {
		const token = localStorage.getItem('token');
		if (!token) throw new NotLoggedInError('no token found');
		this.socket = io('http://localhost:8080', { query: { token: token } });
	}

	disconnect(): void {
		if (!this.socket) return;
		this.socket.disconnect();
	}
}
