import { SocketService } from 'src/app/services/socket.service';

import { HEX_COLORS_STRING } from '../../phaserComponents/HexColors';
import { PhaserButton } from '../../phaserComponents/phaserButton';
import { PhaserClickableDeck } from '../../phaserComponents/phaserDeck/phaserClickableDeck';
import { PhaserDeck } from '../../phaserComponents/phaserDeck/phaserDeck';
import { PhaserPlayableDeck } from '../../phaserComponents/phaserDeck/phaserPlayableDeck';
import { PhaserDropZone } from '../../phaserComponents/phaserDropZone';
import { PhaserTurnArrow } from '../../phaserComponents/phaserTurnArrow';
import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketEvents';
import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../gamesSetup';

const SCENE_CONFIG = {
	N_GON_RADIUS_PART_OF_GAME_SCREEN: 0.8,
	DECK_PART_OF_N_GON_SIDE: 0.8,
	BASE_CARD_HEIGHT: 200,
	MIN_CARD_HEIGHT: 100,
	THIS_PLAYER_DECK_PART_OF_SCREEN_WIDTH: 0.8,
	DROP_ZONE_PERCENTAGE_OF_SCREEN: 0.3,
};

export class MakaoScene extends BaseScene {
	thisPlayer!: ThisMakaoPlayer;
	playersIdsInOrder: string[] = [];
	shiftedPlayersIdsInOrder: string[] = [];
	players = new Map<string, OtherMakaoPlayer>();
	numberOfPlayers = 0;

	midPoint!: { x: number; y: number };
	discarded!: PhaserDeck;
	deck!: PhaserClickableDeck;
	turnArrow!: PhaserTurnArrow;
	finishTurnButton!: PhaserButton;

	constructor(socketService: SocketService) {
		super(socketService, { key: SCENE_KEYS.MAKAO });
		this.registerListeners();
	}

	init(): void {
		this.midPoint = { x: this.xRelative(0.5), y: this.smallerScreenDimension / 2 };
	}

	preload(): void {
		this.loadAllPlayingCards();
		this.loadBacks();
		this.loadTurnArrow();
	}

	create(): void {
		this.add.text(0, 0, 'Makao');
		new PhaserDropZone(
			this,
			this.midPoint.x,
			this.midPoint.y,
			this.smallerScreenDimension * SCENE_CONFIG.DROP_ZONE_PERCENTAGE_OF_SCREEN,
			this.smallerScreenDimension * SCENE_CONFIG.DROP_ZONE_PERCENTAGE_OF_SCREEN
		);

		this.discarded = new PhaserDeck(
			this,
			this.midPoint.x,
			this.midPoint.y,
			0,
			SCENE_CONFIG.BASE_CARD_HEIGHT,
			0
		);

		this.deck = new PhaserClickableDeck(
			this,
			this.midPoint.x,
			this.yRelative(0.65),
			0,
			SCENE_CONFIG.BASE_CARD_HEIGHT,
			0
		).enable(true);

		this.turnArrow = new PhaserTurnArrow(this, this.midPoint.x, this.midPoint.y, 0);

		this.finishTurnButton = new PhaserButton(
			this,
			this.xRelative(0.1),
			this.yRelative(0.75),
			'Finish turn',
			() => {
				this.socketService.emitSocketEvent(
					SOCKET_GAME_EVENTS.TURN_FINISHED,
					(turnFinishedResponseDTO: ResponseDTO) => {
						if (!turnFinishedResponseDTO.success)
							return console.warn(turnFinishedResponseDTO.message);
						this.updateTurnBasedInteractiveElements(null);
					}
				);
			}
		).enable(false);

		this.socketService.emitSocketEvent(
			SOCKET_GAME_EVENTS.GET_GAME_STATE,
			(makaoGameStateForPlayer: InitialMakaoGameStateForPlayerDTO) => {
				this.updateGameState(makaoGameStateForPlayer);
				this.afterCreate();
			}
		);
	}

	private afterCreate(): void {
		this.deck.addEvent('pointerup', () => {
			this.socketService.emitSocketEvent(
				SOCKET_GAME_EVENTS.CARDS_TAKEN,
				1,
				(cardTakenResponseDTO: CardsTakenResponseDTO) => {
					if (cardTakenResponseDTO.success)
						this.thisPlayer.deck.addCards(cardTakenResponseDTO.cardIds);
					else console.warn(cardTakenResponseDTO.message);
				}
			);
		});
	}

	update(): void {}

