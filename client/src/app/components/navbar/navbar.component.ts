import { filter, map } from 'rxjs/operators';
import { BaseRoute } from 'src/app/app-routing.module';
import { SubSink } from 'subsink';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
	private subs = new SubSink();

	navRoutes = [BaseRoute.LOGIN, BaseRoute.REGISTER, BaseRoute.GAMES];
	navLabels = ['Login', 'Register', 'Games'];
	currentNavRoute: string = BaseRoute.HOME;
	selectedRoutes = new Set<string>();

	constructor(private router: Router) {}

	ngOnInit(): void {
		this.observeNavigation();
	}

	private observeNavigation(): void {
		this.subs.sink = this.router.events
			.pipe(
				filter(this.isEventNavigationEnd),
				map((event: NavigationEnd) => event.url.split('/')[1])
			)
			.subscribe((baseRoute) => {
				this.currentNavRoute = baseRoute;
				this.selectedRoutes.add(baseRoute);
			});
	}

	private isEventNavigationEnd(event: Event): event is NavigationEnd {
		return event instanceof NavigationEnd;
	}

	ngOnDestroy(): void {
		this.subs.unsubscribe();
	}
}
