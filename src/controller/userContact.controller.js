import { UserContact } from "../model/userContact.model"
import { User } from "../model/authentication.model"
import { responseHandler, errorHandler } from "./../helper/error.handler";
import contactConfig from "../config/contact.json";

const sendFriendRequest = (req, res) => {
    let user_id = req.user_id
    let contactId = req.body.contactId
    let contactRequest = req.body
    User.findById(contactId).then(contactValid => {
        if (!contactValid) {
            throw errorHandler(contactConfig.contactNotExist)
        } if (user_id == contactId) {
            throw errorHandler(contactConfig.sameIdRequest)
        } else {
            return addContact(contactRequest, user_id).then(response => {
                if (!response)
                    throw contactConfig.operationFailed
                return res.send({
                    result: response,
                    status: 1
                })
            })

        }
    }).catch(error => {
        if (error.name == 'CastError')
            return res.status(400).send(errorHandler(contactConfig.invalidUserId));
        res.status(400).send(error)
    });
}

const addContact = (contactRequest, user_id) => {
    return UserContact.findById(user_id).then(userContacts => {
        if (!userContacts) {
            userContacts = new UserContact({
                user_id: user_id,
                contact: [contactRequest]
            })
        } else {
            if (userContacts.contact.find(value => value.contactId == contactRequest.contactId)) {
                throw errorHandler(contactConfig.requestAlreadySent)
            } else {
                userContacts.contact.push(contactRequest)
            }
        }
        return userContacts.save().then(res => {
            return contactRequest;
        })
    })

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