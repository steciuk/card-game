import {
	BaseQuestion,
	FormControlType
} from 'src/app/components/utils/form/domain/baseQuestion';
import { NumberValidatorObject } from 'src/app/components/utils/form/infrastructure/validators/validatorInterfaces';

export class NumberQuestion extends BaseQuestion<number> {
	controlType = FormControlType.NUMBER;

	constructor(key: string, label: string, validators: NumberValidatorObject[] = [], value = 0) {
		super(key, label, validators, value);
	}
}
