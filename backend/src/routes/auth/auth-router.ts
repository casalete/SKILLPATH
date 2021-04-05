import express from 'express';
import UserModel from '../../models/user';

const utils = require('../../utils/utils');

const Unauthorized = require('../../utils/errors').Unauthorized;

export const authRouter = express.Router();

authRouter.post('/register', async function (req, res, next) {
	try {
		const newUser = await UserModel.create({
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		});

		res.json({ success: true, user: newUser });
	} catch (err) {
		res.json({ success: false, msg: err });
	}
});

authRouter.post('/login', async function (req, res, next) {
	try {
		const user: any = await UserModel.findOne({ username: req.body.username });
		if (!user) {
			return res.status(401).json({ success: false, msg: 'could not find user' });
		}

		const isValid = await user.isValidPassword(req.body.password);

		if (isValid) {
			const tokenObject = utils.issueJWT(user);
			res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
		} else {
			throw new Unauthorized('Wrong password');
		}
	} catch (err) {
		next(err);
	}
});
