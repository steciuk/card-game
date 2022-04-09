import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { BaseQuestion } from './domain/baseQuestion';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
	@Input() questions!: BaseQuestion<unknown>[];

	formGroup!: FormGroup;

	constructor() {}

	ngOnInit(): void {
		const group: { [key: string]: FormControl } = {};
		this.questions.forEach((question) => {
			group[question.key] = question.toFormControl();
		});

		this.formGroup = new FormGroup(group);
	}
}
