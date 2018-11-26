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
        type: Date
      },
      message: {
        type: String
      },
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