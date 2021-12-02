import { SocketService } from 'src/app/services/socket.service';

import { SOCKET_GAME_EVENTS } from '../../socketEvents/socketEvents';
import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../gamesSetup';

export class MakaoScene extends BaseScene {
	constructor(socketService: SocketService) {
		super(socketService, { key: SCENE_KEYS.MAKAO });
		this.registerListeners();
	}

	init(): void {}

	preload(): void {
		// this.loadAllPlayingCards();
	}

	create(): void {
		this.add.text(0, 0, 'Makao');
	}

	update(): void {}

	registerListeners(): void {
		this.registerSocketListenerForScene(
			SOCKET_GAME_EVENTS.START_GAME,
			(cards: string[], playersInOrderIds: string[]) => {
				console.log(cards);
				console.log(playersInOrderIds);
				this.nextScene();
			}
		);
	}
}
