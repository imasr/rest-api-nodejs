
const _ = require('lodash')
const { UserContact, ContactRequestStatus } = require("../model/userContact.model")
const { User } = require("../model/user.model")
const { responseHandler, errorHandler } = require("./../helper/error.handler");
const contactConfig = require("../config/contact.json");

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

const cancelFriendRequest = (req, res) => {

}

const acceptFriendRequest = (req, res) => {

}

const rejectFriendRequest = (req, res) => {

}

const getContactList = (req, res) => {
    return UserContact.find({}).then(list => {
        if (!list) {
            throw errorHandler("contactConfig.requestAlreadySent")
        }
        res.send(list)

    })
}

module.exports = {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    getContactList
}