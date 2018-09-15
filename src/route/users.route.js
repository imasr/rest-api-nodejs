import express from 'express';

import {
    requireLogin
} from './../middleware/authentication.middleware';
import {
    getAllusers,
    getUserById,
    deleteUser,
    userProfileImage,
    onlineStatus,
    firebasepushnotification
} from "./../controller/users.controller";
import {
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest
} from "./../controller/userContact.controller";

var users = express.Router()

users.get('/users', requireLogin, getAllusers);
users.post('/users/delete', requireLogin, deleteUser);
users.post('/users/uploadProfileIphoto', requireLogin, userProfileImage);
users.get('/users/status', requireLogin, onlineStatus);
users.get('/users/send-notification', requireLogin, firebasepushnotification);
users.post('/users/send-request', requireLogin, sendFriendRequest);
users.post('/users/cancel-request', requireLogin, cancelFriendRequest);
users.post('/users/accept-request', requireLogin, acceptFriendRequest);
users.post('/users/reject-request', requireLogin, rejectFriendRequest);
users.get('/users/:id', requireLogin, getUserById);






module.exports = {
    users
}