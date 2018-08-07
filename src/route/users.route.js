import express from 'express';

import { requireLogin } from './../middleware/authentication.middleware';
import { getAllusers, getUserById, deleteUser, updateUserProfile } from "./../controller/users.controller";

var users = express.Router()
users.use((req, res, next) => {

    next()
})
users.get('/users', requireLogin, getAllusers);
users.get('/users/:id', requireLogin, getUserById);
users.post('/users/delete', requireLogin, deleteUser);
users.post('/users/updateprofile', requireLogin, updateUserProfile);

module.exports = {
    users
}