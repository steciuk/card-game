import { GameStateService } from 'src/app/services/game-state.service';
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

	constructor(socketService: SocketService, gameStateService: GameStateService, scenes: SceneInterface[]) {
		gameStateService.resetGameState();
		scenes.forEach((Constructor) => {
			this.createdScenes.push(new Constructor(socketService, gameStateService));
		});
	}

	getCreatedScenes(): BaseScene[] {
		return this.createdScenes;
	}
}

interface SceneInterface {
	new (socketService: SocketService, gameState: GameStateService): BaseScene;
}
