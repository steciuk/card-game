import { HttpService } from 'src/app/services/http.service';

import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './protected.component.html',
	styleUrls: ['./protected.component.scss'],
})
export class ProtectedComponent implements OnInit {
	private getUrl = '/users/protected';
	message?: string;

	constructor(private http: HttpService) {}

	ngOnInit(): void {
		this.http.get(this.getUrl).subscribe(
			(response: any) => {
				this.message = response.message;
			},
			(error: any) => {
				if (error.status === 401) this.message = 'You are not authorized!';
				else console.log(error);
			},
			() => {}
		);
	}
}
