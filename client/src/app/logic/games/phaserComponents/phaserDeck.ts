import { Actions, GameObjects, Geom, Scene } from 'phaser';

export class PhaserDeck {
	private deck: GameObjects.Container;

	constructor(
		scene: Scene,
		x: number,
		y: number,
		rotation: number,
		cardsScale: number,
		deckWidth: number,
		cardIds: string | string[],
		numberOfCards = 1
	) {
		this.deck = scene.add.container(x, y).setRotation(rotation);
		let cardsToDraw: string[] = [];

		Array.isArray(cardIds) ? (cardsToDraw = cardIds) : (cardsToDraw = Array(numberOfCards).fill(cardIds));

		cardsToDraw.forEach((card, i) => this.deck.add(scene.add.sprite(0, 0, card).setScale(cardsScale)));

		const line = new Geom.Line(-deckWidth / 2, 0, deckWidth / 2, 0);
		Actions.PlaceOnLine(this.deck.getAll(), line);
	}
}
