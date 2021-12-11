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

				game.discardCard(cardPlayed);
				const cardPlayedDTO: CardPlayedDTO = {
					playerId: player.id,
					cardId: cardPlayed,
				};
				this.emitToRoomAndSender(socket, SOCKET_GAME_EVENTS.CARD_PLAYED, game.id, cardPlayedDTO);
				callback({ success: true, message: cardPlayed });
			}
		);

		socket.on(
			SOCKET_GAME_EVENTS.CARDS_TAKEN,
			(numCards: number, callback: (response: CardsTakenResponseDTO) => void) => {
				if (game.currentPlayerId !== player.id)
					return callback({ success: false, cardIds: [], message: 'Not your turn' });

				const takeCardsResult =
					game.popNumRandomCardsFromDeckAndRefillWithDiscardedIfNeeded(numCards);
				if (!takeCardsResult)
					return callback({ success: false, cardIds: [], message: 'No more cards to take' });

				player.deck.add(takeCardsResult.cardIds);

				const cardsTakenDTO: CardsTakenDTO = {
					playerId: player.id,
					numCards: takeCardsResult.cardIds.length,
					deckRefilled: takeCardsResult.refilled,
					numCardsInRefilled: game.numCardsInDeck,
				};
				this.emitToRoomAndSender(socket, SOCKET_GAME_EVENTS.CARDS_TAKEN, game.id, cardsTakenDTO);
				callback({ success: true, message: '', cardIds: takeCardsResult.cardIds });
			}
		);

		socket.on(SOCKET_GAME_EVENTS.TURN_FINISHED, () => {
			if (game.currentPlayerId !== player.id) return;

			game.nextPlayer();
			const turnFinishedDTO: TurnFinishedDTO = { playerId: game.currentPlayerId };
			this.emitToRoomAndSender(socket, SOCKET_GAME_EVENTS.TURN_FINISHED, game.id, turnFinishedDTO);
		});
	}
}

type TurnFinishedDTO = {
	playerId: string;
};

type CardPlayedResponseDTO = {
	success: boolean;
	message: string;
};

type CardsTakenResponseDTO = {
	success: boolean;
	cardIds: CardId[];
	message: string;
};

type CardPlayedDTO = {
	playerId: string;
	cardId: CardId;
};

type CardsTakenDTO = {
	playerId: string;
	numCards: number;
	deckRefilled: boolean;
	numCardsInRefilled: number;
};
