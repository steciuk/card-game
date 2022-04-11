/* eslint-disable @typescript-eslint/no-empty-interface */
import { ValidatorFn } from '@angular/forms';

export enum ValidatorKey {
	REQUIRED = 'required',
	MIN = 'min',
	MAX = 'max',
	MIN_LENGTH = 'minlength',
	MAX_LENGTH = 'maxlength',
	PATTERN = 'pattern',
	MATCH = 'match',
}

export interface ValidatorObject {
	key: ValidatorKey;
	validateFn: ValidatorFn;
	errorDescription: () => string;
}

export interface TextValidatorObject extends ValidatorObject {}

export interface NumberValidatorObject extends ValidatorObject {}
