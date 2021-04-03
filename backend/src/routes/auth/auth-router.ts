import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

export const authRouter = express.Router();

authRouter.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
	res.json({
		message: 'Signup successful',
		user: req.user,
	});
});

authRouter.post('/login', async (req, res, next) => {
	passport.authenticate('login', async (err, user, info) => {
		try {
			if (err || !user) {
				const error = new Error('An error occurred.');

				return next(error);
			}

			req.login(user, { session: false }, async (error) => {
				if (error) return next(error);

				const body = { _id: user._id, email: user.email };
				const token = jwt.sign({ user: body }, 'SKILLPATH_JWT_SIGNATURE');

				return res.json({ token });
			});
		} catch (error) {
			return next(error);
		}
	})(req, res, next);
});
