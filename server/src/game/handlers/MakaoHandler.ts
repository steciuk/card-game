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
			if (game.areAllPlayersReady()) {
				game.start();
				this.emitToRoomAndSender(socket, SOCKET_GAME_EVENTS.START_GAME, game.id);
			} else callback('Not all players ready'); //TODO: standardize callback responses
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
				if (cardPlayed) return callback({ played: true });
				else return callback({ played: false, message: 'No such card in your deck' });
			}
		);
	}
}

type CardPlayedDTO = {
	played: boolean;
	message?: string;
};
