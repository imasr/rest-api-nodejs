import mongoose from "mongoose";

const contactRequestStatus = Object.freeze({
    0: 'received',
    1: 'sent',
    2: 'blocked'
})

var ContactSchema = mongoose.Schema({
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    email: {
        type: String
    },
    userName: {
        type: String
    },
    requestSatus: {
        type: String,
        required: true,
        enum: Object.values(contactRequestStatus),
    }
}, { _id: false, versionKey: false, })

var UserContactSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    contact: [ContactSchema]
}, { _id: false, versionKey: false })

var UserContact = mongoose.model('UserContact', UserContactSchema);

module.exports = {
    UserContact,
}