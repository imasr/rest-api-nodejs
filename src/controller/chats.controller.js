
const { Chats } = require("../model/chats.model");


const getConversation = (req, res) => {
  let room = req.params.room
  Chats.find({ room: room }).then(result => {
    res.send(result);
  })
    .catch(function (err) {
      res.status(400).send(err);
    });
}

const saveConversation = (data) => {
  return Chats.findOneAndUpdate({ room: data.room }, { $push: { messages: { timestamp: data.timestamp, message: data.message, senderId: data.senderId } } }, { new: true })
    .then(res => {
      if (!res) {
        return false;
      }
    })
}


module.exports = {
  saveConversation,
  getConversation
}