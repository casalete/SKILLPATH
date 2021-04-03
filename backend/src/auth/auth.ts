import passport from 'passport';
import localStrategy from 'passport-local';
import UserModel from '../models/user';
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

passport.use(
	'signup',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (email, password, done) => {
			try {
				const user = await UserModel.create({ email, password });

				return done(null, user);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	'login',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
		},
		async (email, password, done) => {
			try {
				const user: any = await UserModel.findOne({ email });

				if (!user) {
					return done(null, false, { message: 'User not found' });
				}

				const validate = await user.isValidPassword(password);

				if (!validate) {
					return done(null, false, { message: 'Wrong Password' });
				}

				return done(null, user, { message: 'Logged in Successfully' });
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.use(
	new JWTstrategy(
		{
			secretOrKey: 'SKILLPATH_JWT_SIGNATURE',
			jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token'),
		},
		async (token, done) => {
			try {
				return done(null, token.user);
			} catch (error) {
				done(error);
			}
		}
	)
);
