require('./environment/environment');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const path = require("path");
const socket = require("socket.io");
const { Chats } = require("./model/chats.model")

const {
    auth
} = require("./route/authentication.route");
const {
    users
} = require("./route/users.route");
const {
    traceing
} = require("./route/trace.route");
const {
    lastSeenCheck
} = require("./utility/cron");
var fs = require('fs')
var https = require('https')
const port = process.env.PORT

var app = express();

app.use(bodyParser.json())
app.use(cors())
app.use(validator())

lastSeenCheck();
app.use(express.static(path.join(__dirname, '/public')))


app.use('/', traceing, auth, users)

let server = app.listen(port, () => {
    console.log(`Server started at ${port}`);
})
// let server=https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
//   }, app).listen(port, () => {
//     console.log(`Server started at ${port}`);
// })

const chatStore = (data) => {
    let newData = {
        message: message,
        username: username,
        room: room
    }
    let chats = new Chats(newData)
    chats.save(storeData, (err, result) => {
        if (err) {
            return console.log(err);
        }
        console.log('saved to database');
    })
}
let io = socket(server)
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('join', data => {
        socket.join(data.room);
        Chats.find({}).then(rooms => {
            count = 0;
            rooms.forEach((room) => {
                if (room.room == data.room) {
                    count++;
                }
            });
            // Create the chatRoom if not already created
            if (count == 0) {
                Chats.create({ username: data.username, room: data.room, messages: [] });
            }
        })
    });

    socket.on('new-message', data => {
        io.in(data.room).emit('new-message', data);
        Chats.findOneAndUpdate({ room: data.room }, { $push: { messages: { timestamp: data.timestamp, message: data.message } } }, (err, res) => {
            if (err) {
                console.log(err);
                return false;
            }
        });
    })
    socket.on('typing', data => {
        data['isTyping'] = true
        io.emit('typing', data);
    })
})