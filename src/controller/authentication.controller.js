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
import config from "./../config.json";

//registration controller
var register = (req, res) => {
    if (!req.body.username) {
        res.status(400).send({
            message: "Username Required"
        })
    } else if (!req.body.email) {
        res.status(400).send({
            message: "Email Required"
        })
    } else if (!req.body.password) {
        res.status(400).send({
            message: "Password is Required"
        })
    } else {
        UserModel.findOne({
            email: req.body.email
        }).then(user => {
            if (user) {
                res.status(400).send({
                    message: "User Already Exists"
                })
            } else {
                let test = new UserModel(req.body);
                test.save().then(response => {
                    res.json({
                        success: 'User created successfully',
                        user_id: response.user_id,
                        username: response.username,
                        email: response.email,
                        password: response.password,
                    })
                }).catch(e => {
                    res.status(400).send(e)
                })
            }
        }).catch(e => {
            res.status(400).send(e)
        })
    }
}

//login controller
var login = (req, res) => {
    if (!req.body.email) {
        res.status(400).send({
            message: "Email is Required"
        })
    } else if (!req.body.password) {
        res.status(400).send({
            message: "Password is Required"
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
                        }, config.secret_token, {
                                expiresIn: 60 * 30
                            })
                        res.status(200).json({
                            success: true,
                            user_id: user._id,
                            username: user.username,
                            token: token
                        })

                    } else {
                        res.status(400).send({
                            message: "Password is incorrect"
                        })
                    }
                }).catch(error => {
                    res.status(400).send(error)
                });
            } else {
                res.status(400).send({
                    message: "User Not Found"
                })
            }
        }).catch(e => {
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
                    }, config.secret_token, {
                            expiresIn: 60 * 30
                        })
                    let resData = {
                        success: true,
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
                    res.status(400).send(e)
                })
        } else {
            let test = new UserModel(req.body)
            test.save().then(fbUserData => {
                var token = jwt.sign({
                    user_id: fbUserData._id
                }, config.secret_token, {
                        expiresIn: 60 * 30
                    })
                let resData = {
                    success: true,
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
                res.status(400).send(e)
            })
        }
    }).catch(e => {
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
                        message: 'Email not found'
                    })
                }
                mailer(user, encodeURIComponent(encryptedId), res).then(info => {
                    res.send({
                        message: "reset password link sent to your mail"
                    })
                }).catch(err => {
                    res.status(400).send(err)
                })
            })
    }).catch(err => {
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
                        error: "password link expired"
                    })
                }
                res.send({
                    message: "Your password is reset successfully "
                })
            }).catch(errUpdate => {
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