import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
	templateUrl: './protected.component.html',
	styleUrls: ['./protected.component.scss'],
})
export class ProtectedComponent implements OnInit {
	constructor(private http: HttpClient) {}

	ngOnInit(): void {
		// this.http.get('/users/protected').subscribe;
	}
}
