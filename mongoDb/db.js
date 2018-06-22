import mongoose from "mongoose";

import { mongodb_port } from "./../config/config";

mongoose.connect(mongodb_port)
var db=mongoose.connection;
db.on('error',()=>{
    console.error( 'connection error')
})
db.once('open', ()=>{
    console.error('mongo connection successfull')
})

module.exports= {
    mongoose
};