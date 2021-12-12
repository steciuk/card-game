import { GameObjects } from 'phaser';

import { BaseScene } from '../../scenes/baseScene';
import { PhaserDeck } from './phaserDeck';

export class PhaserClickableDeck extends PhaserDeck {
	private clickZone: GameObjects.Zone;

	constructor(scene: BaseScene, x: number, y: number, rotation: number, height: number, deckWidth: number) {
		super(scene, x, y, rotation, height, deckWidth);
		this.clickZone = scene.add.zone(0, 0, 130, 200); //TODO: cards size - magic numbers!
		this.clickZone.setInteractive();
		this.addToAdditionalContainer(this.clickZone);
	}

	addCards(
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

		return this;
	}
}
