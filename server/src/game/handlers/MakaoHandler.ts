import { Server, Socket } from 'socket.io';

import { MakaoGame } from '../gameStore/makao/MakaoGame';
import { MakaoPlayer } from '../gameStore/makao/MakaoPlayer';
import { GameTypes } from '../GameTypes';
import { SOCKET_GAME_EVENTS } from './SocketEvents';
import { GameHandler } from './SocketHandler';

export class MakaoHandler extends GameHandler {
	constructor(io: Server) {
		super(io, GameTypes.MAKAO);
		this.registerListeners();
	}

	protected onConnection(socket: Socket, game: MakaoGame, player: MakaoPlayer): void {
		if (!(game instanceof MakaoGame)) throw new Error('GameType mismatch');
		if (!(player instanceof MakaoPlayer)) throw new Error('PlayerType mismatch');

		socket.on(SOCKET_GAME_EVENTS.START_GAME, (callback: (messageToLog: string) => void) => {
			if (game.areAllPlayersReady()) {
				game.start();
				socket.emit(
					SOCKET_GAME_EVENTS.START_GAME,
					player.deck.getInDeck(),
					game.getPlayersInOrderIds()
				);
				game.playersInOrder.forEach((playerInGame: MakaoPlayer) => {
					socket
						.to(playerInGame.socketId)
						.emit(
							SOCKET_GAME_EVENTS.START_GAME,
							playerInGame.deck.getInDeck(),
							game.getPlayersInOrderIds()
						);
				});
			} else callback('Not all players ready'); //TODO: standardize callback responses
		});
	}
}
