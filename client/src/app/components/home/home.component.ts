import { BaseRoute } from 'src/app/app-routing.module';

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
	constructor(private readonly router: Router) {}

	redirectToGames(): void {
		this.router.navigateByUrl(`/${BaseRoute.GAMES}`);
	}
}
