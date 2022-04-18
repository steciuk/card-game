import { BehaviorSubject, Observable } from 'rxjs';
import { BaseRoute } from 'src/app/app-routing.module';
import { LoginDTO, ParsedJwtPayload } from 'src/app/logic/DTO/loginDTO';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private loggedUser$: BehaviorSubject<string | null>;

	constructor(private router: Router) {
		this.loggedUser$ = new BehaviorSubject<string | null>(null);
		this.init();
	}

	private init(): void {
		const username = localStorage.getItem(LocalStorageItems.USERNAME);
		const token = localStorage.getItem(LocalStorageItems.TOKEN);
		const expiresOn = localStorage.getItem(LocalStorageItems.EXPIRES_ON);

		const isTokenValid = !!expiresOn && !!token && !!username && Date.now() <= parseInt(expiresOn);
		if (isTokenValid) {
			this.loggedUser$.next(username);
		} else this.logout(false);
	}

	//TODO: validate response from server: ResponseWithJWT
	setLocalStorage(response: LoginDTO): void {
		const jwtPayload = this.getDecodedJwtPayload(response.token);
		const username = response.user.username;

		localStorage.setItem(LocalStorageItems.USERNAME, username);
		localStorage.setItem(LocalStorageItems.TOKEN, response.token);
		localStorage.setItem(LocalStorageItems.EXPIRES_ON, (jwtPayload.iat + jwtPayload.exp).toString());

		this.loggedUser$.next(username);
	}

	logout(navigateToHome = true): void {
		localStorage.removeItem(LocalStorageItems.USERNAME);
		localStorage.removeItem(LocalStorageItems.TOKEN);
		localStorage.removeItem(LocalStorageItems.EXPIRES_ON);

		this.loggedUser$.next(null);
		if (navigateToHome) this.router.navigateByUrl(`/${BaseRoute.HOME}`);
	}

	getLoggedUsername$(): Observable<string | null> {
		return this.loggedUser$.asObservable();
	}

	private getDecodedJwtPayload(token: string): ParsedJwtPayload {
		return JSON.parse(atob(token.split(' ')[1].split('.')[1]));
	}
}

enum LocalStorageItems {
	USERNAME = 'username',
	TOKEN = 'token',
	EXPIRES_ON = 'expiresOn',
}
