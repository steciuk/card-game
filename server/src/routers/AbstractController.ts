import { Router } from 'express';

export abstract class AbstractController {
	router: Router;

	protected constructor(protected path: string) {
		this.router = Router();
	}

	abstract initializeRoutes(): void;
}
