import express from 'express';
import { Error } from 'mongoose';
import { UserModel } from '../../models/user';
import { BadRequest, GeneralError } from '../../utils/errors';

import { issueJWT } from '../../utils/utils';

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
        if (err.code && err.code == 11000) {
            next(new GeneralError('Account already exists'));
        } else {
            next(err);
        }
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
            const tokenObject = issueJWT(user);
            res.status(200).json({ success: true, token: tokenObject.token, expiresIn: tokenObject.expires });
        } else {
            throw new Unauthorized('Wrong password');
        }
    } catch (err) {
        next(err);
    }
});
