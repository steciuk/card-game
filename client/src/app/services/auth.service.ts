import { BehaviorSubject, Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { LoginDTO, ParsedJwtPayload } from '../logic/DTO/loginDTO';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private router: Router) {}
	username = this.getUsernameFromLocalStorage();
	private username$ = new BehaviorSubject<string>(this.username);

	//TODO: validate response from server: ResponseWithJWT
	setLocalStorage(response: LoginDTO): void {
		const jwtPayload = this.getDecodedJwtPayload(response.token);

		localStorage.setItem('username', response.user.username);
		localStorage.setItem('token', response.token);
		localStorage.setItem('expiresOn', (jwtPayload.iat + jwtPayload.exp).toString());
		this.username = response.user.username;
		this.emitUsername(this.username);
	}

	isLoggedIn(): boolean {
		// TODO: if token expired ask to log in again
		const expiresOn = localStorage.getItem('expiresOn');
		const isTokenValid = !!expiresOn && Date.now() <= parseInt(expiresOn);

		if (!isTokenValid) {
			this.logout();
			return false;
		}

		return true;
	}

	getUsernameFromLocalStorage(): string {
		const username = localStorage.getItem('username');
		return username ? username : '';
	}

	logout(): void {
		localStorage.removeItem('username');
		localStorage.removeItem('token');
		localStorage.removeItem('expiresOn');
		this.emitUsername('');
		this.router.navigateByUrl('/login');
	}

	getUsername$(): Subject<string> {
		return this.username$;
	}

	private getDecodedJwtPayload(token: string): ParsedJwtPayload {
		return JSON.parse(atob(token.split(' ')[1].split('.')[1]));
	}

	private emitUsername = (username: string): void => this.username$.next(username);
}
