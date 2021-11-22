import { io, Socket } from 'socket.io-client';

import { Injectable } from '@angular/core';

import { NotLoggedInError } from '../errors/notLoggedInError';
import { GameTypes } from '../logic/games/scenes/gamesSetup';
import { SOCKET_EVENTS } from '../logic/games/socketEvents/socketEvents';

//TODO: remove console.logs
@Injectable({
	providedIn: 'root',
})
export class SocketService {
	private url = 'http://localhost:8080';
	private socket?: Socket;

	constructor() {}

	create(gameId: string, gameType: GameTypes, password?: string): void {
		this.unregisterAllSocketListeners();
		this.disconnect();
		const token = localStorage.getItem('token');
		if (!token) throw new NotLoggedInError('no token found');

		let query = {};
		if (password) query = { token: token, gameId: gameId, password: password };
		else query = { token: token, gameId: gameId };
		this.socket = io(`${this.url}/${gameType}`, {
			query: query,
			autoConnect: false,
		});
	}

	connect(): void {
		if (!this.socket) return console.error('Socket not created');
		if (this.isConnected()) return console.error('Already connected');
		this.socket.connect();
	}

	registerSocketListener(event: SOCKET_EVENTS, callback: AnyCallback): void {
		if (!this.socket) return console.error('Socket not created');
		this.socket.on(event, callback);
	}

	unregisterAllSocketListeners(): void {
		if (!this.socket) return;
		this.socket.removeAllListeners();
	}
	unregisterSocketListener(event: SOCKET_EVENTS, callback: AnyCallback): void {
		if (!this.socket) return console.error('Socket not created');
		this.socket.off(event, callback);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	emitSocketEvent(event: SOCKET_EVENTS, ...args: any[]): void {
		if (!this.socket) return console.error('Socket not created');
		if (!this.isConnected()) return console.error('Socket not connected');
		this.socket.emit(event, ...args);
	}

	disconnect(): void {
		if (!this.socket) return;
		this.socket.disconnect();
		console.log('disconnected');
	}

	private isConnected(): boolean {
		return this.socket ? this.socket.connected : false;
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCallback = (...args: any[]) => void;
