import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { validatePassword } from '../lib/PassportUtils';
import { UserModel } from '../models/UserModel';
import { elog } from '../utils/Logger';

passport.use(
	new LocalStrategy(async (username: string, password: string, done) => {
		try {
			console.log('dupa');
			const user = await UserModel.findOne({ username: username });
			if (!user || !validatePassword(password, user.hash, user.salt)) {
				return done(null, false);
			}

			return done(null, user);
		} catch (error: unknown) {
			elog(error);
			done(error);
		}
	})
);
