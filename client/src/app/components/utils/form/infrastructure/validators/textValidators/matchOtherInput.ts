import {
	ValidatorKey,
	ValidatorObject
} from 'src/app/components/utils/form/infrastructure/validators/validatorInterfaces';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class MatchOtherInputValidator implements ValidatorObject {
	key = ValidatorKey.MATCH;
	validateFn: ValidatorFn;

	constructor(otherInputKey: string) {
		this.validateFn = (control: AbstractControl): ValidationErrors | null => {
			const value = control.value;
			const otherValue = control.parent?.get(otherInputKey)?.value;
			return value === otherValue ? null : { match: true };
		};
	}

	errorDescription(): string {
		return 'Values must match.';
	}
}
