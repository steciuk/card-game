import { plainToClass, ClassConstructor } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/httpErrors/HttpError';
import { elog } from '../utils/Logger';

export function validationMiddleware(
	type: ClassConstructor<object>
): RequestHandler {
	return (req: Request, res: Response, next: NextFunction) => {
		validate(plainToClass(type, req.body)).then(
			(errors: ValidationError[]) => {
				if (errors.length > 0) {
					elog(`Validation error on ${type.name}`, errors);
					next(new HttpError(400, 'Bad request'));
				} else {
					next();
				}
			}
		);
	};
}
