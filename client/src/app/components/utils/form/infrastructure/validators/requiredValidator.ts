import { Validators } from '@angular/forms';

import { ValidatorObject } from './validatorInterfaces';

export class RequiredValidator implements ValidatorObject {
	key = 'required';
	validateFn = Validators.required;
	errorDescription(): string {
		return 'Field required.';
	}
}
