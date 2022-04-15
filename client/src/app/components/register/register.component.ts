import { BaseRoute } from 'src/app/app-routing.module';
import { BaseComponent } from 'src/app/components/base.component';
import { PasswordQuestion } from 'src/app/components/utils/form/domain/question-types/passwordQuestion';
import { TextQuestion } from 'src/app/components/utils/form/domain/question-types/textQuestion';
import { FormConfig } from 'src/app/components/utils/form/form.component';
import { RequiredValidator } from 'src/app/components/utils/form/infrastructure/validators/requiredValidator';
import { MatchOtherInputValidator } from 'src/app/components/utils/form/infrastructure/validators/textValidators/matchOtherInput';
import { MaxLengthValidator } from 'src/app/components/utils/form/infrastructure/validators/textValidators/maxLengthValidator';
import { MinLengthValidator } from 'src/app/components/utils/form/infrastructure/validators/textValidators/minLengthValidator';
import { PatternValidator } from 'src/app/components/utils/form/infrastructure/validators/textValidators/patternValidator';
import { LoginDTO } from 'src/app/logic/DTO/loginDTO';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent extends BaseComponent {
	formConfig: FormConfig = {
		buttonText: 'Register',
		questions: [
			new TextQuestion('username', 'Username', [
				new RequiredValidator(),
				new MinLengthValidator(6),
				new MaxLengthValidator(20),
				new PatternValidator({ alpha: true, numeric: true, specialChars: '_' }),
			]),
			new PasswordQuestion('password', 'Password', [
				new RequiredValidator(),
				new MinLengthValidator(6),
				new MaxLengthValidator(20),
				new PatternValidator({ alpha: true, numeric: true, specialChars: '!@#$%^&*' }),
			]),
			new PasswordQuestion('confirmPassword', 'Confirm Password', [
				new RequiredValidator(),
				new MatchOtherInputValidator('password'),
			]),
		],
	};

	constructor(
		private readonly http: HttpService,
		private readonly authService: AuthService,
		private readonly router: Router
	) {
		super();
	}

	onRegister(value: { username: string; password: string; confirmPassword: string }): void {
		this.subs.sink = this.http
			.post<LoginDTO>('/users/register', { username: value.username, password: value.password })
			.subscribe(
				(response) => {
					this.authService.setLocalStorage(response);
					this.router.navigateByUrl(`/${BaseRoute.GAMES}`);
				},
				(error) => {
					if (error.status === 409) console.error('Username taken');
					console.log(error);
				}
			);
	}
}
