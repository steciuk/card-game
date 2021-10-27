import Phaser from 'phaser';

import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-makao',
	templateUrl: './makao.component.html',
	styleUrls: ['./makao.component.scss'],
})
export class MakaoComponent implements OnInit {
	ngOnInit(): void {
		Phaser.Scene;
	}

	public readonly config = {
		type: Phaser.AUTO,
		width: window.innerWidth,
		height: window.innerHeight,
		//scene: [Some, Other, Scenes]
	};

	public phaser = Phaser;

	constructor() //public sceneService: SceneService
	{}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public onGameReady(_game: any): void {
		// game.scene.add('Scene', this.sceneService, true);
		console.log('onGameReady');
	}
}
