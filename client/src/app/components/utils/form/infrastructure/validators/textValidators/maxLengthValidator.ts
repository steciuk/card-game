import { ValidatorFn, Validators } from '@angular/forms';

import { TextValidatorObject } from '../validatorInterfaces';

export class MaxLengthValidator implements TextValidatorObject {
	key = 'maxlength';
	validateFn: ValidatorFn;

	constructor(private maxLength: number) {
		this.validateFn = Validators.maxLength(maxLength);
	}

	errorDescription(): string {
		return `Maximum ${this.maxLength} characters.`;
	}
}
