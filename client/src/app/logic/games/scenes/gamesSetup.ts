import { SocketService } from 'src/app/services/socket.service';

import { BaseScene } from './baseScene';
import { EndScene } from './end/endScene';
import { LobbyScene } from './lobby/lobbyScene';
import { MakaoScene } from './makao/makaoScene';

export class GAME_CONFIG {
	static readonly MAKAO = new GAME_CONFIG([LobbyScene, MakaoScene, EndScene]);

	private constructor(public SceneConstructors: SceneInterface[]) {}
}

export enum SCENE_KEYS {
	LOBBY = 'LOBBY',
	MAKAO = 'MAKAO',
	END = 'END',
}

export class GameSetup {
	private createdScenes: BaseScene[] = [];

	constructor(socketService: SocketService, gameConfig: GAME_CONFIG) {
		gameConfig.SceneConstructors.forEach((Constructor) => {
			this.createdScenes.push(new Constructor(socketService));
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
	new (socketService: SocketService): BaseScene;
}
