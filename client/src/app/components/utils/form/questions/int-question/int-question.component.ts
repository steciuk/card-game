import { BaseQuestion } from 'src/app/components/utils/form/domain/baseQuestion';
import { IntegerQuestion } from 'src/app/components/utils/form/domain/question-types/integerQuestion';

import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnInit
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'app-int-question',
	templateUrl: './int-question.component.html',
	styleUrls: ['./int-question.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: IntQuestionComponent,
		},
	],
})
export class IntQuestionComponent implements OnInit, ControlValueAccessor {
	@Input() set question(question: BaseQuestion<unknown>) {
		this._question = question as IntegerQuestion;
	}
	_question!: IntegerQuestion;

	private minValue = 0;
	private maxValue = 0;
	value = 0;

	decrementEnabled = true;
	incrementEnabled = true;

	onChange = (_value: number): void => {};
	onTouched = (): void => {};
	private touched = false;
	private disabled = false;

	constructor(private readonly cdRef: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.minValue = this._question.minValue;
		this.maxValue = this._question.maxValue;
		this.checkButtonsEnabled();
	}

	writeValue(value: number): void {
		this.value = value;
		this.checkButtonsEnabled();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	registerOnChange(onChange: any): void {
		this.onChange = onChange;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	registerOnTouched(onTouched: any): void {
		this.onTouched = onTouched;
	}

	setDisabledState(disabled: boolean): void {
		this.disabled = disabled;
	}

	increment(): void {
		this.markAsTouched();
		if (this.value >= this.maxValue) return;

		this.value++;
		this.checkButtonsEnabled();
		this.onChange(this.value);
	}

	decrement(): void {
		this.markAsTouched();
		if (this.value <= this.minValue) return;

		this.value--;
		this.checkButtonsEnabled();
		this.onChange(this.value);
	}

	private checkButtonsEnabled(): void {
		this.decrementEnabled = !this.disabled && this.value > this.minValue;
		this.incrementEnabled = !this.disabled && this.value < this.maxValue;
	}

	private markAsTouched(): void {
		if (!this.touched) {
			this.onTouched();
			this.touched = true;
		}
	}
}
