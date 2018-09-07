import { UserContact } from "../model/userContact.model"
import { User } from "../model/authentication.model"
import { responseHandler, errorHandler } from "./../helper/error.handler";
import contactConfig from "../config/contact.json";




const sendFriendRequest = (req, res) => {
    let id = req.user_id
    let contactId = req.body.contactId
    let contact = req.body
    User.findById(contactId).then(user => {
        if (!user) {
            throw errorHandler(contactConfig.contactNotExist)
        } else {
            return res.send({
                result: user,
                status: 1
            })
        }
    }).catch(error => {
        if (error.name == 'CastError')
            return res.status(400).send(errorHandler(contactConfig.invalidUserId));
        res.status(400).send(error)
    });

}

const acceptFriendRequest = (req, res) => {

}

const rejectFriendRequest = (req, res) => {

}

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest
}