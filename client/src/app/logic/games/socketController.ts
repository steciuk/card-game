import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { NotLoggedInError } from 'src/app/errors/notLoggedInError';

import { GameTypes } from './gameResponse';

export class SocketController {
	private static url = 'http://localhost:8080';
	private socket?: Socket;
	private playersInGame$ = new Subject<string[]>();
	private connection$ = new Subject<CONNECTION_STATUS>();

	constructor(private gameType: GameTypes) {}

	connect(gameId: string, password?: string): void {
		if (this.isConnected(this.socket)) return;
		const token = localStorage.getItem('token');
		if (!token) throw new NotLoggedInError('no token found');

		let query = {};
		if (password) query = { token: token, gameId: gameId, password: password };
		else query = { token: token, gameId: gameId };
		this.socket = io(`${SocketController.url}/${this.gameType}`, {
			query: query,
		});

		this.socket.on('connect', () => {
			console.log('connected');
			this.emitConnection(CONNECTION_STATUS.CONNECTED);
		});

		this.socket.on('connect_error', (error) => {
			this.disconnect();
			if (error.message === 'Socket - Wrong room password') {
				//TODO: Some custom error types
				this.emitConnection(CONNECTION_STATUS.WRONG_PASSWORD);
			}
			console.log('err', error);
		});

		this.socket.on('playerConnected', (players: string[]) => {
			this.emitPlayers(players);
		});
	}

	disconnect(): void {
		if (!this.socket) return;
		console.log('disconnected');
		this.socket.disconnect();
	}

	public getPlayersInGame$(): Subject<string[]> {
		return this.playersInGame$;
	}

	public getConnection$(): Subject<CONNECTION_STATUS> {
		return this.connection$;
	}

	private emitConnection = (connection: CONNECTION_STATUS): void => this.connection$.next(connection);
	private emitPlayers = (players: string[]): void => this.playersInGame$.next(players);

	private isConnected(socket?: Socket): socket is Socket {
		return socket ? socket.connected : false;
	}

	public isSocketConnected(): boolean {
		return this.isConnected(this.socket);
	}
}

export enum CONNECTION_STATUS {
	CONNECTED,
	WRONG_PASSWORD,
}
