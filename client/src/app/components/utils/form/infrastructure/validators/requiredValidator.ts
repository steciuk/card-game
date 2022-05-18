import { Validators } from '@angular/forms';

import {
	NumberValidatorObject,
	TextValidatorObject,
	ValidatorKey
} from './validatorInterfaces';

export class RequiredValidator implements TextValidatorObject, NumberValidatorObject {
	key = ValidatorKey.REQUIRED;
	validateFn = Validators.required;
	errorDescription(): string {
		return 'Field required.';
	}
}
