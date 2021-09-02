export function dateToString(date: Date): string {
	return `${getDate(date)} ${getTime(date)}`;
}

function getDate(date: Date): string {
	return `${date.toISOString().split('T')[0]}`;
}

function getTime(date: Date): string {
	return `${date.toTimeString().slice(0, 8)}`;
}
