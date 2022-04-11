import { ValidatorFn, Validators } from '@angular/forms';

import { NumberValidatorObject, ValidatorKey } from '../validatorInterfaces';

export class MinValueValidator implements NumberValidatorObject {
	key = ValidatorKey.MIN;
	validateFn: ValidatorFn;

	constructor(private min: number) {
		this.validateFn = Validators.min(min);
	}

	errorDescription(): string {
		return `${this.min} is minimal value.`;
	}
}
