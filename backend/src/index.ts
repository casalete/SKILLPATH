require('dotenv').config();
import express, { Application, NextFunction, Request, Response } from 'express';
import { router } from './routes/routes';
import connectToDatabase from './config/db-connect';
import { handleErrors } from './middleware/handleErrors';
import path from 'path';

const passport = require('passport');

const cors = require('cors');

const app: Application = express();

require('./config/passport')(passport);

app.use(passport.initialize());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join('backend/images')));

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
});

let whitelist = ['http://localhost:4200', 'http://localhost:8080'];
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (whitelist.indexOf(origin) === -1) {
                let message = `The CORS policy for this origin doesn't allow access from the particular origin.`;
                return callback(new Error(message), false);
            }
            return callback(null, true);
        },
    }),
);
connectToDatabase();

app.use('/api/v1', router);

app.use(handleErrors);

app.listen(process.env.PORT, () => {
    console.log(`cors enabled-server listening on: ${process.env.PORT}`);
});
