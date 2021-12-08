import { Server, Socket } from 'socket.io';

import { CardId } from '../gameStore/deck/Card';
import {
	InitialMakaoGameStateForPlayerDTO,
	MakaoGame
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
			(callback: (makaoGameStateForPlayer: InitialMakaoGameStateForPlayerDTO) => void) => {
				callback(InitialMakaoGameStateForPlayerDTO.fromMakaoGameDTO(game, player));
			}
		);

		socket.on(
			SOCKET_GAME_EVENTS.CARD_PLAYED,
			(cardId: CardId, callback: (response: CardPlayedResponseDTO) => void) => {
				if (game.currentPlayerId !== player.id)
					return callback({ played: false, message: 'Not your turn' });
				const cardPlayed = player.deck.pop(cardId);
				if (!cardPlayed) return callback({ played: false, message: 'No such card in your deck' });

				game.nextPlayer();

				this.emitToRoomAndSender(socket, SOCKET_GAME_EVENTS.CARD_PLAYED, game.id, {
					playerId: player.id,
					cardId: cardPlayed,
					currentPlayerId: game.currentPlayerId,
				} as CardPlayedDTO);

				callback({ played: true, message: cardPlayed });
			}
		);
	}
}

type CardPlayedResponseDTO = {
	played: boolean;
	message: string;
};

type CardPlayedDTO = {
	playerId: string;
	cardId: CardId;
	currentPlayerId: string;
};
