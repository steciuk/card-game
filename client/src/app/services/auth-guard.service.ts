import { Observable } from 'rxjs';
import { ErrorBanner } from 'src/app/components/banner/domain/bannerConfig';
import { AuthService } from 'src/app/services/auth.service';
import { BannerService } from 'src/app/services/banner.service';
import { SubSink } from 'subsink';

import { Injectable, OnDestroy } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree
} from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthGuardService implements CanActivate, OnDestroy {
	private subs = new SubSink();
	private isLoggedIn = false;

	// TODO: session expired
	constructor(
		private readonly authService: AuthService,
		private readonly router: Router,
		private readonly bannerService: BannerService
	) {
		this.subs.sink = authService
			.getLoggedUsername$()
			.subscribe((username) => (this.isLoggedIn = !!username));
	}

	canActivate(
		_route: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot
	): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		if (this.isLoggedIn) return true;

		this.bannerService.showBanner(new ErrorBanner('You have to be logged in to access this page'));
		this.router.navigate(['/login']);
		return false;
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}
}
