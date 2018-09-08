import {
    UserContact,
    ContactRequestStatus
} from "../model/userContact.model"
import {
    User
} from "../model/authentication.model"
import {
    responseHandler,
    errorHandler
} from "./../helper/error.handler";
import contactConfig from "../config/contact.json";
import * as _ from 'lodash'

const sendFriendRequest = (req, res) => {
    let user_id = req.user_id
    let user = _.pick(req.user, ['email', 'username']);
    let contact_id = req.body.contact_id
    let contactRequest = req.body
    User.findById(contact_id).then(contactValid => {
        if (!contactValid) {
            throw errorHandler(contactConfig.contactNotExist)
        }
        if (user_id == contact_id) {
            throw errorHandler(contactConfig.sameIdRequest)
        } else {
            return addContact(contactRequest, user_id, contact_id, ContactRequestStatus[0]).then(response => {
                if (!response)
                    throw contactConfig.operationFailed
                return addContact(user, contact_id, user_id, ContactRequestStatus[1]).then(resp => {
                    if (!resp)
                        throw contactConfig.operationFailed
                    return res.send({
                        result: responseHandler(contactConfig.requestSent),
                        status: 1
                    })
                })
            })
        }
    }).catch(error => {
        if (error.name == 'CastError')
            return res.status(400).send(errorHandler(contactConfig.invalidUserId));
        res.status(400).send(error)
    });
}

const addContact = (contactRequest, user_id, contact_id, status) => {
    contactRequest['requestStatus'] = status
    contactRequest['contact_id'] = contact_id
    return UserContact.findById(user_id).then(userContacts => {
        if (!userContacts) {
            userContacts = new UserContact({
                _id: user_id,
                contact: [contactRequest]
            })
        } else {
            if (userContacts.contact.find(value => value.contact_id == contactRequest.contact_id)) {
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