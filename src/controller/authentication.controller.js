import './../config/config';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as _ from "lodash";
import { mailer } from "./../services/mailer.services";
import { decryptFunc, encryptFunc } from "./../services/crypto.services";
import { User } from "../model/authentication.model";
import messageConfig from './../config/message.json'
import { responseHandler, errorHandler } from "./../helper/error.handler";
import { pickLoginResponse, pickUserResponse } from "./../helper/response.handler";

import { generateToken } from './../helper/generate.token';

import { saveDeviceTokenFirebase } from "./users.controller";

//registration controller
var register = (req, res) => {
    if (!req.body.username) {
        res.status(400).send(errorHandler(messageConfig.userNameRequired))
    } else if (!req.body.email) {
        res.status(400).send(errorHandler(messageConfig.emailRequired))
    } else if (!req.body.password) {
        res.status(400).send(errorHandler(messageConfig.passwordRequired))
    } else {
        User.findOne({
            email: req.body.email
        }).then(user => {
            if (user) {
                throw errorHandler(messageConfig.duplicateEmail)
            } else {
                let test = new User(req.body);
                return test.save().then(response => {
                    res.send({
                        result: pickUserResponse(response),
                        status: 1,
                        message: messageConfig.userRegistered
                    })
                })
            }
        }).catch(e => {
            e.status = 0
            res.status(400).send(e)
        })
    }
}

//login controller
var login = (req, res) => {
    if (!req.body.email) {
        res.status(400).send(errorHandler(messageConfig.emailRequired))
    } else if (!req.body.password) {
        res.status(400).send(errorHandler(messageConfig.passwordRequired))
    } else {
        return User.findOne({
            email: req.body.email,
        }).then(user => {
            if (!user) {
                throw errorHandler(messageConfig.userNotFound)
            } else {
                if (req.body['deviceToken']) {
                    saveDeviceTokenFirebase(user, req.body['deviceToken'])
                }
                return bcrypt.compare(req.body.password, user.password).then(response => {
                    if (response) {
                        return generateToken(user).then(userWithToken => {
                            res.send({
                                result: pickLoginResponse(userWithToken),
                                status: 1,
                                message: messageConfig.success
                            })
                        })
                    } else {
                        throw errorHandler(messageConfig.incorrectPassword)
                    }
                })
            }
        }).catch(e => {
            e.status = 0
            res.status(400).send(e)
        })
    }
}

//social login controller
var sociallogin = (req, res) => {
    User.findOne({
        email: req.body.email,
    }).then(user => {
        if (user) {
            if (req.body['deviceToken']) {
                saveDeviceTokenFirebase(user, req.body['deviceToken'])
            }
            var body = _.pick(req.body, ["username", "email", "gender", "image_url", "birthday", "fb_id", "google_id"])
            return User.findByIdAndUpdate(user._id, { $set: body }, { new: true })
                .then(socialLoginUser => {
                    return generateToken(socialLoginUser).then(userWithToken => {
                        res.send({
                            result: pickLoginResponse(userWithToken),
                            status: 1,
                            message: messageConfig.success
                        })
                    })
                })
        } else {
            let test = new User(req.body)
            return test.save().then(socialLoginUser => {
                if (req.body['deviceToken']) {
                    saveDeviceTokenFirebase(socialLoginUser, req.body['deviceToken'])
                }
                return generateToken(socialLoginUser).then(userWithToken => {
                    res.send({
                        result: pickLoginResponse(userWithToken),
                        status: 1,
                        message: messageConfig.success
                    })
                })
            })
        }
    }).catch(e => {
        e.status = 0
        res.status(400).send(e)
    })
}

let forget = (req, res) => {
    encryptFunc(Date.now()).then(encryptedId => {
        return User.findOneAndUpdate({
            email: req.body.email,
        }, { $set: { "resetToken": encryptedId } }, { new: true })
            .then(user => {
                if (!user) {
                    throw errorHandler(messageConfig.emailNotFound)
                }
                return mailer(user, encodeURIComponent(encryptedId), res).then(info => {
                    res.send({
                        status: 1,
                        message: messageConfig.resetPasswordRequest
                    })
                })
            })
    }).catch(err => {
        err.status = 0
        res.status(400).send(err)
    })
}

let reset = (req, res) => {
    let encryptedToken = decodeURIComponent(req.body.key)
    decryptFunc(encryptedToken).then(timestamp => {
        return User.findOneAndUpdate({
            resetToken: encryptedToken
        }, { $set: { "password": req.body.newPassword, "resetToken": null } }, { new: true })
            .then(updated => {
                if (!updated) {
                    return res.status(401).send({
                        message: messageConfig.expiredResetToken,
                        status: 0
                    })
                }
                res.send({
                    message: messageConfig.passwordResetSucess,
                    status: 1
                })
            })
    }).catch(error => {
        error.status = 0
        res.status(400).send(error)
    })
}


module.exports = {
    register,
    login,
    sociallogin,
    forget,
    reset
}