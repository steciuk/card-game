import { chooseRandomArrayElement, shuffleArray } from '../../../utils/Tools';
import { GAME_TYPE } from '../../GameTypes';
import { Card, CardId, Colors } from '../deck/Card';
import { Deck, DECK_TYPE } from '../deck/Deck';
import { Game, GAME_STATE } from '../Game';
import {
	MakaoPlayer,
	OtherMakaoPlayerDTO,
	ThisMakaoPlayerDTO
} from './MakaoPlayer';

enum AttackType {
	TWO_THREE,
	FOUR,
	KING,
}

export class MakaoGame extends Game {
	static nonFunctionalShapes = ['5', '6', '7', '8', '9', 'T'];
	static nonFunctionalCards: CardId[] = MakaoGame.nonFunctionalShapes
		.flatMap((shape) => Colors.map((color) => (shape + color) as CardId))
		.concat(['KC', 'KD']);

	static requestableCards: CardId[] = MakaoGame.nonFunctionalShapes.map((shape) => (shape + 'H') as CardId);

	protected playersInGame = new Map<string, MakaoPlayer>();
	private readonly deck = new Deck(DECK_TYPE.FULL);
	private readonly discarded = new Deck(DECK_TYPE.FULL);
	playersInOrder: MakaoPlayer[] = [];
	private currentPlayerNumber = 0;

	isCardPlayedThisTurn = false;
	isCardTakenThisTurn = false;
	attack: AttackType | null = null;
	attackCount = 0;
	changedCard: CardId | null = null;

	constructor(
		gameType: GAME_TYPE,
		owner: { id: string; username: string },
		maxPlayers: number,
		roomName: string,
		isPasswordProtected: boolean,
		created: number,
		id: string,
		password?: string
	) {
		super(gameType, owner, maxPlayers, roomName, isPasswordProtected, created, id, password);
	}

	start(): void {
		super.start();
		this.playersInOrder = shuffleArray(Array.from(this.playersInGame.values()));

		this.currentPlayerNumber = 0;
		this.isCardPlayedThisTurn = false;
		this.isCardTakenThisTurn = false;
		this.attack = null;
		this.attackCount = 0; // number of cards to take or number of turns to wait
		this.changedCard = null;
		this.deck.full();
		this.discarded.empty();

		const startingCard = chooseRandomArrayElement(MakaoGame.nonFunctionalCards);
		this.deck.remove(startingCard);
		this.discarded.add(startingCard);

		this.playersInOrder.forEach((player) => {
			player.deck.empty();
			player.deck.add(this.deck.popNumRandomCardsAndRefillDeckIfNotEnough(5).cardIds);
		});
	}

	disconnectPlayer(player: MakaoPlayer): void {
		super.disconnectPlayer(player);

		if (this.gameState === GAME_STATE.STARTED) {
			if (this.numConnectedPlayersInGame <= 1) return this.finish();

			this.deck.add(player.deck.getInDeck());
			if (this.currentPlayer.id === player.id) this.finishTurn();
		}
	}

	get currentPlayer(): MakaoPlayer {
		return this.playersInOrder[this.currentPlayerNumber];
	}

	private nextPlayer(): void {
		if (this.currentPlayerNumber >= this.numPlayersInGame - 1) this.currentPlayerNumber = 0;
		else this.currentPlayerNumber++;
	}

	finishTurn(): void {
		if (!this.isCardPlayedThisTurn && this.attack === AttackType.FOUR) {
			this.attack = null;
			this.currentPlayer.numTurnsToWait += this.attackCount;
			this.attackCount = 0;
		}

		if (this.currentPlayer.numTurnsToWait > 0) this.currentPlayer.numTurnsToWait--;
		this.nextPlayer();

		while (!this.currentPlayer.isActive) return this.finishTurn();

		this.isCardPlayedThisTurn = false;
		this.isCardTakenThisTurn = false;
	}

	takeCard(player: MakaoPlayer): {
		cardIds: CardId[];
		refilled: boolean;
	} {
		if (this.attack === AttackType.TWO_THREE || this.attack === AttackType.KING) {
			this.attack = null;
			player.numCardsToTake = this.attackCount;
			this.attackCount = 0;
		}

		const result = this.deck.popNumRandomCardsAndRefillDeckIfNotEnough(1, this.discarded);
		if (player.numCardsToTake > 0) {
			player.numCardsToTake -= result.cardIds.length;
			if (player.numCardsToTake < 0) player.numCardsToTake = 0;
		}
		player.deck.add(result.cardIds);
		this.isCardTakenThisTurn = true;
		player.requestedCardToPlay = null;

		return result;
	}

	get numCardsInDeck(): number {
		return this.deck.getInDeck().length;
	}

	get topCard(): CardId {
		if (this.changedCard) return this.changedCard;
		return this.discarded.getLastInDeck();
	}

	playCard(cardId: CardId, chosenCardId?: CardId): CardId {
		let playedCard = cardId;
		if (Card.isShape(cardId, '2') || Card.isShape(cardId, '3')) {
			this.attack = AttackType.TWO_THREE;
			this.attackCount += parseInt(cardId[0]);
		} else if (Card.isShape(cardId, '4')) {
			this.attack = AttackType.FOUR;
			this.attackCount += 1;
		} else if (cardId === 'KH' || cardId === 'KS') {
			//TODO: KS should work backwards
			this.attack = AttackType.KING;
			this.attackCount += 5;
		} else if (this.attack === AttackType.KING && (cardId === 'KC' || cardId === 'KD')) {
			this.attack = null;
			this.attackCount = 0;
		}

		if (Card.isShape(cardId, 'A') && chosenCardId) {
			this.changedCard = chosenCardId;
			playedCard = chosenCardId;
		} else this.changedCard = null;

		if (Card.isShape(cardId, 'J') && chosenCardId) {
			this.playersInOrder
				.filter((player) => player.isActive)
				.forEach((player) => (player.requestedCardToPlay = chosenCardId));
		} else this.currentPlayer.requestedCardToPlay = null;

		this.discarded.add(cardId);
		this.isCardPlayedThisTurn = true;
		return playedCard;
	}

