import { Component, OnInit } from '@angular/core';

import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	//TODO: Change to observable
	username = '';

	constructor(private authService: AuthService) {}

	ngOnInit(): void {
		this.checkIfLoggedIn();
	}

	checkIfLoggedIn(): void {
		if (this.authService.isLoggedIn()) this.username = this.authService.getUsernameFromLocalStorage();
	}

	logout(): void {
		this.authService.logout();
		this.username = '';
	}
}
