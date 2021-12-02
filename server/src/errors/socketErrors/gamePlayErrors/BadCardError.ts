export class BadCardError extends Error {
	constructor(card: string) {
		super(`${card} is invalid card identifier`);
	}
}
