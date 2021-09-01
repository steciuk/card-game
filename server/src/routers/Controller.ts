import { Router } from 'express';
import { HttpError } from '../errors/HttpError';
import { NextFunction, Request, Response } from 'express';

export abstract class Controller {
	abstract router: Router;
	abstract path: string;

	// TODO: change to decorator?
	protected async handleRequest(
		req: Request,
		res: Response,
		next: NextFunction,
		logic: MiddlewareLogic
	) {
		try {
			await logic(req, res, next);
		} catch (error) {
			console.log(error);
			next(new HttpError());
		}
	}
}

export type MiddlewareLogic = (
	req: Request,
	res: Response,
	next: NextFunction
) => void;
