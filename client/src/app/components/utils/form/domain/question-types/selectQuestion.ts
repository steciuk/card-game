import {
	BaseQuestion,
	FormControlType
} from 'src/app/components/utils/form/domain/baseQuestion';

export class SelectQuestion extends BaseQuestion<string> {
	controlType = FormControlType.DROPDOWN;

	constructor(
		key: string,
		label: string,
		public readonly options: SelectQuestionOption[],
		value?: SelectQuestionOption
	) {
		super(key, label, [], value === undefined ? options[0]?.value : value.value);
	}
}

export class SelectQuestionOption {
	constructor(public readonly value: string, public readonly label: string) {}
}
