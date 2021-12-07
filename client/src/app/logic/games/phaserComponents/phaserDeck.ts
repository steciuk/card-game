import { Actions, GameObjects, Geom } from 'phaser';

import { BaseScene } from '../scenes/baseScene';
import { SOCKET_GAME_EVENTS } from '../socketEvents/socketEvents';
import { HEX_COLORS_NUMBER } from './HexColors';

export class PhaserDeck {
	private deck: GameObjects.Container;
	private cardsLine: Geom.Line;

	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		rotation: number,
		cardsScale: number,
		deckWidth: number,
		cardIds: string | string[],
		draggable: boolean,
		numberOfCards = 1
	) {
		this.deck = scene.add.container(x, y).setRotation(rotation);
		this.cardsLine = new Geom.Line(-deckWidth / 2, 0, deckWidth / 2, 0);
		let cardIdsToDraw: string[] = [];

		Array.isArray(cardIds)
			? (cardIdsToDraw = cardIds)
			: (cardIdsToDraw = Array(numberOfCards).fill(cardIds));

		cardIdsToDraw.forEach((card) => this.deck.add(scene.add.sprite(0, 0, card).setScale(cardsScale)));
		this.alignCards();

		if (draggable) {
			(this.deck.getAll() as GameObjects.Sprite[]).forEach((card) => {
				card.setInteractive({ draggable: true });
				scene.input.setDraggable(card);

				card.on('drag', (_pointer: unknown, dragX: number, dragY: number) => {
					(card.x = dragX), (card.y = dragY);
				});

				card.on('dragstart', () => {
					card.setTint(HEX_COLORS_NUMBER.YELLOW);
					this.deck.bringToTop(card);
				});

				card.on('dragend', (_pointer: unknown, _dragX: number, _dragY: number, dropped: boolean) => {
					card.setTint();
					if (!dropped) {
						card.x = card.input.dragStartX;
						card.y = card.input.dragStartY;
					} else {
						scene.socketService.emitSocketEvent(
							SOCKET_GAME_EVENTS.CARD_PLAYED,
							card.texture.key,
							(response: CardPlayedDTO) => {
								if (response.played) {
									card.destroy();
									this.alignCards();
								}
							}
						);
					}
				});
			});
		}
	}

	private alignCards(): void {
		Actions.PlaceOnLine(this.deck.getAll(), this.cardsLine);
	}
}

type CardPlayedDTO = {
	played: boolean;
	message?: string;
};
