import { shuffleArray } from '../../../utils/Tools';
import { GameTypes } from '../../GameTypes';
import { CardId } from '../deck/Card';
import { Deck, DECK_TYPE } from '../deck/Deck';
import { Game } from '../Game';
import {
	MakaoPlayer,
	OtherMakaoPlayerDTO,
	ThisMakaoPlayerDTO
} from './MakaoPlayer';

export class MakaoGame extends Game {
	protected playersInGame = new Map<string, MakaoPlayer>();
	private readonly deck = new Deck(DECK_TYPE.FULL);
	private readonly discarded = new Deck(DECK_TYPE.FULL);
	playersInOrder: MakaoPlayer[];
	private currentPlayerNumber = 0;

	constructor(
		gameType: GameTypes,
		owner: { id: string; username: string },
		maxPlayers: number,
		roomName: string,
		isPasswordProtected: boolean,
		created: number,
		id: string,
		password?: string
	) {
		super(gameType, owner, maxPlayers, roomName, isPasswordProtected, created, id, password);
	}

	get currentPlayer(): MakaoPlayer {
		return this.playersInOrder[this.currentPlayerNumber];
	}

	nextPlayer(): void {
		if (this.currentPlayerNumber >= this.numPlayersInGame - 1) this.currentPlayerNumber = 0;
		else this.currentPlayerNumber++;
	}

	start(): void {
		super.start();
		this.playersInOrder = shuffleArray(Array.from(this.playersInGame.values()));

		this.deck.full();
		this.discarded.empty();

		this.discarded.add(this.deck.popNumRandomCardsAndRefillDeckIfNotEnough(1).cardIds);
		this.playersInOrder.forEach((player) => {
			player.deck.add(this.deck.popNumRandomCardsAndRefillDeckIfNotEnough(5).cardIds);
		});
	}

	popNumRandomCardsFromDeckAndRefillWithDiscardedIfNeeded(num: number): {
		cardIds: CardId[];
		refilled: boolean;
	} {
		return this.deck.popNumRandomCardsAndRefillDeckIfNotEnough(num, this.discarded);
	}

	get numCardsInDeck(): number {
		return this.deck.getInDeck().length;
	}

	get topCard(): CardId {
		return this.discarded.getLastInDeck();
	}

	discardCard(cardId: CardId): void {
		this.discarded.add(cardId);
	}

	private isPlayerTurn(playerId: string): boolean {
		return playerId === this.currentPlayer.id;
	}

	canPlayerTakeCard(player: MakaoPlayer): boolean {
		if (!this.isPlayerTurn(player.id)) return false;
		if (this.deck.getNumOfCardsInDeck() <= 0 && this.discarded.getNumOfCardsInDeck() <= 1) return false;
		return true;
	}

	cardsPlayerCanPlay(player: MakaoPlayer, cardId?: CardId): CardId[] {
		if (!this.isPlayerTurn(player.id)) return [];
		if (cardId) {
			if (player.deck.hasCard(cardId)) return [cardId];
			else return [];
		}
		return player.deck.getInDeck();
	}

	canPlayerFinishTurn(player: MakaoPlayer): boolean {
		if (!this.isPlayerTurn(player.id)) return false;
		return true;
	}

	getActionsForPlayerDTO(player: MakaoPlayer): ActionsDTO {
		return {
			canPlayerTakeCard: this.canPlayerTakeCard(player),
			cardsPlayerCanPlay: this.cardsPlayerCanPlay(player),
			canPlayerFinishTurn: this.canPlayerFinishTurn(player),
		};
	}
}

export class InitialMakaoGameStateForPlayerDTO {
	private constructor(
		private thisMakaoPlayer: ThisMakaoPlayerDTO,
		private currentPlayerId: string,
		private makaoPlayersInOrder: OtherMakaoPlayerDTO[],
		private numberOfCardsInDeck: number,
		private startingCardId: CardId,
		private thisPlayerActions: ActionsDTO
	) {}

	static fromMakaoGameAndPlayer(
		makaoGame: MakaoGame,
		makaoPlayer: MakaoPlayer
	): InitialMakaoGameStateForPlayerDTO {
		return new InitialMakaoGameStateForPlayerDTO(
			ThisMakaoPlayerDTO.fromMakaoPlayer(makaoPlayer),
			makaoGame.currentPlayer.id,
			makaoGame.playersInOrder.map((makaoPlayer: MakaoPlayer) =>
				OtherMakaoPlayerDTO.fromMakaoPlayer(makaoPlayer)
			),
			makaoGame.numCardsInDeck,
			makaoGame.topCard,
			makaoGame.getActionsForPlayerDTO(makaoPlayer)
		);
	}
}

export type ActionsDTO = {
	canPlayerTakeCard: boolean;
	cardsPlayerCanPlay: CardId[];
	canPlayerFinishTurn: boolean;
};

// export class ActionsDTO {
// 	private constructor(
// 		private canTakeCard: boolean,
// 		private canPlayCard: boolean,
// 		private canFinishTurn: boolean
// 	) {}

// 	static fromMakaoGameAndPlayer(makaoGame: MakaoGame, makaoPlayer: MakaoPlayer): ActionsDTO | null {
// 		if (makaoPlayer.id !== makaoGame.currentPlayerId) return null;
// 		return new ActionsDTO(true, true, true);
// 	}
// }
