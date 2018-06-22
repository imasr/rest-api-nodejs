import express from "express";
import bodyParser from 'body-parser';

import { server_port } from "./config/config";
import { mongoose } from "./mongoDb/db";
import { route } from "./route/user.route";

var app = express();
app.use(bodyParser.json())

app.use('/user', route)

app.listen(server_port,()=>{
    console.log(`Server started at ${server_port}`);
})