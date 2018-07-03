import express from 'express';
import {
    getAllusers
} from "./../controller/users.controller";
var users = express.Router()

users.use((req, res, next) => {
    next()
})
users.get('/users', getAllusers);

module.exports = {
    users
}