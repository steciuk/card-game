import {
	NumberValidatorObject,
	ValidatorKey
} from 'src/app/components/utils/form/infrastructure/validators/validatorInterfaces';

import { ValidatorFn, Validators } from '@angular/forms';

export class MaxValueValidator implements NumberValidatorObject {
	key = ValidatorKey.MAX;
	validateFn: ValidatorFn;

	constructor(private max: number) {
		this.validateFn = Validators.max(max);
	}

	errorDescription(): string {
		return `${this.max} is maximal value.`;
	}
}
