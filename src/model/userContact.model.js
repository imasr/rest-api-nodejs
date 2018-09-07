import mongoose from "mongoose";

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
        required: true
    }
}, { versionKey: false })

var UserContactSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    contact: [ContactSchema]
}, { versionKey: false })

var UserContact = mongoose.model('UserContact', UserContactSchema);

module.exports = {
    UserContact
}