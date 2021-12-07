import { SocketService } from 'src/app/services/socket.service';

import {
	CardPlayedDTO,
	PhaserDeck
} from '../../phaserComponents/phaserDeck/phaserDeck';
import { PhaserInterActiveDeck } from '../../phaserComponents/phaserDeck/phaserInterActiveDeck';
import { PhaserDropZone } from '../../phaserComponents/phaserDropZone';
import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketEvents';
import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../gamesSetup';

const SCENE_CONFIG = {
	N_GON_RADIUS_PART_OF_GAME_SCREEN: 0.8,
	DECK_PART_OF_N_GON_SIDE: 0.8,
	BASE_CARD_SCALE: 0.2,
	MIN_CARD_SCALE: 0.1,
	THIS_PLAYER_DECK_PART_OF_SCREEN_WIDTH: 0.8,
	DROP_ZONE_PERCENTAGE_OF_SCREEN: 0.3,
};

export class MakaoScene extends BaseScene {
	thisPlayer!: ThisMakaoPlayerDTO;
	playersIdsInOrder: string[] = [];
	shiftedPlayersIdsInOrder: string[] = [];
	players = new Map<string, OtherMakaoPlayer>();
	currentPlayerNumber = 0;
	numberOfPlayers = 0;

	deckWidth = 0;
	otherPlayersCardsScale = 0;

	constructor(socketService: SocketService) {
		super(socketService, { key: SCENE_KEYS.MAKAO });
		this.registerListeners();
	}

	init(): void {}

	preload(): void {
		this.loadAllPlayingCards();
		this.loadBacks();
	}

	create(): void {
		this.add.text(0, 0, 'Makao');
		this.socketService.emitSocketEvent(
			SOCKET_GAME_EVENTS.GET_GAME_STATE,
			(makaoGameStateForPlayer: MakaoGameStateForPlayerDTO) => {
				this.updateGameState(makaoGameStateForPlayer);
				this.afterCreate();
			}
		);
	}

	private afterCreate(): void {
		// this.drawOtherPlayersCards();
		this.drawThisPlayersCards();
		this.drawDropZone();
	}

	update(): void {}

