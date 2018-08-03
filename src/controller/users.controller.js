import {
    ObjectID
} from "mongodb";

import {
    UserModel
} from "../model/authentication.model";

var getAllusers = (req, res) => {
    UserModel.find().then(users => {
        if (!users) {
            res.status(400).send({
                message: "Data Not found",
                status: 0
            })
        } else {
            res.status(200).send(users)
        }
    }).catch(error => {
        error.status = 0
        res.status(400).send(error)
    })
}
const getUserById = (req, res) => {
    var id = req.params.id
    if (req.params.id && !ObjectID.isValid(id)) {
        return res.status(404).send({
            message: "id not found",
            status: 0
        })
    }
    UserModel.findById(id).then(user => {
        res.json({
            user
        })
    }).catch(e => {
        e.status = 0
        res.status(400).send(e)
    })
}

var deleteUser = (req, res) => {
    var id = req.body.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            message: "id not found",
            status: 0
        })
    }
    UserModel.findByIdAndRemove(id).then(deletedUser => {
        res.json(deletedUser)
    }).catch(err => {
        err.status = 0
        res.status(400).send(err)
    })

}


module.exports = {
    getAllusers,
    getUserById,
    deleteUser
}