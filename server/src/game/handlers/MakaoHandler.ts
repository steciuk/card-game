import { Server, Socket } from 'socket.io';

import { CardId } from '../gameStore/deck/Card';
import {
	MakaoGame,
	MakaoGameStateForPlayerDTO
} from '../gameStore/makao/MakaoGame';
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
			if (game.numPlayersInGame < 2) return callback('Minimum 2 players required');
			if (!game.areAllPlayersReady()) return callback('Not all players ready');
			game.start();
			this.emitToRoomAndSender(socket, SOCKET_GAME_EVENTS.START_GAME, game.id);
		});

		socket.on(
			SOCKET_GAME_EVENTS.GET_GAME_STATE,
			(callback: (makaoGameStateForPlayer: MakaoGameStateForPlayerDTO) => void) => {
				callback(MakaoGameStateForPlayerDTO.fromMakaoGameDTO(game, player));
			}
		);

		socket.on(
			SOCKET_GAME_EVENTS.CARD_PLAYED,
			(cardId: CardId, callback: (response: CardPlayedDTO) => void) => {
				// if(game.currentPlayerId !== player.id) return callback({played: false, message: 'Not your turn'})
				const cardPlayed = player.deck.pop(cardId);
				if (!cardPlayed) return callback({ played: false, message: 'No such card in your deck' });

				socket.to(game.id).emit(SOCKET_GAME_EVENTS.CARD_PLAYED, {
					played: true,
					playerId: player.id,
					message: cardPlayed,
				});

				callback({ played: true, message: cardPlayed });
			}
		);
	}
}

type CardPlayedDTO = {
	played: boolean;
	playerId?: string;
	message: string;
};
