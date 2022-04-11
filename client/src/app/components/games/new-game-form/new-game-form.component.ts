import { GameDTO } from 'src/app/logic/DTO/gameDTO';
import { GameTypes } from 'src/app/logic/games/scenes/gamesSetup';
import { HttpService } from 'src/app/services/http.service';
import { enumToArray } from 'src/app/utils';

import { ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Base } from '../../base.component';

@Component({
	selector: 'app-new-game-form',
	templateUrl: './new-game-form.component.html',
	styleUrls: ['./new-game-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewGameFormComponent extends Base implements OnInit, OnDestroy {
	private submitUrl = '/games';
	gameTypes!: string[];
	isPasswordProtectedModel = false;
	numPlayersOptions = [2, 3, 4, 5, 6, 7, 8];

	@Output() addNewGame = new EventEmitter<GameDTO>();

	constructor(private http: HttpService) {
		super();
	}

	ngOnInit(): void {
		this.gameTypes = enumToArray(GameTypes);
	}

	onSubmit(form: NgForm): void {
		const formValue = form.value;
		if (formValue.password === '') delete formValue.password;

		this.subs.sink = this.http.post(this.submitUrl, formValue).subscribe((response) => {
			this.addNewGame.emit(response as GameDTO);
		});
	}
}
