import { SocketService } from 'src/app/services/socket.service';

import { BaseScene } from '../baseScene';
import { SCENE_KEYS } from '../gamesSetup';

export class EndScene extends BaseScene {
	constructor(socketService: SocketService) {
		super(socketService, { key: SCENE_KEYS.END });
	}

	init(): void {}
	preload(): void {}
	create(): void {
		this.add.text(this.xRelative(0.5), this.yRelative(0.5), 'Game finished!');
	}
	update(): void {}
}
