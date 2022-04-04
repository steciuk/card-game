import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameScreenComponent } from './components/games/game-screen/game-screen.component';
import { GamesComponent } from './components/games/games/games.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';

export enum Route {
	HOME = '',
	LOGIN = 'login',
	REGISTER = 'register',
	GAMES = 'games',
}

const routes: Routes = [
	{ path: Route.HOME, component: HomeComponent },
	{ path: Route.LOGIN, component: LoginComponent },
	{ path: Route.REGISTER, component: RegisterComponent },
	// TODO: implement as child routes
	{ path: Route.GAMES, component: GamesComponent },
	{ path: 'games/makao/:id', component: GameScreenComponent },
	{ path: '404', component: NotFoundComponent },
	{ path: '**', redirectTo: '/404' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
