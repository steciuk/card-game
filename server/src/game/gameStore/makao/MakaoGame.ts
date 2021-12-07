import { shuffleArray } from '../../../utils/Tools';
import { GameTypes } from '../../GameTypes';
import { Deck, DECK_TYPE } from '../deck/Deck';
import { Game } from '../Game';
import {
	MakaoPlayer,
	OtherMakaoPlayerDTO,
	ThisMakaoPlayerDTO
} from './MakaoPlayer';

export class MakaoGame extends Game {
	playersInGame = new Map<string, MakaoPlayer>();
	deck = new Deck(DECK_TYPE.FULL);
	discarded = new Deck(DECK_TYPE.FULL);
	playersInOrder: MakaoPlayer[];
	currentPlayerNumber = 0;

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
}

export class MakaoGameStateForPlayerDTO {
	constructor(
		private thisMakaoPlayer: ThisMakaoPlayerDTO,
		private currentPlayerNumber: number,
		private makaoPlayersInOrder: OtherMakaoPlayerDTO[]
	) {}

	static fromMakaoGameDTO(makaoGame: MakaoGame, makaoPlayer: MakaoPlayer): MakaoGameStateForPlayerDTO {
		return new MakaoGameStateForPlayerDTO(
			ThisMakaoPlayerDTO.fromMakaoPlayer(makaoPlayer),
			makaoGame.currentPlayerNumber,
			makaoGame.playersInOrder.map((makaoPlayer: MakaoPlayer) =>
				OtherMakaoPlayerDTO.fromMakaoPlayer(makaoPlayer)
			)
		);
	}
}
