import {
	BaseQuestion,
	FormControlType
} from 'src/app/components/utils/form/domain/baseQuestion';

export class SelectQuestion<T> extends BaseQuestion<T> {
	readonly controlType = FormControlType.DROPDOWN;

	constructor(
		key: string,
		label: string,
		public readonly options: SelectQuestionOption<T>[],
		value?: SelectQuestionOption<T>
	) {
		super(key, label, [], value === undefined ? options[0]?.value : value.value);
	}
}

export class SelectQuestionOption<T> {
	constructor(public readonly value: T, public readonly label: string) {}
}
