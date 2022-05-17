import { Observable } from 'rxjs';
import { LocalStorageItem } from 'src/app/services/auth.service';

import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor() {}

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const token = localStorage.getItem(LocalStorageItem.TOKEN);
		if (token) {
			const requestWithAuthHeader = request.clone({
				headers: request.headers.set('Authorization', token).set('Content-type', 'application/json'),
			});

			return next.handle(requestWithAuthHeader);
		} else return next.handle(request);
	}
}
