import { BaseRoute } from 'src/app/app-routing.module';
import { ErrorBanner } from 'src/app/components/banner/domain/bannerConfig';
import { BaseComponent } from 'src/app/components/base.component';
import { PasswordQuestion } from 'src/app/components/utils/form/domain/question-types/passwordQuestion';
import { TextQuestion } from 'src/app/components/utils/form/domain/question-types/textQuestion';
import { FormConfig } from 'src/app/components/utils/form/form.component';
import { RequiredValidator } from 'src/app/components/utils/form/infrastructure/validators/requiredValidator';
import { MaxLengthValidator } from 'src/app/components/utils/form/infrastructure/validators/textValidators/maxLengthValidator';
import { MinLengthValidator } from 'src/app/components/utils/form/infrastructure/validators/textValidators/minLengthValidator';
import { PatternValidator } from 'src/app/components/utils/form/infrastructure/validators/textValidators/patternValidator';
import { LoginDTO } from 'src/app/logic/DTO/loginDTO';
import { AuthService } from 'src/app/services/auth.service';
import { BannerService } from 'src/app/services/banner.service';
import { HttpService } from 'src/app/services/http.service';

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends BaseComponent {
	formConfig: FormConfig = {
		buttonText: 'Log in',
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
		],
	};

	constructor(
		private readonly http: HttpService,
		private readonly authService: AuthService,
		private readonly router: Router,
		private readonly bannerService: BannerService
	) {
		super();
	}

	onLogin(value: { username: string; password: string; confirmPassword: string }): void {
		this.subs.sink = this.http
			.post<LoginDTO>('/users/login', { username: value.username, password: value.password })
			.subscribe(
				(response) => {
					this.authService.setLocalStorage(response);
					this.router.navigateByUrl(`/${BaseRoute.GAMES}`);
				},
				(error) => {
					if (error.status === 401)
						this.bannerService.showBanner(new ErrorBanner('Invalid credentials'));
				}
			);
	}
}
