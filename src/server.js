import './environment/environment';
import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';
import validator from 'express-validator';
import path from 'path';
import socket from 'socket.io'

import {
    auth
} from "./route/authentication.route";
import {
    users
} from "./route/users.route";
import {
    traceing
} from "./route/trace.route";
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


app.use('/', traceing, auth, users)

let server = app.listen(port, () => {
    console.log(`Server started at ${port}`);
})

let io = socket(server)
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('new-message', message => {
        io.emit('new-message', message);
    })
})