const { ObjectID } = require("mongodb");
const _ = require('lodash')
const axios = require("axios");

const messageConfig = require('./../config/message.json');
const { User } = require("../model/user.model");
const { upload } = require("./../services/fileupload.service");
const { setOnlineStatus } = require("./../services/onlineStatus.services");
const { errorHandler, responseHandler } = require("./../helper/error.handler");
const { pickUserResponse } = require("../helper/response.handler");
const { filterUser } = require("../helper/filter");

const getAllusers = (req, res) => {
    User.find({ "isActive": true, }, {
        password: 0,
        deviceToken: 0,
        resetToken: 0,
    }).then(users => {
        if (!users) {
            throw errorHandler(messageConfig.userNotFound)
        } else {
            return filterUser(users, req).then(result => {
                res.send({
                    result: result,
                    status: 1,
                    message: messageConfig.success
                })
            })
        }
    }).catch(error => {
        error.status = 0
        res.status(400).send(error)
    })
}

const getUserById = (req, res) => {
    var id = req.params.id
    if (req.params.id && !ObjectID.isValid(id)) {
        return res.status(400).send(errorHandler(messageConfig.invalidUserId))
    }
    User.findById(id).then(user => {
        if (!user) {
            throw errorHandler(messageConfig.userNotFound)
        } else {
            res.send({
                result: pickUserResponse(user),
                status: 1,
                message: messageConfig.success
            })
        }
    }).catch(e => {
        res.status(400).send(e)
    })
}

const deleteUser = (req, res) => {
    if (req.body.role !== 'Admin') {
        return res.status(400).send(errorHandler(messageConfig.unauthorisedRequest))
    } else {
        if (!ObjectID.isValid(req.body.id)) {
            return res.status(400).send(errorHandler(messageConfig.invalidUserId))
        } else {
            User.findByIdAndUpdate(req.body.id,
                { $set: { isActive: false } },
                { new: true })
                .then(deletedUser => {
                    res.send(responseHandler(`${deletedUser.username} deleted Sucessfully`, messageConfig.success))
                }).catch(err => {
                    res.status(400).send(err)
                })
        }
    }
}

const userProfileImage = (req, res) => {
    upload(req, res)
        .then(body => {
            if (body.file) {
                let newBody = {
                    image: `images/${body.file.filename}`
                }
                return User.findByIdAndUpdate(req.user_id, {
                    $set: newBody
                }, {
                        new: true
                    })
                    .then(updatedUser => {
                        return res.send({
                            result: pickUserResponse(updatedUser),
                            status: 1,
                            message: messageConfig.success
                        })
                    })
            }
        })
        .catch(error => {
            return res.status(400).send(error)
        })
}

const onlineStatus = (req, res) => {
    return setOnlineStatus(req)
        .then(response => {
            res.send(response);
        })
        .catch(e => {
            res.status(400).send(e);
        });
};

const saveDeviceTokenFirebase = (user, newDeviceToken) => {
    var savedDeviceToken = user.deviceToken
    if (savedDeviceToken.length === 0) {
        savedDeviceToken.push(newDeviceToken)
        User.findByIdAndUpdate(user._id, {
            $set: {
                "deviceToken": savedDeviceToken,
            }
        }, {
                new: true
            }).then(res => { })
    } else {
        if (!savedDeviceToken.includes(newDeviceToken)) {
            savedDeviceToken.push(newDeviceToken);
            User.findByIdAndUpdate(user._id, {
                $set: {
                    "deviceToken": savedDeviceToken
                }
            }, {
                    new: true
                }).then(res => { })
        }
    }
};

const firebasepushnotification = (data) => {
    return User.findById(data.receiverId).then(user => {
        if (!user) {
            throw errorHandler(messageConfig.userNotFound)
        } else {
            var headers = {
                "Content-Type": "application/json",
                Authorization: process.env.FCMkey
            }
            user.deviceToken.map((token, index) => {
                axios.post(process.env.FCMUrl, {
                    "notification": {
                        "title": data.senderName,
                        "body": data.message,
                        "icon": process.env.FCMicon
                    },
                    "to": token
                }, {
                        headers: headers
                    }).then(response => { })
            })
        }
    })
}



module.exports = {
    getAllusers,
    getUserById,
    deleteUser,
    userProfileImage,
    onlineStatus,
    firebasepushnotification,
    saveDeviceTokenFirebase
}