	private registerListeners(): void {
		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.CARD_PLAYED,
			(cardPlayedDTO: CardPlayedDTO) => {
				if (cardPlayedDTO.playerId !== this.thisPlayer.id) {
					this.players.get(cardPlayedDTO.playerId)?.deck.destroyNumLastCards(1);
				}
				this.discarded.addCards(cardPlayedDTO.cardId, true);
			}
		);

		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.CARDS_TAKEN,
			(cardsTakenDTO: CardsTakenDTO) => {
				if (cardsTakenDTO.playerId !== this.thisPlayer.id) {
					this.players
						.get(cardsTakenDTO.playerId)
						?.deck.addCards('RB', false, cardsTakenDTO.numCards);
				}

				if (!cardsTakenDTO.deckRefilled) return this.deck.destroyNumLastCards(cardsTakenDTO.numCards);
				this.discarded.destroyAllButNumLastCards(1);
				this.deck.destroyAllButNumLastCards(0);
				this.deck.addCards('RB', true, cardsTakenDTO.numCardsInRefilled);
			}
		);

		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.TURN_FINISHED,
			(turnFinishedDTO: TurnFinishedDTO) => {
				this.updateTurnArrow(turnFinishedDTO.playerId);
			}
		);

		this.registerSocketListenerForScene(SOCKET_GAME_EVENTS.UPDATE_ACTIONS, (actionsDTO: ActionsDTO) => {
			this.updateTurnBasedInteractiveElements(actionsDTO);
		});
	}

	private updateGameState(makaoGameStateForPlayer: InitialMakaoGameStateForPlayerDTO): void {
		this.discarded.addCards(makaoGameStateForPlayer.startingCardId, true);
		this.deck.addCards('RB', true, makaoGameStateForPlayer.numberOfCardsInDeck);

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
			SCENE_CONFIG.BASE_CARD_HEIGHT -
				((this.numberOfPlayers - 2) / 5) *
					(SCENE_CONFIG.BASE_CARD_HEIGHT - SCENE_CONFIG.MIN_CARD_HEIGHT),
			SCENE_CONFIG.MIN_CARD_HEIGHT
		);

		const radius = (this.smallerScreenDimension / 2) * SCENE_CONFIG.N_GON_RADIUS_PART_OF_GAME_SCREEN;

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
						this.midPoint.x + radius * Math.cos(Math.PI * ((2 * i) / this.numberOfPlayers + 0.5))
					),
					Math.round(
						this.midPoint.y + radius * Math.sin(Math.PI * ((2 * i) / this.numberOfPlayers + 0.5))
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
			SCENE_CONFIG.BASE_CARD_HEIGHT,
			this.width * SCENE_CONFIG.THIS_PLAYER_DECK_PART_OF_SCREEN_WIDTH
		);

		console.log(makaoGameStateForPlayer.thisPlayerActions);
		this.updateTurnBasedInteractiveElements(makaoGameStateForPlayer.thisPlayerActions);
		this.updateTurnArrow(makaoGameStateForPlayer.currentPlayerId);
	}

	private updateTurnArrow(playerId: string): void {
		this.turnArrow.updateRotation(this.getPlayer(playerId).rotation);
	}

	private updateTurnBasedInteractiveElements(actionsDto: ActionsDTO | null): void {
		console.log(
			!!actionsDto?.canPlayerFinishTurn,
			!!actionsDto?.canPlayerTakeCard,
			!!actionsDto?.cardsPlayerCanPlay.length
		);
		this.finishTurnButton.enable(!!actionsDto?.canPlayerFinishTurn);
		this.deck.enable(!!actionsDto?.canPlayerTakeCard);
		this.thisPlayer.deck.enable(!!actionsDto?.cardsPlayerCanPlay.length);
	}

	private getPlayer(playerId: string): MakaoPlayer {
		return playerId === this.thisPlayer.id
			? this.thisPlayer
			: (this.players.get(playerId) as MakaoPlayer);
	}
}

export type ResponseDTO = {
	success: boolean;
	message: string;
};

type ActionsDTO = {
	canPlayerTakeCard: boolean;
	cardsPlayerCanPlay: string[];
	canPlayerFinishTurn: boolean;
};

type TurnFinishedDTO = {
	playerId: string;
};

type CardPlayedDTO = {
	playerId: string;
	cardId: string;
};

type CardsTakenDTO = {
	playerId: string;
	numCards: number;
	deckRefilled: boolean;
	numCardsInRefilled: number;
};

type CardsTakenResponseDTO = ResponseDTO & {
	cardIds: string[];
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
	numberOfCardsInDeck: number;
	startingCardId: string;
	thisPlayerActions: ActionsDTO;
};

class MakaoPlayer {
	constructor(public id: string, public username: string, public rotation: number) {}
}

class ThisMakaoPlayer extends MakaoPlayer {
	deck: PhaserPlayableDeck;

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
		this.deck = new PhaserPlayableDeck(scene, x, y, rotation, cardsScale, deckWidth);
		this.deck.addCards(thisMakaoPlayerDTO.cardIds).enable(false);
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
		this.deck = new PhaserDeck(scene, x, y, rotation, cardsScale, deckWidth)
			.addCards('RB', false, otherMakaoPlayerDTO.numCards)
			.addToAdditionalContainer(
				// TODO: magic numbers, do cleaner
				scene.add
					.text(0, -100 - cardsScale * 100, otherMakaoPlayerDTO.username, {
						color: HEX_COLORS_STRING.BLACK,
					})
					.setOrigin(0.5)
			);
	}
}
