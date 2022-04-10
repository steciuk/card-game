import { TextValidatorObject } from '../../infrastructure/validators/validatorInterfaces';
import { BaseQuestion, FormControlType } from '../baseQuestion';

export class TextQuestion extends BaseQuestion<string> {
	controlType = FormControlType.TEXT;

	constructor(key: string, label: string, validators: TextValidatorObject[] = [], value = '') {
		super(key, label, validators, value);
	}
}
