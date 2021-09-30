import { NextFunction, Request, Response, Router } from 'express';

import { HttpError } from '../errors/httpErrors/HttpError';
import { elog } from '../utils/Logger';

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
		} catch (error: unknown) {
			elog(error);
			next(new HttpError());
		}
	}
}

export type MiddlewareLogic = (
	req: Request,
	res: Response,
	next: NextFunction
) => void;
