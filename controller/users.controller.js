import {
    UserModel
} from "../model/authentication.model";
import {
    ObjectID
} from "mongoDb";

var getAllusers = (req, res) => {
    UserModel.find().then(users => {
        if (!users) {
            res.status(400).send({
                message: "Data Not found"
            })
        } else {
            res.status(200).send(users)
        }
    }).catch(error => {
        res.status(400).send(error)
    })
}
const getUserById = (req, res) => {
    var id = req.params.id
    if (req.params.id && !ObjectID.isValid(id)) {
        return res.status(404).send({
            message: "id not found"
        })
    }
    UserModel.findById(id).then(user => {
        res.json({
            user
        })
    }).catch(e => {
        res.status(400).send(e)
    })
}

var deleteUser = (req, res) => {
    var id = req.body.id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send({
            message: "id not found"
        })
    }
    UserModel.findByIdAndRemove(id).then(deletedUser => {
        res.json(deletedUser)
    }).catch(err => {
        res.status(400).send(err)
    })

}


module.exports = {
    getAllusers,
    getUserById,
    deleteUser
}