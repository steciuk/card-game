import { shuffleArray } from '../../../utils/Tools';
import { GameTypes } from '../../GameTypes';
import { Deck, DECK_TYPE } from '../deck/Deck';
import { Game } from '../Game';
import { MakaoPlayer } from './MakaoPlayer';

export class MakaoGame extends Game {
	playersInGame = new Map<string, MakaoPlayer>();
	deck = new Deck(DECK_TYPE.FULL);
	discarded = new Deck(DECK_TYPE.FULL);
	playersInOrder: MakaoPlayer[];
	currentPlayer = 0;

	constructor(
		public gameType: GameTypes,
		public owner: { id: string; username: string },
		public maxPlayers: number,
		public roomName: string,
		public isPasswordProtected: boolean,
		public created: number,
		public id: string,
		public password?: string
	) {
		super(gameType, owner, maxPlayers, roomName, isPasswordProtected, created, id, password);
	}

	start(): void {
		super.start();
		this.playersInOrder = shuffleArray(Array.from(this.playersInGame.values()));

		this.deck.full();
		this.discarded.empty();
		this.playersInOrder.forEach((player) => {
			player.deck.add(this.deck.popNumRandomCardsAndRefillDeckIfNotEnough(5));
		});
	}

	getPlayersInOrderIds(): string[] {
		return this.playersInOrder.map((player) => player.id);
	}

	// toMakaoGameStateDTO(player: MakaoPlayer): MakaoGameStateDTO {
	// 	// return {};
	// }
}

// class MakaoGameStateDTO {
// 	constructor(private cards: CardId[], private currentPlayer: number){

// 	}
// }
