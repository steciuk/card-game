import { BaseScene } from '../../scenes/baseScene';
import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketEvents';
import { HEX_COLORS_NUMBER } from '../HexColors';
import { CardPlayedDTO, PhaserDeck } from './phaserDeck';

export class PhaserInterActiveDeck extends PhaserDeck {
	constructor(
		scene: BaseScene,
		x: number,
		y: number,
		rotation: number,
		cardsScale: number,
		deckWidth: number,
		cardIds: string | string[],
		numberOfCards = 1
	) {
		super(scene, x, y, rotation, cardsScale, deckWidth, cardIds, numberOfCards);

		this.getAllCards().forEach((card) => {
			card.setInteractive({ draggable: true });
			scene.input.setDraggable(card);

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
					scene.socketService.emitSocketEvent(
						SOCKET_GAME_EVENTS.CARD_PLAYED,
						card.texture.key,
						(response: CardPlayedDTO) => {
							if (response.played) {
								card.destroy();
								this.alignCards();
								//FIXME: Temporary. Create way to update game state with animations
								scene.add
									.sprite(scene.xRelative(0.5), scene.yRelative(0.5), response.message)
									.setScale(cardsScale);
							}
						}
					);
				}
			});
		});
	}
}
