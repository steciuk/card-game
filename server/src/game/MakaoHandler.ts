import { Server, Socket } from 'socket.io';

import { GameType } from '../models/GameModel';
import { GameHandler } from './GameHandler';

export class MakaoHandler extends GameHandler {
	constructor(io: Server) {
		super(io, GameType.MAKAO);
		this.registerListeners();
	}

	protected onConnection(socket: Socket, gameId: string, username: string, userId: string): void {
		console.log('onConnect');
	}
}
