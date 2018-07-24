import mongoose from "mongoose";

import config from "./../config.json";

mongoose.connect(config.mongodb_port)
var db = mongoose.connection;
db.on('error', (res) => {
    console.error('connection error', res)
})
db.once('open', () => {
    console.error('mongo connection successfull')
})

module.exports = {
    mongoose
};