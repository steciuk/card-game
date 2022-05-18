import {
	BaseQuestion,
	FormControlType
} from 'src/app/components/utils/form/domain/baseQuestion';
import { TextValidatorObject } from 'src/app/components/utils/form/infrastructure/validators/validatorInterfaces';

export class TextQuestion extends BaseQuestion<string> {
	readonly controlType = FormControlType.TEXT;

	constructor(key: string, label: string, validators: TextValidatorObject[] = [], value = '') {
		super(key, label, validators, value);
	}
}
