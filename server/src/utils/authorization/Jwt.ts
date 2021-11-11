import { readFileSync } from 'fs';
import { sign } from 'jsonwebtoken';

import { PRIVATE_KEY_PATH } from '../../Const';
import { UserDocument } from '../../models/UserModel';
import { elog } from '../Logger';

let PRIVATE_KEY: string;
try {
	PRIVATE_KEY = readFileSync(PRIVATE_KEY_PATH, 'utf8');
} catch (error) {
	elog(error);
	process.exit(1);
}

export function issueJWT(user: UserDocument): { token: string; expiresIn: string } {
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
