import { NextFunction, Request, Response } from 'express';
import { readFileSync } from 'fs';
import jsonwebtoken from 'jsonwebtoken';

import { PUBLIC_KEY_PATH } from '../Const';
import { UnauthorizedError } from '../errors/httpErrors/user/UnauthorizedError';
import { elog } from '../utils/Logger';

let PUBLIC_KEY: string;
try {
	PUBLIC_KEY = readFileSync(PUBLIC_KEY_PATH, 'utf8');
} catch (error) {
	elog(error);
	process.exit(1);
}

export function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
	if (!req.headers.authorization) return next(new UnauthorizedError());

	try {
		const token = req.headers.authorization.split(' ')[1];
		const jwt = jsonwebtoken.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
		// TODO: save expires in to database and check if not expired?
		// TODO: check if user still exists in database
		req.jwt = jwt;
		next();
	} catch (error) {
		return next(new UnauthorizedError());
	}
}
