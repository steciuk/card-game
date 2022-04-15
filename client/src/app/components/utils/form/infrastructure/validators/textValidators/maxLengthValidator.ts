import {
	TextValidatorObject,
	ValidatorKey
} from 'src/app/components/utils/form/infrastructure/validators/validatorInterfaces';

import { ValidatorFn, Validators } from '@angular/forms';

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
