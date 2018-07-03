import express from "express";
import cors from "cors";
import bodyParser from 'body-parser';

import {
    server_port
} from "./config/config";
import {
    mongoose
} from "./mongoDb/db";
import {
    auth
} from "./route/authentication.route";
import {
    users
} from "./route/users.route";

var app = express();
app.use(bodyParser.json())
app.use(cors())

app.use('/', auth)
app.use('/', users)

app.listen(server_port, () => {
    console.log(`Server started at ${server_port}`);
})