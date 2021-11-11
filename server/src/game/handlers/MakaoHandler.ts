import { Server, Socket } from 'socket.io';

import { Game, Player } from '../GamesStore';
import { GameTypes } from '../GameTypes';
import { GameHandler } from './SocketHandler';

export class MakaoHandler extends GameHandler {
	constructor(io: Server) {
		super(io, GameTypes.MAKAO);
		this.registerListeners();
	}

	protected onConnection(_socket: Socket, _game: Game, _player: Player): void {
		console.log('onConnect');
	}
}
