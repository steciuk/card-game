export class NotLoggedInError extends Error {
	constructor(info: string) {
		super(`Unauthorized: ${info}`);
	}
}
