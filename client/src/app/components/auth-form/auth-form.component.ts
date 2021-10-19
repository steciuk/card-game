import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

import { HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
	selector: 'app-auth-form',
	templateUrl: './auth-form.component.html',
	styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
	@Input() submitUrl!: string;

	constructor(private http: HttpService, private authService: AuthService) {}

	ngOnInit(): void {}

	onSubmit(form: NgForm): void {
		const headers = new HttpHeaders({ 'Content-type': 'application/json' });

		this.http.post(this.submitUrl, form.value, { headers: headers }).subscribe(
			(response) => {
				this.authService.setLocalStorage(response);
				console.log('response', response);
			},
			(error) => {
				console.log('error', error);
			},
			() => {
				console.log('Done!');
			}
		);
	}
}
