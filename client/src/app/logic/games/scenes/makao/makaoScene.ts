import { SocketService } from 'src/app/services/socket.service';

import { HEX_COLORS_STRING } from '../../phaserComponents/HexColors';
import { PhaserButton } from '../../phaserComponents/phaserButton';
import { PhaserCard } from '../../phaserComponents/phaserCard';
import { PhaserClickableDeck } from '../../phaserComponents/phaserClickableDeck';
import { PhaserDeck } from '../../phaserComponents/phaserDeck';
import { PhaserDropZone } from '../../phaserComponents/phaserDropZone';
import { PhaserInfoZone } from '../../phaserComponents/phaserInfoZone';
import { PhaserPlayableDeck } from '../../phaserComponents/phaserPlayableDeck';
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
	INFO_ZONE_PERCENTAGE_OF_SCREEN: 0.1,
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
	cardsToTakeInfoZone!: PhaserInfoZone;
	requestsInfoZone!: PhaserInfoZone;

	isSceneStarted = false;

	constructor(socketService: SocketService) {
		super(socketService, { key: SCENE_KEYS.MAKAO });
		this.registerListeners();
	}

	init(): void {
		this.isSceneStarted = true;
		this.playersIdsInOrder = [];
		this.shiftedPlayersIdsInOrder = [];
		this.players = new Map<string, OtherMakaoPlayer>();
		this.numberOfPlayers = 0;
		this.midPoint = { x: this.xRelative(0.5), y: this.smallerScreenDimension / 2 };
	}

	preload(): void {
		this.loadAllPlayingCards();
		this.loadBacks();
		this.loadTurnArrow();
	}

	create(): void {
		new PhaserDropZone(
			this,
			this.midPoint.x,
			this.midPoint.y,
			this.smallerScreenDimension * SCENE_CONFIG.DROP_ZONE_PERCENTAGE_OF_SCREEN,
			this.smallerScreenDimension * SCENE_CONFIG.DROP_ZONE_PERCENTAGE_OF_SCREEN
		);

		this.cardsToTakeInfoZone = new PhaserInfoZone(
			this,
			this.midPoint.x + (this.smallerScreenDimension * SCENE_CONFIG.DROP_ZONE_PERCENTAGE_OF_SCREEN) / 2,
			this.midPoint.y - (this.smallerScreenDimension * SCENE_CONFIG.DROP_ZONE_PERCENTAGE_OF_SCREEN) / 2,
			this.smallerScreenDimension * SCENE_CONFIG.INFO_ZONE_PERCENTAGE_OF_SCREEN,
			'To take'
		);

		this.requestsInfoZone = new PhaserInfoZone(
			this,
			this.midPoint.x + (this.smallerScreenDimension * SCENE_CONFIG.DROP_ZONE_PERCENTAGE_OF_SCREEN) / 2,
			this.midPoint.y + (this.smallerScreenDimension * SCENE_CONFIG.DROP_ZONE_PERCENTAGE_OF_SCREEN) / 2,
			this.smallerScreenDimension * SCENE_CONFIG.INFO_ZONE_PERCENTAGE_OF_SCREEN,
			'Requested'
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
		);

		this.turnArrow = new PhaserTurnArrow(this, this.midPoint.x, this.midPoint.y, 0);

		this.finishTurnButton = new PhaserButton(
			this,
			this.xRelative(0.1),
			this.yRelative(0.75),
			'Finish turn',
			() => {
				this.socketService.emitSocketEvent(
					SOCKET_GAME_EVENTS.TURN_FINISHED,
					(turnFinishedResponseDTO: TurnFinishedResponseDTO | FailureResponseDTO) => {
						if (!turnFinishedResponseDTO.success)
							return console.warn(turnFinishedResponseDTO.error);
						this.updateTurnArrow(turnFinishedResponseDTO.playerId);
						this.updateTurnBasedInteractiveElements(turnFinishedResponseDTO.actions);
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
				(cardTakenResponseDTO: CardsTakenResponseDTO | FailureResponseDTO) => {
					if (!cardTakenResponseDTO.success) return console.warn(cardTakenResponseDTO.error);
					if (!cardTakenResponseDTO.deckRefilled)
						this.deck.destroyNumLastCards(cardTakenResponseDTO.cardIds.length);
					else {
						this.discarded.destroyAllButNumLastCards(1);
						this.deck.destroyAllButNumLastCards(0);
						this.deck.addCards('RB', true, cardTakenResponseDTO.numCardsInRefilled);
					}

					this.thisPlayer.deck.addCards(cardTakenResponseDTO.cardIds);
					this.updateTurnBasedInteractiveElements(cardTakenResponseDTO.actions);
					this.setAttacksStateInfo(cardTakenResponseDTO);
				}
			);
		});
	}

	update(): void {}

	private registerListeners(): void {
		this.registerSocketListenerForScene(SOCKET_GAME_EVENTS.PLAYER_DISCONNECTED, () => {
			if (this.isSceneStarted) this.scene.restart();
		});

		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.CARD_PLAYED,
			(cardPlayedDTO: CardPlayedDTO) => {
				this.players.get(cardPlayedDTO.playerId)?.deck.destroyNumLastCards(1);
				this.discarded.addCards(cardPlayedDTO.cardId, true);
				this.setAttacksStateInfo(cardPlayedDTO);
			}
		);

		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.CARDS_TAKEN,
			(cardsTakenDTO: CardsTakenDTO) => {
				this.players.get(cardsTakenDTO.playerId)?.deck.addCards('RB', false, cardsTakenDTO.numCards);
				this.setAttacksStateInfo(cardsTakenDTO);

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

		this.registerSocketListenerForScene(SOCKET_GAME_EVENTS.GAME_FINISHED, () => {
			this.nextScene();
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

		this.updateTurnBasedInteractiveElements(makaoGameStateForPlayer.thisPlayerActions);
		this.updateTurnArrow(makaoGameStateForPlayer.currentPlayerId);
		this.setAttacksStateInfo(makaoGameStateForPlayer);
	}

	private updateTurnArrow(playerId: string): void {
		this.turnArrow.updateRotation(this.getPlayer(playerId).rotation);
	}

	updateTurnBasedInteractiveElements(actionsDto: ActionsDTO | null): void {
		this.finishTurnButton.enable(!!actionsDto?.canPlayerFinishTurn);
		this.deck.enable(!!actionsDto?.canPlayerTakeCard);

		if (!actionsDto) this.thisPlayer.deck.enableOnlyGivenCards([]);
		else this.thisPlayer.deck.enableOnlyGivenCards(actionsDto.cardsPlayerCanPlay);
	}

	private getPlayer(playerId: string): MakaoPlayer {
		return playerId === this.thisPlayer.id
			? this.thisPlayer
			: (this.players.get(playerId) as MakaoPlayer);
	}

	setAttacksStateInfo(attacksState: AttacksStateDTO): void {
		this.cardsToTakeInfoZone.setInfo(attacksState.numCardsToTake);
		const requestedShape = attacksState.requests[this.thisPlayer.id];
		if (requestedShape) this.requestsInfoZone.setInfo(requestedShape);
		else this.requestsInfoZone.setInfo();
	}

	chooseCard = (playedCard: PhaserCard, playedDeck: PhaserPlayableDeck, cards: string[]): void => {
		this.updateTurnBasedInteractiveElements(null);
		new PhaserPlayableDeck(
			this,
			this.midPoint.x,
			this.midPoint.y,
			0,
			SCENE_CONFIG.BASE_CARD_HEIGHT,
			this.yRelative(0.5)
		)
			.registerCardEvent('pointerup', (chosenCard, deck) => {
				return (): void => {
					this.socketService.emitSocketEvent(
						SOCKET_GAME_EVENTS.CARD_WITH_OPTION_PLAYED,
						playedCard.cardId,
						chosenCard.cardId,
						(response: CardPlayedResponseDTO | FailureResponseDTO) => {
							if (response.success) {
								playedCard.destroy();
								playedDeck.alignCards();
								this.discarded.addCards(response.cardId, true);
								this.updateTurnBasedInteractiveElements(response.actions);
								this.setAttacksStateInfo(response);
							} else {
								playedCard.x = playedCard.input.dragStartX;
								playedCard.y = playedCard.input.dragStartY;
								console.warn(response.error);
							}

							deck.destroy();
						}
					);
				};
			})
			.addCards(cards);
	};
}

type SuccessResponseDTO = {
	success: true;
};

type FailureResponseDTO = {
	success: false;
	error: string;
};

type AttacksStateDTO = {
	requests: { [key: string]: string | null };
	numCardsToTake: number;
};

type TurnFinishedResponseDTO = SuccessResponseDTO & {
	playerId: string;
	actions: ActionsDTO | null;
};

type CardPlayedResponseDTO = SuccessResponseDTO &
	AttacksStateDTO & {
		actions: ActionsDTO | null;
		cardId: string;
	};

type CardsTakenResponseDTO = SuccessResponseDTO &
	AttacksStateDTO & {
		cardIds: string[];
		deckRefilled: boolean;
		numCardsInRefilled: number;
		actions: ActionsDTO | null;
	};

type TurnFinishedDTO = {
	playerId: string;
};

type CardPlayedDTO = AttacksStateDTO & {
	playerId: string;
	cardId: string;
};

type CardsTakenDTO = AttacksStateDTO & {
	playerId: string;
	numCards: number;
	deckRefilled: boolean;
	numCardsInRefilled: number;
};

type ActionsDTO = {
	canPlayerTakeCard: boolean;
	cardsPlayerCanPlay: string[];
	canPlayerFinishTurn: boolean;
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

type InitialMakaoGameStateForPlayerDTO = AttacksStateDTO & {
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
		scene: MakaoScene,
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
		this.deck
			.registerCardEvent('drag', (card, _deck) => {
				return (_pointer: unknown, dragX: number, dragY: number): void => {
					(card.x = dragX), (card.y = dragY);
				};
			})
			.registerCardEvent('dragend', (card, deck) => {
				return (_pointer: unknown, _dragX: number, _dragY: number, dropped: boolean): void => {
					if (!dropped) {
						card.x = card.input.dragStartX;
						card.y = card.input.dragStartY;
					} else {
						if (card.cardId[0] === 'A')
							return scene.chooseCard(card, deck, ['AS', 'AH', 'AD', 'AC']);
						if (card.cardId[0] === 'J')
							return scene.chooseCard(card, deck, ['5H', '6H', '7H', '8H', '9H', 'TH']);

						scene.socketService.emitSocketEvent(
							SOCKET_GAME_EVENTS.CARD_PLAYED,
							card.cardId,
							(response: CardPlayedResponseDTO | FailureResponseDTO) => {
								if (response.success) {
									card.destroy();
									deck.alignCards();
									scene.discarded.addCards(response.cardId, true);
									scene.updateTurnBasedInteractiveElements(response.actions);
									scene.setAttacksStateInfo(response);
								} else {
									card.x = card.input.dragStartX;
									card.y = card.input.dragStartY;
									console.warn(response.error);
								}
							}
						);
					}
				};
			})
			.addCards(thisMakaoPlayerDTO.cardIds)
			.enableOnlyGivenCards([]);
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
					.text(0, -100 - cardsScale / 10, otherMakaoPlayerDTO.username, {
						color: HEX_COLORS_STRING.BLACK,
					})
					.setOrigin(0.5)
			);
	}
}
