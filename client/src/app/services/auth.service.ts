import { BehaviorSubject, Observable } from 'rxjs';
import { BaseRoute } from 'src/app/app-routing.module';
import {
	InfoBanner,
	WarningBanner
} from 'src/app/components/banner/domain/bannerConfig';
import { LoginDTO, ParsedJwtPayload } from 'src/app/logic/DTO/loginDTO';
import { BannerService } from 'src/app/services/banner.service';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private loggedUser$ = new BehaviorSubject<string | null>(null);

	constructor(private readonly router: Router, private readonly bannerService: BannerService) {
		this.init();
	}

	private init(): void {
		const username = localStorage.getItem(LocalStorageItem.USERNAME);
		const token = localStorage.getItem(LocalStorageItem.TOKEN);
		const expiresOn = localStorage.getItem(LocalStorageItem.EXPIRES_ON);

		const isTokenValid =
			!!expiresOn && !!token && !!username && this.epochInSeconds <= parseInt(expiresOn);
		if (isTokenValid) {
			this.loggedUser$.next(username);
		} else this.clearLocalStorage();
	}

	//TODO: validate response from server: ResponseWithJWT
	setLocalStorage(response: LoginDTO): void {
		const jwtPayload = this.getDecodedJwtPayload(response.token);
		const username = response.user.username;

		localStorage.setItem(LocalStorageItem.USERNAME, username);
		localStorage.setItem(LocalStorageItem.TOKEN, response.token);
		localStorage.setItem(LocalStorageItem.EXPIRES_ON, jwtPayload.exp.toString());

		this.loggedUser$.next(username);
	}

	logout(): void {
		this.clearLocalStorage();
		this.bannerService.showBanner(new InfoBanner('You are logged out'));
		this.router.navigate([BaseRoute.HOME]);
	}

	sessionExpired(): void {
		this.clearLocalStorage();
		this.bannerService.showBanner(new WarningBanner('Your session has expired. Please log in again'));
		this.router.navigate([BaseRoute.LOGIN]);
	}

	getLoggedUsername$(): Observable<string | null> {
		return this.loggedUser$.asObservable();
	}

	private clearLocalStorage(): void {
		localStorage.removeItem(LocalStorageItem.USERNAME);
		localStorage.removeItem(LocalStorageItem.TOKEN);
		localStorage.removeItem(LocalStorageItem.EXPIRES_ON);

		this.loggedUser$.next(null);
	}

	private getDecodedJwtPayload(token: string): ParsedJwtPayload {
		return JSON.parse(atob(token.split(' ')[1].split('.')[1]));
	}

	private get epochInSeconds(): number {
		return Math.round(Date.now() / 1000);
	}
}

export enum LocalStorageItem {
	USERNAME = 'username',
	TOKEN = 'token',
	EXPIRES_ON = 'expiresOn',
}
