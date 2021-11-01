import { io, Socket } from 'socket.io-client';
import { NotLoggedInError } from 'src/app/errors/notLoggedInError';

export class SocketController {
	private static url = 'http://localhost:8080';
	private socket?: Socket;

	connect(gameId: string): void {
		if (isConnected(this.socket)) return;
		const token = localStorage.getItem('token');
		if (!token) throw new NotLoggedInError('no token found');
		this.socket = io(SocketController.url, { query: { token: token, gameId: gameId } });

		this.socket.on('connect', () => {
			console.log('Connected!');
		});

		this.socket.on('playerConnected', (playerName: string) => {
			console.log(playerName);
		});
	}

	disconnect(): void {
		if (!isConnected(this.socket)) return;
		this.socket.disconnect();
	}
}

function isConnected(socket?: Socket): socket is Socket {
	return socket ? socket.connected : false;
}
