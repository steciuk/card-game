import { GameDTO } from 'src/app/logic/DTO/gameDTO';
import { GameTypes } from 'src/app/logic/games/scenes/gamesSetup';
import { HttpService } from 'src/app/services/http.service';
import { enumToArray } from 'src/app/utils';
import { SubSink } from 'subsink';

import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-new-game-form',
	templateUrl: './new-game-form.component.html',
	styleUrls: ['./new-game-form.component.scss'],
})
export class NewGameFormComponent implements OnInit, OnDestroy {
	private subs = new SubSink();
	private submitUrl = '/games';
	gameTypes!: string[];
	isPasswordProtectedModel = false;
	numPlayersOptions = [2, 3, 4, 5, 6, 7, 8];

	@Output() addNewGame = new EventEmitter<GameDTO>();

	constructor(private http: HttpService) {}

	ngOnInit(): void {
		this.gameTypes = enumToArray(GameTypes);
	}

	onSubmit(form: NgForm): void {
		const formValue = form.value;
		if (formValue.password === '') delete formValue.password;

		this.http.post(this.submitUrl, formValue).subscribe(
			(response) => {
				this.addNewGame.emit(response as GameDTO);
			},
			(error) => {
				console.log(error);
			},
			() => {}
		);
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}
}
