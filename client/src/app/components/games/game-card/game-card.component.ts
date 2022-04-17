import { GameDTO } from 'src/app/logic/DTO/gameDTO';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-game-card',
	templateUrl: './game-card.component.html',
	styleUrls: ['./game-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
	@Input() game!: GameDTO;

	constructor(private router: Router) {}

	connect(): void {
		this.router.navigateByUrl(`games/makao/${this.game.id}`);
	}
}
