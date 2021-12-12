import { chooseRandomArrayElement } from '../../../utils/Tools';
import { CardId, Color, Colors, Shape, Shapes } from './Card';

// const cards = shapes.flatMap((shape) => colors.map((color) => shape + color)) as Card[];

export class Deck {
	private validShapes: Shape[];
	private validColors: Color[];
	private inDeck: CardId[] = [];

	constructor(deckType: DECK_TYPE, private numOfDecks = 1) {
		this.validShapes = deckType.shapes;
		this.validColors = deckType.colors;
	}

	private isCardValidForDeck(cardId: CardId): boolean {
		return this.validShapes.includes(cardId[0] as Shape) && this.validColors.includes(cardId[1] as Color);
	}

	full(): void {
		this.inDeck = [];
		const cards = this.validShapes.flatMap((shape) =>
			this.validColors.map((color) => (shape + color) as CardId)
		);
		for (let i = 0; i < this.numOfDecks; i++) this.inDeck.push(...cards);
	}

	empty(): void {
		this.inDeck = [];
	}

	add(toAdd: CardId | CardId[]): void {
		if (Array.isArray(toAdd)) {
			if (toAdd.every((card) => this.isCardValidForDeck(card))) this.inDeck.push(...toAdd);
			else throw new Error('Card not valid for deck');
		} else {
			if (this.isCardValidForDeck(toAdd)) this.inDeck.push(toAdd);
			else throw new Error('Card not valid for deck');
		}
	}

	hasCard(cardId: CardId): boolean {
		return this.inDeck.indexOf(cardId) >= 0;
	}

	remove(cardId: CardId): void {
		this.inDeck.splice(this.inDeck.indexOf(cardId), 1);
	}

	getNumOfCardsInDeck(): number {
		return this.inDeck.length;
	}

	getInDeck(): CardId[] {
		return this.inDeck;
	}

	getLastInDeck(): CardId {
		return this.inDeck[this.inDeck.length - 1];
	}

	popNumRandomCardsAndRefillDeckIfNotEnough(
		num: number,
		discarded?: Deck
	): { cardIds: CardId[]; refilled: boolean } {
		let refilled = false;
		let cardIds: CardId[] = [];
		if (num < this.inDeck.length) {
			for (let i = 0; i < num; i++) {
				const card = chooseRandomArrayElement(this.inDeck);
				this.remove(card);
				cardIds.push(card);
			}
		} else if (discarded) {
			refilled = true;
			const missing = num - this.inDeck.length;
			cardIds = [...this.inDeck];
			this.inDeck = [...discarded.inDeck.splice(0, discarded.inDeck.length - 1)];
			cardIds.push(...this.popNumRandomCardsAndRefillDeckIfNotEnough(missing).cardIds);
		} else {
			cardIds = [...this.inDeck];
			this.empty();
		}

		return { cardIds: cardIds, refilled: refilled };
	}
}

export class DECK_TYPE {
	static readonly FULL = new DECK_TYPE([...Shapes], [...Colors]);
	static readonly SMALL = new DECK_TYPE([...Shapes.slice(7)], [...Colors]);

	private constructor(public shapes: Shape[], public readonly colors: Color[]) {}
}
