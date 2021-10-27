import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {
	@Input() username!: string;
	@Output() logoutEvent = new EventEmitter<void>();

	constructor() {}

	ngOnInit(): void {}

	onLogout(): void {
		this.logoutEvent.emit();
	}
}
