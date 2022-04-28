import { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '../errors/httpErrors/user/UnauthorizedError';
import { SessionExpiredError } from '../errors/httpErrors/user/UnauthorizedError copy';
import { JwtValidationError, validateJWT } from '../utils/authorization/Jwt';
import { elog } from '../utils/Logger';

export function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
	if (!req.headers.authorization) return next(new UnauthorizedError());

	const validationResult = validateJWT(req.headers.authorization);
	if (validationResult.success) {
		req.jwt = validationResult.payload;
		return next();
	} else if (validationResult.error === JwtValidationError.EXPIRED) {
		elog(validationResult.error);
		return next(new SessionExpiredError());
	} else {
		return next(new UnauthorizedError());
	}
}
