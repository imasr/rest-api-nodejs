import express from 'express';
import {
    getAllusers,
    getUserById,
    deleteUser
} from "./../controller/users.controller";

var users = express.Router()
users.use((req, res, next) => {

    next()
})
users.get('/users', getAllusers);
users.get('/users/:id', getUserById);
users.post('/users/delete', deleteUser);

module.exports = {
    users
}