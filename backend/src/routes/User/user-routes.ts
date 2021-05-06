import elastic from '@elastic/elasticsearch';
import bcrypt from 'bcrypt';
import express, { NextFunction, Request, Response } from 'express';
import { UserModel } from '../../models/user';
import { NotFound } from '../../utils/errors';

const elasticClient = new elastic.Client({
    node: 'http://localhost:9200',
});

export const usersRouter = express.Router();

// find user with the given id
async function getUser(req: Request, res: Response, next: NextFunction) {
    let user;
    try {
        user = await UserModel.findById(req.params.id);
        if (user == null) {
            throw new NotFound('Cannot find usser with given id');
        }
    } catch (err) {
        next(err);
    }
    // add new key/value pair to the res obj
    Object.assign(res, { user: user });
    // res = {...res, user:user},
    next(); // pass control to the next handler
}

// get all users
usersRouter.get('/', async (_req: Request, res: Response) => {
    try {
        const users = await UserModel.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

usersRouter.get('/profile', (req: any, res: Response) => {
    if (req.user) {
        res.json({
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            displayName: req.user.displayName,
            about: req.user.about,
            rank: req.user.rank,
            score: req.user.score,
            followedUsers: req.user.followedUsers,
            followedTopics: req.user.followedTopics,
            achievements: req.user.achievements,
        });
    }
});

usersRouter.patch('/profile', async (req: any, res: Response) => {
    if (req.user) {
        if (req.body.firstName != null) {
            req.user.firstName = req.body.firstName;
        }
        if (req.body.lastName != null) {
            req.user.lastName = req.body.lastName;
        }
        if (req.body.displayName != null) {
            req.user.displayName = req.body.displayName;
        }
        if (req.body.about != null) {
            req.user.about = req.body.about;
        }
        if (req.body.followedTopics != null) {
            req.user.followedTopics = req.body.followedTopics;
        }
        if (req.body.followedUsers != null) {
            req.user.followedUsers = req.body.followedUsers;
        }
        try {
            const updatedUser = await req.user.save();
            res.json(updatedUser);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }
});

// get a specific user
usersRouter.get('/:id', getUser, (_req: Request, res: Response) => {
    res.json((<any>res).user);
});

// update user's info
usersRouter.patch('/:id', getUser, async (req: Request, res: Response) => {
    // if (req.body.email != null) {
    //     (<any>res).user.email = req.body.email;
    // }
    if (req.body.firstName != null) {
        (<any>res).user.firstName = req.body.firstName;
    }
    if (req.body.lastName != null) {
        (<any>res).user.lastName = req.body.lastName;
    }
    if (req.body.displayName != null) {
        (<any>res).user.displayName = req.body.displayName;
    }
    if (req.body.about != null) {
        (<any>res).user.about = req.body.about;
    }
    if (req.body.rank != null) {
        (<any>res).user.rank = req.body.rank;
    }
    if (req.body.score != null) {
        (<any>res).user.score = req.body.score;
    }
    if (req.body.followedTopics != null) {
        (<any>res).user.followedTopics = req.body.followedTopics;
    }
    if (req.body.followedUsers != null) {
        (<any>res).user.followedUsers = req.body.followedUsers;
    }
    if (req.body.achievements != null) {
        (<any>res).user.achievements = req.body.achievements;
    }

    try {
        const updatedUser = await (<any>res).user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// delete user
usersRouter.delete('/:id', getUser, async (req: Request, res: Response) => {
    try {
        await (<any>res).user.remove(function (err) {
            if (err) throw err;
            /* Document unindexing in the background */
            UserModel.on('es-removed', function (err, res) {
                if (err) throw err;
                /* Docuemnt is unindexed */
            });
        });
        res.json({ message: 'User has been successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// create new user
// usersRouter.post('/', async (req: Request, res: Response) => {
//     const hashedPass: string = await bcrypt.hash(req.body.password, 10);

//     const user = new UserModel({
//         name: req.body.name,
//         email: req.body.email,
//         password: hashedPass,

//     });
//     try {
//         const newUser = await user.save(function (err) {
//             if (err) throw err;
//             /* Document indexation on going */
//             UserModel.on('es-indexed', function (err, res) {
//                 if (err) throw err;
//                 /* Document is indexed */
//             });
//         });
//         res.status(201).json(newUser);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// login
// usersRouter.post('/login', async (req: Request, res: Response) => {
//     const user = await UserModel.findOne({ name: req.body.name }).exec();

//     if (user == null) {
//         return res.status(400).send('User does not exist.');
//     }
//     try {
//         if (await bcrypt.compare(req.body.password, (<any>user).password)) {
//             //res.json(user)
//             res.send('Login successful');
//         } else {
//             res.send('Wrong password.');
//         }
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
