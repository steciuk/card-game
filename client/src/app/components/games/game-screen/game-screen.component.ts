import Phaser from 'phaser';
import { GameDTO } from 'src/app/logic/DTO/gameDTO';
import {
	CONNECTION_STATUS,
	GameHandler
} from 'src/app/logic/games/gameHandler';
import { BaseScene } from 'src/app/logic/games/scenes/baseScene';
import { MakaoScene } from 'src/app/logic/games/scenes/makao/makaoScene';
import { LobbyScene } from 'src/app/logic/games/scenes/menu/lobbyScene';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
	selector: 'app-makao',
	templateUrl: './game-screen.component.html',
})
export class GameScreenComponent implements OnInit, OnDestroy {
	phaserConfig!: Phaser.Types.Core.GameConfig;
	phaser = Phaser;
	private subs = new SubSink();
	private gameId!: string;
	private gameHandler!: GameHandler;

	public game!: GameDTO;
	isPasswordProtected = true;
	isRenderGame = false;
	isWrongPassword = false;

	constructor(private route: ActivatedRoute, private http: HttpService, private router: Router) {} //public sceneService: SceneService

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
					this.gameHandler = new GameHandler(game.gameType);
					BaseScene.injectGameHandler(this.gameHandler);
					this.observeForConnection();
					if (!this.game.isPasswordProtected) {
						this.isPasswordProtected = false;
						this.connectToSocket();
					}
				},
				(error) => console.log(error)
			);
		});

		this.phaserConfig = {
			type: Phaser.AUTO,
			width: 800, //window.innerWidth,
			height: 800, //window.innerHeight,
			scene: [LobbyScene, MakaoScene],
			backgroundColor: '#8a78ff',
		};
	}

	private observeForConnection(): void {
		this.subs.sink = this.gameHandler.getConnection$().subscribe({
			next: (connection) => {
				if (connection === CONNECTION_STATUS.CONNECTED) this.isRenderGame = true;
				else if (connection === CONNECTION_STATUS.WRONG_PASSWORD) this.isWrongPassword = true;
			},
		});
	}

	private connectToSocket(password?: string): void {
		this.gameHandler.connect(this.gameId, password);
	}

	onSubmit(form: NgForm): void {
		this.connectToSocket(form.value.password);
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
		this.gameHandler.disconnect();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onGameReady(_game: any): void {
		// game.scene.add('Scene', this.sceneService, true);
	}
}
