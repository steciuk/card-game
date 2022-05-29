import { PhaserCard } from 'src/app/logic/games/phaserComponents/phaserCard';
import { PhaserDeck } from 'src/app/logic/games/phaserComponents/phaserDeck';
import { BaseScene } from 'src/app/logic/games/scenes/baseScene';

export class PhaserClickableDeck extends PhaserDeck {
	private clickZone: Phaser.GameObjects.Zone;

	constructor(scene: BaseScene, x: number, y: number, rotation: number, height: number, deckWidth: number) {
		super(scene, x, y, rotation, height, deckWidth);
		this.clickZone = scene.add.zone(0, 0, height * (130 / 200), height); //TODO: cards size - magic numbers!
		this.clickZone.setInteractive();
		this.addToAdditionalContainer(this.clickZone);
		this.cardsContainer.setDepth(1);
		this.additionalContainer.setDepth(1);
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
	onPointerUp(callback: (...args: any[]) => void): PhaserClickableDeck {
		this.clickZone.on('pointerup', callback);
		return this;
	}

	setEnable(enable: boolean): PhaserClickableDeck {
		if (enable) this.clickZone.setInteractive();
		else this.clickZone.disableInteractive();

		const lastCard = this.cardsContainer.last;
		if (lastCard) (lastCard as PhaserCard).setGlow(enable);

		return this;
	}
}
