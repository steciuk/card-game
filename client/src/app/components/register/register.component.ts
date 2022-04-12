import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IntegerQuestion } from '../utils/form/domain/question-types/integerQuestion';
import { PasswordQuestion } from '../utils/form/domain/question-types/passwordQuestion';
import { TextQuestion } from '../utils/form/domain/question-types/textQuestion';
import { RequiredValidator } from '../utils/form/infrastructure/validators/requiredValidator';
import { MatchOtherInputValidator } from '../utils/form/infrastructure/validators/textValidators/matchOtherInput';
import { MaxLengthValidator } from '../utils/form/infrastructure/validators/textValidators/maxLengthValidator';
import { MinLengthValidator } from '../utils/form/infrastructure/validators/textValidators/minLengthValidator';
import { PatternValidator } from '../utils/form/infrastructure/validators/textValidators/patternValidator';

@Component({
	templateUrl: './register.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent {
	submitUrl = '/users/register';

	questions = [
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
			new MatchOtherInputValidator('password'),
		]),
		new IntegerQuestion('numPlayers', 'Number of Players', 2, 8),
	];
}
