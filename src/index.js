require('./config/config');
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import validator from 'express-validator';

import { auth } from "./route/authentication.route";
import { users } from "./route/users.route";

const port = normalizePort(process.env.PORT || '8081')

var app = express();
app.use(bodyParser.json())
app.use(cors())
app.use(validator())
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