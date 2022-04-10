import { ValidatorFn, Validators } from '@angular/forms';

import { TextValidatorObject } from '../validatorInterfaces';

export class MinLengthValidator implements TextValidatorObject {
	key = 'minlength';
	validateFn: ValidatorFn;

	constructor(private minLength: number) {
		this.validateFn = Validators.minLength(minLength);
	}

	errorDescription(): string {
		return `Minimum ${this.minLength} characters.`;
	}
}
