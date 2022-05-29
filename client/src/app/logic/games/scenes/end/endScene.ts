import { HEX_COLORS_STRING } from 'src/app/logic/games/phaserComponents/HexColors';
import { BaseScene } from 'src/app/logic/games/scenes/baseScene';
import { SCENE_KEYS } from 'src/app/logic/games/scenes/gamesSetup';
import { SocketService } from 'src/app/services/socket.service';

export class EndScene extends BaseScene {
	private winnerUsername = '';

	constructor(socketService: SocketService) {
		super(socketService, { key: SCENE_KEYS.END });
	}

	init(winnerUsername: string): void {
		this.winnerUsername = winnerUsername;
	}
	preload(): void {}
	create(): void {
		this.add
			.text(this.xRelative(0.5), this.yRelative(0.5), `${this.winnerUsername} won the game!`)
			.setFontSize(20)
			.setOrigin(0.5)
			.setPadding(10)
			.setStyle({ backgroundColor: HEX_COLORS_STRING.BLACK });
	}
	update(): void {}
}
