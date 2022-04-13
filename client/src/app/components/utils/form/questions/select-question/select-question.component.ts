import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { BaseQuestion } from '../../domain/baseQuestion';
import { SelectQuestion } from '../../domain/question-types/selectQuestion';

@Component({
	selector: 'app-select-question',
	templateUrl: './select-question.component.html',
	styleUrls: ['./select-question.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectQuestionComponent {
	@Input() set question(question: BaseQuestion<unknown>) {
		this._question = question as SelectQuestion;
	}
	_question!: SelectQuestion;

	@Input() formGroup!: FormGroup;
}
