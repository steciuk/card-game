import { ValidatorFn, Validators } from '@angular/forms';

import { TextValidatorObject, ValidatorKey } from '../validatorInterfaces';

export class MinLengthValidator implements TextValidatorObject {
	key = ValidatorKey.MIN_LENGTH;
	validateFn: ValidatorFn;

	constructor(private minLength: number) {
		this.validateFn = Validators.minLength(minLength);
	}

	errorDescription(): string {
		return `Minimum ${this.minLength} characters.`;
	}
}
