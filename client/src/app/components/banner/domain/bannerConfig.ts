export enum BannerType {
	INFO,
	WARN,
	ERROR,
}

export abstract class Banner {
	abstract bannerType: BannerType;
	constructor(public readonly message: string, public readonly showFor: number = 3) {}
}

export class InfoBanner extends Banner {
	bannerType = BannerType.INFO;
}

export class WarningBanner extends Banner {
	bannerType = BannerType.WARN;
}

export class ErrorBanner extends Banner {
	bannerType = BannerType.ERROR;

	static forUnknownError(errorCode?: number): ErrorBanner {
		return new ErrorBanner(`${errorCode}: Something went wrong.`);
	}
}
