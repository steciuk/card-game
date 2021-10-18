import { NextFunction, Request, Response } from 'express';

import { HttpError } from '../../errors/httpErrors/HttpError';
import { elog } from '../Logger';

export function AccessDatabaseFromMiddleware() {
	return (
		target: unknown,
		key: string,
		descriptor: TypedPropertyDescriptor<
			(req: Request, res: Response, next: NextFunction) => Promise<void>
		>
	): void => {
		const originalMethod = descriptor.value;
		descriptor.value = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
			try {
				if (originalMethod) {
					await originalMethod(req, res, next);
				}
			} catch (error: unknown) {
				elog(error);
				next(new HttpError());
			}
		};
	};
}
