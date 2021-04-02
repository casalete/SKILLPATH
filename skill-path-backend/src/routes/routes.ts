import express, { application } from 'express';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { usersRouter } from './User/user-routes';
import { secureRouter } from './secure-routes';

export const router = express.Router();
const app = express();

app.use('/users', usersRouter);
app.use('/profile', secureRouter);

router.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
	res.json({
		message: 'Signup successful',
		user: req.user,
	});
});

router.post('/login', async (req, res, next) => {
	passport.authenticate('login', async (err, user, info) => {
		try {
			if (err || !user) {
				console.log(err);
				const error = new Error('An error occurred.');

				return next(error);
			}

			req.login(user, { session: false }, async (error) => {
				if (error) return next(error);

				const body = { _id: user._id, email: user.email };
				const token = jwt.sign({ user: body }, 'TOP_SECRET');

				return res.json({ token });
			});
		} catch (error) {
			console.log(error);
			return next(error);
		}
	})(req, res, next);
});
