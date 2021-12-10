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
			if (!player.isOwner && !game.areAllPlayersReady()) return callback('Not all players ready');
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
					return callback({ success: false, message: 'Not your turn' });
				const cardPlayed = player.deck.pop(cardId);
				if (!cardPlayed) return callback({ success: false, message: 'No such card in your deck' });

				game.nextPlayer();

				this.emitToRoomAndSender(socket, SOCKET_GAME_EVENTS.CARD_PLAYED, game.id, {
					playerId: player.id,
					cardId: cardPlayed,
					currentPlayerId: game.currentPlayerId,
				} as CardPlayedDTO);

				callback({ success: true, message: cardPlayed });
			}
		);

		socket.on(SOCKET_GAME_EVENTS.GET_CARD, (callback: (response: CardTakenResponseDTO) => void) => {
			const { cardIds, refilled } = game.getNumCards(1);
			player.deck.add(cardIds);
			callback({ success: true, cardIds: cardIds });
		});
	}
}

type CardPlayedResponseDTO = {
	success: boolean;
	message: string;
};

type CardTakenResponseDTO = {
	success: boolean;
	cardIds: CardId[];
	message?: string;
};

type CardPlayedDTO = {
	playerId: string;
	cardId: CardId;
	currentPlayerId: string;
};
