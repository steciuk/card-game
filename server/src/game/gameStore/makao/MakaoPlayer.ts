import { CardId } from '../deck/Card';
import { Deck, DECK_TYPE } from '../deck/Deck';
import { Player } from '../Player';

export class MakaoPlayer extends Player {
	deck = new Deck(DECK_TYPE.FULL);
	numCardsToTake = 0;
	numTurnsToWait = 0;
	requestedCardToPlay: CardId | null = null;

	constructor(id: string, username: string, socketId: string, isOwner: boolean) {
		super(id, username, socketId, isOwner);
	}

	get isActive(): boolean {
		return !this.isDisconnected && this.numTurnsToWait <= 0;
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
	constructor(private id: string, private username: string, private cardIds: CardId[]) {}

	static fromMakaoPlayer(makaoPlayer: MakaoPlayer): ThisMakaoPlayerDTO {
		return new ThisMakaoPlayerDTO(makaoPlayer.id, makaoPlayer.username, makaoPlayer.deck.getInDeck());
	}
}
