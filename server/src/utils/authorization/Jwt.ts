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
	const issuedAt = Math.round(Date.now() / 1000);
	const expiresOn = issuedAt + expiresIn;

	const payload = {
		sub: user.id,
		iat: issuedAt,
		exp: expiresOn,
	};

	const signedToken = sign(payload, PRIVATE_KEY, {
		algorithm: 'RS256',
	});

	return 'Bearer ' + signedToken;
}
// throws an error
export function validateJWT(jwt: string): JwtValidationSuccess | JwtValidationFailure {
	const token = jwt.split(' ')[1];
	try {
		const jwtPayload = verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
		return { success: true, payload: jwtPayload as JwtPayload };
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		if (error?.message) {
			if (error.message === JwtValidationError.EXPIRED)
				return { success: false, error: JwtValidationError.EXPIRED };
			if (error.message === JwtValidationError.EXPIRED)
				return { success: false, error: JwtValidationError.INVALID };
		}

		return { success: false, error: JwtValidationError.UNKNOWN };
	}
}

interface JwtValidationSuccess {
	success: true;
	payload: JwtPayload;
}

interface JwtValidationFailure {
	success: false;
	error: JwtValidationError;
}

export enum JwtValidationError {
	EXPIRED = 'jwt expired',
	INVALID = 'invalid token',
	UNKNOWN = 'unknown',
}