	private isPlayerTurn(playerId: string): boolean {
		return playerId === this.currentPlayer.id;
	}

	canPlayerTakeCard(player: MakaoPlayer): boolean {
		if (!this.isPlayerTurn(player.id)) return false;
		if (this.isCardPlayedThisTurn) return false;
		if (this.attack === AttackType.FOUR) return false;
		if (this.isCardTakenThisTurn && player.numCardsToTake <= 0) return false;
		if (this.deck.getNumOfCardsInDeck() <= 0 && this.discarded.getNumOfCardsInDeck() <= 1) return false; //TODO: end game if no more cards
		return true;
	}

	cardsPlayerCanPlay(player: MakaoPlayer): CardId[] {
		if (!this.isPlayerTurn(player.id)) return [];
		if (this.isCardTakenThisTurn) return [];

		const topCardId = this.topCard;
		const playerDeck = player.deck.getInDeck();

		if (this.isCardPlayedThisTurn) {
			return playerDeck.filter((cardId) => Card.isShapeSameAs(cardId, topCardId));
		}

		if (player.requestedCardToPlay) {
			return playerDeck.filter(
				(cardId) =>
					Card.isShapeSameAs(cardId, player.requestedCardToPlay as CardId) ||
					Card.isShape(cardId, 'J')
			);
		}

		if (this.attack === AttackType.TWO_THREE) {
			return playerDeck.filter((cardId) => {
				return (
					(Card.isShape(cardId, '2') || Card.isShape(cardId, '3')) &&
					(Card.isShapeSameAs(cardId, topCardId) || Card.isColorSameAs(cardId, topCardId))
				);
			});
		}

		if (this.attack === AttackType.FOUR) {
			return playerDeck.filter((cardId) => Card.isShape(cardId, '4'));
		}

		if (this.attack === AttackType.KING) {
			return playerDeck.filter((cardId) => Card.isShape(cardId, 'K'));
		}

		if (this.attack === null && Card.isShape(topCardId, 'Q')) {
			return playerDeck;
		}

		return playerDeck.filter(
			(cardId) =>
				Card.isShape(cardId, 'Q') ||
				Card.isShapeSameAs(cardId, topCardId) ||
				Card.isColorSameAs(cardId, topCardId)
		);
	}

	canPlayerPlayCard(player: MakaoPlayer, cardId: CardId): boolean {
		return this.cardsPlayerCanPlay(player).indexOf(cardId) >= 0;
	}

	canPlayerPlayCardWithOption(player: MakaoPlayer, playedCardId: CardId, chosenCardId: CardId): boolean {
		if (this.cardsPlayerCanPlay(player).indexOf(playedCardId) < 0) return false;
		if (Card.isShape(playedCardId, 'A')) return ['AS', 'AH', 'AD', 'AC'].includes(chosenCardId);
		if (Card.isShape(playedCardId, 'J'))
			return MakaoGame.nonFunctionalShapes.map((shape) => shape + 'H').includes(chosenCardId);

		return false;
	}

	canPlayerFinishTurn(player: MakaoPlayer): boolean {
		if (!this.isPlayerTurn(player.id)) return false;
		if (player.numCardsToTake > 0) return false;
		if (!this.isCardPlayedThisTurn && !this.isCardTakenThisTurn && this.attack !== AttackType.FOUR)
			return false;

		return true;
	}

	getActionsForPlayerDTO(player: MakaoPlayer): ActionsDTO {
		return {
			canPlayerTakeCard: this.canPlayerTakeCard(player),
			cardsPlayerCanPlay: this.cardsPlayerCanPlay(player),
			canPlayerFinishTurn: this.canPlayerFinishTurn(player),
		};
	}
}

export class InitialMakaoGameStateForPlayerDTO {
	private constructor(
		private thisMakaoPlayer: ThisMakaoPlayerDTO,
		private currentPlayerId: string,
		private makaoPlayersInOrder: OtherMakaoPlayerDTO[],
		private numberOfCardsInDeck: number,
		private startingCardId: CardId,
		private thisPlayerActions: ActionsDTO
	) {}

	static fromMakaoGameAndPlayer(
		makaoGame: MakaoGame,
		makaoPlayer: MakaoPlayer
	): InitialMakaoGameStateForPlayerDTO {
		return new InitialMakaoGameStateForPlayerDTO(
			ThisMakaoPlayerDTO.fromMakaoPlayer(makaoPlayer),
			makaoGame.currentPlayer.id,
			makaoGame.playersInOrder
				.filter((player) => !player.isDisconnected)
				.map((makaoPlayer: MakaoPlayer) => OtherMakaoPlayerDTO.fromMakaoPlayer(makaoPlayer)),
			makaoGame.numCardsInDeck,
			makaoGame.topCard,
			makaoGame.getActionsForPlayerDTO(makaoPlayer)
		);
	}
}

export type ActionsDTO = {
	canPlayerTakeCard: boolean;
	cardsPlayerCanPlay: CardId[];
	canPlayerFinishTurn: boolean;
};
