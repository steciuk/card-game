import { ValidatorFn, Validators } from '@angular/forms';

import { TextValidatorObject } from '../validatorInterfaces';

export class PatternValidator implements TextValidatorObject {
	key = 'pattern';
	validateFn: ValidatorFn;
	description: string;

	constructor(
		private options: {
			alpha?: boolean;
			numeric?: boolean;
			specialChars?: string;
		}
	) {
		this.description = this.buildDescription();
		const pattern = this.buildPattern();
		this.validateFn = Validators.pattern(pattern);
	}

	buildDescription(): string {
		const allowed: string[] = [];
		if (this.options.alpha) allowed.push('latin alphabet');
		if (this.options.numeric) allowed.push('numbers');
		if (this.options.specialChars) allowed.push(`'${this.options.specialChars}'`);

		let description = 'Only';
		allowed.forEach((text: string, i: number) => {
			if (i === 0) {
				description += ` ${text}`;
			} else if (i === allowed.length - 1) {
				description += ` and ${text}`;
			} else {
				description += `, ${text}`;
			}
		});
		description += ' allowed.';

		return description;
	}

	errorDescription(): string {
		return this.description;
	}

	buildPattern(): RegExp {
		let stringPattern = '^[';
		if (this.options.alpha) stringPattern += 'a-zA-Z';
		if (this.options.numeric) stringPattern += '0-9';
		if (this.options.specialChars) stringPattern += this.options.specialChars;

		stringPattern += ']+$';
		return new RegExp(stringPattern);
	}
}
