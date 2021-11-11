import { GameDTO } from 'src/app/logic/DTO/gameDTO';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
})
export class GamesComponent implements OnInit, OnDestroy {
	private subs = new SubSink();
	getUrl = '/games';
	currentGames: GameDTO[] = [];

	constructor(private http: HttpService) {}

	ngOnInit(): void {
		this.http.get<GameDTO[]>(this.getUrl).subscribe(
			(response) => {
				this.currentGames = response;
			},
			(error) => {
				console.log(error);
			},
			() => {}
		);
	}

	addNewGame(game: GameDTO): void {
		this.currentGames.push(game);
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}
}
