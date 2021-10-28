import { HttpService } from 'src/app/services/http.service';

import { Component, OnInit } from '@angular/core';

import { Game } from './gameResponse';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
	getUrl = '/games';
	currentGames?: Game[];

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
}
