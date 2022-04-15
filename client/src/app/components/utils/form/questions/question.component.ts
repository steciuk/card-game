import {
	BaseQuestion,
	FormControlType
} from 'src/app/components/utils/form/domain/baseQuestion';
import { IntegerQuestion } from 'src/app/components/utils/form/domain/question-types/integerQuestion';

import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit
} from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-question',
	templateUrl: './question.component.html',
	styleUrls: ['./question.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent implements OnInit {
	formControlType = FormControlType;

	@Input() question!: BaseQuestion<unknown>;

	@Input() formGroup!: FormGroup;

	formControl!: AbstractControl;

	ngOnInit(): void {
		this.formControl = this.formGroup.get(this.question.key) as AbstractControl;
	}

	isInvalidAndDirty(): boolean {
		return this.formControl.invalid && (this.formControl.dirty || this.formControl.touched);
	}

	get errorKeys(): string[] {
		return this.formControl.errors ? Object.keys(this.formControl.errors) : [];
	}

	isInt(candidate: BaseQuestion<unknown>): candidate is IntegerQuestion {
		return candidate instanceof IntegerQuestion;
	}
}
