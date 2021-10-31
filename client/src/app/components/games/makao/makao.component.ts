import Phaser from 'phaser';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
	selector: 'app-makao',
	templateUrl: './makao.component.html',
	styleUrls: ['./makao.component.scss'],
})
export class MakaoComponent implements OnInit {
	private gameId?: string | null;

	constructor(private route: ActivatedRoute) {} //public sceneService: SceneService

	ngOnInit(): void {
		this.route.paramMap.subscribe((params: ParamMap) => (this.gameId = params.get('id')));
	}

	public readonly config = {
		type: Phaser.AUTO,
		width: window.innerWidth,
		height: window.innerHeight,
		//scene: [Some, Other, Scenes]
	};

	public phaser = Phaser;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public onGameReady(_game: any): void {
		// game.scene.add('Scene', this.sceneService, true);
		console.log(this.gameId);
	}
}
