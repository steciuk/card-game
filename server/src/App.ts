import express from 'express';
import { json } from 'express';
import mongoose from 'mongoose';

import { AbstractController } from './routers/AbstractController';

export class App {
	app: express.Application;

	constructor(controllers: AbstractController[]) {
		this.app = express();

		this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
	}

	private connectToDatabase() {
		const MONGO_USER = process.env.MONGO_USER;
		const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
		const MONGO_PATH = process.env.MONGO_PATH;

		const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;
		mongoose
			.connect(mongoURI)
			.then(() => console.log('MongoDB Connected...'))
			.catch((err) => console.log(err));
	}

	private initializeMiddlewares(): void {
		this.app.use(json());
	}

	private initializeControllers(controllers: AbstractController[]): void {
		controllers.forEach((controller) => {
			this.app.use('/', controller.router);
		});
	}

	listen(): void {
		this.app.listen(process.env.PORT, () => {
			console.log(`App running!`);
		});
	}
}