import {
	BaseQuestion,
	FormControlType
} from 'src/app/components/utils/form/domain/baseQuestion';

export class IntegerQuestion extends BaseQuestion<number> {
	controlType = FormControlType.INTEGER;

	constructor(
		key: string,
		label: string,
		public readonly minValue: number,
		public readonly maxValue: number,
		value?: number
	) {
		super(key, label, [], value === undefined ? minValue : value);
	}
}
