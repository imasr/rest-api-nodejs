import { ObjectID } from "mongodb";
import * as _ from 'lodash';
import axios from "axios";

import "./../config/config";
import messageConfig from './../config/message.json';
import { UserModel } from "../model/authentication.model";
import { upload } from "./../services/fileupload.service";
import { setOnlineStatus } from "./../services/onlineStatus.services";
import { errorHandler, responseHandler } from "./../helper/error.handler";
import { pickUserResponse } from "../helper/response.handler";

const getAllusers = (req, res) => {
    UserModel.find({}, {
        password: 0,
        deviceToken: 0,
        resetToken: 0
    }).then(users => {
        if (!users) {
            throw errorHandler(messageConfig.userNotFound)
        } else {
            res.send({
                result: users,
                status: 1,
                message: messageConfig.success
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
    UserModel.findById(id).then(user => {
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
            UserModel.findByIdAndRemove(req.body.id).then(deletedUser => {
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
                return UserModel.findByIdAndUpdate(req.user_id, { $set: newBody }, { new: true })
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
        UserModel.findByIdAndUpdate(user._id, {
            $set: {
                "deviceToken": savedDeviceToken,
            }
        }, { new: true }).then(res => { })
    } else {
        if (!savedDeviceToken.includes(newDeviceToken)) {
            savedDeviceToken.push(newDeviceToken);
            UserModel.findByIdAndUpdate(user._id, {
                $set: {
                    "deviceToken": savedDeviceToken
                }
            }, { new: true }).then(res => { })
        }
    }
};

const firebasepushnotification = (req, res) => {
    let id = req.user_id
    UserModel.findById(id).then(user => {
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
                        "title": process.env.FCMtitle,
                        "body": process.env.FCMbody,
                        "icon": process.env.FCMicon,
                        "click_action": "login"
                    },
                    "to": token
                }, { headers: headers }).then(response => { })
            })
            res.send({ "success": true })
        }
    }).catch(error => {
        res.status(400).send(error)
    });
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