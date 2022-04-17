import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
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
	constructor(private readonly authService: AuthService, private readonly router: Router) {
		this.subs.sink = authService
			.getLoggedUsername$()
			.subscribe((username) => (this.isLoggedIn = !!username));
	}

	canActivate(
		_route: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot
	): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		if (this.isLoggedIn) return true;

		// TODO: not logged in component
		this.router.navigate(['/login']);
		return false;
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}
}
