import cors from 'cors';
import express, { json } from 'express';
import { connect } from 'mongoose';
import { Server } from 'socket.io';

import { Controller } from './controllers/Controller';
import { MakaoHandler } from './game/handlers/MakaoHandler';
import { errorMiddleware } from './middlewares/ErrorMiddleware';
import { elog } from './utils/Logger';

export class App {
	app: express.Application;

	constructor(controllers: Controller[]) {
		this.app = express();

		this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeControllers(controllers);
		this.initializeErrorHandlers();
	}

	private connectToDatabase(): void {
		const MONGO_USER = process.env.MONGO_USER;
		const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
		const MONGO_PATH = process.env.MONGO_PATH;

		const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;
		connect(mongoURI)
			.then(() => console.log('MongoDB Connected!'))
			.catch((error: Error) => elog(error));
	}

	private initializeMiddlewares(): void {
		this.app.use(json());
		this.app.use(cors());
	}

	private initializeControllers(controllers: Controller[]): void {
		controllers.forEach((controller) => {
			this.app.use(controller.path, controller.router);
		});
	}

	private initializeErrorHandlers(): void {
		this.app.use(errorMiddleware);
	}

	listen(): void {
		const listener = this.app.listen(process.env.PORT, () => {
			console.log(`App running!`);
		});

		const io = new Server(listener, {
			cors: {
				origin: [`http://localhost:${process.env.CLIENT_PORT}`], //TODO: for dev
			},
		});

		new MakaoHandler(io);
	}
}
