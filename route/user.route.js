import express from 'express';
import { register } from "./../controller/user.controller";
var route = express.Router()

route.use((req, res, next)=>{
    console.log('Time: ', new Date())
    next()
})
route.post('/register', register)

module.exports={
    route
}