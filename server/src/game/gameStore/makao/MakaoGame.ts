import { chooseRandomArrayElement, shuffleArray } from '../../../utils/Tools';
import { GameTypes } from '../../GameTypes';
import { Card, CardId, Colors } from '../deck/Card';
import { Deck, DECK_TYPE } from '../deck/Deck';
import { Game } from '../Game';
import {
	MakaoPlayer,
	OtherMakaoPlayerDTO,
	ThisMakaoPlayerDTO
} from './MakaoPlayer';

enum AttackType {
	TWO_THREE,
	FOUR,
	JACK,
	KING,
}

export class MakaoGame extends Game {
	static nonFunctionalCards: CardId[] = ['5', '6', '7', '8', '9', 'T']
		.flatMap((shape) => Colors.map((color) => (shape + color) as CardId))
		.concat(['KC', 'KD']);

	protected playersInGame = new Map<string, MakaoPlayer>();
	private readonly deck = new Deck(DECK_TYPE.FULL);
	private readonly discarded = new Deck(DECK_TYPE.FULL);
	playersInOrder: MakaoPlayer[];
	private currentPlayerNumber = 0;

	isCardPlayedThisTurn = false;
	isCardTakenThisTurn = false;
	attack: AttackType | null = null;
	attackCount = 0;

	constructor(
		gameType: GameTypes,
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
		this.attackCount = 0;
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

	removePlayer(player: MakaoPlayer): void {
		super.removePlayer(player);

		if (this.isStarted) {
			this.deck.add(player.deck.getInDeck());
			const disconnectedPlayerIndex = this.playersInOrder.findIndex((makaoPlayer) => {
				return makaoPlayer.id === player.id;
			});
			this.playersInOrder.splice(disconnectedPlayerIndex, 1);
			if (disconnectedPlayerIndex === this.currentPlayerNumber) this.finishTurn();
		}
	}

	get currentPlayer(): MakaoPlayer {
		return this.playersInOrder[this.currentPlayerNumber];
	}

	finishTurn(): void {
		if (!this.isCardPlayedThisTurn && this.attack === AttackType.FOUR) {
			this.attack = null;
			this.currentPlayer.numTurnsToWait = this.attackCount - 1;
			this.attackCount = 0;
		}

		if (this.currentPlayerNumber >= this.numPlayersInGame - 1) this.currentPlayerNumber = 0;
		else this.currentPlayerNumber++;

		const currentPlayer = this.currentPlayer;
		if (currentPlayer.numTurnsToWait > 0) {
			currentPlayer.numTurnsToWait--;
			this.finishTurn();
		}

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

		// if (this.attack === AttackType.JACK) {
		// 	return playerDeck.filter((cardId) => Card.isShape(cardId, 'J'));
		// }

		return result;
	}

	get numCardsInDeck(): number {
		return this.deck.getInDeck().length;
	}

	get topCard(): CardId {
		return this.discarded.getLastInDeck();
	}

	playCard(cardId: CardId): void {
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
		}
		// else if (Card.isShape(cardId, 'J')) {
		// 	this.attack = AttackType.JACK;
		// }
		else if (this.attack === AttackType.KING && (cardId === 'KC' || cardId === 'KD')) {
			this.attack = null;
			this.attackCount = 0;
		}

		this.discarded.add(cardId);
		this.isCardPlayedThisTurn = true;
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

		if (this.attack === AttackType.TWO_THREE) {
			console.log('cardId');
			return playerDeck.filter((cardId) => {
				console.log(cardId);
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

		// if (this.attack === AttackType.JACK) {
		// 	return playerDeck.filter((cardId) => Card.isShape(cardId, 'J'));
		// }

		return playerDeck.filter(
			(cardId) => Card.isShapeSameAs(cardId, topCardId) || Card.isColorSameAs(cardId, topCardId)
		);
	}

	canPlayerPlayCard(player: MakaoPlayer, cardId: CardId): boolean {
		return this.cardsPlayerCanPlay(player).indexOf(cardId) >= 0;
	}

	canPlayerFinishTurn(player: MakaoPlayer): boolean {
		console.log(this.attack);
		console.log(player.username);
		console.log(this.isCardPlayedThisTurn, this.isCardTakenThisTurn);
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
			makaoGame.playersInOrder.map((makaoPlayer: MakaoPlayer) =>
				OtherMakaoPlayerDTO.fromMakaoPlayer(makaoPlayer)
			),
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
