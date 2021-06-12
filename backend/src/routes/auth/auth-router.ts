import express from 'express';
import { Error } from 'mongoose';
import { UserModel } from '../../models/user';
import { BadRequest, GeneralError } from '../../utils/errors';

import bcrypt from 'bcrypt';

import { issueJWT } from '../../utils/utils';

const Unauthorized = require('../../utils/errors').Unauthorized;

export const authRouter = express.Router();

authRouter.post('/register', async function (req, res, next) {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const newUser = await UserModel.create({
            email: req.body.email,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            displayName: req.body.displayName,
            imagePath: 'https://media.istockphoto.com/photos/unknown-person-silhouette-picture-id499728904',
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
        const user: any = await UserModel.findOne({ email: req.body.email });
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
