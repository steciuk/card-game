import { AuthService } from 'src/app/services/auth.service';

import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
})
export class LogoutComponent implements OnInit {
	username?: string;

	constructor(private authService: AuthService) {}

	ngOnInit(): void {
		const username = localStorage.getItem('username');
		console.log(username);
		if (username) this.username = username;
	}

	onClick(): void {
		this.authService.logout();
	}
}
