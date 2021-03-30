require('dotenv').config();
import express from 'express';
import {router} from './routes/routes';
import passport from 'passport';
import connectToDatabase from './db-connect';

require('./auth/auth');
const bodyParser = require('body-parser');
const cors = require('cors');

export const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

app.use('/api/v1', router);

connectToDatabase();

app.use(function (req, res, next) {
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

let whitelist = ['http://localhost:4200'];
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
    })
);

app.listen(process.env.PORT, () => {
    console.log(`cors enabled-server listening on: ${process.env.PORT}`);
});

