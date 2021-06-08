import elastic from '@elastic/elasticsearch';
import express, { NextFunction, Request, Response } from 'express';
import { CommentModel } from '../../models/comment';
import { NotFound } from '../../utils/errors';

const elasticClient = new elastic.Client({
    node: 'http://localhost:9200',
});

export const commentsRouter = express.Router();

async function getComment(req: Request, res: Response, next: NextFunction) {
    let comment;
    if (!req.body.id) {
        next('No id sent');
    }
    try {
        comment = await CommentModel.findById(req.body.id);
        if (comment == null) {
            throw new NotFound('Cannot find comment with given id');
        }
    } catch (err) {
        next(err);
    }
    // add new key/value pair to the res obj
    Object.assign(res, { comment: comment });
    // res = {...res, post:post},
    next(); // pass control to the next handler
}

async function getCommentsForPost(req: any, res: Response, next: NextFunction) {
    let comments;
    try {
        comments = await elasticClient.search({
            index: 'comments',

            body: {
                query: {
                    bool: {
                        must: [
                            {
                                match: {
                                    postId: `${req.params.id}`,
                                },
                            },
                        ],
                    },
                },
            },
        });
        if (comments == null) {
            throw new NotFound('Cannot find comments for given post');
        }
    } catch (err) {
        next(err);
    }
    // add new key/value pair to the res obj
    Object.assign(res, { comments: comments });
    // res = {...res, post:post},
    next(); // pass control to the next handler
}

let topicName; //just for testing, must find a better way to do it
// get a specific post by mainTopic from elasticsearch
commentsRouter.get('/getCommentsForPost', getCommentsForPost, (_req: Request, res: Response) => {
    res.json((<any>res).comments);
});

commentsRouter.post('/', async (req: any, res: any) => {
    const comment = new CommentModel({
        author: req.user.email,
        authorDisplayName: req.user.displayName,
        postId: req.body.postId,
        content: req.body.content,
    });
    try {
        const newComment = await comment.save(function (err) {
            if (err) throw err;
            /* Document indexation on going */
            CommentModel.on('es-indexed', function (err, res) {
                if (err) throw err;
                /* Document is indexed */
            });
        });
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

commentsRouter.patch('/vote', getComment, async (req: any, res: any) => {
    if (req.body.voteType != null) {
        (<any>res).comment.votersList.push({ email: req.user.email, voteType: req.body.voteType });
        if (req.body.voteType === 'UP') {
            if ((<any>res).comment.upVotes) {
                (<any>res).comment.upVotes = (<any>res).comment.upVotes + 1;
            } else {
                (<any>res).comment.upVotes = 1;
            }
            if ((<any>res).comment.score) {
                (<any>res).comment.score = (<any>res).comment.score + 10;
            } else {
                (<any>res).comment.score = 10;
            }
        }
        if (req.body.voteType === 'DOWN') {
            if ((<any>res).comment.downVotes) {
                (<any>res).comment.downVotes = (<any>res).comment.downVotes + 1;
            } else {
                (<any>res).comment.downVotes = 1;
            }
            if ((<any>res).comment.score) {
                (<any>res).comment.score = (<any>res).comment.score - 5;
            } else {
                (<any>res).comment.score = -5;
            }
        }
    }
    try {
        const updatedComment = await (<any>res).comment.save();
        res.json(updatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
commentsRouter.patch('/:id', getComment, async (req: any, res: any) => {
    if (req.body.voteType != null) {
        (<any>res).comment.votersList.push({ email: req.user.email, voteType: req.body.voteType });
        if (req.body.voteType === 'UP') {
            (<any>res).comment.upVotes = (<any>res).comment.upVotes + 1;
            (<any>res).comment.score = (<any>res).comment.score + 10;
        } else if (req.body.voteType === 'DOWN') {
            (<any>res).comment.downVotes = (<any>res).comment.downVotes + 1;
            (<any>res).comment.score = (<any>res).comment.score - 5;
        }
    }
    try {
        const updatedComment = await (<any>res).comment.save();
        res.json(updatedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

commentsRouter.delete('/:id', function (req, res) {
    var id = req.params.id;

    CommentModel.findByIdAndRemove(id).exec();
    CommentModel.on('es-removed', function (err, res) {
        if (err) throw err;
        /* Document is removed */
    });
    res.json({ success: id });
    res.redirect('/');
});
