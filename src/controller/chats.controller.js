
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


module.exports = {
  getConversation
}