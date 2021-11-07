import Phaser from 'phaser';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Game } from '../gameResponse';
import { SocketController } from '../socketController';
import { injectSocketController } from './makaoScene';

@Component({
	selector: 'app-makao',
	templateUrl: './makao.component.html',
})
export class MakaoComponent implements OnInit, OnDestroy {
	phaserConfig!: Phaser.Types.Core.GameConfig;
	phaser = Phaser;
	private subs = new SubSink();
	private gameId!: string;
	private socketController!: SocketController;

	public game!: Game;
	playersInGame: string[] = [];
	renderGame = false;

	constructor(private route: ActivatedRoute, private http: HttpService, private router: Router) {} //public sceneService: SceneService

	ngOnInit(): void {
		this.subs.sink = this.route.paramMap.subscribe((params: ParamMap) => {
			this.gameId = params.get('id') as string;
			if (!this.gameId) {
				this.router.navigateByUrl('/404');
				return;
			}

			this.subs.sink = this.http.get<Game>(`/games/${this.gameId}`).subscribe((game: Game) => {
				this.game = game;
				this.socketController = new SocketController(game.gameType);
				this.observeForPlayers();
				if (!this.game.isPasswordProtected) {
					this.connectToSocket();
					this.renderGame = true;
				}
			});
		});

		this.phaserConfig = {
			type: Phaser.AUTO,
			width: window.innerWidth,
			height: window.innerHeight,
			scene: [injectSocketController(this.socketController)],
			backgroundColor: '#4488aa',
		};
	}

	private observeForPlayers(): void {
		this.subs.sink = this.socketController.getPlayersInGame$().subscribe({
			next: (players) => (this.playersInGame = players),
		});
	}

	private connectToSocket(): void {
		this.socketController.connect(this.gameId);
	}

	onSubmit(form: NgForm): void {
		// TODO: check if password is correct
		this.connectToSocket();
		this.renderGame = true;
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
