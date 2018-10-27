require('./environment/environment');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const path = require("path");
const socket = require("socket.io");

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

// const chatStore = (message, timeStamp) => {
//     let storeData = {
//         chatMessage: message,
//         timeStamp: timeStamp
//     }
//     db.collection('chatroom-chats').save(storeData, (err, result) => {
//         if (err) {
//             return console.log(err);
//         }
//         console.log('saved to database');
//     })
// }
let io = socket(server)
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('new-message', message => {
        io.emit('new-message', message);
    })
})