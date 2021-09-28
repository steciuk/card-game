import fs from 'fs';
import util from 'util';

import { dateToString } from './DateFormatter';

const logFile = fs.createWriteStream('./server.log', {
	flags: 'a',
});

export function llog(message: string, obj: any): void;
export function llog(message: string): void;
export function llog(obj: any): void;
export function llog(arg1: unknown, arg2?: any): void {
	const logType = 'LOG';
	if (typeof arg1 === 'string' && typeof arg2 !== 'undefined')
		return logMessageAndObject(logType, arg1, arg2);
	if (typeof arg1 === 'string') return logMessage(logType, arg1);

	return logObject(logType, arg1);
}
export function wlog(message: string, obj: any): void;
export function wlog(message: string): void;
export function wlog(obj: any): void;
export function wlog(arg1: unknown, arg2?: any): void {
	const logType = 'WARN';
	if (typeof arg1 === 'string' && typeof arg2 !== 'undefined')
		return logMessageAndObject(logType, arg1, arg2);
	if (typeof arg1 === 'string') return logMessage(logType, arg1);

	return logObject(logType, arg1);
}

export function elog(message: string, obj: any): void;
export function elog(message: string): void;
export function elog(obj: any): void;
export function elog(arg1: unknown, arg2?: any): void {
	const logType = 'ERROR';
	if (typeof arg1 === 'string' && typeof arg2 !== 'undefined')
		return logMessageAndObject(logType, arg1, arg2);
	if (typeof arg1 === 'string') return logMessage(logType, arg1);

	return logObject(logType, arg1);
}

function logMessageAndObject(
	logType: string,
	message: string,
	obj: object
): void {
	logFile.write(
		util.format(
			`${dateToString(new Date())} ${logType}: ${message} ${objToString(
				obj
			)}\n`
		)
	);
	console.log(message);
	console.log(obj);
}

function logMessage(logType: string, message: string): void {
	logFile.write(
		util.format(`${dateToString(new Date())} ${logType}: ${message}\n`)
	);
	console.log(message);
}

function logObject(logType: string, obj: any): void {
	logFile.write(
		util.format(
			`${dateToString(new Date())} ${logType}: ${objToString(obj)}\n`
		)
	);
	console.log(obj);
}

function objToString(obj: any): string {
	return JSON.stringify(obj, null, 0);
}
