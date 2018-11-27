const express = require('express');

const {
    requireLogin
} = require('./../middleware/authentication.middleware');
const {
    getAllusers,
    getUserById,
    deleteUser,
    userProfileImage,
    onlineStatus,
    firebasepushnotification
} = require("./../controller/users.controller");
const {
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getContactList
} = require("./../controller/userContact.controller");
const {
    getConversation
} = require("./../controller/chats.controller");
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
users.get('/users/contacts', requireLogin, getContactList);
users.get('/users/chats/:room', requireLogin, getConversation);
users.get('/users/:id', requireLogin, getUserById);






module.exports = {
    users
}