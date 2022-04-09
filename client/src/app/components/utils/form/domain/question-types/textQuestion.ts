

import { BaseQuestion, FormControlType } from '../baseQuestion';

export class TextQuestion extends BaseQuestion<string> {
	controlType = FormControlType.TEXT;

	constructor(
		public readonly key: string,
		public readonly label: string,
		public readonly value: string = ''
	) {
		super(key, label, value);
	}
}
