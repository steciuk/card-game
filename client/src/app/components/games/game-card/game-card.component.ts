import { Component, Input, OnInit } from '@angular/core';

import { Game } from '../gameResponse';

@Component({
	selector: 'app-game',
	templateUrl: './game-card.component.html',
})
export class GameCardComponent implements OnInit {
	@Input() game!: Game;
	constructor() {}

	ngOnInit(): void {}
}
