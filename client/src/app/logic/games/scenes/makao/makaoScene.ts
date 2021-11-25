import { RoomStateService } from 'src/app/services/room-state.service';
import { SocketService } from 'src/app/services/socket.service';

import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../gamesSetup';

export class MakaoScene extends BaseScene {
	constructor(socketService: SocketService, roomStateService: RoomStateService) {
		super(socketService, roomStateService, { key: SCENE_KEYS.MAKAO });
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
