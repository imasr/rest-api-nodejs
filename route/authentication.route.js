import express from 'express';
import {
    register,
    login
} from "./../controller/authentication.controller";
var auth = express.Router()

auth.use((req, res, next) => {
    next()
})
auth.post('/register', register);
auth.post('/login', login);

module.exports = {
    auth
}