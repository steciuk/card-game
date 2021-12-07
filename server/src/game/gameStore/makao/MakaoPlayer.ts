import { CardId } from '../deck/Card';
import { Deck, DECK_TYPE } from '../deck/Deck';
import { Player } from '../Player';

export class MakaoPlayer extends Player {
	deck = new Deck(DECK_TYPE.FULL);

	constructor(id: string, username: string, socketId: string) {
		super(id, username, socketId);
	}
}

export class OtherMakaoPlayerDTO {
	constructor(private id: string, private username: string, private numCards: number) {}

	static fromMakaoPlayer(makaoPlayer: MakaoPlayer): OtherMakaoPlayerDTO {
		return new OtherMakaoPlayerDTO(
			makaoPlayer.id,
			makaoPlayer.username,
			makaoPlayer.deck.getNumOfCardsInDeck()
		);
	}
}

export class ThisMakaoPlayerDTO {
	constructor(private id: string, private username: string, private cards: CardId[]) {}

	static fromMakaoPlayer(makaoPlayer: MakaoPlayer): ThisMakaoPlayerDTO {
		return new ThisMakaoPlayerDTO(makaoPlayer.id, makaoPlayer.username, makaoPlayer.deck.getInDeck());
	}
}
