import { readFileSync } from 'fs';
import { PassportStatic } from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

import { PUBLIC_KEY_PATH } from '../../Const';
import { UserModel } from '../../models/UserModel';
import { elog } from '../../utils/Logger';

let PUBLIC_KEY: string;
try {
	PUBLIC_KEY = readFileSync(PUBLIC_KEY_PATH, 'utf8');
} catch (error) {
	elog(error);
	process.exit(1);
}

export function configurePassport(passport: PassportStatic) {
	const strategy = new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: PUBLIC_KEY,
			algorithms: ['RS256'],
		},
		async (payload, done) => {
			try {
				const foundUser = await UserModel.findById(payload.sub);
				foundUser ? done(null, foundUser) : done(null, false);
			} catch (error) {
				elog(error);
				done(error, null);
			}
		}
	);

	passport.use(strategy);
}
