import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../errors/httpErrors/HttpError';

export function errorMiddleware(
	error: HttpError,
	req: Request,
	res: Response,
	next: NextFunction
) {
	const status = error.status;
	const message = error.message;
	res.status(status).send({ status, message });
}
