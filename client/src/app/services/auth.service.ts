import moment from 'moment';

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor() {}

	//TODO: validate response from server: ResponseWithJWT
	setLocalStorage(response: any): void {
		const expiresIn = moment().add(response.expiresIn).valueOf().toString();

		localStorage.setItem('token', response.token);
		localStorage.setItem('expiresIn', expiresIn);
	}

	isLoggedIn(): boolean {
		const expiresIn = localStorage.getItem('expiresIn');

		return !!expiresIn && moment().isBefore(moment(expiresIn));
	}

	logout(): void {
		localStorage.removeItem('token');
		localStorage.removeItem('expiresIn');
	}
}

// type ResponseWithJWT = { token: string; expiresIn: string; [key: string]: unknown };
