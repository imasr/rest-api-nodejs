import { ObjectID } from "mongodb";

import { UserModel } from "../model/authentication.model";
import messageConfig from './../config/message.json';
import { errorHandler, pickResponse } from "./../helper/error.handler";
import { upload } from "./../services/fileupload.service";
import * as _ from 'lodash';

const getAllusers = (req, res) => {
    UserModel.find().then(users => {
        if (!users) {
            return res.status(400).send(errorHandler('Data not found'))
        } else {
            res.send(pickResponse(users, messageConfig.success))
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
        res.json(pickResponse(user, messageConfig.success))
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
                res.send(pickResponse(`${deletedUser.username} deleted Sucessfully`, messageConfig.success))
            }).catch(err => {
                res.status(400).send(err)
            })
        }
    }
}

const updateUserProfile = (req, res) => {
    upload(req, res)
        .then(body => {
            console.log(body.file)
            if (body.file) {
                let newBody = {
                    image: `${body.file.destination}/${body.file.filename}`
                }
                return UserModel.findByIdAndUpdate(req.user_id, { $set: newBody }, { new: true })
                    .then(updatedUser => {
                        return res.json(pickResponse(updatedUser, messageConfig.success))
                    })
            }
        })
        .catch(error => {
            return res.status(400).send(error)
        })
}


module.exports = {
    getAllusers,
    getUserById,
    deleteUser,
    updateUserProfile
}