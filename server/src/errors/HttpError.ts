export class HttpError extends Error {
	status: number;

	constructor(status?: number, message?: string) {
		super(message || 'Something gone wrong');
		this.status = status || 500;
	}
}
