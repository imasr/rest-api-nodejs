import {
    UserModel
} from "../model/authentication.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as _ from "lodash";
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
            message: "Email Required"
        })
    } else if (!req.body.password) {
        res.status(400).send({
            message: "Password Required"
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
                        }, config.secret_token)
                        res.status(200).json({
                            success: true,
                            user_id: user.user_id,
                            username: user.username,
                            token: token
                        })

                    } else {
                        res.status(403).send({
                            message: "Wrong password"
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
                }, config.secret_token)
                let resData = {
                    success: true,
                    user_id: fbUserData.user_id,
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
                }, config.secret_token)
                let resData = {
                    success: true,
                    user_id: fbUserData.user_id,
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


module.exports = {
    register,
    login,
    sociallogin
}