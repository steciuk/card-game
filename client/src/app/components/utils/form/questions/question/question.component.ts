import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BaseQuestion, FormControlType } from '../../domain/baseQuestion';

@Component({
	selector: 'app-question',
	templateUrl: './question.component.html',
	styleUrls: ['./question.component.scss'],
})
export class QuestionComponent {
	formControlType = FormControlType;

	@Input() question!: BaseQuestion<unknown>;
	@Input() formGroup!: FormGroup;

	errors: { key: string; labelFn: () => string }[] = [
		{
			key: 'required',
			labelFn: (): string => 'This field is required.',
		},
	];

	isInvalidAndDirty(): boolean {
		const control = this.formGroup.get(this.question.key);
		return control ? control.invalid && control.dirty : false;
	}
}
