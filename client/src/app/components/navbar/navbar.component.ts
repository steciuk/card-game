import { filter, map } from 'rxjs/operators';
import { BaseRoute } from 'src/app/app-routing.module';

import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit
} from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';

import { BaseComponent } from '../base.component';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent extends BaseComponent implements OnInit {
	navRoutes = [BaseRoute.LOGIN, BaseRoute.REGISTER, BaseRoute.GAMES];
	navLabels = ['Log in', 'Register', 'Games'];
	currentNavRoute: string = BaseRoute.HOME;
	selectedRoutes = new Set<string>();

	constructor(private router: Router, private cdRef: ChangeDetectorRef) {
		super();
	}

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
				this.cdRef.detectChanges();
			});
	}

	private isEventNavigationEnd(event: Event): event is NavigationEnd {
		return event instanceof NavigationEnd;
	}
}
