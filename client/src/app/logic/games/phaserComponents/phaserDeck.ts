import { PhaserCard } from 'src/app/logic/games/phaserComponents/phaserCard';
import { BaseScene } from 'src/app/logic/games/scenes/baseScene';

export class PhaserDeck {
	protected cardsContainer: Phaser.GameObjects.Container;
	private additionalContainer: Phaser.GameObjects.Container;
	protected cardsLine: Phaser.Geom.Line;

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
		this.cardsLine = new Phaser.Geom.Line(-deckWidth / 2, 0, deckWidth / 2, 0);
	}

	destroyNumLastCards(num: number): void {
		for (let i = 0; i < num; i++) {
			const card = this.cardsContainer.last;
			if (card) card.destroy();
		}
		this.alignCards();
	}

	destroyAllButNumLastCards(num: number): void {
		const numAllCards = this.getAllCards().length;
		for (let i = 0; i < numAllCards - num; i++) {
			const card = this.cardsContainer.first;
			if (card) card.destroy();
		}
		this.alignCards();
	}

	addCards(cardIds: string | string[], randomizeCardsRotation = false, numberOfCards = 1): PhaserDeck {
		let cardIdsToDraw: string[] = [];
		Array.isArray(cardIds)
			? (cardIdsToDraw = cardIds)
			: (cardIdsToDraw = Array(numberOfCards).fill(cardIds));

		cardIdsToDraw.forEach((cardId) => {
			const card = new PhaserCard(this.scene, 0, 0, cardId, this.height);
			if (randomizeCardsRotation) card.randomizeAngle();
			this.addCard(card);
		});

		this.alignCards();
		return this;
	}

	protected addCard(card: PhaserCard): void {
		this.cardsContainer.add(card);
	}

	alignCards(): void {
		Phaser.Actions.PlaceOnLine(this.cardsContainer.getAll(), this.cardsLine);
	}

	protected getAllCards(): PhaserCard[] {
		return this.cardsContainer.getAll() as PhaserCard[];
	}

	addToAdditionalContainer(gameObject: Phaser.GameObjects.GameObject): PhaserDeck {
		this.additionalContainer.add(gameObject);
		return this;
	}

	destroy(): void {
		this.cardsContainer.destroy();
		this.additionalContainer.destroy();
	}
}
