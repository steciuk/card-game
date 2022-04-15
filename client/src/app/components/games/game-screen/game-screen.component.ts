import Phaser from 'phaser';
import { BaseComponent } from 'src/app/components/base.component';
import { GameDTO } from 'src/app/logic/DTO/gameDTO';
import { PHASER_CONFIG } from 'src/app/logic/games/phaserConfig';
import { GAME_CONFIG, GameSetup } from 'src/app/logic/games/scenes/gamesSetup';
import { BUILD_IN_SOCKET_GAME_EVENTS } from 'src/app/logic/games/socketEvents/socketEvents';
import { HttpService } from 'src/app/services/http.service';
import { SocketService } from 'src/app/services/socket.service';

import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
	selector: 'app-makao',
	templateUrl: './game-screen.component.html',
	styleUrls: ['./game-screen.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameScreenComponent extends BaseComponent implements OnInit, OnDestroy {
	phaserConfig = PHASER_CONFIG;

	phaser = Phaser;
	private gameId!: string;
	private gameSetup!: GameSetup;

	private game!: GameDTO;
	isPasswordProtected = true;
	isRenderGame = false;
	isWrongPassword = false;

	constructor(
		private readonly route: ActivatedRoute,
		private readonly http: HttpService,
		private readonly router: Router,
		private readonly socketService: SocketService,
		private readonly cdRef: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.route.paramMap.subscribe((params: ParamMap) => {
			this.gameId = params.get('id') as string;
			if (!this.gameId) {
				this.router.navigateByUrl('/404');
				return;
			}

			this.subs.sink = this.http.get<GameDTO>(`/games/${this.gameId}`).subscribe((game: GameDTO) => {
				this.game = game;

				if (!this.game.isPasswordProtected) {
					this.isPasswordProtected = false;
					this.connectToSocket();
				}

				this.cdRef.detectChanges();
			});
		});
	}

	private connectToSocket(password?: string): void {
		this.socketService.create(this.gameId, this.game.gameType, password);
		this.socketService.registerSocketListener(BUILD_IN_SOCKET_GAME_EVENTS.CONNECT, () => {
			this.isRenderGame = true;
			this.cdRef.detectChanges();
		});

		this.socketService.registerSocketListener(BUILD_IN_SOCKET_GAME_EVENTS.CONNECT_ERROR, (error) => {
			this.socketService.disconnect();
			if (error.message === 'Socket - Wrong room password') {
				//TODO: Some custom error types
				this.isWrongPassword = true;
				this.cdRef.detectChanges();
			}
		});

		this.gameSetup = new GameSetup(this.socketService, GAME_CONFIG.MAKAO);
		this.socketService.connect();
	}

	onSubmit(form: NgForm): void {
		this.connectToSocket(form.value.password);
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	override ngOnDestroy() {
		this.socketService.disconnect();
		return super.ngOnDestroy();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onGameReady(game: any): void {
		this.gameSetup.getCreatedScenes().forEach((scene, i) => {
			game.scene.add(scene.key, scene, i === 0);
		});
	}
}
