import { RoomStateService } from 'src/app/services/room-state.service';
import { SocketService } from 'src/app/services/socket.service';

import { BaseScene } from './baseScene';

export enum GameTypes {
	MAKAO = 'MAKAO',
}

export enum SCENE_KEYS {
	LOBBY = 'LOBBY',
	MAKAO = 'MAKAO',
}

export class GameSetup {
	private createdScenes: BaseScene[] = [];

	constructor(socketService: SocketService, roomStateService: RoomStateService, scenes: SceneInterface[]) {
		roomStateService.resetRoomState();
		scenes.forEach((Constructor) => {
			this.createdScenes.push(new Constructor(socketService, roomStateService));
		});

		for (let i = 0; i < this.createdScenes.length - 1; i++) {
			this.createdScenes[i].setNextSceneKey(this.createdScenes[i + 1].key);
		}
	}

	getCreatedScenes(): BaseScene[] {
		return this.createdScenes;
	}
}

interface SceneInterface {
	new (socketService: SocketService, roomState: RoomStateService): BaseScene;
}
