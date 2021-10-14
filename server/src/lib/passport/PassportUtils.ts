import { pbkdf2Sync, randomBytes } from 'crypto';
import { readFileSync } from 'fs';
import { sign } from 'jsonwebtoken';

import { PRIVATE_KEY_PATH } from '../../Const';
import { User } from '../../models/UserModel';
import { elog } from '../../utils/Logger';

let PRIVATE_KEY: string;
try {
	PRIVATE_KEY = readFileSync(PRIVATE_KEY_PATH, 'utf8');
} catch (error) {
	elog(error);
	process.exit(1);
}

export function generateNewSaltAndHash(password: string): {
	salt: string;
	hash: string;
} {
	const salt = randomBytes(64).toString('hex');
	const hash = hashFunction(password, salt);
	return { salt, hash };
}

export function validatePassword(password: string, hash: string, salt: string): boolean {
	return hash === hashFunction(password, salt);
}

export function issueJWT(user: User) {
	const payload = {
		sub: user.id,
		iat: Date.now(),
	};

	const expiresIn = '1d';

	const signedToken = sign(payload, PRIVATE_KEY, {
		expiresIn: expiresIn,
		algorithm: 'RS256',
	});

	return {
		token: 'Bearer ' + signedToken,
		expiresIn: expiresIn,
	};
}

function hashFunction(password: string, salt: string): string {
	return pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}
