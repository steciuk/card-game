import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { BaseQuestion } from './domain/baseQuestion';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit {
	@Input() formConfig!: FormConfig;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	@Output() submitEvent: EventEmitter<any> = new EventEmitter();
	formGroup!: FormGroup;

	constructor() {}

	ngOnInit(): void {
		const group: { [key: string]: FormControl } = {};
		this.formConfig.questions.forEach((question) => {
			group[question.key] = question.toFormControl();
		});

		this.formGroup = new FormGroup(group);
	}

	onKeyDown(event: { keyCode: number }): void {
		if (event.keyCode === 13) this.onSubmit();
	}

	onSubmit(): void {
		if (this.formGroup.valid) this.submitEvent.emit(this.formGroup.value);
	}
}

export type FormConfig = {
	questions: BaseQuestion<unknown>[];
	buttonText: string;
};
