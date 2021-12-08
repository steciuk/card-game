import { BaseScene } from '../../scenes/baseScene';
import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketEvents';
import { HEX_COLORS_NUMBER } from '../HexColors';
import { PhaserCard } from './phaserCard';
import { PhaserDeck } from './phaserDeck';

export class PhaserInterActiveDeck extends PhaserDeck {
	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		rotation: number,
		cardsScale: number,
		deckWidth: number
	) {
		super(scene, x, y, rotation, cardsScale, deckWidth);
	}

	protected addCard(card: PhaserCard): void {
		super.addCard(card);

		card.setInteractive({ draggable: true });
		this.scene.input.setDraggable(card);

		card.on('drag', (_pointer: unknown, dragX: number, dragY: number) => {
			(card.x = dragX), (card.y = dragY);
		});

		card.on('dragstart', () => {
			card.setTint(HEX_COLORS_NUMBER.YELLOW);
			this.bringCardToTop(card);
		});

		card.on('dragend', (_pointer: unknown, _dragX: number, _dragY: number, dropped: boolean) => {
			card.setTint();
			if (!dropped) {
				card.x = card.input.dragStartX;
				card.y = card.input.dragStartY;
			} else {
				this.scene.socketService.emitSocketEvent(
					SOCKET_GAME_EVENTS.CARD_PLAYED,
					card.texture.key,
					(response: CardPlayedResponseDTO) => {
						if (response.played) {
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
}

export type CardPlayedResponseDTO = {
	played: boolean;
	message: string;
};
