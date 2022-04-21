import { BaseComponent } from 'src/app/components/base.component';
import { AuthService } from 'src/app/services/auth.service';

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
export class LogoutComponent extends BaseComponent implements OnInit, OnDestroy {
	username = '';
	isLoggedIn = false;

	constructor(private readonly authService: AuthService, private readonly cdRef: ChangeDetectorRef) {
		super();
	}

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
}
