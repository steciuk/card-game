import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
	@Input() text = '';
	@Input() color = '0068B4';
	@Input() type = 'button';
	@Output() btnClick = new EventEmitter();
	@Input() isDisabled = false;

	constructor() {}

	onClick(): void {
		this.btnClick.emit();
	}
}
