import Phaser from 'phaser';
import { GameDTO } from 'src/app/logic/DTO/gameDTO';
import { UserDTO } from 'src/app/logic/DTO/userDTO';
import {
	CONNECTION_STATUS,
	SocketController
} from 'src/app/logic/games/socketController';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { injectSocketController } from '../../../logic/games/scenes/makao/makaoScene';

@Component({
	selector: 'app-makao',
	templateUrl: './game-screen.component.html',
})
export class GameScreenComponent implements OnInit, OnDestroy {
	phaserConfig!: Phaser.Types.Core.GameConfig;
	phaser = Phaser;
	private subs = new SubSink();
	private gameId!: string;
	private socketController!: SocketController;

	public game!: GameDTO;
	playersInGame: UserDTO[] = [];
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

			this.subs.sink = this.http.get<GameDTO>(`/games/${this.gameId}`).subscribe((game: GameDTO) => {
				this.game = game;
				this.socketController = new SocketController(game.gameType);
				this.observeForPlayers();
				this.observeForConnection();
				if (!this.game.isPasswordProtected) {
					this.isPasswordProtected = false;
					this.connectToSocket();
				}
			});
		});

		this.phaserConfig = {
			type: Phaser.AUTO,
			width: window.innerWidth,
			height: window.innerHeight,
			scene: [injectSocketController(this.socketController)],
			backgroundColor: '#102f61n',
		};
	}

	private observeForPlayers(): void {
		this.subs.sink = this.socketController.getPlayersInGame$().subscribe({
			next: (players) => {
				this.playersInGame = players;
			},
		});
	}

	private observeForConnection(): void {
		this.subs.sink = this.socketController.getConnection$().subscribe({
			next: (connection) => {
				if (connection === CONNECTION_STATUS.CONNECTED) this.isRenderGame = true;
				else if (connection === CONNECTION_STATUS.WRONG_PASSWORD) this.isWrongPassword = true;
			},
		});
	}

	private connectToSocket(password?: string): void {
		this.socketController.connect(this.gameId, password);
	}

	onSubmit(form: NgForm): void {
		this.connectToSocket(form.value.password);
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
		this.socketController.disconnect();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onGameReady(_game: any): void {
		// game.scene.add('Scene', this.sceneService, true);
	}
}
