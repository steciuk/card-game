import { PhaserCard } from 'src/app/logic/games/phaserComponents/phaserCard';
import { PhaserDeck } from 'src/app/logic/games/phaserComponents/phaserDeck';
import { BaseScene } from 'src/app/logic/games/scenes/baseScene';

export class PhaserPlayableDeck extends PhaserDeck {
	events = new Map<string, CardEventCallback>();

	constructor(scene: BaseScene, x: number, y: number, rotation: number, height: number, deckWidth: number) {
		super(scene, x, y, rotation, height, deckWidth);
	}

	override addCards(
		cardIds: string | string[],
		randomizeCardsRotation?: boolean,
		numberOfCards?: number
	): PhaserPlayableDeck {
		super.addCards(cardIds, randomizeCardsRotation, numberOfCards);
		return this;
	}

	registerCardEvent(eventName: string, callback: CardEventCallback): PhaserPlayableDeck {
		this.events.set(eventName, callback);
		return this;
	}

	protected override addCard(card: PhaserCard): void {
		super.addCard(card);

		card.setInteractive({ draggable: true });
		this.scene.input.setDraggable(card);

		this.events.forEach((callback, eventName) => {
			card.on(eventName, callback(card, this));
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

	override destroy(): void {
		super.destroy();
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CardEventCallback = (card: PhaserCard, deck: PhaserPlayableDeck) => (...args: any[]) => void;
