import { FormControl } from '@angular/forms';

import { ValidatorObject } from '../infrastructure/validators/validatorInterfaces';

export abstract class BaseQuestion<T> {
	abstract controlType: FormControlType;
	validatorsMap: Map<string, ValidatorObject> = new Map<string, ValidatorObject>();

	constructor(
		public readonly key: string,
		public readonly label: string,
		public readonly validators: ValidatorObject[] = [],
		public readonly value?: T
	) {
		validators.forEach((validator) => this.validatorsMap.set(validator.key, validator));
	}

	toFormControl(): FormControl {
		return new FormControl(
			this.value,
			this.validators.map((validator) => validator.validateFn)
		);
	}
}

export enum FormControlType {
	TEXT = 'text',
	PASSWORD = 'password',
	DROPDOWN = 'dropdown',
	CHECKBOX = 'checkbox',
	RADIO = 'radio',
}
