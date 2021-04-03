import express, { application } from 'express';
import { usersRouter } from './User/user-routes';
import { secureRouter } from './secure-routes';
import { authRouter } from './auth/auth-router';
import passport from 'passport';

export const router = express.Router();

require('../auth/auth');

router.use('/auth', authRouter);

router.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);
router.use('/profile', secureRouter);
