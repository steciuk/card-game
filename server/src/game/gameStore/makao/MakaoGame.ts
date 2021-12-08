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
		this.playersInOrder.forEach((player) => {
			player.deck.add(this.deck.popNumRandomCardsAndRefillDeckIfNotEnough(5));
		});
	}
}

export class InitialMakaoGameStateForPlayerDTO {
	constructor(
		private thisMakaoPlayer: ThisMakaoPlayerDTO,
		private currentPlayerId: string,
		private makaoPlayersInOrder: OtherMakaoPlayerDTO[]
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
			)
		);
	}
}
