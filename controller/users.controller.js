import {
    UserModel
} from "../model/authentication.model";

var getAllusers = (req, res) => {
    UserModel.find().then(user => {
        if (!user) {
            res.status(400).send({
                message: "Data Not found"
            })
        } else {
            res.json(user)
        }
    }).catch(error => {
        res.status(400).send(error)
    })
}


module.exports = {
    getAllusers
}