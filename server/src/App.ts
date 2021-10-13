import express, { json } from 'express';
import { connect } from 'mongoose';
import passport from 'passport';

import { Controller } from './controllers/Controller';
import { configurePassport } from './lib/passport/PassportConfig';
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

	private connectToDatabase() {
		const MONGO_USER = process.env.MONGO_USER;
		const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
		const MONGO_PATH = process.env.MONGO_PATH;

		const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`;
		connect(mongoURI)
			.then(() => console.log('MongoDB Connected...'))
			.catch((error: Error) => elog(error));
	}

	private initializeMiddlewares(): void {
		this.app.use(json());
		configurePassport(passport);
		this.app.use(passport.initialize());
		// this.app.use(cors());
	}

	private initializeControllers(controllers: Controller[]): void {
		controllers.forEach((controller) => {
			this.app.use('/', controller.router);
		});
	}

	private initializeErrorHandlers(): void {
		this.app.use(errorMiddleware);
	}

	listen(): void {
		this.app.listen(process.env.PORT, () => {
			console.log(`App running!`);
		});
	}
}
