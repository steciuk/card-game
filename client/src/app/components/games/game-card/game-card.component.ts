import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Game } from '../gameResponse';

@Component({
	selector: 'app-game-card',
	templateUrl: './game-card.component.html',
})
export class GameCardComponent implements OnInit {
	@Input() game!: Game;

	constructor(private router: Router) {}

	ngOnInit(): void {}

	connect(): void {
		this.router.navigateByUrl(`games/makao/${this.game.id}`);
	}
}
