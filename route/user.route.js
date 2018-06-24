import express from 'express';
import { register, login } from "./../controller/user.controller";
var user = express.Router()

user.use((req, res, next)=>{
    next()
})
user.post('/register', register);
user.post('/login', login);

module.exports={
    user
}