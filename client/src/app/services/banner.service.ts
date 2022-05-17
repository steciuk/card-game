import { Observable, ReplaySubject } from 'rxjs';
import { Banner } from 'src/app/components/banner/domain/bannerConfig';

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class BannerService {
	private readonly banners$ = new ReplaySubject<Banner>();

	showBanner(banner: Banner): void {
		this.banners$.next(banner);
	}

	getBanner$(): Observable<Banner> {
		return this.banners$.asObservable();
	}
}
