import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MakaoComponent } from './components/games/makao/makao.component';
import { LoginComponent } from './components/login/login.component';
import { ProtectedComponent } from './components/protected/protected.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'protected', component: ProtectedComponent },
	{ path: 'makao', component: MakaoComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { useHash: true })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
