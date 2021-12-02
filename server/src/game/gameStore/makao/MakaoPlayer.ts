import { Deck, DECK_TYPE } from '../deck/Deck';
import { Player } from '../Player';

export class MakaoPlayer extends Player {
	deck = new Deck(DECK_TYPE.FULL);

	constructor(id: string, username: string, socketId: string) {
		super(id, username, socketId);
	}
}

export class MakaoPlayerDTO {
	private id: string;
	private username: string;
	private numCards: number;
	constructor(makaoPlayer: MakaoPlayer) {
		this.id = makaoPlayer.id;
		this.username = makaoPlayer.username;
		this.numCards = makaoPlayer.deck.getNumOfCardsInDeck();
	}
}
