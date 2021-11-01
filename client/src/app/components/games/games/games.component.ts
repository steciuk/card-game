import { HttpService } from 'src/app/services/http.service';

import { Component, OnInit } from '@angular/core';

import { Game } from '../gameResponse';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
})
export class GamesComponent implements OnInit {
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
}
