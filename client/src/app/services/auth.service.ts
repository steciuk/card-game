import moment, { DurationInputArg2 } from 'moment';
import { BehaviorSubject, Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { LoginDTO } from '../logic/DTO/loginDTO';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private router: Router) {}
	username = this.getUsernameFromLocalStorage();
	private username$ = new BehaviorSubject<string>(this.username);

	//TODO: validate response from server: ResponseWithJWT
	setLocalStorage(response: LoginDTO): void {
		const timeAmount = parseInt(response.expiresIn[0]);
		const timeUnit = response.expiresIn[1] as DurationInputArg2;
		const expiresIn = moment().add(timeAmount, timeUnit).toISOString();

		localStorage.setItem('username', response.user.username);
		localStorage.setItem('token', response.token);
		localStorage.setItem('expiresIn', expiresIn);
		this.username = response.user.username;
		this.emitUsername(this.username);
	}

	isLoggedIn(): boolean {
		const expiresIn = localStorage.getItem('expiresIn');
		const isTokenValid = !!expiresIn && moment().isBefore(expiresIn);
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
		localStorage.removeItem('expiresIn');
		this.emitUsername('');
		this.router.navigateByUrl('/login');
	}

	getUsername$(): Subject<string> {
		return this.username$;
	}

	private emitUsername = (username: string): void => this.username$.next(username);
}
