import { GameObjects, Scene } from 'phaser';

export class PhaserDeck {
	private deck: GameObjects.Container;

	constructor(
		scene: Scene,
		x: number,
		y: number,
		rotation: number,
		cardsScale: number,
		deckWidth: number,
		cards: string | string[],
		numberOfCards = 1
	) {
		this.deck = scene.add.container(x, y).setRotation(rotation);
		if (Array.isArray(cards)) {
			cards.forEach((card, i) => this.deck.add(scene.add.sprite(i * 80, 0, card).setScale(cardsScale)));
		} else {
			for (let i = 0; i < numberOfCards; i++) {
				this.deck.add(scene.add.sprite(i * 80, 0, cards).setScale(cardsScale));
			}
		}
	}
}
