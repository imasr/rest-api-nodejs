import mongoose from "mongoose";
import './../config/config';

mongoose.connect(process.env.MONGODB_URI)
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