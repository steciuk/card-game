import { FormControl, ValidatorFn } from '@angular/forms';

export abstract class BaseQuestion<T> {
	abstract controlType: FormControlType;
	protected validators: ValidatorFn[] = [];

	constructor(public readonly key: string, public readonly label: string, public readonly value?: T) {}

	withValidators(validators: ValidatorFn[]): void {
		this.validators = validators;
	}

	toFormControl(): FormControl {
		return new FormControl(this.value, this.validators);
	}
}

export enum FormControlType {
	TEXT = 'text',
	PASSWORD = 'password',
	DROPDOWN = 'dropdown',
	CHECKBOX = 'checkbox',
	RADIO = 'radio',
}
