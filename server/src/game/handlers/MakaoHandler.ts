import { Server, Socket } from 'socket.io';

import { CardId } from '../gameStore/deck/Card';
import {
	ActionsDTO,
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
			(cardId: CardId, callback: (response: CardPlayedResponseDTO | FailureResponseDTO) => void) => {
				if (!game.canPlayerPlayCard(player, cardId))
					return callback({ success: false, error: 'Cannot play that card' });

				player.deck.remove(cardId);
				const playedCard = game.playCard(cardId);

				const cardPlayedDTO: CardPlayedDTO = {
					playerId: player.id,
					cardId: playedCard,
				};
				socket.to(game.id).emit(SOCKET_GAME_EVENTS.CARD_PLAYED, cardPlayedDTO);
				callback({ success: true, actions: game.getActionsForPlayerDTO(player), cardId: playedCard });
			}
		);

		//TODO: merge with CARD_PLAYED?
		socket.on(
			SOCKET_GAME_EVENTS.CARD_WITH_OPTION_PLAYED,
			(
				playedCardId: CardId,
				chosenCardId: CardId,
				callback: (response: CardPlayedResponseDTO | FailureResponseDTO) => void
			) => {
				if (!game.canPlayerPlayCardWithOption(player, playedCardId, chosenCardId))
					return callback({ success: false, error: 'Cannot play that card' });

				player.deck.remove(playedCardId);
				const playedCard = game.playCard(playedCardId, chosenCardId);

				const cardPlayedDTO: CardPlayedDTO = {
					playerId: player.id,
					cardId: playedCard,
				};
				socket.to(game.id).emit(SOCKET_GAME_EVENTS.CARD_PLAYED, cardPlayedDTO);
				callback({
					success: true,
					actions: game.getActionsForPlayerDTO(player),
					cardId: playedCard,
				});
			}
		);

		socket.on(
			SOCKET_GAME_EVENTS.CARDS_TAKEN,
			(callback: (response: CardsTakenResponseDTO | FailureResponseDTO) => void) => {
				if (!game.canPlayerTakeCard(player))
					return callback({ success: false, error: 'Cannot take card' });

				const { cardIds, refilled } = game.takeCard(player);

				const cardsTakenDTO: CardsTakenDTO = {
					playerId: player.id,
					numCards: cardIds.length,
					deckRefilled: refilled,
					numCardsInRefilled: game.numCardsInDeck,
				};
				socket.to(game.id).emit(SOCKET_GAME_EVENTS.CARDS_TAKEN, cardsTakenDTO);
				callback({
					success: true,
					cardIds: cardIds,
					actions: game.getActionsForPlayerDTO(player),
					deckRefilled: refilled,
					numCardsInRefilled: game.numCardsInDeck,
				});
			}
		);

		socket.on(
			SOCKET_GAME_EVENTS.TURN_FINISHED,
			(callback: (response: TurnFinishedResponseDTO | FailureResponseDTO) => void) => {
				if (!game.canPlayerFinishTurn(player))
					return callback({ success: false, error: 'Cannot finish turn' });

				game.finishTurn();
				const currentPlayer = game.currentPlayer;
				const turnFinishedDTO: TurnFinishedDTO = { playerId: currentPlayer.id };
				socket.to(game.id).emit(SOCKET_GAME_EVENTS.TURN_FINISHED, turnFinishedDTO);

				if (currentPlayer.id !== player.id) {
					socket
						.to(currentPlayer.socketId)
						.emit(SOCKET_GAME_EVENTS.UPDATE_ACTIONS, game.getActionsForPlayerDTO(currentPlayer));
				}
				return callback({
					success: true,
					playerId: currentPlayer.id,
					actions: game.getActionsForPlayerDTO(player),
				});
			}
		);
	}
}

type SuccessResponseDTO = {
	success: true;
};

type FailureResponseDTO = {
	success: false;
	error: string;
};

type TurnFinishedResponseDTO = SuccessResponseDTO & {
	playerId: string;
	actions: ActionsDTO | null;
};

type CardPlayedResponseDTO = SuccessResponseDTO & {
	cardId: CardId;
	actions: ActionsDTO | null;
};

type CardsTakenResponseDTO = SuccessResponseDTO & {
	cardIds: CardId[];
	deckRefilled: boolean;
	numCardsInRefilled: number;
	actions: ActionsDTO | null;
};

type TurnFinishedDTO = {
	playerId: string;
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
