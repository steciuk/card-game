import { GameStateService } from 'src/app/services/game-state.service';
import { SocketService } from 'src/app/services/socket.service';

import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../gamesSetup';

export class MakaoScene extends BaseScene {
	constructor(socketService: SocketService, gameStateService: GameStateService) {
		super(socketService, gameStateService, { key: SCENE_KEYS.MAKAO });
	}

	init(): void {}

	preload(): void {
		// this.loadAllPlayingCards();
	}

	create(): void {
		this.add.text(0, 0, 'Makao');
	}

	update(): void {}
}
