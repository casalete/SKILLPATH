import express, { application } from 'express';
import { usersRouter } from './User/user-routes';
import { authRouter } from './auth/auth-router';
import passport from 'passport';

export const router = express.Router();

router.use('/auth', authRouter);

router.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);
