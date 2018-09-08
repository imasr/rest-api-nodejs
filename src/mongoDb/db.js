import mongoose from "mongoose";
import './../environment/environment';

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
})
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