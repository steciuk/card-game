import { PhaserCard } from 'src/app/logic/games/phaserComponents/phaserCard';
import { PhaserDeck } from 'src/app/logic/games/phaserComponents/phaserDeck';
import { BaseScene } from 'src/app/logic/games/scenes/baseScene';

export class PhaserClickableDeck extends PhaserDeck {
	private clickZone: Phaser.GameObjects.Zone;

	constructor(scene: BaseScene, x: number, y: number, rotation: number, height: number, deckWidth: number) {
		super(scene, x, y, rotation, height, deckWidth);
		this.clickZone = scene.add.zone(0, 0, 130, 200); //TODO: cards size - magic numbers!
		this.clickZone.setInteractive();
		this.addToAdditionalContainer(this.clickZone);
	}

	override addCards(
		cardIds: string | string[],
		randomizeCardsRotation?: boolean,
		numberOfCards?: number
	): PhaserClickableDeck {
		super.addCards(cardIds, randomizeCardsRotation, numberOfCards);
		return this;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addEvent(eventName: string, callback: (...args: any[]) => void): PhaserClickableDeck {
		this.clickZone.on(eventName, callback);
		return this;
	}

	enable(enable: boolean): PhaserClickableDeck {
		if (enable) this.clickZone.setInteractive();
		else this.clickZone.disableInteractive();

		const lastCard = this.cardsContainer.last;
		if (lastCard) (lastCard as PhaserCard).setGlow(enable);

		return this;
	}
}
