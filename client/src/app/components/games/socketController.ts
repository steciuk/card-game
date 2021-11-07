import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { NotLoggedInError } from 'src/app/errors/notLoggedInError';

import { GameTypes } from './gameResponse';

export class SocketController {
	private static url = 'http://localhost:8080';
	private socket?: Socket;
	private playersInGame$ = new Subject<string[]>();

	constructor(private gameType: GameTypes) {}

	connect(gameId: string): void {
		if (this.isConnected(this.socket)) return;
		const token = localStorage.getItem('token');
		if (!token) throw new NotLoggedInError('no token found');
		this.socket = io(`${SocketController.url}/${this.gameType}`, {
			query: { token: token, gameId: gameId },
		});

		this.socket.on('connect', () => {
			console.log('Connected!');
		});

		this.socket.on('playerConnected', (players: string[]) => {
			this.emitPlayers(players);
		});
	}

	disconnect(): void {
		if (!this.isConnected(this.socket)) return;
		this.socket.disconnect();
	}

	public getPlayersInGame$(): Subject<string[]> {
		return this.playersInGame$;
	}
	private emitPlayers = (players: string[]): void => this.playersInGame$.next(players);

	private isConnected(socket?: Socket): socket is Socket {
		return socket ? socket.connected : false;
	}

	public isSocketConnected(): boolean {
		return this.isConnected(this.socket);
	}
}
