import { Actions, GameObjects, Geom } from 'phaser';

import { BaseScene } from '../../scenes/baseScene';
import { PhaserCard } from './phaserCard';

export class PhaserDeck {
	private cardsContainer: GameObjects.Container;
	private additionalContainer: GameObjects.Container;
	protected cardsLine: Geom.Line;

	constructor(
		protected scene: BaseScene,
		x: number,
		y: number,
		rotation: number,
		protected height: number,
		deckWidth: number
	) {
		this.cardsContainer = scene.add.container(x, y).setRotation(rotation);
		this.additionalContainer = scene.add.container(x, y).setRotation(rotation);
		this.cardsLine = new Geom.Line(-deckWidth / 2, 0, deckWidth / 2, 0);
	}

	//FIXME: temporary
	destroyCard(): void {
		this.cardsContainer.getAt(0)?.destroy();
	}

	addCards(cardIds: string | string[], randomizeCardRotation = false, numberOfCards = 1): void {
		let cardIdsToDraw: string[] = [];
		Array.isArray(cardIds)
			? (cardIdsToDraw = cardIds)
			: (cardIdsToDraw = Array(numberOfCards).fill(cardIds));

		cardIdsToDraw.forEach((cardId) => {
			const card = new PhaserCard(this.scene, 0, 0, cardId, this.height);
			if (randomizeCardRotation) card.randomizeAngle();
			this.addCard(card);
		});

		this.alignCards();
	}

	protected addCard(card: PhaserCard): void {
		this.cardsContainer.add(card);
	}

	alignCards(): void {
		Actions.PlaceOnLine(this.cardsContainer.getAll(), this.cardsLine);
	}

	getAllCards(): PhaserCard[] {
		return this.cardsContainer.getAll() as PhaserCard[];
	}

	bringCardToTop(card: PhaserCard): void {
		this.scene.children.bringToTop(this.cardsContainer);
		this.cardsContainer.bringToTop(card);
	}

	addToAdditionalContainer(gameObject: GameObjects.GameObject): void {
		this.additionalContainer.add(gameObject);
	}
}
