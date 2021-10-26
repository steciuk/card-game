import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
	submitUrl = '/users/register';

	constructor() {}

	ngOnInit(): void {}
}
