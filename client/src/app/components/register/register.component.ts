import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
	submitUrl = '/users/register';

	constructor() {}

	ngOnInit(): void {}
}
