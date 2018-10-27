const express = require("express");
const {
    register,
    login,
    sociallogin,
    forget,
    reset
} = require("./../controller/authentication.controller");

var auth = express.Router()

auth.use((req, res, next) => {
    next()
})
auth.post('/register', register);
auth.post('/login', login);
auth.post('/sociallogin', sociallogin);
auth.post('/forget', forget);
auth.post('/reset', reset);

module.exports = {
    auth
}