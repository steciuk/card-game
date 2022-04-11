import { GameDTO } from 'src/app/logic/DTO/gameDTO';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Base } from '../../base.component';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent extends Base implements OnInit, OnDestroy {
	getUrl = '/games';
	currentGames: GameDTO[] = [];

	constructor(
		private readonly http: HttpService,
		public authService: AuthService,
		private readonly router: Router,
		private readonly cdRef: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit(): void {
		this.refreshGames();
	}

	addNewGame(game: GameDTO): void {
		this.router.navigateByUrl(`games/makao/${game.id}`);
	}

	refreshGames(): void {
		this.subs.sink = this.http.get<GameDTO[]>(this.getUrl).subscribe((response) => {
			this.currentGames = response;
			this.cdRef.detectChanges();
		});
	}
}
