import { ValidatorFn, Validators } from '@angular/forms';

import { TextValidatorObject, ValidatorKey } from '../validatorInterfaces';

export class MaxLengthValidator implements TextValidatorObject {
	key = ValidatorKey.MAX_LENGTH;
	validateFn: ValidatorFn;

	constructor(private maxLength: number) {
		this.validateFn = Validators.maxLength(maxLength);
	}

	errorDescription(): string {
		return `Maximum ${this.maxLength} characters.`;
	}
}
