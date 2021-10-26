import moment from 'moment';

import { Injectable } from '@angular/core';

import { AuthFormResponse } from '../components/auth-form/authFormResponse';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	username?: string;

	constructor() {}

	//TODO: validate response from server: ResponseWithJWT
	setLocalStorage(response: AuthFormResponse): void {
		const expiresIn = moment().add(response.expiresIn).valueOf().toString();

		localStorage.setItem('username', response.user.username);
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
		localStorage.removeItem('username');
	}
}
