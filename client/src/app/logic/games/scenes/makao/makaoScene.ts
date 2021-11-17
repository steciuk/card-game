import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../sceneKeys';

export class MakaoScene extends BaseScene {
	constructor() {
		super({ key: SCENE_KEYS.MAKAO });
	}

	init(): void {}

	preload(): void {
		this.loadAllPlayingCards();
	}

	create(): void {
		this.add.text(0, 0, 'Makao');
	}

	update(): void {}
}
