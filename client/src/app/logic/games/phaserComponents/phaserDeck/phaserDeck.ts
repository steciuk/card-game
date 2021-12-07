import { Actions, GameObjects, Geom } from 'phaser';

import { BaseScene } from '../../scenes/baseScene';
import { PhaserCard } from './phaserCard';

export class PhaserDeck {
	private deck: GameObjects.Container;
	private cards: PhaserCard[] = [];
	protected cardsLine: Geom.Line;

	constructor(
		private scene: BaseScene,
		x: number,
		y: number,
		rotation: number,
		cardsScale: number,
		deckWidth: number,
		cardIds: string | string[],
		numberOfCards = 1
	) {
		this.deck = scene.add.container(x, y).setRotation(rotation);
		this.cardsLine = new Geom.Line(-deckWidth / 2, 0, deckWidth / 2, 0);
		let cardIdsToDraw: string[] = [];

		Array.isArray(cardIds)
			? (cardIdsToDraw = cardIds)
			: (cardIdsToDraw = Array(numberOfCards).fill(cardIds));

		cardIdsToDraw.forEach((cardId) => this.deck.add(new PhaserCard(scene, 0, 0, cardId, cardsScale)));
		this.alignCards();
	}

	//FIXME: temporary
	destroyCard(): void {
		this.deck.getAt(0)?.destroy();
	}

	alignCards(): void {
		Actions.PlaceOnLine(this.deck.getAll(), this.cardsLine);
	}

	getAllCards(): PhaserCard[] {
		return this.deck.getAll() as PhaserCard[];
	}

	bringCardToTop(card: PhaserCard): void {
		this.scene.children.bringToTop(this.deck);
		this.deck.bringToTop(card);
	}
}

export type CardPlayedDTO = {
	played: boolean;
	playerId?: string;
	message: string;
};
