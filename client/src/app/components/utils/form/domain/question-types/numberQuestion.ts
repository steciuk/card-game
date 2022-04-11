import { NumberValidatorObject } from '../../infrastructure/validators/validatorInterfaces';
import { BaseQuestion, FormControlType } from '../baseQuestion';

export class NumberQuestion extends BaseQuestion<number> {
	controlType = FormControlType.NUMBER;

	constructor(key: string, label: string, validators: NumberValidatorObject[] = [], value = 0) {
		super(key, label, validators, value);
	}
}
