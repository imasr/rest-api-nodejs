import express from 'express';

import {
    trace,
    getuser
} from "./../controller/trace.controller";

var traceing = express.Router()

traceing.get('/facebook', trace);
traceing.get('/trace', getuser);







module.exports = {
    traceing
}