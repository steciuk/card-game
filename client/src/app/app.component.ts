import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	//TODO: Change to observable
	username = '';

	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit(): void {}

	logout(): void {
		this.authService.logout();
		this.username = '';
	}
}
