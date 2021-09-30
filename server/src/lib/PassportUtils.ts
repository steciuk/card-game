import { pbkdf2Sync, randomBytes } from 'crypto';

export function generateNewSaltAndHash(password: string): {
	salt: string;
	hash: string;
} {
	const salt = randomBytes(64).toString('hex');
	const hash = hashFunction(password, salt);
	return { salt, hash };
}

export function validatePassword(
	password: string,
	hash: string,
	salt: string
): boolean {
	return hash === hashFunction(password, salt);
}

function hashFunction(password: string, salt: string): string {
	return pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}
