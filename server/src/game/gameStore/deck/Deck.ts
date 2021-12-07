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

	isCardValidForDeck(cardId: CardId): boolean {
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

	pop(cardId: CardId): CardId | null {
		const index = this.inDeck.indexOf(cardId);
		if (index < 0) return null;
		this.inDeck.splice(index, 1);
		return cardId;
	}

	getNumOfCardsInDeck(): number {
		return this.inDeck.length;
	}

	getInDeck(): CardId[] {
		return this.inDeck;
	}

	popNumRandomCardsAndRefillDeckIfNotEnough(num: number, discarded?: Deck): CardId[] {
		let cards: CardId[] = [];
		if (num <= this.inDeck.length) {
			for (let i = 0; i < num; i++) {
				const card = chooseRandomArrayElement(this.inDeck);
				cards.push(this.pop(card) as CardId);
			}
		} else if (discarded) {
			const missing = num - this.inDeck.length;
			cards = [...this.inDeck];
			this.inDeck = [...discarded.inDeck];
			discarded.empty();
			cards.push(...this.popNumRandomCardsAndRefillDeckIfNotEnough(missing));
		} else {
			cards = [...this.inDeck];
			this.empty();
		}

		return cards;
	}
}

export class DECK_TYPE {
	static readonly FULL = new DECK_TYPE([...Shapes], [...Colors]);
	static readonly SMALL = new DECK_TYPE([...Shapes.slice(7)], [...Colors]);

	private constructor(public shapes: Shape[], public readonly colors: Color[]) {}
}
