const mongoose = require("mongoose");


var messageSchema = mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  senderId: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,
    required: true
  },
  senderName: {
    type: String,
    required: true
  }
}, { _id: false, })

var chatSchema = mongoose.Schema({
  username: {
    type: String
  },
  room: {
    type: String
  },
  messages: [messageSchema]
}, {
    timestamps: true,
    versionKey: false,
  })



var Chats = mongoose.model('Chats', chatSchema);

module.exports = {
  Chats
}