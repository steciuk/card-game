import { Router } from 'express';

export abstract class Controller {
	router = Router();
	protected abstract path: string;
}
