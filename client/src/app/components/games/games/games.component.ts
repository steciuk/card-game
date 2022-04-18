import { BaseComponent } from 'src/app/components/base.component';
import { GameDTO } from 'src/app/logic/DTO/gameDTO';
import { HttpService } from 'src/app/services/http.service';

import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-games',
	templateUrl: './games.component.html',
	styleUrls: ['./games.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent extends BaseComponent implements OnInit, OnDestroy {
	currentGames: GameDTO[] = [];

	constructor(
		private readonly http: HttpService,
		private readonly router: Router,
		private readonly cdRef: ChangeDetectorRef
	) {
		super();
	}

	ngOnInit(): void {
		this.refreshGames();
	}

	onCreateGame(): void {
		this.router.navigate(['games', 'new']);
	}

	refreshGames(): void {
		this.subs.sink = this.http.get<GameDTO[]>('/games').subscribe((response) => {
			this.currentGames = response;
			this.cdRef.detectChanges();
		});
	}
}
