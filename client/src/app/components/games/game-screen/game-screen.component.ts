import Phaser from 'phaser';
import { GameDTO } from 'src/app/logic/DTO/gameDTO';
import { PHASER_CONFIG } from 'src/app/logic/games/phaserConfig';
import { GAME_CONFIG, GameSetup } from 'src/app/logic/games/scenes/gamesSetup';
import { BUILD_IN_SOCKET_GAME_EVENTS } from 'src/app/logic/games/socketEvents/socketEvents';
import { HttpService } from 'src/app/services/http.service';
import { SocketService } from 'src/app/services/socket.service';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
	selector: 'app-makao',
	templateUrl: './game-screen.component.html',
	styleUrls: ['./game-screen.component.scss'],
})
export class GameScreenComponent implements OnInit, OnDestroy {
	phaserConfig = PHASER_CONFIG;

	phaser = Phaser;
	private subs = new SubSink();
	private gameId!: string;
	private gameSetup!: GameSetup;

	private game!: GameDTO;
	isPasswordProtected = true;
	isRenderGame = false;
	isWrongPassword = false;

	constructor(
		private route: ActivatedRoute,
		private http: HttpService,
		private router: Router,
		private socketService: SocketService
	) {}

	ngOnInit(): void {
		this.subs.sink = this.route.paramMap.subscribe((params: ParamMap) => {
			this.gameId = params.get('id') as string;
			if (!this.gameId) {
				this.router.navigateByUrl('/404');
				return;
			}

			this.subs.sink = this.http.get<GameDTO>(`/games/${this.gameId}`).subscribe(
				(game: GameDTO) => {
					this.game = game;

					if (!this.game.isPasswordProtected) {
						this.isPasswordProtected = false;
						this.connectToSocket();
					}
				},
				(error) => console.log(error)
			);
		});
	}

	private connectToSocket(password?: string): void {
		this.socketService.create(this.gameId, this.game.gameType, password);
		this.socketService.registerSocketListener(BUILD_IN_SOCKET_GAME_EVENTS.CONNECT, () => {
			console.log('connected');
			this.isRenderGame = true;
		});

		this.socketService.registerSocketListener(BUILD_IN_SOCKET_GAME_EVENTS.CONNECT_ERROR, (error) => {
			this.socketService.disconnect();
			if (error.message === 'Socket - Wrong room password') {
				//TODO: Some custom error types
				this.isWrongPassword = true;
			}
			console.error(error);
		});

		this.gameSetup = new GameSetup(this.socketService, GAME_CONFIG.MAKAO);

		this.socketService.connect();
	}

	onSubmit(form: NgForm): void {
		this.connectToSocket(form.value.password);
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
		this.socketService.disconnect();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onGameReady(game: any): void {
		this.gameSetup.getCreatedScenes().forEach((scene, i) => {
			game.scene.add(scene.key, scene, i === 0);
		});
	}
}
