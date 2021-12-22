import { GameDTO } from 'src/app/logic/DTO/gameDTO';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
})
export class GamesComponent implements OnInit, OnDestroy {
	private subs = new SubSink();
	getUrl = '/games';
	currentGames: GameDTO[] = [];

	constructor(private http: HttpService, public authService: AuthService, private router: Router) {}

	ngOnInit(): void {
		this.refreshGames();
	}

	addNewGame(game: GameDTO): void {
		this.router.navigateByUrl(`games/makao/${game.id}`);
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}

	refreshGames(): void {
		this.subs.sink = this.http.get<GameDTO[]>(this.getUrl).subscribe(
			(response) => {
				this.currentGames = response;
			},
			(error) => {
				console.log(error);
			},
			() => {}
		);
	}
}
