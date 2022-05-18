import { BaseQuestion } from 'src/app/components/utils/form/domain/baseQuestion';
import { SelectQuestion } from 'src/app/components/utils/form/domain/question-types/selectQuestion';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
	selector: 'app-select-question',
	templateUrl: './select-question.component.html',
	styleUrls: ['./select-question.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectQuestionComponent {
	@Input() set question(question: BaseQuestion<unknown>) {
		this._question = question as SelectQuestion<unknown>;
	}
	_question!: SelectQuestion<unknown>;

	@Input() formGroup!: FormGroup;
}
