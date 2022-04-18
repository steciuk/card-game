import { BaseComponent } from 'src/app/components/base.component';
import { IntegerQuestion } from 'src/app/components/utils/form/domain/question-types/integerQuestion';
import { PasswordQuestion } from 'src/app/components/utils/form/domain/question-types/passwordQuestion';
import {
	SelectQuestion,
	SelectQuestionOption
} from 'src/app/components/utils/form/domain/question-types/selectQuestion';
import { TextQuestion } from 'src/app/components/utils/form/domain/question-types/textQuestion';
import { FormConfig } from 'src/app/components/utils/form/form.component';
import { RequiredValidator } from 'src/app/components/utils/form/infrastructure/validators/requiredValidator';
import { MaxLengthValidator } from 'src/app/components/utils/form/infrastructure/validators/textValidators/maxLengthValidator';
import { MinLengthValidator } from 'src/app/components/utils/form/infrastructure/validators/textValidators/minLengthValidator';
import { PatternValidator } from 'src/app/components/utils/form/infrastructure/validators/textValidators/patternValidator';
import { GameDTO } from 'src/app/logic/DTO/gameDTO';
import { GameTypes } from 'src/app/logic/games/scenes/gameTypes';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { enumToArray } from 'src/app/utils';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	templateUrl: './new-game.component.html',
	styleUrls: ['./new-game.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewGameComponent extends BaseComponent {
	formConfig: FormConfig = {
		buttonText: 'Create',
		questions: [
			new TextQuestion('roomName', 'Room name', [
				new RequiredValidator(),
				new MinLengthValidator(3),
				new MaxLengthValidator(20),
				new PatternValidator({ alpha: true, numeric: true, specialChars: '_' }),
			]),
			new SelectQuestion(
				'gameType',
				'Game type',
				enumToArray(GameTypes).map((gameType) => new SelectQuestionOption(gameType, gameType))
			),
			new IntegerQuestion('maxPlayers', 'Max players', 2, 8),
			new PasswordQuestion('password', 'Password (optional)', [
				new MinLengthValidator(6),
				new MaxLengthValidator(20),
				new PatternValidator({ alpha: true, numeric: true, specialChars: '!@#$%^&*' }),
			]),
		],
	};

	constructor(
		private readonly http: HttpService,
		public authService: AuthService,
		private readonly router: Router
	) {
		super();
	}

	onAddNewGame(value: {
		roomName: string;
		gameType: GameTypes;
		maxPlayers: number;
		password?: string;
	}): void {
		if (value.password === '') delete value.password;

		this.subs.sink = this.http.post<GameDTO>('/games', value).subscribe((response) => {
			this.router.navigateByUrl(`games/makao/${response.id}`);
		});
	}
}
