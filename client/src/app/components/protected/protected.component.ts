import { HttpService } from 'src/app/services/http.service';

import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './protected.component.html',
})
export class ProtectedComponent implements OnInit {
	private getUrl = '/users/protected';
	message?: string;

	constructor(private http: HttpService) {}

	ngOnInit(): void {
		this.http.get<{ message: string }>(this.getUrl).subscribe(
			(response) => {
				this.message = response.message;
			},
			(error) => {
				if (error.status === 401) this.message = 'You are not authorized!';
				else console.log(error);
			},
			() => {}
		);
	}
}
