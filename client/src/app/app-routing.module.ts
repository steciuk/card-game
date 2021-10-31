import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GamesComponent } from './components/games/games/games.component';
import { MakaoComponent } from './components/games/makao/makao.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	// TODO: implement as child routes
	{
		path: 'games',
		component: GamesComponent,
	},
	{
		path: 'games/makao/:id',
		component: MakaoComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
