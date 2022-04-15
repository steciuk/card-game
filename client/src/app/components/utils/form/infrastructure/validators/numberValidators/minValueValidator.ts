import {
	NumberValidatorObject,
	ValidatorKey
} from 'src/app/components/utils/form/infrastructure/validators/validatorInterfaces';

import { ValidatorFn, Validators } from '@angular/forms';

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
