import { Server, Socket } from 'socket.io';

import { MakaoGame } from '../gameStore/makao/MakaoGame';
import { MakaoPlayer } from '../gameStore/makao/MakaoPlayer';
import { GameTypes } from '../GameTypes';
import { GameHandler } from './SocketHandler';

export class MakaoHandler extends GameHandler {
	constructor(io: Server) {
		super(io, GameTypes.MAKAO);
		this.registerListeners();
	}

	protected onConnection(socket: Socket, game: MakaoGame, player: MakaoPlayer): void {
		if (!(game instanceof MakaoGame)) throw new Error('GameType mismatch');
		if (!(player instanceof MakaoPlayer)) throw new Error('PlayerType mismatch');
	}
}
