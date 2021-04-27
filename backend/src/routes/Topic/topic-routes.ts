import elastic from '@elastic/elasticsearch';
import express, { NextFunction, Request, Response } from 'express';
import { TopicModel } from '../../models/topic';
import { NotFound } from '../../utils/errors';

const elasticClient = new elastic.Client({
    node: 'http://localhost:9200',
});

export const topicsRouter = express.Router();


// find topic with the given id
async function getTopic(req: Request, res: Response, next: NextFunction) {
    let topic;
    try {
        topic = await TopicModel.findById(req.params.id);
        if (topic == null) {
            throw new NotFound('Cannot find topic with given id');
        }
    } catch (err) {
        next(err);
    }
    // add new key/value pair to the res obj
    Object.assign(res, { topic: topic });
    // res = {...res, topic:topic},
    next(); // pass control to the next handler
}

// get all topics
topicsRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const topics = await TopicModel.find();
        res.json(topics);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// get a specific topic
topicsRouter.get('/:id', getTopic, (_req: Request, res: Response) => {
    res.json((<any>res).topic);
});

// create new topic
topicsRouter.post('/', async (req: Request, res: Response) => {
    //const hashedPass: string = await bcrypt.hash(req.body.password, 10);

    const topic = new TopicModel({
        name: req.body.name,
        suggestedTopics: req.body.suggestedTopics
    });
    try {
        const newTopic = await topic.save(function (err) {
            if (err) throw err;
            /* Document indexation on going */
            TopicModel.on('es-indexed', function (err, res) {
                if (err) throw err;
                /* Document is indexed */
            });
        });
        res.status(201).json(newTopic);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// update topic's info
topicsRouter.patch('/:id', getTopic, async (req: Request, res: Response) => {

    if (req.body.name != null) {
        (<any>res).topic.name = req.body.name;
    }
    //asta de  mai jos
    if(req.body.suggestedTopics != null){
        (<any>res).topic.suggestedTopics = req.body.suggestedTopics;
    }
     //poate fi scrisa si asa :

    // req.body.suggestedTopics &&  (<any>res).topic.suggestedTopics = req.body.suggestedTopics;

    //(verifica mai intai prima parte, si doar daca e adevarata, executa partea a doua)

    if(req.body.postsCount != null){
        (<any>res).topic.postsCount = req.body.postsCount;
    }
   
    try {
        const updatedTopic = await (<any>res).topic.save();
        res.json(updatedTopic);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});