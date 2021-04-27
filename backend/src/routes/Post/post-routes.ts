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
        post = await PostModel.findById(req.params.id);
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

async function getPostsForTopic(req: Request, res: Response, next: NextFunction) {
    let posts;
    try {
        posts = await elasticClient.search({

            index: 'posts',
        
            type: 'posts',
        
            q: `mainTopic:${req.params.topicName}`
        
        });
        if (posts == null) {
            throw new NotFound('Cannot find posts for given topic');
        }
    } catch (err) {
        next(err);
    }
    // add new key/value pair to the res obj
    Object.assign(res, { posts: posts});
    // res = {...res, post:post},
    next(); // pass control to the next handler
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

// get a specific post by id
postsRouter.get('/:id', getPost, (_req: Request, res: Response) => {
    res.json((<any>res).post);
});
let topicName; //just for testing, must find a better way to do it
// get a specific post by mainTopic from elasticsearch
postsRouter.get(`/?topicName=${topicName}`, getPostsForTopic, (_req: Request, res: Response) => {
    res.json((<any>res).posts);
});

// create new post
postsRouter.post('/', async (req: Request, res: Response) => {

    const post = new PostModel({
        name: req.body.name,
        description: req.body.description,
        mainTopic: req.body.mainTopic,
        author: req.body.author,
        postTopics: req.body.postTopics
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
postsRouter.patch('/:id', getPost, async (req: Request, res: Response) => {

    if (req.body.name != null) {
        (<any>res).post.name = req.body.name;
    }
    try {
        const updatedPost = await (<any>res).post.save();
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});