import { BaseScene } from '../../scenes/baseScene';
import { ResponseDTO } from '../../scenes/makao/makaoScene';
import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketEvents';
import { PhaserCard } from './phaserCard';
import { PhaserDeck } from './phaserDeck';

export class PhaserPlayableDeck extends PhaserDeck {
	constructor(scene: BaseScene, x: number, y: number, rotation: number, height: number, deckWidth: number) {
		super(scene, x, y, rotation, height, deckWidth);
	}

	addCards(
		cardIds: string | string[],
		randomizeCardsRotation?: boolean,
		numberOfCards?: number
	): PhaserPlayableDeck {
		super.addCards(cardIds, randomizeCardsRotation, numberOfCards);
		return this;
	}

	protected addCard(card: PhaserCard): void {
		super.addCard(card);

		card.setInteractive({ draggable: true });
		this.scene.input.setDraggable(card);

		card.on('drag', (_pointer: unknown, dragX: number, dragY: number) => {
			(card.x = dragX), (card.y = dragY);
		});

		card.on('dragend', (_pointer: unknown, _dragX: number, _dragY: number, dropped: boolean) => {
			if (!dropped) {
				card.x = card.input.dragStartX;
				card.y = card.input.dragStartY;
			} else {
				this.scene.socketService.emitSocketEvent(
					SOCKET_GAME_EVENTS.CARD_PLAYED,
					card.texture.key,
					(response: ResponseDTO) => {
						if (response.success) {
							card.destroy();
							this.alignCards();
						} else {
							card.x = card.input.dragStartX;
							card.y = card.input.dragStartY;
							console.warn(response.message);
						}
					}
				);
			}
		});
	}

	enableOnlyGivenCards(cardIds: string[]): PhaserPlayableDeck {
		this.getAllCards().forEach((card) => {
			if (cardIds.indexOf(card.cardId) >= 0) {
				card.setInteractive();
				card.setGlow(true);
			} else {
				card.disableInteractive();
				card.setGlow(false);
			}
		});

		return this;
	}
}
