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
				callback(InitialMakaoGameStateForPlayerDTO.fromMakaoGameAndPlayer(game, player));
			}
		);

		socket.on(
			SOCKET_GAME_EVENTS.CARD_PLAYED,
			(cardId: CardId, callback: (response: ResponseDTO) => void) => {
				if (!game.cardsPlayerCanPlay(player, cardId).length)
					return callback({ success: false, message: 'Cannot play that card' });

				player.deck.remove(cardId);
				game.discardCard(cardId);

				const cardPlayedDTO: CardPlayedDTO = {
					playerId: player.id,
					cardId: cardId,
				};
				this.emitToRoomAndSender(socket, SOCKET_GAME_EVENTS.CARD_PLAYED, game.id, cardPlayedDTO);
				callback({ success: true, message: cardId });
			}
		);

		socket.on(
			SOCKET_GAME_EVENTS.CARDS_TAKEN,
			(numCards: number, callback: (response: CardsTakenResponseDTO) => void) => {
				if (!game.canPlayerTakeCard(player))
					return callback({ success: false, cardIds: [], message: 'Cannot take card' });

				const { cardIds, refilled } =
					game.popNumRandomCardsFromDeckAndRefillWithDiscardedIfNeeded(numCards);

				player.deck.add(cardIds);

				const cardsTakenDTO: CardsTakenDTO = {
					playerId: player.id,
					numCards: cardIds.length,
					deckRefilled: refilled,
					numCardsInRefilled: game.numCardsInDeck,
				};
				this.emitToRoomAndSender(socket, SOCKET_GAME_EVENTS.CARDS_TAKEN, game.id, cardsTakenDTO);
				callback({ success: true, message: '', cardIds: cardIds });
			}
		);

		socket.on(SOCKET_GAME_EVENTS.TURN_FINISHED, (callback: (response: ResponseDTO) => void) => {
			if (!game.canPlayerFinishTurn(player))
				return callback({ success: false, message: 'Cannot finish turn' });

			game.nextPlayer();
			const currentPlayer = game.currentPlayer;
			const turnFinishedDTO: TurnFinishedDTO = { playerId: currentPlayer.id };
			this.emitToRoomAndSender(socket, SOCKET_GAME_EVENTS.TURN_FINISHED, game.id, turnFinishedDTO);
			socket
				.to(currentPlayer.socketId)
				.emit(SOCKET_GAME_EVENTS.UPDATE_ACTIONS, game.getActionsForPlayerDTO(currentPlayer));
			return callback({ success: true, message: '' });
		});
	}
}

type ResponseDTO = {
	success: boolean;
	message: string;
};

type TurnFinishedDTO = {
	playerId: string;
};

type CardsTakenResponseDTO = ResponseDTO & {
	cardIds: CardId[];
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
