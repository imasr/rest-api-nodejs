
const { Chats } = require("../model/chats.model");
const { firebasepushnotification } = require('./users.controller')

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
  return Chats.findOneAndUpdate({ room: data.room }, {
    $push: {
      messages: {
        timestamp: data.timestamp,
        message: data.message,
        senderId: data.senderId,
        receiverId: data.receiverId
      }
    }
  }, { new: true })
    .then(res => {
      if (!res) {
        return false;
      }
      firebasepushnotification(data).then(res => {
        console.log("kkkkk", res)
      }).catch(err => {
        console.log(err);
      })
    })
}


module.exports = {
  saveConversation,
  getConversation
}