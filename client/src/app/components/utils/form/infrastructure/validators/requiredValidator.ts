import { Validators } from '@angular/forms';

import { ValidatorKey, ValidatorObject } from './validatorInterfaces';

export class RequiredValidator implements ValidatorObject {
	key = ValidatorKey.REQUIRED;
	validateFn = Validators.required;
	errorDescription(): string {
		return 'Field required.';
	}
}
