import { ValidatorFn, Validators } from '@angular/forms';

import { NumberValidatorObject, ValidatorKey } from '../validatorInterfaces';

export class MaxValueValidator implements NumberValidatorObject {
	key = ValidatorKey.MAX;
	validateFn: ValidatorFn;

	constructor(private max: number) {
		this.validateFn = Validators.min(max);
	}

	errorDescription(): string {
		return `${this.max} is maximal value.`;
	}
}
