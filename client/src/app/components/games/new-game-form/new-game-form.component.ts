import { HttpService } from 'src/app/services/http.service';
import { enumToArray } from 'src/app/utils';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Game, GameTypes } from '../gameResponse';

@Component({
	selector: 'app-new-game-form',
	templateUrl: './new-game-form.component.html',
	styleUrls: ['./new-game-form.component.scss'],
})
export class NewGameFormComponent implements OnInit {
	private submitUrl = '/games';
	gameTypes!: string[];
	gameTypeModel!: string;
	isPasswordProtectedModel!: boolean;

	@Output() addNewGame = new EventEmitter<Game>();

	constructor(private http: HttpService) {}

	ngOnInit(): void {
		this.gameTypes = enumToArray(GameTypes);
		this.gameTypeModel = this.gameTypes[0];
	}

	onSubmit(form: NgForm): void {
		console.log(form.value);
		const formValue = form.value;
		if (formValue.password === '') delete formValue.password;

		this.http.post(this.submitUrl, formValue).subscribe(
			(response) => {
				this.addNewGame.emit(response as Game);
			},
			(error) => {
				console.log(error);
			},
			() => {}
		);
	}
}
