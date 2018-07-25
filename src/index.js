import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import validator from 'express-validator';

import config from "./config.json";
import { auth } from "./route/authentication.route";
import { users } from "./route/users.route";

var app = express();
app.use(bodyParser.json())
app.use(cors())
app.use(validator())
app.use((req, res, next) => {
    console.log(app.locals)
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

app.listen(process.env.PORT || config.server_port, () => {
    console.log(`Server started at ${config.server_port}`);
})