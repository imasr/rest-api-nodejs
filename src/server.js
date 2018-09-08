import './environment/environment';
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import validator from 'express-validator';
import path from 'path';

import {
    auth
} from "./route/authentication.route";
import {
    users
} from "./route/users.route";
import {
    lastSeenCheck
} from "./utility/cron";

const port = process.env.PORT

var app = express();
app.use(bodyParser.json())
app.use(cors())
app.use(validator())

lastSeenCheck();

app.use(express.static(path.join(__dirname, '/public')))
app.use((req, res, next) => {
    if (req.body.email) {
        req.checkBody("email", "Enter a valid email address.").isEmail();
        var errors = req.validationErrors();
        if (errors) {
            return res.send(errors);
        }
    }
    next()
})

app.use('/', auth, users)

app.listen(port, () => {
    console.log(`Server started at ${port}`);
})