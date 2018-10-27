const express = require("express");
const {
    trace,
    getuser
} = require("./../controller/trace.controller");

var traceing = express.Router()

traceing.get('/facebook', getuser);
traceing.post('/trace', trace);



module.exports = {
    traceing
}