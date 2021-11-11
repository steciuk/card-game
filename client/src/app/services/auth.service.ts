import moment, { DurationInputArg2 } from 'moment';

import { Injectable } from '@angular/core';

import { LoginDTO } from '../logic/DTO/loginDTO';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor() {}

	//TODO: validate response from server: ResponseWithJWT
	setLocalStorage(response: LoginDTO): void {
		const timeAmount = parseInt(response.expiresIn[0]);
		const timeUnit = response.expiresIn[1] as DurationInputArg2;
		const expiresIn = moment().add(timeAmount, timeUnit).toISOString();

		localStorage.setItem('username', response.user.username);
		localStorage.setItem('token', response.token);
		localStorage.setItem('expiresIn', expiresIn);
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
	}
}
