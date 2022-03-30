import { AuthService } from 'src/app/services/auth.service';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit, OnDestroy {
	private subs = new SubSink();
	textToDisplay = '';

	constructor(private authService: AuthService) {}

	ngOnInit(): void {
		this.subs.sink = this.authService.getLoggedUsername$().subscribe(
			(username) => {
				this.textToDisplay = username ? `Logged as: ${username}` : 'Not logged';
			},
			(error) => console.error(error),
			() => {}
		);
	}

	onLogout(): void {
		this.authService.logout();
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}
}
