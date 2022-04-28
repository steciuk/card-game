import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class HttpService {
	private baseUrl = environment.serverUrl;

	constructor(private readonly http: HttpClient, private readonly authService: AuthService) {}

	public get<T>(endPoint: string, options?: RequestOptions): Observable<T> {
		return this.http.get<T>(this.baseUrl + endPoint, options).pipe(
			catchError((err) => {
				return this.handleError(err);
			})
		);
	}

	public post<T>(endPoint: string, req: unknown, options?: RequestOptions): Observable<T> {
		return this.http.post<T>(this.baseUrl + endPoint, req, options).pipe(
			catchError((err) => {
				return this.handleError(err);
			})
		);
	}

	public put<T>(endPoint: string, req: unknown, options?: RequestOptions): Observable<T> {
		return this.http.put<T>(this.baseUrl + endPoint, req, options).pipe(
			catchError((err) => {
				return this.handleError(err);
			})
		);
	}

	public delete<T>(endPoint: string, options?: RequestOptions): Observable<T> {
		return this.http.delete<T>(this.baseUrl + endPoint, options).pipe(
			catchError((err) => {
				return this.handleError(err);
			})
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private handleError(err: any): Observable<never> {
		if (err.status === 440) {
			this.authService.sessionExpired();
		}

		return throwError(err);
	}
}

export type HttpError = {
	status: number;
	message: string;
};

interface RequestOptions {
	headers?: HttpHeaders;
	observe?: 'body';
	params?: HttpParams;
	reportProgress?: boolean;
	responseType?: 'json';
	withCredentials?: boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	body?: any;
}
