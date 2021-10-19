import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	submitUrl = '/users/login';

	constructor() {}

	ngOnInit(): void {}
}
