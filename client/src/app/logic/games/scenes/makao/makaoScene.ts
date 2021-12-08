import { SocketService } from 'src/app/services/socket.service';

import { HEX_COLORS_STRING } from '../../phaserComponents/HexColors';
import { PhaserCard } from '../../phaserComponents/phaserDeck/phaserCard';
import { PhaserDeck } from '../../phaserComponents/phaserDeck/phaserDeck';
import { PhaserInterActiveDeck } from '../../phaserComponents/phaserDeck/phaserInterActiveDeck';
import { PhaserDropZone } from '../../phaserComponents/phaserDropZone';
import { PhaserTurnArrow } from '../../phaserComponents/phaserTurnArrow';
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
	thisPlayer!: ThisMakaoPlayer;
	playersIdsInOrder: string[] = [];
	shiftedPlayersIdsInOrder: string[] = [];
	players = new Map<string, OtherMakaoPlayer>();
	currentPlayerId = '';
	numberOfPlayers = 0;

	turnArrow!: PhaserTurnArrow;

	constructor(socketService: SocketService) {
		super(socketService, { key: SCENE_KEYS.MAKAO });
		this.registerListeners();
	}

	init(): void {}

	preload(): void {
		this.loadAllPlayingCards();
		this.loadBacks();
		this.loadTurnArrow();
	}

	create(): void {
		this.add.text(0, 0, 'Makao');
		this.drawDropZone();

		this.socketService.emitSocketEvent(
			SOCKET_GAME_EVENTS.GET_GAME_STATE,
			(makaoGameStateForPlayer: InitialMakaoGameStateForPlayerDTO) => {
				this.updateGameState(makaoGameStateForPlayer);
				this.afterCreate();
			}
		);
	}

	private afterCreate(): void {
		this.turnArrow = new PhaserTurnArrow(this, this.getCurrentPlayer().rotation);
	}

	update(): void {}

	registerListeners(): void {
		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.CARD_PLAYED,
			(cardPlayedDTO: CardPlayedDTO) => {
				if (cardPlayedDTO.playerId !== this.thisPlayer.id) {
					this.players.get(cardPlayedDTO.playerId)?.deck.destroyCard();
				}
				new PhaserCard(
					this,
					this.xRelative(0.5),
					this.yRelative(0.5),
					cardPlayedDTO.cardId,
					SCENE_CONFIG.BASE_CARD_SCALE
				).randomizeAngle();

				// TODO: updateGameState
				this.currentPlayerId = cardPlayedDTO.currentPlayerId;
				//
				this.updateTurnArrow();
			}
		);
	}

	private updateGameState(makaoGameStateForPlayer: InitialMakaoGameStateForPlayerDTO): void {
		const midPoint = { x: this.xRelative(0.5), y: this.yRelative(0.5) };

		this.currentPlayerId = makaoGameStateForPlayer.currentPlayerId;
		this.numberOfPlayers = makaoGameStateForPlayer.makaoPlayersInOrder.length;

		this.playersIdsInOrder = makaoGameStateForPlayer.makaoPlayersInOrder.map(
			(makaoPlayer) => makaoPlayer.id
		);

		const thisPlayerIndex = this.playersIdsInOrder.indexOf(makaoGameStateForPlayer.thisMakaoPlayer.id);
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
					otherMakaoPlayerDTO,
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

		this.thisPlayer = new ThisMakaoPlayer(
			makaoGameStateForPlayer.thisMakaoPlayer,
			this,
			this.xRelative(0.5),
			this.yRelative(0.9),
			0,
			SCENE_CONFIG.BASE_CARD_SCALE,
			this.width * SCENE_CONFIG.THIS_PLAYER_DECK_PART_OF_SCREEN_WIDTH
		);
	}

	private updateTurnArrow(): void {
		this.turnArrow.updateRotation(this.getCurrentPlayer().rotation);
	}

	private getCurrentPlayer(): MakaoPlayer {
		return this.currentPlayerId === this.thisPlayer.id
			? this.thisPlayer
			: (this.players.get(this.currentPlayerId) as MakaoPlayer);
	}

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

type CardPlayedDTO = {
	playerId: string;
	cardId: string;
	currentPlayerId: string;
};

type OtherMakaoPlayerDTO = {
	id: string;
	username: string;
	numCards: number;
};

type ThisMakaoPlayerDTO = {
	id: string;
	username: string;
	cardIds: string[];
};

type InitialMakaoGameStateForPlayerDTO = {
	thisMakaoPlayer: ThisMakaoPlayerDTO;
	currentPlayerId: string;
	makaoPlayersInOrder: OtherMakaoPlayerDTO[];
};

class MakaoPlayer {
	constructor(public id: string, public username: string, public rotation: number) {}
}

class ThisMakaoPlayer extends MakaoPlayer {
	deck: PhaserInterActiveDeck;

	constructor(
		thisMakaoPlayerDTO: ThisMakaoPlayerDTO,
		scene: BaseScene,
		x: number,
		y: number,
		rotation: number,
		cardsScale: number,
		deckWidth: number
	) {
		super(thisMakaoPlayerDTO.id, thisMakaoPlayerDTO.username, rotation);
		this.id = thisMakaoPlayerDTO.id;
		this.username = thisMakaoPlayerDTO.username;
		this.deck = new PhaserInterActiveDeck(scene, x, y, rotation, cardsScale, deckWidth);
		this.deck.addCards(thisMakaoPlayerDTO.cardIds);
	}
}

class OtherMakaoPlayer extends MakaoPlayer {
	deck: PhaserDeck;

	constructor(
		otherMakaoPlayerDTO: OtherMakaoPlayerDTO,
		scene: BaseScene,
		x: number,
		y: number,
		rotation: number,
		cardsScale: number,
		deckWidth: number
	) {
		super(otherMakaoPlayerDTO.id, otherMakaoPlayerDTO.username, rotation);
		this.deck = new PhaserDeck(scene, x, y, rotation, cardsScale, deckWidth);
		this.deck.addCards('RB', otherMakaoPlayerDTO.numCards);
		this.deck.addToAdditionalContainer(
			// TODO: magic numbers, do cleaner
			scene.add
				.text(0, -100 - cardsScale * 100, otherMakaoPlayerDTO.username, {
					color: HEX_COLORS_STRING.BLACK,
				})
				.setOrigin(0.5)
		);
	}
}
