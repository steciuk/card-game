import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { ValidatorObject } from '../validatorInterfaces';

export class MatchOtherInputValidator implements ValidatorObject {
	key = 'match';
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
