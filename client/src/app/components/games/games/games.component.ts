import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';

import { Game } from '../../../logic/games/gameResponse';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
})
export class GamesComponent implements OnInit, OnDestroy {
	private subs = new SubSink();
	getUrl = '/games';
	currentGames: Game[] = [];

	constructor(private http: HttpService) {}

	ngOnInit(): void {
		this.http.get<Game[]>(this.getUrl).subscribe(
			(response) => {
				this.currentGames = response;
			},
			(error) => {
				console.log(error);
			},
			() => {}
		);
	}

	addNewGame(game: Game): void {
		this.currentGames.push(game);
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}
}
