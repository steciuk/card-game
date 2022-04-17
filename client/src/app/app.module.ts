import { PhaserModule } from 'phaser-component-library';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { GameCardComponent } from './components/games/game-card/game-card.component';
import { GameScreenComponent } from './components/games/game-screen/game-screen.component';
import { GamesComponent } from './components/games/games/games.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { RegisterComponent } from './components/register/register.component';
import { ButtonComponent } from './components/utils/button/button.component';
import { FormComponent } from './components/utils/form/form.component';
import { IntQuestionComponent } from './components/utils/form/questions/int-question/int-question.component';
import { QuestionComponent } from './components/utils/form/questions/question.component';
import { SelectQuestionComponent } from './components/utils/form/questions/select-question/select-question.component';
import { LogoComponent } from './components/utils/logo/logo.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NewGameComponent } from './components/games/new-game/new-game.component';

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		AuthFormComponent,
		LogoutComponent,
		GameScreenComponent,
		GamesComponent,
		GameCardComponent,
		NotFoundComponent,
		HomeComponent,
		NavbarComponent,
		LogoComponent,
		ButtonComponent,
		FormComponent,
		QuestionComponent,
		IntQuestionComponent,
		SelectQuestionComponent,
  NewGameComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		PhaserModule,
		FormsModule,
		HttpClientModule,
		ReactiveFormsModule,
	],
	providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
	bootstrap: [AppComponent],
})
export class AppModule {}
