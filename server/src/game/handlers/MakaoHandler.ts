import { Server, Socket } from 'socket.io';

import { Player } from '../gameStore/GamesStore';
import { MakaoGame } from '../gameStore/MakaoGame';
import { GameTypes } from '../GameTypes';
import { GameHandler } from './SocketHandler';

export class MakaoHandler extends GameHandler {
	constructor(io: Server) {
		super(io, GameTypes.MAKAO);
		this.registerListeners();
	}

	protected onConnection(socket: Socket, game: MakaoGame, player: Player): void {
		if (!(game instanceof MakaoGame)) throw new Error('GameType mismatch');
	}
}
