import { NewGameComponent } from 'src/app/components/games/new-game/new-game.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GamesComponent } from './components/games/games/games.component';
import { MakaoComponent } from './components/games/makao/makao.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';

export enum BaseRoute {
	HOME = '',
	LOGIN = 'login',
	REGISTER = 'register',
	GAMES = 'games',
}

const routes: Routes = [
	{ path: BaseRoute.HOME, component: HomeComponent },
	{ path: BaseRoute.LOGIN, component: LoginComponent },
	{ path: BaseRoute.REGISTER, component: RegisterComponent },

	{ path: BaseRoute.GAMES, component: GamesComponent, canActivate: [AuthGuardService] },
	{ path: `${BaseRoute.GAMES}/new`, component: NewGameComponent, canActivate: [AuthGuardService] },
	{ path: `${BaseRoute.GAMES}/makao/:id`, component: MakaoComponent, canActivate: [AuthGuardService] },

	{ path: '404', component: NotFoundComponent },
	{ path: '**', redirectTo: '/404' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
