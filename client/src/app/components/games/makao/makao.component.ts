import Phaser from 'phaser';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { SocketController } from '../socketController';
import { injectSocketController } from './makaoScene';

@Component({
	selector: 'app-makao',
	templateUrl: './makao.component.html',
})
export class MakaoComponent implements OnInit, OnDestroy {
	private subs = new SubSink();
	private gameId!: string | null;
	private socketController!: SocketController;
	phaserConfig!: Phaser.Types.Core.GameConfig;
	phaser = Phaser;

	constructor(private route: ActivatedRoute, private http: HttpService, private router: Router) {} //public sceneService: SceneService

	ngOnInit(): void {
		this.route.paramMap.subscribe((params: ParamMap) => {
			this.gameId = params.get('id');
			if (!this.gameId) {
				this.router.navigateByUrl('/404');
				return;
			}

			this.socketController = new SocketController();
			this.socketController.connect(this.gameId);
		});

		this.phaserConfig = {
			type: Phaser.AUTO,
			width: window.innerWidth,
			height: window.innerHeight,
			scene: [injectSocketController(this.socketController)],
			backgroundColor: '#4488aa',
		};
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
