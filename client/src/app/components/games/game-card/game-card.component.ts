import { GameDTO } from 'src/app/logic/DTO/gameDTO';

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-game-card',
	templateUrl: './game-card.component.html',
})
export class GameCardComponent implements OnInit {
	@Input() game!: GameDTO;

	constructor(private router: Router) {}

	ngOnInit(): void {}

	connect(): void {
		this.router.navigateByUrl(`games/makao/${this.game.id}`);
	}
}
