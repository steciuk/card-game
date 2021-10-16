import { Router } from 'express';

export abstract class Controller {
	router = Router();
	abstract path: string;
}
