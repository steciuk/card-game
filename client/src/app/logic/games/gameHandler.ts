import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { NotLoggedInError } from 'src/app/errors/notLoggedInError';

import { GameTypes } from '../DTO/gameDTO';
import { UserDTO } from '../DTO/userDTO';
import { GameState } from './gameState';
import { BUILD_IN_SOCKET_GAME_EVENTS } from './socketEvents/buildInSocketGameEvents';
import { SOCKET_GAME_EVENTS } from './socketEvents/socketGameEvents';

// TODO: as a service?
export class GameHandler {
	private static url = 'http://localhost:8080';
	private socket?: Socket;
	private connection$ = new Subject<CONNECTION_STATUS>();
	gameState = new GameState();

	constructor(private gameType: GameTypes) {}

	connect(gameId: string, password?: string): void {
		if (this.isConnected(this.socket)) return;
		const token = localStorage.getItem('token');
		if (!token) throw new NotLoggedInError('no token found');

		let query = {};
		if (password) query = { token: token, gameId: gameId, password: password };
		else query = { token: token, gameId: gameId };
		this.socket = io(`${GameHandler.url}/${this.gameType}`, {
			query: query,
		});

		this.socket.on(BUILD_IN_SOCKET_GAME_EVENTS.CONNECT, () => {
			console.log('connected');
			this.emitConnection(CONNECTION_STATUS.CONNECTED);
		});

		this.socket.on(BUILD_IN_SOCKET_GAME_EVENTS.CONNECT_ERROR, (error) => {
			this.disconnect();
			if (error.message === 'Socket - Wrong room password') {
				//TODO: Some custom error types
				this.emitConnection(CONNECTION_STATUS.WRONG_PASSWORD);
			}
			console.log('err', error);
		});

		this.socket.on(SOCKET_GAME_EVENTS.PLAYER_CONNECTED, (players: UserDTO[]) => {
			this.gameState.setPlayersInGame(players);
		});
	}

	disconnect(): void {
		if (!this.socket) return;
		console.log('disconnected');
		this.socket.disconnect();
	}

	public getConnection$(): Subject<CONNECTION_STATUS> {
		return this.connection$;
	}

	private emitConnection = (connection: CONNECTION_STATUS): void => this.connection$.next(connection);

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
