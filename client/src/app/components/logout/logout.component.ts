import { AuthService } from 'src/app/services/auth.service';
import { SubSink } from 'subsink';

import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit
} from '@angular/core';

@Component({
	selector: 'app-logout',
	templateUrl: './logout.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit, OnDestroy {
	private subs = new SubSink();
	username = '';
	isLoggedIn = false;

	constructor(private readonly authService: AuthService, private readonly cdRef: ChangeDetectorRef) {}

	ngOnInit(): void {
		this.subs.sink = this.authService.getLoggedUsername$().subscribe((username) => {
			if (username) {
				this.isLoggedIn = true;
				this.username = username;
			} else {
				this.isLoggedIn = false;
				this.username = '';
			}
			this.cdRef.detectChanges();
		});
	}

	onLogout(): void {
		this.authService.logout();
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}
}
