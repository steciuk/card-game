import { readFileSync } from 'fs';
import { sign } from 'jsonwebtoken';
import passport from 'passport';

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

export function issueJWT(user: User): { token: string; expiresIn: string } {
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

export function jwtGuard() {
	return (): void => passport.authenticate('jwt', { session: false });
}
