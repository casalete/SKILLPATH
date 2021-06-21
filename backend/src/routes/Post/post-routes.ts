import elastic from '@elastic/elasticsearch';
import express, { NextFunction, Request, Response } from 'express';
import { PostModel } from '../../models/post';
import { TopicModel } from '../../models/topic';
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
        authorImage: req.user.imagePath,
        score: 0,
    });
    const author = req.user;
    const authorRankList = author.rank;
    const mainTopicRank = authorRankList.findIndex((rank) => rank.topicName === req.body.mainTopic);
    if (mainTopicRank !== -1) {
        authorRankList[mainTopicRank] = { ...authorRankList[mainTopicRank], rank: authorRankList[mainTopicRank].rank + 10 };
    } else {
        authorRankList.push({ topicName: req.body.mainTopic, rank: 10 });
    }
    author.rank = authorRankList;
    author.score = author.score + 10;
    try {
        const newPost = await post.save(function (err) {
            if (err) throw err;
            /* Document indexation on going */
            PostModel.on('es-indexed', function (err, res) {
                if (err) throw err;
                /* Document is indexed */
            });
        });

        const topicModels = req.body.postTopics.map(
            (postTopic) =>
                new TopicModel({
                    name: postTopic,
                    suggestedTopics: [],
                    postsCount: 0,
                }),
        );
        let savedTopicModels = [];
        await topicModels.forEach(async (topicModel) => {
            try {
                const topic = await TopicModel.findOne({ name: topicModel.name });
                if (topic == null) {
                    const savedTopic = await topicModel.save(function (err) {
                        if (err) throw err;
                        /* Document indexation on going */
                        TopicModel.on('es-indexed', function (err, res) {
                            if (err) throw err;
                            /* Document is indexed */
                        });
                    });
                    savedTopicModels.push(topicModel);
                }
            } catch (err) {
                console.log('unable to save topic');
            }
            console.log(`topic saved : ${topicModel.name}`);
        });

        const mt = await TopicModel.findOne({ name: req.body.mainTopic }, async (err, mainTopic) => {
            if (err) {
                console.log('could not find main topic in post');
            }
            const dict = {};
            const suggestedTopics = await mainTopic.suggestedTopics;
            mainTopic.postsCount = mainTopic.postsCount && mainTopic.postsCount !== 0 ? mainTopic.postsCount + 1 : 1;

            if (suggestedTopics.length === 0) {
                mainTopic.suggestedTopics = req.body.postTopics;
                await mainTopic.save();
            } else {
                await suggestedTopics.forEach((item) => (dict[item] = true));
                const diffList = req.body.postTopics.reduce(function (prev, crt) {
                    if (dict.hasOwnProperty(crt) === false) {
                        prev.push(crt);
                    }
                    return prev;
                }, []);
                if (diffList.length !== 0) {
                    mainTopic.suggestedTopics = [...mainTopic.suggestedTopics, ...diffList];
                    await mainTopic.save();
                }
            }
        });
        await author.save();

        res.status(201).json(post);
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

// mt.suggestedTopics = newSuggestedTopics;

// try {
//     let topicModelsToAdd;
//     let topicsToAdd;
//     let newSuggestedTopics;

//     const mt = await TopicModel.findOne({ name: req.body.mainTopic }, async (err, mainTopic) => {
//         if (err) {
//             console.log('could not find main topic in post');
//         }
//         console.log('mainTopic:');
//         console.log(mainTopic);
//         // const suggestedTopics = mainTopic.get('suggestedTopics', String, { getters: false });
//         const suggestedTopics = mainTopic.suggestedTopics();
//         topicModelsToAdd = await TopicModel.find().where('name').nin(suggestedTopics);
//         newSuggestedTopics = [...topicsToAdd, ...savedTopicModels];
//         // newSuggestedTopics.push()
//     });
//     mt.suggestedTopics = newSuggestedTopics;
//     const savedMt = await mt.save();
//     // const mainTopicSuggestedTopics = mainTopic.suggestedTopics.map((st) => {
//     //     console.log(st.toObject().name);
//     //     return st.toObject().name;
//     // });
//     // topicsToAdd = await TopicModel.find().where('name').nin(mainTopicSuggestedTopics).exec();

//     // topic.suggestedTopics.forEach(async topicName=>{
//     //     try{
//     //         const topic = await TopicModel.findOne({ name: topicName });
//     //     if (topic == null) {
//     //         topicModel.save(function (err) {
//     //             if (err) throw err;
//     //             /* Document indexation on going */
//     //             TopicModel.on('es-indexed', function (err, res) {
//     //                 if (err) throw err;
//     //                 /* Document is indexed */
//     //             });
//     //         });
//     //     }
//     //     }catch(e){
//     //         throw e
//     //     }
//     // }

//     // )
// } catch (err) {
//     console.log(err);
//     console.log('Unable to update main topic');
// }
