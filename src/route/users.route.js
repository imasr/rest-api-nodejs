import express from 'express';

import { requireLogin } from './../middleware/authentication.middleware';
import {
    getAllusers,
    getUserById,
    deleteUser,
    userProfileImage,
    onlineStatus,
    firebasepushnotification
} from "./../controller/users.controller";

var users = express.Router()

users.get('/users', requireLogin, getAllusers);
users.post('/users/delete', requireLogin, deleteUser);
users.post('/users/uploadProfileIphoto', requireLogin, userProfileImage);
users.get('/users/status', requireLogin, onlineStatus);
users.get('/users/send-notification', requireLogin, firebasepushnotification);
users.get('/users/:id', requireLogin, getUserById);




module.exports = {
    users
}