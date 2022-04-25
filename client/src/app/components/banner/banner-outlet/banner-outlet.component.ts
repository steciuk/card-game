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

// import { interval } from 'rxjs';
// import { BaseComponent } from 'src/app/components/base.component';
// import { BannerService } from 'src/app/services/banner.service';

// import {
// 	ChangeDetectionStrategy,
// 	ChangeDetectorRef,
// 	Component,
// 	ElementRef,
// 	OnInit
// } from '@angular/core';

// @Component({
// 	selector: 'app-banner-outlet',
// 	templateUrl: './banner-outlet.component.html',
// 	styleUrls: ['./banner-outlet.component.scss'],
// 	changeDetection: ChangeDetectionStrategy.OnPush,
// })
// export class BannerOutletComponent extends BaseComponent implements OnInit {
// 	// private bannerId = 0;
// 	fadeTimeSeconds = 0.5;

// 	banners: BannerMock[] = [];
// 	private bannerId = 0;

// 	constructor(
// 		private readonly bannerService: BannerService,
// 		private readonly cdRef: ChangeDetectorRef,
// 		private readonly elementRef: ElementRef
// 	) {
// 		super();
// 	}

// 	ngOnInit(): void {
// 		this.observeBanners();
// 	}

// 	private observeBanners(): void {
// 		// this.bannerService.getBanner$().subscribe((banner) => {});
// 		interval(2000).subscribe((num) => {
// 			this.banners = this.banners.map((banner) => {
// 				banner.isIn = false;
// 				banner.isOut = false;
// 				banner.moveDown = true;
// 				banner.moveUp = false;
// 				return { ...banner };
// 			});

// 			this.banners.unshift({
// 				num: num,
// 				id: this.bannerId,
// 				isIn: true,
// 				isOut: false,
// 				moveDown: false,
// 				moveUp: false,
// 			});
// 			this.bannerId++;
// 			this.cdRef.detectChanges();
// 		});
// 	}

// 	closeBanner(bannerId: number): void {
// 		const bannerPosition = this.banners.findIndex((banner) => banner.id === bannerId);
// 		if (bannerPosition < 0) return;

// 		const bannerToRemove = this.banners[bannerPosition];
// 		bannerToRemove.isOut = true;
// 		this.banners[bannerPosition] = { ...bannerToRemove };

// 		this.banners = this.banners.map((banner, index) => {
// 			if (index <= bannerPosition) return banner;
// 			banner.isIn = false;
// 			banner.isOut = false;
// 			banner.moveDown = false;
// 			banner.moveUp = true;
// 			return { ...banner };
// 		});

// 		this.removeBanner(bannerId);

// 		this.cdRef.detectChanges();
// 	}

// 	private removeBanner(bannerId: number): void {
// 		setTimeout(() => {
// 			const bannerPosition = this.banners.findIndex((banner) => banner.id === bannerId);
// 			if (bannerPosition < 0) return;

// 			this.banners.splice(bannerPosition, 1);
// 			this.cdRef.detectChanges();
// 		}, this.fadeTimeSeconds * 1000);
// 	}
// }

// type BannerMock = {
// 	num: number;

// 	id: number;

// 	isIn: boolean;
// 	isOut: boolean;
// 	moveDown: boolean;
// 	moveUp: boolean;
// };
