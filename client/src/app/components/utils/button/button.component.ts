import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output
} from '@angular/core';

@Component({
	selector: 'app-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
	@Input() text = '';
	@Input() color = '0068B4';
	@Input() type: ButtonType = 'button';
	@Output() btnClick = new EventEmitter();
	@Input() isDisabled = false;
	@Input() size: ButtonSize = 'm';

	onClick(): void {
		this.btnClick.emit();
	}
}

type ButtonType = 'button' | 'reset' | 'submit';
type ButtonSize = 's' | 'm' | 'l';
