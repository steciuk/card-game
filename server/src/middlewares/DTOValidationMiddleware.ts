import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

import { HttpError } from '../errors/httpErrors/HttpError';
import { elog } from '../utils/Logger';

export function dtoValidationMiddleware(type: ClassConstructor<object>): RequestHandler {
	return (req: Request, res: Response, next: NextFunction): void => {
		validate(plainToClass(type, req.body)).then((errors: ValidationError[]) => {
			if (errors.length > 0) {
				elog(`Validation error on ${type.name}`, errors);
				next(new HttpError(400, 'Bad request'));
			} else {
				next();
			}
		});
	};
}
