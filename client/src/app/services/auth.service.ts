import moment from 'moment';

import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor() {}

	//TODO: validate response from server: { token: string; [key: string]: any }
	setLocalStorage(res: any): void {
		const expiresIn = moment().add(res.expiresIn).valueOf().toString();

		localStorage.setItem('token', res.token);
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
