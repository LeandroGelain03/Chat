const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server);
const Axios = require('axios');
var cors = require('cors');
app.use(cors());

const messagesRouter = require('./src/routes/messageRoutes')
const chatController = require('./src/controllers/chatController')
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/message/', messagesRouter);

io.on("connection", socket => {
    console.log(`socket: ${socket.id}`);
    socket.on("sendMessage", data => {
        chatController.storeMessage(data)
        socket.emit('receivedMessage', data);
        socket.broadcast.emit('receivedMessage', data);
    });
})

app.use(morgan('dev'));

mongoose.connect(`mongodb+srv://LeandroGelain03:M.a.159730@chat-zip9p.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use((req, res, next) => {
    const error = new Error("Route not found (404)");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: error.message
    });
});

server.listen(3333)