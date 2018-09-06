import express from 'express';

import { requireLogin } from './../middleware/authentication.middleware';
import {
    getAllusers,
    getUserById,
    deleteUser,
    userProfileImage,
    onlineStatus,
    sendFriendRequest,
    acceptFriendRequest,
    firebasepushnotification
} from "./../controller/users.controller";

var users = express.Router()

users.get('/users', requireLogin, getAllusers);
users.post('/users/delete', requireLogin, deleteUser);
users.post('/users/uploadProfileIphoto', requireLogin, userProfileImage);
users.get('/users/status', requireLogin, onlineStatus);
users.get('/users/send-notification', requireLogin, firebasepushnotification);
users.get('/users/:id', requireLogin, getUserById);
users.post('/users/send-request', requireLogin, sendFriendRequest);
users.post('/users/accept-request', requireLogin, acceptFriendRequest);





module.exports = {
    users
}