export const Shapes = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'] as const;
export const Colors = ['C', 'D', 'H', 'S'] as const;

export type Shape = typeof Shapes[number];
export type Color = typeof Colors[number];

export abstract class Card {
	// static isCardIdValid(cardId: unknown): cardId is CardId {
	// 	return typeof cardId === 'string' &&
	// 		cardId.length === 2 &&
	// 		Shapes.includes(cardId.charAt(0) as Shape) &&
	// 		Colors.includes(cardId.charAt(1) as Color)
	// }

	static isColorSameAs(card1: CardId, card2: CardId): boolean {
		return card1[1] === card2[1];
	}

	static isShapeSameAs(card1: CardId, card2: CardId): boolean {
		return card1[0] === card2[0];
	}

	static isShapeGreaterThan(card1: CardId, card2: CardId): boolean {
		return Shapes.indexOf(card1[0] as Shape) > Shapes.indexOf(card2[0] as Shape);
	}

	static isShapeGreaterOrSameAs(card1: CardId, card2: CardId): boolean {
		return this.isShapeSameAs(card1, card2) || this.isShapeGreaterThan(card1, card2);
	}

	static isColor(card: CardId, color: Color): boolean {
		return card[1] === color;
	}

	static isShape(card: CardId, shape: Shape): boolean {
		return card[0] === shape;
	}
}

export type CardId = `${typeof Shapes[number]}${typeof Colors[number]}`;
