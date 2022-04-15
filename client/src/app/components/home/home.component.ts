import { BaseRoute } from 'src/app/app-routing.module';
import { BaseComponent } from 'src/app/components/base.component';
import { AuthService } from 'src/app/services/auth.service';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent extends BaseComponent implements OnInit {
	private isLoggedIn = false;

	constructor(private readonly router: Router, private readonly authService: AuthService) {
		super();
	}

	ngOnInit(): void {
		this.subs.sink = this.authService.getLoggedUsername$().subscribe((username) => {
			this.isLoggedIn = !!username;
		});
	}

	onStartClick(): void {
		this.isLoggedIn
			? this.router.navigateByUrl(`/${BaseRoute.GAMES}`)
			: this.router.navigateByUrl(`/${BaseRoute.LOGIN}`);
	}
}
