import { io, Socket } from 'socket.io-client';
import { NotLoggedInError } from 'src/app/errors/notLoggedInError';

import { GameTypes } from './gameResponse';

export class SocketController {
	private static url = 'http://localhost:8080';
	private socket?: Socket;

	constructor(private gameType: GameTypes) {}

	connect(gameId: string): void {
		if (isConnected(this.socket)) return;
		const token = localStorage.getItem('token');
		if (!token) throw new NotLoggedInError('no token found');
		this.socket = io(`${SocketController.url}/${this.gameType}`, {
			query: { token: token, gameId: gameId },
		});

		this.socket.on('connect', () => {
			console.log('Connected!');
		});

		this.socket.on('playerConnected', (players: string[]) => {
			console.log(players);
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
