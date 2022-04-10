import { TextValidatorObject } from '../../infrastructure/validators/validatorInterfaces';
import { BaseQuestion, FormControlType } from '../baseQuestion';

export class PasswordQuestion extends BaseQuestion<string> {
	controlType = FormControlType.PASSWORD;

	constructor(key: string, label: string, validators: TextValidatorObject[] = [], value = '') {
		super(key, label, validators, value);
	}
}
