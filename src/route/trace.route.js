const express = require("express");
const {
    trace,
    getuser
} = require("./../controller/trace.controller");

var traceing = express.Router()

traceing.get('/facebook', trace);
traceing.get('/trace', getuser);







module.exports = {
    traceing
}