	registerListeners(): void {
		//FIXME: temporary
		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.CARD_PLAYED,
			(cardPlayedDTO: CardPlayedDTO) => {
				this.players.get(cardPlayedDTO.playerId as string)?.deck.destroyCard();
				this.add
					.sprite(this.xRelative(0.5), this.yRelative(0.5), cardPlayedDTO.message)
					.setScale(SCENE_CONFIG.BASE_CARD_SCALE);
			}
		);
	}

	private updateGameState(makaoGameStateForPlayer: MakaoGameStateForPlayerDTO): void {
		const midPoint = { x: this.xRelative(0.5), y: this.yRelative(0.5) };

		this.thisPlayer = makaoGameStateForPlayer.thisMakaoPlayer;
		this.currentPlayerNumber = makaoGameStateForPlayer.currentPlayerNumber;
		this.numberOfPlayers = makaoGameStateForPlayer.makaoPlayersInOrder.length;

		this.playersIdsInOrder = makaoGameStateForPlayer.makaoPlayersInOrder.map(
			(makaoPlayer) => makaoPlayer.id
		);

		const thisPlayerIndex = this.playersIdsInOrder.indexOf(this.thisPlayer.id);
		this.shiftedPlayersIdsInOrder = [...this.playersIdsInOrder];
		this.shiftedPlayersIdsInOrder = this.shiftedPlayersIdsInOrder.concat(
			this.shiftedPlayersIdsInOrder.splice(0, thisPlayerIndex)
		);

		const otherPlayersCardsScale = Math.max(
			SCENE_CONFIG.BASE_CARD_SCALE - (this.numberOfPlayers - 2) * 0.02,
			SCENE_CONFIG.MIN_CARD_SCALE
		);

		const radius =
			(Math.min(this.height, this.width) / 2) * SCENE_CONFIG.N_GON_RADIUS_PART_OF_GAME_SCREEN;

		const deckWidth =
			2 * radius * Math.sin(Math.PI / this.numberOfPlayers) * SCENE_CONFIG.DECK_PART_OF_N_GON_SIDE;

		makaoGameStateForPlayer.makaoPlayersInOrder
			.sort(
				(a, b) =>
					this.shiftedPlayersIdsInOrder.indexOf(a.id) - this.shiftedPlayersIdsInOrder.indexOf(b.id)
			)
			.slice(1)
			.forEach((otherMakaoPlayerDTO, i) => {
				i += 1;
				const otherPlayer = new OtherMakaoPlayer(
					otherMakaoPlayerDTO.id,
					otherMakaoPlayerDTO.username,
					otherMakaoPlayerDTO.numCards,
					this,
					Math.round(
						midPoint.x + radius * Math.cos(Math.PI * ((2 * i) / this.numberOfPlayers + 0.5))
					),
					Math.round(
						midPoint.y + radius * Math.sin(Math.PI * ((2 * i) / this.numberOfPlayers + 0.5))
					),
					Math.PI * ((2 * i) / this.numberOfPlayers),
					otherPlayersCardsScale,
					deckWidth
				);

				this.players.set(otherPlayer.id, otherPlayer);
			});
	}

	private drawThisPlayersCards(): void {
		new PhaserInterActiveDeck(
			this,
			this.xRelative(0.5),
			this.yRelative(0.9),
			0,
			SCENE_CONFIG.BASE_CARD_SCALE,
			this.width * SCENE_CONFIG.THIS_PLAYER_DECK_PART_OF_SCREEN_WIDTH,
			this.thisPlayer.cards
		);
	}

	// private drawOtherPlayersCards(): void {
	// 	this.shiftedPlayersIdsInOrder.slice(1).forEach((playerId) => {
	// 		const player = this.players.get(playerId) as MakaoPlayer;
	// 		player.deck = new PhaserDeck(
	// 			this,
	// 			player.x,
	// 			player.y,
	// 			player.rotation,
	// 			this.otherPlayersCardsScale,
	// 			this.deckWidth,
	// 			'RB',
	// 			player.numCards
	// 		);
	// 	});
	// }

	private drawDropZone(): void {
		new PhaserDropZone(
			this,
			this.xRelative(0.5),
			this.yRelative(0.5),
			this.xRelative(SCENE_CONFIG.DROP_ZONE_PERCENTAGE_OF_SCREEN),
			this.yRelative(SCENE_CONFIG.DROP_ZONE_PERCENTAGE_OF_SCREEN)
		);
	}
}

type OtherMakaoPlayerDTO = {
	id: string;
	username: string;
	numCards: number;
};

type ThisMakaoPlayerDTO = {
	id: string;
	username: string;
	cards: string[];
};

type MakaoGameStateForPlayerDTO = {
	thisMakaoPlayer: ThisMakaoPlayerDTO;
	currentPlayerNumber: number;
	makaoPlayersInOrder: OtherMakaoPlayerDTO[];
};

// class MakaoPlayer {
// 	x = 0;
// 	y = 0;
// 	rotation = 0;

// 	constructor(public id: string, public username: string) {}
// }

// class ThisMakaoPlayer extends MakaoPlayer {
// 	constructor(id: string, username: string, public cards: string[]) {
// 		super(id, username);
// 	}

// 	static fromThisMakaoPlayerDTO(thisMakaoPlayerDto: ThisMakaoPlayerDTO): ThisMakaoPlayer {
// 		return new ThisMakaoPlayer(
// 			thisMakaoPlayerDto.id,
// 			thisMakaoPlayerDto.username,
// 			thisMakaoPlayerDto.cards
// 		);
// 	}
// }

class OtherMakaoPlayer {
	//FIXME: temporary
	deck: PhaserDeck;

	constructor(
		public id: string,
		public username: string,
		public numCards: number,
		scene: BaseScene,
		x: number,
		y: number,
		rotation: number,
		cardsScale: number,
		deckWidth: number
	) {
		this.deck = new PhaserDeck(scene, x, y, rotation, cardsScale, deckWidth, 'RB', numCards);
	}
}
