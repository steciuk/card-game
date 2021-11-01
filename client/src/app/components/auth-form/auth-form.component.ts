import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthFormResponse } from './authFormResponse';

@Component({
	selector: 'app-auth-form',
	templateUrl: './auth-form.component.html',
	styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnInit {
	@Input() submitUrl!: string;

	constructor(private http: HttpService, private authService: AuthService, private router: Router) {}

	ngOnInit(): void {}

	onSubmit(form: NgForm): void {
		this.http.post<AuthFormResponse>(this.submitUrl, form.value).subscribe(
			(response) => {
				this.authService.setLocalStorage(response);
				this.router.navigateByUrl('/games');
			},
			(error) => {
				console.log(error);
			},
			() => {}
		);
	}
}
