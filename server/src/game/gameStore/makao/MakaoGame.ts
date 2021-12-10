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
	readonly deck = new Deck(DECK_TYPE.FULL);
	readonly discarded = new Deck(DECK_TYPE.FULL);
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

	get currentPlayerId(): string {
		return this.playersInOrder[this.currentPlayerNumber].id;
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

	getNumCards(num: number): { cardIds: CardId[]; refilled: boolean } {
		return this.deck.popNumRandomCardsAndRefillDeckIfNotEnough(num, this.discarded);
	}

	discardCard(cardId: CardId): void {
		this.discarded.add(cardId);
	}
}

export class InitialMakaoGameStateForPlayerDTO {
	constructor(
		private thisMakaoPlayer: ThisMakaoPlayerDTO,
		private currentPlayerId: string,
		private makaoPlayersInOrder: OtherMakaoPlayerDTO[],
		private numberOfCardsInDeck: number,
		private startingCardId: CardId
	) {}

	static fromMakaoGameDTO(
		makaoGame: MakaoGame,
		makaoPlayer: MakaoPlayer
	): InitialMakaoGameStateForPlayerDTO {
		return new InitialMakaoGameStateForPlayerDTO(
			ThisMakaoPlayerDTO.fromMakaoPlayer(makaoPlayer),
			makaoGame.currentPlayerId,
			makaoGame.playersInOrder.map((makaoPlayer: MakaoPlayer) =>
				OtherMakaoPlayerDTO.fromMakaoPlayer(makaoPlayer)
			),
			makaoGame.deck.getInDeck().length,
			makaoGame.discarded.getLastInDeck()
		);
	}
}
