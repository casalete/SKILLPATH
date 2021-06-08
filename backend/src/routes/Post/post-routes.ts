import elastic from '@elastic/elasticsearch';
import express, { NextFunction, Request, Response } from 'express';
import { PostModel } from '../../models/post';
import { NotFound } from '../../utils/errors';

const elasticClient = new elastic.Client({
    node: 'http://localhost:9200',
});

export const postsRouter = express.Router();

// find post with the given id
async function getPost(req: Request, res: Response, next: NextFunction) {
    let post;
    try {
        post = await PostModel.findOne({ name: req.body.id });
        if (post == null) {
            throw new NotFound('Cannot find post with given id');
        }
    } catch (err) {
        next(err);
    }
    // add new key/value pair to the res obj
    Object.assign(res, { post: post });
    // res = {...res, post:post},
    next(); // pass control to the next handler
}

async function getPostWithComments(req: any, res: any, next: NextFunction) {
    let postResult, commentsResult;

    try {
        [postResult, commentsResult] = await Promise.all([
            PostModel.findById(req.params.id),
            elasticClient.search({
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
            }),
        ]);
        if (postResult == null) {
            throw new NotFound('Cannot find post with given id');
        }
    } catch (err) {
        next(err);
    }

    const postWithComments = { ...postResult?._doc, comments: commentsResult?.body?.hits?.hits?.map((i) => ({ ...i._source, id: i._id })) };
    if (postWithComments) {
        Object.assign(res, { post: postWithComments });
    }

    next(); // pass control to the next handler
}

async function getPostsForTopic(req: Request, res: Response, next: NextFunction) {
    let posts, comments, postsWithCommentsLength;
    try {
        posts = await elasticClient.search({
            index: 'posts',
            body: {
                query: {
                    match: {
                        mainTopic: `${req.query.mainTopic}`,
                    },
                },
            },
        });
        if (posts == null) {
            throw new NotFound('Cannot find posts for given topic');
        }
    } catch (err) {
        next(err);
    }
    try {
        const postIds = posts?.body?.hits?.hits?.map((i) => i._id).join(',');
        posts = posts?.body?.hits?.hits?.map((p) => ({ ...p._source, _id: p._id }));
        comments = await await elasticClient.search({
            index: 'comments',
            body: {
                query: {
                    match: {
                        postId: `${postIds}`,
                    },
                },
            },
        });
        if (comments) {
            comments = comments.body?.hits?.hits?.map((c) => ({ ...c._source, _id: c._id }));
            postsWithCommentsLength = posts.map((post) => ({
                ...post,
                commentsLength: comments.filter((c) => c.postId === post._id).length,
            }));
            Object.assign(res, { postsWithCommentsLength: postsWithCommentsLength });
        } else {
            Object.assign(res, { post: posts });
        }
    } catch (err) {
        console.log(err.message);
        next();
    }
    next();
}

// get all posts
postsRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const posts = await PostModel.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

let topicName; //just for testing, must find a better way to do it
// get a specific post by mainTopic from elasticsearch
postsRouter.get('/getPostsByTopic', getPostsForTopic, (_req: Request, res: Response) => {
    if ((<any>res).postsWithCommentsLength) {
        res.json((<any>res).postsWithCommentsLength);
    } else if ((<any>res).posts) {
        res.json((<any>res).posts);
    } else {
        res.status(404).json({ message: 'No Posts found for topic' });
    }
});

// get a specific post by id
postsRouter.get('/:id', getPostWithComments, (_req: Request, res: Response) => {
    res.json({ ...(<any>res).post });
});

// create new post
postsRouter.post('/', async (req: any, res: any) => {
    const post = new PostModel({
        name: req.body.name,
        description: req.body.description,
        content: req.body.content,
        links: req.body.links,
        mainTopic: req.body.mainTopic,
        author: req.user.email,
        authorAbout: req.user.about,
        authorDisplayName: req.user.displayName,
        authorScore: req.user.score,
        postTopics: req.body.postTopics,
    });
    try {
        const newPost = await post.save(function (err) {
            if (err) throw err;
            /* Document indexation on going */
            PostModel.on('es-indexed', function (err, res) {
                if (err) throw err;
                /* Document is indexed */
            });
        });
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// update post's info
postsRouter.patch('/vote', getPost, async (req: any, res: any) => {
    if (req.body.voteType != null) {
        (<any>res).post.votersList.push({ email: req.user.email, voteType: req.body.voteType });
        if (req.body.voteType === 'UP') {
            if ((<any>res).post.upVotes) {
                (<any>res).post.upVotes = (<any>res).post.upVotes + 1;
            } else {
                (<any>res).post.upVotes = 1;
            }
            if ((<any>res).post.score) {
                (<any>res).post.score = (<any>res).post.score + 5;
            } else {
                (<any>res).post.score = 5;
            }
        }
        if (req.body.voteType === 'DOWN') {
            if ((<any>res).post.downVotes) {
                (<any>res).post.downVotes = (<any>res).post.downVotes + 1;
            } else {
                (<any>res).post.downVotes = 1;
            }
            if ((<any>res).post.score) {
                (<any>res).post.score = (<any>res).post.score - 3;
            } else {
                (<any>res).post.score = -3;
            }
        }
    }
    try {
        const updatedpost = await (<any>res).post.save();
        res.json(updatedpost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

postsRouter.delete('/delete/:id', function (req, res) {
    var id = req.params.id;

    PostModel.findByIdAndRemove(id).exec();
    PostModel.on('es-removed', function (err, res) {
        if (err) throw err;
        /* Document is removed */
    });
    res.json({ success: id });
    res.redirect('/');
});
