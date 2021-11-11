import { Server, Socket } from 'socket.io';

import { GameHandler } from './GameHandler';
import { GameTypes } from './GameTypes';

export class MakaoHandler extends GameHandler {
	constructor(io: Server) {
		super(io, GameTypes.MAKAO);
		this.registerListeners();
	}

	protected onConnection(_socket: Socket, _gameId: string, _username: string, _userId: string): void {
		console.log('onConnect');
	}
}
