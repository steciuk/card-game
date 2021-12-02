import { Deck, DECK_TYPE } from '../deck/Deck';
import { Player } from '../Player';

export class MakaoPlayer extends Player {
	deck = new Deck(DECK_TYPE.FULL);

	constructor(id: string, username: string, socketId: string) {
		super(id, username, socketId);
	}
}
