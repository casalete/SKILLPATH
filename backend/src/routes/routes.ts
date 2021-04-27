import express, { application } from 'express';
import { usersRouter } from './User/user-routes';
import { topicsRouter } from './Topic/topic-routes';
import { postsRouter } from './Post/post-routes';
//import { commentsRouter } from './Comments/comments-routes';
import { authRouter } from './auth/auth-router';
import passport from 'passport';

export const router = express.Router();

router.use('/auth', authRouter);

router.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);

router.use('/topics', passport.authenticate('jwt', { session: false }), topicsRouter);

router.use('/posts', passport.authenticate('jwt', { session: false }), postsRouter);

//router.use('/comments', passport.authenticate('jwt', { session: false }), commentsRouter);

