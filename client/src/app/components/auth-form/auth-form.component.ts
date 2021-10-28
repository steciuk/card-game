import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthFormResponse } from './authFormResponse';

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
		this.http.post<AuthFormResponse>(this.submitUrl, form.value).subscribe(
			(response) => {
				this.authService.setLocalStorage(response);
			},
			(error) => {
				console.log(error);
			},
			() => {}
		);
	}
}
