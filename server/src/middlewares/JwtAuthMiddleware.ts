import { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '../errors/httpErrors/user/UnauthorizedError';
import { validateJWT } from '../utils/authorization/Jwt';
import { elog } from '../utils/Logger';

export function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
	if (!req.headers.authorization) return next(new UnauthorizedError());

	try {
		const jwt = validateJWT(req.headers.authorization);
		// TODO: save expires in to database and check if not expired?
		// TODO: check if user still exists in database
		req.jwt = jwt;
		next();
	} catch (error) {
		elog(error);
		return next(new UnauthorizedError());
	}
}
