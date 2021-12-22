import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { NextFunction, Request, RequestHandler, Response } from 'express';

import { BadRequestError } from '../errors/httpErrors/BadRequestError';
import { elog } from '../utils/Logger';

export function validationMiddleware(type: ClassConstructor<object>): RequestHandler {
	return (req: Request, res: Response, next: NextFunction): void => {
		validate(plainToClass(type, req.body)).then((errors: ValidationError[]) => {
			if (errors.length > 0) {
				elog(`Validation error on ${type.name}`, errors);
				next(new BadRequestError());
			} else {
				next();
			}
		});
	};
}
