import './../config/config';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as _ from "lodash";
import {
    mailer
} from "./../services/mailer.services";
import {
    decryptFunc,
    encryptFunc
} from "./../services/crypto.services";

import {
    UserModel
} from "../model/authentication.model";

//registration controller
var register = (req, res) => {
    if (!req.body.username) {
        res.status(400).send({
            message: "Username Required",
            status: 0
        })
    } else if (!req.body.email) {
        res.status(400).send({
            message: "Email Required",
            status: 0
        })
    } else if (!req.body.password) {
        res.status(400).send({
            message: "Password is Required",
            status: 0
        })
    } else {
        UserModel.findOne({
            email: req.body.email
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "User Already Exists",
                    status: 0
                })
            } else {
                let test = new UserModel(req.body);
                test.save().then(response => {
                    res.json({
                        message: 'User created successfully',
                        status: 1,
                        user_id: response.user_id,
                        username: response.username,
                        email: response.email,
                        password: response.password,
                    })
                }).catch(e => {
                    e.status = 0
                    res.status(400).send(e)
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
        res.status(400).send({
            message: "Email is Required",
            status: 0
        })
    } else if (!req.body.password) {
        res.status(400).send({
            message: "Password is Required",
            status: 0
        })
    } else {
        UserModel.findOne({
            email: req.body.email,
        }).then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password).then(response => {
                    if (response) {
                        var token = jwt.sign({
                            user_id: user._id
                        }, process.env.secret_token, {
                                expiresIn: 60 * 30
                            })
                        res.status(200).json({
                            success: true,
                            status: 1,
                            user_id: user._id,
                            username: user.username,
                            token: token
                        })

                    } else {
                        res.status(400).send({
                            message: "Password is incorrect",
                            status: 0
                        })
                    }
                }).catch(error => {
                    error.status = 0
                    res.status(400).send(error)
                });
            } else {
                res.status(400).send({
                    message: "User Not Found",
                    status: 0
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
    UserModel.findOne({
        email: req.body.email,
    }).then(user => {
        if (user) {
            var body = _.pick(req.body, ["username", "email", "gender", "image_url", "birthday", "fb_id", "google_id"])
            UserModel.findByIdAndUpdate(user._id, {
                $set: body
            }, {
                    new: true
                }).then(fbUserData => {
                    var token = jwt.sign({
                        user_id: fbUserData._id
                    }, process.env.secret_token, {
                            expiresIn: 60 * 30
                        })
                    let resData = {
                        success: true,
                        status: 1,
                        user_id: fbUserData._id,
                        username: fbUserData.username,
                        email: fbUserData.email,
                        token: token
                    }
                    if (fbUserData.fb_id) {
                        resData.fb_id = fbUserData.fb_id
                    }
                    if (fbUserData.google_id) {
                        resData.google_id = fbUserData.google_id
                    }
                    res.status(200).json(resData)
                }).catch(e => {
                    e.status = 0
                    res.status(400).send(e)
                })
        } else {
            let test = new UserModel(req.body)
            test.save().then(fbUserData => {
                var token = jwt.sign({
                    user_id: fbUserData._id
                }, process.env.secret_token, {
                        expiresIn: 60 * 30
                    })
                let resData = {
                    success: true,
                    status: 1,
                    user_id: fbUserData._id,
                    username: fbUserData.username,
                    email: fbUserData.email,
                    token: token
                }
                if (fbUserData.fb_id) {
                    resData.fb_id = fbUserData.fb_id
                }
                if (fbUserData.google_id) {
                    resData.google_id = fbUserData.google_id
                }
                res.status(200).json(resData)
            }).catch(e => {
                e.status = 0
                res.status(400).send(e)
            })
        }
    }).catch(e => {
        e.status = 0
        res.status(400).send(e)
    })
}

let forget = (req, res) => {
    encryptFunc(Date.now()).then(encryptedId => {
        UserModel.findOneAndUpdate({
            email: req.body.email,
        }, {
                $set: {
                    "resetToken": encryptedId
                }
            }, {
                new: true
            }).then(user => {
                if (!user) {
                    return res.status(400).send({
                        message: 'Email not found',
                        status: 0
                    })
                }
                mailer(user, encodeURIComponent(encryptedId), res).then(info => {
                    res.send({
                        message: "reset password link sent to your mail",
                        status: 1
                    })
                }).catch(err => {
                    err.status = 0
                    res.status(400).send(err)
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
        UserModel.findOneAndUpdate({
            resetToken: encryptedToken
        }, {
                $set: {
                    "password": req.body.newPassword,
                    "resetToken": null
                }
            }, {
                new: true
            }).then(updated => {
                if (!updated) {
                    return res.status(401).send({
                        message: "password link expired",
                        status: 0
                    })
                }
                res.send({
                    message: "Your password is reset successfully ",
                    status: 1
                })
            }).catch(errUpdate => {
                errUpdate.status = 0
                res.status(400).send(errUpdate)
            })
    })
}

module.exports = {
    register,
    login,
    sociallogin,
    forget,
    reset
}