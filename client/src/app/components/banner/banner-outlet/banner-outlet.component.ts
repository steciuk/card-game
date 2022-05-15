import {
	Banner,
	BannerType
} from 'src/app/components/banner/domain/bannerConfig';
import { BaseComponent } from 'src/app/components/base.component';
import { BannerService } from 'src/app/services/banner.service';

import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnInit
} from '@angular/core';

@Component({
	selector: 'app-banner-outlet',
	templateUrl: './banner-outlet.component.html',
	styleUrls: ['./banner-outlet.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BannerOutletComponent extends BaseComponent implements OnInit {
	bannerFadeAnimationTime = 0.5;
	BannerType = BannerType;

	banners: BannerWithId[] = [];
	private bannerId = 0;

	constructor(private readonly bannerService: BannerService, private readonly cdRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit(): void {
		this.observeBanners();
	}

	private observeBanners(): void {
		this.subs.sink = this.bannerService.getBanner$().subscribe((banner: Banner) => {
			const bannerId = this.bannerId;
			this.banners.unshift({ ...banner, id: bannerId, state: 'in' });
			this.cdRef.detectChanges();

			if (banner.showFor > 0) {
				setTimeout(() => this.closeBanner(bannerId), banner.showFor * 1000);
			}
			this.bannerId++;
		});
	}

	closeBanner(bannerId: number): void {
		const bannerPosition = this.banners.findIndex((banner) => banner.id === bannerId);
		if (bannerPosition < 0) return;

		this.banners[bannerPosition].state = 'out';
		this.cdRef.detectChanges();

		setTimeout(() => {
			const bannerPosition = this.banners.findIndex((banner) => banner.id === bannerId);
			if (bannerPosition < 0) return;

			this.banners.splice(bannerPosition, 1);
			this.cdRef.detectChanges();
		}, this.bannerFadeAnimationTime * 1000);
	}
}

type BannerWithId = Banner & {
	id: number;
	state: 'in' | 'out';
};
