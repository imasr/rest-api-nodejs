const mongoose = require("mongoose");

var chatSchema = mongoose.Schema({
  username: {
    type: String
  },
  room: {
    type: String
  },
  messages: {
    type: [mongoose.Schema({
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
      }
    }, { _id: false, })]
  }

}, {
    timestamps: true,
    versionKey: false,
  })



var Chats = mongoose.model('Chats', chatSchema);

module.exports = {
  Chats
}