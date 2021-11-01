// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enumToArray(enume: any): string[] {
	return Object.values(enume)
		.filter((value) => typeof value === 'string')
		.map((value) => value as string);
}
