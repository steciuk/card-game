import { readFileSync } from 'fs';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { PRIVATE_KEY_PATH, PUBLIC_KEY_PATH } from '../../Const';
import { UserDocument } from '../../models/UserModel';
import { elog } from '../Logger';

let PRIVATE_KEY: string;
let PUBLIC_KEY: string;
try {
	PRIVATE_KEY = readFileSync(PRIVATE_KEY_PATH, 'utf8');
	PUBLIC_KEY = readFileSync(PUBLIC_KEY_PATH, 'utf8');
} catch (error) {
	elog(error);
	process.exit(1);
}

export function issueJWT(user: UserDocument): string {
	const expiresIn = 86400; // 24h
	const issuedAt = Date.now();
	const expires = issuedAt + expiresIn;

	const payload = {
		sub: user.id,
		iat: issuedAt,
		exp: expires,
	};

	const signedToken = sign(payload, PRIVATE_KEY, {
		algorithm: 'RS256',
	});

	return 'Bearer ' + signedToken;
}
// throws an error
export function validateJWT(jwt: string): JwtPayload {
	const token = jwt.split(' ')[1];
	const jwtPayload = verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
	return jwtPayload as JwtPayload;
}
