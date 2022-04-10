import { ValidatorFn } from '@angular/forms';

export interface ValidatorObject {
	key: string;
	validateFn: ValidatorFn;
	errorDescription: () => string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TextValidatorObject extends ValidatorObject {}
