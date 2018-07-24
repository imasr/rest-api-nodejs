import express from 'express';

import {
    requireLogin
} from './../middleware/authentication.middleware';
import {
    getAllusers,
    getUserById,
    deleteUser
} from "./../controller/users.controller";

var users = express.Router()
users.use((req, res, next) => {

    next()
})
users.get('/', requireLogin, getAllusers);
users.get('/:id', requireLogin, getUserById);
users.post('/delete', requireLogin, deleteUser);

module.exports = {
    users
}