import { HttpError } from './HttpError';

export enum DB_RESOURCES {
	GAME = 'Game',
	USER = 'User',
}

export class ResourceNotFoundError extends HttpError {
	constructor(resource: DB_RESOURCES, id: string) {
		super(404, `${resource} with ${id} not found`);
	}
}
